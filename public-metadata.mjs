// Generated from config/public-metadata.json, the live package/registry evidence and OpenAPI.
export const PUBLIC_METADATA={
  "site": {
    "name": "KLIC Interface Library",
    "title": "KLIC — Interface Library",
    "origin": "https://design.klic.co.kr",
    "locales": [
      "ko",
      "en"
    ],
    "defaultLocale": "ko",
    "localeNames": {
      "ko": "한국어",
      "en": "English"
    }
  },
  "toolchain": {
    "bun": "1.4.2",
    "nodeMinimum": "22"
  },
  "package": {
    "name": "klic-design",
    "version": "0.0.2",
    "published": true,
    "status": "published",
    "registry": "https://registry.npmjs.org/",
    "runtime": "Bun 1.4.2 preferred; Node.js 22+ supported",
    "exports": [
      "tokens",
      "theme",
      "motion",
      "components",
      "blocks",
      "Agent Skill",
      "CSS",
      "TypeScript",
      "CLI"
    ],
    "skillPath": "skills/klic-design/SKILL.md",
    "buildCommand": "bun run pack:npm",
    "integrity": "sha512-l/DfatLGn2c5o4TTbjfynmpNj9Dgp9oIPMk/kJXKpnJTM2sDbpSxNeE9uTlAXlxVRMi45TXOSdXNxsqyDvYLhA==",
    "installCommand": "bun add klic-design@0.0.2",
    "cliCommand": "bunx --bun --package=klic-design@0.0.2 klic",
    "nodeCliCommand": "npx --yes --package=klic-design@0.0.2 klic"
  },
  "versions": {
    "toolkit": "0.0.1",
    "api": "1.0.0",
    "registrySchema": "1.0",
    "designSystemSchema": "1.0",
    "designContractSchema": "1.0",
    "themeSchema": "1.0",
    "bundleSchema": "1.0",
    "previewDependencySchema": "1.0",
    "compositionExportSchema": "1.0",
    "openapi": "3.1.0",
    "mcpProtocols": [
      "2026-07-28",
      "2025-11-25"
    ]
  },
  "routes": {
    "mcp": "/api/v1/mcp",
    "cli": "/integrations/klic.mjs"
  },
  "integrations": {
    "api": {
      "status": "available",
      "transport": "http-json",
      "methods": [
        "GET"
      ],
      "serverFiltering": true,
      "authentication": "public",
      "writes": false
    },
    "cli": {
      "status": "available",
      "runtime": {
        "preferred": "bun",
        "compatible": [
          "node"
        ]
      }
    },
    "mcp": {
      "status": "remote-and-stdio",
      "authentication": "public-design-read-only",
      "managedAuthentication": "Sites personal plugin"
    },
    "webmcp": {
      "status": "feature-detected",
      "interface": "document.modelContext",
      "scope": "current browser tab"
    },
    "skill": {
      "status": "available",
      "name": "klic-design",
      "format": "agentskills",
      "path": "/skills/klic-design/SKILL.md",
      "packagePath": "skills/klic-design/SKILL.md",
      "npmPackage": {
        "name": "klic-design",
        "version": "0.0.2",
        "published": true,
        "status": "published",
        "registry": "https://registry.npmjs.org/",
        "runtime": "Bun 1.4.2 preferred; Node.js 22+ supported",
        "exports": [
          "tokens",
          "theme",
          "motion",
          "components",
          "blocks",
          "Agent Skill",
          "CSS",
          "TypeScript",
          "CLI"
        ],
        "skillPath": "SKILL.md",
        "buildCommand": "bun run pack:npm",
        "integrity": "sha512-l/DfatLGn2c5o4TTbjfynmpNj9Dgp9oIPMk/kJXKpnJTM2sDbpSxNeE9uTlAXlxVRMi45TXOSdXNxsqyDvYLhA==",
        "installCommand": "bun add klic-design@0.0.2",
        "cliCommand": "bunx --bun --package=klic-design@0.0.2 klic",
        "nodeCliCommand": "npx --yes --package=klic-design@0.0.2 klic",
        "syncCommands": {
          "npm": "npx skills experimental_sync -y",
          "bun": "bunx skills experimental_sync -y"
        },
        "installCommands": {
          "npm": "npm install klic-design@0.0.2",
          "bun": "bun add klic-design@0.0.2",
          "version": "klic-design@0.0.2"
        }
      }
    },
    "themes": {
      "status": "available",
      "packageMode": "standalone-theme-kit"
    }
  },
  "rateLimit": {
    "windowSeconds": 60,
    "by": "IP",
    "limits": {
      "api": 120,
      "mcp": 60,
      "download": 2000
    },
    "unlimited": "Server-allowlisted secret key via X-KLIC-API-Key; CLI uses KLIC_API_KEY.",
    "response": 429,
    "retryHeader": "Retry-After",
    "offline": "Local copies and already-loaded stdio/WebMCP operations are not server-rate-limited."
  },
  "delivery": {
    "type": "reference-library",
    "summary": "klic-design 통합 패키지: AI 설계 지침·토큰·테마·폰트·CLI·CSS/React 모션 예제",
    "enSummary": "Unified klic-design package: Agent Skill, tokens, themes, fonts, CLI and CSS/React motion examples",
    "sourceDelivery": "Components and ready blocks: standalone reference workspaces via CLI plan/add. Motion recipes: CSS/React code via detail views, API and CLI motion get; include recipe CSS or React dependencies when adopting.",
    "licensing": {
      "mode": "per-file",
      "guide": "/licenses/README.md"
    },
    "figma": {
      "delivery": "manifest-and-migration-guide",
      "manifest": "/design-contract/materials/figma-manifest.json",
      "guide": "/design-contract/materials/figma-migration.md",
      "liveSync": false
    },
    "sourceRepository": {
      "status": "not-declared",
      "delivery": "Use the published source exports and verified CLI bundles."
    },
    "versioning": {
      "toolkit": "CLI and shared integration runtime version; independent of the npm package version",
      "schema": "Response format version",
      "release": "Registry publication hash",
      "revision": "Design criteria hash"
    }
  },
  "links": {
    "deliveryScope": "/about",
    "licenses": "/licenses/README.md",
    "figma": "/design-contract/materials/figma-migration.md",
    "designSystem": "/api/v1/design-system.json",
    "designDocs": "/#docs/architecture",
    "themes": "/api/v1/themes.json",
    "themeGuide": "/resources/cli#themes",
    "docs": "/resources",
    "api": "/resources/api",
    "cli": "/resources/cli",
    "mcp": "/resources/mcp",
    "webmcp": "/resources/webmcp",
    "skill": "/resources/cli#klic-design-skill",
    "schema": "/api/v1/registry.schema.json",
    "openapi": "/api/v1/openapi.json",
    "capabilities": "/api/v1/capabilities.json",
    "tools": "/api/v1/tools.json"
  },
  "counts": {
    "components": 104,
    "componentForms": 520,
    "blocksReady": 247,
    "blocksPlanned": 80,
    "blocksTotal": 327,
    "readyTotal": 351,
    "blockModules": 61,
    "total": 431,
    "motions": 280
  },
  "release": "3e14e5c57ae74252",
  "designSystem": {
    "schemaVersion": "1.0",
    "revision": "80cf180090cfaba13597872589dd066fbbdf788bfe6b0e72ca8d2218774c474f"
  },
  "themes": {
    "count": 10,
    "profiles": [
      "core",
      "studio",
      "data"
    ],
    "materials": [
      "flat",
      "glass",
      "solid-glass",
      "liquid-glass"
    ],
    "modes": [
      "system",
      "light",
      "dark"
    ],
    "inventory": {
      "total": 3751,
      "primitive": 3143,
      "brand": 247,
      "semantic": 248,
      "component": 113,
      "material": 2496,
      "materialTotal": 2928
    }
  },
  "apiPaths": [
    {
      "path": "/api/v1/search",
      "operationId": "searchItems"
    },
    {
      "path": "/api/v1/design-system.json",
      "operationId": "getDesignSystem"
    },
    {
      "path": "/api/v1/health",
      "operationId": "getHealth"
    },
    {
      "path": "/api/v1/registry.json",
      "operationId": "getRegistry"
    },
    {
      "path": "/api/v1/motions.json",
      "operationId": "listMotions"
    },
    {
      "path": "/api/v1/motions/{id}.json",
      "operationId": "getMotion"
    },
    {
      "path": "/api/v1/capabilities.json",
      "operationId": "getCapabilities"
    },
    {
      "path": "/api/v1/tools.json",
      "operationId": "getToolSchemas"
    },
    {
      "path": "/api/v1/items/{kind}/{id}.json",
      "operationId": "getItem"
    },
    {
      "path": "/api/v1/themes.json",
      "operationId": "listThemes"
    },
    {
      "path": "/api/v1/themes/{id}.json",
      "operationId": "getTheme"
    },
    {
      "path": "/api/v1/theme-plan/{id}",
      "operationId": "getThemeInstallPlan"
    },
    {
      "path": "/api/v1/theme-bundles/{id}/{profile}/{material}/{mode}.json",
      "operationId": "getThemeBundle"
    }
  ]
};
