import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './src/lib/supabase-middleware';
import { ROUTES, ROLES } from './src/constants';

/**
 * ROXOU TRANSPORTE - AUTH MIDDLEWARE
 * Handles:
 * 1. Session Refresh
 * 2. Unauthenticated Redirects
 * 3. Legal Guard (Terms Acceptance)
 * 4. RBAC (Passenger vs Driver vs Admin)
 * 5. Driver Verification Guard
 */

export async function middleware(request: NextRequest) {
  const { supabase, user, response } = await updateSession(request);
  
  if (!supabase) {
    // If Supabase is not configured, allow public access to home/login but warn
    const url = request.nextUrl.clone();
    const path = url.pathname;
    const isPublicRoute = path === ROUTES.HOME || path === ROUTES.LOGIN || path.startsWith('/api/public');
    if (!isPublicRoute) {
      url.pathname = ROUTES.LOGIN;
      return NextResponse.redirect(url);
    }
    return response;
  }

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // 1. PUBLIC ROUTES CHECK
  const isPublicRoute = path === ROUTES.HOME || path === ROUTES.LOGIN || path.startsWith('/api/public');
  
  if (!user && !isPublicRoute) {
    url.pathname = ROUTES.LOGIN;
    url.searchParams.set('next', path);
    return NextResponse.redirect(url);
  }

  if (user) {
    // Fetch profile for role, legal guard, and onboarding
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_blocked, onboarding_completed, full_name, phone')
      .eq('id', user.id)
      .single();

    if (!profile) return response;

    // 1.5 BLOCKED USER GUARD
    if (profile.is_blocked && path !== '/blocked') {
      url.pathname = '/blocked';
      return NextResponse.redirect(url);
    }

    // 2. ONBOARDING GUARD
    // If onboarding not completed, redirect to onboarding page
    // Unless they are already on onboarding or auth callback or public routes
    const isAuthRoute = path.startsWith('/auth');
    const isOnboardingRoute = path === ROUTES.ONBOARDING;
    
    // Infer onboarding as completed if they have name and phone (backward compatibility)
    const hasBasicInfo = profile.full_name && profile.phone;
    const isCompleted = profile.onboarding_completed || hasBasicInfo;

    if (!isCompleted && !isOnboardingRoute && !isAuthRoute && !isPublicRoute && path !== '/blocked') {
      url.pathname = ROUTES.ONBOARDING;
      return NextResponse.redirect(url);
    }

    // If completed and trying to access onboarding, redirect to dashboard
    if (isCompleted && isOnboardingRoute) {
      url.pathname = ROUTES.DASHBOARD;
      return NextResponse.redirect(url);
    }

    // 3. RBAC & REDIRECTS
    
    // Admin Isolation
    if (path.startsWith('/admin') && profile.role !== ROLES.ADMIN) {
      url.pathname = ROUTES.HOME;
      return NextResponse.redirect(url);
    }

    // Unified Dashboard Redirect for Root
    if (path === ROUTES.HOME) {
      url.pathname = ROUTES.DASHBOARD;
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
