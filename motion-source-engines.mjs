import {createMotionSourceEnvironment,MOTION_SOURCE_VERSION} from './motion-source-factory.mjs';
import {MOTION_SOURCE_STYLES} from './motion-source-styles.mjs';
import {applyCanvasPalette,mapMotionFont,mapMotionPaint,resolveMotionFonts,resolveMotionPalette,rewriteMotionColors,rewriteMotionFonts,wrapMotionCanvasContext} from './motion-palette.mjs';

const environments=new WeakMap();

export function loadMotionSource(options={}){
 const actualWindow=options.window||globalThis.window,document=options.document||globalThis.document;
 if(!actualWindow||!document)return Promise.reject(new Error('Motion source engine requires a mounted browser window and document.'));
 let versions=environments.get(actualWindow);if(!versions){versions=new Map();environments.set(actualWindow,versions);}
 const version=options.version||MOTION_SOURCE_VERSION;
 if(versions.has(version))return versions.get(version);
 const pending=Promise.resolve().then(()=>createMotionSourceEnvironment({window:actualWindow,document,console:options.console})).catch(error=>{versions.delete(version);throw error;});
 versions.set(version,pending);return pending;
}

function withCanvasColorMapping(doc,mapColor,mapFont,mapStyle,draw){
 const original=doc.createElement,descriptor=Object.getOwnPropertyDescriptor(doc,'createElement');let patched=false;
 try{
  Object.defineProperty(doc,'createElement',{configurable:true,writable:true,value:function(name,...args){
   const element=original.call(doc,name,...args);if(String(name).toLowerCase()==='canvas'&&element?.getContext){const get=element.getContext.bind(element);element.getContext=(...contextArgs)=>wrapMotionCanvasContext(get(...contextArgs),mapColor,mapFont,mapStyle);}return element;
  }});patched=true;
 }catch{}
 try{return draw();}finally{if(patched){try{if(descriptor)Object.defineProperty(doc,'createElement',descriptor);else delete doc.createElement;}catch{}}}
}

function mountCanvas(root,recipe,source,locale){
 const doc=root.ownerDocument,canvas=doc.createElement('canvas');canvas.style||={};canvas.className='motion-source-canvas';canvas.width=640;canvas.height=400;canvas.style.width='100%';canvas.style.height='100%';canvas.setAttribute('aria-hidden','true');root.replaceChildren(canvas);
 const getContext=canvas.getContext.bind(canvas),mapColor=(value,context)=>source.KLIC_MOTION_COLOR?.(value,context)||value,mapFont=value=>source.KLIC_MOTION_FONT?.(value)||value,mapStyle=value=>source.KLIC_MOTION_REWRITE_COLORS?.(value)||value,mapFamily=value=>source.KLIC_MOTION_FAMILY?.(value)||'other';
 canvas.getContext=(...args)=>wrapMotionCanvasContext(getContext(...args),mapColor,mapFont,mapStyle,mapFamily);
 const reference=recipe.reference,engine=reference.engine==='text'?source.TEXTMOTION:source.ATLAS;
 const demo=reference.engine==='text'?source.TEXTMOTION.get(reference.demoId):source.ATLAS.get(reference.demoId);
 if(!demo)throw new Error(`Missing ${reference.engine} renderer for ${reference.id}:${reference.pattern}.`);
 const duration=Math.max(1,reference.engineDuration||reference.durationMs||recipe.durationMs);let sample=recipe.preview?.sample?.[locale]||recipe.preview?.sample?.ko||'KLIC',customFont=null,onion=false;
 const reducedTime=Math.max(0,Math.min(duration,(engine.stillTime?.(demo)||0)*1000));
 let current=0,destroyed=false;
 const sizeCanvas=()=>{
  const rect=root.getBoundingClientRect?.()||{},ratio=Math.min(2,Math.max(1,Number(doc.defaultView?.devicePixelRatio)||1));
  const width=Math.max(1,Math.round((rect.width||640)*ratio)),height=Math.max(1,Math.round((rect.height||width*10/16)*ratio));
  if(canvas.width===width&&canvas.height===height)return false;canvas.width=width;canvas.height=height;return true;
 };
 const render=milliseconds=>{
  if(destroyed)return;current=Math.max(0,Math.min(duration,milliseconds));sizeCanvas();const fontRole=reference.engine==='text'?'heading':'body',{fonts}=applyCanvasPalette(source,root,fontRole,{id:reference.id,pattern:reference.pattern}),fontFamily=customFont||(fontRole==='heading'?fonts.canvasHeading:fonts.canvas);if(customFont)source.KLIC_MOTION_FONT=value=>mapMotionFont(value,{...fonts,canvas:customFont,canvasHeading:customFont,heading:customFont},fontRole);
  const options=reference.engine==='text'?{text:sample,language:locale,locale,font:fontFamily,fontFamily,family:fontFamily,onion}:{font:fontFamily,fontFamily,family:fontFamily,onion};
  if(reference.engine==='text'){engine.setLanguage?.(locale);engine.setOptions?.({text:sample,lang:locale,font:'sans'});}
  demo._err=0;
  withCanvasColorMapping(doc,mapColor,mapFont,mapStyle,()=>engine.draw(canvas,demo,current/1000,options));
  if(demo._err)throw new Error(`Source Canvas renderer failed: ${demo.id||reference.id}`);
 };
 render(0);
 return {duration,reducedTime,render,setOnion(value){onion=Boolean(value);render(current);},setText(value){sample=value;render(current);},setFont(value){customFont=value||null;render(current);if(customFont&&doc.fonts?.load)void doc.fonts.load('16px '+customFont).then(()=>{if(!destroyed&&customFont===value)render(current);}).catch(()=>{});},resize(){if(sizeCanvas())render(current);},pause(){},play(){},destroy(){destroyed=true;canvas.remove();}};
}

