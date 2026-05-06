'use client';

import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Project } from '@/lib/projects';

/** Props for the floating project sidebar. */
interface ProjectSidebarProps {
  /** Whether the sidebar is currently visible. */
  isOpen: boolean;
  /** Callback to close the sidebar. */
  onClose: () => void;
  /** Projects owned by the current user. */
  ownedProjects: Project[];
  /** Projects the current user is a collaborator on. */
  sharedProjects: Project[];
  /** Opens the Create Project dialog. */
  onNewProject: () => void;
  /** Opens the Rename Project dialog for the given project. */
  onRenameProject: (project: Project) => void;
  /** Opens the Delete Project dialog for the given project. */
  onDeleteProject: (project: Project) => void;
}

/** Props for a single project list item. */
interface ProjectItemProps {
  /** The project to display. */
  project: Project;
  /** Whether to show rename/delete actions on hover. */
  showActions: boolean;
  /** Opens the rename dialog for this project. */
  onRename: (project: Project) => void;
  /** Opens the delete dialog for this project. */
  onDelete: (project: Project) => void;
}

/** A single project row with optional hover actions for owned projects. */
function ProjectItem({ project, showActions, onRename, onDelete }: ProjectItemProps) {
  return (
    <div className="group flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-subtle cursor-pointer">
      <span className="flex-1 text-sm text-copy-primary truncate">{project.name}</span>
      {showActions && (
        <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onRename(project); }}
            className="p-1 rounded-lg text-copy-muted hover:text-copy-primary hover:bg-subtle transition-colors"
            aria-label={`Rename ${project.name}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(project); }}
            className="p-1 rounded-lg text-copy-muted hover:text-error transition-colors"
            aria-label={`Delete ${project.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Floating project sidebar with tabs for owned and shared projects.
 * Includes a mobile backdrop scrim that closes the sidebar on tap.
 */
export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  onNewProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 sm:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed top-12 left-0 z-40 h-[calc(100vh-3rem)] w-72 bg-elevated border-r border-surface-border flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 h-12 border-b border-surface-border shrink-0">
          <h2 className="text-copy-primary text-sm font-semibold">Projects</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-copy-muted hover:text-copy-primary"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <Tabs defaultValue="my-projects" className="flex-1 min-h-0 pt-3 flex flex-col">
            <TabsList className="mx-4 w-[calc(100%-2rem)] shrink-0">
              <TabsTrigger value="my-projects" className="flex-1">My Projects</TabsTrigger>
              <TabsTrigger value="shared" className="flex-1">Shared</TabsTrigger>
            </TabsList>

            <TabsContent value="my-projects" className="flex-1 overflow-y-auto mt-1 px-2">
              {ownedProjects.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-copy-faint text-sm">No projects yet</p>
                </div>
              ) : (
                <ul className="py-2 space-y-0.5">
                  {ownedProjects.map((project) => (
                    <li key={project.id}>
                      <ProjectItem
                        project={project}
                        showActions
                        onRename={onRenameProject}
                        onDelete={onDeleteProject}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="shared" className="flex-1 overflow-y-auto mt-1 px-2">
              {sharedProjects.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-copy-faint text-sm">No shared projects</p>
                </div>
              ) : (
                <ul className="py-2 space-y-0.5">
                  {sharedProjects.map((project) => (
                    <li key={project.id}>
                      <ProjectItem
                        project={project}
                        showActions={false}
                        onRename={onRenameProject}
                        onDelete={onDeleteProject}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-4 border-t border-surface-border shrink-0">
          <Button className="w-full gap-2" onClick={onNewProject}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}
