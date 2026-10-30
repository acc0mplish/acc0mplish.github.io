/** KLIC-owned component blocks adapted from the user's six visual references. */
export const REFERENCE_COMPONENT_BLOCKS = [
  {
    id: 'multi-select', title: '그룹형 다중 선택', enTitle: 'Grouped multi-select',
    description: '검색 가능한 그룹 옵션, 인원 제한, 선택 칩과 새 태그 추가를 지원하는 다중 선택 입력입니다.',
    enDescription: 'A multi-value input with searchable groups, a selection limit, removable chips and tag creation.',
    categoryId: 'app-form', categoryName: '폼 양식', collection: 'applications', mode: 'multi-select',
    use: ['담당자·태그처럼 여러 값을 검색하고 그룹별로 선택하는 입력에 사용합니다.', 'Use for inputs that search and select grouped values such as owners and tags.'],
    avoid: ['선택 제한, 비활성 옵션, 그룹 전체 선택 상태를 색만으로 전달하지 않습니다.', 'Do not communicate selection limits, disabled options or group selection by color alone.']
  },
  {
    id: 'tree-view', title: '저장소 트리 보기', enTitle: 'Repository tree view',
    description: '키보드로 탐색하는 계층 트리에 확장·축소, 부분 선택과 경로 검색을 결합합니다.',
    enDescription: 'A keyboard-navigable hierarchy with expansion, tri-state selection and path search.',
    categoryId: 'app-list', categoryName: '목록', collection: 'applications', mode: 'tree-view',
    use: ['파일·권한·조직처럼 부모와 자식 관계가 중요한 항목을 탐색할 때 사용합니다.', 'Use to navigate items with meaningful parent-child relationships, such as files, permissions or teams.'],
    avoid: ['접힌 하위 항목을 화면에서 사라졌다는 이유만으로 선택이나 집계에서 제외하지 않습니다.', 'Do not exclude collapsed descendants from selection or counts merely because they are hidden.']
  },
  {
    id: 'file-upload', title: '파일 업로드 대기열', enTitle: 'File upload queue',
    description: '드롭·파일 선택, 형식 검증, 진행률, 동시 업로드, 취소와 실패 재시도를 보여주는 업로드 대기열입니다.',
    enDescription: 'An upload queue showing drop and browse input, validation, progress, concurrency, cancellation and retry.',
    categoryId: 'app-form', categoryName: '폼 양식', collection: 'applications', mode: 'file-upload',
    use: ['파일마다 진행·완료·실패 상태와 다시 시도할 행동이 필요한 폼에 사용합니다.', 'Use in forms that need per-file progress, completion, failure and retry actions.'],
    avoid: ['이 예제는 파일을 업로드하거나 저장하지 않습니다. 상태 변화는 로컬 샘플입니다.', 'This example does not upload or store files. Status transitions are local samples.']
  },
  {
    id: 'trace-waterfall', title: '분산 트레이스 워터폴', enTitle: 'Distributed trace waterfall',
    description: '접을 수 있는 스팬 계층과 시간축, 지연 구간, 오류 표시와 선택 상세를 연결합니다.',
    enDescription: 'A collapsible span hierarchy connected to a time axis, latency, errors and selected span details.',
    categoryId: 'app-timeline', categoryName: '타임라인', collection: 'applications', mode: 'trace-waterfall',
    use: ['분산 요청의 경로와 서비스별 지연을 비교할 때 사용합니다.', 'Use to inspect distributed request paths and compare latency across services.'],
    avoid: ['임계 경로는 전체 요청 시간을 기다리는 경로라는 점을 명시하고, 샘플 시간을 실제 관측값처럼 표시하지 않습니다.', 'Explain that the critical path determines total request time; do not present sample timings as observed production data.']
  },
  {
    id: 'log-stream', title: '운영 로그 스트림', enTitle: 'Operations log stream',
    description: '수준별 필터와 검색, 새 로그 흐름, 읽기 위해 위로 스크롤하면 멈추는 자동 따라가기를 제공합니다.',
    enDescription: 'A live-style log stream with level filters, search and tail-follow that pauses when scrolling up to read.',
    categoryId: 'app-list', categoryName: '목록', collection: 'applications', mode: 'log-stream',
    use: ['운영 이벤트에서 오류를 찾고 자동 따라가기와 수동 읽기를 오갈 때 사용합니다.', 'Use to find operational errors and switch between live tail-follow and manual reading.'],
    avoid: ['로그는 합성 예시이며 실제 서버 로그·개인정보·고객 이벤트를 포함하지 않습니다.', 'Logs are synthetic examples and contain no production logs, personal data or customer events.']
  },
  {
    id: 'deploy-pipeline', title: '배포 파이프라인', enTitle: 'Deployment pipeline',
    description: '병렬 작업과 단계 간 흐름, 실행 시간, 실패 상세와 로컬 재시도 상태를 보여줍니다.',
    enDescription: 'A deployment view of parallel jobs, stage flow, duration, failure details and local retry state.',
    categoryId: 'app-flow', categoryName: '플로우', collection: 'applications', mode: 'deploy-pipeline',
    use: ['빌드·검증·배포 단계의 병렬성과 실패 지점을 설명할 때 사용합니다.', 'Use to explain parallel work and failure points across build, validation and deployment stages.'],
    avoid: ['실제 CI 작업을 시작하거나 배포하지 않습니다. 재시도는 이 화면의 샘플 상태만 변경합니다.', 'Do not start CI jobs or deploy. Retry changes only the sample state in this view.']
  }
];

export const REFERENCE_COMPONENT_ADOPTION = {
  composition: '각 블록은 탐색·필터·핵심 데이터·선택 상세를 연결하고, KLIC 토큰으로 표면·상태·초점을 표현합니다.',
  interaction: '검색·확장·선택·취소·재시도 동작은 로컬 샘플 데이터에만 반영합니다.',
  keyboard: '입력은 네이티브 폼 컨트롤을 우선하고, 트리·선택 목록·파이프라인은 이름 있는 키보드 조작과 보이는 초점을 제공합니다.',
  responsive: '컨테이너 폭에 따라 패널과 단계 열을 재배치하고, 긴 표·로그만 내부 스크롤을 사용합니다.',
  states: '기본·선택·비활성·진행·완료·실패·빈 상태를 텍스트와 아이콘으로 구분합니다.',
  limits: '참고 화면의 제품명·브랜드·소스 구현을 복사하지 않은 KLIC 독립 샘플입니다. 외부 저장·전송·실행은 하지 않습니다.'
};
