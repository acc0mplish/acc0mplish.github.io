const channel=(name,kind,required=true)=>({name,kind,required});
const cart=(id,x='categorical',extra=[],options={})=>({id,family:'cartesian',channels:[channel('x',x),channel('y','quantitative'),...extra],options});
const distribution=(id,extra=[],options={})=>({id,family:'distribution',channels:[channel('value','quantitative'),channel('group','categorical',false),...extra],options});
const part=(id,extra=[],options={})=>({id,family:'composition',channels:[channel('category','categorical'),channel('value','quantitative'),...extra],options});
const entries=[
 cart('bar','categorical',[],{orientation:{enum:['vertical','horizontal']},sort:{enum:['input','ascending','descending']}}),
 cart('grouped-bar','categorical',[channel('series','categorical',false)],{orientation:{enum:['vertical','horizontal']},stack:{enum:['grouped','stacked','percent']}}),
 cart('stacked-bar','categorical',[channel('series','categorical')],{orientation:{enum:['vertical','horizontal']},stack:{enum:['stacked','percent']}}),
 cart('line','temporal',[channel('series','categorical',false)]),
 cart('area','temporal',[channel('series','categorical',false)]),
 cart('stacked-area','temporal',[channel('series','categorical')]),
 cart('streamgraph','temporal',[channel('series','categorical')]),
 cart('combo','temporal',[channel('y2','quantitative',false),channel('series','categorical',false)]),
 cart('scatter','quantitative',[channel('series','categorical',false),channel('size','quantitative',false)]),
 cart('bubble','quantitative',[channel('size','quantitative')]),
 cart('connected-scatter','quantitative',[channel('series','categorical',false)]),
 cart('marginal','quantitative',[channel('series','categorical',false)]),
 cart('regression','quantitative',[channel('series','categorical',false)]),
 {id:'calibration',family:'cartesian',channels:[channel('x','quantitative'),channel('y','quantitative')]},
 cart('lollipop','categorical'),
 {id:'dumbbell',family:'cartesian',channels:[channel('x','categorical'),channel('start','quantitative'),channel('end','quantitative')]},
 cart('slope','ordinal',[channel('series','categorical')]),
 cart('bump','ordinal',[channel('series','categorical')]),
 cart('range-area','temporal',[channel('low','quantitative'),channel('high','quantitative')]),
 cart('forecast-fan','temporal',[channel('low','quantitative'),channel('high','quantitative')]),
 {id:'candlestick',family:'cartesian',channels:[channel('x','temporal'),channel('open','quantitative'),channel('high','quantitative'),channel('low','quantitative'),channel('close','quantitative')]},
 cart('drawdown','temporal'),
 {id:'bullet',family:'cartesian',channels:[channel('x','categorical'),channel('y','quantitative'),channel('target','quantitative'),channel('low','quantitative',false),channel('high','quantitative',false)]},
 {id:'pyramid',family:'cartesian',channels:[channel('x','categorical'),channel('y','quantitative'),channel('side','categorical')]},
 {id:'ranged-dot',family:'cartesian',channels:[channel('x','categorical'),channel('low','quantitative'),channel('high','quantitative'),channel('point','quantitative',false)]},
 distribution('histogram',[],{bins:{integer:true,min:2,max:80}}),
 distribution('density'),
 distribution('ecdf'),
 distribution('box-plot'),
 distribution('violin'),
 distribution('strip-plot'),
 distribution('beeswarm'),
 distribution('ridgeline'),
 part('pie'),part('donut'),part('radial'),part('rose'),
 {id:'gauge',family:'composition',channels:[channel('value','quantitative'),channel('target','quantitative',false)],options:{min:{number:true},max:{number:true}}},
 {id:'treemap',family:'composition',channels:[channel('path','categorical'),channel('value','quantitative')]},
 {id:'sunburst',family:'composition',channels:[channel('path','categorical'),channel('value','quantitative')]},
 {id:'kpi-card',family:'composition',channels:[channel('label','categorical'),channel('value','quantitative'),channel('delta','quantitative',false)]},
 {id:'waterfall',family:'composition',channels:[channel('category','categorical'),channel('delta','quantitative')],options:{totalField:{type:'string'}}},
 {id:'funnel',family:'composition',channels:[channel('stage','ordinal'),channel('value','quantitative')]},
 {id:'heatmap',family:'matrix',channels:[channel('x','categorical'),channel('y','categorical'),channel('value','quantitative')]},
 {id:'correlation-matrix',family:'matrix',channels:[channel('x','categorical'),channel('y','categorical'),channel('value','quantitative')]},
 {id:'cohort-heatmap',family:'matrix',channels:[channel('cohort','categorical'),channel('period','ordinal'),channel('value','quantitative')]},
 {id:'calendar-heatmap',family:'matrix',channels:[channel('date','temporal'),channel('value','quantitative')]},
 {id:'gantt',family:'timeline',channels:[channel('task','categorical'),channel('start','temporal'),channel('end','temporal'),channel('group','categorical',false)]},
 {id:'state-timeline',family:'timeline',channels:[channel('state','categorical'),channel('start','temporal'),channel('end','temporal')]},
 {id:'sankey',family:'flow',channels:[channel('source','categorical'),channel('target','categorical'),channel('value','quantitative')]},
 {id:'network-graph',family:'flow',channels:[channel('source','categorical'),channel('target','categorical'),channel('weight','quantitative',false)]},
 {id:'tree',family:'flow',channels:[channel('parent','categorical'),channel('child','categorical')]},
 {id:'parallel-coordinates',family:'cartesian',channels:[channel('dimension1','quantitative'),channel('dimension2','quantitative'),channel('dimension3','quantitative'),...Array.from({length:5},(_,index)=>channel(`dimension${index+4}`,'quantitative',false))],options:{dimensions:{stringArray:true,min:3,max:8}}},
 {id:'map',family:'spatial',channels:[channel('region','categorical')]},
 {id:'choropleth',family:'spatial',channels:[channel('region','categorical'),channel('value','quantitative')]},
 {id:'sparkline',family:'table',channels:[channel('x','temporal'),channel('value','quantitative'),channel('series','categorical',false)]},
 {id:'bar-table',family:'table',channels:[channel('x','categorical'),channel('y','quantitative')]},
 {id:'radar',family:'polar',channels:[channel('axis','categorical'),channel('value','quantitative'),channel('series','categorical',false)]},
 {id:'market-depth',family:'market',channels:[channel('side','categorical'),channel('price','quantitative'),channel('quantity','quantitative')]},
 {id:'orderbook',family:'market',channels:[channel('side','categorical'),channel('price','quantitative'),channel('quantity','quantitative'),channel('cumulative','quantitative',false)]},
];
for(const item of entries){if(['line','area','stacked-area','streamgraph','sparkline','connected-scatter','bump','slope'].includes(item.id)){const x=item.channels.find(channel=>channel.name==='x');if(x)x.kinds=['categorical','ordinal','quantitative','temporal'];}}
const EXAMPLE_TYPES={
 'chart-distribution':'histogram','chart-violin':'violin','chart-beeswarm':'beeswarm','chart-scatter-brush':'scatter','chart-calibration':'calibration',
 'chart-candlestick':'candlestick','chart-forecast-fan':'forecast-fan','chart-drawdown':'drawdown','chart-market-depth':'market-depth','chart-orderbook':'orderbook',
 'chart-state-timeline':'state-timeline','chart-spark-table':'sparkline','chart-waterfall':'waterfall','chart-treemap':'treemap','chart-streamgraph':'streamgraph',
 'daily-active-users-area':'stacked-area','cloud-spend-variance-bar':'grouped-bar','chart-dumbbell':'dumbbell','chart-correlation':'correlation-matrix',
 'chart-cohort-retention':'cohort-heatmap','chart-calendar-heatmap':'calendar-heatmap','self-serve-funnel':'funnel','chart-bullet':'bullet',
};
const makeGuide=(titleKo,titleEn,useKo,useEn,avoidKo,avoidEn,takeKo,takeEn)=>({title:{ko:titleKo,en:titleEn},useWhen:{ko:useKo,en:useEn},avoidWhen:{ko:avoidKo,en:avoidEn},takeaway:{ko:takeKo,en:takeEn}});
const genericGuides={
 cartesian:makeGuide('직교 비교 차트','Cartesian comparison chart','공통 축에서 범주·시간·수치를 비교할 때 사용합니다.','Use to compare categories, time, or measures on a shared axis.','단위가 다르거나 0 기준의 의미가 다른 값을 같은 축에 놓지 않습니다.','Do not place incompatible units or baselines on one axis.','위치와 길이가 지정한 채널 값을 나타냅니다.','Position and length encode the assigned channels.'),
 distribution:makeGuide('분포 차트','Distribution chart','관측값의 분포·밀도·표본 차이를 확인할 때 사용합니다.','Use to inspect distribution, density, or sample differences.','표본 수와 구간·밀도 추정 방법을 숨기지 않습니다.','Do not hide sample counts or bin and density assumptions.','표는 계산된 요약과 원자료를 같은 plot data에서 제공합니다.','The table exposes computed summaries and source values from the same plot data.'),
 composition:makeGuide('구성 차트','Composition chart','전체 구성·단계 누계·계층 값을 비교할 때 사용합니다.','Use to compare parts, cumulative steps, or hierarchical values.','작은 면적 차이만으로 정밀한 순위를 주장하지 않습니다.','Do not claim precise ranking from small area differences.','표에서 각 구성 값과 변환 결과를 확인합니다.','Inspect component values and transformations in the table.'),
 matrix:makeGuide('행렬 차트','Matrix chart','두 범주 축의 교차 값이나 날짜별 밀도를 탐색할 때 사용합니다.','Use to inspect values across two categorical axes or dates.','결측값을 관측된 0으로 표시하지 않습니다.','Do not encode missing values as observed zero.','각 셀의 수치는 표에서 색상과 별도로 읽을 수 있습니다.','Read each cell value in the table independently of color.'),
 flow:makeGuide('관계·흐름 차트','Relationship and flow chart','항목 사이의 연결·흐름·계층 구조를 설명할 때 사용합니다.','Use to explain links, flows, or hierarchy between items.','연결 폭이나 경로를 실제 수치로 오해할 수 있게 표현하지 않습니다.','Do not imply link widths or paths represent measurements they do not encode.','표는 모든 연결 쌍과 사용한 값을 제공합니다.','The table lists every link pair and its encoded value.'),
 spatial:makeGuide('공간 차트','Spatial chart','지역 경계와 연결된 수치를 지도 형태로 비교할 때 사용합니다.','Use to compare measures attached to geographic regions.','경계 데이터 출처와 결측 지역을 숨기지 않습니다.','Do not hide boundary provenance or regions without values.','지역 경계와 색상은 KLIC SVG에서 로컬로 렌더링합니다.','Regions and fills render locally as KLIC SVG.'),
 timeline:makeGuide('시간 구간 차트','Timeline chart','작업·상태의 시작, 종료, 지속 시간을 비교할 때 사용합니다.','Use to compare task or state start, end, and duration.','시간대가 다르거나 끝나지 않은 구간을 임의로 확정하지 않습니다.','Do not conflate time zones or invent end times for open intervals.','가로 위치와 폭은 같은 시간 축을 사용합니다.','Position and width use the same time axis.'),
 polar:makeGuide('방사형 비교 차트','Radial comparison chart','여러 범주 축의 상대 값을 함께 살펴볼 때 사용합니다.','Use to inspect relative measures across several category axes.','각도와 면적을 정밀한 순위 비교로 해석하지 않습니다.','Do not interpret angle or area as precise rank comparisons.','정확한 값은 표와 축 이름으로 확인합니다.','Read exact values with their axis labels in the table.'),
 market:makeGuide('시장 깊이 차트','Market depth chart','가격 단계별 매수·매도 수량을 비교할 때 사용합니다.','Use to compare bid and ask quantities by price level.','합성 값을 실시간 체결 또는 실행 가능 유동성으로 표현하지 않습니다.','Do not present synthetic values as live trades or executable liquidity.','가격·수량·누계는 표에서 확인합니다.','Inspect price, quantity, and cumulative values in the table.'),
 table:makeGuide('표와 미니 차트','Table and compact chart','여러 행의 정확한 값과 작은 추세를 함께 볼 때 사용합니다.','Use to inspect exact row values alongside compact trends.','미니 차트를 단독 축의 정확한 비교처럼 읽지 않습니다.','Do not read a sparkline as a precise shared-axis comparison.','각 미니 차트는 같은 행의 수열과 연결됩니다.','Each mini chart remains tied to its source row.'),
};
const TYPE_GUIDANCE={
 'bar-table':makeGuide('막대 표','Bar table','행별 값을 숫자와 짧은 막대로 동시에 비교할 때 사용합니다.','Use to compare row values as numbers and compact bars.','서로 다른 범위의 행을 축 설명 없이 비교하지 않습니다.','Do not compare rows with different domains without stating the scale.','표 값과 막대 길이는 동일한 수치를 나타냅니다.','Table values and bar lengths encode the same measure.'),
 calibration:makeGuide('보정 차트','Calibration plot','예측 확률과 관측 비율이 얼마나 맞는지 비교할 때 사용합니다.','Use to compare predicted probabilities with observed rates.','좋은 보정이 분류 성능이나 인과 효과까지 뜻한다고 해석하지 않습니다.','Do not read calibration as classifier discrimination or causal effect.','점과 y=x 기준선의 거리는 예측과 관측의 차이를 나타냅니다.','Distance from the y=x reference encodes prediction error.'),
 candlestick:makeGuide('캔들스틱','Candlestick chart','같은 시간 구간의 시가·고가·저가·종가를 비교할 때 사용합니다.','Use to inspect open, high, low, and close within each time interval.','합성 예시를 실시간 시세나 투자 권고로 표현하지 않습니다.','Do not present synthetic samples as live quotes or investment advice.','심지는 저가·고가, 몸통은 시가·종가 범위를 나타냅니다.','The wick encodes low to high; the body encodes open to close.'),
 drawdown:makeGuide('낙폭 차트','Drawdown chart','값이 직전 누적 최고점에서 얼마나 하락했는지 시간에 따라 살펴볼 때 사용합니다.','Use to inspect value decline from its running peak over time.','입력 값을 누적 가치 경로로 정의하지 않은 채 금융 손실로 해석하지 않습니다.','Do not interpret the measure as financial loss unless the input is a cumulative value path.','각 점은 value/runningPeak−1이며 회복 시 0으로 돌아옵니다.','Each point is value/runningPeak−1 and returns to zero at recovery.'),
 'forecast-fan':makeGuide('예측 구간 차트','Forecast interval chart','중앙 예측과 한 개의 상·하한 구간을 시간 축에서 함께 볼 때 사용합니다.','Use to inspect a central forecast with one lower and upper interval over time.','한 구간을 여러 신뢰 수준이나 모델 산출 불확실성으로 표현하지 않습니다.','Do not present one interval as multiple confidence levels or a model-generated uncertainty estimate.','채운 띠는 입력 low/high 구간이고 선은 입력 중앙값입니다.','The band is the supplied low/high interval; the line is the supplied center.'),
 funnel:makeGuide('단계형 퍼널','Stage funnel','순서가 있는 단계별 수와 전환 비율을 비교할 때 사용합니다.','Use to compare ordered stage counts and conversion ratios.','단계 크기 차이를 원인 효과로 해석하지 않습니다.','Do not interpret stage drop-off as a causal effect.','폭은 단계 값에 비례하고 표에 이전 단계 대비 비율이 있습니다.','Width scales with stage value; the table reports conversion from the prior stage.'),
 radial:makeGuide('방사 막대 차트','Radial bar chart','범주별 크기를 같은 각도 간격의 방사 막대 길이로 비교할 때 사용합니다.','Use to compare category values as radial bars at equal angular intervals.','부채꼴 면적 차이를 값의 정밀한 비율로 읽지 않습니다.','Do not read wedge area as a precise proportional value.','각도는 범주 순서이며 방사 길이는 수치 크기입니다.','Angle identifies category order; radial length encodes magnitude.'),
 bubble:makeGuide('버블 산점도','Bubble chart','두 수치 축과 세 번째 크기 변수를 함께 비교할 때 사용합니다.','Use to compare two numeric axes and a third size variable.','원의 면적을 반지름과 동일하게 해석하지 않습니다.','Do not interpret bubble area as radius.','위치와 원 크기는 서로 다른 인코딩입니다.','Position and bubble size are distinct encodings.'),
 bump:makeGuide('순위 변화 차트','Bump chart','여러 항목의 시점별 상대 순위 변화를 비교할 때 사용합니다.','Use to compare relative rank changes across time.','순위 차이를 값 차이의 크기로 해석하지 않습니다.','Do not interpret rank distance as magnitude difference.','세로 위치는 순위이며 축 범위는 순위 순서를 따릅니다.','Vertical position encodes rank order, not magnitude.'),
 choropleth:makeGuide('지역 단계도','Choropleth map','정해진 지역 경계별 수치 차이를 색과 표로 비교할 때 사용합니다.','Use to compare values by geographic region with a table alternative.','지역 크기가 값의 크기를 뜻한다고 해석하지 않습니다.','Do not interpret region area as its measure value.','채우기 색은 region에 연결된 수치를 인코딩합니다.','Fill color encodes the value joined to each region.'),
 combo:makeGuide('혼합 차트','Combo chart','같은 시간 축에서 막대 값과 선 값을 함께 비교할 때 사용합니다.','Use to compare a bar measure and a line measure on a shared time axis.','서로 다른 단위를 이중 축 설명 없이 겹치지 않습니다.','Do not overlay incompatible units without clearly named scales.','막대와 선은 서로 다른 데이터 채널을 사용합니다.','Bars and lines use distinct data channels.'),
 'connected-scatter':makeGuide('연결 산점도','Connected scatter plot','두 수치 변수의 관계와 관측 순서를 함께 볼 때 사용합니다.','Use to inspect a numeric relationship and observation order together.','연결 순서가 없는 점을 임의로 선으로 잇지 않습니다.','Do not connect points when no meaningful order exists.','선은 시간·순서 연결이고 점은 각 관측값입니다.','Lines encode order; points encode individual observations.'),
 density:makeGuide('밀도 곡선','Density plot','연속형 표본의 분포 형태를 부드럽게 비교할 때 사용합니다.','Use to compare smoothed shapes of continuous samples.','표본이 적거나 bandwidth 선택을 숨기지 않습니다.','Do not hide small samples or the smoothing assumption.','곡선 높이는 관측 개수가 아닌 추정 밀도입니다.','Curve height encodes estimated density, not counts.'),
 ecdf:makeGuide('누적 경험 분포','ECDF plot','임계값 이하에 포함되는 표본 비율을 비교할 때 사용합니다.','Use to compare the share of observations below each threshold.','계단 높이를 확률 보정이나 인과 효과로 해석하지 않습니다.','Do not interpret the step as calibration or causal effect.','각 단계는 누적 표본 비율을 표시합니다.','Each step shows cumulative sample share.'),
 lollipop:makeGuide('점 막대','Lollipop chart','범주별 값을 공통 기준선과 점으로 비교할 때 사용합니다.','Use to compare category values with a common baseline and endpoint.','범주가 너무 많거나 정확한 순위가 필요하면 정렬 막대를 선택합니다.','Use sorted bars when categories are dense or exact ranking matters.','점 위치가 수치이고 선은 기준선과 거리를 보조합니다.','The dot marks the value; the stem shows distance from baseline.'),
 map:makeGuide('지역 경계 지도','Map chart','지역 경계를 값 없이 위치 관계로 확인할 때 사용합니다.','Use to inspect region geometry and relative location without a measure.','색상 차이를 값 인코딩으로 오해하지 않습니다.','Do not imply color encodes values when it does not.','경계 좌표는 inline Polygon/MultiPolygon에서 가져옵니다.','Boundary coordinates come from inline Polygon/MultiPolygon geometry.'),
 marginal:makeGuide('주변 분포 산점도','Marginal plot','두 변수의 관계와 각각의 분포를 함께 탐색할 때 사용합니다.','Use to explore a two-variable relationship and both marginal distributions.','가장자리 집계를 주 산점도와 다른 표본으로 만들지 않습니다.','Do not compute marginals from a different sample than the scatter.','주변 분포와 산점은 같은 원자료 행을 사용합니다.','Marginals and scatter marks use the same source rows.'),
 'parallel-coordinates':makeGuide('평행 좌표','Parallel coordinates','여러 수치 변수의 패턴을 행별 선으로 비교할 때 사용합니다.','Use to compare multivariate patterns as one line per row.','축마다 다른 정규화를 숨기거나 교차를 인과로 읽지 않습니다.','Do not hide per-axis scaling or interpret crossings as causation.','각 선은 한 행이고 각 축은 별도 수치 범위를 가집니다.','Each line represents one row; each axis has its own numeric domain.'),
 pyramid:makeGuide('피라미드 막대','Pyramid chart','두 집단의 같은 기준 수치를 좌우로 비교할 때 사용합니다.','Use to compare the same measure for two groups on mirrored sides.','음수와 작은 값이 좌우 대칭으로 오해되도록 만들지 않습니다.','Do not let sign or small values become ambiguous in the mirror.','좌우 방향은 집단을, 길이는 크기를 나타냅니다.','Side encodes group; length encodes magnitude.'),
 'ranged-dot':makeGuide('범위 점','Ranged dot plot','범위와 대표값을 범주별 공통 축에서 비교할 때 사용합니다.','Use to compare intervals and point estimates by category.','범위가 신뢰구간인지 관측 범위인지 이름 없이 표시하지 않습니다.','Do not leave the meaning of an interval unlabeled.','선은 범위이고 점은 지정한 대표값입니다.','The line encodes a range; the dot encodes the selected estimate.'),
 sankey:makeGuide('Sankey 흐름','Sankey flow','출발지와 도착지 사이의 입력 흐름 크기를 비교할 때 사용합니다.','Use to compare supplied flow magnitudes between sources and targets.','중복 링크와 합계를 확인하지 않고 전체 흐름으로 해석하지 않습니다.','Do not treat links as a complete total without checking duplicate rows and aggregation.','링크 폭은 입력 value에 비례합니다.','Link width scales with the supplied value.'),
 ridgeline:makeGuide('겹친 밀도 분포','Ridgeline plot','여러 그룹의 분포 모양을 층별로 비교할 때 사용합니다.','Use to compare distribution shapes across stacked groups.','높이 차이를 정규화 없이 표본 수로 해석하지 않습니다.','Do not read height as sample count without an explicit scale.','각 층의 위치는 그룹, 곡선 폭은 분포를 나타냅니다.','Each ridge identifies a group; its curve shows the distribution.'),
 rose:makeGuide('장미형 방사 차트','Rose chart','범주별 크기를 방사형 구간 길이로 비교할 때 사용합니다.','Use to compare category magnitudes as radial segments.','각도·면적 왜곡으로 인한 정밀 비교를 주장하지 않습니다.','Do not claim precise comparison from angular area.','방사 길이는 값의 크기를 나타냅니다.','Radial length encodes magnitude.'),
 sunburst:makeGuide('계층형 방사 구획','Sunburst chart','계층 경로와 상위·하위 구성의 크기를 한 화면에서 볼 때 사용합니다.','Use to inspect hierarchy and parent/child shares in one view.','깊은 계층의 작은 구획으로 정확한 비교를 요구하지 않습니다.','Do not rely on tiny deep-level wedges for exact comparisons.','각 링은 경로 깊이를, 구획 크기는 값을 나타냅니다.','Rings encode depth; segment size encodes value.'),
 tree:makeGuide('트리 구조','Tree chart','부모·자식 관계와 계층 경로를 설명할 때 사용합니다.','Use to explain parent-child relationships and hierarchy.','연결선 길이와 좌표를 수치 데이터로 해석하지 않습니다.','Do not interpret link length or position as measured data.','선은 관계만 나타내며 모든 노드는 표에도 나옵니다.','Edges encode relationships only; nodes are listed in the table.'),
};
const labels={lollipop:['점 막대','Lollipop chart'],ecdf:['누적 경험 분포','ECDF plot'],sunburst:['계층형 방사 구획','Sunburst chart'],choropleth:['지역 단계도','Choropleth map'],map:['지역 경계 지도','Map chart'],'parallel-coordinates':['평행 좌표','Parallel coordinates'],'network-graph':['네트워크 그래프','Network graph'],bubble:['버블 산점도','Bubble chart'],bump:['순위 변화 차트','Bump chart'],combo:['혼합 차트','Combo chart'],'connected-scatter':['연결 산점도','Connected scatter plot'],density:['밀도 곡선','Density plot'],marginal:['주변 분포 산점도','Marginal plot'],pyramid:['피라미드 막대','Pyramid chart'],'ranged-dot':['범위 점','Ranged dot plot'],ridgeline:['겹친 밀도 분포','Ridgeline plot'],rose:['장미형 방사 차트','Rose chart'],tree:['트리 구조','Tree chart'],'bar-table':['막대 표','Bar table'],'range-area':['범위 영역','Range area chart'],'kpi-card':['핵심 지표 카드','KPI card']};
const humanize=id=>id.split('-').map(part=>part[0]?.toUpperCase()+part.slice(1)).join(' ');
const freeze=value=>{if(value&&typeof value==='object'){for(const child of Object.values(value))freeze(child);Object.freeze(value);}return value;};
export const KLIC_CHART_EXAMPLE_TYPES=freeze({...EXAMPLE_TYPES});
export const KLIC_CHART_TYPES=freeze(Object.fromEntries(entries.map(item=>[item.id,{
  ...item,
  title:{ko:labels[item.id]?.[0]??humanize(item.id),en:labels[item.id]?.[1]??humanize(item.id)},
  guide:TYPE_GUIDANCE[item.id]??genericGuides[item.family],
  support:'authorable',
  interactions:['inspect','select'],
  keyboard:'Focus the chart region; arrow keys and Home/End move table-row selection; Enter selects the first row; Escape clears selection.',
  reducedMotion:'Static SVG; no autoplay or motion-dependent information.',
}])));
export const KLIC_CHART_TYPE_IDS=Object.freeze(Object.keys(KLIC_CHART_TYPES));

