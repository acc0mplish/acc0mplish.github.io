import {KLIC_CHART_TYPES,KLIC_CHART_TYPE_IDS,KLIC_CHART_SPEC_SCHEMA,KLIC_CHART_BOARD_SPEC_SCHEMA,KLIC_CHART_THEMES,KLIC_CHART_INTERACTIONS,KLIC_CHART_EXAMPLE_TYPES} from './chart-types.mjs';
import {compileCartesian} from './klic-chart-renderers/cartesian.mjs';
import {compileComposition} from './klic-chart-renderers/composition.mjs';
import {compileDistribution} from './klic-chart-renderers/distribution.mjs';
import {compileFlowSpatial} from './klic-chart-renderers/flow-spatial.mjs';
import {compileMatrix} from './klic-chart-renderers/matrix.mjs';
import {compileTimeline} from './klic-chart-renderers/timeline.mjs';
import {layoutFor} from './klic-chart-renderers/base.mjs';

const own=(value,key)=>Object.prototype.hasOwnProperty.call(value,key);
const isRecord=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
const scalar=value=>value===null||typeof value==='string'||typeof value==='boolean'||typeof value==='number';
const geometryTypes=new Set(['map','choropleth']);
const coordinateLimit=50000;
const textEncoder=new TextEncoder();
const path=(value)=>String(value||'').replace(/\[(\d+)\]/g,'.$1').replace(/^\./,'');
function add(errors,where,code,message){errors.push({path:path(where),code,message});}
function rejectUnknown(value,allowed,where,errors){if(!isRecord(value))return;for(const key of Object.keys(value))if(!allowed.includes(key))add(errors,where?`${where}.${key}`:key,'UNKNOWN_PROPERTY',`Unexpected property: ${key}.`);}
function inferredKind(value){if(typeof value==='boolean')return 'categorical';if(typeof value==='number')return 'quantitative';if(typeof value==='string'&&/^\d{4}-\d{2}(?:-\d{2})?(?:[T ].*)?$/.test(value)&&Number.isFinite(Date.parse(value)))return 'temporal';return typeof value==='string'?'categorical':null;}
function matchesKind(value,kind){if(value===null)return true;switch(kind){case 'categorical':return typeof value==='string'||typeof value==='boolean';case 'ordinal':return typeof value==='string'||typeof value==='number'&&Number.isFinite(value);case 'quantitative':return typeof value==='number'&&Number.isFinite(value);case 'temporal':return typeof value==='number'&&Number.isFinite(value)||typeof value==='string'&&/^\d{4}-\d{2}(?:-\d{2})?(?:[T ].*)?$/.test(value)&&Number.isFinite(Date.parse(value));default:return false;}}
function validateGeometry(geometry,errors){
 if(!isRecord(geometry)||geometry.type!=='FeatureCollection'||!Array.isArray(geometry.features)){add(errors,'geometry','INVALID_GEOMETRY','geometry must be an inline FeatureCollection.');return;}
 rejectUnknown(geometry,['type','features'],'geometry',errors);
 if(geometry.features.length<1)add(errors,'geometry.features','INVALID_GEOMETRY','FeatureCollection needs at least one Polygon or MultiPolygon feature.');
 if(geometry.features.length>2000)add(errors,'geometry.features','LIMIT_EXCEEDED','Geometry is limited to 2,000 features.');
 let positions=0;
 for(const [featureIndex,feature] of geometry.features.entries()){
  const base=`geometry.features[${featureIndex}]`;
  if(!isRecord(feature)||feature.type!=='Feature'||typeof feature.id!=='string'||!isRecord(feature.properties)||!isRecord(feature.geometry)){add(errors,base,'INVALID_FEATURE','Each feature needs a string id, properties object, and Polygon or MultiPolygon geometry.');continue;}
  rejectUnknown(feature,['type','id','properties','geometry'],base,errors);if(feature.id.length>120)add(errors,`${base}.id`,'INVALID_FEATURE','Feature IDs are limited to 120 characters.');rejectUnknown(feature.geometry,['type','coordinates'],`${base}.geometry`,errors);
  for(const [name,value] of Object.entries(feature.properties))if(value!==null&&typeof value!=='string'&&!(typeof value==='number'&&Number.isFinite(value)))add(errors,`${base}.properties.${name}`,'INVALID_VALUE','Geometry properties must be strings, finite numbers, or null.');
  if(!['Polygon','MultiPolygon'].includes(feature.geometry.type)){add(errors,`${base}.geometry.type`,'INVALID_GEOMETRY','Only Polygon and MultiPolygon are accepted.');continue;}
  const polygons=feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:feature.geometry.coordinates;
  if(!Array.isArray(polygons)){add(errors,`${base}.geometry.coordinates`,'INVALID_GEOMETRY','Expected polygon coordinate arrays.');continue;}
  for(const polygon of polygons){if(!Array.isArray(polygon)){add(errors,`${base}.geometry.coordinates`,'INVALID_GEOMETRY','Expected polygon rings.');continue;}for(const ring of polygon){if(!Array.isArray(ring)){add(errors,`${base}.geometry.coordinates`,'INVALID_GEOMETRY','Expected coordinate rings.');continue;}if(ring.length<4)add(errors,`${base}.geometry.coordinates`,'INVALID_GEOMETRY','Polygon rings need at least four positions.');for(const point of ring){positions++;if(!Array.isArray(point)||point.length!==2||!Number.isFinite(point[0])||!Number.isFinite(point[1])||point[0]<-180||point[0]>180||point[1]<-90||point[1]>90)add(errors,`${base}.geometry.coordinates`,'INVALID_COORDINATE','Coordinates must be finite longitude/latitude pairs within geographic bounds.');}const first=ring[0],last=ring.at(-1);if(Array.isArray(first)&&Array.isArray(last)&&(first[0]!==last[0]||first[1]!==last[1]))add(errors,`${base}.geometry.coordinates`,'INVALID_GEOMETRY','Polygon rings must be closed.');}}
 }
 if(positions>coordinateLimit)add(errors,'geometry.features','LIMIT_EXCEEDED','Map geometry is limited to 50,000 coordinate positions.');
}
function validateOptions(options,definition,errors){
 if(options===undefined)return;
 if(!isRecord(options)){add(errors,'chart.options','INVALID_TYPE','chart.options must be an object.');return;}
 for(const [name,value] of Object.entries(options)){
  const rule=definition.options?.[name],where=`chart.options.${name}`;
  if(!rule){add(errors,where,'UNKNOWN_OPTION',`Unknown option for ${definition.id}: ${name}.`);continue;}
  if(rule.enum&&!rule.enum.includes(value))add(errors,where,'INVALID_OPTION',`Choose one of: ${rule.enum.join(', ')}.`);
  if(rule.integer&&(!Number.isInteger(value)||value<rule.min||value>rule.max))add(errors,where,'INVALID_OPTION',`Value must be an integer from ${rule.min} to ${rule.max}.`);
  if(rule.number&&(typeof value!=='number'||!Number.isFinite(value)))add(errors,where,'INVALID_OPTION','Value must be finite.');
  if(rule.type==='string'&&(typeof value!=='string'||value.length>120))add(errors,where,'INVALID_OPTION','Value must be a string up to 120 characters.');
  if(rule.stringArray&&(!Array.isArray(value)||value.length<rule.min||value.length>rule.max||value.some(item=>typeof item!=='string')))add(errors,where,'INVALID_OPTION',`Value must contain ${rule.min}–${rule.max} field names.`);
 }
}
function validateChannels(spec,definition,errors){
 const encodings=spec.chart.encodings;if(!isRecord(encodings)){add(errors,'chart.encodings','INVALID_TYPE','chart.encodings must map channels to fields.');return;}
 if(Object.keys(encodings).length>16)add(errors,'chart.encodings','LIMIT_EXCEEDED','A chart can encode at most 16 channels.');
 const allowed=new Map(definition.channels.map(item=>[item.name,item]));
 for(const [name,field] of Object.entries(encodings)){
  const rule=allowed.get(name);if(!rule){add(errors,`chart.encodings.${name}`,'UNKNOWN_CHANNEL',`Channel is not supported by ${definition.id}.`);continue;}
  if(typeof field!=='string'||!field){add(errors,`chart.encodings.${name}`,'INVALID_FIELD','Encoding must name a field in data.rows.');continue;}
  const has=spec.data.rows.some(row=>isRecord(row)&&own(row,field));if(!has){add(errors,`chart.encodings.${name}`,'UNKNOWN_FIELD',`Field ${field} is missing from data.rows.`);continue;}
  const declared=spec.fields?.[field]?.kind,acceptedKinds=rule.kinds??[rule.kind];let hasValue=false,implicitKind=null;
  for(const [rowIndex,row] of spec.data.rows.entries()){
   if(!own(row,field)||row[field]===null)continue;hasValue=true;
   implicitKind??=inferredKind(row[field]);
   if(!scalar(row[field])||typeof row[field]==='number'&&!Number.isFinite(row[field]))add(errors,`data.rows[${rowIndex}].${field}`,'INVALID_VALUE','Values must be strings, booleans, null, or finite numbers.');
   else if(!matchesKind(row[field],declared??implicitKind??rule.kind))add(errors,`data.rows[${rowIndex}].${field}`,'FIELD_KIND_MISMATCH',`Field ${field} must contain ${declared??implicitKind??rule.kind} values.`);
  }
  if(!hasValue)add(errors,`chart.encodings.${name}`,'EMPTY_FIELD',`Field ${field} has no usable values.`);
  const actualKind=declared??implicitKind;if(actualKind&&!acceptedKinds.includes(actualKind))add(errors,`fields.${field}${declared?'.kind':''}`,'FIELD_KIND_MISMATCH',`Channel ${name} requires a ${acceptedKinds.join(' or ')} field.`);
 }
 for(const rule of definition.channels)if(rule.required&&!own(encodings,rule.name))add(errors,`chart.encodings.${rule.name}`,'MISSING_CHANNEL',`Channel ${rule.name} is required by ${definition.id}.`);
 if(definition.id==='combo'&&own(encodings,'y2')){const primaryUnit=spec.fields?.[encodings.y]?.unit,secondaryUnit=spec.fields?.[encodings.y2]?.unit;if(typeof primaryUnit==='string'&&typeof secondaryUnit==='string'&&primaryUnit!==secondaryUnit)add(errors,'chart.encodings.y2','INCOMPATIBLE_UNITS','Combo charts use one shared y scale; y and y2 must declare the same unit.');}
 const nonNegativeValueChannels={pie:'value',donut:'value',radial:'value',rose:'value',treemap:'value',sunburst:'value',funnel:'value',sankey:'value','market-depth':'quantity',orderbook:'quantity'};
 const nonNegativeChannel=nonNegativeValueChannels[definition.id];
 if(nonNegativeChannel&&typeof encodings[nonNegativeChannel]==='string'){
  const field=encodings[nonNegativeChannel];
  for(const [rowIndex,row] of spec.data.rows.entries())if(isRecord(row)&&typeof row[field]==='number'&&row[field]<0)add(errors,`data.rows[${rowIndex}].${field}`,'NEGATIVE_VALUE',`${definition.id} requires non-negative ${nonNegativeChannel} values.`);
 }
 if(definition.id==='candlestick'&&['open','high','low','close'].every(name=>typeof encodings[name]==='string')){
  const fields=Object.fromEntries(['open','high','low','close'].map(name=>[name,encodings[name]]));
  for(const [rowIndex,row] of spec.data.rows.entries())if(isRecord(row)&&Object.values(fields).every(field=>typeof row[field]==='number'&&Number.isFinite(row[field]))){
   const {open,high,low,close}=Object.fromEntries(Object.entries(fields).map(([name,field])=>[name,row[field]]));
   if(low>Math.min(open,close)||high<Math.max(open,close)||low>high)add(errors,`data.rows[${rowIndex}]`,'INVALID_OHLC','Candlestick rows must satisfy low ≤ min(open, close) ≤ max(open, close) ≤ high.');
  }
 }
 if(['range-area','forecast-fan'].includes(definition.id)&&typeof encodings.low==='string'&&typeof encodings.high==='string'){
  for(const [rowIndex,row] of spec.data.rows.entries())if(isRecord(row)&&typeof row[encodings.low]==='number'&&typeof row[encodings.high]==='number'&&row[encodings.low]>row[encodings.high])add(errors,`data.rows[${rowIndex}]`,'INVALID_RANGE','The low channel must not exceed the high channel.');
 }
 if(definition.id==='correlation-matrix'&&typeof encodings.value==='string'){
  for(const [rowIndex,row] of spec.data.rows.entries())if(isRecord(row)&&typeof row[encodings.value]==='number'&&(row[encodings.value]<-1||row[encodings.value]>1))add(errors,`data.rows[${rowIndex}].${encodings.value}`,'INVALID_CORRELATION','Correlation values must be between -1 and 1.');
 }
 if(definition.id==='parallel-coordinates'){
  const dimensions=Object.keys(encodings).filter(name=>/^dimension[1-8]$/.test(name));if(dimensions.length<3)add(errors,'chart.encodings','MISSING_CHANNEL','Parallel coordinates requires at least three dimensions.');
  for(let index=1;index<dimensions.length;index++)if(!dimensions.includes(`dimension${index+1}`))add(errors,'chart.encodings','INVALID_CHANNELS','Dimension channels must be consecutive from dimension1.');
 }
 for(const [field,descriptor] of Object.entries(isRecord(spec.fields)?spec.fields:{})){
  if(!isRecord(descriptor)||!['categorical','ordinal','quantitative','temporal'].includes(descriptor.kind))add(errors,`fields.${field}`,'INVALID_FIELD','Field semantics must declare a supported kind.');
  rejectUnknown(descriptor,['kind','label','unit','domain'],`fields.${field}`,errors);
  if(descriptor?.label!==undefined&&(typeof descriptor.label!=='string'||descriptor.label.length>120))add(errors,`fields.${field}.label`,'INVALID_FIELD','Field labels must be strings up to 120 characters.');
  if(descriptor?.unit!==undefined&&(typeof descriptor.unit!=='string'||descriptor.unit.length>40))add(errors,`fields.${field}.unit`,'INVALID_FIELD','Field units must be strings up to 40 characters.');
  if(descriptor?.domain!==undefined&&(!Array.isArray(descriptor.domain)||descriptor.domain.length!==2||descriptor.domain.some(value=>typeof value!=='number'&&typeof value!=='string')))add(errors,`fields.${field}.domain`,'INVALID_DOMAIN','Field domain must contain two scalar values.');
 }
 for(const [index,interaction] of (Array.isArray(spec.interactions)?spec.interactions:[]).entries()){
  if(!isRecord(interaction)||!definition.interactions.includes(interaction.type)){add(errors,`interactions[${index}].type`,'UNSUPPORTED_INTERACTION',`Interaction is not supported by ${definition.id}.`);continue;}
 }
}
export function validateKlicChart(spec){
 const errors=[];
 if(!isRecord(spec)){add(errors,'','INVALID_TYPE','Chart spec must be an object.');return {valid:false,errors};}
 rejectUnknown(spec,['schemaVersion','data','geometry','fields','chart','display','interactions'],'',errors);
 let bytes;try{bytes=textEncoder.encode(JSON.stringify(spec)).byteLength;}catch{bytes=Infinity;}
 if(bytes>1048576)add(errors,'','LIMIT_EXCEEDED','Chart spec is limited to 1 MiB.');
 if(spec.schemaVersion!=='1.0')add(errors,'schemaVersion','UNSUPPORTED_VERSION','schemaVersion must be 1.0.');
 if(!isRecord(spec.data)||!Array.isArray(spec.data.rows))add(errors,'data.rows','INVALID_TYPE','data.rows must be an array.');
 else{
  rejectUnknown(spec.data,['rows'],'data',errors);
  if(spec.data.rows.length<1||spec.data.rows.length>5000)add(errors,'data.rows','LIMIT_EXCEEDED','Charts need 1–5,000 rows.');
  for(const [index,row] of spec.data.rows.entries()){
   if(!isRecord(row)||Object.keys(row).length<1||Object.keys(row).length>64){add(errors,`data.rows[${index}]`,'INVALID_ROW','Each row must be an object with 1–64 fields.');continue;}
   for(const [name,value] of Object.entries(row))if(!scalar(value)||typeof value==='number'&&!Number.isFinite(value))add(errors,`data.rows[${index}].${name}`,'INVALID_VALUE','Values must be strings, booleans, null, or finite numbers.');
  }
 }
 if(!isRecord(spec.chart)){add(errors,'chart','INVALID_TYPE','chart must be an object.');return {valid:false,errors};}
 rejectUnknown(spec.chart,['type','encodings','options'],'chart',errors);
 const definition=KLIC_CHART_TYPES[spec.chart.type];if(!definition)add(errors,'chart.type','UNKNOWN_CHART_TYPE',`Unknown KLIC chart type: ${String(spec.chart.type)}.`);
 if(spec.chart.options!==undefined&&definition)validateOptions(spec.chart.options,definition,errors);
 if(spec.fields!==undefined&&!isRecord(spec.fields))add(errors,'fields','INVALID_TYPE','fields must be an object.');
 if(isRecord(spec.chart)&&definition&&isRecord(spec.data)&&Array.isArray(spec.data.rows))validateChannels(spec,definition,errors);
 if(spec.display!==undefined){if(!isRecord(spec.display))add(errors,'display','INVALID_TYPE','display must be an object.');else{rejectUnknown(spec.display,['title','subtitle','width','height','profile','mode'],'display',errors);
  if(spec.display.title!==undefined&&(typeof spec.display.title!=='string'||spec.display.title.length>200))add(errors,'display.title','INVALID_OPTION','title must be a string up to 200 characters.');
  if(spec.display.subtitle!==undefined&&(typeof spec.display.subtitle!=='string'||spec.display.subtitle.length>300))add(errors,'display.subtitle','INVALID_OPTION','subtitle must be a string up to 300 characters.');
  for(const dimension of ['width','height'])if(spec.display[dimension]!==undefined&&(!Number.isInteger(spec.display[dimension])||spec.display[dimension]<(dimension==='width'?240:180)||spec.display[dimension]>4000))add(errors,`display.${dimension}`,'LIMIT_EXCEEDED',`${dimension} is outside the supported range.`);
  if(spec.display.profile!==undefined&&!['core','studio','data'].includes(spec.display.profile))add(errors,'display.profile','INVALID_OPTION','profile must be core, studio, or data.');
  if(spec.display.mode!==undefined&&!['light','dark'].includes(spec.display.mode))add(errors,'display.mode','INVALID_OPTION','mode must be light or dark.');
 }}
 if(spec.geometry!==undefined){if(!definition||!geometryTypes.has(definition.id))add(errors,'geometry','UNSUPPORTED_GEOMETRY','Inline GeoJSON is only accepted by map chart types.');else validateGeometry(spec.geometry,errors);}
 if(definition&&geometryTypes.has(definition.id)&&spec.geometry===undefined)add(errors,'geometry','MISSING_GEOMETRY','Map charts require inline Polygon or MultiPolygon geometry.');
 if(spec.interactions!==undefined&&!Array.isArray(spec.interactions))add(errors,'interactions','INVALID_TYPE','interactions must be an array.');
 if(Array.isArray(spec.interactions)&&spec.interactions.length>2)add(errors,'interactions','LIMIT_EXCEEDED','Charts can declare at most two interactions.');
 return {valid:errors.length===0,errors};
}
function paletteFor(spec){const mode=spec.display?.mode==='dark'?'dark':'light',profile=spec.display?.profile??'core',theme=KLIC_CHART_THEMES[mode];if(profile!=='data')return theme;return {...theme,series:[theme.series[0],theme.series[2],theme.series[1],theme.series[4],theme.series[3],theme.series[5]]};}
const toSafeNumber=value=>Number.isFinite(value)?Number(value.toFixed(2)):0;
const escapeXml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
function shapeMarkup(shape){
 const n=toSafeNumber,value=escapeXml;
 if(shape.kind==='line')return `<line x1="${n(shape.x1)}" y1="${n(shape.y1)}" x2="${n(shape.x2)}" y2="${n(shape.y2)}" stroke="${value(shape.stroke)}" stroke-width="${n(shape.width??1)}"${shape.dash?` stroke-dasharray="${value(shape.dash)}"`:''}/>`;
 if(shape.kind==='rect')return `<rect x="${n(shape.x)}" y="${n(shape.y)}" width="${n(shape.width)}" height="${n(shape.height)}" rx="${n(shape.radius??0)}" fill="${value(shape.fill)}" stroke="${value(shape.stroke??'none')}" opacity="${n(shape.opacity??1)}">${shape.title?`<title>${value(shape.title)}</title>`:''}</rect>`;
 if(shape.kind==='circle')return `<circle cx="${n(shape.cx)}" cy="${n(shape.cy)}" r="${n(shape.r)}" fill="${value(shape.fill)}" opacity="${n(shape.opacity??1)}"/>`;
 if(shape.kind==='path')return `<path d="${value(shape.d)}" fill="${value(shape.fill??'none')}" stroke="${value(shape.stroke??'none')}" stroke-width="${n(shape.width??1)}" opacity="${n(shape.opacity??1)}"${shape.fillRule?` fill-rule="${value(shape.fillRule)}"`:''}/>`;
 if(shape.kind==='text'){const rotate=shape.rotate?` transform="rotate(${n(shape.rotate)} ${n(shape.x)} ${n(shape.y)})"`:'';return `<text x="${n(shape.x)}" y="${n(shape.y)}" fill="${value(shape.fill)}" font-size="${n(shape.size??11)}" font-weight="${n(shape.weight??400)}" text-anchor="${value(shape.anchor??'middle')}"${rotate}>${value(shape.text)}</text>`;}
 return '';
}
export function compileKlicChart(spec){
 const validation=validateKlicChart(spec);if(!validation.valid)return {valid:false,errors:validation.errors};
 const type=KLIC_CHART_TYPES[spec.chart.type],display={title:spec.display?.title??type.id,subtitle:spec.display?.subtitle??'',width:spec.display?.width??800,height:spec.display?.height??420,profile:spec.display?.profile??'core',mode:spec.display?.mode??'light'},normalized={...spec,display},palette=paletteFor(normalized),layout=layoutFor(normalized);
 const missing=spec.data.rows.filter(row=>type.channels.filter(channel=>channel.required).some(channel=>row[spec.chart.encodings[channel.name]]===null||row[spec.chart.encodings[channel.name]]===undefined));
 const usableRows=spec.data.rows.filter(row=>!type.channels.filter(channel=>channel.required).some(channel=>row[spec.chart.encodings[channel.name]]===null||row[spec.chart.encodings[channel.name]]===undefined));
 const usableSpec={...normalized,data:{...normalized.data,rows:usableRows}};let rendered;
 if(type.family==='cartesian'||type.family==='market'||type.family==='table')rendered=compileCartesian(usableSpec,type,palette,layout);
 else if(type.family==='distribution')rendered=compileDistribution(usableSpec,type,palette,layout);
 else if(type.family==='composition'||type.family==='polar')rendered=compileComposition(usableSpec,type,palette,layout);
 else if(type.family==='matrix')rendered=compileMatrix(usableSpec,type,palette,layout);
 else if(type.family==='timeline')rendered=compileTimeline(usableSpec,type,palette,layout);
 else rendered=compileFlowSpatial(usableSpec,type,palette,layout);
 if(rendered.shapes.length>10000)return {valid:false,errors:[{path:'data.rows',code:'MARK_LIMIT_EXCEEDED',message:'Compiled chart exceeds 10,000 SVG marks.'}]};
 const diagnostics=missing.length?[`Omitted ${missing.length} row(s) with missing required values.`]:[];
 const plotData={rows:rendered.rows,shapes:rendered.shapes,markCount:rendered.shapes.length,sourceRowCount:spec.data.rows.length,renderedRowCount:usableRows.length,omittedRowCount:missing.length};
 const table={caption:display.title,columns:rendered.table.columns,rows:rendered.table.rows};
 return {valid:true,schemaVersion:'1.0',type:type.id,family:type.family,display,palette,layout,plotData,table,diagnostics,interactions:(spec.interactions||[]).map(interaction=>interaction.type),keyboard:type.keyboard,reducedMotion:type.reducedMotion,summary:{title:display.title,type:type.id,rows:usableRows.length,omittedRows:missing.length,marks:rendered.shapes.length}};
}
export function renderKlicChartSvg(compiled){
 if(!compiled?.valid||!Array.isArray(compiled.plotData?.shapes))throw new TypeError('renderKlicChartSvg requires a valid compiled KLIC chart.');
 const {width,height}=compiled.display,title=compiled.display.title,subtitle=compiled.display.subtitle,palette=compiled.palette,shapes=compiled.plotData.shapes;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(title)}"><title>${escapeXml(title)}</title>${subtitle?`<desc>${escapeXml(subtitle)}</desc>`:''}<rect width="100%" height="100%" fill="${palette.background}"/><g font-family="Arial, sans-serif" font-feature-settings="'tnum'"><text x="${compiled.layout.left}" y="25" fill="${palette.text}" font-size="16" font-weight="700">${escapeXml(title)}</text>${subtitle?`<text x="${compiled.layout.left}" y="42" fill="${palette.muted}" font-size="11">${escapeXml(subtitle)}</text>`:''}${shapes.map(shapeMarkup).join('')}</g></svg>`;
}
export function compileKlicChartBoard(board){
 const errors=[];if(!isRecord(board)){return {valid:false,charts:[],errors:[{path:'',code:'INVALID_TYPE',message:'Board spec must be an object.'}]};}
 rejectUnknown(board,['schemaVersion','title','columns','charts'],'',errors);
 if(board.schemaVersion!=='1.0')add(errors,'schemaVersion','UNSUPPORTED_VERSION','schemaVersion must be 1.0.');
 if(![1,2,3].includes(board.columns))add(errors,'columns','INVALID_LAYOUT','columns must be 1, 2, or 3.');
 if(board.title!==undefined&&(typeof board.title!=='string'||board.title.length>200))add(errors,'title','INVALID_OPTION','title must be a string up to 200 characters.');
 if(!Array.isArray(board.charts)||board.charts.length<1||board.charts.length>8)add(errors,'charts','LIMIT_EXCEEDED','Boards need 1–8 charts.');
 if(errors.length)return {valid:false,schemaVersion:'1.0',charts:[],errors};
 const charts=(Array.isArray(board.charts)?board.charts:[]).map((spec,index)=>{const result=compileKlicChart(spec);for(const error of result.errors||[])errors.push({...error,path:`charts[${index}].${error.path}`});return result;});
 return {valid:errors.length===0,schemaVersion:'1.0',title:board.title??'',columns:board.columns,charts,errors};
}
export function renderKlicChartBoardSvg(board){
 const compiled=board?.valid?board:compileKlicChartBoard(board);if(!compiled.valid)throw new TypeError('renderKlicChartBoardSvg requires a valid board.');
 const columns=compiled.columns,rows=Math.ceil(compiled.charts.length/columns),cellWidth=800/columns,cellHeight=420/rows,children=compiled.charts.map((chart,index)=>{const x=index%columns*cellWidth,y=Math.floor(index/columns)*cellHeight;return `<g transform="translate(${x} ${y}) scale(${cellWidth/chart.display.width} ${cellHeight/chart.display.height})">${renderKlicChartSvg(chart).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</g>`;}).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${Math.max(420,rows*cellHeight)}" viewBox="0 0 800 ${Math.max(420,rows*cellHeight)}" role="img" aria-label="${escapeXml(compiled.title||'KLIC chart board')}"><title>${escapeXml(compiled.title||'KLIC chart board')}</title>${children}</svg>`;
}
export {KLIC_CHART_TYPES,KLIC_CHART_TYPE_IDS,KLIC_CHART_SPEC_SCHEMA,KLIC_CHART_BOARD_SPEC_SCHEMA,KLIC_CHART_THEMES,KLIC_CHART_INTERACTIONS,KLIC_CHART_EXAMPLE_TYPES};
