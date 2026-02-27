import { createHmac, timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { normalizeRazorpayEvent } from "@/lib/billing/webhook-normalizers";
import {
  recordBillingEvent,
  upsertWorkspaceBillingSubscription,
} from "@/lib/db/repositories/billing";
import { hasRazorpayEnv, serverEnv } from "@/lib/env";

const verifyRazorpaySignature = (payload: string, signature: string): boolean => {
  const expected = createHmac("sha256", serverEnv.RAZORPAY_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(signature, "utf8");
  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }
  return timingSafeEqual(expectedBuffer, receivedBuffer);
};

export async function POST(request: Request) {
  if (!hasRazorpayEnv) {
    return NextResponse.json({ error: "Razorpay webhook is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing x-razorpay-signature header." }, { status: 400 });
  }

  const payload = await request.text();
  if (!verifyRazorpaySignature(payload, signature)) {
    return NextResponse.json({ error: "Invalid Razorpay webhook signature." }, { status: 400 });
  }

  const externalEventIdHeader = request.headers.get("x-razorpay-event-id");
  let eventType = "unknown";
  let parsedPayload: {
    event?: string;
    created_at?: number;
    payload?: Record<string, unknown>;
  } | null = null;
  try {
    parsedPayload = JSON.parse(payload) as {
      event?: string;
      created_at?: number;
      payload?: Record<string, unknown>;
    };
    eventType = parsedPayload.event ?? "unknown";
  } catch {
    return NextResponse.json({ error: "Invalid Razorpay webhook payload." }, { status: 400 });
  }

  const externalEventId =
    externalEventIdHeader ?? `${eventType}:${parsedPayload.created_at ?? Date.now()}`;
  const normalized = normalizeRazorpayEvent(externalEventId, parsedPayload);
  const saved = await recordBillingEvent(normalized);

  if (saved === "duplicate") {
    return NextResponse.json({ received: true, duplicate: true, eventType });
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

  return NextResponse.json({ received: true, eventType });
}
