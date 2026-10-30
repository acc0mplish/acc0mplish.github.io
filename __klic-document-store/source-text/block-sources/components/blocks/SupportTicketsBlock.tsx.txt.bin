import { PersonAvatar } from '../PersonAvatar';
import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  MoreHorizontal,
  ShieldCheck,
  CreditCard,
  Layers,
  Webhook,
  Check,
  X,
  UserCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  SupportTicketItem,
  SupportTicketPriority,
  SupportTicketQueue,
  SupportTicketStatus,
} from '../../types';
import {
  calculateTicketStats,
  filterAndSortTickets,
  paginateTickets,
  TicketSortField,
} from '../../utils/tickets';

interface SupportTicketsBlockProps {
  tickets: SupportTicketItem[];
  onBulkUpdateStatus: (ids: string[], status: SupportTicketStatus) => void;
  onBulkAssignOwner: (ids: string[], assignee: string | null) => void;
  onAddTicket: (payload: {
    title: string;
    requesterName: string;
    requesterOrg: string;
    queue: SupportTicketQueue;
    priority: SupportTicketPriority;
    assigneeName: string | null;
  }) => void;
  density: 'compact' | 'normal' | 'relaxed';
  showAvatars: boolean;
}

const QUEUE_OPTIONS: ('전체 큐' | SupportTicketQueue)[] = [
  '전체 큐',
  '플랫폼',
  '빌링',
  '인증',
  '연동',
];

const STATUS_OPTIONS: SupportTicketStatus[] = ['열림', '대기 중', '해결됨'];

const OWNER_OPTIONS = [
  '박수빈',
  '오태양',
  '이준호',
  '정하윤',
];

