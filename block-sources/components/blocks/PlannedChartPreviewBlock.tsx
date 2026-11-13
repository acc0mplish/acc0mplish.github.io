import React, { useState } from 'react';
import { ChartPlot, ChartShell, ChartSvg } from '../charts/ChartFrame';

type Family = 'sankey' | 'slope' | 'radial' | 'sparkline' | 'column' | 'series' | 'pie' | 'funnel' | 'radar' | 'polar';
type Density = 'compact' | 'normal' | 'relaxed';
type Preset = { title: string; description: string; family: Family };

const PRESETS: Record<string, Preset> = {
  'cloud-cost-sankey': { title: '클라우드 비용 생키', description: 'AWS·GCP 리전 비용이 프로덕션 서비스와 테넌트로 배분되는 흐름입니다.', family: 'sankey' },
  'traffic-attribution-sankey': { title: '채널 유입 기여도', description: '오가닉 검색·유료 광고·레퍼럴에서 가입 경로와 요금제로 이어지는 기여도 흐름입니다.', family: 'sankey' },
  'nps-cohort-slope': { title: '분기별 NPS 변동', description: '산업군별 도입 초기와 1년 후 NPS 순위 및 점수 변화를 비교합니다.', family: 'slope' },
  'conversion-tier-slope': { title: '티어별 전환율 비교', description: 'Free·Pro·Enterprise 요금제의 개편 전후 유료 전환율을 비교합니다.', family: 'slope' },
  'latency-region-slope': { title: '리전별 응답 지연', description: '엣지 캐싱 적용 전후 12개 글로벌 리전의 p95 지연 순위를 비교합니다.', family: 'slope' },
  'quota-attainment-radial': { title: '영업 할당량 달성 링', description: '북미·APAC·EMEA 본부의 분기 수주액을 목표 금액과 비교합니다.', family: 'radial' },
  'cluster-cpu-radial': { title: '노드 리소스 포화도', description: 'CPU·메모리·IOPS 사용량을 배정된 클러스터 용량과 비교합니다.', family: 'radial' },
  'security-posture-radial': { title: '보안 준수율 게이지', description: 'SOC 2·ISO 27001·GDPR 통제 항목의 점검 통과율을 비교합니다.', family: 'radial' },
  'live-mrr-sparkline': { title: '실시간 MRR 추이', description: '시간대별 반복 매출 샘플을 인라인 미니 차트로 보여줍니다.', family: 'sparkline' },
  'kpi-mini-trend': { title: 'KPI 미니 트렌드', description: 'KPI 카드 안에 배치할 주간 전환율 또는 신규 계정 마이크로 바입니다.', family: 'sparkline' },
  'latency-sparkline': { title: 'API 응답 지연 추이', description: '선택한 엔드포인트의 p95 응답 시간을 짧은 구간으로 비교합니다.', family: 'sparkline' },
  'error-rate-sparkline': { title: '5xx 에러율 파형', description: '에러율이 설정한 경고 기준을 넘은 구간을 강조합니다.', family: 'sparkline' },
  'active-session-sparkline': { title: '동시 접속 트렌드', description: '고정된 시간별 활성 세션 표본을 컴팩트 라인으로 보여줍니다.', family: 'sparkline' },
  'cohort-retention-bar': { title: '코호트 잔존율 컬럼', description: '가입 월별 사용자 코호트의 가입 후 12개월 잔존율을 비교합니다.', family: 'column' },
  'latency-percentiles-line': { title: 'P95/P99 지연율 라인', description: '같은 시간 구간에서 수집한 p95와 p99 응답 지연을 비교합니다.', family: 'series' },
  'net-revenue-retention-area': { title: '순매출 유지율 곡선', description: '기준 매출 유지율에 확장 매출을 더하고 이탈 매출을 빼서 NRR을 계산합니다.', family: 'series' },
  'token-throughput-line': { title: 'API 처리량 라인', description: '초당 요청 수와 캐시 적중률을 각자 명시한 축으로 비교합니다.', family: 'series' },
  'concurrent-connections-area': { title: '웹소켓 동시 연결', description: '리전별 동시 스트리밍 세션과 전체 합계를 누적 영역으로 보여줍니다.', family: 'series' },
  'customer-segment-donut': { title: '고객 세그먼트 도넛', description: 'Enterprise·SMB·Startup 고객 계정 수와 전체 대비 비중입니다.', family: 'pie' },
  'expense-allocation-pie': { title: '판관비 지출 파이', description: 'R&D·마케팅·일반관리·영업에 배정된 월간 비용 구성입니다.', family: 'pie' },
  'ticket-severity-pie': { title: '장애 심각도 분포', description: '월간 장애 티켓 건수와 심각도별 평균 복구 시간입니다.', family: 'pie' },
  'churn-retention-funnel': { title: '이탈 방지 리텐션', description: '만료 예정 계정에서 접촉, 갱신 논의, 실제 갱신으로 이어지는 수입니다.', family: 'funnel' },
  'enterprise-poc-funnel': { title: '기술 검증 전환 퍼넬', description: '보안 검토부터 파일럿 성공과 본계약 체결까지의 단계별 계정 수입니다.', family: 'funnel' },
  'dora-metrics-radar': { title: 'DORA 역량 레이더', description: '배포 빈도·리드 타임·변경 실패율·복구 시간·가용성의 정규화 점수입니다.', family: 'radar' },
  'incident-response-polar': { title: '장애 대응 폴라', description: '평일 또는 주말 24시간 동안의 시간대별 온콜 페이지 건수입니다.', family: 'polar' },
  'system-resilience-radar': { title: '아키텍처 복원력', description: '장애 격리·자동 복구 등 복원력 시나리오별 점수를 비교합니다.', family: 'radar' },
};

const C = {
  blue: 'var(--klic-component-block-color-accent)',
  text: 'var(--klic-component-block-color-text)',
  muted: 'var(--klic-component-block-color-muted)',
  border: 'var(--klic-component-block-color-border)',
  panel: 'var(--klic-component-block-color-panel)',
  soft: 'var(--klic-component-block-color-soft)',
  warning: 'var(--klic-component-block-color-warning)',
  danger: 'var(--klic-component-block-color-danger)',
};

const DENSITY_SPACE: Record<Density, number> = { compact: 0.78, normal: 1, relaxed: 1.18 };
const SERIES_OPACITY = [1, 0.72, 0.5, 0.34, 0.22];
const SERIES_COLOR = [C.blue, C.text, C.muted, C.warning, C.danger];

