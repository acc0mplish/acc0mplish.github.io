> 보관본 v1.0. 현행 문서: [PRD v1.1](KLIC_Design_System_PRD_v1.1.md), [기술 계약](TOKEN_CONTRACT_v1.1.md), [검증 계획](VALIDATION_PLAN_v1.1.md). 이 문서의 미결정 정책을 현행 구현 기준으로 사용하지 마세요.

# KLIC 디자인 시스템 PRD

## 7 디멘션 4계층 제품 요구사항

| 문서 항목 | 내용 |
| --- | --- |
| 버전 | 1.0 |
| 작성 기준일 | 2026년 10월 23일 |
| 설계 결정 | Primitive → Brand → Semantic → Component의 4계층 적용 |
| 정본 이름 | 모든 KLIC 소유 토큰은 `klic.`으로 시작 |
| 기반 | ReUI 고정 커밋과 실제 소비 앱의 설치 결과 |
| 문서 상태 | 구현 기준 PRD. 4계층 구조는 채택했고 제품별 후보값은 별도로 표시 |
| 구현 상태 | 제품 코드 적용, 브라우저 실측, 접근성 적합성 판정은 아직 수행하지 않음 |

이 PRD는 기존 KLIC 기술설계의 7 디멘션 검토와 적대검토 결과를 유지하면서, 승인된 Brand 계층을 추가한 제품 요구사항 문서다. 7 디멘션은 화면과 행동을 검토하는 관점이며, 4계층은 값의 소유권과 참조 관계다. 두 분류를 서로 대체하지 않는다. ReUI나 DTCG가 이 조합을 표준으로 정했다는 의미도 아니다.

문서의 **원본 확인**은 고정 소스에서 확인한 사실, **채택 계약**은 KLIC이 구현해야 할 요구사항, **후보**는 제품에서 추가 결정할 수치나 동작을 뜻한다. 요구사항의 수용 기준은 앞으로 통과해야 할 조건이며 현재 제품의 시험 결과가 아니다.

## 1 목적과 성공 조건

### 해결할 문제

ReUI의 컴포넌트와 테마를 활용하면서 여러 브랜드를 운영하려면, 원시 수치 변경과 브랜드 선택, 제품 역할 변경, 특정 컴포넌트 변경의 영향을 구분할 수 있어야 한다. 또한 색·높이·글자 크기를 이름만 바꿔 저장하는 것으로는 창 리사이즈, 좁은 패널, 사용자 확대, 상태 공존, Portal, 가상화 목록의 동작을 설명할 수 없다.

KLIC은 원본 값과 동작의 출처를 고정하고, 브랜드별 공통 척도를 별도로 관리하며, Semantic 역할과 Component 동작을 연결한다. 설계 완성도는 계층의 개수보다 변경 영향의 예측 가능성과 검증 가능한 계약으로 판단한다.

### 성공 조건

| 목표 | 완료를 판단하는 조건 |
| --- | --- |
| 브랜드 변경의 예측 가능성 | 같은 Primitive로 서로 다른 브랜드 결과를 만들고, 변경된 소비자와 유지된 소비자를 추적할 수 있음 |
| 역할의 일관성 | 같은 Semantic 역할이 문서·토큰·컴포넌트에서 같은 의미로 사용됨 |
| 원본 보존과 개선의 구분 | ReUI 이관값과 새 제품 규칙의 차이가 변경 기록에 남음 |
| 리사이즈의 완결성 | 창·패널·사용자 확대·밀도에 대한 역할별 타이포와 동반 기하 계약이 존재함 |
| 검증 가능한 배포 | 지원 컨텍스트의 토큰 검증과 채택 컴포넌트의 동작·접근성 시험 증거가 연결됨 |

### 사용자와 대표 시나리오

디자이너는 브랜드를 바꾸어도 제목·본문·주요 행동의 역할을 유지하며 화면을 설계한다. 프런트엔드 개발자는 선택한 브랜드와 모드의 결과물을 빌드하고 ReUI 컴포넌트에 연결한다. 검토자는 특정 수치가 어디에서 왔고 어느 역할에 쓰이며 어떤 시험을 통과해야 하는지 확인한다.

대표 시나리오는 브랜드 A와 B의 기본 컨트롤 높이 차이, Light와 Dark 전환 중 열린 Dialog, 넓은 창 안의 좁은 상세 패널, 한글 제목과 오류 문구가 있는 폼, 밀도 변경과 글꼴 로딩이 발생하는 가상화 Data Grid다. A와 B는 빌드 검증용 설명 이름이며 실제 사업 브랜드의 명세가 아니다.

## 2 범위와 기준 소스

### 최초 적용 범위

