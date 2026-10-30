import { PersonAvatar } from '../PersonAvatar';
import React, { useState, useMemo } from 'react';
import {
  Pin,
  PinOff,
  Download,
  Search,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Check,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AccessMember, PermissionLevel, PermissionScopeKey } from '../../types';
import {
  calculateAccessStats,
  filterAndSortMembers,
  togglePermissionValue,
} from '../../utils/permissions';

interface AccessPermissionsBlockProps {
  members: AccessMember[];
  onUpdateMember: (updated: AccessMember) => void;
  onUnpinAll: () => void;
  density?: 'compact' | 'normal' | 'relaxed';
  showAvatars?: boolean;
}

const PERMISSION_COLUMNS: { key: PermissionScopeKey; label: string }[] = [
  { key: 'settings', label: '환경 설정' },
  { key: 'billing', label: '결제/청구' },
  { key: 'integrations', label: '외부 연동' },
  { key: 'users', label: '사용자 관리' },
  { key: 'permissions', label: '권한 제어' },
];

export function AccessPermissionsBlock({
  members,
  onUpdateMember,
  onUnpinAll,
  density = 'normal',
  showAvatars = true,
}: AccessPermissionsBlockProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'tags' | 'permissions'>('permissions');
  const [roleFilter, setRoleFilter] = useState<string>('전체 역할');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<'default' | 'name' | PermissionScopeKey>('default');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [exportedFeedback, setExportedFeedback] = useState<boolean>(false);
  const [openMenuMemberId, setOpenMenuMemberId] = useState<string | null>(null);

  const stats = useMemo(() => calculateAccessStats(members), [members]);

  const rolesList = useMemo(() => {
    const unique = Array.from(new Set(members.map((m) => m.role)));
    return ['전체 역할', ...unique];
  }, [members]);

  const filteredAndSorted = useMemo(
    () => filterAndSortMembers(members, searchQuery, roleFilter, sortField, sortDir),
    [members, searchQuery, roleFilter, sortField, sortDir]
  );

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const paginatedMembers = filteredAndSorted.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (field: 'name' | PermissionScopeKey) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleTogglePin = (member: AccessMember) => {
    onUpdateMember({
      ...member,
      isPinned: !member.isPinned,
    });
  };

  const handleToggleScope = (member: AccessMember, scopeKey: PermissionScopeKey) => {
    const nextVal = togglePermissionValue(member.scopes[scopeKey]);
    onUpdateMember({
      ...member,
      scopes: {
        ...member.scopes,
        [scopeKey]: nextVal,
      },
    });
  };

  const handleSetAllScopes = (member: AccessMember, level: PermissionLevel) => {
    onUpdateMember({
      ...member,
      scopes: {
        settings: level,
        billing: level,
        integrations: level,
        users: level,
        permissions: level,
      },
    });
    setOpenMenuMemberId(null);
  };

  const handleExportReview = () => {
    setExportedFeedback(true);
    setTimeout(() => setExportedFeedback(false), 2000);
  };

  const getRowPaddingClass = () => {
    switch (density) {
      case 'compact':
        return 'py-2';
      case 'relaxed':
        return 'py-4';
      case 'normal':
      default:
        return 'py-3';
    }
  };

  const renderSwitch = (
    level: PermissionLevel,
    onClick: () => void,
    ariaLabel: string
  ) => {
    const isOn = level === 'full' || level === 'partial';
    const bgClass =
      level === 'full'
        ? 'bg-blue-500'
        : level === 'partial'
        ? 'bg-amber-400'
        : 'bg-zinc-200 ';

    return (
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-label={ariaLabel}
        onClick={onClick}
        title={
          level === 'full'
            ? '전체 허용 (클릭하여 해제)'
            : level === 'partial'
            ? '조건부 허용 (클릭하여 해제)'
            : '권한 없음 (클릭하여 허용)'
        }
        className={`inline-flex w-8 h-[18px] items-center rounded-full p-0.5 transition-colors duration-150 cursor-pointer ${bgClass} ${
          isOn ? 'justify-end' : 'justify-start'
        }`}
      >
        <span className="w-3.5 h-3.5 rounded-full bg-white shadow-2xs transition-transform" />
      </button>
    );
  };

  return (
    <div className="w-full bg-zinc-50/70  p-3 sm:p-5 text-zinc-900  font-sans">
      {/* 상단 헤더 영역 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 ">
            워크스페이스 접근 권한 검토
          </h2>
          <p className="text-xs text-klic-muted  mt-0.5">
            총 {stats.total}명 멤버 • {stats.onlineCount}명 온라인 • {stats.reviewAccessCount}명 검토 권한 보유
          </p>
        </div>

        <button
          onClick={handleExportReview}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200  bg-white  text-xs font-medium text-zinc-800  hover:bg-zinc-50  shadow-2xs transition self-start sm:self-auto"
        >
          {exportedFeedback ? (
            <>
              <Check size={13} className="text-blue-500" />
              <span>검토 리포트 다운로드됨</span>
            </>
          ) : (
            <>
              <Download size={13} className="text-klic-muted" />
              <span>검토 내역 내보내기</span>
            </>
          )}
        </button>
      </div>

      {/* 컬럼 스왑 탭 바 (기본 정보 5 / 태그 및 그룹 6 / 세부 권한 5) */}
      <div className="flex items-center gap-6 border-b border-zinc-200  text-xs">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-1.5 pb-2.5 -mb-px border-b-2 transition ${
            activeTab === 'general'
              ? 'border-zinc-900  font-semibold text-zinc-900 '
              : 'border-transparent text-klic-muted hover:text-zinc-800 '
          }`}
        >
          <span>기본 정보</span>
          <span className="px-1.5 py-0.2 rounded-full bg-zinc-200/80  text-[11px] text-klic-muted  font-mono">
            5
          </span>
        </button>

        <button
          onClick={() => setActiveTab('tags')}
          className={`flex items-center gap-1.5 pb-2.5 -mb-px border-b-2 transition ${
            activeTab === 'tags'
              ? 'border-zinc-900  font-semibold text-zinc-900 '
              : 'border-transparent text-klic-muted hover:text-zinc-800 '
          }`}
        >
          <span>태그 및 그룹</span>
          <span className="px-1.5 py-0.2 rounded-full bg-zinc-200/80  text-[11px] text-klic-muted  font-mono">
            6
          </span>
        </button>

        <button
          onClick={() => setActiveTab('permissions')}
          className={`flex items-center gap-1.5 pb-2.5 -mb-px border-b-2 transition ${
            activeTab === 'permissions'
              ? 'border-zinc-900  font-semibold text-zinc-900 '
              : 'border-transparent text-klic-muted hover:text-zinc-800 '
          }`}
        >
          <span>세부 권한</span>
          <span className="px-1.5 py-0.2 rounded-full bg-zinc-200/80  text-[11px] text-klic-muted  font-mono">
            5
          </span>
        </button>
      </div>

      {/* 메인 화이트 테이블 카드 */}
      <div className="mt-3 rounded-xl border border-zinc-200  bg-white  shadow-2xs overflow-hidden">
        {/* 필터 & 상단 고정 해제 툴바 */}
        <div className="p-3 sm:px-4 border-b border-zinc-200  flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap flex-1">
            {/* 역할 필터 드롭다운 */}
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="역할 필터 선택"
              className="px-3 py-1.5 bg-white  border border-zinc-200  rounded-lg text-xs font-medium text-zinc-800  focus:outline-none focus:ring-1 focus:ring-zinc-400 min-w-[140px]"
            >
              {rolesList.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {/* 멤버 검색창 */}
            <div className="relative flex-1 max-w-xs">
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
                placeholder="멤버 검색..."
                className="w-full pl-8 pr-3 py-1.5 bg-white  border border-zinc-200  rounded-lg text-xs placeholder:text-klic-muted focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
          </div>

          {/* 우측 상단 고정 일괄 해제 + 고정된 행 수 카운터 */}
          <div className="inline-flex items-center rounded-lg border border-zinc-200  overflow-hidden text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={onUnpinAll}
              disabled={stats.pinnedCount === 0}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white  text-zinc-700  font-medium hover:bg-zinc-50  disabled:opacity-50 transition"
            >
              <PinOff size={13} className="text-klic-muted" />
              <span>고정 모두 해제</span>
            </button>
            <span className="px-2.5 py-1.5 bg-zinc-100/80  border-l border-zinc-200  text-klic-muted  font-medium">
              {stats.pinnedCount}개 행 고정됨
            </span>
          </div>
        </div>

        {/* 데이터 그리드 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200  bg-zinc-50/40  text-klic-muted ">
                {/* 핀 컬럼 헤더 */}
                <th className="w-10 py-2.5 px-2 border-r border-zinc-100 " />

                {/* 멤버 컬럼 헤더 */}
                <th className="py-2.5 px-4 font-medium min-w-[230px]">
                  <button
                    type="button"
                    onClick={() => handleSort('name')}
                    className="inline-flex items-center gap-1 text-klic-muted  hover:text-zinc-900  font-medium"
                  >
                    <span>멤버</span>
                    {sortField === 'name' ? (
                      sortDir === 'asc' ? (
                        <ArrowUp size={12} className="text-klic-muted" />
                      ) : (
                        <ArrowDown size={12} className="text-klic-muted" />
                      )
                    ) : (
                      <ArrowUp size={12} className="text-klic-muted" />
                    )}
                  </button>
                </th>

                {/* 탭별 동적 컬럼 헤더 */}
                {activeTab === 'permissions' &&
                  PERMISSION_COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      className="py-2.5 px-3 text-center font-medium border-l border-zinc-100  min-w-[110px]"
                    >
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className="inline-flex items-center justify-center gap-1 text-klic-muted  hover:text-zinc-900  font-medium"
                      >
                        <span>{col.label}</span>
                        <ChevronsUpDown size={11} className="text-klic-muted" />
                      </button>
                    </th>
                  ))}

                {activeTab === 'general' && (
                  <>
                    <th className="py-2.5 px-3 text-center font-medium border-l border-zinc-100  whitespace-nowrap">소속 부서</th>
                    <th className="py-2.5 px-3 text-center font-medium border-l border-zinc-100  whitespace-nowrap">직책/역할</th>
                    <th className="py-2.5 px-3 text-center font-medium border-l border-zinc-100  whitespace-nowrap">현재 상태</th>
                    <th className="py-2.5 px-3 text-center font-medium border-l border-zinc-100  whitespace-nowrap">2단계 인증(2FA)</th>
                    <th className="py-2.5 px-3 text-center font-medium border-l border-zinc-100  whitespace-nowrap">만료 정책</th>
                  </>
                )}

                {activeTab === 'tags' && (
                  <>
                    <th className="py-2.5 px-3 text-center font-medium border-l border-zinc-100  whitespace-nowrap">소속 스쿼드</th>
                    <th className="py-2.5 px-3 text-center font-medium border-l border-zinc-100  whitespace-nowrap">보안 등급</th>
                    <th className="py-2.5 px-3 text-center font-medium border-l border-zinc-100  whitespace-nowrap">환경 범위</th>
                    <th className="py-2.5 px-3 text-center font-medium border-l border-zinc-100  whitespace-nowrap">데이터 범위</th>
                    <th className="py-2.5 px-3 text-center font-medium border-l border-zinc-100  whitespace-nowrap">감사 그룹</th>
                    <th className="py-2.5 px-3 text-center font-medium border-l border-zinc-100  whitespace-nowrap">갱신 주기</th>
                  </>
                )}

                {/* 우측 액션 헤더 */}
                <th className="w-10 py-2.5 px-2 border-l border-zinc-100 " />
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100 ">
              {paginatedMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-klic-muted">
                    검색 조건에 일치하는 멤버가 없습니다.
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((member) => {
                  const isMenuOpen = openMenuMemberId === member.id;

                  return (
                    <tr
                      key={member.id}
                      className={`transition ${
                        member.isPinned
                          ? 'bg-zinc-50/70  hover:bg-zinc-100/60 '
                          : 'bg-white  hover:bg-zinc-50/60 '
                      }`}
                    >
                      {/* 핀 고정 버튼 셀 */}
                      <td className={`text-center px-2 border-r border-zinc-100  ${getRowPaddingClass()}`}>
                        <button
                          type="button"
                          onClick={() => handleTogglePin(member)}
                          title={member.isPinned ? '상단 고정 해제' : '행 상단에 고정'}
                          aria-label={`${member.name} ${member.isPinned ? '고정 해제' : '상단 고정'}`}
                          className="p-1 rounded hover:bg-zinc-200/60  transition inline-flex items-center justify-center"
                        >
                          <Pin
                            size={13}
                            className={
                              member.isPinned
                                ? 'rotate-45 fill-zinc-900 text-zinc-900  '
                                : 'text-klic-muted hover:text-klic-muted '
                            }
                          />
                        </button>
                      </td>

                      {/* 멤버 프로필 셀 */}
                      <td className={`px-4 ${getRowPaddingClass()}`}>
                        <div className="flex items-center gap-3">
                          {showAvatars && (
                            <div className="relative shrink-0">
                              <PersonAvatar
                                src={member.avatar}
                                alt={member.name}
                                className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-200 "
                              />
                              <span
                                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white  ${
                                  member.isOnline ? 'bg-blue-500' : 'bg-zinc-300 '
                                }`}
                              />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="font-semibold text-zinc-900  text-[13px] truncate">
                              {member.name}
                            </p>
                            <p className="text-[11px] text-klic-muted  truncate mt-0.5">
                              {member.role} • {member.lastActiveText}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 탭 1: 세부 권한 스위치 셀 (5개 컬럼) */}
                      {activeTab === 'permissions' &&
                        PERMISSION_COLUMNS.map((col) => (
                          <td
                            key={col.key}
                            className={`px-3 text-center border-l border-zinc-100  ${getRowPaddingClass()}`}
                          >
                            {renderSwitch(
                              member.scopes[col.key],
                              () => handleToggleScope(member, col.key),
                              `${member.name} ${col.label} 권한 토글`
                            )}
                          </td>
                        ))}

                      {/* 탭 2: 기본 정보 셀 (5개 컬럼) */}
                      {activeTab === 'general' && (
                        <>
                          <td className={`px-3 text-center border-l border-zinc-100  text-zinc-700  whitespace-nowrap ${getRowPaddingClass()}`}>
                            {member.department}
                          </td>
                          <td className={`px-3 text-center border-l border-zinc-100  text-klic-muted  whitespace-nowrap ${getRowPaddingClass()}`}>
                            {member.role}
                          </td>
                          <td className={`px-3 text-center border-l border-zinc-100  whitespace-nowrap ${getRowPaddingClass()}`}>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${
                                member.isOnline
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200/70  '
                                  : 'bg-zinc-100 text-klic-muted  '
                              }`}
                            >
                              {member.lastActiveText}
                            </span>
                          </td>
                          <td className={`px-3 text-center border-l border-zinc-100  whitespace-nowrap ${getRowPaddingClass()}`}>
                            {renderSwitch(
                              member.twoFactorEnabled ? 'full' : 'none',
                              () =>
                                onUpdateMember({
                                  ...member,
                                  twoFactorEnabled: !member.twoFactorEnabled,
                                }),
                              `${member.name} 2단계 인증 토글`
                            )}
                          </td>
                          <td className={`px-3 text-center border-l border-zinc-100  text-klic-muted whitespace-nowrap ${getRowPaddingClass()}`}>
                            {member.expiryPolicy}
                          </td>
                        </>
                      )}

                      {/* 탭 3: 태그 및 그룹 셀 (6개 컬럼) */}
                      {activeTab === 'tags' && (
                        <>
                          <td className={`px-3 text-center border-l border-zinc-100  whitespace-nowrap ${getRowPaddingClass()}`}>
                            <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50  text-blue-700  border border-blue-200/60  text-[11px] font-medium whitespace-nowrap">
                              {member.squadTag}
                            </span>
                          </td>
                          <td className={`px-3 text-center border-l border-zinc-100  whitespace-nowrap ${getRowPaddingClass()}`}>
                            <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50  text-blue-700  border border-blue-200/60  text-[11px] font-medium whitespace-nowrap">
                              {member.securityClearance}
                            </span>
                          </td>
                          <td className={`px-3 text-center border-l border-zinc-100  text-klic-muted  whitespace-nowrap ${getRowPaddingClass()}`}>
                            {member.environmentTag}
                          </td>
                          <td className={`px-3 text-center border-l border-zinc-100  text-klic-muted  whitespace-nowrap ${getRowPaddingClass()}`}>
                            {member.dataScopeTag}
                          </td>
                          <td className={`px-3 text-center border-l border-zinc-100  text-klic-muted  whitespace-nowrap ${getRowPaddingClass()}`}>
                            {member.auditGroupTag}
                          </td>
                          <td className={`px-3 text-center border-l border-zinc-100  text-klic-muted whitespace-nowrap ${getRowPaddingClass()}`}>
                            {member.expiryPolicy}
                          </td>
                        </>
                      )}

                      {/* 우측 행 더보기 메뉴 */}
                      <td className={`text-center px-2 border-l border-zinc-100  relative ${getRowPaddingClass()}`}>
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuMemberId(isMenuOpen ? null : member.id)
                          }
                          aria-label={`${member.name} 권한 메뉴`}
                          className="p-1 rounded hover:bg-zinc-200/60  text-klic-muted hover:text-zinc-700  transition"
                        >
                          <MoreVertical size={14} />
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-6 top-full mt-1 z-40 w-44 rounded-xl bg-white  border border-zinc-200  shadow-xl p-1 text-left text-xs">
                            <button
                              type="button"
                              onClick={() => handleSetAllScopes(member, 'full')}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-100  text-zinc-700 "
                            >
                              <ShieldCheck size={13} className="text-blue-500" />
                              <span>모든 권한 허용</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSetAllScopes(member, 'partial')}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-100  text-zinc-700 "
                            >
                              <Sparkles size={13} className="text-amber-500" />
                              <span>조건부 검토 권한 설정</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSetAllScopes(member, 'none')}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-blue-50  text-blue-600 "
                            >
                              <span>모든 권한 회수</span>
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
        <div className="px-4 py-2.5 border-t border-zinc-200  bg-zinc-50/40  flex flex-wrap items-center justify-between gap-3 text-xs text-klic-muted ">
          <div className="flex items-center gap-2">
            <span>페이지당 행 수</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              aria-label="페이지당 행 수"
              className="px-2 py-1 rounded-md border border-zinc-200  bg-white  text-zinc-800  font-medium"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span>
              전체 {filteredAndSorted.length}개 중{' '}
              {filteredAndSorted.length === 0 ? 0 : startIndex + 1} -{' '}
              {Math.min(startIndex + rowsPerPage, filteredAndSorted.length)}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                aria-label="이전 페이지"
                className="p-1 rounded-md hover:bg-zinc-200/60  disabled:opacity-40 transition"
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-6 h-6 rounded-md text-xs font-medium transition ${
                    safePage === pageNum
                      ? 'bg-white  border border-zinc-200  text-zinc-900  shadow-2xs font-semibold'
                      : 'text-klic-muted hover:text-zinc-900 '
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                aria-label="다음 페이지"
                className="p-1 rounded-md hover:bg-zinc-200/60  disabled:opacity-40 transition"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
