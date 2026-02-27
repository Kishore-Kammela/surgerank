import Link from "next/link";

import { PlanCheckoutButtons } from "@/app/billing/components/plan-checkout-buttons";
import { getAuthContext } from "@/lib/auth/server-context";
import { readBillingProviderHealth, resolvePreferredProvider } from "@/lib/billing/provider";
import { readWorkspaceBillingSubscription } from "@/lib/db/repositories/billing";

const plans = [
  {
    code: "starter" as const,
    name: "Starter",
    description: "Entry-level paid plan for growing teams.",
  },
  {
    code: "pro" as const,
    name: "Pro",
    description: "Recommended plan for most agencies.",
  },
  {
    code: "scale" as const,
    name: "Scale",
    description: "Higher limits for larger operations.",
  },
];

type BillingPageProps = {
  searchParams: Promise<{
    status?: string;
    provider?: string;
  }>;
};

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const auth = await getAuthContext();
  const params = await searchParams;
  const workspaceId = auth.activeWorkspaceId;
  const providerHealth = readBillingProviderHealth();
  const preferredProvider = resolvePreferredProvider();
  const stripeConfigured = providerHealth.some(
    (item) => item.provider === "stripe" && item.configured,
  );
  const razorpayConfigured = providerHealth.some(
    (item) => item.provider === "razorpay" && item.configured,
  );

  const currentSubscription = workspaceId
    ? await readWorkspaceBillingSubscription(workspaceId)
    : null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 p-8">
      <section className="rounded border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900">Billing</h1>
            <p className="text-sm text-zinc-600">
              Upgrade and manage your workspace plan with Stripe or Razorpay.
            </p>
          </div>
          <Link href="/" className="text-sm text-zinc-700 underline">
            Back to dashboard
          </Link>
        </div>

        {params.status ? (
          <p className="mt-4 rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
            Checkout status: <span className="font-medium">{params.status}</span>
            {params.provider ? ` via ${params.provider}` : ""}.
          </p>
        ) : null}
      </section>

      <section className="rounded border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-zinc-900">Current subscription</h2>
        {!workspaceId ? (
          <p className="mt-2 text-sm text-zinc-600">
            Sign in and select a workspace to manage billing.
          </p>
        ) : currentSubscription === "db_unavailable" ? (
          <p className="mt-2 text-sm text-amber-700">
            Billing database is unavailable. Check `DATABASE_URL` and database connectivity.
          </p>
        ) : currentSubscription ? (
          <div className="mt-2 grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
            <p>
              Plan: <span className="font-medium">{currentSubscription.planCode ?? "unknown"}</span>
            </p>
            <p>
              Status: <span className="font-medium">{currentSubscription.status}</span>
            </p>
            <p>
              Provider: <span className="font-medium">{currentSubscription.provider}</span>
            </p>
            <p>
              Current period end:{" "}
              <span className="font-medium">
                {currentSubscription.currentPeriodEnd
                  ? currentSubscription.currentPeriodEnd.toISOString()
                  : "n/a"}
              </span>
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-zinc-600">
            No paid subscription found yet for this workspace. First project remains free.
          </p>
        )}
      </section>

      <section className="rounded border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-zinc-900">Provider health</h2>
        <ul className="mt-2 space-y-1 text-sm text-zinc-700">
          {providerHealth.map((item) => (
            <li key={item.provider}>
              {item.provider}: {item.configured ? "configured" : "missing config"} - {item.message}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-zinc-600">Preferred provider: {preferredProvider}</p>
      </section>

      <section className="rounded border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-zinc-900">Upgrade plans</h2>
        {!workspaceId ? (
          <p className="mt-2 text-sm text-zinc-600">Sign in to start checkout.</p>
        ) : (
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.code} className="rounded border border-zinc-200 p-4">
                <h3 className="text-sm font-semibold text-zinc-900">{plan.name}</h3>
                <p className="mt-1 text-xs text-zinc-600">{plan.description}</p>
                <div className="mt-3">
                  <PlanCheckoutButtons
                    planCode={plan.code}
                    workspaceId={workspaceId}
                    workspaceName={workspaceId}
                    customerEmail={auth.email}
                    preferredProvider={preferredProvider}
                    stripeConfigured={stripeConfigured}
                    razorpayConfigured={razorpayConfigured}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
