'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditorNavbar } from '@/components/editor/editor-navbar';
import { ProjectSidebar } from '@/components/editor/project-sidebar';
import { CreateProjectDialog } from '@/components/editor/create-project-dialog';
import { RenameProjectDialog } from '@/components/editor/rename-project-dialog';
import { DeleteProjectDialog } from '@/components/editor/delete-project-dialog';
import { useProjectDialogs } from '@/hooks/use-project-dialogs';
import { MOCK_PROJECTS } from '@/lib/mock-projects';

/** Editor workspace page — home screen and sidebar wired to project dialogs. */
export default function EditorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dialogs = useProjectDialogs();

  return (
    <div className="h-screen bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projects={MOCK_PROJECTS}
        onNewProject={dialogs.openCreate}
        onRenameProject={dialogs.openRename}
        onDeleteProject={dialogs.openDelete}
      />

      <main className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <h1 className="text-xl font-semibold text-copy-primary">
            Create a project or open an existing one
          </h1>
          <p className="text-sm text-copy-muted max-w-sm">
            Start a new architecture workspace, or choose a project from the sidebar.
          </p>
          <Button onClick={dialogs.openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </main>

      <CreateProjectDialog
        open={dialogs.activeDialog.type === 'create'}
        formName={dialogs.formName}
        onFormNameChange={dialogs.setFormName}
        onClose={dialogs.closeAll}
      />
      <RenameProjectDialog
        open={dialogs.activeDialog.type === 'rename'}
        project={dialogs.activeDialog.type === 'rename' ? dialogs.activeDialog.project : null}
        formName={dialogs.formName}
        onFormNameChange={dialogs.setFormName}
        onClose={dialogs.closeAll}
      />
      <DeleteProjectDialog
        open={dialogs.activeDialog.type === 'delete'}
        project={dialogs.activeDialog.type === 'delete' ? dialogs.activeDialog.project : null}
        onClose={dialogs.closeAll}
      />
    </div>
  );
}
