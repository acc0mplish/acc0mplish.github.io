#!/usr/bin/env node
/** Public read-only integration core and verified source delivery; no shell execution. */
import {KLIC_CHART_LOCAL_TOOL_DEFINITIONS,KLIC_CHART_LOCAL_TOOL_NAMES,KLIC_CHART_METADATA_TOOL_DEFINITIONS,executeKlicChartTool,getKlicChartMcpTools,getKlicChartPrompt,getKlicChartPromptList,getKlicChartResources,readKlicChartResource} from '../chart-tools.mjs';
import {KLIC_CHART_BOARD_SPEC_SCHEMA,KLIC_CHART_INTERACTIONS,KLIC_CHART_SPEC_SCHEMA,KLIC_CHART_THEMES,KLIC_CHART_TYPES,KLIC_CHART_TYPE_IDS} from '../klic-chart-runtime.mjs';
// MOTION_CATEGORY_IDS_BEGIN
const MOTION_CATEGORY_IDS=Object.freeze(["principles","easing","spring","timing","backdrop","entrance","move","scale","rotate","reaction","collection","attention","light","effect","transitions","camera","web-scroll","web-interaction","web-layout","web-feedback","form-state","gesture","svg-path","svg-diagram","3d-depth","ui-button","ui-control","ui-navigation","ui-loading","ui-feedback","game-hud","game-combat","game-reward","game-progress","game-cinematic","ui-spatial","ui-material","game-impact-fx","data-story","particles","loops","character","look","depth3d","sound","tx-reveal","tx-exit","tx-emphasis","tx-swap","tx-typing","tx-physics","tx-path","tx-mask","tx-color-light","tx-blur","tx-glitch","tx-depth","tx-variable","tx-scroll","tx-pointer","tx-counter","tx-caption","tx-layout","tx-loop","tx-japanese","tx-title","tx-broadcast"]);
const MOTION_CATALOG_INVENTORY=Object.freeze({"source":"klic-motion-library","total":925,"categories":67,"referenceItems":884,"klicItems":41});
// MOTION_CATEGORY_IDS_END

