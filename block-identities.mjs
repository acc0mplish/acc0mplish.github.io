// Display identities distinguish two routes that share the task workspace.
// Stable IDs and the original names retained in tags continue to support links/search.
export const BLOCK_IDENTITIES={
 'agent-task-lifecycle':{
  title:'에이전트 업무 라이프사이클 · 업무 보드 통합',enTitle:'Agent task lifecycle · integrated board',
  description:'업무 보드의 모드 전환 메뉴 안에서 작업 라이프사이클 화면을 엽니다. 독립 작업 목록과 같은 작업 화면을 공유하며, 통합 컨테이너와 전환 메뉴가 추가됩니다. 6단계 분포·에이전트 필터·목록/보드 전환을 제공하며 오늘 검증 완료(47)은 샘플 집계입니다.',
  enDescription:'Open the task lifecycle workspace inside the board mode switcher. It shares the standalone task view, with an integrated container and mode navigation. Six-stage distribution, agent filters and list/board views use sample counts, including 47 verified tasks today.',
  variantNote:'KanbanBoardBlock initialMode=lifecycle → TaskLifecycleBlock. list-agent-tasks와 작업 화면을 공유하며 업무 보드 전환 메뉴를 포함합니다.',
  enVariantNote:'KanbanBoardBlock initialMode=lifecycle → TaskLifecycleBlock. Shares the task view with list-agent-tasks and includes board mode navigation.'
 },
 'list-agent-tasks':{
  title:'에이전트 업무 라이프사이클 · 독립 작업 목록',enTitle:'Agent task lifecycle · standalone task list',
  description:'작업 라이프사이클 화면을 독립적으로 엽니다. 업무 보드 통합 항목과 같은 작업 화면을 사용하며, 보드 모드 전환 메뉴는 포함하지 않습니다. 6단계 분포·에이전트 필터·목록/보드 전환을 제공하며 오늘 검증 완료(47)은 샘플 집계입니다.',
  enDescription:'Open the task lifecycle workspace on its own. It uses the same task view as the integrated board entry, without the board mode switcher. Six-stage distribution, agent filters and list/board views use sample counts, including 47 verified tasks today.',
  variantNote:'TaskLifecycleBlock 직접 렌더링. agent-task-lifecycle과 작업 화면을 공유하며 업무 보드 전환 메뉴는 포함하지 않습니다.',
  enVariantNote:'Renders TaskLifecycleBlock directly. Shares the task view with agent-task-lifecycle without board mode navigation.'
 }
};
export function curateBlockIdentity(block){
 const identity=BLOCK_IDENTITIES[block.id];if(!identity)return block;
 return {...block,title:identity.title,catalogTitle:identity.title,description:identity.description,variantNote:identity.variantNote,tags:[...new Set([...(block.tags||[]),block.title,block.catalogTitle,identity.enTitle].filter(Boolean))]};
}
