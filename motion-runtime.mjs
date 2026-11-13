import {loadMotionSource,mountSourceEngine} from './motion-source-engines.mjs';
import {getMotion} from './motion-catalog.mjs';

export {loadMotionSource} from './motion-source-engines.mjs';
export {resolveMotionPalette,resolveMotionFonts,mapMotionColor,mapMotionFont,rewriteMotionColors,rewriteMotionFonts} from './motion-palette.mjs';
export {createMotionExport} from './motion-export.mjs';

const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

export function mountMotion(root,recipeOrId,options={}){
 if(!root?.ownerDocument)throw new TypeError('mountMotion requires a DOM element.');
 const recipe=typeof recipeOrId==='string'?getMotion(recipeOrId):recipeOrId;
 if(!recipe?.reference?.engine||!recipe.reference.pattern||!recipe.reference.demoId)throw new TypeError('mountMotion requires a canonical source motion recipe.');
 const doc=root.ownerDocument,win=doc.defaultView||globalThis,media=win.matchMedia?.('(prefers-reduced-motion: reduce)')||{matches:false,addEventListener(){},removeEventListener(){}};
 let driver=null,raf=0,startedAt=0,current=0,destroyed=false,playing=false,finished=false,reduced=Boolean(media.matches),inViewport=true,documentVisible=!doc.hidden,playbackWanted=true;
 let intersection=null,resize=null,mutation=null,generation=0,refreshResume=false,playbackIntent=0,rate=1,loop=Boolean(options.loop),customText=null,customFont=null,customOnion=false;
 const now=()=>win.performance?.now?.()??Date.now(),rafRequest=callback=>win.requestAnimationFrame?win.requestAnimationFrame(callback):setTimeout(()=>callback(now()),16),rafCancel=id=>win.cancelAnimationFrame?win.cancelAnimationFrame(id):clearTimeout(id);
 const pauseFrame=()=>{if(raf){rafCancel(raf);raf=0;}};
 const render=milliseconds=>{
  current=clamp(milliseconds,0,driver?.duration||recipe.reference.durationMs||recipe.durationMs);
  try{driver?.render(current);delete root.dataset.motionError;}
  catch(error){pauseFrame();playing=false;driver?.pause();root.dataset.motionError=error instanceof Error?error.message:String(error);throw error;}
 };
 const shouldPlay=()=>playing&&!reduced&&inViewport&&documentVisible&&!destroyed;
 const tick=timestamp=>{
  raf=0;if(!shouldPlay()||!driver)return;
  current=clamp((timestamp-startedAt)*rate,0,driver.duration);
  try{render(current);}catch{return;}
  if(current>=driver.duration){
   if(loop&&!reduced){current=(Math.max(0,timestamp-startedAt)*rate%driver.duration);startedAt=timestamp-current/rate;finished=false;try{render(current);}catch{return;}driver.play();raf=rafRequest(tick);return;}
   playing=false;playbackWanted=false;finished=true;driver.pause();return;
  }
  raf=rafRequest(tick);
 };
 const start=()=>{
  if(!driver||destroyed||reduced||!inViewport||!documentVisible||!playbackWanted)return;
  if(finished){current=0;finished=false;render(0);}
  playing=true;startedAt=now()-current/rate;driver.play();pauseFrame();raf=rafRequest(tick);
 };
 const pause=(preserveRefresh=false)=>{playing=false;pauseFrame();driver?.pause();if(!preserveRefresh){playbackWanted=false;refreshResume=false;playbackIntent++;}};
 const seek=milliseconds=>{pause();finished=false;render(Number(milliseconds)||0);if(current>=((driver?.duration)||recipe.reference.durationMs||recipe.durationMs))finished=true;};
 const replay=()=>{if(destroyed)return;playbackWanted=true;current=0;finished=false;render(0);if(reduced){render(driver?.reducedTime??driver?.duration??recipe.reference.durationMs);return;}playing=true;start();};
 const destroy=()=>{
  if(destroyed)return;destroyed=true;playbackWanted=false;generation++;playbackIntent++;refreshResume=false;pauseFrame();playing=false;intersection?.disconnect();resize?.disconnect();mutation?.disconnect();
  media.removeEventListener?.('change',onMotionPreference);doc.removeEventListener?.('visibilitychange',onVisibility);win.removeEventListener?.('resize',onResize);
  driver?.destroy();driver=null;
 };
 const controller={play:()=>{playbackWanted=true;start();},pause,seek,replay,destroy,setPlaybackRate(value){const next=Number(value);if(!Number.isFinite(next)||next<=0||next>4)throw new RangeError('Playback rate must be greater than zero and at most 4.');rate=next;if(playing)startedAt=now()-current/rate;},setLoop(value){loop=Boolean(value);},setOnion(value){customOnion=Boolean(value);driver?.setOnion?.(customOnion);},setText(value){customText=String(value);driver?.setText?.(customText);},setFont(value){customFont=String(value);driver?.setFont?.(customFont);},get playbackRate(){return rate;},get loop(){return loop;},get duration(){return driver?.duration||recipe.reference.durationMs||recipe.durationMs;},get reducedTime(){return driver?.reducedTime??driver?.duration??recipe.reference.durationMs??recipe.durationMs;},get currentTime(){return current;},get playState(){return destroyed?'idle':playing?'running':finished?'finished':'paused';},get ready(){return ready;}};
 const onMotionPreference=event=>{
  reduced=Boolean(event.matches);
  if(reduced){pause(true);finished=false;current=driver?.reducedTime??driver?.duration??recipe.reference.durationMs;try{render(current);}catch{}}
  else if(playbackWanted&&inViewport&&documentVisible)replay();
 };
 const onVisibility=()=>{documentVisible=!doc.hidden;if(!documentVisible)pause(true);else if(playbackWanted&&!finished&&inViewport&&!reduced)start();};
 const onResize=()=>{
  if(!driver)return;
  try{if(typeof driver.resize==='function')driver.resize();else render(current);}
  catch(error){root.dataset.motionError=error instanceof Error?error.message:String(error);}
 };
 media.addEventListener?.('change',onMotionPreference);doc.addEventListener?.('visibilitychange',onVisibility);
 win.addEventListener?.('resize',onResize,{passive:true});
 if(win.IntersectionObserver){intersection=new win.IntersectionObserver(entries=>{const entry=entries.at(-1);inViewport=Boolean(entry?.isIntersecting);if(!inViewport)pause(true);else if(playbackWanted&&!finished&&!reduced&&documentVisible)start();});intersection.observe(root);}
 if(win.ResizeObserver){resize=new win.ResizeObserver(onResize);resize.observe(root);}
 if(win.MutationObserver&&doc.documentElement){mutation=new win.MutationObserver(()=>{void refresh();});mutation.observe(doc.documentElement,{attributes:true,attributeFilter:['class','data-theme','style']});}
 doc.fonts?.ready?.then(()=>{if(!destroyed)try{render(current);}catch{}});
 const refresh=async()=>{
  if(destroyed)return;const request=++generation,intent=playbackIntent,wasPlaying=playbackWanted&&!finished,time=current;refreshResume=wasPlaying;pause(true);const previous=driver;driver=null;previous?.destroy();
  try{
   const next=await mountSourceEngine(root,recipe,{...options,locale:options.locale||doc.documentElement?.dataset?.locale||'ko'});
   if(destroyed||request!==generation){next.destroy();return;}
   driver=next;if(customOnion)driver.setOnion?.(true);if(customText!==null)driver.setText?.(customText);if(customFont!==null)driver.setFont?.(customFont);render(intent===playbackIntent?time:current);if(reduced)render(driver.reducedTime);else if(wasPlaying&&intent===playbackIntent)start();refreshResume=false;
  }catch(error){
   if(!destroyed&&request===generation){pause(true);refreshResume=false;driver?.destroy();driver=null;root.dataset.motionError=error instanceof Error?error.message:String(error);}
  }
 };
 const initialRequest=generation;
 const ready=(options.source?Promise.resolve(options.source):loadMotionSource(options)).then(async source=>{
  if(destroyed||initialRequest!==generation)return controller;
  const next=await mountSourceEngine(root,recipe,{...options,source,locale:options.locale||doc.documentElement?.dataset?.locale||'ko'});
  if(destroyed||initialRequest!==generation){next.destroy();return controller;}driver=next;if(customOnion)driver.setOnion?.(true);if(customText!==null)driver.setText?.(customText);if(customFont!==null)driver.setFont?.(customFont);
  if(reduced){current=driver.reducedTime;render(current);}else start();
  delete root.dataset.motionError;return controller;
 }).catch(error=>{if(!destroyed)root.dataset.motionError=error.message;throw error;});
 ready.catch(()=>{});
 return controller;
}
