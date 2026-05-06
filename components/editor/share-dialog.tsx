'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Link2, Loader2, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/** Collaborator enriched with Clerk identity data. */
interface Collaborator {
  /** Email address stored in the database. */
  email: string;
  /** Display name from Clerk, or null if no account found. */
  name: string | null;
  /** Avatar URL from Clerk, or null if no account found. */
  imageUrl: string | null;
}

/** User suggestion from the Clerk search endpoint. */
interface UserSuggestion {
  /** Primary email address. */
  email: string;
  /** Display name, or null if not set. */
  name: string | null;
  /** Clerk avatar URL. */
  imageUrl: string;
}

/** Props for the ShareDialog component. */
interface ShareDialogProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** The project being shared. */
  projectId: string;
  /** Human-readable project name shown in the dialog heading. */
  projectName: string;
  /** True when the current user owns the project. */
  isOwner: boolean;
  /** Called when the dialog should close. */
  onClose: () => void;
}

/** Derives initials from a name or email for the avatar fallback. */
function getInitials(name: string | null, email: string): string {
  if (name) {
    const parts = name.split(' ').filter(Boolean);
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  }
  return email[0].toUpperCase();
}

/** Small circular avatar with image or initials fallback. */
function Avatar({
  name,
  email,
  imageUrl,
  size = 'md',
}: {
  name: string | null;
  email: string;
  imageUrl: string | null;
  size?: 'sm' | 'md';
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const initials = getInitials(name, email);
  const dim = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8';
  const text = size === 'sm' ? 'text-[10px]' : 'text-xs';

  if (imageUrl && !imgFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name ?? email}
        className={`${dim} rounded-full object-cover shrink-0`}
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <div className={`${dim} rounded-full bg-accent-dim flex items-center justify-center shrink-0`}>
      <span className={`${text} font-medium text-brand`}>{initials}</span>
    </div>
  );
}

/**
 * Share dialog for the workspace.
 * Owners can invite/remove collaborators and copy the project link.
 * Collaborators see the list read-only.
 */
export function ShareDialog({ open, projectId, projectName, isOwner, onClose }: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Typeahead state
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch collaborators whenever the dialog opens
  useEffect(() => {
    if (!open) return;
    setIsFetching(true);
    setInviteError(null);
    fetch(`/api/projects/${projectId}/collaborators`)
      .then((r) => r.json())
      .then((data: { collaborators: Collaborator[] }) => setCollaborators(data.collaborators))
      .catch(() => setCollaborators([]))
      .finally(() => setIsFetching(false));
  }, [open, projectId]);

  // Debounced Clerk user search
  useEffect(() => {
    if (inviteEmail.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSuggesting(true);
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(inviteEmail)}`);
        const data = (await res.json()) as { users: UserSuggestion[] };
        const existingEmails = new Set(collaborators.map((c) => c.email));
        const filtered = data.users.filter((u) => !existingEmails.has(u.email));
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSuggesting(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [inviteEmail, collaborators]);

  const selectSuggestion = (email: string) => {
    setInviteEmail(email);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleInvite = async (emailOverride?: string) => {
    const email = (emailOverride ?? inviteEmail).trim().toLowerCase();
    if (!email) return;
    setIsInviting(true);
    setInviteError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setInviteError(data.error ?? 'Failed to invite');
        return;
      }
      setInviteEmail('');
      setSuggestions([]);
      setShowSuggestions(false);
      const listRes = await fetch(`/api/projects/${projectId}/collaborators`);
      const listData = (await listRes.json()) as { collaborators: Collaborator[] };
      setCollaborators(listData.collaborators);
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemove = async (email: string) => {
    setRemovingEmail(email);
    try {
      await fetch(
        `/api/projects/${projectId}/collaborators/${encodeURIComponent(email)}`,
        { method: 'DELETE' },
      );
      setCollaborators((prev) => prev.filter((c) => c.email !== email));
    } finally {
      setRemovingEmail(null);
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputBlur = () => {
    // Delay hiding the dropdown so suggestion clicks can fire first
    blurTimerRef.current = setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleInputFocus = () => {
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    if (suggestions.length > 0) setShowSuggestions(true);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-copy-primary">Share Project</DialogTitle>
          <DialogDescription>
            {isOwner
              ? `Invite collaborators to ${projectName}.`
              : `People with access to ${projectName}.`}
          </DialogDescription>
        </DialogHeader>

        {isOwner && (
          <div className="relative flex gap-2 pt-1">
            <div className="relative flex-1">
              <Input
                className="w-full text-copy-primary"
                placeholder="Search by name or email…"
                type="text"
                value={inviteEmail}
                onChange={(e) => {
                  setInviteEmail(e.target.value);
                  setInviteError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { setShowSuggestions(false); void handleInvite(); }
                  if (e.key === 'Escape') setShowSuggestions(false);
                }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                disabled={isInviting}
              />

              {/* Suggestions dropdown */}
              {showSuggestions && (
                <ul className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl border border-surface-border bg-elevated shadow-lg overflow-hidden">
                  {isSuggesting ? (
                    <li className="flex items-center justify-center py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-copy-muted" />
                    </li>
                  ) : (
                    suggestions.map((s) => (
                      <li key={s.email}>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            // Prevent input blur from firing before click
                            e.preventDefault();
                            selectSuggestion(s.email);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-subtle transition-colors"
                        >
                          <Avatar name={s.name} email={s.email} imageUrl={s.imageUrl} size="sm" />
                          <div className="min-w-0">
                            {s.name && (
                              <p className="text-sm text-copy-primary truncate">{s.name}</p>
                            )}
                            <p className={`truncate ${s.name ? 'text-xs text-copy-muted' : 'text-sm text-copy-primary'}`}>
                              {s.email}
                            </p>
                          </div>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>

            <Button
              onClick={() => { setShowSuggestions(false); void handleInvite(); }}
              disabled={!inviteEmail.trim() || isInviting}
              size="sm"
            >
              {isInviting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Invite'}
            </Button>
          </div>
        )}

        {inviteError && (
          <p className="text-xs text-error -mt-1">{inviteError}</p>
        )}

        <div className="space-y-1 max-h-60 overflow-y-auto">
          {isFetching ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-copy-muted" />
            </div>
          ) : collaborators.length === 0 ? (
            <p className="text-sm text-copy-faint text-center py-4">No collaborators yet.</p>
          ) : (
            collaborators.map((c) => (
              <div key={c.email} className="flex items-center gap-3 px-1 py-1.5 rounded-xl">
                <Avatar name={c.name} email={c.email} imageUrl={c.imageUrl} />
                <div className="flex-1 min-w-0">
                  {c.name && (
                    <p className="text-sm font-medium text-copy-primary truncate">{c.name}</p>
                  )}
                  <p className={`text-xs truncate ${c.name ? 'text-copy-muted' : 'text-copy-primary text-sm'}`}>
                    {c.email}
                  </p>
                </div>
                {isOwner && (
                  <button
                    onClick={() => void handleRemove(c.email)}
                    disabled={removingEmail === c.email}
                    className="shrink-0 p-1.5 rounded-lg text-copy-muted hover:text-error hover:bg-subtle transition-colors disabled:opacity-50"
                    aria-label={`Remove ${c.email}`}
                  >
                    {removingEmail === c.email
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <UserMinus className="h-4 w-4" />}
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="border-t border-surface-border pt-3">
          <button
            onClick={() => void handleCopyLink()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-copy-muted hover:bg-subtle hover:text-copy-primary transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-success shrink-0" />
                <span className="text-success">Copied!</span>
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4 shrink-0" />
                <span>Copy project link</span>
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
