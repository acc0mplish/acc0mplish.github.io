import { useReducedMotion } from '../../utils/useReducedMotion';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';

export type SlopeStatus = 'critical' | 'watch' | 'healthy';
export type SlopeMode = 'current' | 'baseline';

export interface ServiceSlopeItem {
  id: string;
  name: string;
  codeName: string;
  koreanDesc: string;
  team: string;
  trafficM: number;
  trafficLabel: string;
  status: SlopeStatus;
  leftRank: number; // 0..13 (일일 트래픽 내림차순)
  rightRank: number; // 0..13 (잔여 런웨이 오름차순)
  runwayDays: number;
  runwayLabel: string;
  baselineRunwayDays: number;
  baselineRunwayLabel: string;
  burnMultiplier: string;
  strokeWidth: number;
  gaugePercent: number;
  gaugeBufferPercent: number;
}

interface ParticleBead {
  id: number;
  serviceId: string;
  progress: number;
  speed: number;
  size: number;
}

const SERVICES_DATA: ServiceSlopeItem[] = [
  {
    id: 'api-gateway',
    name: 'API 게이트웨이',
    codeName: 'api-gateway',
    koreanDesc: '전사 API 게이트웨이 라우터',
    team: '코어 플랫폼팀',
    trafficM: 412,
    trafficLabel: '412M',
    status: 'critical',
    leftRank: 0,
    rightRank: 3,
    runwayDays: 4.4,
    runwayLabel: '4.4일',
    baselineRunwayDays: 11.2,
    baselineRunwayLabel: '11.2일',
    burnMultiplier: '2.4×',
    strokeWidth: 8.5,
    gaugePercent: 15,
    gaugeBufferPercent: 28,
  },
  {
    id: 'auth',
    name: '통합 인증',
    codeName: 'auth',
    koreanDesc: '통합 인증 및 토큰 발급(SSO)',
    team: '보안 인프라팀',
    trafficM: 268,
    trafficLabel: '268M',
    status: 'healthy',
    leftRank: 1,
    rightRank: 9,
    runwayDays: 24,
    runwayLabel: '24일',
    baselineRunwayDays: 26,
    baselineRunwayLabel: '26일',
    burnMultiplier: '0.8×',
    strokeWidth: 6.5,
    gaugePercent: 76,
    gaugeBufferPercent: 84,
  },
  {
    id: 'billing-api',
    name: '결제 API',
    codeName: 'billing-api',
    koreanDesc: '정기 결제 및 청구 엔진',
    team: '결제 코어팀',
    trafficM: 154,
    trafficLabel: '154M',
    status: 'critical',
    leftRank: 2,
    rightRank: 0,
    runwayDays: 2.3,
    runwayLabel: '2.3일',
    baselineRunwayDays: 6.5,
    baselineRunwayLabel: '6.5일',
    burnMultiplier: '2.9×',
    strokeWidth: 4.8,
    gaugePercent: 8,
    gaugeBufferPercent: 18,
  },
  {
    id: 'search',
    name: '통합 검색',
    codeName: 'search',
    koreanDesc: '엘라스틱서치 통합 검색 인덱서',
    team: '데이터 검색팀',
    trafficM: 131,
    trafficLabel: '131M',
    status: 'healthy',
    leftRank: 3,
    rightRank: 8,
    runwayDays: 20,
    runwayLabel: '20일',
    baselineRunwayDays: 22,
    baselineRunwayLabel: '22일',
    burnMultiplier: '0.9×',
    strokeWidth: 4.0,
    gaugePercent: 66,
    gaugeBufferPercent: 78,
  },
  {
    id: 'webhooks',
    name: '웹훅 파이프라인',
    codeName: 'webhooks',
    koreanDesc: '외부 고객사 웹훅 발송 파이프라인',
    team: '연동 플랫폼팀',
    trafficM: 118,
    trafficLabel: '118M',
    status: 'watch',
    leftRank: 4,
    rightRank: 4,
    runwayDays: 7.9,
    runwayLabel: '7.9일',
    baselineRunwayDays: 14.0,
    baselineRunwayLabel: '14.0일',
    burnMultiplier: '1.7×',
    strokeWidth: 3.5,
    gaugePercent: 26,
    gaugeBufferPercent: 38,
  },
  {
    id: 'ingest-worker',
    name: '수집 워커',
    codeName: 'ingest-worker',
    koreanDesc: '실시간 이벤트 수집 워커',
    team: '스트림 데이터팀',
    trafficM: 96,
    trafficLabel: '96M',
    status: 'healthy',
    leftRank: 5,
    rightRank: 10,
    runwayDays: 27,
    runwayLabel: '27일',
    baselineRunwayDays: 28,
    baselineRunwayLabel: '28일',
    burnMultiplier: '0.6×',
    strokeWidth: 3.1,
    gaugePercent: 88,
    gaugeBufferPercent: 94,
  },
  {
    id: 'realtime',
    name: '실시간 브로드캐스트',
    codeName: 'realtime',
    koreanDesc: '웹소켓 실시간 브로드캐스트',
    team: '메시징 코어팀',
    trafficM: 88,
    trafficLabel: '88M',
    status: 'critical',
    leftRank: 6,
    rightRank: 2,
    runwayDays: 3.4,
    runwayLabel: '3.4일',
    baselineRunwayDays: 9.0,
    baselineRunwayLabel: '9.0일',
    burnMultiplier: '2.6×',
    strokeWidth: 3.0,
    gaugePercent: 12,
    gaugeBufferPercent: 25,
  },
  {
    id: 'notifications',
    name: '알림 발송 허브',
    codeName: 'notifications',
    koreanDesc: '푸시·이메일·알림톡 발송 허브',
    team: '메시징 코어팀',
    trafficM: 61,
    trafficLabel: '61M',
    status: 'healthy',
    leftRank: 7,
    rightRank: 11,
    runwayDays: 27,
    runwayLabel: '27일',
    baselineRunwayDays: 29,
    baselineRunwayLabel: '29일',
    burnMultiplier: '0.5×',
    strokeWidth: 2.6,
    gaugePercent: 88,
    gaugeBufferPercent: 93,
  },
  {
    id: 'file-storage',
    name: '파일 스토리지',
    codeName: 'file-storage',
    koreanDesc: '오브젝트 스토리지 및 CDN 업로드',
    team: '스토리지 인프라팀',
    trafficM: 47,
    trafficLabel: '47M',
    status: 'healthy',
    leftRank: 8,
    rightRank: 7,
    runwayDays: 20,
    runwayLabel: '20일',
    baselineRunwayDays: 23,
    baselineRunwayLabel: '23일',
    burnMultiplier: '0.9×',
    strokeWidth: 2.4,
    gaugePercent: 66,
    gaugeBufferPercent: 78,
  },
  {
    id: 'reports',
    name: '리포트 생성기',
    codeName: 'reports',
    koreanDesc: '정기 재무·분석 리포트 생성기',
    team: '비즈니스 인텔리전스팀',
    trafficM: 33,
    trafficLabel: '33M',
    status: 'healthy',
    leftRank: 9,
    rightRank: 12,
    runwayDays: 30,
    runwayLabel: '30일+',
    baselineRunwayDays: 30,
    baselineRunwayLabel: '30일+',
    burnMultiplier: '0.3×',
    strokeWidth: 2.2,
    gaugePercent: 100,
    gaugeBufferPercent: 100,
  },
  {
    id: 'exports',
    name: '배치 내보내기',
    codeName: 'exports',
    koreanDesc: '대용량 CSV·엑셀 배치 내보내기',
    team: '데이터 플랫폼팀',
    trafficM: 21,
    trafficLabel: '21M',
    status: 'critical',
    leftRank: 10,
    rightRank: 1,
    runwayDays: 3.0,
    runwayLabel: '3.0일',
    baselineRunwayDays: 8.4,
    baselineRunwayLabel: '8.4일',
    burnMultiplier: '2.7×',
    strokeWidth: 2.1,
    gaugePercent: 10,
    gaugeBufferPercent: 19,
  },
  {
    id: 'ledger-sync',
    name: '원장 정산 동기화',
    codeName: 'ledger-sync',
    koreanDesc: '복식부기 원장 정산 동기화',
    team: '재무 정산팀',
    trafficM: 14,
    trafficLabel: '14M',
    status: 'watch',
    leftRank: 11,
    rightRank: 5,
    runwayDays: 8.1,
    runwayLabel: '8.1일',
    baselineRunwayDays: 15.2,
    baselineRunwayLabel: '15.2일',
    burnMultiplier: '1.6×',
    strokeWidth: 1.9,
    gaugePercent: 27,
    gaugeBufferPercent: 54,
  },
  {
    id: 'sync-engine',
    name: 'ERP 동기화 엔진',
    codeName: 'sync-engine',
    koreanDesc: '서드파티 ERP 양방향 동기화',
    team: '연동 플랫폼팀',
    trafficM: 9,
    trafficLabel: '9M',
    status: 'watch',
    leftRank: 12,
    rightRank: 6,
    runwayDays: 9.4,
    runwayLabel: '9.4일',
    baselineRunwayDays: 16.5,
    baselineRunwayLabel: '16.5일',
    burnMultiplier: '1.4×',
    strokeWidth: 1.7,
    gaugePercent: 31,
    gaugeBufferPercent: 36,
  },
  {
    id: 'audit-log',
    name: '보안 감사 로그',
    codeName: 'audit-log',
    koreanDesc: '보안 감사 로그 불변 아카이빙',
    team: '보안 컴플라이언스팀',
    trafficM: 4,
    trafficLabel: '4M',
    status: 'healthy',
    leftRank: 13,
    rightRank: 13,
    runwayDays: 30,
    runwayLabel: '30일+',
    baselineRunwayDays: 30,
    baselineRunwayLabel: '30일+',
    burnMultiplier: '0.2×',
    strokeWidth: 1.6,
    gaugePercent: 100,
    gaugeBufferPercent: 100,
  },
];

