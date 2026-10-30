import { PersonAvatar } from '../PersonAvatar';
import React, { useState } from 'react';
import {
  Clock,
  Video,
  CheckCircle2,
  AlertTriangle,
  Users,
  Globe,
  Play,
  Pause,
  Plus,
  Calendar,
  Sparkles,
  Check,
  ShieldAlert,
  RefreshCw,
  ArrowRight,
  Terminal,
  Coffee,
  Headphones,
  Database,
  Server,
} from 'lucide-react';

const AVATARS = {
  a1: './placeholders/avatar-576a55580552.svg',
  a2: './placeholders/avatar-d36430bc2634.svg',
  a3: './placeholders/avatar-ef94a3ac14b1.svg',
  a4: './placeholders/avatar-352373979408.svg',
  a5: './placeholders/avatar-d81ac24457b6.svg',
  a6: './placeholders/avatar-f0911aecec62.svg',
  a7: './placeholders/avatar-8c2580aea9a4.svg',
  a8: './placeholders/avatar-932f878a6ef4.svg',
};

/* ============================================================================
 * 2. 팀 일일 스탠드업 & 타임블록 일정표 (KLIC/schedule-1)
 * ========================================================================== */
interface TimeBlockItem {
  id: string;
  startTime: string;
  endTime: string;
  durationMin: number;
  title: string;
  category: 'standup' | 'focus' | 'review' | 'sync' | 'break';
  roomOrLink?: string;
  participants: { name: string; avatar: string }[];
  notes: string;
  completed: boolean;
}

const INITIAL_AGENDA_BLOCKS: TimeBlockItem[] = [
  {
    id: 'tb-1',
    startTime: '09:30',
    endTime: '09:50',
    durationMin: 20,
    title: '코어 플랫폼 스쿼드 일일 스탠드업 (Daily Standup)',
    category: 'standup',
    roomOrLink: 'Meet · core-standup-kr',
    participants: [
      { name: '이하은', avatar: AVATARS.a1 },
      { name: '박준영', avatar: AVATARS.a2 },
      { name: '정유진', avatar: AVATARS.a3 },
      { name: '강태우', avatar: AVATARS.a4 },
    ],
    notes: '어제 배포된 v2.4 결제 웹훅 재시도 큐 모니터링 결과 공유 및 당일 블로커 점검',
    completed: true,
  },
  {
    id: 'tb-2',
    startTime: '10:00',
    endTime: '12:00',
    durationMin: 120,
    title: '집중 코딩 블록 (Deep Work): 멀티 리전 토큰 검증 캐시 계층 구현',
    category: 'focus',
    roomOrLink: '슬랙 방해금지 모드 자동 활성화',
    participants: [{ name: '박준영', avatar: AVATARS.a2 }],
    notes: 'PR #1428 Redis Cluster 파이프라인 최적화 및 로컬 벤치마크 테스트 작성',
    completed: false,
  },
  {
    id: 'tb-3',
    startTime: '13:30',
    endTime: '14:15',
    durationMin: 45,
    title: 'PR 코드 리뷰 & 보안 아키텍처 페어 세션',
    category: 'review',
    roomOrLink: 'GitHub PR #1422 · 6층 대회의실 B',
    participants: [
      { name: '박준영', avatar: AVATARS.a2 },
      { name: '이하은', avatar: AVATARS.a1 },
      { name: '최수빈', avatar: AVATARS.a5 },
    ],
    notes: 'RBAC 세분화 권한 매트릭스 스키마 변경점 및 Zero-downtime 마이그레이션 검증',
    completed: false,
  },
  {
    id: 'tb-4',
    startTime: '15:00',
    endTime: '16:00',
    durationMin: 60,
    title: '2026 Q4 디자인 시스템(KLIC) 토큰 동기화 싱크',
    category: 'sync',
    roomOrLink: 'Figma Live · Meet #design-eng',
    participants: [
      { name: '정유진', avatar: AVATARS.a3 },
      { name: '강태우', avatar: AVATARS.a4 },
      { name: '한소윤', avatar: AVATARS.a7 },
    ],
    notes: '다크 모드 대비율(WCAG AA) 검증 및 타임라인/간트 컴포넌트 변수 표준화',
    completed: false,
  },
  {
    id: 'tb-5',
    startTime: '16:30',
    endTime: '18:00',
    durationMin: 90,
    title: '집중 코딩 블록 (Focus Time): 스테이징 카나리 배포 및 부하 검증',
    category: 'focus',
    roomOrLink: 'Grafana 대시보드 #canary-stage',
    participants: [
      { name: '박준영', avatar: AVATARS.a2 },
      { name: '임성진', avatar: AVATARS.a6 },
    ],
    notes: '초당 12,000건(RPS) 합성 트래픽 주입 후 p99 지연율 45ms 이하 유지 확인',
    completed: false,
  },
];

