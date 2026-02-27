import Link from "next/link";

import { getAuthContext } from "@/lib/auth/server-context";
import { readActiveWorkspaceProjectsPage } from "@/lib/projects/service";

const PAGE_SIZE = 10;

type ProjectsPageProps = {
  searchParams?: {
    page?: string;
  };
};

const parsePage = (rawPage?: string): number => {
  const parsed = Number(rawPage ?? "1");
  if (!Number.isFinite(parsed)) {
    return 1;
  }
  return Math.max(1, Math.floor(parsed));
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const auth = await getAuthContext();
  const page = parsePage(searchParams?.page);
  const result = await readActiveWorkspaceProjectsPage(auth, page, PAGE_SIZE);

  const hasPrevious = result.page > 1;
  const hasNext = result.totalPages > 0 && result.page < result.totalPages;

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">SurgeRank</p>
          <h1 className="text-3xl font-semibold tracking-tight">Projects Dashboard</h1>
          <p className="text-zinc-600">
            Page {result.page}
            {result.totalPages > 0 ? ` of ${result.totalPages}` : ""} · {result.totalCount} total
            projects
          </p>
          <Link href="/" className="inline-block text-sm font-medium text-zinc-700 underline">
            Back to home
          </Link>
        </header>

        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          {result.projects.length > 0 ? (
            <ul className="space-y-3">
              {result.projects.map((project) => (
                <li key={project.id} className="rounded-md bg-zinc-100 px-3 py-2">
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-zinc-600">{project.domain}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-600">
              No projects found for the current page or active workspace.
            </p>
          )}
        </section>

        <nav className="flex items-center justify-between">
          {hasPrevious ? (
            <Link
              href={`/projects?page=${result.page - 1}`}
              className="rounded bg-zinc-800 px-3 py-2 text-sm text-white"
            >
              Previous
            </Link>
          ) : (
            <span className="rounded bg-zinc-300 px-3 py-2 text-sm text-zinc-600">Previous</span>
          )}

          {hasNext ? (
            <Link
              href={`/projects?page=${result.page + 1}`}
              className="rounded bg-zinc-800 px-3 py-2 text-sm text-white"
            >
              Next
            </Link>
          ) : (
            <span className="rounded bg-zinc-300 px-3 py-2 text-sm text-zinc-600">Next</span>
          )}
        </nav>
      </main>
    </div>
  );
}
