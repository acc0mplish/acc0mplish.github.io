import {AFFECT_COMPONENTS,getAffectForms} from './affect-components.mjs';
import {SITE_METADATA} from './site-metadata.mjs';
import {isTerminalComponent,terminalComponentForms,MCP_TERMINAL_CLIENT_CONFIG,mcpTerminalClientNote} from './terminal-components.mjs';
import {specimen,escapeHTML as esc,icon} from './catalog.js';
import {getAddedVariants} from './component-variants-data.mjs';
import {normalizeKlicMarkup} from './native-class-contract.mjs';
const packageCLICommand='bunx --bun --package='+SITE_METADATA.package.name+'@latest klic';

const compactFamilies=new Set(['button','button-group','toggle','toggle-group','segmented-control','input','input-group','password-input','search-input','number-input','input-otp','checkbox','switch','radio-group','select','slider','range-slider','rating','color-picker','badge','avatar','avatar-group','separator','breadcrumb','pagination','link','kbd','code','spinner','progress','skeleton','typography']);
const roomyFamilies=new Set(['form','card','data-table','table','calendar','date-range-picker','transfer','tree','tree-select','cascader','command','sidebar','navigation-menu','carousel','file-upload','upload','empty-state','decision-inbox','tool-call-card','smart-recommendation','message-actions']);
export function familyDensity(id){return compactFamilies.has(id)?'compact':roomyFamilies.has(id)?'roomy':'regular';}
export function formatFamilyHTML(source){
 const voids=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);let depth=0;
 return source.split(/(<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>)/g).filter(part=>part.trim()).map(part=>{const closing=/^<\//.test(part),tag=part.match(/^<\/?([a-zA-Z][\w-]*)/);if(closing)depth=Math.max(0,depth-1);const line='  '.repeat(depth)+part.trim();if(tag&&!closing&&!voids.has(tag[1].toLowerCase())&&!/\/>$/.test(part))depth++;return line;}).join('\n');
}
const familyVoidTags=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const familyInlineTags=new Set(['a','abbr','b','bdi','bdo','button','cite','code','del','em','i','img','input','label','mark','q','s','small','span','strong','sub','sup','time','u','wbr','svg','g','path','circle','ellipse','rect','line','polyline','polygon','defs','clippath','use','title','desc']);
const reactAttributeNames=new Map(Object.entries({
 class:'className',for:'htmlFor',tabindex:'tabIndex',readonly:'readOnly',maxlength:'maxLength',minlength:'minLength',autofocus:'autoFocus',autocomplete:'autoComplete',autocapitalize:'autoCapitalize',crossorigin:'crossOrigin',datetime:'dateTime',formaction:'formAction',formenctype:'formEncType',formmethod:'formMethod',formnovalidate:'formNoValidate',formtarget:'formTarget',frameborder:'frameBorder',novalidate:'noValidate',playsinline:'playsInline',srcset:'srcSet',usemap:'useMap','accept-charset':'acceptCharset','http-equiv':'httpEquiv',colspan:'colSpan',rowspan:'rowSpan',contenteditable:'contentEditable',spellcheck:'spellCheck',viewbox:'viewBox',preserveaspectratio:'preserveAspectRatio','xlink:href':'xlinkHref','xml:space':'xmlSpace','xmlns:xlink':'xmlnsXlink','stroke-width':'strokeWidth','stroke-linecap':'strokeLinecap','stroke-linejoin':'strokeLinejoin','stroke-miterlimit':'strokeMiterlimit','stroke-dasharray':'strokeDasharray','stroke-dashoffset':'strokeDashoffset','fill-rule':'fillRule','clip-rule':'clipRule','fill-opacity':'fillOpacity','stroke-opacity':'strokeOpacity','stop-color':'stopColor','stop-opacity':'stopOpacity','font-family':'fontFamily','font-size':'fontSize','font-weight':'fontWeight','text-anchor':'textAnchor','dominant-baseline':'dominantBaseline','pointer-events':'pointerEvents','shape-rendering':'shapeRendering','color-interpolation':'colorInterpolation','color-interpolation-filters':'colorInterpolationFilters'
}));
const reactBooleanAttributes=new Set(['allowfullscreen','async','autofocus','autoplay','checked','controls','default','defer','disabled','formnovalidate','hidden','inert','loop','multiple','muted','nomodule','novalidate','open','playsinline','readonly','required','reversed','selected']);
const reactNumericAttributes=new Set(['tabIndex','colSpan','rowSpan','maxLength','minLength','size','start','rows','cols']);
function tokenizeFamilyHTML(source){
 const tokens=[];let cursor=0,textStart=0;
 while(cursor<source.length){
  if(source[cursor]!=='<'){cursor++;continue;}
  const comment=source.startsWith('<!--',cursor),tagStart=comment||/^<\s*\/?[A-Za-z]/.test(source.slice(cursor));
  if(!tagStart){cursor++;continue;}
  if(textStart<cursor)tokens.push({type:'text',value:source.slice(textStart,cursor)});
  if(comment){const end=source.indexOf('-->',cursor+4);if(end<0){tokens.push({type:'text',value:source.slice(cursor)});return tokens;}tokens.push({type:'comment',value:source.slice(cursor+4,end)});cursor=end+3;textStart=cursor;continue;}
  let quote='',end=-1;
  for(let i=cursor+1;i<source.length;i++){const char=source[i];if(quote){if(char===quote)quote='';continue;}if(char==='"'||char==="'"){quote=char;continue;}if(char==='>'){end=i;break;}}
  if(end<0){cursor++;continue;}
  tokens.push({type:'tag',value:source.slice(cursor,end+1)});cursor=end+1;textStart=cursor;
 }
 if(textStart<source.length)tokens.push({type:'text',value:source.slice(textStart)});
 return tokens;
}
function parseFamilyAttributes(source){
 const attributes=[],pattern=/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;let match;
 while((match=pattern.exec(source)))attributes.push({name:match[1],value:match[2]??match[3]??match[4]??null});
 return attributes;
}
function parseFamilyHTML(source){
 const root={type:'root',children:[]},stack=[root];
 for(const token of tokenizeFamilyHTML(source)){
  const parent=stack[stack.length-1];
  if(token.type==='text'){parent.children.push(token);continue;}
  if(token.type==='comment'){parent.children.push(token);continue;}
  const closing=token.value.match(/^<\s*\/\s*([A-Za-z][\w:.-]*)/);
  if(closing){for(let i=stack.length-1;i>0;i--)if(stack[i].tag.toLowerCase()===closing[1].toLowerCase()){stack.length=i;break;}continue;}
  const opening=token.value.match(/^<\s*([A-Za-z][\w:.-]*)/);if(!opening){parent.children.push({type:'text',value:token.value});continue;}
  const tag=opening[1],tail=token.value.slice(opening[0].length,-1),selfClosing=/\/\s*$/.test(tail),attributes=parseFamilyAttributes(tail.replace(/\/\s*$/,''));
  const node={type:'element',tag,attributes,children:[]};parent.children.push(node);
  if(!selfClosing&&!familyVoidTags.has(tag.toLowerCase()))stack.push(node);
 }
 return root;
}
function jsxAttributeName(name,tag){
 const lower=name.toLowerCase();
 if(lower==='value'&&['input','textarea'].includes(tag.toLowerCase()))return 'defaultValue';
 if(lower==='checked'&&tag.toLowerCase()==='input')return 'defaultChecked';
 if(reactAttributeNames.has(lower))return reactAttributeNames.get(lower);
 if(lower.startsWith('aria-')||lower.startsWith('data-'))return lower;
 return lower.replace(/:([a-z])/g,(_,letter)=>letter.toUpperCase()).replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase());
}
function jsxStyleValue(source){
 const declarations=[];let start=0,depth=0,quote='';
 for(let i=0;i<=source.length;i++){const char=source[i]??';';if(quote){if(char===quote&&source[i-1]!=='\\')quote='';continue;}if(char==='"'||char==="'"){quote=char;continue;}if(char==='(')depth++;else if(char===')')depth=Math.max(0,depth-1);else if(char===';'&&depth===0){const declaration=source.slice(start,i).trim();start=i+1;if(!declaration)continue;const colon=declaration.indexOf(':');if(colon<0)continue;const property=declaration.slice(0,colon).trim(),value=declaration.slice(colon+1).trim();if(!property||!value)continue;const key=property.startsWith('--')?JSON.stringify(property):property.replace(/^-ms-/,'ms-').replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase());declarations.push(`${key}: ${JSON.stringify(value)}`);}}
 return `{{ ${declarations.join(', ')} }}`;
}
function jsxTextValue(value){
 const collapsed=value.replace(/\s+/g,' ');if(!collapsed.trim())return '';
 const body=collapsed.trim().replace(/[{}]/g,char=>`{${JSON.stringify(char)}}`);
 return `${collapsed.startsWith(' ')?'{" "}':''}${body}${collapsed.endsWith(' ')?'{" "}':''}`;
}
function jsxTagName(tag){const lower=tag.toLowerCase();return lower==='foreignobject'?'foreignObject':tag;}
function jsxAttributes(node,warnings){
 const result=[];
 for(const attribute of node.attributes){
  const rawName=attribute.name.toLowerCase();if(/^on[a-z]/.test(rawName)){warnings.add('Inline HTML event handlers were omitted; add equivalent React callbacks in the application.');continue;}
  const name=jsxAttributeName(attribute.name,node.tag);
  if(rawName==='style'&&attribute.value!==null){result.push(`style=${jsxStyleValue(attribute.value)}`);continue;}
  if(reactBooleanAttributes.has(rawName)){result.push(name);continue;}
  if(attribute.value===null){result.push(`${name}=""`);continue;}
  if(reactNumericAttributes.has(name)&&/^-?\d+(?:\.\d+)?$/.test(attribute.value.trim())){result.push(`${name}={${attribute.value.trim()}}`);continue;}
  result.push(`${name}="${attribute.value.replace(/"/g,'&quot;')}"`);
 }
 return result.length?` ${result.join(' ')}`:'';
}
function isFamilyInline(node){return node.type==='text'?Boolean(node.value.trim()):node.type==='comment'||familyInlineTags.has(node.tag.toLowerCase());}
function jsxInlineNode(node,siblings,index,warnings){
 if(node.type==='text'){
  if(!node.value.trim()){const previous=siblings[index-1],next=siblings[index+1];return previous&&next&&isFamilyInline(previous)&&isFamilyInline(next)?'{" "}':'';}
  return jsxTextValue(node.value);
 }
 if(node.type==='comment')return `{/* ${node.value.replace(/\*\//g,'* /').trim()} */}`;
 const tag=jsxTagName(node.tag),attributes=jsxAttributes(node,warnings),children=node.children.map((child,i)=>jsxInlineNode(child,node.children,i,warnings)).join('');
 if(familyVoidTags.has(node.tag.toLowerCase())||node.children.length===0)return `<${tag}${attributes} />`;
 return `<${tag}${attributes}>${children}</${tag}>`;
}
function jsxBlockNode(node,depth,warnings){
 const indent='  '.repeat(depth);
 if(node.type==='text')return jsxTextValue(node.value)?`${indent}${jsxTextValue(node.value)}`:'';
 if(node.type==='comment')return `${indent}{/* ${node.value.replace(/\*\//g,'* /').trim()} */}`;
 const tag=jsxTagName(node.tag),attributes=jsxAttributes(node,warnings),meaningful=node.children.filter(child=>!(child.type==='text'&&!child.value.trim()));
 if(familyVoidTags.has(node.tag.toLowerCase())||meaningful.length===0)return `${indent}<${tag}${attributes} />`;
 if(meaningful.every(isFamilyInline))return `${indent}<${tag}${attributes}>${node.children.map((child,i)=>jsxInlineNode(child,node.children,i,warnings)).join('')}</${tag}>`;
 const children=node.children.map(child=>jsxBlockNode(child,depth+1,warnings)).filter(Boolean).join('\n');
 return `${indent}<${tag}${attributes}>\n${children}\n${indent}</${tag}>`;
}
function reactExampleName(id){const words=String(id).split(/[^A-Za-z0-9]+/).filter(Boolean);let name=words.map(word=>word[0].toUpperCase()+word.slice(1)).join('')||'Klic';if(!/^[A-Za-z_$]/.test(name))name=`Klic${name}`;return `${name}Example`;}
export function formatFamilyReact(source,id='component'){
 const root=parseFamilyHTML(String(source)),warnings=new Set(),body=root.children.map(node=>jsxBlockNode(node,3,warnings)).filter(Boolean).join('\n');
 const note=warnings.size?`// ${[...warnings].join('\n// ')}\n\n`:'';
 return `${note}import * as React from 'react';\n\nexport function ${reactExampleName(id)}() {\n  return (\n    <>\n${body||'      {/* Empty component example */}'}\n    </>\n  );\n}\n`;
}
export function componentForms(component,uid=`forms-${component.id}`){
 if(AFFECT_COMPONENTS.some(c=>c.id===component.id))return getAffectForms(component.id,uid).map(f=>({...f,reference:null}));
 if(isTerminalComponent(component.id))return terminalComponentForms(component,uid).map(form=>({...form,html:normalizeKlicMarkup(form.html,{componentId:component.id})}));
 return [{id:'default',name:'KLIC 기본형',description:component.description,html:specimen(component.id,`${uid}-default`),reference:null},...getAddedVariants(component.id,uid)];
}
export function componentVariantMetadata(component){
 return componentForms(component,`export-${component.id}`).map(({id,name,description,reference})=>({id,name,description,implementation:'native-html',reference:reference||null,source:{path:`/api/v1/sources/variants/${component.id}/${id}.html`,language:'html',usage:'reference',notice:'Original KLIC Native HTML implementation. External examples informed design review only; they are not included in this implementation. Use the component workspace for styles, tokens, icons and delegated interactions.'}}));
}
export function renderComponentFamily(component,uid,{detail=false,actions=''}={}){
 const forms=componentForms(component,uid);
 const cards=forms.map((form,index)=>`<article class="cf-card" data-cf-form="${esc(form.id)}"${!detail&&index?' hidden':''}><div class="cf-card-label"><span>${String(index+1).padStart(2,'0')}</span><strong>${esc(form.name)}</strong><span class="cf-origin">${index?'추가형':'기본형'}</span></div><div class="cf-canvas"><div class="cf-sample">${form.html}</div></div><div class="cf-card-foot"><p>${esc(form.description)}</p><div class="cf-source">${form.reference?`<a href="${esc(form.reference.url)}" target="_blank" rel="noopener noreferrer">${esc(form.reference.label)} ${icon('arrow-up-right')}</a><span>KLIC 적용</span>`:'<span>KLIC</span>'}</div><button class="cf-code-open" type="button" data-cf-open aria-haspopup="dialog" aria-label="${esc(form.name)} 코드 및 사용 방법">코드 · 사용 방법 ${icon('code-2')}</button></div></article>`).join('');
 const picker=!detail&&forms.length>1?`<div class="cf-form-picker" role="group" aria-label="${esc(component.ko||component.name)} 미리보기 형태">${forms.map((form,index)=>`<button type="button" class="cf-form-choice" data-cf-form-choice="${esc(form.id)}" aria-pressed="${index===0}" aria-label="${index?'추가형 '+String(index).padStart(2,'0'):'기본형'} · ${esc(form.name)}" title="${esc(form.name)}">${index?'추가형 '+String(index).padStart(2,'0'):'기본형'}</button>`).join('')}</div>`:'';
 const displayName=component.ko||component.name;
 return `<section class="cf-family${detail?' cf-detail':''}" data-cf-density="${familyDensity(component.id)}" data-cf-component="${component.id}" data-cf-instance="${esc(uid)}" aria-labelledby="${uid}-heading"><div class="cf-heading"><div><div class="cf-kicker"><span>네이티브 HTML</span><span>${forms.length}가지 형태</span></div><h${detail?'2':'4'} id="${uid}-heading"><a href="#component/${component.id}">${esc(displayName)}</a> <code class="cf-api-name">${esc(component.name)}</code></h${detail?'2':'4'}><p>${esc(component.description)}</p></div><div class="cf-heading-actions">${actions}<a class="btn secondary sm" href="#component/${component.id}/api">동작 · API ${icon('arrow-up-right')}</a></div></div>${picker}<div class="cf-grid">${cards}</div></section>`;
}
let initialized=false;
export function initComponentFamilies({catalog,copy,notify=()=>{}}){
 if(initialized)return;initialized=true;
 document.addEventListener('click',event=>{
  const choice=event.target.closest('[data-cf-form-choice]');if(!choice)return;
  const family=choice.closest('.cf-family'),formId=choice.dataset.cfFormChoice;if(!family)return;
  family.querySelectorAll('[data-cf-form]').forEach(card=>{card.hidden=card.dataset.cfForm!==formId;});
  family.querySelectorAll('[data-cf-form-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button===choice)));
 });
 document.addEventListener('click',async event=>{
  const control=event.target.closest('[data-mcp-terminal-client], [data-mcp-terminal-copy]');if(!control)return;
  const specimen=control.closest('[data-terminal-demo="macos-terminal"]');if(!specimen)return;
  const shell=control.closest('.hs-terminal');if(!shell)return;
  const clientButton=control.closest('[data-mcp-terminal-client]');
  if(clientButton){
   const client=clientButton.dataset.mcpTerminalClient;
   shell.querySelectorAll('[data-mcp-terminal-client]').forEach(button=>button.setAttribute('aria-pressed',String(button===clientButton)));
   shell.querySelector('[data-mcp-terminal-code]').textContent=MCP_TERMINAL_CLIENT_CONFIG[client];
   shell.querySelector('[data-hs-client-note]').textContent=mcpTerminalClientNote(client,document.documentElement.lang||'ko');
   return;
  }
  try{await copy?.(MCP_TERMINAL_CLIENT_CONFIG[shell.querySelector('[data-mcp-terminal-client][aria-pressed="true"]')?.dataset.mcpTerminalClient||'Codex'],'연결 설정을 복사했어요.');}
  catch{notify('복사하지 못했습니다. 코드 영역에서 직접 선택해주세요.');}
 });
 let dialog,opener,previousOverflow,source='',activeSource='',activeFormat='html',activeComponentId='',activeFormId='',activeFormName='';
 const close=()=>{if(dialog?.open)dialog.close();};
 function ensureDialog(){
  if(dialog)return dialog;
  dialog=document.createElement('dialog');dialog.className='cf-code-dialog';dialog.setAttribute('aria-labelledby','cf-code-title');document.body.append(dialog);
  dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow||'';if(opener?.isConnected)opener.focus({preventScroll:true});});
  dialog.addEventListener('click',async event=>{
   const formatButton=event.target.closest('[data-cf-format]');
   if(formatButton){
    activeFormat=formatButton.dataset.cfFormat==='react'?'react':'html';
    activeSource=activeFormat==='react'?formatFamilyReact(source,activeComponentId):formatFamilyHTML(source);
    dialog.querySelectorAll('[data-cf-format]').forEach(button=>button.setAttribute('aria-pressed',String(button===formatButton)));
    dialog.querySelector('[data-cf-filename]').textContent=`${activeComponentId}/${activeFormId}.${activeFormat==='react'?'tsx':'html'}`;
    dialog.querySelector('[data-cf-copy]').textContent=`${activeFormat==='react'?'React':'HTML'} 복사`;
    dialog.querySelector('[data-cf-code]').setAttribute('aria-label',`${activeFormName} ${activeFormat==='react'?'React JSX':'HTML'} 코드`);
    dialog.querySelector('[data-cf-code]').textContent=activeSource;
    return;
   }
   if(event.target.closest('[data-cf-close]'))close();
   if(event.target.closest('[data-cf-copy]')){try{await copy(activeSource,`${activeFormat==='react'?'React':'HTML'} 코드를 복사했어요.`);}catch{notify('복사하지 못했습니다. 코드 영역에서 직접 선택해주세요.');}}
  });
  window.addEventListener('hashchange',close);return dialog;
 }
 document.addEventListener('click',event=>{
  const button=event.target.closest('[data-cf-open]');if(!button)return;
  const family=button.closest('[data-cf-component]'),card=button.closest('[data-cf-form]'),component=catalog.find(c=>c.id===family?.dataset.cfComponent);if(!component)return;
  const form=componentForms(component,family.dataset.cfInstance).find(f=>f.id===card?.dataset.cfForm);if(!form)return;
  const modal=ensureDialog(),computed=getComputedStyle(button);
  // The top-layer dialog retains the selected item's local appearance context.
  modal.removeAttribute('style');for(let i=0;i<computed.length;i++){const key=computed[i];if(key.startsWith('--klic-'))modal.style.setProperty(key,computed.getPropertyValue(key));}
  modal.style.colorScheme=computed.colorScheme;source=card.querySelector('[data-cf-live-source]')?.innerHTML||form.html;activeComponentId=component.id;activeFormId=form.id;activeFormName=form.name;activeFormat='html';activeSource=formatFamilyHTML(source);opener=button;
  modal.innerHTML=`<header class="cf-code-header"><div><span>HTML · React</span><h2 id="cf-code-title">${esc(component.name)} / ${esc(form.name)}</h2></div><button type="button" class="btn secondary sm" data-cf-close autofocus aria-label="코드 패널 닫기">닫기</button></header><div class="cf-code-layout"><section class="cf-code-main" aria-label="형태 소스"><div class="cf-code-toolbar"><span data-cf-filename>${component.id}/${esc(form.id)}.html</span><div class="cf-code-formats" role="group" aria-label="코드 형식"><button type="button" data-cf-format="html" aria-pressed="true">HTML</button><button type="button" data-cf-format="react" aria-pressed="false">React</button></div><button class="btn secondary sm" type="button" data-cf-copy>HTML 복사</button></div><pre tabindex="0" aria-label="${esc(form.name)} HTML 코드"><code data-cf-code>${esc(activeSource)}</code></pre></section><aside class="cf-code-guide"><h3>프로젝트에 적용하기</h3><p>아래 latest 태그 명령으로 토큰·스타일·아이콘·동작 파일이 포함된 실행 소스를 가져오세요.</p><code>${packageCLICommand} add component ${component.id} --out ./klic-${component.id}</code><a href="#docs/cli">CLI 설치 · 사용 안내 ↗</a><h3>이 형태만 확인하기</h3><code>${packageCLICommand} source component ${component.id} --variant ${esc(form.id)}</code><h3>필요한 파일</h3><ul><li><a href="/component-families.css" target="_blank" rel="noopener">비교 화면 스타일</a></li><li><a href="/component-variants-examples.css" target="_blank" rel="noopener">추가형 컴포넌트 스타일</a></li><li><a href="/component-variants-interactions.mjs" target="_blank" rel="noopener">추가형 동작</a></li><li><a href="/styles.css" target="_blank" rel="noopener">기본형 스타일</a></li><li><a href="/api/v1/bundles/component/${component.id}.json" target="_blank" rel="noopener">전체 파일 목록 · 라이선스</a></li></ul><p>이 코드는 선택한 Native HTML 형태의 React JSX 예제입니다. 실제 동작과 상태 처리는 component workspace에 있습니다.</p>${form.reference?`<a href="${esc(form.reference.url)}" target="_blank" rel="noopener noreferrer">${esc(form.reference.label)} ↗</a>`:''}</aside></div>`;
  previousOverflow=document.body.style.overflow;modal.showModal();document.body.style.overflow='hidden';
 });
}
