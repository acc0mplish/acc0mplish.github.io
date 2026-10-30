import { PersonAvatar } from '../PersonAvatar';
import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Plus,
  Check,
  Sparkles,
  ShieldCheck,
  SlidersHorizontal,
  Download,
  UserPlus,
  Trash2,
  Archive,
  Layers,
  Activity,
  Database,
  Lock,
  Webhook,
  FileText,
  AlertTriangle,
  Radio,
  ArrowUpRight,
  RefreshCw,
  Calendar,
  Home,
  Compass,
  CreditCard,
  Settings,
  X,
} from 'lucide-react';

export type NavbarShowcaseMode =
  | 'all-showcase'
  | 'workspace-header'
  | 'contextual-subnav'
  | 'floating-dock'
  | 'mega-menu'
  | 'incident-banner';

interface NavbarShowcaseBlockProps {
  initialMode?: NavbarShowcaseMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

interface TenantOption {
  id: string;
  name: string;
  plan: string;
  region: string;
  env: string;
}

const TENANT_OPTIONS: TenantOption[] = [
  {
    id: 't-kr',
    name: 'KLIC 엔터프라이즈 코리아',
    plan: '엔터프라이즈 플랜',
    region: '서울 리전',
    env: '프로덕션',
  },
  {
    id: 't-fin',
    name: 'KLIC 파이낸셜 정산망',
    plan: '금융 전용 클러스터',
    region: '서울 · 도쿄 이중화',
    env: '프로덕션',
  },
  {
    id: 't-lab',
    name: 'KLIC 샌드박스 테스트베드',
    plan: '개발자 워크스페이스',
    region: '판교 테스트존',
    env: '스테이징',
  },
];

const MEGA_MENU_CATEGORIES = [
  {
    id: 'platform',
    label: '코어 플랫폼',
    items: [
      {
        title: '실시간 원장 정산 엔진',
        desc: '초당 5만 건 이상의 다중 통화 트랜잭션을 무결성 검증과 함께 실시간 처리합니다.',
        badge: '핵심 모듈',
        icon: Database,
      },
      {
        title: '어드바이저 지식 충돌 감지',
        desc: '업로드된 플레이북 문서 간 상충되는 가격·할인 정책을 자동으로 식별합니다.',
        badge: '신규',
        icon: Sparkles,
      },
      {
        title: '24/7 이상 징후 상시 관제',
        desc: '응답 지연 및 에러 버짓 소진 속도를 실시간 추적하여 우회 경로를 가동합니다.',
        badge: '관제',
        icon: Activity,
      },
      {
        title: '제로트러스트 권한 매트릭스',
        desc: '조직·부서·직무 단위의 세밀한 데이터 열람 및 승인 권한을 제어합니다.',
        badge: '보안',
        icon: ShieldCheck,
      },
      {
        title: '고가용성 웹훅 스트림',
        desc: '자동 재시도와 서명 시크릿 검증이 내장된 엔터프라이즈 이벤트 파이프라인입니다.',
        badge: '연동',
        icon: Webhook,
      },
      {
        title: '자동 감사 보고서 생성기',
        desc: '분기별 재무 정산 내역과 보안 규정 준수 증적 문서를 원클릭으로 발행합니다.',
        badge: '컴플라이언스',
        icon: FileText,
      },
    ],
    spotlight: {
      tag: '2026.4 주요 업데이트',
      title: '자율 가드레일 시뮬레이터 2.0 출시',
      desc: '플레이북 규칙 변경이 전체 클라이언트 매출 유지율에 미치는 영향을 배포 전 시뮬레이션하세요.',
      cta: '릴리즈 노트 살펴보기',
    },
  },
  {
    id: 'security',
    label: '보안 & 거버넌스',
    items: [
      {
        title: '엔터프라이즈 싱글 사인온',
        desc: 'SAML 2.0 및 OIDC 기반 전사 통합 인증과 하드웨어 보안키를 지원합니다.',
        badge: '인증',
        icon: Lock,
      },
      {
        title: '실시간 SIEM 감사 스트림',
        desc: '모든 관리자 권한 변경과 API 호출 이력을 위변조 불가능한 로그로 기록합니다.',
        badge: '감사',
        icon: Radio,
      },
      {
        title: '데이터 보존 및 암호화 금고',
        desc: '고객사별 독립 KMS 키 관리와 법적 보존 연한 자동 파기 정책을 제공합니다.',
        badge: '암호화',
        icon: ShieldCheck,
      },
      {
        title: '다단계 재인증 승인 게이트',
        desc: '프로덕션 클러스터 삭제 및 대량 출금 시 생체·OTP 이중 검증을 강제합니다.',
        badge: '보호',
        icon: Check,
      },
    ],
    spotlight: {
      tag: '보안 인증 현황',
      title: '금융보안원 및 ISO 27001 무결성 검증 완료',
      desc: '전 리전 무중단 암호화 원장 아키텍처의 최신 보안 백서를 지금 다운로드하세요.',
      cta: '보안 백서 다운로드',
    },
  },
];

export function NavbarShowcaseBlock({
  initialMode = 'all-showcase',
  density = 'normal',
}: NavbarShowcaseBlockProps) {
  const [activeMode, setActiveMode] = useState<NavbarShowcaseMode>(initialMode);

  // 스타일 1 상태: 멀티 테넌트 워크스페이스 상단 바
  const [selectedTenant, setSelectedTenant] = useState<TenantOption>(TENANT_OPTIONS[0]);
  const [isTenantMenuOpen, setIsTenantMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [headerSearch, setHeaderSearch] = useState('');

  // 스타일 2 상태: 폴더형 탭 & 기간 필터 보조 네비게이션
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'pending' | 'conflict' | 'archived'>('all');
  const [activePeriod, setActivePeriod] = useState<'오늘' | '최근 7일' | '최근 30일' | '이번 분기'>('최근 30일');
  const [createdCount, setCreatedCount] = useState(0);

  // 스타일 3 상태: 플로팅 액션 도크 바
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>(['row-1', 'row-2', 'row-3']);
  const [activeDockNav, setActiveDockNav] = useState<string>('관제 홈');
  const [dockActionFeedback, setDockActionFeedback] = useState<string | null>(null);

  // 스타일 4 상태: 프로덕트 메가 메뉴 네비게이션
  const [activeMegaId, setActiveMegaId] = useState<string>('platform');

  // 스타일 5 상태: 시스템 상태 & 배포 알림 탑 바
  const [canaryProgress, setCanaryProgress] = useState(78);
  const [canaryPromoted, setCanaryPromoted] = useState(false);
  const [rerouteEnabled, setRerouteEnabled] = useState(true);
  const [maintenanceAck, setMaintenanceAck] = useState(false);

  React.useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  const triggerDockAction = (label: string) => {
    setDockActionFeedback(label);
    setTimeout(() => setDockActionFeedback(null), 1800);
  };

  // 1. 멀티 테넌트 워크스페이스 상단 바 (KLIC/navbar-1)
  const renderWorkspaceHeaderNavbar = () => (
    <div className="w-full rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs">
      <div className="rounded-[14px] bg-white  border border-zinc-200/80  overflow-visible">
        {/* 상단 메인 글로벌 헤더 바 */}
        <header className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100  relative">
          {/* 좌측: KLIC 로고 + 테넌트 스위처 + 브레드크럼 */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2 pr-1">
              <div className="w-7 h-7 rounded-lg bg-klic-inverse  text-klic-on-emphasis  flex items-center justify-center font-bold text-[13px] tracking-tight shadow-xs">
                f
              </div>
              <span className="text-[13.5px] font-bold tracking-tight text-zinc-900 ">
                KLIC
              </span>
            </div>

            <span className="text-klic-muted  text-sm">/</span>

            {/* 조직 스위처 드롭다운 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTenantMenuOpen((v) => !v)}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-50 hover:bg-zinc-100   border border-zinc-200/80  flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[12.5px] font-semibold text-zinc-900 ">
                  {selectedTenant.name}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-200/70  text-[10.5px] font-medium text-klic-muted ">
                  {selectedTenant.env}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-klic-muted" />
              </button>

              {isTenantMenuOpen && (
                <div className="absolute left-0 top-11 z-30 w-72 rounded-2xl bg-white  border border-zinc-200  shadow-xl p-1.5 space-y-1">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-klic-muted">
                    워크스페이스 조직 전환
                  </div>
                  {TENANT_OPTIONS.map((t) => {
                    const active = selectedTenant.id === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setSelectedTenant(t);
                          setIsTenantMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between transition-colors ${
                          active
                            ? 'bg-zinc-100 '
                            : 'hover:bg-zinc-50 '
                        }`}
                      >
                        <div>
                          <div className="text-[12.5px] font-semibold text-zinc-900 ">
                            {t.name}
                          </div>
                          <div className="text-[11px] text-klic-muted">
                            {t.plan} · {t.region}
                          </div>
                        </div>
                        {active && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <span className="text-klic-muted  text-sm hidden sm:inline">/</span>

            {/* 현재 경로 브레드크럼 */}
            <div className="hidden sm:flex items-center gap-1.5 text-[12.5px] font-medium text-klic-muted ">
              <span>정산 파이프라인</span>
              <ChevronRight className="w-3.5 h-3.5 text-klic-muted" />
              <span className="text-zinc-900  font-semibold">
                실시간 원장 모니터링
              </span>
            </div>
          </div>

          {/* 우측: ⌘K 검색창 + 알림 벨 + 프로필 아바타 */}
          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center rounded-xl border border-zinc-200/90  bg-zinc-50/70  px-3 py-1.5 w-56 focus-within:border-zinc-400 transition-colors">
              <Search className="w-3.5 h-3.5 text-klic-muted mr-2 shrink-0" />
              <input
                type="text"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="원장·문서·멤버 검색..."
                className="w-full bg-transparent text-[12px] text-zinc-900  placeholder:text-klic-muted outline-none"
              />
              <span className="px-1.5 py-0.5 rounded bg-white  border border-zinc-200/80  text-[10px] font-medium text-klic-muted">
                ⌘K
              </span>
            </div>

            {/* 알림 버튼 */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotifOpen((v) => !v)}
                className="w-9 h-9 rounded-xl border border-zinc-200/85  bg-white  hover:bg-zinc-50 flex items-center justify-center text-klic-muted  relative cursor-pointer"
                aria-label="실시간 알림 열기"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-klic-on-emphasis text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 top-11 z-30 w-80 rounded-2xl bg-white  border border-zinc-200  shadow-xl p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] font-semibold text-zinc-900 ">
                      실시간 워크스페이스 알림
                    </span>
                    <button
                      type="button"
                      onClick={() => setUnreadCount(0)}
                      className="text-[11px] font-medium text-blue-600 hover:underline"
                    >
                      모두 읽음 처리
                    </button>
                  </div>
                  <div className="divide-y divide-zinc-100  text-[12px]">
                    <div className="py-2">
                      <div className="font-medium text-zinc-900 ">
                        엔터프라이즈 가격 플레이북 충돌 해결됨
                      </div>
                      <div className="text-klic-muted text-[11px] mt-0.5">
                        김지훈 수석 매니저 · 4분 전
                      </div>
                    </div>
                    <div className="py-2">
                      <div className="font-medium text-zinc-900 ">
                        서울 리전 일일 정산 배치 정상 완료 (14,820건)
                      </div>
                      <div className="text-klic-muted text-[11px] mt-0.5">
                        자동화 파이프라인 · 19분 전
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 사용자 프로필 아바타 */}
            <div className="flex items-center gap-2 pl-1">
              <PersonAvatar
                src="./placeholders/avatar-576a55580552.svg"
                alt="한소윤"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-zinc-100 "
              />
              <div className="hidden lg:block text-left">
                <div className="text-[12px] font-semibold text-zinc-900  leading-tight">
                  한소윤 총괄 아키텍트
                </div>
                <div className="text-[10.5px] text-klic-muted leading-tight">
                  최고 관리자 권한
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 하단 미니 상태 컨텍스트 바 */}
        <div className="px-4 py-2.5 bg-zinc-50/70  flex flex-wrap items-center justify-between gap-2 text-[12px]">
          <div className="flex items-center gap-4 text-klic-muted ">
            <span>
              연결 리전: <strong className="text-zinc-800 ">{selectedTenant.region}</strong>
            </span>
            <span>
              요금제 티어: <strong className="text-zinc-800 ">{selectedTenant.plan}</strong>
            </span>
          </div>
          <span className="text-[11.5px] text-blue-600  font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            모든 API 게이트웨이 정상 가동 중 (99.99%)
          </span>
        </div>
      </div>
    </div>
  );

