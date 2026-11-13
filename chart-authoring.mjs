import {KLIC_CHART_INTERACTIONS,KLIC_CHART_THEMES,KLIC_CHART_TYPES,KLIC_CHART_TYPE_IDS} from './chart-types.mjs';

export const CHART_APP_URI='ui://klic/chart-view.html';
export const CHART_APP_MIME='text/html;profile=mcp-app';
export const CHART_APP_CSP=Object.freeze({connectDomains:[],resourceDomains:[],frameDomains:[],baseUriDomains:[]});
export const KLIC_CHART_SKILLS=Object.freeze({
 chart:[
  '# KLIC chart authoring','',
  'Use the KLIC-owned `KlicChartSpec` schema. Start with `klic_list_chart_types` and select a KLIC type by its accepted channels. Bind each encoding to one field in `data.rows`; declare field kind, display label, and unit when known.','',
  '```json','{"schemaVersion":"1.0","data":{"rows":[{"month":"2026-01","users":120},{"month":"2026-02","users":155}]},"fields":{"month":{"kind":"temporal","label":"Month"},"users":{"kind":"quantitative","label":"Users","unit":"people"}},"chart":{"type":"line","encodings":{"x":"month","y":"users"}},"display":{"title":"Monthly users","profile":"core","mode":"light"}}','```','',
  'Call `klic_validate_chart` before `klic_show_chart`. The spec is limited to 5,000 rows and 1 MiB. Values are scalar JSON values. KLIC renders local SVG only; it does not fetch URLs or read files. Every compiled chart includes an exact table from its plot data. Use KLIC blue and neutral roles, never add green, mint, or teal colors.','',
  'Use `klic_render_chart` for SVG text, `klic_compile_chart` for plot data and diagnostics, and `klic_show_chart` for the chart view. Hosted HTTP and WebMCP expose chart metadata; row-bearing chart tools run on local stdio only.',
 ].join('\n'),
 theme:[
  '# KLIC chart themes','',
  'KLIC chart profiles are `core`, `studio`, and `data`; each supports `light` and `dark`. Use `klic_list_chart_themes` to read the current blue/neutral palette. A profile changes palette ordering and presentation context without accepting arbitrary CSS, fonts, external assets, or external renderer backends.','',
  'Use the existing `klic.*` four-layer token paths in application UI. Keep plot series blue or neutral; use amber/red only where data explicitly encodes warning or danger.',
 ].join('\n'),
 interaction:[
  '# KLIC chart interactions','',
  'Use `klic_list_chart_interactions` and check the selected chart type’s supported interactions. KLIC exposes exact-value inspection and single-row selection in the React chart view. Escape clears selection. Keyboard instructions come from the KLIC type registry.','',
  'KLIC v1 has no chart-linked cross-filter, arbitrary update language, or persistent board state. Keep exact values available through the compiled data table.',
 ].join('\n'),
 board:[
  '# KLIC chart boards','',
  'Use `KlicChartBoardSpec` to validate a static board with 1–8 independent KLIC chart specs and 1–3 columns. Give each chart its own data and encodings; run `klic_validate_chart_board`, then `klic_show_chart` with the board. KLIC v1 does not link filters or share dashboard state between charts.',
 ].join('\n'),
});

export function getKlicChartSkill({skill='chart',section}={}){
 const text=KLIC_CHART_SKILLS[skill];if(!text)return null;
 if(section===undefined)return {skill,contents:text};
 const heading=`## ${section}`,start=text.indexOf(heading);if(start<0)return null;const next=text.indexOf('\n## ',start+heading.length);return {skill,section,contents:text.slice(start,next<0?undefined:next).trim()};
}

export function chartResourceList({includeApp=false}={}){
 const resources=[
  {uri:'klic://chart-types',name:'klic-chart-types',title:'KLIC chart type catalog',description:'KLIC chart IDs, required channels, options and keyboard contracts.',mimeType:'application/json'},
  {uri:'klic://chart-authoring',name:'klic-chart-authoring',title:'KLIC chart authoring guide',description:'KlicChartSpec authoring, limits, privacy boundary and rendering flow.',mimeType:'text/markdown'},
  {uri:'klic://chart-themes',name:'klic-chart-themes',title:'KLIC chart themes',description:'KLIC profile and mode palettes.',mimeType:'application/json'},
  {uri:'klic://chart-interactions',name:'klic-chart-interactions',title:'KLIC chart interactions',description:'Supported KLIC chart interaction contracts.',mimeType:'application/json'},
 ];
 if(includeApp)resources.push({uri:CHART_APP_URI,name:'klic-chart-view',title:'KLIC chart view',description:'Sandboxed local chart and exact-value table view.',mimeType:CHART_APP_MIME,_meta:{ui:{csp:CHART_APP_CSP,prefersBorder:true}}});
 return resources;
}

export function readChartResource(uri){
 if(uri==='klic://chart-types')return {uri,mimeType:'application/json',text:JSON.stringify({schemaVersion:'1.0',types:KLIC_CHART_TYPES})};
 if(uri==='klic://chart-authoring')return {uri,mimeType:'text/markdown',text:KLIC_CHART_SKILLS.chart};
 if(uri==='klic://chart-themes')return {uri,mimeType:'application/json',text:JSON.stringify(KLIC_CHART_THEMES)};
 if(uri==='klic://chart-interactions')return {uri,mimeType:'application/json',text:JSON.stringify(KLIC_CHART_INTERACTIONS)};
 if(uri===CHART_APP_URI)return {uri,mimeType:CHART_APP_MIME,text:KLIC_CHART_VIEW_HTML,_meta:{ui:{csp:CHART_APP_CSP,prefersBorder:true}}};
 return null;
}

