# KLIC 기술 계약 v1.1

PRD v1.1의 D01–D08을 구현한다. v1.0 상세 FR은 아래의 현재 프로파일 설명과 함께 유지하며 충돌 시 이 문서의 결정이 우선한다. 사이트 예제·토큰 엔진의 구현 범위와 소비 앱 도입 요구를 구분한다.

## 1. 값의 소유권·예외

Primitive만 literal을 소유한다. Brand → Primitive, Semantic → Brand, Component → Semantic의 정확히 한 단계 참조만 허용한다. 동일 버전·지원 설정 전체에서 Primitive의 경로 집합·타입·값은 같아야 한다. 색·radius·density·글자 배율·콘텐츠 폭을 바꾸면 Brand alias만 선택한다. Site의 사용자 설정 범위는 preferences.mjs의 정규화된 유한 목록이다. 임의 원시 값을 같은 경로에 덮어쓰지 않는다.

`applySemanticOverrides(tokens, brand, overrides, policy)`는 토큰 그래프를 복사해 승인된 remap만 적용하고 다시 검증한다. 정책은 신뢰하는 컴파일러 입력이다. 사용자 override 파일에 정책 승인권을 주지 않는다. 운영 기본 정책은 빈 allowlist이며 예외가 필요할 때 저장소 검토를 거쳐 등록한다.

| 제한 | 계약 |
| --- | --- |
| 경로 | 기존 Semantic leaf의 정확한 경로만 |
| 타입 | 기존 leaf·정책·대상 Brand leaf의 타입이 모두 같아야 함 |
| 값 | 승인된 Brand leaf의 전체 alias 하나만 |
| 금지 | literal, Primitive 직접 참조, 새 경로, 타입 변경, 삭제 |
| 승인 단위 | brand + path + type + targets; 사유·소비자 diff·검토자 기록 첨부 |

설명용 B fixture: 공통 `control.height.lg`는 별도 관리 척도다. 먼저 이 Brand leaf가 2.5rem Primitive를 선택하도록 하고, 아래 remap만 허용한다.

```diff
 klic.brand.dimension.control.height.lg
-  {klic.primitive.dimension.step.9}
+  {klic.primitive.dimension.step.10}
 klic.semantic.size.action.default
-  {klic.brand.dimension.control.height.md}
+  {klic.brand.dimension.control.height.lg}
```

정책: `[{"brand":"b","path":"klic.semantic.size.action.default","type":"dimension","targets":["klic.brand.dimension.control.height.lg"]}]`.

기본 Button 2.25→2.5rem, Input은 2.25rem 유지. lg Button은 원래 lg Brand 척도의 소비자이므로 이 예시에서는 함께 2.5rem으로 바뀐다. 이것은 기본 Button만의 소비자 diff라고 거짓 표시하지 않는다. 모든 Button 크기에서도 다른 소비자를 바꾸면 안 되는 제품은 독립 Brand 척도와 Semantic 역할을 공통 inventory에 먼저 등록한다. 수용 fixture는 기본 Button/Input 차이와 Primitive 유지에 초점을 둔다. 실제 브랜드 사양이 아니다.

## 2. 저장·병합·타이포

정본 교환 JSON은 중첩 객체와 각 leaf의 명시적 `$type`, `$value`다. 평면 dotted map은 엔진 내부 표현이며 JSON 키에 점을 넣는 DTCG 교환 파일이 아니다. `nestedTokens()`로 내보내기 전 그래프를 검증한다.

타이포는 font-family·font-size·font-weight 등 독립 leaf를 사용한다. 한 글꼴 변경 때문에 전체 typography composite를 복제하지 않는다. 현재 line-height·letter-spacing·반응형 조건은 recipe에 명시하며, 해당 타입을 추가할 때 schema와 회귀 fixture를 함께 확장한다. 지원하지 않는 composite를 완성된 DTCG typography 토큰이라고 내보내지 않는다.

그룹은 승인된 inventory 안에서 경로별 합성, typed leaf는 전체 교체한다. 배열 연결·composite 부분 병합·삭제·타입 변경·그룹/leaf 충돌은 금지한다. brand overlay는 Brand 등록 경로에만, Semantic overlay는 §1의 allowlist에만 적용한다. 이전 브랜드를 다음 브랜드의 default로 상속하지 않는다.

## 3. KLIC 제한 프로파일 1.1

**DTCG 전체 conformance 또는 DTCG Resolver 구현을 주장하지 않는다.** DTCG 2025.10에 맞춘 출력 부분집합과 KLIC 소유권 검증기다. 일반 DTCG 파일 importer는 이번 범위가 아니다.

| 기능 | 지원과 판정 |
| --- | --- |
| 그룹 | 중첩 export만 지원. 내부 leaf prefix 충돌 거부 |
| `$type` | 매 leaf 명시 필수. 그룹 상속 importer 미지원 |
| dimension | 유한 숫자와 unit `rem`만. px는 현재 미지원 |
| color | `srgb`, 유한 0..1 성분 정확히 3개, alpha 생략 시 1 또는 유한 0..1 |
| fontFamily | `font-registry.mjs`의 `FONT_NAMES`에 등록된 정확한 CSS family 문자열만 |
| fontWeight | 정수 100..900. 전체 표준 허용값의 지원 주장 아님 |
| alias | `{전체.klic.leaf.경로}` 한 개. 타입 일치·인접 계층·순환·누락 검사 |
| alpha CSS | 불투명은 hex, alpha가 1 미만이면 `rgb(r g b / alpha)` |
| 미지원 | typography/shadow/gradient composite, number, duration, cubicBezier, 배열 값, `$extends`, `$root`, JSON Pointer, Resolver context 문서 |
| metadata | 설명은 보존할 수 있으나 값 해석을 바꾸지 않음. 이 엔진은 일반 DTCG metadata 적합성 검증기가 아님 |

