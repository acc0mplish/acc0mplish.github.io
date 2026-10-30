export const SHOWCASE_SETTINGS_KEY='klic-showcase-preview-v1';
export function normalizeShowcaseSettings(value){
 const input=value&&typeof value==='object'&&!Array.isArray(value)&&(value.version===undefined||value.version===1)?value:{};
 const radius=typeof input.radius==='number'&&Number.isFinite(input.radius)?Math.max(0,Math.min(28,Math.round(input.radius))):16;
 return {version:1,appearance:['auto','light','dark'].includes(input.appearance)?input.appearance:'auto',density:['normal','compact'].includes(input.density)?input.density:'normal',radius};
}
export function initShowcaseSettings(root,{storage}={}){
 const canvas=root.querySelector('[data-hs-canvas]');if(!canvas)return ()=>{};
 if(storage===undefined)try{storage=globalThis.localStorage;}catch{}
 let settings=normalizeShowcaseSettings(null),canSave=!!storage;
 try{settings=normalizeShowcaseSettings(JSON.parse(storage?.getItem(SHOWCASE_SETTINGS_KEY)||'null'));}catch{canSave=false;}
 const controller=new AbortController(),en=root.ownerDocument?.documentElement.lang==='en';
 const controls={appearance:root.querySelector('[data-hs-appearance]'),density:root.querySelector('[data-hs-density]'),slider:root.querySelector('[data-hs-radius]'),number:root.querySelector('[data-hs-radius-input]')};
 function apply(){
  canvas.dataset.appearance=settings.appearance;canvas.dataset.density=settings.density;canvas.style.setProperty('--hs-demo-radius',settings.radius+'px');
  if(controls.appearance)controls.appearance.value=settings.appearance;if(controls.density)controls.density.value=settings.density;
  for(const control of [controls.slider,controls.number])if(control)control.value=String(settings.radius);
  const output=root.querySelector('[data-hs-radius-value]');if(output)output.textContent=settings.radius+' px';
  const note=root.querySelector('[data-hs-settings-scope]');if(note)note.textContent=canSave?(en?'Preview only. These settings are saved in this browser; global appearance is separate.':'이 체험 영역에만 적용되며 브라우저에 저장됩니다. 전역 테마 설정과는 별도입니다.'):(en?'Preview only. Browser storage is unavailable; these settings last for this page only.':'이 체험 영역에만 적용됩니다. 브라우저에 저장할 수 없어 현재 화면에서만 유지됩니다.');
 }
 function save(){if(!storage){canSave=false;return;}try{storage.setItem(SHOWCASE_SETTINGS_KEY,JSON.stringify(settings));canSave=true;}catch{canSave=false;}}
 function input(event){
  if(!event.target.matches('[data-hs-radius]')&&!event.target.matches('[data-hs-radius-input]'))return;
  if(event.target.value.trim()===''||!Number.isFinite(Number(event.target.value)))return;
  settings=normalizeShowcaseSettings({...settings,radius:Number(event.target.value)});save();apply();
 }
 function change(event){
  if(event.target===controls.appearance)settings=normalizeShowcaseSettings({...settings,appearance:event.target.value});
  else if(event.target===controls.density)settings=normalizeShowcaseSettings({...settings,density:event.target.value});
  else if(event.target===controls.number||event.target===controls.slider){input(event);apply();return;}else return;
  save();apply();
 }
 root.addEventListener('input',input,{signal:controller.signal});root.addEventListener('change',change,{signal:controller.signal});
 apply();return ()=>controller.abort();
}
