import React, { useState, useMemo, useRef } from 'react';
import {
  TrendingDown,
  XCircle,
  ChevronDown,
  Bell,
  BellOff,
  MoreHorizontal,
  RotateCcw,
  Check,
} from 'lucide-react';

interface ErrorBudgetBurnBlockProps {
  density?: 'compact' | 'normal' | 'relaxed';
}

interface DailyBudgetPoint {
  index: number;
  dateLabel: string; // e.g., '9월 1일'
  shortDay: string; // e.g., '1'
  axisBadge?: 'pill-start' | 'pill-end' | 'circle-gray' | 'circle-incident' | 'circle-today' | 'tick';
  axisText?: string;
  /** 남은 버짓 (%). 음수이면 초과(Over budget) */
  budgetRemaining: number;
  /** 당일 소진량 (%) */
  dailySpend: number;
  /** 균등 소진 기준선 (%) - 9월 1일 100% -> 9월 29일 0% */
  evenBurn: number | null;
  /** 달성 가용성 (%) */
  attainedSlo: string;
  /** 1시간 소진율 배수 */
  burn1h: string;
  /** 6시간 소진율 배수 */
  burn6h: string;
  /** 일간 소진 속도 (%) */
  dailyPace: string;
  /** 상태 구분 */
  state: 'healthy' | 'warn' | 'over' | 'forecast';
  /** 인시던트 발생 여부 */
  isIncident?: boolean;
  incidentTitle?: string;
  incidentSummary?: string;
  isToday?: boolean;
}

interface SliTargetOption {
  id: string;
  name: string;
  engName: string;
  targetText: string;
  statusLabel: string;
  statusTone: 'exhausted' | 'warning' | 'healthy';
  deploysFrozen: boolean;
  dotColor: string;
  defaultSummary: {
    budgetMain: string;
    budgetSuffix: string;
    budgetSub: string;
    attained: string;
    target: string;
    burn1h: string;
    burn6h: string;
    dailyPace: string;
    evenPace: string;
    ranOutDate: string;
    ranOutSub: string;
  };
  points: DailyBudgetPoint[];
}

