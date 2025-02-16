import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { PATH } from './constants/path';

const PUBLIC_ROUTES = [PATH.SIGN_IN] as const;
const PROTECTED_ROUTES = [PATH.PROTECTED] as const;

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  let response = NextResponse.next({
    request: req,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // biome-ignore lint/complexity/noForEach: <explanation>
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          response = NextResponse.next({
            request: req,
          });
          // biome-ignore lint/complexity/noForEach: <explanation>
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (PROTECTED_ROUTES.some((route) => url.pathname.startsWith(route))) {
      url.pathname = PATH.SIGN_IN;
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  if (user) {
    if (PUBLIC_ROUTES.some((route) => url.pathname.startsWith(route))) {
      url.pathname = PATH.PROTECTED;
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - /api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)|api/).*)',
  ],
};
