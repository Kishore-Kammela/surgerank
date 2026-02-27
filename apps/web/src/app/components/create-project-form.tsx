"use client";

import { useActionState } from "react";

import { createProjectAction, initialCreateProjectActionState } from "@/app/actions/projects";

type CreateProjectFormProps = {
  canCreate: boolean;
};

export function CreateProjectForm({ canCreate }: CreateProjectFormProps) {
  const [state, formAction, pending] = useActionState(
    createProjectAction,
    initialCreateProjectActionState,
  );

  return (
    <form action={formAction} className="mt-4 grid gap-3 sm:grid-cols-3">
      <input
        type="text"
        name="name"
        placeholder="Project name"
        required
        minLength={2}
        maxLength={80}
        disabled={!canCreate || pending}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
      />
      <input
        type="text"
        name="domain"
        placeholder="example.com"
        required
        disabled={!canCreate || pending}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={!canCreate || pending}
        className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-500"
      >
        {pending ? "Creating..." : "Create project"}
      </button>
      {state.message ? (
        <p
          className={`text-sm ${state.status === "error" ? "text-red-600" : "text-emerald-700"} sm:col-span-3`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
