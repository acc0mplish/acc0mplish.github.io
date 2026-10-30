import { useReducedMotion } from '../../utils/useReducedMotion';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ChevronDown,
  RefreshCw,
  Pause,
  Play,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export type TimeRange = '7D' | '30D' | '90D';
export type FlowCategoryFilter = 'all' | 'revenue' | 'costs' | 'profit';
export type JourneyFilter = 'all' | 'journey' | 'upgraded' | 'dropped';

export interface FunnelFlowBlockProps {
  initialCard?: string;
  density?: 'compact' | 'normal' | 'relaxed' | string;
}

interface RibbonDef {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'journey' | 'upgraded' | 'dropped' | 'revenue' | 'profit' | 'costs';
  x0: number;
  y0_top: number;
  y0_bot: number;
  x1: number;
  y1_top: number;
  y1_bot: number;
  fill: string;
  particleColor: string;
  particleCount: number;
  label?: string;
  amountText?: string;
}

interface ParticleState {
  id: number;
  ribbonIndex: number;
  progress: number;
  speed: number;
  offsetRatio: number;
  radius: number;
  baseOpacity: number;
}

// Helper: Generate SVG path string for a cubic bezier ribbon
function buildRibbonPath(r: RibbonDef): string {
  const midX = (r.x0 + r.x1) / 2;
  return `M ${r.x0} ${r.y0_top} C ${midX} ${r.y0_top}, ${midX} ${r.y1_top}, ${r.x1} ${r.y1_top} L ${r.x1} ${r.y1_bot} C ${midX} ${r.y1_bot}, ${midX} ${r.y0_bot}, ${r.x0} ${r.y0_bot} Z`;
}

// Helper: Exact point inside the cubic bezier ribbon at parameter t in [0, 1] and vertical ratio in [0, 1]
function getPointInRibbon(r: RibbonDef, t: number, offsetRatio: number): { x: number; y: number } {
  const midX = (r.x0 + r.x1) / 2;
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  // Exact X along cubic bezier with control points (x0, midX, midX, x1)
  const x = uuu * r.x0 + 3 * uu * t * midX + 3 * u * tt * midX + ttt * r.x1;

  // Exact top & bottom Y along cubic bezier at parameter t
  // Since P1.y = y0 and P2.y = y1, basis functions simplify to (uuu + 3*uu*t)*y0 + (3*u*tt + ttt)*y1
  const w0 = uuu + 3 * uu * t;
  const w1 = 3 * u * tt + ttt;

  const yTop = w0 * r.y0_top + w1 * r.y1_top;
  const yBot = w0 * r.y0_bot + w1 * r.y1_bot;

  // Clamp offsetRatio safely inside ribbon thickness so particle radius never touches border
  const safeRatio = Math.max(0.16, Math.min(0.84, offsetRatio));
  const y = yTop + (yBot - yTop) * safeRatio;

  return { x, y };
}

export function FunnelFlowBlock(props: FunnelFlowBlockProps) {
  return props.initialCard === 'deal' ? <B2BDealsFlow /> : <JourneyRevenueFlowBlock {...props} />;
}

