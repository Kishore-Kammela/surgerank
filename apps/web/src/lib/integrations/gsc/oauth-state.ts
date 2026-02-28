import { createHmac, timingSafeEqual } from "node:crypto";

type GscOauthStatePayload = {
  workspaceId: string;
  userId: string;
  issuedAtMs: number;
};

const toBase64Url = (value: string): string => Buffer.from(value, "utf8").toString("base64url");
const fromBase64Url = (value: string): string => Buffer.from(value, "base64url").toString("utf8");

const signValue = (value: string, secret: string): string =>
  createHmac("sha256", secret).update(value).digest("base64url");

const safeEqual = (left: string, right: string): boolean => {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }
  return timingSafeEqual(leftBuffer, rightBuffer);
};

export const createSignedGscOauthState = (
  payload: GscOauthStatePayload,
  secret: string,
): string => {
  const payloadJson = JSON.stringify(payload);
  const payloadPart = toBase64Url(payloadJson);
  const signature = signValue(payloadPart, secret);
  return `${payloadPart}.${signature}`;
};

export const verifySignedGscOauthState = (
  token: string,
  secret: string,
  maxAgeMs: number,
): GscOauthStatePayload | null => {
  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }
  const payloadPart = parts[0] ?? "";
  const signaturePart = parts[1] ?? "";
  if (!payloadPart || !signaturePart) {
    return null;
  }

  const expectedSignature = signValue(payloadPart, secret);
  if (!safeEqual(expectedSignature, signaturePart)) {
    return null;
  }

  let parsed: Partial<GscOauthStatePayload> | null = null;
  try {
    parsed = JSON.parse(fromBase64Url(payloadPart)) as Partial<GscOauthStatePayload>;
  } catch {
    return null;
  }

  if (!parsed?.workspaceId || !parsed.userId || typeof parsed.issuedAtMs !== "number") {
    return null;
  }

  if (Date.now() - parsed.issuedAtMs > maxAgeMs) {
    return null;
  }

  return {
    workspaceId: parsed.workspaceId,
    userId: parsed.userId,
    issuedAtMs: parsed.issuedAtMs,
  };
};

export const buildGscCallbackUrl = (origin: string, stateToken: string): string => {
  const callbackUrl = new URL("/api/integrations/gsc/callback", origin);
  callbackUrl.searchParams.set("gsc_state", stateToken);
  return callbackUrl.toString();
};