지원 범위 밖 타입·해석은 명시적으로 실패한다. `$extends` 등 importer 기능은 importer가 없으므로 지원되지 않는다. JSON 파싱 성공을 적합성 성공이라고 표시하지 않는다. primitive에 새 지원 타입을 추가할 때 타입 검증·출력 변환·오류 fixture를 함께 추가한다.

## 4. 이름 변환

경로는 `klic.(primitive|brand|semantic|component).segment...`. segment 문법은 `[a-z0-9]+(?:-[a-z0-9]+)*`. 숫자로 시작하거나 숫자만인 segment는 허용한다. 대문자·공백·점이 든 단일 키·선두/후미/연속 하이픈은 금지한다. 자동 소문자 변환이나 slug 정규화는 하지 않는다.

CSS 이름 = `--` + dotted path의 모든 `.`을 `-`으로 치환. `step.8` → `--klic-primitive-…-step-8`이며 `--klic-` 접두어가 있어 숫자 시작 segment를 별도 escape할 필요가 없다.

`step.2-5`는 이름 하나이고, `step.2.5`는 두 그룹 경로다. 소수 척도 이름은 전자만 사용한다. 둘이 같은 CSS 이름을 만들면 컴파일 오류다. `a-b` 대 `a.b`도 충돌로 실패한다. 하나를 자동 우선 선택하지 않는다. 정본→CSS 출력 map은 export의 dotted map에서 같은 규칙으로 재생성한다.

## 5. 빌드와 런타임

제품 배포는 선택한 프로필별 산출물, 그 안에서 Light/Dark 전역 전환이다. `compileThemeCSS(brand, appearance)`는 두 mode의 그래프를 각각 완성·검증·alias 해석한 뒤 **모든 leaf의 최종 literal**을 출력한다.

```css
:root[data-theme="light"] { /* 전체 literal map */ }
:root[data-theme="dark"]  { /* 전체 literal map */ }
```

초기 렌더링 전에 html의 data-theme를 지정한다. 런타임에는 속성만 전환한다. Site에서 표현 프로필/사용자 설정을 바꾸면 이 두 map을 재생성한다. Primitive·Brand·Semantic·Component 관계는 JSON 추적용이며 CSS의 var() 네 겹으로 유지할 의무는 없다. 여기서는 alias를 고정된 literal로 컴파일하며 런타임 CSS alias를 남기지 않는다.

전역 Portal은 같은 document의 body 아래에서 root 문맥을 상속한다. 별도 document/iframe은 문맥을 전달해 그 문서에 재생성한다. closed overlay도 전환 후 새 map을 받는지 확인한다. native control은 color-scheme을 맞춘다. scoped/nested theme·같은 화면 반대 모드·다중 브랜드 배포는 이 프로파일에서 지원하지 않으며 그 시험 AT16은 조건부 제외다. Site의 내부 isolated preview와 제품 지원을 혼동하지 않는다.

## 6. PageTitle 예시의 DOM 계약

예시값이지 현재 모든 제목의 기본값은 아니다. 컨테이너 단위는 이름으로 고정되지 않으므로 **scope의 직접 자식 title** 구조를 사용한다. 같은 요소에 containment를 적용해 자기 크기를 기준으로 삼는 방식은 사용하지 않는다.

```html
<div class="page-title-scope"><h1 class="page-title">긴 한글 제목</h1></div>
```
```css
.page-title { font-size:1.5rem; line-height:1.25; overflow-wrap:anywhere; }
@supports (container-type:inline-size) and (font-size:1cqi) {
  .page-title-scope { container:klic-page-title / inline-size; min-inline-size:0; }
  @container klic-page-title (min-width:0px) {
    .page-title-scope > .page-title {
      font-size:clamp(1.5rem, calc(.9375rem + 1.171875cqi), 1.875rem);
    }
  }
}
```

직접 자식 사이에 다른 eligible container를 삽입하면 계약 위반이다. 바깥에 nested container가 있어도 가장 가까운 scope를 사용한다. scope가 없거나 기능 미지원이면 1.5rem fallback이다. 적용 앱은 DOM 검사와 computed style 둘 다 확인한다.

root 16px에서 기울기=(30−24)/(1280−768)=6/512=0.01171875. 절편=24−768×0.01171875=15px=0.9375rem. `cqi` 계수=100×0.01171875=1.171875. clamp 결과는 폭 768/1024/1280에서 24/27/30px다. 제목의 실제 확대와 WCAG 수용은 별도 시험이며 이 계산으로 대체하지 않는다.

## 공통 설계 규칙의 구현 책임과 조합

7 디멘션은 검토 관점이며 모든 규칙을 토큰으로 표현할 의무는 없다. 값은 4계층 그래프에서, DOM 관계·배치·포커스·상태 전이는 해당 구조와 recipe에서 책임진다. 정본 매핑은 `design/architecture.json`이며 등록 토큰·FR/AT·소스·검사 경로를 빌드에서 확인한다. 연결 파일의 존재는 제품 수용시험 통과를 의미하지 않는다.

Preset은 실제 API의 허용된 설정 조합으로 관리한다. 토큰의 추가 계층이나 임의 override 경로로 사용하지 않는다. 데이터·상태·권한·이벤트는 별도 계약으로 유지한다. 충돌 시 정보·조작·접근성을 먼저 보존하고 재배치, 승인된 간격·표면 조정, 예외 기록 순으로 해결한다.

## 7. 상세 FR과 역사적 출처

