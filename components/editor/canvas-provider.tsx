'use client'

import { Component, type ReactNode } from 'react'
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from '@liveblocks/react'
import { Canvas } from '@/components/editor/canvas'

/** Props for the top-level canvas room wrapper. */
interface CanvasProviderProps {
  /** The Liveblocks room ID (== project ID) to connect to. */
  roomId: string
}

/** Simple React error boundary for Liveblocks connection failures. */
class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex h-full items-center justify-center">
          <p className="text-copy-faint text-sm">
            Failed to connect to the canvas. Please refresh.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

/**
 * Sets up the Liveblocks room for the collaborative canvas.
 * Wraps children with LiveblocksProvider, RoomProvider, Suspense, and an error boundary.
 */
export function CanvasProvider({ roomId }: CanvasProviderProps) {
  return (
    <CanvasErrorBoundary>
      <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
        <RoomProvider
          id={roomId}
          initialPresence={{ cursor: null, isThinking: false }}
        >
          <ClientSideSuspense
            fallback={
              <div className="flex h-full items-center justify-center">
                <p className="text-copy-faint text-sm">Connecting…</p>
              </div>
            }
          >
            <Canvas />
          </ClientSideSuspense>
        </RoomProvider>
      </LiveblocksProvider>
    </CanvasErrorBoundary>
  )
}
