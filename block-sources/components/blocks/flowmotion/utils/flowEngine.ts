export type NodeStatus = 'success' | 'failed' | 'pending' | 'skipped' | 'running';

export type NodeIconType =
  | 'webhook'
  | 'branch'
  | 'database'
  | 'zap'
  | 'mail'
  | 'shield'
  | 'credit-card'
  | 'truck'
  | 'message';

export interface FlowNodeData {
  id: string;
  title: string;
  subtitle: string;
  icon: NodeIconType;
  isTrigger?: boolean;
  x: number;
  y: number;
  avatarType: 'female' | 'male';
  defaultDurationText: string;
  defaultStatus: NodeStatus;
  defaultSelected?: boolean;
  description?: string;
  payloadPreview?: string;
}

export interface FlowEdgeData {
  id: string;
  source: string;
  target: string;
  label?: string; // e.g., '예', '아니오'
  branchType?: 'yes' | 'no' | 'direct';
}

export interface ScenarioStepOutcome {
  nodeId: string;
  status: NodeStatus;
  durationSec: number | null; // null => '미실행'
  startMs: number;
  endMs: number;
  highlightBorder?: boolean;
}

export interface FlowScenario {
  id: string;
  name: string;
  badgeText: string;
  description: string;
  totalDurationMs: number;
  steps: Record<string, ScenarioStepOutcome>;
  activeEdges: string[];
  skippedEdges: string[];
}

export type FlowLayoutType =
  | 'orthogonal-step'
  | 'radial-stream-hub'
  | 'swimlane-etl-funnel'
  | 'cyclic-agent-ring'
  | 'vertical-region-tree'
  | 'ppt-chevron-funnel'
  | 'ppt-sequence-flowchart'
  | 'ppt-flywheel-infographic'
  | 'ppt-asis-tobe-bridge'
  | 'ppt-milestone-roadmap'
  | 'creative-zigzag-ribbon'
  | 'creative-lightbulb-brainstorm'
  | 'creative-strategy-pyramid'
  | 'creative-semicircle-radial-fan'
  | 'creative-hexagon-honeycomb'
  | 'cinematic-node-connect'
  | 'editorial-mcp-skill-compare'
  | 'it-pms-project'
  | 'it-design-system'
  | 'it-slack-chatops'
  | 'it-dev-cicd'
  | 'it-si-integration';





export interface FlowTemplate {
  id: string;
  number: string;
  layoutType: FlowLayoutType;
  layoutBadge: string;
  title: string;
  category: string;
  summary: string;
  triggerLabel: string;
  nodes: FlowNodeData[];
  edges: FlowEdgeData[];
  scenarios: FlowScenario[];
}

export const NODE_WIDTH = 246;
export const NODE_HEIGHT = 124;
export const PORT_OFFSET_Y = 68; // Matches reference screenshot port dot vertical position

export interface CubicBezierResult {
  d: string;
  p0: { x: number; y: number };
  p1: { x: number; y: number };
  p2: { x: number; y: number };
  p3: { x: number; y: number };
  midPoint: { x: number; y: number };
}

/**
 * Computes a smooth horizontal S-curve cubic bezier path between (x1, y1) and (x2, y2),
 * matching the stream fan-in and fan-out curves in reference image 2 (`image_cd7dbfb3.png`).
 */
export function computeCubicBezierPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  tension = 0.48
): CubicBezierResult {
  const dx = x2 - x1;
  const cx1 = x1 + dx * tension;
  const cy1 = y1;
  const cx2 = x2 - dx * tension;
  const cy2 = y2;

  const p0 = { x: x1, y: y1 };
  const p1 = { x: cx1, y: cy1 };
  const p2 = { x: cx2, y: cy2 };
  const p3 = { x: x2, y: y2 };

  const d = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
  const midPoint = getPointAlongCubicBezier(p0, p1, p2, p3, 0.5);

  return { d, p0, p1, p2, p3, midPoint };
}

/**
 * Evaluates a point { x, y } along a cubic bezier curve at parameter t in [0, 1].
 */
export function getPointAlongCubicBezier(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  t: number
): { x: number; y: number } {
  const u = Math.max(0, Math.min(1, t));
  const inv = 1 - u;
  const b0 = inv * inv * inv;
  const b1 = 3 * inv * inv * u;
  const b2 = 3 * inv * u * u;
  const b3 = u * u * u;

  return {
    x: b0 * p0.x + b1 * p1.x + b2 * p2.x + b3 * p3.x,
    y: b0 * p0.y + b1 * p1.y + b2 * p2.y + b3 * p3.y,
  };
}

export interface OrthogonalPathResult {
  d: string;
  points: Array<{ x: number; y: number }>;
  totalLength: number;
  labelX: number;
  labelY: number;
}

/**
 * Computes an orthogonal step path with smooth rounded corners between two ports,
 * matching the reference workflow diagram (`image_5355ae51.png`).
 */