// BEGIN GENERATED PUBLIC METADATA
export const SITE_METADATA = {
  "schemaVersion": 1,
  "site": {
    "name": "KLIC Interface Library",
    "title": "KLIC — Interface Library",
    "origin": "https://design.klic.co.kr",
    "locales": [
      "ko",
      "en"
    ],
    "defaultLocale": "ko",
    "localeNames": {
      "ko": "한국어",
      "en": "English"
    }
  },
  "toolchain": {
    "bun": "1.4.4",
    "nodeMinimum": "22"
  },
  "package": {
    "name": "klic-design",
    "version": "0.0.7",
    "registry": "https://registry.npmjs.org/"
  },
  "versions": {
    "toolkit": "0.0.1",
    "api": "1.0.0",
    "registrySchema": "1.0",
    "designSystemSchema": "1.0",
    "designContractSchema": "1.0",
    "themeSchema": "1.0",
    "bundleSchema": "1.0",
    "previewDependencySchema": "1.0",
    "compositionExportSchema": "1.0",
    "openapi": "3.1.0",
    "mcpProtocols": [
      "2026-07-28",
      "2025-11-25"
    ]
  },
  "routes": {
    "mcp": "/api/v1/mcp",
    "cli": "/integrations/klic.mjs"
  },
  "integrations": {
    "api": {
      "status": "available",
      "transport": "http-json",
      "methods": [
        "GET"
      ],
      "serverFiltering": true,
      "authentication": "public",
      "writes": false
    },
    "cli": {
      "status": "available",
      "runtime": {
        "preferred": "bun",
        "compatible": [
          "node"
        ]
      }
    },
    "mcp": {
      "status": "remote-and-stdio",
      "authentication": "public-design-read-only",
      "managedAuthentication": "Sites personal plugin",
      "chartAuthoring": {
        "status": "available",
        "schemaVersion": "1.0",
        "renderer": "KLIC SVG",
        "localDataTransport": "stdio",
        "hostedDataTools": false,
        "webmcpDataTools": false,
        "mcpAppMimeType": "text/html;profile=mcp-app"
      }
    },
    "webmcp": {
      "status": "feature-detected",
      "interface": "document.modelContext",
      "scope": "current browser tab"
    },
    "skill": {
      "status": "available",
      "name": "klic-design",
      "format": "agentskills",
      "path": "/skills/klic-design/SKILL.md",
      "packagePath": "skills/klic-design/SKILL.md",
      "npmPackage": {
        "name": "klic-design",
        "version": "0.0.7",
        "registry": "https://registry.npmjs.org/",
        "skillPath": "SKILL.md"
      }
    },
    "themes": {
      "status": "available",
      "packageMode": "standalone-theme-kit"
    }
  },
  "rateLimit": {
    "windowSeconds": 60,
    "by": "IP",
    "limits": {
      "api": 120,
      "mcp": 60,
      "download": 2000
    },
    "unlimited": "Server-allowlisted secret key via X-KLIC-API-Key; CLI uses KLIC_API_KEY.",
    "response": 429,
    "retryHeader": "Retry-After",
    "offline": "Local copies and already-loaded stdio/WebMCP operations are not server-rate-limited."
  },
  "delivery": {
    "type": "reference-library",
    "summary": "klic-design 통합 패키지: AI 설계 지침·토큰·테마·폰트·재사용 차트 엔진·CLI·사용자 제공 모션 소스의 KLIC 각색·공유 런타임 예제",
    "enSummary": "Unified klic-design package: Agent Skill, tokens, themes, fonts, reusable KLIC chart engine, CLI and KLIC-adapted motion source with shared runtime examples",
    "sourceDelivery": "Components and ready blocks: standalone reference workspaces via CLI plan/add. Motion: preserve the 884 adopted source patterns and add individual KLIC-authored FlowMotion effects in the same 67 categories, grouped in the existing KLIC navigation. Preserve source id + pattern + engine, choreography, timing, paths, layers, SVG/inline/WAAPI alpha, per-source authorship, copyright and license notices; do not carry old recipes or routes forward as compatibility entries. Adapt color, fonts, surfaces, borders, radius and spacing through existing four-layer KLIC token paths, and scope demo CSS per item. Previews and JavaScript/React delivery use the shared klic-design/motions/runtime and klic-design/motions/runtime.css exports; Canvas playback requires JavaScript and is not reproduced by CSS alone. Motion counts remain separate from component, block and CLI workspace counts. Charts: use KLIC-owned KlicChartSpec and the local npm candidate exports klic-design/charts and klic-design/charts/react; a separate npm release is required before public latest includes them. send chart rows only to local stdio MCP. Hosted HTTP and WebMCP expose metadata only; a guessed HTTP request is rejected with LOCAL_ONLY before chart validation or rendering after the caller's payload reaches the endpoint.",
    "licensing": {
      "mode": "per-file",
      "guide": "/licenses/README.md"
    },
    "figma": {
      "delivery": "manifest-and-migration-guide",
      "manifest": "/design-contract/materials/figma-manifest.json",
      "guide": "/design-contract/materials/figma-migration.md",
      "liveSync": false
    },
    "sourceRepository": {
      "status": "not-declared",
      "delivery": "Use the published source exports and verified CLI bundles."
    },
    "versioning": {
      "toolkit": "CLI and shared integration runtime version; independent of the npm package version",
      "schema": "Response format version",
      "release": "Registry publication hash",
      "revision": "Design criteria hash"
    }
  },
  "links": {
    "deliveryScope": "/about",
    "licenses": "/licenses/README.md",
    "figma": "/design-contract/materials/figma-migration.md",
    "designSystem": "/api/v1/design-system.json",
    "designDocs": "/#docs/architecture",
    "themes": "/api/v1/themes.json",
    "themeGuide": "/resources/cli#themes",
    "docs": "/resources",
    "api": "/resources/api",
    "cli": "/resources/cli",
    "mcp": "/resources/mcp",
    "webmcp": "/resources/webmcp",
    "skill": "/resources/cli#klic-design-skill",
    "schema": "/api/v1/registry.schema.json",
    "openapi": "/api/v1/openapi.json",
    "capabilities": "/api/v1/capabilities.json",
    "tools": "/api/v1/tools.json"
  }
};
export const SITE_ORIGIN = SITE_METADATA.site.origin;
export const MCP_URL = new URL(SITE_METADATA.routes.mcp, SITE_ORIGIN+'/').href;
export const INTEGRATION_VERSION = SITE_METADATA.versions.toolkit;
export const PROTOCOL_VERSIONS = SITE_METADATA.versions.mcpProtocols;
// END GENERATED PUBLIC METADATA
export const API_BASE_PATH='/api/v1';
export const BUN_CLI_COMMAND=`bunx --bun --package=${SITE_METADATA.package.name}@latest klic`;
export const NODE_CLI_COMMAND=`npx --yes --package=${SITE_METADATA.package.name}@latest klic`;
const [MCP_MODERN_PROTOCOL,MCP_LEGACY_PROTOCOL]=PROTOCOL_VERSIONS;
export class RegistryError extends Error {
  constructor(code, message) { super(message); this.name = 'RegistryError'; this.code = code; }
}
const invalid = message => { throw new RegistryError('INVALID_ARGUMENT', message); };
const record = value => !!value && typeof value === 'object' && !Array.isArray(value);
const validLocalePair = value => record(value) && typeof value.ko === 'string' && value.ko.length > 0 && typeof value.en === 'string' && value.en.length > 0 && Object.keys(value).length === 2;
function fields(input, allowed) {
  if (!record(input)) invalid('Arguments must be an object.');
  for (const key of Object.keys(input)) if (!allowed.includes(key)) invalid(`Unknown argument: ${key}`);
}
// Optional for older v1 registries; new publications carry one versioned snapshot.
function systemFields(registry) { return registry.designSystem ? {designSystem:registry.designSystem} : {}; }
function cliPackageAvailability() {
  return `Use ${BUN_CLI_COMMAND} for Bun or ${NODE_CLI_COMMAND} for Node.js. The CLI reads the current KLIC catalog contract and creates verified standalone source workspaces.`;
}
const DETAIL_LEVELS=['brief','compact','full'];
function detailLevel(input) {
  const detail=input.detail===undefined?'full':input.detail;
  if(!DETAIL_LEVELS.includes(detail))invalid('detail must be brief, compact or full.');
  return detail;
}
function registryProvenance(registry,schemaVersion=SITE_METADATA.versions.registrySchema) {
  const designRevision=registry.designSystem?.revision||registry.policy?.designSystem?.revision||null;
  const designLinks=registry.designSystem?.links||registry.policy?.designSystem||{};
  return {
    schemaVersion,
    catalogRelease:registry.release??null,
    designRevision,
    toolkitVersion:INTEGRATION_VERSION,
    ...(designRevision?{links:{designSystem:{revision:designRevision,api:`${API_BASE_PATH}/design-system.json`,...(designLinks.definition?{source:designLinks.definition}:{}),...(designLinks.docs?{docs:designLinks.docs}:{})}}}:{})
  };
}
export function withResponder(value,responder) {
  if(!record(value)||!record(value.provenance)||!record(responder))return value;
  return {...value,provenance:{...value.provenance,responder:{...responder}}};
}
function itemNext(kind,id,detail) {
  const nextDetail=detail==='brief'?'compact':'full';
  return {api:`${API_BASE_PATH}/items/${kind}/${id}.json?detail=${nextDetail}`,cli:`${BUN_CLI_COMMAND} get ${kind} ${id} --detail ${nextDetail}`,tool:{name:'klic_get_item',arguments:{kind,id,detail:nextDetail}}};
}
function projectItem(item,detail) {
  if(detail==='full')return item;
  if(detail==='brief')return {id:item.id,kind:item.kind,name:item.name,...(item.labels?{labels:item.labels}:{}),...(item.categoryLabels?{categoryLabels:item.categoryLabels}:{}),description:item.description,status:item.status,route:item.route,next:itemNext(item.kind,item.id,detail)};
  const {source,install,variants,design,...base}=item;
  const compact={...base};
  if(source)compact.source={...source};
  if(install)compact.install={manifest:install.manifest,...(Array.isArray(install.dependencies)?{dependencies:install.dependencies}:{})};
  if(Array.isArray(variants))compact.variants=variants.map(({source:_source,...variant})=>variant);
  if(design){const {prompt,source:_source,code,examples,...contract}=design;compact.design=contract;}
  compact.next=itemNext(item.kind,item.id,detail);
  return compact;
}
export function withRegistryProvenance(value,registry,schemaVersion=value.schemaVersion) {
  return {...value,provenance:{...(value.provenance||{}),...registryProvenance(registry,schemaVersion)}};
}
function validateDesignSystem(value) {
 if(value===undefined)return;
 if(!record(value)||value.schemaVersion!==SITE_METADATA.versions.designSystemSchema||!/^[a-f0-9]{64}$/.test(value.revision)||value.namespace!=='klic.'||JSON.stringify(value.tokenLayers)!==JSON.stringify(['Primitive','Brand','Semantic','Component'])||!Array.isArray(value.dimensions)||value.dimensions.length!==7||!record(value.presetPolicy)||!Array.isArray(value.conflictResolution))throw new RegistryError('INVALID_REGISTRY','Invalid design system snapshot.');
 const strings=v=>Array.isArray(v)&&v.every(item=>typeof item==='string');
 const invalid=()=>{throw new RegistryError('INVALID_REGISTRY','Invalid design system snapshot.');};
 const classPolicy=value.classNamingPolicy;if(classPolicy!==undefined&&(!record(classPolicy)||typeof classPolicy.title!=='string'||!Array.isArray(classPolicy.namespaces)||classPolicy.namespaces.length!==5||classPolicy.namespaces.some(item=>!record(item)||['prefix','role','usage','example'].some(key=>typeof item[key]!=='string'))||!Array.isArray(classPolicy.variantAxes)||classPolicy.variantAxes.length!==4||classPolicy.variantAxes.some(item=>!record(item)||typeof item.axis!=='string'||typeof item.label!=='string'||!strings(item.values)||typeof item.rule!=='string')||typeof classPolicy.tokenPrecedence!=='string'||typeof classPolicy.compatibility!=='string'||!strings(classPolicy.rules)))invalid();
 const dataPolicy=value.dataAttributePolicy;if(dataPolicy!==undefined&&(!record(dataPolicy)||typeof dataPolicy.title!=='string'||!Array.isArray(dataPolicy.attributes)||dataPolicy.attributes.length!==3||dataPolicy.attributes.some(item=>!record(item)||['name','role','values'].some(key=>typeof item[key]!=='string'))||!strings(dataPolicy.extensions)||!strings(dataPolicy.rules)))invalid();
 const motionPolicy=value.motionResponsibilityPolicy;if(motionPolicy!==undefined&&(!record(motionPolicy)||typeof motionPolicy.title!=='string'||!Array.isArray(motionPolicy.transitions)||motionPolicy.transitions.length<2||motionPolicy.transitions.some(item=>!record(item)||['component','from','to','effect'].some(key=>typeof item[key]!=='string'))||!record(motionPolicy.ownership)||Object.values(motionPolicy.ownership).some(item=>typeof item!=='string')||!strings(motionPolicy.rules)))invalid();
}
export function validateRegistry(value) {
  if (!record(value) || value.schemaVersion !== SITE_METADATA.versions.registrySchema || !Array.isArray(value.items) || value.items.length > 10000 || !record(value.capabilities)) throw new RegistryError('INVALID_REGISTRY', `Expected a KLIC registry with schemaVersion ${SITE_METADATA.versions.registrySchema}.`);
  validateDesignSystem(value.designSystem);
  if(value.motions!==undefined)validateMotionCatalog(value.motions);
  const keys = new Set();
  for (const item of value.items) {
    if (!record(item) || !['component', 'block'].includes(item.kind) || !/^[a-z0-9-]{1,90}$/.test(item.id) || typeof item.name !== 'string' || typeof item.description !== 'string' || typeof item.category !== 'string' || !Array.isArray(item.tags) || item.tags.some(tag=>typeof tag!=='string') || (item.labels!==undefined&&!validLocalePair(item.labels)) || (item.categoryLabels!==undefined&&!validLocalePair(item.categoryLabels)) || item.route !== `#${item.kind==='component'?'component':'blocks'}/${item.id}/preview` || !['ready','planned'].includes(item.status) || (item.status==='planned'&&item.source!==null)) throw new RegistryError('INVALID_REGISTRY','Invalid item in registry.');
    const key = `${item.kind}:${item.id}`;
    if (keys.has(key)) throw new RegistryError('INVALID_REGISTRY',`Duplicate item: ${key}`);
    keys.add(key);
  }
  return value;
}
export function validateMotionCatalog(value){
  const fail=()=>{throw new RegistryError('INVALID_REGISTRY','Invalid motion catalog.');};
  if(!record(value)||value.schemaVersion!=='2.0'||value.source!==MOTION_CATALOG_INVENTORY.source||!Array.isArray(value.categories)||value.categories.length!==MOTION_CATALOG_INVENTORY.categories||!Array.isArray(value.items)||value.items.length!==MOTION_CATALOG_INVENTORY.total||value.total!==MOTION_CATALOG_INVENTORY.total||'routeAliases' in value||'crosswalk' in value)fail();
  const categories=new Map();
  for(const category of value.categories){
    if(!record(category)||!/^[a-z0-9-]{1,90}$/.test(category.id)||categories.has(category.id)||!record(category.label)||typeof category.label.ko!=='string'||typeof category.label.en!=='string'||typeof category.icon!=='string'||!record(category.description)||typeof category.description.ko!=='string'||typeof category.description.en!=='string'||!Number.isInteger(category.count)||category.count<0)fail();
    categories.set(category.id,category.count);
  }
  if([...categories.values()].reduce((total,count)=>total+count,0)!==value.total)fail();
  const ids=new Set(),identities=new Set();
  for(const motion of value.items){
    const reference=motion?.reference,implementation=motion?.implementation;
    if(!record(motion)||!/^[a-z0-9-]{1,90}$/.test(motion.id)||ids.has(motion.id)||!categories.has(motion.category)||!['motion-catalog-adapted','klic-authored'].includes(motion.source)||typeof motion.title?.ko!=='string'||typeof motion.title?.en!=='string'||typeof motion.summary?.ko!=='string'||typeof motion.summary?.en!=='string'||typeof motion.trigger?.ko!=='string'||typeof motion.trigger?.en!=='string'||!Number.isInteger(motion.durationMs)||motion.durationMs<1||motion.durationMs>60000||!Number.isInteger(motion.staggerMs)||motion.staggerMs<0||motion.staggerMs>5000||typeof motion.easing!=='string'||!Array.isArray(motion.useCases)||!Array.isArray(motion.cautions)||typeof motion.reducedMotion?.ko!=='string'||typeof motion.reducedMotion?.en!=='string'||!record(motion.preview)||!record(reference)||typeof reference.id!=='string'||typeof reference.pattern!=='string'||reference.route!==motion.id||reference.sourceCategory!==motion.category||!['atlas','semantic','text'].includes(reference.engine)||typeof reference.demoId!=='string'||(motion.source==='klic-authored'?(reference.sourceLicense!=='klic-authored'||reference.licensePath!=='motion-source/klic/flowmotion/NOTICE.md'||!record(reference.origin)||!reference.definitionPath):(reference.sourceLicense!=='motion-catalog-acc0mplish'||reference.licensePath!=='motion-source/reference/LICENSE.md'))||typeof reference.sourceLabel?.ko!=='string'||typeof reference.sourceLabel?.en!=='string'||!record(implementation)||typeof implementation.css!=='string'||typeof implementation.js!=='string'||typeof implementation.react!=='string'||implementation.format!=='shared-motion-runtime'||implementation.requiresRuntime!==true||!implementation.js.includes('klic-design/motions/runtime')||!implementation.react.includes('return ()=>motion.destroy()')||motion.route!==`#motion/${motion.id}`)fail();
    const identity=`${reference.id}:${reference.pattern}`;if(identities.has(identity))fail();identities.add(identity);ids.add(motion.id);
  }
  if(ids.size!==value.total||identities.size!==value.total||value.items.filter(item=>item.source==='motion-catalog-adapted').length!==MOTION_CATALOG_INVENTORY.referenceItems||value.items.filter(item=>item.source==='klic-authored').length!==MOTION_CATALOG_INVENTORY.klicItems)fail();
  return value;
}
function requireMotionCatalog(value){if(!value)throw new RegistryError('SOURCE_UNAVAILABLE','This registry does not provide motion recipes.');return validateMotionCatalog(value);}
function motionNext(id,detail){const nextDetail=detail==='brief'?'compact':'full';return {api:`${API_BASE_PATH}/motions/${id}.json?detail=${nextDetail}`,cli:`${BUN_CLI_COMMAND} motion get ${id} --detail ${nextDetail}`,tool:{name:'klic_get_motion',arguments:{id,detail:nextDetail}}};}
function projectMotion(motion,detail){
  if(detail==='full')return motion;
  if(detail==='brief')return {id:motion.id,category:motion.category,title:motion.title,summary:motion.summary,route:motion.route,reference:motion.reference,next:motionNext(motion.id,detail)};
  const {css,js,react,...implementation}=motion.implementation;
  return {...motion,preview:{...motion.preview},implementation:{...implementation},next:motionNext(motion.id,detail)};
}
export function searchMotions(catalog,input={}){
  fields(input,['query','category','limit','cursor','detail']);
  const source=requireMotionCatalog(catalog),detail=detailLevel(input),query=input.query??'',category=input.category??'',limit=input.limit??20,cursor=input.cursor??'0';
  if(typeof query!=='string'||query.length>200)invalid('query must be a string of at most 200 characters.');
  if(category&&(!/^[a-z0-9-]{1,90}$/.test(category)||!source.categories.some(item=>item.id===category)))invalid('category must match a motion category id.');
  if(!Number.isInteger(limit)||limit<1||limit>100)invalid('limit must be an integer from 1 to 100.');
  if(typeof cursor!=='string'||!/^\d{1,7}$/.test(cursor))invalid('cursor must be the numeric string returned by the previous page.');
  const offset=Number(cursor),needle=query.trim().toLocaleLowerCase(),matches=source.items.filter(item=>(!category||item.category===category)&&(!needle||[item.id,item.category,item.title.ko,item.title.en,item.summary.ko,item.summary.en,...item.useCases.flatMap(entry=>[entry.ko,entry.en])].join(' ').toLocaleLowerCase().includes(needle)));
  if(offset>matches.length)invalid('cursor is beyond the result set. Restart with cursor 0 after changing a filter.');
  return {schemaVersion:source.schemaVersion,...(source.release?{release:source.release}:{}),detail,provenance:{schemaVersion:source.schemaVersion,catalogRelease:source.release??null,designRevision:null,toolkitVersion:INTEGRATION_VERSION},total:matches.length,items:matches.slice(offset,offset+limit).map(motion=>projectMotion(motion,detail)),nextCursor:offset+limit<matches.length?String(offset+limit):null};
}
export function getMotionRecord(catalog,input={}){
  fields(input,['id','detail']);const detail=detailLevel(input);if(typeof input.id!=='string'||!/^[a-z0-9-]{1,90}$/.test(input.id))invalid('Provide a valid motion id.');
  const source=requireMotionCatalog(catalog),motion=source.items.find(item=>item.id===input.id);if(!motion)throw new RegistryError('NOT_FOUND',`No canonical motion named ${input.id}.`);
  return {schemaVersion:source.schemaVersion,...(source.release?{release:source.release}:{}),detail,provenance:{schemaVersion:source.schemaVersion,catalogRelease:source.release??null,designRevision:null,toolkitVersion:INTEGRATION_VERSION},motion:projectMotion(motion,detail)};
}
export function searchRegistry(registry, input = {}) {
  fields(input, ['query', 'kind', 'status', 'limit', 'cursor', 'token', 'group','detail']);
  const detail=detailLevel(input);
  const query = input.query ?? '', kind = input.kind ?? 'all', status = input.status ?? 'ready', limit = input.limit ?? 20, cursor = input.cursor ?? '0';
  if (typeof query !== 'string' || query.length > 200) invalid('query must be a string of at most 200 characters.');
  if (!['all','component','block'].includes(kind)) invalid('kind must be all, component or block.');
  if (!['ready','planned','all'].includes(status)) invalid('status must be ready, planned or all.');
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) invalid('limit must be an integer from 1 to 100.');
  if (typeof cursor !== 'string' || !/^\d{1,7}$/.test(cursor)) invalid('cursor must be the numeric string returned by the previous page.');
  for(const key of ['token','group']){const maximum=key==='group'?100:200;if(input[key]!==undefined&&(typeof input[key]!=='string'||input[key].length>maximum))invalid(key+' must be a string up to '+maximum+' characters.');}
  const offset = Number(cursor), q = query.trim().toLocaleLowerCase();
  const matches = registry.items.map((item,index)=>({item,index,score:!q?0:(()=>{
    const id=String(item.id||'').toLocaleLowerCase(),names=[item.name,...Object.values(item.labels||{})].filter(Boolean).map(value=>String(value).toLocaleLowerCase());
    if(id===q||names.includes(q))return 0;
    if(id.startsWith(q)||names.some(name=>name.startsWith(q)))return 1;
    if(id.includes(q)||names.some(name=>name.includes(q)))return 2;
    return 3;
  })()})).filter(({item}) => (kind === 'all' || item.kind === kind) && (status === 'all' || item.status === status) && (!input.group || (item.structure?.group?.id||item.category)===input.group) && (!input.token || item.design?.tokenMapping.some(t=>t.path.includes(input.token))) && (!q || [item.id,item.name,...Object.values(item.labels||{}),...Object.values(item.categoryLabels||{}),item.description,item.category,item.structure?.group?.label,...(item.design?.tokenMapping.map(t=>t.path)||[]),...(item.tags||[])].join(' ').toLocaleLowerCase().includes(q))).sort((a,b)=>a.score-b.score||a.index-b.index);
  if (offset > matches.length) invalid('cursor is beyond the result set. Restart with cursor 0 after changing a filter.');
  return {schemaVersion:SITE_METADATA.versions.registrySchema,...(detail==='full'?systemFields(registry):{}),release:registry.release,detail,provenance:registryProvenance(registry),total:matches.length,items:matches.slice(offset,offset+limit).map(({item})=>projectItem(item,detail)),nextCursor:offset+limit < matches.length ? String(offset+limit) : null};
}
export function getRegistryItem(registry, input = {}) {
  fields(input, ['kind','id','detail']);
  const detail=detailLevel(input);
  if (!['component','block'].includes(input.kind) || typeof input.id !== 'string' || !/^[a-z0-9-]{1,90}$/.test(input.id)) invalid('Provide kind (component or block) and a valid catalog id.');
  const item = registry.items.find(item => item.kind === input.kind && item.id === input.id);
  if (!item) throw new RegistryError('NOT_FOUND', `No ${input.kind} named ${input.id}.`);
  return {schemaVersion:SITE_METADATA.versions.registrySchema,...(detail==='full'?systemFields(registry):{}),release:registry.release,detail,provenance:registryProvenance(registry),item:projectItem(item,detail)};
}
export function getContract(registry, input = {}) {
  fields(input, ['detail']);
  const detail=detailLevel(input),base={schemaVersion:SITE_METADATA.versions.registrySchema,release:registry.release,detail,provenance:registryProvenance(registry)};
  const nextDetail=detail==='brief'?'compact':'full';
  const next={api:`${API_BASE_PATH}/capabilities.json?detail=${nextDetail}`,cli:`${BUN_CLI_COMMAND} contract --detail ${nextDetail}`,tool:{name:'klic_get_contract',arguments:{detail:nextDetail}}};
  if(detail==='brief')return {...base,next};
  return {...base,...(detail==='full'?systemFields(registry):{}),metadata:registry.metadata,capabilities:registry.capabilities,counts:registry.counts,policy:registry.policy,links:registry.links,...(detail==='compact'?{next}:{})};
}
export function getDeliveryPlan(registry, input) {
  fields(input,['kind','id']);
  const {item}=getRegistryItem(registry,{kind:input.kind,id:input.id});
  if(item.status!=='ready'||!item.install?.manifest)throw new RegistryError('SOURCE_UNAVAILABLE','This item has no source bundle.');
  return {schemaVersion:SITE_METADATA.versions.registrySchema,...systemFields(registry),release:registry.release,kind:item.kind,id:item.id,manifest:item.install.manifest,
    commands:{plan:`${BUN_CLI_COMMAND} plan ${item.kind} ${item.id}`,add:`${BUN_CLI_COMMAND} add ${item.kind} ${item.id} --out ./klic-${item.id}`},
    policy:`${cliPackageAvailability()} Creates a new standalone workspace. Includes shared runtime and source notices. Does not run npm, shell commands, or overwrite existing paths.`};
}
const THEME_PROFILES = ['core','studio','data'];
const THEME_MATERIALS = ['flat','glass','solid-glass','liquid-glass'];
const THEME_MODES = ['system','light','dark'];
function themeQuery(input) {
  fields(input,['query','detail']);
  const query=input.query===undefined?'':input.query;
  if(typeof query!=='string'||query.length>200)invalid('query must be a string of at most 200 characters.');
  return query.trim().toLocaleLowerCase();
}
function themeId(input) {
  if(typeof input.id!=='string'||!/^[a-z0-9-]{1,90}$/.test(input.id))invalid('Provide a valid theme id.');
  return input.id;
}
function themeSelection(input) {
  fields(input,['id','profile','material','mode']);
  const id=themeId(input),profile=input.profile===undefined?'core':input.profile,material=input.material===undefined?'flat':input.material,mode=input.mode===undefined?'system':input.mode;
  if(!THEME_PROFILES.includes(profile))invalid('profile must be core, studio or data.');
  if(!THEME_MATERIALS.includes(material))invalid('material must be flat, glass, solid-glass or liquid-glass.');
  if(!THEME_MODES.includes(mode))invalid('mode must be system, light or dark.');
  return {id,profile,material,mode};
}
function themeCatalog(registry) {
  if(!registry.themes)throw new RegistryError('SOURCE_UNAVAILABLE','This registry does not provide theme kits.');
  const catalog=registry.themes;
  if(!record(catalog)||catalog.schemaVersion!==SITE_METADATA.versions.themeSchema||typeof catalog.defaultTheme!=='string'||!Array.isArray(catalog.items)||!Array.isArray(catalog.profiles)||!Array.isArray(catalog.materials)||!Array.isArray(catalog.modes)||!record(catalog.inventory))throw new RegistryError('INVALID_REGISTRY','Invalid theme catalog.');
  const ids=new Set();
  for(const item of catalog.items){
    if(!record(item)||typeof item.id!=='string'||!/^[a-z0-9-]{1,90}$/.test(item.id)||ids.has(item.id)||typeof item.name!=='string'||!record(item.light)||!record(item.dark))throw new RegistryError('INVALID_REGISTRY','Invalid theme definition in catalog.');
    ids.add(item.id);
  }
  return catalog;
}
function themeItem(registry,id) {
  const catalog=themeCatalog(registry),theme=catalog.items.find(item=>item.id===id);
  if(!theme)throw new RegistryError('NOT_FOUND',`No theme named ${id}.`);
  return {catalog,theme};
}
function themeUsage(id,profile='core',material='flat',mode='system',directory=`./klic-theme-${id}`) {
  return {cssImport:`import '${directory}/theme.css';`,apply:`import { applyTheme } from '${directory}/apply-theme.mjs';\nconst theme = applyTheme(document.documentElement);`,attributes:{'data-klic-theme':id,'data-color-theme':id,'data-brand-profile':profile,'data-material':material,...(mode==='system'?{}:{'data-theme':mode})},mode:mode==='system'?'Omit data-theme for system mode, or set it to light or dark.':`Use data-theme="${mode}" for explicit ${mode} mode.`,plan:`${BUN_CLI_COMMAND} theme plan ${id}`};
}
function themeNext(id,detail){const nextDetail=detail==='brief'?'compact':'full';return {api:`${API_BASE_PATH}/themes/${id}.json?detail=${nextDetail}`,cli:`${BUN_CLI_COMMAND} theme get ${id} --detail ${nextDetail}`,tool:{name:'klic_get_theme',arguments:{id,detail:nextDetail}}};}
function projectTheme(theme,detail){
  if(detail==='full')return theme;
  const {light,dark,...summary}=theme;
  if(detail==='brief')return {id:theme.id,name:theme.name,...(theme.label?{label:theme.label}:{}),...(theme.description?{description:theme.description}:{}),next:themeNext(theme.id,detail)};
  return {...summary,palette:{lightTokens:Object.keys(light||{}).length,darkTokens:Object.keys(dark||{}).length},next:themeNext(theme.id,detail)};
}
export function listThemes(registry,input={}) {
  const query=themeQuery(input),detail=detailLevel(input),catalog=themeCatalog(registry);
  const items=catalog.items.filter(theme=>!query||[theme.id,theme.name,theme.label,theme.description,theme.source?.name].join(' ').toLocaleLowerCase().includes(query));
  return {schemaVersion:SITE_METADATA.versions.themeSchema,...(detail==='full'?systemFields(registry):{}),release:registry.release,detail,provenance:registryProvenance(registry,SITE_METADATA.versions.themeSchema),...(catalog.sourceRevision?{sourceRevision:catalog.sourceRevision}:{}),defaultTheme:catalog.defaultTheme,profiles:catalog.profiles,materials:catalog.materials,modes:catalog.modes,items:items.map(theme=>projectTheme(theme,detail)),...(detail==='full'?{inventory:catalog.inventory}:{})};
}
export function getTheme(registry,input={}) {
  fields(input,['id','detail']);const detail=detailLevel(input),id=themeId(input),{catalog,theme}=themeItem(registry,id);
  return {schemaVersion:SITE_METADATA.versions.themeSchema,...(detail==='full'?systemFields(registry):{}),release:registry.release,detail,provenance:registryProvenance(registry,SITE_METADATA.versions.themeSchema),theme:projectTheme(theme,detail),profiles:catalog.profiles,materials:catalog.materials,modes:catalog.modes,usage:themeUsage(id)};
}
export function getThemeDeliveryPlan(registry,input={}) {
  const {id,profile,material,mode}=themeSelection(input);themeItem(registry,id);
  const options=`${id} --profile ${profile} --material ${material} --mode ${mode}`,apiBasePath=registry.capabilities?.api?.basePath?.replace(/\/$/,'')||API_BASE_PATH;
  return {schemaVersion:SITE_METADATA.versions.themeSchema,...systemFields(registry),release:registry.release,kind:'theme',id,profile,material,mode,manifest:`${apiBasePath}/theme-bundles/${id}/${profile}/${material}/${mode}.json`,commands:{plan:`${BUN_CLI_COMMAND} theme plan ${options}`,add:`${BUN_CLI_COMMAND} theme add ${options} --out ./klic-theme-${id}`},policy:`${cliPackageAvailability()} Creates a new standalone theme kit folder after integrity verification. Import its CSS and apply it in your app. Does not edit an existing app, run npm or shell commands, or overwrite existing paths.`};
}