const scalar={$schema:'https://json-schema.org/draft/2020-12/schema',oneOf:[{type:'string'},{type:'number'},{type:'boolean'},{type:'null'}]};
const fieldSchema={type:'object',properties:{kind:{enum:['categorical','ordinal','quantitative','temporal']},label:{type:'string',maxLength:120},unit:{type:'string',maxLength:40},domain:{type:'array',items:{oneOf:[{type:'string'},{type:'number'}]},minItems:2,maxItems:2}},required:['kind'],additionalProperties:false};
const geometrySchema={type:'object',required:['type','features'],properties:{type:{const:'FeatureCollection'},features:{type:'array',maxItems:2000,items:{type:'object',required:['type','id','properties','geometry'],properties:{type:{const:'Feature'},id:{type:'string',maxLength:120},properties:{type:'object',additionalProperties:{oneOf:[{type:'string'},{type:'number'},{type:'null'}]}},geometry:{type:'object',required:['type','coordinates'],properties:{type:{enum:['Polygon','MultiPolygon']},coordinates:{type:'array'}},additionalProperties:false}},additionalProperties:false}}},additionalProperties:false};
export const KLIC_CHART_SPEC_SCHEMA=freeze({$schema:'https://json-schema.org/draft/2020-12/schema',title:'KLIC Chart Spec',type:'object',required:['schemaVersion','data','chart'],properties:{
 schemaVersion:{const:'1.0'},data:{type:'object',required:['rows'],properties:{rows:{type:'array',minItems:1,maxItems:5000,items:{type:'object',minProperties:1,maxProperties:64,additionalProperties:scalar}}},additionalProperties:false},
 geometry:geometrySchema,fields:{type:'object',additionalProperties:fieldSchema},chart:{type:'object',required:['type','encodings'],properties:{type:{enum:KLIC_CHART_TYPE_IDS},encodings:{type:'object',minProperties:1,maxProperties:16,additionalProperties:{type:'string',minLength:1,maxLength:120}},options:{type:'object'}},additionalProperties:false},
 display:{type:'object',properties:{title:{type:'string',maxLength:200},subtitle:{type:'string',maxLength:300},width:{type:'integer',minimum:240,maximum:4000},height:{type:'integer',minimum:180,maximum:4000},profile:{enum:['core','studio','data']},mode:{enum:['light','dark']}},additionalProperties:false},
 interactions:{type:'array',maxItems:2,items:{type:'object',required:['type'],properties:{type:{enum:['inspect','select']}},additionalProperties:false}},
},additionalProperties:false});
export const KLIC_CHART_BOARD_SPEC_SCHEMA=freeze({$schema:'https://json-schema.org/draft/2020-12/schema',title:'KLIC Chart Board Spec',type:'object',required:['schemaVersion','charts','columns'],properties:{schemaVersion:{const:'1.0'},title:{type:'string',maxLength:200},columns:{type:'integer',enum:[1,2,3]},charts:{type:'array',minItems:1,maxItems:8,items:KLIC_CHART_SPEC_SCHEMA}},additionalProperties:false});

export const KLIC_CHART_THEMES=freeze({
  schemaVersion:'1.0',
  profiles:['core','studio','data'],modes:['light','dark'],
  light:{background:'#fbfcfe',surface:'#ffffff',text:'#132c46',muted:'#52657b',grid:'#dfe5ee',series:['#245fc2','#5b82cc','#163e80','#5478a8','#496388','#687c99']},
  dark:{background:'#101722',surface:'#172132',text:'#e8eef8',muted:'#a8b6cc',grid:'#31425c',series:['#91b6ff','#afcbff','#719def','#c0d5ff','#7a9bc9','#b6c1d2']},
});
export const KLIC_CHART_INTERACTIONS=freeze([
 {type:'inspect',description:'Read the row values represented by a chart mark.',requires:['mark-data'],reset:'Move focus or pointer away.'},
 {type:'select',description:'Select a table row and announce its exact values in the React chart view.',requires:['compiled-table'],reset:'Escape clears selection.'},
]);
