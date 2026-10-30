import { PersonAvatar } from '../PersonAvatar';
import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  MoreHorizontal,
  ListTodo,
  Lock,
  Filter,
  SlidersHorizontal,
  AlertTriangle,
  CheckCircle2,
  UserPlus,
  Calendar,
  Layers,
  Users,
  Diamond,
  Rocket,
  Flame,
  X,
} from 'lucide-react';
import {
  MilestoneRoadmapGantt,
  SprintReleaseGantt,
  CriticalPathGantt,
} from './GanttExtendedModes';
import { FluxMainWbsGantt } from './FluxMainWbsGantt';

export type GanttMode = 'flux-wbs' | 'project' | 'resource' | 'milestone' | 'sprint' | 'critical';

interface GanttChartBlockProps {
  initialMode?: GanttMode;
  density?: 'compact' | 'normal' | 'relaxed' | 'default';
}

type TaskStatus = '완료' | '진행 중' | '검토 중' | '할 일';

interface GanttAssignee {
  name: string;
  avatar: string;
}

interface ProjectGanttRow {
  id: string;
  groupId: string;
  parentTaskId?: string;
  isSubGroup?: boolean;
  title: string;
  status: TaskStatus;
  assignees: GanttAssignee[];
  dueDate: string;
  isOverdue?: boolean;
  isLocked?: boolean;
  startCol?: number; // 0 = 화 14 ... 10 = 금 24
  endCol?: number;   // inclusive
  progress: number;  // 0..100
  barColor: 'blue' | 'purple' | 'cyan' | 'teal' | 'amber' | 'emerald' | 'pink' | 'rose' | 'summary';
  dependsOnId?: string;
}

interface ProjectGanttGroup {
  id: string;
  title: string;
  startCol: number;
  endCol: number;
}

interface BookingCardItem {
  id: string;
  title: string;
  client: string;
  dateLabel: string;
  startCol: number; // 0 = 월 3 ... 10 = 목 13
  endCol: number;
  stage: '디스커버리' | '디자인' | '구축' | '런칭';
  priority?: '높음' | '보통';
  accent: 'purple' | 'cyan' | 'blue' | 'red' | 'amber' | 'emerald' | 'slate';
  isWarning?: boolean;
  isCompleted?: boolean;
  trackIndex?: number; // 0 or 1 for stacked tracks
  avatars: string[];
}

interface ResourceRowItem {
  id: string;
  teamId: string;
  name: string;
  role: string;
  avatar: string;
  usedLoad: number;
  maxLoad: number;
  bookings: BookingCardItem[];
}

interface ResourceTeamGroup {
  id: string;
  name: string;
  leadName: string;
  memberCount: number;
  usedLoad: number;
  maxLoad: number;
  startCol: number;
  endCol: number;
}

const JULY_DAYS = [
  { col: 0, dow: '화', day: 14, isWeekend: false, week: 29 },
  { col: 1, dow: '수', day: 15, isWeekend: false, week: 29 },
  { col: 2, dow: '목', day: 16, isWeekend: false, week: 29 },
  { col: 3, dow: '금', day: 17, isWeekend: false, week: 29 },
  { col: 4, dow: '토', day: 18, isWeekend: true, week: 29 },
  { col: 5, dow: '일', day: 19, isWeekend: true, week: 30 },
  { col: 6, dow: '월', day: 20, isWeekend: false, week: 30 },
  { col: 7, dow: '화', day: 21, isWeekend: false, week: 30 },
  { col: 8, dow: '수', day: 22, isWeekend: false, week: 30 },
  { col: 9, dow: '목', day: 23, isWeekend: false, week: 30 },
  { col: 10, dow: '금', day: 24, isWeekend: false, week: 30 },
];

const AUGUST_DAYS = [
  { col: 0, dow: '월', day: 3, isWeekend: false, week: 32 },
  { col: 1, dow: '화', day: 4, isWeekend: false, week: 32 },
  { col: 2, dow: '수', day: 5, isWeekend: false, week: 32 },
  { col: 3, dow: '목', day: 6, isWeekend: false, week: 32 },
  { col: 4, dow: '금', day: 7, isWeekend: false, week: 32 },
  { col: 5, dow: '토', day: 8, isWeekend: true, week: 32 },
  { col: 6, dow: '일', day: 9, isWeekend: true, week: 33 },
  { col: 7, dow: '월', day: 10, isWeekend: false, week: 33 },
  { col: 8, dow: '화', day: 11, isWeekend: false, week: 33 },
  { col: 9, dow: '수', day: 12, isWeekend: false, week: 33 },
  { col: 10, dow: '목', day: 13, isWeekend: false, week: 33 },
];

const AVATARS = {
  u1: './placeholders/avatar-5be6073573fc.svg',
  u2: './placeholders/avatar-8fe47254ee6c.svg',
  u3: './placeholders/avatar-c501831a6e92.svg',
  u4: './placeholders/avatar-9c0e45372483.svg',
  u5: './placeholders/avatar-d3a1756e9408.svg',
  u6: './placeholders/avatar-173d1edd1220.svg',
};

const INITIAL_PROJECT_GROUPS: ProjectGanttGroup[] = [
  { id: 'bug-tracking', title: '버그 트래킹', startCol: 0, endCol: 10 },
  { id: 'release-24', title: '릴리즈 2.4', startCol: 5, endCol: 10 },
];

const INITIAL_PROJECT_TASKS: ProjectGanttRow[] = [
  {
    id: 't-login-redirect',
    groupId: 'bug-tracking',
    title: '로그인 리다이렉트 오류',
    status: '완료',
    assignees: [
      { name: '김민수', avatar: AVATARS.u2 },
      { name: '이지은', avatar: AVATARS.u1 },
    ],
    dueDate: '7월 14일',
    startCol: 0,
    endCol: 0,
    progress: 100,
    barColor: 'blue',
  },
  {
    id: 't-access-rules',
    groupId: 'bug-tracking',
    title: '접근 권한 규칙',
    status: '진행 중',
    assignees: [{ name: '박선준', avatar: AVATARS.u4 }],
    dueDate: '7월 19일',
    startCol: 1,
    endCol: 5,
    progress: 58,
    barColor: 'purple',
    dependsOnId: 't-login-redirect',
  },
  {
    id: 't-mobile-crash',
    groupId: 'bug-tracking',
    isSubGroup: true,
    title: '모바일 크래시',
    status: '진행 중',
    assignees: [
      { name: '최유나', avatar: AVATARS.u3 },
      { name: '김민수', avatar: AVATARS.u2 },
      { name: '정현우', avatar: AVATARS.u6 },
    ],
    dueDate: '',
    startCol: 3,
    endCol: 6,
    progress: 45,
    barColor: 'summary',
  },
  {
    id: 't-ios-audit',
    groupId: 'bug-tracking',
    parentTaskId: 't-mobile-crash',
    title: 'iOS 감사',
    status: '진행 중',
    assignees: [{ name: '최유나', avatar: AVATARS.u3 }],
    dueDate: '7월 20일',
    startCol: 3,
    endCol: 7,
    progress: 52,
    barColor: 'cyan',
  },
  {
    id: 't-android-audit',
    groupId: 'bug-tracking',
    parentTaskId: 't-mobile-crash',
    title: '안드로이드 감사',
    status: '할 일',
    assignees: [],
    dueDate: '7월 25일',
    startCol: 7,
    endCol: 10,
    progress: 15,
    barColor: 'teal',
    dependsOnId: 't-ios-audit',
  },
  {
    id: 't-button-truncation',
    groupId: 'bug-tracking',
    title: '버튼 텍스트 잘림',
    status: '검토 중',
    assignees: [{ name: '한소윤', avatar: AVATARS.u5 }],
    dueDate: '7월 14일',
    isOverdue: true,
    startCol: 0,
    endCol: 0,
    progress: 60,
    barColor: 'amber',
  },
  {
    id: 't-offline-sync',
    groupId: 'bug-tracking',
    title: '오프라인 동기화',
    status: '할 일',
    assignees: [
      { name: '박선준', avatar: AVATARS.u4 },
      { name: '정현우', avatar: AVATARS.u6 },
    ],
    dueDate: '7월 27일',
    startCol: 8,
    endCol: 10,
    progress: 35,
    barColor: 'emerald',
  },
  {
    id: 't-api-key-rotation',
    groupId: 'bug-tracking',
    title: 'API 키 교체',
    status: '완료',
    assignees: [{ name: '김민수', avatar: AVATARS.u2 }],
    dueDate: '7월 14일',
    startCol: 0,
    endCol: 0,
    progress: 100,
    barColor: 'pink',
  },
  {
    id: 't-session-replay',
    groupId: 'bug-tracking',
    title: '세션 리플레이',
    status: '할 일',
    assignees: [],
    dueDate: '',
    progress: 0,
    barColor: 'blue',
  },
  // Group 2: 릴리즈 2.4
  {
    id: 't-data-export',
    groupId: 'release-24',
    title: '데이터 내보내기',
    status: '진행 중',
    assignees: [
      { name: '이지은', avatar: AVATARS.u1 },
      { name: '박선준', avatar: AVATARS.u4 },
    ],
    dueDate: '7월 22일',
    startCol: 5,
    endCol: 8,
    progress: 55,
    barColor: 'blue',
  },
  {
    id: 't-form-validation',
    groupId: 'release-24',
    title: '폼 유효성 검증',
    status: '할 일',
    assignees: [{ name: '최유나', avatar: AVATARS.u3 }],
    dueDate: '7월 27일',
    startCol: 9,
    endCol: 10,
    progress: 40,
    barColor: 'pink',
    dependsOnId: 't-data-export',
  },
  {
    id: 't-nav-focus',
    groupId: 'release-24',
    title: '내비게이션 포커스',
    status: '할 일',
    assignees: [],
    dueDate: '7월 28일',
    startCol: 10,
    endCol: 10,
    progress: 20,
    barColor: 'teal',
  },
  {
    id: 't-perf-audit',
    groupId: 'release-24',
    title: '성능 감사',
    status: '검토 중',
    isLocked: true,
    assignees: [{ name: '정현우', avatar: AVATARS.u6 }],
    dueDate: '7월 22일',
    startCol: 6,
    endCol: 8,
    progress: 55,
    barColor: 'rose',
  },
];

