import {fieldRows,format,lineShape,rectShape,scaleLinear,textShape} from './base.mjs';

const stamp=value=>typeof value==='number'?value:Date.parse(value);
export function compileTimeline(spec,type,palette,layout,rows=fieldRows(spec)){
 const taskName=type.id==='gantt'?'task':'state',tasks=[...new Set(rows.map(row=>row.values[taskName]))],times=rows.flatMap(row=>[stamp(row.values.start),stamp(row.values.end)]).filter(Number.isFinite),min=Math.min(...times),max=Math.max(...times),span=max-min||1,xFor=value=>scaleLinear(stamp(value),[min,max],[layout.left,layout.right]),slot=layout.plotHeight/Math.max(1,tasks.length),shapes=[],tableRows=[];
 rows.forEach((row,index)=>{const task=row.values[taskName],taskIndex=tasks.indexOf(task),start=xFor(row.values.start),end=xFor(row.values.end),y=layout.top+(taskIndex+.5)*slot,color=palette.series[index%palette.series.length];shapes.push(rectShape(Math.min(start,end),y-slot*.25,Math.max(2,Math.abs(end-start)),slot*.5,color,{opacity:.78}));shapes.push(textShape(layout.left-8,y+3,task,palette.muted,9,'end'));tableRows.push([task,row.values.start,row.values.end,Math.max(0,(stamp(row.values.end)-stamp(row.values.start))/3600000)]);});
 for(let index=0;index<=4;index++){const x=layout.left+layout.plotWidth*index/4,stampValue=min+(max-min)*index/4;shapes.push(lineShape(x,layout.top,x,layout.bottom,palette.grid));shapes.push(textShape(x,layout.bottom+16,new Date(stampValue).toISOString().slice(0,10),palette.muted,8));}
 return {shapes,rows:tableRows.map((tableValues,index)=>({index,values:{},tableValues})),table:{columns:['Task','Start','End','Duration hours'],rows:tableRows},diagnostics:[]};
}
