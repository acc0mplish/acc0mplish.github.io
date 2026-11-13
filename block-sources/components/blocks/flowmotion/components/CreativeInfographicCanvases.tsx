import React from 'react';
import {
  Zap,
  Shield,
  Database,
  Webhook,
  GitBranch,
  CreditCard,
  Truck,
  MessageSquare,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Layers,
  Compass,
} from 'lucide-react';
import { FlowTemplate, FlowScenario } from '../utils/flowEngine';

interface CreativeCanvasProps {
  template: FlowTemplate;
  scenario: FlowScenario;
  selectedNodeId: string | null;
  ambientProgress: number;
  zoom: number;
  onSelectNode: (nodeId: string) => void;
}

function renderNodeIcon(icon: string, className = 'w-5 h-5') {
  switch (icon) {
    case 'webhook':
      return <Webhook className={className} />;
    case 'branch':
      return <GitBranch className={className} />;
    case 'database':
      return <Database className={className} />;
    case 'shield':
      return <Shield className={className} />;
    case 'credit-card':
      return <CreditCard className={className} />;
    case 'truck':
      return <Truck className={className} />;
    case 'message':
      return <MessageSquare className={className} />;
    default:
      return <Zap className={className} />;
  }
}

/**
 * 11. 3D 지그재그 리본 웨이브 인포그래픽 (Creative Zig-Zag Ribbon Wave)
 * Matches "Amazing Strategy Infographics PPT" 4-color folded 3D ribbon wave in `image_dcc2a8f5.png`.
 */
