"use server";

import { revalidatePath } from "next/cache";

import { getAuthContext } from "@/lib/auth/server-context";
import { createProjectInActiveWorkspace } from "@/lib/projects/service";

export type CreateProjectActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialCreateProjectActionState: CreateProjectActionState = {
  status: "idle",
  message: "",
};

export const createProjectAction = async (
  _previousState: CreateProjectActionState,
  formData: FormData,
): Promise<CreateProjectActionState> => {
  const auth = await getAuthContext();
  const name = String(formData.get("name") ?? "");
  const domain = String(formData.get("domain") ?? "");

  const result = await createProjectInActiveWorkspace(auth, { name, domain });
  if (result.ok) {
    revalidatePath("/");
    return {
      status: "success",
      message: `Created project ${result.project.name}.`,
    };
  }

  switch (result.reason) {
    case "unauthenticated":
      return { status: "error", message: "Sign in to create a project." };
    case "no_active_workspace":
      return { status: "error", message: "Select an active workspace before creating a project." };
    case "forbidden":
      return { status: "error", message: "You need owner/admin role in this workspace." };
    case "invalid_input":
      return { status: "error", message: "Enter a valid name and domain (example.com)." };
    case "db_unavailable":
      return {
        status: "error",
        message: "Database is unavailable. Verify DATABASE_URL and try again.",
      };
  }
};
