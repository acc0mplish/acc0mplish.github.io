import {blockDisplayName,translateText} from './i18n.mjs';

const BLOCK_NAV_LABELS_KO=Object.freeze({
 'flowmotion-inbound-lead-routing':'리드 라우팅',
 'flowmotion-realtime-ai-scoring-hub':'AI 이상 점수',
 'flowmotion-swimlane-etl-funnel':'데이터 ETL',
 'flowmotion-cyclic-agent-ring':'에이전트 링',
 'flowmotion-vertical-region-tree':'리전 페일오버',
 'flowmotion-ppt-chevron-funnel':'GTM 영업 퍼널',
 'flowmotion-ppt-sequence-flowchart':'결제 승인·정산',
 'flowmotion-ppt-flywheel-infographic':'AI 데이터 선순환',
 'flowmotion-ppt-asis-tobe-bridge':'운영 전환 비교',
 'flowmotion-ppt-milestone-roadmap':'AX 분기 로드맵',
 'flowmotion-creative-zigzag-ribbon':'혁신 리본',
 'flowmotion-creative-lightbulb-brainstorm':'신사업 아이디어',
 'flowmotion-creative-strategy-pyramid':'전략 피라미드',
 'flowmotion-creative-semicircle-radial-fan':'성장 동력 팬',
 'flowmotion-creative-hexagon-honeycomb':'육각 전략 매트릭스',
 'flowmotion-cinematic-node-connect':'시네마틱 노드 연결',
 'flowmotion-editorial-mcp-skill-compare':'MCP·스킬 비교',
 'flowmotion-it-pms-project':'PMS 마일스톤',
 'flowmotion-it-design-system':'디자인 핸드오프',
 'flowmotion-it-slack-chatops':'슬랙 결재 허브',
 'flowmotion-it-dev-cicd':'CI/CD 파이프라인',
 'flowmotion-it-si-integration':'SI 연계 단계',
 'bill-materials':'자재 명세서 BOM'
});

const BLOCK_NAME_EN=Object.freeze({
 'template-advisor-knowledge':'Customer retention and NRR expansion portal',
 'template-autonomous-task-lifecycle':'Multicloud FinOps cost optimization portal',
 'template-smart-reorder-supplychain':'Data pipeline and lineage studio',
 'template-proforma-financial-roi':'Product A/B experiments and feature flag console',
 'template-enterprise-reports-center':'Security compliance and audit evidence portal',
 'bill-materials':'Bill of materials BOM'
});

const cleanLabel=value=>{
 let text=String(value??'').replace(/[\t\r\n]+/gu,' '),previous;
 do{previous=text;text=text.replace(/\s*[（(][^()（）]*[)）]/gu,' ');}while(text!==previous);
 return text.replace(/\s+/gu,' ').trim();
};

export function localizedTextLabels(ko,en=translateText(ko,'en')){
 return {ko:cleanLabel(ko),en:cleanLabel(en||ko)};
}

export function componentCatalogLabels(component){
 return localizedTextLabels(component.ko||component.name,component.name||component.ko);
}

export function blockCatalogLabels(block){
 const ko=BLOCK_NAV_LABELS_KO[block.id]||block.catalogTitle||block.title;
 const en=BLOCK_NAME_EN[block.id]||blockDisplayName(block.id,block.title||block.catalogTitle,'en');
 return localizedTextLabels(ko,en);
}

export const BLOCK_COLLECTION_LABELS=Object.freeze({
 applications:Object.freeze({ko:'애플리케이션',en:'Application'}),
 diagrams:Object.freeze({ko:'다이어그램',en:'Diagrams'}),
 charts:Object.freeze({ko:'차트',en:'Charts'}),
 'data-grids':Object.freeze({ko:'데이터 그리드',en:'Data Grid'})
});

export const OTHER_COMPONENTS_LABELS=Object.freeze({ko:'기타 컴포넌트',en:'Other components'});
