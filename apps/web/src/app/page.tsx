import { getAuthContext } from "@/lib/auth/server-context";
import { hasSupabaseClientEnv } from "@/lib/env";

export default async function Home() {
  const auth = await getAuthContext();
  const signedIn = Boolean(auth.userId);

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">SurgeRank</p>
          <h1 className="text-3xl font-semibold tracking-tight">Week 2 Auth and Tenancy Wiring</h1>
          <p className="max-w-3xl text-zinc-600">
            This baseline validates server-side Supabase session detection and tenant membership
            loading.
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
          <h2 className="text-lg font-semibold">Next implementation slice</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-zinc-700">
            <li>Add Supabase auth sign-in page and callback route.</li>
            <li>Persist selected agency/workspace in secure server-side context.</li>
            <li>Gate tenant routes using loaded membership data.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
