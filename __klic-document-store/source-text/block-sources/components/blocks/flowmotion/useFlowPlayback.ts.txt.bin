import {useEffect,useRef,useState} from 'react';

/** One finite scene clock. Environmental suspension retains explicit playback intent. */
export function useFlowPlayback(duration:number,identity:string){
 const root=useRef<HTMLElement|null>(null),time=useRef(duration);
 const [elapsed,setElapsed]=useState(duration),[playing,setPlaying]=useState(false),[loop,setLoop]=useState(false);
 const [reduced,setReduced]=useState(()=>typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [visible,setVisible]=useState(true),[inView,setInView]=useState(true);
 useEffect(()=>{time.current=duration;setElapsed(duration);setPlaying(false);},[duration,identity]);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const preference=()=>{setReduced(media.matches);if(media.matches){setPlaying(false);time.current=duration;setElapsed(duration);}};
  const visibility=()=>setVisible(!document.hidden);preference();visibility();
  media.addEventListener('change',preference);document.addEventListener('visibilitychange',visibility);
  const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>setInView(Boolean(entries.at(-1)?.isIntersecting))):null;
  if(root.current)observer?.observe(root.current);
  return()=>{media.removeEventListener('change',preference);document.removeEventListener('visibilitychange',visibility);observer?.disconnect();};
 },[duration]);
 useEffect(()=>{
  if(!playing||reduced||!visible||!inView)return;
  let handle=0,previous:number|null=null;
  const tick=(now:number)=>{
   const delta=previous===null?0:now-previous;previous=now;
   let next=time.current+delta;
   if(next>=duration){if(loop)next%=duration;else{time.current=duration;setElapsed(duration);setPlaying(false);return;}}
   time.current=next;setElapsed(next);handle=requestAnimationFrame(tick);
  };
  handle=requestAnimationFrame(tick);return()=>cancelAnimationFrame(handle);
 },[playing,reduced,visible,inView,loop,duration]);
 const seek=(value:number)=>{const next=Math.min(duration,Math.max(0,value));time.current=next;setElapsed(next);setPlaying(false);};
 const replay=()=>{if(reduced)return;time.current=0;setElapsed(0);setPlaying(true);};
 const toggle=()=>{if(reduced)return;if(playing)setPlaying(false);else if(time.current>=duration)replay();else setPlaying(true);};
 return {root,elapsed,playing,loop,setLoop,reduced,running:playing&&visible&&inView&&!reduced,seek,replay,toggle};
}
