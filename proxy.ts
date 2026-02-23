import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const cookie = req.cookies.get("sb_token")?.value || req.cookies.get("sb_token_client")?.value;
  const path = req.nextUrl.pathname;

  const isProtected =
    path.startsWith("/admin") ||
    path.startsWith("/tutor") ||
    path.startsWith("/student");

  const isAuthPage = path === "/login" || path === "/register";

  // if (isProtected && !cookie) {
  //   const url = req.nextUrl.clone();
  //   url.pathname = "/login";
  //   return NextResponse.redirect(url);
  // }

  if (isAuthPage && cookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/redirect";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/tutor/:path*", "/student/:path*", "/login", "/register"],
};
