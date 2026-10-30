/** KLIC timeline samples. Intervals are [start,end); costs accrue linearly in this simulation. */
export type TimelineMode='plan-actual'|'execution-waterfall'|'team-swimlane'|'milestone-delta'|'release-gates';
export type TextPair=readonly [string,string];
export interface TimelineTask {id:string;name:TextPair;team:TextPair;owner:string;planStart:number;planDuration:number;actualStart:number;actualDuration:number;cost:number;depends:string[];note:TextPair}
export interface TimelineScenario {mode:TimelineMode;title:TextPair;subtitle:TextPair;label:string;initial:number;tasks:TimelineTask[]}
const task=(id:string,name:TextPair,team:TextPair,owner:string,p:number,pd:number,a:number,ad:number,cost:number,depends:string[],note:TextPair):TimelineTask=>({id,name,team,owner,planStart:p,planDuration:pd,actualStart:a,actualDuration:ad,cost,depends,note});
const product:TextPair=['프로덕트','Product'],engineering:TextPair=['엔지니어링','Engineering'],quality:TextPair=['품질 검증','Quality'];
export const TIMELINE_SCENARIOS:Record<TimelineMode,TimelineScenario>={
 'plan-actual':{mode:'plan-actual',title:['계획과 실적, 같은 시간 위에서.','Plan and actual, on one clock.'],subtitle:['요금제 페이지 출시 · 병렬 작업과 지연 구간 비교','Pricing page launch · parallel work and schedule drift'],label:'PLAN / ACTUAL',initial:120,tasks:[
 task('brief',['요구사항 읽기','Read the brief'],product,'서윤',0,20,0,16,.08,[],['요구사항을 확정하고 두 작업에 동시에 인계합니다.','Confirm the brief and hand off to two parallel tasks.']),
 task('copy',['카피 초안 작성','Draft the copy'],product,'지호',16,40,16,52,.26,['brief'],['검토가 길어져 계획보다 12초 더 사용했습니다.','Review adds 12 seconds to the planned duration.']),
 task('layout',['화면 레이아웃 구현','Build the layout'],engineering,'민준',16,60,16,85,.35,['brief'],['반응형 검증이 추가된 병렬 작업입니다.','A parallel task with extra responsive verification.']),
 task('test',['테스트 작성','Write the tests'],quality,'하린',56,30,68,28,.09,['copy'],['카피 확정 뒤 시작하는 의존 작업입니다.','This task starts after the copy is finalized.']),
 task('payment',['결제 흐름 연결','Wire the payment flow'],engineering,'민준',76,39,101,39,.14,['layout'],['레이아웃 완료 후 시작합니다. 실제 외부 결제는 호출하지 않습니다.','Starts after layout completion. No external payment is called.']),
 task('verify',['통합 테스트와 수정','Run tests and fixes'],quality,'하린',115,35,140,35,.07,['test','payment'],['두 선행 작업이 완료된 뒤 검증합니다.','Verification waits for both predecessors.']),
 task('pr',['변경 검토 요청','Open the review'],engineering,'민준',160,15,183,15,.04,['verify'],['최종 3분 18초, 계획 대비 23초 지연인 샘플입니다.','Sample completion is 3:18, 23 seconds after plan.'])]},
 'execution-waterfall':{mode:'execution-waterfall',title:['실행의 병목을 따라가세요.','Follow the execution bottleneck.'],subtitle:['지식 검색 에이전트 · 단계별 실행 워터폴','Knowledge search agent · execution waterfall'],label:'EXECUTION TRACE',initial:55,tasks:[
 task('accept',['요청 수신','Accept request'],['게이트웨이','Gateway'],'Gateway',0,5,0,4,.01,[],['요청 ID와 입력 스키마를 검사합니다.','Validate the request ID and input schema.']),
 task('auth',['권한 범위 확인','Resolve scopes'],['보안','Security'],'Policy',5,8,4,9,.02,['accept'],['허용된 문서 집합을 확정합니다.','Resolve the allowed document set.']),
 task('search',['하이브리드 검색','Hybrid search'],['검색','Retrieval'],'Search',13,20,13,29,.12,['auth'],['검색 응답 지연이 뒤 작업에 영향을 줍니다.','Retrieval latency propagates to downstream work.']),
 task('profile',['문맥 병렬 조회','Fetch context'],['검색','Retrieval'],'Context',13,15,13,17,.04,['auth'],['검색과 병렬로 실행하는 문맥 조회입니다.','Fetch context in parallel with retrieval.']),
 task('rank',['결과 재정렬','Rerank results'],['추론','Inference'],'Reranker',33,12,42,15,.08,['search','profile'],['두 조회 결과를 받은 뒤 정렬합니다.','Rerank after both result sets are available.']),
 task('draft',['응답 초안 생성','Generate draft'],['추론','Inference'],'Writer',45,23,57,26,.21,['rank'],['토큰 생성 비용은 경과 비율로 계산한 샘플입니다.','Sample generation cost accrues with elapsed time.']),
 task('guard',['출처와 정책 검증','Validate citations'],['검증','Validation'],'Guard',68,9,83,11,.03,['draft'],['출처 누락과 정책 위반 여부를 확인합니다.','Check missing citations and policy constraints.']),
 task('deliver',['응답 전달','Deliver response'],['게이트웨이','Gateway'],'Gateway',77,3,94,2,.01,['guard'],['완료 시점과 지출 합계를 같은 스냅샷으로 표시합니다.','Completion and cost totals use the same snapshot.'])]},
 'team-swimlane':{mode:'team-swimlane',title:['팀 사이의 인계가 보이도록.','Make every handoff visible.'],subtitle:['고객 포털 출시 · 기획·개발·품질 스윔레인','Customer portal launch · product, engineering and quality lanes'],label:'TEAM HANDOFF',initial:105,tasks:[
 task('scope',['범위 확정','Confirm scope'],product,'서윤',0,25,0,22,.14,[],['인계할 범위와 승인 조건을 정리합니다.','Define scope and acceptance criteria.']),
 task('design',['인터랙션 설계','Design interaction'],product,'지호',25,40,22,48,.25,['scope'],['주요 상태와 예외 흐름을 설계합니다.','Design core states and exceptional flows.']),
 task('api',['API 계약 구현','Implement API contract'],engineering,'민준',25,55,22,63,.35,['scope'],['디자인과 병렬로 계약을 구현합니다.','Implement the contract in parallel with design.']),
 task('screen',['화면 조합','Compose screens'],engineering,'민준',80,50,85,55,.32,['design','api'],['설계와 API 계약의 완료를 모두 기다립니다.','Wait for design and the API contract.']),
 task('qa',['통합 품질 검증','Integrated QA'],quality,'하린',130,35,140,38,.18,['screen'],['키보드와 오류 복구 흐름을 검수합니다.','Verify keyboard and error recovery flows.']),
 task('handoff',['운영 인계','Operations handoff'],quality,'하린',165,20,178,18,.09,['qa'],['검증 결과와 운영 문서를 함께 인계합니다.','Hand over verification results and operational notes.'])]},
 'milestone-delta':{mode:'milestone-delta',title:['약속한 시점과 도착한 시점.','Promised dates. Actual arrivals.'],subtitle:['제품 전환 프로젝트 · 기준 일정과 마일스톤 편차','Product transition · baseline and milestone variance'],label:'MILESTONE REVIEW',initial:120,tasks:[
 task('discovery',['범위와 기준 승인','Scope approved'],product,'서윤',0,20,0,20,1200,[],['범위 승인과 검수 기준을 함께 기록합니다.','Record scope approval and acceptance criteria.']),
 task('prototype',['프로토타입 승인','Prototype approved'],product,'지호',20,40,20,48,2400,['discovery'],['사용성 검토를 반영한 승인 시점입니다.','Approval includes usability review.']),
 task('migration',['데이터 이관 검증','Migration validated'],engineering,'민준',60,60,68,64,5000,['prototype'],['운영 데이터가 아닌 이관 샘플의 검증입니다.','Validate a sample migration, not production data.']),
 task('acceptance',['사용자 검수 완료','Acceptance completed'],quality,'하린',120,40,132,44,1800,['migration'],['각 마일스톤의 계획·실적·예상 날짜를 구분합니다.','Separate baseline, actual and projected milestone dates.']),
 task('launch',['서비스 전환','Service transition'],engineering,'민준',160,40,176,42,3200,['acceptance'],['시점 선택으로 전환 전후 상태를 비교합니다.','Compare states before and after transition.']),
 task('close',['안정화 종료','Stabilization closed'],quality,'하린',200,20,218,22,1400,['launch'],['완료하지 않은 단계는 예상 일정으로 표시합니다.','Unfinished milestones display projected dates.'])]},
 'release-gates':{mode:'release-gates',title:['출시까지, 단계마다 근거를.','Evidence at every release gate.'],subtitle:['서비스 릴리즈 · 빌드에서 안정화까지','Service release · from build to stabilization'],label:'RELEASE GATES',initial:118,tasks:[
 task('build',['빌드','Build'],engineering,'CI',0,20,0,18,.06,[],['빌드 산출물과 해시를 확인합니다.','Inspect build output and hashes.']),
 task('tests',['테스트','Test'],quality,'QA',20,30,18,38,.12,['build'],['회귀 테스트가 계획보다 오래 실행됩니다.','Regression testing takes longer than planned.']),
 task('security',['보안 검토','Security'],quality,'Security',50,30,56,35,.08,['tests'],['필수 검토 항목을 모두 확인한 뒤 인계합니다.','Hand off only after required checks.']),
 task('approve',['출시 승인','Approve'],product,'Release',80,20,91,22,.02,['security'],['현재 시점의 승인 상태를 분명히 표시합니다.','Show approval state at the selected instant.']),
 task('canary',['카나리 배포','Canary'],engineering,'Deploy',100,40,113,45,.15,['approve'],['확대 전 상태를 샘플 시간에 맞춰 재생합니다.','Replay sample canary states before expansion.']),
 task('stable',['안정화','Stabilize'],quality,'Observe',140,30,158,18,.04,['canary'],['서버 배포나 실제 승인을 실행하지 않습니다.','No production deployment or approval is executed.'])]}
};
export const bounds=(scenario:TimelineScenario)=>({plan:Math.max(...scenario.tasks.map(t=>t.planStart+t.planDuration)),actual:Math.max(...scenario.tasks.map(t=>t.actualStart+t.actualDuration))});
export function taskSnapshot(task:TimelineTask,time:number){const elapsed=Math.max(0,Math.min(task.actualDuration,time-task.actualStart));return {elapsed,progress:elapsed/task.actualDuration,status:time>=task.actualStart+task.actualDuration?'done':time>=task.actualStart?'running':'queued',cost:task.cost*(elapsed/task.actualDuration)} as const;}
export function timelineSnapshot(scenario:TimelineScenario,time:number){const end=bounds(scenario),clamped=Math.max(0,Math.min(end.actual,time));return {time:clamped,...end,delta:end.actual-end.plan,done:scenario.tasks.filter(t=>taskSnapshot(t,clamped).status==='done').length,cost:scenario.tasks.reduce((sum,t)=>sum+taskSnapshot(t,clamped).cost,0),budget:scenario.tasks.reduce((sum,t)=>sum+t.cost,0)};}
export function advanceTimeline(time:number,delta:number,end:number,loop:boolean){const next=Math.max(0,time+delta);return {time:next>=end?(loop?next%end:end):next,ended:next>=end&&!loop};}
export function formatDuration(value:number){const n=Math.max(0,Math.floor(value));return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;}
export function timelineTime(mode:TimelineMode,value:number){return mode==='milestone-delta'?`D+${(value/20).toFixed(1)}`:formatDuration(value);}
export function dependencyCurve(x1:number,y1:number,x2:number,y2:number){const bend=Math.max(x1+10,(x1+x2)/2);return `M ${x1} ${y1} H ${bend} V ${y2} H ${x2}`;}