// Geometric coordinates inside SVG viewBox="0 0 1000 560"
const X_LEFT = 195;
const X_RIGHT = 805;
const Y_START = 58;
const ROW_GAP = 36;

function getRowY(rank: number): number {
  return Y_START + rank * ROW_GAP;
}

function buildSlopeBezierPath(y0: number, y1: number): string {
  const midX = (X_LEFT + X_RIGHT) / 2;
  return `M ${X_LEFT} ${y0} C ${midX} ${y0}, ${midX} ${y1}, ${X_RIGHT} ${y1}`;
}

// Exact point along the cubic bezier curve M X_LEFT y0 C midX y0, midX y1, X_RIGHT y1
function evaluateSlopeBezier(y0: number, y1: number, t: number): { x: number; y: number } {
  const clampedT = Math.max(0, Math.min(1, t));
  const midX = (X_LEFT + X_RIGHT) / 2;
  const u = 1 - clampedT;
  const tt = clampedT * clampedT;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * clampedT;

  const x = uuu * X_LEFT + 3 * uu * clampedT * midX + 3 * u * tt * midX + ttt * X_RIGHT;
  const w0 = uuu + 3 * uu * clampedT;
  const w1 = 3 * u * tt + ttt;
  const y = w0 * y0 + w1 * y1;

  return { x, y };
}

// Builds a short cubic bezier sub-segment for the comet tail between tStart and tEnd
function buildCometTailPath(y0: number, y1: number, tHead: number, tailLength: number): string {
  const t0 = Math.max(0, tHead - tailLength);
  const t1 = Math.max(0, tHead - tailLength * 0.66);
  const t2 = Math.max(0, tHead - tailLength * 0.33);
  const p0 = evaluateSlopeBezier(y0, y1, t0);
  const p1 = evaluateSlopeBezier(y0, y1, t1);
  const p2 = evaluateSlopeBezier(y0, y1, t2);
  const p3 = evaluateSlopeBezier(y0, y1, tHead);
  return `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} L ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} L ${p3.x.toFixed(1)} ${p3.y.toFixed(1)}`;
}

