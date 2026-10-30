import {createTokens,resolveTokens,formatValue} from './tokens.mjs';
import {normalizePreferences,resolveTheme,FONT_NAMES,calculateScale} from './preferences.mjs';
import {brandProfilePatch} from './brand-profiles.mjs';

const isRecord=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const consumerRoot=path=>path.startsWith('klic.component.')||path.startsWith('klic.semantic.material.');

/** Keep every consumer role, every runtime material choice, and their alias dependencies. */
export function pruneThemeTokens(tokens){
 const selected=new Set();
 function visit(path){
  if(selected.has(path))return;
  const token=tokens[path];
  if(!token)throw new Error(`Missing theme dependency: ${path}`);
  selected.add(path);
  if(typeof token.$value==='string'&&token.$value.startsWith('{'))visit(token.$value.slice(1,-1));
 }
 Object.keys(tokens).filter(consumerRoot).forEach(visit);
 return Object.fromEntries(Object.entries(tokens).filter(([path])=>selected.has(path)));
}

function canonicalPreferences(value){
 const input=isRecord(value)?value:{};
 const result={...input};
 if(Object.hasOwn(input,'id'))result.colorTheme=input.id;
 if(Object.hasOwn(input,'profile'))result.brandProfile=input.profile;
 if(Object.hasOwn(input,'mode'))result.theme=input.mode;
 return result;
}

function normalizedPreferences(value){
 const input=canonicalPreferences(value);
 return normalizePreferences({...brandProfilePatch(input.brandProfile),...input});
}

/** Resolve a portable theme without reading browser globals, storage, or the network. */
export function getThemeContext(preferences={},prefersDark=false){
 const normalized=normalizedPreferences(preferences),mode=resolveTheme(normalized,Boolean(prefersDark));
 const appearance={...normalized,theme:mode,brand:'a'};
 const tokens=createTokens('a',mode,appearance),resolved=resolveTokens(tokens);
 const cssVariables=Object.fromEntries(Object.keys(pruneThemeTokens(tokens))
  // Material selectors own these aliases so changing data-material remains live.
  .filter(path=>!path.startsWith('klic.component.surface.'))
  .map(path=>['--'+path.replaceAll('.','-'),formatValue(resolved[path])]));
 Object.assign(cssVariables,{
  '--klic-ui-font':`${FONT_NAMES[normalized.font]},system-ui,sans-serif`,
  '--klic-heading-font':`${FONT_NAMES[normalized.headingFont]},system-ui,sans-serif`,
  '--klic-custom-radius':`${normalized.radius}px`,
  '--klic-text-scale':String(normalized.textScale/100),
  '--klic-ui-scale':String(calculateScale(normalized)),
  '--klic-content-width':`${normalized.contentWidth}px`
 });
 return {...appearance,preferences:normalized,mode,brand:'a',tokens,resolved,cssVariables};
}

/** Apply to any DOM boundary; the caller includes the generated theme.css once. */
export function applyTheme(element,preferences={},environment={}){
 if(!element?.style?.setProperty||typeof element.setAttribute!=='function')throw new Error('applyTheme requires a DOM element with style and attributes');
 const host=environment.window??element.ownerDocument?.defaultView??globalThis;
 const matchMedia=environment.matchMedia??(typeof host.matchMedia==='function'?host.matchMedia.bind(host):null);
 const media=typeof matchMedia==='function'?matchMedia('(prefers-color-scheme: dark)'):null;
 let prefersDark=typeof environment.prefersDark==='boolean'?environment.prefersDark:Boolean(media?.matches);
 let selected=normalizedPreferences(preferences),context,listening=false,destroyed=false;
 let applied=new Set();

 function listen(enabled){
  if(!media||enabled===listening)return;
  if(enabled){
   if(typeof media.addEventListener==='function')media.addEventListener('change',onChange);
   else if(typeof media.addListener==='function')media.addListener(onChange);
  }else{
   if(typeof media.removeEventListener==='function')media.removeEventListener('change',onChange);
   else if(typeof media.removeListener==='function')media.removeListener(onChange);
  }
  listening=enabled;
 }
 function render(){
  context=getThemeContext(selected,prefersDark);
  const next=new Set(Object.keys(context.cssVariables));
  for(const name of applied)if(!next.has(name))element.style.removeProperty?.(name);
  for(const [name,value] of Object.entries(context.cssVariables))element.style.setProperty(name,value);
  applied=next;
  for(const [name,value] of Object.entries({
   'data-klic-theme':context.preferences.colorTheme,
   'data-color-theme':context.preferences.colorTheme,
   'data-brand-profile':context.preferences.brandProfile,
   'data-theme':context.mode,
   'data-material':context.preferences.material
  }))element.setAttribute(name,value);
  element.style.fontFamily='var(--klic-ui-font)';
  element.style.colorScheme=context.mode;
  listen(selected.theme==='system');
 }
 function onChange(event){
  if(destroyed||selected.theme!=='system')return;
  prefersDark=typeof event?.matches==='boolean'?event.matches:Boolean(media?.matches);
  render();
 }
 render();
 return {
  get context(){return context;},
  update(patch={}){
   if(destroyed)throw new Error('Cannot update a destroyed theme controller');
   const input=canonicalPreferences(patch);
   const profile=Object.hasOwn(input,'brandProfile')?brandProfilePatch(input.brandProfile):{};
   selected=normalizePreferences({...selected,...profile,...input});
   if(selected.theme==='system'&&media)prefersDark=Boolean(media.matches);
   render();
   return context;
  },
  destroy(){if(destroyed)return;listen(false);destroyed=true;}
 };
}
