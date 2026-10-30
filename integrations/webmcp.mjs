import {TOOL_DEFINITIONS,validateRegistry,callRegistryTool,getRegistryItem,getMotionRecord,errorBody,RegistryError} from './klic.mjs';
let currentStatus={state:'idle',registered:[],message:'아직 등록하지 않았습니다.'};
export const getWebMCPStatus=()=>({...currentStatus,registered:[...currentStatus.registered]});
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
  if(typeof context?.registerTool!=='function'){update({state:'unsupported',registered:[],message:'이 브라우저는 WebMCP 등록 API를 제공하지 않습니다. JSON API와 CLI는 사용할 수 있습니다.'});return ()=>{};}
  const lifecycle=new AbortController(),registered=[];
  try {
    const registry=providedRegistry||await fetch(new URL('/api/v1/registry.json',doc.location?.href||globalThis.location.href),{signal:lifecycle.signal}).then(response=>{if(!response.ok)throw new Error('Registry unavailable');return response.json();}).then(validateRegistry);
    const tools=TOOL_DEFINITIONS.map(tool=>({...tool,annotations:{readOnlyHint:true,untrustedContentHint:true},execute:async(input,{signal}={})=>{if(signal?.aborted)throw new DOMException('Aborted','AbortError');try{return callRegistryTool(registry,tool.name,input);}catch(error){return errorBody(error);}}}));
    tools.push({name:'klic_open_item',title:'Open KLIC preview',description:'Navigate the current KLIC tab to an existing component or block preview. This changes the visible page only. Read designSystem criteria through klic_get_contract or klic_get_item before implementation.',inputSchema:TOOL_DEFINITIONS[1].inputSchema,annotations:{readOnlyHint:false,consequentialHint:false,untrustedContentHint:true},execute:async(input,{signal}={})=>{if(signal?.aborted)throw new DOMException('Aborted','AbortError');try {const {item}=getRegistryItem(registry,input);if(item.status!=='ready')throw new RegistryError('PREVIEW_UNAVAILABLE','This planned item has no live preview.');await navigate(item.route);return {opened:true,kind:item.kind,id:item.id,route:item.route};}catch(error){return errorBody(error);}}});
    tools.push({name:'klic_open_motion',title:'Open KLIC motion preview',description:'Navigate the current KLIC tab to a motion recipe and open its preview and implementation details. This changes the visible page only.',inputSchema:TOOL_DEFINITIONS.find(tool=>tool.name==='klic_get_motion').inputSchema,annotations:{readOnlyHint:false,consequentialHint:false,untrustedContentHint:true},execute:async(input,{signal}={})=>{if(signal?.aborted)throw new DOMException('Aborted','AbortError');try{const {motion}=getMotionRecord(registry.motions,input);await navigate(motion.route);return {opened:true,kind:'motion',id:motion.id,route:motion.route};}catch(error){return errorBody(error);}}});
    for(const tool of tools){await context.registerTool(tool,{signal:lifecycle.signal});registered.push(tool.name);}
    update({state:'registered',registered,message:`${registered.length}개 도구가 현재 탭에 등록되었습니다.`});
  } catch(error) {lifecycle.abort();update({state:'unavailable',registered:[],message:'도구 등록을 완료하지 못했습니다. 일반 탐색은 계속 사용할 수 있습니다.'});}
  return ()=>{lifecycle.abort();update({state:'stopped',registered:[],message:'탭의 도구 등록을 종료했습니다.'});};
}
