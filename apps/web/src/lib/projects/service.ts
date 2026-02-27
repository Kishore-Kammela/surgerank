import type { AuthContext, WorkspaceMembership } from "@/lib/auth/types";
import { createWorkspaceProject, readWorkspaceProjects } from "@/lib/db/repositories/projects";
import type {
  CreateProjectInput,
  CreateProjectServiceResult,
  ProjectSummary,
} from "@/lib/projects/types";

const canManageProjectRoles: Array<WorkspaceMembership["role"]> = ["owner", "admin"];

export const canManageWorkspaceProjects = (auth: AuthContext, workspaceId: string): boolean => {
  return auth.workspaceMemberships.some(
    (membership) =>
      membership.workspaceId === workspaceId && canManageProjectRoles.includes(membership.role),
  );
};

export const readActiveWorkspaceProjects = async (auth: AuthContext): Promise<ProjectSummary[]> => {
  if (!auth.userId || !auth.activeAgencyId || !auth.activeWorkspaceId) {
    return [];
  }

  const rows = await readWorkspaceProjects(auth.activeAgencyId, auth.activeWorkspaceId, 20);
  return rows ?? [];
};

export const createProjectInActiveWorkspace = async (
  auth: AuthContext,
  input: CreateProjectInput,
): Promise<CreateProjectServiceResult> => {
  if (!auth.userId) {
    return { ok: false, reason: "unauthenticated" };
  }

  if (!auth.activeAgencyId || !auth.activeWorkspaceId) {
    return { ok: false, reason: "no_active_workspace" };
  }

  if (!canManageWorkspaceProjects(auth, auth.activeWorkspaceId)) {
    return { ok: false, reason: "forbidden" };
  }

  const project = await createWorkspaceProject({
    agencyId: auth.activeAgencyId,
    workspaceId: auth.activeWorkspaceId,
    createdBy: auth.userId,
    name: input.name,
    domain: input.domain,
  });

  if (!project) {
    return { ok: false, reason: "db_unavailable" };
  }

  return { ok: true, project };
};
