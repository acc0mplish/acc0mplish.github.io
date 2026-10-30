import { SignalStatus, StageId, TaskItem, RoadmapStats } from '../types';

export function calculateRoadmapStats(tasks: TaskItem[]): RoadmapStats {
  let blocked = 0;
  let atRisk = 0;
  let unassigned = 0;

  for (const task of tasks) {
    if (task.signal === '차단됨') {
      blocked++;
    } else if (task.signal === '위험') {
      atRisk++;
    }
    if (!task.assignees || task.assignees.length === 0) {
      unassigned++;
    }
  }

  return {
    total: tasks.length,
    blocked,
    atRisk,
    unassigned,
  };
}

export function filterTasks(
  tasks: TaskItem[],
  query: string,
  signalFilter: SignalStatus | 'all' = 'all'
): TaskItem[] {
  const trimmed = query.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesSignal = signalFilter === 'all' || task.signal === signalFilter;
    if (!matchesSignal) return false;

    if (!trimmed) return true;

    const matchesTitle = task.title.toLowerCase().includes(trimmed);
    const matchesTag = task.tag.name.toLowerCase().includes(trimmed);
    const matchesAssignee = task.assignees.some((a) =>
      a.name.toLowerCase().includes(trimmed)
    );

    return matchesTitle || matchesTag || matchesAssignee;
  });
}

export function groupTasksByStage(tasks: TaskItem[]): Record<StageId, TaskItem[]> {
  const groups: Record<StageId, TaskItem[]> = {
    '백로그': [],
    '할 일': [],
    '진행 중': [],
    '완료': [],
  };

  for (const task of tasks) {
    if (groups[task.stage]) {
      groups[task.stage].push(task);
    } else {
      groups['백로그'].push(task);
    }
  }

  return groups;
}

export function getSignalBadgeStyles(signal: SignalStatus): {
  badgeClass: string;
  dotClass: string;
  label: string;
} {
  switch (signal) {
    case '정상 진행':
      return {
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/60   ',
        dotClass: 'bg-blue-500',
        label: '정상 진행',
      };
    case '위험':
      return {
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/60   ',
        dotClass: 'bg-amber-500',
        label: '위험',
      };
    case '차단됨':
      return {
        badgeClass: 'bg-red-50 text-red-700 border-red-200/60   ',
        dotClass: 'bg-red-500',
        label: '차단됨',
      };
    case '대기 중':
    default:
      return {
        badgeClass: 'bg-zinc-100 text-klic-muted border-zinc-200/70   ',
        dotClass: 'bg-zinc-400',
        label: '대기 중',
      };
  }
}

export function getProgressColor(progress: number, signal?: SignalStatus): string {
  if (signal === '차단됨') return 'var(--klic-component-block-color-danger)'; // rose-500
  if (signal === '위험') return 'var(--klic-component-block-color-warning)'; // amber-500
  if (progress >= 70) return 'var(--klic-component-block-color-accent)'; // emerald-500
  if (progress >= 30) return 'var(--klic-component-block-color-accent)'; // blue-500
  return 'var(--klic-component-block-color-control-border)'; // slate-400
}
