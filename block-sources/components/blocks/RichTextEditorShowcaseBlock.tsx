import React, { useState } from 'react';
import {
  FileText,
  Code2,
  MessageSquare,
  AlertTriangle,
  Mail,
  Plus,
  CheckSquare,
  Square,
  GripVertical,
  Sparkles,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link2,
  List,
  ListOrdered,
  Quote,
  Terminal,
  Table,
  Eye,
  SplitSquareVertical,
  Check,
  X,
  Send,
  AtSign,
  Clock,
  ShieldAlert,
  UserCheck,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Copy,
  ArrowUp,
  ArrowDown,
  Trash2,
} from 'lucide-react';

export type RichTextEditorMode =
  | 'all-showcase'
  | 'slash-doc'
  | 'markdown-spec'
  | 'collab-comment'
  | 'incident-postmortem'
  | 'email-campaign';

interface RichTextEditorShowcaseBlockProps {
  initialMode?: RichTextEditorMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

interface DocBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'todo' | 'callout' | 'code' | 'table';
  content: string;
  checked?: boolean;
  meta?: string;
}

interface CommentThread {
  id: string;
  quote: string;
  author: string;
  role: string;
  time: string;
  body: string;
  resolved: boolean;
  isSuggestion?: boolean;
  originalText?: string;
  suggestedText?: string;
  suggestionStatus?: 'pending' | 'accepted' | 'rejected';
  replies: { author: string; time: string; text: string }[];
}

interface TimelineRow {
  id: string;
  time: string;
  phase: '감지' | '완화' | '복구' | '검증';
  actor: string;
  event: string;
}

interface ActionItemRow {
  id: string;
  code: string;
  task: string;
  owner: string;
  due: string;
  done: boolean;
}

