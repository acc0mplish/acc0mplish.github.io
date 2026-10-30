# KLIC BlockStudio 원본 충실도·최종 반영 보고서

작성 기준: 2026-10-24 요청 작업, 최종 반영 상태 갱신 완료. 이 문서는 원본 제공 ZIP과 최초 통합 상태의 차이 및 그 후의 복원을 기록한다. **3·4장의 최초 통합 편차는 감사 이력이며, 현재 미해결 결함 목록이 아니다.** 최종 상태와 유지되는 제한은 8장의 표가 기준이다.

## 1. 기준과 검증 범위

| 대상 | 근거 |
| --- | --- |
| 사용자 제공 BlockStudio | 제공 ZIP의 `src/` |
| 제공 ZIP | `remix-component-library-&-ui-block-studio.zip` |
| ZIP SHA-256 | `90dd1e8e9b4e9c2f5b391fd7e885ed0d003f28239d7908fb09de2dfd9ab95405` |
| 통합 사이트 | KLIC 사이트 저장소 |
| 감사 시작 사이트 HEAD | `7439830d1a964d8d4ee00b47ea1b4e746271c948` |
| Calendar 원본 | 참고용 KLIC-Calendar 저장소 |
| Calendar 원격·커밋 | `https://github.com/klic-co-kr/KLIC-Calendar.git` · `535ffc23578d38872bae17ee2978a9fd9a735e1c` |

원본의 README·주석·화면 안 “검증 완료” 문구는 데이터로 취급했다. 이 문서의 판단 근거는 실제 상태 선언, 이벤트 핸들러, JSX 렌더링, 데이터 리터럴, import와 switch 경로다. 원본 문구가 외부 API·결제·이메일·실제 PDF 지원을 주장하더라도 실행 경로가 없으면 구현된 서비스로 계산하지 않았다.

이번 감사는 소스와 공식 문서 조사다. Calendar 앱을 실행하거나 Rust 테스트를 돌리지 않았다. 164개 데모의 모든 버튼을 브라우저에서 실행 검증했다는 의미도 아니다. 색·글꼴·CSS 변경의 최종 시각 결과는 별도 화면 검증이 필요하다.

## 2. 수량보다 중요한 경계

| 컬렉션 | 분류 | 목록 항목 | 실제 라우팅 | 계획 항목 |
| --- | ---: | ---: | ---: | ---: |
| 애플리케이션 | 26 | 141 | 131 | 10 |
| 차트 | 10 | 50 | 17 | 33 |
| 데이터 그리드 | 8 | 56 | 16 | 40 |
| 합계 | 44 | 247 | 164 | 83 |

실제 라우팅 164개가 164개의 독립 구현 파일을 의미하지 않는다. 47개 최상위 구현 모듈에 모드와 ID가 연결된다. 별도 보조 파일 `FluxMainWbsGantt.tsx`, `GanttExtendedModes.tsx`, `ScheduleExtendedModes.tsx`를 포함하면 보존 대상 실제 블록·보조 TSX는 50개다. 목록에는 없지만 원본 switch에 있는 `feature-adoption-slope`는 검색용 원본 별칭으로만 별도 기록했다.

분류는 원본의 병합된 데이터 구조가 기준이다. `componentsData.ts:1390`의 `CHARTS_CATEGORIES_DATA[0]` 참조로 Gantt가 애플리케이션 컬렉션에 들어가는 구조까지 평가해야 한다. 문자열 정규식으로 배열 리터럴만 세면 1개 분류·6개 항목을 놓친다.

계획 83개는 원본에서도 독립 블록으로 연결되지 않는다. 이들을 기존 `GenericBlock`의 “구현/빌드 검증” 문구 때문에 실제 기능으로 승격하면 안 된다. 현재 카탈로그 생성기는 `App.tsx`의 실제 render switch를 기준으로 구현 여부를 정하고, 현재 `selectedMeta`의 제목·설명을 우선하며 낡은 카탈로그 제목은 검색 별칭으로 보존한다.

## 3. 외부 조작 기능의 실제 누락과 변경

