import React, { useState, useMemo, useEffect } from 'react';
import {
  Filter,
  ChevronDown,
  SlidersHorizontal,
  Check,
  RotateCcw,
} from 'lucide-react';

export type RunStatus = 'succeeded' | 'failed' | 'timed_out' | 'skipped';

export interface RunBarPoint {
  runIndex: number; // 1..20 (1 = oldest, 20 = newest)
  status: RunStatus;
  heightPct: number; // 0..100, with the metric described in each variant
  metricValue?: number;
  durationLabel: string;
  timeAgoLabel: string;
}

export interface CronJobHistoryItem {
  id: string;
  name: string;
  command: string;
  isPaused?: boolean;
  lastRunStatus: RunStatus;
  lastRunAgo: string;
  lastRunDuration: string;
  successRatePct: number;
  p95Duration: string;
  runs: RunBarPoint[];
}

const INITIAL_CRON_JOBS: CronJobHistoryItem[] = [
  {
    id: 'bank-settlement',
    name: '은행 정산 파일 가져오기',
    command: 'settlements:import --banks=all',
    lastRunStatus: 'failed',
    lastRunAgo: '50분 전',
    lastRunDuration: '4분 12초',
    successRatePct: 80,
    p95Duration: 'p95 8분 28초',
    runs: [
      { runIndex: 1, status: 'succeeded', heightPct: 44, durationLabel: '3분 40초', timeAgoLabel: '19시간 전' },
      { runIndex: 2, status: 'succeeded', heightPct: 45, durationLabel: '3분 45초', timeAgoLabel: '18시간 전' },
      { runIndex: 3, status: 'succeeded', heightPct: 44, durationLabel: '3분 38초', timeAgoLabel: '17시간 전' },
      { runIndex: 4, status: 'succeeded', heightPct: 46, durationLabel: '3분 50초', timeAgoLabel: '16시간 전' },
      { runIndex: 5, status: 'succeeded', heightPct: 45, durationLabel: '3분 42초', timeAgoLabel: '15시간 전' },
      { runIndex: 6, status: 'succeeded', heightPct: 44, durationLabel: '3분 41초', timeAgoLabel: '14시간 전' },
      { runIndex: 7, status: 'succeeded', heightPct: 45, durationLabel: '3분 44초', timeAgoLabel: '13시간 전' },
      { runIndex: 8, status: 'succeeded', heightPct: 44, durationLabel: '3분 39초', timeAgoLabel: '12시간 전' },
      { runIndex: 9, status: 'succeeded', heightPct: 46, durationLabel: '3분 52초', timeAgoLabel: '11시간 전' },
      { runIndex: 10, status: 'succeeded', heightPct: 45, durationLabel: '3분 46초', timeAgoLabel: '10시간 전' },
      { runIndex: 11, status: 'succeeded', heightPct: 47, durationLabel: '3분 55초', timeAgoLabel: '9시간 전' },
      { runIndex: 12, status: 'succeeded', heightPct: 48, durationLabel: '4분 02초', timeAgoLabel: '8시간 전' },
      { runIndex: 13, status: 'succeeded', heightPct: 56, durationLabel: '4분 48초', timeAgoLabel: '7시간 전' },
      { runIndex: 14, status: 'succeeded', heightPct: 70, durationLabel: '6분 15초', timeAgoLabel: '6시간 전' },
      { runIndex: 15, status: 'succeeded', heightPct: 88, durationLabel: '7분 54초', timeAgoLabel: '5시간 전' },
      { runIndex: 16, status: 'succeeded', heightPct: 100, durationLabel: '9분 10초', timeAgoLabel: '4시간 전' },
      { runIndex: 17, status: 'failed', heightPct: 46, durationLabel: '4분 05초', timeAgoLabel: '3시간 전' },
      { runIndex: 18, status: 'failed', heightPct: 46, durationLabel: '4분 08초', timeAgoLabel: '2시간 전' },
      { runIndex: 19, status: 'failed', heightPct: 46, durationLabel: '4분 10초', timeAgoLabel: '1시간 30분 전' },
      { runIndex: 20, status: 'failed', heightPct: 46, durationLabel: '4분 12초', timeAgoLabel: '50분 전' },
    ],
  },
  {
    id: 'webhook-retry-queue',
    name: '웹훅 재시도 큐 비우기',
    command: 'retries:drain --max=5000',
    lastRunStatus: 'failed',
    lastRunAgo: '5분 전',
    lastRunDuration: '52초',
    successRatePct: 90,
    p95Duration: 'p95 55초',
    runs: Array.from({ length: 20 }, (_, i) => {
      const idx = i + 1;
      const isFailed = idx >= 19;
      return {
        runIndex: idx,
        status: isFailed ? 'failed' : 'succeeded',
        heightPct: isFailed ? 82 : 76 + (idx % 3) * 3,
        durationLabel: isFailed ? '52초' : `${46 + (idx % 6)}초`,
        timeAgoLabel: `${(20 - idx) * 15 + 5}분 전`,
      };
    }),
  },
  {
    id: 'merchant-search-index',
    name: '가맹점 검색 인덱스 재구축',
    command: 'reindex merchants --shards=12',
    lastRunStatus: 'timed_out',
    lastRunAgo: '10시간 50분 전',
    lastRunDuration: '1시간 00분',
    successRatePct: 90,
    p95Duration: 'p95 1시간 00분',
    runs: Array.from({ length: 20 }, (_, i) => {
      const idx = i + 1;
      const isTimedOut = idx >= 19;
      return {
        runIndex: idx,
        status: isTimedOut ? 'timed_out' : 'succeeded',
        heightPct: isTimedOut ? 98 : 80 + (idx % 2) * 3,
        durationLabel: isTimedOut ? '1시간 00분' : `${48 + (idx % 5)}분`,
        timeAgoLabel: `${(20 - idx) * 12 + 10}시간 전`,
      };
    }),
  },
  {
    id: 'expire-stale-holds',
    name: '장기 미결 정산 보류 만료 처리',
    command: 'holds:expire --older-than=72h',
    lastRunStatus: 'succeeded',
    lastRunAgo: '5분 전',
    lastRunDuration: '18초',
    successRatePct: 100,
    p95Duration: 'p95 19초',
    runs: Array.from({ length: 20 }, (_, i) => {
      const idx = i + 1;
      const isSkipped = idx === 10;
      return {
        runIndex: idx,
        status: isSkipped ? 'skipped' : 'succeeded',
        heightPct: isSkipped ? 16 : 76 + (idx % 3) * 3,
        durationLabel: isSkipped ? '0초 (건너뜀)' : `${16 + (idx % 4)}초`,
        timeAgoLabel: `${(20 - idx) * 30 + 5}분 전`,
      };
    }),
  },
  {
    id: 'retry-failed-payouts',
    name: '실패 정산건 자동 재시도',
    command: 'payouts:retry --max-attempts=3',
    lastRunStatus: 'succeeded',
    lastRunAgo: '20분 전',
    lastRunDuration: '1분 46초',
    successRatePct: 95,
    p95Duration: 'p95 1분 46초',
    runs: Array.from({ length: 20 }, (_, i) => {
      const idx = i + 1;
      const isFailed = idx === 9;
      return {
        runIndex: idx,
        status: isFailed ? 'failed' : 'succeeded',
        heightPct: isFailed ? 84 : 78 + (idx % 3) * 3,
        durationLabel: isFailed ? '1분 58초' : `1분 ${38 + (idx % 9)}초`,
        timeAgoLabel: `${(20 - idx) * 20 + 20}분 전`,
      };
    }),
  },
  {
    id: 'rotate-webhook-keys',
    name: '웹훅 서명 키 순환 교체',
    command: 'keys:rotate --grace=48h',
    lastRunStatus: 'succeeded',
    lastRunAgo: '1일 전',
    lastRunDuration: '42초',
    successRatePct: 100,
    p95Duration: 'p95 43초',
    runs: Array.from({ length: 20 }, (_, i) => {
      const idx = i + 1;
      return {
        runIndex: idx,
        status: 'succeeded',
        heightPct: 78 + (idx % 2) * 4,
        durationLabel: `${39 + (idx % 5)}초`,
        timeAgoLabel: `${21 - idx}일 전`,
      };
    }),
  },
  {
    id: 'compact-ledger-partitions',
    name: '원장 파티션 압축 정리',
    command: 'partitions:compact --keep=90d',
    isPaused: true,
    lastRunStatus: 'succeeded',
    lastRunAgo: '9일 전',
    lastRunDuration: '47분 28초',
    successRatePct: 100,
    p95Duration: 'p95 49분 21초',
    runs: Array.from({ length: 20 }, (_, i) => {
      const idx = i + 1;
      return {
        runIndex: idx,
        status: 'succeeded',
        heightPct: 78 + (idx % 3) * 3,
        durationLabel: `${45 + (idx % 5)}분 12초`,
        timeAgoLabel: `${29 - idx}일 전`,
      };
    }),
  },
];

