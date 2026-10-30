import {
  CatalogAssignee,
  CatalogItem,
  CatalogMode,
  CatalogStatus,
  CatalogUrgency,
} from '../types';

export type CatalogSortField =
  | 'default'
  | 'title'
  | 'category'
  | 'unitCount'
  | 'score'
  | 'assignedCount'
  | 'completionRate';

export type CatalogSortOrder = 'asc' | 'desc';

export type CatalogTabKey = 'all' | 'published' | 'draft' | 'archived';

export interface CatalogFilterOptions {
  statusTab: CatalogTabKey;
  category: string; // '전체 카테고리' or specific category
  searchQuery: string;
  sortField: CatalogSortField;
  sortOrder: CatalogSortOrder;
}

export interface CatalogStats {
  all: number;
  published: number;
  draft: number;
  archived: number;
}

export function calculateCatalogStats(items: CatalogItem[]): CatalogStats {
  let published = 0;
  let draft = 0;
  let archived = 0;

  for (const item of items) {
    if (item.status === 'published') published += 1;
    else if (item.status === 'draft') draft += 1;
    else if (item.status === 'archived') archived += 1;
  }

  return {
    all: items.length,
    published,
    draft,
    archived,
  };
}

export function getTotalAssignedCount(item: CatalogItem): number {
  return item.assignees.length + Math.max(0, item.extraAssignedCount);
}

export function filterAndSortCatalogItems(
  items: CatalogItem[],
  options: CatalogFilterOptions
): CatalogItem[] {
  const { statusTab, category, searchQuery, sortField, sortOrder } = options;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filtered = items.filter((item) => {
    if (statusTab !== 'all' && item.status !== statusTab) {
      return false;
    }

    if (category && category !== '전체 카테고리' && item.category !== category) {
      return false;
    }

    if (normalizedQuery) {
      const haystacks = [
        item.title,
        item.authorOrBrand,
        item.category,
        item.urgency,
        item.dateLabel,
      ];
      const matches = haystacks.some((text) =>
        text.toLowerCase().includes(normalizedQuery)
      );
      if (!matches) return false;
    }

    return true;
  });

  if (sortField === 'default') {
    return sortOrder === 'asc' ? filtered : [...filtered].reverse();
  }

  const sorted = [...filtered].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'title':
        comparison = a.title.localeCompare(b.title, 'ko');
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category, 'ko');
        break;
      case 'unitCount':
        comparison = a.unitCount - b.unitCount;
        break;
      case 'score':
        comparison = a.score - b.score;
        break;
      case 'assignedCount':
        comparison = getTotalAssignedCount(a) - getTotalAssignedCount(b);
        break;
      case 'completionRate': {
        const valA = a.completionRate ?? -1;
        const valB = b.completionRate ?? -1;
        comparison = valA - valB;
        break;
      }
      default:
        comparison = 0;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

export interface PaginatedCatalogResult {
  rows: CatalogItem[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  startIndex: number; // 1-indexed for display (0 if empty)
  endIndex: number;
}

export function paginateCatalogItems(
  items: CatalogItem[],
  page: number,
  pageSize: number
): PaginatedCatalogResult {
  const safePageSize = Math.max(1, pageSize);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  if (totalItems === 0) {
    return {
      rows: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      startIndex: 0,
      endIndex: 0,
    };
  }

  const offset = (currentPage - 1) * safePageSize;
  const rows = items.slice(offset, offset + safePageSize);

  return {
    rows,
    totalItems,
    totalPages,
    currentPage,
    startIndex: offset + 1,
    endIndex: offset + rows.length,
  };
}

export function assignMemberToCatalogItem(
  items: CatalogItem[],
  itemId: string,
  member: CatalogAssignee
): CatalogItem[] {
  return items.map((item) => {
    if (item.id !== itemId) return item;

    const alreadyAssigned = item.assignees.some((a) => a.name === member.name);
    if (alreadyAssigned) {
      return {
        ...item,
        extraAssignedCount: item.extraAssignedCount + 1,
      };
    }

    if (item.assignees.length < 3) {
      return {
        ...item,
        assignees: [...item.assignees, member],
      };
    }

    return {
      ...item,
      extraAssignedCount: item.extraAssignedCount + 1,
    };
  });
}

export function updateCatalogItemStatus(
  items: CatalogItem[],
  itemId: string,
  status: CatalogStatus
): CatalogItem[] {
  return items.map((item) =>
    item.id === itemId ? { ...item, status } : item
  );
}

export interface CreateCatalogItemInput {
  mode: CatalogMode;
  title: string;
  authorOrBrand: string;
  category: string;
  urgency: CatalogUrgency;
  unitCount: number;
  score?: number;
  status?: CatalogStatus;
  completionRate?: number | null;
  thumbnail?: string;
}

export function createCatalogItem(input: CreateCatalogItemInput): CatalogItem {
  const defaultThumb =
    input.mode === 'course'
      ? './placeholders/avatar-477372838839.svg'
      : './placeholders/avatar-a2182bb71a96.svg';

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return {
    id: `${input.mode}-${Date.now()}`,
    mode: input.mode,
    title: input.title.trim(),
    authorOrBrand: input.authorOrBrand.trim(),
    dateLabel: `${year}. ${month}. ${day}`,
    thumbnail: input.thumbnail || defaultThumb,
    category: input.category,
    urgency: input.urgency,
    unitCount: Math.max(1, input.unitCount),
    score: input.score ?? 4.8,
    assignees: [
      {
        id: 'asg-default',
        name: '이소연',
        avatar:
          './placeholders/avatar-27ccdef6fa6f.svg',
      },
    ],
    extraAssignedCount: 0,
    completionRate:
      input.completionRate !== undefined ? input.completionRate : 65,
    status: input.status ?? 'published',
  };
}
