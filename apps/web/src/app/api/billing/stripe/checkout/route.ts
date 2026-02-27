import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { getStripeClient } from "@/lib/billing/providers/stripe";
import { resolveStripePriceId } from "@/lib/billing/stripe-plans";
import { hasStripeCheckoutPrices, hasStripeEnv } from "@/lib/env";

type CheckoutBody = {
  workspaceId?: string;
  workspaceName?: string;
  planCode?: string;
  customerEmail?: string | null;
  successUrl?: string;
  cancelUrl?: string;
};

export async function POST(request: Request) {
  if (!hasStripeEnv || !hasStripeCheckoutPrices) {
    return NextResponse.json(
      {
        error:
          "Stripe checkout is not configured. Set STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, and Stripe price IDs.",
      },
      { status: 503 },
    );
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe client unavailable." }, { status: 503 });
  }

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const workspaceId = String(body.workspaceId ?? "").trim();
  const workspaceName = String(body.workspaceName ?? "").trim();
  const planCode = String(body.planCode ?? "")
    .trim()
    .toLowerCase();
  const successUrl = String(body.successUrl ?? "").trim();
  const cancelUrl = String(body.cancelUrl ?? "").trim();
  const customerEmail = body.customerEmail?.trim() || undefined;

  if (!workspaceId || !workspaceName || !planCode || !successUrl || !cancelUrl) {
    return NextResponse.json(
      { error: "workspaceId, workspaceName, planCode, successUrl, and cancelUrl are required." },
      { status: 400 },
    );
  }

  const priceId = resolveStripePriceId(planCode);
  if (!priceId) {
    return NextResponse.json(
      { error: "Invalid planCode or missing Stripe price id." },
      { status: 400 },
    );
  }

  try {
    const checkoutParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: workspaceId,
      metadata: {
        workspaceId,
        workspaceName,
        planCode,
      },
      subscription_data: {
        metadata: {
          workspaceId,
          workspaceName,
          planCode,
        },
      },
      allow_promotion_codes: true,
    };
    if (customerEmail) {
      checkoutParams.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(checkoutParams);

    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 502 });
    }

    return NextResponse.json({
      provider: "stripe",
      sessionId: session.id,
      checkoutUrl: session.url,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to create Stripe checkout session." },
      { status: 500 },
    );
  }
}
