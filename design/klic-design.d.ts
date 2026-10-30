/** Public KLIC design guidance. These types describe metadata, not React component props. */
export type KlicKind = 'component' | 'block';
export type KlicDensity = 'compact' | 'normal' | 'relaxed';
export interface KlicTokenMapping { path: `klic.${string}`; purpose: string; cssVariable: `--klic-${string}`; cssProperty: string; value: string | null; chain: string[]; tailwind: string; }
export interface KlicDesignSystemRef {schemaVersion:'1.0';revision:string;definition:string;docs:string}
export interface KlicAdoptionPolicy {selection:string;evidence:string}
export interface KlicChangePolicy {scope:string;surfaces:string[];completion:string}
export interface KlicDesignSystem {adoptionPolicy?:KlicAdoptionPolicy;changePolicy?:KlicChangePolicy;schemaVersion:'1.0';revision:string;namespace:'klic.';tokenLayers:['Primitive','Brand','Semantic','Component'];dimensions:{id:string;title:string;tokenControl:string;structureControl:string;check:string;tokenPaths:string[];requirements:string[];sources:string[];checks:string[]}[];presetPolicy:{kind:string;description:string;allowed:string;excluded:string[];precedence:string;validation:string;currentExample:string};conflictResolution:{id:string;title:string;rule:string}[];provenance:{tokenLiteralOwnership:string;recipeBoundary:string;verification:string};links:{definition:string;architecture:string;docs:string;requirements:string}}
export interface KlicNpmPackage {name:string;version:string;published:boolean;status:'source-ready'|'published';registry:string;runtime:string;exports:string[];skillPath:string;buildCommand:string;integrity?:string;installCommand?:string;cliCommand?:string;nodeCliCommand?:string}
export interface KlicDesignContract {
 delivery?:{type:'reference-library';npmPackagePublished:boolean;npmPackage?:KlicNpmPackage;scope:string;licenses:string};
 system: KlicDesignSystemRef;
 schemaVersion: '1.0'; scope: 'adoption-guidance'; implementation: 'planned' | 'native-html' | 'react-demo';
 use: string[]; avoid: string[]; accessibility: string[]; density: Record<KlicDensity,string>;
 states: {name:string;condition:string;response:string}[];
 recovery: Record<'loading'|'empty'|'filtered'|'error',string>;
 tokenMapping: KlicTokenMapping[]; limitations: string[]; checklist: string[];
 exports: {design:string;contract:string;types:string}; prompt: string;
}
export interface KlicSearchInput {query?:string;kind?:KlicKind|'all';status?:'ready'|'planned'|'all';limit?:number;cursor?:string;token?:string;group?:string}
