import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  Webhook,
  Database,
  Flag,
  LayoutGrid,
  CheckCircle2,
  Plus,
  Trash2,
  Play,
  Copy,
  Check,
  RefreshCw,
  FileText,
  Lock,
  Server,
  Sliders,
  Send,
  Users,
  DollarSign,
  Globe,
  Terminal,
  Sparkles,
  ArrowRight,
  KeyRound,
  Activity,
  Building2,
  Eye,
  EyeOff,
} from 'lucide-react';

export type FormShowcaseMode =
  | 'all-showcase'
  | 'incident-report'
  | 'procurement-request'
  | 'webhook-endpoint'
  | 'database-connection'
  | 'feature-flag-rule';

interface FormShowcaseBlockProps {
  initialMode?: FormShowcaseMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

const MODE_TABS: {
  id: FormShowcaseMode;
  label: string;
  badge: string;
  pkg: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'all-showcase',
    label: '전체 폼 양식 비교 (5종)',
    badge: 'ALL',
    pkg: 'KLIC/forms',
    desc: '인시던트 선언, 구매 품의, 웹훅 구성, DB SSL 커넥션, 피처 플래그 타겟팅 폼을 한눈에 비교하고 테스트합니다.',
    icon: LayoutGrid,
  },
  {
    id: 'incident-report',
    label: '긴급 인시던트 등록 폼',
    badge: 'SEV-1~4',
    pkg: 'KLIC/form-1',
    desc: '장애 제목, 영향받는 서비스 멀티셀렉트, 심각도(Sev 1~4) 라디오 카드, 고객 영향도 스위치 및 워룸 채널 자동 생성 옵션을 갖춘 폼',
    icon: AlertTriangle,
  },
  {
    id: 'procurement-request',
    label: '소프트웨어 구매 품의 폼',
    badge: 'FINOPS',
    pkg: 'KLIC/form-2',
    desc: '벤더 정보, 연간 계약 금액(통화 선택), 예산 귀속 부서, 개인정보(PII) 처리 여부 보안 체크리스트, 견적서 첨부 필드 폼',
    icon: DollarSign,
  },
  {
    id: 'webhook-endpoint',
    label: '웹훅 엔드포인트 설정 폼',
    badge: 'HMAC',
    pkg: 'KLIC/form-3',
    desc: '수신 URL 유효성 검사, 커스텀 HTTP 헤더 키-밸류 동적 추가, 재시도(Retry) 정책 슬라이더, 구독 이벤트 그룹 선택 양식',
    icon: Webhook,
  },
  {
    id: 'database-connection',
    label: 'DB 커넥션 & SSL 양식',
    badge: 'mTLS',
    pkg: 'KLIC/form-4',
    desc: '호스트·포트·DB명 입력, SSH 터널링 토글, CA 인증서 파일 업로드, 저장 전 실시간 연결 테스트(Ping) 버튼을 포함한 폼',
    icon: Database,
  },
  {
    id: 'feature-flag-rule',
    label: '피처 플래그 타겟팅 폼',
    badge: 'CANARY',
    pkg: 'KLIC/form-5',
    desc: '플래그 키 생성, 환경별 기본값 스위치, 특정 테넌트 ID 조건부 허용 및 점진적 롤아웃 비율(0~100%) 슬라이더를 제공하는 폼',
    icon: Flag,
  },
];

