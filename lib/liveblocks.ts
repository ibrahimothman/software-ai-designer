import { Liveblocks } from '@liveblocks/node'

/** Fixed palette of hex colors assigned to cursors deterministically. */
const CURSOR_COLORS = [
  '#F87171', // red-400
  '#FB923C', // orange-400
  '#FBBF24', // amber-400
  '#4ADE80', // green-400
  '#34D399', // emerald-400
  '#22D3EE', // cyan-400
  '#60A5FA', // blue-400
  '#A78BFA', // violet-400
  '#F472B6', // pink-400
  '#E879F9', // fuchsia-400
] as const

/**
 * Returns a consistent hex cursor color for a given user ID.
 * The same userId always maps to the same color within the palette.
 */
export function getCursorColor(userId: string): string {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0
  }
  return CURSOR_COLORS[hash % CURSOR_COLORS.length]
}

function createLiveblocksClient(): Liveblocks {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY
  if (!secret) throw new Error('LIVEBLOCKS_SECRET_KEY is not set')
  return new Liveblocks({ secret })
}

const globalForLiveblocks = globalThis as unknown as {
  liveblocks: Liveblocks | undefined
}

/** Shared Liveblocks node client — cached on globalThis in development. */
export const liveblocks: Liveblocks =
  globalForLiveblocks.liveblocks ?? createLiveblocksClient()

if (process.env.NODE_ENV !== 'production') {
  globalForLiveblocks.liveblocks = liveblocks
}
