import { AccessMember, PermissionLevel, PermissionScopeKey } from '../types';

export interface AccessMatrixStats {
  total: number;
  onlineCount: number;
  reviewAccessCount: number;
  pinnedCount: number;
}

export function calculateAccessStats(members: AccessMember[]): AccessMatrixStats {
  let onlineCount = 0;
  let reviewAccessCount = 0;
  let pinnedCount = 0;

  for (const m of members) {
    if (m.isOnline) onlineCount++;
    if (m.scopes.permissions !== 'none' || m.scopes.users !== 'none') {
      reviewAccessCount++;
    }
    if (m.isPinned) pinnedCount++;
  }

  return {
    total: members.length,
    onlineCount,
    reviewAccessCount,
    pinnedCount,
  };
}

function scorePermissionLevel(level: PermissionLevel): number {
  if (level === 'full') return 2;
  if (level === 'partial') return 1;
  return 0;
}

export function filterAndSortMembers(
  members: AccessMember[],
  searchQuery: string,
  roleFilter: string,
  sortField: 'default' | 'name' | PermissionScopeKey = 'default',
  sortDir: 'asc' | 'desc' = 'asc'
): AccessMember[] {
  const q = searchQuery.trim().toLowerCase();

  const filtered = members.filter((m) => {
    const matchesRole = roleFilter === '전체 역할' || roleFilter === 'all' || m.role === roleFilter;
    if (!matchesRole) return false;

    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.department.toLowerCase().includes(q) ||
      m.squadTag.toLowerCase().includes(q)
    );
  });

  return [...filtered].sort((a, b) => {
    // 고정된(Pinned) 행은 항상 상단에 유지
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }

    if (sortField === 'default') {
      return 0;
    }

    let cmp = 0;
    if (sortField === 'name') {
      cmp = a.name.localeCompare(b.name, 'ko');
    } else {
      cmp = scorePermissionLevel(b.scopes[sortField]) - scorePermissionLevel(a.scopes[sortField]);
    }

    return sortDir === 'asc' ? cmp : -cmp;
  });
}

export function togglePermissionValue(current: PermissionLevel): PermissionLevel {
  if (current === 'none') return 'full';
  return 'none';
}
