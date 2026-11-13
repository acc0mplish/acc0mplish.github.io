import {createTokens,resolveTokens,formatValue} from './tokens.mjs';
import {readPreferences,resolveTheme} from './preferences.mjs';
import {FONT_IDS,FONT_NAMES,FONT_OPTIONS,fontFaceCSS} from './font-registry.mjs';
import {createPublishingSession,deriveConcentricRadii,normalizePublishingPatch,resolveUsedCornerRadii} from './publishing-model.mjs';
import {getPublishingTarget} from './publishing-targets.mjs';
import {mountPublishingGuide} from './publishing-guide.mjs';

const escapeHTML=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const clamp=(value,min,max)=>Math.min(max,Math.max(min,Number(value)));
const round=value=>Number(value.toFixed(3));
const storageKey='klic-resize-lab-checklist-v1';
const savedScreensKey='klic-resize-lab-screens-v1';
const previewResizeModeKey='klic.resize-lab.preview-resize-mode';
const maxSavedScreens=8;
const frameColorPaths=['surface','panel','soft','selected','text','muted','border','control-border','accent','on-accent'].map(role=>`klic.component.block.color.${role}`).concat('klic.semantic.color.focus');

function frameAppearance(doc=globalThis.document){
  let storage;try{storage=doc?.defaultView?.localStorage;}catch{}
  const preferences=readPreferences(storage),data=doc?.documentElement?.dataset||{};
  const theme=['light','dark'].includes(data.theme)?data.theme:resolveTheme(preferences,Boolean(doc?.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches));
  return {...preferences,theme,brand:data.brand==='b'?'b':'a',colorTheme:data.colorTheme||preferences.colorTheme};
}
function frameTheme(appearance,source){
  const mode=appearance.theme==='dark'?'dark':'light',computed=source?.ownerDocument?.defaultView?.getComputedStyle(source);
  let values;
  const variables=Object.fromEntries(frameColorPaths.map(path=>{
    const name='--'+path.replaceAll('.','-'),current=computed?.getPropertyValue(name).trim();
    if(current)return [name,current];
    values??=resolveTokens(createTokens(appearance.brand==='b'?'b':'a',mode,appearance));
    return [name,formatValue(values[path])];
  }));
  return {mode,variables};
}

export const RESIZE_LAB_TABS=[
  {id:'viewport',label:'뷰포트·브레이크포인트',description:'실제 화면 폭과 높이로 탐색·카드·입력을 확인합니다.'},
  {id:'breakpoints',label:'브레이크포인트',description:'경계의 바로 전과 후를 비교하며 레이아웃이 바뀌는 순간을 찾습니다.'},
  {id:'typography',label:'타이포그래피',description:'제목의 유동 크기와 본문·입력의 변화를 수치로 확인합니다.'},
  {id:'layout',label:'레이아웃',description:'컨테이너, 그리드, 여백을 함께 조정해 콘텐츠 밀도를 살펴봅니다.'},
  {id:'qa',label:'검수 체크리스트',description:'좁은 화면부터 긴 문구까지 직접 확인하고 결과를 기록합니다.'},
  {id:'geometry',label:'반경·패딩',description:'border와 padding이 안쪽 곡률에 미치는 영향을 실제 카드로 확인합니다.'},
  {id:'effects',label:'표면·효과',description:'실제 target에서 모서리·그림자·간격·넘침·transform을 비교합니다.'}
];
const breakpoints=[
  {id:'mobile',label:'모바일',min:0,columns:1},
  {id:'sm',label:'작은 화면',min:640,columns:2},
  {id:'md',label:'태블릿',min:768,columns:2},
  {id:'lg',label:'데스크톱',min:1024,columns:3},
  {id:'xl',label:'와이드',min:1280,columns:4}
];
const devices=[['mobile','모바일',390,844],['tablet','태블릿',768,1024],['laptop','노트북',1280,800],['desktop','데스크톱',1440,900]];
const checkItems=[
  ['reflow','320px에서 내용 읽기','페이지 전체의 가로 스크롤 없이 제목·본문·입력을 읽을 수 있나요?'],
  ['boundary','경계 전후 비교','767 / 768px, 1023 / 1024px에서 콘텐츠가 갑자기 겹치거나 사라지지 않나요?'],
  ['text','텍스트 200% 확인','텍스트 배율을 올렸을 때 문구가 잘리지 않고 버튼 높이가 늘어나나요?'],
  ['zoom','브라우저 확대 직접 확인','실제 브라우저 메뉴에서 200% 확대 후 탐색과 입력을 사용할 수 있나요?'],
  ['keyboard','키보드로 끝까지 이동','Tab / Shift+Tab으로 모든 입력과 버튼에 접근하고 포커스를 볼 수 있나요?'],
  ['content','긴 문구와 입력 확인','긴 제목과 식별자도 레이아웃 안에서 줄바꿈되며 폼 피드백이 보이나요?']
];
let settings={width:1280,height:800,fit:true,fitPercent:100,textScale:100,min:24,max:40,from:480,to:1440,basis:'container',container:130,font:'pretendard',headingFont:'pretendard',columns:3,gap:20,padding:32,maxWidth:1120,autoGrid:true,title:'팀의 다음 가능성을 만드는 공간',longText:false};
let previewResizeMode='fixed';
const geometryDefaults={outerRadius:24,padding:8,innerPadding:8,borderWidth:4,minFloor:4,useOpticalFloor:false};
let geometryValues={...geometryDefaults};
const geometryControlValues={geometryRadius:'outerRadius',geometryPadding:'padding',geometryInnerPadding:'innerPadding',geometryBorderWidth:'borderWidth',geometryMinFloor:'minFloor',geometryUseOpticalFloor:'useOpticalFloor'};
const effectsDefaults={cornerTopLeft:24,cornerTopRight:12,cornerBottomRight:24,cornerBottomLeft:12,borderWidth:1,borderStyle:'solid',showGuides:true,showCenters:false,padding:12,textWrap:'normal',fixture:'card',backdropBlur:12,lineHeight:150,letterSpacing:0,pillHeight:32,shadowX:0,shadowY:8,shadowBlur:20,shadowSpread:0,shadowInset:false,offsetX:0,layout:'grid-2',align:'start',rowGap:12,columnGap:16,margin:16,overflow:'auto',zIndex:2,surfaceAlpha:100,rotate:0,transformOrigin:'center',transitionDuration:180,outlineOffset:4};
export const EFFECT_FIXTURES=Object.freeze([
  {id:'card',label:'카드'},
  {id:'hero',label:'히어로'},
  {id:'grid',label:'그리드'},
  {id:'glass-dialog',label:'유리 다이얼로그 모형'},
]);
const effectFixturePresets={
  card:{},
  hero:{cornerTopLeft:28,cornerTopRight:28,cornerBottomRight:28,cornerBottomLeft:28,padding:20,fixture:'hero',layout:'flex-col',rowGap:20},
  grid:{cornerTopLeft:12,cornerTopRight:12,cornerBottomRight:12,cornerBottomLeft:12,padding:16,fixture:'grid',layout:'grid-3',rowGap:16,columnGap:20},
  'glass-dialog':{cornerTopLeft:20,cornerTopRight:20,cornerBottomRight:20,cornerBottomLeft:20,padding:20,fixture:'glass-dialog',backdropBlur:12,surfaceAlpha:84,shadowY:18,shadowBlur:44},
};
export function createEffectsFixtureState(){
  return Object.fromEntries(EFFECT_FIXTURES.map(({id})=>[id,{...effectsDefaults,...effectFixturePresets[id],fixture:id}]));
}
export function updateEffectsFixtureState(state,fixture,patch){
  if(!state||typeof state!=='object'||!Object.hasOwn(state,fixture)||!EFFECT_FIXTURES.some(item=>item.id===fixture))throw new TypeError('Unknown effects fixture');
  if(!patch||typeof patch!=='object'||Array.isArray(patch))throw new TypeError('Effects fixture patch must be an object');
  const candidate={...patch};
  if(Object.hasOwn(candidate,'fixture')&&candidate.fixture!==fixture)throw new TypeError('Fixture identity cannot be changed by a style patch');
  delete candidate.fixture;
  const normalized=Object.keys(candidate).length?normalizePublishingPatch('effects-card',candidate):{};
  return {...state,[fixture]:{...state[fixture],...normalized,fixture}};
}
const effectsFixtureDefaultValues=createEffectsFixtureState();
let effectsFixtureValues=createEffectsFixtureState();
let effectsValues={...effectsFixtureValues.card};
const effectsControlValues={effectsCornerTopLeft:'cornerTopLeft',effectsCornerTopRight:'cornerTopRight',effectsCornerBottomRight:'cornerBottomRight',effectsCornerBottomLeft:'cornerBottomLeft',effectsBorderWidth:'borderWidth',effectsBorderStyle:'borderStyle',effectsShowGuides:'showGuides',effectsShowCenters:'showCenters',effectsPadding:'padding',effectsTextWrap:'textWrap',effectsFixture:'fixture',effectsBackdropBlur:'backdropBlur',effectsLineHeight:'lineHeight',effectsLetterSpacing:'letterSpacing',effectsPillHeight:'pillHeight',effectsShadowX:'shadowX',effectsShadowY:'shadowY',effectsShadowBlur:'shadowBlur',effectsShadowSpread:'shadowSpread',effectsShadowInset:'shadowInset',effectsOffsetX:'offsetX',effectsLayout:'layout',effectsAlign:'align',effectsRowGap:'rowGap',effectsColumnGap:'columnGap',effectsMargin:'margin',effectsOverflow:'overflow',effectsZIndex:'zIndex',effectsSurfaceAlpha:'surfaceAlpha',effectsRotate:'rotate',effectsTransformOrigin:'transformOrigin',effectsTransitionDuration:'transitionDuration',effectsOutlineOffset:'outlineOffset'};
const publishingControlValues={...geometryControlValues,...effectsControlValues};
let pendingTabFocus=false,lastRenderedLabTab='',leftLabRoute=false,preserveNextViewport=false;

function resetScreenViewport(){
  settings.width=Math.max(320,Math.round(Number(globalThis.innerWidth)||1280));
  settings.height=Math.max(320,Math.round(Number(globalThis.innerHeight)||900));
  settings.fit=true;
  settings.fitPercent=100;
}
function prepareScreenViewport(tabId){
  const shouldReset=!lastRenderedLabTab||leftLabRoute||lastRenderedLabTab!==tabId;
  if(preserveNextViewport)preserveNextViewport=false;
  else if(shouldReset)resetScreenViewport();
  lastRenderedLabTab=tabId;
  leftLabRoute=false;
}
function readPreviewResizeMode(){try{return sessionStorage.getItem(previewResizeModeKey)==='fit'?'fit':'fixed';}catch{return previewResizeMode;}}

