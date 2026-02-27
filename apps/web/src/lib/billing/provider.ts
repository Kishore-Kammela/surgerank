import type { BillingProvider, BillingProviderHealth } from "@/lib/billing/types";
import { hasRazorpayEnv, hasStripeEnv } from "@/lib/env";

export const resolvePreferredProvider = (billingCountryCode?: string | null): BillingProvider => {
  const code = (billingCountryCode ?? "").trim().toUpperCase();
  if (code === "IN" && hasRazorpayEnv) {
    return "razorpay";
  }
  if (hasStripeEnv) {
    return "stripe";
  }
  return hasRazorpayEnv ? "razorpay" : "stripe";
};

export const readBillingProviderHealth = (): BillingProviderHealth[] => {
  return [
    {
      provider: "stripe",
      configured: hasStripeEnv,
      message: hasStripeEnv
        ? "Stripe credentials are configured."
        : "Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET.",
    },
    {
      provider: "razorpay",
      configured: hasRazorpayEnv,
      message: hasRazorpayEnv
        ? "Razorpay credentials are configured."
        : "Missing RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, or RAZORPAY_WEBHOOK_SECRET.",
    },
  ];
};
