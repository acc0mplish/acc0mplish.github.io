import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Activity, ArrowRight, Check, CheckCircle2, CirclePause, Clock3, Coins, GitBranch, LayoutDashboard, Pause, Play, Plus, Search, Workflow, X } from 'lucide-react';
import { DashboardBadge, DashboardEmpty, DashboardMetric, DashboardNotice, DashboardPanel, DashboardShell } from '../dashboard/DashboardShared';
import {
  aggregateAutomationMetrics, automationTemplates, createLocalWorkflow, filterAutomationWorkflows,
  initialAutomationWorkflows, resolveVisibleWorkflowId, setWorkflowStatus,
  type AutomationTrigger, type AutomationWorkflow, type AutomationWorkflowStatus, type WorkflowCreationError,
} from '../../utils/automation-dashboard';

const triggerLabels: Record<AutomationTrigger, string> = { webhook: '이벤트 수신', schedule: '정기 일정', manual: '수동 시작' };
const errorLabels: Record<WorkflowCreationError, string> = {
  'name-required': '워크플로 이름을 입력하세요.',
  'name-too-long': '이름은 80자 이내로 입력하세요.',
  'duplicate-name': '같은 이름의 워크플로가 있습니다. 다른 이름을 입력하세요.',
  'template-required': '사용할 템플릿을 선택하세요.',
};
const number = (value: number) => value.toLocaleString('en-US');
const rate = (workflow: AutomationWorkflow) => workflow.runCount ? workflow.successCount * 100 / workflow.runCount : null;