export const RichTextEditorShowcaseBlock: React.FC<RichTextEditorShowcaseBlockProps> = ({
  initialMode = 'all-showcase',
}) => {
  const [activeTab, setActiveTab] = useState<RichTextEditorMode>(initialMode);

  React.useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode]);

  // ---------------------------------------------------------------------------
  // 1. 슬래시 블록 에디터 (rte-slash-document) 상태
  // ---------------------------------------------------------------------------
  const [docTitle, setDocTitle] = useState('2026 Q2 멀티 리전 결제 라우터 전환 실행 계획서');
  const [slashMenuOpen, setSlashMenuOpen] = useState(true);
  const [slashFilter, setSlashFilter] = useState('');
  const [docBlocks, setDocBlocks] = useState<DocBlock[]>([
    {
      id: 'b-1',
      type: 'callout',
      content: '핵심 목표: 서울(ap-northeast-2) 단일 리전 장애 시 도쿄/싱가포르 백업 코어로 1.2초 이내 무중단 자동 우회(Failover) 달성',
      meta: 'SLA 99.995% 필수 요건',
    },
    {
      id: 'b-2',
      type: 'heading',
      content: '1. 단계별 트래픽 카나리 가중치 체크리스트',
    },
    {
      id: 'b-3',
      type: 'todo',
      content: '사내 임직원 결제 테스트 그룹 5% 라우팅 전환 및 지연시간 p99 계측',
      checked: true,
    },
    {
      id: 'b-4',
      type: 'todo',
      content: '전체 가맹점 25% 카나리 승격 및 VAN사 이중 승인 방어 필터 검증',
      checked: true,
    },
    {
      id: 'b-5',
      type: 'todo',
      content: '100% 프로덕션 전환 완료 후 구형 프록시 노드 드레이닝(Draining)',
      checked: false,
    },
    {
      id: 'b-6',
      type: 'code',
      content: `fluxctl router weight --service payment-core-v3 \\
  --primary ap-northeast-2=80 \\
  --failover ap-northeast-1=20 --canary-guard=strict`,
      meta: 'bash · SRE CLI',
    },
  ]);

  const toggleTodoBlock = (id: string) => {
    setDocBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, checked: !b.checked } : b))
    );
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= docBlocks.length) return;
    setDocBlocks((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  const removeBlock = (id: string) => {
    setDocBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const insertSlashBlock = (type: DocBlock['type']) => {
    const id = `b-${Date.now()}`;
    const templates: Record<DocBlock['type'], DocBlock> = {
      heading: { id, type: 'heading', content: '2. 신규 아키텍처 검증 섹션' },
      todo: { id, type: 'todo', content: '신규 검증 항목: DB 읽기 복제본 지연 50ms 이하 확인', checked: false },
      callout: { id, type: 'callout', content: '주의: 카나리 승격 중 에러율 0.05% 초과 시 즉시 자동 롤백이 트리거됩니다.', meta: '자동 방어 규칙' },
      code: { id, type: 'code', content: 'SELECT region, count(*), avg(latency_ms) FROM tx_ledger GROUP BY 1;', meta: 'sql · ClickHouse' },
      table: { id, type: 'table', content: '리전별 목표 처리량(TPS) 및 허용 지연시간 매트릭스' },
      paragraph: { id, type: 'paragraph', content: '추가 기술 검토 의견을 이곳에 작성합니다.' },
    };
    setDocBlocks((prev) => [...prev, templates[type]]);
    setSlashMenuOpen(false);
    setSlashFilter('');
  };

  // ---------------------------------------------------------------------------
  // 2. 기술 마크다운 에디터 (rte-markdown-tech-spec) 상태
  // ---------------------------------------------------------------------------
  const [mdViewMode, setMdViewMode] = useState<'split' | 'source' | 'preview'>('split');
  const [rfcStatus, setRfcStatus] = useState<'DRAFT' | 'IN REVIEW' | 'APPROVED'>('IN REVIEW');
  const [markdownSource, setMarkdownSource] = useState<string>(`# RFC-042: 제로 트러스트 토큰 서명 키 무중단 회전 프로토콜

> **작성자**: 코어 보안팀 김태호 · **검토 기한**: 2026-04-30 · **대상 버전**: \`v4.8.0-rc2\`

## 1. 배경 및 문제 정의
기존 단일 RSA-2048 서명 키 구조에서는 키 교체 시점마다 **최대 180초간 이전 세션 토큰 검증 실패**가 발생할 위험이 존재합니다. 이를 해결하기 위해 \`Active + Grace + Next\` 3중 키 링 구조를 도입합니다.

## 2. 처리량 한계 수식 모델
초당 서명 검증 한계치 $Q_{max}$ 는 워커 코어 수 $N$ 과 평균 검증 시간 $T_{verify}$ 에 반비례합니다:
$$Q_{max} = \\frac{N_{cores} \\times 1000}{T_{verify}(ms)} \\times \\eta_{cache}$$

## 3. JWKS 키 링 설정 스펙
\`\`\`json
{
  "keyring_id": "kr-prod-seoul-01",
  "algorithm": "EdDSA-Ed25519",
  "rotation_interval_hours": 24,
  "grace_period_minutes": 60
}
\`\`\``);

  // ---------------------------------------------------------------------------
  // 3. 공동 편집 에디터 (rte-collaborative-comment) 상태
  // ---------------------------------------------------------------------------
  const [activeThreadId, setActiveThreadId] = useState<string>('th-1');
  const [replyDraft, setReplyDraft] = useState<string>('');
  const [threads, setThreads] = useState<CommentThread[]>([
    {
      id: 'th-1',
      quote: '데이터 보존 주기를 기존 90일에서 30일로 단축',
      author: '박지민',
      role: 'SecOps 리드',
      time: '12분 전',
      body: '@김도윤 금융보안원 전자금융감독규정 제14조에 따라 원본 감사 로그는 최소 1년(365일) 핫/웜 스토리지 보관이 필수입니다.',
      resolved: false,
      isSuggestion: true,
      originalText: '90일에서 30일로 단축',
      suggestedText: '90일에서 365일(콜드 아카이브 포함)로 확장',
      suggestionStatus: 'pending',
      replies: [
        {
          author: '김도윤 (인프라)',
          time: '5분 전',
          text: '확인했습니다! S3 Glacier Deep Archive 전환 정책 포함하여 365일로 수정 제안 승인하겠습니다.',
        },
      ],
    },
    {
      id: 'th-2',
      quote: '외부 파트너사 API 호출 시 고정 IP 화이트리스트만 검증',
      author: '이서연',
      role: '플랫폼 아키텍트',
      time: '34분 전',
      body: '고정 IP만으로는 클라우드 NAT 공유 환경에서 스푸핑 위험이 있습니다. mTLS 클라이언트 인증서 필수 검증 문구를 추가해주세요.',
      resolved: false,
      isSuggestion: false,
      replies: [],
    },
  ]);

  const handleSuggestionAction = (id: string, status: 'accepted' | 'rejected') => {
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, suggestionStatus: status, resolved: status === 'accepted' } : t))
    );
  };

  const handleAddReply = (threadId: string) => {
    if (!replyDraft.trim()) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              replies: [
                ...t.replies,
                { author: '나 (현재 편집자)', time: '방금 전', text: replyDraft.trim() },
              ],
            }
          : t
      )
    );
    setReplyDraft('');
  };

  // ---------------------------------------------------------------------------
  // 4. 포스트모템 에디터 (rte-incident-postmortem) 상태
  // ---------------------------------------------------------------------------
  const [timelineRows, setTimelineRows] = useState<TimelineRow[]>([
    {
      id: 'tl-1',
      time: '14:02 UTC',
      phase: '감지',
      actor: 'Datadog 모니터',
      event: '결제 승인 API 502 Bad Gateway 비율 4.8% 돌파 (임계치 0.5%) 경보 발령',
    },
    {
      id: 'tl-2',
      time: '14:07 UTC',
      phase: '완화',
      actor: '송민재 (On-call)',
      event: '신규 배포된 v2.19.4 커넥션 풀 누수 확인 후 직전 안정 버전(v2.19.3) 즉시 롤백 실행',
    },
    {
      id: 'tl-3',
      time: '14:14 UTC',
      phase: '복구',
      actor: 'SRE 자동화 봇',
      event: '전 리전 파드 헬스체크 100% 정상화 및 대기 큐에 적체된 1,420건 재처리 완료',
    },
  ]);

  const [newTimelineTime, setNewTimelineTime] = useState('14:25 UTC');
  const [newTimelineEvent, setNewTimelineEvent] = useState('');

  const [actionItems, setActionItems] = useState<ActionItemRow[]>([
    {
      id: 'ai-1',
      code: 'SRE-409',
      task: 'PgBouncer 최대 유휴 커넥션 타임아웃 30s 강제 회수 가드레일 적용',
      owner: '송민재',
      due: '2026-04-24',
      done: true,
    },
    {
      id: 'ai-2',
      code: 'SRE-412',
      task: 'CI 파이프라인에 10,000 TPS 부하 테스트 시 커넥션 누수 자동 차단 게이트 추가',
      owner: '한지훈',
      due: '2026-04-28',
      done: false,
    },
    {
      id: 'ai-3',
      code: 'SRE-415',
      task: '가맹점 웹훅 재시도 지수 백오프(Exponential Backoff) 지터 파라미터 튜닝',
      owner: '박수빈',
      due: '2026-05-02',
      done: false,
    },
  ]);

  const addTimelineEvent = () => {
    if (!newTimelineEvent.trim()) return;
    setTimelineRows((prev) => [
      ...prev,
      {
        id: `tl-${Date.now()}`,
        time: newTimelineTime || '14:30 UTC',
        phase: '검증',
        actor: '송민재 (On-call)',
        event: newTimelineEvent.trim(),
      },
    ]);
    setNewTimelineEvent('');
  };

  const toggleActionItem = (id: string) => {
    setActionItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a))
    );
  };

  // ---------------------------------------------------------------------------
  // 5. 이메일 템플릿 작성기 (rte-email-campaign) 상태
  // ---------------------------------------------------------------------------
  const [emailSubject, setEmailSubject] = useState(
    '[중요 안내] {{회사명}} 워크스페이스 엔터프라이즈 연간 계약 갱신 및 전용 노드 업그레이드 안내'
  );
  const [emailBody, setEmailBody] = useState(
    `안녕하세요, {{회사명}}의 {{담당자명}} 님.\n\n현재 이용 중인 {{플랜티어}} 구독의 정기 갱신일({{갱신일}})이 14일 앞으로 다가왔습니다.\n이번 갱신 주기에 맞춰 무중단 전용 KMS 암호화 모듈과 초당 50,000 요청 처리량 확장 옵션이 무료로 자동 적용될 예정입니다.`
  );
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [copiedHtml, setCopiedHtml] = useState(false);

  const sampleVars: Record<string, string> = {
    '{{회사명}}': '토스뱅크 코어플랫폼실',
    '{{담당자명}}': '정현우 리드',
    '{{갱신일}}': '2026년 5월 15일',
    '{{플랜티어}}': 'KLIC Enterprise Dedicated',
    '{{청구금액}}': '₩14,800,000 / 년',
  };

  const insertVariableToBody = (token: string) => {
    setEmailBody((prev) => `${prev} ${token}`);
  };

  const renderInterpolatedText = (raw: string) => {
    let result = raw;
    Object.entries(sampleVars).forEach(([k, v]) => {
      result = result.split(k).join(v);
    });
    return result;
  };

  const showSlash = activeTab === 'all-showcase' || activeTab === 'slash-doc';
  const showMarkdown = activeTab === 'all-showcase' || activeTab === 'markdown-spec';
  const showCollab = activeTab === 'all-showcase' || activeTab === 'collab-comment';
  const showPostmortem = activeTab === 'all-showcase' || activeTab === 'incident-postmortem';
  const showEmail = activeTab === 'all-showcase' || activeTab === 'email-campaign';

  return (
    <div className="space-y-8">
      {/* 상단 서브모드 스위처 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  rounded-[16px] p-1.5">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'all-showcase', label: '전체 5종 쇼케이스', icon: Sparkles },
            { id: 'slash-doc', label: '1. 슬래시 블록 에디터', icon: FileText },
            { id: 'markdown-spec', label: '2. 기술 마크다운 에디터', icon: Code2 },
            { id: 'collab-comment', label: '3. 공동 편집 에디터', icon: MessageSquare },
            { id: 'incident-postmortem', label: '4. 포스트모템 에디터', icon: AlertTriangle },
            { id: 'email-campaign', label: '5. 이메일 템플릿 작성기', icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as RichTextEditorMode)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[11px] text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white  text-zinc-900  shadow-xs border border-zinc-200/80 '
                    : 'text-klic-muted  hover:text-zinc-900 '
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <div className="px-2.5 py-1 text-[11px] font-mono text-klic-muted ">
          KLIC/rich-text-suite · 패턴 5종
        </div>
      </div>

      {/* =====================================================================
          1. 슬래시 블록 에디터 (rte-slash-document)
         ===================================================================== */}
      {showSlash && (
        <section className="bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  rounded-[20px] p-1.5 shadow-xs">
          <div className="bg-white  border border-zinc-200/70  rounded-[15px] overflow-hidden">
            {/* 상단 문서 메타 헤더 */}
            <div className="px-5 py-3.5 border-b border-zinc-200/80  flex flex-wrap items-center justify-between gap-3 bg-zinc-50/60 ">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded-md bg-klic-inverse  text-klic-on-emphasis  text-[10px] font-mono font-bold">
                  편집기 01
                </span>
                <span className="text-xs font-semibold text-zinc-900 ">
                  슬래시(/) 블록 문서 에디터
                </span>
                <span className="text-[11px] text-klic-muted font-mono">
                  · 워크스페이스 / 코어결제실 / 실행계획
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-blue-600  font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  실시간 블록 동기화됨 ({docBlocks.length}개 블록)
                </span>
                <button
                  onClick={() => setSlashMenuOpen((v) => !v)}
                  className="px-2.5 py-1 rounded-lg bg-klic-inverse  text-klic-on-emphasis  text-xs font-semibold hover:opacity-90 transition cursor-pointer inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>/ 블록 삽입 메뉴</span>
                </button>
              </div>
            </div>

            {/* 문서 본문 캔버스 */}
            <div className="p-6 max-w-4xl mx-auto space-y-4">
              {/* 문서 제목 */}
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full text-xl md:text-2xl font-bold tracking-tight text-zinc-900  bg-transparent border-b border-transparent focus:border-zinc-300  focus:outline-none pb-2"
              />

              {/* 블록 리스트 */}
              <div className="space-y-2.5">
                {docBlocks.map((block, idx) => (
                  <div
                    key={block.id}
                    className="group relative flex items-start gap-2.5 p-2.5 rounded-xl border border-transparent hover:border-zinc-200  hover:bg-zinc-50/70  transition"
                  >
                    {/* 좌측 블록 핸들 & 순서 제어 */}
                    <div className="flex items-center gap-0.5 pt-0.5 opacity-60 group-hover:opacity-100 transition shrink-0">
                      <GripVertical className="w-4 h-4 text-klic-muted" />
                      <button
                        onClick={() => moveBlock(idx, -1)}
                        disabled={idx === 0}
                        title="위로 이동"
                        className="p-0.5 text-klic-muted hover:text-zinc-800  disabled:opacity-25 cursor-pointer"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveBlock(idx, 1)}
                        disabled={idx === docBlocks.length - 1}
                        title="아래로 이동"
                        className="p-0.5 text-klic-muted hover:text-zinc-800  disabled:opacity-25 cursor-pointer"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    {/* 블록 타입별 렌더링 */}
                    <div className="flex-1 min-w-0">
                      {block.type === 'heading' && (
                        <h3 className="text-base font-bold text-zinc-900  tracking-tight">
                          {block.content}
                        </h3>
                      )}

                      {block.type === 'callout' && (
                        <div className="p-3.5 rounded-xl bg-amber-50/80  border border-amber-200/80  flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="text-[11px] font-mono font-bold text-amber-800  uppercase">
                              {block.meta || '아키텍처 가드레일'}
                            </div>
                            <p className="text-xs font-medium text-amber-950  leading-relaxed">
                              {block.content}
                            </p>
                          </div>
                        </div>
                      )}

                      {block.type === 'todo' && (
                        <button
                          onClick={() => toggleTodoBlock(block.id)}
                          className="flex items-center gap-2.5 text-left w-full cursor-pointer"
                        >
                          {block.checked ? (
                            <CheckSquare className="w-4 h-4 text-blue-600  shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-klic-muted shrink-0" />
                          )}
                          <span
                            className={`text-sm ${
                              block.checked
                                ? 'line-through text-klic-muted '
                                : 'text-zinc-800  font-medium'
                            }`}
                          >
                            {block.content}
                          </span>
                        </button>
                      )}

                      {block.type === 'code' && (
                        <div className="rounded-xl bg-zinc-50  text-zinc-800  p-3.5 font-mono text-xs overflow-x-auto border border-zinc-200/80 ">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200/80  text-[10px] text-klic-muted">
                            <span className="font-semibold text-blue-600 ">{block.meta || 'shell'}</span>
                            <span>UTF-8 · LF</span>
                          </div>
                          <pre className="leading-relaxed whitespace-pre-wrap">{block.content}</pre>
                        </div>
                      )}

                      {block.type === 'table' && (
                        <div className="border border-zinc-200  rounded-xl overflow-hidden text-xs">
                          <div className="grid grid-cols-3 bg-zinc-100  font-semibold text-zinc-700  px-3 py-2 border-b border-zinc-200 ">
                            <span>대상 리전</span>
                            <span>목표 처리량(TPS)</span>
                            <span>최대 허용 p99</span>
                          </div>
                          <div className="grid grid-cols-3 px-3 py-2 border-b border-zinc-100  font-mono">
                            <span>ap-northeast-2 (서울)</span>
                            <span>45,000 TPS</span>
                            <span className="text-blue-600">18.4 ms</span>
                          </div>
                          <div className="grid grid-cols-3 px-3 py-2 font-mono">
                            <span>ap-northeast-1 (도쿄)</span>
                            <span>20,000 TPS</span>
                            <span className="text-amber-600">34.0 ms</span>
                          </div>
                        </div>
                      )}

                      {block.type === 'paragraph' && (
                        <p className="text-sm text-zinc-700 ">{block.content}</p>
                      )}
                    </div>

                    {/* 우측 블록 삭제 액션 */}
                    <button
                      onClick={() => removeBlock(block.id)}
                      title="블록 삭제"
                      className="opacity-0 group-hover:opacity-100 p-1 text-klic-muted hover:text-blue-600 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* 슬래시(/) 명령어 팝오버 런처 */}
              <div className="pt-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-zinc-300  bg-zinc-50/50 ">
                  <span className="font-mono text-xs font-bold text-zinc-900  bg-zinc-200/80  px-1.5 py-0.5 rounded">
                    /
                  </span>
                  <input
                    type="text"
                    value={slashFilter}
                    onFocus={() => setSlashMenuOpen(true)}
                    onChange={(e) => {
                      setSlashFilter(e.target.value);
                      setSlashMenuOpen(true);
                    }}
                    placeholder="슬래시(/) 명령어로 블록 검색 또는 클릭하여 즉시 추가 (예: 할 일, 콜아웃, 코드, 표)..."
                    className="flex-1 text-xs bg-transparent focus:outline-none text-zinc-800 "
                  />
                </div>

                {slashMenuOpen && (
                  <div className="mt-2 p-2 rounded-2xl border border-zinc-200  bg-white  shadow-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                    {[
                      { type: 'heading' as const, title: '소제목 (H2)', desc: '섹션 구분 타이틀', shortcut: '/h2', icon: Bold },
                      { type: 'todo' as const, title: '할 일 체크리스트', desc: '실행 상태 토글 항목', shortcut: '/todo', icon: CheckSquare },
                      { type: 'callout' as const, title: '경고 콜아웃 박스', desc: 'SLA/보안 핵심 강조', shortcut: '/callout', icon: ShieldAlert },
                      { type: 'code' as const, title: '코드 & 쿼리 블록', desc: 'CLI 및 SQL 스니펫', shortcut: '/code', icon: Terminal },
                      { type: 'table' as const, title: '지표 비교 표', desc: '리전별 성능 매트릭스', shortcut: '/table', icon: Table },
                    ]
                      .filter(
                        (item) =>
                          !slashFilter ||
                          item.title.includes(slashFilter) ||
                          item.shortcut.includes(slashFilter)
                      )
                      .map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.type}
                            onClick={() => insertSlashBlock(item.type)}
                            className="flex flex-col items-start p-2.5 rounded-xl border border-zinc-200/70  hover:border-zinc-900  hover:bg-zinc-50  transition text-left cursor-pointer"
                          >
                            <div className="w-full flex items-center justify-between mb-1">
                              <Icon className="w-4 h-4 text-zinc-700 " />
                              <span className="text-[10px] font-mono text-klic-muted">{item.shortcut}</span>
                            </div>
                            <div className="text-xs font-bold text-zinc-900 ">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-klic-muted ">
                              {item.desc}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          2. 기술 마크다운 에디터 (rte-markdown-tech-spec)
         ===================================================================== */}
      {showMarkdown && (
        <section className="bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  rounded-[20px] p-1.5 shadow-xs">
          <div className="bg-white  border border-zinc-200/70  rounded-[15px] overflow-hidden">
            {/* 상단 엔지니어링 스펙 툴바 */}
            <div className="px-5 py-3.5 border-b border-zinc-200/80  flex flex-wrap items-center justify-between gap-3 bg-zinc-50/60 ">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded-md bg-klic-inverse  text-klic-on-emphasis  text-[10px] font-mono font-bold">
                  편집기 02
                </span>
                <span className="text-xs font-semibold text-zinc-900 ">
                  기술 마크다운 & RFC 아키텍처 에디터
                </span>
                {/* RFC 상태 전환 버튼 */}
                <div className="flex items-center gap-1 ml-2">
                  {(['DRAFT', 'IN REVIEW', 'APPROVED'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setRfcStatus(st)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition ${
                        rfcStatus === st
                          ? st === 'APPROVED'
                            ? 'bg-blue-600 text-klic-on-emphasis'
                            : st === 'IN REVIEW'
                            ? 'bg-amber-500 text-klic-on-emphasis'
                            : 'bg-klic-inverse text-klic-on-emphasis'
                          : 'bg-zinc-200/70  text-klic-muted'
                      }`}
                    >
                      {{ DRAFT: '초안', 'IN REVIEW': '검토 중', APPROVED: '승인됨' }[st]}
                    </button>
                  ))}
                </div>
              </div>

              {/* 뷰 모드 전환 */}
              <div className="flex items-center gap-1 bg-zinc-200/70  p-0.5 rounded-lg">
                {[
                  { id: 'split', label: '좌우 분할 프리뷰', icon: SplitSquareVertical },
                  { id: 'source', label: 'Markdown 원본', icon: Code2 },
                  { id: 'preview', label: '렌더링 문서', icon: Eye },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMdViewMode(m.id as 'split' | 'source' | 'preview')}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition ${
                        mdViewMode === m.id
                          ? 'bg-white  text-zinc-900  shadow-2xs'
                          : 'text-klic-muted '
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 본문 분할 그리드 */}
            <div
              className={`grid ${
                mdViewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 ' : 'grid-cols-1'
              }`}
            >
              {/* 좌측: 마크다운 소스 입력창 */}
              {(mdViewMode === 'split' || mdViewMode === 'source') && (
                <div className="p-5 bg-zinc-50/70  text-zinc-900  font-mono text-xs flex flex-col">
                  <div className="flex items-center justify-between text-[11px] text-klic-muted  pb-3 mb-3 border-b border-zinc-200/80 ">
                    <span>docs/rfc/042-zero-trust-jwks-rotation.md</span>
                    <span>{markdownSource.length} 자 · KaTeX + Mermaid 활성</span>
                  </div>
                  <textarea
                    value={markdownSource}
                    onChange={(e) => setMarkdownSource(e.target.value)}
                    rows={15}
                    className="w-full flex-1 bg-transparent text-zinc-800  font-mono text-xs leading-relaxed focus:outline-none resize-none"
                  />
                </div>
              )}

              {/* 우측: 실시간 렌더링 프리뷰 (수식 + 다이어그램 + 구문강조) */}
              {(mdViewMode === 'split' || mdViewMode === 'preview') && (
                <div className="p-6 space-y-4 bg-white ">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-klic-muted uppercase">
                      실시간 명세 미리보기
                    </span>
                    <span className="px-2 py-0.5 rounded bg-zinc-100  text-[11px] font-mono text-klic-muted ">
                      상태: {{ DRAFT: '초안', 'IN REVIEW': '검토 중', APPROVED: '승인됨' }[rfcStatus]}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900  tracking-tight">
                    RFC-042: 제로 트러스트 토큰 서명 키 무중단 회전 프로토콜
                  </h3>

                  <div className="pl-3 border-l-2 border-blue-500 text-xs text-klic-muted ">
                    작성자: 코어 보안팀 김태호 · 검토 기한: 2026-04-30 · 대상 버전:{' '}
                    <code className="px-1.5 py-0.5 rounded bg-zinc-100  font-mono text-zinc-900 ">
                      v4.8.0-rc2
                    </code>
                  </div>

                  {/* 아키텍처 다이어그램 블록 (Mermaid SVG 렌더링 프리뷰) */}
                  <div className="p-4 rounded-xl bg-zinc-50  border border-zinc-200/80 ">
                    <div className="text-[10px] font-mono text-klic-muted mb-2.5 flex items-center justify-between">
                      <span>Mermaid 아키텍처 다이어그램 · 키 3개 순환 상태</span>
                      <span className="text-blue-600 font-semibold">● SVG 검증 완료</span>
                    </div>
                    <svg viewBox="0 0 560 92" className="w-full h-20">
                      <rect x="8" y="18" width="145" height="54" rx="10" fill="var(--klic-component-block-color-soft)" stroke="var(--klic-component-block-color-accent)" strokeWidth="1.5" />
                      <text x="80" y="42" textAnchor="middle" fill="var(--klic-component-block-color-accent)" className="text-[11px] font-bold">
                        다음 키 (대기 중)
                      </text>
                      <text x="80" y="58" textAnchor="middle" fill="var(--klic-component-block-color-accent)" className="text-[9px] font-mono">
                        kid: ed25519-0501
                      </text>

                      <path d="M158 45 L202 45" stroke="currentColor" strokeWidth="1.5" className="text-klic-muted" strokeDasharray="3 3" />
                      <polygon points="202,41 210,45 202,49" className="fill-zinc-400" />

                      <rect x="212" y="18" width="150" height="54" rx="10" fill="var(--klic-component-block-color-soft)" stroke="var(--klic-component-block-color-accent)" strokeWidth="1.5" />
                      <text x="287" y="42" textAnchor="middle" fill="var(--klic-component-block-color-accent)" className="text-[11px] font-bold">
                        활성 키 (서명/검증)
                      </text>
                      <text x="287" y="58" textAnchor="middle" fill="var(--klic-component-block-color-accent)" className="text-[9px] font-mono">
                        kid: ed25519-0430
                      </text>

                      <path d="M366 45 L406 45" stroke="currentColor" strokeWidth="1.5" className="text-klic-muted" />
                      <polygon points="406,41 414,45 406,49" className="fill-zinc-400" />

                      <rect x="416" y="18" width="136" height="54" rx="10" className="fill-amber-500/15 stroke-amber-500" strokeWidth="1.5" />
                      <text x="484" y="42" textAnchor="middle" className="fill-amber-900  text-[11px] font-bold">
                        유예 키 (검증 전용)
                      </text>
                      <text x="484" y="58" textAnchor="middle" className="fill-amber-700  text-[9px] font-mono">
                        유효 시간: +60분
                      </text>
                    </svg>
                  </div>

                  {/* KaTeX 수식 블록 */}
                  <div className="p-3.5 rounded-xl bg-zinc-50  border border-zinc-200/70  flex items-center justify-between">
                    <div className="text-xs text-klic-muted">처리량 한계 수식 (KaTeX)</div>
                    <div className="font-mono text-xs font-bold text-zinc-900 ">
                      Q_max = (N_cores × 1000 / T_verify_ms) × η_cache = 142,800 req/s
                    </div>
                  </div>

                  {/* 구문 강조 JSON 코드 프리뷰 */}
                  <div className="rounded-xl bg-zinc-50  text-zinc-800  p-3.5 font-mono text-xs border border-zinc-200/80 ">
                    <div className="text-[10px] text-klic-muted  mb-1.5 font-bold">JSON · JWKS 키 모음 명세</div>
                    <pre className="text-blue-700  leading-relaxed overflow-x-auto">{`{
  "keyring_id": "kr-prod-seoul-01",
  "algorithm": "EdDSA-Ed25519",
  "rotation_interval_hours": 24,
  "grace_period_minutes": 60
}`}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          3. 공동 편집 에디터 (rte-collaborative-comment)
         ===================================================================== */}
      {showCollab && (
        <section className="bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  rounded-[20px] p-1.5 shadow-xs">
          <div className="bg-white  border border-zinc-200/70  rounded-[15px] overflow-hidden">
            {/* 상단 공동 편집자 프레즌스 바 */}
            <div className="px-5 py-3.5 border-b border-zinc-200/80  flex flex-wrap items-center justify-between gap-3 bg-zinc-50/60 ">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded-md bg-klic-inverse  text-klic-on-emphasis  text-[10px] font-mono font-bold">
                  편집기 03
                </span>
                <span className="text-xs font-semibold text-zinc-900 ">
                  실시간 공동 편집 & 인라인 변경 제안(Suggesting) 에디터
                </span>
              </div>

              {/* 동시 접속 커서 아바타 */}
              <div className="flex items-center gap-3">
                <div className="flex items-center -space-x-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-klic-on-emphasis text-[10px] font-bold ring-2 ring-white ">
                    박지민 (SecOps)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-klic-on-emphasis text-[10px] font-bold ring-2 ring-white ">
                    이서연 (아키텍트)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-klic-inverse  text-klic-on-emphasis  text-[10px] font-bold ring-2 ring-white ">
                    김도윤 (편집 중)
                  </span>
                </div>
              </div>
            </div>

            {/* 좌측 본문 + 우측 인라인 스레드 패널 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 ">
              {/* 좌측 문서 본문 (7칸) */}
              <div className="lg:col-span-7 p-6 space-y-4">
                <div className="text-xs font-mono text-klic-muted">
                  규정 문서 번호: SEC-POL-2026-09 · 전자금융 감사 로그 및 외부 연동 보안 지침
                </div>
                <h3 className="text-lg font-bold text-zinc-900 ">
                  제4조 (원본 감사 로그 보관 주기 및 파트너 게이트웨이 인증)
                </h3>

                <p className="text-sm text-zinc-700  leading-7">
                  1. 모든 프로덕션 결제 클러스터에서 발생하는 관리자 권한 상승 및 원장 조회 이벤트는 위변조 방지 스토리지에 기록되어야 하며, 스토리지 비용 최적화를 위해{' '}
                  <button
                    onClick={() => setActiveThreadId('th-1')}
                    className={`inline px-1.5 py-0.5 rounded transition cursor-pointer ${
                      activeThreadId === 'th-1'
                        ? 'bg-amber-200/80  ring-2 ring-amber-500'
                        : 'bg-amber-100/70 '
                    }`}
                  >
                    데이터 보존 주기를 기존{' '}
                    {threads[0].suggestionStatus === 'accepted' ? (
                      <span className="font-bold text-blue-700 ">
                        90일에서 365일(콜드 아카이브 포함)로 확장
                      </span>
                    ) : threads[0].suggestionStatus === 'rejected' ? (
                      <span className="font-semibold">90일에서 30일로 단축</span>
                    ) : (
                      <>
                        <span className="line-through text-blue-600  mr-1">
                          90일에서 30일로 단축
                        </span>
                        <span className="font-bold text-blue-700  underline">
                          90일에서 365일(콜드 아카이브 포함)로 확장
                        </span>
                      </>
                    )}
                  </button>
                  하여 운영한다.
                </p>

                <p className="text-sm text-zinc-700  leading-7">
                  2. 제휴 금융사 및 정산 대행사가 전용 게이트웨이를 호출할 때는{' '}
                  <button
                    onClick={() => setActiveThreadId('th-2')}
                    className={`inline px-1.5 py-0.5 rounded transition cursor-pointer ${
                      activeThreadId === 'th-2'
                        ? 'bg-blue-200/80  ring-2 ring-blue-500'
                        : 'bg-blue-100/70 '
                    }`}
                  >
                    외부 파트너사 API 호출 시 고정 IP 화이트리스트만 검증
                    <span className="ml-1 px-1 py-0.2 bg-blue-600 text-klic-on-emphasis text-[10px] font-mono rounded">
                      이서연 커서 위치
                    </span>
                  </button>{' '}
                  하며, 초당 호출 한도를 초과하는 경우 429 상태 코드를 반환한다.
                </p>
              </div>

              {/* 우측 스레드 & 변경 제안 승인 패널 (5칸) */}
              <div className="lg:col-span-5 p-5 bg-zinc-50/50  space-y-3">
                <div className="text-xs font-bold text-zinc-900  flex items-center justify-between">
                  <span>인라인 코멘트 & 변경 제안 ({threads.length})</span>
                  <span className="text-[11px] font-mono text-klic-muted">@멘션 알림 활성</span>
                </div>

                {threads.map((th) => {
                  const isSelected = activeThreadId === th.id;
                  return (
                    <div
                      key={th.id}
                      onClick={() => setActiveThreadId(th.id)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2.5 ${
                        isSelected
                          ? 'bg-white  border-zinc-900  shadow-xs'
                          : 'bg-white/70  border-zinc-200 '
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-900 ">
                            {th.author}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100  text-klic-muted ">
                            {th.role}
                          </span>
                        </div>
                        <span className="text-[11px] text-klic-muted">{th.time}</span>
                      </div>

                      {/* 변경 제안(Diff) 카드 */}
                      {th.isSuggestion && (
                        <div className="p-2.5 rounded-lg bg-zinc-50  border border-zinc-200/80  text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-klic-muted">
                              변경 제안
                            </span>
                            <span className="text-[10px] font-mono font-bold uppercase text-amber-600">
                              {th.suggestionStatus === 'pending'
                                ? '검토 대기'
                                : th.suggestionStatus === 'accepted'
                                ? '승인 반영됨'
                                : '거절됨'}
                            </span>
                          </div>
                          <div className="line-through text-blue-600 ">
                            - {th.originalText}
                          </div>
                          <div className="font-semibold text-blue-700 ">
                            + {th.suggestedText}
                          </div>

                          {th.suggestionStatus === 'pending' && (
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSuggestionAction(th.id, 'accepted');
                                }}
                                className="flex-1 py-1 px-2 rounded-md bg-blue-600 text-klic-on-emphasis text-xs font-semibold hover:bg-blue-500 transition inline-flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" /> 제안 승인
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSuggestionAction(th.id, 'rejected');
                                }}
                                className="flex-1 py-1 px-2 rounded-md bg-zinc-200  text-zinc-700  text-xs font-semibold hover:bg-zinc-300 transition inline-flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" /> 거절
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-zinc-700  leading-relaxed">
                        {th.body}
                      </p>

                      {/* 대댓글 목록 */}
                      {th.replies.length > 0 && (
                        <div className="pl-3 border-l-2 border-zinc-200  space-y-1.5 pt-1">
                          {th.replies.map((rep, rIdx) => (
                            <div key={rIdx} className="text-xs">
                              <span className="font-bold text-zinc-900 ">
                                {rep.author}
                              </span>{' '}
                              <span className="text-[10px] text-klic-muted">{rep.time}</span>
                              <p className="text-klic-muted  mt-0.5">{rep.text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 선택된 스레드에 답글 달기 */}
                      {isSelected && (
                        <div className="flex items-center gap-1.5 pt-1">
                          <input
                            type="text"
                            value={replyDraft}
                            onChange={(e) => setReplyDraft(e.target.value)}
                            placeholder="@멘션으로 동료 호출 및 답글 입력..."
                            className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200  bg-zinc-50  focus:outline-none"
                          />
                          <button
                            onClick={() => handleAddReply(th.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-klic-inverse  text-klic-on-emphasis  text-xs font-semibold cursor-pointer inline-flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" /> 등록
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          4. 포스트모템 에디터 (rte-incident-postmortem)
         ===================================================================== */}
      {showPostmortem && (
        <section className="bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  rounded-[20px] p-1.5 shadow-xs">
          <div className="bg-white  border border-zinc-200/70  rounded-[15px] overflow-hidden">
            {/* 헤더 */}
            <div className="px-5 py-3.5 border-b border-zinc-200/80  flex flex-wrap items-center justify-between gap-3 bg-zinc-50/60 ">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded-md bg-blue-600 text-klic-on-emphasis text-[10px] font-mono font-bold">
                  심각도 1 장애 회고
                </span>
                <span className="text-xs font-semibold text-zinc-900 ">
                  INC-2026-0419 결제 승인 커넥션 풀 고갈 장애 사후 분석 보고서
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-klic-muted">총 장애 시간: <strong className="text-blue-600">12분</strong></span>
                <span className="text-klic-muted">영향 트랜잭션: <strong className="text-zinc-900 ">1,420건 (전량 복구)</strong></span>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 좌측: 장애 타임라인 + 5 Whys (7칸) */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <h4 className="text-xs font-mono font-bold text-klic-muted uppercase mb-2.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> 1. 분 단위 장애 타임라인
                  </h4>
                  <div className="border border-zinc-200  rounded-xl overflow-hidden">
                    {timelineRows.map((row) => (
                      <div
                        key={row.id}
                        className="px-3.5 py-2.5 border-b last:border-b-0 border-zinc-200/70  flex items-start gap-3 text-xs"
                      >
                        <span className="font-mono font-bold text-zinc-900  shrink-0 w-20">
                          {row.time}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                            row.phase === '감지'
                              ? 'bg-blue-100 text-blue-700  '
                              : row.phase === '완화'
                              ? 'bg-amber-100 text-amber-800  '
                              : 'bg-blue-100 text-blue-700  '
                          }`}
                        >
                          {row.phase}
                        </span>
                        <div className="flex-1 text-zinc-700 ">
                          <span className="font-semibold text-zinc-900  mr-1.5">
                            [{row.actor}]
                          </span>
                          {row.event}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 타임라인 행 추가 입력 */}
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={newTimelineTime}
                      onChange={(e) => setNewTimelineTime(e.target.value)}
                      className="w-24 px-2.5 py-1.5 rounded-lg border border-zinc-200  text-xs font-mono bg-zinc-50 "
                    />
                    <input
                      type="text"
                      value={newTimelineEvent}
                      onChange={(e) => setNewTimelineEvent(e.target.value)}
                      placeholder="추가 타임라인 로그 입력 (예: 가맹점 손실 보전 정산 검증 완료)..."
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-zinc-200  text-xs bg-zinc-50 "
                    />
                    <button
                      onClick={addTimelineEvent}
                      className="px-3 py-1.5 rounded-lg bg-klic-inverse  text-klic-on-emphasis  text-xs font-semibold cursor-pointer"
                    >
                      + 기록 추가
                    </button>
                  </div>
                </div>

                {/* 5 Whys 근본 원인 분석 */}
                <div className="p-4 rounded-xl bg-zinc-50  border border-zinc-200/80  space-y-2">
                  <div className="text-xs font-mono font-bold text-klic-muted uppercase">
                    2. 다섯 번의 질문으로 근본 원인 분석
                  </div>
                  <div className="text-xs text-zinc-700  space-y-1.5 leading-relaxed">
                    <div>
                      <strong className="text-zinc-900 ">원인 1:</strong> 왜 승인 API가 502를 반환했는가? → DB 커넥션 풀(Max 500)이 100% 고갈됨.
                    </div>
                    <div>
                      <strong className="text-zinc-900 ">원인 2:</strong> 왜 커넥션이 반환되지 않았는가? → 외부 VAN사 응답 지연 시 트랜잭션 컨텍스트 취소가 누락됨.
                    </div>
                    <div>
                      <strong className="text-zinc-900 ">원인 3 (근본 원인):</strong> 스테이징 부하 테스트에서 외부 VAN사 지연 주입(Chaos Injection) 시나리오가 빠져 있었음.
                    </div>
                  </div>
                </div>
              </div>

              {/* 우측: 재발 방지 액션 아이템 (5칸) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-klic-muted uppercase flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" /> 3. 재발 방지 조치
                  </h4>
                  <span className="text-xs font-mono font-bold text-blue-600">
                    {actionItems.filter((a) => a.done).length}/{actionItems.length} 완료
                  </span>
                </div>

                <div className="space-y-2">
                  {actionItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleActionItem(item.id)}
                      className="p-3.5 rounded-xl border border-zinc-200  hover:border-zinc-400 transition cursor-pointer bg-white  space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-zinc-100  font-mono text-[10px] font-bold text-zinc-700 ">
                          {item.code}
                        </span>
                        <span className="text-[11px] font-mono text-klic-muted">
                          담당: <strong className="text-zinc-800 ">{item.owner}</strong> · 기한 {item.due}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        {item.done ? (
                          <CheckSquare className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-klic-muted shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`text-xs leading-relaxed ${
                            item.done
                              ? 'line-through text-klic-muted'
                              : 'text-zinc-800  font-medium'
                          }`}
                        >
                          {item.task}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          5. 이메일 템플릿 작성기 (rte-email-campaign)
         ===================================================================== */}
      {showEmail && (
        <section className="bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  rounded-[20px] p-1.5 shadow-xs">
          <div className="bg-white  border border-zinc-200/70  rounded-[15px] overflow-hidden">
            {/* 상단 툴바 */}
            <div className="px-5 py-3.5 border-b border-zinc-200/80  flex flex-wrap items-center justify-between gap-3 bg-zinc-50/60 ">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded-md bg-klic-inverse  text-klic-on-emphasis  text-[10px] font-mono font-bold">
                  편집기 05
                </span>
                <span className="text-xs font-semibold text-zinc-900 ">
                  엔터프라이즈 고객 통지 이메일 템플릿 작성기 (동적 변수 치환)
                </span>
              </div>

              {/* 수신 화면 디바이스 & 다크모드 프리뷰 토글 */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-zinc-200/70  p-0.5 rounded-lg">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-2 py-1 rounded-md text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${
                      previewDevice === 'desktop'
                        ? 'bg-white  text-zinc-900  shadow-2xs'
                        : 'text-klic-muted'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" /> 데스크톱
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-2 py-1 rounded-md text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${
                      previewDevice === 'mobile'
                        ? 'bg-white  text-zinc-900  shadow-2xs'
                        : 'text-klic-muted'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" /> 모바일(375px)
                  </button>
                </div>

                <button
                  onClick={() => setPreviewTheme((t) => (t === 'light' ? 'dark' : 'light'))}
                  className="px-2.5 py-1 rounded-lg border border-zinc-200  text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  {previewTheme === 'light' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-500" /> 라이트 수신함
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-blue-400" /> 다크 수신함
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 ">
              {/* 좌측: 템플릿 에디터 + 동적 변수 칩 바 (6칸) */}
              <div className="lg:col-span-6 p-6 space-y-4">
                {/* 플로팅 서식 툴바 + 변수 칩 삽입 바 */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-200 ">
                  <div className="flex items-center gap-1">
                    {[Bold, Italic, Underline, Strikethrough, Link2, List, ListOrdered, Quote].map(
                      (Icon, i) => (
                        <button
                          key={i}
                          className="p-1.5 rounded-lg hover:bg-zinc-100  text-klic-muted  cursor-pointer"
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </button>
                      )
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setCopiedHtml(true);
                      setTimeout(() => setCopiedHtml(false), 1800);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-zinc-100  text-xs font-mono font-semibold text-zinc-700  inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedHtml ? 'MJML/HTML 복사됨!' : 'HTML 내보내기'}
                  </button>
                </div>

                {/* 클릭하여 삽입 가능한 동적 변수 칩 */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono text-klic-muted">
                    동적 변수 칩 클릭 시 본문 끝에 즉시 삽입됩니다:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(sampleVars).map(([token, sample]) => (
                      <button
                        key={token}
                        onClick={() => insertVariableToBody(token)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-100  border border-zinc-200  hover:border-zinc-900  text-xs font-mono transition cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <span className="font-bold text-zinc-900 ">{token}</span>
                        <span className="text-[10px] text-klic-muted">→ {sample}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 제목 입력 */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-semibold text-klic-muted">
                    이메일 제목
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200  text-xs font-semibold bg-zinc-50/60  focus:outline-none"
                  />
                </div>

                {/* 본문 리치 텍스트 영역 */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-semibold text-klic-muted">
                    본문 템플릿
                  </label>
                  <textarea
                    rows={7}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full p-3 rounded-xl border border-zinc-200  text-xs leading-relaxed bg-zinc-50/60  focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* 우측: 실시간 수신 화면 미리보기 (6칸) */}
              <div className="lg:col-span-6 p-6 bg-zinc-100/70  flex flex-col items-center justify-center">
                <div
                  className={`w-full transition-all rounded-2xl border shadow-sm overflow-hidden ${
                    previewDevice === 'mobile' ? 'max-w-[360px]' : 'max-w-full'
                  } ${
                    previewTheme === 'dark'
                      ? 'bg-klic-inverse border-zinc-800 text-klic-on-emphasis'
                      : 'bg-white border-zinc-200 text-zinc-900'
                  }`}
                >
                  {/* 메일 헤더 */}
                  <div
                    className={`px-5 py-3.5 border-b ${
                      previewTheme === 'dark' ? 'border-zinc-800 bg-klic-inverse/60' : 'border-zinc-100 bg-zinc-50/70'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-blue-600 font-bold mb-1">
                      ● 수신자 화면 실시간 미리보기 ({{ desktop: '데스크톱', mobile: '모바일' }[previewDevice]} · {{ light: '밝은 테마', dark: '어두운 테마' }[previewTheme]})
                    </div>
                    <div className="text-sm font-bold leading-snug">
                      {renderInterpolatedText(emailSubject)}
                    </div>
                    <div className="text-[11px] text-klic-muted mt-1 font-mono">
                      보낸 사람: billing@flux-enterprise.io · 받는 사람: hyunwoo.jung@tossbank.com
                    </div>
                  </div>

                  {/* 메일 바디 */}
                  <div className="p-5 space-y-4 text-xs leading-relaxed">
                    <p className="whitespace-pre-line">{renderInterpolatedText(emailBody)}</p>

                    <div
                      className={`p-3.5 rounded-xl border font-mono text-[11px] flex items-center justify-between ${
                        previewTheme === 'dark'
                          ? 'bg-klic-inverse border-zinc-800 text-klic-muted'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                      }`}
                    >
                      <span>예상 연간 갱신 청구액</span>
                      <strong className="text-sm">{sampleVars['{{청구금액}}']}</strong>
                    </div>

                    <div className="pt-1">
                      <span className="inline-block px-4 py-2 rounded-xl bg-klic-inverse  text-klic-on-emphasis  text-xs font-bold">
                        계약 갱신 명세서 확인 및 승인하기 →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
