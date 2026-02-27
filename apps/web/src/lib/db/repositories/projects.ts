import { and, desc, eq } from "drizzle-orm";

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

export const createWorkspaceProject = async (
  params: InsertProjectParams,
): Promise<ProjectSummary | null> => {
  const db = getDb();
  if (!db) {
    return null;
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

    return rows[0] ?? null;
  } catch {
    return null;
  }
};
