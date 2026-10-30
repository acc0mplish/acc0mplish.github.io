import {RIGHT_PANEL_EXAMPLES,RIGHT_PANEL_ADOPTION} from './right-panel-block-catalog.mjs';
import {TIMELINE_BLOCK_EXAMPLES,TIMELINE_ADOPTION} from './timeline-block-catalog.mjs';
import {FLOW_CONNECTOR_EXAMPLES} from './flow-connector-catalog.mjs';
import {DASHBOARD_BLOCK_EXAMPLES,DASHBOARD_ADOPTION} from './dashboard-block-catalog.mjs';
import {REFERENCE_COMPONENT_BLOCKS,REFERENCE_COMPONENT_ADOPTION} from './reference-component-block-catalog.mjs';
// KLIC block adoption policies, not a record of browser certification.
// Value ownership is defined in tokens.mjs; structural and interaction rules live here.
export const AXES=Object.freeze([
  {id:'size',label:'크기와 비율'},
  {id:'typography',label:'타이포그래피'},
  {id:'color',label:'색과 명도 대비'},
  {id:'layout',label:'배치와 정렬'},
  {id:'spacing',label:'간격과 그룹화'},
  {id:'surface',label:'표면과 깊이'},
  {id:'interaction',label:'상호작용과 피드백'}
].map(axis=>Object.freeze(axis)));

const colorLabels={surface:'페이지 표면',panel:'컨테이너 표면',soft:'보조 표면',selected:'선택 표면',text:'본문',muted:'보조 문구',border:'구분 경계','control-border':'컨트롤 경계',accent:'주요 행동','accent-hover':'주요 행동 호버','on-accent':'강조 위 문구',success:'완료 의미','success-surface':'완료 표면',warning:'주의 의미','warning-surface':'주의 표면',danger:'오류 의미','danger-surface':'오류 표면'};
const dimensionLabels={'content.max-width':'콘텐츠 최대 폭','section.gap':'섹션 간격','container.padding':'컨테이너 안쪽 간격','control.height':'컨트롤 최소 높이','surface.radius':'표면 반경','icon.size':'아이콘 크기','typography.body.font-size':'본문 크기','typography.label.font-size':'레이블 크기'};
const tokenRows=[
  ...Object.entries(colorLabels).map(([name,label])=>({path:'klic.component.block.color.'+name,label})),
  ...Object.entries(dimensionLabels).map(([name,label])=>({path:'klic.component.block.'+name,label}))
];

const shared={
  size:'콘텐츠 최대 폭은 80rem이며 좁은 컨테이너에서는 가용 폭을 따른다. 컨트롤 높이는 A 2rem / B 2.25rem의 최소값으로 적용하고 실제 조작 영역을 별도로 확인한다.',
  typography:'본문 1rem과 레이블 0.75rem 역할을 구분한다. KLIC의 한글 fallback과 실제 제공 굵기를 사용하며 폭이 줄어도 글자를 일괄 축소하지 않고 긴 문구를 보존한다.',
  color:'회사 블루를 행동·선택·진행에 사용한다. 완료는 블루와 체크·문구, 주의는 앰버, 오류는 레드로 구분한다. Light/Dark의 실제 합성 대비는 별도 검증한다.',
  layout:'제목·설명·주요 행동·콘텐츠의 DOM 읽기 순서를 유지한다. 열 재배치와 sticky·스크롤 소유권은 값 토큰과 분리하여 블록 구조에 적용한다.',
  spacing:'섹션 간격 1.5rem과 컨테이너 padding 1rem을 분리한다. 레이블·컨트롤·안내를 한 그룹으로 묶고 좁은 폭을 이유로 density를 자동 변경하지 않는다.',
  surface:'표면 반경 0.5rem과 경계·그림자를 독립적으로 적용한다. 불투명 panel이 뒤 콘텐츠를 비추지 않게 하고 포커스와 열린 표면이 가려지지 않도록 한다.',
  interaction:'hover·selected·invalid·focus·disabled·busy의 속성 소유권을 나눈다. 필요한 상태는 문구와 아이콘으로도 알리고 중복 실행과 재시도·복구 경로를 정의한다.'
};

