import {NPM_PACKAGE} from './npm-package-data.mjs';
import {REGISTRY_IDENTITY} from './registry-identity.mjs';
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function getReleaseHistory(registry,locale='ko'){
 const T=(ko,en)=>locale==='en'?en:ko;
 const publicPackage={name:NPM_PACKAGE.name,version:NPM_PACKAGE.publishedVersion,sha256:NPM_PACKAGE.publishedTarballSha256,integrity:NPM_PACKAGE.publishedIntegrity,publishedAt:NPM_PACKAGE.publishedAt,verifiedAt:NPM_PACKAGE.publishedVerifiedAt,sourceCommit:NPM_PACKAGE.publishedSourceCommit,limitations:NPM_PACKAGE.publishedLimitations||[]};
 return {
  catalogRelease:registry?.release??REGISTRY_IDENTITY.catalogRelease,
  designRevision:registry?.designSystem?.revision??REGISTRY_IDENTITY.designRevision,
  publicPackage,candidate:null,
  entries:[
   {date:'2026-11-07',title:T('검색·미리보기 우선 탐색과 상태 계약','Search-first discovery, previews and state contracts'),changes:[T('컴포넌트·블록·모션의 검색과 결과를 소개·통계보다 먼저 제공합니다. 블록 상세는 미리보기, 사용법, 설치 순서입니다.','Components, blocks and motions prioritize search and results over background information. Block details show preview, usage and installation in that order.'),T('버튼의 busy + disabled 계약을 실제 native disabled·aria-busy·중복 차단·완료 후 복구 동작과 연결했습니다.','The button busy + disabled contract now documents native disabled, aria-busy, duplicate prevention and recovery after completion.')],limits:[T('Site 콘텐츠와 npm 배포물은 별도로 갱신합니다. 현재 공개 패키지의 무결성은 아래 receipt에서 확인합니다.','Site content and npm artifacts update separately. Check the receipt below for the current public package integrity.')],evidence:'/resources/cli#release-history'},
   {date:'2026-11-06',title:T('Astryx 원칙의 선택적 적용','Selective adoption of Astryx principles'),changes:[T('109개 Native guide의 행동 계약, brief/compact/full 조회, customization 경로, 업무 조합 예제와 공유 IME 판별을 연결했습니다.','Connected behavior contracts for 109 Native guides, brief/compact/full reads, customization paths, workflow examples and shared IME classification.'),T('당시 공식 검사 675 pass / 1 skip, blocks 128 pass. 고정된 이전 tarball의 소비자 첫 제출은 4/6, assertion 70/84였습니다.','At that revision: official suite 675 pass / 1 skip, blocks 128 pass. Consumer first submissions on the frozen earlier tarball passed 4/6 cases and 70/84 assertions.')],limits:[T('소비 평가는 recipe-adaptation입니다. 신규 조합 능력이나 전체 접근성 인증을 뜻하지 않습니다. 물리 OS 한글 IME는 미검증입니다.','Consumer evaluation measured recipe adaptation. It is not novel composition performance or an accessibility certification. Physical OS Korean IME remains unverified.')],evidence:'/resources/cli#release-history'},
   {date:String(publicPackage.publishedAt||'2026-11-04').slice(0,10),title:`${publicPackage.name}@${publicPackage.version} · ${T('공개 npm','public npm')}`,changes:[T('컴포넌트·블록·모션·Agent Skill을 하나의 패키지와 항목별 import 경로로 제공합니다.','Delivers components, blocks, motions and the Agent Skill under one package with per-item imports.')],limits:publicPackage.limitations.map(item=>T(item.ko,item.en)),evidence:'/resources/cli#npm-package'},
   {date:'2026-10-27',title:T('공통 기준의 전달 경로 정합성','Consistent shared design guidance'),changes:[T('가이드·AI 프롬프트·MCP·CLI·WebMCP·API·source/theme kit에 같은 디자인 정책 revision을 전달합니다.','Guides, AI prompts, MCP, CLI, WebMCP, API and source/theme kits carry the same design policy revision.')],limits:[],evidence:'/#docs/governance'},
   {date:'2026-10-24',title:T('7 디멘션·설계 산출물·탐색 도구','Seven dimensions, design exports and discovery tools'),changes:[T('1920px preview, Customize, Dependencies, DESIGN.md·JSON·TypeScript 계약, 조합 플레이그라운드와 토큰 검색을 연결했습니다.','Connected 1920px previews, Customize, Dependencies, DESIGN.md, JSON and TypeScript contracts, the composition playground and token search.')],limits:[T('과거 항목은 당시 범위입니다. 현재 카탈로그 수는 위의 실제 release를 조회하세요.','Historical entries describe their original scope. Consult the current release above for today’s catalog.')],evidence:'/#docs/integrations'},
   {date:'2026-10-23',title:T('KLIC 블루와 첫 인터페이스 라이브러리','KLIC blue and the first interface library'),changes:[T('회사 블루·네이비·중립 표면, Light/Dark와 klic. 4계층 토큰을 연결했습니다.','Connected company blue, navy, neutral surfaces, Light/Dark and the klic. four-layer token structure.')],limits:[],evidence:'/#docs/principles'}
  ]
 };
}

