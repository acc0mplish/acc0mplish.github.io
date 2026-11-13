import {DESIGN_SYSTEM} from './design-system-data.mjs';

const variantValues=new Set((DESIGN_SYSTEM.classNamingPolicy?.variantAxes||[]).flatMap(axis=>axis.values));
const componentVariants=new Map((DESIGN_SYSTEM.classNamingPolicy?.variantAxes||[]).flatMap(axis=>axis.values.map(value=>[value,axis.axis])));
const utilityNames=new Set(['actions','button-row','columns','center','flex','grid','grid-2','grow','inline','joined','row','scroll','stack','visually-hidden']);
const synonymVariants=new Map([
 ['primary','kv-primary'],['neutral','kv-neutral'],['secondary','kv-neutral'],['success','kv-success'],['warning','kv-warning'],['danger','kv-danger'],['amber','kv-warning'],['blue','kv-primary'],['rose','kv-danger'],['solid','kv-solid'],['outline','kv-outline'],['ghost','kv-ghost'],['sm','kv-sm'],['md','kv-md'],['lg','kv-lg'],['compact','kv-compact'],['normal','kv-normal'],['relaxed','kv-relaxed']
]);
const stateNames=new Set(['active','checked','disabled','focused','open','selected']);
const extendedStateNames=new Set(['active','empty','loading','busy','error']);

export function componentClassName(id){
 const safe=String(id||'').toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'');
 return safe==='button'?'kn-btn':safe?`kn-${safe}`:'';
}

function utilityClass(name){
 const clean=String(name).toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'');
 return `ku-${clean}`;
}

export function canonicalClassName(token,{componentId='',root=false}={}){
 const value=String(token||'').trim();if(!value)return '';
 if(variantValues.has(value))return value;
 if(/^(?:kb|kn|kx|ku)-[a-z0-9-]+$/.test(value))return value;
 if(/^af-[a-z0-9-]+$/.test(value))return value;
 if(value==='kv-demo'||value==='x-demo'||value==='overlay-demo')return 'kn-demo';
 if(/^kv-form-[a-z0-9-]+$/.test(value))return '';
 if(/^kv-family-/.test(value)||/^xc-/.test(value))return componentClassName(componentId)||`kn-${value.replace(/^(?:kv-family-|xc-)/,'')}`;
 if(value==='kv-selected'||value==='selected'||value==='active'||value==='open'||value==='checked'||value==='disabled'||value==='focused')return '';
 if(value==='kv-button'||value==='btn'||value==='button')return 'kn-btn';
 if(value==='kv-demo')return 'kn-demo';
 if(value==='sr-only')return 'ku-visually-hidden';
 if(value.startsWith('x-')){
  const suffix=value.slice(2);
  return utilityNames.has(suffix)?utilityClass(suffix):`kn-${suffix}`;
 }
 if(value.startsWith('kv-')){
  const suffix=value.slice(3);
  return utilityNames.has(suffix)?utilityClass(suffix):`kn-${suffix}`;
 }
 if(value.startsWith('klic-terminal'))return root&&componentId?componentClassName(componentId):`kn-${value.replace(/^klic-/,'')}`;
 if(value.startsWith('demo-'))return `kn-${value.slice(5)}`;
 if(value.startsWith('klic-'))return `kn-${value.slice(5)}`;
 if(synonymVariants.has(value))return synonymVariants.get(value);
 if(utilityNames.has(value))return utilityClass(value);
 if(value==='text-link'||value==='link')return 'kn-link';
 if(value==='badge')return 'kn-badge';
 if(value==='input')return 'kn-input';
 if(value==='select')return 'kn-select';
 if(value==='table')return 'kn-table';
 if(value==='dialog')return 'kn-dialog';
 if(value==='switch')return 'kn-switch';
 if(value==='spinner')return 'kn-spinner';
 if(value==='accordion')return 'kn-accordion';
 if(value==='popover')return 'kn-popover';
 return `kn-${value.replace(/[^a-z0-9-]+/gi,'-').replace(/^-+|-+$/g,'')}`;
}

