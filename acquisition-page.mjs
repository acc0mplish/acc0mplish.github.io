import {initLogoForms} from './logo-forms.mjs?v=20261026-forms-2';
import {initLogoShowcase} from './logo-showcase.mjs';
import {initDocumentLinks} from './document-links.mjs';
import {initSiteChrome} from './site-chrome.mjs?v=20261025-polish-1';
import {initPublicTheme} from './public-theme.mjs';
import {buildDesignBrief,recipeById,recipeReferences} from './acquisition-content.mjs';
export async function copyBrief(text,{clipboard=globalThis.navigator?.clipboard,success=()=>{},fallback=()=>{}}={}){
 try{if(!clipboard?.writeText)throw new Error('Clipboard unavailable');await clipboard.writeText(text);success();return true;}catch{fallback(text);return false;}
}
export function initAcquisitionPage(doc=document,win=window){
 const locale=doc.documentElement.lang==='en'?'en':'ko',T=(ko,en)=>locale==='en'?en:ko;
 doc.querySelector('[data-klic-language]')?.addEventListener('change',event=>{const url=new URL(win.location.href);if(event.target.value==='en')url.searchParams.set('lang','en');else url.searchParams.delete('lang');win.location.assign(url.href);});
 const form=doc.querySelector('[data-brief-form]');if(!form)return;
 const recipe=doc.querySelector('#brief-recipe'),notes=doc.querySelector('#brief-notes'),output=doc.querySelector('#brief-output'),status=doc.querySelector('[data-brief-status]'),dialog=doc.querySelector('[data-copy-fallback]');
 const emit=action=>win.dispatchEvent(new CustomEvent('klic:conversion',{detail:{action,recipe:recipe.value,placement:'start'}}));
 const update=()=>{if(!recipeById(recipe.value))return;output.value=buildDesignBrief(recipe.value,locale,notes.value);doc.querySelector('[data-brief-references]').innerHTML=recipeReferences(recipeById(recipe.value),locale);status.textContent='';const url=new URL(win.location.href);url.searchParams.set('recipe',recipe.value);win.history.replaceState(null,'',url.href);};
 const checked=doc.querySelector('[data-recipe-choice]:checked');if(recipeById(checked?.value))recipe.value=checked.value;update();
 for(const radio of doc.querySelectorAll('[data-recipe-choice]'))radio.addEventListener('change',()=>{recipe.value=radio.value;update();});
 form.addEventListener('submit',event=>event.preventDefault());recipe.addEventListener('change',update);notes.addEventListener('input',update);
 doc.querySelector('[data-copy-brief]').addEventListener('click',()=>copyBrief(output.value,{success:()=>{status.textContent=T('설계 요청서를 복사했습니다. 사용 중인 AI에 붙여 넣으세요.','Design brief copied. Paste it into your AI.');emit('brief_copy');},fallback:text=>{dialog.querySelector('textarea').value=text;dialog.showModal();dialog.querySelector('textarea').select();status.textContent=T('자동 복사가 지원되지 않습니다. 열린 창에서 직접 복사하세요.','Automatic copying is unavailable. Copy from the open dialog.');}}));
 doc.querySelector('[data-close-fallback]').addEventListener('click',()=>dialog.close());
 doc.querySelector('[data-download-brief]').addEventListener('click',event=>{event.preventDefault();const url=URL.createObjectURL(new Blob([output.value],{type:'text/markdown;charset=utf-8'})),a=doc.createElement('a');a.href=url;a.download='KLIC-DESIGN-BRIEF.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);emit('brief_download');status.textContent=T('Markdown 다운로드를 요청했습니다.','Markdown download requested.');});
}
if(typeof document!=='undefined'){initPublicTheme();initSiteChrome();initAcquisitionPage();}

if(typeof document!=='undefined')initDocumentLinks();

if(typeof document!=='undefined')initLogoShowcase();

if(typeof document!=='undefined')initLogoForms();
