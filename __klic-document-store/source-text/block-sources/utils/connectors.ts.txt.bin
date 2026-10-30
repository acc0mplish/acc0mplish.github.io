/** KLIC SVG geometry. */
import {buildConnectorVariant} from './connectorVariants';
import {CONNECTOR_EXAMPLES} from '../data/connectorExamples';
export {CONNECTOR_EXAMPLES};
export type ConnectorMode=typeof CONNECTOR_EXAMPLES[number]['mode'];
export const CONNECTOR_MODES=CONNECTOR_EXAMPLES.map(e=>e.mode);
export type Point={x:number;y:number};export type Box={x:number;y:number;w:number;h:number};
export type DiagramNode=Box&{id:string;name:string;detail:string;kind?:'junction'};
export type DiagramEdge={id:string;source:string;target:string;d:string;label:string;labelAt:Point;color?:number;dash?:boolean;arrow?:boolean;fill?:boolean;width?:number;lane?:number;value?:number;points?:Point[]};
export type ConnectorScene={mode:ConnectorMode;nodes:DiagramNode[];edges:DiagramEdge[];regions:(Box&{name:string})[];obstacles:Box[];arcs:{d:string;color:number}[];metadata:Record<string,unknown>;status:string};
const num=(v:number)=>+v.toFixed(3),p=(x:number,y:number):Point=>({x,y});
const line=(points:Point[])=>points.map((v,i)=>(i?'L':'M')+num(v.x)+' '+num(v.y)).join(' ');
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
const valid=(pt:Point)=>Number.isFinite(pt.x)&&Number.isFinite(pt.y);
const inside=(pt:Point,r:Box)=>pt.x>r.x&&pt.x<r.x+r.w&&pt.y>r.y&&pt.y<r.y+r.h;
function segmentClear(a:Point,b:Point,rects:Box[]){return !rects.some(r=>a.y===b.y?(a.y>r.y&&a.y<r.y+r.h&&Math.max(a.x,b.x)>r.x&&Math.min(a.x,b.x)<r.x+r.w):(a.x>r.x&&a.x<r.x+r.w&&Math.max(a.y,b.y)>r.y&&Math.min(a.y,b.y)<r.y+r.h));}
/** Rectilinear visibility grid + direction-state Dijkstra; never fall back through an obstacle. */
export function routeOrthogonal(start:Point,end:Point,obstacles:Box[],clearance=12):Point[]|null{
 if(!valid(start)||!valid(end)||!Number.isFinite(clearance)||clearance<0||obstacles.some(r=>![r.x,r.y,r.w,r.h].every(Number.isFinite)||r.w<0||r.h<0))return null;
 clearance=Math.max(2,clearance); // Keep physical obstacle boundaries and zero-width seams out of the route.
 const rects=obstacles.map(r=>({x:r.x-clearance,y:r.y-clearance,w:r.w+clearance*2,h:r.h+clearance*2}));
 if(rects.some(r=>inside(start,r)||inside(end,r)))return null;
 const xs=[...new Set([start.x,end.x,...rects.flatMap(r=>[r.x,r.x+r.w])])].sort((a,b)=>a-b),ys=[...new Set([start.y,end.y,...rects.flatMap(r=>[r.y,r.y+r.h])])].sort((a,b)=>a-b);
 const points=ys.flatMap(y=>xs.map(x=>p(x,y))),n=points.length,states=n*3;
 const begin=points.findIndex(q=>q.x===start.x&&q.y===start.y),finish=points.findIndex(q=>q.x===end.x&&q.y===end.y);
 const distance=Array(states).fill(Infinity),previous=Array(states).fill(-1),visited=new Set<number>();distance[begin*3]=0;
 let destination=-1;
 for(let step=0;step<states;step++){
  let state=-1;for(let k=0;k<states;k++)if(!visited.has(k)&&(state<0||distance[k]<distance[state]))state=k;
  if(state<0||!Number.isFinite(distance[state]))break;visited.add(state);const index=Math.floor(state/3),direction=state%3;
  if(index===finish){destination=state;break;}
  const x=index%xs.length,y=Math.floor(index/xs.length);
  for(const [dx,dy,dir]of [[1,0,1],[-1,0,1],[0,1,2],[0,-1,2]]){
   const nx=x+dx,ny=y+dy;if(nx<0||nx>=xs.length||ny<0||ny>=ys.length)continue;
   const next=ny*xs.length+nx,a=points[index],b=points[next];if(rects.some(r=>inside(b,r))||!segmentClear(a,b,rects))continue;
   const nextState=next*3+dir,cost=distance[state]+Math.abs(a.x-b.x)+Math.abs(a.y-b.y)+(direction&&direction!==dir?24:0);
   if(cost<distance[nextState]){distance[nextState]=cost;previous[nextState]=state;}
  }
 }
 if(destination<0)return null;const route:Point[]=[];for(let s=destination;s>=0;s=previous[s])route.unshift(points[Math.floor(s/3)]);
 return route.filter((q,i)=>i===0||i===route.length-1||!((route[i-1].x===q.x&&q.x===route[i+1].x)||(route[i-1].y===q.y&&q.y===route[i+1].y)));
}
export function segmentIntersection(a:Point,b:Point,c:Point,d:Point):Point|null{
 const rx=b.x-a.x,ry=b.y-a.y,sx=d.x-c.x,sy=d.y-c.y,den=rx*sy-ry*sx;if(Math.abs(den)<1e-9)return null;
 const t=((c.x-a.x)*sy-(c.y-a.y)*sx)/den,u=((c.x-a.x)*ry-(c.y-a.y)*rx)/den;
 return t>1e-7&&t<1-1e-7&&u>1e-7&&u<1-1e-7?p(num(a.x+t*rx),num(a.y+t*ry)):null;
}
export function bridgePath(points:Point[],others:Point[][],radius=9){
 let d='M'+points[0].x+' '+points[0].y;
 for(let i=1;i<points.length;i++){
  const a=points[i-1],b=points[i],length=Math.hypot(b.x-a.x,b.y-a.y),ux=(b.x-a.x)/length,uy=(b.y-a.y)/length;
  if(!length)continue;const hits:Point[]=[];
  for(const other of others)for(let j=1;j<other.length;j++){const hit=segmentIntersection(a,b,other[j-1],other[j]);if(hit&&!hits.some(v=>Math.hypot(v.x-hit.x,v.y-hit.y)<1e-6))hits.push(hit);}
  hits.sort((q,r)=>Math.hypot(q.x-a.x,q.y-a.y)-Math.hypot(r.x-a.x,r.y-a.y));
  let used=0;for(const hit of hits){const at=Math.hypot(hit.x-a.x,hit.y-a.y),r=Math.min(radius,(at-used)/2,(length-at)/2);if(r<2)continue;
   d+=` L${num(hit.x-ux*r)} ${num(hit.y-uy*r)} A${r} ${r} 0 0 1 ${num(hit.x+ux*r)} ${num(hit.y+uy*r)}`;used=at+r;
  }d+=' L'+b.x+' '+b.y;
 }return d;
}
export function ribbonDistribution(total:number,percentage:number){
 if(!Number.isSafeInteger(total)||total<0)throw new Error('Total must be a non-negative integer');
 const share=Number.isFinite(percentage)?Math.max(0,Math.min(100,percentage)):50,a=Math.round(total*share/100),b=Math.round((total-a)*.6),c=total-a-b;
 return [a,b,c].map((value,i)=>({id:['immediate','review','archive'][i],value,width:value}));
}
export function radialLayout(matrix:number[][]){
 const n=matrix.length;if(!n||matrix.some(row=>row.length!==n||row.some(v=>!Number.isSafeInteger(v)||v<0)))throw new Error('Expected a finite non-negative square matrix');
 const total=matrix.flat().reduce((a,b)=>a+b,0);if(!Number.isSafeInteger(total))throw new Error('Quantity total exceeds the safe integer range');const gap=Math.min(.09,Math.PI/n),unit=total?(Math.PI*2-gap*n)/(2*total):0;
 let cursor=-Math.PI/2;
 const arcs=matrix.map((row,i)=>{const outgoing=row.reduce((a,b)=>a+b,0),incoming=matrix.reduce((sum,r)=>sum+r[i],0),start=cursor,end=start+(outgoing+incoming)*unit;cursor=end+gap;return {start,end,outgoing,incoming};});
 const out=arcs.map(a=>a.start),incoming=arcs.map(a=>a.start+a.outgoing*unit),ribbons:{source:number;target:number;value:number;sourceStart:number;sourceEnd:number;targetStart:number;targetEnd:number}[]=[];
 matrix.forEach((row,i)=>row.forEach((value,j)=>{if(!value)return;const sourceStart=out[i],targetStart=incoming[j];out[i]+=value*unit;incoming[j]+=value*unit;ribbons.push({source:i,target:j,value,sourceStart,sourceEnd:out[i],targetStart,targetEnd:incoming[j]});}));
 return {arcs,ribbons,total};
}
const node=(id:string,name:string,x:number,y:number,w=160,h=80,detail='선택한 노드와 연결된 관계를 확인하세요.'):DiagramNode=>({id,name,x,y,w,h,detail});
const edge=(id:string,source:string,target:string,points:Point[],label:string,extra:Partial<DiagramEdge>={}):DiagramEdge=>({id,source,target,points,d:line(points),label,labelAt:points[Math.floor(points.length/2)],...extra});
const polar=(angle:number,r:number)=>p(500+Math.cos(angle)*r,260+Math.sin(angle)*r);
function sector(start:number,end:number,outer:number,inner:number){const a=polar(start,outer),b=polar(end,outer),c=polar(end,inner),d=polar(start,inner),large=end-start>Math.PI?1:0;return `M${a.x} ${a.y} A${outer} ${outer} 0 ${large} 1 ${b.x} ${b.y} L${c.x} ${c.y} A${inner} ${inner} 0 ${large} 0 ${d.x} ${d.y} Z`;}
export function buildConnectorScene(mode:ConnectorMode,input?:number,options:{blocked?:boolean}={}):ConnectorScene{
 const example=CONNECTOR_EXAMPLES.find(e=>e.mode===mode);if(!example)throw new Error('Unknown connector mode');
 const value=Number.isFinite(input)?Math.max(example.control.min,Math.min(example.control.max,input!)):example.control.initial;
 const scene:ConnectorScene={mode,nodes:[],edges:[],regions:[],obstacles:[],arcs:[],metadata:{value},status:'샘플 관계 · 외부 시스템에 연결되지 않습니다.'};
 if(mode==='obstacle'){
  scene.nodes=[node('client','요청 진입',20,220,150),node('service','업무 서비스',830,220,150)];
  scene.obstacles=[{x:330,y:60,w:130,h:value},{x:540,y:460-value,w:130,h:value}];if(options.blocked)scene.obstacles.push({x:820,y:180,w:170,h:170});
  const start=p(182,260),end=p(818,260);
  const available=routeOrthogonal(start,end,scene.obstacles),interior=available&&routeOrthogonal(p(206,260),p(794,260),scene.obstacles);
  const points=interior?[start,...interior,end]:null;
  if(points)scene.edges=[edge('route','client','service',points,'안전 경로',{labelAt:p(500,38)})];
  scene.metadata={...scene.metadata,clearance:12,bends:points?Math.max(0,points.length-2):null};scene.status=points?'장애물 여유 공간 12px · 직교 우회 경로':'경로 없음 · 끝점 또는 통로가 차단되었습니다.';
 }else if(mode==='metro'){
  scene.nodes=[node('source','원본 시스템',60,140,180,230),node('target','목적 시스템',760,140,180,230)];
  scene.edges=Array.from({length:4},(_,i)=>{const y=180+i*50,lane=255+(i-1.5)*value,delta=Math.abs(lane-y);return edge('lane-'+i,'source','target',[p(240,y),p(285,y),p(285+delta,lane),p(715-delta,lane),p(715,y),p(760,y)],['운영 이벤트','감사 기록','백업 스트림','분석 이벤트'][i],{color:i,lane,labelAt:p(500,lane-10)});});
  scene.metadata={...scene.metadata,lanes:4,spacing:value};
 }else if(mode==='multiedge'){
  scene.nodes=[node('api','API 게이트웨이',50,220,170),node('worker','처리 워커',780,220,170)];
  const count=Math.round(value);scene.edges=Array.from({length:count},(_,i)=>{const offset=(i-(count-1)/2)*42,reverse=i%2===1,a=p(reverse?780:220,260),b=p(reverse?220:780,260);return {...edge('relation-'+i,reverse?'worker':'api',reverse?'api':'worker',[a,b],(reverse?'응답':'요청')+' '+(i+1),{color:reverse?1:0,dash:reverse,labelAt:p(500,260+offset-10)}),d:`M${a.x} ${a.y} Q500 ${260+offset*2} ${b.x} ${b.y}`};});
  scene.metadata={...scene.metadata,relations:count};
 }else if(mode==='loops'){
  scene.nodes=[node('queue','작업 큐',50,240,150),node('poller','폴링 워커',420,240),node('store','결과 저장',800,240,150)];
  scene.edges=[edge('consume','queue','poller',[p(200,280),p(420,280)],'작업 수신',{labelAt:p(310,264)}),edge('persist','poller','store',[p(580,280),p(800,280)],'결과 기록',{labelAt:p(690,264)})];
  for(const [index,sign]of [[0,-1],[1,1]]){const y=sign<0?240:320,outer=y+sign*value;scene.edges.push({...edge('self-'+index,'poller','poller',[p(468,y),p(532,y)],index?'재시도':'폴링 유지',{dash:!!index,color:index,labelAt:p(500,y+sign*value*.8)}),d:`M468 ${y} C${468-value*.7} ${outer} ${532+value*.7} ${outer} 532 ${y}`});}
  scene.edges.push(edge('compensate','store','queue',[p(875,320),p(875,485),p(125,485),p(125,320)],'보상 · 외부 회귀',{color:3,dash:true,labelAt:p(500,473)}));
 }else if(mode==='containers'){
  scene.regions=[{x:40,y:55,w:400,h:410,name:'테넌트 A'},{x:560,y:55,w:400,h:410,name:'테넌트 B'}];
  scene.nodes=[node('a1','주문 API',80,110,140),node('a2','감사 서비스',80,310,140),node('b1','처리 서비스',780,110,140),node('b2','감사 저장소',780,310,140)];
  for(let i=0;i<2;i++){const y=i?350:150,gate=value+(i?20:-20),inner=i?330:300,right=i?670:700;scene.edges.push(edge('gateway-'+i,i?'a2':'a1',i?'b2':'b1',[p(220,y),p(inner,y),p(inner,gate),p(440,gate),p(560,gate),p(right,gate),p(right,y),p(780,y)],i?'감사 통과':'업무 통과',{color:i,dash:!!i,labelAt:p(500,gate-10)}));}
  scene.metadata={...scene.metadata,gateways:[value-20,value+20]};
 }else if(mode==='bundle'){
  scene.nodes=Array.from({length:4},(_,i)=>[node('s'+i,['주문','결제','감사','승인'][i],45,55+i*110,150,70),node('t'+i,['처리','알림','보관','분석'][i],805,55+i*110,150,70)]).flat();
  for(let i=0;i<4;i++)for(let j=0;j<2;j++){const target=Math.floor(i/2)*2+(i+j)%2,sy=90+i*110+(j?6:-6),ty=90+target*110+(j?6:-6),beta=value/100,waist=i<2?145:365;scene.edges.push({...edge('bundle-'+i+'-'+j,'s'+i,'t'+target,[p(195,sy),p(805,ty)],(i<2?'이벤트':'명령')+' '+(i+1)+'·'+(j+1),{color:i<2?0:1,labelAt:p(470+j*80,lerp((sy+ty)/2,waist,beta)+(j?14:-14))}),d:`M195 ${sy} C${195+610*.35} ${lerp(lerp(sy,ty,.35),waist,beta)} ${195+610*.65} ${lerp(lerp(sy,ty,.65),waist,beta)} 805 ${ty}`});}
  scene.metadata={...scene.metadata,beta:value/100,compatibilityGroups:2};
 }else if(mode==='bus'){
  const subscribers=Math.round(value);scene.nodes=[node('publisher','이벤트 발행',100,70,140,70),{...node('bus','방송 접점',500,260,0,0),kind:'junction'}];
  scene.edges=[edge('publish','publisher','bus',[p(170,140),p(170,260)],'공유 이벤트',{arrow:false,labelAt:p(250,220)}),edge('backbone','bus','bus',[p(170,260),p(830,260)],'브로드캐스트 백본',{width:4,arrow:false,labelAt:p(500,244)})];
  const positions=[[430,70],[760,70],[100,370],[430,370],[760,370]];
  positions.slice(0,subscribers).forEach(([x,y],i)=>{const top=y<260,id='subscriber-'+i;scene.nodes.push(node(id,'구독자 '+(i+1),x,y,140,70));scene.edges.push(edge('branch-'+i,'bus',id,[p(x+70,260),p(x+70,top?y+70:y)],'구독 '+(i+1),{labelAt:p(x+100,top?190:335)}));});
  scene.metadata={...scene.metadata,subscribers};scene.status=subscribers?'공유 이벤트가 모든 구독자에 전달되는 샘플입니다.':'구독자 없음 · 발행 이벤트를 받는 대상이 없습니다.';
 }else if(mode==='bridges'){
  scene.nodes=[node('left','업무 흐름',35,220,150),node('right','목적 서비스',815,220,150),node('top','감사 입력',value-70,35,140,70),node('bottom','감사 저장',value-70,415,140,70)];
  const horizontal=[p(185,260),p(815,260)],vertical=[p(value,105),p(value,415)];
  scene.edges=[edge('horizontal','left','right',horizontal,'업무 · 직진',{labelAt:p(300,245)}),{...edge('vertical','top','bottom',vertical,'감사 · 비접속 교차',{color:1,dash:true,labelAt:p(value+105,360)}),d:bridgePath(vertical,[horizontal])}];scene.metadata={...scene.metadata,crossing:segmentIntersection(...horizontal as [Point,Point],...vertical as [Point,Point])};
 }else if(mode==='ribbons'){
  const rows=ribbonDistribution(120,value);scene.nodes=[node('input','입력 120건/분',55,150,180,220),...['즉시 처리','수동 검토','보관 대기'].map((name,i)=>node('out'+i,name,805,40+i*160,150,120))];
  let top=200;scene.edges=rows.map((r,i)=>{const sy=top,ty=100+i*160-r.width/2;top+=r.width;return {id:r.id,source:'input',target:'out'+i,label:['즉시 처리','수동 검토','보관 대기'][i]+' '+r.value+'건/분',labelAt:p(500,(sy+ty)/2+r.width/2),value:r.value,width:r.width,color:i,fill:true,arrow:false,d:`M235 ${sy} C450 ${sy} 590 ${ty} 805 ${ty} L805 ${ty+r.width} C590 ${ty+r.width} 450 ${sy+r.width} 235 ${sy+r.width} Z`};});scene.metadata={...scene.metadata,input:120,output:rows.reduce((s,r)=>s+r.value,0),values:rows.map(r=>r.value)};scene.status='입력 120건/분 = 출력 '+rows.map(r=>r.value).join(' + ')+'건/분 · 샘플 데이터';
 }else if(mode==='radial'){
  const matrix=[[0,Math.round(value),16,0],[6,0,18,8],[12,4,0,10],[14,0,6,0]],layout=radialLayout(matrix),names=['API','워커','저장소','분석'];
  scene.arcs=layout.arcs.map((a,i)=>({d:sector(a.start,a.end,192,180),color:i}));
  scene.nodes=layout.arcs.map((a,i)=>{const q=polar((a.start+a.end)/2,224);return node('radial'+i,names[i],q.x-45,q.y-20,90,40);});
  scene.edges=layout.ribbons.map((r,i)=>{const a=polar(r.sourceStart,176),b=polar(r.sourceEnd,176),c=polar(r.targetStart,167),d=polar(r.targetEnd,167),tip=polar((r.targetStart+r.targetEnd)/2,178);return {id:'exchange-'+i,source:'radial'+r.source,target:'radial'+r.target,d:`M${a.x} ${a.y} A176 176 0 0 1 ${b.x} ${b.y} Q500 260 ${c.x} ${c.y} L${tip.x} ${tip.y} L${d.x} ${d.y} Q500 260 ${a.x} ${a.y} Z`,label:names[r.source]+' → '+names[r.target]+' '+r.value+'건',labelAt:p(500,260),value:r.value,fill:true,arrow:false,color:r.source};});
  scene.metadata={...scene.metadata,matrix,total:layout.total};scene.status='방향별 교환 합계 '+layout.total+'건 · 호의 넓이는 유입+유출 · 샘플 데이터';
 }
 if(example.index>10)return buildConnectorVariant(mode,value);
 return scene;
}

export type ConnectorSelection={kind:'edge'|'node';id:string}|null;
export function reconcileConnectorSelection(scene:ConnectorScene,selected:ConnectorSelection):ConnectorSelection{
 if(!selected)return null;return (selected.kind==='edge'?scene.edges:scene.nodes).some(item=>item.id===selected.id)?selected:null;
}
