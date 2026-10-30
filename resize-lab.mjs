import {createTokens,resolveTokens,formatValue} from './tokens.mjs';
import {readPreferences,resolveTheme} from './preferences.mjs';

const escapeHTML=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const clamp=(value,min,max)=>Math.min(max,Math.max(min,Number(value)));
const round=value=>Number(value.toFixed(3));
const storageKey='klic-resize-lab-checklist-v1';
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
  {id:'viewport',label:'뷰포트',description:'실제 화면 폭과 높이로 탐색·카드·입력을 확인합니다.'},
  {id:'breakpoints',label:'브레이크포인트',description:'경계의 바로 전과 후를 비교하며 레이아웃이 바뀌는 순간을 찾습니다.'},
  {id:'typography',label:'타이포그래피',description:'제목의 유동 크기와 본문·입력의 변화를 수치로 확인합니다.'},
  {id:'layout',label:'레이아웃',description:'컨테이너, 그리드, 여백을 함께 조정해 콘텐츠 밀도를 살펴봅니다.'},
  {id:'qa',label:'검수 체크리스트',description:'좁은 화면부터 긴 문구까지 직접 확인하고 결과를 기록합니다.'}
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
let settings={width:1280,height:800,fit:true,textScale:100,min:24,max:40,from:480,to:1440,basis:'container',container:100,columns:3,gap:20,padding:32,maxWidth:1120,autoGrid:true,title:'팀의 다음 가능성을 만드는 공간',longText:false};
let pendingTabFocus=false;

