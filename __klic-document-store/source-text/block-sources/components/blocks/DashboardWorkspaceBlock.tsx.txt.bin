import { PersonAvatar } from '../PersonAvatar';
import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Check,
  Upload,
  Plus,
  Trash2,
  FileText,
  FileSpreadsheet,
  Presentation,
  AlertTriangle,
  Sliders,
  Users,
  MessageSquare,
  Layers,
  BookOpen,
  Compass,
  BarChart3,
  CreditCard,
  LayoutGrid,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  RefreshCw,
} from 'lucide-react';

export type DashboardStyleMode =
  | 'knowledge-conflict'
  | 'escalation-triage'
  | 'methodology-rules'
  | 'practice-insights'
  | 'client-deliverables';

interface DashboardWorkspaceBlockProps {
  initialMode?: DashboardStyleMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

interface SourceDocument {
  id: string;
  name: string;
  ext: 'PDF' | 'DOCX' | 'XLSX' | 'PPTX';
  meta: string;
  usedFor: string;
  extractedSummary: string;
  status: 'APPROVED' | 'CONFLICT' | 'NEEDS REVIEW' | 'DUPLICATE';
  conflictDetail?: {
    title: string;
    leftDoc: string;
    leftQuote: string;
    rightDoc: string;
    rightQuote: string;
    resolvedChoice?: '2024' | 'ask' | 'remove2022';
  };
}

const INITIAL_SOURCES: SourceDocument[] = [
  {
    id: 'src-1',
    name: '가격 책정 프레임워크 v3.pdf',
    ext: 'PDF',
    meta: 'PDF · 18페이지',
    usedFor: '가격 책정 권고안',
    extractedSummary: '프레임워크 4개, 권고안 12개',
    status: 'APPROVED',
  },
  {
    id: 'src-2',
    name: '가격 전략 플레이북 2024.docx',
    ext: 'DOCX',
    meta: 'DOCX · 12페이지',
    usedFor: '단가 인상 가이드',
    extractedSummary: '프레임워크 3개, 레퍼런스 6개',
    status: 'CONFLICT',
    conflictDetail: {
      title: '두 문서가 서로 다른 가격 인상 기준을 제시하고 있습니다',
      leftDoc: '가격 전략 플레이북 2024.docx',
      leftQuote: '“초기 활성화율이 40%를 초과한 이후에만 가격 인상을 단행하십시오.”',
      rightDoc: '가격 전략 플레이북 2022.docx',
      rightQuote: '“매 2분기마다 정기적으로 가격 인상 테스트를 실행하십시오.”',
    },
  },
  {
    id: 'src-3',
    name: '클라이언트 온보딩 체크리스트.xlsx',
    ext: 'XLSX',
    meta: 'XLSX · 4시트',
    usedFor: '온보딩 프로세스',
    extractedSummary: '체크리스트 8개 항목',
    status: 'APPROVED',
  },
  {
    id: 'src-4',
    name: '3분기 고객 이탈 방어 분석서.pptx',
    ext: 'PPTX',
    meta: 'PPTX · 26슬라이드',
    usedFor: '이탈 방지 플레이북',
    extractedSummary: '프레임워크 2개, 사례 9개',
    status: 'NEEDS REVIEW',
  },
  {
    id: 'src-5',
    name: '엔터프라이즈 디스커버리 질문집.docx',
    ext: 'DOCX',
    meta: 'DOCX · 9페이지',
    usedFor: '사전 진단 인터뷰',
    extractedSummary: '질문 템플릿 14개',
    status: 'APPROVED',
  },
  {
    id: 'src-6',
    name: '가격 전략 플레이북 2022_구버전.docx',
    ext: 'DOCX',
    meta: 'DOCX · 10페이지',
    usedFor: '단가 인상 가이드',
    extractedSummary: '중복 문서로 분류됨',
    status: 'DUPLICATE',
  },
];

const DASHBOARD_MODES: {
  id: DashboardStyleMode;
  badge: string;
  label: string;
}[] = [
  {
    id: 'knowledge-conflict',
    badge: '01',
    label: '지식 베이스 & 충돌 해결',
  },
  {
    id: 'escalation-triage',
    badge: '02',
    label: '에스컬레이션 & SLA 관제',
  },
  {
    id: 'methodology-rules',
    badge: '03',
    label: '방법론 & 가드레일 규칙',
  },
  {
    id: 'practice-insights',
    badge: '04',
    label: '프랙티스 매출 & 리텐션 통계',
  },
  {
    id: 'client-deliverables',
    badge: '05',
    label: '클라이언트 딜리버리 포털',
  },
];

export const DashboardWorkspaceBlock: React.FC<DashboardWorkspaceBlockProps> = ({
  initialMode = 'knowledge-conflict',
}) => {
  const [activeMode, setActiveMode] = useState<DashboardStyleMode>(initialMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [sources, setSources] = useState<SourceDocument[]>(INITIAL_SOURCES);
  const [sourceTab, setSourceTab] = useState<'ALL' | 'REVIEW' | 'APPROVED' | 'DUPLICATES'>('ALL');
  const [activeWizardStep, setActiveWizardStep] = useState<number>(2);
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>('src-2');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 스타일 2: 에스컬레이션 탭 및 목록 상태
  const [escalationTab, setEscalationTab] = useState<'ALL' | 'CRITICAL' | 'RESOLVED'>('ALL');
  const [escalations, setEscalations] = useState([
    {
      id: 'ESC-409',
      client: '네이버클라우드',
      arr: '₩3.2억',
      advisor: '그로스 전략 어드바이저',
      issue: '연간 갱신 앞두고 시트 35% 감축 요청 (초기 활성화율 28% 정체)',
      ruleTriggered: '가격 전략 플레이북 2024 · 제4조 (활성화율 40% 미만 시 인상 유예)',
      slaRemaining: '14분 남음',
      severity: '긴급',
      status: 'OPEN',
    },
    {
      id: 'ESC-408',
      client: '토스페이먼츠',
      arr: '₩2.4억',
      advisor: '엔터프라이즈 온보딩 어드바이저',
      issue: 'SSO 연동 지연으로 온보딩 체크리스트 3주차 마일스톤 미달',
      ruleTriggered: '클라이언트 온보딩 체크리스트 · 14일 SLA 경보',
      slaRemaining: '42분 남음',
      severity: '높음',
      status: 'OPEN',
    },
    {
      id: 'ESC-405',
      client: '셀트리온 바이오시스템즈',
      arr: '₩4.1억',
      advisor: '이탈 방지 어드바이저',
      issue: '분기 비즈니스 리뷰 전 핵심 담당자 퇴사 감지 — 의사결정자 재지정 필요',
      ruleTriggered: '3분기 고객 이탈 방어 분석서 · 다중 이해관계자 확보 수칙',
      slaRemaining: '2시간 15분',
      severity: '보통',
      status: 'IN_REVIEW',
    },
  ]);

  // 스타일 3: 방법론 & 가드레일 규칙 상태
  const [ruleTab, setRuleTab] = useState<'ACTIVE' | 'DRAFT'>('ACTIVE');
  const [rulesList, setRulesList] = useState([
    {
      id: 'RULE-01',
      name: '활성화율 기반 가격 인상 가드레일',
      condition: '워크스페이스 30일 활성화율 < 40%',
      action: '단가 인상 제안 차단 및 온보딩 플레이북 우선 배정',
      source: '가격 전략 플레이북 2024.docx',
      enabled: true,
      hits: 19,
    },
    {
      id: 'RULE-02',
      name: '엔터프라이즈 할인율 승인 한도',
      condition: '연간 약정 할인율 요청 > 15% 또는 다년 특약',
      action: '총괄 파트너 에스컬레이션 큐로 즉시 라우팅',
      source: '가격 책정 프레임워크 v3.pdf',
      enabled: true,
      hits: 8,
    },
    {
      id: 'RULE-03',
      name: '핵심 담당자 이탈 조기 경보 규칙',
      condition: '의사결정자 14일 연속 미접속 & 지원 티켓 3건 이상',
      action: '72시간 내 긴급 경영진 브리핑 자동 생성',
      source: '3분기 고객 이탈 방어 분석서.pptx',
      enabled: true,
      hits: 31,
    },
    {
      id: 'RULE-04',
      name: '사전 진단 필수 검증 질문 체크',
      condition: '기술 검증 진입 전 기대 수익 정량 지표 미입력 시',
      action: '단계 전환 보류 및 14개 디스커버리 질문지 삽입',
      source: '엔터프라이즈 디스커버리 질문집.docx',
      enabled: false,
      hits: 12,
    },
  ]);
  const [simActivation, setSimActivation] = useState<number>(34);
  const [simDiscount, setSimDiscount] = useState<number>(18);

  // 스타일 4: 인사이트 탭 상태
  const [insightTab, setInsightTab] = useState<'PLAYBOOK' | 'COHORT'>('PLAYBOOK');

  // 스타일 5: 클라이언트 딜리버리 상태
  const [portalTab, setPortalTab] = useState<'ROADMAP' | 'DOCS'>('ROADMAP');
  const [deliverables, setDeliverables] = useState([
    {
      id: 'DEL-1',
      phase: '1단계 · 1~30일',
      title: '초기 온보딩 퍼넬 병목 제거 및 활성화율 40% 돌파',
      sourceDoc: '가격 전략 플레이북 2024.docx',
      owner: '김서연 수석 컨설턴트',
      impact: '활성화율 +14.2% 상승 예상',
      approvedByClient: true,
    },
    {
      id: 'DEL-2',
      phase: '2단계 · 31~60일',
      title: '사용량 기반 하이브리드 티어 요금제 리패키징',
      sourceDoc: '가격 책정 프레임워크 v3.pdf',
      owner: '박지훈 전략 리드',
      impact: '+₩9,200만 확장 매출',
      approvedByClient: true,
    },
    {
      id: 'DEL-3',
      phase: '3단계 · 61~90일',
      title: '엔터프라이즈 보안 감사 및 다년 계약 전환 제안',
      sourceDoc: '3분기 고객 이탈 방어 분석서.pptx',
      owner: '이도현 파트너',
      impact: '순매출 유지율 124% 달성',
      approvedByClient: false,
    },
  ]);

  React.useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleResolveConflict = (docId: string, choice: '2024' | 'ask' | 'remove2022') => {
    setSources((prev) =>
      prev.map((item) => {
        if (item.id !== docId) return item;
        return {
          ...item,
          status: 'APPROVED',
          extractedSummary:
            choice === '2024'
              ? '프레임워크 3개, 레퍼런스 6개 (2024 기준 확정)'
              : choice === 'remove2022'
              ? '프레임워크 3개, 레퍼런스 6개 (2022 구버전 폐기)'
              : '프레임워크 3개, 레퍼런스 6개 (매회 확인 모드)',
          conflictDetail: item.conflictDetail
            ? { ...item.conflictDetail, resolvedChoice: choice }
            : undefined,
        };
      })
    );
    const labelMap = {
      '2024': '가격 전략 플레이북 2024.docx(활성화율 40% 기준)가 공식 가이드로 채택되었습니다.',
      ask: '가격 인상 권고 시 어드바이저에게 매번 확인을 요청하도록 설정했습니다.',
      remove2022: '충돌하던 2022년 구버전 문서가 지식 베이스에서 제거되었습니다.',
    };
    triggerToast(labelMap[choice]);
  };

  const handleApproveReviewDoc = (docId: string) => {
    setSources((prev) =>
      prev.map((item) => (item.id === docId ? { ...item, status: 'APPROVED' } : item))
    );
    triggerToast('문서 검토가 완료되어 승인됨 상태로 전환되었습니다.');
  };

  const handleDeleteSource = (docId: string, name: string) => {
    setSources((prev) => prev.filter((item) => item.id !== docId));
    triggerToast(`${name} 문서가 지식 베이스에서 삭제되었습니다.`);
  };

  const handleAddSimulatedFile = () => {
    const newId = `src-${Date.now()}`;
    const newDoc: SourceDocument = {
      id: newId,
      name: '엔터프라이즈 확장 전략 플레이북 2025.pdf',
      ext: 'PDF',
      meta: 'PDF · 22페이지',
      usedFor: '업셀링 & 확장 전략',
      extractedSummary: '프레임워크 5개, 권고안 11개',
      status: 'APPROVED',
    };
    setSources((prev) => [newDoc, ...prev]);
    triggerToast('엔터프라이즈 확장 전략 플레이북 2025.pdf 파일이 추가되었습니다.');
  };

  const filteredSources = sources.filter((doc) => {
    const matchesSearch =
      !searchQuery.trim() ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.usedFor.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (sourceTab === 'REVIEW') return doc.status === 'CONFLICT' || doc.status === 'NEEDS REVIEW';
    if (sourceTab === 'APPROVED') return doc.status === 'APPROVED';
    if (sourceTab === 'DUPLICATES') return doc.status === 'DUPLICATE';
    return true;
  });

  // 첨부 이미지 스타일의 소프트 스쿼클 문서 아이콘
  const renderFileIcon = (ext: SourceDocument['ext']) => {
    return (
      <div className="w-9 h-9 rounded-xl bg-[var(--klic-component-block-color-soft)] border border-[color:var(--klic-component-block-color-border)] flex flex-col items-center justify-center text-[color:var(--klic-component-block-color-text)] shrink-0">
        <FileText className="w-3.5 h-3.5 stroke-[1.8]" />
        <span className="text-[7px] font-extrabold tracking-tighter leading-none mt-0.5 text-[color:var(--klic-component-block-color-text)]">
          {ext}
        </span>
      </div>
    );
  };

  const conflictCount = sources.filter(
    (s) => s.status === 'CONFLICT' || s.status === 'NEEDS REVIEW'
  ).length;
  const approvedCount = sources.filter((s) => s.status === 'APPROVED').length;
  const duplicateCount = sources.filter((s) => s.status === 'DUPLICATE').length;

  return (
    <div className="w-full space-y-4">
      {/* 상단 5대 대시보드 스타일 스위처 바 */}
      <div className="bg-klic-inverse text-klic-on-emphasis rounded-xl p-2.5 border border-zinc-800 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 px-2">
          <span className="w-2 h-2 rounded-full bg-[var(--klic-component-block-color-warning)]" />
          <span className="text-xs font-semibold tracking-tight text-klic-on-emphasis">
            어드바이저 워크스페이스 대시보드 5종
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {DASHBOARD_MODES.map((m) => {
            const isSelected = activeMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveMode(m.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[var(--klic-component-block-color-warning)] text-klic-on-emphasis shadow-sm'
                    : 'bg-klic-inverse/80 text-klic-muted hover:text-klic-on-emphasis hover:bg-klic-inverse'
                }`}
              >
                <span className="text-[10px] font-mono opacity-75">{m.badge}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 토스트 알림 */}
      {toastMessage && (
        <div className="bg-klic-inverse text-klic-on-emphasis px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between shadow-md border border-[color:var(--klic-component-block-color-text)]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[color:var(--klic-component-block-color-warning)] shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-klic-muted hover:text-klic-on-emphasis text-[11px] ml-4"
          >
            닫기
          </button>
        </div>
      )}

      {/* 메인 웜 스톤 프레임 */}
      <div className="rounded-2xl bg-[var(--klic-component-block-color-soft)] p-2.5 sm:p-4 border border-[color:var(--klic-component-block-color-border)] shadow-inner text-[color:var(--klic-component-block-color-text)] font-sans">
        <div className="rounded-xl bg-[var(--klic-component-block-color-soft)] border border-[color:var(--klic-component-block-color-border)] shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[760px]">
          {/* 좌측 사이드바 (100% 깔끔한 한글 전용) */}
          <aside className="w-full lg:w-[216px] bg-[var(--klic-component-block-color-soft)] border-b lg:border-b-0 lg:border-r border-[color:var(--klic-component-block-color-border)] p-4 flex flex-col justify-between shrink-0">
            <div className="space-y-6">
              {/* 브랜드 로고 */}
              <div className="flex items-center justify-between px-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex items-baseline font-bold tracking-tight text-lg text-[color:var(--klic-component-block-color-text)]">
                    <span>f</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--klic-component-block-color-warning)] mx-0.5 inline-block" />
                    <span className="ml-1 font-bold tracking-tight text-[16px]">KLIC</span>
                  </div>
                </div>
              </div>

              {/* 상단 메인 메뉴 */}
              <nav className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => setActiveMode('practice-insights')}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] transition-colors ${
                    activeMode === 'practice-insights'
                      ? 'bg-[var(--klic-component-block-color-border)] font-semibold text-[color:var(--klic-component-block-color-text)]'
                      : 'text-[color:var(--klic-component-block-color-text)] hover:bg-[var(--klic-component-block-color-border)]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <LayoutGrid className="w-4 h-4 opacity-70" />
                    <span>대시보드</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMode('escalation-triage')}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] transition-colors ${
                    activeMode === 'escalation-triage'
                      ? 'bg-[var(--klic-component-block-color-border)] font-semibold text-[color:var(--klic-component-block-color-text)]'
                      : 'text-[color:var(--klic-component-block-color-text)] hover:bg-[var(--klic-component-block-color-border)]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 opacity-70" />
                    <span>에스컬레이션</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[11px] font-semibold rounded-full bg-[var(--klic-component-block-color-soft)] text-[color:var(--klic-component-block-color-warning)]">
                    {escalations.filter((e) => e.status === 'OPEN').length + 6}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMode('client-deliverables')}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] transition-colors ${
                    activeMode === 'client-deliverables'
                      ? 'bg-[var(--klic-component-block-color-border)] font-semibold text-[color:var(--klic-component-block-color-text)]'
                      : 'text-[color:var(--klic-component-block-color-text)] hover:bg-[var(--klic-component-block-color-border)]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 opacity-70" />
                    <span>클라이언트</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMode('client-deliverables')}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] text-[color:var(--klic-component-block-color-text)] hover:bg-[var(--klic-component-block-color-border)] transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 opacity-70" />
                    <span>대화 내역</span>
                  </span>
                </button>
              </nav>

              {/* 설계 및 구축 섹션 */}
              <div className="space-y-1.5">
                <div className="px-2.5 text-[10px] font-semibold tracking-wider text-[color:var(--klic-component-block-color-muted)]">
                  구축 관리
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveMode('knowledge-conflict')}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[13px] font-semibold text-[color:var(--klic-component-block-color-text)]"
                  >
                    <span className="flex items-center gap-2.5">
                      <Compass className="w-4 h-4 text-[color:var(--klic-component-block-color-text)]" />
                      <span>어드바이저</span>
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[color:var(--klic-component-block-color-muted)]" />
                  </button>

                  {/* 트리 서브메뉴 */}
                  <div className="ml-4 pl-3 border-l border-[color:var(--klic-component-block-color-border)] mt-1 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMode('knowledge-conflict');
                        setActiveWizardStep(1);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-md text-[12.5px] text-[color:var(--klic-component-block-color-muted)] hover:text-[color:var(--klic-component-block-color-text)] hover:bg-[var(--klic-component-block-color-border)] transition-colors"
                    >
                      기본 개요
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMode('knowledge-conflict');
                        setActiveWizardStep(2);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-[12.5px] transition-colors ${
                        activeMode === 'knowledge-conflict'
                          ? 'bg-[var(--klic-component-block-color-border)] font-semibold text-[color:var(--klic-component-block-color-text)]'
                          : 'text-[color:var(--klic-component-block-color-muted)] hover:text-[color:var(--klic-component-block-color-text)] hover:bg-[var(--klic-component-block-color-border)]'
                      }`}
                    >
                      지식 베이스
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMode('methodology-rules')}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-[12.5px] transition-colors ${
                        activeMode === 'methodology-rules'
                          ? 'bg-[var(--klic-component-block-color-border)] font-semibold text-[color:var(--klic-component-block-color-text)]'
                          : 'text-[color:var(--klic-component-block-color-muted)] hover:text-[color:var(--klic-component-block-color-text)] hover:bg-[var(--klic-component-block-color-border)]'
                      }`}
                    >
                      방법론
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMode('methodology-rules')}
                      className="w-full text-left px-2.5 py-1.5 rounded-md text-[12.5px] text-[color:var(--klic-component-block-color-muted)] hover:text-[color:var(--klic-component-block-color-text)] hover:bg-[var(--klic-component-block-color-border)] transition-colors"
                    >
                      운영 규칙
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMode('practice-insights')}
                      className="w-full text-left px-2.5 py-1.5 rounded-md text-[12.5px] text-[color:var(--klic-component-block-color-muted)] hover:text-[color:var(--klic-component-block-color-text)] hover:bg-[var(--klic-component-block-color-border)] transition-colors"
                    >
                      인사이트
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveMode('knowledge-conflict')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] text-[color:var(--klic-component-block-color-text)] hover:bg-[var(--klic-component-block-color-border)] transition-colors"
                >
                  <BookOpen className="w-4 h-4 opacity-70" />
                  <span>지식 라이브러리</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('methodology-rules')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] text-[color:var(--klic-component-block-color-text)] hover:bg-[var(--klic-component-block-color-border)] transition-colors"
                >
                  <Layers className="w-4 h-4 opacity-70" />
                  <span>프레임워크</span>
                </button>
              </div>

              {/* 프랙티스 운영 섹션 */}
              <div className="space-y-1">
                <div className="px-2.5 text-[10px] font-semibold tracking-wider text-[color:var(--klic-component-block-color-muted)]">
                  프랙티스 운영
                </div>
                <button
                  type="button"
                  onClick={() => setActiveMode('practice-insights')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] text-[color:var(--klic-component-block-color-text)] hover:bg-[var(--klic-component-block-color-border)] transition-colors"
                >
                  <BarChart3 className="w-4 h-4 opacity-70" />
                  <span>성과 분석</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('practice-insights')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] text-[color:var(--klic-component-block-color-text)] hover:bg-[var(--klic-component-block-color-border)] transition-colors"
                >
                  <CreditCard className="w-4 h-4 opacity-70" />
                  <span>청구 및 정산</span>
                </button>
              </div>
            </div>

            {/* 하단 활성 어드바이저 상태 미니 카드 */}
            <div className="mt-6 pt-4 border-t border-[color:var(--klic-component-block-color-border)]">
              <div className="bg-white/80 rounded-xl p-3 border border-[color:var(--klic-component-block-color-border)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[color:var(--klic-component-block-color-text)]">
                    그로스 전략 어드바이저
                  </span>
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                </div>
                <p className="text-[11px] text-[color:var(--klic-component-block-color-muted)]">
                  문서 {sources.length}개 동기화 · 검토 필요 {conflictCount}건
                </p>
              </div>
            </div>
          </aside>

          {/* 우측 메인 워크스페이스 영역 */}
          <div className="flex-1 flex flex-col min-w-0 bg-[var(--klic-component-block-color-soft)]">
            {/* 상단 글로벌 검색 & 알림 헤더 */}
            <header className="h-14 px-6 border-b border-[color:var(--klic-component-block-color-border)] flex items-center justify-between gap-4 bg-[var(--klic-component-block-color-soft)]">
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 text-[color:var(--klic-component-block-color-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="클라이언트, 어드바이저, 대화 내역 검색"
                  className="w-full pl-9 pr-12 py-1.5 rounded-lg bg-[var(--klic-component-block-color-border)] border border-transparent focus:border-[color:var(--klic-component-block-color-border)] focus:bg-white text-xs text-[color:var(--klic-component-block-color-text)] placeholder:text-[color:var(--klic-component-block-color-muted)] outline-none transition-all"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[color:var(--klic-component-block-color-muted)] bg-[var(--klic-component-block-color-border)] px-1.5 py-0.5 rounded">
                  ⌘K
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    triggerToast('새로운 플레이북 충돌 알림 1건과 에스컬레이션 2건이 있습니다.')
                  }
                  className="relative p-2 rounded-lg hover:bg-[var(--klic-component-block-color-border)] text-[color:var(--klic-component-block-color-text)] transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-[var(--klic-component-block-color-warning)] absolute top-1.5 right-1.5 border border-[color:var(--klic-component-block-color-soft)]" />
                </button>
                <div className="flex items-center gap-2 pl-2 border-l border-[color:var(--klic-component-block-color-border)]">
                  <PersonAvatar
                    src="./placeholders/avatar-576a55580552.svg"
                    alt="한소윤"
                    className="w-7 h-7 rounded-full object-cover border border-[color:var(--klic-component-block-color-border)]"
                  />
                </div>
              </div>
            </header>

            {/* ==================== STYLE 1: 지식 베이스 & 문서 충돌 해결 대시보드 ==================== */}
            {activeMode === 'knowledge-conflict' && (
              <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                {/* 브레드크럼 & 페이지 타이틀 & 우측 액션 버튼 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[color:var(--klic-component-block-color-muted)] mb-1">
                      <span>어드바이저</span>
                      <ChevronRight className="w-3 h-3" />
                      <span>그로스 전략 어드바이저</span>
                      <ChevronRight className="w-3 h-3" />
                      <span className="text-[color:var(--klic-component-block-color-text)] font-medium">지식 베이스</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-[color:var(--klic-component-block-color-text)]">
                      지식 베이스
                    </h1>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setActiveWizardStep((prev) => Math.max(1, prev - 1))}
                      className="px-3.5 py-2 rounded-lg bg-white border border-[color:var(--klic-component-block-color-border)] hover:bg-[var(--klic-component-block-color-soft)] text-xs font-medium text-[color:var(--klic-component-block-color-text)] flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>이전</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMode('methodology-rules')}
                      className="px-4 py-2 rounded-lg bg-[var(--klic-component-block-color-warning)] hover:bg-[var(--klic-component-block-color-warning)] text-klic-on-emphasis text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <span>방법론 단계로 계속</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 5단계 가로 프로그레스 스테퍼 바 */}
                <div className="bg-white rounded-xl border border-[color:var(--klic-component-block-color-border)] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                  {[
                    { step: 1, label: '기본 정보 및 범위' },
                    { step: 2, label: '지식 베이스' },
                    { step: 3, label: '방법론 설계' },
                    { step: 4, label: '운영 규칙' },
                    { step: 5, label: '클라이언트 초대' },
                  ].map((item, idx) => {
                    const isCompleted = item.step < activeWizardStep;
                    const isCurrent = item.step === activeWizardStep;
                    return (
                      <React.Fragment key={item.step}>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveWizardStep(item.step);
                            if (item.step === 3 || item.step === 4) {
                              setActiveMode('methodology-rules');
                            } else if (item.step === 5) {
                              setActiveMode('client-deliverables');
                            }
                          }}
                          className="flex items-center gap-2.5 text-left"
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                              isCompleted
                                ? 'bg-klic-inverse text-klic-on-emphasis'
                                : isCurrent
                                ? 'bg-[var(--klic-component-block-color-warning)] text-klic-on-emphasis'
                                : 'bg-[var(--klic-component-block-color-soft)] text-[color:var(--klic-component-block-color-muted)]'
                            }`}
                          >
                            {isCompleted ? <Check className="w-3.5 h-3.5" /> : item.step}
                          </div>
                          <span
                            className={`text-xs ${
                              isCurrent
                                ? 'font-bold text-[color:var(--klic-component-block-color-text)]'
                                : isCompleted
                                ? 'font-medium text-[color:var(--klic-component-block-color-text)]'
                                : 'font-medium text-[color:var(--klic-component-block-color-muted)]'
                            }`}
                          >
                            {item.label}
                          </span>
                        </button>
                        {idx < 4 && (
                          <div className="hidden md:block flex-1 h-px bg-[var(--klic-component-block-color-border)] min-w-[24px]" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* 상단 2열 요약 섹션: 좌측 파일 드롭존 + 우측 추출 자산 4열 메트릭 */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* 좌측 드래그 앤 드롭 업로드 카드 */}
                  <div className="lg:col-span-4 bg-[var(--klic-component-block-color-soft)] rounded-xl border-2 border-dashed border-[color:var(--klic-component-block-color-border)] p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[var(--klic-component-block-color-soft)] flex items-center justify-center text-[color:var(--klic-component-block-color-text)] shrink-0">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[color:var(--klic-component-block-color-text)] truncate">
                          파일을 드롭하거나 찾아보기
                        </div>
                        <div className="text-[11px] text-[color:var(--klic-component-block-color-muted)] truncate mt-0.5">
                          PDF, DOCX, PPTX, XLSX · 최대 50MB
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSimulatedFile}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[color:var(--klic-component-block-color-border)] hover:bg-[var(--klic-component-block-color-soft)] text-xs font-semibold text-[color:var(--klic-component-block-color-text)] flex items-center gap-1 shrink-0 shadow-2xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>파일 추가</span>
                    </button>
                  </div>

                  {/* 우측 24개 파일 추출 결과 4열 메트릭 카드 */}
                  <div className="lg:col-span-8 bg-white rounded-xl border border-[color:var(--klic-component-block-color-border)] p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-[color:var(--klic-component-block-color-text)]">
                        별도 집계 예시 · 24개 문서에서 자동 구조화된 지식 자산
                      </span>
                      <span className="text-[11px] text-[color:var(--klic-component-block-color-muted)]">2분 전 처리 완료</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--klic-component-block-color-soft)]">
                      <div className="pr-4 py-1">
                        <div className="text-2xl font-bold text-[color:var(--klic-component-block-color-text)] tracking-tight">12</div>
                        <div className="text-[11px] text-[color:var(--klic-component-block-color-muted)] mt-0.5">프레임워크</div>
                      </div>
                      <div className="sm:px-4 py-1">
                        <div className="text-2xl font-bold text-[color:var(--klic-component-block-color-text)] tracking-tight">8</div>
                        <div className="text-[11px] text-[color:var(--klic-component-block-color-muted)] mt-0.5">재사용 권고안</div>
                      </div>
                      <div className="sm:px-4 py-1">
                        <div className="text-2xl font-bold text-[color:var(--klic-component-block-color-text)] tracking-tight">34</div>
                        <div className="text-[11px] text-[color:var(--klic-component-block-color-muted)] mt-0.5">레퍼런스 사례</div>
                      </div>
                      <div className="sm:pl-4 py-1">
                        <div className="text-2xl font-bold text-[color:var(--klic-component-block-color-muted)] tracking-tight">6</div>
                        <div className="text-[11px] text-[color:var(--klic-component-block-color-muted)] mt-0.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--klic-component-block-color-warning)]" />
                          <span>집계 예시의 중복 제외 문서</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 첨부 스크린샷(image_c56b73f8.png)과 동일한 폴더형 연결 탭 + 본문 테이블 */}
                <div>
                  {/* 상단 폴더형 탭 바: 활성 탭은 흰색 둥근 상단 배경으로 아래 카드와 일체형 연결 */}
                  <div className="flex items-end gap-1 overflow-x-auto">
                    {[
                      { id: 'ALL', label: '전체 소스', count: sources.length },
                      { id: 'REVIEW', label: '검토 필요', count: conflictCount },
                      { id: 'APPROVED', label: '승인됨', count: approvedCount },
                      { id: 'DUPLICATES', label: '중복 문서', count: duplicateCount },
                    ].map((tab) => {
                      const active = sourceTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setSourceTab(tab.id as typeof sourceTab)}
                          className={`px-5 py-3 text-[13px] transition-all flex items-center gap-2 whitespace-nowrap ${
                            active
                              ? 'bg-white rounded-t-2xl font-bold text-[color:var(--klic-component-block-color-text)] relative z-10'
                              : 'bg-transparent font-medium text-[color:var(--klic-component-block-color-text)] hover:text-[color:var(--klic-component-block-color-text)]'
                          }`}
                        >
                          <span>{tab.label}</span>
                          <span
                            className={`text-xs ${
                              active
                                ? 'font-bold text-[color:var(--klic-component-block-color-warning)]'
                                : 'font-medium text-[color:var(--klic-component-block-color-muted)]'
                            }`}
                          >
                            {tab.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* 탭 아래 본문 흰색 테이블 카드 */}
                  <div
                    className={`bg-white rounded-b-2xl rounded-tr-2xl ${
                      sourceTab !== 'ALL' ? 'rounded-tl-2xl' : ''
                    } shadow-2xs overflow-hidden`}
                  >
                    {/* 컬럼 헤더 */}
                    <div className="grid grid-cols-12 px-6 py-3.5 border-b border-[color:var(--klic-component-block-color-soft)] text-[11px] font-semibold tracking-wider text-[color:var(--klic-component-block-color-muted)]">
                      <div className="col-span-4">원본 문서</div>
                      <div className="col-span-3">활용 영역</div>
                      <div className="col-span-2">추출 결과</div>
                      <div className="col-span-2">상태</div>
                      <div className="col-span-1 text-right">관리</div>
                    </div>

                    {/* 행 목록 + 인라인 충돌 해결 카드 */}
                    <div className="divide-y divide-[var(--klic-component-block-color-soft)]">
                      {filteredSources.map((doc) => {
                        const isConflict = doc.status === 'CONFLICT';
                        const isNeedsReview = doc.status === 'NEEDS REVIEW';
                        const showConflictBox =
                          doc.conflictDetail &&
                          (isConflict || expandedReviewId === doc.id) &&
                          !doc.conflictDetail.resolvedChoice;

                        return (
                          <div key={doc.id} className={isConflict ? 'bg-[var(--klic-component-block-color-panel)]' : 'bg-white'}>
                            <div className="grid grid-cols-12 items-center px-6 py-4 gap-2 hover:bg-[var(--klic-component-block-color-soft)] transition-colors">
                              {/* 원본 문서 */}
                              <div className="col-span-12 sm:col-span-4 flex items-center gap-3.5 min-w-0">
                                {renderFileIcon(doc.ext)}
                                <div className="min-w-0">
                                  <div className="text-[13px] font-semibold text-[color:var(--klic-component-block-color-text)] truncate">
                                    {doc.name}
                                  </div>
                                  <div className="text-xs text-[color:var(--klic-component-block-color-muted)] mt-0.5">{doc.meta}</div>
                                </div>
                              </div>

                              {/* 활용 영역 */}
                              <div className="col-span-6 sm:col-span-3">
                                <span className="text-[13px] text-[color:var(--klic-component-block-color-text)]">{doc.usedFor}</span>
                              </div>

                              {/* 추출 결과 */}
                              <div className="col-span-6 sm:col-span-2">
                                <span className="text-[13px] text-[color:var(--klic-component-block-color-text)]">
                                  {doc.extractedSummary}
                                </span>
                              </div>

                              {/* 상태 배지 */}
                              <div className="col-span-6 sm:col-span-2">
                                {doc.status === 'APPROVED' && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--klic-component-block-color-soft)] text-[color:var(--klic-component-block-color-accent)]">
                                    승인됨
                                  </span>
                                )}
                                {doc.status === 'CONFLICT' && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--klic-component-block-color-soft)] text-[color:var(--klic-component-block-color-warning)]">
                                    충돌 감지
                                  </span>
                                )}
                                {doc.status === 'NEEDS REVIEW' && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--klic-component-block-color-border)] text-[color:var(--klic-component-block-color-warning)]">
                                    검토 필요
                                  </span>
                                )}
                                {doc.status === 'DUPLICATE' && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--klic-component-block-color-soft)] text-[color:var(--klic-component-block-color-muted)]">
                                    중복 제외
                                  </span>
                                )}
                              </div>

                              {/* 관리 액션 */}
                              <div className="col-span-6 sm:col-span-1 flex items-center justify-end gap-2">
                                {isConflict && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setExpandedReviewId((prev) =>
                                        prev === doc.id ? null : doc.id
                                      )
                                    }
                                    className="px-2.5 py-1 rounded-md border border-[color:var(--klic-component-block-color-border)] bg-white hover:bg-[var(--klic-component-block-color-soft)] text-xs font-semibold text-[color:var(--klic-component-block-color-text)]"
                                  >
                                    검토
                                  </button>
                                )}
                                {isNeedsReview && (
                                  <button
                                    type="button"
                                    onClick={() => handleApproveReviewDoc(doc.id)}
                                    className="px-2.5 py-1 rounded-md border border-[color:var(--klic-component-block-color-border)] bg-white hover:bg-[var(--klic-component-block-color-soft)] text-xs font-semibold text-[color:var(--klic-component-block-color-text)]"
                                  >
                                    검토
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSource(doc.id, doc.name)}
                                  className="p-1.5 rounded-md text-[color:var(--klic-component-block-color-muted)] hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                  title="문서 삭제"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* 인라인 충돌 비교 및 해결 박스 */}
                            {showConflictBox && doc.conflictDetail && (
                              <div className="mx-6 mb-4 p-4 rounded-xl bg-[var(--klic-component-block-color-panel)] border border-[color:var(--klic-component-block-color-warning-surface)] space-y-3.5 shadow-2xs">
                                <div className="flex items-center justify-between">
                                  <div className="text-xs font-bold text-[color:var(--klic-component-block-color-text)] flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[var(--klic-component-block-color-warning)]" />
                                    <span>{doc.conflictDetail.title}</span>
                                  </div>
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--klic-component-block-color-soft)] text-[color:var(--klic-component-block-color-warning)]">
                                    충돌
                                  </span>
                                </div>

                                {/* 좌우 비교 카드 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="bg-white rounded-lg p-3.5 border border-[color:var(--klic-component-block-color-border)] space-y-1.5">
                                    <div className="text-[11px] font-semibold text-[color:var(--klic-component-block-color-muted)]">
                                      {doc.conflictDetail.leftDoc}
                                    </div>
                                    <div className="text-xs font-medium text-[color:var(--klic-component-block-color-text)] leading-relaxed">
                                      {doc.conflictDetail.leftQuote}
                                    </div>
                                  </div>

                                  <div className="bg-white rounded-lg p-3.5 border border-[color:var(--klic-component-block-color-border)] space-y-1.5">
                                    <div className="text-[11px] font-semibold text-[color:var(--klic-component-block-color-muted)]">
                                      {doc.conflictDetail.rightDoc}
                                    </div>
                                    <div className="text-xs font-medium text-[color:var(--klic-component-block-color-text)] leading-relaxed">
                                      {doc.conflictDetail.rightQuote}
                                    </div>
                                  </div>
                                </div>

                                {/* 충돌 해결 액션 버튼 3종 */}
                                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleResolveConflict(doc.id, '2024')}
                                    className="px-3.5 py-1.5 rounded-lg bg-[var(--klic-component-block-color-soft)] hover:bg-[var(--klic-component-block-color-border)] text-[color:var(--klic-component-block-color-danger)] text-xs font-semibold transition-colors"
                                  >
                                    2024 버전 채택
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleResolveConflict(doc.id, 'ask')}
                                    className="px-3.5 py-1.5 rounded-lg bg-white border border-[color:var(--klic-component-block-color-border)] hover:bg-[var(--klic-component-block-color-soft)] text-[color:var(--klic-component-block-color-text)] text-xs font-semibold transition-colors"
                                  >
                                    매번 직접 확인
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleResolveConflict(doc.id, 'remove2022')}
                                    className="px-2.5 py-1.5 text-xs font-medium text-[color:var(--klic-component-block-color-muted)] hover:text-[color:var(--klic-component-block-color-text)] transition-colors"
                                  >
                                    2022 버전 제거
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== STYLE 2: 에스컬레이션 & 클라이언트 헬스 관제 대시보드 ==================== */}
            {activeMode === 'escalation-triage' && (
              <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[color:var(--klic-component-block-color-muted)] mb-1">
                      <span>워크스페이스</span>
                      <ChevronRight className="w-3 h-3" />
                      <span className="text-[color:var(--klic-component-block-color-text)] font-medium">에스컬레이션 관제</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-[color:var(--klic-component-block-color-text)]">
                      클라이언트 에스컬레이션 & SLA 위기 관제
                    </h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        triggerToast('전체 에스컬레이션 큐의 SLA 타이머를 동기화했습니다.')
                      }
                      className="px-3.5 py-2 rounded-lg bg-white border border-[color:var(--klic-component-block-color-border)] hover:bg-[var(--klic-component-block-color-soft)] text-xs font-medium text-[color:var(--klic-component-block-color-text)] flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>큐 새로고침</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMode('knowledge-conflict')}
                      className="px-4 py-2 rounded-lg bg-[var(--klic-component-block-color-warning)] hover:bg-[var(--klic-component-block-color-warning)] text-klic-on-emphasis text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>플레이북 충돌 규칙 점검</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 4열 핵심 위험 지표 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {[
                    {
                      label: '미결 에스컬레이션',
                      value: '8건',
                      delta: '긴급 SLA 2건 임박',
                      tone: 'text-[color:var(--klic-component-block-color-warning)]',
                    },
                    {
                      label: '위험 노출 계약액',
                      value: '₩19.2억',
                      delta: '전체 포트폴리오의 11.4%',
                      tone: 'text-[color:var(--klic-component-block-color-text)]',
                    },
                    {
                      label: '평균 파트너 개입 시간',
                      value: '18분',
                      delta: '목표 30분 대비 12분 단축',
                      tone: 'text-[color:var(--klic-component-block-color-accent)]',
                    },
                    {
                      label: '분기 이탈 방어율',
                      value: '94.2%',
                      delta: '전분기 대비 +3.8%p 상승',
                      tone: 'text-[color:var(--klic-component-block-color-text)]',
                    },
                  ].map((kpi, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl border border-[color:var(--klic-component-block-color-border)] p-4 space-y-1.5 shadow-2xs"
                    >
                      <div className="text-[11px] font-medium text-[color:var(--klic-component-block-color-muted)]">{kpi.label}</div>
                      <div className={`text-2xl font-bold tracking-tight ${kpi.tone}`}>
                        {kpi.value}
                      </div>
                      <div className="text-[11px] text-[color:var(--klic-component-block-color-muted)]">{kpi.delta}</div>
                    </div>
                  ))}
                </div>

                {/* 폴더형 탭 + 에스컬레이션 상세 카드 리스트 */}
                <div>
                  <div className="flex items-end gap-1">
                    {[
                      { id: 'ALL', label: '전체 큐', count: 8 },
                      { id: 'CRITICAL', label: '긴급 대응', count: 2 },
                      { id: 'RESOLVED', label: '승인 완료', count: 14 },
                    ].map((tab) => {
                      const active = escalationTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setEscalationTab(tab.id as typeof escalationTab)}
                          className={`px-5 py-3 text-[13px] transition-all flex items-center gap-2 ${
                            active
                              ? 'bg-white rounded-t-2xl font-bold text-[color:var(--klic-component-block-color-text)]'
                              : 'bg-transparent font-medium text-[color:var(--klic-component-block-color-text)] hover:text-[color:var(--klic-component-block-color-text)]'
                          }`}
                        >
                          <span>{tab.label}</span>
                          <span
                            className={`text-xs ${
                              active ? 'font-bold text-[color:var(--klic-component-block-color-warning)]' : 'font-medium text-[color:var(--klic-component-block-color-muted)]'
                            }`}
                          >
                            {tab.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div
                    className={`bg-white rounded-b-2xl rounded-tr-2xl ${
                      escalationTab !== 'ALL' ? 'rounded-tl-2xl' : ''
                    } shadow-2xs overflow-hidden divide-y divide-[var(--klic-component-block-color-soft)]`}
                  >
                    {escalations.map((esc) => (
                      <div
                        key={esc.id}
                        className="p-5 space-y-3 hover:bg-[var(--klic-component-block-color-soft)] transition-colors"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs font-bold text-[color:var(--klic-component-block-color-warning)] bg-[var(--klic-component-block-color-soft)] px-2 py-0.5 rounded">
                              {esc.id}
                            </span>
                            <span className="text-sm font-bold text-[color:var(--klic-component-block-color-text)]">{esc.client}</span>
                            <span className="text-xs font-semibold text-[color:var(--klic-component-block-color-text)] bg-[var(--klic-component-block-color-soft)] px-2 py-0.5 rounded">
                              연간 계약 {esc.arr}
                            </span>
                            <span className="text-xs text-[color:var(--klic-component-block-color-muted)]">· {esc.advisor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[color:var(--klic-component-block-color-warning)] bg-[var(--klic-component-block-color-border)] px-2.5 py-0.5 rounded-full">
                              <Clock className="w-3 h-3" />
                              {esc.slaRemaining}
                            </span>
                            {esc.status === 'RESOLVED' ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--klic-component-block-color-soft)] text-[color:var(--klic-component-block-color-accent)]">
                                조치 완료
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--klic-component-block-color-soft)] text-[color:var(--klic-component-block-color-warning)]">
                                {esc.severity}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-[color:var(--klic-component-block-color-text)] font-medium">{esc.issue}</p>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[color:var(--klic-component-block-color-soft)]">
                          <div className="text-[11px] text-[color:var(--klic-component-block-color-muted)] flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[color:var(--klic-component-block-color-warning)]" />
                            <span>근거 문서:</span>
                            <span className="font-semibold text-[color:var(--klic-component-block-color-text)]">{esc.ruleTriggered}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEscalations((prev) =>
                                  prev.map((item) =>
                                    item.id === esc.id ? { ...item, status: 'RESOLVED' } : item
                                  )
                                );
                                triggerToast(
                                  `${esc.client} 에스컬레이션에 대해 예외 승인 조치가 완료되었습니다.`
                                );
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[var(--klic-component-block-color-warning)] hover:bg-[var(--klic-component-block-color-warning)] text-klic-on-emphasis text-xs font-semibold transition-colors"
                            >
                              예외 승인 및 방어 플랜 발송
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                triggerToast(`${esc.client} 담당 파트너에게 브리핑 노트를 전송했습니다.`)
                              }
                              className="px-3 py-1.5 rounded-lg bg-white border border-[color:var(--klic-component-block-color-border)] hover:bg-[var(--klic-component-block-color-soft)] text-xs font-semibold text-[color:var(--klic-component-block-color-text)]"
                            >
                              담당자 재배정
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== STYLE 3: 어드바이저 방법론 & 규칙 파이프라인 대시보드 ==================== */}
            {activeMode === 'methodology-rules' && (
              <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[color:var(--klic-component-block-color-muted)] mb-1">
                      <span>어드바이저</span>
                      <ChevronRight className="w-3 h-3" />
                      <span>그로스 전략 어드바이저</span>
                      <ChevronRight className="w-3 h-3" />
                      <span className="text-[color:var(--klic-component-block-color-text)] font-medium">방법론 및 규칙</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-[color:var(--klic-component-block-color-text)]">
                      방법론 단계 & 가드레일 규칙 설계
                    </h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveMode('knowledge-conflict')}
                      className="px-3.5 py-2 rounded-lg bg-white border border-[color:var(--klic-component-block-color-border)] hover:bg-[var(--klic-component-block-color-soft)] text-xs font-medium text-[color:var(--klic-component-block-color-text)] flex items-center gap-1.5"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>지식 베이스로 이동</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMode('client-deliverables')}
                      className="px-4 py-2 rounded-lg bg-[var(--klic-component-block-color-warning)] hover:bg-[var(--klic-component-block-color-warning)] text-klic-on-emphasis text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>클라이언트 포털 배포</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 상단 좌우 분할: 폴더형 탭 가드레일 규칙 매트릭스 + 실시간 정책 시뮬레이터 */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  <div className="lg:col-span-8">
                    <div className="flex items-end gap-1">
                      {[
                        {
                          id: 'ACTIVE',
                          label: '활성 가드레일 규칙',
                          count: rulesList.filter((r) => r.enabled).length,
                        },
                        { id: 'DRAFT', label: '보류 및 초안', count: 1 },
                      ].map((tab) => {
                        const active = ruleTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setRuleTab(tab.id as typeof ruleTab)}
                            className={`px-5 py-3 text-[13px] transition-all flex items-center gap-2 ${
                              active
                                ? 'bg-white rounded-t-2xl font-bold text-[color:var(--klic-component-block-color-text)]'
                                : 'bg-transparent font-medium text-[color:var(--klic-component-block-color-text)] hover:text-[color:var(--klic-component-block-color-text)]'
                            }`}
                          >
                            <span>{tab.label}</span>
                            <span
                              className={`text-xs ${
                                active ? 'font-bold text-[color:var(--klic-component-block-color-warning)]' : 'font-medium text-[color:var(--klic-component-block-color-muted)]'
                              }`}
                            >
                              {tab.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div
                      className={`bg-white rounded-b-2xl rounded-tr-2xl ${
                        ruleTab !== 'ACTIVE' ? 'rounded-tl-2xl' : ''
                      } shadow-2xs overflow-hidden divide-y divide-[var(--klic-component-block-color-soft)]`}
                    >
                      {rulesList.map((rule) => (
                        <div key={rule.id} className="p-5 flex items-start justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--klic-component-block-color-soft)] text-[color:var(--klic-component-block-color-text)]">
                                {rule.id}
                              </span>
                              <span className="text-xs font-bold text-[color:var(--klic-component-block-color-text)]">{rule.name}</span>
                              <span className="text-[11px] text-[color:var(--klic-component-block-color-muted)]">
                                · 최근 30일 {rule.hits}회 작동
                              </span>
                            </div>
                            <div className="text-xs text-[color:var(--klic-component-block-color-text)]">
                              <span className="font-semibold text-[color:var(--klic-component-block-color-warning)]">조건:</span>{' '}
                              {rule.condition}
                            </div>
                            <div className="text-xs text-[color:var(--klic-component-block-color-text)]">
                              <span className="font-semibold text-[color:var(--klic-component-block-color-accent)]">실행:</span>{' '}
                              {rule.action}
                            </div>
                            <div className="text-[11px] text-[color:var(--klic-component-block-color-muted)]">
                              근거 문서: {rule.source}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setRulesList((prev) =>
                                prev.map((r) =>
                                  r.id === rule.id ? { ...r, enabled: !r.enabled } : r
                                )
                              );
                            }}
                            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors shrink-0 ${
                              rule.enabled
                                ? 'bg-klic-inverse text-klic-on-emphasis'
                                : 'bg-[var(--klic-component-block-color-soft)] text-[color:var(--klic-component-block-color-muted)]'
                            }`}
                          >
                            {rule.enabled ? '활성' : '비활성'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 우측: 실시간 규칙 테스트 시뮬레이터 */}
                  <div className="lg:col-span-4 bg-white rounded-2xl border border-[color:var(--klic-component-block-color-border)] p-5 space-y-4 flex flex-col justify-between mt-11">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[color:var(--klic-component-block-color-text)] flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-[color:var(--klic-component-block-color-warning)]" />
                          <span>가드레일 샌드박스 시뮬레이터</span>
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--klic-component-block-color-soft)] border border-[color:var(--klic-component-block-color-border)] text-[color:var(--klic-component-block-color-muted)]">
                          사전 검증
                        </span>
                      </div>

                      <div className="space-y-3 pt-1">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-[color:var(--klic-component-block-color-text)] font-medium">클라이언트 활성화율</span>
                            <span className="font-bold text-[color:var(--klic-component-block-color-text)]">{simActivation}%</span>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={80}
                            value={simActivation}
                            onChange={(e) => setSimActivation(Number(e.target.value))}
                            className="w-full accent-[var(--klic-component-block-color-warning)]"
                          />
                          <div className="text-[11px] text-[color:var(--klic-component-block-color-muted)] mt-0.5">
                            임계값 기준: 40% (가격 전략 플레이북 2024)
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-[color:var(--klic-component-block-color-text)] font-medium">요청 할인율</span>
                            <span className="font-bold text-[color:var(--klic-component-block-color-text)]">{simDiscount}%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={35}
                            value={simDiscount}
                            onChange={(e) => setSimDiscount(Number(e.target.value))}
                            className="w-full accent-[var(--klic-component-block-color-warning)]"
                          />
                          <div className="text-[11px] text-[color:var(--klic-component-block-color-muted)] mt-0.5">
                            임계값 기준: 15% 초과 시 총괄 파트너 에스컬레이션
                          </div>
                        </div>
                      </div>

                      {/* 시뮬레이션 판정 결과 박스 */}
                      <div className="p-3.5 rounded-xl bg-[var(--klic-component-block-color-soft)] border border-[color:var(--klic-component-block-color-border)] space-y-2">
                        <div className="text-[11px] font-bold text-[color:var(--klic-component-block-color-text)]">
                          시뮬레이션 판정 결과
                        </div>
                        {simActivation < 40 ? (
                          <div className="text-xs text-[color:var(--klic-component-block-color-danger)] bg-[var(--klic-component-block-color-soft)] p-2.5 rounded-lg font-medium">
                            [차단됨] 활성화율({simActivation}%)이 40% 미만이므로 가격 인상 제안이 보류되고 온보딩 체크리스트가 우선 배정됩니다.
                          </div>
                        ) : (
                          <div className="text-xs text-[color:var(--klic-component-block-color-accent)] bg-[var(--klic-component-block-color-soft)] p-2.5 rounded-lg font-medium">
                            [통과] 활성화율({simActivation}%)이 40% 이상이므로 단가 인상 및 확장 패키지 제안이 허용됩니다.
                          </div>
                        )}
                        {simDiscount > 15 && (
                          <div className="text-xs text-[color:var(--klic-component-block-color-warning)] bg-[var(--klic-component-block-color-border)] p-2.5 rounded-lg font-medium">
                            [에스컬레이션] 할인율({simDiscount}%)이 15% 한도를 초과하여 파트너 승인 큐로 라우팅됩니다.
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        triggerToast('시뮬레이션 파라미터가 운영 가드레일에 반영되었습니다.')
                      }
                      className="w-full py-2 rounded-lg bg-klic-inverse hover:bg-klic-inverse text-klic-on-emphasis text-xs font-semibold transition-colors"
                    >
                      규칙 스냅샷 배포하기
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== STYLE 4: 프랙티스 매출 & 코호트 리텐션 인사이트 대시보드 ==================== */}
            {activeMode === 'practice-insights' && (
              <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[color:var(--klic-component-block-color-muted)] mb-1">
                      <span>프랙티스 운영</span>
                      <ChevronRight className="w-3 h-3" />
                      <span className="text-[color:var(--klic-component-block-color-text)] font-medium">성과 및 리텐션 분석</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-[color:var(--klic-component-block-color-text)]">
                      프랙티스 수익성 & 플레이북 기여도 통계
                    </h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-white border border-[color:var(--klic-component-block-color-border)] text-xs font-medium text-[color:var(--klic-component-block-color-text)]">
                      2025년 1분기 기준 · 48개 엔터프라이즈 고객사
                    </span>
                  </div>
                </div>

                {/* 상단 4열 메트릭 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className="bg-white rounded-xl border border-[color:var(--klic-component-block-color-border)] p-4">
                    <div className="text-[11px] text-[color:var(--klic-component-block-color-muted)]">순매출 유지율</div>
                    <div className="text-2xl font-bold text-[color:var(--klic-component-block-color-text)] mt-1">118.4%</div>
                    <div className="text-[11px] text-[color:var(--klic-component-block-color-accent)] font-semibold mt-1">
                      +6.2%p (2024 플레이북 적용 후)
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-[color:var(--klic-component-block-color-border)] p-4">
                    <div className="text-[11px] text-[color:var(--klic-component-block-color-muted)]">관리 중인 연간 반복 매출</div>
                    <div className="text-2xl font-bold text-[color:var(--klic-component-block-color-text)] mt-1">₩168.4억</div>
                    <div className="text-[11px] text-[color:var(--klic-component-block-color-muted)] mt-1">확장 수주 +₩24.8억 포함</div>
                  </div>
                  <div className="bg-white rounded-xl border border-[color:var(--klic-component-block-color-border)] p-4">
                    <div className="text-[11px] text-[color:var(--klic-component-block-color-muted)]">지식 베이스 인용 정확도</div>
                    <div className="text-2xl font-bold text-[color:var(--klic-component-block-color-warning)] mt-1">98.7%</div>
                    <div className="text-[11px] text-[color:var(--klic-component-block-color-muted)] mt-1">상충 문서 해결률 96%</div>
                  </div>
                  <div className="bg-white rounded-xl border border-[color:var(--klic-component-block-color-border)] p-4">
                    <div className="text-[11px] text-[color:var(--klic-component-block-color-muted)]">파트너 주당 절감 시간</div>
                    <div className="text-2xl font-bold text-[color:var(--klic-component-block-color-text)] mt-1">14.5시간</div>
                    <div className="text-[11px] text-[color:var(--klic-component-block-color-accent)] font-semibold mt-1">
                      반복 자문 자동화율 78%
                    </div>
                  </div>
                </div>

                {/* 폴더형 탭 + 플레이북별 확장 매출 기여도 테이블 */}
                <div>
                  <div className="flex items-end gap-1">
                    {[
                      { id: 'PLAYBOOK', label: '플레이북별 기여도', count: 4 },
                      { id: 'COHORT', label: '분기별 리텐션 코호트', count: 6 },
                    ].map((tab) => {
                      const active = insightTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setInsightTab(tab.id as typeof insightTab)}
                          className={`px-5 py-3 text-[13px] transition-all flex items-center gap-2 ${
                            active
                              ? 'bg-white rounded-t-2xl font-bold text-[color:var(--klic-component-block-color-text)]'
                              : 'bg-transparent font-medium text-[color:var(--klic-component-block-color-text)] hover:text-[color:var(--klic-component-block-color-text)]'
                          }`}
                        >
                          <span>{tab.label}</span>
                          <span
                            className={`text-xs ${
                              active ? 'font-bold text-[color:var(--klic-component-block-color-warning)]' : 'font-medium text-[color:var(--klic-component-block-color-muted)]'
                            }`}
                          >
                            {tab.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div
                    className={`bg-white rounded-b-2xl rounded-tr-2xl ${
                      insightTab !== 'PLAYBOOK' ? 'rounded-tl-2xl' : ''
                    } shadow-2xs overflow-hidden divide-y divide-[var(--klic-component-block-color-soft)]`}
                  >
                    {[
                      {
                        doc: '가격 전략 플레이북 2024.docx',
                        citations: '최근 90일 142회 인용',
                        influencedArr: '₩8.6억',
                        winRate: '84%',
                        barWidth: 'w-4/5',
                      },
                      {
                        doc: '가격 책정 프레임워크 v3.pdf',
                        citations: '최근 90일 118회 인용',
                        influencedArr: '₩7.1억',
                        winRate: '79%',
                        barWidth: 'w-3/4',
                      },
                      {
                        doc: '3분기 고객 이탈 방어 분석서.pptx',
                        citations: '최근 90일 94회 인용',
                        influencedArr: '₩5.5억',
                        winRate: '91%',
                        barWidth: 'w-2/3',
                      },
                      {
                        doc: '클라이언트 온보딩 체크리스트.xlsx',
                        citations: '최근 90일 87회 인용',
                        influencedArr: '₩3.6억',
                        winRate: '88%',
                        barWidth: 'w-1/2',
                      },
                    ].map((row, idx) => (
                      <div
                        key={idx}
                        className="px-6 py-4 grid grid-cols-12 items-center gap-4 hover:bg-[var(--klic-component-block-color-soft)]"
                      >
                        <div className="col-span-5">
                          <div className="text-[13px] font-semibold text-[color:var(--klic-component-block-color-text)]">{row.doc}</div>
                          <div className="text-xs text-[color:var(--klic-component-block-color-muted)] mt-0.5">{row.citations}</div>
                        </div>
                        <div className="col-span-4">
                          <div className="w-full h-2 rounded-full bg-[var(--klic-component-block-color-soft)] overflow-hidden">
                            <div className={`h-full bg-[var(--klic-component-block-color-warning)] rounded-full ${row.barWidth}`} />
                          </div>
                        </div>
                        <div className="col-span-3 text-right">
                          <div className="text-[13px] font-bold text-[color:var(--klic-component-block-color-text)]">
                            {row.influencedArr}
                          </div>
                          <div className="text-[11px] text-[color:var(--klic-component-block-color-accent)] font-semibold">
                            채택 성공률 {row.winRate}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== STYLE 5: 클라이언트 딜리버리 & 액션 플랜 포털 대시보드 ==================== */}
            {activeMode === 'client-deliverables' && (
              <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[color:var(--klic-component-block-color-muted)] mb-1">
                      <span>클라이언트</span>
                      <ChevronRight className="w-3 h-3" />
                      <span>네이버클라우드</span>
                      <ChevronRight className="w-3 h-3" />
                      <span className="text-[color:var(--klic-component-block-color-text)] font-medium">90일 성장 로드맵</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-[color:var(--klic-component-block-color-text)]">
                      클라이언트 전용 진단 & 90일 실행 로드맵 포털
                    </h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        triggerToast('클라이언트 경영진에게 로드맵 공유 링크가 발송되었습니다.')
                      }
                      className="px-4 py-2 rounded-lg bg-[var(--klic-component-block-color-warning)] hover:bg-[var(--klic-component-block-color-warning)] text-klic-on-emphasis text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>클라이언트 서명 요청 발송</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 클라이언트 상태 배너 */}
                <div className="bg-white rounded-xl border border-[color:var(--klic-component-block-color-border)] p-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[color:var(--klic-component-block-color-text)]">
                        네이버클라우드 · 엔터프라이즈 리텐션 & 가격 최적화 프로그램
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--klic-component-block-color-soft)] text-[color:var(--klic-component-block-color-accent)]">
                        고객사 공유 중
                      </span>
                    </div>
                    <p className="text-xs text-[color:var(--klic-component-block-color-muted)]">
                      현재 초기 활성화율 38.4% (목표 40% 달성 시 2024 플레이북 기반 단가 조정 실행)
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-[11px] text-[color:var(--klic-component-block-color-muted)]">현재 연간 계약액</div>
                      <div className="text-lg font-bold text-[color:var(--klic-component-block-color-text)]">₩3.2억</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[color:var(--klic-component-block-color-muted)]">목표 확장 계약액</div>
                      <div className="text-lg font-bold text-[color:var(--klic-component-block-color-warning)]">₩4.1억</div>
                    </div>
                  </div>
                </div>

                {/* 폴더형 탭 + 3단계 딜리버리 로드맵 */}
                <div>
                  <div className="flex items-end gap-1">
                    {[
                      { id: 'ROADMAP', label: '실행 로드맵', count: 3 },
                      { id: 'DOCS', label: '공유된 플레이북 문서', count: 5 },
                    ].map((tab) => {
                      const active = portalTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setPortalTab(tab.id as typeof portalTab)}
                          className={`px-5 py-3 text-[13px] transition-all flex items-center gap-2 ${
                            active
                              ? 'bg-white rounded-t-2xl font-bold text-[color:var(--klic-component-block-color-text)]'
                              : 'bg-transparent font-medium text-[color:var(--klic-component-block-color-text)] hover:text-[color:var(--klic-component-block-color-text)]'
                          }`}
                        >
                          <span>{tab.label}</span>
                          <span
                            className={`text-xs ${
                              active ? 'font-bold text-[color:var(--klic-component-block-color-warning)]' : 'font-medium text-[color:var(--klic-component-block-color-muted)]'
                            }`}
                          >
                            {tab.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div
                    className={`bg-white rounded-b-2xl rounded-tr-2xl ${
                      portalTab !== 'ROADMAP' ? 'rounded-tl-2xl' : ''
                    } shadow-2xs overflow-hidden divide-y divide-[var(--klic-component-block-color-soft)]`}
                  >
                    {deliverables.map((item) => (
                      <div
                        key={item.id}
                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--klic-component-block-color-soft)]"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[var(--klic-component-block-color-soft)] text-[color:var(--klic-component-block-color-text)]">
                              {item.phase}
                            </span>
                            <span className="text-xs font-semibold text-[color:var(--klic-component-block-color-warning)]">
                              {item.impact}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-[color:var(--klic-component-block-color-text)]">{item.title}</div>
                          <div className="text-xs text-[color:var(--klic-component-block-color-muted)] flex items-center gap-2">
                            <span>근거 문서: {item.sourceDoc}</span>
                            <span>·</span>
                            <span>담당: {item.owner}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          {item.approvedByClient ? (
                            <span className="px-3 py-1.5 rounded-lg bg-[var(--klic-component-block-color-soft)] text-[color:var(--klic-component-block-color-accent)] text-xs font-semibold flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5" />
                              <span>클라이언트 승인 완료</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setDeliverables((prev) =>
                                  prev.map((d) =>
                                    d.id === item.id ? { ...d, approvedByClient: true } : d
                                  )
                                );
                                triggerToast(
                                  `${item.phase} 마일스톤이 클라이언트 승인 처리되었습니다.`
                                );
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-[var(--klic-component-block-color-soft)] hover:bg-[var(--klic-component-block-color-border)] text-[color:var(--klic-component-block-color-danger)] text-xs font-semibold transition-colors"
                            >
                              마일스톤 서명 승인
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
