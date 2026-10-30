import {libraryScopeText} from '../library-scope.mjs';
import {designGuidanceMessages} from './design-guidance-en.mjs';
import {BLOCK_IDENTITIES} from '../block-identities.mjs';
import {affectMessages} from './affect-en.mjs';
import {timelineMessages} from './timeline-en.mjs';
import {connectorMessages} from './flow-connectors-en.mjs';
import {diagramWorkbenchMessages} from './diagram-workbench-en.mjs';
import {siteDocsMessages} from './site-docs-en.mjs';
import {blockContractAMessages} from './block-contracts-a-en.mjs';
import {blockContractBMessages} from './block-contracts-b-en.mjs';
import {guideApiMessages} from './guide-api-en.mjs';
import {legacyGuideAMessages} from './legacy-guides-a-en.mjs';
import {legacyGuideBMessages} from './legacy-guides-b-en.mjs';
import {blockDescriptionAMessages} from './block-descriptions-a-en.mjs';
import {blockDescriptionBMessages} from './block-descriptions-b-en.mjs';
/** Authored UI translations. Unlisted long-form source documentation is retained in Korean. */
export const messages = Object.fromEntries(`
원격 전송은 stateless JSON HTTP입니다. 2026-07-28은 params._meta와 일치하는 MCP-Protocol-Version, Mcp-Method 및 tools/call의 Mcp-Name 헤더가 필요합니다. 헤더 오류는 HTTP 400·-32020, 미지원 버전은 400, 없는 메서드는 404입니다. 도구 실패는 HTTP 200의 isError: true입니다. 2025-11-25 초기화와 줄 단위 stdio를 유지하며 본문은 1 MiB로 제한합니다.	Remote transport uses stateless JSON HTTP. For 2026-07-28, send MCP-Protocol-Version, Mcp-Method and tools/call Mcp-Name headers matching params._meta and the body. Header failures return HTTP 400 with -32020; unsupported versions return 400 and unknown methods return 404. Tool failures use HTTP 200 with isError: true. Legacy 2025-11-25 initialization and newline-delimited stdio remain supported; request bodies are limited to 1 MiB.
브라우저 MCP 요청은 사이트 출처와 서버의 KLIC_MCP_ALLOWED_ORIGINS 허용 목록을 검사합니다. 추가 출처는 정확한 origin 문자열의 JSON 배열로 설정합니다. Origin이 없는 네이티브 클라이언트는 로그인 없이 공개 자료를 읽습니다. JSON API의 공개 교차 출처 읽기는 유지됩니다.	Browser MCP requests check the Site origin and the server KLIC_MCP_ALLOWED_ORIGINS allowlist. Configure additional origins as an exact JSON array. Native clients without Origin read public data without login. Public cross-origin JSON API reads remain available.
코드 · 사용 방법	Code & usage
프로젝트에 적용하기	Use in your project
이 형태만 확인하기	Read this form
필요한 파일	Required files
HTML 복사	Copy HTML
코드 패널 닫기	Close code panel
CLI 설치 · 사용 안내 ↗	CLI setup & usage ↗
비교 화면 스타일	Comparison styles
추가형 컴포넌트 스타일	Additional form styles
추가형 동작	Additional form interactions
기본형 스타일	Default form styles
전체 파일 목록 · 라이선스	Full file list & licenses
아래 명령으로 토큰·스타일·아이콘·동작 파일이 포함된 실행 소스를 가져오세요.	Use this command to download runnable source with tokens, styles, icons and interactions.
HTML 조각의 동작에는 소스 묶음의 런타임이 필요합니다.	The HTML fragment requires the runtime from the source bundle.
Geist Mono의 한글은 대체 글꼴을 사용합니다.	Korean characters in Geist Mono use a fallback font.
본문 폰트	Body font
제목 폰트	Heading font
설치	Installation
블록 설치	Block installation
패키지 매니저	Package manager
설치 명령 복사	Copy install command
설치 명령을 복사했습니다.	Install command copied.
명령	Command
수동 설치 안내	Manual installation guide
React 19 · shadcn 설정 필요 · 시스템 폰트 사용	Requires React 19 and shadcn setup · uses system fonts
설치 소스 JSON 보기 ↗	View installation source JSON ↗
모든 등록 글꼴은 웹폰트로 제공됩니다. Geist Mono의 한글은 대체 글꼴로 표시됩니다.	All registered families are provided as web fonts. Korean characters in Geist Mono use a fallback font.

컴포넌트·형태 검색	Search components and forms
컴포넌트·형태 검색…	Search components and forms…
KLIC 기본형	KLIC default
기본형	Default
추가형	Additional form
동작 · API	Behavior · API
코드 보기	View code
KLIC 적용	KLIC adaptation
출처 · 라이선스 ↗	Sources · licenses ↗
한 컴포넌트, 다섯 가지 쓰임.	One component, five ways to use it.
색상만 바꾸지 않고 구성과 사용 목적이 다른 형태를 모았습니다. 공개 MIT 패턴을 KLIC의 테마·토큰으로 적용했습니다.	Compare forms with different compositions and purposes. Public MIT patterns are adapted to KLIC themes and tokens.
100개 컴포넌트마다 기본형과 추가형 4개를 함께 비교하세요. 형태별 코드와 동작 가이드로 이어집니다.	Compare the default and four additional forms for each of 100 components, with source code and behavior guidance.
전체 소스 묶음	Complete source bundle
스타일·토큰·동작 파일은	Styles, tokens and interactions are included in the
에 포함됩니다.	bundle.

전체 리소스 문서 · 설치, 명령, 입력과 오류 처리 ↗	Full resource documentation · setup, commands, inputs and errors ↗
100개 컴포넌트, 실행 블록 197개, 준비 항목 83개의 메타데이터와 소스 참조	Metadata and source references for 100 components, 197 ready block examples and 83 planned blocks
본문으로 이동	Skip to main content
주 탐색	Primary navigation
라이브러리와 도구	Library and tools
컴포넌트와 블록 탐색	Browse components and blocks
라이브러리 전환	Library type
라이브러리 유형	Library type
사이드바 항목 검색	Search navigation
카테고리	Categories
카테고리 모두 펼치기	Expand all categories
카테고리 모두 접기	Collapse all categories
모든 컴포넌트	All components
모든 블록	All blocks
입력과 선택	Inputs and selection
데이터와 표시	Data and display
피드백	Feedback
탐색과 구조	Navigation and structure
버튼과 액션	Buttons and actions
텍스트와 폼	Text and forms
선택 컨트롤	Selection controls
날짜와 시간	Date and time
파일 입력	File inputs
표와 목록	Tables and lists
인물과 상태	People and status
차트와 진행률	Charts and progress
이미지와 미디어	Images and media
안내와 피드백	Messages and feedback
메뉴와 오버레이	Menus and overlays
탐색과 단계	Navigation and steps
배치와 컨테이너	Layout and containers
텍스트 표시	Text display
기타 컴포넌트	Other components
디자인 쇼케이스	Design showcase
디자인 시스템	Design system
디자인 토큰	Design tokens
폰트 라이브러리	Font library
리사이즈 실험실	Resize lab
설정	Settings
도움말과 문서	Help and documentation
현재 위치	Current location
라이브러리	Library
라이브러리 검색	Search library
무엇을 만들고 싶으세요?	What would you like to build?
도움말 및 키보드 단축키	Help and keyboard shortcuts
도움말 및 키보드 단축키 (?)	Help and keyboard shortcuts (?)
다크 모드로 전환	Switch to dark mode
라이트 모드로 전환	Switch to light mode
탐색 메뉴 열기	Open navigation
시작하기	Get started
검색 닫기	Close search
컴포넌트, 블록, 폰트, 토큰 검색…	Search components, blocks, fonts, and tokens…
검색 대상	Search scope
토큰으로 필터	Filter by token
토큰 필터: klic.component...	Token filter: klic.component...
↑ ↓ 이동	↑ ↓ Navigate
Enter 열기	Enter Open
ESC 닫기	ESC Close
전체	All
컴포넌트	Components
블록	Blocks
폰트	Fonts
토큰	Tokens
실험실	Lab
개발 연동	Developer integrations
조합	Compose
에이전트	Agents
변경 기록	Changelog
미리보기	Preview
사용 예제	Examples
API · 동작	API and behavior
기본 코드	Base code
설계 명세	Design specification
7 디멘션	7 Dimensions
7 디멘션 · 4계층	7 Dimensions · 4 layers
7 디멘션 · 4계층 ↗	7 Dimensions · 4 layers ↗
7 디멘션 명세	7 Dimensions
7 디멘션 설계	7 Dimensions
다차원 관점과 4단계 위계로 정립된 디자인 프레임워크	A design framework defined by multidimensional perspectives and a four-level hierarchy
4계층 토큰	Four-layer tokens
4계층	Four layers
컴포넌트 컬렉션	Component collection
블록 컬렉션	Block collection
컬렉션으로 보기	View collection
컬렉션으로 돌아가기	Back to collection
적용 가이드	Adoption guide
실제 소스	Source code
코드 복사	Copy code
프롬프트 복사	Copy prompt
공유 링크 복사	Copy share link
링크 복사	Copy link
즐겨찾기	Favorite
즐겨찾기만	Favorites only
전체화면	Full screen
전체화면 닫기	Exit full screen
데모 초기화	Reset demo
이럴 때 사용하세요	When to use
이 경우는 피해주세요	When to avoid
구성 요소	Anatomy
사용 지침	Usage guidance
분류와 조합	Classification and composition
함께 살펴볼 부품	Related components
이 부품을 사용하는 조합 가이드	Composition guides using this component
같은 언어로 연결되는 설계	Connected through one design language
이 컴포넌트의 값은 아래 KLIC 토큰으로 연결됩니다. 토큰을 선택해 원시 값까지의 참조 관계를 확인하세요.	This component uses the KLIC tokens below. Select a token to trace its reference back to a primitive value.
HTML 데모	HTML demo
React · 로컬 데모	React · local demo
CLI로 가져오기 →	Get with CLI →
파일 목록 ↗	File manifest ↗
API · 동작 ↗	API and behavior ↗
의존성	Dependencies
외부 패키지	External packages
공유 모듈	Shared modules
실행 환경	Runtime
설치 명령	Install command
스타일	Styles
화면과 스타일	Markup and styles
실행 구조	Runtime structure
확장 구조	Extended structure
확장 동작	Extended interactions
확장 스타일	Extended styles
정교함	Precision
일관성	Consistency
가능성	Possibility
좋은 디자인을,	Thoughtful design,
당신의 제품으로.	for your product.
아이디어가 인터페이스가 되는 순간.	Where ideas become interfaces.
섬세한 컴포넌트와 완성도 있는 블록으로	Use carefully crafted components and complete blocks
당신의 다음 경험을 만드세요.	to create your next experience.
블록 둘러보기	Explore blocks
컴포넌트 만나보기	Explore components
작은 디테일, 큰 차이.	Small details. A meaningful difference.
더 명확한 하루.	A clearer day.
샘플 데이터	Sample data
이번 주의 흐름	This week's progress
새로운 경험을 설계하세요	Design your next experience
디자인 작업 완료 표시	Mark design task complete
하나의 기준, 다채로운 경험.	One foundation. Many experiences.
디자인의 감각과 개발의 기준이 만나는 곳.	Where design craft meets engineering standards.
작은 디테일에서,	From small details,
완성된 화면까지.	to complete screens.
업무의 복잡함을 덜어내는 인터페이스.	Interfaces that make complex work clearer.
직접 열어보고, 움직여보고, 당신의 방식으로 바꾸세요.	Explore, interact, and adapt them to your own work.
전체 블록 탐색	Explore all blocks
업무 화면	Application screens
데이터 시각화	Data visualization
브랜드 경험	Brand experiences
보는 것에서,	From exploring,
만지는 경험으로.	to hands-on experience.
테마와 밀도를 바꿔보세요.	Try a different theme and density.
같은 설계가 다른 분위기로 연결됩니다.	See how the same design takes on a different character.
당신의 제품에	Expression that fits
맞는 표현.	your product.
페이지 모드 따르기	Follow page theme
Light — 선명하고 가볍게	Light — clear and open
Dark — 깊이 있고 차분하게	Dark — focused and calm
설정은 이 체험 영역에만 적용됩니다.	Settings apply only to this interactive preview.
다음 아이디어의 시작.	Your next idea starts here.
좋은 경험은 작은 선택에서 시작됩니다.	Good experiences begin with small choices.
프로젝트 이름	Project name
새로운 프로젝트	New project
팀과 함께 만들기	Create with your team
팀 공유	Team sharing
프로젝트 만들기	Create project
샘플 동작을 직접 체험해보세요.	Try the sample interactions.
명확한 위계.	Clear hierarchy.
기분 좋은 리듬.	A comfortable rhythm.
토큰의 연결 살펴보기	Explore token references
더 가까운 개발로.	closer to implementation.
브라우저에서 찾은 바로 그 컴포넌트.	The same components you discover in the browser.
에이전트와 터미널에서도 같은 이름으로 연결하세요.	Use the same names with agents and in your terminal.
검색하고, 구조를 확인하고, 소스를 가져오세요. 웹·MCP·CLI·API가 같은 레지스트리를 읽습니다.	Search, inspect the structure, and obtain the source. The web UI, MCP, CLI, and API read the same registry.
CLI 다운로드	Download CLI
MCP 연결 안내	MCP connection guide
OpenAPI 다운로드	Download OpenAPI
API 연결 확인	Check API connection
연결 설정 복사	Copy connection settings
연동 문서에서 자세히 보기	Read the integration documentation
외부 Codex 클라이언트용 설정입니다. ChatGPT에서는 사이트의 개인 플러그인을 사용하세요.	Configuration for an external Codex client. In ChatGPT, use the site's personal plugin.
다음 경험은,	Your next experience
여기서 시작됩니다.	starts here.
KLIC 라이브러리 시작하기	Explore the KLIC library
작은 요소에서, 더 좋은 제품으로.	From small elements to better products.
PRD 기반 인터랙티브 데모	Interactive demo based on the PRD
값의 출처가 보이는 설계.	Design with traceable values.
원시 값에서 컴포넌트까지. 네 계층의 연결을 탐색하고 변경의 영향을 확인하세요.	From primitive values to components. Explore the four layers and inspect how changes propagate.
JSON 내보내기	Export JSON
토큰 계층	Token layer
브랜드 프로필	Brand profile
토큰 경로 검색	Search token path
모두 펼치기	Expand all
모두 접기	Collapse all
일치하는 토큰이 없습니다.	No matching tokens.
참조의 흐름	Reference chain
각 값의 소유권과 연결을 따라가세요. 최종 해석값:	Follow each value's ownership and references. Resolved value:
변하지 않는 값의 척도	The primitive value scale
브랜드가 선택한 재료	Values selected by a brand
제품 안에서의 의미	Meaning within the product
실제 부품과의 연결	Connection to actual components
설계를 코드와 함께 가져가세요.	Take the design guidance with the code.
이 항목의 사용 원칙·금지 사항·접근성·상태·토큰 매핑을 한 계약으로 제공합니다.	This contract includes usage principles, restrictions, accessibility, states, and token mappings for this item.
DESIGN.md 다운로드	Download DESIGN.md
설계 계약 JSON	Design contract JSON
TypeScript 타입	TypeScript types
Do · 이럴 때 사용하세요	Do · When to use
Don't · 피해야 할 사용	Don't · Uses to avoid
밀도별 적용	Density guidance
사용 환경	Usage context
Normal · 기본	Normal · default
Compact · 반복 작업	Compact · repetitive work
Relaxed · 설명 중심	Relaxed · explanatory content
상태 변이와 복구	States and recovery
아래는 이 항목의 복구 지침을 설명하는 공통 상태 샘플입니다. 원본 블록의 상태를 변경하지 않습니다.	These shared state samples illustrate the item's recovery guidance. They do not change the original block's state.
상태 선택	Choose a state
로딩	Loading
빈 상태	Empty state
검색 결과 없음	No search results
오류	Error
내용을 불러오는 중입니다	Loading content
아직 항목이 없습니다	No items yet
조건에 맞는 결과가 없습니다	No results match your filters
요청을 완료하지 못했습니다	The request could not be completed
필터 초기화	Clear filters
다시 시도	Try again
첫 항목 만들기	Create the first item
접근성·키보드 체크리스트	Accessibility and keyboard checklist
CSS 변수와 Tailwind 연결	CSS variable and Tailwind mappings
CSS 변수	CSS variable
기본 값	Default value
토큰과 용도	Token and purpose
CSS 매핑 복사	Copy CSS mappings
Tailwind 예시 복사	Copy Tailwind examples
React · Vue · HTML 미리보기 삽입	Embed a preview in React, Vue, or HTML
프레임워크	Framework
비슷한 블록	Similar blocks
같은 분류·태그·공유 토큰을 기준으로 연결합니다.	Recommendations use shared categories, tags, and tokens.
연결된 추천이 없습니다.	No related blocks found.
블록 조합 플레이그라운드 →	Block composition playground →
프롬프트와 결과 비교 →	Prompts and comparison →
변경 기록·마이그레이션 →	Changelog and migration →
준비 항목은 실행 코드 내보내기를 제공하지 않습니다.	Planned items do not provide executable code exports.
샘플 행동을 확인했습니다.	Sample action confirmed.
실제 데이터 생성·재시도는 제품의 처리 함수에 연결하세요.	Connect actual data creation and retries to your product's handlers.
블록을 올려, 하나의 화면으로.	Combine blocks into one screen.
순서를 바꾸고 테마와 밀도를 비교하세요. 구성은 이 브라우저에 저장됩니다. 각 블록의 데이터는 독립적인 데모입니다.	Reorder blocks and compare themes and densities. Your composition is saved in this browser. Each block uses independent sample data.
블록 검색	Search blocks
이름으로 찾기	Find by name
추가할 블록	Block to add
블록 추가	Add block
테마	Theme
밀도	Density
열	Columns
한 열	One column
두 열	Two columns
구성 JSON 복사	Copy composition JSON
초기화	Reset
제거	Remove
첫 블록을 추가하세요.	Add your first block.
위 목록에서 블록을 골라 화면을 구성합니다.	Choose a block above to start composing your screen.
한 화면에는 최대 6개 블록을 추가할 수 있습니다.	You can add up to six blocks to one screen.
이 브라우저에서는 구성을 저장할 수 없습니다.	This browser cannot save the composition.
좋은 지시가, 일관된 화면으로.	Clear instructions create consistent screens.
컴포넌트와 블록의 DESIGN.md를 읽고, 같은 설계 계약으로 작업하세요.	Read each component or block's DESIGN.md and work from the same design contract.
TypeScript 계약	TypeScript contract
MCP 연결 가이드	MCP connection guide
조합 플레이그라운드	Composition playground
BEFORE · 제약 없는 지시	BEFORE · Unconstrained instructions
모양만 요청했을 때	When only appearance is specified
AFTER · 설계 계약을 포함한 지시	AFTER · Instructions with a design contract
구현과 검수 기준까지	Include implementation and review criteria
방문자	Visitors
요청	Requests
문제 설명용 재구성 예시입니다. 실제 고객 제품이나 AI 생성 실험 결과가 아닙니다.	This is an illustrative reconstruction, not an actual customer product or an AI generation experiment.
토큰·밀도·오류·접근성 기준이 빠져 있어 결과를 일관되게 검수하기 어렵습니다.	Without token, density, error, and accessibility requirements, results are difficult to review consistently.
비교 기준: 기간·단위, 블루 액션, 명시적 밀도, 오류 복구, 토큰 연결.	Comparison criteria: periods and units, blue actions, explicit density, error recovery, and token references.
이 기준을 살펴볼 실행 블록 →	Explore these criteria in a live block →
실제 적용을 확인할 샘플	Samples demonstrating adoption
아래는 운영 제품의 실적 사례가 아닌 현재 라이브러리의 실행 데모입니다.	These are executable library demos, not production customer case studies.
실행 · 소스 · DESIGN.md	Preview · Source · DESIGN.md
에이전트 실행 순서	Agent workflow
검색으로 준비된 항목을 찾습니다.	Search for an implemented item.
get 응답의 design 객체와 DESIGN.md에서 원칙·금지 사항·토큰을 읽습니다.	Read the principles, restrictions, and tokens in the get response's design object and DESIGN.md.
plan으로 의존 파일과 설치 범위를 확인합니다.	Use plan to inspect dependencies and the installation scope.
새 경로에 add로 받고, 소스와 고지를 확인한 다음 직접 빌드합니다.	Run add into a new directory, review source notices, then build it yourself.
체크리스트와 Gate 증거로 결과를 보고합니다.	Report the result with checklist and gate evidence.
변경을 알고, 안전하게 적용하세요.	Understand changes before adopting them.
라이브러리 화면 버전, 레지스트리 release, MCP 프로토콜 버전을 구분합니다.	The library UI version, registry release, and MCP protocol version are separate identifiers.
호환성 정책	Compatibility policy
이번 변경 적용하기	Adopting this release
검증과 배포 Gate	Verification and deployment gates
최신 CLI 다운로드 →	Download the latest CLI →
연동 가이드 →	Integration guide →
검색어 또는 토큰 조건을 바꿔보세요.	Try a different query or token filter.
검색 목록을 불러오지 못했습니다. 다시 검색해 주세요.	The search index could not be loaded. Please try again.
가이드·도구	Guides and tools
가용 폭	Available width
현재 항목에만 적용됩니다. 변경값은 자동 저장됩니다.	Applies only to this item. Changes are saved automatically.
설정 따르기	Use global settings
컬러	Color
차트	Chart
프로필 사진	Profile photos
완료율 링	Completion rings
전체 설정	Global settings
Customize 닫기	Close Customize
개별 설정 적용됨	Custom settings applied
이 항목의 조정값을 설정 기본값으로 복원	Restore this item's adjustments to the global defaults
표시 옵션과 React props를 포함한 전체 구성 복사	Copy the full configuration, including display options and React props
프리뷰 Width	Preview width
프리뷰 Zoom	Preview zoom
프리뷰 Radius	Preview radius
프리뷰 Text	Preview text size
우측 고정	Dock right
우측 도킹	Dock right
패널 고정	Pin panel
플로팅	Floating
도킹	Docked
분리	Undock
화면에 맞춤	Fit to viewport
가용 폭에 맞춤	Fit available width
원본 크기	Actual size
기본 1920px	Default 1920px
프리뷰 설정	Preview settings
프리뷰 폭	Preview width
좁은 컨테이너	Narrow container
중간 컨테이너	Medium container
넓은 컨테이너	Wide container
일치하는 컴포넌트가 없어요.	No matching components.
검색어나 분류를 바꿔 다시 찾아보세요.	Try a different query or category.
검색 초기화	Clear search
검색·분류 초기화	Clear search and filters
모든 용도	All uses
AI와 에이전트	AI and agents
공통 동작 계약과 상태 안내를 확인합니다.	Review the shared behavior contract and state guidance.
이 분류만 보기 ↗	View this category ↗
조건에 맞는 블록이 없습니다.	No blocks match these filters.
검색어나 분류를 바꿔보세요.	Try a different query or category.
일치하는 항목이 없습니다.	No matching items.
전체 블록 보기	View all blocks
구현 준비 중	Implementation planned
구현 준비 항목입니다.	This item is planned.
원본 카탈로그에는 있지만 실행 화면이 연결되어 있지 않습니다.	This item exists in the original catalog but has no connected executable preview.
주소가 바뀌었거나 등록되지 않은 블록입니다.	The address has changed or the block is not registered.
찾는 화면으로, 더 빠르게.	Find the right screen faster.
업무 화면부터 데이터 시각화까지.	From application screens to data visualization.
작은 요소를, 실제 업무 화면으로.	Turn small elements into useful application screens.
블록 검색하기	Search blocks
실행 화면을 준비하고 있습니다…	Preparing the interactive preview…
실행이 지연되고 있습니다. 초기화로 다시 시도할 수 있습니다.	The preview is taking longer than expected. Reset it to try again.
연결을 확인한 뒤 다시 시도해주세요.	Check your connection and try again.
소스를 불러오고 있습니다…	Loading source code…
잠시 후 다시 시도해 주세요.	Please try again shortly.
다시 불러오기	Reload
독립 뷰포트 · 샘플 데이터	Independent viewport · sample data
설계 계약을 불러오지 못했습니다. 페이지를 다시 열어주세요.	The design contract could not be loaded. Please reopen the page.
도구를 불러오는 중입니다…	Loading tools…
목록을 불러오지 못했습니다. 다시 열어주세요.	The list could not be loaded. Please reopen it.
에이전트 설계 가이드	Agent design guide
개발 연동 Docs	Developer documentation
개발 도구에 연결하기	Connect your development tools
하나의 계약, 네 개의 진입점.	One contract. Four entry points.
한 번 정의한 컴포넌트를, 사람과 도구가 같은 계약으로 사용합니다.	People and tools use the same contract for each component.
터미널에서 찾고, 읽고, 필요한 소스를 확인하세요.	Find items, inspect them, and obtain their source from your terminal.
에이전트와 카탈로그 사이에 명확한 도구 계약을 둡니다.	A clear tool contract connects agents to the catalog.
탭의 맥락을 유지하며 검색과 프리뷰를 연결합니다.	Keep the current tab's context while connecting search and preview.
검증 가능한 스키마와 안정된 항목 ID로 연결합니다.	Integrate through verifiable schemas and stable item IDs.
다운로드하고 바로 읽기	Download and start reading
명령 계약	Command contract
연결과 재현	Connection and reproducibility
에이전트에 KLIC 라이브러리 연결하기	Connect an agent to the KLIC library
4개의 공통 읽기 도구	Four shared read tools
로컬 stdio도 함께 지원	Local stdio support
전송과 오류 계약	Transport and error contract
지금 보고 있는 탭이 도구가 됩니다.	The current tab becomes a tool surface.
검색에서 프리뷰 열기까지	From search to opening a preview
등록과 해제도 계약에 포함	Registration and cleanup are part of the contract
정적 JSON을 명시적인 읽기 API로	An explicit read API for registry data
오류·캐시·호환성	Errors, caching, and compatibility
호스팅 응답 확인	Check hosted responses
코어 오류 코드	Core error codes
스냅샷 식별	Snapshot identifiers
배포와 권한	Deployment and permissions
실제 카탈로그로 요청해보세요.	Try a request against the actual catalog.
현재 브라우저 상태	Current browser status
등록 구조 · 실제 구현은 integrations/webmcp.mjs	Registration structure · implementation in integrations/webmcp.mjs
API가 있는 탭에서만 등록. 미지원 브라우저는 일반 탐색 유지	Registered only in supported tabs. Unsupported browsers retain normal navigation.
공개 카탈로그를 검색합니다.	Search the public catalog.
항목 상태와 상세 경로를 확인합니다.	Read item status and detail routes.
준비 상태를 검사한 뒤 실제 항목의 프리뷰로 이동합니다.	Check availability and open the item's preview.
도구	Tool
역할	Purpose
입력	Input
출력	Output
명령	Command
응답	Response
GET 경로	GET route
설치 계획	Installation plan
전체 항목과 기능 계약	All items and capability contract
MCP / WebMCP 공통 입력 스키마	Shared MCP / WebMCP input schema
연결 상태와 release	Connection status and release
실제 입력 스키마 열기 ↗	Open the actual input schema ↗
검색 · kind/status/token/group/limit/cursor 지원	Search · supports kind/status/token/group/limit/cursor
공식 사용 주소는	The official base URL is
샘플 데이터 · 변경 사항은 이 예제에서만 적용됩니다	Sample data · changes apply only to this demo
샘플 데이터가 초기화되었습니다	Sample data has been reset
데모 링크입니다 · 외부 페이지로 이동하지 않습니다	Demo link · external navigation is disabled
예제를 표시하지 못했습니다	The example could not be displayed
샘플 상태를 초기화해 다시 시도할 수 있습니다.	Reset the sample state to try again.
예제 다시 시작	Restart example
오류 정보	Error details
닫기	Close
펼치기	Expand
접기	Collapse
이전	Previous
다음	Next
처음으로	First
마지막으로	Last
추가 옵션	More options
추가	Add
줄이기	Decrease
검색	Search
삭제	Delete
편집	Edit
복사	Copy
확인	Confirm
완료	Done
필터 설정	Filter settings
새로 고침	Refresh
다운로드	Download
표시	Show
숨기기	Hide
알림	Notifications
메뉴	Menu
실행	Run
일시 정지	Pause
날짜 선택	Choose date
필터	Filter
옵션	Options
항목 선택	Select item
값 조절	Adjust value
입력 값	Input value
취소	Cancel
저장	Save
적용	Apply
다이어그램	Diagrams
템플릿	Templates
칸반 보드	Kanban boards
카드	Cards
대시보드	Dashboards
다이얼로그	Dialogs
네비게이션 바	Navigation bars
에디터	Editors
목록	Lists
데이터 편집	Data editing
시트	Sheets
플로우	Flows
앱 쉘	App shells
간트 차트	Gantt charts
온보딩	Onboarding
위저드	Wizards
캘린더	Calendars
인증	Authentication
일정	Schedules
통계	Statistics
타임라인	Timelines
폼 양식	Forms
프로필	Profiles
화이트보드	Whiteboards
기본 테이블	Basic tables
고급 테이블	Advanced tables
컬럼 제어	Column controls
행 제어	Row controls
래디얼 차트	Radial charts
생키 차트	Sankey charts
슬로프 차트	Slope charts
스파크라인	Sparklines
상태 트래커	Status trackers
막대 차트	Bar charts
라인 / 에어리어	Line / area charts
파이 / 도넛	Pie / donut charts
퍼넬 차트	Funnel charts
레이더 / 폴라	Radar / polar charts
기본 값	Default value
가이드라인	Guidelines
접근성	Accessibility
색상	Color
크기	Size
타이포그래피	Typography
레이아웃	Layout
간격	Spacing
표면	Surface
인터랙션	Interaction
페이지 다시 로드	Reload page
이 예제의 브라우저 로컬 상태를 서버 저장·인증·실제 알림으로 해석하지 않습니다.	The browser-local state in this example does not represent server storage, authentication, or real notifications.
이름·현재 값·설명을 해당 HTML 요소와 함께 제공합니다.	Provide a name, current value, and description with the relevant HTML element.
포커스 외곽선과 텍스트 대비를 Light/Dark에서 함께 유지합니다.	Maintain visible focus outlines and text contrast in both Light and Dark themes.
작은 화면·긴 한글·사용자 글자 배율에서 콘텐츠가 사라지지 않는지 확인합니다.	Verify that narrow screens, long Korean text, and user text scaling do not hide content.
실행 예제를 확인하고 업무 조합·작은 영역 적용 안내를 제품 맥락에 맞게 검토합니다.	Run the example, then review composition and narrow-layout guidance for your product context.
Light/Dark와 글자 크기 150%에서 레이블·내용·포커스를 확인합니다.	Check labels, content, and focus in Light and Dark themes at 150% text size.
정보의 의미를 색이나 아이콘에만 의존하지 않습니다.	Do not communicate meaning through color or icons alone.
필수 조건·오류·제약을 placeholder에만 숨기지 않습니다.	Do not hide requirements, errors, or restrictions only in placeholders.
의미와 이름	Meaning and name
주요 영역	Main content
상태와 보조 설명	State and supporting description
예제가 처음 표시됨	Initial display
포커스·탐색	Focus and navigation
사용자가 입력 또는 선택을 시작함	The user starts entering or selecting a value
기본 focus 표시와 DOM 읽기 순서를 유지합니다.	Preserve the native focus indicator and DOM reading order.
내용 변화	Content changes
값이나 선택이 변경됨	A value or selection changes
작은 화면·확대	Narrow screens and zoom
260px 영역 또는 사용자 글자 배율 적용	A 260px container or user text scaling
내용을 보존하며 줄바꿈하고 필요한 영역만 내부 스크롤합니다.	Preserve content, wrap text, and scroll only the regions that need it.
HTML·DOM 계약	HTML and DOM contract
컴포넌트 식별	Component identity
실행 예제의 최상위 컨테이너입니다.	The root container of the runnable example.
CSS 클래스	CSS class
component-expansion.css에서 구조와 의미 있는 상태를 지정합니다.	Structure and meaningful states are defined in component-expansion.css.
공통 스타일	Shared styles
개인 설정의 글자 배율을 따릅니다.	Respects the text scale in personal settings.
토큰 참조	Token reference
4계층으로 해석한 실제 역할 값을 사용합니다.	Uses semantic role values resolved through the four token layers.
선택한 브랜드·테마	Selected brand and theme
기본 구성	Basic configuration
업무 화면에 조합	Compose into a product screen
작은 영역에 배치	Place in a narrow container
미리보기의 컨테이너 폭을 줄여 확인하세요. 긴 한글 레이블은 줄바꿈하고 표·차트 등 폭을 유지해야 하는 내용만 내부에서 스크롤합니다.	Reduce the preview container width to check the layout. Wrap long Korean labels and use internal scrolling only for tables, charts, or content that needs a minimum width.
DOM 순서대로 실제 링크·버튼·입력에 접근합니다. 장식 요소는 Tab 순서에 넣지 않습니다.	Navigate real links, buttons, and inputs in DOM order. Keep decorative elements out of the Tab sequence.
문자 입력·방향키·Space	Text input, arrow keys, and Space
크기와 비율	Size and proportion
본문·레이블은 사용자 글자 크기 설정을 따릅니다. 중요도는 크기·굵기·문서 구조로 구분합니다.	Body text and labels respect user text-size settings. Express hierarchy with size, weight, and document structure.
색과 명도 대비	Color and contrast
회사 블루로 행동·선택을 표현하고 네이비 텍스트·중립 표면을 사용합니다. 위험은 문구와 레드로 구분합니다.	Use company blue for actions and selection, navy for text, and neutral surfaces. Identify danger with wording and red.
배치와 정렬	Layout and alignment
간격과 그룹화	Spacing and grouping
내부 레이블·주요 내용·설명 사이 간격과 외부 컨테이너 간격을 분리합니다.	Distinguish spacing within labels, primary content, and descriptions from spacing around the outer container.
표면과 깊이	Surface and depth
표면·경계·반경을 역할 토큰으로 지정하며 Customize 변경을 반영합니다.	Use role tokens for surfaces, borders, and radii, and apply Customize changes.
상호작용과 피드백	Interaction and feedback
배경 표면	Background surface
선택과 행동의 강조	Selection and action emphasis
100종 확장 구조·예제·명세	100-component structure, examples, and specifications
실제 DOM 상호작용	Actual DOM interactions
KLIC 토큰 기반 스타일	KLIC token-based styles
기능 범위 참고 · shadcn/ui 공식 목록	Scope reference · official shadcn/ui catalog
기능 범위 참고 · Ant Design 공식 목록	Scope reference · official Ant Design catalog
외부 의존성	External dependencies
브라우저 기본 HTML·CSS·DOM. KLIC 글자·간격·색상 토큰을 상속합니다.	Native browser HTML, CSS, and DOM. Inherits KLIC typography, spacing, and color tokens.
요청 제한과 무제한 권한	Request limits and unlimited access
채널	Channel
기본 제한 / 60초	Default limit / 60 seconds
권한 키가 있는 요청	Requests with an authorized key
무제한	Unlimited
CLI 소스 다운로드	CLI source downloads
기본 제한은 IP별로 서버에서 집계합니다. 초과 시 HTTP 429와	Default limits are tracked per IP on the server. Excess requests return HTTP 429 and
를 반환합니다. 공유 네트워크에서는 한도를 함께 사용합니다.	. Requests from a shared network use the same allowance.
권한 키는 서버에 등록된 SHA-256 값과 검증합니다. API·MCP는	Authorized keys are checked against SHA-256 hashes registered on the server. API and MCP requests use
, CLI는	, and the CLI uses the
환경 변수를 사용합니다. 브라우저 코드나 URL에 키를 넣지 마세요. 이 키는 사용량 제한만 면제하며 관리 권한이나 MCP 인증을 대신하지 않습니다.	environment variable. Keep keys out of browser code and URLs. These keys exempt usage limits only; they do not grant administrative rights or replace MCP authentication.
회수는 서버의	Revoke access by removing the corresponding hash from the server's
에서 해당 해시를 제거해 적용합니다. 공개 소스의 로컬 실행과 이미 받은 데이터를 사용하는 stdio·WebMCP 연산에는 서버 제한이 적용되지 않습니다.	. Server limits do not apply to local execution of public source code or stdio and WebMCP operations on data already downloaded.
캔버스	Canvas
기본 1920px · 화면에 맞춰 축소해 표시합니다.	1920px by default · scaled to fit the available space.
화면 맞춤	Fit to screen
스타일	Style
표시	Display
플로팅 패널로 전환	Switch to floating panel
오른쪽 패널에 고정	Dock panel on the right
오른쪽에 도킹	Dock on the right
Customize 닫기	Close Customize
현재 항목에만 적용됩니다. 변경값은 자동 저장됩니다.	Applies to this item only. Changes are saved automatically.
이 항목의 조정값을 기본 1920px 프리뷰로 복원	Restore this item's settings to the default 1920px preview
이 항목을 기본 1920px 프리뷰로 복원했습니다.	Restored this item to the default 1920px preview.
캔버스 배율	Canvas scale
프리뷰 CSS를 복사했습니다. 동작 옵션은 JSON을 함께 사용하세요.	Preview CSS copied. Include the JSON configuration for behavior options.
현재 프리뷰의 전체 구성을 복사했습니다.	Copied the complete configuration of this preview.
표시 옵션과 React props를 포함한 전체 구성 복사	Copy the complete configuration, including display options and React props
링크·버튼·스크롤 영역에 키보드로 접근함	Keyboard navigation reaches links, buttons, and scroll regions
데이터·주제·표시 영역이 달라짐	Data, subject, or display area changes
component-expansion.css · component-expansion.mjs · component-interactions.mjs · 기존 KLIC 토큰/스타일. native 동작 외 상호작용은 initComponentInteractions가 필요합니다.	component-expansion.css · component-expansion.mjs · component-interactions.mjs · existing KLIC tokens and styles. Interactions beyond native browser behavior require initComponentInteractions.
7 디멘션 명세	7 Dimensions specification
디자인 디멘션	Design dimension
7 디멘션, 하나의 경험.	7 Dimensions, one experience.
다차원 관점과 4단계 위계로 정립된 디자인 프레임워크	A design framework built on multidimensional perspectives and a four-level hierarchy
7 디멘션은 화면과 행동을 검토하는 관점입니다. 4단계 위계는 값의 소유권과 참조 관계를 정합니다. 같은 컴포넌트를 두 구조에서 함께 설명합니다.	7 Dimensions provides perspectives for reviewing interfaces and behavior. The four-level hierarchy defines ownership and references between values. Both structures describe the same component.
화면과 행동을 보는 7개의 관점	Seven perspectives on interface and behavior
콘텐츠의 길이와 조작 영역을 함께 설계합니다. 고정 높이로 긴 문구를 자르지 않습니다.	Design for both content length and target size. Do not clip long text to a fixed height.
본문·레이블·제목의 역할을 구분합니다. 좁은 화면에서는 줄바꿈과 재배치를 먼저 적용합니다.	Distinguish body text, labels, and headings. On narrow screens, first wrap and rearrange content.
색과 대비	Color and contrast
블루는 행동과 선택을, 네이비와 중립색은 정보 위계를 표현합니다. 상태는 색만으로 전달하지 않습니다.	Blue identifies actions and selection; navy and neutral colors express information hierarchy. Communicate states with more than color alone.
DOM 읽기 순서와 시각 순서를 맞춥니다. 표·다이어그램의 스크롤은 해당 영역에서 관리합니다.	Match DOM reading order to visual order. Keep scrolling for tables and diagrams within their own regions.
레이블·컨트롤·도움말을 하나의 그룹으로 묶습니다. 밀도는 글자 축소가 아니라 간격 조정으로 표현합니다.	Group labels, controls, and help text together. Adjust density through spacing rather than smaller text.
표면·반경·경계·그림자의 역할을 나눕니다. 도킹 패널은 문서의 보조 영역으로 다룹니다.	Give surfaces, radii, borders, and shadows distinct roles. Treat a docked panel as a supporting document region.
로딩·빈 상태·오류·완료를 구분하고 복구 행동을 제공합니다. 포커스와 선택 상태는 함께 유지합니다.	Distinguish loading, empty, error, and complete states and provide recovery actions. Preserve focus and selection together.
값을 연결하는 4단계 위계	Four levels that connect values
원시 값	Primitive values
색상 값·길이·폰트처럼 재사용할 재료를 정의합니다.	Define reusable materials such as color values, lengths, and fonts.
브랜드 선택	Brand selections
브랜드가 사용할 재료를 선택합니다.	Choose the materials used by the brand.
의미와 역할	Meaning and role
행동·표면·텍스트·간격의 목적을 정의합니다.	Define the purpose of actions, surfaces, text, and spacing.
컴포넌트 적용	Component application
실제 부품의 속성을 의미 토큰에 연결합니다.	Connect component properties to semantic tokens.
예를 들어 버튼의 높이는 컴포넌트에서 의미 토큰을 참조하고, 의미 토큰은 브랜드 선택을 거쳐 원시 값으로 이어집니다. 브랜드 변경은 참조를 유지한 채 해당 단계에서 처리합니다.	For example, button height references a semantic token, which resolves through a brand selection to a primitive value. Apply brand changes at that layer while preserving references.
토큰의 참조 관계 확인하기 →	Explore token references →
설계 이후의 검증: R / A / D / I / U / S	Validation after design: R / A / D / I / U / S
KLIC-WCAG-KRDS의 검증 분류를 별도로 사용합니다. 이 분류는 7 디멘션이나 토큰 위계를 대체하지 않습니다.	Use the KLIC-WCAG-KRDS validation categories separately. They do not replace 7 Dimensions or the token hierarchy.
반응형	Responsive
폭과 확대율에 따른 재배치·정보 보존을 확인합니다.	Check reflow and information preservation at different widths and zoom levels.
키보드·이름·역할·대비·보조기술 동작을 확인합니다.	Check keyboard access, names, roles, contrast, and assistive-technology behavior.
디자인	Design
시각적 위계·토큰·표현의 일관성을 확인합니다.	Check visual hierarchy, tokens, and presentation consistency.
인터페이스	Interface
컨트롤의 상태와 상호작용 계약을 확인합니다.	Check control states and interaction contracts.
사용자 흐름	User flow
완료·취소·실패 후 복구 경로를 확인합니다.	Check paths for completion, cancellation, and recovery from failure.
보안	Security
신뢰 경계·입력 처리·권한과 남용 방지를 확인합니다.	Check trust boundaries, input handling, permissions, and abuse prevention.
적용할 때 확인할 기준	Checks when applying the framework
대비	Contrast
일반 텍스트는 4.5:1, 큰 텍스트는 3:1을 기준으로 실제 전경·배경 조합을 측정합니다. 비활성 요소·장식·로고 등 WCAG의 적용 예외도 구분합니다.	Measure actual foreground and background combinations against 4.5:1 for normal text and 3:1 for large text. Identify WCAG exceptions such as inactive controls, decoration, and logos.
조작 영역	Target size
포인터 대상은 최소 24×24 CSS px을 기준으로 검토합니다. 충분한 대상 간 간격, 동등한 대체 컨트롤, 문장 속 링크, 브라우저 기본 컨트롤, 필수 표현의 예외를 함께 판단합니다.	Review pointer targets against a minimum of 24×24 CSS pixels. Assess the exceptions for sufficient spacing, equivalent controls, inline links, browser-native controls, and essential presentation.
재배치와 확대	Reflow and zoom
세로 읽기 콘텐츠는 320 CSS px 너비에서도 정보와 기능을 보존합니다. 1280px 화면을 400%로 확대하면 같은 논리 너비가 됩니다. 표·지도·다이어그램처럼 의미에 두 방향 배치가 필요한 영역은 예외 여부를 따로 확인합니다.	Preserve information and functionality for vertically read content at a width of 320 CSS pixels, equivalent to a 1280px viewport at 400% zoom. Evaluate exceptions separately for tables, maps, and diagrams whose meaning requires a two-dimensional layout.
키보드와 도킹	Keyboard and docking
포커스는 항상 보이게 유지합니다. 데스크톱의 도킹 Customize는 보조 영역이며, 배경을 비활성화하거나 키보드를 가두지 않습니다. 닫은 뒤에는 실행 버튼으로 포커스를 돌려줍니다.	Keep focus visible. The docked desktop Customize panel is a supporting region; it neither disables the background nor traps the keyboard. Return focus to its trigger after closing.
문서와 도구의 시각 기준	Visual standards for documentation and tools
Figma의 Foundations에서 확인한 본문 16/24, 보조 문구 14/20, 레이블 13/18, 큰 제목 48/56과 4·8·12·16·24·32 간격을 문서 화면의 리듬에 반영합니다. KLIC의 블루 계열과 4단계 토큰 참조를 유지하고, 실행 예제의 내부 스타일은 별도로 조정합니다.	Documentation follows the Figma Foundations typography: body 16/24, supporting text 14/20, labels 13/18, large headings 48/56, and spacing of 4, 8, 12, 16, 24, and 32. Preserve KLIC blue and four-level token references; adjust internal example styles separately.
프리뷰는 기본 1920px 논리 너비로 구성하고 화면 맞춤으로 축소 표시합니다. 100%로 전환하면 실제 크기에서 스크롤하며 확인할 수 있습니다. 축소된 프리뷰만으로 본문의 가독성이나 조작 영역 검사를 완료했다고 판단하지 않습니다.	Previews use a 1920px logical width by default and scale to fit. Switch to 100% to inspect and scroll at actual size. A scaled preview alone is not sufficient to verify text readability or target size.
참고 자료와 검증 범위	References and validation scope
KLIC-WCAG-KRDS · 참조한 커밋 204b027	KLIC-WCAG-KRDS · referenced commit 204b027
ReUI Dashboard 1 · 블록과 의존성 확인 방식	ReUI Dashboard 1 · block and dependency presentation
Figma Foundations · 문서 타이포그래피와 간격	Figma Foundations · documentation typography and spacing
이 페이지는 설계 원칙과 검증 기준을 정리합니다. KLIC-WCAG-KRDS 전체 규칙 통과, WCAG 적합성 인증 또는 모든 화면의 보조기술 검증 완료를 의미하지 않습니다. 실제 제품에서는 각 상태와 화면을 별도로 검사하고 증거를 남겨야 합니다.	This page documents design principles and validation criteria. It does not claim that every KLIC-WCAG-KRDS rule passes, certify WCAG conformance, or establish assistive-technology validation for every screen. Test each product screen and state separately and retain evidence.
공유 레지스트리 아키텍처	Shared registry architecture
사이트의 Registry v1을 읽고 CLI·MCP와 같은 검증 함수로 검색합니다.	Read this site's Registry v1 and search with the same validation functions used by CLI and MCP.
실행하면 응답 수, 버전과 실제 항목을 확인할 수 있습니다.	Run a query to inspect the result count, version, and actual items.
터미널에서 탐색하고 소스 참조를 읽습니다.	Browse and read source references from your terminal.
Bun 권장 · Node.js 호환 · 단일 파일	Bun preferred · Node.js compatible · single file
에이전트가 같은 카탈로그를 도구로 조회합니다.	Agents query the same catalog through tools.
원격 HTTP + 로컬 stdio · 읽기 도구 4개	Remote HTTP + local stdio · 4 read tools
열린 탭의 카탈로그를 읽고 프리뷰를 엽니다.	Read the open tab's catalog and open previews.
지원 브라우저 · 등록 도구 5개	Supported browsers · 5 registered tools
검색 API와 버전이 고정된 JSON 스냅샷을 제공합니다.	Provides a search API and versioned JSON snapshots.
공개 GET · OpenAPI 3.1	Public GET · OpenAPI 3.1
공유 검증·검색·상세 조회. plan/add로 소스 묶음 확인·저장	Shared validation, search, and item details. Inspect and save source bundles with plan/add.
API가 있는 탭에서만 등록. 미지원 브라우저는 일반 탐색 유지	Registered only in tabs with the API. Standard navigation remains available in unsupported browsers.
POST /mcp · Sites에서 접근 인증 · 공개 디자인 자료 조회	POST /mcp · access authenticated by Sites · public design resources
가 항목의 키입니다. 추가 필드는 v1에서 허용하고 호환되지 않는 구조 변경은 v2 경로로 분리합니다.	is the item key. Version 1 permits additional fields; incompatible structural changes use a separate v2 path.
를 모든 채널에서 공유합니다. 기본 검색에는 실행 항목만 나오며 준비 항목의 소스·프리뷰를 생성하지 않습니다.	is shared across all channels. Searches show runnable items by default. Planned items do not generate source code or previews.
향후 쓰기는 읽기와 분리한 scope, 서버 입력 검증, idempotency key와 감사 로그를 먼저 연결합니다. 서버 도구는 읽기 전용입니다. CLI add는 사용자가 지정한 새 폴더에 검증된 파일만 저장합니다.	Future writes require scopes separate from reads, server input validation, idempotency keys, and audit logs. Server tools are read-only. CLI add saves only verified files into a new folder specified by the user.
소스의 라이선스 헤더, 공용 모듈과 스타일 의존성을 유지합니다. 공개 카탈로그는 원본 코드의 라이선스를 변경하지 않습니다.	Preserve source license headers, shared modules, and style dependencies. The public catalog does not change the original code licenses.
다운로드형 단일 파일 CLI는 Bun 실행을 기본으로 합니다. Node.js는 npm/npx 호환 소비 경로로 지원합니다. 로컬 체크아웃에서는	The downloadable single-file CLI prefers Bun. Node.js remains supported for npm/npx consumers. A local checkout can use
을 사용할 수 있습니다.	.
Terminal · 공개 레지스트리	Terminal · public registry
은 저장 없이 파일 목록·용량·의존성을 확인합니다.	inspects the file list, size, and dependencies without saving.
는 존재하지 않는 새 폴더에만 저장합니다. 파일별 SHA-256 검증이 끝나기 전에는 파일을 만들지 않으며 npm 명령을 실행하지 않습니다.	saves only into a new folder that does not already exist. No files are created until each SHA-256 check completes, and no npm commands are executed.
항목 목록, total, nextCursor	Item list, total, nextCursor
검색어 200자 이하 + 목록 옵션	Query of up to 200 characters + list options
이름·ID·설명·태그 검색	Search by name, ID, description, and tags
상태, 프리뷰 경로, 소스·의존성	Status, preview path, source, and dependencies
원본 헤더를 보존한 참조 코드	Reference code preserving original headers
소스 묶음 manifest와 정확한 명령	Source bundle manifest and exact commands
kind, ID, --out 새폴더, 선택 --dry-run	kind, ID, --out new-folder, optional --dry-run
의존 소스·스타일·자산을 포함한 독립 작업 폴더	Standalone working folder including dependent source, styles, and assets
버전, 기능, 범위	Version, capabilities, and scope
--base 또는 --local	--base or --local
stdio JSON-RPC 서버	stdio JSON-RPC server
이며 최대 100개입니다. 다음 페이지는 응답의	, with a maximum of 100 items. For the next page, pass the response's
를 그대로 사용합니다. 정상 종료는 0, 실패는 1이며 오류 JSON은 stderr로 출력합니다.	unchanged. Exit code 0 indicates success and 1 indicates failure. Error JSON is written to stderr.
프로젝트 루트 · 로컬 스냅샷	Project root · local snapshot
로 같은 계약의 다른 배포를 선택할 수 있습니다. HTTP는 localhost 개발 환경에만 허용합니다. 각 응답의	selects another deployment with the same contract. HTTP is allowed only for localhost development. Each response's
로 읽은 스냅샷을 식별할 수 있습니다.	identifies the snapshot you read.
add는 독립 실행용 작업 폴더를 생성합니다. 블록은 공용 React 런타임을, HTML 컴포넌트는 라이브러리 런타임을 함께 제공합니다. 최소 파일만 설치하는 방식이 아닙니다. README와 라이선스를 확인한 뒤 bun install · bun run dev를 직접 실행하세요.	add creates a standalone working folder. Blocks include the shared React runtime; HTML components include the library runtime. It does not install only a minimal set of files. Review the README and licenses, then run bun install and bun run dev yourself.
에서 공개 디자인 자료를 조회합니다. 인증이 요청되면 클라이언트의 안내를 따르세요. ChatGPT의 개인 플러그인 연결과 OAuth 리소스는 Sites가 별도로 관리합니다. ChatGPT에서는 이 사이트를 게시할 때 생성된 개인 플러그인을 설치·연결하세요.	provides access to public design resources. Follow your client's prompts when authentication is required. Sites separately manages ChatGPT personal plugin connections and OAuth resources. In ChatGPT, install and connect the personal plugin generated when this site was published.
Cursor 등 원격 HTTP MCP 설정 예시	Example remote HTTP MCP configuration for Cursor and other clients
클라이언트별 HTTP 설정 형식과 인증 지원이 다를 수 있습니다. 위 설정은 외부 클라이언트용이며 현재 연결이 완료되었다는 뜻은 아닙니다. ChatGPT에서는 Plugins → Personal → Created by you에서 KLIC 플러그인을 사용하세요.	HTTP configuration and authentication support vary by client. This example is for external clients and does not establish that a connection is active. In ChatGPT, use the KLIC plugin under Plugins → Personal → Created by you.
컴포넌트·블록 검색, 상태·분류·페이지 선택	Search components and blocks; select status, category, and page
상세 정보, 소스, 의존성·문서 링크	Details, source, dependencies, and documentation links
파일 manifest와 CLI 명령. 실제 설치는 수행하지 않음	File manifest and CLI commands; does not perform installation
버전·기능·범위 조회	Read version, capabilities, and scope
실제 입력 스키마 열기 ↗	Open the actual input schema ↗
후	after downloading, run
로 실행합니다. stdio의 command는 bun, args는 파일 절대 경로와 mcp로 지정합니다. Node.js 실행은 npm/npx 호환 소비 경로로 유지합니다. 로컬 체크아웃에서는 --local을 추가할 수 있습니다.	. Set command to bun and args to the absolute file path and mcp. Node.js remains available for npm/npx compatibility. Add --local when using a local checkout.
원격 전송은 JSON 응답을 사용하는 stateless HTTP입니다. 2026-07-28 요청별 메타데이터를 지원하며, 2025-11-25 호환 클라이언트는 initialize 이후 MCP-Protocol-Version 헤더를 전송합니다. 도메인 오류는 isError: true, 프로토콜 오류는 JSON-RPC error로 반환합니다. 요청 본문은 1 MiB로 제한합니다.	Remote transport uses stateless HTTP with JSON responses. It supports per-request metadata for 2026-07-28; compatible 2025-11-25 clients send the MCP-Protocol-Version header after initialize. Domain errors return isError: true and protocol errors use JSON-RPC error. Request bodies are limited to 1 MiB.
WebMCP는 열린 브라우저 페이지의 동작을 에이전트에게 설명합니다. 페이지를 닫아도 동작하는 원격 MCP 서버와 수명이 다릅니다. 지원 API를 확인한 뒤 현재 탭에만 등록합니다.	WebMCP describes the open browser page's actions to agents. Its lifetime differs from a remote MCP server that continues running after the page closes. Tools register only in the current tab after checking API support.
WebMCP는 실험 단계의 브라우저 API입니다. 현재 공식 imperative 인터페이스인	WebMCP is an experimental browser API. It uses the current official imperative interface,
을 사용하고, 지원하지 않는 환경에서도 검색·프리뷰·문서는 정상 동작합니다.	. Search, previews, and documentation continue working where the API is unsupported.
공개 카탈로그를 검색합니다.	Search the public catalog.
항목 상태와 상세 경로를 확인합니다.	Check the item status and detail route.
준비 상태를 검사한 뒤 실제 항목의 프리뷰로 이동합니다.	Check readiness, then navigate to the item's actual preview.
는 기능과 버전을 읽습니다. 탐색 도구는	reads capabilities and version. Navigation tools declare
로 표시해 페이지 변경을 명확히 알립니다. 설정 변경·소스 설치·게시 도구는 등록하지 않습니다.	to make page changes explicit. No tools are registered for changing settings, installing source, or publishing.
등록 구조 · 실제 구현은 integrations/webmcp.mjs	Registration structure · implementation in integrations/webmcp.mjs
모든 입력을 공통 코어에서 다시 검증하고, 등록 실패는 일반 UI에 영향을 주지 않습니다.	The shared core revalidates all inputs. Registration failures do not affect the standard UI.
로 탭 수명주기 종료 시 등록을 해제합니다. 사용할 수 없는 항목은 준비 상태 오류로 반환합니다.	unregisters tools at the end of the tab lifecycle. Unavailable items return a readiness error.
Chrome 공식 API 가이드	Official Chrome API guide
Community Group 초안	Community Group draft
공식 사용 주소는	The official site address is
입니다. 공개 JSON 조회와 서버 검색 필터를 제공합니다. 전체 레지스트리를 받아 공통 코어에서 검색할 수도 있으며, 서버 쓰기 endpoint는 제공하지 않습니다.	. It provides public JSON reads and server-side search filters. You can also download the full registry and search with the shared core. No server write endpoints are provided.
검색 · kind/status/token/group/limit/cursor 지원	Search · supports kind/status/token/group/limit/cursor
설치 계획	Installation plan
연결 상태와 release	Connection status and release
전체 항목과 기능 계약	All items and capability contracts
하나의 항목 · kind = component | block	One item · kind = component | block
버전·건수·연동 상태·정책	Version, counts, integration status, and policies
MCP / WebMCP 공통 입력 스키마	Shared MCP / WebMCP input schemas
HTTP · 공개 JSON 읽기	HTTP · read public JSON
Browser · 상태를 확인하고 필터링	Browser · inspect status and filter
잘못된 검색 입력은 400, 없는 항목은 404, 지원하지 않는 메서드는 405로 응답합니다. error.code와 error.message를 확인하세요.	Invalid search inputs return 400, missing items return 404, and unsupported methods return 405. Check error.code and error.message.
을 CLI와 도구에서 동일하게 사용합니다.	are used consistently by the CLI and tools.
는 카탈로그 메타데이터의 해시입니다. 소스 바이트 검증은 별도의 block-sources manifest를 사용합니다. 갱신 시 다른 release의 페이지 결과를 섞지 않습니다.	is a hash of catalog metadata. Source byte verification uses a separate block-sources manifest. Do not mix paginated results from different releases when data updates.
현재 공개 데이터는 인증 없이 읽습니다. 검색 API는 교차 출처 읽기를 지원합니다. 원격 MCP 접근은 Sites 인증을 따르며 서버 쓰기 기능은 제공하지 않습니다.	Public data can currently be read without authentication. The search API supports cross-origin reads. Remote MCP access follows Sites authentication and provides no server write capabilities.
한 번 정의한 컴포넌트를, 사람과 도구가 같은 계약으로 사용합니다.	People and tools use the same contract for each component definition.
터미널에서 찾고, 읽고, 필요한 소스를 확인하세요.	Find, read, and inspect the source you need from your terminal.
에이전트와 카탈로그 사이에 명확한 도구 계약을 둡니다.	A clear tool contract connects agents to the catalog.
탭의 맥락을 유지하며 검색과 프리뷰를 연결합니다.	Connect search and previews while preserving the tab context.
검증 가능한 스키마와 안정된 항목 ID로 연결합니다.	Integrate through verifiable schemas and stable item IDs.
명령 예시를 복사했습니다.	Command example copied.
Registry v1을 읽고 있습니다…	Loading Registry v1…
조건에 맞는 항목이 없습니다.	No items match these criteria.
레지스트리를 읽지 못했습니다. 잠시 후 다시 실행하세요.	Could not read the registry. Try again shortly.
API 요청을 완료하지 못했습니다.	Could not complete the API request.
지금 사용할 수 있는 범위	Available capabilities
영역	Area
상태	State
실제 동작	Actual behavior
제공 중	Available
로컬 실행	Local execution
브라우저 조건부	Browser-dependent
원격 MCP	Remote MCP
HTTP 서버	HTTP server
제품으로 확장할 때도 유지할 기준	Principles to preserve when extending into products
안정된 ID와 버전	Stable IDs and versions
준비 상태도 데이터로	Readiness as data
서버 권한을 명시적으로	Explicit server permissions
출처와 의존성 보존	Preserve provenance and dependencies
klic.mjs 다운로드	Download klic.mjs
없음	None
기본	Default
아직 등록하지 않았습니다.	Tools have not been registered yet.
이 브라우저는 WebMCP 등록 API를 제공하지 않습니다. JSON API와 CLI는 사용할 수 있습니다.	This browser does not provide the WebMCP registration API. JSON API and CLI remain available.
도구 등록을 완료하지 못했습니다. 일반 탐색은 계속 사용할 수 있습니다.	Tool registration could not be completed. Standard navigation remains available.
탭의 도구 등록을 종료했습니다.	Tool registration for this tab has ended.
값의 출처가 보이는 설계.	Design with visible value origins.
원시 값에서 컴포넌트까지. 네 계층의 연결을 탐색하고 변경의 영향을 확인하세요.	From primitive values to components. Explore the four-layer reference chain and inspect the impact of changes.
변하지 않는 값의 척도	The underlying value scale
브랜드가 선택한 재료	Materials selected by the brand
제품 안에서의 의미	Meaning within the product
실제 부품과의 연결	Connections to actual components
토큰 계층	Token layer
토큰 경로 검색	Search token paths
토큰 경로 검색…	Search token paths…
A/B는 PRD의 구조 검증용 fixture입니다. B에서는 control 높이만 바뀌며 Primitive·spacing·radius는 유지됩니다. 색과 반경은 이 사이트의 데모용 신규 결정입니다. JSON은 축소 토큰 예제이며 범용 DTCG 검증 완료를 뜻하지 않습니다.	A/B are fixtures for verifying the structure described in the PRD. B changes only control height, preserving Primitive values, spacing, and radius. Colors and radii are decisions made for this demo. The JSON is a reduced token example and does not claim general DTCG validation.
참조의 흐름	Reference chain
각 값의 소유권과 연결을 따라가세요. 최종 해석값:	Follow ownership and references for each value. Final resolved value:
root 16px을 가정하면 A: 2 × 16 = 32px, B: 2.25 × 16 = 36px입니다. rem이 정본이며 px은 조건부 환산입니다.	Assuming a 16px root size, A is 2 × 16 = 32px and B is 2.25 × 16 = 36px. rem is canonical; px is a conditional conversion.
일치하는 토큰이 없습니다.	No matching tokens.
모두 펼치기	Expand all
모두 접기	Collapse all
브랜드 정책	Brand policy
역할과 의미	Roles and meaning
블록의 실제 사용 값	Values used by the block
바 & 컬럼	Bar & column
에어리어 & 라인	Area & line
파이 & 도넛	Pie & donut
레이더 & 폴라	Radar & polar
고급 기능	Advanced features
드래그 앤 드롭	Drag and drop
행 확장	Row expansion
필터링	Filtering
그룹화	Grouping
가상화	Virtualization
업무 화면부터 데이터 시각화까지.	From product workflows to data visualization.
직접 실행하고, 7 디멘션으로 읽고, 4계층 토큰으로 연결하세요.	Run the examples, explore 7 Dimensions, and connect them to four-layer tokens.
디자인 디멘션과 토큰 계층	Design dimensions and token layers
실행 연결 예시	Connected runnable examples
구현 모듈	Implementation modules
세부 분류	Categories
React · 로컬 데모	React · local demo
원시 값 · 값을 소유하는 계층	Primitive value · the owning layer
Primitive → Brand → Semantic → Component. 배치 순서·포커스 이동·스크롤 책임은 7 디멘션의 동작 규칙으로 관리합니다.	Primitive → Brand → Semantic → Component. Layout order, focus movement, and scroll ownership follow the behavior rules of 7 Dimensions.
컴포넌트 캔버스 · 넓은 화면은 좌우로 스크롤	Component canvas · scroll horizontally for wide previews
블록 캔버스 · 넓은 화면은 좌우로 스크롤	Block canvas · scroll horizontally for wide previews
값을 따라가는 구조	A structure for tracing values
이 블록에서 실제로 사용하는 역할 토큰입니다. 토큰을 선택하면 Primitive까지 참조를 추적합니다.	These role tokens are used by this block. Select a token to trace its references back to Primitive values.
공식 사용 주소	Official site address
페이지 표면	Page surface
컨테이너 표면	Container surface
보조 표면	Secondary surface
선택 표면	Selected surface
본문	Body text
보조 문구	Supporting text
구분 경계	Divider border
컨트롤 경계	Control border
주요 행동	Primary action
주요 행동 호버	Primary action hover
강조 위 문구	Text on accent
완료 의미	Completion role
완료 표면	Completion surface
주의 의미	Warning role
주의 표면	Warning surface
오류 의미	Error role
오류 표면	Error surface
콘텐츠 최대 폭	Maximum content width
섹션 간격	Section gap
컨테이너 안쪽 간격	Container padding
컨트롤 최소 높이	Minimum control height
표면 반경	Surface radius
아이콘 크기	Icon size
본문 크기	Body text size
레이블 크기	Label size
2026.10.24 · 7 디멘션과 개발 환경 개선	2026.10.24 · 7 Dimensions and developer workflow improvements
7 디멘션: 다차원 관점과 4단계 위계로 정립된 디자인 프레임워크.	7 Dimensions: a design framework built on multidimensional perspectives and a four-level hierarchy.
1920px 기본 프리뷰, Fit / 100%와 우측 Customize 도킹.	1920px default previews, Fit / 100% modes, and a docked Customize panel on the right.
블록별 지연 로딩과 실제 소스 기반 Dependencies.	Lazy loading per block and Dependencies derived from actual source imports.
한국어·영어 인터페이스, 컴포넌트 설명과 공통 가이드 번역.	Korean and English interfaces, component descriptions, and shared guidance.
API·MCP·다운로드 서버 요청 제한과 권한 키 무제한 정책.	Server request limits for API, MCP, and downloads, with unlimited usage for authorized keys.
변경 계획과 검증 기준 →	Change plan and verification criteria →
2026.10.24 · 설계 산출물과 탐색 보강	2026.10.24 · Design deliverables and navigation improvements
선택 메뉴·설명 카드의 선 강조 제거, 계층형 토큰 워터폴 도입.	Removed line accents from selected navigation and explanatory cards; added a hierarchical token waterfall.
컴포넌트·블록별 DESIGN.md·JSON·TypeScript 계약과 토큰 매핑.	DESIGN.md, JSON, TypeScript contracts, and token mappings for each component and block.
공통 검색의 token·group 필터와 관련 블록 추천.	Token and group filters in shared search, plus related block recommendations.
조합 플레이그라운드와 프롬프트 비교 가이드.	Composition playground and prompt comparison guide.
공유용 Open Graph 이미지와 항목별 공유 URL.	Open Graph sharing images and per-item share URLs.
현재 레지스트리 release:	Current registry release:
schemaVersion 1.0 안에서는 선택 필드를 추가합니다. 기존 ID·의미·필수 입력을 바꾸는 변경은 새 스키마 버전과 마이그레이션 문서가 필요합니다. 클라이언트는 모르는 응답 필드를 무시하고 필수 값과 타입은 검증해야 합니다.	Optional fields may be added within schemaVersion 1.0. Changes to existing IDs, semantics, or required inputs need a new schema version and migration guide. Clients should ignore unknown response fields and validate required values and types.
ready는 실행 예제의 연결 상태입니다. 제품 보안·접근성·외부 연동의 전체 인증을 뜻하지 않습니다.	ready indicates that a runnable example is connected. It does not certify product security, accessibility, or external integrations.
기존 kind·id 조회와 설치 명령은 유지합니다.	Keep existing kind/id queries and installation commands.
get 응답의 선택 필드 design을 읽고, 없으면 기존 동작으로 복귀합니다.	Read the optional design field in get responses, falling back to existing behavior when it is absent.
새 token·group 검색 조건은 최신 CLI와 서버에서 사용합니다.	Use the new token and group search filters with the latest CLI and server.
새 번들의 DESIGN.md와 klic-design.d.ts를 함께 검토합니다.	Review DESIGN.md and klic-design.d.ts together in new bundles.
캐시된 이전 CLI는 최신 파일로 교체하고 registry release를 확인합니다.	Replace cached older CLI files with the latest version and check the registry release.
기준선 → 공통 계약 → 코어·번들 → 채널별 실행 → 교차 채널 E2E → 릴리스 후보 → 배포 후 확인 순서로 검증합니다. 건너뛴 필수 검사는 통과가 아닙니다. 현재 문서는 정책이며 모든 외부 클라이언트 인증 완료를 주장하지 않습니다.	Verify in this order: baseline → shared contract → core and bundles → channel execution → cross-channel E2E → release candidate → post-deployment checks. Skipped required checks are not passes. This document states policy and does not claim completed authentication tests for every external client.
블록 컬렉션을 불러오고 있습니다…	Loading the block collection…
블록을 찾을 수 없습니다.	Block not found.
블록을 불러오지 못했습니다.	Could not load the block.
원본에 실행 화면이 없는 항목	No runnable screen in the original source
실제 샘플 화면	Actual sample screen
블록 스튜디오	Block studio
설계가 연결되는 곳.	Where design comes together.
블록 조합 플레이그라운드	Block composition playground
화면을 만드는 조합	Compositions that build screens
분류를 고르고 필요한 블록을 찾아보세요.	Choose a category and find the blocks you need.
분류	Category
구현	Implementation
이 미리보기에서 사용하는 실제 TSX 파일	The actual TSX file used by this preview
상태 연결은 BlockApp.tsx, 스타일은 index.css, 값은 KLIC 토큰에 있습니다. 상대 경로의 의존 파일을 함께 사용하세요.	State wiring is in BlockApp.tsx, styles are in index.css, and values come from KLIC tokens. Include the dependencies referenced by relative paths.
전체 소스 목록	Full source manifest
인물 레지스트리	Portrait registry
설정 모델	Preferences model
KLIC 토큰	KLIC tokens
7 디멘션의 설계 규칙과 4계층 토큰 계약은 다른 탭에서 확인할 수 있습니다.	Explore the 7 Dimensions design rules and four-layer token contract in the other tabs.
실행 가능한 블록 찾기	Find runnable blocks
각 디멘션은 구현이 지켜야 할 규칙입니다. 토큰 연결과 동작 검증은 각각 확인합니다.	Each dimension defines implementation rules. Check token references and behavior validation separately.
적용 규칙	Application rules
검증 범위와 남은 확인	Validation scope and remaining checks
값의 출처부터 블록까지	From value origins to blocks
브랜드 아이덴티티	Brand identity
조합에도 기준이 있습니다.	Compositions have standards, too.
직접 만든 블록을 KLIC의 언어로 연결했습니다.	Original blocks connected through KLIC's design language.
4계층은 값의 출처를, 7 디멘션은 사용 경험의 규칙을 설명합니다.	Four layers explain where values come from; 7 Dimensions describes the rules of the user experience.
원본에서 가져온 것과 바꾼 것	What was retained and changed
KLIC의 시각 언어	KLIC's visual language
회사 블루, 네이비 텍스트, 중립 표면을 사용합니다. 완료는 블루와 문구, 주의는 앰버, 오류는 레드로 구별합니다. Paperlogy·Pretendard·Spoqa 폰트를 미리보기에 연결했습니다.	Use company blue, navy text, and neutral surfaces. Completion uses blue and explicit text, warnings use amber, and errors use red. Previews include Paperlogy, Pretendard, and Spoqa fonts.
값과 동작의 분리	Separating values from behavior
25개 블록 역할을 4계층 토큰으로 연결했습니다. 간격·높이·색·반경의 값과 배치·키보드·오버레이의 동작 계약을 구분해 기록했습니다.	Twenty-five block roles connect to four-layer tokens. Spacing, height, color, and radius values are documented separately from layout, keyboard, and overlay behavior contracts.
정직한 예제 범위	Clear example scope
외부 백엔드 없이 샘플 데이터와 로컬 상태로 실행합니다. 원본의 가짜 설치 명령과 검증 완료 표시는 제거하고, 실제 적용 소스를 제공합니다. 담당자 사진은 생성한 가상 인물로 일관되게 연결하고, 상품·교육 이미지는 원본 샘플 자료를 사용합니다.	Examples run on sample data and local state without an external backend. Placeholder installation commands and unverified completion labels have been removed; actual source is provided. Staff portraits consistently use generated fictional people, while product and course images use the original sample materials.
제품 적용 전 확인할 점	Checks before product use
데이터 API·인증·영속 저장·서버 검증은 연결되어 있지 않습니다. 각 블록의 키보드 조작, 보조 기술, 작은 화면, 복합 상태를 제품 요구사항에 맞게 추가 검증하세요. 7 디멘션는 접근성 인증이나 모든 상태의 검증 완료를 의미하지 않습니다.	Data APIs, authentication, persistence, and server validation are not connected. Validate each block's keyboard operation, assistive technology, narrow-screen layout, and combined states for your product. 7 Dimensions does not certify accessibility or establish that every state has been tested.
제공 자료	Provided materials
원본 식별 정보	Original source identity
기본 A · Light 기준입니다. Tailwind 예시는 속성에 맞춰 text/bg/border/min-h/gap 등을 선택하세요. 제품 컴포넌트 props가 아닌 설계 메타데이터 타입을 제공합니다.	Based on default A and Light. Choose Tailwind utilities such as text, bg, border, min-h, and gap for the relevant property. Types describe design metadata rather than product component props.
출처 파일 경로 미제공	Source file path not provided
`.trim().split('\n').map(row=>row.split('\t')));

