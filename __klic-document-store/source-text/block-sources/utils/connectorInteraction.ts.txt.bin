import type {ConnectorSelection} from './connectors';
export type ConnectorChange={sequence:number;kind:'layout'|'audit';value:number|boolean};
export type InteractionState={selected:ConnectorSelection;hovered:ConnectorSelection;focused:ConnectorSelection;appliedValue:number;auditEnabled:boolean;changes:ConnectorChange[];sequence:number};
export type InteractionAction={type:'select'|'hover'|'focus';selection:ConnectorSelection}|{type:'apply'|'reset';value:number}|{type:'toggle-audit'}|{type:'reconcile';edgeIds:string[];nodeIds:string[]};
export const createInteractionState=(value:number):InteractionState=>({selected:null,hovered:null,focused:null,appliedValue:value,auditEnabled:true,changes:[],sequence:0});
export const inspectedSelection=(s:InteractionState)=>s.hovered||s.focused||s.selected;
export function reduceInteraction(s:InteractionState,a:InteractionAction):InteractionState{
 if(a.type==='reset')return createInteractionState(a.value);
 if(a.type==='reconcile'){const keep=(selection:ConnectorSelection)=>selection&&(selection.kind==='edge'?a.edgeIds:a.nodeIds).includes(selection.id)?selection:null;return {...s,selected:keep(s.selected),hovered:keep(s.hovered),focused:keep(s.focused)};}
 if(a.type==='focus'&&a.selection)return {...s,focused:a.selection,hovered:null};
 if(a.type==='select'||a.type==='hover'||a.type==='focus')return {...s,[{select:'selected',hover:'hovered',focus:'focused'}[a.type]]:a.selection};
 if(a.type==='apply'&&(!Number.isFinite(a.value)||a.value===s.appliedValue))return s;
 const sequence=s.sequence+1;
 const change:ConnectorChange=a.type==='apply'?{sequence,kind:'layout',value:a.value}:{sequence,kind:'audit',value:!s.auditEnabled};
 return {...s,sequence,appliedValue:a.type==='apply'?a.value:s.appliedValue,auditEnabled:a.type==='toggle-audit'?!s.auditEnabled:s.auditEnabled,selected:a.type==='toggle-audit'&&s.auditEnabled&&s.selected?.id==='audit'?null:s.selected,hovered:null,focused:null,changes:[change,...s.changes].slice(0,8)};
}

export const isPersistentlySelected=(s:InteractionState,kind:'edge'|'node',id:string)=>s.selected?.kind===kind&&s.selected.id===id;
