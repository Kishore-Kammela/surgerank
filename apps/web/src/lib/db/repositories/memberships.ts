import { eq } from "drizzle-orm";

import type { AgencyMembership, WorkspaceMembership } from "@/lib/auth/types";
import { getDb } from "@/lib/db/client";
import { agencyMemberships, workspaceMemberships } from "@/lib/db/schema";

export const readAgencyMembershipsByUserId = async (
  userId: string,
): Promise<AgencyMembership[] | null> => {
  const db = getDb();
  if (!db) {
    return null;
  }

  try {
    const rows = await db
      .select({
        agencyId: agencyMemberships.agencyId,
        role: agencyMemberships.role,
      })
      .from(agencyMemberships)
      .where(eq(agencyMemberships.userId, userId));

    return rows.map((row) => ({
      agencyId: row.agencyId,
      role: row.role,
    }));
  } catch {
    return null;
  }
};

export const readWorkspaceMembershipsByUserId = async (
  userId: string,
): Promise<WorkspaceMembership[] | null> => {
  const db = getDb();
  if (!db) {
    return null;
  }

  try {
    const rows = await db
      .select({
        workspaceId: workspaceMemberships.workspaceId,
        agencyId: workspaceMemberships.agencyId,
        role: workspaceMemberships.role,
      })
      .from(workspaceMemberships)
      .where(eq(workspaceMemberships.userId, userId));

    return rows.map((row) => ({
      workspaceId: row.workspaceId,
      agencyId: row.agencyId,
      role: row.role,
    }));
  } catch {
    return null;
  }
};
