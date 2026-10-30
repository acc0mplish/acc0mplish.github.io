const managers=['bun','npm'];

export function resourceTabKey(key,current){
 const index=managers.indexOf(current);
 if(index<0)return null;
 if(key==='Home')return managers[0];
 if(key==='End')return managers[managers.length-1];
 if(key==='ArrowRight')return managers[(index+1)%managers.length];
 if(key==='ArrowLeft')return managers[(index+managers.length-1)%managers.length];
 return null;
}

export function activateResourceTab(root,id,{focus=false,onChange}={}){
 if(!root||!managers.includes(id))return false;
 let selected,wasSelected=false;
 root.querySelectorAll('[data-resource-tab]').forEach(tab=>{
  const active=tab.dataset.resourceTab===id;
  if(active)wasSelected=tab.getAttribute?.('aria-selected')==='true';
  tab.setAttribute('aria-selected',String(active));tab.setAttribute('tabindex',active?'0':'-1');
  if(active)selected=tab;
 });
 if(!selected)return false;
 root.querySelectorAll('[data-resource-panel]').forEach(panel=>{panel.hidden=panel.dataset.resourcePanel!==id;});
 if(!wasSelected)onChange?.();
 if(focus)selected.focus();
 return true;
}

export function resourceCopyText(root){
 return (root.querySelector('[data-resource-panel]:not([hidden]) code')||root.querySelector('pre code'))?.textContent||'';
}

export function initResourceCodeTabs(doc){
 const change=(tab,options={})=>{
  const root=tab.closest('[data-resource-code-tabs]');
  return activateResourceTab(root,options.id||tab.dataset.resourceTab,{focus:options.focus,onChange:()=>{
   const copy=root.querySelector('[data-resource-copy]');if(copy)copy.textContent=copy.dataset.resourceCopyLabel;
   const status=doc.querySelector('[data-resource-status]');if(status)status.textContent='';
   const manual=doc.querySelector('[data-resource-manual]');if(manual){manual.value='';manual.hidden=true;}
  }});
 };
 doc.addEventListener('click',event=>{
  const tab=event.target.closest('[data-resource-tab]');
  if(tab)change(tab);
 });
 doc.addEventListener('keydown',event=>{
  const tab=event.target.closest('[data-resource-tab]');if(!tab)return;
  const next=resourceTabKey(event.key,tab.dataset.resourceTab);if(!next)return;
  event.preventDefault();change(tab,{id:next,focus:true});
 });
}
