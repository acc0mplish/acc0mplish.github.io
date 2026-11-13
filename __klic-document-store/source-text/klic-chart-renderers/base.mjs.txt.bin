import {clamp,extent,paddedDomain,quantile,arcPath,treemapRects} from '../klic-chart-math.mjs';

export const clamp01=value=>clamp(value,0,1);
export const format=value=>typeof value==='number'?new Intl.NumberFormat('en',{maximumFractionDigits:2}).format(value):String(value??'—');
export function fieldRows(spec){const encoding=spec.chart.encodings;return spec.data.rows.map((source,index)=>({source,index,values:Object.fromEntries(Object.entries(encoding).map(([channel,field])=>[channel,source[field]]))}));}
export function categories(rows,channel){return [...new Set(rows.map(row=>row.values[channel]).filter(value=>value!==null&&value!==undefined))];}
export function numberValue(value,kind){if(typeof value==='number')return value;if(kind==='temporal'&&typeof value==='string'){const time=Date.parse(value);return Number.isFinite(time)?time:null;}return null;}
export function domainFor(rows,channel,kind){const values=rows.map(row=>numberValue(row.values[channel],kind)).filter(Number.isFinite);return paddedDomain(values,{includeZero:false});}
export function layoutFor(spec){const width=spec.display?.width??800,height=spec.display?.height??420,top=spec.display?.title||spec.display?.subtitle?58:30;return {width,height,top,left:62,right:width-22,bottom:height-48,plotWidth:width-84,plotHeight:height-top-48};}
export const scaleLinear=(value,domain,range)=>range[0]+(value-domain[0])/(domain[1]-domain[0]||1)*(range[1]-range[0]);
export const paletteFor=theme=>theme.series;
export const textShape=(x,y,text,fill,size=11,anchor='middle',weight=400)=>({kind:'text',x,y,text:String(text),fill,size,anchor,weight});
export const lineShape=(x1,y1,x2,y2,stroke,width=1,dash=null)=>({kind:'line',x1,y1,x2,y2,stroke,width,dash});
export const rectShape=(x,y,width,height,fill,extra={})=>({kind:'rect',x,y,width,height,fill,...extra});
export const circleShape=(cx,cy,r,fill,extra={})=>({kind:'circle',cx,cy,r,fill,...extra});
export const pathShape=(d,stroke,fill='none',width=2,extra={})=>({kind:'path',d,stroke,fill,width,...extra});
export function axes(layout,palette,xTicks,yTicks,{xLabel='',yLabel='',formatY=format}={}){
 const shapes=[],{left,right,top,bottom,plotHeight}=layout;
 for(let index=0;index<=4;index++){const y=top+plotHeight*index/4,value=yTicks[index];shapes.push(lineShape(left,y,right,y,palette.grid,1));shapes.push(textShape(left-8,y+4,formatY(value),palette.muted,10,'end'));}
 if(xTicks.length){const stride=Math.max(1,Math.ceil(xTicks.length/8));for(let index=0;index<xTicks.length;index+=stride){const tick=xTicks[index];shapes.push(textShape(tick.x,bottom+18,tick.label,palette.muted,10,'middle'));}}
 shapes.push(lineShape(left,top,left,bottom,palette.grid,1));shapes.push(lineShape(left,bottom,right,bottom,palette.grid,1));
 if(xLabel)shapes.push(textShape((left+right)/2,layout.height-8,xLabel,palette.text,11));
 if(yLabel)shapes.push({kind:'text',x:15,y:(top+bottom)/2,text:yLabel,fill:palette.text,size:11,anchor:'middle',weight:500,rotate:-90});
 return shapes;
}
export function cartesianPositions(rows,layout,{x='x',y='y',xKind='categorical',yKind='quantitative',includeZeroY=true}={}){
 const discrete=['categorical','ordinal'].includes(xKind),xCats=discrete?categories(rows,x):[],yValues=rows.map(row=>numberValue(row.values[y],yKind)).filter(Number.isFinite),xDomain=discrete?null:domainFor(rows,x,xKind),yDomain=paddedDomain(yValues,{includeZero:includeZeroY});
 const xFor=value=>discrete?layout.left+(xCats.indexOf(value)+.5)*layout.plotWidth/Math.max(1,xCats.length):scaleLinear(numberValue(value,xKind),xDomain,[layout.left,layout.right]);
 const yFor=value=>scaleLinear(numberValue(value,yKind),yDomain,[layout.bottom,layout.top]);
 const xTicks=discrete?xCats.map(value=>({x:xFor(value),label:format(value)})):Array.from({length:5},(_,index)=>{const value=xDomain[0]+(xDomain[1]-xDomain[0])*index/4;return {x:scaleLinear(value,xDomain,[layout.left,layout.right]),label:xKind==='temporal'?new Date(value).toISOString().slice(0,10):format(value)};});
 return {xCats,xDomain,yDomain,xFor,yFor,xTicks};
}
export function tableFromRows(rows,columns,values){return {columns,rows:rows.map((row,index)=>values(row,index))};}
export function polarPath(cx,cy,r0,r1,start,end){return arcPath(cx,cy,r0,r1,start,end);}
export function colorForValue(value,domain,palette){const t=clamp01((value-domain[0])/(domain[1]-domain[0]||1));return t<.5?palette.series[0]:t<.85?palette.series[1]:palette.series[2];}
export function makeTreemapRects(items,layout){return treemapRects(items,layout.left,layout.top,layout.plotWidth,layout.plotHeight);}
export function extentFor(rows,channel){return extent(rows.map(row=>numberValue(row.values[channel],'quantitative')).filter(Number.isFinite));}
export {clamp,quantile,arcPath,treemapRects};
