// Authored translations for the diagram showcase and shared agent workbench UI.
export const diagramWorkbenchMessages=Object.fromEntries(`
연결됨	Connected
노드를 선택해 연결된 흐름을 확인하세요. 샘플 구조이며 실제 장비를 조회하지 않습니다.	Select a node to inspect its connections. This sample topology does not query real equipment.
장애 시뮬레이션	Incident simulation
켜짐	On
꺼짐	Off
축소	Zoom out
확대	Zoom in
전체 보기	View all
● API → 데이터베이스 연결 장애	● API → database connection failure
✓ 모든 샘플 경로 정상	✓ All sample paths are healthy
선택 가능한 서비스 노드와 연결	Selectable service nodes and connections
연결 실패	Connection failed
사용자	User
클라이언트	Client
브라우저에서 서비스를 요청합니다.	Requests the service from a browser.
게이트웨이	Gateway
진입점	Entry point
요청을 분류하고 서비스로 전달합니다.	Routes incoming requests to the appropriate service.
API 서비스	API service
서비스	Service
업무 요청을 처리합니다.	Processes application requests.
작업 워커	Background worker
비동기 작업	Asynchronous jobs
대기열의 작업을 처리합니다.	Processes jobs from the queue.
데이터베이스	Database
데이터	Data
트랜잭션과 업무 데이터를 저장합니다.	Stores transactions and application data.
파일 저장소	File storage
스토리지	Storage
문서와 미디어를 저장합니다.	Stores documents and media.
사용자 클라이언트 상세 보기	View User client details
게이트웨이 진입점 상세 보기	View Gateway entry point details
API 서비스 서비스 상세 보기	View API service details
작업 워커 비동기 작업 상세 보기	View Background worker job details
데이터베이스 데이터 상세 보기	View Database details
파일 저장소 스토리지 상세 보기	View File storage details
노드를 선택하세요	Select a node
Tab으로 노드를 이동하고 Enter 또는 Space로 선택할 수 있습니다. 선택한 노드와 무관한 연결은 흐리게 표시됩니다.	Use Tab to move between nodes and Enter or Space to select one. Connections unrelated to the selected node are dimmed.
설계 계약을 불러오지 못했습니다. 페이지를 다시 열어주세요.	Could not load the design contract. Reopen the page.
설계를 코드와 함께 가져가세요.	Take the design guidance with the code.
이 항목의 사용 원칙·금지 사항·접근성·상태·토큰 매핑을 한 계약으로 제공합니다.	One contract covers this item's usage principles, prohibited uses, accessibility, states, and token mappings.
Do · 이럴 때 사용하세요	Do · When to use
Don't · 피해야 할 사용	Don't · Uses to avoid
밀도별 적용	Density guidance
사용 환경	Usage context
Normal · 기본	Normal · default
Compact · 반복 작업	Compact · repeated tasks
Relaxed · 설명 중심	Relaxed · explanatory content
상태 변이와 복구	State variations and recovery
아래는 이 항목의 복구 지침을 설명하는 공통 상태 샘플입니다. 원본 블록의 상태를 변경하지 않습니다.	These shared state samples explain this item's recovery guidance. They do not change the original block's state.
상태 선택	Select state
로딩	Loading
빈 상태	Empty state
검색 결과 없음	No search results
오류	Error
접근성·키보드 체크리스트	Accessibility and keyboard checklist
CSS 변수와 Tailwind 연결	CSS variable and Tailwind mapping
토큰과 용도	Token and purpose
CSS 변수	CSS variable
CSS 매핑 복사	Copy CSS mapping
Tailwind 예시 복사	Copy Tailwind example
React · Vue · HTML 미리보기 삽입	Embed previews in React, Vue, and HTML
복사하면 작동하는 iframe 어댑터입니다. Vue 네이티브 포팅이 아닙니다. 실제 React 구현은 기존 실제 소스 탭에서 확인하세요. 사이트의 로컬 데모를 호스팅된 미리보기로 삽입합니다.	This copyable iframe adapter embeds a hosted preview of the site's local demo. It is not a native Vue port. See the Actual source tab for the React implementation.
복사하면 작동하는 iframe 어댑터입니다. Vue 네이티브 포팅이 아닙니다. 네이티브 HTML은 기본 코드 탭에서 확인하세요. 사이트의 로컬 데모를 호스팅된 미리보기로 삽입합니다.	This copyable iframe adapter embeds a hosted preview of the site's local demo. It is not a native Vue port. See the basic Code tab for the native HTML.
프레임워크	Framework
준비 항목은 실행 코드 내보내기를 제공하지 않습니다.	Planned items do not provide runnable code exports.
비슷한 블록	Related blocks
같은 분류·태그·공유 토큰을 기준으로 연결합니다.	Recommendations use shared categories, tags, and tokens.
연결된 추천이 없습니다.	No related recommendations.
블록 조합 플레이그라운드 →	Block composition playground →
프롬프트와 결과 비교 →	Compare prompts and results →
변경 기록·마이그레이션 →	Changelog and migration →
내용을 불러오는 중입니다	Loading content
아직 항목이 없습니다	No items yet
조건에 맞는 결과가 없습니다	No results match your criteria
요청을 완료하지 못했습니다	Could not complete the request
로딩 중	Loading
첫 항목 만들기	Create the first item
샘플 행동을 확인했습니다.	Sample action confirmed.
실제 데이터 생성·재시도는 제품의 처리 함수에 연결하세요.	Connect actual data creation and retry actions to your product's handlers.
관리자 반복 입력에만 사용합니다. 도움말·오류와 실제 클릭 영역은 유지합니다.	Use only for repetitive administrative input. Preserve help text, errors, and actual click targets.
데이터 비교·반복 행에 사용하며 셀 padding만 줄입니다. 글자 크기와 단위는 유지합니다.	Use for data comparisons and repeated rows, reducing only cell padding. Preserve text size and units.
반복 목록에서만 여백을 줄이고 주요 행동 간격은 유지합니다.	Reduce spacing only in repeated lists; preserve spacing around primary actions.
기본 권장 밀도입니다. 읽기 순서와 레이블·컨트롤·피드백 그룹을 유지합니다.	The recommended default density. Preserve reading order and the grouping of labels, controls, and feedback.
처음 작성하는 폼·긴 안내에 권장합니다. 필드 그룹의 간격을 늘립니다.	Recommended for first-time forms and detailed guidance. Increase spacing between field groups.
설명 중심·프레젠테이션 화면에 사용합니다. 정보 계층을 유지하며 여백을 늘립니다.	Use for explanatory or presentation screens. Increase spacing while preserving information hierarchy.
진행 중임을 알리고 중복 요청을 차단합니다. 기존 데이터가 있으면 갱신 중에도 유지합니다.	Indicate progress and prevent duplicate requests. Preserve existing data while updates are in progress.
초기 빈 입력은 오류로 표시하지 않습니다. 필수 조건은 제출 전에도 안내합니다.	Do not mark initially empty inputs as errors. Explain requirements before submission.
처음부터 데이터가 없는 상태에는 생성·연결 행동을 제공합니다.	When no data exists yet, provide an action to create or connect it.
검색 결과가 없으면 데이터 없음과 구분하고 필터 초기화 행동을 제공합니다.	Distinguish an empty search result from missing data and provide an action to reset filters.
입력값을 보존하고 오류 설명을 해당 필드와 연결합니다.	Preserve input values and associate each error description with its field.
마지막 정상 데이터를 보존하고 실패 영역에 재시도를 제공합니다.	Preserve the last successful data and provide a retry action in the affected region.
검증 오류를 토스트만으로 안내하거나 실패 후 입력을 지우지 않습니다.	Do not report validation errors only through toasts or clear inputs after failure.
좁은 화면을 이유로 수치·단위·범례를 생략하거나 폰트를 일괄 축소하지 않습니다.	Do not omit values, units, or legends, or shrink all text to fit a narrow screen.
카드 전체 행동과 내부 버튼을 중첩하지 않습니다.	Do not nest internal buttons within a card-wide action.
샘플 데이터·로컬 상호작용을 실제 저장·인증·운영 기능으로 표시하지 않습니다.	Do not present sample data or local interactions as real storage, authentication, or production capabilities.
키보드로 주요 행동을 실행합니다.	Perform primary actions with the keyboard.
compact·normal·relaxed와 Light/Dark를 각각 확인합니다.	Check compact, normal, and relaxed densities in both Light and Dark themes.
빈 결과·로딩·오류와 긴 한글 콘텐츠를 확인합니다.	Check empty results, loading, errors, and long Korean content.
완료·선택	Completion and selection
데이터 생명주기	Data lifecycle
조합 정책	Composition policy
`.trim().split('\n').map(row=>row.split('\t')));
