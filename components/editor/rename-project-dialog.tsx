'use client';

import type { KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
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

/** Props for the RenameProjectDialog component. */
interface RenameProjectDialogProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** The project being renamed, or null when the dialog is closed. */
  project: MockProject | null;
  /** Current controlled value of the name input, prefilled with the project's name. */
  formName: string;
  /** Called whenever the name input changes. */
  onFormNameChange: (name: string) => void;
  /** Called when the dialog should close (cancel or submit). */
  onClose: () => void;
}

/**
 * Dialog for renaming an existing project.
 * Input is auto-focused and submits on Enter.
 */
export function RenameProjectDialog({
  open,
  project,
  formName,
  onFormNameChange,
  onClose,
}: RenameProjectDialogProps) {
  /** Submits on Enter if the name is non-empty. */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && formName.trim()) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-copy-primary">Rename Project</DialogTitle>
          {project && (
            <DialogDescription>
              Renaming <span className="text-copy-primary font-medium">{project.name}</span>.
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="py-2">
          <Input
            className="text-copy-primary"
            placeholder="Project name"
            value={formName}
            onChange={(e) => onFormNameChange(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button disabled={!formName.trim()} onClick={onClose}>Rename</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
