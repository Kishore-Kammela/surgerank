import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { normalizeStripeEvent } from "@/lib/billing/webhook-normalizers";
import {
  recordBillingEvent,
  upsertWorkspaceBillingSubscription,
} from "@/lib/db/repositories/billing";
import { getStripeClient } from "@/lib/billing/providers/stripe";
import { hasStripeEnv, serverEnv } from "@/lib/env";

export async function POST(request: Request) {
  if (!hasStripeEnv) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 503 });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe client unavailable." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, serverEnv.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe webhook signature." }, { status: 400 });
  }

  const normalized = normalizeStripeEvent(event);
  const saved = await recordBillingEvent(normalized);

  if (saved === "duplicate") {
    return NextResponse.json({ received: true, duplicate: true, eventType: event.type });
  }

  if (saved === "db_unavailable") {
    return NextResponse.json({ error: "Failed to persist billing event." }, { status: 503 });
  }

  if (normalized.subscriptionUpdate) {
    const upserted = await upsertWorkspaceBillingSubscription({
      ...normalized.subscriptionUpdate,
      lastEventAt: normalized.occurredAt,
    });
    if (!upserted) {
      return NextResponse.json(
        { error: "Failed to update internal subscription state." },
        { status: 503 },
      );
    }
  }

  return NextResponse.json({ received: true, eventType: event.type });
}
