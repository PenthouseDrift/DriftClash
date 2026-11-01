import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Only the registration form needs a signed-in person; the landing page and sign in are public.
export default auth((req) => {
  if (req.nextUrl.pathname.startsWith("/register") && !req.auth) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.png|favicon-48\\.png|favicon\\.ico|apple-touch-icon\\.png|icons|sw\\.js|manifest\\.webmanifest|logo\\.png|phd-logo|api/auth).*)",
  ],
};