| 기능 | 원본 실제 동작·근거 | 최초 통합 상태 | 판단·복원 기준 |
| --- | --- | --- | --- |
| Customize 진입 | `components/preview/CustomizeModal.tsx`, `App.tsx:2480` 부근에서 모달 연결 | 모달 파일·진입 버튼 제거 | 동일 모양이 아니어도 원본 조절 기능은 다시 노출해야 함 |
| 행 밀도 | compact/normal/relaxed 세 값, 원본 Customize:15–19,55–71 | 외부 컨트롤에 세 값 유지 | 기능 유지. 다만 Catalog 내부 밀도와 외부 상태의 단일 동기화 필요 |
| 아바타 표시 | `showAvatars` state, Customize:75–91, App:265,2486 | `BlockApp` 내부 true 상수 | 실제 기능 손실. 숨김·표시가 블록 prop까지 전달되어야 함 |
| 진행률 링 표시 | `showProgressRings` state, Customize:94–111, App:266,2488 | `BlockApp` 내부 true 상수 | 실제 기능 손실. 영향을 받는 블록에서 SVG 링 표시가 바뀌어야 함 |
| 즐겨찾기 | Sidebar의 전체/즐겨찾기 전환, 항목별 별표; `Sidebar.tsx:76,159,335,386–391`, App:140,1673 | 대응 상태·필터 없음 | 원본 편의 기능 누락. 원본도 서버 저장 기능은 아님 |
| 전체화면 미리보기 | `PreviewShell.tsx:44,149`의 fixed overlay 전환 | 전체화면 조작 없음 | 원본 조작 누락 |
| 문서·공유 URL 복사 | HeaderBreadcrumb:76,97에서 현재 URL 복사 | 전용 버튼 없음 | 복사 동작 누락. 현재 상세 URL 지원 자체는 개선 |
| 메타데이터 Markdown 복사 | HeaderBreadcrumb:83–89, 제목·설명·분류 복사 | 전용 버튼 없음 | 원본 문서 편의 기능 누락. 가짜 패키지명은 복원 대상 아님 |
| 라이트/다크 | PreviewShell 내 독립 제어 | 사이트 테마와 동기화 | 위치·범위 변경. dark selector 정의를 보강한 점은 개선 |
| Reset | App:1679–1693에서 11개 주요 데이터 및 밀도·아바타·링을 기본값으로 | runtime remount로 블록 상태 초기화, 사용자 컨텍스트는 유지 | 범위가 달라짐. “데모 초기화”와 “설정 초기화”를 구분하면 오해를 줄임 |
| 검색·구현 필터 | 원본 Sidebar에 실제 전체 텍스트 검색 없음 | 검색·컬렉션·분류·구현 여부 필터 제공 | 추가 기능 |
| 코드 확인 | 원본 `*_CODE_SNIPPET` 24개와 filename 메타 | 실제 TSX·BlockApp·스타일·manifest 제공 | 원본 축약/불일치 스니펫보다 정확한 대체 |
| npm 설치 안내·PRO 유도 | 가상의 `@flux-ui/...` 명령과 원본 데모 안내 | 제거 | 동작하는 설치나 구매 흐름을 삭제한 것이 아님 |

아바타 옵션을 실제로 받는 모듈은 Roadmap, AccessPermissions, SubTaskTracker, ReleaseApprovals, WorkspaceOverview, SupportTickets, Catalog이다. Catalog는 교육·상품 두 ID다. 진행률 링은 Roadmap, ReleaseApprovals, Catalog에 연결된다. 전체 블록에 보이는 스위치라도 효과 범위가 제한됨을 사용자에게 설명해야 한다.

최초 통합의 `CatalogBlock` 내부 `onDensityChange`는 `BlockApp.setDensity`만 바꾸고, host dropdown 및 runtime 루트 `dataset.density`를 갱신하지 않았다. 외부 설정→iframe 전달뿐 아니라 내부 설정→host 역방향 전달도 필요하다. 이는 원본 콘텐츠 손실과 별개의 통합 상태 동기화 문제다.

## 4. 본문·데이터·이미지 충실도

### 4.1 데이터 행은 보존됨

초기 통합 상태에서 원본과 적응본의 14개 `INITIAL_*` 리터럴을 깊이 비교했다. 행·ID·상태·날짜·수치·트리 구조의 삭제는 발견하지 않았다.

| 데이터 상수 | 원본과 적응본 최상위 행 수 |
| --- | ---: |
| INITIAL_ACCESS_MEMBERS | 10 |
| INITIAL_ROADMAP_TASKS | 19 |
| INITIAL_DELIVERY_TASKS | 5 |
| INITIAL_RELEASE_APPROVALS | 11 |
| INITIAL_PORTFOLIO_PROJECTS | 6 |
| INITIAL_SLA_ITEMS | 18 |
| INITIAL_SUPPORT_TICKETS | 11 |
| INITIAL_COURSE_CATALOG | 12 |
| INITIAL_PRODUCT_CATALOG | 12 |
| INITIAL_SHARED_DRIVE_ITEMS | 6, 하위 트리도 보존 |
| INITIAL_REPORTS_DATA | 7 |
| INITIAL_INTEGRATIONS_DATA | 10 |
| INITIAL_SYNC_HEALTH_DATA | 5 |
| INITIAL_STRIPED_LEDGER_DATA | 12 |
| 합계 | 144 |

변경된 leaf는 308개였다. 299개는 이미지 경로·색·class 등 표현 필드, 나머지 9개는 브랜드 텍스트였다. 대표적으로 `@flux-ui 코어`→`KLIC 코어`, `Flux Studio Pro`→`KLIC Studio Pro`, 상품 authorOrBrand 6곳의 Flux→KLIC 치환이다. 다만 “표현 필드”라고 해서 의미 손실이 없는 것은 아니다. 아래 24개 썸네일은 중요한 반례다.

### 4.2 상품·교육 썸네일의 의미가 손실됨

원본 `src/data/componentsData.ts:3828` 이후 교육 12개와 `:4161` 이후 상품 12개의 `thumbnail`은 각 주제를 보여 주는 Unsplash 이미지였다. 최초 통합은 이를 사람 머리·어깨 모양의 SVG 아바타로 바꿨다. `CatalogBlock.tsx:736–737`은 그대로 `item.thumbnail`을 렌더링하므로, 행은 남아 있어도 교육/상품을 알아보게 하는 본문 이미지 의미가 사라졌다.

