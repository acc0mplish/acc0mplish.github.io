import {useSyncExternalStore} from 'react';

const REDUCED_MOTION_QUERY='(prefers-reduced-motion: reduce)';
const subscribe=(onChange:()=>void)=>{
  if(typeof window==='undefined'||typeof window.matchMedia!=='function')return ()=>{};
  const media=window.matchMedia(REDUCED_MOTION_QUERY);
  if(typeof media.addEventListener==='function'){
    media.addEventListener('change',onChange);
    return ()=>media.removeEventListener('change',onChange);
  }
  media.addListener(onChange);
  return ()=>media.removeListener(onChange);
};
const getSnapshot=()=>typeof window!=='undefined'&&typeof window.matchMedia==='function'&&window.matchMedia(REDUCED_MOTION_QUERY).matches;
const getServerSnapshot=()=>false;

export function usePrefersReducedMotion(){
  return useSyncExternalStore(subscribe,getSnapshot,getServerSnapshot);
}

export function dampChartMotion(current:number,target:number,rate:number,deltaSeconds:number,reducedMotion:boolean){
  if(reducedMotion)return target;
  return current+(target-current)*(1-Math.exp(-rate*deltaSeconds));
}
