export type KlicFieldKind = 'categorical' | 'ordinal' | 'quantitative' | 'temporal';
export type KlicChartMode = 'light' | 'dark';
export type KlicChartProfile = 'core' | 'studio' | 'data';
export type KlicChartInteraction = 'inspect' | 'select';
export type KlicChartScalar = string | number | boolean | null;
export interface KlicChartSpec {
  schemaVersion: '1.0';
  data: { rows: Array<Record<string, KlicChartScalar>> };
  geometry?: {
    type: 'FeatureCollection';
    features: Array<{
      type: 'Feature'; id: string; properties: Record<string, string | number | null>;
      geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: number[][][] | number[][][][] };
    }>;
  };
  fields?: Record<string, { kind: KlicFieldKind; label?: string; unit?: string; domain?: [string | number, string | number] }>;
  chart: { type: KlicChartTypeId; encodings: Record<string, string>; options?: Record<string, unknown> };
  display?: { title?: string; subtitle?: string; width?: number; height?: number; profile?: KlicChartProfile; mode?: KlicChartMode };
  interactions?: Array<{ type: KlicChartInteraction }>;
}
export interface KlicChartChannel { name: string; kind: KlicFieldKind; kinds?: readonly KlicFieldKind[]; required: boolean }
export interface KlicChartTypeDefinition {
  id: KlicChartTypeId; family: string; support: 'authorable'; title: { ko: string; en: string }; guide: { title: { ko: string; en: string }; useWhen: { ko: string; en: string }; avoidWhen: { ko: string; en: string }; takeaway: { ko: string; en: string } }; channels: readonly KlicChartChannel[];
  options?: Readonly<Record<string, unknown>>; interactions: readonly KlicChartInteraction[];
  keyboard: string; reducedMotion: string;
}
export type KlicChartTypeId =
  "bar" |
  "grouped-bar" |
  "stacked-bar" |
  "line" |
  "area" |
  "stacked-area" |
  "streamgraph" |
  "combo" |
  "scatter" |
  "bubble" |
  "connected-scatter" |
  "marginal" |
  "regression" |
  "calibration" |
  "lollipop" |
  "dumbbell" |
  "slope" |
  "bump" |
  "range-area" |
  "forecast-fan" |
  "candlestick" |
  "drawdown" |
  "bullet" |
  "pyramid" |
  "ranged-dot" |
  "histogram" |
  "density" |
  "ecdf" |
  "box-plot" |
  "violin" |
  "strip-plot" |
  "beeswarm" |
  "ridgeline" |
  "pie" |
  "donut" |
  "radial" |
  "rose" |
  "gauge" |
  "treemap" |
  "sunburst" |
  "kpi-card" |
  "waterfall" |
  "funnel" |
  "heatmap" |
  "correlation-matrix" |
  "cohort-heatmap" |
  "calendar-heatmap" |
  "gantt" |
  "state-timeline" |
  "sankey" |
  "network-graph" |
  "tree" |
  "parallel-coordinates" |
  "map" |
  "choropleth" |
  "sparkline" |
  "bar-table" |
  "radar" |
  "market-depth" |
  "orderbook";
export interface KlicChartError { path: string; code: string; message: string }
export interface KlicChartTable { caption: string; columns: string[]; rows: KlicChartScalar[][] }
export interface KlicCompiledChart {
  valid: true; schemaVersion: '1.0'; type: KlicChartTypeId; family: string;
  display: Required<Pick<NonNullable<KlicChartSpec['display']>, 'width' | 'height' | 'profile' | 'mode'>> & { title: string; subtitle: string };
  palette: { background: string; surface: string; text: string; muted: string; grid: string; series: string[] };
  plotData: { rows: Array<{ index: number; values: Record<string, KlicChartScalar>; tableValues: KlicChartScalar[] }>; shapes: unknown[]; markCount: number; sourceRowCount: number; renderedRowCount: number; omittedRowCount: number };
  table: KlicChartTable; diagnostics: string[]; interactions: KlicChartInteraction[]; keyboard: string; reducedMotion: string;
  summary: { title: string; type: string; rows: number; omittedRows: number; marks: number };
}
export interface KlicInvalidChart { valid: false; errors: KlicChartError[] }
export interface KlicChartBoardSpec { schemaVersion: '1.0'; title?: string; columns: 1 | 2 | 3; charts: KlicChartSpec[] }
export interface KlicCompiledChartBoard { valid: boolean; schemaVersion?: '1.0'; title?: string; columns?: number; charts: Array<KlicCompiledChart | KlicInvalidChart>; errors: KlicChartError[] }
export declare const KLIC_CHART_TYPES: Readonly<Record<KlicChartTypeId, KlicChartTypeDefinition>>;
export declare const KLIC_CHART_TYPE_IDS: readonly KlicChartTypeId[];
export declare const KLIC_CHART_SPEC_SCHEMA: Readonly<Record<string, unknown>>;
export declare const KLIC_CHART_BOARD_SPEC_SCHEMA: Readonly<Record<string, unknown>>;
export declare const KLIC_CHART_THEMES: Readonly<Record<string, unknown>>;
export declare const KLIC_CHART_INTERACTIONS: readonly { type: KlicChartInteraction; description: string; requires: readonly string[]; reset: string }[];
export declare const KLIC_CHART_EXAMPLE_TYPES: Readonly<Record<string, KlicChartTypeId>>;
export declare function validateKlicChart(spec: unknown): { valid: boolean; errors: KlicChartError[] };
export declare function compileKlicChart(spec: KlicChartSpec): KlicCompiledChart | KlicInvalidChart;
export declare function renderKlicChartSvg(compiled: KlicCompiledChart): string;
export declare function compileKlicChartBoard(board: KlicChartBoardSpec): KlicCompiledChartBoard;
export declare function renderKlicChartBoardSvg(board: KlicChartBoardSpec | KlicCompiledChartBoard): string;
