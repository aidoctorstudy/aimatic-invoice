import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale } from "@/content/dictionaries";

// Set MAINTENANCE_MODE=true in the Vercel project (or .env.local) to take the
// site down for visitors while keeping the maintenance page itself and
// framework/static assets reachable. Flip it back to unset/false to restore
// normal routing — no code change needed.
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (MAINTENANCE_MODE && pathname !== "/maintenance") {
    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    return NextResponse.rewrite(url);
  }

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
