import { PersonAvatar } from '../PersonAvatar';
import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  Lock,
  Bell,
  Check,
  CheckCheck,
  MessageSquare,
  CornerDownRight,
  GitCommit,
  GitBranch,
  RotateCcw,
  Clock,
  Users,
  PhoneCall,
  Radio,
  Webhook,
  Copy,
  Send,
  Search,
  ChevronRight,
  AlertTriangle,
  Sparkles,
  Terminal,
} from 'lucide-react';

export type ListShowcaseMode =
  | 'audit-activity'
  | 'notification-inbox'
  | 'git-deployments'
  | 'team-directory'
  | 'api-webhooks';

interface ListShowcaseBlockProps {
  initialMode?: ListShowcaseMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

interface AuditLogItem {
  id: string;
  dateGroup: string;
  time: string;
  actorName: string;
  actorRole: string;
  avatar: string;
  actionTitle: string;
  targetResource: string;
  ipAddress: string;
  location: string;
  authMethod: string;
  riskLevel: '정상' | '주의' | '고위험';
  category: '권한 변경' | '인증 이벤트' | '고위험 경고';
  payloadPreview: string;
}

interface InboxItem {
  id: string;
  senderName: string;
  senderRole: string;
  avatar: string;
  timeAgo: string;
  type: '멘션' | '결재 요청' | '시스템 경보';
  title: string;
  quoteText: string;
  unread: boolean;
  repliedText?: string;
  approvalState?: 'pending' | 'approved' | 'rejected';
}

interface DeploymentItem {
  id: string;
  version: string;
  commitHash: string;
  branch: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  environment: '프로덕션' | '카나리' | '스테이징';
  status: '정상 가동' | '트래픽 검증 중' | '이전 버전';
  duration: string;
  deployedAgo: string;
  healthBars: ('ok' | 'warn')[];
}

interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  presence: '온라인' | '온콜 당번' | '집중 업무 중';
  clearance: '최고 관리자' | '배포 승인권자' | '보안 감사관';
  services: string[];
  phoneExt: string;
}

interface WebhookEndpointItem {
  id: string;
  name: string;
  url: string;
  active: boolean;
  successRate: string;
  avgLatency: string;
  events: string[];
  secret: string;
  recentDeliveries: ('ok' | 'ok' | 'warn' | 'fail')[];
}

const AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-1',
    dateGroup: '오늘 · 10월 22일',
    time: '오후 05:42:18',
    actorName: '한소윤 총괄 아키텍트',
    actorRole: '코어 플랫폼 본부',
    avatar:
      './placeholders/avatar-576a55580552.svg',
    actionTitle: '프로덕션 정산 원장 마스터 서명 키 교체 승인',
    targetResource: 'kms-key-seoul-settlement-v4',
    ipAddress: '211.45.108.19',
    location: '서울특별시 강남구',
    authMethod: '생체 패스키 + 하드웨어 보안키',
    riskLevel: '고위험',
    category: '고위험 경고',
    payloadPreview: '{"operation":"ROTATE_MASTER_KEY","region":"kr-seoul-1","mfa_verified":true}',
  },
  {
    id: 'aud-2',
    dateGroup: '오늘 · 10월 22일',
    time: '오후 04:15:03',
    actorName: '김지훈 수석 매니저',
    actorRole: '정보보안 거버넌스팀',
    avatar:
      './placeholders/avatar-d36430bc2634.svg',
    actionTitle: '외부 제휴사 API 호출 속도 제한 임계값 상향 조정',
    targetResource: 'rate-limit-policy-partner-tier',
    ipAddress: '10.240.18.92',
    location: '사내 전용망 게이트웨이',
    authMethod: '엔터프라이즈 SSO',
    riskLevel: '주의',
    category: '권한 변경',
    payloadPreview: '{"prev_rps":2500,"next_rps":5000,"approved_by":"sec-lead"}',
  },
  {
    id: 'aud-3',
    dateGroup: '오늘 · 10월 22일',
    time: '오후 02:08:44',
    actorName: '이서연 리드 엔지니어',
    actorRole: '정산 코어 스쿼드',
    avatar:
      './placeholders/avatar-ef94a3ac14b1.svg',
    actionTitle: '3분기 재무 감사 증적용 원장 스냅샷 무결성 검증 완료',
    targetResource: 'ledger-snapshot-2026-q3',
    ipAddress: '10.240.12.41',
    location: '경기도 성남시 판교 오피스',
    authMethod: '엔터프라이즈 SSO',
    riskLevel: '정상',
    category: '인증 이벤트',
    payloadPreview: '{"checksum":"sha256:9f82a10c...","records":1482900,"status":"VERIFIED"}',
  },
  {
    id: 'aud-4',
    dateGroup: '어제 · 10월 21일',
    time: '오후 11:19:50',
    actorName: '박현우 보안 엔지니어',
    actorRole: '정보보안 거버넌스팀',
    avatar:
      './placeholders/avatar-352373979408.svg',
    actionTitle: '비인가 해외 대역 접근 시도 자동 차단 정책 갱신',
    targetResource: 'waf-ruleset-global-edge',
    ipAddress: '211.45.108.22',
    location: '서울특별시 강남구',
    authMethod: '하드웨어 보안키',
    riskLevel: '정상',
    category: '권한 변경',
    payloadPreview: '{"blocked_cidrs":14,"action":"DROP_IMMEDIATE","edge_sync":"100%"}',
  },
];

