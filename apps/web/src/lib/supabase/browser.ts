import { createBrowserClient } from "@supabase/ssr";

import { env, hasSupabaseClientEnv } from "@/lib/env";

export const createSupabaseBrowserClient = () => {
  if (!hasSupabaseClientEnv) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};
