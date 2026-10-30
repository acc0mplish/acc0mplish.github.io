import { PersonAvatar } from '../PersonAvatar';
import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Check,
  RotateCcw,
  Play,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  List,
  LayoutGrid,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  ShieldCheck,
  Clock,
  Building2,
  Bot,
} from 'lucide-react';

export type LifecycleStageId =
  | 'detected'
  | 'investigating'
  | 'proposed'
  | 'awaiting_approval'
  | 'executing'
  | 'verified'
  | 'failed'
  | 'rolled_back';

export type FilterTabId =
  | 'all_open'
  | 'needs_you'
  | 'executing'
  | 'failed'
  | 'rolled_back';

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  avatar: string;
  supervisor: string;
  badgeColor: string;
}

export interface LifecycleTaskItem {
  id: string;
  code: string;
  title: string;
  subtitle?: string;
  agentId: string;
  stage: LifecycleStageId;
  /** 1 ~ 6 단계 진행 위치 */
  stepIndex: number;
  recordName: string;
  recordCategory: string;
  updatedAt: string;
  confidenceScore?: number;
  proposedAction?: string;
}

interface TaskLifecycleBlockProps {
  density?: 'compact' | 'normal' | 'relaxed';
}

export const AGENT_ROSTER: Record<string, AgentInfo> = {
  atlas: {
    id: 'atlas',
    name: '아틀라스',
    role: '물류·풀필먼트',
    supervisor: '박준영 리드',
    avatar:
      './placeholders/avatar-d36430bc2634.svg',
    badgeColor: 'bg-blue-500/10 text-blue-700  border-blue-500/20',
  },
  ledger: {
    id: 'ledger',
    name: '레저',
    role: '재무·정산',
    supervisor: '이하은 매니저',
    avatar:
      './placeholders/avatar-576a55580552.svg',
    badgeColor: 'bg-blue-500/10 text-blue-700  border-blue-500/20',
  },
  mia: {
    id: 'mia',
    name: '미아',
    role: '고객지원·CX',
    supervisor: '정유진 매니저',
    avatar:
      './placeholders/avatar-ef94a3ac14b1.svg',
    badgeColor: 'bg-blue-500/10 text-blue-700  border-blue-500/20',
  },
  nova: {
    id: 'nova',
    name: '노바',
    role: '세일즈·갱신',
    supervisor: '강태우 디렉터',
    avatar:
      './placeholders/avatar-352373979408.svg',
    badgeColor: 'bg-amber-500/10 text-amber-700  border-amber-500/20',
  },
};

export const LIFECYCLE_BAR_STAGES: {
  id: LifecycleStageId;
  label: string;
  step: number;
  baseCount: number;
  barColor: string;
  dotColor: string;
}[] = [
  {
    id: 'detected',
    label: '감지됨',
    step: 1,
    baseCount: 8,
    barColor: 'bg-[var(--klic-component-block-color-accent)] ',
    dotColor: 'bg-[var(--klic-component-block-color-accent)] ',
  },
  {
    id: 'investigating',
    label: '원인 분석 중',
    step: 2,
    baseCount: 14,
    barColor: 'bg-[var(--klic-component-block-color-accent)] ',
    dotColor: 'bg-[var(--klic-component-block-color-accent)] ',
  },
  {
    id: 'proposed',
    label: '해결책 제안됨',
    step: 3,
    baseCount: 11,
    barColor: 'bg-[var(--klic-component-block-color-accent)] ',
    dotColor: 'bg-[var(--klic-component-block-color-accent)] ',
  },
  {
    id: 'awaiting_approval',
    label: '승인 대기 중',
    step: 4,
    baseCount: 9,
    barColor: 'bg-[var(--klic-component-block-color-warning)] ',
    dotColor: 'bg-[var(--klic-component-block-color-warning)] ',
  },
  {
    id: 'executing',
    label: '실행 중',
    step: 5,
    baseCount: 39,
    barColor: 'bg-[var(--klic-component-block-color-accent)] ',
    dotColor: 'bg-[var(--klic-component-block-color-accent)] ',
  },
  {
    id: 'verified',
    label: '오늘 검증 완료',
    step: 6,
    baseCount: 47,
    barColor: 'bg-[var(--klic-component-block-color-accent)] ',
    dotColor: 'bg-[var(--klic-component-block-color-accent)] ',
  },
];