export function releaseHistorySections(registry,locale='ko'){
 const T=(ko,en)=>locale==='en'?en:ko,h=getReleaseHistory(registry,locale),p=text=>({type:'p',text}),link=(label,href)=>({type:'link',label,href});
 const blocks=[p(`Catalog release: ${h.catalogRelease} · Design revision: ${h.designRevision}`),p(`${T('공개 패키지','Published package')}: ${h.publicPackage.name}@${h.publicPackage.version} · SHA-256 ${h.publicPackage.sha256}`),p(`Integrity: ${h.publicPackage.integrity} · ${T('검증 시각','Verified at')}: ${h.publicPackage.verifiedAt}`)];
 for(const entry of h.entries){blocks.push(p(`${entry.date} · ${entry.title}`),{type:'list',items:[...entry.changes,...entry.limits]},link(T('관련 변경과 검증 자료','Related changes and evidence'),entry.evidence));}
 blocks.push(link(T('현재 설계 계약','Current design contract'),'/api/v1/capabilities.json'));
 return [{id:'release-history',title:T('버전별 변경점·제약·검증','Versioned changes, limitations and verification'),blocks}];
}

export function renderReleaseHistory(registry,locale='ko'){
 const T=(ko,en)=>locale==='en'?en:ko,h=getReleaseHistory(registry,locale),sections=releaseHistorySections(registry,locale);
 const intro=sections[0].blocks.slice(0,3);
 const renderBlock=block=>block.type==='p'?`<p>${escape(block.text)}</p>`:block.type==='list'?block.items.length?`<ul>${block.items.map(item=>`<li>${escape(item)}</li>`).join('')}</ul>`:'':`<p><a class="text-link" href="${escape(block.href)}">${escape(block.label)} ↗</a></p>`;
 return `<section class="doc-section release-artifacts"><h2>${T('현재 배포물과 검증 범위','Current artifacts and validation scope')}</h2>${intro.map(renderBlock).join('')}<p><a href="/api/v1/capabilities.json">${T('현재 설계 계약','Current design contract')} ↗</a></p></section><div class="trust-list">${h.entries.map(entry=>`<article><time datetime="${entry.date}">${entry.date}</time><h2>${escape(entry.title)}</h2><ul>${entry.changes.map(item=>`<li>${escape(item)}</li>`).join('')}</ul>${entry.limits.map(item=>`<p role="note">${escape(item)}</p>`).join('')}<a class="text-link" href="${escape(entry.evidence)}">${T('관련 변경과 검증 자료','Related changes and evidence')} ↗</a></article>`).join('')}</div>`;
}
