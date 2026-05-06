import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

/** Shape of a user suggestion returned by the search endpoint. */
interface UserSuggestion {
  /** Primary email address. */
  email: string
  /** Full display name, or null if not set. */
  name: string | null
  /** Clerk avatar URL. */
  imageUrl: string
}

/**
 * Searches Clerk users by name or email for the invite typeahead.
 * Requires authentication. Query param `q` must be at least 2 characters.
 * Returns up to 10 matching users.
 */
export async function GET(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() ?? ''

  if (q.length < 2) {
    return NextResponse.json({ users: [] })
  }

  const clerk = await clerkClient()
  const result = await clerk.users.getUserList({ query: q, limit: 10 })

  const users: UserSuggestion[] = result.data.map((u) => {
    const primaryEmail =
      u.emailAddresses.find((ea) => ea.id === u.primaryEmailAddressId)
        ?.emailAddress ?? u.emailAddresses[0]?.emailAddress ?? ''
    const name =
      [u.firstName, u.lastName].filter(Boolean).join(' ') || null
    return { email: primaryEmail, name, imageUrl: u.imageUrl }
  }).filter((u) => u.email !== '')

  return NextResponse.json({ users })
}