다음 절은 v1.0의 세부 행동 요구를 보존한다. ReUI 수치·계열 설명은 이관 검토용이며 현재 설치 사실이 아니다. 현행 지원·소유권·출력 결정은 위 §1–§6과 requirements register가 우선한다. 가상화·모바일·Radix 등은 해당 기능 채택 시에만 적용한다.


### FR01–FR10 현행 요구사항

**FR01 4계층 참조 — 필수 또는 명시한 도입 조건.** §1 인접 계층·literal 소유권.

**FR02 Primitive 불변성 — 필수 또는 명시한 도입 조건.** §1 전체 지원 설정의 집합·타입·값 불변.

**FR03 독립 척도 — 필수 또는 명시한 도입 조건.** §1–§2 control·spacing·icon·radius의 변경 의도 분리.

**FR04 Semantic 예외 — 필수 또는 명시한 도입 조건.** §1 브랜드·경로·타입·대상 allowlist.

**FR05 이름 — 필수 또는 명시한 도입 조건.** §4 숫자·하이픈·CSS 충돌 검사.

**FR06 타입과 참조 — 필수 또는 명시한 도입 조건.** §3 KLIC 제한 프로파일.

**FR07 합성 — 필수 또는 명시한 도입 조건.** §2·§5 완성 그래프의 alias 해석과 typed leaf 전체 교체.

**FR08 실패와 기본값 — 필수 또는 명시한 도입 조건.** §3·§5 미지원 brand/mode·누락·충돌 실패와 결정적 출력.

**FR09 호환 adapter — 필수 또는 명시한 도입 조건.** ReUI를 도입할 소비 앱에서만 단방향 adapter·writer·로드 순서를 고정한다. 현재 ReUI 미설치.

**FR10 테마와 Portal — 필수 또는 명시한 도입 조건.** §5 전역 Light/Dark·동일 document Portal. nested theme는 별도 도입.

## 6 7 디멘션의 설계 산출물

다음 표는 각 축의 기본 연결이다. 값이 같은지와 설계 의도가 같은지를 구분한다. 숫자로 표현되지 않는 읽기 순서나 focus 복귀 규칙도 해당 축의 명세에 포함한다.

| 축 | Brand 재료와 Semantic 역할 | Component에서 보장할 결과 |
| --- | --- | --- |
| 1 크기와 비율 | 컨트롤·아이콘·콘텐츠 폭 척도 → action·input·navigation·overlay 크기 | size별 높이, min/max 폭, 조작 영역, 좁은 공간의 크기 정책 |
| 2 타이포그래피 | family·font-size·weight·line-height → 제목·본문·label·메타 역할 | 역할별 resize 정책, 줄바꿈, 실제 한글 fallback, 동반 높이 |
| 3 색과 명도 대비 | palette·accent·alpha → text·action·surface·border·status | 상태와 표면별 실제 합성 대비, 색 이외의 의미 표현 |
| 4 배치와 정렬 | 반복 폭·offset·경계 값 → 콘텐츠·내비게이션·overlay 배치 | 읽기·Tab 순서, 열 재배치, 충돌 처리, sticky와 scroll 소유권 |
| 5 간격과 그룹화 | 독립적인 spacing 척도 → action·container·field·data-cell 간격 | label·input·helper 묶음, 그룹 구분, 명시적인 density |
| 6 표면과 깊이 | radius·border·shadow·layer 재료 → 컨테이너·떠 있는 표면·모달 | 경계와 그림자, z-order·stacking context, pinned·overlay 관계 |
| 7 상호작용과 피드백 | duration·easing·focus 재료 → 상태·전환·처리 피드백 | 상태 공존, 키보드·포인터·터치, 로딩·오류·복구, 모션 선호 |

**FR11 축별 명세 완결성 — 필수.** 채택한 컴포넌트는 7 디멘션별 적용 내용 또는 해당 없음의 이유를 남긴다. 토큰이 없는 축을 곧바로 누락으로 처리하지 않으며, 동작이 필요한 축을 값만 정의하고 완료로 처리하지 않는다.

## 7 크기와 간격의 이관

### ReUI 이관 참고값 — 예시, Site 기본값 아님

다음은 Nova와 Tailwind 4.3.1 기본 척도를 바탕으로 확인한 이관 기준이다. px 환산은 root 16px 가정이며 실제 설치본의 override를 우선 확인한다. 브랜드의 새 목표 크기와 혼합하지 않는다. [S02][S06]

| 대상 | 원본 값 | 제안 Semantic |
| --- | --- | --- |
| Button xs | 1.5rem | `size.action.xs` |
| Button sm | 1.75rem | `size.action.sm` |
| Button default | 2rem | `size.action.default` |
| Button lg | 2.25rem | `size.action.lg` |
| Input default | 2rem | `size.input.default` |
| Button default inline padding | 0.625rem | `space.action.inline.default` |
| Button default gap | 0.375rem | `space.action.content-gap.default` |
| Card default와 compact 간격 | 1rem과 0.75rem | `space.container.default`와 `.compact` |
| Field 내부와 FieldGroup 간격 | 0.5rem과 1.25rem | `space.field.internal`과 `.group` |
| Popover 폭 | 18rem | `size.overlay.popover` |
| Sidebar desktop과 mobile과 icon 폭 | 16rem과 18rem과 3rem | `size.navigation.*` |

표의 Semantic 축약 표기는 모두 `klic.semantic.` 아래에 둔다. 실제 alias에는 전체 경로를 쓴다.

**FR12 크기와 간격 보존 — 필수.** size, icon 유무, slot 유무에 따른 조건까지 이관한다. 같은 높이를 유지하더라도 padding·gap·icon 크기가 달라지면 차이를 기록한다. 시각 높이와 실제 hit area는 별도로 검증한다.

### 밀도