Object.assign(messages,legacyGuideAMessages,legacyGuideBMessages,blockDescriptionAMessages,blockDescriptionBMessages);

Object.assign(messages,blockContractAMessages,blockContractBMessages,guideApiMessages);

Object.assign(messages,siteDocsMessages,designGuidanceMessages);

Object.assign(messages,diagramWorkbenchMessages);
Object.assign(messages,{
 '블록 보기':'Block view',
 '전체 블록':'All blocks',
 '전체 컴포넌트':'All components',
 '컴포넌트 보기':'Component view',
 '전체 항목 보기':'View all items',
 '전체 컴포넌트 보기':'View all components',
 '컴포넌트와 블록 전체 목록':'All components and blocks',
 '항목별 미리보기, 실제 소스와 설계 적용 지침을 살펴보세요.':'Explore previews, source code and design guidance for each item.',
 '저장한 컴포넌트가 없습니다. 메뉴의 별을 눌러 추가하세요.':'No saved components. Select a star in the menu to add one.',
 '저장한 블록이 없습니다. 메뉴의 별을 눌러 추가하세요.':'No saved blocks. Select a star in the menu to add one.',
 '처음 열면 가용 폭에 맞춥니다. 고정 폭은 직접 선택하세요.':'Opens at the available width. Choose a fixed width when needed.',
 '이 항목을 화면 맞춤 프리뷰로 복원':'Restore this item to fit the available width',
 '이 항목을 화면 맞춤 프리뷰로 복원했습니다.':'Restored this item to fit the available width.',
});

