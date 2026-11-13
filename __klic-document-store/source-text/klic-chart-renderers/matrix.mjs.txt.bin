import {paddedDomain} from '../klic-chart-math.mjs';
import {categories,fieldRows,format,lineShape,rectShape,scaleLinear,tableFromRows,textShape} from './base.mjs';

function dateValue(value){if(typeof value==='number')return value;const result=Date.parse(value);return Number.isFinite(result)?result:null;}
export function compileMatrix(spec,type,palette,layout,rows=fieldRows(spec)){
 const xName=type.id==='cohort-heatmap'?'period':type.id==='calendar-heatmap'?'date':'x',yName=type.id==='cohort-heatmap'?'cohort':'y',valueName='value',shapes=[],tableRows=[];
 const values=rows.map(row=>Number(row.values[valueName])).filter(Number.isFinite),domain=type.id==='correlation-matrix'?[-1,1]:paddedDomain(values),xCategories=type.id==='calendar-heatmap'?[]:categories(rows,xName),yCategories=type.id==='calendar-heatmap'?[]:categories(rows,yName);
 if(type.id==='calendar-heatmap'){
  const start=rows.map(row=>dateValue(row.values.date)).filter(Number.isFinite);if(start.length){const min=Math.min(...start),max=Math.max(...start),day=86400000,days=Math.round((max-min)/day)+1,firstWeekday=new Date(min).getUTCDay(),weeks=Math.ceil((firstWeekday+days)/7),cell=Math.min(18,layout.plotWidth/Math.max(1,weeks)),xOffset=layout.left+(layout.plotWidth-weeks*cell)/2;
   for(const row of rows){const time=dateValue(row.values.date);if(!Number.isFinite(time))continue;const index=Math.round((time-min)/day),date=new Date(time),week=Math.floor((firstWeekday+index)/7),x=xOffset+week*cell,y=layout.top+date.getUTCDay()*cell,color=palette.series[Math.round(Math.max(0,Math.min(1,(Number(row.values.value)-domain[0])/(domain[1]-domain[0]||1)))*(palette.series.length-1))];shapes.push(rectShape(x,y,cell-2,cell-2,color));tableRows.push([date.toISOString().slice(0,10),row.values.value]);}
   for(let index=0;index<7;index++)shapes.push(textShape(xOffset-6,layout.top+(index+.7)*cell,['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][index],palette.muted,8,'end'));
  }
 }else{
  const cellWidth=layout.plotWidth/Math.max(1,xCategories.length),cellHeight=layout.plotHeight/Math.max(1,yCategories.length);
  rows.forEach(row=>{const xIndex=xCategories.indexOf(row.values[xName]),yIndex=yCategories.indexOf(row.values[yName]),value=Number(row.values[valueName]);if(xIndex<0||yIndex<0||!Number.isFinite(value))return;const t=(value-domain[0])/(domain[1]-domain[0]||1),paletteIndex=Math.max(0,Math.min(palette.series.length-1,Math.round(t*(palette.series.length-1))));shapes.push(rectShape(layout.left+xIndex*cellWidth+1,layout.top+yIndex*cellHeight+1,Math.max(1,cellWidth-2),Math.max(1,cellHeight-2),palette.series[paletteIndex],{opacity:.86}));tableRows.push([row.values[xName],row.values[yName],value]);});
  xCategories.forEach((value,index)=>shapes.push(textShape(layout.left+(index+.5)*cellWidth,layout.bottom+15,value,palette.muted,9)));
  yCategories.forEach((value,index)=>shapes.push(textShape(layout.left-8,layout.top+(index+.5)*cellHeight+3,value,palette.muted,9,'end')));
 }
 const columns=type.id==='calendar-heatmap'?['Date','Value']:['X','Y','Value'],table=tableFromRows(tableRows,columns,row=>row);return {shapes,rows:tableRows.map((tableValues,index)=>({index,values:{},tableValues})),table,diagnostics:[]};
}
