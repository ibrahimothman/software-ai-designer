'use client';

import { useState } from 'react';
import { EditorNavbar } from '@/components/editor/editor-navbar';
import { ProjectSidebar } from '@/components/editor/project-sidebar';
import { CreateProjectDialog } from '@/components/editor/create-project-dialog';
import { RenameProjectDialog } from '@/components/editor/rename-project-dialog';
import { DeleteProjectDialog } from '@/components/editor/delete-project-dialog';
import { ShareDialog } from '@/components/editor/share-dialog';
import { useProjectActions } from '@/hooks/use-project-actions';
import { CanvasProvider } from '@/components/editor/canvas-provider';
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
 * Canvas fills the full viewport; navbar and sidebars float above it as fixed overlays.
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
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Canvas fills the full viewport; isolate keeps ReactFlow's z-indices contained */}
      <div className="absolute inset-0 isolate">
        <CanvasProvider roomId={activeRoomId} />
      </div>

      {/* Top navbar — fixed, z-50 */}
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        projectName={project.name}
        onShareClick={isOwner ? () => setIsShareOpen(true) : undefined}
        isAISidebarOpen={isAISidebarOpen}
        onToggleAI={() => setIsAISidebarOpen((prev) => !prev)}
      />

      {/* Left project sidebar — fixed, slides in from left, z-40 */}
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

      {/* Right AI panel — fixed, slides in from right, z-40 */}
      <aside
        className="fixed top-12 right-0 bottom-0 z-40 w-80 bg-elevated border-l border-surface-border shadow-2xl flex items-center justify-center transition-transform duration-200 ease-in-out"
        aria-hidden={!isAISidebarOpen}
        style={{
          transform: isAISidebarOpen ? 'translateX(0)' : 'translateX(100%)',
          pointerEvents: isAISidebarOpen ? 'auto' : 'none',
        }}
      >
        <p className="text-copy-faint text-sm">AI chat coming soon</p>
      </aside>

      {/* Dialogs */}
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
