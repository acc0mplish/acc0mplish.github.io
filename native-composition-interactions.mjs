import {isComposingInput,isUsableNativeFocusTarget,restoreNativeFocus} from './keyboard-guards.mjs';
import {canonicalClassName} from './native-class-contract.mjs';

export {isComposingInput,restoreNativeFocus};

export const NATIVE_WORKFLOW_ROWS=Object.freeze([
 Object.freeze({id:'p-01',name:'KLIC 디자인 시스템',owner:'김하늘',team:'디자인',status:'진행 중',summary:'컴포넌트 탐색과 사용 안내를 정리합니다.'}),
 Object.freeze({id:'p-02',name:'브랜드 리뉴얼',owner:'이지원',team:'디자인',status:'검토',summary:'회사 블루와 중립 표면을 점검합니다.'}),
 Object.freeze({id:'p-03',name:'모바일 앱 접근성',owner:'박선준',team:'제품',status:'진행 중',summary:'키보드와 화면 읽기 흐름을 확인합니다.'}),
 Object.freeze({id:'p-04',name:'토큰 문서 개선',owner:'한소윤',team:'운영',status:'완료',summary:'4계층 토큰의 연결 관계를 설명합니다.'}),
 Object.freeze({id:'p-05',name:'팀 프로젝트 보드',owner:'김하늘',team:'제품',status:'검토',summary:'목록과 상세 정보의 일관성을 확인합니다.'}),
 Object.freeze({id:'p-06',name:'검색 흐름 점검',owner:'이지원',team:'운영',status:'완료',summary:'한국어 검색과 필터 결과를 살펴봅니다.'})
]);

const cloneRows=rows=>rows.map(row=>({...row}));
const normalized=value=>String(value??'').trim().toLocaleLowerCase('ko');

export function filterWorkflowRows(rows,query='',filter='all'){
 const needle=normalized(query);
 return rows.filter(row=>{
  const statusMatches=filter==='all'||row.status===filter;
  const textMatches=!needle||normalized([row.name,row.owner,row.team,row.status,row.summary].join(' ')).includes(needle);
  return statusMatches&&textMatches;
 });
}

const pause=duration=>new Promise(resolve=>setTimeout(resolve,duration));
async function loadWorkflowRows({simulateError=false}={}){
 await pause(220);
 if(simulateError)throw new Error('샘플 목록을 불러오지 못했습니다. 다시 시도할 수 있습니다.');
 return cloneRows(NATIVE_WORKFLOW_ROWS);
}