export function getBreakpoint(width){return {...[...breakpoints].reverse().find(point=>Number(width)>=point.min)||breakpoints[0]};}
export function fluidFontSize(width,{min,max,from,to,rootSize=16}){
  const slope=(max-min)/Math.max(1,to-from);
  return round(clamp((min-slope*from)*rootSize/16+slope*width,min*rootSize/16,max*rootSize/16));
}
export function buildFluidRule({min,max,from,to},unit='vw'){
  const slope=(max-min)/Math.max(1,to-from),intercept=(min-slope*from)/16;
  return `clamp(${round(min/16)}rem, calc(${round(intercept)}rem + ${round(slope*100)}${unit==='cqi'?'cqi':'vw'}), ${round(max/16)}rem)`;
}
function getQA(){try{const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');return {checked:saved.checked&&typeof saved.checked==='object'?saved.checked:{},notes:typeof saved.notes==='string'?saved.notes:''};}catch{return {checked:{},notes:''};}}
function saveQA(value){try{localStorage.setItem(storageKey,JSON.stringify(value));return true;}catch{return false;}}
function range(name,label,value,min,max,unit='px',step=1){return `<label class="rl-field"><span>${label}<output data-rl-value="${name}">${value}${unit}</output></span><input type="range" data-rl-control="${name}" aria-label="${label}" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;}
function numberField(name,label,value,min,max){return `<label class="rl-number"><span>${label}</span><div><input type="number" data-rl-control="${name}" value="${value}" min="${min}" max="${max}" step="1"><span>px</span></div></label>`;}
function activeTab(parts){const slug=parts[0]==='lab'?parts[1]:parts[0];return RESIZE_LAB_TABS.find(tab=>tab.id===slug)||RESIZE_LAB_TABS[0];}
function dimensions(){return `<section class="rl-controls" aria-label="실험 화면 크기"><div class="rl-device-row"><div class="rl-preset-group" aria-label="기기 크기 프리셋">${devices.map(([id,label,width,height])=>`<button class="rl-device" data-rl-preset="${id}" aria-pressed="${settings.width===width&&settings.height===height}"><span>${label}</span><small>${width} × ${height}</small></button>`).join('')}</div><button class="rl-button" data-rl-action="rotate" aria-label="실험 화면 가로 세로 회전">↻ 회전</button></div><div class="rl-dimensions">${range('width','너비',settings.width,320,1920)}${range('height','높이',settings.height,320,1920)}<label class="rl-check"><input type="checkbox" data-rl-control="fit" ${settings.fit?'checked':''}>화면에 맞춰 보기</label></div></section>`;}
function viewportTools(){return `<div class="rl-section-intro"><div><h2>하나의 화면, 여러 크기</h2><p>프리셋은 CSS 픽셀 기준의 실험 크기입니다. 프레임 안의 메뉴와 폼도 직접 사용할 수 있어요.</p></div><span class="rl-pill">실제 iframe 뷰포트</span></div>${dimensions()}<div class="rl-guidance"><span>관찰 포인트</span><p>768px에서 탐색이 펼쳐지고, 1024px에서 보조 패널이 나타납니다. 카드 열 수는 화면 폭에 따라 달라집니다.</p></div>`;}
function breakpointTools(){return `<div class="rl-section-intro"><div><h2>레이아웃이 바뀌는 정확한 순간</h2><p>임계값 −1px / 기준 / +1px를 눌러 경계 전후를 확인하세요. 이 탭은 실험용 기준입니다.</p></div><span class="rl-pill" data-rl-breakpoint>현재 ${getBreakpoint(settings.width).id.toUpperCase()}</span></div><div class="rl-breakpoint-track" aria-label="브레이크포인트 구간">${breakpoints.map((point,index)=>`<button data-rl-width="${point.min||320}" class="rl-breakpoint-segment" data-rl-bp="${point.id}"><strong>${point.id.toUpperCase()}</strong><span>${point.min||320}–${breakpoints[index+1]?breakpoints[index+1].min-1:'1920'}px</span></button>`).join('')}</div><div class="rl-boundaries">${breakpoints.slice(1).map(point=>`<section><span class="rl-kicker">${point.id.toUpperCase()} · ${point.min}px</span><div class="rl-step-buttons">${[-1,0,1].map(offset=>`<button class="rl-button" data-rl-width="${point.min+offset}" aria-label="뷰포트 ${point.min+offset}픽셀">${point.min+offset}</button>`).join('')}</div><p>${point.min===640?'카드 1 → 2열':point.min===768?'메뉴 버튼 → 탐색 링크':point.min===1024?'보조 패널 표시 · 카드 3열':'카드 4열'}</p></section>`).join('')}</div><div class="rl-inline-controls">${range('width','뷰포트 너비',settings.width,320,1920)}<label class="rl-check"><input type="checkbox" data-rl-control="fit" ${settings.fit?'checked':''}>화면에 맞춰 보기</label></div>`;}
function typographyTools(){return `<div class="rl-section-intro"><div><h2>크기는 유동적으로, 내용은 끝까지</h2><p>제목의 최소·최대 크기와 변화 구간을 정하세요. 본문은 1rem, 입력은 768px에서 1rem → 0.875rem으로 바뀝니다.</p></div><span class="rl-pill">실험값 · 전역 적용 없음</span></div><div class="rl-type-settings"><div class="rl-numeric-grid">${numberField('min','최소 글자',settings.min,16,95)}${numberField('max','최대 글자',settings.max,17,96)}${numberField('from','시작 폭',settings.from,320,1919)}${numberField('to','끝 폭',settings.to,321,1920)}</div><div class="rl-type-options"><label class="rl-select-label"><span>유동 크기 기준</span><select data-rl-control="basis"><option value="container" ${settings.basis==='container'?'selected':''}>컨테이너 · cqi</option><option value="viewport" ${settings.basis==='viewport'?'selected':''}>뷰포트 · vw</option></select></label>${range('container','콘텐츠 폭',settings.container,50,100,'%')}${range('textScale','텍스트 배율',settings.textScale,100,200,'%',25)}</div></div><label class="rl-text-field"><span>테스트 제목</span><input data-rl-control="title" maxlength="250" value="${escapeHTML(settings.title)}"></label><div class="rl-inline-controls">${range('width','뷰포트 너비',settings.width,320,1920)}<label class="rl-check"><input type="checkbox" data-rl-control="fit" ${settings.fit?'checked':''}>화면에 맞춰 보기</label></div><div class="rl-code-row"><code data-rl-formula>${escapeHTML(buildFluidRule(settings,settings.basis==='container'?'cqi':'vw'))}</code><button class="rl-button" data-rl-action="copy-css">CSS 복사</button></div>`;}
function layoutTools(){return `<div class="rl-section-intro"><div><h2>컨테이너 안에서 균형 찾기</h2><p>열 수와 여백을 바꾸며 같은 콘텐츠가 어떻게 배치되는지 확인하세요.</p></div><span class="rl-pill">그리드 실험</span></div><div class="rl-layout-controls">${range('maxWidth','최대 콘텐츠 폭',settings.maxWidth,640,1600)}${range('padding','좌우 여백',settings.padding,12,64)}${range('gap','카드 간격',settings.gap,8,40)}${range('columns','설정 열 수',settings.columns,1,6,'열')}</div><div class="rl-layout-options"><label class="rl-check"><input type="checkbox" data-rl-control="autoGrid" ${settings.autoGrid?'checked':''}>화면에 맞춰 열 수 줄이기</label><label class="rl-check"><input type="checkbox" data-rl-control="longText" ${settings.longText?'checked':''}>긴 카드 문구로 테스트</label></div><div class="rl-inline-controls">${range('width','뷰포트 너비',settings.width,320,1920)}<label class="rl-check"><input type="checkbox" data-rl-control="fit" ${settings.fit?'checked':''}>화면에 맞춰 보기</label></div><p class="rl-small-note">자동 줄이기를 끄면 설정한 열 수를 유지합니다. 좁은 카드에서 줄바꿈과 버튼 크기를 직접 비교하세요.</p>`;}
function preview(tab){return `<section class="rl-preview" aria-label="실시간 반응형 미리보기"><header><div><span class="rl-preview-dot"></span><strong>KLIC Workspace</strong><span class="rl-preview-mode">${tab.label} 실험</span></div><span class="rl-measure" data-rl-dimension>${settings.width} × ${settings.height} CSS px</span></header><div class="rl-stage" data-rl-stage tabindex="0" role="region" aria-label="가로로 스크롤 가능한 실험 화면"><div class="rl-frame-holder" data-rl-holder><iframe class="rl-frame" data-rl-frame title="${tab.label} 반응형 인터랙티브 샘플" sandbox="allow-same-origin" srcdoc="${escapeHTML(buildFrameDocument(tab.id))}"></iframe></div></div><footer><span data-rl-zoom>화면 맞춤 계산 중</span><span>미리보기 축소율과 브라우저 확대는 별개입니다.</span></footer></section><div class="rl-readouts" aria-live="polite" aria-atomic="true"><div><span>실제 뷰포트</span><strong data-rl-metric="viewport">측정 중</strong></div><div><span>${tab.id==='typography'?'제목 / 본문 / 입력':tab.id==='layout'?'카드 열 수 / 간격':'현재 구간 / 카드 열 수'}</span><strong data-rl-metric="primary">측정 중</strong></div><div><span>${tab.id==='typography'?'유동 크기 기준 폭':tab.id==='layout'?'콘텐츠 폭':'레이아웃 상태'}</span><strong data-rl-metric="secondary">측정 중</strong></div></div>`;}
function notes(tab){const text={viewport:['높이도 하나의 제약입니다','높이를 줄이면 프레임 내부가 스크롤됩니다. 화면 밖의 콘텐츠와 입력 피드백에 계속 접근할 수 있는지 살펴보세요.'],breakpoints:['경계값은 제품 콘텐츠에 맞게','640 / 768 / 1024 / 1280px는 이 샘플의 실험 기준입니다. 사용 중인 화면과 실제 콘텐츠로 적절한 전환점을 결정하세요.'],typography:['브라우저 확대와 텍스트 배율','텍스트 배율은 프레임 내부의 rem 기준만 바꿉니다. 실제 브라우저 확대는 CSS 뷰포트와 화면 전체에 영향을 주므로 브라우저 메뉴에서 별도로 확인하세요.'],layout:['고정 열 수와 반응형 열 수','자동 열 수는 현재 브레이크포인트의 열 수와 설정 열 수 중 작은 값을 사용합니다. 그리드 항목은 minmax(0, 1fr)로 내용이 길어져도 줄바꿈됩니다.']}[tab.id];return `<aside class="rl-note"><span aria-hidden="true">ⓘ</span><div><strong>${text[0]}</strong><p>${text[1]}</p></div></aside>`;}
function qaPanel(){const qa=getQA(),count=checkItems.filter(([id])=>qa.checked[id]).length;return `<div class="rl-section-intro"><div><h2>관찰한 결과를 남겨두세요</h2><p>체크는 직접 검수한 기록입니다. 자동 적합성 판정을 의미하지 않습니다.</p></div><span class="rl-pill" data-rl-qa-count>${count} / ${checkItems.length} 확인</span></div><div class="rl-qa-grid"><section class="rl-qa-list" aria-label="반응형 수동 검수">${checkItems.map(([id,title,description])=>`<label class="rl-qa-item"><input type="checkbox" data-rl-check="${id}" ${qa.checked[id]?'checked':''}><span><strong>${title}</strong><small>${description}</small></span></label>`).join('')}</section><aside class="rl-qa-aside"><h3>바로 테스트하기</h3><button class="rl-scenario" data-rl-scenario="mobile"><span>좁은 화면</span><strong>320 × 568 <span>↗</span></strong></button><button class="rl-scenario" data-rl-scenario="boundary"><span>탐색 전환 직전</span><strong>767 × 800 <span>↗</span></strong></button><button class="rl-scenario" data-rl-scenario="text"><span>큰 텍스트</span><strong>200% <span>↗</span></strong></button><p>테스트 바로가기는 실험 설정만 변경합니다.</p></aside></div><label class="rl-text-field rl-notes-field"><span>검수 메모</span><textarea data-rl-notes rows="4" maxlength="2000" placeholder="예: 320px에서 긴 제목의 줄바꿈 확인. 브라우저 200% 확대 검수 필요.">${escapeHTML(qa.notes)}</textarea></label><div class="rl-qa-footer"><span data-rl-save-status role="status">이 브라우저에 체크리스트와 메모를 저장합니다.</span><div><button class="rl-button" data-rl-action="reset-qa">기록 초기화</button><button class="rl-button rl-button-primary" data-rl-action="copy-report">검수 기록 복사</button></div></div><aside class="rl-note"><span aria-hidden="true">ⓘ</span><div><strong>실제 제품에서도 한 번 더</strong><p>이 샘플에서의 확인은 실제 제품의 접근성 검수를 대신하지 않습니다. 브라우저 확대, 키보드, 보조 기술을 제품 화면에서도 확인하세요.</p></div></aside>`;}

export function renderResizeLab(routeParts=[]){const tab=activeTab(routeParts);return `<section class="resize-lab" data-resize-lab data-rl-tab="${tab.id}"><div class="page-heading rl-heading"><div class="eyebrow">Resize laboratory</div><h1>다양한 화면에서도,<br>자연스럽게 이어지는 경험.</h1><p>뷰포트부터 타이포그래피까지. 조건을 바꾸고, 변화를 관찰하고, 검수 기록을 남기세요.</p></div><div class="rl-tabs" role="tablist" aria-label="리사이즈 실험 종류">${RESIZE_LAB_TABS.map(item=>`<a class="rl-tab" id="resize-tab-${item.id}" role="tab" href="#lab/${item.id}" aria-controls="resize-lab-panel" aria-selected="${tab.id===item.id}" tabindex="${tab.id===item.id?'0':'-1'}">${item.label}</a>`).join('')}</div><div id="resize-lab-panel" role="tabpanel" aria-labelledby="resize-tab-${tab.id}" tabindex="0">${tab.id==='qa'?qaPanel():({viewport:viewportTools,breakpoints:breakpointTools,typography:typographyTools,layout:layoutTools}[tab.id]()+preview(tab)+notes(tab))}</div></section>`;}

export function buildFrameDocument(tab='viewport',appearance){
  const theme=frameTheme(appearance||frameAppearance(),appearance?null:globalThis.document?.documentElement);
  const typography=tab==='typography',layout=tab==='layout';
  const title=typography?settings.title:'작은 아이디어를,\n다음 프로젝트로.';
  const cardNames=settings.longText&&layout?['고객 경험을 더 세심하게 개선하기 위한 서비스 탐색 프로젝트','project_identifier_with_a_very_long_unbroken_name_2026','여러 팀이 함께 만드는 새로운 협업 방식','작은 화면에서도 끝까지 읽을 수 있는 프로젝트 제목']:['브랜드 리뉴얼','웹사이트 개선','사용자 리서치','디자인 시스템'];
  return `<!doctype html><html lang="ko" data-theme="${theme.mode}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>
:root{${Object.entries(theme.variables).map(([name,value])=>`${name}:${value}`).join(';')}}
*{box-sizing:border-box}html{font-size:${typography?settings.textScale/100*16:16}px;color-scheme:${theme.mode}}body{margin:0;font:1rem/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans KR",sans-serif;color:var(--klic-component-block-color-text);background:var(--klic-component-block-color-surface)}button,input{font:inherit;min-width:0}button{cursor:pointer}a{color:inherit;text-decoration:none}button,a,input{outline-offset:4px}button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid var(--klic-semantic-color-focus)}button{border:1px solid var(--klic-component-block-color-border);border-radius:7px;background:var(--klic-component-block-color-panel);color:var(--klic-component-block-color-text);padding:9px 13px}header{background:var(--klic-component-block-color-panel);border-bottom:1px solid var(--klic-component-block-color-border);display:flex;align-items:center;gap:24px;padding:18px max(20px,calc((100% - 1120px)/2));min-height:72px}.brand{font-weight:800;font-size:1.125rem;letter-spacing:-.04em;color:var(--klic-component-block-color-accent)}.brand span{color:var(--klic-component-block-color-text)}.navigation{display:none;gap:20px;font-size:.875rem}.navigation a[aria-current]{color:var(--klic-component-block-color-accent);font-weight:650}.menu{margin-left:auto;min-width:42px;min-height:42px;font-size:1rem}.mobile-nav{display:none;background:var(--klic-component-block-color-panel);padding:12px 20px;border-bottom:1px solid var(--klic-component-block-color-border)}.mobile-nav:not([hidden]){display:flex;gap:18px;flex-wrap:wrap}.account{display:none;margin-left:auto;border:1px solid var(--klic-component-block-color-border);border-radius:50%;width:34px;height:34px;align-items:center;justify-content:center;color:var(--klic-component-block-color-accent);background:var(--klic-component-block-color-selected);font-size:.75rem}main{max-width:${layout?settings.maxWidth:1120}px;width:100%;margin:auto;padding:32px ${layout?settings.padding:24}px}.shell{display:grid;gap:24px;grid-template-columns:minmax(0,1fr)}.content{min-width:0;width:${typography?settings.container:100}%;container-type:inline-size}.hero{background:var(--klic-component-block-color-selected);border:1px solid var(--klic-component-block-color-border);border-radius:12px;padding:26px}.eyebrow{font-size:.6875rem;letter-spacing:.14em;color:var(--klic-component-block-color-accent);font-weight:700;margin:0 0 12px}h1{font-size:${typography?buildFluidRule(settings,settings.basis==='container'?'cqi':'vw'):'clamp(1.5rem, 2.6vw, 2rem)'};line-height:1.3;letter-spacing:-.04em;margin:0 0 14px;overflow-wrap:anywhere;white-space:pre-line}p{font-size:1rem;margin:0;color:var(--klic-component-block-color-muted);overflow-wrap:anywhere}.hero p{max-width:45ch}.form{display:flex;gap:8px;flex-wrap:wrap;margin-top:22px}.form input::placeholder{color:var(--klic-component-block-color-muted);opacity:1}.form input{flex:1 1 180px;width:100%;max-width:340px;min-height:42px;padding:9px 12px;border:1px solid var(--klic-component-block-color-control-border);border-radius:7px;background:var(--klic-component-block-color-panel);color:var(--klic-component-block-color-text);font-size:1rem;line-height:1.5}.primary{color:var(--klic-component-block-color-on-accent);background:var(--klic-component-block-color-accent);border-color:var(--klic-component-block-color-accent);font-size:.875rem;font-weight:600;min-height:42px;white-space:normal}.feedback{margin-top:12px;color:var(--klic-component-block-color-accent);font-size:.8125rem}.section-top{display:flex;gap:10px;align-items:center;justify-content:space-between;margin:28px 0 14px}.section-top h2{font-size:1rem;margin:0}.section-top span{font-size:.75rem;color:var(--klic-component-block-color-muted)}.cards{display:grid;grid-template-columns:repeat(var(--columns),minmax(0,1fr));gap:${layout?settings.gap:16}px;--columns:${layout&&!settings.autoGrid?settings.columns:1}}.card{min-width:0;border:1px solid var(--klic-component-block-color-border);border-radius:10px;background:var(--klic-component-block-color-panel);padding:18px}.card-mark{display:flex;width:32px;height:32px;align-items:center;justify-content:center;border-radius:8px;background:var(--klic-component-block-color-selected);color:var(--klic-component-block-color-accent);font-weight:700;font-size:.8125rem;margin-bottom:20px}.card h3{font-size:.875rem;line-height:1.5;margin:0 0 8px;overflow-wrap:anywhere}.card p{font-size:.75rem;line-height:1.6}.card-footer{display:flex;align-items:center;gap:8px;justify-content:space-between;flex-wrap:wrap;border-top:1px solid var(--klic-component-block-color-border);padding-top:14px;margin-top:20px;color:var(--klic-component-block-color-muted);font-size:.6875rem}.card-footer button{font-size:.6875rem;padding:4px 8px;color:var(--klic-component-block-color-accent)}.side{display:none;border:1px solid var(--klic-component-block-color-border);border-radius:10px;padding:20px;background:var(--klic-component-block-color-panel);align-self:start;min-width:0}.side h2{font-size:.875rem;margin:0 0 14px}.side p{font-size:.75rem}.side ul{padding:0;list-style:none;margin:18px 0 0}.side li{font-size:.75rem;padding:12px 0;border-top:1px solid var(--klic-component-block-color-border);overflow-wrap:anywhere}.side li small{display:block;color:var(--klic-component-block-color-muted);margin-top:3px}.end-note{margin:26px 0 0;font-size:.6875rem;color:var(--klic-component-block-color-muted)}dialog{background:var(--klic-component-block-color-panel);max-width:min(380px,calc(100% - 32px));padding:24px;border:1px solid var(--klic-component-block-color-border);border-radius:12px;color:var(--klic-component-block-color-text)}dialog::backdrop{background:#10172288}dialog h2{font-size:1.125rem;margin:0 0 10px}dialog p{font-size:.875rem;margin-bottom:20px}
@media(min-width:640px){.cards{--columns:${layout?Math.min(settings.columns,2):2}}}@media(min-width:768px){.navigation{display:flex}.menu,.mobile-nav:not([hidden]){display:none}.account{display:flex}.form input{font-size:.875rem}}@media(min-width:1024px){.shell{grid-template-columns:${typography||layout?'minmax(0,1fr)':'minmax(0,1fr) 210px'}}.side{display:${typography||layout?'none':'block'}}.cards{--columns:${layout?Math.min(settings.columns,3):3}}}@media(min-width:1280px){.cards{--columns:${layout?Math.min(settings.columns,4):4}}}${layout&&!settings.autoGrid?`.cards{--columns:${settings.columns}!important}`:''}@media(max-width:479px){main{padding-block:22px}.hero{padding:20px}.section-top{align-items:flex-start}.form .primary{width:100%}.card{padding:16px}}[hidden]{display:none!important}
</style></head><body><header><a href="#" class="brand" aria-label="워크스페이스 홈">KLIC<span> Workspace</span></a><nav class="navigation" aria-label="샘플 탐색"><a href="#projects" aria-current="page">프로젝트</a><a href="#activity">팀 활동</a></nav><span class="account" aria-label="김하늘 계정">KH</span><button class="menu" data-sample-menu aria-expanded="false" aria-controls="sample-mobile-nav" aria-label="샘플 탐색 메뉴 열기">☰</button></header><nav id="sample-mobile-nav" class="mobile-nav" aria-label="샘플 모바일 탐색" hidden><a href="#projects">프로젝트</a><a href="#activity">팀 활동</a></nav><main><div class="shell"><section class="content"><div class="hero"><p class="eyebrow">A SPACE FOR YOUR NEXT IDEA</p><h1 data-sample-title>${escapeHTML(title)}</h1><p data-sample-body>좋은 협업은 명확한 시작에서. 팀의 아이디어를 모으고, 함께 다음 단계를 만들어보세요.</p><form class="form" data-sample-form><label style="position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0)" for="sample-project">프로젝트 이름</label><input id="sample-project" name="project" placeholder="새 프로젝트 이름" maxlength="80" required><button class="primary" type="submit">프로젝트 만들기 ↗</button></form><p class="feedback" data-sample-feedback role="status" hidden></p></div><div class="section-top" id="projects"><h2>진행 중인 프로젝트</h2><span>4개 프로젝트</span></div><div class="cards">${cardNames.map((name,index)=>`<article class="card"><span class="card-mark">${['B','W','R','D'][index]}</span><h3>${escapeHTML(name)}</h3><p>${['일관된 경험을 위한 다음 단계','작은 개선으로 만드는 큰 변화','고객의 이야기를 듣는 시간','팀이 함께 쓰는 디자인 언어'][index]}</p><div class="card-footer"><span>${index+2}명 참여</span><button type="button" data-sample-detail="${escapeHTML(name)}">열기 ↗</button></div></article>`).join('')}</div><p class="end-note">KLIC · 화면 크기와 콘텐츠를 함께 살펴보는 인터랙티브 샘플</p></section><aside class="side" id="activity"><h2>최근 팀 활동</h2><p>작은 진전이 쌓이고 있어요.</p><ul><li>김하늘 · 새 시안 업로드<small>10분 전 · 브랜드 리뉴얼</small></li><li>이지원 · 리서치 정리<small>35분 전 · 사용자 리서치</small></li><li>박선준 · 컴포넌트 검토<small>1시간 전 · 디자인 시스템</small></li></ul></aside></div><dialog aria-labelledby="sample-dialog-title"><h2 id="sample-dialog-title"></h2><p>프로젝트 상세를 여는 인터랙션 예시입니다.</p><button data-sample-close>닫기</button></dialog></main></body></html>`;
}

export function initResizeLab(root,hooks={}){
  const lab=root.matches?.('[data-resize-lab]')?root:root.querySelector('[data-resize-lab]');
  if(!lab)return ()=>{};
  const tab=lab.dataset.rlTab,frame=lab.querySelector('[data-rl-frame]'),stage=lab.querySelector('[data-rl-stage]');
  const controller=new AbortController(),signal=controller.signal;
  let observer,frameObserver,themeObserver,raf=0,disposed=false,qa=getQA();
  const find=selector=>lab.querySelector(selector);
  const write=(selector,value)=>{const node=find(selector);if(node)node.textContent=value;};
  function announce(message){hooks.notify?.(message);}
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
    }else{
      write('[data-rl-metric="primary"]',`${getBreakpoint(win.innerWidth).id.toUpperCase()} / ${columns}열`);
      write('[data-rl-metric="secondary"]',win.innerWidth<768?'접힌 탐색':win.innerWidth<1024?'펼친 탐색':'펼친 탐색 + 보조 패널');
    }
  }
  function resize(){
    if(!frame||!stage||disposed)return;
    const available=Math.max(120,stage.clientWidth-40),scale=settings.fit?Math.min(1,available/settings.width):1;
    frame.style.width=`${settings.width}px`;frame.style.height=`${settings.height}px`;frame.style.transform=`scale(${scale})`;
    const holder=find('[data-rl-holder]');holder.style.width=`${settings.width*scale}px`;holder.style.height=`${settings.height*scale}px`;
    write('[data-rl-dimension]',`${settings.width} × ${settings.height} CSS px`);
    write('[data-rl-zoom]',settings.fit?`화면 맞춤 ${Math.round(scale*100)}% · 실제 너비 ${settings.width}px`:'실제 크기 100% · 넓은 화면은 가로로 스크롤하세요');
    cancelAnimationFrame(raf);raf=requestAnimationFrame(measure);
  }
  function updateControls(){
    lab.querySelectorAll('[data-rl-control]').forEach(input=>{const key=input.dataset.rlControl;if(input.type==='checkbox')input.checked=settings[key];else if(document.activeElement!==input)input.value=settings[key];});
    lab.querySelectorAll('[data-rl-value]').forEach(output=>{const key=output.dataset.rlValue;output.textContent=settings[key]+(['container','textScale'].includes(key)?'%':key==='columns'?'열':'px');});
    lab.querySelectorAll('[data-rl-preset]').forEach(button=>{const device=devices.find(([id])=>id===button.dataset.rlPreset);button.setAttribute('aria-pressed',String(settings.width===device[2]&&settings.height===device[3]));});
    lab.querySelectorAll('[data-rl-bp]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.rlBp===getBreakpoint(settings.width).id)));
    write('[data-rl-breakpoint]',`현재 ${getBreakpoint(settings.width).id.toUpperCase()} · ${settings.width}px`);
    write('[data-rl-formula]',buildFluidRule(settings,settings.basis==='container'?'cqi':'vw'));
    resize();
  }
  function rebuild(){if(frame)frame.srcdoc=buildFrameDocument(tab);updateControls();}
  function wireFrame(){
    if(disposed)return;
    const doc=frame.contentDocument;if(!doc?.querySelector('.cards'))return;
    syncFrameTheme();
    doc.addEventListener('click',event=>{
      const menu=event.target.closest('[data-sample-menu]');
      if(menu){const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'샘플 탐색 메뉴 닫기':'샘플 탐색 메뉴 열기');doc.querySelector('.mobile-nav').hidden=!open;}
      const detail=event.target.closest('[data-sample-detail]');
      if(detail){doc.querySelector('#sample-dialog-title').textContent=detail.dataset.sampleDetail;doc.querySelector('dialog').showModal();}
      if(event.target.closest('[data-sample-close]'))doc.querySelector('dialog').close();
      const anchor=event.target.closest('a');if(anchor){event.preventDefault();const target=doc.querySelector(anchor.getAttribute('href')==='#'?'header':anchor.getAttribute('href'));if(target?.id==='activity')target.style.display='block';doc.querySelector('.mobile-nav').hidden=true;doc.querySelector('[data-sample-menu]').setAttribute('aria-expanded','false');target?.scrollIntoView({behavior:'instant',block:'start'});}
    },{signal});
    doc.querySelector('[data-sample-form]').addEventListener('submit',event=>{event.preventDefault();const value=doc.querySelector('#sample-project').value.trim(),feedback=doc.querySelector('[data-sample-feedback]');if(!value)return;feedback.hidden=false;feedback.textContent=`✓ “${value}” 프로젝트 만들기를 확인했어요. (샘플)`;},{signal});
    frameObserver?.disconnect();frameObserver=new ResizeObserver(measure);frameObserver.observe(doc.querySelector('.content'));resize();
  }
  function handleControl(event){
    const input=event.target.closest('[data-rl-control]');if(!input)return;
    const key=input.dataset.rlControl;
    if(['number','checkbox','select-one'].includes(input.type)&&event.type!=='change')return;
    if(input.type!=='number'&&event.type==='change'&&!['checkbox','select-one'].includes(input.type))return;
    if(input.type==='checkbox')settings[key]=input.checked;
    else if(key==='title')settings.title=input.value;
    else if(key==='basis')settings.basis=input.value==='viewport'?'viewport':'container';
    else{if(!Number.isFinite(Number(input.value))||input.value===''){input.value=settings[key];return;}settings[key]=clamp(input.value,Number(input.min),Number(input.max));}
    if(key==='min')settings.max=Math.max(settings.max,settings.min+1);
    if(key==='max')settings.min=Math.min(settings.min,settings.max-1);
    if(key==='from')settings.to=Math.max(settings.to,settings.from+1);
    if(key==='to')settings.from=Math.min(settings.from,settings.to-1);
    if(['width','height','fit'].includes(key))updateControls();
    else if(key==='title'&&frame?.contentDocument?.querySelector('[data-sample-title]')){frame.contentDocument.querySelector('[data-sample-title]').textContent=settings.title;updateControls();}
    else rebuild();
  }
  function persistQA(){const saved=saveQA(qa);write('[data-rl-qa-count]',`${checkItems.filter(([id])=>qa.checked[id]).length} / ${checkItems.length} 확인`);write('[data-rl-save-status]',saved?'체크리스트와 메모를 이 브라우저에 저장했어요.':'현재 세션에 기록했어요. 브라우저 저장소를 사용할 수 없습니다.');}
  lab.addEventListener('input',event=>{handleControl(event);if(event.target.matches('[data-rl-notes]')){qa.notes=event.target.value;persistQA();}},{signal});
  lab.addEventListener('change',event=>{handleControl(event);if(event.target.matches('[data-rl-check]')){qa.checked[event.target.dataset.rlCheck]=event.target.checked;persistQA();}},{signal});
  lab.addEventListener('keydown',event=>{
    const current=event.target.closest('[role="tab"]');if(!current||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();const tabs=[...lab.querySelectorAll('[role="tab"]')],index=tabs.indexOf(current),next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
    pendingTabFocus=true;tabs[next].click();
  },{signal});
  lab.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.rlPreset){const [, ,width,height]=devices.find(([id])=>id===button.dataset.rlPreset);settings.width=width;settings.height=height;updateControls();}
    if(button.dataset.rlWidth){settings.width=Number(button.dataset.rlWidth);updateControls();}
    if(button.dataset.rlScenario){const scenario=button.dataset.rlScenario;if(scenario==='mobile'){settings.width=320;settings.height=568;}if(scenario==='boundary'){settings.width=767;settings.height=800;}if(scenario==='text'){settings.width=768;settings.height=900;settings.textScale=200;}location.hash=`lab/${{mobile:'viewport',boundary:'breakpoints',text:'typography'}[scenario]}`;}
    if(button.dataset.rlAction==='rotate'){[settings.width,settings.height]=[settings.height,settings.width];updateControls();}
    if(button.dataset.rlAction==='copy-css'){
      const css=`${settings.basis==='container'?'.content { container-type: inline-size; }\n':''}.page-title {\n  font-size: ${settings.min/16}rem;\n  font-size: ${buildFluidRule(settings,settings.basis==='container'?'cqi':'vw')};\n  line-height: 1.3;\n  overflow-wrap: anywhere;\n}`;
      if(hooks.copy)hooks.copy(css,'타이포그래피 CSS를 복사했어요.');
    }
    if(button.dataset.rlAction==='reset-qa'){qa={checked:{},notes:''};lab.querySelectorAll('[data-rl-check]').forEach(input=>input.checked=false);find('[data-rl-notes]').value='';persistQA();announce('검수 기록을 초기화했어요.');}
    if(button.dataset.rlAction==='copy-report'){
      const report=`KLIC 리사이즈 실험실 · 수동 검수 기록\n${new Date().toLocaleString('ko-KR')}\n\n${checkItems.map(([id,title])=>`${qa.checked[id]?'[확인]':'[미확인]'} ${title}`).join('\n')}\n\n메모\n${qa.notes||'기록 없음'}\n\n최근 실험: ${settings.width} × ${settings.height}px / 텍스트 ${settings.textScale}%\n자동 접근성 적합성 판정이 아닌 수동 검수 기록입니다.`;
      if(hooks.copy)hooks.copy(report,'검수 기록을 복사했어요.');
    }
  },{signal});
  if(frame){
    frame.addEventListener('load',wireFrame,{signal});observer=new ResizeObserver(resize);observer.observe(stage);
    const parentDocument=lab.ownerDocument;
    themeObserver=new MutationObserver(syncFrameTheme);
    themeObserver.observe(parentDocument.documentElement,{attributes:true,attributeFilter:['data-theme','data-color-theme','data-brand-profile','data-brand','data-material','style']});
    // applyTheme() replaces the resolved stylesheet when palette or neutral preferences change.
    if(parentDocument.head)themeObserver.observe(parentDocument.head,{childList:true,subtree:true,characterData:true});
    if(frame.contentDocument?.readyState==='complete')wireFrame();updateControls();
  }
  if(pendingTabFocus){find('[role="tab"][aria-selected="true"]')?.focus();pendingTabFocus=false;}
  return ()=>{disposed=true;controller.abort();observer?.disconnect();frameObserver?.disconnect();themeObserver?.disconnect();cancelAnimationFrame(raf);};
}