Object.assign(messages,connectorMessages);

Object.assign(messages,timelineMessages);

Object.assign(messages,{
 '페이지 바탕':'Page background',
 '콘텐츠 표면':'Content surfaces',
 '본문과 제목':'Body text and headings',
 '보조 정보':'Supporting information',
 '주요 행동 · 항상 블루':'Primary actions · always blue',
 '분류와 보조 강조':'Categories and secondary emphasis',
 '의미를 유지하는 상태':'Status with consistent meaning',
 '서로 구분되는 데이터 계열':'Distinct data series',
 '선택한 색상을 실제 역할로 확인하세요. 값은 현재 설정의 4계층 토큰에서 해석됩니다.':'Inspect the selected colors by role. Values resolve from the current four-layer tokens.',
 'Paper는 밝은 기본 바탕, Ink는 깊은 중립 대비입니다. 각 팔레트는 Light와 Dark를 모두 지원합니다.':'Paper provides a light foundation; Ink offers deep neutral contrast. Every palette supports Light and Dark.',
 '실행은 블루로, 팔레트 고유색은 분류와 데이터 표현에 사용합니다.':'Blue identifies actions. Each palette’s distinct color supports categories and data.',
 '화면의 색을 선택하세요.':'Choose your color language.',
 '색상 팔레트는 표면과 텍스트, 보조 강조와 차트의 조합입니다. 명도와 재질은 별도로 조절합니다.':'A color palette combines surfaces, text, secondary accents and charts. Adjust brightness and material separately.',
 '명도 모드':'Brightness mode',
 '색상 팔레트':'Color palette',
 '추천':'Recommended',
 '레퍼런스 컬러 보드':'Reference color board',
 '색의 출처와 역할':'Color sources and roles',
 '레퍼런스의 색을 역할에 맞게 조정했습니다. 주요 행동은 회사 블루를 유지합니다.':'Reference colors are adapted to their roles. Primary actions retain the company blue.',
 '재질과 세부 컬러':'Material and color details',
 '색상 팔레트와 독립적으로 표면 효과와 세부 값을 조절합니다.':'Adjust surface effects and individual values independently of the color palette.',
 '테마 기본':'Theme default',
 '테마 팔레트':'Theme palette',
 '색상 테마':'Color theme',
 '테마 따르기':'Follow color theme',
});
Object.assign(messages,{
 '따뜻한 종이 바탕에 네이비 텍스트와 선명한 블루를 더한 기본 테마입니다.':'A warm paper foundation with navy text and crisp blue accents.',
 '그래파이트 중립색과 블루로 콘텐츠의 대비를 또렷하게 만듭니다.':'Graphite neutrals and blue give content a clear contrast.',
 '바이올렛 보조색으로 분석 결과와 데이터 분류를 구분합니다.':'Violet secondary accents distinguish analysis and data categories.',
 '일렉트릭 블루를 중심으로 기술 제품의 선명한 인상을 만듭니다.':'Electric blue brings clarity to technical product interfaces.',
 '파우더 블루의 차분한 표면으로 데이터와 작업에 집중합니다.':'Calm powder blue surfaces keep attention on data and tasks.',
 '코퍼 보조색으로 연결된 서비스와 카테고리에 온기를 더합니다.':'Copper accents bring warmth to connected services and categories.',
 '시그널 레드를 보조 분류색으로 사용한 또렷한 운영 화면입니다.':'A clear operations palette with signal red category accents.',
 '라벤더의 부드러운 표면으로 협업과 일상 업무를 담습니다.':'Soft lavender surfaces support collaboration and daily work.',
 '골드 옐로를 보조색으로 사용해 핵심 데이터에 시선을 모읍니다.':'Golden yellow secondary accents draw attention to key data.',
});

