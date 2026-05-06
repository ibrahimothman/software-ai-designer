import Link from 'next/link';
import { Lock } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Shown when a project does not exist or the current user lacks access.
 * Provides a centered message and a link back to the editor home.
 */
export function AccessDenied() {
  return (
    <div className="h-screen bg-base flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <Lock className="h-8 w-8 text-copy-faint" />
        <h1 className="text-xl font-semibold text-copy-primary">Access Denied</h1>
        <p className="text-sm text-copy-muted max-w-sm">
          This project doesn&apos;t exist or you don&apos;t have permission to view it.
        </p>
        <Link
          href="/editor"
          className={cn(buttonVariants({ variant: 'ghost' }))}
        >
          Back to Editor
        </Link>
      </div>
    </div>
  );
}
