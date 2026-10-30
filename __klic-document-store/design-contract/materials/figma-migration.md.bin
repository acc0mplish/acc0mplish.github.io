# Canonical material handoff

`bun scripts/generate-figma-material-manifest.mjs` regenerates `figma-manifest.json` from `createTokens('a', theme, {material})`. This is the default core baseline, without user customization or alternative profile selection. The inventory includes available primitives for all source-supported options; their presence does not select those options. JSON is deterministic and contains no remote IDs or timestamps.

| Collection | Modes | Ownership |
| --- | --- | --- |
| Primitive | Value | All literals, stable across all eight contexts |
| Brand | Light, Dark | Primitive aliases; invariant across materials |
| Semantic | Value | Brand aliases; invariant across all eight contexts |
| Component | Flat, Glass, Solid Glass, Liquid Glass | Semantic aliases; invariant across themes |

Reference adjacency is always Component → Semantic → Brand → Primitive. Material is a context, not an ownership layer. Aliases use canonical dot paths in `{ "alias": "klic.semantic.…" }`; the Figma importer resolves these names to actual variable IDs after creating or finding all variables. Slash names retain the entire canonical path, including `klic` and the layer. WEB code syntax follows the existing exporter rule: dots become hyphens and the result is wrapped as `var(--klic-…)`.

Colors retain source sRGB channels and alpha as Figma RGBA. Dimensions become FLOAT through rem × 16 using an explicit 16 CSS px reference root; this is a handoff conversion, not a claim that every browser root is 16px. Font weights are FLOAT. Font families are STRING with exact CSS identifiers `KlicPaperlogy`, `KlicPretendard`, and `KlicSpoqa`. Only Component variables receive visible role scopes; underlying collections use empty scopes. Effect scalars describe blur/shadow recipe inputs rather than a fabricated composite effect token.

The observed available Figma font list contains Geist, Inter and Noto Sans KR, but does not contain the three Klic families. Preserve existing fonts and load their exact existing font names before text edits. Do not bind unavailable family strings to existing text or claim matching family rendering. The variables are an exact CSS handoff, with this render limitation documented.

## Authorized migration boundary

Upsert canonical foundations while preserving existing IDs when names and types match. Rebind affected representative existing card, button, input, sidebar, modal and table families to Component leaves, retaining text, icons, layout and behavior. Add a material review page using existing component instances with the exact seven dimension contracts in `seven-dimensions.json`. Bind surface roles intentionally: card, chrome, overlay, field, dense and control. Dense content stays opaque. Native Figma glass refraction and CSS optics are distinct.

Existing legacy collections and pages outside the named representative families remain outside the migration scope. No blanket accessibility, optical parity, cross-browser or full-file migration claim follows from this manifest.

## Applied and verified — 2026-10-26

[Open the current editable review](https://www.figma.com/design/wpWaKSR8tiMo0y5FSUisrC?node-id=4161-213).

Four canonical collections contain 1,272 variables: Primitive 679, Brand 242, Semantic 243, Component 108. The foundation audit found no adjacent-reference, type, mode, picker-scope or WEB code-syntax violations. The review uses 32 top-level instances (40 including nested buttons), with eight independently resolved theme/material contexts. Live resolution confirms Light/Dark card alpha 1 / .72 / .92 / .64 and blur 0 / 16 / 12 / 24px respectively.

| Existing family | Main components inspected | Paint bindings updated | Material surfaces bound |
| --- | ---: | ---: | ---: |
| Card | 4 | 30 | 4 |
| Button and Icon Button | 360 | 930 | 12 |
| Input | 15 | 76 | 12 |
| Sidebar and subcomponents | 44 | 193 | 5 |
| Modal | 2 | 13 | 2 |
| Table and cells | 12 | 99 | 2 |

Main component IDs remain unchanged. The surface counts are intentionally scoped: primary actions, disabled/error/focus distinctions and dense content preserve their semantic roles. Existing geometry and fonts remain except explicitly bound Card/Modal padding and radius. The review is an editable comparison, not a screenshot flattened into the canvas.

Evidence in the source repository: `figma-state.json`, `figma-foundation-audit.json`, `figma-component-bindings.json`, `figma-review.json`, and `figma-review-audit.json`. These record actual IDs and observed coverage; they do not certify WCAG or all legacy screens.
