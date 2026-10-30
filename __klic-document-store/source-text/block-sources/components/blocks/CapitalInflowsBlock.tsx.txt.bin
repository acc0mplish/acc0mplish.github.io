import React, { useState, useMemo } from 'react';
import {
  Calendar,
  ChevronDown,
  SlidersHorizontal,
  RefreshCw,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Check,
  Shield,
} from 'lucide-react';

export type CapitalBarVariant = 'capital-inflows-bar' | 'revenue-breakdown-bar' | 'headcount-cost-bar';

export interface CapitalInflowsBlockProps {
  variant?: CapitalBarVariant;
  density?: 'compact' | 'normal' | 'relaxed';
}

export interface FundMeta {
  id: string;
  nameKo: string;
  nameEn: string;
  frontColor: string;
  sideColor: string;
  topColor: string;
}

export interface YearlyCapitalDatum {
  year: string;
  axisLabel: string;
  totalM: number;
  runRateM: number;
  yoyPct: number;
  yoyLabel: string;
  cagrPct: number;
  cagrLabel: string;
  projectedTotalM?: number;
  defaultHighlighted?: boolean;
  breakdown: Record<string, number>;
}

const CAPITAL_FUNDS: FundMeta[] = [
  {
    id: 'wavemark',
    nameKo: 'Northstar 성장',
    nameEn: 'Northstar 성장',
    frontColor: 'var(--klic-component-block-chart-series-1)',
    sideColor: 'var(--klic-component-block-chart-series-1)',
    topColor: 'var(--klic-component-block-chart-series-1)',
  },
  {
    id: 'envato',
    nameKo: 'Harbor 벤처',
    nameEn: 'Harbor 벤처',
    frontColor: 'var(--klic-component-block-chart-series-2)',
    sideColor: 'var(--klic-component-block-chart-series-2)',
    topColor: 'var(--klic-component-block-chart-series-2)',
  },
  {
    id: 'qbridge',
    nameKo: 'Summit 기회',
    nameEn: 'Summit 기회',
    frontColor: 'var(--klic-component-block-chart-series-3)',
    sideColor: 'var(--klic-component-block-chart-series-3)',
    topColor: 'var(--klic-component-block-chart-series-3)',
  },
  {
    id: 'neon',
    nameKo: 'Orbit 디지털',
    nameEn: 'Orbit 디지털',
    frontColor: 'var(--klic-component-block-chart-series-4)',
    sideColor: 'var(--klic-component-block-chart-series-4)',
    topColor: 'var(--klic-component-block-chart-series-4)',
  },
  {
    id: 'stripe',
    nameKo: 'Bridge 인컴',
    nameEn: 'Bridge 인컴',
    frontColor: 'var(--klic-component-block-chart-series-5)',
    sideColor: 'var(--klic-component-block-chart-series-5)',
    topColor: 'var(--klic-component-block-chart-series-5)',
  },
  {
    id: 'eth',
    nameKo: 'Atlas 리저브',
    nameEn: 'Atlas 리저브',
    frontColor: 'var(--klic-component-block-chart-series-6)',
    sideColor: 'var(--klic-component-block-chart-series-6)',
    topColor: 'var(--klic-component-block-chart-series-6)',
  },
];

const CAPITAL_YEARLY_DATA: YearlyCapitalDatum[] = [
  {
    year: '2021',
    axisLabel: '2021',
    totalM: 7.6,
    runRateM: 8.2,
    yoyPct: 14.2,
    yoyLabel: '2020년 동기 대비',
    cagrPct: 14.2,
    cagrLabel: '2021년 기준 연간 성장률',
    defaultHighlighted: false,
    breakdown: {
      wavemark: 3.6,
      envato: 1.7,
      qbridge: 0.9,
      neon: 0.6,
      stripe: 0.5,
      eth: 0.3,
    },
  },
  {
    year: '2022',
    axisLabel: '2022',
    totalM: 6.7,
    runRateM: 7.1,
    yoyPct: -11.8,
    yoyLabel: '2021년 확정치 대비',
    cagrPct: -6.1,
    cagrLabel: '2021–2022 연복리 기준',
    defaultHighlighted: false,
    breakdown: {
      wavemark: 3.1,
      envato: 1.5,
      qbridge: 0.8,
      neon: 0.5,
      stripe: 0.5,
      eth: 0.3,
    },
  },
  {
    year: '2023',
    axisLabel: '2023',
    totalM: 9.1,
    runRateM: 9.8,
    yoyPct: 35.8,
    yoyLabel: '2022년 확정치 대비',
    cagrPct: 9.4,
    cagrLabel: '2021–2023 연복리 기준',
    defaultHighlighted: false,
    breakdown: {
      wavemark: 4.7,
      envato: 1.9,
      qbridge: 1.0,
      neon: 0.6,
      stripe: 0.5,
      eth: 0.4,
    },
  },
  {
    year: '2024',
    axisLabel: '2024',
    totalM: 11.7,
    runRateM: 12.5,
    yoyPct: 28.6,
    yoyLabel: '2023년 확정치 대비',
    cagrPct: 15.5,
    cagrLabel: '2021–2024 연복리 기준',
    defaultHighlighted: true,
    breakdown: {
      wavemark: 6.3,
      envato: 2.4,
      qbridge: 1.1,
      neon: 0.8,
      stripe: 0.7,
      eth: 0.4,
    },
  },
  {
    year: '2025',
    axisLabel: '2025',
    totalM: 14.3,
    runRateM: 15.1,
    yoyPct: 22.2,
    yoyLabel: '2024년 확정치 대비',
    cagrPct: 17.1,
    cagrLabel: '2021–2025 연복리 기준',
    defaultHighlighted: false,
    breakdown: {
      wavemark: 8.3,
      envato: 2.9,
      qbridge: 1.2,
      neon: 0.9,
      stripe: 0.6,
      eth: 0.4,
    },
  },
  {
    year: '2026',
    axisLabel: '2026 누적',
    totalM: 11.9,
    runRateM: 15.9,
    yoyPct: 10.7,
    yoyLabel: '2025년 동기 추세 대비',
    cagrPct: 17.2,
    cagrLabel: '2021년 이후 연복리 성장 기준',
    projectedTotalM: 15.9,
    defaultHighlighted: true,
    breakdown: {
      wavemark: 6.62,
      envato: 2.58,
      qbridge: 1.1,
      neon: 0.68,
      stripe: 0.54,
      eth: 0.38,
    },
  },
];

