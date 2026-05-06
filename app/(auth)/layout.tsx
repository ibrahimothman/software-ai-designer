import { Sparkles, Users, FileText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/** Feature item shown in the left branding panel. */
interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Features displayed in the left branding panel. */
const features: Feature[] = [
  {
    icon: Sparkles,
    title: 'AI-generated architectures',
    description: 'Describe your system in plain English and let Ghost AI map it to a structured canvas.',
  },
  {
    icon: Users,
    title: 'Real-time collaboration',
    description: 'Invite your team to the same canvas. See live cursors, edits, and presence indicators.',
  },
  {
    icon: FileText,
    title: 'Instant spec generation',
    description: 'Convert your final canvas into a Markdown technical spec with a single click.',
  },
];

/**
 * Auth layout: 50/50 split on large screens — surface-colored branding panel
 * on the left, base-colored form panel on the right. Small screens show the
 * form only.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-surface border-r border-surface-border shrink-0">
        <p className="text-brand font-mono font-bold text-lg">Ghost AI</p>

        <div>
          <h1 className="text-copy-primary text-4xl font-bold leading-tight mb-4">
            Design systems at the<br />speed of thoughts.
          </h1>
          <p className="text-copy-muted text-base mb-10 leading-relaxed max-w-sm">
            Describe your architecture in plain English. Ghost AI maps it to a shared
            canvas your whole team can refine in real time.
          </p>
          <ul className="space-y-5">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="h-9 w-9 rounded-xl bg-elevated border border-surface-border flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 text-ai-text text-primary" />
                </div>
                <div>
                  <p className="text-copy-primary text-sm font-medium leading-snug">{title}</p>
                  <p className="text-copy-muted text-xs leading-relaxed mt-1">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-copy-faint text-xs">© {new Date().getFullYear()} Ghost AI. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center p-8 bg-base">
        {children}
      </div>
    </div>
  );
}
