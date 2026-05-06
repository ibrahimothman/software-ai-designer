import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { liveblocks, getCursorColor } from '@/lib/liveblocks'
import { getCallerIdentity, getProjectIfAccessible } from '@/lib/project-access'

/**
 * POST /api/liveblocks-auth
 *
 * Authenticates a Clerk user for a Liveblocks room scoped to a project.
 * The project ID is used as the Liveblocks room ID.
 *
 * Returns 401 when unauthenticated, 403 when the caller has no project access.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const caller = await getCallerIdentity()
  if (!caller) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const roomId =
    body !== null &&
    typeof body === 'object' &&
    'room' in body &&
    typeof (body as Record<string, unknown>).room === 'string'
      ? (body as { room: string }).room
      : null

  if (!roomId) {
    return NextResponse.json({ error: 'Missing room' }, { status: 400 })
  }

  // Use projectId == roomId to verify access
  const project = await getProjectIfAccessible(roomId, caller)
  if (!project) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Fetch Clerk user profile for display metadata
  const user = await currentUser()
  const name =
    user?.fullName ?? user?.firstName ?? caller.email ?? 'Anonymous'
  const avatar = user?.imageUrl ?? ''
  const color = getCursorColor(caller.userId)

  // Ensure the Liveblocks room exists (no-op if already created)
  await liveblocks.getOrCreateRoom(roomId, { defaultAccesses: [] })

  const session = liveblocks.prepareSession(caller.userId, {
    userInfo: { name, avatar, color },
  })
  session.allow(roomId, session.FULL_ACCESS)

  const { status, body: responseBody } = await session.authorize()
  return new NextResponse(responseBody, { status })
}
