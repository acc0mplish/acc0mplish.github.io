import {panelCrmSceneMessages} from './locales/panel-crm-scene-en.mjs';
import {BLOCK_IDENTITIES} from './block-identities.mjs';
import {panelTaskSceneMessages} from './locales/panel-task-scene-en.mjs';
import {panelRiskSceneMessages} from './locales/panel-risk-scene-en.mjs';
import {panelTimelineSceneMessages} from './locales/panel-timeline-scene-en.mjs';
import {chartUiMessages} from './locales/chart-ui-en.mjs';
import {blockUiMessages} from './locales/block-ui-en.mjs';
import {sharedBlockUiMessages} from './locales/shared-block-ui-en.mjs';
import {sourceUiMessages} from './locales/source-ui-en.mjs';
import {messages} from './locales/en.mjs';
import {guideMessages} from './locales/guides-en.mjs';
import {catalogMessages,blockNames} from './locales/catalog-en.mjs';
import {CHART_EXAMPLES,CHART_GROUPS} from './chart-examples.mjs';
import {dashboardMessages} from './locales/dashboard-en.mjs';
import {rightPanelMessages,rightPanelNames} from './locales/right-panel-en.mjs';
import {interactionReferenceMessages} from './locales/interaction-reference-en.mjs';
import {SITE_METADATA} from './site-metadata.mjs';
export const LOCALE_STORAGE_KEY='klic-language-v1';
export const SUPPORTED_LOCALES=Object.freeze([...SITE_METADATA.site.locales]);
const chartNames=Object.fromEntries(CHART_EXAMPLES.map(e=>[e.id,e.enTitle]));
const chartMessages=Object.fromEntries([
 ...Object.values(CHART_GROUPS).map(group=>[group.name,group.en]),
 ...CHART_EXAMPLES.flatMap(e=>[
  [e.title,e.enTitle],
  [e.description,e.enDescription],
  [`Björk UI · MIT · KLIC 토큰 적용 · variant=${e.variant} · ${e.enTitle}`,`Björk UI · MIT · KLIC token adaptation · variant=${e.variant} · ${e.enTitle}`]
 ])
]);
const panelSceneMessages=Object.fromEntries(Object.entries({...panelCrmSceneMessages,...panelTaskSceneMessages,...panelRiskSceneMessages,...panelTimelineSceneMessages}).filter(([key])=>!['님이','일','월','년','건'].includes(key)));
const authoredEnglish={...panelSceneMessages,...chartUiMessages,...blockUiMessages,...sharedBlockUiMessages,...sourceUiMessages,...messages,...catalogMessages,...guideMessages,...chartMessages,...dashboardMessages,...rightPanelMessages,...interactionReferenceMessages};
// Blank TSV rows must never turn spacer nodes into the string "undefined".
export const ENGLISH_MESSAGES=Object.freeze(Object.fromEntries(Object.entries(authoredEnglish).filter(([source,target])=>source.trim().length>0&&typeof target==='string')));
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
export function normalizeLocale(value){return SUPPORTED_LOCALES.includes(value)?value:SITE_METADATA.site.defaultLocale;}
export function initialLocale({search='',stored}={}){
 const query=new URLSearchParams(search).get('lang');
 return normalizeLocale(SUPPORTED_LOCALES.includes(query)?query:stored);
}
export function authoritativeLocale(pathname,search,stored){return initialLocale({search,stored:pathname.startsWith('/share/')||pathname==='/'||pathname==='/index.html'?null:stored});}
const replaceKnown=value=>own(ENGLISH_MESSAGES,value)?ENGLISH_MESSAGES[value]:value;
const patterns=[
 [/^실행 (\d+) · 준비 (\d+)$/,(_,ready,planned)=>`${ready} working · ${planned} planned`],
 [/^(.*) \(실행 (\d+) · 준비 (\d+)\)$/,(_,label,ready,planned)=>`${replaceKnown(label)} (${ready} working · ${planned} planned)`],
 [/^(.*) \((실행|준비) (\d+)\)$/,(_,label,state,count)=>`${replaceKnown(label)} (${count} ${state==='실행'?'working':'planned'})`],
 [/^연결된 파일 (\d+)개$/,(_,n)=>`${n} connected files`],
 [/^전체 (\d+)개 중 (\d+)번째 버전$/,(_,n,i)=>`Version ${i} of ${n}`],
 [/^도구 (\d+)개 사용$/,(_,n)=>`Used ${n} tools`],
 [/^(\d+)개 실패$/,(_,n)=>`${n} failed`],
 [/^5점 만점에 (\d+)점$/,(_,n)=>`${n} out of 5 stars`],
 [/^항목 (\d+)개$/,(_,n)=>`${n} items`],
 [/^(\d+)명$/,(_,n)=>`${n} people`],
 [/^(\d+)개 작업$/,(_,n)=>`${n} jobs`],
 [/^(\d+)개$/,(_,n)=>`${n} items`],
 [/^(\d+)건$/,(_,n)=>`${n} events`],
 [/^(\d+) \/ (\d+)$/,(_,done,total)=>`${done} / ${total}`],
 [/^(.+) (실행 중|실행 완료|실행 실패)$/,(_,name,state)=>`${translateText(name)} ${({'실행 중':'running','실행 완료':'complete','실행 실패':'failed'})[state]}`],
 [/^(\d+)초$/,(_,n)=>`${n}s`],
 [/^(\d+)분 (\d+)초$/,(_,m,s)=>`${m}m ${s}s`],
 [/^(\d+)시간 (\d+)분$/,(_,h,m)=>`${h}h ${m}m`],
 [/^(\d+)일 (\d+)시간$/,(_,d,h)=>`${d}d ${h}h`],

 [/^(\d+)개 컴포넌트 · (\d+)개 형태$/,(_,count,forms)=>`${count} components · ${forms} forms`],
 [/^(\d+)개 적용 \/ 전체 (\d+)개$/,(_,used,total)=>`${used} applied / ${total} total`],
 [/^· 전체 정의 (\d+)개 중 (\d+)개 표시$/,(_,total,shown)=>`· showing ${shown} of ${total} definitions`],
 [/^(.+?) · (.+?) → (.+)$/,(_,label,a,b)=>`${translateText(label)} · ${translateText(a)} → ${translateText(b)}`],

 [/^(.*) · 독립 SVG 구현 · 샘플 데이터$/,(_,name)=>`${translateText(name)} · Original SVG implementation · sample data`],
 [/^(이벤트|명령) (\d+)·(\d+)$/,(_,label,a,b)=>`${replaceKnown(label)} ${a}·${b}`],
 [/^(즉시 처리|수동 검토|보관 대기) (\d+)건\/분$/,(_,label,n)=>`${replaceKnown(label)} ${n}/min`],
 [/^입력 (\d+)건\/분$/,(_,n)=>`Input ${n}/min`],
 [/^입력 (\d+)건\/분 = 출력 (\d+) \+ (\d+) \+ (\d+)건\/분 · 샘플 데이터$/,(_,total,a,b,c)=>`Input ${total}/min = output ${a} + ${b} + ${c}/min · sample data`],
 [/^방향별 교환 합계 (\d+)건 · 호의 넓이는 유입\+유출 · 샘플 데이터$/,(_,n)=>`Total directed exchange ${n} · arc size = incoming + outgoing · sample data`],
 [/^(.+) → (.+) (\d+)건$/,(_,a,b,n)=>`${replaceKnown(a)} → ${replaceKnown(b)} ${n}`],
 [/^(\d+)개 관계$/,(_,n)=>`${n} relationships`],
 [/^(.+) 노드 선택$/,(_,name)=>`Select ${translateText(name)} node`],
 [/^수량: (\d+)건$/,(_,n)=>`Quantity: ${n}`],

 [/^가용 폭 (\d+)px · (.*)$/,(_,width,scale)=>`Available ${width}px · ${scale}`],
 [/^(\d+)개 항목$/,(_,count)=>`${count} items`],
 [/^(.*) \((\d+)\)$/,(_,label,count)=>`${replaceKnown(label)} (${count})`],
 [/^(.*) · (.*?) 분류\.$/,(_,title,category)=>`${replaceKnown(title)} · ${replaceKnown(category)} category.`],
 [/^카탈로그에 전용 구현 연결: (.*)\. 구현 연결은 브라우저 검증 결과와 별개다\.$/,(_,file)=>`Dedicated implementation linked in the catalog: ${replaceKnown(file)}. Implementation wiring is separate from browser validation.`],
 [/^카탈로그 예시 항목: (.*)\. 전용 구현 연결 여부는 미확정이다\.$/,(_,file)=>`Catalog example: ${replaceKnown(file)}. A dedicated implementation has not been confirmed.`],
 [/^(.*) 즐겨찾기$/,(_,label)=>`Favorite ${replaceKnown(label)}`],
 [/^(.*) (실행 예시|준비 항목) 열기$/,(_,label,status)=>`Open ${replaceKnown(label)} · ${replaceKnown(status)}`],
 [/^(.*) 실제 데이터 썸네일$/,(_,label)=>`${replaceKnown(label)} actual-data thumbnail`],
 [/^동일한 구현 모듈의 변형을 포함합니다\. 준비 항목 (\d+)개는 원본에 실행 화면이 연결되지 않은 카탈로그입니다\.$/,(_,count)=>`Includes variants of the same implementation module. The ${count} planned items have no runnable screen linked in the original catalog.`],
 [/^(\d+)개 카탈로그 중 (\d+)개 예시를 (\d+)개 구현 모듈로 연결했습니다\. (\d+)개 준비 항목은 실행 예시와 구분합니다\. 일부 예시는 같은 모듈의 상태·모드 변형입니다\.$/,(_,total,live,modules,planned)=>`${live} examples from ${total} catalog items are linked to ${modules} implementation modules. The ${planned} planned items are listed separately. Some examples are state or mode variants of the same module.`],
 [/^(\d+)개 도구가 현재 탭에 등록되었습니다\.$/,(_,count)=>`${count} tools are registered in this tab.`],
 [/^(\d+) · (\d+)개 검색 결과$/,(_,status,count)=>`${status} · ${count} search results`],
 [/^프리뷰 (.+)$/,(_,label)=>`Preview ${replaceKnown(label)}`],
 [/^(\d+)개 그룹 · (\d+)개 토큰$/,(_,a,b)=>`${a} groups · ${b} tokens`],
 [/^(\d+)개 결과( · 상위 (\d+)개 표시)?$/,(_,a,b,c)=>`${a} results${c?` · showing first ${c}`:''}`],
 [/^(\d+) \/ (\d+)개 블록 · (.+)$/,(_,a,b,c)=>`${a} / ${b} blocks · ${c}`],
 [/^(\d+)개 사용 예제$/,(_,a)=>`${a} usage examples`],
 [/^(\d+)개 컴포넌트$/,(_,a)=>`${a} components`],
 [/^(\d+)개 블록$/,(_,a)=>`${a} blocks`],
 [/^(\d+)개 토큰$/,(_,a)=>`${a} tokens`],
 [/^(\d+)개의 실행 예시는 (\d+)개의 구현 모듈을 공유합니다\. 준비 중인 항목은 라이브러리에서 별도로 표시합니다\.$/,(_,a,b)=>`${a} executable examples share ${b} implementation modules. Planned items are listed separately.`],
 [/^(\d+)개 컴포넌트, 실행 블록 (\d+)개, 준비 항목 (\d+)개의 메타데이터와 소스 참조$/,(_,a,b,c)=>`Metadata and source references for ${a} components, ${b} executable blocks, and ${c} planned items`],
 [/^(\d+)종 native HTML\/CSS 컴포넌트 · (\d+)개 사용 예제$/,(_,a,b)=>`${a} native HTML/CSS components · ${b} usage examples`],
 [/^(\d+)종 둘러보기 →$/,(_,a)=>`Explore all ${a} →`],
 [/^(.*) · (\d+)$/,(_,label,count)=>`${replaceKnown(label)} · ${count}`],
 [/^(.*) (\d+)$/,(_,label,count)=>`${replaceKnown(label)} ${count}`],
 [/^(.*) 복사$/,(_,label)=>`Copy ${replaceKnown(label)}`],
 [/^(.*) 전체 보기 ↗$/,(_,label)=>`View all ${replaceKnown(label)} ↗`],
 [/^(.*) 위로$/,(_,label)=>`Move ${replaceKnown(label)} up`],
 [/^(.*) 아래로$/,(_,label)=>`Move ${replaceKnown(label)} down`],
 [/^(.*) 제거$/,(_,label)=>`Remove ${replaceKnown(label)}`],
 [/^(.*) 실행 미리보기$/,(_,label)=>`${replaceKnown(label)} interactive preview`],
 [/^(.*) 조합 미리보기$/,(_,label)=>`${replaceKnown(label)} composition preview`],
 [/^(.*) 실시간 조정$/,(_,label)=>`${replaceKnown(label)} live settings`],
 [/^(.*) 문서 보기$/,(_,label)=>`${replaceKnown(label)} documentation`],
 [/^(컴포넌트|블록) · (.*)$/,(_,type,label)=>`${replaceKnown(type)} · ${replaceKnown(label)}`],
 [/^(\d+)\. (.*)$/,(_,number,label)=>`${number}. ${replaceKnown(label)}`],
 [/^(.*) — KLIC$/,(_,label)=>`${replaceKnown(label)} — KLIC`],
];
/** Unknown source text deliberately falls back to its original language. No network translation. */
export function translateText(value,locale='en'){
 if(typeof value!=='string'||locale!=='en')return value;
 const match=value.match(/^(\s*)([\s\S]*?)(\s*)$/),text=match[2];
 let translated=replaceKnown(text);
 if(translated===text)for(const [pattern,replacement] of patterns){if(pattern.test(text)){translated=text.replace(pattern,replacement);break;}}
 if(/MCP|프로토콜/i.test(text)){
  let index=0;translated=translated.replace(/\b\d{4}-\d{2}-\d{2}\b/g,version=>SITE_METADATA.versions.mcpProtocols[index++]??version);
 }
 translated=translated.replace(/Node\.js \d+\+/g,`Node.js ${SITE_METADATA.toolchain.nodeMinimum}+`);
 translated=translated.replace(/Bun \d+\.\d+\.\d+/g,`Bun ${SITE_METADATA.toolchain.bun}`);
 return match[1]+translated+match[3];
}
export function blockDisplayName(id,original,locale='ko'){return locale==='en'?(own(BLOCK_IDENTITIES,id)?BLOCK_IDENTITIES[id].enTitle:own(rightPanelNames,id)?rightPanelNames[id]:own(chartNames,id)?chartNames[id]:own(blockNames,id)?blockNames[id]:original):original;}
export function languageControlMarkup(){return `<label class="klic-language-control" data-i18n-ignore><span class="sr-only">Language / 언어</span><select data-klic-language aria-label="Language / 언어">${SUPPORTED_LOCALES.map(locale=>`<option value="${locale}">${SITE_METADATA.site.localeNames[locale]}</option>`).join('')}</select></label>`;}
const SKIP='script,style,code,pre,textarea,[contenteditable="true"],[data-i18n-ignore],[translate="no"]';
const ATTRIBUTES=['aria-label','aria-description','title','placeholder','alt'];
const STYLE=`.klic-language-control{display:inline-flex;align-items:center;flex:none;font:12px var(--klic-ui-font,system-ui)}.klic-language-control select{color:var(--klic-semantic-color-text,#132c46);background:var(--klic-semantic-color-panel,#fff);border:1px solid var(--klic-semantic-color-border,#dfe5ee);border-radius:6px;min-height:32px;padding:4px 7px;max-width:100px;font:inherit}.klic-language-control select:focus-visible{outline:2px solid var(--klic-semantic-color-accent,#245fc2);outline-offset:3px}.i18n-source-note{font:12px/1.6 var(--klic-ui-font,system-ui);color:var(--klic-semantic-color-muted,#52657b);margin:0 0 18px;max-width:80ch}.hs-nav .klic-language-control{margin-left:auto;margin-right:12px}.topbar-tools .klic-language-control{margin-right:6px}@media(max-width:650px){.topbar-tools .klic-language-control select{max-width:82px;font-size:11px}.hs-nav .klic-language-control{margin:0 6px}.i18n-source-note{font-size:11px}}`;
/**
 * Adapter for the existing string-template renderers. Text and accessible labels are
 * translated without replacing elements, input values, event handlers, or code.
 * Source values are retained per node, so switching back is lossless.
 */
