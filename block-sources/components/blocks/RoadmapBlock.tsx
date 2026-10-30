import { PersonAvatar } from '../PersonAvatar';
import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  SlidersHorizontal,
  FolderMinus,
  FolderPlus,
  Plus,
  Calendar,
  MoreHorizontal,
  Layout,
  CreditCard,
  BookOpen,
  Terminal,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Package,
  Check,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { TaskItem, SignalStatus, StageId } from '../../types';
import {
  calculateRoadmapStats,
  filterTasks,
  groupTasksByStage,
  getSignalBadgeStyles,
  getProgressColor,
} from '../../utils/roadmap';
import { STAGE_CONFIGS } from '../../data/componentsData';

interface RoadmapBlockProps {
  tasks: TaskItem[];
  onAddTaskClick: () => void;
  onUpdateTask: (task: TaskItem) => void;
  onDeleteTask: (taskId: string) => void;
  density?: 'compact' | 'normal' | 'relaxed';
  showAvatars?: boolean;
  showProgressRings?: boolean;
}

export function RoadmapBlock({
  tasks,
  onAddTaskClick,
  onUpdateTask,
  onDeleteTask,
  density = 'normal',
  showAvatars = true,
  showProgressRings = true,
}: RoadmapBlockProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [signalFilter, setSignalFilter] = useState<SignalStatus | 'all'>('all');
  const [showSignalDropdown, setShowSignalDropdown] = useState(false);
  const [showDisplayDropdown, setShowDisplayDropdown] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);

  const [expandedStages, setExpandedStages] = useState<Record<StageId, boolean>>({
    '백로그': true,
    '할 일': true,
    '진행 중': true,
    '완료': true,
  });

  // 실시간 통계 계산
  const stats = useMemo(() => calculateRoadmapStats(tasks), [tasks]);

  // 검색어 및 상태 신호 필터링
  const filteredTasks = useMemo(
    () => filterTasks(tasks, searchQuery, signalFilter),
    [tasks, searchQuery, signalFilter]
  );

  // 단계별 그룹화
  const groupedTasks = useMemo(() => groupTasksByStage(filteredTasks), [filteredTasks]);

  const allCollapsed = Object.values(expandedStages).every((v) => !v);

  const toggleAllStages = () => {
    const nextState = allCollapsed;
    setExpandedStages({
      '백로그': nextState,
      '할 일': nextState,
      '진행 중': nextState,
      '완료': nextState,
    });
  };

  const toggleStage = (stage: StageId) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stage]: !prev[stage],
    }));
  };

  const toggleSelectTask = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const renderIcon = (name: string) => {
    const props = { size: 14, className: 'text-klic-muted  shrink-0' };
    switch (name) {
      case 'credit-card':
        return <CreditCard {...props} />;
      case 'book-open':
        return <BookOpen {...props} />;
      case 'terminal':
        return <Terminal {...props} />;
      case 'shield-check':
        return <ShieldCheck {...props} />;
      case 'bell':
        return <Bell {...props} />;
      case 'smartphone':
        return <Smartphone {...props} />;
      case 'sparkles':
        return <Sparkles {...props} />;
      case 'package':
        return <Package {...props} />;
      case 'layout':
      default:
        return <Layout {...props} />;
    }
  };

  const getDensityPadding = () => {
    switch (density) {
      case 'compact':
        return 'py-2 px-3 text-xs';
      case 'relaxed':
        return 'py-3.5 px-4 text-sm';
      case 'normal':
      default:
        return 'py-2.5 px-4 text-xs';
    }
  };

  const densityLabelMap = {
    compact: '좁게 (Compact)',
    normal: '보통 (Normal)',
    relaxed: '넓게 (Relaxed)',
  };

  return (
    <div className="w-full text-zinc-900  font-sans">
      {/* 상단 요약 헤더 및 지표 배지 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-6 border-b border-zinc-200  bg-white ">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 ">
            로드맵 큐
          </h2>
          <p className="text-xs text-klic-muted  mt-0.5">
            단계, 담당자, 상태 신호별로 업무 진행 현황을 추적합니다.
          </p>
        </div>

        {/* 지표 요약 배지 */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="px-2 py-0.5 rounded-md bg-zinc-100  text-zinc-700  font-medium">
            전체 업무 <strong className="font-semibold ml-1">{stats.total}</strong>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-blue-50  text-blue-700  border border-blue-200/60  font-medium">
            차단됨 <strong className="font-semibold ml-1">{stats.blocked}</strong>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-50  text-amber-700  border border-amber-200/60  font-medium">
            위험 <strong className="font-semibold ml-1">{stats.atRisk}</strong>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-100  text-klic-muted  font-medium">
            미배정 <strong className="font-semibold ml-1">{stats.unassigned}</strong>
          </span>
        </div>
      </div>

      {/* 검색 및 액션 툴바 */}
      <div className="p-3 sm:px-6 border-b border-zinc-200  bg-zinc-50/50  flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* 검색창 */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-klic-muted"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="로드맵 업무, 태그, 담당자 검색..."
            className="w-full pl-9 pr-3 py-1.5 bg-white  border border-zinc-200  rounded-lg text-xs placeholder:text-klic-muted focus:outline-none focus:ring-1 focus:ring-zinc-400  shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-klic-muted hover:text-klic-muted text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* 우측 액션 버튼 그룹 */}
        <div className="flex items-center gap-2 flex-wrap relative">
          {/* 상태 신호 필터 팝오버 */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSignalDropdown(!showSignalDropdown);
                setShowDisplayDropdown(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                signalFilter !== 'all'
                  ? 'bg-klic-inverse  text-klic-on-emphasis  border-zinc-900'
                  : 'bg-white  border-zinc-200  text-zinc-700  hover:bg-zinc-50 '
              }`}
            >
              <Bell size={13} />
              <span>상태 신호</span>
              {signalFilter !== 'all' && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-0.5" />
              )}
            </button>

            {showSignalDropdown && (
              <div className="absolute right-0 top-full mt-1.5 z-30 w-44 rounded-xl bg-white  border border-zinc-200  shadow-lg p-1.5 text-xs animate-in fade-in zoom-in-95">
                <p className="px-2 py-1 text-[10px] font-semibold text-klic-muted uppercase tracking-wider">
                  상태 신호별 필터
                </p>
                {(['all', '정상 진행', '위험', '차단됨', '대기 중'] as const).map((sig) => (
                  <button
                    key={sig}
                    onClick={() => {
                      setSignalFilter(sig);
                      setShowSignalDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition text-left ${
                      signalFilter === sig
                        ? 'bg-zinc-100  font-semibold text-zinc-900 '
                        : 'text-klic-muted  hover:bg-zinc-50 '
                    }`}
                  >
                    <span>{sig === 'all' ? '전체 신호 보기' : sig}</span>
                    {signalFilter === sig && <Check size={12} className="text-zinc-900 " />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 화면 표시 옵션 */}
          <div className="relative">
            <button
              onClick={() => {
                setShowDisplayDropdown(!showDisplayDropdown);
                setShowSignalDropdown(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200  bg-white  text-xs font-medium text-zinc-700  hover:bg-zinc-50  transition"
            >
              <SlidersHorizontal size={13} />
              <span>화면 표시</span>
            </button>

            {showDisplayDropdown && (
              <div className="absolute right-0 top-full mt-1.5 z-30 w-52 rounded-xl bg-white  border border-zinc-200  shadow-lg p-2.5 text-xs">
                <p className="px-1.5 py-1 text-[10px] font-semibold text-klic-muted uppercase tracking-wider">
                  현재 표시 설정
                </p>
                <div className="px-1.5 py-1 space-y-1 text-klic-muted ">
                  <span className="block font-medium text-zinc-800 ">
                    행 밀도: {densityLabelMap[density]}
                  </span>
                  <p className="text-[11px] text-klic-muted leading-relaxed">
                    상단 툴바의 <strong>커스터마이징</strong> 버튼에서 행 간격과 아바타/진행률 링 표시 여부를 변경할 수 있습니다.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 그룹 접기 / 펼치기 */}
          <button
            onClick={toggleAllStages}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200  bg-white  text-xs font-medium text-zinc-700  hover:bg-zinc-50  transition"
          >
            {allCollapsed ? <FolderPlus size={13} /> : <FolderMinus size={13} />}
            <span>{allCollapsed ? '그룹 펼치기' : '그룹 접기'}</span>
          </button>

          {/* 새 업무 추가 버튼 */}
          <button
            onClick={onAddTaskClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-klic-inverse  text-klic-on-emphasis  text-xs font-semibold hover:bg-klic-inverse  shadow-xs transition"
          >
            <Plus size={14} />
            <span>새 업무 추가</span>
          </button>
        </div>
      </div>

      {/* 단계별 그룹 리스트 */}
      <div className="divide-y divide-zinc-200 ">
        {STAGE_CONFIGS.map((stageCfg) => {
          const stageTasks = groupedTasks[stageCfg.id] || [];
          const isExpanded = expandedStages[stageCfg.id] ?? true;

          return (
            <div key={stageCfg.id} className="bg-white ">
              {/* 단계 그룹 헤더 */}
              <div
                onClick={() => toggleStage(stageCfg.id)}
                className="w-full flex items-center justify-between px-4 sm:px-6 py-2.5 bg-zinc-50/70  hover:bg-zinc-100/70  cursor-pointer select-none border-b border-zinc-100  transition"
              >
                <div className="flex items-center gap-2">
                  <span className="text-klic-muted">
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: stageCfg.color }}
                  />
                  <span className="text-xs font-semibold text-zinc-900 ">
                    {stageCfg.label}
                  </span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-zinc-200/70  text-klic-muted  font-mono">
                    {stageTasks.length}
                  </span>
                </div>

                <div className="text-[11px] text-klic-muted  font-normal hidden sm:block">
                  {stageCfg.description}
                </div>
              </div>

              {/* 하위 업무 행 리스트 */}
              {isExpanded && (
                <div className="divide-y divide-zinc-100 ">
                  {stageTasks.length === 0 ? (
                    <div className="py-6 text-center text-xs text-klic-muted">
                      '{stageCfg.label}' 단계에 해당하는 업무가 없습니다.
                    </div>
                  ) : (
                    stageTasks.map((task) => {
                      const isSelected = selectedTaskIds.includes(task.id);
                      const signalBadge = getSignalBadgeStyles(task.signal);
                      const isMenuOpen = activeMenuTaskId === task.id;

                      const radius = 6.5;
                      const circumference = 2 * Math.PI * radius;
                      const offset = circumference - (task.progress / 100) * circumference;

                      return (
                        <div
                          key={task.id}
                          className={`flex items-center justify-between gap-3 ${getDensityPadding()} hover:bg-zinc-50/80  transition group`}
                        >
                          {/* 좌측: 체크박스, 아이콘, 업무 제목 */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectTask(task.id)}
                              className="rounded border-zinc-300  text-zinc-900 focus:ring-zinc-500 cursor-pointer"
                              aria-label={`${task.title} 선택`}
                            />

                            <span className="p-1 rounded-md bg-zinc-100 ">
                              {renderIcon(task.iconName)}
                            </span>

                            <span className="font-medium text-zinc-800  truncate cursor-pointer hover:underline">
                              {task.title}
                            </span>
                          </div>

                          {/* 우측: 담당자 아바타, 카테고리 태그, 마감일, 완료율 링, 상태 배지, 더보기 메뉴 */}
                          <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-xs">
                            {/* 담당자 아바타 */}
                            {showAvatars && (
                              <div className="flex items-center -space-x-1.5 w-14 justify-end">
                                {task.assignees.length === 0 ? (
                                  <span className="text-[11px] text-klic-muted font-mono">--</span>
                                ) : (
                                  task.assignees.map((a, idx) => (
                                    <div
                                      key={a.id || idx}
                                      className="relative group/avatar"
                                      title={`담당자: ${a.name}`}
                                    >
                                      {a.avatar ? (
                                        <PersonAvatar
                                          src={a.avatar}
                                          alt={a.name}
                                          className="w-5 h-5 rounded-full object-cover ring-2 ring-white "
                                        />
                                      ) : (
                                        <span className="w-5 h-5 rounded-full bg-zinc-300  text-[9px] font-bold flex items-center justify-center ring-2 ring-white ">
                                          {a.initials || '담당'}
                                        </span>
                                      )}
                                    </div>
                                  ))
                                )}
                              </div>
                            )}

                            {/* 카테고리 태그 */}
                            <div className="hidden md:flex items-center gap-1.5 min-w-[84px]">
                              <span
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: task.tag.color }}
                              />
                              <span className="text-klic-muted  text-xs truncate">
                                {task.tag.name}
                              </span>
                            </div>

                            {/* 마감일 */}
                            <div className="hidden sm:flex items-center gap-1 text-klic-muted min-w-[78px]">
                              <Calendar size={12} className="text-klic-muted" />
                              <span className="text-xs">{task.dueDate}</span>
                            </div>

                            {/* SVG 원형 진행률 링 */}
                            {showProgressRings && (
                              <div className="flex items-center gap-1.5 min-w-[55px] justify-end">
                                {task.progress > 0 ? (
                                  <>
                                    <svg className="w-4 h-4 -rotate-90" viewBox="0 0 16 16">
                                      <circle
                                        cx="8"
                                        cy="8"
                                        r={radius}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="text-klic-on-emphasis "
                                      />
                                      <circle
                                        cx="8"
                                        cy="8"
                                        r={radius}
                                        fill="none"
                                        stroke={getProgressColor(task.progress, task.signal)}
                                        strokeWidth="2"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={offset}
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                    <span className="text-[11px] font-mono text-klic-muted">
                                      {task.progress}%
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-[11px] text-klic-muted font-mono">-</span>
                                )}
                              </div>
                            )}

                            {/* 상태 신호 배지 */}
                            <div className="min-w-[72px] flex justify-end">
                              <span
                                className={`px-2 py-0.5 rounded-full border text-[11px] font-medium flex items-center gap-1 ${signalBadge.badgeClass}`}
                              >
                                {signalBadge.label}
                              </span>
                            </div>

                            {/* 행 액션 메뉴 */}
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setActiveMenuTaskId(isMenuOpen ? null : task.id)
                                }
                                className="p-1 rounded-md text-klic-muted hover:text-zinc-700  hover:bg-zinc-200/50  transition"
                                title="업무 관리 메뉴"
                              >
                                <MoreHorizontal size={14} />
                              </button>

                              {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-1 z-40 w-44 rounded-xl bg-white  border border-zinc-200  shadow-xl p-1 text-xs">
                                  <button
                                    onClick={() => {
                                      onUpdateTask({
                                        ...task,
                                        stage: task.stage === '완료' ? '진행 중' : '완료',
                                        progress: task.stage === '완료' ? 75 : 100,
                                      });
                                      setActiveMenuTaskId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-100  text-zinc-700 "
                                  >
                                    <CheckCircle2 size={13} className="text-blue-500" />
                                    <span>{task.stage === '완료' ? '진행 중으로 되돌리기' : '완료로 표시'}</span>
                                  </button>

                                  <div className="my-1 border-t border-zinc-100 " />

                                  <p className="px-2 py-1 text-[10px] text-klic-muted uppercase font-semibold">
                                    상태 신호 변경
                                  </p>
                                  {(['정상 진행', '위험', '차단됨', '대기 중'] as const).map(
                                    (sig) => (
                                      <button
                                        key={sig}
                                        onClick={() => {
                                          onUpdateTask({ ...task, signal: sig });
                                          setActiveMenuTaskId(null);
                                        }}
                                        className="w-full text-left px-2.5 py-1 rounded-md hover:bg-zinc-100  text-klic-muted  text-xs"
                                      >
                                        {sig}
                                      </button>
                                    )
                                  )}

                                  <div className="my-1 border-t border-zinc-100 " />

                                  <button
                                    onClick={() => {
                                      onDeleteTask(task.id);
                                      setActiveMenuTaskId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-blue-50  text-blue-600 "
                                  >
                                    <Trash2 size={13} />
                                    <span>업무 삭제</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
