import { PersonAvatar } from '../PersonAvatar';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Terminal,
  Truck,
  Package,
  Plane,
  Server,
  Cpu,
  Sparkles,
  FileCode2,
  GitPullRequest,
  GitCommit,
  GitMerge,
  Building2,
  TrendingUp,
  Layers,
  Filter,
  Plus,
  Copy,
  Check,
  ArrowUpRight,
  ChevronRight,
  Lock,
  RefreshCw,
  FileText,
  UserCheck,
  Zap,
  MessageSquare,
  MapPin,
} from 'lucide-react';
export type TimelineShowcaseMode =
  | 'all-showcase'
  | 'incident-response'
  | 'order-fulfillment'
  | 'release-changelog'
  | 'contract-lifecycle'
  | 'pr-review-chain';

interface TimelineShowcaseBlockProps {
  initialMode?: TimelineShowcaseMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

interface IncidentStep {
  id: string;
  time: string;
  elapsed: string;
  phase: 'detect' | 'triage' | 'mitigate' | 'resolve';
  phaseLabel: string;
  title: string;
  actor: string;
  actorRole: string;
  avatar: string;
  latencyMs: number;
  errorRate: number;
  commandSnippet: string;
  detail: string;
  verified: boolean;
}

const INITIAL_INCIDENT_STEPS: IncidentStep[] = [
  {
    id: 'inc-1',
    time: '02:14:00 KST',
    elapsed: 'T+00m 00s',
    phase: 'detect',
    phaseLabel: '자동 경보 감지',
    title: '결제 원장 API P99 응답 지연 1,840ms 돌파 및 5xx 에러율 4.8% 급증',
    actor: 'Datadog Watchdog',
    actorRole: 'AIOps Anomaly Detector',
    avatar: './placeholders/avatar-27ccdef6fa6f.svg',
    latencyMs: 1840,
    errorRate: 4.8,
    commandSnippet: 'ALERT [SEV-1] service:ledger-core-kr p99_latency > 1500ms (actual: 1840ms) | 5xx_rate: 4.82%',
    detail: '서울 리전(ap-northeast-2) 결제 승인 게이트웨이에서 DB 커넥션 풀 고갈 징후가 포착되어 PagerDuty Sev-1 온콜 호출이 자동 발송되었습니다.',
    verified: true,
  },
  {
    id: 'inc-2',
    time: '02:16:05 KST',
    elapsed: 'T+02m 05s',
    phase: 'triage',
    phaseLabel: '온콜 투입 · 분석',
    title: 'Primary 당번 엔지니어 워룸 접속 및 직전 카나리 배포(v4.12.2) 상관관계 식별',
    actor: '김태호',
    actorRole: 'Principal SRE · Primary On-Call',
    avatar: './placeholders/avatar-b4131e0b7eff.svg',
    latencyMs: 1620,
    errorRate: 4.1,
    commandSnippet: '$ flux-cli trace inspect --service ledger-core --since 15m --compare-version v4.12.1..v4.12.2',
    detail: '분산 트레이스 대조 결과 v4.12.2에 포함된 배치 정산 쿼리가 트랜잭션 락을 장시간 점유하며 PgBouncer 유휴 세션을 잠식함을 확인했습니다.',
    verified: true,
  },
  {
    id: 'inc-3',
    time: '02:19:30 KST',
    elapsed: 'T+05m 30s',
    phase: 'mitigate',
    phaseLabel: '카나리 롤백 완화',
    title: 'v4.12.2 카나리 파드 트래픽 가중치 0% 드레인 및 v4.12.1 안정 버전 즉시 복원',
    actor: '박지훈',
    actorRole: 'Staff Platform Engineer',
    avatar: './placeholders/avatar-51747f419874.svg',
    latencyMs: 640,
    errorRate: 0.9,
    commandSnippet: '$ kubectl argo rollouts abort ledger-core-prod -n prod-kr && kubectl argo rollouts undo ledger-core-prod',
    detail: 'Argo Rollouts를 통해 오염된 카나리 파드 12개를 즉시 격리하고, 안정 검증된 v4.12.1 리비전으로 100% 라우팅을 복구했습니다.',
    verified: true,
  },
  {
    id: 'inc-4',
    time: '02:24:15 KST',
    elapsed: 'T+10m 15s',
    phase: 'mitigate',
    phaseLabel: '커넥션 풀 리밸런싱',
    title: 'PgBouncer 교착 세션 강제 회수 및 Read-Replica 읽기 분산 가중치 상향',
    actor: '한소윤',
    actorRole: 'Senior DBRE',
    avatar: './placeholders/avatar-157a5491730e.svg',
    latencyMs: 210,
    errorRate: 0.08,
    commandSnippet: 'SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = \'idle in transaction\' AND query_start < now() - interval \'30s\';',
    detail: '잔여 데드락 세션 38건을 정리하고 PgBouncer max_client_conn 한도를 4,000에서 6,000으로 무중단 확장했습니다.',
    verified: true,
  },
  {
    id: 'inc-5',
    time: '02:32:40 KST',
    elapsed: 'T+18m 40s',
    phase: 'resolve',
    phaseLabel: '정상화 · 종료 검증',
    title: '전 리전 P99 지연시간 118ms 복귀 확인 및 Sev-1 상황 종료 선언',
    actor: '김태호',
    actorRole: 'Principal SRE · Incident Commander',
    avatar: './placeholders/avatar-b4131e0b7eff.svg',
    latencyMs: 118,
    errorRate: 0.01,
    commandSnippet: 'STATUS [RESOLVED] MTTR: 18m 40s | Zero Data Loss Verified (WAL LSN #0/48A9210) | Postmortem: RFC-108',
    detail: '10분 연속 에러율 0.01% 미만 및 원장 정합성 대사 100% 일치를 검증한 후 장애를 최종 종료 처리했습니다.',
    verified: true,
  },
];

interface HardwareShipment {
  id: string;
  poNumber: string;
  itemTitle: string;
  vendor: string;
  destination: string;
  currentStageIndex: number;
  etaDate: string;
  tempCelsius: string;
  shockG: string;
  sealHash: string;
  stages: {
    step: number;
    label: string;
    location: string;
    timestamp: string;
    owner: string;
    status: 'done' | 'current' | 'upcoming';
    note: string;
  }[];
}

const HARDWARE_SHIPMENTS: HardwareShipment[] = [
  {
    id: 'ship-h200',
    poNumber: 'PO-2026-8841',
    itemTitle: '고성능 AI 추론 서버 랙 #04 (수랭식 통합 섀시)',
    vendor: '삼성전자 평택 서버캠퍼스',
    destination: '서울 가산 IDC 4층 Cage-B · Rack 14',
    currentStageIndex: 3,
    etaDate: '2026-04-28 16:00 KST',
    tempCelsius: '18.4°C',
    shockG: '0.11G (정상)',
    sealHash: 'SHA256:9f84c2b1...e047a',
    stages: [
      {
        step: 1,
        label: '발주 승인 & BOM 확정',
        location: '서울 본사 조달팀',
        timestamp: '04.18 10:20',
        owner: '최윤아 수석',
        status: 'done',
        note: 'CFO 전자결재 승인 완료 및 광트랜시버 144개 번들 스펙 확정',
      },
      {
        step: 2,
        label: '보안 펌웨어 & TPM 2.0 주입',
        location: '평택 서버 엔지니어링 랩',
        timestamp: '04.22 15:45',
        owner: '임우빈 수석 (보안관제)',
        status: 'done',
        note: 'Secure Boot 서명 키 주입 및 48시간 번인(Burn-in) 부하 테스트 통과',
      },
      {
        step: 3,
        label: '특수 항온항습 카고 출발',
        location: '평택 캠퍼스 → 인천 물류허브',
        timestamp: '04.25 09:10',
        owner: '대한항공 특수화물',
        status: 'done',
        note: '항온항습 컨테이너 탑재 완료, 진동 센서 실시간 위성 텔레메트리 연결',
      },
      {
        step: 4,
        label: '보안 검수 & 무진동 보안 이송',
        location: '인천 물류허브 → 가산 IDC',
        timestamp: '04.27 11:30 (진행중)',
        owner: '강민수 보안물류팀',
        status: 'current',
        note: '반입 보안 필증 교부 완료 · 무진동 에어서스펜션 보안 차량 이동 중',
      },
      {
        step: 5,
        label: '랙 마운트 & 400G 광케이블 개통',
        location: '서울 가산 IDC Cage-B',
        timestamp: '04.28 16:00 예정',
        owner: '정우진 DC 엔지니어',
        status: 'upcoming',
        note: '직수 냉각 매니폴드 결합 및 InfiniBand NDR 패브릭 핑 검증 예정',
      },
    ],
  },
  {
    id: 'ship-hsm',
    poNumber: 'PO-2026-8904',
    itemTitle: '금융권 네트워크 HSM 7 보안모듈 (FIPS 140-3 Level 3) 3대',
    vendor: '안랩 클라우드 보안연구소',
    destination: '판교 DR 센터 금고형 보안 랙 #02',
    currentStageIndex: 4,
    etaDate: '2026-04-27 18:00 KST',
    tempCelsius: '19.1°C',
    shockG: '0.06G (정상)',
    sealHash: 'SHA256:3c71a9d8...71b2f',
    stages: [
      {
        step: 1,
        label: '발주 승인 & 암호모듈 검증',
        location: '서울 본사 CISO실',
        timestamp: '04.14 14:00',
        owner: '이현우 CISO',
        status: 'done',
        note: '금융보안원 마스터키 이중화 규격 검토 완료',
      },
      {
        step: 2,
        label: '공장 봉인 & 물리 템퍼 씰 부착',
        location: '판교 암호모듈 제조시설',
        timestamp: '04.19 08:30',
        owner: '문태준 수석',
        status: 'done',
        note: '홀로그램 시리얼 씰 촬영 및 해시 원장 등록 완료',
      },
      {
        step: 3,
        label: '특수 보안 전용차량 운송',
        location: '판교 연구소 → 분당 보안허브',
        timestamp: '04.23 19:20',
        owner: '한진 특수보안물류',
        status: 'done',
        note: '듀얼 GPS 비콘 정상 작동 확인',
      },
      {
        step: 4,
        label: '보안 검수 및 무장 호송 이송 완료',
        location: '분당 보안허브 → 판교 DR 센터',
        timestamp: '04.26 17:10',
        owner: '강민수 보안물류팀',
        status: 'done',
        note: '외관 봉인 씰 무결성 대조 100% 일치 확인',
      },
      {
        step: 5,
        label: '3인 키 세레머니(Key Ceremony) & 개통',
        location: '판교 DR 센터 보안 구역',
        timestamp: '04.27 15:00 (진행중)',
        owner: '김태호 · 이현우 · 한소윤',
        status: 'current',
        note: 'M-of-N 스마트카드 쿼럼(3/5) 초기화 및 마스터 서명 키 주입 진행 중',
      },
    ],
  },
];

interface ReleaseNoteItem {
  version: string;
  date: string;
  codename: string;
  tag: 'MAJOR' | 'MINOR' | 'SECURITY';
  summary: string;
  metricsLabel: string;
  metricsDelta: string;
  changes: {
    type: 'NEW' | 'IMPROVED' | 'FIXED' | 'SECURITY';
    text: string;
    module: string;
  }[];
  migrationDiff: {
    before: string;
    after: string;
  };
}

const RELEASE_NOTES: ReleaseNoteItem[] = [
  {
    version: 'v2.4.0',
    date: '2026-04-24',
    codename: '제로 카피 Arrow 스트림 엔진',
    tag: 'MAJOR',
    summary:
      '대용량 정산 그리드와 스트리밍 파이프라인 간 직렬화 오버헤드를 제거하는 Apache Arrow 기반 Zero-Copy 메모리 버퍼 엔진이 기본 활성화되었습니다.',
    metricsLabel: '1,000만 행 집계 처리량',
    metricsDelta: '+310% 향상 (1.8s → 0.44s)',
    changes: [
      {
        type: 'NEW',
        module: 'KLIC/data-grid',
        text: 'WebWorker 오프로딩 기반 100만 행 가상 스크롤 및 실시간 피벗 그룹핑 엔진 출시',
      },
      {
        type: 'IMPROVED',
        module: 'KLIC/ledger-core',
        text: '멀티 리전 원장 대사(Reconciliation) 배치 메모리 점유율 42% 절감',
      },
      {
        type: 'SECURITY',
        module: 'KLIC/auth-sdk',
        text: 'Ed25519 JWKS 서명 키 무중단 3-Ring 자동 로테이션 프로토콜 기본 적용',
      },
      {
        type: 'FIXED',
        module: 'KLIC/gantt',
        text: '타임존 전환(UTC ↔ KST) 시 자정 경계 마일스톤 바가 1px 밀리던 렌더링 오차 수정',
      },
    ],
    migrationDiff: {
      before: `const grid = createFluxGrid({ serialization: 'json-row', workerPool: false });`,
      after: `const grid = createFluxGrid({ serialization: 'arrow-zero-copy', workerThreads: 4 });`,
    },
  },
  {
    version: 'v2.3.2',
    date: '2026-04-10',
    codename: 'FIPS 140-3 감사 보호 정책',
    tag: 'SECURITY',
    summary:
      '금융권 및 공공 클라우드 컴플라이언스 심사를 위한 감사 로그 해시 체인 검증기와 Sudo 재인증 정책이 강화되었습니다.',
    metricsLabel: '보안 감사 증적 검증 속도',
    metricsDelta: '99.999% 무결성 보장',
    changes: [
      {
        type: 'SECURITY',
        module: 'KLIC/audit-trail',
        text: '모든 권한 변경 이벤트에 Merkle Tree SHA-256 연쇄 서명 해시 자동 주입',
      },
      {
        type: 'NEW',
        module: 'KLIC/rbac-matrix',
        text: '임시 권한 승격(JIT Access) 만료 15분 전 슬랙 DM 자동 연장/회수 프롬프트 추가',
      },
      {
        type: 'FIXED',
        module: 'KLIC/sso-saml',
        text: 'Okta IdP 메타데이터 인증서 다중 슬롯 교체 시 간헐적 캐시 미스 현상 해결',
      },
    ],
    migrationDiff: {
      before: `auditLogger.record({ event: 'ROLE_UPDATE', signed: false });`,
      after: `auditLogger.record({ event: 'ROLE_UPDATE', merkleChain: 'sha256-strict' });`,
    },
  },
  {
    version: 'v2.2.0',
    date: '2026-03-22',
    codename: '자율 분류 업무 흐름',
    tag: 'MINOR',
    summary:
      'SRE 인시던트 발생 시 최근 배포 커밋과 메트릭 스파이크 상관관계를 자동 매칭하는 타임라인 동기화 뷰가 도입되었습니다.',
    metricsLabel: '평균 원인 식별 시간 (MTTD)',
    metricsDelta: '-64% 단축 (11m → 3.9m)',
    changes: [
      {
        type: 'NEW',
        module: 'KLIC/timeline',
        text: 'P99 레이턴시 파형과 배포/롤백 이벤트를 단일 축에서 대조하는 인터랙티브 타임라인 추가',
      },
      {
        type: 'IMPROVED',
        module: 'KLIC/flow-canvas',
        text: 'DAG 플로우 캔버스 200개 이상 노드 렌더링 시 120fps 프레임 유지 최적화',
      },
    ],
    migrationDiff: {
      before: `<TimelineView events={logs} syncMetrics={false} />`,
      after: `<TimelineView events={logs} syncMetrics="p99-latency-curve" />`,
    },
  },
];

interface ContractMilestone {
  id: string;
  date: string;
  quarter: string;
  stageTitle: string;
  badge: string;
  seats: number;
  arrValue: string;
  arrNumeric: number; // 억 단위
  champion: string;
  championRole: string;
  summary: string;
  deliverables: string[];
}

const CONTRACT_JOURNEY: ContractMilestone[] = [
  {
    id: 'ms-1',
    date: '2024.03.12',
    quarter: '2024 Q1',
    stageTitle: '기술 검증 샌드박스 (Technical PoC) 착수',
    badge: 'PoC 개시',
    seats: 25,
    arrValue: '₩0 (무료 검증)',
    arrNumeric: 0.4,
    champion: '김도현 VP of Eng',
    championRole: '기술 의사결정권자',
    summary: '초당 15,000건 결제 원장 정합성 대사 성능 검증 및 금융망 망분리 프록시 연동 성공',
    deliverables: ['망분리 VPC 엔드포인트 개통', '성능 벤치마크 리포트 (P99 38ms 달성)'],
  },
  {
    id: 'ms-2',
    date: '2024.06.01',
    quarter: '2024 Q2',
    stageTitle: '연간 엔터프라이즈 본계약 체결 (Initial Land)',
    badge: '신규 수주',
    seats: 150,
    arrValue: '₩1.8억 / 년',
    arrNumeric: 1.8,
    champion: '박서연 CFO',
    championRole: '예산 승인권자',
    summary: '코어뱅킹 정산본부 및 SRE 관제실 150석 우선 도입, 99.99% 가용성 SLA 특약 포함',
    deliverables: ['전담 Technical Account Manager 배정', 'SSO SAML 2.0 전사 연동 완료'],
  },
  {
    id: 'ms-3',
    date: '2025.01.18',
    quarter: '2025 Q1',
    stageTitle: '금융보안원 ISMS-P & SOC 2 Type II 합동 감사 통과',
    badge: '컴플라이언스',
    seats: 220,
    arrValue: '₩2.6억 / 년',
    arrNumeric: 2.6,
    champion: '이현우 CISO',
    championRole: '정보보호최고책임자',
    summary: '온프레미스 HSM 키 연동 및 감사 로그 위변조 방지 검증 통과로 보안 등급 Tier-1 획득',
    deliverables: ['FIPS 140-3 암호모듈 증적 제출', '보안실 70석 추가 증설'],
  },
  {
    id: 'ms-4',
    date: '2025.07.01',
    quarter: '2025 Q3',
    stageTitle: '전사 데이터 그리드 & 자율 워크플로우 확장 (Expansion)',
    badge: '대규모 증설',
    seats: 480,
    arrValue: '₩5.2억 / 년',
    arrNumeric: 5.2,
    champion: '김도현 CTO',
    championRole: '최고기술책임자',
    summary: '카드·여신·외환 6개 자회사로 워크스페이스 통합 확장, 시트 수 2.1배 증설',
    deliverables: ['멀티 테넌트 조직 거버넌스 활성화', '연간 처리 트랜잭션 50억 건 볼륨 약정'],
  },
  {
    id: 'ms-5',
    date: '2026.04.15',
    quarter: '2026 Q2',
    stageTitle: '3개년 전략적 마스터 약정 갱신 (Multi-Year ELA)',
    badge: '다년 갱신 완료',
    seats: 850,
    arrValue: '₩8.4억 / 년',
    arrNumeric: 8.4,
    champion: '박서연 CFO · 김도현 CTO',
    championRole: '공동 총괄 스폰서',
    summary: '2029년까지 3개년 총 계약 가치(TCV) ₩25.2억 규모 무제한 모듈 ELA 계약 서명 완료',
    deliverables: ['전용 베어메탈 격리 클러스터 제공', '15분 이내 긴급 온콜 직통 핫라인 보장'],
  },
];

interface PrStepItem {
  id: string;
  timestamp: string;
  type: 'commit' | 'ci' | 'review' | 'approval' | 'merge';
  title: string;
  author: string;
  role: string;
  avatar: string;
  hash?: string;
  statusLabel: string;
  statusTone: 'indigo' | 'emerald' | 'amber';
  summary: string;
  codeDiff?: {
    file: string;
    removedLine: string;
    addedLine: string;
  };
  resolved?: boolean;
}

const INITIAL_PR_STEPS: PrStepItem[] = [
  {
    id: 'pr-1',
    timestamp: '오늘 13:10',
    type: 'commit',
    title: 'feat(ledger): 무중단 샤드 리밸런싱 시 이중 쓰기(Dual-Write) 버퍼 추가',
    author: '김태호',
    role: "책임 엔지니어",
    avatar: './placeholders/avatar-b4131e0b7eff.svg',
    hash: 'c81a4f2',
    statusLabel: "GPG 서명 검증 완료",
    statusTone: 'indigo',
    summary: '샤드 마이그레이션 구간에서 인입되는 초당 4만 건의 원장 트랜잭션을 유실 없이 병합하기 위한 WAL 링 버퍼 구현',
  },
  {
    id: 'pr-2',
    timestamp: '오늘 13:18',
    type: 'ci',
    title: 'GitHub Actions · Enterprise CI/CD 파이프라인 4대 검증 게이트 통과',
    author: 'KLIC CI Runner',
    role: 'k8s-ephemeral-runner-09',
    avatar: './placeholders/avatar-27ccdef6fa6f.svg',
    hash: 'e09b2d1',
    statusLabel: "테스트 1,420개 통과 (1분 42초)",
    statusTone: 'emerald',
    summary: 'Unit/Integration 테스트 100% 통과 · Semgrep 정적 보안 스캔 취약점 0건 · 번들 사이즈 -4.2KB 감소',
  },
  {
    id: 'pr-3',
    timestamp: '오늘 14:05',
    type: 'review',
    title: '인라인 코드 리뷰 코멘트 & 메모리 펜스(Memory Fence) 최적화 반영',
    author: '박지훈',
    role: "수석 SRE · 검토자",
    avatar: './placeholders/avatar-51747f419874.svg',
    hash: '7f3c9a0',
    statusLabel: '변경 제안 반영됨',
    statusTone: 'amber',
    summary: '원자적 오프셋 커밋 시 경쟁 상태(Race Condition)를 방지하기 위해 SeqCst 메모리 배리어를 명시적으로 지정하도록 제안했습니다.',
    codeDiff: {
      file: 'packages/ledger-core/src/shardRebalancer.ts:142',
      removedLine: '-  await walBuffer.flushOffset(nextShardId, { atomic: false });',
      addedLine: '+  await walBuffer.flushOffset(nextShardId, { atomic: true, memoryOrder: "SeqCst" });',
    },
    resolved: true,
  },
  {
    id: 'pr-4',
    timestamp: '오늘 14:42',
    type: 'approval',
    title: 'CODEOWNERS 필수 승인 완료 (2/2 Required Approvers LGTM)',
    author: '한소윤 · 박지훈',
    role: "데이터베이스 및 SRE 책임자",
    avatar: './placeholders/avatar-157a5491730e.svg',
    statusLabel: "승인됨 · 병합 준비 완료",
    statusTone: 'emerald',
    summary: '보안 아키텍처 검토 및 스테이징 카오스 엔지니어링 테스트(노드 2대 강제 종료 시 무손실 검증)를 모두 통과했습니다.',
  },
];

export const TimelineShowcaseBlock: React.FC<TimelineShowcaseBlockProps> = ({
  initialMode = 'incident-response',
}) => {
  const [activeTab, setActiveTab] = useState<TimelineShowcaseMode>(initialMode);

  useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode]);

  // 1. Incident Response state
  const [incidentSteps, setIncidentSteps] = useState<IncidentStep[]>(INITIAL_INCIDENT_STEPS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('inc-3');
  const [incidentFilter, setIncidentFilter] = useState<'all' | 'detect' | 'triage' | 'mitigate' | 'resolve'>('all');
  const [copiedCmd, setCopiedCmd] = useState(false);

  // 2. Order Fulfillment state
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>('ship-h200');
  const [selectedStageStep, setSelectedStageStep] = useState<number>(4);
  const [signedRackCheck, setSignedRackCheck] = useState<boolean>(false);

  // 3. Release Changelog state
  const [releaseTypeFilter, setReleaseTypeFilter] = useState<'ALL' | 'NEW' | 'IMPROVED' | 'SECURITY' | 'FIXED'>('ALL');
  const [expandedDiffVersion, setExpandedDiffVersion] = useState<string>('v2.4.0');

  // 4. Contract Lifecycle state
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('ms-5');
  const [simulateQ4Upsell, setSimulateQ4Upsell] = useState<boolean>(false);

  // 5. PR Review Chain state
  const [prSteps, setPrSteps] = useState<PrStepItem[]>(INITIAL_PR_STEPS);
  const [isPrMerged, setIsPrMerged] = useState<boolean>(false);

  const selectedIncident =
    incidentSteps.find((s) => s.id === selectedIncidentId) || incidentSteps[0];

  const filteredIncidentSteps =
    incidentFilter === 'all'
      ? incidentSteps
      : incidentSteps.filter((s) => s.phase === incidentFilter);

  const activeShipment =
    HARDWARE_SHIPMENTS.find((s) => s.id === selectedShipmentId) || HARDWARE_SHIPMENTS[0];

  const activeStageDetail =
    activeShipment.stages.find((st) => st.step === selectedStageStep) ||
    activeShipment.stages[activeShipment.currentStageIndex];

  const activeMilestone =
    CONTRACT_JOURNEY.find((m) => m.id === selectedMilestoneId) || CONTRACT_JOURNEY[4];

  const handleCopyCommand = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 1800);
  };

  const handleAddPostmortemLog = () => {
    const exists = incidentSteps.some((s) => s.id === 'inc-6');
    if (exists) {
      setSelectedIncidentId('inc-6');
      return;
    }
    const newStep: IncidentStep = {
      id: 'inc-6',
      time: '02:45:00 KST',
      elapsed: 'T+31m 00s',
      phase: 'resolve',
      phaseLabel: '재발 방지 가드레일 배포',
      title: 'CI 파이프라인에 장기 트랜잭션 락 정적 검출 룰(pg-lock-lint) 강제 적용',
      actor: '박지훈',
      actorRole: 'Staff Platform Engineer',
      avatar: './placeholders/avatar-51747f419874.svg',
      latencyMs: 112,
      errorRate: 0.0,
      commandSnippet: '$ flux-cli policy enforce --rule no-unbounded-tx-lock --env production',
      detail: '동일 유형의 배치 쿼리가 승인 없이 카나리에 배포되지 않도록 PR 단계에서 실행계획(EXPLAIN) 잠금 범위를 자동 차단합니다.',
      verified: true,
    };
    setIncidentSteps((prev) => [...prev, newStep]);
    setSelectedIncidentId('inc-6');
  };

  const showSection = (mode: TimelineShowcaseMode) =>
    activeTab === 'all-showcase' || activeTab === mode;

  return (
    <div className="space-y-8">
      {/* 상단 서브탭 스위처 (Double-Bezel Light Surface) */}
      <div className="rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs">
        <div className="rounded-[14px] bg-white  border border-zinc-200/80  px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50  border border-blue-200/80  flex items-center justify-center text-blue-600 ">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900  tracking-tight">
                엔터프라이즈 타임라인 & 이벤트 체인 쇼케이스
              </div>
              <div className="text-[11px] text-klic-muted ">
                장애 워룸 분 단위 복구 · 하드웨어 조달 물류 · 릴리즈 노트 · 고객사 계약 성장 · PR 리뷰 체인 5종
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-zinc-100/90  p-1 rounded-xl border border-zinc-200/70 ">
            {[
              { id: 'incident-response', label: '1. 장애 감지 복구' },
              { id: 'order-fulfillment', label: '2. 장비 조달 배송' },
              { id: 'release-changelog', label: '3. 릴리즈 노트' },
              { id: 'contract-lifecycle', label: '4. 고객사 계약 히스토리' },
              { id: 'pr-review-chain', label: '5. 코드 리뷰 실행' },
              { id: 'all-showcase', label: '전체 보기' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TimelineShowcaseMode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white  text-blue-600  shadow-2xs border border-zinc-200/80 '
                      : 'text-klic-muted  hover:text-zinc-900 '
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================================
          1. 장애 감지 복구 타임라인 (timeline-incident-response)
      ===================================================================== */}
      {showSection('incident-response') && (
        <section className="rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
          {/* 상단 베젤 바 */}
          <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-50  border border-blue-200/80  text-[10px] font-mono font-bold text-blue-600 ">
                INC-2026-0419 · 심각도 1 해결됨
              </span>
              <span className="text-xs font-bold text-zinc-900 ">
                장애 감지 및 분 단위 무중단 복구 워룸 타임라인
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-klic-muted ">
              <span>평균 탐지 시간: 1분 12초</span>
              <span>·</span>
              <span>평균 대응 시작 시간: 2분 05초</span>
              <span>·</span>
              <span className="text-blue-600  font-bold">평균 복구 시간: 18분 40초</span>
            </div>
          </div>

          {/* 메인 화이트 카드 */}
          <div className="rounded-[14px] bg-white  border border-zinc-200/80  p-5 space-y-5">
            {/* 상단 KPI 4열 요약 & 액션 바 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  label: '감지 소요 (MTTD)',
                  value: '1분 12초',
                  sub: 'AIOps 이상 징후 자동 포착',
                  badge: 'SLA 목표 3분 이내',
                  tone: 'indigo',
                },
                {
                  label: '초동 투입 (MTTA)',
                  value: '2분 05초',
                  sub: 'Primary 당번 워룸 즉시 합류',
                  badge: '1차 호출 즉시 응답',
                  tone: 'emerald',
                },
                {
                  label: '완전 복구 (MTTR)',
                  value: '18분 40초',
                  sub: 'Argo 카나리 롤백 & 풀 리밸런싱',
                  badge: '데이터 유실 0건',
                  tone: 'emerald',
                },
                {
                  label: '영향 범위 (Blast Radius)',
                  value: '0.00% 유실',
                  sub: 'WAL 링 버퍼 재실행 100% 복원',
                  badge: '원장 대사 검증됨',
                  tone: 'amber',
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-zinc-50/80  border border-zinc-200/80  p-3.5 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-klic-muted ">
                      {stat.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white  border border-zinc-200/70  text-[10px] font-mono font-semibold text-zinc-700 ">
                      {stat.badge}
                    </span>
                  </div>
                  <div className="text-lg font-bold font-mono text-zinc-900  mt-1.5">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-klic-muted  mt-0.5">
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* SVG P99 응답 지연 곡선 & 타임라인 마커 동기화 차트 */}
            <div className="rounded-xl bg-zinc-50/70  border border-zinc-200/80  p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600 " />
                  <span className="text-xs font-bold text-zinc-900 ">
                    P99 레이턴시 스파이크 파형 & 타임라인 이벤트 동기화 (클릭하여 시점 분석)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span className="flex items-center gap-1.5 text-blue-600 ">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> 피크 1,840ms (02:14)
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-600 ">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> 복구 후 118ms (02:32)
                  </span>
                </div>
              </div>

              <svg viewBox="0 0 760 135" className="w-full h-32 overflow-visible">
                <defs>
                  <linearGradient id="incLatencyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--klic-component-block-color-accent)" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="var(--klic-component-block-color-accent)" stopOpacity="0.01" />
                  </linearGradient>
                </defs>
                {/* 수평 가이드라인 */}
                <line x1="40" y1="25" x2="730" y2="25" stroke="var(--klic-component-block-color-border)" strokeDasharray="3 3" strokeWidth="1" />
                <line x1="40" y1="65" x2="730" y2="65" stroke="var(--klic-component-block-color-border)" strokeDasharray="3 3" strokeWidth="1" />
                <line x1="40" y1="105" x2="730" y2="105" stroke="var(--klic-component-block-color-border)" strokeWidth="1" />

                <text x="8" y="28" className="fill-zinc-400 text-[9px] font-mono">1800ms</text>
                <text x="8" y="68" className="fill-zinc-400 text-[9px] font-mono">800ms</text>
                <text x="8" y="108" className="fill-zinc-400 text-[9px] font-mono">100ms</text>

                {/* 영역 및 곡선 */}
                <path
                  d="M 60 102 L 120 24 L 250 34 L 410 74 L 560 96 L 700 102 L 700 105 L 60 105 Z"
                  fill="url(#incLatencyGrad)"
                />
                <path
                  d="M 60 102 L 120 24 L 250 34 L 410 74 L 560 96 L 700 102"
                  fill="none"
                  stroke="var(--klic-component-block-color-accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 인터랙티브 이벤트 마커 노드 */}
                {[
                  { id: 'inc-1', x: 120, y: 24, label: '02:14 경보', ms: '1,840ms', color: 'var(--klic-component-block-color-accent)' },
                  { id: 'inc-2', x: 250, y: 34, label: '02:16 분석', ms: '1,620ms', color: 'var(--klic-component-block-color-warning)' },
                  { id: 'inc-3', x: 410, y: 74, label: '02:19 롤백', ms: '640ms', color: 'var(--klic-component-block-color-accent)' },
                  { id: 'inc-4', x: 560, y: 96, label: '02:24 풀 확장', ms: '210ms', color: 'var(--klic-component-block-color-accent)' },
                  { id: 'inc-5', x: 700, y: 102, label: '02:32 정상화', ms: '118ms', color: 'var(--klic-component-block-color-accent)' },
                ].map((pt) => {
                  const isSel = selectedIncidentId === pt.id;
                  return (
                    <g
                      key={pt.id}
                      onClick={() => setSelectedIncidentId(pt.id)}
                      className="cursor-pointer"
                    >
                      <line
                        x1={pt.x}
                        y1={pt.y}
                        x2={pt.x}
                        y2={105}
                        stroke={pt.color}
                        strokeWidth={isSel ? '2' : '1'}
                        strokeDasharray="2 2"
                      />
                      {isSel && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="11"
                          fill={pt.color}
                          fillOpacity="0.16"
                        />
                      )}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSel ? '6' : '4.5'}
                        fill="var(--klic-component-block-color-panel)"
                        stroke={pt.color}
                        strokeWidth="2.5"
                      />
                      <text
                        x={pt.x}
                        y={122}
                        textAnchor="middle"
                        className={`text-[10px] font-mono ${
                          isSel ? 'fill-blue-600 font-bold' : 'fill-zinc-500'
                        }`}
                      >
                        {pt.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* 필터 바 & 재발 방지 스텝 추가 버튼 */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: '전체 타임라인' },
                  { id: 'detect', label: '자동 경보' },
                  { id: 'triage', label: '원인 분석' },
                  { id: 'mitigate', label: '롤백 · 완화' },
                  { id: 'resolve', label: '복구 검증' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setIncidentFilter(f.id as typeof incidentFilter)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      incidentFilter === f.id
                        ? 'bg-blue-50/70  text-blue-700  border-blue-300 '
                        : 'bg-white  text-klic-muted  border-zinc-200/80  hover:bg-zinc-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleAddPostmortemLog}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-klic-on-emphasis text-xs font-semibold shadow-2xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                재발 방지 가드레일 로그 추가
              </button>
            </div>

            {/* 좌측 수직 타임라인 + 우측 실시간 커맨드 & 텔레메트리 인스펙터 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* 좌측 수직 타임라인 (7 cols) */}
              <div className="lg:col-span-7 relative pl-6 space-y-3 before:content-[''] before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-[2px] before:bg-zinc-200 ">
                {filteredIncidentSteps.map((step) => {
                  const isSelected = step.id === selectedIncident.id;
                  const dotStyle =
                    step.phase === 'detect'
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : step.phase === 'triage'
                      ? 'border-amber-500 bg-amber-50 text-amber-600'
                      : step.phase === 'mitigate'
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-blue-500 bg-blue-50 text-blue-600';

                  return (
                    <div
                      key={step.id}
                      onClick={() => setSelectedIncidentId(step.id)}
                      className={`relative rounded-xl border p-3.5 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50/45  border-blue-500/80 ring-2 ring-blue-500/15'
                          : 'bg-white  border-zinc-200/80  hover:border-zinc-300'
                      }`}
                    >
                      {/* 타임라인 원형 노드 */}
                      <span
                        className={`absolute -left-[21px] top-4 w-4 h-4 rounded-full border-2 flex items-center justify-center ${dotStyle}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      </span>

                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-zinc-900 ">
                            {step.time}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-zinc-100  text-[10px] font-mono font-semibold text-klic-muted ">
                            {step.elapsed}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-white  border border-zinc-200/80  text-[10px] font-semibold text-zinc-700 ">
                            {step.phaseLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-mono">
                          <span className="text-klic-muted">P99: {step.latencyMs}ms</span>
                          <span className="text-klic-muted">|</span>
                          <span
                            className={
                              step.errorRate > 1
                                ? 'text-blue-600 font-bold'
                                : 'text-blue-600 font-semibold'
                            }
                          >
                            5xx: {step.errorRate}%
                          </span>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-zinc-900  leading-snug">
                        {step.title}
                      </div>

                      <div className="mt-2.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <PersonAvatar
                            src={step.avatar}
                            alt={step.actor}
                            className="w-5 h-5 rounded-full object-cover border border-zinc-200"
                          />
                          <span className="text-[11px] font-semibold text-zinc-700 ">
                            {step.actor}
                          </span>
                          <span className="text-[11px] text-klic-muted">· {step.actorRole}</span>
                        </div>
                        <span className="text-[10px] font-mono text-blue-600  font-semibold">
                          로그 상세 보기 →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 우측 선택된 타임라인 스텝 상세 인스펙터 (5 cols) */}
              <div className="lg:col-span-5 rounded-xl bg-zinc-50/80  border border-zinc-200/80  p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-200/80  pb-3">
                  <div>
                    <div className="text-[10px] font-mono font-bold text-blue-600  uppercase">
                      비상 대응 단계 상세 · {selectedIncident.elapsed}
                    </div>
                    <div className="text-sm font-bold text-zinc-900  mt-0.5">
                      {selectedIncident.phaseLabel} ({selectedIncident.time})
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-blue-50  border border-blue-200/80  text-[10px] font-mono font-bold text-blue-700  flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 감사 서명됨
                  </span>
                </div>

                <p className="text-xs text-klic-muted  leading-relaxed">
                  {selectedIncident.detail}
                </p>

                {/* 실행된 CLI / SQL 커맨드 스니펫 (라이트 모드 슬레이트 서피스) */}
                <div className="rounded-xl bg-white  border border-zinc-200/80  p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-klic-muted flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-blue-600" />
                      실행 명령 및 측정 기록
                    </span>
                    <button
                      onClick={() => handleCopyCommand(selectedIncident.commandSnippet)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100  text-[10px] font-mono text-klic-muted  hover:bg-zinc-200"
                    >
                      {copiedCmd ? (
                        <>
                          <Check className="w-3 h-3 text-blue-600" /> 복사됨
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> 복사
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-[11px] font-mono text-blue-950  bg-blue-50/50  border border-blue-100  rounded-lg p-2.5 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {selectedIncident.commandSnippet}
                  </pre>
                </div>

                {/* 해당 시점 메트릭 비교 미니 바 */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-white  border border-zinc-200/80 ">
                    <div className="text-[10px] font-semibold text-klic-muted">시점 P99 지연시간</div>
                    <div className="text-base font-bold font-mono text-zinc-900  mt-0.5">
                      {selectedIncident.latencyMs} ms
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-zinc-100  mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          selectedIncident.latencyMs > 1000
                            ? 'bg-blue-500'
                            : selectedIncident.latencyMs > 400
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, (selectedIncident.latencyMs / 1900) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white  border border-zinc-200/80 ">
                    <div className="text-[10px] font-semibold text-klic-muted">시점 5xx 에러율</div>
                    <div className="text-base font-bold font-mono text-zinc-900  mt-0.5">
                      {selectedIncident.errorRate}%
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-zinc-100  mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          selectedIncident.errorRate > 1 ? 'bg-blue-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, (selectedIncident.errorRate / 5) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          2. 장비 조달 배송 타임라인 (timeline-order-fulfillment)
      ===================================================================== */}
      {showSection('order-fulfillment') && (
        <section className="rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
          <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-50  border border-blue-200/80  text-[10px] font-mono font-bold text-blue-600 ">
                공급망 및 데이터센터 물류
              </span>
              <span className="text-xs font-bold text-zinc-900 ">
                데이터센터 AI 서버 랙 & 보안 HSM 조달·통관·개통 타임라인
              </span>
            </div>
            <div className="flex items-center gap-2">
              {HARDWARE_SHIPMENTS.map((ship) => (
                <button
                  key={ship.id}
                  onClick={() => {
                    setSelectedShipmentId(ship.id);
                    setSelectedStageStep(ship.currentStageIndex + 1);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border transition-all ${
                    selectedShipmentId === ship.id
                      ? 'bg-white  text-blue-600  border-blue-300  shadow-2xs'
                      : 'bg-transparent text-klic-muted  border-transparent hover:bg-white/60'
                  }`}
                >
                  {ship.poNumber}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[14px] bg-white  border border-zinc-200/80  p-5 space-y-5">
            {/* 발주 장비 요약 헤더 */}
            <div className="rounded-xl bg-zinc-50/90  border border-zinc-200/80  p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-100/80  text-blue-700  text-[10px] font-mono font-bold">
                    {activeShipment.poNumber}
                  </span>
                  <span className="text-xs text-klic-muted">제조사: {activeShipment.vendor}</span>
                </div>
                <div className="text-sm font-bold text-zinc-900 ">
                  {activeShipment.itemTitle}
                </div>
                <div className="text-xs text-klic-muted flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  최종 설치 위치: <span className="font-semibold text-zinc-700 ">{activeShipment.destination}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="px-3 py-2 rounded-xl bg-white  border border-zinc-200/80  text-right">
                  <div className="text-[10px] text-klic-muted">항온항습 · 진동 센서</div>
                  <div className="text-xs font-mono font-bold text-blue-600 ">
                    {activeShipment.tempCelsius} · {activeShipment.shockG}
                  </div>
                </div>
                <div className="px-3 py-2 rounded-xl bg-white  border border-zinc-200/80  text-right">
                  <div className="text-[10px] text-klic-muted">템퍼 봉인 해시 (Chain of Custody)</div>
                  <div className="text-xs font-mono font-bold text-zinc-800 ">
                    {activeShipment.sealHash}
                  </div>
                </div>
              </div>
            </div>

            {/* 수평 5단계 물류 프로그레스 타임라인 */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {activeShipment.stages.map((st) => {
                const isSelected = st.step === selectedStageStep;
                const badgeClass =
                  st.status === 'done'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : st.status === 'current'
                    ? 'bg-blue-50 text-blue-700 border-blue-300'
                    : 'bg-zinc-100 text-klic-muted border-zinc-200';

                return (
                  <div
                    key={st.step}
                    onClick={() => setSelectedStageStep(st.step)}
                    className={`rounded-xl border p-3.5 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50/45  border-blue-500/80 ring-2 ring-blue-500/15'
                        : 'bg-white  border-zinc-200/80  hover:border-zinc-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${badgeClass}`}>
                          단계 0{st.step} · {st.status === 'done' ? '완료' : st.status === 'current' ? '진행중' : '대기'}
                        </span>
                        <span className="text-[10px] font-mono text-klic-muted">{st.timestamp}</span>
                      </div>
                      <div className="text-xs font-bold text-zinc-900 ">
                        {st.label}
                      </div>
                      <div className="text-[11px] text-klic-muted  mt-1">
                        {st.location}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-zinc-100  flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-zinc-700 ">{st.owner}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-klic-muted" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 하단 선택 단계 상세 검증 및 IDC 입고 서명 바 */}
            <div className="rounded-xl bg-zinc-50/80  border border-zinc-200/80  p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[11px] font-mono font-bold text-blue-600 ">
                  단계 0{activeStageDetail.step} 상세 · {activeStageDetail.location} ({activeStageDetail.timestamp})
                </div>
                <div className="text-xs font-bold text-zinc-900 ">
                  {activeStageDetail.label} — 담당 책임자: {activeStageDetail.owner}
                </div>
                <div className="text-xs text-klic-muted ">
                  {activeStageDetail.note}
                </div>
              </div>

              <button
                onClick={() => setSignedRackCheck((v) => !v)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                  signedRackCheck
                    ? 'bg-blue-50 text-blue-700 border-blue-300'
                    : 'bg-white  text-zinc-800  border-zinc-300  hover:bg-zinc-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                {signedRackCheck ? 'IDC 반입 보안 봉인 대사 서명됨' : '보안 봉인 해시 인수 서명하기'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          3. 릴리즈 노트 타임라인 (timeline-release-changelog)
      ===================================================================== */}
      {showSection('release-changelog') && (
        <section className="rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
          <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-50  border border-blue-200/80  text-[10px] font-mono font-bold text-blue-700 ">
                변경 기록 및 마이그레이션 비교
              </span>
              <span className="text-xs font-bold text-zinc-900 ">
                버전별 릴리즈 노트 & SDK 마이그레이션 코드 비교 타임라인
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {(['ALL', 'NEW', 'IMPROVED', 'SECURITY', 'FIXED'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setReleaseTypeFilter(type)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all ${
                    releaseTypeFilter === type
                      ? 'bg-white  text-blue-600  shadow-2xs border border-zinc-200/80 '
                      : 'text-klic-muted hover:text-zinc-800'
                  }`}
                >
                  {{ ALL: '전체 변경사항', NEW: '신규', IMPROVED: '개선', SECURITY: '보안', FIXED: '수정' }[type]}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[14px] bg-white  border border-zinc-200/80  p-5 space-y-6">
            {RELEASE_NOTES.map((rel) => {
              const filteredChanges =
                releaseTypeFilter === 'ALL'
                  ? rel.changes
                  : rel.changes.filter((c) => c.type === releaseTypeFilter);

              const isDiffOpen = expandedDiffVersion === rel.version;

              return (
                <div
                  key={rel.version}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-6 last:pb-0 border-b last:border-b-0 border-zinc-200/70 "
                >
                  {/* 좌측 버전 스파인 (3 cols) */}
                  <div className="lg:col-span-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold font-mono text-zinc-900 ">
                        {rel.version}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                          rel.tag === 'MAJOR'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : rel.tag === 'SECURITY'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {{ MAJOR: '주요 버전', MINOR: '기능 추가', SECURITY: '보안' }[rel.tag]}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-klic-muted">{rel.date} 배포</div>
                    <div className="p-2.5 rounded-xl bg-zinc-50  border border-zinc-200/70 ">
                      <div className="text-[10px] text-klic-muted">{rel.metricsLabel}</div>
                      <div className="text-xs font-mono font-bold text-blue-600  mt-0.5">
                        {rel.metricsDelta}
                      </div>
                    </div>
                  </div>

                  {/* 우측 릴리즈 상세 내역 (9 cols) */}
                  <div className="lg:col-span-9 space-y-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-zinc-900 ">
                        {rel.codename}
                      </h4>
                      <button
                        onClick={() =>
                          setExpandedDiffVersion(isDiffOpen ? '' : rel.version)
                        }
                        className="text-xs font-mono font-semibold text-blue-600  hover:underline flex items-center gap-1"
                      >
                        <FileCode2 className="w-3.5 h-3.5" />
                        {isDiffOpen ? 'SDK 마이그레이션 코드 접기' : 'SDK 마이그레이션 코드 보기'}
                      </button>
                    </div>

                    <p className="text-xs text-klic-muted  leading-relaxed">
                      {rel.summary}
                    </p>

                    <div className="space-y-2">
                      {filteredChanges.map((chg, i) => {
                        const badgeStyle =
                          chg.type === 'NEW'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : chg.type === 'IMPROVED'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : chg.type === 'SECURITY'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200';

                        return (
                          <div
                            key={i}
                            className="flex flex-wrap items-center gap-2.5 p-2.5 rounded-xl bg-zinc-50/70  border border-zinc-200/70  text-xs"
                          >
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${badgeStyle}`}
                            >
                              {{ NEW: '신규', IMPROVED: '개선', SECURITY: '보안', FIXED: '수정' }[chg.type]}
                            </span>
                            <code className="px-1.5 py-0.5 rounded bg-white  border border-zinc-200/80  text-[10px] font-mono text-klic-muted ">
                              {chg.module}
                            </code>
                            <span className="text-zinc-800  font-medium">
                              {chg.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {isDiffOpen && (
                      <div className="rounded-xl bg-zinc-50  border border-zinc-200/80  p-3.5 font-mono text-xs space-y-1.5">
                        <div className="text-[10px] font-bold text-klic-muted">
                          SDK 마이그레이션 비교 ({rel.version})
                        </div>
                        <div className="px-2.5 py-1.5 rounded bg-blue-50/80  text-blue-700  border border-blue-200/60 ">
                          - {rel.migrationDiff.before}
                        </div>
                        <div className="px-2.5 py-1.5 rounded bg-blue-50/80  text-blue-700  border border-blue-200/60 ">
                          + {rel.migrationDiff.after}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =====================================================================
          4. 고객사 계약 히스토리 타임라인 (timeline-contract-lifecycle)
      ===================================================================== */}
      {showSection('contract-lifecycle') && (
        <section className="rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
          <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-50  border border-blue-200/80  text-[10px] font-mono font-bold text-blue-600 ">
                고객사 ARR 확장 타임라인
              </span>
              <span className="text-xs font-bold text-zinc-900 ">
                고객사 계약 체결 · 시트 증설(Upsell) · 다년 ELA 갱신 히스토리 타임라인
              </span>
            </div>

            <button
              onClick={() => setSimulateQ4Upsell((v) => !v)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                simulateQ4Upsell
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'bg-white  text-zinc-700  border-zinc-200/80 '
              }`}
            >
              {simulateQ4Upsell ? '✓ 2026 Q4 글로벌 지사 증설 시뮬레이션 활성 (₩11.6억)' : '+ 2026 Q4 증설 마일스톤 시뮬레이션'}
            </button>
          </div>

          <div className="rounded-[14px] bg-white  border border-zinc-200/80  p-5 space-y-5">
            {/* SVG ARR 계단식 성장 리본 다이어그램 */}
            <div className="rounded-xl bg-zinc-50/80  border border-zinc-200/80  p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="text-xs font-bold text-zinc-900  flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  토스뱅크 코어뱅킹 워크스페이스 · 연간 반복 매출(ARR) & 라이선스 시트 확장 추이
                </div>
                <div className="text-xs font-mono font-bold text-blue-600 ">
                  순매출 유지율 (NRR): 466% · 현재 850 시트 (₩8.4억/년)
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
                {CONTRACT_JOURNEY.map((ms) => {
                  const isSel = ms.id === activeMilestone.id;
                  const heightPercent = Math.max(18, Math.round((ms.arrNumeric / 9) * 100));
                  return (
                    <div
                      key={ms.id}
                      onClick={() => setSelectedMilestoneId(ms.id)}
                      className={`rounded-xl border p-3 cursor-pointer transition-all flex flex-col justify-between ${
                        isSel
                          ? 'bg-blue-50/45  border-blue-500/80 ring-2 ring-blue-500/15'
                          : 'bg-white  border-zinc-200/80  hover:border-zinc-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-klic-muted">
                          <span>{ms.quarter}</span>
                          <span className="px-1.5 py-0.5 rounded bg-zinc-100  font-bold text-zinc-700 ">
                            {ms.seats}석
                          </span>
                        </div>
                        <div className="text-xs font-bold text-zinc-900  mt-1 line-clamp-1">
                          {ms.badge}
                        </div>
                        <div className="text-sm font-mono font-bold text-blue-600  mt-0.5">
                          {ms.arrValue}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-zinc-100 ">
                        <div className="w-full h-2 rounded-full bg-zinc-100  overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-600 transition-all"
                            style={{ width: `${heightPercent}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-klic-muted mt-1.5 truncate">
                          스폰서: {ms.champion}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 선택된 계약 마일스톤 상세 카드 */}
            <div className="rounded-xl bg-white  border border-zinc-200/80  p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              <div className="lg:col-span-8 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-50  text-blue-700  text-[10px] font-mono font-bold border border-blue-200/80">
                    {activeMilestone.date} · {activeMilestone.badge}
                  </span>
                  <span className="text-xs text-klic-muted">
                    내부 챔피언: <strong className="text-zinc-800 ">{activeMilestone.champion}</strong> ({activeMilestone.championRole})
                  </span>
                </div>
                <div className="text-sm font-bold text-zinc-900 ">
                  {activeMilestone.stageTitle}
                </div>
                <p className="text-xs text-klic-muted ">
                  {activeMilestone.summary}
                </p>
              </div>

              <div className="lg:col-span-4 rounded-xl bg-zinc-50  border border-zinc-200/80  p-3.5 space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-klic-muted uppercase">
                  핵심 딜리버러블 & 계약 산출물
                </div>
                {activeMilestone.deliverables.map((d, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-zinc-700 ">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          5. 코드 리뷰 실행 타임라인 (timeline-pr-review-chain)
      ===================================================================== */}
      {showSection('pr-review-chain') && (
        <section className="rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
          <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-50  border border-blue-200/80  text-[10px] font-mono font-bold text-blue-600 ">
                PR #4912 · Git 검토 및 CI 실행 흐름
              </span>
              <span className="text-xs font-bold text-zinc-900 ">
                커밋 푸시 · 자동 테스트 게이트 · 아키텍트 코드 리뷰 · 프로덕션 머지 체인
              </span>
            </div>

            <button
              onClick={() => setIsPrMerged((v) => !v)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isPrMerged
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-blue-600 hover:bg-blue-700 text-klic-on-emphasis shadow-2xs'
              }`}
            >
              <GitMerge className="w-3.5 h-3.5" />
              {isPrMerged ? "main에 병합됨 (스쿼시 #a91f04c)" : 'Squash & Merge 실행'}
            </button>
          </div>

          <div className="rounded-[14px] bg-white  border border-zinc-200/80  p-5 space-y-5">
            {/* SVG Git 브랜치 분기 및 머지 토폴로지 */}
            <div className="rounded-xl bg-zinc-50/70  border border-zinc-200/80  p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold text-klic-muted ">
                  Git 브랜치 그래프 · main ← feat/shard-rebalance (+342줄 -48줄)
                </span>
                <span className="text-[11px] font-mono text-blue-600 font-semibold">
                  ● 모든 검사 통과
                </span>
              </div>
              <svg viewBox="0 0 720 76" className="w-full h-16">
                {/* main 브랜치 라인 */}
                <line x1="40" y1="22" x2="680" y2="22" stroke="var(--klic-component-block-color-control-border)" strokeWidth="2" />
                <text x="12" y="25" className="fill-zinc-500 text-[10px] font-mono font-bold">main</text>

                {/* feat 브랜치 분기 및 병합 베지어 곡선 */}
                <path
                  d="M 120 22 C 155 22, 160 54, 195 54 L 520 54 C 555 54, 565 22, 600 22"
                  fill="none"
                  stroke="var(--klic-component-block-color-accent)"
                  strokeWidth="2.5"
                />
                <text x="12" y="58" className="fill-blue-600 text-[10px] font-mono font-bold">feat</text>

                {/* 커밋 노드들 */}
                <circle cx="120" cy="22" r="5" fill="var(--klic-component-block-color-panel)" stroke="var(--klic-component-block-color-accent)" strokeWidth="2.5" />
                <circle cx="220" cy="54" r="5.5" fill="var(--klic-component-block-color-panel)" stroke="var(--klic-component-block-color-accent)" strokeWidth="2.5" />
                <text x="220" y="71" textAnchor="middle" className="fill-zinc-600 text-[9px] font-mono">c81a4f2 (푸시)</text>

                <circle cx="350" cy="54" r="5.5" fill="var(--klic-component-block-color-panel)" stroke="var(--klic-component-block-color-accent)" strokeWidth="2.5" />
                <text x="350" y="71" textAnchor="middle" className="fill-zinc-600 text-[9px] font-mono">e09b2d1 (CI 통과)</text>

                <circle cx="480" cy="54" r="5.5" fill="var(--klic-component-block-color-panel)" stroke="var(--klic-component-block-color-warning)" strokeWidth="2.5" />
                <text x="480" y="71" textAnchor="middle" className="fill-zinc-600 text-[9px] font-mono">7f3c9a0 (SeqCst)</text>

                <circle
                  cx="600"
                  cy="22"
                  r="6.5"
                  fill={isPrMerged ? 'var(--klic-component-block-color-accent)' : 'var(--klic-component-block-color-soft)'}
                  stroke="var(--klic-component-block-color-accent)"
                  strokeWidth="2.5"
                />
                <text x="600" y="11" textAnchor="middle" className="fill-blue-700 text-[9px] font-mono font-bold">
                  {isPrMerged ? "#4912 병합됨" : "병합 준비 완료"}
                </text>
              </svg>
            </div>

            {/* 수직 PR 실행 체인 */}
            <div className="relative pl-6 space-y-3.5 before:content-[''] before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-[2px] before:bg-zinc-200 ">
              {prSteps.map((step) => (
                <div
                  key={step.id}
                  className="relative rounded-xl bg-white  border border-zinc-200/80  p-4 space-y-2.5"
                >
                  <span className="absolute -left-[21px] top-4 w-4 h-4 rounded-full border-2 border-blue-500 bg-blue-50 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  </span>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <PersonAvatar
                        src={step.avatar}
                        alt={step.author}
                        className="w-5 h-5 rounded-full object-cover border border-zinc-200"
                      />
                      <span className="text-xs font-bold text-zinc-900 ">
                        {step.author}
                      </span>
                      <span className="text-[11px] text-klic-muted">· {step.role}</span>
                      {step.hash && (
                        <code className="px-1.5 py-0.5 rounded bg-zinc-100  text-[10px] font-mono text-klic-muted ">
                          {step.hash}
                        </code>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                          step.statusTone === 'emerald'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : step.statusTone === 'amber'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {step.statusLabel}
                      </span>
                      <span className="text-[11px] font-mono text-klic-muted">{step.timestamp}</span>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-zinc-900 ">
                    {step.title}
                  </div>
                  <p className="text-xs text-klic-muted ">{step.summary}</p>

                  {step.codeDiff && (
                    <div className="rounded-xl bg-zinc-50  border border-zinc-200/80  p-3 font-mono text-[11px] space-y-1">
                      <div className="text-[10px] text-klic-muted font-bold mb-1">
                        {step.codeDiff.file}
                      </div>
                      <div className="px-2 py-1 rounded bg-blue-50/80  text-blue-700 ">
                        {step.codeDiff.removedLine}
                      </div>
                      <div className="px-2 py-1 rounded bg-blue-50/80  text-blue-700 ">
                        {step.codeDiff.addedLine}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
