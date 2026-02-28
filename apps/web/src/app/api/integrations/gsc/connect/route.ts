import { NextResponse } from "next/server";

import { getAuthContext } from "@/lib/auth/server-context";
import {
  buildGscCallbackUrl,
  createGscOauthContextCookieValue,
  createGscOauthStateToken,
} from "@/lib/integrations/gsc/oauth-state";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const GSC_OAUTH_CONTEXT_COOKIE = "gsc_oauth_context";
const GSC_STATE_MAX_AGE_SECONDS = 15 * 60;

export async function GET(request: Request) {
  const auth = await getAuthContext();
  if (!auth.userId) {
    return NextResponse.redirect(new URL("/?gsc=signin_required", request.url));
  }

  const requestUrl = new URL(request.url);
  const workspaceId = requestUrl.searchParams.get("workspaceId") ?? auth.activeWorkspaceId;
  if (!workspaceId) {
    return NextResponse.redirect(new URL("/integrations/gsc?status=no_workspace", request.url));
  }

  const canAccessWorkspace = auth.workspaceMemberships.some(
    (membership) => membership.workspaceId === workspaceId,
  );
  if (!canAccessWorkspace) {
    return NextResponse.redirect(
      new URL("/integrations/gsc?status=forbidden_workspace", request.url),
    );
  }

  const stateToken = createGscOauthStateToken();
  const contextCookieValue = createGscOauthContextCookieValue({
    token: stateToken,
    workspaceId,
    userId: auth.userId,
    issuedAtMs: Date.now(),
  });

  const callbackUrl = buildGscCallbackUrl(requestUrl.origin, stateToken);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl,
      scopes: GSC_SCOPE,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(
      new URL("/integrations/gsc?status=oauth_start_failed", request.url),
    );
  }

  const response = NextResponse.redirect(data.url);
  response.cookies.set({
    name: GSC_OAUTH_CONTEXT_COOKIE,
    value: contextCookieValue,
    httpOnly: true,
    sameSite: "lax",
    secure: requestUrl.protocol === "https:",
    path: "/",
    maxAge: GSC_STATE_MAX_AGE_SECONDS,
  });
  return response;
}
