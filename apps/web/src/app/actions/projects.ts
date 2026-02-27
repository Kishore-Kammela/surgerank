"use server";

import { revalidatePath } from "next/cache";

import { getAuthContext } from "@/lib/auth/server-context";
import {
  deleteProjectInActiveWorkspace,
  updateProjectNameInActiveWorkspace,
} from "@/lib/projects/service";

const toActionError = (reason: string): string => {
  switch (reason) {
    case "unauthenticated":
      return "Sign in to manage projects.";
    case "no_active_workspace":
      return "Select an active workspace first.";
    case "forbidden":
      return "You need owner/admin workspace role.";
    case "invalid_input":
      return "Project name must be between 2 and 80 characters.";
    case "not_found":
      return "Project not found in active workspace.";
    default:
      return "Database unavailable. Verify DATABASE_URL and try again.";
  }
};

export const updateProjectAction = async (formData: FormData): Promise<void> => {
  const auth = await getAuthContext();
  const projectId = String(formData.get("projectId") ?? "");
  const name = String(formData.get("name") ?? "");

  const result = await updateProjectNameInActiveWorkspace(auth, { projectId, name });
  if (!result.ok) {
    throw new Error(toActionError(result.reason));
  }

  revalidatePath("/");
};

export const deleteProjectAction = async (formData: FormData): Promise<void> => {
  const auth = await getAuthContext();
  const projectId = String(formData.get("projectId") ?? "");

  const result = await deleteProjectInActiveWorkspace(auth, projectId);
  if (!result.ok) {
    throw new Error(toActionError(result.reason));
  }

  revalidatePath("/");
};