// 1. 원장 쓰기 성공률 (Ledger write success) - 원본 이미지와 100% 동일한 데이터셋
const LEDGER_WRITE_POINTS: DailyBudgetPoint[] = [
  { index: 0, dateLabel: '9월 1일', shortDay: '1', axisBadge: 'pill-start', axisText: '9월 1일', budgetRemaining: 98.2, dailySpend: 1.8, evenBurn: 96.6, attainedSlo: '99.999%', burn1h: '0.04×', burn6h: '0.05× over 6h', dailyPace: '1.8%', state: 'healthy' },
  { index: 1, dateLabel: '9월 2일', shortDay: '2', axisBadge: 'tick', budgetRemaining: 96.8, dailySpend: 1.4, evenBurn: 93.1, attainedSlo: '99.999%', burn1h: '0.04×', burn6h: '0.05× over 6h', dailyPace: '1.6%', state: 'healthy' },
  { index: 2, dateLabel: '9월 3일', shortDay: '3', axisBadge: 'tick', budgetRemaining: 95.4, dailySpend: 1.4, evenBurn: 89.7, attainedSlo: '99.998%', burn1h: '0.05×', burn6h: '0.06× over 6h', dailyPace: '1.5%', state: 'healthy' },
  { index: 3, dateLabel: '9월 4일', shortDay: '4', axisBadge: 'tick', budgetRemaining: 94.1, dailySpend: 1.3, evenBurn: 86.2, attainedSlo: '99.998%', burn1h: '0.05×', burn6h: '0.06× over 6h', dailyPace: '1.5%', state: 'healthy' },
  { index: 4, dateLabel: '9월 5일', shortDay: '5', axisBadge: 'tick', budgetRemaining: 92.8, dailySpend: 1.3, evenBurn: 82.8, attainedSlo: '99.998%', burn1h: '0.05×', burn6h: '0.06× over 6h', dailyPace: '1.4%', state: 'healthy' },
  { index: 5, dateLabel: '9월 6일', shortDay: '6', axisBadge: 'tick', budgetRemaining: 91.5, dailySpend: 1.3, evenBurn: 79.3, attainedSlo: '99.998%', burn1h: '0.06×', burn6h: '0.07× over 6h', dailyPace: '1.4%', state: 'healthy' },
  { index: 6, dateLabel: '9월 7일', shortDay: '7', axisBadge: 'tick', budgetRemaining: 90.2, dailySpend: 1.3, evenBurn: 75.9, attainedSlo: '99.997%', burn1h: '0.06×', burn6h: '0.07× over 6h', dailyPace: '1.4%', state: 'healthy' },
  { index: 7, dateLabel: '9월 8일', shortDay: '8', axisBadge: 'circle-gray', axisText: '8', budgetRemaining: 88.9, dailySpend: 1.3, evenBurn: 72.4, attainedSlo: '99.997%', burn1h: '0.06×', burn6h: '0.07× over 6h', dailyPace: '1.4%', state: 'healthy' },
  { index: 8, dateLabel: '9월 9일', shortDay: '9', axisBadge: 'tick', budgetRemaining: 87.6, dailySpend: 1.3, evenBurn: 69.0, attainedSlo: '99.997%', burn1h: '0.06×', burn6h: '0.08× over 6h', dailyPace: '1.4%', state: 'healthy' },
  { index: 9, dateLabel: '9월 10일', shortDay: '10', axisBadge: 'tick', budgetRemaining: 86.2, dailySpend: 1.4, evenBurn: 65.5, attainedSlo: '99.997%', burn1h: '0.07×', burn6h: '0.08× over 6h', dailyPace: '1.4%', state: 'healthy' },
  { index: 10, dateLabel: '9월 11일', shortDay: '11', axisBadge: 'tick', budgetRemaining: 84.8, dailySpend: 1.4, evenBurn: 62.1, attainedSlo: '99.996%', burn1h: '0.07×', burn6h: '0.08× over 6h', dailyPace: '1.4%', state: 'healthy' },
  { index: 11, dateLabel: '9월 12일', shortDay: '12', axisBadge: 'tick', budgetRemaining: 83.5, dailySpend: 1.3, evenBurn: 58.6, attainedSlo: '99.996%', burn1h: '0.07×', burn6h: '0.08× over 6h', dailyPace: '1.4%', state: 'healthy' },
  { index: 12, dateLabel: '9월 13일', shortDay: '13', axisBadge: 'tick', budgetRemaining: 82.1, dailySpend: 1.4, evenBurn: 55.2, attainedSlo: '99.996%', burn1h: '0.08×', burn6h: '0.09× over 6h', dailyPace: '1.4%', state: 'healthy' },
  { index: 13, dateLabel: '9월 14일', shortDay: '14', axisBadge: 'tick', budgetRemaining: 80.7, dailySpend: 1.4, evenBurn: 51.7, attainedSlo: '99.996%', burn1h: '0.08×', burn6h: '0.09× over 6h', dailyPace: '1.4%', state: 'healthy' },
  { index: 14, dateLabel: '9월 15일', shortDay: '15', axisBadge: 'circle-gray', axisText: '15', budgetRemaining: 79.3, dailySpend: 1.4, evenBurn: 48.3, attainedSlo: '99.995%', burn1h: '0.08×', burn6h: '0.09× over 6h', dailyPace: '1.4%', state: 'healthy' },
  { index: 15, dateLabel: '9월 16일', shortDay: '16', axisBadge: 'tick', budgetRemaining: 77.9, dailySpend: 1.4, evenBurn: 44.8, attainedSlo: '99.995%', burn1h: '0.08×', burn6h: '0.10× over 6h', dailyPace: '1.4%', state: 'healthy' },
  { index: 16, dateLabel: '9월 17일', shortDay: '17', axisBadge: 'tick', budgetRemaining: 76.5, dailySpend: 1.4, evenBurn: 41.4, attainedSlo: '99.995%', burn1h: '0.09×', burn6h: '0.10× over 6h', dailyPace: '1.4%', state: 'healthy' },
  { index: 17, dateLabel: '9월 18일', shortDay: '18', axisBadge: 'tick', budgetRemaining: 75.1, dailySpend: 1.4, evenBurn: 37.9, attainedSlo: '99.995%', burn1h: '0.09×', burn6h: '0.10× over 6h', dailyPace: '1.4%', state: 'healthy' },
  { index: 18, dateLabel: '9월 19일', shortDay: '19', axisBadge: 'tick', budgetRemaining: 73.7, dailySpend: 1.4, evenBurn: 34.5, attainedSlo: '99.994%', burn1h: '0.09×', burn6h: '0.11× over 6h', dailyPace: '1.4%', state: 'healthy' },
  { index: 19, dateLabel: '9월 20일', shortDay: '20', axisBadge: 'tick', budgetRemaining: 72.3, dailySpend: 1.4, evenBurn: 31.0, attainedSlo: '99.994%', burn1h: '0.10×', burn6h: '0.11× over 6h', dailyPace: '1.4%', state: 'healthy' },
  {
    index: 20,
    dateLabel: '9월 21일',
    shortDay: '21',
    axisBadge: 'circle-incident',
    axisText: '21',
    budgetRemaining: 8.0,
    dailySpend: 64.3,
    evenBurn: 27.6,
    attainedSlo: '99.991%',
    burn1h: '4.80×',
    burn6h: '3.92× over 6h',
    dailyPace: '4.4%',
    state: 'warn',
    isIncident: true,
    incidentTitle: 'INC-4091 · 원장 DB 프라이머리 락 경합',
    incidentSummary: '9월 21일 인시던트 1건으로 하루 동안 버짓 64.3% 급격 소진',
  },
  { index: 21, dateLabel: '9월 22일', shortDay: '22', axisBadge: 'circle-gray', axisText: '22', budgetRemaining: 6.5, dailySpend: 1.5, evenBurn: 24.1, attainedSlo: '99.991%', burn1h: '0.38×', burn6h: '0.45× over 6h', dailyPace: '4.3%', state: 'warn' },
  { index: 22, dateLabel: '9월 23일', shortDay: '23', axisBadge: 'tick', budgetRemaining: 5.2, dailySpend: 1.3, evenBurn: 20.7, attainedSlo: '99.991%', burn1h: '0.28×', burn6h: '0.34× over 6h', dailyPace: '4.1%', state: 'warn' },
  { index: 23, dateLabel: '9월 24일', shortDay: '24', axisBadge: 'tick', budgetRemaining: 3.8, dailySpend: 1.4, evenBurn: 17.2, attainedSlo: '99.990%', burn1h: '0.24×', burn6h: '0.30× over 6h', dailyPace: '4.0%', state: 'warn' },
  { index: 24, dateLabel: '9월 25일', shortDay: '25', axisBadge: 'tick', budgetRemaining: -2.4, dailySpend: 6.2, evenBurn: 13.8, attainedSlo: '99.989%', burn1h: '1.12×', burn6h: '0.94× over 6h', dailyPace: '4.1%', state: 'over', incidentSummary: '에러 버짓 0% 하향 돌파 (버짓 소진일)' },
  {
    index: 25,
    dateLabel: '9월 26일',
    shortDay: '26',
    axisBadge: 'circle-incident',
    axisText: '26',
    budgetRemaining: -36.0,
    dailySpend: 33.6,
    evenBurn: 10.3,
    attainedSlo: '99.987%',
    burn1h: '3.40×',
    burn6h: '2.85× over 6h',
    dailyPace: '5.2%',
    state: 'over',
    isIncident: true,
    incidentTitle: 'INC-4108 · 카프카 컨슈머 리밸런싱 타임아웃',
    incidentSummary: '9월 26일 2차 인시던트로 버짓 33.6% 추가 초과 소진',
  },
  { index: 26, dateLabel: '9월 27일', shortDay: '27', axisBadge: 'tick', budgetRemaining: -38.0, dailySpend: 2.0, evenBurn: 6.9, attainedSlo: '99.987%', burn1h: '0.31×', burn6h: '0.38× over 6h', dailyPace: '5.8%', state: 'over' },
  { index: 27, dateLabel: '9월 28일', shortDay: '28', axisBadge: 'tick', budgetRemaining: -40.0, dailySpend: 2.0, evenBurn: 3.4, attainedSlo: '99.986%', burn1h: '0.28×', burn6h: '0.34× over 6h', dailyPace: '6.1%', state: 'over' },
  {
    index: 28,
    dateLabel: '9월 29일',
    shortDay: '29',
    axisBadge: 'circle-today',
    axisText: '29',
    budgetRemaining: -42.0,
    dailySpend: 2.0,
    evenBurn: 0.0,
    attainedSlo: '99.986%',
    burn1h: '0.26×',
    burn6h: '0.32× over 6h',
    dailyPace: '6.5%',
    state: 'over',
    isIncident: true,
    isToday: true,
    incidentTitle: '현재 기준점 (오늘 · 9월 29일)',
    incidentSummary: '6일간 2건의 인시던트로 112% 소진 · 배포 동결 발효 중',
  },
  // 향후 예측치 (Forecast: 9월 30일 ~ 10월 6일)
  { index: 29, dateLabel: '9월 30일', shortDay: '30', axisBadge: 'tick', budgetRemaining: -48.5, dailySpend: 6.5, evenBurn: null, attainedSlo: '99.985%', burn1h: '0.26×', burn6h: '0.32× over 6h', dailyPace: '6.5%', state: 'forecast' },
  { index: 30, dateLabel: '10월 1일', shortDay: '1', axisBadge: 'tick', budgetRemaining: -55.0, dailySpend: 6.5, evenBurn: null, attainedSlo: '99.984%', burn1h: '0.26×', burn6h: '0.32× over 6h', dailyPace: '6.5%', state: 'forecast' },
  { index: 31, dateLabel: '10월 2일', shortDay: '2', axisBadge: 'tick', budgetRemaining: -61.5, dailySpend: 6.5, evenBurn: null, attainedSlo: '99.983%', burn1h: '0.26×', burn6h: '0.32× over 6h', dailyPace: '6.5%', state: 'forecast' },
  { index: 32, dateLabel: '10월 3일', shortDay: '3', axisBadge: 'tick', budgetRemaining: -68.0, dailySpend: 6.5, evenBurn: null, attainedSlo: '99.982%', burn1h: '0.26×', burn6h: '0.32× over 6h', dailyPace: '6.5%', state: 'forecast' },
  { index: 33, dateLabel: '10월 4일', shortDay: '4', axisBadge: 'tick', budgetRemaining: -74.5, dailySpend: 6.5, evenBurn: null, attainedSlo: '99.981%', burn1h: '0.26×', burn6h: '0.32× over 6h', dailyPace: '6.5%', state: 'forecast' },
  { index: 34, dateLabel: '10월 5일', shortDay: '5', axisBadge: 'tick', budgetRemaining: -81.0, dailySpend: 6.5, evenBurn: null, attainedSlo: '99.980%', burn1h: '0.26×', burn6h: '0.32× over 6h', dailyPace: '6.5%', state: 'forecast' },
  { index: 35, dateLabel: '10월 6일', shortDay: '6', axisBadge: 'pill-end', axisText: '10월 6일', budgetRemaining: -87.5, dailySpend: 6.5, evenBurn: null, attainedSlo: '99.979%', burn1h: '0.26×', burn6h: '0.32× over 6h', dailyPace: '6.5%', state: 'forecast' },
];