Object.assign(messages,{
 '기존 기본':'Original default',
 '기본과 추천':'Default and recommended',
 '기존 KLIC을 유지하거나, 따뜻한 Paper를 선택하세요.':'Keep the original KLIC palette or choose the warmer Paper palette.',
 '기본과 추천 색상 테마':'Default and recommended color themes',
 '추가 팔레트':'More palettes',
 '추가 색상 테마':'Additional color themes',
 '기존 KLIC의 화이트·네이비·블루 배색을 그대로 유지하는 기본 테마입니다.':'The original KLIC white, navy and blue palette, preserved as the default.',
 '따뜻한 종이 바탕에 네이비 텍스트와 선명한 블루를 더한 추천 테마입니다.':'A recommended warm paper foundation with navy text and crisp blue accents.',
});

Object.assign(messages,{
 "현재 적용": "Currently applied",
 "전체 정의": "All definitions",
 "토큰 표시 범위": "Token display scope",
 "현재 적용은 모든 Component에서 이어지는 참조를 보여줍니다.": "Currently applied follows references from every Component.",
 "전체 토큰 경로 검색…": "Search all token paths…",
 "검색은 전체 정의의 네 계층에서 찾습니다.": "Search covers all definitions across all four layers.",
 "현재 Component에서 사용하는 값만 표시합니다. 다른 선택지의 값은 전체 정의에서 볼 수 있습니다.": "Showing values used by current Components. All definitions includes other choices.",
 "선택하지 않은 테마와 재질을 포함한 모든 정의를 표시합니다.": "Showing all definitions, including unselected themes and materials.",
 "JSON 내보내기는 전체 정의를 포함합니다.": "JSON export includes all definitions.",
 "선택한 테마를 프로젝트로 가져오세요.": "Bring the selected theme into your project.",
 "CLI로 테마 CSS, 4계층 토큰 JSON과 적용 도우미를 받으세요. React나 전체 사이트 코드 없이 사용할 수 있습니다.": "Get theme CSS, four-layer token JSON and an apply helper through the CLI. Use them without React or the full site.",
 "명령 복사": "Copy command",
 "CLI를 받은 폴더에서 명령을 실행하세요. 현재 선택한 브랜드, 재질과 명도 모드를 함께 전달합니다.": "Run this command from the folder containing the CLI. It includes your selected brand, material and brightness mode.",
 "현재 테마의 CSS 변수": "CSS variables for the selected theme",
 "원본 4계층 토큰 정의": "Original four-layer token definitions",
 "프로젝트에 테마 적용": "Apply the theme to your project",
 "외부 프로젝트 테마 연결": "Connect a theme to an external project",
 "CLI 받기": "Get the CLI",
 "테마 목록 JSON": "Theme list JSON",
 "선택 테마 JSON": "Selected theme JSON",
 "선택 설정 적용 계획": "Selected settings apply plan",
 "원격 HTTP + 로컬 stdio · 읽기 도구 9개": "Remote HTTP + local stdio · 9 read tools",
 "지원 브라우저 · 등록 도구 8개": "Supported browsers · 8 registered tools",
 "테마를 외부 제품에 적용하기": "Apply a theme to another product",
 "컬러 테마, 브랜드 프로필, 재질과 모드를 각각 선택합니다. 테마 전달은 기존 소스 add와 별도인 theme 명령 그룹을 사용합니다.": "Choose color theme, brand profile, material and mode independently. Theme delivery uses the separate theme command group.",
 "theme add는 파일 크기와 SHA-256을 검증한 뒤 새 폴더에만 저장합니다. 기존 경로를 덮어쓰지 않으며 npm·shell 명령을 실행하지 않습니다. --base 또는 --local도 지원합니다.": "theme add verifies file size and SHA-256 before saving only to a new folder. It never overwrites an existing path or runs npm or shell commands. It also supports --base or --local.",
 "묶음에는 theme.css, 4계층 tokens.light.json과 tokens.dark.json, theme.config.json, apply-theme.mjs, vanilla index.html, 표준 테마 엔진, 등록된 폰트 파일 전체와 fonts/FONT-NOTICES.md가 포함됩니다.": "The bundle includes theme.css, four-layer tokens.light.json and tokens.dark.json, theme.config.json, apply-theme.mjs, vanilla index.html, the canonical theme engine, all registered font files and fonts/FONT-NOTICES.md.",
 "초기 CSS는 선택한 테마·프로필의 Light/Dark와 공통 재질 선택자를 담고, helper는 같은 표준 엔진으로 컨텍스트 전환과 system 모드를 지원합니다. 앱 루트 밖 포털에도 helper를 연결해 컨텍스트를 함께 갱신하고, 해제 시 destroy()를 호출합니다.": "Initial CSS contains the selected palette/profile in Light/Dark and shared material selectors. The helper uses the canonical engine for context switching and system mode. Also attach a helper to portals outside the app root, synchronize context updates, and call destroy() on disposal.",
 "Paperlogy 400·600·700과 Pretendard 400은 실제 폰트 파일입니다. 나머지 Pretendard 굵기는 브라우저가 합성합니다. fonts/FONT-NOTICES.md의 라이선스 고지를 보존하세요.": "Paperlogy 400, 600 and 700 and Pretendard 400 are real font files. Other Pretendard weights are synthesized by the browser. Preserve the license notices in fonts/FONT-NOTICES.md.",
 "7개의 공통 읽기 도구": "7 shared read tools",
 "테마 계획 도구는 파일을 저장하거나 외부 제품의 설정을 변경하지 않습니다. 실제 저장은 사용자가 실행하는 CLI theme add가 담당합니다.": "The theme plan tool does not save files or change an external product. Local delivery is performed by the user's CLI theme add command.",
 "읽기 도구 9개와 klic_open_item·klic_open_motion을 합쳐 현재 탭에 11개 도구를 등록합니다. klic_list_themes, klic_get_theme, klic_get_theme_install_plan은 테마 목록·정의·설치 계획을 읽습니다.": "The tab registers 9 read tools plus klic_open_item and klic_open_motion, for 11 total. klic_list_themes, klic_get_theme and klic_get_theme_install_plan read the theme catalog, definitions and installation plans."
});