type Option = { value: string; label: string };
function SelectControl({ label, value, options, onChange }: { label: string; value: string; options: Option[]; onChange: (value: string) => void }) {
  return <label>{label}<select value={value} onChange={(event) => onChange(event.currentTarget.value)}>{options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label>;
}

function Legend({ items }: { items: { label: string; color: string; opacity?: number }[] }) {
  return <ul className="kc-chart-legend">{items.map((item) => <li key={item.label}><span aria-hidden="true" style={{ background: item.color, opacity: item.opacity ?? 1 }} />{item.label}</li>)}</ul>;
}

function LegendButton({ label, selected, onClick, color = C.blue }: { label: string; selected: boolean; onClick: () => void; color?: string }) {
  return <button type="button" aria-pressed={selected} onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid var(--klic-component-block-color-border)', borderColor: selected ? C.blue : C.border, borderRadius: 6, padding: '5px 8px', background: selected ? C.soft : C.panel, color: selected ? C.blue : C.text, font: 'inherit', cursor: 'pointer' }}><span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 2, background: color }} />{label}</button>;
}

function fmt(value: number, digits = 0) {
  return new Intl.NumberFormat('ko-KR', { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}
function pct(value: number, digits = 1) { return fmt(value, digits) + '%'; }
function clamp(value: number, min: number, max: number) { return Math.max(min, Math.min(max, value)); }
function scaleY(value: number, min: number, max: number, top: number, bottom: number) {
  const span = max === min ? 1 : max - min;
  return bottom - ((value - min) / span) * (bottom - top);
}
type Point = { x: number; y: number };
function linePath(points: Point[]) {
  return points.map((point, index) => (index === 0 ? 'M' : 'L') + point.x.toFixed(1) + ' ' + point.y.toFixed(1)).join(' ');
}
function polygonPath(points: Point[]) {
  return points.length ? linePath(points) + ' Z' : '';
}
function valuePoints(values: number[], x0: number, x1: number, y0: number, y1: number, min: number, max: number): Point[] {
  return values.map((value, index) => ({
    x: x0 + (values.length < 2 ? 0 : (index / (values.length - 1)) * (x1 - x0)),
    y: scaleY(value, min, max, y0, y1),
  }));
}
function metric(value: number, digits = 0) { return fmt(value, digits); }

function Shell({ preset, controls, metrics, children, footnote }: { preset: Preset; controls?: React.ReactNode; metrics?: { label: string; value: React.ReactNode }[]; children: React.ReactNode; footnote?: React.ReactNode }) {
  return <ChartShell title={preset.title} subtitle={preset.description} tag="고정 샘플" controls={controls} metrics={metrics} footnote={footnote}>{children}</ChartShell>;
}

type FlowPath = { source: string; middle: string; target: string; value: number };
const FLOWS: Record<string, { unit: string; sources: string[]; paths: FlowPath[] }> = {
  'cloud-cost-sankey': {
    unit: '월간 비용 · 천 달러',
    sources: ['AWS us-east-1', 'AWS eu-west-1', 'GCP asia-east1'],
    paths: [
      { source: 'AWS us-east-1', middle: 'API 플랫폼', target: 'Core 테넌트', value: 26 },
      { source: 'AWS us-east-1', middle: 'API 플랫폼', target: 'Commerce 테넌트', value: 20 },
      { source: 'AWS us-east-1', middle: '데이터 플랫폼', target: 'Analytics 테넌트', value: 16 },
      { source: 'AWS us-east-1', middle: '데이터 플랫폼', target: 'Shared 테넌트', value: 4 },
      { source: 'AWS us-east-1', middle: '검색 클러스터', target: 'Analytics 테넌트', value: 10 },
      { source: 'AWS us-east-1', middle: '검색 클러스터', target: 'Shared 테넌트', value: 4 },
      { source: 'AWS eu-west-1', middle: 'API 플랫폼', target: 'Core 테넌트', value: 10 },
      { source: 'AWS eu-west-1', middle: '검색 클러스터', target: 'Analytics 테넌트', value: 8 },
      { source: 'AWS eu-west-1', middle: '결제 서비스', target: 'Commerce 테넌트', value: 8 },
      { source: 'GCP asia-east1', middle: 'API 플랫폼', target: 'Core 테넌트', value: 10 },
      { source: 'GCP asia-east1', middle: '데이터 플랫폼', target: 'Analytics 테넌트', value: 4 },
      { source: 'GCP asia-east1', middle: '결제 서비스', target: 'Commerce 테넌트', value: 6 },
      { source: 'GCP asia-east1', middle: '결제 서비스', target: 'Shared 테넌트', value: 2 },
    ],
  },
  'traffic-attribution-sankey': {
    unit: '가입 전환 수',
    sources: ['오가닉 검색', '유료 광고', '레퍼럴'],
    paths: [
      { source: '오가닉 검색', middle: '제품 검색', target: 'Free 가입', value: 300 },
      { source: '오가닉 검색', middle: '제품 검색', target: 'Team 가입', value: 180 },
      { source: '오가닉 검색', middle: '문서 방문', target: 'Team 가입', value: 100 },
      { source: '오가닉 검색', middle: '문서 방문', target: 'Business 가입', value: 80 },
      { source: '유료 광고', middle: '가격 비교', target: 'Free 가입', value: 180 },
      { source: '유료 광고', middle: '가격 비교', target: 'Team 가입', value: 220 },
      { source: '유료 광고', middle: '제품 검색', target: 'Free 가입', value: 120 },
      { source: '유료 광고', middle: '제품 검색', target: 'Team 가입', value: 80 },
      { source: '레퍼럴', middle: '파트너 소개', target: 'Team 가입', value: 160 },
      { source: '레퍼럴', middle: '파트너 소개', target: 'Business 가입', value: 140 },
      { source: '레퍼럴', middle: '문서 방문', target: 'Team 가입', value: 100 },
      { source: '레퍼럴', middle: '문서 방문', target: 'Business 가입', value: 120 },
    ],
  },
};

type Edge = { source: string; target: string; value: number; fromY: number; toY: number };
function aggregateEdges(paths: FlowPath[], from: 'source' | 'middle', to: 'middle' | 'target') {
  const values = new Map<string, number>();
  for (const path of paths) {
    const key = path[from] + '\u0000' + path[to];
    values.set(key, (values.get(key) || 0) + path.value);
  }
  return Array.from(values.entries()).map(([key, value]) => {
    const [source, target] = key.split('\u0000');
    return { source, target, value };
  });
}
function SankeyRenderer({ id, preset }: { id: string; preset: Preset }) {
  const data = FLOWS[id];
  const [sourceFilter, setSourceFilter] = useState('all');
  const paths = data.paths.filter((path) => sourceFilter === 'all' || path.source === sourceFilter);
  const total = paths.reduce((sum, path) => sum + path.value, 0);
  const sourceNames = Array.from(new Set(paths.map((path) => path.source)));
  const middleNames = Array.from(new Set(paths.map((path) => path.middle)));
  const targetNames = Array.from(new Set(paths.map((path) => path.target)));
  const maxNodes = Math.max(sourceNames.length, middleNames.length, targetNames.length);
  const plotTop = 36;
  const plotHeight = 252;
  const scale = (plotHeight - Math.max(0, maxNodes - 1) * 12) / Math.max(1, total);
  const totals = (nodes: string[], key: 'source' | 'middle' | 'target') => new Map(nodes.map((name) => [name, paths.filter((path) => path[key] === name).reduce((sum, path) => sum + path.value, 0)]));
  const placeNodes = (nodes: string[], values: Map<string, number>) => {
    let offset = 0;
    return new Map(nodes.map((name) => {
      const height = (values.get(name) || 0) * scale;
      const node = { y: plotTop + offset, height };
      offset += height + 12;
      return [name, node] as const;
    }));
  };
  const sourceNodes = placeNodes(sourceNames, totals(sourceNames, 'source'));
  const middleNodes = placeNodes(middleNames, totals(middleNames, 'middle'));
  const targetNodes = placeNodes(targetNames, totals(targetNames, 'target'));
  const placeEdges = (edges: { source: string; target: string; value: number }[], left: Map<string, { y: number; height: number }>, right: Map<string, { y: number; height: number }>): Edge[] => {
    const leftUsed = new Map<string, number>();
    const rightUsed = new Map<string, number>();
    return edges.map((edge) => {
      const height = edge.value * scale;
      const fromY = (left.get(edge.source)?.y || 0) + (leftUsed.get(edge.source) || 0);
      const toY = (right.get(edge.target)?.y || 0) + (rightUsed.get(edge.target) || 0);
      leftUsed.set(edge.source, (leftUsed.get(edge.source) || 0) + height);
      rightUsed.set(edge.target, (rightUsed.get(edge.target) || 0) + height);
      return { ...edge, fromY, toY };
    });
  };
  const firstEdges = placeEdges(aggregateEdges(paths, 'source', 'middle'), sourceNodes, middleNodes);
  const secondEdges = placeEdges(aggregateEdges(paths, 'middle', 'target'), middleNodes, targetNodes);
  const band = (x1: number, y1: number, h1: number, x2: number, y2: number, h2: number) => {
    const bend = (x2 - x1) * 0.48;
    return 'M' + x1 + ' ' + y1 + ' C' + (x1 + bend) + ' ' + y1 + ' ' + (x2 - bend) + ' ' + y2 + ' ' + x2 + ' ' + y2 +
      ' L' + x2 + ' ' + (y2 + h2) + ' C' + (x2 - bend) + ' ' + (y2 + h2) + ' ' + (x1 + bend) + ' ' + (y1 + h1) + ' ' + x1 + ' ' + (y1 + h1) + ' Z';
  };
  const isCost = id === 'cloud-cost-sankey';
  const fmtFlow = (value: number) => isCost ? '$' + fmt(value) + 'k' : fmt(value) + '회';
  const controls = <SelectControl label={isCost ? '원가 리전' : '유입 채널'} value={sourceFilter} onChange={setSourceFilter} options={[{ value: 'all', label: '전체' }, ...data.sources.map((name) => ({ value: name, label: name }))]} />;
  return <Shell preset={preset} controls={controls} metrics={[{ label: isCost ? '배분 비용 합계' : '기여 가입 수', value: fmtFlow(total) }, { label: '경로 수', value: fmt(paths.length) }]} footnote="예시 집계입니다. 필터는 선택한 원천의 모든 후속 흐름에 적용됩니다.">
    <ChartPlot minWidth={760}><ChartSvg label={preset.title + '의 원천·서비스·대상 흐름'} width={800} height={330}>
      <text x="145" y="18" textAnchor="middle" fill={C.muted} fontSize="12">원천</text>
      <text x="396" y="18" textAnchor="middle" fill={C.muted} fontSize="12">{isCost ? '서비스' : '전환 경로'}</text>
      <text x="642" y="18" textAnchor="middle" fill={C.muted} fontSize="12">{isCost ? '테넌트' : '가입 요금제'}</text>
      {firstEdges.map((edge, index) => <path key={'a' + index} d={band(158, edge.fromY, edge.value * scale, 390, edge.toY, edge.value * scale)} fill={C.blue} opacity={0.15 + (index % 3) * 0.07}><title>{edge.source} → {edge.target}: {fmtFlow(edge.value)}</title></path>)}
      {secondEdges.map((edge, index) => <path key={'b' + index} d={band(403, edge.fromY, edge.value * scale, 628, edge.toY, edge.value * scale)} fill={C.blue} opacity={0.16 + (index % 3) * 0.08}><title>{edge.source} → {edge.target}: {fmtFlow(edge.value)}</title></path>)}
      {sourceNames.map((name) => { const node = sourceNodes.get(name)!; return <g key={name}><rect x="145" y={node.y} width="13" height={Math.max(2, node.height)} rx="3" fill={C.blue} /><text x="136" y={node.y + node.height / 2 + 4} textAnchor="end" fill={C.text} fontSize="11">{name}</text><text x="139" y={node.y + node.height / 2 + 18} textAnchor="end" fill={C.muted} fontSize="9">{fmtFlow(totals(sourceNames, 'source').get(name) || 0)}</text></g>; })}
      {middleNames.map((name) => { const node = middleNodes.get(name)!; return <g key={name}><rect x="390" y={node.y} width="13" height={Math.max(2, node.height)} rx="3" fill={C.blue} opacity="0.82" /><text x="411" y={node.y + node.height / 2 + 4} fill={C.text} fontSize="10">{name}</text></g>; })}
      {targetNames.map((name) => { const node = targetNodes.get(name)!; return <g key={name}><rect x="628" y={node.y} width="13" height={Math.max(2, node.height)} rx="3" fill={C.blue} /><text x="650" y={node.y + node.height / 2 + 4} fill={C.text} fontSize="10">{name}</text><text x="650" y={node.y + node.height / 2 + 17} fill={C.muted} fontSize="9">{fmtFlow(totals(targetNames, 'target').get(name) || 0)}</text></g>; })}
    </ChartSvg></ChartPlot>
  </Shell>;
}

type SlopeDatum = { label: string; before: number; after: number };
const SLOPES: Record<string, { unit: string; beforeLabel: string; afterLabel: string; lowerIsBetter?: boolean; rankDefault?: boolean; data: SlopeDatum[] }> = {
  'nps-cohort-slope': { unit: 'pt', beforeLabel: '도입 초기', afterLabel: '1년 후', rankDefault: true, data: [
    { label: 'SaaS', before: -12, after: 14 }, { label: '금융', before: 38, after: 46 }, { label: '이커머스', before: 55, after: 62 }, { label: '헬스케어', before: 12, after: 23 }, { label: '제조', before: 28, after: 21 },
  ] },
  'conversion-tier-slope': { unit: '%', beforeLabel: '개편 전', afterLabel: '개편 후', data: [
    { label: 'Free', before: 4.8, after: 6.1 }, { label: 'Pro', before: 9.4, after: 12.8 }, { label: 'Enterprise', before: 19.1, after: 18.4 },
  ] },
  'latency-region-slope': { unit: 'ms p95', beforeLabel: '캐싱 전', afterLabel: '캐싱 후', lowerIsBetter: true, rankDefault: true, data: [
    { label: 'us-east-1', before: 126, after: 58 }, { label: 'us-west-2', before: 148, after: 62 }, { label: 'ca-central-1', before: 164, after: 70 },
    { label: 'sa-east-1', before: 224, after: 110 }, { label: 'eu-west-1', before: 94, after: 47 }, { label: 'eu-central-1', before: 112, after: 51 },
    { label: 'eu-north-1', before: 128, after: 55 }, { label: 'ap-northeast-1', before: 182, after: 77 }, { label: 'ap-northeast-2', before: 196, after: 82 },
    { label: 'ap-southeast-1', before: 172, after: 75 }, { label: 'ap-south-1', before: 218, after: 104 }, { label: 'ap-southeast-2', before: 206, after: 91 },
  ] },
};
function SlopeRenderer({ id, preset }: { id: string; preset: Preset }) {
  const config = SLOPES[id];
  const [view, setView] = useState(config.rankDefault ? 'rank' : 'value');
  const [sort, setSort] = useState('after');
  const [highlight, setHighlight] = useState('all');
  const sorted = [...config.data].sort((a, b) => sort === 'change'
    ? Math.abs(b.after - b.before) - Math.abs(a.after - a.before)
    : sort === 'before'
      ? (config.lowerIsBetter ? a.before - b.before : b.before - a.before)
      : (config.lowerIsBetter ? a.after - b.after : b.after - a.after));
  const minValue = Math.min(...config.data.flatMap((item) => [item.before, item.after]));
  const maxValue = Math.max(...config.data.flatMap((item) => [item.before, item.after]));
  const min = minValue === maxValue ? minValue - 1 : minValue - (maxValue - minValue) * 0.12;
  const max = minValue === maxValue ? maxValue + 1 : maxValue + (maxValue - minValue) * 0.12;
  const beforeRank = new Map([...config.data].sort((a, b) => config.lowerIsBetter ? a.before - b.before : b.before - a.before).map((item, index) => [item.label, index]));
  const afterRank = new Map([...config.data].sort((a, b) => config.lowerIsBetter ? a.after - b.after : b.after - a.after).map((item, index) => [item.label, index]));
  const top = 32;
  const bottom = 276;
  const getY = (item: SlopeDatum, side: 'before' | 'after') => view === 'rank'
    ? top + ((side === 'before' ? beforeRank.get(item.label)! : afterRank.get(item.label)!) / Math.max(1, config.data.length - 1)) * (bottom - top)
    : scaleY(item[side], min, max, top, bottom);
  const valueText = (value: number) => config.unit === '%' ? pct(value) : config.unit === 'pt' ? (value > 0 ? '+' : '') + fmt(value) + 'pt' : fmt(value) + 'ms';
  const controls = <>
    <SelectControl label="세로축" value={view} onChange={setView} options={[{ value: 'rank', label: '순위' }, { value: 'value', label: '측정값' }]} />
    <SelectControl label="정렬" value={sort} onChange={setSort} options={[{ value: 'after', label: config.afterLabel + ' 기준' }, { value: 'before', label: config.beforeLabel + ' 기준' }, { value: 'change', label: '변화 폭' }]} />
    <SelectControl label="강조 항목" value={highlight} onChange={setHighlight} options={[{ value: 'all', label: '전체' }, ...config.data.map((item) => ({ value: item.label, label: item.label }))]} />
  </>;
  return <Shell preset={preset} controls={controls} metrics={[{ label: '비교 항목', value: fmt(config.data.length) }, { label: '축 단위', value: config.unit }]} footnote={id === 'nps-cohort-slope' ? 'NPS는 응답자 추천 비율에서 비추천 비율을 뺀 점수입니다. 값은 −100~100 범위입니다.' : '점과 선은 고정된 예시 측정값입니다. 순위 보기는 해당 시점의 정렬 순서만 나타냅니다.'}>
    <ChartPlot minWidth={760}><ChartSvg label={preset.title + ' 비교'} width={800} height={320}>
      {[0, 1, 2, 3, 4].map((tick) => { const y = top + (tick / 4) * (bottom - top); return <line key={tick} x1="242" x2="558" y1={y} y2={y} stroke={C.border} strokeDasharray="3 5" />; })}
      <text x="270" y="302" textAnchor="middle" fill={C.muted} fontSize="11">{config.beforeLabel}</text>
      <text x="530" y="302" textAnchor="middle" fill={C.muted} fontSize="11">{config.afterLabel}</text>
      {sorted.map((item, index) => {
        const y1 = getY(item, 'before');
        const y2 = getY(item, 'after');
        const active = highlight === 'all' || highlight === item.label;
        const stroke = active ? SERIES_COLOR[index % SERIES_COLOR.length] : C.border;
        return <g key={item.label} opacity={active ? 1 : 0.16}>
          <path d={'M270 ' + y1.toFixed(1) + ' C360 ' + y1.toFixed(1) + ' 440 ' + y2.toFixed(1) + ' 530 ' + y2.toFixed(1)} fill="none" stroke={stroke} strokeWidth={highlight === item.label ? 3.5 : 2} />
          <circle cx="270" cy={y1} r="4" fill={stroke} /><circle cx="530" cy={y2} r="4" fill={stroke} />
          <text x="22" y={y1 + 4} fill={C.text} fontSize="10">{item.label}</text>
          <text x="250" y={y1 + 4} textAnchor="end" fill={C.muted} fontSize="9">{valueText(item.before)}</text>
          <text x="550" y={y2 + 4} fill={C.muted} fontSize="9">{valueText(item.after)}</text>
          <text x="578" y={y2 + 4} fill={C.text} fontSize="10">{item.label}</text>
        </g>;
      })}
    </ChartSvg></ChartPlot>
  </Shell>;
}

type GaugeDatum = { label: string; value: number; amount: string; note: string; warning?: boolean };
const GAUGES: Record<string, GaugeDatum[]> = {
  'quota-attainment-radial': [
    { label: '북미', value: 78, amount: '$4.68M / $6.00M', note: '수주 목표', warning: false },
    { label: 'APAC', value: 92, amount: '$3.22M / $3.50M', note: '수주 목표', warning: false },
    { label: 'EMEA', value: 64, amount: '$2.56M / $4.00M', note: '수주 목표', warning: true },
  ],
  'cluster-cpu-radial': [
    { label: 'CPU', value: 72, amount: '576 / 800 vCPU', note: '배정 용량', warning: false },
    { label: '메모리', value: 71.25, amount: '2,280 / 3,200 GiB', note: '할당 용량', warning: false },
    { label: 'IOPS', value: 60, amount: '54 / 90 kIOPS', note: '프로비저닝 용량', warning: false },
  ],
  'security-posture-radial': [
    { label: 'SOC 2', value: 87.5, amount: '42 / 48 통제', note: '점검 통과', warning: false },
    { label: 'ISO 27001', value: 82.5, amount: '33 / 40 통제', note: '점검 통과', warning: true },
    { label: 'GDPR', value: 90.625, amount: '29 / 32 통제', note: '점검 통과', warning: false },
  ],
};
function RadialRenderer({ id, preset }: { id: string; preset: Preset }) {
  const data = GAUGES[id];
  const [focus, setFocus] = useState('all');
  const focused = focus === 'all' ? data : data.filter((item) => item.label === focus);
  const selected = focused.length === 1 ? focused[0] : null;
  const rings = selected ? [{ item: selected, radius: 98, stroke: 18 }] : focused.map((item, index) => ({ item, radius: 104 - index * 29, stroke: 15 }));
  const controls = <SelectControl label="강조할 지표" value={focus} onChange={setFocus} options={[{ value: 'all', label: '전체 지표' }, ...data.map((item) => ({ value: item.label, label: item.label }))]} />;
  return <Shell preset={preset} controls={controls} metrics={[{ label: selected ? selected.label : '표시 지표', value: selected ? pct(selected.value) : fmt(data.length) + '개' }]} footnote={id === 'cluster-cpu-radial' ? '사용률은 사용량 ÷ 해당 리소스의 배정 용량으로 계산했습니다.' : id === 'security-posture-radial' ? '통과율은 통과한 통제 수 ÷ 평가 대상 통제 수입니다.' : '달성률은 누적 수주액 ÷ 분기 목표 금액입니다.'}>
    <ChartPlot minWidth={680}><ChartSvg label={preset.title + ' 비율 게이지'} width={760} height={340}>
      {rings.map(({ item, radius, stroke }) => {
        const circumference = Math.PI * 2 * radius;
        const color = item.warning ? C.warning : C.blue;
        return <g key={item.label} transform="rotate(-90 170 170">
          <circle cx="170" cy="170" r={radius} fill="none" stroke={C.border} strokeWidth={stroke} />
          <circle cx="170" cy="170" r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - clamp(item.value, 0, 100) / 100)} />
        </g>;
      })}
      <text x="170" y="164" textAnchor="middle" fill={C.text} fontSize={selected ? '25' : '19'} fontWeight="650">{selected ? pct(selected.value) : '3 지표'}</text>
      <text x="170" y="186" textAnchor="middle" fill={C.muted} fontSize="11">{selected ? selected.label : '전체 비교'}</text>
      {focused.map((item, index) => {
        const y = selected ? 100 : 76 + index * 76;
        return <g key={item.label}>
          <circle cx="390" cy={y - 4} r="5" fill={item.warning ? C.warning : C.blue} />
          <text x="406" y={y} fill={C.text} fontSize="14" fontWeight="600">{item.label} · {pct(item.value)}</text>
          <text x="406" y={y + 21} fill={C.muted} fontSize="11">{item.amount}</text>
          <text x="406" y={y + 38} fill={C.muted} fontSize="10">{item.note}</text>
        </g>;
      })}
    </ChartSvg></ChartPlot>
  </Shell>;
}

const HOURS = Array.from({ length: 24 }, (_, index) => (index + 1) + ':00');
type SparkDatum = { unit: string; values: number[]; digits?: number; threshold?: number; title: string; kind?: 'line' | 'bar'; period?: boolean };
const SPARK_BASE: Record<string, SparkDatum> = {
  'live-mrr-sparkline': { title: '시간대별 반복 매출', unit: '$K', digits: 1, period: true, values: [154.2,154.3,154.4,154.2,154.7,154.8,155.1,155.0,155.4,155.7,155.6,155.9,156.1,155.8,156.3,156.7,156.5,156.8,157.1,157.0,157.4,157.8,157.6,158.2] },
  'latency-sparkline': { title: 'API p95 지연', unit: 'ms', period: true, values: [92,88,94,102,98,91,86,89,95,108,104,97,92,90,88,96,101,94,87,83,89,93,86,82] },
  'error-rate-sparkline': { title: 'HTTP 5xx 비율', unit: '%', digits: 2, threshold: 0.12, period: true, values: [0.05,0.06,0.07,0.06,0.08,0.09,0.12,0.17,0.15,0.11,0.08,0.07,0.06,0.09,0.13,0.16,0.12,0.10,0.08,0.06,0.05,0.07,0.09,0.06] },
  'active-session-sparkline': { title: '활성 세션 수', unit: '명', period: true, values: [18400,17600,16900,16400,17100,18800,22100,25800,28600,30200,29400,28100,27600,28900,31200,32800,34100,33600,32100,30900,29800,27400,24600,21800] },
};
const LATENCY_ENDPOINTS: Record<string, number[]> = {
  '/checkout': [142,138,146,151,143,139,134,148,155,149,145,141,137,133,139,147,153,146,138,134,129,135,141,132],
  '/search': [84,82,88,91,86,79,77,81,90,95,89,84,80,78,76,83,86,82,78,75,72,77,81,74],
  '/auth': [61,63,65,70,67,62,60,64,72,75,68,65,62,59,58,63,69,66,61,57,55,60,64,58],
};
const KPI_DATA: Record<string, { unit: string; digits: number; values: number[] }> = {
  '전환율': { unit: '%', digits: 1, values: [4.2,4.5,4.4,4.8,5.1,4.9,5.4] },
  '신규 계정': { unit: '개', digits: 0, values: [116,124,121,138,144,151,163] },
};
function SparkRenderer({ id, preset }: { id: string; preset: Preset }) {
  const [period, setPeriod] = useState('24');
  const [endpoint, setEndpoint] = useState('/checkout');
  const [kpi, setKpi] = useState('전환율');
  let title = '';
  let unit = '';
  let digits = 0;
  let values: number[] = [];
  let threshold: number | undefined;
  let bar = false;
  if (id === 'kpi-mini-trend') {
    title = '주간 KPI 표본';
    unit = KPI_DATA[kpi].unit;
    digits = KPI_DATA[kpi].digits;
    values = KPI_DATA[kpi].values;
    bar = true;
  } else if (id === 'latency-sparkline') {
    title = endpoint + ' p95 지연';
    unit = SPARK_BASE[id].unit;
    values = LATENCY_ENDPOINTS[endpoint];
  } else {
    const config = SPARK_BASE[id];
    title = config.title;
    unit = config.unit;
    digits = config.digits || 0;
    values = config.values;
    threshold = config.threshold;
  }
  const shownValues = id === 'kpi-mini-trend' ? values : values.slice(-Number(period));
  const latest = shownValues[shownValues.length - 1] || 0;
  const minValue = Math.min(...shownValues);
  const maxValue = Math.max(...shownValues);
  const controls = id === 'kpi-mini-trend'
    ? <SelectControl label="KPI" value={kpi} onChange={setKpi} options={Object.keys(KPI_DATA).map((name) => ({ value: name, label: name }))} />
    : <>
      {id === 'latency-sparkline' && <SelectControl label="엔드포인트" value={endpoint} onChange={setEndpoint} options={Object.keys(LATENCY_ENDPOINTS).map((name) => ({ value: name, label: name }))} />}
      {SPARK_BASE[id]?.period && <SelectControl label="표시 구간" value={period} onChange={setPeriod} options={[{ value: '6', label: '최근 6시간' }, { value: '12', label: '최근 12시간' }, { value: '24', label: '최근 24시간' }]} />}
    </>;
  const points = valuePoints(shownValues, 34, 526, 18, 96, minValue - (maxValue - minValue || 1) * 0.18, maxValue + (maxValue - minValue || 1) * 0.18);
  const shape = bar
    ? shownValues.map((value, index) => {
      const height = 70 * (value / Math.max(1, maxValue));
      const x = 44 + index * 68;
      return <g key={index}><rect x={x} y={102 - height} width="34" height={height} rx="4" fill={C.blue} opacity={0.42 + index * 0.08} /><text x={x + 17} y="119" textAnchor="middle" fill={C.muted} fontSize="9">W{index + 1}</text></g>;
    })
    : id === 'error-rate-sparkline'
      ? <g>
        <line x1="24" x2="542" y1={scaleY(threshold || 0, minValue - (maxValue - minValue) * 0.18, maxValue + (maxValue - minValue) * 0.18, 18, 96)} y2={scaleY(threshold || 0, minValue - (maxValue - minValue) * 0.18, maxValue + (maxValue - minValue) * 0.18, 18, 96)} stroke={C.warning} strokeDasharray="5 4" />
        {points.slice(1).map((point, index) => { const prior = points[index]; const alert = shownValues[index] > (threshold || 0) || shownValues[index + 1] > (threshold || 0); return <line key={index} x1={prior.x} y1={prior.y} x2={point.x} y2={point.y} stroke={alert ? C.danger : C.blue} strokeWidth="2.5" strokeLinecap="round" />; })}
        {points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="2.8" fill={shownValues[index] > (threshold || 0) ? C.danger : C.blue} />)}
      </g>
      : <g>
        <path d={linePath(points)} fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={points[points.length - 1]?.x || 0} cy={points[points.length - 1]?.y || 0} r="4" fill={C.blue} />
      </g>;
  const footnote = id === 'error-rate-sparkline'
    ? '점선은 0.12% 경고 기준이며, 기준을 넘은 표본은 위험 색으로 표시합니다.'
    : '고정 합성 샘플입니다. 운영 시스템에서 실시간 수집하거나 자동 갱신하지 않습니다.';
  return <Shell preset={preset} controls={controls} metrics={[{ label: title, value: fmt(latest, digits) + unit }, { label: '표본 범위', value: fmt(minValue, digits) + '–' + fmt(maxValue, digits) + unit }]} footnote={footnote}>
    <ChartPlot minWidth={600}><ChartSvg label={title + ' 미니 차트'} width={560} height={150}>
      {!bar && <line x1="24" x2="542" y1="104" y2="104" stroke={C.border} />}
      {shape}
      {id === 'kpi-mini-trend' && <text x="44" y="24" fill={C.muted} fontSize="10">{kpi === '전환율' ? '주간 전환율' : '주간 신규 계정 수'}</text>}
    </ChartSvg></ChartPlot>
  </Shell>;
}

