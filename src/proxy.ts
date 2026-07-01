import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Read better-auth session token from standard or secure cookies
  const sessionToken = 
    request.cookies.get("better-auth.session_token") || 
    request.cookies.get("__secure-better-auth.session_token");

  const isAdminRoute = path.startsWith("/admin");
  const isWarehouseRoute = path.startsWith("/warehouse");
  const isAccountRoute = path.startsWith("/account");

  // Skip proxy for public routes
  if (!isAdminRoute && !isWarehouseRoute && !isAccountRoute && !path.startsWith("/profile") && path !== "/checkout") {
    return NextResponse.next();
  }

  // Redirect to login if user is not authenticated and attempts to access protected routes
  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    // Remember redirect destination
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  // Protect role-based routes
  if (isAdminRoute || isWarehouseRoute) {
    try {
      // Server-side check of current session to prevent role spoofing
      const sessionRes = await fetch(new URL("/api/auth/get-session", request.url), {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });
      
      if (!sessionRes.ok) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const session = await sessionRes.json();
      const role = session?.user?.role;
      
      if (!role) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      const adminRoles = ["ADMIN"];
      const warehouseRoles = ["ADMIN", "WAREHOUSE"];

      if (isAdminRoute && !adminRoles.includes(role)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      if (isWarehouseRoute && !warehouseRoles.includes(role)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch (error) {
      console.error("[Proxy Auth Error]:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/warehouse/:path*", "/account/:path*", "/profile/:path*", "/checkout"],
};