export type StatusTrackerVariant = 'cron-run-history-tracker' | 'uptime-sla-tracker' | 'incident-health-bars';
type JobFilterType = 'all' | 'issues' | 'succeeded' | 'paused';
type SummaryMetric = { label: string; value: string; detail: string };

const AVAILABILITY_SERVICES = [
  { id: 'payment-api', name: '결제 API', region: 'ap-northeast-2 · /payments', values: [100,100,100,99.98,100,100,100,100,99.95,100,100,100,100,99.97,100,100,100,100,100,100] },
  { id: 'public-api', name: '퍼블릭 API', region: 'global · /v1/health', values: [100,100,100,100,100,99.7,100,100,100,100,98.8,100,100,100,100,100,100,100,99.5,99.6] },
  { id: 'identity', name: '인증 서비스', region: 'ap-northeast-2 · /auth', values: [100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100] },
  { id: 'search-api', name: '검색 API', region: 'ap-northeast-2 · /search', values: [100,100,100,100,97.4,100,100,100,100,100,100,100,100,100,100,100,99.8,100,96.8,97.2] },
  { id: 'webhook-delivery', name: '웹훅 전달', region: 'global · /delivery', values: [100,100,99.9,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100] },
];
const INCIDENT_SERVICES = [
  { id: 'payment-incidents', name: '결제 처리', region: 'Payments · 결제 승인 오류', values: [0,0,0,1,2,0,0,0,0,0,0,0,0,1,0,0,1,3,4,3] },
  { id: 'api-incidents', name: 'API 게이트웨이', region: 'Platform · 응답 지연 알림', values: [0,0,1,0,0,0,0,0,0,1,2,0,0,0,0,0,0,0,1,1] },
  { id: 'infra-incidents', name: '클라우드 인프라', region: 'Infrastructure · 자원 상태 알림', values: [0,0,0,0,0,0,0,0,0,0,1,2,1,0,0,0,0,0,0,0] },
  { id: 'messaging-incidents', name: '메시지 큐', region: 'Messaging · 전달 실패 알림', values: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
];
const mean = (values: number[]) => values.reduce((total, value) => total + value, 0) / values.length;
const round = (value: number, digits = 2) => Number(value.toFixed(digits));

export function getStatusTrackerData(variant: StatusTrackerVariant): CronJobHistoryItem[] {
  if (variant === 'cron-run-history-tracker') return INITIAL_CRON_JOBS;
  const uptime = variant === 'uptime-sla-tracker';
  return (uptime ? AVAILABILITY_SERVICES : INCIDENT_SERVICES).map(service => {
    const runs: RunBarPoint[] = service.values.map((value, index) => ({
      runIndex: index + 1,
      metricValue: value,
      status: uptime ? (value >= 99.9 ? 'succeeded' : value >= 99 ? 'timed_out' : 'failed') : (value === 0 ? 'succeeded' : value <= 2 ? 'timed_out' : 'failed'),
      heightPct: uptime ? value : value / 4 * 100,
      durationLabel: uptime ? `${value.toFixed(2)}%` : `${value}건`,
      timeAgoLabel: uptime ? `9월 ${index + 10}일` : `${index + 4}:00–${index + 5}:00`,
    }));
    const latest = runs[runs.length - 1];
    return {
      id: service.id, name: service.name, command: service.region,
      lastRunStatus: latest.status, lastRunAgo: uptime ? '9월 29일' : '23:00–24:00', lastRunDuration: latest.durationLabel,
      successRatePct: uptime ? round(mean(service.values)) : round(service.values.filter(value => value === 0).length / service.values.length * 100, 1),
      p95Duration: uptime ? 'SLA 99.90%' : `총 ${service.values.reduce((sum, value) => sum + value, 0)}건`,
      runs,
    };
  });
}

const TRACKER_COPY = {
  'cron-run-history-tracker': {
    title: '배치 실행 이력', description: '크론 작업 7개 · 작업별 최근 20회', item: '작업명', recent: '최근 실행', series: '최근 20회 실행 이력', rate: '성공률', measure: '소요 시간',
    caption: '막대 높이: 작업별 실행 소요 시간 · 건너뜀은 점으로 표시',
    statuses: { succeeded: '성공', failed: '실패', timed_out: '시간 초과', skipped: '건너뜀' },
  },
  'uptime-sla-tracker': {
    title: '시스템 가용성 · SLA', description: '서비스 5개 · 9월 10–29일 일별 가용성', item: '서비스 / 엔드포인트', recent: '최근 일 가용성', series: '최근 20일 가용성', rate: '평균 가용성', measure: '가용성',
    caption: '막대 높이: 일별 가용성 0–100% · 서비스별 SLA 목표 99.90%',
    statuses: { succeeded: '목표 충족', failed: '장애', timed_out: 'SLA 미달', skipped: '미측정' },
  },
  'incident-health-bars': {
    title: '서비스 인시던트 헬스', description: '서비스 4개 · 9월 29일 04:00–24:00 시간별 신규 알림', item: '서비스 / 알림 유형', recent: '최근 1시간', series: '최근 20시간 인시던트', rate: '정상 구간', measure: '인시던트',
    caption: '막대 높이: 시간당 신규 인시던트 0–4건 · 0건은 점으로 표시',
    statuses: { succeeded: '정상', failed: '집중 대응', timed_out: '확인 필요', skipped: '미측정' },
  },
} as const;

export function getStatusTrackerSummary(variant: StatusTrackerVariant, jobs: CronJobHistoryItem[]): SummaryMetric[] {
  const points = jobs.flatMap(job => job.runs);
  if (variant === 'uptime-sla-tracker') {
    const values = points.map(point => point.metricValue ?? 0);
    return [
      { label: '평균 가용성', value: `${mean(values).toFixed(2)}%`, detail: '동일 길이의 서비스·일 구간 평균' },
      { label: '관측 서비스', value: `${jobs.length}개`, detail: '서비스별 20일 · UTC 기준' },
      { label: 'SLA 미달 서비스', value: `${jobs.filter(job => job.successRatePct < 99.9).length}개`, detail: '20일 평균 < 99.90%' },
      { label: '누적 비가동 시간', value: `${Math.round(values.reduce((sum, value) => sum + (100 - value) / 100 * 1440, 0))}분`, detail: '서비스별 비가동 시간의 합' },
    ];
  }
  if (variant === 'incident-health-bars') {
    const total = points.reduce((sum, point) => sum + (point.metricValue ?? 0), 0);
    return [
      { label: '신규 인시던트', value: `${total}건`, detail: '4개 서비스 · 최근 20시간 합계' },
      { label: '관측 서비스', value: `${jobs.length}개`, detail: '결제 · API · 인프라 · 메시지 큐' },
      { label: '최근 1시간 발생', value: `${jobs.reduce((sum, job) => sum + (job.runs.at(-1)?.metricValue ?? 0), 0)}건`, detail: '23:00–24:00 신규 알림 합계' },
      { label: '인시던트 없는 구간', value: `${(points.filter(point => point.metricValue === 0).length / points.length * 100).toFixed(1)}%`, detail: `${points.length}개 서비스·시간 구간 기준` },
    ];
  }
  const measured = points.filter(point => point.status !== 'skipped');
  return [
    { label: '성공률', value: `${(measured.filter(point => point.status === 'succeeded').length / measured.length * 100).toFixed(1)}%`, detail: '건너뛴 실행 제외' },
    { label: '총 실행 횟수', value: `${points.length}회`, detail: `${jobs.length}개 작업 · 작업별 최근 20회` },
    { label: '실패 · 시간 초과', value: `${points.filter(point => point.status === 'failed' || point.status === 'timed_out').length}회`, detail: '최근 실행 이력 전체 기준' },
    { label: '일시중지 작업', value: `${jobs.filter(job => job.isPaused).length}개`, detail: '목록의 일시중지 버튼으로 재개' },
  ];
}

export function StatusTrackerBlock({ density = 'normal', variant = 'cron-run-history-tracker' }: { density?: string; variant?: StatusTrackerVariant }) {
  const [jobs, setJobs] = useState<CronJobHistoryItem[]>(() => getStatusTrackerData(variant));
  const [filter, setFilter] = useState<JobFilterType>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [scaleByMetric, setScaleByMetric] = useState(true);
  const [activeBar, setActiveBar] = useState<{ jobId: string; runIndex: number } | null>(null);
  const copy = TRACKER_COPY[variant];
  const cron = variant === 'cron-run-history-tracker';
  useEffect(() => {
    setJobs(getStatusTrackerData(variant)); setFilter('all'); setIsFilterOpen(false); setScaleByMetric(true); setActiveBar(null);
  }, [variant]);
  const filteredJobs = useMemo(() => jobs.filter(job => {
    if (filter === 'issues') return job.lastRunStatus === 'failed' || job.lastRunStatus === 'timed_out';
    if (filter === 'succeeded') return job.lastRunStatus === 'succeeded' && !job.isPaused;
    if (filter === 'paused') return Boolean(job.isPaused);
    return true;
  }), [jobs, filter]);
  const filterLabels: Record<JobFilterType, string> = {
    all: cron ? '전체 작업' : '전체 서비스', issues: cron ? '실패 및 시간 초과' : '확인 필요 서비스',
    succeeded: cron ? '정상 성공 작업' : '정상 서비스', paused: '일시중지된 작업',
  };
  const filterOptions: JobFilterType[] = cron ? ['all', 'issues', 'succeeded', 'paused'] : ['all', 'issues', 'succeeded'];
  const barColor = (status: RunStatus, paused?: boolean) => status === 'failed'
    ? 'bg-[var(--klic-component-block-color-danger)]'
    : status === 'timed_out' ? 'bg-[var(--klic-component-block-color-warning)]'
    : paused ? 'bg-[var(--klic-component-block-color-selected)]' : 'bg-[var(--klic-component-block-color-accent)]';
  const badgeColor = (status: RunStatus) => status === 'failed'
    ? 'text-[var(--klic-component-block-color-danger)] border-current'
    : status === 'timed_out' ? 'text-[var(--klic-component-block-color-warning)] border-current'
    : 'bg-blue-50 text-blue-700 border-blue-200/80';
  return (
    <div className="w-full space-y-6" data-tracker-variant={variant}>
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-[18px] font-bold text-zinc-900 tracking-tight">{copy.title}</h2>
            <p className="mt-0.5 text-[13px] text-klic-muted">{copy.description}</p>
            <p className="mt-1 text-[11px] text-klic-muted">샘플 데이터 · 실제 시스템에 연결되지 않은 예시입니다.</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="relative">
              <button type="button" aria-expanded={isFilterOpen} aria-label={`표시 필터: ${filterLabels[filter]}`} onClick={() => setIsFilterOpen(value => !value)} className="inline-flex items-center justify-between gap-3 px-3.5 py-2 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-800 hover:bg-zinc-50 min-w-[148px]">
                <span className="inline-flex items-center gap-2"><Filter size={14} /><span>{filterLabels[filter]}</span></span><ChevronDown size={14} />
              </button>
              {isFilterOpen && <div className="absolute right-0 mt-1.5 w-44 rounded-xl border border-zinc-200 bg-white shadow-lg p-1 z-30 text-xs">
                {filterOptions.map(key => <button type="button" key={key} onClick={() => { setFilter(key); setIsFilterOpen(false); }} className={`w-full text-left px-3 py-1.5 rounded-lg ${filter === key ? 'bg-blue-50 font-semibold text-blue-700' : 'text-klic-muted hover:bg-zinc-50'}`}>{filterLabels[key]}</button>)}
              </div>}
            </div>
            <button type="button" onClick={() => setScaleByMetric(value => !value)} aria-pressed={scaleByMetric} aria-label={`${copy.measure} 비례 막대 높이 전환`} title={`${copy.measure} 비례 막대 높이 전환`} className={`p-2 rounded-lg border border-zinc-200 ${scaleByMetric ? 'text-blue-700 bg-blue-50' : 'text-klic-muted bg-white'}`}><SlidersHorizontal size={14} /></button>
            <button type="button" onClick={() => { setJobs(getStatusTrackerData(variant)); setFilter('all'); setScaleByMetric(true); setIsFilterOpen(false); setActiveBar(null); }} aria-label="샘플 초기화" title="샘플 초기화" className="p-2 rounded-lg border border-zinc-200 bg-white text-klic-muted hover:bg-zinc-50"><RotateCcw size={14} /></button>
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 mb-4">
          {getStatusTrackerSummary(variant, jobs).map(metric => <div className="p-5" key={metric.label}>
            <div className="text-xs font-medium text-klic-muted">{metric.label}</div>
            <div className="mt-2 text-[28px] font-bold font-mono text-zinc-900 leading-none">{metric.value}</div>
            <div className="mt-3 text-xs text-klic-muted">{metric.detail}</div>
          </div>)}
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white overflow-x-auto">
          <div className="min-w-[820px]">
            <div className="px-5 py-3 border-b border-zinc-200 grid grid-cols-12 items-center text-xs font-medium text-klic-muted">
              <div className="col-span-3">{copy.item}</div><div className="col-span-2">{copy.recent}</div>
              <div className="col-span-5 flex items-center justify-between pr-4"><span>{copy.series}</span><span>과거 → 최신</span></div>
              <div className="col-span-2 text-right">{copy.rate}</div>
            </div>
            <div className="divide-y divide-zinc-100">
              {filteredJobs.length === 0 && <p className="p-6 text-sm text-klic-muted" role="status">이 필터에 해당하는 항목이 없습니다.</p>}
              {filteredJobs.map(job => <div key={job.id} className={`px-5 ${density === 'compact' ? 'py-3' : 'py-4'} grid grid-cols-12 items-center hover:bg-zinc-50/60`}>
                <div className="col-span-3 pr-3 min-w-0">
                  <div className="flex items-center gap-2"><span className={`text-[14px] font-bold truncate ${job.isPaused ? 'text-klic-muted' : 'text-zinc-900'}`} title={job.name}>{job.name}</span>
                    {job.isPaused && <button type="button" onClick={() => setJobs(previous => previous.map(item => item.id === job.id ? { ...item, isPaused: false } : item))} title="샘플 작업 재개" className="px-2 py-0.5 rounded-md border border-zinc-200 text-[11px] text-klic-muted bg-white whitespace-nowrap">일시중지됨</button>}
                  </div>
                  <div className="mt-1 text-[12px] font-mono text-klic-muted truncate" title={job.command}>{job.command}</div>
                </div>
                <div className="col-span-2 pr-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badgeColor(job.lastRunStatus)}`}>{job.lastRunStatus === 'succeeded' && <Check size={10} />}{copy.statuses[job.lastRunStatus]}</span>
                  <div className="mt-1 text-xs text-klic-muted font-mono">{job.lastRunAgo} · {job.lastRunDuration}</div>
                </div>
                <div className="col-span-5 pr-4"><div className="h-9 flex items-end justify-between gap-1 pt-1">
                  {job.runs.map(run => {
                    const active = activeBar?.jobId === job.id && activeBar?.runIndex === run.runIndex;
                    const dot = run.status === 'skipped' || (variant === 'incident-health-bars' && run.metricValue === 0);
                    const detail = `${job.name} · ${run.timeAgoLabel} · ${copy.statuses[run.status]} · ${copy.measure} ${run.durationLabel}`;
                    return <button type="button" key={run.runIndex} aria-label={detail} title={detail} onFocus={() => setActiveBar({ jobId: job.id, runIndex: run.runIndex })} onBlur={() => setActiveBar(null)} onMouseEnter={() => setActiveBar({ jobId: job.id, runIndex: run.runIndex })} onMouseLeave={() => setActiveBar(null)} onClick={() => setActiveBar(active ? null : { jobId: job.id, runIndex: run.runIndex })} className="relative flex-1 h-full flex items-end justify-center group rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                      {active && <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none whitespace-nowrap rounded-lg bg-klic-inverse text-klic-on-emphasis px-2.5 py-1.5 text-[11px] shadow-lg">{run.timeAgoLabel} · {copy.statuses[run.status]}<br />{copy.measure} {run.durationLabel}</span>}
                      <span style={dot ? undefined : { height: `${scaleByMetric ? run.heightPct : 82}%` }} className={`${dot ? 'w-[7px] h-[7px]' : 'w-[7.5px]'} rounded-full ${barColor(run.status, job.isPaused)} ${active ? 'ring-2 ring-blue-300' : ''}`} />
                    </button>;
                  })}
                </div></div>
                <div className="col-span-2 text-right"><div className="text-[14px] font-bold font-mono text-zinc-900">{job.successRatePct}%</div><div className="mt-1 text-xs font-mono text-klic-muted">{job.p95Duration}</div></div>
              </div>)}
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-klic-muted">
          <div className="flex flex-wrap items-center gap-4">{(['succeeded', 'failed', 'timed_out', ...(cron ? ['skipped'] : [])] as RunStatus[]).map(status => <span key={status} className="inline-flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded-full ${barColor(status)}`} />{copy.statuses[status]}</span>)}</div>
          <span>{scaleByMetric ? copy.caption : '막대 높이: 동일 높이 · 색상과 상세 정보로 상태 확인'}</span>
        </div>
      </div>
    </div>
  );
}
