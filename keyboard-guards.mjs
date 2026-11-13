const composingTargets=new WeakSet();
const isTrackable=value=>(typeof value==='object'&&value!==null)||typeof value==='function';

function updateCompositionTarget(event){
 const target=event?.target;
 if(!isTrackable(target))return;
 if(event.type==='compositionstart')composingTargets.add(target);
 else if(event.type==='compositionend')composingTargets.delete(target);
}

if(globalThis.document?.addEventListener){
 document.addEventListener('compositionstart',updateCompositionTarget,true);
 document.addEventListener('compositionend',updateCompositionTarget,true);
}

export function isComposingInput(event,target){
 const native=event?.nativeEvent;
 const eventType=event?.type||native?.type;
 const actualTarget=target||event?.target||native?.target;
 if(eventType==='compositionstart'&&isTrackable(actualTarget))composingTargets.add(actualTarget);
 if(eventType==='compositionend'&&isTrackable(actualTarget))composingTargets.delete(actualTarget);
 if(event?.isComposing===true||native?.isComposing===true)return true;
 if(event?.keyCode===229||native?.keyCode===229)return true;
 if(eventType==='compositionstart')return true;
 return isTrackable(actualTarget)&&(actualTarget.isComposing===true||composingTargets.has(actualTarget));
}

export function isUsableNativeFocusTarget(target){
 if(!target||typeof target.focus!=='function'||target.isConnected===false||target.disabled===true||target.inert===true)return false;
 if(typeof target.getClientRects==='function'&&target.getClientRects().length===0)return false;
 if(target.getAttribute?.('aria-disabled')==='true'||target.matches?.(':disabled'))return false;
 if(target.closest?.('[inert], [aria-hidden="true"]'))return false;
 return true;
}

export function restoreNativeFocus(opener,fallback){
 const target=isUsableNativeFocusTarget(opener)?opener:isUsableNativeFocusTarget(fallback)?fallback:null;
 if(!target)return false;
 try{target.focus({preventScroll:true});return true;}catch{return false;}
}