export function initI18n({root=globalThis.document,switches=true}={}){
 const doc=root?.nodeType===9?root:root?.ownerDocument;
 if(!doc?.createTreeWalker||!doc.defaultView)return {locale:'ko',setLocale(){},refresh(){},destroy(){}};
 const win=doc.defaultView;
 if(doc.__klicI18n)return doc.__klicI18n;
 let saved;try{saved=win.localStorage.getItem(LOCALE_STORAGE_KEY);}catch{}
 let locale=authoritativeLocale(win.location.pathname,win.location.search,saved),scheduled=false,destroyed=false;
 const textRecords=new WeakMap(),attributeRecords=new WeakMap(),fallbackParents=new Map();
 const style=doc.createElement('style');style.dataset.klicLocaleStyle='true';style.textContent=STYLE;doc.head.appendChild(style);
 function excluded(el){return !el||!!el.closest(SKIP);}
 function rememberText(node){const value=node.nodeValue||'',record=textRecords.get(node);if(!record||value!==record.last){const next={source:value,last:value};textRecords.set(node,next);return next;}return record;}
 function translateNode(node){
  if(excluded(node.parentElement))return;
  const record=rememberText(node),next=translateText(record.source,locale);
  if(node.nodeValue!==next)node.nodeValue=next;record.last=next;
  if(locale==='en'&&/[가-힣]/.test(next)&&node.parentElement&&node.parentElement.childElementCount===0){const el=node.parentElement;if(!fallbackParents.has(el))fallbackParents.set(el,el.getAttribute('lang'));el.setAttribute('lang','ko');}
 }
 function translateAttributes(el){
  if(excluded(el))return;
  let records=attributeRecords.get(el);if(!records){records={};attributeRecords.set(el,records);}
  for(const key of ATTRIBUTES){const value=el.getAttribute(key);if(value===null)continue;let record=records[key];if(!record||value!==record.last)record=records[key]={source:value,last:value};const next=translateText(record.source,locale);if(value!==next)el.setAttribute(key,next);record.last=next;}
 }
 function ensureControls(){
  if(!switches)return;
  for(const host of doc.querySelectorAll('.topbar-tools,.hs-nav'))if(!host.querySelector('[data-klic-language]'))host.insertAdjacentHTML('beforeend',languageControlMarkup());
  for(const select of doc.querySelectorAll('[data-klic-language]'))select.value=locale;
  const view=doc.querySelector('#view');
  if(view){let note=view.querySelector(':scope > .i18n-source-note');if(locale==='en'&&!note&&!view.querySelector('[data-acquisition-home]')){note=doc.createElement('p');note.className='i18n-source-note';note.dataset.i18nIgnore='';note.setAttribute('role','note');note.textContent='English interface. Source examples and untranslated reference text remain in Korean.';view.prepend(note);}else if(locale==='ko')note?.remove();}
 }
 function refresh(){
  scheduled=false;if(destroyed)return;observer.disconnect();
  for(const [el,oldLang]of fallbackParents){if(oldLang===null)el.removeAttribute('lang');else el.setAttribute('lang',oldLang);}fallbackParents.clear();
  if(doc.documentElement.lang!==locale)doc.documentElement.lang=locale;if(doc.documentElement.dataset.locale!==locale)doc.documentElement.dataset.locale=locale;
  ensureControls();
  const body=doc.body;if(body){const walker=doc.createTreeWalker(body,4);let node;while((node=walker.nextNode()))translateNode(node);for(const el of body.querySelectorAll(ATTRIBUTES.map(a=>`[${a}]`).join(',')))translateAttributes(el);}
  const title=doc.querySelector('title')?.firstChild;if(title)translateNodeTitle(title);
  observer.observe(doc.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:ATTRIBUTES});
 }
 function translateNodeTitle(node){const record=rememberText(node),next=translateText(record.source,locale);if(node.nodeValue!==next)node.nodeValue=next;record.last=next;}
 function schedule(){if(scheduled||destroyed)return;scheduled=true;win.queueMicrotask(refresh);}
 function broadcast(){for(const frame of doc.querySelectorAll('iframe')){try{if(new URL(frame.src,win.location.href).origin===win.location.origin)frame.contentWindow?.postMessage({type:'klic:locale',locale},win.location.origin);}catch{}}}
 function setLocale(value,{persist=true,broadcastChange=true}={}){locale=win.location.pathname.startsWith('/share/')||win.location.pathname==='/'||win.location.pathname==='/index.html'?authoritativeLocale(win.location.pathname,win.location.search,null):normalizeLocale(value);if(persist)try{win.localStorage.setItem(LOCALE_STORAGE_KEY,locale);}catch{}refresh();if(broadcastChange)broadcast();doc.dispatchEvent(new win.CustomEvent('klic:locale-changed',{detail:{locale}}));}
 function change(e){if(e.target?.matches?.('[data-klic-language]')){if(win.location.pathname.startsWith('/share/')||win.location.pathname==='/'||win.location.pathname==='/index.html'){win.location.assign(win.location.pathname+(e.target.value==='en'?'?lang=en':'')+win.location.hash);return;}setLocale(e.target.value);}}
 function storage(e){if(e.key===LOCALE_STORAGE_KEY)setLocale(e.newValue,{persist:false,broadcastChange:false});}
 function message(e){if(e.origin!==win.location.origin||e.source!==win.parent||e.data?.type!=='klic:locale'||!SUPPORTED_LOCALES.includes(e.data.locale))return;setLocale(e.data.locale,{persist:false,broadcastChange:false});}
 function load(e){if(e.target?.tagName==='IFRAME')broadcast();}
 const observer=new win.MutationObserver(schedule);
 doc.addEventListener('change',change);doc.addEventListener('load',load,true);win.addEventListener('storage',storage);win.addEventListener('message',message);doc.addEventListener('klic:route-rendered',schedule);
 const api={get locale(){return locale;},setLocale,refresh,destroy(){destroyed=true;observer.disconnect();doc.removeEventListener('change',change);doc.removeEventListener('load',load,true);win.removeEventListener('storage',storage);win.removeEventListener('message',message);doc.removeEventListener('klic:route-rendered',schedule);delete doc.__klicI18n;}};
 doc.__klicI18n=api;refresh();return api;
}
