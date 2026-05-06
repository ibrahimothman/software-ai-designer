import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ui } from '@clerk/ui';
import { dark } from '@clerk/ui/themes';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Ghost AI',
  description: 'Real-time collaborative system design workspace',
};

/**
 * Root layout. Wraps the entire app with ClerkProvider using the bundled
 * dark theme overridden with the project's CSS custom property tokens.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      ui={ui}
      appearance={{
        theme: dark,
        variables: {
          colorBackground: 'var(--bg-surface)',
          colorInput: 'var(--bg-elevated)',
          colorInputForeground: 'var(--text-primary)',
          colorForeground: 'var(--text-primary)',
          colorPrimary: 'var(--accent-primary)',
          colorBorder: 'var(--border-default)',
          colorMutedForeground: 'var(--text-muted)',
        },
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
