import { PersonAvatar } from '../PersonAvatar';
import React, { useState } from 'react';
import {
  Bell,
  Clock,
  AlertTriangle,
  Mail,
  Check,
  CheckCheck,
  SlidersHorizontal,
  Sparkles,
  MessageSquare,
  FileText,
  ShieldAlert,
  PhoneCall,
  Send,
  Video,
  ArrowUpRight,
  X,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Flame,
  Volume2,
  Eye,
  CornerDownRight,
  ChevronRight,
  Layers,
  Filter,
} from 'lucide-react';

export type NotificationShowcaseMode =
  | 'all-showcase'
  | 'project-updates'
  | 'floating-toast'
  | 'approval-center'
  | 'incident-pager'
  | 'mention-thread'
  | 'daily-digest';

interface NotificationShowcaseBlockProps {
  initialMode?: NotificationShowcaseMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

interface ProjectNotificationItem {
  id: string;
  section: 'yesterday' | 'this-week';
  kind: 'system-due' | 'system-risk' | 'user';
  actorName?: string;
  actorRole?: string;
  avatarUrl?: string;
  titlePrefix?: string;
  highlightTarget: string;
  titleSuffix: string;
  bodyBeforeMention: string;
  mentionTag?: string;
  bodyAfterMention?: string;
  projectName: string;
  timeAgo: string;
  unread: boolean;
}

const INITIAL_PROJECT_NOTIFICATIONS: ProjectNotificationItem[] = [
  {
    id: 'p-notif-1',
    section: 'yesterday',
    kind: 'system-due',
    highlightTarget: '캠페인 기획안',
    titleSuffix: ' 마감일이 오늘입니다',
    bodyBeforeMention: '베타 테스터 피드백 분류 및 우선순위 지정',
    projectName: '마케팅 캠페인',
    timeAgo: '2일 전',
    unread: false,
  },
  {
    id: 'p-notif-2',
    section: 'yesterday',
    kind: 'user',
    actorName: '김서연',
    actorRole: '프로덕트 디자이너',
    avatarUrl:
      './placeholders/avatar-0cbdeb5e5e6f.svg',
    titlePrefix: ' 님이 ',
    highlightTarget: '홈페이지 와이어프레임 제작',
    titleSuffix: ' 작업을 검토 단계로 이동했습니다',
    bodyBeforeMention: '할 일 → 검토 중',
    projectName: '웹사이트 리디자인',
    timeAgo: '2일 전',
    unread: false,
  },
  {
    id: 'p-notif-3',
    section: 'yesterday',
    kind: 'user',
    actorName: '박지민',
    actorRole: 'UX 리서처',
    avatarUrl:
      './placeholders/avatar-ed36204aee6b.svg',
    titlePrefix: ' 님이 ',
    highlightTarget: '모바일 온보딩 설계',
    titleSuffix: ' 작업에 댓글을 남겼습니다',
    bodyBeforeMention:
      '권한 요청 안내 문구는 법무팀 검토가 필요합니다 — 현재 초안 작성 중입니다.',
    projectName: '웹사이트 리디자인',
    timeAgo: '2일 전',
    unread: false,
  },
  {
    id: 'p-notif-4',
    section: 'yesterday',
    kind: 'user',
    actorName: '이준혁',
    actorRole: '프론트엔드 리드',
    avatarUrl:
      './placeholders/avatar-3a010bc432b4.svg',
    titlePrefix: ' 님이 ',
    highlightTarget: '요금제 페이지 앵커 링크 오류 수정',
    titleSuffix: ' 작업을 완료했습니다',
    bodyBeforeMention: '요금제 안내 페이지 내 끊어진 앵커 링크 수정 완료',
    projectName: '웹사이트 리디자인',
    timeAgo: '2일 전',
    unread: false,
  },
  {
    id: 'p-notif-5',
    section: 'yesterday',
    kind: 'user',
    actorName: '최수아',
    actorRole: '출시 총괄 PM',
    avatarUrl:
      './placeholders/avatar-32b9a55c6abe.svg',
    titlePrefix: ' 님이 ',
    highlightTarget: '출시 준비 체크리스트',
    titleSuffix: '에서 회원님을 멘션했습니다',
    bodyBeforeMention: '고객 지원 교육 일정이 월요일로 변경되었습니다. ',
    mentionTag: '@한소윤',
    bodyAfterMention: ' 상태 페이지 문구를 최종 확인해 주세요.',
    projectName: '프로덕트 런칭',
    timeAgo: '2일 전',
    unread: false,
  },
  {
    id: 'p-notif-6',
    section: 'yesterday',
    kind: 'user',
    actorName: '김서연',
    actorRole: '프로덕트 디자이너',
    avatarUrl:
      './placeholders/avatar-0cbdeb5e5e6f.svg',
    titlePrefix: ' 님이 ',
    highlightTarget: '홈페이지 와이어프레임 제작',
    titleSuffix: '에서 회원님을 멘션했습니다',
    bodyBeforeMention: '3차 버전으로 업데이트 완료 — ',
    mentionTag: '@한소윤',
    bodyAfterMention: ' 목요일 전까지 리뷰 가능하신가요?',
    projectName: '웹사이트 리디자인',
    timeAgo: '2일 전',
    unread: false,
  },
  {
    id: 'p-notif-7',
    section: 'yesterday',
    kind: 'user',
    actorName: '이준혁',
    actorRole: '프론트엔드 리드',
    avatarUrl:
      './placeholders/avatar-3a010bc432b4.svg',
    titlePrefix: ' 님이 ',
    highlightTarget: '캠페인 기획안',
    titleSuffix: ' 작업을 회원님에게 배정했습니다',
    bodyBeforeMention: '오늘 마감 · 보통 우선순위',
    projectName: '마케팅 캠페인',
    timeAgo: '2일 전',
    unread: true,
  },
  {
    id: 'p-notif-8',
    section: 'yesterday',
    kind: 'system-risk',
    highlightTarget: '프로덕트 런칭',
    titleSuffix: ' 프로젝트가 지연 위험 상태입니다',
    bodyBeforeMention: '이번 주 마감인 3개의 작업이 아직 시작되지 않았습니다',
    projectName: '프로덕트 런칭',
    timeAgo: '2일 전',
    unread: true,
  },
  {
    id: 'p-notif-9',
    section: 'this-week',
    kind: 'user',
    actorName: '김서연',
    actorRole: '프로덕트 디자이너',
    avatarUrl:
      './placeholders/avatar-0cbdeb5e5e6f.svg',
    titlePrefix: ' 님이 ',
    highlightTarget: '예산 승인 품의',
    titleSuffix: '에 댓글을 남겼습니다',
    bodyBeforeMention:
      '재무팀에서 최종 승인 전에 채널별 예산 배분 내역을 요청했습니다.',
    projectName: '마케팅 캠페인',
    timeAgo: '3일 전',
    unread: false,
  },
  {
    id: 'p-notif-10',
    section: 'this-week',
    kind: 'user',
    actorName: '김서연',
    actorRole: '프로덕트 디자이너',
    avatarUrl:
      './placeholders/avatar-0cbdeb5e5e6f.svg',
    titlePrefix: ' 님이 ',
    highlightTarget: '디자인 시스템 토큰 준비',
    titleSuffix: ' 작업을 회원님에게 배정했습니다',
    bodyBeforeMention: '6일 후 마감',
    projectName: '웹사이트 리디자인',
    timeAgo: '4일 전',
    unread: false,
  },
];

interface ApprovalNotificationCard {
  id: string;
  categoryBadge: string;
  urgency: '긴급 결재' | '정기 승인';
  requesterName: string;
  requesterDept: string;
  requesterAvatar: string;
  title: string;
  reason: string;
  beforeLabel: string;
  beforeValue: string;
  afterLabel: string;
  afterValue: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const INITIAL_APPROVAL_CARDS: ApprovalNotificationCard[] = [
  {
    id: 'appr-1',
    categoryBadge: '예산 증액 품의',
    urgency: '긴급 결재',
    requesterName: '정유진',
    requesterDept: '그로스 마케팅 리드',
    requesterAvatar:
      './placeholders/avatar-ed36204aee6b.svg',
    title: '3분기 퍼포먼스 캠페인 집행 한도 상향 요청',
    reason:
      '신규 리디자인 랜딩페이지 전환율이 목표 대비 34% 상회함에 따라 주간 광고 집행 예산을 증액하고자 합니다.',
    beforeLabel: '기존 주간 한도',
    beforeValue: '₩18,000,000',
    afterLabel: '변경 요청 한도',
    afterValue: '₩28,500,000',
    requestedAt: '14분 전 요청',
    status: 'pending',
  },
  {
    id: 'appr-2',
    categoryBadge: '운영 권한 임시 부여',
    urgency: '긴급 결재',
    requesterName: '박준영',
    requesterDept: '클라우드 인프라 팀장',
    requesterAvatar:
      './placeholders/avatar-3a010bc432b4.svg',
    title: '정산 원장 샤딩 볼륨 마이그레이션 최고 권한 요청',
    reason:
      '오늘 밤 23:00 무중단 볼륨 증설 작업을 위해 4시간 동안 한시적 쓰기 권한 승격을 요청합니다.',
    beforeLabel: '현재 보유 등급',
    beforeValue: '운영 읽기 전용',
    afterLabel: '요청 권한 범위',
    afterValue: '원장 볼륨 제어 (4시간)',
    requestedAt: '32분 전 요청',
    status: 'pending',
  },
  {
    id: 'appr-3',
    categoryBadge: '엔터프라이즈 특별 할인',
    urgency: '정기 승인',
    requesterName: '강태우',
    requesterDept: '엔터프라이즈 세일즈 수석',
    requesterAvatar:
      './placeholders/avatar-2ca18b045556.svg',
    title: '한빛금융그룹 3년 다년 약정 커스텀 요금제 승인',
    reason:
      '500시트 일괄 도입 및 3년 선납 조건으로 표준 단가 대비 22% 특별 할인 적용 승인을 요청합니다.',
    beforeLabel: '표준 견적 단가',
    beforeValue: '연 ₩240,000,000',
    afterLabel: '약정 할인 적용가',
    afterValue: '연 ₩187,200,000',
    requestedAt: '1시간 전 요청',
    status: 'pending',
  },
  {
    id: 'appr-4',
    categoryBadge: '외부 파트너 보안 예외',
    urgency: '정기 승인',
    requesterName: '오지훈',
    requesterDept: '보안 거버넌스 총괄',
    requesterAvatar:
      './placeholders/avatar-18461dc5a323.svg',
    title: '외부 회계 감사법인 전용 읽기 토큰 발급 승인',
    reason:
      '반기 재무 감사 기간(14일) 동안 지정된 고정 아이피 대역에서의 정산 내역 조회 토큰 발급 건입니다.',
    beforeLabel: '접속 허용 정책',
    beforeValue: '사내 망 전용',
    afterLabel: '예외 허용 기간',
    afterValue: '감사법인 고정 대역 (14일)',
    requestedAt: '2시간 전 요청',
    status: 'approved',
  },
];

const MODE_TABS: {
  id: NotificationShowcaseMode;
  label: string;
  pkg: string;
}[] = [
  {
    id: 'project-updates',
    label: '1. 프로젝트 & 작업 팔로우 피드',
    pkg: 'KLIC/notif-1',
  },
  {
    id: 'floating-toast',
    label: '2. 실시간 플로팅 토스트 스택',
    pkg: 'KLIC/notif-2',
  },
  {
    id: 'approval-center',
    label: '3. 양방향 결재 & 승인 알림 센터',
    pkg: 'KLIC/notif-3',
  },
  {
    id: 'incident-pager',
    label: '4. 24/7 긴급 장애 온콜 경보',
    pkg: 'KLIC/notif-4',
  },
  {
    id: 'mention-thread',
    label: '5. 문서 인라인 멘션 & 스레드함',
    pkg: 'KLIC/notif-5',
  },
  {
    id: 'daily-digest',
    label: '6. 일일 경영 브리핑 요약 알림',
    pkg: 'KLIC/notif-6',
  },
  {
    id: 'all-showcase',
    label: '전체 6종 한눈에 보기',
    pkg: 'KLIC/notif-all',
  },
];

export function NotificationShowcaseBlock({
  initialMode = 'project-updates',
}: NotificationShowcaseBlockProps) {
  const [activeMode, setActiveMode] =
    useState<NotificationShowcaseMode>(initialMode);

  React.useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  // Style 1 state: Project & Task Updates (Reference Image implementation)
  const [projectNotifs, setProjectNotifs] = useState<ProjectNotificationItem[]>(
    INITIAL_PROJECT_NOTIFICATIONS
  );
  const [readFilter, setReadFilter] = useState<'all' | 'unread'>('all');
  const [selectedProjectFilter, setSelectedProjectFilter] =
    useState<string>('전체 프로젝트');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Style 2 state: Floating Toast Stack
  const [dismissedToasts, setDismissedToasts] = useState<string[]>([]);
  const [settlementConfirmed, setSettlementConfirmed] = useState(false);
  const [meetingJoined, setMeetingJoined] = useState(false);

  // Style 3 state: Approval Center
  const [approvalCards, setApprovalCards] = useState<
    ApprovalNotificationCard[]
  >(INITIAL_APPROVAL_CARDS);

  // Style 4 state: Incident Pager
  const [incidentAcked, setIncidentAcked] = useState(false);
  const [escalatedToStage3, setEscalatedToStage3] = useState(false);

  // Style 5 state: Mention Thread Split View
  const [selectedMentionId, setSelectedMentionId] = useState<
    'm-1' | 'm-2' | 'm-3'
  >('m-1');
  const [replyInput, setReplyInput] = useState('');
  const [customReplies, setCustomReplies] = useState<
    Record<string, { author: string; avatar: string; text: string; time: string }[]>
  >({
    'm-1': [],
    'm-2': [],
    'm-3': [],
  });

  // Style 6 state: Daily Digest Priority Checklist
  const [digestChecked, setDigestChecked] = useState<Record<string, boolean>>({
    'd-1': false,
    'd-2': true,
    'd-3': false,
  });

  const unreadCount = projectNotifs.filter((n) => n.unread).length;

  const filteredProjectNotifs = projectNotifs.filter((item) => {
    if (readFilter === 'unread' && !item.unread) return false;
    if (
      selectedProjectFilter !== '전체 프로젝트' &&
      item.projectName !== selectedProjectFilter
    ) {
      return false;
    }
    return true;
  });

  const yesterdayItems = filteredProjectNotifs.filter(
    (i) => i.section === 'yesterday'
  );
  const thisWeekItems = filteredProjectNotifs.filter(
    (i) => i.section === 'this-week'
  );

  const handleToggleSingleRead = (id: string) => {
    setProjectNotifs((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, unread: !item.unread } : item
      )
    );
  };