최초 구현은 Base UI + Nova + Neutral을 기준 프로필로 삼고 전역 Light와 Dark, 해당 전역 문맥의 Portal을 지원 대상으로 한다. 배포 결과물 하나에는 하나의 브랜드 컨텍스트를 선택한다. 실제 소비 앱의 preset이나 설치 버전이 다르면 먼저 차이를 기록하고 적용 범위를 다시 확정한다. 이 기준은 사용자의 기존 앱 설정을 확인한 결과가 아니다. [S01]

대표 컴포넌트는 Button, Input, Field, Card, Dialog, Sheet, Popover, Table, Data Grid, Sidebar다. FileType, ColorPicker, Code Block, Drawer, Sortable은 관련 기능을 도입할 때 지정 부분의 보존 및 추가 검증 대상이다. Calendar, Gantt, Cascader, Tree, Chart 등 다른 모듈은 채택 시 개별 inventory와 동작 명세를 추가한다.

### 조건부 범위와 제외 범위

| 구분 | 처리 |
| --- | --- |
| 같은 화면의 여러 브랜드와 반대 모드 중첩 | 별도 기능으로 채택한 경우에만 지원 표시. 스코프·Portal·상태 선택자 시험 필요 |
| Radix 구현 | 공통 역할은 공유할 수 있으나 API·DOM·상태 선택자와 lifecycle을 따로 검증 |
| RTL과 추가 locale | 지원 선언 후 번역·방향·키보드·날짜 및 숫자 형식 시험을 추가 |
| 모든 화면의 자동 비례 축소 | 채택하지 않음. 역할별 stable·stepped·fluid·fit 정책을 사용 |
| 모든 CSS 값의 토큰화 | 목표가 아님. 구조·조건·상태 전이·런타임 측정값은 적절한 코드와 명세에 유지 |
| ReUI 전체 우수성 비교 또는 인증 | 이 문서의 범위가 아님. 실제 제품 증거 없이 우수성·무결점·접근성 인증을 주장하지 않음 |

### 소스 고정

| 항목 | 기준 |
| --- | --- |
| 저장소 | keenthemes/reui |
| 고정 커밋 | `067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a` |
| 확인된 package 버전 | ReUI 2.8.1 |
| 수치 환산의 Tailwind 기준 | 4.3.1 기본 척도 |
| 색 정본 | `registry/themes.ts`의 해당 테마 |
| 스타일 기준 | `registry/styles/style-nova.css`와 설치된 컴포넌트 |
| 제외할 사이트 전용 값 | `styles/default.css`의 `--site-*` |

ReUI의 dependency 선언과 실제 소비 앱의 lockfile은 같다고 가정하지 않는다. Registry 예시가 기본 컴포넌트 dependency를 가리키는 경우, 예시를 설치했다는 사실만으로 기본 컴포넌트 구현까지 고정되었다고 판단하지 않는다. 설치된 코드와 생성 CSS를 함께 기록한다. [S01][S02]

## 3 4계층 아키텍처

### 계층별 책임

| 계층 | 정본 경로 | 책임 |
| --- | --- | --- |
| Primitive | `klic.primitive.*` | 브랜드에 따라 의미가 변하지 않는 원시 값·척도·단위·출처 |
| Brand | `klic.brand.*` | 브랜드가 선택한 공통 팔레트, 글꼴, 컨트롤 척도, 간격, 반경, 모션 재료 |
| Semantic | `klic.semantic.*` | 주요 행동, 본문, 입력, 오류, 표면 등 제품 역할과 역할별 선택 규칙 |
| Component | `klic.component.*` | 특정 부품의 slot·size·variant·state에 대한 Semantic 연결 |

**FR01 4계층 참조 계약 — 필수.** 일반적인 값의 참조는 Component → Semantic → Brand → Primitive 순서를 따른다. 역방향 참조와 순환을 금지한다. 컴포넌트가 제품 역할을 건너뛰고 임의의 원시 색·높이를 선택하지 않도록 검사한다. 예외가 필요하면 대상 경로, 이유, 영향 범위, 책임 역할과 검증을 기록하며 암묵적 예외를 만들지 않는다.

수용 기준은 지원 컨텍스트의 모든 토큰에 대해 소유 계층과 참조 방향을 검사하고, 잘못된 참조·순환·타입 불일치 fixture가 빌드에 실패하는 것이다. 값이 필요 없는 구조 규칙에 형식적인 토큰을 추가할 필요는 없다.

**FR02 Primitive 불변성 — 필수.** 같은 버전의 Primitive 토큰은 선택 브랜드에 따라 값이 바뀌지 않는다. `dimension.step.8`이 2rem을 뜻한다면 브랜드 B를 선택해도 2rem이다. 원시 척도 자체를 개정할 때는 새 버전과 영향 분석을 기록한다.

수용 기준은 브랜드 A와 B의 합성 결과에서 Primitive 집합과 값이 같고, 브랜드별 차이가 Brand 또는 허용된 Semantic 매핑에서 설명되는 것이다.

### 채택한 참조 예시

