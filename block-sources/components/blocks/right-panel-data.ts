/** KLIC native demo fixtures. No customer or production data. */
export type RightPanelMode='timeline-context'|'customer-inspector'|'task-discussion'|'risk-review';
export type PanelText=readonly [string,string];
export interface PanelRecord {id:string;title:PanelText;organization:PanelText;owner:PanelText;date:string;priority:'normal'|'high';summary:PanelText;steps:PanelText[]}
export const PANEL_MODES:RightPanelMode[]=['timeline-context','customer-inspector','task-discussion','risk-review'];
export const PANEL_LABELS:Record<RightPanelMode,PanelText>={
 'timeline-context':['업무 상세 · 연관 정보','Timeline · related context'],
 'customer-inspector':['고객 상세 · 활동','Customer · activity'],
 'task-discussion':['작업 상세 · 댓글','Task · discussion'],
 'risk-review':['리스크 · 검토','Risk · review'],
};
const steps:PanelText[]=[['담당 부서와 적용 범위 확인','Confirm ownership and scope'],['검증 결과와 증적 첨부','Attach validation evidence'],['접근성·회귀 검증 확인','Review accessibility and regression checks'],['최종 검토 의견 반영','Resolve the final review comments']];
const riskSteps:PanelText[]=[['영향 서비스와 담당자 확인','Identify affected services and owners'],['복구 절차와 대체 경로 검증','Validate recovery and fallback procedures'],['스테이징 복구 훈련 완료','Complete the staging recovery exercise'],['운영 책임자의 최종 검토','Obtain the operations review']];
function record(id:string,title:PanelText,organization:PanelText,owner:PanelText,date:string,summary:PanelText,high=false,risk=false):PanelRecord{return {id,title,organization,owner,date,summary,priority:high?'high':'normal',steps:risk?riskSteps:steps};}
export const PANEL_RECORDS:Record<RightPanelMode,PanelRecord[]>={
 'timeline-context':[
  record('DS-104',['디자인 시스템 적용 검토','Design system adoption review'],['공공 포털 고도화 · 예시','Public portal · sample'],['김서연','Seoyeon Kim'],'2026-10-30',['공통 화면에 KLIC 토큰과 컴포넌트를 적용합니다. 담당자 의견과 검증 자료를 같은 문맥에서 검토합니다.','Apply KLIC tokens and components to shared screens. Review owner feedback and evidence in context.']),
  record('DS-105',['컴포넌트 접근성 점검','Component accessibility review'],['공공 포털 고도화 · 예시','Public portal · sample'],['이도윤','Doyun Lee'],'2026-11-03',['키보드 이동과 초점 표시를 점검하고 남은 조치를 정리합니다.','Review keyboard navigation and focus indicators, then record remaining actions.'],true),
  record('DS-106',['통합 회귀 테스트','Integrated regression tests'],['공공 포털 고도화 · 예시','Public portal · sample'],['박지민','Jimin Park'],'2026-11-06',['테마·폰트·밀도 변경 시 화면과 동작을 함께 확인합니다.','Check layout and behavior across themes, fonts and densities.']),
  record('DS-107',['운영 인수 자료 정리','Operations handoff'],['공공 포털 고도화 · 예시','Public portal · sample'],['정하린','Harin Jung'],'2026-11-10',['운영 절차와 변경 이력을 인수 자료로 정리합니다.','Prepare operating procedures and change history for handoff.']),
 ],
 'customer-inspector':[
  record('CRM-021',['디지털 플랫폼 구축 협의','Digital platform proposal'],['한빛교육원 · 가상 고객','Hanbit Education · fictional'],['김서연','Seoyeon Kim'],'2026-11-05',['요구사항을 정리하고 제안 범위와 다음 협의 일정을 확인합니다. 금액과 상태는 예시입니다.','Review requirements, proposal scope and the next meeting. Amounts and stages are illustrative.']),
  record('CRM-022',['데이터 통합 환경 제안','Data integration proposal'],['새움연구원 · 가상 고객','Saeum Research · fictional'],['이도윤','Doyun Lee'],'2026-11-09',['데이터 원천과 접근 권한, 연동 범위를 협의합니다.','Discuss data sources, access permissions and integration scope.'],true),
  record('CRM-023',['통합 운영 대시보드','Operations dashboard'],['가온공사 · 가상 고객','Gaon Agency · fictional'],['박지민','Jimin Park'],'2026-11-12',['관제 지표와 운영자의 의사결정 흐름을 검토합니다.','Review observability metrics and operator workflows.']),
  record('CRM-024',['교육 서비스 접근성 개선','Education accessibility'],['나래대학교 · 가상 고객','Narae University · fictional'],['정하린','Harin Jung'],'2026-11-16',['핵심 사용자 여정과 콘텐츠 접근성을 함께 개선합니다.','Improve core user journeys and content accessibility.']),
 ],
 'task-discussion':[
  record('TASK-128',['우측 상세 패널 공통 규칙 정리','Define shared right-panel rules'],['인터페이스 개선 · 예시','Interface improvements · sample'],['김서연','Seoyeon Kim'],'2026-10-30',['본문의 선택 문맥을 유지하면서 상세 정보와 댓글을 확인합니다. 모바일에서는 전체 폭으로 전환합니다.','Review details and comments without losing the selected context. Use full width on narrow screens.']),
  record('TASK-129',['키보드 탐색 흐름 검토','Review keyboard navigation'],['인터페이스 개선 · 예시','Interface improvements · sample'],['이도윤','Doyun Lee'],'2026-11-02',['모달의 초점 순환과 닫기 후 초점 복귀를 검토합니다.','Review modal focus trapping and focus restoration after closing.'],true),
  record('TASK-130',['반응형 상세 레이아웃','Responsive detail layout'],['인터페이스 개선 · 예시','Interface improvements · sample'],['박지민','Jimin Park'],'2026-11-04',['긴 제목과 확대된 글꼴에서도 모든 행동에 접근할 수 있게 합니다.','Keep all actions reachable with long titles and enlarged typography.']),
  record('TASK-131',['샘플 데이터와 사용 가이드','Sample data and adoption guide'],['인터페이스 개선 · 예시','Interface improvements · sample'],['정하린','Harin Jung'],'2026-11-06',['상태와 상호작용 범위를 문서에 명시합니다.','Document states and interaction scope.']),
 ],
 'risk-review':[
  record('RISK-011',['백업 복구 절차 검증 지연','Delayed backup recovery validation'],['통합 운영 체계 · 예시','Operations framework · sample'],['김서연','Seoyeon Kim'],'2026-10-30',['복구 훈련 일정이 확정되지 않아 운영 전환 검토에 영향을 줄 수 있습니다. 조치 완료 후 잔여 위험을 검토합니다.','An unscheduled recovery exercise may affect operational readiness. Review residual risk after completing the actions.'],true,true),
  record('RISK-012',['외부 연계 응답 지연','External integration latency'],['통합 운영 체계 · 예시','Operations framework · sample'],['이도윤','Doyun Lee'],'2026-11-02',['대체 경로와 재시도 정책을 검증하고 담당자를 지정합니다.','Validate fallback and retry policies and assign an owner.'],true,true),
  record('RISK-013',['운영 인수 문서 누락','Missing handoff documentation'],['통합 운영 체계 · 예시','Operations framework · sample'],['박지민','Jimin Park'],'2026-11-04',['누락된 절차와 연락 체계를 확인해 인수 문서에 반영합니다.','Add missing procedures and escalation contacts to the handoff documentation.'],false,true),
  record('RISK-014',['권한 검토 일정 조정','Access review scheduling'],['통합 운영 체계 · 예시','Operations framework · sample'],['정하린','Harin Jung'],'2026-11-06',['운영 전환 전 권한 검토의 범위와 일정을 재확인합니다.','Reconfirm scope and timing of the access review before handoff.'],false,true),
 ],
};
