import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  ArrowRight,
  ShieldCheck,
  Users,
  Code2,
  Database,
  Compass,
  Copy,
  Check,
  Radio,
  Play,
  RefreshCw,
  Layers,
  Terminal,
  Briefcase,
  Cpu,
  Wallet,
  Activity,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export type OnboardingShowcaseMode =
  | 'all-showcase'
  | 'checklist-hub'
  | 'role-personalize'
  | 'interactive-tour'
  | 'sdk-quickstart'
  | 'data-migration';

interface OnboardingShowcaseBlockProps {
  initialMode?: OnboardingShowcaseMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

interface ChecklistStep {
  id: string;
  title: string;
  desc: string;
  eta: string;
  category: string;
  completed: boolean;
  ctaLabel: string;
}

export const OnboardingShowcaseBlock: React.FC<OnboardingShowcaseBlockProps> = ({
  initialMode = 'all-showcase',
}) => {
  const [activeTab, setActiveTab] = useState<OnboardingShowcaseMode>(initialMode);

  React.useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode]);

  // ---------------------------------------------------------------------------
  // 1. 초기 설정 체크리스트 (onboarding-checklist-hub) 상태
  // ---------------------------------------------------------------------------
  const [checklistSteps, setChecklistSteps] = useState<ChecklistStep[]>([
    {
      id: 'step-1',
      title: 'Okta / Google Workspace SAML 2.0 싱글 사인온(SSO) 연동',
      desc: '전사 임직원 계정을 중앙 디렉토리와 동기화하고 2단계 인증(2FA) 강제 정책을 활성화합니다.',
      eta: '소요 시간 2분',
      category: '보안 인증',
      completed: true,
      ctaLabel: 'IdP 메타데이터 확인',
    },
    {
      id: 'step-2',
      title: '첫 프로덕션 결제 원장 워크스페이스 생성',
      desc: '서울(ap-northeast-2) 기본 리전에 격리된 VPC 원장 스키마와 KMS 암호화 키를 초기화합니다.',
      eta: '소요 시간 1분',
      category: '인프라 구성',
      completed: true,
      ctaLabel: '클러스터 설정 보기',
    },
    {
      id: 'step-3',
      title: '핵심 SRE 및 재무 정산 담당 팀원 초대 (최소 3명)',
      desc: '승인권자(Approver)와 온콜 엔지니어를 초대하여 4-Eyes 이중 결재 규정을 충족합니다.',
      eta: '소요 시간 1분',
      category: '조직 관리',
      completed: true,
      ctaLabel: '초대 링크 발송',
    },
    {
      id: 'step-4',
      title: '슬랙(#prod-alerts) 및 PagerDuty 실시간 웹훅 연결',
      desc: 'SLA 위반 위험 지수 상승 또는 정산 대사 불일치 발생 시 1초 이내에 경보를 수신합니다.',
      eta: '소요 시간 2분',
      category: '관제 연동',
      completed: false,
      ctaLabel: '웹훅 엔드포인트 등록',
    },
    {
      id: 'step-5',
      title: '샌드박스 첫 승인 트랜잭션 100건 부하 리허설 실행',
      desc: '실제 가맹점 트래픽을 전환하기 전에 카나리 라우팅과 자동 롤백 가드레일을 검증합니다.',
      eta: '소요 시간 3분',
      category: '최종 검증',
      completed: false,
      ctaLabel: '리허설 즉시 실행',
    },
  ]);

  const [selectedChecklistId, setSelectedChecklistId] = useState<string>('step-4');

  const toggleChecklistStep = (id: string) => {
    setChecklistSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const completedCount = checklistSteps.filter((s) => s.completed).length;
  const progressPct = Math.round((completedCount / checklistSteps.length) * 100);

  // ---------------------------------------------------------------------------
  // 2. 직무 맞춤 설문 뷰 (onboarding-role-personalize) 상태
  // ---------------------------------------------------------------------------
  const [selectedRole, setSelectedRole] = useState<'product' | 'engineering' | 'finance' | 'ops'>('engineering');
  const [selectedTeamSize, setSelectedTeamSize] = useState<'10-50' | '50-200' | '200-1000' | '1000+'>('200-1000');
  const [appliedWorkspace, setAppliedWorkspace] = useState(false);

  const roleConfigs = {
    product: {
      name: '프로덕트 & 그로스',
      icon: Briefcase,
      badge: 'PM / PO 최적 구성',
      widgets: ['전환 퍼널 코호트 분석', '기능 플래그 카나리 실험 보드', '릴리즈 로드맵 간트 차트'],
      defaultRoute: '/workspace/product-roadmap',
    },
    engineering: {
      name: '플랫폼 엔지니어링 & SRE',
      icon: Cpu,
      badge: 'SRE / DevOps 최적 구성',
      widgets: ['멀티 리전 에러 버짓 번다운', '분산 트레이스 워터폴 인스펙터', '24/7 온콜 호출 스케줄러'],
      defaultRoute: '/workspace/sre-command-center',
    },
    finance: {
      name: '재무 정산 & 전략기획',
      icon: Wallet,
      badge: 'CFO / 재무팀 최적 구성',
      widgets: ['10개년 프로포마 손익 시트', 'PG사 일일 정산 대사 DAG', '자본 유입 & ARR 브릿지 차트'],
      defaultRoute: '/workspace/finance-ledger',
    },
    ops: {
      name: '비즈니스 운영 & CS 관제',
      icon: Activity,
      badge: 'CX / 운영실 최적 구성',
      widgets: ['VIP 이탈 방어 실시간 스트림', 'SLA 위험 지수 히트맵', '스플릿 헬프데스크 인박스'],
      defaultRoute: '/workspace/ops-control',
    },
  };

  // ---------------------------------------------------------------------------
  // 3. 스포트라이트 가이드 (onboarding-interactive-tour) 상태
  // ---------------------------------------------------------------------------
  const [tourStep, setTourStep] = useState<number>(1);
  const tourTargets = [
    {
      step: 1,
      title: '1단계: 실시간 카나리 가중치 슬라이더 조작',
      desc: '신규 배포 버전(v4.8.0)으로 유입되는 프로덕션 트래픽 비율을 5%에서 25%로 즉시 조정합니다.',
      metricLabel: '현재 카나리 비중',
      metricValue: '25% (ap-northeast-2)',
    },
    {
      step: 2,
      title: '2단계: 이상 징후 자동 서킷 브레이커 활성화',
      desc: 'p99 지연시간이 80ms를 초과하거나 5xx 에러율이 0.1%를 넘으면 0.4초 내 구버전으로 자동 우회합니다.',
      metricLabel: '서킷 브레이커 임계치',
      metricValue: 'p99 < 80ms · Error < 0.1%',
    },
    {
      step: 3,
      title: '3단계: 4-Eyes 보안 감사 서명 및 승격 확정',
      desc: '온콜 리더와 보안 담당자의 이중 전자서명을 기록한 뒤 100% 전체 가맹점 트래픽으로 승격합니다.',
      metricLabel: '결재 승인 상태',
      metricValue: '2/2 서명 완료 (SHA-256 Verified)',
    },
  ];

  // ---------------------------------------------------------------------------
  // 4. SDK 연동 퀵스타트 (onboarding-sdk-quickstart) 상태
  // ---------------------------------------------------------------------------
  const [sdkLang, setSdkLang] = useState<'ts' | 'python' | 'go'>('ts');
  const [copiedSdk, setCopiedSdk] = useState(false);
  const [pingStatus, setPingStatus] = useState<'idle' | 'listening' | 'received'>('received');
  const [pingCount, setPingCount] = useState(3);

  const sdkSnippets: Record<'ts' | 'python' | 'go', { install: string; code: string }> = {
    ts: {
      install: '// 예시 의사코드 · 배포된 SDK가 아닙니다',
      code: `// 설명용 SDK 의사코드 (실제 설치 패키지 없음)
import { DemoClient } from './sample-client';

const flux = new DemoClient({
  apiKey: 'flx_live_99a8b7c6d5e4_seoul_prod',
  region: 'ap-northeast-2',
  flushIntervalMs: 500,
});

await flux.trackSettlement({
  txId: 'tx_20260423_88412',
  merchantId: 'mch_tossbank_core',
  amountKrw: 14800000,
  status: 'VERIFIED',
});`,
    },
    python: {
      install: '# 예시 의사코드 · 배포된 SDK가 아닙니다',
      code: `from sample_client import DemoClient  # 설명용 의사코드

client = DemoClient(
    api_key="flx_live_99a8b7c6d5e4_seoul_prod",
    region="ap-northeast-2"
)

client.track_settlement(
    tx_id="tx_20260423_88412",
    merchant_id="mch_tossbank_core",
    amount_krw=14800000,
    status="VERIFIED"
)`,
    },
    go: {
      install: '// 예시 의사코드 · 배포된 SDK가 아닙니다',
      code: `client := sample.NewClient(sample.Config{
    APIKey: "flx_live_99a8b7c6d5e4_seoul_prod",
    Region: "ap-northeast-2",
})

err := client.TrackSettlement(ctx, &sample.SettlementEvent{
    TxID:       "tx_20260423_88412",
    MerchantID: "mch_tossbank_core",
    AmountKRW:  14800000,
    Status:     "VERIFIED",
})`,
    },
  };

  const triggerTestPing = () => {
    setPingStatus('listening');
    setTimeout(() => {
      setPingStatus('received');
      setPingCount((c) => c + 1);
    }, 450);
  };

  // ---------------------------------------------------------------------------
  // 5. 타사 툴 마이그레이션 (onboarding-data-migration) 상태
  // ---------------------------------------------------------------------------
  const [selectedSourceTool, setSelectedSourceTool] = useState<'jira' | 'linear' | 'asana' | 'notion'>('jira');
  const [migrationStarted, setMigrationStarted] = useState(false);
  const [fieldMappings, setFieldMappings] = useState([
    { id: 'm-1', sourceField: "에픽 / 이슈 키 (PROJ-*)", targetField: 'KLIC 업무 식별자 (FLX-*)', count: '4,820건', enabled: true },
    { id: 'm-2', sourceField: "담당자 및 보고자 이메일", targetField: 'SSO 조직 구성원 ID 자동 매칭', count: '142명', enabled: true },
    { id: 'm-3', sourceField: "우선순위 (최고 ~ 낮음)", targetField: 'SLA 심각도 등급 (SEV-1 ~ SEV-4)', count: '4단계', enabled: true },
    { id: 'm-4', sourceField: "댓글 및 Markdown 첨부파일", targetField: '인라인 감사 히스토리 & 암호화 볼륨', count: '19,410건', enabled: true },
  ]);

  const toggleMapping = (id: string) => {
    setFieldMappings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const showChecklist = activeTab === 'all-showcase' || activeTab === 'checklist-hub';
  const showRole = activeTab === 'all-showcase' || activeTab === 'role-personalize';
  const showTour = activeTab === 'all-showcase' || activeTab === 'interactive-tour';
  const showSdk = activeTab === 'all-showcase' || activeTab === 'sdk-quickstart';
  const showMigration = activeTab === 'all-showcase' || activeTab === 'data-migration';

  return (
    <div className="space-y-8">
      {/* 상단 서브모드 스위처 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  rounded-[16px] p-1.5">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'all-showcase', label: '전체 5종 쇼케이스', icon: Sparkles },
            { id: 'checklist-hub', label: '1. 초기 설정 체크리스트', icon: CheckCircle2 },
            { id: 'role-personalize', label: '2. 직무 맞춤 설문 뷰', icon: Users },
            { id: 'interactive-tour', label: '3. 스포트라이트 가이드', icon: Compass },
            { id: 'sdk-quickstart', label: '4. SDK 연동 퀵스타트', icon: Code2 },
            { id: 'data-migration', label: '5. 타사 툴 마이그레이션', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as OnboardingShowcaseMode)}
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
          KLIC/onboarding-suite · 패턴 5종
        </div>
      </div>

      {/* =====================================================================
          1. 초기 설정 체크리스트 (onboarding-checklist-hub)
         ===================================================================== */}
      {showChecklist && (
        <section className="bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  rounded-[20px] p-1.5 shadow-xs">
          <div className="bg-white  border border-zinc-200/70  rounded-[15px] overflow-hidden">
            {/* 상단 프로그레스 헤더 */}
            <div className="px-6 py-4 border-b border-zinc-200/80  flex flex-wrap items-center justify-between gap-4 bg-zinc-50/60 ">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-klic-inverse  text-klic-on-emphasis  text-[10px] font-mono font-bold">
                    온보딩 01
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 ">
                    엔터프라이즈 프로덕션 런치패드 5단계 체크리스트
                  </h3>
                </div>
                <p className="text-xs text-klic-muted ">
                  보안 감사 규정 충족 및 무중단 원장 가동을 위해 아래 5개 필수 과업을 완료하세요.
                </p>
              </div>

              {/* 달성률 프로그레스 게이지 */}
              <div className="flex items-center gap-4 min-w-[240px]">
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-700 ">
                      런치 준비 완료율
                    </span>
                    <span className="font-mono font-bold text-blue-600 ">
                      {completedCount}/{checklistSteps.length} ({progressPct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-200  overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 좌측 체크리스트 + 우측 선택 단계 실행 가이드 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 ">
              <div className="lg:col-span-7 divide-y divide-zinc-100 ">
                {checklistSteps.map((step, idx) => {
                  const isSelected = selectedChecklistId === step.id;
                  return (
                    <div
                      key={step.id}
                      onClick={() => setSelectedChecklistId(step.id)}
                      className={`p-4 flex items-start gap-3.5 transition cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-50 '
                          : 'hover:bg-zinc-50/50 '
                      }`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleChecklistStep(step.id);
                        }}
                        className="mt-0.5 shrink-0 cursor-pointer"
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-blue-600 " />
                        ) : (
                          <Circle className="w-5 h-5 text-klic-muted  hover:text-klic-muted" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-100  text-klic-muted ">
                            단계 0{idx + 1} · {step.category}
                          </span>
                          <span className="text-[11px] font-mono text-klic-muted">{step.eta}</span>
                        </div>
                        <div
                          className={`text-xs font-bold ${
                            step.completed
                              ? 'line-through text-klic-muted '
                              : 'text-zinc-900 '
                          }`}
                        >
                          {step.title}
                        </div>
                        <p className="text-xs text-klic-muted  mt-1 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>

                      <ChevronRight className="w-4 h-4 text-klic-muted shrink-0 mt-2" />
                    </div>
                  );
                })}
              </div>

              {/* 우측: 선택된 과업 실행 카드 */}
              <div className="lg:col-span-5 p-6 bg-zinc-50/40  flex flex-col justify-between space-y-4">
                {(() => {
                  const activeStep =
                    checklistSteps.find((s) => s.id === selectedChecklistId) || checklistSteps[0];
                  return (
                    <>
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50  border border-blue-200  text-[11px] font-semibold text-blue-700 ">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{activeStep.category} 가이드</span>
                        </div>
                        <h4 className="text-base font-bold text-zinc-900  leading-snug">
                          {activeStep.title}
                        </h4>
                        <p className="text-xs text-klic-muted  leading-relaxed">
                          {activeStep.desc}
                        </p>

                        <div className="p-3.5 rounded-xl bg-white  border border-zinc-200/80  space-y-2 text-xs">
                          <div className="font-mono text-[10px] font-bold text-klic-muted uppercase">
                            사전 점검 항목
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-klic-muted ">조직 관리자 권한</span>
                            <span className="font-mono font-bold text-blue-600">✓ 확인됨</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-klic-muted ">KMS 마스터 키 활성화</span>
                            <span className="font-mono font-bold text-blue-600">✓ ap-northeast-2</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => toggleChecklistStep(activeStep.id)}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-klic-inverse  text-klic-on-emphasis  text-xs font-bold hover:opacity-90 transition cursor-pointer inline-flex items-center justify-center gap-1.5"
                        >
                          <span>
                            {activeStep.completed ? '완료 상태 해제하기' : `${activeStep.ctaLabel} 및 완료 처리`}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          2. 직무 맞춤 설문 뷰 (onboarding-role-personalize)
         ===================================================================== */}
      {showRole && (
        <section className="bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  rounded-[20px] p-1.5 shadow-xs">
          <div className="bg-white  border border-zinc-200/70  rounded-[15px] overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200/80  flex flex-wrap items-center justify-between gap-3 bg-zinc-50/60 ">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded-md bg-klic-inverse  text-klic-on-emphasis  text-[10px] font-mono font-bold">
                  온보딩 02
                </span>
                <span className="text-xs font-bold text-zinc-900 ">
                  직군 & 조직 규모 기반 맞춤형 워크스페이스 자동 프로비저닝
                </span>
              </div>
              <span className="text-[11px] font-mono text-klic-muted">
                선택 즉시 기본 홈 대시보드와 알림 라우팅 템플릿이 구성됩니다
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 좌측: 직군 4종 선택 + 팀 규모 칩 (7칸) */}
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-900  block">
                    1. 귀하의 주요 담당 직무를 선택해주세요
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(Object.keys(roleConfigs) as Array<keyof typeof roleConfigs>).map((key) => {
                      const cfg = roleConfigs[key];
                      const Icon = cfg.icon;
                      const active = selectedRole === key;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            setSelectedRole(key);
                            setAppliedWorkspace(false);
                          }}
                          className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-start gap-3 ${
                            active
                              ? 'border-zinc-900  bg-klic-inverse/5  ring-1 ring-zinc-900 '
                              : 'border-zinc-200  hover:border-zinc-400'
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg shrink-0 ${
                              active
                                ? 'bg-klic-inverse text-klic-on-emphasis  '
                                : 'bg-zinc-100  text-klic-muted '
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-zinc-900 ">
                              {cfg.name}
                            </div>
                            <div className="text-[11px] font-mono text-klic-muted mt-0.5">
                              {cfg.badge}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 조직 규모 선택 */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-900  block">
                    2. 함께 협업할 전사 엔지니어 및 임직원 규모는 어느 정도인가요?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: '10-50', label: '10 ~ 50명', tier: 'Growth' },
                      { id: '50-200', label: '50 ~ 200명', tier: 'Scale-up' },
                      { id: '200-1000', label: '200 ~ 1,000명', tier: 'Enterprise' },
                      { id: '1000+', label: '1,000명 이상', tier: 'Dedicated' },
                    ].map((sz) => (
                      <button
                        key={sz.id}
                        onClick={() => {
                          setSelectedTeamSize(sz.id as typeof selectedTeamSize);
                          setAppliedWorkspace(false);
                        }}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                          selectedTeamSize === sz.id
                            ? 'border-zinc-900  bg-klic-inverse text-klic-on-emphasis  '
                            : 'border-zinc-200  text-zinc-700 '
                        }`}
                      >
                        <div className="text-xs font-bold">{sz.label}</div>
                        <div className="text-[10px] font-mono opacity-75">{{ Growth: '성장형', 'Scale-up': '확장형', Enterprise: '엔터프라이즈', Dedicated: '전용' }[sz.tier]} 권장</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 우측: 실시간 추천 대시보드 블루프린트 프리뷰 (5칸) */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-zinc-50  border border-zinc-200/80  flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-blue-600">
                      ● 자동 구성 설계도
                    </span>
                    <span className="text-[11px] font-mono text-klic-muted">
                      규모: {selectedTeamSize}명
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 ">
                    {roleConfigs[selectedRole].name} 전용 홈 레이아웃
                  </h4>
                  <div className="text-[11px] font-mono text-klic-muted bg-white  px-2.5 py-1.5 rounded-lg border border-zinc-200/70 ">
                    기본 라우팅: {roleConfigs[selectedRole].defaultRoute}
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-semibold text-klic-muted">
                      자동 고정되는 핵심 위젯 3종:
                    </div>
                    {roleConfigs[selectedRole].widgets.map((w, i) => (
                      <div
                        key={w}
                        className="px-3 py-2 rounded-xl bg-white  border border-zinc-200/80  flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-zinc-800 ">
                          0{i + 1}. {w}
                        </span>
                        <span className="text-[10px] font-mono text-blue-600 font-bold">
                          고정됨
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setAppliedWorkspace(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-klic-inverse  text-klic-on-emphasis  text-xs font-bold cursor-pointer hover:opacity-90 transition"
                >
                  {appliedWorkspace
                    ? '✓ 맞춤형 워크스페이스 템플릿 적용 완료!'
                    : '이 구성으로 워크스페이스 생성하기 →'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          3. 스포트라이트 가이드 (onboarding-interactive-tour)
         ===================================================================== */}
      {showTour && (
        <section className="bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  rounded-[20px] p-1.5 shadow-xs">
          <div className="bg-white  border border-zinc-200/70  rounded-[15px] overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200/80  flex flex-wrap items-center justify-between gap-3 bg-zinc-50/60 ">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded-md bg-klic-inverse  text-klic-on-emphasis  text-[10px] font-mono font-bold">
                  온보딩 03
                </span>
                <span className="text-xs font-bold text-zinc-900 ">
                  인터랙티브 스포트라이트 제품 투어 (포커스 링 & 단계별 코치마크)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((st) => (
                  <button
                    key={st}
                    onClick={() => setTourStep(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition ${
                      tourStep === st
                        ? 'bg-blue-600 text-klic-on-emphasis'
                        : 'bg-zinc-200/70  text-klic-muted '
                    }`}
                  >
                    단계 {st}/3
                  </button>
                ))}
              </div>
            </div>

            {/* 투어 대상 UI 캔버스 + 스포트라이트 포커스 카드 */}
            <div className="p-6 space-y-6 bg-klic-inverse/5 ">
              {/* 타겟 모듈 3열 (현재 투어 단계에 포커스 링 부여) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tourTargets.map((item) => {
                  const isFocused = tourStep === item.step;
                  return (
                    <div
                      key={item.step}
                      onClick={() => setTourStep(item.step)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                        isFocused
                          ? 'bg-white  border-blue-500 ring-4 ring-blue-500/20 shadow-lg scale-[1.01]'
                          : 'bg-white/60  border-zinc-200/80  opacity-60 hover:opacity-90'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded bg-zinc-100  text-[10px] font-mono font-bold text-zinc-700 ">
                          대상 0{item.step}
                        </span>
                        {isFocused && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-blue-600">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                            초점 활성화
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-zinc-900  mb-1">
                        {item.title}
                      </div>
                      <div className="p-2.5 rounded-xl bg-zinc-50  border border-zinc-200/60  mt-3 flex items-center justify-between text-xs font-mono">
                        <span className="text-klic-muted">{item.metricLabel}</span>
                        <strong className="text-zinc-900 ">{item.metricValue}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 하단 스포트라이트 툴팁 컨트롤러 바 (클린 라이트 서피스) */}
              <div className="p-5 rounded-2xl bg-blue-50/50  border border-blue-200/80  flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-klic-on-emphasis text-[10px] font-mono font-bold">
                      사용 안내 {tourStep} OF 3
                    </span>
                    <span className="text-sm font-bold text-zinc-900 ">{tourTargets[tourStep - 1].title}</span>
                  </div>
                  <p className="text-xs text-klic-muted  leading-relaxed">
                    {tourTargets[tourStep - 1].desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setTourStep((s) => (s > 1 ? s - 1 : 3))}
                    className="px-3 py-2 rounded-xl bg-white  border border-zinc-200  hover:bg-zinc-50 text-zinc-700  text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> 이전 단계
                  </button>
                  <button
                    onClick={() => setTourStep((s) => (s < 3 ? s + 1 : 1))}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-klic-on-emphasis text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{tourStep === 3 ? '투어 다시 시작' : '다음 포커스 이동'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          4. SDK 연동 퀵스타트 (onboarding-sdk-quickstart)
         ===================================================================== */}
      {showSdk && (
        <section className="bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  rounded-[20px] p-1.5 shadow-xs">
          <div className="bg-white  border border-zinc-200/70  rounded-[15px] overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200/80  flex flex-wrap items-center justify-between gap-3 bg-zinc-50/60 ">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded-md bg-klic-inverse  text-klic-on-emphasis  text-[10px] font-mono font-bold">
                  온보딩 04
                </span>
                <span className="text-xs font-bold text-zinc-900 ">
                  언어별 서버 SDK 연동 퀵스타트 & 실시간 첫 이벤트 수신 검증기
                </span>
              </div>

              {/* 언어 선택 탭 */}
              <div className="flex items-center gap-1 bg-zinc-200/70  p-0.5 rounded-lg">
                {[
                  { id: 'ts', label: 'TypeScript / Node.js' },
                  { id: 'python', label: 'Python 3.12' },
                  { id: 'go', label: 'Go 1.23' },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSdkLang(lang.id as 'ts' | 'python' | 'go')}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold cursor-pointer transition ${
                      sdkLang === lang.id
                        ? 'bg-white  text-zinc-900  shadow-2xs'
                        : 'text-klic-muted '
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 ">
              {/* 좌측: 설치 명령어 + API 키 주입 코드 (7칸, 클린 라이트 서피스) */}
              <div className="lg:col-span-7 p-6 space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50  border border-zinc-200/80  text-zinc-800  font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-600 " />
                    <span className="font-semibold">$ {sdkSnippets[sdkLang].install}</span>
                  </div>
                  <button
                    onClick={() => {
                      setCopiedSdk(true);
                      setTimeout(() => setCopiedSdk(false), 1500);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white  border border-zinc-200  text-[11px] inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSdk ? <Check className="w-3 h-3 text-blue-600" /> : <Copy className="w-3 h-3 text-klic-muted" />}
                    <span>{copiedSdk ? '복사됨' : '코드 복사'}</span>
                  </button>
                </div>

                <div className="rounded-xl bg-zinc-50/80  text-zinc-800  p-4 font-mono text-xs border border-zinc-200/80  overflow-x-auto">
                  <div className="flex items-center justify-between text-[10px] text-klic-muted pb-2 mb-2 border-b border-zinc-200/80 ">
                    <span>프로덕션 시크릿 키 자동 주입됨 (ap-northeast-2)</span>
                    <span className="text-blue-600  font-semibold">TLS 1.3 mTLS 준비 완료</span>
                  </div>
                  <pre className="leading-relaxed text-blue-950 ">{sdkSnippets[sdkLang].code}</pre>
                </div>
              </div>

              {/* 우측: 실시간 이벤트 핑 수신 모니터 (5칸) */}
              <div className="lg:col-span-5 p-6 bg-zinc-50/50  flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900  flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
                      실시간 인입 웹훅/이벤트 리스너
                    </span>
                    <span className="text-[11px] font-mono font-bold text-blue-600">
                      총 {pingCount}건 수신됨
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white  border border-zinc-200  font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-klic-muted">상태</span>
                      <span className="px-2 py-0.5 rounded bg-blue-100  text-blue-700  font-bold">
                        {pingStatus === 'listening' ? '수신 대기 중...' : "200 OK · 검증 완료"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-klic-muted">최근 거래 ID</span>
                      <span className="text-zinc-800 ">tx_20260423_8841{pingCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-klic-muted">금액</span>
                      <span className="text-zinc-800  font-bold">₩14,800,000</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-klic-muted">지연 시간</span>
                      <span className="text-blue-600 font-bold">14.2 ms (서울 리전)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={triggerTestPing}
                  className="w-full py-2.5 px-4 rounded-xl bg-klic-inverse  text-klic-on-emphasis  text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 transition"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>테스트 정산 이벤트 즉시 발송</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          5. 타사 툴 마이그레이션 (onboarding-data-migration)
         ===================================================================== */}
      {showMigration && (
        <section className="bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  rounded-[20px] p-1.5 shadow-xs">
          <div className="bg-white  border border-zinc-200/70  rounded-[15px] overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200/80  flex flex-wrap items-center justify-between gap-3 bg-zinc-50/60 ">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded-md bg-klic-inverse  text-klic-on-emphasis  text-[10px] font-mono font-bold">
                  온보딩 05
                </span>
                <span className="text-xs font-bold text-zinc-900 ">
                  외부 협업 툴(Jira · Linear · Asana · Notion) 원클릭 스키마 매핑 임포터
                </span>
              </div>
              <span className="text-[11px] font-mono text-blue-600 font-semibold">
                ● OAuth 2.0 읽기 전용 안전 동기화
              </span>
            </div>

            <div className="p-6 space-y-5">
              {/* 소스 툴 선택 그리드 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'jira', name: 'Atlassian Jira', issues: '4,820 이슈', status: '연결됨' },
                  { id: 'linear', name: 'Linear Workspace', issues: '1,940 이슈', status: '연결 가능' },
                  { id: 'asana', name: 'Asana Enterprise', issues: '3,120 태스크', status: '연결 가능' },
                  { id: 'notion', name: 'Notion Wiki & DB', issues: '890 문서', status: '연결 가능' },
                ].map((tool) => {
                  const active = selectedSourceTool === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setSelectedSourceTool(tool.id as typeof selectedSourceTool);
                        setMigrationStarted(false);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                        active
                          ? 'border-zinc-900  bg-klic-inverse/5  ring-1 ring-zinc-900 '
                          : 'border-zinc-200  hover:border-zinc-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Layers className="w-4 h-4 text-zinc-700 " />
                        <span className="text-[10px] font-mono font-bold text-blue-600">
                          {active ? '선택됨' : tool.status}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-zinc-900 ">
                        {tool.name}
                      </div>
                      <div className="text-[11px] font-mono text-klic-muted mt-0.5">
                        감지된 데이터: {tool.issues}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* 스키마 필드 매핑 테이블 */}
              <div className="border border-zinc-200  rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 bg-zinc-100  px-4 py-2.5 text-[11px] font-mono font-bold text-klic-muted  border-b border-zinc-200 ">
                  <div className="col-span-5">원본 필드 ({selectedSourceTool.toUpperCase()})</div>
                  <div className="col-span-5">KLIC 대상 스키마 매핑</div>
                  <div className="col-span-2 text-right">이관 대상 건수</div>
                </div>
                {fieldMappings.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => toggleMapping(m.id)}
                    className="grid grid-cols-12 px-4 py-3 border-b last:border-b-0 border-zinc-100  items-center text-xs hover:bg-zinc-50/70  cursor-pointer"
                  >
                    <div className="col-span-5 flex items-center gap-2 font-mono text-zinc-800 ">
                      <input
                        type="checkbox"
                        checked={m.enabled}
                        onChange={() => {}}
                        className="rounded border-zinc-300"
                      />
                      <span>{m.sourceField}</span>
                    </div>
                    <div className="col-span-5 font-semibold text-zinc-900 ">
                      → {m.targetField}
                    </div>
                    <div className="col-span-2 text-right font-mono font-bold text-blue-600">
                      {m.count}
                    </div>
                  </div>
                ))}
              </div>

              {/* 하단 실행 버튼 */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="text-xs text-klic-muted">
                  선택된 {fieldMappings.filter((m) => m.enabled).length}개 스키마 그룹이 무중단 백그라운드 큐로 복사됩니다.
                </div>
                <button
                  onClick={() => setMigrationStarted(true)}
                  className="px-4 py-2.5 rounded-xl bg-klic-inverse  text-klic-on-emphasis  text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${migrationStarted ? 'animate-spin' : ''}`} />
                  <span>
                    {migrationStarted
                      ? '백그라운드 마이그레이션 워커 가동 중 (24,372 레코드)...'
                      : '전체 데이터 무손실 가져오기 시작'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
