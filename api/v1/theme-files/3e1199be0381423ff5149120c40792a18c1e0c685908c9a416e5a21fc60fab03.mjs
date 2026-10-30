import {COLOR_THEMES,getColorTheme} from './color-themes.mjs';
// Pure shared material graph and CSS recipes. Effects are composed in CSS, never
// encoded as unsupported DTCG effect literals.
export const MATERIAL_IDS=Object.freeze(['flat','glass','solid-glass','liquid-glass']);
export const MATERIAL_LABELS=Object.freeze({flat:'Flat',glass:'Glass','solid-glass':'Solid Glass','liquid-glass':'Liquid Glass'});
export const normalizeMaterial=value=>MATERIAL_IDS.includes(value)?value:'flat';
const ROLES=['card','chrome','overlay','field','dense','control'];
const PRESETS=Object.freeze({flat:{alpha:1,blur:0,shadow:0,rim:0,y:0,spread:0},glass:{alpha:.72,blur:1,shadow:.10,rim:.36,y:.25,spread:1},'solid-glass':{alpha:.92,blur:.75,shadow:.14,rim:.52,y:.375,spread:1.25},'liquid-glass':{alpha:.64,blur:1.5,shadow:.18,rim:.72,y:.5,spread:1.75}});
const alias=(type,path)=>({$type:type,$value:`{${path}}`});
const dimension=value=>({$type:'dimension',$value:{value,unit:'rem'}});
const color=(hex,alpha=1)=>({$type:'color',$value:{colorSpace:'srgb',components:[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255),alpha}});
const properties=['background','fallback','border','rim','shadow','blur','shadow-y','shadow-blur'];
const dimensions=new Set(['blur','shadow-y','shadow-blur']);
// Always declare both themes and every material, regardless of selected context.
export function appendMaterialTokens(tokens,mode='light',appearance={}){
 const selected=normalizeMaterial(appearance.material);
 for(const material of MATERIAL_IDS)for(const role of ROLES)for(const theme of ['light','dark']){
  const dark=theme==='dark',preset=PRESETS[material],opaque=role==='dense'||material==='flat';
  const base=dark?(role==='chrome'?'#101722':'#172132'):'#ffffff';
  const values={background:color(base,opaque?1:Math.max(preset.alpha,role==='overlay'?.96:role==='field'?.92:0)),fallback:color(base),border:color(dark?'#31425c':'#dfe5ee'),rim:color(dark?'#e8eef8':'#ffffff',opaque?0:preset.rim),shadow:color('#101722',opaque?0:preset.shadow),blur:dimension(opaque?0:preset.blur),'shadow-y':dimension(opaque?0:preset.y),'shadow-blur':dimension(opaque?0:preset.spread)};
  for(const prop of properties)tokens[`klic.primitive.material.${material}.${role}.${theme}.${prop}`]=values[prop];
 }
 // The complete themed surface inventory never depends on selected context.
 const gray={id:'gray',light:{surface:'#fafafa',panel:'#ffffff',line:'#e2e3e6',text:'#202329','control-border':'#6c7080'},dark:{surface:'#17181c',panel:'#202126',line:'#3c3e47',text:'#edf1fa','control-border':'#98a5ba'}};
 for(const palette of [...COLOR_THEMES,gray])for(const material of MATERIAL_IDS)for(const role of ROLES)for(const theme of ['light','dark']){
  const p=palette[theme],preset=PRESETS[material],opaque=role==='dense'||material==='flat',base=role==='chrome'?p.surface:p.panel;
  const values={background:color(base,opaque?1:Math.max(preset.alpha,role==='overlay'?.96:role==='field'?.92:0)),fallback:color(base),border:color(['field','control'].includes(role)?p['control-border']:p.line),rim:color(theme==='dark'?p.text:p.panel,opaque?0:preset.rim)};
  for(const [prop,value] of Object.entries(values))tokens[`klic.primitive.material.theme.${palette.id}.${material}.${role}.${theme}.${prop}`]=value;
 }
 const themeId=appearance.neutral==='gray'?'gray':getColorTheme(appearance.colorTheme).id;
 for(const material of MATERIAL_IDS)for(const role of ROLES)for(const prop of properties){
  const type=dimensions.has(prop)?'dimension':'color',suffix=`material.${material}.${role}.${prop}`;
  tokens[`klic.brand.${suffix}`]=alias(type,['background','fallback','border','rim'].includes(prop)?`klic.primitive.material.theme.${themeId}.${material}.${role}.${mode}.${prop}`:`klic.primitive.material.${material}.${role}.${mode}.${prop}`);
  tokens[`klic.semantic.${suffix}`]=alias(type,`klic.brand.${suffix}`);
 }
 for(const role of ROLES)for(const prop of properties)tokens[`klic.component.surface.${role}.${prop}`]=alias(dimensions.has(prop)?'dimension':'color',`klic.semantic.material.${selected}.${role}.${prop}`);
 tokens['klic.component.interaction.focus.color']=alias('color','klic.semantic.color.focus');
 return tokens;
}
const selector=role=>`[data-klic-surface="${role}"]`;
const stateSafe=selector=>`${selector}:not(:focus-visible):not(:focus-within):not([aria-invalid="true"]):not([aria-selected="true"]):not([data-state="open"]):not([data-state="checked"]):not([data-state="error"])`;
export function materialStylesCSS(){
 const rules=[];
 // Context owns variables only. Flat deliberately contributes no role styling.
 for(const material of MATERIAL_IDS)rules.push(`[data-material="${material}"]{${ROLES.flatMap(role=>properties.map(prop=>`--klic-component-surface-${role}-${prop}:var(--klic-semantic-material-${material}-${role}-${prop});`)).join('')}}`);
 const recipes=[],fallbacks=[],forced=[];
 for(const role of ROLES){
  const target=`:is(${selector(role)},:scope${selector(role)})`,v=prop=>`var(--klic-component-surface-${role}-${prop})`;
  const sensitive=['field','control'].includes(role),state=sensitive?stateSafe(target):target;
  recipes.push(`${target}{background:${v('background')};-webkit-backdrop-filter:blur(${v('blur')});backdrop-filter:blur(${v('blur')});}`);
  recipes.push(`${state}{border-color:${v('border')};box-shadow:inset 0 1px 0 ${v('rim')},0 ${v('shadow-y')} ${v('shadow-blur')} ${v('shadow')};}`);
  fallbacks.push(`${target}{background:${v('fallback')};-webkit-backdrop-filter:none;backdrop-filter:none;}${state}{box-shadow:none;}`);
  forced.push(`${target}{background:Canvas;color:CanvasText;-webkit-backdrop-filter:none;backdrop-filter:none;}${state}{border-color:CanvasText;box-shadow:none;}`);
 }
 // Native scope boundaries stop an outer material from styling a nested preview.
 // Browsers without @scope retain their original, opaque component appearance.
 for(const material of MATERIAL_IDS.filter(id=>id!=='flat'))rules.push(`@scope ([data-material="${material}"]) to ([data-material]){${recipes.join('\n')}@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){${fallbacks.join('\n')}}@media (prefers-reduced-transparency: reduce){${fallbacks.join('\n')}}@media (forced-colors: active){${forced.join('\n')}}}`);
 return rules.join('\n');
}
