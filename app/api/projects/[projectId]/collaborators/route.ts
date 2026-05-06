import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { getCallerIdentity, getProjectIfAccessible } from '@/lib/project-access'

interface RouteContext {
  params: Promise<{ projectId: string }>
}

/** Enriched collaborator shape returned by the list endpoint. */
interface EnrichedCollaborator {
  /** Collaborator email address. */
  email: string
  /** Display name from Clerk, or null when no matching Clerk account is found. */
  name: string | null
  /** Avatar URL from Clerk, or null when no matching Clerk account is found. */
  imageUrl: string | null
}

/**
 * Lists all collaborators on a project, enriched with Clerk display names and avatars.
 * The caller must be the owner or an existing collaborator.
 */
export async function GET(_request: Request, { params }: RouteContext) {
  const caller = await getCallerIdentity()
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId } = await params

  const project = await getProjectIfAccessible(projectId, caller)
  if (!project) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const collabs = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: 'asc' },
  })

  if (collabs.length === 0) {
    return NextResponse.json({ collaborators: [] })
  }

  const emails = collabs.map((c) => c.email)
  const clerk = await clerkClient()
  const usersResult = await clerk.users.getUserList({ emailAddress: emails, limit: 100 })

  const clerkByEmail = new Map(
    usersResult.data.flatMap((u) =>
      u.emailAddresses.map((ea) => [ea.emailAddress, u]),
    ),
  )

  const enriched: EnrichedCollaborator[] = collabs.map((c) => {
    const u = clerkByEmail.get(c.email) ?? null
    const name = u
      ? [u.firstName, u.lastName].filter(Boolean).join(' ') || null
      : null
    return { email: c.email, name, imageUrl: u?.imageUrl ?? null }
  })

  return NextResponse.json({ collaborators: enriched })
}

/** Request body for inviting a collaborator. */
interface InviteBody {
  email?: unknown
}

/**
 * Invites a collaborator by email. Only the project owner may invite.
 * Returns 409 if the email is already a collaborator.
 */
export async function POST(request: Request, { params }: RouteContext) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId } = await params

  const project = await prisma.project.findFirst({
    where: { id: projectId },
    select: { id: true, ownerId: true },
  })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (project.ownerId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let body: InviteBody
  try {
    body = (await request.json()) as InviteBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const rawEmail = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!rawEmail || !rawEmail.includes('@')) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
  }

  const existing = await prisma.projectCollaborator.findFirst({
    where: { projectId, email: rawEmail },
  })
  if (existing) return NextResponse.json({ error: 'Already a collaborator' }, { status: 409 })

  await prisma.projectCollaborator.create({ data: { projectId, email: rawEmail } })

  return NextResponse.json({ collaborator: { email: rawEmail } }, { status: 201 })
}