function JourneyRevenueFlowBlock({
  initialCard = 'trial',
}: FunnelFlowBlockProps) {
  const reducedMotion = useReducedMotion();
  // Trial Journey state
  const [timeRange, setTimeRange] = useState<TimeRange>('30D');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [journeyFilter, setJourneyFilter] = useState<JourneyFilter>('all');
  const [selectedTrialNode, setSelectedTrialNode] = useState<string | null>(null);
  const [hoveredTrialRibbon, setHoveredTrialRibbon] = useState<string | null>(null);

  // Revenue Flow state
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Q3 FY2026');
  const [isQuarterDropdownOpen, setIsQuarterDropdownOpen] = useState(false);
  const [revFilter, setRevFilter] = useState<FlowCategoryFilter>('all');
  const [selectedRevNode, setSelectedRevNode] = useState<string | null>(null);
  const [hoveredRevNode, setHoveredRevNode] = useState<string | null>(null);
  const [hoveredRevRibbon, setHoveredRevRibbon] = useState<string | null>(null);

  // Refs for direct 60FPS SVG <circle> manipulation (zero React re-render overhead, 100% SVG coordinate match)
  const trialCirclesRef = useRef<(SVGCircleElement | null)[]>([]);
  const revCirclesRef = useRef<(SVGCircleElement | null)[]>([]);

  // Time Range scale for Trial Journey
  const scale = timeRange === '7D' ? 0.25 : timeRange === '90D' ? 2.85 : 1.0;
  const fmt = (n: number) => Math.round(n * scale).toLocaleString();

  // =========================================================================
  // 1. TRIAL JOURNEY RIBBONS (Exact match to image_81dc11f4.png)
  // =========================================================================
  // Bar X positions:
  // Col 1 (Channels): bar at x = 148..153 (width 5)
  // Col 2 (Signed Up): bar at x = 322..327 (width 5)
  // Col 3 (Onboarded / Skipped Setup): bar at x = 496..501 (width 5)
  // Col 4 (Team Invited / Went Solo): bar at x = 670..675 (width 5)
  // Col 5 (Upgraded / Didn't Upgrade): bar at x = 844..849 (width 5)
  const trialRibbons: RibbonDef[] = useMemo(
    () => [
      // Col 1 -> Col 2 (Total height at Signed Up = 260px, from y = 96 to y = 356)
      // Docs: 8,420 / 20,400 = 41.27% -> 107px (y: 96..203)
      {
        id: 'docs-to-signed',
        sourceId: 'docs',
        targetId: 'signed-up',
        type: 'journey',
        x0: 153,
        y0_top: 96,
        y0_bot: 203,
        x1: 322,
        y1_top: 96,
        y1_bot: 203,
        fill: 'var(--klic-component-block-color-border)',
        particleColor: 'var(--klic-component-block-color-text)',
        particleCount: 7,
        label: "문서 → 가입 완료",
        amountText: fmt(8420),
      },
      // Referrals: 5,960 / 20,400 = 29.22% -> 76px (target y: 204.5..280.5)
      {
        id: 'ref-to-signed',
        sourceId: 'referrals',
        targetId: 'signed-up',
        type: 'journey',
        x0: 153,
        y0_top: 232,
        y0_bot: 308,
        x1: 322,
        y1_top: 204.5,
        y1_bot: 280.5,
        fill: 'var(--klic-component-block-color-border)',
        particleColor: 'var(--klic-component-block-color-text)',
        particleCount: 5,
        label: "추천 → 가입 완료",
        amountText: fmt(5960),
      },
      // Newsletter: 3,870 / 20,400 = 18.97% -> 49px (target y: 282..331)
      {
        id: 'news-to-signed',
        sourceId: 'newsletter',
        targetId: 'signed-up',
        type: 'journey',
        x0: 153,
        y0_top: 336,
        y0_bot: 385,
        x1: 322,
        y1_top: 282,
        y1_bot: 331,
        fill: 'var(--klic-component-block-color-border)',
        particleColor: 'var(--klic-component-block-color-text)',
        particleCount: 4,
        label: "뉴스레터 → 가입 완료",
        amountText: fmt(3870),
      },
      // Marketplace: 2,150 / 20,400 = 10.54% -> 27px (target y: 332.5..359.5)
      {
        id: 'mkt-to-signed',
        sourceId: 'marketplace',
        targetId: 'signed-up',
        type: 'journey',
        x0: 153,
        y0_top: 412,
        y0_bot: 439,
        x1: 322,
        y1_top: 332.5,
        y1_bot: 359.5,
        fill: 'var(--klic-component-block-color-border)',
        particleColor: 'var(--klic-component-block-color-text)',
        particleCount: 2,
        label: "마켓플레이스 → 가입 완료",
        amountText: fmt(2150),
      },

      // Col 2 -> Col 3
      // Signed Up -> Onboarded (13,260 = 65.0% -> 171px, y: 96..267)
      {
        id: 'signed-to-onboarded',
        sourceId: 'signed-up',
        targetId: 'onboarded',
        type: 'journey',
        x0: 327,
        y0_top: 96,
        y0_bot: 267,
        x1: 496,
        y1_top: 96,
        y1_bot: 267,
        fill: 'var(--klic-component-block-color-border)',
        particleColor: 'var(--klic-component-block-color-text)',
        particleCount: 11,
        label: "가입 완료 → 초기 설정 완료",
        amountText: `${fmt(13260)} (65.0%)`,
      },
      // Signed Up -> Skipped Setup (7,140 = 35.0% -> 92px, source y: 267.5..359.5 -> target y: 298..390)
      {
        id: 'signed-to-skipped',
        sourceId: 'signed-up',
        targetId: 'skipped-setup',
        type: 'dropped',
        x0: 327,
        y0_top: 267.5,
        y0_bot: 359.5,
        x1: 496,
        y1_top: 298,
        y1_bot: 390,
        fill: 'var(--klic-component-block-color-soft)',
        particleColor: 'var(--klic-component-block-color-danger)',
        particleCount: 6,
        label: "가입 완료 → 초기 설정 건너뜀",
        amountText: `${fmt(7140)} (35.0%)`,
      },

      // Col 3 -> Col 4
      // Onboarded -> Team Invited (7,830 = 59.0% of 13,260 -> 101px, y: 96..197)
      {
        id: 'onboarded-to-team',
        sourceId: 'onboarded',
        targetId: 'team-invited',
        type: 'journey',
        x0: 501,
        y0_top: 96,
        y0_bot: 197,
        x1: 670,
        y1_top: 96,
        y1_bot: 197,
        fill: 'var(--klic-component-block-color-border)',
        particleColor: 'var(--klic-component-block-color-text)',
        particleCount: 7,
        label: "초기 설정 완료 → 팀 초대",
        amountText: `${fmt(7830)} (59.0%)`,
      },
      // Onboarded -> Went Solo (5,430 = 41.0% of 13,260 -> 70px, source y: 197..267 -> target y: 228..298)
      {
        id: 'onboarded-to-solo',
        sourceId: 'onboarded',
        targetId: 'went-solo',
        type: 'dropped',
        x0: 501,
        y0_top: 197,
        y0_bot: 267,
        x1: 670,
        y1_top: 228,
        y1_bot: 298,
        fill: 'var(--klic-component-block-color-soft)',
        particleColor: 'var(--klic-component-block-color-danger)',
        particleCount: 5,
        label: "초기 설정 완료 → 개인 사용",
        amountText: `${fmt(5430)} (41.0%)`,
      },

      // Col 4 -> Col 5
      // Team Invited -> Upgraded (2,940 = 37.5% of 7,830 -> 38px, y: 96..134)
      {
        id: 'team-to-upgraded',
        sourceId: 'team-invited',
        targetId: 'upgraded',
        type: 'upgraded',
        x0: 675,
        y0_top: 96,
        y0_bot: 134,
        x1: 844,
        y1_top: 96,
        y1_bot: 134,
        fill: 'var(--klic-component-block-color-border)',
        particleColor: 'var(--klic-component-block-color-accent)',
        particleCount: 4,
        label: "팀 초대 → 유료 전환",
        amountText: `${fmt(2940)} (37.5%)`,
      },
      // Team Invited -> Didn't Upgrade (4,890 = 62.5% of 7,830 -> 63px, source y: 134..197 -> target y: 168..231)
      {
        id: 'team-to-didnt',
        sourceId: 'team-invited',
        targetId: 'didnt-upgrade',
        type: 'dropped',
        x0: 675,
        y0_top: 134,
        y0_bot: 197,
        x1: 844,
        y1_top: 168,
        y1_bot: 231,
        fill: 'var(--klic-component-block-color-soft)',
        particleColor: 'var(--klic-component-block-color-danger)',
        particleCount: 5,
        label: "팀 초대 → 유료 미전환",
        amountText: `${fmt(4890)} (62.5%)`,
      },
    ],
    [scale]
  );

  // =========================================================================
  // 2. REVENUE FLOW RIBBONS (Exact match to image_5a3eb8ca.png)
  // =========================================================================
  const revRibbons: RibbonDef[] = useMemo(
    () => [
      // Col 1 (x=135..143) -> Col 2 (x=350..358)
      {
        id: 'rev-sub',
        sourceId: 'subscriptions',
        targetId: 'revenue',
        type: 'revenue',
        x0: 143,
        y0_top: 35,
        y0_bot: 282,
        x1: 350,
        y1_top: 55,
        y1_bot: 302,
        fill: 'url(#grad-rev-neutral)',
        particleColor: 'var(--klic-component-block-color-text)',
        particleCount: 9,
      },
      {
        id: 'rev-usage',
        sourceId: 'usage',
        targetId: 'revenue',
        type: 'revenue',
        x0: 143,
        y0_top: 298,
        y0_bot: 382,
        x1: 350,
        y1_top: 302,
        y1_bot: 386,
        fill: 'url(#grad-rev-neutral)',
        particleColor: 'var(--klic-component-block-color-text)',
        particleCount: 5,
      },
      {
        id: 'rev-serv',
        sourceId: 'services',
        targetId: 'revenue',
        type: 'revenue',
        x0: 143,
        y0_top: 396,
        y0_bot: 425,
        x1: 350,
        y1_top: 386,
        y1_bot: 415,
        fill: 'url(#grad-rev-neutral)',
        particleColor: 'var(--klic-component-block-color-text)',
        particleCount: 3,
      },

      // Col 2 (x=358) -> Col 3 (x=560)
      {
        id: 'rev-to-gp',
        sourceId: 'revenue',
        targetId: 'gross-profit',
        type: 'profit',
        x0: 358,
        y0_top: 55,
        y0_bot: 318,
        x1: 560,
        y1_top: 55,
        y1_bot: 318,
        fill: 'url(#grad-rev-profit)',
        particleColor: 'var(--klic-component-block-color-accent)',
        particleCount: 10,
      },
      {
        id: 'rev-to-cor',
        sourceId: 'revenue',
        targetId: 'cost-of-revenue',
        type: 'costs',
        x0: 358,
        y0_top: 318,
        y0_bot: 415,
        x1: 560,
        y1_top: 332,
        y1_bot: 429,
        fill: 'url(#grad-rev-cost)',
        particleColor: 'var(--klic-component-block-color-accent)',
        particleCount: 5,
      },

      // Col 3 (x=568) -> Col 4 (x=690)
      {
        id: 'gp-to-oi',
        sourceId: 'gross-profit',
        targetId: 'operating-income',
        type: 'profit',
        x0: 568,
        y0_top: 55,
        y0_bot: 134,
        x1: 690,
        y1_top: 90,
        y1_bot: 169,
        fill: 'url(#grad-gp-oi)',
        particleColor: 'var(--klic-component-block-color-accent)',
        particleCount: 5,
      },
      {
        id: 'gp-to-opex',
        sourceId: 'gross-profit',
        targetId: 'operating-expenses',
        type: 'costs',
        x0: 568,
        y0_top: 134,
        y0_bot: 318,
        x1: 690,
        y1_top: 196,
        y1_bot: 380,
        fill: 'url(#grad-gp-opex)',
        particleColor: 'var(--klic-component-block-color-accent)',
        particleCount: 8,
      },

      // Col 4 (x=698) -> Col 5 (x=830)
      {
        id: 'oi-to-ni',
        sourceId: 'operating-income',
        targetId: 'net-income',
        type: 'profit',
        x0: 698,
        y0_top: 90,
        y0_bot: 152,
        x1: 830,
        y1_top: 55,
        y1_bot: 117,
        fill: 'url(#grad-gp-oi)',
        particleColor: 'var(--klic-component-block-color-accent)',
        particleCount: 4,
      },
      {
        id: 'oi-to-tax',
        sourceId: 'operating-income',
        targetId: 'income-tax',
        type: 'costs',
        x0: 698,
        y0_top: 152,
        y0_bot: 169,
        x1: 830,
        y1_top: 130,
        y1_bot: 147,
        fill: 'url(#grad-rev-cost)',
        particleColor: 'var(--klic-component-block-color-accent)',
        particleCount: 2,
      },
      {
        id: 'opex-to-rd',
        sourceId: 'operating-expenses',
        targetId: 'rd',
        type: 'costs',
        x0: 698,
        y0_top: 196,
        y0_bot: 270,
        x1: 830,
        y1_top: 175,
        y1_bot: 249,
        fill: 'url(#grad-rev-cost)',
        particleColor: 'var(--klic-component-block-color-accent)',
        particleCount: 4,
      },
      {
        id: 'opex-to-sm',
        sourceId: 'operating-expenses',
        targetId: 'sales-marketing',
        type: 'costs',
        x0: 698,
        y0_top: 270,
        y0_bot: 353,
        x1: 830,
        y1_top: 262,
        y1_bot: 345,
        fill: 'url(#grad-rev-cost)',
        particleColor: 'var(--klic-component-block-color-accent)',
        particleCount: 5,
      },
      {
        id: 'opex-to-ga',
        sourceId: 'operating-expenses',
        targetId: 'ga',
        type: 'costs',
        x0: 698,
        y0_top: 353,
        y0_bot: 380,
        x1: 830,
        y1_top: 358,
        y1_bot: 385,
        fill: 'url(#grad-rev-cost)',
        particleColor: 'var(--klic-component-block-color-accent)',
        particleCount: 2,
      },
    ],
    []
  );

  // Build deterministic initial particle pools for both charts
  const trialParticlesInit = useMemo(() => {
    const list: ParticleState[] = [];
    let id = 0;
    trialRibbons.forEach((r, rIdx) => {
      for (let i = 0; i < r.particleCount; i++) {
        // Stagger progress evenly + slight deterministic jitter
        const baseProgress = (i + 0.5) / r.particleCount;
        // Spread vertically across middle 64% of ribbon height
        const lane = 0.2 + ((i * 0.61803398875) % 1) * 0.6;
        list.push({
          id: id++,
          ribbonIndex: rIdx,
          progress: baseProgress,
          speed: 0.0022 + (i % 3) * 0.0005,
          offsetRatio: lane,
          radius: 2.6,
          baseOpacity: 0.72,
        });
      }
    });
    return list;
  }, [trialRibbons]);

  const revParticlesInit = useMemo(() => {
    const list: ParticleState[] = [];
    let id = 0;
    revRibbons.forEach((r, rIdx) => {
      for (let i = 0; i < r.particleCount; i++) {
        const baseProgress = (i + 0.5) / r.particleCount;
        const lane = 0.2 + ((i * 0.61803398875) % 1) * 0.6;
        list.push({
          id: id++,
          ribbonIndex: rIdx,
          progress: baseProgress,
          speed: 0.002 + (i % 3) * 0.0004,
          offsetRatio: lane,
          radius: 2.5,
          baseOpacity: 0.65,
        });
      }
    });
    return list;
  }, [revRibbons]);

  // 60FPS SVG Particle Animation Loop (animates cx/cy inside SVG coordinate space)
  useEffect(() => {
    if (reducedMotion) return;
    let animId: number;
    const trialState = trialParticlesInit.map((p) => ({ ...p }));
    const revState = revParticlesInit.map((p) => ({ ...p }));

    const tick = () => {
      if (isPlaying) {
        // Update Trial Journey SVG circles
        trialState.forEach((p, idx) => {
          p.progress += p.speed;
          if (p.progress >= 1) {
            p.progress -= 1;
          }
          const el = trialCirclesRef.current[idx];
          const ribbon = trialRibbons[p.ribbonIndex];
          if (el && ribbon) {
            const pt = getPointInRibbon(ribbon, p.progress, p.offsetRatio);
            el.setAttribute('cx', pt.x.toFixed(1));
            el.setAttribute('cy', pt.y.toFixed(1));

            // Smooth edge fade-in and fade-out near the vertical bars
            const edgeFade =
              p.progress < 0.08
                ? p.progress / 0.08
                : p.progress > 0.92
                ? (1 - p.progress) / 0.08
                : 1;
            el.setAttribute('opacity', (p.baseOpacity * edgeFade).toFixed(2));
          }
        });

        // Update Revenue Flow SVG circles
        revState.forEach((p, idx) => {
          p.progress += p.speed;
          if (p.progress >= 1) {
            p.progress -= 1;
          }
          const el = revCirclesRef.current[idx];
          const ribbon = revRibbons[p.ribbonIndex];
          if (el && ribbon) {
            const pt = getPointInRibbon(ribbon, p.progress, p.offsetRatio);
            el.setAttribute('cx', pt.x.toFixed(1));
            el.setAttribute('cy', pt.y.toFixed(1));

            const edgeFade =
              p.progress < 0.08
                ? p.progress / 0.08
                : p.progress > 0.92
                ? (1 - p.progress) / 0.08
                : 1;
            el.setAttribute('opacity', (p.baseOpacity * edgeFade).toFixed(2));
          }
        });
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, trialParticlesInit, revParticlesInit, trialRibbons, revRibbons, reducedMotion]);

  // Check if a Trial Journey ribbon is highlighted
  const isTrialRibbonActive = (r: RibbonDef) => {
    if (journeyFilter !== 'all' && r.type !== journeyFilter) return false;
    if (selectedTrialNode) {
      return r.sourceId === selectedTrialNode || r.targetId === selectedTrialNode;
    }
    return true;
  };

  // Check if a Revenue Flow ribbon is highlighted
  const activeRevFocus = hoveredRevNode || selectedRevNode;
  const isRevRibbonActive = (r: RibbonDef) => {
    if (revFilter !== 'all' && r.type !== revFilter) return false;
    if (activeRevFocus) {
      return r.sourceId === activeRevFocus || r.targetId === activeRevFocus;
    }
    return true;
  };

  return (
    <div className="w-full space-y-8">
      {/* =====================================================================
          CARD 1: TRIAL JOURNEY (100% Match to image_81dc11f4.png)
          ===================================================================== */}
      {initialCard !== 'revenue' && <div data-flow-variant="trial" className="rounded-2xl border border-zinc-200  bg-white  shadow-xs overflow-hidden p-5 sm:p-6">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-[17px] font-bold text-zinc-900  tracking-tight">
                체험 고객 여정
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-zinc-100  text-zinc-700  border border-zinc-200/80 ">
                {fmt(20400)} 건의 체험
              </span>
            </div>
            <p className="mt-1 text-[13px] text-klic-muted ">
              신규 체험 고객의 전환과 이탈 지점
            </p>
          </div>

          {/* Right Action Controls: 7D | 30D | 90D, Reset, Play/Pause */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center rounded-lg border border-zinc-200  bg-zinc-50  p-0.5 text-xs">
              {(['7D', '30D', '90D'] as TimeRange[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-2.5 py-1 rounded-md transition font-medium ${
                    timeRange === t
                      ? 'bg-white  text-zinc-900  shadow-2xs font-semibold border border-zinc-200/60 '
                      : 'text-klic-muted hover:text-zinc-800 '
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setSelectedTrialNode(null);
                setJourneyFilter('all');
                setTimeRange('30D');
              }}
              title="초기화"
              className="p-1.5 rounded-lg border border-zinc-200  text-klic-muted  hover:bg-zinc-50  transition"
            >
              <RefreshCw size={14} />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? '흐름 일시정지' : '흐름 재생'}
              className="p-1.5 rounded-lg border border-zinc-200  text-klic-muted  hover:bg-zinc-50  transition"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
          </div>
        </div>

        {/* Inner Chart Frame (Rounded Box inside Card, matching image_81dc11f4.png) */}
        <div className="rounded-xl border border-zinc-200/90  bg-white  px-4 py-6 sm:px-6 overflow-x-auto">
          <div className="min-w-[780px] max-w-[980px] mx-auto">
            <svg
              viewBox="0 0 1000 465"
              className="w-full h-auto select-none overflow-visible"
            >
              <defs>
                {/* Strict SVG ClipPaths for every single ribbon so particles NEVER leave the ribbon */}
                {trialRibbons.map((r) => (
                  <clipPath key={`clip-${r.id}`} id={`clip-${r.id}`}>
                    <path d={buildRibbonPath(r)} />
                  </clipPath>
                ))}
              </defs>

              {/* =============================================================
                  STAGE HEADERS & DASHED TICKS (Exact X alignment with bars)
                  ============================================================= */}
              <g className="stage-headers font-sans">
                {/* Col 1: Channels */}
                <text x={85} y={24} className="text-[12px] font-medium fill-zinc-500">
                  유입 채널
                </text>
                <text x={78} y={46} className="text-[15px] font-bold fill-zinc-900 ">
                  4개 유입 경로
                </text>

                {/* Col 2: Signed Up (x = 322) */}
                <text x={322} y={24} className="text-[12px] font-medium fill-zinc-500">
                  가입 완료
                </text>
                <text x={322} y={46} className="text-[15px] font-bold fill-zinc-900 ">
                  {fmt(20400)}
                </text>
                <line
                  x1={324.5}
                  y1={58}
                  x2={324.5}
                  y2={88}
                  stroke="var(--klic-component-block-color-border)"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                />

                {/* Col 3: Onboarded (x = 496) */}
                <text x={496} y={24} className="text-[12px] font-medium fill-zinc-500">
                  초기 설정 완료
                </text>
                <text x={496} y={46} className="text-[15px] font-bold fill-zinc-900 ">
                  {fmt(13260)}{' '}
                  <tspan className="text-[12px] font-normal fill-zinc-500">65.0%</tspan>
                </text>
                <line
                  x1={498.5}
                  y1={58}
                  x2={498.5}
                  y2={88}
                  stroke="var(--klic-component-block-color-border)"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                />

                {/* Col 4: Team Invited (x = 670) */}
                <text x={670} y={24} className="text-[12px] font-medium fill-zinc-500">
                  팀 초대
                </text>
                <text x={670} y={46} className="text-[15px] font-bold fill-zinc-900 ">
                  {fmt(7830)}{' '}
                  <tspan className="text-[12px] font-normal fill-zinc-500">59.0%</tspan>
                </text>
                <line
                  x1={672.5}
                  y1={58}
                  x2={672.5}
                  y2={88}
                  stroke="var(--klic-component-block-color-border)"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                />

                {/* Col 5: Converted (x = 844) */}
                <text x={844} y={24} className="text-[12px] font-medium fill-zinc-500">
                  전환 완료
                </text>
                <text x={844} y={46} className="text-[15px] font-bold fill-blue-500">
                  14.4%
                </text>
                <line
                  x1={846.5}
                  y1={58}
                  x2={846.5}
                  y2={88}
                  stroke="var(--klic-component-block-color-border)"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                />
              </g>

              {/* =============================================================
                  SANKEY RIBBON STREAMS
                  ============================================================= */}
              <g className="trial-ribbons">
                {trialRibbons.map((r) => {
                  const active = isTrialRibbonActive(r);
                  const isHovered = hoveredTrialRibbon === r.id;
                  return (
                    <path
                      key={r.id}
                      d={buildRibbonPath(r)}
                      fill={r.fill}
                      opacity={active ? (isHovered ? 0.95 : 0.82) : 0.15}
                      className="transition-opacity duration-200 cursor-pointer"
                      onMouseEnter={() => setHoveredTrialRibbon(r.id)}
                      onMouseLeave={() => setHoveredTrialRibbon(null)}
                      onClick={() =>
                        setSelectedTrialNode(
                          selectedTrialNode === r.sourceId ? null : r.sourceId
                        )
                      }
                    />
                  );
                })}
              </g>

              {/* =============================================================
                  LIVE FLOWING PARTICLES (Strictly clipped inside each ribbon!)
                  ============================================================= */}
              <g className="trial-particles pointer-events-none">
                {trialParticlesInit.map((p, idx) => {
                  const ribbon = trialRibbons[p.ribbonIndex];
                  const active = isTrialRibbonActive(ribbon);
                  const initialPt = getPointInRibbon(ribbon, p.progress, p.offsetRatio);

                  return (
                    <g key={p.id} clipPath={`url(#clip-${ribbon.id})`} opacity={active ? 1 : 0.1}>
                      <circle
                        ref={(el) => {
                          trialCirclesRef.current[idx] = el;
                        }}
                        cx={initialPt.x}
                        cy={initialPt.y}
                        r={p.radius}
                        fill={ribbon.particleColor}
                        opacity={p.baseOpacity}
                      />
                    </g>
                  );
                })}
              </g>

              {/* =============================================================
                  VERTICAL NODE BARS & LABELS
                  ============================================================= */}
              <g className="trial-bars font-sans">
                {/* 1. Docs (8,420) */}
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedTrialNode(selectedTrialNode === 'docs' ? null : 'docs')}
                >
                  <rect x={148} y={96} width={5} height={107} rx={2.5} fill="var(--klic-component-block-color-text)" />
                  <text
                    x={138}
                    y={144}
                    textAnchor="end"
                    className="text-[12.5px] font-semibold fill-zinc-900 "
                  >
                    문서
                  </text>
                  <text
                    x={138}
                    y={161}
                    textAnchor="end"
                    className="text-[12px] fill-zinc-500"
                  >
                    {fmt(8420)}
                  </text>
                </g>

                {/* 2. Referrals (5,960) */}
                <g
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedTrialNode(selectedTrialNode === 'referrals' ? null : 'referrals')
                  }
                >
                  <rect x={148} y={232} width={5} height={76} rx={2.5} fill="var(--klic-component-block-color-text)" />
                  <text
                    x={138}
                    y={266}
                    textAnchor="end"
                    className="text-[12.5px] font-semibold fill-zinc-900 "
                  >
                    추천
                  </text>
                  <text
                    x={138}
                    y={283}
                    textAnchor="end"
                    className="text-[12px] fill-zinc-500"
                  >
                    {fmt(5960)}
                  </text>
                </g>

                {/* 3. Newsletter (3,870) */}
                <g
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedTrialNode(selectedTrialNode === 'newsletter' ? null : 'newsletter')
                  }
                >
                  <rect x={148} y={336} width={5} height={49} rx={2.5} fill="var(--klic-component-block-color-text)" />
                  <text
                    x={138}
                    y={357}
                    textAnchor="end"
                    className="text-[12.5px] font-semibold fill-zinc-900 "
                  >
                    뉴스레터
                  </text>
                  <text
                    x={138}
                    y={374}
                    textAnchor="end"
                    className="text-[12px] fill-zinc-500"
                  >
                    {fmt(3870)}
                  </text>
                </g>

                {/* 4. Marketplace (2,150) */}
                <g
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedTrialNode(selectedTrialNode === 'marketplace' ? null : 'marketplace')
                  }
                >
                  <rect x={148} y={412} width={5} height={27} rx={2.5} fill="var(--klic-component-block-color-text)" />
                  <text
                    x={138}
                    y={422}
                    textAnchor="end"
                    className="text-[12.5px] font-semibold fill-zinc-900 "
                  >
                    마켓플레이스
                  </text>
                  <text
                    x={138}
                    y={439}
                    textAnchor="end"
                    className="text-[12px] fill-zinc-500"
                  >
                    {fmt(2150)}
                  </text>
                </g>

                {/* 5. Signed Up Bar (x = 322) */}
                <rect
                  x={322}
                  y={96}
                  width={5}
                  height={263.5}
                  rx={2.5}
                  fill="var(--klic-component-block-color-text)"
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedTrialNode(selectedTrialNode === 'signed-up' ? null : 'signed-up')
                  }
                />

                {/* 6. Onboarded Bar (x = 496) */}
                <rect
                  x={496}
                  y={96}
                  width={5}
                  height={171}
                  rx={2.5}
                  fill="var(--klic-component-block-color-text)"
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedTrialNode(selectedTrialNode === 'onboarded' ? null : 'onboarded')
                  }
                />

                {/* 7. Skipped Setup Red Bar (x = 496, y = 298..390) */}
                <g
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedTrialNode(
                      selectedTrialNode === 'skipped-setup' ? null : 'skipped-setup'
                    )
                  }
                >
                  <rect x={496} y={298} width={5} height={92} rx={2.5} fill="var(--klic-component-block-color-danger)" />
                  <text
                    x={511}
                    y={340}
                    textAnchor="start"
                    className="text-[12.5px] font-semibold fill-zinc-900 "
                  >
                    초기 설정 건너뜀
                  </text>
                  <text x={511} y={357} textAnchor="start" className="text-[12px] fill-zinc-500">
                    {fmt(7140)} 35.0%
                  </text>
                </g>

                {/* 8. Team Invited Bar (x = 670) */}
                <rect
                  x={670}
                  y={96}
                  width={5}
                  height={101}
                  rx={2.5}
                  fill="var(--klic-component-block-color-text)"
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedTrialNode(
                      selectedTrialNode === 'team-invited' ? null : 'team-invited'
                    )
                  }
                />

                {/* 9. Went Solo Red Bar (x = 670, y = 228..298) */}
                <g
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedTrialNode(selectedTrialNode === 'went-solo' ? null : 'went-solo')
                  }
                >
                  <rect x={670} y={228} width={5} height={70} rx={2.5} fill="var(--klic-component-block-color-danger)" />
                  <text
                    x={685}
                    y={258}
                    textAnchor="start"
                    className="text-[12.5px] font-semibold fill-zinc-900 "
                  >
                    개인 사용
                  </text>
                  <text x={685} y={275} textAnchor="start" className="text-[12px] fill-zinc-500">
                    {fmt(5430)} 41.0%
                  </text>
                </g>

                {/* 10. Upgraded Emerald Bar (x = 844, y = 96..134) */}
                <g
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedTrialNode(selectedTrialNode === 'upgraded' ? null : 'upgraded')
                  }
                >
                  <rect x={844} y={96} width={5} height={38} rx={2.5} fill="var(--klic-component-block-color-accent)" />
                  <text
                    x={859}
                    y={111}
                    textAnchor="start"
                    className="text-[12.5px] font-semibold fill-zinc-900 "
                  >
                    유료 전환
                  </text>
                  <text x={859} y={128} textAnchor="start" className="text-[12px] fill-zinc-500">
                    {fmt(2940)} 37.5%
                  </text>
                </g>

                {/* 11. Didn't Upgrade Red Bar (x = 844, y = 168..231) */}
                <g
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedTrialNode(
                      selectedTrialNode === 'didnt-upgrade' ? null : 'didnt-upgrade'
                    )
                  }
                >
                  <rect x={844} y={168} width={5} height={63} rx={2.5} fill="var(--klic-component-block-color-danger)" />
                  <text
                    x={859}
                    y={195}
                    textAnchor="start"
                    className="text-[12.5px] font-semibold fill-zinc-900 "
                  >
                    유료 미전환
                  </text>
                  <text x={859} y={212} textAnchor="start" className="text-[12px] fill-zinc-500">
                    {fmt(4890)} 62.5%
                  </text>
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* Card Footer Legend (Exact match to image_81dc11f4.png) */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-klic-muted px-1">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setJourneyFilter(journeyFilter === 'journey' ? 'all' : 'journey')}
              className={`flex items-center gap-1.5 transition ${
                journeyFilter === 'journey' ? 'font-bold text-zinc-900 ' : ''
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-klic-inverse " />
              <span>여정 진행 중</span>
            </button>
            <button
              onClick={() => setJourneyFilter(journeyFilter === 'upgraded' ? 'all' : 'upgraded')}
              className={`flex items-center gap-1.5 transition ${
                journeyFilter === 'upgraded' ? 'font-bold text-blue-600' : ''
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>유료 전환</span>
            </button>
            <button
              onClick={() => setJourneyFilter(journeyFilter === 'dropped' ? 'all' : 'dropped')}
              className={`flex items-center gap-1.5 transition ${
                journeyFilter === 'dropped' ? 'font-bold text-blue-600' : ''
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>이탈</span>
            </button>
          </div>

          <div className="text-klic-muted">체험 고객 집단 샘플 · 점의 밀도는 체험 건수에 비례합니다</div>
        </div>
      </div>}

      {/* =====================================================================
          CARD 2: REVENUE FLOW (100% Match to image_5a3eb8ca.png + Live Flow)
          ===================================================================== */}
      {initialCard === 'revenue' && <div data-flow-variant="revenue" className="rounded-2xl border border-zinc-200  bg-white  shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-100 ">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-[17px] font-bold text-zinc-900  tracking-tight">
                  매출 흐름
                </h2>
                <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-zinc-100  text-zinc-700  border border-zinc-200/80 ">
                  {selectedQuarter.split(' ')[0]} FY26
                </span>
              </div>
              <p className="mt-1 text-[13px] text-klic-muted ">
                Fieldline 매출의 항목별 흐름
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setIsQuarterDropdownOpen(!isQuarterDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200  bg-white  text-zinc-800  hover:bg-zinc-50 transition"
                >
                  <span>{selectedQuarter}</span>
                  <ChevronDown size={14} className="text-klic-muted" />
                </button>
                {isQuarterDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-36 rounded-lg border border-zinc-200  bg-white  shadow-lg py-1 z-50 text-xs">
                    {['Q3 FY2026', 'Q2 FY2026', 'Q1 FY2026', 'FY2025 종합'].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setSelectedQuarter(q);
                          setIsQuarterDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-zinc-100  flex items-center justify-between"
                      >
                        <span>{q}</span>
                        {selectedQuarter === q && <CheckCircle2 size={12} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4 KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            <div className="p-3.5 rounded-xl border border-zinc-200/80  bg-zinc-50/40 ">
              <div className="flex items-center gap-1.5 text-xs text-klic-muted">
                <span className="w-2 h-2 rounded-full bg-klic-inverse " />
                <span>매출</span>
              </div>
              <div className="mt-1 text-2xl font-bold text-zinc-900  font-mono">
                $649M
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-semibold bg-blue-100  text-blue-700 ">
                  <TrendingUp size={11} /> +8.9%
                </span>
                <span className="text-klic-muted">vs Q2 FY26</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-200/80  bg-zinc-50/40 ">
              <div className="flex items-center gap-1.5 text-xs text-klic-muted">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>매출총이익률</span>
              </div>
              <div className="mt-1 text-2xl font-bold text-zinc-900  font-mono">
                73.0%
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-semibold bg-blue-100  text-blue-700 ">
                  <TrendingDown size={11} /> -0.5%p
                </span>
                <span className="text-klic-muted">vs Q2 FY26</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-200/80  bg-zinc-50/40 ">
              <div className="flex items-center gap-1.5 text-xs text-klic-muted">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>영업이익률</span>
              </div>
              <div className="mt-1 text-2xl font-bold text-zinc-900  font-mono">
                21.9%
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-semibold bg-blue-100  text-blue-700 ">
                  <TrendingDown size={11} /> -0.9%p
                </span>
                <span className="text-klic-muted">vs Q2 FY26</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-200/80  bg-zinc-50/40 ">
              <div className="flex items-center gap-1.5 text-xs text-klic-muted">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>순이익</span>
              </div>
              <div className="mt-1 text-2xl font-bold text-zinc-900  font-mono">
                $111M
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-semibold bg-blue-100  text-blue-700 ">
                  <TrendingUp size={11} /> +3.7%
                </span>
                <span className="text-klic-muted">vs Q2 FY26</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-5 py-3 border-b border-zinc-100  bg-zinc-50/30  flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            {(['all', 'revenue', 'costs', 'profit'] as FlowCategoryFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => {
                  setRevFilter(f);
                  setSelectedRevNode(null);
                }}
                className={`px-3 py-1 rounded-full font-medium transition flex items-center gap-1.5 ${
                  revFilter === f
                    ? 'bg-klic-inverse  text-klic-on-emphasis '
                    : 'bg-white  border border-zinc-200  text-klic-muted '
                }`}
              >
                {f === 'revenue' && <span className="w-1.5 h-1.5 rounded-full bg-klic-inverse " />}
                {f === 'costs' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                {f === 'profit' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                <span>{{ all: '전체', revenue: '매출', costs: '비용', profit: '이익' }[f]}</span>
              </button>
            ))}
          </div>
          <span className="text-klic-muted text-[11px]">노드를 클릭해 흐름을 추적하세요</span>
        </div>

        {/* Revenue Sankey SVG with Live Clipped Particles */}
        <div className="p-4 sm:p-6 overflow-x-auto">
          <div className="min-w-[780px] max-w-[980px] mx-auto">
            <svg viewBox="0 0 1000 450" className="w-full h-auto select-none overflow-visible">
              <defs>
                <linearGradient id="grad-rev-neutral" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--klic-component-block-color-control-border)" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="var(--klic-component-block-color-border)" stopOpacity={0.65} />
                </linearGradient>
                <linearGradient id="grad-rev-profit" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--klic-component-block-color-border)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="var(--klic-component-block-color-accent)" stopOpacity={0.75} />
                </linearGradient>
                <linearGradient id="grad-rev-cost" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--klic-component-block-color-border)" stopOpacity={0.65} />
                  <stop offset="100%" stopColor="var(--klic-component-block-color-danger-surface)" stopOpacity={0.75} />
                </linearGradient>
                <linearGradient id="grad-gp-oi" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--klic-component-block-color-accent)" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="var(--klic-component-block-color-accent)" stopOpacity={0.75} />
                </linearGradient>
                <linearGradient id="grad-gp-opex" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--klic-component-block-color-selected)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="var(--klic-component-block-color-danger-surface)" stopOpacity={0.75} />
                </linearGradient>

                {revRibbons.map((r) => (
                  <clipPath key={`clip-rev-${r.id}`} id={`clip-rev-${r.id}`}>
                    <path d={buildRibbonPath(r)} />
                  </clipPath>
                ))}
              </defs>

              {/* Ribbons */}
              <g>
                {revRibbons.map((r) => {
                  const active = isRevRibbonActive(r);
                  const hovered = hoveredRevRibbon === r.id;
                  return (
                    <path
                      key={r.id}
                      d={buildRibbonPath(r)}
                      fill={r.fill}
                      opacity={active ? (hovered ? 0.95 : 0.8) : 0.15}
                      className="transition-opacity duration-200 cursor-pointer"
                      onMouseEnter={() => setHoveredRevRibbon(r.id)}
                      onMouseLeave={() => setHoveredRevRibbon(null)}
                      onClick={() =>
                        setSelectedRevNode(selectedRevNode === r.sourceId ? null : r.sourceId)
                      }
                    />
                  );
                })}
              </g>

              {/* Live Clipped Particles */}
              <g className="pointer-events-none">
                {revParticlesInit.map((p, idx) => {
                  const ribbon = revRibbons[p.ribbonIndex];
                  const active = isRevRibbonActive(ribbon);
                  const pt = getPointInRibbon(ribbon, p.progress, p.offsetRatio);
                  return (
                    <g
                      key={p.id}
                      clipPath={`url(#clip-rev-${ribbon.id})`}
                      opacity={active ? 1 : 0.1}
                    >
                      <circle
                        ref={(el) => {
                          revCirclesRef.current[idx] = el;
                        }}
                        cx={pt.x}
                        cy={pt.y}
                        r={p.radius}
                        fill={ribbon.particleColor}
                        opacity={p.baseOpacity}
                      />
                    </g>
                  );
                })}
              </g>

              {/* Nodes & Labels */}
              <g className="font-sans">
                {/* Col 1 */}
                <rect x={135} y={35} width={8} height={247} rx={2} fill="var(--klic-component-block-color-text)" />
                <text x={123} y={152} textAnchor="end" className="text-xs font-bold fill-zinc-900 ">
                  구독
                </text>
                <text x={123} y={168} textAnchor="end" className="text-[11px] fill-zinc-500">
                  $446M 69%
                </text>

                <rect x={135} y={298} width={8} height={84} rx={2} fill="var(--klic-component-block-color-text)" />
                <text x={123} y={335} textAnchor="end" className="text-xs font-bold fill-zinc-900 ">
                  사용량
                </text>
                <text x={123} y={351} textAnchor="end" className="text-[11px] fill-zinc-500">
                  $151M 23%
                </text>

                <rect x={135} y={396} width={8} height={29} rx={2} fill="var(--klic-component-block-color-text)" />
                <text x={123} y={406} textAnchor="end" className="text-xs font-bold fill-zinc-900 ">
                  서비스
                </text>
                <text x={123} y={422} textAnchor="end" className="text-[11px] fill-zinc-500">
                  $52M 8%
                </text>

                {/* Col 2 */}
                <rect x={350} y={55} width={8} height={360} rx={2} fill="var(--klic-component-block-color-text)" />
                <text x={368} y={228} className="text-xs font-bold fill-zinc-900 ">
                  매출
                </text>
                <text x={368} y={244} className="text-[11px] fill-zinc-500">
                  $649M
                </text>

                {/* Col 3 */}
                <rect x={560} y={55} width={8} height={263} rx={2} fill="var(--klic-component-block-color-accent)" />
                <text x={578} y={180} className="text-xs font-bold fill-zinc-900 ">
                  매출총이익
                </text>
                <text x={578} y={196} className="text-[11px] fill-zinc-500">
                  $474M 73%
                </text>

                <rect x={560} y={332} width={8} height={97} rx={2} fill="var(--klic-component-block-color-danger)" />
                <text x={578} y={376} className="text-xs font-bold fill-zinc-900 ">
                  매출원가
                </text>
                <text x={578} y={392} className="text-[11px] fill-zinc-500">
                  $175M 27%
                </text>

                {/* Col 4 */}
                <rect x={690} y={90} width={8} height={79} rx={2} fill="var(--klic-component-block-color-accent)" />
                <text x={708} y={125} className="text-xs font-bold fill-zinc-900 ">
                  영업이익
                </text>
                <text x={708} y={141} className="text-[11px] fill-zinc-500">
                  $142M 22%
                </text>

                <rect x={690} y={196} width={8} height={184} rx={2} fill="var(--klic-component-block-color-danger)" />
                <text x={708} y={284} className="text-xs font-bold fill-zinc-900 ">
                  영업비용
                </text>
                <text x={708} y={300} className="text-[11px] fill-zinc-500">
                  $332M 51%
                </text>

                {/* Col 5 */}
                <rect x={830} y={55} width={8} height={62} rx={2} fill="var(--klic-component-block-color-accent)" />
                <text x={848} y={82} className="text-xs font-bold fill-zinc-900 ">
                  순이익
                </text>
                <text x={848} y={98} className="text-[11px] fill-zinc-500">
                  $111M 17%
                </text>

                <rect x={830} y={130} width={8} height={17} rx={2} fill="var(--klic-component-block-color-danger)" />
                <text x={848} y={135} className="text-xs font-bold fill-zinc-900 ">
                  법인세
                </text>
                <text x={848} y={151} className="text-[11px] fill-zinc-500">
                  $31M 5%
                </text>

                <rect x={830} y={175} width={8} height={74} rx={2} fill="var(--klic-component-block-color-danger)" />
                <text x={848} y={208} className="text-xs font-bold fill-zinc-900 ">
                  R&D
                </text>
                <text x={848} y={224} className="text-[11px] fill-zinc-500">
                  $133M 20%
                </text>

                <rect x={830} y={262} width={8} height={83} rx={2} fill="var(--klic-component-block-color-danger)" />
                <text x={848} y={298} className="text-xs font-bold fill-zinc-900 ">
                  영업 및 마케팅
                </text>
                <text x={848} y={314} className="text-[11px] fill-zinc-500">
                  $149M 23%
                </text>

                <rect x={830} y={358} width={8} height={27} rx={2} fill="var(--klic-component-block-color-danger)" />
                <text x={848} y={368} className="text-xs font-bold fill-zinc-900 ">
                  G&A
                </text>
                <text x={848} y={384} className="text-[11px] fill-zinc-500">
                  $50M 8%
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-100  bg-zinc-50/40  flex items-center justify-between text-xs text-klic-muted">
          <span>단위: 백만 달러 • 감사받지 않은 데모 수치</span>
          <span>샘플 기준일 · 2026년 10월 9일</span>
        </div>
      </div>}
    </div>
  );
}

