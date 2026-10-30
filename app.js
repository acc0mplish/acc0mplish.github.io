import {renderItemDelivery,initItemDelivery} from './item-delivery.mjs';
import {isDesignDocs,renderDesignDocs} from './design-docs.mjs';
import {initAffectInteractions} from './affect-interactions.mjs';
import {renderComponentFamily,initComponentFamilies,componentVariantMetadata} from './component-families.mjs';
import {initVariantInteractions} from './component-variants-interactions.mjs';
import {renderDesignContract} from './design-contract.mjs';
import {SITE_ORIGIN} from './site-metadata.mjs';
import {renderMotionPage,initMotionPage} from './motion.mjs';
import {initDocumentLinks,updateDocumentLinks} from './document-links.mjs';
import {syncThemeControls} from './public-theme.mjs';
import {sharedNavigationTarget} from './discovery-content.mjs';
import {readComponentFavorites,toggleComponentFavorite,COMPONENT_FAVORITES_EVENT,COMPONENT_FAVORITES_STORAGE_KEY} from './component-favorites.mjs';
import {mountPreviewDependencies} from './preview-dependencies.mjs';
import {initI18n} from './i18n.mjs';
import {renderDesignGuidance} from './design-guidance.mjs';
import {libraryScopeText} from './library-scope.mjs';
import {renderFrameworkGuide} from './framework-guide.mjs';
import {mountAgentWorkbench,renderUnifiedSearch} from './agent-workbench.mjs';
import {renderProductPage} from './product-pages.mjs';
import {renderTokenGroups,selectTokenGraph,tokenInventoryStats,tokenGroups} from './token-explorer.mjs';
import {COMPONENT_GROUPS} from './library-navigation.mjs';
import {structureIntro,structureDetail,groupDescription,componentStructure} from './component-structure.mjs';
import {renderShowcase,initShowcase} from './showcase.mjs';
import {INTEGRATION_DOCS,renderIntegrationDocs,initIntegrationDocs} from './integration-docs.mjs';
import {registerKlicWebMCP} from './integrations/webmcp.mjs';
import {brandSelectorMarkup,brandProfileLabel} from './brand-profiles.mjs';
import {updateWorkspaceBreadcrumbs,initWorkspaceHelp} from './workspace-navigation.mjs';
import {renderResizeLab,initResizeLab} from './resize-lab.mjs';
import {initPreviewCustomizer,previewSettingsMarkup,previewCustomizeButton,applyPreviewScope} from './preview-customizer.mjs';
import {initLibraryNavigation} from './library-navigation.mjs';
import {initComponentInteractions} from './component-interactions.mjs';
import {renderAvatar} from './avatars.mjs';
import {catalog,categories,specimen,componentCode,icon,escapeHTML as esc} from './catalog.js';
import {createTokens,resolveTokens,compileThemeCSS,formatValue,nestedTokens,traceToken,pageTitleSize,searchCatalog} from './tokens.mjs';
import {renderFontRoute} from './fonts.js';
import {renderBlockRoute,syncBlockContext,disposeBlockPreview} from './blocks.js';
import {initCustomization,currentAppearance,setPreferences,renderSettingsPage} from './customize.mjs';
import {renderComponentGuide,getComponentGuideExample,hydrateComponentGuidePreviews} from './component-guides.mjs';

