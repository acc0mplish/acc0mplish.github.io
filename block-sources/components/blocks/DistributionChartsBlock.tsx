import React,{useState} from 'react';
import {ChartShowcase,useKlicChartTone} from '../charts/ChartShowcase';
import {DistributionPlot,createDistributionSample,type DistributionMarker} from '../charts/bjork/distribution-plot';
import {ViolinPlot,createRegionGroups,type ViolinMode} from '../charts/bjork/violin-plot';
import {Beeswarm,createSwarmItems} from '../charts/bjork/beeswarm';
import {ScatterBrush,createScatterCloud,type Brush} from '../charts/bjork/scatter-brush';
import {CalibrationPlot,createForecasts} from '../charts/bjork/calibration-plot';

type Variant='distribution'|'violin'|'beeswarm'|'scatter'|'calibration';
const LATENCY=createDistributionSample(42,'latency',2000);
const BIMODAL=createDistributionSample(42,'bimodal',2000);
const REGIONS=createRegionGroups(42);
const DEALS=createSwarmItems(42,'deals',280);
const CLOUD=createScatterCloud(42,1500);
const FORECASTS=createForecasts(42,3000,false);
const RECALIBRATED=createForecasts(42,3000,true);
const MARKERS:DistributionMarker[]=['p50','p95','p99','mean'];
const TITLES:Record<Variant,string>={distribution:"응답 시간 분포",violin:"리전별 응답 시간",beeswarm:"하나의 척도로 보는 모든 거래",scatter:"세션 분포 탐색",calibration:"예측 확률은 얼마나 정확할까요?"};
const SUBTITLES:Record<Variant,string>={distribution:"고정 시드 관측값 2,000개 · 밀도 곡선, 백분위 표시, 드래그 가능한 꼬리 임계값",violin:"5개 리전의 분포 · 공통 밀도 척도, 사분위수 및 개별 관측값",beeswarm:"고정 시드 거래 280건 · 정확한 수치, 점 겹침 방지 및 키보드 선택",scatter:"고정 시드 세션 1,500개 · 사각형 영역 선택, 주변 분포 및 선택 영역 회귀선",calibration:"고정 시드 이진 결과 3,000개 · 신뢰도 곡선, 윌슨 구간 및 예측 히스토그램"};
export function DistributionChartsBlock({variant,density='normal'}:{variant:Variant;density?:'compact'|'normal'|'relaxed'}){
 const tone=useKlicChartTone();
 const [sample,setSample]=useState<'latency'|'bimodal'>('latency'),[bins,setBins]=useState(24),[threshold,setThreshold]=useState(250),[tail,setTail]=useState<'above'|'below'>('above'),[showDensity,setShowDensity]=useState(true),[mode,setMode]=useState<ViolinMode>('violin'),[highlight,setHighlight]=useState<string|null>(null),[scale,setScale]=useState<'linear'|'log'>('log'),[selected,setSelected]=useState<string|null>(null),[brush,setBrush]=useState<Brush|null>(null),[selectedCount,setSelectedCount]=useState(CLOUD.length),[trend,setTrend]=useState(true),[marginals,setMarginals]=useState(true),[calBins,setCalBins]=useState(10),[recalibrated,setRecalibrated]=useState(false),[histogram,setHistogram]=useState(true);
 const values=sample==='latency'?LATENCY:BIMODAL;
 const checkbox=(label:string,checked:boolean,change:(v:boolean)=>void)=><label><input type="checkbox" checked={checked} onChange={e=>change(e.target.checked)}/> {label}</label>;
 let controls:React.ReactNode,plot:React.ReactNode,summary:React.ReactNode;
 if(variant==='distribution'){
  controls=<><label>표본 <select value={sample} onChange={e=>setSample(e.target.value as 'latency'|'bimodal')}><option value="latency">응답 지연 시간</option><option value="bimodal">두 군집</option></select></label><label>구간 수 <input type="range" min={12} max={48} value={bins} onChange={e=>setBins(Number(e.target.value))}/><output>{bins}</output></label><label>꼬리 영역 <select value={tail} onChange={e=>setTail(e.target.value as 'above'|'below')}><option value="above">임계값 초과</option><option value="below">임계값 이하</option></select></label>{checkbox("밀도 곡선",showDensity,setShowDensity)}</>;
  plot=<DistributionPlot values={values} bins={bins} onBinsChange={setBins} threshold={threshold} onThresholdChange={setThreshold} tail={tail} markers={MARKERS} showDensity={showDensity} height={420} unit="ms" tone={tone} attract={false} ariaLabel="드래그 가능한 임계값과 백분위 표시가 있는 가상 응답 시간 분포"/>;
  const n=values.filter(v=>tail==='above'?v>threshold:v<=threshold).length;
  summary=`임계값 ${threshold.toFixed(1)} ms · 전체 ${values.length.toLocaleString()}개 중 ${n.toLocaleString()}개가 ${tail === "above" ? "임계값 초과" : "임계값 이하"} (${(100*n/values.length).toFixed(1)}%). 임계값을 드래그하거나 차트에 초점을 두고 키보드로 조절하세요.`;
 }else if(variant==='violin'){
  controls=<><label>표현 방식 <select value={mode} onChange={e=>setMode(e.target.value as ViolinMode)}><option value="violin">바이올린 밀도</option><option value="box">상자 수염</option><option value="strip">개별 관측값</option></select></label><label>강조 <select value={highlight??''} onChange={e=>setHighlight(e.target.value||null)}><option value="">모든 리전</option>{REGIONS.map(g=><option key={g.id} value={g.id}>{g.label}</option>)}</select></label></>;
  plot=<ViolinPlot groups={REGIONS} mode={mode} onModeChange={setMode} highlightId={highlight} onHighlightChange={setHighlight} unit="ms" height={420} tone={tone} attract={false} ariaLabel="가상 리전별 응답 시간. 바이올린·상자·점 분포 보기"/>;
  summary=`${REGIONS.find(g=>g.id===highlight)?.label??"전체 5개 리전"} · ${{violin:"바이올린",box:"상자 수염",strip:"점 분포"}[mode]} 보기. 마우스를 올리거나 키보드로 보간 사분위수와 그룹별 관측값을 확인하세요.`;
 }else if(variant==='beeswarm'){
  controls=<><label>값 척도 <select value={scale} onChange={e=>setScale(e.target.value as 'linear'|'log')}><option value="log">로그</option><option value="linear">선형</option></select></label><button type="button" onClick={()=>setSelected(null)}>관측값 선택 해제</button></>;
  plot=<Beeswarm items={DEALS} scale={scale} bands={[{to:12000,label:"소기업",style:'hatch'},{from:60000,label:"대기업",style:'accent'}]} highlightId={selected} onSelect={item=>setSelected(item.id)} formatValue={v=>`$${v.toLocaleString('ko-KR',{maximumFractionDigits:0})}`} radius={4} height={420} tone={tone} attract={false} ariaLabel="개별 관측값을 선택할 수 있는 가상 거래 규모 비즈웜 차트"/>;
  const item=DEALS.find(p=>p.id===selected);summary=item?`${item.label} · ${item.group} · $${item.value.toLocaleString('ko-KR',{maximumFractionDigits:2})}`:"가상 거래 280건입니다. 점에 마우스를 올리거나 클릭해 선택하세요. 차트에 초점을 두고 키보드로 탐색할 수도 있습니다.";
 }else if(variant==='scatter'){
  controls=<>{checkbox("주변 히스토그램",marginals,setMarginals)}{checkbox("선택 영역 회귀선",trend,setTrend)}<button type="button" onClick={()=>{setBrush(null);setSelectedCount(CLOUD.length);}}>영역 선택 해제</button></>;
  plot=<ScatterBrush points={CLOUD} brush={brush} onBrushChange={(next,indices)=>{setBrush(next);setSelectedCount(next?indices.length:CLOUD.length);}} marginals={marginals} trend={trend} bins={28} xLabel="세션 지속 시간 (분)" yLabel="참여도 점수" height={440} tone={tone} attract={false} ariaLabel="사각형 영역 선택, 주변 히스토그램 및 최소제곱 회귀선이 있는 가상 세션 산점도"/>;
  summary=brush?`${selectedCount.toLocaleString()}개 선택 · 지속 시간 ${Math.min(brush.x0,brush.x1).toFixed(2)}–${Math.max(brush.x0,brush.x1).toFixed(2)}분 · 참여도 ${Math.min(brush.y0,brush.y1).toFixed(2)}–${Math.max(brush.y0,brush.y1).toFixed(2)}`:"가상 세션 1,500개입니다. 드래그로 사각형 영역을 선택하고, 영역을 이동하거나 크기를 조절해 선택된 관측값을 살펴보세요.";
 }else{
  controls=<><label>확률 구간 수 <input type="range" min={4} max={20} value={calBins} onChange={e=>setCalBins(Number(e.target.value))}/><output>{calBins}</output></label>{checkbox("보정된 표본",recalibrated,setRecalibrated)}{checkbox("예측 히스토그램",histogram,setHistogram)}</>;
  plot=<CalibrationPlot forecasts={recalibrated?RECALIBRATED:FORECASTS} bins={calBins} onBinsChange={setCalBins} showHistogram={histogram} height={420} tone={tone} attract={false} ariaLabel="관측 비율, 95% 윌슨 점수 구간 및 이상적 기준선을 보여주는 가상 예측 보정 차트"/>;
  summary=`${recalibrated?"보정된":"확신이 과도한"} 가상 예측 · ${calBins}개 확률 구간. 음영은 계산된 95% 윌슨 점수 구간이며 대각선은 완벽히 보정된 예측입니다.`;
 }
 return <ChartShowcase title={TITLES[variant]} subtitle={SUBTITLES[variant]} reference={variant==='distribution'?'distribution-plot':variant==='violin'?'violin-plot':variant==='scatter'?'scatter-brush':variant==='calibration'?'calibration-plot':'beeswarm'} controls={controls} density={density}>{plot}<p role="status" aria-live="polite" style={{fontSize:12,color:'var(--klic-component-block-color-muted)',margin:'12px 0 0'}}>{summary}</p></ChartShowcase>;
}
