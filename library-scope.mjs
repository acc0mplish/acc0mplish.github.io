import {NPM_PACKAGE} from './npm-package-data.mjs';
import {SITE_METADATA} from './site-metadata.mjs';

const delivery=SITE_METADATA.delivery;
const packageTag=packageInfo=>`${packageInfo.name}@latest`;

export const LIBRARY_SCOPE={
 type:delivery.type,npmPackagePublished:NPM_PACKAGE.published,npmPackage:NPM_PACKAGE,
 summary:delivery.summary,
 enSummary:delivery.enSummary,
 sourceDelivery:delivery.sourceDelivery,
 licensing:delivery.licensing,
 figma:delivery.figma,
 sourceRepository:delivery.sourceRepository,
 versioning:delivery.versioning
};

export function blockScopeLabel(counts,locale='ko'){
 const ready=counts.blocksReady??counts.implemented??0,planned=counts.blocksPlanned??counts.planned??0;
 const total=counts.blocksTotal??ready+planned;
 return locale==='en'?`<b>${total}</b> Blocks`:`<b>${total}</b> 블록`;
}

export function libraryScopeText(locale='ko',packageInfo=NPM_PACKAGE){
 const tag=packageTag(packageInfo);
 if(locale==='en')return `KLIC uses seven design dimensions and four token layers: components for controls, blocks for workflows, motion for transitions. Public npm tag: ${tag}.`;
 return `KLIC은 7개 디자인 디멘션·4계층 토큰을 씁니다. 컴포넌트는 조작, 블록은 업무 흐름, 모션은 전환을 다룹니다. npm 최신 태그: ${tag}.`;
}

export function sourceDeliveryText(counts,locale='ko'){
 const {components,blocksReady,motions}=counts,workspaces=components+blocksReady;
 if(locale==='en')return `${components} components and ${blocksReady} working blocks provide ${workspaces} standalone reference workspaces through CLI plan/add. ${motions} individual adopted and KLIC-authored motion recipes provide HTML/CSS/JavaScript/React source, including CSS/React examples, through the detail view, API and CLI motion get, with source id + pattern provenance and preserved notices. Previews and JavaScript/React implementations share a runtime; CSS alone does not reproduce Canvas playback. The package exposes components/*, blocks/* and motions/*; motion counts are separate from workspace bundles.`;
 return `컴포넌트 ${components}개와 실행 블록 ${blocksReady}개는 CLI plan/add로 독립 참고 작업 폴더 ${workspaces}개를 제공합니다. 모션 ${motions}개는 원본 출처·고지를 보존한 채택 패턴과 KLIC 자체 구현의 개별 효과이며 상세 화면·API·CLI motion get에서 HTML/CSS/JavaScript/React 소스를 제공합니다(CSS/React 예제 포함). 미리보기와 JavaScript/React 구현은 같은 런타임을 사용하며 Canvas 재생은 CSS만으로 재현되지 않습니다. 패키지는 components/*·blocks/*·motions/*를 제공하고, 모션 수는 작업 폴더 수와 별도로 집계합니다.`;
}

export function npmPackageGuidance(locale='ko',packageInfo=NPM_PACKAGE){
 const tag=packageTag(packageInfo),exports=(packageInfo.publishedExports?.length?packageInfo.publishedExports:packageInfo.exports||[]).join(', ');
 if(locale==='en')return `${tag} is the rolling npm package. Install with Bun or npm and run the CLI with bunx --bun or npx. ${exports?`Verified package exports: ${exports}. `:''}Runtime support: ${packageInfo.runtime}. For local source verification, build a tarball with ${packageInfo.buildCommand}.`;
 return `${tag}는 현재 npm 패키지입니다. Bun 또는 npm으로 설치하고 CLI는 bunx --bun 또는 npx로 실행하세요. ${exports?`확인된 패키지 export: ${exports}. `:''}실행 환경은 ${packageInfo.runtime}입니다. 로컬 소스 검증용 tarball은 ${packageInfo.buildCommand}로 만듭니다.`;
}

export function npmPackageCommands(packageInfo=NPM_PACKAGE){
 const tag=packageTag(packageInfo);
 return [`# ${tag}`,`bun add ${tag}`,`bunx --bun --package=${tag} klic version --json`,'# npm + Node.js compatibility',`npm install ${tag}`,`npx --yes --package=${tag} klic version --json`].join('\n');
}

export function npmPackageCommandTabs(packageInfo=NPM_PACKAGE){
 const tag=packageTag(packageInfo);
 return {
  bun:`bun add ${tag}\nbunx --bun --package=${tag} klic version --json`,
  npm:`npm install ${tag}\nnpx --yes --package=${tag} klic version --json`
 };
}
