/** KLIC additional SVG connector scenes. No external runtime dependency. */
import type {ConnectorMode,ConnectorScene,DiagramNode,DiagramEdge,Point} from './connectors';
// Translate sample display text while keeping node IDs, route IDs and state metadata stable.
const CONNECTOR_LABELS: Record<string, string> = {
  "Source": "출발",
  "Target": "도착",
  "Primary connection": "주 연결",
  "Complete": "완료",
  "Audit": "감사",
  "Accept": "승인",
  "All done": "모두 완료",
  "Approved": "승인됨",
  "Async / pending": "비동기 / 대기",
  "Commands": "명령",
  "Compensate": "보상 처리",
  "Consume": "작업 수신",
  "Consumer": "수신자",
  "Directed transfer": "단방향 전달",
  "Evaluate": "평가",
  "Events": "이벤트",
  "Fork": "분기",
  "Fork input": "분기 입력",
  "Fork junction": "분기 접점",
  "Guard: allowed": "조건: 허용",
  "Guard: denied": "조건: 거부",
  "Idle": "대기",
  "Join": "합류",
  "Join junction": "합류 접점",
  "Lower detour": "아래쪽 우회",
  "Metrics": "측정 지표",
  "Observer": "감시자",
  "Persist": "영구 저장",
  "Process": "처리",
  "Producer": "발행자",
  "Queue": "작업 큐",
  "Receive": "수신",
  "Reject": "반려",
  "Rejected": "반려됨",
  "Request": "요청",
  "Response": "응답",
  "Retry": "재시도",
  "Router": "라우터",
  "Running": "진행 중",
  "Shared junction": "공유 접점",
  "Store": "저장",
  "Success": "성공",
  "Timeout": "시간 초과",
  "Upper detour": "위쪽 우회",
  "Worker": "처리 워커",
  "start [valid]": "시작 [유효함]",
  "finish [saved]": "완료 [저장됨]",
  "reset": "초기화",
  "Input A": "입력 A",
  "Input B": "입력 B",
  "Output A": "출력 A",
  "Output B": "출력 B",
  "Task A": "작업 A",
  "Task B": "작업 B",
  "Start A": "A 시작",
  "Start B": "B 시작",
  "Await A": "A 완료 대기",
  "Await B": "B 완료 대기"
};
function connectorLabel(label: string): string {
 if (CONNECTOR_LABELS[label]) return CONNECTOR_LABELS[label];
 return label.replace(/^Port (\d+)$/, '포트 $1').replace(/^Input ([a-z])$/, '입력 $1').replace(/^Output ([a-z])$/, '출력 $1').replace(/^Retry ≤ (\d+)$/, '재시도 ≤ $1');
}
const point=(x:number,y:number):Point=>({x,y});
const node=(id:string,name:string,x:number,y:number,w=150,h=60):DiagramNode=>({id,name:connectorLabel(name),x,y,w,h,detail:connectorLabel(name)});
const path=(points:Point[])=>points.map((p,i)=>`${i?'L':'M'}${p.x} ${p.y}`).join(' ');
const edge=(id:string,source:string,target:string,points:Point[],label:string,extra:Partial<DiagramEdge>={}):DiagramEdge=>({id,source,target,points,d:path(points),label:connectorLabel(label),labelAt:point(500,240),...extra});
export function buildConnectorVariant(mode:ConnectorMode,value:number):ConnectorScene{
 const scene:ConnectorScene={mode,nodes:[],edges:[],regions:[],obstacles:[],arcs:[],metadata:{value},status:'샘플 관계 · 외부 시스템에 연결되지 않습니다.'};
 const e=(id:string,source:string,target:string,coords:number[][],label:string,extra:Partial<DiagramEdge>={})=>edge(id,source,target,coords.map(([x,y])=>point(x,y)),label,extra);
 if(['straight','elbow','curve','step','dashed','bidirectional','interaction'].includes(mode)){
  const y=['straight','dashed','interaction'].includes(mode)?value:340;
  scene.nodes=[node('source','Source',80,150),node('target','Target',770,y-30)];
  let d=`M230 180 L770 ${y}`;
  if(mode==='elbow')d=`M230 180 H${value} V${y} H770`;
  if(mode==='curve')d=`M230 180 C${230+value} 180 ${770-value} ${y} 770 ${y}`;
  if(mode==='step')d=`M230 180 H350 V${180+value} H650 V${y} H770`;
  if(mode==='bidirectional'){
   scene.nodes[0].y=100;scene.nodes[0].h=160;scene.nodes[1].y=100;scene.nodes[1].h=160;
   scene.edges=[e('request','source','target',[[230,180-value/2],[770,180-value/2]],'Request',{labelAt:point(500,160-value/2)}),e('response','target','source',[[770,180+value/2],[230,180+value/2]],'Response',{dash:true,color:1,labelAt:point(500,205+value/2)})];
  }else scene.edges=[{...e('primary','source','target',[[230,180],[770,y]],mode==='dashed'?'Async / pending':'Primary connection',{dash:mode==='dashed',labelAt:point(500,(180+y)/2-18)}),d}];
  if(mode==='interaction'){
   scene.nodes.push(node('observer','Observer',425,400));
   scene.edges.push(e('audit','target','observer',[[845,y+30],[845,430],[575,430]],'Audit',{dash:true,color:1,labelAt:point(710,410)}));
  }
 }else if(mode==='rounded'){
  scene.nodes=[node('a','Source',70,230),node('b','Target',780,230)];
  scene.edges=[0,1].map(i=>{const y=105+i*310,r=value;return {...e('round-'+i,'a','b',[[220,250+i*20],[780,250+i*20]],i?'Lower detour':'Upper detour',{color:i,labelAt:point(500,y-16)}),d:i?`M220 270 H${300-r} Q300 270 300 ${270+r} V${y-r} Q300 ${y} ${300+r} ${y} H${700-r} Q700 ${y} 700 ${y-r} V${270+r} Q700 270 ${700+r} 270 H780`:`M220 250 H${300-r} Q300 250 300 ${250-r} V${y+r} Q300 ${y} ${300+r} ${y} H${700-r} Q700 ${y} 700 ${y+r} V${250-r} Q700 250 ${700+r} 250 H780`};});
 }else if(mode==='ports'){
  scene.nodes=[node('router','Router',70,100,180,320),...Array.from({length:4},(_,i)=>node('t'+i,'Port '+(i+1),780,70+i*110,150,60))];
  scene.edges=Array.from({length:4},(_,i)=>{const sy=260+(i-1.5)*value,ty=100+i*110,x=350+i*65;return e('port-'+i,'router','t'+i,[[250,sy],[x,sy],[x,ty],[780,ty]],'Port '+(i+1),{color:i,labelAt:point(650,ty-14)});});
 }else if(mode==='hyperedge'){
  scene.nodes=[node('junction','Shared junction',value,260,0,0),...['a','b','c','d'].map((id,i)=>node(id,['Input A','Input B','Output A','Output B'][i],i<2?60:790,i%2?360:100))];scene.nodes[0].kind='junction';
  scene.edges=['a','b','c','d'].map((id,i)=>e('hyper-'+i,i<2?id:'junction',i<2?'junction':id,i<2?[[210,i%2?390:130],[value,260]]:[[value,260],[790,i%2?390:130]],i<2?'Input '+id:'Output '+id,{arrow:i>=2,labelAt:point(i<2?300:700,i%2?360:150),color:i<2?0:1}));
 }else if(mode==='feedback'){
  scene.nodes=['a','b','c'].map((id,i)=>node(id,['Receive','Process','Store'][i],80+i*340,260));
  scene.edges=[e('forward-a','a','b',[[230,290],[420,290]],'Receive',{labelAt:point(325,270)}),e('forward-b','b','c',[[570,290],[760,290]],'Persist',{labelAt:point(665,270)}),e('inner','c','b',[[835,260],[835,180],[495,180],[495,260]],'Retry',{dash:true,color:3,labelAt:point(650,160)}),e('outer','c','a',[[880,260],[880,180-value],[155,180-value],[155,260]],'Compensate',{dash:true,color:1,labelAt:point(480,160-value)})];
 }else if(mode==='labels'){
  scene.nodes=[node('a','Producer',60,90,170,340),node('b','Consumer',770,90,170,340)];
  scene.edges=Array.from({length:4},(_,i)=>{const y=260+(i-1.5)*value;return e('labeled-'+i,'a','b',[[230,y],[770,y]],['Commands','Events','Audit','Metrics'][i],{color:i,labelAt:point(420+i*55,y-15)});});
 }else if(mode==='taper'){
  scene.nodes=[node('a','Source',70,200,150,120),node('b','Target',780,200,150,120)];
  scene.edges=[{...e('taper','a','b',[[220,260],[780,260]],'Directed transfer',{fill:true,arrow:false,labelAt:point(500,210)}),d:`M220 ${260-value/2} L740 252 L740 240 L780 260 L740 280 L740 268 L220 ${260+value/2} Z`}];
 }else if(mode==='decision'||mode==='parallel'){
  const parallel=mode==='parallel',gap=value;
  scene.nodes=[node('start',parallel?'Fork':'Evaluate',70,230),node('upper',parallel?'Task A':'Approved',425,260-gap-30),node('lower',parallel?'Task B':'Rejected',425,260+gap-30),node('end',parallel?'Join':'Complete',780,230)];
  scene.edges=[e('branch-a','start','upper',[[220,260],[320,260],[320,260-gap],[425,260-gap]],parallel?'Start A':'Guard: allowed',{labelAt:point(345,240-gap)}),e('branch-b','start','lower',[[220,260],[320,260],[320,260+gap],[425,260+gap]],parallel?'Start B':'Guard: denied',{color:3,labelAt:point(345,290+gap)}),e('merge-a','upper','end',[[575,260-gap],[680,260-gap],[680,260],[780,260]],parallel?'Await A':'Accept',{labelAt:point(650,240-gap)}),e('merge-b','lower','end',[[575,260+gap],[680,260+gap],[680,260],[780,260]],parallel?'Await B':'Reject',{color:3,labelAt:point(650,290+gap)})];
  if(parallel){scene.nodes.push({...node('fork','Fork junction',320,260,0,0),kind:'junction'},{...node('join','Join junction',680,260,0,0),kind:'junction'});scene.metadata.joinPolicy='all';
   scene.edges=[e('fork-input','start','fork',[[220,260],[320,260]],'Fork input',{arrow:false,labelAt:point(270,235)}),e('fork-a','fork','upper',[[320,260],[320,260-gap],[425,260-gap]],'Start A',{labelAt:point(365,240-gap)}),e('fork-b','fork','lower',[[320,260],[320,260+gap],[425,260+gap]],'Start B',{labelAt:point(365,290+gap),color:1}),e('join-a','upper','join',[[575,260-gap],[680,260-gap],[680,260]],'Await A',{labelAt:point(630,240-gap),arrow:false}),e('join-b','lower','join',[[575,260+gap],[680,260+gap],[680,260]],'Await B',{labelAt:point(630,290+gap),arrow:false,color:1}),e('join-output','join','end',[[680,260],[780,260]],'All done',{labelAt:point(730,235)})];
  }
 }else if(mode==='state'){
  const active=Math.round(value);scene.nodes=['idle','running','done'].map((id,i)=>node(id,['Idle','Running','Complete'][i],80+i*340,220));
  scene.metadata.activeNode=scene.nodes[active].id;
  scene.edges=[e('begin','idle','running',[[230,250],[420,250]],'start [valid]',{labelAt:point(325,230),color:active>=1?0:2}),e('finish','running','done',[[570,250],[760,250]],'finish [saved]',{labelAt:point(665,230),color:active===2?0:2}),e('reset','done','idle',[[835,280],[835,400],[155,400],[155,280]],'reset',{dash:true,color:1,labelAt:point(500,380)})];
 }else if(mode==='retry'){
  scene.nodes=[node('queue','Queue',70,230),node('worker','Worker',425,230),node('done','Complete',780,100),node('timeout','Timeout',780,360)];
  scene.edges=[e('consume','queue','worker',[[220,260],[425,260]],'Consume',{labelAt:point(320,240)}),e('success','worker','done',[[575,250],[680,250],[680,130],[780,130]],'Success',{labelAt:point(690,110)}),e('timeout','worker','timeout',[[575,270],[680,270],[680,390],[780,390]],'Timeout',{color:3,dash:true,labelAt:point(690,415)}),{...e('retry','worker','worker',[[465,230],[535,230]],'Retry ≤ '+Math.round(value),{dash:true,color:1,labelAt:point(500,80)}),d:`M465 230 C${280-value*10} ${100-value*8} ${720+value*10} ${100-value*8} 535 230`}];scene.metadata.maxAttempts=Math.round(value);
 }
 return scene;
}
