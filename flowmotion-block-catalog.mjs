const sourceArchive = 'docs/flowmotion-gallery-—-interactive-workflow-studio.zip';

export const FLOWMOTION_BLOCK_CATALOG = [
  {
    templateId: 'inbound-lead-routing',
    title: '인바운드 엔터프라이즈 리드 라우팅',
    description: '데모 신청 웹훅을 받은 뒤 기업 규모를 판별해 데이터 보강과 딜 생성 또는 세일즈 알림으로 분기합니다.'
  },
  {
    templateId: 'realtime-ai-scoring-hub',
    title: '실시간 이상·이탈 복합 스코어링 허브',
    description: '세 가지 Kafka·CDC 스트림을 중앙 AI 스코어링 허브로 모으고 위험도와 이탈률에 따라 분기합니다.'
  },
  {
    templateId: 'swimlane-etl-funnel',
    title: '멀티 샤드 데이터 레이크 ETL 스윔레인',
    description: '수집, 스키마 검증, 병렬 변환, 웨어하우스 적재로 이어지는 ETL 단계를 스윔레인으로 보여줍니다.'
  },
  {
    templateId: 'cyclic-agent-ring',
    title: '자율형 멀티 에이전트 오케스트레이션 링',
    description: '기획, 코딩, 샌드박스, 보안 검토, 배포 에이전트가 오케스트레이터와 피드백을 주고받는 흐름입니다.'
  },
  {
    templateId: 'vertical-region-tree',
    title: '글로벌 멀티리전 L7 오토 페일오버 트리',
    description: '글로벌 라우터에서 여러 리전과 클러스터로 분기하며 장애 시 우회 경로를 보여줍니다.'
  },
  {
    templateId: 'ppt-chevron-funnel',
    title: '엔터프라이즈 GTM 세일즈 전환 퍼널',
    description: '5단계 세일즈 전환과 단계별 전환율, 누적 파이프라인 지표를 한 화면에 연결합니다.'
  },
  {
    templateId: 'ppt-sequence-flowchart',
    title: '차세대 원클릭 결제 승인·정산 시퀀스 순서도',
    description: '고객 앱, API 게이트웨이, 카드사 망, 정산 원장 사이의 요청과 응답, 조건 분기를 순서대로 보여줍니다.'
  },
  {
    templateId: 'ppt-flywheel-infographic',
    title: 'AI 플랫폼 데이터 선순환 플라이휠 (Flywheel)',
    description: '성장 지표를 둘러싼 네 가지 성장 모멘텀과 KPI 요약을 연결한 플라이휠 인포그래픽입니다.'
  },
  {
    templateId: 'ppt-asis-tobe-bridge',
    title: '레거시 수동 운영 vs AI 네이티브 전환 인포그래픽',
    description: '기존 운영 구조와 AI 네이티브 구조를 전환 단계로 연결하고 비용과 속도 개선 지표를 함께 보여줍니다.'
  },
  {
    templateId: 'ppt-milestone-roadmap',
    title: '전사 AX(AI 전환) 4분기 마일스톤 & 품질 게이트',
    description: '분기별 실행 단계, 품질 승인 게이트, 누적 가치 창출 지표를 연결한 연간 로드맵입니다.'
  },
  {
    templateId: 'creative-zigzag-ribbon',
    title: '4대 경영 혁신 지그재그 리본 전략도',
    description: '네 가지 경영 전략을 지그재그 리본 흐름과 단계별 콜아웃으로 보여줍니다.'
  },
  {
    templateId: 'creative-lightbulb-brainstorm',
    title: '신사업 브레인스토밍 전구 방사형 인포그래픽',
    description: '중앙 아이디어 허브에서 여섯 가지 신사업 아이디어로 확장되는 브레인스토밍 장면입니다.'
  },
  {
    templateId: 'creative-strategy-pyramid',
    title: '엔터프라이즈 4단 입체 전략 피라미드 & 상승 모션',
    description: '기반 인프라부터 자율형 혁신까지 네 단계 전략 계층을 아래에서 위로 표현합니다.'
  },
  {
    templateId: 'creative-semicircle-radial-fan',
    title: '5대 성장 동력 반원형(180°) 선버스트 팬 인포그래픽',
    description: '다섯 가지 성장 동력과 전략 카드, 레이더 스윕을 반원형 레이아웃으로 연결합니다.'
  },
  {
    templateId: 'creative-hexagon-honeycomb',
    title: '5연동 육각형(Hexagon) 허니콤 전략 매트릭스',
    description: '시장 침투, 수직 통합, 전략적 제휴 등 다섯 가지 역량을 육각 매트릭스로 표현합니다.'
  },
  {
    templateId: 'cinematic-node-connect',
    title: '시네마틱 카메라 확대 추적 (Node Connect 20 FX)',
    description: '노드 확대와 엣지 이동을 따라가며 스파크, 리플, 타이핑, 글로우 등 20개 효과를 보여줍니다.'
  },
  {
    templateId: 'editorial-mcp-skill-compare',
    title: 'MCP(모델 연결 규격) vs 스킬(일하는 요령) 비교',
    description: 'AI를 내부 도구와 연결하는 MCP와 필요할 때 읽는 스킬의 역할을 두 카드로 비교합니다.'
  },
  {
    templateId: 'it-pms-project',
    title: 'PMS 4-Pin 마일스톤 & WBS 간트 차트',
    description: 'Jira, WBS, 리소스, 리스크 관리와 프로젝트 마일스톤·진척도를 결합한 관리 화면입니다.'
  },
  {
    templateId: 'it-design-system',
    title: '디자인 모니터 프리뷰 & 4-폰 핸드오프',
    description: '디자인 변수와 컴포넌트, 접근성 검수를 연결하고 모니터와 모바일 화면에 전달하는 과정을 보여줍니다.'
  },
  {
    templateId: 'it-slack-chatops',
    title: '슬랙 오버래핑 서클 허브 & Block Kit 결재',
    description: '배포, 장애, 결재, 고객 의견 채널과 커뮤니케이션 스킬을 연결한 협업 허브입니다.'
  },
  {
    templateId: 'it-dev-cicd',
    title: '개발 3-Pillar 트라이앵글 & DORA 4분면',
    description: 'PR, 보안 검사, E2E, 카나리 배포와 엔지니어링 스킬을 3단계 파이프라인 및 지표로 묶습니다.'
  },
  {
    templateId: 'it-si-integration',
    title: 'SI 5단계 A–E 피라미드 & 이관 매트릭스',
    description: '레거시 DB, ERP, 대외계, 그룹웨어 연결과 요구사항 추적·데이터 이관·감리 단계를 결합합니다.'
  }
].map(template => ({
  id: `flowmotion-${template.templateId}`,
  title: template.title,
  catalogTitle: template.title,
  description: template.description,
  categoryId: 'app-flow',
  categoryName: '플로우',
  collection: 'applications',
  implemented: true,
  sourceFile: 'components/blocks/FlowMotionBlock.tsx',
  sourceComponent: 'FlowMotionBlock',
  sourceTemplateId: template.templateId,
  sourceArchive,
  variantNote: `FlowMotionBlock · templateId=${template.templateId} · KLIC-authored · ${sourceArchive}`,
  tags: ['FlowMotion', '플로우모션', template.title, template.templateId],
  origin: 'klic-native'
}));