export const CreativeZigzagRibbonCanvas: React.FC<CreativeCanvasProps> = ({
  template,
  scenario,
  selectedNodeId,
  ambientProgress,
  zoom,
  onSelectNode,
}) => {
  const isEvenFocus = scenario.activeEdges.includes('even');
  const paintId = React.useId().replace(/:/g, '');

  const ribbonStops = [
    {
      node: template.nodes[0],
      num: '01',
      label: 'TRANSFORMATION',
      cx: 185,
      cy: 220,
      isTop: true,
      primary: 'var(--fm-accent-hover)',
      secondary: 'var(--fm-accent-hover)',
      lightBg: 'var(--fm-selected)',
      borderCol: 'var(--fm-selected)',
    },
    {
      node: template.nodes[1],
      num: '02',
      label: 'BUSINESS MODEL',
      cx: 435,
      cy: 380,
      isTop: false,
      primary: 'var(--fm-accent-hover)',
      secondary: 'var(--fm-accent-hover)',
      lightBg: 'var(--fm-selected)',
      borderCol: 'var(--fm-selected)',
    },
    {
      node: template.nodes[2],
      num: '03',
      label: 'FUNCTIONAL SYNERGY',
      cx: 685,
      cy: 220,
      isTop: true,
      primary: 'var(--fm-accent)',
      secondary: 'var(--fm-accent)',
      lightBg: 'var(--fm-selected)',
      borderCol: 'var(--fm-selected)',
    },
    {
      node: template.nodes[3],
      num: '04',
      label: 'OPERATIONAL SLA',
      cx: 935,
      cy: 380,
      isTop: false,
      primary: 'var(--fm-warning)',
      secondary: 'var(--fm-warning)',
      lightBg: 'var(--fm-selected)',
      borderCol: 'var(--fm-selected)',
    },
  ];

  // Polyline points for the continuous traveling wave particle along the ribbon
  const wavePolyline = [
    { x: 65, y: 315 },
    { x: 185, y: 220 },
    { x: 435, y: 380 },
    { x: 685, y: 220 },
    { x: 935, y: 380 },
    { x: 1065, y: 280 },
  ];

  const getWavePoint = (t: number) => {
    const scaled = ((t % 1) + 1) % 1;
    const segCount = wavePolyline.length - 1;
    const idx = Math.min(segCount - 1, Math.floor(scaled * segCount));
    const localT = scaled * segCount - idx;
    const p0 = wavePolyline[idx];
    const p1 = wavePolyline[idx + 1];
    return {
      x: p0.x + (p1.x - p0.x) * localT,
      y: p0.y + (p1.y - p0.y) * localT,
    };
  };

  const pA = getWavePoint(ambientProgress);
  const pB = getWavePoint(ambientProgress + 0.33);
  const pC = getWavePoint(ambientProgress + 0.66);

  return (
    <div
      className="flex-1 relative overflow-auto flow-dot-grid select-none"
      data-testid="flow-canvas-zigzag-ribbon"
    >
      <div
        className="relative w-[1130px] h-[620px] origin-top-left"
        style={{ transform: `scale(${zoom})` }}
      >
        {/* Slide Header Banner */}
        <div className="absolute left-7 top-4 right-7 flex items-center justify-between border-b border-[var(--fm-border)] pb-2.5">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--fm-accent-hover)]" />
            <span className="text-[12px] font-bold tracking-wider uppercase text-[var(--fm-muted)]">
              STRATEGY POWERPOINT TEMPLATE · 3D FOLDING RIBBON WAVE
            </span>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-[var(--fm-muted)] font-mono-tabular">
            <span>전사 원가 절감: -42%</span>
            <span>·</span>
            <span>SaaS 전환율: 68%</span>
            <span>·</span>
            <span className="text-[var(--fm-accent-hover)] font-semibold">SLA 99.995%</span>
          </div>
        </div>

        {/* 3D Folding Ribbon SVG Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          <defs>
            <linearGradient id={`${paintId}-ribGrad1`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--fm-accent-hover)" />
              <stop offset="100%" stopColor="var(--fm-accent-hover)" />
            </linearGradient>
            <linearGradient id={`${paintId}-ribGrad2`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--fm-accent-hover)" />
              <stop offset="100%" stopColor="var(--fm-accent-hover)" />
            </linearGradient>
            <linearGradient id={`${paintId}-ribGrad3`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--fm-accent-hover)" />
              <stop offset="100%" stopColor="var(--fm-accent)" />
            </linearGradient>
            <linearGradient id={`${paintId}-ribGrad4`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--fm-accent)" />
              <stop offset="100%" stopColor="var(--fm-warning)" />
            </linearGradient>
            <linearGradient id={`${paintId}-ribGrad5`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--fm-warning)" />
              <stop offset="100%" stopColor="var(--fm-warning)" />
            </linearGradient>
          </defs>

          {/* Drop shadow ribbon underlayer */}
          <polyline
            points="65,323 185,228 435,388 685,228 935,388 1065,288"
            fill="none"
            stroke="color-mix(in srgb, var(--fm-text) 8%, transparent)"
            strokeWidth="44"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 5 Thick 3D Ribbon Segments */}
          <line
            x1="65"
            y1="315"
            x2="185"
            y2="220"
            stroke={`url(#${paintId}-ribGrad1)`}
            strokeWidth="38"
            strokeLinecap="round"
          />
          <line
            x1="185"
            y1="220"
            x2="435"
            y2="380"
            stroke={`url(#${paintId}-ribGrad2)`}
            strokeWidth="38"
            strokeLinecap="round"
          />
          <line
            x1="435"
            y1="380"
            x2="685"
            y2="220"
            stroke={`url(#${paintId}-ribGrad3)`}
            strokeWidth="38"
            strokeLinecap="round"
          />
          <line
            x1="685"
            y1="220"
            x2="935"
            y2="380"
            stroke={`url(#${paintId}-ribGrad4)`}
            strokeWidth="38"
            strokeLinecap="round"
          />
          <line
            x1="935"
            y1="380"
            x2="1065"
            y2="280"
            stroke={`url(#${paintId}-ribGrad5)`}
            strokeWidth="38"
            strokeLinecap="round"
          />

          {/* Center Animated Dashed Track inside the 3D Ribbon */}
          <polyline
            points="65,315 185,220 435,380 685,220 935,380 1065,280"
            fill="none"
            stroke="color-mix(in srgb, var(--fm-panel) 65%, transparent)"
            strokeWidth="2.5"
            strokeDasharray="8 6"
            className="animate-flow-dash"
          />

          {/* Vertical connector stems from each ribbon vertex to its Strategy Card */}
          {ribbonStops.map((st, idx) => {
            const cardY = st.isTop ? 152 : 448;
            return (
              <g key={`stem-${idx}`}>
                <line
                  x1={st.cx}
                  y1={st.cy}
                  x2={st.cx}
                  y2={cardY}
                  stroke={st.primary}
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
                <circle cx={st.cx} cy={cardY} r="4.5" fill={st.primary} />
              </g>
            );
          })}

          {/* Traveling Luminous Particles along the 3D Ribbon */}
          {[pA, pB, pC].map((pt, i) => (
            <g key={`wave-pt-${i}`}>
              <circle cx={pt.x} cy={pt.y} r="11" fill="color-mix(in srgb, var(--fm-panel) 35%, transparent)" />
              <circle cx={pt.x} cy={pt.y} r="5.5" fill="var(--fm-panel)" />
            </g>
          ))}
        </svg>

        {/* Circular Vertex Medallions & Alternating Top/Bottom Strategy Cards */}
        {ribbonStops.map((st, idx) => {
          const isSelected = selectedNodeId === st.node.id;
          const isDimmed = isEvenFocus && idx % 2 === 0;
          const activeWaveHit =
            Math.floor(ambientProgress * 4) % 4 === idx;

          return (
            <React.Fragment key={st.node.id}>
              {/* Circular Medallion on the Ribbon Fold Vertex */}
              <button
                type="button"
                onClick={() => onSelectNode(st.node.id)}
                style={{
                  left: st.cx - 38,
                  top: st.cy - 38,
                  borderColor: st.primary,
                }}
                className={`absolute w-[76px] h-[76px] rounded-full bg-[var(--fm-panel)] border-[4px] shadow-lg flex flex-col items-center justify-center cursor-pointer z-10 ${
                  isSelected ? 'ring-4 ring-[var(--fm-accent)]' : ''
                }`}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--fm-on-accent)]"
                  style={{ backgroundColor: st.primary }}
                >
                  {renderNodeIcon(st.node.icon, 'w-4 h-4')}
                </div>
                <span
                  className="text-[10px] font-mono-tabular font-extrabold mt-0.5"
                  style={{ color: st.primary }}
                >
                  {st.num}
                </span>
              </button>

              {/* Strategy Callout Card (Alternating Top & Bottom like the PPT Reference) */}
              <button
                type="button"
                onClick={() => onSelectNode(st.node.id)}
                style={{
                  left: Math.max(24, Math.min(860, st.cx - 122)),
                  top: st.isTop ? 58 : 452,
                  borderColor: isSelected || activeWaveHit ? st.primary : 'var(--fm-border)',
                  opacity: isDimmed ? 0.55 : 1,
                }}
                className={`absolute w-[244px] rounded-[14px] bg-[var(--fm-panel)] border-2 p-3.5 text-left shadow-xs cursor-pointer z-10 ${
                  isSelected ? 'shadow-md' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className="text-[10.5px] font-mono-tabular font-bold tracking-wider uppercase"
                    style={{ color: st.primary }}
                  >
                    {st.num} · {st.label}
                  </span>
                  <span className="text-[11px] font-mono-tabular font-semibold text-[var(--fm-muted)]">
                    {st.node.defaultDurationText}
                  </span>
                </div>
                <div className="text-[13px] font-bold text-[var(--fm-text)] truncate">
                  {st.node.title}
                </div>
                <div className="text-[11.5px] text-[var(--fm-muted)] truncate mt-0.5">
                  {st.node.subtitle}
                </div>
                {/* Animated bottom accent bar (compositor-only scaleX) */}
                <div className="mt-2.5 h-1.5 w-full rounded-full bg-[var(--fm-surface)] overflow-hidden">
                  <div
                    className="h-full w-full origin-left rounded-full"
                    style={{
                      backgroundColor: st.primary,
                      transform: `scaleX(${
                        activeWaveHit ? 1 : 0.72 + Math.sin(ambientProgress * Math.PI * 2 + idx) * 0.18
                      })`,
                    }}
                  />
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 12. 아이디어 전구 브레인스토밍 방사형 인포그래픽 (Creative Lightbulb Brainstorm Hub)
 * Matches "Brainstorming PowerPoint Template For Creative Sessions" in `image_dcc2a8f5.png`.
 */
export const CreativeLightbulbBrainstormCanvas: React.FC<CreativeCanvasProps> = ({
  template,
  scenario,
  selectedNodeId,
  ambientProgress,
  zoom,
  onSelectNode,
}) => {
  const isTop3Focus = scenario.activeEdges.includes('top3');
  const paintId = React.useId().replace(/:/g, '');
  const coreNode = template.nodes[0];
  const branchNodes = template.nodes.slice(1, 7);

  const bulbCx = 565;
  const bulbCy = 265;

  const branchConfigs = [
    {
      node: branchNodes[0],
      num: '01',
      side: 'left' as const,
      cardX: 32,
      cardY: 66,
      anchorX: 465,
      anchorY: 185,
      elbowX: 365,
      elbowY: 112,
      color: 'var(--fm-accent-hover)',
      isTop3: true,
    },
    {
      node: branchNodes[1],
      num: '02',
      side: 'left' as const,
      cardX: 32,
      cardY: 222,
      anchorX: 448,
      anchorY: 265,
      elbowX: 355,
      elbowY: 265,
      color: 'var(--fm-accent-hover)',
      isTop3: true,
    },
    {
      node: branchNodes[2],
      num: '03',
      side: 'left' as const,
      cardX: 32,
      cardY: 378,
      anchorX: 465,
      anchorY: 340,
      elbowX: 365,
      elbowY: 424,
      color: 'var(--fm-accent-hover)',
      isTop3: false,
    },
    {
      node: branchNodes[3],
      num: '04',
      side: 'right' as const,
      cardX: 828,
      cardY: 66,
      anchorX: 665,
      anchorY: 185,
      elbowX: 765,
      elbowY: 112,
      color: 'var(--fm-accent-hover)',
      isTop3: false,
    },
    {
      node: branchNodes[4],
      num: '05',
      side: 'right' as const,
      cardX: 828,
      cardY: 222,
      anchorX: 682,
      anchorY: 265,
      elbowX: 775,
      elbowY: 265,
      color: 'var(--fm-accent)',
      isTop3: true,
    },
    {
      node: branchNodes[5],
      num: '06',
      side: 'right' as const,
      cardX: 828,
      cardY: 378,
      anchorX: 665,
      anchorY: 340,
      elbowX: 765,
      elbowY: 424,
      color: 'var(--fm-accent)',
      isTop3: false,
    },
  ];

  return (
    <div
      className="flex-1 relative overflow-auto flow-dot-grid select-none"
      data-testid="flow-canvas-lightbulb-brainstorm"
    >
      <div
        className="relative w-[1130px] h-[620px] origin-top-left"
        style={{ transform: `scale(${zoom})` }}
      >
        {/* Top Slide Title Strip */}
        <div className="absolute left-7 top-4 right-7 flex items-center justify-between border-b border-[var(--fm-border)] pb-2.5">
          <div className="flex items-center gap-2.5">
            <Lightbulb className="w-4 h-4 text-[var(--fm-accent-hover)]" />
            <span className="text-[12px] font-bold tracking-wider uppercase text-[var(--fm-muted)]">
              BRAINSTORMING POWERPOINT TEMPLATE · NEURAL LIGHTBULB HUB
            </span>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-[var(--fm-muted)] font-mono-tabular">
            <span>도출 아이디어: 6개 핵심 과제</span>
            <span>·</span>
            <span className="text-[var(--fm-accent-hover)] font-semibold">특허 출원 18건 · 예상 ₩380억</span>
          </div>
        </div>

        {/* SVG Radiating Connectors, Sparks & Glowing Aura */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          <defs>
            <radialGradient id={`${paintId}-bulbGlow`} cx="50%" cy="45%" r="50%">
              <stop offset="0%" stopColor="color-mix(in srgb, var(--fm-accent) 22%, transparent)" />
              <stop offset="65%" stopColor="color-mix(in srgb, var(--fm-accent) 8%, transparent)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <linearGradient id={`${paintId}-bulbDomeGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--fm-accent-hover)" />
              <stop offset="45%" stopColor="var(--fm-accent-hover)" />
              <stop offset="100%" stopColor="var(--fm-accent-hover)" />
            </linearGradient>
          </defs>

          {/* Outer Ambient Glow Circle */}
          <circle cx={bulbCx} cy={bulbCy} r="168" fill={`url(#${paintId}-bulbGlow)`} />

          {/* Outer Rotating Dashed Inspiration Ring */}
          <circle
            cx={bulbCx}
            cy={bulbCy}
            r="126"
            fill="none"
            stroke="var(--fm-selected)"
            strokeWidth="2"
            strokeDasharray="6 6"
            className="animate-flow-dash"
          />

          {/* 6 Radiating Elbow Callout Lines + Animated Spark Particles */}
          {branchConfigs.map((b, idx) => {
            if (!b.node) return null;
            const endX = b.side === 'left' ? b.cardX + 272 : b.cardX;
            const endY = b.elbowY;
            const d = `M ${b.anchorX} ${b.anchorY} L ${b.elbowX} ${b.elbowY} L ${endX} ${endY}`;
            const localT = (ambientProgress + idx * 0.16) % 1;
            const sparkX =
              localT < 0.5
                ? b.anchorX + (b.elbowX - b.anchorX) * (localT * 2)
                : b.elbowX + (endX - b.elbowX) * ((localT - 0.5) * 2);
            const sparkY =
              localT < 0.5
                ? b.anchorY + (b.elbowY - b.anchorY) * (localT * 2)
                : b.elbowY + (endY - b.elbowY) * ((localT - 0.5) * 2);

            const dimmed = isTop3Focus && !b.isTop3;

            return (
              <g key={b.num} opacity={dimmed ? 0.35 : 1}>
                <path
                  d={d}
                  fill="none"
                  stroke={b.color}
                  strokeWidth="2.2"
                  strokeDasharray="5 4"
                  className="animate-flow-dash"
                />
                {/* Anchor Dot near Bulb */}
                <circle cx={b.anchorX} cy={b.anchorY} r="5" fill={b.color} />
                {/* Numbered Node Badge on Elbow */}
                <circle
                  cx={b.elbowX}
                  cy={b.elbowY}
                  r="14"
                  fill="var(--fm-panel)"
                  stroke={b.color}
                  strokeWidth="2.5"
                />
                <text
                  x={b.elbowX}
                  y={b.elbowY + 4}
                  textAnchor="middle"
                  fill={b.color}
                  fontSize="11"
                  fontWeight="800"
                  fontFamily="inherit"
                >
                  {b.num}
                </text>
                {/* Traveling Idea Spark Particle */}
                <circle cx={sparkX} cy={sparkY} r="6" fill={b.color} opacity="0.28" />
                <circle cx={sparkX} cy={sparkY} r="3.5" fill={b.color} />
              </g>
            );
          })}

          {/* Central Vector Lightbulb Graphic (Matching Brainstorming PPT Reference) */}
          <g transform={`translate(${bulbCx}, ${bulbCy})`}>
            {/* Lightbulb Glass Dome */}
            <path
              d="M -68 -20 C -68 -65, -36 -95, 0 -95 C 36 -95, 68 -65, 68 -20 C 68 12, 42 32, 34 55 L -34 55 C -42 32, -68 12, -68 -20 Z"
              fill={`url(#${paintId}-bulbDomeGrad)`}
              stroke="var(--fm-panel)"
              strokeWidth="4"
            />
            {/* Neural Brain Circuit Lines inside the Bulb */}
            <path
              d="M -32 -25 L -14 -45 L 14 -45 L 32 -25 M -22 -5 L 0 -25 L 22 -5 M 0 -65 L 0 25 M -18 18 L 0 35 L 18 18"
              fill="none"
              stroke="color-mix(in srgb, var(--fm-panel) 75%, transparent)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="-32" cy="-25" r="4" fill="var(--fm-panel)" />
            <circle cx="32" cy="-25" r="4" fill="var(--fm-panel)" />
            <circle cx="-14" cy="-45" r="4" fill="var(--fm-selected)" />
            <circle cx="14" cy="-45" r="4" fill="var(--fm-selected)" />
            <circle cx="0" cy="-65" r="4.5" fill="var(--fm-selected)" />
            <circle cx="-22" cy="-5" r="3.5" fill="var(--fm-panel)" />
            <circle cx="22" cy="-5" r="3.5" fill="var(--fm-panel)" />

            {/* Screw Base Threads */}
            <rect x="-28" y="60" width="56" height="10" rx="5" fill="var(--fm-text)" />
            <rect x="-24" y="73" width="48" height="10" rx="5" fill="var(--fm-muted)" />
            <path d="M -16 86 L 16 86 L 10 98 L -10 98 Z" fill="var(--fm-text)" />
          </g>
        </svg>

        {/* Interactive Button Overlay on Central Lightbulb Core */}
        {coreNode && (
          <button
            type="button"
            onClick={() => onSelectNode(coreNode.id)}
            style={{ left: bulbCx - 95, top: bulbCy + 110 }}
            className={`absolute w-[190px] rounded-[12px] bg-[var(--fm-accent)] text-[var(--fm-on-accent)] px-3 py-2 text-center shadow-md cursor-pointer z-10 ${
              selectedNodeId === coreNode.id ? 'ring-2 ring-[var(--fm-accent-hover)]' : ''
            }`}
          >
            <div className="text-[11px] font-mono-tabular font-bold text-[var(--fm-selected)]">
              {coreNode.defaultDurationText} · 18 PATENTS
            </div>
            <div className="text-[12px] font-bold truncate mt-0.5">
              {coreNode.title}
            </div>
          </button>
        )}

        {/* 6 Radiating Idea Cards (3 Left, 3 Right) */}
        {branchConfigs.map((b) => {
          if (!b.node) return null;
          const isSelected = selectedNodeId === b.node.id;
          const dimmed = isTop3Focus && !b.isTop3;

          return (
            <button
              key={b.node.id}
              type="button"
              onClick={() => onSelectNode(b.node.id)}
              style={{
                left: b.cardX,
                top: b.cardY,
                borderColor: isSelected ? b.color : 'var(--fm-border)',
                opacity: dimmed ? 0.45 : 1,
              }}
              className={`absolute w-[272px] rounded-[14px] bg-[var(--fm-panel)] border-2 p-3.5 text-left shadow-xs cursor-pointer z-10 ${
                isSelected ? 'shadow-md' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[var(--fm-on-accent)] shrink-0"
                    style={{ backgroundColor: b.color }}
                  >
                    {renderNodeIcon(b.node.icon, 'w-3.5 h-3.5')}
                  </div>
                  <span className="text-[13px] font-bold text-[var(--fm-text)] truncate">
                    {b.node.title}
                  </span>
                </div>
                <span
                  className="text-[11px] font-mono-tabular font-bold shrink-0"
                  style={{ color: b.color }}
                >
                  {b.num}
                </span>
              </div>
              <div className="text-[11.5px] text-[var(--fm-muted)] truncate mt-1.5">
                {b.node.subtitle}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 13. 4단 입체 전략 피라미드 & 상승 모션 (Creative 4-Tier 3D Strategy Pyramid)
 * Matches "Blue/Yellow Color Business Strategy PowerPoint" 4-level pyramid in `image_dcc2a8f5.png`.
 */
export const CreativeStrategyPyramidCanvas: React.FC<CreativeCanvasProps> = ({
  template,
  scenario,
  selectedNodeId,
  ambientProgress,
  zoom,
  onSelectNode,
}) => {
  const isTopDown = scenario.activeEdges.includes('topdown');

  // Nodes in template are ordered pyr-04 (Apex) down to pyr-01 (Base)
  const tiers = [
    {
      node: template.nodes[0], // LEVEL 04 (Apex)
      levelNum: '04',
      side: 'right' as const,
      cardX: 775,
      cardY: 86,
      frontPoints: '550,75 495,165 605,165',
      sidePoints: '550,75 605,165 628,150',
      centerY: 132,
      frontColor: 'var(--fm-warning)',
      sideColor: 'var(--fm-warning)',
      lineStartX: 616,
    },
    {
      node: template.nodes[1], // LEVEL 03
      levelNum: '03',
      side: 'left' as const,
      cardX: 36,
      cardY: 186,
      frontPoints: '490,173 435,263 665,263 610,173',
      sidePoints: '610,173 665,263 692,244 632,157',
      centerY: 222,
      frontColor: 'var(--fm-accent)',
      sideColor: 'var(--fm-accent)',
      lineStartX: 462,
    },
    {
      node: template.nodes[2], // LEVEL 02
      levelNum: '02',
      side: 'right' as const,
      cardX: 775,
      cardY: 286,
      frontPoints: '430,271 375,361 725,361 670,271',
      sidePoints: '670,271 725,361 756,338 696,251',
      centerY: 320,
      frontColor: 'var(--fm-accent-hover)',
      sideColor: 'var(--fm-accent-hover)',
      lineStartX: 740,
    },
    {
      node: template.nodes[3], // LEVEL 01 (Base)
      levelNum: '01',
      side: 'left' as const,
      cardX: 36,
      cardY: 386,
      frontPoints: '370,369 315,459 785,459 730,369',
      sidePoints: '730,369 785,459 820,432 760,345',
      centerY: 418,
      frontColor: 'var(--fm-accent-hover)',
      sideColor: 'var(--fm-accent-hover)',
      lineStartX: 342,
    },
  ];

  // Active tier index based on direction (ascend 01->04 vs topdown 04->01)
  const rawIdx = Math.floor(ambientProgress * 4) % 4;
  const activeTierIdx = isTopDown ? rawIdx : 3 - rawIdx;

  // Vertical climbing energy pulse Y coordinate
  const pulseY = isTopDown
    ? 95 + ambientProgress * 355
    : 450 - ambientProgress * 355;

  return (
    <div
      className="flex-1 relative overflow-auto flow-dot-grid select-none"
      data-testid="flow-canvas-strategy-pyramid"
    >
      <div
        className="relative w-[1130px] h-[620px] origin-top-left"
        style={{ transform: `scale(${zoom})` }}
      >
        {/* Top Slide Title Strip */}
        <div className="absolute left-7 top-4 right-7 flex items-center justify-between border-b border-[var(--fm-border)] pb-2.5">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4 text-[var(--fm-accent-hover)]" />
            <span className="text-[12px] font-bold tracking-wider uppercase text-[var(--fm-muted)]">
              BUSINESS STRATEGY POWERPOINT · 4-LEVEL 3D HIERARCHY PYRAMID
            </span>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-[var(--fm-muted)] font-mono-tabular">
            <span>전개가동 방향: {isTopDown ? '04 → 01 Top-Down 정렬' : '01 → 04 Bottom-Up 상승'}</span>
            <span>·</span>
            <span className="text-[var(--fm-accent-hover)] font-semibold">목표 영업이익률 32%</span>
          </div>
        </div>

        {/* 3D Pyramid & Callout Pointer Lines SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          {/* Base ground shadow */}
          <ellipse cx="565" cy="472" rx="265" ry="18" fill="color-mix(in srgb, var(--fm-text) 7%, transparent)" />

          {tiers.map((t, idx) => {
            const isHighlighted = idx === activeTierIdx || selectedNodeId === t.node.id;
            const cardAnchorX = t.side === 'left' ? t.cardX + 310 : t.cardX;

            return (
              <g key={t.levelNum}>
                {/* 3D Pyramid Front Facet */}
                <polygon
                  points={t.frontPoints}
                  fill={t.frontColor}
                  opacity={isHighlighted ? 1 : 0.88}
                  stroke="var(--fm-panel)"
                  strokeWidth="2"
                />
                {/* 3D Pyramid Right Side Shading Facet */}
                <polygon
                  points={t.sidePoints}
                  fill={t.sideColor}
                  opacity={isHighlighted ? 1 : 0.9}
                  stroke="var(--fm-panel)"
                  strokeWidth="1.5"
                />
                {/* Tier Number Label inside Pyramid */}
                <text
                  x="550"
                  y={t.centerY + 6}
                  textAnchor="middle"
                  fill="var(--fm-panel)"
                  fontSize="20"
                  fontWeight="800"
                  fontFamily="inherit"
                >
                  {t.levelNum}
                </text>

                {/* Horizontal Pointer Line to Left/Right Strategy Card */}
                <line
                  x1={t.lineStartX}
                  y1={t.centerY}
                  x2={cardAnchorX}
                  y2={t.centerY}
                  stroke={t.frontColor}
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  className="animate-flow-dash"
                />
                <circle cx={t.lineStartX} cy={t.centerY} r="5" fill="var(--fm-panel)" stroke={t.frontColor} strokeWidth="2.5" />
                <circle cx={cardAnchorX} cy={t.centerY} r="4.5" fill={t.frontColor} />
              </g>
            );
          })}

          {/* Vertical Climbing Energy Pulse along Pyramid Axis */}
          <circle cx="550" cy={pulseY} r="14" fill="color-mix(in srgb, var(--fm-panel) 35%, transparent)" />
          <circle cx="550" cy={pulseY} r="6" fill="var(--fm-panel)" />
        </svg>

        {/* Left & Right Alternating Tier Callout Cards */}
        {tiers.map((t, idx) => {
          const isSelected = selectedNodeId === t.node.id;
          const isHighlighted = idx === activeTierIdx;

          return (
            <button
              key={t.node.id}
              type="button"
              onClick={() => onSelectNode(t.node.id)}
              style={{
                left: t.cardX,
                top: t.cardY,
                borderColor: isSelected || isHighlighted ? t.frontColor : 'var(--fm-border)',
              }}
              className={`absolute w-[310px] rounded-[14px] bg-[var(--fm-panel)] border-2 p-3.5 text-left shadow-xs cursor-pointer z-10 ${
                isSelected || isHighlighted ? 'shadow-md' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[var(--fm-on-accent)] shrink-0 font-mono-tabular font-bold text-[12px]"
                    style={{ backgroundColor: t.frontColor }}
                  >
                    {t.levelNum}
                  </div>
                  <span className="text-[13px] font-bold text-[var(--fm-text)] truncate">
                    {t.node.title}
                  </span>
                </div>
              </div>
              <div className="text-[11.5px] text-[var(--fm-muted)] truncate mt-1.5">
                {t.node.subtitle}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 14. 반원형 5색 게이지 팬 & 방사형 전략도 (Creative Semi-Circle 5-Color Sunburst Fan)
 * Matches "Business Presentation Template" 5-color semi-circle fan chart in `image_dcc2a8f5.png`.
 */
export const CreativeSemicircleRadialFanCanvas: React.FC<CreativeCanvasProps> = ({
  template,
  scenario,
  selectedNodeId,
  ambientProgress,
  zoom,
  onSelectNode,
}) => {
  const isGrowthFocus = scenario.activeEdges.includes('growth');
  const cx = 565;
  const cy = 445;
  const rInner = 88;
  const rOuter = 228;
  const rLabel = 160;

  // Helper to create SVG annular sector path for angles in degrees (180 = left, 0 = right)
  const createWedgePath = (startDeg: number, endDeg: number, rIn: number, rOut: number) => {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const x1Out = cx + rOut * Math.cos(toRad(startDeg));
    const y1Out = cy - rOut * Math.sin(toRad(startDeg));
    const x2Out = cx + rOut * Math.cos(toRad(endDeg));
    const y2Out = cy - rOut * Math.sin(toRad(endDeg));

    const x2In = cx + rIn * Math.cos(toRad(endDeg));
    const y2In = cy - rIn * Math.sin(toRad(endDeg));
    const x1In = cx + rIn * Math.cos(toRad(startDeg));
    const y1In = cy - rIn * Math.sin(toRad(startDeg));

    return [
      `M ${x1Out} ${y1Out}`,
      `A ${rOut} ${rOut} 0 0 1 ${x2Out} ${y2Out}`,
      `L ${x2In} ${y2In}`,
      `A ${rIn} ${rIn} 0 0 0 ${x1In} ${y1In}`,
      'Z',
    ].join(' ');
  };

  const wedges = [
    {
      node: template.nodes[0],
      num: '01',
      startDeg: 180,
      endDeg: 145,
      midDeg: 162.5,
      color: 'var(--fm-danger)', // Rose Red
      cardX: 28,
      cardY: 345,
      cardAnchorX: 288,
      cardAnchorY: 382,
      isGrowth: false,
    },
    {
      node: template.nodes[1],
      num: '02',
      startDeg: 143,
      endDeg: 109,
      midDeg: 126,
      color: 'var(--fm-warning)', // Vivid Orange
      cardX: 64,
      cardY: 135,
      cardAnchorX: 324,
      cardAnchorY: 180,
      isGrowth: false,
    },
    {
      node: template.nodes[2],
      num: '03',
      startDeg: 107,
      endDeg: 73,
      midDeg: 90,
      color: 'var(--fm-warning)', // Golden Amber
      cardX: 435,
      cardY: 56,
      cardAnchorX: 565,
      cardAnchorY: 138,
      isGrowth: true,
    },
    {
      node: template.nodes[3],
      num: '04',
      startDeg: 71,
      endDeg: 37,
      midDeg: 54,
      color: 'var(--fm-accent)', // Royal Blue
      cardX: 806,
      cardY: 135,
      cardAnchorX: 806,
      cardAnchorY: 180,
      isGrowth: true,
    },
    {
      node: template.nodes[4],
      num: '05',
      startDeg: 35,
      endDeg: 0,
      midDeg: 17.5,
      color: 'var(--fm-accent-hover)', // Vivid Purple
      cardX: 842,
      cardY: 345,
      cardAnchorX: 842,
      cardAnchorY: 382,
      isGrowth: false,
    },
  ];

  // Sweeping radar needle angle from 175 deg down to 5 deg
  const sweepDeg = 175 - ambientProgress * 170;
  const sweepRad = (sweepDeg * Math.PI) / 180;
  const needleX = cx + (rOuter + 14) * Math.cos(sweepRad);
  const needleY = cy - (rOuter + 14) * Math.sin(sweepRad);
  const activeWedgeIdx = Math.min(4, Math.floor(ambientProgress * 5));

  return (
    <div
      className="flex-1 relative overflow-auto flow-dot-grid select-none"
      data-testid="flow-canvas-semicircle-fan"
    >
      <div
        className="relative w-[1130px] h-[620px] origin-top-left"
        style={{ transform: `scale(${zoom})` }}
      >
        {/* Top Slide Header Strip */}
        <div className="absolute left-7 top-4 right-7 flex items-center justify-between border-b border-[var(--fm-border)] pb-2.5">
          <div className="flex items-center gap-2.5">
            <Compass className="w-4 h-4 text-[var(--fm-danger)]" />
            <span className="text-[12px] font-bold tracking-wider uppercase text-[var(--fm-muted)]">
              BUSINESS PRESENTATION TEMPLATE · 180° 5-COLOR SUNBURST FAN
            </span>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-[var(--fm-muted)] font-mono-tabular">
            <span>핵심 매출 비중: 34%</span>
            <span>·</span>
            <span>생태계 성장률: +118% YoY</span>
            <span>·</span>
            <span className="text-[var(--fm-accent)] font-semibold">고객 유지율 99.1%</span>
          </div>
        </div>

        {/* Semi-Circle Sunburst SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          {/* Outer decorative dashed semi-circle arc */}
          <path
            d={`M ${cx - 255} ${cy} A 255 255 0 0 1 ${cx + 255} ${cy}`}
            fill="none"
            stroke="var(--fm-control-border)"
            strokeWidth="1.75"
            strokeDasharray="6 6"
            className="animate-flow-dash"
          />

          {wedges.map((w, idx) => {
            const rad = (w.midDeg * Math.PI) / 180;
            const lx = cx + rLabel * Math.cos(rad);
            const ly = cy - rLabel * Math.sin(rad);
            const outerRimX = cx + (rOuter + 6) * Math.cos(rad);
            const outerRimY = cy - (rOuter + 6) * Math.sin(rad);
            const isHighlighted = idx === activeWedgeIdx || selectedNodeId === w.node.id;
            const dimmed = isGrowthFocus && !w.isGrowth;

            return (
              <g key={w.num} opacity={dimmed ? 0.38 : 1}>
                {/* Colored Fan Wedge */}
                <path
                  d={createWedgePath(
                    w.startDeg,
                    w.endDeg,
                    rInner,
                    rOuter
                  )}
                  fill={w.color}
                  opacity={isHighlighted ? 1 : 0.88}
                  stroke="var(--fm-panel)"
                  strokeWidth="3"
                />
                {/* Wedge Number Label */}
                <text
                  x={lx}
                  y={ly + 6}
                  textAnchor="middle"
                  fill="var(--fm-panel)"
                  fontSize="19"
                  fontWeight="800"
                  fontFamily="inherit"
                >
                  {w.num}
                </text>
                {/* Connector line from Wedge Rim to Outer Callout Card */}
                <line
                  x1={outerRimX}
                  y1={outerRimY}
                  x2={w.cardAnchorX}
                  y2={w.cardAnchorY}
                  stroke={w.color}
                  strokeWidth="2.2"
                  strokeDasharray="5 4"
                />
                <circle cx={outerRimX} cy={outerRimY} r="4.5" fill={w.color} />
                <circle cx={w.cardAnchorX} cy={w.cardAnchorY} r="4.5" fill={w.color} />
              </g>
            );
          })}

          {/* Sweeping Gauge Pointer Needle */}
          <line
            x1={cx}
            y1={cy}
            x2={needleX}
            y2={needleY}
            stroke="var(--fm-text)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx={needleX} cy={needleY} r="5.5" fill="var(--fm-text)" />

          {/* Inner Semi-Circle Hub */}
          <path
            d={`M ${cx - 82} ${cy} A 82 82 0 0 1 ${cx + 82} ${cy} Z`}
            fill="var(--fm-text)"
          />
          <text
            x={cx}
            y={cy - 34}
            textAnchor="middle"
            fill="var(--fm-selected)"
            fontSize="11"
            fontWeight="700"
            fontFamily="inherit"
          >
            5 PILLARS
          </text>
          <text
            x={cx}
            y={cy - 14}
            textAnchor="middle"
            fill="var(--fm-panel)"
            fontSize="15"
            fontWeight="800"
          >
            핵심 성장 팬
          </text>
        </svg>

        {/* 5 Perimeter Callout Cards */}
        {wedges.map((w, idx) => {
          const isSelected = selectedNodeId === w.node.id;
          const isHighlighted = idx === activeWedgeIdx;
          const dimmed = isGrowthFocus && !w.isGrowth;

          return (
            <button
              key={w.node.id}
              type="button"
              onClick={() => onSelectNode(w.node.id)}
              style={{
                left: w.cardX,
                top: w.cardY,
                borderColor: isSelected || isHighlighted ? w.color : 'var(--fm-border)',
                opacity: dimmed ? 0.45 : 1,
              }}
              className={`absolute w-[260px] rounded-[14px] bg-[var(--fm-panel)] border-2 p-3 text-left shadow-xs cursor-pointer z-10 ${
                isSelected || isHighlighted ? 'shadow-md' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-[11px] font-mono-tabular font-extrabold"
                  style={{ color: w.color }}
                >
                  PILLAR {w.num}
                </span>
                <span className="text-[11px] font-mono-tabular font-semibold text-[var(--fm-muted)]">
                  {w.node.defaultDurationText}
                </span>
              </div>
              <div className="text-[13px] font-bold text-[var(--fm-text)] truncate mt-0.5">
                {w.node.title}
              </div>
              <div className="text-[11.5px] text-[var(--fm-muted)] truncate mt-0.5">
                {w.node.subtitle}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 15. 5연동 육각형(Hexagon) 허니콤 전략 매트릭스 (Creative Hexagon Honeycomb Cluster)
 * Matches "Strategy Presentation Template" interlocking colorful hexagons in `image_dcc2a8f5.png`.
 */
export const CreativeHexagonHoneycombCanvas: React.FC<CreativeCanvasProps> = ({
  template,
  scenario,
  selectedNodeId,
  ambientProgress,
  zoom,
  onSelectNode,
}) => {
  const isTriadFocus = scenario.activeEdges.includes('triad');

  const createHexPoints = (cx: number, cy: number, r: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angleRad = ((60 * i - 30) * Math.PI) / 180;
      pts.push(`${(cx + r * Math.cos(angleRad)).toFixed(1)},${(cy + r * Math.sin(angleRad)).toFixed(1)}`);
    }
    return pts.join(' ');
  };

  const hexCells = [
    {
      node: template.nodes[0],
      num: '01',
      cx: 165,
      cy: 235,
      isTopCard: false,
      color: 'var(--fm-accent-hover)', // Indigo
      lightBg: 'var(--fm-selected)',
      isTriad: false,
    },
    {
      node: template.nodes[1],
      num: '02',
      cx: 365,
      cy: 345,
      isTopCard: true,
      color: 'var(--fm-accent)', // Cyan
      lightBg: 'var(--fm-selected)',
      isTriad: true,
    },
    {
      node: template.nodes[2],
      num: '03',
      cx: 565,
      cy: 235,
      isTopCard: false,
      color: 'var(--fm-accent)', // Emerald
      lightBg: 'var(--fm-selected)',
      isTriad: true,
    },
    {
      node: template.nodes[3],
      num: '04',
      cx: 765,
      cy: 345,
      isTopCard: true,
      color: 'var(--fm-warning)', // Amber
      lightBg: 'var(--fm-selected)',
      isTriad: true,
    },
    {
      node: template.nodes[4],
      num: '05',
      cx: 965,
      cy: 235,
      isTopCard: false,
      color: 'var(--fm-danger)', // Rose
      lightBg: 'var(--fm-selected)',
      isTriad: false,
    },
  ];

  const activeHexIdx = Math.floor(ambientProgress * 5) % 5;

  return (
    <div
      className="flex-1 relative overflow-auto flow-dot-grid select-none"
      data-testid="flow-canvas-hexagon-honeycomb"
    >
      <div
        className="relative w-[1130px] h-[620px] origin-top-left"
        style={{ transform: `scale(${zoom})` }}
      >
        {/* Top Slide Header Strip */}
        <div className="absolute left-7 top-4 right-7 flex items-center justify-between border-b border-[var(--fm-border)] pb-2.5">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[var(--fm-accent-hover)]" />
            <span className="text-[12px] font-bold tracking-wider uppercase text-[var(--fm-muted)]">
              STRATEGY PRESENTATION TEMPLATE · 5-HEXAGON HONEYCOMB MATRIX
            </span>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-[var(--fm-muted)] font-mono-tabular">
            <span>버티컬 진출: 4개 산업군</span>
            <span>·</span>
            <span>추론 단가 절감: -60%</span>
            <span>·</span>
            <span className="text-[var(--fm-accent-hover)] font-semibold">글로벌 파트너 32개사</span>
          </div>
        </div>

        {/* Interlocking Hexagon SVG Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          {/* Connecting Synapse Lines between Hexagon Centers */}
          {hexCells.slice(0, -1).map((cell, i) => {
            const next = hexCells[i + 1];
            const localT = (ambientProgress * 2 + i * 0.25) % 1;
            const px = cell.cx + (next.cx - cell.cx) * localT;
            const py = cell.cy + (next.cy - cell.cy) * localT;

            return (
              <g key={`hex-link-${i}`}>
                <line
                  x1={cell.cx}
                  y1={cell.cy}
                  x2={next.cx}
                  y2={next.cy}
                  stroke="var(--fm-control-border)"
                  strokeWidth="2.5"
                  strokeDasharray="6 5"
                  className="animate-flow-dash"
                />
                <circle cx={px} cy={py} r="7" fill={cell.color} opacity="0.28" />
                <circle cx={px} cy={py} r="4" fill={cell.color} />
              </g>
            );
          })}

          {/* 5 Double-Ring Hexagons */}
          {hexCells.map((cell, idx) => {
            const isHighlighted = idx === activeHexIdx || selectedNodeId === cell.node.id;
            const dimmed = isTriadFocus && !cell.isTriad;
            const cardStemY = cell.isTopCard ? 164 : 418;

            return (
              <g key={cell.num} opacity={dimmed ? 0.4 : 1}>
                {/* Vertical stem to detail card */}
                <line
                  x1={cell.cx}
                  y1={cell.cy}
                  x2={cell.cx}
                  y2={cardStemY}
                  stroke={cell.color}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                {/* Outer Double-Ring Hexagon (Soft Tinted Fill) */}
                <polygon
                  points={createHexPoints(cell.cx, cell.cy, 78)}
                  fill={cell.lightBg}
                  stroke={cell.color}
                  strokeWidth={isHighlighted ? '3.5' : '2.5'}
                  strokeDasharray="8 4"
                  className="animate-flow-dash"
                />
                {/* Inner Solid Colored Hexagon Core */}
                <polygon
                  points={createHexPoints(cell.cx, cell.cy, 58)}
                  fill={cell.color}
                  stroke="var(--fm-panel)"
                  strokeWidth="3"
                />
              </g>
            );
          })}
        </svg>

        {/* Interactive Center Icons on Hexagons & Alternating Detail Cards */}
        {hexCells.map((cell, idx) => {
          const isSelected = selectedNodeId === cell.node.id;
          const isHighlighted = idx === activeHexIdx;
          const dimmed = isTriadFocus && !cell.isTriad;

          return (
            <React.Fragment key={cell.node.id}>
              {/* Clickable Hexagon Core Button */}
              <button
                type="button"
                onClick={() => onSelectNode(cell.node.id)}
                style={{ left: cell.cx - 42, top: cell.cy - 42 }}
                className="absolute w-[84px] h-[84px] rounded-full flex flex-col items-center justify-center text-[var(--fm-on-accent)] cursor-pointer z-10"
              >
                {renderNodeIcon(cell.node.icon, 'w-6 h-6')}
                <span className="text-[11px] font-mono-tabular font-extrabold mt-1">
                  HEX {cell.num}
                </span>
              </button>

              {/* Connected Strategy Callout Card */}
              <button
                type="button"
                onClick={() => onSelectNode(cell.node.id)}
                style={{
                  left: Math.max(20, Math.min(890, cell.cx - 108)),
                  top: cell.isTopCard ? 66 : 422,
                  borderColor: isSelected || isHighlighted ? cell.color : 'var(--fm-border)',
                  opacity: dimmed ? 0.45 : 1,
                }}
                className={`absolute w-[216px] rounded-[14px] bg-[var(--fm-panel)] border-2 p-3 text-left shadow-xs cursor-pointer z-10 ${
                  isSelected || isHighlighted ? 'shadow-md' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span
                    className="text-[10.5px] font-mono-tabular font-extrabold uppercase"
                    style={{ color: cell.color }}
                  >
                    {cell.node.defaultDurationText}
                  </span>
                  <Layers className="w-3.5 h-3.5 text-[var(--fm-control-border)]" />
                </div>
                <div className="text-[12.5px] font-bold text-[var(--fm-text)] truncate mt-0.5">
                  {cell.node.title}
                </div>
                <div className="text-[11px] text-[var(--fm-muted)] truncate mt-0.5">
                  {cell.node.subtitle}
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
