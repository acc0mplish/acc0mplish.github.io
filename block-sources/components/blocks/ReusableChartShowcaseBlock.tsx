import React, {useMemo, useState} from 'react';
import {KlicChart} from '../charts/KlicChart';
import {KLIC_CHART_TYPES} from '../../../../dist/klic-chart-runtime.mjs';
import type {KlicChartSpec} from '../../../../dist/klic-chart-runtime.mjs';

const examples=[
 {id:'lollipop',label:'점 막대'},
 {id:'ecdf',label:'누적 분포'},
 {id:'sunburst',label:'계층 링'},
 {id:'choropleth',label:'지역 단계도'},
 {id:'parallel-coordinates',label:'평행 좌표'},
 {id:'network-graph',label:'네트워크 그래프'},
] as const;
const demoValues={
 source:['검색','체험','유료'],target:['체험','유료','갱신'],path:['국내/플랫폼','국내/분석','해외/플랫폼'],region:['A','B','C'],
};

function exampleSpec(typeId:string,mode:'light'|'dark'='light'):KlicChartSpec {
 const type=KLIC_CHART_TYPES[typeId];if(!type)throw new Error(`Unknown KLIC chart example: ${typeId}`);
 const channels=type.channels.filter(channel=>channel.required||channel.name==='weight'),fields:KlicChartSpec['fields']={},encodings:Record<string,string>={},rows=Array.from({length:3},(_,index)=>({} as Record<string,string|number|boolean|null>));
 for(const channel of channels){const field=channel.name;encodings[channel.name]=field;fields![field]={kind:channel.kind,label:channel.name};for(let index=0;index<rows.length;index++){
   const choices=(demoValues as Record<string,string[]>)[field];
   rows[index][field]=choices?.[index]??(channel.kind==='quantitative'?[18,29,23][index]:channel.kind==='temporal'?`2026-01-0${index+1}`:channel.kind==='ordinal'?index+1:['A','B','C'][index]);
  }}
 const geometry=typeId==='choropleth'?{type:'FeatureCollection' as const,features:['A','B','C'].map((id,index)=>({type:'Feature' as const,id,properties:{label:`지역 ${id}`},geometry:{type:'Polygon' as const,coordinates:[[[126+index,37],[127+index,37],[127+index,38],[126+index,38],[126+index,37]]]}}))}:undefined;
 return {schemaVersion:'1.0',data:{rows},...(geometry?{geometry}:{}),fields,chart:{type:typeId,encodings},display:{title:examples.find(example=>example.id===typeId)?.label??typeId,subtitle:'KLIC sample data · exact values are shown in the table.',width:760,height:360,profile:'core',mode},interactions:[{type:'select'}]};
}

export function ReusableChartShowcaseBlock({density='normal',theme='light'}:{density?:'compact'|'normal'|'relaxed';theme?:'light'|'dark'}) {
 const [selected,setSelected]=useState<string>(examples[0].id),spec=useMemo(()=>exampleSpec(selected,theme),[selected,theme]);
 return <section className="kc-chart-shell" data-klic-chart-gallery="true" data-density={density}>
  <header className="kc-chart-heading"><div><span className="kc-chart-tag">KLIC CHART ENGINE</span><h2>재사용 차트 유형</h2><p>한 가지 KLIC spec에서 표·축·SVG를 함께 생성합니다. 새 형상도 동일한 blue token과 접근성 경로를 사용합니다.</p></div><span className="kc-chart-signature" aria-hidden="true">KLIC / 재사용</span></header>
  <div className="kc-chart-controls" role="group" aria-label="KLIC chart type selector">
   {examples.map(example=><button key={example.id} type="button" data-chart-type={example.id} aria-pressed={selected===example.id} onClick={()=>setSelected(example.id)}>{example.label}</button>)}
  </div>
  <KlicChart key={selected} spec={spec}/>
 </section>;
}
