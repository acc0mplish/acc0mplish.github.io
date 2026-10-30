import {calendarMarkup} from './component-expansion.mjs';
export const filterLabels=(labels,query)=>labels.filter(label=>label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
export function constrainRange(start,end,changed='start'){const a=Math.max(0,Math.min(100,Number(start)||0)),b=Math.max(0,Math.min(100,Number(end)||0));return changed==='start'?[Math.min(a,b),b]:[a,Math.max(a,b)];}
export const pageSlice=(items,page,size=2)=>items.slice((Math.max(1,Math.min(Math.ceil(items.length/size),page))-1)*size,Math.max(1,Math.min(Math.ceil(items.length/size),page))*size);
const isoDate=value=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const date=new Date(value+'T00:00:00Z');return !Number.isNaN(date.getTime())&&date.toISOString().slice(0,10)===value;};
export const validDateRange=(start,end)=>isoDate(start)&&isoDate(end)&&end>=start;
const query=(root,sel)=>root.querySelector(sel);
const all=(root,sel)=>[...root.querySelectorAll(sel)];
const setStatus=(root,text)=>{const area=query(root,'[data-cmp-status]');if(area)area.textContent=text;};
const triggers=new WeakMap();
let initialized=false;
function closePopover(button){const popover=button.closest('[popover]');if(popover?.matches(':popover-open'))popover.hidePopover();}
function filesSelected(root,files){const list=query(root,'[data-file-results]');if(!list)return;list.replaceChildren();for(const file of [...files].slice(0,12)){const li=document.createElement('li');li.textContent=file.name+' · '+(file.size/1024).toFixed(1)+' KB';list.append(li);}if(!files.length){const li=document.createElement('li');li.textContent='선택한 파일이 없습니다.';list.append(li);}}
function updateFilter(root,input){const options=all(root,'[data-search-item]'),visible=filterLabels(options.map(n=>n.textContent),input.value);options.forEach(n=>n.hidden=!visible.includes(n.textContent));const counter=query(root,'[data-search-count]');if(counter)counter.textContent=visible.length?visible.length+'개 결과':'일치하는 결과가 없습니다.';}
function comboFilter(root,input){const list=query(root,'[role=listbox]'),options=all(list,'[role=option]');input.setAttribute('aria-expanded','true');input.removeAttribute('aria-activedescendant');list.hidden=false;options.forEach(n=>{n.hidden=!n.textContent.toLocaleLowerCase().includes(input.value.toLocaleLowerCase());n.classList.remove('x-active');});setStatus(root,options.filter(n=>!n.hidden).length+'개 선택 항목');}
function comboClose(root){const input=query(root,'[data-combo]'),list=query(root,'[role=listbox]');if(input){input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');}if(list)list.hidden=true;}
function selectCombo(root,button){const input=query(root,'[data-combo]');input.value=button.textContent;all(root,'[role=option]').forEach(n=>n.setAttribute('aria-selected',String(n===button)));comboClose(root);input.focus();setStatus(root,button.textContent+' 선택');}
function setPage(root,page){const nav=query(root,'[data-page]'),items=['디자인 시스템','브랜드 리뉴얼','모바일 앱','접근성 점검','토큰 정리','문서 개선'];page=Math.max(1,Math.min(3,page));nav.dataset.page=page;query(nav,'[data-cmp-action=page-prev]').disabled=page===1;query(nav,'[data-cmp-action=page-next]').disabled=page===3;all(nav,'[data-page-number]').forEach(n=>{if(Number(n.dataset.pageNumber)===page)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current');});const list=query(root,'[data-page-items]');list.replaceChildren(...pageSlice(items,page).map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));setStatus(root,page+' / 3 페이지');}
function setWizard(root,next){const form=query(root,'[data-wizard-step]'),current=Number(form.dataset.wizardStep),panels=all(form,'[data-wizard-panel]');if(next>current){const invalid=all(panels[current],'input').find(n=>!n.checkValidity());if(invalid){invalid.reportValidity();return;}}if(next>1){setStatus(root,'프로젝트와 팀 입력을 확인했어요. 실제 생성은 하지 않습니다.');return;}next=Math.max(0,next);panels.forEach((n,i)=>{n.hidden=i!==next;all(n,'input').forEach(input=>input.disabled=i!==next);});form.dataset.wizardStep=next;query(form,'[data-cmp-action=wizard-back]').disabled=next===0;query(form,'[data-cmp-action=wizard-next]').textContent=next===1?'완료':'다음';query(panels[next],'input').focus();}
export function initComponentInteractions({notify=()=>{},copy=async text=>navigator.clipboard.writeText(text)}={}){
 if(initialized)return;initialized=true;
 document.addEventListener('click',async event=>{
  const anchor=event.target.closest('.x-anchor-nav a');if(anchor){event.preventDefault();const section=all(anchor.closest('.x-demo'),'section[id]').find(n=>n.id===anchor.hash.slice(1));section?.scrollIntoView({block:'nearest',behavior:'smooth'});return;}
  const button=event.target.closest('[data-cmp-action]'),root=button?.closest('.x-demo');if(!root)return;
  const action=button.dataset.cmpAction;
  if(action==='toggle'){const on=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(on));setStatus(root,button.textContent+(on?' 켜짐':' 꺼짐'));}
  else if(action==='increment'||action==='decrement'){const input=query(root,'[data-number]');try{action==='increment'?input.stepUp():input.stepDown();}catch{}input.dispatchEvent(new Event('input',{bubbles:true}));}
  else if(action==='password'){const input=query(root,'[data-password]'),show=input.type==='password';input.type=show?'text':'password';button.textContent=show?'숨기기':'표시';button.setAttribute('aria-pressed',String(show));}
  else if(action==='combo-option')selectCombo(root,button);
  else if(action==='remove-chip'){const name=button.getAttribute('aria-label');button.closest('.x-chip').remove();setStatus(root,name+'됨');query(root,'[data-tag-input]')?.focus();}
  else if(action==='mention'){const text=query(root,'[data-mention-text]');text.value+=(text.value?' ':'')+'@'+button.dataset.name+' ';text.focus();setStatus(root,button.dataset.name+' 이름을 삽입했어요. 알림은 전송하지 않습니다.');}
  else if(action==='transfer'){const direction=button.dataset.direction,source=query(root,'[data-transfer-list="'+(direction==='right'?'left':'right')+'"]'),target=query(root,'[data-transfer-list="'+direction+'"]'),selected=all(source,'input:checked');selected.forEach(input=>{input.checked=false;target.append(input.closest('label'));});setStatus(root,selected.length+'개 항목을 이동했어요.');}
  else if(action==='copy'){const text=query(root,'code').textContent;try{await copy(text);setStatus(root,'코드를 복사했어요.');}catch{setStatus(root,'복사할 수 없습니다. 코드 영역에서 직접 선택해주세요.');}}
  else if(action==='carousel-prev'||action==='carousel-next'){const box=query(root,'[data-carousel]'),slides=all(box,'[data-slide]'),next=(Number(box.dataset.carousel)+(action==='carousel-next'?1:-1)+slides.length)%slides.length;box.dataset.carousel=next;slides.forEach((n,i)=>n.hidden=i!==next);query(box,'[data-carousel-count]').textContent=(next+1)+' / '+slides.length;}
  else if(action==='load-skeleton'){const box=query(root,'[data-skeleton]');box.setAttribute('aria-busy','false');box.replaceChildren();const strong=document.createElement('strong');strong.textContent='KLIC 디자인 시스템';const p=document.createElement('p');p.textContent='컴포넌트와 토큰을 불러왔어요.';box.append(strong,p);button.disabled=true;setStatus(root,'콘텐츠 로드 완료');}
  else if(action==='calendar-prev'||action==='calendar-next'){const box=query(root,'.x-calendar'),date=new Date(Number(box.dataset.year),Number(box.dataset.month)+(action==='calendar-next'?1:-1),1);box.dataset.year=date.getFullYear();box.dataset.month=date.getMonth();box.innerHTML=calendarMarkup(date.getFullYear(),date.getMonth(),0);setStatus(root,date.getFullYear()+'년 '+(date.getMonth()+1)+'월');query(box,action==='calendar-next'?'[data-cmp-action=calendar-next]':'[data-cmp-action=calendar-prev]').focus();}
  else if(action==='calendar-day'){all(root,'[data-day]').forEach(n=>n.setAttribute('aria-pressed',String(n===button)));const box=query(root,'.x-calendar');setStatus(root,box.dataset.year+'년 '+(Number(box.dataset.month)+1)+'월 '+button.dataset.day+'일 선택');}
  else if(action==='create-item'){const box=query(root,'[data-empty]');box.replaceChildren();const strong=document.createElement('strong');strong.textContent='새 프로젝트';const p=document.createElement('p');p.textContent='첫 항목이 추가됐어요. 이 화면 안의 데모 상태입니다.';box.append(strong,p);setStatus(root,'프로젝트 예제 1개 생성');}
  else if(action==='open-dialog'){const dialog=query(root,'dialog');triggers.set(dialog,button);if(!dialog.dataset.bound){dialog.dataset.bound='true';dialog.addEventListener('close',()=>{setStatus(root,dialog.returnValue==='confirm'?'보관 확인 동작을 완료했어요. 실제 데이터는 변경하지 않았습니다.':'보관을 취소했어요.');triggers.get(dialog)?.focus();});}dialog.showModal();}
  else if(action==='close-popover')closePopover(button);
  else if(action==='confirm'){setStatus(root,'보관을 확인했어요. 실제 데이터는 변경하지 않았습니다.');closePopover(button);}
  else if(action==='menu-choice'||action==='list-open'||action==='command'){setStatus(root,(button.dataset.name||button.textContent)+' · 로컬 예제 동작을 확인했어요.');closePopover(button);}
  else if(action==='read-notification'){button.closest('[data-unread]').dataset.unread='false';button.disabled=true;button.textContent='읽음 완료';query(root,'[data-notification-count]').textContent=all(root,'[data-unread=true]').length;setStatus(root,'알림을 읽음으로 표시했어요.');}
  else if(action==='dismiss-banner'){query(root,'[data-banner]').hidden=true;query(root,'[data-cmp-action=show-banner]').focus();setStatus(root,'배너를 닫았어요.');}
  else if(action==='show-banner')query(root,'[data-banner]').hidden=false;
  else if(action==='loading'){const region=query(root,'.x-loading-region'),cover=query(root,'.x-loading-cover');region.setAttribute('aria-busy','true');cover.hidden=false;button.disabled=true;setStatus(root,'동기화 처리 중');setTimeout(()=>{if(!root.isConnected)return;region.setAttribute('aria-busy','false');cover.hidden=true;button.disabled=false;setStatus(root,'동기화 예제 완료 · 외부 요청 없음');},900);}
  else if(action==='page'||action==='page-prev'||action==='page-next'){const current=Number(query(root,'[data-page]').dataset.page);setPage(root,action==='page'?Number(button.dataset.pageNumber):current+(action==='page-next'?1:-1));}
  else if(action==='next-step'){const box=query(root,'[data-step]'),items=all(box,'li'),next=Math.min(2,Number(box.dataset.step)+1);box.dataset.step=next;items.forEach((n,i)=>{n.removeAttribute('aria-current');if(i===next)n.setAttribute('aria-current','step');query(n,'span').textContent=i<next?'✓':i+1;});button.disabled=next===2;setStatus(root,next===2?'마지막 단계에 도착했어요.':(next+1)+'단계로 이동했어요.');}
  else if(action==='wizard-back'||action==='wizard-next'){const step=Number(query(root,'[data-wizard-step]').dataset.wizardStep);setWizard(root,step+(action==='wizard-next'?1:-1));}
 });
 document.addEventListener('input',event=>{
  const input=event.target,root=input.closest('.x-demo');if(!root)return;
  if(input.matches('[data-count-text]'))query(root,'[data-count-output]').textContent=input.value.length;
  if(input.matches('[data-range-value]'))query(root,'[data-range-output]').textContent=input.value+'%';
  if(input.matches('[data-range]')){const a=query(root,'[data-range=start]'),b=query(root,'[data-range=end]'),[start,end]=constrainRange(a.value,b.value,input.dataset.range);a.value=start;b.value=end;query(root,'[data-range-result]').textContent=start+' — '+end+'만원';}
  if(input.matches('[data-otp]')){input.value=input.value.replace(/\D/g,'').slice(0,6);setStatus(root,input.value.length===6?'6자리 형식을 확인했어요. 실제 인증 요청은 없습니다.':input.value.length+' / 6자리 입력');}
  if(input.matches('[data-local-filter]'))updateFilter(root,input);
  if(input.matches('[data-combo]'))comboFilter(root,input);
  if(input.matches('[data-resize]'))query(root,'[data-resize-box]').style.width=input.value+'px';
  if(input.matches('[data-split]'))query(root,'[data-split-box]').style.setProperty('--split',input.value+'%');
 });
 document.addEventListener('change',event=>{
  const input=event.target,root=input.closest('.x-demo');if(!root)return;
  if(input.matches('[data-choice]')){query(root,'[data-choice-result]').textContent='선택: '+input.value;if(root.dataset.klicComponent==='color-picker')root.style.setProperty('--chosen-blue',input.value);}
  if(input.matches('[data-multi]')){const selected=all(root,'[data-multi]:checked');query(root,'[data-selected-count]').textContent=selected.length;setStatus(root,selected.length?selected.map(n=>n.value).join(', ')+' 선택':'선택한 팀 없음');}
  if(input.matches('[data-date-start],[data-date-end]')){const start=query(root,'[data-date-start]'),end=query(root,'[data-date-end]'),valid=validDateRange(start.value,end.value);end.min=start.value;end.setCustomValidity(valid?'':'종료일은 시작일 이후여야 합니다.');end.setAttribute('aria-invalid',String(!valid));setStatus(root,valid?start.value+' — '+end.value:'종료일은 시작일 이후로 선택해주세요.');}
  if(input.matches('[data-files]'))filesSelected(root,input.files);
  if(input.matches('[data-cascade-dept]')){const target=query(root,'[data-cascade-team]'),teams=input.value==='product'?['디자인','프론트엔드']:['영업','고객성공'];target.replaceChildren(...teams.map(name=>{const option=document.createElement('option');option.textContent=name;return option;}));setStatus(root,teams[0]+' 팀 선택');}
 });
 document.addEventListener('focusin',event=>{const input=event.target;if(input.matches('[data-combo]'))comboFilter(input.closest('.x-demo'),input);});
 document.addEventListener('focusout',event=>{const root=event.target.closest('.xc-combobox');if(root&&!root.contains(event.relatedTarget))comboClose(root);});
 document.addEventListener('click',event=>{for(const root of document.querySelectorAll('.xc-combobox'))if(!root.contains(event.target))comboClose(root);});
 document.addEventListener('keydown',event=>{
  if(event.isComposing||event.keyCode===229)return;
  const input=event.target,root=input.closest('.x-demo');if(!root)return;
  if(event.key==='Escape'){root.classList.add('x-tooltip-dismissed');if(root.classList.contains('xc-combobox'))comboClose(root);}
  if(input.matches('[data-local-filter]')&&event.key==='Enter'&&root.classList.contains('xc-command')){event.preventDefault();query(root,'[data-search-item]:not([hidden]) button')?.click();}
  if(input.matches('[data-tag-input]')&&event.key==='Enter'){
   event.preventDefault();const value=input.value.trim();if(!value)return;const box=query(root,'[data-tags]'),existing=all(box,'.x-chip').map(n=>n.firstChild.textContent.trim());if(existing.includes(value)){setStatus(root,'이미 추가한 태그입니다.');return;}if(existing.length>=8){setStatus(root,'태그는 최대 8개까지 추가할 수 있습니다.');return;}
   const chip=document.createElement('span'),remove=document.createElement('button');chip.className='x-chip';chip.append(document.createTextNode(value));remove.type='button';remove.dataset.cmpAction='remove-chip';remove.setAttribute('aria-label',value+' 제거');remove.textContent='×';chip.append(remove);box.append(chip);input.value='';setStatus(root,value+' 태그 추가');
  }
  if(input.matches('[data-combo]')&&['ArrowDown','ArrowUp','Enter'].includes(event.key)){
   event.preventDefault();const list=query(root,'[role=listbox]');if(list.hidden)comboFilter(root,input);const options=all(list,'[role=option]:not([hidden])');if(!options.length)return;
   let current=options.findIndex(n=>n.id===input.getAttribute('aria-activedescendant'));if(event.key==='Enter'){selectCombo(root,options[Math.max(0,current)]);return;}current=current<0?(event.key==='ArrowDown'?0:options.length-1):(current+(event.key==='ArrowDown'?1:-1)+options.length)%options.length;options.forEach((n,i)=>n.classList.toggle('x-active',i===current));input.setAttribute('aria-activedescendant',options[current].id);
  }
 });
 document.addEventListener('pointerover',event=>event.target.closest('.xc-tooltip')?.classList.remove('x-tooltip-dismissed'));
 document.addEventListener('focusin',event=>event.target.closest('.xc-tooltip')?.classList.remove('x-tooltip-dismissed'));
 document.addEventListener('contextmenu',event=>{const target=event.target.closest('[data-context-target]');if(!target)return;event.preventDefault();const root=target.closest('.x-demo'),pop=all(root,'[popover]').find(n=>n.id===target.dataset.contextTarget);if(pop&&!pop.matches(':popover-open'))pop.showPopover();});
 document.addEventListener('dragover',event=>{if(event.target.closest('[data-dropzone]')){event.preventDefault();event.dataTransfer.dropEffect='copy';}});
 document.addEventListener('drop',event=>{const zone=event.target.closest('[data-dropzone]');if(zone){event.preventDefault();filesSelected(zone.closest('.x-demo'),event.dataTransfer.files);}});
 document.addEventListener('submit',event=>{const form=event.target;if(form.matches('[data-component-form],.x-step-form')){event.preventDefault();if(form.matches('[data-component-form]')&&form.reportValidity())setStatus(form.closest('.x-demo'),form.elements.project.value+' · '+form.elements.email.value+' 입력 확인. 서버 전송 없음.');}});
}