function ErrorBudgetSlopeChart({ density = 'normal' }: { density?: string }) {
  const reducedMotion = useReducedMotion();
  const [mode, setMode] = useState<SlopeMode>('current');
  const [statusFilter, setStatusFilter] = useState<'all' | SlopeStatus>('all');
  // hoveredServiceId controls which single line actively flows with particles on hover
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null);
  const [pinnedServiceId, setPinnedServiceId] = useState<string | null>(null);

  // Refs for direct 60FPS SVG manipulation of multi-layered particle beads
  const beadGroupRefs = useRef<Record<string, (SVGGElement | null)[]>>({});
  const activeServiceId = hoveredServiceId || pinnedServiceId;

  // Initialize 6 evenly spaced particles per service line for rich, unmistakable flow on hover
  const particlesByService = useMemo(() => {
    const map: Record<string, ParticleBead[]> = {};
    const count = 6;
    SERVICES_DATA.forEach((svc) => {
      const speedBase =
        svc.status === 'critical' ? 0.0048 : svc.status === 'watch' ? 0.0036 : 0.0028;
      const beadRadius = Math.max(4.2, Math.min(6.2, svc.strokeWidth * 0.72));
      map[svc.id] = Array.from({ length: count }, (_, idx) => ({
        id: idx,
        serviceId: svc.id,
        progress: (idx / count) + 0.04,
        speed: speedBase,
        size: beadRadius,
      }));
    });
    return map;
  }, []);

  // 60FPS Animation Loop: ONLY advances and renders particles for the currently hovered (or pinned) line!
  useEffect(() => {
    if (reducedMotion) return;
    let frameId: number;

    const progressMap: Record<string, number[]> = {};
    SERVICES_DATA.forEach((svc) => {
      progressMap[svc.id] = particlesByService[svc.id].map((b) => b.progress);
    });

    const animate = () => {
      SERVICES_DATA.forEach((svc) => {
        const isFlowing = activeServiceId === svc.id;
        const groups = beadGroupRefs.current[svc.id] || [];
        const y0 = getRowY(svc.leftRank);
        const y1 = getRowY(svc.rightRank);

        groups.forEach((gEl, idx) => {
          if (!gEl) return;

          if (!isFlowing) {
            gEl.setAttribute('opacity', '0');
            return;
          }

          const bead = particlesByService[svc.id][idx];
          let t = progressMap[svc.id][idx] + bead.speed;
          if (t >= 1) t -= 1;
          progressMap[svc.id][idx] = t;

          const pt = evaluateSlopeBezier(y0, y1, t);
          const ptTrail1 = evaluateSlopeBezier(y0, y1, Math.max(0, t - 0.022));
          const ptTrail2 = evaluateSlopeBezier(y0, y1, Math.max(0, t - 0.044));
          const tailPathD = buildCometTailPath(y0, y1, t, 0.065);

          // Smooth fade in/out at line endpoints
          const edgeAlpha =
            t < 0.05 ? t / 0.05 : t > 0.95 ? (1 - t) / 0.05 : 1;

          gEl.setAttribute('opacity', edgeAlpha.toFixed(2));

          // Children inside <g>:
          // [0] = comet tail path
          // [1] = wake dot 2
          // [2] = wake dot 1
          // [3] = outer glow halo
          // [4] = main white-ringed jewel bead
          // [5] = bright inner specular core
          const children = gEl.children;
          if (children.length >= 6) {
            children[0].setAttribute('d', tailPathD);

            children[1].setAttribute('cx', ptTrail2.x.toFixed(1));
            children[1].setAttribute('cy', ptTrail2.y.toFixed(1));

            children[2].setAttribute('cx', ptTrail1.x.toFixed(1));
            children[2].setAttribute('cy', ptTrail1.y.toFixed(1));

            children[3].setAttribute('cx', pt.x.toFixed(1));
            children[3].setAttribute('cy', pt.y.toFixed(1));

            children[4].setAttribute('cx', pt.x.toFixed(1));
            children[4].setAttribute('cy', pt.y.toFixed(1));

            children[5].setAttribute('cx', pt.x.toFixed(1));
            children[5].setAttribute('cy', pt.y.toFixed(1));
          }
        });
      });

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [activeServiceId, particlesByService, reducedMotion]);

  // Currently inspected service for the bottom bar (defaults to billing-api when none hovered)
  const inspectedService = useMemo(() => {
    return (
      SERVICES_DATA.find((s) => s.id === activeServiceId) ||
      SERVICES_DATA.find((s) => s.id === 'billing-api')!
    );
  }, [activeServiceId]);

  // Right-side sorted list (by rightRank 0..13)
  const rightSortedServices = useMemo(() => {
    return [...SERVICES_DATA].sort((a, b) => a.rightRank - b.rightRank);
  }, []);

  const getStatusColor = (status: SlopeStatus) => {
    if (status === 'critical') return 'var(--klic-component-block-color-danger)';
    if (status === 'watch') return 'var(--klic-component-block-color-warning)';
    return 'var(--klic-component-block-color-accent)';
  };

  const getStatusBufferColor = (status: SlopeStatus) => {
    if (status === 'critical') return 'var(--klic-component-block-color-border)';
    if (status === 'watch') return 'var(--klic-component-block-color-warning)';
    return 'var(--klic-component-block-color-selected)';
  };

  const getStatusBadge = (status: SlopeStatus) => {
    if (status === 'critical') {
      return {
        label: '위험',
        dot: 'bg-red-500',
        bg: 'bg-red-50  text-red-700  border-red-200 ',
      };
    }
    if (status === 'watch') {
      return {
        label: '주의',
        dot: 'bg-amber-500',
        bg: 'bg-amber-50  text-amber-700  border-amber-200 ',
      };
    }
    return {
      label: '정상',
      dot: 'bg-blue-500',
      bg: 'bg-blue-50  text-blue-700  border-blue-200 ',
    };
  };

  return (
    <div className="w-full space-y-6">
      {/* 메인 슬로프 차트 카드 (100% 한글 + 호버 단일 라인 입자 스트림) */}
      <div className="rounded-2xl border border-zinc-200  bg-white  shadow-xs overflow-hidden">
        {/* 상단 헤더 */}
        <div className="px-6 py-5 border-b border-zinc-100  flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-[18px] font-bold text-zinc-900  tracking-tight">
                에러 버짓 런웨이
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-md bg-blue-50  text-blue-700  border border-blue-200/70  whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                샘플 데이터
              </span>
            </div>
            <p className="mt-1 text-[13px] text-klic-muted ">
              각 마이크로서비스가 30일 롤링 SLO 허용 한도를 모두 소진하기까지 남은 일수 ·{' '}
              <span className="text-zinc-800  font-semibold">
                서비스나 라인에 마우스를 올리면 해당 라인만 입자가 흐릅니다
              </span>
            </p>
          </div>

          {/* 우측 컨트롤: 현재 속도 | 기준선 비교 */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex items-center rounded-lg border border-zinc-200  bg-zinc-50  p-0.5 text-xs">
              <button
                onClick={() => setMode('current')}
                className={`px-3 py-1.5 rounded-md transition font-medium whitespace-nowrap ${
                  mode === 'current'
                    ? 'bg-white  text-zinc-900  shadow-2xs font-semibold border border-zinc-200/60 '
                    : 'text-klic-muted hover:text-zinc-800 '
                }`}
              >
                현재 속도
              </button>
              <button
                onClick={() => setMode('baseline')}
                className={`px-3 py-1.5 rounded-md transition font-medium whitespace-nowrap ${
                  mode === 'baseline'
                    ? 'bg-white  text-zinc-900  shadow-2xs font-semibold border border-zinc-200/60 '
                    : 'text-klic-muted hover:text-zinc-800 '
                }`}
              >
                기준선 비교
              </button>
            </div>

            <button
              onClick={() => {
                setHoveredServiceId(null);
                setPinnedServiceId(null);
                setStatusFilter('all');
              }}
              title="필터 및 선택 초기화"
              className="p-2 rounded-lg border border-zinc-200  text-klic-muted hover:text-zinc-800  hover:bg-zinc-50  transition shrink-0"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* 상단 4대 핵심 요약 지표 (4 KPI Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-100  border-b border-zinc-100 ">
          {/* KPI 1: 위험 서비스 */}
          <div className="p-5">
            <div className="flex items-center justify-between gap-2 text-xs text-klic-muted">
              <span className="font-medium">위험 서비스</span>
              <span className="px-2 py-0.5 rounded-md border border-zinc-200  text-zinc-700  font-semibold text-[11px] whitespace-nowrap shrink-0">
                안정 유지
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1 font-mono">
              <span className="text-3xl font-bold text-zinc-900 ">4</span>
              <span className="text-lg text-klic-muted font-medium">/ 14</span>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-klic-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />3 주의
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />7 정상
              </span>
            </div>
          </div>

          {/* KPI 2: 최우선 고갈 예상 */}
          <div className="p-5">
            <div className="flex items-center justify-between gap-2 text-xs text-klic-muted">
              <span className="font-medium">최우선 고갈 예상</span>
              <span className="px-2 py-0.5 rounded-md border border-zinc-200  text-zinc-700  font-semibold text-[11px] font-mono whitespace-nowrap shrink-0">
                +0.2일
              </span>
            </div>
            <div className="mt-2 text-3xl font-bold text-zinc-900  font-mono">
              2.3일
            </div>
            <div className="mt-3 text-xs text-klic-muted">
              <span className="font-semibold text-zinc-800 ">
                결제 API
              </span>{' '}
              <span>소진 속도 2.9×</span>
            </div>
          </div>

          {/* KPI 3: 위험 노출 트래픽 */}
          <div className="p-5">
            <div className="flex items-center justify-between gap-2 text-xs text-klic-muted">
              <span className="font-medium">위험 노출 트래픽</span>
              <span className="px-2 py-0.5 rounded-md border border-zinc-200  text-zinc-700  font-semibold text-[11px] whitespace-nowrap shrink-0">
                안정 유지
              </span>
            </div>
            <div className="mt-2 text-3xl font-bold text-zinc-900  font-mono">
              46%
            </div>
            <div className="mt-3 text-xs text-klic-muted">일일 총 1,456M 요청 중</div>
          </div>

          {/* KPI 4: 잔여 에러 버짓 */}
          <div className="p-5">
            <div className="flex items-center justify-between gap-2 text-xs text-klic-muted">
              <span className="font-medium">잔여 에러 버짓</span>
              <span className="px-2 py-0.5 rounded-md border border-zinc-200  text-zinc-700  font-semibold text-[11px] whitespace-nowrap shrink-0">
                안정 유지
              </span>
            </div>
            <div className="mt-2 text-3xl font-bold text-zinc-900  font-mono">
              52%
            </div>
            {/* 블루 진행 바 + 빗금 잔여 트랙 */}
            <div className="mt-3.5 h-2 w-full rounded-full bg-zinc-100  overflow-hidden flex items-center">
              <div className="h-full bg-blue-500 rounded-l-full" style={{ width: '52%' }} />
              <div
                className="h-full flex-1 opacity-35"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(-45deg, transparent, transparent 3px, var(--klic-component-block-color-control-border) 3px, var(--klic-component-block-color-control-border) 4px)',
                }}
              />
            </div>
          </div>
        </div>

        {/* 슬로프 차트 본문 캔버스 영역 */}
        <div className="p-5 sm:p-6 overflow-x-auto">
          <div className="min-w-[820px] max-w-[1000px] mx-auto">
            <svg
              viewBox="0 0 1000 555"
              className="w-full h-auto select-none overflow-visible"
              onMouseLeave={() => setHoveredServiceId(null)}
            >
              <defs>
                {/* 좌->우 그라데이션: 위험 (Critical Red) */}
                <linearGradient id="slope-grad-critical" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--klic-component-block-color-danger)" stopOpacity={0.5} />
                  <stop offset="50%" stopColor="var(--klic-component-block-color-danger)" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="var(--klic-component-block-color-danger)" stopOpacity={0.98} />
                </linearGradient>

                {/* 좌->우 그라데이션: 주의 (Watch Amber) */}
                <linearGradient id="slope-grad-watch" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--klic-component-block-color-warning)" stopOpacity={0.55} />
                  <stop offset="50%" stopColor="var(--klic-component-block-color-warning)" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="var(--klic-component-block-color-warning)" stopOpacity={0.95} />
                </linearGradient>

                {/* 좌->우 그라데이션: 정상 (Healthy Emerald) */}
                <linearGradient id="slope-grad-healthy" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--klic-component-block-color-selected)" stopOpacity={0.55} />
                  <stop offset="50%" stopColor="var(--klic-component-block-color-accent)" stopOpacity={0.75} />
                  <stop offset="100%" stopColor="var(--klic-component-block-color-accent)" stopOpacity={0.92} />
                </linearGradient>

                {/* 호버 활성 라인용 선명한 그라데이션 */}
                <linearGradient id="slope-grad-critical-active" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--klic-component-block-color-danger-surface)" stopOpacity={0.75} />
                  <stop offset="50%" stopColor="var(--klic-component-block-color-danger)" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="var(--klic-component-block-color-danger)" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="slope-grad-watch-active" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--klic-component-block-color-warning)" stopOpacity={0.75} />
                  <stop offset="50%" stopColor="var(--klic-component-block-color-warning)" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="var(--klic-component-block-color-warning)" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="slope-grad-healthy-active" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--klic-component-block-color-accent)" stopOpacity={0.75} />
                  <stop offset="50%" stopColor="var(--klic-component-block-color-accent)" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="var(--klic-component-block-color-accent)" stopOpacity={1} />
                </linearGradient>
              </defs>

              {/* =============================================================
                  상단 컬럼 헤더 & 중앙 상태 필터 범례
                  ============================================================= */}
              <g className="font-sans">
                <text
                  x={X_LEFT - 10}
                  y={22}
                  textAnchor="end"
                  className="text-[12px] font-medium fill-zinc-400"
                >
                  서비스 (일일 트래픽순)
                </text>

                {/* 중앙 범례: 위험 / 주의 / 정상 */}
                <g transform="translate(415, 10)" className="cursor-pointer">
                  <g
                    onClick={() =>
                      setStatusFilter(statusFilter === 'critical' ? 'all' : 'critical')
                    }
                  >
                    <circle cx={0} cy={8} r={4} fill="var(--klic-component-block-color-danger)" />
                    <text
                      x={10}
                      y={12}
                      className={`text-[12px] ${
                        statusFilter === 'critical'
                          ? 'font-bold fill-red-600'
                          : 'font-medium fill-zinc-500'
                      }`}
                    >
                      위험
                    </text>
                  </g>

                  <g
                    transform="translate(52, 0)"
                    onClick={() => setStatusFilter(statusFilter === 'watch' ? 'all' : 'watch')}
                  >
                    <circle cx={0} cy={8} r={4} fill="var(--klic-component-block-color-warning)" />
                    <text
                      x={10}
                      y={12}
                      className={`text-[12px] ${
                        statusFilter === 'watch'
                          ? 'font-bold fill-amber-600'
                          : 'font-medium fill-zinc-500'
                      }`}
                    >
                      주의
                    </text>
                  </g>

                  <g
                    transform="translate(104, 0)"
                    onClick={() =>
                      setStatusFilter(statusFilter === 'healthy' ? 'all' : 'healthy')
                    }
                  >
                    <circle cx={0} cy={8} r={4} fill="var(--klic-component-block-color-accent)" />
                    <text
                      x={10}
                      y={12}
                      className={`text-[12px] ${
                        statusFilter === 'healthy'
                          ? 'font-bold fill-blue-600'
                          : 'font-medium fill-zinc-500'
                      }`}
                    >
                      정상
                    </text>
                  </g>
                </g>

                <text
                  x={X_RIGHT + 12}
                  y={22}
                  textAnchor="start"
                  className="text-[12px] font-medium fill-zinc-400"
                >
                  잔여 런웨이 (현재 소진율)
                </text>
              </g>

              {/* =============================================================
                  14개 슬로프 곡선 (Slope Bezier Curves)
                  ============================================================= */}
              <g className="slope-lines">
                {SERVICES_DATA.map((svc) => {
                  const y0 = getRowY(svc.leftRank);
                  const y1 = getRowY(svc.rightRank);
                  const pathD = buildSlopeBezierPath(y0, y1);

                  const isHoveredOrPinned = activeServiceId === svc.id;
                  const matchesStatus =
                    statusFilter === 'all' || svc.status === statusFilter;

                  // Dim other lines when a line is hovered so the hovered line & its particles pop
                  let lineOpacity = 0.88;
                  if (activeServiceId) {
                    lineOpacity = isHoveredOrPinned ? 0.95 : 0.12;
                  } else if (!matchesStatus) {
                    lineOpacity = 0.12;
                  }

                  const strokeUrl = isHoveredOrPinned
                    ? `url(#slope-grad-${svc.status}-active)`
                    : `url(#slope-grad-${svc.status})`;

                  return (
                    <g key={svc.id} data-slope-line={svc.id}>
                      {/* 넓은 투명 히트박스 경로 (마우스 호버를 쉽게 감지) */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="transparent"
                        strokeWidth={Math.max(22, svc.strokeWidth + 14)}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredServiceId(svc.id)}
                        onClick={() =>
                          setPinnedServiceId(pinnedServiceId === svc.id ? null : svc.id)
                        }
                      />

                      {/* 호버 시 라인 외곽 소프트 글로우 언더레이 */}
                      {isHoveredOrPinned && (
                        <path
                          d={pathD}
                          fill="none"
                          stroke={getStatusColor(svc.status)}
                          strokeWidth={Math.max(svc.strokeWidth + 8, 10)}
                          strokeLinecap="round"
                          opacity={0.16}
                          className="pointer-events-none"
                        />
                      )}

                      {/* 실제 시각적 슬로프 곡선 */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={strokeUrl}
                        strokeWidth={
                          isHoveredOrPinned
                            ? Math.max(svc.strokeWidth + 1.2, 3.8)
                            : svc.strokeWidth
                        }
                        strokeLinecap="round"
                        opacity={lineOpacity}
                        className="transition-opacity duration-150 pointer-events-none"
                      />
                    </g>
                  );
                })}
              </g>

              {/* =============================================================
                  호버된 라인 전용 입자 스트림 (Multi-layered Jewel Beads + Comet Wake)
                  - 오직 호버(또는 클릭 고정)된 단일 라인에서만 입자가 흐릅니다!
                  ============================================================= */}
              <g className="slope-particles pointer-events-none">
                {SERVICES_DATA.map((svc) => {
                  const beads = particlesByService[svc.id] || [];
                  const color = getStatusColor(svc.status);
                  const y0 = getRowY(svc.leftRank);
                  const y1 = getRowY(svc.rightRank);

                  if (!beadGroupRefs.current[svc.id]) {
                    beadGroupRefs.current[svc.id] = [];
                  }

                  return (
                    <g key={`beads-${svc.id}`}>
                      {beads.map((bead, idx) => {
                        const initPt = evaluateSlopeBezier(y0, y1, bead.progress);
                        const initTail = buildCometTailPath(y0, y1, bead.progress, 0.065);
                        return (
                          <g
                            key={bead.id}
                            ref={(el) => {
                              beadGroupRefs.current[svc.id][idx] = el;
                            }}
                            opacity={0}
                          >
                            {/* [0] Curved comet tail along the Bezier path */}
                            <path
                              d={initTail}
                              fill="none"
                              stroke={color}
                              strokeWidth={Math.max(2.5, bead.size * 0.85)}
                              strokeLinecap="round"
                              opacity={0.45}
                            />
                            {/* [1] Comet wake trail dot 2 */}
                            <circle
                              cx={initPt.x}
                              cy={initPt.y}
                              r={bead.size * 0.5}
                              fill={color}
                              opacity={0.35}
                            />
                            {/* [2] Comet wake trail dot 1 */}
                            <circle
                              cx={initPt.x}
                              cy={initPt.y}
                              r={bead.size * 0.78}
                              fill={color}
                              opacity={0.6}
                            />
                            {/* [3] Outer soft pulse halo */}
                            <circle
                              cx={initPt.x}
                              cy={initPt.y}
                              r={bead.size * 2.4}
                              fill={color}
                              opacity={0.26}
                            />
                            {/* [4] Main jewel bead with crisp white ring */}
                            <circle
                              cx={initPt.x}
                              cy={initPt.y}
                              r={bead.size}
                              fill={color}
                              stroke="var(--klic-component-block-color-panel)"
                              strokeWidth={2}
                            />
                            {/* [5] Specular highlight center dot */}
                            <circle
                              cx={initPt.x}
                              cy={initPt.y}
                              r={bead.size * 0.36}
                              fill="var(--klic-component-block-color-panel)"
                              opacity={0.92}
                            />
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
              </g>

              {/* =============================================================
                  좌측 서비스 목록 (일일 트래픽순 0..13)
                  ============================================================= */}
              <g className="left-labels font-sans">
                {SERVICES_DATA.map((svc) => {
                  const y = getRowY(svc.leftRank);
                  const isActive = activeServiceId === svc.id;
                  const dimmed = activeServiceId && !isActive;

                  return (
                    <g
                      key={`left-${svc.id}`}
                      data-left-service={svc.id}
                      className="cursor-pointer"
                      opacity={dimmed ? 0.32 : 1}
                      onMouseEnter={() => setHoveredServiceId(svc.id)}
                      onClick={() =>
                        setPinnedServiceId(pinnedServiceId === svc.id ? null : svc.id)
                      }
                    >
                      {/* 호버 감지용 투명 배경 박스 (행 전체 높이 36px 커버) */}
                      <rect
                        x={0}
                        y={y - ROW_GAP / 2}
                        width={X_LEFT}
                        height={ROW_GAP}
                        fill="transparent"
                      />

                      {/* 한글 서비스명 */}
                      <text
                        x={X_LEFT - 52}
                        y={y + 4}
                        textAnchor="end"
                        className={`text-[12.5px] ${
                          isActive
                            ? 'font-bold fill-zinc-950 '
                            : 'font-semibold fill-zinc-700 '
                        }`}
                      >
                        {svc.name}
                      </text>

                      {/* 트래픽 수치 */}
                      <text
                        x={X_LEFT - 10}
                        y={y + 4}
                        textAnchor="end"
                        className={`text-[12px] font-mono ${
                          isActive ? 'font-bold fill-zinc-900 ' : 'fill-zinc-400'
                        }`}
                      >
                        {svc.trafficLabel}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* =============================================================
                  우측 런웨이 수치 & 미니 버짓 게이지 바 (0..13)
                  ============================================================= */}
              <g className="right-labels font-sans">
                {rightSortedServices.map((svc) => {
                  const y = getRowY(svc.rightRank);
                  const isActive = activeServiceId === svc.id;
                  const dimmed = activeServiceId && !isActive;
                  const color = getStatusColor(svc.status);
                  const bufferColor = getStatusBufferColor(svc.status);

                  const barX = X_RIGHT + 56;
                  const barWidth = 96;
                  const barHeight = 6;

                  return (
                    <g
                      key={`right-${svc.id}`}
                      data-right-service={svc.id}
                      className="cursor-pointer"
                      opacity={dimmed ? 0.32 : 1}
                      onMouseEnter={() => setHoveredServiceId(svc.id)}
                      onClick={() =>
                        setPinnedServiceId(pinnedServiceId === svc.id ? null : svc.id)
                      }
                    >
                      {/* 호버 감지용 투명 배경 박스 (행 전체 높이 36px 커버) */}
                      <rect
                        x={X_RIGHT}
                        y={y - ROW_GAP / 2}
                        width={195}
                        height={ROW_GAP}
                        fill="transparent"
                      />

                      {/* 런웨이 일수 */}
                      <text
                        x={X_RIGHT + 12}
                        y={y + 4}
                        textAnchor="start"
                        className={`text-[12.5px] font-mono font-bold ${
                          isActive
                            ? 'fill-zinc-950 '
                            : 'fill-zinc-800 '
                        }`}
                      >
                        {mode === 'current' ? svc.runwayLabel : svc.baselineRunwayLabel}
                      </text>

                      {/* 미니 게이지 바 트랙 */}
                      <rect
                        x={barX}
                        y={y - 3}
                        width={barWidth}
                        height={barHeight}
                        rx={3}
                        fill="var(--klic-component-block-color-soft)"
                      />

                      {/* 기준선 버퍼 바 (연한 색상) */}
                      <rect
                        x={barX}
                        y={y - 3}
                        width={(barWidth * svc.gaugeBufferPercent) / 100}
                        height={barHeight}
                        rx={3}
                        fill={bufferColor}
                      />

                      {/* 현재 잔여 런웨이 바 (진한 색상) */}
                      <rect
                        x={barX}
                        y={y - 3}
                        width={Math.max(6, (barWidth * svc.gaugePercent) / 100)}
                        height={barHeight}
                        rx={3}
                        fill={color}
                      />
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </div>

        {/* 하단 실시간 서비스 상태 요약 바 (호버 시 해당 서비스 정보로 즉시 전환) */}
        <div className="px-6 py-3.5 border-t border-zinc-100  bg-zinc-50/50  flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-bold text-zinc-900  text-[13px]">
              {inspectedService.name}
            </span>
            <span className="font-mono text-[11px] text-klic-muted">
              ({inspectedService.codeName})
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-semibold border text-[11px] ${
                getStatusBadge(inspectedService.status).bg
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  getStatusBadge(inspectedService.status).dot
                }`}
              />
              {getStatusBadge(inspectedService.status).label}
            </span>
            <span className="text-klic-muted hidden md:inline">
              {inspectedService.koreanDesc}
            </span>
          </div>

          <div className="flex items-center gap-4 text-klic-muted">
            <span>{inspectedService.team}</span>
            <span>
              소진 속도{' '}
              <strong className="text-zinc-900  font-mono">
                {inspectedService.burnMultiplier}
              </strong>
            </span>
            <span>
              잔여 한도{' '}
              <strong className="text-zinc-900  font-mono">
                {inspectedService.runwayLabel} 후 소진
              </strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export type SlopeChartVariant = 'error-budget-slope' | 'arr-growth-slope' | 'feature-adoption-slope';
export interface SlopeChartBlockProps { density?: string; variant?: SlopeChartVariant; }

type ComparisonVariant = Exclude<SlopeChartVariant, 'error-budget-slope'>;
interface ComparisonSeries { id: string; name: string; before: number; after: number; }
const COMPARISONS: Record<ComparisonVariant, {
  title: string; description: string; unit: string; beforeLabel: string; afterLabel: string;
  max: number; ticks: number[]; summary: string; note: string; series: ComparisonSeries[];
}> = {
  'arr-growth-slope': {
    title: '고객군별 ARR 성장', description: '2026년 2분기 → 3분기 · 연간 반복 매출',
    unit: '$M', beforeLabel: '2026 Q2', afterLabel: '2026 Q3', max: 4, ticks: [0, 1, 2, 3, 4],
    summary: '전체 고객군 ARR', note: '샘플 재무 데이터 · USD 백만 단위 · 일회성 매출은 제외합니다.',
    series: [
      { id: 'enterprise', name: '엔터프라이즈', before: 2.4, after: 3.8 },
      { id: 'midmarket', name: '중견기업', before: 1.8, after: 2.7 },
      { id: 'smallbusiness', name: '중소기업', before: 1.25, after: 1.62 },
      { id: 'startup', name: '스타트업', before: .6, after: .72 },
      { id: 'strategic', name: '전략 계정', before: .8, after: 1.45 },
    ],
  },
  'feature-adoption-slope': {
    title: '핵심 기능 도입률', description: '2026년 4월 → 10월 · 월간 활성 계정 중 기능 사용 비율',
    unit: '%', beforeLabel: '2026년 4월', afterLabel: '2026년 10월', max: 100, ticks: [0, 25, 50, 75, 100],
    summary: '기능별 평균 도입률', note: '샘플 사용 데이터 · 매월 기능을 1회 이상 사용한 활성 계정의 비율입니다. 기능 간 중복 사용을 포함합니다.',
    series: [
      { id: 'workflow', name: '워크플로', before: 28, after: 59 },
      { id: 'dashboard', name: '대시보드', before: 54, after: 72 },
      { id: 'exports', name: '데이터 내보내기', before: 71, after: 84 },
      { id: 'automation', name: '자동화', before: 19, after: 46 },
      { id: 'alerts', name: '알림 규칙', before: 42, after: 35 },
    ],
  },
};

function ComparativeSlopeChart({ variant }: { variant: ComparisonVariant }) {
  const config = COMPARISONS[variant];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const activeId = hoveredId ?? selectedId;
  const selected = config.series.find(series => series.id === activeId);
  const isRevenue = variant === 'arr-growth-slope';
  const divisor = isRevenue ? 1 : config.series.length;
  const before = selected?.before ?? config.series.reduce((sum, series) => sum + series.before, 0) / divisor;
  const after = selected?.after ?? config.series.reduce((sum, series) => sum + series.after, 0) / divisor;
  const format = (value: number) => isRevenue ? `$${value.toFixed(2)}M` : `${Number(value.toFixed(1))}%`;
  const difference = (first: number, last: number) => `${last >= first ? '+' : ''}${isRevenue ? ((last - first) / first * 100).toFixed(1) + '%' : Number((last - first).toFixed(1)) + ' pp'}`;
  const y = (value: number) => 385 - value / config.max * 310;
  const color = (index: number) => `var(--klic-component-block-chart-series-${index + 1})`;
  return <section className="rounded-2xl border border-zinc-200 bg-white shadow-xs overflow-hidden" data-chart-variant={variant}>
    <header className="px-6 py-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div><h2 className="text-[18px] font-bold text-zinc-900">{config.title}</h2><p className="text-[13px] text-klic-muted mt-1">{config.description}</p></div>
      <button onClick={() => { setSelectedId(null); setHoveredId(null); }} className="inline-flex items-center gap-2 self-start px-3 py-2 rounded-lg border border-zinc-200 text-xs text-klic-muted hover:bg-zinc-50"><RefreshCw size={14} />선택 초기화</button>
    </header>
    <div className="grid grid-cols-1 lg:grid-cols-4">
      <div className="lg:col-span-3 p-4 sm:p-6">
        <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label={isRevenue ? '고객군 선택' : '기능 선택'}>
          <button onClick={() => setSelectedId(null)} aria-pressed={selectedId === null} className={`rounded-lg border px-3 py-1.5 text-xs ${selectedId === null ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold' : 'border-zinc-200 text-klic-muted'}`}>전체</button>
          {config.series.map((series, index) => <button key={series.id} onClick={() => setSelectedId(current => current === series.id ? null : series.id)} aria-pressed={selectedId === series.id} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs ${selectedId === series.id ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold' : 'border-zinc-200 text-klic-muted'}`}><span className="w-2 h-2 rounded-full" style={{ background: color(index) }} />{series.name}</button>)}
        </div>
        <svg viewBox="0 0 780 455" className="w-full" role="img" aria-label={`${config.title}. ${config.beforeLabel}와 ${config.afterLabel}의 동일 단위 비교. 아래 표에서 모든 값을 확인할 수 있습니다.`} onMouseLeave={() => setHoveredId(null)}>
          {config.ticks.map(tick => <g key={tick}><line x1="195" y1={y(tick)} x2="570" y2={y(tick)} stroke="var(--klic-component-block-color-border)" strokeDasharray="3 5" /><text x="383" y={y(tick) - 6} textAnchor="middle" fontSize="10" fill="var(--klic-component-block-color-muted)">{isRevenue ? `$${tick}M` : `${tick}%`}</text></g>)}
          <text x="195" y="38" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--klic-component-block-color-text)">{config.beforeLabel}</text>
          <text x="570" y="38" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--klic-component-block-color-text)">{config.afterLabel}</text>
          {config.series.map((series, index) => {
            const highlighted = !activeId || activeId === series.id;
            return <g key={series.id} opacity={highlighted ? 1 : .22} onMouseEnter={() => setHoveredId(series.id)} onClick={() => setSelectedId(series.id)} className="cursor-pointer">
              <title>{`${series.name}: ${format(series.before)} → ${format(series.after)}, ${difference(series.before, series.after)}`}</title>
              <line x1="195" y1={y(series.before)} x2="570" y2={y(series.after)} stroke={color(index)} strokeWidth={activeId === series.id ? 4 : 2.5} />
              <line x1="195" y1={y(series.before)} x2="570" y2={y(series.after)} stroke="transparent" strokeWidth="16" />
              <circle cx="195" cy={y(series.before)} r="5" fill={color(index)} stroke="var(--klic-component-block-color-panel)" strokeWidth="2" />
              <circle cx="570" cy={y(series.after)} r="5" fill={color(index)} stroke="var(--klic-component-block-color-panel)" strokeWidth="2" />
              <text x="180" y={y(series.before) + 4} textAnchor="end" fontSize="11.5" fill="var(--klic-component-block-color-text)">{series.name} · {format(series.before)}</text>
              <text x="585" y={y(series.after) + 4} fontSize="12" fontWeight="600" fill={color(index)}>{format(series.after)} <tspan fontSize="10" fontWeight="400">({difference(series.before, series.after)})</tspan></text>
            </g>;
          })}
          <text x="383" y="433" textAnchor="middle" fontSize="11" fill="var(--klic-component-block-color-muted)">같은 세로 축 · 단위 {config.unit}</text>
        </svg>
      </div>
      <aside className="p-5 sm:p-6 border-t lg:border-t-0 lg:border-l border-zinc-100 bg-zinc-50/50">
        <p className="text-xs text-klic-muted">{selected?.name ?? config.summary}</p>
        <p className="text-3xl font-bold font-mono mt-2 text-zinc-900">{format(after)}</p>
        <p className="inline-block mt-3 text-sm font-semibold text-blue-700 bg-blue-50 rounded-md px-2 py-1">{difference(before, after)}</p>
        <dl className="mt-6 space-y-3 text-xs"><div className="flex justify-between gap-3"><dt className="text-klic-muted">{config.beforeLabel}</dt><dd className="font-mono">{format(before)}</dd></div><div className="flex justify-between gap-3"><dt className="text-klic-muted">{config.afterLabel}</dt><dd className="font-mono">{format(after)}</dd></div></dl>
        <p className="text-xs text-klic-muted leading-relaxed mt-6">{isRevenue ? '증감률은 이전 분기 ARR을 기준으로 계산합니다.' : 'pp는 퍼센트포인트입니다. 예: 28%에서 59%로 오르면 +31 pp입니다.'}</p>
      </aside>
    </div>
    <div className="overflow-x-auto border-t border-zinc-100"><table className="w-full text-sm text-left"><thead className="bg-zinc-50 text-klic-muted"><tr><th className="px-6 py-3 font-medium">{isRevenue ? '고객군' : '기능'}</th><th className="px-4 py-3 font-medium text-right">{config.beforeLabel}</th><th className="px-4 py-3 font-medium text-right">{config.afterLabel}</th><th className="px-6 py-3 font-medium text-right">증감</th></tr></thead><tbody>{config.series.map(series => <tr key={series.id} className={activeId === series.id ? 'bg-blue-50/60' : ''}><th className="px-6 py-2.5 font-medium"><button onClick={() => setSelectedId(series.id)} aria-pressed={selectedId === series.id} className="hover:underline text-left">{series.name}</button></th><td className="px-4 py-2.5 text-right font-mono">{format(series.before)}</td><td className="px-4 py-2.5 text-right font-mono">{format(series.after)}</td><td className="px-6 py-2.5 text-right font-mono text-blue-700">{difference(series.before, series.after)}</td></tr>)}</tbody></table></div>
    <footer className="px-6 py-3 border-t border-zinc-100 text-xs text-klic-muted">{config.note}</footer>
  </section>;
}

export function SlopeChartBlock({ variant = 'error-budget-slope', density }: SlopeChartBlockProps) {
  return variant === 'error-budget-slope' ? <ErrorBudgetSlopeChart density={density} /> : <ComparativeSlopeChart key={variant} variant={variant} />;
}
