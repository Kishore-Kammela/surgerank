export type ProjectSummary = {
  id: string;
  agencyId: string;
  workspaceId: string;
  name: string;
  domain: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProjectInput = {
  name: string;
  domain: string;
};

export type CreateProjectServiceResult =
  | { ok: true; project: ProjectSummary }
  | {
      ok: false;
      reason: "unauthenticated" | "no_active_workspace" | "forbidden" | "db_unavailable";
    };
