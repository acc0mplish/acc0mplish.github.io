import React, { useState } from 'react';
import { FlowTemplate, FlowScenario } from '../utils/flowEngine';

interface EditorialMcpSkillCanvasProps {
  template: FlowTemplate;
  scenario: FlowScenario;
  selectedNodeId: string | null;
  ambientProgress: number;
  zoom: number;
  onSelectNode: (nodeId: string) => void;
}

/**
 * Reusable 3-layer Neural Network SVG group matching the blue circular AI icon in `image_30392ff6.png`.
 */
const NeuralNetCircleSvg: React.FC<{
  cx: number;
  cy: number;
  r?: number;
  ambientProgress: number;
  accentColor?: string;
}> = ({ cx, cy, r = 46, ambientProgress, accentColor = 'var(--fm-accent)' }) => {
  const col1X = cx - 20;
  const col2X = cx;
  const col3X = cx + 20;

  const col1Y = [cy - 17, cy, cy + 17];
  const col2Y = [cy - 25, cy - 8.5, cy + 8.5, cy + 25];
  const col3Y = [cy - 17, cy, cy + 17];

  const activeLayer = Math.floor(ambientProgress * 3) % 3;

  return (
    <g>
      {/* Outer soft halo */}
      <circle
        cx={cx}
        cy={cy}
        r={r + 4}
        fill="color-mix(in srgb, var(--fm-accent) 6%, transparent)"
      />
      {/* Main white circle with deep blue border */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="var(--fm-soft)"
        stroke={accentColor}
        strokeWidth="2.6"
      />

      {/* Neural network synaptic mesh lines: Col 1 -> Col 2 */}
      {col1Y.map((y1, i) =>
        col2Y.map((y2, j) => (
          <line
            key={`l1-${i}-${j}`}
            x1={col1X}
            y1={y1}
            x2={col2X}
            y2={y2}
            stroke="var(--fm-accent)"
            strokeWidth="1.25"
            opacity="0.7"
          />
        ))
      )}

      {/* Neural network synaptic mesh lines: Col 2 -> Col 3 */}
      {col2Y.map((y2, i) =>
        col3Y.map((y3, j) => (
          <line
            key={`l2-${i}-${j}`}
            x1={col2X}
            y1={y2}
            x2={col3X}
            y2={y3}
            stroke="var(--fm-accent)"
            strokeWidth="1.25"
            opacity="0.7"
          />
        ))
      )}

      {/* Col 1 Neuron Nodes */}
      {col1Y.map((y, i) => (
        <circle
          key={`n1-${i}`}
          cx={col1X}
          cy={y}
          r={activeLayer === 0 ? 4.4 : 3.6}
          fill={activeLayer === 0 ? 'var(--fm-accent)' : 'var(--fm-accent)'}
        />
      ))}

      {/* Col 2 Neuron Nodes */}
      {col2Y.map((y, i) => (
        <circle
          key={`n2-${i}`}
          cx={col2X}
          cy={y}
          r={activeLayer === 1 ? 4.4 : 3.6}
          fill={activeLayer === 1 ? 'var(--fm-accent)' : 'var(--fm-accent)'}
        />
      ))}

      {/* Col 3 Neuron Nodes */}
      {col3Y.map((y, i) => (
        <circle
          key={`n3-${i}`}
          cx={col3X}
          cy={y}
          r={activeLayer === 2 ? 4.4 : 3.6}
          fill={activeLayer === 2 ? 'var(--fm-accent)' : 'var(--fm-accent)'}
        />
      ))}
    </g>
  );
};

export const EditorialMcpSkillCanvas: React.FC<EditorialMcpSkillCanvasProps> = ({
  template,
  scenario,
  selectedNodeId,
  ambientProgress,
  zoom,
  onSelectNode,
}) => {
  const isSynergyScenario = scenario.activeEdges.includes('synergy');
  const isDeckCycleScenario = scenario.activeEdges.includes('deck');

  const skillDeckItems = [
    {
      title: '엑셀 만들기',
      sub: '순서 · 양식 · 주의점',
      tag: '표준 양식 설명서',
    },
    {
      title: '주간 보고서 요약',
      sub: '핵심지표 · 3줄요약 · 리스크',
      tag: '임원 보고 요령',
    },
    {
      title: '전표 이상치 검증',
      sub: '세금계산서 · 중복결제 · 규정',
      tag: '재무 감사 요령',
    },
  ];

  const [manualSkillIdx, setManualSkillIdx] = useState<number>(0);
  const activeSkillIdx = isDeckCycleScenario
    ? Math.floor(ambientProgress * 3) % 3
    : manualSkillIdx;
  const currentSkill = skillDeckItems[activeSkillIdx] || skillDeckItems[0];

  // Left MCP Diagram coordinates (inside 488 x 252 SVG)
  const mcpHubX = 244;
  const mcpHubY = 126;

  const mcpBranches = [
    {
      nodeId: 'mcp-db',
      title: '사내 DB',
      cardX: 38,
      cardY: 16,
      portX: 126,
      portY: 66,
      hubAnchorX: 202,
      hubAnchorY: 104,
      badgeX: 164,
      badgeY: 85,
      iconType: 'db' as const,
    },
    {
      nodeId: 'mcp-cal',
      title: '일정',
      cardX: 38,
      cardY: 152,
      portX: 126,
      portY: 186,
      hubAnchorX: 202,
      hubAnchorY: 148,
      badgeX: 164,
      badgeY: 167,
      iconType: 'calendar' as const,
    },
    {
      nodeId: 'mcp-file',
      title: '파일 서버',
      cardX: 362,
      cardY: 16,
      portX: 362,
      portY: 66,
      hubAnchorX: 286,
      hubAnchorY: 104,
      badgeX: 324,
      badgeY: 85,
      iconType: 'folder' as const,
      hasStaticDot: true,
    },
    {
      nodeId: 'mcp-erp',
      title: 'ERP',
      cardX: 362,
      cardY: 152,
      portX: 362,
      portY: 186,
      hubAnchorX: 286,
      hubAnchorY: 148,
      badgeX: 324,
      badgeY: 167,
      iconType: 'erp' as const,
    },
  ];

  // Right Skill Diagram coordinates (inside 488 x 252 SVG)
  // Curved dashed arrow from tilted Skill Card (x=258, y=132) to AI Hub (cx=392, cy=124)
  const skillArcStart = { x: 256, y: 132 };
  const skillArcCtrl = { x: 294, y: 102 };
  const skillArcEnd = { x: 332, y: 118 };

  const getQuadBezierPt = (t: number) => {
    const u = Math.max(0, Math.min(1, t));
    const inv = 1 - u;
    return {
      x:
        inv * inv * skillArcStart.x +
        2 * inv * u * skillArcCtrl.x +
        u * u * skillArcEnd.x,
      y:
        inv * inv * skillArcStart.y +
        2 * inv * u * skillArcCtrl.y +
        u * u * skillArcEnd.y,
    };
  };

  const skillPacketPt = getQuadBezierPt((ambientProgress * 1.4) % 1);

  return (
    <div
      className="klic-flowmotion flex-1 relative overflow-auto bg-[var(--fm-soft)] select-none"
      data-testid="flow-canvas-editorial-mcp-skill"
    >
      <div
        className="relative w-[1130px] h-[610px] px-7 py-6 origin-top-left flex flex-col justify-between"
        style={{ transform: `scale(${zoom})` }}
      >
        {/* Dual Editorial Cards Container (Matches image_30392ff6.png 1:1) */}
        <div className="grid grid-cols-2 gap-6">
          {/* ================= LEFT CARD: MCP (모델 연결 규격) ================= */}
          <article
            className="rounded-[22px] bg-[var(--fm-surface)] border-[1.5px] border-[var(--fm-border)] px-7 pt-6 pb-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Heading */}
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[22px] font-extrabold tracking-tight text-[var(--fm-accent)]">
                  MCP (Model Context Protocol, 모델 연결 규격)
                </h3>
                {isSynergyScenario && (
                  <span className="text-[11.5px] font-mono-tabular font-bold text-[var(--fm-accent)]">
                    STEP 02 · 도구 실행
                  </span>
                )}
              </div>

              {/* Interactive Diagram Box */}
              <div className="relative h-[252px] mt-3">
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                  viewBox="0 0 488 252"
                >
                  {/* 4 Diagonal Connector Lines + Traveling Signal Packets + MCP Badges */}
                  {mcpBranches.map((br, idx) => {
                    const localT = (ambientProgress * 1.2 + idx * 0.25) % 1;
                    // Packet travels between Hub and System Port
                    const px =
                      br.hubAnchorX + (br.portX - br.hubAnchorX) * localT;
                    const py =
                      br.hubAnchorY + (br.portY - br.hubAnchorY) * localT;
                    const isFocused = selectedNodeId === br.nodeId;

                    return (
                      <g key={br.nodeId}>
                        <line
                          x1={br.portX}
                          y1={br.portY}
                          x2={br.hubAnchorX}
                          y2={br.hubAnchorY}
                          stroke={isFocused ? 'var(--fm-accent)' : 'var(--fm-accent)'}
                          strokeWidth={isFocused ? '3' : '2.4'}
                        />
                        {/* Static port dot on 파일 서버 matching reference image */}
                        {br.hasStaticDot && (
                          <circle
                            cx={br.portX - 6}
                            cy={br.portY + 3}
                            r="4.5"
                            fill="var(--fm-accent)"
                          />
                        )}
                        {/* Animated Traveling Signal Packet */}
                        <circle
                          cx={px}
                          cy={py}
                          r="7"
                          fill="color-mix(in srgb, var(--fm-accent) 22%, transparent)"
                        />
                        <circle cx={px} cy={py} r="4" fill="var(--fm-accent)" />

                        {/* Solid Blue 'MCP' Protocol Pill Badge on the Connector */}
                        <rect
                          x={br.badgeX - 23}
                          y={br.badgeY - 11}
                          width="46"
                          height="22"
                          rx="6"
                          fill="var(--fm-accent)"
                        />
                        <text
                          x={br.badgeX}
                          y={br.badgeY + 4}
                          textAnchor="middle"
                          fill="var(--fm-on-accent)"
                          fontSize="11.5"
                          fontWeight="800"
                          fontFamily="inherit"
                        >
                          MCP
                        </text>
                      </g>
                    );
                  })}

                  {/* Central AI Neural Network Hub */}
                  <NeuralNetCircleSvg
                    cx={mcpHubX}
                    cy={mcpHubY}
                    r={46}
                    ambientProgress={ambientProgress}
                  />
                </svg>

                {/* Clickable Overlay on Central AI Hub */}
                <button
                  type="button"
                  aria-label="MCP AI 모델 코어 선택"
                  onClick={() => onSelectNode('mcp-ai-core')}
                  style={{ left: mcpHubX - 46, top: mcpHubY - 46 }}
                  className="absolute w-[92px] h-[92px] rounded-full cursor-pointer z-10"
                />

                {/* 4 Corner System Boxes (사내 DB, 일정, 파일 서버, ERP) */}
                {mcpBranches.map((br) => {
                  const isSelected = selectedNodeId === br.nodeId;
                  const nodeObj = template.nodes.find((n) => n.id === br.nodeId);
                  const displayTitle = nodeObj ? nodeObj.title : br.title;

                  return (
                    <button
                      key={br.nodeId}
                      type="button"
                      onClick={() => onSelectNode(br.nodeId)}
                      style={{ left: br.cardX, top: br.cardY }}
                      className={`absolute w-[88px] h-[82px] rounded-[16px] bg-white border-[1.5px] flex flex-col items-center justify-center gap-1.5 cursor-pointer z-10 ${
                        isSelected
                          ? 'border-[var(--fm-accent)] shadow-md ring-2 ring-[var(--fm-accent)]/15'
                          : 'border-[var(--fm-border)] hover:border-[var(--fm-accent)]'
                      }`}
                    >
                      {/* Custom Crisp Vector Icons matching image_30392ff6.png */}
                      {br.iconType === 'db' && (
                        <svg
                          width="26"
                          height="26"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--fm-accent)"
                          strokeWidth="1.8"
                        >
                          <ellipse cx="12" cy="5" rx="7" ry="2.8" />
                          <path d="M5 5v14c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8V5" />
                          <path d="M5 12c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8" />
                        </svg>
                      )}
                      {br.iconType === 'calendar' && (
                        <svg
                          width="26"
                          height="26"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--fm-accent)"
                          strokeWidth="1.8"
                        >
                          <rect x="3" y="4" width="18" height="17" rx="2.5" />
                          <line x1="8" y1="2.5" x2="8" y2="6" />
                          <line x1="16" y1="2.5" x2="16" y2="6" />
                          <line x1="3" y1="9.5" x2="21" y2="9.5" />
                          <circle cx="8.5" cy="14" r="1" fill="var(--fm-accent)" />
                          <circle cx="12" cy="14" r="1" fill="var(--fm-accent)" />
                          <circle cx="15.5" cy="14" r="1" fill="var(--fm-accent)" />
                          <circle cx="8.5" cy="17.5" r="1" fill="var(--fm-accent)" />
                          <circle cx="12" cy="17.5" r="1" fill="var(--fm-accent)" />
                        </svg>
                      )}
                      {br.iconType === 'folder' && (
                        <svg
                          width="26"
                          height="26"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--fm-accent)"
                          strokeWidth="1.8"
                        >
                          <path d="M3 6.5A2 2 0 0 1 5 4.5h4.2l2.2 2.5H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-11.5Z" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      )}
                      {br.iconType === 'erp' && (
                        <svg
                          width="26"
                          height="26"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--fm-accent)"
                          strokeWidth="1.8"
                        >
                          <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
                          <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" />
                          <line x1="3.5" y1="14.5" x2="20.5" y2="14.5" />
                          <line x1="9.2" y1="4.5" x2="9.2" y2="19.5" />
                          <line x1="14.8" y1="4.5" x2="14.8" y2="19.5" />
                        </svg>
                      )}
                      <span className="text-[13px] font-bold text-[var(--fm-text)] leading-none">
                        {displayTitle}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Editorial Explanation Paragraph */}
              <p className="mt-3 text-[16.5px] leading-[1.62] text-[var(--fm-text)] tracking-[-0.01em]">
                <strong className="font-extrabold text-[var(--fm-text)]">
                  손이 닿는 곳을 넓힌다.
                </strong>{' '}
                AI와 다른 프로그램을 잇는 공용 연결 규격. USB-C처럼 한 번 맞춰 두면
                여러 AI에서 씁니다.
              </p>
            </div>

            {/* Bottom Blue Callout Box */}
            <div className="mt-4 rounded-[12px] bg-[var(--fm-selected)] px-4 py-3 text-[14.5px] font-bold text-[var(--fm-accent)] leading-[1.5]">
              작동: 시스템마다 ‘MCP 서버’를 두면, AI가 그 서버의 기능 목록(조회·등록
              등)을 보고 필요할 때 부름
            </div>
          </article>

          {/* ================= RIGHT CARD: 스킬 (Skill, 일하는 요령) ================= */}
          <article
            className="rounded-[22px] bg-[var(--fm-surface)] border-[1.5px] border-[var(--fm-border)] px-7 pt-6 pb-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Heading */}
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[22px] font-extrabold tracking-tight text-[var(--fm-warning)]">
                  스킬 (Skill, 일하는 요령)
                </h3>
                {/* Optional Mini Deck Selector Pills */}
                <div className="flex items-center gap-1">
                  {skillDeckItems.map((sk, idx) => (
                    <button
                      key={sk.title}
                      type="button"
                      onClick={() => {
                        setManualSkillIdx(idx);
                        onSelectNode('skill-excel');
                      }}
                      className={`px-2 py-0.5 rounded-[6px] text-[11px] font-semibold cursor-pointer ${
                        activeSkillIdx === idx
                          ? 'bg-[color-mix(in_srgb,var(--fm-warning)_12%,var(--fm-surface))] text-[var(--fm-warning)] border border-[color-mix(in_srgb,var(--fm-warning)_12%,var(--fm-surface))]'
                          : 'text-[var(--fm-muted)] hover:text-[var(--fm-text)]'
                      }`}
                    >
                      0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Diagram Box */}
              <div className="relative h-[252px] mt-3">
                {/* Fanned 3-Card Skill Stack on the Left */}
                <div className="absolute left-[82px] top-[46px] w-[150px] h-[146px]">
                  {/* Back Fanned Card 1 (-14 deg) */}
                  <div
                    className="absolute inset-0 rounded-[16px] bg-[var(--fm-soft)] border-[1.5px] border-[var(--fm-border)]"
                    style={{
                      transform: 'translate(-26px, 10px) rotate(-14deg)',
                    }}
                  />
                  {/* Back Fanned Card 2 (-6 deg) */}
                  <div
                    className="absolute inset-0 rounded-[16px] bg-[var(--fm-soft)] border-[1.5px] border-[var(--fm-border)]"
                    style={{
                      transform: 'translate(-13px, 4px) rotate(-6deg)',
                    }}
                  />
                  {/* Front Active Skill Card (+4 deg, Orange Border) */}
                  <button
                    type="button"
                    onClick={() => onSelectNode('skill-excel')}
                    style={{
                      transform: 'rotate(4deg)',
                    }}
                    className={`absolute inset-0 rounded-[16px] bg-white border-[2px] flex flex-col items-center justify-center px-3 text-center shadow-md cursor-pointer z-10 ${
                      selectedNodeId === 'skill-excel'
                        ? 'border-[var(--fm-warning)] ring-2 ring-[var(--fm-warning)]/20'
                        : 'border-[var(--fm-warning)]'
                    }`}
                  >
                    {/* Orange 3x3 Spreadsheet Grid Icon matching image_30392ff6.png */}
                    <svg
                      width="42"
                      height="42"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--fm-warning)"
                      strokeWidth="1.9"
                      className="mb-2.5"
                    >
                      <rect x="3" y="3.5" width="18" height="17" rx="2.2" />
                      <line x1="3" y1="9.2" x2="21" y2="9.2" />
                      <line x1="3" y1="14.8" x2="21" y2="14.8" />
                      <line x1="9" y1="3.5" x2="9" y2="20.5" />
                      <line x1="15" y1="3.5" x2="15" y2="20.5" />
                    </svg>
                    <div className="text-[15.5px] font-extrabold text-[var(--fm-text)] leading-tight">
                      {currentSkill.title}
                    </div>
                    <div className="text-[12px] font-medium text-[var(--fm-muted)] mt-1">
                      {currentSkill.sub}
                    </div>
                  </button>
                </div>

                {/* SVG Layer for Curved Dashed Arrow, Traveling Packet, and Right AI Hub */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                  viewBox="0 0 488 252"
                >
                  {/* Curved Dashed Orange Arrow from Skill Deck to AI Hub */}
                  <path
                    d={`M ${skillArcStart.x} ${skillArcStart.y} Q ${skillArcCtrl.x} ${skillArcCtrl.y} ${skillArcEnd.x} ${skillArcEnd.y}`}
                    fill="none"
                    stroke="var(--fm-warning)"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                    className="animate-flow-dash"
                  />
                  {/* Bold Triangular Orange Arrowhead */}
                  <polygon
                    points="342,122 325,109 322,126"
                    fill="var(--fm-warning)"
                  />

                  {/* Traveling Orange Skill Packet along the Arc */}
                  <circle
                    cx={skillPacketPt.x}
                    cy={skillPacketPt.y}
                    r="8"
                    fill="color-mix(in srgb, var(--fm-warning) 24%, transparent)"
                  />
                  <circle
                    cx={skillPacketPt.x}
                    cy={skillPacketPt.y}
                    r="4.2"
                    fill="var(--fm-warning)"
                  />

                  {/* Right AI Neural Network Circle */}
                  <NeuralNetCircleSvg
                    cx={398}
                    cy={124}
                    r={46}
                    ambientProgress={ambientProgress}
                  />
                </svg>

                {/* Caption under the orange arrow & AI Circle: '필요할 때 꺼내 읽기' */}
                <div className="absolute right-[44px] bottom-[22px] text-[14.5px] font-bold text-[var(--fm-warning)]">
                  필요할 때 꺼내 읽기
                </div>
              </div>

              {/* Editorial Explanation Paragraph */}
              <p className="mt-3 text-[16.5px] leading-[1.62] text-[var(--fm-text)] tracking-[-0.01em]">
                <strong className="font-extrabold text-[var(--fm-text)]">
                  일하는 요령을 알려 준다.
                </strong>{' '}
                특정 일을 처리하는 방법을 적어 둔 설명서 묶음. AI가 필요할 때 꺼내
                읽고 따라 합니다.
              </p>
            </div>

            {/* Bottom Peach/Orange Callout Box */}
            <div className="mt-4 rounded-[12px] bg-[color-mix(in_srgb,var(--fm-warning)_12%,var(--fm-surface))] px-4 py-3 text-[14.5px] font-bold text-[var(--fm-warning)] leading-[1.5]">
              다음 장에서 자세히: 스킬의 구조와 자주 쓰는 스킬
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
