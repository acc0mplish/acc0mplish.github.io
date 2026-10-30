import {FONT_FILES,fontFaceCSS} from './font-registry.mjs';
import {COLOR_THEMES,COLOR_THEME_IDS,DEFAULT_COLOR_THEME_ID} from './color-themes.mjs';
import {BRAND_PROFILES,BRAND_PROFILE_IDS} from './brand-profiles.mjs';
import {MATERIAL_IDS,materialStylesCSS} from './materials.mjs';
import {createTokens} from './tokens.mjs';
import {getThemeContext,pruneThemeTokens} from './theme-runtime.mjs';
import {SITE_METADATA} from './site-metadata.mjs';

const MODES=Object.freeze(['system','light','dark']);
const json=value=>JSON.stringify(value,null,2)+'\n';
const escapeHTML=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function tokenInventory(tokens){
 const paths=Object.keys(tokens);
 const counts=Object.fromEntries(['primitive','brand','semantic','component'].map(layer=>[layer,paths.filter(path=>path.startsWith(`klic.${layer}.`)).length]));
 return {total:paths.length,...counts,material:paths.filter(path=>path.startsWith('klic.primitive.material.')).length,materialTotal:paths.filter(path=>path.includes('.material.')||path.startsWith('klic.component.surface.')).length};
}

/** Metadata retains the complete inventory; portable token files retain selected dependencies. */
export function createThemeCatalog(){
 return {
  schemaVersion:SITE_METADATA.versions.themeSchema,defaultTheme:DEFAULT_COLOR_THEME_ID,
  profiles:BRAND_PROFILES.map(({id,name})=>({id,name})),
  materials:[...MATERIAL_IDS],modes:[...MODES],
  items:COLOR_THEMES.map(({id,name,label,description,source,light,dark,series})=>structuredClone({id,name,label,description,source,light,dark,series})),
  inventory:tokenInventory(createTokens())
 };
}

function validateOptions(options){
 if(!options||typeof options!=='object'||Array.isArray(options)||![Object.prototype,null].includes(Object.getPrototypeOf(options)))throw new Error('Theme package options must be a plain object');
 for(const field of Object.keys(options))if(!['id','profile','material','mode'].includes(field))throw new Error(`Unknown theme option: ${field}`);
 const {id,profile='core',material='flat',mode='system'}=options;
 for(const [field,value,allowed] of [['id',id,COLOR_THEME_IDS],['profile',profile,BRAND_PROFILE_IDS],['material',material,MATERIAL_IDS],['mode',mode,MODES]]){
  if(typeof value!=='string'||!allowed.includes(value))throw new Error(`Invalid theme ${field}: ${String(value)}. Expected ${allowed.join(', ')}`);
 }
 return {id,profile,material,mode};
}

const fontCSS=fontFaceCSS();

const helperCSS=`/* Optional helpers: add these classes to your own markup. */
.klic-theme{color:var(--klic-component-block-color-text);background:var(--klic-component-block-color-surface);font-family:var(--klic-ui-font);font-size:var(--klic-component-text-body-font-size);line-height:1.5;}
.klic-theme-heading{font-family:var(--klic-heading-font);font-weight:var(--klic-component-heading-font-weight);line-height:1.2;}
.klic-theme-muted{color:var(--klic-component-block-color-muted);}
.klic-theme-card{padding:var(--klic-component-card-spacing-default);border:1px solid var(--klic-component-block-color-border);border-radius:var(--klic-component-card-radius-default);background:var(--klic-component-block-color-panel);}
.klic-theme-button{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;min-height:var(--klic-component-button-size-default-height);padding:.5rem 1rem;border:1px solid transparent;border-radius:var(--klic-component-card-radius-default);background:var(--klic-component-button-background-default);color:var(--klic-component-block-color-on-accent);font:inherit;font-weight:600;cursor:pointer;}
.klic-theme-button:hover{background:var(--klic-component-button-background-hover);}
.klic-theme-button:active{background:var(--klic-component-button-background-active);}
.klic-theme-button:focus-visible,.klic-theme-input:focus-visible{outline:3px solid var(--klic-component-interaction-focus-color);outline-offset:3px;}
.klic-theme-input{box-sizing:border-box;min-height:var(--klic-component-input-size-default-height);max-width:100%;padding:.5rem .75rem;border:1px solid var(--klic-component-input-border-default);border-radius:var(--klic-component-card-radius-default);background:var(--klic-component-block-color-panel);color:var(--klic-component-block-color-text);font:inherit;}`;

