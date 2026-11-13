import {NPM_PACKAGE} from './npm-package-data.mjs';

const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const packageTag=()=>`${NPM_PACKAGE.name}@latest`;
const publicExports=()=>NPM_PACKAGE.publicationExportsVerified?(NPM_PACKAGE.publishedExports??(NPM_PACKAGE.published?NPM_PACKAGE.exports:[])):(NPM_PACKAGE.published?NPM_PACKAGE.exports:[]);
const hasPublishedBlock=id=>NPM_PACKAGE.publicationBlockInventoryVerified&&NPM_PACKAGE.publishedBlockIds.includes(id);
const hasPublishedMotionRuntime=()=>NPM_PACKAGE.publicationExportsVerified&&publicExports().includes('motions/runtime')&&publicExports().includes('motions/runtime.css');

export function itemDelivery(kind,id,manager='bun'){
 if(!['component','block','motion'].includes(kind)||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)||!['bun','npm'].includes(manager))throw new Error('Invalid item delivery selection');
 const cli=manager==='bun'?NPM_PACKAGE.sourceCLICommand:NPM_PACKAGE.sourceNodeCLICommand;
 const motionRuntimeAvailable=kind!=='motion'||hasPublishedMotionRuntime();
 const packageItemAvailable=motionRuntimeAvailable&&(kind!=='block'||hasPublishedBlock(id));
 const install=packageItemAvailable?`${manager==='bun'?'bun add':'npm install'} ${packageTag()}`:null;
 const usage=!packageItemAvailable?null:kind==='block'?`import Block from 'klic-design/blocks/${id}';\nimport 'klic-design/blocks.css';\n\n<Block />`:kind==='component'?`import component from 'klic-design/components/${id}';\nimport 'klic-design/components.css';\n\n// Native HTML reference; initialize the needed behavior separately.\nconst html = component.forms[0].html;`:`import {mountMotion} from 'klic-design/motions/runtime';\nimport 'klic-design/motions/runtime.css';\nimport 'klic-design/motions/${id}.css';\nimport recipe from 'klic-design/motions/${id}';\n\nconst host=document.querySelector('[data-klic-motion-root]');\nif(!host)throw new Error('Add a [data-klic-motion-root] element before mounting.');\nconst motion=mountMotion(host,recipe);\nvoid motion.ready.catch(error=>{if(host.isConnected)host.dataset.motionError=error instanceof Error?error.message:String(error);});\nexport default motion;`;
 return {kind,id,manager,install,usage,limitations:(NPM_PACKAGE.publishedLimitations||[]).filter(item=>item.items.includes(kind+'/'+id)),source:kind==='motion'?null:`${cli} add ${kind} ${id} --out ./klic-${id}`,inspect:kind==='motion'?`${cli} motion get ${id}`:`${cli} plan ${kind} ${id}`};
}