Object.assign(messages,{'키트는 선택한 프로필의 기본값을 사용합니다. 개별 화면 조정값은 설정 JSON으로 함께 저장하세요.':'The kit uses the selected profile defaults. Save individual screen adjustments alongside it with the settings JSON.'});


Object.assign(messages,{"공개 읽기 전용 HTTP MCP 설정입니다. ChatGPT에서는 사이트의 개인 플러그인을 사용하세요.": "Public read-only HTTP MCP configuration. In ChatGPT, use the site's personal plugin.", "POST /api/v1/mcp · 공개 디자인 자료 조회 · 관리형 플러그인은 Sites 인증": "POST /api/v1/mcp · Public design reads · Managed plugin uses Sites authentication", "클라이언트별 HTTP 설정 형식이 다를 수 있습니다. 외부 연결에는 /api/v1/mcp를 사용하고 기존 커스텀 도메인의 /mcp는 사용하지 마세요. 위 설정은 외부 클라이언트용이며 현재 연결이 완료되었다는 뜻은 아닙니다. ChatGPT에서는 Plugins → Personal → Created by you에서 KLIC 플러그인을 사용하세요.": "Client HTTP configuration formats vary. Use /api/v1/mcp externally rather than /mcp on the custom domain. This configuration targets external clients and does not indicate a completed connection. In ChatGPT, use the KLIC plugin under Plugins → Personal → Created by you."});

