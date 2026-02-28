export type GscSyncJobPayload = {
  workspaceId: string;
  propertyUri: string;
  requestedBy: string;
  requestedAt: Date;
};

export const createInitialGscSyncJobPayload = (input: {
  workspaceId: string;
  propertyUri: string;
  requestedBy: string;
}): GscSyncJobPayload => {
  return {
    workspaceId: input.workspaceId,
    propertyUri: input.propertyUri,
    requestedBy: input.requestedBy,
    requestedAt: new Date(),
  };
};

export const enqueueInitialGscSyncJob = async (
  _payload: GscSyncJobPayload,
): Promise<{ ok: true; jobId: string } | { ok: false; reason: "not_implemented" }> => {
  // Week 6 Day 3 implements queue adapter + worker integration.
  return { ok: false, reason: "not_implemented" };
};
