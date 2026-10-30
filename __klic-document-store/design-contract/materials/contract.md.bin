# KLIC material contract

Material selects context within the four adjacent layers. It adds no ownership layer. Supported IDs are `flat`, `glass`, `solid-glass`, and `liquid-glass`; missing or invalid values select `flat`. Labels are exported by the pure `materials.mjs` module.

## Canonical graph

For each role (`card`, `chrome`, `overlay`, `field`, `dense`, `control`) and property (`background`, `fallback`, `border`, `rim`, `shadow`, `blur`, `shadow-y`, `shadow-blur`):

`klic.component.surface.{role}.{property}` → `klic.semantic.material.{material}.{role}.{property}` → `klic.brand.material.{material}.{role}.{property}` → `klic.primitive.material.{material}.{role}.{light|dark}.{property}`.

Primitive owns immutable literals for all themes/materials. Brand Light/Dark selects theme; Semantic has one Value mode containing all material roles; Component Flat/Glass/Solid Glass/Liquid Glass selects material. Primitive uses Value. Inventory and Brand/Semantic alias shape do not change with material. Slash-separated Figma names map directly to these dot paths; CSS syntax is `var(--` plus dot path with dots replaced by hyphens plus `)`. Colors use srgb plus alpha; dimensions use rem. Shadows and blur recipes are CSS composition, with no added effect token type.

Existing paths remain unchanged. Flat introduces no blur, rim or shadow, and uses existing white/night-panel card values. The material recipe does not change spacing, density, font, geometry, focus, status meaning, keyboard order, or interaction behavior. Dense content remains opaque for every material. Transparent effects require an appropriate backdrop supplied by the host layout.

## Recipes and fallbacks

Use `materialStylesCSS()` with complete resolved token variables, a required `data-material` context, and an explicit `data-klic-surface` role. For example, `<div class="klic-preview" data-material="solid-glass" data-klic-surface="card">…</div>` applies the selected material to a card on the context root. A child surface can instead use `<section data-material="glass"><article data-klic-surface="card">…</article></section>`. Theme token maps must also be provided for the selected light/dark context. Recipes target only explicit roles; they never infer surfaces from generic background utilities. Native `@scope` boundaries stop outer material styling at a nested `data-material` context. Browsers without `@scope` retain original component styling. Existing preview isolation remains the supported theme boundary; arbitrary nested theme combinations are not a supported contract.

Unsupported backdrop filtering and `prefers-reduced-transparency: reduce` use opaque role fallback colors without blur or shadow. Forced colors use Canvas/CanvasText and retain browser focus/status behavior. Runtime support and assistive technology conformance require browser verification; generated CSS alone is not a conformance claim.

Glass uses translucent tint with blur. Solid Glass increases opacity for legibility. Liquid Glass is a minimal CSS optical approximation using tint, blur and rim lighting. It does not implement physical refraction, distortion, native Figma GLASS parity, or a runtime refraction toggle.

## Seven dimensions

Size/proportion; typography; color/contrast; layout/alignment; spacing/grouping; surface/depth; interaction/feedback. Material changes surface/depth and surface color treatment. The other dimensions retain their existing contracts. Reading/tab order, keyboard behavior, states, reduced motion and optical behavior remain component/recipe responsibilities rather than invented numeric tokens.

Role opacity is intentional: floating overlays are at least .96 opaque, fields at least .92, and dense content fully opaque. Card/chrome/control retain each preset's optical treatment. Material selectors exclude focus-visible/focus-within, aria-invalid, aria-selected and explicit open/checked/error states so material depth, border and background never override existing state recipes. State owners retain responsibility for their readable state surfaces. `klic.component.interaction.focus.color` directly aliases `klic.semantic.color.focus` for Component-layer Figma bindings.

CSS review correction: Flat emits only context variables and preserves each component's original background, border and shadow. Non-flat recipes use native `@scope ([data-material="…"]) to ([data-material])` boundaries, including surfaces on the context root. Hosts must provide an explicit material context. Browsers without native scope retain original component styling. All material backgrounds and blur persist during focus within containers. Only field/control border and shadow recipes have state guards; accessibility fallback backgrounds also remain persistent. This supersedes the earlier blanket state-exclusion description.
