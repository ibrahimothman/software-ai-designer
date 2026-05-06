'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { Project } from '@/lib/projects'

/** Generates a short alphanumeric suffix for room ID previews. */
function generateSuffix(): string {
  return Math.random().toString(36).slice(2, 8)
}

/** Derives a URL-safe slug from a project name. */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Discriminated union of the three dialog types plus a closed state. */
type ActiveDialog =
  | { type: 'create' }
  | { type: 'rename'; project: Project }
  | { type: 'delete'; project: Project }
  | { type: null }

/** Return type of the useProjectActions hook. */
export interface UseProjectActionsReturn {
  /** Descriptor for the currently-open dialog, or `{ type: null }` when closed. */
  activeDialog: ActiveDialog
  /** Controlled name value shared by the Create and Rename dialogs. */
  formName: string
  /** Updates the controlled name value. */
  setFormName: (name: string) => void
  /** True while an API request is in flight. */
  isLoading: boolean
  /**
   * Live room ID preview derived from the current formName and a stable suffix.
   * Empty string when formName is blank.
   */
  roomIdPreview: string
  /** Opens the Create Project dialog and resets the form. */
  openCreate: () => void
  /** Opens the Rename Project dialog prefilled with the project's current name. */
  openRename: (project: Project) => void
  /** Opens the Delete confirmation dialog for the given project. */
  openDelete: (project: Project) => void
  /** Closes any open dialog and resets transient form state. */
  closeAll: () => void
  /** POSTs a new project and navigates to its workspace on success. */
  handleCreate: (name: string) => Promise<void>
  /** PATCHes the active rename target and refreshes on success. */
  handleRename: (name: string) => Promise<void>
  /** DELETEs the active delete target; redirects to /editor if it was the active workspace. */
  handleDelete: () => Promise<void>
}

/**
 * Manages dialog state and project mutations against the project REST API.
 * Handles navigation and page refresh on success.
 */
export function useProjectActions(): UseProjectActionsReturn {
  const router = useRouter()
  const pathname = usePathname()

  const [activeDialog, setActiveDialog] = useState<ActiveDialog>({ type: null })
  const [formName, setFormName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suffix] = useState(generateSuffix)

  const roomIdPreview = formName.trim() ? `${slugify(formName)}-${suffix}` : ''

  const openCreate = () => {
    setFormName('')
    setActiveDialog({ type: 'create' })
  }

  const openRename = (project: Project) => {
    setFormName(project.name)
    setActiveDialog({ type: 'rename', project })
  }

  const openDelete = (project: Project) => {
    setActiveDialog({ type: 'delete', project })
  }

  const closeAll = () => {
    setActiveDialog({ type: null })
    setFormName('')
  }

  const handleCreate = async (name: string) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || 'Untitled Project' }),
      })
      const data = (await res.json()) as { project: Project }
      closeAll()
      router.push(`/editor/${data.project.id}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRename = async (name: string) => {
    if (activeDialog.type !== 'rename') return
    const { project } = activeDialog
    setIsLoading(true)
    try {
      await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      closeAll()
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (activeDialog.type !== 'delete') return
    const { project } = activeDialog
    setIsLoading(true)
    try {
      await fetch(`/api/projects/${project.id}`, { method: 'DELETE' })
      closeAll()
      if (pathname === `/editor/${project.id}`) {
        router.push('/editor')
      } else {
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    activeDialog,
    formName,
    setFormName,
    isLoading,
    roomIdPreview,
    openCreate,
    openRename,
    openDelete,
    closeAll,
    handleCreate,
    handleRename,
    handleDelete,
  }
}