export const KLIC_CHART_PROMPTS=Object.freeze([
 {name:'klic_author_chart',title:'Author a KLIC chart',description:'Load KLIC chart-spec rules before creating a chart.',arguments:[{name:'goal',description:'What the chart should help compare or explain.',required:true}]},
 {name:'klic_author_chart_board',title:'Author a KLIC chart board',description:'Load KLIC chart-board rules before creating a static board.',arguments:[{name:'goal',description:'What the board should compare.',required:true}]},
]);
export function getKlicChartPrompt(name,args={}){
 const prompt=KLIC_CHART_PROMPTS.find(item=>item.name===name);if(!prompt)return null;
 const goal=typeof args.goal==='string'&&args.goal.trim()?args.goal.trim():'Create a useful chart from the supplied rows.';
 const skill=getKlicChartSkill({skill:name==='klic_author_chart_board'?'board':'chart'}).contents;
 return {description:prompt.description,messages:[{role:'user',content:{type:'text',text:`${skill}\n\nUser goal: ${goal}`}}]};
}

export function supportsKlicChartApp(capabilities){return capabilities?.extensions?.['io.modelcontextprotocol/ui']?.mimeTypes?.includes(CHART_APP_MIME)===true;}
export const KLIC_CHART_APP_CAPABILITY=CHART_APP_MIME;
export const CHART_APP_LOCAL_TYPES=KLIC_CHART_TYPE_IDS;

export const KLIC_CHART_VIEW_HTML=`<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>KLIC chart</title>
<style>
:root{color-scheme:light dark;font:14px/1.5 system-ui,sans-serif;color:#132c46;background:#fbfcfe}*{box-sizing:border-box}body{margin:0;padding:16px;background:var(--color-background-primary,#fbfcfe);color:var(--color-text-primary,#132c46)}header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}h1{font-size:18px;line-height:1.3;margin:0 0 4px}p{margin:0;color:var(--color-text-secondary,#52657b)}img{display:block;max-width:100%;height:auto;margin:14px auto;border:1px solid #dfe5ee;border-radius:8px;background:#fff}details{margin-top:12px}summary{cursor:pointer;padding:8px 0}table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums}th,td{text-align:left;padding:7px 9px;border-bottom:1px solid #dfe5ee}th{font-weight:600;color:#52657b}#status{min-height:1.5em;color:#52657b}.error{color:#b42318}@media(prefers-color-scheme:dark){:root{color:#e8eef8;background:#101722}img{border-color:#31425c}th,td{border-color:#31425c}th,p,#status{color:#a8b6cc}}</style></head>
<body><header><div><h1 id="title">KLIC chart</h1><p id="summary">Waiting for local chart result…</p></div></header><div id="status" role="status" aria-live="polite"></div><main id="charts"></main><details id="data" hidden><summary>Exact data</summary><div id="tables"></div></details>
<script>
(()=>{'use strict';const title=document.getElementById('title'),summary=document.getElementById('summary'),status=document.getElementById('status'),charts=document.getElementById('charts'),data=document.getElementById('data'),tables=document.getElementById('tables');let ready=false;
const send=(method,params={})=>window.parent.postMessage({jsonrpc:'2.0',method,params},'*');
function addTable(target,table){if(!table||!Array.isArray(table.columns)||!Array.isArray(table.rows))return;const element=document.createElement('table'),head=document.createElement('thead'),headRow=document.createElement('tr');for(const column of table.columns){const cell=document.createElement('th');cell.scope='col';cell.textContent=String(column);headRow.append(cell);}head.append(headRow);const body=document.createElement('tbody');for(const row of table.rows){const tr=document.createElement('tr');for(const value of row){const td=document.createElement('td');td.textContent=value===null?'—':String(value);tr.append(td);}body.append(tr);}element.append(head,body);target.append(element);}
function show(result){const value=result&&result.structuredContent;if(!value||value.valid===false){status.textContent=(result?.content||[]).map(item=>item.text||'').join(' ')||'차트를 만들지 못했습니다.';status.className='error';return;}title.textContent=value.summary?.title||value.title||value.type||'KLIC chart';summary.textContent=value.summary?value.summary.rows+'개 행 · '+value.summary.marks+'개 mark':value.charts?.length+'개 독립 차트';charts.replaceChildren();if(typeof value.svg==='string'){const image=document.createElement('img');image.alt=title.textContent+' 차트';image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(value.svg);charts.append(image);}tables.replaceChildren();addTable(tables,value.table);for(const chart of value.charts||[])addTable(tables,chart.table);data.hidden=tables.childElementCount===0;status.textContent=(value.diagnostics||[]).join(' ');status.className='';}
window.addEventListener('message',event=>{if(event.source!==window.parent)return;const message=event.data;if(!message||message.jsonrpc!=='2.0')return;if(message.id===1&&message.result&&!ready){ready=true;send('ui/notifications/initialized');return;}if(message.method==='ui/notifications/tool-result')show(message.params);if(message.method==='ui/notifications/tool-cancelled')status.textContent='Chart rendering was cancelled.';if(message.method==='ui/notifications/host-context-changed'&&message.params?.theme)document.documentElement.dataset.theme=message.params.theme;});
window.parent.postMessage({jsonrpc:'2.0',id:1,method:'ui/initialize',params:{protocolVersion:'2026-01-26',appInfo:{name:'klic-chart-view',version:'1.0.0'},appCapabilities:{availableDisplayModes:['inline']}}},'*');})();
</script></body></html>`;