export const dealFlowQuarters = {
  'Q3 FY2026': {counts: [160, 104, 62, 24], averageContract: 80000},
  'Q2 FY2026': {counts: [132, 88, 48, 18], averageContract: 75000},
};

function B2BDealsFlow() {
  const [quarter, setQuarter] = useState<keyof typeof dealFlowQuarters>('Q3 FY2026');
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const sample = dealFlowQuarters[quarter], names = ['신규 기회', '검증 완료', '제안서 발송', '계약 체결'];
  const count = sample.counts, positions = [70, 330, 590, 850], factor = 240 / count[0];
  const selected = selectedStage === null ? 3 : selectedStage;
  return <section className="rounded-2xl border border-zinc-200 bg-white shadow-xs overflow-hidden" data-flow-variant="deal">
    <header className="p-6 border-b border-zinc-100 flex flex-wrap items-start justify-between gap-4">
      <div><h2 className="text-lg font-bold text-zinc-900">B2B 영업 기회 흐름</h2><p className="mt-1 text-sm text-klic-muted">유입 기회부터 수주까지 · 건수 기준의 가상 영업 코호트</p></div>
      <div className="flex items-center gap-2"><label className="text-xs text-klic-muted">분기 <select className="ml-2 border border-zinc-200 rounded-lg p-2 bg-white text-zinc-900" value={quarter} onChange={event => {setQuarter(event.target.value as keyof typeof dealFlowQuarters);setSelectedStage(null);}}>{Object.keys(dealFlowQuarters).map(value => <option key={value}>{value}</option>)}</select></label><button className="p-2 rounded-lg border border-zinc-200 text-klic-muted" aria-label="영업 흐름 선택 초기화" onClick={() => {setSelectedStage(null);setQuarter('Q3 FY2026');}}><RefreshCw size={16}/></button></div>
    </header>
    <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-zinc-100">
      {names.map((name,index) => <button key={name} aria-pressed={selectedStage === index} onClick={() => setSelectedStage(selectedStage === index ? null : index)} className={`p-5 text-left border-r border-zinc-100 ${selectedStage === index ? 'bg-blue-50' : ''}`}><span className="text-xs text-klic-muted">{name}</span><strong className="block mt-2 text-2xl font-mono text-zinc-900">{count[index]}<small className="ml-1 text-xs font-normal">건</small></strong><span className="block mt-1 text-xs text-klic-muted">{index ? `${(count[index] / count[index-1] * 100).toFixed(1)}% 이전 단계 통과` : '선택한 분기의 신규 코호트'}</span></button>)}
    </div>
    <div className="overflow-x-auto px-6 py-4"><svg viewBox="0 0 1040 470" className="w-full min-w-[720px]" role="img" aria-label={`${quarter} 영업 단계별 기회: ${count.join(', ')}건`}>
      {positions.slice(0,-1).map((x,index) => {
        const end = positions[index+1], continuing = count[index+1]*factor, lost = (count[index]-count[index+1])*factor;
        const active = selectedStage === null || selectedStage === index || selectedStage === index+1;
        return <g key={x} opacity={active ? 1 : .22}>
          <path d={`M${x+8} 92 C${x+130} 92,${end-120} 92,${end} 92 L${end} ${92+continuing} C${end-120} ${92+continuing},${x+130} ${92+continuing},${x+8} ${92+continuing}Z`} fill="var(--klic-component-block-color-accent)" fillOpacity={.17+index*.08}/>
          <path d={`M${x+8} ${92+continuing} C${x+130} ${92+continuing},${end-120} 350,${end} 350 L${end} ${350+lost} C${end-120} ${350+lost},${x+130} ${92+continuing+lost},${x+8} ${92+continuing+lost}Z`} fill="var(--klic-component-block-color-border)" fillOpacity=".65"/>
          <rect x={end} y={350} width={8} height={lost} rx={3} fill="var(--klic-component-block-color-muted)"/>
          <text x={end+15} y={343} fill="var(--klic-component-block-color-muted)" fontSize="12">미진행 {count[index]-count[index+1]}건</text>
        </g>;
      })}
      {positions.map((x,index) => <g key={x} onClick={() => setSelectedStage(selectedStage === index ? null : index)} className="cursor-pointer"><text x={x} y={32} fill="var(--klic-component-block-color-muted)" fontSize="14">{names[index]}</text><text x={x} y={65} fill="var(--klic-component-block-color-text)" fontSize="24" fontWeight="700">{count[index]}건</text><rect x={x} y={92} width={8} height={count[index]*factor} rx={3} fill="var(--klic-component-block-color-accent)"/></g>)}
    </svg></div>
    <footer className="px-6 py-4 border-t border-zinc-100 flex flex-wrap justify-between gap-3 text-xs text-klic-muted"><span>{names[selected]} <b className="text-zinc-900">{count[selected]}건</b> · 전체 기회 대비 {(count[selected]/count[0]*100).toFixed(1)}%</span><span>계약 체결액 ${(count[3]*sample.averageContract/1000000).toFixed(2)}M · 평균 계약 ${(sample.averageContract/1000).toFixed(0)}K · 예시 데이터</span></footer>
  </section>;
}
