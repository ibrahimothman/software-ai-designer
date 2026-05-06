import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? '/sign-in';
const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? '/sign-up';

/** Matches only the public auth routes — everything else is protected by default. */
const isPublicRoute = createRouteMatcher([
  `${signInUrl}(.*)`,
  `${signUpUrl}(.*)`,
]);

/**
 * Clerk proxy: runs before every request. Protects all routes except
 * the sign-in and sign-up paths defined via env vars.
 */
export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
