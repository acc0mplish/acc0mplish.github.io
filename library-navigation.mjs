import {readMotionFavorites,toggleMotionFavorite,MOTION_FAVORITES_EVENT,MOTION_FAVORITES_STORAGE_KEY} from './motion-favorites.mjs';
import {readComponentFavorites,toggleComponentFavorite,COMPONENT_FAVORITES_EVENT,COMPONENT_FAVORITES_STORAGE_KEY} from './component-favorites.mjs';
import {translateText} from './i18n.mjs';
import {categories as COMPONENT_CATEGORIES} from './catalog.js';
import {readBlockFavorites,toggleBlockFavorite,FAVORITES_EVENT,FAVORITES_STORAGE_KEY} from './block-favorites.mjs';
import {initLibraryHoverPreview} from './library-hover-preview.mjs';
import {blockCatalogLabels,componentCatalogLabels,localizedTextLabels,BLOCK_COLLECTION_LABELS,OTHER_COMPONENTS_LABELS} from './catalog-labels.mjs';
import {MOTION_CATALOG,MOTION_CATEGORIES,getMotion} from './motion-catalog.mjs';
import {MOTION_GROUPS} from './motion-groups.mjs';
import {TERMINAL_COMPONENT_IDS} from './terminal-components.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=n=>'<i data-lucide="'+n+'" aria-hidden="true"></i>';
const MODES=['components','blocks','motion'];
export const MOTION_SIDEBAR_ITEMS=Object.freeze(MOTION_CATEGORIES.map(category=>category.id));
const localizedMotionGroupLabel=(group,locale)=>group.label[locale]||group.label.ko;
const localizedMotionCategoryLabel=(category,locale)=>category.label[locale]||category.label.ko;
export function motionNavigationScopeLabels(locale='ko'){
 const activeLocale=locale==='en'?'en':'ko';
 return Object.fromEntries(MOTION_GROUPS.map(group=>['major-'+group.id,localizedMotionGroupLabel(group,activeLocale)]));
}
function renderLibraryItem(item,{selectedId,favorites,locale='ko'}){
 const favoriteLabel=locale==='en'?'Favorite':'즐겨찾기';
 return '<div class="library-item-row"><a class="library-item '+(item.id.startsWith('flowmotion-')?'library-item-flowmotion ':'')+(selectedId===item.id?'selected':'')+'" href="'+esc(item.href)+'" title="'+esc(item.title)+'" data-library-item="'+esc(item.id)+'" '+(selectedId===item.id?'aria-current="page"':'')+'><span class="library-item-name">'+esc(item.label)+'</span></a><button type="button" class="library-favorite" data-library-favorite="'+esc(item.id)+'" aria-pressed="'+favorites.has(item.id)+'" aria-label="'+esc(item.title)+' '+favoriteLabel+'">'+icon('star')+'</button></div>';
}
function renderLibraryGroups(groups,{expanded=[],selectedId=null,favorites=new Set(),openAll=false,locale='ko'}={}){
 return groups.map(group=>'<details class="library-group" data-library-group="'+esc(group.id)+'" '+(openAll||expanded.includes(group.id)?'open':'')+'><summary title="'+esc(group.label)+'"><span class="library-group-name">'+esc(group.label)+'</span><span class="library-group-count">'+group.items.length+'</span></summary><div class="library-items">'+group.items.map(item=>renderLibraryItem(item,{selectedId,favorites,locale})).join('')+'</div></details>').join('');
}
export function renderMotionNavigation(route=[],{locale='ko',favorites=null}={}){
 const category=route[1]==='category'?route[2]:getMotion(route[1])?.category;
 const model=createNavigationModel([],undefined,locale);
 const groups=navigationGroups(model,'motion','all','',favorites);
 return renderLibraryGroups(groups,{expanded:category?[category]:[],selectedId:getMotion(route[1])?.id,favorites:favorites||new Set(),locale});
}
const STORE='klic-library-navigation-v1';
export const COMPONENT_GROUPS=[
 ['actions','버튼과 액션','button button-group toggle toggle-group segmented-control'],
 ['text','텍스트와 폼','input input-group textarea password-input search-input number-input input-otp field form'],
 ['selection','선택 컨트롤','checkbox switch radio-group select combobox autocomplete multi-select tree-select cascader transfer slider range-slider rating color-picker tag-input mentions'],
 ['date','날짜와 시간','date-picker date-range-picker time-picker calendar'],
 ['files','파일 입력','file-upload dropzone'],
 ['data','표와 목록','table data-grid descriptions list tree timeline'],
 ['identity','인물과 상태','avatar avatar-group badge tag chip statistic'],
 ['charts','차트와 진행률','line-chart bar-chart donut-chart sparkline progress'],
 ['media','이미지와 미디어','image aspect-ratio carousel icon'],
 ['feedback','안내와 피드백','alert banner toast notification result empty-state skeleton spinner loading-overlay'],
 ['overlay','메뉴와 오버레이','dialog alert-dialog sheet popover tooltip hover-card dropdown-menu context-menu popconfirm command'],
 ['navigation','탐색과 단계','tabs sidebar breadcrumb pagination menubar navigation-menu bottom-navigation anchor steps stepper toolbar'],
 ['layout','배치와 컨테이너','card separator scroll-area resizable splitter watermark accordion collapsible'],
 ['type','텍스트 표시','typography link blockquote code-block kbd'],
 ['developer','개발 도구',TERMINAL_COMPONENT_IDS.join(' ')],
 ['ai','AI와 에이전트','decision-inbox tool-call-card smart-recommendation message-actions']
];
const safeKey=v=>typeof v==='string'&&/^[a-z0-9-]{1,100}$/.test(v);
const safeHref=(value,mode)=>{
 if(typeof value!=='string')return false;
 if(mode==='motion'){
  if(value==='#motion'||value==='#motion/favorites')return true;
  const major=value.match(/^#motion\/major\/([a-z0-9-]+)$/);if(major)return MOTION_GROUPS.some(group=>group.id===major[1]);
  const minor=value.match(/^#motion\/minor\/([a-z0-9-]+)$/);if(minor)return MOTION_GROUPS.some(group=>group.subgroups.some(item=>item.id===minor[1]));
  const category=value.match(/^#motion\/category\/([a-z0-9-]+)$/);if(category)return MOTION_SIDEBAR_ITEMS.includes(category[1]);
  const item=value.match(/^#motion\/([a-z0-9-]+)$/);return Boolean(item&&getMotion(item[1]));
 }
 if(mode==='blocks'){
  const collection=value.match(/^#blocks\/collection\/(all|applications|diagrams|charts|data-grids)(?:\/([a-z0-9-]+))?$/);
  if(collection)return true;
 }
  return (mode==='components'?/^#components(?:\/(?:all|favorites|input|display|feedback|navigation|developer)(?:\/[a-z0-9-]+)?)?$|^#component\/[a-z0-9-]+(?:\/(?:preview|examples|api|code|spec))?$/:/^#blocks(?:\/(?:favorites|collection\/(?:all|applications|diagrams|charts|data-grids)|[a-z0-9-]+)(?:\/(?:preview|code|axes|tokens))?)?$/).test(value);
};
const normalizeQuery=v=>typeof v==='string'?v.slice(0,120):'';
export function normalizeNavigationState(raw){
 const v=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const state={version:1,mode:MODES.includes(v.mode)?v.mode:'components',views:{components:v.views?.components==='favorites'?'favorites':'all',blocks:v.views?.blocks==='favorites'||(!v.views&&v.favoritesOnly===true)?'favorites':'all',motion:v.views?.motion==='favorites'?'favorites':'all'},scopes:{components:'all',blocks:'all',motion:'all'},queries:{components:'',blocks:'',motion:''},expanded:{components:null,blocks:null,motion:null},last:{components:'#components',blocks:'#blocks',motion:'#motion'}};
 for(const mode of MODES){
  const allowed=mode==='components'?['all','input','display','feedback','navigation','developer']:mode==='blocks'?['all','applications','diagrams','charts','data-grids']:[ 'all',...MOTION_SIDEBAR_ITEMS,...MOTION_GROUPS.map(group=>'major-'+group.id),...MOTION_GROUPS.flatMap(group=>group.subgroups.map(item=>'minor-'+item.id))];
  if(allowed.includes(v.scopes?.[mode]))state.scopes[mode]=v.scopes[mode];
  state.queries[mode]=normalizeQuery(v.queries?.[mode]);
  if(Array.isArray(v.expanded?.[mode]))state.expanded[mode]=[...new Set(v.expanded[mode].filter(safeKey))].slice(0,100);
  if(safeHref(v.last?.[mode],mode))state.last[mode]=v.last[mode];
 }
 return state;
}
const documentLocale=()=>globalThis.document?.documentElement?.dataset?.locale==='en'?'en':'ko';
const searchable=(...values)=>values.flat(Infinity).filter(Boolean).flatMap(value=>[value,translateText(value)]).join(' ').toLocaleLowerCase();
export function createNavigationModel(components,blockData={blocks:[],categories:[],collections:[]},locale=documentLocale()){
 const activeLocale=locale==='en'?'en':'ko';
 const componentMap=new Map(components.map(c=>[c.id,c])),groupById=new Map();
 const componentGroups=COMPONENT_GROUPS.map(([id,label,ids])=>{
  const labels=localizedTextLabels(label);
  const items=ids.split(' ').map(key=>componentMap.get(key)).filter(Boolean).map(c=>{
   if(groupById.has(c.id))throw new Error('Duplicate component navigation id: '+c.id);groupById.set(c.id,id);
   const itemLabels=componentCatalogLabels(c),categoryLabels=localizedTextLabels(COMPONENT_CATEGORIES[c.category]||c.category);
   return {id:c.id,label:itemLabels[activeLocale],title:itemLabels[activeLocale],labels:itemLabels,categoryLabels,scope:c.category,href:'#component/'+c.id,search:searchable(c.id,Object.values(itemLabels),c.name,c.ko,c.description,c.tags,label)};
  });return{id,label:labels[activeLocale],labels,items};
 }).filter(g=>g.items.length);
 const remaining=components.filter(c=>!groupById.has(c.id));
 if(remaining.length)componentGroups.push({id:'other',label:OTHER_COMPONENTS_LABELS[activeLocale],labels:OTHER_COMPONENTS_LABELS,items:remaining.map(c=>{const labels=componentCatalogLabels(c),categoryLabels=localizedTextLabels(COMPONENT_CATEGORIES[c.category]||c.category);return{id:c.id,label:labels[activeLocale],title:labels[activeLocale],labels,categoryLabels,scope:c.category,href:'#component/'+c.id,search:searchable(c.id,Object.values(labels),c.description,c.tags)};})});
 const blocks=(blockData.blocks||[]).filter(b=>b.implemented);
 const blockGroups=(blockData.categories||[]).map(category=>({
  id:category.collection+'-'+category.id,label:localizedTextLabels(category.name)[activeLocale],labels:localizedTextLabels(category.name),scope:category.collection,
  items:blocks.filter(b=>b.collection===category.collection&&b.categoryId===category.id).map(b=>{
   const labels=blockCatalogLabels(b),categoryLabels=localizedTextLabels(b.categoryName);
   return {id:b.id,label:labels[activeLocale],title:labels[activeLocale],labels,categoryLabels,categoryLabel:categoryLabels[activeLocale],scope:b.collection,href:'#blocks/'+b.id,search:searchable(b.id,Object.values(labels),b.title,b.catalogTitle,b.description,b.tags,b.categoryName)};
  })
 })).filter(g=>g.items.length);
 const seen=new Set();for(const group of blockGroups)for(const item of group.items){if(seen.has(item.id))throw new Error('Duplicate block navigation id: '+item.id);seen.add(item.id);}
 if(seen.size!==blocks.length)throw new Error('Every implemented block needs a navigation category');
 const motionGroups=MOTION_CATEGORIES.map(category=>({id:category.id,label:localizedMotionCategoryLabel(category,activeLocale),href:'#motion/category/'+category.id,items:MOTION_CATALOG.filter(motion=>motion.category===category.id).map(motion=>{const label=motion.title[activeLocale]||motion.title.ko;return{id:motion.id,label,title:label,scope:category.id,href:'#motion/'+motion.id,search:searchable(motion.id,Object.values(motion.title),Object.values(motion.summary))};})}));
 return {components:componentGroups,blocks:blockGroups,motion:motionGroups,totals:{components:components.length,blocks:blocks.length,motion:MOTION_CATALOG.length},planned:(blockData.blocks||[]).filter(b=>!b.implemented).length};
}
export function navigationGroups(model,mode,scope='all',query='',favoriteIds=null){
 const needle=normalizeQuery(query).trim().toLocaleLowerCase();
 return (model[mode]||[]).map(group=>({...group,items:group.items.filter(item=>(!favoriteIds||favoriteIds.has(item.id))&&(scope==='all'||item.scope===scope||(mode==='motion'&&(MOTION_GROUPS.find(major=>'major-'+major.id===scope)?.categories.includes(item.scope)||MOTION_GROUPS.flatMap(major=>major.subgroups).find(minor=>'minor-'+minor.id===scope)?.categories.includes(item.scope))))&&(!needle||item.search.includes(needle)))})).filter(group=>group.items.length);
}
export function navigationSelection(model,route,state){
 const parts=Array.isArray(route)?route:String(route||'').replace(/^#/,'').split('/');
 let mode=state.mode,scope=state.scopes[mode],id=null,groupId=null;
 if(parts[0]==='components'){mode='components';scope=['all','input','display','feedback','navigation','developer'].includes(parts[1])?parts[1]:'all';}
 if(parts[0]==='component'){mode='components';scope=state.scopes.components;for(const group of model.components){const item=group.items.find(item=>item.id===parts[1]);if(item){id=item.id;groupId=group.id;scope=item.scope;break;}}}
 if(parts[0]==='blocks'){
  mode='blocks';scope=state.scopes.blocks;
  if(!parts[1]||parts[1]==='favorites'||parts[1]==='collection'){
   scope=['applications','diagrams','charts','data-grids'].includes(parts[2])?parts[2]:'all';
   if(parts[1]==='collection'&&scope!=='all'&&parts[3]){const group=model.blocks.find(item=>item.id===scope+'-'+parts[3]);if(group)groupId=group.id;}
  }else for(const group of model.blocks){const item=group.items.find(item=>item.id===parts[1]);if(item){id=item.id;groupId=group.id;scope=item.scope;break;}}
 }
 if(parts[0]==='motion'){
  mode='motion';scope='all';
  const motion=getMotion(parts[1]);
  if(motion){id=motion.id;groupId=motion.category;scope=motion.category;}
  else if(parts[1]==='category'&&MOTION_SIDEBAR_ITEMS.includes(parts[2])){groupId=parts[2];scope=parts[2];}
  else if(parts[1]==='major'&&MOTION_GROUPS.some(group=>group.id===parts[2]))scope='major-'+parts[2];
  else if(parts[1]==='minor'&&MOTION_GROUPS.some(group=>group.subgroups.some(item=>item.id===parts[2])))scope='minor-'+parts[2];
 }
 return {mode,scope,id,groupId};
}
function readStored(){try{return normalizeNavigationState(JSON.parse(localStorage.getItem(STORE)||'null'));}catch{return normalizeNavigationState(null);}}
let catalogPromise;
export function loadNavigationBlocks(){if(!catalogPromise)catalogPromise=fetch('./blocks-data.json').then(r=>{if(!r.ok)throw new Error('blocks');return r.json();}).catch(error=>{catalogPromise=null;throw error;});return catalogPromise;}
export function initLibraryNavigation(root,{components,categories,icons=()=>{}}){
 const state=readStored();state.queries={components:'',blocks:'',motion:''};
 let locale=documentLocale(),english=locale==='en',navigationBlocks={blocks:[],categories:[],collections:[]};
 let model=createNavigationModel(components,navigationBlocks,locale),currentRoute=(location.hash.slice(1)||'components').split('/'),selected=null,blocksReady=false,loadFailed=false,lastApplied='',pendingMode=null;
 const modeLabel=mode=>mode==='components'?(english?'Components':'컴포넌트'):mode==='blocks'?(english?'Blocks':'블록'):(english?'Motion':'모션');
 const allItemsLabel=mode=>mode==='components'?(english?'All components':'모든 컴포넌트'):mode==='blocks'?(english?'All blocks':'모든 블록'):(english?'All motions':'모든 모션');
 const viewGroupLabel=mode=>mode==='components'?(english?'Components view':'컴포넌트 보기'):mode==='blocks'?(english?'Blocks view':'블록 보기'):(english?'Motion view':'모션 보기');
 const favoriteLabel=()=>english?'Favorites':'즐겨찾기';
 root.innerHTML='<div class="library-mode-switch"><div class="library-tabs" role="tablist" aria-label="'+(english?'Library navigation':'라이브러리 전환')+'">'+MODES.map(mode=>'<button type="button" role="tab" id="library-tab-'+mode+'" aria-selected="'+(mode===state.mode)+'" aria-controls="library-navigation" tabindex="'+(mode===state.mode?'0':'-1')+'" data-library-mode="'+mode+'">'+modeLabel(mode)+'</button>').join('')+'</div></div><div id="library-navigation" class="library-navigation" role="tabpanel" aria-labelledby="library-tab-'+state.mode+'"><div class="library-controls"><label class="library-scope"><span class="sr-only">'+(english?'Library type':'라이브러리 유형')+'</span>'+icon('grid-2x2')+'<span class="library-scope-current" aria-hidden="true"></span><select id="library-scope" aria-label="'+(english?'Library type':'라이브러리 유형')+'"></select>'+icon('chevron-down')+'</label><div class="library-category-heading"><span>'+(english?'Categories':'카테고리')+'</span><span id="library-search-count" role="status" aria-live="polite"></span><button type="button" class="library-fold" data-library-action="fold" aria-label="'+(english?'Expand all categories':'카테고리 모두 접기')+'">'+icon('list-collapse')+'</button></div></div><div class="library-tree-scroll" id="library-tree-scroll"><div id="library-tree" class="library-tree"></div><div class="library-tree-footer"></div></div></div>';
 const tree=root.querySelector('#library-tree'),scroll=root.querySelector('#library-tree-scroll'),scopeSelect=root.querySelector('#library-scope'),scopeLabel=root.querySelector('.library-scope-current'),footer=root.querySelector('.library-tree-footer'),fold=root.querySelector('[data-library-action=fold]');
 function updateScopeLabel(){scopeLabel.textContent=scopeSelect.selectedOptions[0]?.textContent||'';}
 const favoritesView=document.createElement('div');favoritesView.className='library-favorites-view';favoritesView.setAttribute('role','group');favoritesView.setAttribute('aria-label',viewGroupLabel(state.mode));favoritesView.innerHTML='<button type="button" data-library-view="all" aria-pressed="true">'+allItemsLabel(state.mode)+'</button><button type="button" data-library-view="favorites" aria-pressed="false">'+icon('star')+'<span data-library-favorites-label>'+favoriteLabel()+'</span> <span data-library-favorites-count>0</span></button>';root.querySelector('.library-controls').prepend(favoritesView);
 let favorites={components:readComponentFavorites(),blocks:readBlockFavorites(),motion:readMotionFavorites()};
 const favoritesOnly=(mode=state.mode)=>state.views[mode]==='favorites';
 const hover=initLibraryHoverPreview(root,{isBlocks:()=>state.mode==='blocks',getItem:id=>model.blocks.flatMap(group=>group.items).find(item=>item.id===id)});
 const visibleGroups=(scope=state.scopes[state.mode],query=state.queries[state.mode])=>navigationGroups(model,state.mode,scope,query,favoritesOnly()?favorites[state.mode]:null);
 function favoriteUpdates(){favorites={components:readComponentFavorites(),blocks:readBlockFavorites(),motion:readMotionFavorites()};renderTree();}
 window.addEventListener(MOTION_FAVORITES_EVENT,favoriteUpdates);window.addEventListener(FAVORITES_EVENT,favoriteUpdates);window.addEventListener(COMPONENT_FAVORITES_EVENT,favoriteUpdates);window.addEventListener('storage',event=>{if([FAVORITES_STORAGE_KEY,COMPONENT_FAVORITES_STORAGE_KEY,MOTION_FAVORITES_STORAGE_KEY,null].includes(event.key))favoriteUpdates();});
 function save(){try{localStorage.setItem(STORE,JSON.stringify(state));}catch{}}
 function options(){
  const mode=state.mode;
  scopeSelect.closest('.library-scope').hidden=false;
  scopeSelect.setAttribute('aria-label',english?'Library type':'라이브러리 유형');
  if(mode==='blocks'&&!blocksReady){scopeSelect.disabled=true;scopeSelect.innerHTML='<option lang="'+locale+'">'+(english?'Loading blocks…':'블록 목록을 불러옵니다…')+'</option>';updateScopeLabel();return;}
  scopeSelect.disabled=false;
  const labels=mode==='motion'?{all:allItemsLabel('motion'),...motionNavigationScopeLabels(locale),...(MOTION_CATEGORIES.some(category=>category.id===state.scopes.motion)?Object.fromEntries(MOTION_CATEGORIES.filter(category=>category.id===state.scopes.motion).map(category=>[category.id,localizedMotionCategoryLabel(category,locale)])):{}),...Object.fromEntries(MOTION_GROUPS.flatMap(group=>group.subgroups).filter(item=>'minor-'+item.id===state.scopes.motion).map(item=>['minor-'+item.id,item.label[locale]]))}:mode==='components'?{all:allItemsLabel('components'),...Object.fromEntries(Object.entries(categories).filter(([id])=>id!=='all').map(([id,label])=>[id,localizedTextLabels(label)[locale]]))}:{all:allItemsLabel('blocks'),...Object.fromEntries(Object.entries(BLOCK_COLLECTION_LABELS).map(([id,pair])=>[id,pair[locale]]))};
  scopeSelect.innerHTML=Object.entries(labels).map(([value,label])=>{
   const count=navigationGroups(model,mode,value).reduce((sum,group)=>sum+group.items.length,0);
   return '<option lang="'+locale+'" value="'+value+'" '+(state.scopes[mode]===value?'selected':'')+'>'+esc(label)+' · '+count+'</option>';
  }).join('');
  updateScopeLabel();
 }
 function revealSelection(){
  const active=tree.querySelector('[aria-current=page]');if(!active)return;
  const a=active.getBoundingClientRect(),s=scroll.getBoundingClientRect();
  if(a.top<s.top+8)scroll.scrollTop-=s.top+8-a.top;
  else if(a.bottom>s.bottom-8)scroll.scrollTop+=a.bottom-s.bottom+8;
 }
 function renderTree({reveal=false}={}){
  hover.hide();const mode=state.mode,query=state.queries[mode],groups=visibleGroups();
  const categoryHeading=root.querySelector('.library-category-heading');
  categoryHeading.hidden=false;categoryHeading.querySelector(':scope > span:first-child').textContent=english?'Categories':'카테고리';fold.hidden=false;favoritesView.hidden=false;
  favoritesView.setAttribute('aria-label',viewGroupLabel(mode));favoritesView.querySelector('[data-library-view=all]').textContent=allItemsLabel(mode);favoritesView.querySelector('[data-library-favorites-label]').textContent=favoriteLabel();
  favoritesView.querySelector('[data-library-favorites-count]').textContent=model[mode].flatMap(g=>g.items).filter(item=>favorites[mode].has(item.id)).length;
  for(const button of favoritesView.querySelectorAll('[data-library-view]'))button.setAttribute('aria-pressed',String((button.dataset.libraryView==='favorites')===favoritesOnly()));
  if(state.expanded[mode]===null&&(mode!=='blocks'||blocksReady))state.expanded[mode]=groups.length?[groups[0].id]:[];
  const expanded=new Set(state.expanded[mode]||[]);
  const emptyMessage=favoritesOnly()&&!query.trim()?(mode==='motion'?(english?'No saved motions. Select a star to save one.':'저장한 모션이 없습니다. 별을 눌러 추가하세요.'):mode==='blocks'?(english?'No saved blocks. Select a star to save one.':'저장한 블록이 없습니다. 별을 눌러 추가하세요.'):(english?'No saved components. Select a star to save one.':'저장한 컴포넌트가 없습니다. 별을 눌러 추가하세요.')):(english?'No matching items.':'일치하는 항목이 없습니다.');
  const clearLabel=favoritesOnly()?(mode==='motion'?(english?'View all motions':'전체 모션 보기'):mode==='blocks'?(english?'View all blocks':'전체 블록 보기'):(english?'View all components':'전체 컴포넌트 보기')):(english?'View all items':'전체 항목 보기');
  const emptyTree='<div class="library-empty"><p>'+emptyMessage+'</p><button type="button" data-library-action="clear">'+clearLabel+'</button></div>';
  tree.innerHTML=mode==='blocks'&&!blocksReady?(loadFailed?'<div class="library-empty"><p>'+(english?'Could not load the block list.':'블록 목록을 불러오지 못했어요.')+'</p><button type="button" data-library-action="retry">'+(english?'Retry':'다시 불러오기')+'</button></div>':'<p class="library-loading" role="status">'+(english?'Loading blocks…':'블록 목록을 불러옵니다…')+'</p>'):groups.length?renderLibraryGroups(groups,{expanded:[...expanded],selectedId:selected?.mode===mode?selected.id:null,favorites:favorites[mode],openAll:!!query.trim()||favoritesOnly(),locale}):emptyTree;
  tree.insertAdjacentHTML('afterbegin','<a class="library-overview library-all-items" href="'+(mode==='components'?'#components':mode==='blocks'?'#blocks':'#motion')+'">'+icon('layout-grid')+(mode==='components'?(english?'All components':'모든 컴포넌트'):mode==='blocks'?(english?'All blocks':'모든 블록'):(english?'All motions':'모든 모션'))+'<span>'+(mode==='motion'?MOTION_CATALOG.length:model.totals[mode])+'</span></a>');
  const count=groups.reduce((sum,g)=>sum+g.items.length,0);
  root.querySelector('#library-search-count').textContent=query.trim()?(english?count+' results':count+'개 결과'):'';
  const allOpen=groups.length>0&&groups.every(g=>expanded.has(g.id));
  fold.setAttribute('aria-label',allOpen?(english?'Collapse all categories':'카테고리 모두 접기'):(english?'Expand all categories':'카테고리 모두 펼치기'));
  fold.disabled=!!query.trim()||favoritesOnly()||!groups.length;
  const collectionLabel=english?'View collection':'컬렉션으로 보기';
  footer.innerHTML=mode==='motion'?'<a href="#motion" class="library-overview">'+icon('layout-grid')+collectionLabel+' <span>'+MOTION_CATALOG.length+'</span></a>':mode==='blocks'?'<a href="'+(state.scopes.blocks==='all'?'#blocks':'#blocks/collection/'+state.scopes.blocks)+'" class="library-overview">'+icon('layout-grid')+collectionLabel+'</a>':'<a href="'+(state.scopes.components==='all'?'#components':'#components/'+state.scopes.components)+'" class="library-overview">'+icon('layout-grid')+collectionLabel+' <span>'+model.totals.components+'</span></a>';
  icons(root);
  if(reveal)requestAnimationFrame(revealSelection);
 }
 function paint({reveal=false}={}){
  root.querySelector('.library-tabs').setAttribute('aria-label',english?'Library navigation':'라이브러리 전환');
  for(const button of root.querySelectorAll('[data-library-mode]')){const active=button.dataset.libraryMode===state.mode;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;}
  root.querySelectorAll('[data-library-mode]').forEach(button=>button.textContent=modeLabel(button.dataset.libraryMode));
  root.querySelector('.library-scope .sr-only').textContent=english?'Library type':'라이브러리 유형';
  root.querySelector('#library-navigation').setAttribute('aria-labelledby','library-tab-'+state.mode);
  root.dataset.auxiliary=String(currentRoute[0]==='fonts');
  options();renderTree({reveal});
 }
 function sync(route,{force=false}={}){
  currentRoute=route;
  const key=route.join('/'),previousScope=state.scopes[state.mode],focusedItem=root.contains(document.activeElement)&&document.activeElement.matches('[data-library-item]');
  const next=navigationSelection(model,route,state);
  if(pendingMode&&next.mode!==pendingMode)return;
  if(route[0]==='components'||route[0]==='blocks'||route[0]==='motion'){if(route[1]==='favorites')state.views[next.mode]='favorites';else if(!route[1]||route[1]==='all'||route[1]==='category'||route[1]==='major'||route[1]==='minor'||route[1]==='collection')state.views[next.mode]='all';}
  pendingMode=null;state.mode=next.mode;state.scopes[next.mode]=next.scope;selected=next;
  if(next.id&&!favorites[next.mode].has(next.id)&&lastApplied!==key)state.views[next.mode]='all';
  if(next.id&&!navigationGroups(model,next.mode,next.scope,state.queries[next.mode]).some(g=>g.items.some(item=>item.id===next.id)))state.queries[next.mode]='';
  const groups=navigationGroups(model,state.mode,next.scope);
  if((force||lastApplied!==key)&&next.groupId){state.expanded[next.mode]=[...new Set([...(state.expanded[next.mode]||[]),next.groupId])];}
  else if(previousScope!==next.scope&&!groups.some(g=>state.expanded[next.mode]?.includes(g.id)))state.expanded[next.mode]=groups.length?[groups[0].id]:[];
  if(['component','components','blocks'].includes(route[0]))state.last[next.mode]='#'+key;
  if(route[0]==='motion')state.last.motion='#'+key;
  lastApplied=key;paint({reveal:!!next.id});if(focusedItem)tree.querySelector('[aria-current=page]')?.focus({preventScroll:true});save();
 }
 function localeChanged(event){
  const next=event.detail?.locale;
  if(!['ko','en'].includes(next)||next===locale)return;
  locale=next;english=locale==='en';model=createNavigationModel(components,navigationBlocks,locale);sync(currentRoute,{force:true});
 }
 document.addEventListener('klic:locale-changed',localeChanged);
 const localeObserver=typeof MutationObserver==='function'?new MutationObserver(()=>localeChanged({detail:{locale:document.documentElement.dataset.locale}})):null;
 localeObserver?.observe(document.documentElement,{attributes:true,attributeFilter:['data-locale']});
 async function loadBlocks(){
  loadFailed=false;renderTree();
  try{navigationBlocks=await loadNavigationBlocks();model=createNavigationModel(components,navigationBlocks,locale);blocksReady=true;sync(currentRoute,{force:true});}
  catch{loadFailed=true;if(state.mode==='blocks')renderTree();}
 }
 function navigate(href){if(location.hash!==href)location.hash=href;else sync((href.slice(1)||'components').split('/'),{force:true});}
 root.addEventListener('click',event=>{
  const favorite=event.target.closest('[data-library-favorite]');
  if(favorite){event.preventDefault();const id=favorite.dataset.libraryFavorite;(state.mode==='blocks'?toggleBlockFavorite:state.mode==='motion'?toggleMotionFavorite:toggleComponentFavorite)(id);tree.querySelector('[data-library-favorite="'+id+'"]')?.focus({preventScroll:true});return;}
  const viewButton=event.target.closest('[data-library-view]');if(viewButton){const mode=state.mode;state.views[mode]=viewButton.dataset.libraryView;state.scopes[mode]='all';state.queries[mode]='';save();navigate((mode==='components'?'#components':mode==='blocks'?'#blocks':'#motion')+(state.views[mode]==='favorites'?'/favorites':''));return;}
  const tab=event.target.closest('[data-library-mode]');
  if(tab){state.mode=tab.dataset.libraryMode;pendingMode=state.mode;paint();save();navigate(state.mode==='components'?'#components':state.last[state.mode]);return;}
  const action=event.target.closest('[data-library-action]')?.dataset.libraryAction;
  if(action==='fold'){const groups=visibleGroups(state.scopes[state.mode],''),all=groups.every(g=>state.expanded[state.mode]?.includes(g.id));state.expanded[state.mode]=all?[]:groups.map(g=>g.id);renderTree();save();}
  if(action==='clear'){state.queries[state.mode]='';state.views[state.mode]='all';save();navigate(state.mode==='motion'?'#motion':state.mode==='blocks'?'#blocks':'#components');}
  if(action==='retry')loadBlocks();
  const item=event.target.closest('[data-library-item]');
  if(item){state.last[state.mode]=item.getAttribute('href');save();}
 });
 root.addEventListener('change',event=>{
  if(event.target!==scopeSelect)return;
  updateScopeLabel();
  state.scopes[state.mode]=scopeSelect.value;state.queries[state.mode]='';
  const groups=navigationGroups(model,state.mode,scopeSelect.value);state.expanded[state.mode]=groups.length?[groups[0].id]:[];save();
  navigate(state.mode==='motion'?(scopeSelect.value==='all'?'#motion':(scopeSelect.value.startsWith('major-')?'#motion/major/'+scopeSelect.value.slice(6):scopeSelect.value.startsWith('minor-')?'#motion/minor/'+scopeSelect.value.slice(6):'#motion/category/'+scopeSelect.value)):state.mode==='components'?(scopeSelect.value==='all'?'#components':'#components/'+scopeSelect.value):(scopeSelect.value==='all'?'#blocks':'#blocks/collection/'+scopeSelect.value));
 });
 tree.addEventListener('toggle',event=>{
  if(!event.target.matches('[data-library-group]')||state.queries[state.mode].trim()||favoritesOnly())return;
  const id=event.target.dataset.libraryGroup,set=new Set(state.expanded[state.mode]||[]);
  event.target.open?set.add(id):set.delete(id);state.expanded[state.mode]=[...set];save();
  const groups=navigationGroups(model,state.mode,state.scopes[state.mode]);fold.setAttribute('aria-label',groups.every(g=>set.has(g.id))?'카테고리 모두 접기':'카테고리 모두 펼치기');
 },true);
 sync(currentRoute);loadBlocks();
 return {sync};
}
