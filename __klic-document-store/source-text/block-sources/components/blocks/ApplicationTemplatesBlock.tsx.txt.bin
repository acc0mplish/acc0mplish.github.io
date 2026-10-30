import { PersonAvatar } from '../PersonAvatar';
import React, { useState, useMemo } from 'react';
import {
  Search,
  Bell,
  ChevronRight,
  ChevronDown,
  Check,
  Plus,
  FileText,
  AlertTriangle,
  Users,
  Layers,
  BarChart3,
  LayoutGrid,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  RefreshCw,
  Filter,
  Settings2,
  Download,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Eye,
  Calendar,
  ShieldCheck,
  Activity,
  Cpu,
  Database,
  GitBranch,
  Flame,
  Lock,
  Play,
  Pause,
  Zap,
  Server,
  TrendingUp,
  ArrowRight,
  CheckSquare,
  FileCheck2,
  Terminal,
  Sliders,
} from 'lucide-react';

export type ApplicationTemplateId =
  | 'template-advisor-knowledge'
  | 'template-autonomous-task-lifecycle'
  | 'template-smart-reorder-supplychain'
  | 'template-proforma-financial-roi'
  | 'template-enterprise-reports-center';

interface ApplicationTemplatesBlockProps {
  initialTemplate?: ApplicationTemplateId;
  density?: 'compact' | 'normal' | 'relaxed';
}

/* ============================================================================
 * 1. TEMPLATE 1: 고객 이탈 방어 & NRR 확장 커맨드센터 (PulseGuard CX Retention OS)
 * ============================================================================ */
interface RetentionAccountItem {
  id: string;
  company: string;
  tier: 'Enterprise' | 'Strategic' | 'Growth';
  csmName: string;
  csmAvatar: string;
  healthScore: number;
  seatUtilization: number;
  arrMillions: number;
  renewalDays: number;
  riskSignal: '정상 확장' | '사용량 급감' | '챔피언 퇴사' | '업셀 기회';
  playbookStatus: '자동 감시 중' | '플레이북 가동' | '임원 개입 완료';
}

const CSM_PROFILES = [
  {
    name: '김서연',
    avatar:
      './placeholders/avatar-0cbdeb5e5e6f.svg',
  },
  {
    name: '강태우',
    avatar:
      './placeholders/avatar-2ca18b045556.svg',
  },
  {
    name: '박지민',
    avatar:
      './placeholders/avatar-ed36204aee6b.svg',
  },
  {
    name: '최수아',
    avatar:
      './placeholders/avatar-32b9a55c6abe.svg',
  },
];

const INITIAL_RETENTION_ACCOUNTS: RetentionAccountItem[] = [
  {
    id: 'acc-1',
    company: '신한금융그룹',
    tier: 'Strategic',
    csmName: '김서연',
    csmAvatar:
      './placeholders/avatar-0cbdeb5e5e6f.svg',
    healthScore: 38,
    seatUtilization: 44,
    arrMillions: 18500,
    renewalDays: 24,
    riskSignal: '사용량 급감',
    playbookStatus: '플레이북 가동',
  },
  {
    id: 'acc-2',
    company: '삼성바이오로직스',
    tier: 'Enterprise',
    csmName: '강태우',
    csmAvatar:
      './placeholders/avatar-2ca18b045556.svg',
    healthScore: 92,
    seatUtilization: 96,
    arrMillions: 14200,
    renewalDays: 68,
    riskSignal: '업셀 기회',
    playbookStatus: '자동 감시 중',
  },
  {
    id: 'acc-3',
    company: '카카오모빌리티',
    tier: 'Strategic',
    csmName: '박지민',
    csmAvatar:
      './placeholders/avatar-ed36204aee6b.svg',
    healthScore: 46,
    seatUtilization: 58,
    arrMillions: 22400,
    renewalDays: 19,
    riskSignal: '챔피언 퇴사',
    playbookStatus: '플레이북 가동',
  },
  {
    id: 'acc-4',
    company: '무신사 클라우드 커머스',
    tier: 'Enterprise',
    csmName: '최수아',
    csmAvatar:
      './placeholders/avatar-32b9a55c6abe.svg',
    healthScore: 88,
    seatUtilization: 91,
    arrMillions: 9600,
    renewalDays: 112,
    riskSignal: '정상 확장',
    playbookStatus: '자동 감시 중',
  },
  {
    id: 'acc-5',
    company: 'SK하이닉스 시스템',
    tier: 'Enterprise',
    csmName: '김서연',
    csmAvatar:
      './placeholders/avatar-0cbdeb5e5e6f.svg',
    healthScore: 79,
    seatUtilization: 84,
    arrMillions: 11800,
    renewalDays: 45,
    riskSignal: '업셀 기회',
    playbookStatus: '임원 개입 완료',
  },
];

/* ============================================================================
 * 2. TEMPLATE 2: 멀티클라우드 FinOps 비용 최적화 & 약정 관제 포털 (CloudPulse FinOps)
 * ============================================================================ */
interface CloudResourceItem {
  id: string;
  workload: string;
  provider: 'AWS' | 'GCP' | 'Azure';
  region: string;
  instanceType: string;
  cpuAvgPct: number;
  monthlySpendUsd: number;
  potentialSavingsUsd: number;
  recommendation: string;
  status: '최적화 대기' | '예약 전환됨' | '축소 완료';
}

const INITIAL_FINOPS_RESOURCES: CloudResourceItem[] = [
  {
    id: 'fin-1',
    workload: 'llm-inference-cluster-prod',
    provider: 'AWS',
    region: 'ap-northeast-2 (서울)',
    instanceType: 'p4d.24xlarge × 8',
    cpuAvgPct: 28,
    monthlySpendUsd: 48200,
    potentialSavingsUsd: 16400,
    recommendation: '1년 Savings Plan 전환 + 야간 오토스케일 축소',
    status: '최적화 대기',
  },
  {
    id: 'fin-2',
    workload: 'realtime-feature-store-bq',
    provider: 'GCP',
    region: 'asia-northeast3 (서울)',
    instanceType: 'BigQuery Enterprise 1,600 Slots',
    cpuAvgPct: 41,
    monthlySpendUsd: 29500,
    potentialSavingsUsd: 8900,
    recommendation: '유휴 파티션 스토리지 아카이빙 및 슬롯 오토스케일링',
    status: '최적화 대기',
  },
  {
    id: 'fin-3',
    workload: 'core-settlement-postgres-ha',
    provider: 'AWS',
    region: 'ap-northeast-2 (서울)',
    instanceType: 'db.r6g.8xlarge Multi-AZ',
    cpuAvgPct: 76,
    monthlySpendUsd: 19800,
    potentialSavingsUsd: 5940,
    recommendation: '3년 예약 인스턴스(RI) 약정 적용 완료',
    status: '예약 전환됨',
  },
  {
    id: 'fin-4',
    workload: 'staging-k8s-ephemeral-nodes',
    provider: 'Azure',
    region: 'koreacentral (한국 중부)',
    instanceType: 'Standard_D16s_v5 × 24',
    cpuAvgPct: 14,
    monthlySpendUsd: 14600,
    potentialSavingsUsd: 9200,
    recommendation: 'Spot 인스턴스 80% 혼합 및 주말 자동 종료 스케줄',
    status: '최적화 대기',
  },
  {
    id: 'fin-5',
    workload: 'global-cdn-egress-gateway',
    provider: 'GCP',
    region: 'global-edge',
    instanceType: 'Cloud CDN + Armor Tier-1',
    cpuAvgPct: 68,
    monthlySpendUsd: 11400,
    potentialSavingsUsd: 2850,
    recommendation: '약정 대역폭 티어 업그레이드 적용됨',
    status: '축소 완료',
  },
];

