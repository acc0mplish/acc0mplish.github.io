import React,{useMemo,useState} from 'react';
import {ChartShowcase,useKlicChartTone} from '../charts/ChartShowcase';
import {WaterfallChart,type WaterfallStep} from '../charts/bjork/waterfall-chart';
import {Treemap,type TreeNode} from '../charts/bjork/treemap';
import {Streamgraph,createGenreSeries,type StreamOffset} from '../charts/bjork/streamgraph';
import {StackedAreaChart,type AreaSeries,type StackedAreaMode} from '../charts/bjork/stacked-area-chart';
import {GroupedBarChart,type BarCategory,type BarSeries,type BarMode,type BarOrientation} from '../charts/bjork/grouped-bar-chart';
import {DumbbellChart,type DumbbellRow,type DumbbellSort} from '../charts/bjork/dumbbell-chart';
import {mulberry32} from '../charts/bjork/_core/random';
import type {BjorkTone} from '../charts/bjork/_core/palette';

export type CompositionChartVariant='waterfall'|'treemap'|'streamgraph'|'stacked-area'|'grouped-bar'|'dumbbell';
export interface CompositionChartsBlockProps {variant:CompositionChartVariant;density?:string;}
interface DemoProps {tone:BjorkTone;density?:string;}
const reference=(name:string)=>name;
const count=(value:number)=>value.toLocaleString('ko-KR',{maximumFractionDigits:0});
const percent=(value:number)=>value.toLocaleString('ko-KR',{maximumFractionDigits:1})+'%';
const money=(value:number)=>count(value)+'만원';
const dateText=(value:number)=>new Date(value).toLocaleDateString('ko-KR',{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'});
const controlStyle:React.CSSProperties={color:'var(--klic-component-block-color-text)',borderColor:'var(--klic-component-block-color-border)',background:'var(--klic-component-block-color-panel)',outlineColor:'var(--klic-component-block-color-accent)'};
const controlClass='rounded-md border px-2.5 py-1.5 text-[11px] leading-4 focus-visible:outline-2 focus-visible:outline-offset-2';
function Choice<T extends string>({label,value,options,onChange}:{label:string;value:T;options:readonly {value:NoInfer<T>;label:string}[];onChange:(value:T)=>void}){
 return <label className="inline-flex items-center gap-2 text-[11px]" style={{color:'var(--klic-component-block-color-muted)'}}><span>{label}</span><select value={value} onChange={event=>onChange(event.target.value as T)} className={controlClass} style={controlStyle}>{options.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}
function Toggle({label,value,onChange}:{label:string;value:boolean;onChange:(value:boolean)=>void}){
 return <label className="inline-flex cursor-pointer items-center gap-2 text-[11px]" style={{color:'var(--klic-component-block-color-muted)'}}><input type="checkbox" checked={value} onChange={event=>onChange(event.target.checked)} style={{accentColor:'var(--klic-component-block-color-accent)'}}/>{label}</label>;
}
function Action({children,onClick,disabled=false}:{children:React.ReactNode;onClick:()=>void;disabled?:boolean}){
 return <button type="button" className={controlClass+' disabled:cursor-default disabled:opacity-40'} style={controlStyle} onClick={onClick} disabled={disabled}>{children}</button>;
}

const ARR_STEPS:Record<'q3'|'q4',WaterfallStep[]>={
 q3:[{id:'new',label:'신규 계약',value:640},{id:'expansion',label:'기존 확장',value:285},{id:'pricing',label:'가격 조정',value:95},{id:'churn',label:'계약 해지',value:-220},{id:'contraction',label:'사용 축소',value:-115},{id:'operating',label:'영업 소계',value:0,kind:'total'},{id:'fx',label:'환율 영향',value:-84},{id:'recovery',label:'휴면 복귀',value:142},{id:'adjustment',label:'정산 조정',value:-38}],
 q4:[{id:'new',label:'신규 계약',value:810},{id:'expansion',label:'기존 확장',value:360},{id:'pricing',label:'가격 조정',value:120},{id:'churn',label:'계약 해지',value:-175},{id:'contraction',label:'사용 축소',value:-96},{id:'operating',label:'영업 소계',value:0,kind:'total'},{id:'fx',label:'환율 영향',value:42},{id:'recovery',label:'휴면 복귀',value:186},{id:'adjustment',label:'정산 조정',value:-62}],
};
const ARR_START={q3:{label:'분기 초 ARR',value:4260},q4:{label:'분기 초 ARR',value:4965}};
const ARR_TARGET={q3:{label:'분기 목표',value:5400},q4:{label:'분기 목표',value:6400}};
function WaterfallDemo({tone,density}:DemoProps){
 const [quarter,setQuarter]=useState<'q3'|'q4'>('q3'),[ghost,setGhost]=useState(true);
 return <ChartShowcase title="분기 ARR 브리지" subtitle="신규·확장·해지의 누적 기여와 영업 소계 · 합성 재무 데이터, 단위 만원" reference={reference('waterfall-chart')} density={density} controls={<><Choice<'q3'|'q4'> label="분기" value={quarter} onChange={setQuarter} options={[{value:'q3',label:'2026년 3분기'},{value:'q4',label:'2026년 4분기'}]}/><Toggle label="목표 비교" value={ghost} onChange={setGhost}/></>}>
  <WaterfallChart steps={ARR_STEPS[quarter]} start={ARR_START[quarter]} endLabel="분기 말 ARR" ghost={ghost?ARR_TARGET[quarter]:null} formatValue={money} height={420} tone={tone} ariaLabel={'2026년 '+(quarter==='q3'?'3분기':'4분기')+' ARR 워터폴, 단위 만원. 시작 총량·증감·영업 소계·최종 총량·목표 비교'}/>
 </ChartShowcase>;
}

/** Five sectors, 47 visible workloads and regional children keep the opening map dense. */
function createCloudTree():TreeNode{
 const random=mulberry32(711),leaf=(id:string,label:string,base:number):TreeNode=>({id,label,value:Math.round(base*(.72+random()*.65)),change:(random()-.48)*.18});
 const branch=(id:string,label:string,items:readonly [string,number][]):TreeNode=>({id,label,children:items.map(([name,value],index)=>leaf(id+'-'+index,name,value))});
 const tree:TreeNode={id:'cloud',label:'월간 클라우드 지출',children:[
  {id:'compute',label:'컴퓨팅',children:[branch('prod','프로덕션',[['API 클러스터',6400],['워크플로 워커',3800],['검색 노드',2600],['실시간 처리',2100]]),branch('staging','개발·스테이징',[['통합 테스트',1400],['개발 샌드박스',980],['성능 테스트',720]]),branch('batch','배치 작업',[['데이터 변환',1900],['정기 리포트',1100],['모델 추론',1700]])]},
  {id:'database',label:'데이터베이스',children:[branch('sql','관계형',[['주문 DB',3800],['결제 DB',2800],['분석 DB',3200],['읽기 복제본',1500]]),branch('cache','캐시·검색',[['세션 캐시',1100],['상품 캐시',900],['검색 인덱스',1700]]),branch('warehouse','웨어하우스',[['운영 분석',2400],['제품 분석',1800],['장기 보관',850]])]},
  {id:'storage',label:'스토리지',children:[branch('objects','오브젝트',[['고객 문서',2200],['미디어 원본',1700],['데이터 레이크',1450]]),branch('volumes','볼륨',[['고성능 SSD',1300],['일반 볼륨',760],['공유 파일',480]]),branch('backups','백업',[['일일 스냅샷',820],['교차 리전',630],['장기 아카이브',340]])]},
  {id:'network',label:'네트워크',children:[branch('delivery','콘텐츠 전송',[['아시아 CDN',1800],['북미 CDN',1200],['유럽 CDN',940]]),branch('traffic','트래픽',[['외부 전송',1500],['리전 간 전송',840],['로드밸런서',680]]),branch('connect','연결',[['전용 회선',760],['게이트웨이',590],['DNS',210]])]},
  {id:'operations',label:'운영·보안',children:[branch('observe','관측 도구',[['로그 수집',1280],['메트릭',880],['분산 추적',670]]),branch('secure','보안',[['위협 탐지',720],['키 관리',380],['접근 감사',420]]),branch('platform','플랫폼 도구',[['컨테이너 제어',840],['배포 파이프라인',560],['이미지 저장소',290]])]},
 ]};
 for(const sector of tree.children??[])sector.children=(sector.children??[]).flatMap(service=>service.children??[]).map(workload=>{
  if((workload.value??0)<=2500)return workload;
  const total=workload.value!,seoul=Math.round(total*.6),tokyo=Math.round(total*.25);
  return {...workload,children:[{id:workload.id+'-kr',label:'서울 리전',value:seoul,change:workload.change},{id:workload.id+'-jp',label:'도쿄 리전',value:tokyo,change:workload.change},{id:workload.id+'-sg',label:'싱가포르 리전',value:total-seoul-tokyo,change:workload.change}]};
 });
 return tree;
}
const CLOUD_TREE=createCloudTree();
function TreemapDemo({tone,density}:DemoProps){
 const [rootId,setRootId]=useState(CLOUD_TREE.id),[colorBy,setColorBy]=useState<'change'|'value'>('change');
 return <ChartShowcase title="클라우드 비용의 계층" subtitle="5개 분류 · 47개 워크로드 · 주요 워크로드는 리전까지 확대 · 합성 비용 데이터" reference={reference('treemap')} density={density} controls={<><Choice<'change'|'value'> label="색상 기준" value={colorBy} onChange={setColorBy} options={[{value:'change',label:'전월 대비 증감'},{value:'value',label:'비용 규모'}]}/><Action disabled={rootId===CLOUD_TREE.id} onClick={()=>setRootId(CLOUD_TREE.id)}>전체로 돌아가기</Action></>}>
  <Treemap data={CLOUD_TREE} rootId={rootId} onRootChange={setRootId} colorBy={colorBy} changeScale={.09} formatValue={money} formatChange={value=>(value>0?'+':'')+percent(value*100)} height={430} tone={tone} ariaLabel="클라우드 비용 트리맵. 면적은 만원 단위 비용. 분류를 클릭하거나 Enter로 확대하고 탐색 경로 또는 Escape로 돌아갑니다."/>
 </ChartShowcase>;
}

const GENRE_MONTHS=120;
const GENRES=createGenreSeries(42,GENRE_MONTHS);
const GENRE_X=Array.from({length:GENRE_MONTHS},(_,index)=>String(2016+Math.floor(index/12))+'.'+String(index%12+1).padStart(2,'0'));
function StreamgraphDemo({tone,density}:DemoProps){
 const [offset,setOffset]=useState<StreamOffset>('wiggle'),[highlight,setHighlight]=useState<string|null>(null),[maxSeries,setMaxSeries]=useState('6'),[cursor,setCursor]=useState<number|null>(null);
 return <ChartShowcase title="시간이 만든 청취의 흐름" subtitle="120개월 · 여덟 장르의 계절성·추세 · 합성 월간 청취 시간" reference={reference('streamgraph')} density={density} controls={<><Choice<StreamOffset> label="기준선" value={offset} onChange={setOffset} options={[{value:'wiggle',label:"기울기 최소화"},{value:'zero',label:'0 기준 누적'},{value:'expand',label:'100% 구성'}]}/><Choice label="계열" value={maxSeries} onChange={setMaxSeries} options={[{value:'6',label:'6개 · 나머지 묶기'},{value:'5',label:'5개 · 나머지 묶기'},{value:'4',label:'4개 · 나머지 묶기'}]}/><Choice label="강조" value={highlight??''} onChange={value=>setHighlight(value||null)} options={[{value:'',label:'모든 장르'},...GENRES.map(series=>({value:series.id,label:series.label})),{value:'__other',label:'기타 장르'}]}/><label className="inline-flex items-center gap-2 text-[11px]" style={{color:'var(--klic-component-block-color-muted)'}}><span>시점</span><input aria-label="스트림그래프 상세 시점" type="range" min="0" max={GENRE_MONTHS-1} value={cursor??GENRE_MONTHS-1} onChange={event=>setCursor(Number(event.target.value))} style={{width:90,accentColor:'var(--klic-component-block-color-accent)'}}/><span className="font-mono">{cursor===null?'직접 탐색':GENRE_X[cursor]}</span></label><Action onClick={()=>{setHighlight(null);setCursor(null);}}>강조 해제</Action></>}>
  <Streamgraph series={GENRES} x={GENRE_X} offset={offset} maxSeries={Number(maxSeries)} otherLabel="기타" highlightId={highlight} onHighlightChange={setHighlight} index={cursor} formatValue={value=>value.toLocaleString('ko-KR',{maximumFractionDigits:1})+'시간'} height={420} tone={tone} ariaLabel="장르별 월간 청취 시간 스트림그래프. 가중 기울기를 최소화한 기준선입니다. 방향키로 시점·레이어 이동, Enter로 강조 고정."/>
 </ChartShowcase>;
}

const DAY=86400000;
const ACTIVE_TIMES=Array.from({length:160},(_,index)=>Date.UTC(2026,4,1)+index*DAY);
function createActiveUsers():AreaSeries[]{
 const random=mulberry32(2036);
 const channels=[{id:'web',label:'웹',base:1420,growth:3.8,phase:.4},{id:'ios',label:'iOS',base:1020,growth:5.1,phase:1.4},{id:'android',label:'Android',base:880,growth:4.7,phase:2.3},{id:'desktop',label:'데스크톱',base:680,growth:1.5,phase:3.4},{id:'partner',label:'파트너 포털',base:420,growth:2.4,phase:4.1}];
 return channels.map(channel=>{
  let noise=0;
  return {id:channel.id,label:channel.label,values:ACTIVE_TIMES.map((_,index)=>{
   noise=noise*.72+(random()-.5)*channel.base*.095;
   const weekly=1+Math.sin(index*2*Math.PI/7+channel.phase)*.13;
   const seasonal=1+Math.sin(index/19+channel.phase)*.16;
   const launch=channel.base*.24*Math.exp(-Math.pow((index-(58+channel.phase*11))/21,2));
   const campaign=channel.base*.13*Math.exp(-Math.pow((index-130)/14,2));
   return Math.max(0,Math.round((channel.base+channel.growth*index)*weekly*seasonal+noise+launch+campaign));
  })};
 });
}
const ACTIVE_SERIES=createActiveUsers();
const ACTIVE_DOMAIN:[number,number]=[ACTIVE_TIMES[0],ACTIVE_TIMES.at(-1)!];
function StackedAreaDemo({tone,density}:DemoProps){
 const [mode,setMode]=useState<StackedAreaMode>('stacked'),[range,setRange]=useState<[number,number]>(ACTIVE_DOMAIN),[hidden,setHidden]=useState<string[]>([]),[brush,setBrush]=useState(true);
 const preset=range[1]!==ACTIVE_DOMAIN[1]?'custom':range[0]===ACTIVE_DOMAIN[0]?'all':range[0]===ACTIVE_TIMES[70]?'90':range[0]===ACTIVE_TIMES[130]?'30':'custom';
 const changeWindow=(value:string)=>{if(value==='all')setRange(ACTIVE_DOMAIN);if(value==='90')setRange([ACTIVE_TIMES[70],ACTIVE_DOMAIN[1]]);if(value==='30')setRange([ACTIVE_TIMES[130],ACTIVE_DOMAIN[1]]);if(value==='custom')setBrush(true);};
 return <ChartShowcase title="채널별 일일 활성 사용자" subtitle="160일 · 5개 채널 · 사용자당 하루 첫 활동 채널에 한 번 배정한 합성 데이터" reference={reference('stacked-area-chart')} density={density} controls={<><Choice<StackedAreaMode> label="표현" value={mode} onChange={setMode} options={[{value:'stacked',label:'누적 면적'},{value:'percent',label:'100% 구성'},{value:'lines',label:'개별 선'}]}/><Choice label="기간" value={preset} onChange={changeWindow} options={[{value:'all',label:'전체 160일'},{value:'90',label:'최근 90일'},{value:'30',label:'최근 30일'},{value:'custom',label:'브러시로 지정'}]}/><Toggle label="미니맵·브러시" value={brush} onChange={setBrush}/><Action onClick={()=>{setRange(ACTIVE_DOMAIN);setHidden([]);}}>전체 복원</Action></>}>
  <StackedAreaChart times={ACTIVE_TIMES} series={ACTIVE_SERIES} mode={mode} range={range} onRangeChange={setRange} hidden={hidden} onHiddenChange={setHidden} brush={brush} formatValue={value=>count(value)+'명'} formatTime={dateText} tableAggregate="mean" height={430} tone={tone} ariaLabel="채널별 일일 활성 사용자. 단위 명. 범례로 계열 전환, 본문 드래그와 미니맵으로 기간 이동·확대, 방향키와 Page Up/Down으로 시점 탐색. 120일 초과 표는 일평균으로 집계합니다."/>
 </ChartShowcase>;
}

const CLOUD_CATEGORIES:BarCategory[]=[{id:'compute',label:'컴퓨팅'},{id:'database',label:'관리형 DB'},{id:'storage',label:'스토리지'},{id:'network',label:'네트워크'},{id:'container',label:'컨테이너'},{id:'observe',label:'관측 도구'},{id:'ai',label:'AI·추론'},{id:'security',label:'보안'}];
const CLOUD_SERIES:BarSeries[]=[
 {id:'production',label:'프로덕션',values:[8420,6390,3580,2860,4210,1980,3460,1670]},
 {id:'staging',label:'스테이징',values:[2530,1920,1070,860,1260,590,1040,500]},
 {id:'development',label:'개발',values:[1870,1360,820,630,940,420,760,360]},
];
function GroupedBarDemo({tone,density}:DemoProps){
 const [mode,setMode]=useState<BarMode>('grouped'),[orientation,setOrientation]=useState<BarOrientation>('auto'),[showValues,setShowValues]=useState(false),[hidden,setHidden]=useState<string[]>([]);
 return <ChartShowcase title="환경별 클라우드 비용" subtitle="8개 서비스 · 프로덕션·스테이징·개발 비용의 실제 구성 · 합성 데이터, 단위 만원" reference={reference('grouped-bar-chart')} density={density} controls={<><Choice<BarMode> label="표현" value={mode} onChange={setMode} options={[{value:'grouped',label:'나란히 비교'},{value:'stacked',label:'누적 비교'},{value:'percent',label:'100% 구성'}]}/><Choice<BarOrientation> label="방향" value={orientation} onChange={setOrientation} options={[{value:'auto',label:'자동'},{value:'vertical',label:'세로'},{value:'horizontal',label:'가로'}]}/><Toggle label="값 표시" value={showValues} onChange={setShowValues}/><Action disabled={!hidden.length} onClick={()=>setHidden([])}>전체 계열</Action></>}>
  <GroupedBarChart categories={CLOUD_CATEGORIES} series={CLOUD_SERIES} mode={mode} orientation={orientation} hidden={hidden} onHiddenChange={setHidden} showValues={showValues} showTotals legend formatValue={money} height={420} tone={tone} ariaLabel="서비스별 클라우드 비용. 만원 단위 합성 데이터. 프로덕션·스테이징·개발은 중복 없는 환경별 실제 비용이며 누적 합계가 해당 서비스의 총지출입니다."/>
 </ChartShowcase>;
}

const ADOPTION_ROWS:DumbbellRow[]=[
 {id:'workflow',label:'워크플로',a:28,b:59},{id:'dashboard',label:'대시보드',a:54,b:72},{id:'export',label:'데이터 내보내기',a:71,b:84},
 {id:'automation',label:'자동화',a:19,b:46},{id:'alerts',label:'알림 규칙',a:42,b:35},{id:'access',label:'접근 권한',a:62,b:78},
 {id:'templates',label:'공유 템플릿',a:33,b:57},{id:'integration',label:'외부 연동',a:24,b:51},{id:'audit',label:'감사 로그',a:46,b:63},
 {id:'schedule',label:'예약 실행',a:38,b:44},{id:'comments',label:'공동 검토',a:58,b:52},{id:'reports',label:'맞춤 리포트',a:16,b:39},
];
function DumbbellDemo({tone,density}:DemoProps){
 const [sort,setSort]=useState<DumbbellSort>('gap');
 const labels=useMemo<[string,string]>(()=>['2026년 4월','2026년 10월'],[]);
 return <ChartShowcase title="핵심 기능의 도입률 변화" subtitle="12개 기능 · 두 시점 모두 같은 0–100% 축 · 월간 활성 계정의 합성 사용 비율" reference={reference('dumbbell-chart')} density={density} controls={<Choice<DumbbellSort> label="정렬" value={sort} onChange={setSort} options={[{value:'gap',label:'증가 폭순'},{value:'b',label:'현재 도입률순'},{value:'a',label:'이전 도입률순'},{value:'label',label:'기능 이름순'}]}/>}>
  <DumbbellChart rows={ADOPTION_ROWS} labels={labels} sort={sort} onSortChange={setSort} domain={[0,100]} formatValue={percent} formatGap={gap=>(gap>0?'+':'')+gap.toFixed(0)+"%p"} rowHeight={32} tone={tone} ariaLabel="12개 핵심 기능의 4월·10월 도입률 덤벨 차트. 같은 가로 0–100% 축에서 빈 원은 4월, 채운 원은 10월입니다. 방향키로 행을 탐색하고 S로 정렬합니다."/>
 </ChartShowcase>;
}

/** Full chart engines retain native canvas geometry, tooltip, keyboard and table twins. */
export function CompositionChartsBlock({variant,density='normal'}:CompositionChartsBlockProps){
 const tone=useKlicChartTone(),props={tone,density};
 return <div className="w-full min-w-0" data-composition-chart={variant} data-density={density}>{variant==='waterfall'?<WaterfallDemo {...props}/>:variant==='treemap'?<TreemapDemo {...props}/>:variant==='streamgraph'?<StreamgraphDemo {...props}/>:variant==='stacked-area'?<StackedAreaDemo {...props}/>:variant==='grouped-bar'?<GroupedBarDemo {...props}/>:<DumbbellDemo {...props}/>}</div>;
}
