import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { billingEvents, billingSubscriptions } from "@/lib/db/schema";

type Provider = "stripe" | "razorpay";

export type BillingEventRecordInput = {
  provider: Provider;
  externalEventId: string;
  eventType: string;
  workspaceId: string | null;
  occurredAt: Date;
  payload: Record<string, unknown>;
};

export type BillingSubscriptionUpsertInput = {
  workspaceId: string;
  provider: Provider;
  externalSubscriptionId: string;
  status: string;
  planCode: string | null;
  customerRef: string | null;
  currentPeriodEnd: Date | null;
  metadata: Record<string, unknown>;
  lastEventAt: Date;
};

export const recordBillingEvent = async (
  input: BillingEventRecordInput,
): Promise<"recorded" | "duplicate" | "db_unavailable"> => {
  const db = getDb();
  if (!db) {
    return "db_unavailable";
  }

  try {
    const rows = await db
      .insert(billingEvents)
      .values({
        provider: input.provider,
        externalEventId: input.externalEventId,
        eventType: input.eventType,
        workspaceId: input.workspaceId,
        occurredAt: input.occurredAt,
        payload: input.payload,
      })
      .onConflictDoNothing({
        target: [billingEvents.provider, billingEvents.externalEventId],
      })
      .returning({ id: billingEvents.id });

    return rows.length > 0 ? "recorded" : "duplicate";
  } catch {
    return "db_unavailable";
  }
};

export const upsertWorkspaceBillingSubscription = async (
  input: BillingSubscriptionUpsertInput,
): Promise<boolean> => {
  const db = getDb();
  if (!db) {
    return false;
  }

  try {
    await db
      .insert(billingSubscriptions)
      .values({
        workspaceId: input.workspaceId,
        provider: input.provider,
        externalSubscriptionId: input.externalSubscriptionId,
        status: input.status,
        planCode: input.planCode,
        customerRef: input.customerRef,
        currentPeriodEnd: input.currentPeriodEnd,
        metadata: input.metadata,
        lastEventAt: input.lastEventAt,
      })
      .onConflictDoUpdate({
        target: billingSubscriptions.workspaceId,
        set: {
          provider: input.provider,
          externalSubscriptionId: input.externalSubscriptionId,
          status: input.status,
          planCode: input.planCode,
          customerRef: input.customerRef,
          currentPeriodEnd: input.currentPeriodEnd,
          metadata: input.metadata,
          lastEventAt: input.lastEventAt,
        },
      });

    return true;
  } catch {
    return false;
  }
};

export const readWorkspaceBillingSubscription = async (
  workspaceId: string,
): Promise<
  | {
      workspaceId: string;
      provider: "stripe" | "razorpay";
      status: string;
      planCode: string | null;
      currentPeriodEnd: Date | null;
    }
  | null
  | "db_unavailable"
> => {
  const db = getDb();
  if (!db) {
    return "db_unavailable";
  }

  try {
    const rows = await db
      .select({
        workspaceId: billingSubscriptions.workspaceId,
        provider: billingSubscriptions.provider,
        status: billingSubscriptions.status,
        planCode: billingSubscriptions.planCode,
        currentPeriodEnd: billingSubscriptions.currentPeriodEnd,
      })
      .from(billingSubscriptions)
      .where(eq(billingSubscriptions.workspaceId, workspaceId))
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return "db_unavailable";
  }
};
