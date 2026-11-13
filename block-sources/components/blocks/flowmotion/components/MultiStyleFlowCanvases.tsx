import React from 'react';
import {
  FlowTemplate,
  FlowScenario,
  computeCubicBezierPath,
  getPointAlongCubicBezier,
} from '../utils/flowEngine';
import {
  Database,
  Zap,
  ShieldAlert,
  Cpu,
  Globe,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  Layers,
  Code2,
  GitBranch,
  Truck,
} from 'lucide-react';

interface MultiStyleCanvasProps {
  template: FlowTemplate;
  scenario: FlowScenario;
  selectedNodeId: string | null;
  ambientProgress: number; // 0..1 continuous loop
  elapsedMs: number;
  isPlaying: boolean;
  zoom: number;
  onSelectNode: (nodeId: string) => void;
}

/**
 * Animated 5-bar equalizer matching reference image 2 (`image_cd7dbfb3.png`)
 */
function StreamEqualizerBars({
  phaseOffset,
  progress,
}: {
  phaseOffset: number;
  progress: number;
}) {
  const heights = [0.45, 0.75, 0.55, 0.95, 0.85].map((base, idx) => {
    const wave = Math.sin((progress * Math.PI * 2) + phaseOffset + idx * 0.9) * 0.25;
    return Math.max(0.25, Math.min(1, base + wave));
  });

  return (
    <div className="flex items-end gap-[3px] h-[15px]" aria-hidden="true">
      {heights.map((h, i) => (
        <span
          key={i}
          style={{
            transform: `scaleY(${h.toFixed(2)})`,
            transformOrigin: '50% 100%',
          }}
          className="w-[3.5px] h-[15px] rounded-full bg-[var(--fm-accent)]"
        />
      ))}
    </div>
  );
}

/**
 * LAYOUT 02: Radial AI Stream Hub & Bezier Fan-In / Fan-Out (`image_cd7dbfb3.png`)
 */
