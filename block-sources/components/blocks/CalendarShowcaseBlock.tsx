import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldAlert,
  Megaphone,
  PhoneCall,
  Building2,
  FileCheck2,
  Lock,
  Unlock,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';

export type CalendarShowcaseMode =
  | 'all-showcase'
  | 'release-freeze'
  | 'marketing-campaign'
  | 'oncall-rotation'
  | 'resource-booking'
  | 'compliance-audit';

interface CalendarShowcaseBlockProps {
  initialMode?: CalendarShowcaseMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

interface ReleaseDayItem {
  day: number;
  isCurrentMonth: boolean;
  isFreeze?: boolean;
  freezeLabel?: string;
  events: Array<{
    id: string;
    title: string;
    type: 'release' | 'freeze' | 'migration' | 'hotfix';
    version?: string;
    owner: string;
    risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'LOCKED';
    window: string;
    desc: string;
  }>;
}

export const CalendarShowcaseBlock: React.FC<CalendarShowcaseBlockProps> = ({
  initialMode = 'all-showcase',
  density = 'normal',
}) => {
  const [activeTab, setActiveTab] = useState<CalendarShowcaseMode>(initialMode);

  useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode]);

  const boxPad =
    density === 'compact' ? 'p-4' : density === 'relaxed' ? 'p-6' : 'p-5';

  // ===========================================================================
  // 1. 릴리즈 & 코드 프리즈 캘린더 (calendar-release-freeze) 상태
  // ===========================================================================
  const [releaseFilter, setReleaseFilter] = useState<'all' | 'release' | 'freeze' | 'migration'>('all');
  const [selectedDay, setSelectedDay] = useState<number>(14);
  const [cabOverrideApproved, setCabOverrideApproved] = useState<boolean>(false);

  const releaseDays: ReleaseDayItem[] = [
    { day: 1, isCurrentMonth: true, events: [{ id: 'r-1', title: 'v4.13.2 결제 게이트웨이 패치', type: 'release', version: 'v4.13.2', owner: '김태린 SRE', risk: 'LOW', window: '10:00 ~ 10:45 KST', desc: 'PG사 타임아웃 재시도 지수 백오프 튜닝 배포' }] },
    { day: 2, isCurrentMonth: true, events: [] },
    { day: 3, isCurrentMonth: true, events: [] },
    { day: 4, isCurrentMonth: true, events: [{ id: 'r-2', title: 'Aurora PostgreSQL 16.3 마이너 업그레이드', type: 'migration', version: 'DB-16.3', owner: '박준형 DBA', risk: 'MEDIUM', window: '02:00 ~ 03:30 KST', desc: 'Blue/Green 무중단 리더-라이터 스위치오버(다운타임 0.8초)' }] },
    { day: 5, isCurrentMonth: true, events: [] },
    { day: 6, isCurrentMonth: true, events: [{ id: 'r-3', title: 'v4.13.5 정산 대시보드 릴리즈', type: 'release', version: 'v4.13.5', owner: '이수현 FE', risk: 'LOW', window: '14:00 ~ 14:30 KST', desc: '대규모 거래내역 가상 스크롤 그리드 성능 개선' }] },
    { day: 7, isCurrentMonth: true, events: [] },
    { day: 8, isCurrentMonth: true, events: [{ id: 'r-4', title: 'Kafka 클러스터 브로커 증설', type: 'migration', version: 'INFRA-92', owner: '최윤성 인프라', risk: 'MEDIUM', window: '03:00 ~ 04:00 KST', desc: '초당 18만건 이상탐지 스트림 파티션 리밸런싱' }] },
    { day: 9, isCurrentMonth: true, events: [] },
    { day: 10, isCurrentMonth: true, events: [] },
    { day: 11, isCurrentMonth: true, events: [{ id: 'r-5', title: 'v4.14.0-rc1 스테이징 부하 테스트', type: 'release', version: 'v4.14.0-rc1', owner: '정민호 QA', risk: 'LOW', window: '15:00 ~ 18:00 KST', desc: '피크 트래픽 300% 가정 카오스 엔지니어링 리허설' }] },
    { day: 12, isCurrentMonth: true, isFreeze: true, freezeLabel: '상반기 결산 코드 프리즈 (Day 1/4)', events: [{ id: 'f-1', title: '전사 프로덕션 코드 동결 (Code Freeze 시작)', type: 'freeze', version: 'LOCK-2026H1', owner: 'CAB 위원회', risk: 'LOCKED', window: '00:00 ~ 23:59 KST', desc: '반기 재무 원장 마감 기간 동안 일반 PR 머지 및 배포 전면 차단' }] },
    { day: 13, isCurrentMonth: true, isFreeze: true, freezeLabel: '상반기 결산 코드 프리즈 (Day 2/4)', events: [{ id: 'f-2', title: '원장 정합성 스냅샷 검증', type: 'freeze', version: 'LOCK-2026H1', owner: '재무정산팀', risk: 'LOCKED', window: '종일 동결', desc: '원장 대사 기간 중 DB 스키마 DDL 변경 엄격 금지' }] },
    { day: 14, isCurrentMonth: true, isFreeze: true, freezeLabel: '상반기 결산 코드 프리즈 (Day 3/4)', events: [{ id: 'h-1', title: '[CAB 긴급승인] FDS 오탐 룰셋 핫픽스', type: 'hotfix', version: 'v4.13.6-hotfix', owner: '강도원 보안총괄', risk: 'HIGH', window: '16:00 ~ 16:20 KST', desc: '코드 프리즈 중 해외법인 고액 송금 오차단 해결을 위한 CTO 예외 승인 배포' }] },
    { day: 15, isCurrentMonth: true, isFreeze: true, freezeLabel: '상반기 결산 코드 프리즈 해제 (18:00)', events: [{ id: 'f-3', title: '코드 프리즈 공식 해제 및 큐 개방', type: 'freeze', version: 'UNLOCK', owner: 'CAB 위원회', risk: 'LOW', window: '18:00 KST', desc: '대기 중이던 14개 검증 완료 PR 순차 배포 재개' }] },
    { day: 16, isCurrentMonth: true, events: [] },
    { day: 17, isCurrentMonth: true, events: [] },
    { day: 18, isCurrentMonth: true, events: [{ id: 'r-6', title: 'v4.14.0 코어 엔진 메이저 릴리즈', type: 'release', version: 'v4.14.0', owner: '김태린 SRE', risk: 'HIGH', window: '11:00 ~ 12:30 KST', desc: '카나리 5% -> 25% -> 100% 단계적 트래픽 전환 배포' }] },
    { day: 19, isCurrentMonth: true, events: [] },
    { day: 20, isCurrentMonth: true, events: [{ id: 'm-3', title: 'KMS 마스터 암호화 키 정기 회전', type: 'migration', version: 'SEC-KMS', owner: '정보보안실', risk: 'MEDIUM', window: '04:00 ~ 04:30 KST', desc: 'FIPS 140-3 HSM 봉투 암호화 키 무중단 버전 갱신' }] },
    { day: 21, isCurrentMonth: true, events: [] },
  ];

  const activeDayObj = releaseDays.find((d) => d.day === selectedDay) || releaseDays[13];

  // ===========================================================================
  // 2. 글로벌 마케팅 캠페인 캘린더 (calendar-marketing-campaign) 상태
  // ===========================================================================
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('camp-1');
  const [copiedUtm, setCopiedUtm] = useState<boolean>(false);

  const campaigns = [
    {
      id: 'camp-1',
      name: 'KLIC Summit 2026 서울 키노트 & 엔터프라이즈 리드젠',
      channel: '브랜드 키노트 · 오프라인/라이브',
      period: '5월 04일 ~ 5월 15일 (2주간 집중)',
      startCol: 1,
      spanCols: 4,
      color: 'bg-blue-600 text-klic-on-emphasis',
      budget: '₩185,000,000',
      spendRate: 78,
      mqlTarget: '1,800 MQL',
      pipelineKrw: '₩3.2B 예상',
      utm: 'https://flux.kr/summit2026?utm_source=linkedin_kr&utm_medium=paid_exec&utm_campaign=summit_2026_q2',
      assets: ['키노트 데모 영상 (4K 승인완료)', '금융권 C-Level 초청장 PDF', '링크드인 스폰서드 캐러셀 6종'],
    },
    {
      id: 'camp-2',
      name: '금융보안원 망분리 규제 대응 백서(Whitepaper) 다운로드 캠페인',
      channel: '퍼포먼스 광고 · LinkedIn & Google Search',
      period: '5월 08일 ~ 5월 22일 (3주간 상시)',
      startCol: 2,
      spanCols: 4,
      color: 'bg-blue-600 text-klic-on-emphasis',
      budget: '₩64,000,000',
      spendRate: 62,
      mqlTarget: '950 MQL',
      pipelineKrw: '₩1.9B 예상',
      utm: 'https://flux.kr/whitepaper-fsec?utm_source=google_sem&utm_medium=cpc&utm_campaign=fsec_sovereign_wp',
      assets: ['2026 금융 망분리 아키텍처 백서 (42p)', '랜딩페이지 A/B 테스트 변형 #2', '세일즈포스 리드 스코어링 웹훅'],
    },
    {
      id: 'camp-3',
      name: '기존 고객 Enterprise -> Sovereign 에디션 업셀링 CRM 시퀀스',
      channel: 'CRM 자동화 · 임원 다이렉트 뉴스레터',
      period: '5월 14일 ~ 5월 28일',
      startCol: 3,
      spanCols: 3,
      color: 'bg-amber-400 text-zinc-900',
      budget: '₩18,000,000',
      spendRate: 45,
      mqlTarget: '420 SQL (직접 전환)',
      pipelineKrw: '₩2.4B 예상',
      utm: 'https://flux.kr/sovereign-upgrade?utm_source=hubspot_crm&utm_medium=email_vip&utm_campaign=q2_expansion',
      assets: ['맞춤형 ROI 절감 계산기 링크', '전담 TAM 1:1 아키텍처 세션 예약 위젯'],
    },
  ];

  const activeCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  // ===========================================================================
  // 3. 24/7 SRE 온콜 당직 로테이션 (calendar-oncall-rotation) 상태
  // ===========================================================================
  const [overrideApplied, setOverrideApplied] = useState<boolean>(false);
  const [selectedShiftEngineer, setSelectedShiftEngineer] = useState<string>('김태린 수석 SRE');

  // ===========================================================================
  // 4. 회의실 & QA 장비 리소스 타임그리드 예약 (calendar-resource-booking) 상태
  // ===========================================================================
  const [selectedResource, setSelectedResource] = useState<string>('res-1');
  const [selectedSlotHour, setSelectedSlotHour] = useState<number>(14);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  const resources = [
    {
      id: 'res-1',
      name: '38층 이사회 보드룸 A (Cisco Webex Panorama 8K)',
      category: '임원 화상 회의실',
      specs: '24인석 · 양방향 동시통역 부스 · 전자칠판 2대',
      status: '14:00 슬롯 예약 가능',
      bookedHours: [9, 10, 11, 15, 16],
    },
    {
      id: 'res-2',
      name: 'QA 모바일 디바이스 팜 Rack #04 (iPhone 16 Pro / Fold 6)',
      category: 'QA 실물 단말기 랙',
      specs: 'iOS 18.2 · Android 15 · Appium 원격 디버깅 연결됨 · 배터리 98%',
      status: '실시간 원격 점유 가능',
      bookedHours: [10, 11, 13, 17],
    },
    {
      id: 'res-3',
      name: 'NVIDIA H100 8-GPU 베어메탈 벤치마크 클러스터 #02',
      category: '추론/부하 테스트 장비',
      specs: '640GB HBM3 · InfiniBand 400Gbps · 단독 격리 노드',
      status: '14:00~16:00 유휴 구간',
      bookedHours: [9, 10, 11, 12, 16, 17],
    },
  ];

  // ===========================================================================
  // 5. 컴플라이언스 감사 & 인증서 만료 캘린더 (calendar-compliance-audit) 상태
  // ===========================================================================
  const [evidenceSynced, setEvidenceSynced] = useState<boolean>(false);

  const showRelease = activeTab === 'all-showcase' || activeTab === 'release-freeze';
  const showMarketing = activeTab === 'all-showcase' || activeTab === 'marketing-campaign';
  const showOncall = activeTab === 'all-showcase' || activeTab === 'oncall-rotation';
  const showBooking = activeTab === 'all-showcase' || activeTab === 'resource-booking';
  const showCompliance = activeTab === 'all-showcase' || activeTab === 'compliance-audit';

  return (
    <div className="space-y-6">
      {/* 상단 서브모드 스위처 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  rounded-[16px] p-1.5">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'all-showcase', label: '전체 5종 캘린더 쇼케이스', icon: Sparkles },
            { id: 'release-freeze', label: '1. 릴리즈 & 코드 프리즈', icon: ShieldAlert },
            { id: 'marketing-campaign', label: '2. 글로벌 마케팅 캠페인', icon: Megaphone },
            { id: 'oncall-rotation', label: '3. 24/7 SRE 온콜 당직표', icon: PhoneCall },
            { id: 'resource-booking', label: '4. 회의실·QA 디바이스 예약', icon: Building2 },
            { id: 'compliance-audit', label: '5. 보안 감사·인증서 만료일', icon: FileCheck2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as CalendarShowcaseMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[11px] text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white  text-zinc-900  shadow-2xs border border-zinc-200/80 '
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
          <span>Asia/Seoul (KST · UTC+9)</span>
          <span aria-hidden="true">·</span>
          <span>KLIC/calendar-suite</span>
        </div>
      </div>

      {/* =====================================================================
          1. 릴리즈 캘린더 & 코드 프리즈(Code Freeze) 커맨드 센터
      ===================================================================== */}
      {showRelease && (
        <section className="w-full rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
          {/* 상단 베젤 헤더 */}
          <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600 " />
              <span className="text-[13.5px] font-semibold text-zinc-900 ">
                프로덕션 릴리즈 트레인 & 반기 결산 코드 프리즈(Code Freeze) 통제 캘린더
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1 bg-white/80  p-0.5 rounded-lg border border-zinc-200/80 ">
              {[
                { id: 'all', label: '전체 일정 (8건)' },
                { id: 'release', label: '정기 릴리즈' },
                { id: 'freeze', label: '코드 프리즈 동결' },
                { id: 'migration', label: 'DB·인프라 점검' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setReleaseFilter(f.id as 'all' | 'release' | 'freeze' | 'migration')}
                  className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-all cursor-pointer ${
                    releaseFilter === f.id
                      ? 'bg-blue-600 text-klic-on-emphasis font-semibold shadow-2xs'
                      : 'text-klic-muted  hover:text-zinc-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className={`rounded-[14px] bg-white  border border-zinc-200/80  ${boxPad}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* 좌측 8컬럼: 인터랙티브 월간 릴리즈 캘린더 그리드 */}
              <div className="lg:col-span-8 space-y-3">
                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-mono font-semibold text-klic-muted">
                  {['월 (MON)', '화 (TUE)', '수 (WED)', '목 (THU)', '금 (FRI)', '토 (SAT)', '일 (SUN)'].map((d) => (
                    <div key={d} className="py-1.5 bg-zinc-50  rounded-lg border border-zinc-200/70 ">
                      {d}
                    </div>
                  ))}
                </div>

                {/* 21일(3주 핵심 구간) 고밀도 캘린더 그리드 */}
                <div className="grid grid-cols-7 gap-2">
                  {releaseDays.map((item) => {
                    const isSelected = selectedDay === item.day;
                    const visibleEvents = item.events.filter(
                      (ev) => releaseFilter === 'all' || ev.type === releaseFilter || (releaseFilter === 'freeze' && ev.type === 'hotfix')
                    );

                    return (
                      <button
                        key={item.day}
                        type="button"
                        onClick={() => setSelectedDay(item.day)}
                        className={`min-h-[96px] p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-blue-600 ring-2 ring-blue-500/15 bg-blue-50/40 '
                            : item.isFreeze
                            ? 'border-blue-200  bg-blue-50/40  hover:border-blue-300'
                            : 'border-zinc-200/80  bg-white  hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={`text-xs font-mono font-bold ${
                              item.isFreeze
                                ? 'text-blue-600 '
                                : isSelected
                                ? 'text-blue-600 '
                                : 'text-zinc-700 '
                            }`}
                          >
                            05.{String(item.day).padStart(2, '0')}
                          </span>
                          {item.isFreeze && <Lock className="w-3 h-3 text-blue-500" />}
                        </div>

                        {/* 이벤트 바 */}
                        <div className="space-y-1 mt-1.5 w-full">
                          {visibleEvents.map((ev) => (
                            <div
                              key={ev.id}
                              className={`px-1.5 py-1 rounded text-[10px] font-medium leading-tight truncate ${
                                ev.type === 'freeze'
                                  ? 'bg-blue-100 text-blue-800   font-bold border border-blue-200 '
                                  : ev.type === 'hotfix'
                                  ? 'bg-amber-100 text-amber-800   font-bold border border-amber-200 '
                                  : ev.type === 'migration'
                                  ? 'bg-blue-50 text-blue-700   border border-blue-200/70  font-semibold'
                                  : 'bg-blue-50 text-blue-700   border border-blue-200/70  font-semibold'
                              }`}
                            >
                              {ev.version}
                            </div>
                          ))}
                          {visibleEvents.length === 0 && (
                            <div className="text-[10px] font-mono text-klic-muted ">
                              배포 없음
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* 하단 코드 프리즈 배너 (클린 라이트 로즈 배너) */}
                <div className="p-3.5 rounded-xl bg-blue-50/70  border border-blue-200/80  text-blue-900  flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-600  shrink-0" />
                    <span className="font-semibold">5월 12일 ~ 5월 15일 (90시간): 상반기 재무 원장 마감 코드 프리즈 구간</span>
                  </div>
                  <span className="font-mono text-[11px] text-blue-700 ">
                    GitHub 병합 대기열 잠김 · CAB 긴급 핫픽스만 예외 허용
                  </span>
                </div>
              </div>

              {/* 우측 4컬럼: 선택 일자 배포 파이프라인 상세 & CAB 긴급 핫픽스 승인 콘솔 (클린 라이트 서피스) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-2xl bg-zinc-50/80  p-5 border border-zinc-200/80  space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-200/80  pb-3">
                    <div>
                      <div className="text-[10px] font-mono text-blue-600  font-bold">선택 날짜 상세</div>
                      <div className="text-sm font-bold text-zinc-900  mt-0.5">
                        2026년 5월 {activeDayObj.day}일 배포 런북 상세
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold border ${
                        activeDayObj.isFreeze
                          ? 'bg-blue-50  text-blue-700  border-blue-200 '
                          : 'bg-blue-50  text-blue-700  border-blue-200 '
                      }`}
                    >
                      {activeDayObj.isFreeze ? "코드 동결" : "배포 가능 시간"}
                    </span>
                  </div>

                  {activeDayObj.events.length > 0 ? (
                    activeDayObj.events.map((ev) => (
                      <div key={ev.id} className="p-4 rounded-xl bg-white  border border-zinc-200/80  space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-blue-600  font-bold">{ev.version}</span>
                          <span className="text-klic-muted">{ev.window}</span>
                        </div>
                        <div className="text-[13px] font-bold text-zinc-900 ">{ev.title}</div>
                        <p className="text-xs text-klic-muted  leading-relaxed">{ev.desc}</p>
                        <div className="pt-2 border-t border-zinc-100  flex items-center justify-between text-[11px] font-mono text-klic-muted">
                          <span>담당: {ev.owner}</span>
                          <span className="text-amber-600  font-semibold">위험도: {{ LOW: '낮음', MEDIUM: '보통', HIGH: '높음', LOCKED: '동결됨' }[ev.risk]}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-white  border border-zinc-200/80  text-xs text-klic-muted">
                      선택된 날짜(5월 {activeDayObj.day}일)에는 예정된 프로덕션 릴리즈가 없습니다. 신규 릴리즈 슬롯을 예약할 수 있습니다.
                    </div>
                  )}

                  {/* CAB Break-Glass 긴급 예외 승인 시뮬레이터 */}
                  <div className="p-3.5 rounded-xl bg-white  border border-zinc-200/80  space-y-2.5 shadow-2xs">
                    <div className="text-xs font-bold text-zinc-900  flex items-center justify-between">
                      <span>CAB 긴급 핫픽스 예외 승인 (Break-Glass)</span>
                      <span className="text-[10px] font-mono text-amber-600  font-semibold">2인 결재 필수</span>
                    </div>
                    <div className="text-[11.5px] text-klic-muted  leading-relaxed">
                      코드 프리즈 기간 중 SEV-1 장애 복구를 위해 GitHub `main` 브랜치 잠금을 30분간 일시 해제합니다.
                    </div>
                    <button
                      type="button"
                      onClick={() => setCabOverrideApproved(!cabOverrideApproved)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        cabOverrideApproved
                          ? 'bg-blue-600 text-klic-on-emphasis'
                          : 'bg-blue-600 hover:bg-blue-500 text-klic-on-emphasis'
                      }`}
                    >
                      {cabOverrideApproved ? (
                        <>
                          <Unlock className="w-3.5 h-3.5" />
                          <span>CAB 예외 승인 완료 (30분간 핫픽스 배포 허용됨)</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>CTO · CISO 긴급 Break-Glass 예외 승인 요청</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          2. 글로벌 옴니채널 마케팅 캠페인 & 에셋 론칭 캘린더 (calendar-marketing-campaign)
      ===================================================================== */}
      {showMarketing && (
        <section className="w-full rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
          <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-600 " />
              <span className="text-[13.5px] font-semibold text-zinc-900 ">
                글로벌 GTM 마케팅 캠페인 멀티주간 타임라인 및 파이프라인(MQL/SQL) 성과 캘린더
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-white  border border-zinc-200/80  font-mono text-[11px] text-zinc-700 ">
                5월 총 캠페인 예산: <strong>₩267,000,000</strong>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50  border border-blue-200  font-mono text-[11px] text-blue-700  font-semibold">
                목표 파이프라인: ₩7.5B (SQL 420건)
              </span>
            </div>
          </div>

          <div className={`rounded-[14px] bg-white  border border-zinc-200/80  ${boxPad}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* 좌측 7컬럼: 주간 스패닝 캠페인 캘린더 보드 */}
              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-2xl border border-zinc-200/80  p-4 bg-zinc-50/50  space-y-3">
                  <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-mono text-klic-muted pb-2 border-b border-zinc-200 ">
                    <div>W1 (05.01~07)</div>
                    <div>W2 (05.08~14)</div>
                    <div>W3 (05.15~21)</div>
                    <div>W4 (05.22~28)</div>
                    <div>W5 (05.29~31)</div>
                  </div>

                  {/* 스패닝 캠페인 바 */}
                  <div className="space-y-3 pt-1">
                    {campaigns.map((camp) => {
                      const active = selectedCampaignId === camp.id;
                      return (
                        <button
                          key={camp.id}
                          type="button"
                          onClick={() => setSelectedCampaignId(camp.id)}
                          className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            active
                              ? 'border-blue-500 bg-white  shadow-2xs ring-2 ring-blue-500/15'
                              : 'border-zinc-200/80  bg-white/80  hover:border-zinc-300'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <span className="text-[12.5px] font-semibold text-zinc-900 ">
                              {camp.name}
                            </span>
                            <span className="text-[11px] font-mono text-blue-600  font-semibold">
                              {camp.pipelineKrw}
                            </span>
                          </div>

                          {/* 5주 스패닝 간트 바 */}
                          <div className="grid grid-cols-5 gap-1.5 h-6 bg-zinc-100  rounded-lg p-1">
                            {Array.from({ length: 5 }).map((_, wIdx) => {
                              const inRange =
                                wIdx + 1 >= camp.startCol && wIdx + 1 < camp.startCol + camp.spanCols;
                              return (
                                <div
                                  key={wIdx}
                                  className={`rounded ${inRange ? camp.color : 'bg-transparent'}`}
                                />
                              );
                            })}
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-klic-muted font-mono mt-2">
                            <span>{camp.channel}</span>
                            <span>{camp.period}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 우측 5컬럼: 선택 캠페인 에셋 준비도 & UTM 트래킹 빌더 */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-zinc-200/80  bg-zinc-50/70  p-5 space-y-4">
                  <div>
                    <div className="text-[10px] font-mono text-blue-600  font-bold">
                      캠페인 기여도 및 제작물
                    </div>
                    <div className="text-sm font-bold text-zinc-900  mt-0.5">
                      {activeCampaign.name}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-white  border border-zinc-200/70 ">
                      <div className="text-[10px] text-klic-muted">배정 예산</div>
                      <div className="font-bold text-zinc-900  mt-0.5">{activeCampaign.budget}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white  border border-zinc-200/70 ">
                      <div className="text-[10px] text-klic-muted">목표 리드</div>
                      <div className="font-bold text-blue-600  mt-0.5">{activeCampaign.mqlTarget}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white  border border-zinc-200/70 ">
                      <div className="text-[10px] text-klic-muted">예산 소진율</div>
                      <div className="font-bold text-blue-600 mt-0.5">{activeCampaign.spendRate}%</div>
                    </div>
                  </div>

                  {/* 크리에이티브 에셋 체크리스트 */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-zinc-800 ">연결된 크리에이티브 에셋 승인 현황</div>
                    {activeCampaign.assets.map((asset, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 rounded-xl bg-white  border border-zinc-200/70  flex items-center justify-between text-xs"
                      >
                        <span className="text-zinc-700 ">{asset}</span>
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      </div>
                    ))}
                  </div>

                  {/* UTM 트래킹 URL 복사 (클린 라이트 서피스) */}
                  <div className="p-3 rounded-xl bg-blue-50/50  border border-blue-200/70  font-mono text-[11px] space-y-1.5">
                    <div className="flex items-center justify-between text-klic-muted ">
                      <span className="font-semibold text-blue-700 ">UTM 기여도 추적 링크</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCopiedUtm(true);
                          setTimeout(() => setCopiedUtm(false), 1500);
                        }}
                        className="px-2 py-0.5 rounded bg-white  border border-blue-200  text-blue-600  flex items-center gap-1 cursor-pointer"
                      >
                        {copiedUtm ? <Check className="w-3 h-3 text-blue-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedUtm ? '복사됨' : 'UTM 복사'}</span>
                      </button>
                    </div>
                    <div className="truncate text-zinc-800 ">{activeCampaign.utm}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          3. 24/7 SRE 온콜 당직 로테이션 & 에스컬레이션 매트릭스 (calendar-oncall-rotation)
      ===================================================================== */}
      {showOncall && (
        <section className="w-full rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
          <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-blue-600 " />
              <span className="text-[13.5px] font-semibold text-zinc-900 ">
                24/7 글로벌 SRE 온콜(On-Call) 교대 타임라인 및 긴급 당직 대타(Override) 스케줄러
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-blue-600  font-semibold">
                ● 당직 공백(Gap) 0시간 · 100% 커버리지
              </span>
              <button
                type="button"
                onClick={() => setOverrideApplied(!overrideApplied)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-klic-on-emphasis text-[11.5px] font-semibold cursor-pointer shadow-2xs"
              >
                {overrideApplied ? '✓ 금요일 야간 대타(Override) 반영됨' : '+ 긴급 당직 교대(Override) 시뮬레이션'}
              </button>
            </div>
          </div>

          <div className={`rounded-[14px] bg-white  border border-zinc-200/80  ${boxPad}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* 좌측 8컬럼: 멀티 레이어 주간 온콜 시프트 타임라인 (클린 라이트 서피스) */}
              <div className="lg:col-span-8 space-y-3">
                <div className="rounded-2xl bg-zinc-50/80  p-5 border border-zinc-200/80  space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-klic-muted  font-semibold">주간 근무표 (월~일 168시간 연속 관제)</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50  border border-blue-200  text-blue-700  font-semibold">
                      현재 당직: {selectedShiftEngineer} (응답 SLA 3분 이내)
                    </span>
                  </div>

                  {/* 레이어 1: Primary */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-mono text-klic-muted font-semibold">1단계 · 주 담당 SRE (1차 호출 대상)</div>
                    <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                      {[
                        { day: '월', eng: '김태린 SRE', style: 'bg-blue-50  border-blue-200  text-blue-800 ' },
                        { day: '화', eng: '김태린 SRE', style: 'bg-blue-50  border-blue-200  text-blue-800 ' },
                        { day: '수', eng: '박준형 DBA', style: 'bg-blue-50  border-blue-200  text-blue-800 ' },
                        { day: '목', eng: '박준형 DBA', style: 'bg-blue-50  border-blue-200  text-blue-800 ' },
                        {
                          day: '금',
                          eng: overrideApplied ? '최윤성 (대타)' : '김태린 SRE',
                          style: overrideApplied
                            ? 'bg-amber-50  border-amber-300  text-amber-900  ring-2 ring-amber-400/30'
                            : 'bg-blue-50  border-blue-200  text-blue-800 ',
                        },
                        { day: '토', eng: '이수현 SRE', style: 'bg-blue-50  border-blue-200  text-blue-800 ' },
                        { day: '일', eng: '이수현 SRE', style: 'bg-blue-50  border-blue-200  text-blue-800 ' },
                      ].map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedShiftEngineer(s.eng)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${s.style}`}
                        >
                          <div className="text-[10px] font-mono opacity-75">{s.day}요일 24h</div>
                          <div className="text-xs font-bold truncate mt-0.5">{s.eng}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 레이어 2: Secondary Backup */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-mono text-klic-muted font-semibold">2단계 · 예비 담당자 (5분 미응답 시 자동 승계)</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="p-3 rounded-xl bg-white  border border-zinc-200/80  text-xs">
                        <div className="text-[10px] font-mono text-klic-muted">월 ~ 수 (72h)</div>
                        <div className="font-semibold text-zinc-900  mt-0.5">최윤성 인프라 리드</div>
                      </div>
                      <div className="p-3 rounded-xl bg-white  border border-zinc-200/80  text-xs">
                        <div className="text-[10px] font-mono text-klic-muted">목 ~ 금 (48h)</div>
                        <div className="font-semibold text-zinc-900  mt-0.5">정민호 플랫폼 아키텍트</div>
                      </div>
                      <div className="p-3 rounded-xl bg-white  border border-zinc-200/80  text-xs">
                        <div className="text-[10px] font-mono text-klic-muted">토 ~ 일 주말 (48h)</div>
                        <div className="font-semibold text-zinc-900  mt-0.5">강도원 보안 총괄</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 우측 4컬럼: 에스컬레이션 트리 */}
              <div className="lg:col-span-4">
                <div className="rounded-2xl border border-zinc-200/80  p-5 bg-zinc-50/70  space-y-3">
                  <div className="text-xs font-bold text-zinc-900 ">
                    SEV-1 장애 에스컬레이션 정책 (자동 호출 트리)
                  </div>
                  {[
                    { min: '즉시 (0분)', target: `1차 Primary: ${selectedShiftEngineer}`, action: 'PagerDuty 앱 푸시 + 자동 음성 전화 발신' },
                    { min: '5분 경과', target: '2차 Secondary: 최윤성 인프라 리드', action: '1차 당직자 미ACK 시 자동 페일오버 호출' },
                    { min: '15분 경과', target: '3차 Incident Commander (CTO 직속)', action: 'Slack #war-room-sev1 자동 개설 및 전사 공지' },
                  ].map((esc, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white  border border-zinc-200/80  space-y-1 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-blue-600  font-bold">{esc.min}</span>
                        <span className="text-klic-muted">단계 0{idx + 1}</span>
                      </div>
                      <div className="text-xs font-semibold text-zinc-900 ">{esc.target}</div>
                      <div className="text-[11px] text-klic-muted">{esc.action}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          4. 회의실 & QA 장비 리소스 타임그리드 예약 스케줄러 (calendar-resource-booking)
      ===================================================================== */}
      {showBooking && (
        <section className="w-full rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
          <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600 " />
              <span className="text-[13.5px] font-semibold text-zinc-900 ">
                임원 화상 보드룸 · QA 실물 모바일 디바이스 팜 · GPU 벤치마크 장비 타임슬롯 스케줄러
              </span>
            </div>

            <span className="text-[11.5px] text-klic-muted">
              빈 시간대(유휴 슬롯) 클릭 시 즉시 점유 예약 가능
            </span>
          </div>

          <div className={`rounded-[14px] bg-white  border border-zinc-200/80  ${boxPad} space-y-4`}>
            {/* 시간대 헤더 (09:00 ~ 18:00) */}
            <div className="overflow-x-auto">
              <div className="min-w-[760px] space-y-2.5">
                <div className="grid grid-cols-12 gap-2 text-[11px] font-mono text-klic-muted px-2">
                  <div className="col-span-3 font-semibold">공유 리소스 / 하드웨어 스펙</div>
                  {[9, 10, 11, 12, 13, 14, 15, 16, 17].map((h) => (
                    <div key={h} className="text-center font-bold">
                      {h}:00
                    </div>
                  ))}
                </div>

                {resources.map((res) => {
                  const isActiveRes = selectedResource === res.id;
                  return (
                    <div
                      key={res.id}
                      className={`grid grid-cols-12 gap-2 items-center p-3 rounded-2xl border transition-all ${
                        isActiveRes
                          ? 'border-blue-500/80 bg-blue-50/30 '
                          : 'border-zinc-200/80  bg-zinc-50/50 '
                      }`}
                    >
                      <div className="col-span-3 pr-2">
                        <div className="text-[10px] font-mono text-blue-600  font-semibold">
                          {res.category}
                        </div>
                        <div className="text-xs font-bold text-zinc-900  leading-snug">
                          {res.name}
                        </div>
                        <div className="text-[10px] text-klic-muted truncate mt-0.5">{res.specs}</div>
                      </div>

                      {[9, 10, 11, 12, 13, 14, 15, 16, 17].map((hour) => {
                        const isBooked = res.bookedHours.includes(hour);
                        const isSelectedSlot = selectedResource === res.id && selectedSlotHour === hour;
                        return (
                          <button
                            key={hour}
                            type="button"
                            disabled={isBooked}
                            onClick={() => {
                              setSelectedResource(res.id);
                              setSelectedSlotHour(hour);
                              setBookingConfirmed(false);
                            }}
                            className={`h-11 rounded-xl text-[10px] font-mono font-bold transition-all flex flex-col items-center justify-center ${
                              isBooked
                                ? 'bg-zinc-200/70  text-klic-muted cursor-not-allowed'
                                : isSelectedSlot
                                ? 'bg-blue-600 text-klic-on-emphasis shadow-sm cursor-pointer'
                                : 'bg-blue-50 hover:bg-blue-100/80  text-blue-700  border border-blue-200  cursor-pointer'
                            }`}
                          >
                            <span>{isBooked ? '점유중' : isSelectedSlot ? '선택됨' : '예약가능'}</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 하단 즉시 예약 바 (클린 라이트 서피스) */}
            <div className="p-4 rounded-2xl bg-blue-50/45  border border-blue-200/70  flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs">
                <span className="text-klic-muted font-mono">선택된 리소스 슬롯: </span>
                <span className="font-bold text-blue-700 ">
                  {resources.find((r) => r.id === selectedResource)?.name} · {selectedSlotHour}:00 ~ {selectedSlotHour + 1}:00 KST
                </span>
              </div>
              <button
                type="button"
                onClick={() => setBookingConfirmed(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-klic-on-emphasis text-xs font-semibold shadow-2xs cursor-pointer"
              >
                {bookingConfirmed
                  ? '✓ Google Calendar 초대장 및 장비 점유 토큰 발급 완료'
                  : '선택 슬롯 즉시 예약 및 잠금 토큰 발급'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          5. 연간 보안 컴플라이언스 감사(SOC2 / ISMS-P) & 인증서 만료 캘린더 (calendar-compliance-audit)
      ===================================================================== */}
      {showCompliance && (
        <section className="w-full rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
          <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-600 " />
              <span className="text-[13.5px] font-semibold text-zinc-900 ">
                금융보안원 ISMS-P · SOC2 Type II 정기 심사 일정 및 SSL/mTLS 인증서 만료 D-Day 캘린더
              </span>
            </div>

            <button
              type="button"
              onClick={() => setEvidenceSynced(true)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-klic-on-emphasis text-[11.5px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{evidenceSynced ? '148/148 감사 증적 스냅샷 수집 완료 (100%)' : '누락 증적 6건 자동 수집 & 인증서 갱신'}</span>
            </button>
          </div>

          <div className={`rounded-[14px] bg-white  border border-zinc-200/80  ${boxPad}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  dday: 'D-12',
                  date: '2026.05.18',
                  title: '*.flux-enterprise.kr Wildcard mTLS 인증서 갱신',
                  authority: 'AWS Certificate Manager · DigiCert',
                  progress: evidenceSynced ? 100 : 88,
                  status: evidenceSynced ? '자동 갱신 예약 완료' : '교체 리허설 필요',
                  urgent: !evidenceSynced,
                },
                {
                  dday: 'D-26',
                  date: '2026.06.01',
                  title: '금융보안원 ISMS-P 2026년도 사후심사 현장 실사',
                  authority: '금융보안원 (FSEC) · 102개 통제항목',
                  progress: evidenceSynced ? 100 : 94,
                  status: '망분리·접근통제 증적 완료',
                  urgent: false,
                },
                {
                  dday: 'D-45',
                  date: '2026.06.20',
                  title: 'AICPA SOC2 Type II 보안성·가용성 정기 감사',
                  authority: 'Deloitte 안진회계법인 외부감사',
                  progress: 97,
                  status: 'WORM 감사로그 무결성 통과',
                  urgent: false,
                },
                {
                  dday: 'D-68',
                  date: '2026.07.15',
                  title: '2분기 장기 미접속 휴면계정 및 PII 암호화 키 파기',
                  authority: '개인정보보호위원회 정기 실태점검',
                  progress: 100,
                  status: '자동 파기 배치 스크립트 검증됨',
                  urgent: false,
                },
              ].map((audit, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border flex flex-col justify-between space-y-4 ${
                    audit.urgent
                      ? 'border-blue-300  bg-blue-50/30 '
                      : 'border-zinc-200/80  bg-zinc-50/60 '
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className={`font-bold ${audit.urgent ? 'text-blue-600 ' : 'text-blue-600 '}`}>
                        {audit.dday} · {audit.date}
                      </span>
                      <span className="text-klic-muted">증적 {audit.progress}%</span>
                    </div>
                    <div className="text-[13px] font-semibold text-zinc-900  leading-snug">
                      {audit.title}
                    </div>
                    <div className="text-[11px] text-klic-muted mt-1">{audit.authority}</div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="w-full h-2 bg-zinc-200/80  rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          audit.progress === 100 ? 'bg-blue-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${audit.progress}%` }}
                      />
                    </div>
                    <div className="text-[11px] font-mono text-klic-muted  flex items-center justify-between">
                      <span>{audit.status}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