const COHORTS = [
  { label: '2025-01', values: [100,78,70,62,58,54,51,49,46,44,42,40] },
  { label: '2025-02', values: [100,81,73,66,61,56,53,50,47,45,42,41] },
  { label: '2025-03', values: [100,75,67,60,55,50,47,44,42,39,37,35] },
  { label: '2025-04', values: [100,83,76,68,63,60,56,53,50,48,45,43] },
];
function ColumnRenderer({ preset }: { preset: Preset }) {
  const [cohort, setCohort] = useState('all');
  const visible = cohort === 'all' ? COHORTS : COHORTS.filter((item) => item.label === cohort);
  const barWidth = cohort === 'all' ? 9 : 23;
  const groupWidth = 54;
  const x0 = 98;
  const plotTop = 30;
  const plotBottom = 260;
  const controls = <SelectControl label="코호트" value={cohort} onChange={setCohort} options={[{ value: 'all', label: '전체 비교' }, ...COHORTS.map((item) => ({ value: item.label, label: item.label }))]} />;
  const latest = visible.reduce((sum, item) => sum + item.values[11], 0) / visible.length;
  return <Shell preset={preset} controls={controls} metrics={[{ label: cohort === 'all' ? '평균 12개월 잔존' : '12개월 잔존', value: pct(latest) }, { label: '코호트', value: fmt(visible.length) }]} footnote="각 코호트는 가입 첫 달을 100%로 정규화했습니다. 월별 잔존율은 이전 달보다 높아지지 않도록 구성했습니다.">
    <ChartPlot minWidth={760}><ChartSvg label="가입 월별 12개월 잔존율 세로 막대 차트" width={800} height={320}>
      {[0,25,50,75,100].map((tick) => { const y = scaleY(tick, 0, 100, plotTop, plotBottom); return <g key={tick}><line x1="80" x2="770" y1={y} y2={y} stroke={C.border} strokeDasharray={tick === 0 ? undefined : '3 5'} /><text x="70" y={y + 4} textAnchor="end" fill={C.muted} fontSize="10">{tick}%</text></g>; })}
      {Array.from({ length: 12 }, (_, month) => {
        const visibleBars = visible.length;
        return <g key={month}>
          {visible.map((item, index) => {
            const height = (item.values[month] / 100) * (plotBottom - plotTop);
            const offset = (groupWidth - visibleBars * barWidth) / 2;
            const x = x0 + month * groupWidth + offset + index * barWidth;
            return <rect key={item.label} x={x} y={plotBottom - height} width={barWidth - 2} height={height} rx="2" fill={C.blue} opacity={cohort === 'all' ? SERIES_OPACITY[index] : 0.92}><title>{item.label} · M{month + 1}: {pct(item.values[month])}</title></rect>;
          })}
          <text x={x0 + month * groupWidth + groupWidth / 2} y="280" textAnchor="middle" fill={C.muted} fontSize="9">M{month + 1}</text>
        </g>;
      })}
    </ChartSvg></ChartPlot>
    {cohort === 'all' && <Legend items={COHORTS.map((item, index) => ({ label: item.label, color: C.blue, opacity: SERIES_OPACITY[index] }))} />}
  </Shell>;
}

