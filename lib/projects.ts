import { prisma } from './prisma'

/** Minimal project shape used throughout the UI. */
export interface Project {
  /** Unique project identifier (cuid). */
  id: string
  /** Human-readable display name. */
  name: string
  /** Clerk user ID of the project owner. */
  ownerId: string
}

/**
 * Returns all projects owned by the given user, ordered newest-first.
 */
export async function getOwnedProjects(userId: string): Promise<Project[]> {
  return prisma.project.findMany({
    where: { ownerId: userId },
    select: { id: true, name: true, ownerId: true },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Returns all projects where the given email is a collaborator, ordered newest-first.
 */
export async function getSharedProjects(userEmail: string): Promise<Project[]> {
  const collabs = await prisma.projectCollaborator.findMany({
    where: { email: userEmail },
    include: {
      project: {
        select: { id: true, name: true, ownerId: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  return collabs.map((c) => c.project)
}
