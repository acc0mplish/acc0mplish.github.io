import { PersonAvatar } from '../PersonAvatar';
import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  AlertTriangle,
  Flame,
  GitPullRequest,
  Layers,
  Building2,
  ShieldAlert,
  Briefcase,
  CheckSquare,
  Calendar,
  Terminal,
  Zap,
  Tag,
  BarChart2,
  MessageSquare,
  UserPlus,
  LayoutGrid,
  List,
  Check,
  X,
} from 'lucide-react';
import { TaskLifecycleBlock } from './TaskLifecycleBlock';

export type KanbanMode =
  | 'lifecycle'
  | 'issue-tracker'
  | 'sprint'
  | 'swimlane'
  | 'crm'
  | 'incident'
  | 'hiring';

interface KanbanBoardBlockProps {
  initialMode?: KanbanMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

/* ============================================================================
 * 공통: 프로필 아바타 풀 & 안전한 이미지 아바타 컴포넌트
 * ========================================================================== */
const AVATAR_POOL = {
  leila: './placeholders/avatar-576a55580552.svg',
  aiden: './placeholders/avatar-d36430bc2634.svg',
  jonah: './placeholders/avatar-352373979408.svg',
  kira: './placeholders/avatar-ef94a3ac14b1.svg',
  kris: './placeholders/avatar-d81ac24457b6.svg',
  marcus: './placeholders/avatar-b26d2e28f816.svg',
  elena: './placeholders/avatar-c6cee086c134.svg',
  devon: './placeholders/avatar-f0911aecec62.svg',
  chloe: './placeholders/avatar-8c2580aea9a4.svg',
  lucas: './placeholders/avatar-932f878a6ef4.svg',
  hanna: './placeholders/avatar-acee4a0e6577.svg',
  noah: './placeholders/avatar-98c120807312.svg',
};

const TEAM_AVATAR_ROSTER = [
  { id: 'm1', name: '이하은', avatar: AVATAR_POOL.leila },
  { id: 'm2', name: '박준영', avatar: AVATAR_POOL.aiden },
  { id: 'm3', name: '정유진', avatar: AVATAR_POOL.kira },
  { id: 'm4', name: '최수빈', avatar: AVATAR_POOL.kris },
  { id: 'm5', name: '강태우', avatar: AVATAR_POOL.jonah },
  { id: 'm6', name: '윤도원', avatar: AVATAR_POOL.marcus },
  { id: 'm7', name: '오민재', avatar: AVATAR_POOL.lucas },
  { id: 'm8', name: '송하린', avatar: AVATAR_POOL.elena },
  { id: 'm9', name: '임성진', avatar: AVATAR_POOL.devon },
  { id: 'm10', name: '한소윤', avatar: AVATAR_POOL.chloe },
  { id: 'm11', name: '문채린', avatar: AVATAR_POOL.hanna },
  { id: 'm12', name: '서강윤', avatar: AVATAR_POOL.noah },
];

const ProfileAvatar: React.FC<{
  src?: string;
  name: string;
  sizeClass?: string;
  unassigned?: boolean;
}> = ({ src, name, sizeClass = 'w-6 h-6', unassigned = false }) => {
  const [imgErr, setImgErr] = useState(false);

  if (unassigned || !src || imgErr) {
    return (
      <span
        title={unassigned ? '미배정 (Unassigned)' : name}
        className={`${sizeClass} rounded-full border border-dashed border-zinc-400  bg-zinc-50  inline-flex items-center justify-center text-klic-muted  shrink-0`}
      >
        <UserPlus className="w-3 h-3" />
      </span>
    );
  }

  return (
    <PersonAvatar
      src={src}
      alt={name}
      title={name}
      onError={() => setImgErr(true)}
      className={`${sizeClass} rounded-full object-cover ring-1 ring-zinc-200/90  shrink-0`}
    />
  );
};

/* ============================================================================
 * 0. 프로덕트 이슈 보드 (첨부 이미지 Linear 스타일, KLIC/kanban-linear)
 * ========================================================================== */
type LinearColId = 'backlog' | 'todo' | 'in-progress' | 'in-review';
type LinearPriority = 'urgent' | 'high' | 'medium' | 'low' | 'none';
type LinearLabelType =
  | '안드로이드'
  | '기능'
  | '리서치'
  | '개선'
  | '성능'
  | '디자인'
  | '버그';

interface LinearIssueCard {
  id: string;
  code: string;
  title: string;
  colId: LinearColId;
  dueDate?: string;
  assigneeName: string;
  assigneeAvatar?: string;
  unassigned?: boolean;
  priority: LinearPriority;
  label: LinearLabelType;
  extraTagsCount?: number;
  subtasksDone?: number;
  subtasksTotal?: number;
  commentsCount?: number;
}

const LINEAR_LABEL_STYLES: Record<
  LinearLabelType,
  { dot: string; pill: string }
> = {
  안드로이드: {
    dot: 'bg-blue-500',
    pill: 'bg-blue-50/90  text-zinc-700  border-blue-200/80 ',
  },
  기능: {
    dot: 'bg-blue-500',
    pill: 'bg-blue-50/90  text-zinc-700  border-blue-200/80 ',
  },
  리서치: {
    dot: 'bg-blue-500',
    pill: 'bg-blue-50/90  text-zinc-700  border-blue-200/80 ',
  },
  개선: {
    dot: 'bg-blue-500',
    pill: 'bg-blue-50/90  text-zinc-700  border-blue-200/80 ',
  },
  성능: {
    dot: 'bg-amber-500',
    pill: 'bg-amber-50/90  text-zinc-700  border-amber-200/80 ',
  },
  디자인: {
    dot: 'bg-blue-500',
    pill: 'bg-blue-50/90  text-zinc-700  border-blue-200/80 ',
  },
  버그: {
    dot: 'bg-blue-500',
    pill: 'bg-blue-50/90  text-zinc-700  border-blue-200/80 ',
  },
};

const INITIAL_LINEAR_ISSUES: LinearIssueCard[] = [
  // Backlog (5)
  {
    id: 'lan-187',
    code: 'LAN-187',
    title: 'Android 15 예측형 뒤로가기 제스처 지원',
    colId: 'backlog',
    assigneeName: '강태우',
    assigneeAvatar: AVATAR_POOL.jonah,
    priority: 'medium',
    label: '안드로이드',
    extraTagsCount: 1,
  },
  {
    id: 'lan-192',
    code: 'LAN-192',
    title: '이번 달 전력 사용량을 작년 동월 데이터와 비교',
    colId: 'backlog',
    assigneeName: '미배정',
    unassigned: true,
    priority: 'none',
    label: '기능',
  },
  {
    id: 'lan-196',
    code: 'LAN-196',
    dueDate: '10월 26일',
    title: '피크 시간대 요금 경보에 대한 5개 가구 심층 인터뷰',
    colId: 'backlog',
    assigneeName: '박준영',
    assigneeAvatar: AVATAR_POOL.aiden,
    priority: 'medium',
    label: '리서치',
  },
  {
    id: 'lan-201',
    code: 'LAN-201',
    title: '시간대별 바 차트 스크린리더 접근성 라벨 적용',
    colId: 'backlog',
    assigneeName: '이하은',
    assigneeAvatar: AVATAR_POOL.leila,
    priority: 'medium',
    label: '개선',
  },
  {
    id: 'lan-204',
    code: 'LAN-204',
    dueDate: '10월 29일',
    title: '스마트 미터 펌웨어 v3.2 원격 OTA 롤아웃 알림',
    colId: 'backlog',
    assigneeName: '송하린',
    assigneeAvatar: AVATAR_POOL.elena,
    priority: 'low',
    label: '기능',
  },

  // Todo (6)
  {
    id: 'lan-232',
    code: 'LAN-232',
    dueDate: '10월 16일',
    title: '가구 구성원 공유: 초대 링크로 가족 멤버 추가',
    colId: 'todo',
    assigneeName: '이하은',
    assigneeAvatar: AVATAR_POOL.leila,
    priority: 'high',
    label: '기능',
    subtasksDone: 0,
    subtasksTotal: 3,
    commentsCount: 1,
  },
  {
    id: 'lan-228',
    code: 'LAN-228',
    dueDate: '10월 14일',
    title: '400개 공급사 로드 시 요금제 피커 검색 속도 저하 개선',
    colId: 'todo',
    assigneeName: '박준영',
    assigneeAvatar: AVATAR_POOL.aiden,
    priority: 'medium',
    label: '성능',
  },
  {
    id: 'lan-224',
    code: 'LAN-224',
    dueDate: '10월 18일',
    title: '전력 사용량 차트 다크 모드 전용 컬러 팔레트 적용',
    colId: 'todo',
    assigneeName: '오민재',
    assigneeAvatar: AVATAR_POOL.lucas,
    priority: 'medium',
    label: '디자인',
    extraTagsCount: 1,
  },
  {
    id: 'lan-219',
    code: 'LAN-219',
    dueDate: '10월 12일',
    title: '타임존 변경 후 위젯에 이전 검침값이 남아있는 현상 수정',
    colId: 'todo',
    assigneeName: '윤도원',
    assigneeAvatar: AVATAR_POOL.marcus,
    priority: 'medium',
    label: '버그',
    extraTagsCount: 1,
    commentsCount: 1,
  },
  {
    id: 'lan-215',
    code: 'LAN-215',
    dueDate: '10월 19일',
    title: '월간 정산 명세서 이메일 템플릿 다국어 통화 포맷 대응',
    colId: 'todo',
    assigneeName: '한소윤',
    assigneeAvatar: AVATAR_POOL.chloe,
    priority: 'medium',
    label: '개선',
    subtasksDone: 0,
    subtasksTotal: 2,
  },
  {
    id: 'lan-210',
    code: 'LAN-210',
    dueDate: '10월 21일',
    title: '태양광 잉여 전력 정산 그래프 호버 툴팁 오차 보정',
    colId: 'todo',
    assigneeName: '임성진',
    assigneeAvatar: AVATAR_POOL.devon,
    priority: 'low',
    label: '버그',
  },

  // In progress (6)
  {
    id: 'lan-214',
    code: 'LAN-214',
    dueDate: '내일',
    title: 'iOS 18에서 푸시 알림 클릭 시 앱 크래시 발생 수정',
    colId: 'in-progress',
    assigneeName: '윤도원',
    assigneeAvatar: AVATAR_POOL.marcus,
    priority: 'urgent',
    label: '버그',
    extraTagsCount: 1,
    subtasksDone: 2,
    subtasksTotal: 3,
    commentsCount: 3,
  },
  {
    id: 'lan-221',
    code: 'LAN-221',
    dueDate: '10월 13일',
    title: '홈 화면 실시간 전력 사용량 라이브 위젯 구현',
    colId: 'in-progress',
    assigneeName: '이하은',
    assigneeAvatar: AVATAR_POOL.leila,
    priority: 'high',
    label: '기능',
    extraTagsCount: 1,
    subtasksDone: 2,
    subtasksTotal: 4,
    commentsCount: 2,
  },
  {
    id: 'lan-208',
    code: 'LAN-208',
    dueDate: '10월 11일',
    title: '사용량 차트: 일간·주간·월간 단위 전환 인터랙션',
    colId: 'in-progress',
    assigneeName: '박준영',
    assigneeAvatar: AVATAR_POOL.aiden,
    priority: 'medium',
    label: '기능',
    subtasksDone: 1,
    subtasksTotal: 2,
    commentsCount: 1,
  },
  {
    id: 'lan-226',
    code: 'LAN-226',
    dueDate: '10월 9일',
    title: '온보딩 2단계: 스마트 미터 연동 건너뛰기 버튼 추가',
    colId: 'in-progress',
    assigneeName: '최수빈',
    assigneeAvatar: AVATAR_POOL.kris,
    priority: 'medium',
    label: '디자인',
    subtasksDone: 1,
    subtasksTotal: 2,
    commentsCount: 1,
  },
  {
    id: 'lan-218',
    code: 'LAN-218',
    dueDate: '10월 15일',
    title: '심야 할인 시간대 전기차(EV) 자동 충전 스케줄러 연동',
    colId: 'in-progress',
    assigneeName: '서강윤',
    assigneeAvatar: AVATAR_POOL.noah,
    priority: 'high',
    label: '기능',
    subtasksDone: 3,
    subtasksTotal: 4,
    commentsCount: 2,
  },
  {
    id: 'lan-212',
    code: 'LAN-212',
    dueDate: '10월 17일',
    title: '고대비 모드에서 차트 범례 텍스트 잘림 현상 해결',
    colId: 'in-progress',
    assigneeName: '문채린',
    assigneeAvatar: AVATAR_POOL.hanna,
    priority: 'low',
    label: '개선',
  },

  // In review (4)
  {
    id: 'lan-203',
    code: 'LAN-203',
    dueDate: '10월 10일',
    title: '전력 사용량 내역을 CSV 및 PDF 포맷으로 내보내기',
    colId: 'in-review',
    assigneeName: '정유진',
    assigneeAvatar: AVATAR_POOL.kira,
    priority: 'medium',
    label: '기능',
    subtasksDone: 3,
    subtasksTotal: 3,
    commentsCount: 2,
  },
  {
    id: 'lan-211',
    code: 'LAN-211',
    dueDate: '10월 12일',
    title: '안드로이드 앱 콜드 스타트 시간을 1.5초 이하로 단축',
    colId: 'in-review',
    assigneeName: '강태우',
    assigneeAvatar: AVATAR_POOL.jonah,
    priority: 'high',
    label: '성능',
    extraTagsCount: 1,
    subtasksDone: 3,
    subtasksTotal: 4,
    commentsCount: 4,
  },
  {
    id: 'lan-217',
    code: 'LAN-217',
    title: '스마트 미터 미설치 가구를 위한 빈 상태(Empty state) 화면',
    colId: 'in-review',
    assigneeName: '송하린',
    assigneeAvatar: AVATAR_POOL.elena,
    priority: 'medium',
    label: '디자인',
  },
  {
    id: 'lan-205',
    code: 'LAN-205',
    dueDate: '내일',
    title: '아일랜드 지역 청구서 PDF의 부가가치세(VAT) 세율 표기 오류',
    colId: 'in-review',
    assigneeName: '임성진',
    assigneeAvatar: AVATAR_POOL.devon,
    priority: 'high',
    label: '버그',
  },
];

/* 첨부 이미지 스타일 전용 아이콘: 컬럼 상태 아이콘 */
const LinearColumnStatusIcon: React.FC<{ colId: LinearColId }> = ({ colId }) => {
  if (colId === 'backlog') {
    return (
      <svg className="w-4 h-4 text-klic-muted" viewBox="0 0 16 16" fill="none">
        <circle
          cx="8"
          cy="8"
          r="6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeDasharray="2.2 2.2"
        />
      </svg>
    );
  }
  if (colId === 'todo') {
    return (
      <svg className="w-4 h-4 text-klic-muted " viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (colId === 'in-progress') {
    return (
      <svg className="w-4 h-4 text-amber-500" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 4a4 4 0 0 1 0 8V4Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-blue-600 " viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 3.5a4.5 4.5 0 1 1-3.897 6.75L8 8V3.5Z"
        fill="currentColor"
      />
    </svg>
  );
};

/* 첨부 이미지 스타일 전용 아이콘: 카드 좌측 하단 우선순위 배지 */
const LinearPriorityBadge: React.FC<{ priority: LinearPriority }> = ({ priority }) => {
  if (priority === 'urgent') {
    return (
      <span
        title="긴급"
        className="w-6 h-6 rounded-md border border-zinc-200  bg-white  inline-flex items-center justify-center shrink-0"
      >
        <span className="w-3.5 h-3.5 rounded-[3px] bg-red-600 text-klic-on-emphasis font-bold text-[10px] inline-flex items-center justify-center leading-none">
          !
        </span>
      </span>
    );
  }
  if (priority === 'none') {
    return (
      <span
        title="우선순위 없음"
        className="w-6 h-6 rounded-md border border-zinc-200  bg-white  inline-flex items-center justify-center text-klic-muted shrink-0"
      >
        <span className="text-[11px] font-bold tracking-tighter leading-none">···</span>
      </span>
    );
  }

  const activeBars = priority === 'high' ? 3 : priority === 'medium' ? 2 : 1;
  return (
    <span
      title={`우선순위: ${priority === 'high' ? '높음' : priority === 'medium' ? '보통' : '낮음'}`}
      className="w-6 h-6 rounded-md border border-zinc-200  bg-white  inline-flex items-end justify-center gap-[2px] pb-[5px] shrink-0"
    >
      <span
        className={`w-[2.5px] h-[5px] rounded-[1px] ${
          activeBars >= 1 ? 'bg-klic-inverse ' : 'bg-zinc-300 '
        }`}
      />
      <span
        className={`w-[2.5px] h-[8px] rounded-[1px] ${
          activeBars >= 2 ? 'bg-klic-inverse ' : 'bg-zinc-300 '
        }`}
      />
      <span
        className={`w-[2.5px] h-[11px] rounded-[1px] ${
          activeBars >= 3 ? 'bg-klic-inverse ' : 'bg-zinc-300 '
        }`}
      />
    </span>
  );
};

/* 첨부 이미지 스타일 전용 아이콘: 서브태스크 원형 파이 진행률 */
const SubtaskProgressPie: React.FC<{ done: number; total: number }> = ({ done, total }) => {
  const ratio = total > 0 ? done / total : 0;
  const strokeColor = ratio > 0 ? 'var(--klic-component-block-color-accent)' : 'var(--klic-component-block-color-control-border)';
  const r = 5.5;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - ratio);

  return (
    <span className="inline-flex items-center gap-1 text-xs text-klic-muted  tabular-nums">
      <svg className="w-3.5 h-3.5 -rotate-90" viewBox="0 0 16 16">
        <circle
          cx="8"
          cy="8"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="text-klic-muted "
        />
        {ratio > 0 && (
          <circle
            cx="8"
            cy="8"
            r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        )}
      </svg>
      <span>
        {done}/{total}
      </span>
    </span>
  );
};

/* ============================================================================
 * 1. 애자일 스프린트 칸반 보드 (KLIC/kanban-1) 데이터 타입 및 초기값
 * ========================================================================== */
type SprintColumnId = 'backlog' | 'in-progress' | 'code-review' | 'qa-verify' | 'done';

interface SprintTaskCard {
  id: string;
  key: string;
  title: string;
  columnId: SprintColumnId;
  priority: '긴급' | '높음' | '보통' | '낮음';
  storyPoints: number;
  tag: string;
  tagColor: string;
  assigneeName: string;
  assigneeAvatar: string;
  prNumber?: string;
  prStatus?: '검토 중' | '승인됨' | 'CI 통과';
  subtasksDone: number;
  subtasksTotal: number;
  comments: number;
  dueDate: string;
}

const SPRINT_COLUMNS: {
  id: SprintColumnId;
  title: string;
  wipLimit?: number;
  dotClass: string;
}[] = [
  { id: 'backlog', title: '백로그', wipLimit: 6, dotClass: 'bg-zinc-400' },
  { id: 'in-progress', title: '진행 중', wipLimit: 3, dotClass: 'bg-blue-500' },
  { id: 'code-review', title: '코드 리뷰', wipLimit: 3, dotClass: 'bg-blue-500' },
  { id: 'qa-verify', title: 'QA 검증', wipLimit: 3, dotClass: 'bg-amber-500' },
  { id: 'done', title: '완료', dotClass: 'bg-blue-500' },
];

const INITIAL_SPRINT_CARDS: SprintTaskCard[] = [
  {
    id: 'sp-1',
    key: 'FLX-402',
    title: '다중 테넌트 SSO SAML 2.0 어설션 서명 검증 모듈 고도화',
    columnId: 'backlog',
    priority: '높음',
    storyPoints: 5,
    tag: '보안/인증',
    tagColor: 'bg-blue-500/10 text-blue-600  border-blue-500/20',
    assigneeName: '윤도원',
    assigneeAvatar: AVATAR_POOL.marcus,
    subtasksDone: 1,
    subtasksTotal: 4,
    comments: 4,
    dueDate: '4월 18일',
  },
  {
    id: 'sp-2',
    key: 'FLX-405',
    title: '대용량 원장 CSV 스트리밍 내보내기 웹 워커 분리',
    columnId: 'backlog',
    priority: '보통',
    storyPoints: 3,
    tag: '코어 성능',
    tagColor: 'bg-blue-500/10 text-blue-600  border-blue-500/20',
    assigneeName: '오민재',
    assigneeAvatar: AVATAR_POOL.lucas,
    subtasksDone: 0,
    subtasksTotal: 3,
    comments: 2,
    dueDate: '4월 21일',
  },
  {
    id: 'sp-3',
    key: 'FLX-408',
    title: '웹훅 발송 실패 시 데드레터 큐(DLQ) 수동 리플레이 UI',
    columnId: 'backlog',
    priority: '낮음',
    storyPoints: 2,
    tag: 'API 연동',
    tagColor: 'bg-blue-500/10 text-blue-600  border-blue-500/20',
    assigneeName: '강태우',
    assigneeAvatar: AVATAR_POOL.jonah,
    subtasksDone: 0,
    subtasksTotal: 2,
    comments: 1,
    dueDate: '4월 24일',
  },
  {
    id: 'sp-4',
    key: 'FLX-391',
    title: '실시간 정산 원장 락 경합 완화 및 낙관적 동시성 제어',
    columnId: 'in-progress',
    priority: '긴급',
    storyPoints: 8,
    tag: '결제 원장',
    tagColor: 'bg-blue-500/10 text-blue-600  border-blue-500/20',
    assigneeName: '박준영',
    assigneeAvatar: AVATAR_POOL.aiden,
    prNumber: 'PR var(--klic-component-block-color-warning)',
    prStatus: 'CI 통과',
    subtasksDone: 4,
    subtasksTotal: 6,
    comments: 9,
    dueDate: '오늘 마감',
  },
  {
    id: 'sp-5',
    key: 'FLX-394',
    title: 'KLIC 데이터 그리드 가상 스크롤 버퍼링 60fps 최적화',
    columnId: 'in-progress',
    priority: '높음',
    storyPoints: 5,
    tag: '디자인 시스템',
    tagColor: 'bg-blue-500/10 text-blue-600  border-blue-500/20',
    assigneeName: '오민재',
    assigneeAvatar: AVATAR_POOL.lucas,
    prNumber: 'PR var(--klic-component-block-color-accent)',
    prStatus: '검토 중',
    subtasksDone: 3,
    subtasksTotal: 5,
    comments: 5,
    dueDate: '4월 15일',
  },
  {
    id: 'sp-6',
    key: 'FLX-397',
    title: '조직별 API 호출 쿼터 초과 시 429 Retry-After 헤더 정밀화',
    columnId: 'in-progress',
    priority: '보통',
    storyPoints: 3,
    tag: 'API 연동',
    tagColor: 'bg-blue-500/10 text-blue-600  border-blue-500/20',
    assigneeName: '강태우',
    assigneeAvatar: AVATAR_POOL.jonah,
    subtasksDone: 2,
    subtasksTotal: 3,
    comments: 3,
    dueDate: '4월 16일',
  },
  {
    id: 'sp-7',
    key: 'FLX-388',
    title: '엔터프라이즈 감사 로그(Audit Log) 불변 스토리지 아카이빙',
    columnId: 'code-review',
    priority: '긴급',
    storyPoints: 5,
    tag: '보안/인증',
    tagColor: 'bg-blue-500/10 text-blue-600  border-blue-500/20',
    assigneeName: '윤도원',
    assigneeAvatar: AVATAR_POOL.marcus,
    prNumber: 'PR var(--klic-component-block-color-accent)',
    prStatus: '승인됨',
    subtasksDone: 5,
    subtasksTotal: 5,
    comments: 11,
    dueDate: '4월 14일',
  },
  {
    id: 'sp-8',
    key: 'FLX-390',
    title: '역할 기반 접근 제어(RBAC) 커스텀 정책 JSON 스키마 검증기',
    columnId: 'code-review',
    priority: '높음',
    storyPoints: 3,
    tag: '보안/인증',
    tagColor: 'bg-blue-500/10 text-blue-600  border-blue-500/20',
    assigneeName: '이하은',
    assigneeAvatar: AVATAR_POOL.leila,
    prNumber: 'PR var(--klic-component-block-color-accent)',
    prStatus: '검토 중',
    subtasksDone: 3,
    subtasksTotal: 4,
    comments: 6,
    dueDate: '4월 15일',
  },
  {
    id: 'sp-9',
    key: 'FLX-382',
    title: '다국어 통화(KRW/USD/JPY) 소수점 반올림 정산 오차 보정',
    columnId: 'qa-verify',
    priority: '긴급',
    storyPoints: 5,
    tag: '결제 원장',
    tagColor: 'bg-blue-500/10 text-blue-600  border-blue-500/20',
    assigneeName: '한소윤',
    assigneeAvatar: AVATAR_POOL.chloe,
    prNumber: 'PR var(--klic-component-block-color-accent)',
    prStatus: '승인됨',
    subtasksDone: 4,
    subtasksTotal: 4,
    comments: 7,
    dueDate: '4월 13일',
  },
  {
    id: 'sp-10',
    key: 'FLX-385',
    title: '슬랙·팀즈 인시던트 경보 웹훅 렌더러 블록 키트 v2 마이그레이션',
    columnId: 'qa-verify',
    priority: '보통',
    storyPoints: 2,
    tag: 'API 연동',
    tagColor: 'bg-blue-500/10 text-blue-600  border-blue-500/20',
    assigneeName: '정유진',
    assigneeAvatar: AVATAR_POOL.kira,
    prNumber: 'PR var(--klic-component-block-color-warning)',
    prStatus: 'CI 통과',
    subtasksDone: 3,
    subtasksTotal: 3,
    comments: 2,
    dueDate: '4월 14일',
  },
  {
    id: 'sp-11',
    key: 'FLX-376',
    title: 'Zero-Downtime DB 읽기 전용 레플리카 자동 페일오버 구성',
    columnId: 'done',
    priority: '긴급',
    storyPoints: 8,
    tag: '코어 성능',
    tagColor: 'bg-blue-500/10 text-blue-600  border-blue-500/20',
    assigneeName: '임성진',
    assigneeAvatar: AVATAR_POOL.devon,
    prNumber: 'PR var(--klic-component-block-color-accent)',
    prStatus: '승인됨',
    subtasksDone: 6,
    subtasksTotal: 6,
    comments: 14,
    dueDate: '완료됨',
  },
  {
    id: 'sp-12',
    key: 'FLX-379',
    title: '연간 엔터프라이즈 요금제 프로모션 크레딧 자동 차감 로직',
    columnId: 'done',
    priority: '높음',
    storyPoints: 3,
    tag: '결제 원장',
    tagColor: 'bg-blue-500/10 text-blue-600  border-blue-500/20',
    assigneeName: '한소윤',
    assigneeAvatar: AVATAR_POOL.chloe,
    prNumber: 'PR var(--klic-component-block-color-danger)',
    prStatus: '승인됨',
    subtasksDone: 4,
    subtasksTotal: 4,
    comments: 5,
    dueDate: '완료됨',
  },
];

/* ============================================================================
 * 2. 스쿼드 스윔레인 칸반 보드 (KLIC/kanban-2) 데이터 타입 및 초기값
 * ========================================================================== */
type SwimlaneColId = 'todo' | 'doing' | 'staging' | 'released';
type SwimlaneSquadId = 'payment' | 'infra' | 'platform';

interface SwimlaneTaskCard {
  id: string;
  code: string;
  title: string;
  squadId: SwimlaneSquadId;
  colId: SwimlaneColId;
  priority: '긴급' | '높음' | '보통';
  sp: number;
  owner: string;
  ownerAvatar: string;
  blocked?: boolean;
  envTag: string;
}

const SWIMLANE_SQUADS: {
  id: SwimlaneSquadId;
  name: string;
  lead: string;
  leadAvatar: string;
  sprintGoal: string;
  badgeClass: string;
}[] = [
  {
    id: 'payment',
    name: '결제 & 정산 코어 스쿼드',
    lead: '박준영 리드 · 엔지니어 6명',
    leadAvatar: AVATAR_POOL.aiden,
    sprintGoal: '글로벌 멀티통화 실시간 정산 파이프라인 무결성 99.999% 달성',
    badgeClass: 'bg-blue-500/10 text-blue-600  border-blue-500/20',
  },
  {
    id: 'infra',
    name: '클라우드 인프라 & SRE 스쿼드',
    lead: '임성진 리드 · 엔지니어 5명',
    leadAvatar: AVATAR_POOL.devon,
    sprintGoal: '멀티 리전 카나리 자동 롤백 및 쿠버네티스 노드 오토스케일링 단축',
    badgeClass: 'bg-blue-500/10 text-blue-600  border-blue-500/20',
  },
  {
    id: 'platform',
    name: '코어 플랫폼 & 디자인 시스템 스쿼드',
    lead: '오민재 리드 · 엔지니어 7명',
    leadAvatar: AVATAR_POOL.lucas,
    sprintGoal: 'KLIC v2.4 엔터프라이즈 블록 110종 접근성 및 번들 최적화',
    badgeClass: 'bg-blue-500/10 text-blue-600  border-blue-500/20',
  },
];

const SWIMLANE_COLS: { id: SwimlaneColId; label: string }[] = [
  { id: 'todo', label: '대기 (To Do)' },
  { id: 'doing', label: '구현 중 (In Progress)' },
  { id: 'staging', label: '스테이징 검증 (Staging)' },
  { id: 'released', label: '배포 완료 (Released)' },
];

const INITIAL_SWIMLANE_CARDS: SwimlaneTaskCard[] = [
  {
    id: 'sw-1',
    code: 'PAY-104',
    title: 'PG사 정산 대사(Reconciliation) 불일치 건 자동 재조회 워커',
    squadId: 'payment',
    colId: 'todo',
    priority: '높음',
    sp: 5,
    owner: '한소윤',
    ownerAvatar: AVATAR_POOL.chloe,
    envTag: 'kr-prod-ledger',
  },
  {
    id: 'sw-2',
    code: 'PAY-101',
    title: '가상계좌 입금 웹훅 중복 수신 멱등성(Idempotency) 키 캐싱',
    squadId: 'payment',
    colId: 'doing',
    priority: '긴급',
    sp: 8,
    owner: '박준영',
    ownerAvatar: AVATAR_POOL.aiden,
    envTag: 'redis-cluster-01',
  },
  {
    id: 'sw-3',
    code: 'PAY-098',
    title: '해외 법인 카드 BIN 번호 기반 수수료율 실시간 프리뷰 API',
    squadId: 'payment',
    colId: 'staging',
    priority: '보통',
    sp: 3,
    owner: '최수빈',
    ownerAvatar: AVATAR_POOL.kris,
    envTag: 'stage-billing',
  },
  {
    id: 'sw-4',
    code: 'PAY-095',
    title: '국세청 전자세금계산서 대량 발행 배치 큐 분할 처리',
    squadId: 'payment',
    colId: 'released',
    priority: '높음',
    sp: 5,
    owner: '한소윤',
    ownerAvatar: AVATAR_POOL.chloe,
    envTag: 'v2.4.1 배포됨',
  },
  {
    id: 'sw-5',
    code: 'INF-212',
    title: 'eBPF 기반 서비스 메시 패킷 드롭 실시간 트레이싱 에이전트',
    squadId: 'infra',
    colId: 'todo',
    priority: '높음',
    sp: 5,
    owner: '임성진',
    ownerAvatar: AVATAR_POOL.devon,
    envTag: 'k8s-ap-northeast',
  },
  {
    id: 'sw-6',
    code: 'INF-209',
    title: 'Terraform State 원격 잠금 충돌 감지 및 슬랙 승인 봇 연동',
    squadId: 'infra',
    colId: 'doing',
    priority: '긴급',
    sp: 5,
    owner: '윤도원',
    ownerAvatar: AVATAR_POOL.marcus,
    blocked: true,
    envTag: 'aws-iam-core',
  },
  {
    id: 'sw-7',
    code: 'INF-204',
    title: 'PostgreSQL 16 파티션 테이블 자동 생성 크론잡 무중단 전환',
    squadId: 'infra',
    colId: 'staging',
    priority: '높음',
    sp: 8,
    owner: '임성진',
    ownerAvatar: AVATAR_POOL.devon,
    envTag: 'db-stage-replica',
  },
  {
    id: 'sw-8',
    code: 'INF-199',
    title: 'CloudFront 엣지 WAF Rate-Limiting 규칙 오탐지 임계값 보정',
    squadId: 'infra',
    colId: 'released',
    priority: '보통',
    sp: 3,
    owner: '강태우',
    ownerAvatar: AVATAR_POOL.jonah,
    envTag: 'edge-global',
  },
  {
    id: 'sw-9',
    code: 'PLT-318',
    title: '애플리케이션 카테고리 22종 키보드 단축키(Cmd+K) 스포트라이트 연결',
    squadId: 'platform',
    colId: 'todo',
    priority: '보통',
    sp: 3,
    owner: '오민재',
    ownerAvatar: AVATAR_POOL.lucas,
    envTag: 'KLIC/shell',
  },
  {
    id: 'sw-10',
    code: 'PLT-315',
    title: '칸반 보드 6종 드래그 앤 드롭 및 실시간 상태 집계 엔진 구축',
    squadId: 'platform',
    colId: 'doing',
    priority: '긴급',
    sp: 8,
    owner: '이하은',
    ownerAvatar: AVATAR_POOL.leila,
    envTag: 'KLIC/kanban',
  },
  {
    id: 'sw-11',
    code: 'PLT-311',
    title: '다크 모드 고대비 차트 툴팁 및 tabular-nums 폰트 일괄 적용',
    squadId: 'platform',
    colId: 'staging',
    priority: '높음',
    sp: 5,
    owner: '정유진',
    ownerAvatar: AVATAR_POOL.kira,
    envTag: 'KLIC/charts',
  },
  {
    id: 'sw-12',
    code: 'PLT-306',
    title: '간트 차트 5종(일정·리소스·분기·스프린트·크리티컬) 패키지 배포',
    squadId: 'platform',
    colId: 'released',
    priority: '긴급',
    sp: 8,
    owner: '오민재',
    ownerAvatar: AVATAR_POOL.lucas,
    envTag: 'KLIC/gantt',
  },
];

/* ============================================================================
 * 3. B2B 세일즈 딜 파이프라인 보드 (KLIC/kanban-3) 데이터 타입 및 초기값
 * ========================================================================== */
type DealStageId = 'discovery' | 'poc' | 'proposal' | 'negotiation' | 'won';

interface CrmDealCard {
  id: string;
  companyName: string;
  dealTitle: string;
  stageId: DealStageId;
  tier: 'Enterprise' | 'Strategic' | 'Mid-Market';
  arrMillions: number;
  probability: number;
  ownerName: string;
  ownerAvatar: string;
  nextStep: string;
  closeDate: string;
  seats: number;
  hotDeal?: boolean;
}

const DEAL_STAGES: {
  id: DealStageId;
  title: string;
  defaultProb: number;
}[] = [
  { id: 'discovery', title: '리드 발굴 (Discovery)', defaultProb: 20 },
  { id: 'poc', title: '기술 PoC 검증', defaultProb: 45 },
  { id: 'proposal', title: '제안서 & 견적 제출', defaultProb: 65 },
  { id: 'negotiation', title: '법무·계약 협상', defaultProb: 85 },
  { id: 'won', title: '최종 수주 (Closed Won)', defaultProb: 100 },
];

const INITIAL_CRM_DEALS: CrmDealCard[] = [
  {
    id: 'dl-1',
    companyName: '한화솔루션 디지털랩',
    dealTitle: '글로벌 R&D 연구소 통합 데이터 그리드 라이선스',
    stageId: 'discovery',
    tier: 'Enterprise',
    arrMillions: 3.2,
    probability: 20,
    ownerName: '김태율 AE',
    ownerAvatar: AVATAR_POOL.aiden,
    nextStep: '4/17 기술 아키텍처 요구사항 미팅',
    closeDate: '2026.06.30',
    seats: 450,
  },
  {
    id: 'dl-2',
    companyName: '무신사 페이먼츠',
    dealTitle: '파트너 정산 포털 리뉴얼 KLIC 엔터프라이즈 팩',
    stageId: 'discovery',
    tier: 'Mid-Market',
    arrMillions: 1.4,
    probability: 25,
    ownerName: '박지훈 AE',
    ownerAvatar: AVATAR_POOL.jonah,
    nextStep: '보안성 검토 설문서(RFI) 회신',
    closeDate: '2026.06.15',
    seats: 180,
  },
  {
    id: 'dl-3',
    companyName: '카카오뱅크 인프라실',
    dealTitle: '프라이빗 클라우드 SRE 관제 대시보드 및 트리아지 보드',
    stageId: 'poc',
    tier: 'Strategic',
    arrMillions: 6.5,
    probability: 50,
    ownerName: '이서연 수석',
    ownerAvatar: AVATAR_POOL.leila,
    nextStep: '망분리 환경 폐쇄망 NPM 레지스트리 PoC 완료',
    closeDate: '2026.05.28',
    seats: 850,
    hotDeal: true,
  },
  {
    id: 'dl-4',
    companyName: '현대오토에버 모빌리티',
    dealTitle: '차량 관제 텔레메트리 실시간 모니터링 워크스페이스',
    stageId: 'poc',
    tier: 'Enterprise',
    arrMillions: 4.1,
    probability: 45,
    ownerName: '김태율 AE',
    ownerAvatar: AVATAR_POOL.aiden,
    nextStep: '초당 10만 이벤트 렌더링 부하 테스트 시연',
    closeDate: '2026.05.30',
    seats: 520,
  },
  {
    id: 'dl-5',
    companyName: '토스증권 프론트엔드팀',
    dealTitle: '웹 트레이딩 시스템(WTS) 고밀도 원장 그리드 연간 계약',
    stageId: 'proposal',
    tier: 'Strategic',
    arrMillions: 5.4,
    probability: 70,
    ownerName: '이서연 수석',
    ownerAvatar: AVATAR_POOL.leila,
    nextStep: 'CFO 예산 심의 및 3년 다년 약정 할인율 확정',
    closeDate: '2026.05.12',
    seats: 640,
    hotDeal: true,
  },
  {
    id: 'dl-6',
    companyName: '크래프톤 AI 스튜디오',
    dealTitle: '멀티 프로젝트 파이프라인 간트 & 칸반 통합 스튜디오',
    stageId: 'proposal',
    tier: 'Enterprise',
    arrMillions: 2.8,
    probability: 65,
    ownerName: '박지훈 AE',
    ownerAvatar: AVATAR_POOL.jonah,
    nextStep: '최종 견적서(Quotation v3) 제출 완료',
    closeDate: '2026.05.20',
    seats: 320,
  },
  {
    id: 'dl-7',
    companyName: '삼성SDS 클라우드사업부',
    dealTitle: '전사 표준 SaaS 어드민 템플릿 무제한 사이트 라이선스',
    stageId: 'negotiation',
    tier: 'Strategic',
    arrMillions: 9.2,
    probability: 85,
    ownerName: '이서연 수석',
    ownerAvatar: AVATAR_POOL.leila,
    nextStep: '법무팀 SLA 배상 한도 조항 최종 날인 대기',
    closeDate: '2026.04.25',
    seats: 1500,
    hotDeal: true,
  },
  {
    id: 'dl-8',
    companyName: '당근페이 정산팀',
    dealTitle: '지역 광고주 빌링 콘솔 및 실시간 정산 리포트 모듈',
    stageId: 'negotiation',
    tier: 'Mid-Market',
    arrMillions: 1.9,
    probability: 90,
    ownerName: '김태율 AE',
    ownerAvatar: AVATAR_POOL.aiden,
    nextStep: '구매주문서(PO) 발행 승인 완료',
    closeDate: '2026.04.22',
    seats: 210,
  },
  {
    id: 'dl-9',
    companyName: '네이버클라우드 플랫폼',
    dealTitle: '관리형 쿠버네티스 콘솔 UI 컴포넌트 코어 파트너십',
    stageId: 'won',
    tier: 'Strategic',
    arrMillions: 7.8,
    probability: 100,
    ownerName: '이서연 수석',
    ownerAvatar: AVATAR_POOL.leila,
    nextStep: '킥오프 완료 · 전담 솔루션 아키텍트 배정',
    closeDate: '수주 완료',
    seats: 1200,
  },
  {
    id: 'dl-10',
    companyName: '리디북스 콘텐츠플랫폼',
    dealTitle: '파트너 출판사 정산 대시보드 및 카탈로그 그리드 도입',
    stageId: 'won',
    tier: 'Mid-Market',
    arrMillions: 1.6,
    probability: 100,
    ownerName: '박지훈 AE',
    ownerAvatar: AVATAR_POOL.jonah,
    nextStep: '연간 계약금 입금 확인 및 라이선스 키 발급',
    closeDate: '수주 완료',
    seats: 190,
  },
];

/* ============================================================================
 * 4. SRE 인시던트 트리아지 보드 (KLIC/kanban-4) 데이터 타입 및 초기값
 * ========================================================================== */
type IncidentStageId = 'detected' | 'investigating' | 'mitigating' | 'postmortem';

interface IncidentCard {
  id: string;
  incCode: string;
  title: string;
  stageId: IncidentStageId;
  severity: 'Sev 1' | 'Sev 2' | 'Sev 3';
  serviceName: string;
  region: string;
  errorRateText: string;
  elapsedText: string;
  slaBreachRisk?: boolean;
  commander: string;
  commanderAvatar: string;
  warRoom: string;
}

const INCIDENT_STAGES: {
  id: IncidentStageId;
  title: string;
  subtitle: string;
  dotClass: string;
}[] = [
  { id: 'detected', title: '감지 및 경보 (Detected)', subtitle: '자동 페이저 호출 · 초기 트리아지', dotClass: 'bg-blue-500 animate-pulse' },
  { id: 'investigating', title: '원인 분석 중 (Investigating)', subtitle: '워룸 소집 · 루트 코즈 추적', dotClass: 'bg-amber-500' },
  { id: 'mitigating', title: '완화 조치 적용 (Mitigating)', subtitle: '카나리 롤백 · 트래픽 우회', dotClass: 'bg-blue-500' },
  { id: 'postmortem', title: '복구 및 회고 (Postmortem)', subtitle: '정상화 완료 · 재발 방지 대책', dotClass: 'bg-blue-500' },
];

const INITIAL_INCIDENTS: IncidentCard[] = [
  {
    id: 'inc-1',
    incCode: 'INC-2948',
    title: '카드 결제 승인 게이트웨이 타임아웃 급증 (p99 > 4,200ms)',
    stageId: 'detected',
    severity: 'Sev 1',
    serviceName: 'payment-gateway-kr',
    region: 'ap-northeast-2',
    errorRateText: '5xx 에러율 14.8%',
    elapsedText: '경과 6분 · SLA 긴급',
    slaBreachRisk: true,
    commander: '임성진 SRE',
    commanderAvatar: AVATAR_POOL.devon,
    warRoom: '#war-2948-pay',
  },
  {
    id: 'inc-2',
    incCode: 'INC-2947',
    title: '웹훅 발송 워커 큐 적체 (대기 메시지 185,000건 돌파)',
    stageId: 'detected',
    severity: 'Sev 2',
    serviceName: 'webhook-dispatcher',
    region: 'ap-northeast-2',
    errorRateText: '지연 42초',
    elapsedText: '경과 11분',
    commander: '강태우 리드',
    commanderAvatar: AVATAR_POOL.jonah,
    warRoom: '#war-2947-hook',
  },
  {
    id: 'inc-3',
    incCode: 'INC-2945',
    title: 'OAuth 토큰 리프레시 Redis 클러스터 슬롯 마이그레이션 락 현상',
    stageId: 'investigating',
    severity: 'Sev 1',
    serviceName: 'auth-token-redis',
    region: 'global-edge',
    errorRateText: '인증 실패 4.2%',
    elapsedText: '경과 24분 · SLA 주의',
    slaBreachRisk: true,
    commander: '윤도원 보안',
    commanderAvatar: AVATAR_POOL.marcus,
    warRoom: '#war-2945-auth',
  },
  {
    id: 'inc-4',
    incCode: 'INC-2944',
    title: '실시간 매출 분석 ClickHouse 복제본 메모리 OOM 재시작 반복',
    stageId: 'investigating',
    severity: 'Sev 2',
    serviceName: 'analytics-olap-db',
    region: 'us-east-1',
    errorRateText: '쿼리 실패 8.1%',
    elapsedText: '경과 38분',
    commander: '송하린 리드',
    commanderAvatar: AVATAR_POOL.elena,
    warRoom: '#war-2944-olap',
  },
  {
    id: 'inc-5',
    incCode: 'INC-2942',
    title: 'v2.4.3 카나리 배포 후 Safari 17 환경 차트 Canvas 메모리 누수',
    stageId: 'mitigating',
    severity: 'Sev 2',
    serviceName: 'web-studio-client',
    region: 'cdn-global',
    errorRateText: '롤백 85% 진행',
    elapsedText: '경과 52분',
    commander: '오민재 아키텍트',
    commanderAvatar: AVATAR_POOL.lucas,
    warRoom: '#war-2942-fe',
  },
  {
    id: 'inc-6',
    incCode: 'INC-2940',
    title: '배치 PDF 청구서 렌더링 폰트 캐시 서버 응답 지연',
    stageId: 'mitigating',
    severity: 'Sev 3',
    serviceName: 'invoice-pdf-worker',
    region: 'eu-central-1',
    errorRateText: '정상화 98.4%',
    elapsedText: '경과 1시간 15분',
    commander: '한소윤 매니저',
    commanderAvatar: AVATAR_POOL.chloe,
    warRoom: '#war-2940-pdf',
  },
  {
    id: 'inc-7',
    incCode: 'INC-2936',
    title: 'DNS Anycast 라우팅 BGP 경로 흔들림으로 인한 유럽 리전 순단',
    stageId: 'postmortem',
    severity: 'Sev 1',
    serviceName: 'edge-dns-router',
    region: 'eu-west-1',
    errorRateText: '복구 완료 (MTTR 19분)',
    elapsedText: 'RCA 문서 작성 중',
    commander: '임성진 SRE',
    commanderAvatar: AVATAR_POOL.devon,
    warRoom: '#rca-2936-dns',
  },
  {
    id: 'inc-8',
    incCode: 'INC-2933',
    title: '사내 감사 로그 S3 버킷 수명주기 정책 오류로 인한 조기 Glacier 이관',
    stageId: 'postmortem',
    severity: 'Sev 3',
    serviceName: 'audit-log-archiver',
    region: 'ap-northeast-2',
    errorRateText: '복원 완료 (100%)',
    elapsedText: '재발방지 승인됨',
    commander: '윤도원 보안',
    commanderAvatar: AVATAR_POOL.marcus,
    warRoom: '#rca-2933-s3',
  },
];

/* ============================================================================
 * 5. 채용 파이프라인 (ATS) 보드 (KLIC/kanban-5) 데이터 타입 및 초기값
 * ========================================================================== */
type HiringStageId = 'screening' | 'assignment' | 'tech-interview' | 'culture-fit' | 'offer';

interface CandidateCard {
  id: string;
  name: string;
  avatar: string;
  roleTitle: string;
  department: '시니어 백엔드' | '프론트엔드 코어' | '클라우드 SRE' | '프로덕트 디자이너';
  stageId: HiringStageId;
  experienceText: string;
  score: number;
  EvaluatorsCount: number;
  skills: string[];
  source: '다이렉트 스카우트' | '사내 추천' | '공식 채용사이트';
  note: string;
}

const HIRING_STAGES: {
  id: HiringStageId;
  title: string;
  accentColor: string;
}[] = [
  { id: 'screening', title: '서류 심사', accentColor: 'bg-zinc-500' },
  { id: 'assignment', title: '직무 과제 전형', accentColor: 'bg-blue-500' },
  { id: 'tech-interview', title: '1차 기술 심층 면접', accentColor: 'bg-blue-500' },
  { id: 'culture-fit', title: '최종 컬처핏 & 바레이저', accentColor: 'bg-amber-500' },
  { id: 'offer', title: '처우 협의 & 오퍼 발송', accentColor: 'bg-blue-500' },
];

const INITIAL_CANDIDATES: CandidateCard[] = [
  {
    id: 'cand-1',
    name: '정현우',
    avatar: AVATAR_POOL.aiden,
    roleTitle: "수석 분산 시스템 엔지니어",
    department: '시니어 백엔드',
    stageId: 'screening',
    experienceText: '경력 9년 · 전 쿠팡 코어페이먼츠',
    score: 4.7,
    EvaluatorsCount: 2,
    skills: ['Go', 'Kafka', 'CockroachDB'],
    source: '다이렉트 스카우트',
    note: '대용량 정산 원장 샤딩 설계 경험 우수',
  },
  {
    id: 'cand-2',
    name: '김소연',
    avatar: AVATAR_POOL.kira,
    roleTitle: "선임 디자인 시스템 디자이너",
    department: '프로덕트 디자이너',
    stageId: 'screening',
    experienceText: '경력 6년 · 전 라인플러스 디자인시스템',
    score: 4.5,
    EvaluatorsCount: 2,
    skills: ['Figma Tokens', 'WCAG 접근성', 'Design Ops'],
    source: '공식 채용사이트',
    note: '엔터프라이즈 데이터 시각화 포트폴리오 탁월',
  },
  {
    id: 'cand-3',
    name: '백승민',
    avatar: AVATAR_POOL.lucas,
    roleTitle: "선임 프런트엔드 아키텍처 엔지니어",
    department: '프론트엔드 코어',
    stageId: 'assignment',
    experienceText: '경력 7년 · 전 토스 코어웹',
    score: 4.9,
    EvaluatorsCount: 3,
    skills: ['TypeScript', 'React 19', 'WebGL/Canvas'],
    source: '사내 추천',
    note: '10만 행 가상 그리드 과제 제출 완료 (상위 1%)',
  },
  {
    id: 'cand-4',
    name: '이도윤',
    avatar: AVATAR_POOL.devon,
    roleTitle: "클라우드 플랫폼 SRE 리드",
    department: '클라우드 SRE',
    stageId: 'assignment',
    experienceText: '경력 8년 · 전 당근 인프라팀',
    score: 4.6,
    EvaluatorsCount: 2,
    skills: ['Kubernetes', 'Terraform', 'eBPF'],
    source: '다이렉트 스카우트',
    note: '멀티 클러스터 재해복구(DR) 시나리오 설계 검증 중',
  },
  {
    id: 'cand-5',
    name: '최윤서',
    avatar: AVATAR_POOL.leila,
    roleTitle: "책임 백엔드 엔지니어 (결제)",
    department: '시니어 백엔드',
    stageId: 'tech-interview',
    experienceText: '경력 10년 · 전 스트라이프 싱가포르',
    score: 4.95,
    EvaluatorsCount: 4,
    skills: ['Rust', 'Go', 'PostgreSQL Internals'],
    source: '다이렉트 스카우트',
    note: '시스템 아키텍처 라이브 화이트보드 만장일치 Strong Hire',
  },
  {
    id: 'cand-6',
    name: '문지훈',
    avatar: AVATAR_POOL.jonah,
    roleTitle: "선임 프런트엔드 엔지니어 (차트)",
    department: '프론트엔드 코어',
    stageId: 'tech-interview',
    experienceText: '경력 5년 · 전 네이버 데이터랩',
    score: 4.4,
    EvaluatorsCount: 3,
    skills: ['SVG/D3', 'TypeScript', 'Performance'],
    source: '공식 채용사이트',
    note: '베지어 곡선 및 실시간 캔버스 렌더링 최적화 역량 확인',
  },
  {
    id: 'cand-7',
    name: '한지원',
    avatar: AVATAR_POOL.marcus,
    roleTitle: "수석 사이트 안정성 엔지니어",
    department: '클라우드 SRE',
    stageId: 'culture-fit',
    experienceText: '경력 9년 · 전 AWS 코리아 솔루션즈',
    score: 4.85,
    EvaluatorsCount: 5,
    skills: ['SLO/Error Budget', 'Istio', 'Go'],
    source: '사내 추천',
    note: 'CTO 바레이저 면접 완료 · 온콜 문화 혁신 리더십 검증',
  },
  {
    id: 'cand-8',
    name: '서유나',
    avatar: AVATAR_POOL.elena,
    roleTitle: "프로덕트 디자인 리드 (B2B SaaS)",
    department: '프로덕트 디자이너',
    stageId: 'offer',
    experienceText: '경력 8년 · 전 채널톡 프로덕트디자인',
    score: 4.9,
    EvaluatorsCount: 5,
    skills: ['B2B Workflow', 'Design System', 'Prototyping'],
    source: '다이렉트 스카우트',
    note: '최종 처우 협의서(Offer Letter) 발송 · 입사 예정일 5/11',
  },
  {
    id: 'cand-9',
    name: '권태현',
    avatar: AVATAR_POOL.noah,
    roleTitle: "선임 코어 프런트엔드 엔지니어",
    department: '프론트엔드 코어',
    stageId: 'offer',
    experienceText: '경력 7년 · 전 카카오엔터프라이즈',
    score: 4.8,
    EvaluatorsCount: 5,
    skills: ['React', 'Accessibility', 'Monorepo'],
    source: '사내 추천',
    note: '오퍼 수락 완료 (Signed) · 장비 발주 및 온보딩 준비',
  },
];

/* ============================================================================
 * 메인 컴포넌트: KanbanBoardBlock
 * ========================================================================== */
export const KanbanBoardBlock: React.FC<KanbanBoardBlockProps> = ({
  initialMode = 'issue-tracker',
  density = 'normal',
}) => {
  const [mode, setMode] = useState<KanbanMode>(initialMode);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // 0. 프로덕트 이슈 보드 (첨부 이미지 Linear 스타일) 상태
  const [linearIssues, setLinearIssues] = useState<LinearIssueCard[]>(INITIAL_LINEAR_ISSUES);
  const [linearViewType, setLinearViewType] = useState<'board' | 'list'>('board');
  const [selectedRosterMember, setSelectedRosterMember] = useState<string | null>(null);
  const [selectedLinearLabel, setSelectedLinearLabel] = useState<LinearLabelType | '전체'>('전체');
  const [selectedLinearPrio, setSelectedLinearPrio] = useState<LinearPriority | '전체'>('전체');
  const [isLabelMenuOpen, setIsLabelMenuOpen] = useState(false);
  const [isPrioMenuOpen, setIsPrioMenuOpen] = useState(false);
  const [draggedLinearId, setDraggedLinearId] = useState<string | null>(null);

  // 1. 스프린트 보드 상태
  const [sprintCards, setSprintCards] = useState<SprintTaskCard[]>(INITIAL_SPRINT_CARDS);
  const [sprintPriorityFilter, setSprintPriorityFilter] = useState<string>('전체');
  const [draggedSprintCardId, setDraggedSprintCardId] = useState<string | null>(null);
  const [isNewSprintModalOpen, setIsNewSprintModalOpen] = useState(false);
  const [newSprintTitle, setNewSprintTitle] = useState('');
  const [newSprintPriority, setNewSprintPriority] = useState<'긴급' | '높음' | '보통'>('높음');
  const [newSprintPoints, setNewSprintPoints] = useState<number>(5);

  // 2. 스윔레인 보드 상태
  const [swimlaneCards, setSwimlaneCards] = useState<SwimlaneTaskCard[]>(INITIAL_SWIMLANE_CARDS);
  const [collapsedSquads, setCollapsedSquads] = useState<Record<string, boolean>>({});
  const [swimlaneGroupBy, setSwimlaneGroupBy] = useState<'squad' | 'priority'>('squad');

  // 3. CRM 딜 파이프라인 상태
  const [crmDeals, setCrmDeals] = useState<CrmDealCard[]>(INITIAL_CRM_DEALS);
  const [crmTierFilter, setCrmTierFilter] = useState<string>('전체');
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);
  const [newDealCompany, setNewDealCompany] = useState('');
  const [newDealTitle, setNewDealTitle] = useState('');
  const [newDealArr, setNewDealArr] = useState('3.5');

  // 4. SRE 인시던트 트리아지 상태
  const [incidents, setIncidents] = useState<IncidentCard[]>(INITIAL_INCIDENTS);
  const [sevFilter, setSevFilter] = useState<string>('전체');
  const [draggedIncidentId, setDraggedIncidentId] = useState<string | null>(null);

  // 5. 채용 ATS 보드 상태
  const [candidates, setCandidates] = useState<CandidateCard[]>(INITIAL_CANDIDATES);
  const [deptFilter, setDeptFilter] = useState<string>('전체 직군');
  const [draggedCandidateId, setDraggedCandidateId] = useState<string | null>(null);

  const cardPadding =
    density === 'compact' ? 'p-3' : density === 'relaxed' ? 'p-4' : 'p-3.5';

  /* --- 0. 프로덕트 이슈 보드 (Linear 스타일) 단계 이동 --- */
  const moveLinearCard = (cardId: string, direction: 'prev' | 'next') => {
    const order: LinearColId[] = ['backlog', 'todo', 'in-progress', 'in-review'];
    setLinearIssues((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        const idx = order.indexOf(c.colId);
        const nextIdx =
          direction === 'next'
            ? Math.min(order.length - 1, idx + 1)
            : Math.max(0, idx - 1);
        return { ...c, colId: order[nextIdx] };
      })
    );
  };

  /* --- 1. 스프린트 액션 핸들러 --- */
  const moveSprintCard = (cardId: string, direction: 'prev' | 'next') => {
    const order: SprintColumnId[] = ['backlog', 'in-progress', 'code-review', 'qa-verify', 'done'];
    setSprintCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        const idx = order.indexOf(c.columnId);
        const nextIdx = direction === 'next' ? Math.min(order.length - 1, idx + 1) : Math.max(0, idx - 1);
        const targetCol = order[nextIdx];
        return {
          ...c,
          columnId: targetCol,
          subtasksDone: targetCol === 'done' ? c.subtasksTotal : c.subtasksDone,
          dueDate: targetCol === 'done' ? '완료됨' : c.dueDate,
        };
      })
    );
  };

  const handleAddSprintCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSprintTitle.trim()) return;
    const created: SprintTaskCard = {
      id: `sp-${Date.now()}`,
      key: `FLX-${Math.floor(410 + Math.random() * 80)}`,
      title: newSprintTitle.trim(),
      columnId: 'in-progress',
      priority: newSprintPriority,
      storyPoints: newSprintPoints,
      tag: '신규 스프린트',
      tagColor: 'bg-blue-500/10 text-blue-600  border-blue-500/20',
      assigneeName: '이하은',
      assigneeAvatar: AVATAR_POOL.leila,
      prNumber: 'PR var(--klic-component-block-color-warning)',
      prStatus: '검토 중',
      subtasksDone: 1,
      subtasksTotal: 4,
      comments: 0,
      dueDate: '4월 22일',
    };
    setSprintCards((prev) => [created, ...prev]);
    setNewSprintTitle('');
    setIsNewSprintModalOpen(false);
  };

  /* --- 2. 스윔레인 액션 핸들러 --- */
  const moveSwimlaneCard = (cardId: string, direction: 'prev' | 'next') => {
    const order: SwimlaneColId[] = ['todo', 'doing', 'staging', 'released'];
    setSwimlaneCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        const idx = order.indexOf(c.colId);
        const nextIdx = direction === 'next' ? Math.min(order.length - 1, idx + 1) : Math.max(0, idx - 1);
        return { ...c, colId: order[nextIdx], blocked: order[nextIdx] === 'released' ? false : c.blocked };
      })
    );
  };

  /* --- 3. CRM 딜 파이프라인 액션 핸들러 --- */
  const moveCrmDeal = (dealId: string, direction: 'prev' | 'next') => {
    const order: DealStageId[] = ['discovery', 'poc', 'proposal', 'negotiation', 'won'];
    const probMap: Record<DealStageId, number> = {
      discovery: 20,
      poc: 45,
      proposal: 65,
      negotiation: 85,
      won: 100,
    };
    setCrmDeals((prev) =>
      prev.map((d) => {
        if (d.id !== dealId) return d;
        const idx = order.indexOf(d.stageId);
        const nextIdx = direction === 'next' ? Math.min(order.length - 1, idx + 1) : Math.max(0, idx - 1);
        const nextStage = order[nextIdx];
        return {
          ...d,
          stageId: nextStage,
          probability: probMap[nextStage],
          closeDate: nextStage === 'won' ? '수주 완료' : d.closeDate,
        };
      })
    );
  };

  const handleAddCrmDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealCompany.trim() || !newDealTitle.trim()) return;
    const arrVal = parseFloat(newDealArr) || 2.5;
    const created: CrmDealCard = {
      id: `dl-${Date.now()}`,
      companyName: newDealCompany.trim(),
      dealTitle: newDealTitle.trim(),
      stageId: 'poc',
      tier: arrVal >= 5 ? 'Strategic' : arrVal >= 2.5 ? 'Enterprise' : 'Mid-Market',
      arrMillions: arrVal,
      probability: 45,
      ownerName: '이서연 수석',
      ownerAvatar: AVATAR_POOL.leila,
      nextStep: '신규 기술 검증 환경 프로비저닝',
      closeDate: '2026.06.20',
      seats: Math.round(arrVal * 120),
      hotDeal: arrVal >= 4,
    };
    setCrmDeals((prev) => [created, ...prev]);
    setNewDealCompany('');
    setNewDealTitle('');
    setIsNewDealOpen(false);
  };

  /* --- 4. SRE 인시던트 액션 핸들러 --- */
  const moveIncidentStage = (incId: string, direction: 'prev' | 'next') => {
    const order: IncidentStageId[] = ['detected', 'investigating', 'mitigating', 'postmortem'];
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== incId) return inc;
        const idx = order.indexOf(inc.stageId);
        const nextIdx = direction === 'next' ? Math.min(order.length - 1, idx + 1) : Math.max(0, idx - 1);
        const nextStage = order[nextIdx];
        return {
          ...inc,
          stageId: nextStage,
          slaBreachRisk: nextStage === 'postmortem' ? false : inc.slaBreachRisk,
          errorRateText: nextStage === 'postmortem' ? '복구 완료 (100%)' : inc.errorRateText,
        };
      })
    );
  };

  /* --- 5. 채용 ATS 액션 핸들러 --- */
  const moveCandidateStage = (candId: string, direction: 'prev' | 'next') => {
    const order: HiringStageId[] = ['screening', 'assignment', 'tech-interview', 'culture-fit', 'offer'];
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candId) return c;
        const idx = order.indexOf(c.stageId);
        const nextIdx = direction === 'next' ? Math.min(order.length - 1, idx + 1) : Math.max(0, idx - 1);
        return { ...c, stageId: order[nextIdx] };
      })
    );
  };

  /* --- CRM 요약 수치 계산 --- */
  const crmSummary = useMemo(() => {
    const totalArr = crmDeals.reduce((acc, d) => acc + d.arrMillions, 0);
    const weightedArr = crmDeals.reduce((acc, d) => acc + d.arrMillions * (d.probability / 100), 0);
    const wonArr = crmDeals
      .filter((d) => d.stageId === 'won')
      .reduce((acc, d) => acc + d.arrMillions, 0);
    return {
      totalArr: totalArr.toFixed(1),
      weightedArr: weightedArr.toFixed(1),
      wonArr: wonArr.toFixed(1),
      avgArr: (totalArr / Math.max(1, crmDeals.length)).toFixed(2),
    };
  }, [crmDeals]);

  return (
    <div className="space-y-5">
      {/* 상단 칸반 보드 스타일 스위처 바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200/80  bg-zinc-50/70  p-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'lifecycle', label: '1. 에이전트 업무 라이프사이클', pkg: 'KLIC/task-lifecycle' },
            { id: 'issue-tracker', label: '2. 프로덕트 이슈 보드', pkg: 'KLIC/kanban-linear' },
            { id: 'sprint', label: '3. 애자일 스프린트 WIP', pkg: 'KLIC/kanban-1' },
            { id: 'swimlane', label: '4. 스쿼드 스윔레인', pkg: 'KLIC/kanban-2' },
            { id: 'crm', label: '5. B2B 세일즈 딜', pkg: 'KLIC/kanban-3' },
            { id: 'incident', label: '6. SRE 인시던트 트리아지', pkg: 'KLIC/kanban-4' },
            { id: 'hiring', label: '7. 채용 파이프라인 (ATS)', pkg: 'KLIC/kanban-5' },
          ].map((tab) => {
            const active = mode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id as KanbanMode)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? 'bg-klic-inverse text-klic-on-emphasis   shadow-xs'
                    : 'text-klic-muted  hover:bg-zinc-200/70 '
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                    active
                      ? 'bg-white/15 text-klic-on-emphasis  '
                      : 'bg-zinc-200/80  text-klic-muted '
                  }`}
                >
                  {tab.pkg}
                </span>
              </button>
            );
          })}
        </div>

        {/* 공통 검색 인풋 */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-klic-muted absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="이슈 번호, 제목, 담당자 검색..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-zinc-200  bg-white  text-zinc-800  placeholder:text-klic-muted focus:outline-none focus:ring-2 focus:ring-zinc-900/10 "
          />
        </div>
      </div>

      {/* =====================================================================
       * MODE -1: 자율 에이전트 업무 라이프사이클 관제 (KLIC/task-lifecycle)
       * =================================================================== */}
      {mode === 'lifecycle' && <TaskLifecycleBlock density={density} />}

      {/* =====================================================================
       * MODE 0: 프로덕트 이슈 보드 (첨부 이미지 Linear 스타일 100% 재현)
       * =================================================================== */}
      {mode === 'issue-tracker' && (
        <div className="rounded-2xl border border-zinc-200  bg-white  overflow-hidden shadow-2xs">
          {/* 1단 상단 브레드크럼 & 보드/목록 뷰 토글 헤더 */}
          <div className="px-5 py-3.5 border-b border-zinc-200/80  flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-klic-muted  font-medium">프로덕트</span>
                <ChevronRight className="w-3.5 h-3.5 text-klic-muted" />
                <span className="font-semibold text-zinc-900 ">전체 이슈</span>
              </div>

              {/* 보드 / 목록 세그먼트 토글 */}
              <div className="inline-flex items-center rounded-lg border border-zinc-200  bg-zinc-100/70  p-0.5 ml-1">
                <button
                  type="button"
                  onClick={() => setLinearViewType('board')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    linearViewType === 'board'
                      ? 'bg-white  text-zinc-900  shadow-2xs'
                      : 'text-klic-muted hover:text-zinc-800 '
                  }`}
                >
                  보드
                </button>
                <button
                  type="button"
                  onClick={() => setLinearViewType('list')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    linearViewType === 'list'
                      ? 'bg-white  text-zinc-900  shadow-2xs'
                      : 'text-klic-muted hover:text-zinc-800 '
                  }`}
                >
                  목록
                </button>
              </div>
            </div>

            <div className="text-xs text-klic-muted  hidden sm:block">
              총 <strong className="font-mono text-zinc-700 ">{linearIssues.length}</strong>개 이슈 · 카드를 드래그하여 상태를 변경하세요
            </div>
          </div>

          {/* 2단 팀원 프로필 아바타 클러스터 & 점선 필터 버튼 바 */}
          <div className="px-5 py-3 border-b border-zinc-200/80  flex flex-wrap items-center gap-3.5 bg-white ">
            {/* 12명 팀원 겹침 프로필 사진 리스트 */}
            <div className="flex items-center -space-x-1.5">
              {TEAM_AVATAR_ROSTER.map((member) => {
                const isSelected = selectedRosterMember === member.name;
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() =>
                      setSelectedRosterMember((prev) =>
                        prev === member.name ? null : member.name
                      )
                    }
                    title={`${member.name} 담당 이슈 필터`}
                    className={`relative rounded-full transition-transform hover:z-20 hover:-translate-y-0.5 ${
                      isSelected
                        ? 'z-20 ring-2 ring-zinc-900  scale-110'
                        : 'ring-2 ring-white '
                    }`}
                  >
                    <ProfileAvatar
                      src={member.avatar}
                      name={member.name}
                      sizeClass="w-7 h-7"
                    />
                  </button>
                );
              })}
            </div>

            <div className="h-5 w-px bg-zinc-200 " />

            {/* 점선(Dashed) 라벨 필터 버튼 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsLabelMenuOpen((v) => !v);
                  setIsPrioMenuOpen(false);
                }}
                className={`inline-flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedLinearLabel !== '전체'
                    ? 'border-zinc-900  bg-klic-inverse/5  text-zinc-900 '
                    : 'border-zinc-300  text-klic-muted  hover:border-zinc-400'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-klic-muted" />
                <span>
                  {selectedLinearLabel === '전체' ? '라벨' : `라벨: ${selectedLinearLabel}`}
                </span>
              </button>

              {isLabelMenuOpen && (
                <div className="absolute left-0 mt-1.5 w-44 rounded-xl border border-zinc-200  bg-white  shadow-lg p-1.5 z-30">
                  {(
                    ['전체', '안드로이드', '기능', '성능', '디자인', '버그', '리서치', '개선'] as const
                  ).map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => {
                        setSelectedLinearLabel(lbl);
                        setIsLabelMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-zinc-700  hover:bg-zinc-100 "
                    >
                      <span className="flex items-center gap-2">
                        {lbl !== '전체' && (
                          <span
                            className={`w-2 h-2 rounded-full ${LINEAR_LABEL_STYLES[lbl].dot}`}
                          />
                        )}
                        {lbl}
                      </span>
                      {selectedLinearLabel === lbl && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 점선(Dashed) 우선순위 필터 버튼 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsPrioMenuOpen((v) => !v);
                  setIsLabelMenuOpen(false);
                }}
                className={`inline-flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedLinearPrio !== '전체'
                    ? 'border-zinc-900  bg-klic-inverse/5  text-zinc-900 '
                    : 'border-zinc-300  text-klic-muted  hover:border-zinc-400'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5 text-klic-muted" />
                <span>
                  {selectedLinearPrio === '전체'
                    ? '우선순위'
                    : `우선순위: ${
                        selectedLinearPrio === 'urgent'
                          ? '긴급'
                          : selectedLinearPrio === 'high'
                          ? '높음'
                          : selectedLinearPrio === 'medium'
                          ? '보통'
                          : '낮음'
                      }`}
                </span>
              </button>

              {isPrioMenuOpen && (
                <div className="absolute left-0 mt-1.5 w-40 rounded-xl border border-zinc-200  bg-white  shadow-lg p-1.5 z-30">
                  {[
                    { id: '전체', label: '전체 우선순위' },
                    { id: 'urgent', label: "긴급" },
                    { id: 'high', label: '높음 (High)' },
                    { id: 'medium', label: '보통 (Medium)' },
                    { id: 'low', label: '낮음 (Low)' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedLinearPrio(p.id as LinearPriority | '전체');
                        setIsPrioMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-zinc-700  hover:bg-zinc-100 "
                    >
                      <span>{p.label}</span>
                      {selectedLinearPrio === p.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 활성 필터 초기화 버튼 */}
            {(selectedRosterMember ||
              selectedLinearLabel !== '전체' ||
              selectedLinearPrio !== '전체') && (
              <button
                type="button"
                onClick={() => {
                  setSelectedRosterMember(null);
                  setSelectedLinearLabel('전체');
                  setSelectedLinearPrio('전체');
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-zinc-100  px-2.5 py-1 text-xs text-klic-muted  hover:text-zinc-900"
              >
                <X className="w-3 h-3" /> 필터 초기화
              </button>
            )}
          </div>

          {/* 3단: 보드 뷰 vs 목록 뷰 */}
          {linearViewType === 'board' ? (
            <div className="p-4 sm:p-5 overflow-x-auto bg-zinc-50/40 ">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 min-w-[980px]">
                {(
                  [
                    { id: 'backlog', title: '백로그' },
                    { id: 'todo', title: '할 일' },
                    { id: 'in-progress', title: '진행 중' },
                    { id: 'in-review', title: '검토 중' },
                  ] as { id: LinearColId; title: string }[]
                ).map((col) => {
                  const colCards = linearIssues.filter((c) => {
                    if (c.colId !== col.id) return false;
                    if (selectedRosterMember && c.assigneeName !== selectedRosterMember) {
                      return false;
                    }
                    if (selectedLinearLabel !== '전체' && c.label !== selectedLinearLabel) {
                      return false;
                    }
                    if (selectedLinearPrio !== '전체' && c.priority !== selectedLinearPrio) {
                      return false;
                    }
                    if (
                      searchQuery.trim() &&
                      !c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                      !c.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
                      !c.assigneeName.includes(searchQuery)
                    ) {
                      return false;
                    }
                    return true;
                  });

                  return (
                    <div
                      key={col.id}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (!draggedLinearId) return;
                        setLinearIssues((prev) =>
                          prev.map((c) =>
                            c.id === draggedLinearId ? { ...c, colId: col.id } : c
                          )
                        );
                        setDraggedLinearId(null);
                      }}
                      className="flex flex-col min-h-[540px]"
                    >
                      {/* 컬럼 헤더 (첨부 이미지와 동일한 아이콘 + 타이틀 + 건수) */}
                      <div className="flex items-center justify-between px-1 pb-3">
                        <div className="flex items-center gap-2">
                          <LinearColumnStatusIcon colId={col.id} />
                          <span className="text-[13px] font-semibold text-zinc-900 ">
                            {col.title}
                          </span>
                          <span className="text-[13px] font-mono text-klic-muted  tabular-nums">
                            {colCards.length}
                          </span>
                        </div>
                      </div>

                      {/* 카드 스택 */}
                      <div className="space-y-3 flex-1">
                        {colCards.map((card) => {
                          const labelStyle = LINEAR_LABEL_STYLES[card.label];

                          return (
                            <div
                              key={card.id}
                              draggable
                              onDragStart={() => setDraggedLinearId(card.id)}
                              className={`group rounded-2xl border border-zinc-200/90  bg-white  ${cardPadding} shadow-2xs hover:border-zinc-300  transition-all cursor-grab active:cursor-grabbing`}
                            >
                              {/* 상단 행: 이슈 코드 + 마감일 + 우측 프로필 사진 */}
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2.5 text-xs text-klic-muted ">
                                  <span className="font-mono tracking-tight tabular-nums">
                                    {card.code}
                                  </span>
                                  {card.dueDate && (
                                    <span className="inline-flex items-center gap-1 text-klic-muted  tabular-nums">
                                      <Calendar className="w-3.5 h-3.5 text-klic-muted" />
                                      <span>{card.dueDate}</span>
                                    </span>
                                  )}
                                </div>

                                <ProfileAvatar
                                  src={card.assigneeAvatar}
                                  name={card.assigneeName}
                                  unassigned={card.unassigned}
                                  sizeClass="w-6 h-6"
                                />
                              </div>

                              {/* 중단: 이슈 제목 */}
                              <h4 className="text-[13.5px] font-medium text-zinc-900  leading-snug mb-3.5">
                                {card.title}
                              </h4>

                              {/* 하단 행: 우선순위 아이콘 박스 + 컬러 도트 라벨 알약 + (+1) + 우측 진행률/댓글 */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <LinearPriorityBadge priority={card.priority} />

                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${labelStyle.pill}`}
                                  >
                                    <span
                                      className={`w-2 h-2 rounded-full ${labelStyle.dot}`}
                                    />
                                    <span>{card.label}</span>
                                  </span>

                                  {card.extraTagsCount && (
                                    <span className="rounded-full border border-zinc-200  bg-white  px-2 py-0.5 font-mono text-[11px] text-klic-muted  tabular-nums">
                                      +{card.extraTagsCount}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2.5">
                                  {card.subtasksTotal !== undefined && (
                                    <SubtaskProgressPie
                                      done={card.subtasksDone || 0}
                                      total={card.subtasksTotal}
                                    />
                                  )}

                                  {card.commentsCount !== undefined && (
                                    <span className="inline-flex items-center gap-1 text-xs text-klic-muted  tabular-nums">
                                      <MessageSquare className="w-3.5 h-3.5 text-klic-muted" />
                                      <span>{card.commentsCount}</span>
                                    </span>
                                  )}

                                  {/* 호버 시 빠른 단계 이동 화살표 */}
                                  <div className="hidden group-hover:inline-flex items-center gap-0.5">
                                    <button
                                      type="button"
                                      onClick={() => moveLinearCard(card.id, 'prev')}
                                      disabled={card.colId === 'backlog'}
                                      className="p-0.5 rounded hover:bg-zinc-100  disabled:opacity-25 text-klic-muted"
                                      title="이전 단계"
                                    >
                                      <ChevronLeft className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => moveLinearCard(card.id, 'next')}
                                      disabled={card.colId === 'in-review'}
                                      className="p-0.5 rounded hover:bg-zinc-100  disabled:opacity-25 text-klic-muted"
                                      title="다음 단계"
                                    >
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* 목록(List) 뷰 */
            <div className="divide-y divide-zinc-200 ">
              {linearIssues.map((issue) => {
                const labelStyle = LINEAR_LABEL_STYLES[issue.label];
                return (
                  <div
                    key={issue.id}
                    className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-zinc-50 "
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <LinearPriorityBadge priority={issue.priority} />
                      <span className="font-mono text-xs text-klic-muted w-16 shrink-0 tabular-nums">
                        {issue.code}
                      </span>
                      <LinearColumnStatusIcon colId={issue.colId} />
                      <span className="text-xs font-medium text-zinc-900  truncate">
                        {issue.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${labelStyle.pill}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${labelStyle.dot}`} />
                        {issue.label}
                      </span>
                      {issue.dueDate && (
                        <span className="text-xs text-klic-muted font-mono tabular-nums">
                          {issue.dueDate}
                        </span>
                      )}
                      <ProfileAvatar
                        src={issue.assigneeAvatar}
                        name={issue.assigneeName}
                        unassigned={issue.unassigned}
                        sizeClass="w-6 h-6"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
       * MODE 1: 애자일 스프린트 WIP 칸반 보드 (KLIC/kanban-1)
       * =================================================================== */}
      {mode === 'sprint' && (
        <div className="rounded-2xl border border-zinc-200  bg-white  overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-zinc-200  flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-600  border border-blue-500/20">
                  <Zap className="w-3 h-3" /> 스프린트 24 · 진행 중 (D-4)
                </span>
                <span className="font-mono text-xs text-klic-muted  tabular-nums">
                  2026.04.06 – 2026.04.19
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100  px-2 py-0.5 text-[11px] font-mono text-zinc-700  tabular-nums">
                  총 스토리 포인트:{' '}
                  <strong>
                    {sprintCards.reduce((acc, c) => acc + c.storyPoints, 0)} SP
                  </strong>
                </span>
              </div>
              <h3 className="mt-1.5 text-base font-bold text-zinc-900 ">
                코어 플랫폼 & 정산 엔진 스프린트 WIP 보드
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center rounded-lg border border-zinc-200  bg-zinc-50  p-0.5 text-xs">
                {['전체', '긴급', '높음', '보통'].map((prio) => (
                  <button
                    key={prio}
                    onClick={() => setSprintPriorityFilter(prio)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      sprintPriorityFilter === prio
                        ? 'bg-white  text-zinc-900  shadow-2xs'
                        : 'text-klic-muted hover:text-zinc-800 '
                    }`}
                  >
                    {prio}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsNewSprintModalOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-klic-inverse  px-3 py-1.5 text-xs font-semibold text-klic-on-emphasis  hover:opacity-90 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" /> 스프린트 이슈 추가
              </button>
            </div>
          </div>

          {isNewSprintModalOpen && (
            <form
              onSubmit={handleAddSprintCard}
              className="p-4 bg-zinc-50  border-b border-zinc-200  flex flex-wrap items-center gap-3"
            >
              <input
                type="text"
                value={newSprintTitle}
                onChange={(e) => setNewSprintTitle(e.target.value)}
                placeholder="새 스프린트 작업 제목 입력 (예: 다중 통화 환율 스냅샷 API 캐싱)..."
                className="flex-1 min-w-[240px] rounded-lg border border-zinc-300  bg-white  px-3 py-1.5 text-xs text-zinc-900 "
                autoFocus
              />
              <select
                value={newSprintPriority}
                onChange={(e) => setNewSprintPriority(e.target.value as '긴급' | '높음' | '보통')}
                className="rounded-lg border border-zinc-300  bg-white  px-2.5 py-1.5 text-xs text-zinc-800 "
              >
                <option value="긴급">우선순위: 긴급</option>
                <option value="높음">우선순위: 높음</option>
                <option value="보통">우선순위: 보통</option>
              </select>
              <select
                value={newSprintPoints}
                onChange={(e) => setNewSprintPoints(Number(e.target.value))}
                className="rounded-lg border border-zinc-300  bg-white  px-2.5 py-1.5 text-xs font-mono text-zinc-800 "
              >
                <option value={2}>2 SP</option>
                <option value={3}>3 SP</option>
                <option value={5}>5 SP</option>
                <option value={8}>8 SP</option>
              </select>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-klic-on-emphasis hover:bg-blue-500"
              >
                등록
              </button>
              <button
                type="button"
                onClick={() => setIsNewSprintModalOpen(false)}
                className="rounded-lg px-2.5 py-1.5 text-xs text-klic-muted hover:text-zinc-800 "
              >
                취소
              </button>
            </form>
          )}

          <div className="p-4 overflow-x-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3.5 min-w-[980px]">
              {SPRINT_COLUMNS.map((col) => {
                const colCards = sprintCards.filter((c) => {
                  if (c.columnId !== col.id) return false;
                  if (sprintPriorityFilter !== '전체' && c.priority !== sprintPriorityFilter) {
                    return false;
                  }
                  if (
                    searchQuery.trim() &&
                    !c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                    !c.key.toLowerCase().includes(searchQuery.toLowerCase()) &&
                    !c.assigneeName.includes(searchQuery)
                  ) {
                    return false;
                  }
                  return true;
                });

                const colSp = colCards.reduce((acc, c) => acc + c.storyPoints, 0);
                const isWipReached = col.wipLimit !== undefined && colCards.length >= col.wipLimit;

                return (
                  <div
                    key={col.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (!draggedSprintCardId) return;
                      setSprintCards((prev) =>
                        prev.map((c) =>
                          c.id === draggedSprintCardId ? { ...c, columnId: col.id } : c
                        )
                      );
                      setDraggedSprintCardId(null);
                    }}
                    className="flex flex-col rounded-xl bg-zinc-50/90  border border-zinc-200/80  p-2.5 min-h-[480px]"
                  >
                    <div className="flex items-center justify-between px-1.5 pb-2.5 mb-2 border-b border-zinc-200/70 ">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${col.dotClass}`} />
                        <span className="text-xs font-bold text-zinc-800 ">
                          {col.title}
                        </span>
                        <span className="rounded-md bg-zinc-200/80  px-1.5 py-0.5 font-mono text-[11px] font-semibold text-zinc-700  tabular-nums">
                          {colCards.length}
                          {col.wipLimit ? `/${col.wipLimit}` : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isWipReached && (
                          <span
                            title="WIP 한도 도달"
                            className="inline-flex items-center gap-0.5 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600  border border-amber-500/30"
                          >
                            <AlertTriangle className="w-2.5 h-2.5" /> WIP
                          </span>
                        )}
                        <span className="font-mono text-[11px] text-klic-muted  tabular-nums">
                          {colSp} SP
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2.5 flex-1">
                      {colCards.map((card) => {
                        const prioClass =
                          card.priority === '긴급'
                            ? 'bg-blue-500/10 text-blue-600  border-blue-500/25'
                            : card.priority === '높음'
                            ? 'bg-amber-500/10 text-amber-600  border-amber-500/25'
                            : 'bg-zinc-500/10 text-klic-muted  border-zinc-500/20';

                        return (
                          <div
                            key={card.id}
                            draggable
                            onDragStart={() => setDraggedSprintCardId(card.id)}
                            className={`group rounded-xl border border-zinc-200  bg-white  ${cardPadding} shadow-2xs hover:border-zinc-300  transition-all cursor-grab active:cursor-grabbing`}
                          >
                            <div className="flex items-center justify-between gap-1.5 mb-2">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[11px] font-semibold text-klic-muted  tabular-nums">
                                  {card.key}
                                </span>
                                <span
                                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border ${prioClass}`}
                                >
                                  {card.priority}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="rounded-md bg-zinc-100  border border-zinc-200  px-1.5 py-0.5 font-mono text-[10px] font-bold text-zinc-700  tabular-nums">
                                  {card.storyPoints} SP
                                </span>
                                <ProfileAvatar
                                  src={card.assigneeAvatar}
                                  name={card.assigneeName}
                                  sizeClass="w-5 h-5"
                                />
                              </div>
                            </div>

                            <p className="text-xs font-semibold text-zinc-900  leading-snug mb-2.5">
                              {card.title}
                            </p>

                            <div className="flex flex-wrap items-center gap-1.5 mb-3">
                              <span
                                className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium border ${card.tagColor}`}
                              >
                                {card.tag}
                              </span>
                              {card.prNumber && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100  px-1.5 py-0.5 font-mono text-[10px] text-klic-muted  border border-zinc-200/70 ">
                                  <GitPullRequest className="w-2.5 h-2.5 text-blue-500" />
                                  {card.prNumber} · {card.prStatus}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 ">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-medium text-klic-muted ">
                                  {card.assigneeName}
                                </span>
                                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-klic-muted  tabular-nums">
                                  <CheckSquare className="w-3 h-3 text-klic-muted" />
                                  {card.subtasksDone}/{card.subtasksTotal}
                                </span>
                                <span className="text-[11px] text-klic-muted  tabular-nums">
                                  {card.dueDate}
                                </span>
                              </div>

                              <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={() => moveSprintCard(card.id, 'prev')}
                                  disabled={card.columnId === 'backlog'}
                                  title="이전 단계로 이동"
                                  className="p-1 rounded hover:bg-zinc-100  disabled:opacity-25 text-klic-muted "
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveSprintCard(card.id, 'next')}
                                  disabled={card.columnId === 'done'}
                                  title="다음 단계로 이동"
                                  className="p-1 rounded hover:bg-zinc-100  disabled:opacity-25 text-klic-muted "
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
       * MODE 2: 스쿼드 스윔레인 칸반 보드 (KLIC/kanban-2)
       * =================================================================== */}
      {mode === 'swimlane' && (
        <div className="rounded-2xl border border-zinc-200  bg-white  overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-zinc-200  flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-600  border border-blue-500/20">
                  <Layers className="w-3 h-3" /> 멀티 트랙 스윔레인
                </span>
                <span className="text-xs text-klic-muted ">
                  3개 엔지니어링 스쿼드 · 총 {swimlaneCards.length}개 이니셔티브
                </span>
              </div>
              <h3 className="mt-1 text-base font-bold text-zinc-900 ">
                스쿼드 & 우선순위 가로 스윔레인 칸반 보드
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg border border-zinc-200  bg-zinc-50  p-0.5 text-xs">
                <button
                  onClick={() => setSwimlaneGroupBy('squad')}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    swimlaneGroupBy === 'squad'
                      ? 'bg-white  text-zinc-900  shadow-2xs'
                      : 'text-klic-muted'
                  }`}
                >
                  담당 스쿼드별 스윔레인
                </button>
                <button
                  onClick={() => setSwimlaneGroupBy('priority')}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    swimlaneGroupBy === 'priority'
                      ? 'bg-white  text-zinc-900  shadow-2xs'
                      : 'text-klic-muted'
                  }`}
                >
                  우선순위별 스윔레인
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 overflow-x-auto space-y-4">
            <div className="grid grid-cols-4 gap-3 min-w-[880px] px-2">
              {SWIMLANE_COLS.map((col) => {
                const count = swimlaneCards.filter((c) => c.colId === col.id).length;
                return (
                  <div
                    key={col.id}
                    className="flex items-center justify-between rounded-lg bg-zinc-100/80  px-3 py-2 border border-zinc-200/70 "
                  >
                    <span className="text-xs font-bold text-zinc-800 ">
                      {col.label}
                    </span>
                    <span className="rounded bg-white  px-1.5 py-0.5 font-mono text-[11px] font-semibold text-klic-muted  tabular-nums">
                      {count}건
                    </span>
                  </div>
                );
              })}
            </div>

            {(swimlaneGroupBy === 'squad'
              ? SWIMLANE_SQUADS.map((sq) => ({
                  laneKey: sq.id,
                  title: sq.name,
                  leadAvatar: sq.leadAvatar,
                  subtitle: `${sq.lead} · 목표: ${sq.sprintGoal}`,
                  badgeClass: sq.badgeClass,
                  cards: swimlaneCards.filter((c) => c.squadId === sq.id),
                }))
              : (['긴급', '높음', '보통'] as const).map((prio) => ({
                  laneKey: prio,
                  title: `${prio} 우선순위 트랙`,
                  leadAvatar:
                    prio === '긴급'
                      ? AVATAR_POOL.marcus
                      : prio === '높음'
                      ? AVATAR_POOL.leila
                      : AVATAR_POOL.lucas,
                  subtitle:
                    prio === '긴급'
                      ? 'SLA 직결 및 프로덕션 블로커 최우선 해결 트랙'
                      : prio === '높음'
                      ? '이번 스프린트 내 필수 배포 목표 작업'
                      : '일반 기능 개선 및 기술 부채 해소 트랙',
                  badgeClass:
                    prio === '긴급'
                      ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                      : prio === '높음'
                      ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      : 'bg-zinc-500/10 text-klic-muted border-zinc-500/20',
                  cards: swimlaneCards.filter((c) => c.priority === prio),
                }))
            ).map((lane) => {
              const isCollapsed = !!collapsedSquads[lane.laneKey];
              const totalSp = lane.cards.reduce((a, b) => a + b.sp, 0);
              const doneSp = lane.cards
                .filter((c) => c.colId === 'released')
                .reduce((a, b) => a + b.sp, 0);
              const pct = totalSp > 0 ? Math.round((doneSp / totalSp) * 100) : 0;

              return (
                <div
                  key={lane.laneKey}
                  className="min-w-[880px] rounded-xl border border-zinc-200  bg-zinc-50/50  overflow-hidden"
                >
                  <div
                    onClick={() =>
                      setCollapsedSquads((prev) => ({
                        ...prev,
                        [lane.laneKey]: !prev[lane.laneKey],
                      }))
                    }
                    className="flex items-center justify-between px-4 py-3 bg-zinc-100/70  border-b border-zinc-200/70  cursor-pointer hover:bg-zinc-100 "
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      {isCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-klic-muted" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-klic-muted" />
                      )}
                      <ProfileAvatar
                        src={lane.leadAvatar}
                        name={lane.title}
                        sizeClass="w-6 h-6"
                      />
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-bold border ${lane.badgeClass}`}
                      >
                        {lane.title}
                      </span>
                      <span className="text-xs text-klic-muted ">
                        {lane.subtitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-klic-muted  tabular-nums">
                        {doneSp}/{totalSp} SP ({pct}%)
                      </span>
                      <div className="w-24 h-1.5 rounded-full bg-zinc-200  overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div className="grid grid-cols-4 gap-3 p-3">
                      {SWIMLANE_COLS.map((col) => {
                        const cellCards = lane.cards.filter(
                          (c) =>
                            c.colId === col.id &&
                            (!searchQuery.trim() ||
                              c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              c.code.toLowerCase().includes(searchQuery.toLowerCase()))
                        );

                        return (
                          <div
                            key={col.id}
                            className="space-y-2 min-h-[120px] rounded-lg bg-white/70  border border-zinc-200/60  p-2"
                          >
                            {cellCards.map((card) => (
                              <div
                                key={card.id}
                                className="rounded-lg border border-zinc-200  bg-white  p-3 shadow-2xs hover:border-zinc-300  transition-all"
                              >
                                <div className="flex items-center justify-between gap-1 mb-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-[10px] font-bold text-klic-muted tabular-nums">
                                      {card.code}
                                    </span>
                                    {card.blocked && (
                                      <span className="rounded bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 ">
                                        차단됨
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-[10px] font-semibold text-klic-muted tabular-nums">
                                      {card.sp} SP
                                    </span>
                                    <ProfileAvatar
                                      src={card.ownerAvatar}
                                      name={card.owner}
                                      sizeClass="w-5 h-5"
                                    />
                                  </div>
                                </div>

                                <p className="text-xs font-semibold text-zinc-900  leading-snug mb-2">
                                  {card.title}
                                </p>

                                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 ">
                                  <span className="font-mono text-[10px] text-klic-muted">
                                    {card.owner} · {card.envTag}
                                  </span>

                                  <div className="flex items-center gap-0.5">
                                    <button
                                      type="button"
                                      onClick={() => moveSwimlaneCard(card.id, 'prev')}
                                      disabled={card.colId === 'todo'}
                                      className="p-0.5 rounded hover:bg-zinc-100  disabled:opacity-25 text-klic-muted"
                                    >
                                      <ChevronLeft className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => moveSwimlaneCard(card.id, 'next')}
                                      disabled={card.colId === 'released'}
                                      className="p-0.5 rounded hover:bg-zinc-100  disabled:opacity-25 text-klic-muted"
                                    >
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
       * MODE 3: B2B 세일즈 딜 파이프라인 보드 (KLIC/kanban-3)
       * =================================================================== */}
      {mode === 'crm' && (
        <div className="rounded-2xl border border-zinc-200  bg-white  overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200  border-b border-zinc-200  bg-zinc-50/50 ">
            <div className="p-4">
              <div className="text-xs text-klic-muted ">총 파이프라인 규모 (ARR)</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-zinc-900  tabular-nums">
                  ₩{crmSummary.totalArr}억
                </span>
                <span className="text-[11px] font-semibold text-blue-600 ">
                  {crmDeals.length}개 활성 딜
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="text-xs text-klic-muted ">성사 확률 가중 예상 매출</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-blue-600  tabular-nums">
                  ₩{crmSummary.weightedArr}억
                </span>
                <span className="text-[11px] text-klic-muted">단계별 성사율 반영</span>
              </div>
            </div>
            <div className="p-4">
              <div className="text-xs text-klic-muted ">확정 수주액</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-blue-600  tabular-nums">
                  ₩{crmSummary.wonArr}억
                </span>
                <span className="text-[11px] font-semibold text-blue-600">Q2 목표의 84%</span>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-klic-muted ">평균 계약 단가 (ACV)</div>
                <div className="mt-1 text-xl font-bold font-mono text-zinc-900  tabular-nums">
                  ₩{crmSummary.avgArr}억
                </div>
              </div>
              <button
                onClick={() => setIsNewDealOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-klic-inverse  px-3 py-2 text-xs font-semibold text-klic-on-emphasis "
              >
                <Plus className="w-3.5 h-3.5" /> 신규 딜 등록
              </button>
            </div>
          </div>

          {isNewDealOpen && (
            <form
              onSubmit={handleAddCrmDeal}
              className="p-4 bg-zinc-50  border-b border-zinc-200  flex flex-wrap items-center gap-3"
            >
              <input
                type="text"
                value={newDealCompany}
                onChange={(e) => setNewDealCompany(e.target.value)}
                placeholder="고객사명 (예: 쿠팡 풀필먼트)"
                className="rounded-lg border border-zinc-300  bg-white  px-3 py-1.5 text-xs"
                autoFocus
              />
              <input
                type="text"
                value={newDealTitle}
                onChange={(e) => setNewDealTitle(e.target.value)}
                placeholder="기회 제목 (예: 물류 관제 대시보드 연간 라이선스)"
                className="flex-1 min-w-[220px] rounded-lg border border-zinc-300  bg-white  px-3 py-1.5 text-xs"
              />
              <input
                type="number"
                step="0.1"
                value={newDealArr}
                onChange={(e) => setNewDealArr(e.target.value)}
                placeholder="연간 금액(억)"
                className="w-28 rounded-lg border border-zinc-300  bg-white  px-3 py-1.5 text-xs font-mono"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-klic-on-emphasis"
              >
                파이프라인 추가
              </button>
            </form>
          )}

          <div className="px-4 py-2.5 border-b border-zinc-200  flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {['전체', 'Strategic', 'Enterprise', 'Mid-Market'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setCrmTierFilter(tier)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    crmTierFilter === tier
                      ? 'bg-klic-inverse text-klic-on-emphasis  '
                      : 'text-klic-muted hover:bg-zinc-100 '
                  }`}
                >
                  {({ 전체: '전체 고객군', Strategic: '전략 고객', Enterprise: '엔터프라이즈', 'Mid-Market': '중견 고객' } as Record<string, string>)[tier]}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-klic-muted">
              카드를 드래그하거나 화살표 버튼을 눌러 성사 확률 및 가중 매출을 시뮬레이션하세요
            </span>
          </div>

          <div className="p-4 overflow-x-auto">
            <div className="grid grid-cols-5 gap-3.5 min-w-[1020px]">
              {DEAL_STAGES.map((stage) => {
                const stageDeals = crmDeals.filter(
                  (d) =>
                    d.stageId === stage.id &&
                    (crmTierFilter === '전체' || d.tier === crmTierFilter) &&
                    (!searchQuery.trim() ||
                      d.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      d.dealTitle.toLowerCase().includes(searchQuery.toLowerCase()))
                );
                const stageSum = stageDeals.reduce((a, b) => a + b.arrMillions, 0);

                return (
                  <div
                    key={stage.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (!draggedDealId) return;
                      setCrmDeals((prev) =>
                        prev.map((d) =>
                          d.id === draggedDealId
                            ? { ...d, stageId: stage.id, probability: stage.defaultProb }
                            : d
                        )
                      );
                      setDraggedDealId(null);
                    }}
                    className="flex flex-col rounded-xl bg-zinc-50/90  border border-zinc-200/80  p-2.5 min-h-[460px]"
                  >
                    <div className="pb-2.5 mb-2.5 border-b border-zinc-200 ">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-900 ">
                          {stage.title}
                        </span>
                        <span className="font-mono text-[11px] font-semibold text-klic-muted tabular-nums">
                          {stage.defaultProb}%
                        </span>
                      </div>
                      <div className="mt-1 flex items-baseline justify-between">
                        <span className="font-mono text-sm font-bold text-zinc-900  tabular-nums">
                          ₩{stageSum.toFixed(1)}억
                        </span>
                        <span className="text-[11px] text-klic-muted tabular-nums">
                          {stageDeals.length}건
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2.5 flex-1">
                      {stageDeals.map((deal) => (
                        <div
                          key={deal.id}
                          draggable
                          onDragStart={() => setDraggedDealId(deal.id)}
                          className="rounded-xl border border-zinc-200  bg-white  p-3 shadow-2xs hover:border-zinc-300  cursor-grab"
                        >
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="text-xs font-bold text-zinc-900  flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5 text-klic-muted" />
                              {deal.companyName}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {deal.hotDeal && (
                                <span className="inline-flex items-center gap-0.5 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 ">
                                  <Flame className="w-2.5 h-2.5" /> 핵심
                                </span>
                              )}
                              <ProfileAvatar
                                src={deal.ownerAvatar}
                                name={deal.ownerName}
                                sizeClass="w-5 h-5"
                              />
                            </div>
                          </div>

                          <p className="text-xs text-klic-muted  leading-snug mb-2.5">
                            {deal.dealTitle}
                          </p>

                          <div className="flex items-center justify-between rounded-lg bg-zinc-50  px-2.5 py-1.5 mb-2">
                            <div>
                              <div className="text-[10px] text-klic-muted">연간 계약 금액 (ARR)</div>
                              <div className="font-mono text-xs font-bold text-zinc-900  tabular-nums">
                                ₩{deal.arrMillions.toFixed(1)}억
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] text-klic-muted">성사 확률 · 시트</div>
                              <div className="font-mono text-xs font-semibold text-blue-600  tabular-nums">
                                {deal.probability}% · {deal.seats}석
                              </div>
                            </div>
                          </div>

                          <div className="text-[11px] text-klic-muted  mb-2 truncate">
                            다음 단계: {deal.nextStep}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 ">
                            <span className="text-[11px] font-medium text-klic-muted ">
                              {deal.ownerName} · <span className="font-mono">{deal.closeDate}</span>
                            </span>
                            <div className="flex items-center gap-0.5">
                              <button
                                type="button"
                                onClick={() => moveCrmDeal(deal.id, 'prev')}
                                disabled={deal.stageId === 'discovery'}
                                className="p-1 rounded hover:bg-zinc-100  disabled:opacity-25 text-klic-muted"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveCrmDeal(deal.id, 'next')}
                                disabled={deal.stageId === 'won'}
                                className="p-1 rounded hover:bg-zinc-100  disabled:opacity-25 text-klic-muted"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
       * MODE 4: SRE 인시던트 트리아지 보드 (KLIC/kanban-4)
       * =================================================================== */}
      {mode === 'incident' && (
        <div className="rounded-2xl border border-zinc-200  bg-white  overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-zinc-200  flex flex-wrap items-center justify-between gap-4 bg-blue-500/[0.03] ">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/15 px-2 py-0.5 text-[11px] font-bold text-blue-600  border border-blue-500/30">
                  <ShieldAlert className="w-3.5 h-3.5" /> 실시간 장애 대응 상황실
                </span>
                <span className="font-mono text-xs text-klic-muted tabular-nums">
                  평균 인지(MTTA): 2분 14초 · 평균 복구(MTTR): 18분 40초
                </span>
              </div>
              <h3 className="mt-1.5 text-base font-bold text-zinc-900 ">
                SRE 인시던트 트리아지 & 온콜 에스컬레이션 보드
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              {['전체', 'Sev 1', 'Sev 2', 'Sev 3'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSevFilter(sev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    sevFilter === sev
                      ? 'bg-klic-inverse text-klic-on-emphasis  '
                      : 'border border-zinc-200  text-klic-muted '
                  }`}
                >
                  {sev === '전체' ? '전체' : sev.replace('Sev ', '심각도 ')}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 overflow-x-auto">
            <div className="grid grid-cols-4 gap-3.5 min-w-[960px]">
              {INCIDENT_STAGES.map((stage) => {
                const stageIncs = incidents.filter(
                  (inc) =>
                    inc.stageId === stage.id &&
                    (sevFilter === '전체' || inc.severity === sevFilter) &&
                    (!searchQuery.trim() ||
                      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      inc.incCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      inc.serviceName.toLowerCase().includes(searchQuery.toLowerCase()))
                );

                return (
                  <div
                    key={stage.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (!draggedIncidentId) return;
                      setIncidents((prev) =>
                        prev.map((inc) =>
                          inc.id === draggedIncidentId ? { ...inc, stageId: stage.id } : inc
                        )
                      );
                      setDraggedIncidentId(null);
                    }}
                    className="flex flex-col rounded-xl bg-zinc-50/90  border border-zinc-200/80  p-3 min-h-[440px]"
                  >
                    <div className="pb-2.5 mb-3 border-b border-zinc-200 ">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${stage.dotClass}`} />
                          <span className="text-xs font-bold text-zinc-900 ">
                            {stage.title}
                          </span>
                        </div>
                        <span className="rounded bg-zinc-200  px-1.5 py-0.5 font-mono text-[11px] font-bold tabular-nums">
                          {stageIncs.length}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-klic-muted">{stage.subtitle}</p>
                    </div>

                    <div className="space-y-2.5 flex-1">
                      {stageIncs.map((inc) => {
                        const sevBadge =
                          inc.severity === 'Sev 1'
                            ? 'bg-blue-600 text-klic-on-emphasis'
                            : inc.severity === 'Sev 2'
                            ? 'bg-amber-500 text-klic-on-emphasis'
                            : 'bg-blue-600 text-klic-on-emphasis';

                        return (
                          <div
                            key={inc.id}
                            draggable
                            onDragStart={() => setDraggedIncidentId(inc.id)}
                            className="rounded-xl border border-zinc-200  bg-white  p-3.5 shadow-2xs hover:border-zinc-300  cursor-grab"
                          >
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-1.5">
                                <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${sevBadge}`}>
                                  {inc.severity.replace('Sev ', '심각도 ')}
                                </span>
                                <span className="font-mono text-xs font-bold text-zinc-700  tabular-nums">
                                  {inc.incCode}
                                </span>
                              </div>
                              <span
                                className={`font-mono text-[10px] font-semibold tabular-nums ${
                                  inc.slaBreachRisk
                                    ? 'text-blue-600 '
                                    : 'text-klic-muted'
                                }`}
                              >
                                {inc.elapsedText}
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-zinc-900  leading-snug mb-2.5">
                              {inc.title}
                            </p>

                            <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                              <span className="inline-flex items-center gap-1 rounded bg-zinc-100  px-1.5 py-0.5 font-mono text-[10px] text-zinc-700 ">
                                <Terminal className="w-2.5 h-2.5 text-klic-muted" />
                                {inc.serviceName}
                              </span>
                              <span className="rounded bg-blue-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-blue-600 ">
                                {inc.errorRateText}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 ">
                              <div className="flex items-center gap-2">
                                <ProfileAvatar
                                  src={inc.commanderAvatar}
                                  name={inc.commander}
                                  sizeClass="w-5 h-5"
                                />
                                <span className="text-[11px] text-klic-muted ">
                                  {inc.commander} · <span className="font-mono">{inc.warRoom}</span>
                                </span>
                              </div>

                              <div className="flex items-center gap-0.5">
                                <button
                                  type="button"
                                  onClick={() => moveIncidentStage(inc.id, 'prev')}
                                  disabled={inc.stageId === 'detected'}
                                  className="p-1 rounded hover:bg-zinc-100  disabled:opacity-25 text-klic-muted"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveIncidentStage(inc.id, 'next')}
                                  disabled={inc.stageId === 'postmortem'}
                                  className="p-1 rounded hover:bg-zinc-100  disabled:opacity-25 text-klic-muted"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
       * MODE 5: 채용 파이프라인 (ATS) 보드 (KLIC/kanban-5)
       * =================================================================== */}
      {mode === 'hiring' && (
        <div className="rounded-2xl border border-zinc-200  bg-white  overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-zinc-200  flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-600  border border-blue-500/20">
                  <Briefcase className="w-3 h-3" /> 2026 상반기 핵심 인재 채용 (ATS)
                </span>
                <span className="font-mono text-xs text-klic-muted tabular-nums">
                  오퍼 수락률 91.4% · 평균 채용 리드타임 19일
                </span>
              </div>
              <h3 className="mt-1.5 text-base font-bold text-zinc-900 ">
                엔지니어링 & 프로덕트 채용 파이프라인 보드
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {['전체 직군', '시니어 백엔드', '프론트엔드 코어', '클라우드 SRE', '프로덕트 디자이너'].map(
                (dept) => (
                  <button
                    key={dept}
                    onClick={() => setDeptFilter(dept)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      deptFilter === dept
                        ? 'bg-klic-inverse text-klic-on-emphasis  '
                        : 'border border-zinc-200  text-klic-muted '
                    }`}
                  >
                    {dept}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="p-4 overflow-x-auto">
            <div className="grid grid-cols-5 gap-3.5 min-w-[1020px]">
              {HIRING_STAGES.map((stage) => {
                const stageCands = candidates.filter(
                  (c) =>
                    c.stageId === stage.id &&
                    (deptFilter === '전체 직군' || c.department === deptFilter) &&
                    (!searchQuery.trim() ||
                      c.name.includes(searchQuery) ||
                      c.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()))
                );

                return (
                  <div
                    key={stage.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (!draggedCandidateId) return;
                      setCandidates((prev) =>
                        prev.map((c) =>
                          c.id === draggedCandidateId ? { ...c, stageId: stage.id } : c
                        )
                      );
                      setDraggedCandidateId(null);
                    }}
                    className="flex flex-col rounded-xl bg-zinc-50/90  border border-zinc-200/80  p-2.5 min-h-[450px]"
                  >
                    <div className="flex items-center justify-between px-1.5 pb-2.5 mb-2.5 border-b border-zinc-200 ">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${stage.accentColor}`} />
                        <span className="text-xs font-bold text-zinc-900 ">
                          {stage.title}
                        </span>
                      </div>
                      <span className="rounded bg-zinc-200  px-1.5 py-0.5 font-mono text-[11px] font-bold tabular-nums">
                        {stageCands.length}명
                      </span>
                    </div>

                    <div className="space-y-2.5 flex-1">
                      {stageCands.map((cand) => (
                        <div
                          key={cand.id}
                          draggable
                          onDragStart={() => setDraggedCandidateId(cand.id)}
                          className="rounded-xl border border-zinc-200  bg-white  p-3 shadow-2xs hover:border-zinc-300  cursor-grab"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <ProfileAvatar
                                src={cand.avatar}
                                name={cand.name}
                                sizeClass="w-7 h-7"
                              />
                              <div>
                                <div className="text-xs font-bold text-zinc-900 ">
                                  {cand.name}
                                </div>
                                <div className="text-[10px] text-klic-muted">{cand.department}</div>
                              </div>
                            </div>
                            <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-500/10 px-1.5 py-0.5 font-mono text-[11px] font-bold text-amber-600  border border-amber-500/20 tabular-nums">
                              ★ {cand.score.toFixed(1)}
                            </span>
                          </div>

                          <div className="text-[11px] font-medium text-zinc-700  mb-2">
                            {cand.experienceText}
                          </div>

                          <div className="flex flex-wrap gap-1 mb-2">
                            {cand.skills.map((sk) => (
                              <span
                                key={({ 'Figma Tokens': 'Figma 토큰', 'Design Ops': '디자인 운영', 'PostgreSQL Internals': 'PostgreSQL 내부 구조', Performance: '성능 최적화', 'SLO/Error Budget': 'SLO/오류 예산', 'B2B Workflow': 'B2B 업무 흐름', 'Design System': '디자인 시스템', Prototyping: '프로토타이핑', Accessibility: '접근성', Monorepo: '모노레포' } as Record<string, string>)[sk] || sk}
                                className="rounded bg-zinc-100  px-1.5 py-0.5 font-mono text-[10px] text-klic-muted "
                              >
                                {({ 'Figma Tokens': 'Figma 토큰', 'Design Ops': '디자인 운영', 'PostgreSQL Internals': 'PostgreSQL 내부 구조', Performance: '성능 최적화', 'SLO/Error Budget': 'SLO/오류 예산', 'B2B Workflow': 'B2B 업무 흐름', 'Design System': '디자인 시스템', Prototyping: '프로토타이핑', Accessibility: '접근성', Monorepo: '모노레포' } as Record<string, string>)[sk] || sk}
                              </span>
                            ))}
                          </div>

                          <p className="text-[11px] text-klic-muted  bg-zinc-50  rounded-lg p-2 mb-2 leading-relaxed">
                            “{cand.note}”
                          </p>

                          <div className="flex items-center justify-between pt-1.5 border-t border-zinc-100 ">
                            <span className="text-[10px] text-klic-muted">
                              {cand.source} · 면접관 {cand.EvaluatorsCount}명 평가
                            </span>
                            <div className="flex items-center gap-0.5">
                              <button
                                type="button"
                                onClick={() => moveCandidateStage(cand.id, 'prev')}
                                disabled={cand.stageId === 'screening'}
                                className="p-1 rounded hover:bg-zinc-100  disabled:opacity-25 text-klic-muted"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveCandidateStage(cand.id, 'next')}
                                disabled={cand.stageId === 'offer'}
                                className="p-1 rounded hover:bg-zinc-100  disabled:opacity-25 text-klic-muted"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