export const DailyAgendaScheduleView: React.FC = () => {
  const [blocks, setBlocks] = useState<TimeBlockItem[]>(INITIAL_AGENDA_BLOCKS);
  const [filterCat, setFilterCat] = useState<string>('all');
  const [joinedId, setJoinedId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('14:30');
  const [isAdding, setIsAdding] = useState(false);

  const filtered = blocks.filter((b) =>
    filterCat === 'all' ? true : b.category === filterCat
  );

  const handleToggleComplete = (id: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, completed: !b.completed } : b))
    );
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setBlocks((prev) => [
      ...prev,
      {
        id: `tb-${Date.now()}`,
        startTime: newTime,
        endTime: '15:00',
        durationMin: 30,
        title: newTitle.trim(),
        category: 'sync',
        roomOrLink: 'Meet · instant-sync',
        participants: [{ name: '박준영', avatar: AVATARS.a2 }],
        notes: '신규 등록된 타임블록 세션입니다.',
        completed: false,
      },
    ]);
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="p-6 space-y-6 bg-white ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 ">
        <div>
          <div className="flex items-center gap-2 text-xs text-klic-muted  mb-1">
            <span>엔지니어링 워크스페이스</span>
            <span>·</span>
            <span>타임블록 & 일일 스탠드업</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 ">
            팀 일일 스탠드업 & 타임블록 일정표
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-100 ">
            {[
              { id: 'all', label: '전체 블록 (5)' },
              { id: 'focus', label: '집중 코딩 (3.5h)' },
              { id: 'standup', label: '스탠드업' },
              { id: 'review', label: '코드 리뷰' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterCat(tab.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterCat === tab.id
                    ? 'bg-white  text-zinc-900  shadow-2xs'
                    : 'text-klic-muted  hover:text-zinc-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsAdding((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-klic-inverse  text-klic-on-emphasis  hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            타임블록 추가
          </button>
        </div>
      </div>

      {isAdding && (
        <form
          onSubmit={handleAddBlock}
          className="p-4 rounded-xl bg-zinc-50  border border-zinc-200  flex flex-wrap items-center gap-3"
        >
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-300  bg-white "
          />
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="타임블록 또는 미팅 제목 입력..."
            className="flex-1 min-w-[220px] px-3 py-1.5 text-xs rounded-lg border border-zinc-300  bg-white "
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-klic-on-emphasis hover:bg-blue-500"
          >
            저장
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((item) => {
            const isFocus = item.category === 'focus';
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  item.completed
                    ? 'bg-zinc-50/70  border-zinc-200/80  opacity-75'
                    : isFocus
                    ? 'bg-blue-50/35  border-blue-200/80 '
                    : 'bg-white  border-zinc-200 '
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <button
                      onClick={() => handleToggleComplete(item.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        item.completed
                          ? 'bg-klic-inverse border-zinc-900 text-klic-on-emphasis   '
                          : 'border-zinc-300  hover:border-zinc-500'
                      }`}
                    >
                      {item.completed && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-klic-muted  font-mono">
                        <span className="font-semibold text-zinc-800 ">
                          {item.startTime} – {item.endTime}
                        </span>
                        <span>·</span>
                        <span>{item.durationMin}분</span>
                        {item.roomOrLink && (
                          <>
                            <span>·</span>
                            <span className="font-sans text-klic-muted ">
                              {item.roomOrLink}
                            </span>
                          </>
                        )}
                      </div>
                      <h4
                        className={`text-sm font-semibold mt-1 ${
                          item.completed
                            ? 'line-through text-klic-muted'
                            : 'text-zinc-900 '
                        }`}
                      >
                        {item.title}
                      </h4>
                      <p className="text-xs text-klic-muted  mt-1">
                        {item.notes}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex -space-x-1.5">
                      {item.participants.map((p, idx) => (
                        <PersonAvatar
                          key={idx}
                          src={p.avatar}
                          alt={p.name}
                          title={p.name}
                          className="w-6 h-6 rounded-full object-cover ring-2 ring-white "
                        />
                      ))}
                    </div>
                    {item.category !== 'focus' && (
                      <button
                        onClick={() =>
                          setJoinedId(joinedId === item.id ? null : item.id)
                        }
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          joinedId === item.id
                            ? 'bg-blue-600 border-blue-600 text-klic-on-emphasis'
                            : 'bg-white  border-zinc-200  text-zinc-700  hover:bg-zinc-50'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        {joinedId === item.id ? '접속 중' : '화상 입장'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 우측: 일일 스탠드업 체크인 요약 */}
        <div className="p-5 rounded-xl bg-zinc-50  border border-zinc-200  space-y-4 h-fit">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-klic-muted">
              비동기 스탠드업 요약
            </span>
            <span className="text-xs text-blue-600  font-medium">
              4/4명 제출 완료
            </span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-white  border border-zinc-200/80 ">
              <div className="font-semibold text-zinc-900  mb-1">
                어제 완료한 작업
              </div>
              <p className="text-klic-muted  leading-relaxed">
                • 결제 정산 데드레터 큐(DLQ) 자동 복구 워커 배포 완료
                <br />• KLIC 에이전트 라이프사이클 테이블 QA 승인
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white  border border-zinc-200/80 ">
              <div className="font-semibold text-zinc-900  mb-1">
                오늘 집중 목표
              </div>
              <p className="text-klic-muted  leading-relaxed">
                • 멀티 리전 토큰 캐시 히트율 94% → 98.5% 개선
                <br />• 오후 2시 디자인 시스템 토큰 리뷰 완료
              </p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50/70  border border-amber-200 ">
              <div className="font-semibold text-amber-900  mb-1">
                현재 블로커 · 지원 요청
              </div>
              <p className="text-amber-800  leading-relaxed">
                • 스테이징 샌드박스 DB 마이그레이션 승인 대기 중 (DBA 팀 확인 필요)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 3. 기술 면접관 가용 시간 조율 스케줄러 (KLIC/schedule-2)
 * ========================================================================== */
const INTERVIEWERS = [
  {
    id: 'iv-1',
    name: '박준영',
    role: "수석 프런트엔드 엔지니어",
    avatar: AVATARS.a2,
    busySlots: [1, 4],
  },
  {
    id: 'iv-2',
    name: '이하은',
    role: "책임 SRE 아키텍트",
    avatar: AVATARS.a1,
    busySlots: [0, 4],
  },
  {
    id: 'iv-3',
    name: '정유진',
    role: "엔지니어링 관리자",
    avatar: AVATARS.a3,
    busySlots: [0, 1],
  },
  {
    id: 'iv-4',
    name: '강태우',
    role: "수석 프로덕트 디자이너",
    avatar: AVATARS.a4,
    busySlots: [3],
  },
];

const TIME_SLOTS = [
  { idx: 0, label: '10:00 - 11:00', period: '오전' },
  { idx: 1, label: '11:00 - 12:00', period: '오전' },
  { idx: 2, label: '14:00 - 15:00', period: '오후 (최적 공통)' },
  { idx: 3, label: '15:30 - 16:30', period: '오후' },
  { idx: 4, label: '16:30 - 17:30', period: '오후' },
  { idx: 5, label: '17:30 - 18:30', period: '오후 (최적 공통)' },
];

export const InterviewSlotSchedulerView: React.FC = () => {
  const [selectedSlot, setSelectedSlot] = useState<number>(2);
  const [duration, setDuration] = useState<'45분' | '60분' | '90분'>('60분');
  const [sentInvite, setSentInvite] = useState(false);

  return (
    <div className="p-6 space-y-6 bg-white ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 ">
        <div>
          <div className="flex items-center gap-2 text-xs text-klic-muted  mb-1">
            <span>채용 파이프라인 (ATS)</span>
            <span>·</span>
            <span>지원자: 김도윤 (선임 프런트엔드 엔지니어)</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 ">
            기술 면접관 가용 시간 자동 조율 스케줄러
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-100 ">
            {(['45분', '60분', '90분'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                  duration === d
                    ? 'bg-white  text-zinc-900  shadow-2xs'
                    : 'text-klic-muted '
                }`}
              >
                {d} 세션
              </button>
            ))}
          </div>
          <button
            onClick={() => setSentInvite(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-klic-inverse  text-klic-on-emphasis  hover:opacity-90"
          >
            {sentInvite ? '초대장 발송 완료 ✓' : '선택 슬롯으로 면접 확정 발송'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-zinc-200  rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50  border-b border-zinc-200  text-xs text-klic-muted">
              <th className="py-3 px-4 font-semibold min-w-[210px]">
                면접관 패널 (4명)
              </th>
              {TIME_SLOTS.map((slot) => {
                const isOptimal = slot.idx === 2 || slot.idx === 5;
                return (
                  <th
                    key={slot.idx}
                    onClick={() => setSelectedSlot(slot.idx)}
                    className={`py-3 px-3 font-mono text-center cursor-pointer transition-colors ${
                      selectedSlot === slot.idx
                        ? 'bg-klic-inverse text-klic-on-emphasis  '
                        : isOptimal
                        ? 'bg-blue-50/70  text-blue-800 '
                        : ''
                    }`}
                  >
                    <div>{slot.label}</div>
                    <div className="text-[10px] font-sans opacity-80 mt-0.5">
                      {slot.period}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200  text-xs">
            {INTERVIEWERS.map((iv) => (
              <tr key={iv.id}>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <PersonAvatar
                      src={iv.avatar}
                      alt={iv.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-zinc-900 ">
                        {iv.name}
                      </div>
                      <div className="text-[11px] text-klic-muted">{iv.role}</div>
                    </div>
                  </div>
                </td>
                {TIME_SLOTS.map((slot) => {
                  const isBusy = iv.busySlots.includes(slot.idx);
                  const isSelected = selectedSlot === slot.idx;
                  return (
                    <td
                      key={slot.idx}
                      onClick={() => !isBusy && setSelectedSlot(slot.idx)}
                      className={`p-2 text-center cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-100/80 '
                          : ''
                      }`}
                    >
                      {isBusy ? (
                        <div className="py-2 px-2 rounded-lg bg-zinc-100  text-klic-muted border border-dashed border-zinc-300 ">
                          기존 일정 있음
                        </div>
                      ) : (
                        <div
                          className={`py-2 px-2 rounded-lg font-medium border ${
                            isSelected
                              ? 'bg-klic-inverse text-klic-on-emphasis border-zinc-900  '
                              : 'bg-blue-50/60  text-blue-700  border-blue-200 '
                          }`}
                        >
                          참석 가능
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ============================================================================
 * 4. 글로벌 리전별 정기 점검 스케줄 보드 (KLIC/schedule-3)
 * ========================================================================== */
const REGION_WINDOWS = [
  {
    id: 'rw-1',
    region: 'AP-Northeast-2 (서울 메인)',
    tz: 'KST (UTC+9)',
    windowKst: '02:00 – 04:00',
    mode: '무중단 롤링 패치 (Zero-Downtime)',
    service: '핵심 결제 게이트웨이 및 원장 데이터베이스',
    commander: '이하은',
    avatar: AVATARS.a1,
    status: '정상 대기',
    progress: 0,
  },
  {
    id: 'rw-2',
    region: 'AP-Northeast-1 (도쿄 엣지)',
    tz: 'JST (UTC+9)',
    windowKst: '03:00 – 04:30',
    mode: '읽기 전용 전환 (Read-Only 15분)',
    service: 'PostgreSQL 16.4 보안 커널 업그레이드',
    commander: '임성진',
    avatar: AVATARS.a6,
    status: '트래픽 드레인 중',
    progress: 65,
  },
  {
    id: 'rw-3',
    region: 'EU-Central-1 (프랑크푸르트)',
    tz: 'CET (UTC+1)',
    windowKst: '09:00 – 11:00',
    mode: '무중단 카나리 스왑',
    service: 'GDPR 볼트 스토리지 암호화 키 로테이션',
    commander: '최수빈',
    avatar: AVATARS.a5,
    status: '검증 완료',
    progress: 100,
  },
  {
    id: 'rw-4',
    region: 'US-East-1 (버지니아 북부)',
    tz: 'EDT (UTC-4)',
    windowKst: '15:00 – 17:00',
    mode: '블루/그린 클러스터 전환',
    service: 'Kubernetes 1.31 컨트롤 플레인 업그레이드',
    commander: '박준영',
    avatar: AVATARS.a2,
    status: '승인 완료',
    progress: 20,
  },
];

export const MaintenanceWindowScheduleView: React.FC = () => {
  const [windows, setWindows] = useState(REGION_WINDOWS);
  const [notifyStatusPage, setNotifyStatusPage] = useState(true);

  const handleAdvance = (id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              progress: Math.min(100, w.progress + 25),
              status: w.progress + 25 >= 100 ? '검증 완료' : '패치 실행 중',
            }
          : w
      )
    );
  };

  return (
    <div className="p-6 space-y-6 bg-white ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 ">
        <div>
          <div className="flex items-center gap-2 text-xs text-klic-muted  mb-1">
            <span>글로벌 SRE 인프라</span>
            <span>·</span>
            <span>정기 점검 윈도우 (KST 기준선)</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 ">
            글로벌 리전별 정기 점검 & 패치 스케줄 보드
          </h3>
        </div>
        <button
          onClick={() => setNotifyStatusPage((v) => !v)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            notifyStatusPage
              ? 'bg-blue-50  border-blue-300  text-blue-800 '
              : 'bg-zinc-100  border-zinc-300 text-klic-muted'
          }`}
        >
          고객 상태 페이지 자동 공지: {notifyStatusPage ? '켜짐 (ON)' : '꺼짐'}
        </button>
      </div>

      <div className="space-y-3">
        {windows.map((w) => (
          <div
            key={w.id}
            className="p-4 rounded-xl border border-zinc-200  bg-white  flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-klic-muted">
                <Globe className="w-3.5 h-3.5 text-klic-muted" />
                <span className="font-semibold text-zinc-900 ">
                  {w.region}
                </span>
                <span>·</span>
                <span className="font-mono">{w.windowKst} KST</span>
                <span>·</span>
                <span>{w.mode}</span>
              </div>
              <div className="text-sm font-semibold text-zinc-800 ">
                {w.service}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-36">
                <div className="flex justify-between text-[11px] text-klic-muted mb-1">
                  <span>{w.status}</span>
                  <span className="font-mono">{w.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100  overflow-hidden">
                  <div
                    className="h-full bg-klic-inverse  transition-all"
                    style={{ width: `${w.progress}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PersonAvatar
                  src={w.avatar}
                  alt={w.commander}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-xs font-medium text-zinc-700 ">
                  {w.commander}
                </span>
              </div>
              <button
                onClick={() => handleAdvance(w.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200   text-zinc-800 "
              >
                단계 진행
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================================
 * 5. 고객 지원(CX) 글로벌 교대 근무표 (KLIC/schedule-4)
 * ========================================================================== */
const SHIFT_SQUADS = [
  {
    id: 'sq-seoul',
    hub: '서울 오피스 (APAC 주간 시프트)',
    hours: '08:00 – 17:00 KST',
    coverage: '100% 충족 (6/6명)',
    agents: [
      { name: '한소윤', role: '엔터프라이즈 전담', avatar: AVATARS.a7, state: '근무 중' },
      { name: '정유진', role: '결제/정산 티켓 리드', avatar: AVATARS.a3, state: '근무 중' },
      { name: '오민재', role: '기술 연동 지원', avatar: AVATARS.a8, state: '휴식 (15분)' },
    ],
  },
  {
    id: 'sq-london',
    hub: '런던 오피스 (EMEA 오후 시프트)',
    hours: '16:00 – 01:00 KST',
    coverage: '85% 주의 (대체 1명 필요)',
    agents: [
      { name: '최수빈', role: 'EU GDPR/보안 전담', avatar: AVATARS.a5, state: '대기 중' },
      { name: '강태우', role: '글로벌 어카운트', avatar: AVATARS.a4, state: '대기 중' },
    ],
  },
  {
    id: 'sq-ny',
    hub: '뉴욕 오피스 (AMER 야간 시프트)',
    hours: '23:00 – 08:00 KST',
    coverage: '100% 충족 (5/5명)',
    agents: [
      { name: '박준영', role: 'US 엔터프라이즈 온콜', avatar: AVATARS.a2, state: '교대 예정' },
      { name: '이하은', role: '긴급 Sev-1 에스컬레이션', avatar: AVATARS.a1, state: '교대 예정' },
    ],
  },
];

export const ShiftPlannerScheduleView: React.FC = () => {
  const [squads, setSquads] = useState(SHIFT_SQUADS);

  const handleFillCover = (id: string) => {
    setSquads((prev) =>
      prev.map((sq) =>
        sq.id === id
          ? {
              ...sq,
              coverage: '100% 충족 (예비 인력 투입 완료)',
              agents: [
                ...sq.agents,
                {
                  name: '임성진 (대체 투입)',
                  role: '글로벌 기술 지원',
                  avatar: AVATARS.a6,
                  state: '배정 확정',
                },
              ],
            }
          : sq
      )
    );
  };

  return (
    <div className="p-6 space-y-6 bg-white ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 ">
        <div>
          <div className="flex items-center gap-2 text-xs text-klic-muted  mb-1">
            <span>시간대별 인계로 운영하는 24시간 고객 지원</span>
            <span>·</span>
            <span>서울 · 런던 · 뉴욕 3교대</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 ">
            고객 지원(CX) 글로벌 교대 근무표
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {squads.map((sq) => (
          <div
            key={sq.id}
            className="p-4 rounded-xl border border-zinc-200  bg-zinc-50/50  space-y-4"
          >
            <div>
              <div className="text-xs font-mono text-klic-muted">{sq.hours}</div>
              <h4 className="text-sm font-bold text-zinc-900  mt-0.5">
                {sq.hub}
              </h4>
              <div className="text-xs text-klic-muted  mt-1">
                인력 충족률: <span className="font-semibold">{sq.coverage}</span>
              </div>
            </div>

            <div className="space-y-2">
              {sq.agents.map((ag, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-white  border border-zinc-200/80  flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <PersonAvatar
                      src={ag.avatar}
                      alt={ag.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-semibold text-zinc-900 ">
                        {ag.name}
                      </div>
                      <div className="text-[11px] text-klic-muted">{ag.role}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-klic-muted ">
                    {ag.state}
                  </span>
                </div>
              ))}
            </div>

            {sq.id === 'sq-london' && sq.agents.length < 3 && (
              <button
                onClick={() => handleFillCover(sq.id)}
                className="w-full py-2 rounded-lg text-xs font-semibold bg-klic-inverse  text-klic-on-emphasis "
              >
                + 예비 온콜 인력 즉시 배정
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================================
 * 6. 일일 정산 & 데이터 배치 실행 스케줄 (KLIC/schedule-5)
 * ========================================================================== */
const INITIAL_BATCH_JOBS = [
  {
    id: 'cron-1',
    time: '00:00 KST',
    code: 'BATCH-SETTLE-01',
    name: '일일 카드/계좌이체 원장 마감 스냅샷',
    dependsOn: '선행 조건 없음',
    avgDuration: '14분 20초',
    slaLimit: '00:30 까지',
    status: '완료됨',
  },
  {
    id: 'cron-2',
    time: '01:30 KST',
    code: 'BATCH-RECON-02',
    name: 'PG사(토스·스트라이프·아디옌) 결제 대사 검증',
    dependsOn: 'BATCH-SETTLE-01',
    avgDuration: '28분 10초',
    slaLimit: '02:30 까지',
    status: '완료됨',
  },
  {
    id: 'cron-3',
    time: '03:00 KST',
    code: 'BATCH-DW-03',
    name: 'Snowflake 데이터 웨어하우스 증분 적재 (ETL)',
    dependsOn: 'BATCH-RECON-02',
    avgDuration: '42분 00초',
    slaLimit: '04:00 까지',
    status: '실행 중',
  },
  {
    id: 'cron-4',
    time: '05:00 KST',
    code: 'BATCH-ML-04',
    name: '이상 거래 탐지(FDS) 피처 스토어 일일 갱신',
    dependsOn: 'BATCH-DW-03',
    avgDuration: '19분 45초',
    slaLimit: '06:00 까지',
    status: '대기 중',
  },
  {
    id: 'cron-5',
    time: '07:30 KST',
    code: 'BATCH-EXEC-05',
    name: '경영진 ARR & 현금흐름 브리핑 리포트 자동 발송',
    dependsOn: 'BATCH-DW-03',
    avgDuration: '3분 12초',
    slaLimit: '08:00 까지',
    status: '대기 중',
  },
];

export const BatchCronAgendaView: React.FC = () => {
  const [jobs, setJobs] = useState(INITIAL_BATCH_JOBS);

  const handleTriggerNow = (id: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id
          ? { ...j, status: j.status === '완료됨' ? '재실행 완료' : '완료됨' }
          : j
      )
    );
  };

  return (
    <div className="p-6 space-y-6 bg-white ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 ">
        <div>
          <div className="flex items-center gap-2 text-xs text-klic-muted  mb-1">
            <span>데이터 파이프라인 & 재무 정산</span>
            <span>·</span>
            <span>DAG 의존성 스케줄</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 ">
            일일 정산 & 데이터 배치 실행 스케줄
          </h3>
        </div>
      </div>

      <div className="divide-y divide-zinc-200  border border-zinc-200  rounded-xl overflow-hidden">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="p-4 bg-white  flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="font-mono text-xs font-bold text-zinc-900  bg-zinc-100  px-2.5 py-1.5 rounded-lg shrink-0">
                {job.time}
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-klic-muted">
                  <span className="font-mono">{job.code}</span>
                  <span>·</span>
                  <span>선행: {job.dependsOn}</span>
                  <span>·</span>
                  <span>SLA 마감: {job.slaLimit}</span>
                </div>
                <div className="text-sm font-semibold text-zinc-900  mt-0.5">
                  {job.name}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right text-xs">
                <div className="text-klic-muted">평균 소요: {job.avgDuration}</div>
                <div className="font-semibold text-zinc-900 ">
                  상태: {job.status}
                </div>
              </div>
              <button
                onClick={() => handleTriggerNow(job.id)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-klic-inverse  text-klic-on-emphasis  hover:opacity-90"
              >
                <Play className="w-3 h-3" />
                즉시 실행
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