원본 URL 24개가 실제 HTTP 200 이미지로 내려오는 것을 확인하여, 응답 바이트를 변경하지 않고 다음 위치에 복원했다.

- 교육: `block-runtime/public/catalog/course-01.webp`부터 `course-12.webp`
- 상품: `block-runtime/public/catalog/product-01.webp`부터 `product-12.webp`
- 매핑: `block-runtime/public/catalog/thumbnail-map.json`
- 24개 합계 257,018바이트. 각 파일은 실제 WebP 디코딩, 이미지 치수, SHA-256 검증 완료.
- 매핑은 `id`, `mode`, `title`, `originalUrl`, `currentPlaceholder`, `localPath`, `filename`, `bytes`, `contentType`, `format`, `width`, `height`, `sha256`을 기록한다.

`auto=format` 응답이 WebP이므로 확장자도 실제 형식을 따른다. 최종 소스 확인에서 중앙 `componentsData.ts`의 24개 thumbnail 모두 매핑의 `localPath`로 적용된 것을 확인했다. 외부 이미지 요청 없이 원본 교육·상품 이미지 의미를 보존한다.

참고로 원본 이미지 URL 출현은 438회, 고유 URL은 78개였다. 제공된 PNG 44개는 runtime 이미지 import가 아니라 소스 주석의 참고 이미지였다. 이 PNG들을 렌더링 자산에 넣지 않은 것을 44개 화면 내용 삭제라고 세면 안 된다.

### 4.3 블록 구조 변화는 제한적이나 일부 의미 변화가 있음

50개 실제 블록·보조 TSX를 AST로 비교하면서 문자열 리터럴·JSX 텍스트의 색/브랜드 치환을 제외한 구조를 검사했다. 최초 통합에서 45개는 함수·이벤트·렌더 구조가 같았다. 구조가 달랐던 5개는 다음과 같다.

| 모듈 | 실제 변화 | 판단 |
| --- | --- | --- |
| FunnelFlowBlock | reduced-motion hook, 애니메이션 effect 조건 추가; JSX 본문 76→76 | 접근성 보강, 본문 삭제 아님 |
| SlopeChartBlock | reduced-motion hook 추가; JSX 본문 34→34 | 접근성 보강 |
| IntegrationsHubBlock | 외부 공식 문서 `<a>`가 문서 주소 표시용 div로 변경; 본문 104→104 | 외부 문서로 이동하는 기능은 제거됨 |
| SlaRiskIndexBlock | SVG `<title>`의 분리 텍스트를 보간 문자열로 합침; text node 62→60 | 의미는 동일, node 수 차이를 문장 삭제로 보면 안 됨 |
| ReportsManagementBlock | 수신자 처리·CSV 다운로드·라벨 수정, avatar helper 제거; text node 108→103 | 기능·설명 변화. 아래 상세 구분 필요 |

수치상 AST 구조 보존은 최종 화면의 픽셀 동일성을 보장하지 않는다. 파란색 정책, 글꼴, 선택자, padding, avatar 자산의 변경은 별도로 시각 확인해야 한다.

### 4.4 원본 버그·시뮬레이션과 통합 편차를 구분

- **Auth 이메일 치환 오류:** 최초 적응본 `AuthBlock.tsx:478,614,622`에 `lemon.kimKLIC.dev`, `google-oauthKLIC.dev`, `apple-idKLIC.dev`가 생겼다. 이는 원본 기능을 유지한 브랜드 변경이 아니라 `@`가 사라진 입력 데이터 회귀였다. 최종 소스에서는 각각 `lemon.kim@klic.dev`, `google-oauth@klic.dev`, `apple-id@klic.dev`로 수정되어 있다.
- **Reports PDF:** 원본 다운로드는 `%PDF-1.4 Mock PDF Document...` 문자열을 파일로 저장할 뿐, 유효한 PDF 문서를 생성하지 않았다. 적응본의 실제 CSV와 “PDF 선택·예약·발송은 모의 설정” 표시는 기능 과장 교정이다. 제대로 작동하던 PDF 엔진을 삭제한 것으로 설명하면 안 된다.
- **Reports 수신자:** 원본 생성 핸들러는 입력 수신자를 무시하고 고정 2명을 넣었다. 적응본은 쉼표로 분리하고 중복을 제거하여 실제 입력값을 사용한다. CSV는 셀 quoting 및 수식 시작 문자 대응도 추가한다.
- **Reports 발송·예약:** 원본부터 서버 전송·스케줄러 API가 없었다. 로컬 상태·시뮬레이션이라는 제한은 유지된다. `reports-schedule` 설명은 샘플 CSV와 모의 PDF/예약/발송을 명시하도록 정정했다.
- **SharedDrive reset:** 원본 reset은 같은 초기 prop 참조로 내부 트리를 되돌리지 못할 수 있었다. 적응본 `SharedDriveGrid`는 structuredClone으로 트리·선택·drag·정렬·메뉴를 초기화한다. 이는 원본 불완전 동작의 수정이다.
- **외부 동작:** runtime wrapper가 외부 anchor와 form 이동을 막는다. 원본도 backend 연결은 없지만 문서 링크 이동과 일반 폼 탐색은 별개 기능이므로 바뀐 동작을 명시해야 한다.
- **동일 데모 별칭:** Funnel 3개 ID(초기 prop이 실제로 사용되지 않음), Capital 3개, Status 3개, Radial 4개, Slope 2개 목록 ID(+별도 unlisted alias)는 원본부터 같은 showcase를 공유한다. 통합 과정에서 다른 구현을 잃은 것이 아니다. `variantNote`에 이를 밝히는 것이 정확하다.

