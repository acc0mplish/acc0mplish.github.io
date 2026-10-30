import { PersonAvatar } from '../PersonAvatar';
import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  BookOpen,
  Layers,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  X,
  GraduationCap,
  Package,
} from 'lucide-react';
import {
  CatalogAssignee,
  CatalogItem,
  CatalogMode,
  CatalogStatus,
  CatalogUrgency,
} from '../../types';
import {
  calculateCatalogStats,
  filterAndSortCatalogItems,
  paginateCatalogItems,
  CatalogSortField,
  CatalogSortOrder,
  CatalogTabKey,
  CreateCatalogItemInput,
} from '../../utils/catalog';

interface CatalogBlockProps {
  mode: CatalogMode;
  items: CatalogItem[];
  onSwitchMode: (mode: CatalogMode) => void;
  onAssignMember: (itemId: string, member: CatalogAssignee) => void;
  onUpdateStatus: (itemId: string, status: CatalogStatus) => void;
  onAddCatalogItem: (input: CreateCatalogItemInput) => void;
  density: 'compact' | 'normal' | 'relaxed';
  onDensityChange?: (d: 'compact' | 'normal' | 'relaxed') => void;
  showAvatars: boolean;
  showProgressRings: boolean;
}

const ASSIGNEE_CANDIDATES: CatalogAssignee[] = [
  {
    id: 'cand-1',
    name: '김도훈',
    avatar:
      './placeholders/avatar-76c628dee7cb.svg',
  },
  {
    id: 'cand-2',
    name: '박지훈',
    avatar:
      './placeholders/avatar-51747f419874.svg',
  },
  {
    id: 'cand-3',
    name: '윤서연',
    avatar:
      './placeholders/avatar-27ccdef6fa6f.svg',
  },
  {
    id: 'cand-4',
    name: '최도윤',
    avatar:
      './placeholders/avatar-591f5c8ec067.svg',
  },
];

const COURSE_CATEGORIES = ['전체 카테고리', '개발', '기초', '디자인', 'UI/UX'];
const PRODUCT_CATEGORIES = [
  '전체 카테고리',
  '오디오',
  '하드웨어',
  '웨어러블',
  '액세서리',
  '스마트홈',
];

function getCategoryBadgeStyle(category: string): string {
  switch (category) {
    case '개발':
    case '하드웨어':
      return 'bg-blue-50 text-blue-600 border-blue-200/90   ';
    case '기초':
    case '웨어러블':
      return 'bg-amber-50 text-amber-700 border-amber-200/90   ';
    case '디자인':
    case '오디오':
      return 'bg-blue-50 text-blue-600 border-blue-200/90   ';
    case 'UI/UX':
    case '스마트홈':
    case '액세서리':
    default:
      return 'bg-blue-50 text-blue-700 border-blue-200/90   ';
  }
}

function getUrgencyBadgeStyle(urgency: CatalogUrgency): string {
  if (urgency === '긴급') {
    return 'bg-blue-50 text-blue-600 border-blue-200/90   ';
  }
  return 'bg-zinc-100/80 text-klic-muted border-zinc-200/90   ';
}

function CompletionProgressRing({ value }: { value: number }) {
  const radius = 7;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  let strokeColor = 'var(--klic-component-block-color-warning)'; // orange-500 (50% - 84%)
  if (clamped >= 85) {
    strokeColor = 'var(--klic-component-block-color-accent)'; // emerald-500 (85% - 100%)
  } else if (clamped < 45) {
    strokeColor = 'var(--klic-component-block-color-danger)'; // rose-500 (< 45%)
  }

  return (
    <svg className="w-4 h-4 -rotate-90 shrink-0" viewBox="0 0 20 20">
      <circle
        cx="10"
        cy="10"
        r={radius}
        fill="transparent"
        stroke="currentColor"
        strokeWidth="2.3"
        className="text-klic-on-emphasis "
      />
      <circle
        cx="10"
        cy="10"
        r={radius}
        fill="transparent"
        stroke={strokeColor}
        strokeWidth="2.3"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarScoreCell({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const diff = score - (starIndex - 1);
          if (diff >= 0.85) {
            return (
              <Star
                key={starIndex}
                size={13}
                className="fill-amber-400 text-amber-400"
              />
            );
          }
          if (diff >= 0.25) {
            return (
              <span key={starIndex} className="relative inline-flex w-[13px] h-[13px]">
                <Star
                  size={13}
                  className="text-klic-muted  fill-zinc-200 "
                />
                <span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                </span>
              </span>
            );
          }
          return (
            <Star
              key={starIndex}
              size={13}
              className="text-klic-muted  fill-zinc-200 "
            />
          );
        })}
      </div>
      <span className="text-xs font-medium text-zinc-700  tabular-nums">
        {score.toFixed(1)}
      </span>
    </div>
  );
}

