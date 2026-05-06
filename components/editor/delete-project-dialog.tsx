'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Project } from '@/lib/projects';

/** Props for the DeleteProjectDialog component. */
interface DeleteProjectDialogProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** The project to be deleted, or null when the dialog is closed. */
  project: Project | null;
  /** Called when the user confirms deletion. */
  onConfirm: () => void;
  /** Called when the dialog should close without deleting. */
  onClose: () => void;
  /** Disables interactive controls while a request is in flight. */
  isLoading: boolean;
}

/**
 * Destructive confirmation dialog for deleting a project.
 * No input — confirm button uses destructive styling.
 */
export function DeleteProjectDialog({ open, project, onConfirm, onClose, isLoading }: DeleteProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-copy-primary">Delete Project</DialogTitle>
          {project && (
            <DialogDescription>
              <span className="text-copy-primary font-medium">{project.name}</span> will be
              permanently deleted. This action cannot be undone.
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting…' : 'Delete Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
