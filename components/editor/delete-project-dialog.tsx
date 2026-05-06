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
import type { MockProject } from '@/lib/mock-projects';

/** Props for the DeleteProjectDialog component. */
interface DeleteProjectDialogProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** The project to be deleted, or null when the dialog is closed. */
  project: MockProject | null;
  /** Called when the dialog should close (cancel or confirm). */
  onClose: () => void;
}

/**
 * Destructive confirmation dialog for deleting a project.
 * No input — confirm button uses destructive styling.
 */
export function DeleteProjectDialog({ open, project, onClose }: DeleteProjectDialogProps) {
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
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onClose}>Delete Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
