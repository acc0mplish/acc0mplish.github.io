# KLIC PRD v1.1 개정 검증 기록

개정 기준일: 2026-10-25. 기준 소스: 9a5363c71450b1dc85ef6551129dffec25873d7c 이후의 이번 개정. 최종 배포 SHA는 Sites 저장 버전의 source SHA를 사용한다.

| 검사 | 결과 | 한계 |
| --- | --- | --- |
| npm test | 262건 중 261 통과, 0 실패, 1 skip | skip: 기존 업로드 archive로 전체 카탈로그 재생성 시험. archive fixture 미제공 |
| npm run test:blocks | 72건 중 72 통과, 0 실패 | React 블록 단위·상태 계산 검사 |
| npm run build | exit 0 | Worker/client·소스 묶음·배포용 출력 생성 |
| git diff --check | exit 0 | 변경 whitespace 검사 |
| managed Chrome preview | 개정 계약 ko/en, Light/Dark 전환, Studio 토큰 선택 확인 | 실제 사용자 지원 매트릭스 전체 수용시험은 아님 |

자동 테스트 합계: 261 + 72 = 333 통과. 전체 항목 262 + 72 = 334 중 기존 skip 1건. skip을 통과로 계산하지 않는다.

추가 회귀: 모든 표현 프로필·모드·설정 경계에서 동일 Primitive inventory; 비Primitive literal 차단; Semantic 브랜드/경로/타입/대상 allowlist; 숫자 경로·CSS 충돌·group/leaf 충돌; malformed leaf·NaN/alpha/희소 배열 색상; alpha CSS 보존; 완전한 literal Light/Dark map; 61개 FR/AT 추적 필드.

114개 기존 leaf의 4개 A/B×Light/Dark resolved value를 개정 전 HEAD에서 독립 추출한 golden fixture와 비교했다. 별도 성공 상태 색상 회귀에서 Core·Studio·Data의 Light/Dark palette 선택을 확인했다. 원시 alias 경로 변경과 사용자에게 보이는 값의 호환성을 구분한다.

독립 코드 검토: Critical 0. 프로필 success 색상이 Core로 바뀌는 Important 회귀를 발견하여 실패 테스트로 재현 후 수정했다. 희소 color array와 개요의 기준선 문구도 수정했다. 미해결 검토 finding은 없다. 요구사항과 독립적인 전체 기능·인증 검토를 수행했다는 의미는 아니다.

실제 OS/브라우저별 확대, text-only zoom, screen reader, IME, 터치, 모바일 키보드, 가상화 성능·재측정, nested theme와 제품 rollback은 미검증이다. 계획·단위 검사·브라우저 화면 관찰을 이 시험의 대체 증거로 사용하지 않았다.

초기 checkout에는 생성된 소스 bundle이 없어 전체 suite 일부가 실패했다. 정식 build 재생성 후 해결됐다. immutable inventory 추가로 기존 raw-definition hash/count 시험이 실패한 것은 승인된 내부 경로 변경에 따른 것이며, 개정 전 114개 resolved value를 고정한 호환 검사로 대체했다.
