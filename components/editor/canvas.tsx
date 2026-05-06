'use client'

import '@xyflow/react/dist/style.css'
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  ConnectionMode,
} from '@xyflow/react'
import { useLiveblocksFlow } from '@liveblocks/react-flow'
import type { CanvasNode, CanvasEdge } from '@/types/canvas'

/**
 * Collaborative React Flow canvas backed by Liveblocks Storage.
 * Must be rendered inside a RoomProvider with ClientSideSuspense.
 */
export function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    })

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDelete={onDelete}
      connectionMode={ConnectionMode.Loose}
      fitView
    >
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
    </ReactFlow>
  )
}
