import {DESIGN_DOCS} from './design-docs-data.mjs';
// Preserve an old incoming hash without retaining its removed content or label.
const normalizeSlug=slug=>slug==='book'?'purpose':slug;
export const DESIGN_DOC_LABELS=Object.fromEntries(DESIGN_DOCS.map(item=>[item.slug,item.label]));
export function isDesignDocs(slug){return slug==='design-system'||DESIGN_DOCS.some(item=>item.slug===normalizeSlug(slug));}
export function renderDesignDocs(slug){
 const current=DESIGN_DOCS.find(item=>item.slug===normalizeSlug(slug));
 const nav=DESIGN_DOCS.map(item=>`<a href="#docs/${item.slug}" ${current?.slug===item.slug?'aria-current="page"':''}>${item.label}</a>`).join('');
 const content=current?`<div class="ds-copy">${current.html}</div>`:'';
 const overview=`<div class="ds-intro"><h2>7개의 관점, 4단계의 위계.</h2><p>KLIC의 설계 원칙과 실제 구현을 연결합니다. 값의 출처를 추적하고, 화면의 행동을 정의하고, 제품에 적용할 기준을 확인하세요.</p><div class="ds-cards">${DESIGN_DOCS.map((item,i)=>`<a href="#docs/${item.slug}"><span>${String(i+1).padStart(2,'0')}</span><strong>${item.label}</strong><small>${item.title}</small><b aria-hidden="true">↗</b></a>`).join('')}</div></div>`;
 return `<div class="ds-page" data-i18n-ignore><header class="ds-header"><div class="eyebrow">KLIC DESIGN SYSTEM / DOCS</div><h1>${current?current.label:'디자인 시스템 가이드'}</h1><p>${current?current.title:'KLIC의 설계 원칙 · 4계층 토큰 · 컴포넌트와 제품 적용 기준'}</p><div class="ds-status"><strong>가이드 · 2026.10.27</strong><span>현재 구현 설명과 제품 적용 지침을 구분합니다. 각 장에서 구현 근거와 검증 범위를 확인하세요.</span></div><div class="ds-links"><a href="#tokens">토큰 탐색기 ↗</a><a href="#docs/contracts">현행 구현 계약 ↗</a><a href="#components">컴포넌트 ↗</a><a href="#lab">리사이즈 실험실 ↗</a><a href="./KLIC_Design_System_DOCS.md" download>DOCS 내려받기 ↓</a></div></header><div class="ds-layout"><nav class="ds-nav" aria-label="디자인 시스템 문서"><a href="#docs/design-system" ${!current?'aria-current="page"':''}>전체 문서</a>${nav}</nav><article class="ds-article">${current?content:overview}<div class="ds-next"><a href="#docs/design-system">← 문서 전체 보기</a><a href="#docs/sources">구현 근거 →</a></div></article></div></div>`;
}
