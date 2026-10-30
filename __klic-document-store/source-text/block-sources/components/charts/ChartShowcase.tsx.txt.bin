import React,{useEffect,useRef,useState} from 'react';
import {useBjorkTone,useChartContextKey} from './bjork/_core/tone';
export const useKlicChartTone=useBjorkTone;
type TableData={caption:string;rows:string[][]};
export function ChartShowcase({title,subtitle,reference,controls,children,density='normal'}:{title:string;subtitle:string;reference:string;controls?:React.ReactNode;children:React.ReactNode;density?:string}){
 const colorContext=useChartContextKey();
 const stage=useRef<HTMLDivElement>(null),[data,setData]=useState<TableData|null>(null),open=data!==null;
 const readTable=():TableData=>{
  const grids=Array.from(stage.current?.querySelectorAll('[role="grid"]')||[]);
  if(grids.length){
   const rows:string[][]=[['구분','가격','수량','누적 수량']];
   for(const grid of grids){
    const side=grid.getAttribute('data-chart-side')==='bid'?'매수':'매도';
    for(const row of Array.from(grid.querySelectorAll('[role="row"]'))){
     const cells=Array.from(row.querySelectorAll<HTMLElement>('[role="gridcell"]'));
     if(!cells.length)continue;
     rows.push([side,...['price','size','total'].map(key=>{const cell=cells.find(cell=>cell.dataset.chartColumn===key);return (cell?.querySelector('[data-chart-value]')?.textContent||cell?.textContent)?.trim()||'—';})]);
    }
   }
   return {caption:'표시 중인 가격 구간별 호가 · 예시 주문',rows};
  }
  const t=stage.current?.querySelector('table');return {caption:t?.caption?.textContent||title,rows:t?Array.from(t.rows).map(r=>Array.from(r.cells).map(c=>c.textContent||'')):[]};
 };
 useEffect(()=>{if(!open)return;const table=stage.current;const sync=()=>setData(readTable());sync();if(!table)return;const observer=new MutationObserver(records=>{if(records.some(r=>(r.target.nodeType===1?r.target as Element:r.target.parentElement)?.closest('table,[role="grid"]')))sync();});observer.observe(table,{subtree:true,childList:true,characterData:true});return ()=>observer.disconnect();},[open,reference,children]);
 const slug=reference.startsWith('https://ui.isaiahbjork.com/charts/')?reference.slice('https://ui.isaiahbjork.com/charts/'.length):reference;
 return <section className="klic-chart-showcase" data-klic-surface="card" data-chart-reference={slug} data-density={density}>
  <header><div><p className="klic-chart-eyebrow">KLIC / 차트</p><h2>{title}</h2><p className="klic-chart-description">{subtitle}</p></div></header>
  {controls&&<div className="klic-chart-controls">{controls}</div>}
  <div key={colorContext} ref={stage} className="klic-chart-stage" data-klic-surface="dense">{children}</div>
  <div data-chart-table><button type="button" onClick={()=>setData(open?null:readTable())} aria-expanded={open}>데이터 표 {open?'−':'+'}</button>{data&&<div style={{maxHeight:320,overflow:'auto'}}><table><caption>{data.caption}</caption><tbody>{data.rows.map((r,i)=><tr key={i}>{r.map((c,j)=>i===0?<th scope="col" key={j}>{c}</th>:<td key={j}>{c}</td>)}</tr>)}</tbody></table></div>}</div>
  <footer><span>KLIC 차트 · 샘플 데이터</span><span>MIT 소스 적용</span></footer>
 </section>;
}
