import {arcPath,paddedDomain,polar,treemapRects} from '../klic-chart-math.mjs';
import {categories,circleShape,fieldRows,format,layoutFor,lineShape,pathShape,rectShape,scaleLinear,tableFromRows,textShape} from './base.mjs';

const pathFor=points=>points.map((point,index)=>`${index?'L':'M'} ${point.x} ${point.y}`).join(' ');
const arcFor=(cx,cy,inner,outer,start,end)=>end-start>=Math.PI*1.999?`${arcPath(cx,cy,inner,outer,start,start+Math.PI)} ${arcPath(cx,cy,inner,outer,start+Math.PI,end)}`:arcPath(cx,cy,inner,outer,start,end);
const sum=rows=>rows.reduce((total,row)=>total+(Number(row.values.value)||0),0);
function pieSlices(rows,valueKey='value',categoryKey='category'){
 const usable=rows.filter(row=>Number.isFinite(Number(row.values[valueKey]))&&Number(row.values[valueKey])>0),total=usable.reduce((amount,row)=>amount+Number(row.values[valueKey]),0);let angle=-Math.PI/2;
 return usable.map(row=>{const span=Number(row.values[valueKey])/total*Math.PI*2,slice={row,start:angle,end:angle+span,value:Number(row.values[valueKey]),label:String(row.values[categoryKey]??'')};angle+=span;return slice;});
}
function compileParts(spec,type,palette,layout,rows){
 const shapes=[],cx=(layout.left+layout.right)/2,cy=(layout.top+layout.bottom)/2,r=Math.min(layout.plotWidth,layout.plotHeight)*.42;
 if(type.id==='kpi-card'){
  const row=rows[0],label=String(row.values.label),value=format(row.values.value),delta=Number(row.values.delta),deltaText=Number.isFinite(delta)?`${delta>0?'+':''}${format(delta)}`:'',tableRows=rows.map(record=>[record.values.label,record.values.value,record.values.delta??'—']);
  shapes.push(textShape(cx,cy-12,label,palette.muted,13));shapes.push(textShape(cx,cy+22,value,palette.text,34,'middle',700));if(deltaText)shapes.push(textShape(cx,cy+46,deltaText,palette.series[0],12,'middle',600));
  return {shapes,rows:tableRows.map((tableValues,index)=>({index,values:{},tableValues})),table:{columns:['Label','Value','Change'],rows:tableRows},diagnostics:[]};
 }
 const sliceTypes=new Set(['pie','donut','radial','rose']),slices=sliceTypes.has(type.id)?type.id==='rose'||type.id==='radial'?(()=>{const usable=rows.filter(row=>Number.isFinite(Number(row.values.value))&&Number(row.values.value)>0),count=usable.length;return usable.map((row,index)=>({row,start:-Math.PI/2+index/count*Math.PI*2,end:-Math.PI/2+(index+1)/count*Math.PI*2,value:Number(row.values.value),label:String(row.values.category??'')}));})():pieSlices(rows):[],tableRows=slices.map(slice=>[slice.label,slice.value,slice.value/(sum(rows)||1)]);
 for(const [index,slice] of slices.entries()){
  const start=slice.start,end=slice.end,full=end-start>=Math.PI*1.999,fill=palette.series[index%palette.series.length];
  if(type.id==='sunburst')continue;
  if(type.id==='gauge')continue;
  const inner=type.id==='pie'?0:type.id==='rose'?r*.24:type.id==='radial'?r*.35:r*.55,outer=type.id==='rose'||type.id==='radial'?r*(.42+.58*slice.value/Math.max(...slices.map(item=>item.value))):r;
  if(full){shapes.push(pathShape(arcPath(cx,cy,inner,outer,start,start+Math.PI),fill,fill,1));shapes.push(pathShape(arcPath(cx,cy,inner,outer,start+Math.PI,end-.0001),fill,fill,1));}
  else shapes.push(pathShape(arcPath(cx,cy,inner,outer,start,end),fill,fill,1));
  const middle=(start+end)/2,label=polar(cx,cy,outer+14,middle);shapes.push(textShape(label.x,label.y,slice.label,palette.text,9));
 }
 if(type.id==='sunburst'){
  const tree=new Map(),childrenByPath=new Map(),roots=[];for(const row of rows){const segments=String(row.values.path).split('/').filter(Boolean),value=Number(row.values.value)||0;let prefix='';for(const segment of segments){const parent=prefix;prefix=prefix?`${prefix}/${segment}`:segment;tree.set(prefix,(tree.get(prefix)||0)+value);if(parent){if(!childrenByPath.has(parent))childrenByPath.set(parent,[]);if(!childrenByPath.get(parent).includes(prefix))childrenByPath.get(parent).push(prefix);}else if(!roots.includes(prefix))roots.push(prefix);}}
  const rootTotal=roots.reduce((total,name)=>total+(tree.get(name)||0),0),maxDepth=Math.max(1,...[...tree.keys()].map(path=>path.split('/').length-1)),ringWidth=r*.58/(maxDepth+1);
  const drawNode=(name,start,end,depth,rootIndex)=>{const inner=r*.24+depth*ringWidth,outer=Math.min(r*.9,inner+ringWidth*.86),color=palette.series[(rootIndex+depth)%palette.series.length];if(outer>inner&&end-start>.0001)shapes.push(pathShape(arcFor(cx,cy,inner,outer,start,end),color,color,1,{opacity:depth===0?.55:.75}));let cursor=start;for(const child of childrenByPath.get(name)||[]){const span=(tree.get(name)>0?(tree.get(child)||0)/tree.get(name):0)*(end-start);drawNode(child,cursor,cursor+span,depth+1,rootIndex);cursor+=span;}};
  let start=-Math.PI/2;for(const [rootIndex,name] of roots.entries()){const span=rootTotal?(tree.get(name)||0)/rootTotal*Math.PI*2:0;drawNode(name,start,start+span,0,rootIndex);start+=span;}
  tableRows.length=0;for(const row of rows)tableRows.push([row.values.path,row.values.value]);
 }
 if(type.id==='gauge'){
  const min=Number(spec.chart.options?.min??0),max=Number(spec.chart.options?.max??100),value=Number(rows[0]?.values.value??0),fraction=Math.max(0,Math.min(1,(value-min)/(max-min||1))),start=-Math.PI,end=0;
  shapes.push(pathShape(arcPath(cx,cy,r*.68,r,start,end),palette.grid,palette.grid,1));if(fraction>0)shapes.push(pathShape(arcPath(cx,cy,r*.68,r,start,start+Math.PI*fraction),palette.series[0],palette.series[0],1));if(Number.isFinite(Number(rows[0]?.values.target))){const targetFraction=Math.max(0,Math.min(1,(Number(rows[0].values.target)-min)/(max-min||1))),targetPoint=polar(cx,cy,r*.8,start+Math.PI*targetFraction);shapes.push(lineShape(cx,cy,targetPoint.x,targetPoint.y,palette.text,2));}shapes.push(textShape(cx,cy+5,format(value),palette.text,22,'middle',700));shapes.push(textShape(cx,cy+24,`${format(min)}–${format(max)}`,palette.muted,10));tableRows.length=0;tableRows.push([value,rows[0]?.values.target??'—',min,max]);
 }
 if(type.id==='treemap'){
  const items=rows.map(row=>({label:String(row.values.path??row.values.category),value:Number(row.values.value)||0})),rects=treemapRects(items,layout.left,layout.top,layout.plotWidth,layout.plotHeight);rects.forEach((item,index)=>{shapes.push(rectShape(item.x,item.y,Math.max(0,item.width-2),Math.max(0,item.height-2),palette.series[index%palette.series.length],{opacity:.7}));shapes.push(textShape(item.x+item.width/2,item.y+item.height/2,item.label,palette.text,10));});tableRows.length=0;for(const item of items)tableRows.push([item.label,item.value]);
 }
 if(type.id==='waterfall'){
  const slot=layout.plotWidth/Math.max(1,rows.length),totalField=spec.chart.options?.totalField;let total=0;const steps=rows.map(row=>{const raw=Number(row.values.delta),marker=totalField?row.source?.[totalField]:undefined,isTotal=marker===true||String(marker??'').toLowerCase()==='total'||String(marker??'').toLowerCase()==='subtotal',start=isTotal?0:total,end=isTotal?(Number.isFinite(raw)?raw:total):total+(Number.isFinite(raw)?raw:0);total=end;return {row,start,end,delta:isTotal?'—':raw,isTotal};}),domain=paddedDomain(steps.flatMap(step=>[step.start,step.end]),{includeZero:true}),yFor=value=>scaleLinear(value,domain,[layout.bottom,layout.top]),baseline=yFor(0);tableRows.length=0;
  for(const [index,step] of steps.entries()){const x=layout.left+index*slot+slot*.15,y0=yFor(step.start),y1=yFor(step.end),color=step.isTotal?palette.series[2]:step.end>=step.start?palette.series[0]:palette.series[2];shapes.push(rectShape(x,Math.min(y0,y1),slot*.7,Math.max(2,Math.abs(y0-y1)),color,{title:`${step.row.values.category}: ${format(step.end)}`}));if(index<steps.length-1)shapes.push(lineShape(x+slot*.7,y1,x+slot*.85,y1,palette.muted,1,'3 2'));shapes.push(textShape(layout.left+(index+.5)*slot,layout.bottom+16,step.row.values.category,palette.muted,9));tableRows.push([step.row.values.category,step.delta,step.end]);}
  shapes.push(lineShape(layout.left,baseline,layout.right,baseline,palette.grid));
 }
 if(type.id==='funnel'){
  const slot=layout.plotHeight/Math.max(1,rows.length),max=Math.max(...rows.map(row=>Number(row.values.value)||0),1);tableRows.length=0;rows.forEach((row,index)=>{const width=(Number(row.values.value)||0)/max*layout.plotWidth*.82,nextValue=index<rows.length-1?Number(rows[index+1].values.value):Number(row.values.value)*.72,nextWidth=Math.max(0,nextValue/max*layout.plotWidth*.82),x=layout.left+(layout.plotWidth-width)/2,nextX=layout.left+(layout.plotWidth-nextWidth)/2,y=layout.top+index*slot+3,bottom=y+Math.max(1,slot-6),d=`M ${x} ${y} L ${x+width} ${y} L ${nextX+nextWidth} ${bottom} L ${nextX} ${bottom} Z`;shapes.push(pathShape(d,'none',palette.series[index%palette.series.length],0,{opacity:.78}));shapes.push(textShape(layout.left-8,y+slot/2,row.values.stage,palette.muted,9,'end'));tableRows.push([row.values.stage,row.values.value,index?Number(row.values.value)/(Number(rows[index-1].values.value)||1):null]);});
 }
 if(type.id==='radar'){
  const axes=categories(rows,'axis'),maximum=Math.max(...rows.map(row=>Number(row.values.value)||0),1),series=[...new Set(rows.map(row=>row.values.series??'Series 1'))];tableRows.length=0;const radius=r;
  for(const [seriesIndex,name] of series.entries()){const data=rows.filter(row=>(row.values.series??'Series 1')===name),points=axes.map((axis,index)=>{const row=data.find(entry=>entry.values.axis===axis),angle=-Math.PI/2+Math.PI*2*index/axes.length,rr=radius*(Number(row?.values.value)||0)/maximum;return polar(cx,cy,rr,angle);});shapes.push(pathShape(`${pathFor(points)} Z`,palette.series[seriesIndex%palette.series.length],palette.series[seriesIndex%palette.series.length],1,{opacity:.22}));axes.forEach((axis,index)=>{const position=polar(cx,cy,radius+12,-Math.PI/2+Math.PI*2*index/axes.length);shapes.push(textShape(position.x,position.y,axis,palette.muted,9));});for(const row of data)tableRows.push([name,row.values.axis,row.values.value]);}
 }
 const columns=type.id==='waterfall'?['Category','Delta','Total']:type.id==='funnel'?['Stage','Count','Conversion']:type.id==='radar'?['Series','Axis','Value']:type.id==='sunburst'?['Path','Value']:type.id==='treemap'?['Path','Value']:type.id==='gauge'?['Value','Target','Minimum','Maximum']:['Category','Value','Share'];
 const plotRows=tableRows.map((tableValues,index)=>({index,values:{},tableValues}));return {shapes,rows:plotRows,table:{columns,rows:tableRows},diagnostics:[]};
}
export function compileComposition(spec,type,palette,layout,rows=fieldRows(spec)){return compileParts(spec,type,palette,layout,rows);}
