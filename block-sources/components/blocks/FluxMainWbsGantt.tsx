import { PersonAvatar } from '../PersonAvatar';
import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Calendar,
  Info,
  GripVertical,
  Sparkles,
  CheckCircle2,
  GitBranch,
  Layers,
  X,
  UserPlus,
} from 'lucide-react';

export type SvgLineType = 'orthogonal' | 'curved' | 'straight';
export type TimeScaleType = '일' | '주' | '월' | '분기';

export interface WbsAssignee {
  id: string;
  name: string;
  role: string;
  status: '활성' | '비활성' | '자리비움';
  avatar: string;
}

export interface WbsRowItem {
  id: string;
  wbs: string;
  parentId?: string;
  isSection?: boolean;
  title: string;
  startDateLabel: string; // e.g. '09.21'
  durationDays: number;
  progress: number;
  assignees: WbsAssignee[];
  extraAssigneeCount?: number;
  // Timeline positioning (0 = 9/21, 1 = 9/22, ... 35 = 10/26)
  startCol?: number;
  spanCols?: number;
  barTheme?: 'purple' | 'gold' | 'coral' | 'mint' | 'amber' | 'beige' | 'slate' | 'rose';
  priority?: '높음' | '보통';
  isCritical?: boolean;
}

interface SvgDependencyEdge {
  id: string;
  fromRowId: string;
  toRowId: string;
}

const MEMBER_POOL: Record<string, WbsAssignee> = {
  m1: {
    id: 'm1',
    name: '윤서연 PM',
    role: '인프라 총괄 PM',
    status: '활성',
    avatar: './placeholders/avatar-27ccdef6fa6f.svg',
  },
  m2: {
    id: 'm2',
    name: '최도윤 HW 엔지니어',
    role: 'HW 엔지니어',
    status: '비활성',
    avatar: './placeholders/avatar-51747f419874.svg',
  },
  m3: {
    id: 'm3',
    name: '문소민 DBA',
    role: 'DBA',
    status: '비활성',
    avatar: './placeholders/avatar-591f5c8ec067.svg',
  },
  m4: {
    id: 'm4',
    name: '강지훈 네트워크 아키텍트',
    role: '네트워크 아키텍트',
    status: '활성',
    avatar: './placeholders/avatar-273f4a3f306b.svg',
  },
  m5: {
    id: 'm5',
    name: '한유진 보안 아키텍트',
    role: '보안·DR 리드',
    status: '활성',
    avatar: './placeholders/avatar-76c628dee7cb.svg',
  },
  m6: {
    id: 'm6',
    name: '박성민 조달 매니저',
    role: 'IT 전략구매',
    status: '활성',
    avatar: './placeholders/avatar-db5dd4b3926d.svg',
  },
};

// Generate daily timeline columns from 9/21 to 10/26 (36 days)
const TIMELINE_DAYS = (() => {
  const days: Array<{ index: number; label: string; month: number; day: number; isWeekend: boolean }> = [];
  // Sept 21 to Sept 30 (10 days)
  for (let d = 21; d <= 30; d++) {
    const idx = days.length;
    const dow = (d - 21) % 7; // Assume 9/21 is Mon
    days.push({
      index: idx,
      label: `9/${d}`,
      month: 9,
      day: d,
      isWeekend: dow === 5 || dow === 6,
    });
  }
  // Oct 1 to Oct 26 (26 days)
  for (let d = 1; d <= 26; d++) {
    const idx = days.length;
    const dow = idx % 7;
    days.push({
      index: idx,
      label: `10/${d}`,
      month: 10,
      day: d,
      isWeekend: dow === 5 || dow === 6,
    });
  }
  return days;
})();

