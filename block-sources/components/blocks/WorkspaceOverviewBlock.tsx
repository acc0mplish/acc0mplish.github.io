import React, { useState, useMemo } from 'react';
import {
  Globe,
  Smartphone,
  Megaphone,
  Rocket,
  Layers,
  LayoutGrid,
  Plus,
  GanttChart,
  CircleDashed,
  Circle,
  Clock,
  CheckCircle2,
  X,
} from 'lucide-react';
import { PortfolioProjectItem, PortfolioProjectStatus } from '../../types';
import { calculateWorkspaceKpis } from '../../utils/workspace';

interface WorkspaceOverviewBlockProps {
  projects: PortfolioProjectItem[];
  onAdvanceProject: (projectId: string) => void;
  onAddProject: (payload: {
    name: string;
    leadName: string;
    status: PortfolioProjectStatus;
    dueDate: string;
  }) => void;
  density: 'compact' | 'normal' | 'relaxed';
  showAvatars: boolean;
}

const WORKLOAD_MEMBERS = [
  {
    id: 'w1',
    initials: '이준',
    name: '이준혁',
    badgeClass: 'bg-blue-100  text-blue-700 ',
    total: 8,
    segments: [
      { widthPct: 26, color: 'bg-zinc-400' },
      { widthPct: 48, color: 'bg-zinc-500' },
      { widthPct: 14, color: 'bg-amber-600' },
      { widthPct: 12, color: 'bg-[var(--klic-component-block-color-accent)]' },
    ],
  },
  {
    id: 'w2',
    initials: '정유',
    name: '정유나',
    badgeClass: 'bg-blue-100  text-blue-700 ',
    total: 8,
    segments: [
      { widthPct: 13, color: 'bg-zinc-400' },
      { widthPct: 50, color: 'bg-zinc-500' },
      { widthPct: 37, color: 'bg-amber-600' },
    ],
  },
  {
    id: 'w3',
    initials: '최현',
    name: '최현우',
    badgeClass: 'bg-blue-100  text-blue-700 ',
    total: 7,
    segments: [
      { widthPct: 62, color: 'bg-zinc-500' },
      { widthPct: 13, color: 'bg-amber-600' },
      { widthPct: 12, color: 'bg-[var(--klic-component-block-color-accent)]' },
    ],
  },
  {
    id: 'w4',
    initials: '김서',
    name: '김서연',
    badgeClass: 'bg-blue-100  text-blue-700 ',
    total: 5,
    segments: [
      { widthPct: 25, color: 'bg-zinc-500' },
      { widthPct: 13, color: 'bg-amber-600' },
      { widthPct: 24, color: 'bg-[var(--klic-component-block-color-accent)]' },
    ],
  },
  {
    id: 'w5',
    initials: '박지',
    name: '박지민',
    badgeClass: 'bg-amber-100  text-amber-800 ',
    total: 4,
    segments: [
      { widthPct: 25, color: 'bg-zinc-400' },
      { widthPct: 13, color: 'bg-amber-600' },
      { widthPct: 12, color: 'bg-[var(--klic-component-block-color-accent)]' },
    ],
  },
  {
    id: 'w6',
    initials: '강도',
    name: '강도현',
    badgeClass: 'bg-zinc-200  text-zinc-700 ',
    total: 3,
    segments: [
      { widthPct: 13, color: 'bg-zinc-400' },
      { widthPct: 12, color: 'bg-amber-600' },
      { widthPct: 12, color: 'bg-[var(--klic-component-block-color-accent)]' },
    ],
  },
  {
    id: 'w7',
    initials: '한소',
    name: '한소연',
    badgeClass: 'bg-blue-100  text-blue-700 ',
    total: 3,
    segments: [
      { widthPct: 25, color: 'bg-zinc-400' },
      { widthPct: 12, color: 'bg-zinc-500' },
    ],
  },
];

