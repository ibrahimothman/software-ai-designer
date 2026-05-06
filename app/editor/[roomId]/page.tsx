import { redirect } from 'next/navigation';
import { getCallerIdentity, getProjectIfAccessible } from '@/lib/project-access';
import { getOwnedProjects, getSharedProjects } from '@/lib/projects';
import { AccessDenied } from '@/components/editor/access-denied';
import { WorkspaceClient } from '@/components/editor/workspace-client';

interface WorkspacePageProps {
  params: Promise<{ roomId: string }>;
}

/**
 * Workspace page for `/editor/[roomId]`.
 * Verifies authentication and project access server-side before rendering the workspace shell.
 */
export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { roomId } = await params;

  const caller = await getCallerIdentity();
  if (!caller) redirect('/sign-in');

  const project = await getProjectIfAccessible(roomId, caller);
  if (!project) return <AccessDenied />;

  const isOwner = project.ownerId === caller.userId;

  const [ownedProjects, sharedProjects] = await Promise.all([
    getOwnedProjects(caller.userId),
    caller.email ? getSharedProjects(caller.email) : Promise.resolve([]),
  ]);

  return (
    <WorkspaceClient
      project={project}
      activeRoomId={roomId}
      isOwner={isOwner}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  );
}