아래 값은 구조를 검증하기 위한 작은 fixture다. 2rem은 기준 프로필의 Button default 높이와 대응한다. 브랜드 B의 2.25rem 선택은 설명용이며 실제 브랜드 사양으로 확정하지 않는다. [S02]

| 단계 | 경로와 참조 |
| --- | --- |
| 원시 값 | `klic.primitive.dimension.step.8 = 2rem` |
| 다른 원시 값 | `klic.primitive.dimension.step.9 = 2.25rem` |
| 브랜드 A | `klic.brand.dimension.control.height.md` → `klic.primitive.dimension.step.8` |
| 브랜드 B | 같은 Brand 경로 → `klic.primitive.dimension.step.9` |
| 의미 | `klic.semantic.size.action.default` → `klic.brand.dimension.control.height.md` |
| 컴포넌트 | `klic.component.button.size.default.height` → `klic.semantic.size.action.default` |

기본 root 크기 16px을 가정하면 A의 결과는 32px, B는 36px이다. rem 값이 정본이며 px는 조건을 붙인 환산값이다. 0.25rem 기본 척도에서 step 8은 2rem, step 9는 2.25rem이다.

### Brand가 공유하는 범위

**FR03 독립적인 Brand 척도 — 필수.** 같은 숫자를 쓴다는 이유만으로 컨트롤 높이, 간격, 아이콘, 반경을 하나의 `brand.dimension.md`로 묶지 않는다. 아래 경로는 서로 다른 변경 의도를 나타낸다. 경로의 범주와 DTCG의 `$type`은 별개의 정보다.

- `klic.brand.dimension.control.height.md`
- `klic.brand.spacing.md`
- `klic.brand.icon.size.md`
- `klic.brand.radius.md`
- `klic.brand.typography.scale.md.font-size`
- `klic.brand.typography.family.body`
- `klic.brand.color.palette.neutral.900`
- `klic.brand.color.accent.600`
- `klic.brand.motion.duration.fast`

수용 기준은 control 높이를 바꾸는 fixture에서 의도한 action·input만 바뀌고 독립적인 spacing·icon·radius 소비자는 그대로인 것이다. Brand leaf는 여러 역할이 공유할 이유가 있을 때 만든다. Semantic마다 일대일 중계 leaf를 기계적으로 추가하지 않는다.

**FR04 브랜드별 Semantic 예외 — 필수.** 같은 Brand 높이를 button과 input이 공유하면 그 값을 바꿀 때 둘 다 바뀐다. 브랜드 B에서 button만 달라야 한다면 독립적으로 관리할 Brand 척도를 추가하거나 명시적으로 허용한 Semantic 매핑을 변경한다. 공통 Semantic의 역할명과 타입은 유지한다.

수용 기준은 공유 변경과 button만의 변경을 각각 시험하고 변경 전후의 소비자 목록이 의도와 일치하는 것이다. Semantic override에는 경로 allowlist, 이유, 대상 브랜드, 변경 이력과 검사 fixture를 둔다. override가 광범위해지면 Brand의 공유 범위를 다시 검토한다.

## 4 이름과 저장 형식

### 이름 규칙

**FR05 정본과 외부 인터페이스 — 필수.** 소유 토큰의 정본 이름은 `klic.`으로 시작한다. `button.size.default.height`와 `button.variant.default.background`처럼 default가 속한 선택 축을 구분한다. `*`는 문서의 경로 패턴에만 사용하고 실제 참조에는 사용하지 않는다.

| 구분 | 예 |
| --- | --- |
| Primitive leaf | `klic.primitive.dimension.step.8` |
| Brand leaf | `klic.brand.dimension.control.height.md` |
| Semantic leaf | `klic.semantic.size.action.default` |
| Component leaf | `klic.component.button.size.default.height` |
| CSS 출력 | `--klic-component-button-size-default-height` |
| 기존 ReUI 호환 인터페이스 | `--primary`, `--primary-foreground`, `--font-sans` 등 명시적 allowlist |

KLIC 이름 segment는 소문자 영문·숫자·하이픈으로 제한하고 점은 경로 구분자로 쓴다. 소수 척도는 `2-5`처럼 이름을 정하고 실제 값과 단위는 타입을 갖춘 `$value`에 저장한다. 잘못된 접두어·금지 문자·중복 경로는 검증 오류다. 이 이름 정책은 KLIC의 결정이다.

점으로 표현한 경로는 중첩 구조를 읽기 쉽게 표시한 것이다. DTCG JSON에서 이름 하나에 점을 넣어 평면 키로 저장하지 않는다. 하이픈 변환 후 서로 다른 정본이 같은 CSS 이름이 되지 않는지도 검사한다. [S03]

### 토큰과 규칙의 경계

