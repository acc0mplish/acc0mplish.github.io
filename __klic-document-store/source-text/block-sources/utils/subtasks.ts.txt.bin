import { DeliveryTaskItem, SubTaskPriority, SubTaskStatus } from '../types';

export interface DeliveryStats {
  totalTasks: number;
  activeCount: number;
  backlogCount: number;
}

const PRIORITY_WEIGHT: Record<SubTaskPriority, number> = {
  '긴급': 4,
  '높음': 3,
  '보통': 2,
  '낮음': 1,
};

const STATUS_WEIGHT: Record<SubTaskStatus, number> = {
  '진행 중': 3,
  '할 일': 2,
  '완료': 1,
};

export function calculateDeliveryStats(tasks: DeliveryTaskItem[]): DeliveryStats {
  let totalTasks = 0;
  let activeCount = 0;
  let backlogCount = 0;

  for (const parent of tasks) {
    const groupSize = 1 + parent.subtasks.length;
    totalTasks += groupSize;
    if (parent.bucket === 'active') {
      activeCount += groupSize;
    } else if (parent.bucket === 'backlog') {
      backlogCount += groupSize;
    }
  }

  return {
    totalTasks,
    activeCount,
    backlogCount,
  };
}

export function filterAndSortDeliveryTasks(
  tasks: DeliveryTaskItem[],
  options: {
    tab: 'all' | 'active' | 'backlog';
    searchQuery: string;
    searchOperator: '포함' | '일치';
    priorityFilter: string;
    projectFilter: string;
    sortField: 'default' | 'status' | 'priority';
    sortDirection: 'asc' | 'desc';
  }
): DeliveryTaskItem[] {
  const {
    tab,
    searchQuery,
    searchOperator,
    priorityFilter,
    projectFilter,
    sortField,
    sortDirection,
  } = options;

  const q = searchQuery.trim().toLowerCase();

  const matchesText = (title: string, assigneeName: string, project: string) => {
    if (!q) return true;
    if (searchOperator === '일치') {
      return (
        title.toLowerCase() === q ||
        assigneeName.toLowerCase() === q ||
        project.toLowerCase() === q
      );
    }
    return (
      title.toLowerCase().includes(q) ||
      assigneeName.toLowerCase().includes(q) ||
      project.toLowerCase().includes(q)
    );
  };

  const matchesFilters = (priority: SubTaskPriority, project: string) => {
    if (priorityFilter !== '전체' && priority !== priorityFilter) return false;
    if (projectFilter !== '전체' && project !== projectFilter) return false;
    return true;
  };

  const filtered = tasks
    .filter((parent) => {
      if (tab === 'active' && parent.bucket !== 'active') return false;
      if (tab === 'backlog' && parent.bucket !== 'backlog') return false;
      return true;
    })
    .map((parent) => {
      const parentMatches =
        matchesText(parent.title, parent.assignee.name, parent.project) &&
        matchesFilters(parent.priority, parent.project);

      const matchingSubtasks = parent.subtasks.filter(
        (sub) =>
          matchesText(sub.title, sub.assignee.name, sub.project) &&
          matchesFilters(sub.priority, sub.project)
      );

      if (parentMatches) {
        return {
          ...parent,
          subtasks:
            q || priorityFilter !== '전체' || projectFilter !== '전체'
              ? matchingSubtasks.length > 0
                ? matchingSubtasks
                : parent.subtasks
              : parent.subtasks,
        };
      }

      if (matchingSubtasks.length > 0) {
        return {
          ...parent,
          isExpanded: true,
          subtasks: matchingSubtasks,
        };
      }

      return null;
    })
    .filter((item): item is DeliveryTaskItem => item !== null);

  if (sortField === 'default') {
    return filtered;
  }

  return [...filtered].sort((a, b) => {
    const dir = sortDirection === 'asc' ? 1 : -1;
    if (sortField === 'priority') {
      return (PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]) * dir;
    }
    if (sortField === 'status') {
      return (STATUS_WEIGHT[a.status] - STATUS_WEIGHT[b.status]) * dir;
    }
    return 0;
  });
}

export function toggleDeliveryTaskCompletion(
  tasks: DeliveryTaskItem[],
  parentId: string,
  subTaskId?: string
): DeliveryTaskItem[] {
  return tasks.map((parent) => {
    if (parent.id !== parentId) return parent;

    if (!subTaskId) {
      const nextCompleted = !parent.completed;
      const nextStatus: SubTaskStatus = nextCompleted ? '완료' : '진행 중';
      return {
        ...parent,
        completed: nextCompleted,
        status: nextStatus,
      };
    }

    const updatedSubtasks = parent.subtasks.map((sub) => {
      if (sub.id !== subTaskId) return sub;
      const nextCompleted = !sub.completed;
      const nextStatus: SubTaskStatus = nextCompleted ? '완료' : '진행 중';
      return {
        ...sub,
        completed: nextCompleted,
        status: nextStatus,
      };
    });

    return {
      ...parent,
      subtasks: updatedSubtasks,
    };
  });
}
