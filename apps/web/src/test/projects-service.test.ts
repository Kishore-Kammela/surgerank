import { describe, expect, it } from "vitest";

import type { AuthContext } from "../lib/auth/types";
import {
  canManageWorkspaceProjects,
  createProjectInActiveWorkspace,
} from "../lib/projects/service";

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

describe("createProjectInActiveWorkspace", () => {
  it("returns unauthenticated when user is missing", async () => {
    const auth: AuthContext = {
      ...baseAuth,
      userId: null,
    };

    const result = await createProjectInActiveWorkspace(auth, {
      name: "Sample project",
      domain: "example.com",
    });

    expect(result).toEqual({ ok: false, reason: "unauthenticated" });
  });

  it("returns no_active_workspace when active workspace context is missing", async () => {
    const auth: AuthContext = {
      ...baseAuth,
      activeWorkspaceId: null,
      workspaceMemberships: [{ workspaceId: "workspace-1", agencyId: "agency-1", role: "owner" }],
    };

    const result = await createProjectInActiveWorkspace(auth, {
      name: "Sample project",
      domain: "example.com",
    });

    expect(result).toEqual({ ok: false, reason: "no_active_workspace" });
  });

  it("returns forbidden for member role", async () => {
    const auth: AuthContext = {
      ...baseAuth,
      workspaceMemberships: [{ workspaceId: "workspace-1", agencyId: "agency-1", role: "member" }],
    };

    const result = await createProjectInActiveWorkspace(auth, {
      name: "Sample project",
      domain: "example.com",
    });

    expect(result).toEqual({ ok: false, reason: "forbidden" });
  });

  it("returns invalid_input for malformed domain", async () => {
    const auth: AuthContext = {
      ...baseAuth,
      workspaceMemberships: [{ workspaceId: "workspace-1", agencyId: "agency-1", role: "owner" }],
    };

    const result = await createProjectInActiveWorkspace(auth, {
      name: "Sample project",
      domain: "not-a-valid-domain",
    });

    expect(result).toEqual({ ok: false, reason: "invalid_input" });
  });
});
