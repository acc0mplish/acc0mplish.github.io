import {escapeHTML as esc} from './catalog.js';
import {renderDesignGuidance} from './design-guidance.mjs';

export const FRAMEWORK_DIMENSIONS = [
 ['크기와 비율','콘텐츠의 길이와 조작 영역을 함께 설계합니다. 고정 높이로 긴 문구를 자르지 않습니다.'],
 ['타이포그래피','본문·레이블·제목의 역할을 구분합니다. 좁은 화면에서는 줄바꿈과 재배치를 먼저 적용합니다.'],
 ['색과 대비','블루는 행동과 선택을, 네이비와 중립색은 정보 위계를 표현합니다. 상태는 색만으로 전달하지 않습니다.'],
 ['배치와 정렬','DOM 읽기 순서와 시각 순서를 맞춥니다. 표·다이어그램의 스크롤은 해당 영역에서 관리합니다.'],
 ['간격과 그룹화','레이블·컨트롤·도움말을 하나의 그룹으로 묶습니다. 밀도는 글자 축소가 아니라 간격 조정으로 표현합니다.'],
 ['표면과 깊이','표면·반경·경계·그림자의 역할을 나눕니다. 도킹 패널은 문서의 보조 영역으로 다룹니다.'],
 ['상호작용과 피드백','로딩·빈 상태·오류·완료를 구분하고 복구 행동을 제공합니다. 포커스와 선택 상태는 함께 유지합니다.']
];
const layers = [
 ['Primitive','원시 값','klic.primitive','색상 값·길이·폰트처럼 재사용할 재료를 정의합니다.'],
 ['Brand','브랜드 선택','klic.brand','브랜드가 사용할 재료를 선택합니다.'],
 ['Semantic','의미와 역할','klic.semantic','행동·표면·텍스트·간격의 목적을 정의합니다.'],
 ['Component','컴포넌트 적용','klic.component','실제 부품의 속성을 의미 토큰에 연결합니다.']
];
const validation = [
 ['R','Responsive','반응형','폭과 확대율에 따른 재배치·정보 보존을 확인합니다.'],
 ['A','Accessibility','접근성','키보드·이름·역할·대비·보조기술 동작을 확인합니다.'],
 ['D','Design','디자인','시각적 위계·토큰·표현의 일관성을 확인합니다.'],
 ['I','Interface','인터페이스','컨트롤의 상태와 상호작용 계약을 확인합니다.'],
 ['U','Userflow','사용자 흐름','완료·취소·실패 후 복구 경로를 확인합니다.'],
 ['S','Security','보안','신뢰 경계·입력 처리·권한과 남용 방지를 확인합니다.']
];
export function renderFrameworkGuide(locale=globalThis.document?.documentElement?.lang||'ko'){return `<article class="framework-guide" aria-labelledby="framework-title">
<header class="framework-heading"><span class="eyebrow">KLIC DESIGN FRAMEWORK</span><h2 id="framework-title">7 디멘션</h2><p class="framework-lead">다차원 관점과 4단계 위계로 정립된 디자인 프레임워크</p><p>7 디멘션은 화면과 행동을 검토하는 관점입니다. 4단계 위계는 값의 소유권과 참조 관계를 정합니다. 같은 컴포넌트를 두 구조에서 함께 설명합니다.</p></header>
<section class="framework-section" aria-labelledby="framework-dimensions"><h3 id="framework-dimensions">화면과 행동을 보는 7개의 관점</h3><div class="framework-dimensions">${FRAMEWORK_DIMENSIONS.map(([name,description],index)=>`<div class="framework-dimension"><span class="framework-number">${String(index+1).padStart(2,'0')}</span><div><h4>${esc(name)}</h4><p>${esc(description)}</p></div></div>`).join('')}</div></section>
<section class="framework-section" aria-labelledby="framework-hierarchy"><h3 id="framework-hierarchy">값을 연결하는 4단계 위계</h3><ol class="framework-layers">${layers.map(([name,label,path,description])=>`<li><strong>${name}</strong><span>${label}</span><code>${path}</code><p>${description}</p></li>`).join('')}</ol><p>예를 들어 버튼의 높이는 컴포넌트에서 의미 토큰을 참조하고, 의미 토큰은 브랜드 선택을 거쳐 원시 값으로 이어집니다. 브랜드 변경은 참조를 유지한 채 해당 단계에서 처리합니다.</p><a class="text-link" href="#tokens">토큰의 참조 관계 확인하기 →</a></section>
<section class="framework-section" aria-labelledby="framework-implementation"><h3 id="framework-implementation">규칙마다 구현 책임을 연결합니다.</h3><p>값은 토큰, 읽기 순서와 정보 관계는 DOM, 배치와 넘침은 CSS recipe, 실행과 복구는 상태·동작 계약에서 책임집니다. 프리셋은 실제 API가 허용한 설정 조합으로 관리하고, 충돌 시 정보·조작·접근성을 먼저 보존합니다.</p><a class="text-link" href="#docs/architecture">설계 책임과 조합 기준 보기 →</a></section>
<section class="framework-section" aria-labelledby="framework-validation"><h3 id="framework-validation">설계 이후의 검증: R / A / D / I / U / S</h3><p>KLIC-WCAG-KRDS의 검증 분류를 별도로 사용합니다. 이 분류는 7 디멘션이나 토큰 위계를 대체하지 않습니다.</p><div class="framework-validation">${validation.map(([letter,name,label,description])=>`<div><span class="framework-number">${letter}</span><h4>${label}<small>${name}</small></h4><p>${description}</p></div>`).join('')}</div></section>
<section class="framework-section" aria-labelledby="framework-checks"><h3 id="framework-checks">적용할 때 확인할 기준</h3><dl class="framework-checks"><div><dt>대비</dt><dd>일반 텍스트는 4.5:1, 큰 텍스트는 3:1을 기준으로 실제 전경·배경 조합을 측정합니다. 비활성 요소·장식·로고 등 WCAG의 적용 예외도 구분합니다. <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" target="_blank" rel="noopener">WCAG 1.4.3</a></dd></div><div><dt>조작 영역</dt><dd>포인터 대상은 최소 24×24 CSS px을 기준으로 검토합니다. 충분한 대상 간 간격, 동등한 대체 컨트롤, 문장 속 링크, 브라우저 기본 컨트롤, 필수 표현의 예외를 함께 판단합니다. <a href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html" target="_blank" rel="noopener">WCAG 2.5.8</a></dd></div><div><dt>재배치와 확대</dt><dd>세로 읽기 콘텐츠는 320 CSS px 너비에서도 정보와 기능을 보존합니다. 1280px 화면을 400%로 확대하면 같은 논리 너비가 됩니다. 표·지도·다이어그램처럼 의미에 두 방향 배치가 필요한 영역은 예외 여부를 따로 확인합니다. <a href="https://www.w3.org/WAI/WCAG22/Understanding/reflow.html" target="_blank" rel="noopener">WCAG 1.4.10</a></dd></div><div><dt>키보드와 도킹</dt><dd>포커스는 항상 보이게 유지합니다. 데스크톱의 도킹 Customize는 보조 영역이며, 배경을 비활성화하거나 키보드를 가두지 않습니다. 닫은 뒤에는 실행 버튼으로 포커스를 돌려줍니다.</dd></div></dl></section>
<section class="framework-section" aria-labelledby="framework-style"><h3 id="framework-style">문서와 도구의 시각 기준</h3><p>Figma의 Foundations에서 확인한 본문 16/24, 보조 문구 14/20, 레이블 13/18, 큰 제목 48/56과 4·8·12·16·24·32 간격을 문서 화면의 리듬에 반영합니다. KLIC의 블루 계열과 4단계 토큰 참조를 유지하고, 실행 예제의 내부 스타일은 별도로 조정합니다.</p><p>프리뷰는 기본 1920px 논리 너비로 구성하고 화면 맞춤으로 축소 표시합니다. 100%로 전환하면 실제 크기에서 스크롤하며 확인할 수 있습니다. 축소된 프리뷰만으로 본문의 가독성이나 조작 영역 검사를 완료했다고 판단하지 않습니다.</p></section>
<section class="framework-section framework-references" aria-labelledby="framework-references"><h3 id="framework-references">참고 자료와 검증 범위</h3><ul><li><a href="https://github.com/klic-co-kr/KLIC-WCAG-KRDS/blob/204b0276340c29fccc5b3ba52ba5d2806133e1ef/README.md" target="_blank" rel="noopener">KLIC-WCAG-KRDS · 참조한 커밋 204b027</a></li><li><a href="https://reui.io/blocks/application/dashboard/dashboard-1" target="_blank" rel="noopener">ReUI Dashboard 1 · 블록과 의존성 확인 방식</a></li><li><a href="https://www.figma.com/design/wpWaKSR8tiMo0y5FSUisrC/acc0mplish--Design-v0.1?node-id=4005-41386" target="_blank" rel="noopener">Figma Foundations · 문서 타이포그래피와 간격</a></li></ul><p>이 페이지는 설계 원칙과 검증 기준을 정리합니다. KLIC-WCAG-KRDS 전체 규칙 통과, WCAG 적합성 인증 또는 모든 화면의 보조기술 검증 완료를 의미하지 않습니다. 실제 제품에서는 각 상태와 화면을 별도로 검사하고 증거를 남겨야 합니다.</p></section>
${renderDesignGuidance(locale)}</article>`;}
