/** Public KLIC design guidance. These types describe metadata, not React component props. */
export type KlicKind = 'component' | 'block';
export type KlicDensity = 'compact' | 'normal' | 'relaxed';
export interface KlicTokenMapping { path: `klic.${string}`; purpose: string; cssVariable: `--klic-${string}`; cssProperty: string; value: string | null; chain: string[]; tailwind: string; }
export interface KlicTokenContext { heightFixture: 'a' | 'b'; mode: 'light' | 'dark'; density: KlicDensity; basis: 'static-example' | 'resolved-selection'; }
export interface KlicVariantSupportAxis { axis: 'intent' | 'appearance' | 'size' | 'density'; values: string[]; evidence: string; }
export interface KlicVariantSupport { status: 'specified' | 'partially-specified' | 'not-specified'; axes: KlicVariantSupportAxis[]; examples: string[]; note: string; }
export interface KlicDesignSystemRef {schemaVersion:'1.0';revision:string;definition:string;docs:string}
export interface KlicAdoptionPolicy {selection:string;evidence:string}
export interface KlicChangePolicy {scope:string;surfaces:string[];completion:string}
export interface KlicClassNamespace {prefix:string;role:string;usage:string;example:string}
export interface KlicVariantAxis {axis:string;label:string;values:string[];rule:string}
export interface KlicClassNamingPolicy {title:string;namespaces:KlicClassNamespace[];variantAxes:KlicVariantAxis[];tokenPrecedence:string;rules:string[];compatibility:string}
export interface KlicDataAttribute {name:string;role:string;values:string}
export interface KlicDataAttributePolicy {title:string;attributes:KlicDataAttribute[];extensions:string[];rules:string[]}
export interface KlicMotionTransition {component:string;from:string;to:string;effect:string}
export interface KlicMotionResponsibilityPolicy {title:string;transitions:KlicMotionTransition[];ownership:Record<string,string>;rules:string[]}
export interface KlicComponentContractPolicy {title:string;facets:string[];rules:string[]}
export interface KlicDiscoveryPolicy {title:string;detailLevels:('brief'|'compact'|'full')[];defaultDetail:'full';rules:string[]}
export interface KlicCustomizationPolicy {title:string;steps:('theme'|'composition'|'source')[];rules:string[]}
export interface KlicInteractionPolicy {title:string;rules:string[]}
export interface KlicConsumerEvaluationPolicy {title:string;tasks:string[];rules:string[]}
export interface KlicDesignDimension {id:string;title:string;tokenControl:string;structureControl:string;check:string;tokenPaths:string[];requirements:string[];sources:string[];checks:string[]}
export interface KlicPresetPolicy {kind:string;description:string;allowed:string;excluded:string[];precedence:string;validation:string;currentExample:string}
export interface KlicConflictRule {id:string;title:string;rule:string}
export interface KlicDesignProvenance {tokenLiteralOwnership:string;recipeBoundary:string;verification:string;motionCatalogBoundary:string}
export interface KlicDesignLinks {definition:string;architecture:string;docs:string;requirements:string}
export interface KlicDesignSystem {
 schemaVersion:'1.0';architectureSchemaVersion:number;date:string;scope:string;revision:string;
 namespace:'klic.';tokenLayers:['Primitive','Brand','Semantic','Component'];dimensions:KlicDesignDimension[];
 presetPolicy:KlicPresetPolicy;conflictResolution:KlicConflictRule[];provenance:KlicDesignProvenance;links:KlicDesignLinks;
 adoptionPolicy:KlicAdoptionPolicy;changePolicy:KlicChangePolicy;classNamingPolicy?:KlicClassNamingPolicy;dataAttributePolicy?:KlicDataAttributePolicy;motionResponsibilityPolicy?:KlicMotionResponsibilityPolicy;componentContractPolicy:KlicComponentContractPolicy;
 discoveryPolicy:KlicDiscoveryPolicy;customizationPolicy:KlicCustomizationPolicy;interactionPolicy:KlicInteractionPolicy;
 consumerEvaluationPolicy:KlicConsumerEvaluationPolicy;
}
export interface KlicNpmPackage {name:string;version:string;published:boolean;status:'source-ready'|'published';registry:string;runtime:string;exports:string[];skillPath:string;buildCommand:string;integrity?:string;installCommand?:string;cliCommand?:string;nodeCliCommand?:string}
export interface KlicDesignContract {
 delivery?:{type:'reference-library';npmPackagePublished:boolean;npmPackage?:KlicNpmPackage;scope:string;licenses:string};
 system: KlicDesignSystemRef;
 schemaVersion: '1.0'; scope: 'adoption-guidance'; implementation: 'planned' | 'native-html' | 'react-demo';
 tokenContext: KlicTokenContext; variantSupport: KlicVariantSupport;
 use: string[]; avoid: string[]; accessibility: string[]; density: Record<KlicDensity,string>;
 states: {name:string;condition:string;response:string}[];
 recovery: Record<'loading'|'empty'|'filtered'|'error',string>;
 tokenMapping: KlicTokenMapping[]; limitations: string[]; checklist: string[];
 exports: {design:string;contract:string;types:string}; prompt: string;
}
export interface KlicSearchInput {query?:string;kind?:KlicKind|'all';status?:'ready'|'planned'|'all';limit?:number;cursor?:string;token?:string;group?:string}
