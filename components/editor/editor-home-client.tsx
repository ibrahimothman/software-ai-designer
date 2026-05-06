'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditorNavbar } from '@/components/editor/editor-navbar';
import { ProjectSidebar } from '@/components/editor/project-sidebar';
import { CreateProjectDialog } from '@/components/editor/create-project-dialog';
import { RenameProjectDialog } from '@/components/editor/rename-project-dialog';
import { DeleteProjectDialog } from '@/components/editor/delete-project-dialog';
import { useProjectActions } from '@/hooks/use-project-actions';
import type { Project } from '@/lib/projects';

/** Props passed down from the server-rendered editor home page. */
interface EditorHomeClientProps {
  /** Projects owned by the current user. */
  ownedProjects: Project[];
  /** Projects the current user is a collaborator on. */
  sharedProjects: Project[];
}

/**
 * Client shell for the editor home page.
 * Receives pre-fetched project lists from the server and wires all interactive state.
 */
export function EditorHomeClient({ ownedProjects, sharedProjects }: EditorHomeClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const actions = useProjectActions();

  return (
    <div className="h-screen bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        onNewProject={actions.openCreate}
        onRenameProject={actions.openRename}
        onDeleteProject={actions.openDelete}
      />

      <main className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <h1 className="text-xl font-semibold text-copy-primary">
            Create a project or open an existing one
          </h1>
          <p className="text-sm text-copy-muted max-w-sm">
            Start a new architecture workspace, or choose a project from the sidebar.
          </p>
          <Button onClick={actions.openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </main>

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
