import React,{useState} from 'react';
import {ChartShowcase,useKlicChartTone} from '../charts/ChartShowcase';
import {CorrelationMatrix,createCorrelationDemo} from '../charts/bjork/correlation-matrix';
import {CohortRetention,type RetentionCohort} from '../charts/bjork/cohort-retention';
import {CalendarHeatmap,type CalendarDatum} from '../charts/bjork/calendar-heatmap';
import {FunnelChart} from '../charts/bjork/funnel-chart';
import {BulletChart,type BulletRow} from '../charts/bjork/bullet-chart';
const correlation=createCorrelationDemo(341);
const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'];
const cohorts:RetentionCohort[]=months.map((month,r)=>{const size=840+(r*173)%910;return {id:month,label:`2025년 ${r+1}월`,size,values:Array.from({length:11-r},(_,p)=>p===0?size:Math.round(size*Math.max(.12,.72-p*.045+(r%3)*.018+Math.sin(r+p)*.015)))};});
const calendar:CalendarDatum[]=Array.from({length:365},(_,i)=>{const d=new Date(Date.UTC(2025,0,1+i));const weekend=[0,6].includes(d.getUTCDay());return {date:d.toISOString().slice(0,10),value:(i%19===0||i%23===0)?0:Math.round((weekend?7:25)+(Math.sin(i/17)+1)*12+(i*13)%31)};});
const funnel=[{id:'visit',label:"웹사이트 방문",value:48260},{id:'product',label:"제품 탐색",value:29640},{id:'signup',label:"계정 생성",value:14320},{id:'activate',label:"워크스페이스 활성화",value:9860},{id:'invite',label:"팀 초대",value:6420},{id:'paid',label:"유료 구독",value:3890}];
const previous={visit:44800,product:28240,signup:12100,activate:8710,invite:5880,paid:3240};
const bulletRows:BulletRow[]=[{id:'revenue',label:"정기 매출",sublabel:"월별 · 천 달러",value:284,target:320,projected:334,ranges:[180,260,360],max:400},{id:'activation',label:"활성화율",sublabel:"신규 워크스페이스 · %",value:74,target:80,projected:82,ranges:[50,70,90],max:100},{id:'retention',label:"순매출 유지율",sublabel:"최근 분기 · %",value:112,target:110,ranges:[90,100,120],max:130},{id:'latency',label:"응답 지연 시간",sublabel:"95백분위 · ms · 낮을수록 좋음",value:186,target:200,projected:178,ranges:[150,200,300],max:350,better:'lower'},{id:'resolution',label:"문제 해결 시간",sublabel:"고객 지원 · 시간 · 낮을수록 좋음",value:5.8,target:4,projected:4.7,ranges:[3,5,8],max:10,better:'lower'},{id:'satisfaction',label:"고객 만족도",sublabel:"문제 해결 후 · 100점 만점",value:92,target:90,ranges:[65,80,95],max:100}];
export function MatrixChartsBlock({variant,density}:{variant:'correlation'|'cohort'|'calendar'|'funnel'|'bullet';density?:string}){
 const tone=useKlicChartTone();const [order,setOrder]=useState<'input'|'cluster'>('cluster'),[triangle,setTriangle]=useState<'lower'|'full'>('lower'),[display,setDisplay]=useState<'percent'|'count'>('percent'),[calendarScale,setCalendarScale]=useState<'quantile'|'linear'>('quantile'),[weekStart,setWeekStart]=useState<'monday'|'sunday'>('monday'),[selectedDate,setSelectedDate]=useState('2025-09-17'),[compare,setCompare]=useState(true),[worst,setWorst]=useState(true),[scale,setScale]=useState<'row'|'target'|'shared'>('row'),[projection,setProjection]=useState(true);
 let title='',subtitle='',reference='',controls:React.ReactNode,chart:React.ReactNode;
 if(variant==='correlation'){
  title="자산 간 상관관계";subtitle="자산 12개 · 고정된 요인 모형 · 상관계수 −1~+1";reference='correlation-matrix';
  controls=<><label>정렬 <select value={order} onChange={e=>setOrder(e.target.value as typeof order)}><option value="cluster">군집순</option><option value="input">입력 순서</option></select></label><label>행렬 <select value={triangle} onChange={e=>setTriangle(e.target.value as typeof triangle)}><option value="lower">하삼각 행렬</option><option value="full">전체 행렬</option></select></label></>;
  chart=<div style={{width:'100%',maxWidth:420,margin:'0 auto'}}><CorrelationMatrix {...correlation} order={order} onOrderChange={setOrder} triangle={triangle} tone={tone} ariaLabel="가상 자산 12개의 상관관계 행렬. 방향키로 셀을 탐색할 수 있습니다."/></div>;
 }else if(variant==='cohort'){
  title="고객 유지율";subtitle="가입 코호트 10개 · 월별 11개 기간 · 규모 가중 평균";reference='cohort-retention';
  controls=<label>셀 표시값 <select value={display} onChange={e=>setDisplay(e.target.value as typeof display)}><option value="percent">유지율</option><option value="count">활성 고객 수</option></select></label>;
  chart=<CohortRetention cohorts={cohorts} display={display} height={420} periodTitle="가입 후 경과 개월" formatPeriod={(p,style)=>style==='short'?`${p}개월`:`${p}개월차`} averageLabel="전체 코호트" tone={tone}/>;
 }else if(variant==='calendar'){
  title="1년간의 활동";subtitle="2025년 · 일별 관측값 365개 · 날짜 선택 및 방향키 탐색";reference='calendar-heatmap';
  controls=<><label>색상 강도 <select value={calendarScale} onChange={e=>setCalendarScale(e.target.value as typeof calendarScale)}><option value="quantile">분위수</option><option value="linear">선형</option></select></label><label>주 시작 요일 <select value={weekStart} onChange={e=>setWeekStart(e.target.value as typeof weekStart)}><option value="monday">월요일</option><option value="sunday">일요일</option></select></label><label>선택 날짜 <input type="date" min="2025-01-01" max="2025-12-31" value={selectedDate} onChange={e=>{if(e.target.value>='2025-01-01'&&e.target.value<='2025-12-31')setSelectedDate(e.target.value);}}/></label></>;
  chart=<div style={{minHeight:420,display:'flex',flexDirection:'column',justifyContent:'center'}}><CalendarHeatmap data={calendar} start="2025-01-01" end="2025-12-31" scale={calendarScale} weekStart={weekStart} steps={6} maxCell={24} activeDate={selectedDate} onSelect={setSelectedDate} unit={{one:"건",other:"건"}} tone={tone}/><p role="status" style={{fontSize:12,marginTop:20}}>선택 {selectedDate}: {calendar.find(d=>d.date===selectedDate)?.value??0}  건</p></div>;
 }else if(variant==='funnel'){
  title="첫 방문에서 유료 구독까지";subtitle="가상 고객 전환 여정 · 이번 달과 지난달 비교";reference='funnel-chart';
  controls=<><label><input type="checkbox" checked={compare} onChange={e=>setCompare(e.target.checked)}/>  지난달과 비교</label><label><input type="checkbox" checked={worst} onChange={e=>setWorst(e.target.checked)}/>  전환 이탈이 가장 큰 단계 강조</label></>;
  chart=<FunnelChart steps={funnel} previous={compare?previous:null} previousLabel="지난달" highlightWorst={worst} worstLabel="최대 이탈" valueLabel="고객 수" height={420} tone={tone}/>;
 }else{
  title="계획 대비 실적";subtitle="운영 지표 6개 · 수준 구간, 목표 및 예상 실적";reference='bullet-chart';
  controls=<><label>척도 <select value={scale} onChange={e=>setScale(e.target.value as typeof scale)}><option value="row">지표별 단위</option><option value="target">목표 대비 비율</option></select></label><label><input type="checkbox" checked={projection} onChange={e=>setProjection(e.target.checked)}/>  예상 실적 표시</label></>;
  chart=<BulletChart rows={projection?bulletRows:bulletRows.map(({projected,...row})=>row)} scale={scale} rowHeight={60} attainment="auto" tone={tone}/>;
 }
 return <ChartShowcase title={title} subtitle={subtitle} reference={reference} controls={controls} density={density}>{chart}</ChartShowcase>;
}
