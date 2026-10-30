export function correlation(a:number[],b:number[]):number|null {
 const pairs=a.flatMap((v,i)=>Number.isFinite(v)&&Number.isFinite(b[i])?[[v,b[i]]]:[]);if(pairs.length<2)return null;
 const x=pairs.reduce((s,p)=>s+p[0],0)/pairs.length,y=pairs.reduce((s,p)=>s+p[1],0)/pairs.length;
 const xx=pairs.reduce((s,p)=>s+(p[0]-x)**2,0),yy=pairs.reduce((s,p)=>s+(p[1]-y)**2,0);
 return xx&&yy?Math.max(-1,Math.min(1,pairs.reduce((s,p)=>s+(p[0]-x)*(p[1]-y),0)/Math.sqrt(xx*yy))):null;
}
export type Cohort={label:string;size:number;retained:(number|null)[]};
export function cohortRate(count:number|null,size:number){return count===null||size<=0?null:count/size*100;}
export function weightedRetention(cohorts:Cohort[],period:number){const eligible=cohorts.filter(c=>c.size>0&&c.retained[period]!=null);const denominator=eligible.reduce((s,c)=>s+c.size,0);return denominator?eligible.reduce((s,c)=>s+(c.retained[period]??0),0)/denominator*100:null;}
export function calendarCells(start:string,counts:(number|null)[]){const date=new Date(`${start}T00:00:00Z`);if(!Number.isFinite(date.getTime()))throw new Error('Invalid date');const offset=(date.getUTCDay()+6)%7;return counts.map((count,i)=>{const d=new Date(date);d.setUTCDate(d.getUTCDate()+i);return {date:d.toISOString().slice(0,10),count,day:(offset+i)%7,week:Math.floor((offset+i)/7)};});}
export function funnelStages(stages:{label:string;count:number}[]){if(stages.some((s,i)=>!Number.isFinite(s.count)||s.count<0||(i>0&&s.count>stages[i-1].count)))throw new Error('Funnel counts must be finite, nonnegative and decreasing');const first=stages[0]?.count??0;return stages.map((s,i)=>({...s,width:first?s.count/first:0,conversion:i===0?null:stages[i-1].count?s.count/stages[i-1].count*100:null}));}
export function targetMet(actual:number,target:number,direction:'higher'|'lower'){return direction==='higher'?actual>=target:actual<=target;}
