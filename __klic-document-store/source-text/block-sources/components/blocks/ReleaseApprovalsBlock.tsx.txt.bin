import { PersonAvatar } from '../PersonAvatar';
import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Plus,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';
import {
  ReleaseApprovalItem,
  ReleaseApprovalStatus,
  ReleaseCheckBadgeStatus,
  ReleaseRiskLevel,
} from '../../types';
import { filterAndSortReleases } from '../../utils/releases';

interface ReleaseApprovalsBlockProps {
  releases: ReleaseApprovalItem[];
  onToggleExpand: (releaseId: string) => void;
  onExpandAll: (expand: boolean) => void;
  onApproveRelease: (releaseId: string) => void;
  onAdvanceCheckCard: (releaseId: string, cardId: string) => void;
  onAddRelease: (payload: {
    title: string;
    service: string;
    risk: ReleaseRiskLevel;
    ownerName: string;
  }) => void;
  density: 'compact' | 'normal' | 'relaxed';
  showAvatars: boolean;
  showProgressRings: boolean;
}

function CircularRing({
  percentage,
  size = 18,
  strokeWidth = 2.4,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percentage));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  const strokeColor =
    clamped >= 80
      ? 'text-blue-500'
      : clamped >= 50
      ? 'text-amber-500'
      : 'text-blue-500';

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="-rotate-90 shrink-0"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-klic-on-emphasis "
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className={`${strokeColor} transition-all duration-300`}
      />
    </svg>
  );
}