export const INITIAL_LIFECYCLE_TASKS: LifecycleTaskItem[] = [
  {
    id: 'tsk-4821',
    code: 'TSK 4821',
    title: '지연된 화물 출고 건 #4821 원인 조사 및 대체 배차 승인',
    agentId: 'atlas',
    stage: 'awaiting_approval',
    stepIndex: 4,
    recordName: '한진 스마트물류',
    recordCategory: '화물 운송 원장',
    updatedAt: '09:31',
    confidenceScore: 96,
    proposedAction: '기존 냉동 컨테이너 지연으로 인해 부산항 제2터미널 대체 운송사(한진 콜드체인)로 즉시 재배차 품의',
  },
  {
    id: 'tsk-4822',
    code: 'TSK 4822',
    title: '10월 13일자 가맹점 일일 정산 대사(Reconciliation) 실행',
    agentId: 'ledger',
    stage: 'executing',
    stepIndex: 5,
    recordName: '네이버페이 정산 원장',
    recordCategory: '결제 대사 배치',
    updatedAt: '09:38',
    confidenceScore: 99,
    proposedAction: '총 14,820건 카드 매출 전표와 PG사 정산 입금액 자동 대사 및 수수료 편차 0.02% 이내 정상 확인 중',
  },
  {
    id: 'tsk-4815',
    code: 'TSK 4815',
    title: '한빛 AI 랩스 기술 문의 티켓 급증 현상 트리아지',
    agentId: 'mia',
    stage: 'investigating',
    stepIndex: 2,
    recordName: '한빛 AI 랩스',
    recordCategory: '엔터프라이즈 고객사',
    updatedAt: '09:22',
    confidenceScore: 91,
    proposedAction: '최근 2시간 내 유입된 웹훅 타임아웃 티켓 19건의 공통 에러 로그(v2.4.1 SDK 인증 헤더 누락) 상관관계 분석 중',
  },
  {
    id: 'tsk-4818',
    code: 'TSK 4818',
    title: '무신사 시스템즈 연간 엔터프라이즈 계약 갱신 조건 발송',
    agentId: 'nova',
    stage: 'awaiting_approval',
    stepIndex: 4,
    recordName: '무신사 시스템즈',
    recordCategory: '갱신 계약서 #RN-892',
    updatedAt: '09:05',
    confidenceScore: 94,
    proposedAction: '시트 150석 증설 포함 연간 약정 12% 할인 오퍼 견적서 생성 완료 · 세일즈 디렉터 최종 승인 대기',
  },
  {
    id: 'tsk-4817',
    code: 'TSK 4817',
    title: '이천 풀필먼트 센터 안전재고 미달 4개 핵심 SKU 자동 발주',
    agentId: 'atlas',
    stage: 'executing',
    stepIndex: 5,
    recordName: '이천 풀필먼트 센터',
    recordCategory: '재고 보충 발주서',
    updatedAt: '08:58',
    confidenceScore: 98,
    proposedAction: '안전재고 임계치(15%) 하회 품목 4종에 대해 1차 공급사 ERP로 EDI 발주서 전송 및 입고 예정일 수신 중',
  },
  {
    id: 'tsk-4816',
    code: 'TSK 4816',
    title: '이상 단가 감지 인보이스 INV-2291 지급 보류 플래그 설정',
    agentId: 'ledger',
    stage: 'awaiting_approval',
    stepIndex: 4,
    recordName: '올리브영 커머스',
    recordCategory: '매입 채무 인보이스',
    updatedAt: '08:44',
    confidenceScore: 97,
    proposedAction: '기존 단가 대비 +18.4% 초과 청구된 항목 감지 · 자동 이체 배치 제외 및 공급사 소명 요청 메일 발송 승인 대기',
  },
  {
    id: 'tsk-4819',
    code: 'TSK 4819',
    title: '야간 인입 신규 기술지원 티켓 14건 자동 응답 및 해결 검증',
    agentId: 'mia',
    stage: 'verified',
    stepIndex: 6,
    recordName: '기술지원 인박스',
    recordCategory: '글로벌 헬프데스크',
    updatedAt: '08:12',
    confidenceScore: 100,
    proposedAction: '14건 전수 API 키 재발급 가이드 및 패치 노트 안내 완료 · 고객 만족도(CSAT) 긍정 응답 확인',
  },
  {
    id: 'tsk-4814',
    code: 'TSK 4814',
    title: '클라우드 보안 웨비나 유입 인바운드 리드 22건 스코어링 산정',
    agentId: 'nova',
    stage: 'verified',
    stepIndex: 6,
    recordName: '세일즈 파이프라인',
    recordCategory: 'CRM 리드 큐',
    updatedAt: '08:20',
    confidenceScore: 99,
    proposedAction: '기업 규모 및 제품 데모 체류 시간 기반 MQL 상위 8개 계정 추출 및 담당 AE 자동 배정 검증 완료',
  },
  {
    id: 'tsk-4813',
    code: 'TSK 4813',
    title: '운송사 API 타임아웃 발생 38건 도착예정시간(ETA) 재동기화',
    subtitle: '운송사 게이트웨이 응답 지연 (HTTP 504) · 10:00 자동 재시도 예약됨',
    agentId: 'atlas',
    stage: 'failed',
    stepIndex: 5,
    recordName: '대한통운 화물 API',
    recordCategory: '외부 연동 커넥터',
    updatedAt: '08:05',
    confidenceScore: 82,
    proposedAction: '백오프(Exponential Backoff) 정책에 따라 10:00 정각 보조 미러 엔드포인트로 재동기화 실행 예정',
  },
  {
    id: 'tsk-4811',
    code: 'TSK 4811',
    title: '엔터프라이즈 고객사 40곳 분기 비즈니스 리뷰(QBR) 초대장 일괄 발송',
    subtitle: '07:44 박준영 리드에 의해 실행 취소 및 이전 상태로 롤백됨',
    agentId: 'nova',
    stage: 'rolled_back',
    stepIndex: 5,
    recordName: '고객 성공팀',
    recordCategory: 'QBR 캠페인 배치',
    updatedAt: '07:40',
    confidenceScore: 88,
    proposedAction: '첨부된 3분기 성과 리포트 템플릿 버전 수정 요청으로 발송 큐 일시 중단 및 롤백 완료',
  },
  {
    id: 'tsk-4825',
    code: 'TSK 4825',
    title: '유럽(EU) VAT 세율 변경에 따른 11월 정기구독 청구서 사전 시뮬레이션',
    agentId: 'ledger',
    stage: 'proposed',
    stepIndex: 3,
    recordName: '유럽 법인 빌링 원장',
    recordCategory: '글로벌 세무 규격',
    updatedAt: '09:40',
    confidenceScore: 95,
    proposedAction: '독일·프랑스 권역 312개 법인 구독 건의 세액 재계산 시뮬레이션 완료 · 재무팀 검토 제안',
  },
  {
    id: 'tsk-4826',
    code: 'TSK 4826',
    title: '인천 풀필먼트 제3창고 온도 센서 이상 스파이크 감지',
    agentId: 'atlas',
    stage: 'detected',
    stepIndex: 1,
    recordName: '인천 콜드체인 허브',
    recordCategory: 'IoT 환경 텔레메트리',
    updatedAt: '09:42',
    confidenceScore: 89,
    proposedAction: 'B구역 냉장 셀 온도가 기준치(-2°C) 대비 +1.8°C 상승 감지 · 인접 공조기 밸브 로그 수집 시작',
  },
];

