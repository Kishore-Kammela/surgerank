"use client";

import Link from "next/link";
import { useActionState } from "react";

import { createProjectAction, initialProjectActionState } from "@/app/actions/projects";

type CreateProjectFormProps = {
  canCreate: boolean;
};

export function CreateProjectForm({ canCreate }: CreateProjectFormProps) {
  const [state, formAction, pending] = useActionState(
    createProjectAction,
    initialProjectActionState,
  );

  return (
    <form action={formAction} className="mt-4 grid gap-3 sm:grid-cols-3">
      <input
        type="text"
        name="name"
        placeholder="Project name"
        minLength={2}
        maxLength={80}
        required
        disabled={!canCreate || pending}
        className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm"
      />
      <input
        type="text"
        name="domain"
        placeholder="example.com"
        required
        disabled={!canCreate || pending}
        className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm"
      />
      <button
        type="submit"
        disabled={!canCreate || pending}
        className="rounded bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-500"
      >
        {pending ? "Creating..." : "Create project"}
      </button>
      {state.message ? (
        <div className="sm:col-span-3 flex flex-wrap items-center gap-3">
          <p
            className={`text-sm ${state.status === "error" ? "text-red-600" : "text-emerald-700"}`}
          >
            {state.message}
          </p>
          {state.status === "error" && state.ctaHref && state.ctaLabel ? (
            <Link href={state.ctaHref} className="text-sm font-medium text-zinc-800 underline">
              {state.ctaLabel}
            </Link>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