function themeCSS(config,light,dark){
 const selector=`[data-klic-theme="${config.id}"][data-brand-profile="${config.profile}"]`;
 const declarations=context=>Object.entries(context.cssVariables).map(([name,value])=>`  ${name}: ${value};`).join('\n')+`\n  color-scheme: ${context.mode};`;
 return `${fontCSS}\n\n/* Complete resolved variables at each boundary support nested light/dark themes. */\n${selector}:not([data-theme]),\n${selector}[data-theme="light"]{\n${declarations(light)}\n}\n${selector}[data-theme="dark"]{\n${declarations(dark)}\n}\n@media (prefers-color-scheme: dark){\n${selector}:not([data-theme]){\n${declarations(dark)}\n}\n}\n\n/* Material recipes */\n${materialStylesCSS()}\n\n${helperCSS}\n`;
}

function applyModule(config){
 return `import {applyTheme as applyRuntimeTheme,getThemeContext as resolveContext} from './engine/theme-runtime.mjs';\n\nexport const themeConfig=Object.freeze(${JSON.stringify(config,null,2)});\nconst defaults=${JSON.stringify({colorTheme:config.id,brandProfile:config.profile,material:config.material,theme:config.mode})};\nexport function getThemeContext(preferences={},prefersDark=false){return resolveContext({...defaults,...preferences},prefersDark);}\nexport function applyTheme(element,preferences={},environment={}){return applyRuntimeTheme(element,{...defaults,...preferences},environment);}\n`;
}

function readme(config,theme){
 return `# ${theme.name} theme kit\n\nSelected profile: ${config.profile}. Material: ${config.material}. Mode: ${config.mode}.\n\n## Use in a website\n\nServe this folder with your existing static server and open index.html for the working example. Include theme.css, then apply the theme to the document or a nested element:\n\n\`\`\`html\n<link rel="stylesheet" href="./theme.css">\n<script type="module">\n  import {applyTheme} from './apply-theme.mjs';\n  const theme = applyTheme(document.documentElement);\n  theme.update({mode:'dark'});\n  theme.update({material:'glass'});\n  // Call theme.destroy() when the boundary is removed to clean up its OS listener.\n</script>\n\`\`\`\n\nThe module uses native ES modules and CSS custom properties. It has no package installation, framework, icon, chart, server API, or network dependency. getThemeContext(preferences, prefersDark) resolves a context without a DOM. Preferences accept colorTheme / brandProfile / theme and the convenient id / profile / mode aliases.\n\nFor CSS only, set data-klic-theme="${config.id}", data-brand-profile="${config.profile}", and data-material="${config.material}" on a boundary. Set data-theme="light" or "dark" for an explicit mode; omit data-theme for the operating system preference. Runtime application writes the actual resolved light/dark value to data-theme while keeping system in controller.context.preferences.theme.\n\nUse the optional klic-theme, klic-theme-card, klic-theme-heading, klic-theme-muted, klic-theme-button, and klic-theme-input classes. Existing application buttons and inputs are styled only when you add a helper class. Add data-klic-surface="card", "chrome", "overlay", "field", "dense", or "control" to opt into material effects. All four materials remain available through data-material or theme.update(). Native CSS @scope prevents effects from crossing nested material boundaries; unsupported browsers keep the base opaque surface. Reduced transparency, forced colors, and browsers without backdrop filters receive readable fallbacks.\n\nEach CSS file contains this palette/profile in light and dark. Nested boundaries get their own complete resolved color variables. For CSS-only manual boundaries using another palette/profile, include its generated theme.css as well. The JavaScript runtime already includes the canonical palette/profile engine, so theme.update({id:'paper',profile:'data'}) resolves another selection without an additional stylesheet. Keep semantic.material variables at the boundary: component.surface aliases are intentionally owned by the material selector so material switching remains live.\n\n## Token graph\n\ntokens.light.json and tokens.dark.json contain flat, typed DTCG leaves with the original klic paths. Every Component token and every Semantic material token is retained together with its transitive alias dependencies. Unused Primitive inventory is excluded from delivery; the canonical graph remains complete in the engine. theme.config.json records both the full inventory counts and the smaller exported counts. Aliases still traverse Component → Semantic → Brand → Primitive.\n\nKLIC action, selected navigation, focus, and successful results remain blue. Palette secondary colors support classification; warning stays amber and danger stays red.\n\n## Fonts\n\nAll ${FONT_FILES.length} registered font files are included locally. CSS declares only the weights present in each bundled file; the browser may synthesize a requested weight when no matching file is bundled. See fonts/FONT-NOTICES.md for per-file sources, license notices and checksums.\n`;
}