const styles = `
.koa-scope .koa-caption{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;color:var(--kd-muted);font-size:calc(11px * var(--runtime-text-scale,1))}
.koa-scope .koa-caption strong{color:var(--kd-text);font-weight:600}.koa-scope .koa-date{display:inline-flex;align-items:center;gap:7px;font-size:calc(11px * var(--runtime-text-scale,1));color:var(--kd-muted)}
.koa-scope .koa-filters{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin-bottom:17px}.koa-scope .koa-search{position:relative;flex:1;min-width:170px}.koa-scope .koa-search input{width:100%;padding-left:33px}.koa-scope .koa-search>svg{position:absolute;left:10px;top:10px;color:var(--kd-muted);width:16px;height:16px}
.koa-scope .koa-filters label{display:flex;align-items:center;gap:8px}.koa-scope .koa-table{min-width:770px}.koa-scope .koa-table th:first-child{width:29%}.koa-scope .koa-name{display:flex;align-items:center;gap:9px;min-width:0}.koa-scope .koa-workflow-mark{display:grid;place-items:center;flex-shrink:0;width:30px;height:30px;border-radius:8px;background:var(--kd-selected);color:var(--kd-accent)}
.koa-scope .koa-name-text strong{display:block;font-weight:600}.koa-scope .koa-name-text small{display:block;color:var(--kd-muted);margin-top:3px;font-size:calc(10px * var(--runtime-text-scale,1))}.koa-scope .koa-row-actions{display:flex;gap:6px;white-space:nowrap}.koa-scope .koa-numeric{font-variant-numeric:tabular-nums;white-space:nowrap}.koa-scope .koa-health{display:flex;gap:5px;align-items:center;font-weight:600}.koa-scope .koa-health[data-tone=accent]{color:var(--kd-accent)}.koa-scope .koa-health[data-tone=warning]{color:var(--klic-component-block-color-warning)}.koa-scope .koa-health[data-tone=danger]{color:var(--klic-component-block-color-danger)}.koa-scope .koa-health svg{width:13px;height:13px}
.koa-scope .koa-detail{margin-top:18px;padding:17px;border:1px solid var(--kd-border);border-radius:var(--kd-radius);background:var(--kd-soft);display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:20px}.koa-scope .koa-detail-heading{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:7px}.koa-scope .koa-detail h3{font-size:calc(13px * var(--runtime-text-scale,1));font-weight:650;overflow-wrap:anywhere}.koa-scope .koa-detail p{font-size:calc(11px * var(--runtime-text-scale,1));color:var(--kd-muted)}.koa-scope .koa-history{display:flex;gap:16px;flex-wrap:wrap;margin-top:13px;font-size:calc(10px * var(--runtime-text-scale,1));color:var(--kd-muted)}.koa-scope .koa-history strong{margin-left:5px;color:var(--kd-accent);font-variant-numeric:tabular-nums}.koa-scope .koa-history .koa-failed{color:var(--klic-component-block-color-danger)}.koa-scope .koa-steps{display:flex;align-items:center;gap:7px;padding:0;margin:0;list-style:none;min-width:0}.koa-scope .koa-steps li{flex:1;min-width:0;font-size:calc(10px * var(--runtime-text-scale,1));color:var(--kd-muted)}.koa-scope .koa-step-top{display:flex;align-items:center;gap:8px;margin-bottom:8px}.koa-scope .koa-step-top span{display:grid;place-items:center;width:26px;height:26px;border:1px solid var(--kd-border);border-radius:8px;background:var(--kd-panel);color:var(--kd-accent);font-weight:650}.koa-scope .koa-step-top:after{content:'';height:1px;flex:1;background:var(--kd-border)}.koa-scope .koa-steps li:last-child .koa-step-top:after{display:none}.koa-scope .koa-detail-foot{grid-column:1/-1;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;border-top:1px solid var(--kd-border);padding-top:12px;color:var(--kd-muted);font-size:calc(10px * var(--runtime-text-scale,1))}
.koa-scope .koa-templates{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.koa-scope .koa-template{display:flex;flex-direction:column;gap:0;min-width:0;padding:0;text-align:left;overflow:hidden;border:1px solid var(--kd-border);border-radius:calc(var(--kd-radius) + 3px);background:var(--kd-panel);color:var(--kd-text)}.koa-scope .koa-template:hover,.koa-scope .koa-template[data-selected=true]{border-color:var(--kd-accent)}.koa-scope .koa-art{height:104px;width:100%;background:var(--kd-soft);border-bottom:1px solid var(--kd-border)}.koa-scope .koa-art svg{width:100%;height:100%;display:block}.koa-scope .koa-template-body{padding:13px;display:flex;flex:1;flex-direction:column;gap:8px}.koa-scope .koa-template-category{display:flex;align-items:center;justify-content:space-between;color:var(--kd-accent);font-size:calc(9px * var(--runtime-text-scale,1));font-weight:600}.koa-scope .koa-template h3{font-size:calc(12px * var(--runtime-text-scale,1));font-weight:650;overflow-wrap:anywhere}.koa-scope .koa-template p{color:var(--kd-muted);font-size:calc(10px * var(--runtime-text-scale,1));font-weight:400;line-height:1.65}.koa-scope .koa-template-footer{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:8px;font-size:calc(10px * var(--runtime-text-scale,1));color:var(--kd-muted)}.koa-scope .koa-template-footer svg{color:var(--kd-accent);width:14px;height:14px}
.koa-scope .koa-form{margin-top:18px;padding:17px;background:var(--kd-selected);border:1px solid var(--kd-border);border-radius:var(--kd-radius)}.koa-scope .koa-form-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:13px}.koa-scope .koa-form h3{font-size:calc(13px * var(--runtime-text-scale,1));font-weight:650}.koa-scope .koa-form-fields{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:13px}.koa-scope .koa-form-fields label{display:grid;gap:6px;font-size:calc(11px * var(--runtime-text-scale,1));color:var(--kd-text)}.koa-scope .koa-form-foot{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-top:13px}.koa-scope .koa-form-foot p{font-size:calc(10px * var(--runtime-text-scale,1));color:var(--kd-muted);max-width:470px}.koa-scope .koa-error{margin-top:9px;color:var(--klic-component-block-color-danger);font-size:calc(11px * var(--runtime-text-scale,1))}.koa-scope .koa-disclaimer{display:flex;align-items:flex-start;gap:8px;font-size:calc(10px * var(--runtime-text-scale,1));color:var(--kd-muted)}.koa-scope .koa-disclaimer>svg{width:14px;height:14px;flex-shrink:0;margin-top:2px}
.koa-scope [data-density=compact] .koa-art{height:84px}.koa-scope [data-density=compact] .koa-detail{padding:12px;gap:12px}.koa-scope [data-density=compact] .koa-table td{padding-block:9px}
@container kd-dashboard (max-width:1040px){.koa-scope .koa-detail{grid-template-columns:1fr}.koa-scope .koa-templates{gap:9px}.koa-scope .koa-template-body{padding:11px}}
@container kd-dashboard (max-width:700px){.koa-scope .koa-templates{grid-template-columns:1fr}.koa-scope .koa-template{display:grid;grid-template-columns:120px minmax(0,1fr)}.koa-scope .koa-art{height:100%;min-height:140px;border-right:1px solid var(--kd-border);border-bottom:0}.koa-scope [data-density=compact] .koa-art{height:100%}.koa-scope .koa-form-fields{grid-template-columns:1fr}.koa-scope .koa-form{padding:12px}.koa-scope .koa-filters>label{flex:1}.koa-scope .koa-filters .kd-select{width:100%}.koa-scope .koa-search{min-width:100%;width:100%}.koa-scope .koa-detail-foot{display:grid}}
@container kd-dashboard (max-width:420px){.koa-scope .koa-template{grid-template-columns:88px minmax(0,1fr)}.koa-scope .koa-template-body{padding:10px}.koa-scope .koa-date{display:none}}
`;

