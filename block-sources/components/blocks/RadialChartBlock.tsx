import React, { useState, useMemo } from 'react';
import {
  Calendar,
  ChevronDown,
  SlidersHorizontal,
  RefreshCw,
  MoreHorizontal,
  CreditCard,
  Landmark,
  Store,
  TrendingUp,
  TrendingDown,
  Globe,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export interface DailyInflowItem {
  day: number;
  dateLabel: string;
  settled: boolean;
  totalM: number;
  lastMonthM: number;
  deltaPercent: string;
  isPositiveDelta: boolean;
  leadSource: string;
  // Share breakdown (0..1) for settled days
  cardShare: number;
  bankShare: number;
  marketShare: number;
  treasuryShare: number;
}

export interface InflowSourceItem {
  id: 'card' | 'bank' | 'market' | 'treasury';
  name: string;
  sharePercent: number;
  subLabel: string;
  amountLabel: string;
  deltaLabel: string;
  isPositive: boolean;
  color: string;
  pastelColor: string;
}

const INFLOW_SOURCES: InflowSourceItem[] = [
  {
    id: 'card',
    name: '카드 결제',
    sharePercent: 48,
    subLabel: '48% · $379.1K 정산 대기',
    amountLabel: '$9.4M',
    deltaLabel: '-1.4%',
    isPositive: false,
    color: 'var(--klic-component-block-chart-series-1)',
    pastelColor: 'var(--klic-component-block-chart-series-1)',
  },
  {
    id: 'bank',
    name: '계좌 이체',
    sharePercent: 26,
    subLabel: '26% · $601.4K 정산 대기',
    amountLabel: '$5.1M',
    deltaLabel: '-5.6%',
    isPositive: false,
    color: 'var(--klic-component-block-chart-series-2)',
    pastelColor: 'var(--klic-component-block-chart-series-2)',
  },
  {
    id: 'market',
    name: '마켓플레이스 정산',
    sharePercent: 23,
    subLabel: '23% · $675.3K 정산 대기',
    amountLabel: '$4.6M',
    deltaLabel: '+5.1%',
    isPositive: true,
    color: 'var(--klic-component-block-chart-series-3)',
    pastelColor: 'var(--klic-component-block-chart-series-3)',
  },
  {
    id: 'treasury',
    name: '국채 및 이자 수익',
    sharePercent: 3,
    subLabel: '3% · 매월 첫 영업일',
    amountLabel: '$553.7K',
    deltaLabel: '-3.2%',
    isPositive: false,
    color: 'var(--klic-component-block-chart-series-4)',
    pastelColor: 'var(--klic-component-block-chart-series-4)',
  },
];

// 31일 일별 데이터 (1~16일: 정산 완료/진행, 17~31일: 전월 실적 가이드)
const DAILY_INFLOWS_DATA: DailyInflowItem[] = [
  {
    day: 1,
    dateLabel: '10월 1일 (목)',
    settled: true,
    totalM: 1.52,
    lastMonthM: 1.4,
    deltaPercent: '+8.5%',
    isPositiveDelta: true,
    leadSource: '국채 이자 및 카드 결제 주도',
    cardShare: 0.42,
    bankShare: 0.22,
    marketShare: 0.14,
    treasuryShare: 0.22,
  },
  {
    day: 2,
    dateLabel: '10월 2일 (금)',
    settled: true,
    totalM: 1.85,
    lastMonthM: 1.6,
    deltaPercent: '+15.6%',
    isPositiveDelta: true,
    leadSource: '마켓플레이스 정산 주도',
    cardShare: 0.36,
    bankShare: 0.28,
    marketShare: 0.36,
    treasuryShare: 0,
  },
  {
    day: 3,
    dateLabel: '10월 3일 (토)',
    settled: true,
    totalM: 0.92,
    lastMonthM: 0.98,
    deltaPercent: '-6.1%',
    isPositiveDelta: false,
    leadSource: '카드 결제 주도',
    cardShare: 0.72,
    bankShare: 0.18,
    marketShare: 0.1,
    treasuryShare: 0,
  },
  {
    day: 4,
    dateLabel: '10월 4일 (일)',
    settled: true,
    totalM: 0.88,
    lastMonthM: 0.91,
    deltaPercent: '-3.3%',
    isPositiveDelta: false,
    leadSource: '카드 결제 주도',
    cardShare: 0.76,
    bankShare: 0.14,
    marketShare: 0.1,
    treasuryShare: 0,
  },
  {
    day: 5,
    dateLabel: '10월 5일 (월)',
    settled: true,
    totalM: 1.24,
    lastMonthM: 1.18,
    deltaPercent: '+5.1%',
    isPositiveDelta: true,
    leadSource: '계좌 이체 및 카드 결제 주도',
    cardShare: 0.52,
    bankShare: 0.34,
    marketShare: 0.14,
    treasuryShare: 0,
  },
  {
    day: 6,
    dateLabel: '10월 6일 (화)',
    settled: true,
    totalM: 1.64,
    lastMonthM: 1.42,
    deltaPercent: '+15.5%',
    isPositiveDelta: true,
    leadSource: '마켓플레이스 정산 주도',
    cardShare: 0.38,
    bankShare: 0.26,
    marketShare: 0.36,
    treasuryShare: 0,
  },
  {
    day: 7,
    dateLabel: '10월 7일 (수)',
    settled: true,
    totalM: 1.19,
    lastMonthM: 1.25,
    deltaPercent: '-4.8%',
    isPositiveDelta: false,
    leadSource: '계좌 이체 주도',
    cardShare: 0.46,
    bankShare: 0.42,
    marketShare: 0.12,
    treasuryShare: 0,
  },
  {
    day: 8,
    dateLabel: '10월 8일 (목)',
    settled: true,
    totalM: 1.12,
    lastMonthM: 1.15,
    deltaPercent: '-2.6%',
    isPositiveDelta: false,
    leadSource: '카드 결제 주도',
    cardShare: 0.56,
    bankShare: 0.32,
    marketShare: 0.12,
    treasuryShare: 0,
  },
  {
    day: 9,
    dateLabel: '10월 9일 (금)',
    settled: true,
    totalM: 1.78,
    lastMonthM: 1.51,
    deltaPercent: '+17.9%',
    isPositiveDelta: true,
    leadSource: '마켓플레이스 정산 주도',
    cardShare: 0.42,
    bankShare: 0.18,
    marketShare: 0.4,
    treasuryShare: 0,
  },
  {
    day: 10,
    dateLabel: '10월 10일 (토)',
    settled: true,
    totalM: 0.95,
    lastMonthM: 0.92,
    deltaPercent: '+3.3%',
    isPositiveDelta: true,
    leadSource: '카드 결제 주도',
    cardShare: 0.78,
    bankShare: 0.12,
    marketShare: 0.1,
    treasuryShare: 0,
  },
  {
    day: 11,
    dateLabel: '10월 11일 (일)',
    settled: true,
    totalM: 0.91,
    lastMonthM: 0.89,
    deltaPercent: '+2.2%',
    isPositiveDelta: true,
    leadSource: '카드 결제 주도',
    cardShare: 0.75,
    bankShare: 0.15,
    marketShare: 0.1,
    treasuryShare: 0,
  },
  {
    day: 12,
    dateLabel: '10월 12일 (월)',
    settled: true,
    totalM: 1.08,
    lastMonthM: 1.14,
    deltaPercent: '-5.3%',
    isPositiveDelta: false,
    leadSource: '카드 결제 주도',
    cardShare: 0.62,
    bankShare: 0.26,
    marketShare: 0.12,
    treasuryShare: 0,
  },
  {
    day: 13,
    dateLabel: '10월 13일 (화)',
    settled: true,
    totalM: 1.8,
    lastMonthM: 0.47,
    deltaPercent: '+284.6%',
    isPositiveDelta: true,
    leadSource: '마켓플레이스 정산 주도',
    cardShare: 0.46,
    bankShare: 0.14,
    marketShare: 0.4,
    treasuryShare: 0,
  },
  {
    day: 14,
    dateLabel: '10월 14일 (수)',
    settled: true,
    totalM: 1.16,
    lastMonthM: 1.22,
    deltaPercent: '-4.9%',
    isPositiveDelta: false,
    leadSource: '계좌 이체 주도',
    cardShare: 0.48,
    bankShare: 0.4,
    marketShare: 0.12,
    treasuryShare: 0,
  },
  {
    day: 15,
    dateLabel: '10월 15일 (목)',
    settled: true,
    totalM: 1.22,
    lastMonthM: 1.19,
    deltaPercent: '+2.5%',
    isPositiveDelta: true,
    leadSource: '카드 결제 및 계좌 이체 주도',
    cardShare: 0.45,
    bankShare: 0.35,
    marketShare: 0.2,
    treasuryShare: 0,
  },
  {
    day: 16,
    dateLabel: '10월 16일 (금)',
    settled: true,
    totalM: 1.46,
    lastMonthM: 1.38,
    deltaPercent: '+5.8%',
    isPositiveDelta: true,
    leadSource: '마켓플레이스 정산 주도',
    cardShare: 0.4,
    bankShare: 0.22,
    marketShare: 0.38,
    treasuryShare: 0,
  },
  // 17~31일: 미도래 일자 (전월 실적 가이드 바)
  ...Array.from({ length: 15 }, (_, idx) => {
    const d = 17 + idx;
    const dow = ['토', '일', '월', '화', '수', '목', '금'][idx % 7];
    const mockLastMonth = [
      1.05, 0.92, 1.35, 1.68, 1.28, 1.42, 1.75, 0.98, 0.94, 1.38, 1.62, 1.31, 1.49, 1.82, 1.55,
    ][idx];
    return {
      day: d,
      dateLabel: `10월 ${d}일 (${dow})`,
      settled: false,
      totalM: mockLastMonth,
      lastMonthM: mockLastMonth,
      deltaPercent: '예정',
      isPositiveDelta: true,
      leadSource: `전월 동기 실적 $${mockLastMonth.toFixed(2)}M`,
      cardShare: 0.5,
      bankShare: 0.3,
      marketShare: 0.2,
      treasuryShare: 0,
    };
  }),
];

// Polar helper: angle in degrees (0 = 12 o'clock, clockwise) -> SVG (x, y)
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

// SVG Arc path helper (startDeg -> endDeg clockwise)
function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const start = polarToCartesian(cx, cy, r, endDeg);
  const end = polarToCartesian(cx, cy, r, startDeg);
  const largeArcFlag = endDeg - startDeg <= 180 ? '0' : '1';
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

// ============================================================================
// Card 2: API 상태 (API Health) 데이터 및 24-Tick 래디얼 게이지
// ============================================================================
interface ApiHealthMetric {
  id: string;
  title: string;
  badge?: string;
  gaugePercent: number;
  primaryValue: string;
  primaryUnit: string;
  deltaValue: string;
  deltaDirection: 'up-bad' | 'down-bad' | 'down-good' | 'up-neutral';
  sloText: string;
  activeColor: string;
  activeTicks: number; // out of 24
  amberTicks: number[]; // indices 0..23
  roseTicks: number[]; // indices 0..23
  rows: {
    label: string;
    timePrefix?: string;
    value: string;
    isAlert?: boolean;
  }[];
}

const API_HEALTH_METRICS: Record<'1H' | '24H' | '7D', ApiHealthMetric[]> = {
  '24H': [
    {
      id: 'availability',
      title: '가용성',
      gaugePercent: 30,
      primaryValue: '99.97',
      primaryUnit: '%',
      deltaValue: '0.01%',
      deltaDirection: 'down-bad',
      sloText: 'SLO 99.9% 버짓',
      activeColor: 'var(--klic-component-block-color-accent)',
      activeTicks: 7,
      amberTicks: [19, 20, 21],
      roseTicks: [22, 23],
      rows: [
        { label: '최근 측정치', value: '99.98%' },
        { label: '최저 기록', timePrefix: '23:00', value: '99.86%' },
        { label: 'SLO 미달 시간', value: '1시간', isAlert: true },
      ],
    },
    {
      id: 'latency',
      title: 'p95 지연 시간',
      badge: '주의',
      gaugePercent: 84,
      primaryValue: '252',
      primaryUnit: 'ms',
      deltaValue: '9%',
      deltaDirection: 'up-bad',
      sloText: 'SLO 300 ms 기준',
      activeColor: 'var(--klic-component-block-color-warning)',
      activeTicks: 20,
      amberTicks: [20, 21],
      roseTicks: [22, 23],
      rows: [
        { label: '최근 측정치', value: '121 ms' },
        { label: '최고 피크', timePrefix: '22:00', value: '286 ms' },
        { label: 'SLO 초과 시간', value: '없음' },
      ],
    },
    {
      id: 'error-rate',
      title: '에러율',
      gaugePercent: 33,
      primaryValue: '0.33',
      primaryUnit: '%',
      deltaValue: '7%',
      deltaDirection: 'down-good',
      sloText: 'SLO 1% 기준',
      activeColor: 'var(--klic-component-block-color-accent)',
      activeTicks: 8,
      amberTicks: [18, 19, 20, 21],
      roseTicks: [22, 23],
      rows: [
        { label: '최근 측정치', value: '0.27%' },
        { label: '최고 피크', timePrefix: '23:00', value: '1.38%' },
        { label: 'SLO 초과 시간', value: '1시간', isAlert: true },
      ],
    },
    {
      id: 'throughput',
      title: '처리량',
      gaugePercent: 51,
      primaryValue: '4.1K',
      primaryUnit: 'req/s',
      deltaValue: '6%',
      deltaDirection: 'up-neutral',
      sloText: '최대 용량 8K',
      activeColor: 'var(--klic-component-block-color-accent)',
      activeTicks: 12,
      amberTicks: [18, 19, 20, 21],
      roseTicks: [22, 23],
      rows: [
        { label: '최근 측정치', value: '2.6K req/s' },
        { label: '최고 피크', timePrefix: '22:00', value: '5.5K req/s' },
        { label: '용량 초과', value: '없음' },
      ],
    },
  ],
  '1H': [
    {
      id: 'availability',
      title: '가용성',
      gaugePercent: 18,
      primaryValue: '99.99',
      primaryUnit: '%',
      deltaValue: '0.02%',
      deltaDirection: 'down-good',
      sloText: 'SLO 99.9% 버짓',
      activeColor: 'var(--klic-component-block-color-accent)',
      activeTicks: 5,
      amberTicks: [],
      roseTicks: [],
      rows: [
        { label: '최근 측정치', value: '99.99%' },
        { label: '최저 기록', timePrefix: '11:40', value: '99.95%' },
        { label: 'SLO 미달 시간', value: '없음' },
      ],
    },
    {
      id: 'latency',
      title: 'p95 지연 시간',
      gaugePercent: 42,
      primaryValue: '138',
      primaryUnit: 'ms',
      deltaValue: '14%',
      deltaDirection: 'down-good',
      sloText: 'SLO 300 ms 기준',
      activeColor: 'var(--klic-component-block-color-accent)',
      activeTicks: 10,
      amberTicks: [21, 22],
      roseTicks: [],
      rows: [
        { label: '최근 측정치', value: '121 ms' },
        { label: '최고 피크', timePrefix: '11:15', value: '184 ms' },
        { label: 'SLO 초과 시간', value: '없음' },
      ],
    },
    {
      id: 'error-rate',
      title: '에러율',
      gaugePercent: 21,
      primaryValue: '0.19',
      primaryUnit: '%',
      deltaValue: '12%',
      deltaDirection: 'down-good',
      sloText: 'SLO 1% 기준',
      activeColor: 'var(--klic-component-block-color-accent)',
      activeTicks: 5,
      amberTicks: [],
      roseTicks: [],
      rows: [
        { label: '최근 측정치', value: '0.18%' },
        { label: '최고 피크', timePrefix: '11:30', value: '0.42%' },
        { label: 'SLO 초과 시간', value: '없음' },
      ],
    },
    {
      id: 'throughput',
      title: '처리량',
      gaugePercent: 58,
      primaryValue: '4.6K',
      primaryUnit: 'req/s',
      deltaValue: '11%',
      deltaDirection: 'up-neutral',
      sloText: '최대 용량 8K',
      activeColor: 'var(--klic-component-block-color-accent)',
      activeTicks: 14,
      amberTicks: [20, 21],
      roseTicks: [],
      rows: [
        { label: '최근 측정치', value: '4.6K req/s' },
        { label: '최고 피크', timePrefix: '11:50', value: '5.9K req/s' },
        { label: '용량 초과', value: '없음' },
      ],
    },
  ],
  '7D': [
    {
      id: 'availability',
      title: '가용성',
      gaugePercent: 45,
      primaryValue: '99.95',
      primaryUnit: '%',
      deltaValue: '0.02%',
      deltaDirection: 'down-bad',
      sloText: 'SLO 99.9% 버짓',
      activeColor: 'var(--klic-component-block-color-accent)',
      activeTicks: 11,
      amberTicks: [18, 19, 20],
      roseTicks: [21, 22, 23],
      rows: [
        { label: '최근 측정치', value: '99.98%' },
        { label: '최저 기록', timePrefix: '화 23:00', value: '99.81%' },
        { label: 'SLO 미달 시간', value: '3시간', isAlert: true },
      ],
    },
    {
      id: 'latency',
      title: 'p95 지연 시간',
      badge: '주의',
      gaugePercent: 78,
      primaryValue: '241',
      primaryUnit: 'ms',
      deltaValue: '6%',
      deltaDirection: 'up-bad',
      sloText: 'SLO 300 ms 기준',
      activeColor: 'var(--klic-component-block-color-warning)',
      activeTicks: 19,
      amberTicks: [19, 20, 21],
      roseTicks: [22, 23],
      rows: [
        { label: '최근 측정치', value: '121 ms' },
        { label: '최고 피크', timePrefix: '목 22:00', value: '295 ms' },
        { label: 'SLO 초과 시간', value: '없음' },
      ],
    },
    {
      id: 'error-rate',
      title: '에러율',
      gaugePercent: 38,
      primaryValue: '0.38',
      primaryUnit: '%',
      deltaValue: '4%',
      deltaDirection: 'down-good',
      sloText: 'SLO 1% 기준',
      activeColor: 'var(--klic-component-block-color-accent)',
      activeTicks: 9,
      amberTicks: [18, 19, 20, 21],
      roseTicks: [22, 23],
      rows: [
        { label: '최근 측정치', value: '0.27%' },
        { label: '최고 피크', timePrefix: '화 23:00', value: '1.65%' },
        { label: 'SLO 초과 시간', value: '2시간', isAlert: true },
      ],
    },
    {
      id: 'throughput',
      title: '처리량',
      gaugePercent: 48,
      primaryValue: '3.9K',
      primaryUnit: 'req/s',
      deltaValue: '8%',
      deltaDirection: 'up-neutral',
      sloText: '최대 용량 8K',
      activeColor: 'var(--klic-component-block-color-accent)',
      activeTicks: 11,
      amberTicks: [19, 20, 21],
      roseTicks: [22, 23],
      rows: [
        { label: '최근 측정치', value: '2.6K req/s' },
        { label: '최고 피크', timePrefix: '수 21:00', value: '6.2K req/s' },
        { label: '용량 초과', value: '없음' },
      ],
    },
  ],
};

// 24-Tick Radial Gauge Component (image_88395d85.png 1:1 매칭)
function RadialTickGauge({
  metric,
  isHovered,
}: {
  metric: ApiHealthMetric;
  isHovered: boolean;
}) {
  const totalTicks = 24;
  const cx = 46;
  const cy = 46;
  const rInner = 28;
  const rOuter = 40;

  return (
    <svg viewBox="0 0 92 92" className="w-[88px] h-[88px] shrink-0 select-none">
      {Array.from({ length: totalTicks }, (_, idx) => {
        const angleDeg = (idx / totalTicks) * 360;
        const p1 = polarToCartesian(cx, cy, rInner, angleDeg);
        const p2 = polarToCartesian(
          cx,
          cy,
          isHovered && idx < metric.activeTicks ? rOuter + 1.5 : rOuter,
          angleDeg
        );

        let strokeColor = 'var(--klic-component-block-color-border)'; // 기본 비활성 회색 틱
        if (idx < metric.activeTicks) {
          strokeColor = metric.activeColor;
        } else if (metric.roseTicks.includes(idx)) {
          strokeColor = 'var(--klic-component-block-color-danger-surface)'; // 피크/알림 구간 연분홍 틱
        } else if (metric.amberTicks.includes(idx)) {
          strokeColor = 'var(--klic-component-block-color-warning)'; // 주의 구간 연노랑 틱
        }

        return (
          <line
            key={idx}
            x1={p1.x.toFixed(2)}
            y1={p1.y.toFixed(2)}
            x2={p2.x.toFixed(2)}
            y2={p2.y.toFixed(2)}
            stroke={strokeColor}
            strokeWidth={3.1}
            strokeLinecap="round"
            className="transition-all duration-200"
          />
        );
      })}

      {/* 중앙 퍼센트 수치 */}
      <text
        x={cx}
        y={cy + 4.5}
        textAnchor="middle"
        className="text-[13.5px] font-bold font-mono fill-zinc-900 "
      >
        {metric.gaugePercent}%
      </text>
    </svg>
  );
}

export type RadialChartVariant = 'cash-inflows-radial' | 'api-health-radial' | 'competitor-feature-radar' | 'team-velocity-polar';

export interface RadialChartBlockProps {
  density?: string;
  variant?: RadialChartVariant;
}

function CashApiRadialChart({ variant }: { variant: 'cash-inflows-radial' | 'api-health-radial' }) {
  // Card 1 (현금 유입 현황) 상태
  const [selectedPeriod, setSelectedPeriod] = useState<'이번 달' | '지난달' | '최근 3개월'>('이번 달');
  const [isPeriodMenuOpen, setIsPeriodMenuOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(13); // 기본: 10월 13일 (화) $1.8M
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [hoveredSourceId, setHoveredSourceId] = useState<InflowSourceItem['id'] | null>(null);
  const [showLastMonthBars, setShowLastMonthBars] = useState<boolean>(true);

  // Card 2 (API 상태) 상태
  const [selectedRegion, setSelectedRegion] = useState<string>('미국 동부');
  const [isRegionMenuOpen, setIsRegionMenuOpen] = useState<boolean>(false);
  const [timeWindow, setTimeWindow] = useState<'1H' | '24H' | '7D'>('24H');
  const [hoveredMetricId, setHoveredMetricId] = useState<string | null>(null);

  const activeDayNumber = hoveredDay ?? selectedDay;
  const activeDayData = useMemo(() => {
    return (
      DAILY_INFLOWS_DATA.find((d) => d.day === activeDayNumber) ||
      DAILY_INFLOWS_DATA[12] // Day 13
    );
  }, [activeDayNumber]);

  const currentApiMetrics = API_HEALTH_METRICS[timeWindow];

  // Radial chart center & geometry
  const CX = 190;
  const CY = 170;
  const R_INNER_RING = 68;
  const R_BAR_START = 76;
  const R_BAR_MAX = 128;
  const R_OUTER_RING = 140;

  return (
    <div className="w-full space-y-8">
      {/* =====================================================================
          카드 1: 현금 유입 현황 (Cash Inflows — image_5df04171.png 100% 한글화)
          ===================================================================== */}
      {variant === 'cash-inflows-radial' && <div className="rounded-2xl border border-zinc-200  bg-white  shadow-xs overflow-hidden p-5 sm:p-6">
        {/* 상단 타이틀 & 액션 컨트롤 바 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-[18px] font-bold text-zinc-900  tracking-tight">
              현금 유입 현황
            </h2>
            <p className="text-[13px] text-klic-muted  mt-0.5">
              전체 유입원, {selectedPeriod}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* 기간 선택 드롭다운 */}
            <div className="relative">
              <button
                onClick={() => setIsPeriodMenuOpen((v) => !v)}
                className="inline-flex items-center justify-between gap-3 px-3.5 py-2 rounded-lg border border-zinc-200  bg-white  text-xs font-medium text-zinc-800  hover:bg-zinc-50  transition min-w-[140px]"
              >
                <span className="inline-flex items-center gap-2">
                  <Calendar size={14} className="text-klic-muted" />
                  <span>{selectedPeriod}</span>
                </span>
                <ChevronDown size={14} className="text-klic-muted" />
              </button>

              {isPeriodMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-40 rounded-xl border border-zinc-200  bg-white  shadow-lg p-1 z-30 text-xs">
                  {(['이번 달', '지난달', '최근 3개월'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => {
                        setSelectedPeriod(period);
                        setIsPeriodMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg transition ${
                        selectedPeriod === period
                          ? 'bg-zinc-100  font-semibold text-zinc-900 '
                          : 'text-klic-muted  hover:bg-zinc-50 '
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 우측 아이콘 버튼 그룹 */}
            <div className="inline-flex items-center rounded-lg border border-zinc-200  bg-white  divide-x divide-zinc-200  overflow-hidden">
              <button
                onClick={() => setShowLastMonthBars((v) => !v)}
                title="전월 실적 가이드 바 표시 전환"
                className={`p-2 transition ${
                  showLastMonthBars
                    ? 'text-zinc-800  bg-zinc-50 '
                    : 'text-klic-muted hover:text-zinc-700'
                }`}
              >
                <SlidersHorizontal size={14} />
              </button>
              <button
                onClick={() => {
                  setSelectedDay(13);
                  setHoveredDay(null);
                  setHoveredSourceId(null);
                  setShowLastMonthBars(true);
                }}
                title="선택 초기화"
                className="p-2 text-klic-muted hover:text-zinc-800  hover:bg-zinc-50  transition"
              >
                <RefreshCw size={14} />
              </button>
              <button
                title="추가 옵션"
                className="p-2 text-klic-muted hover:text-zinc-800  hover:bg-zinc-50  transition"
              >
                <MoreHorizontal size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 내부 메인 보더 컨테이너 (좌측 래디얼 다이얼 + 우측 KPI & 유입 경로 테이블) */}
        <div className="rounded-xl border border-zinc-200/90  bg-white  p-5 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 좌측: 31일 폴라 스택 바 & 멀티 아크 래디얼 차트 */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[380px]">
                <svg
                  viewBox="0 0 380 340"
                  className="w-full h-auto select-none overflow-visible"
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {/* 외곽 기본 트랙 원 (r = 136) */}
                  <circle
                    cx={CX}
                    cy={CY}
                    r={R_OUTER_RING}
                    fill="none"
                    stroke="var(--klic-component-block-color-border)"
                    strokeWidth={2}
                  />

                  {/* 동심원 점선 가이드 링 4개 */}
                  {[84, 98, 112, 126].map((r) => (
                    <circle
                      key={r}
                      cx={CX}
                      cy={CY}
                      r={r}
                      fill="none"
                      stroke="var(--klic-component-block-color-border)"
                      strokeWidth={1}
                      strokeDasharray="2 3"
                      opacity={0.75}
                    />
                  ))}

                  {/* 내부 중앙 원 (r = 62) */}
                  <circle
                    cx={CX}
                    cy={CY}
                    r={R_INNER_RING}
                    fill="none"
                    stroke="var(--klic-component-block-color-border)"
                    strokeWidth={1.5}
                  />

                  {/* 12시 방향 시작 기준 마커 (검은색 수직 바 '|') */}
                  <line
                    x1={CX}
                    y1={CY - R_OUTER_RING - 6}
                    x2={CX}
                    y2={CY - R_OUTER_RING + 6}
                    stroke="var(--klic-component-block-color-text)"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />

                  {/* 9시 방향 작은 회색 눈금 마커 */}
                  <line
                    x1={CX - R_OUTER_RING - 4}
                    y1={CY}
                    x2={CX - R_OUTER_RING + 4}
                    y2={CY}
                    stroke="var(--klic-component-block-color-border)"
                    strokeWidth={1.5}
                  />

                  {/* 외곽 날짜 번호 라벨 (1, 8, 15, 22, 29) */}
                  {[
                    { day: 1, deg: 5 },
                    { day: 8, deg: 88 },
                    { day: 15, deg: 170 },
                    { day: 22, deg: 252 },
                    { day: 29, deg: 332 },
                  ].map((lbl) => {
                    const pos = polarToCartesian(CX, CY, R_OUTER_RING + 15, lbl.deg);
                    return (
                      <text
                        key={lbl.day}
                        x={pos.x}
                        y={pos.y + 4}
                        textAnchor="middle"
                        className="text-[11px] font-mono fill-zinc-500 font-medium"
                      >
                        {lbl.day}
                      </text>
                    );
                  })}

                  {/* =========================================================
                      외곽 정산 완료 & 대기 프로그레스 아크 (Outer Progress Arcs)
                      ========================================================= */}
                  {/* 1) 카드 결제 아크 (Teal var(--klic-component-block-color-accent): 3° ~ 81°) */}
                  <path
                    d={describeArc(CX, CY, R_OUTER_RING, 3, 81)}
                    fill="none"
                    stroke="var(--klic-component-block-color-accent)"
                    strokeWidth={hoveredSourceId === 'card' ? 8.5 : 6.5}
                    strokeLinecap="round"
                    opacity={hoveredSourceId && hoveredSourceId !== 'card' ? 0.25 : 1}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredSourceId('card')}
                    onMouseLeave={() => setHoveredSourceId(null)}
                  />

                  {/* 2) 계좌 이체 아크 (Indigo var(--klic-component-block-color-accent): 86° ~ 130°) */}
                  <path
                    d={describeArc(CX, CY, R_OUTER_RING, 86, 130)}
                    fill="none"
                    stroke="var(--klic-component-block-color-accent)"
                    strokeWidth={hoveredSourceId === 'bank' ? 8.5 : 6.5}
                    strokeLinecap="round"
                    opacity={hoveredSourceId && hoveredSourceId !== 'bank' ? 0.25 : 1}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredSourceId('bank')}
                    onMouseLeave={() => setHoveredSourceId(null)}
                  />

                  {/* 3) 마켓플레이스 정산 아크 (Amber var(--klic-component-block-color-warning): 135° ~ 165°) */}
                  <path
                    d={describeArc(CX, CY, R_OUTER_RING, 135, 165)}
                    fill="none"
                    stroke="var(--klic-component-block-color-warning)"
                    strokeWidth={hoveredSourceId === 'market' ? 8.5 : 6.5}
                    strokeLinecap="round"
                    opacity={hoveredSourceId && hoveredSourceId !== 'market' ? 0.25 : 1}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredSourceId('market')}
                    onMouseLeave={() => setHoveredSourceId(null)}
                  />

                  {/* 4) 국채 및 이자 수익 포인트 (Rose var(--klic-component-block-color-danger) at 170.5°) */}
                  {(() => {
                    const pt = polarToCartesian(CX, CY, R_OUTER_RING, 170.5);
                    return (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={hoveredSourceId === 'treasury' ? 5 : 3.5}
                        fill="var(--klic-component-block-color-danger)"
                        opacity={hoveredSourceId && hoveredSourceId !== 'treasury' ? 0.25 : 1}
                        className="transition-all duration-200 cursor-pointer"
                        onMouseEnter={() => setHoveredSourceId('treasury')}
                        onMouseLeave={() => setHoveredSourceId(null)}
                      />
                    );
                  })()}

                  {/* 5) 정산 대기 아크 (Gray var(--klic-component-block-color-control-border): 176° ~ 187°) */}
                  <path
                    d={describeArc(CX, CY, R_OUTER_RING, 176, 187)}
                    fill="none"
                    stroke="var(--klic-component-block-color-control-border)"
                    strokeWidth={6.5}
                    strokeLinecap="round"
                  />

                  {/* 6) 목표 페이스 마커 (Hollow black circle 'O' at 194°) */}
                  {(() => {
                    const pacePt = polarToCartesian(CX, CY, R_OUTER_RING, 194);
                    return (
                      <circle
                        cx={pacePt.x}
                        cy={pacePt.y}
                        r={5.5}
                        fill="var(--klic-component-block-color-panel)"
                        stroke="var(--klic-component-block-color-text)"
                        strokeWidth={2.5}
                      />
                    );
                  })()}

                  {/* =========================================================
                      31개 일별 방사형 스택 바 (31 Radial Stacked Pill Bars)
                      ========================================================= */}
                  <g>
                    {DAILY_INFLOWS_DATA.map((item) => {
                      const angleDeg = ((item.day - 0.5) / 31) * 360;
                      const isDayActive = activeDayNumber === item.day;
                      const maxBarLen = R_BAR_MAX - R_BAR_START; // 54px
                      const totalLen = Math.max(
                        12,
                        Math.min(maxBarLen, (item.totalM / 1.95) * maxBarLen)
                      );

                      // 미도래 일자 (17~31일): 전월 실적 회색 바
                      if (!item.settled) {
                        if (!showLastMonthBars) return null;
                        const pStart = polarToCartesian(CX, CY, R_BAR_START, angleDeg);
                        const pEnd = polarToCartesian(CX, CY, R_BAR_START + totalLen, angleDeg);
                        return (
                          <g
                            key={item.day}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredDay(item.day)}
                            onClick={() => setSelectedDay(item.day)}
                          >
                            <line
                              x1={pStart.x}
                              y1={pStart.y}
                              x2={pEnd.x}
                              y2={pEnd.y}
                              stroke={isDayActive ? 'var(--klic-component-block-color-control-border)' : 'var(--klic-component-block-color-soft)'}
                              strokeWidth={7.5}
                              strokeLinecap="round"
                            />
                          </g>
                        );
                      }

                      // 정산 완료/진행 일자 (1~16일): 유입원별 스택 세그먼트 계산
                      const segments: {
                        id: InflowSourceItem['id'];
                        len: number;
                        vivid: string;
                        pastel: string;
                      }[] = [
                        {
                          id: 'card' as const,
                          len: totalLen * item.cardShare,
                          vivid: 'var(--klic-component-block-color-accent)',
                          pastel: 'var(--klic-component-block-color-accent)',
                        },
                        {
                          id: 'bank' as const,
                          len: totalLen * item.bankShare,
                          vivid: 'var(--klic-component-block-color-accent)',
                          pastel: 'var(--klic-component-block-color-border)',
                        },
                        {
                          id: 'market' as const,
                          len: totalLen * item.marketShare,
                          vivid: 'var(--klic-component-block-color-warning)',
                          pastel: 'var(--klic-component-block-color-warning)',
                        },
                        {
                          id: 'treasury' as const,
                          len: totalLen * item.treasuryShare,
                          vivid: 'var(--klic-component-block-color-danger)',
                          pastel: 'var(--klic-component-block-color-border)',
                        },
                      ].filter((s) => s.len > 1.5);

                      let currentR = R_BAR_START;

                      return (
                        <g
                          key={item.day}
                          data-radial-day={item.day}
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredDay(item.day)}
                          onClick={() => setSelectedDay(item.day)}
                        >
                          {/* 투명 히트박스 */}
                          {(() => {
                            const h1 = polarToCartesian(CX, CY, R_BAR_START - 4, angleDeg);
                            const h2 = polarToCartesian(CX, CY, R_BAR_MAX + 6, angleDeg);
                            return (
                              <line
                                x1={h1.x}
                                y1={h1.y}
                                x2={h2.x}
                                y2={h2.y}
                                stroke="transparent"
                                strokeWidth={12}
                              />
                            );
                          })()}

                          {segments.map((seg) => {
                            const r0 = currentR;
                            const r1 = currentR + seg.len;
                            currentR = r1;

                            const p0 = polarToCartesian(CX, CY, r0, angleDeg);
                            const p1 = polarToCartesian(CX, CY, r1, angleDeg);

                            const isSourceHighlighted = hoveredSourceId === seg.id;
                            const useVivid = isDayActive || isSourceHighlighted;
                            const segOpacity =
                              hoveredSourceId && !isSourceHighlighted ? 0.25 : 1;

                            return (
                              <line
                                key={seg.id}
                                x1={p0.x.toFixed(2)}
                                y1={p0.y.toFixed(2)}
                                x2={p1.x.toFixed(2)}
                                y2={p1.y.toFixed(2)}
                                stroke={useVivid ? seg.vivid : seg.pastel}
                                strokeWidth={isDayActive ? 8.5 : 7.5}
                                strokeLinecap="round"
                                opacity={segOpacity}
                                className="transition-all duration-150"
                              />
                            );
                          })}
                        </g>
                      );
                    })}
                  </g>

                  {/* =========================================================
                      중앙 핵심 요약 텍스트 (Center Readout inside r = 68)
                      ========================================================= */}
                  <g className="pointer-events-none">
                    <text
                      x={CX}
                      y={CY - 29}
                      textAnchor="middle"
                      className="text-[11px] font-medium fill-zinc-500"
                    >
                      {activeDayData.dateLabel}
                    </text>
                    <text
                      x={CX}
                      y={CY - 2}
                      textAnchor="middle"
                      className="text-[24px] font-bold font-mono fill-zinc-900 "
                    >
                      ${activeDayData.totalM.toFixed(1)}M
                    </text>
                    <text
                      x={CX}
                      y={CY + 15}
                      textAnchor="middle"
                      className="text-[10.5px] font-medium fill-zinc-500"
                    >
                      {activeDayData.leadSource}
                    </text>

                    {/* 하단 증감 배지 */}
                    <g transform={`translate(${CX - 33}, ${CY + 23})`}>
                      <rect
                        x={0}
                        y={0}
                        width={66}
                        height={18}
                        rx={5}
                        fill={activeDayData.isPositiveDelta ? 'var(--klic-component-block-color-soft)' : 'var(--klic-component-block-color-soft)'}
                        stroke={activeDayData.isPositiveDelta ? 'var(--klic-component-block-color-selected)' : 'var(--klic-component-block-color-border)'}
                        strokeWidth={1}
                      />
                      <text
                        x={33}
                        y={12.5}
                        textAnchor="middle"
                        className={`text-[10px] font-mono font-bold ${
                          activeDayData.isPositiveDelta ? 'fill-blue-700' : 'fill-blue-700'
                        }`}
                      >
                        {activeDayData.isPositiveDelta ? '↑ ' : '↓ '}
                        {activeDayData.deltaPercent}
                      </text>
                    </g>
                  </g>
                </svg>
              </div>

              {/* 좌측 하단 범례 (2줄 구성, image_5df04171.png와 동일) */}
              <div className="mt-2 flex flex-col items-center gap-2 text-[11.5px] text-klic-muted ">
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-flex items-center">
                      <span className="w-1.5 h-1 rounded-l-full bg-blue-600" />
                      <span className="w-1.5 h-1 bg-blue-500" />
                      <span className="w-1.5 h-1 rounded-r-full bg-amber-500" />
                    </span>
                    <span>정산 완료 $18M</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-1 rounded-full bg-zinc-400" />
                    <span>정산 대기 $1.7M</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-zinc-900  bg-white " />
                    <span>목표 페이스 $20.1M, -$479.9K</span>
                  </span>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-klic-muted">
                  <span className="w-1.5 h-3 rounded-full bg-zinc-300 " />
                  <span>전월 실적</span>
                </div>
              </div>
            </div>

            {/* 우측: 3대 요약 지표 + 유입 경로(Source) 상세 테이블 */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              {/* 상단 3개 KPI 컬럼 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 sm:divide-x divide-zinc-200/80  pb-6 border-b border-zinc-100 ">
                <div className="sm:pr-6">
                  <div className="text-xs font-medium text-klic-muted">월말 예상치</div>
                  <div className="mt-1.5 text-2xl sm:text-[26px] font-bold font-mono text-zinc-900 ">
                    $39M
                  </div>
                  <div className="mt-1 text-xs text-klic-muted">목표 대비 98%</div>
                </div>

                <div className="sm:px-6">
                  <div className="text-xs font-medium text-klic-muted">일일 필요 유입액</div>
                  <div className="mt-1.5 text-2xl sm:text-[26px] font-bold font-mono text-zinc-900 ">
                    $1.32M
                  </div>
                  <div className="mt-1 text-xs text-klic-muted">현재 일평균 $1.26M</div>
                </div>

                <div className="sm:pl-6">
                  <div className="text-xs font-medium text-klic-muted">정산 대기 중</div>
                  <div className="mt-1.5 text-2xl sm:text-[26px] font-bold font-mono text-zinc-900 ">
                    $1.7M
                  </div>
                  <div className="mt-1 text-xs text-klic-muted">3영업일 이내 입금</div>
                </div>
              </div>

              {/* 유입 경로(Source) 리스트 헤더 */}
              <div className="pt-5">
                <div className="flex items-center justify-between text-xs font-medium text-klic-muted pb-2">
                  <span>유입 경로</span>
                  <span>전월 대비 유입액</span>
                </div>

                <div className="divide-y divide-zinc-100 ">
                  {INFLOW_SOURCES.map((src) => {
                    const isHovered = hoveredSourceId === src.id;
                    return (
                      <div
                        key={src.id}
                        onMouseEnter={() => setHoveredSourceId(src.id)}
                        onMouseLeave={() => setHoveredSourceId(null)}
                        className={`py-3.5 flex items-center justify-between gap-4 transition rounded-lg px-2 -mx-2 cursor-pointer ${
                          isHovered ? 'bg-zinc-50 ' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* 좌측 아이콘 박스 */}
                          <div className="w-9 h-9 rounded-lg border border-zinc-200/80  bg-zinc-50/70  flex items-center justify-center shrink-0">
                            {src.id === 'card' && (
                              <CreditCard size={16} className="text-blue-600" />
                            )}
                            {src.id === 'bank' && (
                              <Landmark size={16} className="text-blue-500" />
                            )}
                            {src.id === 'market' && (
                              <Store size={16} className="text-amber-500" />
                            )}
                            {src.id === 'treasury' && (
                              <TrendingUp size={16} className="text-blue-500" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="text-[14px] font-bold text-zinc-900  truncate">
                              {src.name}
                            </div>
                            <div className="text-xs text-klic-muted mt-0.5">{src.subLabel}</div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0">
                          <div className="text-[14px] font-bold font-mono text-zinc-900 ">
                            {src.amountLabel}
                          </div>
                          <span
                            className={`mt-1 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold ${
                              src.isPositive
                                ? 'bg-blue-50  text-blue-700 '
                                : 'bg-blue-50  text-blue-700 '
                            }`}
                          >
                            {src.isPositive ? (
                              <ArrowUp size={11} className="shrink-0" />
                            ) : (
                              <ArrowDown size={11} className="shrink-0" />
                            )}
                            {src.deltaLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 하단 전체 합계 행 */}
                <div className="pt-4 mt-1 border-t border-zinc-200/80  flex items-center justify-between">
                  <span className="text-[14px] font-bold text-zinc-900 ">
                    전체 유입 합계
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[15px] font-bold font-mono text-zinc-900 ">
                      $19.7M
                    </span>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-blue-50  text-blue-700 ">
                      <ArrowDown size={11} />
                      -1.1%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 카드 1 푸터 */}
        <div className="mt-4 flex items-center justify-between text-xs text-klic-muted">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>2분 전 업데이트</span>
            <span className="text-klic-muted ">•</span>
            <span>31일 중 16일 경과</span>
          </div>
          <span>샘플 데이터 · USD</span>
        </div>
      </div>}

      {/* =====================================================================
          카드 2: API 상태 및 가용성 (API Health — image_88395d85.png 100% 한글화)
          ===================================================================== */}
      {variant === 'api-health-radial' && <div className="rounded-2xl border border-zinc-200  bg-white  shadow-xs overflow-hidden">
        {/* 상단 헤더 */}
        <div className="px-6 py-5 border-b border-zinc-100  flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-[18px] font-bold text-zinc-900  tracking-tight">
                API 상태
              </h2>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50  text-amber-800  border border-amber-200/80  whitespace-nowrap">
                주의 1건
              </span>
            </div>
            <p className="text-[13px] text-klic-muted  mt-1">
              게이트웨이 모니터링 샘플 · 가용성, 지연 시간, 오류, 처리량
            </p>
          </div>

          {/* 우측 컨트롤: 리전 선택 + 시간 범위 토글 + 새로고침 */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 리전 선택 드롭다운 */}
            <div className="relative">
              <button
                onClick={() => setIsRegionMenuOpen((v) => !v)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200  bg-white  text-xs font-medium text-zinc-800  hover:bg-zinc-50 transition whitespace-nowrap"
              >
                <Globe size={14} className="text-klic-muted" />
                <span>{selectedRegion}</span>
                <ChevronDown size={13} className="text-klic-muted" />
              </button>

              {isRegionMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-44 rounded-xl border border-zinc-200  bg-white  shadow-lg p-1 z-30 text-xs">
                  {['미국 동부', '아시아 태평양 (서울)', '유럽 서부 (프랑크푸르트)'].map(
                    (region) => (
                    <button
                      key={region}
                      onClick={() => {
                        setSelectedRegion(region);
                        setIsRegionMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg transition ${
                        selectedRegion === region
                          ? 'bg-zinc-100  font-semibold text-zinc-900 '
                          : 'text-klic-muted  hover:bg-zinc-50 '
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 1시간 / 24시간 / 7일 세그먼트 토글 */}
            <div className="inline-flex items-center rounded-lg border border-zinc-200  bg-zinc-50  p-0.5 text-xs">
              {(
                [
                  { id: '1H', label: '1시간' },
                  { id: '24H', label: '24시간' },
                  { id: '7D', label: '7일' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTimeWindow(tab.id)}
                  className={`px-2.5 py-1 rounded-md font-medium transition whitespace-nowrap ${
                    timeWindow === tab.id
                      ? 'bg-white  text-zinc-900  font-semibold shadow-2xs border border-zinc-200/60 '
                      : 'text-klic-muted hover:text-zinc-800 '
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 새로고침 & 더보기 */}
            <div className="inline-flex items-center rounded-lg border border-zinc-200  bg-white  divide-x divide-zinc-200  overflow-hidden">
              <button
                onClick={() => setTimeWindow('24H')}
                title="새로고침"
                className="p-2 text-klic-muted hover:text-zinc-800  hover:bg-zinc-50 transition"
              >
                <RefreshCw size={14} />
              </button>
              <button
                title="추가 메뉴"
                className="p-2 text-klic-muted hover:text-zinc-800  hover:bg-zinc-50 transition"
              >
                <MoreHorizontal size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 4열 24-Tick 래디얼 게이지 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-100 ">
          {currentApiMetrics.map((metric) => {
            const isHovered = hoveredMetricId === metric.id;

            return (
              <div
                key={metric.id}
                onMouseEnter={() => setHoveredMetricId(metric.id)}
                onMouseLeave={() => setHoveredMetricId(null)}
                className={`p-5 sm:p-6 transition ${
                  isHovered ? 'bg-zinc-50/50 ' : ''
                }`}
              >
                {/* 컬럼 상단 타이틀 & 주의 배지 */}
                <div className="flex items-center justify-between gap-2 h-6">
                  <span className="text-[14px] font-medium text-klic-muted ">
                    {metric.title}
                  </span>
                  {metric.badge && (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50  text-amber-800  border border-amber-200/80  whitespace-nowrap">
                      {metric.badge}
                    </span>
                  )}
                </div>

                {/* 중앙: 24-Tick 래디얼 게이지 + 우측 메인 수치 */}
                <div className="mt-4 flex items-center gap-4">
                  <RadialTickGauge metric={metric} isHovered={isHovered} />

                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-[28px] font-bold text-zinc-900  leading-none tracking-tight">
                        {metric.primaryValue}
                      </span>
                      <span className="text-[15px] text-klic-muted font-medium">
                        {metric.primaryUnit}
                      </span>
                    </div>

                    {/* 이전 기간 대비 증감 */}
                    <div className="mt-2 flex items-center gap-1 text-xs whitespace-nowrap">
                      {metric.deltaDirection === 'down-bad' && (
                        <span className="inline-flex items-center gap-0.5 font-mono font-semibold text-blue-600">
                          <ArrowDownRight size={13} />
                          {metric.deltaValue}
                        </span>
                      )}
                      {metric.deltaDirection === 'up-bad' && (
                        <span className="inline-flex items-center gap-0.5 font-mono font-semibold text-blue-600">
                          <ArrowUpRight size={13} />
                          {metric.deltaValue}
                        </span>
                      )}
                      {metric.deltaDirection === 'down-good' && (
                        <span className="inline-flex items-center gap-0.5 font-mono font-semibold text-blue-600">
                          <ArrowDownRight size={13} />
                          {metric.deltaValue}
                        </span>
                      )}
                      {metric.deltaDirection === 'up-neutral' && (
                        <span className="inline-flex items-center gap-0.5 font-mono font-semibold text-klic-muted ">
                          <ArrowUpRight size={13} />
                          {metric.deltaValue}
                        </span>
                      )}
                      <span className="text-klic-muted">이전 기간 대비</span>
                    </div>

                    <div className="mt-1 text-xs text-klic-muted">{metric.sloText}</div>
                  </div>
                </div>

                {/* 하단 3행 요약 리스트 (최근 측정치 / 최저·피크 / SLO 초과) */}
                <div className="mt-5 pt-4 border-t border-zinc-100  space-y-2.5 text-xs">
                  {metric.rows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-2">
                      <span className="text-klic-muted">{row.label}</span>
                      <div className="flex items-center gap-1.5 font-mono">
                        {row.timePrefix && (
                          <>
                            <span className="text-klic-muted">{row.timePrefix}</span>
                            <span className="text-klic-muted ">•</span>
                          </>
                        )}
                        <span
                          className={`font-semibold ${
                            row.isAlert
                              ? 'text-blue-600 '
                              : 'text-zinc-900 '
                          }`}
                        >
                          {row.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <p className="px-6 py-3 border-t border-zinc-100 text-xs text-klic-muted">샘플 데이터 · 게이지는 각 SLO 또는 최대 용량 대비 사용 비율입니다.</p>
      </div>}
    </div>
  );
}

const FEATURE_AXES = ['자동화', '분석', '협업', '보안', '연동', '확장성'];
const FEATURE_SERIES = [
  { id: 'klic', name: "KLIC 데모", color: 'var(--klic-component-block-chart-series-1)', scores: [4.6, 4.2, 3.9, 4.7, 4.5, 4.3] },
  { id: 'atlas', name: "Atlas 데모", color: 'var(--klic-component-block-chart-series-2)', scores: [3.8, 4.6, 4.1, 3.2, 3.7, 4.0] },
  { id: 'orbit', name: "Orbit 데모", color: 'var(--klic-component-block-chart-series-3)', scores: [3.4, 3.5, 4.8, 4.2, 3.2, 3.8] },
];

function FeatureRadarChart() {
  const [visible, setVisible] = useState(['klic', 'atlas', 'orbit']);
  const [activeAxis, setActiveAxis] = useState(0);
  const cx = 280, cy = 245, radius = 160;
  const point = (axis: number, score: number) => polarToCartesian(cx, cy, radius * score / 5, axis * 60);
  const polygon = (scores: number[]) => scores.map((score, axis) => { const p = point(axis, score); return `${p.x},${p.y}`; }).join(' ');
  const activeSeries = FEATURE_SERIES.filter(series => visible.includes(series.id));
  return <section className="rounded-2xl border border-zinc-200 bg-white shadow-xs overflow-hidden" data-chart-variant="competitor-feature-radar">
    <header className="px-6 py-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div><h2 className="text-[18px] font-bold text-zinc-900">제품 기능 비교</h2><p className="text-[13px] text-klic-muted mt-1">가상 제품 3종 · 기능 충족도 0–5점</p></div>
      <span className="px-2.5 py-1 rounded-md border border-blue-200 bg-blue-50 text-blue-700 text-xs font-medium">기능 레이더</span>
    </header>
    <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
      <div className="lg:col-span-2">
        <svg viewBox="0 0 560 480" className="w-full max-w-[620px] mx-auto" role="img" aria-label="여섯 가지 기능의 0에서 5점 레이더 비교. 아래 표에서 각 점수를 확인할 수 있습니다.">
          {[1, 2, 3, 4, 5].map(score => <g key={score}><polygon points={polygon(FEATURE_AXES.map(() => score))} fill={score === 5 ? 'var(--klic-component-block-color-soft)' : 'none'} fillOpacity={score === 5 ? .35 : 0} stroke="var(--klic-component-block-color-border)" /><text x={cx + 7} y={cy - radius * score / 5 + 4} fontSize="10" fill="var(--klic-component-block-color-muted)">{score}</text></g>)}
          {FEATURE_AXES.map((label, index) => { const end = point(index, 5), text = point(index, 6.1); return <g key={label}><line x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="var(--klic-component-block-color-border)" /><text x={text.x} y={text.y + 4} textAnchor="middle" fontSize="13" fontWeight={activeAxis === index ? 700 : 400} fill={activeAxis === index ? 'var(--klic-component-block-color-accent)' : 'var(--klic-component-block-color-muted)'}>{label}</text></g>; })}
          {activeSeries.map(series => <g key={series.id}><polygon points={polygon(series.scores)} fill={series.color} fillOpacity=".1" stroke={series.color} strokeWidth="2.5" />{series.scores.map((score, index) => { const p = point(index, score); return <circle key={index} cx={p.x} cy={p.y} r={activeAxis === index ? 5 : 3.5} fill={series.color} stroke="var(--klic-component-block-color-panel)" strokeWidth="1.5" onMouseEnter={() => setActiveAxis(index)}><title>{`${series.name} · ${FEATURE_AXES[index]} ${score.toFixed(1)}점`}</title></circle>; })}</g>)}
        </svg>
      </div>
      <aside className="space-y-5">
        <div><p className="text-xs text-klic-muted mb-3">표시할 제품</p><div className="space-y-2">{FEATURE_SERIES.map(series => <button key={series.id} aria-pressed={visible.includes(series.id)} onClick={() => setVisible(current => current.includes(series.id) ? current.length > 1 ? current.filter(id => id !== series.id) : current : [...current, series.id])} className={`w-full flex items-center gap-2.5 p-3 rounded-lg border text-sm text-left ${visible.includes(series.id) ? 'border-blue-200 bg-blue-50 text-zinc-900' : 'border-zinc-200 text-klic-muted'}`}><span className="w-2.5 h-2.5 rounded-full" style={{ background: series.color }} />{series.name}<span className="ml-auto text-xs">{visible.includes(series.id) ? '표시 중' : '숨김'}</span></button>)}</div></div>
        <div className="rounded-xl border border-zinc-200 p-4"><p className="text-xs text-klic-muted">선택한 비교 항목</p><h3 className="text-lg font-semibold mt-1 mb-4">{FEATURE_AXES[activeAxis]}</h3>{activeSeries.map(series => <div key={series.id} className="flex justify-between text-sm mt-2"><span className="text-klic-muted">{series.name}</span><strong className="font-mono" style={{ color: series.color }}>{series.scores[activeAxis].toFixed(1)} <span className="font-normal text-klic-muted">/ 5</span></strong></div>)}</div>
      </aside>
    </div>
    <div className="overflow-x-auto border-t border-zinc-100"><table className="w-full text-sm text-left"><thead className="bg-zinc-50 text-klic-muted"><tr><th className="px-6 py-3 font-medium">기능 항목</th>{activeSeries.map(series => <th key={series.id} className="px-4 py-3 font-medium text-right">{series.name}</th>)}</tr></thead><tbody>{FEATURE_AXES.map((axis, index) => <tr key={axis} className={index === activeAxis ? 'bg-blue-50/60' : ''}><th className="px-6 py-2.5 font-medium"><button onClick={() => setActiveAxis(index)} aria-pressed={index === activeAxis} className="text-left hover:underline">{axis}</button></th>{activeSeries.map(series => <td key={series.id} className="px-4 py-2.5 text-right font-mono">{series.scores[index].toFixed(1)}</td>)}</tr>)}</tbody></table></div>
    <footer className="px-6 py-3 border-t border-zinc-100 text-xs text-klic-muted">샘플 평가 · 가상 제품의 예시 점수이며 실제 경쟁사에 대한 평가가 아닙니다.</footer>
  </section>;
}

const VELOCITY_TEAMS = [
  { id: 'platform', name: '플랫폼 팀', points: [28, 34, 31, 40, 38, 44, 42, 47] },
  { id: 'product', name: '프로덕트 팀', points: [22, 27, 25, 31, 35, 32, 36, 39] },
  { id: 'data', name: '데이터 팀', points: [18, 21, 24, 22, 28, 26, 30, 33] },
];
function polarSector(cx: number, cy: number, inner: number, outer: number, start: number, end: number) {
  const a = polarToCartesian(cx, cy, outer, start), b = polarToCartesian(cx, cy, outer, end), c = polarToCartesian(cx, cy, inner, end), d = polarToCartesian(cx, cy, inner, start);
  return `M ${a.x} ${a.y} A ${outer} ${outer} 0 0 1 ${b.x} ${b.y} L ${c.x} ${c.y} A ${inner} ${inner} 0 0 0 ${d.x} ${d.y} Z`;
}
function TeamVelocityPolarChart() {
  const [teamId, setTeamId] = useState('platform');
  const [selectedSprint, setSelectedSprint] = useState(7);
  const [hoveredSprint, setHoveredSprint] = useState<number | null>(null);
  const team = VELOCITY_TEAMS.find(item => item.id === teamId)!;
  const activeIndex = hoveredSprint ?? selectedSprint;
  const average = team.points.reduce((sum, points) => sum + points, 0) / team.points.length;
  const cx = 260, cy = 245, inner = 52, outer = 178;
  const radius = (points: number) => Math.sqrt(inner * inner + (outer * outer - inner * inner) * points / 60);
  return <section className="rounded-2xl border border-zinc-200 bg-white shadow-xs overflow-hidden" data-chart-variant="team-velocity-polar">
    <header className="px-6 py-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h2 className="text-[18px] font-bold text-zinc-900">팀 스프린트 속도</h2><p className="text-[13px] text-klic-muted mt-1">스프린트 17–24 · 완료한 스토리 포인트</p></div><span className="px-2.5 py-1 rounded-md border border-blue-200 bg-blue-50 text-blue-700 text-xs font-medium">작업 속도 극좌표 차트</span></header>
    <div className="px-6 pt-5 flex flex-wrap gap-2" role="group" aria-label="팀 선택">{VELOCITY_TEAMS.map(item => <button key={item.id} aria-pressed={teamId === item.id} onClick={() => { setTeamId(item.id); setHoveredSprint(null); }} className={`px-3 py-2 rounded-lg border text-sm ${teamId === item.id ? 'border-blue-200 bg-blue-50 text-blue-700 font-semibold' : 'border-zinc-200 text-klic-muted'}`}>{item.name}</button>)}</div>
    <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
      <div className="lg:col-span-2"><svg viewBox="0 0 520 490" className="w-full max-w-[600px] mx-auto" role="img" aria-label={`${team.name}의 8개 스프린트 완료 포인트. 섹터 면적은 완료 포인트에 비례합니다.`} onMouseLeave={() => setHoveredSprint(null)}>
        {[20, 40, 60].map(points => <g key={points}><circle cx={cx} cy={cy} r={radius(points)} fill="none" stroke="var(--klic-component-block-color-border)" strokeDasharray="3 4" /><text x={cx + 7} y={cy - radius(points) - 5} fontSize="10" fill="var(--klic-component-block-color-muted)">{points} SP</text></g>)}
        {team.points.map((points, index) => { const angle = index * 45, label = polarToCartesian(cx, cy, outer + 28, angle + 22.5), selected = index === activeIndex; return <g key={index}><path d={polarSector(cx, cy, inner, radius(points), angle + 2, angle + 43)} fill={`var(--klic-component-block-chart-series-${index % 4 + 1})`} fillOpacity={selected ? 1 : .65} stroke={selected ? 'var(--klic-component-block-color-accent)' : 'var(--klic-component-block-color-panel)'} strokeWidth={selected ? 2.5 : 1} onMouseEnter={() => setHoveredSprint(index)} onClick={() => setSelectedSprint(index)} className="cursor-pointer"><title>{`스프린트 ${index + 17}: ${points} SP`}</title></path><text x={label.x} y={label.y + 4} textAnchor="middle" fontSize="12" fill={selected ? 'var(--klic-component-block-color-accent)' : 'var(--klic-component-block-color-muted)'} fontWeight={selected ? 700 : 400}>S{index + 17}</text></g>; })}
        <text x={cx} y={cy - 11} textAnchor="middle" fontSize="11" fill="var(--klic-component-block-color-muted)">스프린트 {activeIndex + 17}</text><text x={cx} y={cy + 15} textAnchor="middle" fontSize="27" fontWeight="700" fill="var(--klic-component-block-color-text)">{team.points[activeIndex]}<tspan fontSize="12" fontWeight="400"> SP</tspan></text>
      </svg></div>
      <aside className="space-y-4"><div className="rounded-xl border border-zinc-200 p-5"><p className="text-xs text-klic-muted">{team.name} · 최근 8개 평균</p><p className="text-3xl font-bold font-mono mt-2">{average.toFixed(1)} <span className="text-sm font-normal text-klic-muted">SP</span></p><p className="text-xs text-klic-muted mt-3">완료 포인트 합계 {team.points.reduce((sum, points) => sum + points, 0)} SP</p></div><div className="rounded-xl border border-blue-200 bg-blue-50 p-5"><p className="text-xs text-klic-muted">선택한 스프린트 {activeIndex + 17}</p><p className="text-2xl font-bold font-mono text-blue-700 mt-2">{team.points[activeIndex]} SP</p><p className="text-xs text-klic-muted mt-3">평균 대비 {team.points[activeIndex] >= average ? '+' : ''}{(team.points[activeIndex] - average).toFixed(1)} SP</p></div><p className="text-xs text-klic-muted leading-relaxed">섹터 면적은 완료 포인트에 비례합니다. 팀마다 산정 기준이 다를 수 있으므로 같은 팀의 추세를 살펴보세요.</p></aside>
    </div>
    <div className="px-6 pb-5 grid grid-cols-4 sm:grid-cols-8 gap-2" role="group" aria-label="스프린트 선택">{team.points.map((points, index) => <button key={index} onClick={() => setSelectedSprint(index)} aria-pressed={selectedSprint === index} className={`p-2.5 rounded-lg border text-center ${selectedSprint === index ? 'border-blue-200 bg-blue-50' : 'border-zinc-200'}`}><span className="text-xs text-klic-muted block">S{index + 17}</span><strong className="block font-mono text-sm mt-1">{points} SP</strong></button>)}</div>
    <footer className="px-6 py-3 border-t border-zinc-100 text-xs text-klic-muted">샘플 데이터 · 2주 스프린트 · 미완료 항목의 포인트는 포함하지 않습니다.</footer>
  </section>;
}

export function RadialChartBlock({ variant = 'cash-inflows-radial' }: RadialChartBlockProps) {
  if (variant === 'competitor-feature-radar') return <FeatureRadarChart />;
  if (variant === 'team-velocity-polar') return <TeamVelocityPolarChart />;
  return <CashApiRadialChart variant={variant} />;
}