export function computeOrthogonalPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cornerRadius = 10
): OrthogonalPathResult {
  const dy = y2 - y1;

  // Nearly horizontal line
  if (Math.abs(dy) <= 2) {
    const midX = (x1 + x2) / 2;
    const totalLength = Math.hypot(x2 - x1, y2 - y1);
    return {
      d: `M ${x1} ${y1} L ${x2} ${y2}`,
      points: [
        { x: x1, y: y1 },
        { x: x2, y: y2 },
      ],
      totalLength: Math.max(1, totalLength),
      labelX: midX,
      labelY: y1,
    };
  }

  // Orthogonal step path: horizontal -> vertical -> horizontal
  const preferredSplitOffset = 34;
  const dx = x2 - x1;
  const midX = dx > preferredSplitOffset * 1.5 ? x1 + preferredSplitOffset : x1 + dx / 2;

  const r = Math.min(
    cornerRadius,
    Math.abs(midX - x1) / 2,
    Math.abs(x2 - midX) / 2,
    Math.abs(dy) / 2
  );

  const dirY = dy > 0 ? 1 : -1;
  const dirX1 = midX >= x1 ? 1 : -1;
  const dirX2 = x2 >= midX ? 1 : -1;

  const d = [
    `M ${x1} ${y1}`,
    `L ${midX - r * dirX1} ${y1}`,
    `Q ${midX} ${y1} ${midX} ${y1 + r * dirY}`,
    `L ${midX} ${y2 - r * dirY}`,
    `Q ${midX} ${y2} ${midX + r * dirX2} ${y2}`,
    `L ${x2} ${y2}`,
  ].join(' ');

  const points = [
    { x: x1, y: y1 },
    { x: midX, y: y1 },
    { x: midX, y: y2 },
    { x: x2, y: y2 },
  ];

  const seg1 = Math.abs(midX - x1);
  const seg2 = Math.abs(y2 - y1);
  const seg3 = Math.abs(x2 - midX);
  const totalLength = Math.max(1, seg1 + seg2 + seg3);

  // Place condition label ('예', '아니오') cleanly along the vertical segment
  // In the reference image, '예' is placed along the upper vertical branch and '아니오' along the lower vertical branch.
  const labelX = midX;
  const labelY = y1 + dy * 0.42;

  return {
    d,
    points,
    totalLength,
    labelX,
    labelY,
  };
}

/**
 * Interpolates { x, y } along an orthogonal polyline at normalized progress t in [0, 1].
 */
export function getPointAlongPolyline(
  points: Array<{ x: number; y: number }>,
  t: number
): { x: number; y: number } {
  if (points.length === 0) return { x: 0, y: 0 };
  if (points.length === 1) return points[0];

  const clamped = Math.max(0, Math.min(1, t));
  const lengths: number[] = [];
  let total = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const len = Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y);
    lengths.push(len);
    total += len;
  }

  if (total <= 0.0001) return points[0];

  const targetDist = clamped * total;
  let accumulated = 0;

  for (let i = 0; i < lengths.length; i++) {
    const segLen = lengths[i];
    if (accumulated + segLen >= targetDist || i === lengths.length - 1) {
      const localT = segLen > 0 ? (targetDist - accumulated) / segLen : 0;
      return {
        x: points[i].x + (points[i + 1].x - points[i].x) * localT,
        y: points[i].y + (points[i + 1].y - points[i].y) * localT,
      };
    }
    accumulated += segLen;
  }

  return points[points.length - 1];
}

export interface LiveNodeRuntimeState {
  nodeId: string;
  status: NodeStatus;
  durationLabel: string;
  isExecutingNow: boolean;
  highlightBorder: boolean;
  progressRatio: number;
}

export interface LiveEdgeRuntimeState {
  edgeId: string;
  state: 'idle' | 'active' | 'completed' | 'skipped';
  particleProgress: number | null; // 0..1 when signal packet is traveling across the edge
}

/**
 * Pure state machine that computes the live visual state of all nodes and edges
 * at any elapsed millisecond during motion playback.
 */