const INITIAL_INBOX: InboxItem[] = [
  {
    id: 'inb-1',
    senderName: '강도원 수석 아키텍트',
    senderRole: '코어 플랫폼 본부',
    avatar:
      './placeholders/avatar-d36430bc2634.svg',
    timeAgo: '6분 전',
    type: '멘션',
    title: '플레이북 할인율 가드레일 정책 문서에서 회원님을 멘션했습니다',
    quoteText:
      '@한소윤 총괄님, 연간 약정 클라이언트의 최대 할인율 상한선을 15%로 고정하는 안에 대해 최종 검토 부탁드립니다.',
    unread: true,
  },
  {
    id: 'inb-2',
    senderName: '정유진 재무 총괄',
    senderRole: '전략재무본부',
    avatar:
      './placeholders/avatar-8c2580aea9a4.svg',
    timeAgo: '28분 전',
    type: '결재 요청',
    title: '서울·도쿄 리전 예비 GPU 노드 연간 약정 증설 품의서 승인 요청',
    quoteText:
      '월간 청구액 ₩14,800,000 · 실시간 추론 트래픽 2.4배 증가에 따른 무중단 처리 용량 확보 건입니다.',
    unread: true,
    approvalState: 'pending',
  },
  {
    id: 'inb-3',
    senderName: '자율 관제 에이전트',
    senderRole: '시스템 가드레일 모니터',
    avatar:
      './placeholders/avatar-f0911aecec62.svg',
    timeAgo: '1시간 전',
    type: '시스템 경보',
    title: '한빛핀테크 정산 웹훅 엔드포인트 재시도 성공 및 정상 복구 알림',
    quoteText:
      '일시적 네트워크 지연으로 2회 재시도 후 오전 04:12 KST 기준 모든 정산 큐(1,420건)가 100% 동기화되었습니다.',
    unread: false,
  },
];

