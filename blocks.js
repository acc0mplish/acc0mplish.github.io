import {renderItemDelivery} from './item-delivery.mjs';
import {renderLibraryOverview} from './library-overview.mjs';
import {mountBlockSourceBrowser} from './block-source-browser.mjs';
import {THUMBNAIL_REVISION} from './thumbnail-version.mjs';
import {mountPreviewDependencies} from './preview-dependencies.mjs';
import {readBlockFavorites,toggleBlockFavorite,FAVORITES_EVENT,FAVORITES_STORAGE_KEY} from './block-favorites.mjs';
let blockDependenciesCleanup=null;
import {brandSelectorMarkup} from './brand-profiles.mjs';
import {initPreviewCustomizer,previewSettingsMarkup,previewCustomizeButton} from './preview-customizer.mjs';
import {icon,escapeHTML as esc} from './catalog.js';
import {createTokens,resolveTokens,traceToken,formatValue} from './tokens.mjs';
import {getBlockContract,AXES} from './block-contracts.mjs';
import {BLOCK_COLLECTION_NAMES,blockCategoryOptions,filterBlocks,paginateBlocks,normalizeBlockContext,blockPreviewURL,blockShareURL,blockMarkdown,renderBlockCollectionTabs} from './block-utils.mjs';
import {SITE_ORIGIN} from './site-metadata.mjs';

