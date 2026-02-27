import Razorpay from "razorpay";

import { hasRazorpayEnv, serverEnv } from "@/lib/env";

let razorpayClient: Razorpay | null = null;

export const getRazorpayClient = (): Razorpay | null => {
  if (!hasRazorpayEnv) {
    return null;
  }

  if (razorpayClient) {
    return razorpayClient;
  }

  razorpayClient = new Razorpay({
    key_id: serverEnv.RAZORPAY_KEY_ID,
    key_secret: serverEnv.RAZORPAY_KEY_SECRET,
  });
  return razorpayClient;
};