const INITIAL_WBS_ROWS: WbsRowItem[] = [
  {
    id: 'sec-1',
    wbs: '1',
    isSection: true,
    title: '현황조사·용량산정',
    startDateLabel: '09.21',
    durationDays: 12,
    progress: 43,
    assignees: [MEMBER_POOL.m1],
    startCol: 0, // 9/21
    spanCols: 12, // ends 10/2
    barTheme: 'purple',
    priority: '높음',
  },
  {
    id: 'row-1-1',
    wbs: '1.1',
    parentId: 'sec-1',
    title: '전산실·설비 현장 실사',
    startDateLabel: '09.21',
    durationDays: 4,
    progress: 20,
    assignees: [MEMBER_POOL.m3, MEMBER_POOL.m1, MEMBER_POOL.m2],
    extraAssigneeCount: 2,
    startCol: 0, // 9/21
    spanCols: 4, // ends 9/24
    barTheme: 'gold',
    priority: '높음',
  },
  {
    id: 'row-1-2',
    wbs: '1.2',
    parentId: 'sec-1',
    title: '용량·전원·랙·네트워크 산정',
    startDateLabel: '09.23',
    durationDays: 5,
    progress: 70,
    assignees: [MEMBER_POOL.m1, MEMBER_POOL.m2],
    startCol: 2, // 9/23
    spanCols: 5, // ends 9/27
    barTheme: 'gold',
    priority: '높음',
  },
  {
    id: 'row-1-3',
    wbs: '1.3',
    parentId: 'sec-1',
    title: '보안·백업·DR 요구사항 정의',
    startDateLabel: '09.24',
    durationDays: 3,
    progress: 40,
    assignees: [MEMBER_POOL.m5],
    startCol: 3, // 9/24
    spanCols: 3, // ends 9/26
    barTheme: 'coral',
    priority: '높음',
    isCritical: true,
  },
  {
    id: 'sec-2',
    wbs: '2',
    isSection: true,
    title: '기본설계·조달',
    startDateLabel: '09.30',
    durationDays: 10,
    progress: 47,
    assignees: [MEMBER_POOL.m2, MEMBER_POOL.m3],
    startCol: 9, // 9/30
    spanCols: 10, // ends 10/9
    barTheme: 'coral',
    priority: '높음',
    isCritical: true,
  },
  {
    id: 'row-2-1',
    wbs: '2.1',
    parentId: 'sec-2',
    title: '장비 규격서 및 호환성 검토',
    startDateLabel: '10.01',
    durationDays: 8,
    progress: 40,
    assignees: [MEMBER_POOL.m2, MEMBER_POOL.m3],
    startCol: 10, // 10/1
    spanCols: 8, // ends 10/8
    barTheme: 'mint',
    priority: '높음',
  },
  {
    id: 'row-2-2',
    wbs: '2.2',
    parentId: 'sec-2',
    title: '조달·납품 일정 및 검수 기준',
    startDateLabel: '10.01',
    durationDays: 6,
    progress: 100,
    assignees: [MEMBER_POOL.m3, MEMBER_POOL.m1, MEMBER_POOL.m6],
    startCol: 10, // 10/1
    spanCols: 7, // ends 10/7
    barTheme: 'amber',
    priority: '높음',
  },
  {
    id: 'row-2-3',
    wbs: '2.3',
    parentId: 'sec-2',
    title: '발주·계약·반입 계획',
    startDateLabel: '10.01',
    durationDays: 7,
    progress: 0,
    assignees: [MEMBER_POOL.m1, MEMBER_POOL.m3],
    startCol: 10, // 10/1
    spanCols: 7, // ends 10/7
    barTheme: 'beige',
    priority: '높음',
    isCritical: true,
  },
  {
    id: 'sec-3',
    wbs: '3',
    isSection: true,
    title: '납품·설치',
    startDateLabel: '10.10',
    durationDays: 4,
    progress: 0,
    assignees: [MEMBER_POOL.m2, MEMBER_POOL.m3],
    startCol: 19, // 10/10
    spanCols: 4, // ends 10/13
    barTheme: 'slate',
    priority: '높음',
    isCritical: true,
  },
  {
    id: 'row-3-1',
    wbs: '3.1',
    parentId: 'sec-3',
    title: '서버·스토리지·네트워크 설치',
    startDateLabel: '10.01',
    durationDays: 10,
    progress: 0,
    assignees: [],
    startCol: 10, // 10/1
    spanCols: 10, // ends 10/10
    barTheme: 'beige',
    priority: '높음',
  },
  {
    id: 'row-3-2',
    wbs: '3.2',
    parentId: 'sec-3',
    title: 'OS·가상화·보안 기준 적용',
    startDateLabel: '09.29',
    durationDays: 5,
    progress: 0,
    assignees: [MEMBER_POOL.m3],
    startCol: 8, // 9/29
    spanCols: 5, // ends 10/3
    barTheme: 'rose',
    priority: '높음',
  },
  {
    id: 'row-3-3',
    wbs: '3.3',
    parentId: 'sec-3',
    title: '자산대장·시리얼 등록',
    startDateLabel: '11.11',
    durationDays: 4,
    progress: 0,
    assignees: [],
    priority: '보통',
  },
  {
    id: 'sec-4',
    wbs: '4',
    isSection: true,
    title: '통합·성능시험',
    startDateLabel: '11.15',
    durationDays: 21,
    progress: 0,
    assignees: [],
    priority: '높음',
  },
  {
    id: 'row-4-1',
    wbs: '4.1',
    parentId: 'sec-4',
    title: '네트워크·이중화·백업 시험',
    startDateLabel: '11.15',
    durationDays: 7,
    progress: 0,
    assignees: [],
    priority: '높음',
  },
  {
    id: 'row-4-2',
    wbs: '4.2',
    parentId: 'sec-4',
    title: '보안 취약점·성능 부하 시험',
    startDateLabel: '11.22',
    durationDays: 7,
    progress: 0,
    assignees: [],
    priority: '높음',
  },
  {
    id: 'row-4-3',
    wbs: '4.3',
    parentId: 'sec-4',
    title: '장애 대응·복구 리허설',
    startDateLabel: '11.29',
    durationDays: 7,
    progress: 0,
    assignees: [],
    priority: '높음',
  },
  {
    id: 'sec-5',
    wbs: '5',
    isSection: true,
    title: '인수·운영전환',
    startDateLabel: '12.06',
    durationDays: 14,
    progress: 0,
    assignees: [],
    priority: '높음',
  },
  {
    id: 'row-5-1',
    wbs: '5.1',
    parentId: 'sec-5',
    title: '운영자 교육 및 최종 인수인계',
    startDateLabel: '12.06',
    durationDays: 14,
    progress: 0,
    assignees: [],
    priority: '보통',
  },
];

const INITIAL_DEPENDENCIES: SvgDependencyEdge[] = [
  { id: 'e-sec1-11', fromRowId: 'sec-1', toRowId: 'row-1-1' },
  { id: 'e-11-12', fromRowId: 'row-1-1', toRowId: 'row-1-2' },
  { id: 'e-12-13', fromRowId: 'row-1-2', toRowId: 'row-1-3' },
  { id: 'e-13-sec2', fromRowId: 'row-1-3', toRowId: 'sec-2' },
  { id: 'e-sec2-21', fromRowId: 'sec-2', toRowId: 'row-2-1' },
  { id: 'e-13-22', fromRowId: 'row-1-3', toRowId: 'row-2-2' },
  { id: 'e-23-sec3', fromRowId: 'row-2-3', toRowId: 'sec-3' },
  { id: 'e-sec3-31', fromRowId: 'sec-3', toRowId: 'row-3-1' },
  { id: 'e-13-32', fromRowId: 'row-1-3', toRowId: 'row-3-2' },
];