**FR06 타입과 참조 — 필수.** 채택 저장 형식은 DTCG 2025.10을 기준으로 검증한다. 토큰은 `$value`와 유효한 타입을 갖고, 참조는 실제 값이 있는 완전한 경로를 가리킨다. `{klic.brand.dimension.}`처럼 그룹이나 끝의 점을 참조하지 않는다. 그룹, 타입을 갖춘 composite, 제품이 정의한 recipe를 구분한다. [S03]

타이포 역할 그룹을 표기했다고 해서 자동으로 DTCG typography composite가 되는 것은 아니다. composite를 쓰면 요구되는 fontFamily, fontSize, fontWeight, letterSpacing, lineHeight 필드와 타입을 충족한다. 반응형 조건과 DOM·overflow 동작은 역할 명세 및 recipe에 기록한다. 이를 임의의 DTCG 표준 필드라고 소개하지 않는다.

수용 기준은 누락된 leaf, 잘못된 단위·타입, 그룹 참조, 순환, 출력 이름 충돌 fixture가 모두 실패하고 올바른 예제가 해석되는 것이다. 단순 JSON 파싱 통과를 DTCG 적합성 검증 통과로 대체하지 않는다.

### 저장 단위

권장 저장 단위는 corporate primitives, shared brand defaults, 각 브랜드의 foundation, common semantics, 허용된 brand semantic overrides, component maps, component recipes, 검증 fixtures, 빌드 manifest다. 파일명이나 도구는 구현에서 정할 수 있으나 이 소유권 경계는 유지한다. 토큰 설명에는 출처, 원본 보존 또는 신규 결정 여부, 변경 이유를 남긴다.

## 5 컨텍스트 합성과 배포

**FR07 합성 순서 — 필수.** 지원하는 brand·color mode·preset 등의 입력을 먼저 검증한 뒤 다음 순서로 최종 그래프를 만든다. 최종 그래프를 완성하기 전에 참조를 숫자로 확정해 이후 override가 반영되지 않는 상태를 만들지 않는다. DTCG Resolver가 다루는 컨텍스트와 합성 개념을 참고하되 이 파일 구성과 허용 정책은 KLIC의 결정이다. [S04]

1. 버전이 고정된 corporate Primitive를 불러온다.
2. shared Brand defaults에 선택한 하나의 브랜드 foundation을 합성한다.
3. common Semantic과 해당 브랜드에 허용된 Semantic override를 합성한다.
4. 선택한 구현 profile의 Component map과 recipe를 결합한다. color mode·palette는 2·3단계의 허용 입력에서 선택하며, 이 단계에서 Brand·Semantic을 다시 덮어쓰지 않는다.
5. 완성된 그래프에서 alias를 해석하고 타입·방향·필수 leaf·충돌을 검사한다.
6. CSS와 필요한 코드 상수, 추적 manifest를 생성한다.

color mode는 Brand·Semantic의 허용된 매핑 입력으로, Base UI·Radix와 Nova는 구현 profile로, size와 Data Grid density는 컴포넌트 선택으로 관리한다. viewport·container·사용자 환경 조건을 모든 토큰을 덮는 하나의 전역 mode로 만들지 않는다. 같은 속성에 복수의 선택 조건이 작용하면 적용 위치와 우선순위를 명시한다.

선택 브랜드 foundation은 공통 inventory에 등록되고 승인된 `klic.brand.*`의 동일 leaf 경로만 override한다. 브랜드별 Semantic 파일은 해당 브랜드의 `klic.semantic.*` allowlist에 있는 동일 leaf 경로만 override한다. 브랜드 입력이 Primitive나 Component를 변경하거나 미등록 경로를 추가하면 오류다. 신규 경로는 공통 schema와 inventory 변경으로 등록한 뒤 사용한다. mode와 profile 선택도 지정된 계층과 경로 검사를 우회하지 않는다.

| 합성 대상 | KLIC 병합 정책 |
| --- | --- |
| 그룹 | 승인된 구조 안에서 경로별로 재귀 합성. 그룹과 leaf의 충돌은 오류 |
| 기존 leaf | 타입을 유지한 완전한 typed leaf로 교체. `$value`만 바꾸어 이전 `$type`이나 근거를 암묵 상속하지 않음 |
| 배열과 composite | 부분 병합이나 배열 연결 없이 leaf 전체를 교체하고 필수 필드와 타입을 검증 |
| 생략된 경로 | 명시된 shared default만 상속. 이전에 선택한 다른 브랜드의 값은 남기지 않음 |
| 삭제와 타입 변경 | 일반 브랜드 override에서 금지. 정본 변경과 호환성 검토를 거친 별도 버전에서 처리 |
| 미허용 계층과 경로 | 입력 파일과 대상 경로를 보고하며 빌드 실패 |

추가 수용 기준은 미허용 Brand 경로, Primitive·Component 침범, 미승인 Semantic 매핑, 타입 변경, 삭제, 그룹·leaf 충돌 fixture가 모두 실패하는 것이다. 마지막 허용 override가 참조 대상을 바꾸면 모든 소비자는 최종 합성값을 사용해야 한다. 이 병합 정책은 KLIC의 계약이며 DTCG가 지정한 유일한 정책이라는 뜻은 아니다.

