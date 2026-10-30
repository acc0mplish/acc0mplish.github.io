import {SITE_ORIGIN} from './site-metadata.mjs';
/** Raw documents open beside the library; explicit downloads keep native behavior. */
export function isDocumentLink(href){
 if(typeof href!=='string'||!href.trim()||/^(?:#|javascript:|data:|blob:|mailto:|tel:)/i.test(href.trim()))return false;
 try{const url=new URL(href.replaceAll('&amp;','&'),SITE_ORIGIN+'/');return ['http:','https:'].includes(url.protocol)&&/\.(?:txt|json|md|xml|ya?ml|csv|tsv|log|pdf|m?js|css|tsx?|jsx|svg)$/i.test(url.pathname);}catch{return false;}
}
const attribute=(tag,name)=>tag.match(new RegExp('(?:^|\\s)'+name+'\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))','i'));
const hasDownload=tag=>/\sdownload(?:\s|=|\/?>)/i.test(tag);
function setAttribute(tag,name,value){const match=attribute(tag,name);return match?tag.replace(match[0],` ${name}="${value}"`):tag.replace(/\s*\/?>$/,end=>` ${name}="${value}"${end}`);}
export function documentLinkHTML(html){
 return html.replace(/<(script|style|textarea)\b[^>]*>[\s\S]*?<\/\1\s*>|<a\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi,tag=>{
  if(!/^<a\b/i.test(tag)||hasDownload(tag))return tag;
  const href=attribute(tag,'href');if(!isDocumentLink(href?.[1]??href?.[2]??href?.[3]))return tag;
  const rel=attribute(tag,'rel'),values=new Set((rel?.[1]??rel?.[2]??rel?.[3]??'').split(/\s+/).filter(Boolean));values.add('noopener');values.add('noreferrer');
  return setAttribute(setAttribute(tag,'target','_blank'),'rel',[...values].join(' '));
 });
}
export function updateDocumentLink(anchor){
 if(!anchor||anchor.hasAttribute('download')||!isDocumentLink(anchor.getAttribute('href')))return;
 anchor.setAttribute('target','_blank');for(const value of ['noopener','noreferrer'])anchor.relList.add(value);
}
export function updateDocumentLinks(root){for(const anchor of root?.querySelectorAll?.('a[href]')||[])updateDocumentLink(anchor);}
export function initDocumentLinks(doc=globalThis.document){
 if(!doc?.addEventListener)return ()=>{};
 updateDocumentLinks(doc);
 const click=event=>updateDocumentLink(event.target?.closest?.('a[href]'));
 // Capture catches links added after route rendering before their default navigation.
 doc.addEventListener('click',click,true);
 return ()=>doc.removeEventListener('click',click,true);
}