const profiles={
  gantt:{
    composition:['작업명·시간 축·일정 막대·범례·선택 상세를 연결한다. 작업 ID와 시작·종료·진행률의 의미를 유지한다.'],
    size:'시간 축과 작업 열의 최소 폭을 유지한다. 막대의 시각 높이와 선택 hit area를 구분하고 작은 화면에서 일정을 압축하여 읽을 수 없게 만들지 않는다.',
    typography:'작업명과 날짜 레이블의 글자 크기를 안정적으로 유지한다. 긴 한글 작업명은 줄바꿈 또는 접근 가능한 전체 이름을 제공하며 날짜 축과 행 높이를 함께 확인한다.',
    layout:'작업명과 시간 축을 같은 스크롤 문맥에서 정렬한다. 가로 스크롤은 일정 영역이 소유하며 sticky 작업 열·헤더가 선택 막대와 포커스를 가리지 않게 한다.',
    spacing:'작업 그룹과 개별 행의 간격을 구분한다. 기간 확대·축소와 명시적 density 변경을 분리하고 행 높이 변경 시 막대·연결선 정렬을 함께 갱신한다.',
    surface:'고정 작업 열·시간 헤더·일정 막대·상세 overlay의 깊이를 구분한다. 불투명 고정 표면으로 뒤 일정이 겹쳐 보이지 않게 한다.',
    interaction:'작업 선택·기간 변경·필터 후 선택과 스크롤을 보존한다. 드래그 편집을 제공하면 날짜 입력 또는 이동 버튼으로 같은 결과를 만들 수 있게 한다.',
    keyboard:['작업 선택과 상세 열기를 키보드로 실행할 수 있게 한다. 편집 취소 후 해당 작업으로 초점을 복귀시킨다.','기간 변경은 드래그 외에 버튼 또는 날짜 입력으로도 제공한다.'],
    responsive:['시간 축과 행의 의미가 필요한 2차원 영역은 내부 가로 스크롤을 허용한다. 페이지 자체는 가로로 넘치지 않게 한다.','좁은 폭에서는 필터와 상세를 재배치하며 글자·행을 자동 축소하지 않는다.'],
    states:['최초 로딩, 일정 없음, 필터 0건, 기간 변경 중, 저장 실패를 구분한다. 실패 시 마지막 확정 일정과 선택을 복구한다.'],
    requirements:['FR18','FR32']
  },
  grid:{
    composition:['툴바·열 헤더·데이터 행·선택·페이지 또는 추가 로드를 하나의 테이블 계약으로 연결한다. 행 ID와 열 의미를 유지한다.'],
    size:'열의 최소 폭과 셀 내용에 필요한 높이를 보존한다. 데이터의 2차원 의미는 내부 스크롤로 유지하며 viewport만으로 작은 글자나 dense를 선택하지 않는다.',
    typography:'헤더·본문·숫자·상태 레이블을 구분한다. 긴 한글과 숫자가 겹치지 않게 하며 말줄임을 쓰는 셀에는 전체 내용을 확인할 경로를 둔다.',
    layout:'열 헤더와 셀의 연결을 유지한다. 가로 스크롤은 표 영역이 소유하고 pinned·sticky의 배경과 순서를 명시하며 숨긴 열의 정보 접근 경로를 제공한다.',
    spacing:'Default/Dense는 명시적 선택으로 셀 padding과 헤더 높이에만 적용한다. 폼·내비게이션의 간격과 글자 크기는 함께 바꾸지 않는다.',
    surface:'헤더·고정 열·선택 행·편집 셀의 표면을 구분한다. 선택과 오류를 호버가 지우지 않게 하며 고정 셀이 초점·필수 조작을 가리거나 뒤 행 상태를 비추지 않도록 확인한다.',
    interaction:'정렬·필터·열 변경·선택·편집의 상태를 분리한다. 검색 0건과 실제 빈 데이터를 구분하고 저장 실패 시 셀 입력과 선택을 보존한다.',
    keyboard:['정렬·선택·필터는 이름 있는 버튼과 입력으로 조작한다. 데이터 표에 grid 역할만 추가하여 방향키 지원을 주장하지 않는다.','편집 저장·취소 후 해당 셀 또는 합리적인 다음 위치로 초점을 복귀시킨다.'],
    responsive:['표의 의미에 필요한 최소 열 폭은 유지하고 표 영역에 가로 스크롤을 둔다. 주변 툴바와 필터는 좁은 폭에서 재배치한다.','행 높이·줄바꿈·폰트·density 변경에 맞춰 고정 헤더와 셀 정렬을 확인한다.'],
    states:['로딩·데이터 없음·검색 0건·갱신 중·부분 실패·추가 로드 실패를 구분한다. 오류는 기존 결과와 수정 중인 입력을 보존한 채 재시도 경로를 제공한다.'],
    requirements:['FR13','FR18']
  },
  form:{
    composition:['제목·필드 그룹·레이블·입력·도움말·오류·제출 행동을 연결한다. 단계형 폼은 현재 단계와 이전 입력을 보존한다.'],
    size:'입력과 제출 버튼은 control 높이 역할을 공유한다. 긴 레이블·도움말·오류는 자동 높이로 보존하며 작은 폭에서 입력과 주요 행동이 잘리지 않게 한다.',
    typography:'레이블·입력 값·도움말·오류의 역할을 구분한다. 한글 조합과 긴 오류 문구를 보존하며 폭 변경만으로 입력 글자를 줄이지 않는다.',
    layout:'레이블→입력→도움말·오류의 읽기 순서를 유지한다. 복수 열은 한 열로 재배치하고 제출·취소 행동은 연관 필드 뒤에 둔다.',
    spacing:'필드 내부 간격과 필드 그룹 사이 간격을 구분한다. 오류가 생겨도 다른 필드의 레이블과 잘못 묶여 보이지 않게 한다.',
    interaction:'invalid와 focus를 함께 식별하고 오류 문구를 해당 입력에 연결한다. busy 중 중복 제출을 차단하며 실패 시 입력을 보존하고 성공은 실제 저장 범위에 맞게 알린다.',
    keyboard:['Tab 순서를 필드의 읽기 순서와 맞춘다. IME 조합 중 Enter가 제출이나 단계 이동을 확정하지 않도록 한다.','오류 원인과 수정 경로를 입력에 연결하고 제출 실패 시 첫 오류 또는 오류 요약으로 합리적으로 안내한다.'],
    responsive:['필드 열은 컨테이너 폭에 따라 한 열로 재배치한다. 레이블·도움말·오류는 줄바꿈하며 내용 길이에 맞춰 높이를 늘린다.','소프트 키보드가 열려도 입력·오류·제출·취소에 도달할 수 있도록 스크롤 소유권을 정한다.'],
    states:['입력 전·편집 중·invalid+focus·readonly·disabled·busy·저장 완료·저장 실패를 구분한다. 입력 오류는 사라지는 toast만으로 알리지 않는다.','실패 시 사용자가 입력한 내용과 현재 단계를 보존하며 재시도 후 중복 저장이 일어나지 않게 한다.'],
    requirements:['FR29','FR31']
  },
  overlay:{
    composition:['이름 있는 trigger·제목·설명·본문·닫기·주요 행동을 묶는다. 모달과 비모달을 구분하고 Portal·스크롤 잠금의 책임을 정한다.'],
    size:'Dialog/Sheet는 viewport와 safe area 안에서 제한한다. 긴 본문은 내부에서 스크롤하고 닫기·확인·취소의 조작 영역을 유지한다.',
    layout:'제목·본문·행동의 순서를 유지하고 overlay별 최상위 dismiss 대상과 스크롤 소유자를 정한다. 고정 footer가 마지막 입력·오류를 가리지 않게 한다.',
    spacing:'제목과 설명, 본문 그룹, 마지막 행동 사이의 간격을 분리한다. 작은 화면에서도 닫기와 주요 행동의 target이 겹치지 않게 한다.',
    surface:'Backdrop·Popup·중첩 overlay의 stacking context를 구분한다. 모든 문제를 큰 z-index 하나로 해결하지 않으며 Portal에도 같은 테마를 전달한다.',
    interaction:'열릴 때 초기 초점, 모달 내부 Tab 순환, 외부 비활성, Escape·닫기, trigger로의 초점 복귀를 정의한다. trigger가 사라지면 다음 작업 위치로 복귀한다.',
    keyboard:['모달은 초기 초점과 Tab·Shift+Tab 순환을 제공하고 Escape와 닫기 버튼으로 닫은 뒤 trigger 또는 합리적인 다음 위치로 초점을 복귀시킨다.','비모달은 모달의 초점 가두기를 적용하지 않는다. 중첩 overlay에서는 최상위 항목만 닫는다.'],
    responsive:['작은 viewport에서는 폭과 최대 높이를 제한하고 긴 본문은 내부 스크롤로 제공한다. 닫기·확인·취소는 항상 접근 가능하게 한다.','safe area·동적 viewport·소프트 키보드가 열린 조건을 별도로 시험한다.'],
    states:['closed·open·제출 중·입력 오류·완료를 구분한다. busy 중 닫기와 취소 허용 범위를 명시하고 종료 후 초점·스크롤 잠금을 복구한다.'],
    requirements:['FR10','FR27','FR28','FR29']
  },
  kanban:{
    composition:['보드 제목·열 이름·열별 건수·카드·상태 변경 행동을 연결한다. 카드 ID와 열 순서의 의미를 보존한다.'],
    size:'카드의 읽을 수 있는 최소 폭과 행동 target을 유지한다. 보드 열을 압축해 제목·상태·담당자 정보가 잘리지 않게 한다.',
    typography:'열 이름과 카드 제목은 줄바꿈하고 건수·상태를 보조 역할로 구분한다. 긴 한글 제목을 드래그 손잡이와 겹치지 않게 한다.',
    layout:'열과 카드의 DOM 읽기 순서를 유지한다. 보드의 가로 스크롤과 열 내부 세로 스크롤을 구분하고 카드 이동 후 논리적 순서를 갱신한다.',
    spacing:'열 사이 간격과 카드 사이 간격을 구분한다. 드래그 표시와 이동 메뉴가 인접 카드의 조작 영역을 덮지 않게 한다.',
    interaction:'카드 이동은 drag·keyboard·click/tap 경로를 함께 제공한다. 변경 중·실패·되돌리기를 구분하고 이동 후 해당 카드의 초점을 유지한다.',
    keyboard:['카드 메뉴에서 이동할 열과 위치를 선택할 수 있게 한다. 키보드와 단일 포인터 대안이 드래그와 같은 결과를 만들도록 한다.'],
    responsive:['보드 열의 의미는 내부 가로 스크롤로 유지하거나 명시적 열 선택 뷰로 제공한다. 카드 글자를 일괄 축소하지 않는다.'],
    states:['빈 열·이동 중·이동 완료·저장 실패를 구분한다. 실패 시 이전 열·순서·선택을 복구하고 되돌리기 경로를 제공한다.'],
    requirements:['FR32']
  },
  navigation:{
    composition:['현재 위치·내비게이션 항목·검색·사용자 행동·콘텐츠 영역을 연결한다. 모바일 메뉴의 열기·닫기를 독립된 행동으로 제공한다.'],
    size:'메뉴 레이블과 실제 조작 영역을 유지한다. 아이콘 전용 모드에는 이름을 제공하며 축소 폭과 모바일 전환 조건을 구분한다.',
    layout:'DOM 순서와 시각 순서를 일치시키고 현재 위치를 표시한다. 고정 header·sidebar가 콘텐츠와 포커스를 가리지 않게 하며 전환 시 활성 위치를 보존한다.',
    spacing:'내비게이션 그룹과 개별 항목의 간격을 구분한다. 현재 항목 표식과 확장 버튼을 서로 다른 행동으로 식별하게 한다.',
    interaction:'현재 페이지·확장 상태·hover·focus를 각각 유지한다. 모바일 메뉴 닫기 후 열기 버튼으로 복귀하고 라우트 이동 시 메뉴와 스크롤 잠금을 복구한다.',
    keyboard:['링크에는 현재 위치를, 확장 버튼에는 펼침 상태를 제공한다. 모바일 모달 메뉴는 닫기와 초점 복귀를 지원한다.'],
    responsive:['넓은 내비게이션은 좁은 폭에서 접히는 메뉴로 전환한다. CSS 경계와 JS 분기를 일치시키며 열린 상태의 경계 전환을 확인한다.'],
    states:['현재 페이지·확장·접힘·모바일 열림을 구분한다. 메뉴 닫기와 라우트 변경이 콘텐츠의 접근 가능 상태를 복구하게 한다.'],
    requirements:['FR18','FR27']
  },
  calendar:{
    composition:['기간 제목·이전/다음·오늘·날짜 격자·일정 목록·선택 상세를 연결한다. 날짜와 시간대, 선택 기간의 의미를 명시한다.'],
    size:'날짜 target과 일정 레이블을 유지한다. 월·주·일 뷰의 셀 기하를 구분하고 많은 일정은 목록 또는 더 보기로 접근하게 한다.',
    typography:'날짜·요일·일정 제목·시간의 역할을 구분한다. 긴 한글 일정명과 locale별 날짜 형식이 셀을 넘을 때 전체 내용 경로를 둔다.',
    layout:'날짜의 읽기 순서와 주 시작일을 명시한다. 시간 격자 스크롤과 주변 도구의 스크롤을 분리하고 선택 날짜와 상세를 연결한다.',
    interaction:'오늘·선택 날짜·현재 기간을 다른 상태로 구분한다. 기간 이동과 일정 편집 후 선택·초점을 유지하며 날짜 입력 대안을 제공한다.',
    keyboard:['날짜 선택은 이름 있는 컨트롤로 제공한다. 방향키 탐색을 채택하면 Home/End와 월 이동의 범위를 명시하고 선택 상세에서 날짜로 초점을 복귀시킨다.'],
    responsive:['시간 격자의 2차원 의미가 필요한 경우 내부 가로 스크롤을 사용한다. 작은 화면에서는 일정 목록 뷰와 재배치를 제공한다.'],
    states:['기간 로딩·일정 없음·선택·편집 중·충돌·저장 실패를 구분한다. 실패 시 날짜·시간대·입력과 기존 일정을 보존한다.'],
    requirements:['FR18','FR31','FR32']
  },
  editor:{
    composition:['도구 모음·편집 영역·선택 상태·저장 상태를 연결한다. 에디터와 화이트보드의 내용 모델·입력 방식·내보내기 범위를 명시한다.'],
    size:'편집 영역은 내용과 가용 폭에 맞춰 확장한다. 도구의 hit area와 캔버스 확대 비율을 구분하며 글자 확대가 페이지 조작을 막지 않게 한다.',
    typography:'입력한 한글·혼합 문자·줄바꿈을 보존한다. 내용의 타이포와 도구 레이블을 구분하며 font fallback으로 선택 범위와 줄 높이가 달라지는 조건을 확인한다.',
    layout:'도구 모음과 편집 영역의 읽기·Tab 순서를 정의한다. 캔버스 이동·확대와 페이지 스크롤을 구분하고 고정 도구가 선택 내용을 덮지 않게 한다.',
    interaction:'IME 조합·선택·실행 취소·다시 실행·저장 상태를 구분한다. drag만으로 가능한 필수 조작을 만들지 않고 실패 시 편집 내용과 선택을 보존한다.',
    keyboard:['편집 영역에 이름을 제공하고 도구로 이동한 뒤 편집 위치로 돌아올 수 있게 한다. IME 조합 중 Enter와 단축키 확정을 분리한다.','드래그로 배치하는 내용에는 클릭·탭과 키보드 대안을 제공한다.'],
    responsive:['도구 모음은 줄바꿈 또는 접근 가능한 메뉴로 재배치한다. 2차원 캔버스는 자체 스크롤·확대 경로를 두고 본문은 줄바꿈한다.'],
    states:['편집 중·미저장·저장 중·저장 완료·저장 실패를 구분한다. 데모에서 영구 저장하지 않는 내용은 실제 저장된 것처럼 안내하지 않는다.'],
    requirements:['FR31','FR32']
  },
  chart:{
    composition:['제목·지표·단위·기간·범례·시각화·보조 설명을 연결한다. 값 0·null·알 수 없음의 의미를 구분한다.'],
    size:'플롯의 비율과 레이블을 읽을 수 있는 최소 크기를 유지한다. 작은 폭에서는 범례를 재배치하고 필요하면 내부 스크롤 또는 요약 값을 제공한다.',
    typography:'축·범례·데이터 값·단위의 역할을 구분한다. 작은 라벨을 자동 축소하지 않고 긴 한글과 숫자가 겹치면 생략 규칙과 전체 내용 경로를 제공한다.',
    color:'블루 계열을 기반으로 데이터 계열을 구분하되 색에만 의존하지 않고 레이블·패턴·선 모양을 함께 사용한다. 주의·오류에는 의미가 맞는 앰버·레드를 사용한다.',
    layout:'제목·기간·범례·플롯·해설의 읽기 순서를 유지한다. 툴팁이 플롯 밖으로 잘리지 않게 하며 수치와 단위를 다른 경로로도 확인하게 한다.',
    spacing:'축 레이블·플롯·범례 사이의 간격을 분리한다. 카드 padding을 바꿔도 데이터 점의 의미나 축 스케일이 임의로 바뀌지 않게 한다.',
    interaction:'필터·계열 선택·포커스 툴팁을 구분한다. hover 정보는 키보드와 터치에서도 접근 가능하게 하고 0·결측·오류를 같은 빈 값으로 표시하지 않는다.',
    keyboard:['조작 가능한 범례·기간 필터에 이름과 상태를 제공한다. hover로만 표시되는 핵심 수치는 포커스 또는 상시 설명·표로도 제공한다.'],
    responsive:['좁은 컨테이너에서는 범례와 해설을 재배치한다. 레이블이 충돌하는 플롯은 명시적 스크롤·간소화 규칙과 원자료 접근 경로를 제공한다.'],
    states:['최초 로딩·실제 0·결측·빈 기간·갱신 중·부분 실패를 구분한다. 단위·기간·데이터 출처를 유지하고 실제 데이터 갱신 여부와 상태 문구를 일치시킨다.'],
    requirements:['FR28']
  },
  feedback:{
    composition:['상태 제목·원인 또는 설명·복구 행동을 연결한다. 알림은 내용의 중요도에 맞춰 시각 표시와 프로그램적 안내를 선택한다.'],
    size:'상태 문구와 복구 버튼은 긴 내용에 맞춰 높이를 늘린다. 알림이 다른 필수 행동을 덮지 않게 하고 닫기 target을 별도로 확보한다.',
    layout:'상태 설명 다음에 조건 수정·재시도 행동을 배치한다. 알림 순서와 화면 내 위치를 유지하며 필요한 오류는 관련 입력 또는 결과 가까이에 둔다.',
    interaction:'로딩·실제 빈 데이터·검색 0건·오류·완료를 서로 구분한다. 중요한 오류를 사라지는 toast만으로 알리지 않으며 반복 알림과 강제 초점 이동을 제어한다.',
    keyboard:['복구·재시도·닫기는 키보드로 실행할 수 있게 한다. 비긴급 상태 알림은 사용자 초점을 강제로 가져가지 않는다.'],
    responsive:['설명과 복구 행동은 좁은 폭에서 재배치하고 줄바꿈한다. 긴 알림은 내용과 닫기 버튼이 잘리지 않도록 한다.'],
    states:['최초 로딩·빈 데이터·검색 0건·부분 실패·완료를 각각 표현한다. 검색 0건에는 조건 수정, 실패에는 원인과 재시도 경로를 제공한다.'],
    requirements:['FR24']
  },
  content:{
    composition:['제목·설명·관련 메타데이터·반복 콘텐츠·주요 행동을 묶는다. 카드 전체 링크와 내부 버튼의 중첩을 피하고 각 행동의 이름을 유지한다.'],
    size:'카드와 목록 항목은 최소 폭을 유지하며 내용 길이에 따라 높이를 늘린다. 장식 이미지의 비율과 실제 텍스트·행동 영역을 구분한다.',
    typography:'카드 제목·본문·메타의 역할과 줄바꿈을 구분한다. 동일한 크기라는 이유만으로 PageTitle이나 DialogTitle의 행간 규칙을 복제하지 않는다.',
    layout:'반복 카드는 DOM 읽기 순서를 유지하며 컨테이너 폭에 따라 열을 재배치한다. 목록의 제목·메타·행동이 좁은 폭에서도 같은 항목으로 묶이게 한다.',
    spacing:'카드 내부 그룹과 카드 사이 간격을 분리한다. 메타데이터와 행동이 다른 카드의 정보로 보이지 않게 그룹 경계를 유지한다.',
    interaction:'선택·확장·행동 실행의 상태를 구분한다. 카드 클릭과 내부 버튼이 중복 실행되지 않게 하며 결과·실패·복구를 실제 데모 상태에 맞춰 알린다.',
    keyboard:['카드·목록의 링크와 내부 버튼을 각각 이름 있는 독립 행동으로 제공한다. 시각 순서와 Tab 순서를 일치시킨다.'],
    responsive:['반복 카드는 여러 열에서 한 열로 재배치한다. 긴 제목·메타·행동은 줄바꿈하며 고정 높이로 잘라내지 않는다.'],
    states:['로딩·빈 목록·검색 0건·선택·확장·행동 실패를 구분한다. 필터 변경과 재시도 후 선택·입력·스크롤 보존 범위를 명시한다.'],
    requirements:[]
  }
};

