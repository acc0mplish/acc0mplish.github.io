import {escapeHTML as esc} from './catalog.js';
import {formatValue} from './tokens.mjs';
// Keep the complete authored inventory intact. The current view follows every
// Component root, including its typed aliases down to the Primitive leaves.
// Path searches use the full graph so unused definitions remain discoverable.
export function selectTokenGraph(tokens,{scope='used',query=''}={}){
 if(scope==='all'||query.trim())return {...tokens};
 const included=new Set();
 function include(path){
  if(included.has(path)||!Object.hasOwn(tokens,path))return;
  included.add(path);
  const value=tokens[path].$value,alias=typeof value==='string'&&value.match(/^\{([^{}]+)\}$/);
  if(alias)include(alias[1]);
 }
 Object.keys(tokens).filter(path=>path.split('.')[1]==='component').forEach(include);
 return Object.fromEntries(Object.entries(tokens).filter(([path])=>included.has(path)));
}
export function tokenInventoryStats(tokens){
 const used=selectTokenGraph(tokens),layers=Object.fromEntries(['primitive','brand','semantic','component'].map(layer=>[layer,{total:0,used:0}]));
 for(const path of Object.keys(tokens)){const layer=layers[path.split('.')[1]];if(layer){layer.total++;if(Object.hasOwn(used,path))layer.used++;}}
 return {total:Object.keys(tokens).length,used:Object.keys(used).length,layers};
}
export function tokenGroups(tokens,layer,query=''){
 const q=query.trim().toLowerCase(),groups=new Map();
 for(const [path,token] of Object.entries(tokens)){
  if(path.split('.')[1]!==layer||!path.toLowerCase().includes(q))continue;
  const family=path.split('.')[2]||'general',branch=path.split('.')[3]||'default';
  if(!groups.has(family))groups.set(family,new Map());
  if(!groups.get(family).has(branch))groups.get(family).set(branch,[]);
  groups.get(family).get(branch).push({path,token});
 }
 return [...groups].map(([id,branches])=>({id,branches:[...branches].map(([id,items])=>({id,items})),count:[...branches.values()].reduce((n,a)=>n+a.length,0)}));
}
export function renderTokenGroups(tokens,resolved,layer,query='',{inventoryCount}={}){
 const groups=tokenGroups(tokens,layer,query),count=groups.reduce((n,g)=>n+g.count,0);
 const row=({path,token})=>{const value=formatValue(resolved[path]);return `<div class="waterfall-token"><button class="token-path" data-action="trace-token" data-path="${esc(path)}" title="${esc(path)}">${esc(path.split('.').slice(4).join('.')||path.split('.').at(-1))}</button><small>${esc(token.$type)}</small><code>${token.$type==='color'?`<span class="color-swatch" style="background:${esc(value)}"></span>`:''}${esc(value)}</code><button class="icon-button" data-action="copy-token" data-path="${esc(path)}" aria-label="${esc(path)} 복사">⧉</button></div>`};
 return `<div class="waterfall-toolbar"><strong role="status">${groups.length}개 그룹 · ${count}개 토큰${Number.isFinite(inventoryCount)?` <span class="waterfall-inventory">· 전체 정의 ${inventoryCount}개 중 ${count}개 표시</span>`:''}</strong><div><button class="btn secondary sm" type="button" data-waterfall="open">모두 펼치기</button><button class="btn secondary sm" type="button" data-waterfall="close">모두 접기</button></div></div><div class="token-waterfall">${groups.map(g=>`<details class="waterfall-family" ${query.trim()?'open':''}><summary><span>${esc(g.id)}</span><small>${g.count}</small></summary><p class="waterfall-path">klic.${esc(layer)}.${esc(g.id)}</p>${g.branches.map(b=>`<details class="waterfall-branch" ${query.trim()?'open':''}><summary>${esc(b.id)}<small>${b.items.length}</small></summary>${b.items.map(row).join('')}</details>`).join('')}</details>`).join('')||'<p class="search-empty">일치하는 토큰이 없습니다.</p>'}</div>`;
}
