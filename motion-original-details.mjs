import {loadMotionSource,normalizeMotionEasing,normalizeMotionKeyframe} from './motion-source-engines.mjs';
import {MOTION_SOURCE_STYLES} from './motion-source-styles.mjs';
import {SITE_ORIGIN} from './site-metadata.mjs';
import {CRAYON_HELPERS} from './motion-crayon-helpers.mjs';
import {resolveMotionPalette,rewriteMotionColors,rewriteMotionFonts} from './motion-palette.mjs';

const kebab=name=>name.startsWith('--')?name:name.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase());
const asList=value=>Array.isArray(value)?value:value?[value]:[];

/** Source semantic tracks become copyable examples using the same KLIC-mapped paints. */
export function buildSemanticExamples(recipe,demo,host,compile=null){
 if(!demo?.html||!Array.isArray(demo.tracks))throw new Error('Missing original semantic tracks.');
 const pattern=recipe.reference.pattern,palette=resolveMotionPalette(host),duration=recipe.reference.durationMs||recipe.durationMs,reducedProgress=Math.max(0,Math.min(1,demo.reducedProgress??1)),reducedTime=Math.round(duration*reducedProgress);
 const markup=recipe.category==='backdrop'?demo.html:rewriteMotionFonts(rewriteMotionColors(demo.html,palette,{pattern}),{pattern});
 const styles=Object.values(MOTION_SOURCE_STYLES).map(css=>rewriteMotionFonts(rewriteMotionColors(css,palette,{pattern}),{pattern})).join('\n');
 const tracks=demo.tracks.map(track=>({selector:track.selector,keyframes:(recipe.source==='klic-authored'&&compile?compile(track.keyframes,duration,track.delay||0):track.keyframes).map(frame=>normalizeMotionKeyframe(frame,palette,{pattern,target:track.selector})),easing:normalizeMotionEasing(track.easing||demo.easing||'linear')}));
 const prefix='klic-'+recipe.id.replace(/[^a-z0-9-]/g,'-'),groups=new Map();
 const keyframes=tracks.map((track,index)=>{
  const name=`${prefix}-${index}`;if(!groups.has(track.selector))groups.set(track.selector,[]);groups.get(track.selector).push(`${name} ${duration}ms ${track.easing} both`);
  return `@keyframes ${name} {\n${track.keyframes.map((frame,i)=>`  ${Math.round((frame.offset??i/Math.max(1,track.keyframes.length-1))*10000)/100}% { ${Object.entries(frame).filter(([key])=>!['offset','easing','composite'].includes(key)).map(([key,value])=>`${kebab(key)}: ${value};`).join(' ')}${frame.easing?` animation-timing-function: ${frame.easing};`:''} }`).join('\n')}\n}`;
 }).join('\n');
 const rules=[...groups].map(([selector,animations])=>`.motion-source-stage :is(${selector}) { animation: ${animations.join(', ')}; }\n@media (prefers-reduced-motion:reduce) { .motion-source-stage :is(${selector}) { animation-play-state:paused; animation-delay:${animations.map(()=>`-${reducedTime}ms`).join(', ')}; } }`).join('\n');
 const css=`.motion-source-stage { position:relative; overflow:hidden; aspect-ratio:16/10; color:var(--klic-semantic-color-text,#132c46); background:var(--klic-semantic-color-surface,#fbfcfe); font-family:var(--klic-component-text-body-font-family,system-ui,sans-serif);\n${styles}\n}\n${keyframes}\n${rules}`;
 const html=`<div class="motion-source-stage"><div class="semantic-demo">${markup}</div></div>`;
 const payload=JSON.stringify(tracks,null,2), setup=`const tracks = ${payload};\nconst root = document.querySelector('.motion-source-stage');\nconst reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;\nconst animations = tracks.flatMap(track => [...root.querySelectorAll(track.selector)].map(node => {\n  const animation = node.animate(track.keyframes, {duration:${duration}, easing:track.easing, fill:'both'});\n  if (reduce) { animation.pause(); animation.currentTime = ${reducedTime}; }\n  return animation;\n}));\n// Call dispose() when the view is removed.\nfunction dispose() { animations.forEach(animation => animation.cancel()); }`;
 const gsap=`${setup}\n// GSAP drives the same WAAPI tracks. Include GSAP separately.\nanimations.forEach(animation => animation.pause());\nconst clock={ms:0};\nconst tween=reduce?null:gsap.to(clock,{ms:${duration},duration:${duration/1000},ease:'none',onUpdate:()=>animations.forEach(animation=>animation.currentTime=clock.ms)});\nfunction disposeMotion(){ tween?.kill(); dispose(); }`;
 const react=`import {useEffect,useRef} from 'react';\nconst tracks=${payload};\nconst html=${JSON.stringify(markup)};\nexport function MotionExample(){\n const ref=useRef(null);\n useEffect(()=>{const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;const animations=tracks.flatMap(track=>[...ref.current.querySelectorAll(track.selector)].map(node=>{const a=node.animate(track.keyframes,{duration:${duration},easing:track.easing,fill:'both'});if(reduce){a.pause();a.currentTime=${reducedTime};}return a;}));return ()=>animations.forEach(a=>a.cancel());},[]);\n return <div className="motion-source-stage"><div ref={ref} className="semantic-demo" dangerouslySetInnerHTML={{__html:html}} /></div>;\n}`;
 return {html,css,waapi:setup,gsap,react};
}