Object.assign(messages,{"에서 로그인 없이 공개 JSON API와 같은 디자인 자료를 조회합니다. ChatGPT의 개인 플러그인은 별도의 관리형 /mcp 경로와 Sites 인증을 사용합니다. ChatGPT에서는 이 사이트를 게시할 때 생성된 개인 플러그인을 설치·연결하세요.": "provides the same public design assets as the JSON API without a login. The ChatGPT personal plugin uses a separate managed /mcp route and Sites authentication. In ChatGPT, install/connect the personal plugin generated when this site was published."});

Object.assign(messages,{"현재 공개 데이터는 인증 없이 읽습니다. 검색 API는 교차 출처 읽기를 지원합니다. 외부 MCP는 같은 공개 자료를 로그인 없이 조회하며, ChatGPT의 개인 플러그인은 Sites 인증을 사용합니다. 서버 쓰기 기능은 제공하지 않습니다.": "Public data is read without authentication. Search supports cross-origin reads. External MCP reads the same public assets without login; the ChatGPT personal plugin uses Sites authentication. No server-write tools are available."});

Object.assign(messages,affectMessages);

// Shared architecture guidance used by framework and component specification views.
Object.assign(messages,{
 '모션 레시피는 컴포넌트·블록 설치 항목과 별도 읽기 카탈로그로 유지하되, 브라우저 검색·미리보기·상세 UI는 KLIC Interface Library 홈페이지의 #motion 메뉴에서 제공한다. 읽기 API·CLI·MCP·WebMCP도 같은 카탈로그 스냅샷을 사용한다. NPM 패키지는 홈페이지 배포와 별도 산출물로 관리한다. 현재 발행하는 모션은 KLIC 자체 제작 콘텐츠로 한정한다.':'Keep motion recipes in a read-only catalog separate from component and block installation items. Keep browser search, previews and details within the KLIC Interface Library homepage at #motion. The read API, CLI, MCP and WebMCP use the same catalog snapshot. Manage the npm package as an artifact separate from website deployment. Limit published motions to KLIC-authored content.',
 '규칙마다 구현 책임을 연결합니다.':'Connect each rule to its implementation responsibility.',
 '값은 토큰, 읽기 순서와 정보 관계는 DOM, 배치와 넘침은 CSS recipe, 실행과 복구는 상태·동작 계약에서 책임집니다. 프리셋은 실제 API가 허용한 설정 조합으로 관리하고, 충돌 시 정보·조작·접근성을 먼저 보존합니다.':'Tokens own values; the DOM owns reading order and information relationships; CSS recipes own layout and overflow; behavior contracts own execution and recovery. Presets combine settings allowed by the actual API. Resolve conflicts by preserving information, operability and accessibility first.',
 '설계 책임과 조합 기준 보기 →':'View responsibility and composition rules →',
 '공통 구현 책임':'Shared implementation responsibility',
 '관점별 규칙은 값·구조·동작의 책임을 나누어 구현합니다.':'Implement each dimension by separating responsibility for values, structure and behavior.',
 '설계 책임·프리셋·충돌 해결 기준 ↗':'Responsibilities, presets and conflict resolution ↗',
 '에서 연결된 FR/AT와 검증 범위를 확인하세요.':'provides the linked FR/AT records and verification scope.',
 '토큰: 컨트롤 크기·아이콘·콘텐츠 폭 / 구조·행동: min-height·패딩·줄바꿈·실제 hit area는 컴포넌트 recipe와 DOM에서 보장':'Tokens: control size, icons and content width. Structure and behavior: component recipes and the DOM handle min-height, padding, wrapping and actual hit areas.',
 '토큰: 등록 family·역할별 크기·굵기 / 구조·행동: 행간·자간·줄바꿈·반응형 조건은 지원 recipe에서 정의; 등록되지 않은 타입을 가정하지 않음':'Tokens: registered families, role sizes and weights. Structure and behavior: supported recipes define line height, tracking, wrapping and responsive conditions without assuming unregistered token types.',
 '토큰: 행동·선택·텍스트·경계·상태의 역할 색 / 구조·행동: 레이블·아이콘·상태 속성으로 의미 전달; 합성 표면의 실제 대비는 토큰 밖에서 측정':'Tokens: role colors for actions, selection, text, borders and status. Structure and behavior: labels, icons and state attributes convey meaning; measure actual composited-surface contrast separately.',
 '토큰: 콘텐츠 최대 폭·패널 폭 등 등록된 공간 역할 / 구조·행동: DOM 읽기 순서·배치 전환·스크롤 소유권·Portal 구조':'Tokens: registered spatial roles including maximum content and panel widths. Structure and behavior: DOM reading order, layout transitions, scroll ownership and Portal structure.',
 '토큰: 내부 gap·padding·그룹 사이 간격과 승인 밀도 매핑 / 구조·행동: label·fieldset·legend·describedby 등의 관계; 창 폭만으로 밀도를 변경하지 않음':'Tokens: internal gaps, padding, group spacing and approved density mappings. Structure and behavior: label, fieldset, legend and describedby relationships; window width alone does not change density.',
 '토큰: 표면색·반경·경계 및 지원 color/dimension 소재 leaf / 구조·행동: blur·shadow 합성 recipe·stacking·보조 패널과 모달 구분·불투명 fallback':'Tokens: surfaces, radii, borders and supported color/dimension material leaves. Structure and behavior: blur and shadow recipes, stacking, auxiliary-panel versus modal behavior and opaque fallbacks.',
 '토큰: focus·선택·진행·성공·경고·오류의 시각 역할 / 구조·행동: 키보드·focus 이동·비동기 전이·실행 차단·입력 보존·복구 경로':'Tokens: visual roles for focus, selection, progress, success, warnings and errors. Structure and behavior: keyboard operation, focus movement, asynchronous transitions, execution blocking, input preservation and recovery.'
});

