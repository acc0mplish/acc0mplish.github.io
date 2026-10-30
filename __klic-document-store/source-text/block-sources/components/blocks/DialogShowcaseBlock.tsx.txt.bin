import { PersonAvatar } from '../PersonAvatar';
import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Plus,
  Check,
  AlertTriangle,
  ShieldAlert,
  Copy,
  Link2,
  Lock,
  Globe,
  KeyRound,
  UploadCloud,
  FileSpreadsheet,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Users,
  ChevronDown,
} from 'lucide-react';

export type DialogShowcaseMode =
  | 'workspace-app'
  | 'destructive-confirm'
  | 'share-permissions'
  | 'api-token'
  | 'csv-import';

interface DialogShowcaseBlockProps {
  initialMode?: DialogShowcaseMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

interface WorkspaceAppItem {
  id: string;
  name: string;
  description: string;
  category: string;
  renderLogo: () => React.ReactNode;
}

const WORKSPACE_APPS: WorkspaceAppItem[] = [
  {
    id: 'claude',
    name: '클로드',
    description: '모델 사용량 및 토큰 추적',
    category: '인공지능',
    renderLogo: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <g stroke="var(--klic-component-block-color-warning)" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="3.5" x2="12" y2="20.5" />
          <line x1="3.5" y1="12" x2="20.5" y2="12" />
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="8.5" y1="4.2" x2="15.5" y2="19.8" />
          <line x1="19.8" y1="8.5" x2="4.2" y2="15.5" />
        </g>
      </svg>
    ),
  },
  {
    id: 'openai',
    name: '오픈AI',
    description: '리서치 및 모델 실행 기록',
    category: '인공지능',
    renderLogo: () => (
      <svg className="w-6 h-6 text-zinc-900 " viewBox="0 0 24 24" fill="none">
        <path
          d="M12 4.2C9.4 4.2 7.3 6.3 7.3 8.9C7.3 10.1 7.8 11.2 8.6 12M12 4.2C14.6 4.2 16.7 6.3 16.7 8.9C16.7 10.1 16.2 11.2 15.4 12M12 4.2V8.9M19.8 12C19.8 9.4 17.7 7.3 15.1 7.3M19.8 12C19.8 14.6 17.7 16.7 15.1 16.7C13.9 16.7 12.8 16.2 12 15.4M19.8 12H15.1M12 19.8C14.6 19.8 16.7 17.7 16.7 15.1M12 19.8C9.4 19.8 7.3 17.7 7.3 15.1C7.3 13.9 7.8 12.8 8.6 12M12 19.8V15.1M4.2 12C4.2 14.6 6.3 16.7 8.9 16.7M4.2 12C4.2 9.4 6.3 7.3 8.9 7.3C10.1 7.3 11.2 7.8 12 8.6M4.2 12H8.9"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'cursor',
    name: '커서',
    description: '코딩 액티비티 실시간 동기화',
    category: '개발 도구',
    renderLogo: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2.8L20 7.4V16.6L12 21.2L4 16.6V7.4L12 2.8Z"
          fill="var(--klic-component-block-color-text)"
        />
        <path
          d="M12 2.8L20 7.4L12 12L4 7.4L12 2.8Z"
          fill="var(--klic-component-block-color-text)"
        />
        <path
          d="M12 12L20 7.4V16.6L12 21.2V12Z"
          fill="var(--klic-component-block-color-border)"
        />
      </svg>
    ),
  },
  {
    id: 'gcal',
    name: '구글 캘린더',
    description: '플래닝 일정 홀드 미러링',
    category: '일정 관리',
    renderLogo: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" fill="var(--runtime-emphasis-ink)" stroke="var(--klic-component-block-color-border)" />
        <path d="M3.5 7C3.5 5.1 5.1 3.5 7 3.5H17C18.9 3.5 20.5 5.1 20.5 7V8.5H3.5V7Z" fill="var(--klic-component-block-color-accent)" />
        <path d="M3.5 16.5H8.5V20.5H7C5.1 20.5 3.5 18.9 3.5 17V16.5Z" fill="var(--klic-component-block-color-accent)" />
        <path d="M15.5 16.5H20.5V17C20.5 18.9 18.9 20.5 17 20.5H15.5V16.5Z" fill="var(--klic-component-block-color-danger)" />
        <rect x="8.5" y="16.5" width="7" height="4" fill="var(--klic-component-block-color-warning)" />
        <text
          x="12"
          y="14.5"
          textAnchor="middle"
          fill="var(--klic-component-block-color-accent)"
          fontSize="7.5"
          fontWeight="700"
        >
          31
        </text>
      </svg>
    ),
  },
  {
    id: 'slack',
    name: '슬랙',
    description: '팀 채널 활동 모니터링',
    category: '메신저',
    renderLogo: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="13" y="3.5" width="3.2" height="7.5" rx="1.6" fill="var(--klic-component-block-color-accent)" />
        <circle cx="18.2" cy="9.4" r="1.6" fill="var(--klic-component-block-color-accent)" />
        <rect x="13" y="13" width="7.5" height="3.2" rx="1.6" fill="var(--klic-component-block-color-warning)" />
        <circle cx="14.6" cy="18.2" r="1.6" fill="var(--klic-component-block-color-warning)" />
        <rect x="7.8" y="13" width="3.2" height="7.5" rx="1.6" fill="var(--klic-component-block-color-accent)" />
        <circle cx="5.8" cy="14.6" r="1.6" fill="var(--klic-component-block-color-accent)" />
        <rect x="3.5" y="7.8" width="7.5" height="3.2" rx="1.6" fill="var(--klic-component-block-color-accent)" />
        <circle cx="9.4" cy="5.8" r="1.6" fill="var(--klic-component-block-color-accent)" />
      </svg>
    ),
  },
  {
    id: 'stripe',
    name: '스트라이프',
    description: '매출 및 결제 시그널 추적',
    category: '결제 인프라',
    renderLogo: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 6.8L19 4V17.2L5 20V6.8Z"
          fill="var(--klic-component-block-color-accent)"
        />
      </svg>
    ),
  },
  {
    id: 'zoom',
    name: '줌',
    description: '화상 미팅 세션 로그 기록',
    category: '화상회의',
    renderLogo: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9.5" fill="var(--klic-component-block-color-accent)" />
        <path
          d="M8.5 8.8H15.5L8.5 15.2H15.5"
          stroke="var(--runtime-emphasis-ink)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'loom',
    name: '룸',
    description: '비동기 워크스루 영상 보관',
    category: '화상회의',
    renderLogo: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <g stroke="var(--klic-component-block-color-accent)" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="3" x2="12" y2="21" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" />
          <line x1="18.4" y1="5.6" x2="5.6" y2="18.4" />
        </g>
        <circle cx="12" cy="12" r="2.8" fill="var(--runtime-emphasis-ink)" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    name: '인스타그램',
    description: '캠페인 참여 지표 추적',
    category: '마케팅',
    renderLogo: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--klic-component-block-color-warning)" />
            <stop offset="50%" stopColor="var(--klic-component-block-color-accent)" />
            <stop offset="100%" stopColor="var(--klic-component-block-color-accent)" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="url(#igGrad)" />
        <rect x="6.5" y="6.5" width="11" height="11" rx="3.2" stroke="var(--runtime-emphasis-ink)" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="2.6" stroke="var(--runtime-emphasis-ink)" strokeWidth="1.7" />
        <circle cx="15.2" cy="8.8" r="0.9" fill="var(--runtime-emphasis-ink)" />
      </svg>
    ),
  },
  {
    id: 'discord',
    name: '디스코드',
    description: '커뮤니티 활동 실시간 감지',
    category: '메신저',
    renderLogo: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="7" fill="var(--klic-component-block-color-accent)" />
        <circle cx="9.3" cy="12" r="1.5" fill="var(--runtime-emphasis-ink)" />
        <circle cx="14.7" cy="12" r="1.5" fill="var(--runtime-emphasis-ink)" />
      </svg>
    ),
  },
  {
    id: 'gmeet',
    name: '구글 미트',
    description: '콜 및 화상회의 활동 캡처',
    category: '화상회의',
    renderLogo: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M4 7.5C4 6.4 4.9 5.5 6 5.5H13.5V12L4 12V7.5Z" fill="var(--klic-component-block-color-danger)" />
        <path d="M4 12H13.5V18.5H6C4.9 18.5 4 17.6 4 16.5V12Z" fill="var(--klic-component-block-color-accent)" />
        <path d="M13.5 5.5H16C17.1 5.5 18 6.4 18 7.5V12H13.5V5.5Z" fill="var(--klic-component-block-color-warning)" />
        <path d="M13.5 12H18V16.5C18 17.6 17.1 18.5 16 18.5H13.5V12Z" fill="var(--klic-component-block-color-accent)" />
        <path
          d="M18 9.8L21.2 7.2C21.6 6.9 22.2 7.2 22.2 7.7V16.3C22.2 16.8 21.6 17.1 21.2 16.8L18 14.2V9.8Z"
          fill="var(--klic-component-block-color-accent)"
        />
      </svg>
    ),
  },
  {
    id: 'paypal',
    name: '페이팔',
    description: '정산 및 지급 이벤트 모니터링',
    category: '결제 인프라',
    renderLogo: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path
          d="M7.5 19H5L7 5H13.2C15.8 5 17.2 6.3 16.8 8.8C16.4 11.4 14.5 12.8 11.8 12.8H8.6L7.5 19Z"
          fill="var(--klic-component-block-color-accent)"
        />
        <path
          d="M10 21H7.6L9.2 9.5H14.5C16.8 9.5 18 10.6 17.6 12.8C17.2 15.1 15.5 16.3 13.1 16.3H10.8L10 21Z"
          fill="var(--klic-component-block-color-accent)"
          fillOpacity="0.85"
        />
      </svg>
    ),
  },
];

