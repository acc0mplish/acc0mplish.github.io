# KLIC 검증·출시 계획 v1.1

이 문서는 재현 절차다. 계획이 존재한다는 이유로 시험을 통과 처리하지 않는다. FR/AT 정본 추적은 design/requirements-v1.1.json을 사용한다.

## 1. 판정 단위와 책임

판정 단위는 release-id + source commit + profile + 제품/기능 범위다. 상태는 `통과/실패/미검증/해당 없음`, 부분 증거만 있으면 `부분 검증`이다. 문서 결정 상태 `확정/제안/예시/미결정`과 혼동하지 않는다.

B0: 무결성·입력 유실·필수 조작 불가·모달 탈출 불가·잘못된 저장/상태. 해당 배포를 차단한다. B1: 선언한 기능의 나머지 필수 동작·반응형·접근성. 기능을 보류하거나 route·UI·API·CLI/MCP 제공과 검색/문서에서 실제 제거한 뒤 축소 범위를 새로 검사한다. 기존 노출 기능을 장부에서만 제외하지 않는다. B2: 비필수 후속 backlog이며 기존 FR/AT에 적용하지 않는다.

범위 변경/해당 없음은 제품 책임자와 QA, 접근성 관련이면 접근성 검토자가 승인한다. 사람 계정·사유·영향·증거·후속 기한을 남긴다. 적용 가능한 WCAG 실패와 B0 무결성은 면제할 수 없다. 실제 담당자 미배정 상태에서는 해당 소비 제품 수용을 승인하지 않는다. 라이브러리 문서 개정·실험 예제 배포는 소비 제품 출시 승인과 별개다.

## 2. 지원 매트릭스와 최소 표본

| 묶음 | 최소 표본 / 반복 | 기록 |
| --- | --- | --- |
| 정적 토큰 | 모든 지원 프로필 × A/B × Light/Dark; 전체 설정 경계 및 각 enum; 각 오류 fixture 1회 | 도구 버전·commit·test log |
| 브라우저 기본 | 단계 0에 등록한 각 엔진/OS 조합에서 대표 검색→선택→상세→Dialog→닫기 1회 | 정확한 OS/브라우저 버전·경로·영상/로그 |
| 리사이즈 | 주 업무 화면 1개와 각 고위험 overlay·폼; 320/768/1280 CSS px, 각 실제 breakpoint −1/경계/+1 | viewport와 container 각각 기록 |
| 교차 상태 | invalid+focus, selected+hover+focus, Dark+Dialog 각 1회/지원 엔진 | computed style·기능·상태 의미 |
| 보조기술 | 제품 지원 선언별 적어도 Windows NVDA+Firefox, macOS VoiceOver+Safari 중 적용 플랫폼의 조합; 모바일 지원 시 iOS VoiceOver+Safari와 Android TalkBack+Chrome 추가 | 실제 버전 필수. 플랫폼 미지원이면 사유 기록 |
| 실제 IME | 지원 OS의 한글 IME × 각 지원 브라우저에서 조합/확정/Enter/Escape/방향키/붙여넣기 각 1회 | 합성 이벤트로 대체 금지 |
| 사용자 선호 | reduced-motion·forced-colors를 실행 중 변경 각 1회 | 닫힘·focus 복귀·상태 보존 |

이 표는 앞으로의 최소 수용 정책이다. 특정 OS·브라우저 버전을 이미 지원하거나 시험했다는 사실 주장이 아니다. 소비 앱이 Windows만 지원하면 macOS·모바일 항목은 근거를 적고 제외할 수 있다. 같은 엔진이라도 제품이 개별 브라우저 지원을 선언하면 해당 브라우저에서 주 업무 smoke를 추가한다.

정적 tests는 전수 또는 명시한 입력 클래스 검사다. UI에서 모든 설정의 곱집합을 시험하지 않는다. 각 FR은 최소한 하나의 시험/검토 증거와 연결하고 고위험 조건은 별도 교차 시나리오로 덮는다. 표본에서만 확인한 동작을 전체 조합 실측 완료로 확대하지 않는다.

## 3. 확대·spacing 절차

기록 시작 시 autoScale=false, 앱 uiScale=100, 앱 textScale=100, 브라우저 page zoom=100%, 기본 글꼴/OS 배율·창 크기를 남긴다. 각 시험 후 초기화하고 독립적으로 실행한다.

