import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Redirect /user/* to public routes
  if (pathname.startsWith("/user/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/user/, "");
    return NextResponse.redirect(url);
  }

  // Protected user routes
  const protectedPaths = ["/dashboard", "/profile", "/deposit", "/withdrawal", "/loan", "/cards", "/transfer", "/edit-profile", "/account-summary"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  // Auth pages (redirect to dashboard if already logged in)
  const authPaths = ["/login", "/signup", "/forgot-password"];
  const isAuthPage = authPaths.some((p) => pathname === p);

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from auth pages (skip if OTP pending)
  if (isAuthPage && user) {
    const otpPending = request.cookies.has("login_otp_pending");
    if (!otpPending) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.ico|images/|assets/|api/).*)",
  ],
};
