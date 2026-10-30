import { PersonAvatar } from '../PersonAvatar';
import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Box,
  MoreVertical,
  Check,
  Copy,
  RefreshCw,
  Camera,
  ShoppingBag,
  SlidersHorizontal,
  TrendingUp,
  Zap,
} from 'lucide-react';

export type CardShowcaseMode =
  | 'all-showcase'
  | 'project-trio'
  | 'play-mode-hero'
  | 'always-on-watch'
  | 'partner-split'
  | 'delivery-details'
  | 'meeting-dual';

interface CardShowcaseBlockProps {
  initialMode?: CardShowcaseMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

interface ProjectTrioItem {
  id: string;
  title: string;
  client: string;
  dueRemaining: string;
  iconType: 'bag' | 'sliders' | 'trend';
}

interface PartnerBrand {
  id: string;
  name: string;
  category: string;
  region: string;
  uptimeOrMetric: string;
  description: string;
  renderIcon: () => React.ReactNode;
}

interface DeliveryOrder {
  id: string;
  title: string;
  address: string;
  placeTag: string;
  duration: string;
  updatedAgo: string;
  trackingCode: string;
  trackingStatus: string;
  noteTitle: string;
  noteBody: string;
  courierName: string;
  courierPhone: string;
}

interface MeetingItem {
  id: string;
  headerLabel: string;
  title: string;
  duration: string;
  timeText: string;
  description: string;
  avatars: string[];
  participantNames: string[];
  extraCount: number;
  meetingType: string;
  platform: 'meet' | 'zoom';
  joinLabel: string;
}

const PROJECT_TRIO_ITEMS: ProjectTrioItem[] = [
  {
    id: 'proj-1',
    title: '모바일 뱅킹 앱 고도화',
    client: '한빛핀테크',
    dueRemaining: '1일 18시간',
    iconType: 'bag',
  },
  {
    id: 'proj-2',
    title: '가상자산 포트폴리오 대시보드',
    client: '두나무클라우드',
    dueRemaining: '2일 20시간',
    iconType: 'sliders',
  },
  {
    id: 'proj-3',
    title: '실시간 데이터 분석 모듈',
    client: '더존비즈온',
    dueRemaining: '3일 6시간',
    iconType: 'trend',
  },
];

const SPONSOR_BRANDS: PartnerBrand[] = [
  {
    id: 'sp-leaf',
    name: '토스페이 코어',
    category: '고속 정산 엔진',
    region: '서울 · 도쿄 리전',
    uptimeOrMetric: '승인 속도 42ms',
    description: '대규모 동시 결제 트랜잭션을 지연 없이 분산 처리하는 인메모리 정산 스폰서입니다.',
    renderIcon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="var(--klic-component-block-color-accent)" />
        <path
          d="M15.5 8.5C13.2 8.5 9.5 10.2 8.5 15.5C13.8 14.5 15.5 10.8 15.5 8.5Z"
          fill="var(--runtime-emphasis-ink)"
        />
      </svg>
    ),
  },
  {
    id: 'sp-flame',
    name: '카카오페이 체크아웃',
    category: '실시간 결제 가속',
    region: '글로벌 엣지',
    uptimeOrMetric: '전환율 +14.8%',
    description: '원클릭 생체 인증과 스마트 라우팅으로 결제 이탈률을 최소화하는 결제 스폰서입니다.',
    renderIcon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path
          d="M12.8 3.2C12.4 6.4 9.5 7.8 9.5 11.2C9.5 12.9 10.7 14.2 12.3 14.2C14.1 14.2 15.2 12.7 15.2 10.9C15.2 9.8 14.8 8.7 14.3 7.9C16.8 9.2 18.5 11.7 18.5 14.6C18.5 18.4 15.6 21 12 21C8.4 21 5.5 18.4 5.5 14.5C5.5 10.1 9.1 6.7 12.8 3.2Z"
          fill="var(--klic-component-block-color-warning)"
        />
        <path
          d="M12 21C10.1 21 8.7 19.6 8.7 17.7C8.7 15.8 10.4 14.3 12 12.8C13.6 14.3 15.3 15.8 15.3 17.7C15.3 19.6 13.9 21 12 21Z"
          fill="var(--klic-component-block-color-warning)"
        />
      </svg>
    ),
  },
  {
    id: 'sp-bridge',
    name: '채널톡 커넥트',
    category: '구독 빌링 메시징',
    region: '아시아 · 북미',
    uptimeOrMetric: '가동률 99.99%',
    description: '구독 갱신 알림과 인앱 영수증 웹훅을 실시간 동기화하는 공식 기술 스폰서입니다.',
    renderIcon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect x="2.5" y="4.5" width="19" height="15" rx="7.5" fill="var(--klic-component-block-color-accent)" />
        <circle cx="9.2" cy="12" r="1.6" fill="var(--runtime-emphasis-ink)" />
        <circle cx="14.8" cy="12" r="1.6" fill="var(--runtime-emphasis-ink)" />
        <path
          d="M8.5 15.2C9.6 16.1 14.4 16.1 15.5 15.2"
          stroke="var(--runtime-emphasis-ink)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'sp-prism',
    name: '업비트 원장 네트워크',
    category: '분산 정산 검증',
    region: '멀티 리전',
    uptimeOrMetric: '검증 0.3초',
    description: '국가 간 다중 통화 정산 내역을 위변조 불가능한 원장으로 검증하는 파트너입니다.',
    renderIcon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3L19.8 7.5V16.5L12 21L4.2 16.5V7.5L12 3Z"
          stroke="var(--klic-component-block-color-accent)"
          strokeWidth="2"
          fill="var(--klic-component-block-color-soft)"
        />
        <path
          d="M12 7L16.3 9.5V14.5L12 17L7.7 14.5V9.5L12 7Z"
          fill="var(--klic-component-block-color-accent)"
        />
      </svg>
    ),
  },
];

