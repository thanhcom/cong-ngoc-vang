import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Chỉ chặn trang /update
  if (pathname.startsWith("/update")) {
    const cookie = request.cookies.get("admin_auth")?.value;
    const adminPassword = process.env.ADMIN_PASSWORD ?? "";

    // Nếu chưa đăng nhập hoặc cookie sai
    if (cookie !== adminPassword) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Áp dụng middleware cho các đường dẫn bắt đầu bằng /update
export const config = {
  matcher: ["/update/:path*"],
};