export function ReleaseApprovalsBlock({
  releases,
  onToggleExpand,
  onExpandAll,
  onApproveRelease,
  onAdvanceCheckCard,
  onAddRelease,
  density,
  showAvatars,
  showProgressRings,
}: ReleaseApprovalsBlockProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('전체 서비스');
  const [statusFilter, setStatusFilter] = useState('전체 상태');
  const [sortField, setSortField] = useState<'default' | 'risk' | 'readiness'>('default');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAllCheckCards, setShowAllCheckCards] = useState<Record<string, boolean>>({});
  const [isViewSettingsOpen, setIsViewSettingsOpen] = useState(false);
  const [showChecklistSection, setShowChecklistSection] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // 새 릴리즈 입력 상태
  const [newTitle, setNewTitle] = useState('');
  const [newService, setNewService] = useState('결제/체크아웃');
  const [newRisk, setNewRisk] = useState<ReleaseRiskLevel>('심각');
  const [newOwner, setNewOwner] = useState('박수빈');

  const filteredReleases = useMemo(
    () =>
      filterAndSortReleases(releases, {
        searchQuery,
        serviceFilter,
        statusFilter,
        sortField,
        sortDirection,
      }),
    [releases, searchQuery, serviceFilter, statusFilter, sortField, sortDirection]
  );

  const totalItems = filteredReleases.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const paginatedReleases = filteredReleases.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const rowPad =
    density === 'compact'
      ? 'py-2.5'
      : density === 'relaxed'
      ? 'py-4'
      : 'py-3';

  const handleSortRisk = () => {
    if (sortField === 'risk') {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField('risk');
      setSortDirection('desc');
    }
  };

  const renderStatusPill = (status: ReleaseApprovalStatus) => {
    const dotClass =
      status === '승인 완료'
        ? 'bg-blue-500'
        : status === '차단됨'
        ? 'bg-blue-500'
        : 'bg-amber-500';
    const textClass =
      status === '승인 완료'
        ? 'text-blue-700 '
        : status === '차단됨'
        ? 'text-blue-600 '
        : 'text-amber-700 ';

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-zinc-200  bg-white  text-[11px] font-medium whitespace-nowrap shadow-2xs ${textClass}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
        {status}
      </span>
    );
  };

  const renderRiskBadge = (risk: ReleaseRiskLevel) => {
    const map: Record<ReleaseRiskLevel, string> = {
      '심각':
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
        className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium whitespace-nowrap ${map[risk]}`}
      >
        {risk}
      </span>
    );
  };

  const renderCheckCardBadge = (badgeStatus: ReleaseCheckBadgeStatus) => {
    if (badgeStatus === '주의 필요') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50  border border-blue-200/80  text-[11px] font-medium text-blue-600  w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          주의 필요
        </span>
      );
    }
    if (badgeStatus === '완료') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50  border border-blue-200/80  text-[11px] font-medium text-blue-700  w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          완료
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-100  border border-zinc-200/80  text-[11px] font-medium text-zinc-700  w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
        진행 중
      </span>
    );
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddRelease({
      title: newTitle.trim(),
      service: newService,
      risk: newRisk,
      ownerName: newOwner,
    });
    setNewTitle('');
    setIsNewModalOpen(false);
    setCurrentPage(1);
  };

  return (
    <div className="w-full bg-white  rounded-2xl border border-zinc-200/90  shadow-2xs overflow-hidden transition-colors">
      {/* 상단 릴리즈 검토 헤더 */}
      <div className="p-4 sm:p-5 border-b border-zinc-200/80  flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-bold text-zinc-900  tracking-tight">
            릴리즈 검토
          </h3>
          <p className="text-xs text-klic-muted  mt-0.5">
            예정된 배포 윈도우, 블로커 및 사전 점검 항목을 관리합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewModalOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-klic-inverse  text-klic-on-emphasis  text-xs font-semibold hover:bg-klic-inverse  transition shadow-2xs self-start sm:self-auto"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>새 릴리즈 검토</span>
        </button>
      </div>

      {/* 새 릴리즈 검토 추가 인라인 폼 */}
      {isNewModalOpen && (
        <form
          onSubmit={handleCreateSubmit}
          className="p-3.5 bg-zinc-50  border-b border-zinc-200  flex flex-wrap items-center gap-2.5"
        >
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="새 배포 요청 제목 입력 (예: 글로벌 결제 라우팅 가중치 변경)..."
            className="flex-1 min-w-56 px-3 py-1.5 text-xs rounded-lg border border-zinc-200  bg-white  text-zinc-900  outline-none"
            autoFocus
          />
          <select
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200  bg-white  text-zinc-700 "
          >
            <option value="결제/체크아웃">결제/체크아웃</option>
            <option value="웹훅">웹훅</option>
            <option value="인증/보안">인증/보안</option>
          </select>
          <select
            value={newRisk}
            onChange={(e) => setNewRisk(e.target.value as ReleaseRiskLevel)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200  bg-white  text-zinc-700 "
          >
            <option value="심각">위험도: 심각</option>
            <option value="높음">위험도: 높음</option>
            <option value="보통">위험도: 보통</option>
            <option value="낮음">위험도: 낮음</option>
          </select>
          <select
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200  bg-white  text-zinc-700 "
          >
            <option value="박수빈">박수빈</option>
            <option value="오태양">오태양</option>
            <option value="이준호">이준호</option>
            <option value="정하윤">정하윤</option>
          </select>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-klic-inverse  text-klic-on-emphasis  text-xs font-semibold"
          >
            추가
          </button>
          <button
            type="button"
            onClick={() => setIsNewModalOpen(false)}
            className="p-1 text-klic-muted hover:text-zinc-700"
          >
            <X size={14} />
          </button>
        </form>
      )}

      {/* 검색 및 필터 바 */}
      <div className="px-4 py-3 border-b border-zinc-200/80  flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* 검색 입력창 */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-klic-muted"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="릴리즈 검색..."
              className="pl-8 pr-3 py-1.5 w-56 sm:w-64 rounded-lg border border-zinc-200  bg-white  text-xs text-zinc-800  placeholder:text-klic-muted outline-none focus:border-zinc-400 shadow-2xs"
            />
          </div>

          {/* 서비스 필터 */}
          <select
            value={serviceFilter}
            onChange={(e) => {
              setServiceFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="서비스 필터"
            className="px-3 py-1.5 rounded-lg border border-zinc-200  bg-white  text-xs font-medium text-zinc-700  outline-none shadow-2xs"
          >
            <option value="전체 서비스">전체 서비스</option>
            <option value="결제/체크아웃">결제/체크아웃</option>
            <option value="웹훅">웹훅</option>
            <option value="인증/보안">인증/보안</option>
          </select>

          {/* 상태 필터 */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="상태 필터"
            className="px-3 py-1.5 rounded-lg border border-zinc-200  bg-white  text-xs font-medium text-zinc-700  outline-none shadow-2xs"
          >
            <option value="전체 상태">전체 상태</option>
            <option value="승인 대기">승인 대기</option>
            <option value="차단됨">차단됨</option>
            <option value="승인 완료">승인 완료</option>
          </select>
        </div>

        {/* 우측 보기 설정 버튼 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsViewSettingsOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200  bg-white  text-xs font-medium text-zinc-700  hover:bg-zinc-50  transition shadow-2xs"
          >
            <SlidersHorizontal size={13} />
            <span>보기 설정</span>
          </button>

          {isViewSettingsOpen && (
            <div className="absolute right-0 mt-1.5 w-60 rounded-xl bg-white  border border-zinc-200  shadow-xl p-3 z-30 space-y-2.5 text-xs">
              <div className="font-semibold text-zinc-800  pb-1 border-b border-zinc-100 ">
                릴리즈 큐 보기 설정
              </div>
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-klic-muted ">체크리스트 카드 레일 표시</span>
                <input
                  type="checkbox"
                  checked={showChecklistSection}
                  onChange={(e) => setShowChecklistSection(e.target.checked)}
                  className="rounded accent-zinc-900"
                />
              </label>
              <div className="flex items-center gap-1.5 pt-1 border-t border-zinc-100 ">
                <button
                  type="button"
                  onClick={() => {
                    onExpandAll(true);
                    setIsViewSettingsOpen(false);
                  }}
                  className="flex-1 py-1.5 rounded-md bg-zinc-100  hover:bg-zinc-200 text-[11px] font-medium text-zinc-700 "
                >
                  모두 펼치기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onExpandAll(false);
                    setIsViewSettingsOpen(false);
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

      {/* 메인 테이블 영역 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200/80  bg-zinc-50/40  text-[11px] font-medium text-klic-muted ">
              <th className="py-2.5 pl-4 pr-3 min-w-72 font-medium border-r border-zinc-100 ">
                요청 항목
              </th>
              <th className="py-2.5 px-3.5 w-44 font-medium border-r border-zinc-100 ">
                담당자
              </th>
              <th className="py-2.5 px-3.5 w-32 font-medium border-r border-zinc-100 ">
                상태
              </th>
              <th className="py-2.5 px-3.5 w-24 font-medium border-r border-zinc-100 ">
                <button
                  type="button"
                  onClick={handleSortRisk}
                  className="inline-flex items-center gap-1 hover:text-zinc-800  transition"
                >
                  <span>위험도</span>
                  {sortField === 'risk' && sortDirection === 'asc' ? (
                    <ArrowUp size={12} className="text-klic-muted" />
                  ) : (
                    <ArrowDown size={12} className="text-klic-muted" />
                  )}
                </button>
              </th>
              <th className="py-2.5 px-3.5 w-28 font-medium border-r border-zinc-100 ">
                승인 현황
              </th>
              <th className="py-2.5 px-3.5 w-28 font-medium border-r border-zinc-100 ">
                준비도
              </th>
              <th className="py-2.5 px-2 w-10 text-center" />
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-200/70  text-xs">
            {paginatedReleases.map((rel) => {
              const pendingApprovals = Math.max(0, rel.totalApprovers - rel.approvedCount);
              const totalChecks = rel.checklist.length;
              const openChecksCount = rel.checklist.filter(
                (c) => c.badgeStatus !== '완료'
              ).length;
              const isShowingAllCards = Boolean(showAllCheckCards[rel.id]);
              const visibleCards = isShowingAllCards
                ? rel.checklist
                : rel.checklist.slice(0, 3);
              const extraCardsCount = Math.max(0, totalChecks - 3);

              return (
                <React.Fragment key={rel.id}>
                  {/* 릴리즈 요청 메인 행 */}
                  <tr className="hover:bg-zinc-50/70  transition-colors">
                    {/* 요청 항목 */}
                    <td className={`${rowPad} pl-3.5 pr-3 border-r border-zinc-100 `}>
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          onClick={() => onToggleExpand(rel.id)}
                          className="mt-1 p-0.5 rounded hover:bg-zinc-200/70  text-klic-muted transition shrink-0"
                          title={rel.isExpanded ? '점검 카드 접기' : '점검 카드 펼치기'}
                        >
                          {rel.isExpanded ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                        </button>
                        <div className="min-w-0">
                          <div
                            onClick={() => onToggleExpand(rel.id)}
                            className="font-semibold text-zinc-900  tracking-tight cursor-pointer hover:underline"
                          >
                            {rel.title}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-klic-muted  mt-0.5 whitespace-nowrap">
                            <span className="font-mono text-klic-muted ">
                              {rel.code}
                            </span>
                            <span>•</span>
                            <span>{rel.service}</span>
                            <span>•</span>
                            <span>{rel.environment}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 담당자 */}
                    <td className={`${rowPad} px-3.5 border-r border-zinc-100  whitespace-nowrap`}>
                      <div className="flex items-center gap-2.5">
                        {showAvatars && (
                          <PersonAvatar
                            src={rel.ownerAvatar}
                            alt={rel.ownerName}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                        )}
                        <div>
                          <div className="font-semibold text-zinc-900 ">
                            {rel.ownerName}
                          </div>
                          <div className="text-[11px] text-klic-muted ">
                            {rel.ownerRole}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 상태 */}
                    <td className={`${rowPad} px-3.5 border-r border-zinc-100  whitespace-nowrap`}>
                      {renderStatusPill(rel.status)}
                    </td>

                    {/* 위험도 */}
                    <td className={`${rowPad} px-3.5 border-r border-zinc-100  whitespace-nowrap`}>
                      {renderRiskBadge(rel.risk)}
                    </td>

                    {/* 승인 현황 */}
                    <td className={`${rowPad} px-3.5 border-r border-zinc-100  whitespace-nowrap`}>
                      <div className="font-semibold text-zinc-900 ">
                        {rel.approvedCount}/{rel.totalApprovers}
                      </div>
                      <div className="text-[11px] text-klic-muted ">
                        {pendingApprovals > 0
                          ? `${pendingApprovals}건 대기 중`
                          : '전원 승인됨'}
                      </div>
                    </td>

                    {/* 준비도 */}
                    <td className={`${rowPad} px-3.5 border-r border-zinc-100  whitespace-nowrap`}>
                      <div className="inline-flex items-center gap-2">
                        {showProgressRings && (
                          <CircularRing percentage={rel.readiness} size={18} />
                        )}
                        <span className="font-semibold text-zinc-900  font-mono">
                          {rel.readiness}%
                        </span>
                      </div>
                    </td>

                    {/* 우측 액션 메뉴 */}
                    <td className={`${rowPad} px-2 text-center relative`}>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId((prev) => (prev === rel.id ? null : rel.id))
                        }
                        className="p-1 rounded hover:bg-zinc-200/70  text-klic-muted transition"
                        title="릴리즈 액션 메뉴"
                      >
                        <MoreHorizontal size={14} />
                      </button>

                      {openMenuId === rel.id && (
                        <div className="absolute right-6 top-9 w-40 rounded-lg bg-white  border border-zinc-200  shadow-lg py-1 z-20 text-left text-[11px]">
                          <button
                            type="button"
                            onClick={() => {
                              onApproveRelease(rel.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 hover:bg-zinc-100  text-zinc-700  flex items-center gap-1.5"
                          >
                            <CheckCircle2 size={12} className="text-blue-500" />
                            <span>릴리즈 승인 (+1)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onToggleExpand(rel.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 hover:bg-zinc-100  text-zinc-700  flex items-center gap-1.5"
                          >
                            <AlertTriangle size={12} className="text-amber-500" />
                            <span>점검 카드 토글</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* 확장된 체크리스트 카드 레일 (Rating 별표 대신 진척률 프로그레스 바 적용) */}
                  {showChecklistSection && rel.isExpanded && (
                    <tr className="bg-zinc-50/40 ">
                      <td colSpan={7} className="px-4 py-3.5">
                        {/* 체크리스트 요약 헤더 */}
                        <div className="flex flex-wrap items-center gap-1.5 text-xs mb-3">
                          <span className="font-semibold text-zinc-900 ">
                            체크리스트
                          </span>
                          <span className="text-klic-muted">•</span>
                          <span className="text-klic-muted ">
                            전체 {totalChecks}개 중 {visibleCards.length}개 항목
                          </span>
                          <span className="text-klic-muted">•</span>
                          <span className="text-klic-muted ">
                            {openChecksCount}개 진행 중
                          </span>
                          {extraCardsCount > 0 && (
                            <>
                              <span className="text-klic-muted">•</span>
                              <button
                                type="button"
                                onClick={() =>
                                  setShowAllCheckCards((prev) => ({
                                    ...prev,
                                    [rel.id]: !prev[rel.id],
                                  }))
                                }
                                className="text-klic-muted  font-medium hover:text-zinc-900  underline-offset-2 hover:underline"
                              >
                                {isShowingAllCards
                                  ? '접기'
                                  : `+${extraCardsCount}개 더보기`}
                              </button>
                            </>
                          )}
                        </div>

                        {/* 체크 카드 그리드 */}
                        {visibleCards.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                            {visibleCards.map((card) => {
                              const barFillColor =
                                card.progressRate >= 85
                                  ? 'bg-blue-500'
                                  : card.progressRate >= 55
                                  ? 'bg-amber-500'
                                  : 'bg-blue-500';

                              return (
                                <div
                                  key={card.id}
                                  onClick={() => onAdvanceCheckCard(rel.id, card.id)}
                                  title="클릭하여 점검 진척률 업데이트"
                                  className="rounded-xl border border-zinc-200  bg-white  p-3.5 shadow-2xs hover:border-zinc-300  transition cursor-pointer flex flex-col justify-between gap-3"
                                >
                                  <div className="space-y-2">
                                    {/* 상단 상태 배지 */}
                                    {renderCheckCardBadge(card.badgeStatus)}

                                    {/* 카드 제목 */}
                                    <div className="text-[13px] font-bold text-zinc-900  tracking-tight">
                                      {card.title}
                                    </div>

                                    {/* 담당자 아바타 & 마감일 */}
                                    <div className="flex items-center gap-1.5 text-[11px] text-klic-muted ">
                                      {showAvatars && (
                                        <PersonAvatar
                                          src={card.assigneeAvatar}
                                          alt={card.assigneeName}
                                          className="w-4 h-4 rounded-full object-cover shrink-0"
                                        />
                                      )}
                                      <span className="text-zinc-700  font-medium">
                                        {card.assigneeName}
                                      </span>
                                      <span>•</span>
                                      <span>{card.dateLabel}</span>
                                    </div>
                                  </div>

                                  {/* 하단 영역: 별표(Rating) 대신 진척률 프로그레스 바 + 우측 커버리지 링 */}
                                  <div className="pt-2 border-t border-zinc-100  flex items-center justify-between gap-4">
                                    {/* 진척률 프로그레스 바 */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between text-[11px] mb-1">
                                        <span className="font-medium text-klic-muted ">
                                          진척률
                                        </span>
                                        <span className="font-mono font-semibold text-zinc-800 ">
                                          {card.progressRate}%
                                        </span>
                                      </div>
                                      <div className="h-2 w-full rounded-full bg-zinc-100  overflow-hidden">
                                        <div
                                          className={`h-full rounded-full ${barFillColor} transition-all duration-300`}
                                          style={{ width: `${card.progressRate}%` }}
                                        />
                                      </div>
                                    </div>

                                    {/* 우측 커버리지 링 */}
                                    <div className="inline-flex items-center gap-1.5 shrink-0 pl-1">
                                      {showProgressRings && (
                                        <CircularRing
                                          percentage={card.coverageRate}
                                          size={16}
                                          strokeWidth={2.2}
                                        />
                                      )}
                                      <span className="text-[11px] font-mono font-medium text-klic-muted ">
                                        {card.coverageRate}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-xs text-klic-muted py-2">
                            등록된 세부 점검 체크리스트 항목이 없습니다.
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 하단 페이지네이션 바 */}
      <div className="px-4 py-3 border-t border-zinc-200/80  flex flex-wrap items-center justify-between gap-3 text-xs text-klic-muted ">
        <div className="flex items-center gap-2">
          <span>페이지당 행 수</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            aria-label="페이지당 행 수"
            className="px-2.5 py-1 rounded-lg border border-zinc-200  bg-white  text-zinc-800  font-medium outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span>
            전체 {totalItems}개 중 {totalItems === 0 ? 0 : startIndex + 1} -{' '}
            {Math.min(startIndex + rowsPerPage, totalItems)}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg hover:bg-zinc-100  disabled:opacity-40 transition"
              aria-label="이전 페이지"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition ${
                  safePage === page
                    ? 'border border-zinc-200  bg-white  text-zinc-900  font-semibold shadow-2xs'
                    : 'text-klic-muted hover:bg-zinc-100 '
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg hover:bg-zinc-100  disabled:opacity-40 transition"
              aria-label="다음 페이지"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
