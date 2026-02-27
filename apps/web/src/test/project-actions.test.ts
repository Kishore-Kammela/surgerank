import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { AuthContext } from "@/lib/auth/types";
import {
  createProjectInActiveWorkspace,
  updateProjectNameInActiveWorkspace,
} from "@/lib/projects/service";
import * as authServerContext from "@/lib/auth/server-context";
import * as projectService from "@/lib/projects/service";
import { revalidatePath } from "next/cache";
import {
  createProjectAction,
  deleteProjectAction,
  initialProjectActionState,
  updateProjectAction,
} from "@/app/actions/projects";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
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
  vi.restoreAllMocks();
  vi.spyOn(authServerContext, "getAuthContext").mockResolvedValue(authContext);
  (revalidatePath as ReturnType<typeof vi.fn>).mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("project server actions", () => {
  it("createProjectAction returns success and revalidates", async () => {
    vi.spyOn(projectService, "createProjectInActiveWorkspace").mockResolvedValue({
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

    expect(createProjectInActiveWorkspace).toHaveBeenCalledWith(authContext, {
      name: "Demo",
      domain: "demo.com",
    });
    expect(result).toEqual({ status: "success", message: "Created project Demo." });
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("createProjectAction surfaces domain conflict", async () => {
    vi.spyOn(projectService, "createProjectInActiveWorkspace").mockResolvedValue({
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
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("updateProjectAction returns success and revalidates", async () => {
    vi.spyOn(projectService, "updateProjectNameInActiveWorkspace").mockResolvedValue({
      ok: true,
    });

    const formData = new FormData();
    formData.set("projectId", "project-1");
    formData.set("name", "Renamed");

    const result = await updateProjectAction(initialProjectActionState, formData);

    expect(updateProjectNameInActiveWorkspace).toHaveBeenCalledWith(authContext, {
      projectId: "project-1",
      name: "Renamed",
    });
    expect(result).toEqual({ status: "success", message: "Project renamed." });
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("deleteProjectAction surfaces not_found errors", async () => {
    vi.spyOn(projectService, "deleteProjectInActiveWorkspace").mockResolvedValue({
      ok: false,
      reason: "not_found",
    });

    const formData = new FormData();
    formData.set("projectId", "project-1");

    const result = await deleteProjectAction(initialProjectActionState, formData);

    expect(result).toEqual({
      status: "error",
      message: "Project not found in active workspace.",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