export const RadialStreamHubCanvas: React.FC<MultiStyleCanvasProps> = ({
  template,
  scenario,
  selectedNodeId,
  ambientProgress,
  zoom,
  onSelectNode,
}) => {
  const isFdsFocused = scenario.id === 'stream-fds-alert';
  const isVipFocused = scenario.id === 'stream-vip-retention';

  // Live jittered throughput numbers
  const delta = Math.round(Math.sin(ambientProgress * Math.PI * 2) * 18);
  const pgRate = (4820 + delta).toLocaleString();
  const appRate = (12400 + delta * 3).toLocaleString();
  const cdcRate = (1940 - Math.round(delta * 0.6)).toLocaleString();

  // Left 3 stream source centers (x1 = 244, y = 84 / 274 / 464)
  const fanInSources = [
    { id: 'pg-stream', title: '글로벌 PG 승인 스트림', sub: 'kafka://pg.auth.events', rate: `${pgRate}/s`, y: 42, cy: 84, phase: 0 },
    { id: 'app-telemetry', title: '앱 행동 텔레메트리 스트림', sub: 'kafka://app.wau.telemetry', rate: `${appRate}/s`, y: 232, cy: 274, phase: 1.5 },
    { id: 'ledger-cdc', title: '원장 출금 & 약정 CDC', sub: 'cdc://treasury.ledger', rate: `${cdcRate}/s`, y: 422, cy: 464, phase: 3.1 },
  ];

  const hubLeftX = 368;
  const hubCenterY = 274;
  const hubRightX = 556;

  // Fan-out targets (x2 = 668, y = 92 / 274 / 456)
  const fanOutBranches = [
    {
      id: 'fds-freeze',
      sinkId: 'sec-warroom',
      kicker: 'FDS 긴급 차단 분기',
      pct: '0.4%',
      title: '출금 동결 & 2FA 인증 강제',
      sub: '의심 계좌 락 조치 및 서명 대기',
      badge: '위험도 ≥ 85',
      badgeX: 604,
      badgeY: 162,
      color: 'var(--fm-danger)',
      y: 36,
      cy: 92,
      sinkTitle: '보안관제 워룸 호출',
      sinkSub: 'PagerDuty · #sec-fds',
      active: !isVipFocused,
    },
    {
      id: 'vip-care',
      sinkId: 'retention-crm',
      kicker: 'VIP 케어 자동화 분기',
      pct: '1.4%',
      title: '전담 CSM 방어 플레이북 발동',
      sub: 'ARR ₩1억+ 고객 긴급 점검 배정',
      badge: 'VIP 이탈 ≥ 70%',
      badgeX: 604,
      badgeY: 250,
      color: 'var(--fm-accent)',
      y: 218,
      cy: 274,
      sinkTitle: '리텐션 CRM 동기화',
      sinkSub: 'PulseGuard · #vip-c...',
      active: !isFdsFocused,
    },
    {
      id: 'fast-commit',
      sinkId: 'snowflake-mart',
      kicker: '무검증 고속 패스트트랙',
      pct: '98.2%',
      title: '복식부기 원장 무중단 커밋',
      sub: 'SHA-256 해시 체인 즉시 기록',
      badge: '정상 < 30 (98.2%)',
      badgeX: 604,
      badgeY: 382,
      color: 'var(--fm-accent)',
      y: 400,
      cy: 456,
      sinkTitle: '스노우플레이크 마트',
      sinkSub: 'Snowflake · BI 실시간',
      active: !isFdsFocused && !isVipFocused,
    },
  ];

  return (
    <div
      data-testid="flow-canvas-radial-hub"
      style={{
        backgroundColor: 'var(--fm-soft)',
        backgroundImage:
          'linear-gradient(to right, var(--fm-border) 1px, transparent 1px), linear-gradient(to bottom, var(--fm-border) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
      className="relative flex-1 w-full h-full overflow-auto"
    >
      <div
        style={{
          width: '1130px',
          height: '560px',
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
        }}
        className="relative"
      >
        {/* SVG Bezier Fan-In and Fan-Out Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
          {/* Left Fan-In Bezier Curves */}
          {fanInSources.map((src, idx) => {
            const bez = computeCubicBezierPath(268, src.cy, hubLeftX, hubCenterY, 0.5);
            const t = (ambientProgress + idx * 0.28) % 1;
            const pt = getPointAlongCubicBezier(bez.p0, bez.p1, bez.p2, bez.p3, t);
            return (
              <g key={src.id}>
                <path
                  d={bez.d}
                  fill="none"
                  stroke="var(--fm-text)"
                  strokeWidth="2.5"
                />
                <path
                  d={bez.d}
                  fill="none"
                  stroke="var(--fm-border)"
                  strokeWidth="2.2"
                  strokeDasharray="8 10"
                  className="animate-flow-dash"
                />
                <circle cx={pt.x} cy={pt.y} r="5.5" fill="var(--fm-text)" />
              </g>
            );
          })}

          {/* Right Fan-Out Colored Bezier Curves */}
          {fanOutBranches.map((br, idx) => {
            const bez = computeCubicBezierPath(hubRightX, hubCenterY, 668, br.cy, 0.45);
            const t = (ambientProgress + idx * 0.22) % 1;
            const pt = getPointAlongCubicBezier(bez.p0, bez.p1, bez.p2, bez.p3, t);
            const sinkLineStart = 898;
            const sinkLineEnd = 944;
            const sinkDotX = sinkLineStart + ((ambientProgress * 46) % 42);

            return (
              <g key={br.id} opacity={br.active ? 1 : 0.35}>
                <path
                  d={bez.d}
                  fill="none"
                  stroke={br.color}
                  strokeWidth="2.8"
                />
                {br.active && (
                  <circle cx={pt.x} cy={pt.y} r="6" fill={br.color} />
                )}

                {/* Connector from Action Card to Sink Card */}
                <line
                  x1={sinkLineStart}
                  y1={br.cy}
                  x2={sinkLineEnd}
                  y2={br.cy}
                  stroke={br.color}
                  strokeWidth="2.4"
                />
                <circle
                  cx={br.active ? sinkDotX : (sinkLineStart + sinkLineEnd) / 2}
                  cy={br.cy}
                  r="5"
                  fill={br.color}
                />
              </g>
            );
          })}
        </svg>

        {/* Left 3 Stream Source Cards */}
        {fanInSources.map((src) => {
          const isSel = selectedNodeId === src.id;
          return (
            <div
              key={src.id}
              role="button" tabIndex={0} aria-pressed={selectedNodeId === src.id} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode(src.id); } }} onClick={() => onSelectNode(src.id)}
              style={{ left: '16px', top: `${src.y}px`, width: '244px', height: '84px' }}
              className={`absolute rounded-[14px] bg-[var(--fm-panel)] px-4 py-3.5 flex flex-col justify-between cursor-pointer z-10 ${
                isSel
                  ? 'border-[1.8px] border-[var(--fm-text)] shadow-md'
                  : 'border border-[var(--fm-border)] shadow-xs hover:border-[var(--fm-control-border)]'
              }`}
            >
              {/* Right Port Dot */}
              <span className="w-[9px] h-[9px] rounded-full bg-[var(--fm-accent)] absolute -right-[12px] top-1/2 -translate-y-1/2" />

              <div className="flex items-center justify-between gap-2">
                <span className="text-[13.5px] font-bold text-[var(--fm-text)] whitespace-nowrap">
                  {src.title}
                </span>
                <span className="text-[12px] font-mono-tabular font-semibold text-[var(--fm-accent)] shrink-0">
                  {src.rate}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11.5px] font-mono-tabular text-[var(--fm-muted)] whitespace-nowrap">
                  {src.sub}
                </span>
                <StreamEqualizerBars phaseOffset={src.phase} progress={ambientProgress} />
              </div>
            </div>
          );
        })}

        {/* Center Circular AI Scoring Hub (`AI 엔진 v4.2`) */}
        <div
          role="button" tabIndex={0} aria-pressed={selectedNodeId === 'ai-engine-core'} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode('ai-engine-core'); } }} onClick={() => onSelectNode('ai-engine-core')}
          style={{ left: '364px', top: '180px', width: '188px', height: '188px' }}
          className={`absolute rounded-full bg-[var(--fm-surface)] p-2.5 flex items-center justify-center cursor-pointer z-10 transition-transform ${
            selectedNodeId === 'ai-engine-core' ? 'scale-[1.02]' : 'hover:scale-[1.01]'
          }`}
        >
          <div className="relative w-full h-full rounded-full bg-[var(--fm-panel)] border-[2px] border-[var(--fm-text)] flex flex-col items-center justify-center text-center px-3 shadow-md">
            {/* Inner Animated SVG Gauge Ring */}
            <svg className="absolute inset-1.5 w-[calc(100%-12px)] h-[calc(100%-12px)] -rotate-90 pointer-events-none" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="var(--fm-border)"
                strokeWidth="5"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="var(--fm-accent)"
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeDasharray="340 440"
                strokeDashoffset={Math.round(Math.sin(ambientProgress * Math.PI * 2) * 28)}
              />
            </svg>

            <span className="px-2.5 py-0.5 rounded-full bg-[var(--fm-accent)] text-[var(--fm-on-accent)] text-[11px] font-mono-tabular font-semibold mb-1.5 z-10">
              AI 엔진 v4.2
            </span>
            <div className="text-[14.5px] font-bold text-[var(--fm-text)] leading-snug z-10">
              실시간 이상·이탈
              <br />
              복합 스코어링
            </div>
            <div className="text-[11.5px] font-mono-tabular font-semibold text-[var(--fm-accent)] mt-1.5 z-10">
              19.1k/s · 14ms
            </div>
          </div>
        </div>

        {/* Fan-Out Condition Pills */}
        {fanOutBranches.map((br) => (
          <div
            key={`pill-${br.id}`}
            style={{ left: `${br.badgeX}px`, top: `${br.badgeY}px` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-[var(--fm-selected)] border border-[var(--fm-selected)] text-[var(--fm-accent-hover)] text-[11.5px] font-mono-tabular font-semibold shadow-2xs z-10 whitespace-nowrap pointer-events-none"
          >
            {br.badge}
          </div>
        ))}

        {/* Middle-Right Blue-Bordered Action Cards & Far-Right Sink Cards */}
        {fanOutBranches.map((br) => {
          const isSel = selectedNodeId === br.id;
          return (
            <React.Fragment key={br.id}>
              <div
                role="button" tabIndex={0} aria-pressed={selectedNodeId === br.id} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode(br.id); } }} onClick={() => onSelectNode(br.id)}
                style={{ left: '668px', top: `${br.y}px`, width: '222px', height: '112px' }}
                className={`absolute rounded-[14px] bg-[var(--fm-panel)] px-4 py-3.5 flex flex-col justify-between cursor-pointer transition-all z-10 ${
                  isSel
                    ? 'border-[2px] border-[var(--fm-text)] ring-4 ring-[var(--fm-accent)]/10 shadow-md'
                    : 'border-[1.8px] border-[var(--fm-accent-hover)] shadow-xs hover:shadow-md'
                } ${br.active ? 'opacity-100' : 'opacity-45'}`}
              >
                <div className="flex items-center justify-between text-[11.5px] font-semibold text-[var(--fm-accent)]">
                  <span>{br.kicker}</span>
                  <span className="font-mono-tabular">{br.pct}</span>
                </div>
                <div className="text-[14px] font-bold text-[var(--fm-text)] leading-tight">
                  {br.title}
                </div>
                <div className="text-[12px] text-[var(--fm-muted)] truncate">
                  {br.sub}
                </div>
              </div>

              {/* Far-Right Sink Card */}
              <div role="button" tabIndex={0} aria-pressed={selectedNodeId === br.id} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode(br.id); } }} onClick={() => onSelectNode(br.id)}
                style={{ left: '944px', top: `${br.cy - 34}px`, width: '164px', height: '68px' }}
                className={`absolute rounded-[12px] bg-[var(--fm-panel)] border border-[var(--fm-control-border)] px-3.5 py-2.5 flex flex-col justify-center cursor-pointer transition-opacity z-10 ${
                  br.active ? 'opacity-100' : 'opacity-45'
                }`}
              >
                <div className="text-[13px] font-bold text-[var(--fm-text)] truncate">
                  {br.sinkTitle}
                </div>
                <div className="text-[11.5px] font-mono-tabular text-[var(--fm-muted)] mt-1 truncate">
                  {br.sinkSub}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