/** Original, theme-aware SVG diagrams: intake routing, a report stack and review branches. */
function TemplateArtwork({ variant }: { variant: string }) {
  return <div className="koa-art" aria-hidden="true"><svg viewBox="0 0 240 104" fill="none">
    <path d="M0 25H240M0 52H240M0 79H240M40 0V104M80 0V104M120 0V104M160 0V104M200 0V104" stroke="var(--kd-border)" opacity=".5" />
    {variant === 'intake' ? <>
      <path d="M64 52H99M139 52H164M164 52V28H186M164 52V77H186" stroke="var(--kd-accent)" strokeWidth="1.5" />
      <rect x="28" y="34" width="38" height="36" rx="9" fill="var(--kd-panel)" stroke="var(--kd-border)" />
      <path d="M37 44H57V59H37V44ZM37 45L47 52L57 45" stroke="var(--kd-accent)" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="99" y="31" width="42" height="42" rx="11" fill="var(--kd-accent)" />
      <path d="M111 42H128M111 51H124M111 60H119" stroke="var(--klic-component-block-color-on-accent)" strokeWidth="2" strokeLinecap="round" />
      <rect x="186" y="17" width="27" height="23" rx="6" fill="var(--kd-selected)" stroke="var(--kd-accent)" />
      <rect x="186" y="65" width="27" height="23" rx="6" fill="var(--kd-panel)" stroke="var(--kd-border)" />
      <path d="M194 28L198 32L205 24" stroke="var(--kd-accent)" strokeWidth="1.5" />
    </> : variant === 'report' ? <>
      <rect x="81" y="27" width="66" height="62" rx="7" fill="var(--kd-selected)" stroke="var(--kd-border)" />
      <rect x="90" y="18" width="66" height="62" rx="7" fill="var(--kd-panel)" stroke="var(--kd-accent)" />
      <path d="M102 32H141M102 38H124" stroke="var(--kd-border)" strokeWidth="2" strokeLinecap="round" />
      <rect x="102" y="57" width="8" height="11" rx="2" fill="var(--kd-accent)" opacity=".35" />
      <rect x="116" y="48" width="8" height="20" rx="2" fill="var(--kd-accent)" opacity=".65" />
      <rect x="130" y="42" width="8" height="26" rx="2" fill="var(--kd-accent)" />
      <path d="M49 51H76M163 51H189M181 43L189 51L181 59" stroke="var(--kd-accent)" strokeWidth="1.5" />
      <circle cx="42" cy="51" r="7" fill="var(--kd-panel)" stroke="var(--kd-accent)" />
    </> : <>
      <path d="M50 52H90M130 52H153M153 52V25H183M153 52V79H183" stroke="var(--kd-accent)" strokeWidth="1.5" />
      <rect x="29" y="35" width="34" height="34" rx="8" fill="var(--kd-panel)" stroke="var(--kd-border)" />
      <path d="M38 52H42L46 44L50 60L54 52" stroke="var(--kd-accent)" strokeWidth="1.5" />
      <path d="M111 27L137 52L111 77L85 52L111 27Z" fill="var(--kd-selected)" stroke="var(--kd-accent)" />
      <path d="M106 52L110 56L118 47" stroke="var(--kd-accent)" strokeWidth="2" strokeLinecap="round" />
      <rect x="183" y="14" width="28" height="23" rx="6" fill="var(--kd-accent)" />
      <path d="M192 25L196 29L203 21" stroke="var(--klic-component-block-color-on-accent)" strokeWidth="1.5" />
      <rect x="183" y="67" width="28" height="23" rx="6" fill="var(--kd-panel)" stroke="var(--klic-component-block-color-warning)" />
      <path d="M197 72V79M197 83V84" stroke="var(--klic-component-block-color-warning)" strokeWidth="2" strokeLinecap="round" />
    </>}
  </svg></div>;
}