function buildFinancialYears(rows: number[][]): YearlyCapitalDatum[] {
  const totals = rows.map(row => Number(row.reduce((sum, value) => sum + value, 0).toFixed(2)));
  return rows.map((row, index) => {
    const year = String(2021 + index), totalM = totals[index];
    const runRateM = index === 5 ? Number((totalM * 4 / 3).toFixed(2)) : totalM;
    return {
      year, axisLabel: index === 5 ? '2026 누적' : year, totalM, runRateM,
      yoyPct: index ? Number(((runRateM / totals[index - 1] - 1) * 100).toFixed(1)) : 0,
      yoyLabel: index ? `${2020 + index}년 대비${index === 5 ? ' 연간 환산' : ''}` : '데모 기준연도',
      cagrPct: index ? Number(((Math.pow(runRateM / totals[0], 1 / index) - 1) * 100).toFixed(1)) : 0,
      cagrLabel: index ? `2021–${year} 연복리 기준${index === 5 ? ' · 연간 환산' : ''}` : '데모 기준연도',
      projectedTotalM: index === 5 ? runRateM : undefined,
      defaultHighlighted: index === 3 || index === 5,
      breakdown: Object.fromEntries(row.map((value, i) => [CAPITAL_FUNDS[i].id, value])),
    };
  });
}

const namedSeries = (names: string[]): FundMeta[] => CAPITAL_FUNDS.map((fund, index) => ({...fund, nameKo: names[index], nameEn: names[index]}));
export const capitalBarVariants = {
  'capital-inflows-bar': {
    title: "자본 유입 현황", description: '6개 가상 운용 펀드의 연도별 순 신규 자본 유입액',
    seriesLabel: '펀드', amountLabel: '순 유입액', growthLabel: '연평균 성장률 (CAGR)',
    funds: namedSeries(['Northstar 성장', 'Harbor 벤처', 'Summit 기회', 'Orbit 디지털', 'Bridge 인컴', 'Atlas 리저브']), years: CAPITAL_YEARLY_DATA,
  },
  'revenue-breakdown-bar': {
    title: "매출 구성", description: '6개 매출원별 인식 매출 · 2026년은 1–9월 누적 데모 데이터',
    seriesLabel: '매출원', amountLabel: '매출액', growthLabel: '연평균 매출 성장률',
    funds: namedSeries(['구독 요금', '사용량 과금', '엔터프라이즈', '전문 서비스', '마켓플레이스', '교육·지원']),
    years: buildFinancialYears([[2.4,1.1,1.5,.8,.4,.2],[3.2,1.7,2,1,.6,.3],[3.8,2.2,2.6,1.1,.7,.4],[4.7,2.9,3.1,1.2,.8,.5],[5.6,3.5,4.1,1.4,1,.7],[5.1,3.4,3.8,1.1,.9,.6]]),
  },
  'headcount-cost-bar': {
    title: "조직별 인건비", description: '급여·복리후생·고용부담금을 포함한 6개 조직 인건비 · 데모 데이터',
    seriesLabel: '조직', amountLabel: '인건비', growthLabel: '연평균 인건비 증감률',
    funds: namedSeries(['엔지니어링', '제품·디자인', '영업', '고객 성공', '마케팅', '경영 지원']),
    years: buildFinancialYears([[2.1,.6,.8,.5,.4,.4],[2.4,.7,.9,.6,.5,.4],[2.8,.8,1,.6,.5,.4],[3.3,1,1.2,.8,.6,.5],[3.9,1.2,1.5,1,.7,.6],[3.4,1,1.2,.8,.7,.5]]),
  },
};

