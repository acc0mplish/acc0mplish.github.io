export type Order={price:number;size:number|null};
export function cumulativeDepth(orders:Order[],side:'bid'|'ask'){
 let cumulative=0;
 return orders.filter(o=>Number.isFinite(o.price)&&o.size!==null&&Number.isFinite(o.size)&&o.size>=0).sort((a,b)=>side==='bid'?b.price-a.price:a.price-b.price).map(o=>({price:o.price,size:o.size!,cumulative:cumulative+=o.size!}));
}
export function drawdownSeries(values:(number|null)[]){
 let peak=0;
 return values.map((value,index)=>{if(value===null||!Number.isFinite(value))return {index,value:null,peak,drawdown:null};peak=Math.max(peak,value);return {index,value,peak,drawdown:peak>0?(value-peak)/peak*100:0};});
}
export function groupOrderbook(bids:Order[],asks:Order[],tick:number){
 const step=Number.isFinite(tick)&&tick>0?tick:1;
 const group=(orders:Order[],side:'bid'|'ask')=>{const map=new Map<number,number>();for(const o of orders){if(!Number.isFinite(o.price)||o.size===null||!Number.isFinite(o.size)||o.size<0)continue;const price=Number(((side==='bid'?Math.floor(o.price/step):Math.ceil(o.price/step))*step).toFixed(6));map.set(price,(map.get(price)||0)+o.size);}return [...map].map(([price,size])=>({price,size})).sort((a,b)=>side==='bid'?b.price-a.price:a.price-b.price);};
 const b=group(bids,'bid'),a=group(asks,'ask'),bs=b.reduce((s,o)=>s+o.size,0),as=a.reduce((s,o)=>s+o.size,0);
 return {bids:b,asks:a,imbalance:bs+as?(bs-as)/(bs+as):0};
}
export type StateInterval={lane:string;state:'up'|'degraded'|'down';start:number;end:number};
export function intervalSummary(intervals:StateInterval[],start:number,end:number){
 if(end<=start)return {duration:0,up:0,uptime:0};
 let duration=0,up=0;for(const lane of new Set(intervals.map(i=>i.lane))){const items=intervals.filter(i=>i.lane===lane),points=[start,end,...items.flatMap(i=>[Math.max(start,Math.min(end,i.start)),Math.max(start,Math.min(end,i.end))])].sort((a,b)=>a-b);for(let j=1;j<points.length;j++){const a=points[j-1],b=points[j];if(b<=a)continue;const active=items.filter(i=>i.start<b&&i.end>a);if(!active.length)continue;duration+=b-a;if(active.every(i=>i.state==='up'))up+=b-a;}}
 return {duration,up,uptime:duration?up/duration:0};
}
export const sparkAt=(rows:(number|null)[][],index:number)=>rows.map(row=>{const value=row[Math.max(0,Math.floor(index))];return typeof value==='number'&&Number.isFinite(value)?value:null;});
export function forecastBands(last:number,count:number){return Array.from({length:Number.isFinite(count)?Math.max(0,Math.min(1000,Math.floor(count))):0},(_,i)=>{const step=i+1,median=last+step*2,spread=Math.sqrt(step)*5;return {step,median,low80:median-spread,high80:median+spread,low95:median-spread*1.7,high95:median+spread*1.7};});}

export function formatChartHour(hour:number){if(!Number.isFinite(hour))return "—";const minutes=Math.max(0,Math.round(hour*60));return `${String(Math.floor(minutes/60)).padStart(2,"0")}:${String(minutes%60).padStart(2,"0")}`;}
