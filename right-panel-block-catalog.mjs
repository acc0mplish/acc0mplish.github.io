/** User-supplied composition references, independently adapted to KLIC. */
export const RIGHT_PANEL_EXAMPLES=[
 {id:'panel-timeline-context',mode:'timeline-context',title:'우측 패널 · 업무 상세와 연관 정보',enTitle:'Right panel · timeline and related context',description:'본문 타임라인을 유지하는 도킹 패널에서 속성·댓글과 첨부·검토 자료를 함께 확인합니다.'},
 {id:'panel-customer-inspector',mode:'customer-inspector',title:'우측 패널 · 고객 상세와 활동',enTitle:'Right panel · customer inspector',description:'파이프라인 카드 선택과 연결된 고객 속성·담당자·활동 이력을 도킹 패널로 탐색합니다.'},
 {id:'panel-task-discussion',mode:'task-discussion',title:'우측 드로어 · 작업 상세와 댓글',enTitle:'Right drawer · task discussion',description:'배경을 음영 처리한 작업 보드 위에 담당자·일정·라벨과 댓글을 배치합니다. 댓글 작성·답글·반응과 설명 탭을 제공합니다.'},
 {id:'panel-risk-review',mode:'risk-review',title:'우측 드로어 · 리스크 검토와 조치',enTitle:'Right drawer · risk review',description:'위험도 매트릭스·완화 조치·연관 자료·검토 행동을 고정 헤더와 푸터가 있는 우측 패널에 구성합니다.'},
];
export const RIGHT_PANEL_ADOPTION={
 composition:['본문 선택 항목, 우측 속성·본문·연관 정보와 마지막 행동을 같은 항목 ID로 연결합니다.'],
 interaction:['도킹은 본문과 함께 탐색하고 드로어는 배경을 비활성화합니다. 닫기·재열기·이전/다음·너비 확장과 항목별 로컬 편집을 제공합니다.'],
 keyboard:['도킹 패널은 초점을 가두지 않습니다. 드로어는 초기 초점·Tab/Shift+Tab 순환·Escape 닫기를 제공하며 닫은 뒤 선택 항목으로 초점을 복귀합니다.'],
 responsive:['좁은 컨테이너에서는 전체 폭 모달 드로어로 전환합니다. 글자를 일괄 축소하지 않으며 긴 본문은 내부 스크롤, 헤더와 푸터는 별도 행으로 유지합니다.'],
 states:['닫힘·도킹·모달·확장, 선택 항목, 탭, 댓글, 조치와 완료를 구분합니다. 항목별 편집 상태를 보존합니다.'],
 limits:['샘플 데이터는 현재 미리보기의 메모리에만 유지합니다. 댓글·완료·검토는 서버로 전송되지 않으며 첨부 다운로드는 예제 텍스트입니다.'],
 use:['본문의 선택 문맥을 유지하면서 상세·댓글·검토를 진행할 때 사용합니다.'],
 avoid:['비모달 도킹 패널에 모달 초점 가두기를 적용하거나 로컬 검토를 실제 승인으로 표시하지 않습니다.'],
};
