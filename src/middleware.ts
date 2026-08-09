// ==============================================================================
// src/middleware.ts
// Combines next-intl locale routing with Supabase session refresh, Auth & RBAC Middleware Protection
// ==============================================================================
import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

import { routing } from "@core/config/i18n";
import { createMiddlewareClient } from "@core/lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

const PUBLIC_EXCLUDE_PATHS = ["/api", "/_next", "/favicon.ico"];
const PUBLIC_AUTH_ROUTES = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
];

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
  const { data: { user } } = await supabase.auth.getUser();

  // Strip locale prefix (e.g., /en/admin/login -> /admin/login)
  const pathWithoutLocale = pathname.replace(/^\/(en|ar|ckb|ku)/, "");

  const isAuthRoute = PUBLIC_AUTH_ROUTES.some((route) => pathWithoutLocale.startsWith(route));
  const isAdminRoute = pathWithoutLocale.startsWith("/admin");

  // 1. Check user profile active status if user exists
  let isActive = true;
  if (user) {
    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("is_active")
      .eq("id", user.id)
      .maybeSingle();

    if (profile && profile.is_active === false) {
      isActive = false;
    }
  }

  // 2. Unauthenticated OR Inactive User attempting to access Protected Admin Routes
  if (isAdminRoute && !isAuthRoute && (!user || !isActive)) {
    if (user && !isActive) {
      await supabase.auth.signOut();
    }
    const localeMatch = pathname.match(/^\/(en|ar|ckb|ku)/);
    const locale = localeMatch ? localeMatch[1] : "en";
    const loginUrl = new URL(`/${locale}/admin/login`, request.url);
    if (!isActive) {
      loginUrl.searchParams.set("error", "account_deactivated");
    } else {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 3. Active Authenticated User attempting to access Auth Routes (/admin/login)
  if (isAuthRoute && user && isActive && pathWithoutLocale === "/admin/login") {
    const localeMatch = pathname.match(/^\/(en|ar|ckb|ku)/);
    const locale = localeMatch ? localeMatch[1] : "en";
    return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    // Match all request paths except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