const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
const state={category:'all',componentGroup:'all',query:'',favoritesOnly:false,brand:'a',tokenLayer:'component',tokenScope:'used',tokenQuery:'',tokenPath:'klic.component.button.size.default.height',labWidth:768,button:{variant:'default',size:'default',state:'default',label:'시작하기'},theme:document.documentElement.dataset.theme};
const view=$('#view'), searchDialog=$('#search-dialog'), demoDialog=$('#demo-dialog');
const serverDocumentTitle=document.title;
let toastTimer,lastSearchTrigger,lastDemoTrigger,searchIndex=-1,currentTokens,currentResolved,route,renderGeneration=0;
let galleryResetFocus=false;
let componentDependenciesCleanup=null;
let componentPreview=null,labCleanup=null,integrationCleanup=null,showcaseCleanup=null,motionCleanup=null;
const componentFormSearch=new Map(catalog.map(c=>[c.id,componentVariantMetadata(c).map(v=>[v.id,v.name,v.description].join(' ')).join(' ').toLocaleLowerCase()]));
let componentFavorites=readComponentFavorites();
function componentFavoriteButton(c,compact=false){return `<button type="button" class="${compact?'icon-button':'btn secondary sm'} component-favorite" data-action="component-favorite" data-component-favorite="${c.id}" aria-label="${esc(c.name)} 즐겨찾기" aria-pressed="${componentFavorites.has(c.id)}">${icon('star')}${compact?'':'즐겨찾기'}</button>`;}
function refreshComponentFavorites(){componentFavorites=readComponentFavorites();document.querySelectorAll('[data-component-favorite-count]').forEach(el=>el.textContent=String(componentFavorites.size));if(state.favoritesOnly&&document.querySelector('#gallery'))renderGallery();document.querySelectorAll('[data-component-favorite]').forEach(button=>button.setAttribute('aria-pressed',String(componentFavorites.has(button.dataset.componentFavorite))));}
window.addEventListener(COMPONENT_FAVORITES_EVENT,refreshComponentFavorites);
window.addEventListener('storage',event=>{if(event.key===COMPONENT_FAVORITES_STORAGE_KEY||event.key===null)refreshComponentFavorites();});
const libraryNavigation=initLibraryNavigation(document.querySelector('#library-browser'),{components:catalog,categories,icons});
function icons(root=document){if(window.lucide)window.lucide.createIcons({root,attrs:{'aria-hidden':'true','focusable':'false'}});}
function applyTheme(){
  document.documentElement.dataset.theme=state.theme;
  syncThemeControls();
  currentTokens=createTokens(state.brand,state.theme,currentAppearance());currentResolved=resolveTokens(currentTokens);
  let style=$('#resolved-tokens');if(!style){style=document.createElement('style');style.id='resolved-tokens';document.head.append(style);}
  style.textContent=compileThemeCSS(state.brand,currentAppearance());
  const btn=$('.theme-button');btn.innerHTML=icon(state.theme==='light'?'sun':'moon');btn.setAttribute('aria-label',state.theme==='light'?'다크 모드로 전환':'라이트 모드로 전환');
  try{localStorage.setItem('klic-theme',state.theme);}catch{}
  syncBlockContext({...currentAppearance(),theme:state.theme,brand:state.brand});
  componentPreview?.sync();
  icons();
}
function toast(text){const t=$('#toast');clearTimeout(toastTimer);t.innerHTML=icon('circle-check')+`<span>${esc(text)}</span>`;t.classList.add('visible');icons();toastTimer=setTimeout(()=>t.classList.remove('visible'),3400);}
async function copy(text,message='클립보드에 복사했어요.'){
  try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(text);else{const el=document.createElement('textarea');el.value=text;el.style.cssText='position:fixed;left:-9999px';document.body.append(el);el.select();const ok=document.execCommand('copy');el.remove();if(!ok)throw new Error('copy');}toast(message);return true;}catch{openTextDialog('직접 복사하기',text);return false;}
}
initItemDelivery(document,{copy});
function download(text,name,type='application/json'){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function setMobileNav(open){const mobile=document.documentElement.dataset.compact==='true';$('#sidebar').classList.toggle('open',open);$('#sidebar').inert=mobile&&!open;$('.app-shell').inert=mobile&&open;if(mobile&&open){$('#sidebar').setAttribute('role','dialog');$('#sidebar').setAttribute('aria-modal','true');}else{$('#sidebar').removeAttribute('role');$('#sidebar').removeAttribute('aria-modal');}$('#nav-backdrop').hidden=!open;$('.mobile-menu').setAttribute('aria-expanded',String(open));syncScrollLock();if(open)$('.mobile-nav-close').focus();else if(document.activeElement?.closest('#sidebar')&&mobile)$('.mobile-menu').focus();}
function syncScrollLock(){document.body.style.overflow=demoDialog.open||searchDialog.open||$('#help-dialog')?.open||$('#sidebar').classList.contains('open')?'hidden':'';}
function updateNav(){
  const group=route[0]==='component'?'components':route[0];
  $$('.nav-item[data-nav]').forEach(a=>{const active=a.dataset.nav===group;a.classList.toggle('active',active);active?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current');});
  $('#font-nav').hidden=group!=='fonts';
  libraryNavigation.sync(route);
  const label={playground:'조합 플레이그라운드',agents:'에이전트 가이드',releases:'변경 기록',home:'Design that connects',components:'컴포넌트',component:'컴포넌트',tokens:'디자인 토큰',blocks:'블록 스튜디오',motion:'모션',fonts:'폰트 라이브러리',docs:'가이드',lab:'리사이즈 실험실',settings:'설정'}[route[0]]||'라이브러리';
  if(location.pathname.startsWith('/share/')||route[0]==='home')document.title=serverDocumentTitle;else document.title=`${route[0]==='component'?catalog.find(c=>c.id===route[1])?.name??label:label} — KLIC`;
  updateWorkspaceBreadcrumbs($('#breadcrumb'),route,{components:catalog,categories,tokenLayer:state.tokenLayer});
}
async function render(){
 componentDependenciesCleanup?.();componentDependenciesCleanup=null;
  componentPreview?.destroy();componentPreview=null;disposeBlockPreview();labCleanup?.();labCleanup=null;integrationCleanup?.();integrationCleanup=null;
 showcaseCleanup?.();showcaseCleanup=null;motionCleanup?.();motionCleanup=null;
  const generation=++renderGeneration;
  const restoreTabFocus=document.activeElement?.classList.contains('content-tab');
  const restoreCategoryFocus=document.activeElement?.matches('.catalog-toolbar .filter-tab');
  const restoreGroupFocus=document.activeElement?.id==='component-group';
  const target=sharedNavigationTarget(location.pathname,location.hash,new URLSearchParams(location.search).get('lang')==='en'?'en':'ko');if(target){location.replace(target);return;}
  route=(location.hash.slice(1)||'home').split('/');
  const restoreGalleryFocus=galleryResetFocus;galleryResetFocus=false;
  document.body.dataset.page=route[0];
  if(route[0]==='home'){view.innerHTML=renderShowcase();syncThemeControls();showcaseCleanup=initShowcase(view,{copy,notify:toast});}
  else if(route[0]==='components'){state.favoritesOnly=route[1]==='favorites';if(!route[1]||state.favoritesOnly)state.query='';state.category=categories[route[1]]?route[1]:'all';state.componentGroup=COMPONENT_GROUPS.some(g=>g[0]===route[2])?route[2]:'all';view.innerHTML=galleryPage();renderGallery();}
  else if(route[0]==='component'){const c=catalog.find(c=>c.id===route[1]);view.innerHTML=c?detailPage(c):notFound();if(c)renderDetail(c);}
  else if(route[0]==='motion'){const locale=document.documentElement.dataset.locale==='en'?'en':'ko';view.innerHTML=renderMotionPage(route.slice(1),{locale});motionCleanup=initMotionPage(view,{copy,icons,locale});}
  else if(['playground','agents','releases'].includes(route[0])){await renderProductPage(view,route[0],{copy,icons,notify:toast});if(generation!==renderGeneration)return;}
  else if(route[0]==='tokens'){view.innerHTML=tokenPage();renderTokenTable();renderTokenTrace();}
  else if(route[0]==='lab'){view.innerHTML=renderResizeLab(route.slice(1));labCleanup=initResizeLab(view,{copy,notify:toast});}
  else if(route[0]==='fonts'){await renderFontRoute(view,route.slice(1),{icons,notify:toast,copy,download});if(generation!==renderGeneration)return;}
  else if(route[0]==='blocks'){await renderBlockRoute(view,route.slice(1),{icons,notify:toast,copy,download,getContext:()=>({...currentAppearance(),theme:state.theme,brand:state.brand}),setPreferences,setBrand:brand=>{state.brand=brand==='b'?'b':'a';applyTheme();}});if(generation!==renderGeneration)return;}
  else if(route[0]==='settings')view.innerHTML=renderSettingsPage(route[1]||'theme');
  else if(route[0]==='docs'){if(isDesignDocs(route[1])){view.innerHTML=renderDesignDocs(route[1]);}else if(INTEGRATION_DOCS[route[1]]){view.innerHTML=renderIntegrationDocs(route[1]);integrationCleanup=initIntegrationDocs(view,{copy,notify:toast});}else view.innerHTML=docsPage(route[1]||'overview');}
  else view.innerHTML=notFound();
  if((route[0]==='component'&&catalog.some(c=>c.id===route[1]))||(route[0]==='blocks'&&route[1]&&!['guide','collection'].includes(route[1]))){const agentRoot=document.createElement('div');view.append(agentRoot);mountAgentWorkbench(agentRoot,route[0]==='component'?'component':'block',route[1],{copy,icons});}
  updateDocumentLinks(document);updateNav();icons();setMobileNav(false);window.scrollTo({top:0,behavior:'instant'});if(restoreTabFocus)$('.content-tab[aria-selected=true]')?.focus();if(route[0]==='components'){if(restoreGalleryFocus)$('#family-search')?.focus();else if(restoreCategoryFocus)$('.catalog-toolbar .filter-tab[aria-current=true]')?.focus();else if(restoreGroupFocus)$('#component-group')?.focus();}window.dispatchEvent(new CustomEvent('klic:route-rendered',{detail:{route:location.hash}}));
}
function galleryPage(){return `
  <section aria-labelledby="collection-title"><div class="section-header"><div><div class="section-title"><h1 id="collection-title">${state.favoritesOnly?'즐겨찾는 컴포넌트':state.category==='all'?'모든 컴포넌트':'컴포넌트 컬렉션'}</h1><span class="count-tag" id="catalog-count">${catalog.length}</span></div><p>${catalog.length}개 컴포넌트마다 기본형과 추가형 4개를 함께 비교하세요. 형태별 코드와 동작 가이드로 이어집니다.</p></div><span class="eyebrow" style="font-size:8px;letter-spacing:.7px">LIVE PREVIEWS</span></div>
  <nav class="motion-view-tabs library-favorites-view" aria-label="컴포넌트 보기"><a href="#components" ${!state.favoritesOnly?'aria-current="page"':''}>전체 컴포넌트</a><a href="#components/favorites" ${state.favoritesOnly?'aria-current="page"':''}>즐겨찾기 <span data-component-favorite-count>${componentFavorites.size}</span></a></nav><div class="catalog-toolbar"><label class="catalog-search cf-search">${icon('search')}<span class="sr-only">컴포넌트·형태 검색</span><input id="family-search" type="search" value="${esc(state.query)}" placeholder="컴포넌트·형태 검색…" aria-describedby="structure-result"></label><div class="filter-tabs" role="group" aria-label="컴포넌트 분류">${Object.entries(categories).map(([id,label])=>`<a class="filter-tab ${state.category===id?'active':''}" href="#components/${id}" ${state.category===id?'aria-current="true"':''}>${label}</a>`).join('')}</div></div>
  <div class="structure-filter"><label for="component-group">세부 용도</label><select id="component-group" class="demo-select">${[["all","모든 용도"],...COMPONENT_GROUPS].map(([id,label])=>`<option value="${id}" ${state.componentGroup===id?"selected":""}>${label}</option>`).join('')}</select><span id="structure-result" role="status" aria-live="polite"></span></div><p class="catalog-reference-note"><strong>${catalog.length} COMPONENT TYPES · ${catalog.length*5} FORMS</strong><span>기능 범위 참고</span><a href="https://ui.shadcn.com/docs/components" target="_blank" rel="noopener">shadcn/ui ↗</a><a href="https://ant.design/components/overview/" target="_blank" rel="noopener">Ant Design ↗</a><span>KLIC 독립 구현</span><a href="./component-library-100.md" target="_blank" rel="noopener">전체 목록·구현 범위 ↗</a></p><div class="cf-explainer"><div><strong>한 컴포넌트, 다섯 가지 쓰임.</strong><p>색상만 바꾸지 않고 구성과 사용 목적이 다른 형태를 모았습니다. 공개 MIT 패턴을 KLIC의 테마·토큰으로 적용했습니다.</p></div><a href="./licenses/component-variants/README.md" target="_blank" rel="noopener">출처 · 라이선스 ↗</a></div><div class="structured-gallery" id="gallery"></div><div class="gallery-end">MADE TO BE YOURS</div></section>
  <div class="eyebrow">A considered collection</div>
  <section class="intro"><h2>작은 요소로,<br><span>더 좋은 인터페이스.</span></h2><div class="intro-description">일관된 설계 위에 자유로운 가능성을 더하세요.<br>직접 만져보고, 이해하고, 만들어가는 KLIC 라이브러리.<br><a class="text-link" href="#docs/principles">우리의 디자인 원칙 ${icon('arrow-up-right')}</a></div></section>
  <section class="showcase" aria-label="라이브러리 소개"><div class="featured-preview dot-surface"><span class="canvas-label">${icon('mouse-pointer-2')} DESIGNED TO WORK TOGETHER</span><a class="icon-button canvas-expand" href="#component/input" aria-label="입력 컴포넌트 자세히 보기">${icon('arrow-up-right')}</a><form class="featured-form" id="hero-form"><span class="featured-icon-tile">${icon('component')}</span><div class="featured-form-inner"><div class="featured-form-top"><strong>다음 아이디어의 시작</strong><span><span class="tiny-dot"></span>Let's build</span></div><div class="featured-form-input"><label for="hero-project" class="sr-only">새 프로젝트 이름</label><input id="hero-project" class="demo-input" placeholder="어떤 것을 만들고 싶나요?" required maxlength="60"><button class="btn" type="submit" aria-label="프로젝트 아이디어 저장">${icon('arrow-right')}</button></div><div class="featured-caption"><span class="avatar-stack">${['김하늘','이지원','박선준'].map(renderAvatar).join('')}</span><span>작은 아이디어가 멋진 제품으로.</span></div></div></form><div class="feature-footnote"><span>COMPONENTS, IN HARMONY.</span><span>${icon('mouse-pointer-2')} 직접 사용해보세요</span></div></div>
  <a class="architecture-teaser" href="#tokens"><div><div class="eyebrow">THE FOUNDATION</div><h2>하나의 언어.<br>흔들림 없는 연결.</h2><p>작은 값에서 제품의 경험까지.<br>네 개의 계층으로 설계를 연결합니다.</p></div>${icon('layers-3','teaser-icon')}<div><div class="layer-pills"><span class="layer-pill">Primitive</span>${icon('chevron-right')}<span class="layer-pill">Brand</span>${icon('chevron-right')}<span class="layer-pill">Semantic</span>${icon('chevron-right')}<span class="layer-pill">Component</span></div><span class="text-link">디자인 토큰 탐색하기 ${icon('arrow-up-right')}</span></div></a></section>
  ${structureIntro()}
  <section class="bottom-callout"><div class="bottom-callout-icon">${icon('flask-conical')}<div><h3>폭이 달라져도, 좋은 경험은 그대로.</h3><p>컨테이너 폭을 바꾸며 글자와 레이아웃의 변화를 직접 확인하세요.</p></div></div><a class="text-link" href="#lab">실험실 열기 ${icon('arrow-right')}</a></section>`;}
function renderGallery(){
 const matching=new Set(searchCatalog(catalog,state.query).map(c=>c.id)),query=state.query.trim().toLocaleLowerCase();
 const items=catalog.filter(c=>!state.favoritesOnly||componentFavorites.has(c.id)).filter(c=>matching.has(c.id)||componentFormSearch.get(c.id).includes(query)).filter(c=>(state.category==='all'||c.category===state.category)&&(state.componentGroup==='all'||componentStructure(c.id).group.id===state.componentGroup));
 $('#catalog-count').textContent=String(items.length);
 const card=c=>renderComponentFamily(c,'gallery-'+c.id,{actions:componentFavoriteButton(c,true)});
 $('#structure-result').textContent=items.length+'개 컴포넌트 · '+(items.length*5)+'개 형태';
 $('#gallery').innerHTML=items.length?COMPONENT_GROUPS.map(([id,label])=>{const group=items.filter(c=>componentStructure(c.id).group.id===id);return group.length?`<section class="structure-group" aria-labelledby="group-${id}"><header><div><h3 id="group-${id}">${label} <span>${group.length}</span></h3><p>${groupDescription[id]}</p></div><a href="#components/all/${id}">이 분류만 보기 ↗</a></header><div class="cf-collection">${group.map(card).join('')}</div></section>`:'';}).join(''):`<div class="empty-state">${icon('search-x')}<h2>일치하는 컴포넌트가 없어요.</h2><p>검색어나 분류를 바꿔 다시 찾아보세요.</p><button class="btn secondary sm" data-action="reset-search">검색·분류 초기화</button></div>`;
 icons();
}
const tabItems=[['preview','미리보기','eye'],['examples','사용 예제','panels-top-left'],['api','API · 동작','code-2'],['code','기본 코드','code-2'],['spec','설계 명세','list-checks']];
function detailPage(c){const tab=tabItems.some(([id])=>id===route[2])?route[2]:'preview';return `<a class="back-link" href="#components/${state.category}">${icon('arrow-left')}컴포넌트 컬렉션</a><div class="detail-heading"><div><div class="eyebrow" style="margin-bottom:13px">${categories[c.category]} / ${c.name}</div><h1>${c.name}</h1><p>${c.description}</p></div><div class="component-detail-actions">${componentFavoriteButton(c)}<span class="badge outline">HTML 데모</span></div></div>${renderItemDelivery('component',c.id,{locale:document.documentElement.lang})}<div class="detail-layout"><div class="detail-main"><div class="content-tabs" role="tablist" aria-label="${c.name} 문서 보기">${tabItems.map(([id,label,ic])=>`<button class="content-tab" role="tab" aria-selected="${id===tab}" aria-controls="detail-panel" id="detail-tab-${id}" tabindex="${id===tab?'0':'-1'}" data-action="detail-tab" data-tab="${id}">${icon(ic)}${label}</button>`).join('')}</div><div id="detail-panel" role="tabpanel" tabindex="0" aria-labelledby="detail-tab-${tab}"></div>${renderComponentGuide(c.id,'overview')}${structureDetail(c.id)}<section class="doc-section detail-contract"><h2>동작 계약</h2><p>${c.rule}</p></section><section class="doc-section"><h2>같은 언어로 연결되는 설계</h2><p>이 컴포넌트의 값은 아래 KLIC 토큰으로 연결됩니다. 토큰을 선택해 원시 값까지의 참조 관계를 확인하세요.</p><div class="doc-download" style="margin-top:14px"><span class="badge">TOKEN</span><a class="text-link" href="#tokens" data-token-link="${c.token}" style="overflow-wrap:anywhere;min-width:0;display:block;font:10px var(--klic-ui-mono)">${esc(c.token)}</a>${icon('arrow-up-right')}</div></section></div><aside class="detail-aside"><p class="aside-label">ON THIS PAGE</p><a class="aside-link" href="#component/${c.id}">${icon('eye')}미리보기</a><a class="aside-link" href="#component/${c.id}/examples">${icon('panels-top-left')}사용 예제</a><a class="aside-link" href="#component/${c.id}/api">${icon('code-2')}API · 동작</a><a class="aside-link" href="#component/${c.id}/spec">${icon('list-checks')}설계 명세</a><div class="aside-meta"><dl><dt>구현</dt><dd>Native HTML</dd><dt>토큰 프로필</dt><dd>${brandProfileLabel(currentAppearance())}</dd><dt>명세 기준</dt><dd>PRD v1.1</dd><dt>관련 요구사항</dt><dd>${c.req}</dd></dl></div><p class="aside-note">직접 작동하는 사이트 예제입니다. ReUI 설치본이나 제품용 패키지의 검증 완료를 의미하지 않습니다.</p></aside></div>`;}
function renderDetail(c){
 if(route[2]==='examples'){ $('#detail-panel').innerHTML=renderComponentGuide(c.id,'examples');hydrateComponentGuidePreviews($('#detail-panel'));icons();return; }
 if(route[2]==='api'){ $('#detail-panel').innerHTML=renderComponentGuide(c.id,'api')+renderComponentGuide(c.id,'behavior');icons();return; }
 const tab=route[2]||'preview';const panel=$('#detail-panel');
 if(tab==='code'){panel.innerHTML=`<div class="code-panel"><div class="code-panel-header"><span>${c.id}.html</span><button class="btn secondary sm" data-action="copy-code" data-id="${c.id}">${icon('copy')}복사</button></div><pre><code>${esc(componentCode(c))}</code></pre></div><div class="info-note">${icon('info')}<span>HTML 구조와 토큰 연결을 보여주는 예제입니다. 전체 스타일과 동작은 이 사이트의 <a class="text-link" href="./component-expansion.mjs" target="_blank" rel="noopener">확장 구조</a> · <a class="text-link" href="./component-interactions.mjs" target="_blank" rel="noopener">확장 동작</a> · <a class="text-link" href="./component-expansion.css" target="_blank" rel="noopener">확장 스타일</a> · <a class="text-link" href="./styles.css" target="_blank" rel="noopener">styles.css</a> · <a class="text-link" href="./brand.css" target="_blank" rel="noopener">brand.css</a> · <a class="text-link" href="./app.js" target="_blank" rel="noopener">app.js</a>를 함께 확인하세요.</span></div>`;}
 else if(tab==='spec'){panel.innerHTML=renderComponentGuide(c.id,'spec')+`<section class="doc-section" style="margin-top:3px"><h2>디자인 디멘션</h2><div class="table-scroll spaced"><table class="spec-table"><thead><tr><th>디자인 디멘션</th><th>이 데모의 적용</th></tr></thead><tbody>${axisRows(c).map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</tbody></table></div><h3>출처와 검증 범위</h3><p>${c.source||'구조·상태 계약: 첨부 PRD / 시각 스타일과 native 구현: 사이트 신규 결정'}. 요구사항: ${c.req}.</p><div class="info-note">${icon('info')}<span>이 문서는 구현 의도를 설명합니다. PRD의 전체 수용시험, 실제 IME·스크린리더·모바일 기기 검증은 별도 검증 대상입니다.</span></div></section>`;}
 else{panel.innerHTML=`<section class="preview-workbench" aria-label="${c.name} 실시간 조정"><div class="preview-workbench-head"><span data-preview-readout>Auto · 100%</span><div class="preview-workbench-actions">${previewCustomizeButton('component')}<button class="btn secondary sm" data-action="reset-preview">${icon('rotate-ccw')}데모 초기화</button></div></div><div class="preview-workbench-body"><div class="preview-canvas-viewport" tabindex="0" aria-label="컴포넌트 캔버스 · 넓은 화면은 좌우로 스크롤"><div class="preview-canvas" data-preview-canvas><div class="preview-scope component-comparison-scope" data-preview-scope>${renderComponentFamily(c,'detail-forms-'+c.id,{detail:true})}</div></div></div>${previewSettingsMarkup('component')}</div>${c.id==='button'?`<div class="detail-controls"><div class="control-group"><label for="variant-control">Variant</label><select id="variant-control" data-button-control="variant">${['default','secondary','outline','ghost','danger'].map(v=>`<option ${state.button.variant===v?'selected':''}>${v}</option>`).join('')}</select></div><div class="control-group"><label for="size-control">Size</label><select id="size-control" data-button-control="size">${['default','sm','lg'].map(v=>`<option ${state.button.size===v?'selected':''}>${v}</option>`).join('')}</select></div><div class="control-group"><label for="state-control">State</label><select id="state-control" data-button-control="state">${['default','disabled','busy'].map(v=>`<option ${state.button.state===v?'selected':''}>${v}</option>`).join('')}</select></div><div class="control-group flex"><label for="label-control">Label</label><input id="label-control" data-button-control="label" value="${esc(state.button.label)}" maxlength="120"></div></div>`:''}</section>`;
 const dependenciesHost=document.createElement('div');panel.append(dependenciesHost);componentDependenciesCleanup=mountPreviewDependencies(dependenciesHost,{kind:'component',id:c.id,copy,notify:toast});
 componentPreview?.destroy();componentPreview=initPreviewCustomizer(panel.querySelector('.preview-workbench'),{kind:'component',id:c.id,getBase:()=>({...currentAppearance(),brand:state.brand}),copy,notify:toast});if(c.id==='button')updateButtonPreview();}
 icons();
}
function axisRows(c){return [['01 크기와 비율',c.id==='button'||c.id==='input'?'기준 fixture 높이 2rem. 고정 height 대신 min-height로 긴 내용 보존.':'컴포넌트의 실제 콘텐츠 크기를 유지하고 좁은 영역에서 재배치.'],['02 타이포그래피',c.id==='input'||c.id==='field'?'입력: viewport stepped, 48rem에서 16/24 → 14/20px(root 16px 조건).':'설명과 레이블은 stable. 폭 변화만으로 글자를 일괄 축소하지 않음.'],['03 색과 대비','Light/Dark 역할 분리. 상태는 텍스트·아이콘과 함께 표시. 전체 대비 인증 미수행.'],['04 배치와 정렬','DOM 읽기 순서 유지. 콘텐츠의 스크롤 소유권을 해당 영역에 둠.'],['05 간격과 그룹화',c.id==='data-grid'?'명시적 Default/Dense 선택. 폰트 크기는 유지.':'관련 레이블·컨트롤·안내를 같은 그룹으로 유지.'],['06 표면과 깊이','반경·경계·그림자를 독립적으로 지정. 모달과 팝오버는 native top layer.'],['07 상호작용과 피드백','공통 동작 계약과 상태 안내를 확인합니다.']];}
function updateButtonPreview(){const b=state.button,sample=$('#detail-panel .preview-workbench [data-cf-form="default"] .cf-sample');sample.classList.add('cf-controlled-button');sample.dataset.cfLiveSource='true';sample.innerHTML=`<button class="btn ${b.variant==='default'?'':b.variant} ${b.size==='default'?'':b.size}" ${b.state==='disabled'||b.state==='busy'?'disabled':''} ${b.state==='busy'?'aria-busy="true"':''} data-action="button-feedback">${b.state==='busy'?'<span class="btn-spinner" aria-hidden="true"></span>':icon('arrow-up-right')}<span>${esc(b.label)||'버튼'}</span></button>`;icons();}

function tokenPage(){
 const stats=tokenInventoryStats(currentTokens);
 return `<div class="page-heading"><div class="eyebrow">The foundation</div><div class="page-heading-row"><h1>값의 출처가 보이는 설계.</h1><button class="btn secondary sm" data-action="export-tokens">${icon('download')}JSON 내보내기</button></div><p>원시 값에서 컴포넌트까지. 네 계층의 연결을 탐색하고 변경의 영향을 확인하세요.</p></div><div class="token-inventory-summary"><strong data-token-inventory-summary>${stats.used}개 적용 / 전체 ${stats.total}개</strong><span>현재 적용은 모든 Component에서 이어지는 참조를 보여줍니다.</span></div><div class="token-overview">${[['primitive','01','Primitive','변하지 않는 값의 척도'],['brand','02','Brand','브랜드가 선택한 재료'],['semantic','03','Semantic','제품 안에서의 의미'],['component','04','Component','실제 부품과의 연결']].map(([id,n,label,desc])=>`<button class="token-level" data-action="token-layer" data-layer="${id}" aria-pressed="${state.tokenLayer===id}" style="text-align:left"><span>LAYER ${n}</span><h3>${label}</h3><p>${desc}</p><small><span data-token-layer-count="${id}">${stats.layers[id].used}개 적용 / 전체 ${stats.layers[id].total}개</span> ${icon('arrow-up-right')}</small></button>`).join('')}</div><div class="token-controls"><div class="filter-tabs" role="group" aria-label="토큰 계층">${['primitive','brand','semantic','component'].map(l=>`<button class="filter-tab ${state.tokenLayer===l?'active':''}" data-action="token-layer" data-layer="${l}" aria-pressed="${state.tokenLayer===l}">${l[0].toUpperCase()+l.slice(1)}</button>`).join('')}</div>${brandSelectorMarkup(currentAppearance())}<label class="catalog-search">${icon('search')}<span class="sr-only">토큰 경로 검색</span><input id="token-input" type="search" value="${esc(state.tokenQuery)}" placeholder="전체 토큰 경로 검색…" aria-describedby="token-scope-hint"></label></div><div class="token-scope-controls"><div class="token-scope-picker" role="group" aria-label="토큰 표시 범위">${[['used','현재 적용'],['all','전체 정의']].map(([scope,label])=>`<button type="button" data-action="token-scope" data-scope="${scope}" aria-pressed="${state.tokenScope===scope}">${label}</button>`).join('')}</div><p id="token-scope-hint"></p></div><div id="token-table-body"></div><p class="token-description">A/B는 PRD의 구조 검증용 fixture입니다. B에서는 control 높이만 바뀌며 Primitive·spacing·radius는 유지됩니다. 색과 반경은 이 사이트의 데모용 신규 결정입니다. JSON 내보내기는 전체 정의를 포함합니다.</p><section class="token-trace" id="token-trace"></section>`;
}
function renderTokenTable(){
 const query=state.tokenQuery.trim(),stats=tokenInventoryStats(currentTokens),tokens=selectTokenGraph(currentTokens,{scope:state.tokenScope,query}),body=$('#token-table-body');
 if(!body)return;
 if(query){
  const matching=['primitive','brand','semantic','component'].filter(layer=>tokenGroups(tokens,layer,query).length);
  body.innerHTML=matching.map(layer=>`<section class="token-search-layer"><h2>${layer[0].toUpperCase()+layer.slice(1)}</h2>${renderTokenGroups(tokens,currentResolved,layer,query,{inventoryCount:stats.layers[layer].total})}</section>`).join('')||'<p class="search-empty">일치하는 토큰이 없습니다.</p>';
 }else body.innerHTML=renderTokenGroups(tokens,currentResolved,state.tokenLayer,'',{inventoryCount:stats.layers[state.tokenLayer].total});
 const hint=$('#token-scope-hint');if(hint)hint.textContent=query?'검색은 전체 정의의 네 계층에서 찾습니다.':state.tokenScope==='used'?'현재 Component에서 사용하는 값만 표시합니다. 다른 선택지의 값은 전체 정의에서 볼 수 있습니다.':'선택하지 않은 테마와 재질을 포함한 모든 정의를 표시합니다.';
 $$('[data-action="token-scope"]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.scope===state.tokenScope)));
 const summary=$('[data-token-inventory-summary]');if(summary)summary.textContent=`${stats.used}개 적용 / 전체 ${stats.total}개`;
 $$('[data-token-layer-count]').forEach(label=>{const layer=stats.layers[label.dataset.tokenLayerCount];label.textContent=`${layer.used}개 적용 / 전체 ${layer.total}개`;});
 icons();
}

function renderTokenTrace(){const chain=traceToken(currentTokens,state.tokenPath).reverse();$('#token-trace').innerHTML=`<h2>참조의 흐름</h2><p>각 값의 소유권과 연결을 따라가세요. 최종 해석값: <strong>${formatValue(currentResolved[state.tokenPath])}</strong></p>${chain.map((t,i)=>`<div class="trace-step"><span class="trace-layer">${t.path.split('.')[1].toUpperCase()}</span><code class="trace-path">${t.path}</code>${icon('arrow-right')}<span class="trace-value">${i===0?formatValue(t.$value):'alias'}</span></div>`).join('')}${state.tokenPath.includes('height')?'<p class="token-description">root 16px을 가정하면 A: 2 × 16 = 32px, B: 2.25 × 16 = 36px입니다. rem이 정본이며 px은 조건부 환산입니다.</p>':''}`;icons();}

function docsPage(slug){const labels={overview:'KLIC을 소개합니다.',start:'아이디어를 인터페이스로.',principles:'작은 원칙이, 큰 일관성으로.',contracts:'값을 넘어, 동작까지.',changelog:'조금씩, 더 좋은 방향으로.'};if(!labels[slug])slug='overview';return `<div class="page-heading"><div class="eyebrow">${slug==='changelog'?'Changelog':'A shared language'}</div><h1>${labels[slug]}</h1><p>${{overview:'디자이너와 개발자가 같은 언어로 제품을 만들어가는 공간입니다.',start:'컴포넌트를 둘러보고, 설계를 이해하고, 내 제품의 언어로 연결하세요.',principles:'KLIC의 7개 디자인 디멘션은 화면의 크기부터 행동의 결과까지 함께 다룹니다.',contracts:'수치가 같다는 것과 같은 경험을 보장한다는 것은 다릅니다.',changelog:'이 사이트에서 무엇을 만들고 어떤 결정을 내렸는지 기록합니다.'}[slug]}</p></div><div class="doc-layout"><article class="doc-prose"><section class="doc-section" data-i18n-ignore><p>${libraryScopeText(document.documentElement.lang)}</p><a href="/licenses/README.md">${document.documentElement.lang==='en'?'Provenance and licenses':'출처·라이선스 안내'}</a></section>${docContent(slug)}${slug==='principles'?'':renderDesignGuidance(document.documentElement.lang)}<section class="doc-section"><h2>개발 도구에 연결하기</h2><p>같은 카탈로그를 터미널·에이전트·브라우저에서 사용하세요. 실행 가능한 기능, API 계약과 연결 방법을 함께 제공합니다.</p><a class="doc-download" href="#docs/integrations">${icon('plug')}<div><strong>CLI · MCP · WebMCP · API</strong><p>개발 연동 Docs →</p></div></a></section></article><aside class="doc-toc"><strong>라이브러리 가이드</strong>${Object.entries(labels).map(([id,name])=>`<a href="#docs/${id}" ${id===slug?'style="color:var(--klic-semantic-color-accent)"':''}>${{overview:'개요',start:'시작하기',principles:'디자인 원칙',contracts:'구현 계약',changelog:'변경 기록'}[id]}</a>`).join('')}<a href="./KLIC_Design_System_PRD_v1.1.md" download>PRD 원문 내려받기 ↗</a></aside></div>`;}
function docContent(slug){
 if(slug==='principles')return renderFrameworkGuide();
 if(slug==='start')return `<section class="doc-section" style="margin-top:0"><h2>첫 번째 컴포넌트부터 시작하세요.</h2><p>이 사이트는 PRD를 탐색할 수 있는 독립적인 HTML 데모 라이브러리입니다. klic-design npm 패키지로 항목을 가져오거나 CLI로 소스를 저장할 수 있습니다.</p><div class="step-list">${[['01','직접 눌러보고 선택하기','갤러리에서 컴포넌트를 조작해보세요. 각 이름을 누르면 미리보기, 코드, 설계 명세를 확인할 수 있습니다.','#components','컴포넌트 둘러보기'],['02','값이 어디에서 왔는지 이해하기','토큰 탐색기에서 최종 값과 네 계층의 참조를 살펴보세요. A/B fixture를 바꾸면 소비자의 높이 변화를 비교할 수 있습니다.','#tokens','토큰 탐색하기'],['03','화면이 달라지는 순간 확인하기','리사이즈 실험실에서 컨테이너 폭만 변경해 제목·본문·입력의 다른 변화 방식을 비교합니다.','#lab','실험실 열기']].map(([n,title,desc,href,label])=>`<div class="step-row"><span class="step-index">${n}</span><div><h3>${title}</h3><p>${desc}</p><a class="text-link" style="margin-top:8px" href="${href}">${label}${icon('arrow-right')}</a></div></div>`).join('')}</div></section><section class="doc-section"><h2>내 프로젝트에 연결하기</h2><p>토큰 JSON은 중첩 구조로 내려받을 수 있습니다. 색상·치수·서체·굵기의 역할을 4계층 참조로 내보냅니다. 설정의 브랜드 탭에서 KLIC Core·Studio·Data를 비교하고 적용할 수 있습니다. 제품 적용 시 실제 설치본·브랜드·지원 환경을 고정하고 PRD의 수용시험을 수행하세요.</p><div class="code-panel spaced"><div class="code-panel-header"><span>HTML 데모의 파일 구성</span><a href="./styles.css" target="_blank" rel="noopener">스타일 원문 ↗</a></div><pre><code>index.html    — 페이지와 native dialog\nstyles.css    — 컴포넌트 및 반응형 스타일\nbrand.css     — 회사 블루 기반의 역할별 배색\ncatalog.js    — ${catalog.length}종 예제와 설계 명세\ntokens.mjs    — 4계층 fixture와 alias 해석\napp.js        — 탐색·검색·미리보기 동작</code></pre></div><div class="info-note">${icon('info')}<span>klic-design 패키지 설치 후 항목별 경로로 가져오세요. 수정할 소스는 CLI add로 독립 실행 폴더에 저장할 수 있습니다. 컴포넌트는 HTML 참고 형태이며 스타일과 필요한 동작을 함께 적용하세요.</span></div></section>`;
 if(slug==='principles')return `<section class="doc-section" style="margin-top:0"><h2>7 디멘션, 하나의 경험.</h2><p>7 디멘션은 화면과 행동을 검토하는 관점입니다. 값의 소유권을 표현하는 4계층과 서로 대체하지 않습니다. 출처: PRD §6.</p><div class="axis-list">${axes.map(([title,desc],i)=>`<div class="axis-item"><span class="axis-number">0${i+1}</span><div><h3>${title}</h3><p>${desc}</p></div></div>`).join('')}</div></section><section class="doc-section"><h2>모든 것을 비례해서 줄이지 않습니다.</h2><p>본문은 폭이 바뀌어도 크기를 유지하고 줄바꿈으로 대응합니다. 입력의 글자는 정해진 viewport 경계에서 바뀝니다. 제목의 유동 변화는 지정된 컨테이너에만 적용하는 후보 규칙입니다. 밀도는 사용자가 명시적으로 선택합니다.</p><a class="text-link spaced" href="#lab">리사이즈 실험실에서 비교하기${icon('arrow-up-right')}</a></section><section class="doc-section"><h2>상태는 동시에 존재합니다.</h2><p>invalid와 focus, selected와 hover는 함께 표현되어야 합니다. 모든 상태를 하나의 우선순위로 덮지 않고 배경·경계·focus·문구·실행 가능 여부의 책임을 나눕니다. 출처: PRD §11.</p></section>${paletteSection()}`;
 if(slug==='contracts')return renderDesignContract(document.documentElement.lang);
 if(slug==='changelog')return `<section class="doc-section"><h2>2026.10.27 · 탐색·체험 설정·제공 범위 정합성</h2><p>AI 분류 설명, 확장 컴포넌트 문구, 실행·준비 집계와 필터를 수정했습니다. 공통 작업 화면의 통합/독립 경로를 구분하고, 반경 직접 입력과 체험 설정 저장을 연결했습니다. ID와 토큰 경로는 유지합니다.</p><a href="#docs/governance">버전 구분과 설정 이관 안내 →</a></section><section class="doc-section"><h2>2026.10.27 · 공통 기준의 전체 전달 경로 연결</h2><p>가이드·예제·AI 프롬프트·llms.txt·MCP·CLI·WebMCP·API·소스와 테마 키트가 같은 기준 리비전을 사용합니다. 선택적 채택과 변경 영향 점검 규칙, 빌드 전 회귀 검사를 연결했습니다.</p><a href="#docs/governance">운영과 변경 절차 →</a></section><div class="changelog-entry"><time datetime="2026-10-24">2026.10.24</time><div><span class="badge">컴포넌트 100종</span><h2>더 넓어진 인터페이스 도구상자.</h2><p>기존 18종에 독립적인 컴포넌트 82종을 추가했습니다. 100종의 실제 미리보기와 총 136개 사용 예제, API·상태·키보드·7 디멘션를 제공합니다. shadcn/ui와 Ant Design 공식 목록에서 기능 범위를 참고하고 KLIC 블루와 4계층 역할 토큰으로 직접 구현했습니다.</p><a class="text-link" href="#components">100종 둘러보기 →</a></div></div><div class="changelog-entry"><time datetime="2026-10-24">2026.10.24</time><div><span class="badge" style="margin-bottom:10px">블록 스튜디오</span><h2>작은 요소에서 실제 업무 화면으로.</h2><p>제공된 블록 구현을 KLIC의 7 디멘션·4계층으로 연결했습니다. 47개 모듈의 실행 예시 164개와 준비 항목 83개를 구분하고, 검색·분류·실행 미리보기·실제 소스·7 디멘션·토큰 추적을 추가했습니다.</p><p>회사 블루와 Light/Dark, 3종의 로컬 폰트, 화면 폭과 밀도 전환을 지원합니다. 예시는 샘플 데이터와 로컬 상태로 동작합니다.</p><a class="text-link" href="#blocks">블록 스튜디오 열기 →</a></div></div><div class="changelog-entry"><time datetime="2026-10-23">2026.10.23</time><div><span class="badge" style="margin-bottom:10px">브랜드 컬러</span><h2>Blue, with purpose.</h2><p>회사 사이트를 확인해 주요 행동은 블루, 정보 위계는 네이비, 콘텐츠 표면은 화이트·쿨그레이로 재배치했습니다. Light/Dark 토큰, 예제 코드, 상태색과 차트도 함께 조정했습니다.</p></div></div><div class="changelog-entry"><time datetime="2026-10-23">2026.10.23</time><div><span class="badge" style="margin-bottom:10px">첫 번째 사이트</span><h2>Interface Library</h2><p>독립적인 시각 디자인으로 컴포넌트 컬렉션, 상세 문서, 토큰 탐색기와 리사이즈 실험실을 구성했습니다. 모든 소유 토큰은 klic. 경로를 사용합니다.</p><ul><li>18개 예제와 미리보기·코드·7 디멘션</li><li>A/B fixture와 전역 Light/Dark</li><li>컨테이너 폭에 따른 PageTitle 후보 비교</li><li>검색, 필터, 코드 복사와 토큰 JSON 내보내기</li></ul></div></div><div class="info-note">${icon('info')}<span>PRD v1.1과 이 사이트의 개발 버전은 별개입니다. 제품용 토큰 패키지 또는 기존 앱의 릴리스 이력이 아닙니다.</span></div>`;
 return `<section class="doc-section" style="margin-top:0"><h2>디자인과 구현 사이, 공통의 기준.</h2><p>KLIC은 값의 출처, 브랜드의 선택, 제품의 의미, 컴포넌트의 동작을 연결합니다. 이 사이트는 첨부된 KLIC 디자인 시스템 PRD v1.1을 기반으로 그 연결을 직접 살펴볼 수 있도록 만든 탐색 공간입니다.</p></section><section class="doc-section"><h2>4계층으로 설계의 책임을 나눕니다.</h2><div class="step-list">${[['01','Primitive','브랜드에 따라 의미가 변하지 않는 원시 값과 척도.'],['02','Brand','브랜드가 선택한 공통 팔레트, 간격, 반경과 컨트롤 척도.'],['03','Semantic','주요 행동, 본문, 입력, 오류와 같은 제품 역할.'],['04','Component','각 부품의 slot·size·variant·state와 역할의 연결.']].map(([n,title,text])=>`<div class="step-row"><span class="step-index">${n}</span><div><h3>${title}</h3><p>${text}</p></div></div>`).join('')}</div><a class="text-link" href="#tokens">실제 참조 관계 탐색하기${icon('arrow-up-right')}</a></section><section class="doc-section"><h2>원본을 바탕으로, 새로운 표현으로.</h2><p>현재 Site 기준선은 저장소의 독립 구현과 lockfile입니다. 고정된 ReUI 소스는 소비 앱 이관 검토용 출처입니다. 이 사이트의 화면 구성·팔레트·native HTML 예제는 새로 만들었으며 ReUI 사이트 디자인을 복제하지 않았습니다. 모든 PRD 요구사항의 완료를 주장하는 제품용 구현은 아닙니다.</p></section>${prdLink()}`;
}

function paletteSection(){return `<section class="doc-section"><h2>회사 블루를 중심으로, 색의 역할을 나눕니다.</h2><p>클릭데이타의 주요 버튼에서 확인한 #245FC2를 주요 행동에, KLIC의 선택 메뉴에서 확인한 #2641B9를 브랜드 표식에 사용합니다. 네이비는 읽기의 중심을 잡고, 화이트와 차가운 회색은 콘텐츠를 담습니다. 이는 현재 웹사이트 관찰을 바탕으로 한 이 라이브러리의 배색 결정입니다.</p><div class="table-scroll spaced"><table class="spec-table"><thead><tr><th>역할</th><th>Light 기준</th><th>사용 위치</th></tr></thead><tbody><tr><td><span class="palette-role"><span class="color-swatch" style="background:#132c46"></span>네이비</span></td><td class="mono">#132C46</td><td>본문·제목·정보 위계</td></tr><tr><td><span class="palette-role"><span class="color-swatch" style="background:#245fc2"></span>액션 블루</span></td><td class="mono">#245FC2</td><td>주요 버튼·선택·포커스·진행</td></tr><tr><td><span class="palette-role"><span class="color-swatch" style="background:#2641b9"></span>브랜드 블루</span></td><td class="mono">#2641B9</td><td>브랜드 심벌</td></tr><tr><td><span class="palette-role"><span class="color-swatch" style="background:#f5f7fb"></span>뉴트럴</span></td><td class="mono">#FFFFFF / #F5F7FB</td><td>기본 표면·컴포넌트 캔버스</td></tr><tr><td>완료·성공</td><td class="mono">#1C4FA4</td><td>블루 + 체크 아이콘 + 완료 문구</td></tr><tr><td>주의 / 오류</td><td class="mono">#835600 / #B13C43</td><td>상태 의미가 필요한 위치에만 사용</td></tr></tbody></table></div><p style="margin-top:16px">큰 면적은 중립색으로 두고 행동에 블루를 집중합니다. Dark에서는 텍스트·배경·버튼 대비를 별도로 조정합니다. 성공·오류는 색만으로 전달하지 않습니다.</p><p style="margin-top:14px"><a class="text-link" href="https://clickdata.co.kr/" target="_blank" rel="noopener">CLICKDATA</a> · <a class="text-link" href="https://klic.co.kr/main.do?s=klic" target="_blank" rel="noopener">KLIC</a> · <a class="text-link" href="https://www.carbondesignsystem.com/building-blocks/foundations/color/overview" target="_blank" rel="noopener">Carbon Color</a> · <a class="text-link" href="https://atlassian.design/foundations/color" target="_blank" rel="noopener">Atlassian Color</a></p></section>`;}

function prdLink(){return `<a href="./KLIC_Design_System_PRD_v1.1.md" download class="doc-download">${icon('file-text')}<div><strong>KLIC 디자인 시스템 PRD v1.1</strong><p>7 디멘션 4계층 제품 요구사항 · 현행 개정 문서</p></div>${icon('download')}</a>`;}
function notFound(){return `<div class="empty-state">${icon('compass')}<h2>아직 이곳에는 페이지가 없어요.</h2><p>컴포넌트 컬렉션에서 다시 시작할 수 있습니다.</p><a href="#components" class="btn">컬렉션으로 돌아가기</a></div>`;}

function openSearch(){if($('#sidebar').classList.contains('open'))setMobileNav(false);lastSearchTrigger=document.activeElement;searchIndex=-1;searchDialog.showModal();$('#command-input').value='';renderSearch('');$('#command-input').focus();syncScrollLock();}
function renderSearch(query){searchIndex=-1;renderUnifiedSearch($('#command-results'),query,{kind:$('#command-kind')?.value||'all',token:$('#command-token')?.value||'',icons});}

function openTextDialog(title,text){lastDemoTrigger=document.activeElement;demoDialog.className='demo-dialog';demoDialog.innerHTML=`<div class="dialog-header"><h2 id="demo-dialog-title">${esc(title)}</h2><button class="icon-button" data-action="close-demo" aria-label="닫기">${icon('x')}</button></div><div class="dialog-body"><p>아래 내용을 선택해 직접 복사할 수 있습니다.</p><textarea class="demo-input" rows="10" aria-label="복사할 내용" readonly>${esc(text)}</textarea></div><div class="dialog-footer"><button class="btn" data-action="close-demo">닫기</button></div>`;demoDialog.showModal();syncScrollLock();icons();}
function openDemo(kind){
 lastDemoTrigger=document.activeElement;const sheet=kind==='sheet';let saved={name:'새로운 가능성',private:true};try{saved={...saved,...JSON.parse(localStorage.getItem('klic-demo-project')||'{}')}}catch{}
 demoDialog.className='demo-dialog'+(sheet?' sheet':'');
 demoDialog.innerHTML=`<form id="project-form"><div class="dialog-header"><h2 id="demo-dialog-title">${sheet?'프로젝트 설정':'새로운 프로젝트'}</h2><button class="icon-button" type="button" data-action="close-demo" aria-label="다이얼로그 닫기">${icon('x')}</button></div><div class="dialog-body"><p>${sheet?'지금의 아이디어에 어울리는 공간으로 설정하세요.':'작은 아이디어에서 다음 가능성이 시작됩니다.'}<br>이 데모는 현재 브라우저에만 저장합니다.</p><label class="demo-label" for="dialog-project-name">프로젝트 이름</label><input id="dialog-project-name" class="demo-input" name="name" required maxlength="60" value="${sheet?esc(saved.name):''}" placeholder="프로젝트 이름을 입력하세요" autofocus>${sheet?`<label class="switch-row" style="margin-top:24px"><span>비공개 프로젝트<small>공개 서비스가 아닌 로컬 데모 설정입니다.</small></span><input class="switch" type="checkbox" role="switch" name="private" ${saved.private?'checked':''}></label><div class="doc-section"><h3>인터페이스 테마</h3><p>시트가 열린 상태에서도 테마를 전환해보세요.</p><button type="button" class="btn secondary spaced" data-action="theme">${icon('sun-moon')}라이트 / 다크 전환</button></div>`:''}</div><div class="dialog-footer"><button class="btn secondary" type="button" data-action="close-demo">취소</button><button class="btn" type="submit">${sheet?'설정 저장':'프로젝트 만들기'}${icon('arrow-right')}</button></div></form>`;
 if(componentPreview)applyPreviewScope(demoDialog,componentPreview.context());else demoDialog.removeAttribute('style');
 demoDialog.showModal();syncScrollLock();icons();
}
function showPopover(button){const pop=document.getElementById(button.getAttribute('aria-controls'));if(pop.matches(':popover-open')){pop.hidePopover();return;}pop.showPopover();const rect=button.getBoundingClientRect(),p=pop.getBoundingClientRect();pop.style.left=Math.max(8,Math.min(innerWidth-p.width-8,rect.left+(rect.width-p.width)/2))+'px';pop.style.top=(rect.bottom+p.height+16>innerHeight?Math.max(8,rect.top-p.height-8):rect.bottom+8)+'px';button.setAttribute('aria-expanded','true');if(!pop._focusBound){pop._focusBound=true;pop.addEventListener('toggle',()=>{const open=pop.matches(':popover-open');button.setAttribute('aria-expanded',String(open));if(!open&&document.contains(button)&&(pop.contains(document.activeElement)||document.activeElement===document.body))button.focus();});}$('button',pop)?.focus();}
function selectDemoTab(button){const parent=button.closest('.tabs-demo');$$('.demo-tab',parent).forEach(t=>{t.setAttribute('aria-selected',String(t===button));t.tabIndex=t===button?0:-1;});const i=Number(button.dataset.index),panel=$('.tab-demo-panel',parent);panel.setAttribute('aria-labelledby',button.id);panel.innerHTML=`<strong>${['프로젝트 한눈에 보기','팀과 함께한 기록','프로젝트 환경 설정'][i]}</strong><p>${['지금 진행 중인 작업을 확인하세요.','김하늘 님이 새로운 작업을 추가했어요.','공개 범위와 알림을 관리하세요.'][i]}</p><div class="tab-line"></div><div class="tab-line" style="width:${[65,85,45][i]}%"></div>`;}

document.addEventListener('click',async e=>{
 if(e.target.closest('.skip-link')){e.preventDefault();$('#main-content').focus();return;}
 const tokenLink=e.target.closest('[data-token-link]');if(tokenLink)state.tokenPath=tokenLink.dataset.tokenLink;
 const result=e.target.closest('.command-result');if(result){searchDialog.close();}
 const guideCopy=e.target.closest('[data-guide-copy]');if(guideCopy){const source=getComponentGuideExample(guideCopy.dataset.component,guideCopy.dataset.example);if(source)copy(source,'사용 예제 코드를 복사했습니다.');return;}
 const a=e.target.closest('[data-action]');if(!a)return;
 const action=a.dataset.action;
 if(action==='component-favorite')toggleComponentFavorite(a.dataset.componentFavorite);
 else if(action==='search')openSearch();
 else if(action==='close-search')searchDialog.close();
 else if(action==='theme'){if(componentPreview&&a.closest('#demo-dialog')){componentPreview.patch({theme:componentPreview.context().theme==='light'?'dark':'light'});applyPreviewScope(demoDialog,componentPreview.context());}else setPreferences({theme:state.theme==='light'?'dark':'light'});}
 else if(action==='mobile-nav')setMobileNav(!$('#sidebar').classList.contains('open'));
 else if(action==='reset-search'){state.query='';state.category='all';state.componentGroup='all';if(location.hash==='#components/all'){view.innerHTML=galleryPage();renderGallery();icons();$('#family-search')?.focus();}else{galleryResetFocus=true;location.hash='components/all';}}
 else if(action==='button-feedback')toast('버튼 클릭이 전달되었어요.');
 else if(action==='async-demo'){
  if(a.disabled)return;const previous=a.innerHTML;a.disabled=true;a.setAttribute('aria-busy','true');a.innerHTML='<span class="btn-spinner" aria-hidden="true"></span>저장 중';
  setTimeout(()=>{if(document.contains(a)){a.innerHTML=previous;a.disabled=false;a.removeAttribute('aria-busy');icons();}toast('데모 처리가 완료되었어요.');},1000);
 }
 else if(action==='dialog'||action==='sheet')openDemo(action);
 else if(action==='close-demo')demoDialog.close();
 else if(action==='toast-demo')toast('데모 알림입니다. 변경사항 저장 예시를 확인했어요.');
 else if(action==='demo-tab')selectDemoTab(a);
 else if(action==='popover')showPopover(a);
 else if(action==='popover-choice'){const p=a.closest('[popover]');p.hidePopover();if(a.dataset.choice==='링크 복사')copy(route?.[0]==='component'?SITE_ORIGIN+'/share/component/'+route[1]:location.href,'현재 페이지 링크를 복사했어요.');else toast(a.dataset.choice+' 동작을 선택했어요. (데모)');}
 else if(action==='density'){const grid=a.closest('.grid-preview');grid.dataset.density=a.dataset.density;$$('[data-action=density]',grid).forEach(b=>b.setAttribute('aria-pressed',String(b===a)));}
 else if(action==='select-rows'){const table=a.closest('table');$$('tbody input[type=checkbox]',table).forEach(c=>c.checked=a.checked);a.indeterminate=false;}
 else if(action==='mini-nav'){const p=a.closest('.mini-sidebar');$$('.mini-nav-button',p).forEach(b=>{b.classList.toggle('active',b===a);b===a?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current');});$('.mini-sidebar-body strong',p).textContent=a.dataset.label;}
 else if(action==='progress'){const p=a.closest('.progress-demo'),bar=$('progress',p);bar.value=Math.min(100,bar.value+12);$('[data-progress-label]',p).textContent=bar.value+'%';bar.textContent=bar.value+'%';if(bar.value===100){a.innerHTML='다시 시작 '+icon('rotate-ccw');a.dataset.action='restart-progress';toast('데모 업로드가 완료되었어요.');icons();}}
 else if(action==='restart-progress'){const p=a.closest('.progress-demo');$('progress',p).value=0;$('progress',p).textContent='0%';$('[data-progress-label]',p).textContent='0%';a.innerHTML='진행 '+icon('arrow-right');a.dataset.action='progress';icons();}
 else if(action==='detail-tab')location.hash=`component/${route[1]}/${a.dataset.tab}`;
 else if(action==='copy-code'){const c=catalog.find(c=>c.id===a.dataset.id);copy(componentCode(c),'예제 코드를 복사했어요.');}
 else if(action==='reset-preview'){if(route[1]==='button')state.button={variant:'default',size:'default',state:'default',label:'시작하기'};renderDetail(catalog.find(c=>c.id===route[1]));}
 else if(action==='token-layer'){state.tokenLayer=a.dataset.layer;const wasLevel=a.classList.contains('token-level');view.innerHTML=tokenPage();renderTokenTable();renderTokenTrace();icons();$((wasLevel?'.token-level':'.filter-tab')+'[data-layer='+state.tokenLayer+']')?.focus();}
 else if(action==='token-scope'){state.tokenScope=a.dataset.scope==='all'?'all':'used';renderTokenTable();}
 else if(action==='copy-theme-command')copy(a.dataset.command);
 else if(action==='trace-token'){state.tokenPath=a.dataset.path;renderTokenTrace();$('#token-trace').scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 else if(action==='copy-token')copy(a.dataset.path,'토큰 경로를 복사했어요.');
 else if(action==='export-tokens'){download(JSON.stringify(nestedTokens(currentTokens),null,2),`klic-tokens-${currentAppearance().brandProfile}-${state.theme}.json`);toast('현재 브랜드의 토큰을 내보냈어요.');}
 else if(action==='copy-fluid')copy('.page-content { container-type: inline-size; }\n.page-title {\n  font-size: 1.5rem;\n  font-size: clamp(1.5rem, calc(.9375rem + 1.171875cqi), 1.875rem);\n  line-height: 1.25;\n  overflow-wrap: anywhere;\n}');
});
document.addEventListener('input',e=>{
 if(e.target.id==='family-search'){state.query=e.target.value;renderGallery();}
 const t=e.target;
 if(t.id==='token-input'){state.tokenQuery=t.value;renderTokenTable();}
 else if(t.id==='command-input'||t.id==='command-token')renderSearch($('#command-input').value);
 else if(t.id==='dialog-project-name')t.setCustomValidity('');
 else if(t.dataset.buttonControl){state.button[t.dataset.buttonControl]=t.value;updateButtonPreview();}
});
document.addEventListener('change',e=>{
 const t=e.target;
 if(t.id==='command-kind'){renderSearch($('#command-input').value);return;}
 if(t.id==='component-group'){location.hash='components/'+state.category+(t.value==='all'?'':'/'+t.value);return;}
 if(t.dataset.action==='demo-select')t.parentElement.querySelector('.demo-helper').textContent={team:'초대된 팀 멤버만 접근할 수 있어요.',private:'나만 볼 수 있는 비공개 공간입니다.',public:'이 데모에서는 공개 설정을 실제 적용하지 않아요.'}[t.value];
 if(t.matches('.grid-preview tbody input[type=checkbox]')){const table=t.closest('table'),checks=$$('tbody input[type=checkbox]',table),all=$('thead input',table);all.checked=checks.every(c=>c.checked);all.indeterminate=!all.checked&&checks.some(c=>c.checked);}
 if(t.dataset.buttonControl){state.button[t.dataset.buttonControl]=t.value;updateButtonPreview();}
});
document.addEventListener('submit',e=>{
 if(e.target.id==='hero-form'){e.preventDefault();const name=$('#hero-project').value.trim();if(!name)return;try{localStorage.setItem('klic-demo-idea',name);toast(`“${name}” 아이디어를 이 브라우저에 저장했어요.`);}catch{toast('이 브라우저에서 저장할 수 없습니다.');}}
 if(e.target.id==='project-form'){e.preventDefault();const f=e.target,name=f.elements.name.value.trim();if(!name){f.elements.name.setCustomValidity('프로젝트 이름을 입력해주세요.');f.elements.name.reportValidity();return;}f.elements.name.setCustomValidity('');try{localStorage.setItem('klic-demo-project',JSON.stringify({name,private:!!f.elements.private?.checked}));demoDialog.close();toast('프로젝트 설정을 이 브라우저에 저장했어요.');}catch{toast('이 브라우저에서 저장할 수 없습니다.');}}
 if(e.target.matches('.field-demo')){e.preventDefault();const f=e.target,input=$('input',f),error=$('.demo-error',f);const valid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);input.setAttribute('aria-invalid',String(!valid));error.innerHTML=icon(valid?'circle-check':'circle-alert')+`<span>${valid?'이메일 형식을 확인했어요. 실제 발송은 하지 않습니다.':'이름@example.com 형식으로 입력해주세요.'}</span>`;error.style.color=valid?'var(--klic-semantic-color-success)':'';icons();if(!valid)input.focus();}
});
document.addEventListener('keydown',e=>{
 if(e.isComposing||e.keyCode===229)return;
 if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();workspaceHelp.close(false);searchDialog.open?searchDialog.close():openSearch();return;}
 if(e.key==='Tab'&&$('#sidebar').classList.contains('open')){const elements=$$('a[href],button:not([disabled])',$('#sidebar')).filter(el=>el.getClientRects().length);const first=elements[0],last=elements.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}return;}
 if(e.key==='Escape'&&$('#sidebar').classList.contains('open')){setMobileNav(false);return;}
 const tab=e.target.closest('[role=tab]');if(!e.defaultPrevented&&tab&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const tabs=$$('[role=tab]',tab.closest('[role=tablist]')),i=tabs.indexOf(tab);let n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[n].focus();tabs[n].click();return;}
 if(searchDialog.open&&['ArrowDown','ArrowUp','Enter'].includes(e.key)){
  const results=$$('.command-result');if(!results.length)return;
  if(e.key==='Enter'){if(document.activeElement===$('#command-input')){e.preventDefault();results[Math.max(0,searchIndex)].click();}return;}
  e.preventDefault();searchIndex=searchIndex<0?(e.key==='ArrowDown'?0:results.length-1):(searchIndex+(e.key==='ArrowDown'?1:-1)+results.length)%results.length;results[searchIndex].focus();
 }
});
// Stop only submit semantics while IME composition is active. Real IME testing remains separate.
document.addEventListener('keydown',e=>{if((e.isComposing||e.keyCode===229)&&e.key==='Enter'&&e.target.closest('form'))e.preventDefault();},true);
searchDialog.addEventListener('close',()=>{syncScrollLock();if(lastSearchTrigger&&document.contains(lastSearchTrigger))lastSearchTrigger.focus();});
demoDialog.addEventListener('close',()=>{demoDialog.removeAttribute('style');delete demoDialog.dataset.theme;delete demoDialog.dataset.previewContext;syncScrollLock();if(lastDemoTrigger&&document.contains(lastDemoTrigger))lastDemoTrigger.focus();});
searchDialog.addEventListener('click',e=>{if(e.target===searchDialog){const r=searchDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)searchDialog.close();}});
demoDialog.addEventListener('click',e=>{if(e.target===demoDialog){const r=demoDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)demoDialog.close();}});
window.addEventListener('hashchange',render);
window.addEventListener('resize',()=>{if(document.documentElement.dataset.compact!=='true'&&$('#sidebar').classList.contains('open'))setMobileNav(false);$('#sidebar').inert=document.documentElement.dataset.compact==='true'&&!$('#sidebar').classList.contains('open');});
const workspaceHelp=initWorkspaceHelp({openSearch,onVisibilityChange:syncScrollLock,icons});
document.addEventListener('click',e=>{if(e.target.closest('[data-action=token-layer]'))queueMicrotask(updateNav);});
initI18n();
initComponentInteractions({notify:toast,copy});
initVariantInteractions({notify:toast,copy});
initComponentFamilies({catalog,copy,notify:toast});
initAffectInteractions({copy,notify:toast});
initCustomization({icons,copy,download,notify:toast,getBrand:()=>state.brand,onChange:p=>{state.theme=p.theme;applyTheme();setMobileNav(false);if(route?.[0]==='tokens'){renderTokenTable();renderTokenTrace();}}});render();

let webMcpCleanup;registerKlicWebMCP({onStatus:status=>document.querySelectorAll('[data-webmcp-status]').forEach(el=>el.textContent=status.message)}).then(cleanup=>{webMcpCleanup=cleanup;});window.addEventListener('pagehide',event=>{if(!event.persisted)webMcpCleanup?.();});

document.addEventListener('click',e=>{const action=e.target.closest('[data-waterfall]')?.dataset.waterfall;if(action)document.querySelectorAll('.token-waterfall details').forEach(el=>el.open=action==='open');});

// Keep URL-selected language and canonical paths when leaving a share document.
document.addEventListener('click',event=>{if(!location.pathname.startsWith('/share/')||event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0)return;const anchor=event.target.closest('a[href^="#"]');if(!anchor)return;const hash=anchor.getAttribute('href');if(hash==='#main-content'){event.preventDefault();const main=document.querySelector('#main-content');main?.setAttribute('tabindex','-1');main?.focus();return;}const locale=new URLSearchParams(location.search).get('lang')==='en'?'en':'ko',target=sharedNavigationTarget(location.pathname,hash,locale);event.preventDefault();if(target)location.assign(target);else location.hash=hash;},true);

initDocumentLinks();