// 2. 결제 승인 응답 지연 (주의 상태 대안 데이터셋)
const PAYMENT_AUTH_POINTS: DailyBudgetPoint[] = LEDGER_WRITE_POINTS.map((p, idx) => {
  if (idx < 20) {
    return {
      ...p,
      budgetRemaining: Number((99 - idx * 2.1).toFixed(1)),
      dailySpend: 2.1,
      attainedSlo: '99.958%',
      burn1h: '0.12×',
      burn6h: '0.15× over 6h',
      dailyPace: '2.1%',
      state: 'healthy',
    };
  }
  if (idx <= 28) {
    const rem = Number((34 - (idx - 20) * 2.2).toFixed(1));
    return {
      ...p,
      budgetRemaining: rem,
      dailySpend: idx === 20 ? 23.0 : 2.2,
      attainedSlo: '99.918%',
      burn1h: '0.18×',
      burn6h: '0.21× over 6h',
      dailyPace: '3.8%',
      state: rem <= 25 ? 'warn' : 'healthy',
      isIncident: idx === 20,
      incidentTitle: idx === 20 ? 'INC-4088 · PG 게이트웨이 지연 스파이크' : undefined,
      incidentSummary: idx === 20 ? '외부 카드사 응답 지연으로 버짓 23% 소진' : undefined,
    };
  }
  const fRem = Number((16.4 - (idx - 28) * 3.8).toFixed(1));
  return {
    ...p,
    budgetRemaining: fRem,
    dailySpend: 3.8,
    attainedSlo: '99.904%',
    burn1h: '0.18×',
    burn6h: '0.21× over 6h',
    dailyPace: '3.8%',
    state: 'forecast',
  };
});

