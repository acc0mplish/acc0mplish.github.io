import React, { useState } from 'react';
import {
  MapPin,
  BarChart3,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle2,
  GitPullRequest,
  ShieldCheck,
  Cpu,
  Layers,
  MessageSquare,
  Bell,
  Zap,
  Database,
  Server,
  FileCheck2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import { FlowTemplate, FlowScenario } from '../utils/flowEngine';

interface ItWorkflowEditorialCanvasProps {
  template: FlowTemplate;
  scenario: FlowScenario;
  selectedNodeId: string | null;
  ambientProgress: number;
  zoom: number;
  onSelectNode: (id: string) => void;
}

export const ItWorkflowEditorialCanvases: React.FC<ItWorkflowEditorialCanvasProps> = ({
  template,
  scenario,
  selectedNodeId,
  ambientProgress,
  zoom,
  onSelectNode,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<number>(0);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejected, setRejected] = useState(false);
  const nodes = template.nodes;
  const isSynergy = scenario.activeEdges.includes('synergy');
  const isDeck = scenario.activeEdges.includes('deck');

  // ============================================================================
  // 18. PMS (it-pms-project)
  // Layout: 4-Pin Teardrop Milestone Header + WBS Interactive Gantt & Progress Chart
  // (Modeled on image_fc8278e0.png Top-2nd "Infographic Layout" + Middle-3rd "Table & Chart")
  // ============================================================================
  if (template.layoutType === 'it-pms-project') {
    const pins = [
      {
        step: '01',
        title: '착수 · 요구사항 정의',
        period: 'M1 (1~4주)',
        rate: '100%',
        desc: 'RFP 범위 확정 · WBS 1차 베이스라인',
        nodeId: nodes[0]?.id || 'pms-jira',
        cx: 155,
      },
      {
        step: '02',
        title: 'UI/UX · 아키텍처 설계',
        period: 'M2 (5~8주)',
        rate: '95%',
        desc: '화면설계서 · ERD 모델링 · API 명세',
        nodeId: nodes[1]?.id || 'pms-wbs',
        cx: 415,
      },
      {
        step: '03',
        title: '핵심 모듈 스프린트 구현',
        period: 'M3~M4 (9~16주)',
        rate: '82%',
        desc: '백엔드·프론트 개발 & 주간 빌드 통제',
        nodeId: nodes[2]?.id || 'pms-resource',
        cx: 675,
      },
      {
        step: '04',
        title: '통합테스트 · 본가동 오픈',
        period: 'M5 (17~20주)',
        rate: '68%',
        desc: 'UAT 인수테스트 · 성능 점검 · 안정화',
        nodeId: nodes[3]?.id || 'pms-risk',
        cx: 935,
      },
    ];

    const ganttRows = [
      { id: 'WBS-1.1', task: '요구사항 정의서 & WBS 수립', owner: 'PMO 리드', startCol: 1, span: 2, pct: 100, status: '완료', nodeIdx: 0 },
      { id: 'WBS-2.1', task: '시스템 아키텍처 & ERD 설계', owner: 'AA/DA', startCol: 2, span: 3, pct: 95, status: '정상', nodeIdx: 1 },
      { id: 'WBS-3.1', task: '코어 백엔드 API & 인증 엔진', owner: '백엔드팀', startCol: 4, span: 4, pct: 86, status: '정상', nodeIdx: 2 },
      { id: 'WBS-3.2', task: '대외계 전문 & 레거시 연동', owner: '인터페이스팀', startCol: 5, span: 4, pct: 72, status: '지연주의', critical: true, nodeIdx: 3 },
      { id: 'WBS-4.1', task: '프론트엔드 대시보드 & 모션', owner: '프론트팀', startCol: 5, span: 4, pct: 90, status: '정상', nodeIdx: 4 },
      { id: 'WBS-5.1', task: '통합 E2E 품질검증 & UAT', owner: 'QA팀', startCol: 8, span: 3, pct: 68, status: '진행중', nodeIdx: 5 },
    ];

    const resourceBars = [
      { label: 'Contents A · 백엔드 코어 스쿼드', mm: '18.5 M/M', pct: 94, note: '일정 준수' },
      { label: 'Contents B · 프론트엔드 & UI 스쿼드', mm: '14.0 M/M', pct: 88, note: '일정 준수' },
      { label: 'Contents C · 대외계 인터페이스 (Critical)', mm: '12.5 M/M', pct: 72, note: '공수 +2명 재배치' },
      { label: 'Contents D · QA 자동화 & 보안 검수', mm: '9.0 M/M', pct: 89, note: '일정 준수' },
    ];

    return (
      <div className="klic-flowmotion flex-1 w-full h-full overflow-auto bg-[var(--fm-soft)] px-6 py-4 flex flex-col items-center select-none">
        <div
          className="w-full max-w-[1260px] space-y-4"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        >
          {/* Slide Header Strip (Matches Cyan PPT Header in image_fc8278e0.png) */}
          <div className="bg-white rounded-[18px] border border-[var(--fm-border)] px-6 py-3.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="text-[22px] font-black tracking-tight text-[var(--fm-accent)]">
                Infographic
              </span>
              <span className="text-[22px] font-extrabold tracking-tight text-[var(--fm-text)]">
                &amp; WBS Chart Layout
              </span>
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-[var(--fm-selected)] border border-[var(--fm-accent)] text-[var(--fm-accent)] text-[11.5px] font-bold">
                18 · PMS 프로젝트 마일스톤 &amp; WBS 공정 관리
              </span>
            </div>
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--fm-muted)]">
              <Calendar className="w-4 h-4 text-[var(--fm-accent)]" />
              <span>전체 공정률: <strong className="text-[var(--fm-accent)] font-mono-tabular">86.4%</strong> (크리티컬 패스 1건 집중관리)</span>
            </div>
          </div>

          {/* TOP DIAGRAM: 4-Pin Cyan Teardrop Infographic (image_fc8278e0.png Top-2nd) */}
          <div className="bg-white rounded-[20px] border border-[var(--fm-border)] p-5 shadow-2xs">
            <svg viewBox="0 0 1090 215" className="w-full h-[205px] block select-none">
              {/* Horizontal Milestone Track Line */}
              <line
                x1="155"
                y1="68"
                x2="935"
                y2="68"
                stroke="var(--fm-border)"
                strokeWidth="3"
                strokeDasharray="8 6"
              />
              <line
                x1="155"
                y1="68"
                x2={155 + ambientProgress * 780}
                y2="68"
                stroke="var(--fm-accent)"
                strokeWidth="3.5"
              />
              <circle
                cx={155 + ambientProgress * 780}
                cy="68"
                r="6"
                fill="var(--fm-accent)"
              />

              {pins.map((pin, idx) => {
                const isSelected = selectedNodeId === pin.nodeId;
                return (
                  <g
                    key={pin.step}
                    className="cursor-pointer"
                    onClick={() => onSelectNode(pin.nodeId)}
                  >
                    {/* Outer Cyan Teardrop Pin Shape */}
                    <path
                      d={`M ${pin.cx} 118 C ${pin.cx - 34} 88, ${pin.cx - 42} 66, ${pin.cx - 42} 48 A 42 42 0 1 1 ${pin.cx + 42} 48 C ${pin.cx + 42} 66, ${pin.cx + 34} 88, ${pin.cx} 118 Z`}
                      fill={isSelected ? 'var(--fm-accent)' : 'var(--fm-accent)'}
                    />
                    {/* Inner White Circle */}
                    <circle
                      cx={pin.cx}
                      cy="48"
                      r="29"
                      fill="var(--fm-surface)"
                    />
                    {/* Step Badge Inside Pin */}
                    <text
                      x={pin.cx}
                      y="44"
                      textAnchor="middle"
                      fill="var(--fm-accent)"
                      className="text-[11px] font-bold"
                    >
                      STEP {pin.step}
                    </text>
                    <text
                      x={pin.cx}
                      y="60"
                      textAnchor="middle"
                      fill="var(--fm-text)"
                      className="text-[13px] font-black"
                    >
                      {pin.rate}
                    </text>

                    {/* Text Caption Block Below Pin */}
                    <rect
                      x={pin.cx - 115}
                      y="130"
                      width="230"
                      height="76"
                      rx="12"
                      fill={isSelected ? 'var(--fm-selected)' : 'var(--fm-soft)'}
                      stroke={isSelected ? 'var(--fm-accent)' : 'var(--fm-border)'}
                      strokeWidth={isSelected ? '2' : '1.2'}
                    />
                    <text
                      x={pin.cx}
                      y="151"
                      textAnchor="middle"
                      fill="var(--fm-text)"
                      className="text-[13.5px] font-extrabold"
                    >
                      {pin.title}
                    </text>
                    <text
                      x={pin.cx}
                      y="169"
                      textAnchor="middle"
                      fill="var(--fm-accent)"
                      className="text-[11px] font-bold"
                    >
                      {pin.period} · 마일스톤 #{idx + 1}
                    </text>
                    <text
                      x={pin.cx}
                      y="188"
                      textAnchor="middle"
                      fill="var(--fm-muted)"
                      className="text-[10.5px] font-medium"
                    >
                      {pin.desc}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* BOTTOM SPLIT: Left WBS Gantt Schedule Table + Right Resource Horizontal Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left 7 Cols: WBS Gantt Chart Table */}
            <div className="lg:col-span-7 bg-white rounded-[20px] border border-[var(--fm-border)] p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--fm-border)]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--fm-accent)]" />
                  <h3 className="text-[15px] font-extrabold text-[var(--fm-text)]">
                    WBS 주차별 간트 스케줄 &amp; 크리티컬 패스
                  </h3>
                </div>
                <span className="text-[11px] font-mono-tabular font-bold text-[var(--fm-accent)] bg-[var(--fm-selected)] px-2.5 py-0.5 rounded-md">
                  W1 ~ W10 타임라인
                </span>
              </div>

              <div className="space-y-2">
                {ganttRows.map((row) => {
                  const targetNode = nodes[row.nodeIdx] || nodes[0];
                  const isSelected = selectedNodeId === targetNode?.id;
                  return (
                    <div
                      key={row.id}
                      onClick={() => targetNode && onSelectNode(targetNode.id)}
                      className={`grid grid-cols-12 items-center gap-2 px-3 py-2 rounded-[10px] border cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--fm-selected)] border-[var(--fm-accent)]'
                          : 'bg-[var(--fm-soft)] border-[var(--fm-border)] hover:border-[var(--fm-accent)]'
                      }`}
                    >
                      <div className="col-span-5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10.5px] font-mono-tabular font-bold text-[var(--fm-accent)]">
                            {row.id}
                          </span>
                          <span className="text-[12px] font-bold text-[var(--fm-text)] truncate">
                            {row.task}
                          </span>
                        </div>
                        <div className="text-[10.5px] text-[var(--fm-muted)]">
                          담당: {row.owner} · 진척도 {row.pct}%
                        </div>
                      </div>

                      {/* 10-Week Mini Gantt Track */}
                      <div className="col-span-5 bg-white h-5 rounded-md border border-[var(--fm-border)] p-0.5 relative flex items-center">
                        <div
                          className={`h-3.5 rounded ${
                            row.critical
                              ? 'bg-gradient-to-r from-[var(--fm-warning)] to-[var(--fm-warning)]'
                              : 'bg-gradient-to-r from-[var(--fm-accent)] to-[var(--fm-accent)]'
                          }`}
                          style={{
                            marginLeft: `${(row.startCol - 1) * 10}%`,
                            width: `${row.span * 10}%`,
                          }}
                        />
                      </div>

                      <div className="col-span-2 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-bold ${
                            row.critical
                              ? 'bg-[color-mix(in_srgb,var(--fm-warning)_12%,var(--fm-surface))] text-[var(--fm-warning)] border border-[var(--fm-warning)]'
                              : 'bg-[var(--fm-selected)] text-[var(--fm-accent)]'
                          }`}
                        >
                          {row.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 5 Cols: Table & Chart Layout (Modeled after image_fc8278e0.png Middle-3rd) */}
            <div className="lg:col-span-5 bg-white rounded-[20px] border border-[var(--fm-border)] p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--fm-border)]">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[var(--fm-accent)]" />
                    <h3 className="text-[15px] font-extrabold text-[var(--fm-text)]">
                      Table &amp; Chart · 스쿼드 공수 가동률
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono-tabular font-bold text-[var(--fm-muted)]">
                    총 54.0 M/M
                  </span>
                </div>

                {/* Mini Cyan Summary Table */}
                <div className="grid grid-cols-3 text-center text-[11px] font-bold rounded-t-[8px] overflow-hidden border border-[var(--fm-border)]">
                  <div className="bg-[var(--fm-accent)] text-[var(--fm-on-accent)] py-1.5">구분 (Track)</div>
                  <div className="bg-[var(--fm-border)] text-[var(--fm-text)] py-1.5 border-l border-white">계획 공수</div>
                  <div className="bg-[var(--fm-border)] text-[var(--fm-text)] py-1.5 border-l border-white">실적 달성</div>
                </div>
                <div className="grid grid-cols-3 text-center text-[11px] border-x border-b border-[var(--fm-border)] rounded-b-[8px] mb-4 bg-[var(--fm-soft)]">
                  <div className="py-1.5 font-bold text-[var(--fm-accent)] bg-[var(--fm-selected)]">코어 개발</div>
                  <div className="py-1.5 font-mono-tabular text-[var(--fm-text)]">32.5 M/M</div>
                  <div className="py-1.5 font-mono-tabular font-bold text-[var(--fm-text)]">91.2%</div>
                </div>

                {/* Horizontal Cyan Progress Bars */}
                <div className="space-y-3">
                  {resourceBars.map((b, i) => (
                    <div
                      key={b.label}
                      onClick={() => onSelectNode((nodes[i] || nodes[0]).id)}
                      className="space-y-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="font-bold text-[var(--fm-text)]">{b.label}</span>
                        <span className="font-mono-tabular font-bold text-[var(--fm-accent)]">
                          {b.mm} · {b.pct}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-[var(--fm-border)] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            b.pct < 75
                              ? 'bg-[var(--fm-warning)]'
                              : 'bg-gradient-to-r from-[var(--fm-accent)] to-[var(--fm-accent)]'
                          }`}
                          style={{ width: `${b.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--fm-soft)] flex items-center justify-between text-[11.5px] text-[var(--fm-muted)]">
                <span>PMO 자동 리포트: 매주 금요일 16:00 배포</span>
                <span className="font-bold text-[var(--fm-accent)]">리스크 완화 시나리오 가동 중</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 19. DESIGN (it-design-system)
  // Layout: iMac Monitor Component Studio + 3 Cyan Device Circles + 4 Smartphone Screens on Cyan Band
  // (Modeled on image_fc8278e0.png Top-3rd "Image & Content" + Bottom-4th 4-Phone Showcase)
  // ============================================================================
  if (template.layoutType === 'it-design-system') {
    const deviceCircles = [
      {
        name: 'Mobile Viewport',
        spec: '375 × 812px · 4-Column',
        token: 'space-xs: 4px / touch: 44px',
        Icon: Smartphone,
        nodeIdx: 0,
      },
      {
        name: 'Tablet Viewport',
        spec: '768 × 1024px · 8-Column',
        token: 'space-md: 16px / drawer-nav',
        Icon: Tablet,
        nodeIdx: 1,
      },
      {
        name: 'Desktop Viewport',
        spec: '1440 × 900px · 12-Column',
        token: 'space-lg: 24px / split-pane',
        Icon: Monitor,
        nodeIdx: 2,
      },
    ];

    const phoneScreens = [
      {
        step: '01',
        title: '디자인 토큰 정의',
        sub: 'Color · Typography · Radius',
        accent: 'var(--fm-accent)',
        nodeIdx: 0,
      },
      {
        step: '02',
        title: '오토레이아웃 컴포넌트',
        sub: 'Button · Input · Card Variants',
        accent: 'var(--fm-accent)',
        nodeIdx: 1,
      },
      {
        step: '03',
        title: '인터랙션 프로토타입',
        sub: 'Spring 300ms · 화면 전환',
        accent: 'var(--fm-accent)',
        nodeIdx: 2,
      },
      {
        step: '04',
        title: '개발 핸드오프 & 검수',
        sub: 'WCAG 4.5:1 · CSS 코드 추출',
        accent: 'var(--fm-accent)',
        nodeIdx: 3,
      },
    ];

    return (
      <div className="klic-flowmotion flex-1 w-full h-full overflow-auto bg-[var(--fm-soft)] px-6 py-4 flex flex-col items-center select-none">
        <div
          className="w-full max-w-[1260px] space-y-4"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        >
          {/* Slide Header */}
          <div className="bg-white rounded-[18px] border border-[var(--fm-border)] px-6 py-3.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="text-[22px] font-black tracking-tight text-[var(--fm-accent)]">
                Image &amp; Content
              </span>
              <span className="text-[22px] font-extrabold tracking-tight text-[var(--fm-text)]">
                Design System Layout
              </span>
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-[var(--fm-selected)] border border-[var(--fm-accent)] text-[var(--fm-accent)] text-[11.5px] font-bold">
                19 · UI/UX Figma 디자인 시스템 &amp; 디바이스 핸드오프
              </span>
            </div>
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--fm-muted)]">
              <Sliders className="w-4 h-4 text-[var(--fm-accent)]" />
              <span>디자인 토큰 동기화: <strong className="text-[var(--fm-accent)] font-mono-tabular">148개 변수 100% 일치</strong></span>
            </div>
          </div>

          {/* TOP ROW: iMac Monitor Frame (Left 5 Cols) + 3 Cyan Device Circles (Right 7 Cols) */}
          <div className="bg-white rounded-[20px] border border-[var(--fm-border)] p-6 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left 5 Cols: iMac / Studio Display Frame */}
            <div
              onClick={() => onSelectNode((nodes[4] || nodes[0]).id)}
              className="lg:col-span-5 flex flex-col items-center cursor-pointer"
            >
              <div className="w-full rounded-t-[14px] border-[8px] border-[var(--fm-border)] bg-[var(--fm-panel)] p-4 text-[var(--fm-text)]">
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[var(--fm-border)]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--fm-danger)]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--fm-warning)]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--fm-muted)]" />
                    <span className="ml-2 text-[11px] font-mono-tabular text-[var(--fm-accent)] font-bold">
                      Figma · Design Token Inspector
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[var(--fm-selected)] text-[var(--fm-accent)] text-[10px] font-mono-tabular">
                    8px Grid ON
                  </span>
                </div>

                {/* Live Component Anatomy inside Monitor */}
                <div className="grid grid-cols-12 gap-2.5 items-center">
                  <div className="col-span-7 bg-[var(--fm-soft)] rounded-[10px] p-3 border border-[var(--fm-border)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono-tabular text-[var(--fm-accent)]">
                        &lt;PrimaryButton /&gt;
                      </span>
                      <span className="text-[9.5px] font-mono-tabular text-amber-300">
                        padding: 12px 20px
                      </span>
                    </div>
                    <div className="h-8 rounded-[8px] bg-[var(--fm-accent)] flex items-center justify-center text-[12px] font-extrabold text-[var(--fm-on-accent)]">
                      디자인 토큰 코드 배포
                    </div>
                    <div className="flex items-center justify-between text-[9.5px] font-mono-tabular text-[var(--fm-muted)]">
                      <span>radius: 8px</span>
                      <span>contrast: 7.4:1 (AAA)</span>
                    </div>
                  </div>

                  <div className="col-span-5 space-y-1.5">
                    <div className="rounded bg-[var(--fm-soft)] p-2 border border-[var(--fm-border)] flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-[var(--fm-accent)] shrink-0" />
                      <div className="text-[10px] font-mono-tabular leading-tight">
                        <div className="text-[var(--fm-text)] font-bold">Primary-500</div>
                        <div className="text-[var(--fm-muted)]">var(--fm-accent)</div>
                      </div>
                    </div>
                    <div className="rounded bg-[var(--fm-soft)] p-2 border border-[var(--fm-border)] flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-[var(--fm-accent)] shrink-0" />
                      <div className="text-[10px] font-mono-tabular leading-tight">
                        <div className="text-[var(--fm-text)] font-bold">Primary-600</div>
                        <div className="text-[var(--fm-muted)]">var(--fm-accent)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Monitor Chin & Stand */}
              <div className="w-full h-5 bg-[var(--fm-border)] rounded-b-[10px] flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[var(--fm-muted)]" />
              </div>
              <div className="w-16 h-4 bg-[var(--fm-muted)]" />
              <div className="w-28 h-2 bg-[var(--fm-muted)] rounded-full" />
            </div>

            {/* Right 7 Cols: Editorial Copy + 3 Large Cyan Circle Icons (image_fc8278e0.png Top-3rd) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-1">
                <h3 className="text-[17px] font-extrabold text-[var(--fm-text)]">
                  멀티 디바이스 반응형 그리드 &amp; 시맨틱 토큰 자동 동기화
                </h3>
                <p className="text-[13px] text-[var(--fm-muted)] leading-relaxed">
                  Figma Variables에 정의된 컬러·타이포그래피·8px 간격 토큰이 Mobile·Tablet·Desktop 3대 해상도 브레이크포인트에 맞춰 코드 저장소(CSS/React)로 즉시 변환됩니다.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-1">
                {deviceCircles.map((dev) => {
                  const IconComp = dev.Icon;
                  const targetNode = nodes[dev.nodeIdx] || nodes[0];
                  const isSelected = selectedNodeId === targetNode.id;
                  return (
                    <button
                      key={dev.name}
                      type="button"
                      onClick={() => onSelectNode(targetNode.id)}
                      className={`p-4 rounded-[16px] border text-center flex flex-col items-center cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--fm-selected)] border-2 border-[var(--fm-accent)]'
                          : 'bg-[var(--fm-soft)] border-[var(--fm-border)] hover:border-[var(--fm-accent)]'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-full bg-[var(--fm-accent)] text-[var(--fm-on-accent)] flex items-center justify-center shadow-xs mb-2.5">
                        <IconComp className="w-7 h-7" />
                      </div>
                      <div className="text-[13px] font-extrabold text-[var(--fm-text)]">
                        {dev.name}
                      </div>
                      <div className="text-[11px] font-bold text-[var(--fm-accent)] mt-0.5">
                        {dev.spec}
                      </div>
                      <div className="text-[10.5px] font-mono-tabular text-[var(--fm-muted)] mt-1">
                        {dev.token}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: 4 Smartphone Mockups on Cyan Band (Modeled after image_fc8278e0.png Bottom-4th) */}
          <div className="rounded-[20px] border border-[var(--fm-border)] overflow-hidden bg-white shadow-2xs relative">
            {/* Bottom Cyan Background Band */}
            <div className="h-[92px] w-full bg-[var(--fm-accent)] absolute bottom-0 left-0 right-0" />

            <div className="relative z-10 px-6 pt-4 pb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13.5px] font-extrabold text-[var(--fm-text)]">
                  모바일 화면 설계 → 프로토타입 → 핸드오프 4단계 파이프라인
                </span>
                <span className="text-[11.5px] font-bold text-[var(--fm-accent)]">
                  각 스마트폰 프레임을 클릭해 세부 검수 기준 확인
                </span>
              </div>

              <div className="grid grid-cols-4 gap-5">
                {phoneScreens.map((ph, idx) => {
                  const targetNode = nodes[ph.nodeIdx] || nodes[0];
                  const isSelected = selectedNodeId === targetNode.id;
                  return (
                    <div
                      key={ph.step}
                      onClick={() => onSelectNode(targetNode.id)}
                      className="flex flex-col items-center cursor-pointer"
                    >
                      {/* Smartphone Bezel */}
                      <div
                        className={`w-full max-w-[210px] rounded-[20px] border-[4px] bg-[var(--fm-panel)] p-3 text-[var(--fm-text)] shadow-md ${
                          isSelected ? 'border-amber-300' : 'border-[var(--fm-border)]'
                        }`}
                      >
                        <div className="w-12 h-1.5 rounded-full bg-[var(--fm-soft)] mx-auto mb-2.5" />
                        <div className="rounded-[12px] bg-[var(--fm-soft)] p-3 border border-[var(--fm-border)] space-y-2">
                          <div className="flex items-center justify-between">
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-mono-tabular font-bold text-[var(--fm-on-accent)]"
                              style={{ backgroundColor: ph.accent }}
                            >
                              SCREEN {ph.step}
                            </span>
                            <span className="text-[10px] text-[var(--fm-accent)] font-mono-tabular">
                              {idx === 0 ? 'Variables' : idx === 1 ? 'AutoLayout' : idx === 2 ? '60fps' : 'CSS Ready'}
                            </span>
                          </div>
                          <div className="text-[13px] font-extrabold text-[var(--fm-text)]">
                            {ph.title}
                          </div>
                          <div className="text-[11px] text-[var(--fm-muted)]">
                            {ph.sub}
                          </div>
                          <div className="h-2 rounded-full bg-[var(--fm-soft)] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[var(--fm-accent)]"
                              style={{ width: `${75 + idx * 8}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 20. SLACK (it-slack-chatops)
  // Layout: Giant Asymmetric Overlapping Circle Hub + 4 Radiating Satellite Rings + Live Block Kit Feed
  // (Modeled on image_fc8278e0.png Top-4th "Infographic Layout" Overlapping Circles & Satellites)
  // ============================================================================
  if (template.layoutType === 'it-slack-chatops') {
    const satellites = [
      {
        id: 'sat-1',
        title: '#배포-알림 봇',
        sub: 'CI/CD 릴리즈 노트 자동 게시',
        cx: 485,
        cy: 64,
        r: 36,
        filled: false,
        nodeIdx: 0,
      },
      {
        id: 'sat-2',
        title: '#장애-워룸 P1',
        sub: '온콜 소집 · 채널 자동 생성',
        cx: 590,
        cy: 128,
        r: 38,
        filled: false,
        nodeIdx: 1,
      },
      {
        id: 'sat-3',
        title: '#결재-라우팅',
        sub: 'Block Kit 원클릭 승인/반려',
        cx: 635,
        cy: 245,
        r: 52,
        filled: true,
        nodeIdx: 2,
      },
      {
        id: 'sat-4',
        title: '#고객-VOC 분류',
        sub: '긴급 버그 트리아지 · 멘션',
        cx: 495,
        cy: 335,
        r: 38,
        filled: false,
        nodeIdx: 3,
      },
    ];

    return (
      <div className="klic-flowmotion flex-1 w-full h-full overflow-auto bg-[var(--fm-soft)] px-6 py-4 flex flex-col items-center select-none">
        <div
          className="w-full max-w-[1260px] space-y-4"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        >
          {/* Slide Header */}
          <div className="bg-white rounded-[18px] border border-[var(--fm-border)] px-6 py-3.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="text-[22px] font-black tracking-tight text-[var(--fm-accent)]">
                Infographic
              </span>
              <span className="text-[22px] font-extrabold tracking-tight text-[var(--fm-text)]">
                Overlapping Hub Layout
              </span>
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-[var(--fm-selected)] border border-[var(--fm-accent)] text-[var(--fm-accent)] text-[11.5px] font-bold">
                20 · 슬랙 ChatOps 오케스트레이션 &amp; 원클릭 전자결재 허브
              </span>
            </div>
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--fm-muted)]">
              <MessageSquare className="w-4 h-4 text-[var(--fm-accent)]" />
              <span>평균 스레드 요약 · 결재 응답: <strong className="text-[var(--fm-accent)] font-mono-tabular">0.4초 (Block Kit)</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left 7 Cols: Giant Overlapping Circle Hub & Radiating Satellites (image_fc8278e0.png Top-4th) */}
            <div className="lg:col-span-7 bg-white rounded-[20px] border border-[var(--fm-border)] p-4 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between px-2">
                <span className="text-[14px] font-extrabold text-[var(--fm-text)]">
                  ChatOps 중앙 봇 허브 &amp; 4대 채널 위성 자동화 토폴로지
                </span>
                <span className="text-[11px] font-bold text-[var(--fm-accent)]">
                  위성 노드를 클릭하여 슬랙 페이로드 확인
                </span>
              </div>

              <svg viewBox="0 0 720 400" className="w-full h-[380px] block select-none">
                {/* Radiating Connector Lines + Traveling Packets */}
                {satellites.map((sat, idx) => {
                  const t = (ambientProgress * 1.8 + idx * 0.25) % 1;
                  const px = 270 + (sat.cx - 270) * t;
                  const py = 215 + (sat.cy - 215) * t;
                  return (
                    <g key={`line-${sat.id}`}>
                      <line
                        x1="270"
                        y1="215"
                        x2={sat.cx}
                        y2={sat.cy}
                        stroke={sat.filled ? 'var(--fm-accent)' : 'var(--fm-muted)'}
                        strokeWidth={sat.filled ? '3' : '2'}
                      />
                      <circle cx={px} cy={py} r="5" fill="var(--fm-accent)" />
                    </g>
                  );
                })}

                {/* Giant Cyan Center Hub Circle */}
                <g
                  className="cursor-pointer"
                  onClick={() => onSelectNode((nodes[5] || nodes[0]).id)}
                >
                  <circle cx="270" cy="215" r="112" fill="var(--fm-accent)" />
                  {/* Gear / Bot Icon at top of Cyan Hub */}
                  <circle
                    cx="270"
                    cy="155"
                    r="22"
                    fill="var(--fm-accent)"
                    stroke="var(--fm-surface)"
                    strokeWidth="2.5"
                  />
                  <circle cx="270" cy="155" r="8" fill="var(--fm-surface)" />
                  <text
                    x="275"
                    y="206"
                    textAnchor="middle"
                    fill="var(--fm-on-accent)"
                    className="text-[17px] font-black"
                  >
                    Slack ChatOps
                  </text>
                  <text
                    x="275"
                    y="228"
                    textAnchor="middle"
                    fill="var(--fm-selected)"
                    className="text-[12.5px] font-bold"
                  >
                    웹훅 라우터 · 스레드 요약
                  </text>
                  <text
                    x="275"
                    y="248"
                    textAnchor="middle"
                    fill="var(--fm-on-accent)"
                    className="text-[11px] font-mono-tabular"
                  >
                    142 Threads/day · 99.9% SLA
                  </text>
                </g>

                {/* Overlapping Left White Circle (Puzzle Trigger Node) */}
                <g
                  className="cursor-pointer"
                  onClick={() => onSelectNode((nodes[4] || nodes[0]).id)}
                >
                  <circle
                    cx="135"
                    cy="215"
                    r="76"
                    fill="var(--fm-surface)"
                    stroke="var(--fm-accent)"
                    strokeWidth="6"
                  />
                  <text
                    x="135"
                    y="196"
                    textAnchor="middle"
                    fill="var(--fm-accent)"
                    className="text-[13px] font-black"
                  >
                    사내 이벤트 인입
                  </text>
                  <text
                    x="135"
                    y="216"
                    textAnchor="middle"
                    fill="var(--fm-text)"
                    className="text-[11.5px] font-bold"
                  >
                    Git · Jira · Datadog
                  </text>
                  <text
                    x="135"
                    y="236"
                    textAnchor="middle"
                    fill="var(--fm-muted)"
                    className="text-[10.5px] font-semibold"
                  >
                    3줄 요약 스킬 작동
                  </text>
                </g>

                {/* 4 Radiating Satellite Circles */}
                {satellites.map((sat) => {
                  const targetNode = nodes[sat.nodeIdx] || nodes[0];
                  const isSelected = selectedNodeId === targetNode.id;
                  return (
                    <g
                      key={sat.id}
                      className="cursor-pointer"
                      onClick={() => onSelectNode(targetNode.id)}
                    >
                      <circle
                        cx={sat.cx}
                        cy={sat.cy}
                        r={sat.r}
                        fill={sat.filled ? 'var(--fm-accent)' : 'var(--fm-surface)'}
                        stroke={isSelected ? 'var(--fm-text)' : 'var(--fm-accent)'}
                        strokeWidth={isSelected ? '5' : '4'}
                      />
                      <text
                        x={sat.cx}
                        y={sat.cy - 3}
                        textAnchor="middle"
                        fill={sat.filled ? 'var(--fm-surface)' : 'var(--fm-accent)'}
                        className="text-[12px] font-extrabold"
                      >
                        {sat.title}
                      </text>
                      <text
                        x={sat.cx}
                        y={sat.cy + 14}
                        textAnchor="middle"
                        fill={sat.filled ? 'var(--fm-selected)' : 'var(--fm-muted)'}
                        className="text-[9.5px] font-semibold"
                      >
                        {sat.filled ? '원클릭 승인' : '자동 라우팅'}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Right 5 Cols: Interactive Slack Block Kit & War-Room Simulator */}
            <div className="lg:col-span-5 bg-white rounded-[20px] border border-[var(--fm-border)] p-5 shadow-2xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-[var(--fm-border)]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[var(--fm-panel)] text-[var(--fm-accent)] text-[11px] font-mono-tabular font-bold">
                    #결재-라우팅
                  </span>
                  <span className="text-[14px] font-extrabold text-[var(--fm-text)]">
                    Slack Block Kit 라이브 메시지
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[var(--fm-accent)]">
                  ● Bot Active
                </span>
              </div>

              {/* Message 1: AI 3-Line Thread Summary */}
              <div className="rounded-[14px] bg-[var(--fm-soft)] border-l-4 border-[var(--fm-accent)] p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-extrabold text-[var(--fm-text)]">
                    ChatOps 요약봇 <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--fm-selected)] text-[var(--fm-accent)]">APP</span>
                  </span>
                  <span className="text-[10.5px] font-mono-tabular text-[var(--fm-muted)]">14:22 PM</span>
                </div>
                <div className="text-[12px] font-bold text-[var(--fm-accent)]">
                  [스레드 84개 댓글 3줄 핵심 요약]
                </div>
                <ul className="text-[11.5px] text-[var(--fm-text)] space-y-1">
                  <li>• <strong>결정사항:</strong> 결제 게이트웨이 타임아웃을 3초→5초로 상향</li>
                  <li>• <strong>담당/기한:</strong> 플랫폼팀 김수석 (오늘 17:00 카나리 반영)</li>
                  <li>• <strong>후속조치:</strong> 내일 오전 10시 트래픽 모니터링 리뷰</li>
                </ul>
              </div>

              {/* Message 2: Interactive Block Kit Approval Card */}
              <div className="rounded-[14px] bg-[var(--fm-soft)] border-l-4 border-[var(--fm-accent)] p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-extrabold text-[var(--fm-text)]">
                    전자결재 라우터 <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--fm-selected)] text-[var(--fm-accent)]">BLOCK KIT</span>
                  </span>
                  <span className="text-[10.5px] font-mono-tabular text-[var(--fm-accent)] font-bold">
                    {rejected?'반려 완료':activeSubTab===1?'승인 완료':'결재 대기'} #APR-209
                  </span>
                </div>
                <div className="text-[12px] font-bold text-[var(--fm-text)]">
                  [프로덕션 DB 리더 노리카 증설 승인 요청]
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-[8px] border border-[var(--fm-border)]">
                  <div><span className="text-[var(--fm-muted)]">요청자:</span> <strong>인프라팀 박책임</strong></div>
                  <div><span className="text-[var(--fm-muted)]">예상비용:</span> <strong>월 $420 추가</strong></div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {setActiveSubTab(1);setRejected(false);}}
                    className={`flex-1 py-1.5 rounded-[8px] text-[11.5px] font-extrabold cursor-pointer ${
                      activeSubTab === 1
                        ? 'bg-[var(--fm-accent)] text-[var(--fm-on-accent)]'
                        : 'bg-[var(--fm-accent)] text-[var(--fm-on-accent)] hover:bg-[var(--fm-accent)]'
                    }`}
                  >
                    {activeSubTab === 1 ? '✓ 승인 완료됨 (14:23)' : '원클릭 승인 (Approve)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {setActiveSubTab(2);setRejected(false);}}
                    className="px-3 py-1.5 rounded-[8px] text-[11.5px] font-bold bg-white border border-[var(--fm-border)] text-[var(--fm-muted)] cursor-pointer"
                  >
                    반려 / 사유입력
                  </button>
                </div>
              </div>

              {activeSubTab===2&&<form className="rounded-[12px] bg-[var(--fm-soft)] border border-[var(--fm-border)] p-3 space-y-2" onSubmit={event=>{event.preventDefault();if(rejectionReason.trim())setRejected(true);}}>
                <label className="block text-[12px] font-bold">반려 사유<textarea aria-label="반려 사유" required value={rejectionReason} onChange={event=>{setRejectionReason(event.target.value);setRejected(false);}} className="block w-full mt-2 rounded border border-[var(--fm-control-border)] bg-[var(--fm-panel)] text-[var(--fm-text)] p-2"/></label>
                <button type="submit" disabled={!rejectionReason.trim()} className="rounded px-3 py-2 bg-[var(--fm-accent)] text-[var(--fm-on-accent)] disabled:opacity-50">반려 확정</button>
                {rejected&&<p role="status" className="text-[var(--fm-accent)]">✓ 반려 완료 · {rejectionReason.trim()}</p>}
              </form>}

              {/* Message 3: War-Room Escalation Status */}
              <div className="rounded-[12px] bg-[var(--fm-panel)] text-[var(--fm-text)] p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-[var(--fm-accent)]" />
                  <div>
                    <div className="text-[12px] font-bold">#inc-2026-p1 장애 워룸 상시 대기</div>
                    <div className="text-[10.5px] text-[var(--fm-muted)]">Datadog 알람 인입 시 18초 내 온콜 소집</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[var(--fm-selected)] text-[var(--fm-accent)] text-[10.5px] font-mono-tabular font-bold">
                  정상 (0건)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 21. DEV (it-dev-cicd)
  // Layout: Large 3-Pillar Segmented Triangle + 4-Quadrant Crosshair Matrix
  // (Modeled on image_fc8278e0.png Middle-4th 3-Triangle + Bottom-2nd 4-Quadrant Crosshair)
  // ============================================================================
  if (template.layoutType === 'it-dev-cicd') {
    const quadrants = [
      {
        code: 'Q1',
        title: '배포 빈도 (Deployment Frequency)',
        metric: '일 18회 프로덕션 배포',
        desc: '트렁크 기반 소규모 PR 머지 · 자동 CI 파이프라인',
        highlight: false,
        nodeIdx: 0,
      },
      {
        code: 'Q2',
        title: '변경 리드타임 (Lead Time for Changes)',
        metric: '커밋 후 14분 내 배포',
        desc: '병렬 SAST 정적보안 스캔 + 컨테이너 레이어 캐싱',
        highlight: false,
        nodeIdx: 1,
      },
      {
        code: 'Q3',
        title: '변경 실패율 (Change Failure Rate)',
        metric: '0.4% 미만 (Elite 등급)',
        desc: 'E2E 회귀 테스트 94% 통과 게이트 필수 강제',
        highlight: false,
        nodeIdx: 2,
      },
      {
        code: 'Q4',
        title: '평균 복구 시간 (MTTR 카나리 롤백)',
        metric: '38초 내 무중단 즉시 롤백',
        desc: '5xx 에러율 1% 초과 감지 시 K8s 가중치 자동 복구',
        highlight: true,
        nodeIdx: 3,
      },
    ];

    return (
      <div className="klic-flowmotion flex-1 w-full h-full overflow-auto bg-[var(--fm-soft)] px-6 py-4 flex flex-col items-center select-none">
        <div
          className="w-full max-w-[1260px] space-y-4"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        >
          {/* Slide Header */}
          <div className="bg-white rounded-[18px] border border-[var(--fm-border)] px-6 py-3.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="text-[22px] font-black tracking-tight text-[var(--fm-accent)]">
                Infographic
              </span>
              <span className="text-[22px] font-extrabold tracking-tight text-[var(--fm-text)]">
                3-Pillar Triangle &amp; 4-Quadrant Matrix
              </span>
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-[var(--fm-selected)] border border-[var(--fm-accent)] text-[var(--fm-accent)] text-[11.5px] font-bold">
                21 · 개발 Git 코드리뷰 · CI/CD · K8s 카나리 파이프라인
              </span>
            </div>
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--fm-muted)]">
              <GitPullRequest className="w-4 h-4 text-[var(--fm-accent)]" />
              <span>DORA 엔지니어링 등급: <strong className="text-[var(--fm-accent)] font-mono-tabular">Elite (무중단 카나리)</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left 6 Cols: Large 3-Pillar Segmented Triangle + 01/02/03 Specs (image_fc8278e0.png Middle-4th) */}
            <div className="lg:col-span-6 bg-white rounded-[20px] border border-[var(--fm-border)] p-5 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="text-[15.5px] font-extrabold text-[var(--fm-text)]">
                  DevSecOps 3-Pillar 빌드 · 검증 · 카나리 삼각 편대
                </h3>
                <span className="text-[11px] font-mono-tabular font-bold text-[var(--fm-accent)]">
                  Triangle Layout
                </span>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center my-2">
                <div className="col-span-7">
                  <svg viewBox="0 0 320 265" className="w-full h-[250px] block select-none">
                    {/* Outer Subtle Triangle Guide */}
                    <polygon
                      points="160,12 24,244 296,244"
                      fill="var(--fm-soft)"
                      stroke="var(--fm-border)"
                      strokeWidth="1.5"
                      strokeDasharray="5 5"
                    />

                    {/* Top Sub-Triangle: 01 Git PR & SAST */}
                    <g
                      className="cursor-pointer"
                      onClick={() => onSelectNode((nodes[0] || nodes[0]).id)}
                    >
                      <polygon
                        points="160,18 98,124 222,124"
                        fill="var(--fm-accent)"
                      />
                      <text x="160" y="84" textAnchor="middle" fill="var(--fm-on-accent)" className="text-[13px] font-black">
                        01 · PR &amp; SAST
                      </text>
                      <text x="160" y="104" textAnchor="middle" fill="var(--fm-selected)" className="text-[10.5px] font-bold">
                        정적보안 · 코드리뷰
                      </text>
                    </g>

                    {/* Bottom-Left Sub-Triangle: 02 E2E Test */}
                    <g
                      className="cursor-pointer"
                      onClick={() => onSelectNode((nodes[2] || nodes[0]).id)}
                    >
                      <polygon
                        points="92,134 30,240 154,240"
                        fill="var(--fm-accent)"
                      />
                      <text x="92" y="200" textAnchor="middle" fill="var(--fm-on-accent)" className="text-[13px] font-black">
                        02 · E2E TEST
                      </text>
                      <text x="92" y="220" textAnchor="middle" fill="var(--fm-selected)" className="text-[10.5px] font-bold">
                        커버리지 94.2%
                      </text>
                    </g>

                    {/* Bottom-Right Sub-Triangle: 03 K8s Canary */}
                    <g
                      className="cursor-pointer"
                      onClick={() => onSelectNode((nodes[3] || nodes[0]).id)}
                    >
                      <polygon
                        points="228,134 166,240 290,240"
                        fill="var(--fm-accent)"
                      />
                      <text x="228" y="200" textAnchor="middle" fill="var(--fm-on-accent)" className="text-[13px] font-black">
                        03 · K8s CANARY
                      </text>
                      <text x="228" y="220" textAnchor="middle" fill="var(--fm-selected)" className="text-[10.5px] font-bold">
                        무중단 롤아웃
                      </text>
                    </g>

                    {/* Center Inverted White Triangle + Gear Core */}
                    <polygon
                      points="98,128 222,128 160,234"
                      fill="var(--fm-surface)"
                    />
                    <circle
                      cx="160"
                      cy="164"
                      r="26"
                      fill="var(--fm-selected)"
                      stroke="var(--fm-accent)"
                      strokeWidth="3"
                    />
                    <circle
                      cx="160"
                      cy="164"
                      r="9"
                      fill="var(--fm-accent)"
                    />
                  </svg>
                </div>

                {/* Right 5 Cols inside Left Card: 01 / 02 / 03 Numbered Callouts */}
                <div className="col-span-5 space-y-3">
                  {[
                    { num: '01', title: 'GitHub PR & SAST', desc: '시크릿 유출 차단 · N+1 쿼리 및 아키텍처 리뷰 자동화' },
                    { num: '02', title: 'E2E 통합 테스트', desc: 'Playwright 브라우저 회귀 검증 및 API 계약 테스트' },
                    { num: '03', title: 'K8s 카나리 배포', desc: '트래픽 10%→50%→100% 점진 가중치 및 자동 롤백' },
                  ].map((c, idx) => (
                    <div
                      key={c.num}
                      onClick={() => onSelectNode((nodes[idx] || nodes[0]).id)}
                      className="p-2.5 rounded-[12px] bg-[var(--fm-soft)] border border-[var(--fm-border)] hover:border-[var(--fm-accent)] cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-black font-mono-tabular text-[var(--fm-accent)]">
                          {c.num}
                        </span>
                        <span className="text-[12.5px] font-extrabold text-[var(--fm-text)]">
                          {c.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--fm-muted)] mt-1 leading-snug">
                        {c.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom K8s Canary Traffic Split Bar */}
              <div className="bg-[var(--fm-panel)] text-[var(--fm-text)] rounded-[12px] px-4 py-2.5 flex items-center justify-between text-[11.5px]">
                <span className="font-bold text-[var(--fm-accent)]">K8s Ingress 카나리 가중치:</span>
                <div className="flex items-center gap-3 font-mono-tabular">
                  <span>Stable v2.4: <strong>80%</strong></span>
                  <span className="text-[var(--fm-accent)]">Canary v2.5: <strong>20% (Error 0.00%)</strong></span>
                </div>
              </div>
            </div>

            {/* Right 6 Cols: 4-Quadrant Crosshair Matrix (image_fc8278e0.png Bottom-2nd) */}
            <div className="lg:col-span-6 bg-white rounded-[20px] border border-[var(--fm-border)] p-5 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="text-[15.5px] font-extrabold text-[var(--fm-text)]">
                  DORA 4분면 십자 매트릭스 (속도 vs 안정성 지표)
                </h3>
                <span className="text-[11px] font-mono-tabular font-bold text-[var(--fm-accent)]">
                  4-Quadrant Crosshair
                </span>
              </div>

              {/* 4-Quadrant Crosshair Container */}
              <div className="relative my-2 p-4">
                {/* Crosshair Vertical & Horizontal Axes */}
                <div className="hidden sm:block absolute left-1/2 top-1 bottom-1 w-[2px] bg-[var(--fm-muted)] -translate-x-1/2" />
                <div className="hidden sm:block absolute top-1/2 left-1 right-1 h-[2px] bg-[var(--fm-muted)] -translate-y-1/2" />

                <div className="grid grid-cols-2 gap-6 relative z-10">
                  {quadrants.map((q) => {
                    const targetNode = nodes[q.nodeIdx] || nodes[0];
                    const isSelected = selectedNodeId === targetNode.id;
                    return (
                      <button
                        key={q.code}
                        type="button"
                        onClick={() => onSelectNode(targetNode.id)}
                        className={`text-left rounded-[16px] p-4 border cursor-pointer ${
                          q.highlight || isSelected
                            ? 'bg-[var(--fm-selected)] border-[2.5px] border-[var(--fm-accent)] shadow-xs'
                            : 'bg-white border-2 border-[var(--fm-border)] hover:border-[var(--fm-accent)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-[var(--fm-accent)] text-[var(--fm-on-accent)] text-[10.5px] font-mono-tabular font-bold">
                            {q.code}
                          </span>
                          <span className="text-[10.5px] font-bold text-[var(--fm-accent)]">
                            {q.highlight ? '★ 핵심 방어선' : '자동 계측'}
                          </span>
                        </div>
                        <div className="text-[13px] font-extrabold text-[var(--fm-text)] mt-2">
                          {q.title}
                        </div>
                        <div className="text-[16px] font-black font-mono-tabular text-[var(--fm-accent)] mt-1">
                          {q.metric}
                        </div>
                        <p className="text-[11px] text-[var(--fm-muted)] mt-1 leading-snug">
                          {q.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[12px] bg-[var(--fm-soft)] border border-[var(--fm-border)] px-4 py-2.5 flex items-center justify-between text-[11.5px]">
                <span className="font-bold text-[var(--fm-text)]">
                  코드리뷰 스킬 게이트: 아키텍처 결합도 · SQL 실행계획 · OWASP Top 10 통과
                </span>
                <span className="font-mono-tabular font-bold text-[var(--fm-accent)]">
                  PASS (100%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 22. SI (it-si-integration)
  // Layout: Large 5-Tier A–E Cyan Pyramid with A–E Callout Pointers + Full-Grid Cyan/Slate Matrix Table
  // (Modeled on image_fc8278e0.png Top-1st "Chart Layout" A–E Pyramid + Bottom-3rd "Table Layout")
  // ============================================================================
  const pyramidLevels = [
    {
      tier: 'A',
      title: '감리 총괄 검수 & 본가동 전환 (Cut-Over)',
      desc: '최종 감리 지적사항 0건 확인 · 상황실 본가동 오픈',
      pts: '150,14 118,60 182,60',
      yText: 46,
      yCallout: 42,
      fill: 'var(--fm-accent)',
      textFill: 'var(--fm-accent)',
      nodeIdx: 5,
    },
    {
      tier: 'B',
      title: '통합 인수테스트 (UAT) & 성능 부하 검증',
      desc: '현업 시나리오 420건 검수 · 피크 타임 TPS 부하 통과',
      pts: '115,65 86,111 214,111 185,65',
      yText: 94,
      yCallout: 90,
      fill: 'var(--fm-accent)',
      textFill: 'var(--fm-accent)',
      nodeIdx: 4,
    },
    {
      tier: 'C',
      title: '레거시 데이터 3차 리허설 이관 & 정합성 대사',
      desc: '구형 오라클 → 차세대 DB 1,420만건 건수·금액 100% 일치',
      pts: '83,116 54,162 246,162 217,116',
      yText: 144,
      yCallout: 140,
      fill: 'var(--fm-accent)',
      textFill: 'var(--fm-text)',
      nodeIdx: 0,
    },
    {
      tier: 'D',
      title: 'SAP ERP · 대외계 전문(FEP) · 그룹웨어 연동 구현',
      desc: '회계전표 BAPI/RFC · 금융결제원 고정길이 전문 · SSO 통합',
      pts: '51,167 22,213 278,213 249,167',
      yText: 195,
      yCallout: 191,
      fill: 'var(--fm-accent)',
      textFill: 'var(--fm-surface)',
      nodeIdx: 1,
    },
    {
      tier: 'E',
      title: 'RFP 제안요청서 분석 & 요구사항 추적표 (RTM) 설계',
      desc: '기능·비기능 요구사항 312개 ID 1:1 화면·테이블 매핑',
      pts: '19,218 2,262 298,262 281,218',
      yText: 245,
      yCallout: 241,
      fill: 'var(--fm-accent)',
      textFill: 'var(--fm-surface)',
      nodeIdx: 2,
    },
  ];

  const siMatrixRows = [
    { rfpId: 'RFP-DB-001', domain: '레거시 DB 이관', target: '구형 Oracle 11g → PostgreSQL', verify: '1,420만건 전수 대사 (오차 0원)', audit: '적합 (Pass)', cyanCol: 1, nodeIdx: 0 },
    { rfpId: 'RFP-ERP-002', domain: 'SAP ERP 연동', target: 'FI 전표 · HR 인사조직 RFC', verify: '일마감 배치 & 실시간 동기화', audit: '적합 (Pass)', cyanCol: 2, nodeIdx: 1 },
    { rfpId: 'RFP-FEP-003', domain: '대외계 기관 전문', target: '금융결제원 · 국세청 API 어댑터', verify: '타임아웃 망취소(Net-Cancel) 검증', audit: '적합 (Pass)', cyanCol: 3, nodeIdx: 2 },
    { rfpId: 'RFP-GW-004', domain: '그룹웨어 · SSO', target: 'SAML 2.0 통합인증 · 전자결재', verify: '임직원 8,400명 권한 매핑 완료', audit: '적합 (Pass)', cyanCol: 1, nodeIdx: 3 },
    { rfpId: 'RFP-SEC-005', domain: '보안 · 개인정보', target: 'DB 컬럼 암호화 & 접속 감사로그', verify: 'ISMS-P 및 감리 보안성 통과', audit: '적합 (Pass)', cyanCol: 2, nodeIdx: 4 },
    { rfpId: 'RFP-UAT-006', domain: '현업 인수테스트', target: '전사 핵심 비즈니스 시나리오', verify: '420개 테스트케이스 100% 완료', audit: '최종 승인', cyanCol: 4, nodeIdx: 5 },
  ];

  return (
    <div className="klic-flowmotion flex-1 w-full h-full overflow-auto bg-[var(--fm-soft)] px-6 py-4 flex flex-col items-center select-none">
      <div
        className="w-full max-w-[1260px] space-y-4"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
        {/* Slide Header */}
        <div className="bg-white rounded-[18px] border border-[var(--fm-border)] px-6 py-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-[22px] font-black tracking-tight text-[var(--fm-accent)]">
              Chart &amp; Table
            </span>
            <span className="text-[22px] font-extrabold tracking-tight text-[var(--fm-text)]">
              SI Pyramid &amp; RTM Matrix Layout
            </span>
            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-[var(--fm-selected)] border border-[var(--fm-accent)] text-[var(--fm-accent)] text-[11.5px] font-bold">
              22 · 차세대 SI 시스템 통합 · 레거시 이관 &amp; 감리 산출물
            </span>
          </div>
          <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--fm-muted)]">
            <FileCheck2 className="w-4 h-4 text-[var(--fm-accent)]" />
            <span>데이터 이관 정합성: <strong className="text-[var(--fm-accent)] font-mono-tabular">99.99% (감리 적합 판정)</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left 6 Cols: 5-Tier A–E Cyan Pyramid + A–E Callout Pointers (image_fc8278e0.png Top-1st) */}
          <div className="lg:col-span-6 bg-white rounded-[20px] border border-[var(--fm-border)] p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--fm-border)]">
              <h3 className="text-[15.5px] font-extrabold text-[var(--fm-text)]">
                Chart Layout · 차세대 SI 구축 5단계 A–E 피라미드
              </h3>
              <span className="text-[11px] font-mono-tabular font-bold text-[var(--fm-accent)]">
                Bottom-Up V-Model
              </span>
            </div>

            <svg viewBox="0 0 600 280" className="w-full h-[290px] block select-none">
              {pyramidLevels.map((lvl) => {
                const targetNode = nodes[lvl.nodeIdx] || nodes[0];
                const isSelected = selectedNodeId === targetNode.id;
                return (
                  <g
                    key={lvl.tier}
                    className="cursor-pointer"
                    onClick={() => onSelectNode(targetNode.id)}
                  >
                    {/* Pyramid Trapezoid Tier */}
                    <polygon
                      points={lvl.pts}
                      fill={lvl.fill}
                      stroke={isSelected ? 'var(--fm-text)' : 'none'}
                      strokeWidth={isSelected ? '2.5' : '0'}
                    />
                    <text
                      x="150"
                      y={lvl.yText}
                      textAnchor="middle"
                      fill={lvl.textFill}
                      className="text-[14px] font-black"
                    >
                      {lvl.tier}
                    </text>

                    {/* Horizontal Pointer Line to Right Callout Badge */}
                    <line
                      x1="285"
                      y1={lvl.yCallout}
                      x2="332"
                      y2={lvl.yCallout}
                      stroke="var(--fm-muted)"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="348"
                      cy={lvl.yCallout}
                      r="14"
                      fill={lvl.fill}
                    />
                    <text
                      x="348"
                      y={lvl.yCallout + 4}
                      textAnchor="middle"
                      fill={lvl.textFill}
                      className="text-[11.5px] font-black"
                    >
                      {lvl.tier}
                    </text>

                    {/* Right Callout Text */}
                    <text
                      x="372"
                      y={lvl.yCallout - 3}
                      fill="var(--fm-text)"
                      className="text-[12px] font-extrabold"
                    >
                      {lvl.title}
                    </text>
                    <text
                      x="372"
                      y={lvl.yCallout + 13}
                      fill="var(--fm-muted)"
                      className="text-[10.5px] font-medium"
                    >
                      {lvl.desc}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="rounded-[12px] bg-[var(--fm-soft)] border border-[var(--fm-border)] px-4 py-2.5 flex items-center justify-between text-[11.5px]">
              <span className="font-bold text-[var(--fm-text)]">
                하단 E단계(RFP 설계)부터 상단 A단계(감리 본가동)까지 단계별 산출물 검증
              </span>
              <span className="font-bold text-[var(--fm-accent)]">5단계 완료</span>
            </div>
          </div>

          {/* Right 6 Cols: Alternating Cyan/Slate Matrix Table (image_fc8278e0.png Bottom-3rd "Table Layout") */}
          <div className="lg:col-span-6 bg-white rounded-[20px] border border-[var(--fm-border)] p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--fm-border)]">
              <h3 className="text-[15.5px] font-extrabold text-[var(--fm-text)]">
                Table Layout · RFP 요구사항 추적 &amp; 이관 대사 매트릭스
              </h3>
              <span className="text-[11px] font-mono-tabular font-bold text-[var(--fm-accent)]">
                RTM 312개 항목
              </span>
            </div>

            {/* 4-Column Alternating Cyan/Slate Block Table */}
            <div className="my-2 space-y-1.5">
              <div className="grid grid-cols-12 gap-1.5 text-center text-[11px] font-extrabold">
                <div className="col-span-3 bg-[var(--fm-panel)] text-[var(--fm-text)] py-2 rounded-[6px]">요구사항 ID</div>
                <div className="col-span-3 bg-[var(--fm-panel)] text-[var(--fm-text)] py-2 rounded-[6px]">통합·이관 영역</div>
                <div className="col-span-4 bg-[var(--fm-panel)] text-[var(--fm-text)] py-2 rounded-[6px]">인터페이스 &amp; 대사 결과</div>
                <div className="col-span-2 bg-[var(--fm-accent)] py-2 rounded-[6px]">감리 판정</div>
              </div>

              {siMatrixRows.map((r, idx) => {
                const targetNode = nodes[r.nodeIdx] || nodes[0];
                const isSelected = selectedNodeId === targetNode.id;
                return (
                  <div
                    key={r.rfpId}
                    onClick={() => onSelectNode(targetNode.id)}
                    className={`grid grid-cols-12 gap-1.5 items-center text-[11px] cursor-pointer ${
                      isSelected ? 'ring-2 ring-[var(--fm-accent)] rounded-[6px]' : ''
                    }`}
                  >
                    <div
                      className={`col-span-3 py-2.5 px-2.5 rounded-[6px] font-mono-tabular font-bold text-center ${
                        idx % 2 === 0
                          ? 'bg-[var(--fm-accent)] text-[var(--fm-on-accent)]'
                          : 'bg-[var(--fm-border)] text-[var(--fm-text)]'
                      }`}
                    >
                      {r.rfpId}
                    </div>
                    <div
                      className={`col-span-3 py-2.5 px-2.5 rounded-[6px] font-bold text-center truncate ${
                        idx % 2 === 1
                          ? 'bg-[var(--fm-accent)] text-[var(--fm-on-accent)]'
                          : 'bg-[var(--fm-soft)] text-[var(--fm-text)]'
                      }`}
                    >
                      {r.domain}
                    </div>
                    <div className="col-span-4 py-2.5 px-3 rounded-[6px] bg-[var(--fm-soft)] border border-[var(--fm-border)] text-[var(--fm-text)] font-semibold truncate">
                      {r.verify}
                    </div>
                    <div className="col-span-2 py-2.5 px-2 rounded-[6px] bg-[var(--fm-selected)] border border-[var(--fm-accent)] text-[var(--fm-accent)] font-extrabold text-center">
                      {r.audit}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-[12px] bg-[var(--fm-panel)] text-[var(--fm-text)] px-4 py-2.5 flex items-center justify-between text-[11.5px]">
              <span className="font-bold text-[var(--fm-accent)]">
                감리 총평: 레거시 DB · SAP ERP · 대외계 전문 결함 0건
              </span>
              <span className="font-mono-tabular font-bold text-[var(--fm-accent)]">
                최종 검수 승인 완료
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
