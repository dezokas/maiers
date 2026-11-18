import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.AUTH_SECRET || "myers-super-secure-jwt-secret-key-32chars-minimum";
const secretKey = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = "myers_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Proteksi Halaman Pesanan Anda (Wajib Login)
  if (pathname.startsWith("/pesanan") || pathname.startsWith("/pembayaran")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    try {
      await jwtVerify(token, secretKey);
    } catch {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  // 2. Proteksi Halaman Admin Dashboard (Wajib Login & Wajib Role Admin)
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, secretKey);
      const role = payload.role as string;

      // Proteksi ketat di level server: Hanya role 'admin' yang boleh masuk dashboard
      if (role !== "admin") {
        const homeUrl = new URL("/", request.url);
        homeUrl.searchParams.set("error", "unauthorized_admin_only");
        return NextResponse.redirect(homeUrl);
      }
    } catch {
      // Token tidak valid atau kedaluwarsa
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/pesanan/:path*", "/pembayaran/:path*"],
};
