import { CreateProjectForm } from "@/app/components/create-project-form";
import { ProjectRowActions } from "@/app/components/project-row-actions";
import { getAuthContext } from "@/lib/auth/server-context";
import { hasDatabaseUrl, hasSupabaseClientEnv } from "@/lib/env";
import { canManageWorkspaceProjects, readActiveWorkspaceProjects } from "@/lib/projects/service";

export default async function Home() {
  const auth = await getAuthContext();
  const signedIn = Boolean(auth.userId);
  const projects = await readActiveWorkspaceProjects(auth);
  const hasActiveWorkspace = Boolean(auth.activeAgencyId && auth.activeWorkspaceId);
  const canManageActiveWorkspaceProjects =
    hasActiveWorkspace &&
    Boolean(auth.activeWorkspaceId) &&
    canManageWorkspaceProjects(auth, auth.activeWorkspaceId ?? "");
  const canCreateProject = hasDatabaseUrl && canManageActiveWorkspaceProjects;

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">SurgeRank</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Week 3 Drizzle Service Layer Baseline
          </h1>
          <p className="max-w-3xl text-zinc-600">
            This slice keeps auth and tenancy context from Week 2 and adds typed Drizzle repository
            and service patterns for project data.
          </p>
          {!hasSupabaseClientEnv ? (
            <p className="max-w-3xl rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Supabase environment variables are not configured yet. Add `NEXT_PUBLIC_SUPABASE_URL`
              and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to enable live auth context loading.
            </p>
          ) : null}
        </header>

        <section className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-zinc-500">Session status</p>
            <p className="text-lg font-medium">{signedIn ? "Signed in" : "Signed out"}</p>
          </div>
          <div>
            <p className="text-sm text-zinc-500">User email</p>
            <p className="text-lg font-medium">{auth.email ?? "-"}</p>
          </div>
          <div>
            <p className="text-sm text-zinc-500">Agency memberships</p>
            <p className="text-lg font-medium">{auth.agencyMemberships.length}</p>
          </div>
          <div>
            <p className="text-sm text-zinc-500">Workspace memberships</p>
            <p className="text-lg font-medium">{auth.workspaceMemberships.length}</p>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Active tenant context</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-zinc-500">Active agency id</p>
              <p className="font-mono text-sm text-zinc-800">{auth.activeAgencyId ?? "-"}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-500">Active workspace id</p>
              <p className="font-mono text-sm text-zinc-800">{auth.activeWorkspaceId ?? "-"}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Active workspace projects (Drizzle read path)</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <p className="rounded-md bg-zinc-100 px-3 py-2 text-xs text-zinc-700">
              DATABASE_URL:{" "}
              <span className="font-semibold">{hasDatabaseUrl ? "Configured" : "Missing"}</span>
            </p>
            <p className="rounded-md bg-zinc-100 px-3 py-2 text-xs text-zinc-700">
              Signed in: <span className="font-semibold">{signedIn ? "Yes" : "No"}</span>
            </p>
            <p className="rounded-md bg-zinc-100 px-3 py-2 text-xs text-zinc-700">
              Active workspace:{" "}
              <span className="font-semibold">{hasActiveWorkspace ? "Yes" : "No"}</span>
            </p>
          </div>
          <p className="mt-2 text-sm text-zinc-500">Projects loaded: {projects.length}</p>
          {projects.length > 0 ? (
            <ul className="mt-4 space-y-2 text-sm text-zinc-700">
              {projects.slice(0, 5).map((project) => (
                <li key={project.id} className="rounded-md bg-zinc-100 px-3 py-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{project.name}</span>
                    <span className="text-zinc-500">({project.domain})</span>
                  </div>
                  <ProjectRowActions
                    projectId={project.id}
                    projectName={project.name}
                    canManage={canManageActiveWorkspaceProjects}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-zinc-600">
              {!hasDatabaseUrl
                ? "DATABASE_URL is missing, so Drizzle project reads are disabled."
                : !signedIn
                  ? "No projects loaded yet because you are signed out."
                  : !hasActiveWorkspace
                    ? "No projects loaded yet because there is no active workspace context."
                    : "No projects found yet in the active workspace."}
            </p>
          )}
          <div className="mt-6 border-t border-zinc-200 pt-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
              Create project (server action)
            </h3>
            <CreateProjectForm canCreate={canCreateProject} />
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Next implementation slice</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-zinc-700">
            <li>Add domain uniqueness feedback for duplicate project domains.</li>
            <li>Add dedicated project dashboard route with pagination.</li>
            <li>Add integration tests for create/rename/delete server actions.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
