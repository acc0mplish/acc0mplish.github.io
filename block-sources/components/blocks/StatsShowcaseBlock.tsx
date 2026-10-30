import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Activity,
  Gauge,
  Award,
  GitBranch,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Database,
  Users,
  Webhook,
  CheckCircle2,
  Clock,
  BarChart3,
  Layers,
  Globe,
  RefreshCw,
} from 'lucide-react';

export type StatsShowcaseMode =
  | 'all-showcase'
  | 'executive-kpi-strip'
  | 'sla-uptime-summary'
  | 'usage-quota-meters'
  | 'conversion-benchmark'
  | 'dora-engineering';

interface StatsShowcaseBlockProps {
  initialMode?: StatsShowcaseMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

export const StatsShowcaseBlock: React.FC<StatsShowcaseBlockProps> = ({
  initialMode = 'all-showcase',
  density = 'normal',
}) => {
  const [activeTab, setActiveTab] = useState<StatsShowcaseMode>(initialMode);

  useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode]);

  const boxPad =
    density === 'compact' ? 'p-4' : density === 'relaxed' ? 'p-6' : 'p-5';

  // ===========================================================================
  // 1. 핵심 경영 KPI 스트립 (stats-executive-kpi-strip) 상태
  // ===========================================================================
  const [kpiPeriod, setKpiPeriod] = useState<'q2-live' | 'yoy' | 'qoq'>('q2-live');
  const [currency, setCurrency] = useState<'KRW' | 'USD'>('KRW');
  const [selectedKpiId, setSelectedKpiId] = useState<string>('tcv');
  const [expansionBoost, setExpansionBoost] = useState<number>(22);

  const formatMoney = (krwBillion: number) => {
    if (currency === 'KRW') {
      return `₩${krwBillion.toFixed(1)}B`;
    }
    const usdMillion = (krwBillion * 1000) / 1380;
    return `$${usdMillion.toFixed(1)}M`;
  };

  const kpiCards = [
    {
      id: 'tcv',
      label: '총 계약 가치 (Total Contract Value)',
      code: 'FIN-TCV-2026Q2',
      val: formatMoney(kpiPeriod === 'q2-live' ? 42.8 : kpiPeriod === 'yoy' ? 38.4 : 40.1),
      delta: kpiPeriod === 'q2-live' ? '+28.4%' : kpiPeriod === 'yoy' ? '+41.2%' : '+14.6%',
      targetPct: 94,
      sub: '다년 마스터 계약(3년 약정) 비중 68.4%',
      spark: 'M 4 32 L 24 28 L 44 25 L 64 26 L 84 18 L 104 14 L 124 9 L 144 4',
      area: 'M 4 32 L 24 28 L 44 25 L 64 26 L 84 18 L 104 14 L 124 9 L 144 4 L 144 38 L 4 38 Z',
    },
    {
      id: 'arr',
      label: '순신규 연간반복매출 (Net New ARR)',
      code: 'FIN-ARR-BRIDGE',
      val: formatMoney(kpiPeriod === 'q2-live' ? 14.6 + expansionBoost * 0.08 : 13.2),
      delta: `+${(19.2 + expansionBoost * 0.25).toFixed(1)}%`,
      targetPct: 98,
      sub: `기존 고객 업셀링(Expansion) 기여도 +${expansionBoost}%`,
      spark: 'M 4 34 L 24 30 L 44 27 L 64 21 L 84 19 L 104 12 L 124 8 L 144 3',
      area: 'M 4 34 L 24 30 L 44 27 L 64 21 L 84 19 L 104 12 L 124 8 L 144 3 L 144 38 L 4 38 Z',
    },
    {
      id: 'cac',
      label: '고객획득비용 회수기간 (CAC Payback)',
      code: 'GTM-CAC-EFF',
      val: kpiPeriod === 'q2-live' ? '7.4개월' : kpiPeriod === 'yoy' ? '8.1개월' : '7.8개월',
      delta: '-2.8개월 단축',
      targetPct: 91,
      sub: '엔터프라이즈 세일즈 매직 넘버 1.42x',
      spark: 'M 4 28 L 24 24 L 44 22 L 64 18 L 84 14 L 104 11 L 124 8 L 144 5',
      area: 'M 4 28 L 24 24 L 44 22 L 64 18 L 84 14 L 104 11 L 124 8 L 144 5 L 144 38 L 4 38 Z',
    },
    {
      id: 'nrr',
      label: '순매출 유지율 (Net Dollar Retention)',
      code: 'RET-NRR-COHORT',
      val: `${(126.4 + expansionBoost * 0.35).toFixed(1)}%`,
      delta: '+6.8%p YoY',
      targetPct: 99,
      sub: '금융·대기업 로고 리텐션 98.7%',
      spark: 'M 4 30 L 24 26 L 44 22 L 64 20 L 84 15 L 104 11 L 124 7 L 144 4',
      area: 'M 4 30 L 24 26 L 44 22 L 64 20 L 84 15 L 104 11 L 124 7 L 144 4 L 144 38 L 4 38 Z',
    },
  ];

  // ===========================================================================
  // 2. 가용성 & 응답 통계 (stats-sla-uptime-summary) 상태
  // ===========================================================================
  const [slaRegion, setSlaRegion] = useState<'global' | 'seoul' | 'tokyo' | 'frankfurt'>('global');
  const [selectedHeartbeatDay, setSelectedHeartbeatDay] = useState<number>(44);

  const regionTelemetry = {
    global: { uptime: '99.996%', p99: '138ms', p50: '24ms', errRate: '0.004%', txCount: '48,290,400건/일', burnRate: '11.4%' },
    seoul: { uptime: '99.999%', p99: '82ms', p50: '14ms', errRate: '0.001%', txCount: '31,400,000건/일', burnRate: '4.2%' },
    tokyo: { uptime: '99.994%', p99: '146ms', p50: '29ms', errRate: '0.006%', txCount: '10,120,000건/일', burnRate: '16.8%' },
    frankfurt: { uptime: '99.992%', p99: '194ms', p50: '41ms', errRate: '0.008%', txCount: '6,770,400건/일', burnRate: '21.0%' },
  };

  const currentSla = regionTelemetry[slaRegion];

  // ===========================================================================
  // 3. 리소스 할당량 통계 (stats-usage-quota-meters) 상태
  // ===========================================================================
  const [simulatePeakSpike, setSimulatePeakSpike] = useState<boolean>(false);
  const [autoBurstEnabled, setAutoBurstEnabled] = useState<boolean>(true);

  const quotaItems = [
    {
      id: 'api-calls',
      name: '코어 결제·정산 API 게이트웨이 호출량',
      unit: 'M req / 월',
      used: simulatePeakSpike ? 98.4 : 82.4,
      limit: 100.0,
      costPerExtra: '초과 1M당 ₩45,000',
      icon: Zap,
    },
    {
      id: 'vector-db',
      name: '암호화 원장 & 벡터 인덱스 볼륨 (NVMe)',
      unit: 'GB',
      used: simulatePeakSpike ? 975 : 890,
      limit: 1000,
      costPerExtra: '자동 볼륨 확장 +250GB 단위',
      icon: Database,
    },
    {
      id: 'sso-seats',
      name: '엔터프라이즈 SAML 2.0 활성 시트(Seat)',
      unit: '석',
      used: simulatePeakSpike ? 248 : 234,
      limit: 250,
      costPerExtra: 'True-Up 분기 후불 정산 허용',
      icon: Users,
    },
    {
      id: 'webhook-events',
      name: '실시간 이벤트 브로커 & 웹훅 전송량',
      unit: 'M events',
      used: simulatePeakSpike ? 44.2 : 28.6,
      limit: 50.0,
      costPerExtra: '여유 할당량 충분 (안정)',
      icon: Webhook,
    },
  ];

  // ===========================================================================
  // 4. 전환율 벤치마크 통계 (stats-conversion-benchmark) 상태
  // ===========================================================================
  const [benchSegment, setBenchSegment] = useState<'enterprise' | 'midmarket' | 'fintech'>('enterprise');

  const benchmarkData = {
    enterprise: [
      { metric: '평균 연간 계약 금액 (ACV)', ours: '₩184,000,000', top10: '₩165,000,000', median: '₩92,000,000', ourPct: 92, topPct: 82, medPct: 48, badge: '상위 4% (Outperform)' },
      { metric: '기술 PoC → 본계약 수주율 (Win Rate)', ours: '68.4%', top10: '61.0%', median: '38.5%', ourPct: 86, topPct: 76, medPct: 45, badge: "상위 10% 대비 +7.4%p" },
      { metric: '영업 파이프라인 리드타임 (Sales Cycle)', ours: '41일', top10: '48일', median: '84일', ourPct: 90, topPct: 78, medPct: 42, badge: '업계 평균 대비 2.1배 고속' },
      { metric: '다년 약정(Multi-Year) 체결 비중', ours: '72.0%', top10: '64.0%', median: '35.0%', ourPct: 88, topPct: 75, medPct: 40, badge: '해지율(Churn) 1.1% 방어' },
    ],
    midmarket: [
      { metric: '평균 연간 계약 금액 (ACV)', ours: '₩68,000,000', top10: '₩62,000,000', median: '₩38,000,000', ourPct: 88, topPct: 80, medPct: 50, badge: '상위 6% 달성' },
      { metric: '기술 PoC → 본계약 수주율 (Win Rate)', ours: '74.2%', top10: '66.0%', median: '44.0%', ourPct: 91, topPct: 79, medPct: 49, badge: '+8.2%p 우위' },
      { metric: '영업 파이프라인 리드타임 (Sales Cycle)', ours: '22일', top10: '28일', median: '51일', ourPct: 93, topPct: 81, medPct: 44, badge: '셀프서브 온보딩 결합' },
      { metric: '다년 약정(Multi-Year) 체결 비중', ours: '54.0%', top10: '49.0%', median: '24.0%', ourPct: 82, topPct: 72, medPct: 38, badge: '연간 선납 96% 달성' },
    ],
    fintech: [
      { metric: '평균 연간 계약 금액 (ACV)', ours: '₩245,000,000', top10: '₩210,000,000', median: '₩120,000,000', ourPct: 95, topPct: 84, medPct: 52, badge: '금융권 Sovereign 독점' },
      { metric: '기술 PoC → 본계약 수주율 (Win Rate)', ours: '81.5%', top10: '64.0%', median: '41.0%', ourPct: 94, topPct: 76, medPct: 46, badge: '금융보안원 인증 효과' },
      { metric: '영업 파이프라인 리드타임 (Sales Cycle)', ours: '52일', top10: '68일', median: '115일', ourPct: 87, topPct: 74, medPct: 39, badge: '사전 보안심사 패키지화' },
      { metric: '다년 약정(Multi-Year) 체결 비중', ours: '88.0%', top10: '72.0%', median: '45.0%', ourPct: 96, topPct: 80, medPct: 48, badge: '3년 장기 계약 표준화' },
    ],
  };

  // ===========================================================================
  // 5. DORA 엔지니어링 통계 (stats-dora-engineering) 상태
  // ===========================================================================
  const [doraSquad, setDoraSquad] = useState<'all' | 'ledger' | 'sre' | 'fds'>('all');
  const [aiCodeReviewBoost, setAiCodeReviewBoost] = useState<boolean>(true);

  const doraMetricsBySquad = {
    all: { freq: '일 16.4회', leadTime: aiCodeReviewBoost ? '1시간 28분' : '2시간 45분', cfr: '0.8%', mttr: '18분' },
    ledger: { freq: '일 11.2회', leadTime: aiCodeReviewBoost ? '1시간 12분' : '2시간 20분', cfr: '0.3%', mttr: '11분' },
    sre: { freq: '일 24.8회', leadTime: aiCodeReviewBoost ? '54분' : '1시간 50분', cfr: '0.6%', mttr: '9분' },
    fds: { freq: '일 14.0회', leadTime: aiCodeReviewBoost ? '1시간 48분' : '3시간 10분', cfr: '1.1%', mttr: '22분' },
  };

  const currentDora = doraMetricsBySquad[doraSquad];

  const showKpi = activeTab === 'all-showcase' || activeTab === 'executive-kpi-strip';
  const showSla = activeTab === 'all-showcase' || activeTab === 'sla-uptime-summary';
  const showQuota = activeTab === 'all-showcase' || activeTab === 'usage-quota-meters';
  const showBench = activeTab === 'all-showcase' || activeTab === 'conversion-benchmark';
  const showDora = activeTab === 'all-showcase' || activeTab === 'dora-engineering';

  return (
    <div className="space-y-6">
      {/* 상단 서브모드 스위처 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  rounded-[16px] p-1.5">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'all-showcase', label: '전체 5종 통계 쇼케이스', icon: Sparkles },
            { id: 'executive-kpi-strip', label: '1. 핵심 경영 KPI 스트립', icon: TrendingUp },
            { id: 'sla-uptime-summary', label: '2. 가용성 & 응답 지연 통계', icon: Activity },
            { id: 'usage-quota-meters', label: '3. 리소스 할당량 미터기', icon: Gauge },
            { id: 'conversion-benchmark', label: '4. 전환율 업계 벤치마크', icon: Award },
            { id: 'dora-engineering', label: '5. DORA 엔지니어링 통계', icon: GitBranch },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as StatsShowcaseMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[11px] text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white  text-zinc-900  shadow-2xs border border-zinc-200/80 '
                    : 'text-klic-muted  hover:text-zinc-800 '
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-blue-600 " />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden xl:flex items-center gap-2 px-3 text-[11px] text-klic-muted  font-mono">
          <span>KLIC/stats-suite</span>
          <span aria-hidden="true">·</span>
          <span>경영진용 패턴 5종</span>
        </div>
      </div>

      {/* =====================================================================
          1. 핵심 경영 KPI 스트립 & ARR 브릿지 워터폴 (stats-executive-kpi-strip)
      ===================================================================== */}
      {showKpi && (
        <section className="w-full rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
          {/* 상단 베젤 헤더 */}
          <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600 " />
              <span className="text-[13.5px] font-semibold text-zinc-900 ">
                C-Level 핵심 경영 지표(TCV · Net ARR · CAC 회수 · NRR) 스트립 & 코호트 확장 워터폴
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {/* 통화 전환 */}
              <div className="flex items-center gap-1 bg-white/80  p-0.5 rounded-lg border border-zinc-200/80 ">
                {(['KRW', 'USD'] as const).map((cur) => (
                  <button
                    key={cur}
                    type="button"
                    onClick={() => setCurrency(cur)}
                    className={`px-2.5 py-1 rounded-md text-[11.5px] font-mono font-semibold transition-all cursor-pointer ${
                      currency === cur
                        ? 'bg-blue-600 text-klic-on-emphasis shadow-2xs'
                        : 'text-klic-muted  hover:text-zinc-900'
                    }`}
                  >
                    {cur === 'KRW' ? '₩ KRW' : '$ USD'}
                  </button>
                ))}
              </div>

              {/* 비교 기준 기간 전환 */}
              <div className="flex items-center gap-1 bg-white/80  p-0.5 rounded-lg border border-zinc-200/80 ">
                {[
                  { id: 'q2-live', label: '2026 Q2 실시간' },
                  { id: 'yoy', label: 'YoY 전년동기' },
                  { id: 'qoq', label: 'QoQ 전분기' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setKpiPeriod(p.id as 'q2-live' | 'yoy' | 'qoq')}
                    className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-all cursor-pointer ${
                      kpiPeriod === p.id
                        ? 'bg-zinc-100  text-zinc-900  font-semibold'
                        : 'text-klic-muted hover:text-zinc-900 '
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`rounded-[14px] bg-white  border border-zinc-200/80  ${boxPad} space-y-5`}>
            {/* 4열 클린 라이트 KPI 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
              {kpiCards.map((card) => {
                const isSelected = selectedKpiId === card.id;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setSelectedKpiId(card.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50/45  border-blue-500/80 ring-2 ring-blue-500/15 shadow-xs'
                        : 'bg-zinc-50/60  border-zinc-200/80  hover:border-zinc-300 '
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10.5px] font-mono mb-1.5">
                        <span className={isSelected ? 'text-blue-600  font-bold' : 'text-klic-muted'}>
                          {card.code}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md bg-blue-50  text-blue-700  border border-blue-200/70  font-bold flex items-center gap-0.5">
                          <ArrowUpRight className="w-3 h-3" />
                          {card.delta}
                        </span>
                      </div>
                      <div className="text-[12.5px] font-semibold text-klic-muted ">
                        {card.label}
                      </div>
                      <div className="text-2xl font-bold font-mono tracking-tight mt-1 text-zinc-900 ">
                        {card.val}
                      </div>
                    </div>

                    {/* SVG 에리어 스파크라인 */}
                    <div className="my-3">
                      <svg viewBox="0 0 148 38" className="w-full h-9 overflow-visible">
                        <path
                          d={card.area}
                          fill={isSelected ? 'color-mix(in srgb,var(--klic-component-block-color-accent) 12%,transparent)' : 'color-mix(in srgb,var(--klic-component-block-color-accent) 6%,transparent)'}
                        />
                        <path
                          d={card.spark}
                          fill="none"
                          stroke={isSelected ? 'var(--klic-component-block-color-accent)' : 'var(--klic-component-block-color-accent)'}
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-zinc-200/70 ">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-klic-muted">분기 목표 달성률</span>
                        <span className="text-blue-600  font-bold">
                          {card.targetPct}%
                        </span>
                      </div>
                      <div className="text-[11.5px] text-klic-muted  truncate">
                        {card.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 하단 클린 서피스 ARR 브릿지 워터폴 & 업셀링 시뮬레이터 */}
            <div className="rounded-2xl bg-zinc-50/80  p-5 border border-zinc-200/80  grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-zinc-800  flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-blue-600 " />
                    순매출(Net ARR) 증감 브릿지 워터폴 (기초 ARR → 기말 ARR 분해)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50  text-blue-700  border border-blue-200  font-mono text-[11px] font-semibold">
                    Rule of 40 지수: 64.2% (Top 1%)
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2.5 pt-1">
                  {[
                    { step: '기초 ARR', val: formatMoney(28.2), barH: 'h-16', color: 'bg-zinc-400 ' },
                    { step: '+신규 수주', val: `+${formatMoney(9.4)}`, barH: 'h-20', color: 'bg-blue-500' },
                    { step: '+업셀링 확장', val: `+${formatMoney(4.2 + expansionBoost * 0.08)}`, barH: 'h-24', color: 'bg-blue-500' },
                    { step: '-이탈/축소', val: `-${formatMoney(0.8)}`, barH: 'h-6', color: 'bg-blue-500' },
                    { step: '기말 ARR', val: formatMoney(41.0 + expansionBoost * 0.08), barH: 'h-28', color: 'bg-blue-600 ring-2 ring-blue-500/25' },
                  ].map((b, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white  border border-zinc-200/80  flex flex-col justify-between shadow-2xs"
                    >
                      <div className="text-[11px] font-medium text-klic-muted ">{b.step}</div>
                      <div className="h-28 flex items-end my-2 bg-zinc-50  rounded-lg p-1.5">
                        <div className={`w-full rounded-md transition-all duration-300 ${b.barH} ${b.color}`} />
                      </div>
                      <div className="text-xs font-mono font-bold text-zinc-900  truncate">
                        {b.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 p-4 rounded-xl bg-white  border border-zinc-200/80  space-y-3 shadow-2xs">
                <div className="text-xs font-bold text-zinc-900  flex items-center justify-between">
                  <span>엔터프라이즈 업셀링(Expansion) 시뮬레이터</span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50  text-blue-700  font-mono">
                    +{expansionBoost}% 확장 가정
                  </span>
                </div>
                <p className="text-[12px] text-klic-muted  leading-relaxed">
                  기존 엔터프라이즈 고객군의 이상탐지(FDS) 애드온 교차 판매율을 조정하면 상단 Net ARR과 NRR 수치가 실시간으로 재계산됩니다.
                </p>
                <input
                  type="range"
                  min={10}
                  max={40}
                  step={2}
                  value={expansionBoost}
                  onChange={(e) => setExpansionBoost(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono text-klic-muted">
                  <span>보수적 (+10%)</span>
                  <span>기준 목표 (+22%)</span>
                  <span>공격적 (+40%)</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          2. 글로벌 리전 SLA 가용성 & 응답 지연 통계 (stats-sla-uptime-summary)
      ===================================================================== */}
      {showSla && (
        <section className="w-full rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
          <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600 " />
              <span className="text-[13.5px] font-semibold text-zinc-900 ">
                글로벌 멀티리전 가용성(SLA) 60일 하트비트 & P50/P99 응답시간 백분위 통계
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1 bg-white/80  p-0.5 rounded-lg border border-zinc-200/80 ">
              {[
                { id: 'global', label: '글로벌 통합 (3개 리전)' },
                { id: 'seoul', label: '서울 금융존 (ap-northeast-2)' },
                { id: 'tokyo', label: '도쿄 DR (ap-northeast-1)' },
                { id: 'frankfurt', label: '프랑크푸르트 (eu-central-1)' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSlaRegion(r.id as 'global' | 'seoul' | 'tokyo' | 'frankfurt')}
                  className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-all cursor-pointer ${
                    slaRegion === r.id
                      ? 'bg-blue-600 text-klic-on-emphasis font-semibold shadow-2xs'
                      : 'text-klic-muted  hover:text-zinc-900'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className={`rounded-[14px] bg-white  border border-zinc-200/80  ${boxPad} space-y-5`}>
            {/* 4열 핵심 신뢰성 지표 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {[
                { title: '실시간 가동률 (SLA Uptime)', val: currentSla.uptime, target: '약정 기준 99.990% 초과 달성', color: 'text-blue-600 ' },
                { title: 'P99 응답 지연 (Tail Latency)', val: currentSla.p99, target: `P50 중앙값: ${currentSla.p50} (목표 <200ms)`, color: 'text-blue-600 ' },
                { title: '5xx 서버 에러율 (Error Rate)', val: currentSla.errRate, target: `월간 에러 버짓 소진율: ${currentSla.burnRate}`, color: 'text-zinc-900 ' },
                { title: '일일 정산 트랜잭션 처리량', val: currentSla.txCount, target: '무손실 멱등성(Idempotency) 100%', color: 'text-zinc-900 ' },
              ].map((m, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-zinc-200/80  bg-zinc-50/60  space-y-1.5"
                >
                  <div className="text-xs font-semibold text-klic-muted ">{m.title}</div>
                  <div className={`text-2xl font-bold font-mono ${m.color}`}>{m.val}</div>
                  <div className="text-[11px] font-mono text-klic-muted pt-1.5 border-t border-zinc-200/70 ">
                    {m.target}
                  </div>
                </div>
              ))}
            </div>

            {/* 60일 인터랙티브 하트비트 바 & 인스펙터 (클린 라이트 서피스) */}
            <div className="rounded-2xl bg-zinc-50/80  p-5 border border-zinc-200/80  space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-blue-700  font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  60일 연속 가용성 하트비트 모니터 (막대 클릭 시 일별 상세 SLA 검열)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white  border border-zinc-200/80  font-mono text-[11.5px] text-zinc-700 ">
                  선택 일자: D-{60 - selectedHeartbeatDay}일 전 · 가동률{' '}
                  <strong className={selectedHeartbeatDay === 28 ? 'text-amber-600' : 'text-blue-600'}>
                    {selectedHeartbeatDay === 28 ? '99.94% (카나리 스파이크 3분)' : '100.000% (무장애)'}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-1 h-12 bg-white  p-2 rounded-xl border border-zinc-200/70 ">
                {Array.from({ length: 60 }).map((_, idx) => {
                  const isDegraded = idx === 28;
                  const isSelected = selectedHeartbeatDay === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedHeartbeatDay(idx)}
                      className={`flex-1 rounded-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'h-8 ring-2 ring-blue-500 bg-blue-600'
                          : isDegraded
                          ? 'h-7 bg-amber-400 hover:bg-amber-500'
                          : 'h-6 bg-blue-500/85 hover:bg-blue-600'
                      }`}
                      title={`${idx + 1}일차`}
                    />
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-klic-muted">
                <span className="font-mono">60일 전 (2026.03.01)</span>
                <span>유일한 경미 지연(D-32): 외부 PG사 전용선 BGP 라우팅 재수렴 (자동 우회 1.8초 완료)</span>
                <span className="font-mono font-semibold text-blue-600">오늘 · 정상 가동 중</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          3. 리소스 할당량 & 초과 과금 가드레일 통계 (stats-usage-quota-meters)
      ===================================================================== */}
      {showQuota && (
        <section className="w-full rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
          <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-600 " />
              <span className="text-[13.5px] font-semibold text-zinc-900 ">
                엔터프라이즈 약정 리소스 할당량(Quota) 소진율 미터기 및 임계치 초과 방어 설정
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSimulatePeakSpike(!simulatePeakSpike)}
                className={`px-3 py-1.5 rounded-lg text-[11.5px] font-semibold border transition-all cursor-pointer ${
                  simulatePeakSpike
                    ? 'bg-blue-50  text-blue-700  border-blue-300 '
                    : 'bg-white  text-zinc-700  border-zinc-200/80  hover:bg-zinc-50'
                }`}
              >
                {simulatePeakSpike ? '⚡ 월말 결산 피크 트래픽(+20%) 시뮬레이션 중' : '월말 결산 트래픽 스파이크 시뮬레이션'}
              </button>
              <button
                type="button"
                onClick={() => setAutoBurstEnabled(!autoBurstEnabled)}
                className={`px-3 py-1.5 rounded-lg text-[11.5px] font-semibold border transition-all cursor-pointer ${
                  autoBurstEnabled
                    ? 'bg-blue-50  text-blue-700  border-blue-200 '
                    : 'bg-white  text-klic-muted  border-zinc-200 '
                }`}
              >
                {autoBurstEnabled ? '✓ 무중단 Auto-Burst 켜짐 (API 차단 방지)' : 'Auto-Burst 꺼짐 (Hard Cap)'}
              </button>
            </div>
          </div>

          <div className={`rounded-[14px] bg-white  border border-zinc-200/80  ${boxPad}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quotaItems.map((item) => {
                const Icon = item.icon;
                const pct = Math.min(100, Math.round((item.used / item.limit) * 100));
                const isCritical = pct >= 90;
                const isWarning = pct >= 80 && pct < 90;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border space-y-3 transition-all ${
                      isCritical
                        ? 'border-blue-300  bg-blue-50/30 '
                        : 'border-zinc-200/80  bg-zinc-50/60 '
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-50  border border-blue-200/70  text-blue-600  flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-zinc-900 ">{item.name}</div>
                          <div className="text-[11px] font-mono text-klic-muted">{item.costPerExtra}</div>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <div className={`text-sm font-bold ${isCritical ? 'text-blue-600 ' : isWarning ? 'text-amber-600' : 'text-blue-600'}`}>
                          {pct}% 소진
                        </div>
                        <div className="text-[11px] text-klic-muted">
                          {item.used} / {item.limit} {item.unit}
                        </div>
                      </div>
                    </div>

                    {/* 게이지 바 */}
                    <div className="w-full h-2.5 bg-zinc-200/80  rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isCritical ? 'bg-blue-500' : isWarning ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-klic-muted">
                      <span>80% 도달 시 Slack #finops-alerts 경보 발송</span>
                      <span className={isCritical ? 'text-blue-600 font-semibold' : 'text-blue-600'}>
                        {isCritical ? '임계치 초과 임박 · 자동 증설 대기' : '정상 범위 내 운영 중'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          4. 전환율 & ACV 업계 상위 10% 벤치마크 비교 통계 (stats-conversion-benchmark)
      ===================================================================== */}
      {showBench && (
        <section className="w-full rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
          <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600 " />
              <span className="text-[13.5px] font-semibold text-zinc-900 ">
                고객군별 평균 계약 규모(ACV) · 수주율(Win-Rate) 글로벌 상위 10% 벤치마크 비교 통계
              </span>
            </div>

            <div className="flex items-center gap-1 bg-white/80  p-0.5 rounded-lg border border-zinc-200/80 ">
              {[
                { id: 'enterprise', label: 'Enterprise (1,000인 이상)' },
                { id: 'midmarket', label: 'Mid-Market (200~999인)' },
                { id: 'fintech', label: '금융·핀테크 특화군' },
              ].map((seg) => (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => setBenchSegment(seg.id as 'enterprise' | 'midmarket' | 'fintech')}
                  className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-all cursor-pointer ${
                    benchSegment === seg.id
                      ? 'bg-blue-600 text-klic-on-emphasis font-semibold shadow-2xs'
                      : 'text-klic-muted  hover:text-zinc-900'
                  }`}
                >
                  {seg.label}
                </button>
              ))}
            </div>
          </div>

          <div className={`rounded-[14px] bg-white  border border-zinc-200/80  ${boxPad}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benchmarkData[benchSegment].map((row, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-zinc-200/80  bg-zinc-50/50  space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-zinc-900 ">{row.metric}</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50  border border-blue-200  text-[11px] font-mono font-semibold text-blue-700 ">
                      {row.badge}
                    </span>
                  </div>

                  {/* 3단 비교 바 */}
                  <div className="space-y-2.5 text-xs font-mono">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-sans font-semibold text-blue-600 ">KLIC 현재 실적</span>
                        <span className="font-bold text-zinc-900 ">{row.ours}</span>
                      </div>
                      <div className="w-full h-2.5 bg-zinc-200/80  rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${row.ourPct}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 text-klic-muted">
                        <span className="font-sans">글로벌 SaaS 상위 10% 기준선</span>
                        <span>{row.top10}</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-200/80  rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500/75 rounded-full transition-all duration-300" style={{ width: `${row.topPct}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 text-klic-muted">
                        <span className="font-sans">업계 중앙값</span>
                        <span>{row.median}</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-200/80  rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-400 rounded-full transition-all duration-300" style={{ width: `${row.medPct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          5. DORA 엔지니어링 생산성 Elite 등급 통계 (stats-dora-engineering)
      ===================================================================== */}
      {showDora && (
        <section className="w-full rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
          <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-blue-600 " />
              <span className="text-[13.5px] font-semibold text-zinc-900 ">
                DORA 4대 엔지니어링 핵심 지표(배포 빈도 · 리드타임 · 실패율 · MTTR) Elite 등급 달성 통계
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1 bg-white/80  p-0.5 rounded-lg border border-zinc-200/80 ">
              {[
                { id: 'all', label: '전사 엔지니어링 (142명)' },
                { id: 'ledger', label: '코어 원장 스쿼드' },
                { id: 'sre', label: '클라우드 SRE 플랫폼' },
                { id: 'fds', label: '이상탐지(FDS) 팀' },
              ].map((sq) => (
                <button
                  key={sq.id}
                  type="button"
                  onClick={() => setDoraSquad(sq.id as 'all' | 'ledger' | 'sre' | 'fds')}
                  className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-all cursor-pointer ${
                    doraSquad === sq.id
                      ? 'bg-blue-600 text-klic-on-emphasis font-semibold shadow-2xs'
                      : 'text-klic-muted  hover:text-zinc-900'
                  }`}
                >
                  {sq.label}
                </button>
              ))}
            </div>
          </div>

          <div className={`rounded-[14px] bg-white  border border-zinc-200/80  ${boxPad} space-y-5`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {[
                { title: '1. 배포 빈도 (Deployment Freq)', val: currentDora.freq, eliteBench: 'Elite 기준: On-Demand (일 다회)', desc: 'ArgoCD GitOps 무중단 자동 프로모션' },
                { title: '2. 변경 리드 타임 (Lead Time)', val: currentDora.leadTime, eliteBench: 'Elite 기준: 24시간 미만', desc: '첫 커밋 푸시부터 프로덕션 반영까지' },
                { title: '3. 변경 실패율 (Change Failure)', val: currentDora.cfr, eliteBench: 'Elite 기준: 0% ~ 5% 이하', desc: '카나리 5% 구간 이상 감지 시 자동 롤백' },
                { title: '4. 평균 복구 시간 (MTTR)', val: currentDora.mttr, eliteBench: 'Elite 기준: 1시간 미만', desc: '자동화된 플레이북 페일오버 복구' },
              ].map((d, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-zinc-200/80  bg-zinc-50/60  space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50  text-blue-700  font-bold">
                      최상위 등급
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-[12.5px] font-semibold text-zinc-700 ">{d.title}</div>
                  <div className="text-2xl font-bold font-mono text-zinc-900 ">{d.val}</div>
                  <div className="text-[11px] font-mono text-blue-600  font-semibold">{d.eliteBench}</div>
                  <div className="text-[11px] text-klic-muted pt-1.5 border-t border-zinc-200/70 ">
                    {d.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* 하단 PR 사이클 타임 병목 분해 바 (클린 라이트 서피스) */}
            <div className="p-4 rounded-2xl bg-blue-50/45  border border-blue-200/70  flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-zinc-900  flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600 " />
                  PR 처리 시간의 단계별 분석 (총 {currentDora.leadTime})
                </div>
                <div className="text-[11.5px] font-mono text-klic-muted ">
                  코딩 22분 · PR 정적분석 & 리뷰 {aiCodeReviewBoost ? '28분 (자동화 최적화)' : '94분'} · CI 컨테이너 빌드 18분 · 카나리 배포 20분
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAiCodeReviewBoost(!aiCodeReviewBoost)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-klic-on-emphasis text-xs font-semibold shadow-2xs cursor-pointer transition-all"
              >
                {aiCodeReviewBoost ? '✓ 자동 코드 리뷰 & 병렬 CI 가속 적용됨 (-46% 단축)' : '자동 PR 리뷰 & 병렬 CI 가속 켜기'}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
