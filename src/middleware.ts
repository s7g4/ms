import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes and their required roles
  const isAdminRoute = pathname.startsWith("/admin");
  const isWarehouseRoute = pathname.startsWith("/warehouse");
  const isAccountRoute = pathname.startsWith("/account");

  if (!isAdminRoute && !isWarehouseRoute && !isAccountRoute) {
    return NextResponse.next();
  }

  // Fetch session using better-fetch for better-auth
  // Note: betterFetch works optimally with better-auth to fetch session data in middleware
  const { data: session } = await betterFetch<{
    session: any;
    user: {
      role: string;
      email: string;
    };
  }>("/api/auth/get-session", {
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = session.user.role;

  // Define role groups
  const adminRoles = ["ADMIN"];
  const warehouseRoles = ["ADMIN", "WAREHOUSE"];

  if (isAdminRoute && !adminRoles.includes(role)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (isWarehouseRoute && !warehouseRoles.includes(role)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/warehouse/:path*", "/account/:path*"],
};
