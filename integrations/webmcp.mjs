import {TOOL_DEFINITIONS,validateRegistry,callRegistryTool,getRegistryItem,getMotionRecord,errorBody,RegistryError} from './klic.mjs';
let currentStatus={state:'idle',registered:[],outputSchemaSupport:'unverified',message:'아직 등록하지 않았습니다.'};
export const getWebMCPStatus=()=>({...currentStatus,registered:[...currentStatus.registered]});

function sameSchema(left,right){
 if(left===right)return true;
 if(Array.isArray(left)||Array.isArray(right))return Array.isArray(left)&&Array.isArray(right)&&left.length===right.length&&left.every((value,index)=>sameSchema(value,right[index]));
 if(!left||!right||typeof left!=='object'||typeof right!=='object')return false;
 const leftKeys=Object.keys(left).sort(),rightKeys=Object.keys(right).sort();
 return leftKeys.length===rightKeys.length&&leftKeys.every((key,index)=>key===rightKeys[index]&&sameSchema(left[key],right[key]));
}
export async function navigateToKlicItem(route, {document:doc=globalThis.document,location:loc=globalThis.location,timeout=10000}={}) {
  if(loc.hash===route&&doc?.querySelector('#view h1'))return;
  const events=doc.defaultView||doc;
  await new Promise((resolve,reject)=>{
    const finish=(error)=>{clearTimeout(timer);events.removeEventListener('klic:route-rendered',rendered);error?reject(error):resolve();};
    const rendered=event=>{if(event.detail?.route===route)finish();};
    const timer=setTimeout(()=>finish(new RegistryError('PREVIEW_UNAVAILABLE','The requested preview did not finish rendering.')),timeout);
    events.addEventListener('klic:route-rendered',rendered);loc.hash=route;
  });
}
export async function registerKlicWebMCP({document:doc=globalThis.document,registry:providedRegistry,onStatus=()=>{},navigate=route=>navigateToKlicItem(route,{document:doc})}={}) {
  const context=doc?.modelContext;
  const update=value=>{currentStatus=value;onStatus(getWebMCPStatus());};
  if(typeof context?.registerTool!=='function'){update({state:'unsupported',registered:[],outputSchemaSupport:'unsupported',message:'이 브라우저는 WebMCP 등록 API를 제공하지 않습니다. JSON API와 CLI는 사용할 수 있습니다.'});return ()=>{};}
  let lifecycle=new AbortController(),registered=[],outputSchemaSupport=typeof context.getTools==='function'?'not-exposed':'unverified';
  try {
    const registry=providedRegistry||await fetch(new URL('/api/v1/registry.json',doc.location?.href||globalThis.location.href),{signal:lifecycle.signal}).then(response=>{if(!response.ok)throw new Error('Registry unavailable');return response.json();}).then(validateRegistry);
    const readTools=TOOL_DEFINITIONS.map(({outputSchema:_outputSchema,...tool})=>({...tool,annotations:{readOnlyHint:true,untrustedContentHint:true},execute:async(input,{signal}={})=>{if(signal?.aborted)throw new DOMException('Aborted','AbortError');try{return callRegistryTool(registry,tool.name,input,{transport:'webmcp'});}catch(error){return errorBody(error);}}}));
    const navigationTools=[
      {name:'klic_open_item',title:'Open KLIC preview',description:'Navigate the current KLIC tab to an existing component or block preview. This changes the visible page only. Read designSystem criteria through klic_get_contract or klic_get_item before implementation.',inputSchema:TOOL_DEFINITIONS[1].inputSchema,annotations:{readOnlyHint:false,consequentialHint:false,untrustedContentHint:true},execute:async(input,{signal}={})=>{if(signal?.aborted)throw new DOMException('Aborted','AbortError');try {const {item}=getRegistryItem(registry,input);if(item.status!=='ready')throw new RegistryError('PREVIEW_UNAVAILABLE','This planned item has no live preview.');await navigate(item.route);return {opened:true,kind:item.kind,id:item.id,route:item.route};}catch(error){return errorBody(error);}}},
      {name:'klic_open_motion',title:'Open KLIC motion preview',description:'Navigate the current KLIC tab to one canonical source motion ID and open its preview and implementation details. This changes the visible page only.',inputSchema:TOOL_DEFINITIONS.find(tool=>tool.name==='klic_get_motion').inputSchema,annotations:{readOnlyHint:false,consequentialHint:false,untrustedContentHint:true},execute:async(input,{signal}={})=>{if(signal?.aborted)throw new DOMException('Aborted','AbortError');try{const {motion}=getMotionRecord(registry.motions,input);await navigate(motion.route);return {opened:true,kind:'motion',id:motion.id,route:motion.route};}catch(error){return errorBody(error);}}},
    ];
    const registerList=async(tools,signal)=>{for(const tool of tools){await context.registerTool(tool,{signal});registered.push(tool.name);}};
    let outputSchemasVerified=false;
    // WebMCP has no outputSchema capability bit: round-trip one real read tool,
    // keep it only after exact readback, and otherwise abort before input-only registration.
    if(typeof context.getTools==='function'&&readTools.length){
      const probeController=new AbortController(),first=readTools[0],expected=TOOL_DEFINITIONS.find(tool=>tool.name===first.name)?.outputSchema;
      try{
        await context.registerTool({...first,outputSchema:expected},{signal:probeController.signal});
        const discovered=await context.getTools(),origin=doc?.location?.origin,window=doc?.defaultView;
        const exposed=Array.isArray(discovered)?discovered.find(tool=>tool.name===first.name&&(!origin||tool.origin===origin)&&(!window||tool.window===window)):null;
        outputSchemasVerified=!!expected&&sameSchema(exposed?.outputSchema,expected);
        if(outputSchemasVerified){lifecycle=probeController;registered.push(first.name);outputSchemaSupport='verified';}
      }catch{outputSchemasVerified=false;}
      if(!outputSchemasVerified){probeController.abort();registered=[];outputSchemaSupport='not-exposed';}
    }
    if(outputSchemasVerified){
      try{
        const withSchemas=readTools.slice(1).map(tool=>({...tool,outputSchema:TOOL_DEFINITIONS.find(entry=>entry.name===tool.name)?.outputSchema}));
        await registerList([...withSchemas,...navigationTools],lifecycle.signal);
        const discovered=await context.getTools(),origin=doc?.location?.origin,window=doc?.defaultView;
        const allSchemasExposed=TOOL_DEFINITIONS.every(tool=>{
          const exposed=Array.isArray(discovered)?discovered.find(entry=>entry.name===tool.name&&(!origin||entry.origin===origin)&&(!window||entry.window===window)):null;
          return !!tool.outputSchema&&sameSchema(exposed?.outputSchema,tool.outputSchema);
        });
        if(!allSchemasExposed)throw new Error('The browser did not expose every shared output schema.');
      }catch{
        lifecycle.abort();registered=[];lifecycle=new AbortController();outputSchemaSupport='not-exposed';
        await registerList([...readTools,...navigationTools],lifecycle.signal);
      }
    }else await registerList([...readTools,...navigationTools],lifecycle.signal);
    const schemaMessage=outputSchemaSupport==='verified'?'이 브라우저가 공유 출력 스키마를 노출하는 것을 확인했습니다.':outputSchemaSupport==='not-exposed'?'이 브라우저는 출력 스키마를 노출하지 않아 입력 스키마만 등록했습니다.':'출력 스키마 지원을 확인할 수 없어 입력 스키마만 등록했습니다.';
    update({state:'registered',registered,outputSchemaSupport,message:`${registered.length}개 도구가 현재 탭에 등록되었습니다. ${schemaMessage}`});
  } catch(error) {lifecycle.abort();update({state:'unavailable',registered:[],outputSchemaSupport,message:'도구 등록을 완료하지 못했습니다. 일반 탐색은 계속 사용할 수 있습니다.'});}
  return ()=>{lifecycle.abort();update({state:'stopped',registered:[],outputSchemaSupport,message:'탭의 도구 등록을 종료했습니다.'});};
}