export function createDataWorkflowController({loadRows=loadWorkflowRows,onChange=()=>{}}={}){
 const state={rows:[],query:'',filter:'all',selectedId:null,editing:null,loading:false,error:'',loaded:false,loadedQuery:'',loadedFilter:'all'};
 const requests=new Map(),localEdits=new Map();
 let activeRequest=null;
 const getState=()=>{
  const keepLoaded=state.loading||Boolean(state.error);
  const visibleRows=filterWorkflowRows(state.rows,keepLoaded?state.loadedQuery:state.query,keepLoaded?state.loadedFilter:state.filter);
  const emptyKind=!state.loaded?'initial':visibleRows.length?'':state.query.trim()||state.filter!=='all'?'filtered':'empty';
  return {...state,rows:cloneRows(state.rows),visibleRows:cloneRows(visibleRows),editing:state.editing?{...state.editing}:null,emptyKind};
 };
 const emit=()=>onChange(getState());
 function search(query=state.query,{simulateError=false}={}){
  state.query=String(query??'');
  const filterAtRequest=state.filter;
  const key=JSON.stringify([state.query,filterAtRequest,Boolean(simulateError)]);
  const existing=requests.get(key);
  if(existing&&!existing.settled){activeRequest=existing;state.loading=true;state.error='';emit();return existing.promise;}
  const request={query:state.query,filter:filterAtRequest,settled:false,promise:null};
  activeRequest=request;
  state.loading=true;state.error='';emit();
  let operation;
  try{operation=loadRows({query:state.query,filter:filterAtRequest,simulateError:Boolean(simulateError)});}catch(error){operation=Promise.reject(error);}
  let pending;
  pending=Promise.resolve(operation).then(rows=>{
   request.settled=true;
   if(request!==activeRequest)return {stale:true};
   if(!Array.isArray(rows))throw new TypeError('Native workflow loader must return an array');
   state.rows=cloneRows(rows).map(row=>loadRows===loadWorkflowRows&&localEdits.has(row.id)?{...row,...localEdits.get(row.id)}:row);state.loaded=true;state.loadedQuery=request.query;state.loadedFilter=request.filter;state.loading=false;state.error='';
   if(state.selectedId&&!state.rows.some(row=>row.id===state.selectedId))state.selectedId=null;
   if(state.editing&&!state.rows.some(row=>row.id===state.editing.id))state.editing=null;
   emit();return {stale:false,rows:getState().visibleRows};
  }).catch(error=>{
   request.settled=true;
   if(request!==activeRequest)return {stale:true};
   state.loading=false;state.error=String(error?.message||'목록을 불러오지 못했습니다.');emit();return {stale:false,error:state.error};
  }).finally(()=>{if(requests.get(key)===request)requests.delete(key);});
  request.promise=pending;requests.set(key,request);
  return pending;
 }
 function select(id){if(state.rows.some(row=>row.id===id)){state.selectedId=id;emit();return true;}return false;}
 function beginEdit(id=state.selectedId){const row=state.rows.find(item=>item.id===id);if(!row)return false;state.selectedId=id;state.editing={...row};emit();return true;}
 function updateDraft(field,value){if(!state.editing||!['name','owner','status'].includes(field))return false;state.editing[field]=String(value??'');emit();return true;}
 function saveEdit(){
  if(!state.editing)return false;
  const draft={...state.editing};
  if(!draft.name.trim()||!draft.owner.trim())return false;
  state.rows=state.rows.map(row=>row.id===draft.id?draft:row);if(loadRows===loadWorkflowRows)localEdits.set(draft.id,draft);state.selectedId=draft.id;state.editing=null;emit();return true;
 }
 function cancelEdit(){if(!state.editing)return false;state.editing=null;emit();return true;}
 function setFilter(filter){state.filter=String(filter||'all');emit();return getState();}
 function retry(){return search(state.query);}
 return {getState,search,retry,select,beginEdit,updateDraft,saveEdit,cancelEdit,setFilter};
}

export function createRetryFormController({save,onChange=()=>{}}={}){
 if(typeof save!=='function')throw new TypeError('A local save function is required');
 const state={status:'idle',values:null,error:'',result:null};
 let pending=null;
 const getState=()=>({...state,values:state.values?{...state.values}:null});
 const emit=()=>onChange(getState());
 function submit(values){
  if(pending)return pending;
  state.values={name:String(values?.name??''),email:String(values?.email??'')};state.status='saving';state.error='';state.result=null;emit();
  let operation;
  try{operation=save({...state.values});}catch(error){operation=Promise.reject(error);}
  let request;
  request=Promise.resolve(operation).then(result=>{
   state.status='success';state.error='';state.result=result??null;emit();return {ok:true,result:state.result};
  }).catch(error=>{
   state.status='error';state.error=String(error?.message||'저장하지 못했습니다.');emit();return {ok:false,error:state.error};
  }).finally(()=>{if(pending===request)pending=null;});
  pending=request;return request;
 }
 return {getState,submit};
}

const select=(root,selector)=>root.querySelector(selector);
const selectAll=(root,selector)=>[...root.querySelectorAll(selector)];
const setText=(root,selector,value)=>{const target=select(root,selector);if(target)target.textContent=value;};
const make=(tag,className,text)=>{const node=document.createElement(tag);if(className){const classes=[],parts=[];for(const token of String(className).split(/\s+/).filter(Boolean)){const normalized=canonicalClassName(token);if(normalized){classes.push(normalized);if(/^(?:kn|ku)-/.test(normalized))parts.push(normalized.replace(/^(?:kn|ku)-/,''));}}node.className=classes.join(' ');if(parts.length)node.setAttribute('data-part',parts.join(' '));}if(text!==undefined)node.textContent=text;return node;};
const matches=(event,selector)=>event.target?.closest?.(selector);

