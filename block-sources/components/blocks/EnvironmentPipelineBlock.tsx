import { PersonAvatar } from '../PersonAvatar';
import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  GitCommit,
  ArrowUpRight,
  RotateCcw,
  ChevronDown,
  Server,
  ShieldCheck,
  Sparkles,
  Activity,
  Terminal,
  Layers,
} from 'lucide-react';

export interface EnvironmentPipelineBlockProps {
  density?: 'compact' | 'normal' | 'relaxed';
}

export type EnvHealthState = 'healthy' | 'failed' | 'warning';
export type ReleaseDeployState = 'succeeded' | 'waiting' | 'running';

export interface EnvironmentStageCard {
  stageNumber: number;
  id: string;
  envName: string;
  envBadgeCode: string;
  clusterSubtitle: string;
  envHealth: EnvHealthState;
  envHealthLabel: string;
  serviceName: string;
  serviceKoreanName: string;
  deployState: ReleaseDeployState;
  deployStateLabel: string;
  version: string;
  prevVersion: string;
  commitHash: string;
  commitMessage: string;
  completedSteps: number;
  totalSteps: number;
  authorName: string;
  authorAvatar: string;
  deployedAtText: string;
  canPromote?: boolean;
  gateDescription: string;
  latencyP95: string;
  errorRate: string;
  podsReady: string;
}