export const CatalogBlock: React.FC<CatalogBlockProps> = ({
  mode,
  items,
  onSwitchMode,
  onAssignMember,
  onUpdateStatus,
  onAddCatalogItem,
  density,
  onDensityChange,
  showAvatars,
  showProgressRings,
}) => {
  const isCourse = mode === 'course';

  // 탭, 카테고리, 검색, 정렬, 페이지네이션 상태
  const [statusTab, setStatusTab] = useState<CatalogTabKey>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체 카테고리');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<CatalogSortField>('default');
  const [sortOrder, setSortOrder] = useState<CatalogSortOrder>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);

  // 컬럼 표시 제어 팝오버 상태
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [visibleColumns, setVisibleColumns] = useState({
    tags: true,
    unitCount: true,
    score: true,
    assigned: true,
    completion: true,
  });

  // 행별 배정 팝오버 & 액션 메뉴 상태
  const [assigningRowId, setAssigningRowId] = useState<string | null>(null);
  const [actionMenuRowId, setActionMenuRowId] = useState<string | null>(null);

  // 추가 모달 상태
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthorOrBrand, setNewAuthorOrBrand] = useState('');
  const [newCategory, setNewCategory] = useState(isCourse ? '개발' : '오디오');
  const [newUrgency, setNewUrgency] = useState<CatalogUrgency>('긴급');
  const [newUnitCount, setNewUnitCount] = useState<string>('8');
  const [newStatus, setNewStatus] = useState<CatalogStatus>('published');
  const [formError, setFormError] = useState<string>('');

  // 모드 전환 시 카테고리 필터 및 페이지 초기화
  const handleModeChange = (nextMode: CatalogMode) => {
    setSelectedCategory('전체 카테고리');
    setStatusTab('all');
    setSearchQuery('');
    setCurrentPage(1);
    setNewCategory(nextMode === 'course' ? '개발' : '오디오');
    onSwitchMode(nextMode);
  };

  const stats = useMemo(() => calculateCatalogStats(items), [items]);

  const filteredAndSorted = useMemo(
    () =>
      filterAndSortCatalogItems(items, {
        statusTab,
        category: selectedCategory,
        searchQuery,
        sortField,
        sortOrder,
      }),
    [items, statusTab, selectedCategory, searchQuery, sortField, sortOrder]
  );

  const paginated = useMemo(
    () => paginateCatalogItems(filteredAndSorted, currentPage, pageSize),
    [filteredAndSorted, currentPage, pageSize]
  );

  const handleSort = (field: CatalogSortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (field: CatalogSortField) => {
    const isTitleDefault = field === 'title' && sortField === 'default';
    if (sortField !== field && !isTitleDefault) {
      return <ArrowUpDown size={12} className="text-klic-muted shrink-0" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={12} className="text-zinc-800  shrink-0" />
    ) : (
      <ArrowDown size={12} className="text-zinc-800  shrink-0" />
    );
  };

  const rowPyClass =
    density === 'compact'
      ? 'py-2'
      : density === 'relaxed'
      ? 'py-4'
      : 'py-3';

  const categoriesList = isCourse ? COURSE_CATEGORIES : PRODUCT_CATEGORIES;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError(isCourse ? '강좌명을 입력해주세요.' : '제품명을 입력해주세요.');
      return;
    }
    if (!newAuthorOrBrand.trim()) {
      setFormError(
        isCourse ? '담당 강사명을 입력해주세요.' : '브랜드 및 SKU를 입력해주세요.'
      );
      return;
    }

    onAddCatalogItem({
      mode,
      title: newTitle.trim(),
      authorOrBrand: newAuthorOrBrand.trim(),
      category: newCategory,
      urgency: newUrgency,
      unitCount: Math.max(1, parseInt(newUnitCount, 10) || 8),
      status: newStatus,
      score: 4.8,
      completionRate: newStatus === 'draft' ? null : 75,
    });

    setNewTitle('');
    setNewAuthorOrBrand('');
    setFormError('');
    setIsAddModalOpen(false);
    setCurrentPage(1);
  };

  return (
    <div className="w-full">
      {/* 상단 카탈로그 모드 빠른 전환 바 (교육 카탈로그 ↔ 제품 카탈로그) */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
        <div className="inline-flex items-center p-1 rounded-xl bg-zinc-100  border border-zinc-200/80 ">
          <button
            type="button"
            onClick={() => handleModeChange('course')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isCourse
                ? 'bg-white  text-zinc-900  shadow-xs'
                : 'text-klic-muted hover:text-zinc-800 '
            }`}
          >
            <GraduationCap size={14} />
            교육 카탈로그
            <span className="ml-0.5 px-1.5 py-0.2 rounded bg-zinc-100  text-[10px] text-klic-muted ">
              강좌
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('product')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !isCourse
                ? 'bg-white  text-zinc-900  shadow-xs'
                : 'text-klic-muted hover:text-zinc-800 '
            }`}
          >
            <Package size={14} />
            제품 카탈로그
            <span className="ml-0.5 px-1.5 py-0.2 rounded bg-zinc-100  text-[10px] text-klic-muted ">
              제품
            </span>
          </button>
        </div>

        <span className="text-[11px] text-klic-muted ">
          {isCourse
            ? 'KLIC/data-grid-columns-2 • 교육 강좌 및 수료율 관리'
            : 'KLIC/data-grid-columns-3 • 제품 라인업 및 판매 목표율 관리'}
        </span>
      </div>

      {/* 메인 카탈로그 카드 컨테이너 */}
      <div className="w-full rounded-xl border border-zinc-200  bg-white  shadow-2xs overflow-hidden">
        {/* 1. 카드 상단 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-zinc-200 ">
          <div>
            <h2 className="text-[15px] font-semibold text-zinc-900  tracking-tight">
              {isCourse ? '교육 카탈로그' : '제품 카탈로그'}
            </h2>
            <p className="text-xs text-klic-muted  mt-0.5">
              {isCourse
                ? `${stats.published}개 발행됨 • ${stats.draft}개 초안`
                : `${stats.published}개 판매중 • ${stats.draft}개 준비중`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setNewCategory(isCourse ? '개발' : '오디오');
              setFormError('');
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis  text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            <Plus size={14} strokeWidth={2.5} />
            {isCourse ? '강좌 추가' : '제품 추가'}
          </button>
        </div>

        {/* 2. 상태 탭 바 (All 12 / Published 9 / Draft 2 / Archived 1) */}
        <div
          className="flex items-center gap-6 px-5 border-b border-zinc-200  overflow-x-auto"
          role="tablist"
          aria-label="카탈로그 상태 탭"
        >
          {(
            [
              {
                key: 'all' as CatalogTabKey,
                label: '전체',
                count: stats.all,
              },
              {
                key: 'published' as CatalogTabKey,
                label: isCourse ? '발행됨' : '판매중',
                count: stats.published,
              },
              {
                key: 'draft' as CatalogTabKey,
                label: isCourse ? '초안' : '준비중',
                count: stats.draft,
              },
              {
                key: 'archived' as CatalogTabKey,
                label: isCourse ? '보관됨' : '단종',
                count: stats.archived,
              },
            ] as const
          ).map((tab) => {
            const isActive = statusTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setStatusTab(tab.key);
                  setCurrentPage(1);
                }}
                className={`relative flex items-center gap-1.5 py-3 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-zinc-900  font-semibold'
                    : 'text-klic-muted hover:text-zinc-800  '
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-md text-[11px] font-semibold tabular-nums ${
                    isActive
                      ? 'bg-klic-inverse text-klic-on-emphasis  '
                      : 'bg-zinc-100 text-klic-muted  '
                  }`}
                >
                  {tab.count}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-[2px] bg-klic-inverse  rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* 3. 필터 및 설정 툴바 (카테고리 드롭다운 + 검색창 + 우측 설정 버튼) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-b border-zinc-200  bg-white ">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 카테고리 선택 드롭다운 */}
            <select
              aria-label="카테고리 필터"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="h-8 px-3 rounded-lg border border-zinc-200  bg-white  text-xs font-medium text-zinc-700  focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* 검색 입력창 */}
            <div className="relative w-full sm:w-64">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-klic-muted pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={isCourse ? '강좌 검색...' : '제품 검색...'}
                aria-label={isCourse ? '강좌 검색' : '제품 검색'}
                className="w-full h-8 pl-8 pr-7 rounded-lg border border-zinc-200  bg-white  text-xs text-zinc-800  placeholder:text-klic-muted focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  aria-label="검색어 지우기"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-klic-muted hover:text-klic-muted"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* 우측 설정(Settings) 버튼 및 팝오버 */}
          <div className="relative self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setIsSettingsOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200  bg-white  hover:bg-zinc-50  text-xs font-medium text-zinc-700  transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={13} className="text-klic-muted" />
              <span>설정</span>
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-xl border border-zinc-200  bg-white  shadow-lg p-3.5 z-30">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 ">
                  <span className="text-xs font-semibold text-zinc-900 ">
                    컬럼 및 테이블 설정
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(false)}
                    aria-label="설정 닫기"
                    className="text-klic-muted hover:text-klic-muted"
                  >
                    <X size={13} />
                  </button>
                </div>

                <div className="space-y-1.5 mb-3">
                  <p className="text-[11px] font-medium text-klic-muted mb-1">
                    표시 컬럼 선택
                  </p>
                  {(
                    [
                      { key: 'tags', label: '태그 (카테고리/긴급도)' },
                      {
                        key: 'unitCount',
                        label: isCourse ? '모듈 (과정 수)' : '스펙 (옵션 수)',
                      },
                      { key: 'score', label: '평점 (별점)' },
                      {
                        key: 'assigned',
                        label: isCourse ? '배정 인원' : '담당 매니저',
                      },
                      {
                        key: 'completion',
                        label: isCourse ? '수료율' : '목표 달성률',
                      },
                    ] as const
                  ).map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-zinc-50  cursor-pointer text-xs text-zinc-700 "
                    >
                      <span>{col.label}</span>
                      <input
                        type="checkbox"
                        checked={visibleColumns[col.key]}
                        onChange={() =>
                          setVisibleColumns((prev) => ({
                            ...prev,
                            [col.key]: !prev[col.key],
                          }))
                        }
                        className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                      />
                    </label>
                  ))}
                </div>

                {onDensityChange && (
                  <div className="pt-2 border-t border-zinc-100 ">
                    <p className="text-[11px] font-medium text-klic-muted mb-1.5">
                      행 밀도
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      {(
                        [
                          { id: 'compact', label: '콤팩트' },
                          { id: 'normal', label: '보통' },
                          { id: 'relaxed', label: '여유' },
                        ] as const
                      ).map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => onDensityChange(d.id)}
                          className={`py-1 rounded text-[11px] font-medium border ${
                            density === d.id
                              ? 'bg-klic-inverse text-klic-on-emphasis border-zinc-900  '
                              : 'border-zinc-200  text-klic-muted '
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 4. 데이터 그리드 테이블 */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-200  bg-zinc-50/60  text-[11px] font-medium text-klic-muted ">
                <th className="py-2.5 px-3.5 border-r border-zinc-200/70  min-w-[240px]">
                  <button
                    type="button"
                    onClick={() => handleSort('title')}
                    className="inline-flex items-center gap-1.5 hover:text-zinc-900  cursor-pointer font-medium"
                  >
                    <span>{isCourse ? '강좌' : '제품'}</span>
                    {renderSortIcon('title')}
                  </button>
                </th>

                {visibleColumns.tags && (
                  <th className="py-2.5 px-3 border-r border-zinc-200/70  min-w-[120px]">
                    <button
                      type="button"
                      onClick={() => handleSort('category')}
                      className="inline-flex items-center gap-1.5 hover:text-zinc-900  cursor-pointer font-medium"
                    >
                      <span>태그</span>
                      {renderSortIcon('category')}
                    </button>
                  </th>
                )}

                {visibleColumns.unitCount && (
                  <th className="py-2.5 px-3 border-r border-zinc-200/70  min-w-[70px]">
                    <button
                      type="button"
                      onClick={() => handleSort('unitCount')}
                      className="inline-flex items-center gap-1.5 hover:text-zinc-900  cursor-pointer font-medium"
                    >
                      <span>{isCourse ? '모듈' : '스펙'}</span>
                      {renderSortIcon('unitCount')}
                    </button>
                  </th>
                )}

                {visibleColumns.score && (
                  <th className="py-2.5 px-3 border-r border-zinc-200/70  min-w-[120px]">
                    <button
                      type="button"
                      onClick={() => handleSort('score')}
                      className="inline-flex items-center gap-1.5 hover:text-zinc-900  cursor-pointer font-medium"
                    >
                      <span>평점</span>
                      {renderSortIcon('score')}
                    </button>
                  </th>
                )}

                {visibleColumns.assigned && (
                  <th className="py-2.5 px-3 border-r border-zinc-200/70  min-w-[125px]">
                    <button
                      type="button"
                      onClick={() => handleSort('assignedCount')}
                      className="inline-flex items-center gap-1.5 hover:text-zinc-900  cursor-pointer font-medium"
                    >
                      <span>{isCourse ? '배정 인원' : '담당 매니저'}</span>
                      {renderSortIcon('assignedCount')}
                    </button>
                  </th>
                )}

                {visibleColumns.completion && (
                  <th className="py-2.5 px-3 border-r border-zinc-200/70  min-w-[96px]">
                    <button
                      type="button"
                      onClick={() => handleSort('completionRate')}
                      className="inline-flex items-center gap-1.5 hover:text-zinc-900  cursor-pointer font-medium"
                    >
                      <span>{isCourse ? '수료율' : '목표 달성률'}</span>
                      {renderSortIcon('completionRate')}
                    </button>
                  </th>
                )}

                <th className="py-2.5 px-2 w-10 text-center">
                  <span className="sr-only">액션</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200/80  text-xs">
              {paginated.rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-klic-muted "
                  >
                    조건에 일치하는 {isCourse ? '강좌가' : '제품이'} 없습니다.
                  </td>
                </tr>
              ) : (
                paginated.rows.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-50/70  transition-colors"
                  >
                    {/* 1. 강좌 / 제품 (썸네일 + 제목 + 강사/브랜드 및 개설일) */}
                    <td
                      className={`${rowPyClass} px-3.5 border-r border-zinc-200/70  max-w-[310px]`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-15 h-10 rounded-md object-cover shrink-0 border border-zinc-200/80  bg-zinc-100"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-zinc-900  truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-klic-muted  mt-0.5 truncate">
                            {isCourse ? (
                              <>
                                강사:{' '}
                                <span className="text-zinc-700  font-medium">
                                  {item.authorOrBrand}
                                </span>{' '}
                                • {item.dateLabel}
                              </>
                            ) : (
                              <>
                                <span className="text-zinc-700  font-medium">
                                  {item.authorOrBrand}
                                </span>{' '}
                                • {item.dateLabel}
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 2. 태그 (카테고리 배지 + 긴급도 배지) */}
                    {visibleColumns.tags && (
                      <td
                        className={`${rowPyClass} px-3 border-r border-zinc-200/70  whitespace-nowrap`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${getCategoryBadgeStyle(
                              item.category
                            )}`}
                          >
                            {item.category}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${getUrgencyBadgeStyle(
                              item.urgency
                            )}`}
                          >
                            {item.urgency}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* 3. 모듈 / 스펙 수 */}
                    {visibleColumns.unitCount && (
                      <td
                        className={`${rowPyClass} px-3 border-r border-zinc-200/70  whitespace-nowrap`}
                      >
                        <div className="inline-flex items-center gap-1.5 text-zinc-700  font-medium tabular-nums">
                          {isCourse ? (
                            <BookOpen
                              size={13}
                              className="text-klic-muted  shrink-0"
                            />
                          ) : (
                            <Layers
                              size={13}
                              className="text-klic-muted  shrink-0"
                            />
                          )}
                          <span>{item.unitCount}</span>
                        </div>
                      </td>
                    )}

                    {/* 4. 별점 평점 (Score) */}
                    {visibleColumns.score && (
                      <td
                        className={`${rowPyClass} px-3 border-r border-zinc-200/70  whitespace-nowrap`}
                      >
                        <StarScoreCell score={item.score} />
                      </td>
                    )}

                    {/* 5. 배정 인원 / 담당 매니저 아바타 그룹 + '+' 버튼 */}
                    {visibleColumns.assigned && (
                      <td
                        className={`${rowPyClass} px-3 border-r border-zinc-200/70  whitespace-nowrap relative`}
                      >
                        <div className="flex items-center gap-1.5">
                          {showAvatars ? (
                            <div className="flex items-center -space-x-2">
                              {item.assignees.map((person) => (
                                <PersonAvatar
                                  key={person.id}
                                  src={person.avatar}
                                  alt={person.name}
                                  title={person.name}
                                  className="w-6 h-6 rounded-full object-cover ring-2 ring-white "
                                />
                              ))}
                              {item.extraAssignedCount > 0 && (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100  text-[10px] font-semibold text-zinc-700  ring-2 ring-white  tabular-nums">
                                  +{item.extraAssignedCount}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-klic-muted ">
                              {item.assignees.length + item.extraAssignedCount}명 배정
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              setAssigningRowId((prev) =>
                                prev === item.id ? null : item.id
                              )
                            }
                            aria-label={`${item.title} 인원 추가 배정`}
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-dashed border-zinc-300  text-klic-muted hover:text-zinc-900  hover:border-zinc-400 transition-colors cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* 인원 배정 미니 팝오버 */}
                        {assigningRowId === item.id && (
                          <div className="absolute left-3 mt-1.5 w-48 rounded-xl border border-zinc-200  bg-white  shadow-lg p-2 z-30">
                            <div className="flex items-center justify-between px-1.5 pb-1.5 mb-1 border-b border-zinc-100 ">
                              <span className="text-[11px] font-semibold text-zinc-700 ">
                                {isCourse ? '수강생 추가 배정' : '담당 매니저 추가'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setAssigningRowId(null)}
                                aria-label="배정 팝오버 닫기"
                                className="text-klic-muted hover:text-klic-muted"
                              >
                                <X size={12} />
                              </button>
                            </div>
                            <div className="space-y-0.5">
                              {ASSIGNEE_CANDIDATES.map((cand) => (
                                <button
                                  key={cand.id}
                                  type="button"
                                  onClick={() => {
                                    onAssignMember(item.id, cand);
                                    setAssigningRowId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-100  text-left text-xs text-zinc-700  cursor-pointer"
                                >
                                  <PersonAvatar
                                    src={cand.avatar}
                                    alt={cand.name}
                                    className="w-5 h-5 rounded-full object-cover"
                                  />
                                  <span className="truncate">{cand.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                    )}

                    {/* 6. 수료율 / 목표 달성률 원형 링 */}
                    {visibleColumns.completion && (
                      <td
                        className={`${rowPyClass} px-3 border-r border-zinc-200/70  whitespace-nowrap`}
                      >
                        {item.completionRate === null ? (
                          <span className="text-xs text-klic-muted ">
                            -
                          </span>
                        ) : (
                          <div className="inline-flex items-center gap-2">
                            {showProgressRings && (
                              <CompletionProgressRing value={item.completionRate} />
                            )}
                            <span className="text-xs font-medium text-zinc-800  tabular-nums">
                              {item.completionRate}%
                            </span>
                          </div>
                        )}
                      </td>
                    )}

                    {/* 7. 행 우측 더보기 액션 메뉴 (...) */}
                    <td className={`${rowPyClass} px-1.5 text-center relative`}>
                      <button
                        type="button"
                        onClick={() =>
                          setActionMenuRowId((prev) =>
                            prev === item.id ? null : item.id
                          )
                        }
                        aria-label={`${item.title} 작업 메뉴`}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-klic-muted hover:text-zinc-700  hover:bg-zinc-100  transition-colors cursor-pointer"
                      >
                        <MoreHorizontal size={15} />
                      </button>

                      {actionMenuRowId === item.id && (
                        <div className="absolute right-3 mt-1 w-44 rounded-xl border border-zinc-200  bg-white  shadow-lg p-1.5 z-30 text-left">
                          <p className="px-2 py-1 text-[10px] font-semibold text-klic-muted uppercase">
                            상태 변경
                          </p>
                          {(
                            [
                              {
                                status: 'published' as CatalogStatus,
                                label: isCourse ? '발행됨으로 전환' : '판매중으로 전환',
                              },
                              {
                                status: 'draft' as CatalogStatus,
                                label: isCourse ? '초안으로 전환' : '준비중으로 전환',
                              },
                              {
                                status: 'archived' as CatalogStatus,
                                label: isCourse ? '보관됨으로 이동' : '단종 처리',
                              },
                            ] as const
                          ).map((opt) => (
                            <button
                              key={opt.status}
                              type="button"
                              onClick={() => {
                                onUpdateStatus(item.id, opt.status);
                                setActionMenuRowId(null);
                              }}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-zinc-100  text-xs text-zinc-700  cursor-pointer"
                            >
                              <span>{opt.label}</span>
                              {item.status === opt.status && (
                                <Check size={12} className="text-blue-600" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 5. 하단 페이지네이션 푸터 (Rows per page 8 | 1 - 8 of 12 < 1 2 >) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-zinc-200  bg-white  text-xs text-klic-muted ">
          <div className="flex items-center gap-2">
            <span>페이지당 행 수</span>
            <select
              aria-label="페이지당 행 수"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-7 px-2 rounded-lg border border-zinc-200  bg-white  text-xs font-medium text-zinc-700  focus:outline-none"
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="tabular-nums">
              전체 {paginated.totalItems}개 중 {paginated.startIndex} -{' '}
              {paginated.endIndex}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={paginated.currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-label="이전 페이지"
                className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-zinc-200  text-klic-muted  disabled:opacity-40 hover:bg-zinc-50  cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: paginated.totalPages }, (_, idx) => idx + 1).map(
                (pageNum) => {
                  const isCurrent = pageNum === paginated.currentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      aria-label={`${pageNum}페이지`}
                      aria-current={isCurrent ? 'page' : undefined}
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-semibold tabular-nums transition-colors cursor-pointer ${
                        isCurrent
                          ? 'border border-zinc-300  bg-zinc-100  text-zinc-900 '
                          : 'text-klic-muted hover:bg-zinc-50 '
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}

              <button
                type="button"
                disabled={paginated.currentPage >= paginated.totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(paginated.totalPages, p + 1))
                }
                aria-label="다음 페이지"
                className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-zinc-200  text-klic-muted  disabled:opacity-40 hover:bg-zinc-50  cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. 새 강좌 / 제품 추가 모달 */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-catalog-modal-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-zinc-200  bg-white  shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 ">
              <h3
                id="add-catalog-modal-title"
                className="text-sm font-semibold text-zinc-900 "
              >
                {isCourse ? '새 교육 강좌 추가' : '새 제품 카탈로그 등록'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                aria-label="모달 닫기"
                className="text-klic-muted hover:text-klic-muted"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-xs font-medium">
                  {formError}
                </div>
              )}

              <div>
                <label
                  htmlFor="catalog-title-input"
                  className="block font-medium text-zinc-700  mb-1"
                >
                  {isCourse ? '강좌명' : '제품명'}
                </label>
                <input
                  id="catalog-title-input"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={
                    isCourse
                      ? '예: 클라우드 네이티브 보안 아키텍처'
                      : '예: KLIC 무선 게이밍 마우스 Pro'
                  }
                  className="w-full h-9 px-3 rounded-lg border border-zinc-200  bg-white  text-zinc-900 "
                />
              </div>

              <div>
                <label
                  htmlFor="catalog-author-input"
                  className="block font-medium text-zinc-700  mb-1"
                >
                  {isCourse ? '담당 강사명' : '브랜드 및 SKU'}
                </label>
                <input
                  id="catalog-author-input"
                  type="text"
                  value={newAuthorOrBrand}
                  onChange={(e) => setNewAuthorOrBrand(e.target.value)}
                  placeholder={
                    isCourse ? '예: 이소연' : '예: 한성음향 • SKU-9910'
                  }
                  className="w-full h-9 px-3 rounded-lg border border-zinc-200  bg-white  text-zinc-900 "
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="catalog-category-select"
                    className="block font-medium text-zinc-700  mb-1"
                  >
                    카테고리
                  </label>
                  <select
                    id="catalog-category-select"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-zinc-200  bg-white  text-zinc-900 "
                  >
                    {categoriesList
                      .filter((c) => c !== '전체 카테고리')
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="catalog-urgency-select"
                    className="block font-medium text-zinc-700  mb-1"
                  >
                    우선순위 태그
                  </label>
                  <select
                    id="catalog-urgency-select"
                    value={newUrgency}
                    onChange={(e) => setNewUrgency(e.target.value as CatalogUrgency)}
                    className="w-full h-9 px-2.5 rounded-lg border border-zinc-200  bg-white  text-zinc-900 "
                  >
                    <option value="긴급">긴급</option>
                    <option value="일반">일반</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="catalog-unit-input"
                    className="block font-medium text-zinc-700  mb-1"
                  >
                    {isCourse ? '모듈(과정) 수' : '스펙(옵션) 수'}
                  </label>
                  <input
                    id="catalog-unit-input"
                    type="number"
                    min={1}
                    max={99}
                    value={newUnitCount}
                    onChange={(e) => setNewUnitCount(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-zinc-200  bg-white  text-zinc-900 "
                  />
                </div>

                <div>
                  <label
                    htmlFor="catalog-status-select"
                    className="block font-medium text-zinc-700  mb-1"
                  >
                    초기 상태
                  </label>
                  <select
                    id="catalog-status-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as CatalogStatus)}
                    className="w-full h-9 px-2.5 rounded-lg border border-zinc-200  bg-white  text-zinc-900 "
                  >
                    <option value="published">
                      {isCourse ? '발행됨' : '판매중'}
                    </option>
                    <option value="draft">{isCourse ? '초안' : '준비중'}</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 ">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-zinc-200  text-klic-muted  font-medium hover:bg-zinc-50 "
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-klic-inverse  text-klic-on-emphasis  font-semibold hover:bg-klic-inverse"
                >
                  {isCourse ? '강좌 등록' : '제품 등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
