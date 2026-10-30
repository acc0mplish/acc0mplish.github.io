#!/usr/bin/env node
/** Public read-only integration core and verified source delivery; no shell execution. */
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
    "bun": "1.4.2",
    "nodeMinimum": "22"
  },
  "package": {
    "name": "klic-design",
    "version": "0.0.2",
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
      "managedAuthentication": "Sites personal plugin"
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
        "version": "0.0.2",
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
    "summary": "klic-design 통합 패키지: AI 설계 지침·토큰·테마·폰트·CLI·CSS/React 모션 예제",
    "enSummary": "Unified klic-design package: Agent Skill, tokens, themes, fonts, CLI and CSS/React motion examples",
    "sourceDelivery": "Components and ready blocks: standalone reference workspaces via CLI plan/add. Motion recipes: CSS/React code via detail views, API and CLI motion get; include recipe CSS or React dependencies when adopting.",
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
const [MCP_MODERN_PROTOCOL,MCP_LEGACY_PROTOCOL]=PROTOCOL_VERSIONS;
export class RegistryError extends Error {
  constructor(code, message) { super(message); this.name = 'RegistryError'; this.code = code; }
}
const invalid = message => { throw new RegistryError('INVALID_ARGUMENT', message); };
const record = value => !!value && typeof value === 'object' && !Array.isArray(value);
function fields(input, allowed) {
  if (!record(input)) invalid('Arguments must be an object.');
  for (const key of Object.keys(input)) if (!allowed.includes(key)) invalid(`Unknown argument: ${key}`);
}
// Optional for older v1 registries; new publications carry one versioned snapshot.
function systemFields(registry) { return registry.designSystem ? {designSystem:registry.designSystem} : {}; }
function validateDesignSystem(value) {
 if(value===undefined)return;
 if(!record(value)||value.schemaVersion!==SITE_METADATA.versions.designSystemSchema||!/^[a-f0-9]{64}$/.test(value.revision)||value.namespace!=='klic.'||JSON.stringify(value.tokenLayers)!==JSON.stringify(['Primitive','Brand','Semantic','Component'])||!Array.isArray(value.dimensions)||value.dimensions.length!==7||!record(value.presetPolicy)||!Array.isArray(value.conflictResolution))throw new RegistryError('INVALID_REGISTRY','Invalid design system snapshot.');
}
export function validateRegistry(value) {
  if (!record(value) || value.schemaVersion !== SITE_METADATA.versions.registrySchema || !Array.isArray(value.items) || value.items.length > 10000 || !record(value.capabilities)) throw new RegistryError('INVALID_REGISTRY', `Expected a KLIC registry with schemaVersion ${SITE_METADATA.versions.registrySchema}.`);
  validateDesignSystem(value.designSystem);
  if(value.motions!==undefined)validateMotionCatalog(value.motions);
  const keys = new Set();
  for (const item of value.items) {
    if (!record(item) || !['component', 'block'].includes(item.kind) || !/^[a-z0-9-]{1,90}$/.test(item.id) || typeof item.name !== 'string' || typeof item.description !== 'string' || typeof item.category !== 'string' || !Array.isArray(item.tags) || item.tags.some(tag=>typeof tag!=='string') || item.route !== `#${item.kind==='component'?'component':'blocks'}/${item.id}/preview` || !['ready','planned'].includes(item.status) || (item.status==='planned'&&item.source!==null)) throw new RegistryError('INVALID_REGISTRY','Invalid item in registry.');
    const key = `${item.kind}:${item.id}`;
    if (keys.has(key)) throw new RegistryError('INVALID_REGISTRY',`Duplicate item: ${key}`);
    keys.add(key);
  }
  return value;
}
export function validateMotionCatalog(value){
  if(!record(value)||typeof value.schemaVersion!=='string'||!Array.isArray(value.categories)||!Array.isArray(value.items)||value.items.length>10000||value.total!==value.items.length)throw new RegistryError('INVALID_REGISTRY','Invalid motion catalog.');
  const categories=new Set();
  for(const category of value.categories){if(!record(category)||!/^[a-z0-9-]{1,90}$/.test(category.id)||categories.has(category.id)||!record(category.label)||typeof category.label.ko!=='string'||typeof category.label.en!=='string')throw new RegistryError('INVALID_REGISTRY','Invalid motion category.');categories.add(category.id);}
  const ids=new Set();
  for(const motion of value.items){
    if(!record(motion)||!/^[a-z0-9-]{1,90}$/.test(motion.id)||ids.has(motion.id)||!categories.has(motion.category)||motion.source!=='klic-authored'||typeof motion.title?.ko!=='string'||typeof motion.title?.en!=='string'||typeof motion.summary?.ko!=='string'||typeof motion.summary?.en!=='string'||typeof motion.trigger?.ko!=='string'||typeof motion.trigger?.en!=='string'||!Number.isInteger(motion.durationMs)||motion.durationMs<1||motion.durationMs>60000||!Number.isInteger(motion.staggerMs)||motion.staggerMs<0||motion.staggerMs>5000||typeof motion.easing!=='string'||!Array.isArray(motion.useCases)||!Array.isArray(motion.cautions)||typeof motion.reducedMotion?.ko!=='string'||typeof motion.reducedMotion?.en!=='string'||!record(motion.preview)||!record(motion.implementation)||typeof motion.implementation.css!=='string'||typeof motion.implementation.react!=='string'||motion.route!==`#motion/${motion.id}`)throw new RegistryError('INVALID_REGISTRY','Invalid motion item.');
    ids.add(motion.id);
  }
  return value;
}
function requireMotionCatalog(value){if(!value)throw new RegistryError('SOURCE_UNAVAILABLE','This registry does not provide motion recipes.');return validateMotionCatalog(value);}
export function searchMotions(catalog,input={}){
  fields(input,['query','category','limit','cursor']);
  const source=requireMotionCatalog(catalog),query=input.query??'',category=input.category??'',limit=input.limit??20,cursor=input.cursor??'0';
  if(typeof query!=='string'||query.length>200)invalid('query must be a string of at most 200 characters.');
  if(category&&(!/^[a-z0-9-]{1,90}$/.test(category)||!source.categories.some(item=>item.id===category)))invalid('category must match a motion category id.');
  if(!Number.isInteger(limit)||limit<1||limit>100)invalid('limit must be an integer from 1 to 100.');
  if(typeof cursor!=='string'||!/^\d{1,7}$/.test(cursor))invalid('cursor must be the numeric string returned by the previous page.');
  const offset=Number(cursor),needle=query.trim().toLocaleLowerCase(),matches=source.items.filter(item=>(!category||item.category===category)&&(!needle||[item.id,item.category,item.title.ko,item.title.en,item.summary.ko,item.summary.en,...item.useCases.flatMap(entry=>[entry.ko,entry.en])].join(' ').toLocaleLowerCase().includes(needle)));
  if(offset>matches.length)invalid('cursor is beyond the result set. Restart with cursor 0 after changing a filter.');
  return {schemaVersion:source.schemaVersion,...(source.release?{release:source.release}:{}),total:matches.length,items:matches.slice(offset,offset+limit),nextCursor:offset+limit<matches.length?String(offset+limit):null};
}
export function getMotionRecord(catalog,input={}){
  fields(input,['id']);if(typeof input.id!=='string'||!/^[a-z0-9-]{1,90}$/.test(input.id))invalid('Provide a valid motion id.');
  const source=requireMotionCatalog(catalog),motion=source.items.find(item=>item.id===input.id);if(!motion)throw new RegistryError('NOT_FOUND',`No motion named ${input.id}.`);
  return {schemaVersion:source.schemaVersion,...(source.release?{release:source.release}:{}),motion};
}
export function searchRegistry(registry, input = {}) {
  fields(input, ['query', 'kind', 'status', 'limit', 'cursor', 'token', 'group']);
  const query = input.query ?? '', kind = input.kind ?? 'all', status = input.status ?? 'ready', limit = input.limit ?? 20, cursor = input.cursor ?? '0';
  if (typeof query !== 'string' || query.length > 200) invalid('query must be a string of at most 200 characters.');
  if (!['all','component','block'].includes(kind)) invalid('kind must be all, component or block.');
  if (!['ready','planned','all'].includes(status)) invalid('status must be ready, planned or all.');
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) invalid('limit must be an integer from 1 to 100.');
  if (typeof cursor !== 'string' || !/^\d{1,7}$/.test(cursor)) invalid('cursor must be the numeric string returned by the previous page.');
  for(const key of ['token','group']){const maximum=key==='group'?100:200;if(input[key]!==undefined&&(typeof input[key]!=='string'||input[key].length>maximum))invalid(key+' must be a string up to '+maximum+' characters.');}
  const offset = Number(cursor), q = query.trim().toLocaleLowerCase();
  const matches = registry.items.filter(item => (kind === 'all' || item.kind === kind) && (status === 'all' || item.status === status) && (!input.group || (item.structure?.group?.id||item.category)===input.group) && (!input.token || item.design?.tokenMapping.some(t=>t.path.includes(input.token))) && (!q || [item.id,item.name,item.description,item.category,item.structure?.group?.label,...(item.design?.tokenMapping.map(t=>t.path)||[]),...(item.tags||[])].join(' ').toLocaleLowerCase().includes(q)));
  if (offset > matches.length) invalid('cursor is beyond the result set. Restart with cursor 0 after changing a filter.');
  return {schemaVersion:SITE_METADATA.versions.registrySchema,...systemFields(registry), release:registry.release, total:matches.length, items:matches.slice(offset,offset+limit), nextCursor:offset+limit < matches.length ? String(offset+limit) : null};
}
export function getRegistryItem(registry, input = {}) {
  fields(input, ['kind','id']);
  if (!['component','block'].includes(input.kind) || typeof input.id !== 'string' || !/^[a-z0-9-]{1,90}$/.test(input.id)) invalid('Provide kind (component or block) and a valid catalog id.');
  const item = registry.items.find(item => item.kind === input.kind && item.id === input.id);
  if (!item) throw new RegistryError('NOT_FOUND', `No ${input.kind} named ${input.id}.`);
  return {schemaVersion:SITE_METADATA.versions.registrySchema,...systemFields(registry), release:registry.release, item};
}
export function getContract(registry, input = {}) {
  fields(input, []);
  return {schemaVersion:SITE_METADATA.versions.registrySchema,...systemFields(registry),release:registry.release,metadata:registry.metadata,capabilities:registry.capabilities,counts:registry.counts,policy:registry.policy,links:registry.links};
}
export function getDeliveryPlan(registry, input) {
  const {item}=getRegistryItem(registry,input);
  if(item.status!=='ready'||!item.install?.manifest)throw new RegistryError('SOURCE_UNAVAILABLE','This item has no source bundle.');
  return {schemaVersion:SITE_METADATA.versions.registrySchema,...systemFields(registry),release:registry.release,kind:item.kind,id:item.id,manifest:item.install.manifest,
    commands:{plan:`bun klic.mjs plan ${item.kind} ${item.id}`,add:`bun klic.mjs add ${item.kind} ${item.id} --out ./klic-${item.id}`},
    policy:'Creates a new standalone workspace. Includes shared runtime and source notices. Does not run npm, shell commands, or overwrite existing paths.'};
}
const THEME_PROFILES = ['core','studio','data'];
const THEME_MATERIALS = ['flat','glass','solid-glass','liquid-glass'];
const THEME_MODES = ['system','light','dark'];
function themeQuery(input) {
  fields(input,['query']);
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
  return {cssImport:`import '${directory}/theme.css';`,apply:`import { applyTheme } from '${directory}/apply-theme.mjs';\nconst theme = applyTheme(document.documentElement);`,attributes:{'data-klic-theme':id,'data-color-theme':id,'data-brand-profile':profile,'data-material':material,...(mode==='system'?{}:{'data-theme':mode})},mode:mode==='system'?'Omit data-theme for system mode, or set it to light or dark.':`Use data-theme="${mode}" for explicit ${mode} mode.`,plan:`bun klic.mjs theme plan ${id}`};
}
export function listThemes(registry,input={}) {
  const query=themeQuery(input),catalog=themeCatalog(registry);
  const items=catalog.items.filter(theme=>!query||[theme.id,theme.name,theme.label,theme.description,theme.source?.name].join(' ').toLocaleLowerCase().includes(query));
  return {schemaVersion:SITE_METADATA.versions.themeSchema,...systemFields(registry),release:registry.release,...(catalog.sourceRevision?{sourceRevision:catalog.sourceRevision}:{}),defaultTheme:catalog.defaultTheme,profiles:catalog.profiles,materials:catalog.materials,modes:catalog.modes,items,inventory:catalog.inventory};
}
export function getTheme(registry,input={}) {
  fields(input,['id']);const id=themeId(input),{catalog,theme}=themeItem(registry,id);
  return {schemaVersion:SITE_METADATA.versions.themeSchema,...systemFields(registry),release:registry.release,theme,profiles:catalog.profiles,materials:catalog.materials,modes:catalog.modes,usage:themeUsage(id)};
}
export function getThemeDeliveryPlan(registry,input={}) {
  const {id,profile,material,mode}=themeSelection(input);themeItem(registry,id);
  const options=`${id} --profile ${profile} --material ${material} --mode ${mode}`,apiBasePath=registry.capabilities?.api?.basePath?.replace(/\/$/,'')||API_BASE_PATH;
  return {schemaVersion:SITE_METADATA.versions.themeSchema,...systemFields(registry),release:registry.release,kind:'theme',id,profile,material,mode,manifest:`${apiBasePath}/theme-bundles/${id}/${profile}/${material}/${mode}.json`,commands:{plan:`bun klic.mjs theme plan ${options}`,add:`bun klic.mjs theme add ${options} --out ./klic-theme-${id}`},policy:'Creates a new standalone theme kit folder after integrity verification. Import its CSS and apply it in your app. Does not edit an existing app, run npm or shell commands, or overwrite existing paths.'};
}
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
  {name:'klic_search',title:'Search KLIC library',description:'Search the public KLIC component and block catalog. Defaults to implemented items. This does not install code.',inputSchema:{type:'object',properties:{query:{type:'string',maxLength:200},kind:{type:'string',enum:['all','component','block']},status:{type:'string',enum:['ready','planned','all']},limit:{type:'integer',minimum:1,maximum:100},token:{type:'string',maxLength:200},group:{type:'string',maxLength:100},cursor:{type:'string',pattern:'^\\d{1,7}$'}},additionalProperties:false},annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false}},
  {name:'klic_get_item',title:'Get KLIC item',description:'Read an item with shared designSystem rules, usage, accessibility, density, recovery, token mappings and DESIGN.md export.',inputSchema:{type:'object',properties:{kind:{type:'string',enum:['component','block']},id:{type:'string',pattern:'^[a-z0-9-]{1,90}$'}},required:['kind','id'],additionalProperties:false},annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false}},
  {name:'klic_get_contract',title:'Read KLIC capabilities',description:'Read the versioned designSystem rules, implementation responsibilities, preset boundaries, conflict resolution, integration capabilities and limitations.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false}}
];
TOOL_DEFINITIONS.push(
  {name:'klic_search_motions',title:'Search KLIC motions',description:'Search KLIC-authored motion recipes by Korean or English title, category and usage. Returns previews, reduced-motion guidance and implementation examples.',inputSchema:{type:'object',properties:{query:{type:'string',maxLength:200},category:{type:'string',pattern:'^[a-z0-9-]{1,90}$'},limit:{type:'integer',minimum:1,maximum:100},cursor:{type:'string',pattern:'^\\d{1,7}$'}},additionalProperties:false},annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false}},
  {name:'klic_get_motion',title:'Get KLIC motion',description:'Read one KLIC-authored motion recipe with preview, usage, accessibility and CSS/React implementation details.',inputSchema:{type:'object',properties:{id:{type:'string',pattern:'^[a-z0-9-]{1,90}$'}},required:['id'],additionalProperties:false},annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false}}
);
TOOL_DEFINITIONS.push({name:'klic_get_install_plan',title:'Get KLIC source delivery plan',description:'Return a source bundle manifest and exact CLI commands for a ready item. Does not write files or execute commands.',inputSchema:{type:'object',properties:{kind:{type:'string',enum:['component','block']},id:{type:'string',pattern:'^[a-z0-9-]{1,90}$'}},required:['kind','id'],additionalProperties:false},annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false}});
const themeIdSchema={type:'string',pattern:'^[a-z0-9-]{1,90}$'};
const themeSelectionSchema={type:'object',properties:{id:themeIdSchema,profile:{type:'string',enum:THEME_PROFILES,default:'core'},material:{type:'string',enum:THEME_MATERIALS,default:'flat'},mode:{type:'string',enum:THEME_MODES,default:'system'}},required:['id'],additionalProperties:false};
const themeReadAnnotations={readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false};
TOOL_DEFINITIONS.push(
  {name:'klic_list_themes',title:'List KLIC themes',description:'Read and search the theme catalog, supported profiles, materials and modes. Does not install or write files.',inputSchema:{type:'object',properties:{query:{type:'string',maxLength:200}},additionalProperties:false},annotations:themeReadAnnotations},
  {name:'klic_get_theme',title:'Get KLIC theme',description:'Read a theme with light and dark values and CSS import and application instructions.',inputSchema:{type:'object',properties:{id:themeIdSchema},required:['id'],additionalProperties:false},annotations:themeReadAnnotations},
  {name:'klic_get_theme_install_plan',title:'Get KLIC theme delivery plan',description:'Return a theme kit manifest and exact CLI commands for a selected profile, material and mode. Does not write files or execute commands.',inputSchema:themeSelectionSchema,annotations:themeReadAnnotations}
);
for(const tool of TOOL_DEFINITIONS)if(!tool.description.includes('designSystem'))tool.description+=' Returns the shared designSystem criteria; review implementation responsibilities, preset boundaries and conflict resolution before implementation.';
export function callRegistryTool(registry, name, input = {}) {
  if(name==='klic_search_motions')return {...searchMotions(registry.motions,input),...systemFields(registry)};
  if(name==='klic_get_motion')return {...getMotionRecord(registry.motions,input),...systemFields(registry)};
  if(name==='klic_list_themes')return listThemes(registry,input);
  if(name==='klic_get_theme')return getTheme(registry,input);
  if(name==='klic_get_theme_install_plan')return getThemeDeliveryPlan(registry,input);
  if(name==='klic_get_install_plan')return getDeliveryPlan(registry,input);
  if (name === 'klic_search') return searchRegistry(registry,input);
  if (name === 'klic_get_item') return getRegistryItem(registry,input);
  if (name === 'klic_get_contract') return getContract(registry,input);
  throw new RegistryError('UNKNOWN_TOOL',`Unknown tool: ${name}`);
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
export function createMCPSession() { return {legacyInitialized:false,legacyReady:false}; }
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
  let result;
  if (request.method === 'server/discover') result={supportedVersions:PROTOCOL_VERSIONS,capabilities:{tools:{}},_meta:{'io.modelcontextprotocol/serverInfo':{name:'klic-registry',version:INTEGRATION_VERSION}},ttlMs:60000,cacheScope:'public'};
  else if (request.method === 'initialize') { if(typeof params.protocolVersion!=='string'||!record(params.capabilities)||!record(params.clientInfo))return failure(id,-32602,'Initialize requires protocolVersion, capabilities and clientInfo.');session.legacyInitialized=true;session.legacyReady=false;result={protocolVersion:MCP_LEGACY_PROTOCOL,capabilities:{tools:{}},serverInfo:{name:'klic-registry',version:INTEGRATION_VERSION},instructions:'Read-only KLIC registry. Read klic_get_contract or klic_get_item for designSystem responsibilities, preset boundaries and conflict resolution before implementation. Use klic_search_motions and klic_get_motion for KLIC-authored motion examples, reduced-motion guidance and CSS/React code. Source plans available for components and blocks. No account access or server write operations.'}; }
  else if (request.method === 'ping') result={};
  else if (request.method === 'tools/list') result={tools:TOOL_DEFINITIONS,...(requestedVersion===MCP_MODERN_PROTOCOL?{ttlMs:60000,cacheScope:'public'}:{})};
  else if (request.method === 'tools/call') {
    if(typeof params.name!=='string'||!TOOL_DEFINITIONS.some(tool=>tool.name===params.name)||('arguments' in params&&!record(params.arguments)))return failure(id,-32602,'Unknown tool or invalid call params');
    try { const value=callRegistryTool(registry,params.name,params.arguments??{});result={content:[{type:'text',text:JSON.stringify(value)}],structuredContent:value,isError:false}; }
    catch (error) { const value=errorBody(error);result={content:[{type:'text',text:JSON.stringify(value)}],structuredContent:value,isError:true}; }
    if (requestedVersion===MCP_MODERN_PROTOCOL) result.resultType='complete';
  } else return failure(id,-32601,'Method not found');
  if(modern)result.resultType='complete';
  return {jsonrpc:'2.0',id,result};
}

