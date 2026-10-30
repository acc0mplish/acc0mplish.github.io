import {FONT_IDS,FONT_OPTIONS} from './font-registry.mjs';
import {MATERIAL_IDS,MATERIAL_LABELS,materialStylesCSS} from './materials.mjs';
import {icon,escapeHTML as esc} from './catalog.js';
import {normalizePreferences,FONT_NAMES} from './preferences.mjs';
import {createTokens,resolveTokens,formatValue} from './tokens.mjs';
import {COLOR_THEMES,COLOR_THEME_IDS,colorThemePatch} from './color-themes.mjs';

export const PREVIEW_STORAGE_KEY='klic-preview-overrides-v2';
const LEGACY_PREVIEW_STORAGE_KEY='klic-preview-overrides-v1';
export const DEFAULT_PREVIEW_WIDTH=1920;
export function previewEntryOverrides(saved={}){
 const {width,widthMode,fit,zoom,...appearance}=normalizePreviewOverrides(saved);
 return {...appearance,widthMode:'fluid',fit:true,zoom:100};
}
const PANEL_STORAGE_KEY='klic-preview-panel-v1';
const numeric={width:[240,3840],zoom:[25,150],radius:[0,24],textScale:[90,150]};
const choices={material:MATERIAL_IDS,colorTheme:COLOR_THEME_IDS,theme:['light','dark'],font:FONT_IDS,headingFont:FONT_IDS,accent:['klic','royal','navy'],neutral:['slate','gray'],density:['compact','normal','relaxed'],chartPalette:['theme','blue','violet','contrast'],widthMode:['fixed','fluid']};
export function normalizePreviewOverrides(value={}){
 const result={};if(!value||typeof value!=='object')return result;
 for(const [key,[min,max]] of Object.entries(numeric))if(typeof value[key]==='number'&&Number.isFinite(value[key]))result[key]=Math.round(Math.max(min,Math.min(max,value[key])));
 for(const [key,values] of Object.entries(choices))if(values.includes(value[key]))result[key]=value[key];
 for(const key of ['showAvatars','showProgressRings','fit'])if(typeof value[key]==='boolean')result[key]=value[key];
 return result;
}
export function previewContext(base={},overrides={}){
 const o=normalizePreviewOverrides(overrides),{width,zoom,fit,widthMode,...appearance}=o;
 return {...normalizePreferences({...base,...appearance}),theme:appearance.theme||(base.theme==='dark'?'dark':'light'),brand:base.brand==='b'?'b':'a',headingFont:appearance.headingFont||base.headingFont||base.font||'paperlogy',autoScale:false,uiScale:100};
}
export function readPreviewStore(storage){
 try{const current=storage?.getItem(PREVIEW_STORAGE_KEY),legacy=current==null,raw=JSON.parse(current??storage?.getItem(LEGACY_PREVIEW_STORAGE_KEY)??'{}');if(!raw||typeof raw!=='object'||Array.isArray(raw))return {};return Object.fromEntries(Object.entries(raw).filter(([id])=>/^(component|block):[a-z0-9-]{1,90}$/.test(id)).slice(-300).map(([id,p])=>{const value=normalizePreviewOverrides(p);if(legacy&&value.font)value.headingFont=value.font;return [id,value];}));}catch{return {};}
}
function scopeDeclarations(context){
 const values=resolveTokens(createTokens(context.brand,context.theme,context));
 return {...Object.fromEntries(Object.entries(values).map(([k,v])=>['--'+k.replaceAll('.','-'),formatValue(v)])),
 '--klic-custom-radius':context.radius+'px','--klic-text-scale':String(context.textScale/100),'--klic-ui-font':`${FONT_NAMES[context.font]},system-ui,sans-serif`,'--klic-heading-font':`${FONT_NAMES[context.headingFont]},system-ui,sans-serif`,
 '--klic-ui-soft':'var(--klic-semantic-color-surface-soft)','--klic-ui-selected':'var(--klic-semantic-color-surface-selected)',
 '--klic-ui-marker':'var(--klic-semantic-color-accent)','--klic-ui-primary-ink':'var(--klic-semantic-color-on-accent)',
 '--klic-ui-code':context.theme==='dark'?'#c4d5f5':'#26476f','--klic-ui-grid':context.theme==='dark'?'#30435f':'#dce4f0','--klic-ui-chart-subtle':context.theme==='dark'?'#3b5278':'#d4e0f4','--klic-ui-royal':context.theme==='dark'?'#a9b8ff':'#2641b9',
 '--klic-ui-feature':context.theme==='dark'?'#142645':'#142c50','--klic-ui-feature-text':'#fff','--klic-ui-feature-muted':'#b7c9e2','--klic-ui-feature-line':context.theme==='dark'?'#3c5578':'#425b7b',
 '--runtime-font':`${FONT_NAMES[context.font]},system-ui,sans-serif`,'--runtime-heading-font':`${FONT_NAMES[context.headingFont]},system-ui,sans-serif`,'--runtime-radius':context.radius+'px','--runtime-text-scale':String(context.textScale/100)};
}
export function applyPreviewScope(element,context){if(!element)return;for(const [key,value] of Object.entries(scopeDeclarations(context)))element.style.setProperty(key,value);element.dataset.previewContext='true';element.style.fontFamily='var(--klic-ui-font)';element.dataset.theme=context.theme;element.dataset.colorTheme=context.colorTheme;element.dataset.chartPalette=context.chartPalette;element.dataset.material=context.material;element.dataset.density=context.density;element.dataset.avatars=String(context.showAvatars);element.style.colorScheme=context.theme;}
export function previewCSS(base,overrides){
 const ctx=previewContext(base,overrides),o=normalizePreviewOverrides(overrides);
 return `/* KLIC preview · material: ${ctx.material} · color theme: ${ctx.colorTheme} · apply <div class="klic-preview${ctx.theme==='dark'?' dark':''}" data-material="${ctx.material}" data-color-theme="${ctx.colorTheme}" data-theme="${ctx.theme}" data-chart-palette="${ctx.chartPalette}"><div data-klic-surface="card">…</div></div>.\n * A surface role may also be on the data-material context root. Scoped effects require CSS @scope; unsupported browsers retain base component styles.\n * Behavior/React props: ${JSON.stringify({colorTheme:ctx.colorTheme,density:ctx.density,showAvatars:ctx.showAvatars,showProgressRings:ctx.showProgressRings,chartPalette:ctx.chartPalette})}\n * Use JSON configuration for non-CSS behavior such as completion rings. */\n.klic-preview {\n${Object.entries(scopeDeclarations(ctx)).map(([k,v])=>`  ${k}: ${v};`).join('\n')}\n  color-scheme: ${ctx.theme};\n  color: var(--klic-semantic-color-text);\n  background: var(--klic-semantic-color-panel);\n  font-family: var(--klic-ui-font);\n  width: ${previewViewport(o).fluid?'100%':(o.width||DEFAULT_PREVIEW_WIDTH)+'px'};\n  zoom: ${(o.zoom||100)/100};\n}\n${materialStylesCSS()}\n.klic-preview :is(h1,h2,h3) { font-family: var(--klic-heading-font); }\n.klic-preview :is(button,input:not([type=radio]):not([type=range]),select,textarea) { border-radius: var(--klic-custom-radius); }\n.klic-preview :is(.btn,.demo-input) { min-height: ${ctx.density==='compact'?28:ctx.density==='relaxed'?44:32}px; padding-block: ${ctx.density==='compact'?5:ctx.density==='relaxed'?11:7}px; }${ctx.showAvatars?'':'\n.klic-preview .root-person.has-photo { background-image:none!important; color:var(--klic-semantic-color-accent)!important; }'}`;
}
const select=(key,label,options)=>`<label class="preview-field"><span>${label}</span><select data-preview-field="${key}"><option value="inherit">설정 따르기</option>${options.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></label>`;
const range=(key,label,min,max,unit)=>`<label class="preview-field preview-range"><span>${label}<output data-preview-output="${key}"></output></span><input type="range" min="${min}" max="${max}" step="1" data-preview-field="${key}" data-unit="${unit}" aria-label="프리뷰 ${label}"></label>`;
export function previewViewport(overrides={},availableWidth=DEFAULT_PREVIEW_WIDTH,availableHeight){
 const o=normalizePreviewOverrides(overrides),available=Number.isFinite(availableWidth)&&availableWidth>0?availableWidth:DEFAULT_PREVIEW_WIDTH;
 const fluid=o.widthMode==='fluid'||(o.widthMode===undefined&&o.width===undefined),width=fluid?available:(o.width||DEFAULT_PREVIEW_WIDTH);
 // An existing explicit zoom remains a manual view unless the user enables Fit.
 const fit=o.fit??(o.zoom===undefined),zoom=(o.zoom||100)/100;
 const scale=(fit?Math.min(1,available/width):1)*zoom;
 // CSS zoom scales both dimensions. Keep an iframe's visible viewport height
 // constant; native component canvases retain their intrinsic document flow.
 const height=Number.isFinite(availableHeight)&&availableHeight>0?{height:Math.ceil(availableHeight/scale)}:{};
 return {width,fit,fluid,scale,zoom:o.zoom||100,...height};
}
export function previewCustomizeButton(kind='component'){
 return `<button type="button" class="btn secondary sm preview-customize-trigger" data-preview-toggle aria-expanded="false" aria-controls="${kind}-customize-panel">${icon('sliders-horizontal')}Customize<span class="preview-modified-dot" hidden aria-label="개별 설정 적용됨"></span></button>`;
}
export function previewSettingsMarkup(kind='component'){
 return `<section id="${kind}-customize-panel" class="preview-settings" hidden role="region" aria-labelledby="${kind}-customize-title" data-panel-mode="dock"><header class="preview-settings-heading"><div>${icon('sliders-horizontal')}<strong id="${kind}-customize-title">Customize</strong><span>${kind==='block'?'Block':'Component'}</span></div><div class="preview-panel-actions"><button type="button" class="icon-button" data-preview-panel-mode aria-label="플로팅 패널로 전환" title="플로팅 패널로 전환" aria-pressed="true">${icon('panel-right')}</button><button type="button" class="icon-button" data-preview-close aria-label="Customize 닫기">${icon('x')}</button></div></header><div class="preview-settings-body"><p class="preview-scope-note">현재 항목에만 적용됩니다. 변경값은 자동 저장됩니다.</p><section class="preview-settings-section"><h3>캔버스</h3><p class="preview-setting-help">처음 열면 가용 폭에 맞춥니다. 고정 폭은 직접 선택하세요.</p><div class="preview-device-presets" role="group" aria-label="프리뷰 폭"><button type="button" data-preview-device="auto" title="가용 폭" aria-label="가용 폭">${icon('maximize')}<span>Auto</span></button><button type="button" data-preview-device="390" title="Mobile · 390px" aria-label="Mobile 390px">${icon('smartphone')}<span>390</span></button><button type="button" data-preview-device="768" title="Tablet · 768px" aria-label="Tablet 768px">${icon('tablet')}<span>768</span></button><button type="button" data-preview-device="1920" title="Desktop · 1920px" aria-label="Desktop 1920px">${icon('monitor')}<span>1920</span></button></div><div class="preview-view-modes" role="group" aria-label="캔버스 배율"><button type="button" data-preview-view="fit" aria-pressed="true">화면 맞춤</button><button type="button" data-preview-view="actual" aria-pressed="false">100%</button></div><div class="preview-settings-grid">${range('width','Width',240,3840,'px')}${range('zoom','Zoom',25,150,'%')}</div></section><section class="preview-settings-section"><h3>스타일</h3><p class="preview-setting-help">Liquid Glass는 tint · blur · rim을 사용한 CSS 근사 표현입니다.</p><div class="preview-settings-grid">${select('material','Material',MATERIAL_IDS.map(id=>[id,MATERIAL_LABELS[id]]))}${select('colorTheme','색상 테마',COLOR_THEMES.map(theme=>[theme.id,theme.name]))}${select('theme','테마',[['light','Light'],['dark','Dark']])}${select('accent','컬러',[['klic','KLIC Blue'],['royal','Royal Blue'],['navy','Navy']])}${select('font','본문 폰트',FONT_OPTIONS)}${select('headingFont','제목 폰트',FONT_OPTIONS)}<p class="preview-setting-help">Geist Mono의 한글은 대체 글꼴을 사용합니다.</p>${select('density','밀도',[['compact','Compact'],['normal','Normal'],['relaxed','Relaxed']])}${range('radius','Radius',0,24,'px')}${range('textScale','Text',90,150,'%')}</div></section>${kind==='block'?`<section class="preview-settings-section"><h3>표시</h3>${select('chartPalette','차트',[['theme','테마 따르기'],['blue','Blue'],['violet','Blue · Violet'],['contrast','Contrast']])}<label class="preview-checkbox"><input type="checkbox" data-preview-field="showAvatars">프로필 사진</label><label class="preview-checkbox"><input type="checkbox" data-preview-field="showProgressRings">완료율 링</label></section>`:''}<div class="preview-setting-actions"><button type="button" class="btn secondary sm" data-preview-action="reset" title="이 항목을 화면 맞춤 프리뷰로 복원">${icon('rotate-ccw')}초기화</button><button type="button" class="btn secondary sm" data-preview-action="copy">${icon('copy')}CSS</button><button type="button" class="btn secondary sm" data-preview-action="json" title="표시 옵션과 React props를 포함한 전체 구성 복사">JSON</button></div><a class="preview-global-link" href="#settings/theme">전체 설정 ${icon('arrow-up-right')}</a></div></section>`;
}
export function initPreviewCustomizer(root,{kind='component',id,getBase=()=>({}),onChange=()=>{},copy,notify}={}){
 if(!root)return null;let storage;try{storage=localStorage;}catch{}let saved=readPreviewStore(storage),overrides=previewEntryOverrides(saved[kind+':'+id]);
 const key=kind+':'+id,settings=root.querySelector('.preview-settings'),trigger=root.querySelector('[data-preview-toggle]'),scope=root.querySelector('[data-preview-scope]'),canvas=root.querySelector('[data-preview-canvas]'),viewport=canvas?.parentElement;
 const frame=kind==='block'?canvas?.querySelector('iframe'):null,fullscreenBar=viewport?.querySelector('.block-fullscreen-bar');
 if(!settings||!trigger)return null;
 let opened=false,panelMode='dock';try{if(storage?.getItem(PANEL_STORAGE_KEY)==='float')panelMode='float';}catch{}
 // Escape the preview's containment so the panel behaves like an app inspector.
 document.body.append(settings);
 function persist(){saved=readPreviewStore(storage);saved[key]=overrides;try{storage?.setItem(PREVIEW_STORAGE_KEY,JSON.stringify(saved));}catch{}}
 function geometry(){
  const style=viewport?getComputedStyle(viewport):null,px=value=>parseFloat(value)||0;
  const available=(viewport?.clientWidth||root.clientWidth||DEFAULT_PREVIEW_WIDTH)-px(style?.paddingLeft)-px(style?.paddingRight);
  // clientHeight excludes the horizontal scrollbar; the fullscreen toolbar
  // and padding belong to the outer stage, not the scaled iframe viewport.
  const availableHeight=frame?Math.max(1,viewport.clientHeight-px(style?.paddingTop)-px(style?.paddingBottom)-(fullscreenBar?.offsetHeight||0)):undefined;
  const v=previewViewport(overrides,available,availableHeight);
  if(canvas){canvas.style.width=v.width+'px';canvas.style.maxWidth='none';canvas.style.zoom=String(v.scale);canvas.dataset.previewWidth=String(v.width);}
  if(frame){canvas.style.height=v.height+'px';frame.style.height=v.height+'px';}
  const readout=root.querySelector('[data-preview-readout]');if(readout)readout.textContent=`${v.fluid?'가용 폭 '+Math.round(v.width)+'px':v.width+'px'} · ${v.fit?'Fit · ':''}${Math.round(v.scale*100)}%`;
  settings.querySelectorAll('[data-preview-view]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.previewView==='fit'?v.fit:!v.fit&&v.zoom===100)));
  return v;
 }
 function sync(appearanceChanged=true){
  const ctx=previewContext(getBase(),overrides),v=previewViewport(overrides,viewport?.clientWidth);
  for(const el of settings.querySelectorAll('[data-preview-field]')){const k=el.dataset.previewField;if(el.type==='checkbox')el.checked=ctx[k];else if(el.type==='range')el.value=overrides[k]??(k==='width'?DEFAULT_PREVIEW_WIDTH:k==='zoom'?100:ctx[k]);else el.value=overrides[k]??'inherit';}
  for(const out of settings.querySelectorAll('[data-preview-output]')){const k=out.dataset.previewOutput;out.textContent=k==='width'&&v.fluid?'Auto':`${overrides[k]??(k==='width'?DEFAULT_PREVIEW_WIDTH:k==='zoom'?100:ctx[k])}${k==='width'||k==='radius'?'px':'%'}`;}
  settings.querySelectorAll('[data-preview-device]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.previewDevice==='auto'?v.fluid:!v.fluid&&Number(el.dataset.previewDevice)===v.width)));
  geometry();
  if(appearanceChanged){applyPreviewScope(scope,ctx);onChange(ctx,{...overrides});}
  const modified=Object.keys(overrides).some(key=>!['widthMode','fit','zoom'].includes(key))||overrides.widthMode==='fixed'||overrides.fit===false||(overrides.zoom??100)!==100;trigger.classList.toggle('is-modified',modified);const dot=trigger.querySelector('.preview-modified-dot');if(dot)dot.hidden=!modified;
  return ctx;
 }
 function patch(p){const palette=Object.hasOwn(p,'colorTheme')?(p.colorTheme==='inherit'||p.colorTheme===null?{accent:'inherit',neutral:'inherit',chartPalette:'inherit'}:COLOR_THEME_IDS.includes(p.colorTheme)?colorThemePatch(p.colorTheme):{}):{};const next={...overrides,...palette,...p};for(const k of Object.keys(next))if(next[k]==='inherit'||next[k]===null)delete next[k];overrides=normalizePreviewOverrides(next);persist();sync(Object.keys(p).some(k=>!['width','zoom','fit','widthMode'].includes(k)));}
 function input(e){const el=e.target,k=el.dataset.previewField;if(!k)return;if(el.type==='range')patch({[k]:Number(el.value),...(k==='width'?{widthMode:'fixed'}:k==='zoom'?{fit:false}:{})});else if(e.type==='change')patch({[k]:el.type==='checkbox'?el.checked:el.value});}
 function click(e){
  const device=e.target.closest('[data-preview-device]');if(device){patch(device.dataset.previewDevice==='auto'?{widthMode:'fluid',fit:true,zoom:100}:{width:Number(device.dataset.previewDevice),widthMode:'fixed',fit:true,zoom:100});return;}
  const view=e.target.closest('[data-preview-view]');if(view){patch({fit:view.dataset.previewView==='fit',zoom:100});return;}
  const a=e.target.closest('[data-preview-action]')?.dataset.previewAction;
  if(a==='reset'){overrides={};persist();sync();notify?.('이 항목을 화면 맞춤 프리뷰로 복원했습니다.');}
  else if(a==='copy')copy?.(previewCSS(getBase(),overrides),'프리뷰 CSS를 복사했습니다. 동작 옵션은 JSON을 함께 사용하세요.');
  else if(a==='json'){const v=previewViewport(overrides,viewport?.clientWidth);copy?.(JSON.stringify({schema:'klic-preview-v1',kind,id,context:previewContext(getBase(),overrides),viewport:{width:v.fluid?'auto':v.width,zoom:v.zoom,fit:v.fit},overrides},null,2),'현재 프리뷰의 전체 구성을 복사했습니다.');}
 }
 function applyPanelMode(){
  settings.dataset.panelMode=panelMode;
  const docked=panelMode==='dock'&&window.innerWidth>=1100;
  settings.setAttribute('role',docked?'region':'dialog');
  if(docked){settings.removeAttribute('aria-modal');trigger.removeAttribute('aria-haspopup');}
  else{settings.setAttribute('aria-modal','false');trigger.setAttribute('aria-haspopup','dialog');}
  const dockButton=settings.querySelector('[data-preview-panel-mode]'),label=panelMode==='dock'?'플로팅 패널로 전환':'오른쪽에 도킹';
  dockButton.setAttribute('aria-pressed',String(panelMode==='dock'));dockButton.setAttribute('aria-label',label);dockButton.title=label;
  if(opened&&panelMode==='dock'){document.body.dataset.previewDock=settings.id;}
  else if(document.body.dataset.previewDock===settings.id)delete document.body.dataset.previewDock;
  geometry();
 }
 function setOpen(value,restore=false){
  opened=value;trigger.setAttribute('aria-expanded',String(value));settings.hidden=!value;
  applyPanelMode();
  if(value)settings.querySelector('[data-preview-close]').focus({preventScroll:true});
  else if(restore&&trigger.isConnected)trigger.focus({preventScroll:true});
 }
 function toggle(){setOpen(!opened,!opened?false:true);}
 function dismiss(e){if(e.target.closest('[data-preview-close]'))setOpen(false,true);if(e.target.closest('[data-preview-panel-mode]')){panelMode=panelMode==='dock'?'float':'dock';try{storage?.setItem(PANEL_STORAGE_KEY,panelMode);}catch{}applyPanelMode();}}
 function escape(e){if(e.key==='Escape'&&opened&&!document.querySelector('dialog[open]')){e.preventDefault();e.stopPropagation();setOpen(false,true);}}
 function outside(e){if(opened&&(panelMode==='float'||window.innerWidth<1100)&&!settings.contains(e.target)&&!trigger.contains(e.target))setOpen(false);}
 trigger.addEventListener('click',toggle);settings.addEventListener('click',dismiss);document.addEventListener('keydown',escape);document.addEventListener('pointerdown',outside);window.addEventListener('resize',applyPanelMode);
 const resizeObserver=typeof ResizeObserver==='function'?new ResizeObserver(geometry):null;if(viewport)resizeObserver?.observe(viewport);if(fullscreenBar)resizeObserver?.observe(fullscreenBar);
 settings.addEventListener('input',input);settings.addEventListener('change',input);settings.addEventListener('click',click);applyPanelMode();sync();
 return {sync,patch,context:()=>previewContext(getBase(),overrides),destroy(){setOpen(false);resizeObserver?.disconnect();settings.remove();trigger.removeEventListener('click',toggle);settings.removeEventListener('click',dismiss);document.removeEventListener('keydown',escape);document.removeEventListener('pointerdown',outside);window.removeEventListener('resize',applyPanelMode);settings.removeEventListener('input',input);settings.removeEventListener('change',input);settings.removeEventListener('click',click);}};
}
