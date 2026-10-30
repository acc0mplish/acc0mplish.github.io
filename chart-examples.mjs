/** KLIC chart catalog. Full Björk UI MIT renderers are adapted to KLIC tokens; see docs/charts/BJORK-LICENSE.txt. */
export const CHART_GROUPS=Object.freeze({
  distribution:{id:'chart-distribution',name:'분포와 통계',en:'Distribution and statistics'},
  financial:{id:'chart-financial',name:'가격과 시장',en:'Price and market'},
  temporal:{id:'chart-temporal',name:'시간과 상태',en:'Time and state'},
  composition:{id:'chart-composition',name:'구성과 누적',en:'Composition and accumulation'},
  matrix:{id:'chart-matrix',name:'행렬과 밀도',en:'Matrix and density'},
  comparison:{id:'chart-comparison',name:'비교와 목표',en:'Comparison and targets'},
  area:{id:'area-line',name:'에어리어 & 라인',en:'Area and line'},
  bar:{id:'bar-column',name:'바 & 컬럼',en:'Bar and column'},
  funnel:{id:'funnel-chart',name:'퍼넬 차트',en:'Funnel charts'}
});

const rows=[
  ['chart-distribution','분포 히스토그램','Distribution histogram','distribution','distribution','DistributionChartsBlock','distribution-plot','관측값을 구간별 빈도로 집계하고 구간 폭을 바꿔 분포와 원시 값을 비교하는 샘플입니다.','Equal-width bins; each observation belongs to exactly one bin; bar height encodes count.'],
  ['chart-violin','바이올린 분포','Violin distribution','distribution','violin','DistributionChartsBlock','violin-plot','그룹별 밀도와 중앙값을 대칭 바이올린 형태로 비교하는 샘플입니다.','Mirrored kernel-density envelopes on a shared numeric axis; the median is a separate mark.'],
  ['chart-beeswarm','개별 관측 비스웜','Observation beeswarm','distribution','beeswarm','DistributionChartsBlock','beeswarm','개별 관측값의 수치 위치를 유지하며 점 겹침을 줄인 분포 샘플입니다.','Numeric x positions are preserved; deterministic perpendicular displacement separates overlapping circles.'],
  ['chart-scatter-brush','범위 선택 산점도','Scatter brush selection','distribution','scatter','DistributionChartsBlock','scatter-brush','두 지표의 관계를 산점도로 보고 수치 범위로 관측값을 선택하는 샘플입니다.','Independent x/y numeric scales; rectangular numeric selection reports the included observations.'],
  ['chart-calibration','예측 확률 보정','Probability calibration','distribution','calibration','DistributionChartsBlock','calibration-plot','예측 확률과 실제 관측 비율을 이상적 보정 대각선과 비교하는 샘플입니다.','Prediction bins versus observed frequency on matched 0–1 axes, with the y=x reference.'],
  ['chart-candlestick','OHLC 캔들 차트','OHLC candlestick','financial','candlestick','FinancialChartsBlock','candlestick-chart','시가·종가의 몸통과 고가·저가의 꼬리를 공통 가격 축으로 표시하는 합성 시세 샘플입니다.','Body spans open to close; wick spans low to high; all prices use one shared y scale.'],
  ['chart-forecast-fan','예측 구간 팬','Forecast interval fan','financial','forecast','FinancialChartsBlock','forecast-fan','관측 구간과 미래 예측 중앙값·불확실성 구간을 분리하는 합성 시계열 샘플입니다.','Observed path ends at the forecast boundary; nested lower/upper interval bands surround a central estimate.'],
  ['chart-drawdown','고점 대비 낙폭','Peak drawdown','financial','drawdown','FinancialChartsBlock','drawdown-chart','시점별 누적 고점을 기준으로 하락 비율을 계산하는 합성 가격 샘플입니다.','Drawdown is value/runningPeak−1; area stays at or below zero, and recovery returns to zero.'],
  ['chart-market-depth','누적 시장 깊이','Cumulative market depth','financial','depth','FinancialChartsBlock','depth-chart','매수·매도 가격별 수량을 누적해 양쪽 시장 깊이를 비교하는 합성 호가 샘플입니다.','Price-ordered bid/ask cumulative quantities, separated by the spread around the midpoint.'],
  ['chart-orderbook','가격별 호가 장부','Price-level order book','financial','orderbook','FinancialChartsBlock','order-book','가격·수량·누적 수량을 정확한 표와 비례 막대로 함께 읽는 합성 호가 샘플입니다.','Discrete price levels sorted by side; aligned quantity/cumulative columns and proportional quantity bars.'],
  ['chart-state-timeline','지속시간 상태 타임라인','Duration state timeline','temporal','state-timeline','FinancialChartsBlock','state-timeline','상태가 유지된 구간의 시작·종료와 지속시간을 시간 축에 표시하는 샘플입니다.','Interval rectangles use start/end timestamps on one time axis; widths encode elapsed duration.'],
  ['chart-spark-table','추세와 수치 테이블','Trend spark table','temporal','spark-table','FinancialChartsBlock','spark-table','항목별 작은 추세와 현재값·변화량을 같은 행에서 비교하는 샘플입니다.','Aligned row sparklines encode each numeric sequence; exact series and endpoint changes remain tabular.'],
  ['chart-waterfall','누적 증감 워터폴','Cumulative waterfall','composition','waterfall','CompositionChartsBlock','waterfall-chart','증가·감소가 이전 누적값에서 출발해 최종 합계로 이어지는 워터폴 샘플입니다.','Each delta bar spans previous to next cumulative total; connectors link totals; summary bars start at zero.'],
  ['chart-treemap','면적 비례 트리맵','Area-proportional treemap','composition','treemap','CompositionChartsBlock','treemap','계층별 값의 비율을 사각형 면적으로 표현하고 선택한 항목의 값을 확인하는 샘플입니다.','Non-overlapping rectangles partition the available area in proportion to nonnegative values.'],
  ['chart-streamgraph','중심 흐름 스트림그래프','Centered streamgraph','composition','streamgraph','CompositionChartsBlock','streamgraph','시간별 series를 중심 기준선 주위에 쌓아 구성 변화와 두께를 읽는 샘플입니다.','Time-aligned nonnegative bands share adjacent boundaries and a centered baseline; thickness encodes value.'],
  ['daily-active-users-area','누적 활성 사용자 에어리어','Stacked active-user area','area','stacked-area','CompositionChartsBlock','stacked-area-chart','유입 채널별 활성 사용자 샘플을 시간별로 누적하고 series 구성과 전체 합계를 확인합니다.','Adjacent cumulative areas share a zero baseline; stacked height equals the sum at each timestamp.'],
  ['cloud-spend-variance-bar','클라우드 비용 구성 비교','Cloud spend composition','bar','grouped-bar','CompositionChartsBlock','grouped-bar-chart','클라우드 서비스별 개발·스테이징·운영 비용을 공통 축에서 비교하고 실제 구성 합계를 확인합니다.','Disjoint environment costs share a zero-based scale; grouped, stacked and percent layouts retain truthful totals.'],
  ['chart-dumbbell','전후 차이 덤벨','Before-after dumbbell','comparison','dumbbell','CompositionChartsBlock','dumbbell-chart','항목별 이전·이후 수치를 같은 수평 축의 두 점과 차이 구간으로 비교하는 샘플입니다.','Two endpoints per category share a horizontal numeric scale; a connector encodes the signed difference.'],
  ['chart-correlation','상관계수 행렬','Correlation matrix','matrix','correlation','MatrixChartsBlock','correlation-matrix','변수 쌍의 상관계수를 수치와 셀 명도로 확인하는 대칭 행렬 샘플입니다.','Symmetric pairwise correlation cells with a fixed −1 to +1 domain; missing values differ from zero.'],
  ['chart-cohort-retention','코호트 잔존율','Cohort retention','matrix','cohort','MatrixChartsBlock','cohort-retention','코호트 시작 인원 대비 경과 기간별 잔존율을 읽는 삼각 행렬 샘플입니다.','Rows are acquisition cohorts; columns are elapsed periods; retained/base percentages exclude unavailable future cells.'],
  ['chart-calendar-heatmap','일별 활동 히트맵','Daily activity heatmap','matrix','calendar','MatrixChartsBlock','calendar-heatmap','날짜를 주·요일 위치에 배치하고 활동량·빈 날짜를 구분하는 달력 히트맵 샘플입니다.','Each date occupies its weekday/week cell; intensity encodes count; absent dates differ from observed zero.'],
  ['self-serve-funnel','셀프서브 전환 퍼넬','Self-serve conversion funnel','funnel','funnel','MatrixChartsBlock','funnel-chart','방문·가입·활성화·전환 단계의 잔존 수와 이전 단계 대비 전환율을 비교하는 샘플입니다.','Ordered funnel stages narrow by remaining count on a consistent scale; ratios use the immediately preceding stage.'],
  ['chart-bullet','목표 대비 불릿 차트','Target attainment bullet','comparison','bullet','MatrixChartsBlock','bullet-chart','지표별 실적·목표·참조 구간을 공통 선형 축에서 비교하는 샘플입니다.','A measure bar overlays qualitative range bands; an independent target marker uses the same domain.']
];

