// ==============================================================================
// src/middleware.ts
// Combines next-intl locale routing with Supabase session refresh
// ==============================================================================
import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

import { routing } from "@core/config/i18n";
import { createMiddlewareClient } from "@core/lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

const PUBLIC_EXCLUDE_PATHS = ["/api", "/_next", "/favicon.ico"];

function isExcludedPath(pathname: string): boolean {
  return PUBLIC_EXCLUDE_PATHS.some((path) => pathname.startsWith(path));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip i18n locale routing for API endpoints and static assets
  if (isExcludedPath(pathname)) {
    return NextResponse.next();
  }

  // Run intl middleware first to get locale-aware response
  const intlResponse = intlMiddleware(request);
  const response = intlResponse ?? NextResponse.next({ request });

  // Refresh Supabase session
  const { supabase } = createMiddlewareClient(request, response);
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Match all request paths except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
