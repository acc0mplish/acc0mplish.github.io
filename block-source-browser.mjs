import {escapeHTML as esc,icon} from './catalog.js';

function safeHref(href){
 if(typeof href!=='string'||!/^\/(?:block-sources\/[A-Za-z0-9_./-]+|locales\/[A-Za-z0-9_.-]+\.mjs|block-runtime\/portraits\/registry\.mjs|[A-Za-z0-9_-]+\.(?:mjs|js|css))$/.test(href)||href.split('/').some(s=>s==='.'||s==='..'))throw new Error('Unsafe local source path');
 return href;
}

/** The dependency manifest is generated from actual source imports, not guessed filenames. */
export function blockSourceFiles(block,dependency){
 if(!dependency||dependency.kind!=='block'||dependency.id!==block.id||dependency.status!=='ready')throw new Error('Missing block dependency record');
 const entry={path:block.sourceFile,href:safeHref('/block-sources/'+block.sourceFile)};
 const files=[entry,...(dependency.localFiles||[]),...(dependency.styles||[]),{path:'NOTICE.md',href:'/block-sources/NOTICE.md'}];
 const seen=new Set();
 return files.filter(file=>{safeHref(file.href);if(seen.has(file.href))return false;seen.add(file.href);return true;}).map(({path,href})=>({path,href}));
}

export async function loadBlockSourceFiles(block,{fetcher=fetch,signal}={}){
 const response=await fetcher('./api/v1/dependencies.json',{signal});
 if(!response.ok)throw new Error('Could not load block source dependencies');
 const manifest=await response.json();
 return blockSourceFiles(block,manifest.items?.find(item=>item.kind==='block'&&item.id===block.id));
}

export async function readBlockSource(file,{fetcher=fetch,signal}={}){
 const response=await fetcher(sourceTextHref(file),{signal});
 if(!response.ok)throw new Error('Could not load selected source file');
 return response.text();
}

// A .txt mirror avoids development servers compiling TSX or rewriting imports.
export const sourceTextHref=file=>'/source-text'+safeHref(file.href)+'.txt';

export function mountBlockSourceBrowser(container,{block,isCurrent=()=>true,copy,download}={}){
 const controller=new AbortController();let files=[],selected=null,source='',request=0;
 const current=()=>!controller.signal.aborted&&isCurrent();
 container.innerHTML=`<div class="block-source-note">${icon('file-code-2')}<div><strong>이 블록을 구성하는 KLIC 소스</strong><p>진입 파일과 연결된 차트 구현·공용 모듈·스타일을 함께 확인하세요. 상대 import는 아래 로컬 파일을 참조합니다.</p></div></div><div class="block-source-picker"><label for="block-source-file">구현 파일 선택</label><select id="block-source-file" aria-label="구현 파일 선택" disabled><option>파일 목록을 불러오고 있습니다…</option></select><span data-source-count></span></div><div class="code-panel"><div class="code-panel-header"><span data-source-path></span><div class="block-code-actions"><a class="text-link" data-source-open target="_blank" rel="noopener">원문 열기</a><button class="btn secondary sm" type="button" data-source-copy disabled>${icon('copy')}복사</button><button class="btn secondary sm" type="button" data-source-download disabled>${icon('download')}파일</button></div></div><pre class="block-source-pre" tabindex="0" aria-label="블록 소스 코드"><code data-source-code>소스를 불러오고 있습니다…</code></pre></div><div class="info-note"><div><strong>실행 소스 전체 가져오기</strong><p>파일 하나를 복사하면 상대 경로의 모듈은 포함되지 않습니다. 아래 명령으로 구현·스타일·토큰·자산·출처 고지가 포함된 소스를 가져오세요.</p><code>bun klic.mjs add block ${esc(block.id)} --out ./klic-${esc(block.id)}</code><p><a class="text-link" href="./api/v1/bundles/block/${esc(block.id)}.json" target="_blank" rel="noopener">전체 파일 목록</a> · <a class="text-link" href="./block-sources/NOTICE.md" target="_blank" rel="noopener">소스·라이선스 고지</a></p></div></div>`;
 const code=container.querySelector('[data-source-code]'),picker=container.querySelector('#block-source-file');
 const buttons=()=>container.querySelectorAll('[data-source-copy],[data-source-download]');
 async function select(index){
  const next=files[index];if(!next)return;const serial=++request;selected=null;source='';buttons().forEach(b=>b.disabled=true);
  code.textContent='소스를 불러오고 있습니다…';container.querySelector('[data-source-path]').textContent=next.path;
  const link=container.querySelector('[data-source-open]');link.href=sourceTextHref(next);
  try{const text=await readBlockSource(next,{signal:controller.signal});if(!current()||serial!==request)return;selected=next;source=text;code.textContent=text;buttons().forEach(b=>b.disabled=false);}
  catch{if(current()&&serial===request)code.textContent='소스를 불러오지 못했습니다. 파일을 다시 선택해주세요.';}
 }
 container.addEventListener('change',event=>{if(event.target===picker)select(Number(picker.value));},{signal:controller.signal});
 container.addEventListener('click',event=>{
  if(!selected)return;
  if(event.target.closest('[data-source-copy]'))copy?.(source,'선택한 파일 소스를 복사했습니다.');
  if(event.target.closest('[data-source-download]'))download?.(source,selected.path.split('/').pop(),'text/plain;charset=utf-8');
 },{signal:controller.signal});
 loadBlockSourceFiles(block,{signal:controller.signal}).then(result=>{
  if(!current())return;files=result;picker.innerHTML=files.map((file,i)=>`<option value="${i}">${esc(file.path)}</option>`).join('');picker.disabled=false;
  container.querySelector('[data-source-count]').textContent=`연결된 파일 ${files.length}개`;select(0);
 }).catch(()=>{if(current()){picker.innerHTML='<option>파일 목록을 불러오지 못했습니다.</option>';code.textContent='소스 탭을 다시 열어주세요.';}});
 return ()=>{controller.abort();request++;};
}
