// Generated from config/public-metadata.json by scripts/generate-site-metadata.mjs.
export const SITE_METADATA = {
  "schemaVersion": 1,
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
    "registry": "https://registry.npmjs.org/"
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
        "registry": "https://registry.npmjs.org/",
        "skillPath": "SKILL.md"
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
  }
};
export const SITE_ORIGIN = SITE_METADATA.site.origin;
export const MCP_URL = new URL(SITE_METADATA.routes.mcp, SITE_ORIGIN+'/').href;
export const INTEGRATION_VERSION = SITE_METADATA.versions.toolkit;
export const PROTOCOL_VERSIONS = SITE_METADATA.versions.mcpProtocols;
export const RATE_LIMIT_DEFAULTS = Object.freeze({...SITE_METADATA.rateLimit.limits,windowSeconds:SITE_METADATA.rateLimit.windowSeconds});