const UPCOMING_MILESTONES = [
  {
    id: 'm1',
    title: '와이어프레임 최종 승인',
    project: '웹사이트 리디자인',
    date: '금요일',
    diamondColor: 'text-[color:var(--klic-component-block-color-accent)]',
  },
  {
    id: 'm2',
    title: 'v2 디자인 토큰 배포',
    project: '디자인 시스템',
    date: '토요일',
    diamondColor: 'text-blue-500',
  },
  {
    id: 'm3',
    title: '베타 빌드 패키징',
    project: '모바일 앱 고도화',
    date: '10월 30일',
    diamondColor: 'text-blue-500',
  },
  {
    id: 'm4',
    title: '런칭 Go / No-Go 최종 점검',
    project: '신제품 런칭',
    date: '11월 1일',
    diamondColor: 'text-amber-600',
  },
  {
    id: 'm5',
    title: '공식 런칭 데이',
    project: '신제품 런칭',
    date: '11월 2일',
    diamondColor: 'text-amber-500',
  },
  {
    id: 'm6',
    title: '크리에이티브 에셋 확정',
    project: '마케팅 캠페인',
    date: '11월 2일',
    diamondColor: 'text-blue-500',
  },
];

export function WorkspaceOverviewBlock({
  projects,
  onAdvanceProject,
  onAddProject,
  density,
  showAvatars,
}: WorkspaceOverviewBlockProps) {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [showTimelineBanner, setShowTimelineBanner] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newLeadName, setNewLeadName] = useState('김서연');
  const [newStatus, setNewStatus] = useState<PortfolioProjectStatus>('진행 중');
  const [newDueDate, setNewDueDate] = useState('12월 20일');

  const kpis = useMemo(() => calculateWorkspaceKpis(projects, 9), [projects]);

  const rowPad =
    density === 'compact'
      ? 'py-2.5'
      : density === 'relaxed'
      ? 'py-4'
      : 'py-3.5';

  const renderProjectIcon = (
    iconType: PortfolioProjectItem['iconType'],
    bgClass: string,
    colorClass: string
  ) => {
    const iconNode = (() => {
      switch (iconType) {
        case 'globe':
          return <Globe size={15} />;
        case 'smartphone':
          return <Smartphone size={15} />;
        case 'megaphone':
          return <Megaphone size={15} />;
        case 'rocket':
          return <Rocket size={15} />;
        case 'layers':
          return <Layers size={15} />;
        case 'grid':
        default:
          return <LayoutGrid size={15} />;
      }
    })();

    return (
      <span
        className={`w-8 h-8 rounded-lg ${bgClass} ${colorClass} flex items-center justify-center shrink-0`}
      >
        {iconNode}
      </span>
    );
  };

  const renderStatusPill = (status: PortfolioProjectStatus) => {
    const dotMap: Record<PortfolioProjectStatus, string> = {
      '진행 중': 'bg-blue-600',
      '기획 중': 'bg-zinc-500',
      '위험': 'bg-blue-700',
      '완료됨': 'bg-blue-600',
    };

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-zinc-200  bg-zinc-50/70  text-[11px] font-medium text-zinc-800  whitespace-nowrap">
        <span className={`w-1.5 h-1.5 rounded-full ${dotMap[status]}`} />
        {status}
      </span>
    );
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    onAddProject({
      name: newProjectName.trim(),
      leadName: newLeadName,
      status: newStatus,
      dueDate: newDueDate,
    });
    setNewProjectName('');
    setIsNewProjectOpen(false);
  };

  return (
    <div className="w-full space-y-4">
      {/* 상단 워크스페이스 오버뷰 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-zinc-900  tracking-tight">
            워크스페이스 종합 현황
          </h2>
          <p className="text-xs text-klic-muted  mt-0.5">
            KLIC 스튜디오 내 모든 프로젝트의 진행 건강도
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowTimelineBanner((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition shadow-2xs ${
              showTimelineBanner
                ? 'border-zinc-900 bg-klic-inverse text-klic-on-emphasis   '
                : 'border-zinc-200  bg-white  text-zinc-700  hover:bg-zinc-50'
            }`}
          >
            <GanttChart size={14} />
            <span>타임라인</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewProjectOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--klic-component-block-color-accent)] hover:bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis text-xs font-semibold transition shadow-2xs"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>새 프로젝트</span>
          </button>
        </div>
      </div>

      {/* 새 프로젝트 추가 인라인 폼 */}
      {isNewProjectOpen && (
        <form
          onSubmit={handleCreateProject}
          className="p-3.5 rounded-xl border border-zinc-200  bg-zinc-50/70  flex flex-wrap items-center gap-2.5 text-xs"
        >
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="새 프로젝트 이름 입력 (예: AI 검색 파이프라인)..."
            className="flex-1 min-w-52 px-3 py-1.5 rounded-lg border border-zinc-200  bg-white  text-zinc-900  outline-none"
            autoFocus
          />
          <select
            value={newLeadName}
            onChange={(e) => setNewLeadName(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-zinc-200  bg-white  text-zinc-700 "
          >
            <option value="김서연">리드: 김서연</option>
            <option value="이준혁">리드: 이준혁</option>
            <option value="박지민">리드: 박지민</option>
            <option value="최현우">리드: 최현우</option>
          </select>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as PortfolioProjectStatus)}
            className="px-2.5 py-1.5 rounded-lg border border-zinc-200  bg-white  text-zinc-700 "
          >
            <option value="진행 중">상태: 진행 중</option>
            <option value="기획 중">상태: 기획 중</option>
            <option value="위험">상태: 위험</option>
          </select>
          <input
            type="text"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            placeholder="마감일 (예: 12월 20일)"
            className="w-28 px-2.5 py-1.5 rounded-lg border border-zinc-200  bg-white  text-zinc-700 "
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis font-semibold"
          >
            추가
          </button>
          <button
            type="button"
            onClick={() => setIsNewProjectOpen(false)}
            className="p-1 text-klic-muted hover:text-zinc-700"
          >
            <X size={14} />
          </button>
        </form>
      )}

      {/* 타임라인 요약 배너 (타임라인 버튼 토글 시) */}
      {showTimelineBanner && (
        <div className="p-3.5 rounded-xl border border-blue-200/70  bg-blue-50/40  text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-blue-950  font-medium">
            <GanttChart size={15} className="text-[color:var(--klic-component-block-color-accent)]" />
            <span>
              4분기 스프린트 타임라인: 10월 3일(마케팅 웹사이트 완료) → 11월 2일(신제품 런칭) → 12월 30일(디자인 시스템 v2)
            </span>
          </div>
          <span className="text-[11px] text-blue-600  font-semibold">
            포트폴리오 행을 클릭하면 진척률이 갱신됩니다
          </span>
        </div>
      )}

      {/* 상단 4열 핵심 지표(KPI) 카드 스트립 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 rounded-xl border border-zinc-200/90  bg-white  divide-y lg:divide-y-0 lg:divide-x divide-zinc-200/80  shadow-2xs">
        <div className="p-4 sm:p-5">
          <div className="text-xs text-klic-muted  font-medium">
            프로젝트
          </div>
          <div className="text-2xl font-bold text-zinc-900  mt-1 tracking-tight">
            {kpis.totalProjects}
          </div>
          <div className="text-[11px] text-klic-muted  mt-1">
            {kpis.completedProjects}개 완료됨
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="text-xs text-klic-muted  font-medium">
            전체 작업
          </div>
          <div className="text-2xl font-bold text-zinc-900  mt-1 tracking-tight">
            {kpis.totalTasks}
          </div>
          <div className="text-[11px] text-klic-muted  mt-1">
            {kpis.openTasks}개 진행 중
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="text-xs text-klic-muted  font-medium">
            전체 완료율
          </div>
          <div className="text-2xl font-bold text-zinc-900  mt-1 tracking-tight">
            {kpis.completionRate}%
          </div>
          <div className="text-[11px] text-klic-muted  mt-1">
            전체 프로젝트 기준
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="text-xs text-klic-muted  font-medium">
            팀 멤버
          </div>
          <div className="text-2xl font-bold text-zinc-900  mt-1 tracking-tight">
            {kpis.totalMembers}
          </div>
          <div className="text-[11px] text-klic-muted  mt-1">
            {kpis.pendingInvites}명 초대 대기 중
          </div>
        </div>
      </div>

      {/* 하단 2열 분할 레이아웃: 좌측 포트폴리오 테이블 (7) + 우측 인사이트 카드 3종 (5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* 좌측: 포트폴리오 카드 */}
        <div className="lg:col-span-7 rounded-xl border border-zinc-200/90  bg-white  shadow-2xs flex flex-col overflow-hidden">
          <div className="px-5 pt-4 pb-3">
            <h3 className="text-sm font-bold text-zinc-900 ">
              포트폴리오
            </h3>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100  text-[11px] font-medium text-klic-muted  whitespace-nowrap">
                  <th className="py-2 pl-4 pr-2 font-medium">프로젝트</th>
                  <th className="py-2 px-2 font-medium">리드</th>
                  <th className="py-2 px-2 font-medium">상태</th>
                  <th className="py-2 px-2 font-medium">진척률</th>
                  <th className="py-2 px-1.5 text-center font-medium">진행</th>
                  <th className="py-2 px-1.5 text-center font-medium">지연</th>
                  <th className="py-2 pl-2 pr-4 text-right font-medium">마감일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100  text-xs">
                {projects.map((proj) => {
                  const barColor =
                    proj.status === '완료됨' || proj.progress === 100
                      ? 'bg-blue-600'
                      : 'bg-[var(--klic-component-block-color-accent)]';

                  return (
                    <tr
                      key={proj.id}
                      onClick={() => onAdvanceProject(proj.id)}
                      title="클릭하여 프로젝트 진척률 업데이트"
                      className="hover:bg-zinc-50/80  transition-colors cursor-pointer"
                    >
                      {/* 프로젝트 아이콘 + 이름 */}
                      <td className={`${rowPad} pl-4 pr-2 whitespace-nowrap`}>
                        <div className="flex items-center gap-2.5">
                          {renderProjectIcon(
                            proj.iconType,
                            proj.iconBgClass,
                            proj.iconColorClass
                          )}
                          <span className="font-semibold text-zinc-900 ">
                            {proj.name}
                          </span>
                        </div>
                      </td>

                      {/* 리드 */}
                      <td className={`${rowPad} px-2 whitespace-nowrap`}>
                        <div className="flex items-center gap-1.5">
                          {showAvatars && (
                            <span
                              className={`w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center shrink-0 ${proj.leadBadgeClass}`}
                            >
                              {proj.leadInitials}
                            </span>
                          )}
                          <span className="text-klic-muted  text-[11px]">
                            {proj.leadName}
                          </span>
                        </div>
                      </td>

                      {/* 상태 */}
                      <td className={`${rowPad} px-2 whitespace-nowrap`}>
                        {renderStatusPill(proj.status)}
                      </td>

                      {/* 진척률 프로그레스 바 */}
                      <td className={`${rowPad} px-2 whitespace-nowrap`}>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-zinc-100  overflow-hidden shrink-0">
                            <div
                              className={`h-full rounded-full ${barColor} transition-all duration-300`}
                              style={{ width: `${proj.progress}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-mono text-klic-muted  w-7 text-right">
                            {proj.progress}%
                          </span>
                        </div>
                      </td>

                      {/* 진행 (Open) */}
                      <td className={`${rowPad} px-1.5 text-center font-medium text-zinc-800  whitespace-nowrap`}>
                        {proj.openTasks}
                      </td>

                      {/* 지연 (Overdue) */}
                      <td
                        className={`${rowPad} px-1.5 text-center font-medium whitespace-nowrap ${
                          proj.overdueTasks > 0
                            ? 'text-blue-600  font-semibold'
                            : 'text-klic-muted '
                        }`}
                      >
                        {proj.overdueTasks}
                      </td>

                      {/* 마감일 */}
                      <td className={`${rowPad} pl-2 pr-4 text-right text-[11px] text-klic-muted  whitespace-nowrap`}>
                        {proj.dueDate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 우측: 상태별 작업 현황 / 업무 부하 / 예정된 마일스톤 */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* 1. 상태별 작업 현황 (Tasks by status) */}
          <div className="rounded-xl border border-zinc-200/90  bg-white  p-4 sm:p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-zinc-900  mb-3">
              상태별 작업 현황
            </h3>

            {/* 다중 세그먼트 스택 프로그레스 바 */}
            <div className="h-2.5 w-full rounded-full overflow-hidden flex gap-0.5 mb-4">
              <div className="h-full bg-zinc-400" style={{ width: '17%' }} title="백로그: 17%" />
              <div className="h-full bg-zinc-500" style={{ width: '35%' }} title="할 일: 35%" />
              <div className="h-full bg-amber-600" style={{ width: '17%' }} title="진행 중: 17%" />
              <div className="h-full bg-[var(--klic-component-block-color-accent)]" style={{ width: '13%' }} title="검수 중: 13%" />
              <div className="h-full bg-blue-600" style={{ width: '19%' }} title="완료: 19%" />
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-700 ">
                  <CircleDashed size={13} className="text-klic-muted" />
                  <span>백로그</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-zinc-800  font-medium">8</span>
                  <span className="text-klic-muted w-8 text-right">17%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-700 ">
                  <Circle size={13} className="text-klic-muted" />
                  <span>할 일</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-zinc-800  font-medium">17</span>
                  <span className="text-klic-muted w-8 text-right">35%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-700 ">
                  <Clock size={13} className="text-amber-600" />
                  <span>진행 중</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-zinc-800  font-medium">8</span>
                  <span className="text-klic-muted w-8 text-right">17%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-700 ">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-[color:var(--klic-component-block-color-accent)] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--klic-component-block-color-accent)]" />
                  </span>
                  <span>검수 중</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-zinc-800  font-medium">6</span>
                  <span className="text-klic-muted w-8 text-right">13%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-700 ">
                  <CheckCircle2 size={13} className="text-blue-600" />
                  <span>완료</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-zinc-800  font-medium">9</span>
                  <span className="text-klic-muted w-8 text-right">19%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 팀원별 업무 부하 (Workload) */}
          <div className="rounded-xl border border-zinc-200/90  bg-white  p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-bold text-zinc-900 ">
                업무 부하
              </h3>
              <span className="text-[11px] text-klic-muted">
                담당자별 미완료 작업
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {WORKLOAD_MEMBERS.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-32 shrink-0 whitespace-nowrap">
                    {showAvatars && (
                      <span
                        className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${member.badgeClass}`}
                      >
                        {member.initials}
                      </span>
                    )}
                    <span className="text-zinc-700 ">
                      {member.name}
                    </span>
                  </div>

                  {/* 비례 스택 바 */}
                  <div className="flex-1 h-2 rounded-full bg-zinc-100  overflow-hidden flex">
                    {member.segments.map((seg, i) => (
                      <div
                        key={i}
                        className={`h-full ${seg.color}`}
                        style={{ width: `${seg.widthPct}%` }}
                      />
                    ))}
                  </div>

                  <span className="w-4 text-right font-mono text-klic-muted ">
                    {member.total}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. 예정된 마일스톤 (Upcoming milestones) */}
          <div className="rounded-xl border border-zinc-200/90  bg-white  p-4 sm:p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-zinc-900  mb-3">
              예정된 마일스톤
            </h3>

            <div className="space-y-2.5 text-xs">
              {UPCOMING_MILESTONES.map((ms) => (
                <div
                  key={ms.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-xs ${ms.diamondColor} shrink-0`}>
                      ◆
                    </span>
                    <div className="truncate">
                      <span className="font-medium text-zinc-800 ">
                        {ms.title}
                      </span>
                      <span className="text-klic-muted mx-1">·</span>
                      <span className="text-klic-muted ">
                        {ms.project}
                      </span>
                    </div>
                  </div>
                  <span className="text-klic-muted  whitespace-nowrap shrink-0">
                    {ms.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
