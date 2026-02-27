"use client";

import { useActionState } from "react";

import {
  deleteProjectAction,
  initialProjectActionState,
  updateProjectAction,
} from "@/app/actions/projects";

type ProjectRowActionsProps = {
  projectId: string;
  projectName: string;
  canManage: boolean;
};

export function ProjectRowActions({ projectId, projectName, canManage }: ProjectRowActionsProps) {
  const [renameState, renameAction, renamePending] = useActionState(
    updateProjectAction,
    initialProjectActionState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteProjectAction,
    initialProjectActionState,
  );

  const disabled = !canManage || renamePending || deletePending;

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        <form action={renameAction} className="flex flex-wrap gap-2">
          <input type="hidden" name="projectId" value={projectId} />
          <input
            type="text"
            name="name"
            defaultValue={projectName}
            minLength={2}
            maxLength={80}
            required
            disabled={disabled}
            className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs"
          />
          <button
            type="submit"
            disabled={disabled}
            className="rounded bg-zinc-800 px-2 py-1 text-xs font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-500"
          >
            {renamePending ? "Renaming..." : "Rename"}
          </button>
        </form>
        <form action={deleteAction}>
          <input type="hidden" name="projectId" value={projectId} />
          <button
            type="submit"
            disabled={disabled}
            className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-500"
          >
            {deletePending ? "Deleting..." : "Delete"}
          </button>
        </form>
      </div>
      {renameState.message ? (
        <p
          className={`mt-2 text-xs ${
            renameState.status === "error" ? "text-red-600" : "text-emerald-700"
          }`}
        >
          {renameState.message}
        </p>
      ) : null}
      {deleteState.message ? (
        <p
          className={`mt-1 text-xs ${
            deleteState.status === "error" ? "text-red-600" : "text-emerald-700"
          }`}
        >
          {deleteState.message}
        </p>
      ) : null}
    </div>
  );
}
