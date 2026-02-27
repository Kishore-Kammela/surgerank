import { describe, expect, it } from "vitest";

import type { AuthContext } from "../lib/auth/types";
import { canManageWorkspaceProjects } from "../lib/projects/service";

const baseAuth: AuthContext = {
  userId: "00000000-0000-0000-0000-0000000000aa",
  email: "owner@example.com",
  agencyMemberships: [{ agencyId: "agency-1", role: "owner" }],
  workspaceMemberships: [],
  activeAgencyId: "agency-1",
  activeWorkspaceId: "workspace-1",
};

describe("canManageWorkspaceProjects", () => {
  it("returns true for owner role in workspace", () => {
    const auth: AuthContext = {
      ...baseAuth,
      workspaceMemberships: [{ workspaceId: "workspace-1", agencyId: "agency-1", role: "owner" }],
    };

    expect(canManageWorkspaceProjects(auth, "workspace-1")).toBe(true);
  });

  it("returns true for admin role in workspace", () => {
    const auth: AuthContext = {
      ...baseAuth,
      workspaceMemberships: [{ workspaceId: "workspace-1", agencyId: "agency-1", role: "admin" }],
    };

    expect(canManageWorkspaceProjects(auth, "workspace-1")).toBe(true);
  });

  it("returns false for member role in workspace", () => {
    const auth: AuthContext = {
      ...baseAuth,
      workspaceMemberships: [{ workspaceId: "workspace-1", agencyId: "agency-1", role: "member" }],
    };

    expect(canManageWorkspaceProjects(auth, "workspace-1")).toBe(false);
  });
});
