import {
  KLIC_CHART_BOARD_SPEC_SCHEMA,KLIC_CHART_INTERACTIONS,KLIC_CHART_THEMES,KLIC_CHART_TYPES,KLIC_CHART_TYPE_IDS,
  compileKlicChart,compileKlicChartBoard,renderKlicChartBoardSvg,renderKlicChartSvg,validateKlicChart,
} from './klic-chart-runtime.mjs';
import {
  CHART_APP_CSP,CHART_APP_MIME,CHART_APP_URI,KLIC_CHART_PROMPTS,KLIC_CHART_SKILLS,
  chartResourceList,getKlicChartPrompt,getKlicChartSkill,readChartResource,supportsKlicChartApp,
} from './chart-authoring.mjs';

const object=(properties,required=[])=>({type:'object',properties,...(required.length?{required}:{}),additionalProperties:false});
const readOnly={readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false};
const localTool=(name,title,description,inputSchema)=>({name,title,description,inputSchema,annotations:readOnly});
const showChartInput={oneOf:[
 object({chart:KLIC_CHART_BOARD_SPEC_SCHEMA.properties.charts.items},['chart']),
 object({board:KLIC_CHART_BOARD_SPEC_SCHEMA},['board']),
]};
export const KLIC_CHART_METADATA_TOOL_DEFINITIONS=[
 {name:'klic_list_chart_types',title:'List KLIC chart types',description:'List KLIC-owned data-driven chart types, required/optional channels, field kinds, options, interactions and keyboard contracts. Filter by type, family or query.',inputSchema:object({type:{type:'string',enum:KLIC_CHART_TYPE_IDS},family:{type:'string'},query:{type:'string',maxLength:120}}),annotations:readOnly},
 {name:'klic_list_chart_themes',title:'List KLIC chart themes',description:'List the KLIC Core, Studio and Data profiles in light/dark modes with their blue and neutral chart palettes. Arbitrary renderer themes are not accepted.',inputSchema:object({profile:{type:'string',enum:['core','studio','data']},mode:{type:'string',enum:['light','dark']}}),annotations:readOnly},
 {name:'klic_list_chart_interactions',title:'List KLIC chart interactions',description:'List supported KLIC inspect and select contracts or filter them for one KLIC chart type.',inputSchema:object({chartType:{type:'string',enum:KLIC_CHART_TYPE_IDS},type:{type:'string',enum:KLIC_CHART_INTERACTIONS.map(item=>item.type)}}),annotations:readOnly},
 {name:'klic_get_chart_skill',title:'Get KLIC chart authoring skill',description:'Return KLIC chart, theme, interaction or board authoring instructions, optionally narrowed to a heading.',inputSchema:object({skill:{type:'string',enum:Object.keys(KLIC_CHART_SKILLS)},section:{type:'string',maxLength:120}}),annotations:readOnly},
];
export const KLIC_CHART_LOCAL_TOOL_DEFINITIONS=[
 localTool('klic_validate_chart','Validate KLIC chart','Validate a KLIC chart spec on local stdio and return path-specific schema, field, option, interaction and limit diagnostics.',object({spec:KLIC_CHART_BOARD_SPEC_SCHEMA.properties.charts.items},['spec'])),
 localTool('klic_compile_chart','Compile KLIC chart','Compile one KLIC chart locally to SVG geometry, plot rows, an exact table and omission diagnostics.',object({spec:KLIC_CHART_BOARD_SPEC_SCHEMA.properties.charts.items},['spec'])),
 localTool('klic_render_chart','Render KLIC chart','Render one validated KLIC chart as deterministic KLIC SVG and an exact-value table. Data stays in the local stdio process.',object({spec:KLIC_CHART_BOARD_SPEC_SCHEMA.properties.charts.items},['spec'])),
 localTool('klic_show_chart','Show KLIC chart or board','Show one KLIC chart or a static board. On MCP Apps hosts the tool opens the bundled chart view; other hosts receive SVG text and exact tables.',showChartInput),
 localTool('klic_validate_chart_board','Validate KLIC chart board','Validate a static board of 1–8 independent KLIC chart specs. Linked filtering and shared dashboard state are not supported.',object({board:KLIC_CHART_BOARD_SPEC_SCHEMA},['board'])),
];
export const KLIC_CHART_LOCAL_TOOL_NAMES=Object.freeze(KLIC_CHART_LOCAL_TOOL_DEFINITIONS.map(tool=>tool.name));
export function getKlicChartMcpTools({transport='mcp',clientCapabilities}={}){
 if(transport!=='stdio-mcp')return [];
 return KLIC_CHART_LOCAL_TOOL_DEFINITIONS.map(tool=>tool.name==='klic_show_chart'&&supportsKlicChartApp(clientCapabilities)
  ?{...tool,_meta:{ui:{resourceUri:CHART_APP_URI,visibility:['model']}}}
 :{...tool});
}
export function getKlicChartResources({transport='mcp',clientCapabilities}={}){
 return chartResourceList({includeApp:transport==='stdio-mcp'&&supportsKlicChartApp(clientCapabilities)});
}
export function readKlicChartResource(uri){return readChartResource(uri);}
export function getKlicChartPromptList(){return KLIC_CHART_PROMPTS;}

