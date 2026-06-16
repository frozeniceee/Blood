import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard — requires mock_session cookie
  if (pathname.startsWith("/dashboard")) {
    const hasSession = request.cookies.has("mock_session");
    if (!hasSession) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect /admin (but NOT /admin/login) — requires admin_session cookie
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const hasAdminSession = request.cookies.has("admin_session");
    if (!hasAdminSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
