import { SlaReliabilityItem } from '../types';

export interface SlaRiskStats {
  total: number;
  exhaustedCount: number;
  atRiskCount: number;
  healthyCount: number;
  pagingCount: number;
}

export function calculateSlaRiskStats(items: SlaReliabilityItem[]): SlaRiskStats {
  let exhaustedCount = 0;
  let atRiskCount = 0;
  let healthyCount = 0;
  let pagingCount = 0;

  for (const item of items) {
    if (item.riskState === 'exhausted') exhaustedCount++;
    else if (item.riskState === 'at-risk') atRiskCount++;
    else healthyCount++;

    if (item.alertState === '긴급 호출') pagingCount++;
  }

  return {
    total: items.length,
    exhaustedCount,
    atRiskCount,
    healthyCount,
    pagingCount,
  };
}

export function formatMarginPercent(val: number): string {
  const formatted = Math.abs(val).toFixed(1);
  if (val > 0) return `+${formatted}%`;
  if (val < 0) return `-${formatted}%`;
  return `0.0%`;
}

export function filterAndSortSlaItems(
  items: SlaReliabilityItem[],
  options: {
    tab: 'all' | 'exhausted' | 'at-risk' | 'healthy';
    searchQuery: string;
    teamFilter: string;
    sortField: 'name' | 'margin' | 'alert';
    sortDirection: 'asc' | 'desc';
  }
): SlaReliabilityItem[] {
  const { tab, searchQuery, teamFilter, sortField, sortDirection } = options;
  const q = searchQuery.trim().toLowerCase();

  const filtered = items.filter((item) => {
    if (tab !== 'all' && item.riskState !== tab) return false;
    if (teamFilter !== '전체 팀' && item.team !== teamFilter) return false;
    if (q) {
      const matchesName = item.name.toLowerCase().includes(q);
      const matchesService = item.serviceKey.toLowerCase().includes(q);
      const matchesTeam = item.team.toLowerCase().includes(q);
      if (!matchesName && !matchesService && !matchesTeam) return false;
    }
    return true;
  });

  return [...filtered].sort((a, b) => {
    const dir = sortDirection === 'asc' ? 1 : -1;
    if (sortField === 'margin') {
      return (a.marginPercent - b.marginPercent) * dir;
    }
    if (sortField === 'name') {
      return a.name.localeCompare(b.name, 'ko') * dir;
    }
    if (sortField === 'alert') {
      return a.alertState.localeCompare(b.alertState, 'ko') * dir;
    }
    return 0;
  });
}
