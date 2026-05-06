import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

/**
 * Root route: immediately redirects to the editor for authenticated users
 * or to sign-in for unauthenticated users.
 */
export default async function RootPage() {
  const { userId } = await auth();
  if (userId) {
    redirect('/editor');
  } else {
    redirect('/sign-in');
  }
}
