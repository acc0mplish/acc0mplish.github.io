import {initDocumentLinks} from './document-links.mjs';
import {initPublicTheme} from './public-theme.mjs';
import {initSiteChrome} from './site-chrome.mjs';
import {initResourceCodeTabs,resourceCopyText} from './resource-code-tabs.mjs';
import {openResourceGuidanceHash} from './resource-guidance-hash.mjs';
initPublicTheme();initSiteChrome();
initResourceCodeTabs(document);
openResourceGuidanceHash(document,location.hash);
window.addEventListener('hashchange',()=>openResourceGuidanceHash(document,location.hash));
const en=document.documentElement.lang==='en';
document.querySelector('[data-klic-language]')?.addEventListener('change',event=>{const url=new URL(location.href);if(event.target.value==='en')url.searchParams.set('lang','en');else url.searchParams.delete('lang');location.assign(url.href);});
const web=document.querySelector('[data-resource-webmcp]');
if(web)web.textContent=typeof document.modelContext?.registerTool==='function'?(en?'Registration API available. Open the workspace to use its tools.':'등록 API를 사용할 수 있습니다. 작업 화면을 열면 도구가 등록됩니다.'):(en?'This browser does not expose the registration API. JSON API, CLI and ordinary navigation are available.':'이 브라우저는 등록 API를 제공하지 않습니다. JSON API·CLI와 일반 탐색을 사용할 수 있습니다.');
document.addEventListener('click',async event=>{const button=event.target.closest('[data-resource-copy]');if(!button)return;const value=resourceCopyText(button.closest('.kr-code')),status=document.querySelector('[data-resource-status]');try{await navigator.clipboard.writeText(value);button.textContent=en?'Copied':'복사됨';status.textContent=en?'Code copied.':'코드를 복사했습니다.';}catch{let area=document.querySelector('[data-resource-manual]');if(!area){area=document.createElement('textarea');area.dataset.resourceManual='';area.setAttribute('aria-label',en?'Select and copy manually':'직접 선택해 복사');area.rows=8;status.after(area);}area.hidden=false;area.value=value;area.focus();area.select();status.textContent=en?'Select the text below and copy it.':'아래 텍스트를 선택해 직접 복사하세요.';}});

if(typeof document!=='undefined')initDocumentLinks();