**FR08 실패와 기본값 — 필수.** 알 수 없는 브랜드, 잘못된 모드, 필수 leaf 누락, 미지원 조합은 오류로 처리한다. 기본 브랜드와 상속 가능한 defaults를 명시한다. 브랜드 A 파일 뒤에 B 파일을 읽었다는 이유만으로 A의 누락 값을 B에 남기지 않는다. 브랜드 간 부모·자식 상속은 최초 범위에 포함하지 않으며, 필요하면 별도 채택·명시적 상속 규칙·검증 후 지원한다.

수용 기준은 실패 입력마다 원인과 경로를 설명하는 오류가 나오고, 같은 입력·도구 버전에서 같은 resolved map과 출력 hash가 생성되는 것이다.

**FR09 호환 adapter — 필수.** KLIC 출력에서 기존 ReUI CSS 인터페이스로 향하는 단방향 adapter를 둔다. 각 외부 변수에는 책임 있는 writer를 하나로 정하고 cascade·로드 순서를 기록한다. `--primary`가 다시 KLIC 정본을 정의하는 역참조는 금지한다. 논리적 4계층을 런타임 CSS 변수 네 겹으로 구현할 의무는 없다.

**FR10 테마와 Portal — 필수 및 조건부.** 전역 Light·Dark는 초기 렌더링, 전환, 열린 overlay, native control과 Portal에서 같은 문맥을 유지해야 한다. SSR을 사용하면 서버와 최초 클라이언트의 컨텍스트를 일치시킨다. scoped·nested theme 또는 같은 화면의 여러 브랜드는 채택 시 별도 스코프 계약을 추가한다.

수용 기준은 지원 범위에서 resolved value뿐 아니라 실제 computed style, 상태 선택자, Portal의 theme·dir 전달을 확인하는 것이다. CSS custom property의 계산과 상속 때문에 상위 범위에서 이미 해석된 alias가 중첩 문맥을 자동으로 다시 따라간다고 가정하지 않는다. [S05]

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

### 원본 보존 기준

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

### PageTitle 후보와 계산

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

## 13 검증 설계와 출시 조건

### 필수 증거

**FR33 증거와 적용 범위 — 필수.** 각 요구사항은 해당 컴포넌트·컨텍스트와 연결하고 통과, 실패, 미검증, 해당 없음 중 하나로 기록한다. 해당 없음은 근거가 있어야 한다. 문서 검토와 실제 브라우저 동작 시험을 구분한다.

| 검증 묶음 | 연결 요구사항 | 필요한 증거 |
| --- | --- | --- |
| 계층과 Brand | FR01부터 FR04 | 방향·순환·불변성·공유 변경·독립 변경 fixture와 소비자 diff |
| 저장과 합성 | FR05부터 FR09 | 타입 검사, leaf 검사, 충돌 검사, 실패 입력, 재현 가능한 resolved map |
| 테마와 모드 | FR10 | 초기 표시, 전환, 열린 Portal, 필요한 SSR과 스코프 시험 |
| 축과 이관 | FR11부터 FR13 | 7 디멘션, 원본 대조, size·icon·slot·density 비교 |
| 타이포와 폭 | FR14부터 FR18 | viewport와 container 별도 경계 시험, 글꼴·줄바꿈·확대·spacing 증거 |
| 배치와 가상화 | FR19와 FR20 | 읽기·focus 순서, 재측정, scroll·선택·편집 유지 기록 |
| 색과 상태 | FR21부터 FR25 | 실제 합성 대비, 레이어, 상태 조합과 비동기 전이 시험 |
| 입력과 환경 | FR26부터 FR32 | target·키보드·overlay·모바일·선호·IME·locale·드래그 대안 시험 |
| 변경과 배포 | FR33부터 FR35 | 지원 매트릭스, manifest, 마이그레이션 검사, rollback 검증 |

### 수용시험 목록

다음 26개 시험은 실행 계획이며 현재 모두 예정·미수행이다. 각 시험은 위 요구사항의 상세 수용 기준을 사용하고, 실제 시험 환경·결과·증거 위치를 부속 검증 기록에 추가한다. 조건부 기능은 채택 여부와 해당 없음의 근거를 남긴다.