const gridCategories=new Set(['base','advanced','columns','drag-drop','editing','expansion','filtering','grouping','virtualization']);
const chartCategories=new Set(['sankey-chart','slope-chart','radial-chart','sparkline','status-tracker','bar-column','area-line','pie-donut','funnel-chart','radar-polar']);
function profileFor(block){
  const category=block.categoryId||'',collection=String(block.collection||'').toLowerCase();
  if(category==='app-ai-interactions')return {...profiles.content,composition:['결정 인박스·도구 실행·추천·메시지 또는 마키·후기 카드의 KLIC 구성.'],interaction:'로컬 결정·재시도·버전·피드백 상태를 보존한다. 실제 전송·배포를 수행하지 않는다. 연속 움직임은 일시정지와 reduced-motion을 제공한다.',keyboard:['Tab으로 행동을 탐색하고 Enter·Space로 실행한다. 펼침 상태를 aria-expanded로 알리며 움직임을 버튼으로 멈출 수 있다.'],states:['대기·완료·실패·재시도·선택 취소·응답 버전을 구분한다. 후기 콘텐츠는 가상 샘플임을 표시한다.']};
  if(category==='gantt-chart')return profiles.gantt;
  if(gridCategories.has(category)||/datagrid|data-grid|table/.test(collection))return profiles.grid;
  if(category==='kanban-board')return profiles.kanban;
  if(['app-dialog','app-sheet'].includes(category))return profiles.overlay;
  if(['app-form','app-auth','app-settings','app-wizard','app-onboarding'].includes(category))return profiles.form;
  if(['app-navbar','app-shell'].includes(category))return profiles.navigation;
  if(['app-calendar','app-schedule'].includes(category))return profiles.calendar;
  if(['app-rich-text','app-whiteboard','app-flow'].includes(category))return profiles.editor;
  if(['app-notifications','app-empty-state'].includes(category))return profiles.feedback;
  if(chartCategories.has(category)||/chart/.test(collection))return profiles.chart;
  return profiles.content;
}