export function SupportTicketsBlock({
  tickets,
  onBulkUpdateStatus,
  onBulkAssignOwner,
  onAddTicket,
  density,
  showAvatars,
}: SupportTicketsBlockProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [queueFilter, setQueueFilter] = useState<string>('전체 큐');
  const [statusFilters, setStatusFilters] = useState<SupportTicketStatus[]>([]);
  const [sortField, setSortField] = useState<TicketSortField>('sla');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // 선택된 티켓 행 ID
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 페이지네이션 상태 (기본 6행)
  const [pageSize, setPageSize] = useState<number>(6);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 팝오버 및 모달 열림 상태
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false);
  const [isColumnsPopoverOpen, setIsColumnsPopoverOpen] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [activeRowMenuId, setActiveRowMenuId] = useState<string | null>(null);
  const [closingTicket, setClosingTicket] = useState<SupportTicketItem | null>(
    null
  );
  const [resolutionNote, setResolutionNote] = useState('');

  // 새 티켓 모달 상태
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRequesterName, setNewRequesterName] = useState('');
  const [newRequesterOrg, setNewRequesterOrg] = useState('');
  const [newQueue, setNewQueue] = useState<SupportTicketQueue>('플랫폼');
  const [newPriority, setNewPriority] = useState<SupportTicketPriority>('긴급');
  const [newAssignee, setNewAssignee] = useState<string>('');

  // 컬럼 표시 상태 (기본 5개 서브 컬럼 모두 표시)
  const [visibleCols, setVisibleCols] = useState({
    requester: true,
    queue: true,
    priority: true,
    sla: true,
    status: true,
  });

  const activeColCount = Object.values(visibleCols).filter(Boolean).length;

  const filteredTickets = useMemo(
    () =>
      filterAndSortTickets(
        tickets,
        searchQuery,
        queueFilter,
        statusFilters,
        sortField,
        sortAsc
      ),
    [tickets, searchQuery, queueFilter, statusFilters, sortField, sortAsc]
  );

  const stats = useMemo(
    () => calculateTicketStats(filteredTickets),
    [filteredTickets]
  );

  const {
    paginatedItems,
    totalPages,
    safePage,
    startIndex,
    endIndex,
  } = useMemo(
    () => paginateTickets(filteredTickets, currentPage, pageSize),
    [filteredTickets, currentPage, pageSize]
  );

  const rowPad =
    density === 'compact'
      ? 'py-2'
      : density === 'relaxed'
      ? 'py-4'
      : 'py-3';

  const handleSort = (field: TicketSortField) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const toggleStatusFilter = (status: SupportTicketStatus) => {
    setCurrentPage(1);
    setStatusFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const isAllCurrentPageSelected =
    paginatedItems.length > 0 &&
    paginatedItems.every((item) => selectedIds.includes(item.id));

  const toggleSelectAllCurrentPage = () => {
    if (isAllCurrentPageSelected) {
      const pageIds = new Set(paginatedItems.map((i) => i.id));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const next = new Set(selectedIds);
      for (const item of paginatedItems) {
        next.add(item.id);
      }
      setSelectedIds(Array.from(next));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const renderSortIcon = (field: TicketSortField) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown
          size={12}
          className="text-klic-muted  group-hover:text-klic-muted transition"
        />
      );
    }
    return sortAsc ? (
      <ArrowUp size={12} className="text-zinc-800 " />
    ) : (
      <ArrowDown size={12} className="text-zinc-800 " />
    );
  };

  const renderQueueBadge = (queue: SupportTicketQueue) => {
    const iconMap: Record<SupportTicketQueue, React.ReactNode> = {
      플랫폼: <Layers size={12} className="text-klic-muted " />,
      빌링: (
        <CreditCard size={12} className="text-klic-muted " />
      ),
      인증: (
        <ShieldCheck size={12} className="text-klic-muted " />
      ),
      연동: <Webhook size={12} className="text-klic-muted " />,
    };

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-zinc-200  bg-white  text-xs font-medium text-zinc-700  shadow-2xs">
        {iconMap[queue]}
        <span>{queue}</span>
      </span>
    );
  };

  const renderPriorityBadge = (priority: SupportTicketPriority) => {
    switch (priority) {
      case '긴급':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50  text-blue-600  border border-blue-200/70 ">
            긴급
          </span>
        );
      case '높음':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50  text-amber-700  border border-amber-200/70 ">
            높음
          </span>
        );
      case '보통':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50  text-blue-700  border border-blue-200/70 ">
            보통
          </span>
        );
      case '낮음':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100  text-klic-muted  border border-zinc-200/70 ">
            낮음
          </span>
        );
    }
  };

  const renderSlaCell = (item: SupportTicketItem) => {
    const labelColor =
      item.slaState === 'breached'
        ? 'text-blue-600  font-semibold'
        : item.slaState === 'near'
        ? 'text-amber-600  font-semibold'
        : item.slaState === 'closed'
        ? 'text-klic-muted  font-medium'
        : 'text-blue-600  font-semibold';

    return (
      <div className="leading-tight">
        <div className={`text-xs ${labelColor}`}>{item.slaLabel}</div>
        <div className="text-[11px] text-klic-muted  mt-0.5">
          {item.slaSubtext}
        </div>
      </div>
    );
  };

  const renderStatusBadge = (status: SupportTicketStatus) => {
    const dotColor =
      status === '대기 중'
        ? 'bg-amber-500'
        : status === '해결됨'
        ? 'bg-blue-500'
        : 'bg-blue-600';

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-zinc-200  bg-white  text-xs font-medium text-zinc-700  shadow-2xs">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        <span>{status}</span>
      </span>
    );
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTicket({
      title: newTitle.trim(),
      requesterName: newRequesterName.trim() || '김도윤 (Doyun Kim)',
      requesterOrg: newRequesterOrg.trim() || 'CoreSphere HQ',
      queue: newQueue,
      priority: newPriority,
      assigneeName: newAssignee ? newAssignee : null,
    });
    setNewTitle('');
    setNewRequesterName('');
    setNewRequesterOrg('');
    setIsNewTicketModalOpen(false);
    setCurrentPage(1);
  };

  const handleConfirmCloseTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!closingTicket) return;
    onBulkUpdateStatus([closingTicket.id], '해결됨');
    setClosingTicket(null);
    setResolutionNote('');
  };

  return (
    <div data-klic-surface="dense" className="w-full bg-white  rounded-xl border border-zinc-200  shadow-2xs overflow-hidden">
      {/* 카드 상단 헤더: 지원 티켓 큐 타이틀 & 요약 카운트 + 새 티켓 버튼 */}
      <div className="px-5 py-4 border-b border-zinc-200  flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-zinc-900  tracking-tight">
            지원 티켓 큐
          </h3>
          <p className="text-xs text-klic-muted  mt-0.5">
            {stats.visibleCount}개 표시됨 • {stats.unassignedCount}개 미배정 •{' '}
            {stats.nearSlaCount}개 SLA 임박
          </p>
        </div>

        <button
          onClick={() => setIsNewTicketModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis  text-xs font-semibold transition shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>새 티켓</span>
        </button>
      </div>

      {/* 필터 및 액션 툴바 */}
      <div className="px-5 py-3 border-b border-zinc-200  flex flex-wrap items-center justify-between gap-2.5 bg-zinc-50/30 ">
        {/* 좌측: 검색창 + 큐 드롭다운 + 상태 다중 필터 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 검색 입력창 */}
          <div className="relative w-52 sm:w-60">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-klic-muted"
            />
            <input data-klic-surface="field"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="티켓 검색..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-white  border border-zinc-200  rounded-lg text-zinc-800  placeholder:text-klic-muted focus:outline-none focus:ring-2 focus:ring-zinc-900/10 "
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-klic-muted hover:text-klic-muted"
                title="검색어 지우기"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* 큐 선택 드롭다운 */}
          <div className="relative">
            <select
              aria-label="큐 필터"
              value={queueFilter}
              onChange={(e) => {
                setQueueFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none pl-3 pr-8 py-1.5 text-xs font-medium bg-white  border border-zinc-200  rounded-lg text-zinc-700  hover:border-zinc-300  focus:outline-none cursor-pointer"
            >
              {QUEUE_OPTIONS.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-klic-muted"
            />
          </div>

          {/* 다중 상태 필터 팝오버 */}
          <div className="relative">
            <button
              onClick={() => {
                setIsStatusPopoverOpen((v) => !v);
                setIsColumnsPopoverOpen(false);
                setIsActionsMenuOpen(false);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition cursor-pointer ${
                statusFilters.length > 0
                  ? 'bg-klic-inverse text-klic-on-emphasis border-zinc-900   '
                  : 'bg-white  text-zinc-700  border-zinc-200  hover:border-zinc-300'
              }`}
            >
              <Filter size={12} />
              <span>상태</span>
              {statusFilters.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20  font-bold">
                  {statusFilters.length}
                </span>
              )}
            </button>

            {isStatusPopoverOpen && (
              <div className="absolute left-0 mt-1.5 w-44 rounded-xl bg-white  border border-zinc-200  shadow-lg p-2 z-30">
                <div className="px-2 py-1 text-[11px] font-semibold text-klic-muted flex items-center justify-between">
                  <span>티켓 상태 필터</span>
                  {statusFilters.length > 0 && (
                    <button
                      onClick={() => setStatusFilters([])}
                      className="text-[10px] text-blue-600 hover:underline"
                    >
                      초기화
                    </button>
                  )}
                </div>
                <div className="mt-1 space-y-0.5">
                  {STATUS_OPTIONS.map((st) => {
                    const checked = statusFilters.includes(st);
                    return (
                      <button
                        key={st}
                        onClick={() => toggleStatusFilter(st)}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-zinc-700  hover:bg-zinc-100  transition"
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              st === '대기 중'
                                ? 'bg-amber-500'
                                : st === '해결됨'
                                ? 'bg-blue-500'
                                : 'bg-blue-600'
                            }`}
                          />
                          {st}
                        </span>
                        {checked && (
                          <Check size={13} className="text-zinc-900 " />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 우측: 컬럼 5 토글 + 액션 메뉴 */}
        <div className="flex items-center gap-2">
          {/* 컬럼 표시 팝오버 */}
          <div className="relative">
            <button
              onClick={() => {
                setIsColumnsPopoverOpen((v) => !v);
                setIsStatusPopoverOpen(false);
                setIsActionsMenuOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white  border border-zinc-200  rounded-lg text-zinc-700  hover:border-zinc-300 transition cursor-pointer"
            >
              <SlidersHorizontal size={12} className="text-klic-muted" />
              <span>컬럼</span>
              <span className="px-1.5 py-0.2 rounded bg-zinc-100  text-klic-muted  text-[11px] font-semibold">
                {activeColCount}
              </span>
            </button>

            {isColumnsPopoverOpen && (
              <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white  border border-zinc-200  shadow-lg p-2 z-30">
                <div className="px-2 py-1 text-[11px] font-semibold text-klic-muted">
                  표시할 컬럼 선택
                </div>
                {(
                  [
                    ['requester', '요청자'],
                    ['queue', '큐'],
                    ['priority', '우선순위'],
                    ['sla', 'SLA'],
                    ['status', '상태'],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() =>
                      setVisibleCols((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-zinc-700  hover:bg-zinc-100 "
                  >
                    <span>{label}</span>
                    {visibleCols[key] && <Check size={13} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="relative">
            <button
              onClick={() => {
                setIsActionsMenuOpen((v) => !v);
                setIsStatusPopoverOpen(false);
                setIsColumnsPopoverOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white  border border-zinc-200  rounded-lg text-zinc-700  hover:border-zinc-300 transition cursor-pointer"
            >
              <span>액션</span>
            </button>

            {isActionsMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-52 rounded-xl bg-white  border border-zinc-200  shadow-lg p-1.5 z-30">
                <div className="px-2.5 py-1 text-[10px] font-semibold text-klic-muted">
                  큐 일괄 작업
                </div>
                <button
                  onClick={() => {
                    const breachedIds = tickets
                      .filter((t) => t.slaState === 'breached' || t.slaState === 'near')
                      .map((t) => t.id);
                    setSelectedIds(breachedIds);
                    setIsActionsMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-zinc-700  hover:bg-zinc-100 "
                >
                  SLA 임박 티켓 전체 선택 ({stats.nearSlaCount}개)
                </button>
                <button
                  onClick={() => {
                    const unassignedIds = tickets
                      .filter((t) => !t.assigneeName)
                      .map((t) => t.id);
                    onBulkAssignOwner(unassignedIds, '박수빈');
                    setIsActionsMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-zinc-700  hover:bg-zinc-100 "
                >
                  미배정 티켓 당직자 자동 배정
                </button>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setQueueFilter('전체 큐');
                    setStatusFilters([]);
                    setSelectedIds([]);
                    setIsActionsMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-blue-600 hover:bg-blue-50 "
                >
                  필터 및 선택 초기화
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 다중 선택 시 활성화되는 일괄 담당자 배정 / 상태 변경 바 */}
      {selectedIds.length > 0 && (
        <div className="px-5 py-2.5 bg-klic-inverse  text-klic-on-emphasis flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-white/15 font-semibold">
              {selectedIds.length}개 선택됨
            </span>
            <span className="text-klic-muted">
              선택한 티켓에 대해 일괄 담당자 지정 또는 상태 전환을 수행합니다.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                onBulkAssignOwner(selectedIds, '박수빈');
                setSelectedIds([]);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-klic-on-emphasis font-medium transition cursor-pointer"
            >
              <UserCheck size={12} />
              <span>박수빈에게 배정</span>
            </button>
            <button
              onClick={() => {
                onBulkUpdateStatus(selectedIds, '대기 중');
                setSelectedIds([]);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-medium transition cursor-pointer"
            >
              <span>대기 중 전환</span>
            </button>
            <button
              onClick={() => {
                onBulkUpdateStatus(selectedIds, '해결됨');
                setSelectedIds([]);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 font-medium transition cursor-pointer"
            >
              <CheckCircle2 size={12} />
              <span>일괄 해결됨 처리</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2 py-1 text-klic-muted hover:text-klic-on-emphasis"
            >
              선택 해제
            </button>
          </div>
        </div>
      )}

      {/* 메인 지원 티켓 데이터 그리드 */}
      <div className="overflow-x-auto">
        <table data-klic-surface="dense" className="w-full text-left border-collapse min-w-[780px]">
          <thead>
            <tr className="border-b border-zinc-200  text-[11px] font-medium text-klic-muted  bg-zinc-50/40 ">
              <th className="w-10 pl-5 pr-2 py-2.5">
                <input
                  type="checkbox"
                  aria-label="현재 페이지 티켓 전체 선택"
                  checked={isAllCurrentPageSelected}
                  onChange={toggleSelectAllCurrentPage}
                  className="w-3.5 h-3.5 rounded border-zinc-300  accent-zinc-900  cursor-pointer"
                />
              </th>
              <th className="px-3 py-2.5">
                <button
                  onClick={() => handleSort('ticket')}
                  className="inline-flex items-center gap-1 group cursor-pointer hover:text-zinc-900 "
                >
                  <span>티켓</span>
                  {renderSortIcon('ticket')}
                </button>
              </th>
              {visibleCols.requester && (
                <th className="px-3 py-2.5">
                  <button
                    onClick={() => handleSort('requester')}
                    className="inline-flex items-center gap-1 group cursor-pointer hover:text-zinc-900 "
                  >
                    <span>요청자</span>
                    {renderSortIcon('requester')}
                  </button>
                </th>
              )}
              {visibleCols.queue && (
                <th className="px-3 py-2.5">
                  <button
                    onClick={() => handleSort('queue')}
                    className="inline-flex items-center gap-1 group cursor-pointer hover:text-zinc-900 "
                  >
                    <span>큐</span>
                    {renderSortIcon('queue')}
                  </button>
                </th>
              )}
              {visibleCols.priority && (
                <th className="px-3 py-2.5">
                  <button
                    onClick={() => handleSort('priority')}
                    className="inline-flex items-center gap-1 group cursor-pointer hover:text-zinc-900 "
                  >
                    <span>우선순위</span>
                    {renderSortIcon('priority')}
                  </button>
                </th>
              )}
              {visibleCols.sla && (
                <th className="px-3 py-2.5">
                  <button
                    onClick={() => handleSort('sla')}
                    className="inline-flex items-center gap-1 group cursor-pointer hover:text-zinc-900 "
                  >
                    <span>SLA</span>
                    {renderSortIcon('sla')}
                  </button>
                </th>
              )}
              {visibleCols.status && (
                <th className="px-3 py-2.5">
                  <button
                    onClick={() => handleSort('status')}
                    className="inline-flex items-center gap-1 group cursor-pointer hover:text-zinc-900 "
                  >
                    <span>상태</span>
                    {renderSortIcon('status')}
                  </button>
                </th>
              )}
              <th className="w-12 pr-5 py-2.5 text-right" />
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-200/70  text-xs">
            {paginatedItems.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-klic-muted "
                >
                  조건에 일치하는 고객 지원 티켓이 없습니다.
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`group transition-colors ${
                      isSelected
                        ? 'bg-zinc-100/70 '
                        : 'hover:bg-zinc-50/80 '
                    }`}
                  >
                    {/* 행 체크박스 */}
                    <td className={`pl-5 pr-2 ${rowPad} align-middle`}>
                      <input
                        type="checkbox"
                        aria-label={`${item.code} 선택`}
                        checked={isSelected}
                        onChange={() => toggleSelectRow(item.id)}
                        className="w-3.5 h-3.5 rounded border-zinc-300  accent-zinc-900  cursor-pointer"
                      />
                    </td>

                    {/* 티켓 제목 + 코드/접수 시각 */}
                    <td className={`px-3 ${rowPad} align-middle max-w-[290px]`}>
                      <div className="font-semibold text-zinc-900  truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-klic-muted  mt-0.5 flex items-center gap-1.5">
                        <span className="font-mono">{item.code}</span>
                        <span>•</span>
                        <span>{item.openedAgo}</span>
                        {!item.assigneeName && (
                          <>
                            <span>•</span>
                            <span className="text-amber-600  font-medium">
                              미배정
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* 요청자 아바타 + 이름/소속 조직 */}
                    {visibleCols.requester && (
                      <td className={`px-3 ${rowPad} align-middle`}>
                        <div className="flex items-center gap-2.5">
                          {showAvatars &&
                            (item.requesterAvatar ? (
                              <PersonAvatar
                                src={item.requesterAvatar}
                                alt={item.requesterName}
                                className="w-7 h-7 rounded-full object-cover border border-zinc-200  shrink-0"
                              />
                            ) : (
                              <span className="w-7 h-7 rounded-full bg-zinc-100  text-zinc-700  text-[11px] font-semibold flex items-center justify-center border border-zinc-200  shrink-0">
                                {item.requesterInitials}
                              </span>
                            ))}
                          <div className="min-w-0">
                            <div className="font-medium text-zinc-900  truncate">
                              {item.requesterName}
                            </div>
                            <div className="text-[11px] text-klic-muted  truncate">
                              {item.requesterOrg}
                            </div>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* 큐 배지 */}
                    {visibleCols.queue && (
                      <td className={`px-3 ${rowPad} align-middle whitespace-nowrap`}>
                        {renderQueueBadge(item.queue)}
                      </td>
                    )}

                    {/* 우선순위 배지 */}
                    {visibleCols.priority && (
                      <td className={`px-3 ${rowPad} align-middle whitespace-nowrap`}>
                        {renderPriorityBadge(item.priority)}
                      </td>
                    )}

                    {/* SLA 카운트다운 셀 */}
                    {visibleCols.sla && (
                      <td className={`px-3 ${rowPad} align-middle whitespace-nowrap`}>
                        {renderSlaCell(item)}
                      </td>
                    )}

                    {/* 상태 배지 */}
                    {visibleCols.status && (
                      <td className={`px-3 ${rowPad} align-middle whitespace-nowrap`}>
                        {renderStatusBadge(item.status)}
                      </td>
                    )}

                    {/* 우측 행 더보기 메뉴 (...) */}
                    <td className={`pr-5 pl-2 ${rowPad} align-middle text-right relative`}>
                      <button
                        aria-label={`${item.code} 작업 메뉴`}
                        onClick={() =>
                          setActiveRowMenuId((prev) =>
                            prev === item.id ? null : item.id
                          )
                        }
                        className="p-1.5 rounded-lg text-klic-muted hover:text-zinc-700  hover:bg-zinc-100  transition cursor-pointer"
                      >
                        <MoreHorizontal size={15} />
                      </button>

                      {activeRowMenuId === item.id && (
                        <div className="absolute right-5 mt-1 w-44 rounded-xl bg-white  border border-zinc-200  shadow-xl p-1.5 z-30 text-left">
                          <div className="px-2 py-1 text-[10px] font-mono text-klic-muted border-b border-zinc-100 ">
                            {item.code} • {item.assigneeName || '담당자 미배정'}
                          </div>
                          <button
                            onClick={() => {
                              onBulkUpdateStatus([item.id], '열림');
                              setActiveRowMenuId(null);
                            }}
                            className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-zinc-700  hover:bg-zinc-100  mt-0.5"
                          >
                            상태: 열림으로 변경
                          </button>
                          <button
                            onClick={() => {
                              onBulkUpdateStatus([item.id], '대기 중');
                              setActiveRowMenuId(null);
                            }}
                            className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-zinc-700  hover:bg-zinc-100 "
                          >
                            상태: 대기 중으로 변경
                          </button>
                          <button
                            onClick={() => {
                              setClosingTicket(item);
                              setActiveRowMenuId(null);
                            }}
                            className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-blue-600  font-medium hover:bg-blue-50 "
                          >
                            티켓 종료 및 해결 처리...
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 하단 페이지네이션 바 */}
      <div className="px-5 py-3 border-t border-zinc-200  flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-klic-muted  bg-zinc-50/20 ">
        {/* 좌측: 페이지당 행 수 */}
        <div className="flex items-center gap-2.5">
          <span>페이지당 행 수</span>
          <div className="relative">
            <select
              aria-label="페이지당 행 수"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="appearance-none pl-2.5 pr-7 py-1 text-xs font-medium bg-white  border border-zinc-200  rounded-md text-zinc-700  cursor-pointer"
            >
              <option value={6}>6</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
            <ChevronDown
              size={12}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-klic-muted"
            />
          </div>
        </div>

        {/* 우측: 1 - 6 of 11 & 페이지 번호 버튼 */}
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <span className="font-medium text-klic-muted ">
            전체 {filteredTickets.length}개 중 {startIndex} - {endIndex}
          </span>

          <div className="flex items-center gap-1">
            <button
              aria-label="이전 페이지"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 rounded-md flex items-center justify-center border border-transparent hover:border-zinc-200  disabled:opacity-35 disabled:pointer-events-none text-klic-muted  cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
              (pageNum) => {
                const isActive = pageNum === safePage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-md text-xs font-semibold transition cursor-pointer ${
                      isActive
                        ? 'bg-white  border border-zinc-200  text-zinc-900  shadow-2xs'
                        : 'text-klic-muted hover:text-zinc-900 '
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
            )}

            <button
              aria-label="다음 페이지"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-7 h-7 rounded-md flex items-center justify-center border border-transparent hover:border-zinc-200  disabled:opacity-35 disabled:pointer-events-none text-klic-muted  cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 티켓 종료 다이얼로그 (Close-ticket dialog) */}
      {closingTicket && (
        <div className="fixed inset-0 z-50 bg-klic-inverse/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white  rounded-2xl border border-zinc-200  shadow-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-50  text-blue-600  flex items-center justify-center">
                  <CheckCircle2 size={17} />
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 ">
                    지원 티켓 종료 ({closingTicket.code})
                  </h4>
                  <p className="text-xs text-klic-muted">
                    티켓을 해결됨 상태로 변경하고 활성 SLA 타이머를 종료합니다.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setClosingTicket(null)}
                className="text-klic-muted hover:text-klic-muted"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleConfirmCloseTicket} className="mt-4 space-y-3">
              <div className="p-3 rounded-lg bg-zinc-50  border border-zinc-200/70  text-xs">
                <div className="font-semibold text-zinc-800 ">
                  {closingTicket.title}
                </div>
                <div className="text-klic-muted mt-0.5">
                  요청자: {closingTicket.requesterName} ({closingTicket.requesterOrg})
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700  mb-1">
                  조치 및 해결 요약 메모
                </label>
                <textarea data-klic-surface="field"
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="근본 원인 및 고객 안내 사항을 기록하세요..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200  bg-white  text-zinc-800  focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setClosingTicket(null)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200  text-xs font-medium text-klic-muted "
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-klic-inverse  text-klic-on-emphasis  text-xs font-semibold"
                >
                  티켓 종료 확인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 새 지원 티켓 생성 다이얼로그 */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-klic-inverse/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white  rounded-2xl border border-zinc-200  shadow-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 ">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-zinc-700 " />
                <h4 className="text-sm font-semibold text-zinc-900 ">
                  새 고객 지원 티켓 등록
                </h4>
              </div>
              <button
                onClick={() => setIsNewTicketModalOpen(false)}
                className="text-klic-muted hover:text-klic-muted"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-zinc-700  mb-1">
                  티켓 제목
                </label>
                <input data-klic-surface="field"
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 엔터프라이즈 SSO 토큰 갱신 지연 현상"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200  bg-white  text-zinc-900 "
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-medium text-zinc-700  mb-1">
                    요청자 이름
                  </label>
                  <input data-klic-surface="field"
                    type="text"
                    value={newRequesterName}
                    onChange={(e) => setNewRequesterName(e.target.value)}
                    placeholder="김도윤 (Doyun Kim)"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200  bg-white  text-zinc-900 "
                  />
                </div>
                <div>
                  <label className="block font-medium text-zinc-700  mb-1">
                    소속 고객사
                  </label>
                  <input data-klic-surface="field"
                    type="text"
                    value={newRequesterOrg}
                    onChange={(e) => setNewRequesterOrg(e.target.value)}
                    placeholder="CoreSphere 본사"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200  bg-white  text-zinc-900 "
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-medium text-zinc-700  mb-1">
                    담당 큐
                  </label>
                  <select
                    value={newQueue}
                    onChange={(e) =>
                      setNewQueue(e.target.value as SupportTicketQueue)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200  bg-white  text-zinc-900 "
                  >
                    <option value="플랫폼">플랫폼</option>
                    <option value="빌링">빌링</option>
                    <option value="인증">인증</option>
                    <option value="연동">연동</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-zinc-700  mb-1">
                    우선순위
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) =>
                      setNewPriority(e.target.value as SupportTicketPriority)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200  bg-white  text-zinc-900 "
                  >
                    <option value="긴급">긴급</option>
                    <option value="높음">높음</option>
                    <option value="보통">보통</option>
                    <option value="낮음">낮음</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-700  mb-1">
                  담당자 배정 (선택)
                </label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200  bg-white  text-zinc-900 "
                >
                  <option value="">미배정 (대기열 유지)</option>
                  {OWNER_OPTIONS.map((owner) => (
                    <option key={owner} value={owner}>
                      {owner}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 ">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200  text-klic-muted  font-medium"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-klic-inverse  text-klic-on-emphasis  font-semibold"
                >
                  티켓 생성
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
