import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Read better-auth session token from standard or secure cookies
  const sessionToken = 
    request.cookies.get("better-auth.session_token") || 
    request.cookies.get("__secure-better-auth.session_token");

  // Redirect to login if user is not authenticated and attempts to access protected routes
  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    // Remember redirect destination
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  // Protect administrative dashboard and endpoints
  if (path.startsWith("/admin")) {
    try {
      // Server-side check of current session to prevent role spoofing
      const sessionRes = await fetch(new URL("/api/auth/get-session", request.url), {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });
      
      if (!sessionRes.ok) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      const session = await sessionRes.json();
      
      if (!session || !session.user || session.user.role !== "ADMIN") {
        // Forbidden — regular users redirected to homepage
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("[Proxy Auth Error]:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/checkout"],
};