function demo(config,theme){
 const explicitMode=config.mode==='system'?'':` data-theme="${config.mode}"`;
 return `<!doctype html>
<html lang="en" data-klic-theme="${config.id}" data-brand-profile="${config.profile}" data-material="${config.material}"${explicitMode}>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>${escapeHTML(theme.name)} · KLIC Theme Kit</title><link rel="stylesheet" href="./theme.css"><style>
body{margin:0;min-height:100vh;}main{box-sizing:border-box;width:min(64rem,100%);margin:auto;padding:clamp(1.5rem,5vw,4rem);}header{display:flex;gap:2rem;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;margin-bottom:2rem;}h1{font-size:clamp(2rem,5vw,3rem);margin:.4rem 0;}h2{margin:0 0 .5rem;font-size:1.25rem;}p{margin:.5rem 0 1rem;}label{display:grid;gap:.4rem;font-size:.875rem;}.demo-controls{display:flex;gap:1rem;flex-wrap:wrap;}.demo-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(16rem,100%),1fr));gap:1.25rem;}.demo-card{display:grid;gap:.75rem;}.demo-number{font-size:2.5rem;font-weight:600;line-height:1.2;}.demo-status{display:inline-flex;gap:.4rem;align-items:center;color:var(--klic-component-block-color-success);font-size:.875rem;}.demo-footer{margin-top:2rem;font-size:.875rem;}#theme-status{min-height:1.5em;}
</style></head>
<body class="klic-theme"><main><header><div><span class="klic-theme-muted">KLIC / PORTABLE THEME KIT</span><h1 class="klic-theme-heading">${escapeHTML(theme.name)}</h1><p class="klic-theme-muted">A native CSS and JavaScript theme for your next interface.</p></div><div class="demo-controls"><label>Mode<select id="mode" class="klic-theme-input">${MODES.map(mode=>`<option value="${mode}"${mode===config.mode?' selected':''}>${mode==='system'?'System':mode==='light'?'Light':'Dark'}</option>`).join('')}</select></label><label>Material<select id="material" class="klic-theme-input">${MATERIAL_IDS.map(material=>`<option value="${material}"${material===config.material?' selected':''}>${material}</option>`).join('')}</select></label></div></header>
<section class="demo-grid" aria-label="Theme examples"><article class="klic-theme-card demo-card" data-klic-surface="card"><span class="klic-theme-muted">Workspace activity</span><strong class="demo-number">1,284</strong><span class="demo-status">&#10003; All updates complete</span><p class="klic-theme-muted">Blue keeps actions and successful results consistent across palettes.</p><button type="button" class="klic-theme-button" id="action">Create a project</button></article><article class="klic-theme-card demo-card" data-klic-surface="card"><h2 class="klic-theme-heading">Ready for your product</h2><p class="klic-theme-muted">Keep your own markup. Add theme variables and opt into surface roles where you need them.</p><label>Project name<input class="klic-theme-input" data-klic-surface="field" placeholder="My workspace" value="Product workspace"></label><p id="theme-status" class="klic-theme-muted" role="status" aria-live="polite"></p></article></section><p class="demo-footer klic-theme-muted">${escapeHTML(config.profile)} profile · Local fonts · Typed token graph · No framework required</p>
</main><script type="module">
import {applyTheme} from './apply-theme.mjs';
const theme=applyTheme(document.documentElement);
const mode=document.querySelector('#mode'),material=document.querySelector('#material'),status=document.querySelector('#theme-status');
mode.addEventListener('change',()=>theme.update({mode:mode.value}));
material.addEventListener('change',()=>theme.update({material:material.value}));
document.querySelector('#action').addEventListener('click',()=>{status.textContent='Project created. Your theme is ready to use.';});
window.addEventListener('pagehide',event=>{if(!event.persisted)theme.destroy();});
</script></body></html>\n`;
}

export function createThemePackageFiles(options){
 const selected=validateOptions(options),theme=COLOR_THEMES.find(item=>item.id===selected.id);
 const light=getThemeContext({...selected,mode:'light'}),dark=getThemeContext({...selected,mode:'dark'});
 const lightTokens=pruneThemeTokens(light.tokens),darkTokens=pruneThemeTokens(dark.tokens);
  const config={schemaVersion:SITE_METADATA.versions.themeSchema,...selected,preferences:getThemeContext(selected).preferences,inventory:tokenInventory(light.tokens),exported:{light:tokenInventory(light.tokens),dark:tokenInventory(darkTokens)}};
 return [
  {path:'theme.css',content:themeCSS(selected,light,dark)},
  {path:'tokens.light.json',content:json(lightTokens)},
  {path:'tokens.dark.json',content:json(darkTokens)},
  {path:'theme.config.json',content:json(config)},
  {path:'apply-theme.mjs',content:applyModule(selected)},
  {path:'README.md',content:readme(selected,theme)},
  {path:'index.html',content:demo(selected,theme)}
 ];
}
