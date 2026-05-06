'use client';

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

/** Props for the editor top navigation bar. */
interface EditorNavbarProps {
  /** Whether the project sidebar is currently open. */
  isSidebarOpen: boolean;
  /** Callback to toggle the sidebar open/closed. */
  onToggleSidebar: () => void;
}

/**
 * Fixed top navigation bar for the editor workspace.
 * Contains the sidebar toggle on the left and the Clerk UserButton on the right.
 */
export function EditorNavbar({ isSidebarOpen, onToggleSidebar }: EditorNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center px-3 bg-surface border-b border-surface-border">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-copy-muted hover:text-copy-primary"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex-1" />
      <div className="flex items-center">
        <UserButton />
      </div>
    </header>
  );
}
