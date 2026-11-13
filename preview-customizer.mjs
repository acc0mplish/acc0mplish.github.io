import {FONT_IDS,FONT_OPTIONS} from './font-registry.mjs';
import {MATERIAL_IDS,MATERIAL_LABELS,materialStylesCSS} from './materials.mjs';
import {icon,escapeHTML as esc} from './catalog.js';
import {normalizePreferences,FONT_NAMES} from './preferences.mjs';
import {createTokens,resolveTokens,formatValue} from './tokens.mjs';
import {COLOR_THEMES,COLOR_THEME_IDS,colorThemePatch} from './color-themes.mjs';
import {createPublishingSession,normalizePublishingPatch} from './publishing-model.mjs';
import {getPublishingTarget} from './publishing-targets.mjs';
import {mountPublishingGuide} from './publishing-guide.mjs';

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
const publishingMeasurementKeys=new Set(['outerWidth','outerHeight','contentWidth','contentHeight','scrollWidth','scrollHeight','clientWidth','clientHeight','borderRadius','borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth','paddingTop','paddingRight','paddingBottom','paddingLeft']);
const componentPublishingTargets=Object.freeze({card:'card-base',button:'button-primary',input:'input-name',field:'field-email',dialog:'native-demo-dialog'});
const blockPublishingTargets=Object.freeze({'dashboard-sales-analytics':'sales-revenue','form-incident-report':'incident-report-title'});
const publishingTargetFor=(kind,id)=>kind==='component'?componentPublishingTargets[id]||'':kind==='block'?blockPublishingTargets[id]||'':'';
export function validatePublishingBridgeMessage(event,expected={}){
 const data=event?.data,target=getPublishingTarget(expected.targetId);
 if(!data||typeof data!=='object'||Array.isArray(data)||!target||event.origin!==expected.origin||event.source!==expected.source||
    data.type!=='klic:publishing-snapshot'||data.itemId!==expected.itemId||data.sessionId!==expected.sessionId||data.targetId!==expected.targetId||
    !Number.isInteger(data.revision)||data.revision!==expected.revision)return false;
 try{if(JSON.stringify(data).length>8192)return false;}catch{return false;}
 if(!data.values||typeof data.values!=='object'||Array.isArray(data.values))return false;
 if(Object.keys(data.values).length){try{normalizePublishingPatch(expected.targetId,data.values);}catch{return false;}}
 const measurements=data.measurements;
 if(!measurements||typeof measurements!=='object'||Array.isArray(measurements)||Object.keys(measurements).length>16)return false;
 return Object.entries(measurements).every(([key,value])=>publishingMeasurementKeys.has(key)&&typeof value==='number'&&Number.isFinite(value)&&value>=0);
}
export function normalizePreviewOverrides(value={}){
 const result={};if(!value||typeof value!=='object')return result;
 for(const [key,[min,max]] of Object.entries(numeric))if(typeof value[key]==='number'&&Number.isFinite(value[key]))result[key]=Math.round(Math.max(min,Math.min(max,value[key])));
 for(const [key,values] of Object.entries(choices))if(values.includes(value[key]))result[key]=value[key];
 for(const key of ['showAvatars','showProgressRings','fit'])if(typeof value[key]==='boolean')result[key]=value[key];
 return result;
}
function isPlainRecord(value){return Boolean(value&&typeof value==='object'&&!Array.isArray(value)&&(Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null));}
function strictPreviewOverrides(value){
 if(!isPlainRecord(value))throw new TypeError('Preview overrides must be a plain object');
 const normalized=normalizePreviewOverrides(value),keys=Object.keys(value);
 if(keys.length!==Object.keys(normalized).length||keys.some(key=>!Object.hasOwn(normalized,key)||!Object.is(value[key],normalized[key])))throw new TypeError('Unsupported preview override');
 return normalized;
}
export function normalizePreviewEnvelope(value,expected={}){
 if(!isPlainRecord(value)||value.schema!=='klic-preview-v1'||value.kind!==expected.kind||value.id!==expected.id)throw new TypeError('Preview envelope does not match the current item');
 return {schema:'klic-preview-v1',kind:value.kind,id:value.id,overrides:strictPreviewOverrides(value.overrides)};
}
export function normalizePublishingEnvelope(value){
 const allowed=['schema','kind','itemId','targetId','supportedOverrides','sourceRecipe'];
 if(!isPlainRecord(value)||Object.keys(value).length!==allowed.length||Object.keys(value).some(key=>!allowed.includes(key))||value.schema!=='klic-publishing-v1')throw new TypeError('Publishing envelope schema is invalid');
 const target=getPublishingTarget(value.targetId);
 if(!target||target.scope!==value.kind||target.itemId!==value.itemId)throw new TypeError('Publishing envelope target does not match its item');
 const supportedOverrides=strictPreviewOverrides(value.supportedOverrides);
 if(!isPlainRecord(value.sourceRecipe)||Object.keys(value.sourceRecipe).length!==1||!Object.hasOwn(value.sourceRecipe,'values')||!isPlainRecord(value.sourceRecipe.values))throw new TypeError('Publishing source recipe is invalid');
 const sourceValues=value.sourceRecipe.values;
 let normalizedValues={};
 if(Object.keys(sourceValues).length){
  normalizedValues=normalizePublishingPatch(value.targetId,sourceValues);
  if(Object.keys(normalizedValues).length!==Object.keys(sourceValues).length||Object.entries(sourceValues).some(([key,entry])=>!Object.hasOwn(normalizedValues,key)||!Object.is(normalizedValues[key],entry)))throw new TypeError('Publishing source recipe contains unsupported values');
  if(Object.keys(normalizedValues).some(key=>!Object.hasOwn(target.sourceProperties,key)))throw new TypeError('Publishing source recipe contains a value with no source mapping');
 }
 return {schema:'klic-publishing-v1',kind:target.scope,itemId:target.itemId,targetId:target.targetId,supportedOverrides,sourceRecipe:{values:normalizedValues}};
}
export function exportPublishingEnvelope({kind,itemId,targetId,supportedOverrides={},sourceValues={}}={}){
 return normalizePublishingEnvelope({schema:'klic-publishing-v1',kind,itemId,targetId,supportedOverrides,sourceRecipe:{values:sourceValues}});
}
export function previewContext(base={},overrides={}){
 const o=normalizePreviewOverrides(overrides),{width,zoom,fit,widthMode,...appearance}=o;
 return {...normalizePreferences({...base,...appearance}),theme:appearance.theme||(base.theme==='dark'?'dark':'light'),brand:base.brand==='b'?'b':'a',headingFont:appearance.headingFont||base.headingFont||base.font||'pretendard',autoScale:false,uiScale:100};
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
export function previewFrameHeight(frameDocument,minimumHeight=600){
 const contentHeight=Math.max(Number.isFinite(frameDocument?.documentElement?.scrollHeight)?frameDocument.documentElement.scrollHeight:0,Number.isFinite(frameDocument?.body?.scrollHeight)?frameDocument.body.scrollHeight:0);
 const content=Number.isFinite(contentHeight)&&contentHeight>0?contentHeight:0,minimum=Number.isFinite(minimumHeight)&&minimumHeight>0?minimumHeight:600;
 return Math.ceil(Math.max(content,minimum));
}
export function previewCustomizeButton(kind='component'){
 return `<button type="button" class="btn secondary sm preview-customize-trigger" data-preview-toggle aria-expanded="false" aria-controls="${kind}-customize-panel">${icon('sliders-horizontal')}${kind==='component'?'미리보기 설정':'Customize'}<span class="preview-modified-dot" hidden aria-label="개별 설정 적용됨"></span></button>`;
}
function publishingSettingsMarkup(kind,id){
 const target=publishingTargetFor(kind,id);
 if(!target)return '';
 return `<section class="preview-settings-section publishing-settings" data-publishing-editor="${target}"><h3>퍼블리싱 실험</h3><p class="preview-setting-help">현재 항목의 target에만 적용됩니다. 전역 설정과 업무 데이터에는 저장하지 않습니다.</p><div class="preview-settings-grid"><label class="preview-field preview-range"><span>반경<output data-publishing-value="radius">8px</output></span><input type="range" min="0" max="24" step="1" value="8" data-publishing-control="radius" aria-label="퍼블리싱 반경"></label><label class="preview-field preview-range"><span>패딩<output data-publishing-value="padding">8px</output></span><input type="range" min="0" max="48" step="1" value="8" data-publishing-control="padding" aria-label="퍼블리싱 패딩"></label><label class="preview-field preview-range"><span>경계 두께<output data-publishing-value="borderWidth">0px</output></span><input type="range" min="0" max="8" step="1" value="0" data-publishing-control="borderWidth" aria-label="퍼블리싱 경계 두께"></label></div><div data-publishing-guide-host></div><pre class="publishing-css-output"><code data-publishing-css>대상 CSS가 준비되면 여기에 표시됩니다.</code></pre><button type="button" class="btn secondary sm" data-publishing-copy>수정 CSS 복사</button><div class="publishing-transfer"><button type="button" class="btn secondary sm" data-publishing-export>퍼블리싱 JSON 복사</button><label class="preview-field"><span>퍼블리싱 JSON 가져오기</span><textarea data-publishing-import-json rows="4" aria-label="퍼블리싱 JSON 가져오기" placeholder="klic-publishing-v1 또는 klic-preview-v1 JSON"></textarea></label><button type="button" class="btn secondary sm" data-publishing-import>JSON 적용</button><p data-publishing-status role="status"></p></div></section>`;
}
export function previewSettingsMarkup(kind='component',id=''){
 return `<section id="${kind}-customize-panel" class="preview-settings" hidden role="region" aria-labelledby="${kind}-customize-title" data-panel-mode="dock"><header class="preview-settings-heading"><div>${icon('sliders-horizontal')}<strong id="${kind}-customize-title">${kind==='component'?'미리보기 설정':'Customize'}</strong><span>${kind==='block'?'Block':'컴포넌트'}</span></div><div class="preview-panel-actions"><button type="button" class="icon-button" data-preview-panel-mode aria-label="플로팅 패널로 전환" title="플로팅 패널로 전환" aria-pressed="true">${icon('panel-right')}</button><button type="button" class="icon-button" data-preview-close aria-label="${kind==='component'?'설정 패널 닫기':'Customize 닫기'}">${icon('x')}</button></div></header><div class="preview-settings-body"><p class="preview-scope-note">현재 항목에만 적용됩니다. 변경값은 자동 저장됩니다.</p><section class="preview-settings-section"><h3>캔버스</h3><p class="preview-setting-help">처음 열면 가용 폭에 맞춥니다. 고정 폭은 직접 선택하세요.</p><div class="preview-device-presets" role="group" aria-label="프리뷰 폭"><button type="button" data-preview-device="auto" title="가용 폭" aria-label="가용 폭">${icon('maximize')}<span>${kind==='component'?'자동':'Auto'}</span></button><button type="button" data-preview-device="390" title="${kind==='component'?'모바일':'Mobile'} · 390px" aria-label="${kind==='component'?'모바일':'Mobile'} 390px">${icon('smartphone')}<span>390</span></button><button type="button" data-preview-device="768" title="${kind==='component'?'태블릿':'Tablet'} · 768px" aria-label="${kind==='component'?'태블릿':'Tablet'} 768px">${icon('tablet')}<span>768</span></button><button type="button" data-preview-device="1920" title="${kind==='component'?'데스크톱':'Desktop'} · 1920px" aria-label="${kind==='component'?'데스크톱':'Desktop'} 1920px">${icon('monitor')}<span>1920</span></button></div><div class="preview-view-modes" role="group" aria-label="캔버스 배율"><button type="button" data-preview-view="fit" aria-pressed="true">화면 맞춤</button><button type="button" data-preview-view="actual" aria-pressed="false">100%</button></div><div class="preview-settings-grid">${range('width',kind==='component'?'너비':'Width',240,3840,'px')}${range('zoom',kind==='component'?'배율':'Zoom',25,150,'%')}</div></section><section class="preview-settings-section"><h3>스타일</h3><p class="preview-setting-help">${kind==='component'?'Liquid Glass는 색조·흐림·가장자리 빛을 활용한 CSS 근사 표현입니다.':'Liquid Glass는 tint · blur · rim을 사용한 CSS 근사 표현입니다.'}</p><div class="preview-settings-grid">${select('material',kind==='component'?'소재':'Material',MATERIAL_IDS.map(id=>[id,MATERIAL_LABELS[id]]))}${select('colorTheme','색상 테마',COLOR_THEMES.map(theme=>[theme.id,theme.name]))}${select('theme','테마',[['light',kind==='component'?'라이트':'Light'],['dark',kind==='component'?'다크':'Dark']])}${select('accent','컬러',[['klic',kind==='component'?'KLIC 블루':'KLIC Blue'],['royal',kind==='component'?'로열 블루':'Royal Blue'],['navy',kind==='component'?'네이비':'Navy']])}${select('font','본문 폰트',FONT_OPTIONS)}${select('headingFont','제목 폰트',FONT_OPTIONS)}<p class="preview-setting-help">Geist Mono의 한글은 대체 글꼴을 사용합니다.</p>${select('density','밀도',[['compact',kind==='component'?'좁게':'Compact'],['normal',kind==='component'?'보통':'Normal'],['relaxed',kind==='component'?'여유롭게':'Relaxed']])}${range('radius',kind==='component'?'모서리 반경':'Radius',0,24,'px')}${range('textScale',kind==='component'?'글자 크기':'Text',90,150,'%')}</div></section>${kind==='block'?`<section class="preview-settings-section"><h3>표시</h3>${select('chartPalette','차트',[['theme','테마 따르기'],['blue','Blue'],['violet','Blue · Violet'],['contrast','Contrast']])}<label class="preview-checkbox"><input type="checkbox" data-preview-field="showAvatars">프로필 사진</label><label class="preview-checkbox"><input type="checkbox" data-preview-field="showProgressRings">완료율 링</label></section>`:''}${publishingSettingsMarkup(kind,id)}<div class="preview-setting-actions"><button type="button" class="btn secondary sm" data-preview-action="reset" title="이 항목을 화면 맞춤 프리뷰로 복원">${icon('rotate-ccw')}초기화</button><button type="button" class="btn secondary sm" data-preview-action="copy">${icon('copy')}CSS</button><button type="button" class="btn secondary sm" data-preview-action="json" title="표시 옵션과 React props를 포함한 전체 구성 복사">JSON</button></div><a class="preview-global-link" href="#settings/theme">전체 설정 ${icon('arrow-up-right')}</a></div></section>`;
}
export function initPreviewCustomizer(root,{kind='component',id,getBase=()=>({}),onChange=()=>{},copy,notify}={}){
 if(!root)return null;let storage;try{storage=localStorage;}catch{}let saved=readPreviewStore(storage),overrides=previewEntryOverrides(saved[kind+':'+id]);
 const key=kind+':'+id,settings=root.querySelector('.preview-settings'),trigger=root.querySelector('[data-preview-toggle]'),scope=root.querySelector('[data-preview-scope]'),canvas=root.querySelector('[data-preview-canvas]'),viewport=canvas?.parentElement;
 const frame=kind==='block'?canvas?.querySelector('iframe'):null,fullscreenBar=viewport?.querySelector('.block-fullscreen-bar');
 if(!settings||!trigger)return null;
 const publishingTargetId=publishingTargetFor(kind,id);
 const publishingSessionId=`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`;
 const publishingSession=publishingTargetId?createPublishingSession(kind==='component'?`component:${id}:default:${publishingSessionId}`:`block:${id}:preview:${publishingSessionId}`):null;
 const publishingHost=settings.querySelector('[data-publishing-guide-host]');
 let publishingGuide=null,dialogPublishingGuide=null,dialogPublishingRoot=null,dialogPublishingAbort=null,publishingGesture=false,publishingActiveControl=null,publishingTargetNode=null,publishingOriginalStyles=null,publishingMeasurements=null;
 let opened=false,panelMode='dock',frameGeometryQueued=false;try{if(storage?.getItem(PANEL_STORAGE_KEY)==='float')panelMode='float';}catch{}
 // Escape the preview's containment so the panel behaves like an app inspector.
 document.body.append(settings);
 function persist(){saved=readPreviewStore(storage);saved[key]=overrides;try{storage?.setItem(PREVIEW_STORAGE_KEY,JSON.stringify(saved));}catch{}}
 const publishingProperties={radius:'border-radius',padding:'padding',borderWidth:'border-width'};
 function publishingNode(){
  if(!publishingSession)return null;
  const target=getPublishingTarget(publishingTargetId);
  try{if(kind==='component')return scope?.querySelector(target.selector)|| (id==='dialog'?document.querySelector(target.selector):null);return frame?.contentDocument?.querySelector(target.selector)||null;}catch{return null;}
 }
 function restorePublishingInline(node=publishingTargetNode){
  if(!node?.style||!publishingOriginalStyles)return;
  for(const [property,savedStyle] of publishingOriginalStyles){if(savedStyle.value)node.style.setProperty(property,savedStyle.value,savedStyle.priority);else node.style.removeProperty(property);}
 }
 function sourceTarget(){
  const node=publishingNode();
  if(node!==publishingTargetNode){restorePublishingInline();publishingTargetNode=node;publishingOriginalStyles=node?new Map(Object.values(publishingProperties).map(property=>[property,{value:node.style.getPropertyValue(property),priority:node.style.getPropertyPriority(property)}])):null;if(kind==='component'&&node){const values=publishingSession?.snapshot(publishingTargetId).values||{};for(const [control,property] of Object.entries(publishingProperties)){if(Object.hasOwn(values,control))node.style.setProperty(property,`${values[control]}px`);}}}
  return node;
 }
 function publishingMeasuredValues(node){
  if(!node)return {};
  const view=node.ownerDocument?.defaultView;if(!view)return {};
  const style=view.getComputedStyle(node),rect=node.getBoundingClientRect(),px=value=>Math.max(0,parseFloat(value)||0),borderTopWidth=px(style.borderTopWidth),borderRightWidth=px(style.borderRightWidth),borderBottomWidth=px(style.borderBottomWidth),borderLeftWidth=px(style.borderLeftWidth),paddingTop=px(style.paddingTop),paddingRight=px(style.paddingRight),paddingBottom=px(style.paddingBottom),paddingLeft=px(style.paddingLeft);
  return {outerWidth:rect.width,outerHeight:rect.height,contentWidth:Math.max(0,rect.width-borderLeftWidth-borderRightWidth-paddingLeft-paddingRight),contentHeight:Math.max(0,rect.height-borderTopWidth-borderBottomWidth-paddingTop-paddingBottom),scrollWidth:node.scrollWidth,scrollHeight:node.scrollHeight,clientWidth:node.clientWidth,clientHeight:node.clientHeight,borderRadius:px(style.borderTopLeftRadius),borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth,paddingTop,paddingRight,paddingBottom,paddingLeft};
 }
 function publishingSnapshot(){
  if(!publishingSession)return null;
  const node=sourceTarget(),raw=publishingSession.snapshot(publishingTargetId),measurements=publishingMeasuredValues(node);
  const values={radius:Math.round(measurements.borderRadius??8),padding:Math.round(measurements.paddingTop??8),borderWidth:Math.round(measurements.borderTopWidth??0),...raw.values};
  return {...raw,values,measurements:Object.keys(measurements).length?measurements:publishingMeasurements||{}};
 }
 function sendPublishingMessage(type,revision,values={}){
  if(kind!=='block'||!frame?.contentWindow)return;
  frame.contentWindow.postMessage({type,itemId:id,sessionId:publishingSessionId,targetId:publishingTargetId,revision,values},location.origin);
 }
 function applyPublishingValues(values,revision=publishingSession?.snapshot(publishingTargetId).revision){
  const node=sourceTarget();
  if(kind==='block')sendPublishingMessage('klic:publishing-patch',revision,values);
  else if(node?.style){
   for(const [control,property] of Object.entries(publishingProperties)){
    if(Object.hasOwn(values,control))node.style.setProperty(property,`${values[control]}px`);
    else{const savedStyle=publishingOriginalStyles?.get(property);if(savedStyle?.value)node.style.setProperty(property,savedStyle.value,savedStyle.priority);else node.style.removeProperty(property);}
   }
  }
  updatePublishingControls();
 }
 function replacePublishingValues(values){
  if(!publishingSession)return;
  publishingGesture=false;publishingActiveControl=null;
  const current=publishingSession.snapshot(publishingTargetId),cleared=publishingSession.clear(publishingTargetId,current.revision);
  if(Object.keys(values).length){publishingSession.beginGesture(publishingTargetId);publishingSession.apply(publishingTargetId,values,cleared.revision);publishingSession.finishGesture(publishingTargetId);}
  const snapshot=publishingSession.snapshot(publishingTargetId);
  applyPublishingValues(snapshot.values,snapshot.revision);
  updatePublishingGuide({announce:true});
 }
 function updatePublishingControls(){
  if(!publishingSession)return;
  const snapshot=publishingSnapshot();
  for(const host of [settings,dialogPublishingRoot].filter(Boolean)){
   for(const input of host.querySelectorAll('[data-publishing-control]')){const control=input.dataset.publishingControl,value=snapshot?.values?.[control];if(typeof value==='number'){if(document.activeElement!==input)input.value=String(value);const output=host.querySelector(`[data-publishing-value="${control}"]`);if(output)output.textContent=`${value}px`;}}
   const css=host.querySelector('[data-publishing-css]');if(css){try{css.textContent=Object.keys(publishingSession.snapshot(publishingTargetId).values).length?publishingSession.exportCSS(publishingTargetId):'값을 조정하면 등록 target에 적용할 CSS가 여기에 표시됩니다.';}catch{css.textContent='현재 target의 source edit 값이 없습니다.';}}
  }
 }
 function updatePublishingGuide({activeControl=publishingActiveControl,announce:shouldAnnounce=false,previousValues}={}){return (dialogPublishingGuide||publishingGuide)?.update({activeControl,announce:shouldAnnounce,...(previousValues?{previousValues}:{})});}
 function sendPublishingInspect(){if(publishingSession&&kind==='block'){const snapshot=publishingSession.snapshot(publishingTargetId);sendPublishingMessage('klic:publishing-inspect',snapshot.revision,snapshot.values);}}
 function receivePublishingSnapshot(event){
  if(!publishingSession||kind!=='block')return;
  const expected={origin:location.origin,source:frame?.contentWindow,itemId:id,sessionId:publishingSessionId,targetId:publishingTargetId,revision:publishingSession.snapshot(publishingTargetId).revision};
  if(!validatePublishingBridgeMessage(event,expected))return;
  publishingMeasurements=event.data.measurements;
  if(publishingGuide){updatePublishingGuide({announce:false});updatePublishingControls();}
 }
 function applyPublishingEdit(control,value){
  if(!publishingSession||!Object.hasOwn(publishingProperties,control))return;
  const before={...publishingSnapshot().values};
  if(!publishingGesture){publishingSession.beginGesture(publishingTargetId);publishingGesture=true;}
  const revision=publishingSession.snapshot(publishingTargetId).revision;
  const snapshot=publishingSession.apply(publishingTargetId,{[control]:value},revision);
  publishingActiveControl=control;
  applyPublishingValues(snapshot.values,snapshot.revision);
  updatePublishingGuide({activeControl:control,announce:false,previousValues:before});
 }
 function beginPublishingGesture(){if(!publishingSession||publishingGesture)return;publishingSession.beginGesture(publishingTargetId);publishingGesture=true;}
 function finishPublishingGesture(){if(!publishingSession||!publishingGesture)return;publishingSession.finishGesture(publishingTargetId);publishingGesture=false;updatePublishingControls();updatePublishingGuide({announce:true});}
 function mountPublishingGuideAt(host){
  if(!host||!publishingSession)return null;
  return mountPublishingGuide(host,{
   getSnapshot:()=>publishingSnapshot(),
   getTargetElement:()=>sourceTarget(),
   targetIds:()=>[publishingTargetId],
   onUndo:(targetId,revision)=>{if(publishingGesture)finishPublishingGesture();const snapshot=publishingSession.undo(targetId,revision);applyPublishingValues(snapshot.values,snapshot.revision);updatePublishingGuide({announce:true});},
   onClear:(targetId,revision)=>{if(publishingGesture)finishPublishingGesture();const snapshot=publishingSession.clear(targetId,revision);applyPublishingValues(snapshot.values,snapshot.revision);updatePublishingGuide({announce:true});},
  });
 }
 function activateDialogGuide(dialog){
  if(id!=='dialog'||!publishingSession||!dialog?.isConnected)return false;
  if(dialogPublishingRoot)return true;
  dialog.dataset.klicPublishingTarget='native-demo-dialog';
  sourceTarget();
  const local=document.createElement('section');local.className='publishing-dialog-editor';
  local.innerHTML=`<h3>이 다이얼로그의 퍼블리싱 설정</h3><p>값은 현재 열린 다이얼로그에만 적용됩니다. 입력과 닫기 동작은 유지됩니다.</p><div class="publishing-dialog-fields"><label class="preview-field preview-range"><span>반경<output data-publishing-value="radius">8px</output></span><input type="range" min="0" max="24" step="1" value="8" data-publishing-control="radius" aria-label="다이얼로그 반경"></label><label class="preview-field preview-range"><span>패딩<output data-publishing-value="padding">8px</output></span><input type="range" min="0" max="48" step="1" value="8" data-publishing-control="padding" aria-label="다이얼로그 패딩"></label><label class="preview-field preview-range"><span>경계 두께<output data-publishing-value="borderWidth">0px</output></span><input type="range" min="0" max="8" step="1" value="0" data-publishing-control="borderWidth" aria-label="다이얼로그 경계 두께"></label></div><div data-publishing-guide-host></div><pre class="publishing-css-output"><code data-publishing-css>값을 조정하면 target CSS가 표시됩니다.</code></pre><button type="button" class="btn secondary sm" data-publishing-copy>수정 CSS 복사</button><p data-publishing-copy-status role="status"></p><textarea data-publishing-copy-fallback aria-label="수정 CSS 직접 복사" readonly hidden></textarea>`;
  (dialog.querySelector('.dialog-body')||dialog).append(local);
  publishingGuide?.destroy();publishingGuide=null;
  dialogPublishingRoot=local;dialogPublishingAbort=new AbortController();
  dialogPublishingGuide=mountPublishingGuideAt(local.querySelector('[data-publishing-guide-host]'));
  const signal=dialogPublishingAbort.signal;
  local.addEventListener('input',publishingInput,{signal});
  local.addEventListener('click',publishingClick,{signal});
  local.addEventListener('pointerdown',event=>{if(event.target.closest?.('[data-publishing-control]'))beginPublishingGesture();},{signal});
  local.addEventListener('keydown',publishingKeydown,{signal});
  local.addEventListener('change',event=>{if(event.target.closest?.('[data-publishing-control]'))finishPublishingGesture();},{signal});
  updatePublishingControls();
  return true;
 }
 function deactivateDialogGuide(){
  if(!dialogPublishingRoot)return false;
  dialogPublishingAbort?.abort();dialogPublishingAbort=null;dialogPublishingGuide?.destroy();dialogPublishingGuide=null;dialogPublishingRoot.remove();dialogPublishingRoot=null;
  restorePublishingInline();publishingTargetNode?.removeAttribute?.('data-klic-publishing-target');publishingTargetNode=null;publishingOriginalStyles=null;
  if(publishingHost&&id!=='dialog')publishingGuide=mountPublishingGuideAt(publishingHost);
  updatePublishingControls();
  return true;
 }
 function geometry(){
  const style=viewport?getComputedStyle(viewport):null,px=value=>parseFloat(value)||0;
  const available=(viewport?.clientWidth||root.clientWidth||DEFAULT_PREVIEW_WIDTH)-px(style?.paddingLeft)-px(style?.paddingRight);
  const expanded=Boolean(frame&&viewport?.matches?.('.block-expanded,:fullscreen'));
  // Only fullscreen is a constrained viewport. Normal block previews grow to their document height.
  const availableHeight=expanded?Math.max(1,viewport.clientHeight-px(style?.paddingTop)-px(style?.paddingBottom)-(fullscreenBar?.offsetHeight||0)):undefined;
  const v=previewViewport(overrides,available,availableHeight);
  if(canvas){canvas.style.width=v.width+'px';canvas.style.maxWidth='none';canvas.style.zoom=String(v.scale);canvas.dataset.previewWidth=String(v.width);}
  if(frame){
   const configuredMinimumHeight=px(style?.minHeight)-px(style?.paddingTop)-px(style?.paddingBottom),minimumHeight=configuredMinimumHeight>0?configuredMinimumHeight:600;
   let frameDocument=null;try{frameDocument=frame.contentDocument;}catch{}
   const height=expanded?(v.height||Math.max(1,viewport?.clientHeight||600)):previewFrameHeight(frameDocument,minimumHeight);
   canvas.style.height=height+'px';frame.style.height=height+'px';
  }
  const readout=root.querySelector('[data-preview-readout]');if(readout)readout.textContent=`${v.fluid?'가용 폭 '+Math.round(v.width)+'px':v.width+'px'} · ${v.fit?(kind==='component'?'화면 맞춤 · ':'Fit · '):''}${Math.round(v.scale*100)}%`;
  settings.querySelectorAll('[data-preview-view]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.previewView==='fit'?v.fit:!v.fit&&v.zoom===100)));
  return v;
 }
 function queueFrameGeometry(){
  if(!frame||frameGeometryQueued)return;
  frameGeometryQueued=true;
  const update=()=>{frameGeometryQueued=false;geometry();};
  if(typeof window.requestAnimationFrame==='function')window.requestAnimationFrame(update);else window.setTimeout(update,0);
 }
 const frameResizeObserver=frame&&typeof ResizeObserver==='function'?new ResizeObserver(queueFrameGeometry):null;
 const frameMutationObserver=frame&&typeof MutationObserver==='function'?new MutationObserver(queueFrameGeometry):null;
 function observeFrameContent(){
  frameResizeObserver?.disconnect();frameMutationObserver?.disconnect();
  let doc;try{doc=frame?.contentDocument;}catch{return;}
  if(!doc?.documentElement)return;
  frameResizeObserver?.observe(doc.documentElement);
  if(doc.body&&doc.body!==doc.documentElement)frameResizeObserver?.observe(doc.body);
  if(doc.body)frameMutationObserver?.observe(doc.body,{attributes:true,characterData:true,childList:true,subtree:true});
  queueFrameGeometry();
 }
 function sync(appearanceChanged=true){
  const ctx=previewContext(getBase(),overrides),v=previewViewport(overrides,viewport?.clientWidth);
  for(const el of settings.querySelectorAll('[data-preview-field]')){const k=el.dataset.previewField;if(el.type==='checkbox')el.checked=ctx[k];else if(el.type==='range')el.value=overrides[k]??(k==='width'?DEFAULT_PREVIEW_WIDTH:k==='zoom'?100:ctx[k]);else el.value=overrides[k]??'inherit';}
  for(const out of settings.querySelectorAll('[data-preview-output]')){const k=out.dataset.previewOutput;out.textContent=k==='width'&&v.fluid?(kind==='component'?'자동':'Auto'):`${overrides[k]??(k==='width'?DEFAULT_PREVIEW_WIDTH:k==='zoom'?100:ctx[k])}${k==='width'||k==='radius'?'px':'%'}`;}
  settings.querySelectorAll('[data-preview-device]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.previewDevice==='auto'?v.fluid:!v.fluid&&Number(el.dataset.previewDevice)===v.width)));
  geometry();
  if(appearanceChanged){applyPreviewScope(scope,ctx);onChange(ctx,{...overrides});}
  if(publishingSession){updatePublishingControls();updatePublishingGuide({announce:false});}
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
 function outside(e){if(!opened||!(panelMode==='float'||window.innerWidth<1100)||settings.contains(e.target)||trigger.contains(e.target))return;const path=e.composedPath?.()||[e.target],target=publishingSession?sourceTarget():null;if(!(target&&path.includes(target)))setOpen(false);}
 function publishingInput(e){
  const input=e.target.closest?.('[data-publishing-control]');if(!input||input.type!=='range')return;
  const control=input.dataset.publishingControl;
  try{const normalized=normalizePublishingPatch(publishingTargetId,{[control]:Number(input.value)});if(!publishingGesture)beginPublishingGesture();applyPublishingEdit(control,normalized[control]);}catch{updatePublishingControls();}
 }
 function publishingKeydown(e){const input=e.target.closest?.('[data-publishing-control]');if(input&&input.type==='range'&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(e.key))beginPublishingGesture();}
 function publishingFrameLoad(){if(!publishingSession||kind!=='block')return;publishingMeasurements=null;sourceTarget();sendPublishingInspect();publishingGuide?.update({announce:false});}
 function publishingMessage(event){receivePublishingSnapshot(event);}
 async function publishingClick(event){
  const action=event.target.closest?.('[data-publishing-copy],[data-publishing-export],[data-publishing-import]');
  if(!action)return;
  if(!publishingSession)return;
  const status=settings.querySelector('[data-publishing-status]'),importField=settings.querySelector('[data-publishing-import-json]');
  if(action.hasAttribute('data-publishing-export')){
   const envelope=exportPublishingEnvelope({kind,itemId:id,targetId:publishingTargetId,supportedOverrides:overrides,sourceValues:publishingSession.snapshot(publishingTargetId).values});
   const json=JSON.stringify(envelope,null,2);
   if(copy){const copied=await copy(json,'퍼블리싱 JSON을 복사했습니다.');if(status)status.textContent=copied===false?'클립보드 복사에 실패했습니다. 직접 복사 대화상자를 확인하세요.':'퍼블리싱 JSON을 복사했습니다.';}
   else if(importField){importField.value=json;importField.focus({preventScroll:true});importField.select();if(status)status.textContent='클립보드 기능이 없어 JSON을 입력란에 표시했습니다.';}
   return;
  }
  if(action.hasAttribute('data-publishing-import')){
   try{
    const source=JSON.parse(importField?.value||'');
    if(source?.schema==='klic-preview-v1'){
     const preview=normalizePreviewEnvelope(source,{kind,id});overrides=preview.overrides;persist();sync();
     if(status)status.textContent='기존 프리뷰 설정을 적용했습니다.';
     return;
    }
    const envelope=normalizePublishingEnvelope(source);
    if(envelope.kind!==kind||envelope.itemId!==id||envelope.targetId!==publishingTargetId)throw new TypeError('Publishing envelope does not match this target');
    overrides=envelope.supportedOverrides;persist();sync();replacePublishingValues(envelope.sourceRecipe.values);
    if(status)status.textContent='등록된 target의 설정과 source recipe를 적용했습니다.';
   }catch{
    if(status)status.textContent='JSON을 적용하지 못했습니다. 버전, 현재 항목, 등록 target과 허용 값을 확인하세요.';
   }
   return;
  }
  let css;try{css=publishingSession.exportCSS(publishingTargetId);}catch{notify?.('먼저 반경·패딩·경계 값을 조정해 주세요.');return;}
  if(dialogPublishingRoot){const status=dialogPublishingRoot.querySelector('[data-publishing-copy-status]'),fallback=dialogPublishingRoot.querySelector('[data-publishing-copy-fallback]');try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(css);else{const temporary=document.createElement('textarea');temporary.value=css;temporary.style.cssText='position:fixed;left:-9999px';document.body.append(temporary);temporary.select();const copied=document.execCommand('copy');temporary.remove();if(!copied)throw new Error('clipboard-copy-failed');}status.textContent='수정 CSS를 복사했습니다.';fallback.hidden=true;}catch{status.textContent='클립보드에 복사하지 못했습니다. 아래 코드 영역에서 직접 복사하세요.';fallback.hidden=false;fallback.value=css;fallback.focus({preventScroll:true});fallback.select();}return;}
  await copy?.(css,'등록 target의 수정 CSS를 복사했습니다.');
 }
 const publishingAbort=new AbortController();
 if(publishingSession&&publishingHost){
  if(id!=='dialog')publishingGuide=mountPublishingGuideAt(publishingHost);
  settings.addEventListener('input',publishingInput,{signal:publishingAbort.signal});
  settings.addEventListener('click',publishingClick,{signal:publishingAbort.signal});
  settings.addEventListener('pointerdown',event=>{if(event.target.closest?.('[data-publishing-control]'))beginPublishingGesture();},{signal:publishingAbort.signal});
  settings.addEventListener('keydown',publishingKeydown,{signal:publishingAbort.signal});
  settings.addEventListener('change',event=>{if(event.target.closest?.('[data-publishing-control]'))finishPublishingGesture();},{signal:publishingAbort.signal});
  document.addEventListener('pointerup',finishPublishingGesture,{signal:publishingAbort.signal,capture:true});
  document.addEventListener('pointercancel',finishPublishingGesture,{signal:publishingAbort.signal,capture:true});
  document.addEventListener('keyup',finishPublishingGesture,{signal:publishingAbort.signal,capture:true});
  window.addEventListener('message',publishingMessage,{signal:publishingAbort.signal});
  if(frame)frame.addEventListener('load',publishingFrameLoad,{signal:publishingAbort.signal});
  updatePublishingControls();
  if(kind==='block')sendPublishingInspect();
 }
 trigger.addEventListener('click',toggle);settings.addEventListener('click',dismiss);document.addEventListener('keydown',escape);document.addEventListener('pointerdown',outside);window.addEventListener('resize',applyPanelMode);
 const resizeObserver=typeof ResizeObserver==='function'?new ResizeObserver(geometry):null;if(viewport)resizeObserver?.observe(viewport);if(fullscreenBar)resizeObserver?.observe(fullscreenBar);
 if(frame){frame.addEventListener('load',observeFrameContent);observeFrameContent();}
 settings.addEventListener('input',input);settings.addEventListener('change',input);settings.addEventListener('click',click);applyPanelMode();sync();
 return {sync,patch,context:()=>previewContext(getBase(),overrides),refreshPublishing(){sendPublishingInspect();(dialogPublishingGuide||publishingGuide)?.update({announce:false});},activateDialogGuide,deactivateDialogGuide,destroy(){setOpen(false);deactivateDialogGuide();publishingAbort.abort();publishingGuide?.destroy();if(publishingSession){if(kind==='component')restorePublishingInline();else{const revision=publishingSession.snapshot(publishingTargetId).revision,snapshot=publishingSession.clear(publishingTargetId,revision);sendPublishingMessage('klic:publishing-patch',snapshot.revision,{});sendPublishingMessage('klic:publishing-dispose',snapshot.revision,{});}}resizeObserver?.disconnect();frameResizeObserver?.disconnect();frameMutationObserver?.disconnect();frame?.removeEventListener('load',observeFrameContent);settings.remove();trigger.removeEventListener('click',toggle);settings.removeEventListener('click',dismiss);document.removeEventListener('keydown',escape);document.removeEventListener('pointerdown',outside);window.removeEventListener('resize',applyPanelMode);settings.removeEventListener('input',input);settings.removeEventListener('change',input);settings.removeEventListener('click',click);}};
}
