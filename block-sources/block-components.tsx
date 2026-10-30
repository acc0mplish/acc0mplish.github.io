/** SPDX-License-Identifier: Apache-2.0 */
import {lazy, type ComponentProps, type ComponentType} from 'react';

// Browser entry: imports are started only when the selected route renders.
// Types remain tied to each real component; no component prop contract is widened.
export type BlockComponents = {
  RightSidePanelBlock: ComponentType<ComponentProps<typeof import('./components/blocks/RightSidePanelBlock').RightSidePanelBlock>>;
  SalesAnalyticsDashboardBlock: ComponentType<ComponentProps<typeof import('./components/blocks/SalesAnalyticsDashboardBlock').SalesAnalyticsDashboardBlock>>;
  AIWorkspaceDashboardBlock: ComponentType<ComponentProps<typeof import('./components/blocks/AIWorkspaceDashboardBlock').AIWorkspaceDashboardBlock>>;
  AutomationOperationsDashboardBlock: ComponentType<ComponentProps<typeof import('./components/blocks/AutomationOperationsDashboardBlock').AutomationOperationsDashboardBlock>>;
  ReferenceDashboardBlock: ComponentType<ComponentProps<typeof import('./components/blocks/ReferenceDashboardBlock').ReferenceDashboardBlock>>;
  InteractionReferenceBlock: ComponentType<ComponentProps<typeof import('./components/blocks/InteractionReferenceBlock').InteractionReferenceBlock>>;

  AffectShowcaseBlock: ComponentType<ComponentProps<typeof import('./components/blocks/AffectShowcaseBlock').AffectShowcaseBlock>>;
  DistributionChartsBlock: ComponentType<ComponentProps<typeof import('./components/blocks/DistributionChartsBlock').DistributionChartsBlock>>;
  FinancialChartsBlock: ComponentType<ComponentProps<typeof import('./components/blocks/FinancialChartsBlock').FinancialChartsBlock>>;
  CompositionChartsBlock: ComponentType<ComponentProps<typeof import('./components/blocks/CompositionChartsBlock').CompositionChartsBlock>>;
  MatrixChartsBlock: ComponentType<ComponentProps<typeof import('./components/blocks/MatrixChartsBlock').MatrixChartsBlock>>;
  FlowConnectorBlock: ComponentType<ComponentProps<typeof import('./components/blocks/FlowConnectorBlock').default>>;
  ServiceDiagramBlock: ComponentType<ComponentProps<typeof import('./components/blocks/ServiceDiagramBlock').default>>;
  RoadmapBlock: ComponentType<ComponentProps<typeof import('./components/blocks/RoadmapBlock').RoadmapBlock>>;
  AccessPermissionsBlock: ComponentType<ComponentProps<typeof import('./components/blocks/AccessPermissionsBlock').AccessPermissionsBlock>>;
  SubTaskTrackerBlock: ComponentType<ComponentProps<typeof import('./components/blocks/SubTaskTrackerBlock').SubTaskTrackerBlock>>;
  ReleaseApprovalsBlock: ComponentType<ComponentProps<typeof import('./components/blocks/ReleaseApprovalsBlock').ReleaseApprovalsBlock>>;
  WorkspaceOverviewBlock: ComponentType<ComponentProps<typeof import('./components/blocks/WorkspaceOverviewBlock').WorkspaceOverviewBlock>>;
  SlaRiskIndexBlock: ComponentType<ComponentProps<typeof import('./components/blocks/SlaRiskIndexBlock').SlaRiskIndexBlock>>;
  SupportTicketsBlock: ComponentType<ComponentProps<typeof import('./components/blocks/SupportTicketsBlock').SupportTicketsBlock>>;
  CatalogBlock: ComponentType<ComponentProps<typeof import('./components/blocks/CatalogBlock').CatalogBlock>>;
  SharedDriveBlock: ComponentType<ComponentProps<typeof import('./components/blocks/SharedDriveBlock').SharedDriveBlock>>;
  ReportsManagementBlock: ComponentType<ComponentProps<typeof import('./components/blocks/ReportsManagementBlock').ReportsManagementBlock>>;
  IntegrationsHubBlock: ComponentType<ComponentProps<typeof import('./components/blocks/IntegrationsHubBlock').IntegrationsHubBlock>>;
  StripedRowsBlock: ComponentType<ComponentProps<typeof import('./components/blocks/StripedRowsBlock').StripedRowsBlock>>;
  BillingUpgradeBlock: ComponentType<ComponentProps<typeof import('./components/blocks/BillingUpgradeBlock').BillingUpgradeBlock>>;
  FunnelFlowBlock: ComponentType<ComponentProps<typeof import('./components/blocks/FunnelFlowBlock').FunnelFlowBlock>>;
  SlopeChartBlock: ComponentType<ComponentProps<typeof import('./components/blocks/SlopeChartBlock').SlopeChartBlock>>;
  RadialChartBlock: ComponentType<ComponentProps<typeof import('./components/blocks/RadialChartBlock').RadialChartBlock>>;
  StatusTrackerBlock: ComponentType<ComponentProps<typeof import('./components/blocks/StatusTrackerBlock').StatusTrackerBlock>>;
  EnvironmentPipelineBlock: ComponentType<ComponentProps<typeof import('./components/blocks/EnvironmentPipelineBlock').EnvironmentPipelineBlock>>;
  CapitalInflowsBlock: ComponentType<ComponentProps<typeof import('./components/blocks/CapitalInflowsBlock').CapitalInflowsBlock>>;
  ErrorBudgetBurnBlock: ComponentType<ComponentProps<typeof import('./components/blocks/ErrorBudgetBurnBlock').ErrorBudgetBurnBlock>>;
  GanttChartBlock: ComponentType<ComponentProps<typeof import('./components/blocks/GanttChartBlock').GanttChartBlock>>;
  KanbanBoardBlock: ComponentType<ComponentProps<typeof import('./components/blocks/KanbanBoardBlock').KanbanBoardBlock>>;
  TaskLifecycleBlock: ComponentType<ComponentProps<typeof import('./components/blocks/TaskLifecycleBlock').TaskLifecycleBlock>>;
  ScheduleBlock: ComponentType<ComponentProps<typeof import('./components/blocks/ScheduleBlock').ScheduleBlock>>;
  AuthBlock: ComponentType<ComponentProps<typeof import('./components/blocks/AuthBlock').AuthBlock>>;
  DashboardWorkspaceBlock: ComponentType<ComponentProps<typeof import('./components/blocks/DashboardWorkspaceBlock').DashboardWorkspaceBlock>>;
  CardShowcaseBlock: ComponentType<ComponentProps<typeof import('./components/blocks/CardShowcaseBlock').CardShowcaseBlock>>;
  DialogShowcaseBlock: ComponentType<ComponentProps<typeof import('./components/blocks/DialogShowcaseBlock').DialogShowcaseBlock>>;
  NavbarShowcaseBlock: ComponentType<ComponentProps<typeof import('./components/blocks/NavbarShowcaseBlock').NavbarShowcaseBlock>>;
  ListShowcaseBlock: ComponentType<ComponentProps<typeof import('./components/blocks/ListShowcaseBlock').ListShowcaseBlock>>;
  EmptyStateShowcaseBlock: ComponentType<ComponentProps<typeof import('./components/blocks/EmptyStateShowcaseBlock').EmptyStateShowcaseBlock>>;
  SettingsShowcaseBlock: ComponentType<ComponentProps<typeof import('./components/blocks/SettingsShowcaseBlock').SettingsShowcaseBlock>>;
  NotificationShowcaseBlock: ComponentType<ComponentProps<typeof import('./components/blocks/NotificationShowcaseBlock').NotificationShowcaseBlock>>;
  DataEditingShowcaseBlock: ComponentType<ComponentProps<typeof import('./components/blocks/DataEditingShowcaseBlock').DataEditingShowcaseBlock>>;
  RevenueBlock: ComponentType<ComponentProps<typeof import('./components/blocks/RevenueBlock').RevenueBlock>>;
  BillingBlock: ComponentType<ComponentProps<typeof import('./components/blocks/BillingBlock').BillingBlock>>;
  ApplicationTemplatesBlock: ComponentType<ComponentProps<typeof import('./components/blocks/ApplicationTemplatesBlock').ApplicationTemplatesBlock>>;
  SheetShowcaseBlock: ComponentType<ComponentProps<typeof import('./components/blocks/SheetShowcaseBlock').SheetShowcaseBlock>>;
  FlowShowcaseBlock: ComponentType<ComponentProps<typeof import('./components/blocks/FlowShowcaseBlock').FlowShowcaseBlock>>;
  AppShellShowcaseBlock: ComponentType<ComponentProps<typeof import('./components/blocks/AppShellShowcaseBlock').AppShellShowcaseBlock>>;
  RichTextEditorShowcaseBlock: ComponentType<ComponentProps<typeof import('./components/blocks/RichTextEditorShowcaseBlock').RichTextEditorShowcaseBlock>>;
  OnboardingShowcaseBlock: ComponentType<ComponentProps<typeof import('./components/blocks/OnboardingShowcaseBlock').OnboardingShowcaseBlock>>;
  WizardShowcaseBlock: ComponentType<ComponentProps<typeof import('./components/blocks/WizardShowcaseBlock').WizardShowcaseBlock>>;
  CalendarShowcaseBlock: ComponentType<ComponentProps<typeof import('./components/blocks/CalendarShowcaseBlock').CalendarShowcaseBlock>>;
  StatsShowcaseBlock: ComponentType<ComponentProps<typeof import('./components/blocks/StatsShowcaseBlock').StatsShowcaseBlock>>;
  LiveTimelineBlock: ComponentType<ComponentProps<typeof import('./components/blocks/LiveTimelineBlock').LiveTimelineBlock>>;
  TimelineShowcaseBlock: ComponentType<ComponentProps<typeof import('./components/blocks/TimelineShowcaseBlock').TimelineShowcaseBlock>>;
  FormShowcaseBlock: ComponentType<ComponentProps<typeof import('./components/blocks/FormShowcaseBlock').FormShowcaseBlock>>;
};

