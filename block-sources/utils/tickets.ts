import {
  SupportTicketItem,
  SupportTicketPriority,
  SupportTicketQueue,
  SupportTicketStatus,
} from '../types';

export interface SupportTicketStats {
  visibleCount: number;
  unassignedCount: number;
  nearSlaCount: number;
}

export type TicketSortField =
  | 'ticket'
  | 'requester'
  | 'queue'
  | 'priority'
  | 'sla'
  | 'status';

const PRIORITY_WEIGHT: Record<SupportTicketPriority, number> = {
  긴급: 1,
  높음: 2,
  보통: 3,
  낮음: 4,
};

const STATUS_WEIGHT: Record<SupportTicketStatus, number> = {
  열림: 1,
  '대기 중': 2,
  해결됨: 3,
};

/**
 * 현재 필터링된 티켓 목록에 대한 상단 요약 지표(표시됨, 미배정, SLA 임박)를 계산합니다.
 */
export function calculateTicketStats(
  tickets: SupportTicketItem[]
): SupportTicketStats {
  let unassignedCount = 0;
  let nearSlaCount = 0;

  for (const t of tickets) {
    if (!t.assigneeName) {
      unassignedCount += 1;
    }
    if (t.slaState === 'breached' || t.slaState === 'near') {
      nearSlaCount += 1;
    }
  }

  return {
    visibleCount: tickets.length,
    unassignedCount,
    nearSlaCount,
  };
}

/**
 * 검색어, 큐 드롭다운, 다중 상태 필터, 정렬 조건에 따라 티켓 목록을 필터링하고 정렬합니다.
 */
export function filterAndSortTickets(
  tickets: SupportTicketItem[],
  searchQuery: string,
  queueFilter: string,
  statusFilters: SupportTicketStatus[],
  sortField: TicketSortField,
  sortAsc: boolean
): SupportTicketItem[] {
  const q = searchQuery.trim().toLowerCase();

  const filtered = tickets.filter((item) => {
    if (queueFilter !== '전체 큐' && item.queue !== queueFilter) {
      return false;
    }

    if (statusFilters.length > 0 && !statusFilters.includes(item.status)) {
      return false;
    }

    if (q.length > 0) {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCode = item.code.toLowerCase().includes(q);
      const matchRequester = item.requesterName.toLowerCase().includes(q);
      const matchOrg = item.requesterOrg.toLowerCase().includes(q);
      const matchQueue = item.queue.toLowerCase().includes(q);
      if (
        !matchTitle &&
        !matchCode &&
        !matchRequester &&
        !matchOrg &&
        !matchQueue
      ) {
        return false;
      }
    }

    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case 'ticket':
        cmp = a.code.localeCompare(b.code, 'ko');
        break;
      case 'requester':
        cmp = a.requesterName.localeCompare(b.requesterName, 'ko');
        break;
      case 'queue':
        cmp = a.queue.localeCompare(b.queue, 'ko');
        break;
      case 'priority':
        cmp = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
        break;
      case 'sla':
        cmp = a.slaSortOrder - b.slaSortOrder;
        break;
      case 'status':
        cmp = STATUS_WEIGHT[a.status] - STATUS_WEIGHT[b.status];
        break;
    }
    return sortAsc ? cmp : -cmp;
  });

  return sorted;
}

/**
 * 페이지네이션 슬라이스 및 메타데이터를 반환합니다.
 */
export function paginateTickets<T>(
  items: T[],
  currentPage: number,
  pageSize: number
): {
  paginatedItems: T[];
  totalPages: number;
  safePage: number;
  startIndex: number;
  endIndex: number;
} {
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(items.length / safePageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startOffset = (safePage - 1) * safePageSize;
  const paginatedItems = items.slice(startOffset, startOffset + safePageSize);

  const startIndex = items.length === 0 ? 0 : startOffset + 1;
  const endIndex =
    items.length === 0
      ? 0
      : Math.min(items.length, startOffset + paginatedItems.length);

  return {
    paginatedItems,
    totalPages,
    safePage,
    startIndex,
    endIndex,
  };
}

/**
 * 선택된 티켓 ID들의 상태를 일괄 업데이트합니다. 해결됨으로 변경 시 SLA도 종료 상태로 전환합니다.
 */
export function bulkUpdateTicketStatus(
  tickets: SupportTicketItem[],
  targetIds: string[],
  nextStatus: SupportTicketStatus
): SupportTicketItem[] {
  const idSet = new Set(targetIds);
  return tickets.map((item) => {
    if (!idSet.has(item.id)) return item;
    if (nextStatus === '해결됨') {
      return {
        ...item,
        status: '해결됨',
        slaState: 'closed',
        slaLabel: '종료됨',
        slaSubtext: '활성 SLA 없음',
      };
    }
    return {
      ...item,
      status: nextStatus,
    };
  });
}

/**
 * 선택된 티켓 ID들에 담당자를 일괄 배정합니다.
 */
export function bulkAssignTicketOwner(
  tickets: SupportTicketItem[],
  targetIds: string[],
  assigneeName: string | null
): SupportTicketItem[] {
  const idSet = new Set(targetIds);
  return tickets.map((item) =>
    idSet.has(item.id) ? { ...item, assigneeName } : item
  );
}

/**
 * 신규 고객 지원 티켓 객체를 생성합니다.
 */
export function createSupportTicketItem(payload: {
  title: string;
  requesterName: string;
  requesterOrg: string;
  queue: SupportTicketQueue;
  priority: SupportTicketPriority;
  assigneeName: string | null;
}): SupportTicketItem {
  const cleanName = payload.requesterName.trim() || '신규 고객';
  const initials = cleanName
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isUrgentOrHigh =
    payload.priority === '긴급' || payload.priority === '높음';

  return {
    id: `sup-${Date.now()}`,
    code: `SUP-${Math.floor(1850 + Math.random() * 140)}`,
    title: payload.title.trim(),
    openedAgo: '방금 접수',
    requesterName: cleanName,
    requesterOrg: payload.requesterOrg.trim() || 'Enterprise HQ',
    requesterInitials: initials || 'KR',
    queue: payload.queue,
    priority: payload.priority,
    slaSortOrder: isUrgentOrHigh ? 15 : 90,
    slaLabel: isUrgentOrHigh ? '15분 남음' : '1시간 30분 남음',
    slaSubtext: isUrgentOrHigh ? '응답 목표 임박' : '정상 범위 내',
    slaState: isUrgentOrHigh ? 'near' : 'safe',
    status: '열림',
    assigneeName: payload.assigneeName,
  };
}
