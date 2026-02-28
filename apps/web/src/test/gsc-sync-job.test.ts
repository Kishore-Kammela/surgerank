import { describe, expect, it } from "vitest";

import {
  createInitialGscSyncJobPayload,
  enqueueInitialGscSyncJob,
} from "@/lib/integrations/gsc/sync-job";

describe("gsc sync job scaffold", () => {
  it("creates initial payload with required fields", () => {
    const payload = createInitialGscSyncJobPayload({
      workspaceId: "workspace-1",
      propertyUri: "sc-domain:example.com",
      requestedBy: "user-1",
    });

    expect(payload.workspaceId).toBe("workspace-1");
    expect(payload.propertyUri).toBe("sc-domain:example.com");
    expect(payload.requestedBy).toBe("user-1");
    expect(payload.requestedAt).toBeInstanceOf(Date);
  });

  it("returns not_implemented until queue adapter is wired", async () => {
    const result = await enqueueInitialGscSyncJob(
      createInitialGscSyncJobPayload({
        workspaceId: "workspace-1",
        propertyUri: "sc-domain:example.com",
        requestedBy: "user-1",
      }),
    );
    expect(result).toEqual({ ok: false, reason: "not_implemented" });
  });
});
