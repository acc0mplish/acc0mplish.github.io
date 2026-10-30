import {NPM_PACKAGE} from './npm-package-data.mjs';
import {SITE_METADATA} from './site-metadata.mjs';
/** Delivery metadata distinguishes package implementation from confirmed registry publication. */
const delivery=SITE_METADATA.delivery;
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
 return locale==='en'?`${ready} working + ${planned} planned = ${ready+planned} total blocks`:`실행 ${ready}개 · 준비 ${planned}개 · 전체 ${ready+planned}개`;
}
export function libraryScopeText(locale='ko',packageInfo=NPM_PACKAGE){
 if(locale==='en')return `One klic-design package provides the Agent Skill, components/*, blocks/*, CSS/React motions/*, tokens, themes, fonts and CLI. Bun (bunx --bun) preferred; Node.js/npx supported. npm publication ${packageInfo.published?'complete':'pending'}.`;
 return `klic-design 하나로 AI 지침·components/*·blocks/*·CSS/React motions/*·토큰·테마·폰트·CLI를 제공합니다. Bun(bunx --bun) 우선, Node.js/npx 호환. npm 공개 발행 ${packageInfo.published?'완료':'전'}.`;
}
export function sourceDeliveryText(counts,locale='ko'){
 const {components,blocksReady,motions}=counts,workspaces=components+blocksReady;
 if(locale==='en')return `${components} components and ${blocksReady} working blocks provide ${workspaces} standalone reference workspaces through CLI plan/add. ${motions} motion recipes provide CSS/React code through the detail view, API and CLI motion get. Copy the recipe CSS with its markup, or use its React implementation and dependencies. The same package exposes components/*, blocks/* and motions/*; motion recipes are counted separately from workspace bundles.`;
 return `컴포넌트 ${components}개와 실행 블록 ${blocksReady}개는 CLI plan/add로 독립 참고 작업 폴더 ${workspaces}개를 제공합니다. 모션 ${motions}개는 상세 화면·API·CLI motion get으로 CSS/React 코드를 제공합니다. CSS 예제는 마크업과 해당 CSS를 함께 적용하고, React 예제는 구현 코드와 의존성을 사용하세요. 같은 패키지의 components/*·blocks/*·motions/*로도 가져올 수 있으며, 모션은 작업 폴더 묶음과 별도로 집계합니다.`;
}
export function npmPackageGuidance(locale='ko',packageInfo=NPM_PACKAGE){
 const identity=`${packageInfo.name}@${packageInfo.version}`,exports=packageInfo.exports.join(', ');
 if(locale==='en')return packageInfo.published
  ?`${identity} provides ${exports}. It is built with ${packageInfo.buildCommand}. Runtime support: ${packageInfo.runtime}. Prefer Bun install and bunx --bun for the CLI; npx remains compatible for Node.js consumers.`
  :`${identity} provides ${exports}. It targets ${packageInfo.runtime} and is built with ${packageInfo.buildCommand}. Bun/bunx is preferred; Node/npm/npx remains supported. CI checked both paths with cold and warm caches against an isolated local registry. The package is not published to npm yet, so use a local tarball.`;
 return packageInfo.published
  ?`${identity}는 ${exports}를 제공합니다. 빌드는 ${packageInfo.buildCommand}를 사용합니다. CLI 기본 실행은 Bun 설치와 bunx --bun이며, npm/npx Node.js 소비 경로도 지원합니다.`
  :`${identity}는 ${exports}를 제공합니다. 대상 런타임은 ${packageInfo.runtime}이고 ${packageInfo.buildCommand}로 빌드합니다. Bun/bunx를 우선 사용하며 Node/npm/npx 경로도 지원합니다. CI에서 두 소비 경로를 격리해 검증했습니다. npm 공개 발행 전이라 로컬 tarball을 사용합니다.`;
}
export function npmPackageCommands(packageInfo=NPM_PACKAGE){
 const identity=`${packageInfo.name}@${packageInfo.version}`;
 if(packageInfo.published)return ['# Preferred Bun consumer',`bun add ${identity}`,`bunx --bun --package=${identity} klic version --json`,'# npm + Node.js compatibility',`npm install ${identity}`,`npx --yes --package=${identity} klic version --json`].join('\n');
 const tarball=`/absolute/path/to/${packageInfo.name}-${packageInfo.version}.tgz`;
 return ['# In a KLIC source checkout',packageInfo.buildCommand,'# Preferred Bun consumer',`bun add ${tarball}`,`bun ./node_modules/${packageInfo.name}/bin/klic.mjs version --json`,`# bunx --bun uses ${identity} after npm publication`,`bunx --bun --package=${identity} klic version --json`,'# npm + Node.js compatibility',`npm install ${tarball}`,`npx --yes --package=${tarball} klic version --json`].join('\n');
}
/** Manager-specific executable commands; local tarballs require the documented build step. */
export function npmPackageCommandTabs(packageInfo=NPM_PACKAGE){
 const identity=`${packageInfo.name}@${packageInfo.version}`;
 if(packageInfo.published)return {
  bun:`bun add ${identity}\nbunx --bun --package=${identity} klic version --json`,
  npm:`npm install ${identity}\nnpx --yes --package=${identity} klic version --json`
 };
 const tarball=`/absolute/path/to/${packageInfo.name}-${packageInfo.version}.tgz`;
 return {
  bun:`bun add ${tarball}\nbun ./node_modules/${packageInfo.name}/bin/klic.mjs version --json`,
  npm:`npm install ${tarball}\nnpx --yes --package=${tarball} klic version --json`
 };
}
