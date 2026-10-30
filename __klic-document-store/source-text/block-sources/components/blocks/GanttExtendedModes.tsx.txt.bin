import { PersonAvatar } from '../PersonAvatar';
import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Diamond,
  Rocket,
  AlertTriangle,
  CheckCircle2,
  Flame,
  ShieldCheck,
  Clock,
  SlidersHorizontal,
  X,
  GitCommit,
  Zap,
  Calendar,
  Flag,
} from 'lucide-react';
export type GridDensity = 'compact' | 'normal' | 'relaxed' | 'default';

const AVATARS = {
  u1: './placeholders/avatar-5be6073573fc.svg',
  u2: './placeholders/avatar-8fe47254ee6c.svg',
  u3: './placeholders/avatar-c501831a6e92.svg',
  u4: './placeholders/avatar-9c0e45372483.svg',
  u5: './placeholders/avatar-d3a1756e9408.svg',
  u6: './placeholders/avatar-c89f2b7981ee.svg',
};

// ============================================================================
// 1. 분기 마일스톤 로드맵 간트 (KLIC/gantt-2)
// ============================================================================

type MilestoneStatus = '달성 완료' | '정상 궤도' | '주의 필요' | '예정';

interface RoadmapItem {
  id: string;
  groupId: string;
  title: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  owner: string;
  avatar: string;
  status: MilestoneStatus;
  progress: number;
  startMonth: number; // 0..11 (1월..12월)
  endMonth: number;   // 0..11
  milestoneMonth?: number; // 0..11
  milestoneLabel?: string;
  barColor: 'violet' | 'blue' | 'emerald' | 'amber' | 'rose' | 'cyan';
  dependsOnId?: string;
}

interface RoadmapGroup {
  id: string;
  title: string;
  okrLabel: string;
  targetRate: number;
}

const ROADMAP_GROUPS: RoadmapGroup[] = [
  {
    id: 'rm-grp-1',
    title: '코어 플랫폼 아키텍처 현대화',
    okrLabel: 'KR-1: 글로벌 레이턴시 45ms 이하 및 99.99% 가용성 달성',
    targetRate: 88,
  },
  {
    id: 'rm-grp-2',
    title: '글로벌 엔터프라이즈 보안 & 컴플라이언스',
    okrLabel: 'KR-2: 북미·유럽 금융권 보안 인증 100% 취득',
    targetRate: 76,
  },
  {
    id: 'rm-grp-3',
    title: '차세대 자율형 워크플로우 & 분석 엔진',
    okrLabel: 'KR-3: 엔터프라이즈 고객사 자동화 도입률 65% 돌파',
    targetRate: 64,
  },
];

const INITIAL_ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: 'rm-1',
    groupId: 'rm-grp-1',
    title: '멀티리전 분산 메시 엔진 v2.5 마이그레이션',
    quarter: 'Q1',
    owner: '김도윤 수석',
    avatar: AVATARS.u2,
    status: '달성 완료',
    progress: 100,
    startMonth: 0,
    endMonth: 2,
    milestoneMonth: 2,
    milestoneLabel: 'v2.5 코어 GA 출시',
    barColor: 'emerald',
  },
  {
    id: 'rm-2',
    groupId: 'rm-grp-1',
    title: '제로 다운타임 DB 샤딩 & 읽기 레플리카 분리',
    quarter: 'Q2',
    owner: '박지훈 리드',
    avatar: AVATARS.u4,
    status: '달성 완료',
    progress: 100,
    startMonth: 2,
    endMonth: 5,
    milestoneMonth: 5,
    milestoneLabel: '샤딩 클러스터 전환',
    barColor: 'blue',
    dependsOnId: 'rm-1',
  },
  {
    id: 'rm-3',
    groupId: 'rm-grp-1',
    title: '글로벌 엣지 캐싱 & 액티브-액티브 페일오버',
    quarter: 'Q3',
    owner: '최서연 엔지니어',
    avatar: AVATARS.u1,
    status: '정상 궤도',
    progress: 72,
    startMonth: 5,
    endMonth: 8,
    milestoneMonth: 8,
    milestoneLabel: '글로벌 리전 개통',
    barColor: 'violet',
    dependsOnId: 'rm-2',
  },
  {
    id: 'rm-4',
    groupId: 'rm-grp-2',
    title: 'SOC2 Type II 및 ISO-27001 자동 감사 파이프라인',
    quarter: 'Q2',
    owner: '한소윤 보안리드',
    avatar: AVATARS.u5,
    status: '달성 완료',
    progress: 100,
    startMonth: 1,
    endMonth: 4,
    milestoneMonth: 4,
    milestoneLabel: 'SOC2 인증서 발급',
    barColor: 'cyan',
  },
  {
    id: 'rm-5',
    groupId: 'rm-grp-2',
    title: '엔터프라이즈 BYOK 고객 관리형 암호화 키 볼트',
    quarter: 'Q3',
    owner: '정민규 아키텍트',
    avatar: AVATARS.u6,
    status: '주의 필요',
    progress: 55,
    startMonth: 4,
    endMonth: 7,
    milestoneMonth: 7,
    milestoneLabel: 'KMS 볼트 보안 심사',
    barColor: 'amber',
    dependsOnId: 'rm-4',
  },
  {
    id: 'rm-6',
    groupId: 'rm-grp-2',
    title: '유럽 GDPR 데이터 레지던시 격리 리전 구축',
    quarter: 'Q4',
    owner: '한소윤 보안리드',
    avatar: AVATARS.u5,
    status: '정상 궤도',
    progress: 35,
    startMonth: 7,
    endMonth: 10,
    milestoneMonth: 10,
    milestoneLabel: 'EU 프랑크푸르트 리전 오픈',
    barColor: 'blue',
    dependsOnId: 'rm-5',
  },
  {
    id: 'rm-7',
    groupId: 'rm-grp-3',
    title: '실시간 이벤트 스트리밍 파이프라인 & 이상 탐지',
    quarter: 'Q2',
    owner: '이하은 PM',
    avatar: AVATARS.u3,
    status: '정상 궤도',
    progress: 85,
    startMonth: 3,
    endMonth: 6,
    milestoneMonth: 6,
    milestoneLabel: '스트리밍 엔진 오픈베타',
    barColor: 'violet',
  },
  {
    id: 'rm-8',
    groupId: 'rm-grp-3',
    title: '노코드 워크플로우 빌더 3.0 및 커스텀 웹훅 액션',
    quarter: 'Q3',
    owner: '김도윤 수석',
    avatar: AVATARS.u2,
    status: '정상 궤도',
    progress: 60,
    startMonth: 6,
    endMonth: 9,
    milestoneMonth: 9,
    milestoneLabel: '워크플로우 3.0 GA',
    barColor: 'emerald',
    dependsOnId: 'rm-7',
  },
  {
    id: 'rm-9',
    groupId: 'rm-grp-3',
    title: '연간 엔터프라이즈 거버넌스 포털 & 통합 리포팅',
    quarter: 'Q4',
    owner: '이하은 PM',
    avatar: AVATARS.u3,
    status: '예정',
    progress: 20,
    startMonth: 8,
    endMonth: 11,
    milestoneMonth: 11,
    milestoneLabel: '2026 연말 총괄 릴리즈',
    barColor: 'rose',
    dependsOnId: 'rm-8',
  },
];