const STAGE_META: Record<
  LifecycleStageId,
  {
    label: string;
    stepIndex: number;
    badgeBg: string;
    badgeText: string;
    dotColor: string;
    activeSegmentColor: string;
    priorSegmentColor: string;
  }
> = {
  detected: {
    label: '감지됨',
    stepIndex: 1,
    badgeBg: 'bg-zinc-100  border-zinc-200 ',
    badgeText: 'text-zinc-700 ',
    dotColor: 'bg-[var(--klic-component-block-color-accent)]',
    activeSegmentColor: 'bg-[var(--klic-component-block-color-accent)]',
    priorSegmentColor: 'bg-[var(--klic-component-block-color-accent)] ',
  },
  investigating: {
    label: '원인 분석 중',
    stepIndex: 2,
    badgeBg: 'bg-blue-50/90  border-blue-200/70 ',
    badgeText: 'text-blue-800 ',
    dotColor: 'bg-[var(--klic-component-block-color-accent)]',
    activeSegmentColor: 'bg-[var(--klic-component-block-color-accent)]',
    priorSegmentColor: 'bg-[var(--klic-component-block-color-accent)] ',
  },
  proposed: {
    label: '해결책 제안됨',
    stepIndex: 3,
    badgeBg: 'bg-blue-50/90  border-blue-200/70 ',
    badgeText: 'text-blue-800 ',
    dotColor: 'bg-[var(--klic-component-block-color-accent)]',
    activeSegmentColor: 'bg-[var(--klic-component-block-color-accent)]',
    priorSegmentColor: 'bg-[var(--klic-component-block-color-accent)] ',
  },
  awaiting_approval: {
    label: '승인 대기 중',
    stepIndex: 4,
    badgeBg: 'bg-[var(--klic-component-block-color-border)]/85  border-amber-300/60 ',
    badgeText: 'text-[color:var(--klic-component-block-color-warning)] ',
    dotColor: 'bg-[var(--klic-component-block-color-warning)] ',
    activeSegmentColor: 'bg-[var(--klic-component-block-color-warning)] ',
    priorSegmentColor: 'bg-[var(--klic-component-block-color-accent)] ',
  },
  executing: {
    label: '실행 중',
    stepIndex: 5,
    badgeBg: 'bg-[var(--klic-component-block-color-soft)]  border-blue-300/60 ',
    badgeText: 'text-[color:var(--klic-component-block-color-accent)] ',
    dotColor: 'bg-[var(--klic-component-block-color-accent)] ',
    activeSegmentColor: 'bg-[var(--klic-component-block-color-accent)] ',
    priorSegmentColor: 'bg-[var(--klic-component-block-color-accent)] ',
  },
  verified: {
    label: '검증 완료',
    stepIndex: 6,
    badgeBg: 'bg-[var(--klic-component-block-color-soft)]/85  border-blue-300/60 ',
    badgeText: 'text-[color:var(--klic-component-block-color-accent)] ',
    dotColor: 'bg-[var(--klic-component-block-color-accent)] ',
    activeSegmentColor: 'bg-[var(--klic-component-block-color-accent)] ',
    priorSegmentColor: 'bg-[var(--klic-component-block-color-accent)] ',
  },
  failed: {
    label: '실패',
    stepIndex: 5,
    badgeBg: 'bg-[var(--klic-component-block-color-soft)]/90  border-red-300/60 ',
    badgeText: 'text-[color:var(--klic-component-block-color-danger)] ',
    dotColor: 'bg-[var(--klic-component-block-color-danger)] ',
    activeSegmentColor: 'bg-[var(--klic-component-block-color-danger)] ',
    priorSegmentColor: 'bg-[var(--klic-component-block-color-accent)] ',
  },
  rolled_back: {
    label: '롤백됨',
    stepIndex: 5,
    badgeBg: 'bg-zinc-100  border-zinc-300/70 ',
    badgeText: 'text-klic-muted ',
    dotColor: 'bg-zinc-500',
    activeSegmentColor: 'bg-zinc-500',
    priorSegmentColor: 'bg-zinc-300 ',
  },
};

/* ============================================================================
 * 6단계 세그먼트 프로그레스 바 ([━ ━ ━ ━ ━ ━]) + 상태 배지 컴포넌트
 * ========================================================================== */
