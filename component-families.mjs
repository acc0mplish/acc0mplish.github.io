import {AFFECT_COMPONENTS,getAffectForms} from './affect-components.mjs';
import {specimen,escapeHTML as esc,icon} from './catalog.js';
import {getAddedVariants} from './component-variants-data.mjs';

const compactFamilies=new Set(['button','button-group','toggle','toggle-group','segmented-control','input','input-group','password-input','search-input','number-input','input-otp','checkbox','switch','radio-group','select','slider','range-slider','rating','color-picker','badge','avatar','avatar-group','separator','breadcrumb','pagination','link','kbd','code','spinner','progress','skeleton','typography']);
const roomyFamilies=new Set(['form','card','data-table','table','calendar','date-range-picker','transfer','tree','tree-select','cascader','command','sidebar','navigation-menu','carousel','file-upload','upload','empty-state','decision-inbox','tool-call-card','smart-recommendation','message-actions']);
export function familyDensity(id){return compactFamilies.has(id)?'compact':roomyFamilies.has(id)?'roomy':'regular';}
export function formatFamilyHTML(source){
 const voids=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);let depth=0;
 return source.split(/(<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>)/g).filter(part=>part.trim()).map(part=>{const closing=/^<\//.test(part),tag=part.match(/^<\/?([a-zA-Z][\w-]*)/);if(closing)depth=Math.max(0,depth-1);const line='  '.repeat(depth)+part.trim();if(tag&&!closing&&!voids.has(tag[1].toLowerCase())&&!/\/>$/.test(part))depth++;return line;}).join('\n');
}
export function componentForms(component,uid=`forms-${component.id}`){
 if(AFFECT_COMPONENTS.some(c=>c.id===component.id))return getAffectForms(component.id,uid).map(f=>({...f,reference:null}));
 return [{id:'default',name:'KLIC 기본형',description:component.description,html:specimen(component.id,`${uid}-default`),reference:null},...getAddedVariants(component.id,uid)];
}
export function componentVariantMetadata(component){
 return componentForms(component,`export-${component.id}`).map(({id,name,description,reference})=>({id,name,description,implementation:'native-html',reference:reference||null,source:{path:`/api/v1/sources/variants/${component.id}/${id}.html`,language:'html',usage:'reference',notice:'KLIC native HTML adaptation. Use the component workspace for styles, tokens, icons and delegated interactions; not an upstream React package.'}}));
}
export function renderComponentFamily(component,uid,{detail=false,actions=''}={}){
 const forms=componentForms(component,uid);
 return `<section class="cf-family${detail?' cf-detail':''}" data-cf-density="${familyDensity(component.id)}" data-cf-component="${component.id}" data-cf-instance="${esc(uid)}" aria-labelledby="${uid}-heading"><div class="cf-heading"><div><div class="cf-kicker">${esc(component.ko)} <span>5 FORMS</span></div><h${detail?'2':'4'} id="${uid}-heading"><a href="#component/${component.id}">${esc(component.name)}</a></h${detail?'2':'4'}><p>${esc(component.description)}</p></div><div class="cf-heading-actions">${actions}<a class="btn secondary sm" href="#component/${component.id}/api">동작 · API ${icon('arrow-up-right')}</a></div></div><div class="cf-grid">${forms.map((form,index)=>`<article class="cf-card" data-cf-form="${esc(form.id)}"><div class="cf-card-label"><span>${String(index+1).padStart(2,'0')}</span><strong>${esc(form.name)}</strong><span class="cf-origin">${index?'추가형':'기본형'}</span></div><div class="cf-canvas"><div class="cf-sample">${form.html}</div></div><div class="cf-card-foot"><p>${esc(form.description)}</p><div class="cf-source">${form.reference?`<a href="${esc(form.reference.url)}" target="_blank" rel="noopener noreferrer">${esc(form.reference.label)} ${icon('arrow-up-right')}</a><span>KLIC 적용</span>`:'<span>KLIC</span>'}</div><button class="cf-code-open" type="button" data-cf-open aria-haspopup="dialog" aria-label="${esc(form.name)} 코드 및 사용 방법">코드 · 사용 방법 ${icon('code-2')}</button></div></article>`).join('')}</div></section>`;
}
let initialized=false;
export function initComponentFamilies({catalog,copy,notify=()=>{}}){
 if(initialized)return;initialized=true;
 let dialog,opener,previousOverflow,source='';
 const close=()=>{if(dialog?.open)dialog.close();};
 function ensureDialog(){
  if(dialog)return dialog;
  dialog=document.createElement('dialog');dialog.className='cf-code-dialog';dialog.setAttribute('aria-labelledby','cf-code-title');document.body.append(dialog);
  dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow||'';if(opener?.isConnected)opener.focus({preventScroll:true});});
  dialog.addEventListener('click',async event=>{if(event.target.closest('[data-cf-close]'))close();if(event.target.closest('[data-cf-copy]')){try{await copy(source,'형태 코드를 복사했어요.');}catch{notify('복사하지 못했습니다. 코드 영역에서 직접 선택해주세요.');}}});
  window.addEventListener('hashchange',close);return dialog;
 }
 document.addEventListener('click',event=>{
  const button=event.target.closest('[data-cf-open]');if(!button)return;
  const family=button.closest('[data-cf-component]'),card=button.closest('[data-cf-form]'),component=catalog.find(c=>c.id===family?.dataset.cfComponent);if(!component)return;
  const form=componentForms(component,family.dataset.cfInstance).find(f=>f.id===card?.dataset.cfForm);if(!form)return;
  const modal=ensureDialog(),computed=getComputedStyle(button);
  // The top-layer dialog retains the selected item's local appearance context.
  modal.removeAttribute('style');for(let i=0;i<computed.length;i++){const key=computed[i];if(key.startsWith('--klic-'))modal.style.setProperty(key,computed.getPropertyValue(key));}
  modal.style.colorScheme=computed.colorScheme;source=card.querySelector('[data-cf-live-source]')?.innerHTML||form.html;opener=button;
  modal.innerHTML=`<header class="cf-code-header"><div><span>HTML · KLIC</span><h2 id="cf-code-title">${esc(component.name)} / ${esc(form.name)}</h2></div><button type="button" class="btn secondary sm" data-cf-close autofocus aria-label="코드 패널 닫기">닫기</button></header><div class="cf-code-layout"><section class="cf-code-main" aria-label="형태 소스"><div class="cf-code-toolbar"><span>${component.id}/${esc(form.id)}.html</span><button class="btn secondary sm" type="button" data-cf-copy>HTML 복사</button></div><pre tabindex="0" aria-label="${esc(form.name)} HTML 코드"><code>${esc(formatFamilyHTML(source))}</code></pre></section><aside class="cf-code-guide"><h3>프로젝트에 적용하기</h3><p>아래 명령으로 토큰·스타일·아이콘·동작 파일이 포함된 실행 소스를 가져오세요.</p><code>bun klic.mjs add component ${component.id} --out ./klic-${component.id}</code><a href="#docs/cli">CLI 설치 · 사용 안내 ↗</a><h3>이 형태만 확인하기</h3><code>bun klic.mjs source component ${component.id} --variant ${esc(form.id)}</code><h3>필요한 파일</h3><ul><li><a href="/component-families.css" target="_blank" rel="noopener">비교 화면 스타일</a></li><li><a href="/component-variants-examples.css" target="_blank" rel="noopener">추가형 컴포넌트 스타일</a></li><li><a href="/component-variants-interactions.mjs" target="_blank" rel="noopener">추가형 동작</a></li><li><a href="/styles.css" target="_blank" rel="noopener">기본형 스타일</a></li><li><a href="/api/v1/bundles/component/${component.id}.json" target="_blank" rel="noopener">전체 파일 목록 · 라이선스</a></li></ul><p>HTML 조각의 동작에는 소스 묶음의 런타임이 필요합니다.</p>${form.reference?`<a href="${esc(form.reference.url)}" target="_blank" rel="noopener noreferrer">${esc(form.reference.label)} ↗</a>`:''}</aside></div>`;
  previousOverflow=document.body.style.overflow;modal.showModal();document.body.style.overflow='hidden';
 });
}