const englishDescriptions={
  distribution:'A sample histogram that groups observations into frequency bins and lets you compare bin widths with the exact source values.',
  violin:'A sample comparison of group distributions using mirrored density shapes and separate median marks.',
  beeswarm:'A sample distribution that preserves each observation’s numeric position while separating overlapping points.',
  scatter:'A sample scatter plot of two metrics with numeric range controls for selecting observations.',
  calibration:'A sample comparison of predicted probabilities and observed event rates against the ideal calibration diagonal.',
  candlestick:'Synthetic price data with open-to-close bodies and high-to-low wicks on a shared price axis.',
  forecast:'A synthetic time series that separates observations from future central estimates and uncertainty intervals.',
  drawdown:'Synthetic prices with percentage declines calculated from the running peak at each time point.',
  depth:'Synthetic bids and asks with cumulative quantities on either side of the market spread.',
  orderbook:'Synthetic price levels with exact prices, quantities and cumulative quantities in a table with proportional bars.',
  'state-timeline':'A sample timeline showing the start, end and elapsed duration of each state interval.',
  'spark-table':'A sample table that aligns each item’s small trend chart with its current value and change.',
  waterfall:'A sample waterfall in which each increase or decrease starts at the previous cumulative value and leads to the final total.',
  treemap:'A sample treemap that encodes hierarchical values as rectangle areas and exposes exact values for selected items.',
  streamgraph:'A sample streamgraph that stacks time-aligned series around a centered baseline to show composition and band thickness.',
  'stacked-area':'Sample active users by acquisition channel, stacked over time with individual series and overall totals.',
  'grouped-bar':'Disjoint production, staging and development costs per cloud service, with grouped, stacked and percent comparisons.',
  dumbbell:'A sample before-and-after comparison using two endpoints and their difference on a shared horizontal scale.',
  correlation:'A symmetric sample correlation matrix with numeric values and cell intensity for each variable pair.',
  cohort:'A triangular sample retention matrix showing the share remaining from each cohort’s starting population across elapsed periods.',
  calendar:'A sample calendar heatmap placing dates by week and weekday while distinguishing activity counts from missing dates.',
  funnel:'A sample self-serve conversion funnel comparing remaining counts and conversion rates from visits through signup, activation and conversion.',
  bullet:'Sample measures, targets and reference ranges compared on a shared linear scale.'
};