const evidenceByAxis={
  size:'근거: content.max-width·control.height·icon.size 토큰과 분류별 크기 정책. 실제 hit area·잘림은 미검증.',
  typography:'근거: body·label font-size의 4계층 연결과 한글 줄바꿈 정책. 실제 fallback·확대·IME는 미검증.',
  color:'근거: Light/Dark 색 역할의 4계층 연결과 회사 블루 정책. 실제 합성 대비와 모든 상태 조합은 미검증.',
  layout:'근거: 분류별 읽기 순서·재배치·스크롤 정책. 실제 DOM·Tab 순서와 sticky 충돌은 미검증.',
  spacing:'근거: section.gap·container.padding의 독립된 의미와 그룹화 정책. 실제 모든 밀도 조합은 미검증.',
  surface:'근거: surface.radius와 panel·border 역할 및 overlay 정책. 실제 stacking·Portal·가림은 미검증.',
  interaction:'근거: 분류별 상태·키보드·복구 계약. 실제 지원 브라우저·보조 기술·기기 조합은 미검증.'
};

/**
 * Returns display-ready adoption requirements. `implemented` only describes
 * catalog wiring; it never promotes a policy to verified browser evidence.
 * All returned arrays and rows are fresh so UI consumers may annotate locally.
 */
export function getBlockContract(block={}){
  const rightPanel=RIGHT_PANEL_EXAMPLES.find(e=>e.id===block.id);
  const panelRows=key=>[...RIGHT_PANEL_ADOPTION[key]];
  const dashboard=DASHBOARD_BLOCK_EXAMPLES.find(e=>e.id===block.id);
  const dashboardRows=key=>DASHBOARD_ADOPTION[key].map(pair=>pair[0]);
  const interaction=REFERENCE_COMPONENT_BLOCKS.find(e=>e.id===block.id);
  const timeline=TIMELINE_BLOCK_EXAMPLES.find(e=>e.id===block.id);
  const timelineRows=key=>TIMELINE_ADOPTION[key].map(pair=>pair[0]);
  const connector=FLOW_CONNECTOR_EXAMPLES.find(e=>e.id===block.id);
  const profile=interaction?{...profileFor(block),composition:[interaction.description],interaction:REFERENCE_COMPONENT_ADOPTION.interaction,keyboard:[REFERENCE_COMPONENT_ADOPTION.keyboard],responsive:[REFERENCE_COMPONENT_ADOPTION.responsive],states:[REFERENCE_COMPONENT_ADOPTION.states]}:rightPanel?{...profiles.overlay,composition:panelRows('composition'),interaction:panelRows('interaction')[0],keyboard:panelRows('keyboard'),responsive:panelRows('responsive'),states:panelRows('states')}:dashboard?{...profiles.chart,composition:dashboardRows('composition'),interaction:dashboardRows('interaction')[0],keyboard:dashboardRows('keyboard'),responsive:dashboardRows('responsive'),states:dashboardRows('states')}:connector?{...profiles.editor,composition:[connector.description],keyboard:['Tab으로 연결선과 노드를 이동하고 Enter·Space로 선택합니다. 관계 표의 버튼으로도 같은 선택을 제공합니다.','조정값은 range의 방향키로 변경하고 초기화·SVG·JSON 내보내기를 키보드로 실행합니다.'],states:['선택·선택 해제·조정값 변경·초기화·차단으로 인한 경로 없음·구독자 없음을 구분합니다.'],responsive:['2차원 다이어그램은 내부 가로 스크롤을 허용하고 관계 목록과 조정 컨트롤은 좁은 폭에서도 접근 가능하게 유지합니다.']}:timeline?{...profiles.gantt,composition:timelineRows('composition'),interaction:timelineRows('interaction')[0],keyboard:timelineRows('keyboard'),responsive:timelineRows('responsive'),states:timelineRows('states')}:profileFor(block),sourceFile=block.sourceFile||'출처 파일 경로 미제공';
  const requirements=['FR01','FR02','FR03','FR10','FR11','FR12','FR14','FR15','FR17','FR19','FR21','FR22','FR23','FR24','FR26','FR27','FR30','FR31','FR33',...profile.requirements];
  if(block.categoryId==='virtualization')requirements.push('FR20');
  if(block.categoryId==='drag-drop')requirements.push('FR32');
  const limits=[
    '각 디멘션의 상태는 정책 채택(policy-adopted)이다. 연결된 소스나 토큰이 존재한다는 사실을 실제 동작 검증 완료로 해석하지 않는다.',
    '실제 200% 브라우저 확대·스크린리더·한글 IME·forced-colors·물리 모바일 키보드는 미검증이다. 지원 환경별 결과와 예외 근거를 별도로 기록한다.',
    dashboard?'신규 대시보드의 미리보기와 소스는 사용자 제공 시각 참고를 KLIC 구조로 재해석한 로컬 예제입니다. 제품 데이터 연결은 별도 구현합니다.':interaction?'사용자 제공 상호작용 참고를 KLIC 토큰과 샘플 데이터로 재해석한 독립 구현입니다. 실제 업로드·로그 수신·CI 실행은 하지 않습니다.':'미리보기와 예제 코드는 제공 ZIP을 KLIC에 맞추는 구현 범위다. 제품 저장·인증·외부 연동·배포의 완료를 보장하지 않는다.'
  ];
  if(rightPanel)limits.push(...panelRows('limits'));
  if(timeline)limits.push(...timelineRows('limits'));
  if(dashboard)limits.push(...dashboardRows('limits'));
  if(interaction)limits.push(REFERENCE_COMPONENT_ADOPTION.limits);
  if(!block.implemented)limits.unshift('이 항목은 전용 구현이 연결되지 않은 카탈로그 예시다. 대체 미리보기를 해당 블록의 기능 검증으로 간주하지 않는다.');
  if(block.categoryId==='virtualization')limits.push('가상화 채택 시 추정·실측·재측정, 첫·중간·마지막 행 접근, 선택·편집·초점 보존을 FR20에 따라 별도로 검증해야 한다.');
  return {
    use:interaction?interaction.use:rightPanel?panelRows('use'):dashboard?[dashboard.use[0]]:connector?[connector.use]:timeline?timelineRows('use'):undefined,avoid:interaction?interaction.avoid:rightPanel?panelRows('avoid'):dashboard?[dashboard.avoid[0]]:connector?[connector.avoid]:timeline?timelineRows('avoid'):undefined,
    axes:AXES.map(axis=>({...axis,policy:profile[axis.id]||shared[axis.id],evidence:evidenceByAxis[axis.id],status:'policy-adopted'})),
    tokens:[...tokenRows.map(token=>({...token})),...(rightPanel?['default','wide'].map(size=>({path:'klic.component.block.right-panel.width.'+size,label:size==='wide'?'패널 확장 너비':'패널 기본 너비'})):[])],
    composition:[`${block.title||'블록'} · ${block.categoryName||block.categoryId||'애플리케이션'} 분류.`,...(dashboard?dashboardRows('composition'):profile.composition)],
    keyboard:[...(dashboard?dashboardRows('keyboard'):profile.keyboard),'모든 조작의 이름·보이는 초점·실제 target 경계를 확인한다. reduced-motion에서도 기능에 필요한 상태 안내를 유지한다.'],
    responsive:[...(dashboard?dashboardRows('responsive'):profile.responsive),'CSS viewport·실제 콘텐츠 컨테이너·사용자 확대·명시적 density를 별개의 시험 조건으로 기록한다.'],
    states:[...(dashboard?dashboardRows('states'):profile.states),'완료·성공은 블루와 체크·명시적 문구로 전달한다. hover가 selected·invalid·focus 의미를 지우지 않도록 한다.'],
    limits,
    source:[
      block.origin==='klic-native'?'기준: KLIC 독립 구현과 디자인 시스템.':'기준: 사용자 제공 Block Studio ZIP의 카탈로그·구현 소스와 KLIC 디자인 시스템 PRD v1.0.',
      block.implemented?`카탈로그에 전용 구현 연결: ${sourceFile}. 구현 연결은 브라우저 검증 결과와 별개다.`:`카탈로그 예시 항목: ${sourceFile}. 전용 구현 연결 여부는 미확정이다.`,
      'KLIC 신규 결정: 회사 블루·4계층 토큰 adapter·7 디멘션 채택 정책. ReUI 공식 배포본 설치 또는 전체 PRD 수용시험 완료를 뜻하지 않는다.'
    ],
    requirements:[...new Set(requirements)].sort((a,b)=>Number(a.slice(2))-Number(b.slice(2)))
  };
}