export const CLI_OPTIONS = Object.freeze({list:['kind','status','limit','cursor','token','group'],search:['kind','status','limit','cursor','token','group'],get:[],source:['variant'],contract:[],plan:[],add:['out','dry-run'],mcp:[],motion:['query','category','limit','cursor'],theme:['query','profile','material','mode','out','dry-run']});
const THEME_CLI_OPTIONS={list:['query'],get:[],plan:['profile','material','mode'],add:['profile','material','mode','out','dry-run']};
export async function runCLI(argv, io = {}) {
  const stdout=io.stdout||process.stdout, stderr=io.stderr||process.stderr;
  const write = value => stdout.write(JSON.stringify(value,null,2)+'\n');
  const args=[...argv], command=args.shift()||'help', positional=[], flags={};
  try {
    for(let i=0;i<args.length;i++) { const arg=args[i];if(arg.startsWith('--')) { const name=arg.slice(2);if(!['base','kind','status','limit','cursor','local','out','dry-run','token','group','query','category','profile','material','mode','variant'].includes(name)) invalid(`Unknown option: ${arg.split('=')[0]}`);if(Object.hasOwn(flags,name))invalid(`Duplicate option: --${name}`);if(name==='local'||name==='dry-run') flags[name]=true;else {if(!args[i+1]||args[i+1].startsWith('--'))invalid(`Missing value for ${arg}`);flags[name]=args[++i];}}else positional.push(arg); }
    if(command==='help'||command==='--help') { stdout.write(`KLIC Toolkit ${INTEGRATION_VERSION} — Bun ${SITE_METADATA.toolchain.bun} preferred; Node.js ${SITE_METADATA.toolchain.nodeMinimum}+ supported for npm/npx consumers\n\nbun klic.mjs list [--kind component|block] [--status ready|planned|all]\nbun klic.mjs search "query" [--limit 20] [--cursor 0] [--token klic.component] [--group actions]\nbun klic.mjs get component button\nbun klic.mjs source block course-catalog\nbun klic.mjs source component button --variant default\nbun klic.mjs contract\nbun klic.mjs plan block course-catalog\nbun klic.mjs add block course-catalog --out ./course-demo [--dry-run]\nbun klic.mjs theme list [--query "paper"]\nbun klic.mjs theme get klic\nbun klic.mjs theme plan klic [--profile core|studio|data] [--material flat|glass|solid-glass|liquid-glass] [--mode system|light|dark]\nbun klic.mjs theme add klic --out ./klic-theme-klic [--profile core] [--material flat] [--mode system] [--dry-run]\nbun klic.mjs mcp\nbun klic.mjs motion list [--query "fade"] [--category entrance]\nbun klic.mjs motion get staggered-reveal\n\n--base HTTPS_ORIGIN   Read a compatible registry (default: KLIC public site).\n--local              Read ./dist/api/v1/registry.json and bundle assets from a source checkout.\nKLIC_API_KEY         Optional environment variable for authorized server access; never pass it as a URL or command argument.\n429                  Stops without retrying; reports the server Retry-After delay.\n\nRead contract first: designSystem contains implementation responsibilities, preset boundaries and conflict resolution. Compare its revision with item.design.system.revision. After add, read DESIGN.md and KLIC-DESIGN-SYSTEM.json; theme kits document the same policy in README.md. Refresh the CLI and local registry and restart stdio sessions after policy updates.\n\nOnly HTTP downloads consume server request quota; offline and in-memory stdio tool calls do not.\nReads public design assets. add creates a new workspace; theme add creates a new theme kit folder. Both verify integrity and refuse overwrite; no shell execution.\n`);return 0; }
    if(!Object.hasOwn(CLI_OPTIONS,command))invalid(`Unknown command: ${command}`);
    for(const name of Object.keys(flags))if(!['local','base',...CLI_OPTIONS[command]].includes(name))invalid(`Option --${name} is not supported by ${command}.`);
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
        themeInput={...(flags.query!==undefined?{query:flags.query}:{})};themeQuery(themeInput);
      }else{
        if(positional.length!==1)invalid(`theme ${themeCommand} requires a theme id.`);
        themeInput={id:positional[0],...Object.fromEntries(['profile','material','mode'].filter(name=>flags[name]!==undefined).map(name=>[name,flags[name]]))};
        if(themeCommand==='get')themeId(themeInput);else themeSelection(themeInput);
      }
      if(themeCommand==='add'&&(typeof flags.out!=='string'||!flags.out.trim()||flags.out.includes('\0')))invalid('theme add requires --out with a new directory.');
    }else if(command==='motion'){
      if(!['list','get'].includes(motionCommand))invalid('motion requires list or get.');
      const motionFlags=motionCommand==='list'?['local','base','query','category','limit','cursor']:['local','base'];
      for(const name of Object.keys(flags))if(!motionFlags.includes(name))invalid(`Option --${name} is not supported by motion ${motionCommand}.`);
      if(motionCommand==='list'){
        if(positional.length)invalid('motion list takes no positional arguments.');
        if(flags.query!==undefined&&(typeof flags.query!=='string'||flags.query.length>200))invalid('query must be a string of at most 200 characters.');
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
      if(motionCommand==='list')write({...searchMotions(catalog,{...(flags.query!==undefined?{query:flags.query}:{}),...(flags.category!==undefined?{category:flags.category}:{}),...(flags.limit!==undefined?{limit:Number(flags.limit)}:{}),...(flags.cursor!==undefined?{cursor:flags.cursor}:{})}),...systemFields(registry)});
      else write({...getMotionRecord(catalog,{id:positional[0]}),...systemFields(registry)});
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
    if(command==='mcp') { if(positional.length)invalid('mcp takes no positional arguments.');const {createInterface}=await import('node:readline');const input=io.stdin||process.stdin,session=createMCPSession();for await(const line of createInterface({input,crlfDelay:Infinity})) {let response;try {if(Buffer.byteLength(line)>1048576)throw new Error('Message too large');response=handleMCPRequest(registry,JSON.parse(line),session);}catch {response={jsonrpc:'2.0',id:null,error:{code:-32700,message:'Parse error'}};}if(response)stdout.write(JSON.stringify(response)+'\n');}return 0; }
    if(command==='list'||command==='search') {if(positional.length>(command==='search'?1:0))invalid('Unexpected positional argument.');write(searchRegistry(registry,{query:command==='search'?(positional[0]||''):'',...(flags.kind?{kind:flags.kind}:{}),...(flags.status?{status:flags.status}:{}),...(flags.limit?{limit:Number(flags.limit)}:{}),...(flags.cursor?{cursor:flags.cursor}:{}),...(flags.token?{token:flags.token}:{}),...(flags.group?{group:flags.group}:{})}));}
    else if(command==='contract') {if(positional.length)invalid('contract takes no arguments.');write(getContract(registry));}
    else {if(positional.length!==2)invalid(`${command} requires kind and id.`);const result=getRegistryItem(registry,{kind:positional[0],id:positional[1]});if(command==='get')write(result);else {const variant=flags.variant!==undefined?result.item.variants?.find(form=>form.id===flags.variant):null;if(flags.variant!==undefined&&!variant)throw new RegistryError('NOT_FOUND','No component form named '+flags.variant+'. Use get to list variants.');const source=variant?variant.source:result.item.source;if(!source?.path)throw new RegistryError('SOURCE_UNAVAILABLE','This planned item has no source export.');if(!/^\/(?:api\/v1\/sources\/|block-sources\/)[a-zA-Z0-9_./-]+$/.test(source.path)||source.path.split('/').includes('..'))throw new RegistryError('INVALID_REGISTRY','Unsafe source reference.');if(flags.local)stdout.write(await fs.readFile('dist'+source.path,'utf8'));else {const response=await fetchRegistryResource(flags.base,source.path,fetcher,requestHeaders);stdout.write(await response.text());}}}
    return 0;
  } catch(error) {stderr.write(JSON.stringify(errorBody(error))+'\n');return 1;}
}
if(typeof process!=='undefined'&&process.versions?.node) {
  const {pathToFileURL}=await import('node:url');
  if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)process.exitCode=await runCLI(process.argv.slice(2));
}
