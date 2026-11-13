import React from 'react';
import { FlowTemplate, FlowScenario } from '../utils/flowEngine';

interface PptCanvasProps {
  template: FlowTemplate;
  scenario: FlowScenario;
  selectedNodeId: string | null;
  ambientProgress: number; // 0..1 continuous loop
  zoom: number;
  onSelectNode: (nodeId: string) => void;
}

/**
 * LAYOUT 06: PPT 5-Stage Chevron Process & Conversion Funnel (`ppt-chevron-funnel`)
 */
export const PptChevronFunnelCanvas: React.FC<PptCanvasProps> = ({
  scenario,
  selectedNodeId,
  ambientProgress,
  zoom,
  onSelectNode,
}) => {
  const isBaseline = scenario.id === 'chevron-legacy-baseline';

  const stages = [
    {
      id: 'chev-1',
      step: 'STAGE 01',
      title: '타겟 어카운트 발굴',
      sub: 'ABM 캠페인 리드 유입',
      count: '12,000건',
      rate: 1.0,
      baseRate: 1.0,
      leadTime: 'D+0',
      kpi: '유효 타겟 100%',
      color: 'var(--fm-text)',
    },
    {
      id: 'chev-2',
      step: 'STAGE 02',
      title: '기술 PoC 검증',
      sub: '샌드박스 실데이터 연동',
      count: isBaseline ? '3,360건' : '5,040건',
      rate: isBaseline ? 0.28 : 0.42,
      baseRate: 0.28,
      leadTime: isBaseline ? '21일 소요' : '9일 소요 (-57%)',
      kpi: isBaseline ? '전환율 28.0%' : '전환율 42.0%',
      color: 'var(--fm-accent-hover)',
    },
    {
      id: 'chev-3',
      step: 'STAGE 03',
      title: '보안·법무 심의',
      sub: 'SOC2 · 망분리 규정 통과',
      count: isBaseline ? '1,560건' : '2,880건',
      rate: isBaseline ? 0.13 : 0.24,
      baseRate: 0.13,
      leadTime: isBaseline ? '34일 소요' : '11일 소요 (-68%)',
      kpi: isBaseline ? '전환율 13.0%' : '전환율 24.0%',
      color: 'var(--fm-accent-hover)',
    },
    {
      id: 'chev-4',
      step: 'STAGE 04',
      title: 'CFO 구매 심의 승인',
      sub: 'TCO 절감 ROI 리포트 가결',
      count: isBaseline ? '840건' : '1,680건',
      rate: isBaseline ? 0.07 : 0.14,
      baseRate: 0.07,
      leadTime: isBaseline ? '18일 소요' : '7일 소요 (-61%)',
      kpi: isBaseline ? '전환율 7.0%' : '전환율 14.0%',
      color: 'var(--fm-accent)',
    },
    {
      id: 'chev-5',
      step: 'STAGE 05',
      title: '연간 구독 본계약 체결',
      sub: '엔터프라이즈 ARR 확정',
      count: isBaseline ? '576건 (₩71억)' : '1,140건 (₩142억)',
      rate: isBaseline ? 0.048 : 0.095,
      baseRate: 0.048,
      leadTime: isBaseline ? '총 82일' : '총 31일 완주',
      kpi: isBaseline ? '최종 4.8%' : '최종 9.5% (+2.0x)',
      color: 'var(--fm-accent-hover)',
    },
  ];

  const activeWaveIndex = Math.floor(ambientProgress * 5);

  return (
    <div
      data-testid="flow-canvas-ppt-chevron"
      className="relative flex-1 w-full h-full overflow-auto flow-dot-grid"
    >
      <div
        style={{
          width: '1130px',
          height: '560px',
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
        }}
        className="relative px-6 pt-5"
      >
        {/* PPT Executive Slide Header */}
        <div className="flex items-center justify-between bg-[var(--fm-panel)] border border-[var(--fm-border)] rounded-[14px] px-5 py-3 shadow-2xs">
          <div>
            <div className="text-[11px] font-mono-tabular font-bold text-[var(--fm-accent)]">
              PPT MOTION SLIDE 06 · CHEVRON PROCESS & CONVERSION FUNNEL
            </div>
            <div className="text-[16px] font-bold text-[var(--fm-text)] mt-0.5">
              엔터프라이즈 GTM 세일즈 5단계 파이프라인 및 전환율(Funnel) 인포그래픽
            </div>
          </div>
          <div className="flex items-center gap-5 font-mono-tabular">
            <div className="text-right">
              <div className="text-[11px] text-[var(--fm-muted)]">연간 누적 수주액 (ARR)</div>
              <div className="text-[16px] font-bold text-[var(--fm-text)]">
                {isBaseline ? '₩71.4억' : '₩142.0억 (+98%)'}
              </div>
            </div>
            <div className="h-8 w-[1px] bg-[var(--fm-border)]" />
            <div className="text-right">
              <div className="text-[11px] text-[var(--fm-muted)]">평균 영업 리드타임</div>
              <div className="text-[16px] font-bold text-[var(--fm-accent)]">
                {isBaseline ? '82일' : '31일 (-62% 단축)'}
              </div>
            </div>
          </div>
        </div>

        {/* 5 Interlocking SVG Chevron Process Arrows */}
        <div className="mt-4 relative">
          <svg viewBox="0 0 1082 76" className="w-full h-[76px] overflow-visible">
            {stages.map((st, i) => {
              const w = 208;
              const gap = 8;
              const x = i * (w + gap);
              const tip = 18;
              const isWave = i === activeWaveIndex;
              const points =
                i === 0
                  ? `${x},0 ${x + w - tip},0 ${x + w},38 ${x + w - tip},76 ${x},76`
                  : `${x},0 ${x + w - tip},0 ${x + w},38 ${x + w - tip},76 ${x},76 ${x + tip},38`;

              return (
                <g
                  key={st.id} role="button" tabIndex={0} aria-pressed={selectedNodeId === st.id} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode(st.id); } }} onClick={() => onSelectNode(st.id)}
                  className="cursor-pointer"
                >
                  <polygon
                    points={points}
                    fill={st.color}
                    stroke={selectedNodeId === st.id || isWave ? 'var(--fm-accent)' : 'none'}
                    strokeWidth={selectedNodeId === st.id || isWave ? '2.5' : '0'}
                  />
                  <text
                    x={x + (i === 0 ? 18 : 28)}
                    y={28}
                    fill="var(--fm-selected)"
                    fontSize="10.5"
                    fontWeight="700"
                    fontFamily="inherit"
                  >
                    {st.step} · {st.leadTime}
                  </text>
                  <text
                    x={x + (i === 0 ? 18 : 28)}
                    y={50}
                    fill="var(--fm-panel)"
                    fontSize="13.5"
                    fontWeight="700"
                  >
                    {st.title}
                  </text>
                </g>
              );
            })}

            {/* Moving Signal Pulse across Chevrons */}
            <circle
              cx={40 + ambientProgress * 1000}
              cy={38}
              r="6"
              fill="var(--fm-accent)"
            />
          </svg>
        </div>

        {/* 5 Connected Funnel Cards Below Chevrons */}
        <div className="mt-3 grid grid-cols-5 gap-2.5">
          {stages.map((st, idx) => {
            const isSel = selectedNodeId === st.id;
            const isWave = idx === activeWaveIndex;
            const barScale = Math.max(0.16, st.rate);
            return (
              <div
                key={st.id}
                role="button" tabIndex={0} aria-pressed={selectedNodeId === st.id} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode(st.id); } }} onClick={() => onSelectNode(st.id)}
                className={`rounded-[14px] bg-[var(--fm-panel)] p-4 flex flex-col justify-between h-[310px] cursor-pointer transition-shadow ${
                  isSel
                    ? 'border-2 border-[var(--fm-text)] shadow-md'
                    : isWave
                    ? 'border-[1.5px] border-[var(--fm-accent)] shadow-sm'
                    : 'border border-[var(--fm-border)] shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11.5px] font-mono-tabular font-bold text-[var(--fm-accent)]">
                    <span>{st.kpi}</span>
                    <span>#{idx + 1}</span>
                  </div>
                  <div className="text-[13.5px] font-bold text-[var(--fm-text)] mt-1">
                    {st.count}
                  </div>
                  <div className="text-[11.5px] text-[var(--fm-muted)] mt-0.5">
                    {st.sub}
                  </div>
                </div>

                {/* Visual Conversion Funnel Bar (Compositor-only scaleY) */}
                <div className="my-3 flex-1 bg-[var(--fm-soft)] rounded-[10px] border border-[var(--fm-surface)] p-3 flex items-end justify-center gap-3 relative overflow-hidden">
                  {/* Baseline bar */}
                  <div className="flex flex-col items-center h-full justify-end w-7">
                    <div
                      style={{
                        transform: `scaleY(${Math.max(0.12, st.baseRate)})`,
                        transformOrigin: '50% 100%',
                      }}
                      className="w-full h-[130px] rounded-t-[6px] bg-[var(--fm-control-border)]"
                    />
                    <span className="text-[10px] font-mono-tabular text-[var(--fm-muted)] mt-1">
                      기존
                    </span>
                  </div>

                  {/* Active Target bar */}
                  <div className="flex flex-col items-center h-full justify-end w-9">
                    <div
                      style={{
                        transform: `scaleY(${barScale})`,
                        transformOrigin: '50% 100%',
                      }}
                      className="w-full h-[130px] rounded-t-[6px] bg-[var(--fm-accent)]"
                    />
                    <span className="text-[10px] font-mono-tabular font-bold text-[var(--fm-accent)] mt-1">
                      현재
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--fm-surface)] flex items-center justify-between gap-1 text-[11px] font-mono-tabular text-[var(--fm-muted)] whitespace-nowrap">
                  <span>리드타임</span>
                  <span className="font-semibold text-[var(--fm-text)]">{st.leadTime}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * LAYOUT 07: PPT Cross-Functional Sequence Flowchart (`ppt-sequence-flowchart`)
 */
export const PptSequenceFlowchartCanvas: React.FC<PptCanvasProps> = ({
  scenario,
  selectedNodeId,
  ambientProgress,
  zoom,
  onSelectNode,
}) => {
  const isRollback = scenario.id === 'seq-rollback-path';

  const actors = [
    { id: 'actor-app', name: '고객 모바일 앱', sub: 'FIDO2 생체인증 클라이언트', cx: 140 },
    { id: 'actor-gw', name: '결제 API 게이트웨이', sub: 'Zero-Trust 토큰 라우터', cx: 410 },
    { id: 'actor-fds', name: 'FDS & 카드사 승인망', sub: '실시간 한도·이상거래 판정', cx: 680 },
    { id: 'actor-ledger', name: '복식부기 정산 원장', sub: 'Treasury 코어 데이터베이스', cx: 950 },
  ];

  const steps = [
    {
      id: 'seq-step-1',
      label: 'STEP 01 · 생체인증 결제 서명 전송 (OTT 토큰)',
      latency: '12ms',
      fromX: 140,
      toX: 410,
      y: 162,
      color: 'var(--fm-text)',
      dashed: false,
    },
    {
      id: 'seq-step-2',
      label: 'STEP 02 · 디바이스 핑거프린트 & 실시간 한도 조회',
      latency: '18ms',
      fromX: 410,
      toX: 680,
      y: 232,
      color: 'var(--fm-accent)',
      dashed: false,
    },
    {
      id: 'seq-step-3',
      label: isRollback
        ? 'STEP 03 · [거절] 한도 초과 에러 코드(DECLINED) 반환'
        : 'STEP 03 · 8자리 실시간 매입 승인번호 발급 응답',
      latency: '38ms',
      fromX: 680,
      toX: 410,
      y: 312,
      color: isRollback ? 'var(--fm-danger)' : 'var(--fm-accent-hover)',
      dashed: true,
    },
    {
      id: 'seq-step-4',
      label: isRollback
        ? 'STEP 04 · 원장 가승인 홀드 즉시 해제 (Rollback)'
        : 'STEP 04 · 가맹점 정산 예정금 & 수수료 원장 기표',
      latency: '9ms',
      fromX: 410,
      toX: 950,
      y: 382,
      color: isRollback ? 'var(--fm-warning)' : 'var(--fm-accent)',
      dashed: false,
    },
    {
      id: 'seq-step-5',
      label: isRollback
        ? 'STEP 05 · 대체 결제수단(분할결제/계좌이체) 즉시 안내'
        : 'STEP 05 · 결제 완료 전자영수증 & 인앱 푸시 도달 (총 77ms)',
      latency: '77ms 완료',
      fromX: 410,
      toX: 140,
      y: 452,
      color: isRollback ? 'var(--fm-danger)' : 'var(--fm-accent)',
      dashed: true,
    },
  ];

  const activeStepIdx = Math.floor(ambientProgress * steps.length);

  return (
    <div
      data-testid="flow-canvas-ppt-sequence"
      className="relative flex-1 w-full h-full overflow-auto bg-[var(--fm-soft)]"
    >
      <div
        style={{
          width: '1130px',
          height: '560px',
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
        }}
        className="relative px-6 pt-5"
      >
        {/* PPT Header */}
        <div className="flex items-center justify-between bg-[var(--fm-panel)] border border-[var(--fm-border)] rounded-[14px] px-5 py-3 shadow-2xs mb-4">
          <div>
            <div className="text-[11px] font-mono-tabular font-bold text-[var(--fm-accent)]">
              PPT MOTION SLIDE 07 · CROSS-FUNCTIONAL SEQUENCE FLOWCHART
            </div>
            <div className="text-[16px] font-bold text-[var(--fm-text)] mt-0.5">
              차세대 원클릭 간편결제 시스템 간 요청·응답 시퀀스 순서도 (End-to-End 77ms)
            </div>
          </div>
          <div className="px-3.5 py-1.5 rounded-[10px] bg-[var(--fm-accent)] text-[var(--fm-on-accent)] font-mono-tabular text-[12px] font-semibold">
            {isRollback ? '⚠ 한도초과 자동 롤백 모드' : '✓ SLA 100ms 이내 (현재 77ms)'}
          </div>
        </div>

        {/* 4 Actor Header Boxes */}
        {actors.map((act) => (
          <div
            key={act.id}
            style={{ left: `${act.cx - 108}px`, top: '86px', width: '216px', height: '54px' }}
            className="absolute rounded-[12px] bg-[var(--fm-accent)] text-[var(--fm-on-accent)] px-3.5 py-2 flex flex-col justify-center text-center shadow-sm z-10"
          >
            <div className="text-[13px] font-bold">{act.name}</div>
            <div className="text-[11px] text-[var(--fm-muted)] truncate">{act.sub}</div>
          </div>
        ))}

        {/* SVG Lifelines, Sequence Arrows & Decision Diamond */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* 4 Vertical Lifelines */}
          {actors.map((act) => (
            <line
              key={`life-${act.id}`}
              x1={act.cx}
              y1={140}
              x2={act.cx}
              y2={495}
              stroke="var(--fm-control-border)"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
          ))}

          {/* Diamond Decision Node on Actor 3 (FDS) */}
          <polygon
            points="680,252 742,272 680,292 618,272"
            fill={isRollback ? 'var(--fm-selected)' : 'var(--fm-selected)'}
            stroke={isRollback ? 'var(--fm-danger)' : 'var(--fm-accent)'}
            strokeWidth="2"
          />
          <text
            x="680"
            y="276"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill={isRollback ? 'var(--fm-danger)' : 'var(--fm-accent-hover)'}
          >
            {isRollback ? '한도초과 감지' : '한도·FDS 통과'}
          </text>

          {/* Horizontal Sequence Arrows & Traveling Signal Dots */}
          {steps.map((st, idx) => {
            const dir = st.toX > st.fromX ? 1 : -1;
            const endX = st.toX - dir * 8;
            const localT = (ambientProgress * steps.length) % 1;
            const isCurrent = idx === activeStepIdx;
            const dotX = st.fromX + (st.toX - st.fromX) * (isCurrent ? localT : 0.5);

            return (
              <g key={st.id}>
                <line
                  x1={st.fromX}
                  y1={st.y}
                  x2={endX}
                  y2={st.y}
                  stroke={st.color}
                  strokeWidth={isCurrent ? '3' : '2.2'}
                  strokeDasharray={st.dashed ? '6 4' : undefined}
                />
                {/* Arrowhead */}
                <polygon
                  points={`${st.toX},${st.y} ${st.toX - dir * 10},${st.y - 5} ${st.toX - dir * 10},${st.y + 5}`}
                  fill={st.color}
                />
                {/* Traveling Packet */}
                <circle
                  cx={dotX}
                  cy={st.y}
                  r={isCurrent ? '6.5' : '4'}
                  fill={st.color}
                />
              </g>
            );
          })}
        </svg>

        {/* Sequence Step Callout Pills along Arrows */}
        {steps.map((st, idx) => {
          const midX = (st.fromX + st.toX) / 2;
          const isSel = selectedNodeId === st.id;
          const isCurrent = idx === activeStepIdx;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onSelectNode(st.id)}
              style={{ left: `${midX}px`, top: `${st.y - 18}px` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-[8px] text-[12px] font-semibold bg-[var(--fm-panel)] flex items-center gap-2 cursor-pointer z-20 whitespace-nowrap transition-shadow ${
                isSel || isCurrent
                  ? 'border-2 border-[var(--fm-text)] shadow-md text-[var(--fm-text)]'
                  : 'border border-[var(--fm-control-border)] shadow-2xs text-[var(--fm-text)]'
              }`}
            >
              <span>{st.label}</span>
              <span className="px-1.5 py-0.5 rounded bg-[var(--fm-surface)] font-mono-tabular text-[11px] font-bold text-[var(--fm-accent)]">
                {st.latency}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * LAYOUT 08: PPT Flywheel & Quadrant KPI Infographic (`ppt-flywheel-infographic`)
 */
export const PptFlywheelInfographicCanvas: React.FC<PptCanvasProps> = ({
  scenario,
  selectedNodeId,
  ambientProgress,
  zoom,
  onSelectNode,
}) => {
  const isSeed = scenario.id === 'flywheel-initial';
  const cx = 565;
  const cy = 290;

  const quadrants = [
    {
      id: 'fly-q1',
      step: 'MOMENTUM 01',
      title: '엔터프라이즈 고객 유입 가속',
      metric: isSeed ? '4,200개 (+28%)' : '18,400개 (+64%)',
      sub: '산업별 템플릿 갤러리 기반 셀프서브 온보딩',
      x: 28,
      y: 96,
      bars: [0.4, 0.55, 0.72, 0.95],
      color: 'var(--fm-accent)',
    },
    {
      id: 'fly-q2',
      step: 'MOMENTUM 02',
      title: '도메인 피드백 데이터 축적',
      metric: isSeed ? '850만 건/일' : '4,200만 건/일',
      sub: '현업 워크플로우 실행·예외처리 로그 비식별 자산화',
      x: 782,
      y: 96,
      bars: [0.5, 0.68, 0.84, 1.0],
      color: 'var(--fm-accent-hover)',
    },
    {
      id: 'fly-q3',
      step: 'MOMENTUM 03',
      title: '파운데이션 모델 자동 정교화',
      metric: isSeed ? '정확도 91.2%' : '정확도 98.4% (+19%p)',
      sub: '주간 단위 강화학습 파인튜닝으로 오탐률 최소화',
      x: 782,
      y: 332,
      bars: [0.62, 0.76, 0.89, 0.98],
      color: 'var(--fm-accent-hover)',
    },
    {
      id: 'fly-q4',
      step: 'MOMENTUM 04',
      title: '고객 ROI 상승 & 바이럴 확산',
      metric: isSeed ? 'CAC 회수 6.4개월' : 'CAC 회수 3.1개월',
      sub: '순매출 유지율(NRR) 138% 및 전사 시트 확장 견인',
      x: 28,
      y: 332,
      bars: [0.48, 0.65, 0.85, 0.96],
      color: 'var(--fm-text)',
    },
  ];

  const angle = ambientProgress * 360;

  return (
    <div
      data-testid="flow-canvas-ppt-flywheel"
      className="relative flex-1 w-full h-full overflow-auto flow-dot-grid"
    >
      <div
        style={{
          width: '1130px',
          height: '560px',
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
        }}
        className="relative px-6 pt-5"
      >
        {/* PPT Slide Header */}
        <div className="flex items-center justify-between bg-[var(--fm-panel)] border border-[var(--fm-border)] rounded-[14px] px-5 py-3 shadow-2xs">
          <div>
            <div className="text-[11px] font-mono-tabular font-bold text-[var(--fm-accent)]">
              PPT MOTION SLIDE 08 · VIRTUOUS CYCLE FLYWHEEL INFOGRAPHIC
            </div>
            <div className="text-[16px] font-bold text-[var(--fm-text)] mt-0.5">
              AI 플랫폼 데이터 선순환 플라이휠(Flywheel) 및 4대 성장 지표 인포그래픽
            </div>
          </div>
          <div className="text-right font-mono-tabular">
            <span className="text-[12px] font-semibold text-[var(--fm-muted)] mr-2">순매출 유지율(NRR)</span>
            <span className="text-[16px] font-bold text-[var(--fm-accent)]">
              {isSeed ? '112%' : '138% (Top 1% SaaS)'}
            </span>
          </div>
        </div>

        {/* SVG Flywheel Ring & Leader Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* Leader lines from 4 quadrant cards to flywheel */}
          <line x1="348" y1="168" x2={cx - 110} y2={cy - 75} stroke="var(--fm-control-border)" strokeWidth="1.8" strokeDasharray="4 4" />
          <line x1="782" y1="168" x2={cx + 110} y2={cy - 75} stroke="var(--fm-control-border)" strokeWidth="1.8" strokeDasharray="4 4" />
          <line x1="782" y1="402" x2={cx + 110} y2={cy + 75} stroke="var(--fm-control-border)" strokeWidth="1.8" strokeDasharray="4 4" />
          <line x1="348" y1="402" x2={cx - 110} y2={cy + 75} stroke="var(--fm-control-border)" strokeWidth="1.8" strokeDasharray="4 4" />

          {/* Outer static halo */}
          <circle cx={cx} cy={cy} r="154" fill="none" stroke="var(--fm-border)" strokeWidth="22" />

          {/* Rotating 4-Segment Flywheel Ring */}
          <g>
            <circle
              cx={cx}
              cy={cy}
              r="154"
              fill="none"
              stroke="var(--fm-accent)"
              strokeWidth="22"
              strokeDasharray="195 47"
              strokeLinecap="round"
              className="animate-flow-dash"
            />
            <circle
              cx={cx}
              cy={cy}
              r="154"
              fill="none"
              stroke="var(--fm-text)"
              strokeWidth="22"
              strokeDasharray="60 182"
              strokeDashoffset="90"
              strokeLinecap="round"
            />
          </g>

          {/* Static Quadrant Labels on the Ring */}
          <text x={cx} y={cy - 149} textAnchor="middle" fill="var(--fm-panel)" fontSize="11" fontWeight="700">
            01. 유입 확대 ➔
          </text>
          <text x={cx + 152} y={cy + 4} textAnchor="middle" fill="var(--fm-panel)" fontSize="11" fontWeight="700">
            02. 데이터
          </text>
          <text x={cx} y={cy + 158} textAnchor="middle" fill="var(--fm-panel)" fontSize="11" fontWeight="700">
            ⬅ 03. 모델 고도화
          </text>
          <text x={cx - 152} y={cy + 4} textAnchor="middle" fill="var(--fm-panel)" fontSize="11" fontWeight="700">
            04. ROI
          </text>
        </svg>

        {/* Center Flywheel Core Hub */}
        <div
          role="button" tabIndex={0} aria-pressed={selectedNodeId === 'fly-center'} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode('fly-center'); } }} onClick={() => onSelectNode('fly-center')}
          style={{ left: `${cx - 104}px`, top: `${cy - 104}px`, width: '208px', height: '208px' }}
          className={`absolute rounded-full bg-[var(--fm-accent)] text-[var(--fm-on-accent)] p-5 flex flex-col items-center justify-center text-center cursor-pointer z-20 shadow-xl ${
            selectedNodeId === 'fly-center' ? 'ring-4 ring-[var(--fm-accent)]/40' : ''
          }`}
        >
          <span className="px-2.5 py-0.5 rounded-full bg-[var(--fm-accent)]/20 text-[var(--fm-accent)] text-[10.5px] font-mono-tabular font-semibold mb-1">
            CORE GROWTH ENGINE
          </span>
          <div className="text-[22px] font-bold font-mono-tabular tracking-tight text-[var(--fm-on-accent)]">
            {isSeed ? 'ARR ₩120억' : 'ARR ₩480억'}
          </div>
          <div className="text-[12.5px] font-semibold text-[var(--fm-accent)] mt-0.5">
            {isSeed ? 'YoY +68% 성장' : 'YoY +142% 고속 성장'}
          </div>
          <div className="text-[11px] text-[var(--fm-muted)] mt-2 leading-snug">
            데이터 축적 ➔ 모델 정교화
            <br />
            자율 가속 루프 가동 중
          </div>
        </div>

        {/* 4 Quadrant KPI Callout Cards */}
        {quadrants.map((q) => {
          const isSel = selectedNodeId === q.id;
          return (
            <div
              key={q.id}
              role="button" tabIndex={0} aria-pressed={selectedNodeId === q.id} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode(q.id); } }} onClick={() => onSelectNode(q.id)}
              style={{ left: `${q.x}px`, top: `${q.y}px`, width: '320px', height: '148px' }}
              className={`absolute rounded-[16px] bg-[var(--fm-panel)] p-4 flex flex-col justify-between cursor-pointer z-20 transition-shadow ${
                isSel
                  ? 'border-2 border-[var(--fm-text)] shadow-lg'
                  : 'border border-[var(--fm-control-border)] shadow-xs hover:border-[var(--fm-text)]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] font-mono-tabular font-bold text-[var(--fm-accent)]">
                    {q.step}
                  </div>
                  <div className="text-[14px] font-bold text-[var(--fm-text)] mt-0.5">
                    {q.title}
                  </div>
                </div>
                {/* Mini 4-Bar Infographic Chart */}
                <div className="flex items-end gap-1 h-9 px-2 py-1 rounded bg-[var(--fm-soft)] border border-[var(--fm-border)]">
                  {q.bars.map((b, bi) => (
                    <span
                      key={bi}
                      style={{
                        transform: `scaleY(${b})`,
                        transformOrigin: '50% 100%',
                      }}
                      className="w-2 h-7 rounded-t-xs bg-[var(--fm-accent)]"
                    />
                  ))}
                </div>
              </div>

              <div className="text-[18px] font-bold font-mono-tabular text-[var(--fm-text)]">
                {q.metric}
              </div>

              <div className="text-[11.5px] text-[var(--fm-muted)] truncate">
                {q.sub}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * LAYOUT 09: PPT As-Is vs To-Be Architecture Transformation Bridge (`ppt-asis-tobe-bridge`)
 */
export const PptAsIsToBeBridgeCanvas: React.FC<PptCanvasProps> = ({
  scenario,
  selectedNodeId,
  ambientProgress,
  zoom,
  onSelectNode,
}) => {
  const isHybrid = scenario.id === 'bridge-migration-live';

  const comparisons = [
    {
      label: '배포 리드타임 (Lead Time)',
      before: '14일 (수동 승인·야간 배포)',
      after: '12분 (무중단 카나리 자동화)',
      delta: '-99.4% 단축',
    },
    {
      label: '장애 복구 시간 (MTTR)',
      before: '4시간 10분 (수동 로그 분석)',
      after: '18초 (AI 이상감지 자율 롤백)',
      delta: '-99.8% 단축',
    },
    {
      label: '월간 인프라·운영 비용',
      before: '월 ₩1.80억 (유휴 서버 고정비)',
      after: '월 ₩6,400만 (오토스케일링)',
      delta: '-64.4% 절감',
    },
  ];

  return (
    <div
      data-testid="flow-canvas-ppt-bridge"
      className="relative flex-1 w-full h-full overflow-auto bg-[var(--fm-soft)]"
    >
      <div
        style={{
          width: '1130px',
          height: '560px',
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
        }}
        className="relative px-6 pt-5"
      >
        {/* PPT Slide Header */}
        <div className="flex items-center justify-between bg-[var(--fm-panel)] border border-[var(--fm-border)] rounded-[14px] px-5 py-3 shadow-2xs">
          <div>
            <div className="text-[11px] font-mono-tabular font-bold text-[var(--fm-accent)]">
              PPT MOTION SLIDE 09 · AS-IS VS TO-BE TRANSFORMATION BRIDGE
            </div>
            <div className="text-[16px] font-bold text-[var(--fm-text)] mt-0.5">
              레거시 수동 운영(AS-IS) vs AI 클라우드 네이티브(TO-BE) 전환 비교 인포그래픽
            </div>
          </div>
          <div className="px-3.5 py-1.5 rounded-[10px] bg-[var(--fm-selected)] border border-[var(--fm-border)] text-[var(--fm-accent)] font-mono-tabular text-[12px] font-bold">
            {isHybrid ? '현재 50:50 카나리 미러링 이관 중' : '연간 TCO ₩13.9억 절감 달성'}
          </div>
        </div>

        {/* SVG Animated Transformation Streams between AS-IS -> BRIDGE -> TO-BE */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {[155, 215, 275].map((y, i) => {
            const p1 = 340 + ((ambientProgress + i * 0.3) % 1) * 90;
            const p2 = 690 + ((ambientProgress + i * 0.3) % 1) * 90;
            return (
              <g key={y}>
                {/* Left Red Bottleneck Stream */}
                <line x1="340" y1={y} x2="430" y2={y} stroke="var(--fm-danger)" strokeWidth="2.5" strokeDasharray="5 5" className="animate-flow-dash" />
                <circle cx={p1} cy={y} r="5" fill="var(--fm-danger)" />
                {/* Right Blue High-Speed Stream */}
                <line x1="690" y1={y} x2="780" y2={y} stroke="var(--fm-accent)" strokeWidth="3" strokeDasharray="6 4" className="animate-flow-dash" />
                <circle cx={p2} cy={y} r="5.5" fill="var(--fm-accent)" />
              </g>
            );
          })}
        </svg>

        {/* 3 Main Columns: AS-IS (Left) / Transformation Engine (Center) / TO-BE (Right) */}
        <div className="mt-4 grid grid-cols-3 gap-12 relative z-10">
          {/* AS-IS Card */}
          <div
            role="button" tabIndex={0} aria-pressed={selectedNodeId === 'bridge-asis'} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode('bridge-asis'); } }} onClick={() => onSelectNode('bridge-asis')}
            className={`rounded-[16px] bg-[var(--fm-panel)] p-5 h-[242px] flex flex-col justify-between cursor-pointer ${
              selectedNodeId === 'bridge-asis'
                ? 'border-2 border-[var(--fm-danger)] shadow-md'
                : 'border border-red-200 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-[var(--fm-selected)] text-[var(--fm-danger)] text-[11px] font-mono-tabular font-bold">
                AS-IS · LEGACY BOTTLENECK
              </span>
              <span className="text-[12px] font-bold text-[var(--fm-danger)]">병목 발생</span>
            </div>
            <div className="text-[15px] font-bold text-[var(--fm-text)]">
              기존 모놀리식 & 수기 티켓 운영
            </div>
            <div className="space-y-2 text-[12px] text-[var(--fm-muted)]">
              <div className="p-2 rounded bg-[var(--fm-soft)] border border-[var(--fm-border)]">
                ✕ 부서 간 수기 승인 대기로 리드타임 14일 소요
              </div>
              <div className="p-2 rounded bg-[var(--fm-soft)] border border-[var(--fm-border)]">
                ✕ 단일 DB 락 경합 및 야간 수동 배치 장애 빈발
              </div>
              <div className="p-2 rounded bg-[var(--fm-soft)] border border-[var(--fm-border)]">
                ✕ 피크타임 대비 유휴 서버 상시 유지 (월 ₩1.8억)
              </div>
            </div>
          </div>

          {/* Center Transformation Bridge Card */}
          <div
            role="button" tabIndex={0} aria-pressed={selectedNodeId === 'bridge-engine'} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode('bridge-engine'); } }} onClick={() => onSelectNode('bridge-engine')}
            className={`rounded-[16px] bg-[var(--fm-accent)] text-[var(--fm-on-accent)] p-5 h-[242px] flex flex-col justify-between cursor-pointer shadow-lg ${
              selectedNodeId === 'bridge-engine' ? 'ring-4 ring-[var(--fm-accent)]/30' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-[var(--fm-accent)]/20 text-[var(--fm-accent)] text-[11px] font-mono-tabular font-bold">
                AI TRANSFORMATION BRIDGE
              </span>
              <span className="text-[12px] font-mono-tabular text-[var(--fm-accent)]">Active</span>
            </div>
            <div className="text-[15px] font-bold">
              3대 핵심 아키텍처 전환 엔진
            </div>
            <div className="space-y-2 text-[12px] text-[var(--fm-on-accent)]">
              <div className="p-2 rounded bg-[var(--fm-accent)]/90 border border-[var(--fm-control-border)] flex justify-between">
                <span>01. 이벤트 드리븐 카프카 버스</span>
                <span className="text-[var(--fm-accent)] font-mono-tabular">19k/s</span>
              </div>
              <div className="p-2 rounded bg-[var(--fm-accent)]/90 border border-[var(--fm-control-border)] flex justify-between">
                <span>02. AI 보안·코드 자동 검증 게이트</span>
                <span className="text-[var(--fm-accent)] font-mono-tabular">100%</span>
              </div>
              <div className="p-2 rounded bg-[var(--fm-accent)]/90 border border-[var(--fm-control-border)] flex justify-between">
                <span>03. 서버리스 오토스케일 & 자율복구</span>
                <span className="text-[var(--fm-accent)] font-mono-tabular">18초</span>
              </div>
            </div>
          </div>

          {/* TO-BE Card */}
          <div
            role="button" tabIndex={0} aria-pressed={selectedNodeId === 'bridge-tobe'} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode('bridge-tobe'); } }} onClick={() => onSelectNode('bridge-tobe')}
            className={`rounded-[16px] bg-[var(--fm-panel)] p-5 h-[242px] flex flex-col justify-between cursor-pointer ${
              selectedNodeId === 'bridge-tobe'
                ? 'border-2 border-[var(--fm-text)] shadow-md'
                : 'border-2 border-[var(--fm-accent)] shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-[var(--fm-selected)] text-[var(--fm-accent-hover)] text-[11px] font-mono-tabular font-bold">
                TO-BE · AI CLOUD NATIVE
              </span>
              <span className="text-[12px] font-bold text-[var(--fm-accent)]">✓ 전환 완료</span>
            </div>
            <div className="text-[15px] font-bold text-[var(--fm-text)]">
              클라우드 네이티브 자율 운영 체계
            </div>
            <div className="space-y-2 text-[12px] text-[var(--fm-text)]">
              <div className="p-2 rounded bg-[var(--fm-selected)]/60 border border-[var(--fm-border)] font-medium">
                ✓ 하루 40회 무중단 카나리 자동 배포 (12분)
              </div>
              <div className="p-2 rounded bg-[var(--fm-selected)]/60 border border-[var(--fm-border)] font-medium">
                ✓ 멀티리전 액티브-액티브 무결성 & 18초 자율 복구
              </div>
              <div className="p-2 rounded bg-[var(--fm-selected)]/60 border border-[var(--fm-border)] font-medium">
                ✓ 워크로드 비례 탄력 과금으로 운영비 64% 절감
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Quantitative Impact Strip */}
        <div className="mt-4 grid grid-cols-3 gap-4 relative z-10">
          {comparisons.map((cmp) => (
            <div
              key={cmp.label}
              className="rounded-[14px] bg-[var(--fm-panel)] border border-[var(--fm-border)] px-4 py-3 shadow-2xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[var(--fm-text)]">{cmp.label}</span>
                <span className="text-[12px] font-mono-tabular font-bold text-[var(--fm-accent)]">
                  {cmp.delta}
                </span>
              </div>
              <div className="mt-2 space-y-1 text-[11.5px] font-mono-tabular">
                <div className="flex justify-between text-[var(--fm-muted)] line-through">
                  <span>AS-IS:</span>
                  <span>{cmp.before}</span>
                </div>
                <div className="flex justify-between text-[var(--fm-text)] font-bold">
                  <span>TO-BE:</span>
                  <span className="text-[var(--fm-accent)]">{cmp.after}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * LAYOUT 10: PPT Milestone Roadmap & Governance Gate S-Curve (`ppt-milestone-roadmap`)
 */
export const PptMilestoneRoadmapCanvas: React.FC<PptCanvasProps> = ({
  scenario,
  selectedNodeId,
  ambientProgress,
  zoom,
  onSelectNode,
}) => {
  const isQ3Current = scenario.id === 'roadmap-q3-current';

  const quarters = [
    {
      id: 'rm-q1',
      q: '2026 Q1',
      title: '데이터 거버넌스 & 보안 가드레일',
      deliverable: '프라이빗 LLM 게이트웨이 · PII 마스킹',
      value: '₩18억',
      status: '완료 (100%)',
      gate: 'Gate 1 통과',
      x: 24,
    },
    {
      id: 'rm-q2',
      q: '2026 Q2',
      title: '세일즈·CS 핵심 워크플로우 파일럿',
      deliverable: '인바운드 리드 & CS 자동 분류 에이전트',
      value: '₩54억',
      status: '완료 (100%)',
      gate: 'Gate 2 통과',
      x: 298,
    },
    {
      id: 'rm-q3',
      q: '2026 Q3',
      title: '전사 12개 부서 에이전트 스튜디오 확산',
      deliverable: '재무·법무·물류 노코드 플로우 자동화',
      value: '₩118억',
      status: '진행 중 (78%)',
      gate: 'Gate 3 심의',
      x: 572,
    },
    {
      id: 'rm-q4',
      q: '2026 Q4',
      title: '자율형 멀티 에이전트 거버넌스 완성',
      deliverable: '전사 자율 운영 & 연간 ₩210억 손익 개선',
      value: '₩210억',
      status: isQ3Current ? '대기 중' : '목표 달성',
      gate: '최종 완주',
      x: 846,
    },
  ];

  // Beacon along the S-Curve (x from 80 to 1020)
  const maxT = isQ3Current ? 0.68 : 1.0;
  const t = ambientProgress * maxT;
  const beaconX = 80 + t * 940;
  // S-Curve y from 468 (bottom) up to 316 (top)
  const sRatio = 1 / (1 + Math.exp(-8 * (t - 0.52)));
  const beaconY = 468 - sRatio * 148;

  return (
    <div
      data-testid="flow-canvas-ppt-roadmap"
      className="relative flex-1 w-full h-full overflow-auto flow-dot-grid"
    >
      <div
        style={{
          width: '1130px',
          height: '560px',
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
        }}
        className="relative px-6 pt-5"
      >
        {/* PPT Slide Header */}
        <div className="flex items-center justify-between bg-[var(--fm-panel)] border border-[var(--fm-border)] rounded-[14px] px-5 py-3 shadow-2xs">
          <div>
            <div className="text-[11px] font-mono-tabular font-bold text-[var(--fm-accent)]">
              PPT MOTION SLIDE 10 · MILESTONE ROADMAP & S-CURVE VALUE REALIZATION
            </div>
            <div className="text-[16px] font-bold text-[var(--fm-text)] mt-0.5">
              전사 AX(AI 전환) 4분기 마일스톤 · 품질 게이트 순서도 및 누적 손익 S-Curve
            </div>
          </div>
          <div className="text-right font-mono-tabular">
            <span className="text-[12px] text-[var(--fm-muted)] mr-2">연간 손익 개선 목표</span>
            <span className="text-[16px] font-bold text-[var(--fm-accent)]">₩210.0억</span>
          </div>
        </div>

        {/* Top Row: 4 Quarter Milestone Cards + 3 Diamond Gates */}
        <div className="mt-4 relative h-[156px]">
          {quarters.map((qm, idx) => {
            const isSel = selectedNodeId === qm.id;
            return (
              <React.Fragment key={qm.id}>
                <div
                  role="button" tabIndex={0} aria-pressed={selectedNodeId === qm.id} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectNode(qm.id); } }} onClick={() => onSelectNode(qm.id)}
                  style={{ left: `${qm.x - 24}px`, top: '0px', width: '234px', height: '148px' }}
                  className={`absolute rounded-[14px] bg-[var(--fm-panel)] p-4 flex flex-col justify-between cursor-pointer z-10 transition-shadow ${
                    isSel
                      ? 'border-2 border-[var(--fm-text)] shadow-md'
                      : 'border border-[var(--fm-control-border)] shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-[var(--fm-accent)] text-[var(--fm-on-accent)] text-[11px] font-mono-tabular font-bold">
                      {qm.q}
                    </span>
                    <span className="text-[11.5px] font-mono-tabular font-bold text-[var(--fm-accent)]">
                      누적 {qm.value}
                    </span>
                  </div>
                  <div>
                    <div className="text-[13.5px] font-bold text-[var(--fm-text)] leading-snug">
                      {qm.title}
                    </div>
                    <div className="text-[11.5px] text-[var(--fm-muted)] mt-1 truncate">
                      {qm.deliverable}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[var(--fm-surface)] flex items-center justify-between text-[11px] font-mono-tabular">
                    <span className="text-[var(--fm-muted)]">{qm.status}</span>
                    <span className="font-bold text-[var(--fm-accent)]">✓ {qm.gate}</span>
                  </div>
                </div>

                {/* Inter-Quarter Diamond Gate */}
                {idx < 3 && (
                  <div
                    style={{ left: `${qm.x + 224}px`, top: '74px' }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rotate-45 rounded-[4px] bg-[var(--fm-accent)] border-2 border-white shadow-sm flex items-center justify-center z-20 pointer-events-none"
                  >
                    <span className="-rotate-45 text-[10px] font-mono-tabular font-bold text-[var(--fm-on-accent)]">
                      G{idx + 1}
                    </span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Bottom Row: S-Curve Cumulative Value Realization Chart */}
        <div className="mt-3 rounded-[16px] bg-[var(--fm-panel)] border border-[var(--fm-border)] p-4 h-[218px] relative overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between text-[12px] font-semibold text-[var(--fm-text)] mb-1">
            <span>분기별 누적 가치 창출 궤적 (S-Curve Value Realization)</span>
            <span className="font-mono-tabular text-[var(--fm-accent)]">
              Q1(₩18억) ➔ Q2(₩54억) ➔ Q3(₩118억) ➔ Q4(₩210억)
            </span>
          </div>

          <svg viewBox="0 0 1080 170" className="w-full h-[165px] overflow-visible">
            {/* Horizontal grid lines */}
            <line x1="40" y1="30" x2="1040" y2="30" stroke="var(--fm-surface)" strokeWidth="1" />
            <line x1="40" y1="85" x2="1040" y2="85" stroke="var(--fm-surface)" strokeWidth="1" />
            <line x1="40" y1="140" x2="1040" y2="140" stroke="var(--fm-control-border)" strokeWidth="1.5" />

            {/* Quarter Vertical Drop Lines */}
            {[120, 390, 665, 950].map((qx, i) => (
              <line
                key={qx}
                x1={qx}
                y1="20"
                x2={qx}
                y2="140"
                stroke="var(--fm-border)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            ))}

            {/* S-Curve Shaded Area */}
            <path
              d="M 80 138 C 350 136, 520 26, 1020 22 L 1020 140 L 80 140 Z"
              fill="color-mix(in srgb, var(--fm-accent) 8%, transparent)"
            />

            {/* S-Curve Stroke */}
            <path
              d="M 80 138 C 350 136, 520 26, 1020 22"
              fill="none"
              stroke="var(--fm-accent)"
              strokeWidth="3.5"
            />

            {/* Milestone Anchor Dots */}
            <circle cx="120" cy="134" r="5" fill="var(--fm-text)" />
            <text x="120" y="156" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--fm-text)">
              Q1 · ₩18억
            </text>

            <circle cx="390" cy="106" r="5" fill="var(--fm-text)" />
            <text x="390" y="156" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--fm-text)">
              Q2 · ₩54억
            </text>

            <circle cx="665" cy="54" r="6" fill="var(--fm-accent)" />
            <text x="665" y="156" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--fm-accent)">
              Q3 · ₩118억 (현재)
            </text>

            <circle cx="950" cy="24" r="6" fill="var(--fm-accent)" />
            <text x="950" y="156" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--fm-accent)">
              Q4 · ₩210억 (목표)
            </text>

            {/* Animated Traveling Value Beacon */}
            <circle cx={beaconX} cy={beaconY - 330} r="9" fill="color-mix(in srgb, var(--fm-accent) 22%, transparent)" />
            <circle cx={beaconX} cy={beaconY - 330} r="4.5" fill="var(--fm-accent)" />
          </svg>
        </div>
      </div>
    </div>
  );
};