const SLI_TARGETS: SliTargetOption[] = [
  {
    id: 'ledger-write',
    name: '원장 쓰기 성공률',
    engName: 'Ledger write success',
    targetText: '최근 30일 기준 99.99% 목표',
    statusLabel: '소진됨',
    statusTone: 'exhausted',
    deploysFrozen: true,
    dotColor: 'var(--klic-component-block-color-danger)',
    defaultSummary: {
      budgetMain: '42%',
      budgetSuffix: '초과',
      budgetSub: '6일간 2건의 인시던트로 112% 소진',
      attained: '99.986%',
      target: '목표 99.99%',
      burn1h: '0.26×',
      burn6h: '6시간 평균 0.32×',
      dailyPace: '6.5%',
      evenPace: '균등 소진 기준 3.3%',
      ranOutDate: '9월 25일',
      ranOutSub: '4일 전',
    },
    points: LEDGER_WRITE_POINTS,
  },
  {
    id: 'payment-latency',
    name: '결제 승인 응답 속도 (p99)',
    engName: 'Payment auth latency',
    targetText: '최근 30일 기준 99.90% 목표',
    statusLabel: '경고 (25% 이하)',
    statusTone: 'warning',
    deploysFrozen: false,
    dotColor: 'var(--klic-component-block-color-warning)',
    defaultSummary: {
      budgetMain: '16.4%',
      budgetSuffix: '잔여',
      budgetSub: '9월 21일 PG 지연 인시던트로 23% 소진',
      attained: '99.918%',
      target: '목표 99.90%',
      burn1h: '0.18×',
      burn6h: '6시간 평균 0.21×',
      dailyPace: '3.8%',
      evenPace: '균등 소진 기준 3.3%',
      ranOutDate: '10월 3일',
      ranOutSub: '4일 후 고갈 예상',
    },
    points: PAYMENT_AUTH_POINTS,
  },
];

