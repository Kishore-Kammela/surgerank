import { randomUUID } from "node:crypto";

export type GscOauthStatePayload = {
  token: string;
  workspaceId: string;
  userId: string;
  issuedAtMs: number;
};

const toBase64Url = (value: string): string => Buffer.from(value, "utf8").toString("base64url");
const fromBase64Url = (value: string): string => Buffer.from(value, "base64url").toString("utf8");

export const createGscOauthStateToken = (): string => randomUUID();

export const createGscOauthContextCookieValue = (payload: GscOauthStatePayload): string => {
  const payloadJson = JSON.stringify(payload);
  return toBase64Url(payloadJson);
};

export const readGscOauthContextCookieValue = (
  cookieValue: string,
  maxAgeMs: number,
): GscOauthStatePayload | null => {
  let parsed: Partial<GscOauthStatePayload> | null = null;
  try {
    parsed = JSON.parse(fromBase64Url(cookieValue)) as Partial<GscOauthStatePayload>;
  } catch {
    return null;
  }

  if (
    !parsed?.token ||
    !parsed.workspaceId ||
    !parsed.userId ||
    typeof parsed.issuedAtMs !== "number"
  ) {
    return null;
  }

  if (Date.now() - parsed.issuedAtMs > maxAgeMs) {
    return null;
  }

  return {
    token: parsed.token,
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
