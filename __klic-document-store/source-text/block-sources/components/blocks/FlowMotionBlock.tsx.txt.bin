/** KLIC-authored FlowMotion project delivery adapted to independent React blocks. */
import React,{useEffect,useMemo,useState} from 'react';
import {Play,Pause,RotateCcw,ZoomIn,ZoomOut,CheckCircle2} from 'lucide-react';
import {FLOW_TEMPLATES} from './flowmotion/utils/flowTemplates';
import {computeFlowRuntimeState} from './flowmotion/utils/flowEngine';
import {useFlowPlayback} from './flowmotion/useFlowPlayback';
import {FlowCanvas} from './flowmotion/components/FlowCanvas';
import {RadialStreamHubCanvas,SwimlaneEtlCanvas,CyclicAgentRingCanvas,VerticalRegionTreeCanvas} from './flowmotion/components/MultiStyleFlowCanvases';
import {PptChevronFunnelCanvas,PptSequenceFlowchartCanvas,PptFlywheelInfographicCanvas,PptAsIsToBeBridgeCanvas,PptMilestoneRoadmapCanvas} from './flowmotion/components/PptInfographicCanvases';
import {CreativeZigzagRibbonCanvas,CreativeLightbulbBrainstormCanvas,CreativeStrategyPyramidCanvas,CreativeSemicircleRadialFanCanvas,CreativeHexagonHoneycombCanvas} from './flowmotion/components/CreativeInfographicCanvases';
import {CinematicNodeConnectCanvas} from './flowmotion/components/CinematicNodeConnectCanvas';
import {EditorialMcpSkillCanvas} from './flowmotion/components/EditorialMcpSkillCanvas';
import {ItWorkflowEditorialCanvases} from './flowmotion/components/ItWorkflowEditorialCanvases';
import './flowmotion/flowmotion.css';

export interface FlowMotionBlockProps{templateId?:string;density?:'compact'|'normal'|'relaxed'}
const STATIC_LAYOUTS=new Set(['it-design-system','it-dev-cicd','it-si-integration']);
const statusNames={success:'완료',failed:'오류',pending:'대기',skipped:'미실행',running:'실행 중'};