  // 2. 폴더형 탭 & 기간 필터 컨텍스트 보조 네비게이션 (KLIC/navbar-2)
  const renderContextualSubnav = () => {
    const subTabs = [
      { id: 'all', label: '전체 원장 내역', count: 1284 + createdCount },
      { id: 'pending', label: '승인 대기 큐', count: 24 },
      { id: 'conflict', label: '정책 충돌 검토', count: 3 },
      { id: 'archived', label: '보관된 문서', count: 912 },
    ] as const;

    return (
      <div className="w-full rounded-[20px] bg-[var(--klic-component-block-color-border)]  p-3 border border-zinc-200/80 ">
        {/* 상단 폴더 탭 + 우측 필터 및 CTA 버튼 바 */}
        <div className="flex flex-wrap items-end justify-between gap-3 px-1">
          {/* 연결형 폴더 탭 */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {subTabs.map((t) => {
              const active = activeSubTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveSubTab(t.id)}
                  className={`px-4 py-2.5 text-[13px] font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    active
                      ? 'bg-white  text-zinc-950  rounded-t-2xl shadow-[0_-1px_3px_color-mix(in_srgb,var(--klic-component-block-color-text)_3%,transparent)] relative z-10'
                      : 'text-klic-muted  hover:text-zinc-900  rounded-t-xl'
                  }`}
                >
                  <span>{t.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[11px] font-semibold ${
                      active
                        ? 'bg-klic-inverse text-klic-on-emphasis  '
                        : 'bg-zinc-300/70  text-zinc-700 '
                    }`}
                  >
                    {t.count.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 우측 기간 선택기 + 주요 액션 버튼 */}
          <div className="flex items-center gap-2 pb-2">
            <div className="flex items-center rounded-xl bg-white/80  border border-zinc-200/80  p-0.5">
              {(['오늘', '최근 7일', '최근 30일', '이번 분기'] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setActivePeriod(period)}
                  className={`px-2.5 py-1 rounded-lg text-[11.5px] font-medium transition-all cursor-pointer ${
                    activePeriod === period
                      ? 'bg-klic-inverse text-klic-on-emphasis   shadow-2xs'
                      : 'text-klic-muted  hover:text-zinc-900'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCreatedCount((c) => c + 1)}
              className="px-3.5 py-1.5 rounded-xl bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis text-[12px] font-medium flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>신규 정산 생성</span>
            </button>
          </div>
        </div>

        {/* 폴더 탭과 매끄럽게 이어지는 하단 화이트 컨테이너 */}
        <div
          className={`bg-white  rounded-b-2xl rounded-tr-2xl ${
            activeSubTab !== 'all' ? 'rounded-tl-2xl' : ''
          } p-4 border border-zinc-200/60  flex flex-wrap items-center justify-between gap-3 text-[12.5px]`}
        >
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-md bg-blue-50  text-blue-700  text-[11px] font-semibold">
              조회 기간: {activePeriod}
            </span>
            <span className="text-klic-muted ">
              선택된 탭 <strong className="text-zinc-900 ">{subTabs.find((s) => s.id === activeSubTab)?.label}</strong>의 실시간 필터가 동기화되었습니다.
            </span>
          </div>
          <div className="flex items-center gap-2 text-klic-muted">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>정렬 기준: 최근 업데이트순</span>
          </div>
        </div>
      </div>
    );
  };

  // 3. 하단 플로팅 액션 도크 바 (KLIC/navbar-3)
  const renderFloatingDockNavbar = () => {
    const sampleRows = [
      { id: 'row-1', code: 'TX-9081', title: '한빛핀테크 3분기 엔터프라이즈 정산', amount: '₩48,200,000' },
      { id: 'row-2', code: 'TX-9082', title: '두나무클라우드 코어 클러스터 연간 약정', amount: '₩19,500,000' },
      { id: 'row-3', code: 'TX-9083', title: '더존비즈온 실시간 스트림 증설', amount: '₩32,100,000' },
      { id: 'row-4', code: 'TX-9084', title: '네이버웍스 CRM 글로벌 리전 라이선스', amount: '₩12,400,000' },
    ];

    const toggleRow = (id: string) => {
      setSelectedRowIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    };

    return (
      <div className="w-full rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs">
        <div className="rounded-[14px] bg-white  border border-zinc-200/80  p-5 space-y-5 relative">
          {/* 선택 가능한 미니 행 리스트 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px] text-klic-muted px-1">
              <span>항목을 클릭하여 하단 플로팅 액션 도크 바를 제어하세요</span>
              {dockActionFeedback && (
                <span className="text-blue-600 font-semibold">
                  ✓ {dockActionFeedback} 실행 완료
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleRows.map((r) => {
                const checked = selectedRowIds.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => toggleRow(r.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      checked
                        ? 'border-zinc-900  bg-zinc-50 '
                        : 'border-zinc-200/80  hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          checked
                            ? 'bg-klic-inverse border-zinc-900 text-klic-on-emphasis  '
                            : 'border-zinc-300 '
                        }`}
                      >
                        {checked && <Check className="w-3 h-3 stroke-[2.5]" />}
                      </span>
                      <div>
                        <div className="text-[12.5px] font-semibold text-zinc-900 ">
                          {r.title}
                        </div>
                        <div className="text-[11px] font-mono text-klic-muted">{r.code}</div>
                      </div>
                    </div>
                    <span className="text-[12px] font-semibold text-zinc-800 ">
                      {r.amount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 다크 플로팅 벌크 액션 도크 바 */}
          <div className="pt-2 flex flex-col items-center gap-3">
            <div className="inline-flex flex-wrap items-center gap-1.5 rounded-2xl bg-klic-inverse text-klic-on-emphasis p-1.5 shadow-[0_12px_32px_color-mix(in_srgb,var(--klic-component-block-color-text)_22%,transparent)] border border-zinc-800">
              <div className="px-3 py-1.5 rounded-xl bg-klic-inverse flex items-center gap-2 text-[12px] font-semibold">
                <span className="w-5 h-5 rounded-md bg-blue-500 text-zinc-950 font-bold flex items-center justify-center text-[11px]">
                  {selectedRowIds.length}
                </span>
                <span>선택됨</span>
              </div>

              <div className="h-5 w-px bg-klic-inverse mx-0.5" />

              <button
                type="button"
                onClick={() => triggerDockAction(`${selectedRowIds.length}건 담당자 일괄 배정`)}
                className="px-3 py-1.5 rounded-xl hover:bg-klic-inverse text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-klic-muted" />
                <span>담당자 배정</span>
              </button>

              <button
                type="button"
                onClick={() => triggerDockAction(`${selectedRowIds.length}건 정산 내보내기`)}
                className="px-3 py-1.5 rounded-xl hover:bg-klic-inverse text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-klic-muted" />
                <span>원장 내보내기</span>
              </button>

              <button
                type="button"
                onClick={() => triggerDockAction(`${selectedRowIds.length}건 아카이브 보관`)}
                className="px-3 py-1.5 rounded-xl hover:bg-klic-inverse text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Archive className="w-3.5 h-3.5 text-klic-muted" />
                <span>보관 처리</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRowIds([])}
                className="px-2.5 py-1.5 rounded-xl hover:bg-blue-950/80 text-blue-400 text-[12px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>해제</span>
              </button>
            </div>

            {/* 아이콘 런처 플로팅 도크 바 */}
            <div data-klic-surface="chrome" className="inline-flex items-center gap-1.5 rounded-2xl bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/90  p-1.5 shadow-sm">
              {[
                { label: '관제 홈', icon: Home },
                { label: '탐색기', icon: Compass },
                { label: '레이어', icon: Layers },
                { label: '법인결제', icon: CreditCard },
                { label: '환경설정', icon: Settings },
              ].map((nav) => {
                const Icon = nav.icon;
                const active = activeDockNav === nav.label;
                return (
                  <button
                    key={nav.label}
                    type="button"
                    onClick={() => setActiveDockNav(nav.label)}
                    className={`px-3 py-2 rounded-xl flex items-center gap-1.5 text-[12px] font-medium transition-all cursor-pointer ${
                      active
                        ? 'bg-white  text-zinc-900  shadow-xs border border-zinc-200/80  -translate-y-0.5'
                        : 'text-klic-muted hover:text-zinc-900 '
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{nav.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 4. 프로덕트 모듈 메가 메뉴 네비게이션 (KLIC/navbar-4)
  const renderMegaMenuNavbar = () => {
    const currentMega =
      MEGA_MENU_CATEGORIES.find((c) => c.id === activeMegaId) || MEGA_MENU_CATEGORIES[0];

    return (
      <div className="w-full rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
        {/* 상단 네비게이션 바 */}
        <div className="rounded-[14px] bg-white  border border-zinc-200/80  px-5 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-klic-inverse  text-klic-on-emphasis  flex items-center justify-center font-bold text-[13px]">
                f
              </div>
              <span className="text-[14px] font-bold tracking-tight text-zinc-900 ">
                KLIC 클라우드
              </span>
            </div>

            <nav className="flex items-center gap-1.5">
              {MEGA_MENU_CATEGORIES.map((cat) => {
                const active = activeMegaId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveMegaId(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-[13px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                      active
                        ? 'bg-zinc-100  text-zinc-950  font-semibold'
                        : 'text-klic-muted  hover:bg-zinc-50 '
                    }`}
                  >
                    <span>{cat.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        active ? 'rotate-180 text-zinc-900 ' : 'text-klic-muted'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="px-3 py-1.5 text-[13px] font-medium text-klic-muted">
                고객 도입 사례
              </span>
              <span className="px-3 py-1.5 text-[13px] font-medium text-klic-muted">
                엔터프라이즈 요금
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-xl border border-zinc-200  text-[12.5px] font-medium text-zinc-700 "
            >
              문서 허브
            </button>
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-xl bg-klic-inverse  text-klic-on-emphasis  text-[12.5px] font-medium"
            >
              콘솔 시작하기
            </button>
          </div>
        </div>

        {/* 펼쳐진 메가 메뉴 드롭다운 패널 */}
        <div className="rounded-[14px] bg-white  border border-zinc-200/80  p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* 좌측 2열: 모듈 그리드 */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentMega.items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-3.5 rounded-xl border border-zinc-200/75  hover:border-zinc-300  hover:bg-zinc-50/50  transition-all flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-klic-inverse  text-klic-on-emphasis  flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13.5px] font-semibold text-zinc-900 ">
                        {item.title}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-100  text-[10.5px] font-medium text-klic-muted ">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[12px] text-klic-muted  leading-relaxed mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 우측 1열: 하이라이트 스포트라이트 카드 */}
          <div className="rounded-xl bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/80  p-5 flex flex-col justify-between">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-white  border border-zinc-200/80  text-[11px] font-semibold text-zinc-700 ">
                {currentMega.spotlight.tag}
              </span>
              <h4 className="text-[15.5px] font-semibold text-zinc-900  tracking-tight mt-3">
                {currentMega.spotlight.title}
              </h4>
              <p className="text-[12.5px] text-klic-muted  leading-relaxed mt-2">
                {currentMega.spotlight.desc}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-200/80  flex items-center justify-between">
              <span className="text-[12.5px] font-semibold text-zinc-900 ">
                {currentMega.spotlight.cta}
              </span>
              <div className="w-7 h-7 rounded-lg bg-klic-inverse  text-klic-on-emphasis  flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 5. 시스템 상태 & 카나리 배포 알림 탑 바 (KLIC/navbar-5)
  const renderIncidentBannerNavbar = () => (
    <div className="w-full rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-2">
      {/* 배너 1: 카나리 배포 진행률 상단 바 */}
      <div className="rounded-[14px] bg-white  border border-zinc-200/80  px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-2 py-0.5 rounded-md bg-blue-50  text-blue-700  border border-blue-200/70  text-[11px] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            카나리 배포 중
          </span>
          <span className="text-[13px] font-semibold text-zinc-900 ">
            정산 코어 엔진 v4.8.2 점진적 트래픽 승격
          </span>
          <div className="flex items-center gap-2">
            <div className="w-28 h-2 rounded-full bg-zinc-100  overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${canaryPromoted ? 100 : canaryProgress}%` }}
              />
            </div>
            <span className="text-[12px] font-mono font-semibold text-zinc-700 ">
              {canaryPromoted ? '100%' : `${canaryProgress}%`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCanaryPromoted((v) => !v)}
            className="px-3 py-1 rounded-lg bg-klic-inverse  text-klic-on-emphasis  text-[12px] font-medium cursor-pointer"
          >
            {canaryPromoted ? '전체 승격 완료됨' : '100% 즉시 승격'}
          </button>
        </div>
      </div>

      {/* 배너 2: 외부 결제망 지연 경보 및 자동 우회 라우팅 바 */}
      <div className="rounded-[14px] bg-amber-50/90  border border-amber-200/90  px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <AlertTriangle className="w-4 h-4 text-amber-600  shrink-0" />
          <span className="text-[13px] font-semibold text-amber-950 ">
            외부 카드사 승인 게이트웨이 응답 지연 감지 (평균 410ms)
          </span>
          <span className="text-[12px] text-amber-800 ">
            · 서울 예비 정산망으로 자동 우회 라우팅이 작동 중입니다.
          </span>
        </div>

        <button
          type="button"
          onClick={() => setRerouteEnabled((v) => !v)}
          className="px-3 py-1 rounded-lg bg-white  border border-amber-300  text-[12px] font-semibold text-amber-900  cursor-pointer"
        >
          {rerouteEnabled ? '우회 라우팅 유지 중' : '기본 경로로 복귀'}
        </button>
      </div>

      {/* 배너 3: 다크 정기 보안 패치 글로벌 공지 탑 바 */}
      <div className="rounded-[14px] bg-klic-inverse text-klic-on-emphasis px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-klic-inverse text-klic-on-emphasis text-[11px] font-medium">
            정기 점검 공지
          </span>
          <span className="text-[12.5px] text-klic-on-emphasis">
            10월 25일 오전 02:00 KST 무중단 보안 커널 패치가 예정되어 있습니다.
          </span>
        </div>

        <button
          type="button"
          onClick={() => setMaintenanceAck((v) => !v)}
          className="text-[12px] font-medium text-blue-400 hover:underline cursor-pointer"
        >
          {maintenanceAck ? '✓ 일정 확인 완료' : '점검 일정 확인'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white  rounded-2xl border border-zinc-200/80  overflow-hidden">
      {/* 상단 네비게이션 바 스타일 전환 탭 (한글 전용) */}
      <div className="px-5 py-3.5 border-b border-zinc-200/80  bg-zinc-50/60  flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-klic-inverse " />
          <span className="text-[13px] font-semibold text-zinc-900 ">
            KLIC 엔터프라이즈 네비게이션 바 컬렉션
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'all-showcase', label: '전체 5종 쇼케이스' },
              { id: 'workspace-header', label: '워크스페이스 상단 바' },
              { id: 'contextual-subnav', label: '폴더 탭 보조 바' },
              { id: 'floating-dock', label: '플로팅 도크 바' },
              { id: 'mega-menu', label: '메가 메뉴 바' },
              { id: 'incident-banner', label: '배포 & 상태 배너 바' },
            ] as { id: NavbarShowcaseMode; label: string }[]
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

      {/* 본문 프리뷰 캔버스 */}
      <div className="p-6 sm:p-10 space-y-10 bg-white ">
        {activeMode === 'all-showcase' && (
          <>
            <section className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[12px] font-medium text-klic-muted">
                  KLIC/navbar-1 · 멀티 테넌트 워크스페이스 상단 네비게이션 바
                </span>
                <span className="text-[11px] text-klic-muted">
                  조직 스위처 및 알림 벨 클릭 가능
                </span>
              </div>
              {renderWorkspaceHeaderNavbar()}
            </section>

            <section className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[12px] font-medium text-klic-muted">
                  KLIC/navbar-2 · 폴더형 탭 & 기간 필터 보조 네비게이션 바
                </span>
              </div>
              {renderContextualSubnav()}
            </section>

            <section className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[12px] font-medium text-klic-muted">
                  KLIC/navbar-3 · 하단 플로팅 벌크 액션 & 아이콘 도크 바
                </span>
              </div>
              {renderFloatingDockNavbar()}
            </section>

            <section className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[12px] font-medium text-klic-muted">
                  KLIC/navbar-4 · 프로덕트 모듈 메가 메뉴 네비게이션 바
                </span>
              </div>
              {renderMegaMenuNavbar()}
            </section>

            <section className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[12px] font-medium text-klic-muted">
                  KLIC/navbar-5 · 카나리 배포 & 시스템 상태 알림 탑 배너 바
                </span>
              </div>
              {renderIncidentBannerNavbar()}
            </section>
          </>
        )}

        {activeMode === 'workspace-header' && renderWorkspaceHeaderNavbar()}
        {activeMode === 'contextual-subnav' && renderContextualSubnav()}
        {activeMode === 'floating-dock' && renderFloatingDockNavbar()}
        {activeMode === 'mega-menu' && renderMegaMenuNavbar()}
        {activeMode === 'incident-banner' && renderIncidentBannerNavbar()}
      </div>
    </div>
  );
}