export function AutomationOperationsDashboardBlock({ density = 'normal' }: { density?: string }) {
  const instance = useId();
  const [workflows, setWorkflows] = useState(() => initialAutomationWorkflows.map(workflow => ({ ...workflow, steps: [...workflow.steps] })));
  const [status, setStatus] = useState<AutomationWorkflowStatus | 'all'>('all');
  const [trigger, setTrigger] = useState<AutomationTrigger | 'all'>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>('wf-1');
  const [templateId, setTemplateId] = useState('intake');
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<WorkflowCreationError | null>(null);
  const [notice, setNotice] = useState('검색과 상태 변경은 이 예제 안에서만 적용됩니다.');
  const nameInput = useRef<HTMLInputElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const restoreSearchFocus = useRef(false);
  const createButton = useRef<HTMLButtonElement>(null);
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const visible = useMemo(() => filterAutomationWorkflows(workflows, { status, trigger, query }), [workflows, status, trigger, query]);
  const metrics = useMemo(() => aggregateAutomationMetrics(visible), [visible]);
  const visibleId = resolveVisibleWorkflowId(visible, selectedId);
  const selected = visible.find(workflow => workflow.id === visibleId);

  useEffect(() => { if (visibleId !== selectedId) setSelectedId(visibleId); }, [visibleId, selectedId]);
  useEffect(() => { if (restoreSearchFocus.current) { restoreSearchFocus.current = false; searchInput.current?.focus(); } }, [workflows]);
  useEffect(() => { if (formOpen) nameInput.current?.focus(); }, [formOpen]);

  const reset = () => { setQuery(''); setStatus('all'); setTrigger('all'); };
  const openForm = (id = templateId) => {
    setTemplateId(id); setError(null); setFormOpen(true);
    requestAnimationFrame(() => nameInput.current?.focus());
  };
  const closeForm = () => {
    setFormOpen(false); setError(null);
    requestAnimationFrame(() => createButton.current?.focus());
  };
  const changeStatus = (workflow: AutomationWorkflow) => {
    const next = workflow.status === 'active' ? 'paused' : 'active';
    restoreSearchFocus.current = status !== 'all' && next !== status;
    setWorkflows(current => setWorkflowStatus(current, workflow.id, next));
    setNotice(next === 'paused' ? '선택한 워크플로를 로컬에서 중지했습니다. 누적 실행 기록은 유지됩니다.' : '선택한 워크플로를 로컬에서 활성화했습니다. 실제 작업은 실행되지 않습니다.');
  };
  const create = () => {
    const result = createLocalWorkflow(workflows, { name, templateId });
    if (result.error) { setError(result.error); nameInput.current?.focus(); return; }
    setWorkflows(result.workflows); reset(); setSelectedId(result.workflow!.id);
    setName(''); setError(null); setFormOpen(false);
    setNotice('로컬 워크플로를 중지 상태로 추가했습니다. 실행 기록은 0이며 실제 자동화는 실행되지 않습니다.');
    requestAnimationFrame(() => detailHeading.current?.focus());
  };

  return <div className="koa-scope"><DashboardShell
    eyebrow="KLIC / AUTOMATION OPERATIONS"
    title="자동화 운영 대시보드"
    description="실행 흐름을 살피고, 검토가 필요한 작업을 한곳에서 관리하세요."
    density={density}
    nav={[
      { id: 'all', label: '전체 워크플로', icon: LayoutDashboard, count: workflows.length },
      { id: 'active', label: '활성 워크플로', icon: Activity, count: workflows.filter(item => item.status === 'active').length },
      { id: 'paused', label: '중지된 워크플로', icon: CirclePause, count: workflows.filter(item => item.status === 'paused').length },
    ]}
    active={status}
    onNavigate={id => setStatus(id as AutomationWorkflowStatus | 'all')}
    toolbar={<><span className="koa-date"><Clock3 aria-hidden="true" /><span>2026.10.27 · 샘플</span></span><button ref={createButton} type="button" className="kd-button kd-primary" aria-expanded={formOpen} aria-controls={`${instance}-form`} onClick={() => openForm()}><Plus aria-hidden="true" />워크플로 만들기</button></>}
  >
    <style>{styles}</style>
    <div className="koa-caption"><span><strong>현재 필터 기준</strong> · <span>표시된 워크플로</span> {visible.length} / {workflows.length}</span><span>누적 표본 기록 · 2026년 10월</span></div>
    <div className="kd-metrics">
      <DashboardMetric label="전체 실행" value={number(metrics.runCount)} note="표시된 워크플로 누적 실행" icon={Workflow} />
      <DashboardMetric label="실행 가중 성공률" value={metrics.successRate === null ? '—' : `${metrics.successRate.toFixed(1)}%`} note={metrics.successRate === null ? '실행 기록 없음' : '성공 실행 ÷ 전체 실행'} icon={CheckCircle2} />
      <DashboardMetric label="활성 워크플로" value={number(metrics.activeCount)} note="표시된 항목의 활성 상태" icon={Activity} />
      <DashboardMetric label="토큰 사용량" value={number(metrics.tokenCount)} note="표시된 워크플로 누적 토큰" icon={Coins} />
    </div>
    <DashboardPanel title="워크플로 운영 현황" caption="검색과 필터는 표와 위의 네 가지 지표에 함께 적용됩니다." action={<DashboardBadge tone="accent">로컬 샘플</DashboardBadge>}>
      <div className="koa-filters">
        <div className="koa-search"><Search aria-hidden="true" /><label className="kd-sr-only" htmlFor={`${instance}-search`}>워크플로 검색</label><input ref={searchInput} id={`${instance}-search`} className="kd-input" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="이름, 담당 팀, 설명 검색" /></div>
        <label><span className="kd-sr-only">워크플로 상태</span><select className="kd-select" value={status} onChange={event => setStatus(event.target.value as AutomationWorkflowStatus | 'all')}><option value="all">전체 상태</option><option value="active">활성</option><option value="paused">중지</option></select></label>
        <label><span className="kd-sr-only">워크플로 시작 조건</span><select className="kd-select" value={trigger} onChange={event => setTrigger(event.target.value as AutomationTrigger | 'all')}><option value="all">모든 시작 조건</option><option value="webhook">이벤트 수신</option><option value="schedule">정기 일정</option><option value="manual">수동 시작</option></select></label>
        {(query || status !== 'all' || trigger !== 'all') && <button className="kd-button" type="button" onClick={reset}>필터 초기화</button>}
      </div>
      {!visible.length ? <DashboardEmpty title="일치하는 워크플로가 없습니다." description="검색어나 상태, 시작 조건을 조정해 보세요." onReset={reset} /> : <>
        <div className="kd-table-scroll" tabIndex={0} role="region" aria-label="워크플로 표 · 가로로 스크롤 가능"><table className="kd-table koa-table"><caption className="kd-sr-only">현재 필터의 워크플로별 누적 표본 실행 기록</caption><thead><tr><th scope="col">워크플로</th><th scope="col">시작 조건</th><th scope="col">누적 실행</th><th scope="col">성공률</th><th scope="col">상태</th><th scope="col">관리</th></tr></thead><tbody>{visible.map(workflow => {
          const successRate = rate(workflow);
          const tone = successRate === null || successRate >= 95 ? 'accent' : successRate >= 90 ? 'warning' : 'danger';
          return <tr key={workflow.id} data-selected={workflow.id === visibleId}>
            <td><div className="koa-name"><span className="koa-workflow-mark"><GitBranch aria-hidden="true" /></span><span className="koa-name-text"><strong id={`${instance}-${workflow.id}`}>{workflow.name}</strong><small>{workflow.owner}</small></span></div></td>
            <td>{triggerLabels[workflow.trigger]}</td><td className="koa-numeric">{number(workflow.runCount)}</td>
            <td className="koa-numeric"><span className="koa-health" data-tone={tone}>{successRate !== null && successRate >= 95 && <Check aria-hidden="true" />}{successRate === null ? '—' : `${successRate.toFixed(1)}%`}</span></td>
            <td><DashboardBadge tone={workflow.status === 'active' ? 'accent' : 'neutral'}>{workflow.status === 'active' ? '활성' : '중지'}</DashboardBadge></td>
            <td><div className="koa-row-actions"><button type="button" className="kd-button" aria-pressed={workflow.id === visibleId} aria-controls={`${instance}-detail`} aria-labelledby={`${instance}-${workflow.id} ${instance}-${workflow.id}-inspect`} onClick={() => setSelectedId(workflow.id)}><span id={`${instance}-${workflow.id}-inspect`}>상세</span></button><button type="button" className="kd-button" aria-labelledby={`${instance}-${workflow.id} ${instance}-${workflow.id}-toggle`} onClick={() => changeStatus(workflow)}>{workflow.status === 'active' ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}<span id={`${instance}-${workflow.id}-toggle`}>{workflow.status === 'active' ? '중지하기' : '활성화'}</span></button></div></td>
          </tr>;
        })}</tbody></table></div>
        {selected && <section className="koa-detail" id={`${instance}-detail`} aria-label="선택한 워크플로 상세">
          <div><div className="koa-detail-heading"><h3 ref={detailHeading} tabIndex={-1}>{selected.name}</h3><DashboardBadge tone={selected.status === 'active' ? 'accent' : 'neutral'}>{selected.status === 'active' ? '활성' : '중지'}</DashboardBadge></div><p>{selected.description}</p><div className="koa-history"><span>성공 실행<strong>{number(selected.successCount)}</strong></span><span>실패 실행<strong className="koa-failed">{number(selected.runCount - selected.successCount)}</strong></span><span>누적 토큰<strong>{number(selected.tokenCount)}</strong></span></div></div>
          <ol className="koa-steps" aria-label="워크플로 구성 단계">{selected.steps.map((step, index) => <li key={step}><div className="koa-step-top"><span>{index + 1}</span></div>{step}</li>)}</ol>
          <div className="koa-detail-foot"><span><span>마지막 표본 실행</span> · <span>{selected.lastRun ?? '실행 기록 없음'}</span></span><span>상태 변경은 누적 실행·성공·토큰 기록에 영향을 주지 않습니다.</span></div>
        </section>}
      </>}
    </DashboardPanel>
    <DashboardPanel title="템플릿으로 시작하기" caption="흐름을 선택하고 이름을 입력해 로컬 워크플로를 추가하세요.">
      <div className="koa-templates">{automationTemplates.map(template => <button type="button" className="koa-template" data-selected={formOpen && templateId === template.id} key={template.id} aria-expanded={formOpen && templateId === template.id} aria-controls={`${instance}-form`} onClick={() => openForm(template.id)}>
        <TemplateArtwork variant={template.id} /><div className="koa-template-body"><div className="koa-template-category"><span>{template.category}</span><span>3단계</span></div><h3>{template.name}</h3><p>{template.description}</p><div className="koa-template-footer"><span>{triggerLabels[template.trigger]}</span><span><ArrowRight aria-hidden="true" /></span></div></div>
      </button>)}</div>
      <div id={`${instance}-form`} hidden={!formOpen}>
        {formOpen && <form className="koa-form" onSubmit={event => { event.preventDefault(); create(); }} noValidate>
          <div className="koa-form-head"><h3>새 로컬 워크플로</h3><button type="button" className="kd-button" aria-label="워크플로 만들기 닫기" onClick={closeForm}><X aria-hidden="true" /></button></div>
          <div className="koa-form-fields"><label htmlFor={`${instance}-name`}>워크플로 이름<input className="kd-input" id={`${instance}-name`} ref={nameInput} value={name} onKeyDown={event => { if (event.key === 'Enter' && !event.nativeEvent.isComposing) { event.preventDefault(); create(); } }} onChange={event => { setName(event.target.value); setError(null); }} aria-invalid={Boolean(error)} aria-describedby={error ? `${instance}-error` : `${instance}-creation-note`} placeholder="예: 주간 문의 검토" /></label><label htmlFor={`${instance}-template`}>시작 템플릿<select id={`${instance}-template`} className="kd-select" value={templateId} onChange={event => { setTemplateId(event.target.value); setError(null); }}>{automationTemplates.map(template => <option key={template.id} value={template.id}>{template.name}</option>)}</select></label></div>
          {error && <p className="koa-error" role="alert" id={`${instance}-error`}>{errorLabels[error]}</p>}
          <div className="koa-form-foot"><p id={`${instance}-creation-note`}>새 항목은 실행 기록 없이 중지 상태로 추가됩니다. 실제 서비스 연결이나 자동 실행은 없습니다.</p><button type="button" onClick={create} className="kd-button kd-primary"><Plus aria-hidden="true" />로컬에 추가</button></div>
        </form>}
      </div>
    </DashboardPanel>
    <DashboardNotice>{notice}</DashboardNotice>
    <p className="koa-disclaimer"><CheckCircle2 aria-hidden="true" /><span>모든 수치는 샘플입니다. 변경은 현재 예제 메모리에만 반영되며 새로고침하면 초기화됩니다. API 호출, 저장, 실제 자동화를 수행하지 않습니다.</span></p>
  </DashboardShell></div>;
}
