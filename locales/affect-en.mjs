/** Authored English for the KLIC AI component families and composed showcases. */
export const affectMessages=Object.fromEntries(`
결정 인박스	Decision inbox
답변을 기다리는 결정을 차례로 검토합니다.	Review pending decisions one at a time.
답변 확인·접기·남은 개수·실행 취소	Answer confirmation, folding, remaining count and undo
도구 실행 카드	Tool call card
에이전트의 도구 호출과 결과를 투명하게 보여줍니다.	Make an agent's tool calls and results visible.
인수·결과 공개·복사·재시도·실행 그룹	Argument and result disclosure, copying, retry and call groups
스마트 추천	Smart recommendation
근거와 신뢰도를 읽고 대안을 선택합니다.	Read the reasoning and confidence, then choose an alternative.
대안 선택·수락·실행 취소·신호 강도	Alternative selection, acceptance, undo and signal strength
메시지 액션	Message actions
응답을 복사하고 버전과 피드백을 관리합니다.	Copy responses and manage versions and feedback.
복사·버전·재생성·평가·음성 읽기	Copying, versions, regeneration, ratings and read-aloud
KLIC 7 디멘션 · 4계층	KLIC 7 Dimensions · 4 layers
KLIC의 native HTML adaptation입니다. React props를 제공하지 않으며 모든 실행은 브라우저 로컬 데모입니다.	This is a KLIC native HTML adaptation. It does not expose React props; all actions run locally in the browser demo.
결과와 근거를 읽은 뒤 사용자가 행동을 선택할 수 있게 합니다.	Let users read the result and reasoning before choosing an action.
실제 서버 실행이나 메시지 전송처럼 설명하지 않습니다.	Do not describe these examples as real server execution or message delivery.
색만으로 상태를 전달하지 않습니다.	Do not communicate state through color alone.
트레이	Tray
작업 맥락과 현재 상태	Task context and current state
핵심 내용과 근거	Main content and reasoning
행동	Actions
확인·취소·복구와 상태 안내	Confirmation, cancellation, recovery and status guidance
첫 표시	Initial display
로컬 데모와 작업 목적을 안내합니다.	Explain the local demo and the purpose of the task.
탐색	Navigation
버튼과 disclosure의 현재 상태를 동기화합니다.	Keep button and disclosure states synchronized.
변경과 복구	Changes and recovery
인스턴스별 상태를 갱신하고 결과를 status 영역에 알립니다.	Update each instance independently and announce results in the status region.
DOM 식별	DOM identification
독립된 예제 루트와 고유한 접근성 연결 ID입니다.	Identifies an independent example root and unique IDs for accessibility relationships.
한 번 설치	Install once
문서 위임 이벤트를 설치합니다. 반환 cleanup 함수는 지연 작업과 이벤트를 해제합니다.	Install delegated document events. The returned cleanup function releases delayed work and event handlers.
실행 가능한 컨트롤을 DOM 순서대로 탐색합니다.	Navigate available controls in DOM order.
native 버튼을 실행합니다.	Activate a native button.
대안 또는 피드백 영역을 닫고 여는 버튼으로 포커스를 돌립니다.	Close the alternatives or feedback region and return focus to its trigger.
모든 disclosure에 aria-expanded와 aria-controls를 연결합니다.	Connect every disclosure with aria-expanded and aria-controls.
상태 변경은 role=status로 알립니다. 음성 미지원 환경은 명확한 안내를 표시합니다.	Announce state changes with role=status. Clearly explain when speech is unsupported.
hidden 콘텐츠는 Tab 탐색에서 제외합니다. 긴 한글과 JSON은 내부에서 줄바꿈·스크롤합니다.	Exclude hidden content from Tab navigation. Wrap or internally scroll long Korean text and JSON.
부모 폭에 맞추고 내용에 따라 높이가 늘어납니다.	Fit the parent width and let height grow with content.
선택한 KLIC 글꼴과 글자 배율을 상속합니다.	Inherit the selected KLIC font and text scale.
블루 행동·네이비 텍스트·뉴트럴 표면을 토큰으로 소비합니다.	Use tokens for blue actions, navy text and neutral surfaces.
맥락·내용·행동을 읽는 순서대로 배치합니다.	Arrange context, content and actions in reading order.
트레이 여백과 카드 내부 여백을 구분합니다.	Keep tray spacing separate from padding inside the card.
트레이·hairline·절제된 그림자를 KLIC 재료 토큰에 연결합니다.	Connect the tray, hairlines and restrained shadows to KLIC material tokens.
카드 표면	Card surface
동작과 선택	Actions and selection
카드 hairline	Card hairline
행동 높이	Action height
다섯 형태를 동시에 조작해 상태가 섞이지 않는지 확인합니다.	Operate all five forms together and verify that their states remain independent.
완료·취소·재시도 후 다른 화면으로 이동합니다.	Navigate to another screen after completing, cancelling and retrying actions.
260px와 Dark, 글자 배율 150%, reduced motion을 확인합니다.	Check a 260px width, dark mode, 150% text scale and reduced motion.
Native HTML 구조·상태	Native HTML structure and state
인스턴스별 DOM 상호작용	Instance-scoped DOM interactions
소스 라이선스 안내	Source license guidance
검토가 필요한 결정	Decisions awaiting review
출시 전 승인	Pre-release approval
권한 요청	Permission requests
콘텐츠 편집	Content editing
데이터 충돌 해결	Resolve data conflicts
검색 결과	Search results
실패와 복구	Failure and recovery
실행 중인 작업	Running task
긴 JSON 결과	Long JSON result
도구 실행 그룹	Tool call group
동기화 방식 추천	Recommended sync strategy
출시 범위 제안	Suggested rollout scope
문장 다듬기	Refine the wording
낮은 신뢰도 검토	Review a low-confidence suggestion
좁은 화면 개선	Improve narrow-screen layouts
기본 응답	Standard response
여러 버전 비교	Compare multiple versions
코드 설명	Code explanation
편집 피드백	Editorial feedback
음성 읽기	Read aloud
후기 카드 월	Testimonial wall
세 열의 독립적인 흐름과 정지 동작을 갖춘 샘플 후기 레이아웃.	A sample testimonial layout with three independently moving columns and pause controls.
AI와 쇼케이스	AI and showcases
KLIC 인터랙션 · testimonials	KLIC interactions · testimonials
KLIC 인터랙션 · marquee	KLIC interactions · marquee
KLIC 인터랙션 · response	KLIC interactions · response
KLIC 인터랙션 · review	KLIC interactions · review
로컬 결정·재시도·버전·피드백 상태를 보존한다. 실제 전송·배포를 수행하지 않는다. 연속 움직임은 일시정지와 reduced-motion을 제공한다.	Preserve local decision, retry, version and feedback states. Do not send or deploy anything. Continuous motion provides pause controls and respects reduced motion.
결정 인박스·도구 실행·추천·메시지 또는 마키·후기 카드의 KLIC 구성.	A KLIC composition of decision inboxes, tool calls, recommendations and messages, or marquees and testimonial cards.
Tab으로 행동을 탐색하고 Enter·Space로 실행한다. 펼침 상태를 aria-expanded로 알리며 움직임을 버튼으로 멈출 수 있다.	Navigate actions with Tab and activate them with Enter or Space. Announce expansion with aria-expanded and provide a button to stop motion.
대기·완료·실패·재시도·선택 취소·응답 버전을 구분한다. 후기 콘텐츠는 가상 샘플임을 표시한다.	Distinguish pending, complete, failed, retry, deselection and response-version states. Label testimonial content as fictional samples.
시스템 로고 마키	System logo marquee
관성 드래그와 일시정지를 갖춘 양방향 시스템 구성 요소 스트립.	A bidirectional strip of system elements with inertial dragging and pause controls.
응답 편집 워크스페이스	Response editing workspace
버전 비교, 복사, 재생성, 피드백과 음성 읽기를 갖춘 응답 화면.	A response workspace with version comparison, copying, regeneration, feedback and read-aloud.
에이전트 검토 워크스페이스	Agent review workspace
결정 대기·실행 기록·근거 있는 추천을 연결한 KLIC 업무 화면.	A KLIC workspace connecting pending decisions, execution traces and reasoned recommendations.
`.trim().split('\n').map(row=>row.split('\t')));
const rules=[
 ['답변 확인·접기·남은 개수·실행 취소','Answer confirmation, folding, remaining count and undo',['검토가 필요한 결정','출시 전 승인','권한 요청','콘텐츠 편집','데이터 충돌 해결']],
 ['인수·결과 공개·복사·재시도·실행 그룹','Argument and result disclosure, copying, retry and call groups',['검색 결과','실패와 복구','실행 중인 작업','긴 JSON 결과','도구 실행 그룹']],
 ['대안 선택·수락·실행 취소·신호 강도','Alternative selection, acceptance, undo and signal strength',['동기화 방식 추천','출시 범위 제안','문장 다듬기','낮은 신뢰도 검토','좁은 화면 개선']],
 ['복사·버전·재생성·평가·음성 읽기','Copying, versions, regeneration, ratings and read-aloud',['기본 응답','여러 버전 비교','코드 설명','편집 피드백','음성 읽기']]
];
for(const [ko,en,titles] of rules){
 affectMessages[`${ko}이 필요한 에이전트 작업 화면에 사용합니다.`]=`Use in agent workspaces that need ${en.charAt(0).toLowerCase()+en.slice(1)}.`;
 affectMessages[`${ko}; 화면 이탈 시 지연 실행을 정리합니다.`]=`${en}; clean up delayed work when leaving the screen.`;
 for(const title of titles)affectMessages[`${title} · ${ko}. 브라우저 안의 로컬 예제입니다.`]=`${affectMessages[title]} · ${en}. A local example running in the browser.`;
}
for(const title of ['후기 카드 월','시스템 로고 마키','응답 편집 워크스페이스','에이전트 검토 워크스페이스'])affectMessages[`${title} · AI와 쇼케이스 분류.`]=`${affectMessages[title]} · AI and showcases category.`;
export const affectBlockNames={
 'affect-agent-review':'Agent review workspace',
 'affect-response-workspace':'Response editing workspace',
 'affect-logo-marquee':'System logo marquee',
 'affect-testimonial-wall':'Testimonial wall'
};
Object.assign(affectMessages,{
 '오류와 복구':'Errors and recovery',
 '실행 실패 또는 취소':'Execution failed or was cancelled',
 '이전 상태와 내용을 유지하고 재시도 또는 실행 취소를 제공합니다.':'Preserve the previous state and content, and provide retry or undo.',
 '형태별 샘플 상태':'Sample state for each form',
 '최초 렌더링 상태이며 인스턴스별 WeakMap에서 독립적으로 갱신합니다.':'The initial render state, updated independently for each instance in a WeakMap.',
 '행동별 지정':'Specified for each action',
 '문서 위임 이벤트가 처리할 행동을 식별합니다. 실제 서버 실행을 의미하지 않습니다.':'Identifies the action handled by delegated document events. It does not represent real server execution.',
 '선택한 항목 또는 버전':'Selected item or version',
 '선택 값과 버전을 전달하고 해당 루트의 상태만 변경합니다.':'Pass the selection and version, changing only the state of the associated root.'
});
for(const description of ['답변을 기다리는 결정을 차례로 검토합니다.','에이전트의 도구 호출과 결과를 투명하게 보여줍니다.','근거와 신뢰도를 읽고 대안을 선택합니다.','응답을 복사하고 버전과 피드백을 관리합니다.'])affectMessages[description+' KLIC의 테마와 토큰을 공유하며 독립된 로컬 상태로 확인하는 인터랙션 구성입니다.']=affectMessages[description]+' This interaction uses KLIC themes and tokens with independently managed local state.';