const AFFILIATE_BRANDS: PartnerBrand[] = [
  {
    id: 'af-cube',
    name: '메가존클라우드',
    category: '글로벌 리셀러 파트너',
    region: '유럽 · 북미 14개국',
    uptimeOrMetric: '제휴 매출 ₩18.4억',
    description: '유럽 및 북미 엔터프라이즈 고객사에 당사 솔루션을 공급하는 최우수 공인 파트너입니다.',
    renderIcon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M12 3.5L20 7.8L12 12.1L4 7.8L12 3.5Z" fill="var(--klic-component-block-color-danger)" />
        <path d="M20 12L12 16.3L4 12" stroke="var(--klic-component-block-color-danger)" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M20 16.2L12 20.5L4 16.2" stroke="var(--klic-component-block-color-danger)" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'af-bolt',
    name: '베스핀글로벌 벤처스',
    category: '기술 도입 컨설팅',
    region: '한국 · 싱가포르 · 일본',
    uptimeOrMetric: '도입 고객 140+사',
    description: '아태지역 금융 및 커머스 기업을 대상으로 구축 컨설팅을 수행하는 공식 제휴사입니다.',
    renderIcon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path
          d="M13.5 3L5.5 13.5H12L10.5 21L18.5 10.5H12L13.5 3Z"
          fill="var(--klic-component-block-color-accent)"
          stroke="var(--klic-component-block-color-accent)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'af-ring',
    name: '제일기획 글로벌 네트워크',
    category: '공인 마케팅 에이전시',
    region: '글로벌 22개 권역',
    uptimeOrMetric: '리드 전환 34.2%',
    description: '다국어 현지화 캠페인과 엔터프라이즈 웨비나를 공동 운영하는 글로벌 제휴사입니다.',
    renderIcon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" stroke="var(--klic-component-block-color-warning)" strokeWidth="3.5" />
        <path d="M12 4A8 8 0 0 1 20 12" stroke="var(--klic-component-block-color-danger)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M4 12A8 8 0 0 1 12 4" stroke="var(--klic-component-block-color-warning)" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" fill="var(--runtime-emphasis-ink)" />
      </svg>
    ),
  },
  {
    id: 'af-store',
    name: '네이버클라우드 마켓플레이스',
    category: '엔터프라이즈 스토어',
    region: '북미 · 아시아 태평양',
    uptimeOrMetric: '월간 설치 4.8만건',
    description: '사내 워크스페이스 생태계에 원클릭 플러그인 형태로 솔루션을 배포하는 제휴 채널입니다.',
    renderIcon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="5" fill="var(--klic-component-block-color-accent)" />
        <path
          d="M12 6.8L7.5 16.5M12 6.8L16.5 16.5M9 13.8H15"
          stroke="var(--runtime-emphasis-ink)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const DELIVERY_ORDERS: DeliveryOrder[] = [
  {
    id: 'del-1',
    title: '배송 상세 정보',
    address: '서울특별시 강남구 테헤란로 135, 06132',
    placeTag: '자택',
    duration: '37분 23초',
    updatedAgo: '24분 전',
    trackingCode: '#KR-54321-SEOUL',
    trackingStatus: '실시간 배송 추적',
    noteTitle: '배송 메모',
    noteBody:
      '기사님이 공동현관 앞 배송 완료를 확인했으며, 주문 내역에 배송 완료 인증 사진이 업로드되었습니다.',
    courierName: '김태현 전담 기사',
    courierPhone: '010-8421-3902',
  },
  {
    id: 'del-2',
    title: '특송 화물 상세 정보',
    address: '경기도 성남시 분당구 판교역로 235, H스퀘어 N동',
    placeTag: '오피스',
    duration: '18분 40초',
    updatedAgo: '6분 전',
    trackingCode: '#KR-90812-PANGYO',
    trackingStatus: '실시간 온도·위치 관제',
    noteTitle: '배송 메모',
    noteBody:
      '보안 데스크 수령인 서명 확인 후 8층 서버실 장비 보관함 인계가 완료되어 인수증이 첨부되었습니다.',
    courierName: '박준영 특송 매니저',
    courierPhone: '010-5219-7740',
  },
];

