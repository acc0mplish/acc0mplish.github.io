import {NPM_PACKAGE} from './npm-package-data.mjs';
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function itemDelivery(kind,id,manager='bun'){
 if(!['component','block','motion'].includes(kind)||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)||!['bun','npm'].includes(manager))throw new Error('Invalid item delivery selection');
 const cli=manager==='bun'?NPM_PACKAGE.cliCommand:NPM_PACKAGE.nodeCliCommand;
 const install=`${manager==='bun'?'bun add':'npm install'} ${NPM_PACKAGE.name}@${NPM_PACKAGE.version}`;
 const usage=kind==='block'?`import Block from 'klic-design/blocks/${id}';\nimport 'klic-design/blocks.css';\n\n<Block />`:kind==='component'?`import component from 'klic-design/components/${id}';\nimport 'klic-design/components.css';\n\n// Native HTML reference; initialize the needed behavior separately.\nconst html = component.forms[0].html;`:`import recipe from 'klic-design/motions/${id}';\nimport 'klic-design/motions/${id}.css';\n\n// Pair this CSS with the recipe's HTML or React example.\nconst reactExample = recipe.implementation.react;`;
 return {kind,id,manager,install,usage,source:kind==='motion'?null:`${cli} add ${kind} ${id} --out ./klic-${id}`,inspect:kind==='motion'?`${cli} motion get ${id}`:`${cli} plan ${kind} ${id}`};
}
export function renderItemDelivery(kind,id,{manager='bun',locale='ko'}={}){
 const info=itemDelivery(kind,id,manager),T=(ko,en)=>locale==='en'?en:ko;
 const box=(label,key,value)=>`<div class="item-delivery-code"><div><strong>${label}</strong><button type="button" data-delivery-copy="${key}">${T('복사','Copy')}</button></div><pre><code data-delivery-code="${key}">${escape(value)}</code></pre></div>`;
 const note=kind==='block'?T('React 19·React DOM 필요. 패키지는 한 번 설치하고 블록 경로를 선택하세요.','Requires React 19 and React DOM. Install the package once, then select a block import.'):kind==='component'?T('5가지 HTML 참고 형태 제공. React 컴포넌트가 아니며 필요한 동작은 별도로 연결하세요.','Includes five HTML reference forms. Initialize the required behavior separately.'):T('CSS와 해당 마크업을 함께 적용하세요. React 예제는 아래 구현 코드에서 복사하세요.','Pair the CSS with its markup. Copy the React example from the implementation code below.');
 return `<section class="item-delivery" data-item-delivery data-delivery-kind="${kind}" data-delivery-id="${id}" data-delivery-locale="${locale}"><div class="item-delivery-heading"><h2>${T('패키지로 사용','Use the package')}</h2><div role="group" aria-label="${T('패키지 매니저','Package manager')}">${['bun','npm'].map(name=>`<button type="button" data-delivery-manager="${name}" aria-pressed="${name===manager}">${name}</button>`).join('')}</div></div>${box(T('패키지 설치 · 최초 1회','Install package · once'),'install',info.install)}${box(T('이 항목 가져오기','Import this item'),'usage',info.usage)}<p>${note}</p>${info.source?`<details><summary>${T('소스 가져오기','Get source files')}</summary><p>${T('수정 가능한 소스·의존성·라이선스를 포함한 독립 실행 폴더를 만듭니다. 기존 프로젝트에 파일만 추가하는 명령은 아닙니다.','Creates a standalone workspace with editable source, dependencies and licenses. It does not insert files into an existing project.')}</p>${box(T('소스 저장','Save source'),'source',info.source)}<a href="/api/v1/bundles/${kind}/${id}.json" target="_blank" rel="noopener">${T('파일 목록 확인','Inspect file list')} ↗</a> · <a href="/resources/cli#source">${T('실행 방법','Instructions')}</a></details>`:`<p>${T('소스 가져오기: 아래 CSS·React 코드를 복사하거나 패키지의 recipe.implementation을 사용하세요.','Get source: copy the CSS/React code below or use recipe.implementation from the package.')}</p>`}<p role="status" data-delivery-status aria-live="polite"></p></section>`;
}
const mounted=new WeakSet();
export function initItemDelivery(root,{copy=async text=>navigator.clipboard.writeText(text)}={}){
 if(mounted.has(root))return;mounted.add(root);
 root.addEventListener('click',async event=>{
  const button=event.target.closest('[data-delivery-manager],[data-delivery-copy]');if(!button||!root.contains(button))return;
  const section=button.closest('[data-item-delivery]');if(!section)return;
  // A page may have a document delegate and a nested workbench delegate.
  event.stopPropagation();
  const status=section.querySelector('[data-delivery-status]'),en=section.dataset.deliveryLocale==='en';
  if(button.dataset.deliveryManager){
   const info=itemDelivery(section.dataset.deliveryKind,section.dataset.deliveryId,button.dataset.deliveryManager);
   for(const key of ['install','source']){const code=section.querySelector(`[data-delivery-code="${key}"]`);if(code)code.textContent=info[key];}
   section.querySelectorAll('[data-delivery-manager]').forEach(tab=>tab.setAttribute('aria-pressed',String(tab===button)));
   status.textContent='';return;
  }
  const text=section.querySelector(`[data-delivery-code="${button.dataset.deliveryCopy}"]`)?.textContent;if(!text)return;
  try{const result=await copy(text,en?'Copied.':'복사했습니다.');status.textContent=result===false?(en?'Select the text to copy.':'텍스트를 직접 선택해 복사하세요.'):(en?'Copied.':'복사했습니다.');}catch{status.textContent=en?'Could not copy. Select the text manually.':'복사하지 못했습니다. 텍스트를 직접 선택하세요.';}
 });
}