function renderWorkflow(root,state){
 const rows=select(root,'[data-workflow-rows]'),grid=select(root,'[data-workflow-grid]'),empty=select(root,'[data-workflow-empty]');
 if(!rows||!grid||!empty)return;
 const rowFocus=rows.contains(document.activeElement)?{id:document.activeElement.dataset.nativeId,tag:document.activeElement.className}:null;
 grid.setAttribute('aria-busy',String(state.loading));
 grid.hidden=state.visibleRows.length===0;
 rows.replaceChildren(...state.visibleRows.map(row=>{
  const tr=make('tr');
  const selection=make('td'),selectButton=make('button','btn secondary sm','선택');
  selectButton.type='button';selectButton.dataset.nativeAction='select-workflow-row';selectButton.dataset.nativeId=row.id;selectButton.setAttribute('aria-pressed',String(state.selectedId===row.id));selection.append(selectButton);
  const name=make('th');name.scope='row';const nameButton=make('button','text-link',row.name);nameButton.type='button';nameButton.dataset.nativeAction='select-workflow-row';nameButton.dataset.nativeId=row.id;nameButton.setAttribute('aria-pressed',String(state.selectedId===row.id));name.append(nameButton);
  const owner=make('td','',row.owner),status=make('td');const badge=make('span','badge',row.status);status.append(badge);
  tr.append(selection,name,owner,status);return tr;
 }));
 if(rowFocus?.id){const target=selectAll(rows,'[data-native-id]').find(node=>node.dataset.nativeId===rowFocus.id&&node.className===rowFocus.tag);target?.focus({preventScroll:true});}
 const emptyTitle=select(root,'[data-workflow-empty-title]'),emptyDescription=select(root,'[data-workflow-empty-description]'),clear=select(root,'[data-native-action="clear-workflow-filter"]');
 empty.hidden=state.visibleRows.length>0;
 if(emptyTitle)emptyTitle.textContent=state.emptyKind==='initial'?'아직 불러온 프로젝트가 없습니다.':state.emptyKind==='filtered'?'조건에 맞는 프로젝트가 없습니다.':'표시할 프로젝트가 없습니다.';
 if(emptyDescription)emptyDescription.textContent=state.emptyKind==='initial'?'샘플 데이터를 불러오면 검색과 선택을 시작할 수 있습니다.':state.emptyKind==='filtered'?'검색어를 바꾸거나 상태 필터를 지우세요.':'현재 표시할 데이터가 없습니다.';
 if(clear)clear.hidden=state.emptyKind!=='filtered';
 setText(root,'[data-workflow-status]',state.loading?'프로젝트를 불러오는 중입니다.':state.error?'목록을 불러오지 못했습니다. 이전 결과와 선택은 유지했습니다.':state.loaded?state.visibleRows.length?'프로젝트 목록을 불러왔습니다.':'표시할 프로젝트가 없습니다.':'목록이 비어 있습니다. 샘플 데이터를 불러오세요.');
 const error=select(root,'[data-workflow-error]'),errorMessage=select(root,'[data-workflow-error-message]');
 if(error)error.hidden=!state.error;
 if(errorMessage)errorMessage.textContent=state.error||'';
 const selected=state.rows.find(row=>row.id===state.selectedId),detail=select(root,'[data-workflow-detail]'),edit=select(root,'[data-workflow-edit]');
 if(detail)detail.hidden=!selected||Boolean(state.editing);
 if(selected){setText(root,'[data-workflow-detail-name]',selected.name);setText(root,'[data-workflow-detail-owner]',selected.owner);setText(root,'[data-workflow-detail-status]',selected.status);}
 if(edit){edit.hidden=!state.editing;if(state.editing){for(const [selector,value] of [['[data-workflow-edit-name]',state.editing.name],['[data-workflow-edit-owner]',state.editing.owner],['[data-workflow-edit-status]',state.editing.status]]){const input=select(root,selector);if(input&&input.value!==value)input.value=value;}}}
}