## 5. Calendar 화면배율의 정확한 구조

근거는 Calendar `app/src/viewmodel.rs:235–298`, `views.rs:578–638`, `main.rs:301–304`다. 네이티브 창의 물리 픽셀을 OS scale factor로 나눈 **논리 크기** W,H를 입력으로 쓴다.

```text
자동배율 A = clamp(round(min(W/1280, H/820) × 20) / 20, 0.85, 1.35)
사용자배율 U ∈ {0.8, 0.9, 1.0, 1.1, 1.2, 1.35, 1.5}
최종배율 S = clamp(round(A × U × 20) / 20, 0.7, 1.8)
레이아웃 CSS 너비 = W / S
레이아웃 CSS 높이 = H / S
좁은 레이아웃 = (W / S) < 960
```

W 또는 H가 양수가 아니면 자동배율은 1이다. 잘못 저장된 사용자 배율은 일곱 단계 중 가까운 값으로 보정하고 비유한 값은 1로 돌린다. 이 자동배율과 사용자배율은 서로 다른 상태다.

| 항목 | 실제 구현 |
| --- | --- |
| 초기 창 | 네이티브 논리 크기 1280×820 |
| 최소 창 | 네이티브 논리 크기 720×520. **최소 CSS viewport 크기라는 뜻이 아님** |
| 적용 API | `desktop.webview.zoom(scale)` (`views.rs:597`), 화면 전체 확대/축소 |
| 최초 실행·사용자 선택 변경 | 마지막으로 기록한 physical size로 다시 계산 (`:619–624`) |
| resize | 주 창 ID만 처리하고 `WindowEvent::Resized(size)` payload 사용 (`:628–635`) |
| DPI 변경 | `ScaleFactorChanged { new_inner_size }` payload 사용 |
| resize 주의점 | 코드 주석은 macOS 콜백 안의 `inner_size()`가 직전 크기를 줄 수 있어 event payload를 사용한다고 설명함. 코드도 실제로 payload를 사용 |
| 상태바 | − / 최종 배율 % / +, 가운데 클릭은 사용자배율을 100%로 되돌림 |
| 단축키 | Ctrl/Cmd +, −, 0 (`views.rs:751,850–861`); 설정 화면에도 동일 7단계 select |
| 좁은 창 | CSS 너비가 960 미만이면 sidebar drawer. 넓어지면 drawer 닫음 |

720×520 논리 창, 사용자 100%인 경우 A=85%, S=85%, CSS viewport는 약 847×612다. 가운데 “초기화”로 U=100%가 되어도 자동배율이 남으므로 최종 표시가 항상 100%가 되는 것은 아니다.

높이는 단순 스케일 외에도 월간 일정 표시량에 쓰인다. `viewmodel.rs:246–257`은 CSS 높이에서 162px chrome을 빼고 행 수로 나눈 뒤, 32px day-number/여백을 빼서 20px lane 수를 계산한다. 6행은 2–8개, 6행 미만은 최대 12개다. 이는 창 크기에 따라 **콘텐츠 양**도 적응하는 기능이다.

### 글자 크기와 밀도는 배율과 구분

- Calendar 전체 기본 body 글자는 13px (`styles.rs:27–32`). 전역 글꼴 family 선택과 화면 전체 WebView zoom은 있지만, 모든 화면을 위한 독립 font-size slider가 같은 구조로 존재하는 것은 아니다.
- Notes 본문만 별도 글자 크기 설정이 있다. 정확한 저장 key는 `noteFontSize`; 기본 15px, 최소 12px, 최대 24px, ±1px 단계, reset 15px (`notes.rs:438–492`).
- Notes는 `--note-zoom = px / 15`를 쓰고 editor/read view에 `font-size: calc(15px * var(--note-zoom, 1))`를 적용한다 (`note_styles.rs:9,102`). Notes 영역의 Cmd+/−/0은 전역 zoom 대신 본문 글자 크기로 라우팅된다 (`key_route.rs:82–92`, `components/note_workspace.rs:150–152`).
- 시간 그리드 밀도는 시간당 높이 32/42/56/72px인 별도 설정이다 (`viewmodel.rs:2675–2682`, `views.rs:4213–4226`).

브라우저 사이트에서 Calendar 방식을 참조할 때 iframe 폭 390/768/fluid 선택, CSS textScale, 전체 화면배율은 구분해야 한다. 네이티브 WebView API를 그대로 사용할 수 없으므로 CSS zoom/레이아웃 보정 등 사이트 환경용 적용은 별도 구현이다. 전역 textScale을 추가한다면 Calendar 원본 동일 기능이라는 표현보다 KLIC 확장으로 설명한다.

