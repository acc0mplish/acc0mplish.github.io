const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const reference='https://reui.io/blocks/application/dashboard/dashboard-1';
const text={
 ko:{title:'의존성',runtime:'React 실행 환경',direct:'직접 사용하는 패키지',support:'로컬 모듈이 사용하는 패키지',local:'로컬 컴포넌트 · 유틸리티',styles:'스타일 · 토큰',build:'빌드 도구',copy:'설치 명령 복사',copied:'설치 명령을 복사했습니다.',failed:'복사하지 못했습니다. 명령을 선택해 복사하세요.',none:'없음',html:'HTML 예제는 별도의 npm 런타임 설치 없이 KLIC 스타일과 브라우저 동작 파일을 사용합니다.',note:'소스 모듈의 실제 import와 고정 버전입니다. 설치 명령은 패키지만 추가합니다. 상대 경로 모듈·스타일·자산도 함께 가져오고 파일별 라이선스를 유지하세요.',source:'전체 소스 목록',reference:'참고: ReUI의 의존성 정보 구성',planned:'아직 실행 소스가 없어 의존성을 제공하지 않습니다.',loading:'의존성을 확인하고 있습니다…',error:'의존성 정보를 불러오지 못했습니다.',retry:'다시 시도',manifest:'의존성 JSON'},
 en:{title:'Dependencies',runtime:'Runtime',direct:'Direct packages',support:'Supporting packages',local:'Local components and utilities',styles:'Styles and tokens',build:'Build tools',copy:'Copy install command',copied:'Install command copied.',failed:'Copy failed. Select and copy the command.',none:'None',html:'HTML examples use KLIC styles and browser interaction files without installing an npm runtime.',note:'Actual source imports and pinned versions. The command installs packages only. Include relative modules, styles and assets, and preserve per-file licenses.',source:'Source manifest',reference:'Reference: ReUI dependency presentation',planned:'Dependencies are unavailable until implementation exists.',loading:'Loading dependencies…',error:'Could not load dependency information.',retry:'Retry',manifest:'Dependencies JSON'}
};
const strings=locale=>text[locale==='en'?'en':'ko'];
function packageList(items,t){return items?.length?`<ul class="dependency-list">${items.map(item=>`<li><code>${esc(item.name)}</code><span>${esc(item.version)}</span></li>`).join('')}</ul>`:`<p class="dependency-empty">${t.none}</p>`;}
function fileList(items,t){return items?.length?`<ul class="dependency-files">${items.map(item=>`<li>${/^\/(?!\/)[A-Za-z0-9_./-]+$/.test(item.href||'')?`<a href="${esc(item.href)}" target="_blank" rel="noopener">${esc(item.path)}</a>`:`<code>${esc(item.path)}</code>`}</li>`).join('')}</ul>`:`<p class="dependency-empty">${t.none}</p>`;}

/** Pure markup renderer. Pass one record from /api/v1/dependencies.json. */
export function renderPreviewDependencies(item,{locale='ko'}={}){
 const t=strings(locale);
 if(!item||item.status!=='ready')return `<section class="preview-dependencies"><h3>${t.title}</h3><p>${t.planned}</p></section>`;
 const group=(title,content)=>`<section class="dependency-group"><h4>${title}</h4>${content}</section>`;
 const packages=[...(item.runtime||[]),...(item.directPackages||[]),...(item.supportPackages||[])];
 return `<details class="preview-dependencies"><summary><span>${t.title}</span><span class="dependency-summary">${item.framework==='html'?'HTML · CSS · JavaScript':`React · ${locale==='en'?`${packages.length} packages`:`패키지 ${packages.length}개`}`}</span></summary><div class="dependency-content"><p class="dependency-note">${item.framework==='html'?t.html:t.note}</p>${item.installCommand?`<div class="dependency-command"><pre tabindex="0" aria-label="${t.copy}"><code>${esc(item.installCommand)}</code></pre><button type="button" class="btn secondary sm" data-copy-dependencies>${t.copy}</button><span class="dependency-feedback" role="status" aria-live="polite"></span></div>`:''}<div class="dependency-groups">${item.framework==='html'?'':group(t.runtime,packageList(item.runtime,t))+group(t.direct,packageList(item.directPackages,t))+(item.supportPackages?.length?group(t.support,packageList(item.supportPackages,t)):'')}${group(t.local,fileList(item.localImports,t))}${group(t.styles,fileList(item.styles,t))}</div>${item.buildTools?.length?`<details class="dependency-build"><summary>${t.build}</summary>${packageList(item.buildTools,t)}</details>`:''}<footer class="dependency-links">${item.framework==='react'?`<a href="/block-sources/manifest.json" target="_blank" rel="noopener">${t.source}</a>`:''}<a href="/api/v1/dependencies.json" target="_blank" rel="noopener">${t.manifest}</a><a href="${reference}" target="_blank" rel="noopener">${t.reference}</a></footer></div></details>`;
}

let manifestPromise;
const mounts=new WeakMap();
async function getManifest(){
 if(!manifestPromise)manifestPromise=fetch('./api/v1/dependencies.json').then(response=>{if(!response.ok)throw new Error('dependencies');return response.json();}).catch(error=>{manifestPromise=null;throw error;});
 return manifestPromise;
}

/** Starts a cached fetch and immediately returns cleanup for route lifecycle owners. */
export function mountPreviewDependencies(container,{id,kind='block',locale,copy,notify}={}){
 if(!container)return ()=>{};
 mounts.get(container)?.abort();const controller=new AbortController();mounts.set(container,controller);
 const document=container.ownerDocument||globalThis.document;
 locale=locale||document?.documentElement.lang||'ko';
 let item,phase='loading';
 const current=()=>mounts.get(container)===controller&&!controller.signal.aborted;
 container.setAttribute('data-i18n-ignore','');
 function render(){
  const opened=[...container.querySelectorAll('details')].map(detail=>detail.open),t=strings(locale);
  container.innerHTML=phase==='ready'?renderPreviewDependencies(item,{locale}):phase==='error'?`<p class="dependency-note" role="status">${t.error}</p><button type="button" class="btn secondary sm" data-retry-dependencies>${t.retry}</button>`:`<p class="dependency-note" role="status">${t.loading}</p>`;
  container.querySelectorAll('details').forEach((detail,index)=>{if(opened[index]!==undefined)detail.open=opened[index];});
 }
 async function load(){
  phase='loading';render();
  try{const manifest=await getManifest();if(!current())return;item=manifest.items.find(entry=>entry.id===id&&entry.kind===kind);if(!item)throw new Error('unknown dependency record');phase='ready';}
  catch{if(!current())return;phase='error';}
  render();
 }
 container.addEventListener('click',async event=>{
  if(event.target.closest('[data-retry-dependencies]')){load();return;}
  if(!event.target.closest('[data-copy-dependencies]')||!item?.installCommand)return;
  const status=container.querySelector('.dependency-feedback'),t=strings(locale);
  try{if(copy)await copy(item.installCommand);else await navigator.clipboard.writeText(item.installCommand);if(status)status.textContent=t.copied;notify?.(t.copied);}catch{if(status)status.textContent=t.failed;}
 },{signal:controller.signal});
 document?.addEventListener('klic:locale-changed',event=>{locale=event.detail?.locale||document.documentElement.lang||'ko';render();},{signal:controller.signal});
 load();
 return ()=>{controller.abort();if(mounts.get(container)===controller)mounts.delete(container);};
}
