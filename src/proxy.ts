import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/checkout", "/orders", "/profile", "/wishlist"];
const adminRoutes = ["/admin"];
const authRoutes = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session cookie
  const sessionCookie = request.cookies.get("better-auth.session_token")?.value;
  const isAuthenticated = !!sessionCookie;

  // Check if it's an admin route
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users from protected routes
  if ((isProtectedRoute || isAdminRoute) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For admin routes, verify the role via API
  if (isAdminRoute && isAuthenticated) {
    try {
      const response = await fetch(
        `${request.nextUrl.origin}/api/auth/get-session`,
        {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data?.user?.role !== "ADMIN") {
          return NextResponse.redirect(new URL("/", request.url));
        }
      }
    } catch {
      // If session check fails, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Add security headers
  const headers = new Headers(request.headers);
  const response = NextResponse.next({ request: { headers } });

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|studio).*)",
  ],
};
