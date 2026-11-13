const FALLBACK=Object.freeze({
 accent:'#245FC2',accentHover:'#1c4fa4',accentActive:'#163e80',
 text:'#132c46',muted:'#52657b',surface:'#fbfcfe',surfaceSoft:'#f5f7fb',
 panel:'#ffffff',border:'#dfe5ee',controlBorder:'#7e8fa7',onAccent:'#ffffff',
 success:'#1c4fa4',warning:'#835600',danger:'#b13c43'
});
const ROLE_KEYS=Object.freeze({
 'accent-hover':'accentHover','accent-active':'accentActive','surface-soft':'surfaceSoft',
 'control-border':'controlBorder','on-accent':'onAccent','surface-selected':'surfaceSelected'
});
const BODY_FONT='var(--klic-component-text-body-font-family,system-ui,sans-serif)';
const HEADING_FONT='var(--klic-component-heading-font-family,var(--klic-component-text-body-font-family,system-ui,sans-serif))';
const CSS_MONO_FONT='var(--klic-ui-mono,monospace)';
const PAINT_PROPERTIES=/^(?:color|background|background-color|background-image|border(?:-(?:top|right|bottom|left))?(?:-color)?|outline(?:-color)?|text-decoration-color|column-rule-color|box-shadow|text-shadow|fill|stroke|stop-color|flood-color|lighting-color|caret-color|accent-color|filter)$/i;
const ATTRIBUTE_PAINTS=new Set(['fill','stroke','color','stop-color','flood-color','lighting-color']);
const NAMED_RGB={
 red:[255,0,0],coral:[255,127,80],orange:[255,165,0],amber:[255,191,0],yellow:[255,255,0],
 gold:[255,215,0],blue:[0,0,255],purple:[128,0,128],violet:[238,130,238],magenta:[255,0,255],
 pink:[255,192,203],green:[0,128,0],lime:[0,255,0],teal:[0,128,128],cyan:[0,255,255],
 aqua:[0,255,255],turquoise:[64,224,208],mint:[62,180,137],sage:[143,188,143],
 chartreuse:[127,255,0],springgreen:[0,255,127],white:[255,255,255],black:[0,0,0]
};
const NAMED_COLOR_RE=/^(?:red|coral|orange|amber|yellow|gold|blue|purple|violet|magenta|pink|green|lime|teal|cyan|aqua|turquoise|mint|sage|chartreuse|springgreen|white|black)$/i;

function cssValue(style,name,fallback){return style?.getPropertyValue?.(name)?.trim()||fallback;}
function styleFor(host){
 const view=host?.ownerDocument?.defaultView||globalThis;
 return view.getComputedStyle?.(host)||view.getComputedStyle?.(host?.ownerDocument?.documentElement)||null;
}

export function resolveMotionPalette(host){
 const style=styleFor(host);
 return Object.freeze({
  accent:cssValue(style,'--klic-semantic-color-accent',FALLBACK.accent),
  accentHover:cssValue(style,'--klic-semantic-color-accent-hover',FALLBACK.accentHover),
  accentActive:cssValue(style,'--klic-semantic-color-accent-active',FALLBACK.accentActive),
  text:cssValue(style,'--klic-semantic-color-text',FALLBACK.text),
  muted:cssValue(style,'--klic-semantic-color-muted',FALLBACK.muted),
  surface:cssValue(style,'--klic-semantic-color-surface',FALLBACK.surface),
  surfaceSoft:cssValue(style,'--klic-semantic-color-surface-soft',FALLBACK.surfaceSoft),
  panel:cssValue(style,'--klic-semantic-color-panel',FALLBACK.panel),
  border:cssValue(style,'--klic-semantic-color-border',FALLBACK.border),
  controlBorder:cssValue(style,'--klic-semantic-color-control-border',FALLBACK.controlBorder),
  onAccent:cssValue(style,'--klic-semantic-color-on-accent',FALLBACK.onAccent),
  success:cssValue(style,'--klic-semantic-color-success',FALLBACK.success),
  warning:cssValue(style,'--klic-semantic-color-warning',FALLBACK.warning),
  danger:cssValue(style,'--klic-semantic-color-danger',FALLBACK.danger)
 });
}