export function CapitalInflowsBlock({
  density = 'normal', variant = 'capital-inflows-bar',
}: CapitalInflowsBlockProps) {
  const fixture = capitalBarVariants[variant];
  const FUNDS = fixture.funds, YEARLY_DATA = fixture.years;
  const [yearRange, setYearRange] = useState<'all' | 'recent4' | 'highlightOnly'>('all');
  const [selectedFundId, setSelectedFundId] = useState<string>('all');
  const [hoveredYear, setHoveredYear] = useState<string | null>(null);
  const [hoveredFundId, setHoveredFundId] = useState<string | null>(null);
  const [selectedYears, setSelectedYears] = useState<string[]>(['2024', '2026']);
  const [showEstimateHatch, setShowEstimateHatch] = useState<boolean>(true);
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'KRW'>('USD');
  const [isYearMenuOpen, setIsYearMenuOpen] = useState(false);
  const [isFundMenuOpen, setIsFundMenuOpen] = useState(false);
  const [isDisplayMenuOpen, setIsDisplayMenuOpen] = useState(false);
  const [lastSyncedText, setLastSyncedText] = useState('샘플 스냅샷');

  const formatAmount = (valM: number) => {
    if (currencyMode === 'KRW') {
      const eok = Math.round(valM * 13.8);
      return `₩${eok.toLocaleString()}억`;
    }
    return `$${valM.toFixed(1)}M`;
  };

  const visibleYears = useMemo(() => {
    if (yearRange === 'recent4') {
      return YEARLY_DATA.slice(2);
    }
    if (yearRange === 'highlightOnly') {
      return YEARLY_DATA.filter((d) => selectedYears.includes(d.year));
    }
    return YEARLY_DATA;
  }, [yearRange, selectedYears, YEARLY_DATA]);

  const activeFunds = useMemo(() => {
    if (selectedFundId === 'all') return FUNDS;
    return FUNDS.filter((f) => f.id === selectedFundId);
  }, [selectedFundId, FUNDS]);

  const toggleYearSelection = (yr: string) => {
    setSelectedYears((prev) =>
      prev.includes(yr)
        ? prev.length > 1
          ? prev.filter((y) => y !== yr)
          : prev
        : [...prev, yr]
    );
  };

  const handleRefresh = () => {
    setSelectedYears(['2024', '2026']);
    setSelectedFundId('all');
    setHoveredYear(null);
    setHoveredFundId(null);
    setYearRange('all');
    setShowEstimateHatch(true);
    setLastSyncedText('샘플을 초기화했습니다');
  };

  // 상단 4개 KPI 카드에 반영될 기준 연도 데이터 (컬럼 호버 시 해당 연도로 즉시 전환, 기본값은 2026)
  const kpiDatum = useMemo(() => {
    if (hoveredYear) {
      const found = YEARLY_DATA.find((d) => d.year === hoveredYear);
      if (found) return found;
    }
    return YEARLY_DATA[YEARLY_DATA.length - 1]; // 기본: 2026 YTD
  }, [hoveredYear, YEARLY_DATA]);

  // KPI 1: 기준 연도 누적 유입액 (특정 펀드 선택 또는 호버 시 해당 펀드 금액 반영)
  const activeFocusFundId =
    selectedFundId !== 'all' ? selectedFundId : hoveredFundId;

  const kpiInflowAmount = useMemo(() => {
    if (activeFocusFundId) {
      return kpiDatum.breakdown[activeFocusFundId] || 0;
    }
    return kpiDatum.totalM;
  }, [kpiDatum, activeFocusFundId]);

  // KPI 2: 최대 비중 펀드 (또는 현재 호버/선택된 펀드의 비중 %)
  const kpiTopFundInfo = useMemo(() => {
    const yearTotal = kpiDatum.totalM;
    if (activeFocusFundId) {
      const fundMeta = FUNDS.find((f) => f.id === activeFocusFundId) || FUNDS[0];
      const fundVal = kpiDatum.breakdown[fundMeta.id] || 0;
      const pct = yearTotal > 0 ? (fundVal / yearTotal) * 100 : 0;
      return {
        label:
          selectedFundId !== 'all' || hoveredFundId
            ? `${kpiDatum.year}년 선택 ${fixture.seriesLabel} 비중`
            : `최대 비중 ${fixture.seriesLabel}`,
        pct: pct.toFixed(1),
        fund: fundMeta,
        amountM: fundVal,
      };
    }

    // 해당 연도에서 가장 비중이 큰 펀드 계산
    let maxFund = FUNDS[0];
    let maxVal = -1;
    for (const f of FUNDS) {
      const v = kpiDatum.breakdown[f.id] || 0;
      if (v > maxVal) {
        maxVal = v;
        maxFund = f;
      }
    }
    const pct = yearTotal > 0 ? (maxVal / yearTotal) * 100 : 0;
    return {
      label: hoveredYear ? `${kpiDatum.year}년 최대 비중 ${fixture.seriesLabel}` : `최대 비중 ${fixture.seriesLabel}`,
      pct: pct.toFixed(1),
      fund: maxFund,
      amountM: maxVal,
    };
  }, [kpiDatum, activeFocusFundId, selectedFundId, hoveredFundId, hoveredYear, FUNDS]);

  // KPI 3: 연간 환산치 (Run-rate)
  const kpiRunRateAmount = useMemo(() => {
    if (activeFocusFundId) {
      const ratio = kpiDatum.runRateM / kpiDatum.totalM;
      return Number(
        ((kpiDatum.breakdown[activeFocusFundId] || 0) * ratio).toFixed(1)
      );
    }
    return kpiDatum.runRateM;
  }, [kpiDatum, activeFocusFundId]);

  // SVG 3D 아이소메트릭 컬럼 차트 좌표 설정
  const svgWidth = 960;
  const svgHeight = 360;
  const chartLeft = 82;
  const chartRight = 918;
  const baseLineY = 292; // $0 기준선
  const topLineY = 56; // $20M 기준선
  const chartHeight = baseLineY - topLineY; // 236px -> $20M
  const maxValM = Math.ceil(Math.max(...YEARLY_DATA.map(d => d.projectedTotalM || d.totalM)) / 5) * 5;

  // 3D 아이소메트릭 오프셋 (우측 상단 투영)
  const isoDx = 15;
  const isoDy = -12;
  const barWidth = 86;

  const yTicks = [1, .75, .5, .25, 0].map(part => ({val: maxValM * part, label: formatAmount(maxValM * part)}));

  const valToY = (v: number) => baseLineY - (v / maxValM) * chartHeight;

  const selectedFundMeta =
    FUNDS.find((f) => f.id === selectedFundId) || null;

  const isPositiveYoY = kpiDatum.yoyPct >= 0;
  const isPositiveCagr = kpiDatum.cagrPct >= 0;

  return (
    <div className="w-full">
      {/* 외곽 그레이 프레임 컨테이너 */}
      <div className="rounded-[22px] border border-zinc-200/90  bg-zinc-100/75  p-2 shadow-xs">
        {/* 상단 타이틀 & 컨트롤 바 */}
        <div className="px-4 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-bold tracking-tight text-zinc-900 ">
              {fixture.title}
            </h3>
            <p className="text-xs text-klic-muted  mt-0.5">
              {fixture.description}
            </p>
          </div>

          {/* 우측 상단 컨트롤 버튼 그룹 */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* 결합형 세그먼트 드롭다운: [ 전체 연도 | 전체 펀드 ] */}
            <div className="inline-flex items-center rounded-xl border border-zinc-200/90  bg-white  shadow-2xs">
              {/* 연도 필터 */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsYearMenuOpen((v) => !v);
                    setIsFundMenuOpen(false);
                    setIsDisplayMenuOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700  hover:bg-zinc-50  rounded-l-xl transition cursor-pointer"
                >
                  <Calendar size={13} className="text-klic-muted" />
                  <span>
                    {yearRange === 'all'
                      ? '전체 연도'
                      : yearRange === 'recent4'
                      ? '최근 4개년'
                      : '선택된 연도만'}
                  </span>
                  <ChevronDown size={13} className="text-klic-muted" />
                </button>

                {isYearMenuOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-44 p-1 rounded-xl border border-zinc-200  bg-white  shadow-xl z-30 text-xs space-y-0.5">
                    {[
                      { id: 'all', label: '전체 연도 (2021–2026)' },
                      { id: 'recent4', label: '최근 4개년 (2023–2026)' },
                      { id: 'highlightOnly', label: '강조 연도만 보기' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setYearRange(opt.id as 'all' | 'recent4' | 'highlightOnly');
                          setIsYearMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-zinc-700  hover:bg-zinc-100 "
                      >
                        <span>{opt.label}</span>
                        {yearRange === opt.id && <Check size={13} className="text-blue-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-[1px] h-4 bg-zinc-200 " />

              {/* 펀드 필터 */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsFundMenuOpen((v) => !v);
                    setIsYearMenuOpen(false);
                    setIsDisplayMenuOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700  hover:bg-zinc-50  rounded-r-xl transition cursor-pointer"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: selectedFundMeta
                        ? selectedFundMeta.frontColor
                        : 'var(--klic-component-block-color-text)',
                    }}
                  />
                  <span>
                    {selectedFundMeta ? selectedFundMeta.nameKo : `전체 ${fixture.seriesLabel}`}
                  </span>
                  <ChevronDown size={13} className="text-klic-muted" />
                </button>

                {isFundMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-56 p-1 rounded-xl border border-zinc-200  bg-white  shadow-xl z-30 text-xs space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFundId('all');
                        setIsFundMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-zinc-700  hover:bg-zinc-100 "
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-klic-inverse " />
                        <span>전체 {fixture.seriesLabel} ({FUNDS.length}개)</span>
                      </span>
                      {selectedFundId === 'all' && (
                        <Check size={13} className="text-blue-500" />
                      )}
                    </button>
                    {FUNDS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          setSelectedFundId(f.id);
                          setIsFundMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-zinc-700  hover:bg-zinc-100 "
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: f.frontColor }}
                          />
                          <span>{f.nameKo}</span>
                        </span>
                        {selectedFundId === f.id && (
                          <Check size={13} className="text-blue-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 표시 설정 (Display) 드롭다운 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsDisplayMenuOpen((v) => !v);
                  setIsYearMenuOpen(false);
                  setIsFundMenuOpen(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200/90  bg-white  text-xs font-medium text-zinc-700  hover:bg-zinc-50  shadow-2xs transition cursor-pointer"
              >
                <SlidersHorizontal size={13} className="text-klic-muted" />
                <span>표시 설정</span>
                <ChevronDown size={13} className="text-klic-muted" />
              </button>

              {isDisplayMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-56 p-2 rounded-xl border border-zinc-200  bg-white  shadow-xl z-30 text-xs space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setShowEstimateHatch((v) => !v)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-zinc-100  text-zinc-700 "
                  >
                    <span>2026 연간 예상치(빗금) 표시</span>
                    {showEstimateHatch && (
                      <Check size={13} className="text-blue-500" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrencyMode((prev) => (prev === 'USD' ? 'KRW' : 'USD'))
                    }
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-zinc-100  text-zinc-700 "
                  >
                    <span>통화 단위: {currencyMode === 'USD' ? 'USD ($M)' : 'KRW (억원)'}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 ">
                      전환
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedYears(
                        selectedYears.length === YEARLY_DATA.length
                          ? ['2024', '2026']
                          : YEARLY_DATA.map((d) => d.year)
                      )
                    }
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-zinc-100  text-zinc-700 "
                  >
                    <span>전체 연도 선명하게 강조</span>
                    {selectedYears.length === YEARLY_DATA.length && (
                      <Check size={13} className="text-blue-500" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* 새로고침 & 더보기 아이콘 버튼 그룹 */}
            <div className="inline-flex items-center rounded-xl border border-zinc-200/90  bg-white  shadow-2xs">
              <button
                type="button"
                onClick={handleRefresh}
                title="데이터 및 필터 초기화"
                className="p-1.5 px-2.5 text-klic-muted  hover:bg-zinc-50  rounded-l-xl transition cursor-pointer"
              >
                <RefreshCw size={13} />
              </button>
              <div className="w-[1px] h-4 bg-zinc-200 " />
              <button
                type="button"
                onClick={() =>
                  setSelectedYears(
                    selectedYears.length === 2
                      ? YEARLY_DATA.map((d) => d.year)
                      : ['2024', '2026']
                  )
                }
                title="하이라이트 연도 전환"
                className="p-1.5 px-2.5 text-klic-muted  hover:bg-zinc-50  rounded-r-xl transition cursor-pointer"
              >
                <MoreHorizontal size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* 내부 메인 화이트 카드 */}
        <div className="rounded-2xl border border-zinc-200/90  bg-white  shadow-2xs overflow-hidden">
          {/* 상단 4열 KPI 요약 헤더 (막대 호버/펀드 선택 시 실시간 수치 연동) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200/80  border-b border-zinc-200/80 ">
            {/* KPI 1: 연도별 누적 유입액 (기본: 2026년 누적 (YTD)) */}
            <div className="p-5 lg:px-6 transition-colors duration-150">
              <div className="text-xs font-medium text-klic-muted ">
                {kpiDatum.year === '2026'
                  ? `2026년 누적 ${fixture.amountLabel} (연초 누적)`
                  : `${kpiDatum.year}년 ${fixture.amountLabel}`}
              </div>
              <div className="mt-1.5 text-2xl sm:text-[26px] font-bold tracking-tight text-zinc-900  font-mono transition-all">
                {formatAmount(kpiInflowAmount)}
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                    isPositiveYoY
                      ? 'bg-blue-50  text-blue-700  border-blue-200/60 '
                      : 'bg-blue-50  text-blue-700  border-blue-200/60 '
                  }`}
                >
                  {isPositiveYoY ? (
                    <TrendingUp size={11} />
                  ) : (
                    <TrendingDown size={11} />
                  )}
                  {isPositiveYoY ? `+${kpiDatum.yoyPct}%` : `${kpiDatum.yoyPct}%`}
                </span>
                <span className="text-xs text-klic-muted ">
                  {kpiDatum.yoyLabel}
                </span>
              </div>
            </div>

            {/* KPI 2: 최대 비중 펀드 (Top Fund - 호버된 연도/세그먼트에 따라 비중 % 및 펀드명 즉시 변경) */}
            <div className="p-5 lg:px-6 transition-colors duration-150">
              <div className="text-xs font-medium text-klic-muted ">
                {kpiTopFundInfo.label}
              </div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-2xl sm:text-[26px] font-bold tracking-tight text-zinc-900  font-mono">
                  {kpiTopFundInfo.pct}%
                </span>
                <span className="text-xs font-mono text-klic-muted ">
                  ({formatAmount(kpiTopFundInfo.amountM)})
                </span>
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded-full border inline-flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${kpiTopFundInfo.fund.frontColor} 10%, transparent)`,
                    borderColor: `color-mix(in srgb, ${kpiTopFundInfo.fund.frontColor} 33%, transparent)`,
                    color: kpiTopFundInfo.fund.frontColor,
                  }}
                >
                  <Shield size={11} />
                </span>
                <span className="text-xs font-medium text-klic-muted  truncate">
                  {kpiTopFundInfo.fund.nameKo}
                </span>
              </div>
            </div>

            {/* KPI 3: 연간 환산치 (Run-rate) */}
            <div className="p-5 lg:px-6 transition-colors duration-150">
              <div className="text-xs font-medium text-klic-muted ">
                {kpiDatum.year}년 연간 환산치
              </div>
              <div className="mt-1.5 text-2xl sm:text-[26px] font-bold tracking-tight text-zinc-900  font-mono">
                {formatAmount(kpiRunRateAmount)}
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                    isPositiveYoY
                      ? 'bg-blue-50  text-blue-700  border-blue-200/60 '
                      : 'bg-blue-50  text-blue-700  border-blue-200/60 '
                  }`}
                >
                  {isPositiveYoY ? (
                    <TrendingUp size={11} />
                  ) : (
                    <TrendingDown size={11} />
                  )}
                  {isPositiveYoY ? `+${kpiDatum.yoyPct}%` : `${kpiDatum.yoyPct}%`}
                </span>
                <span className="text-xs text-klic-muted ">
                  전년 대비 환산 증감
                </span>
              </div>
            </div>

            {/* KPI 4: 연평균 성장률 (Yearly Growth) */}
            <div className="p-5 lg:px-6 transition-colors duration-150">
              <div className="text-xs font-medium text-klic-muted ">
                {fixture.growthLabel}
              </div>
              <div className="mt-1.5 text-2xl sm:text-[26px] font-bold tracking-tight text-zinc-900  font-mono">
                {isPositiveCagr ? `+${kpiDatum.cagrPct}%` : `${kpiDatum.cagrPct}%`}
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-xs text-klic-muted ">
                  {kpiDatum.cagrLabel}
                </span>
              </div>
            </div>
          </div>

          {/* 3D 아이소메트릭 스택 컬럼 차트 영역 */}
          <div className="px-4 sm:px-8 pt-6 pb-6 relative">
            <div className="w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full min-w-[680px] h-auto select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* 2026 YTD 예상치(Run-rate) 빗금 패턴 (전면부) */}
                  <pattern
                    id="hatchFrontPattern"
                    width="7"
                    height="7"
                    patternTransform="rotate(42 0 0)"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="7" height="7" fill="var(--klic-component-block-color-border)" fillOpacity="0.45" />
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="7"
                      stroke="var(--klic-component-block-color-muted)"
                      strokeWidth="2.4"
                      strokeOpacity="0.65"
                    />
                  </pattern>

                  {/* 3D 상단 캡 그라데이션 */}
                  <linearGradient id="topCapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--klic-component-block-color-soft)" />
                    <stop offset="100%" stopColor="var(--klic-component-block-color-border)" />
                  </linearGradient>

                  <linearGradient id="topCapActiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--klic-component-block-color-border)" />
                    <stop offset="100%" stopColor="var(--klic-component-block-color-control-border)" />
                  </linearGradient>
                </defs>

                {/* 수평 그리드 라인 & Y축 라벨 ($20M ~ $0) */}
                {yTicks.map((tick) => {
                  const yPos = valToY(tick.val);
                  return (
                    <g key={tick.val}>
                      <text
                        x={chartLeft - 16}
                        y={yPos + 4}
                        textAnchor="end"
                        className="fill-zinc-400  text-[12px] font-mono"
                      >
                        {tick.label}
                      </text>
                      <line
                        x1={chartLeft}
                        y1={yPos}
                        x2={chartRight}
                        y2={yPos}
                        className="stroke-zinc-100 "
                        strokeWidth="1.2"
                      />
                    </g>
                  );
                })}

                {/* 하단 $0 3D 아이소메트릭 받침대(Pedestal Shelf) */}
                <g>
                  {/* 받침대 상단 평행사변형 면 */}
                  <polygon
                    points={`
                      ${chartLeft},${baseLineY}
                      ${chartLeft + isoDx},${baseLineY + isoDy}
                      ${chartRight + isoDx},${baseLineY + isoDy}
                      ${chartRight},${baseLineY}
                    `}
                    className="fill-zinc-100/95 "
                  />
                  {/* 받침대 전면 두께 립(Lip) */}
                  <rect
                    x={chartLeft}
                    y={baseLineY}
                    width={chartRight - chartLeft}
                    height="8"
                    className="fill-zinc-200/85 "
                  />
                  {/* 받침대 우측 두께 립 */}
                  <polygon
                    points={`
                      ${chartRight},${baseLineY}
                      ${chartRight + isoDx},${baseLineY + isoDy}
                      ${chartRight + isoDx},${baseLineY + isoDy + 8}
                      ${chartRight},${baseLineY + 8}
                    `}
                    className="fill-zinc-300/80 "
                  />
                </g>

                {/* 연도별 3D 아이소메트릭 스택 컬럼 */}
                {visibleYears.map((datum, colIdx) => {
                  const count = visibleYears.length;
                  const slotWidth = (chartRight - chartLeft) / count;
                  const xLeft =
                    chartLeft + colIdx * slotWidth + (slotWidth - barWidth) / 2;
                  const xRight = xLeft + barWidth;

                  const isHighlighted =
                    hoveredYear === datum.year ||
                    selectedYears.includes(datum.year);
                  const groupOpacity = isHighlighted ? 1 : 0.48;

                  // 아래에서 위로 스택 세그먼트 좌표 계산
                  let cumulativeM = 0;
                  const segments = activeFunds.map((fund) => {
                    const val = datum.breakdown[fund.id] || 0;
                    const yBottom = valToY(cumulativeM);
                    cumulativeM += val;
                    const yTop = valToY(cumulativeM);
                    return {
                      fund,
                      val,
                      yBottom,
                      yTop,
                      height: Math.max(0, yBottom - yTop),
                    };
                  });

                  const topSolidY = valToY(cumulativeM);
                  const hasHatch =
                    showEstimateHatch &&
                    datum.projectedTotalM &&
                    selectedFundId === 'all';
                  const hatchTargetM = datum.projectedTotalM || cumulativeM;
                  const hatchTopY = valToY(hatchTargetM);

                  return (
                    <g
                      key={datum.year}
                      className="cursor-pointer transition-opacity duration-200"
                      onMouseEnter={() => setHoveredYear(datum.year)}
                      onMouseLeave={() => {
                        setHoveredYear(null);
                        setHoveredFundId(null);
                      }}
                      onClick={() => toggleYearSelection(datum.year)}
                    >
                      {/* 컬럼 스택 본체 */}
                      <g opacity={groupOpacity}>
                        {segments.map((seg) => {
                          if (seg.height <= 0) return null;
                          return (
                            <g
                              key={seg.fund.id}
                              onMouseEnter={() => setHoveredFundId(seg.fund.id)}
                              onMouseLeave={() => setHoveredFundId(null)}
                            >
                              {/* 전면 직사각형 */}
                              <rect
                                x={xLeft}
                                y={seg.yTop}
                                width={barWidth}
                                height={seg.height}
                                fill={seg.fund.frontColor}
                              />
                              {/* 세그먼트 구분선 (얇은 화이트 심) */}
                              <line
                                x1={xLeft}
                                y1={seg.yTop}
                                x2={xRight}
                                y2={seg.yTop}
                                stroke="var(--klic-component-block-color-panel)"
                                strokeOpacity="0.55"
                                strokeWidth="0.9"
                              />
                              {/* 우측 3D 측면 평행사변형 */}
                              <polygon
                                points={`
                                  ${xRight},${seg.yTop}
                                  ${xRight + isoDx},${seg.yTop + isoDy}
                                  ${xRight + isoDx},${seg.yBottom + isoDy}
                                  ${xRight},${seg.yBottom}
                                `}
                                fill={seg.fund.sideColor}
                              />
                              <line
                                x1={xRight}
                                y1={seg.yTop}
                                x2={xRight + isoDx}
                                y2={seg.yTop + isoDy}
                                stroke="var(--klic-component-block-color-panel)"
                                strokeOpacity="0.35"
                                strokeWidth="0.8"
                              />
                            </g>
                          );
                        })}

                        {/* 솔리드 스택 최상단 3D 뚜껑(Top Cap) */}
                        <polygon
                          points={`
                            ${xLeft},${topSolidY}
                            ${xLeft + isoDx},${topSolidY + isoDy}
                            ${xRight + isoDx},${topSolidY + isoDy}
                            ${xRight},${topSolidY}
                          `}
                          fill={
                            isHighlighted
                              ? 'url(#topCapActiveGrad)'
                              : 'url(#topCapGrad)'
                          }
                        />
                      </g>

                      {/* 2026 YTD 빗금(Hatched) 연간 환산 예상치 블록 */}
                      {hasHatch && (
                        <g>
                          {/* 빗금 전면부 */}
                          <rect
                            x={xLeft}
                            y={hatchTopY}
                            width={barWidth}
                            height={topSolidY - hatchTopY}
                            fill="url(#hatchFrontPattern)"
                          />
                          {/* 빗금 우측 측면부 */}
                          <polygon
                            points={`
                              ${xRight},${hatchTopY}
                              ${xRight + isoDx},${hatchTopY + isoDy}
                              ${xRight + isoDx},${topSolidY + isoDy}
                              ${xRight},${topSolidY}
                            `}
                            fill="var(--klic-component-block-color-border)"
                            fillOpacity="0.65"
                          />
                          {/* 빗금 블록 상단 3D 캡 */}
                          <polygon
                            points={`
                              ${xLeft},${hatchTopY}
                              ${xLeft + isoDx},${hatchTopY + isoDy}
                              ${xRight + isoDx},${hatchTopY + isoDy}
                              ${xRight},${hatchTopY}
                            `}
                            fill="var(--klic-component-block-color-border)"
                            fillOpacity="0.85"
                          />
                          {/* 상단 빗금 오버레이 */}
                          <polygon
                            points={`
                              ${xLeft},${topSolidY}
                              ${xLeft + isoDx},${topSolidY + isoDy}
                              ${xRight + isoDx},${topSolidY + isoDy}
                              ${xRight},${topSolidY}
                            `}
                            fill="url(#hatchFrontPattern)"
                            opacity="0.75"
                          />
                        </g>
                      )}

                      {/* 컬럼 상단 금액 라벨 ($7.6M ~ $15.9M 예상) */}
                      {hasHatch ? (
                        <text
                          x={xLeft + barWidth / 2 + isoDx / 2}
                          y={hatchTopY + isoDy - 10}
                          textAnchor="middle"
                          className="text-[12.5px] font-mono"
                        >
                          <tspan className="fill-zinc-900  font-bold">
                            {formatAmount(hatchTargetM)}
                          </tspan>
                          <tspan className="fill-zinc-400  font-normal">
                            {' '}
                            예상
                          </tspan>
                        </text>
                      ) : (
                        <text
                          x={xLeft + barWidth / 2 + isoDx / 2}
                          y={topSolidY + isoDy - 10}
                          textAnchor="middle"
                          className={`text-[12.5px] font-mono ${
                            isHighlighted
                              ? 'fill-zinc-900  font-bold'
                              : 'fill-zinc-400  font-medium'
                          }`}
                        >
                          {formatAmount(cumulativeM)}
                        </text>
                      )}

                      {/* 하단 X축 연도 라벨 (2021 ~ 2026 누적) */}
                      <text
                        x={xLeft + barWidth / 2}
                        y={baseLineY + 28}
                        textAnchor="middle"
                        className={`text-[12.5px] font-mono ${
                          isHighlighted
                            ? 'fill-zinc-900  font-bold'
                            : 'fill-zinc-400  font-medium'
                        }`}
                      >
                        {datum.year === '2026' ? (
                          <>
                            <tspan className="fill-zinc-900  font-bold">
                              2026
                            </tspan>
                            <tspan className="fill-zinc-400  font-normal">
                              {' '}
                              연초 누적
                            </tspan>
                          </>
                        ) : (
                          datum.axisLabel
                        )}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* 하단 6개 운용 펀드 범례 (호버/클릭 시 상단 KPI 카드 및 차트 즉시 연동) */}
            <div className="mt-3 pt-2 flex items-center justify-center gap-x-6 gap-y-2 flex-wrap">
              {FUNDS.map((fund) => {
                const isSelected =
                  selectedFundId === 'all' || selectedFundId === fund.id;
                return (
                  <button
                    key={fund.id}
                    type="button"
                    onMouseEnter={() => setHoveredFundId(fund.id)}
                    onMouseLeave={() => setHoveredFundId(null)}
                    onClick={() =>
                      setSelectedFundId((prev) =>
                        prev === fund.id ? 'all' : fund.id
                      )
                    }
                    className={`inline-flex items-center gap-2 text-xs transition cursor-pointer ${
                      isSelected
                        ? 'text-zinc-700  font-medium'
                        : 'text-klic-muted  opacity-50'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: fund.frontColor }}
                    />
                    <span>{fund.nameKo}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 외곽 프레임 하단 푸터 캡션 */}
        <div className="px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-klic-muted ">
          <div>
            {currencyMode} 기준 • 가상 조직의 예시 데이터 · {fixture.seriesLabel}를 선택하면 지표가 연동됩니다{currencyMode === 'KRW' ? ' · 데모 환율 $1 = ₩1,380' : ''}
          </div>
          <div>2026년 9월 30일 마감 기준 • {lastSyncedText}</div>
        </div>
      </div>
    </div>
  );
}