const INITIAL_DEPLOYMENTS: DeploymentItem[] = [
  {
    id: 'dep-1',
    version: 'v4.8.2-prod',
    commitHash: '8f4a92c',
    branch: 'main ← feat/settlement-batch-v4',
    title: '다중 통화 실시간 정산 파이프라인 배치 처리 속도 2.4배 최적화',
    authorName: '한소윤 총괄',
    authorAvatar:
      './placeholders/avatar-576a55580552.svg',
    environment: '프로덕션',
    status: '정상 가동',
    duration: '1분 12초',
    deployedAgo: '14분 전',
    healthBars: ['ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok'],
  },
  {
    id: 'dep-2',
    version: 'v4.8.3-rc1',
    commitHash: '3c91e04',
    branch: 'canary ← fix/webhook-retry-backoff',
    title: '외부 카드사 응답 지연 시 지수 백오프 및 예비 리전 자동 우회 로직 적용',
    authorName: '이서연 리드',
    authorAvatar:
      './placeholders/avatar-ef94a3ac14b1.svg',
    environment: '카나리',
    status: '트래픽 검증 중',
    duration: '58초',
    deployedAgo: '39분 전',
    healthBars: ['ok', 'ok', 'ok', 'ok', 'warn', 'ok', 'ok', 'ok', 'ok', 'ok'],
  },
  {
    id: 'dep-3',
    version: 'v4.8.1-prod',
    commitHash: '7a12d88',
    branch: 'main ← feat/playbook-conflict-ui',
    title: '어드바이저 지식 베이스 가격 정책 충돌 좌우 비교 뷰 및 버전 병합기 배포',
    authorName: '김지훈 수석',
    authorAvatar:
      './placeholders/avatar-d36430bc2634.svg',
    environment: '프로덕션',
    status: '이전 버전',
    duration: '1분 05초',
    deployedAgo: '3시간 전',
    healthBars: ['ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok'],
  },
];

const TEAM_DIRECTORY: TeamMemberItem[] = [
  {
    id: 'tm-1',
    name: '한소윤',
    role: '수석 시스템 아키텍트',
    department: '코어 정산 플랫폼 본부',
    avatar:
      './placeholders/avatar-576a55580552.svg',
    presence: '온콜 당번',
    clearance: '최고 관리자',
    services: ['정산 원장 코어', 'KMS 암호화 금고'],
    phoneExt: '내선 var(--klic-component-block-color-text)',
  },
  {
    id: 'tm-2',
    name: '강도원',
    role: '리드 인프라 엔지니어',
    department: '코어 정산 플랫폼 본부',
    avatar:
      './placeholders/avatar-d36430bc2634.svg',
    presence: '온라인',
    clearance: '배포 승인권자',
    services: ['서울·도쿄 클러스터', '무중단 카나리 배포'],
    phoneExt: '내선 var(--klic-component-block-color-accent)',
  },
  {
    id: 'tm-3',
    name: '이서연',
    role: '시니어 보안 감사관',
    department: '정보보안 및 거버넌스팀',
    avatar:
      './placeholders/avatar-ef94a3ac14b1.svg',
    presence: '온라인',
    clearance: '보안 감사관',
    services: ['SIEM 감사 스트림', '제로트러스트 권한'],
    phoneExt: '내선 var(--klic-component-block-color-accent)',
  },
  {
    id: 'tm-4',
    name: '박현우',
    role: '데이터 파이프라인 리드',
    department: '정보보안 및 거버넌스팀',
    avatar:
      './placeholders/avatar-352373979408.svg',
    presence: '집중 업무 중',
    clearance: '배포 승인권자',
    services: ['웹훅 스트림 엔진', '실시간 이상 징후 탐지'],
    phoneExt: '내선 var(--klic-component-block-color-accent)',
  },
];

const INITIAL_WEBHOOKS: WebhookEndpointItem[] = [
  {
    id: 'wh-list-1',
    name: '한빛핀테크 프로덕션 정산 수신 서버',
    url: 'https://api.hanbitfintech.kr/v2/flux/settlement-events',
    active: true,
    successRate: '99.98%',
    avgLatency: '34ms',
    events: ['결제 승인 완료', '일일 정산 마감', '환불 원장 반영'],
    secret: 'whsec_flux_live_98a1c44b2e09',
    recentDeliveries: [
      'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok',
      'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok',
    ],
  },
  {
    id: 'wh-list-2',
    name: '두나무클라우드 보안 감사 SIEM 수집기',
    url: 'https://siem.dunamucloud.kr/ingest/flux-audit-stream',
    active: true,
    successRate: '99.40%',
    avgLatency: '62ms',
    events: ['관리자 권한 변경', 'API 토큰 발급', '비인가 접근 차단'],
    secret: 'whsec_flux_live_31f0d88e7a12',
    recentDeliveries: [
      'ok', 'ok', 'ok', 'warn', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok',
      'ok', 'ok', 'warn', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok',
    ],
  },
  {
    id: 'wh-list-3',
    name: '더존비즈온 ERP 전표 자동화 브릿지',
    url: 'https://erp-hook.datanexus.kr/webhooks/invoice-sync',
    active: false,
    successRate: '94.20%',
    avgLatency: '118ms',
    events: ['세금계산서 발행', '월간 구독 갱신'],
    secret: 'whsec_flux_live_77b5e19c4d30',
    recentDeliveries: [
      'ok', 'ok', 'fail', 'ok', 'ok', 'ok', 'warn', 'ok', 'ok', 'ok',
      'ok', 'ok', 'ok', 'ok', 'ok', 'fail', 'ok', 'ok', 'ok', 'ok',
    ],
  },
];