## 6. Calendar 테마의 실제 선택·상호작용

| 기능 | 실제 선택·동작 | 근거 |
| --- | --- | --- |
| 명암 | 라이트/다크/시스템; 시스템은 OS 변경 반영 | `views.rs:3959–3972`; `theme.rs:484–510,1027–1055` |
| 디자인 | Default/Toss/Notion/KLIC 네 가지 카드 | `theme.rs:66–207`; `views.rs:3982–3995,4521–4589` |
| Accent | 테마 기본 + 12개 preset + 유효한 #RRGGBB 입력 | `theme.rs:299–329`; `views.rs:4005–4022,4611–4645` |
| 색 테마 | 20개: 라이트 10·다크 10. 현재 명암 묶음 먼저, 양쪽 모두 표시 | `theme.rs:247–288`; `views.rs:4036–4055,4651–4694` |
| 글꼴 | 테마 기본 + 9개 실제 글꼴 | `theme.rs:347–366,394–443`; `views.rs:4065–4083,4695–4709` |
| Radius | 테마 기본 + 0/4/6/8/12/14/20px | `theme.rs:792–823`; `views.rs:4103–4134,4592–4607` |
| 저장 | UI에서 UpdateSettings 명령 성공 후 UI 상태 반영, StoreSettings 경로 | `views.rs:3598–3631,209–235`; `main.rs:230–246` |

9개 글꼴은 Pretendard GOV, Spoqa Han Sans Neo, Freesentation, Paperlogy, Noto Sans KR, Nanum Gothic, Gmarket Sans, Mindeulleholssi, Gabia Sai다. 로컬 번들 font asset을 사용한다.

설정 간 우선순위도 원본 기능의 일부다.

1. 색은 colorTheme → accent → design 순으로 결정하고, radius·shadow 등 비색 토큰은 디자인 테마에서 유지한다 (`theme.rs:14–19`).
2. 디자인을 바꾸면 색 테마·글꼴 override·radius override를 기본으로 돌리되 accent는 유지한다 (`views.rs:3679–3687`).
3. Accent 변경은 색 테마를 해제한다 (`:3706–3710`). 같은 색 테마를 다시 누르면 해제한다 (`:3714–3718`).
4. 활성 색 테마의 명암이 light/dark/system 선택보다 우선한다 (`theme.rs:500–510`).

`state.rs:342`의 Toss/Notion 숨김 주석과 달리 실제 `DESIGN_THEMES.iter()` 렌더에는 필터가 없다. 주석만 보고 카드가 2개라고 판단하면 안 된다. Calendar 원본의 여러 색 가운데 녹색도 있으나, 이 사이트에서는 사용자의 KLIC 블루 정책을 우선하므로 색 선택 목록을 그대로 복제할 근거로 삼지 않는다.

## 7. 공식 ReUI Customize: 확인된 기능과 미확인 범위

공식 1차 자료를 조회했다. 제공 ZIP은 사용자 재구현본이므로 현재 ReUI 전체 목록 숫자를 가져와 ZIP의 누락 수로 계산하지 않는다.

