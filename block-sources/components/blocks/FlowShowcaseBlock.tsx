import { PersonAvatar } from '../PersonAvatar';
import React, { useState } from 'react';
import {
  GitBranch,
  CheckCircle2,
  XCircle,
  Clock,
  Minus,
  Database,
  Webhook,
  Split,
  Server,
  FileCheck2,
  RefreshCw,
  ArrowRight,
  HelpCircle,
  Plus,
  Check,
  MoreHorizontal,
  Zap,
  Mail,
  MousePointer,
  Hand,
  Undo2,
  Redo2,
  Lock,
  Unlock,
  ChevronRight,
  Play,
  RotateCcw,
} from 'lucide-react';

export type FlowShowcaseMode =
  | 'all-showcase'
  | 'react-flow-lead'
  | 'react-flow-fds'
  | 'react-flow-vip'
  | 'cicd-pipeline'
  | 'webhook-automation'
  | 'etl-lineage'
  | 'microservice-topology'
  | 'approval-routing';

interface FlowShowcaseBlockProps {
  initialMode?: FlowShowcaseMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

const AVATARS = {
  sohee:
    './placeholders/avatar-576a55580552.svg',
  seoyeon:
    './placeholders/avatar-ef94a3ac14b1.svg',
  taewoo:
    './placeholders/avatar-352373979408.svg',
  yujin:
    './placeholders/avatar-8c2580aea9a4.svg',
  minjun:
    './placeholders/avatar-d36430bc2634.svg',
};

type ReactFlowNodeStatus = 'success' | 'failed' | 'idle' | 'skipped';

interface ReactFlowStepNode {
  id: string;
  title: string;
  subtitle: string;
  iconType: 'webhook' | 'branch' | 'database' | 'zap' | 'mail';
  darkIcon?: boolean;
  avatar: string;
  duration: string;
  status: ReactFlowNodeStatus;
  x: number;
  y: number;
  payloadPreview: string;
}

const LEAD_ROUTING_NODES: Record<
  'default' | 'recovered' | 'no-branch',
  ReactFlowStepNode[]
> = {
  default: [
    {
      id: 'rf-1',
      title: '데모 신청 폼 제출됨',
      subtitle: 'Webhook: demo.request',
      iconType: 'webhook',
      darkIcon: true,
      avatar: AVATARS.sohee,
      duration: '0.2초',
      status: 'success',
      x: 36,
      y: 196,
      payloadPreview:
        '{ "event": "demo.request", "company": "한빛핀테크", "size": 420, "domain": "hanbit.kr" }',
    },
    {
      id: 'rf-2',
      title: '엔터프라이즈 플랜 여부',
      subtitle: 'company.size > 200',
      iconType: 'branch',
      avatar: AVATARS.sohee,
      duration: '0.1초',
      status: 'success',
      x: 316,
      y: 196,
      payloadPreview:
        '조건식 평가: company.size (420) > 200 → 참(예) 경로로 라우팅',
    },
    {
      id: 'rf-3',
      title: '기업 데이터 보강 조회',
      subtitle: 'Clearbit 기업정보 조회',
      iconType: 'database',
      avatar: AVATARS.taewoo,
      duration: '8.0초',
      status: 'failed',
      x: 616,
      y: 52,
      payloadPreview:
        '오류: Clearbit Enrichment API 응답 시간 초과 (8,000ms 타임아웃 · 재시도 대기)',
    },
    {
      id: 'rf-4',
      title: '인바운드 딜 생성',
      subtitle: 'HubSpot 파이프라인: 인바운드',
      iconType: 'zap',
      avatar: AVATARS.taewoo,
      duration: '미실행',
      status: 'idle',
      x: 896,
      y: 52,
      payloadPreview:
        '선행 노드(기업 데이터 보강 조회) 완료 대기 중 · 예상 ARR ₩1.2억 딜 카드 생성 예정',
    },
    {
      id: 'rf-5',
      title: '세일즈팀 슬랙 알림',
      subtitle: 'Slack #인바운드-리드',
      iconType: 'mail',
      avatar: AVATARS.minjun,
      duration: '미실행',
      status: 'skipped',
      x: 616,
      y: 340,
      payloadPreview:
        '조건 분기 결과가 참(예)이므로 거짓(아니오) 경로는 건너뜀 처리됨',
    },
  ],
  recovered: [
    {
      id: 'rf-1',
      title: '데모 신청 폼 제출됨',
      subtitle: 'Webhook: demo.request',
      iconType: 'webhook',
      darkIcon: true,
      avatar: AVATARS.sohee,
      duration: '0.2초',
      status: 'success',
      x: 36,
      y: 196,
      payloadPreview:
        '{ "event": "demo.request", "company": "한빛핀테크", "size": 420, "domain": "hanbit.kr" }',
    },
    {
      id: 'rf-2',
      title: '엔터프라이즈 플랜 여부',
      subtitle: 'company.size > 200',
      iconType: 'branch',
      avatar: AVATARS.sohee,
      duration: '0.1초',
      status: 'success',
      x: 316,
      y: 196,
      payloadPreview:
        '조건식 평가: company.size (420) > 200 → 참(예) 경로로 라우팅',
    },
    {
      id: 'rf-3',
      title: '기업 데이터 보강 조회',
      subtitle: 'Clearbit 기업정보 조회',
      iconType: 'database',
      avatar: AVATARS.taewoo,
      duration: '0.4초',
      status: 'success',
      x: 616,
      y: 52,
      payloadPreview:
        '재시도 성공: 연매출 ₩840억 · 산업군 FinTech · 법인 식별번호 매핑 완료',
    },
    {
      id: 'rf-4',
      title: '인바운드 딜 생성',
      subtitle: 'HubSpot 파이프라인: 인바운드',
      iconType: 'zap',
      avatar: AVATARS.taewoo,
      duration: '0.3초',
      status: 'success',
      x: 896,
      y: 52,
      payloadPreview:
        'HubSpot 딜 생성 완료 (var(--klic-component-block-color-accent)L-9482 · 전담 AE 이서연 리드 자동 배정됨)',
    },
    {
      id: 'rf-5',
      title: '세일즈팀 슬랙 알림',
      subtitle: 'Slack #인바운드-리드',
      iconType: 'mail',
      avatar: AVATARS.minjun,
      duration: '미실행',
      status: 'skipped',
      x: 616,
      y: 340,
      payloadPreview:
        '조건 분기 결과가 참(예)이므로 거짓(아니오) 경로는 건너뜀 처리됨',
    },
  ],
  'no-branch': [
    {
      id: 'rf-1',
      title: '데모 신청 폼 제출됨',
      subtitle: 'Webhook: demo.request',
      iconType: 'webhook',
      darkIcon: true,
      avatar: AVATARS.sohee,
      duration: '0.2초',
      status: 'success',
      x: 36,
      y: 196,
      payloadPreview:
        '{ "event": "demo.request", "company": "네오스튜디오", "size": 45, "domain": "neostudio.io" }',
    },
    {
      id: 'rf-2',
      title: '엔터프라이즈 플랜 여부',
      subtitle: 'company.size > 200',
      iconType: 'branch',
      avatar: AVATARS.sohee,
      duration: '0.1초',
      status: 'success',
      x: 316,
      y: 196,
      payloadPreview:
        '조건식 평가: company.size (45) <= 200 → 거짓(아니오) 경로로 라우팅',
    },
    {
      id: 'rf-3',
      title: '기업 데이터 보강 조회',
      subtitle: 'Clearbit 기업정보 조회',
      iconType: 'database',
      avatar: AVATARS.taewoo,
      duration: '미실행',
      status: 'skipped',
      x: 616,
      y: 52,
      payloadPreview:
        '200인 이하 일반 기업 리드이므로 엔터프라이즈 보강 조회 건너뜀',
    },
    {
      id: 'rf-4',
      title: '인바운드 딜 생성',
      subtitle: 'HubSpot 파이프라인: 인바운드',
      iconType: 'zap',
      avatar: AVATARS.taewoo,
      duration: '미실행',
      status: 'skipped',
      x: 896,
      y: 52,
      payloadPreview: '상위 분기 건너뜀으로 인해 실행 제외됨',
    },
    {
      id: 'rf-5',
      title: '세일즈팀 슬랙 알림',
      subtitle: 'Slack #인바운드-리드',
      iconType: 'mail',
      avatar: AVATARS.minjun,
      duration: '0.2초',
      status: 'success',
      x: 616,
      y: 340,
      payloadPreview:
        'Slack #인바운드-리드 채널에 셀프서브 데모 안내 메시지 발송 완료',
    },
  ],
};

const LEAD_EXTRA_SIXTH_NODE: ReactFlowStepNode = {
  id: 'rf-6',
  title: '전담 AE 캘린더 배정',
  subtitle: 'Calendly: enterprise-ae',
  iconType: 'mail',
  avatar: AVATARS.seoyeon,
  duration: '0.2초',
  status: 'success',
  x: 896,
  y: 340,
  payloadPreview:
    '신규 추가 단계: 인바운드 리드 확인 즉시 담당 AE 미팅 슬롯 초대장 자동 발송',
};

export function FlowShowcaseBlock({
  initialMode = 'react-flow-lead',
  density = 'normal',
}: FlowShowcaseBlockProps) {
  const [activeMode, setActiveMode] = useState<FlowShowcaseMode>(initialMode);

  React.useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  const boxPad =
    density === 'compact' ? 'p-4' : density === 'relaxed' ? 'p-7' : 'p-5';

  // --- 형태 1 상태: 카드형 리액트 플로우 (엔터프라이즈 리드 라우팅 + 실시간 SVG 입자) ---
  const [rfSelectedNodeId, setRfSelectedNodeId] = useState<string>('rf-3');
  const [rfBranchState, setRfBranchState] = useState<
    'default' | 'recovered' | 'no-branch'
  >('default');
  const [rfHasExtraStep, setRfHasExtraStep] = useState<boolean>(false);
  const [rfUpdated, setRfUpdated] = useState<boolean>(false);
  const [rfToolMode, setRfToolMode] = useState<'select' | 'pan'>('pan');
  const [rfZoom, setRfZoom] = useState<number>(81);
  const [rfLocked, setRfLocked] = useState<boolean>(false);
  const [rfShowHelp, setRfShowHelp] = useState<boolean>(false);
  const [rfFlowAnimated, setRfFlowAnimated] = useState<boolean>(true);

  // --- 형태 2 상태: 아이콘 타일 + 원형 보조 노드 + 인라인 승인 게이트 SVG DAG 플로우 ---
  const [dagSelectedId, setDagSelectedId] =
    useState<string>('reconcile_ledger');
  const [dagMrrApproved, setDagMrrApproved] = useState<boolean>(false);
  const [dagLedgerFixed, setDagLedgerFixed] = useState<boolean>(false);
  const [dagStreamActive, setDagStreamActive] = useState<boolean>(true);

  // --- 형태 3 상태: 멀티스트림 베지어 곡선 & AI 실시간 이벤트 오케스트레이션 SVG 플로우 ---
  const [streamFocusBranch, setStreamFocusBranch] = useState<
    'all' | 'risk' | 'vip' | 'normal'
  >('all');
  const [streamSelectedNode, setStreamSelectedNode] =
    useState<string>('hub-ai');
  const [streamBoost, setStreamBoost] = useState<boolean>(false);

  // --- 스타일 4~8 상태 ---
  const [selectedCicdNode, setSelectedCicdNode] = useState<string>('cicd-5');
  const [canaryWeight, setCanaryWeight] = useState<number>(25);
  const [cicdPromoted, setCicdPromoted] = useState<boolean>(false);

  const [webhookScenario, setWebhookScenario] = useState<
    'enterprise' | 'standard'
  >('enterprise');
  const [selectedWebhookNode, setSelectedWebhookNode] =
    useState<string>('wh-branch');
  const [testRunDone, setTestRunDone] = useState<boolean>(false);

  const [selectedLineageNode, setSelectedLineageNode] =
    useState<string>('lin-transform');
  const [schemaFixed, setSchemaFixed] = useState<boolean>(false);

  const [selectedTopologySvc, setSelectedTopologySvc] =
    useState<string>('svc-settlement');
  const [rerouteActive, setRerouteActive] = useState<boolean>(true);

  const [approvalTier, setApprovalTier] = useState<'over50m' | 'under50m'>(
    'over50m'
  );
  const [cfoApproved, setCfoApproved] = useState<boolean>(false);

  // ============================================================================
  // 형태 1. 카드형 React Flow 워크플로우 캔버스 + SVG 실시간 입자 흐름 (KLIC/react-flow-1)
  // ============================================================================
  const renderLeadRoutingCardFlow = () => {
    const baseNodes = LEAD_ROUTING_NODES[rfBranchState];
    const activeNodes = rfHasExtraStep
      ? [...baseNodes, LEAD_EXTRA_SIXTH_NODE]
      : baseNodes;

    const selectedNode =
      activeNodes.find((n) => n.id === rfSelectedNodeId) || activeNodes[2];

    const renderNodeIcon = (
      iconType: ReactFlowStepNode['iconType'],
      dark?: boolean
    ) => {
      const iconClass = `w-4 h-4 ${
        dark
          ? 'text-klic-on-emphasis '
          : 'text-zinc-700 '
      }`;
      switch (iconType) {
        case 'webhook':
          return <Webhook className={iconClass} />;
        case 'branch':
          return <GitBranch className={iconClass} />;
        case 'database':
          return <Database className={iconClass} />;
        case 'zap':
          return <Zap className={iconClass} />;
        case 'mail':
          return <Mail className={iconClass} />;
      }
    };

    const renderStatusBadge = (status: ReactFlowNodeStatus) => {
      switch (status) {
        case 'success':
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--klic-component-block-color-soft)]  border border-blue-200/90  text-blue-700  text-[11px] font-medium">
              <CheckCircle2 className="w-3 h-3 text-blue-600  shrink-0" />
              <span>성공</span>
            </span>
          );
        case 'failed':
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--klic-component-block-color-soft)]  border border-blue-200/90  text-blue-600  text-[11px] font-medium">
              <XCircle className="w-3 h-3 text-blue-500  shrink-0" />
              <span>실패</span>
            </span>
          );
        case 'idle':
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-50  border border-zinc-200/90  text-zinc-700  text-[11px] font-medium">
              <Clock className="w-3 h-3 text-klic-muted  shrink-0" />
              <span>대기 중</span>
            </span>
          );
        case 'skipped':
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-50  border border-zinc-200/90  text-klic-muted  text-[11px] font-medium">
              <Minus className="w-3 h-3 text-klic-muted shrink-0" />
              <span>건너뜀</span>
            </span>
          );
      }
    };

    const scaleRatio = Math.max(0.65, Math.min(1.08, rfZoom / 81));
    const isYesActive = rfBranchState !== 'no-branch';
    const isYesComplete = rfBranchState === 'recovered';

    return (
      <div className="w-full max-w-[1180px] mx-auto rounded-[20px] bg-white  border border-zinc-200/90  shadow-xs overflow-hidden">
        {/* 상단 React Flow 워크플로우 헤더 바 */}
        <div className="px-5 py-3 border-b border-zinc-200/80  bg-white  flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-[13.5px]">
            <span className="text-klic-muted  font-medium">
              워크플로우
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-klic-muted" />
            <span className="font-semibold text-zinc-900 ">
              엔터프라이즈 리드 라우팅
            </span>

            <span className="h-4 w-px bg-zinc-200  mx-1.5" />

            <span className="text-[12.5px] text-klic-muted ">
              {rfHasExtraStep ? 6 : 5}단계, {rfHasExtraStep ? 5 : 4}개 연결
            </span>

            <span className="text-klic-muted ">•</span>

            <div className="flex items-center gap-1.5">
              <PersonAvatar
                src={AVATARS.sohee}
                alt="한소윤"
                className="w-4 h-4 rounded-full object-cover ring-1 ring-zinc-200 "
              />
              <span className="text-[12.5px] text-klic-muted ">
                {rfUpdated ? '방금 전' : '2시간 전'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRfFlowAnimated((v) => !v)}
              className={`px-2.5 py-1 rounded-xl border text-[11.5px] font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                rfFlowAnimated
                  ? 'border-blue-200 bg-blue-50/80 text-blue-700   '
                  : 'border-zinc-200  text-klic-muted'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  rfFlowAnimated
                    ? 'bg-blue-500 animate-pulse'
                    : 'bg-zinc-400'
                }`}
              />
              <span>SVG 흐름 {rfFlowAnimated ? '활성' : '정지'}</span>
            </button>

            <button
              type="button"
              onClick={() => setRfShowHelp((v) => !v)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-klic-muted hover:bg-zinc-100  transition cursor-pointer"
              title="워크플로우 도움말"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (rfLocked) return;
                setRfHasExtraStep((v) => !v);
                setRfUpdated(false);
              }}
              className={`px-3.5 py-1.5 rounded-xl border text-[12.5px] font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                rfHasExtraStep
                  ? 'border-zinc-900 bg-klic-inverse text-klic-on-emphasis   '
                  : 'border-zinc-200/90  bg-white  hover:bg-zinc-50  text-zinc-900  shadow-2xs'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{rfHasExtraStep ? '추가 단계 제거' : '단계 추가'}</span>
            </button>

            <button
              type="button"
              onClick={() => setRfUpdated(true)}
              className={`px-3.5 py-1.5 rounded-xl border text-[12.5px] font-medium flex items-center gap-1.5 transition cursor-pointer ${
                rfUpdated
                  ? 'border-blue-200 bg-blue-50 text-blue-700   '
                  : 'border-zinc-200/80  bg-zinc-50/70  hover:bg-zinc-100  text-klic-muted '
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{rfUpdated ? '업데이트됨' : '업데이트'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRfBranchState((prev) =>
                  prev === 'default'
                    ? 'recovered'
                    : prev === 'recovered'
                    ? 'no-branch'
                    : 'default'
                );
              }}
              className="w-8 h-8 rounded-xl border border-zinc-200/90  bg-white  hover:bg-zinc-50  flex items-center justify-center text-klic-muted  cursor-pointer"
              title="실행 분기 시나리오 전환"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {rfShowHelp && (
          <div className="px-5 py-2.5 bg-zinc-50  border-b border-zinc-200/80  flex flex-wrap items-center justify-between gap-2 text-[12px] text-klic-muted ">
            <span>
              데모 신청 폼 웹훅 수신 후 임직원 200명 초과 여부에 따라 Clearbit 기업 보강 및 HubSpot 딜 생성으로 분기합니다.
            </span>
            <span className="font-mono text-[11px] text-klic-muted">
              하단 시뮬레이션 버튼으로 실패 복구·분기 전환 시 SVG 흐름 입자 경로가 실시간 변경됩니다.
            </span>
          </div>
        )}

        {/* 메인 React Flow 도트 그리드 캔버스 */}
        <div className="relative w-full h-[520px] bg-white  bg-[radial-gradient(var(--klic-component-block-color-border)_1.25px,transparent_1.25px)]  [background-size:18px_18px] overflow-x-auto overflow-y-hidden select-none">
          <div
            className="relative min-w-[1160px] h-full mx-auto transition-transform duration-200 origin-center"
            style={{ transform: `scale(${scaleRatio})` }}
          >
            {/* 직교(Smooth-Step) 점선 SVG 커넥터 + 실시간 입자 애니메이션 레이어 */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 1160 520"
              fill="none"
            >
              {/* 1 -> 2 수평 점선 */}
              <path
                d="M 272 248 L 316 248"
                stroke="var(--klic-component-block-color-muted)"
                strokeWidth="1.75"
                strokeDasharray="4 4"
              />

              {/* 2 -> 3 상단 분기 (Yes / 예) 직교 라운드 점선 */}
              <path
                d="M 552 248 L 576 248 Q 584 248 584 240 L 584 112 Q 584 104 592 104 L 616 104"
                stroke={
                  !isYesActive
                    ? 'var(--klic-component-block-color-border)'
                    : isYesComplete
                    ? 'var(--klic-component-block-color-accent)'
                    : 'var(--klic-component-block-color-muted)'
                }
                strokeWidth={isYesActive ? '1.85' : '1.5'}
                strokeDasharray="4 4"
              />

              {/* 3 -> 4 상단 우측 수평 점선 */}
              <path
                d="M 852 104 L 896 104"
                stroke={
                  !isYesActive
                    ? 'var(--klic-component-block-color-border)'
                    : isYesComplete
                    ? 'var(--klic-component-block-color-accent)'
                    : 'var(--klic-component-block-color-control-border)'
                }
                strokeWidth={isYesComplete ? '1.85' : '1.5'}
                strokeDasharray="4 4"
              />

              {/* 2 -> 5 하단 분기 (No / 아니오) 직교 라운드 점선 */}
              <path
                d="M 552 248 L 576 248 Q 584 248 584 256 L 584 384 Q 584 392 592 392 L 616 392"
                stroke={!isYesActive ? 'var(--klic-component-block-color-accent)' : 'var(--klic-component-block-color-control-border)'}
                strokeWidth={!isYesActive ? '1.85' : '1.5'}
                strokeDasharray="4 4"
              />

              {/* 5 -> 6 추가 단계 연결 점선 */}
              {rfHasExtraStep && (
                <path
                  d="M 852 392 L 896 392"
                  stroke="var(--klic-component-block-color-accent)"
                  strokeWidth="1.85"
                  strokeDasharray="4 4"
                />
              )}

              {/* 실시간 SVG 데이터 패킷 입자 (animateMotion) */}
              {rfFlowAnimated && (
                <>
                  <circle r="3.5" fill="var(--klic-component-block-color-text)" className="">
                    <animateMotion
                      dur="1.2s"
                      repeatCount="indefinite"
                      path="M 272 248 L 316 248"
                    />
                  </circle>

                  {isYesActive && (
                    <circle
                      r="4"
                      fill={isYesComplete ? 'var(--klic-component-block-color-accent)' : 'var(--klic-component-block-color-danger)'}
                    >
                      <animateMotion
                        dur="2.1s"
                        repeatCount="indefinite"
                        path="M 552 248 L 576 248 Q 584 248 584 240 L 584 112 Q 584 104 592 104 L 616 104"
                      />
                    </circle>
                  )}

                  {isYesComplete && (
                    <circle r="3.5" fill="var(--klic-component-block-color-accent)">
                      <animateMotion
                        dur="1.1s"
                        repeatCount="indefinite"
                        path="M 852 104 L 896 104"
                      />
                    </circle>
                  )}

                  {!isYesActive && (
                    <circle r="4" fill="var(--klic-component-block-color-accent)">
                      <animateMotion
                        dur="2.0s"
                        repeatCount="indefinite"
                        path="M 552 248 L 576 248 Q 584 248 584 256 L 584 384 Q 584 392 592 392 L 616 392"
                      />
                    </circle>
                  )}

                  {rfHasExtraStep && (
                    <circle r="3.5" fill="var(--klic-component-block-color-accent)">
                      <animateMotion
                        dur="1.1s"
                        repeatCount="indefinite"
                        path="M 852 392 L 896 392"
                      />
                    </circle>
                  )}
                </>
              )}
            </svg>

            {/* 분기 라벨 배지: 예 (Yes) */}
            <div
              style={{ left: 584, top: 184 }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 px-2 py-0.5 rounded-md border text-[11px] font-medium shadow-2xs ${
                isYesActive
                  ? 'bg-white  border-zinc-300  text-zinc-800 '
                  : 'bg-zinc-50  border-zinc-200/80  text-klic-muted'
              }`}
            >
              예
            </div>

            {/* 분기 라벨 배지: 아니오 (No) */}
            <div
              style={{ left: 584, top: 306 }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 px-2 py-0.5 rounded-md border text-[11px] font-medium shadow-2xs ${
                !isYesActive
                  ? 'bg-blue-50  border-blue-300  text-blue-700 '
                  : 'bg-white  border-zinc-200/90  text-klic-muted '
              }`}
            >
              아니오
            </div>

            {/* 5개 (또는 6개) React Flow 카드 노드 */}
            {activeNodes.map((node) => {
              const isSelected = node.id === selectedNode.id;
              const hasLeftHandle = node.id !== 'rf-1';
              const hasRightHandle = true;

              return (
                <div
                  key={node.id}
                  style={{ left: node.x, top: node.y, width: 236 }}
                  onClick={() => setRfSelectedNodeId(node.id)}
                  className={`absolute rounded-xl bg-white  border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-zinc-900  ring-2 ring-zinc-900/10  shadow-md'
                      : 'border-zinc-200/95  hover:border-zinc-300  shadow-xs'
                  }`}
                >
                  {hasLeftHandle && (
                    <span className="absolute -left-[3.5px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-klic-inverse " />
                  )}
                  {hasRightHandle && (
                    <span className="absolute -right-[3.5px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-klic-inverse " />
                  )}

                  <div className="p-3 pb-2.5 flex items-start gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        node.darkIcon
                          ? 'bg-klic-inverse  text-klic-on-emphasis  shadow-2xs'
                          : 'bg-zinc-50  border border-zinc-200/90 '
                      }`}
                    >
                      {renderNodeIcon(node.iconType, node.darkIcon)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12.5px] font-semibold text-zinc-900  truncate leading-snug">
                        {node.title}
                      </div>
                      <div className="text-[11px] text-klic-muted  truncate mt-0.5">
                        {node.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-2 border-t border-zinc-100  flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <PersonAvatar
                        src={node.avatar}
                        alt={node.avatar === AVATARS.sohee ? '한소윤' : node.avatar === AVATARS.taewoo ? '강태우' : '김민준'}
                        className="w-4 h-4 rounded-full object-cover ring-1 ring-zinc-200 "
                      />
                      <span className="text-[11px] font-mono text-klic-muted ">
                        {node.duration}
                      </span>
                    </div>

                    {renderStatusBadge(node.status)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 좌측 하단 플로팅 캔버스 컨트롤 바 */}
          <div className="absolute left-5 bottom-5 z-20 flex items-center gap-1 px-2 py-1.5 rounded-2xl bg-white  border border-zinc-200/90  shadow-xs">
            <button
              type="button"
              onClick={() => setRfToolMode('select')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                rfToolMode === 'select'
                  ? 'bg-zinc-100  text-zinc-900 '
                  : 'text-klic-muted hover:text-zinc-800 '
              }`}
              title="선택 도구"
            >
              <MousePointer className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setRfToolMode('pan')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                rfToolMode === 'pan'
                  ? 'bg-zinc-100  text-zinc-900 '
                  : 'text-klic-muted hover:text-zinc-800 '
              }`}
              title="캔버스 이동 도구"
            >
              <Hand className="w-3.5 h-3.5" />
            </button>

            <span className="h-4 w-px bg-zinc-200  mx-1" />

            <button
              type="button"
              onClick={() => setRfZoom((z) => Math.max(60, z - 9))}
              className="px-1.5 py-1 rounded-lg text-klic-muted  hover:bg-zinc-100  text-[13px] font-medium cursor-pointer"
              title="축소"
            >
              −
            </button>
            <span className="px-1.5 text-[12px] font-mono font-semibold text-zinc-800  min-w-[40px] text-center">
              {rfZoom}%
            </span>
            <button
              type="button"
              onClick={() => setRfZoom((z) => Math.min(100, z + 9))}
              className="px-1.5 py-1 rounded-lg text-klic-muted  hover:bg-zinc-100  text-[13px] font-medium cursor-pointer"
              title="확대"
            >
              +
            </button>

            <span className="h-4 w-px bg-zinc-200  mx-1" />

            <button
              type="button"
              onClick={() => setRfBranchState('default')}
              className="p-1.5 rounded-lg text-klic-muted hover:bg-zinc-100  hover:text-zinc-800 cursor-pointer"
              title="실행 취소"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setRfBranchState('recovered')}
              className="p-1.5 rounded-lg text-klic-muted hover:bg-zinc-100  hover:text-zinc-800 cursor-pointer"
              title="다시 실행"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>

            <span className="h-4 w-px bg-zinc-200  mx-1" />

            <button
              type="button"
              onClick={() => setRfLocked((v) => !v)}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                rfLocked
                  ? 'bg-klic-inverse text-klic-on-emphasis  '
                  : 'text-klic-muted  hover:bg-zinc-100 '
              }`}
              title={rfLocked ? '캔버스 잠금 해제' : '캔버스 위치 잠금'}
            >
              {rfLocked ? (
                <Lock className="w-3.5 h-3.5" />
              ) : (
                <Unlock className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-[11px] font-medium text-klic-muted  pointer-events-none">
            React Flow
          </div>

          {/* 우측 하단 미니맵 */}
          <div className="hidden sm:block absolute right-5 bottom-5 z-20 w-[196px] h-[120px] rounded-xl bg-zinc-100/85  border border-zinc-200/80  p-2.5 shadow-2xs">
            <div className="w-full h-full rounded-md bg-white  relative overflow-hidden">
              <div
                onClick={() => setRfSelectedNodeId('rf-1')}
                className={`absolute left-[6%] top-[43%] w-[20%] h-[15%] rounded-[2px] cursor-pointer transition ${
                  selectedNode.id === 'rf-1'
                    ? 'bg-klic-inverse '
                    : 'bg-zinc-300 '
                }`}
              />
              <div
                onClick={() => setRfSelectedNodeId('rf-2')}
                className={`absolute left-[30%] top-[43%] w-[20%] h-[15%] rounded-[2px] cursor-pointer transition ${
                  selectedNode.id === 'rf-2'
                    ? 'bg-klic-inverse '
                    : 'bg-zinc-300 '
                }`}
              />
              <div
                onClick={() => setRfSelectedNodeId('rf-3')}
                className={`absolute left-[54%] top-[23%] w-[20%] h-[15%] rounded-[2px] cursor-pointer transition ${
                  selectedNode.id === 'rf-3'
                    ? 'bg-blue-500'
                    : 'bg-zinc-300 '
                }`}
              />
              <div
                onClick={() => setRfSelectedNodeId('rf-4')}
                className={`absolute left-[78%] top-[23%] w-[18%] h-[15%] rounded-[2px] cursor-pointer transition ${
                  selectedNode.id === 'rf-4'
                    ? 'bg-klic-inverse '
                    : 'bg-zinc-300 '
                }`}
              />
              <div
                onClick={() => setRfSelectedNodeId('rf-5')}
                className={`absolute left-[54%] top-[63%] w-[20%] h-[15%] rounded-[2px] cursor-pointer transition ${
                  selectedNode.id === 'rf-5'
                    ? 'bg-klic-inverse '
                    : 'bg-zinc-300 '
                }`}
              />
              {rfHasExtraStep && (
                <div
                  onClick={() => setRfSelectedNodeId('rf-6')}
                  className={`absolute left-[78%] top-[63%] w-[18%] h-[15%] rounded-[2px] cursor-pointer transition ${
                    selectedNode.id === 'rf-6'
                      ? 'bg-blue-600'
                      : 'bg-zinc-300 '
                  }`}
                />
              )}
            </div>
          </div>
        </div>

        {/* 하단 선택 노드 인스펙터 & 실행 시뮬레이션 컨트롤 바 */}
        <div className="px-5 py-3 border-t border-zinc-200/80  bg-zinc-50/70  flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 text-[12px]">
            <span className="px-2 py-0.5 rounded-md bg-klic-inverse  text-klic-on-emphasis  font-semibold text-[11px]">
              선택된 노드: {selectedNode.title}
            </span>
            <span className="font-mono text-klic-muted ">
              {selectedNode.payloadPreview}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setRfBranchState('default')}
              className={`px-2.5 py-1 rounded-lg text-[11.5px] font-medium transition cursor-pointer flex items-center gap-1 ${
                rfBranchState === 'default'
                  ? 'bg-klic-inverse text-klic-on-emphasis  '
                  : 'bg-white  border border-zinc-200  text-klic-muted '
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              <span>기본 상태 (실패 포함)</span>
            </button>
            <button
              type="button"
              onClick={() => setRfBranchState('recovered')}
              className={`px-2.5 py-1 rounded-lg text-[11.5px] font-medium transition cursor-pointer flex items-center gap-1 ${
                rfBranchState === 'recovered'
                  ? 'bg-blue-600 text-klic-on-emphasis'
                  : 'bg-white  border border-zinc-200  text-klic-muted '
              }`}
            >
              <Play className="w-3 h-3" />
              <span>예 경로 재시도 성공</span>
            </button>
            <button
              type="button"
              onClick={() => setRfBranchState('no-branch')}
              className={`px-2.5 py-1 rounded-lg text-[11.5px] font-medium transition cursor-pointer ${
                rfBranchState === 'no-branch'
                  ? 'bg-klic-inverse text-klic-on-emphasis  '
                  : 'bg-white  border border-zinc-200  text-klic-muted '
              }`}
            >
              아니오(No) 분기 시뮬레이션
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 형태 2. 아이콘 타일 + 원형 보조 노드 + 인라인 승인 게이트 SVG DAG 플로우
  // (첨부 2번째 스크린샷 /public/assets/aistudio/image_bab1e537.png 아키텍처 1:1 재현 + 한글화)
  // ============================================================================
  const renderNightlyPaymentDagFlow = () => {
    const dagDescriptions: Record<
      string,
      { title: string; type: string; detail: string; rows?: string }
    > = {
      nightly: {
        title: '야간 정기 배치 (Nightly)',
        type: '크론 스케줄러 · 02:00 UTC (11:00 KST)',
        detail:
          '매일 02:00 UTC 정각에 글로벌 결제 게이트웨이(Stripe, PayPal) 원장 추출 파이프라인을 동시 트리거합니다.',
      },
      extract_stripe: {
        title: 'extract_stripe (스트라이프 결제 추출)',
        type: '추출 태스크 · 2분 10초 소요',
        detail:
          'stripe_prod 커넥션을 통해 최근 24시간 카드 승인·환불·분쟁 레코드 1,204,800건을 병렬 추출 완료했습니다.',
        rows: '1.2M 건',
      },
      stripe_prod: {
        title: 'stripe_prod (운영 커넥션)',
        type: '보조 연결 노드 · Connection',
        detail:
          'Stripe Live API (TLS 1.3 · Read-Replica) 전용 보안 터널 연결 상태 정상 (응답 지연 19ms).',
      },
      extract_paypal: {
        title: 'extract_paypal (페이팔 정산 추출)',
        type: '추출 태스크 · 1분 48초 소요',
        detail:
          'paypal_eu 유럽·북미 권역 커넥션에서 384,210건의 익스프레스 체크아웃 정산 내역을 수집했습니다.',
        rows: '384k 건',
      },
      paypal_eu: {
        title: 'paypal_eu (유럽 권역 커넥션)',
        type: '보조 연결 노드 · Connection',
        detail:
          'PayPal Commerce Platform EU Settlement SFTP & REST 하이브리드 커넥터 검증 완료.',
      },
      dedupe_payments: {
        title: 'dedupe_payments (중복 결제 제거)',
        type: '데이터 정제 · 3분 12초 소요',
        detail:
          'Stripe(1.2M rows)와 PayPal(384k rows) 유입 스트림을 병합하고 멱등성 키(Idempotency Key) 기준으로 중복을 제거해 1.5M 건의 정규화 원장을 생성했습니다.',
        rows: '1.5M 건',
      },
      unique_charge: {
        title: 'unique_charge (고유 청구 ID 검증)',
        type: '보조 테스트 노드 · Test',
        detail:
          'dbt unique_charge 무결성 단언(Assertion) 테스트 통과: 1,589,010건 중 기본키 NULL 0건.',
      },
      reconcile_ledger: {
        title: 'reconcile_ledger (원장 대사 검증)',
        type: dagLedgerFixed
          ? '대사 모델 · 패치 완료 (1분 04초)'
          : '대사 오류 · 중복 청구 ID (Duplicate charge id)',
        detail: dagLedgerFixed
          ? '중복 청구 ID(#ch_994821) 자동 격리 패치 완료 → 하위 build_invoices 노드로 1.5M 건 스트림 전송이 재개되었습니다.'
          : 'ledger_v3 모델 대사 중 동일 가맹점 중복 청구 ID 충돌이 감지되어 하위 청구서 발행(build_invoices) 단계가 자동 차단되었습니다.',
      },
      ledger_v3: {
        title: 'ledger_v3 (복식부기 원장 모델)',
        type: '보조 모델 노드 · Model',
        detail:
          '복식부기 차변·대변 합산 일치 및 외화 환율 스냅샷 매핑을 수행하는 핵심 스노우플레이크 변환 모델입니다.',
      },
      build_invoices: {
        title: 'build_invoices (기업 청구서 생성)',
        type: dagLedgerFixed
          ? '생성 완료 · 0분 52초 소요'
          : '상위 병목 대기 · 선행 오류로 차단됨 (Blocked upstream)',
        detail: dagLedgerFixed
          ? '상위 원장 대사 복구 직후 14,200개 엔터프라이즈 고객사 월간 정산 청구서 PDF 및 세금계산서 원장 생성이 완료되었습니다.'
          : '상위 reconcile_ledger 노드의 중복 청구 ID 오류가 해결될 때까지 실행이 안전하게 보류(Blocked upstream)됩니다.',
      },
      publish_mrr: {
        title: 'publish_mrr (월간 반복매출 공시)',
        type: dagMrrApproved
          ? '재무 승인 완료 · 0분 18초 소요'
          : '인라인 결재 게이트 · 승인 대기 중 (Awaiting Approval)',
        detail: dagMrrApproved
          ? '정유진 CFO 승인 완료 → 전사 경영 대시보드에 확정 MRR ₩184.2억 지표가 게시되고 재무팀 슬랙 알림이 발송되었습니다.'
          : '1.5M 건 정산 집계 결과를 경영진 클라우드 마트에 최종 발행하기 전 재무 책임자의 인라인 승인(Approve)을 대기합니다.',
      },
      notify_finance: {
        title: 'notify_finance (재무팀 슬랙 알림)',
        type: dagMrrApproved
          ? '알림 발송 완료 · Slack #재무-정산마감'
          : '보류 중 · 승인 대기 보류 (Holds for Approval)',
        detail: dagMrrApproved
          ? 'Slack #재무-정산마감 채널에 야간 배치 완료 및 MRR 확정 브리핑 메시지가 전송되었습니다.'
          : '선행 publish_mrr 노드의 승인(Approve) 버튼이 클릭되면 즉시 슬랙 웹훅이 발송됩니다.',
      },
    };

    const currentInfo =
      dagDescriptions[dagSelectedId] || dagDescriptions.reconcile_ledger;

    const renderBottomAnchorBadge = (
      state: 'check' | 'error' | 'clock' | 'pause'
    ) => {
      if (state === 'check') {
        return (
          <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-20 w-5 h-5 rounded-full bg-blue-500 text-klic-on-emphasis flex items-center justify-center ring-2 ring-[color:var(--klic-component-block-color-panel)]  shadow-2xs">
            <Check className="w-3 h-3 stroke-[2.8]" />
          </span>
        );
      }
      if (state === 'error') {
        return (
          <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-20 w-5 h-5 rounded-full bg-red-500 text-klic-on-emphasis flex items-center justify-center ring-2 ring-[color:var(--klic-component-block-color-panel)]  shadow-2xs">
            <span className="text-[10px] font-bold leading-none">✕</span>
          </span>
        );
      }
      if (state === 'clock') {
        return (
          <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-20 w-5 h-5 rounded-full bg-zinc-400  text-klic-on-emphasis flex items-center justify-center ring-2 ring-[color:var(--klic-component-block-color-panel)]  shadow-2xs">
            <Clock className="w-3 h-3 stroke-[2.4]" />
          </span>
        );
      }
      return (
        <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-20 w-5 h-5 rounded-full bg-amber-500 text-klic-on-emphasis flex items-center justify-center ring-2 ring-[color:var(--klic-component-block-color-panel)]  shadow-2xs">
          <span className="text-[9px] font-bold tracking-tighter leading-none">
            ❚❚
          </span>
        </span>
      );
    };

    return (
      <div className="w-full max-w-[1180px] mx-auto rounded-[20px] bg-white  border border-zinc-200/90  shadow-xs overflow-hidden">
        {/* 상단 컨트롤 바 */}
        <div className="px-5 py-3 border-b border-zinc-200/80  bg-white  flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-[13.5px]">
            <span className="px-2 py-0.5 rounded-md bg-blue-50  text-blue-700  border border-blue-200/80  text-[11px] font-semibold">
              SVG DAG 파이프라인
            </span>
            <span className="font-semibold text-zinc-900 ">
              야간 정산 원장 대사 & 인라인 승인 게이트 플로우
            </span>
            <span className="text-klic-muted ">•</span>
            <span className="text-[12px] text-klic-muted  font-mono">
              총 1.5M 건 처리 · 실행 8노드 + 보조 4노드
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setDagStreamActive((v) => !v)}
              className={`px-2.5 py-1 rounded-xl border text-[11.5px] font-semibold flex items-center gap-1.5 cursor-pointer transition ${
                dagStreamActive
                  ? 'border-blue-200 bg-blue-50/80 text-blue-700   '
                  : 'border-zinc-200  text-klic-muted'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  dagStreamActive
                    ? 'bg-blue-500 animate-pulse'
                    : 'bg-zinc-400'
                }`}
              />
              <span>SVG 데이터 흐름 {dagStreamActive ? 'ON' : '꺼짐'}</span>
            </button>

            <button
              type="button"
              onClick={() => setDagLedgerFixed((v) => !v)}
              className={`px-3 py-1 rounded-xl border text-[12px] font-semibold cursor-pointer transition ${
                dagLedgerFixed
                  ? 'border-blue-600 bg-blue-600 text-klic-on-emphasis'
                  : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100   '
              }`}
            >
              {dagLedgerFixed
                ? '✓ 중복 청구 ID 패치됨 (reconcile_ledger)'
                : '중복 청구 ID 오류 패치 실행'}
            </button>

            <button
              type="button"
              onClick={() => {
                setDagLedgerFixed(false);
                setDagMrrApproved(false);
              }}
              className="px-2.5 py-1 rounded-xl border border-zinc-200  text-[12px] text-klic-muted  hover:bg-zinc-50  cursor-pointer"
            >
              초기화
            </button>
          </div>
        </div>

        {/* 메인 SVG DAG 도트 캔버스 (첨부 2번째 스샷 레이아웃 100% 구현) */}
        <div className="relative w-full h-[610px] bg-[var(--klic-component-block-color-panel)]  bg-[radial-gradient(var(--klic-component-block-color-border)_1.2px,transparent_1.2px)]  [background-size:16px_16px] overflow-x-auto overflow-y-hidden select-none">
          <div className="relative min-w-[1150px] h-full mx-auto">
            {/* SVG 직교 라운드 엘보우(Rounded Elbow) 엣지 + 수직 점선 의존성 + 실시간 입자 레이어 */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 1150 610"
              fill="none"
            >
              <defs>
                <marker
                  id="dag-arrow-gray"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path
                    d="M 1 1.5 L 8 5 L 1 8.5"
                    stroke="var(--klic-component-block-color-control-border)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </marker>
                <marker
                  id="dag-arrow-emerald"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path
                    d="M 1 1.5 L 8 5 L 1 8.5"
                    stroke="var(--klic-component-block-color-accent)"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </marker>
              </defs>

              {/* 1. Nightly (110, 224) -> extract_stripe (248, 86) 상단 분기 */}
              <path
                d="M 110 224 L 160 224 Q 176 224 176 208 L 176 102 Q 176 86 192 86 L 244 86"
                stroke="var(--klic-component-block-color-control-border)"
                strokeWidth="1.65"
                markerEnd="url(#dag-arrow-gray)"
              />

              {/* 2. Nightly (110, 224) -> extract_paypal (248, 362) 하단 분기 */}
              <path
                d="M 110 224 L 160 224 Q 176 224 176 240 L 176 346 Q 176 362 192 362 L 244 362"
                stroke="var(--klic-component-block-color-control-border)"
                strokeWidth="1.65"
                markerEnd="url(#dag-arrow-gray)"
              />

              {/* 3. extract_stripe -> stripe_prod 수직 점선 연결 */}
              <path
                d="M 284 148 L 284 210"
                stroke="var(--klic-component-block-color-control-border)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* 4. extract_paypal -> paypal_eu 수직 점선 연결 */}
              <path
                d="M 284 424 L 284 486"
                stroke="var(--klic-component-block-color-control-border)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* 5. extract_stripe (320, 86) -> dedupe_payments (486, 224) 상단 병합 (1.2M 건) */}
              <path
                d="M 320 86 L 392 86 Q 408 86 408 102 L 408 208 Q 408 224 424 224 L 482 224"
                stroke="var(--klic-component-block-color-control-border)"
                strokeWidth="1.65"
                markerEnd="url(#dag-arrow-gray)"
              />

              {/* 6. extract_paypal (320, 362) -> dedupe_payments (486, 224) 하단 병합 (384k 건) */}
              <path
                d="M 320 362 L 392 362 Q 408 362 408 346 L 408 240 Q 408 224 424 224 L 482 224"
                stroke="var(--klic-component-block-color-control-border)"
                strokeWidth="1.65"
                markerEnd="url(#dag-arrow-gray)"
              />

              {/* 7. dedupe_payments -> unique_charge 수직 점선 연결 */}
              <path
                d="M 522 286 L 522 350"
                stroke="var(--klic-component-block-color-control-border)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* 8. dedupe_payments (558, 224) -> reconcile_ledger (712, 86) 상단 분기 (1.5M 건) */}
              <path
                d="M 558 224 L 622 224 Q 638 224 638 208 L 638 102 Q 638 86 654 86 L 708 86"
                stroke={dagLedgerFixed ? 'var(--klic-component-block-color-accent)' : 'var(--klic-component-block-color-control-border)'}
                strokeWidth="1.65"
                markerEnd={
                  dagLedgerFixed
                    ? 'url(#dag-arrow-emerald)'
                    : 'url(#dag-arrow-gray)'
                }
              />

              {/* 9. dedupe_payments (558, 224) -> publish_mrr (668, 362) 하단 분기 */}
              <path
                d="M 558 224 L 622 224 Q 638 224 638 240 L 638 346 Q 638 362 654 362 L 664 362"
                stroke={dagMrrApproved ? 'var(--klic-component-block-color-accent)' : 'var(--klic-component-block-color-control-border)'}
                strokeWidth="1.65"
                markerEnd={
                  dagMrrApproved
                    ? 'url(#dag-arrow-emerald)'
                    : 'url(#dag-arrow-gray)'
                }
              />

              {/* 10. reconcile_ledger -> ledger_v3 수직 점선 연결 */}
              <path
                d="M 748 148 L 748 210"
                stroke="var(--klic-component-block-color-control-border)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* 11. reconcile_ledger (784, 86) -> build_invoices (992, 86) 우측 상단 직선 */}
              <path
                d="M 784 86 L 988 86"
                stroke={dagLedgerFixed ? 'var(--klic-component-block-color-accent)' : 'var(--klic-component-block-color-control-border)'}
                strokeWidth="1.65"
                markerEnd={
                  dagLedgerFixed
                    ? 'url(#dag-arrow-emerald)'
                    : 'url(#dag-arrow-gray)'
                }
              />

              {/* 12. publish_mrr (936, 362) -> notify_finance (992, 362) 우측 하단 직선 */}
              <path
                d="M 936 362 L 988 362"
                stroke={dagMrrApproved ? 'var(--klic-component-block-color-accent)' : 'var(--klic-component-block-color-control-border)'}
                strokeWidth="1.65"
                markerEnd={
                  dagMrrApproved
                    ? 'url(#dag-arrow-emerald)'
                    : 'url(#dag-arrow-gray)'
                }
              />

              {/* 실시간 SVG 데이터 스트림 입자 (animateMotion) */}
              {dagStreamActive && (
                <>
                  <circle r="3.5" fill="var(--klic-component-block-color-accent)">
                    <animateMotion
                      dur="1.8s"
                      repeatCount="indefinite"
                      path="M 110 224 L 160 224 Q 176 224 176 208 L 176 102 Q 176 86 192 86 L 244 86"
                    />
                  </circle>
                  <circle r="3.5" fill="var(--klic-component-block-color-accent)">
                    <animateMotion
                      dur="1.9s"
                      repeatCount="indefinite"
                      path="M 110 224 L 160 224 Q 176 224 176 240 L 176 346 Q 176 362 192 362 L 244 362"
                    />
                  </circle>
                  <circle r="4" fill="var(--klic-component-block-color-accent)">
                    <animateMotion
                      dur="2.0s"
                      repeatCount="indefinite"
                      path="M 320 86 L 392 86 Q 408 86 408 102 L 408 208 Q 408 224 424 224 L 482 224"
                    />
                  </circle>
                  <circle r="3.5" fill="var(--klic-component-block-color-accent)">
                    <animateMotion
                      dur="2.1s"
                      repeatCount="indefinite"
                      path="M 320 362 L 392 362 Q 408 362 408 346 L 408 240 Q 408 224 424 224 L 482 224"
                    />
                  </circle>
                  <circle
                    r="4"
                    fill={dagLedgerFixed ? 'var(--klic-component-block-color-accent)' : 'var(--klic-component-block-color-danger)'}
                  >
                    <animateMotion
                      dur="1.9s"
                      repeatCount="indefinite"
                      path="M 558 224 L 622 224 Q 638 224 638 208 L 638 102 Q 638 86 654 86 L 708 86"
                    />
                  </circle>
                  <circle
                    r="4"
                    fill={dagMrrApproved ? 'var(--klic-component-block-color-accent)' : 'var(--klic-component-block-color-warning)'}
                  >
                    <animateMotion
                      dur="2.0s"
                      repeatCount="indefinite"
                      path="M 558 224 L 622 224 Q 638 224 638 240 L 638 346 Q 638 362 654 362 L 664 362"
                    />
                  </circle>
                  {dagLedgerFixed && (
                    <circle r="4" fill="var(--klic-component-block-color-accent)">
                      <animateMotion
                        dur="1.4s"
                        repeatCount="indefinite"
                        path="M 784 86 L 988 86"
                      />
                    </circle>
                  )}
                  {dagMrrApproved && (
                    <circle r="4" fill="var(--klic-component-block-color-accent)">
                      <animateMotion
                        dur="0.9s"
                        repeatCount="indefinite"
                        path="M 936 362 L 988 362"
                      />
                    </circle>
                  )}
                </>
              )}
            </svg>

            {/* 엣지 위 레코드 건수 캡슐 배지 3개 (1.2M 건 / 384k 건 / 1.5M 건) */}
            <div
              style={{ left: 408, top: 154 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 px-2.5 py-0.5 rounded-full bg-zinc-100  border border-zinc-200/90  text-[11px] font-mono font-medium text-klic-muted  shadow-2xs"
            >
              1.2M 건
            </div>
            <div
              style={{ left: 408, top: 294 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 px-2.5 py-0.5 rounded-full bg-zinc-100  border border-zinc-200/90  text-[11px] font-mono font-medium text-klic-muted  shadow-2xs"
            >
              384k 건
            </div>
            <div
              style={{ left: 638, top: 154 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 px-2.5 py-0.5 rounded-full bg-zinc-100  border border-zinc-200/90  text-[11px] font-mono font-medium text-klic-muted  shadow-2xs"
            >
              1.5M 건
            </div>

            {/* 1. Nightly (야간 배치 · 02:00 UTC) */}
            <div
              style={{ left: 38, top: 188 }}
              onClick={() => setDagSelectedId('nightly')}
              className="absolute flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`relative w-[72px] h-[72px] rounded-[18px] bg-white  border-[1.75px] border-blue-500 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${
                  dagSelectedId === 'nightly'
                    ? 'ring-3 ring-blue-500/20'
                    : ''
                }`}
              >
                <span className="absolute -right-[4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-400 border border-white " />
                <Zap className="w-7 h-7 text-zinc-900  fill-zinc-900 " />
                {renderBottomAnchorBadge('check')}
              </div>
              <div className="mt-3 text-center">
                <div className="text-[12.5px] font-semibold text-zinc-900 ">
                  야간 배치
                </div>
                <div className="text-[11px] text-klic-muted font-mono">
                  02:00 UTC
                </div>
              </div>
            </div>

            {/* 2. extract_stripe (2m 10s) */}
            <div
              style={{ left: 248, top: 50 }}
              onClick={() => setDagSelectedId('extract_stripe')}
              className="absolute flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`relative w-[72px] h-[72px] rounded-[18px] bg-white  border-[1.75px] border-blue-500 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${
                  dagSelectedId === 'extract_stripe'
                    ? 'ring-3 ring-blue-500/20'
                    : ''
                }`}
              >
                <span className="absolute -left-[4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-400 border border-white " />
                <span className="absolute -right-[4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-400 border border-white " />
                <div className="w-7 h-7 rounded-md bg-[var(--klic-component-block-color-accent)] flex items-center justify-center -skew-y-6 shadow-2xs">
                  <span className="text-klic-on-emphasis font-bold text-[15px] leading-none">
                    S
                  </span>
                </div>
                {renderBottomAnchorBadge('check')}
              </div>
              <div className="mt-3 text-center">
                <div className="text-[12px] font-mono font-semibold text-zinc-900 ">
                  extract_stripe
                </div>
                <div className="text-[11px] text-klic-muted">2분 10초</div>
              </div>
            </div>

            {/* 2-sub. stripe_prod (원형 보조 노드 · 연결) */}
            <div
              style={{ left: 255, top: 212 }}
              onClick={() => setDagSelectedId('stripe_prod')}
              className="absolute flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`relative w-[58px] h-[58px] rounded-full bg-white  border border-zinc-300  flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105 ${
                  dagSelectedId === 'stripe_prod'
                    ? 'ring-2 ring-zinc-900 '
                    : ''
                }`}
              >
                <span className="absolute -top-[4px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-400 border border-white " />
                <svg
                  className="w-5 h-5 text-zinc-700 "
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                >
                  <path d="M12 22v-5" />
                  <path d="M9 8V2" />
                  <path d="M15 8V2" />
                  <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
                </svg>
              </div>
              <div className="mt-2 text-center">
                <div className="text-[11.5px] font-mono font-semibold text-zinc-800 ">
                  stripe_prod
                </div>
                <div className="text-[10.5px] text-klic-muted">
                  연결
                </div>
              </div>
            </div>

            {/* 3. extract_paypal (1m 48s) */}
            <div
              style={{ left: 248, top: 326 }}
              onClick={() => setDagSelectedId('extract_paypal')}
              className="absolute flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`relative w-[72px] h-[72px] rounded-[18px] bg-white  border-[1.75px] border-blue-500 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${
                  dagSelectedId === 'extract_paypal'
                    ? 'ring-3 ring-blue-500/20'
                    : ''
                }`}
              >
                <span className="absolute -left-[4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-400 border border-white " />
                <span className="absolute -right-[4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-400 border border-white " />
                <div className="relative font-black italic text-[22px] text-[color:var(--klic-component-block-color-accent)] leading-none">
                  P
                  <span className="text-[color:var(--klic-component-block-color-accent)] -ml-1.5">P</span>
                </div>
                {renderBottomAnchorBadge('check')}
              </div>
              <div className="mt-3 text-center">
                <div className="text-[12px] font-mono font-semibold text-zinc-900 ">
                  extract_paypal
                </div>
                <div className="text-[11px] text-klic-muted">1분 48초</div>
              </div>
            </div>

            {/* 3-sub. paypal_eu (원형 보조 노드 · 연결) */}
            <div
              style={{ left: 255, top: 488 }}
              onClick={() => setDagSelectedId('paypal_eu')}
              className="absolute flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`relative w-[58px] h-[58px] rounded-full bg-white  border border-zinc-300  flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105 ${
                  dagSelectedId === 'paypal_eu'
                    ? 'ring-2 ring-zinc-900 '
                    : ''
                }`}
              >
                <span className="absolute -top-[4px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-400 border border-white " />
                <svg
                  className="w-5 h-5 text-zinc-700 "
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                >
                  <path d="M12 22v-5" />
                  <path d="M9 8V2" />
                  <path d="M15 8V2" />
                  <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
                </svg>
              </div>
              <div className="mt-2 text-center">
                <div className="text-[11.5px] font-mono font-semibold text-zinc-800 ">
                  paypal_eu
                </div>
                <div className="text-[10.5px] text-klic-muted">
                  연결
                </div>
              </div>
            </div>

            {/* 4. dedupe_payments (3m 12s) */}
            <div
              style={{ left: 486, top: 188 }}
              onClick={() => setDagSelectedId('dedupe_payments')}
              className="absolute flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`relative w-[72px] h-[72px] rounded-[18px] bg-white  border-[1.75px] border-blue-500 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${
                  dagSelectedId === 'dedupe_payments'
                    ? 'ring-3 ring-blue-500/20'
                    : ''
                }`}
              >
                <span className="absolute -left-[4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-400 border border-white " />
                <span className="absolute -right-[4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-400 border border-white " />
                <Database className="w-7 h-7 text-red-600 " />
                {renderBottomAnchorBadge('check')}
              </div>
              <div className="mt-3 text-center">
                <div className="text-[12px] font-mono font-semibold text-zinc-900 ">
                  dedupe_payments
                </div>
                <div className="text-[11px] text-klic-muted">3분 12초</div>
              </div>
            </div>

            {/* 4-sub. unique_charge (원형 보조 노드 · 테스트) */}
            <div
              style={{ left: 493, top: 352 }}
              onClick={() => setDagSelectedId('unique_charge')}
              className="absolute flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`relative w-[58px] h-[58px] rounded-full bg-white  border border-zinc-300  flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105 ${
                  dagSelectedId === 'unique_charge'
                    ? 'ring-2 ring-zinc-900 '
                    : ''
                }`}
              >
                <span className="absolute -top-[4px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-400 border border-white " />
                <svg
                  className="w-5 h-5 text-zinc-700 "
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div className="mt-2 text-center">
                <div className="text-[11.5px] font-mono font-semibold text-zinc-800 ">
                  unique_charge
                </div>
                <div className="text-[10.5px] text-klic-muted">검증</div>
              </div>
            </div>

            {/* 5. reconcile_ledger (중복 청구 ID 오류 / 패치 가능) */}
            <div
              style={{ left: 712, top: 50 }}
              onClick={() => setDagSelectedId('reconcile_ledger')}
              className="absolute flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`relative w-[72px] h-[72px] rounded-[18px] bg-white  border-[1.75px] ${
                  dagLedgerFixed ? 'border-blue-500' : 'border-red-500'
                } flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${
                  dagSelectedId === 'reconcile_ledger'
                    ? 'ring-3 ring-red-500/20'
                    : ''
                }`}
              >
                <span className="absolute -left-[4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-400 border border-white " />
                <span className="absolute -right-[4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-400 border border-white " />
                <svg
                  className="w-7 h-7 text-zinc-800 "
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                {renderBottomAnchorBadge(dagLedgerFixed ? 'check' : 'error')}
              </div>
              <div className="mt-3 text-center">
                <div className="text-[12px] font-mono font-semibold text-zinc-900 ">
                  reconcile_ledger
                </div>
                <div
                  className={`text-[11px] font-medium ${
                    dagLedgerFixed
                      ? 'text-blue-600 '
                      : 'text-red-500'
                  }`}
                >
                  {dagLedgerFixed ? '패치 완료 (1분 04초)' : '중복 청구 ID 오류'}
                </div>
              </div>
            </div>

            {/* 5-sub. ledger_v3 (원형 보조 노드 · 모델) */}
            <div
              style={{ left: 719, top: 212 }}
              onClick={() => setDagSelectedId('ledger_v3')}
              className="absolute flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`relative w-[58px] h-[58px] rounded-full bg-white  border border-zinc-300  flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105 ${
                  dagSelectedId === 'ledger_v3'
                    ? 'ring-2 ring-zinc-900 '
                    : ''
                }`}
              >
                <span className="absolute -top-[4px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-400 border border-white " />
                <svg
                  className="w-5 h-5 text-zinc-700 "
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                >
                  <polygon points="12 2 2 12 12 22 22 12 12 2" />
                  <line x1="12" y1="2" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                </svg>
              </div>
              <div className="mt-2 text-center">
                <div className="text-[11.5px] font-mono font-semibold text-zinc-800 ">
                  ledger_v3
                </div>
                <div className="text-[10.5px] text-klic-muted">모델</div>
              </div>
            </div>

            {/* 6. build_invoices (Blocked upstream / 선행 오류로 차단됨) */}
            <div
              style={{ left: 992, top: 50 }}
              onClick={() => setDagSelectedId('build_invoices')}
              className="absolute flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`relative w-[72px] h-[72px] rounded-[18px] bg-white  border-[1.75px] ${
                  dagLedgerFixed
                    ? 'border-blue-500'
                    : 'border-zinc-300 '
                } flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${
                  dagSelectedId === 'build_invoices'
                    ? 'ring-3 ring-zinc-400/30'
                    : ''
                }`}
              >
                <span className="absolute -left-[4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-400 border border-white " />
                <FileCheck2 className="w-7 h-7 text-zinc-800 " />
                {renderBottomAnchorBadge(dagLedgerFixed ? 'check' : 'clock')}
              </div>
              <div className="mt-3 text-center">
                <div className="text-[12px] font-mono font-semibold text-zinc-900 ">
                  build_invoices
                </div>
                <div
                  className={`text-[11px] ${
                    dagLedgerFixed
                      ? 'text-blue-600  font-medium'
                      : 'text-klic-muted'
                  }`}
                >
                  {dagLedgerFixed ? '0분 52초 (완료)' : '선행 오류로 차단됨'}
                </div>
              </div>
            </div>

            {/* 7. publish_mrr (와이드 인라인 결재 승인 카드 노드 · Awaiting Approval + Approve 버튼) */}
            <div
              style={{ left: 668, top: 326, width: 268 }}
              onClick={() => setDagSelectedId('publish_mrr')}
              className={`absolute rounded-[18px] bg-white  border-[1.75px] ${
                dagMrrApproved ? 'border-blue-500' : 'border-amber-400'
              } p-3 flex items-center justify-between gap-2.5 shadow-xs cursor-pointer transition-all ${
                dagSelectedId === 'publish_mrr'
                  ? 'ring-3 ring-amber-400/25'
                  : ''
              }`}
            >
              <span className="absolute -left-[4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-400 border border-white " />
              <span className="absolute -right-[4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-400 border border-white " />

              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-zinc-50  border border-zinc-200/80  flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M17.5 19H7a5 5 0 0 1-.5-9.97A6.5 6.5 0 0 1 19.3 11a4 4 0 0 1-1.8 8Z"
                      stroke="var(--klic-component-block-color-accent)"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 7a5 5 0 0 0-4.9 4"
                      stroke="var(--klic-component-block-color-warning)"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-mono font-semibold text-zinc-900  truncate">
                    publish_mrr
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      dagMrrApproved
                        ? 'text-blue-600  font-medium'
                        : 'text-klic-muted'
                    }`}
                  >
                    {dagMrrApproved ? '승인 완료됨' : '승인 대기 중'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDagMrrApproved((v) => !v);
                  setDagSelectedId('publish_mrr');
                }}
                className={`px-3.5 py-2 rounded-xl text-[12px] font-semibold transition cursor-pointer shrink-0 ${
                  dagMrrApproved
                    ? 'bg-blue-600 text-klic-on-emphasis'
                    : 'bg-klic-inverse hover:bg-klic-inverse text-klic-on-emphasis  '
                }`}
              >
                {dagMrrApproved ? '✓ 승인됨' : '승인'}
              </button>
            </div>

            {/* 8. notify_finance (Holds for Approval / 재무팀 슬랙 알림) */}
            <div
              style={{ left: 992, top: 326 }}
              onClick={() => setDagSelectedId('notify_finance')}
              className="absolute flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`relative w-[72px] h-[72px] rounded-[18px] bg-white  border-[1.75px] ${
                  dagMrrApproved ? 'border-blue-500' : 'border-amber-400'
                } flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${
                  dagSelectedId === 'notify_finance'
                    ? 'ring-3 ring-amber-400/25'
                    : ''
                }`}
              >
                <span className="absolute -left-[4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-400 border border-white " />
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                  <line
                    x1="9"
                    y1="4"
                    x2="9"
                    y2="20"
                    stroke="var(--klic-component-block-color-accent)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                  <line
                    x1="15"
                    y1="4"
                    x2="15"
                    y2="20"
                    stroke="var(--klic-component-block-color-accent)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                  <line
                    x1="4"
                    y1="9"
                    x2="20"
                    y2="9"
                    stroke="var(--klic-component-block-color-accent)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                  <line
                    x1="4"
                    y1="15"
                    x2="20"
                    y2="15"
                    stroke="var(--klic-component-block-color-warning)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                </svg>
                {renderBottomAnchorBadge(dagMrrApproved ? 'check' : 'pause')}
              </div>
              <div className="mt-3 text-center">
                <div className="text-[12px] font-mono font-semibold text-zinc-900 ">
                  notify_finance
                </div>
                <div
                  className={`text-[11px] ${
                    dagMrrApproved
                      ? 'text-blue-600  font-medium'
                      : 'text-klic-muted'
                  }`}
                >
                  {dagMrrApproved ? '슬랙 발송 완료' : '승인 대기 보류'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 노드 상세 인스펙터 바 */}
        <div className="px-5 py-3.5 border-t border-zinc-200/80  bg-zinc-50/70  flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-klic-inverse  text-klic-on-emphasis  text-[11px] font-mono font-semibold">
                {currentInfo.title}
              </span>
              <span className="text-[12px] font-medium text-klic-muted">
                {currentInfo.type}
              </span>
            </div>
            <p className="text-[12px] text-klic-muted  leading-relaxed">
              {currentInfo.detail}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDagMrrApproved((v) => !v)}
              className="px-3 py-1.5 rounded-xl bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis text-[12px] font-semibold cursor-pointer"
            >
              {dagMrrApproved
                ? '✓ publish_mrr 승인 완료'
                : 'publish_mrr 즉시 승인'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 형태 3. 멀티스트림 베지어 곡선 & AI 실시간 이벤트 오케스트레이션 SVG 플로우 (KLIC/react-flow-3)
  // ============================================================================
  const renderMultiStreamOrchestrationSvgFlow = () => {
    const streamDetails: Record<
      string,
      { name: string; throughput: string; desc: string }
    > = {
      'src-pg': {
        name: '글로벌 PG 승인 스트림 (src.pg_auth)',
        throughput: '4,820 evt/s',
        desc: '한국·일본·북미·유럽 결제 게이트웨이에서 유입되는 실시간 카드/계좌 승인 웹훅 스트림입니다.',
      },
      'src-app': {
        name: '앱 텔레메트리 & 세션 스트림 (src.session_telemetry)',
        throughput: '12,400 evt/s',
        desc: '워크스페이스 내 기능별 클릭스트림, API 호출 빈도 변화, 세션 이상 징후를 실시간 수집합니다.',
      },
      'src-erp': {
        name: '엔터프라이즈 정산 원장 변경분 (src.ledger_cdc)',
        throughput: '1,940 evt/s',
        desc: '고액 출금 요청, 약정 시트 변경, 파트너 수수료 정산 트랜잭션의 CDC 이벤트 스트림입니다.',
      },
      'hub-ai': {
        name: 'AI 멀티모달 리스크 & 이탈 스코어링 엔진 (v4.2)',
        throughput: streamBoost
          ? '57,480 evt/s (3x 피크)'
          : '19,160 evt/s 병합 처리',
        desc: '3개 인입 스트림을 14ms 이내에 실시간 조인하여 (1) 고위험 이상거래(FDS), (2) VIP 이탈 위험군, (3) 정상 패스트트랙 경로로 SVG 스트림을 분기합니다.',
      },
      'out-risk': {
        name: 'FDS 즉시 계좌 동결 & 2FA 강제 인증 (위험도 ≥ 85)',
        throughput: '142 건/분 차단',
        desc: '단시간 다중 국가 결제 시도 및 비정상 출금 감지 시 즉시 출금을 보류하고 보안관제 워룸으로 경보를 전파합니다.',
      },
      'out-vip': {
        name: 'VIP 이탈 방어 플레이북 & CSM 자동 배정 (이탈률 ≥ 70%)',
        throughput: '38 계정/일 케어',
        desc: '연간 ARR ₩1억 이상 핵심 고객사의 사용량 급감 감지 시 전담 CSM 긴급 점검 슬롯과 우대 크레딧을 즉시 발행합니다.',
      },
      'out-normal': {
        name: '무중단 복식부기 원장 자동 커밋 (정상 < 30)',
        throughput: '18,980 evt/s 직행',
        desc: '정상 판정된 대용량 이벤트를 지연 없이 불변 원장 스토리지 및 실시간 BI 마트로 스트리밍 적재합니다.',
      },
    };

    const activeDetail =
      streamDetails[streamSelectedNode] || streamDetails['hub-ai'];
    const speedDur = streamBoost ? '0.9s' : '2.1s';

    const showRisk =
      streamFocusBranch === 'all' || streamFocusBranch === 'risk';
    const showVip = streamFocusBranch === 'all' || streamFocusBranch === 'vip';
    const showNormal =
      streamFocusBranch === 'all' || streamFocusBranch === 'normal';

    return (
      <div className="w-full max-w-[1180px] mx-auto rounded-[20px] bg-white  border border-zinc-200/90  shadow-xs overflow-hidden">
        {/* 상단 컨트롤 헤더 */}
        <div className="px-5 py-3 border-b border-zinc-200/80  bg-white  flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-[13.5px]">
            <span className="px-2 py-0.5 rounded-md bg-klic-inverse  text-klic-on-emphasis  text-[11px] font-semibold">
              SVG 베지어 스트림 토폴로지
            </span>
            <span className="font-semibold text-zinc-900 ">
              실시간 멀티스트림 AI 스코어링 & 다중채널 오케스트레이션 플로우
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', label: '전체 스트림' },
                { id: 'risk', label: '고위험 FDS 차단 경로' },
                { id: 'vip', label: 'VIP 이탈방어 경로' },
                { id: 'normal', label: '정상 원장 커밋 경로' },
              ] as const
            ).map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setStreamFocusBranch(b.id)}
                className={`px-2.5 py-1 rounded-lg text-[11.5px] font-medium cursor-pointer transition ${
                  streamFocusBranch === b.id
                    ? 'bg-klic-inverse text-klic-on-emphasis   font-semibold'
                    : 'bg-zinc-100  text-klic-muted  hover:text-zinc-900'
                }`}
              >
                {b.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setStreamBoost((v) => !v)}
              className={`ml-1 px-2.5 py-1 rounded-lg border text-[11.5px] font-semibold cursor-pointer transition ${
                streamBoost
                  ? 'border-blue-600 bg-blue-600 text-klic-on-emphasis'
                  : 'border-zinc-200  text-zinc-700 '
              }`}
            >
              {streamBoost ? '⚡ 3x 피크 유입 가속 중' : '트래픽 3x 가속'}
            </button>
          </div>
        </div>

        {/* 메인 베지어 SVG 스트림 캔버스 */}
        <div className="relative w-full h-[540px] bg-[var(--klic-component-block-color-panel)]  bg-[linear-gradient(to_right,var(--klic-component-block-color-soft)_1px,transparent_1px),linear-gradient(to_bottom,var(--klic-component-block-color-soft)_1px,transparent_1px)]  [background-size:24px_24px] overflow-x-auto overflow-y-hidden select-none">
          <div className="relative min-w-[1150px] h-full mx-auto">
            {/* 상단 4단 스테이지 컬럼 라벨 */}
            <div className="absolute top-4 left-0 right-0 px-10 grid grid-cols-4 text-[11px] font-mono uppercase tracking-wider text-klic-muted pointer-events-none">
              <div>단계 01 · 실시간 유입 스트림</div>
              <div className="text-center">단계 02 · AI 점수 산정 허브</div>
              <div className="text-center">단계 03 · 조건부 분기 라우팅</div>
              <div className="text-right pr-6">단계 04 · 최종 실행 대상</div>
            </div>

            {/* 다중 레이어 베지어 곡선 SVG 흐름도 */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 1150 540"
              fill="none"
            >
              {/* 좌측 3개 인입 소스 -> 중앙 AI 스코어링 허브 (450, 275) 베지어 곡선 */}
              <path
                d="M 252 125 C 330 125, 345 275, 412 275"
                stroke="var(--klic-component-block-color-muted)"
                strokeWidth="2.2"
                strokeOpacity="0.45"
              />
              <path
                d="M 252 275 L 412 275"
                stroke="var(--klic-component-block-color-text)"
                strokeWidth="2.8"
                strokeOpacity="0.55"
              />
              <path
                d="M 252 425 C 330 425, 345 275, 412 275"
                stroke="var(--klic-component-block-color-muted)"
                strokeWidth="2.2"
                strokeOpacity="0.45"
              />

              {/* 인입 스트림 흐르는 대시 오버레이 */}
              <path
                d="M 252 125 C 330 125, 345 275, 412 275"
                stroke="var(--klic-component-block-color-text)"
                strokeWidth="2"
                strokeDasharray="6 8"
                className=""
              />
              <path
                d="M 252 275 L 412 275"
                stroke="var(--klic-component-block-color-text)"
                strokeWidth="2.2"
                strokeDasharray="6 8"
                className=""
              />
              <path
                d="M 252 425 C 330 425, 345 275, 412 275"
                stroke="var(--klic-component-block-color-text)"
                strokeWidth="2"
                strokeDasharray="6 8"
                className=""
              />

              {/* 중앙 AI 허브 (568, 275) -> 우측 3갈래 분기 베지어 스트림 */}
              <path
                d="M 568 275 C 630 275, 640 120, 706 120"
                stroke="var(--klic-component-block-color-danger)"
                strokeWidth={showRisk ? '3' : '1.5'}
                strokeOpacity={showRisk ? '0.85' : '0.2'}
              />
              <path
                d="M 920 120 L 976 120"
                stroke="var(--klic-component-block-color-danger)"
                strokeWidth={showRisk ? '2.5' : '1.5'}
                strokeOpacity={showRisk ? '0.85' : '0.2'}
              />

              <path
                d="M 568 275 L 706 275"
                stroke="var(--klic-component-block-color-accent)"
                strokeWidth={showVip ? '3.2' : '1.5'}
                strokeOpacity={showVip ? '0.9' : '0.2'}
              />
              <path
                d="M 920 275 L 976 275"
                stroke="var(--klic-component-block-color-accent)"
                strokeWidth={showVip ? '2.5' : '1.5'}
                strokeOpacity={showVip ? '0.9' : '0.2'}
              />

              <path
                d="M 568 275 C 630 275, 640 430, 706 430"
                stroke="var(--klic-component-block-color-accent)"
                strokeWidth={showNormal ? '3.5' : '1.5'}
                strokeOpacity={showNormal ? '0.9' : '0.2'}
              />
              <path
                d="M 920 430 L 976 430"
                stroke="var(--klic-component-block-color-accent)"
                strokeWidth={showNormal ? '2.5' : '1.5'}
                strokeOpacity={showNormal ? '0.9' : '0.2'}
              />

              {/* 인입 스트림 SVG 입자 */}
              <circle r="4" fill="var(--klic-component-block-color-text)" className="">
                <animateMotion
                  dur={speedDur}
                  repeatCount="indefinite"
                  path="M 252 125 C 330 125, 345 275, 412 275"
                />
              </circle>
              <circle r="4.5" fill="var(--klic-component-block-color-text)" className="">
                <animateMotion
                  dur={streamBoost ? '0.6s' : '1.4s'}
                  repeatCount="indefinite"
                  path="M 252 275 L 412 275"
                />
              </circle>
              <circle r="4" fill="var(--klic-component-block-color-text)" className="">
                <animateMotion
                  dur={speedDur}
                  repeatCount="indefinite"
                  path="M 252 425 C 330 425, 345 275, 412 275"
                />
              </circle>

              {/* 출구 스트림 SVG 입자 */}
              {showRisk && (
                <>
                  <circle r="4.5" fill="var(--klic-component-block-color-danger)">
                    <animateMotion
                      dur={speedDur}
                      repeatCount="indefinite"
                      path="M 568 275 C 630 275, 640 120, 706 120"
                    />
                  </circle>
                  <circle r="4" fill="var(--klic-component-block-color-danger)">
                    <animateMotion
                      dur="0.9s"
                      repeatCount="indefinite"
                      path="M 920 120 L 976 120"
                    />
                  </circle>
                </>
              )}

              {showVip && (
                <>
                  <circle r="4.5" fill="var(--klic-component-block-color-accent)">
                    <animateMotion
                      dur={streamBoost ? '0.7s' : '1.6s'}
                      repeatCount="indefinite"
                      path="M 568 275 L 706 275"
                    />
                  </circle>
                  <circle r="4" fill="var(--klic-component-block-color-accent)">
                    <animateMotion
                      dur="0.9s"
                      repeatCount="indefinite"
                      path="M 920 275 L 976 275"
                    />
                  </circle>
                </>
              )}

              {showNormal && (
                <>
                  <circle r="5" fill="var(--klic-component-block-color-accent)">
                    <animateMotion
                      dur={streamBoost ? '0.65s' : '1.5s'}
                      repeatCount="indefinite"
                      path="M 568 275 C 630 275, 640 430, 706 430"
                    />
                  </circle>
                  <circle r="4" fill="var(--klic-component-block-color-accent)">
                    <animateMotion
                      dur="0.8s"
                      repeatCount="indefinite"
                      path="M 920 430 L 976 430"
                    />
                  </circle>
                </>
              )}
            </svg>

            {/* 분기 스트림 라벨 배지 */}
            <div
              style={{ left: 636, top: 175 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 px-2 py-0.5 rounded-full bg-blue-50  border border-blue-200  text-[10.5px] font-mono font-semibold text-blue-600 "
            >
              위험도 ≥ 85
            </div>
            <div
              style={{ left: 636, top: 255 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 px-2 py-0.5 rounded-full bg-blue-50  border border-blue-200  text-[10.5px] font-mono font-semibold text-blue-600 "
            >
              VIP 이탈 ≥ 70%
            </div>
            <div
              style={{ left: 636, top: 375 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 px-2 py-0.5 rounded-full bg-blue-50  border border-blue-200  text-[10.5px] font-mono font-semibold text-blue-700 "
            >
              정상 &lt; 30 (98.2%)
            </div>

            {/* STAGE 01: 좌측 3개 캡슐형 인입 스트림 노드 */}
            {[
              {
                id: 'src-pg',
                y: 88,
                title: '글로벌 PG 승인 스트림',
                sub: 'kafka://pg.auth.events',
                rate: '4,820/s',
                bars: [55, 78, 64, 92, 85],
              },
              {
                id: 'src-app',
                y: 238,
                title: '앱 행동 텔레메트리 스트림',
                sub: 'kafka://app.wau.telemetry',
                rate: '12,400/s',
                bars: [70, 88, 95, 80, 98],
              },
              {
                id: 'src-erp',
                y: 388,
                title: '원장 출금 & 약정 CDC',
                sub: 'cdc://treasury.ledger',
                rate: '1,940/s',
                bars: [40, 52, 48, 66, 60],
              },
            ].map((src) => {
              const selected = streamSelectedNode === src.id;
              return (
                <div
                  key={src.id}
                  style={{ left: 32, top: src.y, width: 220 }}
                  onClick={() => setStreamSelectedNode(src.id)}
                  className={`absolute rounded-2xl bg-white  border p-3 cursor-pointer transition-all ${
                    selected
                      ? 'border-zinc-900  ring-2 ring-zinc-900/10 shadow-md'
                      : 'border-zinc-200/90  hover:border-zinc-400 shadow-xs'
                  }`}
                >
                  <span className="absolute -right-[4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-klic-inverse " />
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-semibold text-zinc-900  truncate">
                      {src.title}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-blue-600 ">
                      {src.rate}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[10.5px] font-mono text-klic-muted truncate">
                      {src.sub}
                    </span>
                    <div className="flex items-end gap-0.5 h-3">
                      {src.bars.map((h, i) => (
                        <span
                          key={i}
                          style={{ height: `${h}%` }}
                          className="w-1 rounded-xs bg-klic-inverse "
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* STAGE 02: 중앙 원형 듀얼 링 AI 스코어링 허브 노드 */}
            <div
              style={{ left: 412, top: 197, width: 156, height: 156 }}
              onClick={() => setStreamSelectedNode('hub-ai')}
              className={`absolute rounded-full bg-white  border-2 flex flex-col items-center justify-center text-center p-3 cursor-pointer transition-all shadow-md ${
                streamSelectedNode === 'hub-ai'
                  ? 'border-zinc-900  ring-4 ring-zinc-900/10'
                  : 'border-zinc-300 '
              }`}
            >
              <svg
                className="absolute inset-1.5 w-[calc(100%-12px)] h-[calc(100%-12px)] -rotate-90 pointer-events-none"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="var(--klic-component-block-color-border)"
                  strokeWidth="3.5"
                  fill="none"
                  className=""
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="var(--klic-component-block-color-accent)"
                  strokeWidth="3.5"
                  strokeDasharray="240 283"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="px-2 py-0.5 rounded-full bg-klic-inverse  text-klic-on-emphasis  text-[9.5px] font-mono font-bold">
                AI 엔진 v4.2
              </span>
              <div className="mt-1.5 text-[12.5px] font-bold text-zinc-900  leading-tight">
                실시간 이상·이탈
                <br />
                복합 스코어링
              </div>
              <div className="mt-1 text-[10.5px] font-mono text-blue-600  font-semibold">
                {streamBoost ? '57.4k/s · 11ms' : '19.1k/s · 14ms'}
              </div>
            </div>

            {/* STAGE 03: 분기 처리 노드 3종 */}
            <div
              style={{ left: 706, top: 82, width: 214 }}
              onClick={() => setStreamSelectedNode('out-risk')}
              className={`absolute rounded-2xl bg-white  border-[1.75px] border-blue-400  p-3 cursor-pointer transition-all shadow-xs ${
                !showRisk ? 'opacity-40' : ''
              }`}
            >
              <div className="flex items-center justify-between text-[10.5px] font-semibold text-blue-600 ">
                <span>FDS 긴급 차단 분기</span>
                <span className="font-mono">0.4%</span>
              </div>
              <div className="mt-1 text-[12.5px] font-semibold text-zinc-900 ">
                출금 동결 & 2FA 인증 강제
              </div>
              <div className="mt-1 text-[11px] text-klic-muted">
                의심 계좌 락 조치 및 서명 대기
              </div>
            </div>

            <div
              style={{ left: 706, top: 237, width: 214 }}
              onClick={() => setStreamSelectedNode('out-vip')}
              className={`absolute rounded-2xl bg-white  border-[1.75px] border-blue-500  p-3 cursor-pointer transition-all shadow-xs ${
                !showVip ? 'opacity-40' : ''
              }`}
            >
              <div className="flex items-center justify-between text-[10.5px] font-semibold text-blue-600 ">
                <span>VIP 케어 자동화 분기</span>
                <span className="font-mono">1.4%</span>
              </div>
              <div className="mt-1 text-[12.5px] font-semibold text-zinc-900 ">
                전담 CSM 방어 플레이북 발동
              </div>
              <div className="mt-1 text-[11px] text-klic-muted">
                ARR ₩1억+ 고객 긴급 점검 배정
              </div>
            </div>

            <div
              style={{ left: 706, top: 392, width: 214 }}
              onClick={() => setStreamSelectedNode('out-normal')}
              className={`absolute rounded-2xl bg-white  border-[1.75px] border-blue-500  p-3 cursor-pointer transition-all shadow-xs ${
                !showNormal ? 'opacity-40' : ''
              }`}
            >
              <div className="flex items-center justify-between text-[10.5px] font-semibold text-blue-600 ">
                <span>무검증 고속 패스트트랙</span>
                <span className="font-mono">98.2%</span>
              </div>
              <div className="mt-1 text-[12.5px] font-semibold text-zinc-900 ">
                복식부기 원장 무중단 커밋
              </div>
              <div className="mt-1 text-[11px] text-klic-muted">
                SHA-256 해시 체인 즉시 기록
              </div>
            </div>

            {/* STAGE 04: 우측 최종 싱크 타겟 배지 노드 3종 */}
            {[
              {
                y: 94,
                label: '보안관제 워룸 호출',
                sub: 'PagerDuty · #sec-fds',
                color: 'border-blue-300 ',
              },
              {
                y: 249,
                label: '리텐션 CRM 동기화',
                sub: 'PulseGuard · #vip-care',
                color: 'border-blue-300 ',
              },
              {
                y: 404,
                label: '스노우플레이크 마트',
                sub: 'Snowflake · BI 실시간',
                color: 'border-blue-300 ',
              },
            ].map((sink, idx) => (
              <div
                key={idx}
                style={{ left: 976, top: sink.y, width: 146 }}
                className={`absolute rounded-xl bg-white  border ${sink.color} px-3 py-2.5 shadow-2xs`}
              >
                <div className="text-[11.5px] font-semibold text-zinc-900  truncate">
                  {sink.label}
                </div>
                <div className="text-[10.5px] font-mono text-klic-muted truncate mt-0.5">
                  {sink.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 스트림 인스펙터 */}
        <div className="px-5 py-3 border-t border-zinc-200/80  bg-zinc-50/70  flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 text-[12px]">
            <span className="px-2 py-0.5 rounded bg-klic-inverse  text-klic-on-emphasis  font-semibold text-[11px]">
              {activeDetail.name}
            </span>
            <span className="font-mono font-semibold text-blue-600 ">
              {activeDetail.throughput}
            </span>
            <span className="text-klic-muted ">
              — {activeDetail.desc}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 4. CI/CD 빌드 & 배포 자동화 플로우 (KLIC/flow-1)
  // ============================================================================
  const renderCicdPipelineFlow = () => {
    const stages = [
      {
        id: 'cicd-1',
        step: '1단계 · 소스 감지',
        title: '깃 커밋 푸시 트리거',
        subtitle: '정산 배치 최적화 커밋 (#8f4a92c)',
        duration: '2초',
        status: '통과',
        detail: '한소윤 총괄 푸시 · 메인 브랜치 서명 검증 완료',
      },
      {
        id: 'cicd-2',
        step: '2단계 · 품질 검증',
        title: '단위 및 통합 자동 테스트',
        subtitle: '482개 정산 시나리오 병렬 실행',
        duration: '1분 12초',
        status: '통과',
        detail: '다중 통화 환율 연산 및 복식부기 무결성 100% 통과',
      },
      {
        id: 'cicd-3',
        step: '3단계 · 패키징',
        title: '컨테이너 이미지 빌드',
        subtitle: '경량 알파인 멀티 아키텍처 이미지',
        duration: '46초',
        status: '통과',
        detail: '판교 프라이빗 레지스트리 암호화 업로드 완료',
      },
      {
        id: 'cicd-4',
        step: '4단계 · 보안 감사',
        title: '보안 취약점 정밀 스캔',
        subtitle: '의존성 패키지 및 시크릿 노출 검사',
        duration: '28초',
        status: '통과',
        detail: '고위험 취약점 0건 · 금융보안원 규정 준수 확인',
      },
      {
        id: 'cicd-5',
        step: '5단계 · 점진 배포',
        title: `서울 리전 카나리 배포 (${cicdPromoted ? 100 : canaryWeight}%)`,
        subtitle: '실시간 응답 지연 및 에러율 감시',
        duration: cicdPromoted ? '완료됨' : '진행 중',
        status: cicdPromoted ? '통과' : '실행 중',
        detail: `평균 응답 속도 42ms · 에러율 0.00% (${
          cicdPromoted
            ? '전체 트래픽 승격 완료'
            : `현재 ${canaryWeight}% 트래픽 분산 중`
        })`,
      },
    ];

    const activeNode =
      stages.find((s) => s.id === selectedCicdNode) || stages[4];

    return (
      <div className="w-full max-w-[1180px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-zinc-700 " />
            <span className="text-[13.5px] font-semibold text-zinc-900 ">
              CI/CD 빌드 & 카나리 배포 자동화 플로우
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11.5px] text-klic-muted mr-1">
              카나리 가중치:
            </span>
            {[10, 25, 50, 100].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => {
                  setCanaryWeight(w);
                  setCicdPromoted(w === 100);
                }}
                className={`px-2 py-0.5 rounded-lg text-[11.5px] font-mono font-semibold cursor-pointer ${
                  (cicdPromoted ? 100 : canaryWeight) === w
                    ? 'bg-klic-inverse text-klic-on-emphasis  '
                    : 'bg-white  text-klic-muted '
                }`}
              >
                {w}%
              </button>
            ))}
          </div>
        </div>

        <div
          className={`rounded-[14px] bg-white  border border-zinc-200/80  bg-[linear-gradient(to_right,var(--klic-component-block-color-soft)_1px,transparent_1px),linear-gradient(to_bottom,var(--klic-component-block-color-soft)_1px,transparent_1px)]  bg-[size:16px_16px] ${boxPad} space-y-5`}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 relative">
            {stages.map((st, idx) => {
              const selected = st.id === activeNode.id;
              const isRunning = st.status === '실행 중';
              return (
                <div key={st.id} className="relative flex flex-col">
                  <button
                    type="button"
                    onClick={() => setSelectedCicdNode(st.id)}
                    className={`w-full h-full text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                      selected
                        ? 'bg-klic-inverse text-klic-on-emphasis border-zinc-900    shadow-md'
                        : 'bg-white  border-zinc-200/90  hover:border-zinc-400 text-zinc-900  shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span
                          className={`text-[10.5px] font-semibold ${
                            selected
                              ? 'text-klic-muted '
                              : 'text-klic-muted'
                          }`}
                        >
                          {st.step}
                        </span>
                        {isRunning ? (
                          <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        )}
                      </div>
                      <div className="text-[13px] font-semibold leading-snug">
                        {st.title}
                      </div>
                      <p
                        className={`text-[11.5px] mt-1 leading-relaxed ${
                          selected
                            ? 'text-klic-muted '
                            : 'text-klic-muted'
                        }`}
                      >
                        {st.subtitle}
                      </p>
                    </div>

                    <div
                      className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] font-mono ${
                        selected
                          ? 'border-white/15 '
                          : 'border-zinc-100 '
                      }`}
                    >
                      <span>소요</span>
                      <span className="font-semibold">{st.duration}</span>
                    </div>
                  </button>

                  {idx < stages.length - 1 && (
                    <div className="hidden md:flex items-center justify-center absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-white  border border-zinc-300  text-klic-muted  shadow-2xs">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-xl bg-zinc-50  border border-zinc-200/80  p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-klic-inverse  text-klic-on-emphasis  text-[11px] font-semibold">
                  {activeNode.step}
                </span>
                <span className="text-[13px] font-semibold text-zinc-900 ">
                  {activeNode.title}
                </span>
              </div>
              <p className="text-[12px] text-klic-muted">{activeNode.detail}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setCicdPromoted((v) => !v);
                setCanaryWeight(100);
              }}
              className="px-3.5 py-2 rounded-xl bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis text-[12px] font-medium cursor-pointer"
            >
              {cicdPromoted
                ? '✓ 프로덕션 100% 승격 완료'
                : '즉시 프로덕션 100% 승격'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 5. 노코드 웹훅 워크플로우 빌더 (KLIC/flow-2)
  // ============================================================================
  const renderWebhookAutomationFlow = () => {
    const isEnterprise = webhookScenario === 'enterprise';

    return (
      <div className="w-full max-w-[1180px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Webhook className="w-4 h-4 text-zinc-700 " />
            <span className="text-[13.5px] font-semibold text-zinc-900 ">
              노코드 웹훅 워크플로우 조건 분기 빌더
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11.5px] text-klic-muted mr-1">
              유입 시나리오:
            </span>
            <button
              type="button"
              onClick={() => setWebhookScenario('enterprise')}
              className={`px-2.5 py-1 rounded-lg text-[11.5px] font-medium cursor-pointer ${
                isEnterprise
                  ? 'bg-klic-inverse text-klic-on-emphasis  '
                  : 'bg-white  text-klic-muted '
              }`}
            >
              한빛핀테크 고액 결제 실패 (≥ ₩500만)
            </button>
            <button
              type="button"
              onClick={() => setWebhookScenario('standard')}
              className={`px-2.5 py-1 rounded-lg text-[11.5px] font-medium cursor-pointer ${
                !isEnterprise
                  ? 'bg-klic-inverse text-klic-on-emphasis  '
                  : 'bg-white  text-klic-muted '
              }`}
            >
              일반 구독 결제 실패 (&lt; ₩500만)
            </button>
          </div>
        </div>

        <div
          className={`rounded-[14px] bg-white  border border-zinc-200/80  bg-[linear-gradient(to_right,var(--klic-component-block-color-soft)_1px,transparent_1px),linear-gradient(to_bottom,var(--klic-component-block-color-soft)_1px,transparent_1px)]  bg-[size:16px_16px] ${boxPad} space-y-5`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-3">
              <div
                onClick={() => setSelectedWebhookNode('wh-trigger')}
                className={`p-4 rounded-2xl bg-white  border transition-all cursor-pointer ${
                  selectedWebhookNode === 'wh-trigger'
                    ? 'border-zinc-900  shadow-md'
                    : 'border-zinc-200/90 '
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-klic-muted mb-1.5">
                  <span>웹훅 이벤트 수신</span>
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <div className="text-[13.5px] font-semibold text-zinc-900 ">
                  청구서 결제 승인 실패
                </div>
                <p className="text-[11.5px] text-klic-muted mt-1">
                  스트라이프 서명 검증 통과 · 재시도 3회 초과 이벤트
                </p>
              </div>
            </div>

            <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
              <ArrowRight className="w-5 h-5 text-klic-muted" />
            </div>

            <div className="lg:col-span-3">
              <div
                onClick={() => setSelectedWebhookNode('wh-branch')}
                className="p-4 rounded-2xl bg-klic-inverse text-klic-on-emphasis   border border-zinc-900  shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-klic-muted  mb-1.5">
                  <Split className="w-3.5 h-3.5" />
                  <span>조건 분기 (참 / 거짓)</span>
                </div>
                <div className="text-[13.5px] font-semibold">
                  청구 금액 ≥ ₩5,000,000 여부
                </div>
                <p className="text-[11.5px] text-klic-muted  mt-1">
                  현재 평가 결과:{' '}
                  {isEnterprise
                    ? '참 (고액 엔터프라이즈)'
                    : '거짓 (일반 셀프서브)'}
                </p>
              </div>
            </div>

            <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
              <svg className="w-12 h-28" viewBox="0 0 48 112" fill="none">
                <path
                  d="M2 56 C 24 56, 24 22, 46 22"
                  stroke={isEnterprise ? 'var(--klic-component-block-color-accent)' : 'var(--klic-component-block-color-border)'}
                  strokeWidth={isEnterprise ? '2.2' : '1.5'}
                />
                <path
                  d="M2 56 C 24 56, 24 90, 46 90"
                  stroke={!isEnterprise ? 'var(--klic-component-block-color-accent)' : 'var(--klic-component-block-color-border)'}
                  strokeWidth={!isEnterprise ? '2.2' : '1.5'}
                />
              </svg>
            </div>

            <div className="lg:col-span-4 space-y-3">
              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  isEnterprise
                    ? 'bg-white  border-zinc-900  shadow-sm'
                    : 'bg-zinc-50/70  border-zinc-200/70  opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-blue-600">
                    참 (≥ ₩500만) 실행 경로
                  </span>
                  {isEnterprise && (
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      활성 경로
                    </span>
                  )}
                </div>
                <div className="mt-1 text-[13px] font-semibold text-zinc-900 ">
                  슬랙 #엔터프라이즈-긴급경보 발송 & 전담 매니저 배정
                </div>
                <p className="text-[11.5px] text-klic-muted mt-0.5">
                  한빛핀테크 계정 상태를 ‘집중 케어’로 변경하고 담당자에게 즉시 알림
                </p>
              </div>

              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  !isEnterprise
                    ? 'bg-white  border-zinc-900  shadow-sm'
                    : 'bg-zinc-50/70  border-zinc-200/70  opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-klic-muted">
                    거짓 (&lt; ₩500만) 실행 경로
                  </span>
                  {!isEnterprise && (
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      활성 경로
                    </span>
                  )}
                </div>
                <div className="mt-1 text-[13px] font-semibold text-zinc-900 ">
                  카드 수단 갱신 안내 이메일 자동 발송 (3일 후 재시도)
                </div>
                <p className="text-[11.5px] text-klic-muted mt-0.5">
                  셀프서브 결제 수단 변경 링크 발송 및 정산 보류 스케줄 등록
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-2.5 flex items-center justify-between text-[12px]">
          <span className="text-klic-muted">
            최근 24시간 자동화 워크플로우 실행:{' '}
            <strong className="text-zinc-900 ">
              1,420회 성공
            </strong>
          </span>
          <button
            type="button"
            onClick={() => setTestRunDone((v) => !v)}
            className="px-4 py-1.5 rounded-xl bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis text-[12.5px] font-medium cursor-pointer"
          >
            {testRunDone
              ? '✓ 시뮬레이션 페이로드 전송 완료'
              : '워크플로우 테스트 실행'}
          </button>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 6. 데이터 파이프라인 & 계보(Lineage) 플로우 (KLIC/flow-3)
  // ============================================================================
  const renderEtlLineageFlow = () => {
    const lineageNodes = [
      {
        id: 'lin-src',
        layer: '원천 데이터베이스',
        name: '프로덕션 정산 원장 DB',
        metric: '초당 4,820건 변경 감지',
        lag: '지연 0.4초',
        desc: '서울·도쿄 멀티 리전 복식부기 트랜잭션 변경분 실시간 스트림 추출',
      },
      {
        id: 'lin-stream',
        layer: '실시간 수집 파이프라인',
        name: '카프카 이벤트 스트림 버스',
        metric: '시간당 1,720만 건 처리',
        lag: '지연 1.1초',
        desc: '중복 트랜잭션 제거 및 개인정보 비식별화 마스킹 필터 통과',
      },
      {
        id: 'lin-transform',
        layer: '데이터 변환 모델',
        name: '일별 순매출 & 코호트 집계 변환',
        metric: schemaFixed ? '스키마 정합성 100%' : '신규 컬럼 1건 감지',
        lag: '지연 14초',
        desc: '다중 통화 환율 스냅샷 결합 및 고객군별 순매출 유지율(NRR) 테이블 생성',
      },
      {
        id: 'lin-bi',
        layer: '분석 웨어하우스 & 리포트',
        name: '경영진 재무 대시보드 마트',
        metric: '일간 스냅샷 동기화 완료',
        lag: '정시 갱신됨',
        desc: '어드바이저 플레이북 기여도 대시보드 및 3분기 감사 보고서 자동 공급',
      },
    ];

    const activeLin =
      lineageNodes.find((n) => n.id === selectedLineageNode) ||
      lineageNodes[2];

    return (
      <div className="w-full max-w-[1180px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-zinc-700 " />
            <span className="text-[13.5px] font-semibold text-zinc-900 ">
              데이터 파이프라인 & 계보(Lineage) 플로우
            </span>
          </div>
          <span className="text-[11.5px] text-klic-muted">
            원천 정산 원장부터 분석 웨어하우스까지 종단간 데이터 계보 추적
          </span>
        </div>

        <div
          className={`rounded-[14px] bg-white  border border-zinc-200/80  bg-[linear-gradient(to_right,var(--klic-component-block-color-soft)_1px,transparent_1px),linear-gradient(to_bottom,var(--klic-component-block-color-soft)_1px,transparent_1px)]  bg-[size:16px_16px] ${boxPad} space-y-5`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {lineageNodes.map((node) => {
              const active = node.id === activeLin.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedLineageNode(node.id)}
                  className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    active
                      ? 'bg-klic-inverse text-klic-on-emphasis border-zinc-900    shadow-md'
                      : 'bg-white  border-zinc-200/90  hover:border-zinc-400 text-zinc-900 '
                  }`}
                >
                  <div>
                    <div
                      className={`text-[11px] font-semibold ${
                        active
                          ? 'text-klic-muted '
                          : 'text-klic-muted'
                      }`}
                    >
                      {node.layer}
                    </div>
                    <div className="mt-1 text-[13.5px] font-semibold leading-snug">
                      {node.name}
                    </div>
                    <p
                      className={`mt-1.5 text-[11.5px] leading-relaxed ${
                        active
                          ? 'text-klic-muted '
                          : 'text-klic-muted'
                      }`}
                    >
                      {node.desc}
                    </p>
                  </div>

                  <div
                    className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] font-medium ${
                      active
                        ? 'border-white/15 '
                        : 'border-zinc-100 '
                    }`}
                  >
                    <span>{node.metric}</span>
                    <span className="font-mono">{node.lag}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-xl bg-zinc-50  border border-zinc-200/80  p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[13px] font-semibold text-zinc-900 ">
                선택된 계보 노드: {activeLin.name} ({activeLin.layer})
              </div>
              <div className="text-[12px] text-klic-muted mt-0.5">
                하위 의존 리포트 6개 · 스키마 변경 자동 감지 가드레일 작동 중
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSchemaFixed(true)}
              className="px-3.5 py-2 rounded-xl bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis text-[12px] font-medium cursor-pointer"
            >
              {schemaFixed
                ? '✓ 하위 스키마 동기화 완료'
                : '스키마 변경분 즉시 반영'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 7. 마이크로서비스 의존성 토폴로지 맵 (KLIC/flow-4)
  // ============================================================================
  const renderMicroserviceTopologyFlow = () => {
    const services = [
      {
        id: 'svc-gateway',
        name: '글로벌 엣지 API 게이트웨이',
        rps: '14,820 요청/초',
        latency: '18ms',
        health: '정상 가동',
        desc: '인입 트래픽 서명 검증 및 디도스 방어 필터링',
      },
      {
        id: 'svc-auth',
        name: '제로트러스트 통합 인증 서비스',
        rps: '6,410 요청/초',
        latency: '22ms',
        health: '정상 가동',
        desc: '엔터프라이즈 싱글 사인온 토큰 및 권한 스코프 검증',
      },
      {
        id: 'svc-settlement',
        name: '실시간 다중 통화 정산 코어',
        rps: '5,290 요청/초',
        latency: rerouteActive ? '42ms' : '380ms',
        health: rerouteActive ? '예비망 우회 정상' : '응답 지연 주의',
        desc: '외부 결제망 승인 중계 및 서울·도쿄 이중화 라우팅',
      },
      {
        id: 'svc-ledger',
        name: '불변 복식부기 원장 스토리지',
        rps: '9,120 요청/초',
        latency: '9ms',
        health: '정상 가동',
        desc: '암호화 해시 체인 원장 기록 및 실시간 스냅샷 복제',
      },
    ];

    const activeSvc =
      services.find((s) => s.id === selectedTopologySvc) || services[2];

    return (
      <div className="w-full max-w-[1180px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-zinc-700 " />
            <span className="text-[13.5px] font-semibold text-zinc-900 ">
              마이크로서비스 의존성 & 실시간 호출 토폴로지 맵
            </span>
          </div>
          <button
            type="button"
            onClick={() => setRerouteActive((v) => !v)}
            className="px-2.5 py-1 rounded-lg bg-white  border border-zinc-200  text-[11.5px] font-semibold text-zinc-800  cursor-pointer"
          >
            {rerouteActive
              ? '✓ 예비 정산망 우회 가동 중'
              : '지연 장애 시뮬레이션 보기'}
          </button>
        </div>

        <div
          className={`rounded-[14px] bg-white  border border-zinc-200/80  bg-[linear-gradient(to_right,var(--klic-component-block-color-soft)_1px,transparent_1px),linear-gradient(to_bottom,var(--klic-component-block-color-soft)_1px,transparent_1px)]  bg-[size:16px_16px] ${boxPad} space-y-5`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((svc) => {
              const active = svc.id === activeSvc.id;
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => setSelectedTopologySvc(svc.id)}
                  className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    active
                      ? 'bg-klic-inverse text-klic-on-emphasis border-zinc-900    shadow-md'
                      : 'bg-white  border-zinc-200/90  hover:border-zinc-400 text-zinc-900 '
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold mb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>{svc.health}</span>
                    </span>
                    <span className="font-mono">{svc.latency}</span>
                  </div>
                  <div className="text-[13.5px] font-semibold leading-snug">
                    {svc.name}
                  </div>
                  <p
                    className={`text-[11.5px] mt-1 leading-relaxed ${
                      active
                        ? 'text-klic-muted '
                        : 'text-klic-muted'
                    }`}
                  >
                    {svc.desc}
                  </p>
                  <div
                    className={`mt-3 pt-2 border-t text-[11.5px] font-mono font-semibold ${
                      active
                        ? 'border-white/15 '
                        : 'border-zinc-100 '
                    }`}
                  >
                    호출량: {svc.rps}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-xl bg-zinc-50  border border-zinc-200/80  p-4 flex flex-wrap items-center justify-between gap-3 text-[12.5px]">
            <div>
              <span className="font-semibold text-zinc-900 ">
                선택된 서비스 메시 노드: {activeSvc.name}
              </span>
              <span className="text-klic-muted ml-2">
                · 처리량 {activeSvc.rps} · 평균 응답 {activeSvc.latency}
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50  text-blue-700  text-[11.5px] font-semibold">
              상호 TLS 암호화 통신 검증됨
            </span>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 8. 다단계 전자결재 조건 분기 플로우 (KLIC/flow-5)
  // ============================================================================
  const renderApprovalRoutingFlow = () => {
    const isHighAmount = approvalTier === 'over50m';

    return (
      <div className="w-full max-w-[1180px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-zinc-700 " />
            <span className="text-[13.5px] font-semibold text-zinc-900 ">
              다단계 전자결재 조건 분기 라우팅 플로우
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11.5px] text-klic-muted mr-1">
              품의 금액 기준:
            </span>
            <button
              type="button"
              onClick={() => setApprovalTier('over50m')}
              className={`px-2.5 py-1 rounded-lg text-[11.5px] font-medium cursor-pointer ${
                isHighAmount
                  ? 'bg-klic-inverse text-klic-on-emphasis  '
                  : 'bg-white  text-klic-muted '
              }`}
            >
              ₩5,000만 이상 (재무·보안 병렬 + CFO 결재)
            </button>
            <button
              type="button"
              onClick={() => setApprovalTier('under50m')}
              className={`px-2.5 py-1 rounded-lg text-[11.5px] font-medium cursor-pointer ${
                !isHighAmount
                  ? 'bg-klic-inverse text-klic-on-emphasis  '
                  : 'bg-white  text-klic-muted '
              }`}
            >
              ₩5,000만 미만 (본부장 전결 패스트트랙)
            </button>
          </div>
        </div>

        <div
          className={`rounded-[14px] bg-white  border border-zinc-200/80  bg-[linear-gradient(to_right,var(--klic-component-block-color-soft)_1px,transparent_1px),linear-gradient(to_bottom,var(--klic-component-block-color-soft)_1px,transparent_1px)]  bg-[size:16px_16px] ${boxPad} space-y-5`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="p-4 rounded-2xl bg-white  border border-zinc-200/90  space-y-2">
              <div className="text-[11px] font-semibold text-blue-600">
                1단계 · 기안 상신 완료
              </div>
              <div className="text-[13.5px] font-semibold text-zinc-900 ">
                서울·도쿄 예비 GPU 노드 연간 약정 증설 품의
              </div>
              <div className="flex items-center gap-2 pt-1">
                <PersonAvatar
                  src={AVATARS.seoyeon}
                  alt="이서연"
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="text-[11.5px] text-klic-muted ">
                  이서연 리드 상신
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white  border border-zinc-200/90  space-y-2">
              <div className="text-[11px] font-semibold text-blue-600">
                2단계 · 본부장 승인 완료
              </div>
              <div className="text-[13.5px] font-semibold text-zinc-900 ">
                코어 플랫폼 본부 기술 타당성 승인
              </div>
              <div className="flex items-center gap-2 pt-1">
                <PersonAvatar
                  src={AVATARS.sohee}
                  alt="한소윤"
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="text-[11.5px] text-klic-muted ">
                  한소윤 총괄 아키텍트
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-white  border border-zinc-200/90 ">
                <div className="text-[10.5px] font-semibold text-blue-600">
                  3-A · 병렬 예산 합의
                </div>
                <div className="text-[12.5px] font-semibold text-zinc-900  mt-0.5">
                  전략재무본부 예산 배정 확인
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-klic-muted">
                  <PersonAvatar
                    src={AVATARS.yujin}
                    alt="정유진"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>정유진 재무 총괄 승인</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white  border border-zinc-200/90 ">
                <div className="text-[10.5px] font-semibold text-blue-600">
                  3-B · 병렬 보안 합의
                </div>
                <div className="text-[12.5px] font-semibold text-zinc-900  mt-0.5">
                  정보보안팀 망분리 적합성 통과
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-klic-muted">
                  <PersonAvatar
                    src={AVATARS.taewoo}
                    alt="강태우"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>강태우 수석 아키텍트 승인</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-klic-inverse text-klic-on-emphasis   space-y-2.5 shadow-md">
              <div className="text-[11px] font-semibold text-klic-muted ">
                4단계 · {isHighAmount ? '최종 임원 결재' : '패스트트랙 자동 종결'}
              </div>
              <div className="text-[13.5px] font-semibold">
                {cfoApproved || !isHighAmount
                  ? '✓ 전자결재 최종 승인 및 발주 집행 완료'
                  : '최고재무책임자(CFO) 최종 승인 대기 중'}
              </div>
              <button
                type="button"
                onClick={() => setCfoApproved((v) => !v)}
                className="w-full py-2 rounded-xl bg-white text-zinc-900   text-[12px] font-semibold cursor-pointer"
              >
                {cfoApproved ? '승인 완료됨' : '즉시 최종 결재 승인'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white  rounded-2xl border border-zinc-200/80  overflow-hidden">
      {/* 상단 플로우 스타일 전환 바 */}
      <div className="px-5 py-3.5 border-b border-zinc-200/80  bg-zinc-50/60  flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-klic-inverse " />
          <span className="text-[13px] font-semibold text-zinc-900 ">
            KLIC 엔터프라이즈 리액트 플로우 & SVG 흐름도 컬렉션
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'all-showcase', label: '전체 8종 쇼케이스' },
              { id: 'react-flow-lead', label: '형태 1 · 카드형 리드 라우팅' },
              { id: 'react-flow-fds', label: '형태 2 · 아이콘 타일 & 승인 DAG' },
              { id: 'react-flow-vip', label: '형태 3 · 베지어 멀티스트림' },
              { id: 'cicd-pipeline', label: '빌드 & 배포 자동화' },
              { id: 'webhook-automation', label: '웹훅 워크플로우 빌더' },
              { id: 'etl-lineage', label: '데이터 파이프라인 계보' },
              { id: 'microservice-topology', label: '서비스 의존성 토폴로지' },
              { id: 'approval-routing', label: '전자결재 조건 분기' },
            ] as { id: FlowShowcaseMode; label: string }[]
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
              <div className="max-w-[1180px] mx-auto px-1 text-[12px] font-medium text-klic-muted">
                KLIC/react-flow-1 · 형태 1: 수평 카드형 리액트 플로우 & SVG 입자 스트림 (엔터프라이즈 리드 라우팅)
              </div>
              {renderLeadRoutingCardFlow()}
            </section>

            <section className="space-y-2.5">
              <div className="max-w-[1180px] mx-auto px-1 text-[12px] font-medium text-klic-muted">
                KLIC/react-flow-2 · 형태 2: 정사각형 아이콘 타일 + 원형 보조 노드 + 인라인 승인 게이트 SVG DAG (야간 정산 대사)
              </div>
              {renderNightlyPaymentDagFlow()}
            </section>

            <section className="space-y-2.5">
              <div className="max-w-[1180px] mx-auto px-1 text-[12px] font-medium text-klic-muted">
                KLIC/react-flow-3 · 형태 3: 4단 베지어 곡선 스트림 & 원형 링 허브 SVG 흐름도 (실시간 AI 스코어링 & VIP 오케스트레이션)
              </div>
              {renderMultiStreamOrchestrationSvgFlow()}
            </section>

            <section className="space-y-2.5">
              <div className="max-w-[1180px] mx-auto px-1 text-[12px] font-medium text-klic-muted">
                KLIC/flow-1 · CI/CD 빌드 & 배포 자동화 플로우
              </div>
              {renderCicdPipelineFlow()}
            </section>

            <section className="space-y-2.5">
              <div className="max-w-[1180px] mx-auto px-1 text-[12px] font-medium text-klic-muted">
                KLIC/flow-2 · 노코드 웹훅 워크플로우 빌더
              </div>
              {renderWebhookAutomationFlow()}
            </section>

            <section className="space-y-2.5">
              <div className="max-w-[1180px] mx-auto px-1 text-[12px] font-medium text-klic-muted">
                KLIC/flow-3 · 데이터 파이프라인 & 계보(Lineage) 플로우
              </div>
              {renderEtlLineageFlow()}
            </section>

            <section className="space-y-2.5">
              <div className="max-w-[1180px] mx-auto px-1 text-[12px] font-medium text-klic-muted">
                KLIC/flow-4 · 마이크로서비스 의존성 토폴로지 맵
              </div>
              {renderMicroserviceTopologyFlow()}
            </section>

            <section className="space-y-2.5">
              <div className="max-w-[1180px] mx-auto px-1 text-[12px] font-medium text-klic-muted">
                KLIC/flow-5 · 다단계 전자결재 조건 분기 플로우
              </div>
              {renderApprovalRoutingFlow()}
            </section>
          </>
        )}

        {activeMode === 'react-flow-lead' && renderLeadRoutingCardFlow()}
        {activeMode === 'react-flow-fds' && renderNightlyPaymentDagFlow()}
        {activeMode === 'react-flow-vip' &&
          renderMultiStreamOrchestrationSvgFlow()}
        {activeMode === 'cicd-pipeline' && renderCicdPipelineFlow()}
        {activeMode === 'webhook-automation' && renderWebhookAutomationFlow()}
        {activeMode === 'etl-lineage' && renderEtlLineageFlow()}
        {activeMode === 'microservice-topology' &&
          renderMicroserviceTopologyFlow()}
        {activeMode === 'approval-routing' && renderApprovalRoutingFlow()}
      </div>
    </div>
  );
}
