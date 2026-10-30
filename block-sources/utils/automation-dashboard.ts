export type AutomationWorkflowStatus = 'active' | 'paused';
export type AutomationTrigger = 'webhook' | 'schedule' | 'manual';

export interface AutomationWorkflow {
  /** Authored English labels remain searchable alongside Korean source fields. */
  searchAliases?: string[];
  id: string;
  name: string;
  description: string;
  owner: string;
  trigger: AutomationTrigger;
  status: AutomationWorkflowStatus;
  runCount: number;
  successCount: number;
  tokenCount: number;
  lastRun: string | null;
  steps: string[];
  templateId: string;
}

export interface AutomationTemplate {
  searchAliases?: string[];
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  steps: string[];
  category: string;
}

export const automationTemplates: AutomationTemplate[] = [
  { id: 'intake', name: '문의 접수 및 분류', description: '들어온 문의를 분류하고 담당 검토함으로 연결합니다.', trigger: 'webhook', steps: ['문의 수신', '유형 분류', '담당 검토함'], category: '고객 운영', searchAliases: ["Inquiry intake and routing","Classify incoming inquiries and route them to the responsible review queue."] },
  { id: 'report', name: '주간 운영 리포트', description: '운영 지표를 모아 검토할 요약 초안을 구성합니다.', trigger: 'schedule', steps: ['표본 수집', '지표 요약', '초안 검토'], category: '리포팅', searchAliases: ["Weekly operations report","Collect operational metrics into a draft summary for review."] },
  { id: 'monitor', name: '품질 이상 감지', description: '품질 기준을 확인하고 주의 항목을 검토 대기열에 모읍니다.', trigger: 'schedule', steps: ['기준 확인', '예외 분류', '검토 대기열'], category: '품질 관리', searchAliases: ["Quality anomaly review","Check quality criteria and gather flagged items in a review queue."] },
];

export const initialAutomationWorkflows: AutomationWorkflow[] = [
  { id: 'wf-1', name: '고객 문의 라우터', description: '접수한 문의의 유형을 분류하고 담당 팀의 검토함으로 연결합니다.', owner: '고객 운영팀', trigger: 'webhook', status: 'active', runCount: 4320, successCount: 4264, tokenCount: 246800, lastRun: '10월 27일 09:42', steps: ['문의 수신', '유형 분류', '담당 검토함'], templateId: 'intake', searchAliases: ["Customer inquiry router","Classify received inquiries and route them to the responsible team's review queue.","Customer operations team"] },
  { id: 'wf-2', name: '잠재 고객 우선순위', description: '샘플 문의의 조건을 비교해 검토 우선순위를 정리합니다.', owner: '영업 운영팀', trigger: 'schedule', status: 'active', runCount: 3200, successCount: 3152, tokenCount: 184320, lastRun: '10월 27일 09:30', steps: ['대상 수집', '조건 비교', '우선순위 검토'], templateId: 'monitor', searchAliases: ["Lead prioritization","Compare sample inquiry criteria to organize review priorities.","Sales operations team"] },
  { id: 'wf-3', name: '일일 운영 브리핑', description: '샘플 운영 기록을 일별로 묶어 요약 초안을 구성합니다.', owner: '플랫폼팀', trigger: 'schedule', status: 'active', runCount: 2400, successCount: 2328, tokenCount: 165600, lastRun: '10월 27일 09:00', steps: ['기록 수집', '주제별 요약', '초안 검토'], templateId: 'report', searchAliases: ["Daily operations briefing","Group sample operational records by day to prepare a draft summary.","Platform team"] },
  { id: 'wf-4', name: '주간 성과 리포트', description: '주간 지표를 집계해 운영 리포트의 검토 초안을 만듭니다.', owner: '데이터팀', trigger: 'schedule', status: 'active', runCount: 1840, successCount: 1564, tokenCount: 152000, lastRun: '10월 26일 08:00', steps: ['표본 수집', '지표 요약', '초안 검토'], templateId: 'report', searchAliases: ["Weekly performance report","Aggregate weekly metrics into an operations report draft for review.","Data team"] },
  { id: 'wf-5', name: '문서 품질 검토', description: '문서의 누락 필드를 확인하고 예외 항목을 분류합니다.', owner: '품질 관리팀', trigger: 'manual', status: 'paused', runCount: 872, successCount: 810, tokenCount: 65840, lastRun: '10월 25일 16:20', steps: ['문서 확인', '누락 필드 분류', '검토 대기열'], templateId: 'monitor', searchAliases: ["Document quality review","Check documents for missing fields and classify exceptions.","Quality management team"] },
  { id: 'wf-6', name: '문의 예외 모니터', description: '분류하지 못한 문의를 모아 담당자가 확인할 대기열에 배치합니다.', owner: '고객 운영팀', trigger: 'webhook', status: 'paused', runCount: 215, successCount: 192, tokenCount: 27440, lastRun: '10월 24일 14:10', steps: ['문의 수신', '예외 분류', '검토 대기열'], templateId: 'intake', searchAliases: ["Inquiry exception monitor","Gather unclassified inquiries into a queue for the responsible reviewer.","Customer operations team"] },
];