const SOURCE_EASINGS=Object.freeze({
 linear:'linear',easeOutCubic:'cubic-bezier(.33,1,.68,1)',easeOutQuint:'cubic-bezier(.22,1,.36,1)',
 easeInCubic:'cubic-bezier(.32,0,.67,0)',easeInOutCubic:'cubic-bezier(.65,0,.35,1)',
 easeOutQuart:'cubic-bezier(.25,1,.5,1)',easeInQuart:'cubic-bezier(.5,0,.75,0)',
 easeInOutQuint:'cubic-bezier(.83,0,.17,1)',easeOutSine:'cubic-bezier(.61,1,.88,1)',
 easeInOutSine:'cubic-bezier(.37,0,.63,1)',easeOutExpo:'cubic-bezier(.16,1,.3,1)',
 easeOutBack:'cubic-bezier(.34,1.56,.64,1)',easeInBack:'cubic-bezier(.36,0,.66,-.56)',
 easeInOutBack:'cubic-bezier(.68,-.6,.32,1.6)',easeOutBounce:'cubic-bezier(.34,1.35,.64,1)',
 easeOutElastic:'cubic-bezier(.2,1.55,.45,1)'
});

export function normalizeMotionEasing(value){
 const source=String(value||'linear').trim();
 if(/^(?:linear|ease|ease-in|ease-out|ease-in-out|step-start|step-end)$/.test(source)||/^(?:steps|cubic-bezier|linear)\(/.test(source))return source;
 const alias=source.match(/(?:power3\.out|out\(3\)|easeOutCubic)/i)?'easeOutCubic':source.match(/(?:inOut\(3\)|easeInOutCubic)/i)?'easeInOutCubic':source.match(/\((ease[A-Za-z]+)\)/)?.[1]||source;
 return SOURCE_EASINGS[alias]||'cubic-bezier(.22,1,.36,1)';
}

export function normalizeMotionKeyframe(frame,palette,context={}){
 const output={};for(const [key,value]of Object.entries(frame)){
  if(key==='easing'&&typeof value==='string')output[key]=normalizeMotionEasing(value);
  else output[key]=typeof value==='string'&&/(?:color|fill|stroke|shadow|filter|background)/i.test(key)?mapMotionPaint(value,palette,{...context,property:key}):value;
 }
 return output;
}

export function tuneMotionKeyframe(frame,amplitude=1){
 if(!frame.transform||amplitude===1)return frame;
 const transform=frame.transform.replace(/(-?\d+(?:\.\d+)?)(px|deg)/g,(_match,value,unit)=>`${Math.round(Number(value)*amplitude*10)/10}${unit}`);
 return {...frame,transform};
}

async function mountSemantic(root,recipe,source,locale,options={}){
 const doc=root.ownerDocument,palette=resolveMotionPalette(root),fonts=resolveMotionFonts(root),pattern=recipe.reference.pattern,demo=source.MotionRuntime.definitions[pattern],tokenizedBackdrop=recipe.category==='backdrop';
 if(!demo?.html||!Array.isArray(demo.tracks))throw new Error(`Missing semantic renderer for ${recipe.reference.id}:${recipe.reference.pattern}.`);
 const shadow=root.shadowRoot||root.attachShadow({mode:'open'}),style=doc.createElement('style');
 style.textContent=`:host{display:block;position:relative;width:100%;height:100%;overflow:hidden;color:var(--klic-semantic-color-text,#132c46);font-family:var(--klic-component-text-body-font-family,system-ui,sans-serif)}.semantic-demo{position:absolute;inset:0;overflow:hidden;font-family:var(--klic-component-text-body-font-family,system-ui,sans-serif)}.semantic-demo .mb-caption{color:var(--klic-semantic-color-muted,#52657b)}.mc-scene .mc-text,.mc-scene .mc-victory{font-family:var(--klic-component-heading-font-family,var(--klic-component-text-body-font-family,system-ui,sans-serif))}\n${Object.values(MOTION_SOURCE_STYLES).map(css=>rewriteMotionFonts(rewriteMotionColors(css,palette,{pattern}),{pattern})).join('\n')}`;
 const stage=doc.createElement('div'),scene=doc.createElement('div');stage.className='motion-source-semantic-stage';scene.className='semantic-demo';scene.innerHTML=tokenizedBackdrop?demo.html:rewriteMotionFonts(rewriteMotionColors(demo.html,palette,{pattern}),{pattern});stage.append(scene);shadow.replaceChildren(style,stage);root.replaceChildren();
 const sourceItem={...recipe,pattern:recipe.reference.pattern,duration:recipe.reference.durationMs||recipe.durationMs,stagger:0};
 const records=source.MotionRuntime.records(stage,sourceItem,{duration:sourceItem.duration,stagger:Number(options.stagger)||0})||[];
 if(!records.length)throw new Error(`Semantic renderer produced no tracks for ${recipe.reference.id}:${recipe.reference.pattern}.`);
 const duration=Math.max(1,sourceItem.duration||demo.duration||recipe.durationMs),reducedTime=duration*source.MotionRuntime.representative(sourceItem),animations=[];
 for(const record of records){
  const keyframes=record.keyframes.map(frame=>tuneMotionKeyframe(normalizeMotionKeyframe(frame,palette,{pattern,target:record.target}),Number(options.amplitude)||1));
  const animation=record.target.animate(keyframes,{duration,easing:normalizeMotionEasing(options.easing||record.easing||demo.easing||'linear'),fill:'both',iterations:1});animation.pause();animations.push(animation);
 }
 const render=milliseconds=>{const time=Math.max(0,Math.min(duration,milliseconds));for(const animation of animations)animation.currentTime=time;};
 const play=()=>{for(const animation of animations)animation.play();};
 const pause=()=>{for(const animation of animations)animation.pause();};
 render(reducedTime);if(locale==='en')scene.lang='en';
 return {duration,reducedTime,render,play,pause,destroy(){pause();for(const animation of animations)animation.cancel();shadow.replaceChildren();}};
}

export async function mountSourceEngine(root,recipe,options={}){
 const source=options.source||await loadMotionSource(options);
 if(!root?.ownerDocument)throw new TypeError('mountSourceEngine requires a DOM element.');
 if(recipe.reference.engine==='semantic')return mountSemantic(root,recipe,source,options.locale||'ko',options);
 return mountCanvas(root,recipe,source,options.locale||'ko');
}
