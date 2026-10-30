import {initDocumentLinks} from './document-links.mjs';
import {initSiteChrome} from './site-chrome.mjs?v=20261025-polish-1';
import {initPublicTheme} from './public-theme.mjs';
initPublicTheme();initSiteChrome();
import {mountDiscoveryActions} from './discovery-content.mjs?v=20261030-delivery-1';
const en=document.documentElement.lang==='en';
async function copy(value){
 try{await navigator.clipboard.writeText(value);}catch{let area=document.querySelector('[data-manual-copy]');if(!area){area=document.createElement('textarea');area.dataset.manualCopy='';area.setAttribute('aria-label',en?'Select and copy manually':'직접 선택해 복사');document.querySelector('main').append(area);}area.value=value;area.focus();area.select();throw Error('manual');}
}
mountDiscoveryActions(document,{copy});
document.addEventListener('input',event=>{if(event.target.matches('[data-token-filter]')){const q=event.target.value.trim().toLowerCase();let count=0;for(const row of document.querySelectorAll('[data-token-row]')){row.hidden=!row.dataset.query.includes(q);if(!row.hidden)count++;}document.querySelector('[data-token-count]').textContent=`${count} tokens`;}});
document.addEventListener('click',event=>{
 const token=event.target.closest('[data-token-select]');if(token){const detail=document.getElementById(token.dataset.tokenSelect);detail.hidden=!detail.hidden;token.setAttribute('aria-expanded',String(!detail.hidden));}
 const density=event.target.closest('[data-density-mode]');if(density){for(const b of document.querySelectorAll('[data-density-mode]'))b.setAttribute('aria-pressed',String(b===density));for(const panel of document.querySelectorAll('[data-density-example]'))panel.dataset.selected=String(panel.dataset.densityExample===density.dataset.densityMode);document.querySelector('[data-density-status]').textContent=density.dataset.densityMode;}
});
document.addEventListener('change',event=>{if(event.target.matches('[data-accessibility-check]'))document.querySelector('[data-accessibility-status]').textContent=`${document.querySelectorAll('[data-accessibility-check]:checked').length} / ${document.querySelectorAll('[data-accessibility-check]').length}`;});
document.querySelector('[data-klic-language]')?.addEventListener('change',event=>{const url=new URL(location.href);if(event.target.value==='en')url.searchParams.set('lang','en');else url.searchParams.delete('lang');location.assign(url.href);});

if(typeof document!=='undefined')initDocumentLinks();
