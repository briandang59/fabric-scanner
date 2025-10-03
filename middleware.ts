import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.method === "OPTIONS") return NextResponse.next();
  if (process.env.NEXT_PHASE === "build") return NextResponse.next();

  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (!token && pathname.startsWith("/fabric-scan")) {
    return NextResponse.redirect(new URL("/log-in", request.url));
  }

  return NextResponse.next();
}
