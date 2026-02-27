import type Stripe from "stripe";

type Provider = "stripe" | "razorpay";

export type NormalizedBillingEvent = {
  provider: Provider;
  externalEventId: string;
  eventType: string;
  workspaceId: string | null;
  occurredAt: Date;
  payload: Record<string, unknown>;
  subscriptionUpdate?: {
    workspaceId: string;
    provider: Provider;
    externalSubscriptionId: string;
    status: string;
    planCode: string | null;
    customerRef: string | null;
    currentPeriodEnd: Date | null;
    metadata: Record<string, unknown>;
  };
};

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const asString = (value: unknown): string | null =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : null;

const unixToDate = (value: unknown): Date | null =>
  typeof value === "number" && Number.isFinite(value) ? new Date(value * 1000) : null;

export const normalizeStripeEvent = (event: Stripe.Event): NormalizedBillingEvent => {
  const payload = asRecord(event.data.object);
  const metadata = asRecord(payload.metadata);
  const workspaceIdFromMetadata = asString(metadata.workspaceId);
  const workspaceIdFromRef = asString(
    (payload as { client_reference_id?: unknown }).client_reference_id,
  );
  const workspaceId = workspaceIdFromMetadata ?? workspaceIdFromRef ?? null;

  let subscriptionUpdate: NormalizedBillingEvent["subscriptionUpdate"];
  if (event.type.startsWith("customer.subscription.")) {
    const subscriptionId = asString(payload.id);
    if (workspaceId && subscriptionId) {
      subscriptionUpdate = {
        workspaceId,
        provider: "stripe",
        externalSubscriptionId: subscriptionId,
        status: asString(payload.status) ?? "unknown",
        planCode: asString(metadata.planCode),
        customerRef: asString(payload.customer),
        currentPeriodEnd: unixToDate(payload.current_period_end),
        metadata,
      };
    }
  } else if (event.type === "checkout.session.completed") {
    const subscriptionId = asString(payload.subscription);
    if (workspaceId && subscriptionId) {
      subscriptionUpdate = {
        workspaceId,
        provider: "stripe",
        externalSubscriptionId: subscriptionId,
        status: "active",
        planCode: asString(metadata.planCode),
        customerRef: asString(payload.customer),
        currentPeriodEnd: null,
        metadata,
      };
    }
  }

  return {
    provider: "stripe",
    externalEventId: event.id,
    eventType: event.type,
    workspaceId,
    occurredAt: new Date(event.created * 1000),
    payload,
    ...(subscriptionUpdate ? { subscriptionUpdate } : {}),
  };
};

type RazorpayPayload = {
  event?: string;
  created_at?: number;
  payload?: Record<string, unknown>;
};

export const normalizeRazorpayEvent = (
  externalEventId: string,
  input: RazorpayPayload,
): NormalizedBillingEvent => {
  const payload = asRecord(input);
  const rootPayload = asRecord(input.payload);
  const paymentEntity = asRecord(asRecord(rootPayload.payment).entity);
  const subscriptionEntity = asRecord(asRecord(rootPayload.subscription).entity);
  const notes = asRecord(subscriptionEntity.notes);
  const paymentNotes = asRecord(paymentEntity.notes);

  const workspaceId = asString(notes.workspaceId) ?? asString(paymentNotes.workspaceId);
  const subscriptionId = asString(subscriptionEntity.id);
  const eventType = asString(input.event) ?? "unknown";

  let subscriptionUpdate: NormalizedBillingEvent["subscriptionUpdate"];
  if (workspaceId && subscriptionId) {
    subscriptionUpdate = {
      workspaceId,
      provider: "razorpay",
      externalSubscriptionId: subscriptionId,
      status: eventType,
      planCode: asString(notes.planCode),
      customerRef: asString(subscriptionEntity.customer_id),
      currentPeriodEnd: null,
      metadata: notes,
    };
  }

  return {
    provider: "razorpay",
    externalEventId,
    eventType,
    workspaceId,
    occurredAt: unixToDate(input.created_at) ?? new Date(),
    payload,
    ...(subscriptionUpdate ? { subscriptionUpdate } : {}),
  };
};