/** Return the supplied catalog's own item-specific guidance and examples. */
export async function getOriginalMotionDetails(recipe,{locale='ko',source,host}={}){
 const env=source||await loadMotionSource();
 const item=env.MOTION_LIBRARY.find(entry=>entry.id===recipe.reference.id&&entry.pattern===recipe.reference.pattern)||(recipe.source==='klic-authored'?{values:[recipe.durationMs+'ms',recipe.easing],valuesEn:[recipe.durationMs+'ms',recipe.easing],tips:[recipe.summary.ko],tipsEn:[recipe.summary.en],sources:[recipe.reference.definitionPath,recipe.reference.sourceRecord].map(path=>SITE_ORIGIN+'/'+path),recipe:recipe.summary.ko,recipeEn:recipe.summary.en}:null);
 if(!item)throw new Error(`Missing original motion ${recipe.reference.id}:${recipe.reference.pattern}`);
 const localized=(ko,en)=>locale==='en'?(en||ko):ko;
 const demo=recipe.reference.engine==='text'?env.TEXTMOTION.get(recipe.reference.demoId):recipe.reference.engine==='atlas'?env.ATLAS.get(recipe.reference.demoId):null;
 const values=recipe.reference.engine==='atlas'?localized(demo?.v||item.values,demo?.vEn||item.valuesEn):localized(item.values,item.valuesEn);
 const sources=recipe.reference.engine==='atlas'?asList(demo?.s).map(key=>env.ATLAS.sources[key]).filter(Boolean):asList(item.sources).map(url=>[String(url).replace(/^https?:\/\/(www\.)?/,'').replace(/\/$/,''),url]);
 const details={tokenized:recipe.source==='klic-authored'||recipe.category==='backdrop',tips:asList(localized(item.tips,item.tipsEn)).flatMap(value=>String(value).split('|')).map(value=>value.trim()).filter(Boolean),feelings:asList(item.feelings),inputs:asList(localized(item.inputs,item.inputsEn)),values:asList(values),sources,recipe:localized(item.recipe,item.recipeEn)||'',snippets:{}};
 if(recipe.reference.engine==='text'){
  details.snippets={...item.recipes};
  if(demo){const seek=env.TEXTMOTION.seekSource(demo);details.snippets.seek=/\bcrDense\b/.test(seek)?CRAYON_HELPERS+'\n'+seek:seek;}
  if(locale==='en'&&details.snippets.aeEn)details.snippets.ae=details.snippets.aeEn;
  delete details.snippets.aeEn;
 }else if(recipe.reference.engine==='atlas'){
  if(demo)details.snippets=env.ATLAS.snippets(item,demo,localized(item.title,item.titleEn),locale,localized(item.description,item.descriptionEn),locale==='en'?'Replay':'다시 재생');
 }else details.snippets=buildSemanticExamples(recipe,env.MotionRuntime.definitions[recipe.reference.pattern],host,env.MotionRuntime.compile);
 return details;
}