export interface AutomationFilters {
  query?: string;
  status?: AutomationWorkflowStatus | 'all';
  trigger?: AutomationTrigger | 'all';
}

export function filterAutomationWorkflows(workflows: AutomationWorkflow[], filters: AutomationFilters = {}) {
  const query = (filters.query ?? '').trim().toLocaleLowerCase();
  return workflows.filter(workflow =>
    (!filters.status || filters.status === 'all' || workflow.status === filters.status) &&
    (!filters.trigger || filters.trigger === 'all' || workflow.trigger === filters.trigger) &&
    (!query || [workflow.name, workflow.description, workflow.owner, workflow.id, ...(workflow.searchAliases ?? [])].some(value => value.toLocaleLowerCase().includes(query)))
  );
}

export function aggregateAutomationMetrics(workflows: AutomationWorkflow[]) {
  const totals = workflows.reduce((result, workflow) => ({
    runCount: result.runCount + workflow.runCount,
    successCount: result.successCount + workflow.successCount,
    tokenCount: result.tokenCount + workflow.tokenCount,
    activeCount: result.activeCount + Number(workflow.status === 'active'),
  }), { runCount: 0, successCount: 0, tokenCount: 0, activeCount: 0 });
  return { ...totals, successRate: totals.runCount ? totals.successCount * 100 / totals.runCount : null, workflowCount: workflows.length };
}

/** Status changes only affect local configuration; they never simulate historical runs. */
export function setWorkflowStatus(workflows: AutomationWorkflow[], id: string, status: AutomationWorkflowStatus) {
  const workflow = workflows.find(item => item.id === id);
  if (!workflow || workflow.status === status) return workflows;
  return workflows.map(item => item.id === id ? { ...item, status } : item);
}

export function resolveVisibleWorkflowId(workflows: AutomationWorkflow[], selectedId: string | null) {
  return workflows.some(item => item.id === selectedId) ? selectedId : workflows[0]?.id ?? null;
}

export type WorkflowCreationError = 'name-required' | 'name-too-long' | 'duplicate-name' | 'template-required';
export function createLocalWorkflow(workflows: AutomationWorkflow[], input: { name: string; templateId: string }): { workflows: AutomationWorkflow[]; workflow: AutomationWorkflow | null; error: WorkflowCreationError | null } {
  const name = input.name.trim();
  const invalid = (error: WorkflowCreationError) => ({ workflows, workflow: null, error });
  if (!name) return invalid('name-required');
  if (name.length > 80) return invalid('name-too-long');
  if (workflows.some(item => item.name.trim().toLocaleLowerCase() === name.toLocaleLowerCase())) return invalid('duplicate-name');
  const template = automationTemplates.find(item => item.id === input.templateId);
  if (!template) return invalid('template-required');
  let sequence = workflows.length + 1;
  while (workflows.some(item => item.id === `wf-local-${sequence}`)) sequence += 1;
  const workflow: AutomationWorkflow = {
    id: `wf-local-${sequence}`, name, description: template.description, owner: '내 로컬 작업', trigger: template.trigger,
    status: 'paused', runCount: 0, successCount: 0, tokenCount: 0, lastRun: null,
    steps: [...template.steps], templateId: template.id, searchAliases: [...(template.searchAliases ?? [])],
  };
  return { workflows: [...workflows, workflow], workflow, error: null };
}