type SeriesData = { id: string; label: string; values: number[]; color?: string };
const LATENCY_SERIES: SeriesData[] = [
  { id: 'p95', label: 'P95', values: [138,142,135,148,154,160,151,145,139,132,128,130], color: C.blue },
  { id: 'p99', label: 'P99', values: [226,238,219,244,260,272,255,241,233,218,210,216], color: C.warning },
];
const RETAINED = [94,95,94,96,96,97,97,98,97,98,98,99];
const EXPANSION = [9,10,12,12,13,14,16,15,17,18,18,20];
const CHURN = [5,4,5,5,5,4,5,5,4,5,4,5];
const NRR_VALUES = RETAINED.map((retained, index) => retained + EXPANSION[index] - CHURN[index]);
const THROUGHPUT = [1800,1920,2050,2100,1980,2240,2380,2310,2460,2520,2410,2600];
const CACHE_HIT = [91,92,91.5,93,92,94,94.5,93.8,95,94.4,95.2,96];
const CONNECTIONS: SeriesData[] = [
  { id: 'us-east', label: '북미', values: [1200,1320,1450,1580,1700,1820,1900,1840,1760,1680,1550,1420] },
  { id: 'eu-west', label: '유럽', values: [760,820,880,960,1020,1080,1140,1180,1120,1040,980,900] },
  { id: 'apac', label: 'APAC', values: [540,600,660,720,810,880,930,980,1020,960,860,760] },
];
function LineChart({ series, min, max, formatValue, baseline, area }: { series: SeriesData[]; min: number; max: number; formatValue: (value: number) => string; baseline?: number; area?: boolean }) {
  const x0 = 78, x1 = 758, y0 = 32, y1 = 250;
  const values = series.flatMap((item) => item.values);
  const tickCount = 4;
  const pointsBySeries = series.map((item) => valuePoints(item.values, x0, x1, y0, y1, min, max));
  return <ChartSvg label="시계열 비교 차트" width={800} height={310}>
    {Array.from({ length: tickCount + 1 }, (_, index) => {
      const value = min + ((max - min) * index) / tickCount;
      const y = scaleY(value, min, max, y0, y1);
      return <g key={index}><line x1={x0} x2={x1} y1={y} y2={y} stroke={C.border} strokeDasharray={index === 0 ? undefined : '3 5'} /><text x="68" y={y + 4} textAnchor="end" fill={C.muted} fontSize="10">{formatValue(value)}</text></g>;
    })}
    {baseline !== undefined && <g><line x1={x0} x2={x1} y1={scaleY(baseline, min, max, y0, y1)} y2={scaleY(baseline, min, max, y0, y1)} stroke={C.text} strokeDasharray="6 4" /><text x={x1 - 2} y={scaleY(baseline, min, max, y0, y1) - 5} textAnchor="end" fill={C.text} fontSize="10">{formatValue(baseline)} 기준</text></g>}
    {series.map((item, index) => {
      const points = pointsBySeries[index];
      const color = item.color || SERIES_COLOR[index % SERIES_COLOR.length];
      const isStacked = area === true && series.length > 1;
      if (isStacked) return null;
      const fillBase = baseline === undefined ? y1 : scaleY(baseline, min, max, y0, y1);
      const fillPath = polygonPath([...points, { x: points[points.length - 1]?.x || x1, y: fillBase }, { x: points[0]?.x || x0, y: fillBase }]);
      return <g key={item.id}>
        {area && <path d={fillPath} fill={color} opacity="0.12" />}
        <path d={linePath(points)} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point, pointIndex) => <circle key={pointIndex} cx={point.x} cy={point.y} r="2.5" fill={color}><title>{item.label} · {formatValue(item.values[pointIndex])}</title></circle>)}
      </g>;
    })}
    {area && series.length > 1 && (() => {
      let accumulated = Array(values.length).fill(0) as number[];
      return series.map((item, index) => {
        const lower = accumulated;
        const upper = lower.map((value, valueIndex) => value + item.values[valueIndex]);
        accumulated = upper;
        const topPoints = valuePoints(upper, x0, x1, y0, y1, min, max);
        const bottomPoints = valuePoints(lower, x0, x1, y0, y1, min, max).reverse();
        const color = item.color || C.blue;
        return <path key={item.id} d={polygonPath([...topPoints, ...bottomPoints])} fill={color} opacity={SERIES_OPACITY[index]} stroke={color} strokeWidth="1"><title>{item.label}</title></path>;
      });
    })()}
    {values.length > 1 && <g fill={C.muted} fontSize="9"><text x={x0} y="278">초기</text><text x={x1} y="278" textAnchor="end">최근</text></g>}
  </ChartSvg>;
}
function DualAxisChart({ values, rates }: { values: number[]; rates: number[] }) {
  const x0 = 82, x1 = 730, y0 = 35, y1 = 250;
  const left = valuePoints(values, x0, x1, y0, y1, 0, 3000);
  const right = valuePoints(rates, x0, x1, y0, y1, 80, 100);
  return <ChartSvg label="요청 처리량과 캐시 적중률 이중 축 라인 차트" width={800} height={310}>
    {[0,750,1500,2250,3000].map((value) => { const y = scaleY(value, 0, 3000, y0, y1); return <g key={value}><line x1={x0} x2={x1} y1={y} y2={y} stroke={C.border} strokeDasharray="3 5" /><text x="70" y={y + 4} textAnchor="end" fill={C.muted} fontSize="10">{fmt(value)}</text></g>; })}
    {[80,85,90,95,100].map((value) => <text key={value} x="740" y={scaleY(value, 80, 100, y0, y1) + 4} fill={C.muted} fontSize="10">{value}%</text>)}
    <text x={x0} y="20" fill={C.blue} fontSize="10">RPS</text><text x={x1} y="20" textAnchor="end" fill={C.text} fontSize="10">캐시 적중률 · 우측 축</text>
    <path d={linePath(left)} fill="none" stroke={C.blue} strokeWidth="2.5" />
    <path d={linePath(right)} fill="none" stroke={C.text} strokeWidth="2.2" strokeDasharray="6 3" />
  </ChartSvg>;
}
function SeriesRenderer({ id, preset }: { id: string; preset: Preset }) {
  const [period, setPeriod] = useState('12');
  const [regions, setRegions] = useState(new Set(CONNECTIONS.map((item) => item.id)));
  const count = Number(period);
  const controls = <>
    {id !== 'concurrent-connections-area' && <SelectControl label="기간" value={period} onChange={setPeriod} options={[{ value: '6', label: '최근 6구간' }, { value: '12', label: '최근 12구간' }]} />}
    {id === 'concurrent-connections-area' && <div aria-label="표시 리전 선택" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}><button type="button" aria-pressed={regions.size === CONNECTIONS.length} onClick={() => setRegions(new Set(CONNECTIONS.map((item) => item.id)))}>전체 리전</button>{CONNECTIONS.map((item) => <button type="button" key={item.id} aria-pressed={regions.has(item.id)} onClick={() => setRegions((current) => { const next = new Set(current); if (next.has(item.id)) next.delete(item.id); else next.add(item.id); return next; })}>{item.label}</button>)}</div>}
  </>;
  if (id === 'latency-percentiles-line') {
    const series = LATENCY_SERIES.map((item) => ({ ...item, values: item.values.slice(-count) }));
    const latestP95 = series[0].values[series[0].values.length - 1];
    const latestP99 = series[1].values[series[1].values.length - 1];
    return <Shell preset={preset} controls={controls} metrics={[{ label: '최근 P95', value: latestP95 + 'ms' }, { label: '최근 P99', value: latestP99 + 'ms' }]} footnote="같은 구간의 백분위 지연값이며 모든 표본에서 P99가 P95보다 크거나 같습니다.">
      <ChartPlot minWidth={760}><LineChart series={series} min={0} max={300} formatValue={(value) => fmt(value) + 'ms'} /></ChartPlot><Legend items={series.map((item) => ({ label: item.label, color: item.color || C.blue }))} />
    </Shell>;
  }
  if (id === 'net-revenue-retention-area') {
    const values = NRR_VALUES.slice(-count);
    const offset = NRR_VALUES.length - values.length;
    const latest = values[values.length - 1];
    return <Shell preset={preset} controls={controls} metrics={[{ label: '최근 NRR', value: pct(latest) }, { label: '계산식', value: '유지 + 확장 − 이탈' }]} footnote="월별 NRR = 기준 매출 유지율 + 확장 매출 기여 − 이탈 매출 기여입니다. 점선 100%는 기준 매출입니다.">
      <ChartPlot minWidth={760}><LineChart series={[{ id: 'nrr', label: 'NRR', values, color: C.blue }]} min={90} max={120} formatValue={(value) => pct(value, 0)} baseline={100} area /></ChartPlot>
      <Legend items={[{ label: 'NRR', color: C.blue }, { label: '기준 매출', color: C.text }]} />
      <p style={{ color: C.muted, fontSize: 12 }}>마지막 구간 구성 · 유지 {RETAINED[offset + values.length - 1]}% + 확장 {EXPANSION[offset + values.length - 1]}% − 이탈 {CHURN[offset + values.length - 1]}% = {latest}%</p>
    </Shell>;
  }
  if (id === 'token-throughput-line') {
    const selectedValues = THROUGHPUT.slice(-count);
    const selectedRates = CACHE_HIT.slice(-count);
    return <Shell preset={preset} controls={controls} metrics={[{ label: '최근 요청량', value: fmt(selectedValues[selectedValues.length - 1]) + ' RPS' }, { label: '최근 캐시 적중', value: pct(selectedRates[selectedRates.length - 1]) }]} footnote="왼쪽 축은 초당 요청 수(RPS), 오른쪽 축은 캐시 적중률(%)입니다. 한 축의 변화가 다른 축의 크기를 대신하지 않습니다.">
      <ChartPlot minWidth={760}><DualAxisChart values={selectedValues} rates={selectedRates} /></ChartPlot>
      <Legend items={[{ label: '요청/초 · 좌측 축', color: C.blue }, { label: '캐시 적중률 · 우측 축', color: C.text }]} />
    </Shell>;
  }
  const selected = CONNECTIONS.filter((item) => regions.has(item.id)).map((item) => ({ ...item, values: item.values.slice(-6) }));
  const total = Array.from({ length: 6 }, (_, index) => selected.reduce((sum, item) => sum + item.values[index], 0));
  return <Shell preset={preset} controls={controls} metrics={[{ label: '최근 전체 연결', value: fmt(total[total.length - 1]) }, { label: '포함 리전', value: fmt(selected.length) }]} footnote="각 리전 면적은 서로 더해 전체 연결 수를 만듭니다. 선택을 모두 해제하면 빈 영역이 표시됩니다.">
    <ChartPlot minWidth={760}>{selected.length ? <LineChart series={selected.map((item, index) => ({ ...item, color: C.blue }))} min={0} max={14000} formatValue={(value) => fmt(value)} area /> : <p role="status" style={{ padding: 24, color: C.muted }}>표시할 리전을 선택하세요.</p>}</ChartPlot>
    <Legend items={CONNECTIONS.filter((item) => regions.has(item.id)).map((item, index) => ({ label: item.label, color: C.blue, opacity: SERIES_OPACITY[index] }))} />
  </Shell>;
}

