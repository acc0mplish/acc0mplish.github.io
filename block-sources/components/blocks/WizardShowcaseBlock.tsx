import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Server,
  FileSignature,
  ShieldCheck,
  CalendarClock,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  Cpu,
  HardDrive,
  Globe,
  Lock,
  Layers,
  Copy,
  Check,
  Terminal,
  AlertTriangle,
  Sliders,
  Send,
  RefreshCw,
  Building2,
  Activity,
  Database,
  Zap,
  FileText,
  Users,
  Network,
  Play,
  Award,
  BadgeCheck,
} from 'lucide-react';

export type WizardShowcaseMode =
  | 'all-showcase'
  | 'cloud-provisioning'
  | 'enterprise-contract'
  | 'rbac-role-builder'
  | 'report-scheduler'
  | 'sso-saml-setup';

interface WizardShowcaseBlockProps {
  initialMode?: WizardShowcaseMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

export const WizardShowcaseBlock: React.FC<WizardShowcaseBlockProps> = ({
  initialMode = 'all-showcase',
}) => {
  const [activeTab, setActiveTab] = useState<WizardShowcaseMode>(initialMode);

  useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode]);

  // ===========================================================================
  // 1. 클라우드 리소스 프로비저닝 위저드 (wizard-cloud-provisioning) 상태
  // ===========================================================================
  const [cloudStep, setCloudStep] = useState<1 | 2 | 3 | 4>(2);
  const [cloudProvider, setCloudProvider] = useState<'aws' | 'gcp' | 'ncp'>('aws');
  const [cloudRegion, setCloudRegion] = useState<'seoul' | 'tokyo' | 'frankfurt'>('seoul');
  const [instanceSpec, setInstanceSpec] = useState<'compute' | 'memory' | 'gpu'>('memory');
  const [nodeCount, setNodeCount] = useState<number>(6);
  const [storageTb, setStorageTb] = useState<number>(4);
  const [haMultiAz, setHaMultiAz] = useState<boolean>(true);
  const [kmsEncryption, setKmsEncryption] = useState<boolean>(true);
  const [committedDiscount, setCommittedDiscount] = useState<boolean>(true);
  const [codeTab, setCodeTab] = useState<'terraform' | 'helm' | 'dryrun'>('terraform');
  const [cloudDeploying, setCloudDeploying] = useState<boolean>(false);
  const [cloudDeployed, setCloudDeployed] = useState<boolean>(false);

  const specPricing = {
    compute: {
      name: 'c7i.4xlarge (고성능 연산형)',
      vcpu: 16,
      ram: 32,
      iops: '40,000 IOPS',
      network: '25 Gbps ENA',
      unitPriceKrw: 420000,
      badge: 'Core API & 마이크로서비스',
    },
    memory: {
      name: 'r7i.8xlarge (인메모리 원장 정산형)',
      vcpu: 32,
      ram: 256,
      iops: '80,000 NVMe IOPS',
      network: '50 Gbps ENA',
      unitPriceKrw: 890000,
      badge: '금융 원장 · 대규모 트랜잭션',
    },
    gpu: {
      name: 'g5.12xlarge (NVIDIA A10G x4 추론형)',
      vcpu: 48,
      ram: 192,
      iops: '120,000 NVMe IOPS',
      network: '100 Gbps EFA',
      unitPriceKrw: 2450000,
      badge: '실시간 FDS 이상탐지 · LLM 추론',
    },
  };

  const currentSpec = specPricing[instanceSpec];
  const baseComputeCost = currentSpec.unitPriceKrw * nodeCount;
  const storageCost = storageTb * 145000;
  const haCost = haMultiAz ? Math.round(baseComputeCost * 0.15) : 0;
  const subtotalCloudCost = baseComputeCost + storageCost + haCost;
  const discountAmount = committedDiscount ? Math.round(subtotalCloudCost * 0.28) : 0;
  const finalMonthlyCloudCost = subtotalCloudCost - discountAmount;

  const handleDeployCluster = () => {
    setCloudDeploying(true);
    setCodeTab('dryrun');
    setTimeout(() => {
      setCloudDeploying(false);
      setCloudDeployed(true);
      setCloudStep(4);
    }, 600);
  };

  // ===========================================================================
  // 2. 엔터프라이즈 요금제 & 전자계약 위저드 (wizard-enterprise-contract) 상태
  // ===========================================================================
  const [contractStep, setContractStep] = useState<1 | 2 | 3 | 4>(2);
  const [contractTier, setContractTier] = useState<'growth' | 'enterprise' | 'sovereign'>('enterprise');
  const [seatCount, setSeatCount] = useState<number>(250);
  const [billingCycle, setBillingCycle] = useState<'annual' | 'multiyear3'>('multiyear3');
  const [addonTam, setAddonTam] = useState<boolean>(true);
  const [addonDedicatedDb, setAddonDedicatedDb] = useState<boolean>(true);
  const [addonAuditVault, setAddonAuditVault] = useState<boolean>(false);
  const [contractSigned, setContractSigned] = useState<boolean>(false);
  const [signerName, setSignerName] = useState<string>('김현우 최고정보보호책임자 (CISO)');

  const tierSeatRate = {
    growth: { label: "비즈니스 성장", rate: 39000, sla: '99.9%', desc: '중견 스케일업 표준 워크스페이스' },
    enterprise: { label: "엔터프라이즈 코어", rate: 68000, sla: '99.99%', desc: 'SSO/SCIM · 감사로그 · 무제한 워크플로우' },
    sovereign: { label: "금융 전용", rate: 115000, sla: '99.999%', desc: '금융보안원 망분리 · 물리적 단독 VPC 클러스터' },
  };

  const rawSeatMonthly = seatCount * tierSeatRate[contractTier].rate;
  const cycleDiscountRate = billingCycle === 'multiyear3' ? 0.30 : 0.15;
  const volumeDiscountRate = seatCount >= 300 ? 0.08 : seatCount >= 150 ? 0.04 : 0;
  const totalDiscountRate = cycleDiscountRate + volumeDiscountRate;
  const discountedSeatMonthly = Math.round(rawSeatMonthly * (1 - totalDiscountRate));
  const addonMonthly =
    (addonTam ? 1800000 : 0) +
    (addonDedicatedDb ? 2400000 : 0) +
    (addonAuditVault ? 950000 : 0);
  const totalContractMonthly = discountedSeatMonthly + addonMonthly;
  const totalContractAnnual = totalContractMonthly * 12;
  const totalSavedAnnual = Math.round((rawSeatMonthly - discountedSeatMonthly) * 12);

  // ===========================================================================
  // 3. 세분화 권한(RBAC) 및 보안 정책 빌더 위저드 (wizard-rbac-role-builder) 상태
  // ===========================================================================
  const [rbacPreset, setRbacPreset] = useState<'auditor' | 'sre-lead' | 'fin-ops' | 'privacy-officer'>('fin-ops');
  const [requireVpn, setRequireVpn] = useState<boolean>(true);
  const [requireHardwareKey, setRequireHardwareKey] = useState<boolean>(true);
  const [blockNightAccess, setBlockNightAccess] = useState<boolean>(false);
  const [rbacSaved, setRbacSaved] = useState<boolean>(false);

  const [rbacMatrix, setRbacMatrix] = useState([
    { id: 'ledger', resource: '코어 정산 원장 (Settlement Ledger)', code: 'flux:ledger:*', read: true, write: true, approve: true, destroy: false },
    { id: 'pii', resource: '고객 민감정보 볼륨 (Encrypted PII)', code: 'flux:vault:pii', read: true, write: false, approve: false, destroy: false },
    { id: 'infra', resource: '프로덕션 쿠버네티스 클러스터', code: 'flux:k8s:prod', read: true, write: false, approve: false, destroy: false },
    { id: 'apikey', resource: '마스터 웹훅 & API 시크릿 키', code: 'flux:iam:secrets', read: true, write: true, approve: false, destroy: false },
    { id: 'audit', resource: '불변 보안 감사 로그 (WORM Audit)', code: 'flux:audit:logs', read: true, write: false, approve: true, destroy: false },
  ]);

  const applyRbacPreset = (preset: 'auditor' | 'sre-lead' | 'fin-ops' | 'privacy-officer') => {
    setRbacPreset(preset);
    setRbacSaved(false);
    if (preset === 'auditor') {
      setRbacMatrix((prev) => prev.map((r) => ({ ...r, read: true, write: false, approve: false, destroy: false })));
      setRequireVpn(true);
      setRequireHardwareKey(true);
    } else if (preset === 'sre-lead') {
      setRbacMatrix((prev) =>
        prev.map((r) => ({
          ...r,
          read: true,
          write: r.id === 'infra' || r.id === 'apikey',
          approve: r.id === 'infra',
          destroy: r.id === 'infra',
        }))
      );
    } else if (preset === 'fin-ops') {
      setRbacMatrix((prev) =>
        prev.map((r) => ({
          ...r,
          read: true,
          write: r.id === 'ledger' || r.id === 'apikey',
          approve: r.id === 'ledger' || r.id === 'audit',
          destroy: false,
        }))
      );
    } else {
      setRbacMatrix((prev) =>
        prev.map((r) => ({
          ...r,
          read: true,
          write: r.id === 'pii',
          approve: r.id === 'pii' || r.id === 'audit',
          destroy: r.id === 'pii',
        }))
      );
    }
  };

  const toggleMatrixCell = (id: string, field: 'read' | 'write' | 'approve' | 'destroy') => {
    setRbacSaved(false);
    setRbacMatrix((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: !row[field] } : row))
    );
  };

  const activePermissionCount = rbacMatrix.reduce(
    (acc, r) => acc + (r.read ? 1 : 0) + (r.write ? 2 : 0) + (r.approve ? 2 : 0) + (r.destroy ? 4 : 0),
    0
  );
  const securityDeduction = (requireVpn ? 12 : 0) + (requireHardwareKey ? 15 : 0) + (blockNightAccess ? 8 : 0);
  const riskScore = Math.max(8, Math.min(96, activePermissionCount * 3 - securityDeduction));

  // ===========================================================================
  // 4. 정기 리포트 빌더 & 자동 발송 스케줄러 위저드 (wizard-report-scheduler) 상태
  // ===========================================================================
  const [reportFreq, setReportFreq] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [reportFormat, setReportFormat] = useState<'pdf-exec' | 'xlsx-raw' | 'slack-digest'>('pdf-exec');
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([
    'arr-waterfall',
    'cohort-retention',
    'sla-uptime',
    'finops-burn',
  ]);
  const [reportDispatched, setReportDispatched] = useState<boolean>(false);

  const toggleWidget = (wId: string) => {
    setReportDispatched(false);
    setSelectedWidgets((prev) =>
      prev.includes(wId) ? prev.filter((x) => x !== wId) : [...prev, wId]
    );
  };

  // ===========================================================================
  // 5. 엔터프라이즈 SAML 2.0 SSO & SCIM 연동 위저드 (wizard-sso-saml-setup) 상태
  // ===========================================================================
  const [idpProvider, setIdpProvider] = useState<'okta' | 'entra' | 'google'>('okta');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [samlTestState, setSamlTestState] = useState<'idle' | 'testing' | 'verified'>('verified');
  const [scimAutoProvision, setScimAutoProvision] = useState<boolean>(true);
  const [enforceSsoOnly, setEnforceSsoOnly] = useState<boolean>(true);

  const copyText = (key: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const runSamlHandshakeTest = () => {
    setSamlTestState('testing');
    setTimeout(() => {
      setSamlTestState('verified');
    }, 500);
  };

  const showCloud = activeTab === 'all-showcase' || activeTab === 'cloud-provisioning';
  const showContract = activeTab === 'all-showcase' || activeTab === 'enterprise-contract';
  const showRbac = activeTab === 'all-showcase' || activeTab === 'rbac-role-builder';
  const showReport = activeTab === 'all-showcase' || activeTab === 'report-scheduler';
  const showSso = activeTab === 'all-showcase' || activeTab === 'sso-saml-setup';

  return (
    <div className="space-y-8">
      {/* 상단 서브모드 스위처 & 아키텍처 상태 바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  rounded-[16px] p-1.5">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'all-showcase', label: '전체 5종 위저드 쇼케이스', icon: Sparkles },
            { id: 'cloud-provisioning', label: '1. 클라우드 인프라 프로비저닝', icon: Server },
            { id: 'enterprise-contract', label: '2. 엔터프라이즈 견적 · 전자계약', icon: FileSignature },
            { id: 'rbac-role-builder', label: '3. 제로트러스트 RBAC 권한 빌더', icon: ShieldCheck },
            { id: 'report-scheduler', label: '4. 임원용 리포트 자동 스케줄러', icon: CalendarClock },
            { id: 'sso-saml-setup', label: '5. SAML 2.0 SSO · SCIM 연동', icon: KeyRound },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as WizardShowcaseMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[11px] text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white  text-zinc-900  shadow-[0_1px_3px_color-mix(in_srgb,var(--klic-component-block-color-text)_8%,transparent)]'
                    : 'text-klic-muted  hover:text-zinc-800 '
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-blue-600 " />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden xl:flex items-center gap-2 px-3 text-[11px] text-klic-muted  font-mono">
          <span>다단계 상태 엔진</span>
          <span aria-hidden="true">·</span>
          <span>FinOps 및 IAM 실시간 검증</span>
        </div>
      </div>

      {/* =====================================================================
          1. 멀티클라우드 인프라 프로비저닝 위저드 (wizard-cloud-provisioning)
      ===================================================================== */}
      {showCloud && (
        <section className="w-full rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
          {/* 상단 베젤 헤더 */}
          <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-600 " />
              <span className="text-[13.5px] font-semibold text-zinc-900 ">
                멀티클라우드 전용 VPC & 고가용성(Multi-AZ) 클러스터 프로비저닝 위저드
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[11px] text-klic-muted mr-2">예상 월간 청구액:</span>
                <span className="text-sm font-bold font-mono text-blue-600 ">
                  ₩{finalMonthlyCloudCost.toLocaleString()}/월
                </span>
              </div>
              <button
                type="button"
                onClick={handleDeployCluster}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-klic-on-emphasis text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{cloudDeployed ? '프로비저닝 재검증' : '클러스터 즉시 배포'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white  border border-zinc-200/80  rounded-[14px] overflow-hidden">
            {/* 인터랙티브 4단계 프로그레스 스텝퍼 (클린 라이트 서피스) */}
            <div className="px-6 py-4 bg-zinc-50/70  border-b border-zinc-200/80 ">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  { step: 1, title: '리전 & 금융망 VPC 분리', sub: `${cloudProvider.toUpperCase()} · ${cloudRegion === 'seoul' ? 'ap-northeast-2' : cloudRegion === 'tokyo' ? 'ap-northeast-1' : 'eu-central-1'}` },
                  { step: 2, title: '워커 노드 & 가속기 스펙', sub: `${currentSpec.name.split(' ')[0]} × ${nodeCount} Nodes` },
                  { step: 3, title: 'KMS 볼륨 암호화 & Multi-AZ', sub: `${storageTb}TB NVMe · ${haMultiAz ? '3-AZ 쿼럼' : 'Single-AZ'}` },
                  { step: 4, title: 'Terraform Dry-Run & 배포', sub: cloudDeployed ? '배포 승인 완료 (ACTIVE)' : '사전 정책 검증 통과' },
                ].map((s) => {
                  const isCurrent = cloudStep === s.step;
                  const isDone = cloudStep > s.step || cloudDeployed;
                  return (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => setCloudStep(s.step as 1 | 2 | 3 | 4)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-50/60  border-blue-500/80 ring-2 ring-blue-500/15 shadow-2xs'
                          : isDone
                          ? 'bg-white  border-zinc-200/90  hover:border-zinc-300'
                          : 'bg-white/70  border-zinc-200/60  hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                        <span className={isCurrent ? 'text-blue-600  font-bold' : isDone ? 'text-blue-600  font-semibold' : 'text-klic-muted'}>
                          단계 0{s.step}
                        </span>
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        )}
                      </div>
                      <div className="text-xs font-bold text-zinc-900  truncate">{s.title}</div>
                      <div className="text-[11px] font-mono text-klic-muted truncate mt-0.5">{s.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 본문 12컬럼 구성: 좌측(7컬럼 설정 & VPC 토폴로지) / 우측(5컬럼 실시간 리소스 텔레메트리 & Terraform HCL) */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* 좌측 설정 영역 */}
              <div className="lg:col-span-7 space-y-5">
                {/* STEP 1: 클라우드 벤더 & 리전 선택 + 라이브 VPC 토폴로지 다이어그램 */}
                <div className="p-4 rounded-2xl border border-zinc-200/80  bg-zinc-50/60  space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-600 " />
                      <span className="text-xs font-bold text-zinc-900 ">
                        1. 클라우드 프로바이더 & 물리 리전 토폴로지
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-zinc-200/70  p-0.5 rounded-lg">
                      {[
                        { id: 'aws', label: 'AWS EKS' },
                        { id: 'gcp', label: 'Google GKE' },
                        { id: 'ncp', label: 'Naver 금융존' },
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setCloudProvider(p.id as 'aws' | 'gcp' | 'ncp');
                            setCloudStep(1);
                          }}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                            cloudProvider === p.id
                              ? 'bg-white  text-zinc-900  shadow-xs'
                              : 'text-klic-muted hover:text-zinc-800 '
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'seoul', name: '서울 (ap-northeast-2)', rtt: '1.8ms', az: '3 AZs (a/b/c)', compliance: '금융보안원 ISMS-P 인증' },
                      { id: 'tokyo', name: '도쿄 DR (ap-northeast-1)', rtt: '31.4ms', az: '3 AZs (a/c/d)', compliance: 'SOC2 · 재해복구 미러링' },
                      { id: 'frankfurt', name: '프랑크푸르트 (eu-central-1)', rtt: '184.2ms', az: '3 AZs (a/b/c)', compliance: 'EU GDPR 데이터 주권 준수' },
                    ].map((reg) => {
                      const active = cloudRegion === reg.id;
                      return (
                        <button
                          key={reg.id}
                          type="button"
                          onClick={() => {
                            setCloudRegion(reg.id as 'seoul' | 'tokyo' | 'frankfurt');
                            setCloudStep(1);
                          }}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            active
                              ? 'border-blue-600 bg-white  shadow-xs ring-2 ring-blue-500/10'
                              : 'border-zinc-200  bg-white/60  hover:border-zinc-300'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-zinc-900  mb-1">
                            <span>{reg.name}</span>
                            <span className="font-mono text-[11px] text-blue-600 ">{reg.rtt}</span>
                          </div>
                          <div className="text-[11px] text-klic-muted  font-mono">
                            {reg.az} · {reg.compliance}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* SVG 멀티-AZ VPC 아키텍처 미니 다이어그램 (클린 라이트 서피스) */}
                  <div className="bg-white  rounded-xl p-3.5 border border-zinc-200/80 ">
                    <div className="flex items-center justify-between text-[11px] font-mono text-klic-muted mb-2">
                      <span>실시간 VPC 구성도 · CIDR 10.24.0.0/16 (망분리 비공개 서브넷)</span>
                      <span className="text-blue-600  font-semibold">{haMultiAz ? "다중 가용 영역 동시 활성 구성 (99.995%)" : "단일 가용 영역 표준 구성"}</span>
                    </div>
                    <svg viewBox="0 0 620 96" className="w-full h-24">
                      <defs>
                        <linearGradient id="vpcLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="var(--klic-component-block-color-accent)" />
                          <stop offset="100%" stopColor="var(--klic-component-block-color-accent)" />
                        </linearGradient>
                      </defs>
                      {/* 배경 그리드 */}
                      <rect x="2" y="4" width="616" height="88" rx="10" fill="var(--klic-component-block-color-panel)" stroke="var(--klic-component-block-color-soft)" strokeWidth="1" />
                      {/* 좌측: Enterprise Direct Connect / WAF */}
                      <rect x="16" y="22" width="115" height="52" rx="8" fill="var(--klic-component-block-color-panel)" stroke="var(--klic-component-block-color-accent)" strokeWidth="1.5" />
                      <text x="73" y="44" textAnchor="middle" fill="var(--klic-component-block-color-text)" fontSize="10" fontWeight="bold">AWS Shield / NLB</text>
                      <text x="73" y="60" textAnchor="middle" fill="var(--klic-component-block-color-accent)" fontSize="9" fontFamily="monospace">TLS 1.3 · mTLS</text>

                      {/* 연결선 */}
                      <path d="M 131 48 L 195 26" stroke="url(#vpcLineGrad)" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
                      <path d="M 131 48 L 195 48" stroke="url(#vpcLineGrad)" strokeWidth="1.5" fill="none" />
                      {haMultiAz && (
                        <path d="M 131 48 L 195 70" stroke="url(#vpcLineGrad)" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
                      )}

                      {/* 중앙: 3개 가용영역 워커 노드 풀 */}
                      <rect x="195" y="12" width="210" height="22" rx="5" fill="var(--klic-component-block-color-panel)" stroke="var(--klic-component-block-color-border)" />
                      <circle cx="208" cy="23" r="3.5" fill="var(--klic-component-block-color-accent)" />
                      <text x="220" y="26" fill="var(--klic-component-block-color-text)" fontSize="9.5" fontFamily="monospace">
                        AZ-a · 프라이빗 서브넷 ({Math.ceil(nodeCount / (haMultiAz ? 3 : 1))} 개 노드)
                      </text>

                      <rect x="195" y="37" width="210" height="22" rx="5" fill="var(--klic-component-block-color-soft)" stroke="var(--klic-component-block-color-accent)" />
                      <circle cx="208" cy="48" r="3.5" fill="var(--klic-component-block-color-accent)" />
                      <text x="220" y="51" fill="var(--klic-component-block-color-accent)" fontSize="9.5" fontFamily="monospace">
                        AZ-b · 코어 워커 풀 ({Math.floor(nodeCount / (haMultiAz ? 3 : 1))} 개 노드)
                      </text>

                      <rect x="195" y="62" width="210" height="22" rx="5" fill="var(--klic-component-block-color-panel)" stroke="var(--klic-component-block-color-border)" opacity={haMultiAz ? 1 : 0.45} />
                      <circle cx="208" cy="73" r="3.5" fill={haMultiAz ? 'var(--klic-component-block-color-accent)' : 'var(--klic-component-block-color-control-border)'} />
                      <text x="220" y="76" fill="var(--klic-component-block-color-text)" fontSize="9.5" fontFamily="monospace">
                        {haMultiAz ? `AZ-c · 쿼럼 스탠바이 (${Math.max(1, nodeCount - Math.ceil(nodeCount / 3) - Math.floor(nodeCount / 3))} Nodes)` : 'AZ-c · 비활성 (Single-AZ 모드)'}
                      </text>

                      {/* 우측 연결선 -> KMS Encrypted NVMe */}
                      <path d="M 405 48 L 462 48" stroke="var(--klic-component-block-color-accent)" strokeWidth="1.5" fill="none" />
                      <rect x="462" y="18" width="140" height="60" rx="8" fill="var(--klic-component-block-color-panel)" stroke={kmsEncryption ? 'var(--klic-component-block-color-accent)' : 'var(--klic-component-block-color-border)'} strokeWidth="1.5" />
                      <text x="532" y="39" textAnchor="middle" fill="var(--klic-component-block-color-text)" fontSize="10" fontWeight="bold">
                        NVMe Ceph 스토리지
                      </text>
                      <text x="532" y="54" textAnchor="middle" fill="var(--klic-component-block-color-accent)" fontSize="9.5" fontFamily="monospace">
                        {storageTb} TB · {currentSpec.iops}
                      </text>
                      <text x="532" y="68" textAnchor="middle" fill="var(--klic-component-block-color-accent)" fontSize="8.5" fontFamily="monospace">
                        {kmsEncryption ? 'AES-256 HSM 봉투암호화' : '기본 볼륨 암호화'}
                      </text>
                    </svg>
                  </div>
                </div>

                {/* STEP 2 & 3: 인스턴스 패밀리 선택 + 노드 수/스토리지 슬라이더 */}
                <div className="p-4 rounded-2xl border border-zinc-200/80  bg-white  space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900  flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-blue-600 " />
                      <span>2. 워크로드별 워커 노드 스펙 & 오토스케일링 볼륨</span>
                    </span>
                    <span className="text-[11px] font-mono text-klic-muted">
                      총 {currentSpec.vcpu * nodeCount} vCPU · {currentSpec.ram * nodeCount} GB DDR5 ECC
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {(Object.keys(specPricing) as Array<'compute' | 'memory' | 'gpu'>).map((key) => {
                      const item = specPricing[key];
                      const selected = instanceSpec === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setInstanceSpec(key);
                            setCloudStep(2);
                          }}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            selected
                              ? 'border-blue-600 bg-blue-50/40  ring-2 ring-blue-500/10'
                              : 'border-zinc-200  hover:border-zinc-300'
                          }`}
                        >
                          <div className="text-[10px] font-mono text-blue-600  font-semibold mb-1">
                            {item.badge}
                          </div>
                          <div className="text-xs font-bold text-zinc-900  mb-1">
                            {item.name}
                          </div>
                          <div className="text-[11px] font-mono text-klic-muted ">
                            {item.vcpu} vCPU · {item.ram}GB RAM
                          </div>
                          <div className="mt-2 pt-2 border-t border-zinc-200/70  flex items-center justify-between text-[11px] font-mono">
                            <span className="text-klic-muted">{item.network}</span>
                            <span className="font-bold text-zinc-900 ">
                              ₩{(item.unitPriceKrw / 10000).toFixed(0)}만/대
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* 노드 수 & 스토리지 슬라이더 컨트롤 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-3 rounded-xl bg-zinc-50  border border-zinc-200/70 ">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold text-zinc-700 ">워커 노드 레플리카 수</span>
                        <span className="font-mono font-bold text-blue-600 ">{nodeCount} Nodes (HA 분산)</span>
                      </div>
                      <input
                        type="range"
                        min={3}
                        max={24}
                        step={3}
                        value={nodeCount}
                        onChange={(e) => {
                          setNodeCount(Number(e.target.value));
                          setCloudStep(2);
                        }}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-klic-muted mt-1">
                        <span>최소 3대 (3-AZ 쿼럼)</span>
                        <span>12대 (권장)</span>
                        <span>최대 24대</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-50  border border-zinc-200/70 ">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold text-zinc-700 ">영구 블록 스토리지 (CSI NVMe)</span>
                        <span className="font-mono font-bold text-blue-600 ">{storageTb} TB (삼중 복제)</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={16}
                        step={1}
                        value={storageTb}
                        onChange={(e) => {
                          setStorageTb(Number(e.target.value));
                          setCloudStep(3);
                        }}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-klic-muted mt-1">
                        <span>1 TB</span>
                        <span>8 TB</span>
                        <span>16 TB</span>
                      </div>
                    </div>
                  </div>

                  {/* 고가용성 / KMS / 1년 약정 토글 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {[
                      {
                        label: 'Multi-AZ 3중 가용영역 분산',
                        sub: '단일 데이터센터 정전 시 무중단 페일오버',
                        active: haMultiAz,
                        toggle: () => {
                          setHaMultiAz(!haMultiAz);
                          setCloudStep(3);
                        },
                      },
                      {
                        label: '고객 관리형 HSM KMS 암호화',
                        sub: 'FIPS 140-3 Level 3 키 자동 순환',
                        active: kmsEncryption,
                        toggle: () => {
                          setKmsEncryption(!kmsEncryption);
                          setCloudStep(3);
                        },
                      },
                      {
                        label: '1년 약정 FinOps 절감 플랜',
                        sub: '온디맨드 대비 28% 즉시 요금 할인',
                        active: committedDiscount,
                        toggle: () => setCommittedDiscount(!committedDiscount),
                      },
                    ].map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={opt.toggle}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${
                          opt.active
                            ? 'border-blue-500/70 bg-blue-50/30 '
                            : 'border-zinc-200  opacity-75'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-zinc-900 ">{opt.label}</div>
                          <div className="text-[11px] text-klic-muted  mt-0.5">{opt.sub}</div>
                        </div>
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            opt.active ? 'text-blue-600 ' : 'text-klic-muted '
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 우측: 실시간 하드웨어 용량 게이지 + Terraform HCL 코드 + FinOps 영수증 */}
              <div className="lg:col-span-5 space-y-4">
                {/* 실시간 프로비저닝 스펙 & IaC 코드 뷰어 (클린 라이트 서피스) */}
                <div className="rounded-2xl bg-zinc-50/80  border border-zinc-200/80  overflow-hidden shadow-2xs">
                  <div className="px-4 py-3 border-b border-zinc-200/80  flex items-center justify-between bg-white ">
                    <div className="flex items-center gap-1.5">
                      {[
                        { id: 'terraform', label: 'main.tf (Terraform)' },
                        { id: 'helm', label: 'values.yaml (Helm)' },
                        { id: 'dryrun', label: 'Dry-Run 검증 로그' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setCodeTab(t.id as 'terraform' | 'helm' | 'dryrun')}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                            codeTab === t.id
                              ? 'bg-blue-50  text-blue-700  font-bold border border-blue-200/80 '
                              : 'text-klic-muted hover:text-zinc-900 '
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-blue-600  font-semibold">인프라 코드 검증 완료</span>
                  </div>

                  {/* 코드/로그 뷰어 */}
                  <div className="p-4 font-mono text-xs leading-relaxed text-zinc-700  bg-zinc-50/70  max-h-[250px] overflow-y-auto">
                    {codeTab === 'terraform' && (
                      <pre className="whitespace-pre-wrap text-[11px]">
{`module "flux_sovereign_eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = "flux-prod-${cloudRegion}-v4"
  cluster_version = "1.30"
  vpc_id          = module.vpc_isolated.vpc_id
  subnet_ids      = ${haMultiAz ? '["subnet-aza", "subnet-azb", "subnet-azc"]' : '["subnet-aza"]'}

  eks_managed_node_groups = {
    core_pool = {
      instance_types = ["${currentSpec.name.split(' ')[0]}"]
      min_size       = ${nodeCount}
      max_size       = ${nodeCount * 2}
      desired_size   = ${nodeCount}
      disk_size_gb   = ${Math.round((storageTb * 1024) / nodeCount)}
      kms_key_arn    = "${kmsEncryption ? 'arn:aws:kms:ap-northeast-2:9941:key/hsm-fips-01' : 'default'}"
    }
  }
}`}
                      </pre>
                    )}

                    {codeTab === 'helm' && (
                      <pre className="whitespace-pre-wrap text-[11px]">
{`global:
  provider: "${cloudProvider}"
  region: "${cloudRegion}"
  highAvailability: ${haMultiAz}
resources:
  totalVcpu: ${currentSpec.vcpu * nodeCount}
  totalMemoryGb: ${currentSpec.ram * nodeCount}
  storageClass: "flux-nvme-kms-sc"
security:
  fips140_3: ${kmsEncryption}
  networkPolicy: "calico-zero-trust-strict"`}
                      </pre>
                    )}

                    {codeTab === 'dryrun' && (
                      <div className="space-y-1.5 text-[11px]">
                        <div className="text-blue-700  font-semibold">[통과] VPC 비공개 서브넷 CIDR 10.24.0.0/16 대역 충돌 없음</div>
                        <div className="text-blue-700  font-semibold">[통과] IAM 역할 및 OIDC 공급자 신뢰 관계 검증 완료</div>
                        <div className="text-blue-700  font-semibold">[통과] {currentSpec.name} 스팟/온디맨드 가용 쿼터 확보 ({nodeCount}대)</div>
                        <div className="text-blue-700  font-semibold">[통과] 금융보안원 KMS HSM 봉투 암호화 키 연결 완료</div>
                        <div className="text-blue-600  font-semibold pt-1">
                          {cloudDeploying
                            ? '>>> 쿠버네티스 컨트롤 플레인 프로비저닝 실행 중...'
                            : '>>> Plan: 18 to add, 0 to change, 0 to destroy. 즉시 배포 가능 상태.'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 하단 하드웨어 리소스 게이지 바 */}
                  <div className="px-4 py-3 bg-white  border-t border-zinc-200/80  grid grid-cols-3 gap-3 text-[11px] font-mono">
                    <div>
                      <div className="text-klic-muted">총 연산 코어</div>
                      <div className="text-zinc-900  font-bold">{currentSpec.vcpu * nodeCount} vCPU</div>
                    </div>
                    <div>
                      <div className="text-klic-muted">총 시스템 메모리</div>
                      <div className="text-zinc-900  font-bold">{currentSpec.ram * nodeCount} GB</div>
                    </div>
                    <div>
                      <div className="text-klic-muted">스토리지 대역폭</div>
                      <div className="text-blue-600  font-bold">{currentSpec.iops}</div>
                    </div>
                  </div>
                </div>

                {/* FinOps 월간 비용 명세서 카드 */}
                <div className="p-4 rounded-2xl border border-zinc-200  bg-zinc-50/70  space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 ">
                      FinOps 월간 청구 명세서 (예상치)
                    </span>
                    <span className="text-[11px] font-mono text-blue-600  font-semibold">
                      {committedDiscount ? '1년 약정 -28% 할인 적용됨' : '온디맨드 표준 요율'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-klic-muted ">
                      <span>워커 노드 ({currentSpec.name.split(' ')[0]} × {nodeCount}대)</span>
                      <span>₩{baseComputeCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-klic-muted ">
                      <span>CSI NVMe 블록 스토리지 ({storageTb} TB)</span>
                      <span>₩{storageCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-klic-muted ">
                      <span>Multi-AZ 크로스존 트래픽 & NLB</span>
                      <span>₩{haCost.toLocaleString()}</span>
                    </div>
                    {committedDiscount && (
                      <div className="flex justify-between text-blue-600  font-semibold">
                        <span>약정 할인 (Committed Use -28%)</span>
                        <span>-₩{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-zinc-200  flex items-baseline justify-between">
                      <span className="font-sans font-bold text-zinc-900 ">최종 월간 청구 예상액</span>
                      <span className="text-base font-bold text-blue-600 ">
                        ₩{finalMonthlyCloudCost.toLocaleString()}/월
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          2. 엔터프라이즈 플랜 견적 & 전자계약 위저드 (wizard-enterprise-contract)
      ===================================================================== */}
      {showContract && (
        <section className="bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  rounded-[24px] p-2 shadow-[0_4px_24px_color-mix(in_srgb,var(--klic-component-block-color-text)_3%,transparent)]">
          <div className="bg-white  border border-zinc-200/70  rounded-[18px] p-6">
            {/* 상단 헤더 */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-zinc-200/80 ">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-blue-600  mb-1">
                  <span>설정 마법사 02</span>
                  <span aria-hidden="true">·</span>
                  <span>엔터프라이즈 계약 관리 및 MSA 전자서명</span>
                </div>
                <h3 className="text-lg font-bold tracking-tight text-zinc-900 ">
                  엔터프라이즈 볼륨 라이선스 견적 산출 & 마스터 전자계약(MSA) 체결 위저드
                </h3>
              </div>

              {/* 4단계 진행 탭 */}
              <div className="flex items-center gap-1.5 bg-zinc-100  p-1 rounded-xl">
                {[
                  { id: 1, label: '1. 에디션 선택' },
                  { id: 2, label: '2. 좌석·약정 산정' },
                  { id: 3, label: '3. 애드온 특약' },
                  { id: 4, label: '4. 전자서명·PO 발행' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setContractStep(st.id as 1 | 2 | 3 | 4)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      contractStep === st.id
                        ? 'bg-klic-inverse  text-klic-on-emphasis shadow-xs'
                        : 'text-klic-muted hover:text-zinc-900 '
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* 좌측 7컬럼: 라이선스 티어, 좌석 슬라이더, 할인 워터폴 */}
              <div className="lg:col-span-7 space-y-5">
                {/* 3대 티어 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(Object.keys(tierSeatRate) as Array<'growth' | 'enterprise' | 'sovereign'>).map((tKey) => {
                    const tier = tierSeatRate[tKey];
                    const isSelected = contractTier === tKey;
                    return (
                      <button
                        key={tKey}
                        type="button"
                        onClick={() => {
                          setContractTier(tKey);
                          setContractStep(1);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/45  border-blue-500/80 ring-2 ring-blue-500/15 shadow-xs'
                            : 'bg-zinc-50/70  border-zinc-200  hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                          <span className={isSelected ? 'text-blue-600  font-bold' : 'text-klic-muted'}>
                            SLA {tier.sla}
                          </span>
                          {isSelected && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                        </div>
                        <div className="text-sm font-bold text-zinc-900 ">
                          {tier.label}
                        </div>
                        <div className="text-[11px] mt-1 leading-snug text-klic-muted">
                          {tier.desc}
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-zinc-200/70  flex items-baseline gap-1 font-mono">
                          <span className={`text-base font-bold ${isSelected ? 'text-blue-600 ' : 'text-zinc-900 '}`}>
                            ₩{tier.rate.toLocaleString()}
                          </span>
                          <span className="text-[11px] text-klic-muted">/석·월</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* 좌석 수 슬라이더 & 약정 주기 */}
                <div className="p-4 rounded-2xl border border-zinc-200  bg-zinc-50/60  space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-zinc-900 ">
                        임직원 라이선스 좌석(Seat) 볼륨 및 약정 기간
                      </div>
                      <div className="text-[11px] text-klic-muted">
                        150석 이상 +4% 볼륨 할인 · 300석 이상 +8% 볼륨 자동 우대 적용
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-zinc-200/70  p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setBillingCycle('annual');
                          setContractStep(2);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                          billingCycle === 'annual'
                            ? 'bg-white  text-zinc-900  shadow-xs'
                            : 'text-klic-muted'
                        }`}
                      >
                        1년 연간 약정 (-15%)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBillingCycle('multiyear3');
                          setContractStep(2);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                          billingCycle === 'multiyear3'
                            ? 'bg-blue-600 text-klic-on-emphasis shadow-xs'
                            : 'text-klic-muted'
                        }`}
                      >
                        3년 마스터 계약 (-30% 특가)
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono text-klic-muted">활성 SSO 사용자 수</span>
                      <span className="font-mono text-sm font-bold text-blue-600 ">
                        {seatCount}명 · 총 {(totalDiscountRate * 100).toFixed(0)}% 우대 할인율 적용
                      </span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={1000}
                      step={25}
                      value={seatCount}
                      onChange={(e) => {
                        setSeatCount(Number(e.target.value));
                        setContractStep(2);
                      }}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-klic-muted mt-1">
                      <span>50석</span>
                      <span>250석 (중견기업 평균)</span>
                      <span>500석 (볼륨 우대)</span>
                      <span>1,000석 (그룹사 통합)</span>
                    </div>
                  </div>
                </div>

                {/* 엔터프라이즈 특약 애드온 체크 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {[
                    {
                      title: '전담 TAM 엔지니어 배정',
                      price: '+₩1,800,000/월',
                      desc: '24/7 핫라인 · 분기별 아키텍처 리뷰',
                      active: addonTam,
                      toggle: () => {
                        setAddonTam(!addonTam);
                        setContractStep(3);
                      },
                    },
                    {
                      title: 'Dedicated 물리 격리 DB',
                      price: '+₩2,400,000/월',
                      desc: '단독 RDS Aurora 클러스터 · 전용 KMS',
                      active: addonDedicatedDb,
                      toggle: () => {
                        setAddonDedicatedDb(!addonDedicatedDb);
                        setContractStep(3);
                      },
                    },
                    {
                      title: '10년 장기 WORM 감사 볼륨',
                      price: '+₩950,000/월',
                      desc: '전자금융감독규정 준수 불변 로그 보관',
                      active: addonAuditVault,
                      toggle: () => {
                        setAddonAuditVault(!addonAuditVault);
                        setContractStep(3);
                      },
                    },
                  ].map((addon, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={addon.toggle}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        addon.active
                          ? 'border-blue-600 bg-blue-50/40 '
                          : 'border-zinc-200  hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-900 ">
                        <span>{addon.title}</span>
                        <CheckCircle2 className={`w-4 h-4 ${addon.active ? 'text-blue-600 ' : 'text-klic-muted'}`} />
                      </div>
                      <div className="text-[11px] text-klic-muted mt-1">{addon.desc}</div>
                      <div className="text-[11px] font-mono font-semibold text-blue-600  mt-2">
                        {addon.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 우측 5컬럼: 엔터프라이즈 공식 견적서(PO) & 전자서명 날인 문서 프리뷰 */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-zinc-200  bg-[var(--klic-component-block-color-panel)]  p-5 space-y-4 shadow-md">
                  <div className="flex items-start justify-between border-b border-zinc-200  pb-3">
                    <div>
                      <div className="text-[10px] font-mono text-klic-muted">정식 기본 서비스 계약 견적서</div>
                      <div className="text-sm font-bold text-zinc-900  mt-0.5">
                        견적 번호: QT-2026-0428-FIN
                      </div>
                      <div className="text-[11px] text-klic-muted">
                        수신: 주식회사 토스뱅크 코어뱅킹본부 귀중
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-[10px] text-blue-600  font-bold">
                        연간 ₩{totalSavedAnnual.toLocaleString()} 절감
                      </div>
                      <div className="text-[11px] text-klic-muted">유효기간: 2026.05.31</div>
                    </div>
                  </div>

                  {/* 견적 테이블 */}
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-klic-muted ">
                      <span>{tierSeatRate[contractTier].label} ({seatCount}석 표준가)</span>
                      <span className="line-through">₩{rawSeatMonthly.toLocaleString()}/월</span>
                    </div>
                    <div className="flex justify-between text-blue-600  font-semibold">
                      <span>우대 할인 ({(totalDiscountRate * 100).toFixed(0)}% · 약정+볼륨)</span>
                      <span>-₩{(rawSeatMonthly - discountedSeatMonthly).toLocaleString()}/월</span>
                    </div>
                    <div className="flex justify-between text-zinc-700 ">
                      <span>엔터프라이즈 특약 애드온 합계</span>
                      <span>₩{addonMonthly.toLocaleString()}/월</span>
                    </div>

                    <div className="pt-2.5 border-t border-zinc-200  flex items-baseline justify-between">
                      <span className="font-sans font-bold text-zinc-900 ">월 환산 공급가액</span>
                      <span className="text-base font-bold text-zinc-900 ">
                        ₩{totalContractMonthly.toLocaleString()}/월
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="font-sans font-bold text-blue-600 ">
                        연간 총 계약 금액 (VAT 별도)
                      </span>
                      <span className="text-lg font-bold text-blue-600 ">
                        ₩{totalContractAnnual.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* 전자서명 날인 패드 */}
                  <div className="p-3.5 rounded-xl bg-white  border border-zinc-200  space-y-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-zinc-700 ">권한 위임자 전자서명 (eIDAS / 전자서명법 준수)</span>
                      <span className="font-mono text-klic-muted">SHA-256 타임스탬프</span>
                    </div>
                    <input
                      type="text"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-zinc-200  bg-zinc-50  text-xs font-medium text-zinc-900 "
                    />
                    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-dashed border-zinc-300  bg-zinc-50/50 ">
                      <div>
                        <div className="text-[10px] font-mono text-klic-muted">권한 있는 담당자의 전자서명</div>
                        <div className="text-sm font-serif italic font-bold text-zinc-800 ">
                          {signerName}
                        </div>
                      </div>
                      <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center text-[10px] font-bold leading-tight text-center ${
                        contractSigned
                          ? 'border-blue-600 text-blue-600 bg-blue-50/60  rotate-[-8deg]'
                          : 'border-zinc-300 text-klic-muted'
                      }`}>
                        {contractSigned ? '법인직인\n승인필' : '서명대기'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setContractSigned(true);
                      setContractStep(4);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <FileSignature className="w-4 h-4" />
                    <span>
                      {contractSigned
                        ? '전자계약 체결 및 발주서(PO #2026-8841) 발행 완료'
                        : '마스터 서비스 계약(MSA) 전자서명 날인 및 PO 즉시 발행'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          3. 세분화 권한(RBAC) 및 보안 정책 빌더 위저드 (wizard-rbac-role-builder)
      ===================================================================== */}
      {showRbac && (
        <section className="bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  rounded-[24px] p-2 shadow-[0_4px_24px_color-mix(in_srgb,var(--klic-component-block-color-text)_3%,transparent)]">
          <div className="bg-white  border border-zinc-200/70  rounded-[18px] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-zinc-200/80 ">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-blue-600  mb-1">
                  <span>설정 마법사 03</span>
                  <span aria-hidden="true">·</span>
                  <span>제로 트러스트 IAM 정책 및 영향 범위 분석</span>
                </div>
                <h3 className="text-lg font-bold tracking-tight text-zinc-900 ">
                  세분화 리소스 권한(RBAC) 매트릭스 설계 및 보안 반경(Blast Radius) 검증 위저드
                </h3>
              </div>

              {/* 직무 프리셋 버튼 */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'fin-ops', label: '재무 정산 책임자 (FinOps)' },
                  { id: 'auditor', label: '외부 감사관 (Read-Only)' },
                  { id: 'sre-lead', label: '클라우드 SRE 총괄' },
                  { id: 'privacy-officer', label: '개인정보 보호책임자 (CPO)' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyRbacPreset(p.id as 'auditor' | 'sre-lead' | 'fin-ops' | 'privacy-officer')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      rbacPreset === p.id
                        ? 'bg-klic-inverse  text-klic-on-emphasis border-zinc-900 '
                        : 'bg-zinc-50  text-klic-muted  border-zinc-200  hover:border-zinc-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* 좌측 7컬럼: 리소스 × 액션 CRUD 매트릭스 + 조건부 접근 제어 */}
              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-2xl border border-zinc-200  overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50  border-b border-zinc-200  text-[11px] font-mono text-klic-muted">
                        <th className="py-3 px-4">보호 대상 리소스 (ARN Scope)</th>
                        <th className="py-3 px-3 text-center">조회(Read)</th>
                        <th className="py-3 px-3 text-center">생성/수정</th>
                        <th className="py-3 px-3 text-center">결재승인</th>
                        <th className="py-3 px-3 text-center text-blue-600 ">영구파기</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200/70  text-xs">
                      {rbacMatrix.map((row) => (
                        <tr key={row.id} className="hover:bg-zinc-50/70 ">
                          <td className="py-3 px-4">
                            <div className="font-bold text-zinc-900 ">{row.resource}</div>
                            <div className="text-[11px] font-mono text-klic-muted">{row.code}</div>
                          </td>
                          {(['read', 'write', 'approve', 'destroy'] as const).map((perm) => {
                            const active = row[perm];
                            const isDanger = perm === 'destroy' && active;
                            return (
                              <td key={perm} className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => toggleMatrixCell(row.id, perm)}
                                  className={`w-7 h-7 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center ${
                                    isDanger
                                      ? 'bg-blue-600 text-klic-on-emphasis shadow-sm shadow-blue-500/30'
                                      : active
                                      ? 'bg-blue-600 text-klic-on-emphasis'
                                      : 'bg-zinc-100  text-klic-muted hover:bg-zinc-200'
                                  }`}
                                >
                                  {active ? '✓' : '—'}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 조건부 컨텍스트 가드레일 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      title: '사내 금융망 VPN IP 제한',
                      desc: '10.24.0.0/16 대역 외 접근 즉시 차단',
                      active: requireVpn,
                      toggle: () => setRequireVpn(!requireVpn),
                    },
                    {
                      title: 'FIDO2 생체 보안키 강제',
                      desc: 'YubiKey / Passkey 물리 인증 필수',
                      active: requireHardwareKey,
                      toggle: () => setRequireHardwareKey(!requireHardwareKey),
                    },
                    {
                      title: '심야 시간대(22~06시) 동결',
                      desc: '비업무 시간 원장 조회 자동 잠금',
                      active: blockNightAccess,
                      toggle: () => setBlockNightAccess(!blockNightAccess),
                    },
                  ].map((guard, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={guard.toggle}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        guard.active
                          ? 'border-blue-500/70 bg-blue-50/30 '
                          : 'border-zinc-200 '
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-900 ">
                        <span>{guard.title}</span>
                        <Lock className={`w-3.5 h-3.5 ${guard.active ? 'text-blue-600 ' : 'text-klic-muted'}`} />
                      </div>
                      <div className="text-[11px] text-klic-muted mt-1">{guard.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 우측 5컬럼: Blast-Radius 리스크 스코어 게이지 & 실시간 IAM JSON 정책 (클린 라이트 서피스) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl bg-zinc-50/80  p-5 border border-zinc-200/80  space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-blue-600  font-bold">제로 트러스트 위험 평가</div>
                      <div className="text-sm font-bold text-zinc-900  mt-0.5">권한 오남용 반경(Blast Radius) 스코어</div>
                    </div>
                    <div className={`text-2xl font-mono font-bold ${
                      riskScore >= 55 ? 'text-blue-600' : riskScore >= 30 ? 'text-amber-600' : 'text-blue-600'
                    }`}>
                      {riskScore} <span className="text-xs font-normal text-klic-muted">/ 100</span>
                    </div>
                  </div>

                  {/* 리스크 프로그레스 바 */}
                  <div className="w-full h-2.5 bg-zinc-200/80  rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        riskScore >= 55 ? 'bg-blue-500' : riskScore >= 30 ? 'bg-amber-400' : 'bg-blue-500'
                      }`}
                      style={{ width: `${riskScore}%` }}
                    />
                  </div>

                  {/* 라이브 IAM JSON 폴리시 */}
                  <div className="bg-white  rounded-xl p-3.5 border border-zinc-200/80  font-mono text-[11px] text-zinc-700  max-h-[195px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap">
{`{
  "Version": "2026-04-01",
  "RoleName": "flux-role-${rbacPreset}",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ${JSON.stringify(
        rbacMatrix
          .filter((r) => r.read || r.write || r.approve || r.destroy)
          .map((r) => `${r.code}:${[r.read && 'Read', r.write && 'Write', r.approve && 'Approve', r.destroy && 'Destroy'].filter(Boolean).join('|')}`),
        null,
        2
      )},
      "Condition": {
        "Bool": { "flux:HardwareMfa": "${requireHardwareKey}" },
        "IpAddress": { "flux:SourceIp": "${requireVpn ? '10.24.0.0/16' : '0.0.0.0/0'}" }
      }
    }
  ]
}`}
                    </pre>
                  </div>

                  <button
                    type="button"
                    onClick={() => setRbacSaved(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-klic-on-emphasis text-xs font-bold transition-all cursor-pointer"
                  >
                    {rbacSaved ? '✓ IAM 보안 정책 배포 및 감사로그 기록 완료' : '신규 RBAC 역할 정책 배포 및 서명'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          4. 정기 경영 리포트 빌더 & 자동 발송 위저드 (wizard-report-scheduler)
      ===================================================================== */}
      {showReport && (
        <section className="bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  rounded-[24px] p-2 shadow-[0_4px_24px_color-mix(in_srgb,var(--klic-component-block-color-text)_3%,transparent)]">
          <div className="bg-white  border border-zinc-200/70  rounded-[18px] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-zinc-200/80 ">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-blue-600  mb-1">
                  <span>설정 마법사 04</span>
                  <span aria-hidden="true">·</span>
                  <span>경영진 BI 보고서 작성 및 정기 발송</span>
                </div>
                <h3 className="text-lg font-bold tracking-tight text-zinc-900 ">
                  이사회(BoD) 경영 리포트 캔버스 조립 및 Cron 정기 자동 발송 위저드
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setReportFreq(freq)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      reportFreq === freq
                        ? 'bg-klic-inverse  text-klic-on-emphasis border-zinc-900'
                        : 'bg-zinc-50  text-klic-muted  border-zinc-200 '
                    }`}
                  >
                    {freq === 'daily' ? '일간 (08:00 KST)' : freq === 'weekly' ? '주간 (월요일 08:30)' : '월간 (매월 1일 07:00)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* 좌측 6컬럼: 리포트 섹션 위젯 빌더 & Cron 발송 채널 */}
              <div className="lg:col-span-6 space-y-4">
                <div className="text-xs font-bold text-zinc-900 ">
                  1. 리포트 포함 데이터 모듈 선택 (클릭 시 우측 PDF 프리뷰 실시간 반영)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'arr-waterfall', title: '순매출(Net ARR) 증감 워터폴', metric: '₩14.8B (+18.4% YoY)' },
                    { id: 'cohort-retention', title: '엔터프라이즈 NRR 잔존율 코호트', metric: 'NRR 134.2% 유지' },
                    { id: 'sla-uptime', title: '코어뱅킹 가용성 & 장애 MTTR', metric: '99.998% 무중단' },
                    { id: 'finops-burn', title: '클라우드 인프라 원가율(COGS)', metric: '매출 대비 11.2% (-2.1%p)' },
                  ].map((w) => {
                    const active = selectedWidgets.includes(w.id);
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => toggleWidget(w.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          active
                            ? 'border-blue-600 bg-blue-50/40 '
                            : 'border-zinc-200  opacity-65'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-zinc-900 ">
                          <span>{w.title}</span>
                          <CheckCircle2 className={`w-4 h-4 ${active ? 'text-blue-600 ' : 'text-klic-muted'}`} />
                        </div>
                        <div className="text-[11px] font-mono text-blue-600  mt-1">
                          {w.metric}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Cron 스케줄 및 수신자 설정 */}
                <div className="p-4 rounded-2xl border border-zinc-200  bg-zinc-50/70  space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-900 ">2. Cron 표현식 & 배포 파이프라인</span>
                    <span className="font-mono text-blue-600  font-bold">
                      {reportFreq === 'daily' ? '0 8 * * *' : reportFreq === 'weekly' ? '30 8 * * 1' : '0 7 1 * *'} (Asia/Seoul)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'pdf-exec', label: 'A4 경영진 요약 PDF (암호화)' },
                      { id: 'xlsx-raw', label: '재무 원장 Raw XLSX 시트' },
                      { id: 'slack-digest', label: 'Slack #exec-board 웹훅 카드' },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setReportFormat(fmt.id as 'pdf-exec' | 'xlsx-raw' | 'slack-digest')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                          reportFormat === fmt.id
                            ? 'bg-klic-inverse  text-klic-on-emphasis  border-zinc-900'
                            : 'bg-white  text-klic-muted  border-zinc-200 '
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-zinc-200/80  flex items-center justify-between">
                    <div className="text-[11px] font-mono text-klic-muted">
                      수신처: c-level@flux.kr · #exec-briefing (총 14명)
                    </div>
                    <button
                      type="button"
                      onClick={() => setReportDispatched(true)}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-klic-on-emphasis text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{reportDispatched ? '테스트 발송 완료!' : '즉시 테스트 발송'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 우측 6컬럼: 실시간 A4 경영진 PDF 리포트 렌더링 캔버스 */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl bg-zinc-50/80  p-4 border border-zinc-200/80 ">
                  <div className="flex items-center justify-between text-[11px] font-mono text-klic-muted mb-3">
                    <span>경영진용 A4 PDF 실시간 미리보기 ({selectedWidgets.length} 개 모듈)</span>
                    <span className="text-blue-600  font-semibold">CONFIDENTIAL · 대외비</span>
                  </div>

                  {/* A4 종이 문서 시뮬레이션 */}
                  <div className="bg-white  rounded-xl p-5 border border-zinc-200  space-y-4 shadow-2xs">
                    <div className="flex items-start justify-between border-b border-zinc-200  pb-3">
                      <div>
                        <div className="text-[10px] font-mono text-blue-600 font-bold">
                          KLIC 엔터프라이즈 이사회 보고
                        </div>
                        <div className="text-sm font-bold text-zinc-900 ">
                          2026년 2분기 주간 경영 핵심지표(KPI) 및 인프라 브리핑
                        </div>
                      </div>
                      <div className="text-right font-mono text-[10px] text-klic-muted">
                        <div>발행주기: {{ daily: '일간', weekly: '주간', monthly: '월간' }[reportFreq]}</div>
                        <div>포맷: {reportFormat.toUpperCase()}</div>
                      </div>
                    </div>

                    {/* 선택된 위젯에 따라 동적으로 그려지는 미니 차트 */}
                    <div className="grid grid-cols-2 gap-3">
                      {selectedWidgets.includes('arr-waterfall') && (
                        <div className="p-3 rounded-xl bg-zinc-50  border border-zinc-200/70 ">
                          <div className="text-[10px] font-mono text-klic-muted">순 ARR 변동 분석</div>
                          <div className="text-sm font-bold font-mono text-zinc-900  mt-0.5">
                            ₩14,820,000,000 <span className="text-[11px] text-blue-600">+18.4%</span>
                          </div>
                          <svg viewBox="0 0 180 42" className="w-full h-10 mt-1.5">
                            <rect x="8" y="20" width="24" height="20" rx="3" fill="var(--klic-component-block-color-accent)" />
                            <rect x="44" y="14" width="24" height="26" rx="3" fill="var(--klic-component-block-color-accent)" />
                            <rect x="80" y="9" width="24" height="31" rx="3" fill="var(--klic-component-block-color-accent)" />
                            <rect x="116" y="4" width="24" height="36" rx="3" fill="var(--klic-component-block-color-accent)" />
                            <rect x="150" y="2" width="24" height="38" rx="3" fill="var(--klic-component-block-color-accent)" />
                          </svg>
                        </div>
                      )}

                      {selectedWidgets.includes('cohort-retention') && (
                        <div className="p-3 rounded-xl bg-zinc-50  border border-zinc-200/70 ">
                          <div className="text-[10px] font-mono text-klic-muted">엔터프라이즈 고객 집단별 순매출 유지율</div>
                          <div className="text-sm font-bold font-mono text-zinc-900  mt-0.5">
                            134.2% <span className="text-[11px] text-blue-600">상위 10%</span>
                          </div>
                          <div className="grid grid-cols-5 gap-1 mt-2">
                            {[100, 98, 108, 121, 134].map((v, idx) => (
                              <div
                                key={idx}
                                className="py-1 rounded text-center font-mono text-[10px] font-bold bg-blue-600/15 text-blue-700 "
                              >
                                {v}%
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedWidgets.includes('sla-uptime') && (
                        <div className="p-3 rounded-xl bg-zinc-50  border border-zinc-200/70 ">
                          <div className="text-[10px] font-mono text-klic-muted">핵심 SLA 가동률</div>
                          <div className="text-sm font-bold font-mono text-blue-600 mt-0.5">
                            99.998% · SEV-1 0건
                          </div>
                          <div className="flex gap-0.5 mt-2">
                            {Array.from({ length: 20 }).map((_, idx) => (
                              <span key={idx} className="flex-1 h-3 rounded-xs bg-blue-500" />
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedWidgets.includes('finops-burn') && (
                        <div className="p-3 rounded-xl bg-zinc-50  border border-zinc-200/70 ">
                          <div className="text-[10px] font-mono text-klic-muted">클라우드 매출원가 비율</div>
                          <div className="text-sm font-bold font-mono text-zinc-900  mt-0.5">
                            11.2% <span className="text-[11px] text-blue-600">-2.1%p 절감</span>
                          </div>
                          <div className="w-full h-2.5 bg-zinc-200  rounded-full overflow-hidden mt-2.5">
                            <div className="h-full bg-blue-600 w-[68%]" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          5. 엔터프라이즈 SAML 2.0 SSO & SCIM 연동 위저드 (wizard-sso-saml-setup)
      ===================================================================== */}
      {showSso && (
        <section className="bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  rounded-[24px] p-2 shadow-[0_4px_24px_color-mix(in_srgb,var(--klic-component-block-color-text)_3%,transparent)]">
          <div className="bg-white  border border-zinc-200/70  rounded-[18px] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-zinc-200/80 ">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-blue-600  mb-1">
                  <span>설정 마법사 05</span>
                  <span aria-hidden="true">·</span>
                  <span>SAML 2.0 인증 연동 및 SCIM 2.0 디렉터리 동기화</span>
                </div>
                <h3 className="text-lg font-bold tracking-tight text-zinc-900 ">
                  엔터프라이즈 IdP 싱글 사인온(SAML 2.0) 및 SCIM 조직도 자동 프로비저닝 위저드
                </h3>
              </div>

              <div className="flex items-center gap-1.5 bg-zinc-100  p-1 rounded-xl">
                {[
                  { id: 'okta', label: 'Okta Workforce Identity' },
                  { id: 'entra', label: 'Microsoft Entra ID (Azure AD)' },
                  { id: 'google', label: 'Google Workspace Enterprise' },
                ].map((idp) => (
                  <button
                    key={idp.id}
                    type="button"
                    onClick={() => setIdpProvider(idp.id as 'okta' | 'entra' | 'google')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      idpProvider === idp.id
                        ? 'bg-white  text-zinc-900  shadow-xs'
                        : 'text-klic-muted hover:text-zinc-900'
                    }`}
                  >
                    {idp.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* 좌측 7컬럼: SP 메타데이터 엔드포인트 & SCIM 그룹 매핑 */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-4 rounded-2xl border border-zinc-200  bg-zinc-50/60  space-y-3">
                  <div className="text-xs font-bold text-zinc-900 ">
                    1. KLIC 서비스 제공자(SP) 엔드포인트 메타데이터 ({idpProvider.toUpperCase()} 콘솔 입력용)
                  </div>

                  {[
                    { key: 'acs', label: "ACS (인증 응답 수신 서비스) URL", val: 'https://auth.flux-enterprise.kr/saml2/v1/acs/org_tossbank_prod' },
                    { key: 'entity', label: "서비스 제공자 ID (대상 URI)", val: 'urn:flux:enterprise:sp:ap-northeast-2:tossbank' },
                    { key: 'scim', label: "SCIM 2.0 기본 엔드포인트", val: 'https://api.flux-enterprise.kr/scim/v2/directories/dir_99481a' },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="p-3 rounded-xl bg-white  border border-zinc-200/80  flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold text-klic-muted">{item.label}</div>
                        <div className="text-xs font-mono text-zinc-900  truncate mt-0.5">
                          {item.val}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyText(item.key, item.val)}
                        className="px-2.5 py-1.5 rounded-lg border border-zinc-200  text-xs font-mono flex items-center gap-1 hover:bg-zinc-100  shrink-0 cursor-pointer"
                      >
                        {copiedKey === item.key ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-blue-600" />
                            <span className="text-blue-600">복사됨</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-klic-muted" />
                            <span>복사</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                {/* SCIM 부서/그룹 -> RBAC 자동 매핑 테이블 */}
                <div className="p-4 rounded-2xl border border-zinc-200  space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 ">
                      2. SCIM 2.0 조직도 그룹 ⇄ KLIC 권한 자동 바인딩 규칙
                    </span>
                    <span className="text-[11px] font-mono text-blue-600 ">
                      15분 주기 실시간 인사연동
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    {[
                      { idpGroup: `${idpProvider}:grp-core-sre-admins`, fluxRole: '최고 관리자 (인프라 총괄)', users: '12명' },
                      { idpGroup: `${idpProvider}:grp-settlement-finops`, fluxRole: "FinOps 원장 승인자", users: '38명' },
                      { idpGroup: `${idpProvider}:grp-compliance-audit`, fluxRole: "WORM 감사 읽기 전용", users: '9명' },
                    ].map((m, idx) => (
                      <div
                        key={idx}
                        className="px-3.5 py-2.5 rounded-xl bg-zinc-50  border border-zinc-200/70  flex items-center justify-between gap-2"
                      >
                        <span className="text-blue-600  font-semibold">{m.idpGroup}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-klic-muted shrink-0" />
                        <span className="font-sans font-bold text-zinc-900 ">{m.fluxRole}</span>
                        <span className="text-klic-muted">{m.users}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 우측 5컬럼: 라이브 SAML 2.0 핸드셰이크 트레이서 (클린 라이트 서피스) */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-zinc-50/80  p-5 border border-zinc-200/80  space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-blue-600  font-bold">SAML 2.0 인증 교환 실시간 확인</div>
                      <div className="text-sm font-bold text-zinc-900  mt-0.5">X.509 서명 및 Assertion 클레임 검증기</div>
                    </div>
                    <button
                      type="button"
                      onClick={runSamlHandshakeTest}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-klic-on-emphasis text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${samlTestState === 'testing' ? 'animate-spin' : ''}`} />
                      <span>핸드셰이크 재검증</span>
                    </button>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    {[
                      { step: '01', name: 'IdP 메타데이터 XML & X.509 지문 대조', latency: '8ms', detail: 'SHA256: 9F:86:D0:81:88:4C...7A:3B' },
                      { step: '02', name: 'SAML 2.0 Response XML 전자서명 무결성', latency: '14ms', detail: "RSA-SHA256 서명 검증 완료" },
                      { step: '03', name: 'NameID 및 부서 Attribute 클레임 추출', latency: '6ms', detail: 'cto@tossbank.com · [grp-core-sre-admins]' },
                      { step: '04', name: 'SCIM 2.0 JIT(Just-In-Time) 세션 발급', latency: '11ms', detail: "세션 유효 시간 8시간 · 하드웨어 다중 인증 정상" },
                    ].map((log) => (
                      <div key={log.step} className="p-3 rounded-xl bg-white  border border-zinc-200/80  shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-600  font-bold">
                            [통과 {log.step}] {log.name}
                          </span>
                          <span className="text-klic-muted">{log.latency}</span>
                        </div>
                        <div className="text-[11px] text-klic-muted mt-1 truncate">{log.detail}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setScimAutoProvision(!scimAutoProvision)}
                      className={`p-2.5 rounded-xl border text-left text-xs cursor-pointer ${
                        scimAutoProvision
                          ? 'border-blue-300  bg-blue-50/60  text-blue-800 '
                          : 'border-zinc-200  bg-white  text-klic-muted'
                      }`}
                    >
                      <div className="font-bold">SCIM 퇴사자 자동 회수</div>
                      <div className="text-[10px] opacity-80">{scimAutoProvision ? '인사 해촉 즉시 세션 파기' : '수동 비활성화'}</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEnforceSsoOnly(!enforceSsoOnly)}
                      className={`p-2.5 rounded-xl border text-left text-xs cursor-pointer ${
                        enforceSsoOnly
                          ? 'border-blue-300  bg-blue-50/60  text-blue-800 '
                          : 'border-zinc-200  bg-white  text-klic-muted'
                      }`}
                    >
                      <div className="font-bold">IdP SSO 강제 잠금</div>
                      <div className="text-[10px] opacity-80">{enforceSsoOnly ? '일반 비밀번호 로그인 차단' : '하이브리드 허용'}</div>
                    </button>
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
