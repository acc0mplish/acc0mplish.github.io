/** Shared public header state. Returns cleanup for hash-route remounts. */
export function initSiteChrome(root=globalThis.document,win=globalThis.window){
 const header=root?.querySelector('.ka-header');if(!win||!header)return ()=>{};
 const update=()=>header.classList.toggle('is-scrolled',win.scrollY>16);
 update();win.addEventListener('scroll',update,{passive:true});
 return ()=>win.removeEventListener('scroll',update);
}
