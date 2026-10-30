import { PersonAvatar } from '../PersonAvatar';
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  PanelLeft,
  Sparkles,
  Check,
  X,
} from 'lucide-react';
import {
  DailyAgendaScheduleView,
  InterviewSlotSchedulerView,
  MaintenanceWindowScheduleView,
  ShiftPlannerScheduleView,
  BatchCronAgendaView,
} from './ScheduleExtendedModes';

export type ScheduleMode =
  | 'optimize'
  | 'dispatch'
  | 'daily-agenda'
  | 'interview-slots'
  | 'maintenance-window'
  | 'shift-planner'
  | 'batch-cron';

interface ScheduleBlockProps {
  initialMode?: ScheduleMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

/* ============================================================================
 * 1. 오픈 시프트 & 스마트 배정 최적화 스케줄 (첨부 2번째 이미지 스타일, KLIC/schedule-optimize)
 * ========================================================================== */
type PillStatus =
  | 'done'
  | 'in-progress'
  | 'scheduled'
  | 'needs-attention'
  | 'open-shift'
  | 'suggestion';

interface CapsuleShiftItem {
  id: string;
  clientName: string;
  subLabel?: string;
  startHour: number; // 7.0 ~ 19.0
  endHour: number;
  status: PillStatus;
  timeRangeText: string;
}

interface CaregiverCapsuleRow {
  id: string;
  name: string;
  roleTag: string;
  hasAlertDot?: boolean;
  avatar: string;
  shifts: CapsuleShiftItem[];
}

const INITIAL_OPEN_CAPSULES: CapsuleShiftItem[] = [
  {
    id: 'os-1',
    clientName: '김민석 (네이버 클라우드)',
    startHour: 15.9,
    endHour: 17.85,
    status: 'open-shift',
    timeRangeText: '4:00 PM - 5:50 PM',
  },
  {
    id: 'os-2',
    clientName: '이수현 (카카오뱅크)',
    startHour: 17.95,
    endHour: 18.9,
    status: 'open-shift',
    timeRangeText: '6:00 PM - 7:00 PM',
  },
];

const INITIAL_CAPSULE_ROSTER: CaregiverCapsuleRow[] = [
  {
    id: 'cg-1',
    name: '김서연',
    roleTag: '선임 엔지니어',
    avatar:
      './placeholders/avatar-576a55580552.svg',
    shifts: [
      {
        id: 'cs-101',
        clientName: '박태준 (신한은행 코어)',
        startHour: 8.0,
        endHour: 10.0,
        status: 'done',
        timeRangeText: '8:00 AM - 10:00 AM',
      },
      {
        id: 'cs-102',
        clientName: '최유나 (삼성SDS)',
        startHour: 11.0,
        endHour: 13.0,
        status: 'scheduled',
        timeRangeText: '11:00 AM - 1:00 PM',
      },
      {
        id: 'cs-103',
        clientName: '한지훈 (우리은행)',
        startHour: 14.0,
        endHour: 15.05,
        status: 'scheduled',
        timeRangeText: '2:00 PM - 3:00 PM',
      },
    ],
  },
  {
    id: 'cg-2',
    name: '박준혁',
    roleTag: '인프라 관제',
    hasAlertDot: true,
    avatar:
      './placeholders/avatar-d36430bc2634.svg',
    shifts: [
      {
        id: 'cs-201',
        clientName: '송민재 (현대카드)',
        startHour: 8.5,
        endHour: 9.5,
        status: 'done',
        timeRangeText: '8:30 AM - 9:30 AM',
      },
      {
        id: 'cs-202',
        clientName: '박혜린 (두나무 코어)',
        startHour: 10.5,
        endHour: 11.95,
        status: 'in-progress',
        timeRangeText: '10:30 AM - 12:00 PM',
      },
      {
        id: 'cs-203',
        clientName: '강동현 (토스뱅크)',
        startHour: 15.0,
        endHour: 16.05,
        status: 'scheduled',
        timeRangeText: '3:00 PM - 4:00 PM',
      },
    ],
  },
  {
    id: 'cg-3',
    name: '이지아',
    roleTag: '보안 아키텍트',
    avatar:
      './placeholders/avatar-d23e1dc07c81.svg',
    shifts: [
      {
        id: 'cs-301',
        clientName: '오승우 (NH농협)',
        startHour: 7.5,
        endHour: 8.5,
        status: 'done',
        timeRangeText: '7:30 AM - 8:30 AM',
      },
      {
        id: 'cs-302',
        clientName: '조성민 (우아한형제들)',
        startHour: 9.5,
        endHour: 11.45,
        status: 'in-progress',
        timeRangeText: '9:30 AM - 11:30 AM',
      },
      {
        id: 'cs-303',
        clientName: '윤채원 (쿠팡페이)',
        startHour: 13.0,
        endHour: 14.0,
        status: 'scheduled',
        timeRangeText: '1:00 PM - 2:00 PM',
      },
      {
        id: 'cs-304',
        clientName: '노지현 (카카오페이)',
        startHour: 16.0,
        endHour: 17.0,
        status: 'scheduled',
        timeRangeText: '4:00 PM - 5:00 PM',
      },
    ],
  },
  {
    id: 'cg-4',
    name: '정현우',
    roleTag: 'SRE 엔지니어',
    avatar:
      './placeholders/avatar-352373979408.svg',
    shifts: [
      {
        id: 'cs-401',
        clientName: '임도훈 (라인플러스)',
        startHour: 9.0,
        endHour: 10.95,
        status: 'in-progress',
        timeRangeText: '9:00 AM - 11:00 AM',
      },
      {
        id: 'cs-402',
        clientName: '배수빈 (크래프톤)',
        startHour: 12.0,
        endHour: 14.0,
        status: 'scheduled',
        timeRangeText: '12:00 PM - 2:00 PM',
      },
    ],
  },
  {
    id: 'cg-5',
    name: '최도윤',
    roleTag: 'DB 엔지니어',
    avatar:
      './placeholders/avatar-f0911aecec62.svg',
    shifts: [
      {
        id: 'cs-501',
        clientName: '안소희 (KB증권)',
        startHour: 8.0,
        endHour: 10.0,
        status: 'done',
        timeRangeText: '8:00 AM - 10:00 AM',
      },
      {
        id: 'cs-502',
        clientName: '우진석 (하나금융)',
        startHour: 11.0,
        endHour: 13.0,
        status: 'scheduled',
        timeRangeText: '11:00 AM - 1:00 PM',
      },
      {
        id: 'cs-503',
        clientName: '홍유진 (SLA 확인 필요)',
        startHour: 13.05,
        endHour: 15.0,
        status: 'needs-attention',
        timeRangeText: '1:05 PM - 3:00 PM',
      },
    ],
  },
  {
    id: 'cg-6',
    name: '박시은',
    roleTag: '클라우드 아키텍트',
    avatar:
      './placeholders/avatar-8c2580aea9a4.svg',
    shifts: [
      {
        id: 'cs-601',
        clientName: '신예린 (야놀자)',
        startHour: 10.0,
        endHour: 10.95,
        status: 'in-progress',
        timeRangeText: '10:00 AM - 11:00 AM',
      },
      {
        id: 'cs-602',
        clientName: '문성호 (무신사)',
        startHour: 13.5,
        endHour: 14.5,
        status: 'scheduled',
        timeRangeText: '1:30 PM - 2:30 PM',
      },
    ],
  },
  {
    id: 'cg-7',
    name: '한소윤',
    roleTag: '필드 스페셜리스트',
    hasAlertDot: true,
    avatar:
      './placeholders/avatar-d81ac24457b6.svg',
    shifts: [
      {
        id: 'cs-701',
        clientName: '김민석 (현대카드)',
        startHour: 7.0,
        endHour: 10.0,
        status: 'done',
        timeRangeText: '7:00 AM - 10:00 AM',
      },
      {
        id: 'cs-702',
        clientName: '표지훈 (SKT 분당)',
        startHour: 11.0,
        endHour: 14.0,
        status: 'scheduled',
        timeRangeText: '11:00 AM - 2:00 PM',
      },
    ],
  },
  {
    id: 'cg-8',
    name: '장하늘',
    roleTag: '네트워크 관제',
    avatar:
      './placeholders/avatar-acee4a0e6577.svg',
    shifts: [
      {
        id: 'cs-801',
        clientName: '전소연 (KT 클라우드)',
        startHour: 13.0,
        endHour: 15.0,
        status: 'scheduled',
        timeRangeText: '1:00 PM - 3:00 PM',
      },
    ],
  },
  {
    id: 'cg-9',
    name: '송하린',
    roleTag: '보안 패치 전담',
    avatar:
      './placeholders/avatar-ef94a3ac14b1.svg',
    shifts: [
      {
        id: 'cs-901',
        clientName: '정재현 (LG CNS)',
        startHour: 8.0,
        endHour: 9.0,
        status: 'done',
        timeRangeText: '8:00 AM - 9:00 AM',
      },
      {
        id: 'cs-902',
        clientName: '안유진 (포스코DX)',
        startHour: 12.0,
        endHour: 13.0,
        status: 'scheduled',
        timeRangeText: '12:00 PM - 1:00 PM',
      },
      {
        id: 'cs-903',
        clientName: '백승민 (롯데이노베이트)',
        startHour: 16.0,
        endHour: 17.0,
        status: 'scheduled',
        timeRangeText: '4:00 PM - 5:00 PM',
      },
    ],
  },
];

const OPTIMIZE_HOURS = [
  { hour: 7, label: '7 AM' },
  { hour: 8, label: '8 AM' },
  { hour: 9, label: '9 AM' },
  { hour: 10, label: '10 AM' },
  { hour: 11, label: '11 AM' },
  { hour: 12, label: '12 PM' },
  { hour: 13, label: '1 PM' },
  { hour: 14, label: '2 PM' },
  { hour: 15, label: '3 PM' },
  { hour: 16, label: '4 PM' },
  { hour: 17, label: '5 PM' },
  { hour: 18, label: '6 PM' },
];

/* ============================================================================
 * 2. 현장 엔지니어 & 당번 커버리지 스케줄 (첨부 1번째 이미지 스타일, KLIC/schedule-dispatch)
 * ========================================================================== */
type VisitStatus = 'completed' | 'in-progress' | 'warning' | 'confirmed' | 'needs-cover';

interface DispatchVisit {
  id: string;
  clientName: string;
  siteSub?: string;
  startHour: number;
  endHour: number;
  timeLabel: string;
  status: VisitStatus;
  travelMinutesAfter?: number;
}

interface SpecialistRow {
  id: string;
  name: string;
  roleCode: string;
  hoursToday: number;
  avatar: string;
  visits: DispatchVisit[];
}

const INITIAL_UNASSIGNED_VISITS: DispatchVisit[] = [
  {
    id: 'cov-1',
    clientName: '황보라 (삼성서울 IDC)',
    startHour: 10.0,
    endHour: 12.0,
    timeLabel: '10:00 - 12:00',
    status: 'needs-cover',
  },
  {
    id: 'cov-2',
    clientName: '도경수 (카카오 판교 센터)',
    startHour: 13.0,
    endHour: 15.0,
    timeLabel: '1:00 - 3:00',
    status: 'needs-cover',
  },
  {
    id: 'cov-3',
    clientName: '김세정 (현대오토에버)',
    startHour: 15.25,
    endHour: 16.4,
    timeLabel: '3:15 - 4:30',
    status: 'needs-cover',
  },
];

const INITIAL_SPECIALISTS: SpecialistRow[] = [
  {
    id: 'sp-1',
    name: '김민솔',
    roleCode: 'SRE · 선임관제',
    hoursToday: 6.0,
    avatar:
      './placeholders/avatar-576a55580552.svg',
    visits: [
      {
        id: 'v-101',
        clientName: '류승룡 (네이버 춘천)',
        startHour: 7.5,
        endHour: 9.0,
        timeLabel: '7:30 - 9:00',
        status: 'in-progress',
      },
      {
        id: 'v-102',
        clientName: '안효섭 (토스 코어)',
        startHour: 12.5,
        endHour: 14.0,
        timeLabel: '12:30 - 2:00',
        status: 'confirmed',
        travelMinutesAfter: 18,
      },
      {
        id: 'v-103',
        clientName: '박은빈 (당근페이)',
        startHour: 14.5,
        endHour: 16.0,
        timeLabel: '2:30 - 4:00',
        status: 'confirmed',
      },
    ],
  },
  {
    id: 'sp-2',
    name: '오수진',
    roleCode: 'DC · 현장점검',
    hoursToday: 4.5,
    avatar:
      './placeholders/avatar-d23e1dc07c81.svg',
    visits: [
      {
        id: 'v-201',
        clientName: '남궁민 (신한IDC)',
        startHour: 7.0,
        endHour: 8.5,
        timeLabel: '7:00 - 8:30',
        status: 'completed',
      },
    ],
  },
  {
    id: 'sp-3',
    name: '문다빈',
    roleCode: 'SRE · 수석엔지니어',
    hoursToday: 7.5,
    avatar:
      './placeholders/avatar-d36430bc2634.svg',
    visits: [
      {
        id: 'v-301',
        clientName: '차은우 (쿠팡 코어)',
        startHour: 7.0,
        endHour: 8.5,
        timeLabel: '7:00 - 8:30',
        status: 'completed',
        travelMinutesAfter: 24,
      },
      {
        id: 'v-302',
        clientName: '고윤정 (두나무)',
        startHour: 9.0,
        endHour: 10.5,
        timeLabel: '9:00 - 10:30',
        status: 'warning',
        travelMinutesAfter: 16,
      },
      {
        id: 'v-303',
        clientName: '이정재 (우아한형제들)',
        startHour: 11.0,
        endHour: 13.0,
        timeLabel: '11:00 - 1:00',
        status: 'confirmed',
      },
      {
        id: 'v-304',
        clientName: '신민아 (라인플러스)',
        startHour: 14.0,
        endHour: 15.0,
        timeLabel: '2:00',
        status: 'confirmed',
      },
    ],
  },
  {
    id: 'sp-4',
    name: '노은비',
    roleCode: 'SEC · 보안관제',
    hoursToday: 6.0,
    avatar:
      './placeholders/avatar-ef94a3ac14b1.svg',
    visits: [
      {
        id: 'v-401',
        clientName: '김태린 (KB 여의도)',
        startHour: 8.0,
        endHour: 9.5,
        timeLabel: '8:00 - 9:30',
        status: 'in-progress',
        travelMinutesAfter: 14,
      },
      {
        id: 'v-402',
        clientName: '유연석 (우리 상암)',
        startHour: 10.0,
        endHour: 11.5,
        timeLabel: '10:00 - 11:30',
        status: 'confirmed',
      },
      {
        id: 'v-403',
        clientName: '손석구 (하나 청라)',
        startHour: 12.5,
        endHour: 14.0,
        timeLabel: '12:30 - 2:00',
        status: 'confirmed',
        travelMinutesAfter: 11,
      },
      {
        id: 'v-404',
        clientName: '전여빈 (NH 의왕)',
        startHour: 14.5,
        endHour: 16.0,
        timeLabel: '2:30 - 4:00',
        status: 'confirmed',
      },
    ],
  },
  {
    id: 'sp-5',
    name: '배희원',
    roleCode: 'DC · 현장지원',
    hoursToday: 5.5,
    avatar:
      './placeholders/avatar-d81ac24457b6.svg',
    visits: [
      {
        id: 'v-501',
        clientName: '이준호 (KT 목동)',
        startHour: 7.0,
        endHour: 8.0,
        timeLabel: '7:00',
        status: 'completed',
        travelMinutesAfter: 13,
      },
      {
        id: 'v-502',
        clientName: '임윤아 (SKT 분당)',
        startHour: 8.5,
        endHour: 10.0,
        timeLabel: '8:30 - 10:00',
        status: 'in-progress',
      },
      {
        id: 'v-503',
        clientName: '박보현 (LGU+ 평촌)',
        startHour: 13.5,
        endHour: 15.0,
        timeLabel: '1:30 - 3:00',
        status: 'confirmed',
      },
    ],
  },
  {
    id: 'sp-6',
    name: '임태사',
    roleCode: 'NET · 네트워크',
    hoursToday: 4.5,
    avatar:
      './placeholders/avatar-c6cee086c134.svg',
    visits: [
      {
        id: 'v-601',
        clientName: '김지원 (크래프톤)',
        startHour: 9.0,
        endHour: 10.5,
        timeLabel: '9:00 - 10:30',
        status: 'confirmed',
      },
    ],
  },
  {
    id: 'sp-7',
    name: '모하나',
    roleCode: 'DBA · 시니어전담',
    hoursToday: 5.0,
    avatar:
      './placeholders/avatar-8c2580aea9a4.svg',
    visits: [
      {
        id: 'v-701',
        clientName: '김수현 (야놀자)',
        startHour: 9.5,
        endHour: 10.5,
        timeLabel: '9:30',
        status: 'confirmed',
        travelMinutesAfter: 17,
      },
      {
        id: 'v-702',
        clientName: '한지우 (무신사)',
        startHour: 11.0,
        endHour: 12.0,
        timeLabel: '11:00',
        status: 'confirmed',
      },
      {
        id: 'v-703',
        clientName: '공유 (올리브영)',
        startHour: 13.0,
        endHour: 14.0,
        timeLabel: '1:00',
        status: 'confirmed',
        travelMinutesAfter: 12,
      },
      {
        id: 'v-704',
        clientName: '정유미 (대한통운)',
        startHour: 14.5,
        endHour: 15.5,
        timeLabel: '2:30',
        status: 'confirmed',
      },
    ],
  },
  {
    id: 'sp-8',
    name: '하민준',
    roleCode: 'INF · 인프라',
    hoursToday: 5.5,
    avatar:
      './placeholders/avatar-352373979408.svg',
    visits: [
      {
        id: 'v-801',
        clientName: '송중기 (삼성SDS)',
        startHour: 7.0,
        endHour: 8.5,
        timeLabel: '7:00 - 8:30',
        status: 'completed',
      },
      {
        id: 'v-802',
        clientName: '변우석 (LG CNS)',
        startHour: 9.5,
        endHour: 11.0,
        timeLabel: '9:30 - 11:00',
        status: 'confirmed',
        travelMinutesAfter: 15,
      },
      {
        id: 'v-803',
        clientName: '김혜윤 (포스코DX)',
        startHour: 11.5,
        endHour: 12.5,
        timeLabel: '11:30',
        status: 'confirmed',
      },
    ],
  },
  {
    id: 'sp-9',
    name: '구보나',
    roleCode: 'CLD · 클라우드',
    hoursToday: 7.0,
    avatar:
      './placeholders/avatar-acee4a0e6577.svg',
    visits: [
      {
        id: 'v-901',
        clientName: '이동욱 (현대카드)',
        startHour: 7.0,
        endHour: 8.5,
        timeLabel: '7:00 - 8:30',
        status: 'completed',
        travelMinutesAfter: 19,
      },
      {
        id: 'v-902',
        clientName: '조정석 (롯데이노베이트)',
        startHour: 9.0,
        endHour: 11.0,
        timeLabel: '9:00 - 11:00',
        status: 'confirmed',
        travelMinutesAfter: 12,
      },
      {
        id: 'v-903',
        clientName: '전미도 (신세계I&C)',
        startHour: 11.5,
        endHour: 13.0,
        timeLabel: '11:30 - 1:00',
        status: 'confirmed',
        travelMinutesAfter: 16,
      },
      {
        id: 'v-904',
        clientName: '정경호 (대한항공)',
        startHour: 13.5,
        endHour: 15.5,
        timeLabel: '1:30 - 3:30',
        status: 'confirmed',
      },
    ],
  },
  {
    id: 'sp-10',
    name: '홍건우',
    roleCode: 'NET · 코어망',
    hoursToday: 6.5,
    avatar:
      './placeholders/avatar-b26d2e28f816.svg',
    visits: [
      {
        id: 'v-1001',
        clientName: '고민시 (넥슨 판교)',
        startHour: 7.0,
        endHour: 8.5,
        timeLabel: '7:00 - 8:30',
        status: 'completed',
      },
      {
        id: 'v-1002',
        clientName: '최우식 (엔씨소프트 R&D)',
        startHour: 15.0,
        endHour: 16.3,
        timeLabel: '3:00 - 4:20',
        status: 'confirmed',
      },
    ],
  },
];

const HOURS_AXIS = [
  { hour: 7, label: '7 AM' },
  { hour: 8, label: '8 AM' },
  { hour: 9, label: '9 AM' },
  { hour: 10, label: '10 AM' },
  { hour: 11, label: '11 AM' },
  { hour: 12, label: '12 PM' },
  { hour: 13, label: '1 PM' },
  { hour: 14, label: '2 PM' },
  { hour: 15, label: '3 PM' },
];

export const ScheduleBlock: React.FC<ScheduleBlockProps> = ({
  initialMode = 'optimize',
}) => {
  const [activeMode, setActiveMode] = useState<ScheduleMode>(initialMode);

  // --- Mode 1: Open Shifts & Smart Optimize Schedule State ---
  const [capsuleRoster, setCapsuleRoster] =
    useState<CaregiverCapsuleRow[]>(INITIAL_CAPSULE_ROSTER);
  const [openCapsules, setOpenCapsules] =
    useState<CapsuleShiftItem[]>(INITIAL_OPEN_CAPSULES);
  const [optSpan, setOptSpan] = useState<'day' | 'week'>('day');
  const [caregiverFilter, setCaregiverFilter] = useState<
    'all' | 'attention' | 'in-progress'
  >('all');
  const [legendFilter, setLegendFilter] = useState<PillStatus | 'all'>('all');
  const [isOptimized, setIsOptimized] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState<{
    ownerName: string;
    shift: CapsuleShiftItem;
  } | null>(null);

  // --- Mode 2: Field Dispatch Schedule State ---
  const [specialists, setSpecialists] = useState<SpecialistRow[]>(INITIAL_SPECIALISTS);
  const [unassignedVisits, setUnassignedVisits] = useState<DispatchVisit[]>(
    INITIAL_UNASSIGNED_VISITS
  );
  const [dayOffset, setDayOffset] = useState<number>(0);
  const [viewSpan, setViewSpan] = useState<'day' | 'week'>('day');
  const [pivotBy, setPivotBy] = useState<'caregivers' | 'clients'>('caregivers');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'in-progress'>(
    'all'
  );
  const [selectedCoverVisit, setSelectedCoverVisit] = useState<DispatchVisit | null>(
    null
  );
  const [selectedVisitInfo, setSelectedVisitInfo] = useState<{
    specialistName: string;
    visit: DispatchVisit;
  } | null>(null);

  useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  // --- Mode 1 Math (7 AM ~ 6:50 PM) ---
  const OPT_MIN_H = 7.0;
  const OPT_MAX_H = 19.0;
  const OPT_SPAN = OPT_MAX_H - OPT_MIN_H;
  const OPT_NOW_H = 10 + 45 / 60; // 10:45 AM

  const toOptLeft = (h: number) =>
    Math.max(0, Math.min(100, ((h - OPT_MIN_H) / OPT_SPAN) * 100));
  const toOptWidth = (start: number, end: number) =>
    Math.max(5, ((end - start) / OPT_SPAN) * 100);

  const optNowLeft = toOptLeft(OPT_NOW_H);

  const handleRunOptimize = () => {
    if (!isOptimized) {
      // 오픈 시프트 2건을 최적 유휴 엔지니어에게 추천/배정하고 주의 필요 슬롯을 보정
      setOpenCapsules([]);
      setCapsuleRoster((prev) =>
        prev.map((row) => {
          if (row.id === 'cg-4') {
            return {
              ...row,
              shifts: [
                ...row.shifts,
                {
                  id: 'os-1-opt',
                  clientName: '김민석 (추천 배정)',
                  startHour: 15.9,
                  endHour: 17.85,
                  status: 'suggestion' as PillStatus,
                  timeRangeText: '4:00 PM - 5:50 PM',
                },
              ],
            };
          }
          if (row.id === 'cg-8') {
            return {
              ...row,
              shifts: [
                ...row.shifts,
                {
                  id: 'os-2-opt',
                  clientName: '이수현 (추천 배정)',
                  startHour: 17.9,
                  endHour: 18.85,
                  status: 'suggestion' as PillStatus,
                  timeRangeText: '6:00 PM - 7:00 PM',
                },
              ],
            };
          }
          return row;
        })
      );
      setIsOptimized(true);
    } else {
      setOpenCapsules(INITIAL_OPEN_CAPSULES);
      setCapsuleRoster(INITIAL_CAPSULE_ROSTER);
      setIsOptimized(false);
    }
  };

  const handleAssignOpenCapsule = (openItem: CapsuleShiftItem, targetRowId: string) => {
    setOpenCapsules((prev) => prev.filter((item) => item.id !== openItem.id));
    setCapsuleRoster((prev) =>
      prev.map((row) =>
        row.id === targetRowId
          ? {
              ...row,
              shifts: [
                ...row.shifts,
                {
                  ...openItem,
                  status: 'suggestion' as PillStatus,
                },
              ].sort((a, b) => a.startHour - b.startHour),
            }
          : row
      )
    );
  };

  const filteredCapsuleRows = capsuleRoster.filter((row) => {
    if (caregiverFilter === 'attention') {
      return (
        row.hasAlertDot ||
        row.shifts.some((s) => s.status === 'needs-attention')
      );
    }
    if (caregiverFilter === 'in-progress') {
      return row.shifts.some((s) => s.status === 'in-progress');
    }
    return true;
  });

  // --- Mode 2 Math (7:00 AM ~ 16:30 PM) ---
  const MIN_HOUR = 6.85;
  const MAX_HOUR = 16.35;
  const TOTAL_SPAN = MAX_HOUR - MIN_HOUR;
  const CURRENT_TIME_HOUR = 8 + 46 / 60; // 8:46 AM

  const toLeftPercent = (h: number) =>
    Math.max(0, Math.min(100, ((h - MIN_HOUR) / TOTAL_SPAN) * 100));
  const toWidthPercent = (start: number, end: number) =>
    Math.max(4, ((end - start) / TOTAL_SPAN) * 100);

  const currentLineLeft = toLeftPercent(CURRENT_TIME_HOUR);

  const dateLabels = [
    { short: '10월 4일 (일)', upper: 'SUN, OCT 4' },
    { short: '10월 5일 (월)', upper: 'MON, OCT 5' },
    { short: '10월 6일 (화)', upper: 'TUE, OCT 6' },
  ];
  const currentDateObj = dateLabels[dayOffset + 1] || dateLabels[1];

  const handleAssignCoverToSpecialist = (
    visit: DispatchVisit,
    specialistId: string
  ) => {
    setUnassignedVisits((prev) => prev.filter((v) => v.id !== visit.id));
    setSpecialists((prev) =>
      prev.map((sp) =>
        sp.id === specialistId
          ? {
              ...sp,
              hoursToday: +(sp.hoursToday + (visit.endHour - visit.startHour)).toFixed(1),
              visits: [
                ...sp.visits,
                {
                  ...visit,
                  status: 'confirmed' as VisitStatus,
                },
              ].sort((a, b) => a.startHour - b.startHour),
            }
          : sp
      )
    );
    setSelectedCoverVisit(null);
  };

  const MODE_TABS: { id: ScheduleMode; label: string; pkg: string }[] = [
    {
      id: 'optimize',
      label: '1. 오픈 시프트 & 스마트 배정 스케줄',
      pkg: 'KLIC/schedule-optimize',
    },
    {
      id: 'dispatch',
      label: '2. 현장 엔지니어 & 당번 커버리지 스케줄',
      pkg: 'KLIC/schedule-dispatch',
    },
    {
      id: 'daily-agenda',
      label: '3. 팀 일일 스탠드업 & 타임블록',
      pkg: 'KLIC/schedule-1',
    },
    {
      id: 'interview-slots',
      label: '4. 기술 면접관 가용 시간 조율',
      pkg: 'KLIC/schedule-2',
    },
    {
      id: 'maintenance-window',
      label: '5. 글로벌 리전별 정기 점검 보드',
      pkg: 'KLIC/schedule-3',
    },
    {
      id: 'shift-planner',
      label: '6. 고객 지원(CX) 글로벌 교대 근무표',
      pkg: 'KLIC/schedule-4',
    },
    {
      id: 'batch-cron',
      label: '7. 일일 정산 & 데이터 배치 스케줄',
      pkg: 'KLIC/schedule-5',
    },
  ];

  return (
    <div className="w-full bg-white  text-zinc-900  rounded-xl overflow-hidden">
      {/* 상단 7종 일정 컴포넌트 스위처 바 */}
      <div className="px-4 py-2.5 bg-zinc-50  border-b border-zinc-200  flex items-center gap-1.5 overflow-x-auto">
        {MODE_TABS.map((tab) => {
          const active = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMode(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? 'bg-klic-inverse text-klic-on-emphasis   shadow-2xs'
                  : 'text-klic-muted  hover:text-zinc-900  hover:bg-zinc-200/60 '
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeMode === 'daily-agenda' && <DailyAgendaScheduleView />}
      {activeMode === 'interview-slots' && <InterviewSlotSchedulerView />}
      {activeMode === 'maintenance-window' && <MaintenanceWindowScheduleView />}
      {activeMode === 'shift-planner' && <ShiftPlannerScheduleView />}
      {activeMode === 'batch-cron' && <BatchCronAgendaView />}

      {/* ====================================================================
       * MODE 1: 오픈 시프트 & 스마트 배정 스케줄 (새로 첨부된 캡슐형 타임라인)
       * ==================================================================== */}
      {activeMode === 'optimize' && (
        <div className="p-4 sm:p-6 bg-[var(--klic-component-block-color-soft)] ">
          <div className="rounded-3xl bg-white  border border-[color:var(--klic-component-block-color-soft)]  p-5 sm:p-7 shadow-xs space-y-6">
            {/* 상단 헤더 바: 아이콘 + Schedule + 날짜/방문수 | Day/Week | All caregivers | ✨ Optimize */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--klic-component-block-color-soft)]  flex items-center justify-center text-zinc-800  shrink-0 translate-y-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 ">
                    일정
                  </h2>
                </div>
                <span className="text-sm font-medium text-klic-muted ">
                  9월 30일 (수) · 총 {142 + (isOptimized ? 2 : 0)}건 방문 배정
                </span>
              </div>

              {/* 우측 컨트롤 그룹 */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Day | Week 캡슐 토글 */}
                <div className="inline-flex items-center p-1 rounded-full bg-[var(--klic-component-block-color-soft)] ">
                  <button
                    onClick={() => setOptSpan('day')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      optSpan === 'day'
                        ? 'bg-white  text-zinc-900  shadow-2xs'
                        : 'text-klic-muted  hover:text-zinc-900'
                    }`}
                  >
                    일간
                  </button>
                  <button
                    onClick={() => setOptSpan('week')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      optSpan === 'week'
                        ? 'bg-white  text-zinc-900  shadow-2xs'
                        : 'text-klic-muted  hover:text-zinc-900'
                    }`}
                  >
                    주간
                  </button>
                </div>

                {/* All caregivers 필터 셀렉트 */}
                <div className="relative">
                  <select
                    value={caregiverFilter}
                    onChange={(e) =>
                      setCaregiverFilter(
                        e.target.value as 'all' | 'attention' | 'in-progress'
                      )
                    }
                    className="appearance-none pl-4 pr-9 py-2 rounded-full bg-[var(--klic-component-block-color-soft)]  text-xs font-semibold text-zinc-800  cursor-pointer focus:outline-none"
                  >
                    <option value="all">전체 전문가</option>
                    <option value="in-progress">현재 수행 중</option>
                    <option value="attention">주의/확인 필요</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-klic-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* ✨ Optimize 로얄 블루 캡슐 버튼 */}
                <button
                  onClick={handleRunOptimize}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-xs ${
                    isOptimized
                      ? 'bg-blue-600 text-klic-on-emphasis hover:bg-blue-500'
                      : 'bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis hover:bg-[var(--klic-component-block-color-accent)]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isOptimized ? '최적화 적용됨 (초기화)' : '자동 최적화 (Optimize)'}
                </button>
              </div>
            </div>

            {/* 선택된 캡슐 슬롯 빠른 상태 변경 바 */}
            {selectedCapsule && (
              <div className="px-4 py-2.5 rounded-2xl bg-[var(--klic-component-block-color-soft)]  flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-zinc-900 ">
                    {selectedCapsule.shift.clientName}
                  </span>
                  <span className="text-klic-muted">·</span>
                  <span className="font-mono text-klic-muted ">
                    {selectedCapsule.shift.timeRangeText}
                  </span>
                  <span className="text-klic-muted">·</span>
                  <span className="text-klic-muted ">
                    담당: {selectedCapsule.ownerName}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCapsule(null)}
                  className="text-klic-muted hover:text-zinc-900  font-semibold"
                >
                  닫기 ✕
                </button>
              </div>
            )}

            {/* 타임라인 본문 (가로 스크롤 지원) */}
            <div className="overflow-x-auto">
              <div className="min-w-[960px] relative">
                {/* 시간 축 헤더 (7 AM ~ 6 PM) */}
                <div className="grid grid-cols-[200px_1fr] pb-2">
                  <div />
                  <div className="relative h-6">
                    {OPTIMIZE_HOURS.map((h) => (
                      <div
                        key={h.hour}
                        style={{ left: `${toOptLeft(h.hour)}%` }}
                        className="absolute -translate-x-1/2 text-[11px] font-medium text-klic-muted  select-none"
                      >
                        {h.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 전체 행을 관통하는 세로 그리드 라인 & 10:45 블루 타임라인 */}
                <div className="relative">
                  {/* 배경 시간 그리드 라인 (트랙 영역 기준) */}
                  <div className="pointer-events-none absolute top-0 bottom-0 left-[200px] right-0">
                    {OPTIMIZE_HOURS.map((h) => (
                      <div
                        key={h.hour}
                        style={{ left: `${toOptLeft(h.hour)}%` }}
                        className="absolute top-0 bottom-0 border-l border-zinc-200/75 "
                      />
                    ))}

                    {/* 10:45 로얄 블루 수직 실선 */}
                    <div
                      style={{ left: `${optNowLeft}%` }}
                      className="absolute -top-1 bottom-0 w-[2px] bg-[var(--klic-component-block-color-accent)] z-20"
                    />
                  </div>

                  {/* 상단 Open shifts (미배정 오픈 시프트) 라운딩 바 */}
                  <div className="grid grid-cols-[200px_1fr] items-center rounded-2xl bg-[var(--klic-component-block-color-soft)]/95  py-2.5 px-3 mb-2 relative z-10">
                    <div className="flex items-center gap-3 pr-2">
                      <div
                        className="w-8 h-8 rounded-full border border-[color:var(--klic-component-block-color-border)]  shrink-0"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(135deg, var(--klic-component-block-color-border) 0px, var(--klic-component-block-color-border) 2px, transparent 2px, transparent 5px)',
                        }}
                      />
                      <div>
                        <span className="text-xs font-semibold text-zinc-800  block">
                          미배정 근무
                        </span>
                        <span className="text-[10px] text-klic-muted">
                          {openCapsules.length > 0
                            ? `미배정 ${openCapsules.length}건 · 클릭하여 배정`
                            : '모든 오픈 시프트 배정 완료'}
                        </span>
                      </div>
                    </div>

                    <div className="relative h-10">
                      {/* 10:45 로얄 블루 캡슐 배지 */}
                      <div
                        style={{ left: `${optNowLeft}%` }}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 px-2.5 py-1 rounded-full bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis text-[11px] font-bold shadow-xs"
                      >
                        10:45
                      </div>

                      {/* 오픈 시프트 빗금 캡슐들 */}
                      {openCapsules.map((os) => (
                        <button
                          key={os.id}
                          onClick={() =>
                            handleAssignOpenCapsule(
                              os,
                              os.id === 'os-1' ? 'cg-4' : 'cg-8'
                            )
                          }
                          style={{
                            left: `${toOptLeft(os.startHour)}%`,
                            width: `${toOptWidth(os.startHour, os.endHour)}%`,
                            backgroundImage:
                              'repeating-linear-gradient(135deg, color-mix(in srgb,var(--klic-component-block-color-border) 45%,transparent) 0px, color-mix(in srgb,var(--klic-component-block-color-border) 45%,transparent) 2px, color-mix(in srgb,var(--klic-component-block-color-soft) 85%,transparent) 2px, color-mix(in srgb,var(--klic-component-block-color-soft) 85%,transparent) 6px)',
                          }}
                          title="클릭하여 추천 스페셜리스트에게 배정"
                          className="absolute top-0.5 bottom-0.5 rounded-full border border-[color:var(--klic-component-block-color-border)]  px-3.5 flex items-center text-xs font-medium text-zinc-700  hover:border-[color:var(--klic-component-block-color-accent)] transition-all truncate"
                        >
                          <span className="truncate">{os.clientName}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 스페셜리스트 행 목록 (9명) */}
                  <div className="space-y-1">
                    {filteredCapsuleRows.map((row) => (
                      <div
                        key={row.id}
                        className="grid grid-cols-[200px_1fr] items-center py-1.5 px-3 rounded-xl hover:bg-zinc-50/70  transition-colors"
                      >
                        {/* 좌측 아바타 + 이름 + 주황 알림 점 */}
                        <div className="flex items-center gap-3 pr-3 min-w-0">
                          <PersonAvatar
                            src={row.avatar}
                            alt={row.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200  shrink-0"
                          />
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-xs font-semibold text-zinc-800  truncate">
                              {row.name.split(' (')[0]}
                            </span>
                            {row.hasAlertDot && (
                              <span
                                title="일정 확인 또는 이동 여유 시간 주의"
                                className="w-2 h-2 rounded-full bg-amber-500 shrink-0"
                              />
                            )}
                          </div>
                        </div>

                        {/* 우측 캡슐 트랙 */}
                        <div className="relative h-10">
                          {row.shifts.map((shift) => {
                            const left = toOptLeft(shift.startHour);
                            const width = toOptWidth(
                              shift.startHour,
                              shift.endHour
                            );
                            const dimmed =
                              legendFilter !== 'all' &&
                              shift.status !== legendFilter;

                            let pillClass =
                              'bg-[var(--klic-component-block-color-soft)]  text-zinc-900  font-medium';
                            if (shift.status === 'done') {
                              pillClass =
                                'bg-[var(--klic-component-block-color-soft)]  text-[color:var(--klic-component-block-color-muted)]  font-medium';
                            } else if (shift.status === 'in-progress') {
                              pillClass =
                                'bg-[var(--klic-component-block-color-accent)] text-zinc-950 font-semibold shadow-2xs z-10';
                            } else if (shift.status === 'needs-attention') {
                              pillClass =
                                'bg-[var(--klic-component-block-color-soft)]  border border-[color:var(--klic-component-block-color-danger)] text-[color:var(--klic-component-block-color-danger)]  font-medium';
                            } else if (shift.status === 'suggestion') {
                              pillClass =
                                'bg-[var(--klic-component-block-color-soft)]  border border-dashed border-[color:var(--klic-component-block-color-accent)] text-[color:var(--klic-component-block-color-accent)]  font-semibold';
                            }

                            return (
                              <button
                                key={shift.id}
                                onClick={() =>
                                  setSelectedCapsule({
                                    ownerName: row.name,
                                    shift,
                                  })
                                }
                                style={{ left: `${left}%`, width: `${width}%` }}
                                className={`absolute top-0.5 bottom-0.5 rounded-full px-3.5 flex items-center text-xs transition-all truncate ${pillClass} ${
                                  dimmed
                                    ? 'opacity-25'
                                    : 'hover:scale-[1.01] hover:shadow-xs'
                                }`}
                              >
                                <span className="truncate">
                                  {shift.clientName}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 하단 상태 범례 (Done · In progress · Scheduled · Needs attention · Open shift · Suggestion) */}
            <div className="pt-3 border-t border-zinc-100  flex flex-wrap items-center gap-5 text-xs text-klic-muted ">
              {[
                {
                  id: 'done' as PillStatus,
                  label: '완료됨 (Done)',
                  dotClass: 'bg-[var(--klic-component-block-color-soft)] ',
                },
                {
                  id: 'in-progress' as PillStatus,
                  label: '수행 중 (In progress)',
                  dotClass: 'bg-[var(--klic-component-block-color-accent)]',
                },
                {
                  id: 'scheduled' as PillStatus,
                  label: '예정됨 (Scheduled)',
                  dotClass: 'bg-[var(--klic-component-block-color-soft)] ',
                },
                {
                  id: 'needs-attention' as PillStatus,
                  label: '주의 필요 (Needs attention)',
                  dotClass: 'bg-[var(--klic-component-block-color-soft)] border border-[color:var(--klic-component-block-color-danger)]',
                },
                {
                  id: 'open-shift' as PillStatus,
                  label: "미배정 근무",
                  dotClass: 'border border-zinc-400 bg-zinc-200',
                },
                {
                  id: 'suggestion' as PillStatus,
                  label: '스마트 배정 추천 (Suggestion)',
                  dotClass: 'bg-[var(--klic-component-block-color-soft)] border border-[color:var(--klic-component-block-color-accent)]',
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    setLegendFilter((prev) =>
                      prev === item.id ? 'all' : item.id
                    )
                  }
                  className={`inline-flex items-center gap-2 transition-opacity ${
                    legendFilter !== 'all' && legendFilter !== item.id
                      ? 'opacity-40'
                      : 'opacity-100'
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full inline-block ${item.dotClass}`}
                  />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeMode === 'dispatch' && (
        <div className="p-5 sm:p-7 bg-[var(--klic-component-block-color-soft)]  space-y-5">
          {/* 상단 브레드크럼 (Operations > Schedule) */}
          <div className="flex items-center justify-between border-b border-zinc-200/80  pb-3.5">
            <div className="flex items-center gap-2 text-xs text-klic-muted ">
              <PanelLeft className="w-4 h-4 text-klic-muted" />
              <span className="text-klic-muted ">|</span>
              <span>운영 관제</span>
              <ChevronRight className="w-3.5 h-3.5 text-klic-muted" />
              <span className="font-semibold text-zinc-900 ">
                일정
              </span>
            </div>
            <span className="text-[11px] font-mono text-klic-muted">
              실시간 동기화 · 08:46 KST
            </span>
          </div>

          {/* 메인 타이틀 & 우측 컨트롤 바 */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 ">
                일정
              </h2>
              <p className="text-xs sm:text-sm text-klic-muted  mt-0.5">
                {currentDateObj.short} · 총 {48 - unassignedVisits.length + 3}건 방문 배정 · 근무 중 스페셜리스트 14명
              </p>
            </div>

            {/* 우측 날짜 이동 / 일간·주간 / 담당자·고객사 토글 */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* < Today > */}
              <div className="inline-flex items-center gap-1">
                <button
                  onClick={() => setDayOffset((d) => Math.max(-1, d - 1))}
                  className="w-8 h-8 rounded-lg border border-zinc-200  bg-white  flex items-center justify-center text-klic-muted  hover:bg-zinc-50"
                  aria-label="이전 날짜"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDayOffset(0)}
                  className="px-3.5 h-8 rounded-lg border border-zinc-200  bg-white  text-xs font-semibold text-zinc-800  hover:bg-zinc-50"
                >
                  오늘
                </button>
                <button
                  onClick={() => setDayOffset((d) => Math.min(1, d + 1))}
                  className="w-8 h-8 rounded-lg border border-zinc-200  bg-white  flex items-center justify-center text-klic-muted  hover:bg-zinc-50"
                  aria-label="다음 날짜"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day | Week */}
              <div className="inline-flex items-center p-1 rounded-xl bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/70 ">
                <button
                  onClick={() => setViewSpan('day')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    viewSpan === 'day'
                      ? 'bg-white  text-zinc-900  shadow-2xs'
                      : 'text-klic-muted hover:text-zinc-800'
                  }`}
                >
                  일간
                </button>
                <button
                  onClick={() => setViewSpan('week')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    viewSpan === 'week'
                      ? 'bg-white  text-zinc-900  shadow-2xs'
                      : 'text-klic-muted hover:text-zinc-800'
                  }`}
                >
                  주간
                </button>
              </div>

              {/* Caregivers | Clients */}
              <div className="inline-flex items-center p-1 rounded-xl bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/70 ">
                <button
                  onClick={() => setPivotBy('caregivers')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    pivotBy === 'caregivers'
                      ? 'bg-white  text-zinc-900  shadow-2xs'
                      : 'text-klic-muted hover:text-zinc-800'
                  }`}
                >
                  담당 인력
                </button>
                <button
                  onClick={() => setPivotBy('clients')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    pivotBy === 'clients'
                      ? 'bg-white  text-zinc-900  shadow-2xs'
                      : 'text-klic-muted hover:text-zinc-800'
                  }`}
                >
                  고객사
                </button>
              </div>
            </div>
          </div>

          {/* 대체 인력 즉시 배정 팝오버 바 (미배정 카드 클릭 시 노출) */}
          {selectedCoverVisit && (
            <div className="p-3.5 rounded-xl bg-red-50/90  border border-red-200  flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs">
                <span className="font-bold text-red-700 ">
                  긴급 대체 인력 배정:
                </span>
                <span className="font-semibold text-zinc-900 ">
                  {selectedCoverVisit.clientName} ({selectedCoverVisit.timeLabel})
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {specialists.slice(0, 4).map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() =>
                      handleAssignCoverToSpecialist(selectedCoverVisit, sp.id)
                    }
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white  border border-red-200  hover:bg-red-100/60 text-zinc-800 "
                  >
                    <PersonAvatar
                      src={sp.avatar}
                      alt={sp.name}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    {sp.name.split(' ')[0]}에게 배정
                  </button>
                ))}
                <button
                  onClick={() => setSelectedCoverVisit(null)}
                  className="p-1 text-klic-muted hover:text-zinc-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 선택된 방문 블록 상세 인스펙터 바 */}
          {selectedVisitInfo && (
            <div className="p-3.5 rounded-xl bg-klic-inverse text-klic-on-emphasis  flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono px-2 py-0.5 rounded bg-white/15">
                  {selectedVisitInfo.visit.timeLabel}
                </span>
                <span className="font-bold text-sm">
                  {selectedVisitInfo.visit.clientName}
                </span>
                <span className="text-klic-muted">
                  담당: {selectedVisitInfo.specialistName}
                </span>
              </div>
              <button
                onClick={() => setSelectedVisitInfo(null)}
                className="text-klic-muted hover:text-klic-on-emphasis"
              >
                닫기 ✕
              </button>
            </div>
          )}

          {/* 메인 스케줄 타임라인 프레임 (첨부 이미지의 스톤 베이지 프레임 + 화이트 타임그리드) */}
          <div className="rounded-2xl bg-[var(--klic-component-block-color-soft)]  p-2 sm:p-3 border border-zinc-200/90  shadow-2xs">
            {/* 상단 서브헤더: MON, OCT 5 · BY CAREGIVER  |  □ CONFIRMED  ■ IN PROGRESS */}
            <div className="px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono tracking-wider uppercase text-klic-muted ">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-klic-muted" />
                <span className="font-semibold">
                  {currentDateObj.upper} ·{' '}
                  {pivotBy === 'caregivers'
                    ? '담당 인력 기준 (BY SPECIALIST)'
                    : '고객사 기준 (BY CLIENT)'}
                </span>
              </div>

              <div className="flex items-center gap-5">
                <button
                  onClick={() =>
                    setStatusFilter((s) =>
                      s === 'confirmed' ? 'all' : 'confirmed'
                    )
                  }
                  className={`inline-flex items-center gap-1.5 transition-opacity ${
                    statusFilter === 'in-progress' ? 'opacity-45' : 'opacity-100'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-[3px] bg-white border border-zinc-300 inline-block" />
                  <span>배정 확정</span>
                </button>
                <button
                  onClick={() =>
                    setStatusFilter((s) =>
                      s === 'in-progress' ? 'all' : 'in-progress'
                    )
                  }
                  className={`inline-flex items-center gap-1.5 transition-opacity ${
                    statusFilter === 'confirmed' ? 'opacity-45' : 'opacity-100'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-[3px] bg-klic-inverse  inline-block" />
                  <span>수행 중</span>
                </button>
              </div>
            </div>

            {/* 내부 화이트 타임라인 테이블 */}
            <div className="mt-1 rounded-xl bg-white  border border-zinc-200/80  overflow-x-auto">
              <div className="min-w-[980px] relative">
                {/* 시간 축 헤더 행 */}
                <div className="grid grid-cols-[230px_1fr] border-b border-zinc-200/80  bg-white  sticky top-0 z-20">
                  <div className="px-4 py-3 text-[11px] font-mono tracking-wider uppercase text-klic-muted  border-r border-zinc-200/80 ">
                    담당 인력 · 금일 배정 시간
                  </div>

                  {/* 우측 시간 눈금 + 현재 시각 8:46 배지 */}
                  <div className="relative h-10 flex items-center">
                    {HOURS_AXIS.map((h) => {
                      const leftPct = toLeftPercent(h.hour);
                      return (
                        <div
                          key={h.hour}
                          style={{ left: `${leftPct}%` }}
                          className="absolute -translate-x-1/2 text-[11px] font-mono text-klic-muted  select-none"
                        >
                          {h.label}
                        </div>
                      );
                    })}

                    {/* 현재 시각 8:46 블랙 캡슐 배지 */}
                    <div
                      style={{ left: `${currentLineLeft}%` }}
                      className="absolute -translate-x-1/2 z-30 px-2 py-0.5 rounded-md bg-klic-inverse  text-klic-on-emphasis  text-[11px] font-mono font-bold shadow-xs"
                    >
                      8:46
                    </div>
                  </div>
                </div>

                {/* 전체 행을 관통하는 세로 8:46 현재 시각 실선 */}
                <div
                  style={{ left: `calc(230px + (100% - 230px) * ${currentLineLeft / 100})` }}
                  className="pointer-events-none absolute top-9 bottom-0 w-[1.5px] bg-klic-inverse  z-20"
                />

                {/* 0번째 특별 행: Needs cover (대체 인력 필요) */}
                <div className="grid grid-cols-[230px_1fr] border-b border-zinc-200/80  bg-white ">
                  <div className="px-4 py-3.5 border-r border-zinc-200/80  flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-50  border border-red-100  flex items-center justify-center text-red-600  shrink-0">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-red-700  truncate">
                        대체 인력 필요
                      </div>
                      <div className="text-[11px] font-mono text-klic-muted ">
                        금일 미배정 {unassignedVisits.length}건
                      </div>
                    </div>
                  </div>

                  {/* 우측 타임라인 슬롯 (Needs cover 점선 레드 카드) */}
                  <div className="relative h-[68px]">
                    {HOURS_AXIS.map((h) => (
                      <React.Fragment key={h.hour}>
                        <div
                          style={{ left: `${toLeftPercent(h.hour)}%` }}
                          className="absolute top-0 bottom-0 border-l border-dotted border-zinc-200  pointer-events-none"
                        />
                        <div
                          style={{ left: `${toLeftPercent(h.hour + 0.5)}%` }}
                          className="absolute top-0 bottom-0 border-l border-dotted border-zinc-200/60  pointer-events-none"
                        />
                      </React.Fragment>
                    ))}

                    {unassignedVisits.map((uv) => {
                      const left = toLeftPercent(uv.startHour);
                      const width = toWidthPercent(uv.startHour, uv.endHour);
                      return (
                        <button
                          key={uv.id}
                          onClick={() => setSelectedCoverVisit(uv)}
                          style={{ left: `${left}%`, width: `${width}%` }}
                          className="absolute top-2.5 bottom-2.5 rounded-lg bg-[var(--klic-component-block-color-soft)]  border border-dashed border-red-400  px-2.5 py-1.5 text-left hover:bg-red-100/80 transition-colors overflow-hidden"
                        >
                          <div className="text-xs font-semibold text-red-900  truncate">
                            {uv.clientName}
                          </div>
                          <div className="text-[11px] font-mono text-red-700  truncate">
                            {uv.timeLabel}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 담당 스페셜리스트 행 목록 */}
                {specialists.map((sp) => (
                  <div
                    key={sp.id}
                    className="grid grid-cols-[230px_1fr] border-b border-zinc-200/70  last:border-b-0 hover:bg-zinc-50/40  transition-colors"
                  >
                    <div className="px-4 py-3 border-r border-zinc-200/80  flex items-center gap-3">
                      <PersonAvatar
                        src={sp.avatar}
                        alt={sp.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-200  shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-zinc-900  truncate">
                          {sp.name}
                        </div>
                        <div className="text-[11px] font-mono text-klic-muted  truncate mt-0.5">
                          {sp.roleCode} · {sp.hoursToday.toFixed(1)} h
                        </div>
                      </div>
                    </div>

                    <div className="relative h-[68px]">
                      {HOURS_AXIS.map((h) => (
                        <React.Fragment key={h.hour}>
                          <div
                            style={{ left: `${toLeftPercent(h.hour)}%` }}
                            className="absolute top-0 bottom-0 border-l border-dotted border-zinc-200  pointer-events-none"
                          />
                          <div
                            style={{ left: `${toLeftPercent(h.hour + 0.5)}%` }}
                            className="absolute top-0 bottom-0 border-l border-dotted border-zinc-200/60  pointer-events-none"
                          />
                        </React.Fragment>
                      ))}

                      {sp.visits.map((visit, vIdx) => {
                        const left = toLeftPercent(visit.startHour);
                        const width = toWidthPercent(visit.startHour, visit.endHour);
                        const nextVisit = sp.visits[vIdx + 1];

                        const isDimmed =
                          (statusFilter === 'confirmed' &&
                            visit.status !== 'confirmed') ||
                          (statusFilter === 'in-progress' &&
                            visit.status !== 'in-progress');

                        let cardStyle =
                          'bg-white  border border-zinc-200/95  text-zinc-900  shadow-2xs';
                        let timeStyle = 'text-klic-muted ';

                        if (visit.status === 'in-progress') {
                          cardStyle =
                            'bg-klic-inverse  border border-zinc-900  text-klic-on-emphasis  shadow-sm z-10';
                          timeStyle = 'text-klic-muted ';
                        } else if (visit.status === 'completed') {
                          cardStyle =
                            'bg-[var(--klic-component-block-color-border)]  border border-[color:var(--klic-component-block-color-border)]  text-zinc-700 ';
                          timeStyle = 'text-klic-muted ';
                        } else if (visit.status === 'warning') {
                          cardStyle =
                            'bg-[var(--klic-component-block-color-soft)]  border border-amber-400/90  text-amber-950 ';
                          timeStyle = 'text-amber-800/90 ';
                        }

                        return (
                          <React.Fragment key={visit.id}>
                            <button
                              onClick={() =>
                                setSelectedVisitInfo({
                                  specialistName: sp.name,
                                  visit,
                                })
                              }
                              style={{ left: `${left}%`, width: `${width}%` }}
                              className={`absolute top-2.5 bottom-2.5 rounded-lg px-2.5 py-1.5 text-left transition-all overflow-hidden ${cardStyle} ${
                                isDimmed ? 'opacity-30' : 'hover:scale-[1.01]'
                              }`}
                            >
                              <div className="text-xs font-semibold truncate">
                                {visit.clientName}
                              </div>
                              <div
                                className={`text-[11px] font-mono truncate ${timeStyle}`}
                              >
                                {visit.timeLabel}
                              </div>
                            </button>

                            {visit.travelMinutesAfter && nextVisit && (
                              <div
                                style={{
                                  left: `${toLeftPercent(visit.endHour)}%`,
                                  width: `${toWidthPercent(
                                    visit.endHour,
                                    nextVisit.startHour
                                  )}%`,
                                }}
                                className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none px-1"
                              >
                                <div className="w-full border-t border-dotted border-zinc-400  flex items-center justify-center">
                                  <span className="bg-white  px-1 text-[10px] font-mono text-klic-muted  -mt-2">
                                    {visit.travelMinutesAfter}m
                                  </span>
                                </div>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
