export type BillingProvider = "stripe" | "razorpay";

export type CheckoutRequest = {
  workspaceId: string;
  workspaceName: string;
  planCode: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string | null;
};

export type CheckoutSession = {
  provider: BillingProvider;
  sessionId: string;
  checkoutUrl: string;
};

export type BillingProviderHealth = {
  provider: BillingProvider;
  configured: boolean;
  message: string;
};