// ============================================================================
// 1. 긴급 인시던트 등록 폼 (KLIC/form-1)
// ============================================================================
function IncidentReportFormCard({ isCompact }: { isCompact: boolean }) {
  const [title, setTitle] = useState('ap-northeast-2 결제 승인 게이트웨이 P99 응답 지연 및 504 타임아웃 급증');
  const [severity, setSeverity] = useState<'SEV-1' | 'SEV-2' | 'SEV-3' | 'SEV-4'>('SEV-1');
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'payment-gateway-kr',
    'ledger-core-writer',
    'checkout-edge-proxy',
  ]);
  const [customerImpact, setCustomerImpact] = useState(true);
  const [autoWarRoom, setAutoWarRoom] = useState(true);
  const [statusPageDraft, setStatusPageDraft] = useState(true);
  const [commander, setCommander] = useState('박태준 (Principal SRE)');
  const [impactedRatio, setImpactedRatio] = useState(38);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  const allServices = [
    { id: 'payment-gateway-kr', label: 'payment-gateway-kr', tier: 'Tier-0' },
    { id: 'ledger-core-writer', label: 'ledger-core-writer', tier: 'Tier-0' },
    { id: 'checkout-edge-proxy', label: 'checkout-edge-proxy', tier: 'Tier-1' },
    { id: 'auth-sso-broker', label: 'auth-sso-broker', tier: 'Tier-1' },
    { id: 'webhook-dispatcher', label: 'webhook-dispatcher', tier: 'Tier-2' },
    { id: 'settlement-batch', label: 'settlement-batch', tier: 'Tier-2' },
  ];

  const severitySpecs = [
    {
      id: 'SEV-1' as const,
      title: 'SEV-1 (치명적 장애)',
      sla: '즉시 호출 · 5분 내 응답',
      desc: '코어 결제/원장 중단 또는 다수 고객 직접 피해 발생',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      activeRing: 'border-blue-500 ring-4 ring-blue-50 bg-blue-50/30',
    },
    {
      id: 'SEV-2' as const,
      title: 'SEV-2 (주요 기능 저하)',
      sla: '15분 내 온콜 응답',
      desc: '일부 리전 지연 증가 또는 우회 경로 작동 중',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      activeRing: 'border-amber-500 ring-4 ring-amber-50 bg-amber-50/30',
    },
    {
      id: 'SEV-3' as const,
      title: 'SEV-3 (경미한 오류)',
      sla: '업무시간 2시간 내 대응',
      desc: '백오피스/비핵심 배치 지연, 고객 영향 제한적',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      activeRing: 'border-blue-500 ring-4 ring-blue-50/45 bg-blue-50/20',
    },
    {
      id: 'SEV-4' as const,
      title: 'SEV-4 (단순 문의/예방)',
      sla: '24시간 내 트리아지',
      desc: 'UI 결함, 기술 부채, 모니터링 오탐지 조정',
      badgeClass: 'bg-zinc-100 text-zinc-700 border-zinc-200',
      activeRing: 'border-zinc-500 ring-4 ring-zinc-100 bg-zinc-50',
    },
  ];

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const warRoomSlug = `#inc-2026-0419-${severity.toLowerCase()}-payment`;

  return (
    <div className="bg-[var(--klic-component-block-color-soft)] p-1.5 rounded-[28px] border border-zinc-200/80">
      <div data-klic-surface="card" className={`bg-white rounded-[22px] border border-zinc-200/90 shadow-[0_2px_12px_color-mix(in_srgb,var(--klic-component-block-color-text)_3%,transparent)] ${isCompact ? 'p-4' : 'p-6'}`}>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold tracking-tight text-zinc-900">
                  긴급 인시던트 등록 및 워룸 소집 양식
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                  KLIC/form-1
                </span>
              </div>
              <p className="text-[12px] text-klic-muted mt-0.5">
                PagerDuty 온콜 체인 호출, Slack 전용 워룸 채널 개설, Statuspage 초안 게시를 단일 트랜잭션으로 실행합니다.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              INC-2026-0894 예약됨
            </span>
          </div>
        </div>

        {/* Form Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
          <div className="lg:col-span-8 space-y-5">
            {/* Incident Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-semibold text-zinc-800">
                  인시던트 요약 제목 <span className="text-blue-500">*</span>
                </label>
                <span className="text-[11px] font-mono text-klic-muted">{title.length} / 120자</span>
              </div>
              <input data-klic-surface="field"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 리전명 + 증상 + 핵심 영향 지표"
                className="w-full px-3.5 py-2.5 text-[13px] font-medium text-zinc-900 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/45 transition-all"
              />
            </div>

            {/* Severity Radio Cards */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[12px] font-semibold text-zinc-800">
                  심각도 등급 <span className="text-blue-500">*</span>
                </label>
                <span className="text-[11px] text-klic-muted">
                  선택 즉시 온콜 에스컬레이션 정책이 자동 매핑됩니다
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {severitySpecs.map((spec) => {
                  const active = severity === spec.id;
                  return (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => setSeverity(spec.id)}
                      className={`text-left p-3.5 rounded-2xl border transition-all ${
                        active
                          ? spec.activeRing
                          : 'border-zinc-200/90 bg-white hover:bg-zinc-50/70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded-md border ${spec.badgeClass}`}>
                          {spec.id}
                        </span>
                        <span className="text-[11px] font-mono text-klic-muted">{spec.sla}</span>
                      </div>
                      <p className="text-[13px] font-semibold text-zinc-900 mt-2">{spec.title}</p>
                      <p className="text-[11px] text-klic-muted mt-0.5 leading-relaxed">{spec.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Impacted Microservices Multi-select */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[12px] font-semibold text-zinc-800">
                  영향받는 마이크로서비스 멀티셀렉트 ({selectedServices.length}개 선택됨)
                </label>
                <button
                  type="button"
                  onClick={() => setSelectedServices(['payment-gateway-kr', 'ledger-core-writer'])}
                  className="text-[11px] font-medium text-blue-600 hover:text-blue-700"
                >
                  핵심 등급 0만 선택
                </button>
              </div>
              <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-[var(--klic-component-block-color-soft)]/70 border border-zinc-200/80">
                {allServices.map((svc) => {
                  const selected = selectedServices.includes(svc.id);
                  return (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => toggleService(svc.id)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-mono transition-all border ${
                        selected
                          ? 'bg-white text-blue-700 border-blue-300 ring-2 ring-blue-50 shadow-xs font-semibold'
                          : 'bg-white/70 text-klic-muted border-zinc-200 hover:bg-white'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          selected ? 'bg-blue-600' : 'bg-zinc-300'
                        }`}
                      />
                      <span>{svc.label}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-klic-muted">
                        {svc.tier.replace('Tier-', '등급 ')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Commander & Impacted Traffic Ratio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-zinc-800 mb-1.5">
                  인시던트 커맨더 (IC) 배정
                </label>
                <select
                  value={commander}
                  onChange={(e) => setCommander(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-[13px] font-medium text-zinc-900 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/45"
                >
                  <option value="박태준 (Principal SRE)">박태준 (책임 SRE · 주 당직)</option>
                  <option value="김도윤 (Staff Core Eng)">김도윤 (수석 코어 엔지니어 · 예비 당직)</option>
                  <option value="정유진 (VP of Infrastructure)">정유진 (인프라 총괄 · 상위 대응)</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[12px] font-semibold text-zinc-800">
                    예상 영향 트래픽 비율
                  </label>
                  <span className="text-[12px] font-mono font-bold text-blue-600">
                    {impactedRatio}% 요청 영향
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={impactedRatio}
                  onChange={(e) => setImpactedRatio(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer mt-2"
                />
                <div className="flex justify-between text-[10px] font-mono text-klic-muted mt-1">
                  <span>1% (국소 지연)</span>
                  <span>50% (리전 과반)</span>
                  <span>100% (전면 중단)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Inspector: Automation Switches & Live Preview */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-[var(--klic-component-block-color-soft)] p-3.5 rounded-2xl border border-zinc-200/80 space-y-4">
            <div className="bg-white rounded-xl p-4 border border-zinc-200/80 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-zinc-900">자동화 오케스트레이션 옵션</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                  운영 절차서 v4.2
                </span>
              </div>

              {/* Switch 1 */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-100">
                <div>
                  <p className="text-[12px] font-semibold text-zinc-800">외부 고객 직접 영향 여부</p>
                  <p className="text-[11px] text-klic-muted">활성화 시 CS 리드 및 임원진 동시 알림</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCustomerImpact(!customerImpact)}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                    customerImpact ? 'bg-blue-600' : 'bg-zinc-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      customerImpact ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Switch 2 */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-100">
                <div>
                  <p className="text-[12px] font-semibold text-zinc-800">Slack 워룸 채널 자동 생성</p>
                  <p className="text-[11px] font-mono text-blue-600">{warRoomSlug}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoWarRoom(!autoWarRoom)}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                    autoWarRoom ? 'bg-blue-600' : 'bg-zinc-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      autoWarRoom ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Switch 3 */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-100">
                <div>
                  <p className="text-[12px] font-semibold text-zinc-800">Statuspage 공지 초안 생성</p>
                  <p className="text-[11px] text-klic-muted">조사 중 상태 배너 즉시 준비</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStatusPageDraft(!statusPageDraft)}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                    statusPageDraft ? 'bg-blue-600' : 'bg-zinc-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      statusPageDraft ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Dispatch Preview Box */}
            <div className="bg-white rounded-xl p-4 border border-zinc-200/80 space-y-2.5">
              <div className="text-[11px] font-mono font-semibold text-klic-muted uppercase">
                발송 예정 페이로드 요약
              </div>
              <div className="space-y-1.5 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-klic-muted">심각도 / SLA</span>
                  <span className="font-mono font-bold text-blue-600">{severity} · SLA 5분</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-klic-muted">호출 대상</span>
                  <span className="font-medium text-zinc-800">{({ '박태준 (Principal SRE)': '박태준 (책임 SRE)', '김도윤 (Staff Core Eng)': '김도윤 (수석 코어 엔지니어)', '정유진 (VP of Infrastructure)': '정유진 (인프라 총괄)' } as Record<string, string>)[commander] || commander}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-klic-muted">연결된 서비스</span>
                  <span className="font-mono font-semibold text-zinc-800">{selectedServices.length}개 모듈</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSubmittedAt(
                    new Date().toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })
                  )
                }
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-klic-on-emphasis font-semibold text-[13px] flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                인시던트 선언 및 온콜 호출 실행
              </button>

              {submittedAt && (
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-[11px] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    <strong>{submittedAt}</strong> — {warRoomSlug} 개설 및 PagerDuty 호출 완료
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. 소프트웨어 구매 품의 폼 (KLIC/form-2)
// ============================================================================
function ProcurementRequestFormCard({ isCompact }: { isCompact: boolean }) {
  const [vendorName, setVendorName] = useState('삼성SDS 클라우드(주)');
  const [planTier, setPlanTier] = useState('Business Critical (Enterprise)');
  const [currency, setCurrency] = useState<'USD' | 'KRW'>('USD');
  const [annualAmount, setAnnualAmount] = useState(84000);
  const [seatCount, setSeatCount] = useState(45);
  const [department, setDepartment] = useState('Data Platform & AI 본부 (CC-402)');
  const [quoteFile, setQuoteFile] = useState('SamsungSDS_2026_OrderForm_Signed_v2.pdf');
  const [piiChecks, setPiiChecks] = useState({
    soc2Verified: true,
    dpaSigned: true,
    zeroDataRetention: true,
    koreaRegionResidency: false,
  });
  const [submittedRequest, setSubmittedRequest] = useState(false);

  const formattedTotal =
    currency === 'USD'
      ? `$${annualAmount.toLocaleString()}`
      : `₩${(annualAmount * 1380).toLocaleString()}`;

  const approvalStages = [
    { role: '부서장 승인', approver: '한지훈 (VP of Data)', status: '자동 매핑', required: true },
    {
      role: '정보보안팀 PII 심사',
      approver: '최윤서 (CISO)',
      status: piiChecks.soc2Verified && piiChecks.dpaSigned ? '사전 통과' : '검토 필요',
      required: true,
    },
    {
      role: 'CFO 예산 합의 ($50k 초과)',
      approver: '이서연 (CFO)',
      status: annualAmount >= 50000 ? '필수 결재' : '면제 (전결)',
      required: annualAmount >= 50000,
    },
  ];

  return (
    <div className="bg-[var(--klic-component-block-color-soft)] p-1.5 rounded-[28px] border border-zinc-200/80">
      <div data-klic-surface="card" className={`bg-white rounded-[22px] border border-zinc-200/90 shadow-[0_2px_12px_color-mix(in_srgb,var(--klic-component-block-color-text)_3%,transparent)] ${isCompact ? 'p-4' : 'p-6'}`}>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold tracking-tight text-zinc-900">
                  엔터프라이즈 소프트웨어 구매 품의 폼
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                  KLIC/form-2
                </span>
              </div>
              <p className="text-[12px] text-klic-muted mt-0.5">
                벤더 정보, 연간 계약 금액(통화 선택), 예산 귀속 부서, 개인정보(PII) 보안 체크리스트 및 견적서 첨부를 통합 검증합니다.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            잔여 부서 예산: $210,000 (충분)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
          {/* Left Form Fields */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-zinc-800 mb-1.5">
                  공급업체 이름 <span className="text-blue-500">*</span>
                </label>
                <input data-klic-surface="field"
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-[13px] font-medium text-zinc-900 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/45"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-zinc-800 mb-1.5">
                  구독 플랜 및 약정 티어
                </label>
                <select
                  value={planTier}
                  onChange={(e) => setPlanTier(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-[13px] font-medium text-zinc-900 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/45"
                >
                  <option value="Business Critical (Enterprise)">핵심 업무용 (엔터프라이즈)</option>
                  <option value="Enterprise Multi-Cluster">엔터프라이즈 다중 클러스터</option>
                  <option value="Dedicated VPC PrivateLink">전용 VPC PrivateLink</option>
                </select>
              </div>
            </div>

            {/* Currency + Annual Contract Value + Seat Count */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-zinc-800 mb-1.5">
                  결제 통화
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-[var(--klic-component-block-color-soft)] rounded-xl border border-zinc-200/80">
                  {(['USD', 'KRW'] as const).map((cur) => (
                    <button
                      key={cur}
                      type="button"
                      onClick={() => setCurrency(cur)}
                      className={`py-1.5 rounded-lg text-[12px] font-mono font-semibold transition-all ${
                        currency === cur
                          ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/80'
                          : 'text-klic-muted hover:text-zinc-800'
                      }`}
                    >
                      {cur}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-zinc-800 mb-1.5">
                  연간 약정 금액 (ACV, USD 기준)
                </label>
                <input data-klic-surface="field"
                  type="number"
                  step={5000}
                  value={annualAmount}
                  onChange={(e) => setAnnualAmount(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 text-[13px] font-mono font-semibold text-zinc-900 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/45"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-zinc-800 mb-1.5">
                  라이선스 시트 수
                </label>
                <input data-klic-surface="field"
                  type="number"
                  value={seatCount}
                  onChange={(e) => setSeatCount(Number(e.target.value) || 1)}
                  className="w-full px-3.5 py-2 text-[13px] font-mono font-semibold text-zinc-900 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/45"
                />
              </div>
            </div>

            {/* Department & Cost Center */}
            <div>
              <label className="block text-[12px] font-semibold text-zinc-800 mb-1.5">
                예산 귀속 부서 및 비용 센터
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-[13px] font-medium text-zinc-900 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/45"
              >
                <option value="Data Platform & AI 본부 (CC-402)">데이터 플랫폼 및 AI 본부 (CC-402)</option>
                <option value="Core Infrastructure 본부 (CC-108)">핵심 인프라 본부 (CC-108)</option>
                <option value="Security & Governance 실 (CC-205)">보안 및 거버넌스실 (CC-205)</option>
                <option value="Product Growth 그룹 (CC-310)">제품 성장 그룹 (CC-310)</option>
              </select>
            </div>

            {/* PII & Security Compliance Checklist */}
            <div className="p-4 rounded-2xl bg-[var(--klic-component-block-color-soft)]/70 border border-zinc-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-zinc-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  개인정보(PII) 처리 및 보안 컴플라이언스 체크리스트
                </span>
                <span className="text-[11px] font-mono text-klic-muted">
                  {Object.values(piiChecks).filter(Boolean).length}/4 충족
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { key: 'soc2Verified' as const, label: 'SOC2 Type II 최신 감사 보고서 수령' },
                  { key: 'dpaSigned' as const, label: '표준 개인정보처리위탁(DPA) 부속합의 완료' },
                  { key: 'zeroDataRetention' as const, label: '고객 원본 데이터 AI 학습 배제(ZDR) 보증' },
                  { key: 'koreaRegionResidency' as const, label: '서울 리전(ap-northeast-2) 물리적 상주' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-zinc-200/80 cursor-pointer hover:border-blue-300 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={piiChecks[item.key]}
                      onChange={() =>
                        setPiiChecks((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                      }
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                    <span className="text-[12px] font-medium text-zinc-800">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Quote Attachment & Dynamic Approval Routing */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[var(--klic-component-block-color-soft)] p-3.5 rounded-2xl border border-zinc-200/80 space-y-4">
            {/* Attached Quote Card */}
            <div className="bg-white rounded-xl p-4 border border-zinc-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-zinc-900">공식 견적서 첨부</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  SHA-256 검증됨
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="truncate">
                    <p className="text-[12px] font-mono font-semibold text-zinc-800 truncate">
                      {quoteFile}
                    </p>
                    <p className="text-[10px] text-klic-muted">412 KB · 연간 선납 14% 볼륨 할인 반영</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setQuoteFile(
                      quoteFile.includes('v2')
                        ? 'SamsungSDS_2026_Revised_BAFO_v3.pdf'
                        : 'SamsungSDS_2026_OrderForm_Signed_v2.pdf'
                    )
                  }
                  className="px-2.5 py-1 text-[11px] font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 shrink-0"
                >
                  파일 교체
                </button>
              </div>
            </div>

            {/* Dynamic Approval Chain */}
            <div className="bg-white rounded-xl p-4 border border-zinc-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-zinc-900">금액 기반 자동 결재선 라우팅</span>
                <span className="text-[12px] font-mono font-bold text-blue-600">{formattedTotal}/년</span>
              </div>
              <div className="space-y-2">
                {approvalStages.map((stage, idx) => (
                  <div
                    key={stage.role}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-[12px] ${
                      stage.required
                        ? 'bg-zinc-50/80 border-zinc-200/90 text-zinc-900'
                        : 'bg-zinc-50/40 border-zinc-100 text-klic-muted line-through'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 font-mono text-[11px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-semibold">{stage.role}</p>
                        <p className="text-[11px] text-klic-muted">{stage.approver}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        stage.required
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-zinc-100 text-klic-muted'
                      }`}
                    >
                      {stage.status}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSubmittedRequest(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-klic-on-emphasis font-semibold text-[13px] flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                구매 품의서 상신 ({formattedTotal})
              </button>

              {submittedRequest && (
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-[11px] flex items-center justify-between">
                  <span>품의 번호 <strong>PO-2026-4418</strong> 결재 상신 완료</span>
                  <span className="font-mono text-blue-600">시트당 ${(annualAmount / seatCount).toFixed(0)}/yr</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. 웹훅 엔드포인트 설정 폼 (KLIC/form-3)
// ============================================================================
function WebhookEndpointFormCard({ isCompact }: { isCompact: boolean }) {
  const endpointInputId = React.useId();
  const endpointFeedbackId = React.useId();
  const [endpointUrl, setEndpointUrl] = useState('https://hooks.enterprise-fintech.io/v2/flux/events');
  const [signingSecret, setSigningSecret] = useState('whsec_9f8a7d6c5b4e3f2a1d0c9b8a7f6e5d4c');
  const [showSecret, setShowSecret] = useState(false);
  const [retryCount, setRetryCount] = useState(5);
  const [timeoutSec, setTimeoutSec] = useState(10);
  const [headers, setHeaders] = useState<{ id: string; key: string; value: string }[]>([
    { id: 'h-1', key: 'X-Tenant-Environment', value: 'production-ap-northeast-2' },
    { id: 'h-2', key: 'X-Idempotency-Policy', value: 'strict-sha256' },
  ]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    'invoice.payment_succeeded',
    'payout.reconciled',
    'incident.sev1_declared',
    'security.key_rotated',
  ]);
  const [pingResult, setPingResult] = useState<{ status: number; latency: string; ts: string } | null>(null);

  const isHttpsValid = endpointUrl.startsWith('https://') && endpointUrl.includes('.');

  const eventCatalog = [
    { id: 'invoice.payment_succeeded', group: 'Billing', label: 'invoice.payment_succeeded' },
    { id: 'invoice.payment_failed', group: 'Billing', label: 'invoice.payment_failed' },
    { id: 'payout.reconciled', group: 'Ledger', label: 'payout.reconciled' },
    { id: 'incident.sev1_declared', group: 'SRE', label: 'incident.sev1_declared' },
    { id: 'security.key_rotated', group: 'Security', label: 'security.key_rotated' },
    { id: 'member.rbac_changed', group: 'Security', label: 'member.rbac_changed' },
  ];

  const toggleEvent = (id: string) => {
    setSelectedEvents((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const addHeader = () => {
    setHeaders((prev) => [
      ...prev,
      { id: `h-${Date.now()}`, key: 'X-Custom-Trace', value: 'enabled' },
    ]);
  };

  const removeHeader = (id: string) => {
    setHeaders((prev) => prev.filter((h) => h.id !== id));
  };

  const rotateSecret = () => {
    const randomHex = Array.from({ length: 28 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setSigningSecret(`whsec_${randomHex}`);
  };

  return (
    <div className="bg-[var(--klic-component-block-color-soft)] p-1.5 rounded-[28px] border border-zinc-200/80">
      <div data-klic-surface="card" className={`bg-white rounded-[22px] border border-zinc-200/90 shadow-[0_2px_12px_color-mix(in_srgb,var(--klic-component-block-color-text)_3%,transparent)] ${isCompact ? 'p-4' : 'p-6'}`}>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600">
              <Webhook className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold tracking-tight text-zinc-900">
                  웹훅 엔드포인트 설정 폼 (HMAC-SHA256)
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                  KLIC/form-3
                </span>
              </div>
              <p className="text-[12px] text-klic-muted mt-0.5">
                수신 HTTPS URL 실시간 유효성 검사, 커스텀 HTTP 헤더 동적 빌더, 지수 백오프 재시도 슬라이더 및 이벤트 그룹을 구성합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              setPingResult({
                status: 200,
                latency: '38ms',
                ts: new Date().toLocaleTimeString('ko-KR'),
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold bg-klic-inverse hover:bg-klic-inverse text-klic-on-emphasis transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            연결 확인 요청 발송
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
          <div className="lg:col-span-7 space-y-4">
            {/* Target URL with HTTPS validation */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor={endpointInputId} className="text-[12px] font-semibold text-zinc-800">
                  수신 엔드포인트 URL (TLS 1.3 필수) <span className="text-blue-500">*</span>
                </label>
                <span
                  id={endpointFeedbackId}
                  aria-live="polite"
                  className={`text-[11px] font-mono font-semibold ${
                    isHttpsValid ? 'text-blue-600' : 'text-red-700'
                  }`}
                >
                  {isHttpsValid ? '✓ HTTPS 인증 유효' : '✕ https:// 프로토콜 필수'}
                </span>
              </div>
              <input data-klic-surface="field"
                type="url"
                id={endpointInputId}
                aria-invalid={!isHttpsValid}
                aria-describedby={endpointFeedbackId}
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-[13px] font-mono bg-white border rounded-xl focus:outline-none focus:ring-4 transition-all ${
                  isHttpsValid
                    ? 'border-zinc-200 focus:border-blue-500 focus:ring-blue-50/45 text-zinc-900'
                    : 'border-red-400 focus:border-red-500 focus:ring-red-50 text-red-700'
                }`}
              />
            </div>

            {/* HMAC Signing Secret */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-semibold text-zinc-800">
                  HMAC-SHA256 서명 시크릿 키 (KLIC-Signature 헤더 검증용)
                </label>
                <button
                  type="button"
                  onClick={rotateSecret}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                >
                  <RefreshCw className="w-3 h-3" />
                  시크릿 재발급
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    readOnly
                    value={signingSecret}
                    className="w-full px-3.5 py-2 text-[12px] font-mono text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-xl"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="px-3 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-[12px] font-medium flex items-center gap-1.5"
                >
                  {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showSecret ? '숨기기' : '표시'}
                </button>
              </div>
            </div>

            {/* Dynamic Custom HTTP Headers */}
            <div className="p-4 rounded-2xl bg-[var(--klic-component-block-color-soft)]/70 border border-zinc-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-zinc-900">
                  커스텀 HTTP 헤더 키-밸류 ({headers.length}개)
                </span>
                <button
                  type="button"
                  onClick={addHeader}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-[11px] font-semibold text-zinc-800 hover:bg-zinc-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  헤더 추가
                </button>
              </div>
              <div className="space-y-2">
                {headers.map((h, i) => (
                  <div key={h.id} className="flex items-center gap-2">
                    <input data-klic-surface="field"
                      type="text"
                      value={h.key}
                      onChange={(e) => {
                        const next = [...headers];
                        next[i] = { ...h, key: e.target.value };
                        setHeaders(next);
                      }}
                      className="w-5/12 px-3 py-1.5 text-[12px] font-mono bg-white border border-zinc-200 rounded-lg text-zinc-800"
                      placeholder="헤더 이름"
                    />
                    <input data-klic-surface="field"
                      type="text"
                      value={h.value}
                      onChange={(e) => {
                        const next = [...headers];
                        next[i] = { ...h, value: e.target.value };
                        setHeaders(next);
                      }}
                      className="flex-1 px-3 py-1.5 text-[12px] font-mono bg-white border border-zinc-200 rounded-lg text-zinc-800"
                      placeholder="헤더 값"
                    />
                    <button
                      type="button"
                      onClick={() => removeHeader(h.id)}
                      className="p-1.5 text-klic-muted hover:text-blue-600 rounded-lg hover:bg-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Event Topics & Exponential Backoff Retry Policy */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[var(--klic-component-block-color-soft)] p-3.5 rounded-2xl border border-zinc-200/80 space-y-4">
            {/* Subscribed Event Groups */}
            <div className="bg-white rounded-xl p-4 border border-zinc-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-zinc-900">구독 이벤트 토픽 선택</span>
                <span className="text-[11px] font-mono text-blue-600 font-semibold">
                  {selectedEvents.length}개 토픽 활성
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {eventCatalog.map((ev) => {
                  const checked = selectedEvents.includes(ev.id);
                  return (
                    <label
                      key={ev.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl border cursor-pointer transition-all ${
                        checked
                          ? 'bg-blue-50/40 border-blue-300 text-zinc-900'
                          : 'bg-white border-zinc-200/80 text-klic-muted hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleEvent(ev.id)}
                          className="w-3.5 h-3.5 accent-blue-600 rounded"
                        />
                        <span className="text-[12px] font-mono font-medium">{ev.label}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-klic-muted">
                        {({ Billing: '결제', Ledger: '원장', SRE: 'SRE', Security: '보안' } as Record<string, string>)[ev.group] || ev.group}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Retry Policy Sliders */}
            <div className="bg-white rounded-xl p-4 border border-zinc-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-zinc-800">
                  지수 백오프 재시도 횟수
                </span>
                <span className="text-[12px] font-mono font-bold text-blue-600">
                  최대 {retryCount}회 · 타임아웃 {timeoutSec}초
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={retryCount}
                onChange={(e) => setRetryCount(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-klic-muted">
                <span>백오프 스케줄: 15s → 1m → 5m → 30m → 2h</span>
                <button
                  type="button"
                  onClick={() => setTimeoutSec(timeoutSec === 10 ? 30 : 10)}
                  className="font-mono text-blue-600 underline"
                >
                  시간 초과 전환
                </button>
              </div>

              {pingResult && (
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-[11px] font-mono text-blue-800">
                  <span>HTTP {pingResult.status} OK · 왕복 {pingResult.latency}</span>
                  <span>{pingResult.ts}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. DB 커넥션 & SSL 양식 (KLIC/form-4)
// ============================================================================
function DatabaseConnectionFormCard({ isCompact }: { isCompact: boolean }) {
  const [engine, setEngine] = useState<'PostgreSQL 16' | 'ClickHouse 24' | 'MySQL 8.0'>('PostgreSQL 16');
  const [host, setHost] = useState('pg-prod-cluster-01.ap-northeast-2.rds.amazonaws.com');
  const [port, setPort] = useState('5432');
  const [dbName, setDbName] = useState('flux_settlement_ledger');
  const [dbUser, setDbUser] = useState('ro_analytics_svc');
  const [sslMode, setSslMode] = useState<'verify-full' | 'verify-ca' | 'require'>('verify-full');
  const [sshTunnel, setSshTunnel] = useState(true);
  const [bastionHost, setBastionHost] = useState('bastion.internal.flux.io:22');
  const [caCertName, setCaCertName] = useState('aws-rds-global-bundle-2026.pem');
  const [pingStep, setPingStep] = useState<'idle' | 'verified'>('verified');

  return (
    <div className="bg-[var(--klic-component-block-color-soft)] p-1.5 rounded-[28px] border border-zinc-200/80">
      <div data-klic-surface="card" className={`bg-white rounded-[22px] border border-zinc-200/90 shadow-[0_2px_12px_color-mix(in_srgb,var(--klic-component-block-color-text)_3%,transparent)] ${isCompact ? 'p-4' : 'p-6'}`}>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold tracking-tight text-zinc-900">
                  데이터베이스 커넥션 & mTLS SSL 인증 양식
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                  KLIC/form-4
                </span>
              </div>
              <p className="text-[12px] text-klic-muted mt-0.5">
                호스트·포트·DB명 입력, SSH 배스천 터널링 토글, 루트 CA 인증서 업로드 및 저장 전 4단계 실시간 연결 진단을 수행합니다.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {(['PostgreSQL 16', 'ClickHouse 24', 'MySQL 8.0'] as const).map((eng) => (
              <button
                key={eng}
                type="button"
                onClick={() => {
                  setEngine(eng);
                  setPort(eng === 'PostgreSQL 16' ? '5432' : eng === 'ClickHouse 24' ? '8443' : '3306');
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold border transition-all ${
                  engine === eng
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-white text-klic-muted border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                {eng}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
          {/* Left Fields */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-3">
                <label className="block text-[12px] font-semibold text-zinc-800 mb-1.5">
                  호스트 엔드포인트 (전체 도메인 이름) <span className="text-blue-500">*</span>
                </label>
                <input data-klic-surface="field"
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  className="w-full px-3.5 py-2 text-[12px] font-mono text-zinc-900 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/45"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-zinc-800 mb-1.5">
                  포트
                </label>
                <input data-klic-surface="field"
                  type="text"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="w-full px-3.5 py-2 text-[12px] font-mono text-zinc-900 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/45"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-zinc-800 mb-1.5">
                  데이터베이스 이름
                </label>
                <input data-klic-surface="field"
                  type="text"
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  className="w-full px-3.5 py-2 text-[12px] font-mono text-zinc-900 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/45"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-zinc-800 mb-1.5">
                  전용 읽기 계정
                </label>
                <input data-klic-surface="field"
                  type="text"
                  value={dbUser}
                  onChange={(e) => setDbUser(e.target.value)}
                  className="w-full px-3.5 py-2 text-[12px] font-mono text-zinc-900 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/45"
                />
              </div>
            </div>

            {/* SSL Mode & CA Cert */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-zinc-800 mb-1.5">
                  SSL/TLS 검증 수준
                </label>
                <select
                  value={sslMode}
                  onChange={(e) => setSslMode(e.target.value as 'verify-full' | 'verify-ca' | 'require')}
                  className="w-full px-3.5 py-2 text-[12px] font-mono font-semibold text-zinc-900 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/45"
                >
                  <option value="verify-full">verify-full (호스트명 + CA 체인 검증)</option>
                  <option value="verify-ca">verify-ca (CA 서명 검증)</option>
                  <option value="require">require (암호화만 강제)</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-zinc-800 mb-1.5">
                  루트 CA 인증서 (.pem)
                </label>
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-[12px]">
                  <span className="font-mono text-zinc-800 truncate">{caCertName}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setCaCertName(
                        caCertName.includes('aws')
                          ? 'internal-vault-ca-chain.pem'
                          : 'aws-rds-global-bundle-2026.pem'
                      )
                    }
                    className="text-[11px] font-semibold text-blue-600 shrink-0 ml-2"
                  >
                    변경
                  </button>
                </div>
              </div>
            </div>

            {/* SSH Bastion Tunnel Switch */}
            <div className="p-3.5 rounded-2xl bg-[var(--klic-component-block-color-soft)]/70 border border-zinc-200/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-[12px] font-bold text-zinc-900">SSH 배스천 호스트 터널링 경유</p>
                  <p className="text-[11px] font-mono text-klic-muted">
                    {sshTunnel ? `활성화됨 → ${bastionHost}` : '비활성 (Direct VPC Peering 연결)'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {sshTunnel && (
                  <input data-klic-surface="field"
                    type="text"
                    value={bastionHost}
                    onChange={(e) => setBastionHost(e.target.value)}
                    className="px-2.5 py-1 text-[11px] font-mono bg-white border border-zinc-200 rounded-lg text-zinc-800"
                  />
                )}
                <button
                  type="button"
                  onClick={() => setSshTunnel(!sshTunnel)}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                    sshTunnel ? 'bg-blue-600' : 'bg-zinc-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      sshTunnel ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Right Inspector: Live 4-stage Connection Diagnostics */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[var(--klic-component-block-color-soft)] p-3.5 rounded-2xl border border-zinc-200/80 space-y-4">
            <div className="bg-white rounded-xl p-4 border border-zinc-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-zinc-900">저장 전 실시간 연결 테스트</span>
                <span className="text-[11px] font-mono text-blue-600 font-semibold">4/4 통과</span>
              </div>

              <div className="space-y-2">
                {[
                  { step: '1. DNS 레코드 & 프라이빗 IP 해석', detail: '10.24.118.42 (0.8ms)' },
                  { step: '2. SSH 배스천 포트포워딩 핸드셰이크', detail: sshTunnel ? 'Ed25519 인증됨 (6.2ms)' : 'Direct 라우팅 (1.1ms)' },
                  { step: `3. TLS 1.3 (${sslMode}) 인증서 검증`, detail: 'CN 일치 · 만료 318일 남음' },
                  { step: '4. SELECT 1 읽기 전용 쿼리 응답', detail: '정상 응답 (4.4ms)' },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/50 border border-blue-200/80 text-[11px]"
                  >
                    <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      {item.step}
                    </span>
                    <span className="font-mono text-blue-700">{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-zinc-200/80 space-y-2.5">
              <div className="text-[11px] font-mono text-klic-muted">생성된 연결 URI 미리보기</div>
              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 font-mono text-[11px] text-zinc-800 break-all">
                postgresql://{dbUser}:••••••@{host}:{port}/{dbName}?sslmode={sslMode}
              </div>
              <button
                type="button"
                onClick={() => setPingStep(pingStep === 'verified' ? 'idle' : 'verified')}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-klic-on-emphasis font-semibold text-[13px] flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Activity className="w-4 h-4" />
                연결 재검증 및 데이터소스 저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. 피처 플래그 타겟팅 폼 (KLIC/form-5)
// ============================================================================
function FeatureFlagTargetingFormCard({ isCompact }: { isCompact: boolean }) {
  const [flagKey, setFlagKey] = useState('checkout.biometric_passkey_v2');
  const [env, setEnv] = useState<'production' | 'staging' | 'development'>('production');
  const [defaultEnabled, setDefaultEnabled] = useState(true);
  const [rolloutPct, setRolloutPct] = useState(35);
  const [allowlistTenants, setAllowlistTenants] = useState<string[]>([
    'tenant_samsung_sec',
    'tenant_toss_bank',
    'tenant_kakaopay_corp',
  ]);
  const [newTenantInput, setNewTenantInput] = useState('');
  const [simTenant, setSimTenant] = useState('tenant_toss_bank');
  const [simRegion, setSimRegion] = useState('ap-northeast-2');

  const addTenant = () => {
    const trimmed = newTenantInput.trim();
    if (trimmed && !allowlistTenants.includes(trimmed)) {
      setAllowlistTenants([...allowlistTenants, trimmed]);
      setNewTenantInput('');
    }
  };

  const removeTenant = (t: string) => {
    setAllowlistTenants(allowlistTenants.filter((item) => item !== t));
  };

  const isAllowlisted = allowlistTenants.includes(simTenant);
  const evalResult = !defaultEnabled
    ? { variation: "거짓 (기본 스위치 꺼짐)", reason: '환경 기본 스위치 비활성' }
    : isAllowlisted
    ? { variation: "참 (허용 목록 일치)", reason: `화이트리스트 테넌트 (${simTenant}) 즉시 허용` }
    : {
        variation: rolloutPct >= 50 ? '참 (카나리 그룹 #21)' : '거짓 (대조 그룹 #74)',
        reason: `MurmurHash3 버킷팅 (${rolloutPct}% 카나리 롤아웃 적용)`,
      };

  return (
    <div className="bg-[var(--klic-component-block-color-soft)] p-1.5 rounded-[28px] border border-zinc-200/80">
      <div data-klic-surface="card" className={`bg-white rounded-[22px] border border-zinc-200/90 shadow-[0_2px_12px_color-mix(in_srgb,var(--klic-component-block-color-text)_3%,transparent)] ${isCompact ? 'p-4' : 'p-6'}`}>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold tracking-tight text-zinc-900">
                  피처 플래그 타겟팅 & 점진적 롤아웃 폼
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                  KLIC/form-5
                </span>
              </div>
              <p className="text-[12px] text-klic-muted mt-0.5">
                플래그 키 정의, 환경별 기본값 스위치, 특정 테넌트 ID 조건부 화이트리스트 및 점진적 롤아웃 비율(0~100%)을 제어합니다.
              </p>
            </div>
          </div>

          {/* Environment Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--klic-component-block-color-soft)] border border-zinc-200/80">
            {(['production', 'staging', 'development'] as const).map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEnv(e)}
                className={`px-3 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all ${
                  env === e
                    ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/80'
                    : 'text-klic-muted hover:text-zinc-800'
                }`}
              >
                {{ production: '운영', staging: '검수', development: '개발' }[e]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
          {/* Left Rules Configuration */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[12px] font-semibold text-zinc-800 mb-1.5">
                  플래그 고유 키 <span className="text-blue-500">*</span>
                </label>
                <input data-klic-surface="field"
                  type="text"
                  value={flagKey}
                  onChange={(e) => setFlagKey(e.target.value)}
                  className="w-full px-3.5 py-2 text-[13px] font-mono font-semibold text-zinc-900 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/45"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-zinc-800 mb-1.5">
                  환경 마스터 스위치 ({{ production: '운영', staging: '검수', development: '개발' }[env]})
                </label>
                <button
                  type="button"
                  onClick={() => setDefaultEnabled(!defaultEnabled)}
                  className={`w-full py-2 px-3 rounded-xl border text-[12px] font-mono font-semibold flex items-center justify-between transition-all ${
                    defaultEnabled
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-zinc-100 border-zinc-200 text-klic-muted'
                  }`}
                >
                  <span>{defaultEnabled ? "활성화 (켜짐)" : "비활성화 (꺼짐)"}</span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      defaultEnabled ? 'bg-blue-500' : 'bg-zinc-400'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Tenant ID Allowlist Chips */}
            <div className="p-4 rounded-2xl bg-[var(--klic-component-block-color-soft)]/70 border border-zinc-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-zinc-900">
                  규칙 1 · 특정 테넌트 ID 항상 허용
                </span>
                <span className="text-[11px] font-mono text-blue-600 font-semibold">
                  100% 참 반환
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {allowlistTenants.map((tenant) => (
                  <span
                    key={tenant}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-[12px] font-mono text-zinc-800"
                  >
                    {tenant}
                    <button
                      type="button"
                      onClick={() => removeTenant(tenant)}
                      className="text-klic-muted hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input data-klic-surface="field"
                  type="text"
                  value={newTenantInput}
                  onChange={(e) => setNewTenantInput(e.target.value)}
                  placeholder="예: tenant_hyundai_card"
                  className="flex-1 px-3 py-1.5 text-[12px] font-mono bg-white border border-zinc-200 rounded-lg text-zinc-900"
                />
                <button
                  type="button"
                  onClick={addTenant}
                  className="px-3 py-1.5 rounded-lg bg-klic-inverse text-klic-on-emphasis text-[12px] font-semibold hover:bg-klic-inverse"
                >
                  테넌트 추가
                </button>
              </div>
            </div>

            {/* Progressive Rollout Percentage Slider */}
            <div className="p-4 rounded-2xl bg-white border border-zinc-200/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-zinc-900">
                  규칙 2 · 나머지 트래픽의 점진적 배포 비율
                </span>
                <span className="text-[13px] font-mono font-bold text-blue-600">
                  {rolloutPct}% 참 / {100 - rolloutPct}% 거짓
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={rolloutPct}
                onChange={(e) => setRolloutPct(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="w-full h-2.5 rounded-full bg-zinc-100 overflow-hidden flex border border-zinc-200/60">
                <div
                  className="bg-blue-600 h-full transition-all"
                  style={{ width: `${rolloutPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live Context Evaluation Sandbox */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[var(--klic-component-block-color-soft)] p-3.5 rounded-2xl border border-zinc-200/80 space-y-4">
            <div className="bg-white rounded-xl p-4 border border-zinc-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-zinc-900">실시간 SDK 컨텍스트 평가 시뮬레이터</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                  엣지 평가 0.2ms
                </span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-klic-muted mb-1">
                    테스트할 tenant_id 입력
                  </label>
                  <select
                    value={simTenant}
                    onChange={(e) => setSimTenant(e.target.value)}
                    className="w-full px-3 py-2 text-[12px] font-mono bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900"
                  >
                    <option value="tenant_toss_bank">tenant_toss_bank (화이트리스트 포함)</option>
                    <option value="tenant_samsung_sec">tenant_samsung_sec (화이트리스트 포함)</option>
                    <option value="tenant_anonymous_8841">tenant_anonymous_8841 (일반 롤아웃 대상)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-klic-muted mb-1">
                    리전 컨텍스트 (region)
                  </label>
                  <input data-klic-surface="field"
                    type="text"
                    value={simRegion}
                    onChange={(e) => setSimRegion(e.target.value)}
                    className="w-full px-3 py-1.5 text-[12px] font-mono bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-klic-muted">평가 결과</span>
                  <span className="text-[12px] font-mono font-bold text-blue-700">
                    {evalResult.variation}
                  </span>
                </div>
                <p className="text-[11px] text-klic-muted">{evalResult.reason}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-zinc-200/80 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-bold text-zinc-900">규칙 버전 v18 배포 준비 완료</p>
                <p className="text-[11px] text-klic-muted">전 세계 38개 Cloudflare Edge PoP에 즉시 전파</p>
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-klic-on-emphasis text-[12px] font-semibold shadow-xs cursor-pointer"
              >
                규칙 저장 및 배포
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Showcase Export
// ============================================================================
export function FormShowcaseBlock({
  initialMode = 'all-showcase',
  density = 'normal',
}: FormShowcaseBlockProps) {
  const [activeMode, setActiveMode] = useState<FormShowcaseMode>(initialMode);
  const [prevInitialMode, setPrevInitialMode] = useState<FormShowcaseMode>(initialMode);

  if (initialMode !== prevInitialMode) {
    setPrevInitialMode(initialMode);
    setActiveMode(initialMode);
  }

  const isCompact = density === 'compact';
  const currentTab = MODE_TABS.find((t) => t.id === activeMode) || MODE_TABS[0];

  return (
    <div className="w-full space-y-6">
      {/* Top Double-Bezel Mode Switcher */}
      <div className="bg-[var(--klic-component-block-color-soft)] p-1.5 rounded-[28px] border border-zinc-200/80">
        <div className="bg-white rounded-[22px] border border-zinc-200/90 shadow-[0_2px_12px_color-mix(in_srgb,var(--klic-component-block-color-text)_3%,transparent)] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  애플리케이션 · 폼 (7/9)
                </span>
                <span className="text-[12px] font-mono text-klic-muted">{currentTab.pkg}</span>
              </div>
              <h2 className="text-[18px] font-bold tracking-tight text-zinc-900 mt-1">
                {currentTab.label}
              </h2>
              <p className="text-[12px] text-klic-muted mt-0.5">{currentTab.desc}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-3.5">
            {MODE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeMode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveMode(tab.id)}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-blue-50/70 text-blue-700 border-blue-300 ring-4 ring-blue-50/45'
                      : 'bg-white text-klic-muted border-zinc-200/80 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      isSelected
                        ? 'bg-blue-600 text-klic-on-emphasis'
                        : 'bg-zinc-100 text-klic-muted'
                    }`}
                  >
                    {tab.badge === 'ALL' ? '전체' : tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Showcase Content */}
      {(activeMode === 'all-showcase' || activeMode === 'incident-report') && (
        <IncidentReportFormCard isCompact={isCompact} />
      )}
      {(activeMode === 'all-showcase' || activeMode === 'procurement-request') && (
        <ProcurementRequestFormCard isCompact={isCompact} />
      )}
      {(activeMode === 'all-showcase' || activeMode === 'webhook-endpoint') && (
        <WebhookEndpointFormCard isCompact={isCompact} />
      )}
      {(activeMode === 'all-showcase' || activeMode === 'database-connection') && (
        <DatabaseConnectionFormCard isCompact={isCompact} />
      )}
      {(activeMode === 'all-showcase' || activeMode === 'feature-flag-rule') && (
        <FeatureFlagTargetingFormCard isCompact={isCompact} />
      )}
    </div>
  );
}
export default FormShowcaseBlock;
