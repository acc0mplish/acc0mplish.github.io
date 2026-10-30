import {renderItemDelivery,initItemDelivery} from './item-delivery.mjs';
import {libraryScopeText} from './library-scope.mjs';
import {SITE_ORIGIN} from './site-metadata.mjs';
import {translateText,blockDisplayName} from './i18n.mjs';
import {designGuidanceMarkdown,renderDesignGuidance} from './design-guidance.mjs';
export const DISCOVERY_ORIGIN=SITE_ORIGIN;
export const escapeDiscovery=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const localeURL=(url,locale='ko')=>url.split('?')[0]+(locale==='en'?'?lang=en':'');
const e=escapeDiscovery;
const omitted=new Set(['id','kind','path','cssVariable','cssProperty','chain','tailwind','value','code','language','module','route','docsRoute','shareUrl','exports','tags','schemaVersion','implementation','scope','status']);
export const localizedName=(item,locale='ko')=>locale==='en'?(item.kind==='block'?blockDisplayName(item.id,item.name,'en'):translateText(item.name)):item.name;
export function localizeItem(item,locale='ko'){
 if(locale!=='en')return item;
 const walk=(v,key='')=>omitted.has(key)?v:typeof v==='string'?translateText(v):Array.isArray(v)?v.map(x=>walk(x)):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,walk(x,k)])):v;
 const result=walk(item);result.name=localizedName(item,'en');if(result.design?.use)result.design.use=result.design.use.map((v,i)=>/^「.+」의 용도:/.test(item.design.use[i])?`Use ${result.name}: ${result.description}`:v);result.shareUrl=localeURL(item.canonicalUrl||item.shareUrl,'en');return result;
}
export const copyLabel=(locale,ko,en)=>locale==='en'?en:ko;
export function renderProse(value,locale='ko'){const s=e(value);return locale==='en'&&/[가-힣]/.test(value)?`<span lang="ko" data-source-language="ko">${s}</span>`:s;}
export function adoptionPrompt(item,locale='ko'){
 const x=localizeItem(item,locale),d=x.design,T=(ko,en)=>copyLabel(locale,ko,en);
 return [`KLIC ${x.kind}/${x.id}: ${x.name}`,T('공식 문서','Canonical document')+': '+localeURL(item.canonicalUrl||item.shareUrl,locale),`DESIGN.md: ${DISCOVERY_ORIGIN}${d.exports.design}`,`Contract: ${DISCOVERY_ORIGIN}${d.exports.contract}`,T('사용 원칙','Use')+': '+d.use.join(' '),T('금지 사항','Avoid')+': '+d.avoid.join(' '),T('접근성','Accessibility')+': '+d.accessibility.join(' '),'7 Dimensions: size, typography, color, layout, spacing, surface, interaction','Primitive → Brand → Semantic → Component; namespace klic.',T('모션 레시피','Motion recipes')+`: ${DISCOVERY_ORIGIN}/api/v1/motions.json · ${DISCOVERY_ORIGIN}/api/v1/motions/{id}.json`,T('모션은 필요한 경우에만 사용하고, prefers-reduced-motion을 따르며 정적 대안을 제공합니다.','Use motion only when it helps. Respect prefers-reduced-motion and keep a static alternative.'),libraryScopeText(locale),designGuidanceMarkdown(locale),...d.tokenMapping.map(t=>`${t.path} → var(${t.cssVariable}); ${t.chain.join(' → ')}`),T('샘플·미검증 범위와 실제 제품 구현을 구분하세요.','Distinguish sample behavior and unverified scope from product implementation.'),...(item.status==='ready'?[`Bundle: ${DISCOVERY_ORIGIN}/api/v1/bundles/${item.kind}/${item.id}.json`]:[T('준비 중: 소스 설치를 제공하지 않습니다.','Planned: source installation is unavailable.')])].join('\n');
}
export function renderAdoptionSummary(item,locale='ko',{includeDecisionTable=true,includeDelivery=true}={}){
 const x=localizeItem(item,locale),d=x.design,T=(ko,en)=>copyLabel(locale,ko,en),p=v=>renderProse(v,locale);
 const implementation=item.status!=='ready'?T('준비 중 · 실행 소스 없음','Planned · no executable source'):item.kind==='block'?'React · TypeScript':'Native HTML · CSS · DOM';
 const rows=[[T('항목','Item'),`${item.kind}/${item.id}`],[T('상태·구현','Status / implementation'),implementation],[T('데이터 범위','Data scope'),T('로컬 예제 · 실제 저장·인증·운영은 별도 구현','Local example · product persistence, authentication and operations require separate implementation')],[T('설계 기준','Framework'),'7 Dimensions · Primitive → Brand → Semantic → Component'],[T('토큰','Tokens'),'klic.']];
 if(item.id==='flow-connector-interaction')rows.push([T('변경 기록','Change history'),T('예제 메모리 · 최근 8개 · 초기화 시 비움','Example memory · latest 8 entries · cleared on reset')]);
 return `<section class="discovery-summary" data-discovery-summary><div class="eyebrow">BUILD WITH CONTEXT</div><h2>${T('적용 전 확인하세요','Before you adopt')}</h2><dl data-adoption-summary>${rows.map(([k,v])=>`<div><dt>${e(k)}</dt><dd>${e(v)}</dd></div>`).join('')}</dl><div class="discovery-actions"><a href="${e(d.exports.design)}">DESIGN.md</a><a href="${e(d.exports.contract)}">contract.json</a>${item.status==='ready'?`<a href="/api/v1/bundles/${item.kind}/${item.id}.json">${T('파일 목록 확인','Inspect file list')}</a>`:''}<button type="button" data-discovery-copy="${e(adoptionPrompt(item,locale))}">${T('AI 프롬프트 복사','Copy AI prompt')}</button><button type="button" data-copy-design="${e(d.exports.design)}">${T('DESIGN.md 복사','Copy DESIGN.md')}</button></div><p>${T('설계 문서 원문은 한국어이며, 토큰 ID와 소스 코드는 번역하지 않습니다.','Original DESIGN.md is Korean. Token IDs and source code are not translated.')}</p><pre><code>klic_get_item({"kind":"${item.kind}","id":"${item.id}"})</code></pre>${includeDelivery&&item.status==='ready'?renderItemDelivery(item.kind,item.id,{locale}):''}${renderDesignGuidance(locale)}${includeDecisionTable?`<h3>${T('설계 오류를 예방하는 기준','Troubleshooting design choices')}</h3><div class="table-scroll"><table><thead><tr><th>${T('피해야 할 상황','Avoid this condition')}</th><th>${T('적용 기준','Decision criterion')}</th></tr></thead><tbody>${d.avoid.slice(0,3).map((v,i)=>`<tr><td>${p(v)}</td><td>${p(d.use[i%d.use.length]||x.description)}</td></tr>`).join('')}</tbody></table></div>`:''}<p role="status" data-discovery-status aria-live="polite"></p></section>`;
}
export function renderAlternatives(item,related,locale='ko'){
 const T=(ko,en)=>copyLabel(locale,ko,en);
 return `<section data-discovery-alternatives><h2>${item.status==='ready'?T('비교하고 선택하세요','Compare alternatives'):T('지금 사용할 수 있는 대안','Available alternatives')}</h2><div class="table-scroll"><table><thead><tr><th>${T('항목','Item')}</th><th>${T('선택 기준','When to choose it')}</th><th>${T('상태','Status')}</th></tr></thead><tbody>${related.filter(r=>r.status==='ready'&&r.id!==item.id).map(r=>{const x=localizeItem(r,locale);return `<tr><td><a href="${e(localeURL(r.canonicalUrl||r.shareUrl,locale))}">${e(x.name)}</a></td><td>${renderProse(x.description,locale)}</td><td>ready</td></tr>`;}).join('')}</tbody></table></div><p>${item.kind==='block'&&item.collection==='diagrams'?`<a href="${localeURL('/collections/diagrams',locale)}">${T('다이어그램 블록','Diagram blocks')}</a> · `:''}<a href="${localeURL('/guides/tokens',locale)}">${T('토큰 참조 체인','Token reference chains')}</a> · <a href="${localeURL('/guides/mcp-recipes',locale)}">${T('에이전트 레시피','Agent recipes')}</a></p></section>`;
}
export function mountDiscoveryActions(root,{copy,notify=()=>{}}){
 initItemDelivery(root,{copy});
 root.addEventListener('click',async event=>{const button=event.target.closest('[data-discovery-copy],[data-copy-design]');if(!button||!root.contains(button))return;const status=root.querySelector('[data-discovery-status]'),en=(root.ownerDocument||root).documentElement.lang==='en';
 try{button.disabled=true;let value=button.dataset.discoveryCopy;if(button.dataset.copyDesign){const r=await fetch(button.dataset.copyDesign);if(!r.ok||r.headers.get('content-type')?.includes('text/html'))throw Error('download');value=await r.text();}await copy(value);if(status)status.textContent=en?'Copy request completed.':'복사 요청을 완료했습니다.';}
 catch{const message=en?'Could not copy. Open the linked DESIGN.md or select the text manually.':'복사하지 못했습니다. DESIGN.md 링크를 열거나 텍스트를 직접 선택하세요.';if(status)status.textContent=message;notify(message);}finally{button.disabled=false;}
 });
}

export function sharedNavigationTarget(pathname,hash,locale='ko'){
 const match=pathname.match(/^\/share\/(component|block)\/([a-z0-9-]+)$/);if(!match)return null;
 const parts=hash.replace(/^#/,'').split('/'),kind=parts[0]==='component'?'component':parts[0]==='blocks'&&parts[1]&&!['collection','guide'].includes(parts[1])?'block':null;
 if(kind===match[1]&&parts[1]===match[2])return null;
 const query=locale==='en'?'?lang=en':'';
 return kind?`/share/${kind}/${parts[1]}${query}${hash}`:`/${query}${hash||'#home'}`;
}
