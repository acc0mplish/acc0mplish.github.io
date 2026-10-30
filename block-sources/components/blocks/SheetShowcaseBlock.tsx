import { PersonAvatar } from '../PersonAvatar';
import React, { useState } from 'react';
import {
  Check,
  Plus,
  ChevronRight,
  ChevronDown,
  Clock,
  Paperclip,
  MessageSquare,
  Activity,
  Copy,
  Building2,
  ShieldCheck,
  SlidersHorizontal,
  GitCompare,
  Sparkles,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Send,
  FileText,
  Users,
  PhoneCall,
  ArrowUpRight,
  Search,
} from 'lucide-react';

export type SheetShowcaseMode =
  | 'all-showcase'
  | 'issue-detail'
  | 'trace-inspector'
  | 'customer-360'
  | 'advanced-filter'
  | 'audit-diff';

interface SheetShowcaseBlockProps {
  initialMode?: SheetShowcaseMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

const AVATARS = {
  sohee: './placeholders/avatar-576a55580552.svg',
  seoyeon: './placeholders/avatar-ef94a3ac14b1.svg',
  taewoo: './placeholders/avatar-352373979408.svg',
  junhyuk: './placeholders/avatar-d36430bc2634.svg',
  yujin: './placeholders/avatar-8c2580aea9a4.svg',
  sua: './placeholders/avatar-d81ac24457b6.svg',
};

interface IssueQueueItem {
  id: string;
  code: string;
  title: string;
  moduleName: string;
  region: string;
  updatedAgo: string;
  status: '진행 중' | '검토 대기' | '해결 완료' | '보류';
  priority: '긴급 (1등급)' | '높음 (2등급)' | '보통 (3등급)';
  assigneeName: string;
  assigneeRole: string;
  assigneeAvatar: string;
  summary: string;
}

const INITIAL_ISSUES: IssueQueueItem[] = [
  {
    id: 'iss-1',
    code: '정산-4821',
    title: '한빛핀테크 다중 통화 정산 웹훅 간헐적 응답 지연 완화',
    moduleName: '실시간 원장 정산 엔진',
    region: '서울 · 도쿄 이중화',
    updatedAgo: '4분 전',
    status: '진행 중',
    priority: '긴급 (1등급)',
    assigneeName: '이서연 리드',
    assigneeRole: '정산 코어 스쿼드',
    assigneeAvatar: AVATARS.seoyeon,
    summary:
      '오전 피크 시간대 외부 카드사 승인 중계 구간의 커넥션 대기열이 상승하여, 예비 정산망 자동 우회 임계값을 400ms에서 250ms로 단축 적용 중입니다.',
  },
  {
    id: 'iss-2',
    code: '정책-4819',
    title: '어드바이저 플레이북 연간 약정 할인율 충돌 규칙 병합',
    moduleName: '어드바이저 지식 충돌 감지',
    region: '서울 리전',
    updatedAgo: '22분 전',
    status: '검토 대기',
    priority: '높음 (2등급)',
    assigneeName: '한소윤 총괄',
    assigneeRole: '코어 플랫폼 본부',
    assigneeAvatar: AVATARS.sohee,
    summary:
      '2024년 가격 전략 플레이북과 구버전 문서 간 최대 할인율 상한선(15% vs 20%) 충돌 건에 대해 최신 가드레일 우선 적용 검증을 진행합니다.',
  },
  {
    id: 'iss-3',
    code: '보안-4814',
    title: '두나무클라우드 엔터프라이즈 싱글 사인온 부서 속성 동기화 보정',
    moduleName: '제로트러스트 권한 매트릭스',
    region: '글로벌 엣지',
    updatedAgo: '1시간 전',
    status: '진행 중',
    priority: '보통 (3등급)',
    assigneeName: '강태우 수석',
    assigneeRole: '플랫폼 엔지니어링',
    assigneeAvatar: AVATARS.taewoo,
    summary:
      '옥타 통합 인증 연동 시 신규 편성된 재무감사팀 그룹 식별자가 권한 매트릭스에 자동 매핑되도록 스키마 규칙을 보완합니다.',
  },
  {
    id: 'iss-4',
    code: '원장-4808',
    title: '3분기 재무 감사 증적용 원장 스냅샷 무결성 대사 검증',
    moduleName: '자동 감사 보고서 생성기',
    region: '판교 데이터센터',
    updatedAgo: '3시간 전',
    status: '해결 완료',
    priority: '보통 (3등급)',
    assigneeName: '정유진 총괄',
    assigneeRole: '전략재무본부',
    assigneeAvatar: AVATARS.yujin,
    summary:
      '총 148만 건의 분기 정산 원장 레코드에 대한 암호화 체크섬 대사를 완료하고 감사 증적 금고에 서명 보관했습니다.',
  },
];

const ASSIGNEE_OPTIONS = [
  { name: '이서연 리드', role: '정산 코어 스쿼드', avatar: AVATARS.seoyeon },
  { name: '한소윤 총괄', role: '코어 플랫폼 본부', avatar: AVATARS.sohee },
  { name: '강태우 수석', role: '플랫폼 엔지니어링', avatar: AVATARS.taewoo },
  { name: '정유진 총괄', role: '전략재무본부', avatar: AVATARS.yujin },
];

export function SheetShowcaseBlock({
  initialMode = 'issue-detail',
  density = 'normal',
}: SheetShowcaseBlockProps) {
  const [activeMode, setActiveMode] = useState<SheetShowcaseMode>(initialMode);

  React.useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  const boxPad =
    density === 'compact' ? 'p-4' : density === 'relaxed' ? 'p-6' : 'p-5';

  // --- 스타일 1 상태: 이슈 & 티켓 상세 슬라이드오버 시트 ---
  const [issues, setIssues] = useState<IssueQueueItem[]>(INITIAL_ISSUES);
  const [selectedIssueId, setSelectedIssueId] = useState<string>('iss-1');
  const [openPropMenu, setOpenPropMenu] = useState<'status' | 'priority' | 'assignee' | null>(null);
  const [subtasks, setSubtasks] = useState([
    { id: 'st-1', text: '서울·도쿄 정산 중계기 커넥션 풀 최대 대기열 256으로 상향', done: true },
    { id: 'st-2', text: '외부 카드사 응답 지연 시 지수 백오프 및 자동 우회 라우팅 적용', done: true },
    { id: 'st-3', text: '카나리 배포 그룹(트래픽 10%) 평균 응답 90ms 이하 유지 확인', done: false },
    { id: 'st-4', text: '상시 관제 운영 수칙 문서에 수동 복구 가드레일 절차 등록', done: false },
  ]);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 'cm-1',
      author: '한소윤 총괄',
      role: '코어 플랫폼 본부',
      avatar: AVATARS.sohee,
      time: '14분 전',
      body: '스테이징 테스트베드에서 재시도 백오프 적용 후 정산 큐 적체가 즉시 해소된 것을 확인했습니다.',
    },
    {
      id: 'cm-2',
      author: '이서연 리드',
      role: '정산 코어 스쿼드',
      avatar: AVATARS.seoyeon,
      time: '4분 전',
      body: '서울 리전 프로덕션 노드에 카나리 반영 완료했습니다. @한소윤 총괄님 최종 승격 여부 검토 부탁드립니다.',
    },
  ]);

  // --- 스타일 2 상태: 분산 트레이스 & 로그 인스펙터 시트 ---
  const [selectedSpanId, setSelectedSpanId] = useState<string>('span-4');
  const [traceTab, setTraceTab] = useState<'payload' | 'metadata' | 'error'>('payload');
  const [copiedTrace, setCopiedTrace] = useState(false);

  // --- 스타일 3 상태: B2B 고객사 360° 프로필 상세 시트 ---
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('cust-1');
  const [customerTab, setCustomerTab] = useState<'overview' | 'stakeholders' | 'history'>('overview');
  const [playbookTriggered, setPlaybookTriggered] = useState(false);

  // --- 스타일 4 상태: 복합 조건 쿼리 빌더 필터 시트 ---
  const [logicalJoin, setLogicalJoin] = useState<'AND' | 'OR'>('AND');
  const [activePreset, setActivePreset] = useState<string>('고위험 이탈 징후 고객사');
  const [filterRules, setFilterRules] = useState([
    { id: 'r-1', field: '연간 반복 매출 (ARR)', operator: '이상 (≥)', value: '₩300,000,000' },
    { id: 'r-2', field: '최근 30일 시트 활성화율', operator: '미만 (<)', value: '45%' },
    { id: 'r-3', field: '미해결 1등급 지원 티켓', operator: '초과 (>)', value: '2건' },
    { id: 'r-4', field: '계약 갱신 잔여 일수', operator: '이내 (≤)', value: '60일' },
  ]);
  const [openRuleDropdown, setOpenRuleDropdown] = useState<{ id: string; col: 'field' | 'operator' } | null>(null);
  const [filterApplied, setFilterApplied] = useState(false);

  // --- 스타일 5 상태: 설정 변경 전후(Diff) 비교 감사 시트 ---
  const [selectedAuditId, setSelectedAuditId] = useState<string>('aud-1');
  const [diffViewMode, setDiffViewMode] = useState<'split' | 'unified'>('split');
  const [rollbackConfirmed, setRollbackConfirmed] = useState(false);

  // ============================================================================
  // 1. 이슈 & 티켓 상세 슬라이드오버 시트 (KLIC/sheet-1)
  // ============================================================================
  const renderIssueDetailSheet = () => {
    const activeIssue = issues.find((i) => i.id === selectedIssueId) || issues[0];
    const doneCount = subtasks.filter((s) => s.done).length;
    const progressPct = Math.round((doneCount / subtasks.length) * 100);

    const updateActiveIssue = (patch: Partial<IssueQueueItem>) => {
      setIssues((prev) =>
        prev.map((item) => (item.id === activeIssue.id ? { ...item, ...patch } : item))
      );
    };

    return (
      <div className="w-full max-w-[980px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
        {/* 상단 베젤 헤더 */}
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-zinc-700 " />
            <span className="text-[13.5px] font-semibold text-zinc-900 ">
              이슈 & 티켓 상세 슬라이드오버 시트
            </span>
          </div>
          <span className="text-[11.5px] text-klic-muted">
            목록을 벗어나지 않고 우측 드로어에서 상태·담당자·하위 작업을 즉시 편집합니다
          </span>
        </div>

        {/* 내부 마스터 목록 + 우측 슬라이드오버 시트 분할 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1.5">
          {/* 좌측: 배경 이슈 목록 (5열) */}
          <div className={`lg:col-span-5 rounded-[14px] bg-white/75  border border-zinc-200/80  ${boxPad} flex flex-col justify-between space-y-4`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-klic-muted ">
                  실시간 관제 티켓 큐 ({issues.length}건)
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-blue-600 ">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  드로어 동기화 활성
                </span>
              </div>

              <div className="space-y-2">
                {issues.map((item) => {
                  const selected = item.id === activeIssue.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedIssueId(item.id);
                        setOpenPropMenu(null);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                        selected
                          ? 'bg-klic-inverse text-klic-on-emphasis border-zinc-900    shadow-xs'
                          : 'bg-white  border-zinc-200/80  hover:bg-zinc-50  text-zinc-900 '
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className={`font-mono font-semibold ${selected ? 'text-klic-on-emphasis ' : 'text-klic-muted'}`}>
                          {item.code} · {item.moduleName}
                        </span>
                        <span className={selected ? 'text-klic-muted ' : 'text-klic-muted'}>
                          {item.updatedAgo}
                        </span>
                      </div>

                      <div className="mt-1.5 text-[13px] font-semibold leading-snug line-clamp-1">
                        {item.title}
                      </div>

                      <div className="mt-2.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <PersonAvatar
                            src={item.assigneeAvatar}
                            alt={item.assigneeName}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className={`text-[11.5px] ${selected ? 'text-klic-on-emphasis ' : 'text-klic-muted '}`}>
                            {item.assigneeName}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10.5px] font-semibold ${
                            selected
                              ? 'bg-white/15 text-klic-on-emphasis  '
                              : 'bg-zinc-100  text-klic-muted '
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl bg-zinc-50  border border-zinc-200/70  p-3 text-[11.5px] text-klic-muted flex items-center justify-between">
              <span>선택된 행: {activeIssue.code}</span>
              <span className="font-medium text-zinc-700 ">우측 시트 열림</span>
            </div>
          </div>

          {/* 우측: 슬라이드오버 상세 시트 (7열) */}
          <div className={`lg:col-span-7 rounded-[14px] bg-white  border border-zinc-200/90  shadow-sm ${boxPad} flex flex-col justify-between space-y-5`}>
            <div className="space-y-4">
              {/* 시트 상단 바 */}
              <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 ">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-klic-inverse  text-klic-on-emphasis  text-[11px] font-mono font-semibold">
                    {activeIssue.code}
                  </span>
                  <span className="text-[12px] text-klic-muted">{activeIssue.region}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50  text-blue-700  text-[11px] font-semibold">
                  ✓ 실시간 자동 저장됨
                </span>
              </div>

              {/* 제목 및 요약 */}
              <div>
                <h4 className="text-[15.5px] font-semibold text-zinc-900  leading-snug">
                  {activeIssue.title}
                </h4>
                <p className="mt-1.5 text-[12.5px] text-klic-muted  leading-relaxed">
                  {activeIssue.summary}
                </p>
              </div>

              {/* 보더라인 없는 클린 속성 변경 바 (상태 / 우선순위 / 담당자) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-xl bg-zinc-50/90  p-2.5">
                {/* 진행 상태 팝오버 */}
                <div className="relative">
                  <div className="px-2 text-[11px] text-klic-muted">진행 상태</div>
                  <button
                    type="button"
                    onClick={() => setOpenPropMenu(openPropMenu === 'status' ? null : 'status')}
                    className="mt-0.5 w-full px-2 py-1.5 rounded-lg hover:bg-zinc-200/60  flex items-center justify-between text-[12.5px] font-semibold text-zinc-900  cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      {activeIssue.status}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-klic-muted" />
                  </button>
                  {openPropMenu === 'status' && (
                    <div className="absolute left-0 top-14 z-30 w-40 rounded-xl bg-white  border border-zinc-200  shadow-xl p-1 space-y-0.5">
                      {(['진행 중', '검토 대기', '해결 완료', '보류'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            updateActiveIssue({ status: st });
                            setOpenPropMenu(null);
                          }}
                          className={`w-full px-2.5 py-1.5 rounded-lg text-left text-[12px] flex items-center justify-between cursor-pointer ${
                            activeIssue.status === st
                              ? 'bg-klic-inverse text-klic-on-emphasis   font-semibold'
                              : 'text-zinc-700  hover:bg-zinc-100 '
                          }`}
                        >
                          <span>{st}</span>
                          {activeIssue.status === st && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 우선순위 팝오버 */}
                <div className="relative">
                  <div className="px-2 text-[11px] text-klic-muted">우선순위 등급</div>
                  <button
                    type="button"
                    onClick={() => setOpenPropMenu(openPropMenu === 'priority' ? null : 'priority')}
                    className="mt-0.5 w-full px-2 py-1.5 rounded-lg hover:bg-zinc-200/60  flex items-center justify-between text-[12.5px] font-semibold text-zinc-900  cursor-pointer"
                  >
                    <span>{activeIssue.priority}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-klic-muted" />
                  </button>
                  {openPropMenu === 'priority' && (
                    <div className="absolute left-0 top-14 z-30 w-44 rounded-xl bg-white  border border-zinc-200  shadow-xl p-1 space-y-0.5">
                      {(['긴급 (1등급)', '높음 (2등급)', '보통 (3등급)'] as const).map((pr) => (
                        <button
                          key={pr}
                          type="button"
                          onClick={() => {
                            updateActiveIssue({ priority: pr });
                            setOpenPropMenu(null);
                          }}
                          className={`w-full px-2.5 py-1.5 rounded-lg text-left text-[12px] flex items-center justify-between cursor-pointer ${
                            activeIssue.priority === pr
                              ? 'bg-klic-inverse text-klic-on-emphasis   font-semibold'
                              : 'text-zinc-700  hover:bg-zinc-100 '
                          }`}
                        >
                          <span>{pr}</span>
                          {activeIssue.priority === pr && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 담당자 팝오버 */}
                <div className="relative">
                  <div className="px-2 text-[11px] text-klic-muted">담당 책임자</div>
                  <button
                    type="button"
                    onClick={() => setOpenPropMenu(openPropMenu === 'assignee' ? null : 'assignee')}
                    className="mt-0.5 w-full px-2 py-1.5 rounded-lg hover:bg-zinc-200/60  flex items-center justify-between text-[12.5px] font-semibold text-zinc-900  cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <PersonAvatar
                        src={activeIssue.assigneeAvatar}
                        alt={activeIssue.assigneeName}
                        className="w-4 h-4 rounded-full object-cover shrink-0"
                      />
                      <span className="truncate">{activeIssue.assigneeName}</span>
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-klic-muted shrink-0" />
                  </button>
                  {openPropMenu === 'assignee' && (
                    <div className="absolute right-0 top-14 z-30 w-52 rounded-xl bg-white  border border-zinc-200  shadow-xl p-1 space-y-0.5">
                      {ASSIGNEE_OPTIONS.map((person) => (
                        <button
                          key={person.name}
                          type="button"
                          onClick={() => {
                            updateActiveIssue({
                              assigneeName: person.name,
                              assigneeRole: person.role,
                              assigneeAvatar: person.avatar,
                            });
                            setOpenPropMenu(null);
                          }}
                          className={`w-full px-2.5 py-1.5 rounded-lg text-left text-[12px] flex items-center justify-between cursor-pointer ${
                            activeIssue.assigneeName === person.name
                              ? 'bg-klic-inverse text-klic-on-emphasis   font-semibold'
                              : 'text-zinc-700  hover:bg-zinc-100 '
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <PersonAvatar src={person.avatar} alt={person.name} className="w-4 h-4 rounded-full object-cover" />
                            <span>{person.name}</span>
                          </span>
                          {activeIssue.assigneeName === person.name && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 하위 작업 체크리스트 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-semibold text-zinc-800 ">
                    하위 실행 체크리스트 ({doneCount}/{subtasks.length})
                  </span>
                  <span className="font-mono font-semibold text-klic-muted ">
                    {progressPct}% 완료
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-100  overflow-hidden">
                  <div
                    className="h-full bg-klic-inverse  transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="space-y-1.5 pt-1">
                  {subtasks.map((st) => (
                    <div
                      key={st.id}
                      onClick={() =>
                        setSubtasks((prev) =>
                          prev.map((item) => (item.id === st.id ? { ...item, done: !item.done } : item))
                        )
                      }
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-zinc-200/75  hover:bg-zinc-50  cursor-pointer"
                    >
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                          st.done
                            ? 'bg-klic-inverse text-klic-on-emphasis  '
                            : 'border border-zinc-300 '
                        }`}
                      >
                        {st.done && <Check className="w-3 h-3" />}
                      </span>
                      <span
                        className={`text-[12.5px] ${
                          st.done
                            ? 'line-through text-klic-muted'
                            : 'text-zinc-800  font-medium'
                        }`}
                      >
                        {st.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 첨부 파일 & 활동 코멘트 */}
              <div className="pt-2 border-t border-zinc-100  space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100  text-[11.5px] font-medium text-zinc-700 ">
                    <Paperclip className="w-3.5 h-3.5 text-klic-muted" />
                    정산_지연_구간_트레이스.pdf (1.4MB)
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100  text-[11.5px] font-medium text-zinc-700 ">
                    <FileText className="w-3.5 h-3.5 text-klic-muted" />
                    우회_라우팅_검증로그.json
                  </span>
                </div>

                <div className="space-y-2">
                  {comments.map((cm) => (
                    <div
                      key={cm.id}
                      className="p-3 rounded-xl bg-zinc-50/80  border border-zinc-200/60  space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11.5px]">
                        <div className="flex items-center gap-2">
                          <PersonAvatar src={cm.avatar} alt={cm.author} className="w-4 h-4 rounded-full object-cover" />
                          <span className="font-semibold text-zinc-900 ">{cm.author}</span>
                          <span className="text-klic-muted">· {cm.role}</span>
                        </div>
                        <span className="text-klic-muted">{cm.time}</span>
                      </div>
                      <p className="text-[12.5px] text-zinc-700  leading-relaxed pl-6">
                        {cm.body}
                      </p>
                    </div>
                  ))}
                </div>

                {/* 코멘트 입력 */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="담당 스쿼드에 활동 코멘트 또는 @멘션 남기기..."
                    className="flex-1 rounded-xl border border-zinc-200  bg-white  px-3.5 py-2 text-[12.5px] text-zinc-900  outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newComment.trim()) return;
                      setComments((prev) => [
                        ...prev,
                        {
                          id: `cm-${Date.now()}`,
                          author: '한소윤 총괄',
                          role: '코어 플랫폼 본부',
                          avatar: AVATARS.sohee,
                          time: '방금 전',
                          body: newComment.trim(),
                        },
                      ]);
                      setNewComment('');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis text-[12.5px] font-medium flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>등록</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 2. 분산 트레이스 & 로그 인스펙터 시트 (KLIC/sheet-2)
  // ============================================================================
  const renderTraceInspectorSheet = () => {
    const spans = [
      {
        id: 'span-1',
        service: '글로벌 엣지 게이트웨이',
        operation: '결제 승인 요청 수신 및 서명 검증',
        startMs: 0,
        durationMs: 248,
        offsetPct: 0,
        widthPct: 100,
        status: '정상',
        payload:
          '{"요청식별자":"req_flux_99281a","가맹점":"한빛핀테크","통화":"KRW","결제금액":14800000,"리전":"서울-메인"}',
        metadata: '프로토콜: HTTP/3 · 클라이언트 대역: 211.45.108.19 · 보안 서명: 일치',
        errorDetail: '게이트웨이 계층 오류 없음 (하위 정산 중계 스팬에서 재시도 1회 발생)',
      },
      {
        id: 'span-2',
        service: '제로트러스트 인증 엔진',
        operation: '가맹점 시크릿 키 및 할당량 조회',
        startMs: 8,
        durationMs: 24,
        offsetPct: 4,
        widthPct: 14,
        status: '정상',
        payload: '{"인증방식":"하드웨어_서명키","분당호출한도":"10,000건","현재사용률":"34.2%"}',
        metadata: '인메모리 캐시 적중 · 응답 지연 24ms · 판교 인증 클러스터',
        errorDetail: '인증 검증 계층 이상 징후 없음',
      },
      {
        id: 'span-3',
        service: '실시간 원장 정산 코어',
        operation: '복식부기 원장 가승인 레코드 생성',
        startMs: 34,
        durationMs: 48,
        offsetPct: 18,
        widthPct: 22,
        status: '정상',
        payload: '{"원장파티션":"seoul-ledger-p04","트랜잭션상태":"가승인_잠금","무결성해시":"sha256:8f91c2"}',
        metadata: '격리 수준: 직렬화 가능 · 원장 복제 지연: 4ms',
        errorDetail: '원장 기록 계층 이상 징후 없음',
      },
      {
        id: 'span-4',
        service: '외부 카드사 승인 중계기',
        operation: '주 매입사 지연 감지 및 예비 정산망 우회',
        startMs: 82,
        durationMs: 142,
        offsetPct: 38,
        widthPct: 52,
        status: '지연 우회',
        payload:
          '{"주매입사응답":"지연_초과(110ms)","우회경로":"서울_예비_정산망_02","최종승인코드":"OK_884120"}',
        metadata: '재시도 횟수: 1회 · 자동 가드레일 규칙 #04 발동 · 우회 소요 32ms',
        errorDetail:
          '[경고] 주 매입사 게이트웨이 응답이 100ms 임계값을 초과하여 서울 예비 정산망으로 무중단 전환되었습니다.',
      },
      {
        id: 'span-5',
        service: '고가용성 웹훅 스트림',
        operation: '고객사 정산 완료 이벤트 비동기 발송',
        startMs: 224,
        durationMs: 24,
        offsetPct: 86,
        widthPct: 14,
        status: '정상',
        payload: '{"수신처":"https://pay.hanbitfintech.kr/webhooks","전송상태":"200_정상수신","소요시간":"24ms"}',
        metadata: '이벤트 큐: 정산완료_스트림 · 서명 시크릿 검증 완료',
        errorDetail: '웹훅 전송 계층 이상 징후 없음',
      },
    ];

    const activeSpan = spans.find((s) => s.id === selectedSpanId) || spans[3];

    return (
      <div className="w-full max-w-[980px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-zinc-700 " />
            <span className="text-[13.5px] font-semibold text-zinc-900 ">
              분산 트레이스 & 마이크로서비스 스팬 인스펙터 시트
            </span>
          </div>
          <span className="text-[11.5px] text-klic-muted">
            트레이스 식별자: tr_seoul_20261022_9928 · 총 소요 시간 248ms
          </span>
        </div>

        <div className={`rounded-[14px] bg-white  border border-zinc-200/80  ${boxPad} space-y-5`}>
          {/* 상단 트레이스 요약 바 */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100 ">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-50  text-blue-700  text-[11px] font-semibold">
                  200 승인 완료 (예비망 우회)
                </span>
                <span className="text-[14px] font-semibold text-zinc-900 ">
                  한빛핀테크 정산 승인 요청 (₩14,800,000)
                </span>
              </div>
              <p className="text-[12px] text-klic-muted mt-1">
                아래 워터폴 차트에서 개별 마이크로서비스 스팬을 클릭하면 하단 인스펙터 시트에 상세 전문이 표시됩니다.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(activeSpan.payload);
                setCopiedTrace(true);
                setTimeout(() => setCopiedTrace(false), 1800);
              }}
              className="px-3 py-1.5 rounded-xl border border-zinc-200  text-[12px] font-medium text-zinc-700  hover:bg-zinc-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-klic-muted" />
              <span>{copiedTrace ? '전문 복사 완료' : '스팬 전문 복사'}</span>
            </button>
          </div>

          {/* 스팬 워터폴 타임라인 */}
          <div className="space-y-2">
            <div className="grid grid-cols-12 text-[11px] font-semibold text-klic-muted px-3">
              <span className="col-span-5">마이크로서비스 및 작업 단계</span>
              <span className="col-span-5">실행 타임라인 워터폴 (0ms ~ 248ms)</span>
              <span className="col-span-2 text-right">소요 시간</span>
            </div>

            <div className="space-y-1.5">
              {spans.map((sp) => {
                const selected = sp.id === activeSpan.id;
                const isWarn = sp.status === '지연 우회';
                return (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => setSelectedSpanId(sp.id)}
                    className={`w-full grid grid-cols-12 items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selected
                        ? 'border-zinc-900  bg-zinc-50 '
                        : 'border-zinc-200/75  hover:bg-zinc-50/60 '
                    }`}
                  >
                    <div className="col-span-12 sm:col-span-5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isWarn ? 'bg-amber-500' : 'bg-blue-500'
                          }`}
                        />
                        <span className="text-[12.5px] font-semibold text-zinc-900 ">
                          {sp.service}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-klic-muted pl-4 truncate">
                        {sp.operation}
                      </div>
                    </div>

                    <div className="col-span-9 sm:col-span-5">
                      <div className="w-full h-3 rounded-full bg-zinc-100  relative overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isWarn ? 'bg-amber-500' : 'bg-klic-inverse '
                          }`}
                          style={{
                            marginLeft: `${sp.offsetPct}%`,
                            width: `${sp.widthPct}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-span-3 sm:col-span-2 text-right font-mono text-[12px] font-semibold text-zinc-800 ">
                      {sp.durationMs}ms
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 하단 선택된 스팬 상세 인스펙터 */}
          <div className="rounded-xl bg-zinc-50  border border-zinc-200/80  p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-zinc-900 ">
                  선택된 스팬: {activeSpan.service}
                </span>
                <span className="text-[11.5px] text-klic-muted">
                  (시작 +{activeSpan.startMs}ms · 소요 {activeSpan.durationMs}ms)
                </span>
              </div>

              <div className="flex items-center gap-1">
                {(
                  [
                    { id: 'payload', label: '요청/응답 전문' },
                    { id: 'metadata', label: '연결 메타데이터' },
                    { id: 'error', label: '가드레일 진단' },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTraceTab(t.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11.5px] font-medium cursor-pointer ${
                      traceTab === t.id
                        ? 'bg-klic-inverse text-klic-on-emphasis  '
                        : 'text-klic-muted  hover:bg-zinc-200/60 '
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white  border border-zinc-200/80  p-3.5 font-mono text-[12px] text-zinc-800  overflow-x-auto">
              {traceTab === 'payload' && activeSpan.payload}
              {traceTab === 'metadata' && activeSpan.metadata}
              {traceTab === 'error' && activeSpan.errorDetail}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 3. B2B 고객사 360° 프로필 상세 시트 (KLIC/sheet-3)
  // ============================================================================
  const renderCustomer360Sheet = () => {
    const customers = [
      {
        id: 'cust-1',
        name: '한빛핀테크 코리아',
        tier: '엔터프라이즈 전략 고객',
        arr: '₩4.8억',
        health: 94,
        seats: '46 / 50석 (92%)',
        renewalDate: '2027년 03월 15일',
        csmName: '김서연 프로덕트 리드',
        csmAvatar: AVATARS.sohee,
        stakeholders: [
          { name: '정도윤 부사장', role: '최종 의사결정권자 (재무총괄)', avatar: AVATARS.junhyuk },
          { name: '박하늘 수석', role: '기술 아키텍처 챔피언', avatar: AVATARS.taewoo },
        ],
        history: [
          { date: '2026.09', title: '다중 통화 정산 모듈 추가 증설 (+₩1.2억)', badge: '확장 계약' },
          { date: '2026.03', title: '전사 엔터프라이즈 연간 본계약 갱신 완료', badge: '정기 갱신' },
        ],
      },
      {
        id: 'cust-2',
        name: '두나무 파이낸셜',
        tier: '엔터프라이즈 플랜',
        arr: '₩3.2억',
        health: 88,
        seats: '38 / 40석 (95%)',
        renewalDate: '2026년 12월 01일',
        csmName: '이서연 리드',
        csmAvatar: AVATARS.seoyeon,
        stakeholders: [
          { name: '최현우 대표', role: '경영 총괄 스폰서', avatar: AVATARS.taewoo },
          { name: '윤서아 팀장', role: '정보보안 거버넌스 리더', avatar: AVATARS.sua },
        ],
        history: [
          { date: '2026.07', title: '서울·도쿄 전용 클러스터 보안 감사 통과', badge: '보안 검증' },
          { date: '2025.12', title: '초기 기술 검증 완료 및 연간 약정 전환', badge: '신규 수주' },
        ],
      },
      {
        id: 'cust-3',
        name: '솔라리스 자산운용',
        tier: '금융 전용 클러스터',
        arr: '₩6.4억',
        health: 76,
        seats: '58 / 80석 (72%)',
        renewalDate: '2026년 11월 20일',
        csmName: '정유진 총괄',
        csmAvatar: AVATARS.yujin,
        stakeholders: [
          { name: '강민석 전무', role: '리스크 관리 본부장', avatar: AVATARS.junhyuk },
          { name: '한지우 매니저', role: '정산 운영 실무 책임자', avatar: AVATARS.seoyeon },
        ],
        history: [
          { date: '2026.10', title: '3분기 시트 활성화율 제고 온보딩 세션 진행', badge: '집중 케어' },
          { date: '2025.11', title: '금융 전용 이중화 정산망 1차 구축 완료', badge: '본계약' },
        ],
      },
    ];

    const activeCust = customers.find((c) => c.id === selectedCustomerId) || customers[0];

    return (
      <div className="w-full max-w-[980px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-zinc-700 " />
            <span className="text-[13.5px] font-semibold text-zinc-900 ">
              B2B 고객사 360° 프로필 상세 시트
            </span>
          </div>
          <span className="text-[11.5px] text-klic-muted">
            계약 ARR · 계정 건강도 · 핵심 이해관계자 · 갱신 히스토리 통합 조회
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1.5">
          {/* 좌측 고객사 선택 리스트 (4열) */}
          <div className={`lg:col-span-4 rounded-[14px] bg-white/75  border border-zinc-200/80  ${boxPad} space-y-2.5`}>
            <div className="text-[12px] font-semibold text-klic-muted mb-1">
              관리 중인 핵심 고객사 ({customers.length})
            </div>
            {customers.map((c) => {
              const active = c.id === activeCust.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedCustomerId(c.id);
                    setPlaybookTriggered(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    active
                      ? 'bg-klic-inverse text-klic-on-emphasis border-zinc-900   '
                      : 'bg-white  border-zinc-200/80  hover:bg-zinc-50 text-zinc-900 '
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13.5px] font-semibold">{c.name}</span>
                    <span className="font-mono text-[12.5px] font-bold">{c.arr}</span>
                  </div>
                  <div className={`text-[11.5px] mt-1 ${active ? 'text-klic-muted ' : 'text-klic-muted'}`}>
                    {c.tier} · 건강도 {c.health}점
                  </div>
                </button>
              );
            })}
          </div>

          {/* 우측 고객사 360° 슬라이드오버 시트 (8열) */}
          <div className={`lg:col-span-8 rounded-[14px] bg-white  border border-zinc-200/90  ${boxPad} space-y-5`}>
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-zinc-100 ">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-klic-inverse  text-klic-on-emphasis  flex items-center justify-center font-bold text-base">
                  {activeCust.name.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-[16px] font-semibold text-zinc-900 ">
                      {activeCust.name}
                    </h4>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50  text-blue-700  text-[11px] font-semibold">
                      건강도 {activeCust.health}점
                    </span>
                  </div>
                  <p className="text-[12px] text-klic-muted mt-0.5">
                    {activeCust.tier} · 차기 갱신일: {activeCust.renewalDate}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPlaybookTriggered((v) => !v)}
                className="px-3.5 py-2 rounded-xl bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis text-[12px] font-medium cursor-pointer"
              >
                {playbookTriggered ? '✓ 확장 제안 리포트 발송됨' : '연간 확장 제안서 생성'}
              </button>
            </div>

            {/* 3열 핵심 지표 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-zinc-50  border border-zinc-200/70 ">
                <div className="text-[11.5px] text-klic-muted">연간 반복 매출 (ARR)</div>
                <div className="text-[18px] font-bold text-zinc-900  mt-0.5">
                  {activeCust.arr}
                </div>
                <div className="text-[11px] text-blue-600 font-medium mt-0.5">
                  전년 대비 +24.5% 순증
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50  border border-zinc-200/70 ">
                <div className="text-[11.5px] text-klic-muted">약정 시트 가동률</div>
                <div className="text-[16px] font-bold text-zinc-900  mt-0.5">
                  {activeCust.seats}
                </div>
                <div className="text-[11px] text-klic-muted mt-0.5">추가 시트 증설 권장 구간</div>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50  border border-zinc-200/70 ">
                <div className="text-[11.5px] text-klic-muted">전담 고객성공 매니저</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <PersonAvatar
                    src={activeCust.csmAvatar}
                    alt={activeCust.csmName}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-[13px] font-semibold text-zinc-900 ">
                    {activeCust.csmName}
                  </span>
                </div>
              </div>
            </div>

            {/* 시트 내부 탭 */}
            <div className="flex items-center gap-1.5 border-b border-zinc-100  pb-2.5">
              {(
                [
                  { id: 'overview', label: '이해관계자 연락처' },
                  { id: 'history', label: '계약 및 확장 히스토리' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCustomerTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium cursor-pointer ${
                    customerTab === tab.id
                      ? 'bg-klic-inverse text-klic-on-emphasis  '
                      : 'text-klic-muted hover:bg-zinc-100 '
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {customerTab === 'overview' ? (
              <div className="space-y-2">
                {activeCust.stakeholders.map((person) => (
                  <div
                    key={person.name}
                    className="p-3.5 rounded-xl border border-zinc-200/80  flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <PersonAvatar
                        src={person.avatar}
                        alt={person.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-[13px] font-semibold text-zinc-900 ">
                          {person.name}
                        </div>
                        <div className="text-[11.5px] text-klic-muted">{person.role}</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-zinc-100  text-[11px] font-medium text-zinc-700 ">
                      정기 리뷰 참석자
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {activeCust.history.map((h) => (
                  <div
                    key={h.title}
                    className="p-3.5 rounded-xl border border-zinc-200/80  flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono text-[11.5px] text-klic-muted mr-2">{h.date}</span>
                      <span className="text-[13px] font-semibold text-zinc-900 ">
                        {h.title}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-blue-50  text-blue-700  text-[11px] font-semibold">
                      {h.badge}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 4. 복합 조건 쿼리 빌더 필터 시트 (KLIC/sheet-4)
  // ============================================================================
  const renderAdvancedFilterSheet = () => {
    const fieldOptions = [
      '연간 반복 매출 (ARR)',
      '최근 30일 시트 활성화율',
      '미해결 1등급 지원 티켓',
      '계약 갱신 잔여 일수',
      '정산 지연 경보 횟수',
    ];
    const operatorOptions = ['이상 (≥)', '미만 (<)', '초과 (>)', '이내 (≤)', '일치 (=)'];

    return (
      <div className="w-full max-w-[860px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-zinc-700 " />
            <span className="text-[13.5px] font-semibold text-zinc-900 ">
              복합 조건 쿼리 빌더 슬라이드오버 시트
            </span>
          </div>
          <span className="text-[11.5px] text-klic-muted">
            다중 논리 연산자 그룹 및 자주 쓰는 필터 프리셋 저장
          </span>
        </div>

        <div className={`rounded-[14px] bg-white  border border-zinc-200/80  ${boxPad} space-y-5`}>
          {/* 상단 저장된 프리셋 칩 */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100 ">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[12px] text-klic-muted mr-1">저장된 프리셋:</span>
              {[
                '고위험 이탈 징후 고객사',
                '서울 리전 대용량 정산 보류',
                '할인율 15% 초과 특약 품의',
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setActivePreset(preset);
                    setFilterApplied(false);
                  }}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                    activePreset === preset
                      ? 'bg-klic-inverse text-klic-on-emphasis  '
                      : 'bg-zinc-100  text-klic-muted  hover:bg-zinc-200/70'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* 논리 연산자 토글 */}
            <div className="inline-flex rounded-xl bg-zinc-100  p-0.5 text-[11.5px] font-semibold">
              <button
                type="button"
                onClick={() => setLogicalJoin('AND')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                  logicalJoin === 'AND'
                    ? 'bg-white  text-zinc-900  shadow-2xs'
                    : 'text-klic-muted'
                }`}
              >
                모두 충족 (AND)
              </button>
              <button
                type="button"
                onClick={() => setLogicalJoin('OR')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                  logicalJoin === 'OR'
                    ? 'bg-white  text-zinc-900  shadow-2xs'
                    : 'text-klic-muted'
                }`}
              >
                하나라도 충족 (OR)
              </button>
            </div>
          </div>

          {/* 조건 빌더 행 목록 (보더라인 없는 깔끔한 필 선택기) */}
          <div className="space-y-2">
            {filterRules.map((rule, idx) => (
              <div
                key={rule.id}
                className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-zinc-50/90 "
              >
                <span className="w-14 text-center px-2 py-1 rounded-lg bg-zinc-200/70  text-[11px] font-mono font-semibold text-zinc-700 ">
                  {idx === 0 ? '조건 1' : logicalJoin}
                </span>

                {/* 속성 선택 팝오버 (보더라인 없음) */}
                <div className="relative flex-1 min-w-[180px]">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenRuleDropdown(
                        openRuleDropdown?.id === rule.id && openRuleDropdown.col === 'field'
                          ? null
                          : { id: rule.id, col: 'field' }
                      )
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-white  hover:bg-zinc-100  flex items-center justify-between text-[12.5px] font-medium text-zinc-900  cursor-pointer"
                  >
                    <span>{rule.field}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-klic-muted" />
                  </button>
                  {openRuleDropdown?.id === rule.id && openRuleDropdown.col === 'field' && (
                    <div className="absolute left-0 top-10 z-30 w-56 rounded-xl bg-white  border border-zinc-200  shadow-xl p-1 space-y-0.5">
                      {fieldOptions.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => {
                            setFilterRules((prev) =>
                              prev.map((r) => (r.id === rule.id ? { ...r, field: f } : r))
                            );
                            setOpenRuleDropdown(null);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-[12px] hover:bg-zinc-100  text-zinc-800  cursor-pointer"
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 연산자 선택 팝오버 (보더라인 없음) */}
                <div className="relative w-32">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenRuleDropdown(
                        openRuleDropdown?.id === rule.id && openRuleDropdown.col === 'operator'
                          ? null
                          : { id: rule.id, col: 'operator' }
                      )
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-white  hover:bg-zinc-100  flex items-center justify-between text-[12.5px] font-medium text-zinc-700  cursor-pointer"
                  >
                    <span>{rule.operator}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-klic-muted" />
                  </button>
                  {openRuleDropdown?.id === rule.id && openRuleDropdown.col === 'operator' && (
                    <div className="absolute left-0 top-10 z-30 w-36 rounded-xl bg-white  border border-zinc-200  shadow-xl p-1 space-y-0.5">
                      {operatorOptions.map((op) => (
                        <button
                          key={op}
                          type="button"
                          onClick={() => {
                            setFilterRules((prev) =>
                              prev.map((r) => (r.id === rule.id ? { ...r, operator: op } : r))
                            );
                            setOpenRuleDropdown(null);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-[12px] hover:bg-zinc-100  text-zinc-800  cursor-pointer"
                        >
                          {op}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 기준값 입력 */}
                <input
                  type="text"
                  value={rule.value}
                  onChange={(e) =>
                    setFilterRules((prev) =>
                      prev.map((r) => (r.id === rule.id ? { ...r, value: e.target.value } : r))
                    )
                  }
                  className="w-36 px-3 py-1.5 rounded-lg bg-white  font-mono text-[12.5px] font-semibold text-zinc-900  outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setFilterRules((prev) => prev.filter((r) => r.id !== rule.id))
                  }
                  className="p-1.5 rounded-lg text-klic-muted hover:text-blue-500 hover:bg-zinc-200/50 cursor-pointer"
                  title="조건 삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() =>
                setFilterRules((prev) => [
                  ...prev,
                  {
                    id: `r-${Date.now()}`,
                    field: '정산 지연 경보 횟수',
                    operator: '이상 (≥)',
                    value: '1회',
                  },
                ])
              }
              className="px-3 py-1.5 rounded-xl bg-zinc-100  hover:bg-zinc-200/70 text-[12px] font-medium text-zinc-700  flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>새 필터 조건 추가</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setFilterRules([
                  { id: 'r-1', field: '연간 반복 매출 (ARR)', operator: '이상 (≥)', value: '₩300,000,000' },
                  { id: 'r-2', field: '최근 30일 시트 활성화율', operator: '미만 (<)', value: '45%' },
                ])
              }
              className="text-[12px] text-klic-muted hover:text-zinc-900  flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>기본 조건 복원</span>
            </button>
          </div>
        </div>

        {/* 하단 베젤 결과 적용 바 */}
        <div className="px-4 py-2.5 flex items-center justify-between text-[12px]">
          <span className="text-klic-muted">
            일치하는 엔터프라이즈 원장 레코드: <strong className="text-zinc-900 ">142건</strong>
          </span>
          <button
            type="button"
            onClick={() => setFilterApplied(true)}
            className="px-4 py-1.5 rounded-xl bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis text-[12.5px] font-medium cursor-pointer"
          >
            {filterApplied ? '✓ 142건 필터 뷰에 적용 완료' : '쿼리 조건 그리드에 적용하기'}
          </button>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 5. 설정 변경 전후(Diff) 비교 감사 시트 (KLIC/sheet-5)
  // ============================================================================
  const renderAuditDiffSheet = () => {
    const audits = [
      {
        id: 'aud-1',
        title: '엔터프라이즈 할인율 가드레일 및 서명 키 정책 변경',
        actor: '한소윤 총괄 아키텍트',
        avatar: AVATARS.sohee,
        time: '오늘 오후 05:42 · 서울 강남 본사',
        resource: 'policy-enterprise-settlement-v4',
        diffs: [
          {
            field: '최대 허용 연간 약정 할인율',
            before: '20% (본부장 재량 승인)',
            after: '15% (초과 시 총괄 파트너 필수 결재)',
          },
          {
            field: '외부 카드사 응답 지연 우회 임계값',
            before: '400ms 연속 3회 초과 시',
            after: '250ms 연속 2회 초과 시 즉시 예비망 전환',
          },
          {
            field: '원장 마스터 서명 키 교체 주기',
            before: '90일 수동 교체',
            after: '30일 무중단 자동 순환 교체',
          },
        ],
      },
      {
        id: 'aud-2',
        title: '제로트러스트 세션 만료 및 허용 대역 화이트리스트 갱신',
        actor: '윤도원 보안 아키텍트',
        avatar: AVATARS.taewoo,
        time: '오늘 오후 03:18 · 판교 데이터센터',
        resource: 'rbac-zero-trust-session-policy',
        diffs: [
          {
            field: '관리자 유휴 세션 자동 잠금 시간',
            before: '60분',
            after: '30분 (생체 패스키 재검증 필수)',
          },
          {
            field: '해외 비인가 대역 접속 차단',
            before: '경고 알림 후 수동 차단',
            after: '엣지 방화벽 즉시 차단 및 보안팀 호출',
          },
        ],
      },
    ];

    const activeAudit = audits.find((a) => a.id === selectedAuditId) || audits[0];

    return (
      <div className="w-full max-w-[920px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-zinc-700 " />
            <span className="text-[13.5px] font-semibold text-zinc-900 ">
              보안 정책 & 설정 변경 전후(Diff) 비교 감사 시트
            </span>
          </div>
          <span className="text-[11.5px] text-klic-muted">
            위변조 불가능한 SIEM 감사 증적 및 원클릭 이전 버전 복원
          </span>
        </div>

        <div className={`rounded-[14px] bg-white  border border-zinc-200/80  ${boxPad} space-y-5`}>
          {/* 감사 이력 선택 탭 + 비교 모드 스위치 */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100 ">
            <div className="flex flex-wrap items-center gap-2">
              {audits.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    setSelectedAuditId(a.id);
                    setRollbackConfirmed(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[12px] font-medium flex items-center gap-2 cursor-pointer ${
                    activeAudit.id === a.id
                      ? 'bg-klic-inverse text-klic-on-emphasis  '
                      : 'bg-zinc-100  text-klic-muted '
                  }`}
                >
                  <PersonAvatar src={a.avatar} alt={a.actor} className="w-4 h-4 rounded-full object-cover" />
                  <span>{a.title}</span>
                </button>
              ))}
            </div>

            <div className="inline-flex rounded-xl bg-zinc-100  p-0.5 text-[11.5px] font-semibold">
              <button
                type="button"
                onClick={() => setDiffViewMode('split')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                  diffViewMode === 'split'
                    ? 'bg-white  text-zinc-900  shadow-2xs'
                    : 'text-klic-muted'
                }`}
              >
                좌우 나란히 비교
              </button>
              <button
                type="button"
                onClick={() => setDiffViewMode('unified')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                  diffViewMode === 'unified'
                    ? 'bg-white  text-zinc-900  shadow-2xs'
                    : 'text-klic-muted'
                }`}
              >
                통합 줄 단위 비교
              </button>
            </div>
          </div>

          {/* 감사 메타데이터 요약 */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-klic-muted">
            <div className="flex items-center gap-2">
              <PersonAvatar
                src={activeAudit.avatar}
                alt={activeAudit.actor}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="font-semibold text-zinc-900 ">
                {activeAudit.actor}
              </span>
              <span>· {activeAudit.time}</span>
            </div>
            <span className="font-mono text-[11.5px] px-2 py-0.5 rounded bg-zinc-100  text-zinc-700 ">
              대상 리소스: {activeAudit.resource}
            </span>
          </div>

          {/* 변경 전후 비교 영역 */}
          <div className="space-y-2.5">
            {activeAudit.diffs.map((d) => (
              <div
                key={d.field}
                className="rounded-xl border border-zinc-200/80  overflow-hidden"
              >
                <div className="px-4 py-2 bg-zinc-50  border-b border-zinc-200/70  text-[12px] font-semibold text-zinc-800 ">
                  {d.field}
                </div>
                {diffViewMode === 'split' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200/70  text-[12.5px]">
                    <div className="p-3.5 bg-blue-50/50  text-blue-900 ">
                      <div className="text-[10.5px] font-semibold text-blue-500 mb-1">
                        변경 전 (이전 설정값)
                      </div>
                      <span className="line-through opacity-85">{d.before}</span>
                    </div>
                    <div className="p-3.5 bg-blue-50/50  text-blue-900 ">
                      <div className="text-[10.5px] font-semibold text-blue-600 mb-1">
                        변경 후 (현재 운영 반영값)
                      </div>
                      <span className="font-semibold">{d.after}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 space-y-1.5 text-[12.5px]">
                    <div className="px-2.5 py-1 rounded bg-blue-50  text-blue-800  line-through">
                      - {d.before}
                    </div>
                    <div className="px-2.5 py-1 rounded bg-blue-50  text-blue-800  font-semibold">
                      + {d.after}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-2.5 flex items-center justify-between text-[12px]">
          <span className="text-klic-muted">
            생체 패스키 및 하드웨어 보안키 이중 서명 검증 완료
          </span>
          <button
            type="button"
            onClick={() => setRollbackConfirmed((v) => !v)}
            className="px-4 py-1.5 rounded-xl bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis text-[12.5px] font-medium cursor-pointer"
          >
            {rollbackConfirmed ? '✓ 이전 버전 설정으로 복원 완료됨' : '변경 전 설정으로 즉시 복원'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white  rounded-2xl border border-zinc-200/80  overflow-hidden">
      {/* 상단 시트 & 드로어 스타일 전환 바 (한글 전용) */}
      <div className="px-5 py-3.5 border-b border-zinc-200/80  bg-zinc-50/60  flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-klic-inverse " />
          <span className="text-[13px] font-semibold text-zinc-900 ">
            KLIC 엔터프라이즈 시트 & 슬라이드오버 컬렉션
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'all-showcase', label: '전체 5종 쇼케이스' },
              { id: 'issue-detail', label: '이슈 & 티켓 상세' },
              { id: 'trace-inspector', label: '분산 트레이스 인스펙터' },
              { id: 'customer-360', label: '고객사 360° 프로필' },
              { id: 'advanced-filter', label: '복합 쿼리 필터' },
              { id: 'audit-diff', label: '설정 변경 감사 비교' },
            ] as { id: SheetShowcaseMode; label: string }[]
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
                KLIC/sheet-1 · 이슈 & 티켓 상세 슬라이드오버 시트
              </div>
              {renderIssueDetailSheet()}
            </section>

            <section className="space-y-2.5">
              <div className="max-w-[980px] mx-auto px-1 text-[12px] font-medium text-klic-muted">
                KLIC/sheet-2 · 분산 트레이스 & 로그 인스펙터 시트
              </div>
              {renderTraceInspectorSheet()}
            </section>

            <section className="space-y-2.5">
              <div className="max-w-[980px] mx-auto px-1 text-[12px] font-medium text-klic-muted">
                KLIC/sheet-3 · B2B 고객사 360° 프로필 상세 시트
              </div>
              {renderCustomer360Sheet()}
            </section>

            <section className="space-y-2.5">
              <div className="max-w-[860px] mx-auto px-1 text-[12px] font-medium text-klic-muted">
                KLIC/sheet-4 · 복합 조건 쿼리 빌더 필터 시트
              </div>
              {renderAdvancedFilterSheet()}
            </section>

            <section className="space-y-2.5">
              <div className="max-w-[920px] mx-auto px-1 text-[12px] font-medium text-klic-muted">
                KLIC/sheet-5 · 설정 변경 전후(Diff) 비교 감사 시트
              </div>
              {renderAuditDiffSheet()}
            </section>
          </>
        )}

        {activeMode === 'issue-detail' && renderIssueDetailSheet()}
        {activeMode === 'trace-inspector' && renderTraceInspectorSheet()}
        {activeMode === 'customer-360' && renderCustomer360Sheet()}
        {activeMode === 'advanced-filter' && renderAdvancedFilterSheet()}
        {activeMode === 'audit-diff' && renderAuditDiffSheet()}
      </div>
    </div>
  );
}