const INITIAL_MEETINGS: MeetingItem[] = [
  {
    id: 'mtg-1',
    participantNames: ['한소윤', '이서연', '강태우'],
    headerLabel: '미팅 일정',
    title: '아폴로 CRM - 스프린트 플래닝',
    duration: '30분',
    timeText: '오전 09:00 KST',
    description:
      '다음 개발 단계의 병목 이슈를 해결하고 담당 태스크를 배정하며 핵심 산출물을 확정하기 위한 협업 스프린트 계획 회의입니다.',
    avatars: [
      './placeholders/avatar-576a55580552.svg',
      './placeholders/avatar-d36430bc2634.svg',
      './placeholders/avatar-ef94a3ac14b1.svg',
    ],
    extraCount: 3,
    meetingType: '클라이언트 미팅',
    platform: 'meet',
    joinLabel: '회의 참여하기',
  },
  {
    id: 'mtg-2',
    participantNames: ['김미라', '정유진', '박준영'],
    headerLabel: '미팅 일정',
    title: '델타 파이낸스 - 예산 조율 회의',
    duration: '90분',
    timeText: '오전 11:30 KST',
    description:
      '재무팀 및 운영 본부와 함께 분기별 지출 내역을 검토하고 예측치를 조정하며 부서 간 예산을 조율하는 회의입니다.',
    avatars: [
      './placeholders/avatar-352373979408.svg',
      './placeholders/avatar-8c2580aea9a4.svg',
      './placeholders/avatar-f0911aecec62.svg',
    ],
    extraCount: 3,
    meetingType: '내부 회의',
    platform: 'zoom',
    joinLabel: '회의 참여하기',
  },
];

function ShareForwardIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 6L20 11L15 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 11H10.5C6.9 11 4 13.9 4 17.5V18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoogleMeetIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <path d="M4 7.5C4 6.4 4.9 5.5 6 5.5H13.5V12L4 12V7.5Z" fill="var(--klic-component-block-color-danger)" />
      <path d="M4 12H13.5V18.5H6C4.9 18.5 4 17.6 4 16.5V12Z" fill="var(--klic-component-block-color-accent)" />
      <path d="M13.5 5.5H16C17.1 5.5 18 6.4 18 7.5V12H13.5V5.5Z" fill="var(--klic-component-block-color-warning)" />
      <path d="M13.5 12H18V16.5C18 17.6 17.1 18.5 16 18.5H13.5V12Z" fill="var(--klic-component-block-color-accent)" />
      <path
        d="M18 9.8L21.2 7.2C21.6 6.9 22.2 7.2 22.2 7.7V16.3C22.2 16.8 21.6 17.1 21.2 16.8L18 14.2V9.8Z"
        fill="var(--klic-component-block-color-accent)"
      />
    </svg>
  );
}

function ZoomVideoIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="var(--klic-component-block-color-accent)" />
      <rect x="6.5" y="8.5" width="7.5" height="7" rx="1.6" fill="var(--runtime-emphasis-ink)" />
      <path d="M14.5 10.6L17.6 8.8V15.2L14.5 13.4V10.6Z" fill="var(--runtime-emphasis-ink)" />
    </svg>
  );
}

function VortexKnotIcon() {
  return (
    <svg className="w-6 h-6 text-zinc-800 " viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4.5C9.5 4.5 7.5 6.5 7.5 9C7.5 10.2 8 11.3 8.8 12.1M12 4.5C14.5 4.5 16.5 6.5 16.5 9C16.5 10.2 16 11.3 15.2 12.1M12 4.5V9M19.5 12C19.5 9.5 17.5 7.5 15 7.5M19.5 12C19.5 14.5 17.5 16.5 15 16.5C13.8 16.5 12.7 16 11.9 15.2M19.5 12H15M12 19.5C14.5 19.5 16.5 17.5 16.5 15M12 19.5C9.5 19.5 7.5 17.5 7.5 15C7.5 13.8 8 12.7 8.8 11.9M12 19.5V15M4.5 12C4.5 14.5 6.5 16.5 9 16.5M4.5 12C4.5 9.5 6.5 7.5 9 7.5C10.2 7.5 11.3 8 12.1 8.8M4.5 12H9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FourColorSparkleIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L14.8 9.2L12 12L9.2 9.2L12 2Z" fill="var(--klic-component-block-color-accent)" />
      <path d="M22 12L14.8 14.8L12 12L14.8 9.2L22 12Z" fill="var(--klic-component-block-color-accent)" />
      <path d="M12 22L9.2 14.8L12 12L14.8 14.8L12 22Z" fill="var(--klic-component-block-color-warning)" />
      <path d="M2 12L9.2 9.2L12 12L9.2 14.8L2 12Z" fill="var(--klic-component-block-color-danger)" />
    </svg>
  );
}

function GoldenCubeIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3.5L19.5 7.8V16.2L12 20.5L4.5 16.2V7.8L12 3.5Z"
        fill="var(--klic-component-block-color-border)"
        stroke="var(--klic-component-block-color-warning)"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M4.8 8L12 12.2L19.2 8M12 12.2V20.2"
        stroke="var(--klic-component-block-color-warning)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GreenNodesIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <circle cx="6.5" cy="12" r="2.2" stroke="var(--klic-component-block-color-accent)" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.2" stroke="var(--klic-component-block-color-accent)" strokeWidth="1.8" />
      <circle cx="17.5" cy="9" r="2.2" stroke="var(--klic-component-block-color-accent)" strokeWidth="1.8" />
      <circle cx="17.5" cy="15.5" r="2.2" stroke="var(--klic-component-block-color-accent)" strokeWidth="1.8" />
      <path
        d="M8.7 12H9.8M14 11L15.5 10M14 13L15.5 14.3"
        stroke="var(--klic-component-block-color-accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CardShowcaseBlock({
  initialMode = 'all-showcase',
  density = 'normal',
}: CardShowcaseBlockProps) {
  const [activeMode, setActiveMode] = useState<CardShowcaseMode>(initialMode);
  const [sharedProjectId, setSharedProjectId] = useState<string | null>(null);
  const [isDemoTradingActive, setIsDemoTradingActive] = useState(false);
  const [isMonitoringActive, setIsMonitoringActive] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<PartnerBrand | null>(null);
  const [activeDeliveryIdx, setActiveDeliveryIdx] = useState(0);
  const [showDeliveryPhotoModal, setShowDeliveryPhotoModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [joinedMeetingIds, setJoinedMeetingIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  React.useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  const currentDelivery = DELIVERY_ORDERS[activeDeliveryIdx] || DELIVERY_ORDERS[0];

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleShareProject = (proj: ProjectTrioItem) => {
    navigator.clipboard?.writeText(`${proj.title} - ${proj.client} (마감: ${proj.dueRemaining})`);
    setSharedProjectId(proj.id);
    setTimeout(() => setSharedProjectId(null), 1800);
  };

  const toggleJoinMeeting = (id: string) => {
    setJoinedMeetingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const padClass =
    density === 'compact' ? 'p-4' : density === 'relaxed' ? 'p-6' : 'p-5';

  // 스타일 1: 3열 프로젝트 마감 & 공유 액션 카드 (KLIC/card-21)
  const renderProjectTrioCard = () => (
    <div className="w-full max-w-[860px] mx-auto">
      <div className="rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
          {PROJECT_TRIO_ITEMS.map((item) => {
            const isShared = sharedProjectId === item.id;
            return (
              <div
                key={item.id}
                data-klic-surface="card"
                className={`rounded-[14px] bg-white  border border-zinc-200/80  ${padClass} flex flex-col justify-between shadow-[0_1px_2px_color-mix(in_srgb,var(--klic-component-block-color-text)_2%,transparent)] hover:border-zinc-300  transition-all`}
              >
                {/* 상단: 블랙 스쿼클 아이콘 + 우측 아웃라인 공유 버튼 */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-[11px] bg-klic-inverse  text-klic-on-emphasis  flex items-center justify-center shadow-xs">
                    {item.iconType === 'bag' && <ShoppingBag className="w-4 h-4" />}
                    {item.iconType === 'sliders' && <SlidersHorizontal className="w-4 h-4" />}
                    {item.iconType === 'trend' && <TrendingUp className="w-4 h-4" />}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleShareProject(item)}
                    title="프로젝트 링크 공유"
                    data-klic-surface="control"
                    className="w-8 h-8 rounded-[9px] border border-zinc-200/90  bg-white  text-klic-muted hover:text-zinc-900  hover:bg-zinc-50  flex items-center justify-center transition-colors shadow-2xs"
                  >
                    {isShared ? (
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <ShareForwardIcon />
                    )}
                  </button>
                </div>

                {/* 하단: 프로젝트 제목 + 고객사 • 마감 시간 */}
                <div className="mt-6">
                  <h3 className="text-[14.5px] font-semibold text-zinc-900  tracking-tight">
                    {item.title}
                  </h3>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[12.5px]">
                    <span className="font-medium text-zinc-800 ">
                      {item.client}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300  mx-0.5" />
                    <span className="text-klic-muted ">마감:</span>
                    <span className="font-semibold text-zinc-900 ">
                      {item.dueRemaining}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // 스타일 2: 홀로그램 듀얼 그래픽 & 모의 트레이딩 피처 카드 (KLIC/card-22)
  const renderPlayModeHeroCard = () => (
    <div className="w-full max-w-[330px] mx-auto">
      <div className="rounded-[22px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs">
        <div data-klic-surface="card" className="rounded-[16px] bg-white  border border-zinc-200/80  px-6 py-8 flex flex-col items-center text-center shadow-[0_1px_2px_color-mix(in_srgb,var(--klic-component-block-color-text)_2%,transparent)]">
          {/* 상단 겹쳐진 틸트 그라데이션 카드 일러스트 */}
          <div className="relative h-24 w-44 flex items-center justify-center my-1 select-none">
            <div
              className={`w-[80px] h-[72px] rounded-2xl -rotate-6 transform border-[2.5px] border-white  shadow-[0_8px_20px_color-mix(in_srgb,var(--klic-component-block-color-text)_10%,transparent)] z-10 transition-transform duration-300 ${
                isDemoTradingActive ? '-rotate-12 -translate-x-1 scale-105' : ''
              }`}
              style={{
                background:
                  'linear-gradient(135deg, var(--klic-component-block-color-danger) 0%, var(--klic-component-block-color-warning) 26%, var(--klic-component-block-color-warning) 52%, var(--klic-component-block-color-accent) 78%, var(--klic-component-block-color-accent) 100%)',
              }}
            />
            <div
              className={`w-[80px] h-[72px] rounded-2xl rotate-6 -ml-3.5 mt-1.5 transform border-[2.5px] border-white  shadow-[0_8px_20px_color-mix(in_srgb,var(--klic-component-block-color-text)_12%,transparent)] z-0 transition-transform duration-300 ${
                isDemoTradingActive ? 'rotate-12 translate-x-1 scale-105' : ''
              }`}
              style={{
                background:
                  'linear-gradient(135deg, var(--klic-component-block-color-accent) 0%, var(--klic-component-block-color-accent) 52%, var(--klic-component-block-color-accent) 100%)',
              }}
            />
          </div>

          {/* 캡슐 배지 */}
          <span className="mt-5 px-3 py-0.5 rounded-full border border-zinc-200/90  bg-white  text-[11.5px] font-medium text-zinc-700  shadow-2xs">
            플레이 모드
          </span>

          {/* 메인 타이틀 */}
          <h3 className="mt-3 text-[17px] font-semibold text-zinc-900  tracking-tight">
            안전한 모의 트레이딩 연습
          </h3>

          {/* 2줄 설명 */}
          <p className="mt-2 text-[12.5px] text-klic-muted  leading-relaxed">
            실시간 시장 데이터를 분석하여 패턴을 포착하고 정밀한 매매 전략을 안전하게 검증하세요
          </p>

          {/* 하단 블랙 캡슐 CTA 버튼 */}
          <button
            type="button"
            onClick={() => setIsDemoTradingActive((v) => !v)}
            className="mt-6 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis  text-[12.5px] font-medium shadow-xs transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>
              {isDemoTradingActive ? '데모 세션 실행 중' : '데모 트레이딩 시작하기'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  // 스타일 3: 24/7 격자 캔버스 & 상시 관제 피처 카드 (KLIC/card-23)
  const renderAlwaysOnWatchCard = () => (
    <div className="w-full max-w-[380px] mx-auto">
      <div className="rounded-[22px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs">
        <div data-klic-surface="card" className="rounded-[16px] bg-white  border border-zinc-200/80  overflow-hidden flex flex-col shadow-[0_1px_2px_color-mix(in_srgb,var(--klic-component-block-color-text)_2%,transparent)]">
          {/* 상단 모눈종이 격자 그래픽 영역 */}
          <div className="relative pt-7 pb-6 px-6 border-b border-zinc-100  overflow-hidden bg-[linear-gradient(to_right,var(--klic-component-block-color-soft)_1px,transparent_1px),linear-gradient(to_bottom,var(--klic-component-block-color-soft)_1px,transparent_1px)]  bg-[size:12px_12px]">
            {/* 첫 번째 행: 24 /7 타이포그래피 + 우측 플로팅 아이콘 타일 2개 */}
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 pl-2">
                <span className="text-[44px] font-bold tracking-tight text-zinc-950  leading-none">
                  24
                </span>
                <div className="flex flex-col justify-center">
                  <span className="text-[11px] font-medium text-klic-muted  leading-tight">
                    상시 관제
                  </span>
                  <span className="text-[22px] font-bold text-klic-muted  leading-none mt-0.5">
                    /7
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 -mr-3">
                <div className="w-14 h-14 rounded-2xl bg-white  border border-zinc-200/85  shadow-[0_2px_8px_color-mix(in_srgb,var(--klic-component-block-color-text)_4%,transparent)] flex items-center justify-center">
                  <VortexKnotIcon />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white  border border-zinc-200/85  shadow-[0_2px_8px_color-mix(in_srgb,var(--klic-component-block-color-text)_4%,transparent)] flex items-center justify-center">
                  <FourColorSparkleIcon />
                </div>
              </div>
            </div>

            {/* 두 번째 행: 중앙 플로팅 아이콘 타일 2개 */}
            <div className="relative z-10 mt-3.5 flex items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white  border border-zinc-200/85  shadow-[0_2px_8px_color-mix(in_srgb,var(--klic-component-block-color-text)_4%,transparent)] flex items-center justify-center">
                <GoldenCubeIcon />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white  border border-zinc-200/85  shadow-[0_2px_8px_color-mix(in_srgb,var(--klic-component-block-color-text)_4%,transparent)] flex items-center justify-center">
                <GreenNodesIcon />
              </div>
            </div>
          </div>

          {/* 하단 텍스트 및 시작 버튼 영역 */}
          <div className="px-6 py-6 text-center flex flex-col items-center bg-white ">
            <h3 className="text-[16.5px] font-semibold text-zinc-900  tracking-tight">
              24시간 상시 감시 체계
            </h3>
            <p className="mt-2 text-[12.5px] text-klic-muted  leading-relaxed max-w-[280px]">
              밤낮없이 작동하는 자동화 관제 도구로 시장 활동과 이상 징후를 빈틈없이 감독합니다.
            </p>
            <button
              type="button"
              onClick={() => setIsMonitoringActive((v) => !v)}
              className="mt-5 px-4 py-2 rounded-lg bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis  text-[12px] font-medium shadow-xs transition-all cursor-pointer"
            >
              {isMonitoringActive ? '실시간 관제 가동 중' : '실시간 관제 시작'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // 스타일 4: 스폰서 & 공식 제휴사 듀얼 인셋 카드 (KLIC/card-13)
  const renderPartnerSplitCard = () => (
    <div className="w-full max-w-[760px] mx-auto">
      <div className="rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          {/* 좌측: 스폰서 파트너 */}
          <div
            className={`rounded-[14px] bg-white  border border-zinc-200/80  ${padClass} flex flex-col justify-between shadow-[0_1px_2px_color-mix(in_srgb,var(--klic-component-block-color-text)_2%,transparent)]`}
          >
            <div>
              <h3 className="text-[15px] font-semibold text-zinc-900  tracking-tight">
                스폰서 파트너
              </h3>
              <p className="text-[13px] text-klic-muted  leading-relaxed mt-2">
                빠른 결제 처리 속도와 일관된 고성능 트랜잭션을 보장하기 위해 구축된 결제 인프라입니다.
              </p>
            </div>

            <div className="mt-5 flex items-center gap-2.5">
              {SPONSOR_BRANDS.map((brand) => {
                const isSelected = selectedBrand?.id === brand.id;
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => setSelectedBrand(isSelected ? null : brand)}
                    title={brand.name}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-zinc-900  bg-zinc-50  ring-2 ring-zinc-900/10 scale-105'
                        : 'border-zinc-200/85  bg-white  hover:border-zinc-300  hover:-translate-y-0.5'
                    } shadow-2xs`}
                  >
                    {brand.renderIcon()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 우측: 공식 제휴사 */}
          <div
            className={`rounded-[14px] bg-white  border border-zinc-200/80  ${padClass} flex flex-col justify-between shadow-[0_1px_2px_color-mix(in_srgb,var(--klic-component-block-color-text)_2%,transparent)]`}
          >
            <div>
              <h3 className="text-[15px] font-semibold text-zinc-900  tracking-tight">
                공식 제휴사
              </h3>
              <p className="text-[13px] text-klic-muted  leading-relaxed mt-2">
                다양한 글로벌 권역에서 당사 엔터프라이즈 서비스를 공식 프로모션하는 인증 파트너사입니다.
              </p>
            </div>

            <div className="mt-5 flex items-center gap-2.5">
              {AFFILIATE_BRANDS.map((brand) => {
                const isSelected = selectedBrand?.id === brand.id;
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => setSelectedBrand(isSelected ? null : brand)}
                    title={brand.name}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-zinc-900  bg-zinc-50  ring-2 ring-zinc-900/10 scale-105'
                        : 'border-zinc-200/85  bg-white  hover:border-zinc-300  hover:-translate-y-0.5'
                    } shadow-2xs`}
                  >
                    {brand.renderIcon()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {selectedBrand && (
          <div className="mt-1.5 rounded-[12px] bg-white/90  border border-zinc-200/70  px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg border border-zinc-200  bg-white  flex items-center justify-center">
                {selectedBrand.renderIcon()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-zinc-900 ">
                    {selectedBrand.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-100  text-[11px] font-medium text-klic-muted ">
                    {selectedBrand.category}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-50  text-[11px] font-medium text-blue-700 ">
                    {selectedBrand.uptimeOrMetric}
                  </span>
                </div>
                <p className="text-[12px] text-klic-muted  mt-0.5">
                  {selectedBrand.description}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedBrand(null)}
              className="text-[11px] font-medium text-klic-muted hover:text-zinc-700  px-2 py-1"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // 스타일 5: 배송 상세 정보 인셋 카드 (KLIC/card-14)
  const renderDeliveryDetailsCard = () => (
    <div className="w-full max-w-[460px] mx-auto">
      <div className="rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs relative">
        <div className="px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white  border border-zinc-200/90  flex items-center justify-center shadow-2xs">
              <Box className="w-3.5 h-3.5 text-zinc-700 " />
            </div>
            <span className="text-[13.5px] font-semibold text-zinc-900  tracking-tight">
              {currentDelivery.title}
            </span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenMenuId(openMenuId === 'delivery-menu' ? null : 'delivery-menu')
              }
              className="w-7 h-7 rounded-lg flex items-center justify-center text-klic-muted hover:text-zinc-800  hover:bg-zinc-200/60  transition-colors"
              aria-label="배송 옵션 더보기"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {openMenuId === 'delivery-menu' && (
              <div className="absolute right-0 top-8 z-20 w-44 rounded-xl bg-white  border border-zinc-200  shadow-lg py-1 text-[12px]">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeliveryPhotoModal((v) => !v);
                    setOpenMenuId(null);
                  }}
                  className="w-full px-3 py-2 text-left text-zinc-700  hover:bg-zinc-50  flex items-center gap-2"
                >
                  <Camera className="w-3.5 h-3.5 text-klic-muted" />
                  <span>배송 인증 사진 {showDeliveryPhotoModal ? '숨기기' : '보기'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveDeliveryIdx((prev) => (prev === 0 ? 1 : 0));
                    setOpenMenuId(null);
                  }}
                  className="w-full px-3 py-2 text-left text-zinc-700  hover:bg-zinc-50  flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-klic-muted" />
                  <span>다음 배송 건 전환</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleCopyText('tracking', currentDelivery.trackingCode);
                    setOpenMenuId(null);
                  }}
                  className="w-full px-3 py-2 text-left text-zinc-700  hover:bg-zinc-50  flex items-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5 text-klic-muted" />
                  <span>운송장 번호 복사</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          className={`rounded-[14px] bg-white  border border-zinc-200/80  ${padClass} shadow-[0_1px_2px_color-mix(in_srgb,var(--klic-component-block-color-text)_2%,transparent)]`}
        >
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <MapPin className="w-4 h-4 text-klic-muted  shrink-0" />
              <span className="text-[13px] font-medium text-zinc-900 ">
                {currentDelivery.address}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-50  text-blue-600  border border-blue-200/60  text-[11px] font-medium">
                {currentDelivery.placeTag}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-klic-muted  shrink-0" />
              <span className="text-[13px] font-medium text-zinc-900 ">
                {currentDelivery.duration}
              </span>
              <span className="text-[13px] text-klic-muted ">
                {currentDelivery.updatedAgo}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Box className="w-4 h-4 text-klic-muted  shrink-0" />
                <span className="text-[13px] font-medium text-zinc-900 ">
                  {currentDelivery.trackingCode}
                </span>
                <span className="text-[13px] text-klic-muted ">
                  {currentDelivery.trackingStatus}
                </span>
              </div>
              {copiedId === 'tracking' && (
                <span className="text-[11px] font-medium text-blue-600 ">
                  복사됨
                </span>
              )}
            </div>
          </div>

          <div className="mt-5 pt-1">
            <h4 className="text-[13px] font-semibold text-zinc-900 ">
              {currentDelivery.noteTitle}
            </h4>
            <p className="text-[13px] text-klic-muted  leading-relaxed mt-1.5">
              {currentDelivery.noteBody}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // 스타일 6: 미팅 일정 듀얼 인셋 카드 (KLIC/card-15)
  const renderMeetingDualCards = () => (
    <div className="w-full max-w-[760px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {INITIAL_MEETINGS.map((mtg) => {
          const isJoined = joinedMeetingIds.includes(mtg.id);
          return (
            <div
              key={mtg.id}
              className="rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs flex flex-col"
            >
              <div className="px-3.5 py-2 flex items-center justify-between">
                <span className="text-[13.5px] font-semibold text-zinc-900  tracking-tight">
                  {mtg.headerLabel}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText(mtg.id, `${mtg.title} · ${mtg.timeText}`)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-klic-muted hover:text-zinc-800  hover:bg-zinc-200/60  transition-colors"
                  title="회의 정보 복사"
                >
                  {copiedId === mtg.id ? (
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                  ) : (
                    <MoreVertical className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div
                className={`rounded-[14px] bg-white  border border-zinc-200/80  ${padClass} flex-1 flex flex-col justify-between shadow-[0_1px_2px_color-mix(in_srgb,var(--klic-component-block-color-text)_2%,transparent)]`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[14px] font-semibold text-zinc-900  tracking-tight">
                      {mtg.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100  text-klic-muted  text-[11px] font-medium shrink-0">
                      {mtg.duration}
                    </span>
                  </div>
                  <p className="text-[12px] text-klic-muted  mt-0.5">
                    {mtg.timeText}
                  </p>

                  <p className="text-[13px] text-klic-muted  leading-relaxed mt-3.5">
                    {mtg.description}
                  </p>
                </div>

                <div className="mt-4 pt-1 flex items-center gap-2.5">
                  <div className="flex items-center -space-x-2">
                    {mtg.avatars.map((src, idx) => (
                      <PersonAvatar
                        key={idx}
                        src={src}
                        alt={mtg.participantNames[idx]}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-white "
                      />
                    ))}
                    <span className="w-7 h-7 rounded-full bg-zinc-100  ring-2 ring-white  text-[11px] font-medium text-klic-muted  flex items-center justify-center">
                      +{mtg.extraCount}
                    </span>
                  </div>

                  <span className="px-2.5 py-1 rounded-md bg-zinc-100  text-zinc-700  text-[11px] font-medium">
                    {mtg.meetingType}
                  </span>
                </div>
              </div>

              <div className="px-3.5 py-2.5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleJoinMeeting(mtg.id)}
                  className="flex items-center gap-2 text-[12.5px] font-medium text-zinc-800  hover:text-zinc-950  transition-colors"
                >
                  {mtg.platform === 'meet' ? <GoogleMeetIcon /> : <ZoomVideoIcon />}
                  <span>{isJoined ? '화상 회의실 접속됨' : mtg.joinLabel}</span>
                </button>

                {isJoined && (
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-blue-600 ">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    연결 중
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white  rounded-2xl border border-zinc-200/80  overflow-hidden">
      {/* 상단 카드 스타일 전환 바 (한글 전용) */}
      <div className="px-5 py-3.5 border-b border-zinc-200/80  bg-zinc-50/60  flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-klic-inverse " />
          <span className="text-[13px] font-semibold text-zinc-900 ">
            KLIC 인셋 & 그래픽 피처 카드 컬렉션
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'all-showcase', label: '전체 6종 쇼케이스' },
              { id: 'project-trio', label: '3열 프로젝트 마감' },
              { id: 'play-mode-hero', label: '모의 트레이딩 히어로' },
              { id: 'always-on-watch', label: '24/7 상시 관제' },
              { id: 'partner-split', label: '스폰서 & 제휴사' },
              { id: 'delivery-details', label: '배송 상세 정보' },
              { id: 'meeting-dual', label: '미팅 일정' },
            ] as { id: CardShowcaseMode; label: string }[]
          ).map((tab) => {
            const active = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveMode(tab.id)}
                className={`px-2.5 py-1 rounded-lg text-[12px] font-medium transition-all ${
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

      {/* 본문 캔버스 */}
      <div className="p-6 sm:p-10 space-y-12 bg-white ">
        {activeMode === 'all-showcase' && (
          <>
            {/* 1. 3열 프로젝트 마감 & 공유 액션 카드 */}
            <section className="space-y-3">
              <div className="max-w-[860px] mx-auto flex items-center justify-between px-1">
                <span className="text-[12px] font-medium text-klic-muted">
                  KLIC/card-21 · 3열 프로젝트 마감 및 공유 액션 카드
                </span>
                <span className="text-[11px] text-klic-muted">
                  우측 화살표 버튼으로 일정 즉시 공유
                </span>
              </div>
              {renderProjectTrioCard()}
            </section>

            <div className="border-t border-zinc-100 " />

            {/* 2 & 3. 홀로그램 모의 트레이딩 히어로 카드 + 24/7 모눈 격자 상시 관제 카드 */}
            <section className="max-w-[820px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-3">
                <div className="max-w-[330px] mx-auto flex items-center justify-between px-1">
                  <span className="text-[12px] font-medium text-klic-muted">
                    KLIC/card-22 · 모의 트레이딩 피처 카드
                  </span>
                </div>
                {renderPlayModeHeroCard()}
              </div>

              <div className="space-y-3">
                <div className="max-w-[380px] mx-auto flex items-center justify-between px-1">
                  <span className="text-[12px] font-medium text-klic-muted">
                    KLIC/card-23 · 24/7 상시 관제 격자 카드
                  </span>
                </div>
                {renderAlwaysOnWatchCard()}
              </div>
            </section>

            <div className="border-t border-zinc-100 " />

            {/* 4. 스폰서 파트너 & 공식 제휴사 듀얼 카드 */}
            <section className="space-y-3">
              <div className="max-w-[760px] mx-auto flex items-center justify-between px-1">
                <span className="text-[12px] font-medium text-klic-muted">
                  KLIC/card-13 · 스폰서 파트너 및 공식 제휴사 듀얼 카드
                </span>
              </div>
              {renderPartnerSplitCard()}
            </section>

            <div className="border-t border-zinc-100 " />

            {/* 5. 배송 상세 정보 카드 */}
            <section className="space-y-3">
              <div className="max-w-[460px] mx-auto flex items-center justify-between px-1">
                <span className="text-[12px] font-medium text-klic-muted">
                  KLIC/card-14 · 실시간 배송 상세 및 메모 카드
                </span>
              </div>
              {renderDeliveryDetailsCard()}
            </section>

            <div className="border-t border-zinc-100 " />

            {/* 6. 미팅 일정 듀얼 카드 */}
            <section className="space-y-3">
              <div className="max-w-[760px] mx-auto flex items-center justify-between px-1">
                <span className="text-[12px] font-medium text-klic-muted">
                  KLIC/card-15 · 협업 미팅 일정 및 화상회의 참여 카드
                </span>
              </div>
              {renderMeetingDualCards()}
            </section>
          </>
        )}

        {activeMode === 'project-trio' && (
          <div className="py-6">{renderProjectTrioCard()}</div>
        )}

        {activeMode === 'play-mode-hero' && (
          <div className="py-6">{renderPlayModeHeroCard()}</div>
        )}

        {activeMode === 'always-on-watch' && (
          <div className="py-6">{renderAlwaysOnWatchCard()}</div>
        )}

        {activeMode === 'partner-split' && (
          <div className="py-6">{renderPartnerSplitCard()}</div>
        )}

        {activeMode === 'delivery-details' && (
          <div className="py-6">{renderDeliveryDetailsCard()}</div>
        )}

        {activeMode === 'meeting-dual' && (
          <div className="py-6">{renderMeetingDualCards()}</div>
        )}
      </div>
    </div>
  );
}