/* ============================================================================
 * 3. TEMPLATE 3: 데이터 파이프라인 & 스키마 리니지 스튜디오 (StrataFlow Data Studio)
 * ============================================================================ */
interface PipelineJobItem {
  id: string;
  dagName: string;
  sourceSystem: string;
  destinationTable: string;
  schedule: '실시간 CDC' | '5분 주기' | '1시간 배치' | '일일 마감';
  freshnessLag: string;
  rowsProcessed: string;
  schemaStatus: '정상 동기화' | '스키마 드리프트 감지' | '백필 실행 중';
  owner: string;
}

const INITIAL_PIPELINE_JOBS: PipelineJobItem[] = [
  {
    id: 'dag-1',
    dagName: 'cdc_ledger_payments_stream',
    sourceSystem: 'Aurora PostgreSQL (Prod)',
    destinationTable: 'SNOWFLAKE.CORE.FCT_PAYMENTS',
    schedule: '실시간 CDC',
    freshnessLag: '1.2초',
    rowsProcessed: '48,920 행/초',
    schemaStatus: '정상 동기화',
    owner: '박준영',
  },
  {
    id: 'dag-2',
    dagName: 'dbt_merchant_settlement_mart',
    sourceSystem: 'Kafka Topic (settlement.v3)',
    destinationTable: 'SNOWFLAKE.MART.DIM_MERCHANT_PAYOUT',
    schedule: '5분 주기',
    freshnessLag: '4분 18초',
    rowsProcessed: '1,420,000 행/회',
    schemaStatus: '스키마 드리프트 감지',
    owner: '이현우',
  },
  {
    id: 'dag-3',
    dagName: 'feature_fraud_vector_embeddings',
    sourceSystem: 'ClickHouse Event Stream',
    destinationTable: 'PINECONE.FRAUD_VECTORS_PROD',
    schedule: '실시간 CDC',
    freshnessLag: '0.8초',
    rowsProcessed: '19,400 행/초',
    schemaStatus: '정상 동기화',
    owner: '김도연',
  },
  {
    id: 'dag-4',
    dagName: 'spark_cohort_retention_rollup',
    sourceSystem: 'S3 Iceberg Lakehouse',
    destinationTable: 'BIGQUERY.ANALYTICS.RPT_COHORT_LTV',
    schedule: '1시간 배치',
    freshnessLag: '22분',
    rowsProcessed: '84,500,000 행/회',
    schemaStatus: '백필 실행 중',
    owner: '최윤서',
  },
];

/* ============================================================================
 * 4. TEMPLATE 4: 프로덕트 A/B 실험 & 피처 플래그 릴리즈 콘솔 (LaunchGrid Experiment OS)
 * ============================================================================ */
interface ExperimentMetricRow {
  id: string;
  metricName: string;
  category: 'Primary (핵심)' | 'Secondary (보조)' | 'Guardrail (가드레일)';
  controlValue: string;
  variantValue: string;
  relativeLift: string;
  isPositive: boolean;
  confidencePct: number;
  status: '유의미한 상승' | '안정 범위' | '관찰 필요';
}

const INITIAL_EXPERIMENT_METRICS: ExperimentMetricRow[] = [
  {
    id: 'exp-m1',
    metricName: '원클릭 체크아웃 최종 결제 전환율 (CVR)',
    category: 'Primary (핵심)',
    controlValue: '3.82%',
    variantValue: '4.41%',
    relativeLift: '+15.4%',
    isPositive: true,
    confidencePct: 99.2,
    status: '유의미한 상승',
  },
  {
    id: 'exp-m2',
    metricName: '사용자당 평균 결제 금액 (ARPU)',
    category: 'Secondary (보조)',
    controlValue: '₩68,400',
    variantValue: '₩74,900',
    relativeLift: '+9.5%',
    isPositive: true,
    confidencePct: 96.8,
    status: '유의미한 상승',
  },
  {
    id: 'exp-m3',
    metricName: '결제창 이탈 후 24시간 내 재방문율',
    category: 'Secondary (보조)',
    controlValue: '18.4%',
    variantValue: '19.1%',
    relativeLift: '+3.8%',
    isPositive: true,
    confidencePct: 81.4,
    status: '관찰 필요',
  },
  {
    id: 'exp-m4',
    metricName: '결제 승인 API p99 지연 시간 (SLA < 400ms)',
    category: 'Guardrail (가드레일)',
    controlValue: '214ms',
    variantValue: '219ms',
    relativeLift: '+2.3%',
    isPositive: true,
    confidencePct: 99.9,
    status: '안정 범위',
  },
];

/* ============================================================================
 * 5. TEMPLATE 5: 보안 컴플라이언스(SOC2/ISO27001) 자동 감사 포털 (VantaShield)
 * ============================================================================ */
interface ComplianceControlItem {
  id: string;
  controlCode: string;
  title: string;
  framework: 'SOC 2 Type II' | 'ISO 27001' | 'ISMS-P' | 'PCI-DSS v4';
  evidenceSource: string;
  owner: string;
  ownerAvatar: string;
  lastVerified: string;
  status: '자동 검증 통과' | '증거 갱신 필요' | '예외 승인됨';
}

const INITIAL_COMPLIANCE_CONTROLS: ComplianceControlItem[] = [
  {
    id: 'ctrl-1',
    controlCode: 'CC6.1 · IAM-04',
    title: '프로덕션 DB 및 루트 계정 MFA(다중인증) 100% 강제 적용 검증',
    framework: 'SOC 2 Type II',
    evidenceSource: 'Okta SSO + AWS IAM 스냅샷',
    owner: '한지훈',
    ownerAvatar:
      './placeholders/avatar-3a010bc432b4.svg',
    lastVerified: '14분 전 자동 수집',
    status: '자동 검증 통과',
  },
  {
    id: 'ctrl-2',
    controlCode: 'A.8.24 · ENC-01',
    title: '고객 민감 원장 데이터 AES-256 저장 암호화 및 KMS 키 순환 주기 준수',
    framework: 'ISO 27001',
    evidenceSource: 'AWS KMS + RDS Config API',
    owner: '김서연',
    ownerAvatar:
      './placeholders/avatar-0cbdeb5e5e6f.svg',
    lastVerified: '2시간 전 자동 수집',
    status: '자동 검증 통과',
  },
  {
    id: 'ctrl-3',
    controlCode: '2.6.3 · NET-09',
    title: '외부 벤더 망간 전용선 방화벽 인바운드 규칙 분기별 정기 감사 서명',
    framework: 'ISMS-P',
    evidenceSource: 'Terraform State + 보안팀장 전자서명',
    owner: '박지민',
    ownerAvatar:
      './placeholders/avatar-ed36204aee6b.svg',
    lastVerified: '만료 D-3 (갱신 대기)',
    status: '증거 갱신 필요',
  },
  {
    id: 'ctrl-4',
    controlCode: 'CC7.2 · VULN-02',
    title: '컨테이너 이미지 Critical CVE 취약점 24시간 이내 패치 SLA 준수',
    framework: 'SOC 2 Type II',
    evidenceSource: 'Snyk Container + GitHub Actions',
    owner: '강태우',
    ownerAvatar:
      './placeholders/avatar-2ca18b045556.svg',
    lastVerified: '38분 전 자동 수집',
    status: '자동 검증 통과',
  },
  {
    id: 'ctrl-5',
    controlCode: 'REQ-3.5 · HSM-01',
    title: '레거시 정산 배치 서버 TLS 1.3 유예 기간 한시적 보안 예외 승인',
    framework: 'PCI-DSS v4',
    evidenceSource: 'CISO 예외 승인서 #EX-2026-09',
    owner: '최수아',
    ownerAvatar:
      './placeholders/avatar-32b9a55c6abe.svg',
    lastVerified: '2026.10.18 승인됨',
    status: '예외 승인됨',
  },
];

/* ============================================================================
 * 템플릿 상단 스위처 메타데이터
 * ============================================================================ */
