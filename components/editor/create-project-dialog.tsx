'use client';

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

/** Props for the CreateProjectDialog component. */
interface CreateProjectDialogProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Current controlled value of the project name input. */
  formName: string;
  /** Called whenever the name input changes. */
  onFormNameChange: (name: string) => void;
  /** Pre-computed room ID preview shown below the name input. */
  roomIdPreview: string;
  /** Called with the final name when the user confirms. */
  onSubmit: (name: string) => void;
  /** Called when the dialog should close without submitting. */
  onClose: () => void;
  /** Disables interactive controls while a request is in flight. */
  isLoading: boolean;
}

/**
 * Dialog for creating a new project.
 * Shows a name input with a live room ID preview that updates as the user types.
 */
export function CreateProjectDialog({
  open,
  formName,
  onFormNameChange,
  roomIdPreview,
  onSubmit,
  onClose,
  isLoading,
}: CreateProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-copy-primary">New Project</DialogTitle>
          <DialogDescription>Give your architecture workspace a name.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input
            className="text-copy-primary"
            placeholder="Project name"
            value={formName}
            onChange={(e) => onFormNameChange(e.target.value)}
            autoFocus
            disabled={isLoading}
          />
          {formName && (
            <p className="text-xs text-copy-muted font-mono px-1">
              Room ID: <span className="text-copy-primary">{roomIdPreview || '—'}</span>
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button
            disabled={!formName.trim() || isLoading}
            onClick={() => onSubmit(formName)}
          >
            {isLoading ? 'Creating…' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