export function computeFlowRuntimeState(
  template: FlowTemplate,
  scenario: FlowScenario,
  elapsedMs: number,
  isPlaying: boolean
): {
  nodes: Record<string, LiveNodeRuntimeState>;
  edges: Record<string, LiveEdgeRuntimeState>;
} {
  const nodesResult: Record<string, LiveNodeRuntimeState> = {};
  const edgesResult: Record<string, LiveEdgeRuntimeState> = {};

  const finishedCycle = !isPlaying && elapsedMs >= scenario.totalDurationMs;

  for (const node of template.nodes) {
    const step = scenario.steps[node.id];
    if (!step) {
      nodesResult[node.id] = {
        nodeId: node.id,
        status: node.defaultStatus,
        durationLabel: node.defaultDurationText,
        isExecutingNow: false,
        highlightBorder: Boolean(node.defaultSelected),
        progressRatio: 1,
      };
      continue;
    }

    if (elapsedMs < step.startMs && !finishedCycle) {
      nodesResult[node.id] = {
        nodeId: node.id,
        status: 'pending',
        durationLabel: '미실행',
        isExecutingNow: false,
        highlightBorder: false,
        progressRatio: 0,
      };
    } else if (elapsedMs >= step.startMs && elapsedMs < step.endMs && !finishedCycle) {
      const span = Math.max(1, step.endMs - step.startMs);
      const ratio = Math.min(1, Math.max(0, (elapsedMs - step.startMs) / span));
      if (step.status === 'skipped' || step.status === 'pending' || step.durationSec === null) {
        nodesResult[node.id] = {
          nodeId: node.id,
          status: step.status,
          durationLabel: '미실행',
          isExecutingNow: false,
          highlightBorder: false,
          progressRatio: ratio,
        };
      } else {
        const currentSec = (step.durationSec * ratio).toFixed(1);
        nodesResult[node.id] = {
          nodeId: node.id,
          status: 'running',
          durationLabel: `${currentSec}초`,
          isExecutingNow: true,
          highlightBorder: true,
          progressRatio: ratio,
        };
      }
    } else {
      // Completed step
      const finalDurationLabel =
        step.durationSec === null ? '미실행' : `${step.durationSec.toFixed(1)}초`;
      nodesResult[node.id] = {
        nodeId: node.id,
        status: step.status,
        durationLabel: finalDurationLabel,
        isExecutingNow: false,
        highlightBorder: Boolean(step.highlightBorder),
        progressRatio: 1,
      };
    }
  }

  for (const edge of template.edges) {
    const sourceStep = scenario.steps[edge.source];
    const targetStep = scenario.steps[edge.target];
    const isSkippedEdge = scenario.skippedEdges.includes(edge.id);
    const isActiveEdge = scenario.activeEdges.includes(edge.id);

    if (!sourceStep || !targetStep) {
      edgesResult[edge.id] = {
        edgeId: edge.id,
        state: 'idle',
        particleProgress: null,
      };
      continue;
    }

    // Signal travels between sourceStep.endMs - 120 and targetStep.startMs + 260
    const travelStart = Math.max(0, sourceStep.endMs - 80);
    const travelEnd = Math.max(travelStart + 320, targetStep.startMs + 220);

    if (isSkippedEdge) {
      edgesResult[edge.id] = {
        edgeId: edge.id,
        state: elapsedMs >= sourceStep.endMs ? 'skipped' : 'idle',
        particleProgress: null,
      };
    } else if (isActiveEdge) {
      if (elapsedMs >= travelStart && elapsedMs <= travelEnd && !finishedCycle) {
        const p = (elapsedMs - travelStart) / Math.max(1, travelEnd - travelStart);
        edgesResult[edge.id] = {
          edgeId: edge.id,
          state: 'active',
          particleProgress: Math.max(0, Math.min(1, p)),
        };
      } else if (elapsedMs > travelEnd || finishedCycle) {
        edgesResult[edge.id] = {
          edgeId: edge.id,
          state: 'completed',
          particleProgress: null,
        };
      } else {
        edgesResult[edge.id] = {
          edgeId: edge.id,
          state: 'idle',
          particleProgress: null,
        };
      }
    } else {
      edgesResult[edge.id] = {
        edgeId: edge.id,
        state: 'idle',
        particleProgress: null,
      };
    }
  }

  return { nodes: nodesResult, edges: edgesResult };
}

export interface MinimapRect {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isHighlighted: boolean;
}

/**
 * Computes scaled node rectangles for the bottom-right minimap.
 */
export function computeMinimapRects(
  nodes: FlowNodeData[],
  highlightedNodeId: string | null,
  minimapWidth = 176,
  minimapHeight = 104,
  padding = 14
): MinimapRect[] {
  if (nodes.length === 0) return [];

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const n of nodes) {
    if (n.x < minX) minX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.x + NODE_WIDTH > maxX) maxX = n.x + NODE_WIDTH;
    if (n.y + NODE_HEIGHT > maxY) maxY = n.y + NODE_HEIGHT;
  }

  const worldW = Math.max(1, maxX - minX);
  const worldH = Math.max(1, maxY - minY);
  const innerW = Math.max(10, minimapWidth - padding * 2);
  const innerH = Math.max(10, minimapHeight - padding * 2);

  const scale = Math.min(innerW / worldW, innerH / worldH);
  const offsetX = padding + (innerW - worldW * scale) / 2;
  const offsetY = padding + (innerH - worldH * scale) / 2;

  return nodes.map((n) => ({
    id: n.id,
    x: Math.round(offsetX + (n.x - minX) * scale),
    y: Math.round(offsetY + (n.y - minY) * scale),
    width: Math.max(24, Math.round(NODE_WIDTH * scale)),
    height: Math.max(14, Math.round(NODE_HEIGHT * scale)),
    isHighlighted: n.id === highlightedNodeId,
  }));
}
