'use client';

import { useState } from 'react';
import { EditorNavbar } from '@/components/editor/editor-navbar';
import { ProjectSidebar } from '@/components/editor/project-sidebar';
import { CreateProjectDialog } from '@/components/editor/create-project-dialog';
import { RenameProjectDialog } from '@/components/editor/rename-project-dialog';
import { DeleteProjectDialog } from '@/components/editor/delete-project-dialog';
import { ShareDialog } from '@/components/editor/share-dialog';
import { useProjectActions } from '@/hooks/use-project-actions';
import type { Project } from '@/lib/projects';

/** Props passed from the server-rendered workspace page. */
interface WorkspaceClientProps {
  /** The project for this workspace. */
  project: Project;
  /** The room/project ID currently active in the URL. */
  activeRoomId: string;
  /** Whether the current user owns this project. */
  isOwner: boolean;
  /** Owned projects for the sidebar. */
  ownedProjects: Project[];
  /** Shared projects for the sidebar. */
  sharedProjects: Project[];
}

/**
 * Client shell for the `/editor/[roomId]` workspace page.
 * Manages sidebar visibility, AI panel state, share dialog, and project mutation dialogs.
 */
export function WorkspaceClient({
  project,
  activeRoomId,
  isOwner,
  ownedProjects,
  sharedProjects,
}: WorkspaceClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const actions = useProjectActions();

  return (
    <div className="h-screen bg-base overflow-hidden flex flex-col">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        projectName={project.name}
        onShareClick={isOwner ? () => setIsShareOpen(true) : undefined}
        isAISidebarOpen={isAISidebarOpen}
        onToggleAI={() => setIsAISidebarOpen((prev) => !prev)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        activeProjectId={activeRoomId}
        onSelectProject={actions.selectProject}
        onNewProject={actions.openCreate}
        onRenameProject={actions.openRename}
        onDeleteProject={actions.openDelete}
      />

      <div className="flex flex-1 overflow-hidden pt-12">
        <main className="flex-1 flex items-center justify-center bg-base">
          <p className="text-copy-faint text-sm">Canvas coming soon</p>
        </main>

        {isAISidebarOpen && (
          <aside className="w-80 shrink-0 border-l border-surface-border bg-elevated flex items-center justify-center">
            <p className="text-copy-faint text-sm">AI chat coming soon</p>
          </aside>
        )}
      </div>

      <ShareDialog
        open={isShareOpen}
        projectId={project.id}
        projectName={project.name}
        isOwner={isOwner}
        onClose={() => setIsShareOpen(false)}
      />

      <CreateProjectDialog
        open={actions.activeDialog.type === 'create'}
        formName={actions.formName}
        roomIdPreview={actions.roomIdPreview}
        onFormNameChange={actions.setFormName}
        onSubmit={actions.handleCreate}
        onClose={actions.closeAll}
        isLoading={actions.isLoading}
      />
      <RenameProjectDialog
        open={actions.activeDialog.type === 'rename'}
        project={actions.activeDialog.type === 'rename' ? actions.activeDialog.project : null}
        formName={actions.formName}
        onFormNameChange={actions.setFormName}
        onSubmit={actions.handleRename}
        onClose={actions.closeAll}
        isLoading={actions.isLoading}
      />
      <DeleteProjectDialog
        open={actions.activeDialog.type === 'delete'}
        project={actions.activeDialog.type === 'delete' ? actions.activeDialog.project : null}
        onConfirm={actions.handleDelete}
        onClose={actions.closeAll}
        isLoading={actions.isLoading}
      />
    </div>
  );
}
