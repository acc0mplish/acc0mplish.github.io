// Generated from docs/verification/2026-11-07-experience-maturity.json.
export const RELEASE_VALIDATION = {
  "schemaVersion": 1,
  "date": "2026-11-07",
  "status": "verified",
  "candidateVersion": "0.0.5",
  "tarballSha256": "9946e62ef62a9d04373f889dee3fc21b0529a9dfa2db7632b31c45fdf6e419c0",
  "tarballBytes": 23196677,
  "integrity": "sha512-gJSa+RGZDcxos8LkOdF5kGF5lmLOGx5Y+JQMun9rmXDHhn48KMpSA1NlV0Dvd0crDL/9HFit1wIPK0jxoMvGjw==",
  "publication": {
    "version": "0.0.4",
    "candidatePublished": false,
    "scope": "Site changes and local candidate verification; no new npm publication"
  },
  "checks": [
    {
      "command": "bun run test",
      "status": "pass",
      "pass": 686,
      "skip": 1,
      "fail": 0,
      "total": 687
    },
    {
      "command": "bun test block-runtime/src/utils/*.test.ts block-runtime/src/components/*.test.ts",
      "status": "pass",
      "pass": 128,
      "fail": 0,
      "scope": "repository block-runtime suite"
    },
    {
      "command": "bun run verify:design-system",
      "status": "pass",
      "pass": 29,
      "fail": 0
    },
    {
      "command": "bun run build",
      "status": "pass",
      "scope": "production build and deployable distribution/browser graph/theme/staging gates"
    },
    {
      "command": "bun scripts/verify-npm-consumers.mjs --tarball <frozen candidate>",
      "status": "pass",
      "runners": 4,
      "deliveries": [
        {
          "command": "add component button",
          "runtime": "node",
          "files": 1744,
          "allFileHashes": "pass"
        },
        {
          "command": "add block course-catalog",
          "runtime": "bun",
          "files": 274,
          "allFileHashes": "pass"
        },
        {
          "command": "theme add klic",
          "runtime": "node",
          "files": 38,
          "allFileHashes": "pass"
        }
      ]
    },
    {
      "command": "Sol/high read-only source review and README regression",
      "status": "pass",
      "findings": {
        "P0": 0,
        "P1": 0,
        "P2": 1,
        "resolved": 1
      },
      "focusedPass": 13
    },
    {
      "command": "desktop/mobile collection and Button/Motion browser checks",
      "status": "pass"
    },
    {
      "command": "HTML source delivery and staging regression",
      "status": "pass",
      "focusedPass": 13,
      "scope": "immutable component/block HTML URLs; no static shadow; raw full-byte GET; registered source and range handling",
      "review": {
        "P1": 1,
        "P2": 1,
        "resolved": 2
      }
    }
  ],
  "runtimes": [
    {
      "runtime": "development",
      "status": "pass",
      "artifact": "npm tarball",
      "cssImportOrder": "blocks.css then components.css",
      "imagesDecoded": 24,
      "catalogs": [
        "course-catalog",
        "product-catalog"
      ],
      "checks": [
        "Korean search",
        "empty-result recovery",
        "category filter",
        "draft-to-published state transition",
        "action text contrast >=4.5",
        "Native HTML reference contract"
      ],
      "errors": 0,
      "evidenceSha256": "631537537d0c2ce36fe730e8cad62f316d7993db4bf21478053d83d182b8569a"
    },
    {
      "runtime": "production",
      "status": "pass",
      "artifact": "npm tarball",
      "cssImportOrder": "blocks.css then components.css",
      "imagesDecoded": 24,
      "catalogs": [
        "course-catalog",
        "product-catalog"
      ],
      "checks": [
        "Korean search",
        "empty-result recovery",
        "category filter",
        "draft-to-published state transition",
        "action text contrast >=4.5",
        "Native HTML reference contract"
      ],
      "errors": 0,
      "evidenceSha256": "631537537d0c2ce36fe730e8cad62f316d7993db4bf21478053d83d182b8569a"
    },
    {
      "runtime": "development",
      "status": "pass",
      "artifact": "npm tarball",
      "cssImportOrder": "components.css then blocks.css",
      "imagesDecoded": 24,
      "catalogs": [
        "course-catalog",
        "product-catalog"
      ],
      "checks": [
        "Korean search",
        "empty-result recovery",
        "category filter",
        "draft-to-published state transition",
        "action text contrast >=4.5",
        "Native HTML reference contract"
      ],
      "errors": 0,
      "evidenceSha256": "bbbd6b7c56771da4cde8bb8c48803130ae4b9a913cde65f91d3bfaae5d126c75"
    },
    {
      "runtime": "production",
      "status": "pass",
      "artifact": "npm tarball",
      "cssImportOrder": "components.css then blocks.css",
      "imagesDecoded": 24,
      "catalogs": [
        "course-catalog",
        "product-catalog"
      ],
      "checks": [
        "Korean search",
        "empty-result recovery",
        "category filter",
        "draft-to-published state transition",
        "action text contrast >=4.5",
        "Native HTML reference contract"
      ],
      "errors": 0,
      "evidenceSha256": "bbbd6b7c56771da4cde8bb8c48803130ae4b9a913cde65f91d3bfaae5d126c75"
    }
  ],
  "nativeSource": {
    "appSha256": "3619f10e98003438348c9a79d3a8d1618195a1fbb12ce82d48f2f36a78682738",
    "files": 1744,
    "localAndHTTPHashes": "pass",
    "runtimeChecks": [
      {
        "runtime": "development",
        "status": "pass",
        "checks": [
          "native disabled",
          "aria-busy=true",
          "duplicate activation blocked",
          "original label and attributes restored"
        ]
      },
      {
        "runtime": "production",
        "status": "pass",
        "checks": [
          "native disabled",
          "aria-busy=true",
          "duplicate activation blocked",
          "original label and attributes restored"
        ]
      }
    ],
    "buildScope": "Native HTML/ESM copy build; React production JSX covered by the npm consumer apps",
    "httpScope": "Local production Worker source delivery; final hosting checks are recorded separately from candidate runtime verification."
  },
  "collections": [
    {
      "route": "components",
      "device": "desktop",
      "viewport": {
        "width": 1440,
        "height": 900
      },
      "searchTop": 289.97,
      "previewTop": 680.34
    },
    {
      "route": "blocks",
      "device": "desktop",
      "viewport": {
        "width": 1440,
        "height": 900
      },
      "searchTop": 315.12,
      "previewTop": 368.12
    },
    {
      "route": "motion",
      "device": "desktop",
      "viewport": {
        "width": 1440,
        "height": 900
      },
      "searchTop": 307.08,
      "previewTop": 463.88
    },
    {
      "route": "components",
      "device": "mobile",
      "viewport": {
        "width": 390,
        "height": 844
      },
      "searchTop": 273.16,
      "previewTop": 770.01
    },
    {
      "route": "blocks",
      "device": "mobile",
      "viewport": {
        "width": 390,
        "height": 844
      },
      "searchTop": 330.25,
      "previewTop": 427.25
    },
    {
      "route": "motion",
      "device": "mobile",
      "viewport": {
        "width": 390,
        "height": 844
      },
      "searchTop": 284.8,
      "previewTop": 434.8
    }
  ],
  "limits": {
    "ko": [
      "공개 npm은 0.0.4입니다. 0.0.5는 검증된 로컬 후보이며 새 npm 발행은 수행하지 않았습니다.",
      "이미지·대비 검증은 기본 Vite 소비 앱의 두 CSS import 순서에 해당합니다. Site의 기존 Native dark 보조 버튼 일부에서 밝은 글자·밝은 배경을 관찰했으며 dark 전체 대비 통과를 주장하지 않습니다.",
      "Native npm export는 HTML·계약 참고 자료입니다. 실제 처리 동작은 전달된 source 앱에서 검증했습니다.",
      "물리 OS 한글 IME·전체 접근성 인증·실제 저장 API·정량 점수/속도 개선은 검증하지 않았습니다."
    ],
    "en": [
      "Published npm remains 0.0.4. Version 0.0.5 is a verified local candidate; no new npm publication was performed.",
      "Image and contrast checks cover the default Vite consumer apps with both CSS import orders. Some existing Native Site secondary buttons showed light text on light backgrounds in dark mode; full dark-mode contrast is not claimed.",
      "Native npm exports are HTML and contract references. Actual processing behavior was checked in the delivered source app.",
      "Physical OS Korean IME, full accessibility certification, real save APIs and quantitative score or performance gains were not verified."
    ]
  }
};