/**
 * LAYOUT 03: 4-Stage Parallel Swimlane Funnel (`swimlane-etl-funnel`)
 */
export const SwimlaneEtlCanvas: React.FC<MultiStyleCanvasProps> = ({
  template,
  scenario,
  selectedNodeId,
  ambientProgress,
  zoom,
  onSelectNode,
}) => {
  const isShard3Throttled = scenario.id === 'etl-shard3-throttle';

  const stages = [
    { num: 'STAGE 01', label: '스트림 수집 (INGEST)', x: 20, w: 236 },
    { num: 'STAGE 02', label: '정제·검증 (VALIDATE)', x: 278, w: 236 },
    { num: 'STAGE 03', label: '3-Way 병렬 워커 샤드', x: 536, w: 266 },
    { num: 'STAGE 04', label: '멀티 웨어하우스 적재', x: 824, w: 282 },
  ];

  const shardNodes = [
    { id: 'etl-shard-1', title: 'Spark 워커 Shard #01', sub: '주문·결제 팩트 집계', rate: '420k/s', load: 92, y: 74, throttled: false },
    { id: 'etl-shard-2', title: 'Spark 워커 Shard #02', sub: '퍼널 세션 스티칭', rate: '510k/s', load: 84, y: 214, throttled: false },
    { id: 'etl-shard-3', title: 'Spark 워커 Shard #03', sub: '벡터 임베딩 생성 (GPU)', rate: isShard3Throttled ? '42k/s 지연' : '180k/s', load: isShard3Throttled ? 99 : 78, y: 354, throttled: isShard3Throttled },
  ];

  return (
    <div
      data-testid="flow-canvas-swimlane-etl"
      className="relative flex-1 w-full h-full overflow-auto bg-[var(--fm-surface)]"
    >
      <div
        style={{
          width: '1130px',
          height: '560px',
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
        }}
        className="relative"
      >
        {/* 4 Vertical Swimlane Columns */}
        {stages.map((st) => (
          <div
            key={st.num}
            style={{ left: `${st.x}px`, top: '18px', width: `${st.w}px`, height: '490px' }}
            className="absolute rounded-[16px] bg-[var(--fm-panel)]/75 border border-[var(--fm-control-border)]/80 flex flex-col overflow-hidden"
          >
            <div className="px-4 py-2.5 bg-[var(--fm-accent)] text-[var(--fm-on-accent)] flex items-center justify-between">
              <span className="text-[11px] font-mono-tabular font-semibold text-[var(--fm-accent)]">
                {st.num}
              </span>
              <span className="text-[12px] font-bold tracking-tight">
                {st.label}
              </span>
            </div>
          </div>
        ))}

        {/* SVG Data Buses between Swimlanes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {/* Stage 1 -> Stage 2 */}
          <path d="M 244 260 L 290 260" stroke="var(--fm-accent)" strokeWidth="3" strokeDasharray="6 6" className="animate-flow-dash" />
          {/* Stage 2 -> 3 Parallel Shards */}
          {shardNodes.map((sh, idx) => {
            const cy = sh.y + 56;
            const bez = computeCubicBezierPath(502, 260, 548, cy, 0.5);
            const pt = getPointAlongCubicBezier(bez.p0, bez.p1, bez.p2, bez.p3, (ambientProgress + idx * 0.3) % 1);
            return (
              <g key={sh.id}>
                <path
                  d={bez.d}
                  fill="none"
                  stroke={sh.throttled ? 'var(--fm-warning)' : 'var(--fm-accent)'}
                  strokeWidth="2.5"
                />
                <circle cx={pt.x} cy={pt.y} r="5" fill={sh.throttled ? 'var(--fm-warning)' : 'var(--fm-accent)'} />
              </g>
            );
          })}
          {/* 3 Shards -> 2 Warehouse Targets */}
          {shardNodes.map((sh, idx) => {
            const cy = sh.y + 56;
            const targetY = idx < 2 ? 176 : 364;
            const bez = computeCubicBezierPath(790, cy, 838, targetY, 0.5);
            const pt = getPointAlongCubicBezier(bez.p0, bez.p1, bez.p2, bez.p3, (ambientProgress + idx * 0.25) % 1);
            return (
              <g key={`out-${sh.id}`}>
                <path
                  d={bez.d}
                  fill="none"
                  stroke={sh.throttled ? 'var(--fm-warning)' : 'var(--fm-text)'}
                  strokeWidth="2.2"
                  strokeDasharray="5 5"
                  className="animate-flow-dash"
                />
                <circle cx={pt.x} cy={pt.y} r="4.5" fill={sh.throttled ? 'var(--fm-warning)' : 'var(--fm-accent)'} />
              </g>
            );
          })}
        </svg>

        {/* Stage 1 Card: Ingest */}
        <div
          role="button" tabIndex={0} aria-pressed={selectedNodeId === 'etl-ingest'} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode('etl-ingest'); } }} onClick={() => onSelectNode('etl-ingest')}
          style={{ left: '32px', top: '176px', width: '212px', height: '168px' }}
          className={`absolute rounded-[14px] bg-[var(--fm-panel)] p-4 flex flex-col justify-between cursor-pointer z-20 transition-all ${
            selectedNodeId === 'etl-ingest'
              ? 'border-2 border-[var(--fm-text)] shadow-lg'
              : 'border border-[var(--fm-control-border)] shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-[var(--fm-accent)] text-[var(--fm-on-accent)] text-[10.5px] font-mono-tabular font-semibold">
              KINESIS STREAM
            </span>
            <span className="text-[12px] font-mono-tabular font-bold text-[var(--fm-accent)]">
              1.24 GB/s
            </span>
          </div>
          <div>
            <div className="text-[14px] font-bold text-[var(--fm-text)]">
              글로벌 클릭스트림 수집기
            </div>
            <div className="text-[12px] text-[var(--fm-muted)] mt-1">
              전 세계 24개 엣지 PoP 압축 배치
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono-tabular text-[var(--fm-muted)]">
              <span>버퍼 점유율</span>
              <span>68%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--fm-border)] overflow-hidden">
              <div
                style={{
                  transform: `scaleX(${0.68 + Math.sin(ambientProgress * Math.PI * 2) * 0.06})`,
                  transformOrigin: '0 50%',
                }}
                className="w-full h-full bg-[var(--fm-accent)] rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Stage 2 Card: Validate */}
        <div
          role="button" tabIndex={0} aria-pressed={selectedNodeId === 'etl-validate'} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode('etl-validate'); } }} onClick={() => onSelectNode('etl-validate')}
          style={{ left: '290px', top: '176px', width: '212px', height: '168px' }}
          className={`absolute rounded-[14px] bg-[var(--fm-panel)] p-4 flex flex-col justify-between cursor-pointer z-20 transition-all ${
            selectedNodeId === 'etl-validate'
              ? 'border-2 border-[var(--fm-text)] shadow-lg'
              : 'border border-[var(--fm-control-border)] shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-[var(--fm-selected)] text-[var(--fm-accent-hover)] text-[10.5px] font-mono-tabular font-semibold">
              AVRO v8 GATE
            </span>
            <span className="text-[12px] font-mono-tabular font-bold text-[var(--fm-accent)]">
              99.98% 통과
            </span>
          </div>
          <div>
            <div className="text-[14px] font-bold text-[var(--fm-text)]">
              Avro 스키마 검증 & PII 마스킹
            </div>
            <div className="text-[12px] text-[var(--fm-muted)] mt-1">
              민감정보 실시간 SHA 토큰화
            </div>
          </div>
          <div className="pt-2 border-t border-[var(--fm-surface)] flex items-center justify-between text-[11.5px] font-mono-tabular text-[var(--fm-text)]">
            <span>DLQ 격리: 14건/s</span>
            <span className="text-[var(--fm-accent)] font-semibold">✓ 무결성 정상</span>
          </div>
        </div>

        {/* Stage 3 Cards: 3 Parallel Shards */}
        {shardNodes.map((sh) => {
          const isSel = selectedNodeId === sh.id;
          return (
            <div
              key={sh.id}
              role="button" tabIndex={0} aria-pressed={selectedNodeId === sh.id} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode(sh.id); } }} onClick={() => onSelectNode(sh.id)}
              style={{ left: '548px', top: `${sh.y}px`, width: '242px', height: '116px' }}
              className={`absolute rounded-[14px] bg-[var(--fm-panel)] p-3.5 flex flex-col justify-between cursor-pointer z-20 transition-all ${
                sh.throttled
                  ? 'border-2 border-[var(--fm-warning)] bg-[var(--fm-selected)]/20'
                  : isSel
                  ? 'border-2 border-[var(--fm-text)] shadow-md'
                  : 'border border-[var(--fm-control-border)] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-[var(--fm-text)]">
                  {sh.title}
                </span>
                <span
                  className={`text-[11.5px] font-mono-tabular font-semibold ${
                    sh.throttled ? 'text-[var(--fm-warning)]' : 'text-[var(--fm-accent)]'
                  }`}
                >
                  {sh.rate}
                </span>
              </div>
              <div className="text-[11.5px] text-[var(--fm-muted)]">{sh.sub}</div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono-tabular text-[var(--fm-muted)]">
                  <span>워커 리소스 부하</span>
                  <span className={sh.throttled ? 'text-[var(--fm-warning)] font-bold' : ''}>
                    {sh.load}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[var(--fm-border)] overflow-hidden">
                  <div
                    style={{ width: `${sh.load}%` }}
                    className={`h-full rounded-full ${
                      sh.throttled ? 'bg-[var(--fm-warning)]' : 'bg-[var(--fm-accent)]'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* Stage 4 Cards: 2 Data Warehouse Sinks */}
        <div
          role="button" tabIndex={0} aria-pressed={selectedNodeId === 'etl-load-bq'} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode('etl-load-bq'); } }} onClick={() => onSelectNode('etl-load-bq')}
          style={{ left: '838px', top: '104px', width: '254px', height: '144px' }}
          className={`absolute rounded-[14px] bg-[var(--fm-panel)] p-4 flex flex-col justify-between cursor-pointer z-20 ${
            selectedNodeId === 'etl-load-bq'
              ? 'border-2 border-[var(--fm-text)] shadow-md'
              : 'border border-[var(--fm-control-border)] shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-mono-tabular font-semibold text-[var(--fm-accent)]">
            <span>WAREHOUSE SINK #01</span>
            <span>COMMIT OK</span>
          </div>
          <div>
            <div className="text-[14px] font-bold text-[var(--fm-text)]">
              BigQuery 애널리틱스 마트
            </div>
            <div className="text-[12px] text-[var(--fm-muted)] mt-1">
              컬럼나 파티션 스트리밍 인서트 (930k/s)
            </div>
          </div>
          <div className="text-[11.5px] font-mono-tabular text-[var(--fm-accent)] font-semibold">
            ● 실시간 쿼리 동기화 지연 0.8초
          </div>
        </div>

        <div
          role="button" tabIndex={0} aria-pressed={selectedNodeId === 'etl-load-redis'} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode('etl-load-redis'); } }} onClick={() => onSelectNode('etl-load-redis')}
          style={{ left: '838px', top: '292px', width: '254px', height: '144px' }}
          className={`absolute rounded-[14px] bg-[var(--fm-panel)] p-4 flex flex-col justify-between cursor-pointer z-20 ${
            selectedNodeId === 'etl-load-redis'
              ? 'border-2 border-[var(--fm-text)] shadow-md'
              : 'border border-[var(--fm-control-border)] shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-mono-tabular font-semibold text-[var(--fm-accent)]">
            <span>ONLINE FEATURE SINK #02</span>
            <span>4ms P99</span>
          </div>
          <div>
            <div className="text-[14px] font-bold text-[var(--fm-text)]">
              Vector DB & Redis 피처스토어
            </div>
            <div className="text-[12px] text-[var(--fm-muted)] mt-1">
              768차원 실시간 추천 임베딩 서빙
            </div>
          </div>
          <div className="text-[11.5px] font-mono-tabular text-[var(--fm-text)] font-semibold">
            ● 인덱스 리프레시 주기: 250ms
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * LAYOUT 04: Cyclic Multi-Agent Orbital Constellation (`cyclic-agent-ring`)
 */
export const CyclicAgentRingCanvas: React.FC<MultiStyleCanvasProps> = ({
  template,
  scenario,
  selectedNodeId,
  ambientProgress,
  zoom,
  onSelectNode,
}) => {
  const isSelfHeal = scenario.id === 'ring-self-heal';
  const centerX = 560;
  const centerY = 266;
  const orbitRadius = 210;

  const satellites = [
    { id: 'agent-planner', role: 'PLANNER', title: '01. 아키텍처 기획 에이전트', metric: '1,420 tok/s · DAG 완료', angleDeg: -90 },
    { id: 'agent-coder', role: 'SYNTHESIS', title: '02. 코드 합성 에이전트', metric: '2,890 tok/s · AST 생성', angleDeg: -18 },
    { id: 'agent-tester', role: 'SANDBOX QA', title: '03. 샌드박스 검증 에이전트', metric: isSelfHeal ? '패치 재검증 루프 가동' : '48 Cases · 100% 통과', angleDeg: 54 },
    { id: 'agent-sec', role: 'SEC AUDIT', title: '04. 보안 취약점 감사 에이전트', metric: 'SAST 무결성 검증됨', angleDeg: 126 },
    { id: 'agent-deploy', role: 'RELEASE', title: '05. 카나리 릴리즈 에이전트', metric: 'Cloud Run 무중단 배포', angleDeg: 198 },
  ].map((sat) => {
    const rad = (sat.angleDeg * Math.PI) / 180;
    return {
      ...sat,
      cx: centerX + Math.cos(rad) * orbitRadius,
      cy: centerY + Math.sin(rad) * orbitRadius,
    };
  });

  // Orbiting signal angle
  const signalAngle = ambientProgress * Math.PI * 2 - Math.PI / 2;
  const sigX = centerX + Math.cos(signalAngle) * orbitRadius;
  const sigY = centerY + Math.sin(signalAngle) * orbitRadius;

  return (
    <div
      data-testid="flow-canvas-cyclic-ring"
      style={{
        backgroundColor: 'var(--fm-surface)',
        backgroundImage: 'radial-gradient(color-mix(in srgb, var(--fm-control-border) 65%, transparent) 1.25px, transparent 1.25px)',
        backgroundSize: '24px 24px',
      }}
      className="relative flex-1 w-full h-full overflow-auto text-[var(--fm-text)]"
    >
      <div
        style={{
          width: '1130px',
          height: '560px',
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
        }}
        className="relative"
      >
        {/* SVG Orbital Tracks & Spokes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* Outer subtle radar ring */}
          <circle
            cx={centerX}
            cy={centerY}
            r={orbitRadius + 38}
            fill="none"
            stroke="var(--fm-text)"
            strokeWidth="1"
          />
          {/* Main Orbital Ring */}
          <circle
            cx={centerX}
            cy={centerY}
            r={orbitRadius}
            fill="none"
            stroke="var(--fm-accent)"
            strokeWidth="2"
            strokeDasharray="6 6"
            className="animate-flow-dash"
          />

          {/* Radial Spokes from Master Orchestrator to all 5 Satellites */}
          {satellites.map((sat, idx) => {
            const t = (ambientProgress + idx * 0.2) % 1;
            const px = centerX + (sat.cx - centerX) * t;
            const py = centerY + (sat.cy - centerY) * t;
            return (
              <g key={`spoke-${sat.id}`}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={sat.cx}
                  y2={sat.cy}
                  stroke="var(--fm-text)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <circle cx={px} cy={py} r="4" fill="var(--fm-accent)" />
              </g>
            );
          })}

          {/* Self-Healing Feedback Loop Arc between Agent 03 (Tester) and Agent 02 (Coder) */}
          {isSelfHeal && (
            <g>
              <path
                d={`M ${satellites[2].cx} ${satellites[2].cy} Q ${centerX + 310} ${centerY + 60} ${satellites[1].cx} ${satellites[1].cy}`}
                fill="none"
                stroke="var(--fm-warning)"
                strokeWidth="3"
                strokeDasharray="6 4"
                className="animate-flow-dash"
              />
            </g>
          )}

          {/* Orbiting Master Token Packet */}
          <circle cx={sigX} cy={sigY} r="9" fill="color-mix(in srgb, var(--fm-accent) 30%, transparent)" />
          <circle cx={sigX} cy={sigY} r="4.5" fill="var(--fm-accent)" />
        </svg>

        {/* Center Master Orchestrator Core */}
        <div
          role="button" tabIndex={0} aria-pressed={selectedNodeId === 'agent-core'} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode('agent-core'); } }} onClick={() => onSelectNode('agent-core')}
          style={{
            left: `${centerX - 88}px`,
            top: `${centerY - 88}px`,
            width: '176px',
            height: '176px',
          }}
          className={`absolute rounded-full bg-[var(--fm-accent)] border-2 flex flex-col items-center justify-center text-center p-4 cursor-pointer z-20 transition-all ${
            selectedNodeId === 'agent-core'
              ? 'border-[var(--fm-accent)] shadow-[0_0_30px_color-mix(in srgb, var(--fm-accent) 35%, transparent)]'
              : 'border-[var(--fm-control-border)] hover:border-[var(--fm-accent)]'
          }`}
        >
          <span className="px-2.5 py-0.5 rounded-full bg-[var(--fm-accent)]/20 border border-[var(--fm-accent)]/40 text-[var(--fm-accent)] text-[10.5px] font-mono-tabular font-semibold mb-1.5">
            ORCHESTRATOR
          </span>
          <div className="text-[14px] font-bold text-[var(--fm-on-accent)] leading-snug">
            마스터 오케스트레이터
            <br />
            태스크 라우터
          </div>
          <div className="text-[11.5px] font-mono-tabular text-[var(--fm-accent)] mt-1.5">
            5 Agents · 128k Ctx
          </div>
        </div>

        {/* 5 Satellite Agent Cards */}
        {satellites.map((sat, idx) => {
          const isSel = selectedNodeId === sat.id;
          const isHealPair = isSelfHeal && (idx === 1 || idx === 2);
          return (
            <div
              key={sat.id}
              role="button" tabIndex={0} aria-pressed={selectedNodeId === sat.id} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode(sat.id); } }} onClick={() => onSelectNode(sat.id)}
              style={{
                left: `${Math.round(sat.cx - 112)}px`,
                top: `${Math.round(sat.cy - 46)}px`,
                width: '224px',
                height: '92px',
              }}
              className={`absolute rounded-[14px] bg-[var(--fm-accent)]/95 backdrop-blur-xs px-4 py-3 flex flex-col justify-between cursor-pointer z-20 transition-all ${
                isHealPair
                  ? 'border-2 border-[var(--fm-warning)] shadow-[0_0_20px_color-mix(in srgb, var(--fm-warning) 25%, transparent)]'
                  : isSel
                  ? 'border-2 border-[var(--fm-accent)] shadow-lg'
                  : 'border border-[var(--fm-control-border)] hover:border-[var(--fm-control-border)]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                <span className={isHealPair ? 'text-[var(--fm-warning)] font-bold' : 'text-[var(--fm-accent)] font-semibold'}>
                  {sat.role}
                </span>
                <span className="text-[var(--fm-accent)]">● ONLINE</span>
              </div>
              <div className="text-[13.5px] font-bold text-[var(--fm-on-accent)] truncate">
                {sat.title}
              </div>
              <div className="text-[11.5px] font-mono-tabular text-[var(--fm-muted)] truncate">
                {sat.metric}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * LAYOUT 05: Top-Down Multi-Region Hierarchical Failover Tree (`vertical-region-tree`)
 */
export const VerticalRegionTreeCanvas: React.FC<MultiStyleCanvasProps> = ({
  template,
  scenario,
  selectedNodeId,
  ambientProgress,
  zoom,
  onSelectNode,
}) => {
  const isFailover = scenario.id === 'tree-failover-active';

  const rootCenter = { x: 560, y: 92 };
  const regions = [
    { id: 'region-seoul', title: '서울 리전 (ap-northeast-2)', share: '52%', latency: '11ms', x: 110, cx: 230, y: 184 },
    { id: 'region-tokyo', title: '도쿄 리전 (ap-northeast-1)', share: '28%', latency: '24ms', x: 440, cx: 560, y: 184 },
    { id: 'region-frankfurt', title: '프랑크푸르트 (eu-central-1)', share: '20%', latency: '38ms', x: 770, cx: 890, y: 184 },
  ];

  const pods = [
    { id: 'pod-kr-1', parentCx: 230, title: 'KR-Prod 클러스터 A', sub: '32 Pods · 정상 가동', badge: 'Healthy', x: 30, cx: 130, y: 376, failed: false },
    { id: 'pod-kr-2', parentCx: 230, title: 'KR-Prod 클러스터 B', sub: isFailover ? '커넥션 풀 포화 · 우회 중' : '28 Pods · 정상 가동', badge: isFailover ? 'Failover' : 'Healthy', x: 244, cx: 344, y: 376, failed: isFailover },
    { id: 'pod-jp-1', parentCx: 560, title: 'JP-Standby 오토스케일', sub: isFailover ? '서울 우회 트래픽 흡수 (+14 Pods)' : '20 Pods · 스탠바이 정상', badge: isFailover ? 'Absorbing' : 'Healthy', x: 458, cx: 560, y: 376, failed: false, highlight: isFailover },
    { id: 'pod-eu-1', parentCx: 890, title: 'EU-GDPR 메인 클러스터', sub: '24 Pods · 무결성 검증됨', badge: 'Healthy', x: 780, cx: 890, y: 376, failed: false },
  ];

  return (
    <div
      data-testid="flow-canvas-vertical-tree"
      className="relative flex-1 w-full h-full overflow-auto flow-dot-grid"
    >
      <div
        style={{
          width: '1130px',
          height: '560px',
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
        }}
        className="relative"
      >
        {/* Top-Down SVG Tree Connectors & Cross-Region Failover Arc */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* Tier 1 Root -> Tier 2 Regions */}
          {regions.map((reg, i) => {
            const pathD = `M ${rootCenter.x} 112 C ${rootCenter.x} 148, ${reg.cx} 148, ${reg.cx} 184`;
            const t = (ambientProgress + i * 0.25) % 1;
            const py = 112 + (184 - 112) * t;
            const px = rootCenter.x + (reg.cx - rootCenter.x) * Math.pow(t, 1.2);
            return (
              <g key={`root-${reg.id}`}>
                <path
                  d={pathD}
                  fill="none"
                  stroke="var(--fm-text)"
                  strokeWidth="2.2"
                  strokeDasharray="5 5"
                  className="animate-flow-dash"
                />
                <circle cx={px} cy={py} r="5" fill="var(--fm-accent)" />
              </g>
            );
          })}

          {/* Tier 2 Regions -> Tier 3 Pods */}
          {pods.map((pod) => {
            const pathD = `M ${pod.parentCx} 290 C ${pod.parentCx} 332, ${pod.cx} 332, ${pod.cx} 376`;
            return (
              <path
                key={`pod-edge-${pod.id}`}
                d={pathD}
                fill="none"
                stroke={pod.failed ? 'var(--fm-danger)' : 'var(--fm-muted)'}
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-flow-dash"
              />
            );
          })}

          {/* Dynamic Auto-Failover Arc from KR-Prod B to JP-Standby */}
          {isFailover && (
            <g>
              <path
                d="M 344 472 Q 452 532 560 472"
                fill="none"
                stroke="var(--fm-danger)"
                strokeWidth="2.8"
                strokeDasharray="6 4"
                className="animate-flow-dash"
              />
              <circle
                cx={344 + (560 - 344) * ambientProgress}
                cy={472 + Math.sin(ambientProgress * Math.PI) * 30}
                r="5.5"
                fill="var(--fm-danger)"
              />
            </g>
          )}
        </svg>

        {/* Failover Pill Label */}
        {isFailover && (
          <div
            style={{ left: '452px', top: '502px' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-[var(--fm-selected)] border border-[var(--fm-danger)] text-[var(--fm-danger)] text-[11.5px] font-mono-tabular font-bold shadow-xs z-20 whitespace-nowrap"
          >
            ⚡ Auto-Failover 우회 라우팅 (KR-B → JP-Standby)
          </div>
        )}

        {/* Tier 1: Top Center Root Node */}
        <div
          role="button" tabIndex={0} aria-pressed={selectedNodeId === 'tree-root'} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode('tree-root'); } }} onClick={() => onSelectNode('tree-root')}
          style={{ left: '380px', top: '20px', width: '360px', height: '92px' }}
          className={`absolute rounded-[16px] bg-[var(--fm-accent)] text-[var(--fm-on-accent)] px-5 py-3.5 flex items-center justify-between cursor-pointer z-10 shadow-md ${
            selectedNodeId === 'tree-root' ? 'ring-4 ring-[var(--fm-accent)]/30' : ''
          }`}
        >
          <div>
            <div className="text-[11px] font-mono-tabular font-semibold text-[var(--fm-accent)]">
              TIER 01 · GLOBAL ANYCAST L7 INGRESS
            </div>
            <div className="text-[15px] font-bold mt-0.5">
              글로벌 Anycast L7 엣지 라우터
            </div>
            <div className="text-[12px] text-[var(--fm-muted)] mt-0.5">
              Cloudflare Enterprise · 99.999% 가용성
            </div>
          </div>
          <div className="text-right font-mono-tabular">
            <div className="text-[16px] font-bold text-[var(--fm-accent)]">84.2k/s</div>
            <div className="text-[11px] text-[var(--fm-muted)] mt-0.5">정상 분산 중</div>
          </div>
        </div>

        {/* Tier 2: 3 Regional Load Balancers */}
        {regions.map((reg) => {
          const isSel = selectedNodeId === reg.id;
          return (
            <div
              key={reg.id}
              role="button" tabIndex={0} aria-pressed={selectedNodeId === reg.id} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode(reg.id); } }} onClick={() => onSelectNode(reg.id)}
              style={{ left: `${reg.x}px`, top: `${reg.y}px`, width: '240px', height: '106px' }}
              className={`absolute rounded-[14px] bg-[var(--fm-panel)] p-4 flex flex-col justify-between cursor-pointer z-10 transition-all ${
                isSel
                  ? 'border-2 border-[var(--fm-text)] shadow-md'
                  : 'border border-[var(--fm-control-border)] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono-tabular font-semibold text-[var(--fm-accent)]">
                <span>TIER 02 · REGION LB</span>
                <span>{reg.latency}</span>
              </div>
              <div className="text-[14px] font-bold text-[var(--fm-text)]">
                {reg.title}
              </div>
              <div className="flex items-center justify-between text-[12px] text-[var(--fm-muted)] font-mono-tabular">
                <span>트래픽 비중: {reg.share}</span>
                <span className="text-[var(--fm-accent)] font-semibold">● ACTIVE</span>
              </div>
            </div>
          );
        })}

        {/* Tier 3: 4 Bottom Kubernetes Pod Clusters */}
        {pods.map((pod) => {
          const isSel = selectedNodeId === pod.id;
          return (
            <div
              key={pod.id}
              role="button" tabIndex={0} aria-pressed={selectedNodeId === pod.id} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode(pod.id); } }} onClick={() => onSelectNode(pod.id)}
              style={{ left: `${pod.x}px`, top: `${pod.y}px`, width: '202px', height: '96px' }}
              className={`absolute rounded-[14px] bg-[var(--fm-panel)] p-3.5 flex flex-col justify-between cursor-pointer z-10 transition-all ${
                pod.failed
                  ? 'border-2 border-[var(--fm-danger)] bg-[var(--fm-selected)]/20'
                  : pod.highlight
                  ? 'border-2 border-[var(--fm-accent)] shadow-md'
                  : isSel
                  ? 'border-2 border-[var(--fm-text)] shadow-md'
                  : 'border border-[var(--fm-control-border)] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-[var(--fm-text)] truncate">
                  {pod.title}
                </span>
              </div>
              <div className="text-[11.5px] text-[var(--fm-muted)] truncate">
                {pod.sub}
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono-tabular font-semibold">
                <span>TIER 03 PODS</span>
                <span
                  className={
                    pod.failed
                      ? 'text-[var(--fm-danger)]'
                      : pod.highlight
                      ? 'text-[var(--fm-accent)]'
                      : 'text-[var(--fm-accent)]'
                  }
                >
                  ● {pod.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
