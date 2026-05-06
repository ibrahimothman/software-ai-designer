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

/** Derives a URL-safe slug from a project name. */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Props for the CreateProjectDialog component. */
interface CreateProjectDialogProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Current controlled value of the project name input. */
  formName: string;
  /** Called whenever the name input changes. */
  onFormNameChange: (name: string) => void;
  /** Called when the dialog should close (cancel or submit). */
  onClose: () => void;
}

/**
 * Dialog for creating a new project.
 * Shows a name input with a live slug preview that updates as the user types.
 */
export function CreateProjectDialog({
  open,
  formName,
  onFormNameChange,
  onClose,
}: CreateProjectDialogProps) {
  const slug = generateSlug(formName);

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
          />
          {formName && (
            <p className="text-xs text-copy-muted font-mono px-1">
              <span className="text-copy-primary">{slug || '—'}</span>
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button disabled={!formName.trim()} onClick={onClose}>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
