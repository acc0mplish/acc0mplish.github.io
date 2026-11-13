import React, {useId} from 'react';

export const CHART_COLORS = Array.from({length:6},(_,i)=>`var(--klic-component-block-chart-series-${i+1})`);
export const CHART_TEXT = 'var(--klic-component-block-color-text)';
export const CHART_MUTED = 'var(--klic-component-block-color-muted)';
export const CHART_GRID = 'var(--klic-component-block-color-border)';
export const CHART_BLUE = 'var(--klic-component-block-color-accent)';
export const CHART_DANGER = 'var(--klic-component-block-color-danger)';
export const CHART_WARNING = 'var(--klic-component-block-color-warning)';

export function ChartShell({title,subtitle,tag,controls,metrics,children,footnote}:{title:string;subtitle:string;tag?:string;controls?:React.ReactNode;metrics?:{label:string;value:React.ReactNode}[];children:React.ReactNode;footnote?:React.ReactNode}){
  return <section className="kc-chart-shell" data-klic-surface="card">
    <header className="kc-chart-heading"><div>{tag&&<span className="kc-chart-tag">{tag}</span>}<h2>{title}</h2><p>{subtitle}</p></div><span className="kc-chart-signature" aria-hidden="true">KLIC / 데이터</span></header>
    {controls&&<div className="kc-chart-controls">{controls}</div>}
    {!!metrics?.length&&<dl className="kc-chart-metrics">{metrics.map(({label,value})=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
    {children}
    {footnote&&<p className="kc-chart-footnote">{footnote}</p>}
  </section>;
}

export function ChartPlot({children,minWidth=600}:{children:React.ReactNode;minWidth?:number}){
  return <div className="kc-chart-plot" data-klic-surface="dense" tabIndex={0} role="region" aria-label="차트. 화면이 좁으면 가로로 스크롤할 수 있습니다."><div style={{minWidth:`calc(${minWidth}px * var(--runtime-text-scale,1))`}}>{children}</div></div>;
}

export function ChartSvg({label,children,width=800,height=320}:{label:string;children:React.ReactNode;width?:number;height?:number}){
  const id=useId();
  return <svg className="kc-chart-svg" viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-labelledby={id}><title id={id}>{label}</title>{children}</svg>;
}

export function ChartDataTable({columns,rows,caption="차트의 정확한 수치"}:{columns:string[];rows:(string|number)[][];caption?:string}){
  return <details className="kc-chart-data"><summary>원본 데이터 · {rows.length} 행</summary><div className="kc-chart-table-scroll" data-klic-surface="dense" tabIndex={0} role="region" aria-label={caption}><table><caption>{caption}</caption><thead><tr>{columns.map((c,i)=><th scope="col" key={i}>{c}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((v,j)=><td key={j}>{v}</td>)}</tr>)}</tbody></table></div></details>;
}

export function ChartLegend({items}:{items:{label:string;color?:string}[]}){
  return <ul className="kc-chart-legend" aria-label="차트 범례">{items.map(({label,color},i)=><li key={label}><span aria-hidden="true" style={{background:color||CHART_COLORS[i%CHART_COLORS.length]}}/>{label}</li>)}</ul>;
}
