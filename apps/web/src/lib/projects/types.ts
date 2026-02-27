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
      reason:
        | "unauthenticated"
        | "no_active_workspace"
        | "forbidden"
        | "invalid_input"
        | "domain_conflict"
        | "db_unavailable";
    };

export type UpdateProjectInput = {
  projectId: string;
  name: string;
};

export type ProjectMutationServiceResult =
  | { ok: true }
  | {
      ok: false;
      reason:
        | "unauthenticated"
        | "no_active_workspace"
        | "forbidden"
        | "invalid_input"
        | "not_found"
        | "db_unavailable";
    };

export type ProjectsPageResult = {
  projects: ProjectSummary[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
