import { describe, expect, it, vi } from "vitest";

import {
  buildGscCallbackUrl,
  createSignedGscOauthState,
  verifySignedGscOauthState,
} from "@/lib/integrations/gsc/oauth-state";

describe("gsc oauth state", () => {
  it("creates and verifies a signed state token", () => {
    const secret = "secret";
    const token = createSignedGscOauthState(
      {
        workspaceId: "workspace-1",
        userId: "user-1",
        issuedAtMs: Date.now(),
      },
      secret,
    );

    const parsed = verifySignedGscOauthState(token, secret, 60_000);
    expect(parsed).toBeTruthy();
    expect(parsed?.workspaceId).toBe("workspace-1");
    expect(parsed?.userId).toBe("user-1");
  });

  it("rejects tampered token", () => {
    const secret = "secret";
    const token = createSignedGscOauthState(
      {
        workspaceId: "workspace-1",
        userId: "user-1",
        issuedAtMs: Date.now(),
      },
      secret,
    );

    const tampered = `${token}tampered`;
    expect(verifySignedGscOauthState(tampered, secret, 60_000)).toBeNull();
  });

  it("rejects expired token", () => {
    vi.useFakeTimers();
    const now = new Date("2026-02-28T00:00:00.000Z");
    vi.setSystemTime(now);

    const secret = "secret";
    const token = createSignedGscOauthState(
      {
        workspaceId: "workspace-1",
        userId: "user-1",
        issuedAtMs: Date.now() - 120_000,
      },
      secret,
    );

    expect(verifySignedGscOauthState(token, secret, 60_000)).toBeNull();
    vi.useRealTimers();
  });

  it("builds callback URL with state", () => {
    const url = buildGscCallbackUrl("https://example.com", "abc123");
    expect(url).toBe("https://example.com/api/integrations/gsc/callback?gsc_state=abc123");
  });
});
