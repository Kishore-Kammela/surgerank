import { and, desc, eq, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { projects } from "@/lib/db/schema";
import type { ProjectSummary } from "@/lib/projects/types";

type InsertProjectParams = {
  agencyId: string;
  workspaceId: string;
  createdBy: string;
  name: string;
  domain: string;
};

export type CreateWorkspaceProjectResult =
  | { status: "created"; project: ProjectSummary }
  | { status: "domain_conflict" }
  | { status: "db_unavailable" };

const isProjectDomainConflict = (error: unknown): boolean => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = "code" in error ? String(error.code) : "";
  const constraint = "constraint" in error ? String(error.constraint) : "";
  return code === "23505" && constraint === "projects_workspace_id_domain_key";
};

const projectSelect = {
  id: projects.id,
  agencyId: projects.agencyId,
  workspaceId: projects.workspaceId,
  name: projects.name,
  domain: projects.domain,
  createdAt: projects.createdAt,
  updatedAt: projects.updatedAt,
};

export const readWorkspaceProjects = async (
  agencyId: string,
  workspaceId: string,
  limit = 20,
): Promise<ProjectSummary[] | null> => {
  const db = getDb();
  if (!db) {
    return null;
  }

  try {
    return await db
      .select(projectSelect)
      .from(projects)
      .where(and(eq(projects.agencyId, agencyId), eq(projects.workspaceId, workspaceId)))
      .orderBy(desc(projects.createdAt))
      .limit(limit);
  } catch {
    return null;
  }
};

export type WorkspaceProjectsPage = {
  projects: ProjectSummary[];
  totalCount: number;
};

export const readWorkspaceProjectsPage = async (
  agencyId: string,
  workspaceId: string,
  page: number,
  pageSize: number,
): Promise<WorkspaceProjectsPage | null> => {
  const db = getDb();
  if (!db) {
    return null;
  }

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, Math.min(pageSize, 50));
  const offset = (safePage - 1) * safePageSize;
  const scope = and(eq(projects.agencyId, agencyId), eq(projects.workspaceId, workspaceId));

  try {
    const [rows, counts] = await Promise.all([
      db
        .select(projectSelect)
        .from(projects)
        .where(scope)
        .orderBy(desc(projects.createdAt))
        .limit(safePageSize)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(projects)
        .where(scope),
    ]);

    return {
      projects: rows,
      totalCount: counts[0]?.count ?? 0,
    };
  } catch {
    return null;
  }
};

export const createWorkspaceProject = async (
  params: InsertProjectParams,
): Promise<CreateWorkspaceProjectResult> => {
  const db = getDb();
  if (!db) {
    return { status: "db_unavailable" };
  }

  try {
    const rows = await db
      .insert(projects)
      .values({
        agencyId: params.agencyId,
        workspaceId: params.workspaceId,
        createdBy: params.createdBy,
        name: params.name,
        domain: params.domain,
      })
      .returning(projectSelect);

    const project = rows[0];
    if (!project) {
      return { status: "db_unavailable" };
    }

    return { status: "created", project };
  } catch (error) {
    if (isProjectDomainConflict(error)) {
      return { status: "domain_conflict" };
    }

    return { status: "db_unavailable" };
  }
};

export const updateWorkspaceProjectName = async (
  agencyId: string,
  workspaceId: string,
  projectId: string,
  name: string,
): Promise<boolean | null> => {
  const db = getDb();
  if (!db) {
    return null;
  }

  try {
    const rows = await db
      .update(projects)
      .set({ name })
      .where(
        and(
          eq(projects.agencyId, agencyId),
          eq(projects.workspaceId, workspaceId),
          eq(projects.id, projectId),
        ),
      )
      .returning({ id: projects.id });
    return rows.length > 0;
  } catch {
    return null;
  }
};

export const deleteWorkspaceProject = async (
  agencyId: string,
  workspaceId: string,
  projectId: string,
): Promise<boolean | null> => {
  const db = getDb();
  if (!db) {
    return null;
  }

  try {
    const rows = await db
      .delete(projects)
      .where(
        and(
          eq(projects.agencyId, agencyId),
          eq(projects.workspaceId, workspaceId),
          eq(projects.id, projectId),
        ),
      )
      .returning({ id: projects.id });
    return rows.length > 0;
  } catch {
    return null;
  }
};
