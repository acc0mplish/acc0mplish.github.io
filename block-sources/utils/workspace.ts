import { PortfolioProjectItem } from '../types';

export interface WorkspaceKpiStats {
  totalProjects: number;
  completedProjects: number;
  totalTasks: number;
  openTasks: number;
  completionRate: number;
  totalMembers: number;
  pendingInvites: number;
}

export function calculateWorkspaceKpis(
  projects: PortfolioProjectItem[],
  completedTasksBaseline = 9
): WorkspaceKpiStats {
  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.status === '완료됨').length;
  const openTasks = projects.reduce((sum, p) => sum + p.openTasks, 0);
  const totalTasks = openTasks + completedTasksBaseline;
  const completionRate =
    totalTasks > 0
      ? Math.round((completedTasksBaseline / totalTasks) * 100)
      : 0;

  return {
    totalProjects,
    completedProjects,
    totalTasks,
    openTasks,
    completionRate,
    totalMembers: 8,
    pendingInvites: 1,
  };
}

export function advanceProjectProgress(
  projects: PortfolioProjectItem[],
  projectId: string
): PortfolioProjectItem[] {
  return projects.map((proj) => {
    if (proj.id !== projectId) return proj;
    const nextProgress = proj.progress >= 100 ? 15 : Math.min(100, proj.progress + 15);
    const isNowDone = nextProgress === 100;
    return {
      ...proj,
      progress: nextProgress,
      status: isNowDone ? '완료됨' : proj.status === '완료됨' ? '진행 중' : proj.status,
      openTasks: isNowDone ? 0 : Math.max(1, proj.openTasks - 1),
    };
  });
}