| 시험 ID | 시나리오 | PRD 요구사항 |
| --- | --- | --- |
| AT01 | A/B fixture·Primitive 불변·의도한 소비자만 변경 | FR02, FR03, FR04, FR07 |
| AT02 | 미허용 override·계층 침범·타입·필수 누락·미지원 조합 실패 | FR01, FR06, FR07, FR08 |
| AT03 | 마지막 override 이후 alias 해석·순환/그룹 alias·CSS 충돌 | FR05, FR06, FR07 |
| AT04 | 지원 context 전수의 재생성·hash 일치 | FR08, FR35 |
| AT05 | 실제 설치 앱의 원본 보존·계열별 동작 | FR12, FR13, FR25 |
| AT06 | size/variant/state 선택의 독립성 | FR05, FR11, FR12, FR23 |
| AT07 | 좁은 패널·창·긴 한글·역할별 resize | FR14, FR15, FR16, FR19 |
| AT08 | 실제 확대·reflow·사용자 spacing | FR15, FR17 |
| AT09 | viewport/container/JS 경계 전후 | FR18 |
| AT10 | density·확대·폰트 로딩·가상 행 재측정 | FR13, FR20 |
| AT11 | 열 가상화 지원 조건·fallback·pinned/sticky | FR20, FR22, FR27 |
| AT12 | Dark+invalid+focus·selected+hover+focus | FR21, FR23 |
| AT13 | readonly/disabled/aria-disabled/busy·중복 실행 | FR23, FR24, FR26, FR27 |
| AT14 | loading/empty/no-results/갱신/부분 실패/낙관적 복구 | FR24 |
| AT15 | 초기/전환/Portal 테마·dir | FR09, FR10 |
| AT16 | 채택 시 scoped/nested theme·Portal | FR10 |
| AT17 | 실제 합성 색 대비·비색상 의미 | FR21 |
| AT18 | 실제 hit area·간격·이름·겹침 | FR26 |
| AT19 | 모달·중첩 overlay·trigger 제거·hover 콘텐츠 | FR27, FR28 |
| AT20 | forced-colors·reduced-motion·실행 중 환경 변경 | FR30 |
| AT21 | 실제 CJK·IME 조합·긴 문자열·글꼴 로딩 | FR14, FR31 |
| AT22 | locale/dir·문구·날짜/숫자/시간대·0/null | FR24, FR31 |
| AT23 | 모바일 키보드·회전·safe-area·overlay | FR29 |
| AT24 | 드래그·키보드·click/tap 대안·취소/실패 | FR32 |
| AT25 | 이름 이관·폐기·호환 단위 rollback | FR34, FR35 |
| AT26 | 대표 업무·실패 회복·지원 매트릭스·출시 증거 | FR11, FR19, FR24, FR33 |

### 최소 교차 시나리오

단일 상태만 확인하면 조합 결함을 놓칠 수 있다. 다음 조합은 해당 기능을 사용하는 범위에서 출시 전에 검증한다. 모든 조합의 브라우저 시험을 수행했다고 주장하는 대신 실제 대상과 환경을 기록한다.

| 시나리오 | 핵심 판정 |
| --- | --- |
| 브랜드 A와 B | 같은 Primitive, 다른 Brand 선택, 의도한 소비자만 변경 |
| Dark와 invalid와 focus | 오류 의미와 focus 표시가 함께 식별됨 |
| selected와 hover와 focus | 선택이 지워지지 않고 프로그램적 상태와 일치 |
| dense와 확대와 가상화 | 행·셀·조작의 잘림이나 겹침과 focus 유실 없음 |
| 좁은 container와 긴 한글 | 제목·label·helper·action의 내용과 묶음 보존 |
| Portal과 테마 전환 | overlay 색·상태·방향이 선언한 문맥과 일치 |
| 모바일 키보드와 overlay | 입력·확인·취소 접근과 scroll 복구 가능 |
| forced-colors와 focus | 필요한 UI·상태·focus 식별 가능 |
| reduced-motion과 닫기 | 동작 완료·focus 복귀가 모션 유무와 무관하게 수행 |

제안 시험 폭은 320, 480, 768, 1024, 1280, 1920 CSS px와 실제 breakpoint 직전·직후다. 이 숫자 전부를 새로운 breakpoint로 등록하지 않는다. viewport와 콘텐츠 container는 각각 바꾸며 page zoom, 텍스트 조정, root 설정을 동일한 시험으로 합치지 않는다.

### 출시를 막는 조건

지원한다고 선언한 컨텍스트에 해석 불가 토큰·이름 충돌·순환·필수 누락이 있으면 배포를 막는다. 채택한 핵심 업무에서 필수 조작 불가, 입력 유실, 모달 탈출 불가, 상태 오인, 확대 시 내용·기능 손실, 적용 가능한 접근성 기준 실패가 남아 있으면 해당 범위를 출시하지 않는다.

선언한 출시 범위의 필수 요구사항과 채택한 조건부 요구사항이 실패 또는 미검증이면 해당 범위의 출시를 보류한다. 지원한다고 선언한 모든 resolved context는 정적 검사를 수행한다. UI는 컴포넌트·환경별 대표 조합과 위험이 큰 교차 조합을 계획하고 요구사항 ID, 시험 ID, 실제 환경·결과·증거를 연결한다. 각 필수 요구사항에 필요한 증거가 없으면 미검증이다. 일부 대표 UI 시험을 모든 조합의 실측 완료로 확대 해석하지 않는다.