const PhaseStepperCell: React.FC<{
  stage: LifecycleStageId;
  stepIndex: number;
}> = ({ stage, stepIndex }) => {
  const meta = STAGE_META[stage];

  return (
    <div className="inline-flex items-center gap-3">
      {/* 6개 마이크로 세그먼트 바 */}
      <div
        className="inline-flex items-center gap-1"
        title={`라이프사이클 ${stepIndex}/6 단계 (${meta.label})`}
      >
        {[1, 2, 3, 4, 5, 6].map((idx) => {
          let barClass = 'bg-zinc-200 ';
          if (idx < stepIndex) {
            barClass = meta.priorSegmentColor;
          } else if (idx === stepIndex) {
            barClass = meta.activeSegmentColor;
          }
          return (
            <span
              key={idx}
              className={`w-4 h-1.5 rounded-full transition-colors ${barClass}`}
            />
          );
        })}
      </div>

      {/* 우측 시맨틱 상태 배지 */}
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-tight ${meta.badgeBg} ${meta.badgeText}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${meta.dotColor}`} />
        <span>{meta.label}</span>
      </span>
    </div>
  );
};

export const TaskLifecycleBlock: React.FC<TaskLifecycleBlockProps> = ({
  density = 'normal',
}) => {
  const [tasks, setTasks] = useState<LifecycleTaskItem[]>(INITIAL_LIFECYCLE_TASKS);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [activeTab, setActiveTab] = useState<FilterTabId>('all_open');
  const [selectedBarStage, setSelectedBarStage] = useState<LifecycleStageId | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'updated' | 'stage' | 'code'>('updated');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // 신규 작업 생성 폼 상태
  const [newTitle, setNewTitle] = useState('');
  const [newRecord, setNewRecord] = useState('');
  const [newAgentId, setNewAgentId] = useState<string>('atlas');
  const [newStage, setNewStage] = useState<LifecycleStageId>('awaiting_approval');

  // 상단 라이프사이클 분포 집계 (기본 베이스 카운트 + 실시간 변동 반영)
  const stageDistribution = useMemo(() => {
    const initialByStage: Record<string, number> = {};
    INITIAL_LIFECYCLE_TASKS.forEach((t) => {
      initialByStage[t.stage] = (initialByStage[t.stage] || 0) + 1;
    });

    const currentByStage: Record<string, number> = {};
    tasks.forEach((t) => {
      currentByStage[t.stage] = (currentByStage[t.stage] || 0) + 1;
    });

    const stages = LIFECYCLE_BAR_STAGES.map((st) => {
      const delta =
        (currentByStage[st.id] || 0) - (initialByStage[st.id] || 0);
      const count = Math.max(0, st.baseCount + delta);
      return {
        ...st,
        count,
      };
    });

    const totalOpen = stages.reduce((acc, s) => acc + s.count, 0);
    const failedCount = Math.max(
      0,
      2 + ((currentByStage['failed'] || 0) - (initialByStage['failed'] || 0))
    );
    const rolledBackCount = Math.max(
      0,
      1 +
        ((currentByStage['rolled_back'] || 0) -
          (initialByStage['rolled_back'] || 0))
    );

    return {
      stages,
      totalOpen,
      needsApprovalCount:
        stages.find((s) => s.id === 'awaiting_approval')?.count ?? 9,
      executingCount: stages.find((s) => s.id === 'executing')?.count ?? 39,
      failedCount,
      rolledBackCount,
    };
  }, [tasks]);

  // 필터링 및 정렬된 작업 목록
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (selectedBarStage && t.stage !== selectedBarStage) {
          return false;
        }
        if (activeTab === 'needs_you' && t.stage !== 'awaiting_approval') {
          return false;
        }
        if (activeTab === 'executing' && t.stage !== 'executing') {
          return false;
        }
        if (activeTab === 'failed' && t.stage !== 'failed') {
          return false;
        }
        if (activeTab === 'rolled_back' && t.stage !== 'rolled_back') {
          return false;
        }
        if (selectedAgent !== 'all' && t.agentId !== selectedAgent) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const agentName = AGENT_ROSTER[t.agentId]?.name || '';
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchCode = t.code.toLowerCase().includes(q);
          const matchRecord = t.recordName.toLowerCase().includes(q);
          const matchAgent = agentName.toLowerCase().includes(q);
          if (!matchTitle && !matchCode && !matchRecord && !matchAgent) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'updated') {
          return b.updatedAt.localeCompare(a.updatedAt);
        }
        if (sortBy === 'stage') {
          return a.stepIndex - b.stepIndex;
        }
        return b.code.localeCompare(a.code);
      });
  }, [tasks, activeTab, selectedBarStage, selectedAgent, searchQuery, sortBy]);

  // 개별 행 체크박스 토글
  const toggleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 전체 선택 체크박스 토글
  const toggleSelectAll = () => {
    if (selectedRowIds.length === filteredTasks.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredTasks.map((t) => t.id));
    }
  };

  // 작업 라이프사이클 다음 단계 진척 / 승인 처리
  const advanceTaskStage = (taskId: string) => {
    const order: LifecycleStageId[] = [
      'detected',
      'investigating',
      'proposed',
      'awaiting_approval',
      'executing',
      'verified',
    ];
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        if (t.stage === 'failed' || t.stage === 'rolled_back') {
          return {
            ...t,
            stage: 'executing',
            stepIndex: 5,
            subtitle: '방금 수동 재시도 트리거됨 · 정상 실행 중',
            updatedAt: '09:44',
          };
        }
        const idx = order.indexOf(t.stage);
        const nextStage = order[Math.min(order.length - 1, idx + 1)];
        const nextStep = STAGE_META[nextStage].stepIndex;
        return {
          ...t,
          stage: nextStage,
          stepIndex: nextStep,
          updatedAt: '09:44',
        };
      })
    );
  };

  // 선택된 작업 일괄 승인/검증 처리
  const handleBulkApprove = () => {
    if (selectedRowIds.length === 0) return;
    setTasks((prev) =>
      prev.map((t) => {
        if (!selectedRowIds.includes(t.id)) return t;
        if (t.stage === 'awaiting_approval') {
          return {
            ...t,
            stage: 'executing',
            stepIndex: 5,
            updatedAt: '09:45',
          };
        }
        return {
          ...t,
          stage: 'verified',
          stepIndex: 6,
          updatedAt: '09:45',
        };
      })
    );
    setSelectedRowIds([]);
  };

  // 새 자율 작업 등록 핸들러
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const stepIdx = STAGE_META[newStage].stepIndex;
    const created: LifecycleTaskItem = {
      id: `tsk-${Date.now()}`,
      code: `TSK ${Math.floor(4827 + Math.random() * 60)}`,
      title: newTitle.trim(),
      agentId: newAgentId,
      stage: newStage,
      stepIndex: stepIdx,
      recordName: newRecord.trim() || '엔터프라이즈 코어 원장',
      recordCategory: '신규 등록 워크플로우',
      updatedAt: '09:45',
      confidenceScore: 95,
      proposedAction: '에이전트 정책에 따라 사전 영향도 분석 및 실행 계획 자동 수립 완료',
    };
    setTasks((prev) => [created, ...prev]);
    setNewTitle('');
    setNewRecord('');
    setIsNewTaskModalOpen(false);
  };

  const rowPadding =
    density === 'compact'
      ? 'py-2.5 px-4'
      : density === 'relaxed'
      ? 'py-4.5 px-5'
      : 'py-3.5 px-4';

  return (
    <div className="rounded-2xl border border-zinc-200/90  bg-[var(--klic-component-block-color-soft)]  p-4 sm:p-6 lg:p-7 space-y-5 shadow-2xs">
      {/* =====================================================================
       * 1. 상단 WORK 오버라인 & Tasks 헤더 + 목록/보드 토글 + 새 작업 등록 버튼
       * =================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-klic-muted  mb-1">
            WORK · 자율 에이전트 워크스페이스
          </div>
          <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight text-zinc-900  leading-tight">
            업무 라이프사이클 관제 (Tasks)
          </h2>
        </div>

        {/* 우측 컨트롤: 목록/보드 토글 & + 새 작업 등록 */}
        <div className="flex items-center gap-2.5 self-start sm:self-end">
          <div className="inline-flex items-center rounded-xl border border-zinc-200/90  bg-[var(--klic-component-block-color-soft)]  p-1">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-white  text-zinc-900  shadow-2xs'
                  : 'text-klic-muted  hover:text-zinc-900 '
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>목록</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('board')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'board'
                  ? 'bg-white  text-zinc-900  shadow-2xs'
                  : 'text-klic-muted  hover:text-zinc-900 '
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>보드</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsNewTaskModalOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--klic-component-block-color-accent)] hover:bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis px-4 py-2 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>새 작업 등록</span>
          </button>
        </div>
      </div>

      {/* 새 작업 빠른 등록 패널 */}
      {isNewTaskModalOpen && (
        <form
          onSubmit={handleCreateTask}
          className="rounded-xl border border-blue-800/20  bg-white  p-4 shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 ">
              <Sparkles className="w-4 h-4 text-blue-700 " />
              <span>신규 자율 에이전트 작업 등록</span>
            </div>
            <button
              type="button"
              onClick={() => setIsNewTaskModalOpen(false)}
              className="text-klic-muted hover:text-klic-muted "
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-klic-muted  mb-1">
                작업 설명 (Task Title)
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="예: 부산항 냉동 컨테이너 #9920 통관 지연 원인 조사"
                className="w-full rounded-lg border border-zinc-200  bg-zinc-50  px-3 py-1.5 text-xs text-zinc-900  focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-klic-muted  mb-1">
                대상 레코드 (Record)
              </label>
              <input
                type="text"
                value={newRecord}
                onChange={(e) => setNewRecord(e.target.value)}
                placeholder="예: 한진 스마트물류"
                className="w-full rounded-lg border border-zinc-200  bg-zinc-50  px-3 py-1.5 text-xs text-zinc-900  focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-klic-muted  mb-1">
                  담당 에이전트
                </label>
                <select
                  value={newAgentId}
                  onChange={(e) => setNewAgentId(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200  bg-zinc-50  px-2.5 py-1.5 text-xs text-zinc-900 "
                >
                  {Object.values(AGENT_ROSTER).map((ag) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.name} ({ag.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-klic-muted  mb-1">
                  초기 단계
                </label>
                <select
                  value={newStage}
                  onChange={(e) =>
                    setNewStage(e.target.value as LifecycleStageId)
                  }
                  className="w-full rounded-lg border border-zinc-200  bg-zinc-50  px-2.5 py-1.5 text-xs text-zinc-900 "
                >
                  <option value="detected">1. 감지됨</option>
                  <option value="investigating">2. 원인 분석 중</option>
                  <option value="proposed">3. 해결책 제안됨</option>
                  <option value="awaiting_approval">4. 승인 대기 중</option>
                  <option value="executing">5. 실행 중</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsNewTaskModalOpen(false)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-klic-muted  hover:bg-zinc-100 "
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[var(--klic-component-block-color-accent)] hover:bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis px-4 py-1.5 text-xs font-semibold"
            >
              라이프사이클 큐에 추가
            </button>
          </div>
        </form>
      )}

      {/* =====================================================================
       * 2. 상단 128개 진행 중인 작업 라이프사이클 비율 바 카드
       * =================================================================== */}
      <div className="rounded-2xl border border-zinc-200/90  bg-white  p-5 shadow-2xs space-y-3.5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-2.5">
            <span className="text-lg font-bold text-zinc-900  tabular-nums">
              {stageDistribution.totalOpen}개 진행 중인 작업
            </span>
            <span className="text-xs text-klic-muted ">
              현재 모든 작업이 라이프사이클의 어느 단계에 머물러 있는지 실시간으로 보여줍니다
            </span>
          </div>
          <div className="flex items-center gap-2">
            {selectedBarStage && (
              <button
                type="button"
                onClick={() => setSelectedBarStage(null)}
                className="inline-flex items-center gap-1 rounded-md bg-zinc-100  px-2 py-0.5 text-[11px] font-medium text-klic-muted  hover:text-zinc-900"
              >
                <X className="w-3 h-3" /> 단계 필터 해제
              </button>
            )}
            <span className="text-xs font-mono text-klic-muted  tabular-nums">
              업데이트 09:42
            </span>
          </div>
        </div>

        {/* 6단계 멀티 세그먼트 수평 비율 바 */}
        <div className="flex items-center gap-1.5 w-full h-3.5">
          {stageDistribution.stages.map((st) => {
            const widthPct = Math.max(
              4,
              (st.count / Math.max(1, stageDistribution.totalOpen)) * 100
            );
            const isSelected = selectedBarStage === st.id;
            const isDimmed = selectedBarStage !== null && !isSelected;

            return (
              <button
                key={st.id}
                type="button"
                onClick={() =>
                  setSelectedBarStage((prev) =>
                    prev === st.id ? null : st.id
                  )
                }
                style={{ width: `${widthPct}%` }}
                title={`${st.label}: ${st.count}건 (클릭하여 필터링)`}
                className={`h-full rounded-[4px] transition-all cursor-pointer ${
                  st.barColor
                } ${
                  isSelected
                    ? 'ring-2 ring-offset-2 ring-zinc-900  scale-y-110'
                    : isDimmed
                    ? 'opacity-30 hover:opacity-60'
                    : 'hover:opacity-85'
                }`}
              />
            );
          })}
        </div>

        {/* 6단계 범례 (클릭 시에도 해당 단계 필터 적용) */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-0.5">
          {stageDistribution.stages.map((st) => {
            const isSelected = selectedBarStage === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() =>
                  setSelectedBarStage((prev) =>
                    prev === st.id ? null : st.id
                  )
                }
                className={`inline-flex items-center gap-2 text-xs transition-opacity cursor-pointer ${
                  selectedBarStage && !isSelected
                    ? 'opacity-45 hover:opacity-80'
                    : 'opacity-100'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${st.dotColor}`} />
                <span
                  className={`${
                    isSelected
                      ? 'font-bold text-zinc-900  underline underline-offset-4'
                      : 'text-klic-muted '
                  }`}
                >
                  {st.label}
                </span>
                <span className="font-mono font-bold text-zinc-900  tabular-nums">
                  {st.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
       * 3. 메인 작업 테이블 / 보드 카드 컨테이너
       * =================================================================== */}
      <div className="rounded-2xl border border-zinc-200/90  bg-white  overflow-hidden shadow-2xs">
        {/* 상단 탭 & 우측 검색/에이전트/정렬 컨트롤 바 */}
        <div className="px-4 sm:px-5 border-b border-zinc-200/80  flex flex-wrap items-center justify-between gap-3">
          {/* 좌측 상태 탭 바 */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            {[
              {
                id: 'all_open' as FilterTabId,
                label: '전체 진행 중',
                count: stageDistribution.totalOpen,
              },
              {
                id: 'needs_you' as FilterTabId,
                label: '담당자 승인 필요',
                count: stageDistribution.needsApprovalCount,
              },
              {
                id: 'executing' as FilterTabId,
                label: '실행 중',
                count: stageDistribution.executingCount,
              },
              {
                id: 'failed' as FilterTabId,
                label: '실패',
                count: stageDistribution.failedCount,
              },
              {
                id: 'rolled_back' as FilterTabId,
                label: '롤백됨',
                count: stageDistribution.rolledBackCount,
              },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedBarStage(null);
                  }}
                  className={`relative inline-flex items-center gap-2 px-3 py-3.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-[color:var(--klic-component-block-color-accent)] '
                      : 'text-klic-muted  hover:text-zinc-900 '
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-bold tabular-nums ${
                      isActive
                        ? 'bg-[var(--klic-component-block-color-accent)]/12 text-[color:var(--klic-component-block-color-accent)]  '
                        : 'bg-zinc-100  text-klic-muted '
                    }`}
                  >
                    {tab.count}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[var(--klic-component-block-color-accent)]  rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* 우측 검색 + 에이전트 필터 + 업데이트순 정렬 */}
          <div className="flex flex-wrap items-center gap-2 py-2">
            {/* 검색창 */}
            <div className="relative min-w-[190px] sm:min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-klic-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="작업 검색..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-zinc-200  bg-zinc-50/70  text-zinc-800  placeholder:text-klic-muted focus:outline-none focus:ring-2 focus:ring-blue-800/15"
              />
            </div>

            {/* 에이전트 드롭다운 필터 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAgentMenuOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200  bg-white  px-3 py-1.5 text-xs font-medium text-zinc-700  hover:bg-zinc-50 "
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-klic-muted" />
                <span>
                  {selectedAgent === 'all'
                    ? '에이전트'
                    : `에이전트: ${AGENT_ROSTER[selectedAgent]?.name}`}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-klic-muted" />
              </button>

              {isAgentMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-52 rounded-xl border border-zinc-200  bg-white  shadow-lg p-1.5 z-30">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAgent('all');
                      setIsAgentMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-zinc-700  hover:bg-zinc-100 "
                  >
                    <span>전체 에이전트 (4)</span>
                    {selectedAgent === 'all' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  {Object.values(AGENT_ROSTER).map((ag) => (
                    <button
                      key={ag.id}
                      type="button"
                      onClick={() => {
                        setSelectedAgent(ag.id);
                        setIsAgentMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-zinc-700  hover:bg-zinc-100 "
                    >
                      <div className="flex items-center gap-2">
                        <PersonAvatar
                          src={ag.avatar}
                          alt={ag.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span>
                          {ag.name}{' '}
                          <span className="text-[10px] text-klic-muted">
                            · {ag.role}
                          </span>
                        </span>
                      </div>
                      {selectedAgent === ag.id && (
                        <Check className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 업데이트순 정렬 토글 */}
            <button
              type="button"
              onClick={() =>
                setSortBy((prev) =>
                  prev === 'updated'
                    ? 'stage'
                    : prev === 'stage'
                    ? 'code'
                    : 'updated'
                )
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200  bg-white  px-3 py-1.5 text-xs font-medium text-zinc-700  hover:bg-zinc-50 "
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-klic-muted" />
              <span>
                {sortBy === 'updated'
                  ? '업데이트순'
                  : sortBy === 'stage'
                  ? '라이프사이클순'
                  : '작업코드순'}
              </span>
            </button>
          </div>
        </div>

        {/* 다중 선택 시 일괄 액션 바 */}
        {selectedRowIds.length > 0 && (
          <div className="px-5 py-2.5 bg-blue-950/5  border-b border-blue-800/15 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-950 ">
              <CheckCircle2 className="w-4 h-4 text-[color:var(--klic-component-block-color-accent)] " />
              <span>{selectedRowIds.length}개 작업 선택됨</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBulkApprove}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--klic-component-block-color-accent)] hover:bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis px-3 py-1 text-xs font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>일괄 승인 및 다음 단계 실행</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRowIds([])}
                className="rounded-lg px-2.5 py-1 text-xs font-medium text-klic-muted  hover:bg-zinc-200/60 "
              >
                선택 해제
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
         * VIEW A: 목록(List) 5컬럼 테이블 뷰 (첨부 이미지 레이아웃 100% 재현)
         * ================================================================= */}
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[920px]">
              <thead>
                <tr className="border-b border-zinc-200/80  text-[11px] font-bold uppercase tracking-wider text-klic-muted  bg-zinc-50/40 ">
                  <th className="py-3 pl-5 pr-2 w-10">
                    <input
                      type="checkbox"
                      checked={
                        filteredTasks.length > 0 &&
                        selectedRowIds.length === filteredTasks.length
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-zinc-300  accent-[var(--klic-component-block-color-accent)] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3">작업 (TASK)</th>
                  <th className="py-3 px-4 w-44">에이전트 (AGENT)</th>
                  <th className="py-3 px-4 w-72">라이프사이클 단계 (PHASE)</th>
                  <th className="py-3 px-4 w-48">대상 레코드 (RECORD)</th>
                  <th className="py-3 pl-4 pr-5 text-right w-36">
                    <div className="inline-flex items-center justify-end gap-2">
                      <span>업데이트 (UPDATED)</span>
                      <Plus className="w-3.5 h-3.5 text-klic-muted" />
                      <ChevronRight className="w-3.5 h-3.5 text-klic-muted" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/70  text-sm">
                {filteredTasks.map((task) => {
                  const agent = AGENT_ROSTER[task.agentId] || AGENT_ROSTER.atlas;
                  const isChecked = selectedRowIds.includes(task.id);
                  const isExpanded = expandedTaskId === task.id;

                  return (
                    <React.Fragment key={task.id}>
                      <tr
                        onClick={() =>
                          setExpandedTaskId((prev) =>
                            prev === task.id ? null : task.id
                          )
                        }
                        className={`group transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-blue-50/40 '
                            : 'hover:bg-zinc-50/90 '
                        }`}
                      >
                        {/* 체크박스 */}
                        <td
                          className="pl-5 pr-2 py-3.5 align-top pt-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectRow(task.id)}
                            className="w-4 h-4 rounded border-zinc-300  accent-[var(--klic-component-block-color-accent)] cursor-pointer"
                          />
                        </td>

                        {/* 1. 작업 제목 + TSK 코드 + 서브타이틀 */}
                        <td className={`${rowPadding} align-middle`}>
                          <div className="flex flex-wrap items-baseline gap-2.5">
                            <span className="font-semibold text-[13.5px] text-zinc-900 ">
                              {task.title}
                            </span>
                            <span className="font-mono text-xs text-klic-muted  tabular-nums">
                              {task.code}
                            </span>
                          </div>
                          {task.subtitle && (
                            <div className="text-xs text-klic-muted  mt-0.5">
                              {task.subtitle}
                            </div>
                          )}
                        </td>

                        {/* 2. 담당 에이전트 + 프로필 아바타 */}
                        <td className={`${rowPadding} align-middle`}>
                          <div className="inline-flex items-center gap-2">
                            <PersonAvatar
                              src={agent.avatar}
                              alt={agent.name}
                              className="w-6 h-6 rounded-full object-cover ring-1 ring-zinc-200  shrink-0"
                            />
                            <div>
                              <div className="text-[13px] font-medium text-zinc-800  leading-none">
                                {agent.name}
                              </div>
                              <div className="text-[10px] text-klic-muted  mt-0.5">
                                {agent.role}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 3. 라이프사이클 단계 (6단계 세그먼트 바 + 상태 배지) */}
                        <td className={`${rowPadding} align-middle`}>
                          <PhaseStepperCell
                            stage={task.stage}
                            stepIndex={task.stepIndex}
                          />
                        </td>

                        {/* 4. 대상 레코드 */}
                        <td className={`${rowPadding} align-middle`}>
                          <div className="text-[13px] font-medium text-zinc-700 ">
                            {task.recordName}
                          </div>
                        </td>

                        {/* 5. 업데이트 시각 & 빠른 단계 액션 */}
                        <td
                          className="pl-4 pr-5 py-3.5 align-middle text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="inline-flex items-center justify-end gap-2">
                            {task.stage === 'awaiting_approval' && (
                              <button
                                type="button"
                                onClick={() => advanceTaskStage(task.id)}
                                className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity rounded-md bg-[var(--klic-component-block-color-warning)] hover:bg-[var(--klic-component-block-color-warning)] text-klic-on-emphasis px-2 py-0.5 text-[11px] font-semibold"
                              >
                                승인
                              </button>
                            )}
                            {(task.stage === 'failed' ||
                              task.stage === 'rolled_back') && (
                              <button
                                type="button"
                                onClick={() => advanceTaskStage(task.id)}
                                className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity inline-flex items-center gap-1 rounded-md bg-klic-inverse hover:bg-klic-inverse text-klic-on-emphasis px-2 py-0.5 text-[11px] font-semibold"
                              >
                                <RotateCcw className="w-3 h-3" /> 재실행
                              </button>
                            )}
                            <span className="font-mono text-xs text-klic-muted  tabular-nums">
                              {task.updatedAt}
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* 행 클릭 시 펼쳐지는 에이전트 추론 & 실행 컨텍스트 상세 드로어 */}
                      {isExpanded && (
                        <tr className="bg-zinc-50/80 ">
                          <td colSpan={6} className="px-6 py-3.5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-zinc-200/80  bg-white  p-3.5">
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="inline-flex items-center gap-1 font-bold text-zinc-800 ">
                                    <Bot className="w-3.5 h-3.5 text-blue-600" />
                                    {agent.name} 에이전트 실행 계획
                                  </span>
                                  <span className="text-klic-muted">·</span>
                                  <span className="text-klic-muted">
                                    책임 매니저: {agent.supervisor}
                                  </span>
                                  {task.confidenceScore && (
                                    <span className="rounded bg-blue-500/10 text-blue-700  px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums">
                                      신뢰도 {task.confidenceScore}%
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-klic-muted ">
                                  {task.proposedAction}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {task.stage !== 'verified' && (
                                  <button
                                    type="button"
                                    onClick={() => advanceTaskStage(task.id)}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--klic-component-block-color-accent)] hover:bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis px-3 py-1.5 text-xs font-semibold"
                                  >
                                    <Play className="w-3.5 h-3.5" />
                                    <span>
                                      {task.stage === 'awaiting_approval'
                                        ? '승인 및 실행 개시'
                                        : task.stage === 'failed' ||
                                          task.stage === 'rolled_back'
                                        ? '즉시 재실행'
                                        : '다음 단계로 진척'}
                                    </span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* ===================================================================
           * VIEW B: 보드(Board) 6단계 라이프사이클 칸반 뷰
           * ================================================================= */
          <div className="p-4 sm:p-5 overflow-x-auto bg-zinc-50/50 ">
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3.5 min-w-[1120px]">
              {LIFECYCLE_BAR_STAGES.map((col) => {
                const colTasks = filteredTasks.filter((t) =>
                  col.id === 'executing'
                    ? t.stage === 'executing' ||
                      t.stage === 'failed' ||
                      t.stage === 'rolled_back'
                    : t.stage === col.id
                );

                return (
                  <div
                    key={col.id}
                    className="flex flex-col rounded-xl border border-zinc-200/80  bg-white  p-3 min-h-[420px]"
                  >
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-100 ">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                        <span className="text-xs font-bold text-zinc-900 ">
                          {col.label}
                        </span>
                      </div>
                      <span className="rounded-full bg-zinc-100  px-2 py-0.5 font-mono text-[11px] font-bold text-klic-muted  tabular-nums">
                        {colTasks.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 flex-1">
                      {colTasks.map((task) => {
                        const agent =
                          AGENT_ROSTER[task.agentId] || AGENT_ROSTER.atlas;
                        return (
                          <div
                            key={task.id}
                            className="rounded-xl border border-zinc-200/90  bg-zinc-50/60  p-3 space-y-2 hover:border-zinc-300  transition-all"
                          >
                            <div className="flex items-center justify-between text-[11px] text-klic-muted font-mono tabular-nums">
                              <span>{task.code}</span>
                              <span>{task.updatedAt}</span>
                            </div>

                            <div className="text-xs font-semibold text-zinc-900  leading-snug">
                              {task.title}
                            </div>

                            {task.subtitle && (
                              <div className="text-[11px] text-amber-700  bg-amber-50  rounded-lg px-2 py-1">
                                {task.subtitle}
                              </div>
                            )}

                            <div className="pt-1">
                              <PhaseStepperCell
                                stage={task.stage}
                                stepIndex={task.stepIndex}
                              />
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 ">
                              <div className="flex items-center gap-1.5">
                                <PersonAvatar
                                  src={agent.avatar}
                                  alt={agent.name}
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                                <span className="text-[11px] font-medium text-zinc-700 ">
                                  {agent.name}
                                </span>
                              </div>
                              <span className="text-[11px] text-klic-muted truncate max-w-[110px]">
                                {task.recordName}
                              </span>
                            </div>

                            {task.stage !== 'verified' && (
                              <button
                                type="button"
                                onClick={() => advanceTaskStage(task.id)}
                                className="w-full mt-1 rounded-lg border border-zinc-200  bg-white  hover:bg-zinc-100  py-1 text-[11px] font-semibold text-zinc-700 "
                              >
                                {task.stage === 'awaiting_approval'
                                  ? '승인하기 →'
                                  : '다음 단계 →'}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