const filters=(input,allowed)=>{if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Arguments must be an object.');for(const key of Object.keys(input))if(!allowed.includes(key))throw new Error(`Unknown argument: ${key}`);};
function chartTypes(input,invalid){
 filters(input,['type','family','query']);const query=input.query?.trim().toLocaleLowerCase()||'';
 if(input.type&&!KLIC_CHART_TYPES[input.type])invalid(`Unknown KLIC chart type: ${input.type}.`);
 const types=Object.values(KLIC_CHART_TYPES).filter(type=>(!input.type||type.id===input.type)&&(!input.family||type.family===input.family)&&(!query||`${type.id} ${type.family} ${type.channels.map(channel=>channel.name).join(' ')}`.toLocaleLowerCase().includes(query)));
 return {schemaVersion:'1.0',total:types.length,types};
}
function chartThemes(input,invalid){
 filters(input,['profile','mode']);if(input.profile&&!KLIC_CHART_THEMES.profiles.includes(input.profile))invalid('profile must be core, studio, or data.');if(input.mode&&!KLIC_CHART_THEMES.modes.includes(input.mode))invalid('mode must be light or dark.');
 const profiles=input.profile?[input.profile]:KLIC_CHART_THEMES.profiles,modes=input.mode?[input.mode]:KLIC_CHART_THEMES.modes;
 return {schemaVersion:'1.0',profiles,modes,themes:profiles.flatMap(profile=>modes.map(mode=>({profile,mode,...KLIC_CHART_THEMES[mode]})))};
}
function chartInteractions(input,invalid){
 filters(input,['chartType','type']);if(input.chartType&&!KLIC_CHART_TYPES[input.chartType])invalid(`Unknown KLIC chart type: ${input.chartType}.`);const supported=input.chartType?new Set(KLIC_CHART_TYPES[input.chartType].interactions):null;
 const presets=KLIC_CHART_INTERACTIONS.filter(item=>(!supported||supported.has(item.type))&&(!input.type||input.type===item.type));return {schemaVersion:'1.0',presets};
}
function chartSkill(input,invalid){
 filters(input,['skill','section']);if(!Object.hasOwn(KLIC_CHART_SKILLS,input.skill))invalid('skill must be chart, theme, interaction, or board.');const skill=getKlicChartSkill(input);if(!skill)invalid(`No section named ${input.section} exists in the ${input.skill} skill.`);return {schemaVersion:'1.0',...skill};
}
function visibleResult(compiled,withPlotData=false){
 if(!compiled.valid)return {schemaVersion:'1.0',valid:false,errors:compiled.errors};
 return {schemaVersion:'1.0',valid:true,type:compiled.type,family:compiled.family,display:compiled.display,...(withPlotData?{plotData:compiled.plotData}:{}),table:compiled.table,diagnostics:compiled.diagnostics,summary:compiled.summary};
}
export function executeKlicChartTool(name,input,invalid){
 if(name==='klic_list_chart_types')return chartTypes(input,invalid);
 if(name==='klic_list_chart_themes')return chartThemes(input,invalid);
 if(name==='klic_list_chart_interactions')return chartInteractions(input,invalid);
 if(name==='klic_get_chart_skill')return chartSkill(input,invalid);
 if(name==='klic_validate_chart'){
  filters(input,['spec']);const result=validateKlicChart(input.spec);return {schemaVersion:'1.0',valid:result.valid,errors:result.errors};
 }
 if(name==='klic_compile_chart'){
  filters(input,['spec']);return visibleResult(compileKlicChart(input.spec),true);
 }
 if(name==='klic_render_chart'){
  filters(input,['spec']);const compiled=compileKlicChart(input.spec);if(!compiled.valid)return {schemaVersion:'1.0',valid:false,errors:compiled.errors};const svg=renderKlicChartSvg(compiled);if(new TextEncoder().encode(svg).byteLength>1048576)return {schemaVersion:'1.0',valid:false,errors:[{path:'output.svg',code:'LIMIT_EXCEEDED',message:'Rendered SVG is limited to 1 MiB.'}]};return {...visibleResult(compiled),svg};
 }
 if(name==='klic_validate_chart_board'){
  filters(input,['board']);const board=compileKlicChartBoard(input.board);return {schemaVersion:'1.0',valid:board.valid,title:board.title??'',columns:board.columns??input.board?.columns,charts:board.charts.map(chart=>chart.valid?{valid:true,type:chart.type,summary:chart.summary,errors:[]}:{valid:false,errors:chart.errors}),errors:board.errors};
 }
 if(name==='klic_show_chart'){
  filters(input,['chart','board']);if(!!input.chart===!!input.board)invalid('Provide exactly one of chart or board.');
  if(input.chart){const compiled=compileKlicChart(input.chart);if(!compiled.valid)return {schemaVersion:'1.0',valid:false,view:'chart',errors:compiled.errors};const svg=renderKlicChartSvg(compiled);if(new TextEncoder().encode(svg).byteLength>1048576)return {schemaVersion:'1.0',valid:false,view:'chart',errors:[{path:'output.svg',code:'LIMIT_EXCEEDED',message:'Rendered SVG is limited to 1 MiB.'}]};return {schemaVersion:'1.0',valid:true,view:'chart',type:compiled.type,svg,table:compiled.table,diagnostics:compiled.diagnostics,summary:compiled.summary};}
  const board=compileKlicChartBoard(input.board);if(!board.valid)return {schemaVersion:'1.0',valid:false,view:'board',errors:board.errors,charts:board.charts.map(chart=>chart.valid?{valid:true,type:chart.type,summary:chart.summary}:{valid:false,errors:chart.errors})};const svg=renderKlicChartBoardSvg(board);if(new TextEncoder().encode(svg).byteLength>1048576)return {schemaVersion:'1.0',valid:false,view:'board',errors:[{path:'output.svg',code:'LIMIT_EXCEEDED',message:'Rendered SVG board is limited to 1 MiB.'}]};return {schemaVersion:'1.0',valid:true,view:'board',title:board.title,columns:board.columns,svg,charts:board.charts.map(chart=>({valid:true,type:chart.type,table:chart.table,summary:chart.summary}))};
 }
 return null;
}
export {CHART_APP_CSP,CHART_APP_MIME,CHART_APP_URI,getKlicChartPrompt};