조건부 기능을 제외할 수는 있지만 사용자에게 노출되는 기능은 지원 범위에서 조용히 제거할 수 없다. 제외 결정에는 기능·경로·영향·후속 책임을 기록하고 실제 UI·API 노출과 문서를 일치시킨다. 해당 없음에는 구체적인 근거가 필요하다. 재현 가능한 산출물과 호환되는 배포 단위의 rollback 검증까지 확인한 뒤 출시를 판정한다. 시험 환경과 데이터가 없는 현재 문서만으로 제품 출시를 승인하지 않는다.

## 14 마이그레이션과 운영

### 이름 변경

| 기존 이름 | 새 정본 |
| --- | --- |
| `klic.ref.*` | `klic.primitive.*` |
| 기존 계층 없음 | 재사용 foundation을 `klic.brand.*`로 추가 |
| `klic.sys.*` | `klic.semantic.*` |
| `klic.cmp.*` | `klic.component.*` |

**FR34 호환과 폐기 — 필수.** 이름 문자열만 일괄 치환하고 완료로 처리하지 않는다. Semantic이 참조하는 값을 검토해 필요한 Brand foundation을 사이에 두고 공유 의도를 확인한다. 기존 소비자가 있다면 구이름을 허용된 호환 alias로 일정 기간 제공할 수 있으나 새 정본이 구이름을 역참조하지 않는다. 폐기 기간은 실제 소비자와 배포 주기를 확인한 뒤 정한다.

수용 기준은 구이름 사용 목록, 변경 전후 값 비교, 필요한 호환 fixture, 소비자 이행 상태와 제거 조건이 남는 것이다. 외부 ReUI 인터페이스인 `--primary`를 KLIC 구이름과 혼동하여 무조건 제거하지 않는다.

### 구현 단계와 산출물

| 단계 | 산출물 | 다음 단계 조건 |
| --- | --- | --- |
| 1 실제 기준 고정 | preset, lockfile, 설치 코드, 테마와 CSS baseline | 소스와 실제 설치본의 차이 설명 |
| 2 값과 역할 inventory | Primitive, Brand foundation, Semantic map, 출처 | 타입·공유 의도·브랜드 차이 검토 |
| 3 생성과 호환 | 합성기, CSS와 코드 출력, adapter, fixtures | 정적 검증과 재현성 통과 |
| 4 대표 컴포넌트 | Button, Input, Card, Dialog, Data Grid, Sidebar 명세와 적용 | 7 디멘션·상태·폭·테마 계약 시험 |
| 5 대표 업무 화면 | 검색·필터·목록·상세 또는 폼 흐름 | 실제 콘텐츠·확대·입력·접근성 증거 |
| 6 확장과 배포 | 나머지 채택 모듈, 사용 지침, 변경 기록 | 지원 매트릭스와 출시 gate 충족 |

일정과 담당자는 제공되지 않았으므로 임의의 날짜나 인원을 확정하지 않는다. Design System 담당은 역할·foundation과 변경 의미를, 프런트엔드 담당은 생성·adapter·컴포넌트 동작을, 제품 담당은 업무 우선순위·상태·브랜드 값을, QA와 접근성 검토 담당은 시험 환경과 증거를 맡는 책임 분담을 제안한다. 실제 팀이 역할을 배정한다.

**FR35 재현성과 rollback — 필수.** 입력 파일 목록과 순서·소스 commit·dependency lock·토큰 package 버전·schema/resolver/compiler/transform 버전·선택 컨텍스트·정본에서 CSS와 외부 인터페이스로의 출력 이름 map·입력과 출력 hash를 manifest에 남긴다. source와 generated artifact를 구분하고 생성 결과만 수동 수정하는 배포를 금지한다.

수용 기준은 같은 입력의 재생성 결과가 일치하며, 이전 토큰 패키지와 호환되는 adapter·component 버전의 조합으로 되돌릴 수 있다는 검증이다. 값 변경만으로도 의미·대비·크기·행동이 바뀔 수 있으므로 호환성 영향에 따라 버전을 결정한다. 성능 목표는 실제 제품의 데이터 규모·기기·환경을 정한 뒤 수치로 확정하며 임의의 latency 기준을 만들지 않는다.

## 15 구현 전에 확정할 제품 결정

4계층 구조와 `klic.` 정본은 채택했다. 아래 항목은 결정 책임과 gate를 갖는 구현 의존 사항이며 이 문서 작성을 막는 질문은 아니다.