const TEMPLATE_TABS: {
  id: ApplicationTemplateId;
  label: string;
  pkg: string;
  subtitle: string;
}[] = [
  {
    id: 'template-advisor-knowledge',
    label: '1. 고객 이탈 방어 & NRR 확장 포털',
    pkg: 'KLIC/template-retention',
    subtitle: 'PulseGuard CX Retention OS',
  },
  {
    id: 'template-autonomous-task-lifecycle',
    label: '2. 멀티클라우드 FinOps 비용 최적화 포털',
    pkg: 'KLIC/template-finops',
    subtitle: 'CloudPulse FinOps Studio',
  },
  {
    id: 'template-smart-reorder-supplychain',
    label: '3. 데이터 파이프라인 & 리니지 스튜디오',
    pkg: 'KLIC/template-dataflow',
    subtitle: 'StrataFlow Data Lineage',
  },
  {
    id: 'template-proforma-financial-roi',
    label: '4. 프로덕트 A/B 실험 & 피처 플래그 콘솔',
    pkg: 'KLIC/template-experiments',
    subtitle: 'LaunchGrid Experiment OS',
  },
  {
    id: 'template-enterprise-reports-center',
    label: '5. 보안 컴플라이언스 & 감사 증거 포털',
    pkg: 'KLIC/template-compliance',
    subtitle: 'VantaShield Trust Vault',
  },
];

