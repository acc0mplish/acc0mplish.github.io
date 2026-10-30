import {DASHBOARD_BLOCK_EXAMPLES,DASHBOARD_ADOPTION} from '../dashboard-block-catalog.mjs';
import {salesDashboardMessages} from './dashboard-sales-en.mjs';
import {aiDashboardMessages} from './dashboard-ai-en.mjs';
import {automationDashboardMessages} from './dashboard-automation-en.mjs';
import {referenceDashboardMessages} from './dashboard-reference-en.mjs';
export const dashboardMessages={
 '워크스페이스':'Workspace','대시보드 보기':'Dashboard views',
 '사이드바 펼치기':'Expand sidebar','사이드바 접기':'Collapse sidebar',
 '설계에서 실제 화면까지':'From design to working screens',
 '샘플 데이터 · 변경 사항은 이 예제에서만 적용됩니다.':'Sample data · Changes apply only in this example.',
 '신규 대시보드의 미리보기와 소스는 사용자 제공 시각 참고를 KLIC 구조로 재해석한 로컬 예제입니다. 제품 데이터 연결은 별도 구현합니다.':'New dashboard previews and source reinterpret user-supplied visual references as local KLIC examples. Implement product data connections separately.',
 'KLIC / 샘플 데이터':'KLIC / Sample data','필터 초기화':'Reset filters',
 'KLIC 독립 구현 · 사용자 제공 시각 참고 · 로컬 샘플':'KLIC-owned implementation · User-supplied visual references · Local sample',
 ...salesDashboardMessages,...aiDashboardMessages,...automationDashboardMessages,...referenceDashboardMessages,
 ...Object.fromEntries(DASHBOARD_BLOCK_EXAMPLES.flatMap(e=>[[e.title,e.enTitle],[e.description,e.enDescription],e.use,e.avoid])),
 ...Object.fromEntries(Object.values(DASHBOARD_ADOPTION).flat())
};
