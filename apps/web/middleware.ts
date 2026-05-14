import { NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

const protectedRoutes = [
  "/resumo",
  "/crm",
  "/agenda",
  "/pacientes",
  "/procedimentos",
  "/estoque",
  "/financeiro",
  "/dashboards",
  "/configuracoes",
];

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if ((pathname === "/" || pathname === "/cadastro") && user) {
    return NextResponse.redirect(new URL("/resumo", request.url));
  }

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected && !user) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/cadastro",
    "/resumo/:path*",
    "/crm/:path*",
    "/agenda/:path*",
    "/pacientes/:path*",
    "/procedimentos/:path*",
    "/estoque/:path*",
    "/financeiro/:path*",
    "/dashboards/:path*",
    "/configuracoes/:path*",
  ],
};
