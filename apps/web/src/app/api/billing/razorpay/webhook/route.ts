import { createHmac, timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

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

  let eventType = "unknown";
  try {
    const parsed = JSON.parse(payload) as { event?: string };
    eventType = parsed.event ?? "unknown";
  } catch {
    return NextResponse.json({ error: "Invalid Razorpay webhook payload." }, { status: 400 });
  }

  switch (eventType) {
    case "payment.captured":
    case "payment.failed":
    case "subscription.activated":
    case "subscription.cancelled":
    case "subscription.charged":
      // Week 4 baseline: signature validation and typed event routing.
      // Event persistence and plan-state sync is added in the next slice.
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true, eventType });
}