export function FlowMotionBlock({templateId='inbound-lead-routing',density='normal'}:FlowMotionBlockProps){
 const original=FLOW_TEMPLATES.find(item=>item.id===templateId)||FLOW_TEMPLATES[0];
 const [nodes,setNodes]=useState(()=>original.nodes.map(node=>({...node}))),[scenarioId,setScenarioId]=useState(original.scenarios[0].id);
 const [selectedId,setSelectedId]=useState(original.nodes.find(node=>node.defaultSelected)?.id||original.nodes[0]?.id||''),[zoom,setZoom]=useState(1),[replayCount,setReplayCount]=useState(0),[sceneEpoch,setSceneEpoch]=useState(0);
 useEffect(()=>{setNodes(original.nodes.map(node=>({...node})));setScenarioId(original.scenarios[0].id);setSelectedId(original.nodes.find(node=>node.defaultSelected)?.id||original.nodes[0]?.id||'');setZoom(1);setReplayCount(0);},[original.id]);
 const scenario=original.scenarios.find(item=>item.id===scenarioId)||original.scenarios[0];
 const template=useMemo(()=>({...original,nodes}),[original,nodes]);
 const playback=useFlowPlayback(scenario.totalDurationMs,original.id+':'+scenario.id);
 const runtime=computeFlowRuntimeState(template,scenario,playback.elapsed,playback.running);
 const selected=nodes.find(node=>node.id===selectedId)||nodes[0],selectedRuntime=selected?runtime.nodes[selected.id]:null;
 const cinematic=original.layoutType==='cinematic-node-connect',staticView=STATIC_LAYOUTS.has(original.layoutType);
 const props={template,scenario,selectedNodeId:selectedId,ambientProgress:playback.reduced?0:(playback.elapsed%2400)/2400,elapsedMs:playback.elapsed,isPlaying:playback.running,zoom,onSelectNode:setSelectedId};
 const moveNode=(id:string,x:number,y:number)=>setNodes(current=>current.map(node=>node.id===id?{...node,x,y}:node));
 const renderScene=()=>{
  switch(original.layoutType){
   case 'orthogonal-step':return <FlowCanvas nodes={nodes} edges={template.edges} nodeRuntime={runtime.nodes} edgeRuntime={runtime.edges} selectedNodeId={selectedId} zoom={zoom} onSelectNode={setSelectedId} onMoveNode={moveNode}/>;
   case 'radial-stream-hub':return <RadialStreamHubCanvas {...props}/>;
   case 'swimlane-etl-funnel':return <SwimlaneEtlCanvas {...props}/>;
   case 'cyclic-agent-ring':return <CyclicAgentRingCanvas {...props}/>;
   case 'vertical-region-tree':return <VerticalRegionTreeCanvas {...props}/>;
   case 'ppt-chevron-funnel':return <PptChevronFunnelCanvas {...props}/>;
   case 'ppt-sequence-flowchart':return <PptSequenceFlowchartCanvas {...props}/>;
   case 'ppt-flywheel-infographic':return <PptFlywheelInfographicCanvas {...props}/>;
   case 'ppt-asis-tobe-bridge':return <PptAsIsToBeBridgeCanvas {...props}/>;
   case 'ppt-milestone-roadmap':return <PptMilestoneRoadmapCanvas {...props}/>;
   case 'creative-zigzag-ribbon':return <CreativeZigzagRibbonCanvas {...props}/>;
   case 'creative-lightbulb-brainstorm':return <CreativeLightbulbBrainstormCanvas {...props}/>;
   case 'creative-strategy-pyramid':return <CreativeStrategyPyramidCanvas {...props}/>;
   case 'creative-semicircle-radial-fan':return <CreativeSemicircleRadialFanCanvas {...props}/>;
   case 'creative-hexagon-honeycomb':return <CreativeHexagonHoneycombCanvas {...props}/>;
   case 'cinematic-node-connect':return <CinematicNodeConnectCanvas {...props} replayTriggerCount={replayCount} reducedMotion={playback.reduced} autoPlay={false}/>;
   case 'editorial-mcp-skill-compare':return <EditorialMcpSkillCanvas {...props}/>;
   default:return <ItWorkflowEditorialCanvases {...props}/>;
  }
 };
 return <section ref={playback.root} className="klic-flowmotion" data-flowmotion-template={original.id} data-flowmotion-layout={original.layoutType} data-density={density} data-fm-playing={cinematic?'true':String(playback.running)} data-fm-reduced={String(playback.reduced)} aria-label={'FlowMotion · '+original.title}>
  <header className="fm-block-header"><div><span className="fm-block-eyebrow">FLOWMOTION · {original.number} · {original.layoutBadge}</span><h2>{original.title}</h2><p>{original.summary}</p></div><span className="fm-block-sample">예시 데이터</span></header>
  <div className="fm-block-toolbar"><label>시나리오<select aria-label="플로우 시나리오" value={scenario.id} onChange={event=>setScenarioId(event.target.value)}>{original.scenarios.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
   {!cinematic&&!staticView&&<><button type="button" onClick={playback.toggle} disabled={playback.reduced}>{playback.playing?<Pause size={15}/>:<Play size={15}/>} {playback.playing?'일시정지':'재생'}</button><button type="button" onClick={playback.replay} disabled={playback.reduced}><RotateCcw size={15}/>다시 재생</button><label className="fm-block-check"><input type="checkbox" checked={playback.loop} onChange={event=>playback.setLoop(event.target.checked)} disabled={playback.reduced}/>반복</label></>}
   {cinematic&&<button type="button" onClick={()=>setReplayCount(value=>value+1)} disabled={playback.reduced}><RotateCcw size={15}/>다시 재생</button>}
   {!cinematic&&<div className="fm-block-zoom" role="group" aria-label="플로우 확대"><button type="button" aria-label="축소" disabled={zoom<=.6} onClick={()=>setZoom(value=>Math.max(.6,Math.round((value-.1)*10)/10))}><ZoomOut size={15}/></button><output>{Math.round(zoom*100)}%</output><button type="button" aria-label="확대" disabled={zoom>=1.4} onClick={()=>setZoom(value=>Math.min(1.4,Math.round((value+.1)*10)/10))}><ZoomIn size={15}/></button></div>}
   <button type="button" onClick={()=>{setNodes(original.nodes.map(node=>({...node})));setZoom(1);playback.seek(scenario.totalDurationMs);setSelectedId(original.nodes[0]?.id||'');setSceneEpoch(value=>value+1);}}>초기화</button>
  </div>
  <p className="fm-block-scenario"><CheckCircle2 size={14}/><strong>{scenario.badgeText}</strong><span>{scenario.description}</span></p>
  {!cinematic&&!staticView&&<label className="fm-block-timeline">재생 위치<input aria-label="플로우 재생 위치" type="range" min={0} max={scenario.totalDurationMs} step={10} value={playback.elapsed} onChange={event=>playback.seek(Number(event.target.value))}/><output>{(playback.elapsed/1000).toFixed(1)} / {(scenario.totalDurationMs/1000).toFixed(1)}초</output></label>}
  <div className="fm-block-layout"><div className="fm-block-scene" key={original.id+sceneEpoch} aria-label={original.layoutBadge+' 다이어그램'}>{renderScene()}</div>
   <aside className="fm-block-inspector"><label>노드 선택<select aria-label="플로우 노드 선택" value={selected?.id||''} onChange={event=>setSelectedId(event.target.value)}>{nodes.map(node=><option key={node.id} value={node.id}>{node.title}</option>)}</select></label>{selected&&<><h3>{selected.title}</h3><p>{selected.subtitle}</p><dl><div><dt>상태</dt><dd>{selectedRuntime?statusNames[selectedRuntime.status]:'대기'}</dd></div><div><dt>처리 시간</dt><dd>{selectedRuntime?.durationLabel||selected.defaultDurationText}</dd></div>{!cinematic&&<div><dt>연결</dt><dd>{template.edges.filter(edge=>edge.source===selected.id||edge.target===selected.id).length}개</dd></div>}</dl><p>{selected.description}</p>{selected.payloadPreview&&<details><summary>샘플 데이터</summary><pre>{selected.payloadPreview}</pre></details>}</>}</aside>
  </div>
  <footer className="fm-block-footer">{playback.reduced?'모션 줄이기 설정 · 정적 표시. ':''}{staticView?'정적 도해 · 시나리오와 노드를 선택해 내용을 비교하세요. ':'플로우와 상태를 비교하는 로컬 샘플입니다. '}외부 서비스나 실제 업무를 실행하지 않습니다.</footer>
 </section>;
}
export default FlowMotionBlock;
