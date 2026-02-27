export const env = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
} as const;

export const serverEnv = {
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
} as const;

export const hasSupabaseClientEnv =
  env.NEXT_PUBLIC_SUPABASE_URL.length > 0 && env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0;

export const hasDatabaseUrl = serverEnv.DATABASE_URL.length > 0;
