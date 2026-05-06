import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'
import type { Project } from './projects'

/** Clerk identity resolved for the current request. */
export interface CallerIdentity {
  /** Clerk user ID. */
  userId: string
  /** Primary email address, or empty string if unavailable. */
  email: string
}

/**
 * Returns the authenticated caller's userId and primary email.
 * Returns null when the request is unauthenticated.
 */
export async function getCallerIdentity(): Promise<CallerIdentity | null> {
  const { userId } = await auth()
  if (!userId) return null

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? ''
  return { userId, email }
}

/**
 * Returns the project if the caller is the owner or an active collaborator.
 * Returns null when the project does not exist or the caller has no access.
 */
export async function getProjectIfAccessible(
  projectId: string,
  caller: CallerIdentity,
): Promise<Project | null> {
  const project = await prisma.project.findFirst({
    where: { id: projectId },
    select: { id: true, name: true, ownerId: true },
  })

  if (!project) return null
  if (project.ownerId === caller.userId) return project

  const collab = await prisma.projectCollaborator.findFirst({
    where: { projectId, email: caller.email },
  })

  return collab ? project : null
}
