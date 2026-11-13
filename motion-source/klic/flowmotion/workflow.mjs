const AMBIENT_MS = 2400;
const PHASES = [0, 0.25, 0.5, 0.75, 1];
const SCOPED_CSS = `
.fm-root{--fm-accent:var(--klic-semantic-color-accent,#245FC2);--fm-ink:var(--klic-semantic-color-text,#132c46);--fm-panel:var(--klic-semantic-color-panel,#fff);--fm-surface:var(--klic-semantic-color-surface,#fbfcfe);--fm-border:var(--klic-semantic-color-border,#dfe5ee);box-sizing:border-box;width:100%;height:100%;padding:10px;border:1px solid var(--fm-border);border-radius:var(--klic-component-card-radius-default,12px);background:var(--fm-surface);color:var(--fm-ink);font:500 12px/1.35 var(--klic-component-text-body-font-family,system-ui);overflow:hidden}
.fm-root svg{display:block;width:100%;height:100%;overflow:hidden}
.fm-root text{font-family:var(--klic-component-text-body-font-family,system-ui);fill:var(--fm-ink)}
.fm-root .label{font-size:11px;font-weight:700}.fm-root .small{font-size:9px;fill:var(--klic-semantic-color-muted,#52657b)}
.fm-root .node-bg{fill:var(--fm-panel);stroke:var(--fm-border);stroke-width:1.5}.fm-root .flow{fill:none;stroke:var(--fm-border);stroke-width:2}
.fm-root .accent{fill:var(--fm-accent)}.fm-root .accent-line{fill:none;stroke:var(--fm-accent)}.fm-root .ink-line{fill:none;stroke:var(--fm-ink)}
.fm-root .packet{fill:var(--fm-accent)}.fm-root .danger{fill:var(--klic-semantic-color-danger,#b13c43)}.fm-root .danger-line{fill:none;stroke:var(--klic-semantic-color-danger,#b13c43)}
.fm-root .bar{transform-box:fill-box;transform-origin:50% 100%}.fm-root .spin{transform-box:view-box;transform-origin:160px 90px}
`;

const escapeHtml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const round = value => Number(value.toFixed(3));
const clamp01 = value => Math.max(0, Math.min(1, value));
const mod1 = value => ((value % 1) + 1) % 1;

function demoSvg(label, body) {
  return `<style>${SCOPED_CSS}</style><div class="fm-root"><svg viewBox="0 0 320 180" role="img" aria-label="${escapeHtml(label)}">${body}</svg></div>`;
}

function node(x, y, width, title, subtitle = '') {
  return `<rect class="node-bg" x="${x}" y="${y}" width="${width}" height="34" rx="8"/><text class="label" x="${x + 9}" y="${y + 14}">${escapeHtml(title)}</text>${subtitle ? `<text class="small" x="${x + 9}" y="${y + 27}">${escapeHtml(subtitle)}</text>` : ''}`;
}

function text(x, y, value, className = 'label', anchor = 'middle') {
  return `<text class="${className}" text-anchor="${anchor}" x="${round(x)}" y="${round(y)}">${escapeHtml(value)}</text>`;
}

function timeline(durationMs, description, formula, measure, phases = PHASES) {
  return {
    durationMs,
    description: `${description} ${formula}`,
    frames: phases.map(progress => ({ progress, ...measure(progress) })),
  };
}

function track(selector, keyframes) {
  return { selector, keyframes, easing: 'linear' };
}

function offsets(count = 49, breaks = []) {
  const values = new Set(Array.from({ length: count }, (_, index) => index / (count - 1)));
  for (const point of breaks) {
    for (const near of [point - 0.0001, point, point + 0.0001]) {
      if (near >= 0 && near <= 1) values.add(Number(near.toFixed(6)));
    }
  }
  return [...values].sort((a, b) => a - b);
}

function cyclicBreaks(cycles, phase = 0) {
  const result = [];
  for (let cycle = 0; cycle <= Math.ceil(cycles + phase); cycle += 1) {
    const point = (cycle - phase) / cycles;
    if (point > 0 && point < 1) result.push(point);
  }
  return result;
}

function pointTrack(selector, pointAt, count = 49, breaks = []) {
  return track(selector, offsets(count, breaks).map(offset => {
    const point = pointAt(offset);
    return { offset, cx: `${round(point.x)}px`, cy: `${round(point.y)}px` };
  }));
}

function valueTrack(selector, valueAt, count = 49, breaks = []) {
  return track(selector, offsets(count, breaks).map(offset => ({ offset, ...valueAt(offset) })));
}

function cubicPoint(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return {
    x: u ** 3 * p0.x + 3 * u ** 2 * t * p1.x + 3 * u * t ** 2 * p2.x + t ** 3 * p3.x,
    y: u ** 3 * p0.y + 3 * u ** 2 * t * p1.y + 3 * u * t ** 2 * p2.y + t ** 3 * p3.y,
  };
}

function mapPoint(point, from, to) {
  return {
    x: to.x0 + (point.x - from.x0) * (to.x1 - to.x0) / (from.x1 - from.x0),
    y: to.y0 + (point.y - from.y0) * (to.y1 - to.y0) / (from.y1 - from.y0),
  };
}

function polylinePoint(points, progress) {
  const lengths = points.slice(1).map((point, index) => Math.hypot(point.x - points[index].x, point.y - points[index].y));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let remaining = clamp01(progress) * total;
  for (let index = 0; index < lengths.length; index += 1) {
    const length = lengths[index];
    if (remaining <= length || index === lengths.length - 1) {
      const local = length ? remaining / length : 0;
      return {
        x: points[index].x + (points[index + 1].x - points[index].x) * local,
        y: points[index].y + (points[index + 1].y - points[index].y) * local,
      };
    }
    remaining -= length;
  }
  return points.at(-1);
}

function recipe({ id, category, title, summary, durationMs, templateIds, sourceFile, renderer, effect, sourceTimeline, label, body, tracks, reducedProgress = 1 }) {
  return {
    id,
    category,
    title,
    summary,
    durationMs,
    easing: 'linear',
    origin: { templateIds, sourceFile, renderer, effect, sourceTimeline },
    definition: {
      html: demoSvg(label, body),
      duration: durationMs,
      easing: 'linear',
      segmentEasing: false,
      reducedProgress,
      tracks,
    },
  };
}

