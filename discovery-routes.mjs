export const DISCOVERY_ROUTES=[
 ['/collections/diagrams','다이어그램 블록','Diagram blocks','기본 연결부터 분기·합류·상태 전이까지, 목적에 맞는 실행 예제와 사용 기준을 비교합니다.','Compare working examples for basic paths, routing, parallel joins and state transitions.'],
 ['/guides/tokens','4계층 토큰 탐색','Four-layer token explorer','실제 토큰의 참조 체인과 CSS 변수, 사용하는 컴포넌트·블록을 함께 확인합니다.','Trace actual token references, CSS variables and the components and blocks that use them.'],
 ['/guides/fonts','폰트 적용 가이드','Font adoption guide','KLIC에 포함된 폰트 파일과 두께, 원문 메타데이터와 적용 범위를 확인합니다.','Review bundled font weights, source metadata and adoption scope.'],
 ['/guides/mcp-cli','MCP·CLI·API 연결','Connect MCP, CLI and API','같은 항목 ID와 설계 계약을 웹·에이전트·터미널에서 조회합니다.','Read the same item IDs and design contracts across the web, agents and terminal.'],
 ['/guides/mcp-recipes','에이전트 실전 레시피','Agent workflow recipes','검색·설계 계약·소스 계획을 연결해 구현 범위를 지키는 프롬프트를 만듭니다.','Connect search, design contracts and source plans in a scope-aware implementation workflow.'],
 ['/guides/density','UI 밀도 비교','UI density comparison','글자 크기를 유지하면서 간격과 컨트롤 밀도를 비교하는 설명용 예제입니다.','Compare spacing and control density while preserving text size in an illustrative example.'],
 ['/guides/starters','화면 구성 스타터','Screen composition starters','현재 실행 가능한 항목을 목적별로 묶고 조합 전 확인할 조건을 제공합니다.','Curated ready examples with checks before composing a product screen.'],
 ['/guides/accessibility','접근성·예외 상태 체크','Accessibility and recovery checks','키보드·초점·빈 상태·오류 복구를 실제 계약과 연결해 점검합니다.','Review keyboard, focus, empty states and recovery against actual design contracts.']
].map(([path,ko,en,description,enDescription])=>({path,ko,en,description,enDescription}));
