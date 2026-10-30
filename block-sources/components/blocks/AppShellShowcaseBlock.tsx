import { PersonAvatar } from '../PersonAvatar';
import React, { useState } from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Layers,
  ShieldCheck,
  CreditCard,
  Settings,
  Database,
  Inbox,
  Search,
  ZoomIn,
  ZoomOut,
  MousePointer,
  Hand,
  Square,
  GitBranch,
  Check,
  Bell,
  FileText,
  Activity,
  Send,
  Sparkles,
} from 'lucide-react';

export type AppShellShowcaseMode =
  | 'all-showcase'
  | 'enterprise-sidebar'
  | 'dual-rail-ide'
  | 'top-nav-portal'
  | 'master-detail-inbox'
  | 'canvas-studio';

interface AppShellShowcaseBlockProps {
  initialMode?: AppShellShowcaseMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

const AVATARS = {
  sohee: './placeholders/avatar-576a55580552.svg',
  seoyeon: './placeholders/avatar-ef94a3ac14b1.svg',
  taewoo: './placeholders/avatar-352373979408.svg',
  yujin: './placeholders/avatar-8c2580aea9a4.svg',
};

const TENANT_ORGS = [
  { id: 'org-1', name: 'KLIC 엔터프라이즈 코리아', env: '프로덕션 · 서울' },
  { id: 'org-2', name: 'KLIC 파이낸셜 정산망', env: '프로덕션 · 이중화' },
  { id: 'org-3', name: 'KLIC 샌드박스 테스트베드', env: '스테이징 · 판교' },
];

export function AppShellShowcaseBlock({
  initialMode = 'enterprise-sidebar',
  density = 'normal',
}: AppShellShowcaseBlockProps) {
  const [activeMode, setActiveMode] = useState<AppShellShowcaseMode>(initialMode);

  React.useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  const boxPad =
    density === 'compact' ? 'p-4' : density === 'relaxed' ? 'p-6' : 'p-5';

  // --- 스타일 1 상태: 접이식 멀티 레벨 사이드바 앱 쉘 ---
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [selectedOrg, setSelectedOrg] = useState(TENANT_ORGS[0]);
  const [orgMenuOpen, setOrgMenuOpen] = useState<boolean>(false);
  const [activeNavMenu, setActiveNavMenu] = useState<string>('실시간 원장 정산');
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(true);

  // --- 스타일 2 상태: 듀얼 레일 & 3단 분할 워크스페이스 쉘 ---
  const [activeRailModule, setActiveRailModule] = useState<'ledger' | 'rules' | 'audit'>('ledger');
  const [activeTreeDoc, setActiveTreeDoc] = useState<string>('다중통화_정산규칙_v4');

  // --- 스타일 3 상태: 상단 수평 네비게이션 고객 포털 쉘 ---
  const [activePortalTab, setActivePortalTab] = useState<'overview' | 'invoices' | 'sla' | 'security'>('overview');

  // --- 스타일 4 상태: 마스터-디테일 스플릿 인박스 앱 쉘 ---
  const [selectedInboxFolder, setSelectedInboxFolder] = useState<string>('긴급 결재 & 경보');
  const [selectedThreadId, setSelectedThreadId] = useState<string>('msg-1');
  const [quickReplySent, setQuickReplySent] = useState<boolean>(false);

  // --- 스타일 5 상태: 전체 화면 캔버스 & 플로팅 툴바 쉘 ---
  const [activeCanvasTool, setActiveCanvasTool] = useState<'select' | 'pan' | 'node' | 'connect'>('select');
  const [canvasZoom, setCanvasZoom] = useState<number>(100);

  // ============================================================================
  // 1. 접이식 멀티 레벨 사이드바 앱 쉘 (KLIC/shell-1)
  // ============================================================================
  const renderEnterpriseSidebarShell = () => {
    const navMenus = [
      { id: '실시간 원장 정산', icon: LayoutDashboard, group: '코어 플랫폼' },
      { id: '어드바이저 지식 베이스', icon: Layers, group: '코어 플랫폼' },
      { id: '제로트러스트 권한 매트릭스', icon: ShieldCheck, group: '보안 & 거버넌스' },
      { id: '구독 플랜 & 법인 정산', icon: CreditCard, group: '보안 & 거버넌스' },
      { id: '워크스페이스 환경설정', icon: Settings, group: '시스템' },
    ];

    return (
      <div className="w-full max-w-[980px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-zinc-700 " />
            <span className="text-[13.5px] font-semibold text-zinc-900 ">
              접이식 멀티 레벨 사이드바 & 우측 인스펙터 앱 쉘
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="px-2.5 py-1 rounded-lg bg-white  border border-zinc-200/80  text-[11.5px] font-medium text-zinc-700  flex items-center gap-1.5 cursor-pointer"
            >
              {sidebarCollapsed ? <PanelLeftOpen className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
              <span>{sidebarCollapsed ? '사이드바 펼치기' : '아이콘 레일 축소'}</span>
            </button>
            <button
              type="button"
              onClick={() => setInspectorOpen((v) => !v)}
              className={`px-2.5 py-1 rounded-lg text-[11.5px] font-medium cursor-pointer ${
                inspectorOpen
                  ? 'bg-klic-inverse text-klic-on-emphasis  '
                  : 'bg-white  text-klic-muted '
              }`}
            >
              우측 속성 패널 {inspectorOpen ? '표시 중' : '숨김'}
            </button>
          </div>
        </div>

        <div className="rounded-[14px] bg-white  border border-zinc-200/80  overflow-hidden flex flex-col md:flex-row min-h-[480px]">
          {/* 좌측 접이식 사이드바 */}
          <aside
            className={`${
              sidebarCollapsed ? 'md:w-16' : 'md:w-64'
            } border-b md:border-b-0 md:border-r border-zinc-200/80  bg-zinc-50/70  p-3 flex flex-col justify-between transition-all shrink-0`}
          >
            <div className="space-y-3">
              {/* 조직 스위처 (보더라인 없는 클린 트리거) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOrgMenuOpen((v) => !v)}
                  className="w-full p-2 rounded-xl bg-white  hover:bg-zinc-100  flex items-center justify-between gap-2 text-left shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-klic-inverse  text-klic-on-emphasis  flex items-center justify-center font-bold text-[13px] shrink-0">
                      f
                    </div>
                    {!sidebarCollapsed && (
                      <div className="min-w-0">
                        <div className="text-[12.5px] font-semibold text-zinc-900  truncate">
                          {selectedOrg.name}
                        </div>
                        <div className="text-[10.5px] text-klic-muted truncate">
                          {selectedOrg.env}
                        </div>
                      </div>
                    )}
                  </div>
                  {!sidebarCollapsed && <ChevronDown className="w-3.5 h-3.5 text-klic-muted shrink-0" />}
                </button>

                {orgMenuOpen && !sidebarCollapsed && (
                  <div className="absolute left-0 top-14 z-30 w-60 rounded-xl bg-white  border border-zinc-200  shadow-xl p-1 space-y-0.5">
                    {TENANT_ORGS.map((org) => (
                      <button
                        key={org.id}
                        type="button"
                        onClick={() => {
                          setSelectedOrg(org);
                          setOrgMenuOpen(false);
                        }}
                        className={`w-full px-2.5 py-2 rounded-lg text-left text-[12px] flex items-center justify-between cursor-pointer ${
                          selectedOrg.id === org.id
                            ? 'bg-klic-inverse text-klic-on-emphasis   font-semibold'
                            : 'text-zinc-700  hover:bg-zinc-100 '
                        }`}
                      >
                        <span>{org.name}</span>
                        {selectedOrg.id === org.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 메뉴 트리 */}
              <div className="space-y-1">
                {navMenus.map((item) => {
                  const Icon = item.icon;
                  const active = activeNavMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveNavMenu(item.id)}
                      className={`w-full px-2.5 py-2 rounded-xl text-[12.5px] font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
                        active
                          ? 'bg-klic-inverse text-klic-on-emphasis   shadow-2xs'
                          : 'text-klic-muted  hover:bg-zinc-200/60 '
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span className="truncate">{item.id}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {!sidebarCollapsed && (
              <div className="p-3 rounded-xl bg-white  border border-zinc-200/70  flex items-center gap-2.5">
                <PersonAvatar src={AVATARS.sohee} alt="한소윤" className="w-7 h-7 rounded-full object-cover" />
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold text-zinc-900  truncate">
                    한소윤 총괄 아키텍트
                  </div>
                  <div className="text-[10.5px] text-blue-600 font-medium">● 보안키 인증됨</div>
                </div>
              </div>
            )}
          </aside>

          {/* 중앙 메인 워크스페이스 */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* 상단 브레드크럼 바 */}
              <header className="px-5 py-3 border-b border-zinc-100  flex items-center justify-between text-[12.5px]">
                <div className="flex items-center gap-2">
                  <span className="text-klic-muted">{selectedOrg.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-klic-muted" />
                  <span className="font-semibold text-zinc-900 ">
                    {activeNavMenu}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-50  text-blue-700  text-[11px] font-semibold">
                  가동률 99.99% 정상
                </span>
              </header>

              {/* 메인 캔버스 콘텐츠 */}
              <div className={`${boxPad} space-y-4`}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: '일일 정산 처리량', value: '148.2만 건', sub: '목표 대비 +14.2%' },
                    { label: '평균 승인 응답 속도', value: '42ms', sub: '서울·도쿄 이중화' },
                    { label: '활성 가드레일 규칙', value: '24개 규칙', sub: '정책 충돌 0건' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-3.5 rounded-xl bg-zinc-50  border border-zinc-200/75 "
                    >
                      <div className="text-[11.5px] text-klic-muted">{stat.label}</div>
                      <div className="text-[17px] font-bold text-zinc-900  mt-0.5">
                        {stat.value}
                      </div>
                      <div className="text-[11px] text-blue-600 font-medium mt-0.5">{stat.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-zinc-200/80  p-4 space-y-2.5">
                  <div className="text-[13px] font-semibold text-zinc-900 ">
                    {activeNavMenu} · 실시간 스트림 요약
                  </div>
                  <p className="text-[12.5px] text-klic-muted leading-relaxed">
                    좌측 사이드바를 아이콘 레일로 축소하거나 우측 인스펙터 패널을 여닫아도 중앙 워크스페이스 그리드가 반응형으로 즉시 재배치됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 우측 접이식 인스펙터 패널 */}
          {inspectorOpen && (
            <aside className="w-full md:w-64 border-t md:border-t-0 md:border-l border-zinc-200/80  bg-zinc-50/50  p-4 space-y-3 shrink-0">
              <div className="text-[12px] font-semibold text-zinc-900 ">
                컨텍스트 속성 인스펙터
              </div>
              <div className="p-3 rounded-xl bg-white  border border-zinc-200/75  space-y-1.5 text-[12px]">
                <div className="text-klic-muted text-[11px]">활성 클러스터 리전</div>
                <div className="font-semibold text-zinc-900 ">
                  서울 메인 · 도쿄 예비망
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white  border border-zinc-200/75  space-y-1.5 text-[12px]">
                <div className="text-klic-muted text-[11px]">원장 암호화 서명 키</div>
                <div className="font-mono text-[11.5px] text-zinc-700 ">
                  kms-seoul-v4 (정상)
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // 2. 듀얼 레일 & 3단 분할 워크스페이스 쉘 (KLIC/shell-2)
  // ============================================================================
  const renderDualRailIdeShell = () => {
    const docs = [
      { id: '다중통화_정산규칙_v4', desc: '환율 스냅샷 및 수수료 정산 수식 정의', updated: '12분 전' },
      { id: '어드바이저_할인한도_가드레일', desc: '연간 약정 15% 초과 할인 시 총괄 결재 라우팅', updated: '48분 전' },
      { id: '외부매입사_자동우회_정책', desc: '응답 지연 250ms 초과 시 예비 정산망 즉시 전환', updated: '2시간 전' },
    ];

    const currentDoc = docs.find((d) => d.id === activeTreeDoc) || docs[0];

    return (
      <div className="w-full max-w-[980px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-zinc-700 " />
            <span className="text-[13.5px] font-semibold text-zinc-900 ">
              듀얼 레일 & 3단 분할 엔지니어링 워크스페이스 쉘
            </span>
          </div>
          <span className="text-[11.5px] text-klic-muted">
            글로벌 모듈 아이콘 레일 + 보조 탐색 트리 + 메인 에디터 + 우측 검증 패널
          </span>
        </div>

        <div className="rounded-[14px] bg-white  border border-zinc-200/80  overflow-hidden flex flex-col lg:flex-row min-h-[440px]">
          {/* 1열: 최좌측 글로벌 모듈 아이콘 레일 */}
          <div className="lg:w-14 border-b lg:border-b-0 lg:border-r border-zinc-200/80  bg-klic-inverse text-klic-on-emphasis p-2 flex lg:flex-col items-center justify-between gap-2 shrink-0">
            <div className="flex lg:flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-bold text-sm">
                f
              </div>
              {(
                [
                  { id: 'ledger', icon: Database, title: '원장 스키마' },
                  { id: 'rules', icon: Layers, title: '가드레일 규칙' },
                  { id: 'audit', icon: ShieldCheck, title: '보안 검증' },
                ] as const
              ).map((m) => {
                const Icon = m.icon;
                const active = activeRailModule === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActiveRailModule(m.id)}
                    title={m.title}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                      active ? 'bg-white/20 text-klic-on-emphasis' : 'text-klic-muted hover:text-klic-on-emphasis'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
            <PersonAvatar src={AVATARS.seoyeon} alt="이서연" className="w-7 h-7 rounded-full object-cover" />
          </div>

          {/* 2열: 보조 탐색 트리 */}
          <div className="lg:w-60 border-b lg:border-b-0 lg:border-r border-zinc-200/80  bg-zinc-50/70  p-3.5 space-y-2 shrink-0">
            <div className="text-[11.5px] font-semibold text-klic-muted px-1">
              정책 스키마 탐색기 ({docs.length})
            </div>
            {docs.map((doc) => {
              const active = doc.id === activeTreeDoc;
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setActiveTreeDoc(doc.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-[12px] transition-all cursor-pointer ${
                    active
                      ? 'bg-klic-inverse text-klic-on-emphasis   font-semibold'
                      : 'text-zinc-700  hover:bg-zinc-200/60 '
                  }`}
                >
                  <div className="truncate">{doc.id}</div>
                  <div className={`text-[10.5px] mt-0.5 ${active ? 'text-klic-muted ' : 'text-klic-muted'}`}>
                    수정: {doc.updated}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 3열: 중앙 메인 캔버스 */}
          <div className={`flex-1 ${boxPad} space-y-4`}>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 ">
              <div>
                <h4 className="text-[15px] font-semibold text-zinc-900 ">
                  {currentDoc.id}
                </h4>
                <p className="text-[12px] text-klic-muted mt-0.5">{currentDoc.desc}</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-blue-50  text-blue-700  text-[11px] font-semibold">
                문법 및 정합성 통과
              </span>
            </div>

            <div className="rounded-xl bg-zinc-50  border border-zinc-200/80  p-4 font-mono text-[12px] space-y-1.5 text-zinc-800 ">
              <div>규칙_식별자: "{currentDoc.id}"</div>
              <div>적용_클러스터: "서울-메인 · 도쿄-예비망"</div>
              <div>최대_할인_상한선: 15%</div>
              <div>우회_지연_임계값: 250ms</div>
              <div>감사_서명_필수여부: 참 (하드웨어 보안키)</div>
            </div>
          </div>

          {/* 4열: 우측 실시간 영향도 패널 */}
          <div className="lg:w-60 border-t lg:border-t-0 lg:border-l border-zinc-200/80  bg-zinc-50/40  p-4 space-y-3 shrink-0">
            <div className="text-[12px] font-semibold text-zinc-900 ">
              배포 영향도 시뮬레이션
            </div>
            <div className="p-3 rounded-xl bg-white  border border-zinc-200/75 ">
              <div className="text-[11px] text-klic-muted">영향받는 엔터프라이즈 고객</div>
              <div className="text-[15px] font-bold text-zinc-900  mt-0.5">
                142개 고객사 원장
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white  border border-zinc-200/75 ">
              <div className="text-[11px] text-klic-muted">예상 정산 처리 지연</div>
              <div className="text-[15px] font-bold text-blue-600 mt-0.5">0.0ms (무중단)</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 3. 상단 수평 네비게이션 고객 포털 쉘 (KLIC/shell-3)
  // ============================================================================
  const renderTopNavPortalShell = () => (
    <div className="w-full max-w-[980px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-zinc-700 " />
          <span className="text-[13.5px] font-semibold text-zinc-900 ">
            상단 수평 네비게이션 B2B 고객 셀프서비스 포털 쉘
          </span>
        </div>
        <span className="text-[11.5px] text-klic-muted">
          한빛핀테크 전용 클라이언트 진단 & 청구 포털
        </span>
      </div>

      <div className="rounded-[14px] bg-white  border border-zinc-200/80  overflow-hidden">
        {/* 상단 수평 네비게이션 바 */}
        <header className="px-6 py-3.5 border-b border-zinc-200/80  flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-klic-inverse  text-klic-on-emphasis  flex items-center justify-center font-bold text-[13px]">
                f
              </div>
              <span className="text-[13.5px] font-bold text-zinc-900 ">
                KLIC 고객 포털
              </span>
            </div>

            <nav className="flex items-center gap-1">
              {(
                [
                  { id: 'overview', label: '대시보드 요약' },
                  { id: 'invoices', label: '청구서 & 세금계산서' },
                  { id: 'sla', label: '서비스 가용성 리포트' },
                  { id: 'security', label: '보안 인증서 보관함' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActivePortalTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-[12.5px] font-medium cursor-pointer ${
                    activePortalTab === tab.id
                      ? 'bg-klic-inverse text-klic-on-emphasis  '
                      : 'text-klic-muted  hover:bg-zinc-100 '
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-full bg-zinc-100  text-[11.5px] font-medium text-zinc-700 ">
              한빛핀테크 코리아 (연간 약정)
            </span>
            <PersonAvatar src={AVATARS.yujin} alt="정유진" className="w-7 h-7 rounded-full object-cover" />
          </div>
        </header>

        {/* 중앙 컨테이너 최적화 본문 */}
        <div className="max-w-[780px] mx-auto p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-[17px] font-semibold text-zinc-900 ">
                2026년 10월 정산 처리량 및 약정 시트 현황
              </h4>
              <p className="text-[12.5px] text-klic-muted mt-0.5">
                전담 아키텍트: 한소윤 총괄 · 전자세금계산서 매월 1일 자동 발행
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50  text-blue-700  text-[12px] font-semibold">
              이번 달 가동률 99.998%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-zinc-50  border border-zinc-200/75 ">
              <div className="text-[12px] text-klic-muted">이번 달 정산 원장 건수</div>
              <div className="text-[20px] font-bold text-zinc-900  mt-1">
                142.8만 / 200만 건
              </div>
              <div className="text-[11.5px] text-klic-muted mt-1">약정 한도의 71.4% 사용 중</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50  border border-zinc-200/75 ">
              <div className="text-[12px] text-klic-muted">이번 달 예상 청구 금액</div>
              <div className="text-[20px] font-bold text-zinc-900  mt-1">
                ₩14,800,000
              </div>
              <div className="text-[11.5px] text-blue-600 font-medium mt-1">연간 약정 15% 할인 적용됨</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50  border border-zinc-200/75 ">
              <div className="text-[12px] text-klic-muted">활성 멤버 라이선스</div>
              <div className="text-[20px] font-bold text-zinc-900  mt-1">
                46 / 50석
              </div>
              <div className="text-[11.5px] text-klic-muted mt-1">잔여 여유 시트 4석</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // 4. 마스터-디테일 스플릿 인박스 앱 쉘 (KLIC/shell-4)
  // ============================================================================
  const renderMasterDetailInboxShell = () => {
    const threads = [
      {
        id: 'msg-1',
        sender: '정유진 재무 총괄',
        dept: '전략재무본부',
        avatar: AVATARS.yujin,
        time: '8분 전',
        title: '서울·도쿄 리전 예비 GPU 노드 연간 약정 증설 품의서 결재 요청',
        preview: '월간 청구액 ₩14,800,000 · 실시간 추론 트래픽 증가에 따른 무중단 용량 확보 건',
        body: '안녕하세요 한소윤 총괄님, 3분기 엔터프라이즈 고객사의 정산 및 플레이북 진단 호출량이 전분기 대비 2.4배 증가함에 따라 서울 및 도쿄 리전 예비 노드 연간 약정 증설 품의를 요청드립니다.',
      },
      {
        id: 'msg-2',
        sender: '강태우 수석 아키텍트',
        dept: '플랫폼 엔지니어링',
        avatar: AVATARS.taewoo,
        time: '34분 전',
        title: '한빛핀테크 전용 웹훅 엔드포인트 서명 키 순환 교체 완료 보고',
        preview: '구버전 서명 키 24시간 유예 기간 설정 완료 및 무결성 검증 통과',
        body: '한빛핀테크 정산 웹훅 엔드포인트의 서명 시크릿 키가 v4로 순환 교체되었습니다. 향후 24시간 동안 구버전과 신버전 서명을 동시 허용하여 무중단 전환을 보장합니다.',
      },
    ];

    const activeThread = threads.find((t) => t.id === selectedThreadId) || threads[0];

    return (
      <div className="w-full max-w-[980px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-zinc-700 " />
            <span className="text-[13.5px] font-semibold text-zinc-900 ">
              마스터-디테일 3열 스플릿 인박스 앱 쉘
            </span>
          </div>
          <span className="text-[11.5px] text-klic-muted">
            폴더 사이드바 + 메시지 리스트 패인 + 우측 본문 및 즉시 결재 뷰
          </span>
        </div>

        <div className="rounded-[14px] bg-white  border border-zinc-200/80  overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
          {/* 1열: 폴더 사이드바 (3열) */}
          <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-zinc-200/80  bg-zinc-50/70  p-3.5 space-y-1.5">
            {['긴급 결재 & 경보', '어드바이저 멘션', '정산 감사 보고서', '보관된 스레드'].map((folder) => (
              <button
                key={folder}
                type="button"
                onClick={() => setSelectedInboxFolder(folder)}
                className={`w-full px-3 py-2 rounded-xl text-left text-[12.5px] font-medium flex items-center justify-between cursor-pointer ${
                  selectedInboxFolder === folder
                    ? 'bg-klic-inverse text-klic-on-emphasis  '
                    : 'text-klic-muted  hover:bg-zinc-200/60 '
                }`}
              >
                <span>{folder}</span>
                {folder === '긴급 결재 & 경보' && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10.5px] bg-white/20">2</span>
                )}
              </button>
            ))}
          </div>

          {/* 2열: 스레드 목록 패인 (4열) */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-zinc-200/80  p-3.5 space-y-2">
            {threads.map((t) => {
              const active = t.id === activeThread.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setSelectedThreadId(t.id);
                    setQuickReplySent(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    active
                      ? 'border-zinc-900  bg-zinc-50 '
                      : 'border-zinc-200/75  hover:bg-zinc-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11.5px]">
                    <div className="flex items-center gap-2">
                      <PersonAvatar src={t.avatar} alt={t.sender} className="w-4 h-4 rounded-full object-cover" />
                      <span className="font-semibold text-zinc-900 ">{t.sender}</span>
                    </div>
                    <span className="text-klic-muted">{t.time}</span>
                  </div>
                  <div className="mt-1.5 text-[13px] font-semibold text-zinc-900  line-clamp-1">
                    {t.title}
                  </div>
                  <p className="mt-1 text-[11.5px] text-klic-muted line-clamp-2">{t.preview}</p>
                </button>
              );
            })}
          </div>

          {/* 3열: 우측 상세 본문 뷰 (5열) */}
          <div className={`lg:col-span-5 ${boxPad} flex flex-col justify-between space-y-4`}>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100 ">
                <PersonAvatar
                  src={activeThread.avatar}
                  alt={activeThread.sender}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="text-[13px] font-semibold text-zinc-900 ">
                    {activeThread.sender} · {activeThread.dept}
                  </div>
                  <div className="text-[11px] text-klic-muted">수신 폴더: {selectedInboxFolder}</div>
                </div>
              </div>

              <h4 className="text-[14.5px] font-semibold text-zinc-900  leading-snug">
                {activeThread.title}
              </h4>
              <p className="text-[12.5px] text-klic-muted  leading-relaxed">
                {activeThread.body}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-100  flex items-center justify-between gap-2">
              <span className="text-[11.5px] text-klic-muted">
                {quickReplySent ? '✓ 승인 및 회신 발송 완료' : '결재 서명 대기 중'}
              </span>
              <button
                type="button"
                onClick={() => setQuickReplySent((v) => !v)}
                className="px-3.5 py-2 rounded-xl bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis text-[12px] font-medium cursor-pointer"
              >
                {quickReplySent ? '✓ 결재 승인 완료됨' : '즉시 승인 및 답장 보내기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 5. 전체 화면 캔버스 & 플로팅 툴바 쉘 (KLIC/shell-5)
  // ============================================================================
  const renderCanvasStudioShell = () => (
    <div className="w-full max-w-[980px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-zinc-700 " />
          <span className="text-[13.5px] font-semibold text-zinc-900 ">
            전체 화면 무한 캔버스 & 하단 플로팅 도크 스튜디오 쉘
          </span>
        </div>
        <span className="text-[11.5px] text-klic-muted">
          상단 미니 헤더와 하단 플로팅 도크만 남긴 몰입형 아키텍처 스튜디오
        </span>
      </div>

      <div className="rounded-[14px] bg-white  border border-zinc-200/80  bg-[linear-gradient(to_right,var(--klic-component-block-color-soft)_1px,transparent_1px),linear-gradient(to_bottom,var(--klic-component-block-color-soft)_1px,transparent_1px)]  bg-[size:16px_16px] p-5 min-h-[420px] flex flex-col justify-between relative">
        {/* 상단 플로팅 미니 바 */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="px-3.5 py-2 rounded-2xl bg-white/95  border border-zinc-200/90  shadow-sm flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-klic-inverse  text-klic-on-emphasis  flex items-center justify-center font-bold text-xs">
              f
            </div>
            <span className="text-[12.5px] font-semibold text-zinc-900 ">
              서울·도쿄 정산 원장 이중화 아키텍처 보드
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-2xl bg-white/95  border border-zinc-200/90  shadow-sm flex items-center gap-2">
            <div className="flex -space-x-1.5">
              <PersonAvatar src={AVATARS.sohee} alt="한소윤" className="w-6 h-6 rounded-full ring-2 ring-white  object-cover" />
              <PersonAvatar src={AVATARS.seoyeon} alt="이서연" className="w-6 h-6 rounded-full ring-2 ring-white  object-cover" />
              <PersonAvatar src={AVATARS.taewoo} alt="강태우" className="w-6 h-6 rounded-full ring-2 ring-white  object-cover" />
            </div>
            <span className="text-[11.5px] font-medium text-klic-muted ">
              3명 공동 편집 중
            </span>
          </div>
        </div>

        {/* 중앙 캔버스 다이어그램 노드 */}
        <div className="my-8 max-w-[680px] mx-auto w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white  border border-zinc-200/90  shadow-sm">
            <div className="text-[11px] font-semibold text-blue-600">주 정산 클러스터 (서울)</div>
            <div className="text-[14px] font-semibold text-zinc-900  mt-1">
              실시간 원장 정산 엔진 #01
            </div>
            <div className="text-[12px] text-klic-muted mt-1">
              가중치 90% · 평균 지연 24ms · 복식부기 동기화 활성
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white  border border-zinc-200/90  shadow-sm">
            <div className="text-[11px] font-semibold text-klic-muted">예비 정산 클러스터 (도쿄)</div>
            <div className="text-[14px] font-semibold text-zinc-900  mt-1">
              무중단 폴백 정산 엔진 #02
            </div>
            <div className="text-[12px] text-klic-muted mt-1">
              가중치 10% · 지연 임계값 초과 시 즉시 100% 자동 승격
            </div>
          </div>
        </div>

        {/* 하단 플로팅 도크 툴바 */}
        <div className="flex justify-center">
          <div className="px-3 py-2 rounded-2xl bg-klic-inverse text-klic-on-emphasis shadow-xl flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'select', label: '선택 도구', icon: MousePointer },
                { id: 'pan', label: '캔버스 이동', icon: Hand },
                { id: 'node', label: '노드 블록 추가', icon: Square },
                { id: 'connect', label: '경로 연결선', icon: GitBranch },
              ] as const
            ).map((tool) => {
              const Icon = tool.icon;
              const active = activeCanvasTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setActiveCanvasTool(tool.id)}
                  className={`px-3 py-1.5 rounded-xl text-[12px] font-medium flex items-center gap-1.5 cursor-pointer ${
                    active ? 'bg-white text-zinc-950 font-semibold' : 'text-klic-muted hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tool.label}</span>
                </button>
              );
            })}

            <div className="h-4 w-px bg-klic-inverse mx-1" />

            <button
              type="button"
              onClick={() => setCanvasZoom((z) => Math.max(70, z - 10))}
              className="p-1.5 rounded-lg text-klic-muted hover:bg-white/10 cursor-pointer"
              title="축소"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11.5px] px-1">{canvasZoom}%</span>
            <button
              type="button"
              onClick={() => setCanvasZoom((z) => Math.min(150, z + 10))}
              className="p-1.5 rounded-lg text-klic-muted hover:bg-white/10 cursor-pointer"
              title="확대"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white  rounded-2xl border border-zinc-200/80  overflow-hidden">
      {/* 상단 앱 쉘 스타일 전환 바 (한글 전용) */}
      <div className="px-5 py-3.5 border-b border-zinc-200/80  bg-zinc-50/60  flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-klic-inverse " />
          <span className="text-[13px] font-semibold text-zinc-900 ">
            KLIC 엔터프라이즈 앱 쉘 & 레이아웃 컬렉션
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'all-showcase', label: '전체 5종 쇼케이스' },
              { id: 'enterprise-sidebar', label: '접이식 멀티 사이드바' },
              { id: 'dual-rail-ide', label: '듀얼 레일 3단 쉘' },
              { id: 'top-nav-portal', label: '상단 네비게이션 포털' },
              { id: 'master-detail-inbox', label: '마스터-디테일 인박스' },
              { id: 'canvas-studio', label: '전체 화면 캔버스 쉘' },
            ] as { id: AppShellShowcaseMode; label: string }[]
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
      <div className="p-6 sm:p-10 space-y-10 bg-white ">
        {activeMode === 'all-showcase' && (
          <>
            <section className="space-y-2.5">
              <div className="max-w-[980px] mx-auto px-1 text-[12px] font-medium text-klic-muted">
                KLIC/shell-1 · 접이식 멀티 레벨 사이드바 앱 쉘
              </div>
              {renderEnterpriseSidebarShell()}
            </section>

            <section className="space-y-2.5">
              <div className="max-w-[980px] mx-auto px-1 text-[12px] font-medium text-klic-muted">
                KLIC/shell-2 · 듀얼 레일 & 3단 분할 워크스페이스 쉘
              </div>
              {renderDualRailIdeShell()}
            </section>

            <section className="space-y-2.5">
              <div className="max-w-[980px] mx-auto px-1 text-[12px] font-medium text-klic-muted">
                KLIC/shell-3 · 상단 수평 네비게이션 고객 포털 쉘
              </div>
              {renderTopNavPortalShell()}
            </section>

            <section className="space-y-2.5">
              <div className="max-w-[980px] mx-auto px-1 text-[12px] font-medium text-klic-muted">
                KLIC/shell-4 · 마스터-디테일 스플릿 인박스 앱 쉘
              </div>
              {renderMasterDetailInboxShell()}
            </section>

            <section className="space-y-2.5">
              <div className="max-w-[980px] mx-auto px-1 text-[12px] font-medium text-klic-muted">
                KLIC/shell-5 · 전체 화면 캔버스 & 플로팅 툴바 쉘
              </div>
              {renderCanvasStudioShell()}
            </section>
          </>
        )}

        {activeMode === 'enterprise-sidebar' && renderEnterpriseSidebarShell()}
        {activeMode === 'dual-rail-ide' && renderDualRailIdeShell()}
        {activeMode === 'top-nav-portal' && renderTopNavPortalShell()}
        {activeMode === 'master-detail-inbox' && renderMasterDetailInboxShell()}
        {activeMode === 'canvas-studio' && renderCanvasStudioShell()}
      </div>
    </div>
  );
}
