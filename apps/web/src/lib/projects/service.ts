import type { AuthContext, WorkspaceMembership } from "@/lib/auth/types";
import {
  createWorkspaceProject,
  deleteWorkspaceProject,
  readWorkspaceProjects,
  updateWorkspaceProjectName,
} from "@/lib/db/repositories/projects";
import type {
  CreateProjectInput,
  CreateProjectServiceResult,
  ProjectMutationServiceResult,
  ProjectSummary,
  UpdateProjectInput,
} from "@/lib/projects/types";

const canManageProjectRoles: Array<WorkspaceMembership["role"]> = ["owner", "admin"];
const DOMAIN_PATTERN = /^[a-z0-9.-]+\.[a-z]{2,}$/i;

const normalizeDomain = (domain: string): string => {
  const trimmed = domain.trim().toLowerCase();
  const withoutProtocol = trimmed.replace(/^https?:\/\//, "");
  return withoutProtocol.split("/")[0] ?? "";
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

export const updateProjectNameInActiveWorkspace = async (
  auth: AuthContext,
  input: UpdateProjectInput,
): Promise<ProjectMutationServiceResult> => {
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
  if (name.length < 2 || name.length > 80) {
    return { ok: false, reason: "invalid_input" };
  }

  const updated = await updateWorkspaceProjectName(
    auth.activeAgencyId,
    auth.activeWorkspaceId,
    input.projectId,
    name,
  );
  if (updated === null) {
    return { ok: false, reason: "db_unavailable" };
  }
  if (!updated) {
    return { ok: false, reason: "not_found" };
  }

  return { ok: true };
};

export const deleteProjectInActiveWorkspace = async (
  auth: AuthContext,
  projectId: string,
): Promise<ProjectMutationServiceResult> => {
  if (!auth.userId) {
    return { ok: false, reason: "unauthenticated" };
  }

  if (!auth.activeAgencyId || !auth.activeWorkspaceId) {
    return { ok: false, reason: "no_active_workspace" };
  }

  if (!canManageWorkspaceProjects(auth, auth.activeWorkspaceId)) {
    return { ok: false, reason: "forbidden" };
  }

  const deleted = await deleteWorkspaceProject(
    auth.activeAgencyId,
    auth.activeWorkspaceId,
    projectId,
  );
  if (deleted === null) {
    return { ok: false, reason: "db_unavailable" };
  }
  if (!deleted) {
    return { ok: false, reason: "not_found" };
  }

  return { ok: true };
};
