import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

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