export const CHART_EXAMPLES=Object.freeze(rows.map(([id,title,enTitle,group,variant,sourceComponent,reference,description,geometry])=>Object.freeze({id,title,enTitle,group,variant,sourceComponent,referenceUrl:`https://ui.isaiahbjork.com/charts/${reference}`,description,enDescription:englishDescriptions[variant],geometry})));
export const CHART_EXCLUSIONS=Object.freeze([
  {reference:'animated-radial-chart',existingIds:['cash-inflows-radial','api-health-radial'],reason:'원형 진행·방사형 표현은 기존 래디얼과 게이지에서 제공하므로 장식적 모션만으로 별도 블록을 추가하지 않습니다.'},
  {reference:'live-line',existingIds:['line-chart','sparkline'],reason:'시간 축의 선형 추세는 기존 라인·스파크라인 표현과 겹칩니다. 샘플 업데이트 모션만으로 별도 형태를 추가하지 않습니다.'},
  {reference:'route-trace',existingIds:['flow-connector-interaction','flow-connector-state','flow-connector-retry'],reason:'경로 추적·상태 변화는 기존 연결선과 흐름 예제의 역할과 겹칩니다.'},
  {reference:'slope-chart',existingIds:['arr-growth-slope','error-budget-slope'],reason:'두 상태의 값 비교와 관계 강조는 현재 실제 슬로프 구현에서 제공합니다.'},
  {reference:'sankey-flow',existingIds:['funnel-flow','trial-flow','b2b-deals-flow'],reason:'정량 리본을 이용한 흐름과 전환은 기존 생키 변형에서 제공합니다.'},
  {reference:'donut-chart',existingIds:['donut-chart'],reason:'전체 대비 부분 비율의 도넛 표현은 기존 컴포넌트에서 제공합니다.'}
].map(({reference,...entry})=>Object.freeze({...entry,referenceUrl:`https://ui.isaiahbjork.com/charts/${reference}`})));
