import {RightSidePanelBlock} from './components/blocks/RightSidePanelBlock';
import {SalesAnalyticsDashboardBlock} from './components/blocks/SalesAnalyticsDashboardBlock';
import {AIWorkspaceDashboardBlock} from './components/blocks/AIWorkspaceDashboardBlock';
import {AutomationOperationsDashboardBlock} from './components/blocks/AutomationOperationsDashboardBlock';
import {ReferenceDashboardBlock} from './components/blocks/ReferenceDashboardBlock';
import {InteractionReferenceBlock} from './components/blocks/InteractionReferenceBlock';
import {AffectShowcaseBlock} from './components/blocks/AffectShowcaseBlock';
/** SPDX-License-Identifier: Apache-2.0 */
// Build-time only entry for real synchronous SSR thumbnails.
// Browser code must import BlockApp, never this eager entry.
import React from 'react';
import BlockApp, {type BlockAppProps} from './BlockApp';
import type {BlockComponents} from './block-components';
export {BLOCK_IDS} from './BlockApp';
import {DistributionChartsBlock} from './components/blocks/DistributionChartsBlock';
import {FinancialChartsBlock} from './components/blocks/FinancialChartsBlock';
import {CompositionChartsBlock} from './components/blocks/CompositionChartsBlock';
import {MatrixChartsBlock} from './components/blocks/MatrixChartsBlock';
import FlowConnectorBlock from './components/blocks/FlowConnectorBlock';
import ServiceDiagramBlock from './components/blocks/ServiceDiagramBlock';
import {RoadmapBlock} from './components/blocks/RoadmapBlock';
import {AccessPermissionsBlock} from './components/blocks/AccessPermissionsBlock';
import {SubTaskTrackerBlock} from './components/blocks/SubTaskTrackerBlock';
import {ReleaseApprovalsBlock} from './components/blocks/ReleaseApprovalsBlock';
import {WorkspaceOverviewBlock} from './components/blocks/WorkspaceOverviewBlock';
import {SlaRiskIndexBlock} from './components/blocks/SlaRiskIndexBlock';
import {SupportTicketsBlock} from './components/blocks/SupportTicketsBlock';
import {CatalogBlock} from './components/blocks/CatalogBlock';
import {SharedDriveBlock} from './components/blocks/SharedDriveBlock';
import {ReportsManagementBlock} from './components/blocks/ReportsManagementBlock';
import {IntegrationsHubBlock} from './components/blocks/IntegrationsHubBlock';
import {StripedRowsBlock} from './components/blocks/StripedRowsBlock';
import {BillingUpgradeBlock} from './components/blocks/BillingUpgradeBlock';
import {FunnelFlowBlock} from './components/blocks/FunnelFlowBlock';
import {SlopeChartBlock} from './components/blocks/SlopeChartBlock';
import {RadialChartBlock} from './components/blocks/RadialChartBlock';
import {StatusTrackerBlock} from './components/blocks/StatusTrackerBlock';
import {EnvironmentPipelineBlock} from './components/blocks/EnvironmentPipelineBlock';
import {CapitalInflowsBlock} from './components/blocks/CapitalInflowsBlock';
import {ErrorBudgetBurnBlock} from './components/blocks/ErrorBudgetBurnBlock';
import {GanttChartBlock} from './components/blocks/GanttChartBlock';
import {KanbanBoardBlock} from './components/blocks/KanbanBoardBlock';
import {TaskLifecycleBlock} from './components/blocks/TaskLifecycleBlock';
import {ScheduleBlock} from './components/blocks/ScheduleBlock';
import {AuthBlock} from './components/blocks/AuthBlock';
import {DashboardWorkspaceBlock} from './components/blocks/DashboardWorkspaceBlock';
import {CardShowcaseBlock} from './components/blocks/CardShowcaseBlock';
import {DialogShowcaseBlock} from './components/blocks/DialogShowcaseBlock';
import {NavbarShowcaseBlock} from './components/blocks/NavbarShowcaseBlock';
import {ListShowcaseBlock} from './components/blocks/ListShowcaseBlock';
import {EmptyStateShowcaseBlock} from './components/blocks/EmptyStateShowcaseBlock';
import {SettingsShowcaseBlock} from './components/blocks/SettingsShowcaseBlock';
import {NotificationShowcaseBlock} from './components/blocks/NotificationShowcaseBlock';
import {DataEditingShowcaseBlock} from './components/blocks/DataEditingShowcaseBlock';
import {RevenueBlock} from './components/blocks/RevenueBlock';
import {BillingBlock} from './components/blocks/BillingBlock';
import {ApplicationTemplatesBlock} from './components/blocks/ApplicationTemplatesBlock';
import {SheetShowcaseBlock} from './components/blocks/SheetShowcaseBlock';
import {FlowShowcaseBlock} from './components/blocks/FlowShowcaseBlock';
import {AppShellShowcaseBlock} from './components/blocks/AppShellShowcaseBlock';
import {RichTextEditorShowcaseBlock} from './components/blocks/RichTextEditorShowcaseBlock';
import {OnboardingShowcaseBlock} from './components/blocks/OnboardingShowcaseBlock';
import {WizardShowcaseBlock} from './components/blocks/WizardShowcaseBlock';
import {CalendarShowcaseBlock} from './components/blocks/CalendarShowcaseBlock';
import {StatsShowcaseBlock} from './components/blocks/StatsShowcaseBlock';
import {LiveTimelineBlock} from './components/blocks/LiveTimelineBlock';
import {TimelineShowcaseBlock} from './components/blocks/TimelineShowcaseBlock';
import {FormShowcaseBlock} from './components/blocks/FormShowcaseBlock';
const components: BlockComponents = {
  RightSidePanelBlock,
  SalesAnalyticsDashboardBlock,
  AIWorkspaceDashboardBlock,
  AutomationOperationsDashboardBlock,
  ReferenceDashboardBlock,
  InteractionReferenceBlock,
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
};
export default function BlockAppEager(props: Omit<BlockAppProps,'components'>){return <BlockApp {...props} components={components} />;}
