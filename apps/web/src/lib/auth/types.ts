export type AgencyMembership = {
  agencyId: string;
  role: "owner" | "admin" | "member";
};

export type WorkspaceMembership = {
  workspaceId: string;
  agencyId: string;
  role: "owner" | "admin" | "member";
};

export type AuthContext = {
  userId: string | null;
  email: string | null;
  agencyMemberships: AgencyMembership[];
  workspaceMemberships: WorkspaceMembership[];
  activeAgencyId: string | null;
  activeWorkspaceId: string | null;
};