type Slice = { label: string; value: number; detail?: string };
const PIE_DATA: Record<string, { unit: string; digits?: number; slices: Slice[] }> = {
  'customer-segment-donut': { unit: '계정', slices: [{ label: 'Enterprise', value: 280 }, { label: 'SMB', value: 460 }, { label: 'Startup', value: 260 }] },
  'expense-allocation-pie': { unit: '$K', slices: [{ label: 'R&D', value: 420 }, { label: '마케팅', value: 260 }, { label: '일반관리', value: 170 }, { label: '영업', value: 150 }] },
  'ticket-severity-pie': { unit: '건', slices: [{ label: 'P1 · MTTR 0.8h', value: 4, detail: '평균 복구 0.8시간' }, { label: 'P2 · MTTR 2.1h', value: 18, detail: '평균 복구 2.1시간' }, { label: 'P3 · MTTR 6.4h', value: 42, detail: '평균 복구 6.4시간' }, { label: 'P4 · MTTR 12.0h', value: 36, detail: '평균 복구 12.0시간' }] },
};
function arcPath(cx: number, cy: number, outer: number, inner: number, start: number, end: number) {
  const point = (radius: number, angle: number) => ({ x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) });
  const a = point(outer, start), b = point(outer, end), c = point(inner, end), d = point(inner, start);
  const large = end - start > Math.PI ? 1 : 0;
  if (inner <= 0) return 'M' + cx + ' ' + cy + ' L' + a.x + ' ' + a.y + ' A' + outer + ' ' + outer + ' 0 ' + large + ' 1 ' + b.x + ' ' + b.y + ' Z';
  return 'M' + a.x + ' ' + a.y + ' A' + outer + ' ' + outer + ' 0 ' + large + ' 1 ' + b.x + ' ' + b.y + ' L' + c.x + ' ' + c.y + ' A' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + d.x + ' ' + d.y + ' Z';
}
function PieRenderer({ id, preset }: { id: string; preset: Preset }) {
  const data = PIE_DATA[id];
  const [selection, setSelection] = useState('all');
  const total = data.slices.reduce((sum, slice) => sum + slice.value, 0);
  const active = data.slices.find((slice) => slice.label === selection);
  const selectedIndex = data.slices.findIndex((slice) => slice.label === selection);
  const isTicket = id === 'ticket-severity-pie';
  const sliceColor = (index: number) => isTicket ? [C.danger, C.warning, C.muted, C.blue][index] : C.blue;
  let angle = -Math.PI / 2;
  const controls = <SelectControl label="강조 항목" value={selection} onChange={setSelection} options={[{ value: 'all', label: '전체 구성' }, ...data.slices.map((slice) => ({ value: slice.label, label: slice.label }))]} />;
  const formatSlice = (value: number) => data.unit === '$K' || data.unit === '$K/월' ? '$' + fmt(value) + 'k' : fmt(value) + data.unit;
  const share = active ? active.value / total * 100 : 100;
  const highlightValue = active ? formatSlice(active.value) : formatSlice(total);
  return <Shell preset={preset} controls={controls} metrics={[{ label: active ? active.label : '전체 합계', value: highlightValue }, { label: active ? '전체 중 비중' : '구성 수', value: active ? pct(share) : fmt(data.slices.length) + '개' }]} footnote={id === 'ticket-severity-pie' ? '심각도별 티켓 수 합계는 100건입니다. 복구 시간은 각 구간의 표본 평균입니다.' : '모든 조각의 합계를 100%로 정규화했습니다. 조각을 강조하면 해당 범주와 비중을 표시합니다.'}>
    <ChartPlot minWidth={700}><div style={{ display: 'grid', gridTemplateColumns: 'minmax(360px, 1fr) minmax(230px, 0.8fr)', alignItems: 'center', gap: 12, minWidth: 680 }}>
      <ChartSvg label={preset.title + ' 구성 차트'} width={420} height={300}>
        {data.slices.map((slice, index) => {
          const sweep = (slice.value / total) * Math.PI * 2;
          const start = angle;
          const end = angle + sweep;
          angle = end;
          const selectedOpacity = selection === 'all' ? SERIES_OPACITY[index] || 0.2 : selectedIndex === index ? 1 : 0.16;
          return <path key={slice.label} d={arcPath(170, 150, 112, id.includes('donut') ? 63 : 0, start, end)} fill={sliceColor(index)} opacity={selectedOpacity} stroke={C.panel} strokeWidth="2"><title>{slice.label}: {fmt(slice.value)}{data.unit} · {pct(slice.value / total * 100)}</title></path>;
        })}
        <text x="170" y="145" textAnchor="middle" fill={C.muted} fontSize="11">{active ? '선택 비중' : '전체 합계'}</text>
        <text x="170" y="170" textAnchor="middle" fill={C.text} fontSize="20" fontWeight="650">{active ? pct(share) : highlightValue}</text>
      </ChartSvg>
      <div style={{ display: 'grid', gap: 6 }}>
        {data.slices.map((slice, index) => <LegendButton key={slice.label} label={slice.label + ' · ' + pct(slice.value / total * 100)} color={sliceColor(index)} selected={selection === slice.label} onClick={() => setSelection(selection === slice.label ? 'all' : slice.label)} />)}
      </div>
    </div></ChartPlot>
  </Shell>;
}

