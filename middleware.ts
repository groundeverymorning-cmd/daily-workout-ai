import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(request: NextRequest) {
  const supabase = createClient(supabaseUrl!, supabaseKey!);
  const { data: { session } } = await supabase.auth.getSession();

  const publicPaths = ["/auth/login", "/auth/signup"];
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));

  if (!session && !isPublicPath && !request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (session && (request.nextUrl.pathname === "/auth/login" || request.nextUrl.pathname === "/auth/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
