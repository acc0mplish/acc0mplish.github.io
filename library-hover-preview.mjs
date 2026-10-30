import {THUMBNAIL_REVISION} from './thumbnail-version.mjs';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function hoverPreviewPosition(anchor,viewport,card){
 const margin=12,right=anchor.right+margin,left=right+card.width<=viewport.width-margin?right:anchor.left-card.width-margin;
 return {left:Math.max(margin,Math.min(left,viewport.width-card.width-margin)),top:Math.max(margin,Math.min((anchor.top+anchor.bottom-card.height)/2,viewport.height-card.height-margin))};
}
export function hoverPreviewMarkup(item,theme='light'){
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item?.id))throw new Error('Invalid hover preview ID');
 const src='./block-thumbnails/'+item.id+(theme==='dark'?'.dark':'')+'.html?v='+THUMBNAIL_REVISION;
 return `<div class="library-hover-image" aria-hidden="true"><iframe src="${src}" title="${esc(item.title)} 실제 데이터 썸네일" tabindex="-1" sandbox="allow-same-origin"></iframe></div><div class="library-hover-caption"><p>${esc(item.categoryLabel||item.scope)}</p><strong>${esc(item.label)}</strong></div>`;
}
export function initLibraryHoverPreview(root,{getItem,isBlocks=()=>true}={}){
 const doc=root.ownerDocument,win=doc.defaultView,card=doc.createElement('aside');
 card.id='library-hover-preview';card.className='library-hover-preview';card.hidden=true;card.setAttribute('role','tooltip');card.setAttribute('popover','manual');doc.body.append(card);
 let anchor=null,pending=null,showTimer,hideTimer;
 const supported=()=>win.innerWidth>=700&&!win.matchMedia('(hover: none)').matches;
 function clear(){win.clearTimeout(showTimer);win.clearTimeout(hideTimer);pending=null;}
 function hide(){clear();anchor?.removeAttribute('aria-describedby');anchor=null;if(card.matches(':popover-open'))card.hidePopover();card.hidden=true;card.replaceChildren();}
 function position(){
  if(!anchor?.isConnected){hide();return;}
  const uiScale=Number(getComputedStyle(doc.documentElement).getPropertyValue('--klic-ui-scale'))||1;
  card.style.zoom=String(1/uiScale);
  const link=anchor.getBoundingClientRect(),sidebar=root.closest('.sidebar')?.getBoundingClientRect();
  const reference={left:sidebar?.left??link.left,right:sidebar?.right??link.right,top:link.top,bottom:link.bottom};
  const bounds=card.getBoundingClientRect(),point=hoverPreviewPosition(reference,{width:win.innerWidth,height:win.innerHeight},{width:bounds.width,height:bounds.height});
  card.style.left=point.left+'px';card.style.top=point.top+'px';
 }
 function show(link){
  const item=getItem(link.dataset.libraryItem);if(!item||!link.isConnected||!isBlocks()||!supported())return;
  const list=root.querySelector('.library-tree-scroll'),bounds=link.getBoundingClientRect(),view=list?.getBoundingClientRect();
  if(view&&(bounds.bottom<=view.top||bounds.top>=view.bottom))return;
  anchor?.removeAttribute('aria-describedby');anchor=link;card.innerHTML=hoverPreviewMarkup(item,doc.documentElement.dataset.theme);card.hidden=false;
  if(card.showPopover&&!card.matches(':popover-open'))card.showPopover();
  link.setAttribute('aria-describedby',card.id);position();
  const image=card.querySelector('.library-hover-image');image.style.setProperty('--library-hover-scale',String(image.clientWidth/1200));
 }
 function schedule(link,immediate=false){
  win.clearTimeout(hideTimer);if(anchor===link&&!card.hidden)return;if(pending===link)return;
  win.clearTimeout(showTimer);pending=link;showTimer=win.setTimeout(()=>{pending=null;show(link);},immediate?0:180);
 }
 function dismissSoon(){win.clearTimeout(showTimer);pending=null;win.clearTimeout(hideTimer);hideTimer=win.setTimeout(hide,140);}
 root.addEventListener('pointerover',event=>{if(event.pointerType==='touch')return;const link=event.target.closest('[data-library-item]');if(link&&!link.contains(event.relatedTarget))schedule(link);});
 root.addEventListener('pointerout',event=>{const link=event.target.closest('[data-library-item]');if(link&&!link.contains(event.relatedTarget)&&!card.contains(event.relatedTarget))dismissSoon();});
 root.addEventListener('focusin',event=>{const link=event.target.closest('[data-library-item]');if(link)schedule(link,true);});
 root.addEventListener('focusout',event=>{if(event.target.closest('[data-library-item]'))dismissSoon();});
 root.addEventListener('click',hide);root.addEventListener('scroll',()=>{const focused=doc.activeElement?.closest('[data-library-item]');hide();if(focused&&root.contains(focused))schedule(focused);},true);
 card.addEventListener('pointerenter',()=>win.clearTimeout(hideTimer));card.addEventListener('pointerleave',dismissSoon);
 doc.addEventListener('keydown',event=>{if(event.key==='Escape'&&!card.hidden){event.preventDefault();hide();}});
 win.addEventListener('resize',hide);win.addEventListener('hashchange',hide);
 root.closest('.sidebar')?.addEventListener('transitionend',()=>{if(anchor&&!card.hidden)position();});
 doc.addEventListener('klic:locale-changed',()=>{if(anchor&&!card.hidden)show(anchor);});
 return {hide};
}
