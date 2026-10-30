export type SignalStatus = '대기 중' | '위험' | '정상 진행' | '차단됨';

export type StageId = '백로그' | '할 일' | '진행 중' | '완료';

export interface Assignee {
  id: string;
  name: string;
  avatar?: string;
  initials?: string;
}

export interface TaskTag {
  name: string;
  color: string;
  bgColor?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  iconName: string;
  stage: StageId;
  assignees: Assignee[];
  tag: TaskTag;
  dueDate: string;
  progress: number; // 0 - 100
  signal: SignalStatus;
  description?: string;
}

export interface StageGroup {
  id: StageId;
  label: string;
  description: string;
  color: string;
}

export interface BlockMeta {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  tags: string[];
  packageImport: string;
  isFavorite?: boolean;
  thumbnailSnippet?: string;
}

export interface RoadmapStats {
  total: number;
  blocked: number;
  atRisk: number;
  unassigned: number;
}

export type PermissionLevel = 'full' | 'partial' | 'none';

export type PermissionScopeKey =
  | 'settings'
  | 'billing'
  | 'integrations'
  | 'users'
  | 'permissions';

export interface AccessMember {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  isOnline: boolean;
  lastActiveText: string;
  isPinned: boolean;
  twoFactorEnabled: boolean;
  securityClearance: string;
  squadTag: string;
  environmentTag: string;
  dataScopeTag: string;
  auditGroupTag: string;
  expiryPolicy: string;
  scopes: Record<PermissionScopeKey, PermissionLevel>;
}

export type SubTaskStatus = '진행 중' | '완료' | '할 일';

export type SubTaskPriority = '긴급' | '높음' | '보통' | '낮음';

export interface SubTaskAssignee {
  name: string;
  avatar?: string;
  isUnassigned?: boolean;
}

export interface SubTaskItem {
  id: string;
  title: string;
  completed: boolean;
  status: SubTaskStatus;
  assignee: SubTaskAssignee;
  priority: SubTaskPriority;
  project: string;
}

export interface DeliveryTaskItem {
  id: string;
  title: string;
  completed: boolean;
  status: SubTaskStatus;
  assignee: SubTaskAssignee;
  priority: SubTaskPriority;
  project: string;
  isExpanded: boolean;
  bucket: 'active' | 'backlog' | 'done';
  subtasks: SubTaskItem[];
}

export type ReleaseApprovalStatus = '승인 대기' | '차단됨' | '승인 완료';

export type ReleaseRiskLevel = '심각' | '높음' | '보통' | '낮음';

export type ReleaseCheckBadgeStatus = '주의 필요' | '진행 중' | '완료';

export interface ReleaseCheckCardItem {
  id: string;
  badgeStatus: ReleaseCheckBadgeStatus;
  title: string;
  assigneeName: string;
  assigneeAvatar: string;
  dateLabel: string;
  progressRate: number; // 0 - 100 (진척률 프로그레스 바)
  coverageRate: number; // 0 - 100 (커버리지 원형 링)
}

export interface ReleaseApprovalItem {
  id: string;
  code: string;
  title: string;
  service: string;
  environment: string;
  ownerName: string;
  ownerRole: string;
  ownerAvatar: string;
  status: ReleaseApprovalStatus;
  risk: ReleaseRiskLevel;
  approvedCount: number;
  totalApprovers: number;
  readiness: number; // 0 - 100
  isExpanded: boolean;
  checklist: ReleaseCheckCardItem[];
}

export type PortfolioProjectStatus = '진행 중' | '기획 중' | '위험' | '완료됨';

export interface PortfolioProjectItem {
  id: string;
  name: string;
  iconType: 'globe' | 'smartphone' | 'megaphone' | 'rocket' | 'layers' | 'grid';
  iconBgClass: string;
  iconColorClass: string;
  leadInitials: string;
  leadName: string;
  leadBadgeClass: string;
  status: PortfolioProjectStatus;
  progress: number; // 0 - 100
  openTasks: number;
  overdueTasks: number;
  dueDate: string;
}

export type SlaRiskState = 'exhausted' | 'at-risk' | 'healthy';

export type SlaAlertState = '대기' | '긴급 호출';

export interface SlaReliabilityItem {
  id: string;
  name: string;
  serviceKey: string;
  iconType: 'server' | 'bell' | 'search' | 'database' | 'shield' | 'cpu' | 'webhook';
  targetPercent: string;
  windowLabel: string;
  marginPercent: number; // -100 to +100
  runsOutLabel: string; // '한도 초과' or '12일 남음' etc.
  alertState: SlaAlertState;
  riskState: SlaRiskState;
  team: string;
}

export type SupportTicketQueue = '플랫폼' | '빌링' | '인증' | '연동';

export type SupportTicketPriority = '긴급' | '높음' | '보통' | '낮음';

export type SupportTicketStatus = '대기 중' | '해결됨' | '열림';

export type SupportTicketSlaState = 'breached' | 'closed' | 'near' | 'safe';

export interface SupportTicketItem {
  id: string;
  code: string;
  title: string;
  openedAgo: string;
  requesterName: string;
  requesterOrg: string;
  requesterAvatar?: string;
  requesterInitials: string;
  queue: SupportTicketQueue;
  priority: SupportTicketPriority;
  slaSortOrder: number;
  slaLabel: string;
  slaSubtext: string;
  slaState: SupportTicketSlaState;
  status: SupportTicketStatus;
  assigneeName: string | null;
}

export type CatalogMode = 'course' | 'product';

export type CatalogStatus = 'published' | 'draft' | 'archived';

export type CatalogUrgency = '긴급' | '일반';

export interface CatalogAssignee {
  id: string;
  name: string;
  avatar: string;
}

