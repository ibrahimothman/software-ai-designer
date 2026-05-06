import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

interface RouteContext {
  params: Promise<{ projectId: string }>
}

interface RenameProjectBody {
  name?: unknown
}

/**
 * Renames a project owned by the authenticated user.
 * Returns 401 if unauthenticated, 403 if the caller is not the owner,
 * 404 if the project does not exist, and 200 with the updated project on success.
 */
export async function PATCH(request: Request, { params }: RouteContext) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId } = await params

  let body: RenameProjectBody
  try {
    body = (await request.json()) as RenameProjectBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const rawName = body?.name
  if (typeof rawName !== 'string' || rawName.trim().length === 0) {
    return NextResponse.json({ error: 'name is required and must be a non-empty string' }, { status: 400 })
  }

  const existing = await prisma.project.findFirst({ where: { id: projectId } })
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (existing.ownerId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data: { name: rawName.trim() },
  })

  return NextResponse.json({ project })
}

/**
 * Deletes a project owned by the authenticated user.
 * Returns 401 if unauthenticated, 403 if the caller is not the owner,
 * 404 if the project does not exist, and 204 on success.
 */
export async function DELETE(_request: Request, { params }: RouteContext) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId } = await params

  const existing = await prisma.project.findFirst({ where: { id: projectId } })
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (existing.ownerId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.project.delete({ where: { id: projectId } })

  return new NextResponse(null, { status: 204 })
}
