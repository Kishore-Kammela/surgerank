import { jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const agencies = pgTable("agencies", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  createdBy: uuid("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey(),
  agencyId: uuid("agency_id").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  createdBy: uuid("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const agencyMemberships = pgTable("agency_memberships", {
  id: uuid("id").primaryKey(),
  agencyId: uuid("agency_id").notNull(),
  userId: uuid("user_id").notNull(),
  role: text("role").$type<"owner" | "admin" | "member">().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const workspaceMemberships = pgTable("workspace_memberships", {
  id: uuid("id").primaryKey(),
  agencyId: uuid("agency_id").notNull(),
  workspaceId: uuid("workspace_id").notNull(),
  userId: uuid("user_id").notNull(),
  role: text("role").$type<"owner" | "admin" | "member">().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  agencyId: uuid("agency_id").notNull(),
  workspaceId: uuid("workspace_id").notNull(),
  name: text("name").notNull(),
  domain: text("domain").notNull(),
  createdBy: uuid("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const billingSubscriptions = pgTable(
  "billing_subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id").notNull(),
    provider: text("provider").$type<"stripe" | "razorpay">().notNull(),
    externalSubscriptionId: text("external_subscription_id").notNull(),
    status: text("status").notNull(),
    planCode: text("plan_code"),
    customerRef: text("customer_ref"),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull(),
    lastEventAt: timestamp("last_event_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    workspaceUnique: uniqueIndex("billing_subscriptions_workspace_key").on(table.workspaceId),
  }),
);

export const billingEvents = pgTable(
  "billing_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    provider: text("provider").$type<"stripe" | "razorpay">().notNull(),
    externalEventId: text("external_event_id").notNull(),
    eventType: text("event_type").notNull(),
    workspaceId: uuid("workspace_id"),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    providerEventUnique: uniqueIndex("billing_events_provider_external_event_key").on(
      table.provider,
      table.externalEventId,
    ),
  }),
);