const INITIAL_STAGES: EnvironmentStageCard[] = [
  {
    stageNumber: 1,
    id: 'env-dev',
    envName: '개발 서버 (Development)',
    envBadgeCode: "단계 01",
    clusterSubtitle: 'dev-ap-northeast-2 • 커밋 푸시 시 자동 배포',
    envHealth: 'healthy',
    envHealthLabel: '정상',
    serviceName: 'auth-token-issuer',
    serviceKoreanName: '인증 토큰 발급기',
    deployState: 'succeeded',
    deployStateLabel: '성공',
    version: 'v1.14.0',
    prevVersion: 'v1.13.8',
    commitHash: '9a1b4c2',
    commitMessage: 'OAuth2 리프레시 토큰 슬라이딩 만료 주기 검증 로직 추가',
    completedSteps: 6,
    totalSteps: 6,
    authorName: '김민준',
    authorAvatar:
      './placeholders/avatar-27ccdef6fa6f.svg',
    deployedAtText: '18분 전',
    gateDescription: '유닛 테스트 412건 통과 • 정적 분석 무결성 100%',
    latencyP95: '38ms',
    errorRate: '0.01%',
    podsReady: '12/12 파드',
  },
  {
    stageNumber: 2,
    id: 'env-qa',
    envName: '통합 테스트 (QA)',
    envBadgeCode: "단계 02",
    clusterSubtitle: 'qa-ap-northeast-2 • E2E 회귀 테스트 자동 실행',
    envHealth: 'healthy',
    envHealthLabel: '정상',
    serviceName: 'payment-router',
    serviceKoreanName: '결제 라우팅 엔진',
    deployState: 'succeeded',
    deployStateLabel: '성공',
    version: 'v2.4.0',
    prevVersion: 'v2.3.9',
    commitHash: '3e8f1a0',
    commitMessage: '멀티 PG사 타임아웃 시 세컨더리 매입사 무중단 폴백 처리',
    completedSteps: 6,
    totalSteps: 6,
    authorName: '이서연',
    authorAvatar:
      './placeholders/avatar-db5dd4b3926d.svg',
    deployedAtText: '42분 전',
    gateDescription: '합성 트랜잭션 10,000건 전수 통과 • 계약 테스트 완료',
    latencyP95: '64ms',
    errorRate: '0.02%',
    podsReady: '16/16 파드',
  },
  {
    stageNumber: 3,
    id: 'env-staging',
    envName: '스테이징 (Staging)',
    envBadgeCode: "단계 03",
    clusterSubtitle: 'staging-us-east-1 • 병합 시 자동 실행',
    envHealth: 'failed',
    envHealthLabel: '2건 실패',
    serviceName: 'webhook-dispatcher',
    serviceKoreanName: '웹훅 디스패처',
    deployState: 'succeeded',
    deployStateLabel: '성공',
    version: 'v1.27.0',
    prevVersion: 'v1.26.2',
    commitHash: '7c3e8b1',
    commitMessage: '순환 교체된 서명 키로 웹훅 전송 페이로드 HMAC 서명 검증',
    completedSteps: 6,
    totalSteps: 6,
    authorName: '오태양',
    authorAvatar:
      './placeholders/avatar-51747f419874.svg',
    deployedAtText: '1시간 전',
    gateDescription: '스테이징 스모크 검증 완료 (타 서비스 알림 워커 2건 재시도 중)',
    latencyP95: '89ms',
    errorRate: '0.14%',
    podsReady: '24/24 파드',
  },
  {
    stageNumber: 4,
    id: 'env-sandbox',
    envName: '샌드박스 (Sandbox)',
    envBadgeCode: "단계 04",
    clusterSubtitle: 'staging-us-east-1 • 외부 파트너 연동 격리 환경',
    envHealth: 'healthy',
    envHealthLabel: '정상',
    serviceName: 'reconciliation',
    serviceKoreanName: '정산 대사 엔진',
    deployState: 'succeeded',
    deployStateLabel: '성공',
    version: 'v2.7.1',
    prevVersion: 'v2.7.0',
    commitHash: 'f2a6c84',
    commitMessage: 'EU 은행권 CAMT.053 전문 일괄 정산 명세서 파싱 로직 개선',
    completedSteps: 6,
    totalSteps: 6,
    authorName: '최소연',
    authorAvatar:
      './placeholders/avatar-157a5491730e.svg',
    deployedAtText: '5시간 전',
    gateDescription: '파트너 샌드박스 전문 송수신 정합성 100% 일치',
    latencyP95: '112ms',
    errorRate: '0.00%',
    podsReady: '18/18 파드',
  },
  {
    stageNumber: 5,
    id: 'env-canary',
    envName: '카나리 (Canary 10%)',
    envBadgeCode: "단계 05",
    clusterSubtitle: 'prod-us-east-1 • 실트래픽 10% 가중치 미러링',
    envHealth: 'healthy',
    envHealthLabel: '정상',
    serviceName: 'ledger-writer',
    serviceKoreanName: '복식부기 원장 기록기',
    deployState: 'succeeded',
    deployStateLabel: '성공',
    version: 'v4.1.2',
    prevVersion: 'v4.1.0',
    commitHash: 'b81d9e4',
    commitMessage: '고빈도 정산 트랜잭션 원장 파티션 락 경합 최소화 패치',
    completedSteps: 6,
    totalSteps: 6,
    authorName: '박지훈',
    authorAvatar:
      './placeholders/avatar-591f5c8ec067.svg',
    deployedAtText: '2시간 전',
    gateDescription: '카나리 베이스라인 대비 에러율 편차 0.00% • SLO 충족',
    latencyP95: '45ms',
    errorRate: '0.01%',
    podsReady: '8/8 파드',
  },
  {
    stageNumber: 6,
    id: 'env-production',
    envName: '프로덕션 (Production)',
    envBadgeCode: "단계 06",
    clusterSubtitle: 'prod-us-east-1 • prod-eu-west-1 멀티 리전',
    envHealth: 'healthy',
    envHealthLabel: '정상',
    serviceName: 'fraud-scorer',
    serviceKoreanName: '이상거래 탐지기',
    deployState: 'waiting',
    deployStateLabel: '승인 대기',
    version: 'v3.9.0',
    prevVersion: 'v3.8.2',
    commitHash: 'd4a7c19',
    commitMessage: '온라인 피처 스토어에서 실시간 fs-v7 모델 피처 서빙 전환',
    completedSteps: 5,
    totalSteps: 6,
    authorName: '최소연',
    authorAvatar:
      './placeholders/avatar-157a5491730e.svg',
    deployedAtText: '28분 전',
    canPromote: true,
    gateDescription: '5/6 자동 검증 통과 • 최종 프로덕션 트래픽 100% 전환 승인 대기 중',
    latencyP95: '29ms',
    errorRate: '0.00%',
    podsReady: '64/64 파드',
  },
];

