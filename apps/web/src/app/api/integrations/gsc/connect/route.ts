import { NextResponse } from "next/server";

import { getAuthContext } from "@/lib/auth/server-context";
import { createSignedGscOauthState, buildGscCallbackUrl } from "@/lib/integrations/gsc/oauth-state";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { serverEnv } from "@/lib/env";

const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

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

  if (!serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.redirect(
      new URL("/integrations/gsc?status=missing_server_secret", request.url),
    );
  }

  const stateToken = createSignedGscOauthState(
    {
      workspaceId,
      userId: auth.userId,
      issuedAtMs: Date.now(),
    },
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
  );

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

  return NextResponse.redirect(data.url);
}
