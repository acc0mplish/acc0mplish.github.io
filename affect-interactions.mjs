/** KLIC native adaptation of Affect UI Classic; MIT © Florian Höller; pinned source in affect-components.mjs. */
import {affectTransition,renderAffectContent} from './affect-components.mjs';
let installed;
export function initAffectInteractions({copy,notify}={}){
 if(installed)return installed;
 const states=new WeakMap(),pending=new Map();let speechOwner=null,observer;
 const get=root=>{if(!states.has(root)){try{states.set(root,JSON.parse(root.dataset.afInitial));}catch{return null;}}return states.get(root);};
 const render=(root,state,focusAction,focusValue)=>{
  const previous=root.contains(document.activeElement)?document.activeElement:null;focusAction=focusAction||previous?.dataset?.afAction;focusValue=focusValue??previous?.dataset?.afValue;
  states.set(root,state);root.innerHTML=renderAffectContent(state,root.dataset.afUid);
  if(focusAction){const buttons=[...root.querySelectorAll('[data-af-action]')];const target=buttons.find(b=>b.dataset.afAction===focusAction&&b.dataset.afValue===String(focusValue??'')&&!b.disabled)||buttons.find(b=>!b.disabled);target?.focus({preventScroll:true});}
 };
 const apply=(root,action,value,focus=false)=>{const s=get(root);if(!s)return;render(root,affectTransition(s,action,value),focus?action:null,value);};
 const cancelRoot=root=>{for(const timer of pending.get(root)||[])clearTimeout(timer);pending.delete(root);if(speechOwner===root){globalThis.speechSynthesis?.cancel();speechOwner=null;}};
 const later=(root,fn)=>{const timer=setTimeout(()=>{pending.get(root)?.delete(timer);if(root.isConnected)fn();if(!pending.get(root)?.size)pending.delete(root);},900);if(!pending.has(root))pending.set(root,new Set());pending.get(root).add(timer);};
 const announce=(root,message)=>{if(!root.isConnected)return;apply(root,'notice',message);notify?.(message);};
 const copyText=async(root,text)=>{try{if(copy){const result=await copy(text);if(result===false)throw new Error('Clipboard failed');}else if(globalThis.navigator?.clipboard?.writeText)await navigator.clipboard.writeText(text);else throw new Error('Clipboard unavailable');announce(root,'복사했습니다.');}catch{announce(root,'복사할 수 없습니다. 내용을 직접 선택해 복사해주세요.');}};
 const speech=root=>{
  const s=get(root);if(!('speechSynthesis' in globalThis)||!('SpeechSynthesisUtterance' in globalThis)){announce(root,'이 브라우저는 음성 읽기를 지원하지 않습니다. 응답 텍스트를 직접 읽어주세요.');return;}
  if(speechOwner){const previous=speechOwner;globalThis.speechSynthesis.cancel();speechOwner=null;if(previous.isConnected&&get(previous)?.speaking)apply(previous,'speech-end');if(previous===root)return;}
  const utterance=new SpeechSynthesisUtterance(s.versions[s.version]);utterance.lang='ko-KR';speechOwner=root;apply(root,'speech');
  const end=()=>{if(speechOwner!==root)return;speechOwner=null;if(root.isConnected)apply(root,'speech-end');};
  utterance.onend=end;utterance.onerror=()=>{end();if(root.isConnected)announce(root,'음성 재생을 완료하지 못했습니다. 텍스트로 확인해주세요.');};
  globalThis.speechSynthesis.speak(utterance);
 };
 const click=e=>{
  const button=e.target.closest?.('[data-af-action]');const root=button?.closest('[data-af-family]');if(!root||button.disabled)return;
  const action=button.dataset.afAction,value=button.dataset.afValue??'',s=get(root);if(!s)return;
  if(action==='copy-message'){void copyText(root,s.versions[s.version]);return;}
  if(action==='copy-code'){const [i,kind]=value.split(':');if(s.calls?.[i]&&['args','result'].includes(kind))void copyText(root,JSON.stringify(s.calls[i][kind],null,2));return;}
  if(action==='speech'){speech(root);return;}
  if(action==='undo')cancelRoot(root);
  if(action==='regenerate'&&s.busy)return;
  if(action==='run'&&s.calls[Number(value)]?.status==='running')return;
  apply(root,action,value,true);
  if(action==='undo'&&s.family==='decision-inbox')get(root).rows.forEach((row,i)=>{if(row.answered&&!row.gone)later(root,()=>apply(root,'fold',i));});
  if(action==='answer'){const idx=value.split(':')[0];later(root,()=>{const active=root.contains(document.activeElement);apply(root,'fold',idx,active);});}
  if(action==='run')later(root,()=>apply(root,'complete',value));
  if(action==='regenerate')later(root,()=>apply(root,'generated'));
 };
 const input=e=>{const root=e.target.closest?.('[data-af-family]');if(root&&e.target.matches('[data-af-feedback]')){const s=get(root);if(s)s.feedback=e.target.value;}};
 const keydown=e=>{if(e.key!=='Escape')return;const root=e.target.closest?.('[data-af-family]');if(!root)return;const s=get(root);if(s?.alternatives){apply(root,'alternatives','');root.querySelector('[data-af-action="alternatives"]')?.focus();e.stopPropagation();}else if(s?.panel){apply(root,'close-feedback','');root.querySelector('[data-af-action="vote"][data-af-value="down"]')?.focus();e.stopPropagation();}};
 const pointer=e=>{document.querySelectorAll('[data-af-family="smart-recommendation"]').forEach(root=>{const s=states.get(root);if(s?.alternatives&&!root.contains(e.target))apply(root,'alternatives','');});};
 document.addEventListener('click',click);document.addEventListener('input',input);document.addEventListener('keydown',keydown);document.addEventListener('pointerdown',pointer);
 if(globalThis.MutationObserver){observer=new MutationObserver(()=>{for(const root of pending.keys())if(!root.isConnected)cancelRoot(root);if(speechOwner&&!speechOwner.isConnected)cancelRoot(speechOwner);});observer.observe(document.documentElement,{childList:true,subtree:true});}
 installed=()=>{document.removeEventListener('click',click);document.removeEventListener('input',input);document.removeEventListener('keydown',keydown);document.removeEventListener('pointerdown',pointer);observer?.disconnect();for(const root of [...pending.keys()])cancelRoot(root);if(speechOwner)cancelRoot(speechOwner);installed=null;};
 return installed;
}

/*
MIT License

Copyright (c) 2026 Florian Höller (adfects)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
