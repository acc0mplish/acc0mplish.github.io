/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { lazyBlockComponents, type BlockComponents } from './block-components';
import { NewTaskModal } from './components/preview/NewTaskModal';
import {
  INITIAL_ROADMAP_TASKS,
  INITIAL_ACCESS_MEMBERS,
  INITIAL_DELIVERY_TASKS,
  INITIAL_RELEASE_APPROVALS,
  INITIAL_PORTFOLIO_PROJECTS,
  INITIAL_SLA_ITEMS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_COURSE_CATALOG,
  INITIAL_PRODUCT_CATALOG,
  INITIAL_SHARED_DRIVE_ITEMS,
  INITIAL_REPORTS_DATA,
} from './data/componentsData';
import { toggleDeliveryTaskCompletion } from './utils/subtasks';
import { approveReleaseItem, advanceCheckCardProgress } from './utils/releases';
import { advanceProjectProgress } from './utils/workspace';
import {
  bulkUpdateTicketStatus,
  bulkAssignTicketOwner,
  createSupportTicketItem,
} from './utils/tickets';
import {
  assignMemberToCatalogItem,
  updateCatalogItemStatus,
  createCatalogItem,
  CreateCatalogItemInput,
} from './utils/catalog';
import {
  TaskItem,
  AccessMember,
  DeliveryTaskItem,
  SubTaskPriority,
  ReleaseApprovalItem,
  ReleaseRiskLevel,
  PortfolioProjectItem,
  PortfolioProjectStatus,
  SlaReliabilityItem,
  SlaRiskState,
  SupportTicketItem,
  SupportTicketPriority,
  SupportTicketQueue,
  SupportTicketStatus,
  CatalogItem,
  CatalogAssignee,
  CatalogStatus,
  CatalogMode,
  DriveNode,
  ReportItem,
} from './types';

