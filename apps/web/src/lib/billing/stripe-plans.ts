import { serverEnv } from "@/lib/env";

export type BillingPlanCode = "starter" | "pro" | "scale";

export const resolveStripePriceId = (planCode: string): string | null => {
  const normalized = planCode.trim().toLowerCase();

  switch (normalized) {
    case "starter":
      return serverEnv.STRIPE_PRICE_ID_STARTER || null;
    case "pro":
      return serverEnv.STRIPE_PRICE_ID_PRO || null;
    case "scale":
      return serverEnv.STRIPE_PRICE_ID_SCALE || null;
    default:
      return null;
  }
};