const orthogonalSourcePoints = [
  { x: 546, y: 292 },
  { x: 567, y: 292 },
  { x: 567, y: 112 },
  { x: 588, y: 112 },
];
const orthogonalMap = point => mapPoint(point, { x0: 546, x1: 588, y0: 112, y1: 292 }, { x0: 104, x1: 216, y0: 55, y1: 135 });
const orthogonalStartMs = 1420;
const orthogonalEndMs = 1970;
const orthogonalDurationMs = 3600;
const orthogonalStartProgress = orthogonalStartMs / orthogonalDurationMs;
const orthogonalEndProgress = orthogonalEndMs / orthogonalDurationMs;
const orthogonalPath = `M 104 135 L 133.333 135 Q 160 135 160 130.556 L 160 59.444 Q 160 55 186.667 55 L 216 55`;
const orthogonalFrames = [
  { offset: 0, ...orthogonalMap(orthogonalSourcePoints[0]) },
  { offset: orthogonalStartProgress, ...orthogonalMap(orthogonalSourcePoints[0]) },
  ...Array.from({ length: 33 }, (_, index) => {
    const local = index / 32;
    const point = orthogonalMap(polylinePoint(orthogonalSourcePoints, local));
    return { offset: orthogonalStartProgress + (orthogonalEndProgress - orthogonalStartProgress) * local, cx: `${round(point.x)}px`, cy: `${round(point.y)}px` };
  }).slice(1),
  { offset: 1, ...orthogonalMap(orthogonalSourcePoints.at(-1)) },
].map(({x,y,...frame}) => ({ ...frame, cx: typeof frame.cx === 'string' ? frame.cx : `${round(frame.cx ?? x)}px`, cy: typeof frame.cy === 'string' ? frame.cy : `${round(frame.cy ?? y)}px` }));

const radialP0 = { x: 268, y: 84 };
const radialP3 = { x: 368, y: 274 };
const radialP1 = { x: 318, y: 84 };
const radialP2 = { x: 318, y: 274 };
const radialBounds = { x0: 268, x1: 368, y0: 84, y1: 274 };
const compactBounds = { x0: 67, x1: 253, y0: 46, y1: 138 };
const radialMap = point => mapPoint(point, radialBounds, compactBounds);
const radialCurve = `M ${radialMap(radialP0).x} ${radialMap(radialP0).y} C ${radialMap(radialP1).x} ${radialMap(radialP1).y}, ${radialMap(radialP2).x} ${radialMap(radialP2).y}, ${radialMap(radialP3).x} ${radialMap(radialP3).y}`;

const swimP0 = { x: 502, y: 260 };
const swimP3 = { x: 548, y: 130 };
const swimP1 = { x: 525, y: 260 };
const swimP2 = { x: 525, y: 130 };
const swimMap = point => mapPoint(point, { x0: 502, x1: 548, y0: 130, y1: 260 }, { x0: 81, x1: 239, y0: 50, y1: 136 });
const swimCurve = `M ${swimMap(swimP0).x} ${swimMap(swimP0).y} C ${swimMap(swimP1).x} ${swimMap(swimP1).y}, ${swimMap(swimP2).x} ${swimMap(swimP2).y}, ${swimMap(swimP3).x} ${swimMap(swimP3).y}`;

const treePoint = progress => {
  const local = mod1(progress);
  return { x: 560 + (230 - 560) * Math.pow(local, 1.2), y: 112 + (184 - 112) * local };
};
const treeMap = point => mapPoint(point, { x0: 230, x1: 560, y0: 112, y1: 184 }, { x0: 76, x1: 244, y0: 54, y1: 132 });

const sequenceSteps = [
  { fromX: 140, toX: 410, y: 162 },
  { fromX: 410, toX: 680, y: 232 },
  { fromX: 680, toX: 410, y: 312 },
  { fromX: 410, toX: 950, y: 382 },
  { fromX: 410, toX: 140, y: 452 },
];
const sequenceMapX = x => 38 + (x - 140) * (244 / 810);
const sequenceMapY = y => 43 + (y - 162) * (105 / 290);
const sequenceIndex = progress => Math.min(4, Math.floor(Math.min(progress, 0.999999) * sequenceSteps.length));
const sequenceLocal = progress => mod1(progress * sequenceSteps.length);
const sequenceLineTracks = sequenceSteps.map((_, index) => valueTrack(`.seq-line-${index}`, progress => ({ strokeWidth: sequenceIndex(progress) === index ? 3 : 2.2 }), 49, [0.2, 0.4, 0.6, 0.8]));
const sequenceDotTracks = sequenceSteps.map((step, index) => pointTrack(`.seq-dot-${index}`, progress => {
  const active = sequenceIndex(progress) === index;
  const t = active ? sequenceLocal(progress) : 0.5;
  return { x: sequenceMapX(step.fromX + (step.toX - step.fromX) * t), y: sequenceMapY(step.y) };
}, 61, [0.2, 0.4, 0.6, 0.8]));

const zigzagPoints = [
  { x: 65, y: 315 }, { x: 185, y: 220 }, { x: 435, y: 380 },
  { x: 685, y: 220 }, { x: 935, y: 380 }, { x: 1065, y: 280 },
];
function sourceWavePoint(progress) {
  const scaled = mod1(progress);
  const segmentCount = zigzagPoints.length - 1;
  const index = Math.min(segmentCount - 1, Math.floor(scaled * segmentCount));
  const local = scaled * segmentCount - index;
  const p0 = zigzagPoints[index];
  const p1 = zigzagPoints[index + 1];
  return { x: p0.x + (p1.x - p0.x) * local, y: p0.y + (p1.y - p0.y) * local };
}
const zigzagMap = point => mapPoint(point, { x0: 65, x1: 1065, y0: 220, y1: 380 }, { x0: 28, x1: 292, y0: 48, y1: 134 });
const zigzagPath = zigzagPoints.map((point, index) => `${index ? 'L' : 'M'} ${zigzagMap(point).x} ${zigzagMap(point).y}`).join(' ');

const sparkSourcePoint = progress => {
  const local = mod1(progress);
  const start = { x: 465, y: 185 };
  const elbow = { x: 365, y: 112 };
  const end = { x: 304, y: 112 };
  if (local < 0.5) return { x: start.x + (elbow.x - start.x) * (local * 2), y: start.y + (elbow.y - start.y) * (local * 2) };
  return { x: elbow.x + (end.x - elbow.x) * ((local - 0.5) * 2), y: elbow.y + (end.y - elbow.y) * ((local - 0.5) * 2) };
};
const sparkMap = point => mapPoint(point, { x0: 304, x1: 465, y0: 112, y1: 185 }, { x0: 75, x1: 247, y0: 57, y1: 137 });