function splitCommaList(value){
 const result=[];let start=0,depth=0,quote='',escaped=false;
 for(let index=0;index<value.length;index++){
  const char=value[index];
  if(quote){if(char===quote&&!escaped)quote='';escaped=char==='\\'&&!escaped;continue;}
  if(char==='"'||char==="'"){quote=char;continue;}
  if(char==='(')depth++;else if(char===')')depth=Math.max(0,depth-1);
  else if(char===','&&depth===0){result.push(value.slice(start,index).trim());start=index+1;}
  escaped=false;
 }
 result.push(value.slice(start).trim());return result.filter(Boolean);
}
function canvasFamilyStack(value){
 return splitCommaList(String(value)).map(family=>{
  const unquoted=family.replace(/^(['"])(.*)\1$/s,'$2').trim();
  if(!unquoted||/^var\(/i.test(unquoted)||/^(?:serif|sans-serif|monospace|cursive|fantasy|system-ui|ui-sans-serif|ui-serif|ui-monospace|emoji|math|fangsong)$/i.test(unquoted))return unquoted||family;
  return /\s/.test(unquoted)?'"'+unquoted.replaceAll('"','')+'"':unquoted;
 }).join(', ');
}
function concreteFontStack(value,fallback){return /\bvar\s*\(/i.test(String(value))?fallback:value;}

export function resolveMotionFonts(host){
 const style=styleFor(host);
 const computedBody=style?.fontFamily||'system-ui, sans-serif';
 const body=concreteFontStack(cssValue(style,'--klic-component-text-body-font-family',computedBody),computedBody);
 const heading=concreteFontStack(cssValue(style,'--klic-component-heading-font-family',body),body);
 const mono=concreteFontStack(cssValue(style,'--klic-ui-mono','ui-monospace, SFMono-Regular, Menlo, monospace'),'ui-monospace, SFMono-Regular, Menlo, monospace');
 return Object.freeze({body,heading,mono,canvas:canvasFamilyStack(body),canvasHeading:canvasFamilyStack(heading),canvasMono:canvasFamilyStack(mono)});
}

function parseColor(value){
 const source=String(value).trim().toLowerCase();
 if(source==='transparent')return {r:0,g:0,b:0};
 const hex=source.match(/^#([\da-f]{3,8})$/i);
 if(hex){
  let digits=hex[1];if(digits.length===3||digits.length===4)digits=[...digits].map(char=>char+char).join('');
  if(digits.length===6||digits.length===8)return {r:parseInt(digits.slice(0,2),16),g:parseInt(digits.slice(2,4),16),b:parseInt(digits.slice(4,6),16)};
 }
 const named=NAMED_RGB[source];if(named)return {r:named[0],g:named[1],b:named[2]};
 const rgb=source.match(/^rgba?\(\s*([^)]*)\)$/i);
 if(rgb){
  const values=[...rgb[1].matchAll(/[-+]?(?:\d*\.)?\d+%?/g)].map(match=>match[0]);
  if(values.length>=3)return {r:channel(values[0]),g:channel(values[1]),b:channel(values[2])};
 }
 const hsl=source.match(/^hsla?\(\s*(-?[\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%/i);
 if(hsl){
  const h=((Number(hsl[1])%360)+360)%360,s=Number(hsl[2])/100,l=Number(hsl[3])/100,c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;
  let values;if(h<60)values=[c,x,0];else if(h<120)values=[x,c,0];else if(h<180)values=[0,c,x];else if(h<240)values=[0,x,c];else if(h<300)values=[x,0,c];else values=[c,0,x];
  return {r:(values[0]+m)*255,g:(values[1]+m)*255,b:(values[2]+m)*255};
 }
 return null;
}
function channel(value){const number=parseFloat(value);return value.endsWith('%')?number*2.55:number;}
function colorAlpha(value){
 const source=String(value).trim(),hex=source.match(/^#([\da-f]{4}|[\da-f]{8})$/i);
 if(hex){const digits=hex[1],alpha=digits.length===4?parseInt(digits[3]+digits[3],16):parseInt(digits.slice(6,8),16);return alpha/255;}
 if(source.toLowerCase()==='transparent')return 0;
 const fn=source.match(/^(?:rgba?|hsla?)\(([^)]+)\)$/i);if(!fn)return 1;
 const pieces=fn[1].trim().split(/[\s,/]+/);if(pieces.length<4)return 1;
 const raw=pieces[3];if(raw.endsWith('%'))return clamp(Number(raw.slice(0,-1))/100,0,1);
 const alpha=Number(raw);return Number.isFinite(alpha)?clamp(alpha,0,1):1;
}
function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
function preserveAlpha(role,alpha){
 if(alpha>=1)return role;const rgb=parseColor(role);if(!rgb)return role;
 return 'rgba('+Math.round(rgb.r)+', '+Math.round(rgb.g)+', '+Math.round(rgb.b)+', '+Number(alpha.toFixed(4))+')';
}
function roleValue(palette,role){
 if(!role)return null;
 const key=ROLE_KEYS[role]||role;
 return palette?.[role]||palette?.[key]||FALLBACK[key]||FALLBACK[role]||null;
}
function sameColor(left,right){
 const a=parseColor(left),b=parseColor(right);
 if(!a||!b)return String(left).trim().toLowerCase()===String(right).trim().toLowerCase();
 return Math.round(a.r)===Math.round(b.r)&&Math.round(a.g)===Math.round(b.g)&&Math.round(a.b)===Math.round(b.b);
}
function rgbToHsl(rgb){
 const r=rgb.r/255,g=rgb.g/255,b=rgb.b/255,max=Math.max(r,g,b),min=Math.min(r,g,b),light=(max+min)/2,d=max-min;
 if(!d)return {h:0,s:0,l:light};
 let h;if(max===r)h=60*(((g-b)/d)%6);else if(max===g)h=60*((b-r)/d+2);else h=60*((r-g)/d+4);
 return {h:(h+360)%360,s:d/(1-Math.abs(2*light-1)),l:light};
}

export function mapMotionColor(value,palette=FALLBACK){
 const source=String(value).trim(),named=source.toLowerCase();
 if(named==='transparent')return value;
 let role=null;
 if(['green','lime','teal','cyan','aqua','turquoise','mint','sage','chartreuse','springgreen','blue','purple','violet','magenta','pink','red','coral'].includes(named))role='accent';
 else if(['yellow','gold','orange','amber'].includes(named))role='warning';
 else if(named==='white')role='panel';else if(named==='black')role='text';
 const rgb=parseColor(value);
 if(!rgb)return role?preserveAlpha(roleValue(palette,role),colorAlpha(value)):value;
 for(const key of ['accent','accentHover','accentActive','text','muted','surface','surfaceSoft','panel','border','controlBorder','onAccent','success','warning','danger']){
  const color=roleValue(palette,key);if(color&&sameColor(value,color))return preserveAlpha(color,colorAlpha(value));
 }
 const {h,s,l}=rgbToHsl(rgb);
 if(s>.19)role=h>=24&&h<=62?'warning':'accent';
 else if(l<.22)role='text';
 else if(l>.94)role='panel';
 else if(l>.82)role='surface';
 else if(l>.64)role='border';
 else role='muted';
 return preserveAlpha(roleValue(palette,role),colorAlpha(value));
}

function findClosingParen(source,start){
 let depth=0,quote='',comment=false;
 for(let index=start;index<source.length;index++){
  if(comment){if(source[index]==='*'&&source[index+1]==='/'){comment=false;index++;}continue;}
  if(quote){if(source[index]===quote&&source[index-1]!=='\\')quote='';continue;}
  if(source[index]==='/'&&source[index+1]==='*'){comment=true;index++;continue;}
  if(source[index]==='"'||source[index]==="'"){quote=source[index];continue;}
  if(source[index]==='(')depth++;else if(source[index]===')'&&--depth===0)return index+1;
 }
 return source.length;
}
function findColors(value){
 const source=String(value),matches=[];let index=0;
 while(index<source.length){
  if(source[index]==='/'&&source[index+1]==='*'){const end=source.indexOf('*/',index+2);index=end<0?source.length:end+2;continue;}
  const url=source.slice(index).match(/^url\s*\(/i);
  if(url){index=findClosingParen(source,index+url[0].length-1);continue;}
  if(source[index]==='#'){
   const match=source.slice(index).match(/^#[\da-f]{3,8}(?![\w-])/i);
   if(match&&[4,5,7,9].includes(match[0].length)){matches.push({start:index,end:index+match[0].length,value:match[0]});index+=match[0].length;continue;}
  }
  const fn=source.slice(index).match(/^(?:rgba?|hsla?)\s*\(/i);
  if(fn){
   const end=findClosingParen(source,index+fn[0].length-1),token=source.slice(index,end);
   if(parseColor(token)||/^(?:hsla?)\(\s*calc\(/i.test(token))matches.push({start:index,end,value:token});
   index=end;continue;
  }
  const word=source.slice(index).match(/^[a-z]+/i);
  if(word&&NAMED_COLOR_RE.test(word[0])&&(index===0||!/[A-Za-z0-9_-]/.test(source[index-1]))&&!/[A-Za-z0-9_-]/.test(source[index+word[0].length]||'')){
   matches.push({start:index,end:index+word[0].length,value:word[0]});index+=word[0].length;continue;
  }
  index++;
 }
 return matches;
}
function targetInfo(context={}){
 const target=context.target,selector=String(context.selector||'');
 const targetClass=typeof target==='string'?target:(target?.className?.baseVal||target?.className||target?.getAttribute?.('class')||'');
 const classes=Array.isArray(target?.classes)?target.classes:String(targetClass+' '+selector).match(/[\w-]+/g)||[];
 const parentClasses=Array.isArray(target?.parentClasses)?target.parentClasses:[];
 const lower=selector+' '+classes.join(' ')+' '+parentClasses.join(' ');
 return {classes,parentClasses,lower,childIndex:Number(target?.childIndex)||0,tagName:String(target?.tagName||'').toLowerCase()};
}
function stateRole(info){
 const value=info.lower.toLowerCase();
 if(/(?:danger|error|invalid|failed|failure|destructive)/.test(value))return 'danger';
 if(/(?:warning|caution|pending)/.test(value))return 'warning';
 if(/(?:success|completed|complete|confirmed)/.test(value))return 'success';
 return null;
}
function brightnessRole(palette,roles,brightness){
 const rows=roles.map(role=>({role,lightness:rgbToHsl(parseColor(roleValue(palette,role))||{r:0,g:0,b:0}).l})).sort((left,right)=>left.lightness-right.lightness);
 return brightness==='high'?rows.at(-1)?.role:rows[0]?.role;
}
function patternPaint(context,property,palette=FALLBACK){
 const info=targetInfo(context),has=(name,classes=info.classes)=>classes.includes(name);
 if(/^svgDiagram/.test(context.pattern||'')&&has('dm-box')){
  if(property==='fill')return {role:'surface-soft'};
  if(property==='stroke')return {role:'control-border'};
 }
 if(context.pattern==='depthRellax'){
  if(has('dp-bg')&&/^background/.test(property))return {role:'surface',gradientRoles:['surface','surface-soft']};
  if(has('dp-bg',info.parentClasses)&&/^border/.test(property))return {role:'border'};
  if(has('dp-mid',info.parentClasses)&&/^background/.test(property))return {role:brightnessRole(palette,['surface','surface-soft'],info.childIndex===0?'high':'low')};
  if(has('dp-fg')&&/^background/.test(property))return {role:'accent-hover',gradientRoles:['accent-hover','accent-active']};
  if(has('dp-fg')&&/^border/.test(property))return {role:'accent'};
  if(has('dp-fg',info.parentClasses)&&/^background/.test(property))return {role:info.childIndex===0?'on-accent':'surface-soft'};
  if(has('mb-caption')&&property==='color')return {role:'muted'};
 }
 if(context.pattern==='depthZText'&&has('dp-z')&&property==='color'){
  if(info.childIndex>=6)return {role:'accent'};
  return {role:'text',layerColor:mixRoleColors(palette,['text','muted'],info.childIndex/5)};
 }
 if(context.pattern==='depthTiltGlare'){
  if(has('dp-card')&&/^background/.test(property))return {role:'surface',gradientRoles:['surface','surface-soft']};
  if(has('dp-card')&&/^border/.test(property))return {role:'border'};
  if(has('dp-card')&&property==='box-shadow')return {role:'text'};
  if(has('dp-badge')&&/^background/.test(property))return {role:'accent'};
  if(has('dp-badge')&&property==='color')return {role:'on-accent'};
  if(has('dp-glare')&&/^background/.test(property))return {role:'panel',gradientRoles:['panel','surface']};
  if(has('dp-card',info.parentClasses)&&/^background/.test(property))return {role:brightnessRole(palette,['surface','surface-soft'],info.childIndex===1?'high':'low')};
  if(has('mb-caption')&&property==='color')return {role:'muted'};
 }
 return null;
}
function inferredRole(source,palette,context,property){
 const info=targetInfo(context),state=stateRole(info),pattern=patternPaint(context,property,palette);
 const value=info.lower.toLowerCase();
 if(property==='color'){
  if(pattern?.role)return pattern.role;
  if(['accent','accent-hover','accent-active','success','warning','danger'].includes(context.backgroundRole)||/(?:primary|dp-badge|badge-on-accent)/.test(value))return 'on-accent';
  if(state)return state;
  if(/(?:caption|muted|metadata|meta|secondary|eyebrow|kicker)/.test(value))return 'muted';
  if(/(?:button|action|link|progress|selected|active|accent|icon)/.test(value))return 'accent';
  return 'text';
 }
 if(state)return state;
 if(pattern?.role)return pattern.role;
 if(/^border|^outline/.test(property))return /(?:active|selected|focus|current)/.test(value)?'accent':'border';
 if(/^background/.test(property)){
  if(/(?:panel|card)/.test(value))return 'panel';
  if(/(?:surface|canvas|scene)/.test(value))return 'surface';
  const rgb=parseColor(source);if(rgb&&rgbToHsl(rgb).s<.19){const light=rgbToHsl(rgb).l;return light<.18?'text':light>.94?'panel':light>.78?'surface':light>.58?'border':'muted';}
  return 'accent';
 }
 if(/shadow|filter/.test(property))return 'text';
 if(/fill|stroke/.test(property))return 'accent';
 return null;
}
function defaultGradientRoles(role){
 if(role==='surface')return ['surface','surface-soft'];
 if(role==='panel')return ['panel','surface'];
 if(role==='accent'||role==='accent-hover'||role==='accent-active')return ['accent-hover','accent-active'];
 if(role==='on-accent')return ['on-accent','surface-soft'];
 return role?[role]:[];
}
function roleForStop(roles,index,count){
 if(!roles.length)return null;if(roles.length===1)return roles[0];
 return roles[Math.round(index*(roles.length-1)/Math.max(1,count-1))];
}
function mapColorToken(value,palette,role){
 if(!role)return mapMotionColor(value,palette);
 const target=roleValue(palette,role);if(!target)return mapMotionColor(value,palette);
 return preserveAlpha(target,colorAlpha(value));
}
function mixRoleColors(palette,roles,amount){
 const colors=roles.map(role=>roleValue(palette,role)).filter(Boolean);if(colors.length<2)return colors[0]||null;
 const rows=colors.map(color=>({color,rgb:parseColor(color)})).filter(row=>row.rgb).map(row=>({...row,lightness:rgbToHsl(row.rgb).l})).sort((left,right)=>left.lightness-right.lightness);
 if(rows.length<2)return colors[0];
 const low=rows[0].rgb,high=rows.at(-1).rgb,t=clamp(amount,0,1);
 if(t<=0)return rows[0].color;if(t>=1)return rows.at(-1).color;
 const rgb={r:Math.round(low.r+(high.r-low.r)*t),g:Math.round(low.g+(high.g-low.g)*t),b:Math.round(low.b+(high.b-low.b)*t)};
 return 'rgb('+rgb.r+', '+rgb.g+', '+rgb.b+')';
}
function mapGradientToken(value,matches,index,palette,roles){
 if(roles.length<2)return mapColorToken(value,palette,roles[0]);
 const unique=[];let uniqueIndex=0;
 for(let at=0;at<matches.length;at++){
  const found=unique.findIndex(token=>sameColor(token,matches[at].value));
  if(found<0)unique.push(matches[at].value);
  if(at===index)uniqueIndex=found<0?unique.length-1:found;
 }
 const targetColors=roles.map(role=>parseColor(roleValue(palette,role))).filter(Boolean),targetL=targetColors.map(color=>rgbToHsl(color).l);
 const lowTarget=Math.min(...targetL),highTarget=Math.max(...targetL),sourceL=unique.map(color=>{const rgb=parseColor(color);return rgb?rgbToHsl(rgb).l:null;}).filter(Number.isFinite);
 let amount;
 if(unique.length<2||sourceL.length<2)amount=rgbToHsl(parseColor(value)||{r:0,g:0,b:0}).l>=(lowTarget+highTarget)/2?1:0;
 else{
  const minimum=Math.min(...sourceL),maximum=Math.max(...sourceL),current=rgbToHsl(parseColor(value)||{r:0,g:0,b:0}).l;
  amount=maximum-minimum>.01?(current-minimum)/(maximum-minimum):uniqueIndex/(unique.length-1);
 }
 const color=mixRoleColors(palette,roles,amount);return color?preserveAlpha(color,colorAlpha(value)):mapColorToken(value,palette,roles[0]);
}

export function mapMotionPaint(value,appearance=FALLBACK,options={}){
 if(options.resolved)return value;
 const property=String(options.property||'color').replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase()).toLowerCase();
 if(!PAINT_PROPERTIES.test(property)&&!property.startsWith('--'))return value;
 const source=String(value),pattern=patternPaint(options,property,appearance);
 const role=options.role||options.roles?.[property]||pattern?.role||inferredRole(source,appearance,options,property);
 const gradient=/gradient\s*\(/i.test(source),roles=options.gradientRoles||pattern?.gradientRoles||(gradient?defaultGradientRoles(role):[]);
 const matches=findColors(source);if(!matches.length)return value;
 let output='',cursor=0;
 matches.forEach((match,index)=>{
  const mapped=pattern?.layerColor?preserveAlpha(pattern.layerColor,colorAlpha(match.value)):gradient?mapGradientToken(match.value,matches,index,appearance,roles):mapColorToken(match.value,appearance,role);
  output+=source.slice(cursor,match.start)+mapped;
  cursor=match.end;
 });
 return output+source.slice(cursor);
}

function splitTopLevel(source,delimiter){
 const parts=[];let start=0,depth=0,brackets=0,quote='',comment=false;
 for(let index=0;index<source.length;index++){
  const char=source[index];
  if(comment){if(char==='*'&&source[index+1]==='/'){comment=false;index++;}continue;}
  if(quote){if(char===quote&&source[index-1]!=='\\')quote='';continue;}
  if(char==='/'&&source[index+1]==='*'){comment=true;index++;continue;}
  if(char==='"'||char==="'"){quote=char;continue;}
  if(char==='(')depth++;else if(char===')')depth=Math.max(0,depth-1);
  else if(char==='[')brackets++;else if(char===']')brackets=Math.max(0,brackets-1);
  else if(char===delimiter&&depth===0&&brackets===0){parts.push([source.slice(start,index),delimiter]);start=index+1;}
 }
 parts.push([source.slice(start),'']);return parts;
}
function parseDeclaration(source){
 const colon=splitTopLevel(source,':');if(colon.length<2)return null;
 const left=colon[0][0],right=source.slice(left.length+1),match=left.match(/^([\s\S]*?)([a-zA-Z_-][\w-]*)(\s*)$/);
 if(!match)return null;
 const valueMatch=right.match(/^(\s*)([\s\S]*?)(\s*)$/);if(!valueMatch)return null;
 return {match,property:match[2].toLowerCase(),valueMatch};
}
function rewriteDeclarations(source,context,appearance,mode){
 const parts=splitTopLevel(source,';'),parsed=parts.map(([declaration])=>parseDeclaration(declaration));
 const backgroundIndex=parsed.findIndex(row=>row&&/^background(?:-|$)/.test(row.property));
 let localContext=context,backgroundRole=context.backgroundRole;
 if(mode==='colors'&&backgroundIndex>=0){
  const row=parsed[backgroundIndex],pattern=patternPaint(context,row.property,appearance),state=stateRole(targetInfo(context));
  backgroundRole=pattern?.role||state||inferredRole(row.valueMatch[2],appearance,context,row.property);
  localContext={...context,backgroundRole};
 }
 const hasColor=parsed.some(row=>row?.property==='color');
 let result=parts.map(([declaration,separator],index)=>{
  const row=parsed[index];if(!row)return declaration+separator;
  const {match,property,valueMatch}=row;let value=valueMatch[2];
  if(mode==='colors'&&(PAINT_PROPERTIES.test(property)||property.startsWith('--')&&!property.startsWith('--klic-'))){
   const diagramRole=/^svgDiagram/.test(context.pattern||'')&&targetInfo(context).classes.includes('diagram-motion')?{'--c1':'accent','--c2':'accent-hover','--c3':'text'}[property]:null;
   const paintProperty=property.startsWith('--')?'background':property;
   value=mapMotionPaint(value,appearance,{...localContext,property:paintProperty,...(diagramRole?{role:diagramRole}:{})});
  }else if(mode==='fonts'&&(property==='font'||property==='font-family')&&!/^@font-face/i.test(context.selector||'')){
   value=mapFontDeclaration(value,property,context);
  }
  return match[1]+property+match[3]+':'+valueMatch[1]+value+valueMatch[3]+separator;
 }).join('');
 const info=targetInfo(context),state=stateRole(info),filled=/(?:button|badge|pill|tag|chip|control)/.test(info.lower);
 if(mode==='colors'&&backgroundRole&&['accent','accent-hover','accent-active','success','warning','danger'].includes(backgroundRole)&&!hasColor&&(state||filled)){
  result=result.trimEnd()+(result.trimEnd().endsWith(';')?'':';')+'color:var(--klic-semantic-color-on-accent,'+roleValue(appearance,'onAccent')+');';
 }
 return result;
}
function findBlockEnd(source,start){
 let depth=0,quote='',comment=false;
 for(let index=start;index<source.length;index++){
  const char=source[index];
  if(comment){if(char==='*'&&source[index+1]==='/'){comment=false;index++;}continue;}
  if(quote){if(char===quote&&source[index-1]!=='\\')quote='';continue;}
  if(char==='/'&&source[index+1]==='*'){comment=true;index++;continue;}
  if(char==='"'||char==="'"){quote=char;continue;}
  if(char==='{')depth++;else if(char==='}'&&--depth===0)return index;
 }
 return -1;
}
function findBlockStart(source,start){
 let quote='',comment=false,paren=0;
 for(let index=start;index<source.length;index++){
  const char=source[index];
  if(comment){if(char==='*'&&source[index+1]==='/'){comment=false;index++;}continue;}
  if(quote){if(char===quote&&source[index-1]!=='\\')quote='';continue;}
  if(char==='/'&&source[index+1]==='*'){comment=true;index++;continue;}
  if(char==='"'||char==="'"){quote=char;continue;}
  if(char==='(')paren++;else if(char===')')paren=Math.max(0,paren-1);else if(char==='{'&&paren===0)return index;
 }
 return -1;
}
function rewriteStyleSheet(source,appearance,mode,context={}){
 let result='',cursor=0;
 while(cursor<source.length){
  const open=findBlockStart(source,cursor);if(open<0){result+=source.slice(cursor);break;}
  const close=findBlockEnd(source,open);if(close<0){result+=source.slice(cursor);break;}
  const prelude=source.slice(cursor,open),body=source.slice(open+1,close),selector=prelude.trim();
  const nested=findBlockStart(body,0);
  const childContext={...context,selector, target:selector};
  const outputBody=nested>=0?rewriteStyleSheet(body,appearance,mode,context):rewriteDeclarations(body,childContext,appearance,mode);
  result+=prelude+'{'+outputBody+'}';cursor=close+1;
 }
 return result;
}
function rewriteHTML(source,appearance,context,mode){
 const input=String(source),tagPattern=/<!--[\s\S]*?-->|<\/?[A-Za-z][^>]*>/g,stack=[];
 const voidTags=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
 let result='',cursor=0,match;
 while((match=tagPattern.exec(input))){
  result+=input.slice(cursor,match.index);let tag=match[0];cursor=tagPattern.lastIndex;
  if(tag.startsWith('<!--')){result+=tag;continue;}
  const closing=tag.match(/^<\/\s*([\w:-]+)/),opening=tag.match(/^<\s*([\w:-]+)/);
  if(closing){result+=tag;while(stack.length){const top=stack.pop();if(top.tagName===closing[1].toLowerCase())break;}continue;}
  if(!opening){result+=tag;continue;}
  const parent=stack.at(-1),childIndex=parent?parent.children++:0,tagName=opening[1].toLowerCase();
  const classMatch=tag.match(/\bclass\s*=\s*(["'])(.*?)\1/i),classes=classMatch?.[2].split(/\s+/).filter(Boolean)||[];
  const target={tagName,classes,parentClasses:parent?.classes||[],childIndex};
  const localContext={...context,target,selector:'.'+classes.join('.')};
  tag=tag.replace(/(\s+)([\w:-]+)(\s*=\s*)(["'])(.*?)\4/gs,(whole,space,name,equals,quote,value)=>{
   const lower=name.toLowerCase();let next=value;
   if(lower==='style'){
    if(mode==='colors')next=rewriteDeclarations(value,localContext,appearance,'colors');
    if(mode==='fonts')next=rewriteDeclarations(next,localContext,appearance,'fonts');
   }else if(mode==='colors'&&ATTRIBUTE_PAINTS.has(lower)){
    next=mapMotionPaint(value,appearance,{...localContext,property:lower==='stop-color'?'stop-color':lower});
   }
   return space+name+equals+quote+next+quote;
  });
  result+=tag;
  if(!voidTags.has(tagName)&&!/^<[^>]*\/\s*>$/.test(tag))stack.push({tagName,classes,children:0});
 }
 return result+input.slice(cursor);
}
function rewriteSource(source,appearance,context,mode){
 const value=String(source);
 if(/<\/?[A-Za-z][^>]*>/.test(value))return rewriteHTML(value,appearance,context,mode);
 if(findBlockStart(value,0)>=0)return rewriteStyleSheet(value,appearance,mode,context);
 return rewriteDeclarations(value,context,appearance,mode);
}
export function rewriteMotionColors(source,palette=FALLBACK,context={}){
 return rewriteSource(source,palette,context,'colors');
}
export function rewriteMotionFonts(source,context={}){
 return rewriteSource(source,FALLBACK,context,'fonts');
}

function fontRole(context,value=''){
 const info=targetInfo(context),all=(info.lower+' '+value).toLowerCase();
 if(/(?:mono|consolas|courier|menlo|monaco)/.test(all))return 'mono';
 if(/(?:heading|title|headline|mc-text|mc-victory|(?:^|[^a-z0-9])h[1-6](?:$|[^a-z0-9]))/.test(all))return 'heading';
 return 'body';
}
function fontToken(role){
 return role==='mono'?CSS_MONO_FONT:role==='heading'?HEADING_FONT:BODY_FONT;
}
function mapFontDeclaration(value,property,context){
 const role=fontRole(context,value),token=fontToken(role);
 if(/var\(--klic-component-(?:text-body|heading)-font-family|var\(--klic-ui-mono/i.test(value))return value;
 if(property==='font-family')return token;
 const shorthand=value.match(/^([\s\S]*?\b(?:\d+(?:\.\d+)?(?:px|pt|pc|em|rem|%|vh|vw)|xx-small|x-small|small|medium|large|x-large|xx-large|larger|smaller)\b(?:\s*\/\s*[^\s]+)?)\s+([\s\S]+)$/i);
 return shorthand?shorthand[1]+' '+token:value;
}
export function mapMotionFont(value,fonts,role='body'){
 const source=String(value);
 let selected=typeof fonts==='string'?fonts:(role==='heading'?fonts?.canvasHeading||fonts?.heading:fonts?.canvas||fonts?.body);
 if(/(?:mono|consolas|courier|menlo|monaco)/i.test(source))selected=typeof fonts==='object'?(fonts.canvasMono||fonts.mono||'monospace'):'monospace';
 if(!selected)return value;
 const shorthand=source.match(/^([\s\S]*?\b(?:\d+(?:\.\d+)?(?:px|pt|pc|em|rem|%|vh|vw)|xx-small|x-small|small|medium|large|x-large|xx-large|larger|smaller)\b(?:\s*\/\s*[^\s]+)?)\s+([\s\S]+)$/i);
 return shorthand?shorthand[1]+' '+selected:source;
}

export function wrapMotionCanvasContext(context,mapColor=value=>value,mapFont=value=>value,mapStyle=value=>value,mapFamily=value=>'other'){
 if(!context||typeof context!=='object')return context;
 return new Proxy(context,{
  get(target,key){
   const value=Reflect.get(target,key,target);
   if(key==='fillText'||key==='strokeText')return (...args)=>{
    const styleKey=key==='fillText'?'fillStyle':'strokeStyle',records=contextPaintSources.get(target),source=records?.[styleKey]??target[styleKey],previousPaint=target[styleKey];
    const previousFilter=typeof target.filter==='string'?target.filter:'none',emoji=key==='fillText'&&typeof args[0]==='string'&&EMOJI_GLYPH.test(args[0]);
    if(typeof source==='string')target[styleKey]=mapColor(source,{role:'text'});
    if(emoji)target.filter=previousFilter&&previousFilter!=='none'?previousFilter+' grayscale(1)':'grayscale(1)';
    try{return value.apply(target,args);}finally{if(emoji)target.filter=previousFilter;target[styleKey]=previousPaint;}
   };
   if(key==='createLinearGradient'||key==='createRadialGradient'||key==='createConicGradient')return (...args)=>wrapGradient(value.apply(target,args),mapColor,mapFamily);
   return typeof value==='function'?value.bind(target):value;
  },
  set(target,key,value){
   if(['fillStyle','strokeStyle','shadowColor'].includes(key)){
    const records=contextPaintSources.get(target)||{};records[key]=typeof value==='string'?value:null;contextPaintSources.set(target,records);
    value=typeof value==='string'?mapColor(value):flushGradient(value);
   }
   if(key==='font'&&typeof value==='string')value=mapFont(value);
   if(key==='filter'&&typeof value==='string')value=mapStyle(value);
   return Reflect.set(target,key,value,target);
  }
 });
}
const EMOJI_GLYPH=/\p{Extended_Pictographic}/u;
const gradientRecords=new WeakMap();
const contextPaintSources=new WeakMap();
function wrapGradient(gradient,mapColor,mapFamily){
 if(!gradient)return gradient;
 const stops=[],proxy=new Proxy(gradient,{get(target,key){const value=Reflect.get(target,key,target);if(key==='addColorStop')return(offset,color)=>{stops.push([offset,color]);};return typeof value==='function'?value.bind(target):value;}});
 gradientRecords.set(proxy,{target:gradient,stops,mapColor,mapFamily,flushed:false});return proxy;
}
function flushGradient(value){
 const record=value&&gradientRecords.get(value);if(!record)return value;if(record.flushed)return record.target;
 for(const [offset,source]of record.stops)record.target.addColorStop(offset,typeof source==='string'?record.mapColor(source):source);
 record.flushed=true;return record.target;
}
function colorFamily(value,palette=FALLBACK){
 for(const name of ['text','muted','surface','surfaceSoft','panel','border','controlBorder'])if(sameColor(value,roleValue(palette,name)))return 'neutral';
 for(const name of ['accent','accentHover','accentActive','warning','danger'])if(sameColor(value,roleValue(palette,name)))return name;
 const rgb=parseColor(value);if(!rgb)return 'other';const {h,s}=rgbToHsl(rgb);if(s<.19)return 'neutral';return h>=24&&h<=62?'warning':'accent';
}

function motionPaintState(context={}){
 const identities=[context.id,context.pattern,context.reference?.id,context.reference?.pattern].filter(Boolean).map(value=>String(value).replace(/([a-z0-9])([A-Z])/g,'$1-$2').toLowerCase().replace(/[^a-z0-9]+/g,'-'));
 return {
  danger:identities.some(value=>/(?:^|-)(?:error|invalid|failure|failed|reject|rejected)(?:-|$)/.test(value)),
  warning:identities.some(value=>/(?:^|-)warning(?:-|$)/.test(value))
 };
}

export function applyCanvasPalette(source,host,fontRoleName='body',motionContext={}){
 const palette=resolveMotionPalette(host),fonts=resolveMotionFonts(host);
 const fontFamily=fontRoleName==='heading'?fonts.canvasHeading:fonts.canvas;
 const state=motionPaintState(motionContext),redSlot=state.danger?palette.danger:palette.accentHover,yellowSlot=state.warning?palette.warning:palette.accentActive;
 // Atlas/Text map their K.red/K.yel slots through danger/warning, so specialize those aliases by recipe identity here.
 const mapped={
  ink:palette.text,mute:palette.muted,paper:palette.surface,card:palette.panel,
  grid:palette.border,line:palette.border,green:palette.accent,red:redSlot,
  blue:palette.accent,yel:yellowSlot,accent:palette.accent,warning:yellowSlot,danger:redSlot
 };
 source.KLIC_MOTION_PALETTE=mapped;
 source.KLIC_MOTION_COLOR=(value,options={})=>{
  if(!options.role&&!options.property)return mapMotionColor(value,palette);
  const isResolved=['accent','accent-hover','accent-active','text','muted','surface','surface-soft','panel','border','control-border','on-accent','success','warning','danger'].some(role=>sameColor(value,roleValue(palette,role)));
  return isResolved?mapMotionColor(value,palette):mapMotionPaint(value,palette,{property:'color',...options});
 };
 source.KLIC_MOTION_FAMILY=value=>colorFamily(value,palette);
 source.KLIC_MOTION_FONTS=fonts;
 source.KLIC_MOTION_FONT=value=>mapMotionFont(value,fontRoleName==='heading'?fonts:{...fonts,canvas:fontFamily},fontRoleName);
 source.KLIC_MOTION_REWRITE_COLORS=value=>mapMotionPaint(value,palette,{property:'filter'});
 source.KLIC_MOTION_WRAP_CONTEXT=context=>wrapMotionCanvasContext(context,source.KLIC_MOTION_COLOR,source.KLIC_MOTION_FONT,source.KLIC_MOTION_REWRITE_COLORS,source.KLIC_MOTION_FAMILY);
 source.ATLAS?.setKlicPalette?.(mapped);
 source.TEXTMOTION?.setKlicPalette?.(mapped);
 return {palette,fonts};
}