Data Grid의 default와 dense는 셀 padding과 header 높이의 별도 계약이다. 기본 inline padding은 step 3 대 step 2, body block padding은 step 2 대 step 1.5, header 높이는 h-10 대 h-8이다. [S07]

**FR13 밀도 독립성 — 필수.** 창이 좁아졌다는 이유만으로 dense와 작은 글자를 자동 적용하지 않는다. 명시적 density 변경은 적용 범위, 글자·padding·행 측정·조작 영역의 영향을 설명해야 한다. 수용 기준은 density 변경이 관련 Data Grid에만 반영되고 다른 폼과 내비게이션을 의도치 않게 줄이지 않는 것이다.

## 8 타이포그래피와 리사이즈

### 역할별 계약

**FR14 타이포 역할 명세 — 필수.** 각 역할에 출처와 결정 상태, 기준, 변화 방식, 크기와 구간, family·weight·line-height·letter-spacing, 한글 fallback, 줄바꿈·말줄임, 동반 기하, fallback과 시험 조건을 기록한다. Brand는 재료를 선택하고 Semantic은 역할의 규칙을 정의하며 Component는 실제 컨테이너·높이·overflow에 적용한다.

| 역할 | 기준과 변화 방식 | 기준안 |
| --- | --- | --- |
| 본문과 설명 | 폭 변화에 stable | 역할의 rem 크기를 유지하며 줄바꿈과 열 구성을 조정 |
| Button label | 명시적 size | 원본 variant를 보존. 긴 문구를 위한 다중 행은 별도 recipe |
| Input과 Textarea | viewport stepped | 원본 `text-base md:text-sm`와 해당 line-height 전환 보존 |
| Card title | Card size | default 1rem, compact 0.875rem과 원본 행간 규칙 |
| Dialog title | 별도 역할 | CardTitle과 같은 크기여도 원본 line-height 차이를 유지 |
| FileType label | fit-to-artwork | 아이콘 컨테이너와 문자 수에 따른 원본 국소 식을 보존 |
| PageTitle | container fluid 후보 | 아래의 1.5rem에서 1.875rem 후보를 별도 검증 |

Input은 Tailwind 기본값에서 1rem과 unitless 행간 1.5, md 이상에서는 0.875rem과 행간 1.25/0.875의 조합이다. root 16px 가정 시 16/24px에서 14/20px로 바뀐다. CardTitle의 leading-snug와 DialogTitle의 leading-none을 하나의 공통 제목 스타일로 덮어쓰지 않는다. FileType의 국소 fit 규칙은 해당 구현을 기준으로 보존한다. [S02][S06][S12]

**FR15 네 가지 변화 조건 — 필수.** 창의 CSS viewport, 실제 콘텐츠 컨테이너, 사용자 확대, 명시적 density를 각각 명세하고 시험한다. page zoom도 CSS viewport를 바꿀 수 있으므로 코드가 리사이즈의 원인을 항상 구별할 수 있다고 가정하지 않는다. [S10]

### PageTitle 후보와 계산 — 예시, DOM 계약은 현행 §6 우선

이 후보는 제품 제목에 대한 신규 제안이다. ReUI 공식 규칙이나 제품 승인값이 아니다. CardTitle과 본문에는 자동 전파하지 않는다.

| 항목 | 후보 |
| --- | --- |
| 기준 | 이름이 지정된 page-content의 inline-size |
| 최소와 최대 | 1.5rem과 1.875rem |
| 보간 구간 | 컨테이너 48rem에서 80rem |
| 글꼴 조합 | 제품 sans, weight 500, unitless line-height 1.25 |
| 넘침 | 줄바꿈과 긴 식별자의 비상 줄바꿈 허용, 자동 높이 |
| fallback | 해당 container 규칙이 적용되지 않으면 1.5rem |

root 16px 조건에서 시작점은 768px·24px, 끝점은 1280px·30px다. 기울기는 (30−24)/(1280−768)=0.01171875이며 절편은 15px다. 후보 CSS 식은 다음과 같다.

```css
font-size: clamp(
  1.5rem,
  calc(0.9375rem + 1.171875cqi),
  1.875rem
);
```

| 콘텐츠 폭 | 320px | 480px | 768px | 1024px | 1280px | 1920px |
| --- | --- | --- | --- | --- | --- | --- |
| 계산된 글자 크기 | 24px | 24px | 24px | 27px | 30px | 30px |

표는 산술 결과다. 창이 1920px이라도 콘텐츠 컨테이너가 1024px이면 이 후보의 제목은 27px이다. `cqi`는 해당 축의 size query가 가능한 가장 가까운 조상 컨테이너를 기준으로 한다. 이름이 있는 query를 썼다고 단위의 기준까지 자동으로 그 이름에 고정되지는 않는다. 적격 컨테이너가 없을 때의 단위 fallback도 고려해야 한다. [S09]

**FR16 유동 타이포의 적용 조건 — 후보 채택 시 필수.** 실제 DOM의 기준 컨테이너, 중간 컨테이너 유무, 기능 미지원 fallback, 줄바꿈과 높이, 확대 시험을 함께 명세한다. 수용 기준은 표의 대표 폭과 보간 경계에서 계산이 일치하고, 긴 한글·혼합 문자·무공백 식별자·글꼴 로딩 전후에 내용이 보존되는 것이다.

### 확대와 접근성

**FR17 확대와 reflow — 필수.** 지원되는 수단으로 텍스트를 기본 크기의 200%까지 확대할 수 있어야 하며 해당 기준의 예외를 제외하고 내용·기능 손실이 없어야 한다. 일반적인 세로 콘텐츠는 320 CSS px에 해당하는 폭에서 Reflow를 충족해야 한다. 의미나 사용상 2차원 배치가 필요한 부분의 예외는 적용 근거를 기록한다. [S10]

