"use server";

import { revalidatePath } from "next/cache";

import { getAuthContext } from "@/lib/auth/server-context";
import {
  createProjectInActiveWorkspace,
  deleteProjectInActiveWorkspace,
  updateProjectNameInActiveWorkspace,
} from "@/lib/projects/service";

export type ProjectActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialProjectActionState: ProjectActionState = {
  status: "idle",
  message: "",
};

const toActionError = (reason: string): string => {
  switch (reason) {
    case "unauthenticated":
      return "Sign in to manage projects.";
    case "no_active_workspace":
      return "Select an active workspace first.";
    case "forbidden":
      return "You need owner/admin workspace role.";
    case "invalid_input":
      return "Enter valid project details (name 2-80 chars, domain like example.com).";
    case "domain_conflict":
      return "A project with this domain already exists in the active workspace.";
    case "not_found":
      return "Project not found in active workspace.";
    default:
      return "Database unavailable. Verify DATABASE_URL and try again.";
  }
};

export const createProjectAction = async (
  _previousState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> => {
  const auth = await getAuthContext();
  const name = String(formData.get("name") ?? "");
  const domain = String(formData.get("domain") ?? "");

  const result = await createProjectInActiveWorkspace(auth, { name, domain });
  if (!result.ok) {
    return { status: "error", message: toActionError(result.reason) };
  }

  revalidatePath("/");
  return { status: "success", message: `Created project ${result.project.name}.` };
};

export const updateProjectAction = async (
  _previousState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> => {
  const auth = await getAuthContext();
  const projectId = String(formData.get("projectId") ?? "");
  const name = String(formData.get("name") ?? "");

  const result = await updateProjectNameInActiveWorkspace(auth, { projectId, name });
  if (!result.ok) {
    return { status: "error", message: toActionError(result.reason) };
  }

  revalidatePath("/");
  return { status: "success", message: "Project renamed." };
};

export const deleteProjectAction = async (
  _previousState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> => {
  const auth = await getAuthContext();
  const projectId = String(formData.get("projectId") ?? "");

  const result = await deleteProjectInActiveWorkspace(auth, projectId);
  if (!result.ok) {
    return { status: "error", message: toActionError(result.reason) };
  }

  revalidatePath("/");
  return { status: "success", message: "Project deleted." };
};
