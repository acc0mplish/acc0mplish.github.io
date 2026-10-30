import {DESIGN_SYSTEM} from './design-system-data.mjs';
import {SITE_ORIGIN} from './site-metadata.mjs';
import {translateText} from './i18n.mjs';
const origin=SITE_ORIGIN;
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// The human guide, copied prompts and data transports consume the same policy.
// Translations use exact source text: a changed rule needs a reviewed translation.
export function designGuidanceSections(locale='ko',system=DESIGN_SYSTEM){
 const t=text=>locale==='en'?translateText(text):text;
 const p=text=>({type:'p',text}),list=items=>({type:'list',items});
 const sections=[
  {id:'design-system',title:t('공통 디자인 기준'),blocks:[
   p(`${t('기준 리비전')}: ${system.revision}`),
   p(`${t('기준 원문')}: ${origin}${system.links.definition}`),
   p(t('API·CLI·MCP·WebMCP의 designSystem과 동봉된 KLIC-DESIGN-SYSTEM.json에서 이 기준과 리비전을 확인합니다. 항목별 계약은 item.design.system으로 연결합니다.')),
   {type:'table',headers:[t('디멘션'),t('토큰의 책임'),t('구조·행동의 책임')],rows:system.dimensions.map(d=>[d.title,d.tokenControl,d.structureControl].map(t))},
   p(t(system.provenance.tokenLiteralOwnership)),p(t(system.provenance.recipeBoundary)),...(system.provenance.motionCatalogBoundary?[p(t(system.provenance.motionCatalogBoundary))]:[])
  ]},
  {id:'design-system-presets',title:t('프리셋의 허용 범위'),blocks:[p(t(system.presetPolicy.description)),p(t(system.presetPolicy.allowed)),list(system.presetPolicy.excluded.map(t)),p(t(system.presetPolicy.precedence)),p(t(system.presetPolicy.validation))]},
  {id:'design-system-conflicts',title:t('충돌 해결 순서'),blocks:[list(system.conflictResolution.map(r=>t(r.title)+': '+t(r.rule))),p(t(system.provenance.verification))]},
  {id:'design-system-use',title:t('적용과 검증'),blocks:[
   p(t('공통 기준과 항목별 DESIGN.md·실제 소스를 먼저 읽습니다. 규칙마다 토큰·DOM·CSS recipe·상태 처리의 책임을 나누고 제품에 필요한 조건을 적용합니다.')),
   p(t('기준 본문과 항목 계약의 revision을 비교합니다. release는 레지스트리 배포를 식별하므로 서로 다른 배포의 페이지 결과를 섞지 않습니다.')),
   p(t('최신 CLI와 로컬 레지스트리를 사용하고 stdio 세션을 재시작합니다. WebMCP는 페이지를 새로 읽어 등록합니다. source는 원시 코드만 출력합니다. 소스 묶음은 DESIGN.md, 테마 키트는 README.md를 KLIC-DESIGN-SYSTEM.json과 함께 읽습니다.'))
  ]}
 ];
 if(system.adoptionPolicy)sections.push({id:'design-system-adoption',title:t('참고 문서의 선택적 채택'),blocks:Object.values(system.adoptionPolicy).map(v=>p(t(v)))});
 if(system.changePolicy)sections.push({id:'design-system-changes',title:t('변경 시 함께 확인할 범위'),blocks:[p(t(system.changePolicy.scope)),list(system.changePolicy.surfaces.map(t)),p(t(system.changePolicy.completion))]});
 return sections;
}

export function renderGuidanceSectionsCompact(sections,locale='ko',system=DESIGN_SYSTEM){
 const block=b=>b.type==='p'?`<p>${escape(b.text)}</p>`:b.type==='list'?`<ul>${b.items.map(v=>`<li>${escape(v)}</li>`).join('')}</ul>`:`<div class="table-scroll"><table class="spec-table"><thead><tr>${b.headers.map(h=>`<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(row=>`<tr>${row.map(v=>`<td>${escape(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 return `<details id="design-system-guidance" class="design-guidance" data-design-system-revision="${escape(system.revision)}" data-i18n-ignore lang="${locale==='en'?'en':'ko'}"><summary>${locale==='en'?'View shared design criteria':'공통 디자인 기준 보기'}</summary><div class="design-guidance__contents">${sections.map(s=>`<details id="${escape(s.id)}" name="klic-guidance-sections" class="design-guidance__item"><summary>${escape(s.title)}</summary><div class="design-guidance__body">${s.blocks.map(block).join('')}</div></details>`).join('')}<p class="design-guidance__links"><a href="${origin}${system.links.definition}">designSystem JSON</a> · <a href="/${locale==='en'?'?lang=en':''}#docs/architecture">${locale==='en'?'Full architecture guide':'설계 책임과 조합 가이드'}</a> · <a href="/${locale==='en'?'?lang=en':''}#docs/governance">${locale==='en'?'Change and verification guide':'변경·검증 가이드'}</a></p></div></details>`;
}

export function renderDesignGuidance(locale='ko',system=DESIGN_SYSTEM){
 return renderGuidanceSectionsCompact(designGuidanceSections(locale,system),locale,system);
}

export function designGuidanceMarkdown(locale='ko',system=DESIGN_SYSTEM){
 const cell=v=>String(v).replaceAll('|','\\|').replaceAll('\n',' ');
 return designGuidanceSections(locale,system).map(s=>`## ${s.title}\n\n`+s.blocks.map(b=>b.type==='p'?b.text:b.type==='list'?b.items.map(v=>'- '+v).join('\n'):'| '+b.headers.map(cell).join(' | ')+' |\n| '+b.headers.map(()=>'---').join(' | ')+' |\n'+b.rows.map(row=>'| '+row.map(cell).join(' | ')+' |').join('\n')).join('\n\n')).join('\n\n')+'\n';
}
