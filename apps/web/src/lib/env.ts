export const env = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
} as const;

export const serverEnv = {
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  STRIPE_PRICE_ID_STARTER: process.env.STRIPE_PRICE_ID_STARTER ?? "",
  STRIPE_PRICE_ID_PRO: process.env.STRIPE_PRICE_ID_PRO ?? "",
  STRIPE_PRICE_ID_SCALE: process.env.STRIPE_PRICE_ID_SCALE ?? "",
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ?? "",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ?? "",
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET ?? "",
} as const;

export const hasSupabaseClientEnv =
  env.NEXT_PUBLIC_SUPABASE_URL.length > 0 && env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0;

export const hasDatabaseUrl = serverEnv.DATABASE_URL.length > 0;

export const hasStripeEnv =
  serverEnv.STRIPE_SECRET_KEY.length > 0 && serverEnv.STRIPE_WEBHOOK_SECRET.length > 0;

export const hasStripeCheckoutPrices =
  serverEnv.STRIPE_PRICE_ID_STARTER.length > 0 &&
  serverEnv.STRIPE_PRICE_ID_PRO.length > 0 &&
  serverEnv.STRIPE_PRICE_ID_SCALE.length > 0;

export const hasRazorpayEnv =
  serverEnv.RAZORPAY_KEY_ID.length > 0 &&
  serverEnv.RAZORPAY_KEY_SECRET.length > 0 &&
  serverEnv.RAZORPAY_WEBHOOK_SECRET.length > 0;