export const BLOCK_IDS = ['panel-timeline-context', 'panel-customer-inspector', 'panel-task-discussion', 'panel-risk-review', 'dashboard-sales-analytics', 'dashboard-ai-workspace', 'dashboard-automation-ops', 'dashboard-personal-finance', 'dashboard-flow-operations', 'dashboard-activation-goals', 'dashboard-report-center', 'dashboard-sales-pipeline', 'dashboard-deal-momentum', 'dashboard-ai-mail', 'dashboard-payment-authorizations', 'dashboard-project-tracker', 'dashboard-delivery-tracker', 'multi-select', 'tree-view', 'file-upload', 'trace-waterfall', 'log-stream', 'deploy-pipeline', "affect-agent-review", "affect-response-workspace", "affect-logo-marquee", "affect-testimonial-wall", "chart-distribution", "chart-violin", "chart-beeswarm", "chart-scatter-brush", "chart-calibration", "chart-candlestick", "chart-forecast-fan", "chart-drawdown", "chart-market-depth", "chart-orderbook", "chart-state-timeline", "chart-spark-table", "chart-waterfall", "chart-treemap", "chart-streamgraph", "daily-active-users-area", "cloud-spend-variance-bar", "chart-dumbbell", "chart-correlation", "chart-cohort-retention", "chart-calendar-heatmap", "self-serve-funnel", "chart-bullet", 'timeline-plan-actual', 'timeline-execution-waterfall', 'timeline-team-swimlane', 'timeline-milestone-delta', 'timeline-release-gates', 'flow-connector-straight', 'flow-connector-elbow', 'flow-connector-curve', 'flow-connector-step', 'flow-connector-dashed', 'flow-connector-bidirectional', 'flow-connector-rounded', 'flow-connector-ports', 'flow-connector-hyperedge', 'flow-connector-feedback', 'flow-connector-labels', 'flow-connector-taper', 'flow-connector-decision', 'flow-connector-parallel', 'flow-connector-state', 'flow-connector-retry', 'flow-connector-interaction', 'flow-connector-obstacle', 'flow-connector-metro', 'flow-connector-multiedge', 'flow-connector-loops', 'flow-connector-containers', 'flow-connector-bundle', 'flow-connector-bus', 'flow-connector-bridges', 'flow-connector-ribbons', 'flow-connector-radial', 'diagram-service-flow', 'template-advisor-knowledge', 'template-autonomous-task-lifecycle', 'template-smart-reorder-supplychain', 'template-proforma-financial-roi', 'template-enterprise-reports-center', 'cell-inline-input', 'popover-date-picker', 'tag-multiselect-editor', 'numeric-stepper-cell', 'optimistic-cell-save', 'sheet-issue-detail', 'sheet-trace-inspector', 'sheet-customer-360', 'sheet-advanced-filter', 'sheet-audit-diff', 'flow-react-lead-routing', 'flow-react-fds-routing', 'flow-react-vip-defense', 'flow-cicd-pipeline', 'flow-webhook-automation', 'flow-etl-lineage', 'flow-microservice-topology', 'flow-approval-routing', 'shell-enterprise-sidebar', 'shell-dual-rail-ide', 'shell-top-nav-portal', 'shell-master-detail-inbox', 'shell-canvas-studio', 'notif-project-updates', 'notif-floating-toast', 'notif-approval-center', 'notif-incident-pager', 'notif-mention-thread', 'notif-daily-digest', 'empty-search-filter', 'empty-first-project', 'empty-permission-locked', 'empty-integration-disconnected', 'empty-inbox-zero', 'settings-team-permissions', 'settings-workspace-general', 'settings-security-sso', 'settings-notification-routing', 'settings-api-webhooks', 'settings-billing-plan', 'list-audit-activity', 'list-notification-inbox', 'list-git-deployments', 'list-team-directory', 'list-api-webhooks', 'navbar-workspace-header', 'navbar-contextual-subnav', 'navbar-floating-dock', 'navbar-mega-menu', 'navbar-incident-banner', 'dialog-command-palette', 'dialog-destructive-confirm', 'dialog-share-permissions', 'dialog-api-token-create', 'dialog-bulk-import-csv', 'card-saas-metric', 'card-project-health', 'card-pricing-tier', 'card-api-integration', 'card-approval-request', 'card-meeting-schedule', 'dashboard-exec-revenue', 'dashboard-sre-observability', 'dashboard-product-analytics', 'dashboard-finops-cost', 'dashboard-cx-support', 'auth-enterprise-sso-login', 'auth-mfa-totp-verify', 'auth-workspace-signup', 'auth-session-device-manager', 'auth-step-up-reauth', 'schedule-shift-optimize', 'schedule-field-dispatch', 'schedule-daily-agenda', 'schedule-interview-slots', 'schedule-maintenance-window', 'schedule-shift-planner', 'schedule-batch-cron-agenda', 'agent-task-lifecycle', 'list-agent-tasks', 'kanban-sprint-board', 'kanban-swimlane-squad', 'kanban-crm-deal', 'kanban-incident-triage', 'kanban-hiring-ats', 'gantt-flux-wbs-svg', 'gantt-project-tasks', 'gantt-resource-capacity', 'gantt-milestone-roadmap', 'gantt-sprint-release', 'gantt-critical-path', 'error-budget-burn', 'capital-inflows-bar', 'revenue-breakdown-bar', 'headcount-cost-bar', 'env-promotion-pipeline', 'cron-run-history-tracker', 'uptime-sla-tracker', 'incident-health-bars', 'cash-inflows-radial', 'api-health-radial', 'competitor-feature-radar', 'team-velocity-polar', 'error-budget-slope', 'arr-growth-slope', 'feature-adoption-slope', 'funnel-flow', 'trial-flow', 'b2b-deals-flow', 'billing-upgrade', 'striped-rows', 'integrations-hub', 'reports-schedule', 'shared-drive-folders', 'course-catalog', 'product-catalog', 'support-tickets', 'sla-risk-index', 'workspace-overview', 'release-approvals', 'subtask-tracker', 'access-permissions-matrix', 'roadmap-stage', 'revenue-region', 'billing-transactions', 'rte-slash-document', 'rte-markdown-tech-spec', 'rte-collaborative-comment', 'rte-incident-postmortem', 'rte-email-campaign', 'onboarding-checklist-hub', 'onboarding-role-personalize', 'onboarding-interactive-tour', 'onboarding-sdk-quickstart', 'onboarding-data-migration', 'wizard-cloud-provisioning', 'wizard-enterprise-contract', 'wizard-rbac-role-builder', 'wizard-report-scheduler', 'wizard-sso-saml-setup', 'calendar-release-freeze', 'calendar-marketing-campaign', 'calendar-oncall-rotation', 'calendar-resource-booking', 'calendar-compliance-audit', 'stats-executive-kpi-strip', 'stats-sla-uptime-summary', 'stats-usage-quota-meters', 'stats-conversion-benchmark', 'stats-dora-engineering', 'timeline-incident-response', 'timeline-order-fulfillment', 'timeline-release-changelog', 'timeline-contract-lifecycle', 'timeline-pr-review-chain', 'form-incident-report', 'form-procurement-request', 'form-webhook-endpoint', 'form-database-connection', 'form-feature-flag-rule'] as const;
export interface BlockAppProps { selectedId: string; density: 'compact' | 'normal' | 'relaxed'; showAvatars?: boolean; showProgressRings?: boolean; onDensityChange?: (density: 'compact' | 'normal' | 'relaxed') => void; components?: BlockComponents }
export default function BlockApp({ selectedId: initialId, density: contextDensity, showAvatars = true, showProgressRings = true, onDensityChange, components = lazyBlockComponents }: BlockAppProps) {
  const {
    RightSidePanelBlock,
    DistributionChartsBlock,
    FinancialChartsBlock,
    CompositionChartsBlock,
    MatrixChartsBlock,
    AffectShowcaseBlock,
    FlowConnectorBlock,
    ServiceDiagramBlock,
    RoadmapBlock,
    AccessPermissionsBlock,
    SubTaskTrackerBlock,
    ReleaseApprovalsBlock,
    WorkspaceOverviewBlock,
    SlaRiskIndexBlock,
    SupportTicketsBlock,
    CatalogBlock,
    SharedDriveBlock,
    ReportsManagementBlock,
    IntegrationsHubBlock,
    StripedRowsBlock,
    BillingUpgradeBlock,
    FunnelFlowBlock,
    SlopeChartBlock,
    RadialChartBlock,
    StatusTrackerBlock,
    EnvironmentPipelineBlock,
    CapitalInflowsBlock,
    ErrorBudgetBurnBlock,
    GanttChartBlock,
    KanbanBoardBlock,
    TaskLifecycleBlock,
    ScheduleBlock,
    AuthBlock,
    DashboardWorkspaceBlock,
    SalesAnalyticsDashboardBlock,
    AIWorkspaceDashboardBlock,
    AutomationOperationsDashboardBlock,
    ReferenceDashboardBlock,
    InteractionReferenceBlock,
    CardShowcaseBlock,
    DialogShowcaseBlock,
    NavbarShowcaseBlock,
    ListShowcaseBlock,
    EmptyStateShowcaseBlock,
    SettingsShowcaseBlock,
    NotificationShowcaseBlock,
    DataEditingShowcaseBlock,
    RevenueBlock,
    BillingBlock,
    ApplicationTemplatesBlock,
    SheetShowcaseBlock,
    FlowShowcaseBlock,
    AppShellShowcaseBlock,
    RichTextEditorShowcaseBlock,
    OnboardingShowcaseBlock,
    WizardShowcaseBlock,
    CalendarShowcaseBlock,
    StatsShowcaseBlock,
    TimelineShowcaseBlock,
    LiveTimelineBlock,
    FormShowcaseBlock
  } = components;
  const [selectedId, setSelectedId] = useState(initialId);
  const [density, setDensity] = useState(contextDensity);
  useEffect(() => setDensity(contextDensity), [contextDensity]);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  // 로드맵 업무 리스트 상태
  const [tasks, setTasks] = useState<TaskItem[]>(() => initialId === 'roadmap-stage' ? structuredClone(INITIAL_ROADMAP_TASKS) : []);

  // 접근 권한 매트릭스 멤버 상태
  const [members, setMembers] = useState<AccessMember[]>(() => initialId === 'access-permissions-matrix' ? structuredClone(INITIAL_ACCESS_MEMBERS) : []);

  // 하위 작업 트래커 상태
  const [deliveryTasks, setDeliveryTasks] = useState<DeliveryTaskItem[]>(() => initialId === 'subtask-tracker' ? structuredClone(INITIAL_DELIVERY_TASKS) : []);

  // 릴리즈 승인 큐 상태
  const [releaseApprovals, setReleaseApprovals] = useState<ReleaseApprovalItem[]>(() => initialId === 'release-approvals' ? structuredClone(INITIAL_RELEASE_APPROVALS) : []);

  // 워크스페이스 포트폴리오 상태
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProjectItem[]>(() => initialId === 'workspace-overview' ? structuredClone(INITIAL_PORTFOLIO_PROJECTS) : []);

  // 유지보수 SLA 위험 리스크 지수 상태
  const [slaItems, setSlaItems] = useState<SlaReliabilityItem[]>(() => initialId === 'sla-risk-index' ? structuredClone(INITIAL_SLA_ITEMS) : []);

  // 고객 지원 티켓 큐 상태
  const [supportTickets, setSupportTickets] = useState<SupportTicketItem[]>(() => initialId === 'support-tickets' ? structuredClone(INITIAL_SUPPORT_TICKETS) : []);

  // 교육 카탈로그 및 제품 카탈로그 상태
  const [courseCatalog, setCourseCatalog] = useState<CatalogItem[]>(() => ['course-catalog', 'product-catalog'].includes(initialId) ? structuredClone(INITIAL_COURSE_CATALOG) : []);
  const [productCatalog, setProductCatalog] = useState<CatalogItem[]>(() => ['course-catalog', 'product-catalog'].includes(initialId) ? structuredClone(INITIAL_PRODUCT_CATALOG) : []);

  // 공유 드라이브 폴더 상태
  const [driveItems, setDriveItems] = useState<DriveNode[]>(() => initialId === 'shared-drive-folders' ? structuredClone(INITIAL_SHARED_DRIVE_ITEMS) : []);

  // 리포트 및 스케줄 관리 상태
  const [reports, setReports] = useState<ReportItem[]>(() => initialId === 'reports-schedule' ? structuredClone(INITIAL_REPORTS_DATA) : []);

  const handleUpdateTask = (updated: TaskItem) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleAddTask = (newTask: TaskItem) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdateMember = (updated: AccessMember) => {
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleUnpinAllMembers = () => {
    setMembers((prev) => prev.map((m) => ({ ...m, isPinned: false })));
  };

  const handleToggleDeliveryTask = (parentId: string, subTaskId?: string) => {
    setDeliveryTasks((prev) =>
      toggleDeliveryTaskCompletion(prev, parentId, subTaskId)
    );
  };

  const handleToggleExpandDeliveryTask = (parentId: string) => {
    setDeliveryTasks((prev) =>
      prev.map((t) =>
        t.id === parentId ? { ...t, isExpanded: !t.isExpanded } : t
      )
    );
  };

  const handleExpandAllDeliveryTasks = (expand: boolean) => {
    setDeliveryTasks((prev) =>
      prev.map((t) => ({ ...t, isExpanded: expand }))
    );
  };

  const handleAddParentDeliveryTask = (payload: {
    title: string;
    priority: SubTaskPriority;
    project: string;
    assigneeName: string;
  }) => {
    const newParent: DeliveryTaskItem = {
      id: `dt-${Date.now()}`,
      title: payload.title,
      completed: false,
      status: '진행 중',
      assignee: {
        name: payload.assigneeName,
        avatar:
          './placeholders/avatar-27ccdef6fa6f.svg',
      },
      priority: payload.priority,
      project: payload.project,
      isExpanded: true,
      bucket: 'active',
      subtasks: [],
    };
    setDeliveryTasks((prev) => [newParent, ...prev]);
  };

  const handleAddSubDeliveryTask = (parentId: string, title: string) => {
    setDeliveryTasks((prev) =>
      prev.map((t) => {
        if (t.id !== parentId) return t;
        return {
          ...t,
          isExpanded: true,
          subtasks: [
            ...t.subtasks,
            {
              id: `sub-${Date.now()}`,
              title,
              completed: false,
              status: '할 일',
              assignee: t.assignee,
              priority: t.priority,
              project: t.project,
            },
          ],
        };
      })
    );
  };

  const handleToggleExpandRelease = (releaseId: string) => {
    setReleaseApprovals((prev) =>
      prev.map((r) =>
        r.id === releaseId ? { ...r, isExpanded: !r.isExpanded } : r
      )
    );
  };

  const handleExpandAllReleases = (expand: boolean) => {
    setReleaseApprovals((prev) =>
      prev.map((r) => ({ ...r, isExpanded: expand }))
    );
  };

  const handleApproveRelease = (releaseId: string) => {
    setReleaseApprovals((prev) => approveReleaseItem(prev, releaseId));
  };

  const handleAdvanceCheckCard = (releaseId: string, cardId: string) => {
    setReleaseApprovals((prev) =>
      advanceCheckCardProgress(prev, releaseId, cardId)
    );
  };

  const handleAddRelease = (payload: {
    title: string;
    service: string;
    risk: ReleaseRiskLevel;
    ownerName: string;
  }) => {
    const newRel: ReleaseApprovalItem = {
      id: `rel-${Date.now()}`,
      code: `REL-${Math.floor(8500 + Math.random() * 400)}`,
      title: payload.title,
      service: payload.service,
      environment: '운영 (Production)',
      ownerName: payload.ownerName,
      ownerRole: '릴리즈 리드',
      ownerAvatar:
        './placeholders/avatar-27ccdef6fa6f.svg',
      status: '승인 대기',
      risk: payload.risk,
      approvedCount: 1,
      totalApprovers: 4,
      readiness: 35,
      isExpanded: true,
      checklist: [
        {
          id: `chk-${Date.now()}-1`,
          badgeStatus: '진행 중',
          title: '카나리 트래픽 사전 검증',
          assigneeName: payload.ownerName,
          assigneeAvatar:
            './placeholders/avatar-27ccdef6fa6f.svg',
          dateLabel: '오늘 마감',
          progressRate: 35,
          coverageRate: 40,
        },
      ],
    };
    setReleaseApprovals((prev) => [newRel, ...prev]);
  };

  const handleAdvanceProject = (projectId: string) => {
    setPortfolioProjects((prev) => advanceProjectProgress(prev, projectId));
  };

  const handleAddPortfolioProject = (payload: {
    name: string;
    leadName: string;
    status: PortfolioProjectStatus;
    dueDate: string;
  }) => {
    const initials = payload.leadName.includes('존')
      ? 'JC'
      : payload.leadName.includes('프리야')
      ? 'PP'
      : payload.leadName.includes('탄짐')
      ? 'TI'
      : 'SC';

    const newProj: PortfolioProjectItem = {
      id: `proj-${Date.now()}`,
      name: payload.name,
      iconType: 'layers',
      iconBgClass: 'bg-blue-50 ',
      iconColorClass: 'text-blue-600 ',
      leadInitials: initials,
      leadName: payload.leadName,
      leadBadgeClass:
        'bg-blue-100  text-blue-700 ',
      status: payload.status,
      progress: 25,
      openTasks: 5,
      overdueTasks: 0,
      dueDate: payload.dueDate,
    };
    setPortfolioProjects((prev) => [newProj, ...prev]);
  };

  const handleAddSlaItem = (payload: {
    name: string;
    serviceKey: string;
    team: string;
    targetPercent: string;
    marginPercent: number;
  }) => {
    const riskState: SlaRiskState =
      payload.marginPercent < 0
        ? 'exhausted'
        : payload.marginPercent < 30
        ? 'at-risk'
        : 'healthy';

    const newItem: SlaReliabilityItem = {
      id: `sla-${Date.now()}`,
      name: payload.name,
      serviceKey: payload.serviceKey,
      iconType: 'server',
      targetPercent: payload.targetPercent,
      windowLabel: '30일',
      marginPercent: payload.marginPercent,
      runsOutLabel: payload.marginPercent < 0 ? '한도 초과' : '21일 남음',
      alertState: payload.marginPercent < -40 ? '긴급 호출' : '대기',
      riskState,
      team: payload.team,
    };
    setSlaItems((prev) => [newItem, ...prev]);
  };

  const handleBulkUpdateTicketStatus = (
    ids: string[],
    status: SupportTicketStatus
  ) => {
    setSupportTickets((prev) => bulkUpdateTicketStatus(prev, ids, status));
  };

  const handleBulkAssignTicketOwner = (
    ids: string[],
    assignee: string | null
  ) => {
    setSupportTickets((prev) => bulkAssignTicketOwner(prev, ids, assignee));
  };

  const handleAddSupportTicket = (payload: {
    title: string;
    requesterName: string;
    requesterOrg: string;
    queue: SupportTicketQueue;
    priority: SupportTicketPriority;
    assigneeName: string | null;
  }) => {
    const created = createSupportTicketItem(payload);
    setSupportTickets((prev) => [created, ...prev]);
  };

  const handleAssignCatalogMember = (
    mode: CatalogMode,
    itemId: string,
    member: CatalogAssignee
  ) => {
    if (mode === 'course') {
      setCourseCatalog((prev) => assignMemberToCatalogItem(prev, itemId, member));
    } else {
      setProductCatalog((prev) => assignMemberToCatalogItem(prev, itemId, member));
    }
  };

  const handleUpdateCatalogStatus = (
    mode: CatalogMode,
    itemId: string,
    status: CatalogStatus
  ) => {
    if (mode === 'course') {
      setCourseCatalog((prev) => updateCatalogItemStatus(prev, itemId, status));
    } else {
      setProductCatalog((prev) => updateCatalogItemStatus(prev, itemId, status));
    }
  };

  const handleAddCatalogItem = (input: CreateCatalogItemInput) => {
    const created = createCatalogItem(input);
    if (input.mode === 'course') {
      setCourseCatalog((prev) => [created, ...prev]);
    } else {
      setProductCatalog((prev) => [created, ...prev]);
    }
  };

  const renderActiveComponent = () => {
    switch (selectedId) {
      case 'panel-timeline-context':
        return <RightSidePanelBlock initialMode="timeline-context" density={density} />;
      case 'panel-customer-inspector':
        return <RightSidePanelBlock initialMode="customer-inspector" density={density} />;
      case 'panel-task-discussion':
        return <RightSidePanelBlock initialMode="task-discussion" density={density} />;
      case 'panel-risk-review':
        return <RightSidePanelBlock initialMode="risk-review" density={density} />;

      case 'chart-distribution': return <DistributionChartsBlock key={selectedId} variant="distribution" density={density} />;
      case 'chart-violin': return <DistributionChartsBlock key={selectedId} variant="violin" density={density} />;
      case 'chart-beeswarm': return <DistributionChartsBlock key={selectedId} variant="beeswarm" density={density} />;
      case 'chart-scatter-brush': return <DistributionChartsBlock key={selectedId} variant="scatter" density={density} />;
      case 'chart-calibration': return <DistributionChartsBlock key={selectedId} variant="calibration" density={density} />;
      case 'chart-candlestick': return <FinancialChartsBlock key={selectedId} variant="candlestick" density={density} />;
      case 'chart-forecast-fan': return <FinancialChartsBlock key={selectedId} variant="forecast" density={density} />;
      case 'chart-drawdown': return <FinancialChartsBlock key={selectedId} variant="drawdown" density={density} />;
      case 'chart-market-depth': return <FinancialChartsBlock key={selectedId} variant="depth" density={density} />;
      case 'chart-orderbook': return <FinancialChartsBlock key={selectedId} variant="orderbook" density={density} />;
      case 'chart-state-timeline': return <FinancialChartsBlock key={selectedId} variant="state-timeline" density={density} />;
      case 'chart-spark-table': return <FinancialChartsBlock key={selectedId} variant="spark-table" density={density} />;
      case 'chart-waterfall': return <CompositionChartsBlock key={selectedId} variant="waterfall" density={density} />;
      case 'chart-treemap': return <CompositionChartsBlock key={selectedId} variant="treemap" density={density} />;
      case 'chart-streamgraph': return <CompositionChartsBlock key={selectedId} variant="streamgraph" density={density} />;
      case 'daily-active-users-area': return <CompositionChartsBlock key={selectedId} variant="stacked-area" density={density} />;
      case 'cloud-spend-variance-bar': return <CompositionChartsBlock key={selectedId} variant="grouped-bar" density={density} />;
      case 'chart-dumbbell': return <CompositionChartsBlock key={selectedId} variant="dumbbell" density={density} />;
      case 'chart-correlation': return <MatrixChartsBlock key={selectedId} variant="correlation" density={density} />;
      case 'chart-cohort-retention': return <MatrixChartsBlock key={selectedId} variant="cohort" density={density} />;
      case 'chart-calendar-heatmap': return <MatrixChartsBlock key={selectedId} variant="calendar" density={density} />;
      case 'self-serve-funnel': return <MatrixChartsBlock key={selectedId} variant="funnel" density={density} />;
      case 'chart-bullet': return <MatrixChartsBlock key={selectedId} variant="bullet" density={density} />;
      case 'affect-agent-review': return <AffectShowcaseBlock mode='review' density={contextDensity}/>;
      case 'affect-response-workspace': return <AffectShowcaseBlock mode='response' density={contextDensity}/>;
      case 'affect-logo-marquee': return <AffectShowcaseBlock mode='marquee' density={contextDensity}/>;
      case 'affect-testimonial-wall': return <AffectShowcaseBlock mode='testimonials' density={contextDensity}/>;
      case 'flow-connector-straight': return <FlowConnectorBlock mode='straight' density={contextDensity}/>;
      case 'flow-connector-elbow': return <FlowConnectorBlock mode='elbow' density={contextDensity}/>;
      case 'flow-connector-curve': return <FlowConnectorBlock mode='curve' density={contextDensity}/>;
      case 'flow-connector-step': return <FlowConnectorBlock mode='step' density={contextDensity}/>;
      case 'flow-connector-dashed': return <FlowConnectorBlock mode='dashed' density={contextDensity}/>;
      case 'flow-connector-bidirectional': return <FlowConnectorBlock mode='bidirectional' density={contextDensity}/>;
      case 'flow-connector-rounded': return <FlowConnectorBlock mode='rounded' density={contextDensity}/>;
      case 'flow-connector-ports': return <FlowConnectorBlock mode='ports' density={contextDensity}/>;
      case 'flow-connector-hyperedge': return <FlowConnectorBlock mode='hyperedge' density={contextDensity}/>;
      case 'flow-connector-feedback': return <FlowConnectorBlock mode='feedback' density={contextDensity}/>;
      case 'flow-connector-labels': return <FlowConnectorBlock mode='labels' density={contextDensity}/>;
      case 'flow-connector-taper': return <FlowConnectorBlock mode='taper' density={contextDensity}/>;
      case 'flow-connector-decision': return <FlowConnectorBlock mode='decision' density={contextDensity}/>;
      case 'flow-connector-parallel': return <FlowConnectorBlock mode='parallel' density={contextDensity}/>;
      case 'flow-connector-state': return <FlowConnectorBlock mode='state' density={contextDensity}/>;
      case 'flow-connector-retry': return <FlowConnectorBlock mode='retry' density={contextDensity}/>;
      case 'flow-connector-interaction': return <FlowConnectorBlock mode='interaction' density={contextDensity}/>;
      case 'flow-connector-obstacle': return <FlowConnectorBlock mode='obstacle' density={contextDensity}/>;
      case 'flow-connector-metro': return <FlowConnectorBlock mode='metro' density={contextDensity}/>;
      case 'flow-connector-multiedge': return <FlowConnectorBlock mode='multiedge' density={contextDensity}/>;
      case 'flow-connector-loops': return <FlowConnectorBlock mode='loops' density={contextDensity}/>;
      case 'flow-connector-containers': return <FlowConnectorBlock mode='containers' density={contextDensity}/>;
      case 'flow-connector-bundle': return <FlowConnectorBlock mode='bundle' density={contextDensity}/>;
      case 'flow-connector-bus': return <FlowConnectorBlock mode='bus' density={contextDensity}/>;
      case 'flow-connector-bridges': return <FlowConnectorBlock mode='bridges' density={contextDensity}/>;
      case 'flow-connector-ribbons': return <FlowConnectorBlock mode='ribbons' density={contextDensity}/>;
      case 'flow-connector-radial': return <FlowConnectorBlock mode='radial' density={contextDensity}/>;
      case 'diagram-service-flow':
        return <ServiceDiagramBlock density={density} />;
      case 'template-advisor-knowledge':
        return <ApplicationTemplatesBlock initialTemplate="template-advisor-knowledge" density={density} />;
      case 'template-autonomous-task-lifecycle':
        return <ApplicationTemplatesBlock initialTemplate="template-autonomous-task-lifecycle" density={density} />;
      case 'template-smart-reorder-supplychain':
        return <ApplicationTemplatesBlock initialTemplate="template-smart-reorder-supplychain" density={density} />;
      case 'template-proforma-financial-roi':
        return <ApplicationTemplatesBlock initialTemplate="template-proforma-financial-roi" density={density} />;
      case 'template-enterprise-reports-center':
        return <ApplicationTemplatesBlock initialTemplate="template-enterprise-reports-center" density={density} />;
      case 'cell-inline-input':
        return <DataEditingShowcaseBlock initialMode="proforma-matrix" density={density} />;
      case 'popover-date-picker':
        return <DataEditingShowcaseBlock initialMode="reorder-sheet" density={density} />;
      case 'tag-multiselect-editor':
        return <DataEditingShowcaseBlock initialMode="split-drawer" density={density} />;
      case 'numeric-stepper-cell':
        return <DataEditingShowcaseBlock initialMode="batch-sandbox" density={density} />;
      case 'optimistic-cell-save':
        return <DataEditingShowcaseBlock initialMode="schema-json" density={density} />;
      case 'sheet-issue-detail':
        return <SheetShowcaseBlock initialMode="issue-detail" density={density} />;
      case 'sheet-trace-inspector':
        return <SheetShowcaseBlock initialMode="trace-inspector" density={density} />;
      case 'sheet-customer-360':
        return <SheetShowcaseBlock initialMode="customer-360" density={density} />;
      case 'sheet-advanced-filter':
        return <SheetShowcaseBlock initialMode="advanced-filter" density={density} />;
      case 'sheet-audit-diff':
        return <SheetShowcaseBlock initialMode="audit-diff" density={density} />;
      case 'flow-react-lead-routing':
        return <FlowShowcaseBlock initialMode="react-flow-lead" density={density} />;
      case 'flow-react-fds-routing':
        return <FlowShowcaseBlock initialMode="react-flow-fds" density={density} />;
      case 'flow-react-vip-defense':
        return <FlowShowcaseBlock initialMode="react-flow-vip" density={density} />;
      case 'flow-cicd-pipeline':
        return <FlowShowcaseBlock initialMode="cicd-pipeline" density={density} />;
      case 'flow-webhook-automation':
        return <FlowShowcaseBlock initialMode="webhook-automation" density={density} />;
      case 'flow-etl-lineage':
        return <FlowShowcaseBlock initialMode="etl-lineage" density={density} />;
      case 'flow-microservice-topology':
        return <FlowShowcaseBlock initialMode="microservice-topology" density={density} />;
      case 'flow-approval-routing':
        return <FlowShowcaseBlock initialMode="approval-routing" density={density} />;
      case 'shell-enterprise-sidebar':
        return <AppShellShowcaseBlock initialMode="enterprise-sidebar" density={density} />;
      case 'shell-dual-rail-ide':
        return <AppShellShowcaseBlock initialMode="dual-rail-ide" density={density} />;
      case 'shell-top-nav-portal':
        return <AppShellShowcaseBlock initialMode="top-nav-portal" density={density} />;
      case 'shell-master-detail-inbox':
        return <AppShellShowcaseBlock initialMode="master-detail-inbox" density={density} />;
      case 'shell-canvas-studio':
        return <AppShellShowcaseBlock initialMode="canvas-studio" density={density} />;
      case 'notif-project-updates':
        return <NotificationShowcaseBlock initialMode="project-updates" density={density} />;
      case 'notif-floating-toast':
        return <NotificationShowcaseBlock initialMode="floating-toast" density={density} />;
      case 'notif-approval-center':
        return <NotificationShowcaseBlock initialMode="approval-center" density={density} />;
      case 'notif-incident-pager':
        return <NotificationShowcaseBlock initialMode="incident-pager" density={density} />;
      case 'notif-mention-thread':
        return <NotificationShowcaseBlock initialMode="mention-thread" density={density} />;
      case 'notif-daily-digest':
        return <NotificationShowcaseBlock initialMode="daily-digest" density={density} />;
      case 'empty-search-filter':
        return <EmptyStateShowcaseBlock initialMode="all-showcase" density={density} />;
      case 'empty-first-project':
        return <EmptyStateShowcaseBlock initialMode="first-project" density={density} />;
      case 'empty-permission-locked':
        return <EmptyStateShowcaseBlock initialMode="permission-locked" density={density} />;
      case 'empty-integration-disconnected':
        return <EmptyStateShowcaseBlock initialMode="integration-disconnected" density={density} />;
      case 'empty-inbox-zero':
        return <EmptyStateShowcaseBlock initialMode="inbox-zero" density={density} />;
      case 'settings-team-permissions':
        return <SettingsShowcaseBlock initialMode="team-permissions" density={density} />;
      case 'settings-workspace-general':
        return <SettingsShowcaseBlock initialMode="workspace-general" density={density} />;
      case 'settings-security-sso':
        return <SettingsShowcaseBlock initialMode="security-sso" density={density} />;
      case 'settings-notification-routing':
        return <SettingsShowcaseBlock initialMode="notification-routing" density={density} />;
      case 'settings-api-webhooks':
        return <SettingsShowcaseBlock initialMode="api-webhooks" density={density} />;
      case 'settings-billing-plan':
        return <SettingsShowcaseBlock initialMode="billing-plan" density={density} />;
      case 'list-audit-activity':
        return <ListShowcaseBlock initialMode="audit-activity" density={density} />;
      case 'list-notification-inbox':
        return <ListShowcaseBlock initialMode="notification-inbox" density={density} />;
      case 'list-git-deployments':
        return <ListShowcaseBlock initialMode="git-deployments" density={density} />;
      case 'list-team-directory':
        return <ListShowcaseBlock initialMode="team-directory" density={density} />;
      case 'list-api-webhooks':
        return <ListShowcaseBlock initialMode="api-webhooks" density={density} />;
      case 'navbar-workspace-header':
        return <NavbarShowcaseBlock initialMode="all-showcase" density={density} />;
      case 'navbar-contextual-subnav':
        return <NavbarShowcaseBlock initialMode="contextual-subnav" density={density} />;
      case 'navbar-floating-dock':
        return <NavbarShowcaseBlock initialMode="floating-dock" density={density} />;
      case 'navbar-mega-menu':
        return <NavbarShowcaseBlock initialMode="mega-menu" density={density} />;
      case 'navbar-incident-banner':
        return <NavbarShowcaseBlock initialMode="incident-banner" density={density} />;
      case 'dialog-command-palette':
        return <DialogShowcaseBlock initialMode="workspace-app" density={density} />;
      case 'dialog-destructive-confirm':
        return <DialogShowcaseBlock initialMode="destructive-confirm" density={density} />;
      case 'dialog-share-permissions':
        return <DialogShowcaseBlock initialMode="share-permissions" density={density} />;
      case 'dialog-api-token-create':
        return <DialogShowcaseBlock initialMode="api-token" density={density} />;
      case 'dialog-bulk-import-csv':
        return <DialogShowcaseBlock initialMode="csv-import" density={density} />;
      case 'card-saas-metric':
        return <CardShowcaseBlock initialMode="all-showcase" density={density} />;
      case 'card-project-health':
        return <CardShowcaseBlock initialMode="play-mode-hero" density={density} />;
      case 'card-pricing-tier':
        return <CardShowcaseBlock initialMode="always-on-watch" density={density} />;
      case 'card-api-integration':
        return <CardShowcaseBlock initialMode="partner-split" density={density} />;
      case 'card-approval-request':
        return <CardShowcaseBlock initialMode="delivery-details" density={density} />;
      case 'card-meeting-schedule':
        return <CardShowcaseBlock initialMode="meeting-dual" density={density} />;
      case 'dashboard-sales-analytics':
        return <SalesAnalyticsDashboardBlock density={density} />;
      case 'dashboard-ai-workspace':
        return <AIWorkspaceDashboardBlock density={density} />;
      case 'dashboard-automation-ops':
        return <AutomationOperationsDashboardBlock density={density} />;
      case 'dashboard-personal-finance': return <ReferenceDashboardBlock key="finance" mode="finance" density={density} />;
      case 'dashboard-flow-operations': return <ReferenceDashboardBlock key="flows" mode="flows" density={density} />;
      case 'dashboard-activation-goals': return <ReferenceDashboardBlock key="activation" mode="activation" density={density} />;
      case 'dashboard-report-center': return <ReferenceDashboardBlock key="reports" mode="reports" density={density} />;
      case 'dashboard-sales-pipeline': return <ReferenceDashboardBlock key="pipeline" mode="pipeline" density={density} />;
      case 'dashboard-deal-momentum': return <ReferenceDashboardBlock key="momentum" mode="momentum" density={density} />;
      case 'dashboard-ai-mail': return <ReferenceDashboardBlock key="mail" mode="mail" density={density} />;
      case 'dashboard-payment-authorizations': return <ReferenceDashboardBlock key="payments" mode="payments" density={density} />;
      case 'dashboard-project-tracker': return <ReferenceDashboardBlock key="projects" mode="projects" density={density} />;
      case 'dashboard-delivery-tracker': return <ReferenceDashboardBlock key="delivery" mode="delivery" density={density} />;
      case 'multi-select': return <InteractionReferenceBlock key="multi-select" mode="multi-select" density={density} />;
      case 'tree-view': return <InteractionReferenceBlock key="tree-view" mode="tree-view" density={density} />;
      case 'file-upload': return <InteractionReferenceBlock key="file-upload" mode="file-upload" density={density} />;
      case 'trace-waterfall': return <InteractionReferenceBlock key="trace-waterfall" mode="trace-waterfall" density={density} />;
      case 'log-stream': return <InteractionReferenceBlock key="log-stream" mode="log-stream" density={density} />;
      case 'deploy-pipeline': return <InteractionReferenceBlock key="deploy-pipeline" mode="deploy-pipeline" density={density} />;
      case 'dashboard-exec-revenue':
        return <DashboardWorkspaceBlock initialMode="knowledge-conflict" density={density} />;
      case 'dashboard-sre-observability':
        return <DashboardWorkspaceBlock initialMode="escalation-triage" density={density} />;
      case 'dashboard-product-analytics':
        return <DashboardWorkspaceBlock initialMode="methodology-rules" density={density} />;
      case 'dashboard-finops-cost':
        return <DashboardWorkspaceBlock initialMode="practice-insights" density={density} />;
      case 'dashboard-cx-support':
        return <DashboardWorkspaceBlock initialMode="client-deliverables" density={density} />;
      case 'auth-enterprise-sso-login':
        return <AuthBlock initialMode="flux-card" density={density} />;
      case 'auth-mfa-totp-verify':
        return <AuthBlock initialMode="split-glass" density={density} />;
      case 'auth-workspace-signup':
        return <AuthBlock initialMode="workspace-signup" density={density} />;
      case 'auth-session-device-manager':
        return <AuthBlock initialMode="mfa-verify" density={density} />;
      case 'auth-step-up-reauth':
        return <AuthBlock initialMode="sudo-recovery" density={density} />;
      case 'schedule-shift-optimize':
        return <ScheduleBlock initialMode="optimize" density={density} />;
      case 'schedule-field-dispatch':
        return <ScheduleBlock initialMode="dispatch" density={density} />;
      case 'schedule-daily-agenda':
        return <ScheduleBlock initialMode="daily-agenda" density={density} />;
      case 'schedule-interview-slots':
        return <ScheduleBlock initialMode="interview-slots" density={density} />;
      case 'schedule-maintenance-window':
        return <ScheduleBlock initialMode="maintenance-window" density={density} />;
      case 'schedule-shift-planner':
        return <ScheduleBlock initialMode="shift-planner" density={density} />;
      case 'schedule-batch-cron-agenda':
        return <ScheduleBlock initialMode="batch-cron" density={density} />;
      case 'agent-task-lifecycle':
        return <KanbanBoardBlock initialMode="lifecycle" density={density} />;
      case 'list-agent-tasks':
        return <TaskLifecycleBlock density={density} />;
      case 'kanban-sprint-board':
        return <KanbanBoardBlock initialMode="issue-tracker" density={density} />;
      case 'kanban-swimlane-squad':
        return <KanbanBoardBlock initialMode="swimlane" density={density} />;
      case 'kanban-crm-deal':
        return <KanbanBoardBlock initialMode="crm" density={density} />;
      case 'kanban-incident-triage':
        return <KanbanBoardBlock initialMode="incident" density={density} />;
      case 'kanban-hiring-ats':
        return <KanbanBoardBlock initialMode="hiring" density={density} />;
      case 'gantt-flux-wbs-svg':
        return <GanttChartBlock initialMode="flux-wbs" density={density} />;
      case 'gantt-project-tasks':
        return <GanttChartBlock initialMode="project" density={density} />;
      case 'gantt-resource-capacity':
        return <GanttChartBlock initialMode="resource" density={density} />;
      case 'gantt-milestone-roadmap':
        return <GanttChartBlock initialMode="milestone" density={density} />;
      case 'gantt-sprint-release':
        return <GanttChartBlock initialMode="sprint" density={density} />;
      case 'gantt-critical-path':
        return <GanttChartBlock initialMode="critical" density={density} />;
      case 'error-budget-burn':
        return <ErrorBudgetBurnBlock density={density} />;
      case 'capital-inflows-bar':
      case 'revenue-breakdown-bar':
      case 'headcount-cost-bar':
        return <CapitalInflowsBlock key={selectedId} variant={selectedId} density={density} />;
      case 'env-promotion-pipeline':
        return <EnvironmentPipelineBlock density={density} />;
      case 'cron-run-history-tracker':
      case 'uptime-sla-tracker':
      case 'incident-health-bars':
        return <StatusTrackerBlock key={selectedId} variant={selectedId} density={density} />;
      case 'cash-inflows-radial':
      case 'api-health-radial':
      case 'competitor-feature-radar':
      case 'team-velocity-polar':
        return <RadialChartBlock key={selectedId} variant={selectedId} density={density} />;
      case 'error-budget-slope':
      case 'arr-growth-slope':
      case 'feature-adoption-slope':
        return <SlopeChartBlock key={selectedId} variant={selectedId} density={density} />;
      case 'funnel-flow':
      case 'trial-flow':
      case 'b2b-deals-flow':
        return (
          <FunnelFlowBlock
            key={selectedId}
            initialCard={
              selectedId === 'trial-flow'
                ? 'trial'
                : selectedId === 'b2b-deals-flow'
                ? 'deal'
                : 'revenue'
            }
            density={density}
          />
        );
      case 'billing-upgrade':
        return <BillingUpgradeBlock density={density} />;
      case 'striped-rows':
        return <StripedRowsBlock density={density} />;
      case 'integrations-hub':
        return <IntegrationsHubBlock density={density} />;
      case 'reports-schedule':
        return (
          <ReportsManagementBlock
            reports={reports}
            onAddReport={(newReport) => setReports((prev) => [newReport, ...prev])}
            density={density}
          />
        );
      case 'shared-drive-folders':
        return (
          <SharedDriveBlock
            items={driveItems}
            onResetItems={() => setDriveItems(structuredClone(INITIAL_SHARED_DRIVE_ITEMS))}
          />
        );
      case 'course-catalog':
        return (
          <CatalogBlock
            mode="course"
            items={courseCatalog}
            onSwitchMode={(nextMode) =>
              setSelectedId(
                nextMode === 'course' ? 'course-catalog' : 'product-catalog'
              )
            }
            onAssignMember={(itemId, member) =>
              handleAssignCatalogMember('course', itemId, member)
            }
            onUpdateStatus={(itemId, status) =>
              handleUpdateCatalogStatus('course', itemId, status)
            }
            onAddCatalogItem={handleAddCatalogItem}
            density={density}
            onDensityChange={value => {setDensity(value);onDensityChange?.(value);}}
            showAvatars={showAvatars}
            showProgressRings={showProgressRings}
          />
        );
      case 'product-catalog':
        return (
          <CatalogBlock
            mode="product"
            items={productCatalog}
            onSwitchMode={(nextMode) =>
              setSelectedId(
                nextMode === 'course' ? 'course-catalog' : 'product-catalog'
              )
            }
            onAssignMember={(itemId, member) =>
              handleAssignCatalogMember('product', itemId, member)
            }
            onUpdateStatus={(itemId, status) =>
              handleUpdateCatalogStatus('product', itemId, status)
            }
            onAddCatalogItem={handleAddCatalogItem}
            density={density}
            onDensityChange={value => {setDensity(value);onDensityChange?.(value);}}
            showAvatars={showAvatars}
            showProgressRings={showProgressRings}
          />
        );
      case 'support-tickets':
        return (
          <SupportTicketsBlock
            tickets={supportTickets}
            onBulkUpdateStatus={handleBulkUpdateTicketStatus}
            onBulkAssignOwner={handleBulkAssignTicketOwner}
            onAddTicket={handleAddSupportTicket}
            density={density}
            showAvatars={showAvatars}
          />
        );
      case 'sla-risk-index':
        return (
          <SlaRiskIndexBlock
            slaItems={slaItems}
            onAddSlaItem={handleAddSlaItem}
            density={density}
          />
        );
      case 'workspace-overview':
        return (
          <WorkspaceOverviewBlock
            projects={portfolioProjects}
            onAdvanceProject={handleAdvanceProject}
            onAddProject={handleAddPortfolioProject}
            density={density}
            showAvatars={showAvatars}
          />
        );
      case 'release-approvals':
        return (
          <ReleaseApprovalsBlock
            releases={releaseApprovals}
            onToggleExpand={handleToggleExpandRelease}
            onExpandAll={handleExpandAllReleases}
            onApproveRelease={handleApproveRelease}
            onAdvanceCheckCard={handleAdvanceCheckCard}
            onAddRelease={handleAddRelease}
            density={density}
            showAvatars={showAvatars}
            showProgressRings={showProgressRings}
          />
        );
      case 'subtask-tracker':
        return (
          <SubTaskTrackerBlock
            tasks={deliveryTasks}
            onToggleTask={handleToggleDeliveryTask}
            onToggleExpand={handleToggleExpandDeliveryTask}
            onExpandAll={handleExpandAllDeliveryTasks}
            onAddParentTask={handleAddParentDeliveryTask}
            onAddSubTask={handleAddSubDeliveryTask}
            density={density}
            showAvatars={showAvatars}
          />
        );
      case 'access-permissions-matrix':
        return (
          <AccessPermissionsBlock
            members={members}
            onUpdateMember={handleUpdateMember}
            onUnpinAll={handleUnpinAllMembers}
            density={density}
            showAvatars={showAvatars}
          />
        );
      case 'roadmap-stage':
        return (
          <RoadmapBlock
            tasks={tasks}
            onAddTaskClick={() => setIsNewTaskOpen(true)}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            density={density}
            showAvatars={showAvatars}
            showProgressRings={showProgressRings}
          />
        );
      case 'revenue-region':
        return <RevenueBlock />;
      case 'billing-transactions':
        return <BillingBlock />;
      case 'rte-slash-document':
        return <RichTextEditorShowcaseBlock initialMode="slash-doc" density={density} />;
      case 'rte-markdown-tech-spec':
        return <RichTextEditorShowcaseBlock initialMode="markdown-spec" density={density} />;
      case 'rte-collaborative-comment':
        return <RichTextEditorShowcaseBlock initialMode="collab-comment" density={density} />;
      case 'rte-incident-postmortem':
        return <RichTextEditorShowcaseBlock initialMode="incident-postmortem" density={density} />;
      case 'rte-email-campaign':
        return <RichTextEditorShowcaseBlock initialMode="email-campaign" density={density} />;
      case 'onboarding-checklist-hub':
        return <OnboardingShowcaseBlock initialMode="checklist-hub" density={density} />;
      case 'onboarding-role-personalize':
        return <OnboardingShowcaseBlock initialMode="role-personalize" density={density} />;
      case 'onboarding-interactive-tour':
        return <OnboardingShowcaseBlock initialMode="interactive-tour" density={density} />;
      case 'onboarding-sdk-quickstart':
        return <OnboardingShowcaseBlock initialMode="sdk-quickstart" density={density} />;
      case 'onboarding-data-migration':
        return <OnboardingShowcaseBlock initialMode="data-migration" density={density} />;
      case 'wizard-cloud-provisioning':
        return <WizardShowcaseBlock initialMode="cloud-provisioning" density={density} />;
      case 'wizard-enterprise-contract':
        return <WizardShowcaseBlock initialMode="enterprise-contract" density={density} />;
      case 'wizard-rbac-role-builder':
        return <WizardShowcaseBlock initialMode="rbac-role-builder" density={density} />;
      case 'wizard-report-scheduler':
        return <WizardShowcaseBlock initialMode="report-scheduler" density={density} />;
      case 'wizard-sso-saml-setup':
        return <WizardShowcaseBlock initialMode="sso-saml-setup" density={density} />;
      case 'calendar-release-freeze':
        return <CalendarShowcaseBlock initialMode="release-freeze" density={density} />;
      case 'calendar-marketing-campaign':
        return <CalendarShowcaseBlock initialMode="marketing-campaign" density={density} />;
      case 'calendar-oncall-rotation':
        return <CalendarShowcaseBlock initialMode="oncall-rotation" density={density} />;
      case 'calendar-resource-booking':
        return <CalendarShowcaseBlock initialMode="resource-booking" density={density} />;
      case 'calendar-compliance-audit':
        return <CalendarShowcaseBlock initialMode="compliance-audit" density={density} />;
      case 'stats-executive-kpi-strip':
        return <StatsShowcaseBlock initialMode="executive-kpi-strip" density={density} />;
      case 'stats-sla-uptime-summary':
        return <StatsShowcaseBlock initialMode="sla-uptime-summary" density={density} />;
      case 'stats-usage-quota-meters':
        return <StatsShowcaseBlock initialMode="usage-quota-meters" density={density} />;
      case 'stats-conversion-benchmark':
        return <StatsShowcaseBlock initialMode="conversion-benchmark" density={density} />;
      case 'stats-dora-engineering':
        return <StatsShowcaseBlock initialMode="dora-engineering" density={density} />;
      case 'timeline-plan-actual':
        return <LiveTimelineBlock initialMode="plan-actual" density={density} />;
      case 'timeline-execution-waterfall':
        return <LiveTimelineBlock initialMode="execution-waterfall" density={density} />;
      case 'timeline-team-swimlane':
        return <LiveTimelineBlock initialMode="team-swimlane" density={density} />;
      case 'timeline-milestone-delta':
        return <LiveTimelineBlock initialMode="milestone-delta" density={density} />;
      case 'timeline-release-gates':
        return <LiveTimelineBlock initialMode="release-gates" density={density} />;
      case 'timeline-incident-response':
        return <TimelineShowcaseBlock initialMode="incident-response" density={density} />;
      case 'timeline-order-fulfillment':
        return <TimelineShowcaseBlock initialMode="order-fulfillment" density={density} />;
      case 'timeline-release-changelog':
        return <TimelineShowcaseBlock initialMode="release-changelog" density={density} />;
      case 'timeline-contract-lifecycle':
        return <TimelineShowcaseBlock initialMode="contract-lifecycle" density={density} />;
      case 'timeline-pr-review-chain':
        return <TimelineShowcaseBlock initialMode="pr-review-chain" density={density} />;
      case 'form-incident-report':
        return <FormShowcaseBlock initialMode="incident-report" density={density} />;
      case 'form-procurement-request':
        return <FormShowcaseBlock initialMode="procurement-request" density={density} />;
      case 'form-webhook-endpoint':
        return <FormShowcaseBlock initialMode="webhook-endpoint" density={density} />;
      case 'form-database-connection':
        return <FormShowcaseBlock initialMode="database-connection" density={density} />;
      case 'form-feature-flag-rule':
        return <FormShowcaseBlock initialMode="feature-flag-rule" density={density} />;
      default:
        return <section className="runtime-unavailable" role="status"><h1>이 블록은 아직 제공되지 않습니다</h1><p>카탈로그에서 구현된 예제를 선택해 주세요.</p><code>{selectedId}</code></section>;
    }
  };

  return <>
    {renderActiveComponent()}
    <NewTaskModal isOpen={isNewTaskOpen} onClose={() => setIsNewTaskOpen(false)} onAddTask={handleAddTask} />
  </>;
}