const QUARTERS = [
  { id: 'Q1', label: '2026 1분기 (Q1 · 파운데이션)', months: ['1월', '2월', '3월'], achievement: '100% 완료' },
  { id: 'Q2', label: '2026 2분기 (Q2 · 스케일업)', months: ['4월', '5월', '6월'], achievement: '95% 달성' },
  { id: 'Q3', label: '2026 3분기 (Q3 · 글로벌 확장)', months: ['7월', '8월', '9월'], achievement: '진행 중 (68%)' },
  { id: 'Q4', label: '2026 4분기 (Q4 · 거버넌스 고도화)', months: ['10월', '11월', '12월'], achievement: '계획됨' },
];

const MONTHS_LIST = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export function MilestoneRoadmapGantt({ density = 'default' }: { density?: GridDensity }) {
  const [items, setItems] = useState<RoadmapItem[]>(INITIAL_ROADMAP_ITEMS);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'rm-grp-1': true,
    'rm-grp-2': true,
    'rm-grp-3': true,
  });
  const [quarterFilter, setQuarterFilter] = useState<string>('전체');
  const [highlightMilestones, setHighlightMilestones] = useState<boolean>(true);
  const [colWidth, setColWidth] = useState<number>(86);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newGroupId, setNewGroupId] = useState('rm-grp-1');
  const [newQuarter, setNewQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q3');
  const [newStartMonth, setNewStartMonth] = useState(6);
  const [newEndMonth, setNewEndMonth] = useState(8);
  const [newMilestoneLabel, setNewMilestoneLabel] = useState('');

  const rowHeight = density === 'compact' ? 40 : density === 'relaxed' ? 52 : 46;

  const toggleStatus = (id: string) => {
    const order: MilestoneStatus[] = ['정상 궤도', '달성 완료', '주의 필요', '예정'];
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const next = order[(order.indexOf(it.status) + 1) % order.length];
        return {
          ...it,
          status: next,
          progress: next === '달성 완료' ? 100 : next === '정상 궤도' ? 75 : next === '주의 필요' ? 50 : 20,
        };
      })
    );
  };

  const visibleRows = useMemo(() => {
    const rows: Array<
      | { kind: 'group'; group: RoadmapGroup; avgProgress: number }
      | { kind: 'item'; item: RoadmapItem }
    > = [];

    for (const grp of ROADMAP_GROUPS) {
      const grpItems = items.filter(
        (i) => i.groupId === grp.id && (quarterFilter === '전체' || i.quarter === quarterFilter)
      );
      if (grpItems.length === 0 && quarterFilter !== '전체') continue;
      const avg =
        grpItems.length > 0
          ? Math.round(grpItems.reduce((a, b) => a + b.progress, 0) / grpItems.length)
          : grp.targetRate;
      rows.push({ kind: 'group', group: grp, avgProgress: avg });

      if (expandedGroups[grp.id]) {
        for (const it of grpItems) {
          rows.push({ kind: 'item', item: it });
        }
      }
    }
    return rows;
  }, [items, expandedGroups, quarterFilter]);

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const s = Math.min(newStartMonth, newEndMonth);
    const end = Math.max(newStartMonth, newEndMonth);
    const created: RoadmapItem = {
      id: `rm-custom-${Date.now()}`,
      groupId: newGroupId,
      title: newTitle.trim(),
      quarter: newQuarter,
      owner: '김도윤 수석',
      avatar: AVATARS.u2,
      status: '정상 궤도',
      progress: 65,
      startMonth: s,
      endMonth: end,
      milestoneMonth: end,
      milestoneLabel: newMilestoneLabel.trim() || `${end + 1}월 주요 릴리즈`,
      barColor: 'violet',
    };
    setItems((prev) => [...prev, created]);
    setNewTitle('');
    setNewMilestoneLabel('');
    setIsAddModalOpen(false);
  };

  const renderMilestoneStatusBadge = (status: MilestoneStatus) => {
    switch (status) {
      case '달성 완료':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50  text-blue-700  border border-blue-200/70 ">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            달성 완료
          </span>
        );
      case '정상 궤도':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50  text-blue-700  border border-blue-200/70 ">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            정상 궤도
          </span>
        );
      case '주의 필요':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50  text-amber-700  border border-amber-200/70 ">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            주의 필요
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100  text-klic-muted  border border-zinc-200/70 ">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            예정
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200  bg-white  shadow-xs overflow-hidden relative">
      {/* 상단 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-zinc-200 ">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50  text-blue-700  text-xs font-semibold border border-blue-200/70 ">
            <Diamond size={12} className="fill-blue-600 text-blue-600" />
            2026 연간 마일스톤 로드맵
          </span>

          <div className="flex items-center bg-zinc-100  p-0.5 rounded-lg border border-zinc-200/70 ">
            {['전체', 'Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
              <button
                key={q}
                onClick={() => setQuarterFilter(q)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  quarterFilter === q
                    ? 'bg-white  text-zinc-900  shadow-2xs'
                    : 'text-klic-muted hover:text-zinc-800 '
                }`}
              >
                {q === '전체' ? '전체 분기' : `${q} 분기`}
              </button>
            ))}
          </div>

          <button
            onClick={() => setHighlightMilestones((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
              highlightMilestones
                ? 'border-amber-300  bg-amber-50/80  text-amber-800 '
                : 'border-zinc-200  bg-white  text-klic-muted '
            }`}
          >
            <Diamond size={12} className={highlightMilestones ? 'fill-amber-500 text-amber-600' : 'text-klic-muted'} />
            <span>마일스톤 다이아몬드 강조</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-3 text-xs text-klic-muted  mr-2">
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rotate-45 bg-amber-500 inline-block border border-white " />
              핵심 출시 마일스톤 ({items.length}건)
            </span>
            <span>·</span>
            <span>연간 목표 달성률 <strong className="text-zinc-900  font-mono">78%</strong></span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-klic-inverse  text-klic-on-emphasis  text-xs font-semibold hover:bg-klic-inverse  transition shadow-2xs"
          >
            <Plus size={14} />
            <span>마일스톤 추가</span>
          </button>
        </div>
      </div>

      {/* 본문: 좌측 이니셔티브 트리 + 우측 분기/월 타임라인 */}
      <div className="flex flex-col lg:flex-row relative">
        {/* 좌측 패널 */}
        <div className="w-full lg:w-[490px] shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-200  bg-white  z-10">
          <div className="h-[68px] flex items-end border-b border-zinc-200  bg-zinc-50/70  px-3 pb-2.5 text-[11px] font-medium text-klic-muted ">
            <div className="flex-1 min-w-0">전략 이니셔티브 / 로드맵 과제</div>
            <div className="w-[54px] text-center shrink-0">목표 분기</div>
            <div className="w-[82px] text-center shrink-0">궤도 상태</div>
            <div className="w-[62px] text-right shrink-0 pr-1">달성률</div>
          </div>

          <div className="divide-y divide-zinc-200/70 ">
            {visibleRows.map((row) => {
              if (row.kind === 'group') {
                const isExpanded = !!expandedGroups[row.group.id];
                return (
                  <div
                    key={row.group.id}
                    style={{ height: rowHeight }}
                    className="flex items-center justify-between px-3 bg-zinc-50/90  text-xs font-semibold text-zinc-800 "
                  >
                    <button
                      onClick={() =>
                        setExpandedGroups((prev) => ({ ...prev, [row.group.id]: !prev[row.group.id] }))
                      }
                      className="flex items-center gap-1.5 min-w-0 truncate text-left"
                    >
                      {isExpanded ? (
                        <ChevronDown size={14} className="text-klic-muted shrink-0" />
                      ) : (
                        <ChevronRight size={14} className="text-klic-muted shrink-0" />
                      )}
                      <Flag size={13} className="text-blue-600  shrink-0" />
                      <span className="truncate">{row.group.title}</span>
                    </button>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:inline-block text-[10px] font-normal text-klic-muted  truncate max-w-[160px]">
                        {row.group.okrLabel}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-blue-100/80  text-blue-700 ">
                        {row.avgProgress}%
                      </span>
                    </div>
                  </div>
                );
              }

              const { item } = row;
              return (
                <div
                  key={item.id}
                  style={{ height: rowHeight }}
                  className="flex items-center px-3 hover:bg-zinc-50/80  transition text-xs"
                >
                  <div className="flex-1 min-w-0 flex items-center gap-2 pl-4 pr-2">
                    <PersonAvatar
                      src={item.avatar}
                      alt={item.owner}
                      className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-zinc-200 "
                    />
                    <span className="text-zinc-800  font-medium truncate">
                      {item.title}
                    </span>
                  </div>

                  <div className="w-[54px] text-center shrink-0">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-100  text-[11px] font-mono font-semibold text-zinc-700 ">
                      {item.quarter}
                    </span>
                  </div>

                  <div className="w-[82px] flex justify-center shrink-0">
                    <button
                      onClick={() => toggleStatus(item.id)}
                      title="클릭하여 상태 변경"
                      className="cursor-pointer hover:opacity-85 transition"
                    >
                      {renderMilestoneStatusBadge(item.status)}
                    </button>
                  </div>

                  <div className="w-[62px] text-right font-mono text-[11px] font-semibold text-zinc-700  pr-1 shrink-0">
                    {item.progress}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 우측 분기/월 타임라인 */}
        <div className="flex-1 overflow-x-auto relative">
          <div style={{ width: 12 * colWidth }} className="relative select-none">
            {/* 2단 헤더: 분기 + 월 */}
            <div className="h-[68px] border-b border-zinc-200  bg-zinc-50/60  flex flex-col justify-between">
              <div className="flex border-b border-zinc-200/70  h-[34px]">
                {QUARTERS.map((q) => (
                  <div
                    key={q.id}
                    style={{ width: 3 * colWidth }}
                    className="px-3 flex items-center justify-between border-r border-zinc-200  text-xs font-semibold text-zinc-800 "
                  >
                    <span>{q.label}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/70  text-klic-muted ">
                      {q.achievement}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex h-[34px]">
                {MONTHS_LIST.map((m, idx) => {
                  const isCurrentMonth = idx === 6; // 7월
                  return (
                    <div
                      key={m}
                      style={{ width: colWidth }}
                      className={`flex items-center justify-center border-r border-zinc-200/60  text-[11px] font-medium ${
                        isCurrentMonth
                          ? 'bg-blue-50/90  text-blue-700  font-bold'
                          : 'text-klic-muted '
                      }`}
                    >
                      2026년 {m}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 그리드 배경 + 현재 시점(7월 중순) 수직선 */}
            <div
              style={{ height: visibleRows.length * rowHeight }}
              className="relative"
            >
              {/* 월별 컬럼 라인 & 분기 경계선 */}
              <div className="absolute inset-0 flex pointer-events-none">
                {MONTHS_LIST.map((m, idx) => {
                  const isQuarterEnd = (idx + 1) % 3 === 0;
                  return (
                    <div
                      key={m}
                      style={{ width: colWidth }}
                      className={`h-full ${
                        isQuarterEnd
                          ? 'border-r-2 border-zinc-300/80 '
                          : 'border-r border-zinc-200/50 '
                      } ${idx === 6 ? 'bg-blue-50/20 ' : ''}`}
                    />
                  );
                })}
              </div>

              {/* 현재 시점 수직 마커 (7월 중순) */}
              <div
                style={{ left: 6.5 * colWidth }}
                className="absolute top-0 bottom-0 w-[2px] bg-blue-500/80 z-20 pointer-events-none"
              >
                <div className="absolute -top-2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-blue-600 text-klic-on-emphasis text-[9px] font-semibold whitespace-nowrap shadow-xs">
                  현재 (7월 중순)
                </div>
              </div>

              {/* 행별 로드맵 바 & 마일스톤 다이아몬드 */}
              {visibleRows.map((row) => {
                if (row.kind === 'group') {
                  return (
                    <div
                      key={row.group.id}
                      style={{ height: rowHeight }}
                      className="border-b border-zinc-200/70  bg-zinc-50/50  relative"
                    />
                  );
                }

                const { item } = row;
                const left = item.startMonth * colWidth + 10;
                const width = (item.endMonth - item.startMonth + 1) * colWidth - 20;

                const colorMap = {
                  violet: {
                    track: 'bg-blue-100/90  border-blue-300/80 ',
                    fill: 'bg-blue-500',
                  },
                  blue: {
                    track: 'bg-blue-100/90  border-blue-300/80 ',
                    fill: 'bg-blue-500',
                  },
                  emerald: {
                    track: 'bg-blue-100/90  border-blue-300/80 ',
                    fill: 'bg-blue-500',
                  },
                  amber: {
                    track: 'bg-amber-100/90  border-amber-300/80 ',
                    fill: 'bg-amber-500',
                  },
                  rose: {
                    track: 'bg-blue-100/90  border-blue-300/80 ',
                    fill: 'bg-blue-500',
                  },
                  cyan: {
                    track: 'bg-blue-100/90  border-blue-300/80 ',
                    fill: 'bg-blue-500',
                  },
                }[item.barColor];

                const milestoneX =
                  item.milestoneMonth !== undefined
                    ? (item.milestoneMonth + 1) * colWidth - 14
                    : left + width;

                return (
                  <div
                    key={item.id}
                    style={{ height: rowHeight }}
                    className="border-b border-zinc-200/60  relative flex items-center"
                  >
                    {/* 로드맵 투톤 진행 바 */}
                    <div
                      style={{ left, width: Math.max(44, width) }}
                      className={`absolute h-[24px] rounded-lg border ${colorMap.track} overflow-hidden flex items-center shadow-2xs`}
                    >
                      <div
                        style={{ width: `${item.progress}%` }}
                        className={`h-full ${colorMap.fill} transition-all duration-300`}
                      />
                      <div className="absolute inset-0 px-2.5 flex items-center justify-between text-[11px] font-semibold text-zinc-900  pointer-events-none">
                        <span className="truncate drop-shadow-2xs">{item.title}</span>
                        <span className="font-mono text-[10px] ml-1.5 shrink-0">{item.progress}%</span>
                      </div>
                    </div>

                    {/* 마일스톤 다이아몬드 마커 (◆) */}
                    {item.milestoneLabel && (
                      <div
                        style={{ left: milestoneX }}
                        className="absolute z-20 flex items-center gap-1.5 pointer-events-none"
                      >
                        <div
                          className={`w-4 h-4 rotate-45 rounded-[3px] flex items-center justify-center shadow-sm transition-transform ${
                            highlightMilestones
                              ? 'bg-amber-500 ring-2 ring-amber-200  scale-110'
                              : 'bg-klic-inverse '
                          }`}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white " />
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap border shadow-2xs ${
                            highlightMilestones
                              ? 'bg-amber-50  text-amber-800  border-amber-300/80 '
                              : 'bg-white/95  text-zinc-700  border-zinc-200 '
                          }`}
                        >
                          ◆ {item.milestoneLabel}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 우측 하단 줌 컨트롤 */}
            <div className="sticky bottom-3 left-3 z-30 inline-flex items-center bg-white/95  border border-zinc-200  rounded-lg shadow-md m-3">
              <button
                onClick={() => setColWidth((w) => Math.max(68, w - 10))}
                className="w-7 h-7 flex items-center justify-center text-klic-muted  hover:bg-zinc-100  rounded-l-lg text-sm font-bold"
              >
                -
              </button>
              <div className="w-[1px] h-4 bg-zinc-200 " />
              <button
                onClick={() => setColWidth((w) => Math.min(120, w + 10))}
                className="w-7 h-7 flex items-center justify-center text-klic-muted  hover:bg-zinc-100  rounded-r-lg text-sm font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 마일스톤 추가 모달 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-klic-inverse/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white  border border-zinc-200  shadow-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 ">
              <h4 className="font-semibold text-sm text-zinc-900 ">
                새 분기 마일스톤 과제 추가
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-klic-muted hover:text-zinc-700"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddMilestone} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-zinc-700  mb-1">
                  이니셔티브 과제명
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 글로벌 멀티클라우드 DR 자동 훈련 시스템"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200  bg-white  text-zinc-900 "
                />
              </div>
              <div>
                <label className="block font-medium text-zinc-700  mb-1">
                  마일스톤 다이아몬드 표기명 (◆)
                </label>
                <input
                  type="text"
                  value={newMilestoneLabel}
                  onChange={(e) => setNewMilestoneLabel(e.target.value)}
                  placeholder="예: DR 자동 페일오버 인증 완료"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200  bg-white  text-zinc-900 "
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-medium text-zinc-700  mb-1">
                    전략 그룹
                  </label>
                  <select
                    value={newGroupId}
                    onChange={(e) => setNewGroupId(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-zinc-200  bg-white "
                  >
                    {ROADMAP_GROUPS.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-zinc-700  mb-1">
                    목표 분기
                  </label>
                  <select
                    value={newQuarter}
                    onChange={(e) => setNewQuarter(e.target.value as 'Q1' | 'Q2' | 'Q3' | 'Q4')}
                    className="w-full px-2.5 py-2 rounded-lg border border-zinc-200  bg-white "
                  >
                    <option value="Q1">Q1 (1분기)</option>
                    <option value="Q2">Q2 (2분기)</option>
                    <option value="Q3">Q3 (3분기)</option>
                    <option value="Q4">Q4 (4분기)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-medium text-zinc-700  mb-1">
                    시작 월
                  </label>
                  <select
                    value={newStartMonth}
                    onChange={(e) => setNewStartMonth(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg border border-zinc-200  bg-white "
                  >
                    {MONTHS_LIST.map((m, idx) => (
                      <option key={m} value={idx}>
                        2026년 {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-zinc-700  mb-1">
                    마일스톤 완료 월
                  </label>
                  <select
                    value={newEndMonth}
                    onChange={(e) => setNewEndMonth(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg border border-zinc-200  bg-white "
                  >
                    {MONTHS_LIST.map((m, idx) => (
                      <option key={m} value={idx}>
                        2026년 {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200  text-klic-muted "
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-klic-inverse  text-klic-on-emphasis  font-semibold"
                >
                  로드맵에 추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. 스프린트 릴리즈 트레인 간트 (KLIC/gantt-3)
// ============================================================================

type ReleaseGateStatus = '배포 승인' | 'QA 검증 중' | '프리즈 대기' | '개발 진행';

interface SprintEpicItem {
  id: string;
  squadId: string;
  epicKey: string;
  title: string;
  storyPoints: number;
  releaseVersion: string;
  gateStatus: ReleaseGateStatus;
  owner: string;
  avatar: string;
  startSlot: number; // 0..11
  endSlot: number;   // 0..11
  progress: number;
  accent: 'blue' | 'violet' | 'emerald' | 'amber' | 'rose' | 'cyan';
  dependsOnId?: string;
}

const SQUADS = [
  { id: 'sq-pay', name: '결제·정산 코어 스쿼드', velocity: '64 SP / 스프린트', lead: '박지훈' },
  { id: 'sq-sre', name: '클라우드 인프라·SRE 스쿼드', velocity: '52 SP / 스프린트', lead: '최서연' },
  { id: 'sq-fe', name: '디자인 시스템·FE 스쿼드', velocity: '58 SP / 스프린트', lead: '김도윤' },
];

const SPRINT_HEADERS = [
  {
    id: 'sp-24',
    name: '스프린트 24 (7/1 ~ 7/14)',
    releaseTag: '🚀 v2.4.0 정식 배포 (7/14)',
    slots: [
      { col: 0, label: 'W1 개발', sub: '7/1~7/5', isFreeze: false },
      { col: 1, label: 'W2 통합', sub: '7/6~7/10', isFreeze: false },
      { col: 2, label: 'QA 프리즈', sub: '7/11~7/14', isFreeze: true },
    ],
  },
  {
    id: 'sp-25',
    name: '스프린트 25 (7/15 ~ 7/28)',
    releaseTag: '🚀 v2.4.2 핫픽스 & 안정화 (7/28)',
    slots: [
      { col: 3, label: 'W1 개발', sub: '7/15~7/19', isFreeze: false },
      { col: 4, label: 'W2 통합', sub: '7/20~7/24', isFreeze: false },
      { col: 5, label: 'QA 프리즈', sub: '7/25~7/28', isFreeze: true },
    ],
  },
  {
    id: 'sp-26',
    name: '스프린트 26 (7/29 ~ 8/11)',
    releaseTag: '🚀 v2.5.0-rc1 카나리 (8/11)',
    slots: [
      { col: 6, label: 'W1 개발', sub: '7/29~8/2', isFreeze: false },
      { col: 7, label: 'W2 통합', sub: '8/3~8/7', isFreeze: false },
      { col: 8, label: 'QA 프리즈', sub: '8/8~8/11', isFreeze: true },
    ],
  },
  {
    id: 'sp-27',
    name: '스프린트 27 (8/12 ~ 8/25)',
    releaseTag: '🚀 v2.5.0 메이저 GA (8/25)',
    slots: [
      { col: 9, label: 'W1 개발', sub: '8/12~8/16', isFreeze: false },
      { col: 10, label: 'W2 통합', sub: '8/17~8/21', isFreeze: false },
      { col: 11, label: 'QA 프리즈', sub: '8/22~8/25', isFreeze: true },
    ],
  },
];

const ALL_SLOTS = SPRINT_HEADERS.flatMap((s) => s.slots);

const INITIAL_SPRINT_EPICS: SprintEpicItem[] = [
  {
    id: 'ep-1',
    squadId: 'sq-pay',
    epicKey: 'PAY-402',
    title: '글로벌 다중 통화(KRW/USD/EUR) 실시간 정산 원장 v2',
    storyPoints: 21,
    releaseVersion: 'v2.4.0',
    gateStatus: '배포 승인',
    owner: '박지훈',
    avatar: AVATARS.u4,
    startSlot: 0,
    endSlot: 2,
    progress: 100,
    accent: 'emerald',
  },
  {
    id: 'ep-2',
    squadId: 'sq-pay',
    epicKey: 'PAY-418',
    title: '카드사 정기결제 재시도 스마트 라우팅 & 웹훅멱등성 보장',
    storyPoints: 13,
    releaseVersion: 'v2.4.2',
    gateStatus: 'QA 검증 중',
    owner: '정민규',
    avatar: AVATARS.u6,
    startSlot: 2,
    endSlot: 5,
    progress: 85,
    accent: 'blue',
    dependsOnId: 'ep-1',
  },
  {
    id: 'ep-3',
    squadId: 'sq-pay',
    epicKey: 'PAY-455',
    title: '엔터프라이즈 분할 청구서 발행 및 ERP 자동 전표 연동',
    storyPoints: 18,
    releaseVersion: 'v2.5.0',
    gateStatus: '개발 진행',
    owner: '박지훈',
    avatar: AVATARS.u4,
    startSlot: 6,
    endSlot: 10,
    progress: 45,
    accent: 'violet',
    dependsOnId: 'ep-2',
  },
  {
    id: 'ep-4',
    squadId: 'sq-sre',
    epicKey: 'SRE-210',
    title: '카나리 배포 프로모션 자동 롤백 가드레일 (에러율 > 0.2%)',
    storyPoints: 13,
    releaseVersion: 'v2.4.0',
    gateStatus: '배포 승인',
    owner: '최서연',
    avatar: AVATARS.u1,
    startSlot: 0,
    endSlot: 2,
    progress: 100,
    accent: 'cyan',
  },
  {
    id: 'ep-5',
    squadId: 'sq-sre',
    epicKey: 'SRE-229',
    title: '쿠버네티스 워커 노드 스팟 인스턴스 무중단 드레이닝',
    storyPoints: 8,
    releaseVersion: 'v2.4.2',
    gateStatus: '프리즈 대기',
    owner: '한소윤',
    avatar: AVATARS.u5,
    startSlot: 3,
    endSlot: 5,
    progress: 78,
    accent: 'amber',
    dependsOnId: 'ep-4',
  },
  {
    id: 'ep-6',
    squadId: 'sq-sre',
    epicKey: 'SRE-244',
    title: '오픈텔레메트리 분산 트레이싱 샘플링 최적화 & 비용 35% 절감',
    storyPoints: 13,
    releaseVersion: 'v2.5.0',
    gateStatus: '개발 진행',
    owner: '최서연',
    avatar: AVATARS.u1,
    startSlot: 6,
    endSlot: 11,
    progress: 40,
    accent: 'rose',
    dependsOnId: 'ep-5',
  },
  {
    id: 'ep-7',
    squadId: 'sq-fe',
    epicKey: 'FE-801',
    title: 'KLIC 데이터 그리드 가상 스크롤 & 다크모드 토큰 통합',
    storyPoints: 13,
    releaseVersion: 'v2.4.2',
    gateStatus: 'QA 검증 중',
    owner: '김도윤',
    avatar: AVATARS.u2,
    startSlot: 1,
    endSlot: 4,
    progress: 90,
    accent: 'violet',
  },
  {
    id: 'ep-8',
    squadId: 'sq-fe',
    epicKey: 'FE-834',
    title: '실시간 간트 & 생키 차트 대시보드 웹 워커 렌더링 엔진',
    storyPoints: 21,
    releaseVersion: 'v2.5.0-rc1',
    gateStatus: '프리즈 대기',
    owner: '이하은',
    avatar: AVATARS.u3,
    startSlot: 4,
    endSlot: 8,
    progress: 70,
    accent: 'blue',
    dependsOnId: 'ep-7',
  },
  {
    id: 'ep-9',
    squadId: 'sq-fe',
    epicKey: 'FE-860',
    title: '접근성 WCAG 2.2 AA 키보드 내비게이션 & E2E 회귀 테스트',
    storyPoints: 8,
    releaseVersion: 'v2.5.0',
    gateStatus: '개발 진행',
    owner: '김도윤',
    avatar: AVATARS.u2,
    startSlot: 8,
    endSlot: 11,
    progress: 30,
    accent: 'emerald',
    dependsOnId: 'ep-8',
  },
];

export function SprintReleaseGantt({ density = 'default' }: { density?: GridDensity }) {
  const [epics, setEpics] = useState<SprintEpicItem[]>(INITIAL_SPRINT_EPICS);
  const [selectedSquad, setSelectedSquad] = useState<string>('전체');
  const [showFreezeHighlight, setShowFreezeHighlight] = useState<boolean>(true);
  const [colWidth, setColWidth] = useState<number>(84);

  const rowHeight = density === 'compact' ? 40 : density === 'relaxed' ? 52 : 46;

  const cycleGateStatus = (id: string) => {
    const order: ReleaseGateStatus[] = ['개발 진행', '프리즈 대기', 'QA 검증 중', '배포 승인'];
    setEpics((prev) =>
      prev.map((ep) => {
        if (ep.id !== id) return ep;
        const next = order[(order.indexOf(ep.gateStatus) + 1) % order.length];
        return {
          ...ep,
          gateStatus: next,
          progress: next === '배포 승인' ? 100 : next === 'QA 검증 중' ? 88 : next === '프리즈 대기' ? 75 : 45,
        };
      })
    );
  };

  const visibleRows = useMemo(() => {
    const rows: Array<
      | { kind: 'squad'; squad: (typeof SQUADS)[number]; totalSp: number }
      | { kind: 'epic'; epic: SprintEpicItem }
    > = [];

    for (const sq of SQUADS) {
      if (selectedSquad !== '전체' && sq.id !== selectedSquad) continue;
      const sqEpics = epics.filter((e) => e.squadId === sq.id);
      const totalSp = sqEpics.reduce((a, b) => a + b.storyPoints, 0);
      rows.push({ kind: 'squad', squad: sq, totalSp });
      for (const ep of sqEpics) {
        rows.push({ kind: 'epic', epic: ep });
      }
    }
    return rows;
  }, [epics, selectedSquad]);

  const renderGateBadge = (status: ReleaseGateStatus) => {
    switch (status) {
      case '배포 승인':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50  text-blue-700  border border-blue-200/70 ">
            <CheckCircle2 size={11} className="text-blue-500" />
            배포 승인
          </span>
        );
      case 'QA 검증 중':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50  text-amber-700  border border-amber-200/70 ">
            <ShieldCheck size={11} className="text-amber-500" />
            QA 검증 중
          </span>
        );
      case '프리즈 대기':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50  text-blue-700  border border-blue-200/70 ">
            <Clock size={11} className="text-blue-500" />
            프리즈 대기
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50  text-blue-700  border border-blue-200/70 ">
            <GitCommit size={11} className="text-blue-500" />
            개발 진행
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200  bg-white  shadow-xs overflow-hidden relative">
      {/* 상단 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-zinc-200 ">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50  text-blue-700  text-xs font-semibold border border-blue-200/70 ">
            <Rocket size={12} className="text-blue-600" />
            ART-2026.3 스프린트 릴리즈 트레인
          </span>

          <div className="flex items-center bg-zinc-100  p-0.5 rounded-lg border border-zinc-200/70 ">
            {[
              { id: '전체', label: '전체 스쿼드' },
              { id: 'sq-pay', label: '결제·정산' },
              { id: 'sq-sre', label: '인프라·SRE' },
              { id: 'sq-fe', label: '디자인·FE' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSquad(tab.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  selectedSquad === tab.id
                    ? 'bg-white  text-zinc-900  shadow-2xs'
                    : 'text-klic-muted hover:text-zinc-800 '
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFreezeHighlight((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
              showFreezeHighlight
                ? 'border-blue-300  bg-blue-50/80  text-blue-700 '
                : 'border-zinc-200  bg-white  text-klic-muted '
            }`}
          >
            <ShieldCheck size={13} />
            <span>QA 코드 프리즈 윈도우 강조</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-klic-muted ">
          <span>
            총 벨로시티 <strong className="font-mono text-zinc-900 ">128 SP</strong>
          </span>
          <span>·</span>
          <span>릴리즈 게이트 배지 클릭 시 검수 상태 전환</span>
        </div>
      </div>

      {/* 본문: 좌측 에픽 리스트 + 우측 스프린트 이터레이션 보드 */}
      <div className="flex flex-col lg:flex-row relative">
        {/* 좌측 패널 */}
        <div className="w-full lg:w-[500px] shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-200  bg-white  z-10">
          <div className="h-[68px] flex items-end border-b border-zinc-200  bg-zinc-50/70  px-3 pb-2.5 text-[11px] font-medium text-klic-muted ">
            <div className="flex-1 min-w-0">스쿼드 / 스프린트 에픽 백로그</div>
            <div className="w-[54px] text-center shrink-0">포인트</div>
            <div className="w-[68px] text-center shrink-0">타겟 버전</div>
            <div className="w-[92px] text-center shrink-0">릴리즈 게이트</div>
          </div>

          <div className="divide-y divide-zinc-200/70 ">
            {visibleRows.map((row) => {
              if (row.kind === 'squad') {
                return (
                  <div
                    key={row.squad.id}
                    style={{ height: rowHeight }}
                    className="flex items-center justify-between px-3 bg-zinc-50/90  text-xs font-semibold text-zinc-800 "
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="truncate">{row.squad.name}</span>
                      <span className="text-[11px] font-normal text-klic-muted">
                        (리드: {row.squad.lead})
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-zinc-200/70  text-[11px] font-mono text-zinc-700 ">
                      합계 {row.totalSp} SP
                    </span>
                  </div>
                );
              }

              const { epic } = row;
              return (
                <div
                  key={epic.id}
                  style={{ height: rowHeight }}
                  className="flex items-center px-3 hover:bg-zinc-50/80  transition text-xs"
                >
                  <div className="flex-1 min-w-0 flex items-center gap-2 pl-3 pr-2">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-100  font-mono text-[10px] font-semibold text-klic-muted  shrink-0">
                      {epic.epicKey}
                    </span>
                    <span className="text-zinc-800  font-medium truncate">
                      {epic.title}
                    </span>
                  </div>

                  <div className="w-[54px] text-center shrink-0">
                    <span className="px-1.5 py-0.5 rounded-full bg-zinc-100  font-mono text-[11px] font-semibold text-zinc-700 ">
                      {epic.storyPoints} SP
                    </span>
                  </div>

                  <div className="w-[68px] text-center shrink-0">
                    <span className="font-mono text-[11px] font-semibold text-blue-600 ">
                      {epic.releaseVersion}
                    </span>
                  </div>

                  <div className="w-[92px] flex justify-center shrink-0">
                    <button
                      onClick={() => cycleGateStatus(epic.id)}
                      className="cursor-pointer hover:opacity-85 transition"
                      title="클릭하여 릴리즈 게이트 상태 변경"
                    >
                      {renderGateBadge(epic.gateStatus)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 우측 스프린트 타임라인 */}
        <div className="flex-1 overflow-x-auto relative">
          <div style={{ width: ALL_SLOTS.length * colWidth }} className="relative select-none">
            {/* 2단 헤더: 스프린트 + 주차/코드프리즈 슬롯 */}
            <div className="h-[68px] border-b border-zinc-200  bg-zinc-50/60  flex flex-col justify-between">
              <div className="flex border-b border-zinc-200/70  h-[34px]">
                {SPRINT_HEADERS.map((sp) => (
                  <div
                    key={sp.id}
                    style={{ width: 3 * colWidth }}
                    className="px-3 flex items-center justify-between border-r-2 border-zinc-300/80  text-xs font-semibold text-zinc-800 "
                  >
                    <span>{sp.name}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50  text-blue-700  border border-blue-200/60 ">
                      {sp.releaseTag}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex h-[34px]">
                {ALL_SLOTS.map((slot) => (
                  <div
                    key={slot.col}
                    style={{ width: colWidth }}
                    className={`flex flex-col items-center justify-center border-r border-zinc-200/70  text-[10px] leading-tight ${
                      slot.isFreeze && showFreezeHighlight
                        ? 'bg-blue-50/90  text-blue-700  font-semibold'
                        : 'text-klic-muted '
                    }`}
                  >
                    <span>{slot.label}</span>
                    <span className="text-[9px] opacity-75 font-mono">{slot.sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 본문 그리드 & QA 코드 프리즈 해칭 */}
            <div style={{ height: visibleRows.length * rowHeight }} className="relative">
              <div className="absolute inset-0 flex pointer-events-none">
                {ALL_SLOTS.map((slot) => {
                  const isSprintEnd = (slot.col + 1) % 3 === 0;
                  return (
                    <div
                      key={slot.col}
                      style={{
                        width: colWidth,
                        backgroundImage:
                          slot.isFreeze && showFreezeHighlight
                            ? 'repeating-linear-gradient(135deg, color-mix(in srgb,var(--klic-component-block-color-danger) 8%,transparent) 0px, color-mix(in srgb,var(--klic-component-block-color-danger) 8%,transparent) 6px, transparent 6px, transparent 12px)'
                            : undefined,
                      }}
                      className={`h-full ${
                        isSprintEnd
                          ? 'border-r-2 border-zinc-300/80 '
                          : 'border-r border-zinc-200/50 '
                      }`}
                    />
                  );
                })}
              </div>

              {/* 현재 스프린트 진행 기준선 (스프린트 25 통합 단계) */}
              <div
                style={{ left: 4.5 * colWidth }}
                className="absolute top-0 bottom-0 w-[2px] bg-blue-500 z-20 pointer-events-none"
              >
                <div className="absolute -top-2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-blue-600 text-klic-on-emphasis text-[9px] font-semibold whitespace-nowrap">
                  현재: 스프린트 25 W2
                </div>
              </div>

              {/* 행별 에픽 바 */}
              {visibleRows.map((row) => {
                if (row.kind === 'squad') {
                  return (
                    <div
                      key={row.squad.id}
                      style={{ height: rowHeight }}
                      className="border-b border-zinc-200/70  bg-zinc-50/50 "
                    />
                  );
                }

                const { epic } = row;
                const left = epic.startSlot * colWidth + 8;
                const width = (epic.endSlot - epic.startSlot + 1) * colWidth - 16;

                return (
                  <div
                    key={epic.id}
                    style={{ height: rowHeight }}
                    className="border-b border-zinc-200/60  relative flex items-center"
                  >
                    <div
                      style={{ left, width }}
                      className="absolute h-[26px] rounded-lg border border-zinc-200/90  bg-white/95  shadow-2xs overflow-hidden flex items-center px-2.5 justify-between gap-2"
                    >
                      {/* 진행률 하단 바 */}
                      <div
                        style={{ width: `${epic.progress}%` }}
                        className={`absolute left-0 bottom-0 h-[3px] ${
                          epic.accent === 'emerald'
                            ? 'bg-blue-500'
                            : epic.accent === 'violet'
                            ? 'bg-blue-500'
                            : epic.accent === 'amber'
                            ? 'bg-amber-500'
                            : epic.accent === 'rose'
                            ? 'bg-blue-500'
                            : 'bg-blue-500'
                        }`}
                      />
                      <div className="flex items-center gap-1.5 min-w-0">
                        <PersonAvatar
                          src={epic.avatar}
                          alt={epic.owner}
                          className="w-4 h-4 rounded-full object-cover shrink-0"
                        />
                        <span className="font-mono text-[10px] font-bold text-klic-muted  shrink-0">
                          {epic.epicKey}
                        </span>
                        <span className="text-[11px] font-semibold text-zinc-800  truncate">
                          {epic.title}
                        </span>
                      </div>
                      <span className="px-1.5 py-0.2 rounded bg-zinc-100  font-mono text-[10px] font-semibold text-klic-muted  shrink-0">
                        {epic.releaseVersion}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 줌 컨트롤 */}
            <div className="sticky bottom-3 left-3 z-30 inline-flex items-center bg-white/95  border border-zinc-200  rounded-lg shadow-md m-3">
              <button
                onClick={() => setColWidth((w) => Math.max(68, w - 10))}
                className="w-7 h-7 flex items-center justify-center text-klic-muted  hover:bg-zinc-100  rounded-l-lg text-sm font-bold"
              >
                -
              </button>
              <div className="w-[1px] h-4 bg-zinc-200 " />
              <button
                onClick={() => setColWidth((w) => Math.min(120, w + 10))}
                className="w-7 h-7 flex items-center justify-center text-klic-muted  hover:bg-zinc-100  rounded-r-lg text-sm font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. 크리티컬 패스 병목 분석 간트 (KLIC/gantt-5)
// ============================================================================

interface CriticalTaskItem {
  id: string;
  wbs: string;
  title: string;
  owner: string;
  avatar: string;
  startDay: number; // 0..15
  duration: number; // days
  floatDays: number; // 0 = Critical Path, >0 = Free Float (Slack)
  isCritical: boolean;
  progress: number;
  dependsOnId?: string;
}

const INITIAL_CRITICAL_TASKS: CriticalTaskItem[] = [
  {
    id: 'cp-1',
    wbs: '1.1',
    title: '글로벌 결제 게이트웨이 PCI-DSS 보안 아키텍처 확정',
    owner: '김도윤 수석',
    avatar: AVATARS.u2,
    startDay: 0,
    duration: 3,
    floatDays: 0,
    isCritical: true,
    progress: 100,
  },
  {
    id: 'cp-2',
    wbs: '1.2',
    title: '토큰화 볼트(Token Vault) HSM 하드웨어 클러스터 프로비저닝',
    owner: '최서연 리드',
    avatar: AVATARS.u1,
    startDay: 3,
    duration: 3,
    floatDays: 0,
    isCritical: true,
    progress: 100,
    dependsOnId: 'cp-1',
  },
  {
    id: 'cp-3',
    wbs: '1.3',
    title: '백오피스 정산 대시보드 UI 와이어프레임 & 컴포넌트 설계',
    owner: '이하은 PM',
    avatar: AVATARS.u3,
    startDay: 1,
    duration: 3,
    floatDays: 3,
    isCritical: false,
    progress: 100,
  },
  {
    id: 'cp-4',
    wbs: '2.1',
    title: '핵심 승인 라우터 & 3D Secure 2.2 암호화 핸드셰이크 구현',
    owner: '박지훈 리드',
    avatar: AVATARS.u4,
    startDay: 6,
    duration: 4,
    floatDays: 0,
    isCritical: true,
    progress: 75,
    dependsOnId: 'cp-2',
  },
  {
    id: 'cp-5',
    wbs: '2.2',
    title: '가맹점 웹훅 알림 큐 & 실패 재전송 스케줄러 개발',
    owner: '정민규 엔지니어',
    avatar: AVATARS.u6,
    startDay: 4,
    duration: 3,
    floatDays: 4,
    isCritical: false,
    progress: 80,
    dependsOnId: 'cp-3',
  },
  {
    id: 'cp-6',
    wbs: '2.3',
    title: '다국어 영수증 템플릿 및 세금계산서 PDF 생성 모듈',
    owner: '한소윤 리드',
    avatar: AVATARS.u5,
    startDay: 6,
    duration: 2,
    floatDays: 5,
    isCritical: false,
    progress: 60,
  },
  {
    id: 'cp-7',
    wbs: '3.1',
    title: '초당 15,000 TPS 부하 테스트 & 데드락 병목 튜닝',
    owner: '최서연 리드',
    avatar: AVATARS.u1,
    startDay: 10,
    duration: 3,
    floatDays: 0,
    isCritical: true,
    progress: 40,
    dependsOnId: 'cp-4',
  },
  {
    id: 'cp-8',
    wbs: '3.2',
    title: '금융보안원 모의해킹 취약점 조치 & 최종 프로덕션 컷오버',
    owner: '김도윤 수석',
    avatar: AVATARS.u2,
    startDay: 13,
    duration: 3,
    floatDays: 0,
    isCritical: true,
    progress: 15,
    dependsOnId: 'cp-7',
  },
];

export function CriticalPathGantt({ density = 'default' }: { density?: GridDensity }) {
  const [focusCriticalOnly, setFocusCriticalOnly] = useState<boolean>(false);
  const [simulatedDelay, setSimulatedDelay] = useState<number>(0); // 0, 1, 2 days
  const [colWidth, setColWidth] = useState<number>(58);

  const rowHeight = density === 'compact' ? 40 : density === 'relaxed' ? 52 : 46;
  const totalCols = 18;

  const computedTasks = useMemo(() => {
    return INITIAL_CRITICAL_TASKS.map((t) => {
      // Simulate bottleneck delay on tasks starting at or after day 6 on the critical path
      if (t.isCritical && t.startDay >= 6) {
        return {
          ...t,
          startDay: t.startDay + simulatedDelay,
        };
      }
      return t;
    });
  }, [simulatedDelay]);

  const criticalChainPaths = useMemo(() => {
    const paths: Array<{ id: string; d: string; arrowX: number; arrowY: number }> = [];
    const idxMap = new Map<string, number>();
    computedTasks.forEach((t, i) => idxMap.set(t.id, i));

    computedTasks.forEach((target, tIdx) => {
      if (!target.dependsOnId) return;
      const sIdx = idxMap.get(target.dependsOnId);
      if (sIdx === undefined) return;
      const source = computedTasks[sIdx];

      const startX = (source.startDay + source.duration) * colWidth - 6;
      const startY = sIdx * rowHeight + rowHeight / 2;
      const endX = target.startDay * colWidth + 6;
      const endY = tIdx * rowHeight + rowHeight / 2;

      const midX = startX + 10;
      const midY = startY + (endY - startY) / 2;
      const d = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${midY} L ${endX - 8} ${midY} L ${endX - 8} ${endY} L ${endX} ${endY}`;

      paths.push({
        id: `${source.id}->${target.id}`,
        d,
        arrowX: endX,
        arrowY: endY,
      });
    });
    return paths;
  }, [computedTasks, colWidth, rowHeight]);

  const finalCompletionDay = 16 + simulatedDelay;

  return (
    <div className="rounded-2xl border border-zinc-200  bg-white  shadow-xs overflow-hidden relative">
      {/* 상단 툴바 & 병목 시뮬레이터 */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-zinc-200 ">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50  text-blue-700  text-xs font-semibold border border-blue-200/70 ">
            <Flame size={13} className="text-blue-600" />
            CPM 크리티컬 패스 & 여유 시간(Float) 분석
          </span>

          <button
            onClick={() => setFocusCriticalOnly((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
              focusCriticalOnly
                ? 'border-blue-400 bg-blue-600 text-klic-on-emphasis shadow-2xs'
                : 'border-zinc-200  bg-white  text-zinc-700 '
            }`}
          >
            <Zap size={13} />
            <span>크리티컬 패스 집중 조명 {focusCriticalOnly ? 'ON' : '꺼짐'}</span>
          </button>

          {/* 병목 지연 시뮬레이션 버튼 */}
          <div className="flex items-center gap-1 bg-zinc-100  p-0.5 rounded-lg border border-zinc-200/70 ">
            <span className="px-2 text-[11px] font-medium text-klic-muted ">
              병목 지연 시뮬레이션:
            </span>
            {[0, 1, 2].map((d) => (
              <button
                key={d}
                onClick={() => setSimulatedDelay(d)}
                className={`px-2 py-1 rounded-md text-xs font-mono font-semibold transition ${
                  simulatedDelay === d
                    ? d > 0
                      ? 'bg-blue-600 text-klic-on-emphasis shadow-2xs'
                      : 'bg-white  text-zinc-900  shadow-2xs'
                    : 'text-klic-muted hover:text-zinc-800 '
                }`}
              >
                {d === 0 ? '정상 (0일)' : `+${d}일 지연`}
              </button>
            ))}
          </div>
        </div>

        {/* 우측 핵심 경로 KPI 요약 */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-500 inline-block" />
            <span className="text-klic-muted ">핵심 경로 (여유 0일)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-2.5 rounded-xs border border-dashed border-blue-500 bg-blue-500/20 inline-block" />
            <span className="text-klic-muted ">자유 여유 시간 (Float)</span>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-zinc-100  font-mono font-semibold text-zinc-900 ">
            예상 완료: 8월 {finalCompletionDay}일 {simulatedDelay > 0 && <span className="text-blue-600">(+{simulatedDelay}일 밀림)</span>}
          </span>
        </div>
      </div>

      {/* 본문: 좌측 CPM 테이블 + 우측 크리티컬 패스/여유시간 타임라인 */}
      <div className="flex flex-col lg:flex-row relative">
        <div className="w-full lg:w-[490px] shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-200  bg-white  z-10">
          <div className="h-[64px] flex items-end border-b border-zinc-200  bg-zinc-50/70  px-3 pb-2.5 text-[11px] font-medium text-klic-muted ">
            <div className="w-[42px] shrink-0">WBS</div>
            <div className="flex-1 min-w-0">단위 공정 / 작업명</div>
            <div className="w-[86px] text-center shrink-0">경로 구분</div>
            <div className="w-[78px] text-right shrink-0 pr-1">여유(Float)</div>
          </div>

          <div className="divide-y divide-zinc-200/70 ">
            {computedTasks.map((task) => {
              const dimmed = focusCriticalOnly && !task.isCritical;
              return (
                <div
                  key={task.id}
                  style={{ height: rowHeight }}
                  className={`flex items-center px-3 text-xs transition ${
                    dimmed ? 'opacity-35' : 'hover:bg-zinc-50/80 '
                  }`}
                >
                  <div className="w-[42px] font-mono text-[11px] font-semibold text-klic-muted shrink-0">
                    {task.wbs}
                  </div>
                  <div className="flex-1 min-w-0 flex items-center gap-2 pr-2">
                    <PersonAvatar
                      src={task.avatar}
                      alt={task.owner}
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                    />
                    <span className="font-medium text-zinc-800  truncate">
                      {task.title}
                    </span>
                  </div>
                  <div className="w-[86px] flex justify-center shrink-0">
                    {task.isCritical ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50  text-blue-600  border border-blue-200/80 ">
                        <Flame size={11} />
                        핵심 경로
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50  text-blue-700  border border-blue-200/70 ">
                        일반 공정
                      </span>
                    )}
                  </div>
                  <div className="w-[78px] text-right font-mono text-[11px] pr-1 shrink-0">
                    {task.isCritical ? (
                      <span className="font-bold text-blue-600 ">0일 (병목)</span>
                    ) : (
                      <span className="font-semibold text-blue-600 ">
                        +{task.floatDays}일 여유
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 우측 타임라인 */}
        <div className="flex-1 overflow-x-auto relative">
          <div style={{ width: totalCols * colWidth }} className="relative select-none">
            {/* 헤더 */}
            <div className="h-[64px] border-b border-zinc-200  bg-zinc-50/60  flex flex-col justify-between">
              <div className="h-[30px] px-3 flex items-center justify-between border-b border-zinc-200/70  text-xs font-semibold text-zinc-700 ">
                <span>2026년 8월 컷오버 크리티컬 패스 스케줄 (일별 공정)</span>
                <span className="font-mono text-[11px] text-blue-600 ">
                  최종 마일스톤 마감선: 8월 {finalCompletionDay}일
                </span>
              </div>
              <div className="flex h-[34px]">
                {Array.from({ length: totalCols }).map((_, idx) => {
                  const isDeadline = idx + 1 === finalCompletionDay;
                  return (
                    <div
                      key={idx}
                      style={{ width: colWidth }}
                      className={`flex items-center justify-center border-r border-zinc-200/60  text-[11px] font-mono ${
                        isDeadline
                          ? 'bg-blue-600 text-klic-on-emphasis font-bold'
                          : 'text-klic-muted '
                      }`}
                    >
                      8/{idx + 1}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 그리드 & 직교 크리티컬 패스 화살표 */}
            <div style={{ height: computedTasks.length * rowHeight }} className="relative">
              <div className="absolute inset-0 flex pointer-events-none">
                {Array.from({ length: totalCols }).map((_, idx) => (
                  <div
                    key={idx}
                    style={{ width: colWidth }}
                    className="h-full border-r border-zinc-200/50 "
                  />
                ))}
              </div>

              {/* 최종 완료 데드라인 수직선 */}
              <div
                style={{ left: finalCompletionDay * colWidth }}
                className="absolute top-0 bottom-0 w-[2px] bg-blue-600 z-20 pointer-events-none"
              >
                <div className="absolute bottom-2 -translate-x-1/2 px-2 py-0.5 rounded bg-blue-600 text-klic-on-emphasis text-[10px] font-semibold whitespace-nowrap shadow-sm">
                  최종 완료일 (8/{finalCompletionDay})
                </div>
              </div>

              {/* 크리티컬 패스 직교 화살표 오버레이 */}
              <svg
                className="absolute inset-0 pointer-events-none z-10"
                width={totalCols * colWidth}
                height={computedTasks.length * rowHeight}
              >
                {criticalChainPaths.map((p) => (
                  <g key={p.id}>
                    <path
                      d={p.d}
                      fill="none"
                      stroke="var(--klic-component-block-color-danger)"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polygon
                      points={`${p.arrowX},${p.arrowY} ${p.arrowX - 6},${p.arrowY - 4} ${p.arrowX - 6},${p.arrowY + 4}`}
                      fill="var(--klic-component-block-color-danger)"
                    />
                  </g>
                ))}
              </svg>

              {/* 행별 작업 바 + 여유시간(Float) 점선 확장 바 */}
              {computedTasks.map((task) => {
                const left = task.startDay * colWidth + 6;
                const width = task.duration * colWidth - 12;
                const floatWidth = task.floatDays * colWidth;
                const dimmed = focusCriticalOnly && !task.isCritical;

                return (
                  <div
                    key={task.id}
                    style={{ height: rowHeight }}
                    className={`border-b border-zinc-200/60  relative flex items-center transition-opacity ${
                      dimmed ? 'opacity-25' : 'opacity-100'
                    }`}
                  >
                    {/* 메인 작업 바 */}
                    <div
                      style={{ left, width }}
                      className={`absolute h-[26px] rounded-lg border flex items-center justify-between px-2.5 text-[11px] font-semibold transition-all duration-300 z-10 ${
                        task.isCritical
                          ? 'bg-blue-500 text-klic-on-emphasis border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                          : 'bg-blue-500 text-klic-on-emphasis border-blue-600'
                      }`}
                    >
                      <span className="truncate">
                        {task.wbs} {task.title}
                      </span>
                      <span className="font-mono text-[10px] ml-1.5 shrink-0">
                        {task.duration}일
                      </span>
                    </div>

                    {/* 여유 시간 (Float / Slack) 점선 구간 바 */}
                    {!task.isCritical && task.floatDays > 0 && (
                      <div
                        style={{ left: left + width + 2, width: floatWidth - 6 }}
                        className="absolute h-[22px] rounded-r-lg border-2 border-dashed border-blue-400  bg-blue-50/70  flex items-center justify-center px-2 text-[10px] font-mono font-semibold text-blue-700 "
                      >
                        여유(Float) +{task.floatDays}일
                      </div>
                    )}
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
