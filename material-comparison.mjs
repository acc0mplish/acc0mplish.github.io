import {MATERIAL_IDS,MATERIAL_LABELS,materialStylesCSS} from './materials.mjs';
import {createTokens,resolveTokens,formatValue} from './tokens.mjs';
function comparisonStylesCSS(){
 const rules=[materialStylesCSS()];
 // Keep each complete recipe local to its specimen. Palette colors inherit from
 // the page, while opacity and depth come from the canonical material graph.
 for(const mode of ['light','dark']){
  const values=resolveTokens(createTokens('a',mode));
  for(const material of MATERIAL_IDS){
   const prefix=`klic.semantic.material.${material}.`;
   const declarations=Object.entries(values).filter(([path])=>path.startsWith(prefix)).map(([path,value])=>{
    const [role,property]=path.slice(prefix.length).split('.');
    const colorRole=property==='background'||property==='fallback'?(role==='chrome'?'surface':'panel'):property==='border'?(['field','control'].includes(role)?'control-border':'border'):property==='rim'?(mode==='dark'?'text':'panel'):null;
    const base=colorRole?`var(--klic-semantic-color-${colorRole})`:null;
    const css=base?(value.alpha===1?base:`color-mix(in srgb,${base} ${Math.round(value.alpha*100)}%,transparent)`):formatValue(value);
    return `--${path.replaceAll('.','-')}:${css};`;
   }).join('');
   rules.push(`${mode==='dark'?':root[data-theme="dark"] ':''}.km-section .km-stage[data-material="${material}"]{${declarations}}`);
  }
 }
 rules.push(`.km-section .km-stage{background:radial-gradient(ellipse at 13% 90%,var(--klic-semantic-color-surface-selected),transparent 72%),linear-gradient(135deg,var(--klic-semantic-color-surface-soft),var(--klic-semantic-color-surface));border-color:var(--klic-semantic-color-border)}
.km-section .km-orb{background:linear-gradient(135deg,color-mix(in srgb,var(--klic-semantic-color-accent) 35%,var(--klic-semantic-color-panel)),var(--klic-semantic-color-accent))}
.km-section .km-card{color:var(--klic-semantic-color-text);background:var(--klic-component-surface-card-background);border-color:var(--klic-component-surface-card-border)}
.km-section .km-status{background:var(--klic-component-surface-dense-background);border-color:var(--klic-component-surface-dense-border)}
.km-section .km-card>p,.km-section .km-card-foot{color:var(--klic-semantic-color-muted)}
.km-section .km-logo{background:var(--klic-semantic-color-accent);color:var(--klic-semantic-color-on-accent)}
.km-section .km-progress{background:var(--klic-semantic-color-border)}
.km-section .km-progress i{background:var(--klic-semantic-color-accent)}
.km-section .km-card-foot b,.km-section .km-status>span:first-child{color:var(--klic-semantic-color-success)}`);
 return rules.join('\n');
}
export function materialComparison(locale='ko'){
 const en=locale==='en';
 return `<section class="km-section" aria-labelledby="km-title"><style>${comparisonStylesCSS()}</style><div class="km-heading"><div><span class="eyebrow">ONE SYSTEM · FOUR MATERIALS</span><h2 id="km-title">${en?'The same structure. A different depth.':'같은 구조, 서로 다른 깊이.'}</h2><p>${en?'Compare four live surfaces. Layout, type and blue identity stay consistent.':'배치와 글꼴, 블루 아이덴티티를 유지하며 네 가지 표면을 비교하세요.'}</p></div><a class="btn secondary" href="#settings/theme">${en?'Choose your material':'내 화면에 적용하기'} ↗</a></div><div class="km-grid">${MATERIAL_IDS.map(material=>{
 return `<article class="km-option"><header><h3>${MATERIAL_LABELS[material]}</h3>${material==='solid-glass'?`<span>${en?'Recommended':'추천'}</span>`:''}</header><div class="km-stage" data-material="${material}"><div class="km-orb"></div><div class="km-card" data-klic-surface="card"><div class="km-card-top"><span class="km-logo">K</span><span>WORKSPACE / 01</span><span>↗</span></div><p>${en?'Project momentum':'프로젝트 진행률'}</p><strong>78<span>%</span></strong><div class="km-progress"><i></i></div><div class="km-card-foot"><span>24 ${en?'tasks complete':'개 작업 완료'}</span><b>+12.4%</b></div><div class="km-status" data-klic-surface="dense"><span>✓ ${en?'On track':'정상 진행'}</span><span>Q4 · 2026</span></div></div></div><p class="km-caption">${({flat:en?'Opaque · clear and calm':'불투명 · 명확하고 차분한 기본값',glass:en?'Translucent · softly layered':'반투명 · 가볍게 겹쳐지는 표면','solid-glass':en?'Substantial · balanced clarity':'높은 불투명도 · 깊이와 가독성의 균형','liquid-glass':en?'Luminous · tint, blur and rim':'빛나는 가장자리 · tint, blur, rim'})[material]}</p></article>`;
 }).join('')}</div><p class="km-note">${en?'Liquid Glass is a CSS optical approximation using tint, blur and rim; it does not reproduce native refraction.':'Liquid Glass는 tint · blur · rim을 사용한 CSS 광학 근사 표현이며 네이티브 굴절을 재현하지 않습니다.'}</p></section>`;
}