브라우저 200% 메뉴와 실제 글자의 두 배를 동일시하지 않는다. 위 후보가 1280px에서 30px이고 200% page zoom 후 컨테이너가 640 CSS px이라고 가정하면, 하한 24 CSS px의 화면상 크기는 약 48로 원래의 1.6배다. 이는 계산 반례이며 실제 실패 판정은 아니다. `rem + cqi + clamp()`만으로 200% 글자 확대 충족을 선언할 수 없다는 뜻이다. [S10]

사용자 spacing override는 줄 높이 1.5배, 문단 뒤 간격 2배, 자간 0.12em, 단어 간격 0.16em를 해당 언어에 적용 가능한 범위에서 시험한다. 이것은 기본 디자인에 같은 수치를 강제하는 요구가 아니다. `h-8` 등 rem 높이 자체를 접근성 실패로 단정하지 않고 실제 확대 시 공간과 기능을 확인한다. [S10]

수용 기준은 브라우저 확대와 지원되는 텍스트 조정, 긴 콘텐츠, 오류·busy 상태에서 잘림과 조작 손실이 없다는 시험 기록이다. viewport만 바꾸거나 root font-size만 바꾼 결과를 실제 확대 시험 전체로 대체하지 않는다.

## 9 배치와 breakpoint와 가상화

### 서로 다른 breakpoint

**FR18 breakpoint 도메인 분리 — 필수.** 같은 md라는 이름만으로 viewport, container, JS hook의 조건을 합치지 않는다. [S06][S08]

| 적용 위치 | 기준값과 의미 |
| --- | --- |
| Input의 viewport md | Tailwind 4.3.1 기본 48rem |
| Field의 container md | Tailwind 4.3.1 기본 28rem. FieldGroup의 폭을 기준으로 responsive orientation 전환 |
| Sidebar 모바일 hook | 원본 768px 분기. CSS md와 출처와 해석이 다름 |

소비 앱이 CSS md만 64rem으로 바꾸고 기본 글꼴 16px·viewport 900px을 가정하면 JS는 desktop을 선택하지만 CSS desktop 영역은 숨겨질 수 있다. 이는 조건부 정적 반례이며 현재 제품에서 재현한 장애가 아니다.

경계를 바꾸는 경우 CSS query와 JS matchMedia 조건을 같은 확정 입력에서 생성하거나 동기화 계약을 둔다. media-query의 rem을 computed html font-size와 항상 같다고 가정하지 않는다. 일반적인 `@media` 조건 안의 `var()`로 런타임 테마처럼 breakpoint를 바꾸는 설계를 채택하지 않는다. 수용 기준은 경계 직전·직후, 사용자 기본 글꼴 변경, 열린 Sidebar의 전환에서 내용과 조작이 보존되는 것이다. [S05][S08]

### 배치 규칙

**FR19 구조와 거리의 분리 — 필수.** 반복되는 폭·inset·offset·gap은 토큰으로 관리하고, 읽기 순서·열 구성·충돌 처리·sticky·scroll 소유권은 recipe와 동작 계약으로 관리한다. 예를 들어 Popover의 offset과 side·align·collision은 서로 다른 책임이다.

수용 기준은 재배치 후 DOM 읽기 순서와 키보드 순서가 의미를 유지하고, 좁은 패널에서 제목·action·필터와 결과의 관계가 보존되는 것이다. 화면에서 크게 보이는 요소와 업무 우선순위가 일치하는지도 대표 업무 흐름에서 확인한다.

### 가상화 Data Grid

원본 가상 행의 기본 estimateSize는 48이고 overscan은 10이다. 행 측정 ref는 custom measureElement가 있을 때 연결된다. 이 숫자를 모든 제품의 정답이나 전역 행 높이로 채택하지 않는다. 수평 가상화도 원본의 fixed layout과 단일 비그룹 header 조건을 고려하며 모든 table 조합에 지원된다고 가정하지 않는다. [S07]

**FR20 가상 행의 기하 계약 — 사용 시 필수.** 고정 높이와 가변 높이 모드를 구분하고 초기 추정, 실제 측정, 폰트·줄바꿈·density·열 폭 변경 후 재측정 조건을 정한다. row identity, scroll owner, 선택, 편집 중 셀, focus 복귀와 스크롤 위치 보존 정책을 명세한다. 실측된 셀 높이와 scroll offset은 런타임 데이터로 유지한다.

수용 기준은 긴 한글, 글꼴 로딩, 열 리사이즈, density 변경, 사용자 확대 후 행 겹침·잘림·잘못된 스크롤·focus 유실이 없는 것이다. 첫 행·중간 행·마지막 행으로 이동하며 스크롤 끝, 선택·편집 중 셀, pinned·sticky 영역과 화면 밖 행의 접근 경로를 확인한다. 지원하는 열 가상화 조합은 실제로 활성화되고 미지원 조합은 명세한 전체 열 렌더링 등의 fallback으로 동작해야 한다. 추정·실측·재측정과 fallback 증거를 남기며 정적 토큰 값이 맞는 것만으로 가상화 검증을 통과하지 않는다.

## 10 색과 표면과 깊이

**FR21 색 역할과 대비 — 필수.** Light와 Dark의 action·text·surface·border·status 역할을 구분하고 실제 배경과 alpha 합성 결과에서 대비를 검증한다. Neutral 기준의 Light primary는 `oklch(0.205 0 0)`, Dark primary는 `oklch(0.922 0 0)`이다. 사이트 전용 색을 Registry 테마의 정본과 섞지 않는다. [S02]

