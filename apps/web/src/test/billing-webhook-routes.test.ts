import { createHmac } from "node:crypto";

import { beforeEach, describe, expect, it, vi } from "vitest";

const recordBillingEventMock = vi.fn();
const upsertWorkspaceBillingSubscriptionMock = vi.fn();
const readWorkspaceBillingSubscriptionMock = vi.fn();
const getStripeClientMock = vi.fn();

vi.mock("@/lib/env", () => ({
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon_test",
  },
  hasStripeEnv: true,
  hasRazorpayEnv: true,
  hasDatabaseUrl: true,
  hasSupabaseClientEnv: true,
  hasStripeCheckoutPrices: true,
  hasRazorpayPlanAmounts: true,
  serverEnv: {
    SUPABASE_SERVICE_ROLE_KEY: "service_role_test",
    DATABASE_URL: "postgres://test:test@localhost:5432/test",
    STRIPE_SECRET_KEY: "sk_test_123",
    STRIPE_WEBHOOK_SECRET: "whsec_test",
    STRIPE_PRICE_ID_STARTER: "price_starter",
    STRIPE_PRICE_ID_PRO: "price_pro",
    STRIPE_PRICE_ID_SCALE: "price_scale",
    RAZORPAY_KEY_ID: "rzp_test",
    RAZORPAY_KEY_SECRET: "rzp_secret_key_test",
    RAZORPAY_WEBHOOK_SECRET: "rzp_secret_test",
    RAZORPAY_PLAN_AMOUNT_STARTER_INR: "9900",
    RAZORPAY_PLAN_AMOUNT_PRO_INR: "19900",
    RAZORPAY_PLAN_AMOUNT_SCALE_INR: "49900",
  },
}));

vi.mock("@/lib/db/repositories/billing", () => ({
  recordBillingEvent: recordBillingEventMock,
  upsertWorkspaceBillingSubscription: upsertWorkspaceBillingSubscriptionMock,
  readWorkspaceBillingSubscription: readWorkspaceBillingSubscriptionMock,
}));

vi.mock("@/lib/billing/providers/stripe", () => ({
  getStripeClient: getStripeClientMock,
}));

describe("stripe webhook route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for invalid stripe signature", async () => {
    getStripeClientMock.mockReturnValue({
      webhooks: {
        constructEvent: vi.fn(() => {
          throw new Error("invalid signature");
        }),
      },
    });

    const { POST } = await import("@/app/api/billing/stripe/webhook/route");
    const request = new Request("http://localhost/api/billing/stripe/webhook", {
      method: "POST",
      headers: {
        "stripe-signature": "bad",
      },
      body: "{}",
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ error: "Invalid Stripe webhook signature." });
  });

  it("returns 503 when billing event persistence fails", async () => {
    getStripeClientMock.mockReturnValue({
      webhooks: {
        constructEvent: vi.fn(() => ({
          id: "evt_123",
          type: "checkout.session.completed",
          created: 1_700_000_000,
          data: { object: {} },
        })),
      },
    });
    recordBillingEventMock.mockResolvedValue("db_unavailable");

    const { POST } = await import("@/app/api/billing/stripe/webhook/route");
    const request = new Request("http://localhost/api/billing/stripe/webhook", {
      method: "POST",
      headers: {
        "stripe-signature": "sig_ok",
      },
      body: JSON.stringify({ hello: "world" }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(503);
    expect(json).toEqual({ error: "Failed to persist billing event." });
  });
});

describe("razorpay webhook route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    recordBillingEventMock.mockResolvedValue("recorded");
    upsertWorkspaceBillingSubscriptionMock.mockResolvedValue(true);
  });

  it("returns 400 for invalid razorpay signature", async () => {
    const { POST } = await import("@/app/api/billing/razorpay/webhook/route");
    const request = new Request("http://localhost/api/billing/razorpay/webhook", {
      method: "POST",
      headers: {
        "x-razorpay-signature": "bad_signature",
      },
      body: JSON.stringify({ event: "subscription.charged" }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ error: "Invalid Razorpay webhook signature." });
  });

  it("returns 400 for invalid razorpay payload with valid signature", async () => {
    const payload = "{not-json";
    const signature = createHmac("sha256", "rzp_secret_test").update(payload).digest("hex");

    const { POST } = await import("@/app/api/billing/razorpay/webhook/route");
    const request = new Request("http://localhost/api/billing/razorpay/webhook", {
      method: "POST",
      headers: {
        "x-razorpay-signature": signature,
      },
      body: payload,
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ error: "Invalid Razorpay webhook payload." });
  });

  it("returns 503 when razorpay billing event persistence fails", async () => {
    const payload = JSON.stringify({
      event: "subscription.charged",
      created_at: 1_700_000_005,
      payload: {
        subscription: {
          entity: {
            id: "sub_rzp_1",
            customer_id: "cust_1",
            notes: {
              workspaceId: "workspace-9",
              planCode: "pro",
            },
          },
        },
      },
    });
    const signature = createHmac("sha256", "rzp_secret_test").update(payload).digest("hex");
    recordBillingEventMock.mockResolvedValue("db_unavailable");

    const { POST } = await import("@/app/api/billing/razorpay/webhook/route");
    const request = new Request("http://localhost/api/billing/razorpay/webhook", {
      method: "POST",
      headers: {
        "x-razorpay-signature": signature,
      },
      body: payload,
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(503);
    expect(json).toEqual({ error: "Failed to persist billing event." });
  });
});
