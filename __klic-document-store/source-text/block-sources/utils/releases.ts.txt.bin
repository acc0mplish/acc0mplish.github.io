import { ReleaseApprovalItem, ReleaseRiskLevel } from '../types';

const RISK_WEIGHT: Record<ReleaseRiskLevel, number> = {
  '심각': 4,
  '높음': 3,
  '보통': 2,
  '낮음': 1,
};

export function filterAndSortReleases(
  items: ReleaseApprovalItem[],
  options: {
    searchQuery: string;
    serviceFilter: string;
    statusFilter: string;
    sortField: 'default' | 'risk' | 'readiness';
    sortDirection: 'asc' | 'desc';
  }
): ReleaseApprovalItem[] {
  const {
    searchQuery,
    serviceFilter,
    statusFilter,
    sortField,
    sortDirection,
  } = options;

  const q = searchQuery.trim().toLowerCase();

  const filtered = items.filter((item) => {
    if (serviceFilter !== '전체 서비스' && item.service !== serviceFilter) {
      return false;
    }
    if (statusFilter !== '전체 상태' && item.status !== statusFilter) {
      return false;
    }
    if (q) {
      const matchesTitle = item.title.toLowerCase().includes(q);
      const matchesCode = item.code.toLowerCase().includes(q);
      const matchesOwner = item.ownerName.toLowerCase().includes(q);
      const matchesService = item.service.toLowerCase().includes(q);
      if (!matchesTitle && !matchesCode && !matchesOwner && !matchesService) {
        return false;
      }
    }
    return true;
  });

  if (sortField === 'default') {
    return filtered;
  }

  return [...filtered].sort((a, b) => {
    const dir = sortDirection === 'asc' ? 1 : -1;
    if (sortField === 'risk') {
      return (RISK_WEIGHT[a.risk] - RISK_WEIGHT[b.risk]) * dir;
    }
    if (sortField === 'readiness') {
      return (a.readiness - b.readiness) * dir;
    }
    return 0;
  });
}

export function approveReleaseItem(
  items: ReleaseApprovalItem[],
  releaseId: string
): ReleaseApprovalItem[] {
  return items.map((item) => {
    if (item.id !== releaseId) return item;
    const nextApproved = Math.min(item.totalApprovers, item.approvedCount + 1);
    const isNowComplete = nextApproved >= item.totalApprovers;
    const nextReadiness = Math.min(100, item.readiness + 20);
    return {
      ...item,
      approvedCount: nextApproved,
      status: isNowComplete ? '승인 완료' : item.status,
      readiness: nextReadiness,
    };
  });
}

export function advanceCheckCardProgress(
  items: ReleaseApprovalItem[],
  releaseId: string,
  cardId: string
): ReleaseApprovalItem[] {
  return items.map((item) => {
    if (item.id !== releaseId) return item;
    const updatedChecklist = item.checklist.map((card) => {
      if (card.id !== cardId) return card;
      const nextProgress = card.progressRate >= 100 ? 40 : Math.min(100, card.progressRate + 20);
      const nextCoverage = card.coverageRate >= 100 ? 45 : Math.min(100, card.coverageRate + 15);
      const nextStatus =
        nextProgress >= 90
          ? '완료'
          : nextProgress >= 50
          ? '진행 중'
          : '주의 필요';
      return {
        ...card,
        progressRate: nextProgress,
        coverageRate: nextCoverage,
        badgeStatus: nextStatus as typeof card.badgeStatus,
      };
    });

    const avgReadiness = Math.round(
      updatedChecklist.reduce((acc, c) => acc + c.progressRate, 0) /
        Math.max(1, updatedChecklist.length)
    );

    return {
      ...item,
      readiness: avgReadiness,
      checklist: updatedChecklist,
    };
  });
}
