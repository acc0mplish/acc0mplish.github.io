import {FONT_IDS,FONT_NAMES} from './font-registry.mjs';
import {COLOR_THEMES,getColorTheme} from './color-themes.mjs';
import {appendMaterialTokens} from './materials.mjs';
import {BRAND_PROFILES,getBrandProfile} from './brand-profiles.mjs';
// A bounded, typed KLIC token graph. The a/b argument retains the original control-height regression fixture.
const dim = value => ({$type:'dimension',$value:{value,unit:'rem'}});
const alias = (type,path) => ({$type:type,$value:`{${path}}`});
const color = hex => ({$type:'color',$value:{colorSpace:'srgb',components:[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255),alpha:1}});
export function createTokens(brand='a',mode='light',appearance={}) {
  if(!['a','b'].includes(brand)) throw new Error(`Unknown brand: ${brand}`);
  if(!['light','dark'].includes(mode)) throw new Error(`Unknown mode: ${mode}`);
  const t={};
  for(const [step,value] of Object.entries({'1':.25,'1-5':.375,'2':.5,'3':.75,'4':1,'6':1.5,'7':1.75,'8':2,'9':2.25,'10':2.5,'12':3})) t[`klic.primitive.dimension.step.${step}`]=dim(value);
  for(const [name,value] of Object.entries({'paper':'#fbfcfe','white':'#ffffff','ink':'#132c46','muted':'#52657b','line':'#dfe5ee','neutral-050':'#f5f7fb','control-border':'#7e8fa7','blue-050':'#eaf0fb','blue-100':'#d8e5fb','blue-600':'#245fc2','blue-700':'#1c4fa4','blue-800':'#163e80','blue-royal':'#2641b9','warning-050':'#fff4dd','warning-800':'#835600','danger-050':'#fff0f0','danger-700':'#b13c43','night':'#101722','night-panel':'#172132','night-soft':'#1d2b40','night-ink':'#e8eef8','night-muted':'#a8b6cc','night-line':'#31425c','night-border':'#7185a1','night-accent':'#91b6ff','night-accent-hover':'#afcbff','night-accent-active':'#719def','night-selection':'#20365c','night-warning':'#f1cc87','night-warning-surface':'#332b1d','night-danger':'#ffa4aa','night-danger-surface':'#38252b'})) t[`klic.primitive.color.${name}`]=color(value);
  const dimensions={'dimension.control.height.md':brand==='a'?'8':'9','dimension.control.height.sm':'7','dimension.control.height.lg':'9','spacing.md':'4','spacing.sm':'2','icon.size.md':'4','radius.md':'2','typography.scale.body.font-size':'4','typography.scale.label.font-size':'3'};
  for(const [name,step] of Object.entries(dimensions)) t[`klic.brand.${name}`]=alias('dimension',`klic.primitive.dimension.step.${step}`);
  const colors={'accent':mode==='dark'?'night-accent':'blue-600','accent-hover':mode==='dark'?'night-accent-hover':'blue-700','accent-active':mode==='dark'?'night-accent-active':'blue-800','surface':mode==='dark'?'night':'paper','panel':mode==='dark'?'night-panel':'white','text':mode==='dark'?'night-ink':'ink','muted':mode==='dark'?'night-muted':'muted','border':mode==='dark'?'night-line':'line','surface-soft':mode==='dark'?'night-soft':'neutral-050','surface-selected':mode==='dark'?'night-selection':'blue-050','control-border':mode==='dark'?'night-border':'control-border','focus':mode==='dark'?'night-accent':'blue-600','on-accent':mode==='dark'?'ink':'white','success':mode==='dark'?'night-accent':'blue-700','success-surface':mode==='dark'?'night-selection':'blue-050','warning':mode==='dark'?'night-warning':'warning-800','warning-surface':mode==='dark'?'night-warning-surface':'warning-050','danger':mode==='dark'?'night-danger':'danger-700','danger-surface':mode==='dark'?'night-danger-surface':'danger-050'};
  for(const [name,ref] of Object.entries(colors))t[`klic.brand.color.${name}`]=alias('color',`klic.primitive.color.${ref}`);
  const semantic={'size.action.default':'dimension.control.height.md','size.input.default':'dimension.control.height.md','size.action.sm':'dimension.control.height.sm','size.action.lg':'dimension.control.height.lg','space.container.default':'spacing.md','space.field.internal':'spacing.sm','size.icon.default':'icon.size.md','radius.container.default':'radius.md','typography.body.font-size':'typography.scale.body.font-size','typography.label.font-size':'typography.scale.label.font-size'};
  for(const [name,ref] of Object.entries(semantic))t[`klic.semantic.${name}`]=alias('dimension',`klic.brand.${ref}`);
  for(const name of Object.keys(colors))t[`klic.semantic.color.${name}`]=alias('color',`klic.brand.color.${name}`);
  const component={'button.size.default.height':'size.action.default','button.size.sm.height':'size.action.sm','button.size.lg.height':'size.action.lg','input.size.default.height':'size.input.default','card.radius.default':'radius.container.default','card.spacing.default':'space.container.default','field.spacing.internal':'space.field.internal','button.icon.size':'size.icon.default','text.body.font-size':'typography.body.font-size'};
  for(const [name,ref] of Object.entries(component))t[`klic.component.${name}`]=alias('dimension',`klic.semantic.${ref}`);
  for(const [name,ref] of Object.entries({'button.background.default':'accent','button.background.hover':'accent-hover','button.background.active':'accent-active','input.border.default':'control-border','card.background.default':'panel'}))t[`klic.component.${name}`]=alias('color',`klic.semantic.color.${ref}`);
  // Additive block inventory. Content width and section spacing are independent
  // Brand choices; existing control, padding, radius, icon and type roles are shared.
  t['klic.primitive.dimension.content.width.wide']=dim(80);
  t['klic.brand.dimension.content.width.wide']=alias('dimension','klic.primitive.dimension.content.width.wide');
  t['klic.brand.spacing.section']=alias('dimension','klic.primitive.dimension.step.6');
  t['klic.semantic.size.layout.content.max']=alias('dimension','klic.brand.dimension.content.width.wide');
  t['klic.semantic.space.layout.section']=alias('dimension','klic.brand.spacing.section');
  const blockDimensions={
    'content.max-width':'size.layout.content.max',
    'section.gap':'space.layout.section',
    'container.padding':'space.container.default',
    'control.height':'size.action.default',
    'surface.radius':'radius.container.default',
    'icon.size':'size.icon.default',
    'typography.body.font-size':'typography.body.font-size',
    'typography.label.font-size':'typography.label.font-size'
  };
  for(const [name,ref] of Object.entries(blockDimensions))t[`klic.component.block.${name}`]=alias('dimension',`klic.semantic.${ref}`);
  for(const [size,value] of Object.entries({default:32,wide:44})){
    t[`klic.primitive.dimension.panel.width.${size}`]=dim(value);
    t[`klic.brand.dimension.panel.width.${size}`]=alias('dimension',`klic.primitive.dimension.panel.width.${size}`);
    t[`klic.semantic.size.panel.width.${size}`]=alias('dimension',`klic.brand.dimension.panel.width.${size}`);
    t[`klic.component.block.right-panel.width.${size}`]=alias('dimension',`klic.semantic.size.panel.width.${size}`);
  }
  const blockColors={surface:'surface',panel:'panel',soft:'surface-soft',selected:'surface-selected',text:'text',muted:'muted',border:'border','control-border':'control-border',accent:'accent','accent-hover':'accent-hover','on-accent':'on-accent',success:'success','success-surface':'success-surface',warning:'warning','warning-surface':'warning-surface',danger:'danger','danger-surface':'danger-surface'};
  for(const [name,ref] of Object.entries(blockColors))t[`klic.component.block.color.${name}`]=alias('color',`klic.semantic.color.${ref}`);
  // Declare the complete supported inventory before selecting Brand aliases.
  // A profile or user setting never redefines an existing Primitive path.
  const accents={klic:['#245fc2','#1c4fa4','#163e80','#91b6ff'],royal:['#2641b9','#20379b','#192c7c','#a9b6ff'],navy:['#1e4c8a','#183e71','#13325b','#9abce9']};
  const accentRoles=mode==='dark'?['accent']:['accent','accent-hover','accent-active'];
  for(const [name,values] of Object.entries(accents))values.forEach((value,i)=>t[`klic.primitive.color.palette.${name}.${['accent','hover','active','night'][i]}`]=color(value));
  const accentKey=Object.hasOwn(accents,appearance.accent)?appearance.accent:'klic';
  accentRoles.forEach((role,i)=>t[`klic.brand.color.${role}`]=alias('color',`klic.primitive.color.palette.${accentKey}.${mode==='dark'?'night':['accent','hover','active'][i]}`));
  t['klic.brand.color.focus']=alias('color',`klic.primitive.color.palette.${accentKey}.${mode==='dark'?'night':'accent'}`);
  t['klic.brand.color.success']=alias('color',`klic.primitive.color.palette.${accentKey}.${mode==='dark'?'night':'hover'}`);
  const gray={'paper':'#fafafa','ink':'#202329','muted':'#60636b','line':'#e2e3e6','neutral-050':'#f3f4f6','night':'#17181c','night-panel':'#202126','night-soft':'#292b32','night-line':'#3c3e47','night-muted':'#b1b3bd'};
  for(const [key,value] of Object.entries(gray))t[`klic.primitive.color.neutral.gray.${key}`]=color(value);
  for(let width=880;width<=1600;width+=20)t[`klic.primitive.dimension.custom.content-width.${width}`]=dim(width/16);
  for(let radius=0;radius<=24;radius++)t[`klic.primitive.dimension.custom.radius.${radius}`]=dim(radius/16);
  for(let scale=90;scale<=150;scale++){
    t[`klic.primitive.dimension.custom.type-body.${scale}`]=dim(scale/100);
    t[`klic.primitive.dimension.custom.type-label.${scale}`]=dim(.75*scale/100);
  }
  for(const [density,n] of Object.entries({compact:.875,normal:1,relaxed:1.25})){
    t[`klic.primitive.dimension.custom.control-a.${density}`]=dim(2*n);
    t[`klic.primitive.dimension.custom.control-b.${density}`]=dim(2.25*n);
    t[`klic.primitive.dimension.custom.spacing.${density}`]=dim(n);
  }
  if(Number.isFinite(appearance.contentWidth)&&appearance.contentWidth>=880&&appearance.contentWidth<=1600)t['klic.brand.dimension.content.width.wide']=alias('dimension',`klic.primitive.dimension.custom.content-width.${880+Math.round((appearance.contentWidth-880)/20)*20}`);
  if(Number.isFinite(appearance.radius)&&appearance.radius>=0&&appearance.radius<=24)t['klic.brand.radius.md']=alias('dimension',`klic.primitive.dimension.custom.radius.${Math.round(appearance.radius)}`);
  if(['compact','normal','relaxed'].includes(appearance.density)){
    t['klic.brand.dimension.control.height.md']=alias('dimension',`klic.primitive.dimension.custom.control-${brand}.${appearance.density}`);
    t['klic.brand.spacing.md']=alias('dimension',`klic.primitive.dimension.custom.spacing.${appearance.density}`);
  }
  if(Number.isFinite(appearance.textScale)&&appearance.textScale>=90&&appearance.textScale<=150){
    t['klic.brand.typography.scale.body.font-size']=alias('dimension',`klic.primitive.dimension.custom.type-body.${Math.round(appearance.textScale)}`);
    t['klic.brand.typography.scale.label.font-size']=alias('dimension',`klic.primitive.dimension.custom.type-label.${Math.round(appearance.textScale)}`);
  }
  const chartPalettes={blue:['#245fc2','#5b82cc','#163e80','#9bb4df','#496388','#c0cee4'],violet:['#245fc2','#7960b7','#173f80','#ab91d0','#526b98','#c4b5de'],contrast:['#183d73','#7b91b4','#2c60ab','#aabbd2','#4c6b94','#d3dce9']};
  for(const [name,values] of Object.entries(chartPalettes))values.forEach((value,i)=>t[`klic.primitive.color.chart.${name}.series-${i+1}`]=color(value));
  const chartKey=Object.hasOwn(chartPalettes,appearance.chartPalette)?appearance.chartPalette:'blue';
  chartPalettes[chartKey].forEach((value,i)=>{
    const key=`series-${i+1}`;
    t[`klic.brand.chart.${key}`]=alias('color',`klic.primitive.color.chart.${chartKey}.${key}`);
    t[`klic.semantic.chart.${key}`]=alias('color',`klic.brand.chart.${key}`);
    t[`klic.component.block.chart.${key}`]=alias('color',`klic.semantic.chart.${key}`);
  });
  // Brand identity owns a coherent selection: navigation, wordmark and typography.
  // All profile primitives are declared together; selecting a profile changes aliases.
  t['klic.primitive.color.identity.night-royal']=color('#a9b8ff');
  for(const profile of BRAND_PROFILES){
    t[`klic.primitive.dimension.identity.${profile.id}.title`]=dim(profile.titleSize);
    t[`klic.primitive.dimension.identity.${profile.id}.section`]=dim(profile.sectionSize);
  }
  for(const [key,value] of Object.entries(FONT_NAMES))t[`klic.primitive.font-family.${key}`]={$type:'fontFamily',$value:value};
  t['klic.primitive.font-weight.semibold']={$type:'fontWeight',$value:600};
  const identity=getBrandProfile(appearance.brandProfile),bodyFont=FONT_IDS.includes(appearance.font)?appearance.font:'paperlogy',headingFont=FONT_IDS.includes(appearance.headingFont)?appearance.headingFont:bodyFont;
  const identityRoles=[
    ['color','color.identity','color.identity','wordmark.color',mode==='dark'?'klic.primitive.color.identity.night-royal':'klic.primitive.color.blue-royal'],
    ['color','color.navigation','color.navigation','navigation.color.selected',mode==='dark'?'klic.primitive.color.identity.night-royal':'klic.primitive.color.blue-royal'],
    ['dimension','typography.scale.title.font-size','typography.title.font-size','heading.title.font-size',`klic.primitive.dimension.identity.${identity.id}.title`],
    ['dimension','typography.scale.section.font-size','typography.section.font-size','heading.section.font-size',`klic.primitive.dimension.identity.${identity.id}.section`],
    ['fontFamily','typography.family.body','typography.body.font-family','text.body.font-family',`klic.primitive.font-family.${bodyFont}`],
    ['fontFamily','typography.family.heading','typography.heading.font-family','heading.font-family',`klic.primitive.font-family.${headingFont}`],
    ['fontWeight','typography.weight.heading','typography.heading.font-weight','heading.font-weight','klic.primitive.font-weight.semibold']
  ];
  for(const [type,brandRole,semanticRole,componentRole,primitive] of identityRoles){
    t[`klic.brand.${brandRole}`]=alias(type,primitive);
    t[`klic.semantic.${semanticRole}`]=alias(type,`klic.brand.${brandRole}`);
    t[`klic.component.${componentRole}`]=alias(type,`klic.semantic.${semanticRole}`);
  }
  // Showcase roles retain their four-layer paths; context selects their color aliases below.
  for(const [role,hex] of Object.entries({ink:'#142b49',muted:'#687b92',accent:'#245fc2',canvas:'#ffffff',surface:'#f4f7fb',border:'#dce5f1',night:'#152b47'})){
    t[`klic.primitive.color.showcase.${role}`]=color(hex);
    t[`klic.brand.color.showcase.${role}`]=alias('color',`klic.primitive.color.showcase.${role}`);
    t[`klic.semantic.color.showcase.${role}`]=alias('color',`klic.brand.color.showcase.${role}`);
    t[`klic.component.showcase.color.${role}`]=alias('color',`klic.semantic.color.showcase.${role}`);
  }
  // Every theme is part of the immutable inventory; context only selects aliases.
  for(const theme of COLOR_THEMES)for(const themeMode of ['light','dark']){
    for(const [role,hex] of Object.entries(theme[themeMode]))t[`klic.primitive.color.theme.${theme.id}.${themeMode}.${role}`]=color(hex);
    theme.series[themeMode].forEach((hex,i)=>t[`klic.primitive.color.theme.${theme.id}.${themeMode}.series-${i+1}`]=color(hex));
  }
  const theme=getColorTheme(appearance.colorTheme);
  const themeRoles={surface:'surface',panel:'panel','surface-soft':'soft',text:'text',muted:'muted',border:'line','control-border':'control-border','surface-selected':'selected',secondary:'secondary','on-secondary':'on-secondary','secondary-surface':'secondary-surface'};
  for(const [role,source] of Object.entries(themeRoles)){
    t[`klic.brand.color.${role}`]=alias('color',`klic.primitive.color.theme.${theme.id}.${mode}.${source}`);
    t[`klic.semantic.color.${role}`]=alias('color',`klic.brand.color.${role}`);
    t[`klic.component.block.color.${role==='surface-soft'?'soft':role==='surface-selected'?'selected':role}`]=alias('color',`klic.semantic.color.${role}`);
  }
  if(appearance.neutral==='gray')for(const [role,key] of Object.entries(colors))if(Object.hasOwn(gray,key))t[`klic.brand.color.${role}`]=alias('color',`klic.primitive.color.neutral.gray.${key}`);
  if(!Object.hasOwn(chartPalettes,appearance.chartPalette))for(let i=1;i<=6;i++)t[`klic.brand.chart.series-${i}`]=alias('color',`klic.primitive.color.theme.${theme.id}.${mode}.series-${i}`);
  // Reuse the selected primitive references, including explicit neutral/accent overrides.
  for(const [role,source] of Object.entries({ink:'text',muted:'muted',canvas:'surface',surface:'surface-soft',border:'border',accent:'accent'}))t[`klic.brand.color.showcase.${role}`]=alias('color',t[`klic.brand.color.${source}`].$value.slice(1,-1));
  // Paired artwork uses a dark canvas in both modes, with its own light foreground.
  t['klic.brand.color.showcase.night']=alias('color',`klic.primitive.color.theme.${theme.id}.light.text`);
  return appendMaterialTokens(t,mode,appearance);
}
export function resolveTokens(tokens) {
  const result={},visiting=new Set(),layers=['primitive','brand','semantic','component'],names=new Set();
  for(const p of Object.keys(tokens)){
    if(!/^klic\.(primitive|brand|semantic|component)\.[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(p))throw new Error(`Invalid path: ${p}`);
    const css=p.replaceAll('.','-');if(names.has(css))throw new Error(`CSS name collision: ${p}`);names.add(css);
    const parts=p.split('.');for(let i=1;i<parts.length;i++)if(Object.hasOwn(tokens,parts.slice(0,i).join('.')))throw new Error(`Group/leaf collision: ${p}`);
  }
  function resolve(path){
    if(path in result)return result[path];
    if(visiting.has(path))throw new Error(`Cycle: ${path}`);
    const token=tokens[path];if(!token||typeof token!=='object'||Array.isArray(token)||!Object.hasOwn(token,'$value'))throw new Error(`Missing token leaf: ${path}`);
    for(const key of Object.keys(token))if(!['$type','$value','$description','$extensions','$deprecated'].includes(key))throw new Error(`Unsupported token property ${key}: ${path}`);
    visiting.add(path);
    let value=token.$value;
    const isAlias=typeof value==='string'&&value.startsWith('{');
    if(path.split('.')[1]!=='primitive'&&!isAlias)throw new Error(`Alias required outside Primitive: ${path}`);
    if(path.split('.')[1]==='primitive'&&isAlias)throw new Error(`Primitive reference direction: ${path}`);
    if(typeof value==='string'&&value.startsWith('{')){
      if(!/^\{[a-z0-9.-]+\}$/.test(value))throw new Error(`Invalid alias: ${path}`);
      const target=value.slice(1,-1);value=resolve(target);
      if(layers.indexOf(path.split('.')[1])-layers.indexOf(target.split('.')[1])!==1)throw new Error(`Reference direction: ${path} → ${target}`);
      if(tokens[target].$type!==token.$type)throw new Error(`Type mismatch: ${path}`);
    }
    if(token.$type==='dimension'&&(!value||!Number.isFinite(value.value)||value.unit!=='rem'))throw new Error(`Invalid dimension: ${path}`);
    if(token.$type==='color'&&(!value||value.colorSpace!=='srgb'||!Array.isArray(value.components)||value.components.length!==3||Array.from(value.components).some(v=>!Number.isFinite(v)||v<0||v>1)||(value.alpha!==undefined&&(!Number.isFinite(value.alpha)||value.alpha<0||value.alpha>1))))throw new Error(`Invalid color: ${path}`);
    if(token.$type==='fontFamily'&&(typeof value!=='string'||!Object.values(FONT_NAMES).includes(value)))throw new Error(`Invalid font family: ${path}`);
    if(token.$type==='fontWeight'&&(!Number.isInteger(value)||value<100||value>900))throw new Error(`Invalid font weight: ${path}`);
    if(!['dimension','color','fontFamily','fontWeight'].includes(token.$type))throw new Error(`Unsupported token type: ${path}`);
    visiting.delete(path);result[path]=value;return value;
  }
  Object.keys(tokens).forEach(resolve);return result;
}
export function formatValue(v){return v?.unit?`${v.value}${v.unit}`:v?.colorSpace?(v.alpha!==undefined&&v.alpha<1?`rgb(${v.components.map(n=>Math.round(n*255)).join(' ')} / ${v.alpha})`:'#'+v.components.map(n=>Math.round(n*255).toString(16).padStart(2,'0')).join('')):String(v);}
export function nestedTokens(tokens){resolveTokens(tokens);const out={};for(const [path,token] of Object.entries(tokens)){const parts=path.split('.');let p=out;parts.forEach((key,i)=>{if(i===parts.length-1)p[key]=token;else p=p[key]??={};});}return out;}
// Policy is a compiler-owned allowlist, never supplied by an end-user override.
export function applySemanticOverrides(tokens,brand,overrides,policy=[]){
  if(!['a','b'].includes(brand))throw new Error(`Unknown override brand: ${brand}`);
  const output=structuredClone(tokens);
  for(const [path,token] of Object.entries(overrides)){
    const rule=policy.find(r=>r.brand===brand&&r.path===path);
    const target=typeof token?.$value==='string'&&/^\{klic\.brand\.[a-z0-9.-]+\}$/.test(token.$value)?token.$value.slice(1,-1):null;
    if(!path.startsWith('klic.semantic.')||!rule||!target||!rule.targets.includes(target)||token.$type!==rule.type||tokens[path]?.$type!==rule.type||tokens[target]?.$type!==rule.type)throw new Error(`Semantic override not approved by allowlist: ${brand}/${path}`);
    output[path]=structuredClone(token);
  }
  resolveTokens(output);return output;
}
export function compileThemeCSS(brand='a',appearance={}){
  return ['light','dark'].map(mode=>`:root[data-theme="${mode}"]{${Object.entries(resolveTokens(createTokens(brand,mode,appearance))).map(([path,value])=>`--${path.replaceAll('.','-')}:${formatValue(value)};`).join('')}}`).join('\n');
}
export function traceToken(tokens,path){const chain=[],seen=new Set();while(tokens[path]&&!seen.has(path)){seen.add(path);chain.push({path,...tokens[path]});const v=tokens[path].$value;if(typeof v!=='string'||!v.startsWith('{'))break;path=v.slice(1,-1);}return chain;}
export function pageTitleSize(width,root=16){return Math.max(1.5*root,Math.min(1.875*root,.9375*root+.01171875*width));}
export function searchCatalog(catalog,query){const q=query.trim().toLocaleLowerCase();return catalog.filter(x=>[x.name,x.ko,x.category,...(x.tags??[])].join(' ').toLocaleLowerCase().includes(q));}