Object.assign(messages,{'결정 검토·도구 실행·추천·응답 관리를 구분합니다.':'Distinguish decision review, tool execution, recommendations and response management.'});

Object.assign(messages,Object.fromEntries(Object.values(BLOCK_IDENTITIES).flatMap(v=>[[v.title,v.enTitle],[v.description,v.enDescription],[v.variantNote,v.enVariantNote]])));

Object.assign(messages,{'2026.10.27 · 탐색·체험 설정·제공 범위 정합성':'2026.10.27 · Catalog, preview settings and delivery scope','AI 분류 설명, 확장 컴포넌트 문구, 실행·준비 집계와 필터를 수정했습니다. 공통 작업 화면의 통합/독립 경로를 구분하고, 반경 직접 입력과 체험 설정 저장을 연결했습니다. ID와 토큰 경로는 유지합니다.':'Corrected AI group descriptions, component guidance, catalog counts and availability filters. Distinguished integrated and standalone task views, and added direct radius entry and saved preview settings. IDs and token paths are unchanged.','버전 구분과 설정 이관 안내 →':'Version identifiers and settings migration →'});

Object.assign(messages,{'npm 패키지':'npm package',[libraryScopeText('ko')]:libraryScopeText('en')});

Object.assign(messages,{'모든 모션':'All motions','전체 모션':'All motions','모션 보기':'Motion view','전체 모션 페이지':'All motions page','저장한 모션이 없습니다. 메뉴의 별을 눌러 추가하세요.':'No saved motions. Use a star in the menu to add one.','즐겨찾는 컴포넌트':'Favorite components','즐겨찾는 블록':'Favorite blocks','전체 보기':'View all'});

Object.assign(messages,{'전체 모션 보기':'View all motions'});
