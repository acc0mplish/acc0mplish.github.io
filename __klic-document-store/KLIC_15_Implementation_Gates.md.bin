# KLIC 개선 계획 · 7 디멘션 / 개발 연동 / 프리뷰

기준 주소: config/public-metadata.json의 `site.origin` · 작성일: 2026-10-24

## 제품 정의

**7 디멘션 — 다차원 관점과 4단계 위계로 정립된 디자인 프레임워크.**

크기·타이포그래피·색·배치·간격·표면·상호작용은 디자인을 검토하는 7가지 관점이다. Primitive → Brand → Semantic → Component는 값의 책임과 상속을 정의하는 4단계 위계다. 기존 API의 `axes` 필드와 상세 탭 경로는 호환성을 위해 유지한다. 사용자에게 보이는 이름은 7 디멘션으로 통일한다.

## 구현 범위와 통과 기준

| 요구 | 구현 | Gate |
|---|---|---|
| 7 디멘션 | 메뉴·문서·명세·OG 용어, 프레임워크 가이드 | 사용자 노출 소스에서 기존 7축 용어 제거; 기존 ID 유지 |
| 남용 방지 | D1 원자 카운터, API 120/MCP 60/다운로드 2,000회·분·IP | 동시 요청, 429/Retry-After, 저장소 실패503, 위조 역할 거부 |
| 권한자 무제한 | 서버 allowlist의 SHA-256과 비밀 키 검증 | 유효 키만 제한 면제; OAuth·관리 권한과 분리; 키 공개 코드 제외 |
| 빠른 프리뷰 | 선택한 블록 구현만 동적 import, SSR 썸네일 유지 | 48개 모듈과165개 실행 경로 유지; 최초 JS 크기 비교 |
| 기본 프리뷰 | 논리 폭1920px, Fit/100%,390/768/1920 프리셋 | 저장된 수동 설정 보존, 좁은 화면에서 캔버스 내부 스크롤 |
| KRDS 참고 | R/A/D/I/U/S 검증과 디자인 디멘션 구분 | 포커스·24px 최소 타깃·대비·320px reflow 기준 및 예외 문서화 |
| i18n | 한국어/영어 선택·저장·iframe 전파 | 메뉴·100개 전체 가이드·249개 블록명/설명·연동 가이드, 왕복 전환 시 값/코드 보존 |
| CSS/Figma | 기존 블루/네이비 유지, 문서16/24·14/20, 간격·표면 정리 | 문서 스타일이 실행 데모의 CSS를 덮어쓰지 않음 |
| ReUI/Dependencies | 실제 import 분석, 버전 고정, 로컬 의존성과 빌드 도구 구분 | HTML에 React 설치를 요구하지 않음; 계획 항목에 가짜 명령 없음 |
| Customize | 우측 도킹/플로팅·닫기/Escape·포커스 복귀 | 데스크톱 도킹은 비모달 region, 모바일은 오버레이 |

## 보안·운영 계약

- 원격 요청을 서버에서 제한한다. 공개 자료의 로컬 사본·이미 로드한 stdio/WebMCP 연산은 서버에서 제한할 수 없다.
- CLI는 `KLIC_API_KEY` 환경 변수만 읽는다. 키를 인자·URL에 넣지 않으며 다른 출처와 리디렉션으로 전달하지 않는다.
- API/MCP 클라이언트는 `X-KLIC-API-Key` 비밀 헤더를 사용한다. 무제한 키는 공개 조회의 사용량 제한만 면제한다.
- 무제한 키 원문은 공개 프로젝트에 저장하지 않는다. 서버 `KLIC_UNLIMITED_KEY_HASHES`의 해당 해시를 제거하면 회수된다.
- 요청 제한 응답은 private/no-store다. 일반 UI 폰트·CSS·프리뷰 청크는 캐시를 유지한다.
- D1 바인딩과 migration을 같은 배포에 포함한다. 카운터 저장소가 없으면 보호 경로는503을 반환한다.

## 참고와 한계

- KLIC-WCAG-KRDS: https://github.com/klic-co-kr/KLIC-WCAG-KRDS/tree/204b0276340c29fccc5b3ba52ba5d2806133e1ef
- ReUI: https://reui.io/blocks/application/dashboard/dashboard-1 — 블록 문서의 의존성 구성 참고. 라이선스가 다른 블록 코드를 복제하지 않는다.
- Figma: https://www.figma.com/design/wpWaKSR8tiMo0y5FSUisrC/acc0mplish--Design-v0.1?node-id=4005-41386 — Foundations의 타이포그래피·간격 참고. Figma 원본 파일은 변경하지 않고 사이트 CSS에 적용한다.
- WCAG: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html · https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- 사용자 언급 첨부 스크린샷은 이번 요청에 없어 우측 도킹 요구를 기준으로 구현했다.
- 원본 샘플 데이터와 번역되지 않은 외부 참고 텍스트는 한국어 원문과 언어 표시를 유지한다. 샘플 콘텐츠 전체 번역이나 접근성 인증을 주장하지 않는다.
- 로딩 속도는 초기 전송 JavaScript 용량으로 비교한다. 사용자 기기의 실측 시간과 동일한 지표가 아니다.

## 배포 Gate

1. 소스 단위/통합 테스트와 TypeScript 검사를 통과한다.
2. 실행 블록 SSR·동적 import 경로·의존성 분석·번들 무결성을 검증한다.
3. 브라우저에서1920px/Fit, 도킹, 언어 전환, Dependencies와 로딩 복구를 확인한다.
4. Sites에 소스·자산·Worker·D1 migration을 함께 게시한다.
5. 배포 상태와 데이터베이스 schema를 확인한다. 외부 클라이언트 차단으로 실행하지 못한 검사는 통과로 기록하지 않는다.

## 확인한 결과

- 프로덕션 빌드 성공. 100개 컴포넌트, 실행 블록165개, 준비 항목84개, 구현 모듈48개.
- 회귀 검사161개 통과·1개 건너뜀(현재 원본 ZIP 부재), 블록 로직56개 통과. TypeScript 검사 통과.
- 한국어 다이어그램 최초 JavaScript: 2,170,951 → 418,030 bytes(80.7% 감소). gzip481,690 → 127,289 bytes. 시간 측정값이 아닌 빌드 자산 크기다.
- 영어 사전은 한국어 프리뷰의 최초 그래프에서 분리되어 영어 선택 시 불러온다.
- 브라우저에서1920px/Fit, 도킹/플로팅, Escape 포커스 복귀, 한·영 왕복, Dependencies 펼침 상태 보존을 확인했다.
- SQL 원자 카운터와 실제 Worker handler 테스트에서429·503·무제한 키·위조 권한 거부·CORS·캐시 분리를 확인했다.
- 외부 고객 클라이언트별 OAuth 연결과 실제 모바일/스크린리더 전체 상태 검증은 별도 범위다.
