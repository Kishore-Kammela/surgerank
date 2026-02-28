"use client";

import { useState } from "react";

import { isCurrentActivePlan } from "@/lib/billing/subscription-state";
import type { BillingProvider } from "@/lib/billing/types";

type PlanCheckoutButtonsProps = {
  planCode: "starter" | "pro" | "scale";
  workspaceId: string;
  workspaceName: string;
  customerEmail: string | null;
  preferredProvider: BillingProvider;
  stripeConfigured: boolean;
  razorpayConfigured: boolean;
  currentPlanCode?: string | null;
  currentStatus?: string | null;
};

type RazorpayResponse = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  workspaceId: string;
  planCode: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const loadRazorpayScript = async (): Promise<boolean> => {
  if (window.Razorpay) {
    return true;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });

  return Boolean(window.Razorpay);
};

export function PlanCheckoutButtons({
  planCode,
  workspaceId,
  workspaceName,
  customerEmail,
  preferredProvider,
  stripeConfigured,
  razorpayConfigured,
  currentPlanCode,
  currentStatus,
}: PlanCheckoutButtonsProps) {
  const [statusMessage, setStatusMessage] = useState("");
  const [pending, setPending] = useState<"stripe" | "razorpay" | null>(null);
  const isCurrentPlan = isCurrentActivePlan({
    currentPlanCode,
    currentStatus,
    targetPlanCode: planCode,
  });

  const startStripeCheckout = async () => {
    try {
      setPending("stripe");
      setStatusMessage("");
      const origin = window.location.origin;
      const response = await fetch("/api/billing/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          workspaceName,
          planCode,
          customerEmail,
          successUrl: `${origin}/billing?status=success&provider=stripe`,
          cancelUrl: `${origin}/billing?status=cancel&provider=stripe`,
        }),
      });

      const json = (await response.json()) as { checkoutUrl?: string; error?: string };
      if (!response.ok || !json.checkoutUrl) {
        setStatusMessage(json.error ?? "Unable to start Stripe checkout.");
        return;
      }

      window.location.assign(json.checkoutUrl);
    } catch {
      setStatusMessage("Unable to start Stripe checkout.");
    } finally {
      setPending(null);
    }
  };

  const startRazorpayCheckout = async () => {
    try {
      setPending("razorpay");
      setStatusMessage("");
      const response = await fetch("/api/billing/razorpay/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          workspaceName,
          planCode,
          customerEmail,
        }),
      });

      const json = (await response.json()) as RazorpayResponse & { error?: string };
      if (!response.ok || !json.orderId || !json.keyId) {
        setStatusMessage(json.error ?? "Unable to start Razorpay checkout.");
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        setStatusMessage("Razorpay SDK failed to load.");
        return;
      }

      const checkout = new window.Razorpay({
        key: json.keyId,
        order_id: json.orderId,
        amount: json.amount,
        currency: json.currency,
        name: "SurgeRank",
        description: `${planCode} plan`,
        notes: {
          workspaceId: json.workspaceId,
          planCode: json.planCode,
        },
        prefill: {
          email: customerEmail ?? "",
        },
        handler: () => {
          setStatusMessage("Razorpay payment completed. Subscription state will sync shortly.");
        },
      });
      checkout.open();
    } catch {
      setStatusMessage("Unable to start Razorpay checkout.");
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {stripeConfigured ? (
          <button
            type="button"
            onClick={startStripeCheckout}
            disabled={pending !== null || isCurrentPlan}
            className="rounded bg-zinc-900 px-3 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-500"
          >
            {isCurrentPlan
              ? "Current plan"
              : pending === "stripe"
                ? "Starting Stripe..."
                : preferredProvider === "stripe"
                  ? "Upgrade with Stripe (preferred)"
                  : "Upgrade with Stripe"}
          </button>
        ) : null}
        <button
          type="button"
          onClick={startRazorpayCheckout}
          disabled={!razorpayConfigured || pending !== null || isCurrentPlan}
          className="rounded bg-zinc-900 px-3 py-2 text-xs font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-500"
        >
          {isCurrentPlan
            ? "Current plan"
            : pending === "razorpay"
              ? "Starting Razorpay..."
              : preferredProvider === "razorpay"
                ? "Upgrade with Razorpay (preferred)"
                : "Upgrade with Razorpay"}
        </button>
      </div>
      {!stripeConfigured && razorpayConfigured ? (
        <p className="text-xs text-zinc-600">
          Additional providers are currently unavailable for this workspace.
        </p>
      ) : null}
      {!stripeConfigured && !razorpayConfigured ? (
        <p className="text-xs text-amber-700">
          No billing provider is configured yet. Add provider credentials to enable upgrades.
        </p>
      ) : null}
      {statusMessage ? <p className="text-xs text-zinc-700">{statusMessage}</p> : null}
    </div>
  );
}
