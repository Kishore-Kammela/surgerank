import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { hasDatabaseUrl, serverEnv } from "@/lib/env";
import * as schema from "@/lib/db/schema";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export const getDb = () => {
  if (!hasDatabaseUrl) {
    return null;
  }

  if (dbInstance) {
    return dbInstance;
  }

  const client = postgres(serverEnv.DATABASE_URL, {
    prepare: false,
    max: 1,
  });

  dbInstance = drizzle(client, { schema });
  return dbInstance;
};
