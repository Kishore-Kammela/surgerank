import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getAuthContext } from "@/lib/auth/server-context";
import { readGscOauthContextCookieValue } from "@/lib/integrations/gsc/oauth-state";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const GSC_STATE_MAX_AGE_MS = 15 * 60 * 1000;
const GSC_OAUTH_CONTEXT_COOKIE = "gsc_oauth_context";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const stateToken = requestUrl.searchParams.get("gsc_state");
  if (!stateToken) {
    return NextResponse.redirect(new URL("/integrations/gsc?status=invalid_state", request.url));
  }

  const cookieStore = await cookies();
  const oauthContextCookie = cookieStore.get(GSC_OAUTH_CONTEXT_COOKIE)?.value;
  const oauthContext = oauthContextCookie
    ? readGscOauthContextCookieValue(oauthContextCookie, GSC_STATE_MAX_AGE_MS)
    : null;

  if (!oauthContext || oauthContext.token !== stateToken) {
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
  if (!auth.userId || auth.userId !== oauthContext.userId) {
    return NextResponse.redirect(new URL("/integrations/gsc?status=user_mismatch", request.url));
  }

  const destinationUrl = new URL("/integrations/gsc", request.url);
  destinationUrl.searchParams.set("status", "connected");
  destinationUrl.searchParams.set("workspaceId", oauthContext.workspaceId);

  const response = NextResponse.redirect(destinationUrl);
  response.cookies.set({
    name: GSC_OAUTH_CONTEXT_COOKIE,
    value: "",
    maxAge: 0,
    path: "/",
  });
  return response;
}
