import { NextResponse } from "next/server";

import { readBillingProviderHealth, resolvePreferredProvider } from "@/lib/billing/provider";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const billingCountry = url.searchParams.get("country");

  return NextResponse.json({
    preferredProvider: resolvePreferredProvider(billingCountry),
    providers: readBillingProviderHealth(),
  });
}
