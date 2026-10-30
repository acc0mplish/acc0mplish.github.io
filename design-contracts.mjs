import {DESIGN_SYSTEM} from './design-system-data.mjs';
import {LIBRARY_SCOPE,libraryScopeText} from './library-scope.mjs';
import {SITE_METADATA,SITE_ORIGIN} from './site-metadata.mjs';
import {designGuidanceMarkdown} from './design-guidance.mjs';
import {getComponentGuide} from './component-guides.mjs';
import {getBlockContract} from './block-contracts.mjs';
import {createTokens,resolveTokens,formatValue,traceToken} from './tokens.mjs';
const tokens=createTokens('a','light'),resolved=resolveTokens(tokens);
export function designContract(item){
 const component=item.kind==='component',g=component?getComponentGuide(item.id):getBlockContract(item);
 const family=component?item.category:item.categoryId;
 const input=component?item.category==='input':/form|auth|wizard|settings|editing/.test(family);
 const data=!input&&/grid|table|chart|list|data|dashboard|base|flow|diagram/.test(family+' '+item.collection+' '+item.id);
 const use=component?g.use:[`「${item.title}」의 용도`+': '+(item.description||item.categoryName),...(g.use||g.composition)];
 const avoid=component?g.avoid:[input?'검증 오류를 토스트만으로 안내하거나 실패 후 입력을 지우지 않습니다.':data?'좁은 화면을 이유로 수치·단위·범례를 생략하거나 폰트를 일괄 축소하지 않습니다.':'카드 전체 행동과 내부 버튼을 중첩하지 않습니다.','샘플 데이터·로컬 상호작용을 실제 저장·인증·운영 기능으로 표시하지 않습니다.',...(g.avoid||[])];
 const rows=component?g.tokens:g.tokens;
  return {delivery:{type:LIBRARY_SCOPE.type,npmPackagePublished:LIBRARY_SCOPE.npmPackagePublished,npmPackage:LIBRARY_SCOPE.npmPackage,scope:'/about',licenses:LIBRARY_SCOPE.licensing.guide},system:{schemaVersion:DESIGN_SYSTEM.schemaVersion,revision:DESIGN_SYSTEM.revision,definition:DESIGN_SYSTEM.links.definition,docs:DESIGN_SYSTEM.links.docs},schemaVersion:SITE_METADATA.versions.designContractSchema,scope:'adoption-guidance',implementation:item.implemented===false?'planned':component?'native-html':'react-demo',use,avoid,
  accessibility:component?g.accessibility:[...g.keyboard,...g.responsive],
  density:{compact:input?'관리자 반복 입력에만 사용합니다. 도움말·오류와 실제 클릭 영역은 유지합니다.':data?'데이터 비교·반복 행에 사용하며 셀 padding만 줄입니다. 글자 크기와 단위는 유지합니다.':'반복 목록에서만 여백을 줄이고 주요 행동 간격은 유지합니다.',normal:'기본 권장 밀도입니다. 읽기 순서와 레이블·컨트롤·피드백 그룹을 유지합니다.',relaxed:input?'처음 작성하는 폼·긴 안내에 권장합니다. 필드 그룹의 간격을 늘립니다.':'설명 중심·프레젠테이션 화면에 사용합니다. 정보 계층을 유지하며 여백을 늘립니다.'},
  states:component?g.states:g.states.map((response,i)=>({name:i?'완료·선택':'데이터 생명주기',condition:'조합 정책',response})),
  recovery:{loading:'진행 중임을 알리고 중복 요청을 차단합니다. 기존 데이터가 있으면 갱신 중에도 유지합니다.',empty:input?'초기 빈 입력은 오류로 표시하지 않습니다. 필수 조건은 제출 전에도 안내합니다.':'처음부터 데이터가 없는 상태에는 생성·연결 행동을 제공합니다.',filtered:'검색 결과가 없으면 데이터 없음과 구분하고 필터 초기화 행동을 제공합니다.',error:input?'입력값을 보존하고 오류 설명을 해당 필드와 연결합니다.':'마지막 정상 데이터를 보존하고 실패 영역에 재시도를 제공합니다.'},
  tokenMapping:rows.map(t=>{const path=t.path,cssVariable='--'+path.replaceAll('.','-');
   const property=tokens[path]?.$type==='color'?(/border/.test(path)?'border-color':/background|surface|panel|selected|soft/.test(path)?'background-color':'color'):/radius/.test(path)?'border-radius':/font-size/.test(path)?'font-size':/font-family/.test(path)?'font-family':/height/.test(path)?'min-height':/max-width/.test(path)?'max-width':/padding/.test(path)?'padding':/gap|space|spacing/.test(path)?'gap':/icon/.test(path)?'width':'padding';
   const utility={'border-color':'border','background-color':'bg',color:'text','border-radius':'rounded','font-size':'text','font-family':'font','min-height':'min-h','max-width':'max-w',padding:'p',gap:'gap',width:'w'}[property];
   const hint=property==='font-size'?'length:':property==='font-family'?'family-name:':'';
   return {path,purpose:t.purpose||t.label,cssVariable,cssProperty:property,value:resolved[path]===undefined?null:formatValue(resolved[path]),chain:traceToken(tokens,path).map(x=>x.path),tailwind:utility+'-['+hint+'var('+cssVariable+')]'};}),
  limitations:component?[g.implementation]:g.limits,
  checklist:component?g.checks:['키보드로 주요 행동을 실행합니다.','compact·normal·relaxed와 Light/Dark를 각각 확인합니다.','빈 결과·로딩·오류와 긴 한글 콘텐츠를 확인합니다.'],
  exports:{design:`/design/${item.kind}/${item.id}/DESIGN.md`,contract:`/design/${item.kind}/${item.id}/contract.json`,types:'/design/klic-design.d.ts'},
  prompt:`KLIC ${item.name||item.title} (${item.kind}/${item.id})을 사용해 화면을 구성하세요. ${libraryScopeText('ko')} 먼저 ${SITE_ORIGIN}${DESIGN_SYSTEM.links.definition}의 공통 기준(revision ${DESIGN_SYSTEM.revision}), DESIGN.md와 실제 소스를 읽고, 구현 책임·프리셋 허용 범위·충돌 해결 순서를 적용하세요. 사용 원칙·금지 사항·접근성·밀도·빈 상태·오류 처리를 준수하세요. 토큰은 klic. 4계층 참조를 보존하고 없는 API나 실제 저장 기능을 만들어내지 마세요.`};
}
export function designMarkdown(item,design){
 const list=a=>a.map(t=>'- '+t).join('\n');
 return `# ${item.name||item.title} DESIGN\n\n항목: ${item.kind}/${item.id}\n구현: ${design.implementation}\n범위: 설계 적용 지침. 검증 완료 인증이 아닙니다.\n\n${designGuidanceMarkdown()}\n## 사용할 때\n${list(design.use)}\n\n## 사용하지 말아야 할 때\n${list(design.avoid)}\n\n## 접근성\n${list(design.accessibility)}\n\n## 밀도\n${list(Object.entries(design.density).map(([k,v])=>k+': '+v))}\n\n## 상태 변이\n${list(design.states.map(s=>s.name+' / '+s.condition+': '+s.response))}\n\n## 빈 상태와 복구\n${list(Object.entries(design.recovery).map(([k,v])=>k+': '+v))}\n\n## 토큰 매핑\n| 경로 | CSS 변수 | 기본 A Light 값 | 용도 | Tailwind 예시 |\n| --- | --- | --- | --- | --- |\n${design.tokenMapping.map(t=>`| ${t.path} | ${t.cssVariable} | ${t.value} | ${t.purpose} | ${t.tailwind} |`).join('\n')}\n\nTailwind에서는 실제 CSS 속성에 맞는 arbitrary value를 선택하세요. 색상 토큰은 text/bg/border 역할을 구분하고 크기 토큰은 min-h/gap/p 등에 연결합니다. 토큰 값의 하드코딩으로 참조를 끊지 않습니다.\n\n## 구현 범위\n${list(design.limitations)}\n\n## 검수\n${list(design.checklist)}\n\n## 에이전트 프롬프트\n${design.prompt}\n`;
}
