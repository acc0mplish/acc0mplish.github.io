import React from 'react';

export interface ChartDataTableProps {
  chartId: string;
  caption: string;
  columns: string[];
  rows: Array<Array<string | number>>;
}

export function ChartDataTable({chartId,caption,columns,rows}:ChartDataTableProps){
  return (
    <details className="mt-4 rounded-xl border border-[var(--klic-component-block-color-border)] bg-klic-inverse/80 text-klic-on-emphasis" data-chart-data-disclosure={chartId}>
      <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">
        정확한 데이터 표 보기
      </summary>
      <div className="max-h-80 overflow-auto px-4 pb-4">
        <table tabIndex={0} data-chart-data-table={chartId} className="min-w-full border-collapse text-left text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400">
          <caption className="caption-top py-2 text-left font-semibold text-klic-on-emphasis">{caption}</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky top-0 border-b border-[var(--klic-component-block-color-border)] bg-klic-inverse px-3 py-2">항목</th>
              {columns.map((column,index)=><th key={`${column}-${index}`} scope="col" className="sticky top-0 border-b border-[var(--klic-component-block-color-border)] bg-klic-inverse px-3 py-2">{column}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row,index)=><tr key={`${row[0]}-${index}`}>
              <th scope="row" className="whitespace-nowrap border-b border-[var(--klic-component-block-color-border)] px-3 py-2 font-medium text-klic-on-emphasis">{row[0]}</th>
              {row.slice(1).map((value,column)=><td key={`${index}-${column}`} className="whitespace-nowrap border-b border-[var(--klic-component-block-color-border)] px-3 py-2 font-mono text-klic-on-emphasis">{value}</td>)}
            </tr>)}
          </tbody>
        </table>
      </div>
    </details>
  );
}