export function getBreakpoint(width){return {...[...breakpoints].reverse().find(point=>Number(width)>=point.min)||breakpoints[0]};}
export function fluidFontSize(width,{min,max,from,to,rootSize=16}){
  const slope=(max-min)/Math.max(1,to-from);
  return round(clamp((min-slope*from)*rootSize/16+slope*width,min*rootSize/16,max*rootSize/16));
}
export function buildFluidRule({min,max,from,to},unit='vw'){
  const slope=(max-min)/Math.max(1,to-from),intercept=(min-slope*from)/16;
  return `clamp(${round(min/16)}rem, calc(${round(intercept)}rem + ${round(slope*100)}${unit==='cqi'?'cqi':'vw'}), ${round(max/16)}rem)`;
}
export function buildTypographyCSS(settings){
  const unit=settings.basis==='container'?'cqi':'vw';
  return `${settings.basis==='container'?'.content { container-type: inline-size; }\n':''}.page-title {\n  font-size: ${settings.min/16}rem;\n  font-size: ${buildFluidRule(settings,unit)};\n  line-height: 1.3;\n  overflow-wrap: anywhere;\n}`;
}
function getQA(){try{const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');return {checked:saved.checked&&typeof saved.checked==='object'?saved.checked:{},notes:typeof saved.notes==='string'?saved.notes:''};}catch{return {checked:{},notes:''};}}
function saveQA(value){try{localStorage.setItem(storageKey,JSON.stringify(value));return true;}catch{return false;}}
function getSavedScreens(){try{const screens=JSON.parse(localStorage.getItem(savedScreensKey)||'[]');return Array.isArray(screens)?screens.filter(screen=>screen&&Number.isInteger(Number(screen.width))&&Number(screen.width)>=320&&Number.isInteger(Number(screen.height))&&Number(screen.height)>=320).map(screen=>({width:Number(screen.width),height:Number(screen.height),fit:typeof screen.fit==='boolean'?screen.fit:true,fitPercent:Number.isFinite(Number(screen.fitPercent))?clamp(screen.fitPercent,25,100):100})).slice(0,maxSavedScreens):[];}catch{return [];}}
function saveSavedScreens(screens){try{localStorage.setItem(savedScreensKey,JSON.stringify(screens));return true;}catch{return false;}}
function savedScreensListMarkup(){
  const screens=getSavedScreens();
  if(!screens.length)return '<p class="rl-small-note rl-saved-screens-empty">저장한 화면이 없습니다.</p>';
  return screens.map((screen,index)=>`<div class="rl-saved-screen"><button type="button" class="rl-saved-screen-load" data-rl-load-screen="${index}" aria-pressed="${settings.width===screen.width&&settings.height===screen.height}"><strong>${screen.width} × ${screen.height}</strong><small>맞춤 ${screen.fitPercent}%</small></button><button type="button" class="rl-saved-screen-delete" data-rl-delete-screen="${index}" aria-label="${screen.width} × ${screen.height} 화면 삭제">삭제</button></div>`).join('');
}
function savedScreensTools(){return `<section class="rl-saved-screens" aria-label="저장된 화면"><div class="rl-saved-screens-heading"><strong>저장된 화면</strong><button type="button" class="rl-button" data-rl-action="save-screen">현재 화면 저장</button></div><div class="rl-saved-screen-list" data-rl-saved-screen-list>${savedScreensListMarkup()}</div><p class="rl-small-note" data-rl-screen-status role="status">화면 크기와 맞춤 배율을 이 브라우저에 저장합니다. 최대 ${maxSavedScreens}개.</p></section>`;}
function range(name,label,value,min,max,unit='px',step=1){const publishingControl=publishingControlValues[name],disabled=name==='effectsBackdropBlur'&&effectsValues.fixture!=='glass-dialog';return `<label class="rl-field"><span>${label}<output data-rl-value="${name}">${value}${unit}</output></span><input type="range" data-rl-control="${name}"${publishingControl?` data-publishing-control="${publishingControl}"`:''} aria-label="${label}" min="${min}" max="${max}" step="${step}" value="${value}"${disabled?' disabled':''}></label>`;}
function numberField(name,label,value,min,max){return `<label class="rl-number"><span>${label}</span><div><input type="number" data-rl-control="${name}" value="${value}" min="${min}" max="${max}" step="1"><span>px</span></div></label>`;}
function fontField(name,label,value){return `<label class="rl-select-label"><span>${label}</span><select data-rl-control="${name}" aria-label="${label}">${FONT_OPTIONS.map(([id,title])=>`<option value="${id}" ${value===id?'selected':''}>${escapeHTML(title)}</option>`).join('')}</select></label>`;}
function activeTab(parts){let slug=parts[0]==='lab'?parts[1]:parts[0];if(slug==='breakpoints')slug='viewport';return RESIZE_LAB_TABS.find(tab=>tab.id===slug)||RESIZE_LAB_TABS[0];}
function dimensions(){return `<section class="rl-controls" aria-label="실험 화면 크기"><div class="rl-device-row"><div class="rl-preset-group" aria-label="기기 크기 프리셋">${devices.map(([id,label,width,height])=>`<button class="rl-device" data-rl-preset="${id}" aria-pressed="${settings.width===width&&settings.height===height}"><span>${label}</span><small>${width} × ${height}</small></button>`).join('')}</div><button class="rl-button" data-rl-action="rotate" aria-label="실험 화면 가로 세로 회전">↻ 회전</button></div><div class="rl-dimensions">${range('width','너비',settings.width,320,Math.max(1920,settings.width))}${range('height','높이',settings.height,320,Math.max(1920,settings.height))}${range('fitPercent','화면 맞춤 비율',settings.fitPercent,25,100,'%',5)}<label class="rl-check"><input type="checkbox" data-rl-control="fit" ${settings.fit?'checked':''}>화면에 맞춰 보기</label></div>${savedScreensTools()}</section>`;}
function viewportTools(){
  const track=breakpoints.map((point,index)=>'<button data-rl-width="'+(point.min||320)+'" class="rl-breakpoint-segment" data-rl-bp="'+point.id+'"><strong>'+point.id.toUpperCase()+'</strong><span>'+(point.min||320)+'–'+(breakpoints[index+1]?breakpoints[index+1].min-1:'1920')+'px</span></button>').join('');
  const boundaries=breakpoints.slice(1).map(point=>'<section><span class="rl-kicker">'+point.id.toUpperCase()+' · '+point.min+'px</span><div class="rl-step-buttons">'+[-1,0,1].map(offset=>'<button class="rl-button" data-rl-width="'+(point.min+offset)+'" aria-label="뷰포트 '+(point.min+offset)+'픽셀">'+(point.min+offset)+'</button>').join('')+'</div><p>'+(point.min===640?'카드 1 → 2열':point.min===768?'메뉴 버튼 → 탐색 링크':point.min===1024?'보조 패널 표시 · 카드 3열':'카드 4열')+'</p></section>').join('');
  return '<div class="rl-section-intro"><div><h2>화면·반응형</h2><p>뷰포트 크기와 breakpoint 경계를 한곳에서 조정합니다. 임계값 −1px / 기준 / +1px를 눌러 전환 순간을 확인하세요.</p></div><span class="rl-pill" data-rl-breakpoint>현재 '+getBreakpoint(settings.width).id.toUpperCase()+'</span></div>'+dimensions()+'<section class="rl-breakpoint-controls" aria-label="브레이크포인트 구간"><div class="rl-breakpoint-track">'+track+'</div><div class="rl-boundaries">'+boundaries+'</div></section><div class="rl-guidance"><span>관찰 포인트</span><p>768px에서 탐색이 펼쳐지고, 1024px에서 보조 패널이 나타납니다. 카드 열 수는 화면 폭에 따라 달라집니다.</p></div>';
}
function typographyTools(){return `<div class="rl-section-intro"><div><h2>크기는 유동적으로, 내용은 끝까지</h2><p>제목의 최소·최대 크기와 변화 구간을 정하세요. 본문은 1rem, 입력은 768px에서 1rem → 0.875rem으로 바뀝니다.</p></div><span class="rl-pill">실험값 · 전역 적용 없음</span></div><div class="rl-type-settings"><div class="rl-numeric-grid">${numberField('min','최소 글자',settings.min,16,95)}${numberField('max','최대 글자',settings.max,17,96)}${numberField('from','시작 폭',settings.from,320,1919)}${numberField('to','끝 폭',settings.to,321,1920)}</div><div class="rl-type-options"><label class="rl-select-label"><span>유동 크기 기준</span><select data-rl-control="basis"><option value="container" ${settings.basis==='container'?'selected':''}>컨테이너 · cqi</option><option value="viewport" ${settings.basis==='viewport'?'selected':''}>뷰포트 · vw</option></select></label>${range('container','콘텐츠 폭',settings.container,50,130,'%')}${range('textScale','텍스트 배율',settings.textScale,100,200,'%',25)}${fontField('font','본문 글꼴',settings.font)}${fontField('headingFont','제목 글꼴',settings.headingFont)}</div></div><label class="rl-text-field"><span>테스트 제목</span><input data-rl-control="title" maxlength="250" value="${escapeHTML(settings.title)}"></label><div class="rl-inline-controls">${range('width','뷰포트 너비',settings.width,320,Math.max(1920,settings.width))}${range('fitPercent','화면 맞춤 비율',settings.fitPercent,25,100,'%',5)}<label class="rl-check"><input type="checkbox" data-rl-control="fit" ${settings.fit?'checked':''}>화면에 맞춰 보기</label></div><div class="rl-code-row"><code data-rl-formula>${escapeHTML(buildFluidRule(settings,settings.basis==='container'?'cqi':'vw'))}</code><button class="rl-button" data-rl-action="copy-css">CSS 복사</button></div>`;}
function layoutTools(){return `<div class="rl-section-intro"><div><h2>컨테이너 안에서 균형 찾기</h2><p>열 수와 여백을 바꾸며 같은 콘텐츠가 어떻게 배치되는지 확인하세요.</p></div><span class="rl-pill">그리드 실험</span></div><div class="rl-layout-controls">${range('maxWidth','최대 콘텐츠 폭',settings.maxWidth,640,1600)}${range('padding','좌우 여백',settings.padding,12,64)}${range('gap','카드 간격',settings.gap,8,40)}${range('columns','설정 열 수',settings.columns,1,6,'열')}</div><div class="rl-layout-options"><label class="rl-check"><input type="checkbox" data-rl-control="autoGrid" ${settings.autoGrid?'checked':''}>화면에 맞춰 열 수 줄이기</label><label class="rl-check"><input type="checkbox" data-rl-control="longText" ${settings.longText?'checked':''}>긴 카드 문구로 테스트</label></div><div class="rl-inline-controls">${range('width','뷰포트 너비',settings.width,320,Math.max(1920,settings.width))}${range('fitPercent','화면 맞춤 비율',settings.fitPercent,25,100,'%',5)}<label class="rl-check"><input type="checkbox" data-rl-control="fit" ${settings.fit?'checked':''}>화면에 맞춰 보기</label></div><p class="rl-small-note">자동 줄이기를 끄면 설정한 열 수를 유지합니다. 좁은 카드에서 줄바꿈과 버튼 크기를 직접 비교하세요.</p>`;}
function geometryTools(){return `<div class="rl-section-intro"><div><h2>안쪽 모서리는 왜 작아질까요?</h2><p>반경에서 border와 padding을 차례로 빼고, 실제 세 겹 카드와 계산을 함께 살펴보세요.</p></div><span class="rl-pill">학습용 source edit · 전역 설정 없음</span></div><section class="rl-geometry-controls" aria-label="동심 반경 실험"><div class="rl-geometry-fields">${range('geometryRadius','바깥 반경',geometryValues.outerRadius,0,48)}${range('geometryBorderWidth','바깥 border',geometryValues.borderWidth,0,10)}${range('geometryPadding','바깥 padding',geometryValues.padding,0,24)}${range('geometryInnerPadding','안쪽 padding',geometryValues.innerPadding,0,24)}${range('geometryMinFloor','선택적 최소 반경',geometryValues.minFloor,0,12)}<label class="rl-check"><input type="checkbox" data-rl-control="geometryUseOpticalFloor" data-publishing-control="useOpticalFloor" ${geometryValues.useOpticalFloor?'checked':''}>시각 보정 적용</label></div><p class="rl-small-note">예시: 24px − 4px border − 8px padding = 중간 12px. floor는 기본 꺼짐이며 켜면 실제 계산값과 화면값이 달라집니다.</p></section><div class="rl-geometry-guide" data-publishing-guide-host aria-label="동심 반경 조작 안내"></div>`;}
function effectsTools(){const select=(name,label,options)=>`<label class="rl-select-label"><span>${label}</span><select data-rl-control="effects${name[0].toUpperCase()+name.slice(1)}" data-publishing-control="${name}">${options.map(([value,text])=>`<option value="${value}" ${effectsValues[name]===value?'selected':''}>${text}</option>`).join('')}</select></label>`;return `<div class="rl-section-intro"><div><h2>스타일 조작이 실제 화면에서 만드는 차이</h2><p>하나씩 바꾸고 대상 크기·계산·이유를 안내에서 확인하세요. 관찰용 표시는 CSS 출력에서 빠집니다.</p></div><span class="rl-pill">실험 target · 전역·업무 상태 변경 없음</span></div><div class="rl-effects-controls"><section><h3>모서리와 경계</h3><div class="rl-effects-grid">${range('effectsCornerTopLeft','왼쪽 위',effectsValues.cornerTopLeft,0,44)}${range('effectsCornerTopRight','오른쪽 위',effectsValues.cornerTopRight,0,44)}${range('effectsCornerBottomRight','오른쪽 아래',effectsValues.cornerBottomRight,0,44)}${range('effectsCornerBottomLeft','왼쪽 아래',effectsValues.cornerBottomLeft,0,44)}${range('effectsBorderWidth','border 두께',effectsValues.borderWidth,0,8)}${select('borderStyle','border 종류',[['solid','solid'],['dashed','dashed'],['dotted','dotted']])}${select('fixture','실습 fixture',[['card','카드'],['hero','히어로'],['grid','그리드'],['glass-dialog','유리 다이얼로그 모형']])}${range('effectsBackdropBlur','유리 배경 흐림',effectsValues.backdropBlur,0,24)}</div><p class=rl-small-note>유리 배경 흐림은 유리 다이얼로그 모형에서만 적용됩니다.</p><div class="rl-effects-toggles"><label class="rl-check"><input type="checkbox" data-rl-control="effectsShowGuides" data-publishing-control="showGuides" ${effectsValues.showGuides?'checked':''}>치수 가이드 표시</label><label class="rl-check"><input type="checkbox" data-rl-control="effectsShowCenters" data-publishing-control="showCenters" ${effectsValues.showCenters?'checked':''}>곡률 중심점 표시</label></div></section><section><h3>타이포그래피와 hit area</h3><div class="rl-effects-grid">${range('effectsPadding','조작 영역 padding',effectsValues.padding,2,22)}${select('textWrap','한글 줄바꿈',[['normal','기본 줄바꿈'],['keep-all','keep-all'],['ellipsis','한 줄 말줄임']])}${range('effectsLineHeight','행간',effectsValues.lineHeight,100,220,'% ',5)}${range('effectsLetterSpacing','자간 · 0.1px 단위',effectsValues.letterSpacing,-2,8,'단계')}${range('effectsPillHeight','알약 높이',effectsValues.pillHeight,20,48)}</div></section><section><h3>그림자와 이동</h3><div class="rl-effects-grid">${range('effectsShadowX','그림자 X',effectsValues.shadowX,-24,24)}${range('effectsShadowY','그림자 Y',effectsValues.shadowY,-24,24)}${range('effectsShadowBlur','그림자 흐림',effectsValues.shadowBlur,0,48)}${range('effectsShadowSpread','그림자 확산',effectsValues.shadowSpread,-12,16)}${range('effectsOffsetX','시각적 X 이동',effectsValues.offsetX,-20,20)}${range('effectsRotate','회전',effectsValues.rotate,-30,30,'deg')}</div><div class="rl-effects-toggles"><label class="rl-check"><input type="checkbox" data-rl-control="effectsShadowInset" data-publishing-control="shadowInset" ${effectsValues.shadowInset?'checked':''}>inset 그림자</label>${select('transformOrigin','회전 기준점',[['center','center'],['top left','top left'],['bottom right','bottom right']])}</div></section><section><h3>레이아웃과 넘침</h3><div class="rl-effects-grid">${select('layout','배치',[['flex-row','flex row'],['flex-col','flex column'],['grid-2','grid 2열'],['grid-3','grid 3열']])}${select('align','정렬',[['start','시작'],['center','가운데'],['between','양끝']])}${range('effectsRowGap','행 간격',effectsValues.rowGap,4,36)}${range('effectsColumnGap','열 간격',effectsValues.columnGap,4,36)}${range('effectsMargin','인접 block margin',effectsValues.margin,0,32)}${select('overflow','넘침 처리',[['hidden','hidden'],['auto','auto · 스크롤']])}</div><p class="rl-small-note">마진 실습은 일반 block 흐름의 양수 수직 margin만 비교합니다. Flex/Grid gap과 다르게 상쇄될 수 있습니다.</p></section><section><h3>표면·stacking·전환</h3><div class="rl-effects-grid">${range('effectsZIndex','z-index',effectsValues.zIndex,1,20)}${range('effectsSurfaceAlpha','표면 alpha',effectsValues.surfaceAlpha,0,100,'%',5)}${range('effectsTransitionDuration','전환 시간',effectsValues.transitionDuration,50,800,'ms',10)}${range('effectsOutlineOffset','outline offset',effectsValues.outlineOffset,0,14)}</div></section><div class="rl-effects-actions"><button class="rl-button" data-rl-action="reset-effects">이 실험만 초기화</button><button class="rl-button rl-button-primary" data-rl-action="copy-effects-css">현재 CSS 복사</button></div><div data-publishing-guide-host class="rl-geometry-guide" aria-label="표면과 효과 조작 안내"></div></div>`;}
function preview(tab){return `<section class="rl-preview" aria-label="실시간 반응형 미리보기"><div class="rl-stage" data-rl-stage tabindex="0" role="region" aria-label="실제 페이지 미리보기. 본문 크기 고정 시 필요한 부분을 가로로 스크롤할 수 있습니다."><div class="rl-frame-holder" data-rl-holder><iframe class="rl-frame" data-rl-frame title="${tab.label} 반응형 인터랙티브 샘플" sandbox="allow-same-origin" srcdoc="${escapeHTML(buildFrameDocument(tab.id))}"></iframe></div></div></section><div class="rl-readouts" aria-live="polite" aria-atomic="true"><div><span>실제 뷰포트</span><strong data-rl-metric="viewport">측정 중</strong></div><div><span>${tab.id==='typography'?'제목 / 본문 / 입력':tab.id==='layout'?'카드 열 수 / 간격':tab.id==='geometry'?'반경 / padding':tab.id==='effects'?'표면 / 그림자':'현재 구간 / 카드 열 수'}</span><strong data-rl-metric="primary">측정 중</strong></div><div><span>${tab.id==='typography'?'유동 크기 기준 폭':tab.id==='layout'?'콘텐츠 폭':tab.id==='geometry'||tab.id==='effects'?'실제 target 크기':'레이아웃 상태'}</span><strong data-rl-metric="secondary">측정 중</strong></div></div>`;}
function notes(tab){const text={viewport:['높이도 하나의 제약입니다','높이를 줄이면 프레임 내부가 스크롤됩니다. 화면 밖의 콘텐츠와 입력 피드백에 계속 접근할 수 있는지 살펴보세요.'],breakpoints:['경계값은 제품 콘텐츠에 맞게','640 / 768 / 1024 / 1280px는 이 샘플의 실험 기준입니다. 사용 중인 화면과 실제 콘텐츠로 적절한 전환점을 결정하세요.'],typography:['브라우저 확대와 텍스트 배율','텍스트 배율은 프레임 내부의 rem 기준만 바꿉니다. 실제 브라우저 확대는 CSS 뷰포트와 화면 전체에 영향을 주므로 브라우저 메뉴에서 별도로 확인하세요.'],layout:['고정 열 수와 반응형 열 수','자동 열 수는 현재 브레이크포인트의 열 수와 설정 열 수 중 작은 값을 사용합니다. 그리드 항목은 minmax(0, 1fr)로 내용이 길어져도 줄바꿈됩니다.'],geometry:['숫자와 화면에서 확인하는 실험값','반경은 border와 padding만큼 안쪽에서 줄어듭니다. 선택적 floor를 켜면 시각적 보정값과 기하학 결과를 따로 비교할 수 있습니다.'],effects:['실제 CSS로 차이를 비교합니다','각 조작은 등록한 target과 연결됩니다. 측정값은 사실, 권장 사항은 설명으로 표시하며 제품 코드에는 관찰용 guide를 넣지 않습니다.']}[tab.id];return `<aside class="rl-note"><span aria-hidden="true">ⓘ</span><div><strong>${text[0]}</strong><p>${text[1]}</p></div></aside>`;}
function qaPanel(){const qa=getQA(),count=checkItems.filter(([id])=>qa.checked[id]).length;return `<div class="rl-section-intro"><div><h2>관찰한 결과를 남겨두세요</h2><p>체크는 직접 검수한 기록입니다. 자동 적합성 판정을 의미하지 않습니다.</p></div><span class="rl-pill" data-rl-qa-count>${count} / ${checkItems.length} 확인</span></div><div class="rl-qa-grid"><section class="rl-qa-list" aria-label="반응형 수동 검수">${checkItems.map(([id,title,description])=>`<label class="rl-qa-item"><input type="checkbox" data-rl-check="${id}" ${qa.checked[id]?'checked':''}><span><strong>${title}</strong><small>${description}</small></span></label>`).join('')}</section><aside class="rl-qa-aside"><h3>바로 테스트하기</h3><button class="rl-scenario" data-rl-scenario="mobile"><span>좁은 화면</span><strong>320 × 568 <span>↗</span></strong></button><button class="rl-scenario" data-rl-scenario="boundary"><span>탐색 전환 직전</span><strong>767 × 800 <span>↗</span></strong></button><button class="rl-scenario" data-rl-scenario="text"><span>큰 텍스트</span><strong>200% <span>↗</span></strong></button><p>테스트 바로가기는 실험 설정만 변경합니다.</p></aside></div><label class="rl-text-field rl-notes-field"><span>검수 메모</span><textarea data-rl-notes rows="4" maxlength="2000" placeholder="예: 320px에서 긴 제목의 줄바꿈 확인. 브라우저 200% 확대 검수 필요.">${escapeHTML(qa.notes)}</textarea></label><div class="rl-qa-footer"><span data-rl-save-status role="status">이 브라우저에 체크리스트와 메모를 저장합니다.</span><div><button class="rl-button" data-rl-action="reset-qa">기록 초기화</button><button class="rl-button rl-button-primary" data-rl-action="copy-report">검수 기록 복사</button></div></div><aside class="rl-note"><span aria-hidden="true">ⓘ</span><div><strong>실제 제품에서도 한 번 더</strong><p>이 샘플에서의 확인은 실제 제품의 접근성 검수를 대신하지 않습니다. 브라우저 확대, 키보드, 보조 기술을 제품 화면에서도 확인하세요.</p></div></aside>`;}

function labNavigation(tab){
  const groups=[
    {label:'화면·반응형',ids:['viewport']},
    {label:'글자·배치',ids:['typography','layout']},
    {label:'모서리·표면',ids:['geometry','effects']},
    {label:'검수',ids:['qa']}
  ];
  return '<nav class="rl-lab-navigation" aria-label="실험 설정 종류">'+groups.map(group=>{
    const expanded=group.ids.includes(tab.id);
    return '<details class="rl-lab-nav-group"'+(expanded?' open':'')+'><summary>'+group.label+'</summary><div>'+group.ids.map(id=>{
      const item=RESIZE_LAB_TABS.find(entry=>entry.id===id);
      return '<a class="rl-lab-nav-link" href="#lab/'+id+'"'+(tab.id===id?' aria-current="page"':'')+'>'+item.label+'</a>';
    }).join('')+'</div></details>';
  }).join('')+'</nav>';
}

function previewParts(tab){
  const markup=preview(tab);
  const readoutsAt=markup.indexOf('<div class="rl-readouts"');
  return readoutsAt<0?{canvas:markup,readouts:''}:{canvas:markup.slice(0,readoutsAt),readouts:markup.slice(readoutsAt)};
}

export function renderResizeLab(routeParts=[]){
  const tab=activeTab(routeParts);
  previewResizeMode=readPreviewResizeMode();
  prepareScreenViewport(tab.id);
  const tools=tab.id==='qa'?qaPanel():({viewport:viewportTools,typography:typographyTools,layout:layoutTools,geometry:geometryTools,effects:effectsTools}[tab.id]||viewportTools)();
  const previewMarkup=previewParts(tab);
  const controls=tools.replace(/<div(?=[^>]*data-publishing-guide-host)[^>]*><\/div>/g,'');
  const guide=['geometry','effects'].includes(tab.id)?'<div data-publishing-guide-host class="rl-geometry-guide" aria-label="'+(tab.id==='geometry'?'동심 반경':'표면과 효과')+' 조작 안내"></div>':'';
  const note=tab.id==='qa'?'':notes(tab);
  return '<section class="resize-lab" data-resize-lab data-rl-tab="'+tab.id+'" data-rl-preview-sizing="'+previewResizeMode+'">'+
    '<h1 class="rl-visually-hidden" id="resize-lab-title">리사이즈 실험실 · '+tab.label+'</h1>'+
    '<button type="button" class="rl-lab-trigger rl-button rl-button-primary" data-rl-action="toggle-lab-drawer" aria-controls="rl-lab-customize-drawer" aria-expanded="false">실험 설정</button>'+
    '<div class="rl-lab-canvas" id="resize-lab-panel" aria-labelledby="resize-lab-title" role="region">'+previewMarkup.canvas+'</div>'+
    '<aside class="rl-lab-drawer" id="rl-lab-customize-drawer" data-rl-customize-drawer hidden role="region" aria-label="실험 설정">'+
      '<div class="rl-lab-resize-handle" data-rl-drawer-resize tabindex="0" role="separator" aria-orientation="vertical" aria-label="실험 설정 패널 크기 조절" aria-controls="resize-lab-panel" aria-valuemin="320" aria-valuemax="760" aria-valuenow="460"><span></span></div>'+
      '<div class="rl-lab-drawer-header"><span>실험 설정</span><div class="rl-preview-sizing-setting"><span>패널 조절 시 본문</span><div role="group" aria-label="드로어 크기 변경 시 본문 크기"><button type="button" class="rl-button" data-rl-preview-mode="fit" aria-pressed="'+(previewResizeMode==='fit')+'" title="남은 폭에 맞춰 본문 미리보기 크기도 조절합니다">함께 조절</button><button type="button" class="rl-button" data-rl-preview-mode="fixed" aria-pressed="'+(previewResizeMode==='fixed')+'" title="본문 미리보기 크기를 유지하고 필요한 부분은 가로로 스크롤합니다">고정</button></div></div><button type="button" class="rl-button" data-rl-action="close-lab-drawer">닫기</button></div>'+
      labNavigation(tab)+
      (guide?'<section class="rl-lab-drawer-live" aria-label="실시간 조작 안내">'+guide+'</section>':'')+
      '<div class="rl-lab-drawer-scroll">'+previewMarkup.readouts+(tab.id==='effects'?'<section class="rl-effects-comparison-setting" aria-label="스타일 비교 설정"><label class="rl-check"><input type="checkbox" id="effects-comparison-toggle" data-rl-control="effectsCompare" data-rl-effects-compare aria-controls="effects-reference" checked>기본 스타일과 나란히 비교</label><p data-rl-effect-reference>기준은 기본 스타일을 유지하고, 실험 카드에만 변경 사항을 적용합니다.</p></section>':'')+controls+note+'</div>'+
    '</aside>'+
  '</section>';
}


function geometryMarkup(){
  const g=deriveConcentricRadii({outerRadius:geometryValues.outerRadius,outerBorderWidth:geometryValues.borderWidth,outerPadding:geometryValues.padding,innerPadding:geometryValues.innerPadding,minFloor:geometryValues.minFloor,useOpticalFloor:geometryValues.useOpticalFloor});
  return `<section class="geometry-exercise" aria-labelledby="geometry-title"><div class="geometry-heading"><span class="eyebrow">CONCENTRIC RADIUS</span><h2 id="geometry-title">세 겹의 카드</h2><p>바깥 경계에서 안쪽으로 이동할수록 border와 padding만큼 사용 가능한 반경이 줄어듭니다.</p></div><div class="geometry-outer" data-klic-publishing-target="geometry-card" data-publishing-part="outer" style="border-radius:${g.outerRadius}px;border-width:${geometryValues.borderWidth}px;padding:${geometryValues.padding}px"><div class="geometry-middle" data-publishing-part="middle" style="border-radius:${g.middleRadius}px;padding:${geometryValues.innerPadding}px"><div class="geometry-inner" data-publishing-part="inner" style="border-radius:${g.innerRadius}px"><strong>콘텐츠 영역</strong><span>실제 target의 안쪽 곡률</span></div></div></div><p class="geometry-caption">바깥 · 중간 · 안쪽 반경을 실제 DOM에서 측정합니다.</p></section>`;
}

function geometryStyles(){
  return `.geometry-exercise{display:grid;gap:18px;margin:22px 0;padding:clamp(18px,4vw,30px);border:1px solid var(--klic-component-block-color-border);border-radius:12px;background:var(--klic-component-block-color-panel)}.geometry-heading h2{font-size:1.125rem;margin:0 0 6px}.geometry-heading p,.geometry-caption{font-size:.8125rem;line-height:1.7;color:var(--klic-component-block-color-muted)}.geometry-outer{max-width:540px;width:100%;min-height:200px;margin:0 auto;border-style:solid;border-color:var(--klic-component-block-color-accent);background:var(--klic-component-block-color-selected);transition:none}.geometry-middle{min-height:150px;display:grid;place-items:center;background:var(--klic-component-block-color-panel)}.geometry-inner{min-height:78px;width:100%;display:grid;align-content:center;gap:4px;padding:14px;border:1px solid var(--klic-component-block-color-border);background:var(--klic-component-block-color-surface)}.geometry-inner strong{font-size:.875rem}.geometry-inner span{font-size:.75rem;color:var(--klic-component-block-color-muted)}.geometry-caption{text-align:center;margin:0}`;
}

function effectsMarkup(){return `<section class="effects-exercise" data-effects-stage data-show-reference="true"><div class="effects-heading"><span class="eyebrow">PUBLISHING EFFECTS</span><h2>기준과 실험을 나란히 비교</h2><p>기준 카드는 기본 스타일을 유지합니다. 실험 카드는 한 개의 실제 측정 target으로 변경합니다.</p></div><article class="effects-card effects-reference" id="effects-reference" data-effects-reference aria-label="기본 스타일 기준"><div class="effects-card-head"><div><strong>기준 스타일</strong><p>변경 전 기본 모양</p></div><span class="effects-pill">기준</span></div><button class="effects-hit-area" type="button" disabled>조작 영역</button><div class="effects-copy"><h3>한글 줄바꿈과 행간을 실제 문구로 확인합니다</h3><p>기준 카드는 실험 설정의 영향을 받지 않습니다.</p></div><div class="effects-layout"><div>카드 A · 기본 간격</div><div>카드 B · 기본 배치</div><div>카드 C · 기본 정렬</div></div></article><div class="effects-card" data-klic-publishing-target="effects-card" data-effects-fixture="card"><span class="effects-measure-lines" data-effects-guides hidden aria-hidden="true"></span><span class="effects-center effects-center-tl" data-effects-center hidden aria-hidden="true"></span><span class="effects-center effects-center-tr" data-effects-center hidden aria-hidden="true"></span><span class="effects-center effects-center-br" data-effects-center hidden aria-hidden="true"></span><span class="effects-center effects-center-bl" data-effects-center hidden aria-hidden="true"></span><div class="effects-card-head"><div><strong>프로젝트 디자인 검토</strong><p>실제 DOM 크기와 반응형 상태를 살펴보세요.</p></div><span class="effects-pill">실험 중</span></div><button class="effects-hit-area" data-publishing-part="hit-area" type="button">조작 영역</button><div class="effects-copy" data-publishing-part="text"><h3>한글 줄바꿈과 행간을 실제 문구로 확인합니다</h3><p>긴 제목이 바뀌어도 원문 문구와 접근 가능한 이름은 그대로 유지됩니다. padding, line-height, letter-spacing이 읽기 흐름에 미치는 영향을 관찰하세요.</p></div><div class="effects-layout" data-effects-layout><div>카드 A · 내용이 길어도 넘치지 않음</div><div>카드 B · 간격을 독립 조정</div><div>카드 C · 정렬과 방향 비교</div></div><div class="effects-margin-stack"><div class="effects-margin-one">일반 block · 첫 번째 양수 margin</div><div class="effects-margin-two">일반 block · 두 번째 양수 margin</div></div><div class="effects-stack"><span class="effects-stack-back">같은 stacking context</span><span class="effects-stack-front">앞·뒤 순서를 비교</span></div></div><p class="effects-caption">수치 안내와 실제 target 측정을 확인하세요. 가이드와 중심점 표시는 CSS 출력에서 제외됩니다. 유리 다이얼로그 fixture는 CSS 시각 모형이며 실제 native dialog를 대신하지 않습니다.</p></section>`;}

function effectsStyles(){return `.effects-exercise{display:grid;gap:18px;margin:22px 0;padding:clamp(18px,4vw,30px);border:1px solid var(--klic-component-block-color-border);border-radius:12px;background:var(--klic-component-block-color-panel)}.effects-heading h2{font-size:1.125rem;margin:0 0 6px}.effects-heading p,.effects-caption{color:var(--klic-component-block-color-muted);font-size:.8125rem;line-height:1.7}.effects-card{position:relative;isolation:isolate;width:100%;max-width:none;height:420px;max-height:580px;overflow:auto;box-sizing:border-box;margin:12px auto;padding:12px;border:1px solid var(--klic-component-block-color-border);border-radius:24px;background:var(--klic-component-block-color-panel);color:var(--klic-component-block-color-text);transition:transform 180ms ease,box-shadow 180ms ease}.effects-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}.effects-card-head strong{font-size:1rem}.effects-card-head p{margin-top:4px;color:var(--klic-component-block-color-muted);font-size:.75rem}.effects-pill{display:inline-flex;align-items:center;justify-content:center;min-height:32px;padding:0 10px;border:1px solid var(--klic-component-block-color-border);border-radius:999px;background:var(--klic-component-block-color-selected);color:var(--klic-component-block-color-accent);font-size:.7rem;white-space:nowrap}.effects-card[data-effects-fixture=hero]{background:var(--klic-component-block-color-selected);border-color:var(--klic-component-block-color-accent)}.effects-card[data-effects-fixture=hero] .effects-card-head{display:block;padding:18px 4px}.effects-card[data-effects-fixture=grid]{background:var(--klic-component-block-color-surface)}.effects-card[data-effects-fixture=grid] .effects-layout{grid-template-columns:repeat(3,minmax(0,1fr))}.effects-card[data-effects-fixture=glass-dialog]{width:min(420px,100%);height:360px;background:color-mix(in srgb,var(--klic-component-block-color-panel) 84%,transparent);backdrop-filter:blur(12px);box-shadow:0 18px 44px color-mix(in srgb,var(--klic-component-block-color-text) 18%,transparent)}.effects-hit-area{min-height:40px;padding:8px 14px;border:1px solid var(--klic-component-block-color-accent);border-radius:8px;background:var(--klic-component-block-color-accent);color:var(--klic-semantic-color-on-accent,#fff);cursor:pointer;transition:transform 180ms ease,box-shadow 180ms ease}.effects-copy{margin-top:14px;max-width:100%;min-width:0}.effects-copy h3{font-size:1rem;line-height:1.5;margin:0 0 6px}.effects-copy p{font-size:.8125rem;color:var(--klic-component-block-color-muted)}.effects-layout{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));margin-top:16px}.effects-layout>div{min-width:0;padding:14px;border:1px solid var(--klic-component-block-color-border);border-radius:8px;background:var(--klic-component-block-color-surface);font-size:.75rem;overflow-wrap:anywhere}.effects-margin-stack{display:block;margin-top:16px;padding:10px;background:var(--klic-component-block-color-soft);border-radius:8px}.effects-margin-stack>div{padding:10px;border:1px solid var(--klic-component-block-color-border);background:var(--klic-component-block-color-panel);font-size:.7rem}.effects-margin-one{margin-bottom:16px}.effects-margin-two{margin-top:10px}.effects-stack{position:relative;display:flex;align-items:center;min-height:72px;margin-top:14px;padding:12px;border-radius:8px;background:var(--klic-component-block-color-soft)}.effects-stack>span{position:absolute;padding:9px 12px;border:1px solid var(--klic-component-block-color-border);border-radius:7px;background:var(--klic-component-block-color-panel);font-size:.7rem}.effects-stack-back{left:20px;top:10px;z-index:1}.effects-stack-front{left:95px;top:28px;z-index:2}.effects-measure-lines{position:absolute;inset:0;z-index:4;border:1px dashed var(--klic-semantic-color-accent,#245fc2);pointer-events:none}.effects-center{position:absolute;z-index:5;width:7px;height:7px;border-radius:50%;background:var(--klic-semantic-color-danger,#b23a48);pointer-events:none}.effects-center-tl{top:0;left:0}.effects-center-tr{top:0;right:0}.effects-center-br{bottom:0;right:0}.effects-center-bl{bottom:0;left:0}.effects-caption{text-align:center;margin:0}.effects-hit-area:hover{transform:translateY(-2px);box-shadow:0 4px 10px color-mix(in srgb,var(--klic-semantic-color-text) 18%,transparent)}.effects-hit-area:focus-visible{outline:2px solid var(--klic-semantic-color-accent);outline-offset:4px}@media(prefers-reduced-motion:reduce){.effects-card,.effects-hit-area{transition:none!important}}`;
}

export function setEffectsComparisonVisibility(doc, visible){
  const stage=doc?.querySelector?.('[data-effects-stage]'),reference=doc?.querySelector?.('[data-effects-reference]');
  if(!stage||!reference)return false;
  stage.dataset.showReference=String(Boolean(visible));
  reference.hidden=!visible;
  return true;
}

function effectsComparisonStyles(){return `.effects-exercise{grid-template-columns:repeat(2,minmax(0,1fr));align-items:start}.effects-heading,.effects-caption{grid-column:1/-1}.effects-exercise[data-show-reference="false"]{grid-template-columns:minmax(0,1fr)}.effects-reference{border-style:dashed}.effects-reference .effects-hit-area{cursor:default}@media(max-width:640px){.effects-exercise{grid-template-columns:minmax(0,1fr)}}`;}

export function buildFrameDocument(tab='viewport',appearance){
  const theme=frameTheme(appearance||frameAppearance(),appearance?null:globalThis.document?.documentElement);
  const typography=tab==='typography',layout=tab==='layout';
  const title=typography?settings.title:'작은 아이디어를,\n다음 프로젝트로.';
  const cardNames=settings.longText&&layout?['고객 경험을 더 세심하게 개선하기 위한 서비스 탐색 프로젝트','project_identifier_with_a_very_long_unbroken_name_2026','여러 팀이 함께 만드는 새로운 협업 방식','작은 화면에서도 끝까지 읽을 수 있는 프로젝트 제목']:['브랜드 리뉴얼','웹사이트 개선','사용자 리서치','디자인 시스템'];
  const bodyFont=FONT_NAMES[settings.font]||FONT_NAMES.pretendard;
  const headingFont=FONT_NAMES[settings.headingFont]||FONT_NAMES.pretendard;
  const fontFaces=fontFaceCSS('/fonts/');
  return `<!doctype html><html lang="ko" data-theme="${theme.mode}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>
${fontFaces}
:root{${Object.entries(theme.variables).map(([name,value])=>`${name}:${value}`).join(';')};--klic-ui-font:${bodyFont},system-ui,sans-serif;--klic-heading-font:${headingFont},system-ui,sans-serif}
*{box-sizing:border-box}html{font-size:${typography?settings.textScale/100*16:16}px;color-scheme:${theme.mode}}body{margin:0;font:1rem/1.6 var(--klic-ui-font,system-ui,sans-serif);color:var(--klic-component-block-color-text);background:var(--klic-component-block-color-surface)}h1,h2,h3{font-family:var(--klic-heading-font,var(--klic-ui-font,system-ui,sans-serif))}button,input{font:inherit;min-width:0}button{cursor:pointer}a{color:inherit;text-decoration:none}button,a,input{outline-offset:4px}button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid var(--klic-semantic-color-focus)}button{border:1px solid var(--klic-component-block-color-border);border-radius:7px;background:var(--klic-component-block-color-panel);color:var(--klic-component-block-color-text);padding:9px 13px}header{background:var(--klic-component-block-color-panel);border-bottom:1px solid var(--klic-component-block-color-border);display:flex;align-items:center;gap:24px;padding:18px max(20px,calc((100% - 1120px)/2));min-height:72px}.brand{font-weight:800;font-size:1.125rem;letter-spacing:-.04em;color:var(--klic-component-block-color-accent)}.brand span{color:var(--klic-component-block-color-text)}.navigation{display:none;gap:20px;font-size:.875rem}.navigation a[aria-current]{color:var(--klic-component-block-color-accent);font-weight:650}.menu{margin-left:auto;min-width:42px;min-height:42px;font-size:1rem}.mobile-nav{display:none;background:var(--klic-component-block-color-panel);padding:12px 20px;border-bottom:1px solid var(--klic-component-block-color-border)}.mobile-nav:not([hidden]){display:flex;gap:18px;flex-wrap:wrap}.account{display:none;margin-left:auto;border:1px solid var(--klic-component-block-color-border);border-radius:50%;width:34px;height:34px;align-items:center;justify-content:center;color:var(--klic-component-block-color-accent);background:var(--klic-component-block-color-selected);font-size:.75rem}main{max-width:${layout?settings.maxWidth:1120}px;width:100%;margin:auto;padding:32px ${layout?settings.padding:24}px}.shell{display:grid;gap:24px;grid-template-columns:minmax(0,1fr)}.content{min-width:0;width:${typography?settings.container:100}%;container-type:inline-size}.hero{background:var(--klic-component-block-color-selected);border:1px solid var(--klic-component-block-color-border);border-radius:12px;padding:26px}.eyebrow{font-size:.6875rem;letter-spacing:.14em;color:var(--klic-component-block-color-accent);font-weight:700;margin:0 0 12px}h1{font-size:${typography?buildFluidRule(settings,settings.basis==='container'?'cqi':'vw'):'clamp(1.5rem, 2.6vw, 2rem)'};line-height:1.3;letter-spacing:-.04em;margin:0 0 14px;overflow-wrap:anywhere;white-space:pre-line}p{font-size:1rem;margin:0;color:var(--klic-component-block-color-muted);overflow-wrap:anywhere}.hero p{max-width:45ch}.form{display:flex;gap:8px;flex-wrap:wrap;margin-top:22px}.form input::placeholder{color:var(--klic-component-block-color-muted);opacity:1}.form input{flex:1 1 180px;width:100%;max-width:340px;min-height:42px;padding:9px 12px;border:1px solid var(--klic-component-block-color-control-border);border-radius:7px;background:var(--klic-component-block-color-panel);color:var(--klic-component-block-color-text);font-size:1rem;line-height:1.5}.primary{color:var(--klic-component-block-color-on-accent);background:var(--klic-component-block-color-accent);border-color:var(--klic-component-block-color-accent);font-size:.875rem;font-weight:600;min-height:42px;white-space:normal}.feedback{margin-top:12px;color:var(--klic-component-block-color-accent);font-size:.8125rem}.section-top{display:flex;gap:10px;align-items:center;justify-content:space-between;margin:28px 0 14px}.section-top h2{font-size:1rem;margin:0}.section-top span{font-size:.75rem;color:var(--klic-component-block-color-muted)}.cards{display:grid;grid-template-columns:repeat(var(--columns),minmax(0,1fr));gap:${layout?settings.gap:16}px;--columns:${layout&&!settings.autoGrid?settings.columns:1}}.card{min-width:0;border:1px solid var(--klic-component-block-color-border);border-radius:10px;background:var(--klic-component-block-color-panel);padding:18px}.card-mark{display:flex;width:32px;height:32px;align-items:center;justify-content:center;border-radius:8px;background:var(--klic-component-block-color-selected);color:var(--klic-component-block-color-accent);font-weight:700;font-size:.8125rem;margin-bottom:20px}.card h3{font-size:.875rem;line-height:1.5;margin:0 0 8px;overflow-wrap:anywhere}.card p{font-size:.75rem;line-height:1.6}.card-footer{display:flex;align-items:center;gap:8px;justify-content:space-between;flex-wrap:wrap;border-top:1px solid var(--klic-component-block-color-border);padding-top:14px;margin-top:20px;color:var(--klic-component-block-color-muted);font-size:.6875rem}.card-footer button{font-size:.6875rem;padding:4px 8px;color:var(--klic-component-block-color-accent)}.side{display:none;border:1px solid var(--klic-component-block-color-border);border-radius:10px;padding:20px;background:var(--klic-component-block-color-panel);align-self:start;min-width:0}.side h2{font-size:.875rem;margin:0 0 14px}.side p{font-size:.75rem}.side ul{padding:0;list-style:none;margin:18px 0 0}.side li{font-size:.75rem;padding:12px 0;border-top:1px solid var(--klic-component-block-color-border);overflow-wrap:anywhere}.side li small{display:block;color:var(--klic-component-block-color-muted);margin-top:3px}.end-note{margin:26px 0 0;font-size:.6875rem;color:var(--klic-component-block-color-muted)}dialog{background:var(--klic-component-block-color-panel);max-width:min(380px,calc(100% - 32px));padding:24px;border:1px solid var(--klic-component-block-color-border);border-radius:12px;color:var(--klic-component-block-color-text)}dialog::backdrop{background:#10172288}dialog h2{font-size:1.125rem;margin:0 0 10px}dialog p{font-size:.875rem;margin-bottom:20px}
@media(min-width:640px){.cards{--columns:${layout?Math.min(settings.columns,2):2}}}@media(min-width:768px){.navigation{display:flex}.menu,.mobile-nav:not([hidden]){display:none}.account{display:flex}.form input{font-size:.875rem}}@media(min-width:1024px){.shell{grid-template-columns:${typography||layout?'minmax(0,1fr)':'minmax(0,1fr) 210px'}}.side{display:${typography||layout?'none':'block'}}.cards{--columns:${layout?Math.min(settings.columns,3):3}}}@media(min-width:1280px){.cards{--columns:${layout?Math.min(settings.columns,4):4}}}${layout&&!settings.autoGrid?`.cards{--columns:${settings.columns}!important}`:''}@media(max-width:479px){main{padding-block:22px}.hero{padding:20px}.section-top{align-items:flex-start}.form .primary{width:100%}.card{padding:16px}}[hidden]{display:none!important}${tab==='geometry'?geometryStyles():''}${tab==='effects'?effectsStyles()+effectsComparisonStyles():''}
</style></head><body><header><a href="#" class="brand" aria-label="워크스페이스 홈">KLIC<span> Workspace</span></a><nav class="navigation" aria-label="샘플 탐색"><a href="#projects" aria-current="page">프로젝트</a><a href="#activity">팀 활동</a></nav><span class="account" aria-label="김하늘 계정">KH</span><button class="menu" data-sample-menu aria-expanded="false" aria-controls="sample-mobile-nav" aria-label="샘플 탐색 메뉴 열기">☰</button></header><nav id="sample-mobile-nav" class="mobile-nav" aria-label="샘플 모바일 탐색" hidden><a href="#projects">프로젝트</a><a href="#activity">팀 활동</a></nav><main><div class="shell"><section class="content"><div class="hero"><p class="eyebrow">A SPACE FOR YOUR NEXT IDEA</p><h1 data-sample-title>${escapeHTML(title)}</h1><p data-sample-body>좋은 협업은 명확한 시작에서. 팀의 아이디어를 모으고, 함께 다음 단계를 만들어보세요.</p><form class="form" data-sample-form><label style="position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0)" for="sample-project">프로젝트 이름</label><input id="sample-project" name="project" placeholder="새 프로젝트 이름" maxlength="80" required><button class="primary" type="submit">프로젝트 만들기 ↗</button></form><p class="feedback" data-sample-feedback role="status" hidden></p></div>${tab==='geometry'?geometryMarkup():''}${tab==='effects'?effectsMarkup():''}<div class="section-top" id="projects"><h2>진행 중인 프로젝트</h2><span>4개 프로젝트</span></div><div class="cards">${cardNames.map((name,index)=>`<article class="card"><span class="card-mark">${['B','W','R','D'][index]}</span><h3>${escapeHTML(name)}</h3><p>${['일관된 경험을 위한 다음 단계','작은 개선으로 만드는 큰 변화','고객의 이야기를 듣는 시간','팀이 함께 쓰는 디자인 언어'][index]}</p><div class="card-footer"><span>${index+2}명 참여</span><button type="button" data-sample-detail="${escapeHTML(name)}">열기 ↗</button></div></article>`).join('')}</div><p class="end-note">KLIC · 화면 크기와 콘텐츠를 함께 살펴보는 인터랙티브 샘플</p></section><aside class="side" id="activity"><h2>최근 팀 활동</h2><p>작은 진전이 쌓이고 있어요.</p><ul><li>김하늘 · 새 시안 업로드<small>10분 전 · 브랜드 리뉴얼</small></li><li>이지원 · 리서치 정리<small>35분 전 · 사용자 리서치</small></li><li>박선준 · 컴포넌트 검토<small>1시간 전 · 디자인 시스템</small></li></ul></aside></div><dialog aria-labelledby="sample-dialog-title"><h2 id="sample-dialog-title"></h2><p>프로젝트 상세를 여는 인터랙션 예시입니다.</p><button data-sample-close>닫기</button></dialog></main></body></html>`;
}

export function applyPublishingGeometryStyles(doc,values=geometryValues){
  const outer=doc?.querySelector?.('[data-klic-publishing-target="geometry-card"]');
  const middle=outer?.querySelector?.('[data-publishing-part="middle"]')||doc?.querySelector?.('[data-publishing-part="middle"]');
  const inner=outer?.querySelector?.('[data-publishing-part="inner"]')||doc?.querySelector?.('[data-publishing-part="inner"]');
  if(!outer?.style||!middle?.style||!inner?.style)return false;
  const geometry=deriveConcentricRadii({outerRadius:values.outerRadius,outerBorderWidth:values.borderWidth,outerPadding:values.padding,innerPadding:values.innerPadding,minFloor:values.minFloor,useOpticalFloor:values.useOpticalFloor});
  outer.style.borderRadius=`${geometry.outerRadius}px`;
  outer.style.borderWidth=`${values.borderWidth}px`;
  outer.style.padding=`${values.padding}px`;
  middle.style.borderRadius=`${geometry.middleRadius}px`;
  middle.style.padding=`${values.innerPadding}px`;
  inner.style.borderRadius=`${geometry.innerRadius}px`;
  return true;
}

export function applyPublishingEffectsStyles(doc,values=effectsValues){
  const root=doc?.matches?.('[data-klic-publishing-target="effects-card"]')?doc:doc?.querySelector?.('[data-klic-publishing-target="effects-card"]');
  const hitArea=root?.querySelector?.('[data-publishing-part="hit-area"]');
  const text=root?.querySelector?.('[data-publishing-part="text"]');
  const layout=root?.querySelector?.('[data-effects-layout]');
  const pill=root?.querySelector?.('.effects-pill');
  const marginOne=root?.querySelector?.('.effects-margin-one'),marginTwo=root?.querySelector?.('.effects-margin-two');
  const stackFront=root?.querySelector?.('.effects-stack-front'),stackBack=root?.querySelector?.('.effects-stack-back');
  if(!root?.style||!hitArea?.style||!text?.style||!layout?.style||!pill?.style)return false;
  const style=root.style;
  style.borderTopLeftRadius=`${values.cornerTopLeft}px`;style.borderTopRightRadius=`${values.cornerTopRight}px`;style.borderBottomRightRadius=`${values.cornerBottomRight}px`;style.borderBottomLeftRadius=`${values.cornerBottomLeft}px`;
  style.borderWidth=`${values.borderWidth}px`;style.borderStyle=values.borderStyle;style.padding=`${values.padding}px`;
  root.dataset.effectsFixture=values.fixture;
  style.boxShadow=`${values.shadowX}px ${values.shadowY}px ${values.shadowBlur}px ${values.shadowSpread}px var(--klic-semantic-color-text,#132c46)${values.shadowInset?' inset':''}`;style.backdropFilter=values.fixture==='glass-dialog'?`blur(${values.backdropBlur}px)`:'none';style.webkitBackdropFilter=style.backdropFilter;
  style.transform=`translateX(${values.offsetX}px) rotate(${values.rotate}deg)`;style.transformOrigin=values.transformOrigin;style.transitionDuration=`${values.transitionDuration}ms`;
  style.overflow=values.overflow;style.zIndex=String(values.zIndex);style.backgroundColor=`color-mix(in srgb,var(--klic-component-block-color-selected) ${values.surfaceAlpha}%,transparent)`;
  hitArea.style.padding=`${values.padding}px`;hitArea.style.minHeight='40px';hitArea.style.transitionDuration=`${values.transitionDuration}ms`;hitArea.style.outlineOffset=`${values.outlineOffset}px`;
  pill.style.height=`${values.pillHeight}px`;pill.style.minHeight=`${values.pillHeight}px`;
  const heading=text.querySelector('h3');
  text.style.lineHeight=String(values.lineHeight/100);text.style.letterSpacing=`${values.letterSpacing/10}px`;
  if(heading){heading.style.whiteSpace=values.textWrap==='ellipsis'?'nowrap':'normal';heading.style.textOverflow=values.textWrap==='ellipsis'?'ellipsis':'clip';heading.style.overflow=values.textWrap==='ellipsis'?'hidden':'visible';heading.style.wordBreak=values.textWrap==='keep-all'?'keep-all':'normal';heading.style.overflowWrap=values.textWrap==='keep-all'?'break-word':'anywhere';}
  if(values.layout==='flex-row'||values.layout==='flex-col'){layout.style.display='flex';layout.style.flexDirection=values.layout==='flex-row'?'row':'column';layout.style.gridTemplateColumns='none';}
  else{layout.style.display='grid';layout.style.flexDirection='';layout.style.gridTemplateColumns=`repeat(${values.layout==='grid-3'?3:2},minmax(0,1fr))`;}
  layout.style.rowGap=`${values.rowGap}px`;layout.style.columnGap=`${values.columnGap}px`;
  layout.style.alignItems=values.align==='center'?'center':'start';layout.style.justifyContent=values.align==='center'?'center':values.align==='between'?'space-between':'start';
  if(marginOne)marginOne.style.marginBottom=`${values.margin}px`;if(marginTwo)marginTwo.style.marginTop=`${Math.round(values.margin*.625)}px`;
  if(stackFront)stackFront.style.zIndex=String(values.zIndex);if(stackBack)stackBack.style.zIndex=String(21-values.zIndex);
  const rect=root.getBoundingClientRect(),used=resolveUsedCornerRadii({width:rect.width,height:rect.height,topLeft:values.cornerTopLeft,topRight:values.cornerTopRight,bottomRight:values.cornerBottomRight,bottomLeft:values.cornerBottomLeft});
  for(const [selector,corner] of [['.effects-center-tl','topLeft'],['.effects-center-tr','topRight'],['.effects-center-br','bottomRight'],['.effects-center-bl','bottomLeft']]){const marker=root.querySelector(selector);if(!marker)continue;const radius=used.used[corner];if(corner==='topLeft'){marker.style.left=`${radius}px`;marker.style.top=`${radius}px`;}else if(corner==='topRight'){marker.style.right=`${radius}px`;marker.style.top=`${radius}px`;}else if(corner==='bottomRight'){marker.style.right=`${radius}px`;marker.style.bottom=`${radius}px`;}else{marker.style.left=`${radius}px`;marker.style.bottom=`${radius}px`;}}
  const guides=root.querySelector('[data-effects-guides]');if(guides)guides.hidden=!values.showGuides;
  root.querySelectorAll('[data-effects-center]').forEach(node=>{node.hidden=!values.showCenters;});
  return true;
}

export function exportPublishingEffectsCSS(values=effectsValues){
  const display=values.layout==='flex-row'||values.layout==='flex-col'?'flex':'grid';
  const direction=values.layout==='flex-col'?'column':'row';
  const columns=values.layout==='grid-3'?3:2;
  const gridTemplate=display==='grid'?`repeat(${columns}, minmax(0, 1fr))`:'none';
  const alignment=values.align==='center'?['center','center']:values.align==='between'?['start','space-between']:['start','start'];
  const fixtureCSS=values.fixture==='hero'?'[data-klic-publishing-target="effects-card"][data-effects-fixture=hero] { background: var(--klic-component-block-color-selected); border-color: var(--klic-component-block-color-accent); }':values.fixture==='grid'?'[data-klic-publishing-target="effects-card"][data-effects-fixture=grid] { background: var(--klic-component-block-color-surface); }':values.fixture==='glass-dialog'?`[data-klic-publishing-target="effects-card"][data-effects-fixture=glass-dialog] { width: min(420px, 100%); height: 360px; background: color-mix(in srgb, var(--klic-component-block-color-panel) 84%, transparent); backdrop-filter: blur(${values.backdropBlur??12}px); -webkit-backdrop-filter: blur(${values.backdropBlur??12}px); box-shadow: 0 18px 44px color-mix(in srgb, var(--klic-component-block-color-text) 18%, transparent); }`:'';
  const wrap=values.textWrap==='ellipsis'?'  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;':values.textWrap==='keep-all'?'  white-space: normal;\n  word-break: keep-all;\n  overflow-wrap: break-word;':'  white-space: normal;\n  word-break: normal;\n  overflow-wrap: anywhere;';
  const shadow=`${values.shadowX}px ${values.shadowY}px ${values.shadowBlur}px ${values.shadowSpread}px var(--klic-semantic-color-text)${values.shadowInset?' inset':''}`;
  return `[data-klic-publishing-target="effects-card"] {\n  border-top-left-radius: ${values.cornerTopLeft}px;\n  border-top-right-radius: ${values.cornerTopRight}px;\n  border-bottom-right-radius: ${values.cornerBottomRight}px;\n  border-bottom-left-radius: ${values.cornerBottomLeft}px;\n  border-width: ${values.borderWidth}px;\n  border-style: ${values.borderStyle};\n  padding: ${values.padding}px;\n  box-shadow: ${shadow};\n  transform: translateX(${values.offsetX}px) rotate(${values.rotate}deg);\n  transform-origin: ${values.transformOrigin};\n  transition-duration: ${values.transitionDuration}ms;\n  overflow: ${values.overflow};\n  background-color: color-mix(in srgb, var(--klic-component-block-color-selected) ${values.surfaceAlpha}%, transparent);\n}${fixtureCSS}\n[data-klic-publishing-target="effects-card"] [data-publishing-part="text"] {\n  line-height: ${values.lineHeight / 100};\n  letter-spacing: ${values.letterSpacing / 10}px;\n}\n[data-klic-publishing-target="effects-card"] [data-publishing-part="text"] h3 {\n${wrap}\n}\n[data-klic-publishing-target="effects-card"] [data-publishing-part="hit-area"] {\n  min-height: 40px;\n  padding: ${values.padding}px;\n}\n[data-klic-publishing-target="effects-card"] .effects-pill {\n  height: ${values.pillHeight}px;\n  min-height: ${values.pillHeight}px;\n}\n[data-klic-publishing-target="effects-card"] [data-effects-layout] {\n  display: ${display};\n  flex-direction: ${direction};\n  grid-template-columns: ${gridTemplate};\n  align-items: ${alignment[0]};\n  justify-content: ${alignment[1]};\n  row-gap: ${values.rowGap}px;\n  column-gap: ${values.columnGap}px;\n}\n[data-klic-publishing-target="effects-card"] .effects-margin-one { margin-bottom: ${values.margin}px; }\n[data-klic-publishing-target="effects-card"] .effects-margin-two { margin-top: ${Math.round(values.margin*.625)}px; }\n[data-klic-publishing-target="effects-card"] .effects-stack-front { z-index: ${values.zIndex}; }\n[data-klic-publishing-target="effects-card"] .effects-stack-back { z-index: ${21-values.zIndex}; }\n[data-klic-publishing-target="effects-card"] [data-publishing-part="hit-area"] { transition-duration: ${values.transitionDuration}ms; }\n[data-klic-publishing-target="effects-card"] [data-publishing-part="hit-area"]:hover { transform: translateY(-2px); box-shadow: 0 4px 10px color-mix(in srgb, var(--klic-semantic-color-text) 18%, transparent); }\n[data-klic-publishing-target="effects-card"] [data-publishing-part="hit-area"]:focus-visible { outline: 2px solid var(--klic-semantic-color-accent); outline-offset: ${values.outlineOffset}px; }`;
}

export function applyResizeLabFrameStyles(doc,tab,values=settings,viewportWidth=doc?.defaultView?.innerWidth||1280){
  if(!doc?.documentElement?.style)return false;
  const width=Math.max(1,Number(viewportWidth)||1280),bp=getBreakpoint(width).columns;
  const root=doc.documentElement,main=doc.querySelector?.('main'),content=doc.querySelector?.('.content'),title=doc.querySelector?.('[data-sample-title]'),input=doc.querySelector?.('#sample-project'),cards=doc.querySelector?.('.cards');
  root.style.fontSize=tab==='typography'?`${values.textScale/100*16}px`:'16px';
  root.style.setProperty('--klic-ui-font',`${FONT_NAMES[values.font]||FONT_NAMES.pretendard},system-ui,sans-serif`);
  root.style.setProperty('--klic-heading-font',`${FONT_NAMES[values.headingFont]||FONT_NAMES.pretendard},system-ui,sans-serif`);
  if(main){main.style.maxWidth=tab==='layout'?`${values.maxWidth}px`:'1120px';main.style.paddingInline=tab==='layout'?`${values.padding}px`:'24px';}
  if(content)content.style.width=tab==='typography'?`${values.container}%`:'100%';
  if(title){title.textContent=tab==='typography'?values.title:'작은 아이디어를,\n다음 프로젝트로.';title.style.removeProperty?.('font-size');}
  if(input){if(tab==='typography')input.style.fontSize=width>=768?'.875rem':'1rem';else input.style.removeProperty?.('font-size');}
  if(cards){const columns=tab==='layout'?(values.autoGrid?Math.min(values.columns,bp):values.columns):bp;cards.style.gridTemplateColumns=`repeat(${columns},minmax(0,1fr))`;cards.style.gap=`${tab==='layout'?values.gap:16}px`;}
  const normalNames=['브랜드 리뉴얼','웹사이트 개선','사용자 리서치','디자인 시스템'];
  const longNames=['고객 경험을 더 세심하게 개선하기 위한 서비스 탐색 프로젝트','project_identifier_with_a_very_long_unbroken_name_2026','여러 팀이 함께 만드는 새로운 협업 방식','작은 화면에서도 끝까지 읽을 수 있는 프로젝트 제목'];
  const names=tab==='layout'&&values.longText?longNames:normalNames;
  doc.querySelectorAll?.('.card h3').forEach((node,index)=>{node.textContent=names[index]||normalNames[0];});
  if(tab==='geometry')applyPublishingGeometryStyles(doc,values.geometry||geometryValues);
  if(tab==='effects')applyPublishingEffectsStyles(doc,values.effects||effectsValues);
  return true;
}

export function initResizeLab(root,hooks={}){
  const lab=root.matches?.('[data-resize-lab]')?root:root.querySelector('[data-resize-lab]');
  if(!lab)return ()=>{};
  const tab=lab.dataset.rlTab,frame=lab.querySelector('[data-rl-frame]'),stage=lab.querySelector('[data-rl-stage]');
  const controller=new AbortController(),signal=controller.signal;
  let observer,frameObserver,themeObserver,raf=0,disposed=false,qa=getQA();
  const publishingTargetId=tab==='geometry'?'geometry-card':tab==='effects'?'effects-card':'';
  const publishingDefaults=()=>tab==='geometry'?geometryDefaults:effectsFixtureDefaultValues[effectsValues.fixture];
  const effectsSessions=tab==='effects'?new Map(EFFECT_FIXTURES.map(({id})=>[id,createPublishingSession(`lab:effects:${id}`)])):null;
  let publishingSession=tab==='geometry'?createPublishingSession('lab:geometry:session'):effectsSessions?.get(effectsValues.fixture)||null;
  let publishingGuide=null,publishingGesture=false,publishingActiveControl=null,publishingPreviousValues=null,fixedPreviewScale=null,effectsCompare=true;
  const find=selector=>lab.querySelector(selector);
  function setLabDrawer(open,{focus=true,persist=true}={}){
    const drawer=find('[data-rl-customize-drawer]'),trigger=find('[data-rl-action="toggle-lab-drawer"]');
    if(!drawer||!trigger)return;
    drawer.hidden=!open;trigger.setAttribute('aria-expanded',String(open));
    if(open){lab.dataset.rlDrawerOpen='true';if(focus)drawer.querySelector('[data-rl-control]:not([disabled]),[data-rl-check],[data-rl-scenario]')?.focus({preventScroll:true});}
    else{delete lab.dataset.rlDrawerOpen;if(focus)trigger.focus({preventScroll:true});}
    if(persist){try{sessionStorage.setItem('klic.resize-lab.drawer-open',String(open));}catch{}}
  }
  const drawerResizeHandle=find('[data-rl-drawer-resize]');
  const drawerWidthKey='klic.resize-lab.drawer-width',drawerHeightKey='klic.resize-lab.drawer-height';
  let drawerWidth=0,drawerHeight=0,activeResizeMode='',activeResizePointer=null;
  function narrowDrawerLayout(){return globalThis.matchMedia?.('(max-width: 1100px)').matches??((globalThis.innerWidth||0)<=1100);}
  function drawerResizeMode(){return narrowDrawerLayout()?'height':'width';}
  function drawerResizeBounds(mode){
    const viewportWidth=Number(globalThis.innerWidth)||1280,viewportHeight=Number(globalThis.innerHeight)||900;
    if(mode==='width')return {min:320,max:Math.max(320,Math.min(760,Math.floor(viewportWidth*.52),Math.floor(viewportWidth-520)))};
    return {min:220,max:Math.max(220,Math.floor(viewportHeight*.84))};
  }
  function clampDrawerResize(value,mode){const {min,max}=drawerResizeBounds(mode);return Math.max(min,Math.min(max,Math.round(Number(value)||min)));}
  function syncDrawerResizeHandle(mode=drawerResizeMode()){
    if(!drawerResizeHandle)return;
    const {min,max}=drawerResizeBounds(mode),value=mode==='width'?drawerWidth:drawerHeight;
    drawerResizeHandle.dataset.resizeMode=mode;
    drawerResizeHandle.setAttribute('aria-orientation',mode==='width'?'vertical':'horizontal');
    drawerResizeHandle.setAttribute('aria-valuemin',String(min));
    drawerResizeHandle.setAttribute('aria-valuemax',String(max));
    drawerResizeHandle.setAttribute('aria-valuenow',String(value));
    drawerResizeHandle.setAttribute('aria-valuetext',value+'px');
  }
  function applyDrawerResize(value,mode,{persist=true}={}){
    const next=clampDrawerResize(value,mode),key=mode==='width'?drawerWidthKey:drawerHeightKey;
    if(mode==='width'){drawerWidth=next;lab.style.setProperty('--rl-lab-drawer-width',next+'px');}
    else{drawerHeight=next;lab.style.setProperty('--rl-lab-drawer-height',next+'px');}
    syncDrawerResizeHandle(mode);
    if(persist){try{sessionStorage.setItem(key,String(next));}catch{}}
    return next;
  }
  function storedDrawerResize(key,mode){
    const viewportWidth=Number(globalThis.innerWidth)||1280,viewportHeight=Number(globalThis.innerHeight)||900;
    const fallback=mode==='width'?Math.min(460,Math.round(viewportWidth*.32)):Math.round(viewportHeight*.68);
    let stored=NaN;try{stored=Number(sessionStorage.getItem(key));}catch{}
    return clampDrawerResize(Number.isFinite(stored)&&stored>0?stored:fallback,mode);
  }
  drawerWidth=storedDrawerResize(drawerWidthKey,'width');
  drawerHeight=storedDrawerResize(drawerHeightKey,'height');
  applyDrawerResize(drawerWidth,'width',{persist:false});
  applyDrawerResize(drawerHeight,'height',{persist:false});
  syncDrawerResizeHandle();
  drawerResizeHandle?.addEventListener('pointerdown',event=>{
    if(find('[data-rl-customize-drawer]')?.hidden)return;
    event.preventDefault();activeResizeMode=drawerResizeMode();activeResizePointer=event.pointerId;
    drawerResizeHandle.dataset.dragging='true';
    try{drawerResizeHandle.setPointerCapture(event.pointerId);}catch{}
  },{signal});
  drawerResizeHandle?.addEventListener('pointermove',event=>{
    if(activeResizePointer!==event.pointerId)return;
    const viewportWidth=Number(globalThis.innerWidth)||1280,viewportHeight=Number(globalThis.innerHeight)||900;
    applyDrawerResize(activeResizeMode==='width'?viewportWidth-event.clientX-12:viewportHeight-event.clientY,activeResizeMode,{persist:false});
  },{signal});
  const finishDrawerResize=event=>{
    if(activeResizePointer!==event.pointerId)return;
    const mode=activeResizeMode;activeResizePointer=null;activeResizeMode='';delete drawerResizeHandle.dataset.dragging;
    applyDrawerResize(mode==='width'?drawerWidth:drawerHeight,mode);
    try{if(drawerResizeHandle.hasPointerCapture(event.pointerId))drawerResizeHandle.releasePointerCapture(event.pointerId);}catch{}
  };
  drawerResizeHandle?.addEventListener('pointerup',finishDrawerResize,{signal});
  drawerResizeHandle?.addEventListener('pointercancel',finishDrawerResize,{signal});
  drawerResizeHandle?.addEventListener('lostpointercapture',finishDrawerResize,{signal});
  drawerResizeHandle?.addEventListener('keydown',event=>{
    if(find('[data-rl-customize-drawer]')?.hidden)return;
    const mode=drawerResizeMode(),{min,max}=drawerResizeBounds(mode),current=mode==='width'?drawerWidth:drawerHeight,step=event.shiftKey?64:16;
    let next=null;
    if(event.key==='Home')next=min;else if(event.key==='End')next=max;
    else if(mode==='width'&&event.key==='ArrowLeft')next=current+step;
    else if(mode==='width'&&event.key==='ArrowRight')next=current-step;
    else if(mode==='height'&&event.key==='ArrowUp')next=current+step;
    else if(mode==='height'&&event.key==='ArrowDown')next=current-step;
    if(next===null)return;
    event.preventDefault();applyDrawerResize(next,mode);
  },{signal});
  globalThis.addEventListener?.('resize',()=>{
    applyDrawerResize(drawerWidth,'width',{persist:false});
    applyDrawerResize(drawerHeight,'height',{persist:false});
    syncDrawerResizeHandle();
  },{signal});
  const write=(selector,value)=>{const node=find(selector);if(node)node.textContent=value;};
  function announce(message){hooks.notify?.(message);}
  function currentPublishingValues(){return tab==='geometry'?geometryValues:effectsValues;}
  function setCurrentPublishingValues(values){if(tab==='geometry')geometryValues=values;else{effectsFixtureValues=updateEffectsFixtureState(effectsFixtureValues,values.fixture,{...values});effectsValues={...effectsFixtureValues[values.fixture]};}}
  function switchEffectsFixture(fixture){
    if(tab!=='effects'||!effectsSessions?.has(fixture)||fixture===effectsValues.fixture)return;
    finishPublishingGesture();
    const previousValues={...effectsValues};
    effectsValues={...effectsFixtureValues[fixture]};
    publishingSession=effectsSessions.get(fixture);
    publishingActiveControl='fixture';
    publishingPreviousValues=previousValues;
    if(frame?.contentDocument)applyPublishingStyles(frame.contentDocument);
    updateControls();
    updatePublishingGuide({activeControl:'fixture',announce:true,previousValues});
  }
  function applyPublishingStyles(doc,values=currentPublishingValues()){
    return tab==='geometry'?applyPublishingGeometryStyles(doc,values):tab==='effects'?applyPublishingEffectsStyles(doc,values):false;
  }
  function publishingMeasurements(){
    const doc=frame?.contentDocument,win=frame?.contentWindow,selector=getPublishingTarget(publishingTargetId)?.selector,element=selector&&doc?.querySelector(selector);
    if(!element||!win)return {};
    const rect=element.getBoundingClientRect(),style=win.getComputedStyle(element),px=value=>Math.max(0,parseFloat(value)||0);
    const borderTopWidth=px(style.borderTopWidth),borderRightWidth=px(style.borderRightWidth),borderBottomWidth=px(style.borderBottomWidth),borderLeftWidth=px(style.borderLeftWidth),paddingTop=px(style.paddingTop),paddingRight=px(style.paddingRight),paddingBottom=px(style.paddingBottom),paddingLeft=px(style.paddingLeft);
    const result={outerWidth:rect.width,outerHeight:rect.height,contentWidth:Math.max(0,rect.width-borderLeftWidth-borderRightWidth-paddingLeft-paddingRight),contentHeight:Math.max(0,rect.height-borderTopWidth-borderBottomWidth-paddingTop-paddingBottom),borderRadius:px(style.borderTopLeftRadius),borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth,paddingTop,paddingRight,paddingBottom,paddingLeft,scrollWidth:element.scrollWidth,scrollHeight:element.scrollHeight,clientWidth:element.clientWidth,clientHeight:element.clientHeight};
    if(tab==='effects'){const hit=element.querySelector('[data-publishing-part="hit-area"]'),pill=element.querySelector('.effects-pill'),one=element.querySelector('.effects-margin-one'),two=element.querySelector('.effects-margin-two'),text=element.querySelector('[data-publishing-part="text"]');if(hit){const hitRect=hit.getBoundingClientRect();result.hitAreaWidth=hitRect.width;result.hitAreaHeight=hitRect.height;}if(pill){const pillRect=pill.getBoundingClientRect();result.pillWidth=pillRect.width;result.pillHeight=pillRect.height;result.pillRadius=px(win.getComputedStyle(pill).borderTopLeftRadius);}if(one&&two){result.marginBottom=px(win.getComputedStyle(one).marginBottom);result.marginTop=px(win.getComputedStyle(two).marginTop);result.marginGap=Math.max(0,two.getBoundingClientRect().top-one.getBoundingClientRect().bottom);}if(text)result.lineHeightPx=px(win.getComputedStyle(text).lineHeight);}
    return result;
  }
  function publishingSnapshot(targetId=publishingTargetId){
    const snapshot=publishingSession?.snapshot(targetId);
    if(!snapshot)return null;
    return {...snapshot,values:{...publishingDefaults(),...currentPublishingValues()},measurements:publishingMeasurements()};
  }
  function updatePublishingGuide({activeControl=publishingActiveControl,announce:shouldAnnounce=false,previousValues=publishingPreviousValues}={}){
    return publishingGuide?.update({activeControl,announce:shouldAnnounce,...(previousValues?{previousValues}:{})});
  }
  function beginPublishingGesture(){if(!publishingSession||publishingGesture)return;publishingSession.beginGesture(publishingTargetId);publishingGesture=true;}
  function finishPublishingGesture(){if(!publishingSession||!publishingGesture)return;publishingSession.finishGesture(publishingTargetId);publishingGesture=false;updatePublishingGuide({announce:true,previousValues:publishingPreviousValues});}
  function applyPublishingPatch(patch,activeControl,previousValues=currentPublishingValues()){
    if(!publishingSession)return;
    if(!publishingGesture)beginPublishingGesture();
    const revision=publishingSession.snapshot(publishingTargetId).revision;
    const snapshot=publishingSession.apply(publishingTargetId,patch,revision);
    setCurrentPublishingValues({...currentPublishingValues(),...snapshot.values});
    publishingActiveControl=activeControl;
    publishingPreviousValues={...previousValues};
    if(frame?.contentDocument)applyPublishingStyles(frame.contentDocument);
    updateControls();
    updatePublishingGuide({activeControl,announce:true,previousValues});
  }
  function restorePublishingValues(snapshot){setCurrentPublishingValues({...publishingDefaults(),...snapshot.values});publishingActiveControl=null;publishingPreviousValues=null;if(frame?.contentDocument)applyPublishingStyles(frame.contentDocument);updateControls();updatePublishingGuide({announce:true,previousValues:null});}
  function syncFrameTheme(){
    const boundary=frame?.contentDocument?.documentElement;
    if(disposed||!boundary)return;
    const theme=frameTheme(frameAppearance(lab.ownerDocument),lab);
    // Transfer only colors: the iframe owns its viewport, rem scale and interaction state.
    for(const [name,value] of Object.entries(theme.variables))boundary.style.setProperty(name,value);
    boundary.dataset.theme=theme.mode;
    boundary.style.colorScheme=theme.mode;
  }
  function measure(){
    if(disposed||!frame?.contentDocument?.querySelector('.cards'))return;
    const doc=frame.contentDocument,win=frame.contentWindow,style=node=>win.getComputedStyle(node);
    const columns=style(doc.querySelector('.cards')).gridTemplateColumns.split(' ').length;
    write('[data-rl-metric="viewport"]',`${win.innerWidth} × ${win.innerHeight}px`);
    if(tab==='typography'){
      const values=['[data-sample-title]','[data-sample-body]','#sample-project'].map(selector=>`${round(parseFloat(style(doc.querySelector(selector)).fontSize))}px`);
      write('[data-rl-metric="primary"]',values.join(' / '));
      write('[data-rl-metric="secondary"]',`${Math.round(settings.basis==='container'?doc.querySelector('.content').getBoundingClientRect().width:win.innerWidth)}px · ${settings.basis==='container'?'container':'viewport'}`);
    }else if(tab==='layout'){
      write('[data-rl-metric="primary"]',`${columns}열 / ${settings.gap}px`);
      write('[data-rl-metric="secondary"]',`${Math.round(doc.querySelector('.content').getBoundingClientRect().width)}px`);
    }else if(tab==='geometry'){
      const values=publishingMeasurements();
      write('[data-rl-metric="primary"]',`${round(parseFloat(style(doc.querySelector('[data-klic-publishing-target="geometry-card"]')).borderTopLeftRadius))}px radius / ${geometryValues.padding}px padding`);
      write('[data-rl-metric="secondary"]',`${round(values.outerWidth||0)} × ${round(values.outerHeight||0)}px · 실제 target`);
    }else if(tab==='effects'){
      const values=publishingMeasurements();
      write('[data-rl-metric="primary"]',`${effectsValues.layout} · ${effectsValues.borderStyle} · ${effectsValues.rowGap}/${effectsValues.columnGap}px gap`);
      write('[data-rl-metric="secondary"]',`${round(values.outerWidth||0)} × ${round(values.outerHeight||0)}px · hit ${round(values.hitAreaWidth||0)} × ${round(values.hitAreaHeight||0)}px`);
    }else{
      write('[data-rl-metric="primary"]',`${getBreakpoint(win.innerWidth).id.toUpperCase()} / ${columns}열`);
      write('[data-rl-metric="secondary"]',win.innerWidth<768?'접힌 탐색':win.innerWidth<1024?'펼친 탐색':'펼친 탐색 + 보조 패널');
    }
  }
  function resize(){
    if(!frame||!stage||disposed)return;
    const fitScaleValue=automaticPreviewScale();
    if(previewResizeMode==='fixed'&&fixedPreviewScale===null)fixedPreviewScale=fitScaleValue;
    const scale=previewResizeMode==='fixed'?fixedPreviewScale:fitScaleValue;
    frame.style.width=`${settings.width}px`;frame.style.height=`${settings.height}px`;frame.style.transform=`scale(${scale})`;
    const holder=find('[data-rl-holder]');holder.style.width=`${settings.width*scale}px`;holder.style.height=`${settings.height*scale}px`;
    if(tab==='typography'){
      const doc=frame.contentDocument,title=doc?.querySelector?.('[data-sample-title]'),content=doc?.querySelector?.('.content');
      if(title?.style){const basis=settings.basis==='container'?(content?.getBoundingClientRect?.().width||settings.width):settings.width;title.style.fontSize=`${fluidFontSize(basis,settings)}px`;}
    }
    cancelAnimationFrame(raf);raf=requestAnimationFrame(measure);
  }
  function automaticPreviewScale(){
    const availableWidth=Math.max(120,stage?.clientWidth||120),stageTop=Math.max(0,stage?.getBoundingClientRect?.().top||0),drawer=find('[data-rl-customize-drawer]');
    const drawerHeight=narrowDrawerLayout()&&drawer&&!drawer.hidden?drawer.getBoundingClientRect().height:0;
    const availableHeight=Math.max(120,(Number(globalThis.innerHeight)||900)-stageTop-drawerHeight-12);
    const widthScale=settings.fit?Math.min(1,availableWidth/settings.width):1;
    const heightScale=settings.fit?Math.min(1,availableHeight/settings.height):1;
    return Math.min(widthScale,heightScale)*settings.fitPercent/100;
  }
  function refreshFixedPreviewScale(){if(previewResizeMode==='fixed'&&stage)fixedPreviewScale=automaticPreviewScale();}
  function setPreviewResizeMode(mode){
    previewResizeMode=mode==='fit'?'fit':'fixed';
    lab.dataset.rlPreviewSizing=previewResizeMode;
    lab.querySelectorAll('[data-rl-preview-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.rlPreviewMode===previewResizeMode)));
    if(previewResizeMode==='fixed'){void stage?.offsetWidth;refreshFixedPreviewScale();}else fixedPreviewScale=null;
    try{sessionStorage.setItem(previewResizeModeKey,previewResizeMode);}catch{}
    resize();
    announce(previewResizeMode==='fixed'?'드로어를 조절해도 본문 크기를 고정합니다.':'드로어 폭에 맞춰 본문을 함께 조절합니다.');
  }
  function updateControls(){
    lab.querySelectorAll('[data-rl-control]').forEach(input=>{const key=input.dataset.rlControl,valueKey=publishingControlValues[key],value=key==='effectsCompare'?effectsCompare:valueKey?currentPublishingValues()[valueKey]:settings[key];if(key==='effectsBackdropBlur')input.disabled=effectsValues.fixture!=='glass-dialog';if(input.type==='checkbox')input.checked=value;else if(lab.ownerDocument.activeElement!==input)input.value=value;});
    lab.querySelectorAll('[data-rl-value]').forEach(output=>{const key=output.dataset.rlValue,valueKey=publishingControlValues[key],value=valueKey?currentPublishingValues()[valueKey]:settings[key],unit=key==='fitPercent'||key==='textScale'||key.includes('LineHeight')||key.includes('SurfaceAlpha')?'%':key.includes('Rotate')?'deg':key.includes('TransitionDuration')?'ms':key.includes('LetterSpacing')?'단계':key==='columns'?'열':'px';output.textContent=value+unit;});
    lab.querySelectorAll('[data-rl-preset]').forEach(button=>{const device=devices.find(([id])=>id===button.dataset.rlPreset);button.setAttribute('aria-pressed',String(settings.width===device[2]&&settings.height===device[3]));});
    const savedScreens=getSavedScreens();lab.querySelectorAll('[data-rl-load-screen]').forEach(button=>{const screen=savedScreens[Number(button.dataset.rlLoadScreen)];button.setAttribute('aria-pressed',String(Boolean(screen&&settings.width===screen.width&&settings.height===screen.height)));});
    lab.querySelectorAll('[data-rl-bp]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.rlBp===getBreakpoint(settings.width).id)));
    write('[data-rl-breakpoint]',`현재 ${getBreakpoint(settings.width).id.toUpperCase()} · ${settings.width}px`);
    write('[data-rl-formula]',buildFluidRule(settings,settings.basis==='container'?'cqi':'vw'));
    resize();
    if(publishingGuide)updatePublishingGuide();
  }
  function applySettingsToFrame(){if(frame?.contentDocument)applyResizeLabFrameStyles(frame.contentDocument,tab,{...settings,geometry:geometryValues,effects:effectsValues},settings.width);}
  function wireFrame(){
    if(disposed)return;
    const doc=frame.contentDocument;if(!doc?.querySelector('.cards'))return;
    syncFrameTheme();
    if(tab==='effects'){applyPublishingEffectsStyles(doc,effectsValues);setEffectsComparisonVisibility(doc,effectsCompare);}
    doc.addEventListener('click',event=>{
      const menu=event.target.closest('[data-sample-menu]');
      if(menu){const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'샘플 탐색 메뉴 닫기':'샘플 탐색 메뉴 열기');doc.querySelector('.mobile-nav').hidden=!open;}
      const detail=event.target.closest('[data-sample-detail]');
      if(detail){doc.querySelector('#sample-dialog-title').textContent=detail.dataset.sampleDetail;doc.querySelector('dialog').showModal();}
      if(event.target.closest('[data-sample-close]'))doc.querySelector('dialog').close();
      const anchor=event.target.closest('a');if(anchor){event.preventDefault();const target=doc.querySelector(anchor.getAttribute('href')==='#'?'header':anchor.getAttribute('href'));if(target?.id==='activity')target.style.display='block';doc.querySelector('.mobile-nav').hidden=true;doc.querySelector('[data-sample-menu]').setAttribute('aria-expanded','false');target?.scrollIntoView({behavior:'instant',block:'start'});}
    },{signal});
    doc.querySelector('[data-sample-form]').addEventListener('submit',event=>{event.preventDefault();const value=doc.querySelector('#sample-project').value.trim(),feedback=doc.querySelector('[data-sample-feedback]');if(!value)return;feedback.hidden=false;feedback.textContent=`✓ “${value}” 프로젝트 만들기를 확인했어요. (샘플)`;},{signal});
    frameObserver?.disconnect();frameObserver=new ResizeObserver(measure);frameObserver.observe(doc.querySelector('.content'));resize();if(publishingGuide)updatePublishingGuide({announce:false});
  }
  function handleControl(event){
    const input=event.target.closest('[data-rl-control]');if(!input)return;
    const key=input.dataset.rlControl;
    if(['number','checkbox','select-one'].includes(input.type)&&event.type!=='change')return;
    if(input.type!=='number'&&event.type==='change'&&!['checkbox','select-one'].includes(input.type))return;
    if(tab==='effects'&&key==='effectsFixture'){switchEffectsFixture(input.value);return;}
    if(tab==='effects'&&key==='effectsFixture'){switchEffectsFixture(input.value);return;}
    if(tab==='effects'&&key==='effectsCompare'){
      effectsCompare=input.checked;
      setEffectsComparisonVisibility(frame?.contentDocument,effectsCompare);
      updateControls();
      return;
    }
    const publishingKey=publishingControlValues[key];
    if(publishingKey){
      const previousValues={...currentPublishingValues()};
      let value;
      if(input.type==='checkbox')value=input.checked;
      else if(input.type==='select-one')value=input.value;
      else{if(!Number.isFinite(Number(input.value))||input.value===''){input.value=currentPublishingValues()[publishingKey];return;}value=clamp(input.value,Number(input.min),Number(input.max));}
      applyPublishingPatch({[publishingKey]:value},publishingKey,previousValues);
      return;
    }
    if(input.type==='checkbox')settings[key]=input.checked;
    else if(key==='title')settings.title=input.value;
    else if(key==='font'||key==='headingFont')settings[key]=FONT_IDS.includes(input.value)?input.value:'pretendard';
    else if(key==='basis')settings.basis=input.value==='viewport'?'viewport':'container';
    else{if(!Number.isFinite(Number(input.value))||input.value===''){input.value=settings[key];return;}settings[key]=clamp(input.value,Number(input.min),Number(input.max));}
    if(key==='min')settings.max=Math.max(settings.max,settings.min+1);
    if(key==='max')settings.min=Math.min(settings.min,settings.max-1);
    if(key==='from')settings.to=Math.max(settings.to,settings.from+1);
    if(key==='to')settings.from=Math.min(settings.from,settings.to-1);
    if(['width','height','fit','fitPercent'].includes(key))refreshFixedPreviewScale();
    updateControls();
    applySettingsToFrame();
  }
  function persistQA(){const saved=saveQA(qa);write('[data-rl-qa-count]',`${checkItems.filter(([id])=>qa.checked[id]).length} / ${checkItems.length} 확인`);write('[data-rl-save-status]',saved?'체크리스트와 메모를 이 브라우저에 저장했어요.':'현재 세션에 기록했어요. 브라우저 저장소를 사용할 수 없습니다.');}
  lab.addEventListener('input',event=>{if(publishingControlValues[event.target?.dataset?.rlControl])beginPublishingGesture();handleControl(event);if(event.target.matches('[data-rl-notes]')){qa.notes=event.target.value;persistQA();}},{signal});
  lab.addEventListener('change',event=>{const isPublishing=Boolean(publishingControlValues[event.target?.dataset?.rlControl]);if(isPublishing)beginPublishingGesture();handleControl(event);if(isPublishing)finishPublishingGesture();if(event.target.matches('[data-rl-check]')){qa.checked[event.target.dataset.rlCheck]=event.target.checked;persistQA();}},{signal});
  lab.addEventListener('pointerdown',event=>{if(publishingControlValues[event.target?.dataset?.rlControl])beginPublishingGesture();},{signal});
  lab.ownerDocument.addEventListener('pointerup',finishPublishingGesture,{signal,capture:true});
  lab.ownerDocument.addEventListener('pointercancel',finishPublishingGesture,{signal,capture:true});
  lab.addEventListener('keydown',event=>{if(publishingControlValues[event.target?.dataset?.rlControl]&&event.target.type==='range'&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(event.key))beginPublishingGesture();},{signal});
  lab.ownerDocument.addEventListener('keyup',event=>{if(publishingControlValues[event.target?.dataset?.rlControl])finishPublishingGesture();},{signal,capture:true});
  lab.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!find('[data-rl-customize-drawer]')?.hidden){event.preventDefault();setLabDrawer(false);return;}
    const current=event.target.closest('[role="tab"]');if(!current||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();const tabs=[...lab.querySelectorAll('[role="tab"]')],index=tabs.indexOf(current),next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
    pendingTabFocus=true;tabs[next].click();
  },{signal});
  lab.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.rlPreviewMode){setPreviewResizeMode(button.dataset.rlPreviewMode);return;}
    if(button.dataset.rlAction==='save-screen'){
      const screens=getSavedScreens(),current={width:settings.width,height:settings.height,fit:settings.fit,fitPercent:settings.fitPercent};
      const existing=screens.findIndex(screen=>screen.width===current.width&&screen.height===current.height),replaced=existing<0&&screens.length>=maxSavedScreens;
      const next=[current,...screens.filter((_,index)=>index!==existing)].slice(0,maxSavedScreens);
      const saved=saveSavedScreens(next);
      if(saved){find('[data-rl-saved-screen-list]').innerHTML=savedScreensListMarkup();write('[data-rl-screen-status]',replaced?'최대 저장 개수에 도달해 가장 오래된 화면을 대체했어요.':'현재 화면 크기와 맞춤 배율을 저장했어요.');updateControls();announce(replaced?'가장 오래된 저장 화면을 대체했어요.':'현재 화면을 저장했어요.');}
      else{write('[data-rl-screen-status]','브라우저 저장소를 사용할 수 없어 현재 화면을 저장하지 못했어요.');announce('화면을 저장하지 못했어요.');}
      return;
    }
    if(button.dataset.rlLoadScreen!==undefined){
      const screen=getSavedScreens()[Number(button.dataset.rlLoadScreen)];if(!screen)return;
      settings={...settings,width:screen.width,height:screen.height,fit:screen.fit,fitPercent:screen.fitPercent};refreshFixedPreviewScale();updateControls();applySettingsToFrame();write('[data-rl-screen-status]',`${screen.width} × ${screen.height} 화면을 불러왔어요.`);announce(`${screen.width} × ${screen.height} 화면을 불러왔어요.`);return;
    }
    if(button.dataset.rlDeleteScreen!==undefined){
      const index=Number(button.dataset.rlDeleteScreen),screens=getSavedScreens();if(!Number.isInteger(index)||index<0||index>=screens.length)return;
      screens.splice(index,1);if(saveSavedScreens(screens)){find('[data-rl-saved-screen-list]').innerHTML=savedScreensListMarkup();write('[data-rl-screen-status]','저장 화면을 삭제했어요.');find('[data-rl-action="save-screen"]')?.focus();announce('저장 화면을 삭제했어요.');}else{write('[data-rl-screen-status]','브라우저 저장소를 사용할 수 없어 삭제하지 못했어요.');announce('저장 화면을 삭제하지 못했어요.');}return;
    }
    if(button.dataset.rlPreset){const [, ,width,height]=devices.find(([id])=>id===button.dataset.rlPreset);settings.width=width;settings.height=height;refreshFixedPreviewScale();updateControls();}
    if(button.dataset.rlWidth){settings.width=Number(button.dataset.rlWidth);refreshFixedPreviewScale();updateControls();applySettingsToFrame();}
    if(button.dataset.rlScenario){const scenario=button.dataset.rlScenario;if(scenario==='mobile'){settings.width=320;settings.height=568;}if(scenario==='boundary'){settings.width=767;settings.height=800;}if(scenario==='text'){settings.width=768;settings.height=900;settings.textScale=200;}preserveNextViewport=true;location.hash=`lab/${{mobile:'viewport',boundary:'breakpoints',text:'typography'}[scenario]}`;}
    if(button.dataset.rlAction==='toggle-lab-drawer'){setLabDrawer(true);return;}
    if(button.dataset.rlAction==='close-lab-drawer'){setLabDrawer(false);return;}
    if(button.dataset.rlAction==='rotate'){[settings.width,settings.height]=[settings.height,settings.width];refreshFixedPreviewScale();updateControls();applySettingsToFrame();}
    if(button.dataset.rlAction==='reset-effects'&&publishingSession){const revision=publishingSession.snapshot(publishingTargetId).revision;restorePublishingValues(publishingSession.clear(publishingTargetId,revision));announce('표면·효과 실험만 초기화했어요.');}
    if(button.dataset.rlAction==='copy-effects-css'&&publishingSession){try{hooks.copy?.(exportPublishingEffectsCSS(currentPublishingValues()),'현재 target의 표면·효과 CSS를 복사했어요.');}catch{announce('CSS를 만들지 못했습니다.');}}
    if(button.dataset.rlAction==='copy-css'){if(hooks.copy)hooks.copy(buildTypographyCSS(settings),'타이포그래피 CSS를 복사했어요.');}
    if(button.dataset.rlAction==='reset-qa'){qa={checked:{},notes:''};lab.querySelectorAll('[data-rl-check]').forEach(input=>input.checked=false);find('[data-rl-notes]').value='';persistQA();announce('검수 기록을 초기화했어요.');}
    if(button.dataset.rlAction==='copy-report'){
      const report=`KLIC 리사이즈 실험실 · 수동 검수 기록\n${new Date().toLocaleString('ko-KR')}\n\n${checkItems.map(([id,title])=>`${qa.checked[id]?'[확인]':'[미확인]'} ${title}`).join('\n')}\n\n메모\n${qa.notes||'기록 없음'}\n\n최근 실험: ${settings.width} × ${settings.height}px / 텍스트 ${settings.textScale}%\n자동 접근성 적합성 판정이 아닌 수동 검수 기록입니다.`;
      if(hooks.copy)hooks.copy(report,'검수 기록을 복사했어요.');
    }
  },{signal});
  if(publishingSession){
    const host=find('[data-publishing-guide-host]');
    publishingGuide=mountPublishingGuide(host,{
      compact:true,
      getSnapshot:targetId=>publishingSnapshot(targetId||publishingTargetId),
      getTargetElement:targetId=>{const selector=getPublishingTarget(targetId||publishingTargetId)?.selector;return selector?frame?.contentDocument?.querySelector(selector)||null:null;},
      targetIds:()=>[publishingTargetId],
      onUndo:(targetId,revision)=>restorePublishingValues(publishingSession.undo(targetId,revision)),
      onClear:(targetId,revision)=>restorePublishingValues(publishingSession.clear(targetId,revision)),
      onApply:(action)=>{if(action==='disable-optical-floor'){applyPublishingPatch({useOpticalFloor:false},'useOpticalFloor');finishPublishingGesture();}},
    });
  }
  if(frame){
    frame.addEventListener('load',wireFrame,{signal});observer=new ResizeObserver(resize);observer.observe(stage);observer.observe(find('[data-rl-customize-drawer]'));
    const parentDocument=lab.ownerDocument;
    themeObserver=new MutationObserver(syncFrameTheme);
    themeObserver.observe(parentDocument.documentElement,{attributes:true,attributeFilter:['data-theme','data-color-theme','data-brand-profile','data-brand','data-material','style']});
    // applyTheme() replaces the resolved stylesheet when palette or neutral preferences change.
    if(parentDocument.head)themeObserver.observe(parentDocument.head,{childList:true,subtree:true,characterData:true});
    if(frame.contentDocument?.readyState==='complete')wireFrame();updateControls();
  }
  let savedDrawerState=null;
  try{savedDrawerState=sessionStorage.getItem('klic.resize-lab.drawer-open');}catch{}
  setLabDrawer(savedDrawerState==='true'||(savedDrawerState===null&&(globalThis.innerWidth||0)>1100),{focus:false,persist:savedDrawerState===null});
  if(pendingTabFocus){find('[role="tab"][aria-selected="true"]')?.focus();pendingTabFocus=false;}
  return ()=>{disposed=true;controller.abort();observer?.disconnect();frameObserver?.disconnect();themeObserver?.disconnect();publishingGuide?.destroy();cancelAnimationFrame(raf);const nextRoute=(location.hash.slice(1)||'home').split('/');if(nextRoute[0]!=='lab')leftLabRoute=true;};
}
