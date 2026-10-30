export const INTERACTION_BLOCKS=[
 ['affect-agent-review','에이전트 검토 워크스페이스','결정 대기·실행 기록·근거 있는 추천을 연결한 KLIC 업무 화면.','review'],
 ['affect-response-workspace','응답 편집 워크스페이스','버전 비교, 복사, 재생성, 피드백과 음성 읽기를 갖춘 응답 화면.','response'],
 ['affect-logo-marquee','시스템 로고 마키','관성 드래그와 일시정지를 갖춘 양방향 시스템 구성 요소 스트립.','marquee'],
 ['affect-testimonial-wall','후기 카드 월','세 열의 독립적인 흐름과 정지 동작을 갖춘 샘플 후기 레이아웃.','testimonials']
].map(([id,title,description,mode])=>({id,title,catalogTitle:title,description,mode,categoryId:'app-ai-interactions',categoryName:'AI와 쇼케이스',collection:'applications',implemented:true,sourceFile:'components/blocks/AffectShowcaseBlock.tsx',sourceComponent:'AffectShowcaseBlock',variantNote:'KLIC 인터랙션 · '+mode,tags:['KLIC','AI','interaction',mode],origin:'klic-adapted'}));