| 검사 | 기준과 주의점 |
| --- | --- |
| 일반 텍스트 | WCAG 1.4.3 AA의 4.5 대 1 이상 |
| 큰 텍스트 | 3 대 1 이상. 원칙적으로 18pt 이상 또는 14pt bold 이상이며 CJK는 상당 크기 |
| 크기 환산 | 18pt는 24 CSS px, 14pt는 약 18.667 CSS px. weight 500을 자동으로 bold로 보지 않음 |
| 비텍스트 | 1.4.11 AA의 적용 대상인 식별에 필요한 UI·상태·그래픽과 인접 색에 3 대 1 이상 |
| 색 이외의 정보 | 오류·선택·범례를 문구·표식·패턴 등으로도 식별 가능하게 함 |

모든 장식 border나 비인접 default·hover 색 사이에 일괄적으로 3 대 1을 요구하지 않는다. 각 기준의 적용 범위와 예외를 기록하고 경계값을 반올림하여 통과시키지 않는다. 스크린리더 전용 이름만으로 시각 사용자의 색 구분 문제를 해결했다고 판단하지 않는다. [S11]

**FR22 표면과 레이어 — 필수.** radius, border, shadow와 z-order를 구분한다. Card, Dialog, Popover, Sheet, Sidebar의 원본 경계·그림자 관계를 보존하고 overlay·sticky·pinned의 stacking context를 확인한다. 숫자가 큰 z-index 하나를 전역 해결책으로 사용하지 않는다.

수용 기준은 중첩 overlay와 pinned 영역이 의미 있는 내용·focus·조작을 가리지 않고, 투명 표면이 뒤의 행 상태나 콘텐츠를 의도치 않게 비추지 않는 것이다. 원본의 dirty·new 행 배경 등 기능 상태는 제품이 그 기능을 쓰는 경우 함께 보존한다. [S07]

## 11 상태와 비동기 동작

### 상태의 속성별 소유권

**FR23 상태 조합 — 필수.** hover, selected, invalid, focus, disabled, busy를 하나의 배타적 우선순위 줄로 정의하지 않는다. 배경, border, focus 표시, 문구, 아이콘, 활성화와 focus 가능 여부를 속성별로 지정한다.

| 상태 | 요구되는 계약 |
| --- | --- |
| invalid와 focus | 오류 의미와 키보드 focus가 함께 식별되고 오류 문구가 입력과 연결됨 |
| selected와 hover와 focus | hover가 선택 의미를 지우지 않으며 프로그램적 상태와 일치함 |
| readonly | 선택·복사·Tab·제출 의미를 보존하고 disabled로 대체하지 않음 |
| disabled | HTML disabled와 aria-disabled를 구분하고 실제 실행 차단 여부를 구현함 |
| busy | 진행 표시, 중복 실행 차단 범위, 취소 가능성, 완료·실패 후 label과 focus 복귀를 지정함 |

`aria-disabled` 선언 자체가 이벤트 실행을 막지는 않는다. 원본 Button의 로딩 예시 조합을 기본 컴포넌트의 기존 loading API로 설명하지 않는다. 제품 async wrapper를 추가하면 신규 API와 동작으로 기록한다. [S12][S15]

### 비동기 상태

**FR24 데이터와 처리 피드백 — 필수.** 최초 로딩, 실제 빈 데이터, 검색·필터 0건, 기존 데이터의 갱신, 부분 실패, 추가 로드 실패, 저장과 낙관적 변경을 구분한다. 숫자 0, null, 알 수 없음을 같은 빈 문자열로 합치지 않는다.

수용 기준은 상태 전이가 아래의 내용을 보존하는 것이다. 최초 로딩 중 빈 결과 문구가 먼저 깜박이지 않는다. 검색 0건에는 조건 수정 경로가 있다. 부분 실패는 성공한 결과를 유지할 범위를 설명한다. 재시도와 낙관적 실패 복구는 입력·선택·스크롤을 의도에 맞게 보존한다. 성공·실패·진행 안내는 실제 데이터 및 저장 상태와 일치해야 한다. 필요한 상태 안내는 focus를 강제로 옮기지 않고 프로그램적으로 전달하며 반복 알림을 제어한다. 중요한 입력 오류에는 해당 입력과 연결된 원인·수정 경로를 제공하고 사라지는 toast만으로 처리하지 않는다. [S07][S14]

### 구현 계열의 차이

**FR25 Base UI와 Radix 보존 — 해당 구현 사용 시 필수.** Button의 render와 asChild, Dialog의 Backdrop·Popup과 Overlay·Content, Sheet의 상태 선택자, Popover의 Positioner 구조를 구분한다. 공통화 대상은 역할과 제품 계약이며 DOM/API/lifecycle까지 같다고 가정하지 않는다. [S12]

수용 기준은 사용하는 구현 계열에서 실제 props 전달, 상태 선택자, open·close lifecycle과 Portal 위치가 검증되는 것이다. wrapper가 어느 props를 Positioner에 넘기고 어느 props를 Popup에 넘기는지도 기록한다.

## 12 조작과 접근성과 환경

이 절은 채택한 컴포넌트와 실제 업무 흐름에서 검증할 기준이다. 목표는 적용 가능한 WCAG 2.2 AA 요구와 제품 동작 계약을 충족하는 것이다. AAA 항목이나 제품 선택을 AA의 필수 조항으로 소개하지 않는다.

**FR26 조작 영역과 이름 — 필수.** 버튼·아이콘·입력의 시각 크기와 hit area를 구분하고 실제 target 경계·겹침·간격을 확인한다. WCAG 2.5.8 AA의 기본 대상은 24×24 CSS px이며 spacing, 같은 페이지의 동등한 조작, inline, 사용자 에이전트, essential 등 해당 예외를 정확히 기록한다. spacing 예외는 대상 중심의 지름 24 CSS px 원이 다른 대상이나 해당 원과 겹치는지 판단하는 규칙을 따른다. 44px를 모든 AA UI의 일률적인 최솟값으로 쓰지 않는다. 접근 가능한 이름·역할·상태를 제공한다. [S13][S15]