const INITIAL_RESOURCE_TEAMS: ResourceTeamGroup[] = [
  {
    id: 'team-experience',
    name: '프로덕트 경험',
    leadName: '리드 김미라',
    memberCount: 3,
    usedLoad: 220,
    maxLoad: 280,
    startCol: 0,
    endCol: 10,
  },
  {
    id: 'team-platform',
    name: '플랫폼',
    leadName: '리드 이건우',
    memberCount: 3,
    usedLoad: 190,
    maxLoad: 260,
    startCol: 0,
    endCol: 10,
  },
  {
    id: 'team-insights',
    name: '인사이트',
    leadName: '리드 박사나',
    memberCount: 2,
    usedLoad: 110,
    maxLoad: 180,
    startCol: 2,
    endCol: 10,
  },
];

const INITIAL_RESOURCES: ResourceRowItem[] = [
  {
    id: 'res-mira',
    teamId: 'team-experience',
    name: '김미라',
    role: '디자인 리드',
    avatar: AVATARS.u1,
    usedLoad: 60,
    maxLoad: 100,
    bookings: [
      {
        id: 'bk-1',
        title: '결제 플로우 감사',
        client: '신세계 리테일',
        dateLabel: '8월 3일',
        startCol: 0,
        endCol: 4,
        stage: '디스커버리',
        priority: '높음',
        accent: 'purple',
        avatars: [AVATARS.u1, AVATARS.u2],
      },
      {
        id: 'bk-2',
        title: '디자인 시스템',
        client: '내부 프로젝트',
        dateLabel: '8월 8일',
        startCol: 5,
        endCol: 9,
        stage: '디자인',
        priority: '보통',
        accent: 'cyan',
        avatars: [AVATARS.u1],
      },
    ],
  },
  {
    id: 'res-nora',
    teamId: 'team-experience',
    name: '노윤아',
    role: '프로덕트 디자이너',
    avatar: AVATARS.u3,
    usedLoad: 70,
    maxLoad: 100,
    bookings: [
      {
        id: 'bk-3',
        title: '온보딩 플로우',
        client: '삼성바이오 헬스',
        dateLabel: '8월 4일',
        startCol: 1,
        endCol: 7,
        stage: '디자인',
        priority: '높음',
        accent: 'blue',
        avatars: [AVATARS.u3, AVATARS.u4],
      },
    ],
  },
  {
    id: 'res-theo',
    teamId: 'team-experience',
    name: '박태오',
    role: '프론트엔드 엔지니어',
    avatar: AVATARS.u2,
    usedLoad: 90,
    maxLoad: 80,
    bookings: [
      {
        id: 'bk-4',
        title: '빌링 시스템 재작성',
        client: '삼성바이오 헬스',
        dateLabel: '8월 3일',
        startCol: 0,
        endCol: 10,
        stage: '구축',
        priority: '높음',
        accent: 'red',
        isWarning: true,
        trackIndex: 0,
        avatars: [AVATARS.u2, AVATARS.u6],
      },
      {
        id: 'bk-5',
        title: '런칭 리뷰',
        client: '신세계 리테일',
        dateLabel: '8월 11일',
        startCol: 8,
        endCol: 10,
        stage: '런칭',
        priority: '보통',
        accent: 'amber',
        trackIndex: 1,
        avatars: [AVATARS.u2],
      },
    ],
  },
  {
    id: 'res-leo',
    teamId: 'team-platform',
    name: '이건우',
    role: '스태프 엔지니어',
    avatar: AVATARS.u4,
    usedLoad: 50,
    maxLoad: 100,
    bookings: [
      {
        id: 'bk-6',
        title: '검색 엔진 롤아웃',
        client: '신세계 리테일',
        dateLabel: '8월 6일',
        startCol: 3,
        endCol: 9,
        stage: '런칭',
        priority: '보통',
        accent: 'amber',
        avatars: [AVATARS.u4, AVATARS.u2, AVATARS.u5],
      },
      {
        id: 'bk-7',
        title: '이벤트 스트림',
        client: '대한통운 로지스틱스',
        dateLabel: '8월 13일',
        startCol: 10,
        endCol: 10,
        stage: '구축',
        priority: '보통',
        accent: 'emerald',
        avatars: [AVATARS.u4],
      },
    ],
  },
  {
    id: 'res-alex',
    teamId: 'team-platform',
    name: '안재현',
    role: '백엔드 엔지니어',
    avatar: AVATARS.u6,
    usedLoad: 80,
    maxLoad: 100,
    bookings: [
      {
        id: 'bk-8',
        title: '원장 동기화',
        client: '대한통운 로지스틱스',
        dateLabel: '8월 3일',
        startCol: 0,
        endCol: 6,
        stage: '구축',
        priority: '보통',
        accent: 'emerald',
        avatars: [AVATARS.u6],
      },
    ],
  },
  {
    id: 'res-priya',
    teamId: 'team-platform',
    name: '박수빈',
    role: '플랫폼 엔지니어',
    avatar: AVATARS.u5,
    usedLoad: 60,
    maxLoad: 60,
    bookings: [
      {
        id: 'bk-9',
        title: '캐시 튜닝',
        client: '내부 프로젝트',
        dateLabel: '8월 4일',
        startCol: 1,
        endCol: 3,
        stage: '구축',
        accent: 'slate',
        isCompleted: true,
        avatars: [AVATARS.u5],
      },
    ],
  },
  {
    id: 'res-sana',
    teamId: 'team-insights',
    name: '박사나',
    role: '리서치 리드',
    avatar: AVATARS.u1,
    usedLoad: 60,
    maxLoad: 100,
    bookings: [
      {
        id: 'bk-10',
        title: '가격 정책 리서치',
        client: '신세계 리테일',
        dateLabel: '8월 5일',
        startCol: 2,
        endCol: 9,
        stage: '디스커버리',
        priority: '높음',
        accent: 'purple',
        avatars: [AVATARS.u1],
      },
    ],
  },
];