export function ListShowcaseBlock({
  initialMode = 'audit-activity',
  density = 'normal',
}: ListShowcaseBlockProps) {
  const [activeMode, setActiveMode] = useState<ListShowcaseMode>(initialMode);

  // 스타일 1 상태: 보안 감사 로그
  const [auditFilter, setAuditFilter] = useState<string>('전체');
  const [expandedAuditId, setExpandedAuditId] = useState<string | null>('aud-1');

  // 스타일 2 상태: 통합 알림 인박스
  const [inboxItems, setInboxItems] = useState<InboxItem[]>(INITIAL_INBOX);
  const [inboxFilter, setInboxFilter] = useState<'전체' | '읽지 않음' | '멘션' | '결재 요청'>('전체');
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');

  // 스타일 3 상태: 배포 이력
  const [activeRollbackId, setActiveRollbackId] = useState<string>('dep-1');

  // 스타일 4 상태: 팀 디렉토리
  const [pingedMemberId, setPingedMemberId] = useState<string | null>(null);

  // 스타일 5 상태: 웹훅 엔드포인트
  const [webhooks, setWebhooks] = useState<WebhookEndpointItem[]>(INITIAL_WEBHOOKS);
  const [pingedWebhookId, setPingedWebhookId] = useState<string | null>(null);
  const [copiedSecretId, setCopiedSecretId] = useState<string | null>(null);

  React.useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  const rowPad =
    density === 'compact' ? 'p-3.5' : density === 'relaxed' ? 'p-5' : 'p-4';

  // 1. 보안 감사 & 활동 로그 타임라인 피드 목록 (KLIC/list-1)
  const renderAuditActivityList = () => {
    const filtered =
      auditFilter === '전체'
        ? AUDIT_LOGS
        : AUDIT_LOGS.filter((item) => item.category === auditFilter);

    return (
      <div className="w-full max-w-[820px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs">
        {/* 상단 베젤 헤더 */}
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-zinc-700 " />
            <span className="text-[13.5px] font-semibold text-zinc-900 ">
              보안 감사 & 활동 로그 피드
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white  border border-zinc-200/80  text-[11px] font-medium text-klic-muted ">
              위변조 방지 서명됨
            </span>
          </div>

          <div className="flex items-center gap-1">
            {['전체', '고위험 경고', '권한 변경', '인증 이벤트'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setAuditFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-[11.5px] font-medium transition-all cursor-pointer ${
                  auditFilter === f
                    ? 'bg-klic-inverse text-klic-on-emphasis  '
                    : 'text-klic-muted  hover:bg-zinc-200/60'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* 내부 화이트 타임라인 컨테이너 */}
        <div className="rounded-[14px] bg-white  border border-zinc-200/80  p-5">
          <div className="relative pl-6 border-l-2 border-zinc-100  space-y-5">
            {filtered.map((log) => {
              const isExpanded = expandedAuditId === log.id;
              return (
                <div key={log.id} className="relative group">
                  {/* 타임라인 노드 도트 */}
                  <span
                    className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white  ${
                      log.riskLevel === '고위험'
                        ? 'bg-blue-500 ring-4 ring-blue-500/15'
                        : log.riskLevel === '주의'
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                  />

                  <div className="rounded-xl border border-zinc-200/80  bg-white  p-4 hover:border-zinc-300 transition-all">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <PersonAvatar
                          src={log.avatar}
                          alt={log.actorName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[13.5px] font-semibold text-zinc-900 ">
                              {log.actionTitle}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                                log.riskLevel === '고위험'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200/70  '
                                  : log.riskLevel === '주의'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200/70  '
                                  : 'bg-blue-50 text-blue-700 border border-blue-200/70  '
                              }`}
                            >
                              {log.riskLevel}
                            </span>
                          </div>
                          <div className="text-[12px] text-klic-muted mt-0.5">
                            {log.actorName} ({log.actorRole}) · 대상 리소스:{' '}
                            <code className="font-mono text-zinc-700 ">
                              {log.targetResource}
                            </code>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11.5px] text-klic-muted">{log.time}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedAuditId(isExpanded ? null : log.id)
                          }
                          className="px-2 py-1 rounded-lg bg-zinc-100  text-[11px] font-medium text-zinc-700  hover:bg-zinc-200/70 cursor-pointer"
                        >
                          {isExpanded ? '패킷 접기' : '증적 보기'}
                        </button>
                      </div>
                    </div>

                    {/* 하단 메타데이터 칩 */}
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11.5px] text-klic-muted">
                      <span className="px-2 py-0.5 rounded bg-zinc-50  border border-zinc-200/70  font-mono">
                        IP: {log.ipAddress}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-50  border border-zinc-200/70 ">
                        위치: {log.location}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-50  border border-zinc-200/70 ">
                        인증 수단: {log.authMethod}
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 rounded-lg bg-klic-inverse text-klic-on-emphasis p-3 font-mono text-[11.5px] flex items-center justify-between gap-2">
                        <span className="truncate">{log.payloadPreview}</span>
                        <span className="text-blue-400 text-[10.5px] shrink-0">
                          무결성 검증 통과
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 2. 통합 알림 인박스 & 멘션 스레드 목록 (KLIC/list-2)
  const renderNotificationInboxList = () => {
    const filtered = inboxItems.filter((item) => {
      if (inboxFilter === '읽지 않음') return item.unread;
      if (inboxFilter === '멘션') return item.type === '멘션';
      if (inboxFilter === '결재 요청') return item.type === '결재 요청';
      return true;
    });

    return (
      <div className="w-full max-w-[780px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs">
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {(['전체', '읽지 않음', '멘션', '결재 요청'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setInboxFilter(tab)}
                className={`px-3 py-1 rounded-lg text-[12px] font-medium transition-all cursor-pointer ${
                  inboxFilter === tab
                    ? 'bg-white  text-zinc-900  shadow-2xs'
                    : 'text-klic-muted  hover:text-zinc-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setInboxItems((prev) => prev.map((i) => ({ ...i, unread: false })))
            }
            className="text-[12px] font-medium text-klic-muted  hover:text-zinc-950 flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>모두 읽음 처리</span>
          </button>
        </div>

        <div className="rounded-[14px] bg-white  border border-zinc-200/80  divide-y divide-zinc-100  overflow-hidden">
          {filtered.map((item) => (
            <div key={item.id} className={`${rowPad} space-y-3`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0 mt-0.5">
                    <PersonAvatar
                      src={item.avatar}
                      alt={item.senderName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    {item.unread && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white " />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13.5px] font-semibold text-zinc-900 ">
                        {item.senderName}
                      </span>
                      <span className="text-[12px] text-klic-muted">{item.senderRole}</span>
                      <span className="px-2 py-0.5 rounded-md bg-zinc-100  text-[11px] font-medium text-zinc-700 ">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-[13px] font-medium text-zinc-800  mt-0.5">
                      {item.title}
                    </p>
                  </div>
                </div>
                <span className="text-[11.5px] text-klic-muted shrink-0">{item.timeAgo}</span>
              </div>

              {/* 인용 컨텍스트 박스 */}
              <div className="ml-12 rounded-xl bg-zinc-50  border border-zinc-200/70  p-3 text-[12.5px] text-klic-muted  leading-relaxed">
                {item.quoteText}
              </div>

              {/* 하단 인라인 액션 */}
              <div className="ml-12 flex flex-wrap items-center justify-between gap-2">
                {item.type === '결재 요청' ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setInboxItems((prev) =>
                          prev.map((x) =>
                            x.id === item.id
                              ? { ...x, approvalState: 'approved', unread: false }
                              : x
                          )
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-klic-inverse  text-klic-on-emphasis  text-[12px] font-medium cursor-pointer"
                    >
                      {item.approvalState === 'approved' ? '✓ 승인 완료됨' : '즉시 승인'}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setInboxItems((prev) =>
                          prev.map((x) =>
                            x.id === item.id
                              ? { ...x, approvalState: 'rejected', unread: false }
                              : x
                          )
                        )
                      }
                      className="px-3 py-1.5 rounded-lg border border-zinc-200  text-[12px] font-medium text-klic-muted  cursor-pointer"
                    >
                      {item.approvalState === 'rejected' ? '반려 처리됨' : '반려'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setReplyingId(replyingId === item.id ? null : item.id)
                      }
                      className="px-3 py-1 rounded-lg border border-zinc-200  text-[12px] font-medium text-zinc-700  hover:bg-zinc-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      <CornerDownRight className="w-3.5 h-3.5 text-klic-muted" />
                      <span>인라인 답장</span>
                    </button>
                    {item.repliedText && (
                      <span className="text-[12px] text-blue-600 font-medium">
                        답장 발송됨: "{item.repliedText}"
                      </span>
                    )}
                  </div>
                )}
              </div>

              {replyingId === item.id && (
                <div className="ml-12 flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={replyDraft}
                    onChange={(e) => setReplyDraft(e.target.value)}
                    placeholder="답장 내용을 입력하세요..."
                    className="flex-1 rounded-xl border border-zinc-200  bg-white  px-3 py-1.5 text-[12.5px] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!replyDraft.trim()) return;
                      setInboxItems((prev) =>
                        prev.map((x) =>
                          x.id === item.id
                            ? { ...x, repliedText: replyDraft.trim(), unread: false }
                            : x
                        )
                      );
                      setReplyDraft('');
                      setReplyingId(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-klic-inverse text-klic-on-emphasis text-[12px] font-medium cursor-pointer"
                  >
                    전송
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 3. 프로덕션 배포 & 릴리즈 커밋 이력 목록 (KLIC/list-3)
  const renderGitDeploymentsList = () => (
    <div className="w-full max-w-[820px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-zinc-700 " />
          <span className="text-[13.5px] font-semibold text-zinc-900 ">
            프로덕션 커밋 & 배포 파이프라인 이력
          </span>
        </div>
        <span className="text-[12px] text-klic-muted">
          현재 활성 릴리즈:{' '}
          <strong className="text-zinc-900 ">
            {INITIAL_DEPLOYMENTS.find((d) => d.id === activeRollbackId)?.version}
          </strong>
        </span>
      </div>

      {INITIAL_DEPLOYMENTS.map((dep) => {
        const isCurrentActive = activeRollbackId === dep.id;
        return (
          <div
            key={dep.id}
            className={`rounded-[14px] bg-white  border border-zinc-200/80  ${rowPad} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-klic-inverse  text-klic-on-emphasis  text-[11.5px] font-mono font-semibold">
                  {dep.version}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-zinc-100  text-zinc-700  text-[11px] font-mono flex items-center gap-1">
                  <GitCommit className="w-3 h-3" />
                  {dep.commitHash}
                </span>
                <span className="text-[12px] font-mono text-klic-muted">{dep.branch}</span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                    isCurrentActive
                      ? 'bg-blue-50 text-blue-700  '
                      : 'bg-zinc-100 text-klic-muted  '
                  }`}
                >
                  {isCurrentActive ? '현재 프로덕션 활성' : dep.status}
                </span>
              </div>

              <h4 className="text-[14px] font-semibold text-zinc-900 ">
                {dep.title}
              </h4>

              <div className="flex items-center gap-3 text-[12px] text-klic-muted">
                <div className="flex items-center gap-1.5">
                  <PersonAvatar
                    src={dep.authorAvatar}
                    alt={dep.authorName}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="font-medium text-zinc-700 ">
                    {dep.authorName}
                  </span>
                </div>
                <span>· 빌드 소요 {dep.duration}</span>
                <span>· {dep.deployedAgo}</span>
              </div>
            </div>

            {/* 우측 헬스 미니 바 + 롤백 버튼 */}
            <div className="flex sm:flex-col items-end justify-between gap-2.5 shrink-0">
              <div className="flex items-center gap-1" title="최근 10분 헬스체크">
                {dep.healthBars.map((hb, idx) => (
                  <span
                    key={idx}
                    className={`w-1.5 h-4 rounded-xs ${
                      hb === 'ok' ? 'bg-blue-500' : 'bg-amber-400'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveRollbackId(dep.id)}
                className={`px-3 py-1.5 rounded-xl border text-[12px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  isCurrentActive
                    ? 'border-blue-200 bg-blue-50/60 text-blue-700   '
                    : 'border-zinc-200  hover:bg-zinc-50 text-zinc-700 '
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isCurrentActive ? '현재 가동 중인 버전' : '이 버전으로 즉시 전환'}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  // 4. 조직 구성원 & 온콜 당번 디렉토리 목록 (KLIC/list-4)
  const renderTeamDirectoryList = () => (
    <div className="w-full max-w-[780px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
      {/* 상단 온콜 당번 배너 */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[13.5px] font-semibold text-zinc-900 ">
            조직 구성원 & 실시간 온콜 당번 디렉토리
          </span>
        </div>
        <span className="text-[12px] text-klic-muted">
          1차 온콜 책임자: <strong className="text-zinc-900 ">한소윤 수석</strong>
        </span>
      </div>

      <div className="rounded-[14px] bg-white  border border-zinc-200/80  divide-y divide-zinc-100  overflow-hidden">
        {TEAM_DIRECTORY.map((member) => {
          const isPinged = pingedMemberId === member.id;
          return (
            <div
              key={member.id}
              className={`${rowPad} flex flex-wrap items-center justify-between gap-4 hover:bg-zinc-50/50  transition-colors`}
            >
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <PersonAvatar
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-zinc-100 "
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white  ${
                      member.presence === '온콜 당번'
                        ? 'bg-blue-500'
                        : member.presence === '온라인'
                        ? 'bg-blue-500'
                        : 'bg-amber-500'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] font-semibold text-zinc-900 ">
                      {member.name}
                    </span>
                    <span className="text-[12.5px] text-klic-muted">{member.role}</span>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100  text-[11px] font-semibold text-zinc-700 ">
                      {member.clearance}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap text-[12px] text-klic-muted">
                    <span>{member.department}</span>
                    <span>·</span>
                    {member.services.map((srv) => (
                      <span
                        key={srv}
                        className="px-1.5 py-0.5 rounded bg-zinc-50  border border-zinc-200/70  text-[11px] text-klic-muted "
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-50  text-[11.5px] font-medium text-klic-muted ">
                  {member.presence}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPingedMemberId(member.id);
                    setTimeout(() => setPingedMemberId(null), 1800);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-zinc-200  bg-white  hover:bg-zinc-50 text-[12px] font-medium text-zinc-800  flex items-center gap-1.5 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-klic-muted" />
                  <span>{isPinged ? '호출 알림 전송됨' : '온콜 호출'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // 5. 등록된 웹훅 엔드포인트 목록 (KLIC/list-5)
  const renderApiWebhooksList = () => (
    <div className="w-full max-w-[820px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Webhook className="w-4 h-4 text-zinc-700 " />
          <span className="text-[13.5px] font-semibold text-zinc-900 ">
            등록된 웹훅 엔드포인트 & 실시간 전송 상태 목록
          </span>
        </div>
        <span className="text-[12px] text-klic-muted">최근 20회 이벤트 전송 스트립</span>
      </div>

      {webhooks.map((wh) => {
        const isPinged = pingedWebhookId === wh.id;
        return (
          <div
            key={wh.id}
            className={`rounded-[14px] bg-white  border border-zinc-200/80  ${rowPad} space-y-3.5`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-[14px] font-semibold text-zinc-900 ">
                    {wh.name}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                      wh.active
                        ? 'bg-blue-50 text-blue-700  '
                        : 'bg-zinc-100 text-klic-muted '
                    }`}
                  >
                    {wh.active ? '수신 활성' : '일시 중지됨'}
                  </span>
                </div>
                <p className="text-[12.5px] font-mono text-klic-muted mt-1">{wh.url}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPingedWebhookId(wh.id);
                    setTimeout(() => setPingedWebhookId(null), 1800);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-zinc-200  text-[12px] font-medium text-zinc-700  hover:bg-zinc-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-klic-muted" />
                  <span>{isPinged ? '200 정상 응답 (28ms)' : '테스트 핑 발송'}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setWebhooks((prev) =>
                      prev.map((item) =>
                        item.id === wh.id ? { ...item, active: !item.active } : item
                      )
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-klic-inverse  text-klic-on-emphasis  text-[12px] font-medium cursor-pointer"
                >
                  {wh.active ? '일시 중지' : '다시 활성화'}
                </button>
              </div>
            </div>

            {/* 중간: 구독 이벤트 태그 + 최근 20회 전송 상태 바 */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-1.5">
                {wh.events.map((ev) => (
                  <span
                    key={ev}
                    className="px-2 py-0.5 rounded-md bg-zinc-100  text-[11px] font-medium text-zinc-700 "
                  >
                    {ev}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {wh.recentDeliveries.map((st, idx) => (
                    <span
                      key={idx}
                      className={`w-1.5 h-4 rounded-xs ${
                        st === 'ok'
                          ? 'bg-blue-500'
                          : st === 'warn'
                          ? 'bg-amber-400'
                          : 'bg-blue-500'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[12px] font-semibold text-zinc-800 ">
                  {wh.successRate} · {wh.avgLatency}
                </span>
              </div>
            </div>

            {/* 하단: 서명 시크릿 키 복사 */}
            <div className="pt-2 border-t border-zinc-100  flex items-center justify-between text-[12px]">
              <span className="text-klic-muted font-mono">
                서명 키: {wh.secret.slice(0, 16)}••••••
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(wh.secret);
                  setCopiedSecretId(wh.id);
                  setTimeout(() => setCopiedSecretId(null), 1800);
                }}
                className="text-klic-muted  hover:text-zinc-950 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-klic-muted" />
                <span>{copiedSecretId === wh.id ? '시크릿 복사됨' : '서명 키 복사'}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full bg-white  rounded-2xl border border-zinc-200/80  overflow-hidden">
      {/* 상단 목록 스타일 전환 탭 바 (한글 전용) */}
      <div className="px-5 py-3.5 border-b border-zinc-200/80  bg-zinc-50/60  flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-klic-inverse " />
          <span className="text-[13px] font-semibold text-zinc-900 ">
            KLIC 엔터프라이즈 목록 컬렉션
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'audit-activity', label: '보안 감사 로그' },
              { id: 'notification-inbox', label: '통합 알림 인박스' },
              { id: 'git-deployments', label: '커밋 & 배포 이력' },
              { id: 'team-directory', label: '구성원 & 온콜 당번' },
              { id: 'api-webhooks', label: '웹훅 엔드포인트' },
            ] as { id: ListShowcaseMode; label: string }[]
          ).map((tab) => {
            const active = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveMode(tab.id)}
                className={`px-2.5 py-1 rounded-lg text-[12px] font-medium transition-all cursor-pointer ${
                  active
                    ? 'bg-klic-inverse text-klic-on-emphasis   shadow-2xs'
                    : 'text-klic-muted  hover:bg-zinc-200/60 '
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 본문 영역 */}
      <div className="p-6 sm:p-10 bg-white ">
        {activeMode === 'audit-activity' && renderAuditActivityList()}
        {activeMode === 'notification-inbox' && renderNotificationInboxList()}
        {activeMode === 'git-deployments' && renderGitDeploymentsList()}
        {activeMode === 'team-directory' && renderTeamDirectoryList()}
        {activeMode === 'api-webhooks' && renderApiWebhooksList()}
      </div>
    </div>
  );
}