function bindWorkflow(root){
 let controller;
 controller=createDataWorkflowController({onChange:state=>renderWorkflow(root,state)});
 root.addEventListener('input',event=>{const input=matches(event,'[data-workflow-query]');if(input)void controller.search(input.value);const draft=matches(event,'[data-workflow-edit-name], [data-workflow-edit-owner], [data-workflow-edit-status]');if(draft)controller.updateDraft(draft.name,draft.value);});
 root.addEventListener('change',event=>{const filter=matches(event,'[data-workflow-filter]');if(filter){controller.setFilter(filter.value);setText(root,'[data-workflow-status]','상태 필터를 적용했습니다.');}const draft=matches(event,'[data-workflow-edit-name], [data-workflow-edit-owner], [data-workflow-edit-status]');if(draft)controller.updateDraft(draft.name,draft.value);});
 root.addEventListener('click',event=>{
  const button=matches(event,'[data-native-action]');if(!button)return;
  const query=select(root,'[data-workflow-query]'),filter=select(root,'[data-workflow-filter]');
  if(button.dataset.nativeAction==='load-workflow')void controller.search(query?.value||'');
  else if(button.dataset.nativeAction==='simulate-workflow-error')void controller.search(query?.value||'',{simulateError:true});
  else if(button.dataset.nativeAction==='retry-workflow')void controller.retry();
  else if(button.dataset.nativeAction==='clear-workflow-filter'){if(query)query.value='';if(filter)filter.value='all';controller.setFilter('all');void controller.search('');setText(root,'[data-workflow-status]','검색과 필터를 지웠습니다.');}
  else if(button.dataset.nativeAction==='select-workflow-row'){if(controller.select(button.dataset.nativeId))setText(root,'[data-workflow-status]','프로젝트를 선택했습니다. 상세를 확인하고 수정할 수 있습니다.');}
  else if(button.dataset.nativeAction==='edit-workflow'){if(controller.beginEdit())setText(root,'[data-workflow-status]','프로젝트를 수정 중입니다.');}
  else if(button.dataset.nativeAction==='cancel-workflow-edit'){if(controller.cancelEdit())setText(root,'[data-workflow-status]','프로젝트 수정을 취소했습니다.');}
 });
 root.addEventListener('submit',event=>{
  const form=matches(event,'[data-workflow-edit]');if(!form)return;
  if(isComposingInput(event,document.activeElement)){event.preventDefault();return;}
  event.preventDefault();
  for(const field of ['name','owner','status']){const input=form.elements.namedItem(field);if(input)controller.updateDraft(field,input.value);}
  if(!form.reportValidity())return;
  if(controller.saveEdit())setText(root,'[data-workflow-status]','프로젝트 변경사항을 이 화면에 저장했습니다.');
 });
 renderWorkflow(root,controller.getState());
}

function renderRetryForm(form,state){
 form.setAttribute('aria-busy',String(state.status==='saving'));
 const button=select(form,'[data-native-form-submit]');if(button){button.disabled=state.status==='saving';button.textContent=state.status==='error'?'다시 시도':state.status==='success'?'다시 저장':'저장하기';}
 const error=select(form,'[data-native-form-error]'),errorMessage=select(form,'[data-native-form-error-message]'),success=select(form,'[data-native-form-success]'),status=select(form,'[data-native-form-status]');
 if(error)error.hidden=state.status!=='error';
 if(errorMessage)errorMessage.textContent=state.status==='error'?state.error:'';
 if(success)success.hidden=state.status!=='success';
 if(status)status.textContent=state.status==='saving'?'저장 중입니다.':state.status==='success'?'로컬 저장을 완료했습니다.':state.status==='idle'?'첫 요청은 오류 후 재시도하는 동작을 보여줍니다.':'';
}

function bindRetryForm(root){
 const form=select(root,'[data-native-retry-form]');if(!form)return;
 let attempts=0;
 const controller=createRetryFormController({save:async values=>{await pause(450);attempts++;if(attempts===1)throw new Error('첫 저장을 완료하지 못했습니다.');return {saved:true,name:values.name};},onChange:state=>renderRetryForm(form,state)});
 form.addEventListener('submit',event=>{
  const input=document.activeElement;
  if(isComposingInput(event,input)){event.preventDefault();return;}
  event.preventDefault();
  if(!form.reportValidity())return;
  const data=new FormData(form);
  void controller.submit({name:data.get('name'),email:data.get('email')});
 });
 renderRetryForm(form,controller.getState());
}