// 미니 원형 파이 진척도 인디케이터
function MiniPieProgress({ percent, color = 'var(--klic-component-block-color-accent)' }: { percent: number; color?: string }) {
  const r = 6;
  const c = 2 * Math.PI * r;
  const dash = (Math.max(0, Math.min(100, percent)) / 100) * c;
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0 -rotate-90">
      <circle
        cx="8"
        cy="8"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-klic-on-emphasis "
      />
      <circle
        cx="8"
        cy="8"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeDasharray={`${dash} ${c}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GanttChartBlock({
  initialMode = 'flux-wbs',
  density = 'normal',
}: GanttChartBlockProps) {
  const [activeMode, setActiveMode] = useState<GanttMode>(initialMode);

  // Sync when sidebar selection switches between gantt-project-tasks and gantt-resource-capacity
  React.useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  // --- Project Gantt State ---
  const [tasks, setTasks] = useState<ProjectGanttRow[]>(INITIAL_PROJECT_TASKS);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'bug-tracking': true,
    'release-24': true,
    't-mobile-crash': true,
  });
  const [colWidth, setColWidth] = useState<number>(60);
  const [viewGranularity, setViewGranularity] = useState<'월간' | '주간'>('월간');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskGroup, setNewTaskGroup] = useState<'bug-tracking' | 'release-24'>('bug-tracking');
  const [newTaskStartCol, setNewTaskStartCol] = useState<number>(2);
  const [newTaskEndCol, setNewTaskEndCol] = useState<number>(6);
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);

  // --- Resource Capacity Gantt State ---
  const [resources, setResources] = useState<ResourceRowItem[]>(INITIAL_RESOURCES);
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({
    'team-experience': true,
    'team-platform': true,
    'team-insights': true,
  });
  const [stageFilter, setStageFilter] = useState<string>('전체');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [newBookingTitle, setNewBookingTitle] = useState('');
  const [newBookingClient, setNewBookingClient] = useState('신세계 리테일');
  const [newBookingResourceId, setNewBookingResourceId] = useState('res-mira');
  const [newBookingStage, setNewBookingStage] = useState<'디스커버리' | '디자인' | '구축' | '런칭'>('구축');
  const [newBookingStartCol, setNewBookingStartCol] = useState(2);
  const [newBookingEndCol, setNewBookingEndCol] = useState(6);

  const toggleGroupExpand = (id: string) => {
    setExpandedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTeamExpand = (id: string) => {
    setExpandedTeams((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const cycleTaskStatus = (taskId: string) => {
    const order: TaskStatus[] = ['할 일', '진행 중', '검토 중', '완료'];
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextStatus = order[(order.indexOf(t.status) + 1) % order.length];
        const nextProgress =
          nextStatus === '완료'
            ? 100
            : nextStatus === '검토 중'
            ? 80
            : nextStatus === '진행 중'
            ? 55
            : 15;
        return { ...t, status: nextStatus, progress: nextProgress };
      })
    );
  };

  const handleAddProjectTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const s = Math.min(newTaskStartCol, newTaskEndCol);
    const end = Math.max(newTaskStartCol, newTaskEndCol);
    const dueDay = JULY_DAYS[end]?.day ?? 22;
    const created: ProjectGanttRow = {
      id: `t-custom-${Date.now()}`,
      groupId: newTaskGroup,
      title: newTaskTitle.trim(),
      status: '진행 중',
      assignees: [{ name: '이지은', avatar: AVATARS.u1 }],
      dueDate: `7월 ${dueDay}일`,
      startCol: s,
      endCol: end,
      progress: 50,
      barColor: 'purple',
    };
    setTasks((prev) => [...prev, created]);
    setNewTaskTitle('');
    setIsAddTaskModalOpen(false);
  };

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookingTitle.trim()) return;
    const s = Math.min(newBookingStartCol, newBookingEndCol);
    const end = Math.max(newBookingStartCol, newBookingEndCol);
    const startDay = AUGUST_DAYS[s]?.day ?? 5;
    const newBooking: BookingCardItem = {
      id: `bk-${Date.now()}`,
      title: newBookingTitle.trim(),
      client: newBookingClient,
      dateLabel: `8월 ${startDay}일`,
      startCol: s,
      endCol: end,
      stage: newBookingStage,
      priority: '높음',
      accent: 'blue',
      avatars: [AVATARS.u1, AVATARS.u4],
    };
    setResources((prev) =>
      prev.map((r) =>
        r.id === newBookingResourceId
          ? {
              ...r,
              usedLoad: Math.min(120, r.usedLoad + 20),
              bookings: [...r.bookings, newBooking],
            }
          : r
      )
    );
    setNewBookingTitle('');
    setIsNewBookingOpen(false);
  };

  // Visible rows for Project Task Gantt (preserving exact hierarchy)
  const visibleProjectRows = useMemo(() => {
    const result: Array<
      | { kind: 'group'; group: ProjectGanttGroup; progress: number }
      | { kind: 'task'; task: ProjectGanttRow; depth: number }
    > = [];

    for (const grp of INITIAL_PROJECT_GROUPS) {
      const grpTasks = tasks.filter((t) => t.groupId === grp.id && !t.isSubGroup);
      const avgProgress =
        grpTasks.length > 0
          ? Math.round(grpTasks.reduce((acc, item) => acc + item.progress, 0) / grpTasks.length)
          : 50;
      result.push({ kind: 'group', group: grp, progress: avgProgress });

      if (expandedGroups[grp.id]) {
        const groupItems = tasks.filter((t) => t.groupId === grp.id);
        for (const item of groupItems) {
          if (item.parentTaskId) {
            if (expandedGroups[item.parentTaskId]) {
              result.push({ kind: 'task', task: item, depth: 2 });
            }
          } else {
            result.push({ kind: 'task', task: item, depth: 1 });
          }
        }
      }
    }
    return result;
  }, [tasks, expandedGroups]);

  const rowHeight = density === 'compact' ? 36 : density === 'relaxed' ? 46 : 40;

  // Bar color palette matching image_37a1d2e8.png
  const getTaskBarStyles = (color: ProjectGanttRow['barColor']) => {
    switch (color) {
      case 'blue':
        return {
          solid: 'bg-blue-500 ',
          track: 'bg-blue-100  border border-blue-200/80 ',
        };
      case 'purple':
        return {
          solid: 'bg-blue-500 ',
          track: 'bg-blue-100  border border-blue-200/80 ',
        };
      case 'cyan':
        return {
          solid: 'bg-blue-500 ',
          track: 'bg-blue-100  border border-blue-200/80 ',
        };
      case 'teal':
        return {
          solid: 'bg-blue-400 ',
          track: 'bg-blue-100/90  border border-blue-200/80 ',
        };
      case 'amber':
        return {
          solid: 'bg-amber-500 ',
          track: 'bg-amber-100  border border-amber-200/80 ',
        };
      case 'emerald':
        return {
          solid: 'bg-blue-500 ',
          track: 'bg-blue-100  border border-blue-200/80 ',
        };
      case 'pink':
        return {
          solid: 'bg-blue-500 ',
          track: 'bg-blue-100  border border-blue-200/80 ',
        };
      case 'rose':
        return {
          solid: 'bg-blue-500 ',
          track: 'bg-blue-100  border border-blue-200/80 ',
        };
      default:
        return {
          solid: 'bg-zinc-500',
          track: 'bg-zinc-200 ',
        };
    }
  };

  const renderStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case '완료':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50  text-blue-700  border border-blue-200/70 ">
            완료
          </span>
        );
      case '진행 중':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50  text-blue-700  border border-blue-200/70 ">
            진행 중
          </span>
        );
      case '검토 중':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50  text-amber-700  border border-amber-200/70 ">
            검토 중
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100  text-klic-muted  border border-zinc-200/70 ">
            할 일
          </span>
        );
    }
  };

  const renderStatusDot = (status: TaskStatus) => {
    switch (status) {
      case '완료':
        return <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />;
      case '진행 중':
        return <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />;
      case '검토 중':
        return <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />;
      default:
        return (
          <span className="w-2 h-2 rounded-full border border-zinc-300  bg-transparent shrink-0" />
        );
    }
  };

  // Compute orthogonal dependency SVG connectors between dependent tasks
  const dependencyPaths = useMemo(() => {
    const rowIndexMap = new Map<string, number>();
    visibleProjectRows.forEach((row, idx) => {
      if (row.kind === 'task') {
        rowIndexMap.set(row.task.id, idx);
      }
    });

    const paths: Array<{ id: string; d: string; arrowX: number; arrowY: number }> = [];

    visibleProjectRows.forEach((row, targetIdx) => {
      if (row.kind !== 'task' || !row.task.dependsOnId) return;
      const sourceIdx = rowIndexMap.get(row.task.dependsOnId);
      if (sourceIdx === undefined) return;
      const sourceRow = visibleProjectRows[sourceIdx];
      if (!sourceRow || sourceRow.kind !== 'task') return;

      const sTask = sourceRow.task;
      const tTask = row.task;
      if (sTask.endCol === undefined || tTask.startCol === undefined) return;

      const startX = (sTask.endCol + 1) * colWidth - 6;
      const startY = sourceIdx * rowHeight + rowHeight / 2;
      const endX = tTask.startCol * colWidth + 4;
      const endY = targetIdx * rowHeight + rowHeight / 2;

      const midX = startX + 10;
      const midY = startY + (endY - startY) / 2;

      const d = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${midY} L ${endX - 8} ${midY} L ${endX - 8} ${endY} L ${endX} ${endY}`;
      paths.push({
        id: `${sTask.id}->${tTask.id}`,
        d,
        arrowX: endX,
        arrowY: endY,
      });
    });

    return paths;
  }, [visibleProjectRows, colWidth, rowHeight]);

  return (
    <div className="space-y-6">
      {/* 상단 뷰 전환 탭 바 (6종 간트 차트 전체 지원 - KLIC 메인 WBS/SVG 간트 포함) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-100/80  p-1.5 rounded-xl border border-zinc-200/80 ">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveMode('flux-wbs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'flux-wbs'
                ? 'bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis shadow-xs'
                : 'text-klic-muted hover:text-zinc-900  '
            }`}
          >
            <Calendar size={13} className={activeMode === 'flux-wbs' ? 'text-klic-on-emphasis' : 'text-blue-600'} />
            <span>KLIC 메인 WBS · SVG 간트 (KLIC/gantt-wbs-svg)</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold ${
                activeMode === 'flux-wbs'
                  ? 'bg-white/20 text-klic-on-emphasis'
                  : 'bg-blue-100 text-blue-700  '
              }`}
            >
              메인
            </span>
          </button>
          <button
            onClick={() => setActiveMode('project')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'project'
                ? 'bg-white  text-zinc-900  shadow-xs'
                : 'text-klic-muted hover:text-zinc-900 '
            }`}
          >
            <Layers size={13} className={activeMode === 'project' ? 'text-blue-600' : 'text-klic-muted'} />
            <span>프로젝트 일정 (KLIC/gantt-1)</span>
          </button>
          <button
            onClick={() => setActiveMode('resource')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'resource'
                ? 'bg-white  text-zinc-900  shadow-xs'
                : 'text-klic-muted hover:text-zinc-900 '
            }`}
          >
            <Users size={13} className={activeMode === 'resource' ? 'text-blue-600' : 'text-klic-muted'} />
            <span>리소스 가동률 (KLIC/gantt-4)</span>
          </button>
          <button
            onClick={() => setActiveMode('milestone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'milestone'
                ? 'bg-white  text-zinc-900  shadow-xs'
                : 'text-klic-muted hover:text-zinc-900 '
            }`}
          >
            <Diamond size={13} className={activeMode === 'milestone' ? 'text-amber-500' : 'text-klic-muted'} />
            <span>분기 마일스톤 (KLIC/gantt-2)</span>
          </button>
          <button
            onClick={() => setActiveMode('sprint')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'sprint'
                ? 'bg-white  text-zinc-900  shadow-xs'
                : 'text-klic-muted hover:text-zinc-900 '
            }`}
          >
            <Rocket size={13} className={activeMode === 'sprint' ? 'text-blue-600' : 'text-klic-muted'} />
            <span>스프린트 릴리즈 (KLIC/gantt-3)</span>
          </button>
          <button
            onClick={() => setActiveMode('critical')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'critical'
                ? 'bg-white  text-zinc-900  shadow-xs'
                : 'text-klic-muted hover:text-zinc-900 '
            }`}
          >
            <Flame size={13} className={activeMode === 'critical' ? 'text-blue-600' : 'text-klic-muted'} />
            <span>크리티컬 패스 (KLIC/gantt-5)</span>
          </button>
        </div>

        <div className="hidden xl:flex items-center gap-2 px-2.5 text-[11px] text-klic-muted ">
          <span>직각선·유선형·직선 SVG 전환 · 담당자 프로필 팝오버 지원</span>
        </div>
      </div>

      {/* =====================================================================
          MODE 0 (MAIN): KLIC 메인 WBS 계획 · SVG 간트 (image_bed357b2.png 1:1 구현)
         ===================================================================== */}
      {activeMode === 'flux-wbs' && <FluxMainWbsGantt density={density} />}

      {/* =====================================================================
          MODE 1: 프로젝트 일정 & 의존성 간트 (image_37a1d2e8.png 1:1 한글화)
         ===================================================================== */}
      {activeMode === 'project' && (
        <div className="rounded-2xl border border-zinc-200  bg-white  shadow-xs overflow-hidden relative">
          {/* 상단 툴바 */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-zinc-200 ">
            {/* 좌측: 오늘 / 월간 / 화살표 / 2026년 7월 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setColWidth(60)}
                className="px-3 py-1.5 rounded-lg border border-zinc-200  bg-white  text-xs font-medium text-zinc-700  hover:bg-zinc-50  transition shadow-2xs"
              >
                오늘
              </button>

              <button
                onClick={() => setViewGranularity((v) => (v === '월간' ? '주간' : '월간'))}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200  bg-white  text-xs font-medium text-zinc-700  hover:bg-zinc-50 transition shadow-2xs"
              >
                <span>{viewGranularity}</span>
                <ChevronDown size={13} className="text-klic-muted" />
              </button>

              <div className="flex items-center gap-0.5 ml-1">
                <button
                  className="p-1.5 rounded-md text-klic-muted hover:text-zinc-900  hover:bg-zinc-100  transition"
                  title="이전 달"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  className="p-1.5 rounded-md text-klic-muted hover:text-zinc-900  hover:bg-zinc-100  transition"
                  title="다음 달"
                >
                  <ChevronRight size={15} />
                </button>
              </div>

              <span className="text-sm font-semibold text-zinc-900  ml-1">
                2026년 7월
              </span>
            </div>

            {/* 우측: 참여자 아바타 그룹 + 작업 추가 버튼 */}
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-1.5">
                {[AVATARS.u1, AVATARS.u2, AVATARS.u3, AVATARS.u4].map((src, i) => (
                  <PersonAvatar
                    key={i}
                    src={src}
                    alt={['이지은', '김민수', '최유나', '박선준'][i]}
                    className="w-6 h-6 rounded-full object-cover ring-2 ring-white "
                  />
                ))}
                <span className="w-6 h-6 rounded-full bg-zinc-100  ring-2 ring-white  flex items-center justify-center text-[10px] font-semibold text-klic-muted ">
                  +1
                </span>
              </div>

              <div className="inline-flex items-center rounded-lg bg-klic-inverse  text-klic-on-emphasis  shadow-xs overflow-hidden">
                <button
                  onClick={() => setIsAddTaskModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold hover:bg-klic-inverse  transition"
                >
                  <Plus size={14} />
                  <span>작업 추가</span>
                </button>
                <span className="w-px h-4 bg-klic-inverse " />
                <button
                  onClick={() => setIsAddTaskModalOpen(true)}
                  className="px-2 py-1.5 hover:bg-klic-inverse  transition"
                  title="작업 추가 옵션"
                >
                  <ChevronDown size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* 메인 분할 영역: 좌측 트리 테이블 + 우측 타임라인 */}
          <div className="flex overflow-x-auto">
            {/* 좌측 트리 테이블 */}
            <div className="w-[470px] shrink-0 border-r border-zinc-200  select-none">
              {/* 좌측 헤더 (2단 높이에 맞춤: 56px) */}
              <div className="h-14 border-b border-zinc-200  bg-zinc-50/60  grid grid-cols-[1fr_76px_74px_76px_32px] items-center px-3 text-[11px] font-medium text-klic-muted ">
                <span>작업명</span>
                <span>상태</span>
                <span>담당자</span>
                <span>마감일</span>
                <div className="flex justify-center">
                  <button
                    onClick={() => setIsAddTaskModalOpen(true)}
                    className="p-1 rounded hover:bg-zinc-200/60  text-klic-muted hover:text-zinc-700 transition"
                    title="새 작업 행 추가"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* 좌측 행 리스트 */}
              <div className="divide-y divide-zinc-100 ">
                {visibleProjectRows.map((row) => {
                  if (row.kind === 'group') {
                    const isExp = expandedGroups[row.group.id];
                    return (
                      <div
                        key={row.group.id}
                        style={{ height: rowHeight }}
                        className="flex items-center justify-between px-3 bg-zinc-50/70  font-semibold text-xs text-zinc-800 "
                      >
                        <button
                          onClick={() => toggleGroupExpand(row.group.id)}
                          className="flex items-center gap-2 hover:text-zinc-950  transition"
                        >
                          {isExp ? (
                            <ChevronDown size={14} className="text-klic-muted" />
                          ) : (
                            <ChevronRight size={14} className="text-klic-muted" />
                          )}
                          <ListTodo size={14} className="text-klic-muted" />
                          <span>{row.group.title}</span>
                          <MiniPieProgress percent={row.progress} color="var(--klic-component-block-color-accent)" />
                        </button>
                        <button className="p-1 text-klic-muted hover:text-klic-muted">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    );
                  }

                  const { task, depth } = row;
                  const isSubGrp = Boolean(task.isSubGroup);
                  const isSubExp = expandedGroups[task.id];

                  return (
                    <div
                      key={task.id}
                      style={{ height: rowHeight }}
                      onMouseEnter={() => setHoveredTaskId(task.id)}
                      onMouseLeave={() => setHoveredTaskId(null)}
                      className={`grid grid-cols-[1fr_76px_74px_76px_32px] items-center px-3 text-xs transition ${
                        hoveredTaskId === task.id
                          ? 'bg-zinc-50 '
                          : 'bg-white '
                      }`}
                    >
                      {/* 작업명 컬럼 */}
                      <div
                        className="flex items-center gap-2 min-w-0 pr-2"
                        style={{ paddingLeft: depth === 2 ? 28 : 12 }}
                      >
                        {isSubGrp ? (
                          <button
                            onClick={() => toggleGroupExpand(task.id)}
                            className="p-0.5 -ml-1 text-klic-muted hover:text-zinc-700"
                          >
                            {isSubExp ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                          </button>
                        ) : null}
                        {renderStatusDot(task.status)}
                        <span className="truncate font-medium text-zinc-800 ">
                          {task.title}
                        </span>
                        {isSubGrp && <MiniPieProgress percent={task.progress} color="var(--klic-component-block-color-accent)" />}
                        {task.isLocked && (
                          <Lock size={12} className="text-klic-muted shrink-0" />
                        )}
                      </div>

                      {/* 상태 배지 컬럼 (클릭 시 상태 순환) */}
                      <div>
                        <button
                          onClick={() => cycleTaskStatus(task.id)}
                          title="클릭하여 상태 변경"
                          className="hover:scale-105 transition-transform"
                        >
                          {renderStatusBadge(task.status)}
                        </button>
                      </div>

                      {/* 담당자 컬럼 */}
                      <div className="flex items-center -space-x-1.5">
                        {task.assignees.length > 0 ? (
                          task.assignees.map((a, idx) => (
                            <PersonAvatar
                              key={idx}
                              src={a.avatar}
                              alt={a.name}
                              title={a.name}
                              className="w-5 h-5 rounded-full object-cover ring-2 ring-white "
                            />
                          ))
                        ) : (
                          <span
                            className="w-5 h-5 rounded-full border border-dashed border-zinc-300  flex items-center justify-center text-klic-muted"
                            title="미배정"
                          >
                            <UserPlus size={10} />
                          </span>
                        )}
                      </div>

                      {/* 마감일 컬럼 */}
                      <div
                        className={`text-[11px] font-medium ${
                          task.isOverdue
                            ? 'text-blue-600  font-semibold'
                            : 'text-klic-muted '
                        }`}
                      >
                        {task.dueDate || ''}
                      </div>

                      {/* 더보기 아이콘 */}
                      <div className="flex justify-center">
                        <button className="p-1 text-klic-muted hover:text-zinc-700  rounded">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 우측 타임라인 그리드 */}
            <div className="flex-1 min-w-[660px] relative select-none">
              {/* 2단 타임라인 헤더 (총 높이 56px = h-14) */}
              <div className="h-14 border-b border-zinc-200  bg-zinc-50/60  flex flex-col">
                {/* 1단: 주차 표시 (29주차 7월 12일 - 18일 | 30주차 7월 19일 - 25일) */}
                <div className="h-7 border-b border-zinc-200/70  flex text-[11px] text-klic-muted ">
                  <div
                    style={{ width: colWidth * 5 }}
                    className="px-3 flex items-center gap-2 border-r border-zinc-200/70  shrink-0"
                  >
                    <span className="font-semibold text-zinc-700 ">29주차</span>
                    <span>7월 12일 - 18일</span>
                  </div>
                  <div
                    style={{ width: colWidth * 6 }}
                    className="px-3 flex items-center gap-2 shrink-0"
                  >
                    <span className="font-semibold text-zinc-700 ">30주차</span>
                    <span>7월 19일 - 25일</span>
                  </div>
                </div>

                {/* 2단: 일자 컬럼 (화 14 ~ 금 24) */}
                <div className="h-7 flex">
                  {JULY_DAYS.map((d) => (
                    <div
                      key={d.col}
                      style={{ width: colWidth }}
                      className={`shrink-0 border-r border-zinc-200/60  flex items-center justify-center gap-1 text-[11px] ${
                        d.isWeekend
                          ? 'text-klic-muted  bg-zinc-100/50 '
                          : 'text-klic-muted '
                      }`}
                    >
                      <span>{d.dow}</span>
                      <span className="font-semibold text-zinc-800 ">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 타임라인 본문 (배경 컬럼 + 해칭 + 행 바 + 의존성 SVG) */}
              <div
                className="relative"
                style={{
                  width: JULY_DAYS.length * colWidth,
                  height: visibleProjectRows.length * rowHeight,
                }}
              >
                {/* 세로 날짜 그리드 라인 및 주말 빗금(Hatch) 배경 */}
                <div className="absolute inset-0 flex pointer-events-none">
                  {JULY_DAYS.map((d) => (
                    <div
                      key={d.col}
                      style={{
                        width: colWidth,
                        backgroundImage: d.isWeekend
                          ? 'repeating-linear-gradient(-45deg, color-mix(in srgb,var(--klic-component-block-color-control-border) 12%,transparent) 0px, color-mix(in srgb,var(--klic-component-block-color-control-border) 12%,transparent) 4px, transparent 4px, transparent 8px)'
                          : undefined,
                      }}
                      className="h-full shrink-0 border-r border-zinc-100 "
                    />
                  ))}
                </div>

                {/* 가로 행 구분선 및 각 행의 간트 바 */}
                {visibleProjectRows.map((row, rowIdx) => {
                  if (row.kind === 'group') {
                    const left = row.group.startCol * colWidth + 6;
                    const width =
                      (row.group.endCol - row.group.startCol + 1) * colWidth - 12;
                    return (
                      <div
                        key={row.group.id}
                        style={{ height: rowHeight, top: rowIdx * rowHeight }}
                        className="absolute left-0 right-0 border-b border-zinc-100  bg-zinc-50/40  flex items-center"
                      >
                        {/* 상위 그룹 요약 브래킷 바 */}
                        <div
                          style={{ left, width }}
                          className="absolute h-2.5 rounded-t-sm bg-zinc-200  overflow-visible"
                        >
                          <div
                            style={{ width: `${row.progress}%` }}
                            className="h-full bg-zinc-400  rounded-tl-sm"
                          />
                          {/* 좌우 브래킷 캡 */}
                          <span className="absolute left-0 -bottom-1 w-1.5 h-1.5 bg-zinc-400  clip-path-bracket-l" />
                          <span className="absolute right-0 -bottom-1 w-1.5 h-1.5 bg-zinc-400  clip-path-bracket-r" />
                        </div>
                      </div>
                    );
                  }

                  const { task } = row;
                  const hasBar = task.startCol !== undefined && task.endCol !== undefined;
                  const left = (task.startCol ?? 0) * colWidth + 6;
                  const spanCols = (task.endCol ?? 0) - (task.startCol ?? 0) + 1;
                  const width = Math.max(colWidth - 12, spanCols * colWidth - 12);

                  if (task.isSubGroup) {
                    return (
                      <div
                        key={task.id}
                        style={{ height: rowHeight, top: rowIdx * rowHeight }}
                        className="absolute left-0 right-0 border-b border-zinc-100  flex items-center"
                      >
                        {hasBar && (
                          <div
                            style={{ left, width }}
                            className="absolute flex items-center"
                          >
                            <div className="w-full h-2.5 rounded-t-sm bg-zinc-200  relative">
                              <div
                                style={{ width: `${task.progress}%` }}
                                className="h-full bg-zinc-400  rounded-tl-sm"
                              />
                              <span className="absolute left-0 -bottom-1 w-1.5 h-1.5 bg-zinc-400 " />
                              <span className="absolute right-0 -bottom-1 w-1.5 h-1.5 bg-zinc-400 " />
                            </div>
                            <span className="ml-2 text-[11px] font-medium text-klic-muted  whitespace-nowrap">
                              {task.title}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  }

                  const styles = getTaskBarStyles(task.barColor);

                  return (
                    <div
                      key={task.id}
                      style={{ height: rowHeight, top: rowIdx * rowHeight }}
                      onMouseEnter={() => setHoveredTaskId(task.id)}
                      onMouseLeave={() => setHoveredTaskId(null)}
                      className={`absolute left-0 right-0 border-b border-zinc-100  flex items-center transition ${
                        hoveredTaskId === task.id ? 'bg-zinc-50/70 ' : ''
                      }`}
                    >
                      {hasBar && (
                        <div
                          style={{ left }}
                          className="absolute flex items-center gap-2 z-10"
                        >
                          {/* 2-Tone 진행률 캡슐 바 */}
                          <div
                            style={{ width }}
                            onClick={() => cycleTaskStatus(task.id)}
                            title={`${task.title} (${task.progress}% 완료) — 클릭하여 상태 변경`}
                            className={`h-6 rounded-md overflow-hidden cursor-pointer relative shadow-2xs transition-transform hover:scale-[1.02] ${styles.track}`}
                          >
                            <div
                              style={{ width: `${task.progress}%` }}
                              className={`h-full transition-all duration-300 ${styles.solid}`}
                            />
                          </div>

                          {/* 우측 작업명 라벨 */}
                          <span className="text-[11px] font-medium text-zinc-700  whitespace-nowrap">
                            {task.title}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* 직교(Orthogonal) 의존성 화살표 SVG 레이어 */}
                <svg
                  className="absolute inset-0 pointer-events-none z-20"
                  width={JULY_DAYS.length * colWidth}
                  height={visibleProjectRows.length * rowHeight}
                >
                  {dependencyPaths.map((p) => (
                    <g key={p.id}>
                      <path
                        d={p.d}
                        fill="none"
                        stroke="var(--klic-component-block-color-control-border)"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <polygon
                        points={`${p.arrowX},${p.arrowY} ${p.arrowX - 5},${p.arrowY - 3.5} ${p.arrowX - 5},${p.arrowY + 3.5}`}
                        fill="var(--klic-component-block-color-control-border)"
                      />
                    </g>
                  ))}
                </svg>
              </div>

              {/* 우측 하단 플로팅 줌 컨트롤 (+ / -) */}
              <div className="sticky bottom-3 right-3 float-right mr-3 mb-3 z-30 flex items-center gap-2">
                <div className="inline-flex items-center rounded-lg border border-zinc-200  bg-white/95  backdrop-blur-xs shadow-sm">
                  <button
                    onClick={() => setColWidth((w) => Math.min(84, w + 8))}
                    className="p-1.5 text-klic-muted  hover:bg-zinc-100  rounded-l-lg transition"
                    title="타임라인 확대"
                  >
                    <Plus size={14} />
                  </button>
                  <span className="w-px h-4 bg-zinc-200 " />
                  <button
                    onClick={() => setColWidth((w) => Math.max(48, w - 8))}
                    className="p-1.5 text-klic-muted  hover:bg-zinc-100  rounded-r-lg transition"
                    title="타임라인 축소"
                  >
                    <Minus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 작업 추가 모달 */}
          {isAddTaskModalOpen && (
            <div className="fixed inset-0 z-50 bg-klic-inverse/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="w-full max-w-md rounded-2xl bg-white  border border-zinc-200  shadow-2xl p-5">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 ">
                  <h4 className="font-semibold text-sm text-zinc-900 ">
                    새 간트 작업 추가
                  </h4>
                  <button
                    onClick={() => setIsAddTaskModalOpen(false)}
                    className="p-1 text-klic-muted hover:text-zinc-700"
                  >
                    <X size={16} />
                  </button>
                </div>
                <form onSubmit={handleAddProjectTask} className="mt-4 space-y-3.5 text-xs">
                  <div>
                    <label className="block font-medium text-zinc-700  mb-1">
                      작업명
                    </label>
                    <input
                      type="text"
                      required
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="예: 다크모드 차트 토큰 검수"
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200  bg-white  text-zinc-900 "
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block font-medium text-zinc-700  mb-1">
                        그룹
                      </label>
                      <select
                        value={newTaskGroup}
                        onChange={(e) =>
                          setNewTaskGroup(e.target.value as 'bug-tracking' | 'release-24')
                        }
                        className="w-full px-2.5 py-2 rounded-lg border border-zinc-200  bg-white "
                      >
                        <option value="bug-tracking">버그 트래킹</option>
                        <option value="release-24">릴리즈 2.4</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-zinc-700  mb-1">
                        시작일
                      </label>
                      <select
                        value={newTaskStartCol}
                        onChange={(e) => setNewTaskStartCol(Number(e.target.value))}
                        className="w-full px-2.5 py-2 rounded-lg border border-zinc-200  bg-white "
                      >
                        {JULY_DAYS.map((d) => (
                          <option key={d.col} value={d.col}>
                            7월 {d.day}일 ({d.dow})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-zinc-700  mb-1">
                        종료일
                      </label>
                      <select
                        value={newTaskEndCol}
                        onChange={(e) => setNewTaskEndCol(Number(e.target.value))}
                        className="w-full px-2.5 py-2 rounded-lg border border-zinc-200  bg-white "
                      >
                        {JULY_DAYS.map((d) => (
                          <option key={d.col} value={d.col}>
                            7월 {d.day}일 ({d.dow})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddTaskModalOpen(false)}
                      className="px-3 py-1.5 rounded-lg border border-zinc-200  text-klic-muted "
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 rounded-lg bg-klic-inverse  text-klic-on-emphasis  font-semibold"
                    >
                      추가하기
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          MODE 2: 리소스 가동률 & 배정 간트 (image_fdbaa877.png 1:1 한글화)
         ===================================================================== */}
      {activeMode === 'resource' && (
        <div className="rounded-2xl border border-zinc-200  bg-white  shadow-xs overflow-hidden relative">
          {/* 상단 툴바 */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-zinc-200 ">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStageFilter('전체')}
                className="px-3 py-1.5 rounded-lg border border-zinc-200  bg-white  text-xs font-medium text-zinc-700  hover:bg-zinc-50 transition shadow-2xs"
              >
                오늘
              </button>

              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200  bg-white  text-xs font-medium text-zinc-700  hover:bg-zinc-50 transition shadow-2xs">
                <span>월간</span>
                <ChevronDown size={13} className="text-klic-muted" />
              </button>

              <div className="flex items-center gap-0.5 ml-1">
                <button className="p-1.5 rounded-md text-klic-muted hover:text-zinc-900  hover:bg-zinc-100  transition">
                  <ChevronLeft size={15} />
                </button>
                <button className="p-1.5 rounded-md text-klic-muted hover:text-zinc-900  hover:bg-zinc-100  transition">
                  <ChevronRight size={15} />
                </button>
              </div>

              <span className="text-sm font-semibold text-zinc-900  ml-1">
                2026년 8월
              </span>
            </div>

            {/* 우측: 필터 + 새 배정 */}
            <div className="flex items-center gap-2.5 relative">
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition shadow-2xs ${
                    stageFilter !== '전체'
                      ? 'border-zinc-900  bg-klic-inverse/5 text-zinc-900 '
                      : 'border-zinc-200  bg-white  text-zinc-700 '
                  }`}
                >
                  <Filter size={13} />
                  <span>필터 {stageFilter !== '전체' ? `· ${stageFilter}` : ''}</span>
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-zinc-200  bg-white  shadow-xl p-1.5 z-40 text-xs">
                    {(['전체', '디스커버리', '디자인', '구축', '런칭'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          setStageFilter(st);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg transition ${
                          stageFilter === st
                            ? 'bg-zinc-100  font-semibold text-zinc-900 '
                            : 'text-klic-muted  hover:bg-zinc-50 '
                        }`}
                      >
                        {st === '전체' ? '전체 단계 보기' : `${st} 단계`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsNewBookingOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-klic-inverse  text-klic-on-emphasis  text-xs font-semibold hover:bg-klic-inverse  transition shadow-xs"
              >
                <Plus size={14} />
                <span>새 배정</span>
              </button>
            </div>
          </div>

          {/* 메인 분할 영역: 좌측 리소스 테이블 + 우측 배정 카드 타임라인 */}
          <div className="flex overflow-x-auto">
            {/* 좌측 리소스 테이블 */}
            <div className="w-[430px] shrink-0 border-r border-zinc-200  select-none">
              {/* 헤더 (56px) */}
              <div className="h-14 border-b border-zinc-200  bg-zinc-50/60  grid grid-cols-[1fr_132px_78px_28px] items-center px-3 text-[11px] font-medium text-klic-muted ">
                <span>리소스</span>
                <span>역할</span>
                <span>가동 부하</span>
                <div className="flex justify-center">
                  <SlidersHorizontal size={13} className="text-klic-muted" />
                </div>
              </div>

              {/* 팀 그룹 및 리소스 행 */}
              <div className="divide-y divide-zinc-100 ">
                {INITIAL_RESOURCE_TEAMS.map((team) => {
                  const isExp = expandedTeams[team.id];
                  const teamResources = resources.filter((r) => r.teamId === team.id);

                  return (
                    <React.Fragment key={team.id}>
                      {/* 팀 요약 헤더 행 (42px) */}
                      <div className="h-[42px] grid grid-cols-[1fr_132px_78px_28px] items-center px-3 bg-zinc-50/80  text-xs">
                        <button
                          onClick={() => toggleTeamExpand(team.id)}
                          className="flex items-center gap-2 font-semibold text-zinc-800  hover:text-zinc-950 text-left"
                        >
                          {isExp ? (
                            <ChevronDown size={14} className="text-klic-muted" />
                          ) : (
                            <ChevronRight size={14} className="text-klic-muted" />
                          )}
                          <span>{team.name}</span>
                          <span className="px-1.5 py-0.2 rounded bg-zinc-200/70  text-[10px] font-mono text-klic-muted ">
                            {team.memberCount}
                          </span>
                        </button>
                        <span className="text-[11px] text-klic-muted  truncate">
                          {team.leadName}
                        </span>
                        <div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50  text-blue-700  border border-blue-200/70 ">
                            {team.usedLoad}/{team.maxLoad}
                          </span>
                        </div>
                        <div className="flex justify-center text-klic-muted">
                          <MoreHorizontal size={14} />
                        </div>
                      </div>

                      {/* 팀 소속 리소스 행 */}
                      {isExp &&
                        teamResources.map((res) => {
                          const hasStacked = res.bookings.some((b) => (b.trackIndex ?? 0) > 0);
                          const resRowHeight = hasStacked ? 156 : 86;
                          const isOverloaded = res.usedLoad > res.maxLoad;
                          const isFull = res.usedLoad === res.maxLoad;

                          return (
                            <div
                              key={res.id}
                              style={{ height: resRowHeight }}
                              className="grid grid-cols-[1fr_132px_78px_28px] items-center px-3 bg-white  hover:bg-zinc-50/60  transition text-xs"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                <PersonAvatar
                                  src={res.avatar}
                                  alt={res.name}
                                  className="w-6 h-6 rounded-full object-cover shrink-0"
                                />
                                <span className="font-medium text-zinc-800  truncate">
                                  {res.name}
                                </span>
                              </div>
                              <span className="text-[11px] text-klic-muted  truncate pr-2">
                                {res.role}
                              </span>
                              <div>
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                                    isOverloaded
                                      ? 'bg-blue-50  text-blue-600  border-blue-200 '
                                      : isFull
                                      ? 'bg-amber-50  text-amber-700  border-amber-200 '
                                      : 'bg-blue-50  text-blue-700  border-blue-200/70 '
                                  }`}
                                >
                                  {res.usedLoad}/{res.maxLoad}
                                </span>
                              </div>
                              <div className="flex justify-center text-klic-muted">
                                <MoreHorizontal size={14} />
                              </div>
                            </div>
                          );
                        })}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* 우측 배정 카드 타임라인 */}
            <div className="flex-1 min-w-[715px] relative select-none">
              {/* 2단 헤더 (56px) */}
              <div className="h-14 border-b border-zinc-200  bg-zinc-50/60  flex flex-col">
                <div className="h-7 border-b border-zinc-200/70  flex text-[11px] text-klic-muted ">
                  <div
                    style={{ width: 65 * 6 }}
                    className="px-3 flex items-center gap-2 border-r border-zinc-200/70  shrink-0"
                  >
                    <span className="font-semibold text-zinc-700 ">32주차</span>
                    <span>8월 2일 - 8일</span>
                  </div>
                  <div
                    style={{ width: 65 * 5 }}
                    className="px-3 flex items-center gap-2 shrink-0"
                  >
                    <span className="font-semibold text-zinc-700 ">33주차</span>
                    <span>8월 9일 - 15일</span>
                  </div>
                </div>

                <div className="h-7 flex">
                  {AUGUST_DAYS.map((d) => (
                    <div
                      key={d.col}
                      style={{ width: 65 }}
                      className={`shrink-0 border-r border-zinc-200/60  flex items-center justify-center gap-1 text-[11px] ${
                        d.isWeekend
                          ? 'text-klic-muted  bg-zinc-100/50 '
                          : 'text-klic-muted '
                      }`}
                    >
                      <span>{d.dow}</span>
                      <span className="font-semibold text-zinc-800 ">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 타임라인 본문 */}
              <div className="relative" style={{ width: AUGUST_DAYS.length * 65 }}>
                {/* 세로 날짜 그리드 및 주말 해칭 배경 */}
                <div className="absolute inset-0 flex pointer-events-none">
                  {AUGUST_DAYS.map((d) => (
                    <div
                      key={d.col}
                      style={{
                        width: 65,
                        backgroundImage: d.isWeekend
                          ? 'repeating-linear-gradient(-45deg, color-mix(in srgb,var(--klic-component-block-color-control-border) 12%,transparent) 0px, color-mix(in srgb,var(--klic-component-block-color-control-border) 12%,transparent) 4px, transparent 4px, transparent 8px)'
                          : undefined,
                      }}
                      className="h-full shrink-0 border-r border-zinc-100 "
                    />
                  ))}
                </div>

                {/* 팀 그룹 및 리소스 배정 카드 렌더링 */}
                <div className="relative z-10 divide-y divide-zinc-100 ">
                  {INITIAL_RESOURCE_TEAMS.map((team) => {
                    const isExp = expandedTeams[team.id];
                    const teamResources = resources.filter((r) => r.teamId === team.id);
                    const teamLeft = team.startCol * 65 + 6;
                    const teamWidth = (team.endCol - team.startCol + 1) * 65 - 12;

                    return (
                      <React.Fragment key={team.id}>
                        {/* 팀 가동률 요약 바 행 (42px) */}
                        <div className="h-[42px] relative flex items-center bg-zinc-50/40 ">
                          <div
                            style={{ left: teamLeft, width: teamWidth }}
                            className="absolute flex items-center gap-2"
                          >
                            <div className="w-full h-2.5 rounded-t-sm bg-blue-100  relative">
                              <div
                                style={{
                                  width: `${Math.round((team.usedLoad / team.maxLoad) * 100)}%`,
                                }}
                                className="h-full bg-blue-400  rounded-tl-sm"
                              />
                              <span className="absolute left-0 -bottom-1 w-1.5 h-1.5 bg-blue-500" />
                              <span className="absolute right-0 -bottom-1 w-1.5 h-1.5 bg-blue-500" />
                            </div>
                            <span className="text-[11px] font-medium text-klic-muted  whitespace-nowrap">
                              {team.name}
                            </span>
                          </div>
                        </div>

                        {/* 각 리소스의 배정 카드 트랙 */}
                        {isExp &&
                          teamResources.map((res) => {
                            const hasStacked = res.bookings.some((b) => (b.trackIndex ?? 0) > 0);
                            const resRowHeight = hasStacked ? 156 : 86;
                            const filteredBookings = res.bookings.filter((b) =>
                              stageFilter === '전체' ? true : b.stage === stageFilter
                            );

                            return (
                              <div
                                key={res.id}
                                style={{ height: resRowHeight }}
                                className="relative"
                              >
                                {filteredBookings.map((bk) => {
                                  const left = bk.startCol * 65 + 5;
                                  const width = (bk.endCol - bk.startCol + 1) * 65 - 10;
                                  const top = (bk.trackIndex ?? 0) === 1 ? 82 : 8;

                                  const borderAccent =
                                    bk.accent === 'purple'
                                      ? 'border-l-blue-500'
                                      : bk.accent === 'cyan'
                                      ? 'border-l-blue-500'
                                      : bk.accent === 'blue'
                                      ? 'border-l-blue-500'
                                      : bk.accent === 'red'
                                      ? 'border-l-blue-500'
                                      : bk.accent === 'amber'
                                      ? 'border-l-amber-500'
                                      : bk.accent === 'emerald'
                                      ? 'border-l-blue-500'
                                      : 'border-l-zinc-500';

                                  return (
                                    <div
                                      key={bk.id}
                                      style={{ left, width, top, height: 68 }}
                                      className={`absolute rounded-lg border border-zinc-200/90  border-l-[3.5px] ${borderAccent} bg-white/95  shadow-2xs px-2.5 py-1.5 flex flex-col justify-between overflow-hidden hover:shadow-md transition`}
                                    >
                                      <div className="flex items-start justify-between gap-1.5">
                                        <div className="min-w-0">
                                          <div className="flex items-center gap-1">
                                            {bk.isWarning && (
                                              <AlertTriangle
                                                size={12}
                                                className="text-blue-500 shrink-0"
                                              />
                                            )}
                                            {bk.isCompleted && (
                                              <CheckCircle2
                                                size={12}
                                                className="text-klic-muted  shrink-0"
                                              />
                                            )}
                                            <span className="text-xs font-semibold text-zinc-900  truncate">
                                              {bk.title}
                                            </span>
                                          </div>
                                          <p className="text-[10px] text-klic-muted  truncate">
                                            {bk.client} • {bk.dateLabel}
                                          </p>
                                        </div>

                                        {bk.avatars.length > 0 && width > 140 && (
                                          <div className="flex items-center -space-x-1 shrink-0">
                                            {bk.avatars.map((av, i) => (
                                              <PersonAvatar
                                                key={i}
                                                src={av}
                                                alt={i === 0 ? res.name : `예약 담당자 ${i + 1}`}
                                                className="w-4 h-4 rounded-full object-cover ring-1 ring-white "
                                              />
                                            ))}
                                          </div>
                                        )}
                                      </div>

                                      {/* 하단 단계 & 우선순위 배지 */}
                                      <div className="flex items-center gap-1">
                                        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-zinc-100  text-zinc-700  border border-zinc-200/80 ">
                                          {bk.stage}
                                        </span>
                                        {bk.priority === '높음' && (
                                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-blue-50  text-blue-600  border border-blue-200/70 ">
                                            높음
                                          </span>
                                        )}
                                        {bk.priority === '보통' && (
                                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-amber-50  text-amber-700  border border-amber-200/70 ">
                                            보통
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 새 배정 모달 */}
          {isNewBookingOpen && (
            <div className="fixed inset-0 z-50 bg-klic-inverse/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="w-full max-w-md rounded-2xl bg-white  border border-zinc-200  shadow-2xl p-5">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 ">
                  <h4 className="font-semibold text-sm text-zinc-900 ">
                    새 리소스 배정 추가
                  </h4>
                  <button
                    onClick={() => setIsNewBookingOpen(false)}
                    className="p-1 text-klic-muted hover:text-zinc-700"
                  >
                    <X size={16} />
                  </button>
                </div>
                <form onSubmit={handleAddBooking} className="mt-4 space-y-3.5 text-xs">
                  <div>
                    <label className="block font-medium text-zinc-700  mb-1">
                      배정 프로젝트 / 업무명
                    </label>
                    <input
                      type="text"
                      required
                      value={newBookingTitle}
                      onChange={(e) => setNewBookingTitle(e.target.value)}
                      placeholder="예: 모바일 체크아웃 성능 최적화"
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200  bg-white  text-zinc-900 "
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-medium text-zinc-700  mb-1">
                        담당 리소스
                      </label>
                      <select
                        value={newBookingResourceId}
                        onChange={(e) => setNewBookingResourceId(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-lg border border-zinc-200  bg-white "
                      >
                        {resources.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({r.role})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-zinc-700  mb-1">
                        단계
                      </label>
                      <select
                        value={newBookingStage}
                        onChange={(e) =>
                          setNewBookingStage(
                            e.target.value as '디스커버리' | '디자인' | '구축' | '런칭'
                          )
                        }
                        className="w-full px-2.5 py-2 rounded-lg border border-zinc-200  bg-white "
                      >
                        <option value="디스커버리">디스커버리</option>
                        <option value="디자인">디자인</option>
                        <option value="구축">구축</option>
                        <option value="런칭">런칭</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-medium text-zinc-700  mb-1">
                        시작일
                      </label>
                      <select
                        value={newBookingStartCol}
                        onChange={(e) => setNewBookingStartCol(Number(e.target.value))}
                        className="w-full px-2.5 py-2 rounded-lg border border-zinc-200  bg-white "
                      >
                        {AUGUST_DAYS.map((d) => (
                          <option key={d.col} value={d.col}>
                            8월 {d.day}일 ({d.dow})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-zinc-700  mb-1">
                        종료일
                      </label>
                      <select
                        value={newBookingEndCol}
                        onChange={(e) => setNewBookingEndCol(Number(e.target.value))}
                        className="w-full px-2.5 py-2 rounded-lg border border-zinc-200  bg-white "
                      >
                        {AUGUST_DAYS.map((d) => (
                          <option key={d.col} value={d.col}>
                            8월 {d.day}일 ({d.dow})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsNewBookingOpen(false)}
                      className="px-3 py-1.5 rounded-lg border border-zinc-200  text-klic-muted "
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 rounded-lg bg-klic-inverse  text-klic-on-emphasis  font-semibold"
                    >
                      배정 추가
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          MODE 3: 분기 마일스톤 로드맵 간트 (KLIC/gantt-2)
         ===================================================================== */}
      {activeMode === 'milestone' && (
        <MilestoneRoadmapGantt density={density === 'normal' ? 'default' : density} />
      )}

      {/* =====================================================================
          MODE 4: 스프린트 릴리즈 트레인 간트 (KLIC/gantt-3)
         ===================================================================== */}
      {activeMode === 'sprint' && (
        <SprintReleaseGantt density={density === 'normal' ? 'default' : density} />
      )}

      {/* =====================================================================
          MODE 5: 크리티컬 패스 병목 분석 간트 (KLIC/gantt-5)
         ===================================================================== */}
      {activeMode === 'critical' && (
        <CriticalPathGantt density={density === 'normal' ? 'default' : density} />
      )}
    </div>
  );
}