| 확인 사항 | 공식 근거 | KLIC에 적용할 의미 |
| --- | --- | --- |
| Customize의 디자인 변수 | [Embed 문서](https://reui.io/docs/embed)의 URL 계약: `style`, `theme`, `font`, `fontHeading`, `chartColor`, `baseColor`, `menuAccent`, `menuColor`, `radius`, `iconLibrary` | 테마·본문/제목 글꼴·차트·neutral/base·메뉴·radius·아이콘 계열은 단순 밀도보다 넓은 공식 기능군 |
| 디자인 preset | [Registry](https://reui.io/docs/registry): Vega, Nova, Maia, Lyra, Mira, Luma, Sera, Rhea. Base UI와 Radix UI 두 primitive 기반 | 시각 preset과 실제 구현 기반을 구분. 이 업로드 소스가 두 라이브러리 모두로 변환됐다고 주장하면 안 됨 |
| 미리보기와 복사 코드 | [Components의 Shadcn Create Compatibility](https://reui.io/components): radius·font·base color·color scale이 preview에 반영되고 복사 소스는 같은 CSS 변수 사용 | 설정이 실제 미리보기와 내보낸 토큰/코드에 연결되어야 함 |
| 상태별 색 토큰 | [Styling](https://reui.io/docs/styling): info/success/warning/invert 등 의미 토큰과 명암별 값 | 의미 토큰 방식은 참고하되 KLIC의 녹색 금지 규칙에 맞춰 색값 결정 |
| 로딩·embed | 공식 preview는 URL 설정을 최초 렌더에서 읽으며 높이 자동 조절은 제공하지 않음 | 첫 화면 깜빡임 방지·iframe 크기는 host 책임이라는 설계 참고 |
| 설치 방식 | Registry의 `@reui`는 shadcn registry namespace이며 npm package scope 설치가 아님 | `npm i @reui/...` 또는 업로드의 가짜 `@flux-ui/...` 명령을 실제 설치 안내로 노출하면 안 됨 |

확인하지 못한 사항: 실제 Customize 패널의 전체 화면 캡처, 모든 선택값 목록, import/export/reset 버튼의 정확한 존재·배치, 화면배율 퍼센트 제어와 Desktop/Tablet/Mobile의 구체 값. 공식 문서의 디자인 변수 계약에서 이런 UI까지 추정하지 않는다. KLIC에서 설정 JSON/CSS export, 저장 preset, 전역 textScale을 제공하는 것은 합리적인 확장이지만 “공식 ReUI에 동일 버튼이 있다”는 단정은 피한다.

공식 원격 preview의 framing 계약과 로컬 업로드 소스로 만든 React iframe은 다른 대상이다. 이번 구현은 원격 ReUI iframe을 삽입한 것이 아니므로, 원격 embed 조건을 로컬 소스 실행의 기술적 장애로 해석하지 않는다.

## 8. 최종 반영 상태와 남는 제한

최종 소스·manifest·생성 파일을 읽기 전용으로 재점검했다. 프로젝트의 최종 통합 검증 결과는 **테스트 95개 통과 및 빌드 완료**다. 문서 갱신 과정에서는 테스트와 빌드를 중복 실행하지 않았으며, 아래 파일·연결 관계를 직접 확인했다.

| 항목 | 최종 반영 상태 | 확인 근거 |
| --- | --- | --- |
| 담당자 사진 | 가상 성인 인물 129명의 실사풍 사진을 4개 로컬 atlas의 고유 cell에 배정. 이름·별칭으로 일관되게 조회 | `block-runtime/public/portraits/manifest.json`, `registry.mjs`, `PROVENANCE.md`; people 129개. 실제 직원 사진 또는 원본 인물 사진 복원이라는 뜻은 아님 |
| 교육·상품 이미지 | 원본 교육 12개·상품 12개, 총 24개 WebP 복원 및 중앙 데이터 적용 완료 | `catalog/thumbnail-map.json`의 24개 localPath 모두 `block-runtime/src/data/componentsData.ts`에 존재 |
| 갤러리 미리보기 | 실제 BlockApp 초기 JSX로 구현 ID 164종을 라이트·다크 두 형태로 생성: HTML 328개 | `scripts/generate-block-thumbnails.mjs`, `dist/block-thumbnails/manifest.json`; renderer는 ReactDOMServer.renderToStaticMarkup |
| 아바타 표시 | Customize 스위치 → 공통 설정 → iframe context → BlockApp prop → 해당 블록으로 전달 | `dist/customize.mjs`, runtime `main.tsx:181`, `BlockApp.tsx:106–110` 및 렌더 prop |
| 진행률 링 | Customize 스위치가 원본의 showProgressRings 경로까지 전달 | 같은 설정·context·prop 연결. 원본에서 옵션을 받는 블록에 적용 |
| 행 밀도 동기화 | host → runtime 전달과 Catalog 내부 → host 역방향 전달 모두 연결 | `BlockApp.tsx:690,713`, `main.tsx:181`, `dist/blocks.js`의 klic:block-preference 수신 및 설정 갱신 |
| 즐겨찾기 | 카드·상세 별표, 즐겨찾기 필터, localStorage 저장 복원 | `dist/blocks.js`의 klic-block-favorites, favorite/favorites-only 핸들러 |
| 전체화면 | CSS 확장 overlay, 닫기 버튼, host와 iframe 내부 Escape 처리, 배경 inert 및 포커스 복원 | `dist/blocks.js`의 toggleExpanded/closeExpanded, runtime main의 klic:block-exit-expanded 전송. 브라우저 Fullscreen API 사용을 의미하지 않음 |
| 공유·Markdown | 상세 URL 복사, 제목·설명·분류·ID·미리보기 링크의 Markdown 복사 복원 | `dist/blocks.js` share/markdown 핸들러. 가상의 npm 패키지명은 다시 넣지 않음 |
| Customize 진입 | 블록 미리보기의 Customize 모달 및 설정 페이지 제공 | `dist/customize.mjs` openCustomizer/renderSettingsPage; native dialog, 닫기·포커스 복귀 연결 |
| Customize 범위 | 시스템/라이트/다크, 블루 강조 3종, 중립 2종, 본문·제목 글꼴 각각 3종, 글자 크기, 전체 배율, 자동 배율, 밀도, radius, 차트 팔레트, 메뉴 표현, 아이콘 선, 아바타·링 | `dist/customize.mjs` fields, `dist/preferences.mjs` 값 검증, runtime context 및 토큰 연결 |
| 저장·프리셋·내보내기 | 브라우저 자동 저장, 기본/읽기 편하게/데이터 집중 프리셋, 설정 초기화, CSS 복사, JSON 저장 | `klic-appearance-v1`, presetBar/actions, customizedCSS/exportPreferences. 임의 프리셋 저장·JSON 가져오기 기능이 있다는 뜻은 아님 |
| Calendar식 배율 | 기준 1280×820, 자동 85–135%, 최종 70–180%, 5% 반올림 공식 반영. resize 때 재계산하며 CSS zoom으로 적용 | `dist/preferences.mjs` calculateScale, `dist/customize.mjs` resize handler. 네이티브 WebView 자체를 이식한 것은 아님 |
| Auth 샘플 이메일 | @가 사라졌던 세 주소를 유효한 샘플 형식으로 교정 | `AuthBlock.tsx:478,614,622`; 로그인·OAuth는 계속 로컬 데모 |
| 초기화 범위 | “데모 초기화”는 데이터만, Customize “초기화”는 화면 설정만 되돌리도록 명시 | `dist/blocks.js` reset 안내와 runtime revision, `dist/customize.mjs` DEFAULT_PREFERENCES reset |

갤러리의 328개 문서는 스크린샷 이미지가 아니라 **실제 컴포넌트의 초기 HTML·표·텍스트·SVG를 축소해서 보여 주는 정적 미리보기**다. JavaScript effect와 사용자 조작은 실행하지 않고 애니메이션은 정지한다. 기본 설정의 초기 모습을 보여 주므로 현재 사용자의 모든 Customize 값을 실시간으로 반영하는 결과로 설명하지 않는다. 상호작용은 상세 runtime에서 수행한다. 같은 원본 구현에 연결된 별칭 ID들은 같은 내용을 보여줄 수 있으므로, “164개 모두 시각적으로 서로 다른 구현”이라고 표현하지 않는다.

인물 사진은 OpenAI imagegen으로 생성된 가상 인물이며 provenance와 이름별 고유 매핑을 기록했다. 원본의 재사용 사진 URL만으로 사람을 식별하지 않는다. 교육·상품 24개 이미지는 이 가상 인물 사진과 별개로 원본 URL 응답을 보존한 자산이다.

최종 KLIC 화면배율 선택은 80/90/100/110/125/150%이고 자동 배율은 선택 옵션이다. Calendar의 사용자 단계 80/90/100/110/120/135/150%와 정확히 같지는 않다. radius 값, 글꼴 수, 전역 textScale, 프리셋과 내보내기 역시 KLIC에 맞춘 선택·확장이며 Calendar 또는 ReUI의 전체 기능을 동일하게 복제했다는 뜻은 아니다. 강조색은 KLIC·Royal·Navy 블루 계열로 제한했다.

| 유지되는 제한 | 최종 설명 |
| --- | --- |
| 원본 미구현 83개 | 계획 항목으로 유지. 실제 데모 또는 완성 블록으로 승격하지 않음 |
| Backend 연동 | 계정 인증·OAuth·결제·메일 발송·예약·외부 통합은 샘플 상태와 로컬 동작. 운영 서비스 연결 완료라고 주장하지 않음 |
| Reports PDF·예약·발송 | 실제 다운로드는 샘플 CSV. PDF 선택·예약·발송은 모의 설정·상태 |
| 외부 문서 링크 | Integrations의 Docs 모달은 참고 URL을 표시하지만 이동하지 않음 (`IntegrationsHubBlock.tsx:1340–1341`). runtime의 외부 anchor/form 탐색 제한도 유지 |
| 실시간 썸네일 | 초기 SSR 콘텐츠만 제공. 전체 동작·애니메이션 검증이나 사용자별 실시간 설정 캡처와 구분 |
| 검증 범위 | 소스·자산·생성 결과와 통합 테스트 결과를 구분. 이 문서 자체가 164개 데모의 모든 가능한 UI 조합을 수동 검증했다는 증명은 아님 |

## 9. 구현 모듈 매핑

아래는 164개 실제 목록 ID가 참조하는 47개 최상위 모듈이다. 파일 경로는 `block-runtime/src/components/blocks/<모듈>.tsx`. 모든 행의 원본 대응 파일이 보존되어 있다. 같은 모듈의 여러 ID는 모드 분기 여부를 함께 읽어야 하며, 독립 구현 개수로 합산하면 안 된다. 개별 ID·현재 제목·원본 별칭·variantNote의 정본은 `dist/blocks-data.json`이다.

| 모듈 | 목록 ID 수 | 연결 ID |
| --- | ---: | --- |
| ApplicationTemplatesBlock | 5 | template-advisor-knowledge, template-autonomous-task-lifecycle, template-smart-reorder-supplychain, template-proforma-financial-roi, template-enterprise-reports-center |
| KanbanBoardBlock | 6 | agent-task-lifecycle, kanban-sprint-board, kanban-swimlane-squad, kanban-crm-deal, kanban-incident-triage, kanban-hiring-ats |
| CardShowcaseBlock | 6 | card-saas-metric, card-project-health, card-pricing-tier, card-api-integration, card-approval-request, card-meeting-schedule |
| DashboardWorkspaceBlock | 5 | dashboard-exec-revenue, dashboard-sre-observability, dashboard-product-analytics, dashboard-finops-cost, dashboard-cx-support |
| DialogShowcaseBlock | 5 | dialog-command-palette, dialog-destructive-confirm, dialog-share-permissions, dialog-api-token-create, dialog-bulk-import-csv |
| NavbarShowcaseBlock | 5 | navbar-workspace-header, navbar-contextual-subnav, navbar-floating-dock, navbar-mega-menu, navbar-incident-banner |
| RichTextEditorShowcaseBlock | 5 | rte-slash-document, rte-markdown-tech-spec, rte-collaborative-comment, rte-incident-postmortem, rte-email-campaign |
| TaskLifecycleBlock | 1 | list-agent-tasks |
| ListShowcaseBlock | 5 | list-audit-activity, list-notification-inbox, list-git-deployments, list-team-directory, list-api-webhooks |
| EmptyStateShowcaseBlock | 5 | empty-search-filter, empty-first-project, empty-permission-locked, empty-integration-disconnected, empty-inbox-zero |
| SettingsShowcaseBlock | 6 | settings-team-permissions, settings-workspace-general, settings-security-sso, settings-notification-routing, settings-api-webhooks, settings-billing-plan |
| NotificationShowcaseBlock | 6 | notif-project-updates, notif-floating-toast, notif-approval-center, notif-incident-pager, notif-mention-thread, notif-daily-digest |
| DataEditingShowcaseBlock | 5 | cell-inline-input, popover-date-picker, tag-multiselect-editor, numeric-stepper-cell, optimistic-cell-save |
| SheetShowcaseBlock | 5 | sheet-issue-detail, sheet-trace-inspector, sheet-customer-360, sheet-advanced-filter, sheet-audit-diff |
| FlowShowcaseBlock | 8 | flow-react-lead-routing, flow-react-fds-routing, flow-react-vip-defense, flow-cicd-pipeline, flow-webhook-automation, flow-etl-lineage, flow-microservice-topology, flow-approval-routing |
| AppShellShowcaseBlock | 5 | shell-enterprise-sidebar, shell-dual-rail-ide, shell-top-nav-portal, shell-master-detail-inbox, shell-canvas-studio |
| GanttChartBlock | 6 | gantt-flux-wbs-svg, gantt-project-tasks, gantt-resource-capacity, gantt-milestone-roadmap, gantt-sprint-release, gantt-critical-path |
| OnboardingShowcaseBlock | 5 | onboarding-checklist-hub, onboarding-role-personalize, onboarding-interactive-tour, onboarding-sdk-quickstart, onboarding-data-migration |
| WizardShowcaseBlock | 5 | wizard-cloud-provisioning, wizard-enterprise-contract, wizard-rbac-role-builder, wizard-report-scheduler, wizard-sso-saml-setup |
| CalendarShowcaseBlock | 5 | calendar-release-freeze, calendar-marketing-campaign, calendar-oncall-rotation, calendar-resource-booking, calendar-compliance-audit |
| AuthBlock | 5 | auth-enterprise-sso-login, auth-mfa-totp-verify, auth-workspace-signup, auth-session-device-manager, auth-step-up-reauth |
| ScheduleBlock | 7 | schedule-shift-optimize, schedule-field-dispatch, schedule-daily-agenda, schedule-interview-slots, schedule-maintenance-window, schedule-shift-planner, schedule-batch-cron-agenda |
| StatsShowcaseBlock | 5 | stats-executive-kpi-strip, stats-sla-uptime-summary, stats-usage-quota-meters, stats-conversion-benchmark, stats-dora-engineering |
| TimelineShowcaseBlock | 5 | timeline-incident-response, timeline-order-fulfillment, timeline-release-changelog, timeline-contract-lifecycle, timeline-pr-review-chain |
| FormShowcaseBlock | 5 | form-incident-report, form-procurement-request, form-webhook-endpoint, form-database-connection, form-feature-flag-rule |
| FunnelFlowBlock | 3 | funnel-flow, trial-flow, b2b-deals-flow |
| SlopeChartBlock | 2 | error-budget-slope, arr-growth-slope |
| RadialChartBlock | 4 | cash-inflows-radial, api-health-radial, competitor-feature-radar, team-velocity-polar |
| ErrorBudgetBurnBlock | 1 | error-budget-burn |
| EnvironmentPipelineBlock | 1 | env-promotion-pipeline |
| StatusTrackerBlock | 3 | cron-run-history-tracker, uptime-sla-tracker, incident-health-bars |
| CapitalInflowsBlock | 3 | capital-inflows-bar, revenue-breakdown-bar, headcount-cost-bar |
| SupportTicketsBlock | 1 | support-tickets |
| StripedRowsBlock | 1 | striped-rows |
| SlaRiskIndexBlock | 1 | sla-risk-index |
| CatalogBlock | 2 | course-catalog, product-catalog |
| AccessPermissionsBlock | 1 | access-permissions-matrix |
| SharedDriveBlock | 1 | shared-drive-folders |
| ReleaseApprovalsBlock | 1 | release-approvals |
| SubTaskTrackerBlock | 1 | subtask-tracker |
| BillingUpgradeBlock | 1 | billing-upgrade |
| IntegrationsHubBlock | 1 | integrations-hub |
| ReportsManagementBlock | 1 | reports-schedule |
| BillingBlock | 1 | billing-transactions |
| WorkspaceOverviewBlock | 1 | workspace-overview |
| RoadmapBlock | 1 | roadmap-stage |
| RevenueBlock | 1 | revenue-region |
