import Stripe from "stripe";

import { hasStripeEnv, serverEnv } from "@/lib/env";

let stripeClient: Stripe | null = null;

export const getStripeClient = (): Stripe | null => {
  if (!hasStripeEnv) {
    return null;
  }

  if (stripeClient) {
    return stripeClient;
  }

  stripeClient = new Stripe(serverEnv.STRIPE_SECRET_KEY);
  return stripeClient;
};