const SERVICE_OPTIONS = [
  { id: 'all', label: '전체 서비스 (8개 마이크로서비스)' },
  { id: 'webhook-dispatcher', label: 'webhook-dispatcher (웹훅 디스패처)' },
  { id: 'reconciliation', label: 'reconciliation (정산 대사 엔진)' },
  { id: 'fraud-scorer', label: 'fraud-scorer (이상거래 탐지기)' },
  { id: 'auth-token-issuer', label: 'auth-token-issuer (인증 토큰 발급기)' },
  { id: 'payment-router', label: 'payment-router (결제 라우팅 엔진)' },
  { id: 'ledger-writer', label: 'ledger-writer (복식부기 원장 기록기)' },
];

/**
 * 카드와 카드 사이의 수평 SVG 화살표 브릿지
 * 레퍼런스 이미지의 [ → ] 중앙 사각 배지 + 좌우 연결선 + 끝단 정밀 화살촉(Chevron) 완벽 구현
 */
function HorizontalSvgConnector({
  direction = 'right',
  isActive = true,
  label,
}: {
  direction?: 'right' | 'left';
  isActive?: boolean;
  label?: string;
}) {
  const isRight = direction === 'right';
  return (
    <div
      className="hidden lg:flex flex-col items-center justify-center w-14 shrink-0 select-none"
      aria-hidden="true"
    >
      <div className="relative flex flex-col items-center justify-center">
        {label && (
          <span className="mb-1 text-[10px] font-medium text-klic-muted  whitespace-nowrap tracking-tight">
            {label}
          </span>
        )}
        <svg
          viewBox="0 0 56 36"
          className="w-14 h-9 overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 좌측 선분 (좌측 카드 우측 보더 x=0 에서 중앙 박스로 연결) */}
          <line
            x1="0"
            y1="18"
            x2="14"
            y2="18"
            className="stroke-zinc-300 "
            strokeWidth="1.75"
          />
          {/* 우측 선분 (중앙 박스에서 우측 카드 좌측 보더 x=56 으로 연결) */}
          <line
            x1="42"
            y1="18"
            x2="55"
            y2="18"
            className="stroke-zinc-300 "
            strokeWidth="1.75"
          />

          {/* 흐르는 애니메이션 입자 */}
          {isActive && (
            <circle r="2.2" className="fill-blue-500 ">
              <animateMotion
                dur="1.8s"
                repeatCount="indefinite"
                path={isRight ? 'M 0 18 L 55 18' : 'M 55 18 L 0 18'}
              />
            </circle>
          )}

          {/* 끝단 화살촉 (카드 경계에 정확히 맞닿는 셰브론) */}
          {isRight ? (
            <path
              d="M 49.5 13.5 L 55 18 L 49.5 22.5"
              className="stroke-zinc-400 "
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M 6.5 13.5 L 1 18 L 6.5 22.5"
              className="stroke-zinc-400 "
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* 중앙 라운드 사각 아이콘 박스 [ → ] */}
          <rect
            x="14"
            y="4"
            width="28"
            height="28"
            rx="8"
            className="fill-white  stroke-zinc-200 "
            strokeWidth="1.25"
          />
          {isRight ? (
            <g
              className="stroke-zinc-600 "
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22.5" y1="18" x2="33.5" y2="18" />
              <polyline points="29.5,14 33.5,18 29.5,22" />
            </g>
          ) : (
            <g
              className="stroke-zinc-600 "
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="33.5" y1="18" x2="22.5" y2="18" />
              <polyline points="26.5,14 22.5,18 26.5,22" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

/**
 * 1행 우측 끝(Stage 3)에서 2행 시작점(Stage 4)으로 이어지는 'ㄹ'자형(Serpentine) 정밀 SVG 커넥터
 * - mode === 'rieul': 1행 우측(Stage 3, x=855) 하단 보더에서 출발하여 중앙 수평선(우→좌)을 타고 2행 좌측(Stage 4, x=145) 상단 보더로 직결되는 완벽한 'ㄹ'자 획 구조
 * - mode === 'snake': 1행 우측(Stage 3, x=855)에서 바로 아래 2행 우측(Stage 4, x=855) 상단 보더로 직결되는 지그재그 구조
 */
function RieulTurnaroundSvgConnector({
  flowLayout,
}: {
  flowLayout: 'rieul' | 'snake';
}) {
  // 3열 레이아웃에서 1열 카드 중심 x=145, 3열 카드 중심 x=855, 높이 76px 전체에 밀착
  const rieulPath =
    'M 855 0 L 855 22 Q 855 38 839 38 L 161 38 Q 145 38 145 54 L 145 75';
  const snakePath = 'M 855 0 L 855 75';

  return (
    <div className="w-full select-none -my-[1px] relative z-10" aria-hidden="true">
      {/* 데스크톱 'ㄹ'자형 정밀 SVG 브릿지 */}
      <div className="hidden lg:block w-full">
        <svg
          viewBox="0 0 1000 76"
          className="w-full h-[76px] overflow-visible block"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {flowLayout === 'rieul' ? (
            <>
              {/* 메인 'ㄹ'자형 실선 트랙 (HorizontalSvgConnector와 동일한 정밀 선 굵기 및 컬러) */}
              <path
                d={rieulPath}
                className="stroke-zinc-300 "
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* 실시간 흐르는 입자 3개 ('ㄹ'자 궤적을 따라 우측 상단 → 좌측 하단으로 이동) */}
              {[0, 0.85, 1.7].map((delay, idx) => (
                <g key={idx}>
                  <circle
                    r="4"
                    className="fill-blue-500/20 "
                  >
                    <animateMotion
                      dur="2.55s"
                      begin={`${delay}s`}
                      repeatCount="indefinite"
                      path={rieulPath}
                    />
                  </circle>
                  <circle
                    r="2.2"
                    className="fill-blue-500 "
                  >
                    <animateMotion
                      dur="2.55s"
                      begin={`${delay}s`}
                      repeatCount="indefinite"
                      path={rieulPath}
                    />
                  </circle>
                </g>
              ))}

              {/* 우측 상단 출발 노드 (Stage 3 하단 보더 접점) */}
              <circle
                cx="855"
                cy="0"
                r="3"
                className="fill-white  stroke-zinc-400 "
                strokeWidth="1.5"
              />

              {/* 우측 중간 화살표 박스 [ ← ] (x=678, y=38) */}
              <g transform="translate(664, 24)">
                <rect
                  x="0"
                  y="0"
                  width="28"
                  height="28"
                  rx="8"
                  className="fill-white  stroke-zinc-200 "
                  strokeWidth="1.25"
                />
                <path
                  d="M 19.5 14 L 8.5 14 M 12.5 10 L 8.5 14 L 12.5 18"
                  className="stroke-zinc-600 "
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>

              {/* 중앙 'ㄹ'자 승격 게이트 배지 (x=500, y=38) */}
              <g transform="translate(382, 23)">
                <rect
                  x="0"
                  y="0"
                  width="236"
                  height="30"
                  rx="8"
                  className="fill-white  stroke-zinc-200 "
                  strokeWidth="1.25"
                />
                <circle cx="15" cy="15" r="3" className="fill-blue-500" />
                <text
                  x="25"
                  y="19"
                  className="fill-zinc-700  text-[11px] font-semibold"
                  style={{ fontFamily: 'inherit' }}
                >
                  3단계 스테이징 → 4단계 샌드박스 승격
                </text>
              </g>

              {/* 좌측 중간 화살표 박스 [ ← ] (x=322, y=38) */}
              <g transform="translate(308, 24)">
                <rect
                  x="0"
                  y="0"
                  width="28"
                  height="28"
                  rx="8"
                  className="fill-white  stroke-zinc-200 "
                  strokeWidth="1.25"
                />
                <path
                  d="M 19.5 14 L 8.5 14 M 12.5 10 L 8.5 14 L 12.5 18"
                  className="stroke-zinc-600 "
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>

              {/* 좌측 하단 최종 진입 화살촉 (Stage 4 상단 보더 접점 x=145, y=75) */}
              <path
                d="M 140.5 69.5 L 145 75.5 L 149.5 69.5"
                className="stroke-zinc-400 "
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          ) : (
            <>
              {/* 지그재그(S자) 모드일 때: 우측 3열(x=855)에서 바로 아래 2행 우측 카드로 하강 */}
              <path
                d={snakePath}
                className="stroke-zinc-300 "
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              <circle r="2.2" className="fill-blue-500 ">
                <animateMotion dur="1.4s" repeatCount="indefinite" path={snakePath} />
              </circle>
              <g transform="translate(841, 24)">
                <rect
                  x="0"
                  y="0"
                  width="28"
                  height="28"
                  rx="8"
                  className="fill-white  stroke-zinc-200 "
                  strokeWidth="1.25"
                />
                <path
                  d="M 14 8.5 L 14 19.5 M 10 15.5 L 14 19.5 L 18 15.5"
                  className="stroke-zinc-600 "
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <path
                d="M 850.5 69.5 L 855 75.5 L 859.5 69.5"
                className="stroke-zinc-400 "
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}
        </svg>
      </div>

      {/* 모바일/태블릿용 수직 화살표 */}
      <div className="flex lg:hidden justify-center py-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-zinc-200  bg-white  text-xs text-klic-muted  shadow-2xs">
          <span>↓ 다음 배포 단계로 승격</span>
        </div>
      </div>
    </div>
  );
}

export function EnvironmentPipelineBlock({
  density = 'normal',
}: EnvironmentPipelineBlockProps) {
  const [stages, setStages] = useState<EnvironmentStageCard[]>(INITIAL_STAGES);
  const [selectedService, setSelectedService] = useState<string>('all');
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
  const [flowLayout, setFlowLayout] = useState<'rieul' | 'snake'>('rieul');
  const [selectedStageId, setSelectedStageId] = useState<string>('env-production');
  const [promoteToast, setPromoteToast] = useState<string | null>(null);

  // 특정 서비스 필터 선택 시 모든 6개 환경 카드를 해당 서비스 기준으로 투영
  const displayedStages = stages.map((stage) => {
    if (selectedService === 'all') return stage;
    const matchedOption = SERVICE_OPTIONS.find((s) => s.id === selectedService);
    const korName = matchedOption
      ? matchedOption.label.split('(')[1]?.replace(')', '') || stage.serviceKoreanName
      : stage.serviceKoreanName;
    return {
      ...stage,
      serviceName: selectedService,
      serviceKoreanName: korName,
    };
  });

  const row1Stages = displayedStages.slice(0, 3); // 1, 2, 3
  const row2StagesRaw = displayedStages.slice(3, 6); // 4, 5, 6
  // 'ㄹ'자형 표준에서는 2행도 좌->우 (4 -> 5 -> 6), 지그재그(snake)에서는 우->좌 배치(화면 좌측이 6, 중앙이 5, 우측이 4)
  const row2Stages =
    flowLayout === 'rieul' ? row2StagesRaw : [...row2StagesRaw].reverse();

  const handlePromoteProduction = (stageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStages((prev) =>
      prev.map((st) => {
        if (st.id !== stageId) return st;
        return {
          ...st,
          deployState: 'succeeded',
          deployStateLabel: '성공',
          completedSteps: 6,
          deployedAtText: '방금 전',
          canPromote: false,
          gateDescription:
            '6/6 전체 검증 및 카나리 승격 완료 • 멀티 리전 프로덕션 100% 서빙 중',
        };
      })
    );
    setPromoteToast(
      '프로덕션(Production) 환경으로 fraud-scorer v3.9.0 승격 배포가 완료되었습니다.'
    );
    setTimeout(() => setPromoteToast(null), 4000);
  };

  const handleResetPipeline = () => {
    setStages(INITIAL_STAGES);
    setSelectedService('all');
    setPromoteToast(null);
  };

  const activeStageDetail =
    displayedStages.find((s) => s.id === selectedStageId) || displayedStages[5];

  const cardPadding =
    density === 'compact' ? 'p-4' : density === 'relaxed' ? 'p-6' : 'p-5';

  const renderEnvironmentCard = (stage: EnvironmentStageCard) => {
    const isSelected = selectedStageId === stage.id;
    const isEnvHealthy = stage.envHealth === 'healthy';
    const isDeploySucceeded = stage.deployState === 'succeeded';

    return (
      <div
        key={stage.id}
        onClick={() => setSelectedStageId(stage.id)}
        className={`flex-1 min-w-0 rounded-2xl border bg-white  transition-all cursor-pointer flex flex-col justify-between ${cardPadding} ${
          isSelected
            ? 'border-zinc-900  ring-2 ring-zinc-900/10  shadow-md'
            : 'border-zinc-200/90  hover:border-zinc-300  shadow-2xs'
        }`}
      >
        {/* 상단 환경 타이틀 & 상태 배지 */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-zinc-100  text-klic-muted ">
                  {stage.stageNumber}단계
                </span>
                <h4 className="text-[15px] font-bold tracking-tight text-zinc-900 ">
                  {stage.envName}
                </h4>
              </div>
              <p className="text-xs text-klic-muted  mt-1 font-normal truncate">
                {stage.clusterSubtitle}
              </p>
            </div>

            {/* 우측 상단 환경 헬스 배지 (정상 / 2건 실패) */}
            {isEnvHealthy ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50/90  text-blue-700  border border-blue-200/70  shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {stage.envHealthLabel}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50/90  text-blue-600  border border-blue-200/70  shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                {stage.envHealthLabel}
              </span>
            )}
          </div>

          {/* 내부 서비스 배포 상세 박스 */}
          <div className="mt-4 rounded-xl border border-zinc-200/70  bg-zinc-50/60  p-4">
            {/* 서비스명 & 성공/승인대기 배지 */}
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-zinc-900  truncate">
                  {stage.serviceName}
                </div>
                <div className="text-[11px] text-klic-muted ">
                  {stage.serviceKoreanName}
                </div>
              </div>

              {isDeploySucceeded ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50  text-blue-700  border border-blue-200/60  shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {stage.deployStateLabel}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50  text-amber-700  border border-amber-200/60  shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  {stage.deployStateLabel}
                </span>
              )}
            </div>

            {/* 버전 표기 */}
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono tracking-tight text-zinc-900 ">
                {stage.version}
              </span>
              <span className="text-xs text-klic-muted  font-mono">
                이전 {stage.prevVersion}
              </span>
            </div>

            {/* 커밋 해시 배지 & 커밋 메시지 */}
            <div className="mt-2.5 flex items-center gap-2 min-w-0">
              <span className="px-1.5 py-0.5 rounded bg-zinc-200/75  text-[11px] font-mono font-medium text-zinc-700  shrink-0">
                {stage.commitHash}
              </span>
              <span
                className="text-xs text-klic-muted  truncate"
                title={stage.commitMessage}
              >
                {stage.commitMessage}
              </span>
            </div>

            {/* 6단계 세그먼트 상태바 + 6/6 카운터 */}
            <div className="mt-3.5 flex items-center gap-2.5">
              <div className="flex-1 grid grid-cols-6 gap-1">
                {Array.from({ length: stage.totalSteps }).map((_, idx) => {
                  const isDone = idx < stage.completedSteps;
                  const isWaitingStep =
                    !isDone &&
                    stage.deployState === 'waiting' &&
                    idx === stage.completedSteps;

                  return (
                    <div
                      key={idx}
                      className={`h-2 rounded-[2px] transition-colors ${
                        isDone
                          ? 'bg-blue-500 '
                          : isWaitingStep
                          ? 'bg-amber-500  animate-pulse'
                          : 'bg-zinc-200 '
                      }`}
                    />
                  );
                })}
              </div>
              <span className="text-[11px] font-mono font-medium text-klic-muted  shrink-0">
                {stage.completedSteps}/{stage.totalSteps}
              </span>
            </div>

            {/* 구분선 */}
            <div className="my-3.5 border-t border-zinc-200/80 " />

            {/* 하단 배포자 아바타 + 이름/시간 + 승격 배포 버튼 */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <PersonAvatar
                  src={stage.authorAvatar}
                  alt={stage.authorName}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-zinc-200  shrink-0"
                />
                <div className="text-xs text-klic-muted  truncate">
                  <span className="font-medium text-zinc-800 ">
                    {stage.authorName}
                  </span>
                  <span className="mx-1 text-klic-muted ">•</span>
                  <span className="text-klic-muted ">
                    {stage.deployedAtText}
                  </span>
                </div>
              </div>

              {stage.canPromote ? (
                <button
                  type="button"
                  onClick={(e) => handlePromoteProduction(stage.id, e)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis  text-xs font-semibold shadow-xs transition shrink-0 cursor-pointer"
                >
                  <ArrowUpRight size={13} strokeWidth={2.2} />
                  <span>승격 배포</span>
                </button>
              ) : (
                <span className="text-[11px] font-mono text-klic-muted  shrink-0">
                  {stage.latencyP95}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const activeServiceOption =
    SERVICE_OPTIONS.find((s) => s.id === selectedService) || SERVICE_OPTIONS[0];

  return (
    <div className="w-full space-y-5">
      {/* 상단 승격 완료 토스트 배너 */}
      {promoteToast && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-blue-50  border border-blue-200  text-blue-800  text-xs font-medium shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-blue-600 " />
            <span>{promoteToast}</span>
          </div>
          <button
            onClick={handleResetPipeline}
            className="text-[11px] underline hover:no-underline ml-4"
          >
            초기 상태로 되돌리기
          </button>
        </div>
      )}

      {/* 메인 배포 환경 카드 컨테이너 */}
      <div className="w-full rounded-2xl border border-zinc-200  bg-white  shadow-xs overflow-hidden">
        {/* 카드 상단 헤더 바 (Environments / 6개 배포 환경에 걸친 8개 핵심 마이크로서비스 / 우측 필터) */}
        <div className="px-6 py-4 border-b border-zinc-200/80  flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h3 className="text-base font-bold tracking-tight text-zinc-900 ">
              배포 환경
            </h3>
            <span className="text-xs text-klic-muted ">
              6개 배포 환경에 걸친 8개 핵심 마이크로서비스 ('ㄹ'자형 승격 파이프라인)
            </span>
          </div>

          {/* 우측 컨트롤: 'ㄹ'자형 플로우 모드 토글 + 서비스 드롭다운 */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center p-0.5 rounded-lg bg-zinc-100  border border-zinc-200/70  text-[11px]">
              <button
                type="button"
                onClick={() => setFlowLayout('rieul')}
                className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                  flowLayout === 'rieul'
                    ? 'bg-white  text-zinc-900  shadow-2xs'
                    : 'text-klic-muted hover:text-zinc-800 '
                }`}
              >
                'ㄹ'자형 정방향 (1→2→3 → 4→5→6)
              </button>
              <button
                type="button"
                onClick={() => setFlowLayout('snake')}
                className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                  flowLayout === 'snake'
                    ? 'bg-white  text-zinc-900  shadow-2xs'
                    : 'text-klic-muted hover:text-zinc-800 '
                }`}
              >
                지그재그형 (1→2→3 ↓ 6←5←4)
              </button>
            </div>

            {/* 서비스 선택 드롭다운 (All services) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsServiceMenuOpen((v) => !v)}
                className="inline-flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-lg border border-zinc-200  bg-white  text-xs font-medium text-zinc-700  hover:border-zinc-300  shadow-2xs transition cursor-pointer"
              >
                <span>{activeServiceOption.label}</span>
                <ChevronDown size={14} className="text-klic-muted" />
              </button>

              {isServiceMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-64 p-1 rounded-xl border border-zinc-200  bg-white  shadow-xl z-30 space-y-0.5">
                  {SERVICE_OPTIONS.map((opt) => {
                    const active = opt.id === selectedService;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSelectedService(opt.id);
                          setIsServiceMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                          active
                            ? 'bg-zinc-100  font-semibold text-zinc-900 '
                            : 'text-klic-muted  hover:bg-zinc-50 '
                        }`}
                      >
                        <span className="truncate">{opt.label}</span>
                        {active && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 본문: 6개 배포 환경 카드 & 'ㄹ'자형 SVG 화살표 브릿지 */}
        <div className="p-6 bg-zinc-50/30 ">
          {/* 1행 (Stage 1 -> Stage 2 -> Stage 3) */}
          <div className="flex flex-col lg:flex-row items-stretch">
            {renderEnvironmentCard(row1Stages[0])}
            <HorizontalSvgConnector direction="right" label="CI 통과" />
            {renderEnvironmentCard(row1Stages[1])}
            <HorizontalSvgConnector direction="right" label="E2E 검증" />
            {renderEnvironmentCard(row1Stages[2])}
          </div>

          {/* 1행 우측 끝(Stage 3)에서 2행 시작점(Stage 4)으로 이어지는 'ㄹ'자형 반환 SVG 화살표 */}
          <RieulTurnaroundSvgConnector flowLayout={flowLayout} />

          {/* 2행 (Stage 4 -> Stage 5 -> Stage 6 또는 역방향) */}
          <div className="flex flex-col lg:flex-row items-stretch">
            {renderEnvironmentCard(row2Stages[0])}
            <HorizontalSvgConnector
              direction={flowLayout === 'rieul' ? 'right' : 'left'}
              label={flowLayout === 'rieul' ? '카나리 진입' : '릴리즈 승격'}
            />
            {renderEnvironmentCard(row2Stages[1])}
            <HorizontalSvgConnector
              direction={flowLayout === 'rieul' ? 'right' : 'left'}
              label={flowLayout === 'rieul' ? '릴리즈 승격' : '카나리 진입'}
            />
            {renderEnvironmentCard(row2Stages[2])}
          </div>
        </div>

        {/* 하단 선택된 스테이지 실시간 텔레메트리 & 게이트 검증 요약 바 */}
        <div className="px-6 py-3.5 border-t border-zinc-200/80  bg-zinc-50/70  flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-200/70  text-zinc-700  font-mono text-[11px] font-semibold shrink-0">
              <Terminal size={12} />
              {activeStageDetail.stageNumber}단계 • {activeStageDetail.envName}
            </span>
            <span className="text-klic-muted  truncate">
              {activeStageDetail.gateDescription}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-klic-muted  shrink-0">
            <span>
              가동 파드:{' '}
              <strong className="text-zinc-800 ">
                {activeStageDetail.podsReady}
              </strong>
            </span>
            <span>
              p95 지연:{' '}
              <strong className="text-zinc-800 ">
                {activeStageDetail.latencyP95}
              </strong>
            </span>
            <span>
              에러율:{' '}
              <strong className="text-blue-600 ">
                {activeStageDetail.errorRate}
              </strong>
            </span>
            <button
              type="button"
              onClick={handleResetPipeline}
              className="inline-flex items-center gap-1 text-klic-muted hover:text-zinc-900  transition cursor-pointer"
              title="파이프라인 상태 초기화"
            >
              <RotateCcw size={12} />
              <span>초기화</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