**FR27 키보드와 focus — 필수.** Tab 순서, 해당 위젯의 방향키, 실행·취소, focus 진입과 복귀를 명세한다. 모달과 비모달을 구분한다. 모달 Dialog는 적절한 초기 focus, 열린 동안 내부 Tab·Shift+Tab 순환, 모달 밖 비활성, 닫기와 trigger 또는 합리적인 다음 작업 위치로의 복귀를 보장한다. trigger 삭제, 중첩 overlay, 길게 스크롤된 내용에서도 같은 계약을 시험한다. overlay별 최상위 dismiss 대상과 focus·scroll lock 소유자를 정한다. focus가 보이고, author-created content에 완전히 가려지지 않도록 한다. 완전히 가려지지 않음은 2.4.11 AA, 전혀 가려지지 않음은 2.4.12 AAA이며 2.4.13의 면적·대비 조건은 AAA다. 2px ring을 모든 AA의 단일 의무라고 표현하지 않는다. [S13][S16]

**FR28 hover와 overlay — 사용 시 필수.** hover·focus로 나타난 추가 정보는 적용 예외를 제외하고 닫을 수 있고 포인터로 이동할 수 있으며 필요한 동안 유지되어야 한다. 포인터나 focus를 옮기지 않고 닫을 수 있는 방식, 공개된 내용 위로 포인터 이동, trigger 해제·사용자 닫기·정보 무효화까지의 유지 규칙을 명세한다. 모바일에서는 hover만으로 필요한 정보를 제공하지 않는다. [S13]

**FR29 모바일 공간 — 지원 환경에서 필수.** 소프트 키보드가 열린 입력, safe area, 동적 viewport, 긴 Dialog·Drawer, 중첩 스크롤에서 입력과 확인·취소 조작에 접근할 수 있어야 한다. scroll owner와 scroll lock 복구를 지정한다. 원본의 dvh나 stacking 처리가 모든 모바일 키보드 시나리오를 보장한다고 단정하지 않는다. 주소창 변화, 가로·세로 전환, 키보드가 열린 채 긴 오류 문구가 표시되는 상황을 실제 지원 환경에서 시험한다. 입력뿐 아니라 도움말·오류·닫기·제출에도 접근할 수 있어야 한다. [S12]

**FR30 모션과 강제 색상 — 필수.** reduced-motion에서는 기능에 필요한 피드백과 닫힘 완료를 유지하면서 불필요한 이동·확대 애니메이션을 줄이는 정책을 적용한다. forced-colors에서는 focus·선택·오류와 필요한 경계가 구분되어야 한다. 원본 ColorPicker에는 관련 부분 대응이 있으므로 대응이 전혀 없었다고 서술하지 않는다. 개별 대응이 제품 전체 지원을 증명하지도 않는다. [S12][S17]

사용 도중 사용자 선호를 바꾸는 경우를 포함하고 CSS 전환뿐 아니라 이동·scale·스크롤·JS 모션의 대체 동작을 확인한다. animation·transition 종료 이벤트가 발생하지 않아도 닫힘 완료·focus 복귀·상태 안내가 멈추지 않아야 한다.

모션 감소에 관한 WCAG 2.3.3은 AAA이고, 자동으로 움직이는 콘텐츠 등에는 별도의 기준이 적용된다. 모든 animation을 AA 위반 또는 일괄 금지로 해석하지 않는다. [S17]

**FR31 한글과 국제화 — 필수 및 조건부.** 한글 fallback의 실제 글꼴·굵기·행간을 확인하고, IME 조합 중 Enter가 잘못 제출·선택·검색을 확정하지 않도록 컴포넌트별 입력 계약을 둔다. 지원 환경의 실제 조합 입력을 시험한다. 이 정책은 제품 입력 계약이며 특정 `isComposing` 구현을 WCAG 의무라고 소개하지 않는다. [S18]

IME 시험에는 한글 조합 중 Enter, Escape, 방향키, Backspace, 붙여넣기와 검색·검증·제출을 포함한다. 조합 중 처리할 행동과 조합 완료 후 처리할 행동을 명세하고 실제 지원 브라우저·IME 조합으로 확인한다. 한 줄의 guard나 합성 keyboard 이벤트만으로 실제 IME 지원을 검증했다고 판단하지 않는다.

번역이 필요한 문구는 외부화하고 긴 문구, 복수형이 필요한 locale, 날짜·숫자·시간대, `lang`과 `dir`을 각각 다룬다. RTL 지원 시 logical properties, 아이콘 방향, 키보드 의미와 Portal 방향 문맥을 검증한다. `lang`과 `dir`을 동일한 설정으로 취급하지 않는다. [S18]

**FR32 드래그 대안 — 사용 시 필수.** 키보드 조작과 별도로 drag 없는 click 또는 tap의 단일 포인터 대안을 제공한다. 2.5.7 AA의 essential 예외는 드래그 방식 자체가 본질적인 경우에 한정해 근거를 기록한다. drag·keyboard·click/tap의 결과, 취소·되돌리기·저장 실패와 focus 복귀를 검증한다. 원본 Sortable에 KeyboardSensor가 있다는 것만으로 단일 포인터 대안을 충족했다고 판단하지 않는다. [S12][S13]


## 증거·이행·재현성

**FR33 증거와 적용 범위 — 필수.** VALIDATION_PLAN_v1.1.md의 상태·출시 등급·최소 표본·승인 규칙과 requirements-v1.1.json을 적용한다. 문서 검토·정적 검사·브라우저 수동 결과를 분리한다.

