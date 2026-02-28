import { NextResponse } from "next/server";

import { getAuthContext } from "@/lib/auth/server-context";
import { serverEnv } from "@/lib/env";
import { verifySignedGscOauthState } from "@/lib/integrations/gsc/oauth-state";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const GSC_STATE_MAX_AGE_MS = 15 * 60 * 1000;

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const stateToken = requestUrl.searchParams.get("gsc_state");
  if (!stateToken || !serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.redirect(new URL("/integrations/gsc?status=invalid_state", request.url));
  }

  const state = verifySignedGscOauthState(
    stateToken,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    GSC_STATE_MAX_AGE_MS,
  );
  if (!state) {
    return NextResponse.redirect(new URL("/integrations/gsc?status=invalid_state", request.url));
  }

  const supabase = await createSupabaseServerClient();
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        new URL("/integrations/gsc?status=exchange_failed", request.url),
      );
    }
  }

  const auth = await getAuthContext();
  if (!auth.userId || auth.userId !== state.userId) {
    return NextResponse.redirect(new URL("/integrations/gsc?status=user_mismatch", request.url));
  }

  const destinationUrl = new URL("/integrations/gsc", request.url);
  destinationUrl.searchParams.set("status", "connected");
  destinationUrl.searchParams.set("workspaceId", state.workspaceId);
  return NextResponse.redirect(destinationUrl);
}
