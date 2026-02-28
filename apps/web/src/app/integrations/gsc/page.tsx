import Link from "next/link";

import { getAuthContext } from "@/lib/auth/server-context";

type GscPageProps = {
  searchParams: Promise<{
    status?: string;
    workspaceId?: string;
  }>;
};

const toStatusMessage = (status?: string): string | null => {
  switch ((status ?? "").trim()) {
    case "connected":
      return "Google account connected. Property selection and first sync are the next implementation step.";
    case "no_workspace":
      return "Select an active workspace before starting Google Search Console setup.";
    case "forbidden_workspace":
      return "You do not have access to the requested workspace.";
    case "missing_server_secret":
      return "Server secret missing for OAuth state signing.";
    case "oauth_start_failed":
      return "Unable to start Google OAuth flow. Verify provider settings.";
    case "invalid_state":
      return "OAuth state validation failed. Retry connection.";
    case "exchange_failed":
      return "OAuth callback exchange failed. Retry connection.";
    case "user_mismatch":
      return "Connected user does not match request context.";
    default:
      return null;
  }
};

export default async function GscIntegrationPage({ searchParams }: GscPageProps) {
  const auth = await getAuthContext();
  const params = await searchParams;
  const statusMessage = toStatusMessage(params.status);
  const workspaceId = auth.activeWorkspaceId;
  const connectHref = workspaceId
    ? `/api/integrations/gsc/connect?workspaceId=${encodeURIComponent(workspaceId)}`
    : null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 p-8">
      <section className="rounded border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900">Google Search Console</h1>
            <p className="text-sm text-zinc-600">
              Week 6 baseline: connect account with secure OAuth callback state.
            </p>
          </div>
          <Link href="/" className="text-sm text-zinc-700 underline">
            Back to dashboard
          </Link>
        </div>
        {statusMessage ? (
          <p className="mt-4 rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
            {statusMessage}
          </p>
        ) : null}
      </section>

      <section className="rounded border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-zinc-900">Connection context</h2>
        <div className="mt-3 grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
          <p>
            Signed in: <span className="font-medium">{auth.userId ? "Yes" : "No"}</span>
          </p>
          <p>
            Active workspace: <span className="font-medium">{workspaceId ?? "-"}</span>
          </p>
          <p>
            Email: <span className="font-medium">{auth.email ?? "-"}</span>
          </p>
          <p>
            Workspace memberships:{" "}
            <span className="font-medium">{auth.workspaceMemberships.length}</span>
          </p>
        </div>
        <div className="mt-4">
          {connectHref && auth.userId ? (
            <a
              href={connectHref}
              className="inline-flex rounded bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
            >
              Connect Google Search Console
            </a>
          ) : (
            <p className="text-sm text-zinc-600">
              Sign in and ensure an active workspace exists before connecting Google Search Console.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