type FunnelGroup = { label: string; stages: { label: string; value: number }[] };
const FUNNELS: Record<string, FunnelGroup[]> = {
  'churn-retention-funnel': [
    { label: '전체 계정', stages: [{ label: '만료 예정', value: 1200 }, { label: '연락 완료', value: 960 }, { label: '갱신 논의', value: 690 }, { label: '갱신 완료', value: 540 }] },
    { label: 'Enterprise', stages: [{ label: '만료 예정', value: 220 }, { label: '연락 완료', value: 204 }, { label: '갱신 논의', value: 182 }, { label: '갱신 완료', value: 171 }] },
    { label: 'SMB', stages: [{ label: '만료 예정', value: 980 }, { label: '연락 완료', value: 756 }, { label: '갱신 논의', value: 508 }, { label: '갱신 완료', value: 369 }] },
  ],
  'enterprise-poc-funnel': [
    { label: '전체 POC', stages: [{ label: '보안 검토', value: 124 }, { label: '검토 통과', value: 100 }, { label: '파일럿 시작', value: 76 }, { label: '파일럿 성공', value: 58 }, { label: '본계약', value: 42 }] },
    { label: '보안 중요', stages: [{ label: '보안 검토', value: 76 }, { label: '검토 통과', value: 68 }, { label: '파일럿 시작', value: 52 }, { label: '파일럿 성공', value: 42 }, { label: '본계약', value: 33 }] },
  ],
};
function FunnelRenderer({ id, preset }: { id: string; preset: Preset }) {
  const groups = FUNNELS[id];
  const [groupName, setGroupName] = useState(groups[0].label);
  const group = groups.find((item) => item.label === groupName) || groups[0];
  const stages = group.stages;
  const max = stages[0].value;
  const totalRate = stages[stages.length - 1].value / max * 100;
  const controls = <SelectControl label="세그먼트" value={group.label} onChange={setGroupName} options={groups.map((item) => ({ value: item.label, label: item.label }))} />;
  return <Shell preset={preset} controls={controls} metrics={[{ label: '최종 전환', value: pct(totalRate) }, { label: '최종 단계', value: fmt(stages[stages.length - 1].value) + '건' }]} footnote="단계별 값은 같은 표본군의 계정·세션 수이며, 다음 단계로 갈수록 값이 같거나 감소합니다.">
    <ChartPlot minWidth={740}><ChartSvg label={group.label + ' 단계별 전환 퍼널'} width={800} height={Math.max(320, 82 + stages.length * 56)}>
      {stages.map((stage, index) => {
        const next = stages[index + 1]?.value ?? stage.value;
        const topWidth = 560 * stage.value / max;
        const bottomWidth = 560 * next / max;
        const center = 484;
        const y = 28 + index * 56;
        const h = 48;
        const xLeftTop = center - topWidth / 2, xRightTop = center + topWidth / 2;
        const xLeftBottom = center - bottomWidth / 2, xRightBottom = center + bottomWidth / 2;
        const nextRate = index + 1 < stages.length ? next / stage.value * 100 : null;
        return <g key={stage.label}>
          <text x="24" y={y + 28} fill={C.text} fontSize="11">{stage.label}</text>
          <path d={'M' + xLeftTop + ' ' + y + ' L' + xRightTop + ' ' + y + ' L' + xRightBottom + ' ' + (y + h) + ' L' + xLeftBottom + ' ' + (y + h) + ' Z'} fill={C.blue} fillOpacity="0.13" stroke={C.blue} strokeWidth="1.5" />
          <text x={center} y={y + 20} textAnchor="middle" fill={C.text} fontSize="12" fontWeight="650">{fmt(stage.value)}건</text>
          <text x={center} y={y + 37} textAnchor="middle" fill={C.muted} fontSize="9">{nextRate === null ? '최종 단계' : '다음 단계 전환 ' + pct(nextRate)}</text>
        </g>;
      })}
    </ChartSvg></ChartPlot>
  </Shell>;
}

