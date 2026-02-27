import { cache } from "react";

import type { AuthContext, AgencyMembership, WorkspaceMembership } from "@/lib/auth/types";
import { hasSupabaseClientEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const readAgencyMemberships = async (userId: string): Promise<AgencyMembership[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("agency_memberships")
    .select("agency_id, role")
    .eq("user_id", userId);

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    agencyId: row.agency_id,
    role: row.role,
  }));
};

const readWorkspaceMemberships = async (userId: string): Promise<WorkspaceMembership[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("workspace_memberships")
    .select("workspace_id, agency_id, role")
    .eq("user_id", userId);

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    workspaceId: row.workspace_id,
    agencyId: row.agency_id,
    role: row.role,
  }));
};

export const getAuthContext = cache(async (): Promise<AuthContext> => {
  if (!hasSupabaseClientEnv) {
    return {
      userId: null,
      email: null,
      agencyMemberships: [],
      workspaceMemberships: [],
      activeAgencyId: null,
      activeWorkspaceId: null,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    return {
      userId: null,
      email: null,
      agencyMemberships: [],
      workspaceMemberships: [],
      activeAgencyId: null,
      activeWorkspaceId: null,
    };
  }

  const [agencyMemberships, workspaceMemberships] = await Promise.all([
    readAgencyMemberships(user.id),
    readWorkspaceMemberships(user.id),
  ]);

  return {
    userId: user.id,
    email: user.email ?? null,
    agencyMemberships,
    workspaceMemberships,
    activeAgencyId: agencyMemberships[0]?.agencyId ?? null,
    activeWorkspaceId: workspaceMemberships[0]?.workspaceId ?? null,
  };
});
