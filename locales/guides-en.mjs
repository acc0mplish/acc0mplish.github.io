import {catalogMessages} from './catalog-en.mjs';
// Authored English behavior guidance. Compact templates mirror the native guide
// source contract without importing the component demo code into every preview.
const methods=[
 [
  "정적 안내는 note로 제공하고 동적으로 추가된 긴급 오류만 alert로 알립니다.",
  "Use note for static information and alert only for urgent errors added dynamically."
 ],
 [
  "native dialog로 배경을 비활성화하고 취소를 기본 초점으로 둡니다. 실제 삭제는 없습니다.",
  "Use a native dialog to make the background inert and focus Cancel initially. No actual deletion is performed."
 ],
 [
  "실제 id를 가진 문단으로 연결하며 scroll-margin으로 고정 헤더 가림을 줄입니다.",
  "Link to sections with real IDs and use scroll-margin to avoid obstruction by fixed headers."
 ],
 [
  "aspect-ratio로 미디어 영역을 예약하며 텍스트는 영역 밖에 유지합니다.",
  "Reserve the media area with aspect-ratio and keep text outside that area."
 ],
 [
  "native datalist 제안을 제공하되 목록 밖의 값도 입력할 수 있습니다.",
  "Provide native datalist suggestions while allowing values outside the list."
 ],
 [
  "생성한 가상 인물 레지스트리를 사용하고 설정의 사진 표시 여부를 따릅니다.",
  "Use the generated fictional-person registry and respect the photo visibility preference."
 ],
 [
  "서로 다른 인물 사진을 겹쳐 표시하고 각 이름을 접근 가능한 이름으로 제공합니다.",
  "Overlap distinct profile images and provide each person's accessible name."
 ],
 [
  "닫기 버튼에 접근 가능한 이름을 제공하고 닫힌 안내를 다시 표시할 수 있게 합니다.",
  "Give the dismiss button an accessible name and allow dismissed messages to be shown again."
 ],
 [
  "막대 높이는 샘플 수치와 연결하고 단위와 항목 이름을 별도로 표시합니다.",
  "Map bar heights to sample values and display units and category names separately."
 ],
 [
  "blockquote와 cite를 사용하고 작성자의 문장을 서비스 지시로 해석하지 않습니다.",
  "Use blockquote and cite; quoted text is content, not instructions to the service."
 ],
 [
  "nav 안의 실제 링크로 구성하고 아이콘과 텍스트를 함께 유지합니다.",
  "Use actual links inside nav and retain both icons and labels."
 ],
 [
  "이름 있는 nav와 ol을 사용하고 마지막 위치는 aria-current=page로 전달합니다.",
  "Use a named nav and ordered list; mark the current destination with aria-current=page."
 ],
 [
  "공통 테두리와 group 이름으로 묶고 각 버튼의 Tab 접근을 보존합니다.",
  "Group controls with a shared border and accessible group name while keeping each button in the Tab order."
 ],
 [
  "실제 요일 배치와 월별 일수를 계산하고 이전·다음 달 및 날짜 선택을 지원합니다.",
  "Calculate actual weekdays and month lengths; support previous/next month navigation and date selection."
 ],
 [
  "이전·다음 버튼으로 한 장씩 전환하고 자동 재생 없이 현재 순서를 알립니다.",
  "Move one item at a time with previous/next buttons and announce the position without autoplay."
 ],
 [
  "상위 부서가 바뀌면 하위 팀 옵션을 교체하고 첫 번째 유효값을 선택합니다.",
  "When the parent department changes, replace child team options and select the first valid value."
 ],
 [
  "제거 버튼에 어떤 조건을 해제하는지 알리고 마지막 항목 제거도 허용합니다.",
  "Name the filter removed by each button and allow the final filter to be removed."
 ],
 [
  "코드는 pre·code로 표현하고 복사 버튼은 해당 코드의 textContent만 복사합니다.",
  "Use pre and code for source; the copy action copies only that code's textContent."
 ],
 [
  "native details·summary로 하나의 영역을 접고 펼치며 열린 상태를 브라우저가 전달합니다.",
  "Use native details and summary to expand one section and let the browser expose its open state."
 ],
 [
  "블루 세 가지를 radio로 선택하고 실제 HEX 값과 미리보기를 갱신합니다.",
  "Select one of three blues using radio controls and update the actual HEX value and preview."
 ],
 [
  "입력값으로 옵션을 필터링하며 방향키·Enter·Escape로 선택하고 닫습니다.",
  "Filter options by input and support arrow keys, Enter, and Escape for selection and dismissal."
 ],
 [
  "검색어로 명령을 필터링하고 Enter로 첫 결과를 실행합니다. 외부 작업은 수행하지 않습니다.",
  "Filter commands by query and run the first result with Enter. No external action is performed."
 ],
 [
  "오른쪽 클릭과 눈에 보이는 메뉴 버튼을 모두 제공하고 native popover로 닫기를 처리합니다.",
  "Provide both right-click and a visible menu trigger; use native popover dismissal."
 ],
 [
  "native date 입력의 min과 max를 보존하고 운영체제 날짜 선택 UI를 사용합니다.",
  "Keep min and max on a native date input and use the operating system's date picker."
 ],
 [
  "종료일이 시작일보다 이르면 오류를 표시하고 종료일의 최소값도 갱신합니다.",
  "Show an error when the end precedes the start, and update the minimum end date."
 ],
 [
  "dl·dt·dd의 의미를 보존하고 좁은 화면에서는 한 열로 재배치합니다.",
  "Preserve dl, dt, and dd semantics and switch to one column on narrow screens."
 ],
 [
  "세그먼트는 실제 비율을 표현하며 범례에 수치와 백분율을 같이 표시합니다.",
  "Draw segments using actual proportions and show values and percentages in the legend."
 ],
 [
  "native popover와 일반 버튼 목록을 사용하며 가짜 ARIA menu 키보드 계약을 선언하지 않습니다.",
  "Use native popover with normal buttons; do not claim an ARIA menu keyboard contract that is not implemented."
 ],
 [
  "파일 드롭과 file input을 동일한 파일 목록으로 처리하며 페이지 이탈을 막습니다.",
  "Process dropped files and file input through the same list, preventing accidental page navigation."
 ],
 [
  "결과가 비어 있는 이유를 설명하고 첫 항목 추가 버튼으로 목록을 채웁니다.",
  "Explain why the result is empty and populate the list with a first-item action."
 ],
 [
  "실제 FileList를 읽어 이름·크기를 표시하며 외부 서버로 전송하지 않습니다.",
  "Read the actual FileList and show names and sizes without uploading to an external server."
 ],
 [
  "native 폼 검증을 통과한 이름·이메일만 로컬 결과에 표시하고 서버에는 전송하지 않습니다.",
  "Show locally only names and emails that pass native form validation; do not submit them to a server."
 ],
 [
  "클릭과 키보드로 여는 details를 제공해 포인터 호버에만 의존하지 않습니다.",
  "Provide details that opens by click or keyboard rather than relying on pointer hover alone."
 ],
 [
  "Lucide 아이콘은 장식이면 aria-hidden 처리하고 단독 버튼은 이름을 제공합니다.",
  "Hide decorative Lucide icons with aria-hidden and name icon-only buttons."
 ],
 [
  "로컬 원본 상품 이미지를 사용하고 alt와 실제 크기로 레이아웃 이동을 줄입니다.",
  "Use local product images with alt text and intrinsic dimensions to reduce layout shift."
 ],
 [
  "접두사는 편집값에 포함하지 않으며 도움말에서 전체 주소 형식을 설명합니다.",
  "Keep the prefix outside the editable value and explain the complete address format in help text."
 ],
 [
  "단일 input으로 붙여넣기를 지원하며 숫자 여섯 자리만 유지합니다.",
  "Support paste through one input and retain only six digits."
 ],
 [
  "kbd는 안내 정보이며 표시한 단축키를 전역으로 등록하지 않습니다.",
  "Use kbd as guidance; displayed shortcuts are not registered globally."
 ],
 [
  "실제 샘플 수치로 SVG 경로를 만들고 텍스트 데이터도 함께 제공합니다.",
  "Build the SVG path from actual sample values and provide equivalent text data."
 ],
 [
  "실제 href를 가진 a를 사용하고 새 창 이동은 레이블에도 알립니다.",
  "Use anchors with actual href values and announce new-window navigation in the label."
 ],
 [
  "ul·li로 항목을 묶고 각 항목의 부가 행동은 이름이 있는 버튼으로 제공합니다.",
  "Group items with ul and li and provide named buttons for secondary item actions."
 ],
 [
  "처리 중 컨트롤을 disabled로 전환하고 aria-busy와 완료 결과를 동기화합니다.",
  "Disable controls during processing and synchronize aria-busy with the completion result."
 ],
 [
  "제안 버튼으로 가상 인물 이름을 삽입하며 실제 알림은 전송하지 않습니다.",
  "Insert fictional names through suggestion buttons without sending actual notifications."
 ],
 [
  "native details와 버튼을 사용하며 OS형 menubar 역할이나 단축키 지원을 주장하지 않습니다.",
  "Use native details and buttons; do not claim OS-style menubar roles or shortcut support."
 ],
 [
  "체크박스를 독립적으로 선택하고 요약 레이블에 선택 개수를 반영합니다.",
  "Select checkboxes independently and show the selection count in the summary."
 ],
 [
  "실제 사이트 경로를 가진 nav 링크와 현재 위치 표기를 사용합니다.",
  "Use nav links to actual site routes and indicate the current location."
 ],
 [
  "읽음 버튼이 실제 상태와 미확인 개수를 갱신하며 외부 알림은 전송하지 않습니다.",
  "The read action updates local state and unread counts without sending external notifications."
 ],
 [
  "native number의 stepUp·stepDown을 사용하고 최소·최대 범위를 넘지 않습니다.",
  "Use native number stepUp and stepDown while respecting minimum and maximum values."
 ],
 [
  "실제 데이터 조각을 페이지별로 전환하고 첫·마지막 이동을 disabled로 제한합니다.",
  "Switch the actual data slice by page and disable navigation beyond the first or last page."
 ],
 [
  "표시 버튼은 input type만 바꾸고 값과 입력 포커스를 보존합니다.",
  "The reveal button changes only the input type, preserving its value and focus."
 ],
 [
  "native popover 안에서 취소·확인을 선택하고 결과를 원래 영역의 상태 문구에 표시합니다.",
  "Offer Cancel and Confirm inside a native popover and report the result in the original area's status text."
 ],
 [
  "같은 name의 radio를 fieldset·legend로 묶고 방향키 기본 동작을 유지합니다.",
  "Group same-name radio inputs with fieldset and legend and retain native arrow-key behavior."
 ],
 [
  "두 range에 각각 이름을 주고 시작 값이 종료 값을 넘지 않게 보정합니다.",
  "Name both range controls and constrain the start so it does not exceed the end."
 ],
 [
  "native radio로 1–5점을 선택하며 별 모양 이외에 숫자 레이블을 제공합니다.",
  "Use native radio inputs for ratings 1–5 and provide numeric labels as well as stars."
 ],
 [
  "native CSS resize와 키보드 조절 range를 같이 제공하며 최소·최대 폭을 제한합니다.",
  "Combine native CSS resize with a keyboard-accessible range and enforce width limits."
 ],
 [
  "완료는 블루와 체크 아이콘으로 표시하고 실제로 가능한 이동 링크를 제공합니다.",
  "Show completion using blue, a check icon, and a link to a real destination."
 ],
 [
  "이름 있는 region과 tabindex로 키보드 스크롤을 지원하며 전체 페이지 폭을 늘리지 않습니다.",
  "Use a named region with tabindex for keyboard scrolling without expanding the whole page."
 ],
 [
  "프로젝트 이름으로 목록을 필터링하고 결과 수와 결과 없음을 알립니다.",
  "Filter by project name and announce the result count or empty result."
 ],
 [
  "서로 배타적인 native radio를 사용하고 선택값을 안내 문구에 반영합니다.",
  "Use mutually exclusive native radio controls and reflect the chosen value in supporting text."
 ],
 [
  "내용 주제가 바뀔 때 hr을 사용하고 장식용 간격은 CSS로 처리합니다.",
  "Use hr for a thematic break and CSS for purely decorative spacing."
 ],
 [
  "aria-busy 컨테이너 안에 장식용 골격을 두고 로드 버튼으로 실제 내용을 표시합니다.",
  "Place decorative skeletons inside an aria-busy container and reveal actual content with the load action."
 ],
 [
  "native range의 min·max·step을 유지하고 output에 실제 수치를 동기화합니다.",
  "Keep native range min, max, and step values and synchronize the actual value with output."
 ],
 [
  "작은 SVG에도 기간과 시작·마지막 수치를 텍스트로 제공해 색상 의존을 줄입니다.",
  "Include the period and starting and ending values as text even for a small SVG."
 ],
 [
  "status 문구를 함께 제공하고 reduced-motion에서는 회전을 멈춥니다.",
  "Provide a status message and stop rotation when reduced motion is requested."
 ],
 [
  "range로 분할 비율을 조절하고 양쪽 콘텐츠는 각 패널 안에서 줄바꿈합니다.",
  "Adjust the split ratio with a range control and wrap content within each pane."
 ],
 [
  "값·단위·기준 기간을 명시하며 변화량은 텍스트와 아이콘으로 구별합니다.",
  "State the value, unit, and reference period; distinguish changes with text and icons."
 ],
 [
  "현재 패널만 표시하고 다음 이동 전에 해당 단계 필수 입력을 검증합니다.",
  "Show only the current panel and validate required fields before moving to the next step."
 ],
 [
  "ol 순서를 유지하고 현재 단계에 aria-current=step을 지정하며 버튼으로 진행합니다.",
  "Keep the ordered-list sequence, mark aria-current=step, and advance using a button."
 ],
 [
  "정적 분류 레이블은 버튼처럼 보이지 않게 하고 조작이 필요하면 chip을 사용합니다.",
  "Do not style static category labels as buttons; use a chip when interaction is required."
 ],
 [
  "Enter로 중복 없는 태그를 추가하고 각 제거 버튼에 대상 이름을 제공합니다.",
  "Add unique tags with Enter and name the target of each removal button."
 ],
 [
  "maxlength와 글자 수 안내를 연결하며 사용자가 높이를 조절할 수 있게 합니다.",
  "Connect maxlength to the character count and allow users to resize the field height."
 ],
 [
  "native time 입력을 사용하고 step을 초 단위로 지정합니다.",
  "Use a native time input and specify step in seconds."
 ],
 [
  "ol·time으로 순서와 날짜를 보존하며 최신순 여부를 제목에서 설명합니다.",
  "Preserve order and dates with ol and time; explain the sort direction in the heading."
 ],
 [
  "aria-pressed를 실제 선택 상태와 동기화하며 재클릭으로 해제합니다.",
  "Synchronize aria-pressed with the selected state and allow a second click to deselect."
 ],
 [
  "각 버튼의 aria-pressed를 독립적으로 관리하고 하나 이상을 강제하지 않습니다.",
  "Manage each button's aria-pressed independently without requiring a selection."
 ],
 [
  "문서 명령과 보기 옵션을 나눠 배치합니다. 명령은 실행 결과를 알리고 보기 토글은 누름 상태를 유지합니다. native Tab 순서로 각 도구를 탐색합니다.",
  "Separate document commands from view options. Commands announce results, view toggles retain their pressed state, and native Tab order reaches each tool."
 ],
 [
  "버튼 focus와 hover에 설명을 제공하며 Escape로 닫고 단독 정보 저장소로 쓰지 않습니다.",
  "Show help on focus and hover, dismiss with Escape, and do not place essential information only in the tooltip."
 ],
 [
  "선택된 체크박스 항목만 반대 목록으로 옮기고 선택 상태를 해제합니다.",
  "Move only checked items to the other list and clear their selection."
 ],
 [
  "nested details로 구현해 펼침 상태와 키보드 기본 동작을 브라우저가 처리합니다.",
  "Use nested details so the browser manages expanded state and native keyboard behavior."
 ],
 [
  "details로 폴더를 펼치고 같은 name의 radio로 최종 항목을 선택합니다.",
  "Expand folders with details and select the final item with same-name radio controls."
 ],
 [
  "제목·본문·보조 정보를 의미 있는 HTML로 구분하고 사용자 글자 배율을 따릅니다.",
  "Distinguish headings, body text, and supporting content with semantic HTML and respect the user's text scale."
 ],
 [
  "반복 워터마크는 장식으로 숨기고 문서의 실제 분류 문구는 본문에도 표시합니다.",
  "Hide repeated decorative watermarks from assistive technology and include the document classification in the body."
 ]
];
const components=[
 [
  "폼",
  "Form",
  "필드와 검증을 하나의 제출 흐름으로.",
  31
 ],
 [
  "여러 줄 입력",
  "Textarea",
  "긴 설명을 편안하게 작성하는 입력 영역.",
  70
 ],
 [
  "단일 선택",
  "Radio Group",
  "서로 배타적인 선택지를 한눈에 비교.",
  51
 ],
 [
  "슬라이더",
  "Slider",
  "연속된 값을 직관적으로 조절하세요.",
  61
 ],
 [
  "범위 슬라이더",
  "Range Slider",
  "최솟값과 최댓값 사이의 구간 선택.",
  52
 ],
 [
  "토글 버튼",
  "Toggle",
  "눌린 상태가 남는 독립적인 버튼.",
  73
 ],
 [
  "복수 토글",
  "Toggle Group",
  "여러 표시 옵션을 독립적으로 선택.",
  74
 ],
 [
  "분할 선택",
  "Segmented Control",
  "가까운 선택지 사이를 빠르게 전환.",
  58
 ],
 [
  "검색형 선택",
  "Combobox",
  "입력하면서 좁히는 프로젝트 목록.",
  20
 ],
 [
  "자동완성",
  "Autocomplete",
  "자유로운 입력에 익숙한 후보를 더하기.",
  4
 ],
 [
  "다중 선택",
  "Multi Select",
  "필요한 항목을 여러 개 골라 담기.",
  44
 ],
 [
  "날짜 선택",
  "Date Picker",
  "일정을 정확한 날짜로 지정하세요.",
  23
 ],
 [
  "기간 선택",
  "Date Range Picker",
  "시작일과 종료일이 분명한 기간 입력.",
  24
 ],
 [
  "시간 선택",
  "Time Picker",
  "시·분 단위로 약속의 시간을 정하기.",
  71
 ],
 [
  "수량 입력",
  "Number Input",
  "직접 입력과 증감 버튼을 함께.",
  47
 ],
 [
  "인증번호 입력",
  "Input OTP",
  "여섯 자리 번호를 한 번에 붙여넣기.",
  36
 ],
 [
  "비밀번호 입력",
  "Password Input",
  "가림과 확인을 사용자가 직접 선택.",
  49
 ],
 [
  "검색 입력",
  "Search Input",
  "실제 목록과 연결되는 빠른 검색.",
  57
 ],
 [
  "입력 그룹",
  "Input Group",
  "주소의 앞뒤 맥락을 입력에 연결.",
  35
 ],
 [
  "파일 선택",
  "File Upload",
  "선택한 파일의 이름과 크기를 확인.",
  30
 ],
 [
  "파일 드롭 영역",
  "Dropzone",
  "끌어 놓기와 키보드 선택을 함께.",
  28
 ],
 [
  "별점 선택",
  "Rating",
  "점수마다 의미가 있는 평가.",
  53
 ],
 [
  "브랜드 컬러 선택",
  "Color Picker",
  "회사 블루 안에서 고르는 강조색.",
  19
 ],
 [
  "태그 입력",
  "Tag Input",
  "짧은 키워드를 추가하고 지우기.",
  69
 ],
 [
  "사용자 멘션",
  "Mentions",
  "작성 중인 문장에 담당자를 연결.",
  42
 ],
 [
  "항목 이동",
  "Transfer",
  "두 목록 사이에서 선택을 옮기기.",
  77
 ],
 [
  "계층 선택",
  "Tree Select",
  "폴더 구조를 보며 하나를 선택.",
  79
 ],
 [
  "연동 선택",
  "Cascader",
  "상위 선택에 맞춰 바뀌는 하위 목록.",
  15
 ],
 [
  "프로필 사진",
  "Avatar",
  "같은 사람을 어디서나 같은 얼굴로.",
  5
 ],
 [
  "프로필 그룹",
  "Avatar Group",
  "함께하는 사람과 참여 인원 표시.",
  6
 ],
 [
  "타이포그래피",
  "Typography",
  "읽기 순서가 선명한 글의 위계.",
  80
 ],
 [
  "선 차트",
  "Line Chart",
  "시간에 따른 변화와 방향을 읽기.",
  38
 ],
 [
  "막대 차트",
  "Bar Chart",
  "같은 기준에서 비교하는 항목별 값.",
  8
 ],
 [
  "텍스트 링크",
  "Link",
  "이동할 목적지를 분명하게 알리기.",
  39
 ],
 [
  "인용문",
  "Blockquote",
  "출처와 함께 남기는 중요한 문장.",
  9
 ],
 [
  "코드 블록",
  "Code Block",
  "읽고 복사할 수 있는 코드 조각.",
  17
 ],
 [
  "도넛 차트",
  "Donut Chart",
  "전체 중 각 항목이 차지하는 비중.",
  26
 ],
 [
  "키보드 단축키",
  "Kbd",
  "조작 방법을 작고 분명하게 안내.",
  37
 ],
 [
  "구분선",
  "Separator",
  "정보 사이에 필요한 쉼표.",
  59
 ],
 [
  "화면 비율",
  "Aspect Ratio",
  "콘텐츠가 바뀌어도 유지되는 비율.",
  3
 ],
 [
  "이미지",
  "Image",
  "원본 콘텐츠가 보이는 이미지 영역.",
  34
 ],
 [
  "캐러셀",
  "Carousel",
  "순서를 넘기며 살펴보는 이미지 모음.",
  14
 ],
 [
  "로딩 자리표시자",
  "Skeleton",
  "불러올 콘텐츠의 구조를 먼저.",
  60
 ],
 [
  "로딩 표시",
  "Spinner",
  "처리 중임을 알리는 회전 표시.",
  63
 ],
 [
  "통계 수치",
  "Statistic",
  "수치의 단위와 비교 기준을 함께.",
  65
 ],
 [
  "상세 정보",
  "Descriptions",
  "이름과 값으로 정리한 속성 정보.",
  25
 ],
 [
  "목록",
  "List",
  "서로 관련된 정보를 차례대로.",
  40
 ],
 [
  "타임라인",
  "Timeline",
  "시간 순으로 읽는 활동과 기록.",
  72
 ],
 [
  "트리",
  "Tree",
  "펼쳐보며 이해하는 파일 구조.",
  78
 ],
 [
  "캘린더",
  "Calendar",
  "월별 날짜와 선택한 하루를 함께.",
  13
 ],
 [
  "빈 상태",
  "Empty State",
  "내용이 없을 때도 다음 행동을 제안.",
  29
 ],
 [
  "결과 안내",
  "Result",
  "완료 여부와 다음 단계가 명확하게.",
  55
 ],
 [
  "태그",
  "Tag",
  "정보를 분류하는 짧은 키워드.",
  68
 ],
 [
  "제거형 칩",
  "Chip",
  "선택한 조건을 표시하고 해제하기.",
  16
 ],
 [
  "스파크라인",
  "Sparkline",
  "수치 옆에서 읽는 짧은 추세.",
  62
 ],
 [
  "아이콘",
  "Icon",
  "행동의 의미를 보완하는 시각 기호.",
  33
 ],
 [
  "스크롤 영역",
  "Scroll Area",
  "넘치는 정보의 스크롤을 한곳에.",
  56
 ],
 [
  "크기 조절",
  "Resizable",
  "사용자가 넓히는 작업 영역.",
  54
 ],
 [
  "분할 패널",
  "Splitter",
  "두 작업 공간 사이의 폭을 조절.",
  64
 ],
 [
  "워터마크",
  "Watermark",
  "콘텐츠를 가리지 않는 문서 식별.",
  81
 ],
 [
  "인라인 알림",
  "Alert",
  "현재 맥락에서 읽는 중요한 안내.",
  0
 ],
 [
  "확인 대화상자",
  "Alert Dialog",
  "되돌리기 어려운 행동을 다시 확인.",
  1
 ],
 [
  "도움말 풍선",
  "Tooltip",
  "포커스와 호버로 확인하는 짧은 도움말.",
  76
 ],
 [
  "상세 정보 카드",
  "Hover Card",
  "이름 옆에서 확인하는 사람의 맥락.",
  32
 ],
 [
  "드롭다운 메뉴",
  "Dropdown Menu",
  "한곳에 모아둔 관련 행동.",
  27
 ],
 [
  "컨텍스트 메뉴",
  "Context Menu",
  "선택한 항목에 맞는 바로가기 행동.",
  22
 ],
 [
  "명령 검색",
  "Command",
  "이름으로 빠르게 찾고 실행하는 명령.",
  21
 ],
 [
  "알림 센터",
  "Notification",
  "읽음과 읽지 않음을 구별하는 소식.",
  46
 ],
 [
  "상단 배너",
  "Banner",
  "화면 전체에 관련된 소식을 한 줄로.",
  7
 ],
 [
  "간단 확인",
  "Popconfirm",
  "행동 근처에서 확인하고 실행하기.",
  50
 ],
 [
  "영역 로딩",
  "Loading Overlay",
  "작업 중인 영역만 잠시 보호.",
  41
 ],
 [
  "이동 경로",
  "Breadcrumb",
  "현재 위치까지 이어지는 길.",
  11
 ],
 [
  "페이지 이동",
  "Pagination",
  "목록의 앞뒤와 현재 페이지를 함께.",
  48
 ],
 [
  "메뉴 막대",
  "Menubar",
  "자주 쓰는 명령을 주제별로 묶기.",
  43
 ],
 [
  "상단 탐색",
  "Navigation Menu",
  "주요 섹션으로 이어지는 분명한 입구.",
  45
 ],
 [
  "단계 표시",
  "Steps",
  "완료·현재·다음을 순서대로.",
  67
 ],
 [
  "단계별 폼",
  "Stepper",
  "한 번에 하나씩 완료하는 입력 흐름.",
  66
 ],
 [
  "본문 목차",
  "Anchor",
  "긴 내용 속 필요한 위치로 이동.",
  2
 ],
 [
  "하단 탐색",
  "Bottom Navigation",
  "모바일에서 손에 가까운 주요 메뉴.",
  10
 ],
 [
  "도구 모음",
  "Toolbar",
  "현재 선택한 콘텐츠를 위한 도구.",
  75
 ],
 [
  "버튼 그룹",
  "Button Group",
  "연관된 행동을 하나의 묶음으로.",
  12
 ],
 [
  "접이식 영역",
  "Collapsible",
  "하나의 보조 영역을 열고 닫기.",
  18
 ]
];
export const guideMessages=Object.fromEntries(methods);
for(const [ko,name,description,index]of components){
 const [rule,method]=methods[index],desc=catalogMessages[description];
 Object.assign(guideMessages,{
  [description+' '+rule]:desc+' '+method,
  ['이 사이트에서 직접 작성한 native HTML·CSS·DOM 예제입니다. '+rule+' 외부 패키지의 props 또는 서버 연동을 제공한다고 선언하지 않습니다.']:'This native HTML, CSS, and DOM example was authored for this site. '+method+' It does not provide external-package props or server integration.',
  [ko+'의 용도: '+description+' 제품 맥락과 상태 조건을 확인해 적용합니다.']:'Use '+name+' in product interfaces that need this behavior: '+desc,
  [ko+'의 목적을 설명하는 레이블 또는 제목']:'A label or heading explaining the purpose of '+name,
  ['실제 '+ko+' 구조와 브라우저 동작을 확인합니다.']:'Inspect the actual '+name+' structure and browser behavior.',
  [ko+'의 목적과 현재 상태를 알 수 있도록 제목·설명을 함께 배치합니다. '+rule]:'Include a title and description so the purpose and current state of '+name+' are clear. '+method,
  ['부모의 가용 폭 안에서 배치하고 고정 canvas 폭을 강제하지 않습니다. '+ko+'의 내용에 맞춰 높이를 확장합니다.']:"Lay out within the parent's available width rather than forcing a fixed canvas. Expand the height to fit "+name+' content.',
  ['이 예제의 DOM 순서를 시각적 읽기 순서와 맞춥니다. '+rule]:'Match the DOM order to the visual reading order. '+method,
  ['이 컴포넌트의 동작 계약: '+rule]:'Behavior contract for this component: '+method,
  [ko+'의 주요 역할 값']:name+' principal role value'
 });
}
