import {readMotionFavorites,toggleMotionFavorite,MOTION_FAVORITES_EVENT,MOTION_FAVORITES_STORAGE_KEY} from './motion-favorites.mjs';
import {readComponentFavorites,toggleComponentFavorite,COMPONENT_FAVORITES_EVENT,COMPONENT_FAVORITES_STORAGE_KEY} from './component-favorites.mjs';
import {translateText} from './i18n.mjs';
import {readBlockFavorites,toggleBlockFavorite,FAVORITES_EVENT,FAVORITES_STORAGE_KEY} from './block-favorites.mjs';
import {initLibraryHoverPreview} from './library-hover-preview.mjs';
import {MOTION_CATALOG,MOTION_CATEGORIES,getMotion} from './motion-catalog.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=n=>'<i data-lucide="'+n+'" aria-hidden="true"></i>';
const MODES=['components','blocks','motion'];
export const MOTION_SIDEBAR_ITEMS=Object.freeze(MOTION_CATEGORIES.map(category=>category.id));
function renderLibraryGroups(groups,{expanded=[],selectedId=null,favorites=new Set(),openAll=false}={}){
 return groups.map(group=>'<details class="library-group" data-library-group="'+esc(group.id)+'" '+(openAll||expanded.includes(group.id)?'open':'')+'><summary title="'+esc(group.label)+'"><span class="library-group-name">'+esc(group.label)+'</span><span class="library-group-count">'+group.items.length+'</span></summary><div class="library-items">'+(group.href?'<a class="library-overview" href="'+esc(group.href)+'">'+icon('layout-grid')+'<span>'+esc(group.label)+(documentLocale()==='en'?' · View all':' · 전체 보기')+'</span></a>':'')+group.items.map(item=>'<div class="library-item-row"><a class="library-item '+(selectedId===item.id?'selected':'')+'" href="'+esc(item.href)+'" title="'+esc(item.title)+'" data-library-item="'+esc(item.id)+'" '+(selectedId===item.id?'aria-current="page"':'')+'><span class="library-item-name">'+esc(item.label)+'</span></a><button type="button" class="library-favorite" data-library-favorite="'+esc(item.id)+'" aria-pressed="'+favorites.has(item.id)+'" aria-label="'+esc(item.title)+' 즐겨찾기">'+icon('star')+'</button></div>').join('')+'</div></details>').join('');
}
export function renderMotionNavigation(route=[],{locale='ko',favorites=null}={}){
 const category=route[1]==='category'?route[2]:getMotion(route[1])?.category;
 const model=createNavigationModel([]);
 const groups=navigationGroups(model,'motion','all','',favorites).map(group=>({...group,label:MOTION_CATEGORIES.find(item=>item.id===group.id).label[locale]}));
 return renderLibraryGroups(groups,{expanded:category?[category]:[],selectedId:getMotion(route[1])?.id,favorites:favorites||new Set()});
}
const STORE='klic-library-navigation-v1';
export const COMPONENT_GROUPS=[
 ['ai','AI와 에이전트','decision-inbox tool-call-card smart-recommendation message-actions'],
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
 ['type','텍스트 표시','typography link blockquote code-block kbd']
];
const collectionLabels={applications:'Application',diagrams:'다이어그램',charts:'Charts','data-grids':'Data Grid'};
const safeKey=v=>typeof v==='string'&&/^[a-z0-9-]{1,100}$/.test(v);
const safeHref=(value,mode)=>typeof value==='string'&&(mode==='components'?/^#components(?:\/(?:all|favorites|input|display|feedback|navigation)(?:\/[a-z0-9-]+)?)?$|^#component\/[a-z0-9-]+(?:\/(?:preview|examples|api|code|spec))?$/:mode==='motion'?/^#motion(?:\/(?:favorites|category\/[a-z0-9-]+|[a-z0-9-]+))?$/:/^#blocks(?:\/(?:guide|favorites|collection\/(?:all|applications|diagrams|charts|data-grids)|[a-z0-9-]+)(?:\/(?:preview|code|axes|tokens))?)?$/).test(value);
const normalizeQuery=v=>typeof v==='string'?v.slice(0,120):'';
export function normalizeNavigationState(raw){
 const v=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const state={version:1,mode:MODES.includes(v.mode)?v.mode:'components',views:{components:v.views?.components==='favorites'?'favorites':'all',blocks:v.views?.blocks==='favorites'||(!v.views&&v.favoritesOnly===true)?'favorites':'all',motion:v.views?.motion==='favorites'?'favorites':'all'},scopes:{components:'all',blocks:'all',motion:'all'},queries:{components:'',blocks:'',motion:''},expanded:{components:null,blocks:null,motion:null},last:{components:'#components',blocks:'#blocks',motion:'#motion'}};
 for(const mode of MODES){
  const allowed=mode==='components'?['all','input','display','feedback','navigation']:mode==='blocks'?['all','applications','diagrams','charts','data-grids']:[ 'all',...MOTION_SIDEBAR_ITEMS];
  if(allowed.includes(v.scopes?.[mode]))state.scopes[mode]=v.scopes[mode];
  state.queries[mode]=normalizeQuery(v.queries?.[mode]);
  if(Array.isArray(v.expanded?.[mode]))state.expanded[mode]=[...new Set(v.expanded[mode].filter(safeKey))].slice(0,100);
  if(safeHref(v.last?.[mode],mode))state.last[mode]=v.last[mode];
 }
 return state;
}
const documentLocale=()=>globalThis.document?.documentElement?.dataset?.locale==='en'?'en':'ko';
const searchable=(...values)=>values.flat(Infinity).filter(Boolean).flatMap(value=>[value,translateText(value)]).join(' ').toLocaleLowerCase();
export function createNavigationModel(components,blockData={blocks:[],categories:[],collections:[]}){
 const componentMap=new Map(components.map(c=>[c.id,c])),groupById=new Map();
 const componentGroups=COMPONENT_GROUPS.map(([id,label,ids])=>{
  const items=ids.split(' ').map(key=>componentMap.get(key)).filter(Boolean).map(c=>{
   if(groupById.has(c.id))throw new Error('Duplicate component navigation id: '+c.id);groupById.set(c.id,id);
   return {id:c.id,label:c.name,title:c.name,scope:c.category,href:'#component/'+c.id,search:searchable(c.id,c.name,c.ko,c.description,c.tags,label)};
  });return{id,label,items};
 }).filter(g=>g.items.length);
 const remaining=components.filter(c=>!groupById.has(c.id));
 if(remaining.length)componentGroups.push({id:'other',label:'기타 컴포넌트',items:remaining.map(c=>({id:c.id,label:c.name,title:c.name,scope:c.category,href:'#component/'+c.id,search:searchable(c.id,c.name,c.ko,c.description,c.tags)}))});
 const blocks=(blockData.blocks||[]).filter(b=>b.implemented);
 const blockGroups=(blockData.categories||[]).map(category=>({
  id:category.collection+'-'+category.id,label:category.name,scope:category.collection,
  items:blocks.filter(b=>b.collection===category.collection&&b.categoryId===category.id).map(b=>({
   id:b.id,label:b.catalogTitle||b.title.replace(/\s*\([^)]*\)\s*$/u,'').trim(),title:b.title,categoryLabel:category.name,scope:b.collection,href:'#blocks/'+b.id,search:searchable(b.id,b.title,b.catalogTitle,b.description,b.tags,b.categoryName)
  }))
 })).filter(g=>g.items.length);
 const seen=new Set();for(const group of blockGroups)for(const item of group.items){if(seen.has(item.id))throw new Error('Duplicate block navigation id: '+item.id);seen.add(item.id);}
 if(seen.size!==blocks.length)throw new Error('Every implemented block needs a navigation category');
 const motionGroups=MOTION_CATEGORIES.map(category=>({id:category.id,label:category.label[documentLocale()],href:'#motion/category/'+category.id,items:MOTION_CATALOG.filter(motion=>motion.category===category.id).map(motion=>({id:motion.id,label:motion.title[documentLocale()],title:motion.title[documentLocale()],scope:category.id,href:'#motion/'+motion.id,search:searchable(motion.id,Object.values(motion.title),Object.values(motion.summary))}))}));
 return {components:componentGroups,blocks:blockGroups,motion:motionGroups,totals:{components:components.length,blocks:blocks.length},planned:(blockData.blocks||[]).filter(b=>!b.implemented).length};
}
export function navigationGroups(model,mode,scope='all',query='',favoriteIds=null){
 const needle=normalizeQuery(query).trim().toLocaleLowerCase();
 return (model[mode]||[]).map(group=>({...group,items:group.items.filter(item=>(!favoriteIds||favoriteIds.has(item.id))&&(scope==='all'||item.scope===scope)&&(!needle||item.search.includes(needle)))})).filter(group=>group.items.length);
}
export function navigationSelection(model,route,state){
 const parts=Array.isArray(route)?route:String(route||'').replace(/^#/,'').split('/');
 let mode=state.mode,scope=state.scopes[mode],id=null,groupId=null;
 if(parts[0]==='components'){mode='components';scope=['all','input','display','feedback','navigation'].includes(parts[1])?parts[1]:'all';}
 if(parts[0]==='component'){mode='components';scope=state.scopes.components;for(const group of model.components){const item=group.items.find(item=>item.id===parts[1]);if(item){id=item.id;groupId=group.id;scope=item.scope;break;}}}
 if(parts[0]==='blocks'){
  mode='blocks';scope=state.scopes.blocks;
  if(!parts[1]||parts[1]==='favorites'||parts[1]==='collection')scope=['applications','diagrams','charts','data-grids'].includes(parts[2])?parts[2]:'all';
  else for(const group of model.blocks){const item=group.items.find(item=>item.id===parts[1]);if(item){id=item.id;groupId=group.id;scope=item.scope;break;}}
 }
 if(parts[0]==='motion'){
  mode='motion';scope='all';
  const motion=getMotion(parts[1]);
  if(motion){id=motion.id;groupId=motion.category;scope=motion.category;}
  else if(parts[1]==='category'&&MOTION_SIDEBAR_ITEMS.includes(parts[2])){groupId=parts[2];scope=parts[2];}
 }
 return {mode,scope,id,groupId};
}
function readStored(){try{return normalizeNavigationState(JSON.parse(localStorage.getItem(STORE)||'null'));}catch{return normalizeNavigationState(null);}}
let catalogPromise;
export function loadNavigationBlocks(){if(!catalogPromise)catalogPromise=fetch('./blocks-data.json').then(r=>{if(!r.ok)throw new Error('blocks');return r.json();}).catch(error=>{catalogPromise=null;throw error;});return catalogPromise;}
export function initLibraryNavigation(root,{components,categories,icons=()=>{}}){
 const state=readStored();state.queries={components:'',blocks:'',motion:''};
 let model=createNavigationModel(components),currentRoute=(location.hash.slice(1)||'components').split('/'),selected=null,blocksReady=false,loadFailed=false,lastApplied='',pendingMode=null;
 const english=document.documentElement.dataset.locale==='en';
 root.innerHTML='<div class="library-mode-switch"><div class="library-tabs" role="tablist" aria-label="'+(english?'Library navigation':'라이브러리 전환')+'">'+MODES.map(mode=>'<button type="button" role="tab" id="library-tab-'+mode+'" aria-selected="'+(mode===state.mode)+'" aria-controls="library-navigation" tabindex="'+(mode===state.mode?'0':'-1')+'" data-library-mode="'+mode+'">'+(mode==='components'?(english?'Components':'컴포넌트'):mode==='blocks'?(english?'Blocks':'블록'):(english?'Motion':'모션'))+'</button>').join('')+'</div></div><div id="library-navigation" class="library-navigation" role="tabpanel" aria-labelledby="library-tab-'+state.mode+'"><div class="library-controls"><label class="library-scope"><span class="sr-only">라이브러리 유형</span>'+icon('grid-2x2')+'<span class="library-scope-current" aria-hidden="true"></span><select id="library-scope" aria-label="라이브러리 유형"></select>'+icon('chevron-down')+'</label><div class="library-category-heading"><span>카테고리</span><span id="library-search-count" role="status" aria-live="polite"></span><button type="button" class="library-fold" data-library-action="fold" aria-label="카테고리 모두 접기">'+icon('list-collapse')+'</button></div></div><div class="library-tree-scroll" id="library-tree-scroll"><div id="library-tree" class="library-tree"></div><div class="library-tree-footer"></div></div></div>';
 const tree=root.querySelector('#library-tree'),scroll=root.querySelector('#library-tree-scroll'),scopeSelect=root.querySelector('#library-scope'),scopeLabel=root.querySelector('.library-scope-current'),footer=root.querySelector('.library-tree-footer'),fold=root.querySelector('[data-library-action=fold]');
 function updateScopeLabel(){scopeLabel.textContent=scopeSelect.selectedOptions[0]?.textContent||'';}
 const favoritesView=document.createElement('div');favoritesView.className='library-favorites-view';favoritesView.setAttribute('role','group');favoritesView.setAttribute('aria-label','블록 보기');favoritesView.innerHTML='<button type="button" data-library-view="all" aria-pressed="true">전체 블록</button><button type="button" data-library-view="favorites" aria-pressed="false">'+icon('star')+'즐겨찾기 <span data-library-favorites-count>0</span></button>';root.querySelector('.library-controls').prepend(favoritesView);
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
  if(mode==='blocks'&&!blocksReady){scopeSelect.disabled=true;scopeSelect.innerHTML='<option>블록 목록을 불러옵니다…</option>';updateScopeLabel();return;}
  scopeSelect.disabled=false;
  const labels=mode==='components'?{all:'모든 컴포넌트',...Object.fromEntries(Object.entries(categories).filter(([id])=>id!=='all'))}:mode==='blocks'?{all:'모든 블록',...collectionLabels}:{all:'모든 모션',...Object.fromEntries(MOTION_CATEGORIES.map(category=>[category.id,category.label[english?'en':'ko']]))};
  scopeSelect.innerHTML=Object.entries(labels).map(([value,label])=>{
   const count=navigationGroups(model,mode,value).reduce((sum,group)=>sum+group.items.length,0);
   return '<option value="'+value+'" '+(state.scopes[mode]===value?'selected':'')+'>'+esc(label)+' · '+count+'</option>';
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
  categoryHeading.hidden=false;fold.hidden=false;favoritesView.hidden=false;
  favoritesView.setAttribute('aria-label',mode==='blocks'?'블록 보기':mode==='motion'?'모션 보기':'컴포넌트 보기');favoritesView.querySelector('[data-library-view=all]').textContent=mode==='blocks'?'전체 블록':mode==='motion'?'전체 모션':'전체 컴포넌트';
  favoritesView.querySelector('[data-library-favorites-count]').textContent=model[mode].flatMap(g=>g.items).filter(item=>favorites[mode].has(item.id)).length;
  for(const button of favoritesView.querySelectorAll('[data-library-view]'))button.setAttribute('aria-pressed',String((button.dataset.libraryView==='favorites')===favoritesOnly()));
  if(state.expanded[mode]===null&&(mode!=='blocks'||blocksReady))state.expanded[mode]=groups.length?[groups[0].id]:[];
  const expanded=new Set(state.expanded[mode]||[]);
  tree.innerHTML=mode==='blocks'&&!blocksReady?(loadFailed?'<div class="library-empty"><p>목록을 불러오지 못했어요.</p><button type="button" data-library-action="retry">다시 불러오기</button></div>':'<p class="library-loading" role="status">블록 목록을 불러옵니다…</p>'):groups.length?renderLibraryGroups(groups,{expanded:[...expanded],selectedId:selected?.mode===mode?selected.id:null,favorites:favorites[mode],openAll:!!query.trim()||favoritesOnly()}):'<div class="library-empty"><p>'+(favoritesOnly()&&!query.trim()?(mode==='blocks'?'저장한 블록이 없습니다. 메뉴의 별을 눌러 추가하세요.':mode==='motion'?'저장한 모션이 없습니다. 메뉴의 별을 눌러 추가하세요.':'저장한 컴포넌트가 없습니다. 메뉴의 별을 눌러 추가하세요.'):'일치하는 항목이 없습니다.')+'</p><button type="button" data-library-action="clear">'+(favoritesOnly()?(mode==='blocks'?'전체 블록 보기':mode==='motion'?'전체 모션 보기':'전체 컴포넌트 보기'):'전체 항목 보기')+'</button></div>';
  tree.insertAdjacentHTML('afterbegin','<a class="library-overview library-all-items" href="'+(mode==='components'?'#components':mode==='blocks'?'#blocks':'#motion')+'">'+icon('layout-grid')+(mode==='components'?(english?'All components':'모든 컴포넌트'):mode==='blocks'?(english?'All blocks':'모든 블록'):(english?'All motions':'모든 모션'))+'<span>'+(mode==='motion'?MOTION_CATALOG.length:model.totals[mode])+'</span></a>');
  const count=groups.reduce((sum,g)=>sum+g.items.length,0);
  root.querySelector('#library-search-count').textContent=query.trim()?count+'개 결과':'';
  const allOpen=groups.length>0&&groups.every(g=>expanded.has(g.id));
  fold.setAttribute('aria-label',allOpen?'카테고리 모두 접기':'카테고리 모두 펼치기');
  fold.disabled=!!query.trim()||favoritesOnly()||!groups.length;
  footer.innerHTML=mode==='motion'?'<a href="#motion" class="library-overview">'+icon('layout-grid')+'전체 모션 페이지 <span>'+MOTION_CATALOG.length+'</span></a>':mode==='blocks'?'<a href="'+(state.scopes.blocks==='all'?'#blocks':'#blocks/collection/'+state.scopes.blocks)+'" class="library-overview">'+icon('layout-grid')+'컬렉션으로 보기</a><a href="#blocks/guide" class="library-overview">'+icon('book-open')+'적용 가이드</a>':'<a href="'+(state.scopes.components==='all'?'#components':'#components/'+state.scopes.components)+'" class="library-overview">'+icon('layout-grid')+'컬렉션으로 보기 <span>'+model.totals.components+'</span></a>';
  icons(root);
  if(reveal)requestAnimationFrame(revealSelection);
 }
 function paint({reveal=false}={}){
  for(const button of root.querySelectorAll('[data-library-mode]')){const active=button.dataset.libraryMode===state.mode;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;}
  root.querySelector('#library-navigation').setAttribute('aria-labelledby','library-tab-'+state.mode);
  root.dataset.auxiliary=String(currentRoute[0]==='fonts');
  options();renderTree({reveal});
 }
 function sync(route,{force=false}={}){
  currentRoute=route;
  const key=route.join('/'),previousScope=state.scopes[state.mode],focusedItem=root.contains(document.activeElement)&&document.activeElement.matches('[data-library-item]');
  const next=navigationSelection(model,route,state);
  if(pendingMode&&next.mode!==pendingMode)return;
  if(route[0]==='components'||route[0]==='blocks'||route[0]==='motion'){if(route[1]==='favorites')state.views[next.mode]='favorites';else if(!route[1]||route[1]==='all'||route[1]==='category'||route[1]==='collection')state.views[next.mode]='all';}
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
 async function loadBlocks(){
  loadFailed=false;renderTree();
  try{const data=await loadNavigationBlocks();model=createNavigationModel(components,data);blocksReady=true;sync(currentRoute,{force:true});}
  catch{loadFailed=true;if(state.mode==='blocks')renderTree();}
 }
 function navigate(href){if(location.hash!==href)location.hash=href;else sync((href.slice(1)||'components').split('/'),{force:true});}
 root.addEventListener('click',event=>{
  const favorite=event.target.closest('[data-library-favorite]');
  if(favorite){event.preventDefault();const id=favorite.dataset.libraryFavorite;(state.mode==='blocks'?toggleBlockFavorite:state.mode==='motion'?toggleMotionFavorite:toggleComponentFavorite)(id);tree.querySelector('[data-library-favorite="'+id+'"]')?.focus({preventScroll:true});return;}
  const viewButton=event.target.closest('[data-library-view]');if(viewButton){const mode=state.mode;state.views[mode]=viewButton.dataset.libraryView;state.scopes[mode]='all';state.queries[mode]='';save();navigate((mode==='components'?'#components':mode==='blocks'?'#blocks':'#motion')+(state.views[mode]==='favorites'?'/favorites':''));return;}
  const tab=event.target.closest('[data-library-mode]');
  if(tab){state.mode=tab.dataset.libraryMode;pendingMode=state.mode;paint();save();navigate(state.last[state.mode]);return;}
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
  navigate(state.mode==='motion'?(scopeSelect.value==='all'?'#motion':'#motion/category/'+scopeSelect.value):state.mode==='components'?(scopeSelect.value==='all'?'#components':'#components/'+scopeSelect.value):(scopeSelect.value==='all'?'#blocks':'#blocks/collection/'+scopeSelect.value));
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