type RadarSeries = { label: string; values: number[]; color?: string };
function radarPoints(values: number[], cx: number, cy: number, radius: number): Point[] {
  return values.map((value, index) => {
    const angle = -Math.PI / 2 + (index / values.length) * Math.PI * 2;
    const distance = radius * clamp(value, 0, 100) / 100;
    return { x: cx + Math.cos(angle) * distance, y: cy + Math.sin(angle) * distance };
  });
}
function RadarPlot({ labels, series, label }: { labels: string[]; series: RadarSeries[]; label: string }) {
  const cx = 350, cy = 205, radius = 132;
  return <ChartSvg label={label} width={700} height={420}>
    {[20,40,60,80,100].map((value) => <polygon key={value} points={radarPoints(labels.map(() => value), cx, cy, radius).map((point) => point.x.toFixed(1) + ',' + point.y.toFixed(1)).join(' ')} fill="none" stroke={C.border} strokeDasharray={value === 100 ? undefined : '3 4'} />)}
    {labels.map((name, index) => {
      const angle = -Math.PI / 2 + (index / labels.length) * Math.PI * 2;
      const end = { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
      const textPoint = { x: cx + Math.cos(angle) * 178, y: cy + Math.sin(angle) * 178 };
      const anchor = Math.cos(angle) > 0.22 ? 'start' : Math.cos(angle) < -0.22 ? 'end' : 'middle';
      return <g key={name}><line x1={cx} y1={cy} x2={end.x} y2={end.y} stroke={C.border} /><text x={textPoint.x} y={textPoint.y + 4} textAnchor={anchor} fill={C.text} fontSize="10">{name}</text></g>;
    })}
    {series.map((item, index) => {
      const color = item.color || SERIES_COLOR[index % SERIES_COLOR.length];
      const points = radarPoints(item.values, cx, cy, radius);
      return <g key={item.label}><polygon points={points.map((point) => point.x.toFixed(1) + ',' + point.y.toFixed(1)).join(' ')} fill={color} fillOpacity={series.length === 1 ? '0.15' : '0.08'} stroke={color} strokeWidth="2" />{points.map((point, pointIndex) => <circle key={pointIndex} cx={point.x} cy={point.y} r="3" fill={color}><title>{labels[pointIndex]}: {fmt(item.values[pointIndex])}/100</title></circle>)}</g>;
    })}
  </ChartSvg>;
}
const DORA_LABELS = ['배포 빈도', '리드 타임', '변경 실패율', '복구 시간', '가용성'];
const DORA_CURRENT = [78,67,85,72,99];
const DORA_TARGET = [86,82,90,84,100];
const RESILIENCE_LABELS = ['장애 격리', '자동 복구', '데이터 내구성', '복구 시간', '의존성 보호'];
const RESILIENCE: RadarSeries[] = [
  { label: 'AZ 장애 조치', values: [92,88,94,86,90] },
  { label: '데이터베이스 장애 조치', values: [82,78,96,74,84] },
  { label: '큐 과부하', values: [90,72,82,76,88] },
];
function RadarRenderer({ id, preset }: { id: string; preset: Preset }) {
  const [scenario, setScenario] = useState('all');
  if (id === 'dora-metrics-radar') {
    const controls = <SelectControl label="기준" value={scenario} onChange={setScenario} options={[{ value: 'current', label: '현재 예시' }, { value: 'target', label: '목표 예시' }]} />;
    const values = scenario === 'current' ? DORA_CURRENT : DORA_TARGET;
    return <Shell preset={preset} controls={controls} metrics={[{ label: scenario === 'current' ? '현재 평균 점수' : '목표 평균 점수', value: fmt(values.reduce((sum, value) => sum + value, 0) / values.length) + '/100' }]} footnote="모든 축은 목표 대비 정규화 점수(0–100)이며 높을수록 양호합니다. 실패율·복구 시간처럼 낮을수록 좋은 원시 지표는 역방향 점수로 바꿨습니다.">
      <ChartPlot minWidth={680}><RadarPlot labels={DORA_LABELS} series={[{ label: scenario === 'current' ? '현재 예시' : '목표 예시', values }]} label="DORA 정규화 점수 레이더" /></ChartPlot>
      <Legend items={[{ label: scenario === 'current' ? '현재 예시' : '목표 예시', color: C.blue }]} />
    </Shell>;
  }
  const visible = scenario === 'all' ? RESILIENCE : RESILIENCE.filter((item) => item.label === scenario);
  const controls = <SelectControl label="장애 시나리오" value={scenario} onChange={setScenario} options={[{ value: 'all', label: '전체 비교' }, ...RESILIENCE.map((item) => ({ value: item.label, label: item.label }))]} />;
  return <Shell preset={preset} controls={controls} metrics={[{ label: '비교 시나리오', value: fmt(visible.length) }, { label: '점수 범위', value: '0–100' }]} footnote="점수는 장애 주입 예시의 정규화 결과입니다. 원시 복구 시간이나 서비스 가용성으로 해석하지 않습니다.">
    <ChartPlot minWidth={680}><RadarPlot labels={RESILIENCE_LABELS} series={visible.map((item, index) => ({ ...item, color: SERIES_COLOR[index] }))} label="복원력 시나리오별 점수 레이더" /></ChartPlot>
    <Legend items={visible.map((item, index) => ({ label: item.label, color: SERIES_COLOR[index] }))} />
  </Shell>;
}

const INCIDENT_COUNTS: Record<string, number[]> = {
  weekday: [2,1,1,0,1,2,4,6,5,3,2,3,4,3,2,3,4,5,8,10,7,5,4,3],
  weekend: [1,0,0,1,0,1,2,3,4,3,2,2,3,4,5,4,3,4,6,7,5,4,3,2],
};
function PolarRenderer({ preset }: { preset: Preset }) {
  const [dayType, setDayType] = useState('weekday');
  const values = INCIDENT_COUNTS[dayType];
  const total = values.reduce((sum, value) => sum + value, 0);
  const max = Math.max(...values);
  const cx = 350, cy = 194, inner = 48, outerMax = 137;
  const controls = <SelectControl label="요일 구간" value={dayType} onChange={setDayType} options={[{ value: 'weekday', label: '평일' }, { value: 'weekend', label: '주말' }]} />;
  return <Shell preset={preset} controls={controls} metrics={[{ label: '페이지 합계', value: fmt(total) + '건' }, { label: '시간당 최대', value: fmt(max) + '건' }]} footnote="고정된 24시간 집계 예시이며, 자동 페이지 수집을 나타내지 않습니다. 호출장이 많은 시간은 황색으로 표시합니다.">
    <ChartPlot minWidth={680}><ChartSvg label={dayType === 'weekday' ? '평일 24시간 온콜 호출 폴라 차트' : '주말 24시간 온콜 호출 폴라 차트'} width={700} height={390}>
      {[0.25,0.5,0.75,1].map((fraction) => <circle key={fraction} cx={cx} cy={cy} r={inner + (outerMax - inner) * fraction} fill="none" stroke={C.border} strokeDasharray="3 4" />)}
      {values.map((value, index) => {
        const span = (Math.PI * 2) / values.length;
        const start = -Math.PI / 2 + index * span + 0.018;
        const end = start + span - 0.036;
        const radius = inner + (outerMax - inner) * value / Math.max(1, max);
        const color = value >= max * 0.75 ? C.warning : C.blue;
        const startInner = { x: cx + inner * Math.cos(start), y: cy + inner * Math.sin(start) };
        const startOuter = { x: cx + radius * Math.cos(start), y: cy + radius * Math.sin(start) };
        const endOuter = { x: cx + radius * Math.cos(end), y: cy + radius * Math.sin(end) };
        const endInner = { x: cx + inner * Math.cos(end), y: cy + inner * Math.sin(end) };
        const d = 'M' + startInner.x + ' ' + startInner.y + ' L' + startOuter.x + ' ' + startOuter.y + ' A' + radius + ' ' + radius + ' 0 0 1 ' + endOuter.x + ' ' + endOuter.y + ' L' + endInner.x + ' ' + endInner.y + ' A' + inner + ' ' + inner + ' 0 0 0 ' + startInner.x + ' ' + startInner.y + ' Z';
        return <path key={index} d={d} fill={color} opacity="0.88"><title>{String(index).padStart(2, '0')}:00 · {value}건</title></path>;
      })}
      {Array.from({ length: 4 }, (_, index) => {
        const hour = index * 6;
        const angle = -Math.PI / 2 + (hour / 24) * Math.PI * 2;
        return <text key={hour} x={cx + (outerMax + 22) * Math.cos(angle)} y={cy + (outerMax + 22) * Math.sin(angle) + 4} textAnchor="middle" fill={C.muted} fontSize="10">{String(hour).padStart(2, '0')}:00</text>;
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fill={C.text} fontSize="20" fontWeight="650">{fmt(total)}</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill={C.muted} fontSize="10">페이지 · {dayType === 'weekday' ? '평일' : '주말'}</text>
    </ChartSvg></ChartPlot>
  </Shell>;
}

function UnknownPreview({ variant }: { variant: string }) {
  return <ChartShell title="차트 프리뷰 없음" subtitle={'등록된 차트 변형이 아닙니다: ' + variant} tag="미등록"><p role="status" style={{ color: C.muted }}>지원되는 chart variant ID를 전달하세요.</p></ChartShell>;
}

function PlannedChartContent({ variant, density }: { variant: string; density: Density }) {
  const preset = PRESETS[variant];
  if (!preset) return <UnknownPreview variant={variant} />;
  switch (preset.family) {
    case 'sankey': return <SankeyRenderer id={variant} preset={preset} />;
    case 'slope': return <SlopeRenderer id={variant} preset={preset} />;
    case 'radial': return <RadialRenderer id={variant} preset={preset} />;
    case 'sparkline': return <SparkRenderer id={variant} preset={preset} />;
    case 'column': return <ColumnRenderer preset={preset} />;
    case 'series': return <SeriesRenderer id={variant} preset={preset} />;
    case 'pie': return <PieRenderer id={variant} preset={preset} />;
    case 'funnel': return <FunnelRenderer id={variant} preset={preset} />;
    case 'radar': return <RadarRenderer id={variant} preset={preset} />;
    case 'polar': return <PolarRenderer preset={preset} />;
  }
}

export type PlannedChartPreviewBlockProps = { variant: string; density?: Density };
export function PlannedChartPreviewBlock({ variant, density = 'normal' }: PlannedChartPreviewBlockProps) {
  return <div data-chart-density={density} style={{ ['--runtime-density-space' as string]: DENSITY_SPACE[density] }}><PlannedChartContent key={variant} variant={variant} density={density} /></div>;
}

export default PlannedChartPreviewBlock;
