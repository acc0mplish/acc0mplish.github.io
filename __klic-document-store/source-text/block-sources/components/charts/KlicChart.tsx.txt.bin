import React, {useEffect, useMemo, useState} from 'react';
import type {KeyboardEvent, ReactElement} from 'react';
import {compileKlicChart, renderKlicChartSvg} from '../../../../dist/klic-chart-runtime.mjs';
import type {KlicChartScalar, KlicChartSpec} from '../../../../dist/klic-chart-runtime.mjs';
import {ChartDataTable, ChartShell} from './ChartFrame';

export interface KlicChartSelection {index:number;columns:string[];values:KlicChartScalar[]}
export interface KlicChartProps {spec:KlicChartSpec;className?:string;onSelectionChange?:(selection:KlicChartSelection|null)=>void}

const printable=(value:KlicChartScalar)=>value===null?'—':typeof value==='boolean'?value?'Yes':'No':value;

export function KlicChart({spec,className,onSelectionChange}:KlicChartProps):ReactElement {
  const compiled=useMemo(()=>compileKlicChart(spec),[spec]);
  const [selectedIndex,setSelectedIndex]=useState<number|null>(null);
  const supportsSelection=spec.interactions?.some(interaction=>interaction.type==='select')===true;
  useEffect(()=>{setSelectedIndex(null);},[compiled]);

  if(!compiled.valid)return <section className={className} role="alert" aria-label="차트를 표시할 수 없습니다">
    <strong>차트 설정을 확인하세요.</strong>
    <ul>{compiled.errors.map((error,index)=><li key={`${error.path}-${index}`}>{error.path}: {error.message}</li>)}</ul>
  </section>;

  const svg=renderKlicChartSvg(compiled);
  const rows=compiled.table.rows.map(row=>row.map(printable));
  const move=(index:number)=>{
    if(index<0||index>=rows.length)return;
    setSelectedIndex(index);
    onSelectionChange?.({index,columns:compiled.table.columns,values:rows[index]});
  };
  const clear=()=>{setSelectedIndex(null);onSelectionChange?.(null);};
  const onKeyDown=(event:KeyboardEvent<HTMLDivElement>)=>{
    if(!supportsSelection||rows.length===0)return;
    if(event.key==='ArrowRight'||event.key==='ArrowDown'){event.preventDefault();move(selectedIndex===null?0:Math.min(rows.length-1,selectedIndex+1));}
    else if(event.key==='ArrowLeft'||event.key==='ArrowUp'){event.preventDefault();move(selectedIndex===null?rows.length-1:Math.max(0,selectedIndex-1));}
    else if(event.key==='Home'){event.preventDefault();move(0);}
    else if(event.key==='End'){event.preventDefault();move(rows.length-1);}
    else if(event.key==='Escape'){event.preventDefault();clear();}
    else if((event.key==='Enter'||event.key===' ')&&selectedIndex===null){event.preventDefault();move(0);}
  };
  const selectionText=selectedIndex===null?'':compiled.table.columns.map((column,index)=>`${column}: ${rows[selectedIndex][index]}`).join(' · ');
  const controls=supportsSelection?<div role="group" aria-label="차트 데이터 선택">
    <button type="button" aria-label="Previous chart row" disabled={selectedIndex===null||selectedIndex===0} onClick={()=>move(Math.max(0,(selectedIndex??0)-1))}>이전</button>
    <span>{selectedIndex===null?'선택 없음':`${selectedIndex+1} / ${rows.length}`}</span>
    <button type="button" aria-label="Next chart row" disabled={selectedIndex!==null&&selectedIndex===rows.length-1} onClick={()=>move(selectedIndex===null?0:Math.min(rows.length-1,selectedIndex+1))}>다음</button>
  </div>:undefined;

  return <div className={className} data-klic-chart-type={compiled.type} data-chart-mode={compiled.display.mode} data-chart-profile={compiled.display.profile}>
    <ChartShell title={compiled.display.title} subtitle={compiled.display.subtitle||`${compiled.summary.rows}개 행 · ${compiled.summary.marks}개 SVG mark`} tag={`KLIC Chart · ${compiled.type}`} controls={controls} footnote={compiled.diagnostics.join(' ')}>
      <div className="kc-chart-plot" data-klic-surface="dense" tabIndex={supportsSelection?0:-1} role="region" aria-label={`${compiled.display.title} 차트. 키보드로 탐색하고 정확한 값은 표에서 확인합니다.`} onKeyDown={onKeyDown}>
        <div style={{minWidth:`calc(${compiled.display.width}px * var(--runtime-text-scale,1))`}}>
          <div style={{width:'100%',height:'auto'}} dangerouslySetInnerHTML={{__html:svg}} />
        </div>
      </div>
      <div className="sr-only" role="status" aria-live="polite">{selectionText}</div>
      <ChartDataTable columns={compiled.table.columns} rows={rows} caption={`${compiled.display.title} exact data`} />
    </ChartShell>
  </div>;
}
