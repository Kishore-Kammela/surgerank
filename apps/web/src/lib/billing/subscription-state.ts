export type BillingSubscriptionViewState =
  | "active"
  | "pending"
  | "cancelled"
  | "past_due"
  | "unknown";

const ACTIVE_STATUSES = new Set(["active", "trialing", "subscription.charged", "payment.captured"]);
const PENDING_STATUSES = new Set(["incomplete", "pending", "created", "subscription.activated"]);
const CANCELLED_STATUSES = new Set(["canceled", "cancelled", "paused", "expired"]);
const PAST_DUE_STATUSES = new Set(["past_due", "unpaid", "payment_failed", "failed"]);

const normalize = (value: string | null | undefined): string => (value ?? "").trim().toLowerCase();

export const deriveBillingSubscriptionViewState = (
  status: string | null | undefined,
): BillingSubscriptionViewState => {
  const normalized = normalize(status);
  if (!normalized) {
    return "unknown";
  }
  if (ACTIVE_STATUSES.has(normalized)) {
    return "active";
  }
  if (PENDING_STATUSES.has(normalized)) {
    return "pending";
  }
  if (CANCELLED_STATUSES.has(normalized)) {
    return "cancelled";
  }
  if (PAST_DUE_STATUSES.has(normalized)) {
    return "past_due";
  }
  return "unknown";
};

export const isCurrentActivePlan = (input: {
  currentPlanCode: string | null | undefined;
  currentStatus: string | null | undefined;
  targetPlanCode: string;
}): boolean => {
  const currentPlan = normalize(input.currentPlanCode);
  const targetPlan = normalize(input.targetPlanCode);
  if (!currentPlan || currentPlan !== targetPlan) {
    return false;
  }
  return deriveBillingSubscriptionViewState(input.currentStatus) === "active";
};

export const buildCheckoutStatusMessage = (input: {
  status?: string | undefined;
  provider?: string | undefined;
}): string | null => {
  const status = normalize(input.status);
  if (!status) {
    return null;
  }

  const provider = normalize(input.provider);
  const viaProvider = provider ? ` via ${provider}` : "";
  if (status === "success") {
    return `Checkout completed${viaProvider}. Subscription state will sync shortly.`;
  }
  if (status === "cancel") {
    return `Checkout was cancelled${viaProvider}. You can try again anytime.`;
  }
  return `Checkout status: ${status}${viaProvider}.`;
};
