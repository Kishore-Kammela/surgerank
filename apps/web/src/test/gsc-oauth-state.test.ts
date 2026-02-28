import { describe, expect, it, vi } from "vitest";

import {
  buildGscCallbackUrl,
  createGscOauthContextCookieValue,
  createGscOauthStateToken,
  readGscOauthContextCookieValue,
} from "@/lib/integrations/gsc/oauth-state";

describe("gsc oauth state", () => {
  it("creates and reads oauth context cookie value", () => {
    const token = createGscOauthStateToken();
    const cookieValue = createGscOauthContextCookieValue({
      token,
      workspaceId: "workspace-1",
      userId: "user-1",
      issuedAtMs: Date.now(),
    });

    const parsed = readGscOauthContextCookieValue(cookieValue, 60_000);
    expect(parsed).toBeTruthy();
    expect(parsed?.token).toBe(token);
    expect(parsed?.workspaceId).toBe("workspace-1");
    expect(parsed?.userId).toBe("user-1");
  });

  it("rejects malformed cookie payload", () => {
    expect(readGscOauthContextCookieValue("invalid-base64", 60_000)).toBeNull();
  });

  it("rejects expired oauth context", () => {
    vi.useFakeTimers();
    const now = new Date("2026-02-28T00:00:00.000Z");
    vi.setSystemTime(now);

    const token = createGscOauthStateToken();
    const cookieValue = createGscOauthContextCookieValue({
      token,
      workspaceId: "workspace-1",
      userId: "user-1",
      issuedAtMs: Date.now() - 120_000,
    });

    expect(readGscOauthContextCookieValue(cookieValue, 60_000)).toBeNull();
    vi.useRealTimers();
  });

  it("builds callback URL with state", () => {
    const url = buildGscCallbackUrl("https://example.com", "abc123");
    expect(url).toBe("https://example.com/api/integrations/gsc/callback?gsc_state=abc123");
  });
});