export function FluxMainWbsGantt({
  density = 'normal',
}: {
  density?: 'compact' | 'normal' | 'relaxed' | 'default';
}) {
  const [rows, setRows] = useState<WbsRowItem[]>(INITIAL_WBS_ROWS);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'sec-1': true,
    'sec-2': true,
    'sec-3': true,
    'sec-4': true,
    'sec-5': true,
  });
  const [timeScale, setTimeScale] = useState<TimeScaleType>('일');
  const [lineType, setLineType] = useState<SvgLineType>('orthogonal');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLegend, setShowLegend] = useState(false);
  const [highlightCritical, setHighlightCritical] = useState(false);
  // Open assignee profile popover on row-2-1 by default so it matches the screenshot on load
  const [activePopoverRowId, setActivePopoverRowId] = useState<string | null>('row-2-1');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskParent, setNewTaskParent] = useState('sec-3');
  const [newTaskStartCol, setNewTaskStartCol] = useState(14);
  const [newTaskDuration, setNewTaskDuration] = useState(5);

  const rowHeight = density === 'compact' ? 40 : density === 'relaxed' ? 50 : 44;
  const colWidth = timeScale === '일' ? 38 : timeScale === '주' ? 52 : timeScale === '월' ? 68 : 84;

  const toggleSection = (secId: string) => {
    setExpandedSections((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  const visibleRows = useMemo(() => {
    return rows.filter((r) => {
      if (r.parentId && expandedSections[r.parentId] === false) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        return r.title.toLowerCase().includes(q) || r.wbs.toLowerCase().includes(q);
      }
      return true;
    });
  }, [rows, expandedSections, searchQuery]);

  // Compute SVG dependency connector paths according to lineType ('orthogonal' | 'curved' | 'straight')
  const svgConnectors = useMemo(() => {
    const rowIdxMap = new Map<string, number>();
    visibleRows.forEach((r, idx) => rowIdxMap.set(r.id, idx));

    return INITIAL_DEPENDENCIES.map((edge) => {
      const fromIdx = rowIdxMap.get(edge.fromRowId);
      const toIdx = rowIdxMap.get(edge.toRowId);
      if (fromIdx === undefined || toIdx === undefined) return null;

      const fromRow = visibleRows[fromIdx];
      const toRow = visibleRows[toIdx];
      if (
        fromRow.startCol === undefined ||
        fromRow.spanCols === undefined ||
        toRow.startCol === undefined
      ) {
        return null;
      }

      const startX = (fromRow.startCol + fromRow.spanCols) * colWidth - 4;
      const startY = fromIdx * rowHeight + rowHeight / 2;
      const endX = toRow.startCol * colWidth + 4;
      const endY = toIdx * rowHeight + rowHeight / 2;

      const isCriticalEdge = Boolean(fromRow.isCritical && toRow.isCritical);

      let d = '';
      if (lineType === 'straight') {
        d = `M ${startX} ${startY} L ${endX} ${endY}`;
      } else if (lineType === 'curved') {
        const deltaX = Math.abs(endX - startX);
        const cpOffset = Math.max(28, deltaX * 0.55);
        d = `M ${startX} ${startY} C ${startX + cpOffset} ${startY}, ${endX - cpOffset} ${endY}, ${endX} ${endY}`;
      } else {
        // 직각선 (Orthogonal) matching screenshot geometry
        if (edge.id === 'e-13-sec2' || edge.id === 'e-13-22' || edge.id === 'e-13-32') {
          // Shared trunk at col 7.5 (9/28)
          const trunkX = 7.35 * colWidth;
          d = `M ${startX} ${startY} L ${trunkX} ${startY} L ${trunkX} ${endY} L ${endX} ${endY}`;
        } else if (endX >= startX + 12) {
          const midX = startX + (endX - startX) * 0.5;
          d = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
        } else {
          // Loop-back orthogonal connector (like sec-1 -> row-1-1, sec-2 -> row-2-1, sec-3 -> row-3-1)
          const rightStub = startX + 14;
          const midY = startY + (rowHeight * 0.5);
          const leftTurn = endX - 10;
          d = `M ${startX} ${startY} L ${rightStub} ${startY} L ${rightStub} ${midY} L ${leftTurn} ${midY} L ${leftTurn} ${endY} L ${endX} ${endY}`;
        }
      }

      return {
        id: edge.id,
        d,
        endX,
        endY,
        isCriticalEdge,
      };
    }).filter(Boolean) as Array<{
      id: string;
      d: string;
      endX: number;
      endY: number;
      isCriticalEdge: boolean;
    }>;
  }, [visibleRows, colWidth, rowHeight, lineType]);

  const getBarVisuals = (theme?: WbsRowItem['barTheme']) => {
    switch (theme) {
      case 'purple':
        return {
          track: 'bg-[var(--klic-component-block-color-selected)]/85  border border-blue-300/70',
          fill: 'bg-[var(--klic-component-block-color-accent)] ',
          badge: 'bg-black/15 text-zinc-900 ',
          text: 'text-zinc-900 ',
        };
      case 'gold':
        return {
          track: 'bg-[var(--klic-component-block-color-warning)]/90  border border-[color:var(--klic-component-block-color-warning)]/70',
          fill: 'bg-[var(--klic-component-block-color-warning)] ',
          badge: 'bg-black/15 text-zinc-900 ',
          text: 'text-zinc-900 ',
        };
      case 'coral':
        return {
          track: 'bg-[var(--klic-component-block-color-danger-surface)]/85  border border-blue-300/70',
          fill: 'bg-[var(--klic-component-block-color-danger)] ',
          badge: 'bg-black/15 text-zinc-900 ',
          text: 'text-zinc-900 ',
        };
      case 'mint':
        return {
          track: 'bg-[var(--klic-component-block-color-selected)]/90  border border-blue-300/70',
          fill: 'bg-[var(--klic-component-block-color-accent)] ',
          badge: 'bg-black/15 text-zinc-900 ',
          text: 'text-zinc-900 ',
        };
      case 'amber':
        return {
          track: 'bg-[var(--klic-component-block-color-warning)]  border border-amber-400/80',
          fill: 'bg-[var(--klic-component-block-color-warning)] ',
          badge: 'bg-black/15 text-zinc-900 ',
          text: 'text-zinc-900 ',
        };
      case 'beige':
        return {
          track: 'bg-[var(--klic-component-block-color-warning)]/90  border border-[color:var(--klic-component-block-color-warning)]/70',
          fill: 'bg-[var(--klic-component-block-color-warning)] ',
          badge: 'bg-black/15 text-zinc-900 ',
          text: 'text-zinc-900 ',
        };
      case 'slate':
        return {
          track: 'bg-[var(--klic-component-block-color-border)]/90  border border-zinc-300',
          fill: 'bg-[var(--klic-component-block-color-control-border)] ',
          badge: 'bg-black/15 text-zinc-900 ',
          text: 'text-zinc-900 ',
        };
      case 'rose':
        return {
          track: 'bg-[var(--klic-component-block-color-danger-surface)]/90  border border-blue-300/70',
          fill: 'bg-[var(--klic-component-block-color-danger)] ',
          badge: 'bg-black/15 text-zinc-900 ',
          text: 'text-zinc-900 ',
        };
      default:
        return {
          track: 'bg-zinc-200 ',
          fill: 'bg-zinc-400',
          badge: 'bg-black/15 text-zinc-900',
          text: 'text-zinc-900',
        };
    }
  };

  const handleQuickAssign = (rowId: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        if (r.assignees.length > 0) return r;
        return {
          ...r,
          assignees: [MEMBER_POOL.m4, MEMBER_POOL.m1],
        };
      })
    );
  };

  const handleAddWbsSection = () => {
    const nextSecNum = rows.filter((r) => r.isSection).length + 1;
    const newSecId = `sec-${Date.now()}`;
    const created: WbsRowItem = {
      id: newSecId,
      wbs: `${nextSecNum}`,
      isSection: true,
      title: `신규 단계 ${nextSecNum} · 안정화 점검`,
      startDateLabel: '10.14',
      durationDays: 7,
      progress: 15,
      assignees: [MEMBER_POOL.m1],
      startCol: 23,
      spanCols: 7,
      barTheme: 'purple',
      priority: '높음',
    };
    setExpandedSections((prev) => ({ ...prev, [newSecId]: true }));
    setRows((prev) => [...prev, created]);
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const parentSec = rows.find((r) => r.id === newTaskParent);
    const parentWbs = parentSec?.wbs || '3';
    const siblingCount = rows.filter((r) => r.parentId === newTaskParent).length;
    const wbsCode = `${parentWbs}.${siblingCount + 1}`;
    const dayObj = TIMELINE_DAYS[newTaskStartCol] || TIMELINE_DAYS[10];
    const startLabel = `${String(dayObj.month).padStart(2, '0')}.${String(dayObj.day).padStart(2, '0')}`;

    const newItem: WbsRowItem = {
      id: `row-custom-${Date.now()}`,
      wbs: wbsCode,
      parentId: newTaskParent,
      title: newTaskTitle.trim(),
      startDateLabel: startLabel,
      durationDays: newTaskDuration,
      progress: 30,
      assignees: [MEMBER_POOL.m2, MEMBER_POOL.m4],
      startCol: newTaskStartCol,
      spanCols: newTaskDuration,
      barTheme: 'mint',
      priority: '높음',
    };

    const insertIdx = rows.reduce(
      (lastIdx, item, idx) => (item.id === newTaskParent || item.parentId === newTaskParent ? idx : lastIdx),
      rows.length - 1
    );
    const updated = [...rows];
    updated.splice(insertIdx + 1, 0, newItem);
    setRows(updated);
    setNewTaskTitle('');
    setIsAddTaskOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* =====================================================================
          상단 KLIC 엔터프라이즈 쇼케이스 프리젠테이션 배너 ("이쁘게 포장")
         ===================================================================== */}
      <div className="rounded-2xl bg-klic-inverse text-klic-on-emphasis px-5 py-3.5 shadow-sm border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-bold tracking-wide">
            <Sparkles size={12} className="text-blue-400" />
            KLIC 메인 프로젝트 관리 엔진
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-klic-on-emphasis tracking-tight">
                차세대 데이터센터 인프라 구축 WBS · SVG 간트 워크스페이스
              </h2>
              <span className="text-[11px] font-mono text-klic-muted hidden sm:inline">
                KLIC/gantt-wbs-svg
              </span>
            </div>
            <p className="text-[11px] text-klic-muted/90 mt-0.5">
              좌측 계층형 WBS 코드·기간·진행률·담당자 프로필 팝오버와 우측 동적 SVG 의존성 커넥터(직각선·유선형·직선)가 실시간 동기화됩니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-klic-on-emphasis">
            <GitBranch size={13} className="text-blue-400" />
            <span>SVG 의존성 엣지:</span>
            <strong className="text-klic-on-emphasis font-semibold">
              {lineType === 'orthogonal' ? '직각선 (Orthogonal)' : lineType === 'curved' ? '유선형 (Bezier)' : '직선 (Direct)'}
            </strong>
          </div>
          <button
            onClick={() => setActivePopoverRowId(activePopoverRowId ? null : 'row-2-1')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              activePopoverRowId
                ? 'bg-blue-600 text-klic-on-emphasis border-blue-500 shadow-xs'
                : 'bg-white/10 text-klic-on-emphasis border-white/15 hover:bg-white/15'
            }`}
          >
            담당자 프로필 카드 {activePopoverRowId ? '열림' : '보기'}
          </button>
        </div>
      </div>

      {/* =====================================================================
          메인 KLIC WBS / SVG 간트 캔버스 (image_bed357b2.png 1:1 구현)
         ===================================================================== */}
      <div className="rounded-2xl border border-[color:var(--klic-component-block-color-soft)]  bg-white  shadow-sm overflow-hidden">
        {/* 1단 헤더: WBS / 간트 타이틀 + 우측 상태/KPI 캡슐 배지 바 */}
        <div className="px-5 py-3.5 border-b border-[color:var(--klic-component-block-color-soft)]  flex flex-wrap items-center justify-between gap-3 bg-white ">
          <div className="flex items-baseline gap-2.5">
            <h3 className="text-[18px] font-extrabold text-zinc-900  tracking-tight">
              WBS / 간트
            </h3>
            <span className="text-[12px] font-medium text-klic-muted ">
              WBS 계획 · SVG 간트
            </span>
          </div>

          {/* 우측 KPI 알약 배지 그룹 */}
          <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
            <button
              onClick={() => setShowLegend((v) => !v)}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border font-medium transition ${
                showLegend
                  ? 'border-blue-500 bg-blue-50 text-blue-700  '
                  : 'border-zinc-200  bg-white  text-klic-muted  hover:bg-zinc-50'
              }`}
            >
              <Info size={13} className="text-klic-muted " />
              <span>범례</span>
            </button>

            <span className="w-px h-4 bg-zinc-200  mx-1" />

            <span className="px-3 py-1 rounded-full bg-[var(--klic-component-block-color-soft)]  text-klic-muted  font-semibold">
              {rows.length}행
            </span>
            <span className="px-3 py-1 rounded-full bg-[var(--klic-component-block-color-soft)]  text-klic-muted  font-semibold">
              91일
            </span>
            <span className="px-3 py-1 rounded-full bg-[var(--klic-component-block-color-soft)]  text-[color:var(--klic-component-block-color-accent)]  font-bold">
              21% 진행률
            </span>
            <span className="px-3 py-1 rounded-full bg-[var(--klic-component-block-color-soft)]  text-[color:var(--klic-component-block-color-accent)]  font-bold">
              완료 1/13
            </span>
            <span className="px-3 py-1 rounded-full bg-[var(--klic-component-block-color-soft)]  text-[color:var(--klic-component-block-color-accent)]  font-bold">
              높은 우선순위 16
            </span>
            <button
              onClick={() => setHighlightCritical((v) => !v)}
              className={`px-3 py-1 rounded-full font-bold transition ${
                highlightCritical
                  ? 'bg-amber-500 text-klic-on-emphasis shadow-2xs'
                  : 'bg-[var(--klic-component-block-color-soft)]  text-[color:var(--klic-component-block-color-warning)]  hover:bg-amber-100'
              }`}
              title="클릭하여 임계경로(Critical Path) 강조 전환"
            >
              임계경로 {highlightCritical ? '4' : '0'}
            </button>
          </div>
        </div>

        {/* 범례 플로팅 바 (범례 버튼 클릭 시 노출) */}
        {showLegend && (
          <div className="px-5 py-2.5 bg-zinc-50  border-b border-[color:var(--klic-component-block-color-soft)]  flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-bold text-zinc-700 ">색상 범례:</span>
              <span className="inline-flex items-center gap-1.5 text-klic-muted ">
                <span className="w-3 h-3 rounded-xs bg-[var(--klic-component-block-color-accent)]" /> 1단계 요약 (보라)
              </span>
              <span className="inline-flex items-center gap-1.5 text-klic-muted ">
                <span className="w-3 h-3 rounded-xs bg-[var(--klic-component-block-color-warning)]" /> 실사·산정 (골드)
              </span>
              <span className="inline-flex items-center gap-1.5 text-klic-muted ">
                <span className="w-3 h-3 rounded-xs bg-[var(--klic-component-block-color-danger)]" /> 보안·기본설계 (코랄)
              </span>
              <span className="inline-flex items-center gap-1.5 text-klic-muted ">
                <span className="w-3 h-3 rounded-xs bg-[var(--klic-component-block-color-accent)]" /> 규격 검토 (블루)
              </span>
              <span className="inline-flex items-center gap-1.5 text-klic-muted ">
                <span className="w-3 h-3 rounded-xs bg-[var(--klic-component-block-color-warning)]" /> 100% 완료 (앰버)
              </span>
              <span className="inline-flex items-center gap-1.5 text-klic-muted ">
                <span className="w-0.5 h-3.5 border-l-2 border-dashed border-blue-500" /> 기준일(10/22)
              </span>
              <span className="inline-flex items-center gap-1.5 text-klic-muted ">
                <span className="w-3 h-3 bg-amber-100 border border-dashed border-amber-600" /> 검수 윈도우(10/23)
              </span>
            </div>
            <button
              onClick={() => setShowLegend(false)}
              className="text-klic-muted hover:text-klic-muted text-xs"
            >
              닫기 ✕
            </button>
          </div>
        )}

        {/* 2단 툴바: 일/주/월/분기 + 직각선/유선형/직선 + 검색 및 업무/섹션 추가 */}
        <div className="px-5 py-2.5 border-b border-[color:var(--klic-component-block-color-soft)]  bg-[var(--klic-component-block-color-panel)]  flex flex-wrap items-center justify-between gap-3">
          {/* 좌측 세그먼트 컨트롤 2종 */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 시간 단위 토글: 일 / 주 / 월 / 분기 */}
            <div className="inline-flex items-center p-1 rounded-xl border border-[color:var(--klic-component-block-color-soft)]  bg-white  shadow-2xs">
              {(['일', '주', '월', '분기'] as TimeScaleType[]).map((unit) => {
                const active = timeScale === unit;
                return (
                  <button
                    key={unit}
                    onClick={() => setTimeScale(unit)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      active
                        ? 'bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis shadow-2xs'
                        : 'text-klic-muted  hover:text-zinc-900 '
                    }`}
                  >
                    {unit}
                  </button>
                );
              })}
            </div>

            {/* SVG 의존성 연결선 스타일 토글: 직각선 / 유선형 / 직선 */}
            <div className="inline-flex items-center p-1 rounded-xl border border-[color:var(--klic-component-block-color-soft)]  bg-white  shadow-2xs">
              {(
                [
                  { id: 'orthogonal', label: '직각선' },
                  { id: 'curved', label: '유선형' },
                  { id: 'straight', label: '직선' },
                ] as Array<{ id: SvgLineType; label: string }>
              ).map((item) => {
                const active = lineType === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setLineType(item.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      active
                        ? 'bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis shadow-2xs'
                        : 'text-klic-muted  hover:text-zinc-900 '
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 우측 검색 및 액션 컨트롤 */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 필터 버튼 (1 배지) */}
            <button
              onClick={() => setHighlightCritical((v) => !v)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[color:var(--klic-component-block-color-soft)]  bg-white  text-xs font-semibold text-zinc-700  hover:bg-zinc-50 transition"
              title="필터 조건"
            >
              <SlidersHorizontal size={13} className="text-klic-muted" />
              <span className="px-1.5 py-0.2 rounded-full bg-blue-50  text-[color:var(--klic-component-block-color-accent)]  text-[11px] font-bold">
                1
              </span>
            </button>

            {/* 간트 검색 인풋 */}
            <div className="relative">
              <Search
                size={13}
                className="w-3.5 h-3.5 text-klic-muted absolute left-3 top-1/2 -translate-y-1/2"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="간트 검색"
                className="w-48 sm:w-56 pl-8 pr-3 py-1.5 rounded-xl border border-[color:var(--klic-component-block-color-soft)]  bg-white  text-xs text-zinc-800  placeholder:text-klic-muted focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* 포인트 도트 버튼 */}
            <button
              onClick={() => setHighlightCritical((v) => !v)}
              className="w-8 h-8 rounded-xl border border-[color:var(--klic-component-block-color-soft)]  bg-white  flex items-center justify-center hover:bg-zinc-50 transition"
              title="임계경로 포인트 표시"
            >
              <span className="w-3 h-3 rounded-full bg-blue-200  flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--klic-component-block-color-accent)]" />
              </span>
            </button>

            {/* + 업무 추가 */}
            <button
              onClick={() => setIsAddTaskOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[color:var(--klic-component-block-color-soft)]  bg-white  text-xs font-semibold text-zinc-700  hover:bg-zinc-50  transition shadow-2xs"
            >
              <Plus size={13} />
              <span>업무 추가</span>
            </button>

            {/* + 섹션 추가 */}
            <button
              onClick={handleAddWbsSection}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[color:var(--klic-component-block-color-soft)]  bg-white  text-xs font-semibold text-zinc-700  hover:bg-zinc-50  transition shadow-2xs"
            >
              <Plus size={13} />
              <span>섹션 추가</span>
            </button>

            {/* 더보기 ⋯ */}
            <button className="px-2.5 py-1.5 rounded-xl border border-[color:var(--klic-component-block-color-soft)]  bg-white  text-klic-muted hover:bg-zinc-50 transition">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>

        {/* 3단 메인 분할 영역: 좌측 WBS 테이블 + 우측 SVG 간트 타임라인 */}
        <div className="flex overflow-x-auto relative select-none">
          {/* ==================== 좌측 WBS 테이블 (고정 폭 560px) ==================== */}
          <div className="w-[560px] shrink-0 border-r border-[color:var(--klic-component-block-color-soft)]  bg-white  z-20">
            {/* 테이블 컬럼 헤더 (높이 42px) */}
            <div className="h-[42px] border-b border-[color:var(--klic-component-block-color-soft)]  bg-[var(--klic-component-block-color-panel)]  grid grid-cols-[24px_44px_1fr_68px_42px_46px_112px_34px] items-center px-2 text-[12px] font-bold text-klic-muted ">
              <span />
              <span className="text-center">WBS</span>
              <span className="pl-2">업무명</span>
              <span className="text-center">시작일</span>
              <span className="text-center">기간</span>
              <span className="text-center">진행률</span>
              <span className="text-center">담당자</span>
              <span />
            </div>

            {/* 테이블 바디 행 목록 */}
            <div className="divide-y divide-[var(--klic-component-block-color-soft)] ">
              {visibleRows.map((row) => {
                const isSec = Boolean(row.isSection);
                const isExp = expandedSections[row.id] ?? true;
                const isPopoverOpen = activePopoverRowId === row.id;

                return (
                  <div
                    key={row.id}
                    style={{ height: rowHeight }}
                    className={`grid grid-cols-[24px_44px_1fr_68px_42px_46px_112px_34px] items-center px-2 text-xs relative transition ${
                      isSec
                        ? 'bg-[var(--klic-component-block-color-soft)]/90 '
                        : 'bg-white  hover:bg-zinc-50/70 '
                    }`}
                  >
                    {/* 드래그 핸들 ⋮⋮ */}
                    <div className="flex justify-center text-klic-muted  cursor-grab">
                      <GripVertical size={13} />
                    </div>

                    {/* WBS 코드 */}
                    <div
                      className={`text-center font-bold ${
                        isSec
                          ? 'text-[color:var(--klic-component-block-color-accent)]  text-[13px]'
                          : 'text-zinc-700  text-[12px]'
                      }`}
                    >
                      {row.wbs}
                    </div>

                    {/* 업무명 */}
                    <div className="min-w-0 pr-2 flex items-center gap-1.5">
                      {isSec ? (
                        <button
                          onClick={() => toggleSection(row.id)}
                          className="flex items-center gap-1.5 min-w-0 text-left group"
                        >
                          <span className="w-5 h-5 rounded-full border border-blue-200  bg-white  flex items-center justify-center text-[color:var(--klic-component-block-color-accent)]  shrink-0 shadow-2xs">
                            {isExp ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          </span>
                          <span className="font-extrabold text-[13px] text-[color:var(--klic-component-block-color-accent)]  truncate">
                            {row.title}
                          </span>
                        </button>
                      ) : (
                        <span className="pl-5 font-bold text-zinc-800  truncate text-[12px]">
                          {row.title}
                        </span>
                      )}
                    </div>

                    {/* 시작일 */}
                    <div className="flex items-center justify-center gap-1 text-[12px] font-bold text-zinc-800  font-mono">
                      <Calendar size={12} className="text-klic-muted shrink-0" />
                      <span>{row.startDateLabel}</span>
                    </div>

                    {/* 기간 */}
                    <div className="text-center font-bold text-zinc-800  font-mono text-[12px]">
                      {row.durationDays}
                    </div>

                    {/* 진행률 */}
                    <div className="text-center font-bold text-zinc-800  font-mono text-[12px]">
                      {row.progress}
                    </div>

                    {/* 담당자 알약 버튼 & 클릭 시 담당자 프로필 팝오버 */}
                    <div className="flex justify-center relative">
                      {row.assignees.length > 0 ? (
                        <button
                          onClick={() =>
                            setActivePopoverRowId(isPopoverOpen ? null : row.id)
                          }
                          className={`w-[98px] h-[28px] rounded-full border flex items-center justify-center -space-x-1.5 px-2 transition ${
                            isPopoverOpen
                              ? 'border-[color:var(--klic-component-block-color-accent)] ring-2 ring-blue-500/20 bg-blue-50/40 '
                              : 'border-[color:var(--klic-component-block-color-soft)]  bg-white  hover:border-blue-400'
                          }`}
                          title="클릭하여 담당자 프로필 보기"
                        >
                          {row.assignees.map((a) => (
                            <PersonAvatar
                              key={a.id}
                              src={a.avatar}
                              alt={a.name}
                              className="w-5 h-5 rounded-full object-cover ring-1 ring-white "
                            />
                          ))}
                          {row.extraAssigneeCount && (
                            <span className="w-5 h-5 rounded-full bg-blue-50  text-[color:var(--klic-component-block-color-accent)]  text-[10px] font-extrabold flex items-center justify-center ring-1 ring-white">
                              +{row.extraAssigneeCount}
                            </span>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleQuickAssign(row.id)}
                          className="w-[98px] h-[28px] rounded-full border border-[color:var(--klic-component-block-color-soft)]  bg-[var(--klic-component-block-color-panel)]  hover:bg-blue-50/50 hover:border-blue-300 text-klic-muted flex items-center justify-center text-xs font-bold transition"
                          title="담당자 배정 추가"
                        >
                          +
                        </button>
                      )}

                      {/* 스크린샷과 100% 동일한 '담당자 프로필' 플로팅 팝오버 카드 */}
                      {isPopoverOpen && row.assignees.length > 0 && (
                        <div className="absolute right-0 top-[34px] z-50 w-[256px] rounded-2xl border border-[color:var(--klic-component-block-color-soft)]  bg-white  shadow-xl p-4 text-left animate-in fade-in duration-150">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[13px] font-extrabold text-zinc-900 ">
                              담당자 프로필
                            </span>
                            <span className="text-[11px] font-semibold text-klic-muted">
                              담당자 {row.assignees.length}명
                            </span>
                          </div>
                          <div className="space-y-3">
                            {row.assignees.map((person) => (
                              <div key={person.id} className="flex items-center gap-3">
                                <PersonAvatar
                                  src={person.avatar}
                                  alt={person.name}
                                  className="w-9 h-9 rounded-full object-cover border border-zinc-200  shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="text-[13px] font-extrabold text-zinc-900  truncate">
                                    {person.name}
                                  </p>
                                  <p className="text-[11px] font-medium text-klic-muted">
                                    {person.status}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 행 우측 더보기 ⋯ */}
                    <div className="flex justify-center">
                      <button className="w-6 h-6 rounded-full border border-[color:var(--klic-component-block-color-soft)]  bg-white  flex items-center justify-center text-klic-muted hover:text-zinc-700">
                        <MoreHorizontal size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ==================== 우측 SVG 간트 타임라인 캔버스 ==================== */}
          <div className="flex-1 min-w-0 overflow-x-auto bg-white ">
            <div
              style={{ width: TIMELINE_DAYS.length * colWidth }}
              className="relative"
            >
              {/* 타임라인 일자 헤더 (9/21 ~ 10/26) */}
              <div className="h-[42px] border-b border-[color:var(--klic-component-block-color-soft)]  bg-[var(--klic-component-block-color-panel)]  flex items-center">
                {TIMELINE_DAYS.map((d) => (
                  <div
                    key={d.index}
                    style={{ width: colWidth }}
                    className={`h-full shrink-0 border-r border-[color:var(--klic-component-block-color-soft)]  flex items-center justify-center text-[11px] font-semibold ${
                      d.index === 32
                        ? 'bg-amber-50/70  text-amber-800 '
                        : 'text-klic-muted '
                    }`}
                  >
                    {d.label}
                  </div>
                ))}
              </div>

              {/* 타임라인 바디 그리드 + SVG 커넥터 + 막대 바 */}
              <div
                style={{ height: visibleRows.length * rowHeight }}
                className="relative"
              >
                {/* 1) 배경 수직 그리드 컬럼 & 우측 기준선 (10/22 블루 점선, 10/23 앰버 해칭 밴드) */}
                <div className="absolute inset-0 flex pointer-events-none">
                  {TIMELINE_DAYS.map((d) => (
                    <div
                      key={d.index}
                      style={{ width: colWidth }}
                      className={`h-full shrink-0 border-r border-[color:var(--klic-component-block-color-soft)]  ${
                        d.index === 32
                          ? 'bg-[var(--klic-component-block-color-soft)]/80 '
                          : ''
                      }`}
                    />
                  ))}
                </div>

                {/* 수평 행 구분선 */}
                <div className="absolute inset-0 pointer-events-none">
                  {visibleRows.map((r, idx) => (
                    <div
                      key={r.id}
                      style={{ top: idx * rowHeight, height: rowHeight }}
                      className={`w-full border-b border-[color:var(--klic-component-block-color-soft)]  ${
                        r.isSection ? 'bg-[var(--klic-component-block-color-panel)]/55 ' : ''
                      }`}
                    />
                  ))}
                </div>

                {/* 수직 점선 기준선 2개 (10/22 블루 점선 & 10/23 브라운/앰버 점선) */}
                <div
                  style={{ left: 31 * colWidth + colWidth * 0.65 }}
                  className="absolute top-0 bottom-0 border-l-2 border-dashed border-[color:var(--klic-component-block-color-accent)] z-10 pointer-events-none"
                />
                <div
                  style={{ left: 32 * colWidth + colWidth * 0.55 }}
                  className="absolute top-0 bottom-0 border-l-2 border-dashed border-[color:var(--klic-component-block-color-warning)] z-10 pointer-events-none"
                />

                {/* 2) SVG 의존성 연결선 레이어 (직각선 / 유선형 / 직선 실시간 전환) */}
                <svg
                  width={TIMELINE_DAYS.length * colWidth}
                  height={visibleRows.length * rowHeight}
                  className="absolute inset-0 pointer-events-none z-10 overflow-visible"
                >
                  <defs>
                    <marker
                      id="flux-wbs-arrow"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--klic-component-block-color-control-border)" />
                    </marker>
                    <marker
                      id="flux-wbs-arrow-critical"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6.5"
                      markerHeight="6.5"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--klic-component-block-color-warning)" />
                    </marker>
                  </defs>

                  {svgConnectors.map((conn) => {
                    const isHighlighted = highlightCritical && conn.isCriticalEdge;
                    return (
                      <path
                        key={conn.id}
                        d={conn.d}
                        fill="none"
                        stroke={isHighlighted ? 'var(--klic-component-block-color-warning)' : 'var(--klic-component-block-color-control-border)'}
                        strokeWidth={isHighlighted ? 2.2 : 1.35}
                        markerEnd={
                          isHighlighted
                            ? 'url(#flux-wbs-arrow-critical)'
                            : 'url(#flux-wbs-arrow)'
                        }
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </svg>

                {/* 3) WBS 막대 바 레이어 */}
                {visibleRows.map((row, rowIdx) => {
                  if (row.startCol === undefined || row.spanCols === undefined) {
                    return null;
                  }
                  const left = row.startCol * colWidth + 2;
                  const width = row.spanCols * colWidth - 4;
                  const top = rowIdx * rowHeight + (rowHeight - 28) / 2;
                  const styles = getBarVisuals(row.barTheme);
                  const isCritHighlight = highlightCritical && row.isCritical;

                  return (
                    <div
                      key={row.id}
                      style={{ left, top, width, height: 28 }}
                      className={`absolute rounded-lg ${styles.track} ${
                        isCritHighlight ? 'ring-2 ring-amber-500 shadow-md' : 'shadow-2xs'
                      } overflow-hidden flex items-center justify-between px-1.5 z-20 group cursor-pointer transition-transform hover:scale-[1.01]`}
                    >
                      {/* 진행률 채움 영역 */}
                      {row.progress > 0 && (
                        <div
                          style={{ width: `${row.progress}%` }}
                          className={`absolute left-0 top-0 bottom-0 ${styles.fill} transition-all`}
                        />
                      )}

                      {/* 좌측: 진행률 캡슐 배지 + 업무명 */}
                      <div className="relative z-10 flex items-center gap-1.5 min-w-0 pr-1">
                        {row.progress > 0 && (
                          <span
                            className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold leading-none shrink-0 ${styles.badge}`}
                          >
                            {row.progress}%
                          </span>
                        )}
                        <span
                          className={`text-[11px] font-extrabold truncate ${styles.text} ${
                            row.progress === 0 ? 'pl-1.5' : ''
                          }`}
                        >
                          {row.title}
                        </span>
                      </div>

                      {/* 우측: 담당자 원형 아바타 클러스터 */}
                      {row.assignees.length > 0 && (
                        <div className="relative z-10 flex items-center -space-x-1 shrink-0">
                          {row.assignees.map((av) => (
                            <PersonAvatar
                              key={av.id}
                              src={av.avatar}
                              alt={av.name}
                              className="w-5 h-5 rounded-full object-cover ring-1 ring-white/90 shadow-2xs"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          + 업무 추가 모달
         ===================================================================== */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 z-50 bg-klic-inverse/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white  border border-zinc-200  shadow-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 ">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-[color:var(--klic-component-block-color-accent)]" />
                <h4 className="font-bold text-sm text-zinc-900 ">
                  신규 WBS 업무 추가
                </h4>
              </div>
              <button
                onClick={() => setIsAddTaskOpen(false)}
                className="p-1 text-klic-muted hover:text-zinc-700"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddTaskSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700  mb-1">
                  소속 WBS 섹션
                </label>
                <select
                  value={newTaskParent}
                  onChange={(e) => setNewTaskParent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200  bg-white  text-zinc-800 "
                >
                  {rows
                    .filter((r) => r.isSection)
                    .map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.wbs}. {sec.title}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700  mb-1">
                  업무명
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="예: 방화벽 정책 이관 및 이중화 절체 테스트"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200  bg-white  text-zinc-800 "
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700  mb-1">
                    시작일
                  </label>
                  <select
                    value={newTaskStartCol}
                    onChange={(e) => setNewTaskStartCol(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200  bg-white "
                  >
                    {TIMELINE_DAYS.slice(0, 28).map((d) => (
                      <option key={d.index} value={d.index}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700  mb-1">
                    기간 (일)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200  bg-white "
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-zinc-200  text-klic-muted  font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis font-bold hover:bg-blue-700 transition"
                >
                  WBS 업무 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
