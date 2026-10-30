/** Open collapsed guidance when following an existing section URL. */
export function openResourceGuidanceHash(doc,hash){
 let id;try{id=decodeURIComponent(String(hash||'').replace(/^#/,''));}catch{return false;}
 if(id!=='design-system'&&!id.startsWith('design-system-'))return false;
 const target=doc.getElementById(id);if(!target)return false;
 const outer=id==='design-system-guidance'?target:target.closest('[data-design-system-revision]');
 if(!outer)return false;
 outer.open=true;
 if(target!==outer)target.open=true;
 target.scrollIntoView?.({block:'start'});
 return true;
}
