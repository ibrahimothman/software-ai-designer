import { useState } from 'react';
import type { MockProject } from '@/lib/mock-projects';

/** Discriminated union of the three dialog types plus a closed state. */
type ActiveDialog =
  | { type: 'create' }
  | { type: 'rename'; project: MockProject }
  | { type: 'delete'; project: MockProject }
  | { type: null };

/** Return type of the useProjectDialogs hook. */
export interface UseProjectDialogsReturn {
  /** Descriptor for the currently-open dialog, or `{ type: null }` when closed. */
  activeDialog: ActiveDialog;
  /** Controlled name value shared by the Create and Rename dialogs. */
  formName: string;
  /** Updates the controlled name value. */
  setFormName: (name: string) => void;
  /** True while a simulated async operation is running (always false for mock data). */
  isLoading: boolean;
  /** Opens the Create Project dialog and resets the form. */
  openCreate: () => void;
  /** Opens the Rename Project dialog prefilled with the project's current name. */
  openRename: (project: MockProject) => void;
  /** Opens the Delete Project dialog targeting the given project. */
  openDelete: (project: MockProject) => void;
  /** Closes any open dialog and resets transient form state. */
  closeAll: () => void;
}

/**
 * Manages dialog state, form state, and loading state for all project dialogs.
 * Uses mock data only — no API calls or persistence.
 */
export function useProjectDialogs(): UseProjectDialogsReturn {
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>({ type: null });
  const [formName, setFormName] = useState('');
  const [isLoading] = useState(false);

  /** Opens the Create Project dialog and resets the name form. */
  const openCreate = () => {
    setFormName('');
    setActiveDialog({ type: 'create' });
  };

  /** Opens the Rename dialog with the project's current name prefilled. */
  const openRename = (project: MockProject) => {
    setFormName(project.name);
    setActiveDialog({ type: 'rename', project });
  };

  /** Opens the Delete confirmation dialog for the given project. */
  const openDelete = (project: MockProject) => {
    setActiveDialog({ type: 'delete', project });
  };

  /** Closes all dialogs and clears form state. */
  const closeAll = () => {
    setActiveDialog({ type: null });
    setFormName('');
  };

  return { activeDialog, formName, setFormName, isLoading, openCreate, openRename, openDelete, closeAll };
}
