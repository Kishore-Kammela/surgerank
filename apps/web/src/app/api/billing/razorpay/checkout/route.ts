import { NextResponse } from "next/server";

import { resolveRazorpayPlanAmountInrMinor } from "@/lib/billing/razorpay-plans";
import { getRazorpayClient } from "@/lib/billing/providers/razorpay";
import { hasRazorpayEnv, hasRazorpayPlanAmounts, serverEnv } from "@/lib/env";

type RazorpayCheckoutBody = {
  workspaceId?: string;
  workspaceName?: string;
  planCode?: string;
  customerEmail?: string | null;
};

export async function POST(request: Request) {
  if (!hasRazorpayEnv || !hasRazorpayPlanAmounts) {
    return NextResponse.json(
      {
        error:
          "Razorpay checkout is not configured. Set Razorpay keys, webhook secret, and plan amounts.",
      },
      { status: 503 },
    );
  }

  const razorpay = getRazorpayClient();
  if (!razorpay) {
    return NextResponse.json({ error: "Razorpay client unavailable." }, { status: 503 });
  }

  let body: RazorpayCheckoutBody;
  try {
    body = (await request.json()) as RazorpayCheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const workspaceId = String(body.workspaceId ?? "").trim();
  const workspaceName = String(body.workspaceName ?? "").trim();
  const planCode = String(body.planCode ?? "")
    .trim()
    .toLowerCase();
  const customerEmail = body.customerEmail?.trim() || null;

  if (!workspaceId || !workspaceName || !planCode) {
    return NextResponse.json(
      { error: "workspaceId, workspaceName, and planCode are required." },
      { status: 400 },
    );
  }

  const amount = resolveRazorpayPlanAmountInrMinor(planCode);
  if (!amount) {
    return NextResponse.json(
      { error: "Invalid planCode or missing Razorpay plan amount configuration." },
      { status: 400 },
    );
  }

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `ws_${workspaceId}_${Date.now()}`,
      notes: {
        workspaceId,
        workspaceName,
        planCode,
        customerEmail: customerEmail ?? "",
      },
    });

    return NextResponse.json({
      provider: "razorpay",
      keyId: serverEnv.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      workspaceId,
      planCode,
    });
  } catch {
    return NextResponse.json({ error: "Unable to create Razorpay order." }, { status: 500 });
  }
}
