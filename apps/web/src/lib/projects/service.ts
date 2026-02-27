import type { AuthContext, WorkspaceMembership } from "@/lib/auth/types";
import { readWorkspaceBillingSubscription } from "@/lib/db/repositories/billing";
import {
  createWorkspaceProject,
  deleteWorkspaceProject,
  readWorkspaceProjectsPage,
  readWorkspaceProjects,
  updateWorkspaceProjectName,
} from "@/lib/db/repositories/projects";
import type {
  CreateProjectInput,
  CreateProjectServiceResult,
  ProjectMutationServiceResult,
  ProjectsPageResult,
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

const isActiveSubscriptionStatus = (status: string): boolean => {
  const normalized = status.trim().toLowerCase();
  return (
    normalized === "active" ||
    normalized === "trialing" ||
    normalized === "subscription.activated" ||
    normalized === "subscription.charged" ||
    normalized === "payment.captured"
  );
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

export const readActiveWorkspaceProjectsPage = async (
  auth: AuthContext,
  page: number,
  pageSize: number,
): Promise<ProjectsPageResult> => {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, Math.min(pageSize, 50));

  if (!auth.userId || !auth.activeAgencyId || !auth.activeWorkspaceId) {
    return {
      projects: [],
      totalCount: 0,
      page: safePage,
      pageSize: safePageSize,
      totalPages: 0,
    };
  }

  const result = await readWorkspaceProjectsPage(
    auth.activeAgencyId,
    auth.activeWorkspaceId,
    safePage,
    safePageSize,
  );

  if (!result) {
    return {
      projects: [],
      totalCount: 0,
      page: safePage,
      pageSize: safePageSize,
      totalPages: 0,
    };
  }

  const totalPages = result.totalCount === 0 ? 0 : Math.ceil(result.totalCount / safePageSize);
  return {
    projects: result.projects,
    totalCount: result.totalCount,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
  };
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

  // Plan enforcement baseline:
  // - first project can be created without a subscription
  // - additional projects require active subscription state
  const projectPage = await readWorkspaceProjectsPage(
    auth.activeAgencyId,
    auth.activeWorkspaceId,
    1,
    1,
  );
  if (!projectPage) {
    return { ok: false, reason: "db_unavailable" };
  }

  if (projectPage.totalCount >= 1) {
    const subscription = await readWorkspaceBillingSubscription(auth.activeWorkspaceId);
    if (subscription === "db_unavailable") {
      return { ok: false, reason: "db_unavailable" };
    }
    if (!subscription || !isActiveSubscriptionStatus(subscription.status)) {
      return { ok: false, reason: "plan_required" };
    }
  }

  const project = await createWorkspaceProject({
    agencyId: auth.activeAgencyId,
    workspaceId: auth.activeWorkspaceId,
    createdBy: auth.userId,
    name,
    domain,
  });

  if (project.status === "domain_conflict") {
    return { ok: false, reason: "domain_conflict" };
  }

  if (project.status === "db_unavailable") {
    return { ok: false, reason: "db_unavailable" };
  }

  return { ok: true, project: project.project };
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