  const handleMarkAllRead = () => {
    setProjectNotifs((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const handleResetProjectNotifs = () => {
    setProjectNotifs(INITIAL_PROJECT_NOTIFICATIONS);
    setReadFilter('all');
    setSelectedProjectFilter('전체 프로젝트');
  };

  const handleApprovalAction = (
    id: string,
    nextStatus: 'approved' | 'rejected'
  ) => {
    setApprovalCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c))
    );
  };

  const handleSendMentionReply = () => {
    if (!replyInput.trim()) return;
    setCustomReplies((prev) => ({
      ...prev,
      [selectedMentionId]: [
        ...(prev[selectedMentionId] || []),
        {
          author: '한소윤',
          avatar:
            './placeholders/avatar-72e24f34ec07.svg',
          text: replyInput.trim(),
          time: '방금 전',
        },
      ],
    }));
    setReplyInput('');
  };

  /* ========================================================================
   * STYLE 1: 프로젝트 & 작업 팔로우 알림 피드 (Reference Image 100% 한글 + 샘플 아바타)
   * ======================================================================== */
  const renderStyle1ProjectUpdates = () => (
    <section className="rounded-[28px] bg-[var(--klic-component-block-color-panel)]  border border-zinc-200/80  p-6 sm:p-8 shadow-[0_18px_45px_color-mix(in_srgb,var(--klic-component-block-color-text)_5%,transparent)]">
      {/* 상단 패키지 식별 배지 */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pb-4 border-b border-zinc-200/70 ">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-klic-inverse  text-klic-on-emphasis  text-[11px] font-mono font-semibold">
            KLIC/notif-1
          </span>
          <span className="text-xs font-medium text-klic-muted ">
            프로젝트 & 작업 팔로우 알림 피드 · 시간대별 그룹 및 멘션 하이라이트
          </span>
        </div>
        <button
          type="button"
          onClick={handleResetProjectNotifs}
          className="inline-flex items-center gap-1.5 text-xs text-klic-muted hover:text-zinc-900  transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          초기 읽지 않음 상태로 복원
        </button>
      </div>

      {/* 메인 헤더 영역 (첨부 이미지 레이아웃 구현) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-7">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-[26px] font-bold tracking-tight text-zinc-900 ">
              알림
            </h2>
            {unreadCount > 0 ? (
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-100/90  text-blue-700  border border-blue-200/80 ">
                {unreadCount}개 읽지 않음
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50  text-blue-700  border border-blue-200/70 ">
                모두 확인함
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm text-klic-muted ">
            팔로우 중인 작업 및 프로젝트의 실시간 업데이트 내역입니다.
          </p>
        </div>

        {/* 우측 컨트롤 바: 전체/읽지 않음 토글 + 모두 읽음 처리 + 필터 버튼 */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* 세그먼트 토글 */}
          <div className="inline-flex items-center p-1 rounded-xl bg-zinc-200/75  border border-zinc-300/50 ">
            <button
              type="button"
              onClick={() => setReadFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                readFilter === 'all'
                  ? 'bg-white  text-zinc-900  shadow-xs'
                  : 'text-klic-muted  hover:text-zinc-900 '
              }`}
            >
              전체
            </button>
            <button
              type="button"
              onClick={() => setReadFilter('unread')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                readFilter === 'unread'
                  ? 'bg-white  text-zinc-900  shadow-xs'
                  : 'text-klic-muted  hover:text-zinc-900 '
              }`}
            >
              읽지 않음
            </button>
          </div>

          {/* 모두 읽음 처리 버튼 */}
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white  border border-zinc-200/90  text-xs font-semibold text-zinc-700  hover:bg-zinc-50  transition-colors shadow-2xs"
          >
            <CheckCheck className="w-4 h-4 text-klic-muted" />
            모두 읽음 처리
          </button>

          {/* 프로젝트 필터 슬라이더 아이콘 버튼 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterMenuOpen((v) => !v)}
              title="프로젝트별 필터"
              className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border transition-colors shadow-2xs ${
                selectedProjectFilter !== '전체 프로젝트'
                  ? 'bg-blue-50 border-blue-300 text-blue-700   '
                  : 'bg-white  border-zinc-200/90  text-klic-muted  hover:bg-zinc-50 '
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {isFilterMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white  border border-zinc-200  shadow-xl p-1.5 z-20">
                <div className="px-2.5 py-1.5 text-[11px] font-semibold text-klic-muted">
                  프로젝트 필터
                </div>
                {[
                  '전체 프로젝트',
                  '웹사이트 리디자인',
                  '마케팅 캠페인',
                  '프로덕트 런칭',
                ].map((proj) => (
                  <button
                    key={proj}
                    type="button"
                    onClick={() => {
                      setSelectedProjectFilter(proj);
                      setIsFilterMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      selectedProjectFilter === proj
                        ? 'bg-blue-50 text-blue-700  '
                        : 'text-zinc-700  hover:bg-zinc-100 '
                    }`}
                  >
                    <span>{proj}</span>
                    {selectedProjectFilter === proj && (
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 빈 필터 상태 안내 */}
      {yesterdayItems.length === 0 && thisWeekItems.length === 0 && (
        <div className="rounded-2xl bg-white  border border-zinc-200/80  p-10 text-center">
          <p className="text-sm font-semibold text-zinc-800 ">
            표시할 알림이 없습니다.
          </p>
          <p className="mt-1 text-xs text-klic-muted ">
            모든 알림을 확인했거나 선택한 필터에 해당하는 내역이 없습니다.
          </p>
          <button
            type="button"
            onClick={handleResetProjectNotifs}
            className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-klic-on-emphasis text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            전체 알림 다시 보기
          </button>
        </div>
      )}

      {/* 섹션 1: 어제 */}
      {yesterdayItems.length > 0 && (
        <div className="mb-7">
          <div className="text-xs font-bold tracking-wider text-klic-muted  mb-2.5 px-1">
            어제
          </div>
          <div className="rounded-2xl bg-white  border border-zinc-200/85  divide-y divide-zinc-200/75  overflow-hidden shadow-[0_2px_10px_color-mix(in_srgb,var(--klic-component-block-color-text)_2%,transparent)]">
            {yesterdayItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-start justify-between gap-4 px-5 py-4 transition-colors ${
                  item.unread
                    ? 'bg-blue-50/25  hover:bg-blue-50/45 '
                    : 'hover:bg-zinc-50/80 '
                }`}
              >
                {/* 좌측 아바타 또는 시스템 원형 아이콘 */}
                <div className="flex items-start gap-3.5 min-w-0">
                  {item.kind === 'system-due' && (
                    <div className="w-10 h-10 rounded-full bg-[var(--klic-component-block-color-soft)]  border border-amber-200/70  flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4 text-amber-900 " />
                    </div>
                  )}
                  {item.kind === 'system-risk' && (
                    <div className="w-10 h-10 rounded-full bg-[var(--klic-component-block-color-soft)]  border border-blue-200/70  flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4 text-blue-700 " />
                    </div>
                  )}
                  {item.kind === 'user' && item.avatarUrl && (
                    <div className="relative shrink-0 mt-0.5">
                      <PersonAvatar
                        src={item.avatarUrl}
                        alt={item.actorName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white  shadow-xs"
                      />
                    </div>
                  )}

                  {/* 본문 텍스트 영역 */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] leading-snug text-zinc-700 ">
                      {item.actorName && (
                        <span className="font-bold text-zinc-900 ">
                          {item.actorName}
                        </span>
                      )}
                      {item.titlePrefix && <span>{item.titlePrefix}</span>}
                      <span className="font-bold text-zinc-900 ">
                        {item.highlightTarget}
                      </span>
                      <span>{item.titleSuffix}</span>
                    </p>

                    <p className="mt-1 text-[13px] leading-relaxed text-klic-muted ">
                      <span>{item.bodyBeforeMention}</span>
                      {item.mentionTag && (
                        <span className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md bg-blue-100/90  text-blue-700  font-semibold text-xs">
                          {item.mentionTag}
                        </span>
                      )}
                      {item.bodyAfterMention && (
                        <span>{item.bodyAfterMention}</span>
                      )}
                    </p>

                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-klic-muted ">
                      <span>{item.projectName}</span>
                      <span>·</span>
                      <span>{item.timeAgo}</span>
                    </div>
                  </div>
                </div>

                {/* 우측 읽음/안읽음 액션 컨트롤 */}
                <div className="flex items-center gap-2.5 shrink-0 pt-1">
                  {item.unread ? (
                    <>
                      <span
                        className="w-2 h-2 rounded-full bg-blue-600 "
                        title="읽지 않음"
                      />
                      <button
                        type="button"
                        onClick={() => handleToggleSingleRead(item.id)}
                        title="읽음으로 표시"
                        className="p-1.5 rounded-lg text-klic-muted hover:text-blue-600 hover:bg-blue-50  transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleSingleRead(item.id)}
                      title="읽지 않음으로 변경"
                      className="p-1.5 rounded-lg text-klic-muted hover:text-zinc-700  hover:bg-zinc-100  transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 섹션 2: 이번 주 */}
      {thisWeekItems.length > 0 && (
        <div>
          <div className="text-xs font-bold tracking-wider text-klic-muted  mb-2.5 px-1">
            이번 주
          </div>
          <div className="rounded-2xl bg-white  border border-zinc-200/85  divide-y divide-zinc-200/75  overflow-hidden shadow-[0_2px_10px_color-mix(in_srgb,var(--klic-component-block-color-text)_2%,transparent)]">
            {thisWeekItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-start justify-between gap-4 px-5 py-4 transition-colors ${
                  item.unread
                    ? 'bg-blue-50/25  hover:bg-blue-50/45'
                    : 'hover:bg-zinc-50/80 '
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  {item.avatarUrl && (
                    <PersonAvatar
                      src={item.avatarUrl}
                      alt={item.actorName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white  shadow-xs shrink-0 mt-0.5"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] leading-snug text-zinc-700 ">
                      {item.actorName && (
                        <span className="font-bold text-zinc-900 ">
                          {item.actorName}
                        </span>
                      )}
                      {item.titlePrefix && <span>{item.titlePrefix}</span>}
                      <span className="font-bold text-zinc-900 ">
                        {item.highlightTarget}
                      </span>
                      <span>{item.titleSuffix}</span>
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-klic-muted ">
                      {item.bodyBeforeMention}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-klic-muted ">
                      <span>{item.projectName}</span>
                      <span>·</span>
                      <span>{item.timeAgo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 pt-1">
                  {item.unread ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-blue-600 " />
                      <button
                        type="button"
                        onClick={() => handleToggleSingleRead(item.id)}
                        title="읽음으로 표시"
                        className="p-1.5 rounded-lg text-klic-muted hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleSingleRead(item.id)}
                      title="읽지 않음으로 변경"
                      className="p-1.5 rounded-lg text-klic-muted hover:text-zinc-700  hover:bg-zinc-100  transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );

  /* ========================================================================
   * STYLE 2: 실시간 플로팅 토스트 & 액션 스낵바 스택 (KLIC/notif-2)
   * ======================================================================== */
  const renderStyle2FloatingToast = () => (
    <section className="rounded-[28px] bg-zinc-100/90  border border-zinc-200/80  p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-blue-600 text-klic-on-emphasis text-[11px] font-mono font-semibold">
            KLIC/notif-2
          </span>
          <h3 className="text-base font-bold text-zinc-900 ">
            실시간 플로팅 토스트 & 액션 스낵바 스택
          </h3>
        </div>
        <button
          type="button"
          onClick={() => {
            setDismissedToasts([]);
            setSettlementConfirmed(false);
            setMeetingJoined(false);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white  border border-zinc-200/80  text-xs font-semibold text-zinc-700  hover:bg-zinc-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          토스트 스택 다시 띄우기
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 좌측: 라이브 화상회의 호출 & 원장 내보내기 진행률 토스트 */}
        <div className="lg:col-span-6 space-y-4">
          {/* 토스트 카드 1: 화상회의 즉시 참여 호출 */}
          {!dismissedToasts.includes('toast-1') && (
            <div className="rounded-[24px] p-1.5 bg-klic-inverse/95  text-klic-on-emphasis shadow-xl border border-zinc-800">
              <div className="rounded-[18px] bg-klic-inverse p-4 border border-zinc-800/90">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <PersonAvatar
                        src="./placeholders/avatar-0cbdeb5e5e6f.svg"
                        alt="이하은"
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-400"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 ring-2 ring-zinc-900" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-blue-400">
                          실시간 허들 호출
                        </span>
                        <span className="text-[11px] text-klic-muted">방금 전</span>
                      </div>
                      <h4 className="text-sm font-bold text-klic-on-emphasis mt-0.5">
                        이하은 님이 디자인 QA 긴급 점검 회의를 시작했습니다
                      </h4>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setDismissedToasts((prev) => [...prev, 'toast-1'])
                    }
                    className="p-1 text-klic-muted hover:text-klic-on-emphasis"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 참석 중인 멤버 아바타 스택 */}
                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <PersonAvatar
                        src="./placeholders/avatar-d36430bc2634.svg"
                        alt="이준혁"
                        className="w-6 h-6 rounded-full object-cover ring-2 ring-zinc-900"
                      />
                      <PersonAvatar
                        src="./placeholders/avatar-ef94a3ac14b1.svg"
                        alt="박지민"
                        className="w-6 h-6 rounded-full object-cover ring-2 ring-zinc-900"
                      />
                      <PersonAvatar
                        src="./placeholders/avatar-d81ac24457b6.svg"
                        alt="최수아"
                        className="w-6 h-6 rounded-full object-cover ring-2 ring-zinc-900"
                      />
                    </div>
                    <span className="text-xs text-klic-muted">
                      외 4명 현재 접속 중
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMeetingJoined(true)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      meetingJoined
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        : 'bg-blue-500 hover:bg-blue-400 text-zinc-950'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    {meetingJoined ? '음성 채널 연결됨' : '지금 바로 참여'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 토스트 카드 2: 대용량 정산 리포트 생성 완료 토스트 */}
          {!dismissedToasts.includes('toast-2') && (
            <div className="rounded-[24px] p-1.5 bg-white  border border-zinc-200/90  shadow-lg">
              <div className="rounded-[18px] bg-zinc-50/70  p-4 border border-zinc-200/60 ">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <PersonAvatar
                      src="./placeholders/avatar-2ca18b045556.svg"
                      alt="강태우"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white "
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100  text-blue-700  text-[11px] font-semibold">
                          원장 검증 완료
                        </span>
                        <span className="text-xs text-klic-muted">1분 전</span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-900  mt-1">
                        강태우 님이 요청한 10월 파트너 정산 대사표 생성이 완료되었습니다
                      </h4>
                      <p className="text-xs text-klic-muted  mt-0.5">
                        총 14,820건 거래 내역 · 오차 0건 검증됨
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setDismissedToasts((prev) => [...prev, 'toast-2'])
                    }
                    className="p-1 text-klic-muted hover:text-zinc-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 하단 진행 바 & 액션 */}
                <div className="mt-3.5">
                  <div className="h-1.5 w-full rounded-full bg-zinc-200  overflow-hidden">
                    <div className="h-full w-full bg-blue-600 rounded-full" />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-klic-muted">
                      암호화 서명 완료 · 유효기간 24시간
                    </span>
                    <button
                      type="button"
                      onClick={() => setSettlementConfirmed(true)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600  hover:underline"
                    >
                      {settlementConfirmed
                        ? '✓ 정산서 열람 완료'
                        : '정산 대사표 바로 열기'}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 우측: 실행 취소 스낵바 & 멘션 빠른 답장 토스트 */}
        <div className="lg:col-span-6 space-y-4">
          {/* 토스트 카드 3: 인라인 빠른 답장 지원 멘션 토스트 */}
          <div className="rounded-[24px] p-1.5 bg-white  border border-zinc-200/90  shadow-lg">
            <div className="rounded-[18px] bg-white  p-4 border border-zinc-100 ">
              <div className="flex items-start gap-3">
                <PersonAvatar
                  src="./placeholders/avatar-72e24f34ec07.svg"
                  alt="신예린"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 ">
                      신예린 · 법무 컴플라이언스팀
                    </span>
                    <span className="text-[11px] text-blue-600 font-semibold">
                      직접 멘션
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-klic-muted  bg-zinc-50  rounded-xl p-2.5 border border-zinc-200/60 ">
                    “<span className="font-semibold text-blue-600">@한소윤</span>{' '}
                    개인정보 처리방침 제4조 위탁업체 표기 문구 수정본 확인 부탁드립니다.”
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="알림창에서 바로 답장 보내기..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-100  text-xs text-zinc-800  border border-transparent focus:border-blue-400 focus:bg-white outline-none"
                    />
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-klic-inverse  text-klic-on-emphasis  text-xs font-semibold hover:opacity-90"
                    >
                      전송
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 토스트 카드 4: 카운트다운 실행 취소(Undo) 다크 캡슐 바 */}
          <div className="rounded-2xl bg-klic-inverse  text-klic-on-emphasis px-4 py-3.5 shadow-lg border border-zinc-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xs font-bold text-amber-300">
                5초
              </span>
              <div>
                <p className="text-xs font-semibold text-klic-on-emphasis">
                  완료된 캠페인 작업 12건을 보관함으로 이동했습니다
                </p>
                <p className="text-[11px] text-klic-muted">
                  5초 후 영구 반영됩니다
                </p>
              </div>
            </div>
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl bg-klic-inverse hover:bg-klic-inverse text-amber-300 text-xs font-bold border border-zinc-700 transition-colors shrink-0"
            >
              실행 취소
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  /* ========================================================================
   * STYLE 3: 양방향 결재 & 권한 승인 요청 알림 센터 (KLIC/notif-3)
   * ======================================================================== */
  const renderStyle3ApprovalCenter = () => (
    <section className="rounded-[28px] bg-zinc-100/80  border border-zinc-200/80  p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-700 text-klic-on-emphasis text-[11px] font-mono font-semibold">
              KLIC/notif-3
            </span>
            <h3 className="text-base font-bold text-zinc-900 ">
              양방향 결재 & 권한 승인 요청 알림 센터
            </h3>
          </div>
          <p className="text-xs text-klic-muted  mt-1">
            변경 전후 수치 비교(Diff)와 기안자 샘플 아바타을 확인하고 알림 카드에서 즉시 승인·반려합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setApprovalCards(INITIAL_APPROVAL_CARDS)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white  border border-zinc-200  text-xs font-semibold text-zinc-700 "
        >
          <RotateCcw className="w-3.5 h-3.5" />
          결재 상태 초기화
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {approvalCards.map((card) => (
          <div
            key={card.id}
            className="rounded-[24px] p-1.5 bg-zinc-200/70  border border-zinc-300/60  flex flex-col justify-between"
          >
            {/* 상단 화이트 코어 카드 */}
            <div className="rounded-[18px] bg-white  p-5 border border-zinc-200/60  shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <span className="px-2.5 py-0.5 rounded-md bg-zinc-100  text-zinc-700  text-xs font-semibold">
                  {card.categoryBadge}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    card.urgency === '긴급 결재'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/80  '
                      : 'bg-blue-50 text-blue-700 border border-blue-200/80  '
                  }`}
                >
                  {card.urgency}
                </span>
              </div>

              {/* 기안자 프로필 */}
              <div className="flex items-center gap-3 mb-3">
                <PersonAvatar
                  src={card.requesterAvatar}
                  alt={card.requesterName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-zinc-100 "
                />
                <div>
                  <div className="text-sm font-bold text-zinc-900 ">
                    {card.requesterName}
                  </div>
                  <div className="text-xs text-klic-muted ">
                    {card.requesterDept} · {card.requestedAt}
                  </div>
                </div>
              </div>

              <h4 className="text-[15px] font-bold text-zinc-900  leading-snug">
                {card.title}
              </h4>
              <p className="mt-1.5 text-xs text-klic-muted  leading-relaxed">
                {card.reason}
              </p>

              {/* 변경 전/후 비교 박스 */}
              <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-xl bg-zinc-50  p-3 border border-zinc-200/70 ">
                <div>
                  <div className="text-[11px] text-klic-muted">
                    {card.beforeLabel}
                  </div>
                  <div className="text-xs font-semibold text-klic-muted  mt-0.5">
                    {card.beforeValue}
                  </div>
                </div>
                <div className="border-l border-zinc-200  pl-3">
                  <div className="text-[11px] text-blue-600  font-semibold">
                    {card.afterLabel}
                  </div>
                  <div className="text-xs font-bold text-zinc-900  mt-0.5">
                    {card.afterValue}
                  </div>
                </div>
              </div>
            </div>

            {/* 하단 베젤 액션 트레이 */}
            <div className="px-4 py-2.5 flex items-center justify-between">
              {card.status === 'pending' ? (
                <>
                  <span className="text-xs font-medium text-klic-muted ">
                    결재 대기 중
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleApprovalAction(card.id, 'rejected')}
                      className="px-3 py-1.5 rounded-xl bg-white  border border-zinc-300  text-xs font-semibold text-zinc-700  hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
                    >
                      반려
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprovalAction(card.id, 'approved')}
                      className="px-3.5 py-1.5 rounded-xl bg-klic-inverse  text-klic-on-emphasis  text-xs font-semibold hover:bg-blue-700  transition-colors"
                    >
                      즉시 승인
                    </button>
                  </div>
                </>
              ) : card.status === 'approved' ? (
                <div className="w-full flex items-center justify-between text-xs font-bold text-blue-700 ">
                  <span>✓ 승인 완료 처리됨</span>
                  <button
                    type="button"
                    onClick={() =>
                      setApprovalCards((prev) =>
                        prev.map((c) =>
                          c.id === card.id ? { ...c, status: 'pending' } : c
                        )
                      )
                    }
                    className="text-[11px] text-klic-muted underline"
                  >
                    되돌리기
                  </button>
                </div>
              ) : (
                <div className="w-full flex items-center justify-between text-xs font-bold text-blue-600 ">
                  <span>✕ 반려 처리됨</span>
                  <button
                    type="button"
                    onClick={() =>
                      setApprovalCards((prev) =>
                        prev.map((c) =>
                          c.id === card.id ? { ...c, status: 'pending' } : c
                        )
                      )
                    }
                    className="text-[11px] text-klic-muted underline"
                  >
                    되돌리기
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  /* ========================================================================
   * STYLE 4: 24/7 긴급 장애 온콜 & 에스컬레이션 경보 (KLIC/notif-4)
   * ======================================================================== */
  const renderStyle4IncidentPager = () => (
    <section className="rounded-[28px] p-1.5 bg-blue-950/10  border border-blue-200/80 ">
      <div className="rounded-[22px] bg-white  p-6 sm:p-8 border border-blue-100 ">
        {/* 상단 모눈종이 패턴 경보 배너 */}
        <div
          className="rounded-2xl p-5 border border-blue-200/80  mb-6"
          style={{
            backgroundImage:
              'radial-gradient(color-mix(in srgb,var(--klic-component-block-color-accent) 12%,transparent) 1px, transparent 1px)',
            backgroundSize: '14px 14px',
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-klic-on-emphasis text-[11px] font-mono font-bold">
                  KLIC/notif-4
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100  text-blue-700  text-xs font-bold">
                  <Flame className="w-3.5 h-3.5" />
                  심각도 1등급 긴급 경보
                </span>
                <span className="text-xs font-medium text-klic-muted">
                  경보 번호 #2049 · 서울 리전 결제 게이트웨이
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-zinc-900  mt-2">
                카드 승인 중계 응답 지연율이 임계치(3.5초)를 초과했습니다
              </h3>
              <p className="text-xs text-klic-muted  mt-1">
                최근 5분간 타임아웃 142건 발생 · 자동 우회 라우팅 대기 중
              </p>
            </div>

            {/* 우측 카운트다운 및 접수 버튼 */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-2 rounded-xl bg-white/90  border border-blue-200  text-right">
                <div className="text-[11px] text-klic-muted">
                  다음 단계 자동 호출까지
                </div>
                <div className="text-base font-mono font-bold text-blue-600 ">
                  {incidentAcked ? '접수 완료됨' : '04분 18초'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIncidentAcked((v) => !v)}
                className={`px-4 py-3 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  incidentAcked
                    ? 'bg-blue-600 text-klic-on-emphasis'
                    : 'bg-blue-600 hover:bg-blue-700 text-klic-on-emphasis'
                }`}
              >
                {incidentAcked ? '✓ 경보 접수 확인됨' : '경보 접수 확인'}
              </button>
            </div>
          </div>
        </div>

        {/* 3단계 온콜 당번 에스컬레이션 체인 */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold text-klic-muted">
            온콜 당번 에스컬레이션 체인 (실시간 호출 상태)
          </span>
          <button
            type="button"
            onClick={() => setEscalatedToStage3((v) => !v)}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            {escalatedToStage3
              ? '기본 호출 단계로 복귀'
              : '3차 총괄 리더 즉시 호출 테스트'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              stage: '1차 주당번 엔지니어',
              name: '박준영',
              role: '클라우드 인프라 리드',
              avatar:
                './placeholders/avatar-3a010bc432b4.svg',
              channel: '음성 전화 및 모바일 푸시 발송',
              state: incidentAcked ? '응답 완료 (투입 중)' : '호출 벨 울리는 중',
              active: true,
            },
            {
              stage: '2차 부담번 엔지니어',
              name: '김서연',
              role: '플랫폼 안정성 엔지니어',
              avatar:
                './placeholders/avatar-0cbdeb5e5e6f.svg',
              channel: '슬랙 워룸 채널 호출 완료',
              state: '대기 중 (4분 후 자동 승격)',
              active: false,
            },
            {
              stage: '3차 총괄 책임자',
              name: '이하은',
              role: '기술 총괄 부사장',
              avatar:
                './placeholders/avatar-72e24f34ec07.svg',
              channel: '비상 직통 회선 등록됨',
              state: escalatedToStage3 ? '긴급 호출 발신됨' : '대기 상태',
              active: escalatedToStage3,
            },
          ].map((responder) => (
            <div
              key={responder.stage}
              className={`rounded-2xl p-4 border transition-all ${
                responder.active
                  ? 'bg-blue-50/50  border-blue-300  shadow-xs'
                  : 'bg-zinc-50/70  border-zinc-200/80 '
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-klic-muted">
                  {responder.stage}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    responder.active
                      ? 'bg-blue-600 text-klic-on-emphasis'
                      : 'bg-zinc-200  text-zinc-700 '
                  }`}
                >
                  {responder.state}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <PersonAvatar
                  src={responder.avatar}
                  alt={responder.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-white "
                />
                <div>
                  <div className="text-sm font-bold text-zinc-900 ">
                    {responder.name}
                  </div>
                  <div className="text-xs text-klic-muted">{responder.role}</div>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-zinc-200/70  flex items-center justify-between text-xs text-klic-muted">
                <span className="inline-flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-blue-500" />
                  {responder.channel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  /* ========================================================================
   * STYLE 5: 문서 인라인 멘션 & 스레드 대화 알림함 (KLIC/notif-5)
   * ======================================================================== */
  const mentionThreads = {
    'm-1': {
      docTitle: '2026 하반기 제품 출시 마스터 플랜',
      sectionTitle: '3.2 엔터프라이즈 요금제 마이그레이션 정책',
      highlightedQuote:
        '기존 프로 플랜 고객사는 별도 위약금 없이 11월 15일까지 신규 볼륨 라이선스로 자동 전환되며, 초기 3개월간 초과 트래픽 과금을 유예합니다.',
      comments: [
        {
          author: '최수아',
          role: '출시 총괄 PM',
          avatar:
            './placeholders/avatar-32b9a55c6abe.svg',
          time: '오전 10:24',
          text: '@한소윤 유예 기간을 3개월로 명시할 경우 분기 매출 인식 기준에 영향이 없는지 재무팀 확인이 완료되었을까요?',
        },
        {
          author: '이준혁',
          role: '프론트엔드 리드',
          avatar:
            './placeholders/avatar-3a010bc432b4.svg',
          time: '오전 10:31',
          text: '결제 대시보드 상단 배너 문구도 해당 유예 기간 확정 후 오늘 오후에 반영하겠습니다.',
        },
      ],
    },
    'm-2': {
      docTitle: '웹사이트 리디자인 컴포넌트 명세서',
      sectionTitle: '1.4 다크 모드 대비율 및 접근성 기준',
      highlightedQuote:
        '모든 보조 설명 텍스트는 최소 4.5:1 이상의 명도 대비를 유지해야 하며, 읽지 않은 알림 배지는 보라색 강조 토큰을 사용합니다.',
      comments: [
        {
          author: '김서연',
          role: '프로덕트 디자이너',
          avatar:
            './placeholders/avatar-0cbdeb5e5e6f.svg',
          time: '어제 오후 4:15',
          text: '@한소윤 보라색 배지 토큰 밝기를 한 단계 높여 다크 테마 가독성을 개선했습니다. 피그마 시안 확인 부탁드려요!',
        },
      ],
    },
    'm-3': {
      docTitle: '모바일 온보딩 권한 안내 가이드',
      sectionTitle: '2.1 생체인증 및 푸시 알림 동의 화면',
      highlightedQuote:
        '최초 실행 시 알림 권한을 즉시 팝업으로 띄우지 않고, 첫 작업 배정 시점에 맥락형 바텀시트로 안내합니다.',
      comments: [
        {
          author: '박지민',
          role: 'UX 리서처',
          avatar:
            './placeholders/avatar-ed36204aee6b.svg',
          time: '2일 전',
          text: '@한소윤 사용성 테스트 결과 맥락형 안내 방식에서 수신 동의율이 68%에서 89%로 상승했습니다.',
        },
      ],
    },
  };

  const activeThread = mentionThreads[selectedMentionId];

  const renderStyle5MentionThread = () => (
    <section className="rounded-[28px] bg-zinc-100/85  border border-zinc-200/80  p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-blue-600 text-klic-on-emphasis text-[11px] font-mono font-semibold">
            KLIC/notif-5
          </span>
          <h3 className="text-base font-bold text-zinc-900 ">
            문서 인라인 멘션 & 스레드 대화 알림함
          </h3>
        </div>
        <span className="text-xs text-klic-muted">
          원문 하이라이트 문맥과 다자간 댓글 스레드를 한 화면에서 처리합니다
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 좌측: 멘션 수신 리스트 (4열) */}
        <div className="lg:col-span-5 space-y-2.5">
          {(
            [
              {
                id: 'm-1',
                sender: '최수아',
                avatar:
                  './placeholders/avatar-32b9a55c6abe.svg',
                doc: '2026 하반기 제품 출시 마스터 플랜',
                preview: '@한소윤 유예 기간을 3개월로 명시할 경우 분기 매출...',
                time: '12분 전',
                unread: true,
              },
              {
                id: 'm-2',
                sender: '김서연',
                avatar:
                  './placeholders/avatar-0cbdeb5e5e6f.svg',
                doc: '웹사이트 리디자인 컴포넌트 명세서',
                preview: '@한소윤 보라색 배지 토큰 밝기를 한 단계 높여...',
                time: '어제',
                unread: false,
              },
              {
                id: 'm-3',
                sender: '박지민',
                avatar:
                  './placeholders/avatar-ed36204aee6b.svg',
                doc: '모바일 온보딩 권한 안내 가이드',
                preview: '@한소윤 사용성 테스트 결과 맥락형 안내 방식에서...',
                time: '2일 전',
                unread: false,
              },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedMentionId(item.id)}
              className={`w-full text-left rounded-2xl p-4 border transition-all ${
                selectedMentionId === item.id
                  ? 'bg-white  border-blue-400  shadow-md'
                  : 'bg-white/70  border-zinc-200/80  hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <PersonAvatar
                    src={item.avatar}
                    alt={item.sender}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-zinc-900 ">
                      {item.sender}
                    </div>
                    <div className="text-[11px] text-klic-muted">{item.doc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                  <span className="text-[11px] text-klic-muted">{item.time}</span>
                </div>
              </div>
              <p className="mt-2.5 text-xs text-klic-muted  line-clamp-2">
                {item.preview}
              </p>
            </button>
          ))}
        </div>

        {/* 우측: 문서 원문 하이라이트 + 스레드 답장 패널 (7열) */}
        <div className="lg:col-span-7 rounded-2xl bg-white  border border-zinc-200/90  p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 ">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-zinc-900 ">
                  {activeThread.docTitle}
                </span>
                <span className="text-xs text-klic-muted">
                  / {activeThread.sectionTitle}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-amber-50  text-amber-800  text-[11px] font-semibold">
                원문 인용됨
              </span>
            </div>

            {/* 하이라이트된 문서 문장 */}
            <div className="mt-3.5 rounded-xl bg-amber-50/70  border-l-4 border-amber-400 p-3.5 text-xs leading-relaxed text-zinc-800 ">
              “{activeThread.highlightedQuote}”
            </div>

            {/* 댓글 스레드 목록 */}
            <div className="mt-4 space-y-3.5">
              {activeThread.comments.map((c, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <PersonAvatar
                    src={c.avatar}
                    alt={c.author}
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 rounded-2xl bg-zinc-50  p-3 border border-zinc-200/60 ">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 ">
                        {c.author}{' '}
                        <span className="font-normal text-klic-muted">
                          · {c.role}
                        </span>
                      </span>
                      <span className="text-[11px] text-klic-muted">{c.time}</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-700  leading-relaxed">
                      {c.text}
                    </p>
                  </div>
                </div>
              ))}

              {(customReplies[selectedMentionId] || []).map((reply, idx) => (
                <div key={`custom-${idx}`} className="flex items-start gap-3">
                  <PersonAvatar
                    src={reply.avatar}
                    alt={reply.author}
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 rounded-2xl bg-blue-50/60  p-3 border border-blue-200/70 ">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900 ">
                        {reply.author} (나)
                      </span>
                      <span className="text-[11px] text-blue-500">
                        {reply.time}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-800 ">
                      {reply.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 스레드 답장 입력창 */}
          <div className="mt-5 pt-3.5 border-t border-zinc-100  flex items-center gap-2">
            <PersonAvatar
              src="./placeholders/avatar-72e24f34ec07.svg"
              alt="한소윤"
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <input
              type="text"
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMentionReply();
              }}
              placeholder="이 문서 스레드에 댓글 답장 남기기..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-100  text-xs text-zinc-800  outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleSendMentionReply}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-klic-on-emphasis text-xs font-semibold transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              답장 등록
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  /* ========================================================================
   * STYLE 6: 일일 경영 브리핑 & 우선순위 요약 알림 (KLIC/notif-6)
   * ======================================================================== */
  const renderStyle6DailyDigest = () => (
    <section className="rounded-[28px] p-1.5 bg-zinc-200/75  border border-zinc-300/60 ">
      <div className="rounded-[22px] bg-white  p-6 sm:p-8 border border-zinc-200/70 ">
        {/* 상단 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100 ">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-600 text-klic-on-emphasis flex items-center justify-center shadow-md -rotate-3 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-klic-inverse  text-klic-on-emphasis  text-[11px] font-mono font-semibold">
                  KLIC/notif-6
                </span>
                <span className="text-xs font-semibold text-blue-600 ">
                  오전 08:30 정기 요약 브리핑
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900  mt-1">
                한소윤 총괄님을 위한 오늘의 프로젝트 핵심 알림 브리핑
              </h3>
            </div>
          </div>

          {/* 기여 멤버 샘플 아바타 클러스터 */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              <PersonAvatar
                src="./placeholders/avatar-576a55580552.svg"
                alt="김서연"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white "
              />
              <PersonAvatar
                src="./placeholders/avatar-d36430bc2634.svg"
                alt="이준혁"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white "
              />
              <PersonAvatar
                src="./placeholders/avatar-ef94a3ac14b1.svg"
                alt="박지민"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white "
              />
              <PersonAvatar
                src="./placeholders/avatar-d81ac24457b6.svg"
                alt="최수아"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white "
              />
            </div>
            <div className="text-xs text-klic-muted">
              밤사이 <strong className="text-zinc-900 ">18건</strong>의 업데이트
            </div>
          </div>
        </div>

        {/* 4열 요약 지표 타일 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-6">
          {[
            {
              label: '오늘 마감 작업',
              value: '3건',
              sub: '캠페인 기획안 외 2건',
              tone: 'text-amber-700 bg-amber-50/70 border-amber-200/70',
            },
            {
              label: '검토 대기 와이어프레임',
              value: '4건',
              sub: '김서연·이준혁 제출',
              tone: 'text-blue-700 bg-blue-50/70 border-blue-200/70',
            },
            {
              label: '지연 위험 프로젝트',
              value: '1건',
              sub: '프로덕트 런칭 (미착수 3)',
              tone: 'text-blue-700 bg-blue-50/70 border-blue-200/70',
            },
            {
              label: '어제 완료된 작업',
              value: '14건',
              sub: '목표 달성률 94%',
              tone: 'text-blue-700 bg-blue-50/70 border-blue-200/70',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl p-4 border ${stat.tone}   `}
            >
              <div className="text-xs font-semibold opacity-80">{stat.label}</div>
              <div className="text-2xl font-bold mt-1">{stat.value}</div>
              <div className="text-[11px] opacity-75 mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* 오늘 오전 우선 확인 체크리스트 */}
        <div className="rounded-2xl bg-zinc-50  border border-zinc-200/70  p-4">
          <div className="text-xs font-bold text-zinc-700  mb-3">
            오늘 오전 우선 확인 권장 항목
          </div>
          <div className="space-y-2.5">
            {[
              {
                id: 'd-1',
                title: '캠페인 기획안 베타 테스터 피드백 우선순위 확정 (오늘 마감)',
                owner: '이준혁 배정',
                avatar:
                  './placeholders/avatar-d36430bc2634.svg',
              },
              {
                id: 'd-2',
                title: '홈페이지 와이어프레임 3차 버전 최종 디자인 리뷰 코멘트',
                owner: '김서연 요청',
                avatar:
                  './placeholders/avatar-576a55580552.svg',
              },
              {
                id: 'd-3',
                title: '출시 준비 체크리스트 고객 지원 교육 일정 변경에 따른 상태 페이지 문구 승인',
                owner: '최수아 멘션',
                avatar:
                  './placeholders/avatar-d81ac24457b6.svg',
              },
            ].map((row) => {
              const checked = !!digestChecked[row.id];
              return (
                <div
                  key={row.id}
                  onClick={() =>
                    setDigestChecked((prev) => ({
                      ...prev,
                      [row.id]: !prev[row.id],
                    }))
                  }
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white  border border-zinc-200/70  cursor-pointer hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        checked
                          ? 'bg-blue-600 border-blue-600 text-klic-on-emphasis'
                          : 'border-zinc-300 '
                      }`}
                    >
                      {checked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span
                      className={`text-xs font-medium truncate ${
                        checked
                          ? 'line-through text-klic-muted'
                          : 'text-zinc-800 '
                      }`}
                    >
                      {row.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PersonAvatar
                      src={row.avatar}
                      alt={row.owner}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-[11px] text-klic-muted">{row.owner}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="space-y-6">
      {/* 상단 6종 알림 스타일 전환 바 */}
      <div className="rounded-2xl bg-zinc-100/90  border border-zinc-200/80  p-2 flex flex-wrap items-center gap-1.5">
        {MODE_TABS.map((tab) => {
          const isActive = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveMode(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-white  text-zinc-900  shadow-xs border border-zinc-200/80 '
                  : 'text-klic-muted  hover:text-zinc-900 '
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 선택된 알림 스타일 렌더링 */}
      {activeMode === 'project-updates' && renderStyle1ProjectUpdates()}
      {activeMode === 'floating-toast' && renderStyle2FloatingToast()}
      {activeMode === 'approval-center' && renderStyle3ApprovalCenter()}
      {activeMode === 'incident-pager' && renderStyle4IncidentPager()}
      {activeMode === 'mention-thread' && renderStyle5MentionThread()}
      {activeMode === 'daily-digest' && renderStyle6DailyDigest()}

      {activeMode === 'all-showcase' && (
        <div className="space-y-8">
          {renderStyle1ProjectUpdates()}
          {renderStyle2FloatingToast()}
          {renderStyle3ApprovalCenter()}
          {renderStyle4IncidentPager()}
          {renderStyle5MentionThread()}
          {renderStyle6DailyDigest()}
        </div>
      )}
    </div>
  );
}
