import { PersonAvatar } from '../PersonAvatar';
import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Filter,
  SlidersHorizontal,
  MoreHorizontal,
  MoreVertical,
  ChevronsUpDown,
  ArrowDown,
  ArrowUp,
  Check,
  X,
} from 'lucide-react';
import { DeliveryTaskItem, SubTaskPriority, SubTaskStatus } from '../../types';
import {
  calculateDeliveryStats,
  filterAndSortDeliveryTasks,
} from '../../utils/subtasks';

interface SubTaskTrackerBlockProps {
  tasks: DeliveryTaskItem[];
  onToggleTask: (parentId: string, subTaskId?: string) => void;
  onToggleExpand: (parentId: string) => void;
  onExpandAll: (expand: boolean) => void;
  onAddParentTask: (task: {
    title: string;
    priority: SubTaskPriority;
    project: string;
    assigneeName: string;
  }) => void;
  onAddSubTask: (parentId: string, title: string) => void;
  density: 'compact' | 'normal' | 'relaxed';
  showAvatars: boolean;
}

export function SubTaskTrackerBlock({
  tasks,
  onToggleTask,
  onToggleExpand,
  onExpandAll,
  onAddParentTask,
  onAddSubTask,
  density,
  showAvatars,
}: SubTaskTrackerBlockProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'backlog'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOperator, setSearchOperator] = useState<'포함' | '일치'>('포함');
  const [priorityFilter, setPriorityFilter] = useState<string>('전체');
  const [projectFilter, setProjectFilter] = useState<string>('전체');
  const [sortField, setSortField] = useState<'default' | 'status' | 'priority'>('default');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [showSubtasks, setShowSubtasks] = useState(true);
  const [hideCompletedSubtasks, setHideCompletedSubtasks] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [addingSubtaskForParent, setAddingSubtaskForParent] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [openRowMenuId, setOpenRowMenuId] = useState<string | null>(null);

  // 새 작업 폼 상태
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<SubTaskPriority>('긴급');
  const [newProject, setNewProject] = useState('레지스트리 API');
  const [newAssignee, setNewAssignee] = useState('윤서연');

  const stats = useMemo(() => calculateDeliveryStats(tasks), [tasks]);

  const filteredTasks = useMemo(
    () =>
      filterAndSortDeliveryTasks(tasks, {
        tab: activeTab,
        searchQuery,
        searchOperator,
        priorityFilter,
        projectFilter,
        sortField,
        sortDirection,
      }),
    [
      tasks,
      activeTab,
      searchQuery,
      searchOperator,
      priorityFilter,
      projectFilter,
      sortField,
      sortDirection,
    ]
  );

  const rowPad =
    density === 'compact'
      ? 'py-2'
      : density === 'relaxed'
      ? 'py-3.5'
      : 'py-2.5';

  const handleSort = (field: 'status' | 'priority') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const renderStatusBadge = (status: SubTaskStatus) => {
    const dotColor =
      status === '완료'
        ? 'bg-blue-500'
        : status === '진행 중'
        ? 'bg-amber-500'
        : 'bg-blue-500';

    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-zinc-200  bg-white  text-[11px] font-medium text-zinc-700  whitespace-nowrap shadow-2xs">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        {status}
      </span>
    );
  };

  const renderPriorityBadge = (priority: SubTaskPriority) => {
    const styleMap: Record<SubTaskPriority, string> = {
      '긴급':
        'bg-blue-50  text-blue-600  border-blue-200/70 ',
      '높음':
        'bg-amber-50  text-amber-700  border-amber-200/70 ',
      '보통':
        'bg-blue-50  text-blue-600  border-blue-200/70 ',
      '낮음':
        'bg-blue-50  text-blue-600  border-blue-200/70 ',
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium whitespace-nowrap ${styleMap[priority]}`}
      >
        {priority}
      </span>
    );
  };

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddParentTask({
      title: newTitle.trim(),
      priority: newPriority,
      project: newProject,
      assigneeName: newAssignee,
    });
    setNewTitle('');
    setIsNewTaskModalOpen(false);
  };

  const handleCreateSubtaskSubmit = (parentId: string) => {
    if (!newSubtaskTitle.trim()) return;
    onAddSubTask(parentId, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
    setAddingSubtaskForParent(null);
  };

  const activeFilterCount =
    (priorityFilter !== '전체' ? 1 : 0) + (projectFilter !== '전체' ? 1 : 0);

  return (
    <div className="w-full bg-zinc-50/70  rounded-2xl border border-zinc-200/90  p-4 sm:p-5 transition-colors">
      {/* 상단 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
        <div>
          <h3 className="text-[15px] font-bold text-zinc-900  tracking-tight">
            작업 딜리버리
          </h3>
          <p className="text-xs text-klic-muted  mt-0.5">
            총 {stats.totalTasks}개 작업 / 하위 작업 {showSubtasks ? '표시 켜짐' : '표시 꺼짐'}
          </p>
        </div>

        <button
          onClick={() => setIsNewTaskModalOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-klic-inverse  text-klic-on-emphasis  text-xs font-semibold hover:bg-klic-inverse  transition shadow-2xs self-start sm:self-auto"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>새 작업</span>
        </button>
      </div>

      {/* 인라인 새 작업 추가 폼 */}
      {isNewTaskModalOpen && (
        <form
          onSubmit={handleCreateTaskSubmit}
          className="mb-3 p-3.5 rounded-xl bg-white  border border-zinc-200  shadow-sm flex flex-wrap items-center gap-2.5"
        >
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="추가할 상위 작업 제목을 입력하세요..."
            className="flex-1 min-w-52 px-3 py-1.5 text-xs rounded-lg border border-zinc-200  bg-zinc-50  text-zinc-900  outline-none focus:border-zinc-400"
            autoFocus
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as SubTaskPriority)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200  bg-white  text-zinc-700 "
          >
            <option value="긴급">우선순위: 긴급</option>
            <option value="높음">우선순위: 높음</option>
            <option value="보통">우선순위: 보통</option>
            <option value="낮음">우선순위: 낮음</option>
          </select>
          <select
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200  bg-white  text-zinc-700 "
          >
            <option value="레지스트리 API">레지스트리 API</option>
            <option value="워크스페이스 접근">워크스페이스 접근</option>
            <option value="런치 애널리틱스">런치 애널리틱스</option>
          </select>
          <select
            value={newAssignee}
            onChange={(e) => setNewAssignee(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200  bg-white  text-zinc-700 "
          >
            <option value="윤서연">윤서연</option>
            <option value="박지훈">박지훈</option>
            <option value="강민규">강민규</option>
            <option value="김도훈">김도훈</option>
          </select>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-klic-inverse  text-klic-on-emphasis  text-xs font-semibold hover:opacity-90"
          >
            등록
          </button>
          <button
            type="button"
            onClick={() => setIsNewTaskModalOpen(false)}
            className="p-1.5 text-klic-muted hover:text-zinc-700"
          >
            <X size={14} />
          </button>
        </form>
      )}

      {/* 상단 탭 바: 전체 작업 16 / 진행 중 10 / 백로그 4 */}
      <div className="flex items-center gap-5 border-b border-zinc-200/80  mb-3.5 text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all -mb-px ${
            activeTab === 'all'
              ? 'border-zinc-900  text-zinc-900  font-semibold'
              : 'border-transparent text-klic-muted hover:text-zinc-800  font-medium'
          }`}
        >
          <span>전체 작업</span>
          <span className="px-1.5 py-0.2 rounded-full bg-zinc-200/80  text-[10px] font-semibold text-zinc-700 ">
            {stats.totalTasks}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all -mb-px ${
            activeTab === 'active'
              ? 'border-zinc-900  text-zinc-900  font-semibold'
              : 'border-transparent text-klic-muted hover:text-zinc-800  font-medium'
          }`}
        >
          <span>진행 중</span>
          <span className="px-1.5 py-0.2 rounded-full bg-zinc-200/80  text-[10px] font-semibold text-zinc-700 ">
            {stats.activeCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('backlog')}
          className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all -mb-px ${
            activeTab === 'backlog'
              ? 'border-zinc-900  text-zinc-900  font-semibold'
              : 'border-transparent text-klic-muted hover:text-zinc-800  font-medium'
          }`}
        >
          <span>백로그</span>
          <span className="px-1.5 py-0.2 rounded-full bg-zinc-200/80  text-[10px] font-semibold text-zinc-700 ">
            {stats.backlogCount}
          </span>
        </button>
      </div>

      {/* 메인 화이트 테이블 프레임 */}
      <div className="bg-white  rounded-xl border border-zinc-200  shadow-2xs overflow-hidden">
        {/* 필터 및 설정 툴바 */}
        <div className="p-3 border-b border-zinc-200/80  flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* 복합 세그먼트 검색 바 (Task | contains | Search tasks... | ⋮) */}
            <div className="inline-flex items-center rounded-lg border border-zinc-200  bg-white  text-xs shadow-2xs overflow-hidden">
              <span className="px-2.5 py-1.5 font-semibold text-zinc-800  border-r border-zinc-200  bg-zinc-50/70  whitespace-nowrap">
                작업
              </span>
              <button
                type="button"
                onClick={() =>
                  setSearchOperator((prev) => (prev === '포함' ? '일치' : '포함'))
                }
                className="px-2.5 py-1.5 text-klic-muted  hover:text-zinc-800  border-r border-zinc-200  whitespace-nowrap transition"
                title="검색 연산자 전환 (포함 / 일치)"
              >
                {searchOperator}
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="작업 검색..."
                className="px-2.5 py-1.5 w-36 sm:w-44 bg-transparent text-zinc-800  placeholder:text-klic-muted outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setPriorityFilter('전체');
                  setProjectFilter('전체');
                }}
                className="px-2 py-1.5 text-klic-muted hover:text-zinc-700  border-l border-zinc-200  transition"
                title="검색 및 필터 초기화"
              >
                <MoreVertical size={13} />
              </button>
            </div>

            {/* 필터 팝오버 버튼 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsFilterOpen((v) => !v);
                  setIsSettingsOpen(false);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition shadow-2xs ${
                  activeFilterCount > 0
                    ? 'border-zinc-900  bg-klic-inverse text-klic-on-emphasis  '
                    : 'border-zinc-200  bg-white  text-zinc-700  hover:bg-zinc-50 '
                }`}
              >
                <Filter size={13} />
                <span>필터</span>
                {activeFilterCount > 0 && (
                  <span className="px-1 rounded-full bg-white/20 text-[10px]">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {isFilterOpen && (
                <div className="absolute left-0 mt-1.5 w-60 rounded-xl bg-white  border border-zinc-200  shadow-xl p-3 z-30 space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-klic-muted mb-1">
                      우선순위 필터
                    </label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200  bg-zinc-50  text-zinc-800 "
                    >
                      <option value="전체">전체 우선순위</option>
                      <option value="긴급">긴급</option>
                      <option value="높음">높음 (High)</option>
                      <option value="보통">보통 (Medium)</option>
                      <option value="낮음">낮음 (Low)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-klic-muted mb-1">
                      프로젝트 필터
                    </label>
                    <select
                      value={projectFilter}
                      onChange={(e) => setProjectFilter(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200  bg-zinc-50  text-zinc-800 "
                    >
                      <option value="전체">전체 프로젝트</option>
                      <option value="레지스트리 API">레지스트리 API</option>
                      <option value="워크스페이스 접근">워크스페이스 접근</option>
                      <option value="런치 애널리틱스">런치 애널리틱스</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-1.5 pt-1 border-t border-zinc-100 ">
                    <button
                      type="button"
                      onClick={() => {
                        setPriorityFilter('전체');
                        setProjectFilter('전체');
                      }}
                      className="px-2 py-1 text-[11px] text-klic-muted hover:text-zinc-800"
                    >
                      초기화
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(false)}
                      className="px-2.5 py-1 rounded-md bg-klic-inverse  text-klic-on-emphasis  text-[11px] font-medium"
                    >
                      적용
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 우측 설정 팝오버 버튼 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsSettingsOpen((v) => !v);
                setIsFilterOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200  bg-white  text-xs font-medium text-zinc-700  hover:bg-zinc-50  transition shadow-2xs"
            >
              <SlidersHorizontal size={13} />
              <span>설정</span>
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 mt-1.5 w-60 rounded-xl bg-white  border border-zinc-200  shadow-xl p-3 z-30 space-y-2.5 text-xs">
                <div className="font-semibold text-zinc-800  pb-1 border-b border-zinc-100 ">
                  하위 작업 보기 설정
                </div>
                <label className="flex items-center justify-between cursor-pointer py-1">
                  <span className="text-klic-muted ">하위 작업 인라인 표시</span>
                  <input
                    type="checkbox"
                    checked={showSubtasks}
                    onChange={(e) => setShowSubtasks(e.target.checked)}
                    className="rounded accent-zinc-900"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer py-1">
                  <span className="text-klic-muted ">완료된 하위 작업 숨기기</span>
                  <input
                    type="checkbox"
                    checked={hideCompletedSubtasks}
                    onChange={(e) => setHideCompletedSubtasks(e.target.checked)}
                    className="rounded accent-zinc-900"
                  />
                </label>
                <div className="flex items-center gap-1.5 pt-1.5 border-t border-zinc-100 ">
                  <button
                    type="button"
                    onClick={() => {
                      onExpandAll(true);
                      setIsSettingsOpen(false);
                    }}
                    className="flex-1 py-1.5 rounded-md bg-zinc-100  hover:bg-zinc-200 text-[11px] font-medium text-zinc-700 "
                  >
                    모두 펼치기
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onExpandAll(false);
                      setIsSettingsOpen(false);
                    }}
                    className="flex-1 py-1.5 rounded-md bg-zinc-100  hover:bg-zinc-200 text-[11px] font-medium text-zinc-700 "
                  >
                    모두 접기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 데이터 그리드 본문 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200/80  bg-zinc-50/40  text-[11px] font-medium text-klic-muted ">
                <th className="py-2.5 pl-4 pr-3 min-w-80 font-medium border-r border-zinc-100 ">
                  작업
                </th>
                <th className="py-2.5 px-3.5 w-32 font-medium border-r border-zinc-100 ">
                  <button
                    type="button"
                    onClick={() => handleSort('status')}
                    className="inline-flex items-center gap-1 hover:text-zinc-800  transition"
                  >
                    <span>상태</span>
                    <ChevronsUpDown size={12} className="text-klic-muted" />
                  </button>
                </th>
                <th className="py-2.5 px-3.5 w-44 font-medium border-r border-zinc-100 ">
                  담당자
                </th>
                <th className="py-2.5 px-3.5 w-28 font-medium border-r border-zinc-100 ">
                  <button
                    type="button"
                    onClick={() => handleSort('priority')}
                    className="inline-flex items-center gap-1 hover:text-zinc-800  transition"
                  >
                    <span>우선순위</span>
                    {sortField === 'priority' && sortDirection === 'asc' ? (
                      <ArrowUp size={12} className="text-klic-muted" />
                    ) : (
                      <ArrowDown size={12} className="text-klic-muted" />
                    )}
                  </button>
                </th>
                <th className="py-2.5 px-3.5 w-36 font-medium border-r border-zinc-100 ">
                  프로젝트
                </th>
                <th className="py-2.5 px-2 w-10 text-center" />
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200/60  text-xs">
              {filteredTasks.map((parent) => {
                const hasSubtasks = parent.subtasks.length > 0;
                const visibleSubtasks = hideCompletedSubtasks
                  ? parent.subtasks.filter((s) => !s.completed)
                  : parent.subtasks;

                return (
                  <React.Fragment key={parent.id}>
                    {/* 상위 작업 행 */}
                    <tr className="hover:bg-zinc-50/70  transition-colors group">
                      <td className={`${rowPad} pl-3 pr-3 border-r border-zinc-100 `}>
                        <div className="flex items-center gap-1.5">
                          {hasSubtasks && showSubtasks ? (
                            <button
                              type="button"
                              onClick={() => onToggleExpand(parent.id)}
                              className="w-4 h-4 rounded hover:bg-zinc-200/70  text-klic-muted flex items-center justify-center transition shrink-0"
                              title={parent.isExpanded ? '하위 작업 접기' : '하위 작업 펼치기'}
                            >
                              {parent.isExpanded ? (
                                <ChevronDown size={13} />
                              ) : (
                                <ChevronRight size={13} />
                              )}
                            </button>
                          ) : (
                            <span className="w-4 shrink-0" />
                          )}

                          {/* 상위 작업 원형 체크박스 */}
                          <button
                            type="button"
                            onClick={() => onToggleTask(parent.id)}
                            className={`w-4 h-4 rounded-full border flex items-center justify-center transition shrink-0 ${
                              parent.completed
                                ? 'bg-klic-inverse  border-zinc-900  text-klic-on-emphasis '
                                : 'border-zinc-300  bg-white  hover:border-zinc-400'
                            }`}
                            aria-label={parent.title}
                          >
                            {parent.completed && <Check size={10} strokeWidth={3} />}
                          </button>

                          <span
                            className={`ml-1 font-semibold tracking-tight ${
                              parent.completed
                                ? 'text-klic-muted '
                                : 'text-zinc-900 '
                            }`}
                          >
                            {parent.title}
                          </span>
                        </div>
                      </td>

                      {/* 상태 */}
                      <td className={`${rowPad} px-3.5 border-r border-zinc-100  whitespace-nowrap`}>
                        {renderStatusBadge(parent.status)}
                      </td>

                      {/* 담당자 */}
                      <td className={`${rowPad} px-3.5 border-r border-zinc-100  whitespace-nowrap`}>
                        <div className="flex items-center gap-2">
                          {showAvatars &&
                            (parent.assignee.isUnassigned ? (
                              <span className="w-5 h-5 rounded-full bg-zinc-100  border border-zinc-200  text-[10px] font-mono text-klic-muted flex items-center justify-center shrink-0">
                                --
                              </span>
                            ) : (
                              <PersonAvatar
                                src={parent.assignee.avatar}
                                alt={parent.assignee.name}
                                className="w-5 h-5 rounded-full object-cover shrink-0"
                              />
                            ))}
                          <span
                            className={
                              parent.assignee.isUnassigned
                                ? 'text-klic-muted '
                                : 'text-zinc-800  font-medium'
                            }
                          >
                            {parent.assignee.name}
                          </span>
                        </div>
                      </td>

                      {/* 우선순위 */}
                      <td className={`${rowPad} px-3.5 border-r border-zinc-100  whitespace-nowrap`}>
                        {renderPriorityBadge(parent.priority)}
                      </td>

                      {/* 프로젝트 */}
                      <td className={`${rowPad} px-3.5 border-r border-zinc-100  whitespace-nowrap`}>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-zinc-200  bg-zinc-50/50  text-[11px] font-medium text-zinc-700 ">
                          {parent.project}
                        </span>
                      </td>

                      {/* 우측 액션 버튼 */}
                      <td className={`${rowPad} px-2 text-center relative`}>
                        <button
                          type="button"
                          onClick={() =>
                            setOpenRowMenuId((prev) =>
                              prev === parent.id ? null : parent.id
                            )
                          }
                          className="p-1 rounded hover:bg-zinc-200/70  text-klic-muted transition"
                          title="작업 메뉴"
                        >
                          <MoreHorizontal size={14} />
                        </button>

                        {openRowMenuId === parent.id && (
                          <div className="absolute right-6 top-8 w-40 rounded-lg bg-white  border border-zinc-200  shadow-lg py-1 z-20 text-left text-[11px]">
                            <button
                              type="button"
                              onClick={() => {
                                setAddingSubtaskForParent(parent.id);
                                setOpenRowMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 hover:bg-zinc-100  text-zinc-700  flex items-center gap-1.5"
                            >
                              <Plus size={12} /> 하위 작업 추가
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onToggleTask(parent.id);
                                setOpenRowMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 hover:bg-zinc-100  text-zinc-700  flex items-center gap-1.5"
                            >
                              <Check size={12} /> 완료 상태 전환
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>

                    {/* 인라인 하위 작업 추가 입력 행 */}
                    {addingSubtaskForParent === parent.id && (
                      <tr className="bg-zinc-50/80 ">
                        <td colSpan={6} className="py-2 pl-16 pr-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={newSubtaskTitle}
                              onChange={(e) => setNewSubtaskTitle(e.target.value)}
                              placeholder="새 하위 작업 제목 입력..."
                              className="flex-1 max-w-md px-2.5 py-1 text-xs rounded-md border border-zinc-300  bg-white  outline-none"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreateSubtaskSubmit(parent.id);
                                if (e.key === 'Escape') setAddingSubtaskForParent(null);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleCreateSubtaskSubmit(parent.id)}
                              className="px-2.5 py-1 rounded-md bg-klic-inverse  text-klic-on-emphasis  text-[11px] font-medium"
                            >
                              추가
                            </button>
                            <button
                              type="button"
                              onClick={() => setAddingSubtaskForParent(null)}
                              className="px-2 py-1 text-[11px] text-klic-muted"
                            >
                              취소
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* 인라인 하위 작업(Sub-tasks) 행 목록 */}
                    {showSubtasks &&
                      parent.isExpanded &&
                      visibleSubtasks.map((sub) => (
                        <tr
                          key={sub.id}
                          className="bg-zinc-50/30  hover:bg-zinc-50/80  transition-colors"
                        >
                          <td className={`${rowPad} pl-16 pr-3 border-r border-zinc-100 `}>
                            <div className="flex items-center gap-2.5">
                              <button
                                type="button"
                                onClick={() => onToggleTask(parent.id, sub.id)}
                                className={`w-4 h-4 rounded-full border flex items-center justify-center transition shrink-0 ${
                                  sub.completed
                                    ? 'bg-klic-inverse  border-zinc-900  text-klic-on-emphasis '
                                    : 'border-zinc-300  bg-white  hover:border-zinc-400'
                                }`}
                                aria-label={sub.title}
                              >
                                {sub.completed && <Check size={10} strokeWidth={3} />}
                              </button>
                              <span
                                className={`${
                                  sub.completed
                                    ? 'text-klic-muted '
                                    : 'text-zinc-800  font-medium'
                                }`}
                              >
                                {sub.title}
                              </span>
                            </div>
                          </td>

                          {/* 상태 */}
                          <td className={`${rowPad} px-3.5 border-r border-zinc-100  whitespace-nowrap`}>
                            {renderStatusBadge(sub.status)}
                          </td>

                          {/* 담당자 */}
                          <td className={`${rowPad} px-3.5 border-r border-zinc-100  whitespace-nowrap`}>
                            <div className="flex items-center gap-2">
                              {showAvatars &&
                                (sub.assignee.isUnassigned ? (
                                  <span className="w-5 h-5 rounded-full bg-zinc-100  border border-zinc-200  text-[10px] font-mono text-klic-muted flex items-center justify-center shrink-0">
                                    --
                                  </span>
                                ) : (
                                  <PersonAvatar
                                    src={sub.assignee.avatar}
                                    alt={sub.assignee.name}
                                    className="w-5 h-5 rounded-full object-cover shrink-0"
                                  />
                                ))}
                              <span
                                className={
                                  sub.assignee.isUnassigned
                                    ? 'text-klic-muted '
                                    : 'text-zinc-800 '
                                }
                              >
                                {sub.assignee.name}
                              </span>
                            </div>
                          </td>

                          {/* 우선순위 */}
                          <td className={`${rowPad} px-3.5 border-r border-zinc-100  whitespace-nowrap`}>
                            {renderPriorityBadge(sub.priority)}
                          </td>

                          {/* 프로젝트 */}
                          <td className={`${rowPad} px-3.5 border-r border-zinc-100  whitespace-nowrap`}>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-zinc-200  bg-zinc-50/50  text-[11px] font-medium text-zinc-700 ">
                              {sub.project}
                            </span>
                          </td>

                          {/* 액션 */}
                          <td className={`${rowPad} px-2 text-center`}>
                            <button
                              type="button"
                              onClick={() => onToggleTask(parent.id, sub.id)}
                              className="p-1 rounded hover:bg-zinc-200/70  text-klic-muted transition"
                              title="완료 상태 토글"
                            >
                              <MoreHorizontal size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}

              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-xs text-klic-muted">
                    검색 조건과 일치하는 작업이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
