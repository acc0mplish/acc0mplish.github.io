import React, { useRef, useState } from 'react';
import {
  FlowNodeData,
  FlowEdgeData,
  LiveNodeRuntimeState,
  LiveEdgeRuntimeState,
  NODE_WIDTH,
  PORT_OFFSET_Y,
  computeOrthogonalPath,
  getPointAlongPolyline,
  computeMinimapRects,
} from '../utils/flowEngine';
import { FlowNodeCard } from './FlowNodeCard';

interface FlowCanvasProps {
  nodes: FlowNodeData[];
  edges: FlowEdgeData[];
  nodeRuntime: Record<string, LiveNodeRuntimeState>;
  edgeRuntime: Record<string, LiveEdgeRuntimeState>;
  selectedNodeId: string | null;
  zoom: number;
  onSelectNode: (nodeId: string) => void;
  onMoveNode: (nodeId: string, x: number, y: number) => void;
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  nodeRuntime,
  edgeRuntime,
  selectedNodeId,
  zoom,
  onSelectNode,
  onMoveNode,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dragState, setDragState] = useState<{
    nodeId: string;
    startClientX: number;
    startClientY: number;
    initialNodeX: number;
    initialNodeY: number;
  } | null>(null);

  const handleStartDrag = (nodeId: string, e: React.PointerEvent<HTMLDivElement>) => {
    const targetNode = nodes.find((n) => n.id === nodeId);
    if (!targetNode) return;
    e.stopPropagation();
    onSelectNode(nodeId);
    setDragState({
      nodeId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      initialNodeX: targetNode.x,
      initialNodeY: targetNode.y,
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState) return;
    const dx = (e.clientX - dragState.startClientX) / zoom;
    const dy = (e.clientY - dragState.startClientY) / zoom;
    const nextX = Math.max(12, Math.min(1180, Math.round(dragState.initialNodeX + dx)));
    const nextY = Math.max(16, Math.min(540, Math.round(dragState.initialNodeY + dy)));
    onMoveNode(dragState.nodeId, nextX, nextY);
  };

  const handlePointerUp = () => {
    if (dragState) {
      setDragState(null);
    }
  };

  // Determine which node is visually highlighted for the minimap
  const activeHighlightedId =
    selectedNodeId ||
    Object.values(nodeRuntime).find((r) => r.isExecutingNow)?.nodeId ||
    Object.values(nodeRuntime).find((r) => r.highlightBorder)?.nodeId ||
    null;

  const minimapRects = computeMinimapRects(nodes, activeHighlightedId, 184, 104, 14);

  return (
    <div
      ref={containerRef}
      data-testid="flow-canvas-viewport"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="relative flex-1 w-full h-full overflow-auto flow-dot-grid"
    >
      {/* Scaled Interactive Stage */}
      <div
        style={{
          width: '1130px',
          height: '560px',
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
        }}
        className="relative"
      >
        {/* SVG Orthogonal Connector Layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0"
          aria-hidden="true"
        >
          {edges.map((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const targetNode = nodes.find((n) => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const x1 = sourceNode.x + NODE_WIDTH;
            const y1 = sourceNode.y + PORT_OFFSET_Y;
            const x2 = targetNode.x;
            const y2 = targetNode.y + PORT_OFFSET_Y;

            const ortho = computeOrthogonalPath(x1, y1, x2, y2, 10);
            const eState = edgeRuntime[edge.id];
            const isFlowActive = eState?.state === 'active';
            const isCompleted = eState?.state === 'completed';
            const isSkipped = eState?.state === 'skipped';

            const particlePos =
              eState?.particleProgress !== null && eState?.particleProgress !== undefined
                ? getPointAlongPolyline(ortho.points, eState.particleProgress)
                : null;

            return (
              <g key={edge.id}>
                {/* Base dashed orthogonal connector */}
                <path
                  d={ortho.d}
                  fill="none"
                  stroke={
                    isFlowActive
                      ? 'var(--fm-accent)'
                      : isCompleted
                      ? 'var(--fm-muted)'
                      : isSkipped
                      ? 'var(--fm-control-border)'
                      : 'var(--fm-control-border)'
                  }
                  strokeWidth={isFlowActive ? 2.2 : 1.75}
                  strokeDasharray="4.5 4.5"
                  className={isFlowActive || isCompleted ? 'animate-flow-dash' : ''}
                />

                {/* Traveling JS motion signal particle */}
                {particlePos && (
                  <g transform={`translate(${particlePos.x}, ${particlePos.y})`}>
                    <circle r="7" fill="color-mix(in srgb, var(--fm-accent) 22%, transparent)" />
                    <circle r="3.5" fill="var(--fm-accent)" />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Branch Condition Labels ('예', '아니오') */}
        {edges.map((edge) => {
          if (!edge.label) return null;
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const targetNode = nodes.find((n) => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          const x1 = sourceNode.x + NODE_WIDTH;
          const y1 = sourceNode.y + PORT_OFFSET_Y;
          const x2 = targetNode.x;
          const y2 = targetNode.y + PORT_OFFSET_Y;

          const ortho = computeOrthogonalPath(x1, y1, x2, y2, 10);
          const eState = edgeRuntime[edge.id];
          const isBranchTaken = eState?.state === 'active' || eState?.state === 'completed';

          return (
            <div
              key={`label-${edge.id}`}
              style={{
                left: `${ortho.labelX}px`,
                top: `${ortho.labelY}px`,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 px-2.5 py-0.5 rounded-[8px] text-[12px] bg-[var(--fm-panel)] select-none pointer-events-none transition-colors ${
                isBranchTaken
                  ? 'border border-[var(--fm-muted)] font-semibold text-[var(--fm-text)] shadow-2xs'
                  : 'border border-[var(--fm-control-border)] font-medium text-[var(--fm-muted)]'
              }`}
            >
              {edge.label}
            </div>
          );
        })}

        {/* Workflow Node Cards */}
        {nodes.map((node) => {
          const runtime = nodeRuntime[node.id] || {
            nodeId: node.id,
            status: node.defaultStatus,
            durationLabel: node.defaultDurationText,
            isExecutingNow: false,
            highlightBorder: Boolean(node.defaultSelected),
            progressRatio: 1,
          };
          const hasIncomingEdge = edges.some((e) => e.target === node.id);

          return (
            <FlowNodeCard
              key={node.id}
              node={node}
              runtime={runtime}
              isSelected={selectedNodeId === node.id}
              hasIncomingEdge={hasIncomingEdge}
              onSelect={onSelectNode}
              onStartDrag={handleStartDrag}
            />
          );
        })}
      </div>

      {/* Bottom-Right Minimap (Matches reference screenshot) */}
      <div
        data-testid="flow-minimap"
        role="group"
        aria-label="플로우 미니맵"
        className="absolute right-6 bottom-6 w-[208px] h-[126px] rounded-[20px] bg-[var(--fm-panel)] border border-[var(--fm-border)] shadow-[0_8px_24px_-4px_color-mix(in_srgb,var(--fm-text)_6%,transparent)] p-2.5 z-20 hidden sm:block"
      >
        <div className="relative w-full h-full rounded-[12px] bg-[var(--fm-soft)] border border-[var(--fm-surface)] overflow-hidden">
          {minimapRects.map((rect) => (
            <button
              key={rect.id}
              type="button"
              aria-label={`미니맵 노드 ${rect.id} 포커스`}
              onClick={() => onSelectNode(rect.id)}
              style={{
                left: `${rect.x}px`,
                top: `${rect.y}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
              }}
              className={`absolute rounded-[3px] transition-colors cursor-pointer ${
                rect.isHighlighted
                  ? 'bg-[var(--fm-accent)] hover:bg-[var(--fm-accent-hover)]'
                  : 'bg-[var(--fm-control-border)]/80 hover:bg-[var(--fm-muted)]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