const dialogOpeners=new WeakMap();
function dialogFallback(root,name){
 const preferred=name==='filter'?select(root,'[data-native-action="open-filter-dialog"]'):select(root,'[data-native-action="open-search-dialog"]');
 const local=[preferred,...selectAll(root,'button:not(:disabled), input:not(:disabled), a[href]')].find(isUsableNativeFocusTarget);
 return local||root.ownerDocument.querySelector('#main-content');
}
function closeCombo(input){
 const list=input?.ownerDocument?.getElementById(input.getAttribute('aria-controls'));
 if(input){input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');input.dataset.nativeComboIndex='-1';}
 if(list){list.hidden=true;list.querySelectorAll('[data-native-combo-option]').forEach(option=>option.setAttribute('aria-selected','false'));}
}
function bindOverlayDialog(root,dialog){
 if(dialog.dataset.nativeDialogBound)return;
 dialog.dataset.nativeDialogBound='true';
 dialog.addEventListener('cancel',event=>{
  const active=dialog.ownerDocument.activeElement;
  if(isComposingInput(event,active)){event.preventDefault();return;}
  if(dialog.dataset.nativeDialog==='search'){
   const combo=select(dialog,'[data-native-combobox][aria-expanded="true"]');
   if(combo){event.preventDefault();closeCombo(combo);combo.focus({preventScroll:true});}
  }
 });
 dialog.addEventListener('close',()=>{
  restoreNativeFocus(dialogOpeners.get(dialog),dialogFallback(root,dialog.dataset.nativeDialog));
  if(dialog.dataset.nativeDialog==='search'){const message=dialog.dataset.nativeCloseStatus||'검색 대화상자를 닫았습니다.';delete dialog.dataset.nativeCloseStatus;setText(root,'[data-overlay-page-status]',message);}
 });
}
function openOverlayDialog(root,name,opener){
 const dialog=select(root,`dialog[data-native-dialog="${name}"]`);if(!dialog||dialog.open)return;
 dialogOpeners.set(dialog,opener);bindOverlayDialog(root,dialog);dialog.showModal();
}
function closeOverlayDialog(root,name){
 const dialog=select(root,`dialog[data-native-dialog="${name}"]`);if(!dialog?.open)return;
 if(name==='search'){
  const nested=select(dialog,'dialog[data-native-dialog="filter"]');if(nested?.open)nested.close();
 }
 dialog.close();
}
function setComboOptions(input,query){
 const list=input?.ownerDocument?.getElementById(input.getAttribute('aria-controls'));if(!list)return [];
 const needle=normalized(query),options=selectAll(list,'[data-native-combo-option]');
 const visible=options.filter(option=>normalized(option.textContent).includes(needle));
 options.forEach(option=>{option.hidden=!visible.includes(option);option.setAttribute('aria-selected','false');});
 list.hidden=visible.length===0;input.setAttribute('aria-expanded',String(visible.length>0));input.dataset.nativeComboIndex='-1';input.removeAttribute('aria-activedescendant');
 return visible;
}
function chooseComboOption(root,input,option){
 if(!input||!option)return;
 input.value=option.textContent.trim();
 const list=input.ownerDocument.getElementById(input.getAttribute('aria-controls'));
 list?.querySelectorAll('[data-native-combo-option]').forEach(item=>item.setAttribute('aria-selected',String(item===option)));
 if(list)list.hidden=true;
 input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');input.dataset.nativeComboIndex='-1';
 setText(root,'[data-overlay-status]','팀을 선택했습니다.');
 input.dataset.nativeComboRestoring='true';
 try{input.focus({preventScroll:true});}finally{delete input.dataset.nativeComboRestoring;}
}
function bindOverlay(root){
 const dialogs=selectAll(root,'dialog[data-native-dialog]');dialogs.forEach(dialog=>bindOverlayDialog(root,dialog));
 root.addEventListener('input',event=>{
  const query=matches(event,'[data-native-overlay-query]');
  if(query){let count=0;selectAll(root,'[data-native-command]').forEach(button=>{const match=normalized(button.textContent).includes(normalized(query.value));button.closest('li').hidden=!match;if(match)count++;});setText(root,'[data-overlay-status]',count?'검색 결과를 갱신했습니다.':'검색 결과가 없습니다.');}
  const combo=matches(event,'[data-native-combobox]');if(combo){const visible=setComboOptions(combo,combo.value);setText(root,'[data-overlay-status]',visible.length?'팀 후보를 표시했습니다.':'일치하는 팀이 없습니다.');}
 });
 root.addEventListener('focusin',event=>{const combo=matches(event,'[data-native-combobox]');if(combo&&!combo.dataset.nativeComboRestoring){const visible=setComboOptions(combo,combo.value);if(visible.length)setText(root,'[data-overlay-status]','팀 후보를 표시했습니다.');}});
 root.addEventListener('click',event=>{
  const button=matches(event,'[data-native-action]');
  if(button){
   const action=button.dataset.nativeAction;
   if(action==='open-search-dialog')openOverlayDialog(root,'search',button);
   else if(action==='open-filter-dialog')openOverlayDialog(root,'filter',button);
   else if(action==='close-search-dialog')closeOverlayDialog(root,'search');
   else if(action==='close-filter-dialog')closeOverlayDialog(root,'filter');
   else if(action==='remove-native-tag'){button.closest('[data-native-tag-value]')?.remove();setText(root,'[data-overlay-status]','태그를 삭제했습니다.');select(root,'[data-native-tag]')?.focus();}
  }
  const command=matches(event,'[data-native-command]');if(command){const dialog=select(root,'dialog[data-native-dialog="search"]');if(dialog)dialog.dataset.nativeCloseStatus='명령을 선택했습니다. 로컬 예제에서만 적용됩니다.';setText(root,'[data-overlay-status]','명령을 선택했습니다. 로컬 예제에서만 적용됩니다.');closeOverlayDialog(root,'search');}
  const option=matches(event,'[data-native-combo-option]');if(option)chooseComboOption(root,matches(event,'[data-native-combobox]')||select(root,'[data-native-combobox]'),option);
 });
 root.addEventListener('submit',event=>{
  const form=matches(event,'[data-native-tag-form]');if(!form)return;
  const input=select(form,'[data-native-tag]');
  if(isComposingInput(event,input)){event.preventDefault();return;}
  event.preventDefault();
  const value=input.value.trim();if(!value){setText(root,'[data-overlay-status]','태그 이름을 입력해주세요.');input.focus();return;}
  const existing=selectAll(form,'[data-native-tag-value]').some(item=>normalized(item.dataset.nativeTagValue)===normalized(value));
  if(existing){setText(root,'[data-overlay-status]','이미 있는 태그입니다.');input.focus();return;}
  const item=make('li');item.dataset.nativeTagValue=value;item.append(document.createTextNode(value+' '));
  const remove=make('button','kv-button','×');remove.type='button';remove.dataset.nativeAction='remove-native-tag';remove.setAttribute('aria-label','태그 삭제');item.append(remove);select(form,'[data-native-tags]')?.append(item);
  input.value='';setText(root,'[data-overlay-status]','태그를 추가했습니다.');input.focus();
 });
 root.addEventListener('keydown',event=>{
  if(isComposingInput(event))return;
  const input=matches(event,'[data-native-combobox]');
  if(input){
   const list=input.ownerDocument.getElementById(input.getAttribute('aria-controls'));
   const options=list?selectAll(list,'[data-native-combo-option]').filter(option=>!option.hidden):[];
   if(event.key==='Escape'&&input.getAttribute('aria-expanded')==='true'){event.preventDefault();closeCombo(input);setText(root,'[data-overlay-status]','팀 목록을 닫았습니다.');return;}
   if(['ArrowDown','ArrowUp'].includes(event.key)&&options.length){event.preventDefault();let index=Number(input.dataset.nativeComboIndex||-1);index=event.key==='ArrowDown'?(index+1)%options.length:index<=0?options.length-1:index-1;input.dataset.nativeComboIndex=String(index);options.forEach((option,i)=>option.setAttribute('aria-selected',String(i===index)));input.setAttribute('aria-activedescendant',options[index].id);return;}
   if(event.key==='Enter'&&options.length){const index=Number(input.dataset.nativeComboIndex||0);const option=options[Math.max(0,Math.min(options.length-1,index))];event.preventDefault();chooseComboOption(root,input,option);return;}
  }
  const searchInput=matches(event,'[data-native-overlay-query]');
  if(searchInput&&event.key==='Enter'){
   const first=selectAll(root,'[data-native-command]').find(button=>!button.closest('[hidden]'));
   if(first){event.preventDefault();first.click();}
   return;
  }
  if(event.key==='Escape'){
   const nearestDialog=matches(event,'dialog[open]');
   const search=nearestDialog?.dataset.nativeDialog==='search'?nearestDialog:null;
   const combo=search&&select(search,'[data-native-combobox][aria-expanded="true"]');
   if(combo){event.preventDefault();closeCombo(combo);combo.focus({preventScroll:true});}
  }
 });
}

const initialized=new WeakSet();
export function initNativeCompositionInteractions(root){
 if(!root?.querySelectorAll)return;
 const compositions=[...(root.matches?.('[data-native-composition]')?[root]:[]),...root.querySelectorAll('[data-native-composition]')];
 for(const composition of compositions){
  if(initialized.has(composition))continue;
  initialized.add(composition);
  if(composition.dataset.nativeComposition==='data-workflow')bindWorkflow(composition);
  else if(composition.dataset.nativeComposition==='retry-form')bindRetryForm(composition);
  else if(composition.dataset.nativeComposition==='search-overlays')bindOverlay(composition);
 }
}
