import {DESIGN_DOC_LABELS} from './design-docs.mjs';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const componentTabs={preview:'미리보기',examples:'사용 예제',api:'API · 동작',code:'기본 코드',spec:'설계 명세'};
const blockTabs={preview:'미리보기',code:'실제 소스',axes:'7 디멘션',tokens:'4계층 토큰'};
const fontTabs={preview:'미리보기',form:'형태·용도',files:'파일·문자',sources:'라이선스·출처'};
const docsLabels={...DESIGN_DOC_LABELS,'design-system':'디자인 시스템 가이드',book:'설계 원칙',overview:'소개',start:'시작하기',principles:'디자인 원칙',contracts:'구현 계약',changelog:'변경 기록',integrations:'개발 연동',cli:'CLI',mcp:'MCP',webmcp:'WebMCP',api:'API',brand:'브랜드 아이덴티티'};
const labLabels={viewport:'뷰포트',breakpoints:'브레이크포인트',typography:'타이포그래피',layout:'레이아웃',qa:'검수 체크리스트'};
const collectionLabels={applications:'Application',diagrams:'다이어그램',charts:'Charts','data-grids':'Data Grid',all:'전체'};
const leaf=(label,href)=>({label,href});
export function buildBreadcrumbs(route=[],{components=[],categories={},blocks={},fonts={},tokenLayer='component'}={}){
 const [section,id,tab,category]=route;
 if(section==='home')return [leaf('디자인 쇼케이스','#home')];
 if(section==='component'){
  const c=components.find(x=>x.id===id);if(!c)return [leaf('컴포넌트','#components'),leaf('항목을 찾을 수 없음')];
  return [leaf('컴포넌트','#components'),leaf(categories[c.category]||c.category,'#components/'+c.category),leaf(c.name,'#component/'+c.id),leaf(componentTabs[tab]||componentTabs.preview)];
 }
 if(section==='components')return [leaf('컴포넌트','#components'),...(id&&id!=='all'&&categories[id]?[leaf(categories[id])]:[])];
 if(section==='motion')return [leaf('모션 라이브러리')];
 if(section==='blocks'){
  const first=leaf('블록 스튜디오','#blocks');
  if(id==='guide')return [first,leaf('적용 가이드')];
  if(id==='collection')return [first,...(tab&&tab!=='all'?[leaf(collectionLabels[tab]||tab,'#blocks/collection/'+tab)]:[]),...(category?[leaf(blocks.categories?.find(c=>c.id===category)?.name||category)]:[])];
  if(!id)return [first];
  const b=blocks.blocks?.find(x=>x.id===id);if(!b)return [first,leaf(id)];
  return [first,leaf(collectionLabels[b.collection]||b.collection,'#blocks/collection/'+b.collection),leaf(b.categoryName,'#blocks/collection/'+b.collection+'/'+b.categoryId),leaf(b.catalogTitle||b.title,'#blocks/'+b.id),leaf(blockTabs[tab]||blockTabs.preview)];
 }
 if(section==='fonts'){
  const first=leaf('폰트','#fonts'),f=fonts.families?.find(f=>f.id===id);
  if(f)return [first,leaf(f.name,'#fonts/'+f.id),leaf(fontTabs[tab]||fontTabs.preview)];
  return [first,...(id?[leaf({families:'형태 계열',usage:'사용 가이드',compare:'나란히 비교'}[id]||id)]:[])];
 }
 if(section==='docs')return [leaf('Docs','#docs/overview'),...(['cli','mcp','webmcp','api'].includes(id)?[leaf('개발 연동','#docs/integrations')]:[]),leaf(docsLabels[id]||docsLabels.overview)];
 if(section==='lab')return [leaf('실험실','#lab/viewport'),leaf(labLabels[id]||labLabels.viewport)];
 if(section==='settings')return [leaf('설정','#settings/theme'),leaf({theme:'화면과 스타일',brand:'브랜드 아이덴티티',identity:'브랜드 아이덴티티'}[id]||'화면과 스타일')];
 if(section==='tokens')return [leaf('디자인 토큰','#tokens'),leaf(tokenLayer.charAt(0).toUpperCase()+tokenLayer.slice(1))];
 return [leaf('라이브러리','#components')];
}
export function breadcrumbHTML(items){return `<ol>${items.map((item,i)=>`<li>${i?'<span class="breadcrumb-separator" aria-hidden="true">/</span>':''}${i===items.length-1?`<span aria-current="page" title="${esc(item.label)}">${esc(item.label)}</span>`:`<a href="${esc(item.href||'#components')}" title="${esc(item.label)}">${esc(item.label)}</a>`}</li>`).join('')}</ol>`;}
const metadata={};let breadcrumbGeneration=0;
async function loadMetadata(type){if(!metadata[type])metadata[type]=fetch('./'+type+'-data.json').then(r=>{if(!r.ok)throw new Error('metadata');return r.json();}).catch(()=>{delete metadata[type];return {};});return metadata[type];}
export async function updateWorkspaceBreadcrumbs(element,route,context={}){
 const g=++breadcrumbGeneration;let data={...context};
 element.innerHTML=breadcrumbHTML(buildBreadcrumbs(route,data));
 if(route[0]==='blocks')data.blocks=await loadMetadata('blocks');
 if(route[0]==='fonts')data.fonts=await loadMetadata('fonts');
 if(g!==breadcrumbGeneration||!element.isConnected)return;
 const items=buildBreadcrumbs(route,data);element.innerHTML=breadcrumbHTML(items);
 element.setAttribute('aria-label','현재 위치');
 const specific=route[0]==='component'||route[0]==='blocks'&&route[1]&&route[1]!=='collection'&&route[1]!=='guide'?items.at(-2):items.at(-1);
 if(specific&&route[0]!=='home'&&!globalThis.location?.pathname?.startsWith('/share/'))document.title=specific.label+' — KLIC';
 // Preserve every ancestor on narrow screens; show the current item first via a scrollable trail.
 element.scrollLeft=element.scrollWidth;
}
export const SHORTCUTS=[
 {keys:['⌘ / Ctrl','K'],label:'라이브러리 검색'},
 {keys:['/'],label:'검색 열기'},
 {keys:['?'],label:'도움말 · 키보드 단축키'},
 {keys:['G','C'],label:'컴포넌트'},
 {keys:['G','B'],label:'블록 스튜디오'},
 {keys:['G','M'],label:'모션'},
 {keys:['G','D'],label:'Docs'},
 {keys:['G','T'],label:'디자인 토큰'},
 {keys:['G','F'],label:'폰트 라이브러리'},
 {keys:['G','L'],label:'리사이즈 실험실'},
 {keys:['G','S'],label:'설정'},
 {keys:['Esc'],label:'열린 모달 · 패널 닫기'},
 {keys:['↑','↓','Enter'],label:'검색 결과 이동 · 열기'}
];
const destinations={c:'#components',b:'#blocks',m:'#motion',d:'#docs/overview',t:'#tokens',f:'#fonts',l:'#lab/viewport',s:'#settings/theme'};
export function workspaceShortcut(key,{editable=false,dialogOpen=false,composing=false,modified=false,pendingG=false}={}){
 if(editable||dialogOpen||composing||modified)return null;
 if(key==='?')return {action:'help'};
 if(key==='/')return {action:'search'};
 if(pendingG&&destinations[key.toLowerCase()])return {action:'navigate',href:destinations[key.toLowerCase()]};
 if(key.toLowerCase()==='g')return {action:'prefix'};
 return null;
}
export function initWorkspaceHelp({openSearch,onVisibilityChange=()=>{},icons=()=>{}}={}){
 const dialog=document.querySelector('#help-dialog');if(!dialog)return {close(){}};
 let trigger=null,restoreFocus=true,prefixAt=0;
 dialog.innerHTML=`<div class="workspace-help-head"><div><span class="eyebrow">KLIC / HELP</span><h2 id="help-title">찾는 화면으로, 더 빠르게.</h2><p id="help-description">라이브러리를 탐색하는 방법과 키보드 단축키입니다.</p></div><button type="button" class="icon-button" data-help-close aria-label="도움말 닫기"><i data-lucide="x"></i></button></div><div class="workspace-help-body"><section class="help-shortcuts" aria-labelledby="shortcut-title"><h3 id="shortcut-title">키보드 단축키</h3><div class="shortcut-grid">${SHORTCUTS.map(s=>`<div class="shortcut-row"><span>${s.label}</span><span class="shortcut-keys">${s.keys.map(k=>`<kbd>${esc(k)}</kbd>`).join(s.keys[0]==='G'?'<small>다음</small>':'<small>+</small>')}</span></div>`).join('')}</div><p class="help-caption">G 단축키는 G를 누른 뒤 1.2초 안에 다음 키를 누르세요. 입력 중이거나 모달이 열려 있으면 단일 문자 단축키는 작동하지 않습니다. 검색창에서는 ↑ ↓로 이동하고 Enter로 선택합니다.</p></section><section class="help-links" aria-labelledby="help-links-title"><h3 id="help-links-title">필요한 도움 바로 찾기</h3><button type="button" data-help-search><i data-lucide="search"></i><span><strong>검색하기</strong><small>컴포넌트와 라이브러리 도구 찾기</small></span><i data-lucide="arrow-up-right"></i></button><a href="#docs/start"><i data-lucide="book-open"></i><span><strong>시작하기</strong><small>컴포넌트 · 블록 · 7 디멘션 · 4계층</small></span><i data-lucide="arrow-up-right"></i></a><a href="#docs/integrations"><i data-lucide="terminal"></i><span><strong>개발 연동 Docs</strong><small>CLI · MCP · WebMCP · API</small></span><i data-lucide="arrow-up-right"></i></a><a href="#settings/theme"><i data-lucide="settings-2"></i><span><strong>화면과 스타일</strong><small>글자 크기 · 배율 · 반경 · 콘텐츠 폭</small></span><i data-lucide="arrow-up-right"></i></a></section></div><div class="workspace-help-foot"><span>상단의 ? 버튼으로 언제든 다시 열 수 있습니다.</span><kbd>Esc</kbd></div>`;
 function close(restore=true){restoreFocus=restore;if(dialog.open)dialog.close();}
 function open(){if(dialog.open)return;trigger=document.activeElement;restoreFocus=true;dialog.showModal();onVisibilityChange();icons(dialog);dialog.querySelector('[data-help-close]').focus();}
 document.addEventListener('click',e=>{
  if(e.target.closest('[data-workspace-help]')){open();return;}
  if(!dialog.open)return;
  if(e.target.closest('[data-help-close]'))close();
  else if(e.target.closest('[data-help-search]')){close(false);openSearch?.();}
  else if(e.target.closest('#help-dialog a[href]'))close(false);
  else if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}
 });
 document.addEventListener('keydown',e=>{
  if(e.defaultPrevented)return;
  const action=workspaceShortcut(e.key,{editable:!!e.target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"],[role="combobox"]'),dialogOpen:!!document.querySelector('dialog[open]'),composing:e.isComposing||e.keyCode===229,modified:e.ctrlKey||e.metaKey||e.altKey,pendingG:Date.now()-prefixAt<1200});
  prefixAt=0;if(!action)return;e.preventDefault();
  if(action.action==='prefix')prefixAt=Date.now();else if(action.action==='help')open();else if(action.action==='search')openSearch?.();else if(action.action==='navigate')location.hash=action.href;
 });
 dialog.addEventListener('close',()=>{onVisibilityChange();if(restoreFocus&&trigger?.isConnected&&!document.querySelector('dialog[open]'))trigger.focus();});
 icons(dialog);return {open,close};
}