const editorialStart = { x: 256, y: 132 };
const editorialControl = { x: 294, y: 102 };
const editorialEnd = { x: 332, y: 118 };
const editorialMap = point => mapPoint(point, { x0: 256, x1: 332, y0: 102, y1: 132 }, { x0: 87, x1: 241, y0: 56, y1: 132 });
const editorialCurve = `M ${editorialMap(editorialStart).x} ${editorialMap(editorialStart).y} Q ${editorialMap(editorialControl).x} ${editorialMap(editorialControl).y}, ${editorialMap(editorialEnd).x} ${editorialMap(editorialEnd).y}`;

export const FLOWMOTION_WORKFLOW = [
  recipe({
    id: 'flowmotion-node-loader-spin', category: 'ui-loading',
    title: { ko: '노드 상태 스피너', en: 'Node Status Spinner' },
    summary: { ko: '실행 중 노드의 회전 표시를 한 바퀴로 재생합니다.', en: 'Plays one turn of the running-node spinner.' },
    durationMs: 1000, templateIds: ['inbound-lead-routing'], sourceFile: 'src/components/FlowNodeCard.tsx', renderer: 'FlowNodeCard', effect: 'running-node-loader-spin',
    sourceTimeline: timeline(1000, 'FlowNodeCard의 Loader2 animate-spin 한 회전.', 'angle = 360° × progress over the 1,000ms Tailwind spin cycle.', p => ({ angleDeg: 360 * p })),
    label: '실행 중 노드 회전 표시',
    body: `<circle cx="160" cy="88" r="31" class="flow"/><path class="accent-line spin" d="M160 57 A31 31 0 1 1 137 67" stroke-width="5" stroke-linecap="round"/>${text(160, 145, '실행 중', 'label')}`,
    tracks: [track('.spin', PHASES.map(progress => ({ offset: progress, transform: `rotate(${round(progress * 360)}deg)` })))],
  }),
  recipe({
    id: 'flowmotion-dash-cycle', category: 'svg-path',
    title: { ko: '대시 링 트레이스', en: 'Dashed Ring Trace' },
    summary: { ko: '원본 750ms 점선 오프셋을 링 한 바퀴에 적용합니다.', en: 'Applies the source 750ms dash-offset cycle to a ring.' },
    durationMs: 750, templateIds: ['inbound-lead-routing', 'ppt-flywheel-infographic', 'creative-lightbulb-brainstorm', 'creative-semicircle-radial-fan'], sourceFile: 'src/components/PptInfographicCanvases.tsx', renderer: 'PptFlywheelInfographicCanvas', effect: 'flowDashMove-ring-trace',
    sourceTimeline: timeline(750, 'animate-flow-dash uses flowDashMove from src/index.css for one finite pass.', 'strokeDashoffset: 24 → 0, linear, 750ms; the original CSS repeats indefinitely.', p => ({ strokeDashoffset: 24 * (1 - p) })),
    label: '원형 점선이 흐르는 효과',
    body: `<circle cx="160" cy="83" r="48" class="accent-line" stroke-width="10" stroke-dasharray="24 16"/>${text(160, 155, '연결 경로', 'label')}`,
    tracks: [track('.accent-line', PHASES.map(progress => ({ offset: progress, strokeDashoffset: round(24 * (1 - progress)) })))],
  }),
  recipe({
    id: 'flowmotion-orthogonal-edge-signal', category: 'particles',
    title: { ko: '직교 경로 신호 입자', en: 'Orthogonal Edge Signal' },
    summary: { ko: '실패 분기의 실제 직교 포트 경로를 따라 신호가 이동합니다.', en: 'Moves a signal along the actual orthogonal port path of a failure branch.' },
    durationMs: orthogonalDurationMs, templateIds: ['inbound-lead-routing'], sourceFile: 'src/components/FlowCanvas.tsx', renderer: 'FlowCanvas', effect: 'active-edge-particle-progress',
    sourceTimeline: timeline(orthogonalDurationMs, 'Scenario reference-timeout; source step ends at 1,500ms and target step starts at 1,750ms.', 'travelStart=max(0,1500-80)=1420; travelEnd=max(1420+320,1750+220)=1970; particleProgress=(elapsed-travelStart)/(travelEnd-travelStart).', progress => {
      const elapsedMs = progress * orthogonalDurationMs;
      const particleProgress = clamp01((elapsedMs - orthogonalStartMs) / (orthogonalEndMs - orthogonalStartMs));
      const point = orthogonalMap(polylinePoint(orthogonalSourcePoints, particleProgress));
      return { elapsedMs, particleProgress, x: round(point.x), y: round(point.y) };
    }, [0, orthogonalStartProgress, (orthogonalStartProgress + orthogonalEndProgress) / 2, orthogonalEndProgress, 1]),
    label: '엔터프라이즈 분기에서 조회 노드로 이동',
    body: `<path class="flow" d="${orthogonalPath}"/><circle class="packet" r="5" cx="104" cy="135"/>${node(38, 127, 66, '분기', '예')}${node(216, 38, 66, '조회', '시간 초과')}`,
    tracks: [track('.packet', orthogonalFrames)], reducedProgress: 0.72,
  }),
  recipe({
    id: 'flowmotion-stream-equalizer-wave', category: 'loops',
    title: { ko: '스트림 이퀄라이저 파동', en: 'Stream Equalizer Wave' },
    summary: { ko: '스트림별 위상과 사인파 진폭으로 막대 높이를 변조합니다.', en: 'Modulates bar heights with the stream phase and sinusoidal amplitude.' },
    durationMs: AMBIENT_MS, templateIds: ['realtime-ai-scoring-hub'], sourceFile: 'src/components/MultiStyleFlowCanvases.tsx', renderer: 'RadialStreamHubCanvas', effect: 'stream-equalizer-sine-wave',
    sourceTimeline: timeline(AMBIENT_MS, 'App ambientProgress repeats every 2,400ms; this source row has phaseOffset=0.', 'height[i]=clamp(base[i]+sin(progress×2π+phaseOffset+i×0.9)×0.25,0.25,1); base=[.45,.75,.55,.95,.85].', progress => ({ heights: [0.45, 0.75, 0.55, 0.95, 0.85].map((base, index) => round(Math.max(0.25, Math.min(1, base + Math.sin(progress * Math.PI * 2 + index * 0.9) * 0.25)))) })),
    label: '스트림 처리량 파동',
    body: `${node(16, 57, 78, '입력', '스트림')}${node(226, 57, 78, '출력', '처리')}${text(160, 42, '처리량', 'small')}${[0, 1, 2, 3, 4].map(index => `<rect class="accent bar eq-${index}" x="${118 + index * 17}" y="78" width="11" height="55" rx="4"/>`).join('')}`,
    tracks: [0, 1, 2, 3, 4].map(index => valueTrack(`.eq-${index}`, progress => {
      const bases = [0.45, 0.75, 0.55, 0.95, 0.85];
      const height = Math.max(0.25, Math.min(1, bases[index] + Math.sin(progress * Math.PI * 2 + index * 0.9) * 0.25));
      return { transform: `scaleY(${round(height)})` };
    })),
  }),
  recipe({
    id: 'flowmotion-radial-hub-packet', category: 'particles',
    title: { ko: '허브 베지어 패킷', en: 'Hub Bezier Packet' },
    summary: { ko: '입력 스트림에서 허브까지 원본 cubic Bézier 계산으로 이동합니다.', en: 'Moves from an input stream to the hub using the source cubic Bezier calculation.' },
    durationMs: AMBIENT_MS, templateIds: ['realtime-ai-scoring-hub'], sourceFile: 'src/components/MultiStyleFlowCanvases.tsx', renderer: 'RadialStreamHubCanvas', effect: 'fan-in-cubic-bezier-packet',
    sourceTimeline: timeline(AMBIENT_MS, 'First fan-in stream uses cy=84 and ambient offset idx×0.28 with idx=0.', 'computeCubicBezierPath(268,84,368,274,0.5): p1=(318,84), p2=(318,274); cubic Bernstein point at t=progress.', progress => {
      const point = cubicPoint(radialP0, radialP1, radialP2, radialP3, progress);
      return { t: progress, x: round(point.x), y: round(point.y) };
    }),
    label: '스트림에서 허브로 패킷 이동',
    body: `${node(28, 29, 78, '입력', '이벤트')}${node(214, 111, 78, '허브', '분기')}<path class="flow" d="${radialCurve}"/><circle class="packet" cx="${radialMap(radialP0).x}" cy="${radialMap(radialP0).y}" r="5"/>`,
    tracks: [pointTrack('.packet', progress => radialMap(cubicPoint(radialP0, radialP1, radialP2, radialP3, progress)))], reducedProgress: 0.8,
  }),
  recipe({
    id: 'flowmotion-swimlane-shard-packet', category: 'data-story',
    title: { ko: '병렬 샤드 패킷', en: 'Parallel Shard Packet' },
    summary: { ko: '검증 단계에서 첫 워커 샤드로 패킷을 전달합니다.', en: 'Delivers a packet from validation to the first worker shard.' },
    durationMs: AMBIENT_MS, templateIds: ['swimlane-etl-funnel'], sourceFile: 'src/components/MultiStyleFlowCanvases.tsx', renderer: 'SwimlaneEtlCanvas', effect: 'stage-two-shard-cubic-packet',
    sourceTimeline: timeline(AMBIENT_MS, 'Shard #01 has y=74, so cy=y+56=130; source loop offset is idx×0.3 with idx=0.', 'computeCubicBezierPath(502,260,548,130,0.5), then getPointAlongCubicBezier(...,ambientProgress).', progress => {
      const point = cubicPoint(swimP0, swimP1, swimP2, swimP3, progress);
      return { t: progress, x: round(point.x), y: round(point.y) };
    }),
    label: '검증에서 샤드로 분기하는 패킷',
    body: `${node(18, 108, 74, '검증', '유효성')}${node(228, 44, 74, '샤드 01', '병렬 처리')}<path class="flow" d="${swimCurve}"/><circle class="packet" cx="${swimMap(swimP0).x}" cy="${swimMap(swimP0).y}" r="5"/>`,
    tracks: [pointTrack('.packet', progress => swimMap(cubicPoint(swimP0, swimP1, swimP2, swimP3, progress)))], reducedProgress: 0.8,
  }),
  recipe({
    id: 'flowmotion-agent-ring-orbit', category: 'loops',
    title: { ko: '에이전트 링 궤도 신호', en: 'Agent Ring Orbit Signal' },
    summary: { ko: '다섯 위성 노드를 도는 신호의 원본 각도식을 재생합니다.', en: 'Replays the source angle formula for a signal orbiting five satellites.' },
    durationMs: AMBIENT_MS, templateIds: ['cyclic-agent-ring'], sourceFile: 'src/components/MultiStyleFlowCanvases.tsx', renderer: 'CyclicAgentRingCanvas', effect: 'orbiting-signal-angle',
    sourceTimeline: timeline(AMBIENT_MS, 'The ambient cycle is 2,400ms; source ring center=(560,266), radius=210.', 'signalAngle=ambientProgress×2π−π/2; x=cx+cos(angle)×radius, y=cy+sin(angle)×radius.', progress => {
      const angle = progress * Math.PI * 2 - Math.PI / 2;
      return { angleDeg: round(angle * 180 / Math.PI), x: round(560 + Math.cos(angle) * 210), y: round(266 + Math.sin(angle) * 210) };
    }),
    label: '위성 노드를 도는 신호',
    body: `<circle class="flow" cx="160" cy="88" r="59"/>${[0, 72, 144, 216, 288].map(degree => { const angle = (degree - 90) * Math.PI / 180; return `<circle class="node-bg" cx="${round(160 + Math.cos(angle) * 59)}" cy="${round(88 + Math.sin(angle) * 59)}" r="8"/>`; }).join('')}<circle class="packet" cx="160" cy="29" r="5"/>${text(160, 169, '위성 링', 'small')}`,
    tracks: [pointTrack('.packet', progress => { const angle = progress * Math.PI * 2 - Math.PI / 2; return { x: 160 + Math.cos(angle) * 59, y: 88 + Math.sin(angle) * 59 }; })],
  }),
  recipe({
    id: 'flowmotion-region-tree-pulse', category: 'particles',
    title: { ko: '리전 트리 경로 펄스', en: 'Region Tree Path Pulse' },
    summary: { ko: '서울 리전 연결을 따라 원본의 비선형 x 진행식을 따릅니다.', en: 'Follows the Seoul region link with the source nonlinear x progression.' },
    durationMs: AMBIENT_MS, templateIds: ['vertical-region-tree'], sourceFile: 'src/components/MultiStyleFlowCanvases.tsx', renderer: 'VerticalRegionTreeCanvas', effect: 'root-to-region-pulse',
    sourceTimeline: timeline(AMBIENT_MS, 'Root=(560,92), Seoul region center x=230; the visible route starts at y=112.', 't=(ambientProgress+idx×0.25)%1; x=560+(230−560)×t^1.2; y=112+72×t.', progress => {
      const sourcePoint = treePoint(progress);
      const point = treeMap(sourcePoint);
      return { t: mod1(progress), sourceX: round(sourcePoint.x), sourceY: round(sourcePoint.y), x: round(point.x), y: round(point.y) };
    }),
    label: '루트에서 리전으로 흐르는 펄스',
    body: `<path class="flow" d="M 244 54 C 244 93 76 93 76 132"/>${node(214, 29, 62, '루트', '분배')}${node(45, 119, 62, '서울', '리전')}<circle class="packet" cx="244" cy="54" r="5"/>`,
    tracks: [pointTrack('.packet', progress => treeMap(treePoint(progress)), 61, cyclicBreaks(1, 0.25))], reducedProgress: 0.7,
  }),
  recipe({
    id: 'flowmotion-chevron-wavefront', category: 'data-story',
    title: { ko: '퍼널 단계 웨이브', en: 'Funnel Stage Wavefront' },
    summary: { ko: '다섯 단계 지표 위를 이동하는 원본 신호 펄스를 재생합니다.', en: 'Replays the source signal pulse moving across five funnel stages.' },
    durationMs: AMBIENT_MS, templateIds: ['ppt-chevron-funnel'], sourceFile: 'src/components/PptInfographicCanvases.tsx', renderer: 'PptChevronFunnelCanvas', effect: 'five-chevron-wavefront',
    sourceTimeline: timeline(AMBIENT_MS, 'PptChevronFunnelCanvas uses five waves and one signal pulse.', 'activeWaveIndex=floor(progress×5); signalX=40+progress×1000, y=38.', progress => ({ activeWaveIndex: Math.min(4, Math.floor(Math.min(progress, 0.999999) * 5)), sourceX: 40 + progress * 1000, x: 28 + progress * 264 })),
    label: '다섯 단계 퍼널을 가로지르는 신호',
    body: `<path class="flow" d="M 28 52 H 292"/>${[0, 1, 2, 3, 4].map(index => `<path class="node-bg" d="M ${34 + index * 52} 32 h34 l9 12 -9 12 h-34 l9 -12 z"/>`).join('')}<circle class="packet" cx="28" cy="52" r="5"/>${text(160, 91, '01 → 05', 'small')}`,
    tracks: [pointTrack('.packet', progress => ({ x: 28 + progress * 264, y: 52 }))],
  }),
  recipe({
    id: 'flowmotion-sequence-step-packet', category: 'data-story',
    title: { ko: '순차 결제 단계 패킷', en: 'Sequential Payment Step Packet' },
    summary: { ko: '다섯 단계 중 활성 경로의 신호만 이동하고 나머지는 중간 지점에 둡니다.', en: 'Moves only the active signal across five steps while other signals hold at their midpoints.' },
    durationMs: AMBIENT_MS, templateIds: ['ppt-sequence-flowchart'], sourceFile: 'src/components/PptInfographicCanvases.tsx', renderer: 'PptSequenceFlowchartCanvas', effect: 'active-sequence-step-travel',
    sourceTimeline: timeline(AMBIENT_MS, 'Five source steps run across one 2,400ms ambient pass.', 'activeStepIdx=floor(progress×steps.length); localT=(progress×steps.length)%1; active dot interpolates fromX→toX, idle dots stay at 0.5.', progress => ({ activeStepIdx: sequenceIndex(progress), localT: round(sequenceLocal(progress)) }), [0, 0.2, 0.4, 0.6, 0.8, 1]),
    label: '결제 단계를 따라 이동하는 신호',
    body: sequenceSteps.map((step, index) => {
      const x1 = sequenceMapX(step.fromX); const x2 = sequenceMapX(step.toX); const y = sequenceMapY(step.y);
      return `<line class="flow seq-line-${index}" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke-width="2.2"/><circle class="packet seq-dot-${index}" cx="${(x1 + x2) / 2}" cy="${y}" r="4"/>`;
    }).join('') + text(160, 169, '인증 · 승인 · 원장 · 완료', 'small'),
    tracks: [...sequenceLineTracks, ...sequenceDotTracks], reducedProgress: 0.5,
  }),
  recipe({
    id: 'flowmotion-bridge-throughput', category: 'data-story',
    title: { ko: '전후 처리량 브리지', en: 'Before and After Throughput Bridge' },
    summary: { ko: '병목 구간과 고속 구간의 입자를 서로 다른 속도대로 전달합니다.', en: 'Moves particles through bottleneck and high-throughput spans at the source pace.' },
    durationMs: AMBIENT_MS, templateIds: ['ppt-asis-tobe-bridge'], sourceFile: 'src/components/PptInfographicCanvases.tsx', renderer: 'PptAsIsToBeBridgeCanvas', effect: 'before-after-stream-particles',
    sourceTimeline: timeline(AMBIENT_MS, 'The three source rows stagger by idx×0.3; this preview isolates row zero.', 'p1=340+((progress+0×0.3)%1)×90; p2=690+((progress+0×0.3)%1)×90.', progress => ({ localT: mod1(progress), beforeX: 340 + mod1(progress) * 90, afterX: 690 + mod1(progress) * 90 })),
    label: '병목에서 개선 구간으로 이어지는 데이터',
    body: `${text(55, 48, '이전', 'label')}${text(265, 48, '이후', 'label')}<line class="danger-line" x1="66" y1="86" x2="128" y2="86" stroke-width="2.5" stroke-dasharray="5 5"/><line class="accent-line" x1="192" y1="86" x2="254" y2="86" stroke-width="3" stroke-dasharray="6 4"/><circle class="danger" cx="66" cy="86" r="5"/><circle class="packet" cx="192" cy="86" r="5"/>${text(97, 111, '병목', 'small')}${text(223, 111, '고속', 'small')}`,
    tracks: [pointTrack('.danger', progress => ({ x: 66 + mod1(progress) * 62, y: 86 })), pointTrack('.packet', progress => ({ x: 192 + mod1(progress) * 62, y: 86 }))],
  }),
  recipe({
    id: 'flowmotion-roadmap-beacon', category: 'data-story',
    title: { ko: '마일스톤 S 커브 비콘', en: 'Milestone S-Curve Beacon' },
    summary: { ko: '원본 로지스틱 S 커브의 시간 진행에 맞춰 비콘을 이동합니다.', en: 'Moves a beacon along the source logistic S-curve progression.' },
    durationMs: AMBIENT_MS, templateIds: ['ppt-milestone-roadmap'], sourceFile: 'src/components/PptInfographicCanvases.tsx', renderer: 'PptMilestoneRoadmapCanvas', effect: 'milestone-s-curve-beacon',
    sourceTimeline: timeline(AMBIENT_MS, 'The current-quarter example caps progress at maxT=0.68.', 't=progress×0.68; x=80+t×940; sRatio=1/(1+exp(−8×(t−0.52))); y=468−sRatio×148.', progress => {
      const t = progress * 0.68; const sRatio = 1 / (1 + Math.exp(-8 * (t - 0.52)));
      return { t: round(t), x: round(80 + t * 940), y: round(468 - sRatio * 148) };
    }),
    label: 'S 커브를 따라가는 분기 비콘',
    body: `<path class="flow" d="M 30 138 C 92 138 89 126 155 112 S 231 54 290 52"/><circle class="packet" cx="30" cy="138" r="5"/>${text(35, 158, '시작', 'small', 'start')}${text(288, 40, '완료', 'small', 'end')}`,
    tracks: [pointTrack('.packet', progress => { const t = progress * 0.68; const sRatio = 1 / (1 + Math.exp(-8 * (t - 0.52))); return { x: 30 + t * 260, y: 138 - sRatio * 86 }; })],
  }),
  recipe({
    id: 'flowmotion-zigzag-ribbon-packets', category: 'particles',
    title: { ko: '지그재그 리본 패킷', en: 'Zigzag Ribbon Packets' },
    summary: { ko: '다섯 선분으로 이어진 원본 리본 위에서 세 패킷을 위상차로 이동합니다.', en: 'Moves three phase-offset packets across the source five-segment ribbon.' },
    durationMs: AMBIENT_MS, templateIds: ['creative-zigzag-ribbon'], sourceFile: 'src/components/CreativeInfographicCanvases.tsx', renderer: 'CreativeZigzagRibbonCanvas', effect: 'three-phase-ribbon-wave',
    sourceTimeline: timeline(AMBIENT_MS, 'The source polyline uses five linear segments and packet offsets 0, 0.33, 0.66.', 'getWavePoint(t): scaled=mod1(t); idx=floor(scaled×5); localT=scaled×5−idx; interpolate adjacent points.', progress => ({ points: [0, 0.33, 0.66].map(phase => { const source = sourceWavePoint(progress + phase); return { x: round(source.x), y: round(source.y) }; }) })),
    label: '리본 곡선을 따라가는 세 신호',
    body: `<path class="flow" d="${zigzagPath}"/>${[0, 0.33, 0.66].map((phase, index) => { const point = zigzagMap(sourceWavePoint(phase)); return `<circle class="packet ribbon-${index}" cx="${point.x}" cy="${point.y}" r="5"/>`; }).join('')}`,
    tracks: [0, 0.33, 0.66].map((phase, index) => pointTrack(`.ribbon-${index}`, progress => zigzagMap(sourceWavePoint(progress + phase)))),
  }),
  recipe({
    id: 'flowmotion-brainstorm-elbow-spark', category: 'particles',
    title: { ko: '브레인스토밍 엘보 스파크', en: 'Brainstorm Elbow Spark' },
    summary: { ko: '중앙 허브에서 아이디어 카드까지 두 구간 꺾임 경로로 이동합니다.', en: 'Moves from the central hub to an idea card along the source two-segment elbow.' },
    durationMs: AMBIENT_MS, templateIds: ['creative-lightbulb-brainstorm'], sourceFile: 'src/components/CreativeInfographicCanvases.tsx', renderer: 'CreativeLightbulbBrainstormCanvas', effect: 'radiating-elbow-spark',
    sourceTimeline: timeline(AMBIENT_MS, 'Source branch 01: anchor=(465,185), elbow=(365,112), end=(cardX+272,elbowY)=(304,112).', 'localT=(ambientProgress+idx×0.16)%1; first half interpolates anchor→elbow; second half elbow→end.', progress => {
      const source = sparkSourcePoint(progress); const point = sparkMap(source);
      return { localT: mod1(progress), sourceX: round(source.x), sourceY: round(source.y), x: round(point.x), y: round(point.y) };
    }),
    label: '아이디어 허브에서 카드로 가는 신호',
    body: `<path class="flow" d="M 247 137 L 140 57 L 75 57"/><circle class="packet" cx="247" cy="137" r="5"/>${node(14, 41, 64, '아이디어', '카드')}${node(227, 119, 74, '허브', '브레인스토밍')}`,
    tracks: [pointTrack('.packet', progress => sparkMap(sparkSourcePoint(progress)))],
  }),
  recipe({
    id: 'flowmotion-pyramid-climb', category: 'particles',
    title: { ko: '전략 피라미드 상승 펄스', en: 'Strategy Pyramid Climb Pulse' },
    summary: { ko: '상향 진행의 원본 선형식을 따라 계층 축을 오릅니다.', en: 'Climbs the tier axis using the source linear upward progression.' },
    durationMs: AMBIENT_MS, templateIds: ['creative-strategy-pyramid'], sourceFile: 'src/components/CreativeInfographicCanvases.tsx', renderer: 'CreativeStrategyPyramidCanvas', effect: 'pyramid-energy-pulse',
    sourceTimeline: timeline(AMBIENT_MS, 'Bottom-up strategy scenario; source axis spans y=450 to y=95.', 'pulseY=450−ambientProgress×355; activeTierIdx=3−floor(progress×4).', progress => ({ pulseY: round(450 - progress * 355), activeTierIdx: 3 - Math.min(3, Math.floor(Math.min(progress, 0.999999) * 4)) })),
    label: '전략 단계 축을 오르는 에너지',
    body: `<path class="flow" d="M 160 42 L 111 136 L 209 136 Z"/><line class="flow" x1="123" y1="112" x2="197" y2="112"/><line class="flow" x1="135" y1="88" x2="185" y2="88"/><line class="flow" x1="147" y1="65" x2="173" y2="65"/><circle class="packet" cx="160" cy="136" r="6"/>${text(160, 160, '01 → 04', 'small')}`,
    tracks: [pointTrack('.packet', progress => ({ x: 160, y: 136 - progress * 94 }))],
  }),
  recipe({
    id: 'flowmotion-semicircle-radar', category: 'data-story',
    title: { ko: '반원 레이더 스윕', en: 'Semicircle Radar Sweep' },
    summary: { ko: '175도에서 5도까지 내려오는 원본 바늘과 다섯 구간 인덱스를 재생합니다.', en: 'Replays the source needle sweep from 175° to 5° across five wedges.' },
    durationMs: AMBIENT_MS, templateIds: ['creative-semicircle-radial-fan'], sourceFile: 'src/components/CreativeInfographicCanvases.tsx', renderer: 'CreativeSemicircleRadialFanCanvas', effect: 'radar-needle-sweep',
    sourceTimeline: timeline(AMBIENT_MS, 'Source center=(565,445), tip radius=rOuter+14=242.', 'sweepDeg=175−progress×170; x=cx+242×cos(angle), y=cy−242×sin(angle); wedgeIdx=min(4,floor(progress×5)).', progress => {
      const sweepDeg = 175 - progress * 170; const radians = sweepDeg * Math.PI / 180;
      return { sweepDeg: round(sweepDeg), needleX: round(565 + 242 * Math.cos(radians)), needleY: round(445 - 242 * Math.sin(radians)), activeWedgeIdx: Math.min(4, Math.floor(Math.min(progress, 0.999999) * 5)) };
    }),
    label: '반원 지표를 훑는 레이더 바늘',
    body: `<path class="flow" d="M 70 151 A 90 90 0 0 1 250 151"/><line class="flow" x1="70" y1="151" x2="250" y2="151"/><line class="accent-line" x1="160" y1="151" x2="73" y2="159" stroke-width="2.5"/><circle class="packet" cx="73" cy="159" r="5"/>${text(160, 172, '지표 스윕', 'small')}`,
    tracks: [pointTrack('.packet', progress => { const radians = (175 - progress * 170) * Math.PI / 180; return { x: 160 + 90 * Math.cos(radians), y: 151 - 90 * Math.sin(radians) }; })],
  }),
  recipe({
    id: 'flowmotion-hexagon-synapse-packet', category: 'particles',
    title: { ko: '육각 시냅스 패킷', en: 'Hexagon Synapse Packet' },
    summary: { ko: '첫 두 육각 셀 사이 연결을 원본의 두 배 주기로 왕복합니다.', en: 'Moves across the first two hex cells at the source doubled cycle rate.' },
    durationMs: AMBIENT_MS, templateIds: ['creative-hexagon-honeycomb'], sourceFile: 'src/components/CreativeInfographicCanvases.tsx', renderer: 'CreativeHexagonHoneycombCanvas', effect: 'intercell-synapse-packet',
    sourceTimeline: timeline(AMBIENT_MS, 'Source cells are (165,235) and (365,345); link index i=0.', 'localT=(ambientProgress×2+i×0.25)%1; x/y interpolate between adjacent cell centers.', progress => {
      const localT = mod1(progress * 2); const point = { x: 165 + (365 - 165) * localT, y: 235 + (345 - 235) * localT };
      const mapped = mapPoint(point, { x0: 165, x1: 365, y0: 235, y1: 345 }, { x0: 74, x1: 246, y0: 64, y1: 139 });
      return { localT: round(localT), sourceX: round(point.x), sourceY: round(point.y), x: round(mapped.x), y: round(mapped.y) };
    }),
    label: '인접한 육각 셀 사이 신호 전달',
    body: `<polygon class="node-bg" points="60,64 67,52 81,52 88,64 81,76 67,76"/><polygon class="node-bg" points="232,139 239,127 253,127 260,139 253,151 239,151"/><line class="flow" x1="74" y1="64" x2="246" y2="139"/><circle class="packet" cx="74" cy="64" r="5"/>${text(74, 91, '01', 'small')}${text(246, 172, '02', 'small')}`,
    tracks: [pointTrack('.packet', progress => {
      const t = mod1(progress * 2); const source = { x: 165 + 200 * t, y: 235 + 110 * t };
      return mapPoint(source, { x0: 165, x1: 365, y0: 235, y1: 345 }, { x0: 74, x1: 246, y0: 64, y1: 139 });
    }, 65, cyclicBreaks(2))],
  }),
  recipe({
    id: 'flowmotion-editorial-layer-scan', category: 'loops',
    title: { ko: '신경망 레이어 순차 강조', en: 'Neural Layer Scan' },
    summary: { ko: '세 레이어를 800ms 간격으로 순환 강조합니다.', en: 'Cycles focus across three layers at 800ms intervals.' },
    durationMs: AMBIENT_MS, templateIds: ['editorial-mcp-skill-compare'], sourceFile: 'src/components/EditorialMcpSkillCanvas.tsx', renderer: 'EditorialMcpSkillCanvas', effect: 'three-layer-active-scan',
    sourceTimeline: timeline(AMBIENT_MS, 'NeuralNetCircleSvg divides the 2,400ms ambient cycle into three active layers.', 'activeLayer=floor(ambientProgress×3)%3; source columns contain 3,4,3 nodes.', progress => ({ activeLayer: Math.floor(Math.min(progress, 0.999999) * 3) % 3 }), [0, 1 / 3, 2 / 3, 1]),
    label: '신경망 세 레이어 활성 순환',
    body: [3, 4, 3].map((count, column) => `<g class="layer layer-${column}">${Array.from({ length: count }, (_, index) => `<circle class="node-bg" cx="${82 + column * 78}" cy="${54 + index * (72 / Math.max(1, count - 1))}" r="7"/>`).join('')}</g>`).join('') + `<path class="flow" d="M 89 90 L 159 54 M 89 90 L 159 90 M 89 90 L 159 126 M 159 54 L 237 90 M 159 90 L 237 90 M 159 126 L 237 90"/>${text(160, 162, '입력 → 처리 → 응답', 'small')}`,
    tracks: [0, 1, 2].map(index => {
      const points = [0, 1 / 3 - 0.0001, 1 / 3 + 0.0001, 2 / 3 - 0.0001, 2 / 3 + 0.0001, 1];
      return track(`.layer-${index}`, points.map(progress => ({ offset: progress, opacity: Math.floor(Math.min(progress, 0.999999) * 3) % 3 === index ? 1 : 0.28 })));
    }), reducedProgress: 0.5,
  }),
  recipe({
    id: 'flowmotion-editorial-skill-packet', category: 'svg-path',
    title: { ko: '스킬 카드 베지어 패킷', en: 'Skill Card Bezier Packet' },
    summary: { ko: '스킬 카드에서 AI 허브까지 원본 이차 베지어 곡선을 따라 이동합니다.', en: 'Moves from the skill card to the AI hub along the source quadratic Bezier curve.' },
    durationMs: AMBIENT_MS, templateIds: ['editorial-mcp-skill-compare'], sourceFile: 'src/components/EditorialMcpSkillCanvas.tsx', renderer: 'EditorialMcpSkillCanvas', effect: 'skill-to-hub-quadratic-packet',
    sourceTimeline: timeline(AMBIENT_MS, 'Source quadratic path: start=(256,132), control=(294,102), end=(332,118).', 'localT=(ambientProgress×1.4)%1; quadratic Bernstein interpolation with inv=1−localT.', progress => {
      const t = mod1(progress * 1.4); const inv = 1 - t;
      const source = { x: inv * inv * editorialStart.x + 2 * inv * t * editorialControl.x + t * t * editorialEnd.x, y: inv * inv * editorialStart.y + 2 * inv * t * editorialControl.y + t * t * editorialEnd.y };
      const point = editorialMap(source);
      return { localT: round(t), sourceX: round(source.x), sourceY: round(source.y), x: round(point.x), y: round(point.y) };
    }, [0, 0.25, 0.5, 5 / 7, 0.75, 1]),
    label: '스킬 카드에서 허브로 이동하는 패킷',
    body: `${node(18, 105, 76, '스킬', '절차 안내')}${node(226, 46, 76, 'AI 허브', '도구 호출')}<path class="flow" d="${editorialCurve}"/><circle class="packet" cx="${editorialMap(editorialStart).x}" cy="${editorialMap(editorialStart).y}" r="5"/>`,
    tracks: [pointTrack('.packet', progress => {
      const t = mod1(progress * 1.4); const inv = 1 - t;
      const source = { x: inv * inv * editorialStart.x + 2 * inv * t * editorialControl.x + t * t * editorialEnd.x, y: inv * inv * editorialStart.y + 2 * inv * t * editorialControl.y + t * t * editorialEnd.y };
      return editorialMap(source);
    }, 65, cyclicBreaks(1.4))], reducedProgress: 0.5,
  }),
  recipe({
    id: 'flowmotion-pms-milestone-progress', category: 'data-story',
    title: { ko: 'PMS 마일스톤 진행선', en: 'PMS Milestone Progress Line' },
    summary: { ko: '네 핀을 연결하는 진행선과 비콘을 원본 선형식으로 이동합니다.', en: 'Moves the progress line and beacon across four milestones using the source linear formula.' },
    durationMs: AMBIENT_MS, templateIds: ['it-pms-project'], sourceFile: 'src/components/ItWorkflowEditorialCanvases.tsx', renderer: 'ItWorkflowEditorialCanvases', effect: 'milestone-track-fill',
    sourceTimeline: timeline(AMBIENT_MS, 'PMS layout source track spans x=155 to x=935.', 'x=155+ambientProgress×780; both fill line end and beacon use the same coordinate.', progress => ({ x: round(155 + progress * 780), fillWidth: round(progress * 780) })),
    label: '프로젝트 마일스톤 진행',
    body: `<line class="flow" x1="38" y1="82" x2="282" y2="82" stroke-width="3" stroke-dasharray="8 6"/><line class="accent-line" x1="38" y1="82" x2="38" y2="82" stroke-width="3.5"/><circle class="packet" cx="38" cy="82" r="5"/>${[38, 119, 201, 282].map((x, index) => `<circle class="node-bg" cx="${x}" cy="82" r="8"/>${text(x, 111, `0${index + 1}`, 'small')}`).join('')}`,
    tracks: [valueTrack('.accent-line', progress => ({ x2: `${round(38 + progress * 244)}px` })), pointTrack('.packet', progress => ({ x: 38 + progress * 244, y: 82 }))],
  }),
  recipe({
    id: 'flowmotion-chatops-satellite-packet', category: 'particles',
    title: { ko: 'ChatOps 위성 패킷', en: 'ChatOps Satellite Packet' },
    summary: { ko: '중앙 허브에서 배포 알림 채널까지 원본 비율로 패킷을 보냅니다.', en: 'Sends a packet from the central hub to the release-alert satellite at the source rate.' },
    durationMs: AMBIENT_MS, templateIds: ['it-slack-chatops'], sourceFile: 'src/components/ItWorkflowEditorialCanvases.tsx', renderer: 'ItWorkflowEditorialCanvases', effect: 'chatops-radiating-packet',
    sourceTimeline: timeline(AMBIENT_MS, 'Source first satellite=(485,64), hub=(270,215), idx=0.', 't=(ambientProgress×1.8+idx×0.25)%1; packet x/y interpolates from hub center to satellite.', progress => {
      const t = mod1(progress * 1.8); const point = { x: 270 + (485 - 270) * t, y: 215 + (64 - 215) * t };
      const mapped = mapPoint(point, { x0: 270, x1: 485, y0: 64, y1: 215 }, { x0: 76, x1: 246, y0: 53, y1: 133 });
      return { localT: round(t), sourceX: round(point.x), sourceY: round(point.y), x: round(mapped.x), y: round(mapped.y) };
    }, [0, 0.25, 5 / 9, 0.75, 1]),
    label: '중앙 허브에서 채널 위성으로 이동',
    body: `${node(36, 122, 80, '중앙 허브', '조정 봇')}${node(221, 35, 82, '채널', '배포 알림')}<line class="flow" x1="76" y1="133" x2="246" y2="53"/><circle class="packet" cx="76" cy="133" r="5"/>`,
    tracks: [pointTrack('.packet', progress => {
      const t = mod1(progress * 1.8); const source = { x: 270 + 215 * t, y: 215 - 151 * t };
      return mapPoint(source, { x0: 270, x1: 485, y0: 64, y1: 215 }, { x0: 76, x1: 246, y0: 53, y1: 133 });
    }, 65, cyclicBreaks(1.8))], reducedProgress: 0.5,
  }),
];
