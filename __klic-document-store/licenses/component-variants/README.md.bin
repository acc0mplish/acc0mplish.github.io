# KLIC 컴포넌트 형태 · 공개 소스 안내

KLIC의 추가 컴포넌트 형태는 공개 MIT 예제의 구조·사용 패턴을 참고해 기존 KLIC HTML·CSS·JavaScript 실행 환경과 테마 토큰에 맞춘 **native adaptation**입니다. ReUI, shadcn/ui, Base UI의 React 패키지를 설치하거나 모든 원본 구현을 그대로 복사한 라이브러리라는 뜻은 아닙니다. 기본 KLIC 형태와 자체 조합도 함께 포함합니다.

## 확인한 공개 저장소

| 저장소 | 확인한 커밋 | 보존한 MIT 라이선스 |
|---|---|---|
| [ReUI · keenthemes/reui](https://github.com/keenthemes/reui/tree/067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a) | `067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a` | [Keenthemes Inc](./reui-MIT.txt) |
| [shadcn/ui](https://github.com/shadcn-ui/ui/tree/481d523374745e77d0cf9c53a4115ab5dd7c8481) | `481d523374745e77d0cf9c53a4115ab5dd7c8481` | [shadcn](./ui-MIT.txt) |
| [Base UI · mui/base-ui](https://github.com/mui/base-ui/tree/c1294abd3c7ab19fa0fb980373af732315b8a5be) | `c1294abd3c7ab19fa0fb980373af732315b8a5be` | [Material-UI SAS](./base-ui-MIT.txt) |

- [라이선스 출처와 SHA-256](./sources.json)
- [항목별 검토한 예제 출처](./references.json)

항목별 기본 참조 외에 `variantReferences`에 4개씩 총 400개의 참조 슬롯을 제공합니다. `direct-pattern`은 같은 종류의 예제, `related-pattern`은 조합에 참고한 관련 패턴, `klic-composition`은 해당 원본에 직접 대응하는 컴포넌트가 없어 KLIC에서 별도로 구성할 형태입니다. 기본 참조의 `direct-category`·`related-composition`도 같은 출처 범위 구분입니다. 출처는 참고·변형 근거를 설명하며 KLIC의 모든 형태가 원본과 동일하거나 해당 저장소에서 직접 제공된다는 의미가 아닙니다. 네 개의 추가 형태 각각은 KLIC의 구성과 동작을 함께 확인해 사용하세요.

MIT 소스를 복사·변형·배포할 때는 저작권과 허가문을 함께 보존해야 합니다. 소프트웨어는 보증 없이 제공됩니다. 유료 ReUI Pro 콘텐츠나 인증이 필요한 에셋은 포함하지 않았습니다. 원본 예제에 연결된 외부 이미지·폰트·상표는 이 MIT 안내만으로 재배포 권한이 생기지 않습니다.

코드 사용 시 HTML뿐 아니라 KLIC의 연결된 스타일·상호작용 모듈·토큰을 함께 가져오세요. React 원본의 접근성·키보드 동작을 KLIC가 자동으로 상속하는 것은 아니므로 제품 환경에서 검증해야 합니다.
