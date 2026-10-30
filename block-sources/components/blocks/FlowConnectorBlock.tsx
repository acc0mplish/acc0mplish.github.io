/** SPDX-License-Identifier: Apache-2.0 · KLIC original implementation. */
import React,{useEffect,useId,useMemo,useRef,useState,useReducer} from 'react';
import {buildConnectorScene,CONNECTOR_EXAMPLES,type ConnectorMode,type DiagramEdge} from '../../utils/connectors';
import {createInteractionState,reduceInteraction,inspectedSelection,isPersistentlySelected} from '../../utils/connectorInteraction';
import type {ConnectorSelection} from '../../utils/connectors';
import './flow-connectors.css';
const palette=['var(--klic-component-block-color-accent,#245fc2)','var(--klic-component-block-color-text,#183553)','var(--klic-component-block-color-muted,#64748b)','var(--klic-component-block-color-warning,#aa6a0c)'];
const download=(body:string,name:string,type:string)=>{const url=URL.createObjectURL(new Blob([body],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);};
/** Serialize a static self-contained SVG with the current resolved theme. */
export function staticConnectorSVG(svg:SVGSVGElement){
 const clone=svg.cloneNode(true) as SVGSVGElement,original=[svg,...Array.from(svg.querySelectorAll('*'))],copies=[clone,...Array.from(clone.querySelectorAll('*'))];
 original.forEach((element,i)=>{const target=copies[i],style=getComputedStyle(element);
  for(const property of ['fill','stroke','stroke-width','stroke-dasharray','stroke-linecap','stroke-linejoin','opacity','font-family','font-size','font-weight','text-anchor']){
   const value=style.getPropertyValue(property);if(value&&!(value.includes('url(')&&element.getAttribute(property)?.startsWith('url(#')))target.setAttribute(property,value);
  }
  target.removeAttribute('role');target.removeAttribute('aria-pressed');target.removeAttribute('tabindex');target.removeAttribute('class');target.removeAttribute('style');
 });
 clone.querySelectorAll('animate,animateMotion,animateTransform,[data-motion],[data-pending-preview]').forEach(e=>e.remove());
 clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('width','1000');clone.setAttribute('height','520');
 return '<?xml version="1.0" encoding="UTF-8"?>\n'+new XMLSerializer().serializeToString(clone);
}
export default function FlowConnectorBlock({mode='obstacle',density='normal'}:{mode?:ConnectorMode;density?:string}){
 const example=CONNECTOR_EXAMPLES.find(e=>e.mode===mode)||CONNECTOR_EXAMPLES[0],key=useId().replace(/[^a-zA-Z0-9]/g,'');
 const[value,setValue]=useState<number>(example.control.initial),[blocked,setBlocked]=useState(false),[motion,setMotion]=useState(false),[reduced,setReduced]=useState(false),[notice,setNotice]=useState('');
 const [interaction,dispatch]=useReducer(reduceInteraction,example.control.initial,createInteractionState);
 const selected=interaction.selected,inspected=inspectedSelection(interaction);
 const setSelected=(next:ConnectorSelection|((previous:ConnectorSelection)=>ConnectorSelection))=>dispatch({type:'select',selection:typeof next==='function'?next(selected):next});
 const inspectHandlers=(kind:'edge'|'node',id:string)=>({onMouseEnter:()=>dispatch({type:'hover',selection:{kind,id}}),onMouseLeave:()=>dispatch({type:'hover',selection:null}),onFocus:()=>dispatch({type:'focus',selection:{kind,id}}),onBlur:()=>dispatch({type:'focus',selection:null})});
 const svg=useRef<SVGSVGElement>(null),scene=useMemo(()=>{const current=buildConnectorScene(example.mode,mode==='interaction'?interaction.appliedValue:value,{blocked});if(mode==='interaction'&&!interaction.auditEnabled)current.edges=current.edges.filter(e=>e.id!=='audit');return current;},[example.mode,value,blocked,interaction.appliedValue,interaction.auditEnabled]);
 const pendingScene=mode==='interaction'&&value!==interaction.appliedValue?buildConnectorScene(example.mode,value):null;
 useEffect(()=>dispatch({type:'reconcile',edgeIds:scene.edges.map(e=>e.id),nodeIds:scene.nodes.map(n=>n.id)}),[scene]);
 useEffect(()=>{setValue(example.control.initial);setSelected(null);setBlocked(false);setMotion(false);dispatch({type:'reset',value:example.control.initial});},[example.mode,example.control.initial]);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)'),update=()=>{setReduced(media.matches);if(media.matches)setMotion(false);};update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 const activeEdge=inspected?.kind==='edge'?scene.edges.find(e=>e.id===inspected.id):undefined,activeNode=inspected?.kind==='node'?scene.nodes.find(n=>n.id===inspected.id):undefined;
 const related=(edge:DiagramEdge)=>!inspected||(inspected.kind==='edge'?inspected.id===edge.id:edge.source===inspected.id||edge.target===inspected.id);
 const select=(kind:'edge'|'node',id:string)=>setSelected(v=>v?.kind===kind&&v.id===id?null:{kind,id});
 const nodeName=(id:string)=>scene.nodes.find(n=>n.id===id)?.name||id;
 const reset=()=>{setValue(example.control.initial);setBlocked(false);setSelected(null);setMotion(false);dispatch({type:'reset',value:example.control.initial});setNotice('초기 샘플로 복원했습니다.');};
 const exportSVG=()=>{if(svg.current){download(staticConnectorSVG(svg.current),'klic-connector-'+mode+'.svg','image/svg+xml;charset=utf-8');setNotice('현재 테마의 정적 SVG를 내보냈습니다.');}};
 const exportJSON=()=>{download(JSON.stringify({schemaVersion:'1.0',sample:true,...scene,svg:svg.current?staticConnectorSVG(svg.current):null},null,2),'klic-connector-'+mode+'.json','application/json');setNotice('현재 관계와 좌표를 JSON으로 내보냈습니다.');};
 const inlineLabels=!['metro','bundle','radial','bus'].includes(mode);
 return <section className="connector-workbench" data-density={density} data-connector-mode={example.mode}>
  <header className="connector-heading"><div><span className="connector-eyebrow">KLIC / 연결선 엔진 <b>{String(example.index).padStart(2,'0')} / {CONNECTOR_EXAMPLES.length}</b></span><h1>{example.title}</h1><p>{example.title} · 독립 SVG 구현 · 샘플 데이터</p></div><span className="connector-badge">{({basic:'기본',advanced:'고급','flow-state':'흐름 / 상태',interaction:'인터랙션'})[example.group]}</span></header>
  <div className="connector-controls"><label htmlFor={key+'-range'}><span>{example.control.label} <output htmlFor={key+'-range'}>{value}{example.control.unit}</output></span><input id={key+'-range'} aria-label={example.control.label} type="range" min={example.control.min} max={example.control.max} step={example.control.step} value={value} onChange={e=>{setValue(Number(e.target.value));setNotice('');}}/></label>
   {mode==='interaction'&&<><button type="button" disabled={value===interaction.appliedValue} onClick={()=>dispatch({type:'apply',value})}>변경 적용</button><button type="button" aria-pressed={interaction.auditEnabled} onClick={()=>dispatch({type:'toggle-audit'})}>{interaction.auditEnabled?'감사 연결 제거':'감사 연결 추가'}</button><span className="connector-pending" role="status">{pendingScene?'미적용 변경 있음':'모든 변경 적용됨'}</span></>}
   {mode==='obstacle'&&<button type="button" onClick={()=>{setBlocked(v=>!v);setSelected(null);}} aria-pressed={blocked}>{blocked?'통로 차단 켜짐':'통로 차단 꺼짐'}</button>}
   {!scene.edges.some(e=>e.fill)&&<button type="button" disabled={reduced||!scene.edges.length} onClick={()=>setMotion(v=>!v)} aria-pressed={motion}>{motion?'흐름 일시정지':'흐름 재생'}</button>}
   <button type="button" onClick={reset}>초기화</button><div className="connector-export"><button type="button" onClick={exportSVG}>SVG 내보내기</button><button type="button" onClick={exportJSON}>JSON 내보내기</button></div>
  </div>
  <div className="connector-grid"><div className="connector-canvas" tabIndex={0} aria-label="다이어그램 캔버스 · 좁은 화면에서 가로 스크롤"><svg ref={svg} data-applied-value={mode==='interaction'?interaction.appliedValue:value} data-pending-value={value} viewBox="0 0 1000 520" role="group" aria-labelledby={key+'-title '+key+'-desc'}>
   <title id={key+'-title'}>{example.title}</title><desc id={key+'-desc'}>연결선과 노드를 선택해 관계를 확인합니다. Enter 또는 Space로 선택합니다. {scene.status}</desc>
   <defs><pattern id={key+'-dots'} width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="var(--klic-component-block-color-border,#dfe5ee)"/></pattern>{palette.map((color,i)=><marker key={i} id={key+'-arrow-'+i} markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M1 1 L10 5 L1 9 Z" fill={color}/></marker>)}</defs>
   <rect width="1000" height="520" fill="var(--klic-component-block-color-panel,#fff)"/><rect width="1000" height="520" fill={`url(#${key}-dots)`}/>
   {scene.regions.map((r,i)=><g key={i}><rect x={r.x} y={r.y} width={r.w} height={r.h} rx="14" fill="var(--klic-component-block-color-surface,#fbfcfe)" stroke="var(--klic-component-block-color-border,#dfe5ee)" strokeDasharray="5 5"/><text x={r.x+18} y={r.y+26} fontSize="12" letterSpacing="2" fill="var(--klic-component-block-color-muted,#64748b)">{r.name}</text></g>)}
   {scene.obstacles.map((r,i)=><g key={i}><rect x={r.x} y={r.y} width={r.w} height={r.h} rx="8" fill="var(--klic-component-block-color-soft,#f1f4f8)" stroke="var(--klic-component-block-color-control-border,#a5b2c4)"/><path d={`M${r.x+18} ${r.y+25}h20 m-10 -10v20`} stroke="var(--klic-component-block-color-muted,#64748b)"/><text x={r.x+18} y={r.y+54} fontSize="12" fill="var(--klic-component-block-color-text,#183553)">장애물 {i+1}</text></g>)}
   {scene.arcs.map((arc,i)=><path key={i} d={arc.d} fill={palette[arc.color]} opacity=".8"/>)}
   {pendingScene&&<path data-pending-preview d={pendingScene.edges[0].d} fill="none" stroke={palette[0]} strokeWidth="2" strokeDasharray="3 7" opacity=".45" pointerEvents="none"/>}
   {scene.edges.map(e=><g key={e.id} className="connector-edge" data-edge-id={e.id} {...inspectHandlers('edge',e.id)} role="button" tabIndex={0} aria-label={e.label+' · '+nodeName(e.source)+' → '+nodeName(e.target)} aria-pressed={selected?.kind==='edge'&&selected.id===e.id} onClick={()=>select('edge',e.id)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();select('edge',e.id);}}} opacity={related(e)?1:.12}>
    <path d={e.d} fill={e.fill?palette[e.color||0]:'none'} fillOpacity={e.fill?(selected?.id===e.id? .78:.44):undefined} stroke={palette[e.color||0]} strokeWidth={e.fill?1:e.width||2.5} strokeDasharray={e.dash?'8 5':undefined} strokeLinecap="round" strokeLinejoin="round" markerEnd={e.arrow===false||e.fill?undefined:`url(#${key}-arrow-${e.color||0})`} vectorEffect="non-scaling-stroke"/>
    {!e.fill&&<path d={e.d} fill="none" stroke="transparent" strokeWidth="18"/>}
    {motion&&!e.fill&&<circle data-motion r="3.5" fill={palette[e.color||0]}><animateMotion path={e.d} dur="6s" repeatCount="indefinite"/></circle>}
   </g>)}
   {scene.nodes.map(n=><g key={n.id} className="connector-node" data-node-id={n.id} {...inspectHandlers('node',n.id)} role="button" tabIndex={0} aria-label={n.name+' 노드 선택'} aria-pressed={selected?.kind==='node'&&selected.id===n.id} onClick={()=>select('node',n.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select('node',n.id);}}}>
    {n.kind==='junction'?<><circle cx={n.x} cy={n.y} r="6" fill={palette[0]}/><text x={n.x} y={n.y+26} textAnchor="middle" fontSize="11" fill={palette[0]}>공유 접점</text></>:<><rect x={n.x} y={n.y} width={n.w} height={n.h} rx="9" fill={(selected?.kind==='node'&&selected.id===n.id)||scene.metadata.activeNode===n.id?'var(--klic-component-block-color-selected,#eaf0fb)':'var(--klic-component-block-color-panel,#fff)'} stroke={inspected?.id===n.id||scene.metadata.activeNode===n.id?palette[0]:'var(--klic-component-block-color-control-border,#b4bfce)'} strokeWidth="1.5"/><text x={n.x+n.w/2} y={n.y+n.h/2+5} textAnchor="middle" fontWeight="600" fontSize="14" fill="var(--klic-component-block-color-text,#183553)">{n.name}</text></>}
   </g>)}
   {scene.edges.filter(e=>(inlineLabels||activeEdge?.id===e.id)&&(!inspected||related(e))&&!(mode==='radial')).map(e=><g key={e.id+'-label'} pointerEvents="none"><rect x={e.labelAt.x-e.label.length*3.6-7} y={e.labelAt.y-13} width={e.label.length*7.2+14} height="22" rx="4" fill="var(--klic-component-block-color-panel,#fff)"/><text x={e.labelAt.x} y={e.labelAt.y+2} textAnchor="middle" fontSize="12" fill="var(--klic-component-block-color-text,#183553)">{e.label}</text></g>)}
  </svg></div>
  <aside className="connector-inspector"><span className="connector-eyebrow">관계 상세</span><h2>{activeEdge?'선택한 연결':activeNode?'선택한 노드':'연결을 살펴보세요'}</h2>
   {activeEdge?<><strong>{activeEdge.label}</strong><p>{nodeName(activeEdge.source)} → {nodeName(activeEdge.target)}</p><code>{activeEdge.id}</code>{activeEdge.value!==undefined&&<p>수량: {activeEdge.value}건</p>}</>:activeNode?<><strong>{activeNode.name}</strong><p>{scene.edges.filter(e=>e.source===activeNode.id||e.target===activeNode.id).length}개 관계</p><code>{activeNode.id}</code></>:<p>선 또는 노드를 선택하면 관련 경로만 강조됩니다. 아래 관계 목록에서도 선택할 수 있습니다.</p>}
   <div className="connector-rule"><h3>사용 원칙</h3><p>{example.use}</p><h3>피해야 할 사용</h3><p>{example.avoid}</p></div>
   <p className="connector-count">{scene.nodes.length} 개 노드 / {scene.edges.length} 개 관계</p><button type="button" disabled={!selected} onClick={()=>setSelected(null)}>선택 해제</button>
  </aside></div>
  <p className={'connector-status '+(!scene.edges.length?'connector-error':'')} role={!scene.edges.length?'alert':'status'}>{scene.status}</p>
  <details className="connector-relations"><summary>관계 데이터 · {scene.edges.length}</summary><div className="connector-table"><table><thead><tr><th>관계</th><th>출발</th><th>도착</th><th>수량</th></tr></thead><tbody>{scene.edges.map(e=><tr key={e.id} data-selected={isPersistentlySelected(interaction,'edge',e.id)} data-inspected={activeEdge?.id===e.id}><td><button type="button" aria-pressed={isPersistentlySelected(interaction,'edge',e.id)} onClick={()=>select('edge',e.id)}>{e.label}</button></td><td>{nodeName(e.source)}</td><td>{nodeName(e.target)}</td><td>{e.value??'—'}</td></tr>)}</tbody></table></div></details>
  {mode==='interaction'&&<section className="connector-changes" aria-label="호버 반응과 최근 변경"><div><span className="connector-eyebrow">상세 확인 및 변경 기록</span><h2>호버 반응과 최근 변경</h2><p>마우스 오버 또는 키보드 초점으로 관계를 강조합니다. 클릭한 선택은 유지됩니다.</p><p>점선은 미적용 레이아웃입니다. 변경 적용 후 기록됩니다.</p></div><div><h3>최근 변경</h3><ol aria-live="polite">{interaction.changes.length?interaction.changes.map(change=><li key={change.sequence}><b>#{change.sequence}</b> {change.kind==='layout'?<>레이아웃 적용 · {change.value}px</>:change.value?'감사 연결 추가':'감사 연결 제거'}</li>):<li>아직 적용한 변경이 없습니다.</li>}</ol></div></section>}
  <footer className="connector-foot"><span>좌표·수량·정적 SVG 내보내기 · 외부 연결 없음</span></footer><p className="connector-notice" role="status" aria-live="polite">{reduced?'모션 줄이기 설정에 따라 정적 표시합니다. ':''}{notice}</p>
 </section>;
}