export const blockImporters = {
  RightSidePanelBlock: () => import('./components/blocks/RightSidePanelBlock').then(module => ({default: module.RightSidePanelBlock})),
  SalesAnalyticsDashboardBlock: () => import('./components/blocks/SalesAnalyticsDashboardBlock').then(module => ({default: module.SalesAnalyticsDashboardBlock})),
  AIWorkspaceDashboardBlock: () => import('./components/blocks/AIWorkspaceDashboardBlock').then(module => ({default: module.AIWorkspaceDashboardBlock})),
  AutomationOperationsDashboardBlock: () => import('./components/blocks/AutomationOperationsDashboardBlock').then(module => ({default: module.AutomationOperationsDashboardBlock})),
  ReferenceDashboardBlock: () => import('./components/blocks/ReferenceDashboardBlock').then(module => ({default: module.ReferenceDashboardBlock})),
  InteractionReferenceBlock: () => import('./components/blocks/InteractionReferenceBlock').then(module => ({default: module.InteractionReferenceBlock})),

  AffectShowcaseBlock: () => import('./components/blocks/AffectShowcaseBlock').then(module => ({default: module.AffectShowcaseBlock})),
  DistributionChartsBlock: () => import('./components/blocks/DistributionChartsBlock').then(module => ({default: module.DistributionChartsBlock})),
  FinancialChartsBlock: () => import('./components/blocks/FinancialChartsBlock').then(module => ({default: module.FinancialChartsBlock})),
  CompositionChartsBlock: () => import('./components/blocks/CompositionChartsBlock').then(module => ({default: module.CompositionChartsBlock})),
  MatrixChartsBlock: () => import('./components/blocks/MatrixChartsBlock').then(module => ({default: module.MatrixChartsBlock})),
  FlowConnectorBlock: () => import('./components/blocks/FlowConnectorBlock').then(module => ({default: module.default})),
  ServiceDiagramBlock: () => import('./components/blocks/ServiceDiagramBlock').then(module => ({default: module.default})),
  RoadmapBlock: () => import('./components/blocks/RoadmapBlock').then(module => ({default: module.RoadmapBlock})),
  AccessPermissionsBlock: () => import('./components/blocks/AccessPermissionsBlock').then(module => ({default: module.AccessPermissionsBlock})),
  SubTaskTrackerBlock: () => import('./components/blocks/SubTaskTrackerBlock').then(module => ({default: module.SubTaskTrackerBlock})),
  ReleaseApprovalsBlock: () => import('./components/blocks/ReleaseApprovalsBlock').then(module => ({default: module.ReleaseApprovalsBlock})),
  WorkspaceOverviewBlock: () => import('./components/blocks/WorkspaceOverviewBlock').then(module => ({default: module.WorkspaceOverviewBlock})),
  SlaRiskIndexBlock: () => import('./components/blocks/SlaRiskIndexBlock').then(module => ({default: module.SlaRiskIndexBlock})),
  SupportTicketsBlock: () => import('./components/blocks/SupportTicketsBlock').then(module => ({default: module.SupportTicketsBlock})),
  CatalogBlock: () => import('./components/blocks/CatalogBlock').then(module => ({default: module.CatalogBlock})),
  SharedDriveBlock: () => import('./components/blocks/SharedDriveBlock').then(module => ({default: module.SharedDriveBlock})),
  ReportsManagementBlock: () => import('./components/blocks/ReportsManagementBlock').then(module => ({default: module.ReportsManagementBlock})),
  IntegrationsHubBlock: () => import('./components/blocks/IntegrationsHubBlock').then(module => ({default: module.IntegrationsHubBlock})),
  StripedRowsBlock: () => import('./components/blocks/StripedRowsBlock').then(module => ({default: module.StripedRowsBlock})),
  BillingUpgradeBlock: () => import('./components/blocks/BillingUpgradeBlock').then(module => ({default: module.BillingUpgradeBlock})),
  FunnelFlowBlock: () => import('./components/blocks/FunnelFlowBlock').then(module => ({default: module.FunnelFlowBlock})),
  SlopeChartBlock: () => import('./components/blocks/SlopeChartBlock').then(module => ({default: module.SlopeChartBlock})),
  RadialChartBlock: () => import('./components/blocks/RadialChartBlock').then(module => ({default: module.RadialChartBlock})),
  StatusTrackerBlock: () => import('./components/blocks/StatusTrackerBlock').then(module => ({default: module.StatusTrackerBlock})),
  EnvironmentPipelineBlock: () => import('./components/blocks/EnvironmentPipelineBlock').then(module => ({default: module.EnvironmentPipelineBlock})),
  CapitalInflowsBlock: () => import('./components/blocks/CapitalInflowsBlock').then(module => ({default: module.CapitalInflowsBlock})),
  ErrorBudgetBurnBlock: () => import('./components/blocks/ErrorBudgetBurnBlock').then(module => ({default: module.ErrorBudgetBurnBlock})),
  GanttChartBlock: () => import('./components/blocks/GanttChartBlock').then(module => ({default: module.GanttChartBlock})),
  KanbanBoardBlock: () => import('./components/blocks/KanbanBoardBlock').then(module => ({default: module.KanbanBoardBlock})),
  TaskLifecycleBlock: () => import('./components/blocks/TaskLifecycleBlock').then(module => ({default: module.TaskLifecycleBlock})),
  ScheduleBlock: () => import('./components/blocks/ScheduleBlock').then(module => ({default: module.ScheduleBlock})),
  AuthBlock: () => import('./components/blocks/AuthBlock').then(module => ({default: module.AuthBlock})),
  DashboardWorkspaceBlock: () => import('./components/blocks/DashboardWorkspaceBlock').then(module => ({default: module.DashboardWorkspaceBlock})),
  CardShowcaseBlock: () => import('./components/blocks/CardShowcaseBlock').then(module => ({default: module.CardShowcaseBlock})),
  DialogShowcaseBlock: () => import('./components/blocks/DialogShowcaseBlock').then(module => ({default: module.DialogShowcaseBlock})),
  NavbarShowcaseBlock: () => import('./components/blocks/NavbarShowcaseBlock').then(module => ({default: module.NavbarShowcaseBlock})),
  ListShowcaseBlock: () => import('./components/blocks/ListShowcaseBlock').then(module => ({default: module.ListShowcaseBlock})),
  EmptyStateShowcaseBlock: () => import('./components/blocks/EmptyStateShowcaseBlock').then(module => ({default: module.EmptyStateShowcaseBlock})),
  SettingsShowcaseBlock: () => import('./components/blocks/SettingsShowcaseBlock').then(module => ({default: module.SettingsShowcaseBlock})),
  NotificationShowcaseBlock: () => import('./components/blocks/NotificationShowcaseBlock').then(module => ({default: module.NotificationShowcaseBlock})),
  DataEditingShowcaseBlock: () => import('./components/blocks/DataEditingShowcaseBlock').then(module => ({default: module.DataEditingShowcaseBlock})),
  RevenueBlock: () => import('./components/blocks/RevenueBlock').then(module => ({default: module.RevenueBlock})),
  BillingBlock: () => import('./components/blocks/BillingBlock').then(module => ({default: module.BillingBlock})),
  ApplicationTemplatesBlock: () => import('./components/blocks/ApplicationTemplatesBlock').then(module => ({default: module.ApplicationTemplatesBlock})),
  SheetShowcaseBlock: () => import('./components/blocks/SheetShowcaseBlock').then(module => ({default: module.SheetShowcaseBlock})),
  FlowShowcaseBlock: () => import('./components/blocks/FlowShowcaseBlock').then(module => ({default: module.FlowShowcaseBlock})),
  AppShellShowcaseBlock: () => import('./components/blocks/AppShellShowcaseBlock').then(module => ({default: module.AppShellShowcaseBlock})),
  RichTextEditorShowcaseBlock: () => import('./components/blocks/RichTextEditorShowcaseBlock').then(module => ({default: module.RichTextEditorShowcaseBlock})),
  OnboardingShowcaseBlock: () => import('./components/blocks/OnboardingShowcaseBlock').then(module => ({default: module.OnboardingShowcaseBlock})),
  WizardShowcaseBlock: () => import('./components/blocks/WizardShowcaseBlock').then(module => ({default: module.WizardShowcaseBlock})),
  CalendarShowcaseBlock: () => import('./components/blocks/CalendarShowcaseBlock').then(module => ({default: module.CalendarShowcaseBlock})),
  StatsShowcaseBlock: () => import('./components/blocks/StatsShowcaseBlock').then(module => ({default: module.StatsShowcaseBlock})),
  LiveTimelineBlock: () => import('./components/blocks/LiveTimelineBlock').then(module => ({default: module.LiveTimelineBlock})),
  TimelineShowcaseBlock: () => import('./components/blocks/TimelineShowcaseBlock').then(module => ({default: module.TimelineShowcaseBlock})),
  FormShowcaseBlock: () => import('./components/blocks/FormShowcaseBlock').then(module => ({default: module.FormShowcaseBlock})),
};

