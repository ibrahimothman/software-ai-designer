import type { Node, Edge } from '@xyflow/react'

/** Data attached to every canvas node. */
export interface CanvasNodeData extends Record<string, unknown> {
  /** Human-readable label displayed on the node. */
  label: string
  /** Optional accent color for the node. */
  color?: string
  /** Optional shape descriptor for the node renderer. */
  shape?: string
}

/** A typed React Flow node for the canvas. */
export type CanvasNode = Node<CanvasNodeData, 'canvasNode'>

/** A typed React Flow edge for the canvas. */
export type CanvasEdge = Edge<Record<string, unknown>, 'canvasEdge'>
