import {renderAvatar} from './avatars.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ic=n=>'<i data-lucide="'+n+'" aria-hidden="true"></i>';
// Independently authored native implementations. External references inform scope, not styling or package APIs.
const rows=[
['form','Form','폼','input','필드와 검증을 하나의 제출 흐름으로.','native 폼 검증을 통과한 이름·이메일만 로컬 결과에 표시하고 서버에는 전송하지 않습니다.','required / type / submit','boolean / email / event','true / email / local'],
['textarea','Textarea','여러 줄 입력','input','긴 설명을 편안하게 작성하는 입력 영역.','maxlength와 글자 수 안내를 연결하며 사용자가 높이를 조절할 수 있게 합니다.','rows / maxlength','number','4 / 240'],
['radio-group','Radio Group','단일 선택','input','서로 배타적인 선택지를 한눈에 비교.','같은 name의 radio를 fieldset·legend로 묶고 방향키 기본 동작을 유지합니다.','name / checked','string / boolean','plan / false'],
['slider','Slider','슬라이더','input','연속된 값을 직관적으로 조절하세요.','native range의 min·max·step을 유지하고 output에 실제 수치를 동기화합니다.','min / max / step','number','0 / 100 / 5'],
['range-slider','Range Slider','범위 슬라이더','input','최솟값과 최댓값 사이의 구간 선택.','두 range에 각각 이름을 주고 시작 값이 종료 값을 넘지 않게 보정합니다.','data-range','start | end','start'],
['toggle','Toggle','토글 버튼','input','눌린 상태가 남는 독립적인 버튼.','aria-pressed를 실제 선택 상태와 동기화하며 재클릭으로 해제합니다.','aria-pressed','boolean','false'],
['toggle-group','Toggle Group','복수 토글','input','여러 표시 옵션을 독립적으로 선택.','각 버튼의 aria-pressed를 독립적으로 관리하고 하나 이상을 강제하지 않습니다.','aria-pressed','boolean','false'],
['segmented-control','Segmented Control','분할 선택','input','가까운 선택지 사이를 빠르게 전환.','서로 배타적인 native radio를 사용하고 선택값을 안내 문구에 반영합니다.','name / value','string','view / week'],
['combobox','Combobox','검색형 선택','input','입력하면서 좁히는 프로젝트 목록.','입력값으로 옵션을 필터링하며 방향키·Enter·Escape로 선택하고 닫습니다.','role / aria-expanded','combobox / boolean','combobox / false'],
['autocomplete','Autocomplete','자동완성','input','자유로운 입력에 익숙한 후보를 더하기.','native datalist 제안을 제공하되 목록 밖의 값도 입력할 수 있습니다.','list','element id','suggestions'],
['multi-select','Multi Select','다중 선택','input','필요한 항목을 여러 개 골라 담기.','체크박스를 독립적으로 선택하고 요약 레이블에 선택 개수를 반영합니다.','type / checked','checkbox / boolean','checkbox / false'],
['date-picker','Date Picker','날짜 선택','input','일정을 정확한 날짜로 지정하세요.','native date 입력의 min과 max를 보존하고 운영체제 날짜 선택 UI를 사용합니다.','type / min / max','date / ISO date','date / 2026-01-01 / 2027-12-31'],
['date-range-picker','Date Range Picker','기간 선택','input','시작일과 종료일이 분명한 기간 입력.','종료일이 시작일보다 이르면 오류를 표시하고 종료일의 최소값도 갱신합니다.','type / min','date / ISO date','date / 시작일'],
['time-picker','Time Picker','시간 선택','input','시·분 단위로 약속의 시간을 정하기.','native time 입력을 사용하고 step을 초 단위로 지정합니다.','type / step','time / seconds','time / 900'],
['number-input','Number Input','수량 입력','input','직접 입력과 증감 버튼을 함께.','native number의 stepUp·stepDown을 사용하고 최소·최대 범위를 넘지 않습니다.','min / max / step','number','1 / 20 / 1'],
['input-otp','Input OTP','인증번호 입력','input','여섯 자리 번호를 한 번에 붙여넣기.','단일 input으로 붙여넣기를 지원하며 숫자 여섯 자리만 유지합니다.','inputmode / maxlength','numeric / number','numeric / 6'],
['password-input','Password Input','비밀번호 입력','input','가림과 확인을 사용자가 직접 선택.','표시 버튼은 input type만 바꾸고 값과 입력 포커스를 보존합니다.','type / autocomplete','password | text / string','password / new-password'],
['search-input','Search Input','검색 입력','input','실제 목록과 연결되는 빠른 검색.','프로젝트 이름으로 목록을 필터링하고 결과 수와 결과 없음을 알립니다.','type / data-filter','search / attribute','search / project'],
['input-group','Input Group','입력 그룹','input','주소의 앞뒤 맥락을 입력에 연결.','접두사는 편집값에 포함하지 않으며 도움말에서 전체 주소 형식을 설명합니다.','aria-describedby','id list','address-hint'],
['file-upload','File Upload','파일 선택','input','선택한 파일의 이름과 크기를 확인.','실제 FileList를 읽어 이름·크기를 표시하며 외부 서버로 전송하지 않습니다.','type / multiple','file / boolean','file / true'],
['dropzone','Dropzone','파일 드롭 영역','input','끌어 놓기와 키보드 선택을 함께.','파일 드롭과 file input을 동일한 파일 목록으로 처리하며 페이지 이탈을 막습니다.','data-dropzone','DOM drop target','로컬 파일 선택'],
['rating','Rating','별점 선택','input','점수마다 의미가 있는 평가.','native radio로 1–5점을 선택하며 별 모양 이외에 숫자 레이블을 제공합니다.','name / value','string / 1–5','rating / 4'],
['color-picker','Color Picker','브랜드 컬러 선택','input','회사 블루 안에서 고르는 강조색.','블루 세 가지를 radio로 선택하고 실제 HEX 값과 미리보기를 갱신합니다.','value','hex color','#245fc2'],
['tag-input','Tag Input','태그 입력','input','짧은 키워드를 추가하고 지우기.','Enter로 중복 없는 태그를 추가하고 각 제거 버튼에 대상 이름을 제공합니다.','maxlength / data-tags','number / container','24 / local'],
['mentions','Mentions','사용자 멘션','input','작성 중인 문장에 담당자를 연결.','제안 버튼으로 가상 인물 이름을 삽입하며 실제 알림은 전송하지 않습니다.','data-mention','string','@김하늘'],
['transfer','Transfer','항목 이동','input','두 목록 사이에서 선택을 옮기기.','선택된 체크박스 항목만 반대 목록으로 옮기고 선택 상태를 해제합니다.','data-transfer','left | right','right'],
['tree-select','Tree Select','계층 선택','input','폴더 구조를 보며 하나를 선택.','details로 폴더를 펼치고 같은 name의 radio로 최종 항목을 선택합니다.','name / value','string','folder / design'],
['cascader','Cascader','연동 선택','input','상위 선택에 맞춰 바뀌는 하위 목록.','상위 부서가 바뀌면 하위 팀 옵션을 교체하고 첫 번째 유효값을 선택합니다.','data-cascade','department | team','department'],
['avatar','Avatar','프로필 사진','display','같은 사람을 어디서나 같은 얼굴로.','생성한 가상 인물 레지스트리를 사용하고 설정의 사진 표시 여부를 따릅니다.','data-avatars','boolean','true'],
['avatar-group','Avatar Group','프로필 그룹','display','함께하는 사람과 참여 인원 표시.','서로 다른 인물 사진을 겹쳐 표시하고 각 이름을 접근 가능한 이름으로 제공합니다.','aria-label','string','프로젝트 참여자'],
['typography','Typography','타이포그래피','display','읽기 순서가 선명한 글의 위계.','제목·본문·보조 정보를 의미 있는 HTML로 구분하고 사용자 글자 배율을 따릅니다.','h3 / p / small','HTML elements','문서 위계'],
['line-chart','Line Chart','선 차트','display','시간에 따른 변화와 방향을 읽기.','실제 샘플 수치로 SVG 경로를 만들고 텍스트 데이터도 함께 제공합니다.','data-chart / viewBox','line / SVG coordinates','line / 0 0 260 100'],
['bar-chart','Bar Chart','막대 차트','display','같은 기준에서 비교하는 항목별 값.','막대 높이는 샘플 수치와 연결하고 단위와 항목 이름을 별도로 표시합니다.','data-chart','bar','bar'],
['link','Link','텍스트 링크','display','이동할 목적지를 분명하게 알리기.','실제 href를 가진 a를 사용하고 새 창 이동은 레이블에도 알립니다.','href / target','URL / browsing context','#tokens / _self'],
['blockquote','Blockquote','인용문','display','출처와 함께 남기는 중요한 문장.','blockquote와 cite를 사용하고 작성자의 문장을 서비스 지시로 해석하지 않습니다.','blockquote / cite','HTML elements','인용과 출처'],
['code-block','Code Block','코드 블록','display','읽고 복사할 수 있는 코드 조각.','코드는 pre·code로 표현하고 복사 버튼은 해당 코드의 textContent만 복사합니다.','data-cmp-action','copy','copy'],
['donut-chart','Donut Chart','도넛 차트','display','전체 중 각 항목이 차지하는 비중.','세그먼트는 실제 비율을 표현하며 범례에 수치와 백분율을 같이 표시합니다.','data-chart','donut','donut'],
['kbd','Kbd','키보드 단축키','display','조작 방법을 작고 분명하게 안내.','kbd는 안내 정보이며 표시한 단축키를 전역으로 등록하지 않습니다.','kbd','HTML element','단축키 안내'],
['separator','Separator','구분선','display','정보 사이에 필요한 쉼표.','내용 주제가 바뀔 때 hr을 사용하고 장식용 간격은 CSS로 처리합니다.','hr / aria-orientation','element / horizontal','horizontal'],
['aspect-ratio','Aspect Ratio','화면 비율','display','콘텐츠가 바뀌어도 유지되는 비율.','aspect-ratio로 미디어 영역을 예약하며 텍스트는 영역 밖에 유지합니다.','aspect-ratio','CSS ratio','16 / 9'],
['image','Image','이미지','display','원본 콘텐츠가 보이는 이미지 영역.','로컬 원본 상품 이미지를 사용하고 alt와 실제 크기로 레이아웃 이동을 줄입니다.','src / alt / loading','URL / string / enum','로컬 WebP / 설명 / lazy'],
['carousel','Carousel','캐러셀','display','순서를 넘기며 살펴보는 이미지 모음.','이전·다음 버튼으로 한 장씩 전환하고 자동 재생 없이 현재 순서를 알립니다.','data-carousel','integer index','0'],
['skeleton','Skeleton','로딩 자리표시자','display','불러올 콘텐츠의 구조를 먼저.','aria-busy 컨테이너 안에 장식용 골격을 두고 로드 버튼으로 실제 내용을 표시합니다.','aria-busy','boolean','true'],
['spinner','Spinner','로딩 표시','display','처리 중임을 알리는 회전 표시.','status 문구를 함께 제공하고 reduced-motion에서는 회전을 멈춥니다.','role / aria-live','status / polite','status / polite'],
['statistic','Statistic','통계 수치','display','수치의 단위와 비교 기준을 함께.','값·단위·기준 기간을 명시하며 변화량은 텍스트와 아이콘으로 구별합니다.','data-statistic','numeric text','128'],
['descriptions','Descriptions','상세 정보','display','이름과 값으로 정리한 속성 정보.','dl·dt·dd의 의미를 보존하고 좁은 화면에서는 한 열로 재배치합니다.','dl / dt / dd','HTML elements','속성–값 구조'],
['list','List','목록','display','서로 관련된 정보를 차례대로.','ul·li로 항목을 묶고 각 항목의 부가 행동은 이름이 있는 버튼으로 제공합니다.','ul / li','HTML elements','비순서 목록'],
['timeline','Timeline','타임라인','display','시간 순으로 읽는 활동과 기록.','ol·time으로 순서와 날짜를 보존하며 최신순 여부를 제목에서 설명합니다.','datetime','ISO date','2026-10-24'],
['tree','Tree','트리','display','펼쳐보며 이해하는 파일 구조.','nested details로 구현해 펼침 상태와 키보드 기본 동작을 브라우저가 처리합니다.','open','boolean','첫 폴더 true'],
['calendar','Calendar','캘린더','display','월별 날짜와 선택한 하루를 함께.','실제 요일 배치와 월별 일수를 계산하고 이전·다음 달 및 날짜 선택을 지원합니다.','data-calendar-month','YYYY-MM','2026-10'],
['empty-state','Empty State','빈 상태','display','내용이 없을 때도 다음 행동을 제안.','결과가 비어 있는 이유를 설명하고 첫 항목 추가 버튼으로 목록을 채웁니다.','data-cmp-action','create-item','create-item'],
['result','Result','결과 안내','display','완료 여부와 다음 단계가 명확하게.','완료는 블루와 체크 아이콘으로 표시하고 실제로 가능한 이동 링크를 제공합니다.','role','status','status'],
['tag','Tag','태그','display','정보를 분류하는 짧은 키워드.','정적 분류 레이블은 버튼처럼 보이지 않게 하고 조작이 필요하면 chip을 사용합니다.','class','x-tag','x-tag'],
['chip','Chip','제거형 칩','display','선택한 조건을 표시하고 해제하기.','제거 버튼에 어떤 조건을 해제하는지 알리고 마지막 항목 제거도 허용합니다.','data-cmp-action','remove-chip','remove-chip'],
['sparkline','Sparkline','스파크라인','display','수치 옆에서 읽는 짧은 추세.','작은 SVG에도 기간과 시작·마지막 수치를 텍스트로 제공해 색상 의존을 줄입니다.','viewBox / aria-label','SVG / string','0 0 180 50 / 주간 추세'],
['icon','Icon','아이콘','display','행동의 의미를 보완하는 시각 기호.','Lucide 아이콘은 장식이면 aria-hidden 처리하고 단독 버튼은 이름을 제공합니다.','data-lucide / aria-hidden','icon name / boolean','folder / true'],
['scroll-area','Scroll Area','스크롤 영역','display','넘치는 정보의 스크롤을 한곳에.','이름 있는 region과 tabindex로 키보드 스크롤을 지원하며 전체 페이지 폭을 늘리지 않습니다.','overflow / tabindex','auto / 0','auto / 0'],
['resizable','Resizable','크기 조절','display','사용자가 넓히는 작업 영역.','native CSS resize와 키보드 조절 range를 같이 제공하며 최소·최대 폭을 제한합니다.','resize / min-width','CSS / length','horizontal / 140px'],
['splitter','Splitter','분할 패널','display','두 작업 공간 사이의 폭을 조절.','range로 분할 비율을 조절하고 양쪽 콘텐츠는 각 패널 안에서 줄바꿈합니다.','data-split / min / max','percentage / number','45 / 25 / 75'],
['watermark','Watermark','워터마크','display','콘텐츠를 가리지 않는 문서 식별.','반복 워터마크는 장식으로 숨기고 문서의 실제 분류 문구는 본문에도 표시합니다.','aria-hidden / pointer-events','boolean / none','true / none'],
['alert','Alert','인라인 알림','feedback','현재 맥락에서 읽는 중요한 안내.','정적 안내는 note로 제공하고 동적으로 추가된 긴급 오류만 alert로 알립니다.','role','note','note'],
['alert-dialog','Alert Dialog','확인 대화상자','feedback','되돌리기 어려운 행동을 다시 확인.','native dialog로 배경을 비활성화하고 취소를 기본 초점으로 둡니다. 실제 삭제는 없습니다.','showModal / returnValue','DOM method / string','취소 / confirm'],
['tooltip','Tooltip','도움말 풍선','feedback','포커스와 호버로 확인하는 짧은 도움말.','버튼 focus와 hover에 설명을 제공하며 Escape로 닫고 단독 정보 저장소로 쓰지 않습니다.','role / aria-describedby','tooltip / id','tooltip / 설명 ID'],
['hover-card','Hover Card','상세 정보 카드','feedback','이름 옆에서 확인하는 사람의 맥락.','클릭과 키보드로 여는 details를 제공해 포인터 호버에만 의존하지 않습니다.','details / summary','HTML elements','closed'],
['dropdown-menu','Dropdown Menu','드롭다운 메뉴','feedback','한곳에 모아둔 관련 행동.','native popover와 일반 버튼 목록을 사용하며 가짜 ARIA menu 키보드 계약을 선언하지 않습니다.','popover / popovertarget','auto / id','auto / options'],
['context-menu','Context Menu','컨텍스트 메뉴','feedback','선택한 항목에 맞는 바로가기 행동.','오른쪽 클릭과 눈에 보이는 메뉴 버튼을 모두 제공하고 native popover로 닫기를 처리합니다.','contextmenu / popover','DOM event / auto','로컬 파일 메뉴'],
['command','Command','명령 검색','feedback','이름으로 빠르게 찾고 실행하는 명령.','검색어로 명령을 필터링하고 Enter로 첫 결과를 실행합니다. 외부 작업은 수행하지 않습니다.','type / data-command-query','search / filter','search / 로컬 명령'],
['notification','Notification','알림 센터','feedback','읽음과 읽지 않음을 구별하는 소식.','읽음 버튼이 실제 상태와 미확인 개수를 갱신하며 외부 알림은 전송하지 않습니다.','data-unread','boolean','true'],
['banner','Banner','상단 배너','feedback','화면 전체에 관련된 소식을 한 줄로.','닫기 버튼에 접근 가능한 이름을 제공하고 닫힌 안내를 다시 표시할 수 있게 합니다.','data-cmp-action','dismiss-banner','dismiss-banner'],
['popconfirm','Popconfirm','간단 확인','feedback','행동 근처에서 확인하고 실행하기.','native popover 안에서 취소·확인을 선택하고 결과를 원래 영역의 상태 문구에 표시합니다.','popover / data-confirm','auto / value','auto / confirmed'],
['loading-overlay','Loading Overlay','영역 로딩','feedback','작업 중인 영역만 잠시 보호.','처리 중 컨트롤을 disabled로 전환하고 aria-busy와 완료 결과를 동기화합니다.','aria-busy / disabled','boolean','false'],
['breadcrumb','Breadcrumb','이동 경로','navigation','현재 위치까지 이어지는 길.','이름 있는 nav와 ol을 사용하고 마지막 위치는 aria-current=page로 전달합니다.','aria-current','page','마지막 항목'],
['pagination','Pagination','페이지 이동','navigation','목록의 앞뒤와 현재 페이지를 함께.','실제 데이터 조각을 페이지별로 전환하고 첫·마지막 이동을 disabled로 제한합니다.','data-page','integer 1–3','1'],
['menubar','Menubar','메뉴 막대','navigation','자주 쓰는 명령을 주제별로 묶기.','native details와 버튼을 사용하며 OS형 menubar 역할이나 단축키 지원을 주장하지 않습니다.','details / summary','HTML elements','파일 / 보기'],
['navigation-menu','Navigation Menu','상단 탐색','navigation','주요 섹션으로 이어지는 분명한 입구.','실제 사이트 경로를 가진 nav 링크와 현재 위치 표기를 사용합니다.','href / aria-current','URL / page','#components / page'],
['steps','Steps','단계 표시','navigation','완료·현재·다음을 순서대로.','ol 순서를 유지하고 현재 단계에 aria-current=step을 지정하며 버튼으로 진행합니다.','aria-current','step','현재 단계'],
['stepper','Stepper','단계별 폼','navigation','한 번에 하나씩 완료하는 입력 흐름.','현재 패널만 표시하고 다음 이동 전에 해당 단계 필수 입력을 검증합니다.','required / data-step','boolean / integer','true / 0'],
['anchor','Anchor','본문 목차','navigation','긴 내용 속 필요한 위치로 이동.','실제 id를 가진 문단으로 연결하며 scroll-margin으로 고정 헤더 가림을 줄입니다.','href / id','fragment / string','고유 문단 ID'],
['bottom-navigation','Bottom Navigation','하단 탐색','navigation','모바일에서 손에 가까운 주요 메뉴.','nav 안의 실제 링크로 구성하고 아이콘과 텍스트를 함께 유지합니다.','aria-label / href','string / URL','모바일 주요 메뉴'],
['toolbar','Toolbar','도구 모음','navigation','현재 선택한 콘텐츠를 위한 도구.','문서 명령과 보기 옵션을 나눠 배치합니다. 명령은 실행 결과를 알리고 보기 토글은 누름 상태를 유지합니다. native Tab 순서로 각 도구를 탐색합니다.','role / aria-label','group / string','group / 문서 작업 도구'],
['button-group','Button Group','버튼 그룹','navigation','연관된 행동을 하나의 묶음으로.','공통 테두리와 group 이름으로 묶고 각 버튼의 Tab 접근을 보존합니다.','role / aria-label','group / string','group / 문서 작업'],
['collapsible','Collapsible','접이식 영역','navigation','하나의 보조 영역을 열고 닫기.','native details·summary로 하나의 영역을 접고 펼치며 열린 상태를 브라우저가 전달합니다.','open','boolean','false']
];
const icons={input:'sliders-horizontal',display:'layout-grid',feedback:'message-square',navigation:'route'};
const roleTokens={input:'klic.component.input.size.default.height',display:'klic.component.card.background.default',feedback:'klic.semantic.color.accent',navigation:'klic.component.field.spacing.internal'};
export const expansionEntries=Object.freeze(rows.map(([id,name,ko,category,description,rule,attribute,type,defaultValue],index)=>({id,name,ko,category,description,rule,attribute,type,defaultValue,icon:icons[category],tone:index%3===0?'soft-blue':'',tags:[ko,name,id,category==='input'?'폼':'컴포넌트'],token:['line-chart','bar-chart','donut-chart','sparkline'].includes(id)?'klic.component.block.chart.series-1':roleTokens[category],req:'KLIC 7 디멘션 · 4계층 확장 계약',source:'KLIC 독립 구현 · 범위 참고: shadcn/ui·Ant Design 공식 컴포넌트 문서',added:true})));
const label=(id,text,body,hint='')=>'<label class="x-label" for="'+id+'">'+text+'</label>'+body+(hint?'<p class="x-hint">'+hint+'</p>':'');
const input=(id,attrs='')=>'<input class="demo-input" id="'+id+'" '+attrs+'>';
const btn=(text,action='',attrs='')=>'<button type="button" class="btn secondary sm" '+(action?'data-cmp-action="'+action+'" ':'')+attrs+'>'+text+'</button>';
const status=()=>'<p class="x-status" data-cmp-status role="status" aria-live="polite"></p>';
const tags=names=>names.map(n=>'<span class="x-chip">'+esc(n)+'<button type="button" data-cmp-action="remove-chip" aria-label="'+esc(n)+' 제거">×</button></span>').join('');
const media=(index,attrs='')=>'<img src="./block-runtime/catalog/course-'+String([2,3,5][index-1]).padStart(2,'0')+'.webp" alt="'+['데이터 분석 대시보드','모바일 인터페이스 디자인','프로토타이핑 작업'][index-1]+'" width="640" height="400" loading="lazy" '+attrs+'>';
export function calendarMarkup(year=2026,month=9,selected=24){
 const days=new Date(year,month+1,0).getDate(),offset=new Date(year,month,1).getDay();
 return '<div class="x-calendar-head">'+btn('‹','calendar-prev','aria-label="이전 달"')+'<strong data-calendar-heading>'+year+'년 '+(month+1)+'월</strong>'+btn('›','calendar-next','aria-label="다음 달"')+'</div><div class="x-calendar-grid">'+['일','월','화','수','목','금','토'].map(n=>'<span>'+n+'</span>').join('')+Array.from({length:offset},()=>'<span aria-hidden="true"></span>').join('')+Array.from({length:days},(_,i)=>'<button type="button" data-cmp-action="calendar-day" data-day="'+(i+1)+'" aria-label="'+year+'년 '+(month+1)+'월 '+(i+1)+'일" aria-pressed="'+(i+1===selected)+'">'+(i+1)+'</button>').join('')+'</div>';
}
function chart(id){
 const values=[42,68,51,86,72,94],labels=['월','화','수','목','금','토'];
 if(id==='donut-chart')return '<div class="x-donut" role="img" aria-label="디자인 50%, 개발 30%, 기획 20%"><strong>100<small>전체 작업</small></strong></div><ul class="x-legend"><li>디자인 <b>50%</b></li><li>개발 <b>30%</b></li><li>기획 <b>20%</b></li></ul>';
 if(id==='bar-chart')return '<div class="x-bar-chart" role="img" aria-label="주간 완료 작업: 월42 화68 수51 목86 금72 토94">'+values.map((v,i)=>'<div><span style="height:'+v+'%"></span><small>'+labels[i]+'</small></div>').join('')+'</div><p class="x-hint">완료 작업 · 42 / 68 / 51 / 86 / 72 / 94건</p>';
 const spark=id==='sparkline';
 return '<svg class="x-line-chart" viewBox="0 0 260 100" role="img" aria-label="주간 작업 추세: 42, 68, 51, 86, 72, 94건"><path class="x-chart-grid" d="M10 25H250M10 50H250M10 75H250"/><path class="x-chart-area" d="M10 75L58 49L106 66L154 31L202 45L250 23V90H10Z"/><path class="x-chart-line" d="M10 75L58 49L106 66L154 31L202 45L250 23"/></svg><p class="x-hint">'+(spark?'주간 완료 42 → 94건 · 증가 추세':'월 42 · 화 68 · 수 51 · 목 86 · 금 72 · 토 94건')+'</p>';
}
export function expandedSpecimen(id,uid='expanded'){
 const x=s=>uid+'-'+s,field=(s,t,a,h='')=>'<div class="x-field">'+label(x(s),t,input(x(s),a),h)+'</div>',names=['디자인 시스템','브랜드 리뉴얼','모바일 앱'];
 let html='';
 switch(id){
 case 'form':html='<form data-component-form>'+field('name','프로젝트 이름','name="project" required maxlength="60" placeholder="프로젝트 이름"')+field('email','담당자 이메일','name="email" type="email" required placeholder="team@example.com"')+'<button class="btn sm" type="submit">입력 확인</button>'+status()+'</form>';break;
 case 'textarea':html=label(x('text'),'프로젝트 설명','<textarea id="'+x('text')+'" rows="4" maxlength="240" data-count-text placeholder="팀과 공유할 내용을 작성하세요."></textarea>')+'<p class="x-hint"><output data-count-output>0</output> / 240자</p>';break;
 case 'radio-group':case 'segmented-control':case 'rating':case 'color-picker':{
  const options=id==='radio-group'?['Starter','Team','Enterprise']:id==='segmented-control'?['일','주','월']:id==='rating'?['1','2','3','4','5']:['#245fc2','#2641b9','#1e4c8a'];
  html='<fieldset class="'+(id==='rating'?'x-rating':id==='segmented-control'?'x-segment':'x-options')+'"><legend>'+({rating:'사용 경험 평가','color-picker':'강조 블루','radio-group':'플랜 선택','segmented-control':'일정 보기'})[id]+'</legend>'+options.map((n,i)=>'<label><input type="radio" name="'+x('choice')+'" value="'+n+'" '+(i===1?'checked':'')+' data-choice><span '+(id==='color-picker'?'style="--swatch:'+n+'"':'')+'>'+(id==='rating'?'★<span class="sr-only">'+n+'점</span>':n)+'</span></label>').join('')+'</fieldset><p class="x-hint" data-choice-result>선택: '+options[1]+'</p>';break;
 }
 case 'slider':html=label(x('range'),'작업 진행률','<input id="'+x('range')+'" type="range" min="0" max="100" step="5" value="65" data-range-value>')+'<output class="x-number" data-range-output>65%</output>';break;
 case 'range-slider':html='<fieldset class="x-options"><legend>예산 범위 · 만원</legend>'+label(x('start'),'최소 예산','<input id="'+x('start')+'" type="range" min="0" max="100" value="20" data-range="start">')+label(x('end'),'최대 예산','<input id="'+x('end')+'" type="range" min="0" max="100" value="80" data-range="end">')+'<output data-range-result>20 — 80만원</output></fieldset>';break;
 case 'toggle':case 'toggle-group':html='<div class="x-button-row" role="group" aria-label="텍스트 표시 옵션">'+(id==='toggle'?['즐겨찾기']:['굵게','기울임','밑줄']).map((n,i)=>btn(n,'toggle','aria-pressed="'+(id!=='toggle'&&i===0)+'"')).join('')+'</div>'+status();break;
 case 'toolbar':html='<div class="x-stack" role="group" aria-label="문서 작업 도구"><div class="x-button-row" role="group" aria-label="문서 명령">'+btn(ic('file-plus')+' 새 문서','menu-choice','data-name="새 문서"')+btn(ic('download')+' 내보내기','menu-choice','data-name="문서 내보내기"')+'</div><hr style="width:100%"><div class="x-button-row" role="group" aria-label="보기 옵션">'+btn(ic('message-square')+' 주석 표시','toggle','aria-pressed="true"')+'</div></div><p class="x-hint">문서 명령과 보기 옵션을 구분한 작업 도구 모음</p>'+status();break;
 case 'combobox':html=label(x('combo'),'프로젝트 선택',input(x('combo'),'role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="'+x('options')+'" autocomplete="off" data-combo placeholder="프로젝트 검색"'))+'<div class="x-combo-options" id="'+x('options')+'" role="listbox" aria-label="프로젝트 후보" hidden>'+names.map((n,i)=>'<button type="button" role="option" aria-selected="false" id="'+x('option-'+i)+'" data-cmp-action="combo-option">'+n+'</button>').join('')+'</div>'+status();break;
 case 'autocomplete':html=field('auto','이메일 도메인','list="'+x('domains')+'" placeholder="도메인을 입력하세요"')+'<datalist id="'+x('domains')+'"><option value="klic.co.kr"></option><option value="clickdata.co.kr"></option><option value="example.com"></option></datalist><p class="x-hint">목록에 없는 값도 입력할 수 있어요.</p>';break;
 case 'multi-select':html='<details class="x-dropdown"><summary>참여 팀 선택 <span data-selected-count>0</span></summary><div class="x-option-list">'+['디자인','개발','기획','운영'].map(n=>'<label><input type="checkbox" data-multi value="'+n+'"> '+n+'</label>').join('')+'</div></details>'+status();break;
 case 'date-picker':html=field('date','출시 예정일','type="date" min="2026-01-01" max="2027-12-31" value="2026-10-24"');break;
 case 'date-range-picker':html='<div class="x-columns">'+field('from','시작일','type="date" value="2026-10-24" data-date-start')+field('to','종료일','type="date" value="2026-10-30" min="2026-10-24" data-date-end')+'</div>'+status();break;
 case 'time-picker':html=field('time','회의 시작','type="time" step="900" value="09:30"')+'<p class="x-hint">15분 단위 · 현지 시간</p>';break;
 case 'number-input':html='<label class="x-label" for="'+x('quantity')+'">참여 인원</label><div class="x-number-input">'+btn('−','decrement','aria-label="인원 줄이기"')+input(x('quantity'),'type="number" min="1" max="20" value="4" data-number')+btn('+','increment','aria-label="인원 늘리기"')+'</div><p class="x-hint">최소 1명 · 최대 20명</p>';break;
 case 'input-otp':html=field('otp','6자리 인증번호','data-otp-style inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" data-otp placeholder="000000"')+status();break;
 case 'password-input':html='<label class="x-label" for="'+x('password')+'">비밀번호</label><div class="x-password">'+input(x('password'),'type="password" value="KlicDemo2026!" autocomplete="new-password" data-password')+btn('표시','password','aria-pressed="false"')+'</div>';break;
 case 'search-input':case 'command':html=field('search',id==='command'?'명령 검색':'프로젝트 검색','type="search" data-local-filter placeholder="'+(id==='command'?'명령어를 입력하세요':'이름으로 검색')+'"')+'<ul class="x-search-results">'+(id==='command'?['새 프로젝트 만들기','설정 열기','변경사항 확인']:names).map(n=>'<li data-search-item>'+ (id==='command'?btn(n,'command'):n)+'</li>').join('')+'</ul><p class="x-hint" data-search-count>3개 결과</p>'+status();break;
 case 'input-group':html='<label class="x-label" for="'+x('url')+'">프로젝트 주소</label><div class="x-input-group"><span>klic.co.kr /</span>'+input(x('url'),'value="interface" aria-describedby="'+x('hint')+'"')+'</div><p class="x-hint" id="'+x('hint')+'">전체 주소: klic.co.kr / 프로젝트 이름</p>';break;
 case 'file-upload':case 'dropzone':html='<div '+(id==='dropzone'?'class="x-dropzone" data-dropzone':'class="x-file"')+'>'+ic('upload')+'<label for="'+x('file')+'">'+(id==='dropzone'?'파일을 놓거나 선택하세요':'파일 선택')+'</label><input type="file" id="'+x('file')+'" multiple data-files><small>로컬 이름·크기만 확인 · 서버 전송 없음</small></div><ul class="x-file-results" data-file-results><li>선택한 파일이 없습니다.</li></ul>';break;
 case 'tag-input':html='<label class="x-label" for="'+x('tag')+'">프로젝트 태그</label><div class="x-chip-list" data-tags>'+tags(['디자인','KLIC'])+'</div>'+input(x('tag'),'data-tag-input maxlength="24" placeholder="입력 후 Enter"')+'<p class="x-hint">Enter로 추가 · ×로 제거</p>'+status();break;
 case 'mentions':html=label(x('mention'),'담당자에게 남길 메모','<textarea id="'+x('mention')+'" rows="3" data-mention-text placeholder="검토를 요청할 내용을 작성하세요."></textarea>')+'<div class="x-button-row">'+['김하늘','이지원'].map(n=>btn('@'+n,'mention','data-name="'+n+'"')).join('')+'</div>'+status();break;
 case 'transfer':html='<div class="x-transfer"><fieldset data-transfer-list="left"><legend>전체 팀</legend>'+['디자인','개발','운영'].map(n=>'<label><input type="checkbox" value="'+n+'"> '+n+'</label>').join('')+'</fieldset><div>'+btn('→','transfer','data-direction="right" aria-label="선택 팀 추가"')+btn('←','transfer','data-direction="left" aria-label="선택 팀 제외"')+'</div><fieldset data-transfer-list="right"><legend>참여 팀</legend><label><input type="checkbox" value="기획"> 기획</label></fieldset></div>'+status();break;
 case 'tree-select':html='<fieldset class="x-options"><legend>저장할 폴더</legend><details open><summary>프로젝트</summary><div class="x-tree-indent">'+['디자인','개발','운영'].map((n,i)=>'<label><input type="radio" name="'+x('folder')+'" value="'+n+'" '+(!i?'checked':'')+' data-choice> '+n+'</label>').join('')+'</div></details></fieldset><p class="x-hint" data-choice-result>선택: 디자인</p>';break;
 case 'cascader':html='<div class="x-columns">'+'<div class="x-field">'+label(x('dept'),'부서','<select id="'+x('dept')+'" data-cascade-dept><option value="product">제품</option><option value="business">사업</option></select>')+'</div><div class="x-field">'+label(x('team'),'팀','<select id="'+x('team')+'" data-cascade-team><option>디자인</option><option>프론트엔드</option></select>')+'</div></div>'+status();break;
 case 'avatar':html='<div class="x-profile">'+renderAvatar('김하늘')+'<div><strong>김하늘</strong><small>Product Designer</small></div></div><p class="x-hint">KLIC 가상 인물 · 생성 프로필</p>';break;
 case 'avatar-group':html='<div class="x-avatar-group" role="group" aria-label="프로젝트 참여자">'+['김하늘','이지원','박선준','한소윤'].map(renderAvatar).join('')+'<span>+8</span></div><p class="x-hint">디자인 시스템 팀 · 12명 참여</p>';break;
 case 'typography':html='<div class="x-type"><small>KLIC / TYPOGRAPHY</small><h3>좋은 화면의 시작.</h3><p>분명한 위계, 편안한 읽기.<br>사람의 눈높이에 맞춘 인터페이스.</p><small>본문과 제목 폰트는 Customize에서 조절합니다.</small></div>';break;
 case 'line-chart':case 'bar-chart':case 'donut-chart':case 'sparkline':html=chart(id);break;
 case 'link':html='<div class="x-stack"><a class="text-link" href="#tokens">디자인 토큰 살펴보기 '+ic('arrow-right')+'</a><a class="text-link" href="#fonts">폰트 라이브러리 '+ic('arrow-up-right')+'</a><a class="text-link" href="https://klic.co.kr/" target="_blank" rel="noopener">KLIC 회사 사이트 · 새 창 '+ic('external-link')+'</a></div>';break;
 case 'blockquote':html='<blockquote class="x-quote"><p>작은 요소가 모여 제품의 경험을 만듭니다.</p><cite>KLIC · 인터페이스 설계 노트</cite></blockquote>';break;
 case 'code-block':html='<div class="x-code-head"><span>tokens.css</span>'+btn('코드 복사','copy')+'</div><pre class="x-code" tabindex="0" aria-label="토큰 CSS 코드"><code>:root {\n  --klic-accent: #245fc2;\n  --klic-radius: 8px;\n}</code></pre>'+status();break;
 case 'kbd':html='<div class="x-stack"><span>검색 <kbd>⌘</kbd> + <kbd>K</kbd></span><span>선택 이동 <kbd>Tab</kbd></span><span>닫기 <kbd>Esc</kbd></span></div>';break;
 case 'separator':html='<div class="x-stack"><strong>프로젝트 정보</strong><p>같은 맥락의 내용을 묶습니다.</p><hr><p>다음 주제로 이어지는 구분.</p></div>';break;
 case 'aspect-ratio':html='<div class="x-aspect">'+media(1)+'<span>16 : 9</span></div>';break;
 case 'image':html='<figure class="x-figure">'+media(2)+'<figcaption>제품 디자인 프로젝트 · 원본 샘플 이미지</figcaption></figure>';break;
 case 'carousel':html='<div class="x-carousel" data-carousel="0">'+[1,2,3].map((n,i)=>'<figure data-slide '+(i?'hidden':'')+'>'+media(n)+'<figcaption>'+['인터페이스 설계','제품 디자인','팀 협업'][i]+'</figcaption></figure>').join('')+'<div class="x-carousel-tools">'+btn('‹','carousel-prev','aria-label="이전 이미지"')+'<span data-carousel-count aria-live="polite">1 / 3</span>'+btn('›','carousel-next','aria-label="다음 이미지"')+'</div></div>';break;
 case 'skeleton':html='<div data-skeleton aria-busy="true"><span class="sr-only">불러오는 중</span><div class="x-skeleton x-skeleton-avatar"></div><div class="x-skeleton"></div><div class="x-skeleton short"></div></div>'+btn('콘텐츠 불러오기','load-skeleton')+status();break;
 case 'spinner':html='<div class="x-spinner-row" role="status"><span class="x-spinner" aria-hidden="true"></span><span>변경사항을 처리하고 있습니다.</span></div>';break;
 case 'statistic':html='<div class="x-stat"><small>이번 달 활성 프로젝트</small><strong>128 <em>개</em></strong><span>'+ic('trending-up')+' 전월 대비 12개 증가</span><p>2026년 10월 · 샘플 데이터</p></div>';break;
 case 'descriptions':html='<dl class="x-descriptions">'+[['프로젝트','KLIC Interface'],['담당자','김하늘'],['진행 상태','검토 중'],['다음 마감','2026.10.30']].map(([a,b])=>'<div><dt>'+a+'</dt><dd>'+b+'</dd></div>').join('')+'</dl>';break;
 case 'list':html='<ul class="x-list">'+names.map((n,i)=>'<li><span>'+ic(['layers','pen-tool','smartphone'][i])+n+'</span>'+btn('열기','list-open','data-name="'+n+'"')+'</li>').join('')+'</ul>'+status();break;
 case 'timeline':html='<ol class="x-timeline">'+[['10:30','디자인 검토 완료'],['09:45','컴포넌트 업데이트'],['09:00','프로젝트 시작']].map(([t,n])=>'<li><time datetime="2026-10-24T'+t+'">'+t+'</time><strong>'+n+'</strong></li>').join('')+'</ol>';break;
 case 'tree':html='<div class="x-file-tree"><details open><summary>'+ic('folder')+' klic-interface</summary><div><details open><summary>'+ic('folder')+' components</summary><p>'+ic('file-code')+' button.html</p><p>'+ic('file-code')+' input.html</p></details><details><summary>'+ic('folder')+' tokens</summary><p>primitive.json</p><p>semantic.json</p></details></div></details></div>';break;
 case 'calendar':html='<div class="x-calendar" data-year="2026" data-month="9">'+calendarMarkup()+'</div>'+status();break;
 case 'empty-state':html='<div class="x-empty" data-empty>'+ic('folder-plus')+'<strong>아직 프로젝트가 없어요.</strong><p>첫 프로젝트를 만들고 팀과 시작하세요.</p>'+btn('프로젝트 만들기','create-item')+'</div>'+status();break;
 case 'result':html='<div class="x-empty">'+ic('circle-check')+'<strong>변경사항이 반영됐어요.</strong><p>팀이 같은 내용을 확인할 수 있습니다.</p><a class="text-link" href="#components">컴포넌트로 돌아가기 '+ic('arrow-right')+'</a></div>';break;
 case 'tag':html='<div class="x-chip-list"><span class="x-tag">디자인</span><span class="x-tag">프론트엔드</span><span class="x-tag x-tag-outline">문서</span><span class="x-tag x-tag-amber">검토 중</span></div>';break;
 case 'chip':html='<p class="x-label">선택한 필터</p><div class="x-chip-list">'+tags(['진행 중','담당: 김하늘','이번 주'])+'</div>'+status();break;
 case 'icon':html='<div class="x-icon-grid">'+['folder','calendar-days','layers','bell','search','settings-2','file-code','users'].map(n=>'<div>'+ic(n)+'<small>'+n+'</small></div>').join('')+'</div>';break;
 case 'scroll-area':html='<div class="x-scroll" tabindex="0" role="region" aria-label="프로젝트 활동 기록">'+Array.from({length:12},(_,i)=>'<p><strong>'+String(i+1).padStart(2,'0')+'</strong> 디자인 시스템 작업 기록</p>').join('')+'</div>';break;
 case 'resizable':html='<div class="x-resize" data-resize-box><strong>폭을 바꿔보세요.</strong><p>텍스트는 영역 안에서 자연스럽게 줄바꿈합니다.</p></div>'+label(x('resize'),'작업 영역 폭','<input id="'+x('resize')+'" type="range" min="140" max="280" value="240" data-resize>');break;
 case 'splitter':html='<div class="x-split" style="--split:45%" data-split-box><div>탐색 패널<br><small>프로젝트 · 문서</small></div><div>작업 공간<br><small>선택한 내용을 편집합니다.</small></div></div>'+label(x('split'),'왼쪽 패널 비율','<input id="'+x('split')+'" type="range" min="25" max="75" value="45" data-split>');break;
 case 'watermark':html='<div class="x-watermark"><span aria-hidden="true">KLIC · INTERNAL<br>KLIC · INTERNAL<br>KLIC · INTERNAL</span><strong>팀 내부 문서</strong><p>프로젝트 검토 자료<br>외부 공유 전 확인하세요.</p></div>';break;
 case 'alert':html='<div class="x-alert" role="note">'+ic('info')+'<div><strong>검토할 변경사항이 있어요.</strong><p>새로운 토큰 값을 적용하기 전에 팀과 확인하세요.</p></div></div>';break;
 case 'alert-dialog':html=btn('보관 전 확인','open-dialog')+'<dialog class="x-confirm"><h3>프로젝트를 보관할까요?</h3><p>목록에서 숨기는 동작을 시연합니다.<br>실제 프로젝트는 변경하지 않습니다.</p><form method="dialog"><button class="btn secondary sm" value="cancel" autofocus>취소</button><button class="btn sm" value="confirm">보관 확인</button></form></dialog>'+status();break;
 case 'tooltip':html='<div class="x-tooltip-wrap">'+btn('자동 저장 안내','','aria-describedby="'+x('tip')+'"')+'<span id="'+x('tip')+'" role="tooltip">변경사항을 이 브라우저에 저장합니다.</span></div><p class="x-hint">포인터를 올리거나 Tab으로 확인하세요.</p>';break;
 case 'hover-card':html='<details class="x-hovercard"><summary>'+renderAvatar('김하늘')+' 김하늘 · 프로필 보기</summary><div><strong>김하늘</strong><p>Product Designer</p><small>KLIC Interface 팀 · 가상 인물</small></div></details>';break;
 case 'dropdown-menu':case 'context-menu':case 'popconfirm':{
  const pop=x('popup');
  html=(id==='context-menu'?'<div class="x-context-target" data-context-target="'+pop+'">'+ic('file-text')+' 프로젝트 제안서.pdf</div>':'')+'<button type="button" class="btn secondary sm" popovertarget="'+pop+'">'+({ 'dropdown-menu':'프로젝트 옵션','context-menu':'파일 메뉴','popconfirm':'보관하기'})[id]+' '+ic('chevron-down')+'</button><div class="x-popover" popover="auto" id="'+pop+'">'+(id==='popconfirm'?'<strong>목록에서 보관할까요?</strong><p>실제 데이터는 바뀌지 않습니다.</p>'+btn('취소','close-popover')+btn('확인','confirm'):['이름 변경','복제하기','링크 확인'].map(n=>btn(n,'menu-choice','data-name="'+n+'"')).join(''))+'</div>'+status();break;
 }
 case 'notification':html='<div class="x-notification"><strong>미확인 알림 <span data-notification-count>2</span></strong>'+['김하늘님이 검토를 요청했어요.','컴포넌트 문서가 업데이트됐어요.'].map(n=>'<article data-unread="true"><p>'+n+'</p>'+btn('읽음','read-notification')+'</article>').join('')+'</div>'+status();break;
 case 'banner':html='<div class="x-banner" data-banner><span>'+ic('sparkles')+' 컴포넌트 100종을 만나보세요.</span>'+btn('×','dismiss-banner','aria-label="안내 배너 닫기"')+'</div>'+btn('배너 다시 표시','show-banner')+status();break;
 case 'loading-overlay':html='<div class="x-loading-region" aria-busy="false"><p>프로젝트 설정을 동기화합니다.</p><span class="x-loading-cover" hidden><span class="x-spinner"></span> 처리 중</span>'+btn('동기화 시작','loading')+'</div>'+status();break;
 case 'breadcrumb':html='<nav aria-label="현재 위치"><ol class="x-breadcrumb"><li><a href="#components">라이브러리</a></li><li><a href="#components/input">입력과 선택</a></li><li aria-current="page">컴포넌트</li></ol></nav>';break;
 case 'pagination':html='<ul class="x-page-items" data-page-items><li>디자인 시스템</li><li>브랜드 리뉴얼</li></ul><nav class="x-button-row" aria-label="프로젝트 페이지" data-page="1">'+btn('‹','page-prev','disabled aria-label="이전 페이지"')+[1,2,3].map(i=>btn(String(i),'page','data-page-number="'+i+'" '+(i===1?'aria-current="page"':''))).join('')+btn('›','page-next','aria-label="다음 페이지"')+'</nav>'+status();break;
 case 'menubar':html='<div class="x-menu-bar" role="group" aria-label="문서 메뉴">'+['파일','편집','보기'].map(n=>'<details><summary>'+n+'</summary><div>'+btn(n+' 옵션 실행','menu-choice','data-name="'+n+' 옵션"')+'</div></details>').join('')+'</div>'+status();break;
 case 'navigation-menu':case 'bottom-navigation':html='<nav class="'+(id==='bottom-navigation'?'x-bottom-nav':'x-navigation')+'" aria-label="'+(id==='bottom-navigation'?'모바일 주요 메뉴':'라이브러리 섹션')+'">'+[['layout-grid','컴포넌트','#components'],['panels-top-left','블록','#blocks'],['swatch-book','토큰','#tokens']].map(([i,n,h],idx)=>'<a href="'+h+'" '+(!idx?'aria-current="page"':'')+'>'+ic(i)+'<span>'+n+'</span></a>').join('')+'</nav>';break;
 case 'steps':html='<ol class="x-steps" data-step="1">'+['기본 정보','팀 초대','시작하기'].map((n,i)=>'<li '+(i===1?'aria-current="step"':'')+'><span>'+(i===0?'✓':i+1)+'</span><small>'+n+'</small></li>').join('')+'</ol>'+btn('다음 단계','next-step')+status();break;
 case 'stepper':html='<form class="x-step-form" data-wizard-step="0"><div data-wizard-panel><label class="x-label" for="'+x('project')+'">1. 프로젝트 이름</label>'+input(x('project'),'required placeholder="프로젝트 이름"')+'</div><div data-wizard-panel hidden><label class="x-label" for="'+x('team-name')+'">2. 팀 이름</label>'+input(x('team-name'),'required disabled placeholder="팀 이름"')+'</div><div class="x-button-row">'+btn('이전','wizard-back','disabled')+btn('다음','wizard-next')+'</div>'+status()+'</form>';break;
 case 'anchor':html='<nav class="x-anchor-nav" aria-label="문서 목차">'+['개요','설계','적용'].map((n,i)=>'<a href="#'+x('section-'+i)+'">'+n+'</a>').join('')+'</nav><div class="x-anchor-content" tabindex="0" role="region" aria-label="예시 문서">'+['개요','설계','적용'].map((n,i)=>'<section id="'+x('section-'+i)+'"><h4>'+n+'</h4><p>회사 블루와 일관된 토큰을 연결합니다.</p></section>').join('')+'</div>';break;
 case 'button-group':html='<div class="x-button-group" role="group" aria-label="문서 작업">'+['저장','복제','공유'].map(n=>btn(n,'menu-choice','data-name="'+n+'"')).join('')+'</div>'+status();break;
 case 'collapsible':html='<details class="x-collapsible"><summary>'+ic('chevron-right')+' 프로젝트 부가 정보</summary><div><p>시작일: 2026.10.24</p><p>담당 팀: KLIC Interface</p><p>토큰 프로필: Brand A</p></div></details>';break;
 default:return '';
 }
 return '<div class="x-demo xc-'+id+'" data-klic-component="'+id+'">'+html+'</div>';
}
const actionHelp={
'toggle':'aria-pressed를 반전하고 선택한 옵션과 켜짐·꺼짐을 상태 영역에 표시합니다.',
'increment':'number.stepUp()으로 한 단계 늘립니다. max를 넘지 않습니다.',
'decrement':'number.stepDown()으로 한 단계 줄입니다. min보다 작아지지 않습니다.',
'password':'입력값을 유지하면서 password ↔ text를 전환합니다.',
'combo-option':'해당 항목을 입력값에 적용하고 목록을 닫은 뒤 입력으로 초점을 돌립니다.',
'remove-chip':'누른 버튼이 속한 칩만 제거하고 결과를 알립니다.',
'mention':'가상 인물 이름을 메모 끝에 삽입합니다. 메시지나 알림은 보내지 않습니다.',
'transfer':'선택한 체크박스 항목만 지정한 목록으로 옮기고 체크를 해제합니다.',
'copy':'같은 예제 안 code의 textContent를 복사합니다.',
'carousel-prev':'이미지 순서를 하나 줄이며 처음에서 마지막으로 순환합니다.',
'carousel-next':'이미지 순서를 하나 늘리며 마지막에서 처음으로 순환합니다.',
'load-skeleton':'aria-busy를 해제하고 골격을 실제 샘플 콘텐츠로 교체합니다.',
'calendar-prev':'이전 달의 실제 요일과 일수를 다시 계산합니다.',
'calendar-next':'다음 달의 실제 요일과 일수를 다시 계산합니다.',
'calendar-day':'한 날짜에만 aria-pressed=true를 적용하고 선택 날짜를 알립니다.',
'create-item':'빈 상태를 로컬 프로젝트 항목으로 바꿉니다. 서버 저장은 없습니다.',
'open-dialog':'showModal()로 열고 취소에 초기 초점을 둡니다. 닫힌 뒤 트리거로 돌아옵니다.',
'close-popover':'가장 가까운 열린 popover를 hidePopover()로 닫습니다.',
'confirm':'확인 결과를 상태 영역에 쓰고 popover를 닫습니다.',
'menu-choice':'선택한 명령 이름과 로컬 시연 결과를 표시합니다.',
'list-open':'선택한 항목 이름을 결과에 표시합니다. 상세 API 조회는 없습니다.',
'command':'필터링된 명령의 이름을 결과 영역에 표시합니다.',
'read-notification':'알림을 읽음으로 바꾸고 미확인 개수를 다시 계산합니다.',
'dismiss-banner':'배너를 숨기고 다시 표시 버튼으로 초점을 옮깁니다.',
'show-banner':'숨긴 배너를 현재 예제 안에 다시 표시합니다.',
'loading':'버튼을 비활성화하고 900ms 처리 시연 후 aria-busy·버튼·완료 문구를 복원합니다.',
'page':'data-page-number의 실제 데이터 조각으로 이동합니다.',
'page-prev':'첫 페이지를 넘지 않는 이전 데이터 조각을 표시합니다.',
'page-next':'마지막 페이지를 넘지 않는 다음 데이터 조각을 표시합니다.',
'next-step':'현재 단계 표시를 다음 항목으로 이동하고 마지막에서 중지합니다.',
'wizard-back':'이전 입력 단계로 이동합니다. 기존 입력값은 유지합니다.',
'wizard-next':'현재 필수 입력 검증 후 다음 단계 또는 최종 확인 결과로 이동합니다.'
};
export function expansionGuide(entry,guide){
 const editable=entry.category==='input';
 const result=guide({
  id:entry.id,summary:entry.description+' '+entry.rule,
  implementation:'이 사이트에서 직접 작성한 native HTML·CSS·DOM 예제입니다. '+entry.rule+' 외부 패키지의 props 또는 서버 연동을 제공한다고 선언하지 않습니다.',
  use:[entry.ko+'의 용도: '+entry.description+' 제품 맥락과 상태 조건을 확인해 적용합니다.',entry.rule],
  avoid:[editable?'필수 조건·오류·제약을 placeholder에만 숨기지 않습니다.':'정보의 의미를 색이나 아이콘에만 의존하지 않습니다.','이 예제의 브라우저 로컬 상태를 서버 저장·인증·실제 알림으로 해석하지 않습니다.'],
  anatomy:[['의미와 이름',entry.ko+'의 목적을 설명하는 레이블 또는 제목'],['주요 영역',entry.description],['상태와 보조 설명',entry.rule]],
  states:[['기본','예제가 처음 표시됨',entry.description],['포커스·탐색',editable?'사용자가 입력 또는 선택을 시작함':'링크·버튼·스크롤 영역에 키보드로 접근함','기본 focus 표시와 DOM 읽기 순서를 유지합니다.'],['내용 변화',editable?'값이나 선택이 변경됨':'데이터·주제·표시 영역이 달라짐',entry.rule],['작은 화면·확대','260px 영역 또는 사용자 글자 배율 적용','내용을 보존하며 줄바꿈하고 필요한 영역만 내부 스크롤합니다.']],
  api:[...Array.from(new Set([...expandedSpecimen(entry.id,'api').matchAll(/data-cmp-action="([^"]+)"/g)].map(m=>m[1]))).map(action=>['DOM click 계약','data-cmp-action="'+action+'"','string',action,actionHelp[action]||entry.rule]),['HTML·DOM 계약',entry.attribute,entry.type,entry.defaultValue,entry.rule],['컴포넌트 식별','data-klic-component','string',entry.id,'실행 예제의 최상위 컨테이너입니다.'],['CSS 클래스','x-demo + x-'+entry.id,'class','x-demo','component-expansion.css에서 구조와 의미 있는 상태를 지정합니다.'],['공통 스타일','--klic-text-scale','number','1','개인 설정의 글자 배율을 따릅니다.'],['토큰 참조',entry.token,'KLIC token alias','선택한 브랜드·테마','4계층으로 해석한 실제 역할 값을 사용합니다.']],
  examples:[{id:'basic',title:'기본 구성',description:'실제 '+entry.ko+' 구조와 브라우저 동작을 확인합니다.',code:expandedSpecimen(entry.id,'example-basic'),dependencies:'component-expansion.css · component-expansion.mjs · component-interactions.mjs · 기존 KLIC 토큰/스타일. native 동작 외 상호작용은 initComponentInteractions가 필요합니다.'}],
  exampleGuidance:[{title:'업무 화면에 조합',description:entry.ko+'의 목적과 현재 상태를 알 수 있도록 제목·설명을 함께 배치합니다. '+entry.rule},{title:'작은 영역에 배치',description:'미리보기의 컨테이너 폭을 줄여 확인하세요. 긴 한글 레이블은 줄바꿈하고 표·차트 등 폭을 유지해야 하는 내용만 내부에서 스크롤합니다.'}],
  keyboard:[['Tab / Shift+Tab','DOM 순서대로 실제 링크·버튼·입력에 접근합니다. 장식 요소는 Tab 순서에 넣지 않습니다.'],[entry.id==='combobox'?'방향키 / Enter / Escape':editable?'문자 입력·방향키·Space':'Enter / Space',entry.rule]],
  accessibility:['이름·현재 값·설명을 해당 HTML 요소와 함께 제공합니다.','포커스 외곽선과 텍스트 대비를 Light/Dark에서 함께 유지합니다.','작은 화면·긴 한글·사용자 글자 배율에서 콘텐츠가 사라지지 않는지 확인합니다.'],
  axes:['부모의 가용 폭 안에서 배치하고 고정 canvas 폭을 강제하지 않습니다. '+entry.ko+'의 내용에 맞춰 높이를 확장합니다.','본문·레이블은 사용자 글자 크기 설정을 따릅니다. 중요도는 크기·굵기·문서 구조로 구분합니다.','회사 블루로 행동·선택을 표현하고 네이비 텍스트·중립 표면을 사용합니다. 위험은 문구와 레드로 구분합니다.','이 예제의 DOM 순서를 시각적 읽기 순서와 맞춥니다. '+entry.rule,'내부 레이블·주요 내용·설명 사이 간격과 외부 컨테이너 간격을 분리합니다.','표면·경계·반경을 역할 토큰으로 지정하며 Customize 변경을 반영합니다.','이 컴포넌트의 동작 계약: '+entry.rule],
  tokens:[{path:entry.token,purpose:entry.ko+'의 주요 역할 값'},{path:'klic.component.card.background.default',purpose:'배경 표면'},{path:'klic.semantic.color.accent',purpose:'선택과 행동의 강조'}],
  related:editable?['field','button','alert']:entry.category==='navigation'?['tabs','sidebar','button']:['card','table','badge'],
  checks:[entry.rule,'실행 예제를 확인하고 업무 조합·작은 영역 적용 안내를 제품 맥락에 맞게 검토합니다.','Light/Dark와 글자 크기 150%에서 레이블·내용·포커스를 확인합니다.']
 });
 result.sources=[{href:'./component-expansion.mjs',title:'100종 확장 구조·예제·명세'},{href:'./component-interactions.mjs',title:'실제 DOM 상호작용'},{href:'./component-expansion.css',title:'KLIC 토큰 기반 스타일'},{href:'https://ui.shadcn.com/docs/components',title:'기능 범위 참고 · shadcn/ui 공식 목록'},{href:'https://ant.design/components/overview/',title:'기능 범위 참고 · Ant Design 공식 목록'}];
 return result;
}
