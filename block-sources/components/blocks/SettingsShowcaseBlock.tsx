import { PersonAvatar } from '../PersonAvatar';
import React, { useState } from 'react';
import {
  Globe,
  ShieldCheck,
  Lock,
  Bell,
  KeyRound,
  CreditCard,
  Check,
  Copy,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  Building2,
  Users,
  Landmark,
  FileText,
  ChevronDown,
  MoreVertical,
  Blocks,
  UserPlus,
  Send,
} from 'lucide-react';

export type SettingsShowcaseMode =
  | 'team-permissions'
  | 'workspace-general'
  | 'security-sso'
  | 'notification-routing'
  | 'api-webhooks'
  | 'billing-plan';

interface SettingsShowcaseBlockProps {
  initialMode?: SettingsShowcaseMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

type TeamRole = '소유자' | '관리자' | '재무 승인자' | '운영 담당' | '조회 전용';

interface TeamMemberItem {
  id: string;
  name: string;
  isSelf?: boolean;
  isPending?: boolean;
  email: string;
  avatar: string;
  role: TeamRole;
  lockedRole?: boolean;
  approvalLimit: string;
  lastActive: string;
  isOnline?: boolean;
}

const ROLE_LIMIT_MAP: Record<TeamRole, string> = {
  소유자: '무제한',
  관리자: '₩500,000,000',
  '재무 승인자': '₩250,000,000',
  '운영 담당': '승인 권한 없음',
  '조회 전용': '—',
};

export function SettingsShowcaseBlock({
  initialMode = 'team-permissions',
  density = 'normal',
}: SettingsShowcaseBlockProps) {
  const [activeMode, setActiveMode] = useState<SettingsShowcaseMode>(initialMode);

  // 스타일 0 (신규 대표): 팀 및 결재 권한 관리 (KLIC/settings-team-permissions)
  const [settingsNav, setSettingsNav] = useState<
    'business' | 'team' | 'bank' | 'billing' | 'security' | 'notifications' | 'integrations'
  >('team');
  const [teamSubTab, setTeamSubTab] = useState<'members' | 'invites' | 'roles'>('members');
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>([
    {
      id: 'tm-1',
      name: '이하은',
      isSelf: true,
      email: 'haeun.lee@hanwool-trade.kr',
      avatar:
        './placeholders/avatar-0cbdeb5e5e6f.svg',
      role: '소유자',
      lockedRole: true,
      approvalLimit: '무제한',
      lastActive: '현재 접속 중',
      isOnline: true,
    },
    {
      id: 'tm-2',
      name: '박태준',
      email: 'taejun.park@hanwool-trade.kr',
      avatar:
        './placeholders/avatar-3a010bc432b4.svg',
      role: '관리자',
      approvalLimit: '₩500,000,000',
      lastActive: '2시간 전',
      isOnline: true,
    },
    {
      id: 'tm-3',
      name: '김수진',
      email: 'sujin.kim@hanwool-trade.kr',
      avatar:
        './placeholders/avatar-72e24f34ec07.svg',
      role: '재무 승인자',
      approvalLimit: '₩250,000,000',
      lastActive: '어제',
    },
    {
      id: 'tm-4',
      name: '정민호',
      email: 'minho.jung@hanwool-trade.kr',
      avatar:
        './placeholders/avatar-2ca18b045556.svg',
      role: '운영 담당',
      approvalLimit: '승인 권한 없음',
      lastActive: '10월 9일',
    },
    {
      id: 'tm-5',
      name: '최유리',
      isPending: true,
      email: 'yuri.choi@hanwool-trade.kr',
      avatar:
        './placeholders/avatar-d622a75d40fa.svg',
      role: '조회 전용',
      approvalLimit: '—',
      lastActive: '10월 10일 초대됨',
    },
  ]);
  const [openRoleDropdownId, setOpenRoleDropdownId] = useState<string | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamRole>('재무 승인자');
  const [resentInviteId, setResentInviteId] = useState<string | null>(null);
  const [isCustomizingRoles, setIsCustomizingRoles] = useState(false);
  const [roleCapabilities, setRoleCapabilities] = useState<Record<string, boolean>>({
    'cap1-소유자': true,
    'cap1-관리자': true,
    'cap1-재무 승인자': true,
    'cap1-운영 담당': true,
    'cap1-조회 전용': false,
    'cap2-소유자': true,
    'cap2-관리자': true,
    'cap2-재무 승인자': true,
    'cap2-운영 담당': false,
    'cap2-조회 전용': false,
    'cap3-소유자': true,
    'cap3-관리자': true,
    'cap3-재무 승인자': false,
    'cap3-운영 담당': true,
    'cap3-조회 전용': false,
    'cap4-소유자': true,
    'cap4-관리자': true,
    'cap4-재무 승인자': true,
    'cap4-운영 담당': false,
    'cap4-조회 전용': false,
    'cap5-소유자': true,
    'cap5-관리자': true,
    'cap5-재무 승인자': false,
    'cap5-운영 담당': false,
    'cap5-조회 전용': false,
  });
  const [requireDualApprovalOver100M, setRequireDualApprovalOver100M] = useState(true);
  const [requireSupplierBankVerify, setRequireSupplierBankVerify] = useState(true);

  // 스타일 1 상태: 워크스페이스 일반 & 브랜딩 설정
  const [orgName, setOrgName] = useState('한빛핀테크 코리아(주)');
  const [customDomain, setCustomDomain] = useState('console.hanbitfintech.kr');
  const [retentionPeriod, setRetentionPeriod] = useState('5년 법적 보존');
  const [brandAccent, setBrandAccent] = useState<'zinc' | 'emerald' | 'indigo' | 'violet'>('zinc');
  const [savedGeneral, setSavedGeneral] = useState(false);

  // 스타일 2 상태: 엔터프라이즈 SSO & 보안 정책 설정
  const [enforced2FA, setEnforced2FA] = useState(true);
  const [passkeyRequired, setPasskeyRequired] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30분');
  const [allowedCidrs, setAllowedCidrs] = useState([
    { id: 'ip-1', cidr: '211.45.108.0/24', label: '서울 강남 본사 게이트웨이' },
    { id: 'ip-2', cidr: '10.240.0.0/16', label: '판교 데이터센터 전용망' },
  ]);
  const [newCidrInput, setNewCidrInput] = useState('');

  // 스타일 3 상태: 채널별 알림 라우팅 매트릭스 설정
  const [routingMatrix, setRoutingMatrix] = useState<Record<string, boolean>>({
    'ev1-email': true,
    'ev1-slack': true,
    'ev1-oncall': true,
    'ev1-push': true,
    'ev2-email': true,
    'ev2-slack': true,
    'ev2-oncall': false,
    'ev2-push': false,
    'ev3-email': true,
    'ev3-slack': true,
    'ev3-oncall': false,
    'ev3-push': true,
    'ev4-email': true,
    'ev4-slack': false,
    'ev4-oncall': false,
    'ev4-push': true,
    'ev5-email': true,
    'ev5-slack': true,
    'ev5-oncall': true,
    'ev5-push': false,
  });

  // 스타일 4 상태: 개발자 API 키 & 레이트 리밋 설정
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [rpsLimit, setRpsLimit] = useState<'5,000건' | '10,000건' | '25,000건'>('10,000건');
  const [corsOrigins, setCorsOrigins] = useState([
    'https://app.flux.kr',
    'https://pay.hanbitfintech.kr',
    'https://admin.dunamucloud.kr',
  ]);

  // 스타일 5 상태: 구독 플랜 & 결제 수단 관리 설정
  const [spendLimit, setSpendLimit] = useState('₩15,000,000');
  const [autoTopup, setAutoTopup] = useState(true);

  React.useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  const boxPad =
    density === 'compact' ? 'p-4' : density === 'relaxed' ? 'p-6' : 'p-5';

  // 0. 팀 및 결재 권한 관리 설정 (KLIC/settings-team-permissions)
  const renderTeamPermissionsSettings = () => {
    const pendingCount = teamMembers.filter((m) => m.isPending).length;
    const filteredMembers =
      teamSubTab === 'invites'
        ? teamMembers.filter((m) => m.isPending)
        : teamMembers;
    const roleColumns: TeamRole[] = [
      '소유자',
      '관리자',
      '재무 승인자',
      '운영 담당',
      '조회 전용',
    ];
    const capabilityRows = [
      { id: 'cap1', label: '자금 집행 및 정산 요청 생성' },
      { id: 'cap2', label: '요청 결재 승인 및 전자서명 약정' },
      { id: 'cap3', label: '공급사·벤더 등록 및 결제 계좌 변경' },
      { id: 'cap4', label: '대금 상환 및 정산금 송금 실행' },
      { id: 'cap5', label: '팀원 초대 및 법인 계좌 통합 관리' },
    ];

    const handleRoleChange = (memberId: string, nextRole: TeamRole) => {
      setTeamMembers((prev) =>
        prev.map((m) =>
          m.id === memberId
            ? {
                ...m,
                role: nextRole,
                approvalLimit: m.isPending ? '—' : ROLE_LIMIT_MAP[nextRole],
              }
            : m
        )
      );
      setOpenRoleDropdownId(null);
    };

    const handleAddInvite = () => {
      if (!inviteName.trim() || !inviteEmail.trim()) return;
      const samplePhotos = [
        './placeholders/avatar-18461dc5a323.svg',
        './placeholders/avatar-32b9a55c6abe.svg',
        './placeholders/avatar-3d738d374ed6.svg',
      ];
      const nextMember: TeamMemberItem = {
        id: `tm-${Date.now()}`,
        name: inviteName.trim(),
        isPending: true,
        email: inviteEmail.trim(),
        avatar: samplePhotos[teamMembers.length % samplePhotos.length],
        role: inviteRole,
        approvalLimit: '—',
        lastActive: '방금 초대됨',
      };
      setTeamMembers((prev) => [...prev, nextMember]);
      setInviteName('');
      setInviteEmail('');
      setIsInviteOpen(false);
    };

    return (
      <div className="w-full max-w-[1080px] mx-auto rounded-[24px] bg-[var(--klic-component-block-color-soft)] border border-zinc-200/90 p-2 shadow-[0_1px_2px_color-mix(in_srgb,var(--klic-component-block-color-text)_3%,transparent)] space-y-2">
        {/* 상단 베젤 메타 헤더 */}
        <div className="px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-[12.5px] font-semibold text-zinc-800">
              워크스페이스 환경설정 · 팀 및 결재 한도 거버넌스
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11.5px] text-klic-muted">
            <span>법인 식별자: HANWOOL-KR-8841</span>
            <span>·</span>
            <span className="font-medium text-blue-600">✓ 다중 결재 감사 로그 활성</span>
          </div>
        </div>

        {/* 내부 화이트 캔버스 (Double-Bezel Inner Surface) */}
        <div className="rounded-[18px] bg-white border border-zinc-200/80 overflow-hidden shadow-[0_1px_3px_color-mix(in_srgb,var(--klic-component-block-color-text)_2%,transparent)]">
          {/* 최상단 Settings 타이틀 영역 */}
          <div className="px-6 sm:px-8 py-6 border-b border-zinc-200/80 bg-white">
            <h2 className="text-[22px] font-bold tracking-tight text-zinc-900">
              설정
            </h2>
            <p className="text-[13.5px] text-klic-muted mt-1">
              (주)한울무역 코리아 워크스페이스, 팀원 권한 및 자금 집행·결재 한도를 통합 관리합니다.
            </p>
          </div>

          {/* 좌측 사이드바 + 우측 메인 콘텐츠 2단 레이아웃 */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* 좌측 설정 내비게이션 사이드바 */}
            <aside className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-zinc-200/80 bg-[var(--klic-component-block-color-panel)]/70 p-4 sm:p-5 space-y-6">
              <div>
                <div className="px-2.5 mb-2 text-[10.5px] font-bold tracking-wider text-klic-muted uppercase">
                  워크스페이스
                </div>
                <div className="space-y-1">
                  {(
                    [
                      { id: 'business', label: '비즈니스 프로필', icon: Building2 },
                      {
                        id: 'team',
                        label: '팀 및 권한 관리',
                        icon: Users,
                        badge: pendingCount,
                      },
                      { id: 'bank', label: '계좌 및 자동결제', icon: Landmark },
                      { id: 'billing', label: '청구서 및 정산 내역', icon: FileText },
                    ] as const
                  ).map((nav) => {
                    const Icon = nav.icon;
                    const active = settingsNav === nav.id;
                    return (
                      <button
                        key={nav.id}
                        type="button"
                        onClick={() => setSettingsNav(nav.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all cursor-pointer ${
                          active
                            ? 'bg-blue-50/90 text-blue-600 font-semibold border border-blue-200/70 shadow-2xs'
                            : 'text-klic-muted hover:bg-zinc-100/80 font-medium border border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon
                            className={`w-4 h-4 ${
                              active ? 'text-blue-600' : 'text-klic-muted'
                            }`}
                          />
                          <span>{nav.label}</span>
                        </span>
                        {'badge' in nav && nav.badge ? (
                          <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold leading-none">
                            {nav.badge}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="px-2.5 mb-2 text-[10.5px] font-bold tracking-wider text-klic-muted uppercase">
                  개인 설정
                </div>
                <div className="space-y-1">
                  {(
                    [
                      { id: 'security', label: '보안 및 인증', icon: Lock },
                      { id: 'notifications', label: '알림 수신 설정', icon: Bell },
                    ] as const
                  ).map((nav) => {
                    const Icon = nav.icon;
                    const active = settingsNav === nav.id;
                    return (
                      <button
                        key={nav.id}
                        type="button"
                        onClick={() => setSettingsNav(nav.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] transition-all cursor-pointer ${
                          active
                            ? 'bg-blue-50/90 text-blue-600 font-semibold border border-blue-200/70 shadow-2xs'
                            : 'text-klic-muted hover:bg-zinc-100/80 font-medium border border-transparent'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            active ? 'text-blue-600' : 'text-klic-muted'
                          }`}
                        />
                        <span>{nav.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="px-2.5 mb-2 text-[10.5px] font-bold tracking-wider text-klic-muted uppercase">
                  개발자 도구
                </div>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setSettingsNav('integrations')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] transition-all cursor-pointer ${
                      settingsNav === 'integrations'
                        ? 'bg-blue-50/90 text-blue-600 font-semibold border border-blue-200/70 shadow-2xs'
                        : 'text-klic-muted hover:bg-zinc-100/80 font-medium border border-transparent'
                    }`}
                  >
                    <Blocks
                      className={`w-4 h-4 ${
                        settingsNav === 'integrations' ? 'text-blue-600' : 'text-klic-muted'
                      }`}
                    />
                    <span>외부 연동 및 API</span>
                  </button>
                </div>
              </div>

              {/* 좌측 하단 접속 계정 미니 프로필 카드 */}
              <div className="pt-4 border-t border-zinc-200/70">
                <div className="p-3 rounded-xl bg-white border border-zinc-200/80 flex items-center gap-2.5 shadow-2xs">
                  <PersonAvatar
                    src="./placeholders/avatar-0cbdeb5e5e6f.svg"
                    alt="이하은"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold text-zinc-900 truncate">
                      이하은 · 소유자
                    </div>
                    <div className="text-[11px] text-klic-muted truncate">
                      (주)한울무역 코리아
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* 우측 메인 콘텐츠 패널 */}
            <div className="lg:col-span-9 p-5 sm:p-7 space-y-5 bg-white">
              {/* 헤더 + 팀원 초대 CTA */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-[18px] font-bold text-zinc-900 tracking-tight">
                    팀 및 권한 관리
                  </h3>
                  <p className="text-[13px] text-klic-muted mt-0.5">
                    동료를 초대하고 자금 요청, 승인 및 집행 권한과 단일 결재 한도를 제어합니다.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsInviteOpen((v) => !v)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-klic-on-emphasis text-[13px] font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>팀원 초대</span>
                </button>
              </div>

              {/* 인라인 팀원 초대 드로어 (Double-Bezel) */}
              {isInviteOpen && (
                <div className="rounded-[16px] bg-[var(--klic-component-block-color-soft)] p-1.5 border border-blue-200/80">
                  <div className="rounded-[12px] bg-white p-4 border border-zinc-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-zinc-900 flex items-center gap-1.5">
                        <UserPlus className="w-4 h-4 text-blue-600" />
                        신규 팀원 초대장 발송 (프로필 자동 매칭)
                      </span>
                      <span className="text-[11.5px] text-klic-muted">
                        초대 시 초대 상태를 예시로 추가합니다
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                      <input
                        type="text"
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        placeholder="이름 (예: 한지훈)"
                        className="sm:col-span-3 rounded-xl border border-zinc-200 px-3 py-2 text-[12.5px] text-zinc-900 outline-none focus:border-blue-500"
                      />
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="회사 이메일 (예: jihun.han@hanwool-trade.kr)"
                        className="sm:col-span-5 rounded-xl border border-zinc-200 px-3 py-2 text-[12.5px] text-zinc-900 outline-none focus:border-blue-500"
                      />
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as TeamRole)}
                        className="sm:col-span-2 rounded-xl border border-zinc-200 px-2.5 py-2 text-[12.5px] text-zinc-800 bg-white outline-none"
                      >
                        <option value="관리자">관리자</option>
                        <option value="재무 승인자">재무 승인자</option>
                        <option value="운영 담당">운영 담당</option>
                        <option value="조회 전용">조회 전용</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddInvite}
                        className="sm:col-span-2 rounded-xl bg-klic-inverse hover:bg-klic-inverse text-klic-on-emphasis text-[12.5px] font-semibold py-2 px-3 cursor-pointer"
                      >
                        초대 발송
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 시트 점유율 프로그레스 바 카드 (Double-Bezel) */}
              <div className="rounded-[16px] bg-[var(--klic-component-block-color-soft)] p-1 border border-zinc-200/80">
                <div className="rounded-[12px] bg-white px-4 py-3 border border-zinc-200/70 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-[13.5px] font-semibold text-zinc-900">
                      10석 중 {teamMembers.length}석 사용 중
                    </span>
                    <div className="w-36 sm:w-44 h-2 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, (teamMembers.length / 10) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <span className="text-[12.5px] font-medium text-klic-muted">
                    요금제 기본 포함
                  </span>
                </div>
              </div>

              {/* 서브 탭: 멤버 5 | 대기 중인 초대 1 | 역할 5 */}
              <div className="border-b border-zinc-200/80 flex items-center gap-6">
                {(
                  [
                    { id: 'members', label: '멤버', count: teamMembers.length },
                    { id: 'invites', label: '대기 중인 초대', count: pendingCount },
                    { id: 'roles', label: '역할', count: 5 },
                  ] as const
                ).map((t) => {
                  const active = teamSubTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTeamSubTab(t.id)}
                      className={`pb-3 text-[13px] flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                        active
                          ? 'border-blue-600 text-blue-600 font-semibold'
                          : 'border-transparent text-klic-muted hover:text-zinc-800 font-medium'
                      }`}
                    >
                      <span>{t.label}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[11px] font-semibold ${
                          active
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-zinc-100 text-klic-muted'
                        }`}
                      >
                        {t.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* 카드 1: 팀원 목록 & 결재 한도 테이블 (샘플 아바타 사진 적용) */}
              <div className="rounded-[18px] bg-[var(--klic-component-block-color-soft)] p-1.5 border border-zinc-200/85">
                <div className="rounded-[13px] bg-white border border-zinc-200/75 overflow-visible">
                  {/* 테이블 헤더 */}
                  <div className="grid grid-cols-12 items-center px-5 py-3 bg-[var(--klic-component-block-color-panel)] border-b border-zinc-200/75 text-[11.5px] font-semibold text-klic-muted rounded-t-[13px]">
                    <div className="col-span-12 sm:col-span-5">멤버</div>
                    <div className="col-span-4 sm:col-span-3">역할</div>
                    <div className="col-span-4 sm:col-span-2">결재 승인 한도</div>
                    <div className="col-span-4 sm:col-span-2">최근 활동</div>
                  </div>

                  {/* 멤버 로우 */}
                  <div className="divide-y divide-zinc-200/60">
                    {filteredMembers.map((member) => (
                      <div
                        key={member.id}
                        className={`grid grid-cols-12 items-center px-5 py-3.5 gap-y-2 transition-colors ${
                          member.isPending
                            ? 'bg-[var(--klic-component-block-color-soft)]/90 hover:bg-[var(--klic-component-block-color-border)]/60'
                            : 'hover:bg-zinc-50/70'
                        }`}
                      >
                        {/* 멤버 프로필 사진 + 이름 + 이메일 */}
                        <div className="col-span-12 sm:col-span-5 flex items-center gap-3 pr-2">
                          <div className="relative shrink-0">
                            <PersonAvatar
                              src={member.avatar}
                              alt={member.name}
                              className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-200 shadow-2xs"
                            />
                            {member.isOnline && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-white" />
                            )}
                            {member.isPending && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[13.5px] font-semibold text-zinc-900">
                                {member.name}
                              </span>
                              {member.isSelf && (
                                <span className="text-[12px] font-normal text-klic-muted">
                                  (나)
                                </span>
                              )}
                              {member.isPending && (
                                <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-amber-600">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                  초대 수락 대기 중
                                </span>
                              )}
                            </div>
                            <div className="text-[12px] text-klic-muted truncate">
                              {member.email}
                            </div>
                          </div>
                        </div>

                        {/* 역할 배지 / 드롭다운 */}
                        <div className="col-span-4 sm:col-span-3 relative">
                          {member.lockedRole ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 border border-zinc-200/80 text-[12px] font-medium text-klic-muted">
                              <span>{member.role}</span>
                              <Lock className="w-3 h-3 text-klic-muted" />
                            </span>
                          ) : (
                            <div className="relative inline-block">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenRoleDropdownId((prev) =>
                                    prev === member.id ? null : member.id
                                  )
                                }
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200/90 text-[12px] font-medium text-zinc-800 shadow-2xs cursor-pointer"
                              >
                                <span>{member.role}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-klic-muted" />
                              </button>

                              {openRoleDropdownId === member.id && (
                                <div className="absolute left-0 top-full mt-1 w-40 rounded-xl bg-white border border-zinc-200 shadow-lg py-1 z-20">
                                  {(
                                    [
                                      '관리자',
                                      '재무 승인자',
                                      '운영 담당',
                                      '조회 전용',
                                    ] as TeamRole[]
                                  ).map((r) => (
                                    <button
                                      key={r}
                                      type="button"
                                      onClick={() => handleRoleChange(member.id, r)}
                                      className={`w-full px-3 py-1.5 text-left text-[12px] flex items-center justify-between hover:bg-zinc-50 cursor-pointer ${
                                        member.role === r
                                          ? 'font-semibold text-blue-600 bg-blue-50/50'
                                          : 'text-zinc-700'
                                      }`}
                                    >
                                      <span>{r}</span>
                                      {member.role === r && (
                                        <Check className="w-3.5 h-3.5 text-blue-600" />
                                      )}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* 결재 승인 한도 */}
                        <div className="col-span-4 sm:col-span-2 text-[13px]">
                          <span
                            className={
                              member.approvalLimit === '승인 권한 없음' ||
                              member.approvalLimit === '—'
                                ? 'text-klic-muted font-normal'
                                : 'font-semibold text-zinc-900 font-mono'
                            }
                          >
                            {member.approvalLimit}
                          </span>
                        </div>

                        {/* 최근 활동 + 액션 */}
                        <div className="col-span-4 sm:col-span-2 flex items-center justify-between gap-2">
                          <span
                            className={`text-[12.5px] ${
                              member.isOnline
                                ? 'text-blue-600 font-medium'
                                : 'text-klic-muted'
                            }`}
                          >
                            {resentInviteId === member.id
                              ? '초대장 재발송됨'
                              : member.lastActive}
                          </span>

                          {member.isPending ? (
                            <button
                              type="button"
                              onClick={() => {
                                setResentInviteId(member.id);
                                setTimeout(() => setResentInviteId(null), 2000);
                              }}
                              title="초대장 재발송"
                              className="p-1 rounded-lg hover:bg-amber-100/80 text-klic-muted hover:text-zinc-800 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="p-1 rounded-lg hover:bg-zinc-100 text-klic-muted hover:text-zinc-700 cursor-pointer"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 카드 2: 역할별 수행 가능 권한 매트릭스 (What each role can do) */}
              <div className="rounded-[18px] bg-[var(--klic-component-block-color-soft)] p-1.5 border border-zinc-200/85">
                <div className="rounded-[13px] bg-white border border-zinc-200/75 overflow-hidden">
                  <div className="px-5 py-4 border-b border-zinc-200/75 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-[14.5px] font-bold text-zinc-900">
                        역할별 수행 가능 권한
                      </div>
                      <div className="text-[12px] text-klic-muted mt-0.5">
                        소유자 및 관리자가 역할별 세부 권한을 편집할 수 있습니다
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsCustomizingRoles((v) => !v)}
                      className={`px-3 py-1.5 rounded-xl border text-[12px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isCustomizingRoles
                          ? 'bg-blue-600 border-blue-600 text-klic-on-emphasis shadow-2xs'
                          : 'bg-white hover:bg-zinc-50 border-zinc-200/90 text-zinc-700'
                      }`}
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>{isCustomizingRoles ? '권한 편집 완료' : '역할 맞춤 설정'}</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-200/70 bg-[var(--klic-component-block-color-panel)] text-[11.5px] font-semibold text-klic-muted">
                          <th className="py-3 px-5 min-w-[210px]">권한 항목</th>
                          {roleColumns.map((role) => (
                            <th key={role} className="py-3 px-3 text-center min-w-[84px]">
                              {role}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200/60 text-[13px]">
                        {capabilityRows.map((cap) => (
                          <tr key={cap.id} className="hover:bg-zinc-50/60">
                            <td className="py-3.5 px-5 font-medium text-zinc-800">
                              {cap.label}
                            </td>
                            {roleColumns.map((role) => {
                              const cellKey = `${cap.id}-${role}`;
                              const enabled = !!roleCapabilities[cellKey];
                              return (
                                <td key={role} className="py-3.5 px-3 text-center">
                                  <button
                                    type="button"
                                    disabled={!isCustomizingRoles && role === '소유자'}
                                    onClick={() => {
                                      if (role === '소유자') return;
                                      setRoleCapabilities((prev) => ({
                                        ...prev,
                                        [cellKey]: !prev[cellKey],
                                      }));
                                    }}
                                    className={`mx-auto flex items-center justify-center transition-transform ${
                                      isCustomizingRoles && role !== '소유자'
                                        ? 'cursor-pointer hover:scale-110'
                                        : 'cursor-default'
                                    }`}
                                  >
                                    {enabled ? (
                                      <span className="w-5 h-5 rounded-full bg-blue-50 border border-blue-300 text-blue-600 flex items-center justify-center">
                                        <Check className="w-3 h-3 stroke-[2.5]" />
                                      </span>
                                    ) : (
                                      <span className="text-klic-muted font-medium select-none">
                                        —
                                      </span>
                                    )}
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 카드 3: 결재 승인 규칙 (Approval rules) */}
              <div className="rounded-[18px] bg-[var(--klic-component-block-color-soft)] p-1.5 border border-zinc-200/85">
                <div className="rounded-[13px] bg-white border border-zinc-200/75 px-5 py-4 space-y-4">
                  <div>
                    <div className="text-[14.5px] font-bold text-zinc-900">
                      결재 승인 규칙
                    </div>
                    <div className="text-[12px] text-klic-muted mt-0.5">
                      고액 자금 집행 요청에 대한 다중 결재 보호 장치
                    </div>
                  </div>

                  <div className="pt-3.5 border-t border-zinc-100 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[13.5px] font-semibold text-zinc-900">
                        ₩100,000,000 초과 시 2인 이상 공동 승인 필수
                      </div>
                      <div className="text-[12px] text-klic-muted mt-0.5">
                        자금 집행 요청 및 대금 상환 거래에 모두 적용됩니다
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setRequireDualApprovalOver100M((v) => !v)}
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                        requireDualApprovalOver100M ? 'bg-blue-600' : 'bg-zinc-200'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white shadow-2xs transition-transform ${
                          requireDualApprovalOver100M ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="pt-3.5 border-t border-zinc-100 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[13.5px] font-semibold text-zinc-900">
                        신규 해외 공급사 계좌 등록 시 재무 승인자 교차 검증
                      </div>
                      <div className="text-[12px] text-klic-muted mt-0.5">
                        수취인 예금주 실명 대사 및 첫 송금 전 2단계 승인을 강제합니다
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setRequireSupplierBankVerify((v) => !v)}
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                        requireSupplierBankVerify ? 'bg-blue-600' : 'bg-zinc-200'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white shadow-2xs transition-transform ${
                          requireSupplierBankVerify ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 1. 워크스페이스 일반 & 브랜딩 설정 (KLIC/settings-1)
  const renderWorkspaceGeneralSettings = () => (
    <div className="w-full max-w-[780px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-zinc-700 " />
          <span className="text-[13.5px] font-semibold text-zinc-900 ">
            워크스페이스 일반 & 브랜딩 환경설정
          </span>
        </div>
        <span className="text-[11.5px] text-klic-muted">조직 식별자: org_flux_kr_01</span>
      </div>

      <div
        className={`rounded-[14px] bg-white  border border-zinc-200/80  ${boxPad} space-y-5`}
      >
        {/* 로고 & 조직 이름 */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-zinc-100 ">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-klic-inverse  text-klic-on-emphasis  flex items-center justify-center font-bold text-xl shadow-xs">
              f
            </div>
            <div>
              <div className="text-[14px] font-semibold text-zinc-900 ">
                워크스페이스 심볼 및 브랜드 색상
              </div>
              <div className="text-[12px] text-klic-muted mt-0.5">
                클라이언트 진단 포털과 리포트 상단에 표시되는 대표 컬러입니다.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(
              [
                { id: 'zinc', label: '중립 네이비', dot: 'bg-klic-inverse' },
                { id: 'emerald', label: '클릭 블루', dot: 'bg-blue-600' },
                { id: 'indigo', label: '로열 블루', dot: 'bg-blue-600' },
                { id: 'violet', label: '소프트 블루', dot: 'bg-blue-300' },
              ] as const
            ).map((sw) => (
              <button
                key={sw.id}
                type="button"
                onClick={() => setBrandAccent(sw.id)}
                className={`px-2.5 py-1.5 rounded-xl border text-[11.5px] font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                  brandAccent === sw.id
                    ? 'border-zinc-900  bg-zinc-50  text-zinc-900 '
                    : 'border-zinc-200  text-klic-muted'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${sw.dot}`} />
                <span>{sw.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 조직 이름 & 커스텀 도메인 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12.5px] font-medium text-zinc-700 ">
              공식 조직 표시 이름
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => {
                setOrgName(e.target.value);
                setSavedGeneral(false);
              }}
              className="mt-1.5 w-full rounded-xl border border-zinc-200  bg-white  px-3.5 py-2 text-[13px] text-zinc-900  outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-[12.5px] font-medium text-zinc-700 ">
                커스텀 도메인 연결
              </label>
              <span className="text-[11px] font-semibold text-blue-600">
                ✓ 보안 인증서 활성
              </span>
            </div>
            <input
              type="text"
              value={customDomain}
              onChange={(e) => {
                setCustomDomain(e.target.value);
                setSavedGeneral(false);
              }}
              className="mt-1.5 w-full rounded-xl border border-zinc-200  bg-white  px-3.5 py-2 text-[13px] font-mono text-zinc-900  outline-none"
            />
          </div>
        </div>

        {/* 원장 데이터 보존 연한 선택 */}
        <div>
          <label className="block text-[12.5px] font-medium text-zinc-700 ">
            정산 원장 및 감사 로그 보존 주기
          </label>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            {['1년 표준 보존', '3년 감사 보존', '5년 법적 보존'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setRetentionPeriod(p);
                  setSavedGeneral(false);
                }}
                className={`py-2 rounded-xl border text-[12.5px] font-medium transition-all cursor-pointer ${
                  retentionPeriod === p
                    ? 'border-zinc-900 bg-klic-inverse text-klic-on-emphasis   '
                    : 'border-zinc-200  text-klic-muted  hover:bg-zinc-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 베젤 저장 바 */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        <span className="text-[12px] text-klic-muted">
          기본 표준 시간대: 서울 표준시 · KST
        </span>
        <button
          type="button"
          onClick={() => setSavedGeneral(true)}
          className="px-4 py-1.5 rounded-xl bg-klic-inverse hover:bg-klic-inverse   text-klic-on-emphasis text-[12.5px] font-medium cursor-pointer"
        >
          {savedGeneral ? '✓ 설정 변경사항 저장됨' : '환경설정 저장하기'}
        </button>
      </div>
    </div>
  );

  // 2. 엔터프라이즈 싱글 사인온 & 보안 정책 설정 (KLIC/settings-2)
  const renderSecuritySsoSettings = () => (
    <div className="w-full max-w-[780px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-zinc-700 " />
          <span className="text-[13.5px] font-semibold text-zinc-900 ">
            엔터프라이즈 싱글 사인온 & 제로트러스트 보안 정책
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-blue-50  text-blue-700  text-[11px] font-semibold">
          옥타 통합 인증 연동됨
        </span>
      </div>

      <div
        className={`rounded-[14px] bg-white  border border-zinc-200/80  ${boxPad} space-y-4`}
      >
        {/* 보안 강제 토글 행 */}
        {[
          {
            title: '전사 2단계 다중 인증 강제 적용',
            desc: '모든 워크스페이스 멤버 로그인 시 일회용 인증번호 또는 생체 패스키 검증을 필수로 요구합니다.',
            checked: enforced2FA,
            onToggle: () => setEnforced2FA((v) => !v),
          },
          {
            title: '프로덕션 배포 및 출금 시 하드웨어 보안키 재검증',
            desc: '고위험 작업 실행 시 세션 만료 여부와 관계없이 생체 패스키 서명을 다시 요청합니다.',
            checked: passkeyRequired,
            onToggle: () => setPasskeyRequired((v) => !v),
          },
        ].map((item) => (
          <div
            key={item.title}
            className="p-4 rounded-xl border border-zinc-200/75  flex items-center justify-between gap-4"
          >
            <div>
              <div className="text-[13.5px] font-semibold text-zinc-900 ">
                {item.title}
              </div>
              <div className="text-[12px] text-klic-muted mt-0.5">{item.desc}</div>
            </div>
            <button
              type="button"
              onClick={item.onToggle}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                item.checked ? 'bg-klic-inverse ' : 'bg-zinc-200 '
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white  transition-transform ${
                  item.checked ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}

        {/* 허용 IP 대역 화이트리스트 */}
        <div className="pt-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-zinc-900 ">
              허용 접속 IP 대역 화이트리스트
            </span>
            <span className="text-[11.5px] text-klic-muted">
              등록된 대역 외 접속 자동 차단
            </span>
          </div>

          <div className="space-y-2">
            {allowedCidrs.map((ip) => (
              <div
                key={ip.id}
                className="px-3.5 py-2.5 rounded-xl bg-zinc-50  border border-zinc-200/70  flex items-center justify-between text-[12.5px]"
              >
                <div className="flex items-center gap-2.5">
                  <code className="font-mono font-semibold text-zinc-900 ">
                    {ip.cidr}
                  </code>
                  <span className="text-klic-muted">· {ip.label}</span>
                </div>
                <span className="text-[11px] font-medium text-blue-600">허용됨</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={newCidrInput}
              onChange={(e) => setNewCidrInput(e.target.value)}
              placeholder="신규 허용 IP 대역 입력 (예: 172.16.0.0/16)"
              className="flex-1 rounded-xl border border-zinc-200  bg-white  px-3.5 py-2 text-[12.5px] font-mono outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (!newCidrInput.trim()) return;
                setAllowedCidrs((prev) => [
                  ...prev,
                  {
                    id: `ip-${Date.now()}`,
                    cidr: newCidrInput.trim(),
                    label: '추가 등록된 보안 대역',
                  },
                ]);
                setNewCidrInput('');
              }}
              className="px-3.5 py-2 rounded-xl bg-klic-inverse  text-klic-on-emphasis  text-[12.5px] font-medium flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>대역 추가</span>
            </button>
          </div>
        </div>
      </div>

      {/* 하단 세션 유휴 만료 설정 */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-[12px]">
        <span className="text-klic-muted">세션 유휴 자동 로그아웃 시간:</span>
        <div className="flex items-center gap-1.5">
          {['15분', '30분', '1시간', '4시간'].map((tm) => (
            <button
              key={tm}
              type="button"
              onClick={() => setSessionTimeout(tm)}
              className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                sessionTimeout === tm
                  ? 'bg-klic-inverse text-klic-on-emphasis  '
                  : 'bg-white  text-klic-muted '
              }`}
            >
              {tm}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // 3. 채널별 알림 라우팅 매트릭스 설정 (KLIC/settings-3)
  const renderNotificationRoutingSettings = () => {
    const events = [
      { id: 'ev1', title: '긴급 장애 및 SLA 임계치 위반', desc: '에러 버짓 소진 및 결제 게이트웨이 응답 지연' },
      { id: 'ev2', title: '일일 정산 배치 마감 리포트', desc: '오전 04:00 KST 자동 대사 및 원장 확정 요약' },
      { id: 'ev3', title: '어드바이저 플레이북 정책 충돌', desc: '신규 업로드 문서와 기존 할인율 규칙 간 충돌 감지' },
      { id: 'ev4', title: '법인 지출 한도 및 품의서 결재', desc: '클라우드 약정 증설 및 신규 시트 추가 승인 요청' },
      { id: 'ev5', title: '보안 권한 등급 및 서명 키 변경', desc: '최고 관리자 권한 부여 및 마스터 키 교체 이벤트' },
    ];
    const channels = [
      { id: 'email', label: '이메일 보고' },
      { id: 'slack', label: '슬랙 채널' },
      { id: 'oncall', label: '온콜 호출' },
      { id: 'push', label: '모바일 푸시' },
    ];

    const toggleCell = (key: string) => {
      setRoutingMatrix((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <div className="w-full max-w-[820px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-zinc-700 " />
            <span className="text-[13.5px] font-semibold text-zinc-900 ">
              이벤트별 멀티 채널 알림 라우팅 매트릭스
            </span>
          </div>
          <span className="text-[11.5px] text-klic-muted">
            셀을 클릭하여 수신 채널을 즉시 토글하세요
          </span>
        </div>

        <div className="rounded-[14px] bg-white  border border-zinc-200/80  overflow-hidden">
          <div className="grid grid-cols-12 bg-zinc-50  px-5 py-3 text-[12px] font-semibold text-klic-muted border-b border-zinc-200/70 ">
            <div className="col-span-6">워크스페이스 이벤트 유형</div>
            {channels.map((ch) => (
              <div key={ch.id} className="col-span-1 sm:col-span-1 text-center flex-1">
                {ch.label}
              </div>
            ))}
          </div>

          <div className="divide-y divide-zinc-100 ">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="grid grid-cols-12 items-center px-5 py-3.5 hover:bg-zinc-50/50 "
              >
                <div className="col-span-6 pr-3">
                  <div className="text-[13.5px] font-semibold text-zinc-900 ">
                    {ev.title}
                  </div>
                  <div className="text-[11.5px] text-klic-muted mt-0.5">{ev.desc}</div>
                </div>

                {channels.map((ch) => {
                  const key = `${ev.id}-${ch.id}`;
                  const active = !!routingMatrix[key];
                  return (
                    <div key={ch.id} className="col-span-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => toggleCell(key)}
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                          active
                            ? 'bg-klic-inverse border-zinc-900 text-klic-on-emphasis   '
                            : 'bg-white  border-zinc-200  text-transparent hover:border-zinc-400'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 4. 개발자 API 키 & 레이트 리밋 설정 (KLIC/settings-4)
  const renderApiWebhooksSettings = () => (
    <div className="w-full max-w-[780px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-zinc-700 " />
          <span className="text-[13.5px] font-semibold text-zinc-900 ">
            개발자 API 키 & 초당 요청 할당량 설정
          </span>
        </div>
        <span className="text-[12px] font-semibold text-blue-600">
          실시간 처리율 정상 · 4,120 / {rpsLimit}
        </span>
      </div>

      <div
        className={`rounded-[14px] bg-white  border border-zinc-200/80  ${boxPad} space-y-5`}
      >
        {/* 초당 요청 할당량 게이지 */}
        <div className="rounded-xl bg-zinc-50  border border-zinc-200/75  p-4 space-y-2.5">
          <div className="flex items-center justify-between text-[13px]">
            <span className="font-semibold text-zinc-900 ">
              초당 최대 API 요청 한도
            </span>
            <div className="flex items-center gap-1.5">
              {(['5,000건', '10,000건', '25,000건'] as const).map((lim) => (
                <button
                  key={lim}
                  type="button"
                  onClick={() => setRpsLimit(lim)}
                  className={`px-2.5 py-0.5 rounded-md text-[11.5px] font-medium cursor-pointer ${
                    rpsLimit === lim
                      ? 'bg-klic-inverse text-klic-on-emphasis  '
                      : 'bg-white  text-klic-muted '
                  }`}
                >
                  {lim}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-200  overflow-hidden">
            <div className="h-full bg-blue-500 w-[64%] rounded-full" />
          </div>
        </div>

        {/* 발급된 시크릿 키 목록 */}
        <div className="space-y-2.5">
          <span className="text-[12.5px] font-semibold text-zinc-700 ">
            활성 서버 시크릿 키
          </span>
          {[
            { id: 'k-prod', env: '프로덕션', name: '메인 정산 원장 서버 키', key: 'sk_live_flux_99a1c44b2e0988d1' },
            { id: 'k-stg', env: '스테이징', name: '샌드박스 모의 테스트 키', key: 'sk_test_flux_42c8f19a0b7731e4' },
          ].map((k) => (
            <div
              key={k.id}
              className="p-3.5 rounded-xl border border-zinc-200/80  flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-zinc-100  text-[11px] font-semibold text-zinc-800 ">
                    {k.env}
                  </span>
                  <span className="text-[13.5px] font-semibold text-zinc-900 ">
                    {k.name}
                  </span>
                </div>
                <code className="block text-[12px] font-mono text-klic-muted mt-1">
                  {k.key.slice(0, 18)}••••••••••
                </code>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(k.key);
                  setCopiedKeyId(k.id);
                  setTimeout(() => setCopiedKeyId(null), 1800);
                }}
                className="px-3 py-1.5 rounded-xl border border-zinc-200  text-[12px] font-medium text-zinc-700  hover:bg-zinc-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-klic-muted" />
                <span>{copiedKeyId === k.id ? '복사 완료됨' : '시크릿 키 복사'}</span>
              </button>
            </div>
          ))}
        </div>

        {/* 허용 오리진 도메인 */}
        <div>
          <span className="text-[12.5px] font-semibold text-zinc-700 ">
            허용된 웹 클라이언트 도메인 목록
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {corsOrigins.map((origin) => (
              <span
                key={origin}
                className="px-2.5 py-1 rounded-lg bg-zinc-100  text-[12px] font-mono text-zinc-700 "
              >
                {origin}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // 5. 구독 플랜 & 결제 수단 관리 설정 (KLIC/settings-5)
  const renderBillingPlanSettings = () => (
    <div className="w-full max-w-[780px] mx-auto rounded-[20px] bg-[var(--klic-component-block-color-soft)]  border border-zinc-200/85  p-1.5 shadow-2xs space-y-1.5">
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-zinc-700 " />
          <span className="text-[13.5px] font-semibold text-zinc-900 ">
            구독 플랜 & 법인 결제 수단 관리
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-klic-inverse text-klic-on-emphasis   text-[11px] font-semibold">
          엔터프라이즈 연간 약정
        </span>
      </div>

      <div
        className={`rounded-[14px] bg-white  border border-zinc-200/80  ${boxPad} space-y-5`}
      >
        {/* 사용량 게이지 2열 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-zinc-200/80  space-y-2">
            <div className="flex items-center justify-between text-[12.5px]">
              <span className="text-klic-muted">활성 멤버 시트 점유율</span>
              <span className="font-semibold text-zinc-900 ">42 / 50석</span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-100  overflow-hidden">
              <div className="h-full bg-klic-inverse  w-[84%]" />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200/80  space-y-2">
            <div className="flex items-center justify-between text-[12.5px]">
              <span className="text-klic-muted">월간 정산 원장 처리량</span>
              <span className="font-semibold text-zinc-900 ">142만 / 200만 건</span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-100  overflow-hidden">
              <div className="h-full bg-blue-500 w-[71%]" />
            </div>
          </div>
        </div>

        {/* 등록된 법인카드 & 월간 지출 상한선 */}
        <div className="p-4 rounded-xl bg-zinc-50  border border-zinc-200/75  flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-8 rounded-lg bg-klic-inverse text-klic-on-emphasis flex items-center justify-center font-bold text-[11px] tracking-wider">
              KLIC
            </div>
            <div>
              <div className="text-[13.5px] font-semibold text-zinc-900 ">
                신한 법인 프리빌리지 카드 •••• 8842
              </div>
              <div className="text-[12px] text-klic-muted">
                전자세금계산서 자동 발행: finance@hanbitfintech.kr
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {['₩10,000,000', '₩15,000,000', '₩30,000,000'].map((cap) => (
              <button
                key={cap}
                type="button"
                onClick={() => setSpendLimit(cap)}
                className={`px-2.5 py-1 rounded-lg text-[11.5px] font-medium cursor-pointer ${
                  spendLimit === cap
                    ? 'bg-klic-inverse text-klic-on-emphasis  '
                    : 'bg-white  text-klic-muted '
                }`}
              >
                상한 {cap}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-2.5 flex items-center justify-between text-[12px]">
        <span className="text-klic-muted">다음 정기 결제 예정일: 2026년 11월 1일</span>
        <button
          type="button"
          onClick={() => setAutoTopup((v) => !v)}
          className="font-semibold text-zinc-900  hover:underline cursor-pointer"
        >
          {autoTopup ? '✓ 한도 초과 시 자동 증설 활성' : '자동 증설 비활성'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white  rounded-2xl border border-zinc-200/80  overflow-hidden">
      {/* 상단 설정 스타일 전환 탭 바 (한글 전용) */}
      <div className="px-5 py-3.5 border-b border-zinc-200/80  bg-zinc-50/60  flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-klic-inverse " />
          <span className="text-[13px] font-semibold text-zinc-900 ">
            KLIC 엔터프라이즈 환경설정 컬렉션
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'team-permissions', label: '팀 & 결재 권한 관리' },
              { id: 'workspace-general', label: '일반 & 브랜딩' },
              { id: 'security-sso', label: '싱글 사인온 & 보안' },
              { id: 'notification-routing', label: '알림 라우팅 매트릭스' },
              { id: 'api-webhooks', label: 'API 키 & 할당량' },
              { id: 'billing-plan', label: '구독 플랜 & 결제' },
            ] as { id: SettingsShowcaseMode; label: string }[]
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
      <div className="p-4 sm:p-8 bg-white ">
        {activeMode === 'team-permissions' && renderTeamPermissionsSettings()}
        {activeMode === 'workspace-general' && renderWorkspaceGeneralSettings()}
        {activeMode === 'security-sso' && renderSecuritySsoSettings()}
        {activeMode === 'notification-routing' && renderNotificationRoutingSettings()}
        {activeMode === 'api-webhooks' && renderApiWebhooksSettings()}
        {activeMode === 'billing-plan' && renderBillingPlanSettings()}
      </div>
    </div>
  );
}
