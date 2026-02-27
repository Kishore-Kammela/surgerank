import { serverEnv } from "@/lib/env";

type RazorpayPlanCode = "starter" | "pro" | "scale";

const parseMinorAmount = (value: string): number | null => {
  const parsed = Number.parseInt(value.trim(), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

export const resolveRazorpayPlanAmountInrMinor = (planCode: string): number | null => {
  const normalized = planCode.trim().toLowerCase() as RazorpayPlanCode;
  switch (normalized) {
    case "starter":
      return parseMinorAmount(serverEnv.RAZORPAY_PLAN_AMOUNT_STARTER_INR);
    case "pro":
      return parseMinorAmount(serverEnv.RAZORPAY_PLAN_AMOUNT_PRO_INR);
    case "scale":
      return parseMinorAmount(serverEnv.RAZORPAY_PLAN_AMOUNT_SCALE_INR);
    default:
      return null;
  }
};
