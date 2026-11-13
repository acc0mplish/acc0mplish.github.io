/** Canonical selection, data, accessibility, and QA guidance for KLIC charts. */
const localized={type:'object',required:['ko','en'],properties:{ko:{type:'string',minLength:1},en:{type:'string',minLength:1}},additionalProperties:false};
const checklist={type:'object',required:['responsive','theme','labels','tableParity'],properties:{responsive:{type:'string',minLength:1},theme:{type:'string',minLength:1},labels:{type:'string',minLength:1},tableParity:{type:'string',minLength:1}},additionalProperties:false};
export const CHART_CONTRACT_SCHEMA={
  $schema:'https://json-schema.org/draft/2020-12/schema',
  title:'KLIC Chart Contract',
  type:'object',
  required:['schemaVersion','id','origin','family','useWhen','avoidWhen','takeaway','data','accessibility','qa'],
  properties:{
    schemaVersion:{const:'1.0'},id:{type:'string',pattern:'^[a-z0-9-]{1,90}$'},
    origin:{enum:['mit-licensed-adaptation','klic-authored']},family:{type:'string',minLength:1},
    useWhen:localized,avoidWhen:localized,takeaway:localized,
    data:{type:'object',required:['synthetic','exactTable','note'],properties:{synthetic:{const:true},exactTable:{type:'boolean'},note:localized},additionalProperties:false},
    accessibility:{type:'object',required:['keyboard','exactData','reducedMotion'],properties:{keyboard:localized,exactData:localized,reducedMotion:localized},additionalProperties:false},
    qa:checklist,
  },additionalProperties:false,
};