export interface CatalogItem {
  id: string;
  mode: CatalogMode;
  title: string;
  authorOrBrand: string;
  dateLabel: string;
  thumbnail: string;
  category: string;
  urgency: CatalogUrgency;
  unitCount: number; // 강좌: 모듈/과정 수, 제품: 옵션/스펙 수
  score: number; // 0.0 - 5.0
  assignees: CatalogAssignee[];
  extraAssignedCount: number; // +2, +6 등 추가 인원
  completionRate: number | null; // null이면 '-' 표시, 숫자면 0-100 원형 링 표시
  status: CatalogStatus;
}

export type DriveItemType =
  | 'folder'
  | 'pdf'
  | 'figma'
  | 'spreadsheet'
  | 'doc'
  | 'archive'
  | 'image';

export interface DriveNode {
  id: string;
  name: string;
  type: DriveItemType;
  sizeBytes: number;
  ownerName: string;
  ownerAvatar: string;
  modifiedDate: string;
  relativeTime: string;
  children?: DriveNode[];
}

export interface FlattenedDriveItem extends DriveNode {
  depth: number;
  parentId: string | null;
  isExpanded: boolean;
  hasChildren: boolean;
  computedSize: number;
  computedItemCount?: number;
}

// -------------------------------------------------------------
// 리포트 및 스케줄 관리 (Reports & Schedules)
// -------------------------------------------------------------
export type ReportStatus =
  | 'Delivered'
  | 'Scheduled'
  | '1 bounced'
  | 'Draft'
  | '발송 완료'
  | '예약됨'
  | '반송 1건'
  | '임시저장';
export type ReportFormat = 'PDF' | 'CSV';
export type ReportScheduleType = 'scheduled' | 'on_demand';

export interface ReportRecipient {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
  avatarBg?: string;
  avatarText?: string;
}

export interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  frequency: string;
  format: ReportFormat;
  iconType: 'currency' | 'chart' | 'users' | 'percent' | 'box' | 'briefcase';
}

export interface ReportItem {
  id: string;
  title: string;
  templateName: string;
  ownerName: string;
  iconType: 'currency' | 'chart' | 'users' | 'speaker' | 'percent' | 'box' | 'briefcase';
  iconBgClass: string;
  iconColorClass: string;
  scheduleLabel: string;
  scheduleType: ReportScheduleType;
  recipients: ReportRecipient[];
  extraRecipientsCount: number;
  format: ReportFormat;
  lastSent: string;
  nextSend: string;
  status: ReportStatus;
  bounceReason?: string;
}

// ==========================================
// Integrations Hub & Sync Health Types
// ==========================================

export type IntegrationCategoryKey =
  | 'all'
  | 'processors'
  | 'commerce'
  | 'accounting'
  | 'alerts'
  | 'automation'
  | 'crm';

export type IntegrationStatus = 'connected' | 'available' | 'paused' | 'error';

export interface IntegrationItem {
  id: string;
  name: string;
  category: IntegrationCategoryKey;
  categoryLabel: string;
  brandKey:
    | 'stripe'
    | 'adyen'
    | 'paypal'
    | 'klarna'
    | 'shopify'
    | 'slack'
    | 'quickbooks'
    | 'xero'
    | 'hubspot'
    | 'zapier'
    | 'custom';
  status: IntegrationStatus;
  statusLabel: string;
  description: string;
  stat1: {
    label: string;
    value: string;
  };
  stat2: {
    label: string;
    value: string;
  };
  docsUrl?: string;
  webhookUrl?: string;
  syncInterval?: string;
  eventsCount24h?: number;
  lastSyncAgo?: string;
}

export interface SyncHealthService {
  id: string;
  name: string;
  brandKey: 'stripe' | 'adyen' | 'shopify' | 'paypal' | 'klarna' | string;
  eventsCount: number;
  eventsFormatted: string;
  lastSyncAgo: string;
  barPercent: number; // 0 - 100
  status: 'healthy' | 'degraded' | 'error';
}

// ==========================================
// Striped Rows Ledger Types
// ==========================================

export type ZebraTheme = 'subtle-gray' | 'soft-blue' | 'tinted-emerald' | 'high-contrast' | 'none';

export type LedgerTransactionType = '정산 입금' | '가맹점 송금' | 'FX 환전' | '수수료 청구' | '에스크로 예치' | '환불 지급';

export type LedgerStatus = '정산 완료' | '처리 중' | '이상 감지' | '보류 대기';

export interface LedgerTransactionItem {
  id: string;
  referenceNo: string;
  timestamp: string;
  timeAgo: string;
  type: LedgerTransactionType;
  counterparty: {
    name: string;
    accountNo: string;
    country: string;
    flag: string;
  };
  rail: 'SWIFT' | 'SEPA' | 'FedNow' | 'ACH' | 'Visa Direct' | 'Mastercard';
  currency: 'USD' | 'EUR' | 'KRW' | 'GBP' | 'JPY' | 'SGD';
  amount: number;
  amountFormatted: string;
  isCredit: boolean;
  fxRate?: string;
  feeAmount: string;
  status: LedgerStatus;
  auditor: {
    name: string;
    avatarUrl: string;
    isSystemBot?: boolean;
  };
  notes?: string;
}

// ==========================================
// Billing Upgrade & Renewal Wizard Types
// ==========================================

export type BillingPlanTier = 'team' | 'business' | 'enterprise';

export type BillingTerm = 'annual' | 'semi-annual' | 'quarterly';

export type BillingUpgradeStep = 1 | 2 | 3 | 4;

export interface BillingPlanInfo {
  id: BillingPlanTier;
  title: string;
  badge?: string;
  description: string;
  monthlyPerSeatPrice: number;
}
