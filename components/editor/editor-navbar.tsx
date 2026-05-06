'use client';

import { PanelLeftClose, PanelLeftOpen, Share2, Sparkles } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

/** Props for the editor top navigation bar. */
interface EditorNavbarProps {
  /** Whether the project sidebar is currently open. */
  isSidebarOpen: boolean;
  /** Callback to toggle the sidebar open/closed. */
  onToggleSidebar: () => void;
  /** Optional project name shown in the center of the navbar (workspace mode only). */
  projectName?: string;
  /** Optional callback for the Share button (workspace mode only). */
  onShareClick?: () => void;
  /** Whether the AI sidebar panel is currently open (workspace mode only). */
  isAISidebarOpen?: boolean;
  /** Optional callback to toggle the AI sidebar (workspace mode only). */
  onToggleAI?: () => void;
}

/**
 * Fixed top navigation bar for the editor.
 * In home mode: sidebar toggle on the left, UserButton on the right.
 * In workspace mode: also shows project name in center, share button, and AI panel toggle.
 */
export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  projectName,
  onShareClick,
  isAISidebarOpen,
  onToggleAI,
}: EditorNavbarProps) {
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

      <div className="flex-1 flex items-center justify-center">
        {projectName && (
          <span className="text-sm font-medium text-copy-primary truncate max-w-xs">
            {projectName}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        {onShareClick && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onShareClick}
            className="gap-1.5 text-copy-muted hover:text-copy-primary"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}
        {onToggleAI && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleAI}
            className={isAISidebarOpen ? 'text-ai' : 'text-copy-muted hover:text-copy-primary'}
            aria-label="Toggle AI sidebar"
          >
            <Sparkles className="h-5 w-5" />
          </Button>
        )}
        <UserButton />
      </div>
    </header>
  );
}