const KLIC_SCHEMA_DRAFT='https://json-schema.org/draft/2020-12/schema';
const schemaRef=name=>({$ref:`#/$defs/${name}`});
const schemaObject=(required,properties,extra={})=>({type:'object',required,properties,...extra});
const stringList={type:'array',items:{type:'string'}};
const openMetadataObject={type:'object',description:'Public metadata is assembled from versioned configuration and permits additive fields.',additionalProperties:true};
/* CHART_CONTRACT_SCHEMA_BEGIN */
const CHART_CONTRACT_SCHEMA = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "KLIC Chart Contract",
  "type": "object",
  "required": [
    "schemaVersion",
    "id",
    "origin",
    "family",
    "useWhen",
    "avoidWhen",
    "takeaway",
    "data",
    "accessibility",
    "qa"
  ],
  "properties": {
    "schemaVersion": {
      "const": "1.0"
    },
    "id": {
      "type": "string",
      "pattern": "^[a-z0-9-]{1,90}$"
    },
    "origin": {
      "enum": [
        "mit-licensed-adaptation",
        "klic-authored"
      ]
    },
    "family": {
      "type": "string",
      "minLength": 1
    },
    "useWhen": {
      "type": "object",
      "required": [
        "ko",
        "en"
      ],
      "properties": {
        "ko": {
          "type": "string",
          "minLength": 1
        },
        "en": {
          "type": "string",
          "minLength": 1
        }
      },
      "additionalProperties": false
    },
    "avoidWhen": {
      "type": "object",
      "required": [
        "ko",
        "en"
      ],
      "properties": {
        "ko": {
          "type": "string",
          "minLength": 1
        },
        "en": {
          "type": "string",
          "minLength": 1
        }
      },
      "additionalProperties": false
    },
    "takeaway": {
      "type": "object",
      "required": [
        "ko",
        "en"
      ],
      "properties": {
        "ko": {
          "type": "string",
          "minLength": 1
        },
        "en": {
          "type": "string",
          "minLength": 1
        }
      },
      "additionalProperties": false
    },
    "data": {
      "type": "object",
      "required": [
        "synthetic",
        "exactTable",
        "note"
      ],
      "properties": {
        "synthetic": {
          "const": true
        },
        "exactTable": {
          "type": "boolean"
        },
        "note": {
          "type": "object",
          "required": [
            "ko",
            "en"
          ],
          "properties": {
            "ko": {
              "type": "string",
              "minLength": 1
            },
            "en": {
              "type": "string",
              "minLength": 1
            }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    },
    "accessibility": {
      "type": "object",
      "required": [
        "keyboard",
        "exactData",
        "reducedMotion"
      ],
      "properties": {
        "keyboard": {
          "type": "object",
          "required": [
            "ko",
            "en"
          ],
          "properties": {
            "ko": {
              "type": "string",
              "minLength": 1
            },
            "en": {
              "type": "string",
              "minLength": 1
            }
          },
          "additionalProperties": false
        },
        "exactData": {
          "type": "object",
          "required": [
            "ko",
            "en"
          ],
          "properties": {
            "ko": {
              "type": "string",
              "minLength": 1
            },
            "en": {
              "type": "string",
              "minLength": 1
            }
          },
          "additionalProperties": false
        },
        "reducedMotion": {
          "type": "object",
          "required": [
            "ko",
            "en"
          ],
          "properties": {
            "ko": {
              "type": "string",
              "minLength": 1
            },
            "en": {
              "type": "string",
              "minLength": 1
            }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    },
    "qa": {
      "type": "object",
      "required": [
        "responsive",
        "theme",
        "labels",
        "tableParity"
      ],
      "properties": {
        "responsive": {
          "type": "string",
          "minLength": 1
        },
        "theme": {
          "type": "string",
          "minLength": 1
        },
        "labels": {
          "type": "string",
          "minLength": 1
        },
        "tableParity": {
          "type": "string",
          "minLength": 1
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
};
/* CHART_CONTRACT_SCHEMA_END */
const KLIC_SCHEMA_COMPONENTS={
 Detail:{type:'string',enum:DETAIL_LEVELS,default:'full'},
 LocalePair:schemaObject(['ko','en'],{ko:{type:'string',minLength:1},en:{type:'string',minLength:1}}),
 DesignSystemRef:schemaObject(['schemaVersion','revision','definition','docs'],{schemaVersion:{const:SITE_METADATA.versions.designSystemSchema},revision:{type:'string',pattern:'^[a-f0-9]{64}$'},definition:{type:'string'},docs:{type:'string'}}),
 DesignDimension:schemaObject(['id','title','tokenControl','structureControl','check','tokenPaths','requirements','sources','checks'],{id:{type:'string'},title:{type:'string'},tokenControl:{type:'string'},structureControl:{type:'string'},check:{type:'string'},tokenPaths:stringList,requirements:stringList,sources:stringList,checks:stringList}),
 ConflictRule:schemaObject(['id','title','rule'],{id:{type:'string'},title:{type:'string'},rule:{type:'string'}}),
 PresetPolicy:schemaObject(['kind','description','allowed','excluded','precedence','validation','currentExample'],{kind:{const:'configuration-recipe'},description:{type:'string'},allowed:{type:'string'},excluded:stringList,precedence:{type:'string'},validation:{type:'string'},currentExample:{type:'string'}}),
 DesignProvenance:schemaObject(['tokenLiteralOwnership','recipeBoundary','verification','motionCatalogBoundary'],{tokenLiteralOwnership:{type:'string'},recipeBoundary:{type:'string'},verification:{type:'string'},motionCatalogBoundary:{type:'string'}}),
 DesignLinks:schemaObject(['definition','architecture','docs','requirements'],{definition:{type:'string'},architecture:{type:'string'},docs:{type:'string'},requirements:{type:'string'}}),
 AdoptionPolicy:schemaObject(['selection','evidence'],{selection:{type:'string'},evidence:{type:'string'}}),
 ChangePolicy:schemaObject(['scope','surfaces','completion'],{scope:{type:'string'},surfaces:stringList,completion:{type:'string'}}),
 ClassNamespace:schemaObject(['prefix','role','usage','example'],{prefix:{type:'string'},role:{type:'string'},usage:{type:'string'},example:{type:'string'}}),
 VariantAxis:schemaObject(['axis','label','values','rule'],{axis:{type:'string',enum:['intent','appearance','size','density']},label:{type:'string'},values:stringList,rule:{type:'string'}}),
 ClassNamingPolicy:schemaObject(['title','namespaces','variantAxes','tokenPrecedence','rules','compatibility'],{title:{type:'string'},namespaces:{type:'array',minItems:5,maxItems:5,items:schemaRef('ClassNamespace')},variantAxes:{type:'array',minItems:4,maxItems:4,items:schemaRef('VariantAxis')},tokenPrecedence:{type:'string'},rules:stringList,compatibility:{type:'string'}}),
 DataAttribute:schemaObject(['name','role','values'],{name:{type:'string',enum:['data-part','data-state','data-theme']},role:{type:'string'},values:{type:'string'}}),
 DataAttributePolicy:schemaObject(['title','attributes','extensions','rules'],{title:{type:'string'},attributes:{type:'array',minItems:3,maxItems:3,items:schemaRef('DataAttribute')},extensions:stringList,rules:stringList}),
 MotionTransition:schemaObject(['component','from','to','effect'],{component:{type:'string'},from:{type:'string'},to:{type:'string'},effect:{type:'string'}}),
 MotionResponsibilityPolicy:schemaObject(['title','transitions','ownership','rules'],{title:{type:'string'},transitions:{type:'array',minItems:2,items:schemaRef('MotionTransition')},ownership:{type:'object',additionalProperties:{type:'string'}},rules:stringList}),
 ComponentContractPolicy:schemaObject(['title','facets','rules'],{title:{type:'string'},facets:stringList,rules:stringList}),
 DiscoveryPolicy:schemaObject(['title','detailLevels','defaultDetail','rules'],{title:{type:'string'},detailLevels:{type:'array',const:[...DETAIL_LEVELS],items:{type:'string',enum:DETAIL_LEVELS},minItems:3,maxItems:3},defaultDetail:{const:'full'},rules:stringList}),
 CustomizationPolicy:schemaObject(['title','steps','rules'],{title:{type:'string'},steps:{type:'array',const:['theme','composition','source'],items:{type:'string',enum:['theme','composition','source']},minItems:3,maxItems:3},rules:stringList}),
 InteractionPolicy:schemaObject(['title','rules'],{title:{type:'string'},rules:stringList}),
 ConsumerEvaluationPolicy:schemaObject(['title','tasks','rules'],{title:{type:'string'},tasks:stringList,rules:stringList}),
 DesignSystem:schemaObject(['schemaVersion','architectureSchemaVersion','namespace','tokenLayers','date','scope','dimensions','conflictResolution','presetPolicy','provenance','links','adoptionPolicy','changePolicy','componentContractPolicy','discoveryPolicy','customizationPolicy','interactionPolicy','consumerEvaluationPolicy','revision'],{
  schemaVersion:{const:SITE_METADATA.versions.designSystemSchema},architectureSchemaVersion:{const:1},namespace:{const:'klic.'},tokenLayers:{const:['Primitive','Brand','Semantic','Component']},date:{type:'string'},scope:{type:'string'},
  dimensions:{type:'array',minItems:7,maxItems:7,items:schemaRef('DesignDimension')},conflictResolution:{type:'array',items:schemaRef('ConflictRule')},presetPolicy:schemaRef('PresetPolicy'),provenance:schemaRef('DesignProvenance'),links:schemaRef('DesignLinks'),
  adoptionPolicy:schemaRef('AdoptionPolicy'),changePolicy:schemaRef('ChangePolicy'),classNamingPolicy:schemaRef('ClassNamingPolicy'),dataAttributePolicy:schemaRef('DataAttributePolicy'),motionResponsibilityPolicy:schemaRef('MotionResponsibilityPolicy'),componentContractPolicy:schemaRef('ComponentContractPolicy'),discoveryPolicy:schemaRef('DiscoveryPolicy'),customizationPolicy:schemaRef('CustomizationPolicy'),interactionPolicy:schemaRef('InteractionPolicy'),consumerEvaluationPolicy:schemaRef('ConsumerEvaluationPolicy'),revision:{type:'string',pattern:'^[a-f0-9]{64}$'},
 }),
 Responder:schemaObject(['transport'],{transport:{type:'string'},packageName:{type:'string'},packageVersion:{type:'string'},binSha256:{type:'string',pattern:'^[a-f0-9]{64}$'}}),
 Provenance:schemaObject(['schemaVersion','catalogRelease','designRevision','toolkitVersion'],{schemaVersion:{type:'string'},catalogRelease:{type:['string','null']},designRevision:{type:['string','null']},toolkitVersion:{type:'string'},links:{type:'object',properties:{designSystem:schemaObject(['revision','api'],{revision:{type:'string',pattern:'^[a-f0-9]{64}$'},api:{type:'string'},source:{type:'string'},docs:{type:'string'}})}},responder:schemaRef('Responder')}),
 NextToolArguments:{oneOf:[schemaObject(['kind','id','detail'],{kind:{type:'string',enum:['component','block']},id:{type:'string',pattern:'^[a-z0-9-]{1,90}$'},detail:schemaRef('Detail')},{additionalProperties:false}),schemaObject(['id','detail'],{id:{type:'string',pattern:'^[a-z0-9-]{1,90}$'},detail:schemaRef('Detail')},{additionalProperties:false}),schemaObject(['detail'],{detail:schemaRef('Detail')},{additionalProperties:false})]},
 NextLookup:schemaObject(['api','cli','tool'],{api:{type:'string'},cli:{type:'string'},tool:schemaObject(['name','arguments'],{name:{type:'string',enum:['klic_get_item','klic_get_motion','klic_get_theme','klic_get_contract']},arguments:schemaRef('NextToolArguments')})}),
 TokenMapping:schemaObject(['path','purpose','cssVariable','cssProperty','value','chain','tailwind'],{path:{type:'string',pattern:'^klic\\.'},purpose:{type:'string'},cssVariable:{type:'string',pattern:'^--klic-'},cssProperty:{type:'string'},value:{type:['string','null']},chain:stringList,tailwind:{type:'string'}}),
 TokenContext:schemaObject(['heightFixture','mode','density','basis'],{heightFixture:{type:'string',enum:['a','b']},mode:{type:'string',enum:['light','dark']},density:{type:'string',enum:['compact','normal','relaxed']},basis:{type:'string',enum:['static-example','resolved-selection']}}),
 VariantSupportAxis:schemaObject(['axis','values','evidence'],{axis:{type:'string',enum:['intent','appearance','size','density']},values:stringList,evidence:{type:'string'}}),
 VariantSupport:schemaObject(['status','axes','examples','note'],{status:{type:'string',enum:['specified','partially-specified','not-specified']},axes:{type:'array',items:schemaRef('VariantSupportAxis')},examples:stringList,note:{type:'string'}}),
 DesignState:schemaObject(['name','condition','response'],{name:{type:'string'},condition:{type:'string'},response:{type:'string'}}),
 ChartContract:CHART_CONTRACT_SCHEMA,
 DesignContract:schemaObject(['delivery','system','schemaVersion','scope','implementation','tokenContext','variantSupport','use','avoid','accessibility','density','states','recovery','tokenMapping','limitations','checklist','exports','prompt'],{
  delivery:schemaObject(['type','npmPackagePublished','scope','licenses'],{type:{const:'reference-library'},npmPackagePublished:{type:'boolean'},npmPackage:{type:'object',required:['name','version','status'],properties:{name:{type:'string'},version:{type:'string'},status:{type:'string'},registry:{type:'string'},exports:stringList}},scope:{type:'string'},licenses:{type:'string'}}),
  system:schemaRef('DesignSystemRef'),schemaVersion:{const:SITE_METADATA.versions.designContractSchema},scope:{const:'adoption-guidance'},implementation:{type:'string',enum:['planned','native-html','react-demo']},tokenContext:schemaRef('TokenContext'),variantSupport:schemaRef('VariantSupport'),use:stringList,avoid:stringList,accessibility:stringList,
  density:{type:'object',propertyNames:{enum:['compact','normal','relaxed']},additionalProperties:{type:'string'}},states:{type:'array',items:schemaRef('DesignState')},recovery:schemaObject(['loading','empty','filtered','error'],{loading:{type:'string'},empty:{type:'string'},filtered:{type:'string'},error:{type:'string'}}),tokenMapping:{type:'array',items:schemaRef('TokenMapping')},limitations:stringList,checklist:stringList,
  exports:schemaObject(['design','contract','types'],{design:{type:'string'},contract:{type:'string'},types:{type:'string'}}),prompt:{type:'string'},chart:schemaRef('ChartContract'),behavior:{type:'object',description:'Component-family interaction contracts vary by family and are intentionally extensible.',additionalProperties:true},
 }),
 SourceFile:schemaObject(['path','language','usage','notice'],{path:{type:'string'},language:{type:'string',enum:['html','tsx']},usage:{const:'reference'},notice:{type:'string'},dependencies:stringList,module:{type:'string'},variant:{type:['string','null']},manifest:{type:'string'}}),
 ItemInstall:schemaObject(['manifest','mode','preservesNotices'],{manifest:{type:'string'},mode:{type:'string'},preservesNotices:{type:'boolean'},dependencies:stringList}),
 ItemBase:schemaObject(['id','kind','name','description','category','status','route'],{
  id:{type:'string',pattern:'^[a-z0-9-]{1,90}$'},kind:{type:'string',enum:['component','block']},name:{type:'string'},labels:schemaRef('LocalePair'),description:{type:'string'},category:{type:'string'},categoryName:{type:'string'},categoryLabels:schemaRef('LocalePair'),collection:{type:'string'},tags:stringList,status:{type:'string',enum:['ready','planned']},route:{type:'string',pattern:'^#(?:component|blocks)/'},docsRoute:{type:'string'},source:{oneOf:[{type:'null'},schemaRef('SourceFile')]},token:{type:'string'},rule:{type:'string'},structure:{type:'object',description:'Item-specific composition metadata is additive.',additionalProperties:true},variants:{type:'array',items:{type:'object',description:'Variant metadata is defined by the component family.',additionalProperties:true}},design:schemaRef('DesignContract'),install:schemaRef('ItemInstall'),shareUrl:{type:'string'},canonicalUrl:{type:'string'},aliasOf:{type:['string','null']},aliasReason:{type:'string'},
 },{additionalProperties:true}),
 Item:{allOf:[schemaRef('ItemBase'),{type:'object',required:['source','design']}]},
 ItemBrief:schemaObject(['id','kind','name','description','status','route','next'],{id:{type:'string'},kind:{type:'string',enum:['component','block']},name:{type:'string'},labels:schemaRef('LocalePair'),categoryLabels:schemaRef('LocalePair'),description:{type:'string'},status:{type:'string',enum:['ready','planned']},route:{type:'string'},next:schemaRef('NextLookup')}),
 ItemCompact:{allOf:[schemaRef('ItemBase'),schemaObject(['next'],{source:{oneOf:[{type:'null'},schemaRef('SourceFile')]},install:schemaRef('ItemInstall'),design:schemaObject([],{chart:schemaRef('ChartContract')},{description:'Compact item contracts omit prompts and source examples but preserve chart selection guidance.',additionalProperties:true}),next:schemaRef('NextLookup')})]},
 MotionLocale:schemaObject(['ko','en'],{ko:{type:'string'},en:{type:'string'}}),
 MotionReference:schemaObject(['id','pattern','route','engine','demoId','sourceCategory','durationMs','engineDuration','sourceLabel','sourceLicense','licensePath'],{id:{type:'string'},pattern:{type:'string'},route:{type:'string'},engine:{type:'string',enum:['atlas','semantic','text']},demoId:{type:'string'},sourceCategory:{type:'string'},durationMs:{type:'integer',minimum:1},engineDuration:{type:'integer',minimum:1},sourceLabel:schemaRef('MotionLocale'),sourceLicense:{type:'string',enum:['motion-catalog-acc0mplish','klic-authored']},licensePath:{type:'string',enum:['motion-source/reference/LICENSE.md','motion-source/klic/flowmotion/NOTICE.md']},definitionPath:{type:'string'},sourceRecord:{type:'string'},origin:{type:'object',description:'Per-source attribution metadata is intentionally extensible.',additionalProperties:true},routeDisambiguated:{type:'boolean'}}),
 Motion:schemaObject(['id','category','source','title','summary','trigger','durationMs','staggerMs','easing','useCases','cautions','reducedMotion','preview','reference','implementation','route'],{id:{type:'string',pattern:'^[a-z0-9-]{1,90}$'},category:{type:'string',enum:MOTION_CATEGORY_IDS},source:{type:'string',enum:['motion-catalog-adapted','klic-authored']},title:schemaRef('MotionLocale'),summary:schemaRef('MotionLocale'),trigger:schemaRef('MotionLocale'),durationMs:{type:'integer',minimum:1,maximum:60000},staggerMs:{type:'integer',minimum:0,maximum:5000},easing:{type:'string'},useCases:{type:'array',items:schemaRef('MotionLocale')},cautions:{type:'array',items:schemaRef('MotionLocale')},reducedMotion:schemaRef('MotionLocale'),preview:{type:'object',description:'Renderer-specific preview parameters are intentionally extensible.',additionalProperties:true},reference:schemaRef('MotionReference'),implementation:schemaObject(['css','js','react','format','requiresRuntime'],{css:{type:'string'},js:{type:'string'},react:{type:'string'},format:{const:'shared-motion-runtime'},requiresRuntime:{const:true}}),route:{type:'string',pattern:'^#motion/[a-z0-9-]+$'}}),
 MotionBrief:schemaObject(['id','category','title','summary','route','reference','next'],{id:{type:'string'},category:{type:'string',enum:MOTION_CATEGORY_IDS},title:schemaRef('MotionLocale'),summary:schemaRef('MotionLocale'),route:{type:'string'},reference:schemaRef('MotionReference'),next:schemaRef('NextLookup')}),
 MotionCompact:schemaObject(['id','category','title','summary','route','implementation','next'],{id:{type:'string'},category:{type:'string',enum:MOTION_CATEGORY_IDS},source:{type:'string',enum:['motion-catalog-adapted','klic-authored']},title:schemaRef('MotionLocale'),summary:schemaRef('MotionLocale'),trigger:schemaRef('MotionLocale'),durationMs:{type:'integer',minimum:1},staggerMs:{type:'integer',minimum:0},easing:{type:'string'},useCases:{type:'array',items:schemaRef('MotionLocale')},cautions:{type:'array',items:schemaRef('MotionLocale')},reducedMotion:schemaRef('MotionLocale'),preview:{type:'object',description:'Renderer-specific preview parameters are intentionally extensible.',additionalProperties:true},reference:schemaRef('MotionReference'),implementation:schemaObject(['format','requiresRuntime'],{format:{const:'shared-motion-runtime'},requiresRuntime:{const:true}}),next:schemaRef('NextLookup'),route:{type:'string'}},{additionalProperties:true}),
 MotionCatalog:schemaObject(['schemaVersion','release','categories','total','source','items'],{schemaVersion:{const:'2.0'},release:{type:'string',pattern:'^[a-f0-9]{16}$'},categories:{type:'array',minItems:MOTION_CATALOG_INVENTORY.categories,maxItems:MOTION_CATALOG_INVENTORY.categories,items:schemaObject(['id','label','icon','description','count'],{id:{type:'string',enum:MOTION_CATEGORY_IDS},label:schemaRef('MotionLocale'),icon:{type:'string'},description:schemaRef('MotionLocale'),count:{type:'integer',minimum:0}})},total:{const:MOTION_CATALOG_INVENTORY.total},source:{const:MOTION_CATALOG_INVENTORY.source},items:{type:'array',minItems:MOTION_CATALOG_INVENTORY.total,maxItems:MOTION_CATALOG_INVENTORY.total,items:schemaRef('Motion')}}),
 ThemeSource:schemaObject(['name','hex'],{name:{type:'string'},hex:{type:'string'}}),
 ThemeProfile:schemaObject(['id','name'],{id:{type:'string'},name:{type:'string'}}),
 Theme:schemaObject(['id','name','light','dark'],{id:{type:'string',pattern:'^[a-z0-9-]{1,90}$'},name:{type:'string'},label:{type:'string'},description:{type:'string'},source:schemaRef('ThemeSource'),light:{type:'object',description:'Theme token values are a versioned string map.',additionalProperties:{type:'string'}},dark:{type:'object',description:'Theme token values are a versioned string map.',additionalProperties:{type:'string'}}},{additionalProperties:true}),
 ThemeBrief:schemaObject(['id','name','next'],{id:{type:'string'},name:{type:'string'},label:{type:'string'},description:{type:'string'},next:schemaRef('NextLookup')}),
 ThemeCompact:schemaObject(['id','name','palette','next'],{id:{type:'string'},name:{type:'string'},label:{type:'string'},description:{type:'string'},palette:schemaObject(['lightTokens','darkTokens'],{lightTokens:{type:'integer',minimum:0},darkTokens:{type:'integer',minimum:0}}),next:schemaRef('NextLookup')}),
 ThemeUsage:schemaObject(['cssImport','apply','attributes','mode','plan'],{cssImport:{type:'string'},apply:{type:'string'},attributes:{type:'object',additionalProperties:{type:'string'}},mode:{type:'string'},plan:{type:'string'}}),
 ThemeCatalog:schemaObject(['schemaVersion','defaultTheme','profiles','materials','modes','items','inventory'],{schemaVersion:{const:SITE_METADATA.versions.themeSchema},release:{type:'string'},sourceRevision:{type:'string'},defaultTheme:{type:'string'},profiles:{type:'array',items:schemaRef('ThemeProfile')},materials:stringList,modes:stringList,items:{type:'array',items:schemaRef('Theme')},inventory:{type:'object',additionalProperties:{type:'integer',minimum:0}}}),
 ChartChannel:schemaObject(['name','kind','required'],{name:{type:'string'},kind:{type:'string',enum:['categorical','ordinal','quantitative','temporal']},kinds:stringList,required:{type:'boolean'}}),
 ChartType:schemaObject(['id','family','support','channels','interactions','keyboard','reducedMotion'],{id:{type:'string'},family:{type:'string'},support:{const:'authorable'},channels:{type:'array',items:schemaRef('ChartChannel')},options:{type:'object'},interactions:stringList,keyboard:{type:'string'},reducedMotion:{type:'string'}}),
 ChartError:schemaObject(['path','code','message'],{path:{type:'string'},code:{type:'string'},message:{type:'string'}}),
 ChartTable:schemaObject(['caption','columns','rows'],{caption:{type:'string'},columns:stringList,rows:{type:'array',items:{type:'array',items:{oneOf:[{type:'string'},{type:'number'},{type:'boolean'},{type:'null'}]}}}}),
 ChartSummary:schemaObject(['title','type','rows','omittedRows','marks'],{title:{type:'string'},type:{type:'string'},rows:{type:'integer',minimum:0},omittedRows:{type:'integer',minimum:0},marks:{type:'integer',minimum:0}}),
 ErrorResult:schemaObject(['error'],{error:schemaObject(['code','message'],{code:{type:'string'},message:{type:'string'}})}),
 Metadata:openMetadataObject,
 Capabilities:{type:'object',description:'Transport capabilities are versioned and permit additive details.',properties:{api:openMetadataObject,cli:openMetadataObject,mcp:openMetadataObject,webmcp:openMetadataObject,skill:openMetadataObject,themes:openMetadataObject,motions:openMetadataObject},additionalProperties:true},
 Counts:{type:'object',description:'Catalog counters are integer-valued and may grow additively.',additionalProperties:{type:'integer',minimum:0}},
 ContractPolicy:openMetadataObject,
 PublicLinks:{type:'object',additionalProperties:{type:'string'}},
 ThemeBundle:schemaObject(['schemaVersion','kind','files','dependencies'],{schemaVersion:{const:SITE_METADATA.versions.bundleSchema},kind:{const:'theme'},files:{type:'array',items:schemaObject(['path','url','bytes','sha256'],{path:{type:'string'},url:{type:'string'},bytes:{type:'integer',minimum:0},sha256:{type:'string',pattern:'^[a-f0-9]{64}$'}})},dependencies:{type:'object',additionalProperties:{type:'string'}},designSystem:schemaRef('DesignSystem')})
};
const responseProvenanceProperties={provenance:schemaRef('Provenance'),detail:schemaRef('Detail'),designSystem:schemaRef('DesignSystem')};
const KLIC_SCHEMA_RESPONSES={
 Registry:schemaObject(['schemaVersion','release','metadata','counts','capabilities','policy','items','motions'],{schemaVersion:{const:SITE_METADATA.versions.registrySchema},release:{type:'string',pattern:'^[a-f0-9]{16}$'},metadata:schemaRef('Metadata'),counts:schemaRef('Counts'),capabilities:schemaRef('Capabilities'),policy:schemaRef('ContractPolicy'),designSystem:schemaRef('DesignSystem'),themes:schemaRef('ThemeCatalog'),motions:schemaRef('MotionCatalog'),items:{type:'array',items:schemaRef('Item')}}),
 DesignSystemSnapshot:schemaObject(['schemaVersion','release','designSystem','provenance'],{schemaVersion:{const:SITE_METADATA.versions.designSystemSchema},release:{type:'string'},designSystem:schemaRef('DesignSystem'),provenance:schemaRef('Provenance')}),
 SearchResult:schemaObject(['schemaVersion','release','detail','provenance','total','items','nextCursor'],{schemaVersion:{const:SITE_METADATA.versions.registrySchema},release:{type:'string'},...responseProvenanceProperties,total:{type:'integer',minimum:0},items:{type:'array',items:{anyOf:[schemaRef('ItemBrief'),schemaRef('ItemCompact'),schemaRef('Item')]}},nextCursor:{type:['string','null'],pattern:'^\\d{1,7}$'}}),
 ItemRead:schemaObject(['schemaVersion','release','detail','provenance','item'],{schemaVersion:{const:SITE_METADATA.versions.registrySchema},release:{type:'string'},...responseProvenanceProperties,item:{anyOf:[schemaRef('ItemBrief'),schemaRef('ItemCompact'),schemaRef('Item')]}}),
 ContractRead:schemaObject(['schemaVersion','release','detail','provenance'],{schemaVersion:{const:SITE_METADATA.versions.registrySchema},release:{type:'string'},...responseProvenanceProperties,metadata:schemaRef('Metadata'),capabilities:schemaRef('Capabilities'),counts:schemaRef('Counts'),policy:schemaRef('ContractPolicy'),links:schemaRef('PublicLinks'),next:schemaRef('NextLookup')}),
 ItemDeliveryPlan:schemaObject(['schemaVersion','release','kind','id','manifest','commands','policy'],{schemaVersion:{const:SITE_METADATA.versions.registrySchema},release:{type:'string'},designSystem:schemaRef('DesignSystem'),kind:{type:'string',enum:['component','block']},id:{type:'string',pattern:'^[a-z0-9-]{1,90}$'},manifest:{type:'string'},commands:schemaObject(['plan','add'],{plan:{type:'string'},add:{type:'string'}}),policy:{type:'string'}}),
 MotionSearchResult:schemaObject(['schemaVersion','release','detail','provenance','total','items','nextCursor'],{schemaVersion:{const:'2.0'},release:{type:'string',pattern:'^[a-f0-9]{16}$'},...responseProvenanceProperties,total:{type:'integer',minimum:0},items:{type:'array',items:{anyOf:[schemaRef('MotionBrief'),schemaRef('MotionCompact'),schemaRef('Motion')]}},nextCursor:{type:['string','null'],pattern:'^\\d{1,7}$'}}),
 MotionRead:schemaObject(['schemaVersion','release','detail','provenance','motion'],{schemaVersion:{const:'2.0'},release:{type:'string',pattern:'^[a-f0-9]{16}$'},...responseProvenanceProperties,motion:{anyOf:[schemaRef('MotionBrief'),schemaRef('MotionCompact'),schemaRef('Motion')]}}),
 ThemeSearchResult:schemaObject(['schemaVersion','release','detail','provenance','defaultTheme','profiles','materials','modes','items'],{schemaVersion:{const:SITE_METADATA.versions.themeSchema},release:{type:'string'},...responseProvenanceProperties,sourceRevision:{type:'string'},defaultTheme:{type:'string'},profiles:{type:'array',items:schemaRef('ThemeProfile')},materials:stringList,modes:stringList,inventory:{type:'object',additionalProperties:{type:'integer',minimum:0}},items:{type:'array',items:{anyOf:[schemaRef('ThemeBrief'),schemaRef('ThemeCompact'),schemaRef('Theme')]}}}),
 ThemeRead:schemaObject(['schemaVersion','release','detail','provenance','theme','profiles','materials','modes','usage'],{schemaVersion:{const:SITE_METADATA.versions.themeSchema},release:{type:'string'},...responseProvenanceProperties,theme:{anyOf:[schemaRef('ThemeBrief'),schemaRef('ThemeCompact'),schemaRef('Theme')]},profiles:{type:'array',items:schemaRef('ThemeProfile')},materials:stringList,modes:stringList,usage:schemaRef('ThemeUsage')}),
 ThemeDeliveryPlan:schemaObject(['schemaVersion','release','kind','id','profile','material','mode','manifest','commands','policy'],{schemaVersion:{const:SITE_METADATA.versions.themeSchema},release:{type:'string'},designSystem:schemaRef('DesignSystem'),kind:{const:'theme'},id:{type:'string',pattern:'^[a-z0-9-]{1,90}$'},profile:{type:'string',enum:THEME_PROFILES},material:{type:'string',enum:THEME_MATERIALS},mode:{type:'string',enum:THEME_MODES},manifest:{type:'string'},commands:schemaObject(['plan','add'],{plan:{type:'string'},add:{type:'string'}}),policy:{type:'string'}}),
 ChartTypeCatalog:schemaObject(['schemaVersion','total','types','provenance'],{schemaVersion:{const:'1.0'},total:{type:'integer',minimum:0},types:{type:'array',items:schemaRef('ChartType')},provenance:schemaRef('Provenance')}),
 ChartThemeCatalog:schemaObject(['schemaVersion','profiles','modes','themes','provenance'],{schemaVersion:{const:'1.0'},profiles:stringList,modes:stringList,themes:{type:'array',items:{type:'object',additionalProperties:true}},provenance:schemaRef('Provenance')}),
 ChartInteractionCatalog:schemaObject(['schemaVersion','presets','provenance'],{schemaVersion:{const:'1.0'},presets:{type:'array',items:{type:'object',additionalProperties:true}},provenance:schemaRef('Provenance')}),
 ChartSkillRead:schemaObject(['schemaVersion','skill','contents','provenance'],{schemaVersion:{const:'1.0'},skill:{type:'string',enum:['chart','theme','interaction','board']},section:{type:'string'},contents:{type:'string'},provenance:schemaRef('Provenance')}),
 ChartValidation:schemaObject(['schemaVersion','valid','errors','provenance'],{schemaVersion:{const:'1.0'},valid:{type:'boolean'},errors:{type:'array',items:schemaRef('ChartError')},provenance:schemaRef('Provenance')},{additionalProperties:true}),
 ChartCompilation:schemaObject(['schemaVersion','valid','provenance'],{schemaVersion:{const:'1.0'},valid:{type:'boolean'},type:{type:'string'},family:{type:'string'},display:{type:'object'},plotData:{type:'object'},table:schemaRef('ChartTable'),diagnostics:stringList,summary:schemaRef('ChartSummary'),errors:{type:'array',items:schemaRef('ChartError')},provenance:schemaRef('Provenance')},{additionalProperties:true}),
 ChartRender:schemaObject(['schemaVersion','valid','provenance'],{schemaVersion:{const:'1.0'},valid:{type:'boolean'},view:{type:'string',enum:['chart','board']},type:{type:'string'},title:{type:'string'},columns:{type:'integer',minimum:1,maximum:3},svg:{type:'string'},table:schemaRef('ChartTable'),charts:{type:'array',items:{type:'object',additionalProperties:true}},diagnostics:stringList,summary:schemaRef('ChartSummary'),errors:{type:'array',items:schemaRef('ChartError')},provenance:schemaRef('Provenance')},{additionalProperties:true}),
 ChartBoardValidation:schemaObject(['schemaVersion','valid','charts','errors','provenance'],{schemaVersion:{const:'1.0'},valid:{type:'boolean'},title:{type:'string'},columns:{type:'integer',minimum:1,maximum:3},charts:{type:'array',items:{type:'object',additionalProperties:true}},errors:{type:'array',items:schemaRef('ChartError')},provenance:schemaRef('Provenance')},{additionalProperties:true}),
 ThemeBundleRead:schemaRef('ThemeBundle'),
 ToolDefinitions:schemaObject(['schemaVersion','tools'],{schemaVersion:{const:SITE_METADATA.versions.registrySchema},tools:{type:'array',items:schemaObject(['name','title','description','inputSchema','annotations','outputSchema'],{name:{type:'string'},title:{type:'string'},description:{type:'string'},inputSchema:{type:'object',description:'Per-tool MCP input arguments are versioned and remain unchanged.',additionalProperties:true},annotations:schemaObject(['readOnlyHint','destructiveHint','idempotentHint','openWorldHint'],{readOnlyHint:{type:'boolean'},destructiveHint:{type:'boolean'},idempotentHint:{type:'boolean'},openWorldHint:{type:'boolean'}}),outputSchema:{type:'object',description:'Self-contained JSON Schema 2020-12 output contract.',required:['$schema','$ref','$defs'],properties:{$schema:{const:KLIC_SCHEMA_DRAFT},$ref:{type:'string'},$defs:{type:'object',additionalProperties:{type:'object'}}}}})}}),
 Health:schemaObject(['status','service','release','transports'],{status:{const:'ok'},service:{const:'klic-registry'},release:{type:'string'},transports:stringList})
};
const KLIC_SCHEMA_DEFS={...KLIC_SCHEMA_COMPONENTS,...KLIC_SCHEMA_RESPONSES};
const toolResponseTypes={klic_search:'SearchResult',klic_get_item:'ItemRead',klic_get_contract:'ContractRead',klic_search_motions:'MotionSearchResult',klic_get_motion:'MotionRead',klic_get_install_plan:'ItemDeliveryPlan',klic_list_themes:'ThemeSearchResult',klic_get_theme:'ThemeRead',klic_get_theme_install_plan:'ThemeDeliveryPlan',klic_list_chart_types:'ChartTypeCatalog',klic_list_chart_themes:'ChartThemeCatalog',klic_list_chart_interactions:'ChartInteractionCatalog',klic_get_chart_skill:'ChartSkillRead',klic_validate_chart:'ChartValidation',klic_compile_chart:'ChartCompilation',klic_render_chart:'ChartRender',klic_show_chart:'ChartRender',klic_validate_chart_board:'ChartBoardValidation'};
const toolOutputs=Object.fromEntries(Object.entries(toolResponseTypes).map(([name,responseType])=>[name,{$schema:KLIC_SCHEMA_DRAFT,...schemaRef(responseType),$defs:KLIC_SCHEMA_DEFS}]));
export const KLIC_SCHEMA_INVENTORY={components:KLIC_SCHEMA_COMPONENTS,responses:KLIC_SCHEMA_RESPONSES,toolOutputs};

export async function installBundle(bundle, destination, fetchBytes, {dryRun=false}={}) {
  if(bundle?.schemaVersion!==SITE_METADATA.versions.bundleSchema||!Array.isArray(bundle.files)||!bundle.files.length||bundle.files.length>4096)invalid('Invalid bundle manifest.');
  // Ampersands are valid literal filename/URL path characters; query/fragment and traversal syntax remain rejected.
  const safePath=p=>typeof p==='string'&&p.split('/').every(v=>/^[a-zA-Z0-9_][a-zA-Z0-9_.&-]*$/.test(v));
  const paths=new Set();let total=0;
  for(const file of bundle.files){
    if(!safePath(file.path)||paths.has(file.path)||typeof file.url!=='string'||!file.url.startsWith('/')||file.url.startsWith('//')||!safePath(file.url.slice(1))||!Number.isSafeInteger(file.bytes)||file.bytes<0||file.bytes>20000000||!/^[a-f0-9]{64}$/.test(file.sha256))invalid('Unsafe or invalid bundle file.');
    paths.add(file.path);total+=file.bytes;
  }
  if(total>100000000)invalid('Bundle exceeds 100 MB.');
  for(const p of paths){let prefix='';for(const part of p.split('/').slice(0,-1)){prefix=prefix?prefix+'/'+part:part;if(paths.has(prefix))invalid('Conflicting file and directory paths.');}}
  const fs=await import('node:fs/promises'),path=await import('node:path'),{createHash}=await import('node:crypto');
  if(typeof destination!=='string'||!destination.trim())invalid('Provide --out with a new directory.');
  const target=path.resolve(destination),parent=path.dirname(target);
  for(let current=target;;current=path.dirname(current)){
    const stat=await fs.lstat(current).catch(e=>{if(e.code==='ENOENT')return null;throw e;});
    if(stat?.isSymbolicLink())throw new RegistryError('UNSAFE_DESTINATION','Symlink destinations are not allowed.');
    if(current===target&&stat)throw new RegistryError('DESTINATION_EXISTS','Destination already exists. Choose a new directory.');
    if(current===path.dirname(current))break;
  }
  const parentStat=await fs.stat(parent).catch(()=>null);if(!parentStat?.isDirectory())invalid('The destination parent directory must exist.');
  if(dryRun)return {dryRun:true,destination:target,files:bundle.files.length,bytes:total,dependencies:bundle.dependencies,paths:[...paths]};
  const staged=[];
  for(const file of bundle.files){const bytes=new Uint8Array(await fetchBytes(file.url));if(bytes.byteLength!==file.bytes||createHash('sha256').update(bytes).digest('hex')!==file.sha256)throw new RegistryError('INTEGRITY_FAILED',`Source integrity failed: ${file.path}`);staged.push({file,bytes});}
  const assertParent=async()=>{
    if(await fs.realpath(parent)!==parent)throw new RegistryError('UNSAFE_DESTINATION','Destination parent changed during download.');
    const now=await fs.lstat(parent);
    if(now.isSymbolicLink()||!now.isDirectory()||now.dev!==parentStat.dev||now.ino!==parentStat.ino)throw new RegistryError('UNSAFE_DESTINATION','Destination parent identity changed.');
  };
  await assertParent();
  // Exclusive mkdir is the final conflict gate; never overwrite a user's directory.
  try{await fs.mkdir(target);}catch(e){if(e.code==='EEXIST')throw new RegistryError('DESTINATION_EXISTS','Destination already exists.');throw e;}
  const targetStat=await fs.lstat(target);
  const assertTarget=async()=>{await assertParent();const now=await fs.lstat(target);if(now.isSymbolicLink()||now.dev!==targetStat.dev||now.ino!==targetStat.ino)throw new RegistryError('UNSAFE_DESTINATION','Destination changed during write.');};
  try{for(const {file,bytes} of staged){await assertTarget();const output=path.join(target,file.path);await fs.mkdir(path.dirname(output),{recursive:true});if(await fs.realpath(path.dirname(output))!==path.dirname(output))throw new RegistryError('UNSAFE_DESTINATION','Source path parent changed.');await fs.writeFile(output,bytes,{flag:'wx'});}}
  catch(e){try{await assertTarget();await fs.rm(target,{recursive:true,force:true});}catch{}throw e;}
  return {destination:target,files:staged.length,bytes:total,dependencies:bundle.dependencies,next:[...(bundle.designSystem?['Read KLIC-DESIGN-SYSTEM.json and DESIGN.md (source) or README.md (theme) before implementation.']:[]),'Read README.md and per-file notices.','bun install','bun run dev'],executedCommands:[]};
}
export const TOOL_DEFINITIONS = [
  {name:'klic_search',title:'Search KLIC library',description:'Find components and blocks with task-relevant query, kind, status, group or token filters. Returns matches, release and nextCursor, including separate clean labels.ko/en and categoryLabels.ko/en; both language values are searchable. Status defaults to ready. Use planned to inspect proposals. Detail supports brief, compact and full. Search does not return raw source or create files.',inputSchema:{type:'object',properties:{query:{type:'string',maxLength:200},kind:{type:'string',enum:['all','component','block']},status:{type:'string',enum:['ready','planned','all']},limit:{type:'integer',minimum:1,maximum:100},token:{type:'string',maxLength:200},group:{type:'string',maxLength:100},cursor:{type:'string',pattern:'^\\d{1,7}$'},detail:{type:'string',enum:[...DETAIL_LEVELS],default:'full'}},additionalProperties:false},annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false}},
  {name:'klic_get_item',title:'Get KLIC item',description:'Read one component or block by kind and id. Every detail level includes separate clean labels.ko/en and categoryLabels.ko/en; the legacy name remains a string. Results include status and requested fields; full includes the DESIGN contract, limits and source notice. Chart items expose design.chart selection, data, accessibility and QA guidance. Follow next to expand detail. This does not download source or create a workspace.',inputSchema:{type:'object',properties:{kind:{type:'string',enum:['component','block']},id:{type:'string',pattern:'^[a-z0-9-]{1,90}$'},detail:{type:'string',enum:[...DETAIL_LEVELS],default:'full'}},required:['kind','id'],additionalProperties:false},annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false}},
  {name:'klic_get_contract',title:'Read KLIC capabilities',description:'Read current KLIC release, designSystem.revision, integration capabilities and limitations. Full returns the shared policy; brief and compact include next links. This describes KLIC data, not verification of an external product.',inputSchema:{type:'object',properties:{detail:{type:'string',enum:[...DETAIL_LEVELS],default:'full'}},additionalProperties:false},annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false}}
];
TOOL_DEFINITIONS.push(
  {name:'klic_search_motions',title:'Search KLIC motions',description:'Search motion recipes by title, use case or category. Returns localized matches, source identity and nextCursor; full includes implementation examples and reduced-motion guidance. Search does not create files.',inputSchema:{type:'object',properties:{query:{type:'string',maxLength:200},category:{type:'string',enum:MOTION_CATEGORY_IDS},limit:{type:'integer',minimum:1,maximum:100},cursor:{type:'string',pattern:'^\\d{1,7}$'},detail:{type:'string',enum:[...DETAIL_LEVELS],default:'full'}},additionalProperties:false},annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false}},
  {name:'klic_get_motion',title:'Get KLIC motion',description:'Read one motion by canonical id. Returns source identity, attribution, reduced-motion guidance and preview limits; full includes CSS, JavaScript and React examples. Reading does not create files.',inputSchema:{type:'object',properties:{id:{type:'string',pattern:'^[a-z0-9-]{1,90}$'},detail:{type:'string',enum:[...DETAIL_LEVELS],default:'full'}},required:['id'],additionalProperties:false},annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false}}
);
TOOL_DEFINITIONS.push({name:'klic_get_install_plan',title:'Get KLIC source delivery plan',description:'Plan delivery for a ready component or block. Returns a source bundle manifest link, CLI commands and scope; inspect the item notice and publication status before using commands. It does not download files, write a workspace or execute commands.',inputSchema:{type:'object',properties:{kind:{type:'string',enum:['component','block']},id:{type:'string',pattern:'^[a-z0-9-]{1,90}$'}},required:['kind','id'],additionalProperties:false},annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false}});
const themeIdSchema={type:'string',pattern:'^[a-z0-9-]{1,90}$'};
const themeSelectionSchema={type:'object',properties:{id:themeIdSchema,profile:{type:'string',enum:THEME_PROFILES,default:'core'},material:{type:'string',enum:THEME_MATERIALS,default:'flat'},mode:{type:'string',enum:THEME_MODES,default:'system'}},required:['id'],additionalProperties:false};
const themeReadAnnotations={readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false};
TOOL_DEFINITIONS.push(
  {name:'klic_list_themes',title:'List KLIC themes',description:'Search theme names. Returns the default theme, profiles, materials, modes and matches; full also includes the inventory. It does not apply a theme or create files.',inputSchema:{type:'object',properties:{query:{type:'string',maxLength:200},detail:{type:'string',enum:[...DETAIL_LEVELS],default:'full'}},additionalProperties:false},annotations:themeReadAnnotations},
  {name:'klic_get_theme',title:'Get KLIC theme',description:'Read one theme. Full returns light and dark token values with CSS import and application instructions; shorter details link to more fields. It does not modify an app or generate a kit.',inputSchema:{type:'object',properties:{id:themeIdSchema,detail:{type:'string',enum:[...DETAIL_LEVELS],default:'full'}},required:['id'],additionalProperties:false},annotations:themeReadAnnotations},
  {name:'klic_get_theme_install_plan',title:'Get KLIC theme delivery plan',description:'Plan a standalone kit for a theme and profile, material and mode. Returns a manifest link, commands and scope; check publication status before using commands. It does not fetch files, modify an app or run commands.',inputSchema:themeSelectionSchema,annotations:themeReadAnnotations}
);
TOOL_DEFINITIONS.push(...KLIC_CHART_METADATA_TOOL_DEFINITIONS);
const ALL_TOOL_DEFINITIONS=[...TOOL_DEFINITIONS,...KLIC_CHART_LOCAL_TOOL_DEFINITIONS];
for(const tool of ALL_TOOL_DEFINITIONS){
 const outputSchema=KLIC_SCHEMA_INVENTORY.toolOutputs[tool.name];
 if(!outputSchema)throw new Error(`Missing KLIC response schema for ${tool.name}.`);
 tool.outputSchema=outputSchema;
}
export function callRegistryTool(registry,name,input={},responder=null) {
  if(KLIC_CHART_LOCAL_TOOL_NAMES.includes(name)&&responder?.transport!=='stdio-mcp')throw new RegistryError('LOCAL_ONLY','Chart rows and chart rendering are available through local stdio MCP only.');
  let value;
  if(name==='klic_search_motions')value=searchMotions(registry.motions,input);
  else if(name==='klic_get_motion')value=getMotionRecord(registry.motions,input);
  else if(name==='klic_list_themes')value=listThemes(registry,input);
  else if(name==='klic_get_theme')value=getTheme(registry,input);
  else if(name==='klic_get_theme_install_plan')value=getThemeDeliveryPlan(registry,input);
  else if(name==='klic_get_install_plan')value=getDeliveryPlan(registry,input);
  else if(name==='klic_search')value=searchRegistry(registry,input);
  else if(name==='klic_get_item')value=getRegistryItem(registry,input);
  else if(name==='klic_get_contract')value=getContract(registry,input);
  else if([...KLIC_CHART_METADATA_TOOL_DEFINITIONS,...KLIC_CHART_LOCAL_TOOL_DEFINITIONS].some(tool=>tool.name===name))value=executeKlicChartTool(name,input,invalid);
  else throw new RegistryError('UNKNOWN_TOOL',`Unknown tool: ${name}`);
  if(value.detail==='full'&&(name==='klic_search_motions'||name==='klic_get_motion'))value={...value,...systemFields(registry)};
  if(name!=='klic_get_install_plan'&&name!=='klic_get_theme_install_plan')value=withRegistryProvenance(value,registry,value.schemaVersion);
  return responder?withResponder(value,responder):value;
}
export function errorBody(error) { return {error:{code:error instanceof RegistryError?error.code:'INTERNAL_ERROR',message:error instanceof RegistryError?error.message:'The operation could not be completed.'}}; }
export function safeBaseURL(value = SITE_ORIGIN) {
  let url;try { url = new URL(value); } catch { invalid('base must be an absolute HTTPS URL.'); }
  if (url.username || url.password || (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost','127.0.0.1','[::1]'].includes(url.hostname)))) invalid('Use HTTPS, or HTTP on localhost for development.');
  url.hash='';url.search='';if (!url.pathname.endsWith('/')) url.pathname+='/';return url;
}
function safeRequestHeaders(input) {
  let headers;try { headers=new Headers(input); }catch { invalid('Invalid request headers.'); }
  for(const name of headers.keys())if(!['accept','x-klic-api-key'].includes(name))invalid('Only Accept and X-KLIC-API-Key request headers are supported.');
  const key=headers.get('x-klic-api-key');
  if(key!==null&&!/^[\x21-\x7e]{1,4096}$/.test(key))invalid('Invalid KLIC API key format.');
  return headers;
}
function checkRemoteResponse(response,code,label) {
  if(response.redirected)throw new RegistryError('UNSAFE_REDIRECT','Registry requests must remain on the selected base. Redirects are not followed.');
  if(response.status===429){
    const raw=response.headers?.get('retry-after');let seconds=null;
    if(raw&&/^\d+$/.test(raw)&&Number.isSafeInteger(Number(raw)))seconds=Number(raw);
    else if(raw&&Number.isFinite(Date.parse(raw)))seconds=Math.max(0,Math.ceil((Date.parse(raw)-Date.now())/1000));
    throw new RegistryError('RATE_LIMITED',seconds===null?'Request limit reached. Retry later according to the server limit.':`Request limit reached. Retry after ${seconds} seconds.`);
  }
  if(!response.ok)throw new RegistryError(code,`${label} returned HTTP ${response.status}.`);
  return response;
}
async function fetchRegistryResource(base,reference,fetcher,headers,{timeout=15000,code='SOURCE_UNAVAILABLE',label='Source'}={}) {
  const baseURL=safeBaseURL(base);let target;
  try{target=new URL(reference,baseURL);}catch{throw new RegistryError('INVALID_REGISTRY','Invalid resource URL.');}
  if(target.origin!==baseURL.origin||target.username||target.password)throw new RegistryError('INVALID_REGISTRY','Resource must stay on the selected registry origin.');
  // A key is never put in a URL, copied to another origin, or forwarded by redirects.
  const response=await fetcher(target,{headers:safeRequestHeaders(headers),redirect:'error',credentials:'omit',signal:AbortSignal.timeout(timeout)});
  return checkRemoteResponse(response,code,label);
}
export async function loadRegistry(base = SITE_ORIGIN, fetcher = globalThis.fetch, {headers} = {}) {
  const response = await fetchRegistryResource(base,'api/v1/registry.json',fetcher,headers,{code:'REGISTRY_UNAVAILABLE',label:'Registry'});
  return validateRegistry(await response.json());
}
export async function loadThemeRegistry(base = SITE_ORIGIN, fetcher = globalThis.fetch, {headers} = {}) {
  const response = await fetchRegistryResource(base,'api/v1/themes.json',fetcher,headers,{label:'Theme catalog'});
  const catalog=await response.json();
  if(!record(catalog)||typeof catalog.release!=='string'||!catalog.release)throw new RegistryError('INVALID_REGISTRY','Expected a versioned theme catalog.');
  validateDesignSystem(catalog.designSystem);
  const registry={schemaVersion:SITE_METADATA.versions.registrySchema,release:catalog.release,themes:catalog,...(catalog.designSystem?{designSystem:catalog.designSystem}:{})};
  themeCatalog(registry);
  return registry;
}

/** JSON-RPC transport-independent dispatch. Stdio lifecycle lives in runCLI. */
export function createMCPSession(options={}) { return {legacyInitialized:false,legacyReady:false,...(record(options.clientCapabilities)?{clientCapabilities:options.clientCapabilities}:{}),...(record(options.responder)?{responder:{...options.responder}}:{})}; }
export function handleMCPRequest(registry, request, session = createMCPSession()) {
  const failure = (id,code,message) => ({jsonrpc:'2.0',id,error:{code,message}});
  if (!record(request) || request.jsonrpc !== '2.0' || typeof request.method !== 'string' || ('id' in request && (typeof request.id !== 'string' && !Number.isInteger(request.id)))) return failure(null,-32600,'Invalid Request');
  if (!('id' in request)) { if(request.method==='notifications/initialized'&&session.legacyInitialized)session.legacyReady=true; return null; }
  const id=request.id, params=request.params??{};
  if (!record(params)) return failure(id,-32602,'Invalid params');
  const requestedVersion=params._meta?.['io.modelcontextprotocol/protocolVersion'];
  const modern=request.method==='server/discover'||requestedVersion===MCP_MODERN_PROTOCOL;
  if (requestedVersion && !PROTOCOL_VERSIONS.includes(requestedVersion)) return {jsonrpc:'2.0',id,error:{code:-32022,message:'Unsupported protocol version',data:{supported:PROTOCOL_VERSIONS,requested:requestedVersion}}};
  if(modern && (requestedVersion!==MCP_MODERN_PROTOCOL||!record(params._meta?.['io.modelcontextprotocol/clientCapabilities'])))return failure(id,-32602,'Required protocolVersion and clientCapabilities metadata is missing.');
  if(!modern&&request.method!=='initialize'&&request.method!=='ping'&&!session.legacyReady)return failure(id,-32600,'Initialize the legacy connection before calling tools.');
  const suppliedClientCapabilities=modern?params._meta?.['io.modelcontextprotocol/clientCapabilities']:request.method==='initialize'?params.capabilities:undefined;
  if(record(suppliedClientCapabilities))session.clientCapabilities=suppliedClientCapabilities;
  const clientCapabilities=record(suppliedClientCapabilities)?suppliedClientCapabilities:session.clientCapabilities;
  const transport=session.responder?.transport||'mcp';
  let result;
  if (request.method === 'server/discover') result={supportedVersions:PROTOCOL_VERSIONS,capabilities:{tools:{},resources:{},prompts:{}},_meta:{'io.modelcontextprotocol/serverInfo':{name:'klic-registry',version:INTEGRATION_VERSION}},ttlMs:60000,cacheScope:'public'};
  else if (request.method === 'initialize') { if(typeof params.protocolVersion!=='string'||!record(params.capabilities)||!record(params.clientInfo))return failure(id,-32602,'Initialize requires protocolVersion, capabilities and clientInfo.');session.legacyInitialized=true;session.legacyReady=false;session.clientCapabilities=params.capabilities;result={protocolVersion:MCP_LEGACY_PROTOCOL,capabilities:{tools:{},resources:{},prompts:{}},serverInfo:{name:'klic-registry',version:INTEGRATION_VERSION},instructions:'Read klic_get_contract first and record release, designSystem.revision and actual responder/toolkit versions. Explore chart types, KLIC profiles and interactions with the chart metadata tools. Chart rows are processed only by local stdio chart tools; hosted endpoints accept metadata only. Validate with klic_validate_chart before klic_show_chart. Search the KLIC item catalog with task-relevant filters and follow next. Only ready items can be delivered; planned items provide guidance only; not-specified means evidence is missing. Check source notices before delivery. Request a delivery plan only when implementation needs source; it does not download files, write a workspace or execute commands.'}; }
  else if (request.method === 'ping') result={};
  else if (request.method === 'tools/list') result={tools:[...TOOL_DEFINITIONS,...getKlicChartMcpTools({transport,clientCapabilities})],...(requestedVersion===MCP_MODERN_PROTOCOL?{ttlMs:60000,cacheScope:'public'}:{})};
  else if (request.method === 'tools/call') {
    if(typeof params.name!=='string'||!ALL_TOOL_DEFINITIONS.some(tool=>tool.name===params.name)||('arguments' in params&&!record(params.arguments)))return failure(id,-32602,'Unknown tool or invalid call params');
    try { const value=callRegistryTool(registry,params.name,params.arguments??{},session.responder||{transport:'mcp'});result={content:[{type:'text',text:JSON.stringify(value)}],structuredContent:value,isError:false}; }
    catch (error) { const value=errorBody(error);result={content:[{type:'text',text:JSON.stringify(value)}],structuredContent:value,isError:true}; }
    if (requestedVersion===MCP_MODERN_PROTOCOL) result.resultType='complete';
  } else if(request.method==='resources/list')result={resources:getKlicChartResources({transport,clientCapabilities})};
  else if(request.method==='resources/read'){
    if(typeof params.uri!=='string')return failure(id,-32602,'resources/read requires a URI.');const resource=readKlicChartResource(params.uri);if(!resource)return failure(id,-32002,'Chart resource not found.');result={contents:[resource]};
  } else if(request.method==='prompts/list')result={prompts:getKlicChartPromptList()};
  else if(request.method==='prompts/get'){
    if(typeof params.name!=='string'||('arguments' in params&&!record(params.arguments)))return failure(id,-32602,'prompts/get requires a prompt name and object arguments.');const prompt=getKlicChartPrompt(params.name,params.arguments||{});if(!prompt)return failure(id,-32602,'Unknown KLIC chart prompt.');result=prompt;
  } else return failure(id,-32601,'Method not found');
  if(modern)result.resultType='complete';
  return {jsonrpc:'2.0',id,result};
}

export const CLI_OPTIONS = Object.freeze({list:['kind','status','limit','cursor','token','group','detail'],search:['kind','status','limit','cursor','token','group','detail'],get:['detail'],source:['variant'],contract:['detail'],plan:[],add:['out','dry-run'],mcp:[],motion:['query','category','limit','cursor','detail'],theme:['query','detail','profile','material','mode','out','dry-run']});
const THEME_CLI_OPTIONS={list:['query','detail'],get:['detail'],plan:['profile','material','mode'],add:['profile','material','mode','out','dry-run']};
function cliHelp(){return `KLIC Toolkit ${INTEGRATION_VERSION} — Bun ${SITE_METADATA.toolchain.bun} preferred; Node.js ${SITE_METADATA.toolchain.nodeMinimum}+ supported.

${BUN_CLI_COMMAND} search input --kind component
${BUN_CLI_COMMAND} list --kind component --limit 5
${BUN_CLI_COMMAND} get component input --detail full
${BUN_CLI_COMMAND} plan block course-catalog
${BUN_CLI_COMMAND} add block course-catalog --out ./course-demo --dry-run
${BUN_CLI_COMMAND} mcp

Node.js equivalent: ${NODE_CLI_COMMAND} <command> ...
--base HTTPS_ORIGIN   Read a compatible registry (default: KLIC public site).
--local              Read ./dist/api/v1/registry.json and bundle assets from a source checkout.
KLIC_API_KEY         Optional environment variable; never pass it in a URL or command argument.
429                  Stops without retrying; reports Retry-After.

Read the contract first. Record release and designSystem.revision; check responder and toolkit versions separately. Explore with brief or compact, then follow the returned next field. In search results, ready means available, planned is a proposal, and not-specified means evidence is missing. Use KLIC-DESIGN-SYSTEM.json to inspect policy responsibilities, preset bounds and conflict order. Search ranks exact ID/name matches first, then prefixes, partial matches and metadata. Ties retain registry order and cursors follow ranking. Full item contracts expose tokenContext and evidence-backed variantSupport; preview forms are examples, not product props. Check limitations and any source notice. Source prints raw code only. Review add --dry-run before writing to a new folder.
Only HTTP downloads consume server request quota. add and theme add verify integrity, refuse overwrite and do not execute shell commands.
`;}
export async function runCLI(argv, io = {}) {
  const stdout=io.stdout||process.stdout, stderr=io.stderr||process.stderr;
  const args=[...argv], command=args.shift()||'help', positional=[], flags={};
  const responder={...(record(io.responder)?io.responder:{}),transport:command==='mcp'?'stdio-mcp':'cli'};
  const write = value => stdout.write(JSON.stringify(withResponder(value,responder),null,2)+'\n');
  try {
    for(let i=0;i<args.length;i++) { const arg=args[i];if(arg.startsWith('--')) { const name=arg.slice(2);if(!['base','kind','status','limit','cursor','local','out','dry-run','token','group','query','category','profile','material','mode','variant','detail'].includes(name)) invalid(`Unknown option: ${arg.split('=')[0]}`);if(Object.hasOwn(flags,name))invalid(`Duplicate option: --${name}`);if(name==='local'||name==='dry-run') flags[name]=true;else {if(!args[i+1]||args[i+1].startsWith('--'))invalid(`Missing value for ${arg}`);flags[name]=args[++i];}}else positional.push(arg); }
    if(command==='help'||command==='--help') { stdout.write(cliHelp());return 0; }
    if(!Object.hasOwn(CLI_OPTIONS,command))invalid(`Unknown command: ${command}`);
    for(const name of Object.keys(flags))if(!['local','base',...CLI_OPTIONS[command]].includes(name))invalid(`Option --${name} is not supported by ${command}.`);
    if(flags.detail!==undefined)detailLevel({detail:flags.detail});
    if(flags.local&&flags.base)invalid('Choose --local or --base, not both.');
    if(flags.base)safeBaseURL(flags.base);
    const themeCommand=command==='theme'?positional.shift():null;
    const motionCommand=command==='motion'?positional.shift():null;
    let themeInput;
    if(command==='theme'){
      if(!Object.hasOwn(THEME_CLI_OPTIONS,themeCommand))invalid('theme requires list, get, plan or add.');
      for(const name of Object.keys(flags))if(!['local','base',...THEME_CLI_OPTIONS[themeCommand]].includes(name))invalid(`Option --${name} is not supported by theme ${themeCommand}.`);
      if(themeCommand==='list'){
        if(positional.length)invalid('theme list takes no positional arguments.');
        themeInput={...(flags.query!==undefined?{query:flags.query}:{}),...(flags.detail!==undefined?{detail:flags.detail}:{})};themeQuery(themeInput);
      }else{
        if(positional.length!==1)invalid(`theme ${themeCommand} requires a theme id.`);
        themeInput={id:positional[0],...(flags.detail!==undefined?{detail:flags.detail}:{}),...Object.fromEntries(['profile','material','mode'].filter(name=>flags[name]!==undefined).map(name=>[name,flags[name]]))};
        if(themeCommand==='get')themeId(themeInput);else themeSelection(themeInput);
      }
      if(themeCommand==='add'&&(typeof flags.out!=='string'||!flags.out.trim()||flags.out.includes('\0')))invalid('theme add requires --out with a new directory.');
    }else if(command==='motion'){
      if(!['list','get'].includes(motionCommand))invalid('motion requires list or get.');
      const motionFlags=motionCommand==='list'?['local','base','query','category','limit','cursor','detail']:['local','base','detail'];
      for(const name of Object.keys(flags))if(!motionFlags.includes(name))invalid(`Option --${name} is not supported by motion ${motionCommand}.`);
      if(motionCommand==='list'){
        if(positional.length)invalid('motion list takes no positional arguments.');
        if(flags.query!==undefined&&(typeof flags.query!=='string'||flags.query.length>200))invalid('query must be a string of at most 200 characters.');
        if(flags.detail!==undefined)detailLevel({detail:flags.detail});
        if(flags.limit!==undefined&&(!Number.isInteger(Number(flags.limit))||Number(flags.limit)<1||Number(flags.limit)>100))invalid('limit must be an integer from 1 to 100.');
        if(flags.cursor!==undefined&&!/^\d{1,7}$/.test(flags.cursor))invalid('cursor must be the numeric string returned by the previous page.');
      }else{
        if(positional.length!==1)invalid('motion get requires a motion id.');
        if(!/^[a-z0-9-]{1,90}$/.test(positional[0]))invalid('Provide a valid motion id.');
      }
    }else if(['get','source','plan','add'].includes(command)){
      if(positional.length!==2)invalid(`${command} requires kind and id.`);
      if(!['component','block'].includes(positional[0])||!/^[a-z0-9-]{1,90}$/.test(positional[1]))invalid('Provide kind (component or block) and a valid catalog id.');
    }else if(positional.length>(command==='search'?1:0))invalid('Unexpected positional argument.');
    if(flags.variant!==undefined&&(positional[0]!=='component'||!/^[a-z0-9-]{1,90}$/.test(flags.variant)))invalid('--variant requires a component and a valid form id from get.');
    if(command==='add'&&!flags.out)invalid('add requires --out with a new directory.');
    if(flags.cursor&&!/^\d{1,7}$/.test(flags.cursor))invalid('cursor must be the numeric string returned by the previous page.');
    if(command==='list'||command==='search')searchRegistry({items:[]},{query:command==='search'?(positional[0]||''):'',...Object.fromEntries(Object.entries(flags).filter(([name])=>CLI_OPTIONS[command].includes(name)).map(([name,value])=>[name,name==='limit'?Number(value):name==='cursor'?'0':value]))});
    const fetcher=io.fetch||globalThis.fetch;
    const environment=io.env||process.env;
    const apiKey=flags.local?'':environment.KLIC_API_KEY||'';
    if(apiKey&&!/^[\x21-\x7e]{1,4096}$/.test(apiKey))invalid('Invalid KLIC_API_KEY format. Use an environment variable without whitespace.');
    const requestHeaders=apiKey?{'X-KLIC-API-Key':apiKey}:{};
    const fs=flags.local?await import('node:fs/promises'):null;
      const registry=flags.local?validateRegistry(JSON.parse(await fs.readFile('dist/api/v1/registry.json','utf8'))):command==='theme'?await loadThemeRegistry(flags.base,fetcher,{headers:requestHeaders}):await loadRegistry(flags.base,fetcher,{headers:requestHeaders});
    if(command==='theme'){
      if(themeCommand==='list'){write(listThemes(registry,themeInput));return 0;}
      if(themeCommand==='get'){write(getTheme(registry,themeInput));return 0;}
      const plan=getThemeDeliveryPlan(registry,themeInput);
      if(themeCommand==='plan'){write(plan);return 0;}
      const fetchBytes=async url=>{if(flags.local)return fs.readFile('dist'+url);const r=await fetchRegistryResource(flags.base,url,fetcher,requestHeaders,{timeout:30000});return new Uint8Array(await r.arrayBuffer());};
      const bundle=JSON.parse(new TextDecoder().decode(await fetchBytes(plan.manifest)));
      if(bundle.kind!=='theme'||['id','profile','material','mode'].some(name=>bundle[name]!==plan[name]))throw new RegistryError('INVALID_REGISTRY','Bundle identity mismatch.');
      const installed=await installBundle(bundle,flags.out,fetchBytes,{dryRun:!!flags['dry-run']});
      write({...installed,...systemFields(registry),next:['Read README.md and theme.config.json in the new kit folder.',`Import the CSS in your app: import ${JSON.stringify(installed.destination+'/theme.css')};`,`Import { applyTheme } from ${JSON.stringify(installed.destination+'/apply-theme.mjs')}; then call const theme = applyTheme(document.documentElement).`,`The kit uses theme ${plan.id}, profile ${plan.profile}, material ${plan.material}, and mode ${plan.mode}. Use theme.update({mode: 'dark'}) to update it.`]});return 0;
    }
    if(command==='motion'){
      const catalog=requireMotionCatalog(registry.motions);
      if(motionCommand==='list'){
        const result=withRegistryProvenance(searchMotions(catalog,{...(flags.query!==undefined?{query:flags.query}:{}),...(flags.category!==undefined?{category:flags.category}:{}),...(flags.limit!==undefined?{limit:Number(flags.limit)}:{}),...(flags.cursor!==undefined?{cursor:flags.cursor}:{}),...(flags.detail!==undefined?{detail:flags.detail}:{})}),registry);
        write({...result,...(result.detail==='full'?systemFields(registry):{})});
      }else{
        const result=withRegistryProvenance(getMotionRecord(catalog,{id:positional[0],...(flags.detail!==undefined?{detail:flags.detail}:{})}),registry);
        write({...result,...(result.detail==='full'?systemFields(registry):{})});
      }
      return 0;
    }
    if(command==='plan'||command==='add') {
      if(positional.length!==2)invalid(`${command} requires kind and id.`);
      const plan=getDeliveryPlan(registry,{kind:positional[0],id:positional[1]});
      if(command==='plan'){write(plan);return 0;}
      if(!flags.out)invalid('add requires --out with a new directory.');
      const fetchBytes=async url=>{if(flags.local)return fs.readFile('dist'+url);const r=await fetchRegistryResource(flags.base,url,fetcher,requestHeaders,{timeout:30000});return new Uint8Array(await r.arrayBuffer());};
      const bundle=JSON.parse(new TextDecoder().decode(await fetchBytes(plan.manifest)));
      if(bundle.kind!==plan.kind||bundle.id!==plan.id)throw new RegistryError('INVALID_REGISTRY','Bundle identity mismatch.');
      write({...await installBundle(bundle,flags.out,fetchBytes,{dryRun:!!flags['dry-run']}),...systemFields(registry)});return 0;
    }
    // Stdio tools run against this loaded snapshot, not the remote /mcp endpoint.
    // Offline --local operations make no server requests and consume no server quota.
    if(command==='mcp') { if(positional.length)invalid('mcp takes no positional arguments.');const {createInterface}=await import('node:readline');const input=io.stdin||process.stdin,session=createMCPSession({responder});for await(const line of createInterface({input,crlfDelay:Infinity})) {let response;try {if(Buffer.byteLength(line)>1048576)throw new Error('Message too large');response=handleMCPRequest(registry,JSON.parse(line),session);}catch {response={jsonrpc:'2.0',id:null,error:{code:-32700,message:'Parse error'}};}if(response)stdout.write(JSON.stringify(response)+'\n');}return 0; }
    if(command==='list'||command==='search') {if(positional.length>(command==='search'?1:0))invalid('Unexpected positional argument.');write(searchRegistry(registry,{query:command==='search'?(positional[0]||''):'',...(flags.kind?{kind:flags.kind}:{}),...(flags.status?{status:flags.status}:{}),...(flags.limit?{limit:Number(flags.limit)}:{}),...(flags.cursor?{cursor:flags.cursor}:{}),...(flags.token?{token:flags.token}:{}),...(flags.group?{group:flags.group}:{}),...(flags.detail!==undefined?{detail:flags.detail}:{})}));}
    else if(command==='contract') {if(positional.length)invalid('contract takes no arguments.');write(getContract(registry,{...(flags.detail!==undefined?{detail:flags.detail}:{})}));}
    else {if(positional.length!==2)invalid(`${command} requires kind and id.`);const result=getRegistryItem(registry,{kind:positional[0],id:positional[1],...(flags.detail!==undefined?{detail:flags.detail}:{})});if(command==='get')write(result);else {const variant=flags.variant!==undefined?result.item.variants?.find(form=>form.id===flags.variant):null;if(flags.variant!==undefined&&!variant)throw new RegistryError('NOT_FOUND','No component form named '+flags.variant+'. Use get to list variants.');const source=variant?variant.source:result.item.source;if(!source?.path)throw new RegistryError('SOURCE_UNAVAILABLE','This planned item has no source export.');if(!/^\/(?:api\/v1\/sources\/|block-sources\/)[a-zA-Z0-9_./-]+$/.test(source.path)||source.path.split('/').includes('..'))throw new RegistryError('INVALID_REGISTRY','Unsafe source reference.');if(flags.local)stdout.write(await fs.readFile('dist'+source.path,'utf8'));else {const response=await fetchRegistryResource(flags.base,source.path,fetcher,requestHeaders);stdout.write(await response.text());}}}
    return 0;
  } catch(error) {stderr.write(JSON.stringify(errorBody(error))+'\n');return 1;}
}
if(typeof process!=='undefined'&&process.versions?.node) {
  const {pathToFileURL}=await import('node:url');
  if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)process.exitCode=await runCLI(process.argv.slice(2));
}