export function ApplicationTemplatesBlock({
  initialTemplate = 'template-advisor-knowledge',
}: ApplicationTemplatesBlockProps) {
  const [activeTemplate, setActiveTemplate] =
    useState<ApplicationTemplateId>(initialTemplate);

  React.useEffect(() => {
    setActiveTemplate(initialTemplate);
  }, [initialTemplate]);

  /* ------------------------------------------------------------------------
   * State for Template 1: PulseGuard CX Retention & NRR Workspace
   * ------------------------------------------------------------------------ */
  const [retentionAccounts, setRetentionAccounts] = useState<
    RetentionAccountItem[]
  >(INITIAL_RETENTION_ACCOUNTS);
  const [retentionFilter, setRetentionFilter] = useState<
    '전체' | '이탈 위험' | '업셀 기회'
  >('전체');
  const [retentionSearch, setRetentionSearch] = useState('');
  const [playbookResolved, setPlaybookResolved] = useState(false);
  const [openCsmDropdownId, setOpenCsmDropdownId] = useState<string | null>(
    null
  );

  /* ------------------------------------------------------------------------
   * State for Template 2: CloudPulse FinOps & Commitment Optimizer
   * ------------------------------------------------------------------------ */
  const [finopsRows, setFinopsRows] = useState<CloudResourceItem[]>(
    INITIAL_FINOPS_RESOURCES
  );
  const [commitmentTargetPct, setCommitmentTargetPct] = useState<number>(78);
  const [providerFilter, setProviderFilter] = useState<
    '전체' | 'AWS' | 'GCP' | 'Azure'
  >('전체');
  const [openProviderDropdownId, setOpenProviderDropdownId] = useState<
    string | null
  >(null);

  /* ------------------------------------------------------------------------
   * State for Template 3: StrataFlow Data Pipeline & Lineage Studio
   * ------------------------------------------------------------------------ */
  const [pipelineJobs, setPipelineJobs] = useState<PipelineJobItem[]>(
    INITIAL_PIPELINE_JOBS
  );
  const [selectedLineageNode, setSelectedLineageNode] = useState<
    'source' | 'transform' | 'warehouse' | 'serving'
  >('transform');
  const [driftResolved, setDriftResolved] = useState(false);
  const [openScheduleDropdownId, setOpenScheduleDropdownId] = useState<
    string | null
  >(null);

  /* ------------------------------------------------------------------------
   * State for Template 4: LaunchGrid A/B Experiment & Feature Flag Console
   * ------------------------------------------------------------------------ */
  const [rolloutPct, setRolloutPct] = useState<number>(50);
  const [targetEnv, setTargetEnv] = useState<
    'Production (운영)' | 'Canary (카나리)' | 'Staging (검수)'
  >('Production (운영)');
  const [isEnvDropdownOpen, setIsEnvDropdownOpen] = useState(false);
  const [winnerPromoted, setWinnerPromoted] = useState(false);

  /* ------------------------------------------------------------------------
   * State for Template 5: VantaShield Security Compliance & Evidence Vault
   * ------------------------------------------------------------------------ */
  const [controls, setControls] = useState<ComplianceControlItem[]>(
    INITIAL_COMPLIANCE_CONTROLS
  );
  const [controlFilter, setControlFilter] = useState<
    '전체' | '자동 검증 통과' | '증거 갱신 필요' | '예외 승인됨'
  >('전체');
  const [openOwnerDropdownId, setOpenOwnerDropdownId] = useState<string | null>(
    null
  );

  /* ========================================================================
   * RENDER 1: 고객 이탈 방어 & NRR 확장 커맨드센터 (PulseGuard CX Retention OS)
   * ======================================================================== */
  const renderTemplate1RetentionPortal = () => {
    const filteredAccounts = retentionAccounts.filter((acc) => {
      if (retentionFilter === '이탈 위험' && acc.healthScore >= 50) return false;
      if (retentionFilter === '업셀 기회' && acc.riskSignal !== '업셀 기회')
        return false;
      if (!retentionSearch.trim()) return true;
      return (
        acc.company.toLowerCase().includes(retentionSearch.toLowerCase()) ||
        acc.csmName.toLowerCase().includes(retentionSearch.toLowerCase())
      );
    });

    return (
      <div
        onClick={() => setOpenCsmDropdownId(null)}
        className="rounded-2xl border border-zinc-200  bg-[var(--klic-component-block-color-soft)]  overflow-hidden shadow-sm"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[760px]">
          {/* 좌측 SaaS 워크스페이스 네비게이션 */}
          <aside className="lg:col-span-3 xl:col-span-2 bg-[var(--klic-component-block-color-soft)]  border-b lg:border-b-0 lg:border-r border-zinc-200/80  p-4 flex flex-col justify-between">
            <div className="space-y-5">
              {/* 브랜드 로고 */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-900 text-klic-on-emphasis flex items-center justify-center font-bold text-xs">
                    PG
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900 ">
                      PulseGuard
                    </div>
                    <div className="text-[10px] text-klic-muted">
                      NRR 및 고객 유지 관리
                    </div>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-blue-100  text-blue-800  text-[10px] font-semibold">
                  실시간
                </span>
              </div>

              {/* 메뉴 섹션 */}
              <div className="space-y-1 text-xs">
                <div className="px-2 py-1 text-[10px] font-semibold text-klic-muted uppercase tracking-wider">
                  고객 유지 관제
                </div>
                {[
                  { label: '이탈 방어 & 코호트 레이더', active: true, badge: '2' },
                  { label: '확장 매출(Expansion) 시그널', active: false, badge: '8' },
                  { label: '자동화 개입 플레이북', active: false },
                  { label: '임원 스폰서 QBR 브리핑', active: false },
                  { label: '계약 갱신 파이프라인', active: false },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium transition-colors ${
                      item.active
                        ? 'bg-white  text-zinc-900  shadow-2xs'
                        : 'text-klic-muted  hover:bg-white/60 '
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded-full bg-blue-100  text-blue-700  text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 하단 분기 NRR 목표 게이지 */}
            <div className="p-3 rounded-xl bg-white  border border-zinc-200/70  space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-klic-muted font-medium">Q4 목표 NRR</span>
                <span className="font-mono font-bold text-blue-700 ">
                  118.6%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-100  overflow-hidden">
                <div className="h-full bg-blue-600 w-[86%] rounded-full" />
              </div>
              <div className="text-[11px] text-klic-muted">
                목표치 115.0% 대비 +3.6%p 초과 달성 중
              </div>
            </div>
          </aside>

          {/* 우측 메인 워크스페이스 */}
          <div className="lg:col-span-9 xl:col-span-10 p-6 space-y-6 bg-white ">
            {/* 상단 헤더 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80 ">
              <div>
                <div className="flex items-center gap-2 text-xs text-klic-muted">
                  <span>고객 성공 본부</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-zinc-900  font-semibold">
                    엔터프라이즈 리텐션 & NRR 관제실
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-900  mt-1">
                  고객 건강도 스코어링 & 선제적 이탈 방어 포털
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRetentionAccounts(INITIAL_RETENTION_ACCOUNTS);
                    setPlaybookResolved(false);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200  text-xs font-medium text-zinc-700  hover:bg-zinc-50 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>데모 초기화</span>
                </button>
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-klic-on-emphasis text-xs font-semibold flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>QBR 리포트 일괄 생성</span>
                </button>
              </div>
            </div>

            {/* 4대 핵심 리텐션 메트릭 타일 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              {[
                {
                  label: '순매출 유지율 (Net Dollar Retention)',
                  val: '118.6%',
                  sub: '전분기 대비 +4.2%p 상승',
                  tone: 'text-blue-700 ',
                },
                {
                  label: '90일 내 갱신 도래 계약 총액',
                  val: '₩76.5억',
                  sub: '총 14개 엔터프라이즈 고객사',
                  tone: 'text-zinc-900 ',
                },
                {
                  label: "조기 경보 감지 고객사",
                  val: playbookResolved ? '1개사 (₩2.2억)' : '2개사 (₩4.09억)',
                  sub: '건강도 점수 50점 미만 즉시 개입',
                  tone: 'text-blue-600 ',
                },
                {
                  label: '시트 증설 업셀 파이프라인',
                  val: '₩11.4억',
                  sub: '사용률 90% 초과 계정 자동 포착',
                  tone: 'text-blue-600 ',
                },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="p-4 rounded-xl bg-zinc-50/70  border border-zinc-200/80 "
                >
                  <div className="text-[11px] text-klic-muted font-medium">
                    {kpi.label}
                  </div>
                  <div className={`text-xl font-bold mt-1 tabular-nums ${kpi.tone}`}>
                    {kpi.val}
                  </div>
                  <div className="text-[11px] text-klic-muted mt-0.5">{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* 긴급 이탈 위험 감지 & 원클릭 방어 플레이북 카드 */}
            {!playbookResolved && (
              <div className="rounded-xl border border-amber-300/80  bg-amber-50/50  p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-600 text-klic-on-emphasis text-[10px] font-bold">
                      고객 이탈 경고 · D-24
                    </span>
                    <span className="text-xs font-bold text-zinc-900 ">
                      솔라리스 파이낸셜 그룹 — 최근 14일 주간 활성 시트(WAU) 42% 급감 감지
                    </span>
                  </div>
                  <span className="text-xs text-klic-muted">
                    연간 계약액 ₩1.85억 · 담당 CSM 김서연
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-white  border border-zinc-200/80 ">
                    <div className="font-semibold text-blue-600 mb-1">
                      감지된 위험 신호
                    </div>
                    <p className="text-klic-muted  leading-relaxed">
                      리포트 빌더 모듈 API 호출량이 전월 대비 44%로 하락했으며, 핵심 관리자 2명의 로그인이 11일째 중단되었습니다.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white  border border-zinc-200/80  flex flex-col justify-between">
                    <div>
                      <div className="font-semibold text-blue-700  mb-1">
                        추천 방어 플레이북 #PB-09
                      </div>
                      <p className="text-klic-muted  leading-relaxed">
                        전담 솔루션 아키텍트 무상 온보딩 세션 배정 + 미사용 시트 20%를 크레딧으로 유예 전환 제안
                      </p>
                    </div>
                    <div className="mt-2.5 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPlaybookResolved(true);
                          setRetentionAccounts((prev) =>
                            prev.map((a) =>
                              a.id === 'acc-1'
                                ? {
                                    ...a,
                                    healthScore: 74,
                                    riskSignal: '정상 확장',
                                    playbookStatus: '임원 개입 완료',
                                  }
                                : a
                            )
                          );
                        }}
                        className="px-3 py-1.5 rounded-lg bg-klic-inverse  text-klic-on-emphasis  text-xs font-semibold hover:opacity-90"
                      >
                        방어 플레이북 즉시 발동 및 건강도 복구
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 고객 코호트 그리드 툴바 & 테이블 (보더 박스 없는 인라인 드롭다운 적용) */}
            <div className="rounded-xl border border-zinc-200  overflow-hidden bg-white ">
              <div className="px-4 py-3 border-b border-zinc-200  flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  {(['전체', '이탈 위험', '업셀 기회'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setRetentionFilter(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        retentionFilter === tab
                          ? 'bg-klic-inverse  text-klic-on-emphasis '
                          : 'text-klic-muted  hover:bg-zinc-100 '
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 text-klic-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={retentionSearch}
                    onChange={(e) => setRetentionSearch(e.target.value)}
                    placeholder="고객사명 또는 담당 CSM 검색"
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-50  border border-zinc-200  text-xs outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs tabular-nums">
                  <thead>
                    <tr className="bg-zinc-50/80  border-b border-zinc-200  text-klic-muted">
                      <th className="text-left py-2.5 px-4 font-semibold">고객사 및 티어</th>
                      <th className="text-left py-2.5 px-3 font-semibold">담당 CSM</th>
                      <th className="text-left py-2.5 px-3 font-semibold">건강도 스코어</th>
                      <th className="text-right py-2.5 px-3 font-semibold">시트 활성률</th>
                      <th className="text-right py-2.5 px-3 font-semibold">연간 반복매출(ARR)</th>
                      <th className="text-left py-2.5 px-3 font-semibold">신호 분류</th>
                      <th className="text-left py-2.5 px-4 font-semibold">방어 상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/70 ">
                    {filteredAccounts.map((acc) => (
                      <tr
                        key={acc.id}
                        className="hover:bg-zinc-50/70 "
                      >
                        <td className="py-3 px-4">
                          <div className="font-bold text-zinc-900 ">
                            {acc.company}
                          </div>
                          <div className="text-[11px] text-klic-muted">
                            {{ Strategic: '전략 고객', Enterprise: '엔터프라이즈' }[acc.tier]} · 갱신 D-{acc.renewalDays}
                          </div>
                        </td>

                        {/* 보더라인 없는 인라인 CSM 선택 드롭다운 */}
                        <td
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenCsmDropdownId(
                              openCsmDropdownId === acc.id ? null : acc.id
                            );
                          }}
                          className="py-3 px-3 relative cursor-pointer select-none"
                        >
                          <div className="inline-flex items-center gap-2">
                            <PersonAvatar
                              src={acc.csmAvatar}
                              alt={acc.csmName}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="font-medium text-zinc-800 ">
                              {acc.csmName}
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-klic-muted" />
                          </div>

                          {openCsmDropdownId === acc.id && (
                            <div className="absolute left-3 top-full mt-1 w-36 bg-white  border border-zinc-200  rounded-xl shadow-xl py-1 z-40">
                              {CSM_PROFILES.map((csm) => (
                                <button
                                  key={csm.name}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setRetentionAccounts((prev) =>
                                      prev.map((item) =>
                                        item.id === acc.id
                                          ? {
                                              ...item,
                                              csmName: csm.name,
                                              csmAvatar: csm.avatar,
                                            }
                                          : item
                                      )
                                    );
                                    setOpenCsmDropdownId(null);
                                  }}
                                  className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-zinc-100  text-left"
                                >
                                  <PersonAvatar
                                    src={csm.avatar}
                                    alt={csm.name}
                                    className="w-4 h-4 rounded-full object-cover"
                                  />
                                  <span>{csm.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full bg-zinc-100  overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  acc.healthScore >= 75
                                    ? 'bg-blue-500'
                                    : acc.healthScore >= 50
                                    ? 'bg-amber-500'
                                    : 'bg-blue-500'
                                }`}
                                style={{ width: `${acc.healthScore}%` }}
                              />
                            </div>
                            <span className="font-bold text-zinc-800 ">
                              {acc.healthScore}점
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-right font-mono text-zinc-700 ">
                          {acc.seatUtilization}%
                        </td>

                        <td className="py-3 px-3 text-right font-mono font-semibold text-zinc-900 ">
                          ₩{acc.arrMillions.toLocaleString()}만
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                              acc.riskSignal === '업셀 기회'
                                ? 'bg-blue-50  text-blue-700 '
                                : acc.riskSignal === '정상 확장'
                                ? 'bg-blue-50  text-blue-700 '
                                : 'bg-blue-50  text-blue-700 '
                            }`}
                          >
                            {acc.riskSignal}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() =>
                              setRetentionAccounts((prev) =>
                                prev.map((item) =>
                                  item.id === acc.id
                                    ? {
                                        ...item,
                                        playbookStatus:
                                          item.playbookStatus === '자동 감시 중'
                                            ? '플레이북 가동'
                                            : item.playbookStatus === '플레이북 가동'
                                            ? '임원 개입 완료'
                                            : '자동 감시 중',
                                      }
                                    : item
                                )
                              )
                            }
                            className="text-zinc-700  font-medium hover:underline"
                          >
                            {acc.playbookStatus}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ========================================================================
   * RENDER 2: 멀티클라우드 FinOps 비용 최적화 & 약정 관제 포털 (CloudPulse FinOps)
   * ======================================================================== */
  const renderTemplate2FinOpsPortal = () => {
    const filteredResources = finopsRows.filter(
      (r) => providerFilter === '전체' || r.provider === providerFilter
    );
    const totalMonthlySpend = finopsRows.reduce(
      (acc, r) => acc + r.monthlySpendUsd,
      0
    );
    const totalSavings = finopsRows.reduce(
      (acc, r) =>
        acc +
        (r.status === '최적화 대기'
          ? r.potentialSavingsUsd
          : Math.round(r.potentialSavingsUsd * 1.15)),
      0
    );

    return (
      <div
        onClick={() => setOpenProviderDropdownId(null)}
        className="rounded-2xl border border-zinc-200  bg-white  overflow-hidden shadow-sm"
      >
        {/* 상단 네비게이션 헤더 */}
        <div className="px-6 py-4 bg-klic-inverse text-klic-on-emphasis flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs">
              CP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">CloudPulse FinOps Studio</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono">
                  AWS · GCP · Azure 통합 빌링
                </span>
              </div>
              <div className="text-[11px] text-klic-muted">
                실시간 유휴 클러스터 회수 및 예약 인스턴스(RI / Savings Plan) 커버리지 최적화
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(['전체', 'AWS', 'GCP', 'Azure'] as const).map((prov) => (
              <button
                key={prov}
                type="button"
                onClick={() => setProviderFilter(prov)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  providerFilter === prov
                    ? 'bg-white text-zinc-950'
                    : 'bg-klic-inverse text-klic-muted hover:bg-klic-inverse'
                }`}
              >
                {prov}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 6-세그먼트 멀티클라우드 비용 구성 비율 바 */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between text-xs">
              <span className="font-semibold text-zinc-800 ">
                당월 멀티클라우드 청구액 구조 (${totalMonthlySpend.toLocaleString()}/월)
              </span>
              <span className="text-blue-600  font-semibold">
                즉시 절감 가능액: 월 ${totalSavings.toLocaleString()} (약 ₩
                {Math.round((totalSavings * 1380) / 10000).toLocaleString()}만)
              </span>
            </div>

            <div className="h-3 w-full rounded-full overflow-hidden flex gap-0.5 bg-zinc-100 ">
              <div className="bg-blue-600 w-[38%]" title="GPU / AI 추론 클러스터 38%" />
              <div className="bg-blue-500 w-[24%]" title="관리형 데이터베이스 24%" />
              <div className="bg-blue-500 w-[18%]" title="쿠버네티스 워커 노드 18%" />
              <div className="bg-amber-500 w-[11%]" title="네트워크 이그레스 11%" />
              <div className="bg-blue-500 w-[9%]" title="유휴 낭비 리소스 9%" />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-klic-muted pt-1">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" /> AI GPU 추론 (38%)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> 데이터베이스 (24%)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> GKE/EKS 일반 노드 (18%)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> CDN/이그레스 (11%)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> 미연결 유휴 볼륨 (9%)
              </span>
            </div>
          </div>

          {/* 약정 커버리지 시뮬레이터 바 */}
          <div className="p-4 rounded-xl bg-zinc-50  border border-zinc-200/80  flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-zinc-900 ">
                Savings Plan / 예약 인스턴스(RI) 목표 커버리지 시뮬레이터
              </div>
              <div className="text-xs text-klic-muted">
                온디맨드 비중을 줄이고 1년 약정 커버리지를{' '}
                <strong className="text-blue-600">{commitmentTargetPct}%</strong>로 높이면 연간{' '}
                <strong className="text-blue-600">
                  ${Math.round(totalSavings * 12 * (commitmentTargetPct / 75)).toLocaleString()}
                </strong>{' '}
                추가 절감됩니다.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min={50}
                max={95}
                value={commitmentTargetPct}
                onChange={(e) => setCommitmentTargetPct(Number(e.target.value))}
                className="w-36 accent-blue-600 cursor-pointer"
              />
              <span className="font-mono font-bold text-sm text-blue-600 w-12 text-right">
                {commitmentTargetPct}%
              </span>
              <button
                type="button"
                onClick={() =>
                  setFinopsRows((prev) =>
                    prev.map((r) => ({ ...r, status: '예약 전환됨' }))
                  )
                }
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-klic-on-emphasis text-xs font-semibold shrink-0"
              >
                일괄 최적화 승인
              </button>
            </div>
          </div>

          {/* 워크로드 권고사항 그리드 */}
          <div className="rounded-xl border border-zinc-200  overflow-hidden">
            <table className="w-full border-collapse text-xs tabular-nums">
              <thead>
                <tr className="bg-zinc-50/80  border-b border-zinc-200  text-klic-muted">
                  <th className="text-left py-2.5 px-4 font-semibold">워크로드 식별자</th>
                  <th className="text-left py-2.5 px-3 font-semibold">클라우드 / 리전</th>
                  <th className="text-left py-2.5 px-3 font-semibold">인스턴스 스펙</th>
                  <th className="text-right py-2.5 px-3 font-semibold">평균 가동률</th>
                  <th className="text-right py-2.5 px-3 font-semibold">월 지출액</th>
                  <th className="text-right py-2.5 px-3 font-semibold">예상 절감액</th>
                  <th className="text-left py-2.5 px-4 font-semibold">최적화 실행</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/70 ">
                {filteredResources.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-zinc-50/70 "
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-zinc-900 ">
                        {row.workload}
                      </div>
                      <div className="text-[11px] text-klic-muted mt-0.5">
                        {row.recommendation}
                      </div>
                    </td>

                    {/* 보더 없는 클라우드 프로바이더 인라인 드롭다운 */}
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenProviderDropdownId(
                          openProviderDropdownId === row.id ? null : row.id
                        );
                      }}
                      className="py-3 px-3 relative cursor-pointer select-none"
                    >
                      <div className="inline-flex items-center gap-1.5 text-zinc-800 ">
                        <span className="font-bold">{row.provider}</span>
                        <span className="text-klic-muted">· {row.region}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-klic-muted" />
                      </div>

                      {openProviderDropdownId === row.id && (
                        <div className="absolute left-3 top-full mt-1 w-44 bg-white  border border-zinc-200  rounded-xl shadow-xl py-1 z-40">
                          {(['AWS', 'GCP', 'Azure'] as const).map((prov) => (
                            <button
                              key={prov}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFinopsRows((prev) =>
                                  prev.map((item) =>
                                    item.id === row.id
                                      ? { ...item, provider: prov }
                                      : item
                                  )
                                );
                                setOpenProviderDropdownId(null);
                              }}
                              className="w-full px-3 py-1.5 text-left hover:bg-zinc-100  flex items-center justify-between"
                            >
                              <span>{prov}</span>
                              {row.provider === prov && (
                                <Check className="w-3.5 h-3.5 text-blue-600" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 font-mono text-klic-muted ">
                      {row.instanceType}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span
                        className={`font-mono font-semibold ${
                          row.cpuAvgPct < 30 ? 'text-blue-600' : 'text-zinc-700 '
                        }`}
                      >
                        {row.cpuAvgPct}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-semibold text-zinc-900 ">
                      ${row.monthlySpendUsd.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-blue-600 ">
                      -${row.potentialSavingsUsd.toLocaleString()}/월
                    </td>

                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() =>
                          setFinopsRows((prev) =>
                            prev.map((item) =>
                              item.id === row.id
                                ? {
                                    ...item,
                                    status:
                                      item.status === '최적화 대기'
                                        ? '예약 전환됨'
                                        : item.status === '예약 전환됨'
                                        ? '축소 완료'
                                        : '최적화 대기',
                                  }
                                : item
                            )
                          )
                        }
                        className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors ${
                          row.status === '최적화 대기'
                            ? 'bg-blue-50  text-blue-700  hover:bg-blue-100'
                            : 'bg-blue-50  text-blue-700 '
                        }`}
                      >
                        {row.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  /* ========================================================================
   * RENDER 3: 데이터 파이프라인 & 스키마 리니지 스튜디오 (StrataFlow Data Studio)
   * ======================================================================== */
  const renderTemplate3DataLineagePortal = () => {
    const LINEAGE_NODES = [
      {
        key: 'source' as const,
        stage: "단계 1 · 수집",
        name: 'Aurora PG + Kafka CDC',
        throughput: '68,320 events/s',
        latency: '0.4s',
        status: '정상 스트리밍',
      },
      {
        key: 'transform' as const,
        stage: "단계 2 · dbt / Spark",
        name: 'dbt_merchant_settlement',
        throughput: '1.42M rows/run',
        latency: '4m 18s',
        status: driftResolved ? '스키마 마이그레이션 완료' : '스키마 드리프트 1건',
      },
      {
        key: 'warehouse' as const,
        stage: "단계 3 · 레이크하우스",
        name: 'Snowflake CORE.FCT_PAYMENTS',
        throughput: '99.98% 무결성',
        latency: '1.2s',
        status: '정상 적재 중',
      },
      {
        key: 'serving' as const,
        stage: "단계 4 · BI 및 특성 저장소",
        name: "경영진 손익 분석 및 이상 거래 탐지 AI",
        throughput: '240 req/s',
        latency: '18ms',
        status: 'SLA 100% 준수',
      },
    ];

    return (
      <div
        onClick={() => setOpenScheduleDropdownId(null)}
        className="rounded-2xl border border-zinc-200  bg-white  overflow-hidden shadow-sm p-6 space-y-6"
      >
        {/* 상단 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 ">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-600 text-klic-on-emphasis text-[10px] font-mono font-bold">
                STRATAFLOW DAG v4.2
              </span>
              <h2 className="text-xl font-bold text-zinc-900 ">
                엔터프라이즈 데이터 파이프라인 & 스키마 리니지 스튜디오
              </h2>
            </div>
            <p className="text-xs text-klic-muted mt-1">
              실시간 CDC 스트림부터 Snowflake 웨어하우스 및 AI 피처 스토어까지의 엔드투엔드 데이터 계보(Lineage)와 스키마 변경을 관제합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setPipelineJobs(INITIAL_PIPELINE_JOBS);
                setDriftResolved(false);
              }}
              className="px-3 py-1.5 rounded-lg border border-zinc-200  text-xs font-medium text-zinc-700  hover:bg-zinc-50 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>초기화</span>
            </button>
            <button
              type="button"
              onClick={() =>
                setPipelineJobs((prev) =>
                  prev.map((j) => ({ ...j, schemaStatus: '정상 동기화', freshnessLag: '0.9초' }))
                )
              }
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-klic-on-emphasis text-xs font-semibold flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>전체 DAG 즉시 동기화</span>
            </button>
          </div>
        </div>

        {/* 인터랙티브 4단계 데이터 리니지 그래프 */}
        <div className="p-5 rounded-xl bg-zinc-50/80  border border-zinc-200/80  space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-800 ">
              실시간 데이터 리니지 토폴로지 (노드를 클릭하여 상·하류 의존성 검사)
            </span>
            <span className="text-klic-muted font-mono">
              활성 스트림 42개 · 일일 처리량 4.8TB
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {LINEAGE_NODES.map((node, idx) => {
              const isSelected = selectedLineageNode === node.key;
              return (
                <div
                  key={node.key}
                  onClick={() => setSelectedLineageNode(node.key)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all relative ${
                    isSelected
                      ? 'bg-white  border-blue-500 shadow-sm'
                      : 'bg-white/70  border-zinc-200  hover:border-zinc-300'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold text-blue-600 ">
                    {node.stage}
                  </div>
                  <div className="text-xs font-bold text-zinc-900  mt-1 truncate">
                    {node.name}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-klic-muted">
                    <span>{node.throughput}</span>
                    <span className="font-mono">지연 {node.latency}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-zinc-100  flex items-center justify-between text-[11px]">
                    <span
                      className={`font-semibold ${
                        node.status.includes('드리프트')
                          ? 'text-amber-600'
                          : 'text-blue-600'
                      }`}
                    >
                      ● {node.status}
                    </span>
                    {idx < 3 && (
                      <ArrowRight className="w-3.5 h-3.5 text-klic-muted hidden md:inline" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 스키마 드리프트 자동 병합 배너 */}
          {!driftResolved && (
            <div className="p-3.5 rounded-xl bg-amber-50/90  border border-amber-200  flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold text-amber-900 ">
                    업스트림 스키마 변경(Schema Drift) 감지:
                  </span>{' '}
                  <span className="text-amber-800  font-mono">
                    settlement.v3.fx_rate
                  </span>{' '}
                  컬럼 타입이 <code className="px-1 py-0.5 rounded bg-white/80">FLOAT</code>에서{' '}
                  <code className="px-1 py-0.5 rounded bg-white/80">NUMERIC(18,6)</code>으로 변경되었습니다.
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDriftResolved(true);
                  setPipelineJobs((prev) =>
                    prev.map((j) =>
                      j.id === 'dag-2'
                        ? { ...j, schemaStatus: '정상 동기화', freshnessLag: '1.4초' }
                        : j
                    )
                  );
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-klic-on-emphasis font-semibold shrink-0"
              >
                하류 Snowflake DDL 자동 마이그레이션 승인
              </button>
            </div>
          )}
        </div>

        {/* 파이프라인 DAG 실행 목록 테이블 */}
        <div className="rounded-xl border border-zinc-200  overflow-hidden">
          <table className="w-full border-collapse text-xs tabular-nums">
            <thead>
              <tr className="bg-zinc-50/80  border-b border-zinc-200  text-klic-muted">
                <th className="text-left py-2.5 px-4 font-semibold">파이프라인 DAG</th>
                <th className="text-left py-2.5 px-3 font-semibold">소스 → 타겟 웨어하우스</th>
                <th className="text-left py-2.5 px-3 font-semibold">동기화 주기</th>
                <th className="text-right py-2.5 px-3 font-semibold">데이터 신선도(Lag)</th>
                <th className="text-right py-2.5 px-3 font-semibold">처리 볼륨</th>
                <th className="text-left py-2.5 px-4 font-semibold">스키마 & 백필 상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/70 ">
              {pipelineJobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-zinc-50/70 "
                >
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-zinc-900 ">
                      {job.dagName}
                    </div>
                    <div className="text-[11px] text-klic-muted">
                      책임 데이터 엔지니어: {job.owner}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="text-zinc-800  font-medium">
                      {job.sourceSystem}
                    </div>
                    <div className="text-[11px] font-mono text-blue-600 ">
                      → {job.destinationTable}
                    </div>
                  </td>

                  {/* 보더 없는 동기화 주기 인라인 드롭다운 */}
                  <td
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenScheduleDropdownId(
                        openScheduleDropdownId === job.id ? null : job.id
                      );
                    }}
                    className="py-3 px-3 relative cursor-pointer select-none"
                  >
                    <div className="inline-flex items-center gap-1.5 text-zinc-700 ">
                      <span>{job.schedule}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-klic-muted" />
                    </div>

                    {openScheduleDropdownId === job.id && (
                      <div className="absolute left-3 top-full mt-1 w-32 bg-white  border border-zinc-200  rounded-xl shadow-xl py-1 z-40">
                        {(
                          [
                            '실시간 CDC',
                            '5분 주기',
                            '1시간 배치',
                            '일일 마감',
                          ] as PipelineJobItem['schedule'][]
                        ).map((sch) => (
                          <button
                            key={sch}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPipelineJobs((prev) =>
                                prev.map((item) =>
                                  item.id === job.id
                                    ? { ...item, schedule: sch }
                                    : item
                                )
                              );
                              setOpenScheduleDropdownId(null);
                            }}
                            className="w-full px-3 py-1.5 text-left hover:bg-zinc-100  flex items-center justify-between"
                          >
                            <span>{sch}</span>
                            {job.schedule === sch && (
                              <Check className="w-3.5 h-3.5 text-blue-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-zinc-700 ">
                    {job.freshnessLag}
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-zinc-800 ">
                    {job.rowsProcessed}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-semibold text-[11px] ${
                        job.schemaStatus === '정상 동기화'
                          ? 'bg-blue-50  text-blue-700 '
                          : job.schemaStatus === '스키마 드리프트 감지'
                          ? 'bg-amber-50  text-amber-700 '
                          : 'bg-blue-50  text-blue-700 '
                      }`}
                    >
                      {job.schemaStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* ========================================================================
   * RENDER 4: 프로덕트 A/B 실험 & 피처 플래그 릴리즈 콘솔 (LaunchGrid Experiment OS)
   * ======================================================================== */
  const renderTemplate4ExperimentConsole = () => (
    <div
      onClick={() => setIsEnvDropdownOpen(false)}
      className="rounded-2xl border border-zinc-200  bg-white  overflow-hidden shadow-sm p-6 space-y-6"
    >
      {/* 상단 피처 플래그 헤더 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-200 ">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-600 text-klic-on-emphasis text-[11px] font-mono font-semibold">
              기능 플래그: checkout_one_click_v2
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-50  text-blue-700  text-[11px] font-semibold">
              ● 베이지안 유의확률 99.2% 도달
            </span>
          </div>
          <h2 className="text-xl font-bold text-zinc-900  mt-1">
            원클릭 생체인증 결제 플로우 A/B 실험 & 점진적 롤아웃 콘솔
          </h2>
        </div>

        {/* 환경 선택 커스텀 드롭다운 & 우승 변형 배포 버튼 */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsEnvDropdownOpen((p) => !p)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200  text-xs font-semibold text-zinc-800 "
            >
              <span>환경: {{ 'Production (운영)': '운영', 'Canary (카나리)': '카나리', 'Staging (검수)': '검수' }[targetEnv]}</span>
              <ChevronDown className="w-3.5 h-3.5 text-klic-muted" />
            </button>

            {isEnvDropdownOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white  border border-zinc-200  rounded-xl shadow-xl py-1 z-40 text-xs">
                {(
                  [
                    'Production (운영)',
                    'Canary (카나리)',
                    'Staging (검수)',
                  ] as const
                ).map((env) => (
                  <button
                    key={env}
                    type="button"
                    onClick={() => {
                      setTargetEnv(env);
                      setIsEnvDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left hover:bg-zinc-100  flex items-center justify-between"
                  >
                    <span>{{ 'Production (운영)': '운영', 'Canary (카나리)': '카나리', 'Staging (검수)': '검수' }[env]}</span>
                    {targetEnv === env && (
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setRolloutPct(100);
              setWinnerPromoted(true);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-klic-on-emphasis text-xs font-semibold"
          >
            {winnerPromoted
              ? '✓ Variant B 100% 정식 배포됨'
              : '우승 변형(Variant B) 100% 승격 배포'}
          </button>
        </div>
      </div>

      {/* 점진적 트래픽 할당(Traffic Split) 슬라이더 패널 */}
      <div className="p-5 rounded-xl bg-zinc-50/80  border border-zinc-200/80  space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div>
            <span className="font-bold text-zinc-900 ">
              실시간 트래픽 라우팅 비율 (SDK Edge 해시 분배)
            </span>
            <span className="text-klic-muted ml-2">
              표본 유저 148,200명 · 노출 기간 12일차
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-klic-muted">실험군 B 할당률 조정:</span>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={rolloutPct}
              onChange={(e) => {
                setRolloutPct(Number(e.target.value));
                setWinnerPromoted(Number(e.target.value) === 100);
              }}
              className="w-36 accent-blue-600 cursor-pointer"
            />
            <span className="font-mono font-bold text-blue-600 w-10 text-right">
              {rolloutPct}%
            </span>
          </div>
        </div>

        {/* 트래픽 분할 바 */}
        <div className="h-7 w-full rounded-lg overflow-hidden flex text-[11px] font-bold text-klic-on-emphasis">
          {100 - rolloutPct > 0 && (
            <div
              style={{ width: `${100 - rolloutPct}%` }}
              className="bg-zinc-500 flex items-center justify-center transition-all"
            >
              대조군 A (기존 결제창) {100 - rolloutPct}%
            </div>
          )}
          {rolloutPct > 0 && (
            <div
              style={{ width: `${rolloutPct}%` }}
              className="bg-blue-600 flex items-center justify-center transition-all"
            >
              실험군 B (원클릭 생체결제) {rolloutPct}%
            </div>
          )}
        </div>
      </div>

      {/* 실험 지표 신뢰구간 및 상대적 상승률(Lift) 매트릭스 */}
      <div className="rounded-xl border border-zinc-200  overflow-hidden">
        <table className="w-full border-collapse text-xs tabular-nums">
          <thead>
            <tr className="bg-zinc-50/80  border-b border-zinc-200  text-klic-muted">
              <th className="text-left py-2.5 px-4 font-semibold">측정 지표</th>
              <th className="text-left py-2.5 px-3 font-semibold">구분</th>
              <th className="text-right py-2.5 px-3 font-semibold">대조군 A</th>
              <th className="text-right py-2.5 px-3 font-semibold">실험군 B</th>
              <th className="text-right py-2.5 px-3 font-semibold">상대적 변화</th>
              <th className="text-left py-2.5 px-3 font-semibold">95% 신뢰구간 분포</th>
              <th className="text-left py-2.5 px-4 font-semibold">판정</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/70 ">
            {INITIAL_EXPERIMENT_METRICS.map((m) => (
              <tr
                key={m.id}
                className="hover:bg-zinc-50/70 "
              >
                <td className="py-3 px-4 font-bold text-zinc-900 ">
                  {m.metricName}
                </td>
                <td className="py-3 px-3 text-klic-muted">{m.category}</td>
                <td className="py-3 px-3 text-right font-mono text-klic-muted ">
                  {m.controlValue}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-zinc-900 ">
                  {m.variantValue}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-blue-600 ">
                  {m.relativeLift}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-zinc-100  relative overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${m.confidencePct}%` }}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-klic-muted">
                      {m.confidencePct}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                      m.status === '유의미한 상승'
                        ? 'bg-blue-50  text-blue-700 '
                        : m.status === '안정 범위'
                        ? 'bg-blue-50  text-blue-700 '
                        : 'bg-zinc-100  text-klic-muted '
                    }`}
                  >
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ========================================================================
   * RENDER 5: 보안 컴플라이언스(SOC2/ISO27001) 자동 감사 포털 (VantaShield)
   * ======================================================================== */
  const renderTemplate5ComplianceVault = () => {
    const filteredControls = controls.filter(
      (c) => controlFilter === '전체' || c.status === controlFilter
    );

    return (
      <div
        onClick={() => setOpenOwnerDropdownId(null)}
        className="rounded-2xl border border-zinc-200  bg-white  overflow-hidden shadow-sm p-6 space-y-6"
      >
        {/* 상단 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 ">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-700 text-klic-on-emphasis text-[10px] font-mono font-bold">
                상시 거버넌스·위험·규정 준수 관리
              </span>
              <h2 className="text-xl font-bold text-zinc-900 ">
                보안 컴플라이언스 자동 감사 & 증거 금고 포털
              </h2>
            </div>
            <p className="text-xs text-klic-muted mt-1">
              클라우드 인프라 설정, IAM 접근 권한, 암호화 키 순환 로그를 24시간 자동 수집하여 외부 감사인 패키지를 생성합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setControls((prev) =>
                  prev.map((c) => ({
                    ...c,
                    status: '자동 검증 통과',
                    lastVerified: '방금 전 자동 재검증됨',
                  }))
                )
              }
              className="px-3.5 py-1.5 rounded-lg bg-klic-inverse  text-klic-on-emphasis  text-xs font-semibold flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>전체 통제항목 스냅샷 재검증</span>
            </button>
          </div>
        </div>

        {/* 4대 국제/국내 보안 인증 준비도 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            {
              name: 'SOC 2 Type II',
              pct: 98.4,
              controls: '124 / 126 통제 통과',
              auditor: 'Deloitte 감사 완료',
            },
            {
              name: 'ISO/IEC 27001:2022',
              pct: 96.0,
              controls: '96 / 100 통제 통과',
              auditor: 'BSI 정기 심사 D-18',
            },
            {
              name: '국내 ISMS-P 인증',
              pct: 94.2,
              controls: '98 / 104 통제 통과',
              auditor: 'KISA 사후심사 준비',
            },
            {
              name: 'PCI-DSS v4.0',
              pct: 100.0,
              controls: '64 / 64 통제 통과',
              auditor: '결제망 무결성 검증됨',
            },
          ].map((fw) => (
            <div
              key={fw.name}
              className="p-4 rounded-xl bg-zinc-50/70  border border-zinc-200/80  space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 ">
                  {fw.name}
                </span>
                <span className="font-mono font-bold text-xs text-blue-600">
                  {fw.pct.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-200  overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${fw.pct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-klic-muted">
                <span>{fw.controls}</span>
                <span>{fw.auditor}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 통제항목 필터 & 증거 목록 테이블 */}
        <div className="rounded-xl border border-zinc-200  overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-200  flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {(
                [
                  '전체',
                  '자동 검증 통과',
                  '증거 갱신 필요',
                  '예외 승인됨',
                ] as const
              ).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setControlFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    controlFilter === st
                      ? 'bg-klic-inverse  text-klic-on-emphasis '
                      : 'text-klic-muted  hover:bg-zinc-100 '
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
            <span className="text-xs text-klic-muted font-mono">
              SHA-256 불변 감사 해시 서명 활성화됨
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50/80  border-b border-zinc-200  text-klic-muted">
                  <th className="text-left py-2.5 px-4 font-semibold">통제 코드</th>
                  <th className="text-left py-2.5 px-3 font-semibold">통제 항목 및 요구사항</th>
                  <th className="text-left py-2.5 px-3 font-semibold">자동 증거 소스</th>
                  <th className="text-left py-2.5 px-3 font-semibold">보안 담당자</th>
                  <th className="text-left py-2.5 px-3 font-semibold">최근 검증 시각</th>
                  <th className="text-left py-2.5 px-4 font-semibold">감사 상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/70 ">
                {filteredControls.map((ctrl) => (
                  <tr
                    key={ctrl.id}
                    className="hover:bg-zinc-50/70 "
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-zinc-900 ">
                        {ctrl.controlCode}
                      </div>
                      <div className="text-[11px] text-klic-muted">{ctrl.framework}</div>
                    </td>

                    <td className="py-3 px-3 font-medium text-zinc-800 ">
                      {ctrl.title}
                    </td>

                    <td className="py-3 px-3 font-mono text-klic-muted ">
                      {ctrl.evidenceSource}
                    </td>

                    {/* 보더 없는 보안 담당자 인라인 드롭다운 */}
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenOwnerDropdownId(
                          openOwnerDropdownId === ctrl.id ? null : ctrl.id
                        );
                      }}
                      className="py-3 px-3 relative cursor-pointer select-none"
                    >
                      <div className="inline-flex items-center gap-2">
                        <PersonAvatar
                          src={ctrl.ownerAvatar}
                          alt={ctrl.owner}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-medium text-zinc-800 ">
                          {ctrl.owner}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-klic-muted" />
                      </div>

                      {openOwnerDropdownId === ctrl.id && (
                        <div className="absolute left-3 top-full mt-1 w-36 bg-white  border border-zinc-200  rounded-xl shadow-xl py-1 z-40">
                          {CSM_PROFILES.map((p) => (
                            <button
                              key={p.name}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setControls((prev) =>
                                  prev.map((item) =>
                                    item.id === ctrl.id
                                      ? {
                                          ...item,
                                          owner: p.name,
                                          ownerAvatar: p.avatar,
                                        }
                                      : item
                                  )
                                );
                                setOpenOwnerDropdownId(null);
                              }}
                              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-zinc-100  text-left"
                            >
                              <PersonAvatar
                                src={p.avatar}
                                alt={p.name}
                                className="w-4 h-4 rounded-full object-cover"
                              />
                              <span>{p.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-klic-muted">{ctrl.lastVerified}</td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md font-semibold text-[11px] ${
                          ctrl.status === '자동 검증 통과'
                            ? 'bg-blue-50  text-blue-700 '
                            : ctrl.status === '증거 갱신 필요'
                            ? 'bg-amber-50  text-amber-700 '
                            : 'bg-zinc-100  text-zinc-700 '
                        }`}
                      >
                        {ctrl.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 상단 5종 신규 애플리케이션 템플릿 전환 바 */}
      <div className="rounded-2xl bg-zinc-100/90  border border-zinc-200/80  p-2 flex flex-wrap items-center gap-1.5">
        {TEMPLATE_TABS.map((tab) => {
          const isActive = activeTemplate === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTemplate(tab.id)}
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

      {/* 선택된 신규 애플리케이션 템플릿 렌더링 */}
      {activeTemplate === 'template-advisor-knowledge' &&
        renderTemplate1RetentionPortal()}
      {activeTemplate === 'template-autonomous-task-lifecycle' &&
        renderTemplate2FinOpsPortal()}
      {activeTemplate === 'template-smart-reorder-supplychain' &&
        renderTemplate3DataLineagePortal()}
      {activeTemplate === 'template-proforma-financial-roi' &&
        renderTemplate4ExperimentConsole()}
      {activeTemplate === 'template-enterprise-reports-center' &&
        renderTemplate5ComplianceVault()}
    </div>
  );
}
