import { describe, expect, it } from "vitest";

import {
  buildCheckoutStatusMessage,
  deriveBillingSubscriptionViewState,
  isCurrentActivePlan,
} from "@/lib/billing/subscription-state";

describe("deriveBillingSubscriptionViewState", () => {
  it("maps known active statuses", () => {
    expect(deriveBillingSubscriptionViewState("active")).toBe("active");
    expect(deriveBillingSubscriptionViewState("trialing")).toBe("active");
    expect(deriveBillingSubscriptionViewState("payment.captured")).toBe("active");
  });

  it("maps pending, cancelled, and past_due statuses", () => {
    expect(deriveBillingSubscriptionViewState("pending")).toBe("pending");
    expect(deriveBillingSubscriptionViewState("cancelled")).toBe("cancelled");
    expect(deriveBillingSubscriptionViewState("past_due")).toBe("past_due");
  });

  it("falls back to unknown", () => {
    expect(deriveBillingSubscriptionViewState("")).toBe("unknown");
    expect(deriveBillingSubscriptionViewState("other")).toBe("unknown");
  });
});

describe("isCurrentActivePlan", () => {
  it("returns true only when plan matches and status is active", () => {
    expect(
      isCurrentActivePlan({
        currentPlanCode: "pro",
        currentStatus: "active",
        targetPlanCode: "pro",
      }),
    ).toBe(true);

    expect(
      isCurrentActivePlan({
        currentPlanCode: "pro",
        currentStatus: "cancelled",
        targetPlanCode: "pro",
      }),
    ).toBe(false);
  });
});

describe("buildCheckoutStatusMessage", () => {
  it("formats success and cancel states", () => {
    expect(buildCheckoutStatusMessage({ status: "success", provider: "razorpay" })).toContain(
      "Checkout completed via razorpay",
    );
    expect(buildCheckoutStatusMessage({ status: "cancel" })).toContain("Checkout was cancelled");
  });
});
