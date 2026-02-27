import { describe, expect, it } from "vitest";

import { normalizeRazorpayEvent, normalizeStripeEvent } from "@/lib/billing/webhook-normalizers";

describe("normalizeStripeEvent", () => {
  it("normalizes checkout session completed into active subscription", () => {
    const normalized = normalizeStripeEvent({
      id: "evt_1",
      type: "checkout.session.completed",
      created: 1_700_000_000,
      data: {
        object: {
          metadata: {
            workspaceId: "workspace-1",
            planCode: "pro",
          },
          client_reference_id: "workspace-fallback",
          subscription: "sub_123",
          customer: "cus_123",
        },
      },
    } as never);

    expect(normalized.provider).toBe("stripe");
    expect(normalized.workspaceId).toBe("workspace-1");
    expect(normalized.subscriptionUpdate).toEqual({
      workspaceId: "workspace-1",
      provider: "stripe",
      externalSubscriptionId: "sub_123",
      status: "active",
      planCode: "pro",
      customerRef: "cus_123",
      currentPeriodEnd: null,
      metadata: {
        workspaceId: "workspace-1",
        planCode: "pro",
      },
    });
  });

  it("normalizes customer subscription update event", () => {
    const normalized = normalizeStripeEvent({
      id: "evt_2",
      type: "customer.subscription.updated",
      created: 1_700_000_001,
      data: {
        object: {
          id: "sub_456",
          status: "trialing",
          current_period_end: 1_800_000_000,
          customer: "cus_456",
          metadata: {
            workspaceId: "workspace-2",
            planCode: "scale",
          },
        },
      },
    } as never);

    expect(normalized.workspaceId).toBe("workspace-2");
    expect(normalized.subscriptionUpdate?.status).toBe("trialing");
    expect(normalized.subscriptionUpdate?.currentPeriodEnd).toBeInstanceOf(Date);
  });
});

describe("normalizeRazorpayEvent", () => {
  it("normalizes razorpay subscription payload with workspace notes", () => {
    const normalized = normalizeRazorpayEvent("evt_rzp_1", {
      event: "subscription.charged",
      created_at: 1_700_000_002,
      payload: {
        subscription: {
          entity: {
            id: "sub_rzp_1",
            customer_id: "cust_rzp_1",
            notes: {
              workspaceId: "workspace-3",
              planCode: "starter",
            },
          },
        },
      },
    });

    expect(normalized.provider).toBe("razorpay");
    expect(normalized.workspaceId).toBe("workspace-3");
    expect(normalized.subscriptionUpdate).toEqual({
      workspaceId: "workspace-3",
      provider: "razorpay",
      externalSubscriptionId: "sub_rzp_1",
      status: "subscription.charged",
      planCode: "starter",
      customerRef: "cust_rzp_1",
      currentPeriodEnd: null,
      metadata: {
        workspaceId: "workspace-3",
        planCode: "starter",
      },
    });
  });

  it("does not create subscription update when subscription id is missing", () => {
    const normalized = normalizeRazorpayEvent("evt_rzp_2", {
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            notes: {
              workspaceId: "workspace-4",
            },
          },
        },
      },
    });

    expect(normalized.workspaceId).toBe("workspace-4");
    expect(normalized.subscriptionUpdate).toBeUndefined();
  });
});