export const lazyBlockComponents: BlockComponents = {
  RightSidePanelBlock: lazy(blockImporters.RightSidePanelBlock),
  SalesAnalyticsDashboardBlock: lazy(blockImporters.SalesAnalyticsDashboardBlock),
  AIWorkspaceDashboardBlock: lazy(blockImporters.AIWorkspaceDashboardBlock),
  AutomationOperationsDashboardBlock: lazy(blockImporters.AutomationOperationsDashboardBlock),
  ReferenceDashboardBlock: lazy(blockImporters.ReferenceDashboardBlock),
  InteractionReferenceBlock: lazy(blockImporters.InteractionReferenceBlock),
  DistributionChartsBlock: lazy(blockImporters.DistributionChartsBlock),
  FinancialChartsBlock: lazy(blockImporters.FinancialChartsBlock),
  CompositionChartsBlock: lazy(blockImporters.CompositionChartsBlock),
  MatrixChartsBlock: lazy(blockImporters.MatrixChartsBlock),
  AffectShowcaseBlock: lazy(blockImporters.AffectShowcaseBlock),
  FlowConnectorBlock: lazy(blockImporters.FlowConnectorBlock),
  ServiceDiagramBlock: lazy(blockImporters.ServiceDiagramBlock),
  RoadmapBlock: lazy(blockImporters.RoadmapBlock),
  AccessPermissionsBlock: lazy(blockImporters.AccessPermissionsBlock),
  SubTaskTrackerBlock: lazy(blockImporters.SubTaskTrackerBlock),
  ReleaseApprovalsBlock: lazy(blockImporters.ReleaseApprovalsBlock),
  WorkspaceOverviewBlock: lazy(blockImporters.WorkspaceOverviewBlock),
  SlaRiskIndexBlock: lazy(blockImporters.SlaRiskIndexBlock),
  SupportTicketsBlock: lazy(blockImporters.SupportTicketsBlock),
  CatalogBlock: lazy(blockImporters.CatalogBlock),
  SharedDriveBlock: lazy(blockImporters.SharedDriveBlock),
  ReportsManagementBlock: lazy(blockImporters.ReportsManagementBlock),
  IntegrationsHubBlock: lazy(blockImporters.IntegrationsHubBlock),
  StripedRowsBlock: lazy(blockImporters.StripedRowsBlock),
  BillingUpgradeBlock: lazy(blockImporters.BillingUpgradeBlock),
  FunnelFlowBlock: lazy(blockImporters.FunnelFlowBlock),
  SlopeChartBlock: lazy(blockImporters.SlopeChartBlock),
  RadialChartBlock: lazy(blockImporters.RadialChartBlock),
  StatusTrackerBlock: lazy(blockImporters.StatusTrackerBlock),
  EnvironmentPipelineBlock: lazy(blockImporters.EnvironmentPipelineBlock),
  CapitalInflowsBlock: lazy(blockImporters.CapitalInflowsBlock),
  ErrorBudgetBurnBlock: lazy(blockImporters.ErrorBudgetBurnBlock),
  GanttChartBlock: lazy(blockImporters.GanttChartBlock),
  KanbanBoardBlock: lazy(blockImporters.KanbanBoardBlock),
  TaskLifecycleBlock: lazy(blockImporters.TaskLifecycleBlock),
  ScheduleBlock: lazy(blockImporters.ScheduleBlock),
  AuthBlock: lazy(blockImporters.AuthBlock),
  DashboardWorkspaceBlock: lazy(blockImporters.DashboardWorkspaceBlock),
  CardShowcaseBlock: lazy(blockImporters.CardShowcaseBlock),
  DialogShowcaseBlock: lazy(blockImporters.DialogShowcaseBlock),
  NavbarShowcaseBlock: lazy(blockImporters.NavbarShowcaseBlock),
  ListShowcaseBlock: lazy(blockImporters.ListShowcaseBlock),
  EmptyStateShowcaseBlock: lazy(blockImporters.EmptyStateShowcaseBlock),
  SettingsShowcaseBlock: lazy(blockImporters.SettingsShowcaseBlock),
  NotificationShowcaseBlock: lazy(blockImporters.NotificationShowcaseBlock),
  DataEditingShowcaseBlock: lazy(blockImporters.DataEditingShowcaseBlock),
  RevenueBlock: lazy(blockImporters.RevenueBlock),
  BillingBlock: lazy(blockImporters.BillingBlock),
  ApplicationTemplatesBlock: lazy(blockImporters.ApplicationTemplatesBlock),
  SheetShowcaseBlock: lazy(blockImporters.SheetShowcaseBlock),
  FlowShowcaseBlock: lazy(blockImporters.FlowShowcaseBlock),
  AppShellShowcaseBlock: lazy(blockImporters.AppShellShowcaseBlock),
  RichTextEditorShowcaseBlock: lazy(blockImporters.RichTextEditorShowcaseBlock),
  OnboardingShowcaseBlock: lazy(blockImporters.OnboardingShowcaseBlock),
  WizardShowcaseBlock: lazy(blockImporters.WizardShowcaseBlock),
  CalendarShowcaseBlock: lazy(blockImporters.CalendarShowcaseBlock),
  StatsShowcaseBlock: lazy(blockImporters.StatsShowcaseBlock),
  LiveTimelineBlock: lazy(blockImporters.LiveTimelineBlock),
  TimelineShowcaseBlock: lazy(blockImporters.TimelineShowcaseBlock),
  FormShowcaseBlock: lazy(blockImporters.FormShowcaseBlock),
};