1. **Page zoom**: 지원 브라우저 메뉴에서 100→200%; 동일 업무에서 내용·label·오류·busy·조작·focus 확인. 메뉴 200%만으로 모든 글자가 실제 두 배라고 판정하지 않고 전후 font-size·CSS viewport·화면 크기를 기록한다.
2. **Text-only zoom**: Firefox의 텍스트만 확대를 사용해 200%까지 올린다. 기능을 지원하지 않는 브라우저에서는 지원한다고 주장하지 않는다. 다른 브라우저의 앱 textScale 기능은 별도 보완 증거이며 text-only 시험과 구분한다.
3. **Reflow**: 세로 콘텐츠를 320 CSS px viewport에서 시험. 추가로 1280 CSS px 시작 폭을 page zoom 400%로 바꾸어 equivalent width=1280/4=320임을 기록한다. 실제 innerWidth가 다르면 실제 값을 기준으로 조정한다. 2차원 의미가 필요한 데이터 표의 예외 근거를 남기되 주변 폼·본문까지 예외로 확장하지 않는다.
4. **Text spacing**: 사용자 stylesheet로 아래 네 속성만 동시에 변경한 후 내용·기능 손실 검사. CSS가 실제 적용됐는지 computed style로 확인한다. 글꼴·크기·폭은 이 시험에서 함께 변경하지 않는다.

```css
* { line-height:1.5 !important; letter-spacing:.12em !important; word-spacing:.16em !important; }
p { margin-block-end:2em !important; }
```

언어/문자에서 적용하지 않는 속성의 예외는 근거와 해당 콘텐츠를 기록한다. 이 값은 기본 디자인 강제가 아니다. 모바일 pinch zoom은 별도 관찰 시험이며 위 절차의 대체 증거가 아니다.

## 4. 접근성 검토

자동: DOM 이름/역할·명백한 ARIA 오류·대비 후보 탐지. 수동: 키보드 업무 흐름, 모달·중첩 overlay·trigger 제거, 실제 합성 표면 대비, 확대·spacing·고대비, 실제 스크린리더·IME·터치. 자동 탐지 결과 0건은 WCAG 적합성 판정이 아니다.

DS는 시각·역할, FE는 DOM·focus·상태, QA는 재현·회귀, 접근성 검토자는 기준 적용성과 보조기술 증거를 맡는다. 제품 승인자가 선언 범위를 승인한다. 실명은 단계 0에서 지정한다. 외부 인증 또는 독립 전문가 검토를 수행하지 않았다면 이를 주장하지 않는다.

심각도: 업무 불능·입력 유실·탈출 불가=B0; 적용 가능한 기준/계약 실패=B1; 비필수 편의=B2. 접근성 실패를 B2로 내리려면 먼저 기준이 해당 없음임을 근거로 판정해야 하며, 단순 일정 사유로 면제할 수 없다.

## 5. 가상화 도입 gate

이번 Site Grid 데모를 가상화 완료로 표시하지 않는다. 도입 전에 실제 행 수·열 수·셀 최대/대표 문자열·가변 높이 비율·고정/pinned/그룹 열·동시 갱신 빈도/배치·정렬/필터/편집 패턴·글꼴 로딩·density·확대·지원 기기/CPU/RAM/브라우저·네트워크·cold/warm 조건·측정 도구/반복 수·허용 예산을 제품과 FE/QA가 확정한다.

최소 측정 작업: 최초 표시, 처음/중간/마지막 행 이동, 빠른 스크롤, 열 리사이즈, 편집 중 갱신, 필터/정렬, density/폰트/텍스트 변경. 각 작업 cold/warm 각각 5회 측정하여 개별 값·중앙값·최댓값을 보존한다. p95는 충분한 표본 설계를 별도로 정하지 않았다면 산출하지 않는다. 지연/메모리 예산은 제품 요구에서 정하며 임의 숫자를 통과 기준으로 만들지 않는다. 예산 미확정이면 해당 가상화 기능 지원 선언을 보류한다.

## 6. 7축 완료 산출물

컴포넌트 명세 한 건에 7축별 적용/해당 없음 이유, 연결 leaf 또는 recipe, 상태·상호작용, 위험 조건, 요구사항/시험 ID, 검토자, 승인자를 기록한다. 같은 overlay의 배치·표면·상호작용 증거는 중복 복사하지 않고 같은 증거를 참조한다. 명세만 작성한 상태와 실제 동작 시험 통과를 분리한다.

## 7. AT 상세 목록

아래 표의 시나리오와 기존 교차 시나리오는 유지한다. 현재 결과와 책임은 requirements register가 정본이며 아래 목록은 계획이다.

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


현재 결과·실행 증거는 requirements-v1.1.json과 검증 기록을 참조한다.
