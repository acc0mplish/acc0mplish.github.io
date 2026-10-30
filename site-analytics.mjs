import {SITE_ORIGIN} from './site-metadata.mjs';
const origin=SITE_ORIGIN;
export function analyticsPage(href){
 let url;try{url=new URL(href);}catch{return null;}
 if(url.origin!==origin||url.searchParams.get('embed')==='1')return null;
 const p=url.pathname;
 if(!(p==='/'||p==='/index.html'||['/start','/about','/solutions/dashboards','/solutions/admin','/solutions/diagrams'].includes(p)||/^\/share\/(?:component|block)\/[a-z0-9-]+$/.test(p)||/^\/(?:guides|collections)\/[a-z0-9-]+$/.test(p)))return null;
 const page=new URL(p==='/index.html'?'/':p,origin);if(url.searchParams.get('lang')==='en')page.searchParams.set('lang','en');
 const hash=url.hash.slice(1);if(/^(?:blocks|component|components|fonts|tokens|docs|settings|lab|playground|agents|releases|favorites|home)(?:\/[a-z0-9-]+){0,3}$/.test(hash))page.hash=hash;
 return {page_location:page.href,page_title:'KLIC'+(page.hash?' · '+page.hash.slice(1):p!=='/'?' · '+p.slice(1):'')};
}
export function discoveryAttribution(href,referrer=''){
 const sources={'chatgpt.com':'chatgpt','chat.openai.com':'chatgpt','perplexity.ai':'perplexity','claude.ai':'claude','gemini.google.com':'gemini','copilot.microsoft.com':'copilot','google.com':'google','bing.com':'bing','search.naver.com':'naver'};
 let page_referrer='',source='';try{const u=new URL(referrer),host=u.hostname.replace(/^www\./,'');if(u.protocol==='https:'&&Object.hasOwn(sources,host)){page_referrer=u.origin+'/';source=sources[host];}}catch{}
 try{const u=new URL(href),tag=(u.searchParams.get('utm_source')||'').toLowerCase();source=(Object.hasOwn(sources,tag)?sources[tag]:'')||Object.values(sources).find(x=>x===tag)||source;}catch{}
 return {page_referrer,discovery_source:source||'direct_or_unknown'};
}
export function sessionAttribution(href,referrer='',storage,now=Date.now()){
 let current=discoveryAttribution(href,referrer),internal=!referrer;try{internal=new URL(referrer).origin===origin;}catch{}
 try{
  if(current.discovery_source==='direct_or_unknown'&&internal){const prior=JSON.parse(storage?.getItem('klic-discovery-v1')||'null');if(prior&&prior.expiresAt>now&&prior.expiresAt<=now+1800000){const clean=discoveryAttribution(origin+'/?utm_source='+encodeURIComponent(prior.discovery_source),prior.page_referrer);if(clean.discovery_source===prior.discovery_source&&clean.page_referrer===prior.page_referrer)current=clean;}}
  storage?.setItem('klic-discovery-v1',JSON.stringify({...current,expiresAt:now+1800000}));
 }catch{}
 return current;
}
export function conversionEvent(detail={}){
 if(!detail||typeof detail!=='object'||Array.isArray(detail))return null;
 const {action,recipe='none',placement='unknown'}=detail;
 if(!['start_open','solution_open','library_open','example_open','source_open','brief_copy','brief_download'].includes(action)||!['none','dashboards','admin','diagrams'].includes(recipe)||!['unknown','header','hero','collection','ai','closing','solution','start'].includes(placement))return null;
 return {event_name:'klic_'+action,recipe,placement};
}
export function createPageTracker(send,attribution={page_referrer:'',discovery_source:'direct_or_unknown'}){let last='';return href=>{const page=analyticsPage(href);if(!page||page.page_location===last)return;last=page.page_location;send('event','page_view',{...page,...attribution});};}
if(typeof window!=='undefined'&&window.top===window){
 const node=document.querySelector('[data-klic-site-config]');let config;try{config=JSON.parse(node?.textContent||'{}');}catch{config={};}
 if(/^G-[A-Z0-9]{5,20}$/.test(config.gaMeasurementId||'')&&analyticsPage(location.href)){
  window.dataLayer=window.dataLayer||[];function send(){window.dataLayer.push(arguments);}
  // Analytics only: do not enable ad storage, personalized advertising or Google signals.
  send('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});
  let storage;try{storage=window.sessionStorage;}catch{}const attribution=sessionAttribution(location.href,document.referrer,storage);send('js',new Date());send('config',config.gaMeasurementId,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:analyticsPage(location.href).page_location,page_title:analyticsPage(location.href).page_title,...attribution,ignore_referrer:true});
  const track=createPageTracker(send,attribution);track(location.href);window.addEventListener('hashchange',()=>track(location.href));window.addEventListener('popstate',()=>track(location.href));
  window.addEventListener('klic:conversion',event=>{const data=conversionEvent(event.detail);if(data){const {event_name,...fields}=data;send('event',event_name,{...fields,...analyticsPage(location.href),...attribution});}});
  document.addEventListener?.('click',event=>{const target=event.target?.closest?.('[data-klic-track]');if(!target)return;const data=conversionEvent({action:target.dataset.klicTrack,recipe:target.dataset.recipe,placement:target.dataset.placement});if(data){const {event_name,...fields}=data;send('event',event_name,{...fields,...analyticsPage(location.href),...attribution});}});
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(config.gaMeasurementId);script.referrerPolicy='no-referrer';document.head.append(script);
 }
}