const $=(s,r=document)=>r.querySelector(s);
let favorites=readBlockFavorites();
const state={favoritesOnly:false,query:'',collection:'all',category:'all',page:1,font:'pretendard',density:'normal',width:'fluid',token:'klic.component.block.color.accent',installManager:'bun'};
const tabs=[['preview','미리보기','play'],['code','실제 소스','code-2'],['axes','7 디멘션','list-checks'],['tokens','4계층 토큰','layers-3']];
let dataPromise,data,view,hooks,parts=[],bound=false,generation=0,currentBlock,timer;
let blockPreview=null,blockSourceCleanup=null;
export function disposeBlockPreview(){blockSourceCleanup?.();blockSourceCleanup=null;blockDependenciesCleanup?.();blockDependenciesCleanup=null;blockPreview?.destroy();blockPreview=null;}
const baseContext=()=>normalizeBlockContext(hooks?.getContext?.()||{font:state.font,density:state.density});
const context=()=>blockPreview?.context()||baseContext();
const option=(value,label,selected)=>`<option value="${esc(value)}" ${value===selected?'selected':''}>${esc(label)}</option>`;
const bulletList=items=>`<ul class="block-rules">${items.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`;
const status=()=> '블록';
const installableBlocks=new Set(['affect-agent-review','affect-response-workspace','affect-logo-marquee','affect-testimonial-wall']);
const installCommands={bun:'bunx --bun',npm:'npx',pnpm:'pnpm dlx',yarn:'yarn dlx'};
export function blockInstallCommand(id,manager='bun'){
 if(!installableBlocks.has(id)||!Object.hasOwn(installCommands,manager))return null;
 return `${installCommands[manager]} shadcn@latest add ${SITE_ORIGIN}/r/${id}.json`;
}
export function blockInstallMarkup(id,manager='bun'){
 const command=blockInstallCommand(id,manager);if(!command)return '';
 return `<section class="block-install" data-block-install aria-label="블록 설치"><h2>설치</h2><div class="block-install-options"><strong>명령</strong><a href="/resources/cli#shadcn-registry">수동 설치 안내</a></div><div class="block-install-box"><div class="block-install-tabs" role="group" aria-label="패키지 매니저">${Object.keys(installCommands).map(name=>`<button type="button" data-block-action="install-manager" data-block-install-manager="${name}" aria-pressed="${name===manager}">${name}</button>`).join('')}</div><div class="block-install-code"><code data-install-command>${esc(command)}</code><button type="button" class="icon-button" data-block-action="install-copy" aria-label="설치 명령 복사">${icon('copy')}</button></div></div><p>React 19 · shadcn 설정 필요 · 시스템 폰트 사용</p><a class="block-install-source" href="${SITE_ORIGIN}/r/${id}.json" target="_blank" rel="noopener noreferrer">설치 소스 JSON 보기 ↗</a></section>`;
}
export function updateBlockInstallUI(root,id,manager){
 const command=blockInstallCommand(id,manager);if(!root||!command)return false;
 const output=root.querySelector('[data-install-command]');if(!output)return false;
 output.textContent=command;
 root.querySelectorAll('[data-block-install-manager]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.blockInstallManager===manager)));
 return true;
}
async function getData(){if(!dataPromise)dataPromise=fetch('./blocks-data.json').then(r=>{if(!r.ok)throw new Error('catalog');return r.json();}).catch(e=>{dataPromise=null;throw e;});return dataPromise;}

export async function renderBlockRoute(target,route,api){
 favorites=readBlockFavorites();
 disposeBlockPreview();view=target;hooks=api;parts=route;currentBlock=null;clearTimeout(timer);const g=++generation;
 if(parts[0]==='guide'){location.replace('/about');return;}
 if(!bound){bind();bound=true;}
 view.innerHTML='<div class="block-loading" role="status">블록 컬렉션을 불러오고 있습니다…</div>';
 try{data=await getData();if(g!==generation||!location.hash.startsWith('#blocks'))return;
  if(!parts[0]||parts[0]==='favorites'||parts[0]==='collection'){
   state.favoritesOnly=parts[0]==='favorites';if(!parts[0]||state.favoritesOnly){state.query='';state.page=1;}
   if(parts[0]==='collection'){
    const next=BLOCK_COLLECTION_NAMES[parts[1]]?parts[1]:'all';
    const category=data.categories.find(c=>c.id===parts[2]&&(next==='all'||c.collection===next))?.id||'all';
    if(state.collection!==next||state.category!==category){state.collection=next;state.category=category;state.page=1;}
   }
   else if(state.collection!=='all'||state.category!=='all'){state.collection='all';state.category='all';state.page=1;}
   if(state.category!=='all'&&!blockCategoryOptions(data,{collection:state.collection}).some(c=>c.id===state.category))state.category='all';
   view.innerHTML=galleryPage();renderCards();
  }else{
   currentBlock=data.blocks.find(b=>b.id===parts[0]);
   if(!currentBlock||!currentBlock.implemented)view.innerHTML=`<section class="empty-state">${icon('search-x')}<h1>블록을 찾을 수 없습니다.</h1><p>주소가 바뀌었거나 현재 제공되지 않는 블록입니다.</p><a class="btn" href="#blocks">전체 블록 보기</a></section>`;
   else{view.innerHTML=detailPage(currentBlock);await renderDetail(currentBlock,g);}
  }
  if(g===generation)hooks.icons();
 }catch(e){if(g===generation&&location.hash.startsWith('#blocks'))view.innerHTML=`<section class="empty-state"><h1>블록을 불러오지 못했습니다.</h1><p>잠시 후 다시 시도해 주세요.</p><button class="btn" data-block-action="retry">다시 불러오기</button></section>`;}
}
function realThumbnail(b){const suffix=context().theme==='dark'?'.dark':'';return `<div class="block-thumbnail" aria-hidden="true"><iframe data-thumbnail="${b.id}" src="./block-thumbnails/${b.id}${suffix}.html?v=${THUMBNAIL_REVISION}" title="${esc(b.title)} 실제 데이터 썸네일" loading="lazy" sandbox="allow-same-origin" tabindex="-1"></iframe><span class="block-thumbnail-caption">실제 샘플 화면</span></div>`;}
let thumbnailObserver;
function fitThumbnails(){thumbnailObserver?.disconnect();thumbnailObserver=new ResizeObserver(entries=>{for(const e of entries)e.target.style.setProperty('--thumbnail-scale',String(e.contentRect.width/1200));});document.querySelectorAll('.block-thumbnail').forEach(el=>{el.style.setProperty('--thumbnail-scale',String(el.clientWidth/1200));thumbnailObserver.observe(el);});}
function galleryPage(){const overview=part=>renderLibraryOverview({kind:'blocks',part,kicker:'블록 스튜디오',title:'블록 스튜디오',subtitle:'설계가 연결되는 곳.',introDescription:'업무 화면 조합을 검색해 블록을 미리보세요.',description:'업무 화면부터 데이터 시각화까지. 직접 실행하고, 7 디멘션으로 읽고, 4계층 토큰으로 연결하세요.',detailsSummary:'블록 구성과 통계 보기',guideHref:'/about',guideLabel:'소개 · 도움말',cardLabel:'THE KLIC SYSTEM',cardIcon:'waypoints',rows:[{value:'01',label:'Primitive',note:'원시 값'},{value:'02',label:'Brand',note:'브랜드 정책'},{value:'03',label:'Semantic',note:'역할과 의미'},{value:'04',label:'Component',note:'블록의 실제 사용 값'}],markers:AXES.map((axis,index)=>({label:String(index+1).padStart(2,'0'),title:axis.label})),markerLabel:'7 DIMENSIONS',links:[{href:'#playground',label:'블록 조합 플레이그라운드'},{href:'#agents',label:'에이전트 설계 가이드'},{href:'#releases',label:'변경 기록'}],stats:[{value:data.stats.entries,label:'블록'},{value:data.stats.implementations,label:'구현 모듈'},{value:data.stats.categories,label:'세부 분류'},{value:'7 × 4',label:'디자인 디멘션과 토큰 계층',href:'#docs/principles'}]});return `<div class="block-page">${overview('intro')}<section class="block-collection" aria-labelledby="block-collection-title"><div class="block-section-heading"><div><h2 id="block-collection-title">${state.favoritesOnly?'즐겨찾는 블록':'화면을 만드는 조합'}</h2><p>분류를 고르고 필요한 블록을 찾아보세요.</p></div><span class="block-result-count" id="block-result-count" role="status"></span></div>
 ${renderBlockCollectionTabs(data,state.collection)}
 <div class="block-filterbar"><button class="btn secondary sm block-favorites-filter" data-block-action="favorites-only" aria-pressed="${state.favoritesOnly}">${icon('star')}즐겨찾기 <span>${favorites.size}</span></button><label class="block-search">${icon('search')}<span class="sr-only">블록 검색</span><input id="block-query" type="search" placeholder="이름, 기능, 원본 ID로 검색…" value="${esc(state.query)}" autocomplete="off"></label><label class="block-filter"><span>분류</span><select id="block-category">${categoryOptions()}</select></label></div>
 <div class="block-gallery" id="block-gallery"></div><div id="block-pagination" class="block-pagination"></div></section>${overview('details')}</div>`;}
function categoryOptions(){return option('all','전체 세부 분류',state.category)+blockCategoryOptions(data,{collection:state.collection}).map(c=>option(c.id,`${c.name} (${c.count}개)`,state.category)).join('');}
function renderCards(){const filtered=filterBlocks(data.blocks,state).filter(b=>!state.favoritesOnly||favorites.has(b.id));const result=paginateBlocks(filtered,state.page,12);state.page=result.page;
 $('#block-result-count').textContent=`${result.total}개 블록`;
 $('#block-gallery').innerHTML=result.items.length?result.items.map(b=>`<article class="block-card"><button class="block-favorite icon-button" data-block-action="favorite" data-value="${b.id}" aria-label="${esc(b.title)} 즐겨찾기" aria-pressed="${favorites.has(b.id)}">${icon('star')}</button><a href="#blocks/${b.id}" class="block-card-link" aria-label="${esc(b.title)} ${status(b)} 열기">${realThumbnail(b)}<div class="block-card-content"><div class="block-card-meta"><span>${esc(b.categoryName)}</span><span class="block-status">${icon('circle-play')}${status(b)}</span></div><h3>${esc(b.title)}${icon('arrow-up-right')}</h3><p>${esc(b.description||b.variantNote||'KLIC 토큰과 설계 규칙에 연결한 인터페이스 예시입니다.')}</p><div class="block-card-foot"><code>${esc(b.id)}</code><span>7 디멘션 · 4계층</span></div></div></a></article>`).join(''):`<div class="empty-state block-empty">${icon('search-x')}<h2>조건에 맞는 블록이 없습니다.</h2><p>검색어나 분류를 바꿔보세요.</p><button class="btn secondary" data-block-action="clear-filters">필터 초기화</button></div>`;
 $('#block-pagination').innerHTML=`<button class="btn secondary sm" data-block-action="page" data-page="${result.page-1}" ${result.page<=1?'disabled':''}>${icon('arrow-left')} 이전</button><span><strong>${result.page}</strong> / ${result.pages}</span><button class="btn secondary sm" data-block-action="page" data-page="${result.page+1}" ${result.page>=result.pages?'disabled':''}>다음 ${icon('arrow-right')}</button>`;fitThumbnails();hooks.icons();}
function detailPage(b){const tab=tabs.some(t=>t[0]===parts[1])?parts[1]:'preview';return `<div class="block-page"><a class="back-link" href="#blocks">${icon('arrow-left')}블록 컬렉션</a><div class="block-detail-heading"><div><div class="eyebrow">${esc(BLOCK_COLLECTION_NAMES[b.collection])} / ${esc(b.categoryName)}</div><h1>${esc(b.title)}</h1><p>${esc(b.description||'KLIC 설계 규칙으로 재구성한 인터페이스 블록입니다.')}</p></div><div class="block-detail-actions"><button class="btn secondary sm" data-block-action="favorite" data-value="${b.id}" aria-pressed="${favorites.has(b.id)}">${icon('star')}즐겨찾기</button><button class="btn secondary sm" data-block-action="share">${icon('link')}링크 복사</button><button class="btn secondary sm" data-block-action="markdown">${icon('file-text')}Markdown</button></div></div><div class="block-detail-meta"><code>${esc(b.id)}</code><span>7 디멘션</span><span>4계층 토큰</span><span>React · 로컬 데모</span></div>
 <div class="content-tabs block-tabs" role="tablist" aria-label="블록 상세 정보">${tabs.map(([id,label,ic])=>`<button class="content-tab" role="tab" id="block-tab-${id}" aria-selected="${id===tab}" aria-controls="block-detail-panel" tabindex="${id===tab?'0':'-1'}" data-block-action="tab" data-value="${id}">${icon(ic)}${label}</button>`).join('')}</div><div id="block-detail-panel" role="tabpanel" aria-labelledby="block-tab-${tab}" tabindex="0"></div><section class="block-detail-usage" aria-labelledby="block-usage-title"><h2 id="block-usage-title">사용 방법</h2><p>${esc(b.description||'KLIC 설계 규칙으로 재구성한 인터페이스 블록입니다.')}</p><p>미리보기에서 샘플을 조작하고, 실제 소스 탭에서 구현 파일을 확인하세요.</p></section>${renderItemDelivery('block',b.id,{locale:document.documentElement.lang})}${blockInstallMarkup(b.id,state.installManager)}<div class="block-detail-footer"><span>${esc(b.description||'KLIC 배색과 토큰을 적용한 로컬 샘플입니다.')}</span><a class="text-link" href="#docs/integrations">통합 문서 보기 ${icon('arrow-right')}</a></div></div>`;}
async function renderDetail(b,g){const panel=$('#block-detail-panel'),tab=parts[1]||'preview';
 if(tab==='axes'){panel.innerHTML=axesPage(b);return;}
 if(tab==='tokens'){panel.innerHTML=tokensPage(b);renderTrace();return;}
 if(tab==='code'){
  if(!b.sourceFile){panel.innerHTML=unavailableBlockPage();return;}
  blockSourceCleanup=mountBlockSourceBrowser(panel,{block:b,isCurrent:()=>g===generation&&location.hash.startsWith('#blocks/'+b.id+'/code'),copy:hooks.copy,download:hooks.download});hooks.icons();return;
 }
 if(!b.implemented){panel.innerHTML=unavailableBlockPage();return;}
 panel.innerHTML=`<section class="preview-workbench block-preview-workbench" aria-label="${esc(b.title)} 실시간 조정"><div class="preview-workbench-head"><span data-preview-readout>Auto · 100%</span><div class="preview-workbench-actions">${previewCustomizeButton('block')}<button class="btn secondary sm" data-block-action="fullscreen">${icon('maximize')}전체화면</button><button class="btn secondary sm" data-block-action="reset">${icon('rotate-ccw')}데모 초기화</button></div></div><div class="preview-workbench-body"><div class="block-runtime-stage" tabindex="0" aria-label="블록 캔버스 · 넓은 화면은 좌우로 스크롤"><div class="block-fullscreen-bar"><strong>${esc(b.title)}</strong><button class="btn secondary sm" data-block-action="fullscreen">${icon('minimize')}전체화면 닫기</button></div><div class="block-runtime-frame" data-preview-canvas><iframe id="block-runtime" title="${esc(b.title)} 실행 미리보기" src="${esc(blockPreviewURL(b.id,context()))}" sandbox="allow-scripts allow-same-origin allow-downloads allow-modals" loading="eager"></iframe></div></div>${previewSettingsMarkup('block',b.id)}</div><div class="block-preview-top"><span id="block-runtime-status" role="status">실행 화면을 불러오는 중…</span><span>독립 뷰포트 · 샘플 데이터</span></div></section>`;
 const dependenciesHost=document.createElement('div');panel.append(dependenciesHost);blockDependenciesCleanup=mountPreviewDependencies(dependenciesHost,{kind:'block',id:b.id,copy:hooks.copy,notify:hooks.notify});
 blockPreview=initPreviewCustomizer(panel.querySelector('.preview-workbench'),{kind:'block',id:b.id,getBase:baseContext,copy:hooks.copy,notify:hooks.notify,onChange:ctx=>$('#block-runtime')?.contentWindow?.postMessage({type:'klic:block-context',...ctx},location.origin)});

 timer=setTimeout(()=>{const el=$('#block-runtime-status');if(el&&el.dataset.ready!=='true'){el.textContent='실행이 지연되고 있습니다. 초기화로 다시 시도할 수 있습니다.';}},20000);
}
function unavailableBlockPage(){return `<div class="empty-state block-unavailable">${icon('search-x')}<h2>블록을 표시할 수 없습니다.</h2><p>현재 선택한 블록의 미리보기를 제공하지 않습니다.<br>7 디멘션의 설계 규칙과 4계층 토큰 계약은 다른 탭에서 확인할 수 있습니다.</p><a class="btn secondary" href="#blocks">전체 블록 보기</a></div>`;}
function axesPage(b){const c=getBlockContract(b);return `<div class="block-spec-intro"><div><h2>7 디멘션으로 읽는 ${esc(b.categoryName)}</h2><p>각 디멘션은 구현이 지켜야 할 규칙입니다. 토큰 연결과 동작 검증은 각각 확인합니다.</p></div><button class="btn secondary sm" data-block-action="export-contract">${icon('download')}명세 JSON</button></div><div class="block-axis-list">${c.axes.map((a,i)=>`<article class="block-axis-row"><span class="block-axis-number">0${i+1}</span><div><h3>${esc(a.label)}</h3><p>${esc(a.policy)}</p><small>${esc(a.evidence)}</small></div><span class="block-policy-tag">적용 규칙</span></article>`).join('')}</div><div class="block-rule-grid">${[['구성과 스크롤 책임',c.composition],['키보드와 포커스',c.keyboard],['반응형 규칙',c.responsive],['상태와 피드백',c.states]].map(([title,items])=>`<section><h3>${title}</h3>${bulletList(items)}</section>`).join('')}</div><section class="block-limit-note"><h3>검증 범위와 남은 확인</h3>${bulletList(c.limits)}<p>관련 요구사항: ${c.requirements.map(esc).join(' · ')}</p></section>`;}
function tokensPage(b){const c=getBlockContract(b),ctx=context();return `<div class="block-spec-intro"><div><h2>값의 출처부터 블록까지</h2><p>블록용으로 연결한 ${c.tokens.length}개 토큰 역할. 선택한 모드와 브랜드 규격으로 해석합니다.</p></div><button class="btn secondary sm" data-block-action="export-contract">${icon('download')}명세 JSON</button></div><div class="block-token-controls">${brandSelectorMarkup(ctx)}<a class="text-link" href="#settings/brand">브랜드 아이덴티티</a><span class="block-theme-description">${ctx.theme==='dark'?'Dark':'Light'} · 상단 테마 버튼으로 전환</span></div><div class="block-token-layout"><div class="block-token-menu" role="group" aria-label="블록 토큰 선택">${c.tokens.map(t=>`<button data-block-action="token" data-value="${t.path}" aria-pressed="${state.token===t.path}"><span>${esc(t.label)}</span><code>${t.path.replace('klic.component.block.','')}</code></button>`).join('')}</div><div class="block-token-trace" id="block-token-trace"></div></div>`;}
function renderTrace(){const el=$('#block-token-trace');if(!el||!currentBlock)return;const ctx=context(),tokens=createTokens(ctx.brand,ctx.theme,ctx),values=resolveTokens(tokens),chain=traceToken(tokens,state.token).reverse();el.innerHTML=`<div class="block-trace-heading"><span class="eyebrow">RESOLVED VALUE</span><strong>${formatValue(values[state.token])}</strong><p>${esc(state.token)}</p></div>${chain.map((t,i)=>`<div class="block-trace-step"><span>0${i+1} / ${t.path.split('.')[1].toUpperCase()}</span><code>${esc(t.path)}</code><b>${esc(formatValue(values[t.path]))}</b><small>${typeof t.$value==='string'?esc(t.$value):'원시 값 · 값을 소유하는 계층'}</small></div>`).join('')}<p class="block-trace-note">Primitive → Brand → Semantic → Component. 배치 순서·포커스 이동·스크롤 책임은 7 디멘션의 동작 규칙으로 관리합니다.</p>`;document.querySelectorAll('[data-block-action="token"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.value===state.token)));}
export function syncBlockContext(c){document.querySelectorAll('[data-thumbnail]').forEach(el=>{const src=`./block-thumbnails/${el.dataset.thumbnail}${c.theme==='dark'?'.dark':''}.html?v=${THUMBNAIL_REVISION}`;if(el.getAttribute('src')!==src)el.src=src;});if(blockPreview)blockPreview.sync();else $('#block-runtime')?.contentWindow?.postMessage({type:'klic:block-context',...normalizeBlockContext(c)},location.origin);document.querySelectorAll('[data-brand-profile]').forEach(el=>el.value=c.brandProfile||'core');if($('#block-token-trace')){renderTrace();$('.block-theme-description').textContent=`${context().theme==='dark'?'Dark':'Light'} · 설정 테마`;}}

let expandedStage,expandedTrigger,inertBefore=[];
function closeExpanded(){if(!expandedStage)return;expandedStage.classList.remove('block-expanded');expandedStage.removeAttribute('role');expandedStage.removeAttribute('aria-modal');expandedStage.removeAttribute('aria-label');for(const [el,value] of inertBefore)if(el.isConnected)el.inert=value;inertBefore=[];document.body.classList.remove('block-expanded-open');expandedStage=null;if(expandedTrigger?.isConnected)expandedTrigger.focus();}
function toggleExpanded(){if(expandedStage){closeExpanded();return;}const stage=$('.block-runtime-stage');if(!stage)return;expandedStage=stage;expandedTrigger=document.activeElement;for(let node=stage;node.parentElement;node=node.parentElement){for(const sibling of node.parentElement.children){if(sibling!==node){inertBefore.push([sibling,sibling.inert]);sibling.inert=true;}}}stage.classList.add('block-expanded');stage.setAttribute('role','dialog');stage.setAttribute('aria-modal','true');stage.setAttribute('aria-label',currentBlock.title+' 전체화면');document.body.classList.add('block-expanded-open');$('.block-fullscreen-bar button',stage)?.focus();}
window.addEventListener('hashchange',closeExpanded);
document.addEventListener('keydown',e=>{if(!expandedStage)return;if(e.key==='Escape'){e.preventDefault();closeExpanded();}if(e.key==='Tab'){const button=$('.block-fullscreen-bar button',expandedStage),frame=$('#block-runtime');if(e.shiftKey&&document.activeElement===button){e.preventDefault();frame?.focus();}}});
function refreshContext(){syncBlockContext(context());}
function exportContract(){if(!currentBlock)return;const ctx=context(),tokens=createTokens(ctx.brand,ctx.theme,ctx),values=resolveTokens(tokens),contract=getBlockContract(currentBlock);hooks.download(JSON.stringify({block:currentBlock,context:ctx,contract,tokens:contract.tokens.map(t=>({...t,value:values[t.path],chain:traceToken(tokens,t.path).reverse()})),source:data.source},null,2),`klic-${currentBlock.id}-contract.json`);}
function bind(){
 function refreshFavorites(){
  favorites=readBlockFavorites();
  document.querySelectorAll('[data-block-action="favorite"]').forEach(button=>button.setAttribute('aria-pressed',String(favorites.has(button.dataset.value))));
  const filter=$('.block-favorites-filter');if(filter)filter.innerHTML=icon('star')+'즐겨찾기 <span>'+favorites.size+'</span>';
  if(state.favoritesOnly&&$('#block-gallery'))renderCards();hooks?.icons();
 }
window.addEventListener(FAVORITES_EVENT,refreshFavorites);window.addEventListener('storage',event=>{if(event.key===FAVORITES_STORAGE_KEY||event.key===null)refreshFavorites();});
 document.addEventListener('click',e=>{const el=e.target.closest('[data-block-action]');if(!el||!location.hash.startsWith('#blocks'))return;const a=el.dataset.blockAction;
 if(a==='favorite'){toggleBlockFavorite(el.dataset.value);}
 else if(a==='favorites-only'){location.hash=state.favoritesOnly?'#blocks':'#blocks/favorites';}
 else if(a==='share')hooks.copy(blockShareURL(currentBlock.id),'이 블록의 링크를 복사했습니다.');
 else if(a==='markdown')hooks.copy(blockMarkdown(currentBlock),'블록 정보를 Markdown으로 복사했습니다.');
 else if(a==='install-manager'){if(updateBlockInstallUI(el.closest('[data-block-install]'),currentBlock?.id,el.dataset.blockInstallManager))state.installManager=el.dataset.blockInstallManager;}
 else if(a==='install-copy'){const command=blockInstallCommand(currentBlock?.id,state.installManager);if(command)hooks.copy(command,'설치 명령을 복사했습니다.');}
 else if(a==='fullscreen')toggleExpanded();
 else if(a==='retry')renderBlockRoute(view,parts,hooks);
 else if(a==='collection'){state.category='all';state.page=1;location.hash=el.dataset.value==='all'?'blocks':'blocks/collection/'+el.dataset.value;}
 else if(a==='clear-filters'){Object.assign(state,{favoritesOnly:false,query:'',category:'all',page:1});$('#block-query').value='';$('#block-category').innerHTML=categoryOptions();$('#block-category').value='all';$('.block-favorites-filter')?.setAttribute('aria-pressed','false');location.hash=state.collection==='all'?'blocks':'blocks/collection/'+state.collection;renderCards();}
 else if(a==='page'){state.page=Number(el.dataset.page);renderCards();$('#block-collection-title').scrollIntoView({block:'start'});$('#block-gallery a')?.focus({preventScroll:true});}
 else if(a==='tab')location.hash=`blocks/${currentBlock.id}/${el.dataset.value}`;
 else if(a==='reset'){$('#block-runtime')?.contentWindow?.postMessage({type:'klic:block-reset'},location.origin);hooks.notify('데모 데이터만 초기화했습니다. 프리뷰 조정값은 유지됩니다.');}
 else if(a==='token'){state.token=el.dataset.value;renderTrace();}
 else if(a==='export-contract')exportContract();
 });
 document.addEventListener('input',e=>{if(e.target.id==='block-query'){state.query=e.target.value;state.page=1;renderCards();}});
 document.addEventListener('change',e=>{const el=e.target;if(el.id==='block-category'){location.hash='blocks/collection/'+state.collection+(el.value==='all'?'':'/'+el.value);}else if(el.id==='block-font'){state.font=el.value;hooks.setPreferences?.({font:el.value});refreshContext();}else if(el.id==='block-density'){state.density=el.value;hooks.setPreferences?.({density:el.value});refreshContext();}});
 window.addEventListener('message',e=>{const frame=$('#block-runtime');if(e.origin!==location.origin||e.source!==frame?.contentWindow||!e.data||typeof e.data!=='object')return;const el=$('#block-runtime-status');if(!el)return;if(e.data.type==='klic:block-exit-expanded'){closeExpanded();return;}if(e.data.type==='klic:block-preference'&&['compact','normal','relaxed'].includes(e.data.density)){blockPreview?.patch({density:e.data.density});return;}if(e.data.type==='klic:block-ready'&&e.data.id===currentBlock?.id){clearTimeout(timer);el.dataset.ready='true';el.textContent='연결됨';blockPreview?.refreshPublishing?.();refreshContext();}else if(e.data.type==='klic:block-error'){clearTimeout(timer);el.dataset.ready='false';el.textContent='실행 중 오류가 발생했습니다. 미리보기 안에서 다시 시도해 주세요.';}});
}