| 결정 항목 | 현재 상태 | 확정해야 하는 시점 |
| --- | --- | --- |
| 실제 앱의 preset과 설치 버전 | Base UI + Nova + Neutral은 제안 baseline | 단계 1 완료 전 |
| 실제 브랜드와 값 | A와 B는 fixture | 브랜드 결과물 배포 전 |
| Brand별 Semantic 예외 목록 | 허용 절차만 정의 | 각 브랜드 map 확정 전 |
| PageTitle와 SectionTitle | PageTitle 24→30px 환산 후보, SectionTitle 역할은 제품 결정 | 해당 화면 구현과 시험 전 |
| 한글 글꼴과 밀도 | fallback·metrics·density 검증 필요 | 대표 폼과 표 검증 전 |
| 지원 브라우저와 기기와 locale | 실제 지원 목록 미제공 | UI 시험 계획 확정 전 |
| scoped theme와 다중 브랜드와 Radix | 조건부 범위 | 지원 선언 전 |
| 채택할 확장 모듈과 데이터 규모 | 실제 제품 목록 미제공 | 모듈별 출시 gate 전 |
| 이행 기간과 배포 담당 | 팀 운영 정보 미제공 | 첫 호환 배포 전 |
| 실제 사용자와 권한과 주요 업무 | 대표 시나리오는 초안이며 실제 제품 정보 미제공 | 단계 5의 업무 검증 계획 확정 전 |
| 성능 측정 조건과 예산 | 데이터 규모·기기·기준선·목표 미제공 | 해당 기능의 시험 계획 및 출시 판정 전 |

## 16 현재 검증 상태

기존 설계에서 수행한 것은 문서 대조, 독립 적대검토, 고정 소스의 지정 부분 확인, 공식 규격과 해설 확인, 이름·JSON 예시·참조 체인·PageTitle 산술 검토다. 이번 PRD는 여기에 승인된 Brand 계층, 요구사항 ID, 수용 기준, 이행 및 출시 조건을 적용한다.

소비 프로젝트 설치, 실제 CSS 빌드, computed style 대조, 제품 화면의 시각 검증, 실제 브라우저 확대·스크린리더·터치·IME·가상화 실측은 수행하지 않았다. 문서 파일의 렌더링 검수는 문서 품질 검사이며 제품 UI 검증과 별개다.

현재 결론은 **알려진 설계 공백을 요구사항과 검증 계약으로 구체화했다**는 것이다. 이 구조가 ReUI보다 우수하다거나 모든 누락이 제거되었다는 결론은 아니다.

## 부록 A DTCG 구조 예시

아래 JSON은 dimension 한 경로의 4계층 연결을 보여주는 축소 fixture다. 전체 토큰 카탈로그나 완료된 생성기는 아니다. 각 토큰의 타입을 명시하고 중첩 객체로 저장한다. Brand B fixture는 같은 Brand leaf의 참조를 step 9로 바꾸며, Primitive 정의는 그대로 둔다.

```json
{
  "klic": {
    "primitive": {
      "dimension": {
        "step": {
          "8": {
            "$type": "dimension",
            "$value": { "value": 2, "unit": "rem" }
          },
          "9": {
            "$type": "dimension",
            "$value": { "value": 2.25, "unit": "rem" }
          }
        }
      }
    },
    "brand": {
      "dimension": {
        "control": {
          "height": {
            "md": {
              "$type": "dimension",
              "$value": "{klic.primitive.dimension.step.8}"
            }
          }
        }
      }
    },
    "semantic": {
      "size": {
        "action": {
          "default": {
            "$type": "dimension",
            "$value": "{klic.brand.dimension.control.height.md}"
          }
        }
      }
    },
    "component": {
      "button": {
        "size": {
          "default": {
            "height": {
              "$type": "dimension",
              "$value": "{klic.semantic.size.action.default}"
            }
          }
        }
      }
    }
  }
}
```

## 부록 B 컴포넌트 부속 명세 양식

| 필드 | 기록할 내용 |
| --- | --- |
| 식별과 출처 | 컴포넌트, 구현 계열, preset, 고정 소스, 원본 보존 또는 신규 결정 |
| API와 구조 | props, slot, size, variant, composition과 Portal |
| 토큰 연결 | Component leaf, Semantic 역할, Brand 재료, Primitive 출처 |
| 7 디멘션 | 적용 내용과 해당 없음 근거 |
| 타이포와 폭 | 기준, 변화 방식, 구간, 글꼴 조합, overflow, 동반 기하, fallback |
| 상태와 데이터 | 상태별 속성 소유권, 로딩·빈 데이터·오류·재시도·복구 |
| 조작 | keyboard, pointer, touch, focus 진입·복귀, drag 대안 |
| 환경 | theme, density, lang, dir, IME, reduced-motion, forced-colors, 모바일 키보드 |
| 검증 | 요구사항 ID, 지원 조합, 실제 환경, 결과, 예외 근거, 증거 위치 |
| 운영 | 책임 역할, 변경 영향, deprecated alias, 이행과 rollback |

이 양식의 필드는 KLIC 운영 명세이며 새 DTCG 표준 필드가 아니다.

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
