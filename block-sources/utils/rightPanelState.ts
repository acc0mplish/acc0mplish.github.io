/** One status owns the badge, select, checklist and board lane. */
export type PanelStatus='review'|'progress'|'done';
export interface PanelRecordState {checks:boolean[];comments:{id:number;text:string}[];draft:string;status:PanelStatus}
export function createPanelState(status:PanelStatus='review'):PanelRecordState{return {checks:[true,true,false,false],comments:[],draft:'',status};}
export function changePanelChecklist(state:PanelRecordState,index:number):PanelRecordState{
 return {...state,checks:state.checks.map((checked,i)=>i===index?!checked:checked),status:state.status==='done'?'review':state.status};
}
export function panelLane(state:PanelRecordState):number{return {review:0,progress:1,done:2}[state.status];}