**FR34 호환과 폐기 — 소비자가 존재할 때 필수.** 구 klic.ref/sys/cmp를 primitive/semantic/component로 이관할 때 Brand 공유 의도를 검토한다. 사용 목록·전후 값·호환 fixture·이행 상태·제거 조건을 남긴다. ReUI의 --primary는 KLIC 구이름과 구분한다. mutable preview Primitive 경로는 v1.1에서 안정된 값별 경로로 교체했다. 외부 소비자가 해당 내부 경로를 직접 사용했다면 재export·diff와 호환 이행을 먼저 검토한다. 공개 npm 패키지 호환을 주장하지 않는다.

**FR35 재현성과 rollback — 필수.** 입력 순서·소스 commit·lockfile·토큰/profile/schema/compiler 버전·선택 context·정본→CSS map·입출력 hash를 제품 빌드 manifest에 남긴다. 같은 입력 재생성과 이전 호환 토큰/adapter/component 조합 복귀를 검사한다. 현재 Git/source SHA와 Sites version은 배포 근거이며 전체 제품 manifest/rollback 시험 완료를 의미하지 않는다. 부분 증거를 구분한다.

## 부록 C 근거와 참조

ReUI 링크는 지정한 commit에 고정했다. 표준과 해설은 해당 페이지의 적용 범위와 규범 수준을 함께 읽는다. DTCG 2025.10 문서는 Community Group 보고서이며 W3C Recommendation과 구분한다. APG는 구현 지침으로 활용하며 WCAG의 규범 조항으로 소개하지 않는다.

**S01 ReUI 기준과 설치 경계.** [고정 저장소](https://github.com/keenthemes/reui/tree/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a), [package.json](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/package.json), [DEFAULT_CONFIG](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/registry/config.ts#L173-L189), [Button 예시 배포 정의](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/public/r/styles/base-nova/c-button-1.json).

**S02 ReUI 테마와 Nova.** [Neutral 테마](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/registry/themes.ts#L5-L77), [Nova 스타일](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/registry/styles/style-nova.css), [사이트 전용 값](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/styles/default.css#L1-L8).

**S03 DTCG 저장 형식.** [Design Tokens Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/), [Color Module 2025.10](https://www.designtokens.org/tr/2025.10/color/).

**S04 DTCG 합성과 컨텍스트.** [Resolver Module 2025.10](https://www.designtokens.org/tr/2025.10/resolver/).

**S05 CSS 변수.** [CSS Custom Properties for Cascading Variables](https://www.w3.org/TR/css-variables-1/).

**S06 Tailwind 기준 척도.** [v4.3.1 theme.css](https://github.com/tailwindlabs/tailwindcss/blob/v4.3.1/packages/tailwindcss/theme.css), [Responsive design 문서](https://tailwindcss.com/docs/responsive-design).

**S07 ReUI Data Grid.** [가상화 기본값과 지원 조건](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/registry-reui/bases/base/reui/data-grid/data-grid-table-virtual.tsx#L666-L701), [행 측정 연결](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/registry-reui/bases/base/reui/data-grid/data-grid-table-virtual.tsx#L843-L850), [Grid API와 상태](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/registry-reui/bases/base/reui/data-grid/data-grid.tsx), [일반 Table과 density](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/registry-reui/bases/base/reui/data-grid/data-grid-table.tsx).

**S08 Field와 Sidebar 경계.** [Field container](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/registry/bases/base/ui/field.tsx#L35-L74), [모바일 hook](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/registry/bases/base/hooks/use-mobile.ts#L3-L14), [Sidebar 분기](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/registry/bases/base/ui/sidebar.tsx#L182-L233).

**S09 Container 단위.** [CSS Conditional Rules Level 5의 container lengths](https://drafts.csswg.org/css-conditional-5/#container-lengths). 진행 중인 명세의 해당 동작을 참고한다.

**S10 확대와 reflow.** [Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html), [F94](https://www.w3.org/WAI/WCAG22/Techniques/failures/F94), [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html).

**S11 대비와 의미.** [Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [Non Text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), [Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html).

**S12 컴포넌트 구현.** [Base Button](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/registry/bases/base/ui/button.tsx), [Radix Button](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/registry/bases/radix/ui/button.tsx), [Dialog](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/registry/bases/base/ui/dialog.tsx), [Sheet](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/registry/bases/base/ui/sheet.tsx), [Popover](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/registry/bases/base/ui/popover.tsx), [Drawer](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/registry/bases/base/ui/drawer.tsx), [ColorPicker](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/registry-reui/bases/base/reui/color-picker.tsx), [FileType](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/registry-reui/bases/base/reui/file-type.tsx), [Sortable](https://github.com/keenthemes/reui/blob/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a/registry-reui/bases/base/reui/sortable.tsx).

**S13 조작과 focus.** [Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [Focus Not Obscured Minimum](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), [Focus Not Obscured Enhanced](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-enhanced.html), [Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html), [Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html), [Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html).

**S14 상태 안내.** [Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html).

**S15 프로그램적 의미.** [WAI ARIA 1.2의 aria-disabled](https://www.w3.org/TR/wai-aria-1.2/#aria-disabled), [Name Role Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html).

**S16 모달 동작 지침.** [ARIA Authoring Practices의 Dialog Modal Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

**S17 사용자 선호와 모션.** [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion), [forced-colors](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors), [Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html), [Pause Stop Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).

**S18 입력과 언어.** [KeyboardEvent isComposing](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing), [W3C 언어와 텍스트 방향](https://www.w3.org/International/questions/qa-direction-from-language).

**관련 설계 문서.** [KLIC ReUI 기반 7 디멘션 4계층 디자인 시스템 설계](https://chatgpt.com/space/page_1ad1ea0e814c8191a098a7c22e0f852c).