export function DialogShowcaseBlock({
  initialMode = 'workspace-app',
  density = 'normal',
}: DialogShowcaseBlockProps) {
  const [activeMode, setActiveMode] = useState<DialogShowcaseMode>(initialMode);

  // 스타일 1 상태: 워크스페이스 앱 추가 모달
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [connectedSuccess, setConnectedSuccess] = useState(false);

  // 스타일 2 상태: 리소스 영구 삭제 확인 모달
  const [confirmInput, setConfirmInput] = useState('');
  const [isDeletedDone, setIsDeletedDone] = useState(false);

  // 스타일 3 상태: 문서 공유 & 권한 모달
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'편집 가능' | '댓글 가능' | '보기 전용'>('편집 가능');
  const [copiedLink, setCopiedLink] = useState(false);
  const [sharedMembers, setSharedMembers] = useState([
    {
      id: 'm1',
      name: '김지훈 수석 프로덕트 매니저',
      email: 'jihun.kim@flux.kr',
      role: '소유자',
      avatar:
        './placeholders/avatar-576a55580552.svg',
    },
    {
      id: 'm2',
      name: '이서연 리드 디자이너',
      email: 'seoyeon.lee@flux.kr',
      role: '편집 가능',
      avatar:
        './placeholders/avatar-ef94a3ac14b1.svg',
    },
    {
      id: 'm3',
      name: '박현우 데이터 엔지니어',
      email: 'hyunwoo.park@flux.kr',
      role: '보기 전용',
      avatar:
        './placeholders/avatar-d36430bc2634.svg',
    },
  ]);

  // 스타일 4 상태: 신규 API 액세스 토큰 발급 모달
  const [tokenName, setTokenName] = useState('프로덕션 결제 원장 동기화 키');
  const [tokenExpiry, setTokenExpiry] = useState('90일');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    '원장 읽기',
    '웹훅 발송',
  ]);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  // 스타일 5 상태: 대용량 CSV 임포트 모달
  const [mappedColumns, setMappedColumns] = useState([
    { id: 'c1', source: '고객_식별번호', target: 'customer_uid', sample: 'CUS-99281', valid: true },
    { id: 'c2', source: '법인_이메일', target: 'billing_email', sample: 'finance@fintech.kr', valid: true },
    { id: 'c3', source: '월간_약정금액', target: 'mrr_amount_krw', sample: '₩4,800,000', valid: true },
    { id: 'c4', source: '갱신_예정일', target: 'renewal_date', sample: '2026-11-30', valid: true },
  ]);
  const [importCompleted, setImportCompleted] = useState(false);

  React.useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  const filteredApps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return WORKSPACE_APPS;
    return WORKSPACE_APPS.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const toggleSelectApp = (id: string) => {
    setConnectedSuccess(false);
    setSelectedAppIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 1. 워크스페이스 앱 추가 다이얼로그 (첨부 레퍼런스 완벽 재현)
  const renderWorkspaceAppDialog = () => (
    <div data-klic-surface="overlay" className="klic-dialog-example w-full max-w-[660px] mx-auto rounded-[24px] bg-white  border border-zinc-200/90  shadow-[0_14px_40px_color-mix(in_srgb,var(--klic-component-block-color-text)_6%,transparent)] overflow-hidden">
      {/* 상단 헤더 */}
      <div className="px-7 pt-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-semibold text-zinc-900  tracking-tight">
              워크스페이스 앱 추가
            </h2>
            <p className="text-[13.5px] text-klic-muted  mt-1">
              연결할 데이터 소스를 선택하세요.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedAppIds([]);
              setSearchQuery('');
              setConnectedSuccess(false);
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-klic-muted hover:text-zinc-900  hover:bg-zinc-100  transition-colors"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 검색 입력창 + ⌘K 배지 */}
        <div className="mt-4 relative flex items-center w-full rounded-xl border border-zinc-200/90  bg-white  px-3.5 py-2.5 shadow-2xs focus-within:border-zinc-400  transition-colors">
          <Search className="w-4 h-4 text-klic-muted mr-2.5 shrink-0" />
          <input data-klic-surface="field"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="연동 서비스 검색"
            className="w-full bg-transparent text-[13.5px] text-zinc-900  placeholder:text-klic-muted outline-none"
          />
          <span className="px-1.5 py-0.5 rounded-md bg-zinc-100  border border-zinc-200/80  text-[11px] font-medium text-klic-muted  shrink-0">
            ⌘K
          </span>
        </div>
      </div>

      {/* 3x4 앱 카드 그리드 */}
      <div className="px-7 py-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredApps.map((app) => {
          const isSelected = selectedAppIds.includes(app.id);
          return (
            <button
              key={app.id}
              type="button"
              onClick={() => toggleSelectApp(app.id)}
              className={`rounded-[16px] border p-4 text-left transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-zinc-900  bg-zinc-50/70  ring-1 ring-zinc-900/10'
                  : 'border-zinc-200/85  bg-white  hover:border-zinc-300 '
              }`}
            >
              {/* 상단: 로고 + 우측 원형 라디오 인디케이터 */}
              <div className="flex items-center justify-between w-full">
                <div className="w-6 h-6 flex items-center justify-center">
                  {app.renderLogo()}
                </div>
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-zinc-900  bg-klic-inverse  text-klic-on-emphasis '
                      : 'border-zinc-200  bg-white '
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                </span>
              </div>

              {/* 하단: 앱 이름 + 설명 */}
              <div className="mt-3.5">
                <div className="text-[14px] font-semibold text-zinc-900  tracking-tight">
                  {app.name}
                </div>
                <p className="text-[12px] text-klic-muted  mt-0.5 truncate">
                  {app.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 하단 푸터 액션 바 */}
      <div className="mt-4 px-7 py-4 border-t border-zinc-100  bg-white ">
        <button
          type="button"
          onClick={() => {
            if (selectedAppIds.length > 0) {
              setConnectedSuccess(true);
            }
          }}
          className={`w-full py-2.5 rounded-xl font-medium text-[13.5px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            connectedSuccess
              ? 'bg-blue-600 text-klic-on-emphasis'
              : selectedAppIds.length > 0
              ? 'bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis shadow-xs'
              : 'bg-[var(--klic-component-block-color-muted)] hover:bg-zinc-600 text-klic-on-emphasis'
          }`}
        >
          {connectedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>{selectedAppIds.length}개 워크스페이스 앱 연결 완료</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>
                {selectedAppIds.length > 0
                  ? `${selectedAppIds.length}개 앱 추가하기`
                  : '앱 추가하기'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  // 2. 리소스 영구 삭제 확인 다이얼로그 (KLIC/dialog-2)
  const renderDestructiveConfirmDialog = () => {
    const targetClusterName = 'flux-prod-cluster-seoul';
    const isMatched = confirmInput.trim() === targetClusterName;
    return (
      <div data-klic-surface="overlay" className="klic-dialog-example w-full max-w-[500px] mx-auto rounded-[24px] bg-white  border border-zinc-200/90  shadow-[0_14px_40px_color-mix(in_srgb,var(--klic-component-block-color-text)_6%,transparent)] overflow-hidden">
        {/* 상단 위험 경고 배너 */}
        <div className="px-6 pt-6 pb-4 bg-blue-50/60  border-b border-blue-100  flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100  border border-blue-200  text-blue-600  flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[16.5px] font-semibold text-zinc-900  tracking-tight">
                프로덕션 데이터베이스 영구 삭제
              </h2>
              <p className="text-[12.5px] text-blue-600  font-medium mt-0.5">
                이 작업은 되돌릴 수 없으며 모든 스냅샷이 즉시 파기됩니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmInput('');
              setIsDeletedDone(false);
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-klic-muted hover:text-zinc-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 삭제 영향도 요약 */}
        <div className="p-6 space-y-4">
          <div className="rounded-xl bg-zinc-50  border border-zinc-200/80  p-3.5 space-y-2 text-[12.5px]">
            <div className="flex items-center justify-between">
              <span className="text-klic-muted">대상 클러스터 식별자</span>
              <span className="font-mono font-semibold text-zinc-900 ">
                {targetClusterName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-klic-muted">연결된 읽기 전용 복제본</span>
              <span className="font-medium text-zinc-800 ">
                서울 · 도쿄 리전 4개 노드
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-klic-muted">영구 삭제될 백업 볼륨</span>
              <span className="font-semibold text-blue-600 ">
                1.42 TB (자동 백업 18건)
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-zinc-700 ">
              삭제를 승인하려면 아래에{' '}
              <button
                type="button"
                onClick={() => setConfirmInput(targetClusterName)}
                className="font-mono font-semibold text-zinc-900  underline decoration-zinc-300 hover:decoration-zinc-900"
                title="클릭하여 자동 입력"
              >
                {targetClusterName}
              </button>
              을(를) 입력하세요.
            </label>
            <input data-klic-surface="field"
              type="text"
              value={confirmInput}
              onChange={(e) => {
                setConfirmInput(e.target.value);
                setIsDeletedDone(false);
              }}
              placeholder={targetClusterName}
              className="mt-2 w-full rounded-xl border border-zinc-200  bg-white  px-3.5 py-2.5 text-[13px] font-mono text-zinc-900  outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* 하단 버튼 바 */}
        <div className="px-6 py-4 bg-zinc-50/70  border-t border-zinc-100  flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => {
              setConfirmInput('');
              setIsDeletedDone(false);
            }}
            className="px-4 py-2 rounded-xl border border-zinc-200  bg-white  text-[13px] font-medium text-zinc-700  hover:bg-zinc-50"
          >
            취소
          </button>
          <button
            type="button"
            disabled={!isMatched}
            onClick={() => setIsDeletedDone(true)}
            className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all ${
              isDeletedDone
                ? 'bg-klic-inverse text-klic-on-emphasis'
                : isMatched
                ? 'bg-blue-600 hover:bg-blue-700 text-klic-on-emphasis cursor-pointer shadow-xs'
                : 'bg-blue-200  text-klic-on-emphasis/80 cursor-not-allowed'
            }`}
          >
            {isDeletedDone ? '클러스터 파기 요청됨' : '클러스터 영구 삭제'}
          </button>
        </div>
      </div>
    );
  };

  // 3. 문서 공유 & 접근 권한 설정 다이얼로그 (KLIC/dialog-3)
  const renderSharePermissionsDialog = () => (
    <div data-klic-surface="overlay" className="klic-dialog-example w-full max-w-[540px] mx-auto rounded-[24px] bg-white  border border-zinc-200/90  shadow-[0_14px_40px_color-mix(in_srgb,var(--klic-component-block-color-text)_6%,transparent)] overflow-hidden">
      <div className="px-6 pt-6 pb-4 border-b border-zinc-100  flex items-start justify-between">
        <div>
          <h2 className="text-[17px] font-semibold text-zinc-900  tracking-tight">
            2026 하반기 제품 로드맵 문서 공유
          </h2>
          <p className="text-[13px] text-klic-muted  mt-0.5">
            팀원을 초대하거나 외부 열람 링크 권한을 설정하세요.
          </p>
        </div>
        <button
          type="button"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-klic-muted hover:text-zinc-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 space-y-5">
        {/* 이메일 초대 바 */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center rounded-xl border border-zinc-200  bg-white  px-3 py-2">
            <input data-klic-surface="field"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="이메일 또는 팀 이름 입력..."
              className="w-full bg-transparent text-[13px] text-zinc-900  outline-none"
            />
            <button
              type="button"
              onClick={() =>
                setInviteRole((prev) =>
                  prev === '편집 가능'
                    ? '댓글 가능'
                    : prev === '댓글 가능'
                    ? '보기 전용'
                    : '편집 가능'
                )
              }
              className="px-2 py-0.5 rounded-md bg-zinc-100  text-[11.5px] font-medium text-zinc-700  shrink-0 flex items-center gap-1"
            >
              <span>{inviteRole}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!inviteEmail.trim()) return;
              setSharedMembers((prev) => [
                ...prev,
                {
                  id: `m-${Date.now()}`,
                  name: inviteEmail.split('@')[0],
                  email: inviteEmail.trim(),
                  role: inviteRole,
                  avatar:
                    './placeholders/avatar-352373979408.svg',
                },
              ]);
              setInviteEmail('');
            }}
            className="px-4 py-2.5 rounded-xl bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis text-[13px] font-medium shrink-0 cursor-pointer"
          >
            초대 발송
          </button>
        </div>

        {/* 접근 권한 보유 멤버 목록 */}
        <div className="space-y-3">
          <span className="text-[12px] font-semibold text-klic-muted">
            접근 권한 보유 멤버 ({sharedMembers.length}명)
          </span>
          <div className="space-y-2.5">
            {sharedMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between gap-3 py-1"
              >
                <div className="flex items-center gap-3">
                  <PersonAvatar
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-[13px] font-medium text-zinc-900 ">
                      {member.name}
                    </div>
                    <div className="text-[11.5px] text-klic-muted">{member.email}</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-100  text-[12px] font-medium text-zinc-700 ">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 링크 복사 바 */}
      <div className="px-6 py-4 bg-zinc-50/70  border-t border-zinc-100  flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[12.5px] text-klic-muted ">
          <Globe className="w-4 h-4 text-klic-muted" />
          <span>KLIC 워크스페이스 소속 멤버만 열람 가능</span>
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText('https://app.flux.kr/docs/roadmap-2026-h2');
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 1800);
          }}
          className="px-3.5 py-2 rounded-xl border border-zinc-200  bg-white  text-[12.5px] font-medium text-zinc-800  hover:bg-zinc-50 flex items-center gap-1.5 cursor-pointer"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-blue-600">링크 복사됨</span>
            </>
          ) : (
            <>
              <Link2 className="w-3.5 h-3.5 text-klic-muted" />
              <span>공유 링크 복사</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  // 4. 신규 API 액세스 토큰 발급 다이얼로그 (KLIC/dialog-4)
  const renderApiTokenDialog = () => {
    const allScopes = ['원장 읽기', '원장 쓰기', '웹훅 발송', '정산 승인', '감사 로그 조회'];
    return (
      <div data-klic-surface="overlay" className="klic-dialog-example w-full max-w-[520px] mx-auto rounded-[24px] bg-white  border border-zinc-200/90  shadow-[0_14px_40px_color-mix(in_srgb,var(--klic-component-block-color-text)_6%,transparent)] overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-zinc-100  flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-klic-inverse  text-klic-on-emphasis  flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[16.5px] font-semibold text-zinc-900  tracking-tight">
                신규 API 액세스 토큰 발급
              </h2>
              <p className="text-[12.5px] text-klic-muted ">
                서버 간 통신을 위한 최소 권한 스코프와 만료 주기를 설정하세요.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[12.5px] font-medium text-zinc-700 ">
              토큰 식별 이름
            </label>
            <input data-klic-surface="field"
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-zinc-200  bg-white  px-3.5 py-2 text-[13px] text-zinc-900  outline-none"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-zinc-700 ">
              유효 만료 주기
            </label>
            <div className="mt-1.5 grid grid-cols-4 gap-2">
              {['30일', '90일', '1년', '무기한'].map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setTokenExpiry(period)}
                  className={`py-2 rounded-xl border text-[12.5px] font-medium transition-all ${
                    tokenExpiry === period
                      ? 'border-zinc-900 bg-klic-inverse text-klic-on-emphasis   '
                      : 'border-zinc-200  text-klic-muted  hover:bg-zinc-50'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-zinc-700 ">
              허용 권한 스코프
            </label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {allScopes.map((sc) => {
                const active = selectedScopes.includes(sc);
                return (
                  <button
                    key={sc}
                    type="button"
                    onClick={() =>
                      setSelectedScopes((prev) =>
                        prev.includes(sc) ? prev.filter((item) => item !== sc) : [...prev, sc]
                      )
                    }
                    className={`px-3 py-1.5 rounded-xl border text-[12px] font-medium flex items-center gap-1.5 transition-all ${
                      active
                        ? 'border-zinc-900  bg-zinc-100  text-zinc-900 '
                        : 'border-zinc-200  text-klic-muted'
                    }`}
                  >
                    {active && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    <span>{sc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {generatedToken && (
            <div className="rounded-xl bg-blue-50/70  border border-blue-200  p-3.5 flex items-center justify-between gap-2">
              <code className="text-[12px] font-mono text-blue-900  truncate">
                {generatedToken}
              </code>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(generatedToken);
                  setCopiedToken(true);
                  setTimeout(() => setCopiedToken(false), 1800);
                }}
                className="px-2.5 py-1 rounded-lg bg-white  border border-blue-200 text-[11.5px] font-medium text-blue-700 shrink-0"
              >
                {copiedToken ? '복사 완료' : '키 복사'}
              </button>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-zinc-50/70  border-t border-zinc-100  flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() =>
              setGeneratedToken('sk_live_flux_89a4c21e0f99b31d772c4a')
            }
            className="w-full py-2.5 rounded-xl bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis text-[13px] font-medium cursor-pointer"
          >
            {generatedToken ? '시크릿 토큰 재발급하기' : '시크릿 토큰 생성하기'}
          </button>
        </div>
      </div>
    );
  };

  // 5. 대용량 CSV 데이터 임포트 & 스키마 매핑 다이얼로그 (KLIC/dialog-5)
  const renderCsvImportDialog = () => (
    <div data-klic-surface="overlay" className="klic-dialog-example w-full max-w-[580px] mx-auto rounded-[24px] bg-white  border border-zinc-200/90  shadow-[0_14px_40px_color-mix(in_srgb,var(--klic-component-block-color-text)_6%,transparent)] overflow-hidden">
      <div className="px-6 pt-6 pb-4 border-b border-zinc-100  flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50  border border-blue-200  text-blue-600 flex items-center justify-center">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[16.5px] font-semibold text-zinc-900  tracking-tight">
              대용량 고객 원장 CSV 임포트
            </h2>
            <p className="text-[12.5px] text-klic-muted ">
              업로드된 CSV 헤더와 KLIC 데이터베이스 스키마 컬럼을 자동 매핑합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* 업로드된 파일 상태 카드 */}
        <div className="rounded-xl border border-dashed border-zinc-300  bg-zinc-50/60  p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UploadCloud className="w-5 h-5 text-klic-muted" />
            <div>
              <div className="text-[13px] font-semibold text-zinc-900 ">
                엔터프라이즈_정산원장_2026_Q3.csv
              </div>
              <div className="text-[11.5px] text-klic-muted">
                총 14,820행 감지됨 · 인코딩 UTF-8 · 오류 0건
              </div>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50  text-blue-700  text-[11px] font-medium">
            검증 통과
          </span>
        </div>

        {/* 컬럼 매핑 테이블 */}
        <div className="rounded-xl border border-zinc-200/80  overflow-hidden">
          <div className="grid grid-cols-3 bg-zinc-50  px-4 py-2 text-[11.5px] font-semibold text-klic-muted border-b border-zinc-200/80 ">
            <span>CSV 원본 헤더</span>
            <span>매핑할 DB 필드</span>
            <span className="text-right">샘플 미리보기</span>
          </div>
          <div className="divide-y divide-zinc-100 ">
            {mappedColumns.map((col) => (
              <div
                key={col.id}
                className="grid grid-cols-3 items-center px-4 py-2.5 text-[12.5px]"
              >
                <span className="font-medium text-zinc-800 ">
                  {col.source}
                </span>
                <div className="flex items-center gap-1.5 font-mono text-[12px] text-klic-muted ">
                  <ArrowRight className="w-3.5 h-3.5 text-klic-muted" />
                  <span>{col.target}</span>
                </div>
                <div className="flex items-center justify-end gap-1.5 text-klic-muted">
                  <span>{col.sample}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-zinc-50/70  border-t border-zinc-100  flex items-center justify-between">
        <span className="text-[12px] text-klic-muted">
          중복 식별자 자동 병합 활성화됨
        </span>
        <button
          type="button"
          onClick={() => setImportCompleted((v) => !v)}
          className={`px-4 py-2 rounded-xl text-[13px] font-medium cursor-pointer transition-all ${
            importCompleted
              ? 'bg-blue-600 text-klic-on-emphasis'
              : 'bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis'
          }`}
        >
          {importCompleted ? '14,820건 임포트 완료' : '14,820건 데이터 가져오기'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full rounded-2xl border border-zinc-200/80  overflow-hidden bg-[var(--klic-component-block-color-border)]/75 ">
      {/* 상단 다이얼로그 스타일 전환 탭 바 (한글 전용) */}
      <div className="px-5 py-3.5 border-b border-zinc-200/80  bg-white  flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-klic-inverse " />
          <span className="text-[13px] font-semibold text-zinc-900 ">
            KLIC 다이얼로그 & 모달 컬렉션
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'workspace-app', label: '워크스페이스 앱 추가' },
              { id: 'destructive-confirm', label: '영구 삭제 확인' },
              { id: 'share-permissions', label: '문서 공유 & 권한' },
              { id: 'api-token', label: 'API 토큰 발급' },
              { id: 'csv-import', label: 'CSV 스키마 매핑' },
            ] as { id: DialogShowcaseMode; label: string }[]
          ).map((tab) => {
            const active = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveMode(tab.id)}
                className={`px-2.5 py-1 rounded-lg text-[12px] font-medium transition-all ${
                  active
                    ? 'bg-klic-inverse text-klic-on-emphasis   shadow-2xs'
                    : 'text-klic-muted  hover:bg-zinc-100 '
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 다이얼로그 캔버스 영역 */}
      <div className="p-6 sm:p-12 flex items-center justify-center min-h-[640px]">
        {activeMode === 'workspace-app' && renderWorkspaceAppDialog()}
        {activeMode === 'destructive-confirm' && renderDestructiveConfirmDialog()}
        {activeMode === 'share-permissions' && renderSharePermissionsDialog()}
        {activeMode === 'api-token' && renderApiTokenDialog()}
        {activeMode === 'csv-import' && renderCsvImportDialog()}
      </div>
    </div>
  );
}
