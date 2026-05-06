import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getOwnedProjects, getSharedProjects } from '@/lib/projects';
import { EditorHomeClient } from '@/components/editor/editor-home-client';

/**
 * Editor home page — server component.
 * Fetches the current user's owned and shared projects, then passes them to the client shell.
 */
export default async function EditorPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress ?? '';

  const [ownedProjects, sharedProjects] = await Promise.all([
    getOwnedProjects(userId),
    userEmail ? getSharedProjects(userEmail) : Promise.resolve([]),
  ]);

  return <EditorHomeClient ownedProjects={ownedProjects} sharedProjects={sharedProjects} />;
}
