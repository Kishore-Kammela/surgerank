import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AuthContext } from "@/lib/auth/types";
import {
  createProjectAction,
  deleteProjectAction,
  initialProjectActionState,
  updateProjectAction,
} from "@/app/actions/projects";

const {
  revalidatePathMock,
  getAuthContextMock,
  createProjectInActiveWorkspaceMock,
  updateProjectNameInActiveWorkspaceMock,
  deleteProjectInActiveWorkspaceMock,
} = vi.hoisted(() => ({
  revalidatePathMock: vi.fn(),
  getAuthContextMock: vi.fn<() => Promise<AuthContext>>(),
  createProjectInActiveWorkspaceMock: vi.fn(),
  updateProjectNameInActiveWorkspaceMock: vi.fn(),
  deleteProjectInActiveWorkspaceMock: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

vi.mock("@/lib/auth/server-context", () => ({
  getAuthContext: getAuthContextMock,
}));

vi.mock("@/lib/projects/service", () => ({
  createProjectInActiveWorkspace: createProjectInActiveWorkspaceMock,
  updateProjectNameInActiveWorkspace: updateProjectNameInActiveWorkspaceMock,
  deleteProjectInActiveWorkspace: deleteProjectInActiveWorkspaceMock,
}));

const authContext: AuthContext = {
  userId: "00000000-0000-0000-0000-0000000000aa",
  email: "owner@example.com",
  agencyMemberships: [{ agencyId: "agency-1", role: "owner" }],
  workspaceMemberships: [{ workspaceId: "workspace-1", agencyId: "agency-1", role: "owner" }],
  activeAgencyId: "agency-1",
  activeWorkspaceId: "workspace-1",
};

beforeEach(() => {
  vi.clearAllMocks();
  getAuthContextMock.mockResolvedValue(authContext);
});

describe("project server actions", () => {
  it("createProjectAction returns success and revalidates", async () => {
    createProjectInActiveWorkspaceMock.mockResolvedValue({
      ok: true,
      project: {
        id: "project-1",
        agencyId: "agency-1",
        workspaceId: "workspace-1",
        name: "Demo",
        domain: "demo.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const formData = new FormData();
    formData.set("name", "Demo");
    formData.set("domain", "demo.com");

    const result = await createProjectAction(initialProjectActionState, formData);

    expect(createProjectInActiveWorkspaceMock).toHaveBeenCalledWith(authContext, {
      name: "Demo",
      domain: "demo.com",
    });
    expect(result).toEqual({ status: "success", message: "Created project Demo." });
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
  });

  it("createProjectAction surfaces domain conflict", async () => {
    createProjectInActiveWorkspaceMock.mockResolvedValue({
      ok: false,
      reason: "domain_conflict",
    });

    const formData = new FormData();
    formData.set("name", "Demo");
    formData.set("domain", "demo.com");

    const result = await createProjectAction(initialProjectActionState, formData);

    expect(result).toEqual({
      status: "error",
      message: "A project with this domain already exists in the active workspace.",
    });
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("updateProjectAction returns success and revalidates", async () => {
    updateProjectNameInActiveWorkspaceMock.mockResolvedValue({ ok: true });

    const formData = new FormData();
    formData.set("projectId", "project-1");
    formData.set("name", "Renamed");

    const result = await updateProjectAction(initialProjectActionState, formData);

    expect(updateProjectNameInActiveWorkspaceMock).toHaveBeenCalledWith(authContext, {
      projectId: "project-1",
      name: "Renamed",
    });
    expect(result).toEqual({ status: "success", message: "Project renamed." });
    expect(revalidatePathMock).toHaveBeenCalledWith("/");
  });

  it("deleteProjectAction surfaces not_found errors", async () => {
    deleteProjectInActiveWorkspaceMock.mockResolvedValue({ ok: false, reason: "not_found" });

    const formData = new FormData();
    formData.set("projectId", "project-1");

    const result = await deleteProjectAction(initialProjectActionState, formData);

    expect(result).toEqual({
      status: "error",
      message: "Project not found in active workspace.",
    });
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });
});
