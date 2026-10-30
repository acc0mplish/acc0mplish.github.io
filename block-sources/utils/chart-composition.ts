/** Deterministic geometry for independently implemented KLIC composition charts. */
export interface WaterfallStep {kind:'start'|'change'|'end';value:number;from:number;to:number;}
const finite=(value:number)=>{if(!Number.isFinite(value))throw new Error('Chart values must be finite');return value;};
const nonnegative=(value:number)=>{finite(value);if(value<0)throw new Error('Area values must be nonnegative');return value;};

export function waterfall(initial:number,changes:readonly number[]):WaterfallStep[]{
  let total=finite(initial);
  const steps:WaterfallStep[]=[{kind:'start',value:total,from:0,to:total}];
  for(const change of changes){const from=total;total=finite(total+finite(change));steps.push({kind:'change',value:change,from,to:total});}
  steps.push({kind:'end',value:total,from:0,to:total});return steps;
}

export interface TreemapNode {id:string;label:string;value?:number;children?:readonly TreemapNode[];}
export function treemapTotal(node:TreemapNode):number{
  return node.children?.length?finite(node.children.reduce((sum,child)=>sum+treemapTotal(child),0)):nonnegative(node.value??0);
}
export interface TreemapBox {id:string;value:number;x:number;y:number;width:number;height:number;}
/** Balanced binary slices preserve exact area; zero values intentionally have no rectangle. */
export function layoutTreemap(items:readonly {id:string;value:number}[],width:number,height:number):TreemapBox[]{
  nonnegative(width);nonnegative(height);
  const positive=items.map(item=>({...item,value:nonnegative(item.value)})).filter(item=>item.value>0);
  if(width===0||height===0||positive.length===0)return [];
  finite(positive.reduce((sum,item)=>sum+item.value,0));
  const split=(group:typeof positive,x:number,y:number,w:number,h:number):TreemapBox[]=>{
    if(group.length===1)return [{...group[0],x,y,width:w,height:h}];
    const total=group.reduce((sum,item)=>sum+item.value,0);
    let sum=0,index=1,best=Infinity;
    for(let i=1;i<group.length;i++){sum+=group[i-1].value;const distance=Math.abs(total/2-sum);if(distance<best){best=distance;index=i;}}
    const left=group.slice(0,index),right=group.slice(index),ratio=left.reduce((sum,item)=>sum+item.value,0)/total;
    return w>=h?[...split(left,x,y,w*ratio,h),...split(right,x+w*ratio,y,w*(1-ratio),h)]
      :[...split(left,x,y,w,h*ratio),...split(right,x,y+h*ratio,w,h*(1-ratio))];
  };
  return split(positive,0,0,width,height);
}

export interface StackPoint {lower:number;upper:number;value:number;}
export interface StackGeometry {bands:StackPoint[][];totals:number[];extent:[number,number];}
export function stackSeries(rows:readonly (readonly number[])[],mode:'absolute'|'percent'|'centered'):StackGeometry{
  const count=rows[0]?.length??0;
  if(rows.some(row=>row.length!==count))throw new Error('Stack rows must have the same number of series');
  const totals=rows.map(row=>finite(row.reduce((sum,value)=>sum+nonnegative(value),0)));
  const bands:StackPoint[][]=Array.from({length:count},()=>[]);
  let minimum=0,maximum=0;
  rows.forEach((row,index)=>{
    let baseline=mode==='centered'&&totals[index]>0?-totals[index]/2:0;
    minimum=Math.min(minimum,baseline);
    row.forEach((raw,series)=>{
      const value=mode==='percent'?(totals[index]===0?0:raw/totals[index]*100):raw;
      const point={lower:baseline,upper:baseline+value,value};bands[series].push(point);baseline=point.upper;
    });
    maximum=Math.max(maximum,baseline);
  });
  return {bands,totals,extent:[minimum,maximum]};
}

export function valueDomain(values:readonly number[],includeZero=true):[number,number]{
  values.forEach(finite);
  if(!values.length)return [0,1];
  let lower=Math.min(...values),upper=Math.max(...values);
  if(includeZero){lower=Math.min(0,lower);upper=Math.max(0,upper);}
  if(lower===upper){if(lower===0)return [0,1];const padding=Math.max(1,Math.abs(lower)*.1);return [lower-padding,upper+padding];}
  return [lower,upper];
}
export interface GroupedBar {group:number;series:number;value:number;x:number;y:number;width:number;height:number;}
export function groupedBars(rows:readonly (readonly number[])[],width:number,height:number):{bars:GroupedBar[];domain:[number,number];zero:number}{
  nonnegative(width);nonnegative(height);
  const count=rows[0]?.length??0;
  if(rows.some(row=>row.length!==count))throw new Error('Grouped rows must have the same number of series');
  const domain=valueDomain(rows.flat()),span=domain[1]-domain[0],y=(value:number)=>(domain[1]-value)/span*height,zero=y(0);
  const groupWidth=rows.length?width/rows.length:0,slot=count?groupWidth*.8/count:0;
  const bars=rows.flatMap((row,group)=>row.map((value,series)=>({group,series,value,x:group*groupWidth+groupWidth*.1+series*slot+slot*.1,y:Math.min(zero,y(value)),width:slot*.8,height:Math.abs(y(value)-zero)})));
  return {bars,domain,zero};
}

export interface DumbbellDatum {id:string;label:string;a:number;b:number;}
export function sortDumbbells<T extends DumbbellDatum>(rows:readonly T[],sort:'gap'|'label'):T[]{
  rows.forEach(row=>{finite(row.a);finite(row.b);});
  return [...rows].sort((a,b)=>(sort==='gap'?Math.abs(b.b-b.a)-Math.abs(a.b-a.a):0)||a.label.localeCompare(b.label,'ko'));
}
/** Keep a stored selection in bounds if a consumer replaces the displayed dataset. */
export function selectionIndex(value:number,count:number):number{return !Number.isFinite(value)||count<=0?0:Math.max(0,Math.min(count-1,Math.floor(value)));}