export function ErrorBudgetBurnBlock({ density = 'normal' }: ErrorBudgetBurnBlockProps) {
  const [selectedSliId, setSelectedSliId] = useState<string>('ledger-write');
  const [isSliDropdownOpen, setIsSliDropdownOpen] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showEvenBurnTicks, setShowEvenBurnTicks] = useState(true);

  // 호버 및 드래그 구간 선택 상태
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);
  const [dragEndIndex, setDragEndIndex] = useState<number | null>(null);
  const isDraggingRef = useRef(false);

  const currentSli = useMemo(
    () => SLI_TARGETS.find((s) => s.id === selectedSliId) || SLI_TARGETS[0],
    [selectedSliId]
  );

  const points = currentSli.points;
  const todayIndex = 28; // 9월 29일

  // 드래그 선택된 구간 계산
  const selectedRange = useMemo(() => {
    if (dragStartIndex === null || dragEndIndex === null) return null;
    const start = Math.min(dragStartIndex, dragEndIndex);
    const end = Math.max(dragStartIndex, dragEndIndex);
    if (start === end) return null;
    return { start, end };
  }, [dragStartIndex, dragEndIndex]);

  // 현재 포커스된 날짜 (호버 중이면 해당 날짜, 아니면 오늘(28))
  const activeDayIndex = hoveredIndex ?? todayIndex;
  const activePoint = points[activeDayIndex] || points[todayIndex];

  // 상단 5대 KPI 카드에 표시할 동적 수치 계산
  const kpiMetrics = useMemo(() => {
    // 1) 다중 날짜 드래그 구간이 선택된 경우: 구간 소진량 합산 표시
    if (selectedRange) {
      const slice = points.slice(selectedRange.start, selectedRange.end + 1);
      const totalSpent = slice.reduce((acc, p) => acc + p.dailySpend, 0);
      const incidentCount = slice.filter((p) => p.isIncident && !p.isToday).length;
      const startPt = points[selectedRange.start];
      const endPt = points[selectedRange.end];
      const avgPace = (totalSpent / slice.length).toFixed(1);

      return {
        isRangeMode: true,
        budgetLabel: `선택 구간 소진 합계 (${startPt.dateLabel} ~ ${endPt.dateLabel})`,
        budgetMain: `${totalSpent.toFixed(1)}%`,
        budgetSuffix: '소진',
        budgetSuffixColor: totalSpent > 30 ? 'text-red-600 ' : 'text-amber-700 ',
        budgetSub:
          incidentCount > 0
            ? `${slice.length}일간 ${incidentCount}건의 인시던트 발생 (잔여 ${endPt.budgetRemaining > 0 ? `${endPt.budgetRemaining}%` : `${Math.abs(endPt.budgetRemaining)}% 초과`})`
            : `선택된 ${slice.length}일 동안 총 ${totalSpent.toFixed(1)}% 버짓 소진`,
        attainedLabel: '구간 종료 시점 가용성',
        attained: endPt.attainedSlo,
        target: currentSli.defaultSummary.target,
        burn1hLabel: '구간 피크 1시간 소진율',
        burn1h: endPt.burn1h,
        burn6h: endPt.burn6h.replace('over 6h', '6시간 평균'),
        dailyPaceLabel: '구간 일평균 소진 속도',
        dailyPace: `${avgPace}%`,
        evenPace: currentSli.defaultSummary.evenPace,
        ranOutLabel: '고갈 시점',
        ranOutDate: currentSli.defaultSummary.ranOutDate,
        ranOutSub: currentSli.defaultSummary.ranOutSub,
      };
    }

    // 2) 특정 날짜 컬럼을 호버 중인 경우 (오늘 제외)
    if (hoveredIndex !== null && hoveredIndex !== todayIndex) {
      const pt = points[hoveredIndex];
      const isOver = pt.budgetRemaining < 0;
      const absVal = Math.abs(pt.budgetRemaining).toFixed(pt.budgetRemaining % 1 === 0 ? 0 : 1);

      return {
        isRangeMode: false,
        budgetLabel: `${pt.dateLabel} ${pt.state === 'forecast' ? '예측 버짓' : '버짓 상태'}`,
        budgetMain: `${absVal}%`,
        budgetSuffix: isOver ? '초과' : '잔여',
        budgetSuffixColor: isOver
          ? 'text-red-600 '
          : pt.budgetRemaining <= 25
          ? 'text-amber-600 '
          : 'text-blue-600 ',
        budgetSub:
          pt.incidentSummary ||
          `당일 소진량 ${pt.dailySpend.toFixed(1)}% · ${
            pt.evenBurn !== null ? `균등 기준선 ${pt.evenBurn.toFixed(1)}%` : '현재 추세 기반 향후 예측치'
          }`,
        attainedLabel: `${pt.dateLabel} 달성 가용성`,
        attained: pt.attainedSlo,
        target: currentSli.defaultSummary.target,
        burn1hLabel: '1시간 소진율',
        burn1h: pt.burn1h,
        burn6h: pt.burn6h.replace('over 6h', '6시간 평균'),
        dailyPaceLabel: '일간 소진 속도',
        dailyPace: pt.dailyPace,
        evenPace: currentSli.defaultSummary.evenPace,
        ranOutLabel: '고갈 시점',
        ranOutDate: currentSli.defaultSummary.ranOutDate,
        ranOutSub: currentSli.defaultSummary.ranOutSub,
      };
    }

    // 3) 기본 상태 (오늘 9월 29일 기준, 이미지와 100% 일치)
    return {
      isRangeMode: false,
      budgetLabel: '버짓 상태',
      budgetMain: currentSli.defaultSummary.budgetMain,
      budgetSuffix: currentSli.defaultSummary.budgetSuffix,
      budgetSuffixColor:
        currentSli.statusTone === 'exhausted'
          ? 'text-red-600 '
          : 'text-amber-600 ',
      budgetSub: currentSli.defaultSummary.budgetSub,
      attainedLabel: '달성 가용성',
      attained: currentSli.defaultSummary.attained,
      target: currentSli.defaultSummary.target,
      burn1hLabel: '1시간 소진율',
      burn1h: currentSli.defaultSummary.burn1h,
      burn6h: currentSli.defaultSummary.burn6h,
      dailyPaceLabel: '일간 소진 속도',
      dailyPace: currentSli.defaultSummary.dailyPace,
      evenPace: currentSli.defaultSummary.evenPace,
      ranOutLabel: '고갈 시점',
      ranOutDate: currentSli.defaultSummary.ranOutDate,
      ranOutSub: currentSli.defaultSummary.ranOutSub,
    };
  }, [selectedRange, hoveredIndex, points, currentSli, todayIndex]);

  // SVG 좌표 변환 상수
  const svgWidth = 960;
  const svgHeight = 305;
  const plotLeft = 36;
  const plotRight = 928;
  const zeroY = 148; // 0% 기준선
  const scaleY = 0.92; // 1%당 픽셀 (100% -> y = 56, -87.5% -> y = 228.5)
  const warn25Y = zeroY - 25 * scaleY; // 경고 25% 점선 (y = 125)
  const stepX = (plotRight - plotLeft) / (points.length - 1);

  const getPointX = (idx: number) => plotLeft + idx * stepX;
  const getPointY = (val: number) => zeroY - val * scaleY;

  const handleMouseDownDay = (idx: number) => {
    isDraggingRef.current = true;
    setDragStartIndex(idx);
    setDragEndIndex(idx);
  };

  const handleMouseEnterDay = (idx: number) => {
    setHoveredIndex(idx);
    if (isDraggingRef.current) {
      setDragEndIndex(idx);
    }
  };

  const handleMouseUpGlobal = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      if (dragStartIndex !== null && dragEndIndex !== null && dragStartIndex === dragEndIndex) {
        setDragStartIndex(null);
        setDragEndIndex(null);
      }
    }
  };

  const padClass =
    density === 'compact'
      ? 'p-4'
      : density === 'relaxed'
      ? 'p-7'
      : 'p-5 sm:p-6';

  return (
    <div
      className="w-full select-none"
      onMouseUp={handleMouseUpGlobal}
    >
      <div className="rounded-[20px] border border-zinc-200/90  bg-white  shadow-xs overflow-hidden">
        {/* 1. 상단 헤더 영역 */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${padClass} border-b border-zinc-200/80 `}>
          {/* 좌측 타이틀 & 상태 배지 */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl border border-zinc-200  bg-white  flex items-center justify-center shadow-2xs shrink-0">
              <TrendingDown className="w-5 h-5 text-zinc-800 " strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[16px] font-bold tracking-tight text-zinc-900 ">
                  에러 버짓
                </h2>
                {/* 소진됨 배지 */}
                {currentSli.statusTone === 'exhausted' ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-red-50  text-red-700  border border-red-200/80 ">
                    {currentSli.statusLabel}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50  text-amber-700  border border-amber-200/80 ">
                    {currentSli.statusLabel}
                  </span>
                )}

                {/* 배포 동결됨 배지 */}
                {currentSli.deploysFrozen && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-zinc-100  text-zinc-800  border border-zinc-200/90 ">
                    <XCircle className="w-3.5 h-3.5 text-zinc-700 " strokeWidth={2.2} />
                    배포 동결됨
                  </span>
                )}
              </div>
              <p className="text-[13px] text-klic-muted  mt-0.5 font-medium">
                {currentSli.targetText}
              </p>
            </div>
          </div>

          {/* 우측 컨트롤: SLI 선택 드롭다운 & 알림 토글 버튼 */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* SLI 지표 선택 드롭다운 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSliDropdownOpen((v) => !v)}
                className="h-9 px-3.5 rounded-lg border border-zinc-200  bg-white  hover:bg-zinc-50  text-[13px] font-medium text-zinc-800  flex items-center gap-2.5 shadow-2xs transition cursor-pointer"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: currentSli.dotColor }}
                />
                <span className="truncate max-w-[180px]">{currentSli.name}</span>
                <ChevronDown className="w-4 h-4 text-klic-muted ml-1" />
              </button>

              {isSliDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-68 rounded-xl border border-zinc-200  bg-white  shadow-xl p-1.5 z-30">
                  <div className="px-2.5 py-1.5 text-[11px] font-semibold text-klic-muted">
                    모니터링 대상 SLI 지표 전환
                  </div>
                  {SLI_TARGETS.map((sli) => {
                    const isSelected = sli.id === currentSli.id;
                    return (
                      <button
                        key={sli.id}
                        type="button"
                        onClick={() => {
                          setSelectedSliId(sli.id);
                          setIsSliDropdownOpen(false);
                          setDragStartIndex(null);
                          setDragEndIndex(null);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-100  font-semibold text-zinc-900 '
                            : 'text-klic-muted  hover:bg-zinc-50 '
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: sli.dotColor }}
                          />
                          <div>
                            <div className="text-zinc-900  font-medium">{sli.name}</div>
                            <div className="text-[11px] text-klic-muted">{sli.targetText}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-zinc-800 " />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 알림 켜짐 + 더보기 분할 버튼 */}
            <div className="relative inline-flex items-center rounded-lg border border-zinc-200  bg-white  shadow-2xs divide-x divide-zinc-200 ">
              <button
                type="button"
                onClick={() => setAlertsEnabled((v) => !v)}
                className="h-9 px-3 text-[13px] font-semibold text-zinc-800  hover:bg-zinc-50  flex items-center gap-1.5 rounded-l-lg transition cursor-pointer"
              >
                {alertsEnabled ? (
                  <>
                    <Bell className="w-3.5 h-3.5 text-zinc-700 " />
                    <span>알림 켜짐</span>
                  </>
                ) : (
                  <>
                    <BellOff className="w-3.5 h-3.5 text-klic-muted" />
                    <span className="text-klic-muted">알림 일시중지</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowMoreMenu((v) => !v)}
                className="h-9 px-2.5 text-klic-muted  hover:bg-zinc-50  rounded-r-lg flex items-center justify-center transition cursor-pointer"
                title="에러 버짓 옵션"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border border-zinc-200  bg-white  shadow-xl p-1.5 z-30 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEvenBurnTicks((v) => !v);
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-2.5 py-2 rounded-lg text-left text-zinc-700  hover:bg-zinc-100  flex items-center justify-between cursor-pointer"
                  >
                    <span>균등 소진 기준선 (—) 표시</span>
                    {showEvenBurnTicks && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDragStartIndex(20);
                      setDragEndIndex(25);
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-2.5 py-2 rounded-lg text-left text-zinc-700  hover:bg-zinc-100  cursor-pointer"
                  >
                    인시던트 집중 구간 (9/21~9/26) 선택
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDragStartIndex(null);
                      setDragEndIndex(null);
                      setHoveredIndex(null);
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-2.5 py-2 rounded-lg text-left text-zinc-700  hover:bg-zinc-100  cursor-pointer"
                  >
                    구간 선택 초기화
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. 상단 5열 KPI 요약 스트립 (호버 및 드래그 구간에 실시간 연동) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-b border-zinc-200/80  divide-y sm:divide-y-0 sm:divide-x divide-zinc-200/80 ">
          {/* KPI 1: 버짓 상태 (Budget) */}
          <div className="p-4 sm:p-5 flex flex-col justify-between lg:col-span-1">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[12px] font-medium text-klic-muted ">
                {kpiMetrics.budgetLabel}
              </span>
              {selectedRange && (
                <button
                  type="button"
                  onClick={() => {
                    setDragStartIndex(null);
                    setDragEndIndex(null);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-klic-muted hover:text-zinc-900  bg-zinc-100  px-1.5 py-0.5 rounded cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  해제
                </button>
              )}
            </div>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="text-[26px] leading-tight font-bold tracking-tight text-zinc-900  font-mono">
                {kpiMetrics.budgetMain}
              </span>
              <span className={`text-[15px] font-semibold ${kpiMetrics.budgetSuffixColor}`}>
                {kpiMetrics.budgetSuffix}
              </span>
            </div>
            <p className="mt-2 text-[12px] text-klic-muted  leading-snug">
              {kpiMetrics.budgetSub}
            </p>
          </div>

          {/* KPI 2: 달성 가용성 (Attained) */}
          <div className="p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[12px] font-medium text-klic-muted ">
              {kpiMetrics.attainedLabel}
            </span>
            <div className="mt-1.5">
              <span className="text-[26px] leading-tight font-bold tracking-tight text-zinc-900  font-mono">
                {kpiMetrics.attained}
              </span>
            </div>
            <p className="mt-2 text-[12px] text-klic-muted ">
              {kpiMetrics.target}
            </p>
          </div>

          {/* KPI 3: 1시간 소진율 (Burn 1h) */}
          <div className="p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[12px] font-medium text-klic-muted ">
              {kpiMetrics.burn1hLabel}
            </span>
            <div className="mt-1.5">
              <span className="text-[26px] leading-tight font-bold tracking-tight text-zinc-900  font-mono">
                {kpiMetrics.burn1h}
              </span>
            </div>
            <p className="mt-2 text-[12px] text-klic-muted ">
              {kpiMetrics.burn6h}
            </p>
          </div>

          {/* KPI 4: 일간 소진 속도 (Daily pace) */}
          <div className="p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[12px] font-medium text-klic-muted ">
              {kpiMetrics.dailyPaceLabel}
            </span>
            <div className="mt-1.5">
              <span className="text-[26px] leading-tight font-bold tracking-tight text-amber-800  font-mono">
                {kpiMetrics.dailyPace}
              </span>
            </div>
            <p className="mt-2 text-[12px] text-klic-muted ">
              {kpiMetrics.evenPace}
            </p>
          </div>

          {/* KPI 5: 고갈 시점 (Ran out) */}
          <div className="p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[12px] font-medium text-klic-muted ">
              {kpiMetrics.ranOutLabel}
            </span>
            <div className="mt-1.5">
              <span
                className={`text-[26px] leading-tight font-bold tracking-tight ${
                  currentSli.statusTone === 'exhausted'
                    ? 'text-red-600 '
                    : 'text-amber-600 '
                }`}
              >
                {kpiMetrics.ranOutDate}
              </span>
            </div>
            <p className="mt-2 text-[12px] text-klic-muted ">
              {kpiMetrics.ranOutSub}
            </p>
          </div>
        </div>

        {/* 3. 메인 롤리팝 & 예측 에러 버짓 차트 */}
        <div
          className="px-3 sm:px-6 pt-6 pb-4 relative"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible"
          >
            <defs>
              {/* 버짓 초과(Over budget) 영역 레드 그라데이션 */}
              <linearGradient id="overBudgetRedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--klic-component-block-color-danger)" stopOpacity="0.11" />
                <stop offset="65%" stopColor="var(--klic-component-block-color-danger)" stopOpacity="0.04" />
                <stop offset="100%" stopColor="var(--klic-component-block-color-danger)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* 0% 이하 버짓 초과 배경 영역 */}
            <rect
              x={plotLeft}
              y={zeroY}
              width={plotRight - plotLeft}
              height={95}
              fill="url(#overBudgetRedGradient)"
            />

            {/* 드래그 구간 선택 하이라이트 밴드 */}
            {selectedRange && (
              <rect
                x={getPointX(selectedRange.start) - stepX * 0.45}
                y={30}
                width={
                  getPointX(selectedRange.end) -
                  getPointX(selectedRange.start) +
                  stepX * 0.9
                }
                height={254}
                rx={12}
                fill="color-mix(in srgb,var(--klic-component-block-color-danger) 7%,transparent)"
                stroke="color-mix(in srgb,var(--klic-component-block-color-danger) 25%,transparent)"
                strokeDasharray="4 4"
              />
            )}

            {/* 활성 날짜(기본: 9월 29일 오늘, 또는 호버된 날짜) 세로 하이라이트 필러 */}
            {(() => {
              const pillarX = getPointX(activeDayIndex);
              return (
                <rect
                  x={pillarX - 13}
                  y={32}
                  width={26}
                  height={252}
                  rx={13}
                  fill="color-mix(in srgb,var(--klic-component-block-color-text) 5.5%,transparent)"
                  className=" transition-all duration-150"
                />
              );
            })()}

            {/* 경고 25% (Warn 25%) 점선 및 라벨 */}
            <text
              x={plotLeft}
              y={warn25Y - 6}
              className="text-[11px] font-semibold fill-amber-800 "
            >
              경고 25%
            </text>
            <line
              x1={plotLeft}
              y1={warn25Y}
              x2={plotRight}
              y2={warn25Y}
              stroke="var(--klic-component-block-color-warning)"
              strokeWidth={1.3}
              strokeDasharray="4 4"
            />

            {/* 0% 기준선 및 '버짓 초과' 라벨 */}
            <text
              x={plotLeft}
              y={zeroY - 6}
              className="text-[11px] font-medium fill-zinc-500 "
            >
              0%
            </text>
            <line
              x1={plotLeft}
              y1={zeroY}
              x2={plotRight}
              y2={zeroY}
              stroke="var(--klic-component-block-color-control-border)"
              strokeWidth={1.2}
            />
            <text
              x={plotLeft}
              y={zeroY + 16}
              className="text-[11px] font-semibold fill-red-600 "
            >
              버짓 초과
            </text>

            {/* 36일 일별 롤리팝 스템, 균등 소진 틱(—), 데이터 도트 */}
            {points.map((pt) => {
              const cx = getPointX(pt.index);
              const cy = getPointY(pt.budgetRemaining);
              const evenY = pt.evenBurn !== null ? getPointY(pt.evenBurn) : null;
              const isHovered = hoveredIndex === pt.index;
              const isInDragRange =
                selectedRange !== null &&
                pt.index >= selectedRange.start &&
                pt.index <= selectedRange.end;

              // 스템(세로선) 상하단 범위 계산:
              // 인시던트 이후(9/21~9/28)에는 균등 소진 틱(evenY)이 버짓 도트보다 위에 있으므로
              // 원본 이미지처럼 0%에서 evenY까지도 얇은 스템이 이어지도록 처리
              const stemTopY =
                evenY !== null && showEvenBurnTicks
                  ? Math.min(zeroY, cy, evenY)
                  : Math.min(zeroY, cy);
              const stemBottomY = Math.max(zeroY, cy);

              const dotColor =
                pt.state === 'healthy'
                  ? 'var(--klic-component-block-color-accent)'
                  : pt.state === 'warn'
                  ? 'var(--klic-component-block-color-warning)'
                  : 'var(--klic-component-block-color-danger)';

              return (
                <g
                  key={pt.index}
                  className="cursor-pointer"
                  onMouseDown={() => handleMouseDownDay(pt.index)}
                  onMouseEnter={() => handleMouseEnterDay(pt.index)}
                >
                  {/* 투명 마우스 히트 영역 */}
                  <rect
                    x={cx - stepX / 2}
                    y={24}
                    width={stepX}
                    height={264}
                    fill="transparent"
                  />

                  {/* 세로 스템 라인 (예측 구간은 점선) */}
                  <line
                    x1={cx}
                    y1={stemTopY}
                    x2={cx}
                    y2={stemBottomY}
                    stroke={isHovered || isInDragRange ? 'var(--klic-component-block-color-muted)' : 'var(--klic-component-block-color-border)'}
                    strokeWidth={isHovered ? 1.8 : 1.25}
                    strokeDasharray={pt.state === 'forecast' ? '2.5 2.5' : undefined}
                  />

                  {/* 균등 소진 기준선 틱 마크 (— Even burn) */}
                  {showEvenBurnTicks && evenY !== null && (
                    <line
                      x1={cx - 4}
                      y1={evenY}
                      x2={cx + 4}
                      y2={evenY}
                      stroke="var(--klic-component-block-color-control-border)"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                    />
                  )}

                  {/* 인시던트 발생 외곽 링 (Incident halo) */}
                  {(pt.isIncident || isHovered) && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={8.5}
                      fill={
                        pt.state === 'warn'
                          ? 'color-mix(in srgb,var(--klic-component-block-color-warning-surface) 35%,transparent)'
                          : 'color-mix(in srgb,var(--klic-component-block-color-border) 35%,transparent)'
                      }
                      stroke={pt.state === 'warn' ? 'var(--klic-component-block-color-danger-surface)' : 'var(--klic-component-block-color-danger)'}
                      strokeWidth={1.3}
                    />
                  )}

                  {/* 롤리팝 헤드 도트 (예측 구간은 속이 빈 원 ○) */}
                  {pt.state === 'forecast' ? (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 5 : 4}
                      fill="var(--klic-component-block-color-panel)"
                      stroke="var(--klic-component-block-color-danger)"
                      strokeWidth={2}
                    />
                  ) : (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 5.2 : 4.3}
                      fill={dotColor}
                    />
                  )}

                  {/* 하단 X축 날짜 마커 및 눈금 */}
                  {pt.axisBadge === 'pill-start' || pt.axisBadge === 'pill-end' ? (
                    <g transform={`translate(${cx}, 270)`}>
                      <rect
                        x={-26}
                        y={-11}
                        width={52}
                        height={22}
                        rx={11}
                        fill="var(--klic-component-block-color-soft)"
                        className=""
                      />
                      <text
                        x={0}
                        y={4}
                        textAnchor="middle"
                        className="text-[11px] font-medium fill-zinc-600 "
                      >
                        {pt.axisText}
                      </text>
                    </g>
                  ) : pt.axisBadge === 'circle-today' || isHovered ? (
                    <g transform={`translate(${cx}, 270)`}>
                      <circle
                        cx={0}
                        cy={0}
                        r={12}
                        fill="var(--klic-component-block-color-text)"
                        className=""
                      />
                      <text
                        x={0}
                        y={4}
                        textAnchor="middle"
                        className="text-[11px] font-bold fill-white "
                      >
                        {pt.shortDay}
                      </text>
                    </g>
                  ) : pt.axisBadge === 'circle-incident' ? (
                    <g transform={`translate(${cx}, 270)`}>
                      <circle
                        cx={0}
                        cy={0}
                        r={11.5}
                        fill="var(--klic-component-block-color-soft)"
                        stroke="var(--klic-component-block-color-border)"
                        strokeWidth={1.2}
                      />
                      <text
                        x={0}
                        y={4}
                        textAnchor="middle"
                        className="text-[11px] font-semibold fill-red-600"
                      >
                        {pt.axisText}
                      </text>
                    </g>
                  ) : pt.axisBadge === 'circle-gray' ? (
                    <g transform={`translate(${cx}, 270)`}>
                      <circle
                        cx={0}
                        cy={0}
                        r={11}
                        fill="var(--klic-component-block-color-soft)"
                        className=""
                      />
                      <text
                        x={0}
                        y={4}
                        textAnchor="middle"
                        className="text-[11px] font-medium fill-zinc-600 "
                      >
                        {pt.axisText}
                      </text>
                    </g>
                  ) : (
                    <line
                      x1={cx}
                      y1={266}
                      x2={cx}
                      y2={273}
                      stroke="var(--klic-component-block-color-border)"
                      strokeWidth={1.2}
                    />
                  )}
                </g>
              );
            })}

            {/* 상단 다크 플로팅 배지 (기본: '42% 초과 · 오늘', 호버/드래그 시 해당 날짜·구간 정보 표시) */}
            {(() => {
              const targetIdx = selectedRange
                ? Math.round((selectedRange.start + selectedRange.end) / 2)
                : activeDayIndex;
              const rawX = getPointX(targetIdx);
              const badgeWidth = selectedRange ? 186 : 138;
              const clampedX = Math.max(
                plotLeft + badgeWidth / 2,
                Math.min(plotRight - badgeWidth / 2, rawX)
              );

              let mainText = '';
              let subText = '';

              if (selectedRange) {
                const slice = points.slice(selectedRange.start, selectedRange.end + 1);
                const sum = slice.reduce((a, b) => a + b.dailySpend, 0);
                mainText = `${sum.toFixed(1)}% 소진`;
                subText = `${points[selectedRange.start].dateLabel}~${points[selectedRange.end].shortDay}일`;
              } else {
                const isOver = activePoint.budgetRemaining < 0;
                const absVal = Math.abs(activePoint.budgetRemaining).toFixed(
                  activePoint.budgetRemaining % 1 === 0 ? 0 : 1
                );
                mainText = `${absVal}% ${isOver ? '초과' : '잔여'}`;
                subText = activePoint.isToday
                  ? '오늘'
                  : activePoint.state === 'forecast'
                  ? `${activePoint.dateLabel} (예측)`
                  : activePoint.dateLabel;
              }

              return (
                <g
                  transform={`translate(${clampedX}, 18)`}
                  className="transition-all duration-150"
                >
                  <rect
                    x={-badgeWidth / 2}
                    y={-14}
                    width={badgeWidth}
                    height={28}
                    rx={14}
                    fill="var(--klic-component-block-color-text)"
                    className=" shadow-md"
                  />
                  <text
                    x={0}
                    y={4}
                    textAnchor="middle"
                    className="text-[11.5px] font-bold fill-white "
                  >
                    <tspan>{mainText}</tspan>
                    <tspan className="fill-zinc-400  mx-1"> · </tspan>
                    <tspan className="font-medium fill-zinc-300 ">
                      {subText}
                    </tspan>
                  </text>
                </g>
              );
            })()}
          </svg>

          {/* 4. 하단 범례 및 드래그 안내 푸터 */}
          <div className="mt-2 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px] text-klic-muted ">
            <div className="flex flex-wrap items-center gap-5">
              {/* 균등 소진 기준선 (Even burn) */}
              <button
                type="button"
                onClick={() => setShowEvenBurnTicks((v) => !v)}
                className={`inline-flex items-center gap-2 transition cursor-pointer ${
                  showEvenBurnTicks ? 'opacity-100' : 'opacity-45'
                }`}
              >
                <span className="w-3 h-[2px] bg-zinc-400 rounded-full inline-block" />
                <span>균등 소진 기준</span>
              </button>

              {/* 예측치 (Forecast) */}
              <div className="inline-flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-zinc-600  bg-white  inline-block" />
                <span>향후 예측치</span>
              </div>

              {/* 인시던트 (Incident) */}
              <div className="inline-flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-100 border border-red-300 inline-block" />
                <span>장애 발생</span>
              </div>
            </div>

            <div className="text-[12px] text-klic-muted  font-medium">
              날짜 구간을 드래그하여 기간별 소진량 합산
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
