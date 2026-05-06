import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

interface CreateProjectBody {
  name?: unknown
}

/**
 * Lists the authenticated user's projects.
 */
export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ projects })
}

/**
 * Creates a new project owned by the authenticated user.
 */
export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: CreateProjectBody
  try {
    body = (await request.json()) as CreateProjectBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const rawName = body?.name
  if (rawName !== undefined && typeof rawName !== 'string') {
    return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
  }

  const name =
    typeof rawName === 'string' && rawName.trim().length > 0
      ? rawName.trim()
      : 'Untitled Project'

  const project = await prisma.project.create({
    data: {
      ownerId: userId,
      name,
    },
  })

  return NextResponse.json({ project }, { status: 201 })
}