const qa={
  responsive:'검증할 실제 콘텐츠 폭: 320, 390, 768, 1280 CSS px. 축이 필요한 경우 차트 내부에서만 스크롤합니다.',
  theme:'KLIC light/dark 테마에서 파란색 데이터·중립 표면·선택 상태를 확인합니다.',
  labels:'축, 단위, 범례, 누락값, 0값을 색상만으로 구분하지 않는지 확인합니다.',
  tableParity:'표의 행·값·단위가 시각화에 전달된 동일 데이터와 일치하는지 대조합니다.',
};
const exact2d={
  synthetic:true,exactTable:true,
  note:{ko:'합성 예제 데이터입니다. 정확한 값은 차트의 표 대체 보기를 기준으로 읽습니다.',en:'Synthetic example data. Read exact values from the chart’s tabular alternative.'},
};
const exact3d={
  synthetic:true,exactTable:true,
  note:{ko:'합성 예제 데이터입니다. 정확한 값 표는 3D 렌더러와 같은 데이터에서 만듭니다.',en:'Synthetic example data. The exact-value table is built from the same data as the 3D renderer.'},
};
const access2d={
  keyboard:{ko:'표 대체 보기와 노출된 기본 컨트롤을 키보드로 이용합니다. 개별 도형 탐색은 차트별 구현을 확인합니다.',en:'Use the tabular alternative and exposed native controls by keyboard. Mark-level navigation varies by chart implementation.'},
  exactData:{ko:'동일 데이터에서 생성한 표 대체 보기를 제공합니다.',en:'An exact-value table is generated from the chart data.'},
  reducedMotion:{ko:'정적 차트에는 자동 모션이 없습니다. 전환 효과는 시스템의 모션 감소 설정에서 확인합니다.',en:'Static charts have no autoplay. Check transitions with the system reduced-motion preference.'},
};
const access3d={
  keyboard:{ko:'차트 모드·값 선택은 기본 키보드 조작이 가능한 컨트롤로 제공하고, 정확한 값은 표에서 탐색합니다.',en:'Chart mode and data selection use keyboard-operable native controls; exact values are navigable in the table.'},
  exactData:{ko:'동일 렌더러 데이터의 행·열·단위를 표로 확인합니다.',en:'Inspect rows, columns, and units in a table generated from renderer data.'},
  reducedMotion:{ko:'시스템 모션 감소 설정에서 자동 카메라·그래프 움직임을 멈추고 데이터 선택은 유지합니다.',en:'With reduced motion enabled, automatic camera and graph movement stops while data selection remains available.'},
};
const make=(id,family,origin,useKo,useEn,avoidKo,avoidEn,takeKo,takeEn,is3d=false)=>Object.freeze({
  schemaVersion:'1.0',id,origin,family,
  useWhen:{ko:useKo,en:useEn},avoidWhen:{ko:avoidKo,en:avoidEn},takeaway:{ko:takeKo,en:takeEn},
  data:is3d?exact3d:exact2d,accessibility:is3d?access3d:access2d,qa,
});
const records=[
  make('chart-distribution','distribution','mit-licensed-adaptation','연속형 관측값의 빈도와 분포 모양을 구간별로 비교할 때 사용합니다.','Use to compare frequency and distribution shape across numeric bins.','표본 수가 적거나 개별 관측값의 위치가 핵심이면 점 기반 분포를 선택합니다.','Choose a point-based distribution when the sample is small or individual positions matter.','구간 높이는 관측 빈도를 나타내며 구간 폭에 따라 모양이 달라집니다.','Bar height encodes observation count, and the shape depends on bin width.'),
  make('chart-violin','distribution','mit-licensed-adaptation','여러 그룹의 분포 밀도와 중앙값을 동시에 비교할 때 사용합니다.','Use to compare distribution density and medians across groups.','표본이 매우 적거나 밀도 추정이 관측값을 과장할 수 있으면 원자료 점을 함께 보여줍니다.','Show raw points when samples are sparse or density estimates could overstate the evidence.','좌우 대칭 폭은 추정 밀도이고 중앙값 표식은 별도 값입니다.','The mirrored width encodes estimated density; the median is a separate statistic.'),
  make('chart-beeswarm','distribution','mit-licensed-adaptation','관측값 하나하나의 위치와 분포 겹침을 함께 확인할 때 사용합니다.','Use when individual observations and overlap both matter.','수천 개 점이 겹쳐 비교를 막으면 집계 분포나 표본화된 보기를 사용합니다.','Use an aggregate or sampled view when thousands of overlapping points impede comparison.','각 점은 실제 샘플 관측값이며 가로 이동은 겹침을 줄이기 위한 배치입니다.','Each dot is a sample observation; perpendicular displacement only reduces overlap.'),
  make('chart-scatter-brush','distribution','mit-licensed-adaptation','두 수치 변수의 관계를 살피고 사각 범위 안의 관측값을 고를 때 사용합니다.','Use to inspect relationships between two numeric variables and select a rectangular range.','시간 순서나 범주별 총량이 질문이면 시계열 또는 막대 차트를 사용합니다.','Use a time-series or bar chart for temporal order or category totals.','두 축은 독립 수치 척도이며 선택된 표본 수는 범위에 포함된 점의 수입니다.','The axes are independent numeric scales; the selected count is the number of included points.'),
  make('chart-calibration','distribution','mit-licensed-adaptation','예측 확률과 실제 사건 비율이 일치하는지 확인할 때 사용합니다.','Use to assess whether predicted probabilities match observed event rates.','분류 정확도나 임계값별 오류가 질문이면 보정 그래프만으로 판단하지 않습니다.','Do not use calibration alone when the question concerns classification accuracy or threshold-specific errors.','이상 대각선에 가까울수록 예측 확률과 관측 비율이 일치합니다.','Points nearer the identity line indicate closer agreement between predicted probability and observed rate.'),
  make('chart-candlestick','price','mit-licensed-adaptation','기간별 시가·고가·저가·종가 범위를 함께 비교할 때 사용합니다.','Use to compare open, high, low, and close values by period.','실제 투자 판단에 합성 또는 지연 데이터가 들어가면 사용하지 않습니다.','Do not use synthetic or delayed data for investment decisions.','몸통은 시가와 종가, 꼬리는 고가와 저가를 나타냅니다.','The body encodes open and close; the wick encodes high and low.'),
  make('chart-forecast-fan','forecast','mit-licensed-adaptation','관측 구간과 미래 예측의 중앙값·불확실성 범위를 함께 보여줄 때 사용합니다.','Use to show observed history alongside a forecast center and uncertainty bands.','예측 구간을 보장값이나 확정된 계획으로 해석하면 안 됩니다.','Do not interpret forecast intervals as guarantees or committed plans.','예측 경계 뒤의 중첩 밴드는 불확실성 범위이며 관측값과 분리됩니다.','Nested bands after the forecast boundary show uncertainty and remain distinct from observations.'),
  make('chart-drawdown','risk','mit-licensed-adaptation','누적 최고값 대비 하락 폭과 회복 여부를 비교할 때 사용합니다.','Use to compare declines from a running peak and subsequent recovery.','가격 수준이나 서로 다른 자산의 절대 규모 비교에는 적합하지 않습니다.','Avoid for comparing price levels or absolute scale across assets.','각 시점의 낙폭은 현재값을 누적 최고값으로 나눈 비율에서 1을 뺀 값입니다.','Drawdown at each point is current value divided by running peak, minus one.'),
  make('chart-market-depth','market','mit-licensed-adaptation','중간 가격 주변의 매수·매도 누적 수량을 비교할 때 사용합니다.','Use to compare cumulative bid and ask quantities around the midpoint.','실시간 체결이나 주문 실행 가능량으로 표현하지 않습니다.','Do not present it as live trades or executable liquidity.','매수와 매도 곡선의 간격은 스프레드, 각 측의 높이는 누적 수량을 나타냅니다.','The gap between sides marks the spread; each side’s height encodes cumulative quantity.'),
  make('chart-orderbook','market','mit-licensed-adaptation','가격 단계별 수량과 누적 수량을 정확한 표와 함께 비교할 때 사용합니다.','Use to compare quantity and cumulative quantity at discrete price levels with exact values.','연속 시계열 추세나 현재 주문 상태를 보여줘야 할 때 합성 호가를 사용하지 않습니다.','Do not use synthetic order-book data for continuous trends or current order state.','가격 단계는 매수·매도로 나뉘며 표가 가격·수량·누적값을 보존합니다.','Price levels are split by side; the table preserves price, quantity, and cumulative values.'),
  make('chart-state-timeline','timeline','mit-licensed-adaptation','각 상태의 시작·종료 시각과 지속 시간을 비교할 때 사용합니다.','Use to compare start, end, and elapsed duration for each state.','사건 간 인과관계나 정확한 수치 규모가 핵심이면 별도 축·표를 추가합니다.','Add explicit axes or a table when causality or precise magnitudes are central.','막대의 위치는 시간, 폭은 경과 시간을 나타냅니다.','Position encodes time and bar width encodes elapsed duration.'),
  make('chart-spark-table','trend','mit-licensed-adaptation','여러 항목의 작은 추세와 현재값·변화량을 표 안에서 비교할 때 사용합니다.','Use to compare compact trends, current values, and changes in one table.','추세 모양 자체를 정밀하게 비교해야 하면 큰 공통 축을 사용합니다.','Use a larger shared axis when precise shape comparison matters.','각 미니 선은 같은 행의 수열에 연결되고 현재값·변화량은 텍스트로 남습니다.','Each sparkline is tied to its row’s sequence; current value and change remain textual.'),
  make('chart-waterfall','composition','mit-licensed-adaptation','증감 항목이 이전 누계에서 최종 합계로 이어지는 과정을 설명할 때 사용합니다.','Use to explain how positive and negative deltas build to a final total.','부분 구성의 비율만 비교하거나 각 막대를 0 기준으로 비교할 때는 쓰지 않습니다.','Avoid when only part-to-whole shares or zero-based category comparison is needed.','증감 막대는 이전 누계에서 시작하고 요약 막대만 0 기준에서 시작합니다.','Delta bars start at the previous cumulative value; summary bars start at zero.'),
  make('chart-treemap','composition','mit-licensed-adaptation','계층형 범주의 상대적 크기를 제한된 화면에서 비교할 때 사용합니다.','Use to compare relative sizes of hierarchical categories in a constrained area.','면적 차이가 작아 정확한 순위·값 비교가 필요하면 막대와 표를 사용합니다.','Use bars and a table when small area differences make exact ranking or values important.','사각형 면적은 비음수 값을 비례해 배분합니다.','Rectangle area is proportional to each nonnegative value.'),
  make('chart-streamgraph','composition','mit-licensed-adaptation','시간에 따른 여러 항목의 구성 변화와 밴드 두께를 보여줄 때 사용합니다.','Use to show how multiple series’ composition changes over time.','정확한 0 기준 비교나 음수 값이 필요하면 다른 차트를 선택합니다.','Choose another chart when exact zero-based comparisons or negative values matter.','밴드 두께가 값을 나타내고 중앙 기준선 때문에 위치만으로 절대값을 읽을 수 없습니다.','Band thickness encodes values; the centered baseline means position alone is not an absolute value.'),
  make('daily-active-users-area','composition','mit-licensed-adaptation','채널별 활성 사용자 구성과 전체 합계의 시간 변화를 함께 볼 때 사용합니다.','Use to view channel composition and total active users over time.','채널별 독립 추세를 0 기준으로 비교하려면 누적 대신 분리된 축을 사용합니다.','Use separate zero-based comparisons when independent channel trends matter.','각 시점의 전체 높이는 채널 값의 합이며 각 층은 채널 값을 나타냅니다.','Total height at each time is the sum of channel values; each band is one channel.'),
  make('cloud-spend-variance-bar','comparison','mit-licensed-adaptation','서비스별 환경 비용을 공통 0 기준 축에서 비교할 때 사용합니다.','Use to compare environment costs per service on a shared zero-based scale.','개발·스테이징·운영 값이 실제 청구 데이터가 아니면 예산 결정을 뒷받침하지 않습니다.','Do not use non-billing sample data to support budget decisions.','그룹은 환경별 비용을 분리하고 누적 합계는 환경 비용의 총액입니다.','Groups separate environment costs; stacked totals equal the sum of those costs.'),
  make('chart-dumbbell','comparison','mit-licensed-adaptation','범주별 두 값과 전후 차이를 공통 수평 축에서 비교할 때 사용합니다.','Use to compare two values and their change across categories on a shared horizontal scale.','세 개 이상 시점의 상세 추세를 설명하는 용도로는 적합하지 않습니다.','Avoid when the task is to explain a detailed trend across more than two time points.','두 점은 비교값이고 연결선은 부호가 있는 차이를 나타냅니다.','The two endpoints are compared values; the connector encodes their signed difference.'),
  make('chart-correlation','relationship','mit-licensed-adaptation','여러 변수 쌍의 상관 방향과 강도를 전체적으로 살펴볼 때 사용합니다.','Use to scan the direction and strength of pairwise correlations across variables.','상관을 인과관계로 해석하거나 표본 수·불확실성을 생략하지 않습니다.','Do not interpret correlation as causation or omit sample size and uncertainty.','셀은 −1부터 +1의 상관계수이며 결측값은 0과 다릅니다.','Cells encode correlations from −1 to +1; missing values are distinct from zero.'),
  make('chart-cohort-retention','retention','mit-licensed-adaptation','시작 시점이 다른 코호트의 경과 기간별 잔존율을 비교할 때 사용합니다.','Use to compare retention by elapsed period for cohorts with different start dates.','미래 관측이 없는 빈 칸을 0% 잔존으로 해석하지 않습니다.','Do not interpret unavailable future cells as 0% retention.','각 셀은 해당 코호트 시작 인원 대비 잔존 비율이며 아직 관측되지 않은 기간은 제외됩니다.','Each cell is the retained share of its cohort base; unobserved future periods are omitted.'),
  make('chart-calendar-heatmap','calendar','mit-licensed-adaptation','일별 활동량과 요일·주 패턴을 함께 확인할 때 사용합니다.','Use to inspect daily activity and weekday/week patterns together.','시간대별 변화나 정확한 두 범주의 수치 비교에는 적합하지 않습니다.','Avoid for intraday changes or exact numeric comparisons between two categories.','날짜가 없는 셀은 관측된 0과 구분하고 색 외에 값을 제공합니다.','Missing dates are distinct from observed zero and values are available beyond color.'),
  make('self-serve-funnel','conversion','mit-licensed-adaptation','순서가 고정된 셀프서브 단계별 잔존 수와 이전 단계 전환을 볼 때 사용합니다.','Use to inspect remaining users and step-to-step conversion in an ordered self-serve flow.','단계가 병렬이거나 서로 다른 모집단이면 하나의 퍼넬로 합치지 않습니다.','Do not combine parallel stages or different populations in one funnel.','전환율 분모는 바로 앞 단계의 수이며 각 단계 수는 누적 감소 흐름을 이룹니다.','Each conversion rate uses the immediately preceding stage as its denominator.'),
  make('chart-bullet','target','mit-licensed-adaptation','실적과 목표, 정성 구간을 하나의 공통 축에서 비교할 때 사용합니다.','Use to compare a measure, target, and qualitative ranges on one shared scale.','목표가 범위 밖이거나 단위가 서로 다르면 같은 축에 겹쳐 표시하지 않습니다.','Do not overlay measures with incompatible units or targets outside the displayed domain.','실적 막대와 목표 표식은 같은 축을 쓰며 배경 구간은 정성 범위입니다.','The measure and target share one axis; background bands encode qualitative ranges.'),
  make('chart3d-isometric-latency','latency','klic-authored','시간별 p95 지연 변화와 선택한 날짜의 정확한 값을 입체적으로 보여줄 때 사용합니다.','Use to show p95 latency over time and inspect an exact selected day in 3D.','합성 지연값을 서비스 SLO 판정이나 운영 경보의 근거로 사용하지 않습니다.','Do not use synthetic latency values for SLO decisions or operational alerts.','선택 날짜와 일별 지연값은 동일 30일 데이터의 표에서 확인합니다.','Inspect the selected day and daily latency in a table backed by the same 30-day data.',true),
  make('chart3d-voxel-hourly-density','traffic','klic-authored','요일·시간대별 요청 밀도 패턴과 피크 셀을 탐색할 때 사용합니다.','Use to explore request density by weekday and hour, including peak cells.','셀 값이 실제 트래픽 측정치가 아니거나 밀도 대신 정확한 총량 비교가 필요하면 사용하지 않습니다.','Avoid when values are not measured traffic or exact totals matter more than density.','7×24 격자 표의 셀은 복셀 높이와 같은 요청량 값을 사용합니다.','The 7×24 grid table uses the same request values as voxel heights.',true),
  make('chart3d-cylinder-donut-stack','composition','klic-authored','세 자원 계층의 점유 비율과 예시 월 비용을 하나의 입체 구성으로 비교할 때 사용합니다.','Use to compare three resource shares and illustrative monthly costs in one 3D composition.','자원 비용이 실제 청구 데이터가 아니면 비용 승인·예측 자료로 사용하지 않습니다.','Do not use illustrative costs for billing approval or forecasts.','각 계층의 퍼센트·월 비용은 원통 렌더러에 전달한 동일 항목에서 읽습니다.','Tier percentages and monthly costs are read from the same entries passed to the cylinder renderer.',true),
  make('chart3d-cluster-topology-bars','regional-throughput','klic-authored','리전별 요청 처리량과 평균 지연을 같은 화면에서 선택 비교할 때 사용합니다.','Use to select and compare regional request throughput and average latency.','합성 리전 값을 실제 가용성·네트워크 상태로 보고하지 않습니다.','Do not report synthetic region values as real availability or network status.','리전 표에는 기둥 높이와 연결된 RPS·핑 값 및 단위가 표시됩니다.','The region table exposes RPS and ping values and units tied to the bar heights.',true),
  make('chart3d-funnel-slab-cascade','conversion','klic-authored','단계별 잔존과 이탈을 계단형 슬래브로 설명할 때 사용합니다.','Use to explain stage retention and drop-off with cascading slabs.','단계 순서나 모수가 다르거나 합성값인 경우 실제 전환 보고에 사용하지 않습니다.','Do not use for actual conversion reporting when stages or populations differ or values are synthetic.','각 단계 이름·인원·직전 단계 대비 비율은 슬래브에 사용한 같은 표본에서 읽습니다.','Each stage name, count, and prior-stage rate comes from the same data used by the slabs.',true),
];

export const CHART_CONTRACTS=Object.freeze(Object.fromEntries(records.map(record=>[record.id,record])));
export function getChartContract(id){return CHART_CONTRACTS[id];}