export function renderItemDelivery(kind,id,{manager='bun',locale='ko',formCount=5}={}){
 const info=itemDelivery(kind,id,manager),T=(ko,en)=>locale==='en'?en:ko;
 if(kind==='motion'&&!info.install){
  const note=NPM_PACKAGE.publicationExportsVerified
   ?T('현재 npm 패키지에는 공유 motion runtime export가 없습니다. 아래 CSS·JavaScript·React 예제를 사용할 수 있습니다.','The current npm package does not export the shared motion runtime. CSS, JavaScript and React examples remain available below.')
   :T('패키지 export를 확인할 수 없어 motion import 명령을 숨겼습니다. 아래 구현 예제를 사용할 수 있습니다.','Package exports could not be verified, so the motion import is omitted. Implementation examples remain available below.');
  return `<section class="item-delivery" data-item-delivery data-delivery-kind="motion" data-delivery-id="${id}" data-delivery-locale="${locale}"><div class="item-delivery-heading"><h2>${T('모션 소스 안내','Motion source')}</h2></div><p role="note">${escape(note)}</p><p>${T('CSS·JavaScript·React 예제는 아래 구현 탭에서 복사할 수 있습니다.','Copy CSS, JavaScript and React examples from the implementation tabs below.')}</p><a href="/resources/cli#npm-package">${T('패키지 사용 안내','Package guide')} ↗</a><p role="status" data-delivery-status aria-live="polite"></p></section>`;
 }
 const box=(label,key,value)=>`<div class="item-delivery-code"><div><strong>${label}</strong><button type="button" data-delivery-copy="${key}">${T('복사','Copy')}</button></div><pre><code data-delivery-code="${key}">${escape(value)}</code></pre></div>`;
 if(kind==='block'&&!info.install){
  const note=NPM_PACKAGE.publicationBlockInventoryVerified
   ?T('이 블록은 현재 KLIC 소스 카탈로그에서 제공합니다. 아래 CLI 명령으로 원본 workspace를 받으세요.','This block is available in the KLIC source catalog. Use the CLI below to get its source workspace.')
   :T('개별 블록 파일 목록을 확인할 수 없어 현재 소스 전달을 안내합니다.','The public block inventory could not be verified; use current source delivery.');
  return `<section class="item-delivery" data-item-delivery data-delivery-kind="block" data-delivery-id="${id}" data-delivery-locale="${locale}"><div class="item-delivery-heading"><h2>${T('React 블록 소스','React block source')}</h2><div role="group" aria-label="${T('실행 환경','Runtime')}">${['bun','npm'].map(name=>`<button type="button" data-delivery-manager="${name}" aria-pressed="${name===manager}">${name}</button>`).join('')}</div></div><p role="note">${escape(note)}</p>${box(T('독립 실행 소스 받기','Get a standalone source workspace'),'source',info.source)}<p>${T('React 소스·의존성·고지를 함께 받습니다. 아래 코드 탭에서도 원본을 확인할 수 있습니다.','Includes React source, dependencies and notices. Raw source remains available in the code tabs below.')}</p><a href="/api/v1/bundles/block/${id}.json" target="_blank" rel="noopener">${T('파일 목록','File list')} ↗</a> · <a href="/resources/cli#npm-package">${T('패키지 사용 안내','Package guide')}</a><p role="status" data-delivery-status aria-live="polite"></p></section>`;
 }
 const note=kind==='block'?T('React 19·React DOM 필요. 패키지는 한 번 설치하고 블록 경로를 선택하세요. 소스 명령은 KLIC CLI를 사용합니다.','Requires React 19 and React DOM. Install the package once, then select a block import. Source commands use the KLIC CLI.'):kind==='component'?T(`${formCount}개 HTML 참고 형태 제공. React 컴포넌트가 아니며 필요한 동작은 별도로 연결하세요.`,`Includes ${formCount} HTML reference form${formCount===1?'':'s'}. Initialize the required behavior separately.`):T('공통 motion runtime과 runtime.css를 함께 가져오세요. React 예제는 아래 구현 코드에 포함됩니다.','Import the shared motion runtime and runtime.css. The React example is included in the implementation code below.');
 return `<section class="item-delivery" data-item-delivery data-delivery-kind="${kind}" data-delivery-id="${id}" data-delivery-locale="${locale}"><div class="item-delivery-heading"><h2>${T('패키지로 사용','Use the package')}</h2><div role="group" aria-label="${T('패키지 매니저','Package manager')}">${['bun','npm'].map(name=>`<button type="button" data-delivery-manager="${name}" aria-pressed="${name===manager}">${name}</button>`).join('')}</div></div>${box(T('이 항목 가져오기','Import this item'),'usage',info.usage)}${box(T('패키지 설치 · 최초 1회','Install package · once'),'install',info.install)}<p>${note}</p>${info.limitations.map(item=>`<p role="note">${escape(T(item.ko,item.en))}</p>`).join('')}${info.source?`<details><summary>${T('소스 가져오기','Get source files')}</summary><p>${T('수정 가능한 소스·의존성·라이선스를 포함한 독립 실행 폴더를 만듭니다. 기존 프로젝트에 파일만 추가하는 명령은 아닙니다. KLIC CLI가 현재 카탈로그 항목을 전달합니다.','Creates a standalone workspace with editable source, dependencies and licenses. It does not insert files into an existing project. The KLIC CLI delivers items from the current catalog.')}</p>${box(T('소스 저장','Save source'),'source',info.source)}<a href="/api/v1/bundles/${kind}/${id}.json" target="_blank" rel="noopener">${T('파일 목록 확인','Inspect file list')} ↗</a> · <a href="/resources/cli#source">${T('실행 방법','Instructions')}</a></details>`:`<p>${T('소스 가져오기: 아래 CSS·React 코드를 복사하거나 패키지의 recipe.implementation을 사용하세요.','Get source: copy the CSS/React code below or use recipe.implementation from the package.')}</p>`}<p role="status" data-delivery-status aria-live="polite"></p></section>`;
}

const mounted=new WeakSet();
export function initItemDelivery(root,{copy=async text=>navigator.clipboard.writeText(text)}={}){
 if(mounted.has(root))return;mounted.add(root);
 root.addEventListener('click',async event=>{
  const button=event.target.closest('[data-delivery-manager],[data-delivery-copy]');if(!button||!root.contains(button))return;
  const section=button.closest('[data-item-delivery]');if(!section)return;
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