function readAttribute(tag,name){
 const range=attributeRange(tag,name);
 if(!range)return null;
 const attribute=tag.slice(range.start,range.end),match=attribute.match(/^\S+\s*=\s*(["'])([\s\S]*?)\1$/);
 return match?.[2]??'';
}
function hasAttribute(tag,name){
 return Boolean(attributeRange(tag,name));
}
function attributeRange(tag,name){
 const opening=tag.match(/^<\s*[^\s/>]+/)?.[0];if(!opening)return null;
 const limit=tag.endsWith('>')?tag.length-1:tag.length;let index=opening.length;
 while(index<limit){
  while(index<limit&&/[\s/]/.test(tag[index]))index++;
  if(index>=limit)break;
  const start=index;while(index<limit&&/[^\s=/>]/.test(tag[index]))index++;
  if(start===index){index++;continue;}
  const attributeName=tag.slice(start,index);while(index<limit&&/\s/.test(tag[index]))index++;
  if(tag[index]==='='){
   index++;while(index<limit&&/\s/.test(tag[index]))index++;
   const quote=tag[index];
   if(quote==='"'||quote==="'"){index++;while(index<limit&&tag[index]!==quote)index++;if(index<limit)index++;}
   else while(index<limit&&/[^\s>]/.test(tag[index]))index++;
  }
  if(attributeName.toLowerCase()===name.toLowerCase())return {start,end:index};
 }
 return null;
}
function setAttribute(tag,name,value){
 const replacement=`${name}="${String(value).replaceAll('&','&amp;').replaceAll('"','&quot;')}"`,range=attributeRange(tag,name);
 if(range)return tag.slice(0,range.start)+replacement+tag.slice(range.end);
 const close=tag.lastIndexOf('>');if(close<0)return tag;
 const slash=tag[close-1]==='/'?close-1:close;
 return tag.slice(0,slash)+` ${replacement}`+tag.slice(slash);
}
function removeAttribute(tag,name){
 const range=attributeRange(tag,name);if(!range)return tag;
 let start=range.start;while(start>0&&/\s/.test(tag[start-1]))start--;
 return tag.slice(0,start)+tag.slice(range.end);
}
function rewriteTag(tag,{componentId='',blockId='',root=false}={}){
 if(/^<\//.test(tag)||/^<!/.test(tag)||/^<\?/.test(tag))return tag;
 const tagName=tag.match(/^<\s*([a-z][\w:-]*)/i)?.[1]?.toLowerCase()||'';
 const existingComponent=readAttribute(tag,'data-klic-component')||readAttribute(tag,'data-kv-component');
 const id=blockId||existingComponent||componentId;
 const classMatches=[...tag.matchAll(/\bclass\s*=\s*(["'])(.*?)\1/gi)];
 const oldTokens=classMatches.flatMap(match=>match[2].split(/\s+/).filter(Boolean));
 const classes=new Set();let state=readAttribute(tag,'data-state');
 const partNames=new Set((readAttribute(tag,'data-part')||'').split(/\s+/).filter(Boolean));
 for(const token of oldTokens){
  if(token==='kv-selected'||token==='selected'){
   state='selected';
   if(tagName==='button')tag=setAttribute(tag,'aria-pressed','true');
   continue;
  }
  const explicitState=token.startsWith('is-')&&extendedStateNames.has(token.slice(3));
  const stateName=explicitState?token.slice(3):token;
  if(stateNames.has(stateName)||explicitState){
   if(stateName==='active'&&readAttribute(tag,'aria-current'))continue;
   if(stateName==='disabled'&&hasAttribute(tag,'disabled'))continue;
   state=stateName;continue;
  }
  const normalized=canonicalClassName(token,{componentId:id,root});
  if(normalized){
   if(normalized==='kn-spinner')classes.add('ku-spin');
   if(root&&normalized.startsWith('kn-'))continue;
   if(!root&&normalized.startsWith('kn-')){partNames.add(normalized.slice(3));continue;}
   classes.add(normalized);
   if(!root&&normalized.startsWith('ku-'))partNames.add(normalized.slice(3));
  }
 }
 const rootName=blockId?`kb-${String(blockId).toLowerCase().replace(/[^a-z0-9-]+/g,'-')}`:componentClassName(id);
 if(root){
  if(rootName)classes.add(rootName);
  if(componentId&&!blockId)tag=setAttribute(tag,'data-klic-component',componentId);
  if(blockId)tag=setAttribute(tag,'data-klic-block',blockId);
  if(componentId==='popover'||existingComponent==='popover')state=state||'closed';
 }
 if(tagName==='button'&&!root)partNames.add('btn');
 if(tagName==='i')partNames.add('icon');
 if(tagName==='textarea'&&!root)partNames.add('textarea');
 if(tagName==='select'&&!root)partNames.add('select');
 if(tagName==='a'&&readAttribute(tag,'href'))classes.add('kn-link');
 if(tagName==='a'&&readAttribute(tag,'href')&&!root){classes.delete('kn-link');partNames.add('link');}
 if(tagName==='dialog'&&!root)partNames.add('dialog');
 if(tagName==='input'){
  const type=readAttribute(tag,'type');
  const part=type==='checkbox'?'checkbox':type==='radio'?'radio':type==='range'?'slider':'input';
  if(!root)partNames.add(part);
 }
 if(hasAttribute(tag,'popover'))state=state||'closed';
 const classValue=[...classes].join(' ');
 if(classMatches.length)tag=tag.replace(/\sclass\s*=\s*(["'])(.*?)\1/gi,'');
 if(classValue)tag=setAttribute(tag,'class',classValue);
 if(partNames.size)tag=setAttribute(tag,'data-part',[...partNames].join(' '));
 if(state)tag=setAttribute(tag,'data-state',state);
 return tag;
}

export function normalizeKlicMarkup(markup,{componentId='',blockId=''}={}){
 const source=String(markup??'');let rootSeen=false;
 const result=source.replace(/<!--[\s\S]*?-->|<\/?[A-Za-z][^>]*>/g,tag=>{
  if(/^<\//.test(tag)||/^<!/.test(tag))return tag;
  const root=!rootSeen;rootSeen=true;
  return rewriteTag(tag,{componentId,blockId,root});
 });
 if(!rootSeen)return source;
 return result;
}

export function classVariantsConflict(tokens){
 const axes=new Map();
 for(const token of tokens){const axis=componentVariants.get(token);if(!axis)continue;const values=axes.get(axis)||new Set();values.add(token);axes.set(axis,values);}
 return [...axes].filter(([,values])=>values.size>1).map(([axis,values])=>({axis,values:[...values]}));
}

export const KLIC_VARIANT_CLASSES=Object.freeze([...variantValues]);