/** Export only the selected renderer, its tracks and the assets it needs. */
export async function createStandaloneMotionDocument(recipe,{host,locale='ko',source,sample=null,sampleLanguage=null,font='default',fetch:fetcher=globalThis.fetch,base=globalThis.document?.baseURI}={}){
 if(!recipe?.reference?.pattern||!base||typeof fetcher!=='function')throw new TypeError('Standalone export requires a motion and a browser base URL.');
 const doc=host?.ownerDocument||globalThis.document;
 let env=source;
 if(!env&&recipe.reference.engine==='semantic')env=await loadMotionSource();
 if(!env){
  // The bundled UI minifies function names and breaks source serialization. Load
  // the canonical unminified module for extraction; it is not embedded in HTML.
  const url=new URL('motion-source-factory.mjs',base);url.search='?standalone=1';
  const factory=await import(/* @vite-ignore */ url.href);
  env=factory.createMotionSourceEnvironment({window:doc?.defaultView||globalThis.window,document:doc});
 }
 const palette=resolveMotionPalette(host);
 const extraFont=recipe.reference.engine==='text'?({mindeulle:{file:'fonts/Hakgyoansim_MindeulleholssiOTFR.otf',family:'KlicMindeulle',format:'opentype'},mono:{file:'fonts/GeistMono-Regular.woff2',family:'KlicGeistMono',format:'woff2'}}[font]||null):null;
 const names=['fonts/pretendard-regular.woff2',...(font==='paperlogy'?['fonts/paperlogy-regular.woff2','fonts/paperlogy-bold.woff2']:[]),...(recipe.reference.engine==='semantic'?[]:['motion-palette.mjs']),...(extraFont?[extraFont.file]:[])];
 const assets=await Promise.all(names.map(async name=>{const url=new URL(name,base);if(name.endsWith('.mjs'))url.search='?raw';const response=await fetcher(url.href,{cache:'no-cache'});if(!response.ok)throw new Error(`Cannot load ${name} (${response.status}).`);return new Uint8Array(await response.arrayBuffer());}));
 const font64=bytes=>{let binary='';for(let offset=0;offset<bytes.length;offset+=8192)binary+=String.fromCharCode(...bytes.subarray(offset,offset+8192));return btoa(binary);};
 const roles={accent:'accent','accent-hover':'accentHover','accent-active':'accentActive',text:'text',muted:'muted',surface:'surface','surface-soft':'surfaceSoft',panel:'panel',border:'border','control-border':'controlBorder','on-accent':'onAccent',success:'success',warning:'warning',danger:'danger'};
 const style=host?.ownerDocument?.defaultView?.getComputedStyle?.(host);
 const primitives=['night','ink','white','paper','muted','blue-600','blue-100','blue-700','blue-800'].map(name=>{const token='--klic-primitive-color-'+name,value=style?.getPropertyValue(token)?.trim();return value?`${token}:${value};`:'';}).join('');
 const selectedFamily=extraFont?.family||(font==='paperlogy'?'KlicPaperlogy':'KlicPretendard');
 const paperlogyRegular=names.indexOf('fonts/paperlogy-regular.woff2'),paperlogyBold=names.indexOf('fonts/paperlogy-bold.woff2');
 const paletteIndex=names.indexOf('motion-palette.mjs');
 const variables=Object.entries(roles).map(([name,key])=>`--klic-semantic-color-${name}:${palette[key]};`).join('')+primitives+`--klic-component-text-body-font-family:KlicPretendard,system-ui,sans-serif;--klic-component-heading-font-family:${selectedFamily},system-ui,sans-serif;`;
 const fonts=`@font-face{font-family:KlicPretendard;src:url(data:font/woff2;base64,${font64(assets[0])}) format('woff2');font-weight:400}${paperlogyRegular>=0?`@font-face{font-family:KlicPaperlogy;src:url(data:font/woff2;base64,${font64(assets[paperlogyRegular])}) format('woff2');font-weight:400}@font-face{font-family:KlicPaperlogy;src:url(data:font/woff2;base64,${font64(assets[paperlogyBold])}) format('woff2');font-weight:700}`:''}${extraFont?`@font-face{font-family:${extraFont.family};src:url(data:font/${extraFont.format};base64,${font64(assets.at(-1))}) format('${extraFont.format}');font-weight:400 800}`:''}`;
 const shell=`${fonts}:root{${variables}}body{margin:0;padding:24px;background:var(--klic-semantic-color-surface);color:var(--klic-semantic-color-text);font-family:KlicPretendard,system-ui,sans-serif}main{max-width:760px;margin:auto}button{margin-top:16px;padding:8px 16px;border:1px solid var(--klic-semantic-color-border);border-radius:var(--klic-component-card-radius-default,.5rem);background:var(--klic-semantic-color-panel);color:var(--klic-semantic-color-text)}.motion-source-stage{position:relative;overflow:hidden;aspect-ratio:16/10;border:1px solid var(--klic-semantic-color-border);border-radius:var(--klic-component-card-radius-default,.5rem);background:var(--klic-semantic-color-surface);color:var(--klic-semantic-color-text);contain:content}.semantic-demo{position:absolute;inset:0;overflow:hidden}canvas{display:block;width:100%;height:100%;font-family:KlicPretendard,system-ui,sans-serif}`;
 const title=String(recipe.title?.[locale]||recipe.title?.ko||recipe.id).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 const json=value=>JSON.stringify(value).replaceAll('<','\\u003c').replaceAll('\u2028','\\u2028').replaceAll('\u2029','\\u2029');
 let content,script,styles='';
 if(recipe.reference.engine==='semantic'){
  const demo=env.MotionRuntime.definitions[recipe.reference.pattern];if(!demo||!doc?.createElement)throw new Error('Semantic export requires a browser document.');
  const pattern=recipe.reference.pattern,markup=recipe.category==='backdrop'?demo.html:rewriteMotionFonts(rewriteMotionColors(demo.html,palette,{pattern}),{pattern});
  const stage=doc.createElement('div');stage.innerHTML=`<div class="semantic-demo">${markup}</div>`;
  const duration=Math.max(1,recipe.reference.durationMs||recipe.durationMs),item={...recipe,pattern,duration,stagger:0};
  const records=env.MotionRuntime.records(stage,item,{duration,stagger:0})||[];if(!records.length)throw new Error('No animation tracks for selected motion.');
  const tracks=records.map((record,index)=>{const id=String(index);record.target.setAttribute('data-klic-export-'+id,'');return {selector:`[data-klic-export-${id}]`,keyframes:record.keyframes.map(frame=>normalizeMotionKeyframe(frame,palette,{pattern,target:record.target})),easing:normalizeMotionEasing(record.easing||demo.easing||'linear')};});
  content=stage.innerHTML;
  const rawStyles=Object.values(MOTION_SOURCE_STYLES).map(css=>rewriteMotionFonts(rewriteMotionColors(css,palette,{pattern}),{pattern})).join('\n');
  const Sheet=doc.defaultView?.CSSStyleSheet;
  if(Sheet){try{const sheet=new Sheet();sheet.replaceSync(rawStyles);const filter=rules=>[...rules].map(rule=>{if(rule.selectorText){const selectors=rule.selectorText.split(',').map(value=>value.trim().replace(/::[\w-]+(?:\([^)]*\))?/g,'').replace(/:(?:hover|focus(?:-within|-visible)?|active|checked|disabled|enabled)\b/g,''));return selectors.some(selector=>{try{return stage.matches(selector)||Boolean(stage.querySelector(selector));}catch{return true;}})?rule.cssText:'';}if(rule.cssRules){const nested=filter(rule.cssRules);return nested?`${rule.conditionText?'@media '+rule.conditionText:rule.cssText.slice(0,rule.cssText.indexOf('{'))}{${nested}}`:'';}return rule.cssText;}).join('\n');styles=filter(sheet.cssRules);}catch{styles=rawStyles;}}else styles=rawStyles;
  const still=Math.round(duration*env.MotionRuntime.representative(item));
  script=`const root=document.querySelector('.motion-source-stage'),tracks=${json(tracks)},duration=${duration},still=${still};const reduce=matchMedia('(prefers-reduced-motion: reduce)');let animations=[];function replay(){animations.forEach(a=>a.cancel());animations=tracks.flatMap(t=>[...root.querySelectorAll(t.selector)].map(node=>{const a=node.animate(t.keyframes,{duration,easing:t.easing,fill:'both',iterations:reduce.matches?1:Infinity});if(reduce.matches){a.pause();a.currentTime=still;}return a;}));}document.querySelector('[data-replay]').addEventListener('click',replay);reduce.addEventListener?.('change',replay);replay();`;
 }else{
  const text=recipe.reference.engine==='text',engine=text?env.TEXTMOTION:env.ATLAS,demo=engine.get(recipe.reference.demoId),item=env.MOTION_LIBRARY.find(row=>row.id===recipe.reference.id&&row.pattern===recipe.reference.pattern);if(!demo||!item)throw new Error('Missing selected Canvas motion.');
  const original=text?engine.documentFor(demo,{lang:locale}):engine.documentFor(item,demo,'',locale);
  const body=original.match(/<script>([\s\S]*?)<\/script>/i)?.[1];if(!body)throw new Error('Missing selected Canvas renderer.');
  let adapted=body.replace(/Object\.assign\(K, \{[^\n]*\}\);/,'Object.assign(K, motionPalette.KLIC_MOTION_PALETTE);').replace("g = canvas.getContext('2d')","g = motionPalette.KLIC_MOTION_WRAP_CONTEXT(canvas.getContext('2d'))").replaceAll('Pretendard','KlicPretendard').replace("document.querySelector('#replay')","document.querySelector('[data-replay]')").replace("const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;","const motionMedia=matchMedia('(prefers-reduced-motion: reduce)');let reduce=motionMedia.matches;motionMedia.addEventListener?.('change',event=>{reduce=event.matches;if(!reduce)start=performance.now();requestAnimationFrame(frame);});");
  if(/\bcrDense\b/.test(adapted))adapted=CRAYON_HELPERS+'\n'+adapted;
  if(text){const textSample=sample??recipe.preview?.sample?.[locale]??recipe.preview?.sample?.ko??'KLIC';adapted=adapted.replace(/const o = (\{[^\n]*\});/,`const o = Object.assign($1, ${json({text:textSample,lang:sampleLanguage||locale,language:locale,locale,font:'sans',fontFamily:selectedFamily+',system-ui,sans-serif',family:selectedFamily+',system-ui,sans-serif'})});`);}
  const raw=new TextDecoder().decode(assets[paletteIndex]),paletteSource=raw.startsWith('export default "')?JSON.parse(raw.split('\n',1)[0].slice(15).replace(/;\s*$/,'')):raw;
  if(!adapted.includes('motionPalette.KLIC_MOTION_WRAP_CONTEXT')||!adapted.includes('Object.assign(K, motionPalette.KLIC_MOTION_PALETTE)'))throw new Error('Unsupported selected Canvas export.');
  script=`const motionPalette=(()=>{${paletteSource.replace(/^export /gm,'')}\nconst result={};applyCanvasPalette(result,document.body,${json(text?'heading':'body')},${json({id:recipe.reference.id,pattern:recipe.reference.pattern})});return result;})();\n`+adapted;
  content='<canvas aria-hidden="true"></canvas>';
 }
 return `<!doctype html><html lang="${locale==='en'?'en':'ko'}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>${(shell+styles).replace(/<\/style/gi,'<\\/style')}</style><main><h1>${title}</h1><div class="motion-source-stage" data-klic-motion-root>${content}</div><button type="button" data-replay>${locale==='en'?'Replay':'다시 재생'}</button><p>${recipe.source==='klic-authored'?'KLIC-authored FlowMotion · '+recipe.id:'Copyright © 2026 acc0mplish. All rights reserved.'}</p></main><script>${script.replace(/<\/script/gi,'<\\/script')}</script></html>`;
}
