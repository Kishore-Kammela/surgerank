import type { AuthContext, WorkspaceMembership } from "@/lib/auth/types";
import { createWorkspaceProject, readWorkspaceProjects } from "@/lib/db/repositories/projects";
import type {
  CreateProjectInput,
  CreateProjectServiceResult,
  ProjectSummary,
} from "@/lib/projects/types";

const canManageProjectRoles: Array<WorkspaceMembership["role"]> = ["owner", "admin"];
const DOMAIN_PATTERN = /^[a-z0-9.-]+\.[a-z]{2,}$/i;

const normalizeDomain = (domain: string): string => {
  const trimmed = domain.trim().toLowerCase();
  const noProtocol = trimmed.replace(/^https?:\/\//, "");
  return noProtocol.split("/")[0] ?? "";
};

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

  const name = input.name.trim();
  const domain = normalizeDomain(input.domain);
  if (name.length < 2 || name.length > 80 || !DOMAIN_PATTERN.test(domain)) {
    return { ok: false, reason: "invalid_input" };
  }

  const project = await createWorkspaceProject({
    agencyId: auth.activeAgencyId,
    workspaceId: auth.activeWorkspaceId,
    createdBy: auth.userId,
    name,
    domain,
  });

  if (!project) {
    return { ok: false, reason: "db_unavailable" };
  }

  return { ok: true, project };
};
