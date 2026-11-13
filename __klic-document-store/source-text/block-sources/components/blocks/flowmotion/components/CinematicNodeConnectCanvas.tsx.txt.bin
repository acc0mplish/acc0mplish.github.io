import React, { useEffect, useId, useRef, useState, useCallback } from 'react';
import { FlowTemplate, FlowScenario } from '../utils/flowEngine';

interface CinematicNodeConnectCanvasProps {
  template: FlowTemplate;
  scenario: FlowScenario;
  selectedNodeId: string | null;
  replayTriggerCount: number;
  onSelectNode: (nodeId: string) => void;
  reducedMotion?: boolean;
  autoPlay?: boolean;
}

const EFFECTS_LIST: Array<[string, string]> = [
  ['draw', '엣지 draw-on'],
  ['glow', '엣지 블러 글로우'],
  ['spark', '번개 스파크'],
  ['pop', '체크 pop'],
  ['gold', '완료 골드 글로우'],
  ['cam', '시네마틱 카메라'],
  ['flow', '대시 흐름'],
  ['particle', '이동 입자'],
  ['arrowpop', '화살촉 pop'],
  ['breath', '출력 핸들 호흡'],
  ['hover', '호버 리프트+링'],
  ['shine', '카드 빛 스윕'],
  ['grid', '패럴랙스 그리드'],
  ['dust', '부유 먼지'],
  ['ripple', '도착 리플'],
  ['enter', '순차 등장'],
  ['type', '상태 타자기'],
  ['pulse', '완료 펄스+컨페티'],
  ['drag', '노드 드래그'],
  ['bar', '진행 바'],
];

interface DiagramNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  c: string;
  title: string;
  body?: string[];
  kv?: Array<[string, string]>;
  rows?: string[];
  status?: string;
}

interface DiagramEdge {
  from: string;
  to: string;
  row: number;
  c: string;
  mid: [number, number];
  tgt: [number, number];
}

export const CinematicNodeConnectCanvas: React.FC<CinematicNodeConnectCanvasProps> = ({
  scenario,
  selectedNodeId,
  replayTriggerCount,
  onSelectNode,
  reducedMotion = false,
  autoPlay = false,
}) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gGridRef = useRef<SVGGElement | null>(null);
  const gDustRef = useRef<SVGGElement | null>(null);
  const gEdgesRef = useRef<SVGGElement | null>(null);
  const gNodesRef = useRef<SVGGElement | null>(null);
  const gFxRef = useRef<SVGGElement | null>(null);

  const [fxState, setFxState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(EFFECTS_LIST.map(([k]) => [k, true]))
  );
  const fxRef = useRef(fxState);
  fxRef.current = fxState;

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [cameraHudText, setCameraHudText] = useState<string>('1.00x · Full Stage');
  const playTokenRef = useRef<number>(0);
  const previousReplayCountRef = useRef(replayTriggerCount);
  const svgIdPrefix = useId().replace(/:/g, '');
  const paintId = (name: string) => `${svgIdPrefix}-${name}`;

  const isKoreanScenario = scenario.activeEdges.includes('kor');
  const isMacroZoom = scenario.activeEdges.includes('1.65x');
  const targetZoomFactor = isMacroZoom ? 1.65 : 1.32;

  const onSelectNodeRef = useRef(onSelectNode);
  onSelectNodeRef.current = onSelectNode;

  const NODES: DiagramNode[] = isKoreanScenario
    ? [
        {
          id: 'prompt', x: 60, y: 40, w: 320, h: 150, c: 'var(--fm-warning)',
          title: '시스템 프롬프트 (Prompt)',
          body: ['엔터프라이즈 금융·법무 도메인 컨텍스트.', '근거 문서 출처 강제 및 할루시네이션 차단.'],
        },
        {
          id: 'proc', x: 800, y: 40, w: 320, h: 200, c: 'var(--fm-warning)',
          title: '통합 추론 엔진 (Processing)',
          rows: ['프롬프트 컨텍스트', '벡터 임베딩 시드', '추론 스케줄러'],
          status: '입력 스트림 대기 중...',
        },
        {
          id: 'noise', x: 60, y: 460, w: 320, h: 110, c: 'var(--fm-danger)',
          title: '벡터 시드 (Vector Seed)', kv: [['index_shard', '432512 · HNSW']],
        },
        {
          id: 'samp', x: 440, y: 460, w: 320, h: 110, c: 'var(--fm-accent)',
          title: '샘플러 (Sampler)', kv: [['scheduler', 'euler · 24 steps']],
        },
      ]
    : [
        {
          id: 'prompt', x: 60, y: 40, w: 320, h: 150, c: 'var(--fm-warning)',
          title: 'Prompt',
          body: ['A quiet world, in vivid color. Soft light,', 'subtle textures, a little unexpected magic.'],
        },
        {
          id: 'proc', x: 800, y: 40, w: 320, h: 200, c: 'var(--fm-warning)',
          title: 'Processing', rows: ['conditioning', 'noise', 'sampler'], status: 'Awaiting inputs',
        },
        {
          id: 'noise', x: 60, y: 460, w: 320, h: 110, c: 'var(--fm-danger)',
          title: 'Random noise', kv: [['seed', '432512']],
        },
        {
          id: 'samp', x: 440, y: 460, w: 320, h: 110, c: 'var(--fm-accent)',
          title: 'Sampler', kv: [['scheduler', 'euler · 24 steps']],
        },
      ];
  const EDGES: DiagramEdge[] = [
    { from: 'prompt', to: 'proc', row: 0, c: 'var(--fm-warning)', mid: [600, 115], tgt: [800, 115] },
    { from: 'noise', to: 'proc', row: 1, c: 'var(--fm-danger)', mid: [600, 340], tgt: [800, 150] },
    { from: 'samp', to: 'proc', row: 2, c: 'var(--fm-accent)', mid: [775, 355], tgt: [800, 185] },
  ];

  // Store imperative API refs so React buttons can trigger camera zoom or replay
  const apiRef = useRef<{
    play: () => void;
    reset: (fit?: boolean) => void;
    focusNode: (nodeId: string, z?: number) => void;
  } | null>(null);

  const byId: Record<string, DiagramNode> = Object.fromEntries(
    NODES.map((n) => [n.id, n])
  );
  const centerOf = (n: DiagramNode) => ({ x: n.x + n.w / 2, y: n.y + n.h / 2 });
  const tgtPt = (n: DiagramNode, row: number) => ({ x: n.x, y: n.y + 68 + row * 34 });
  const ARROW_LEN = 14;
  const ARROW_W = 12;
  const edgeGeom = (edge: DiagramEdge) => {
    const source = byId[edge.from];
    const target = byId[edge.to];
    const start = { x: source.x + source.w, y: source.y + source.h / 2 };
    const tip = { x: target.x, y: tgtPt(target, edge.row).y };
    const base = { x: tip.x - ARROW_LEN, y: tip.y };
    const dx = Math.max(20, Math.min(80, (base.x - start.x) * 0.5));
    const d = `M ${start.x} ${start.y} C ${start.x + dx} ${start.y}, ${base.x - dx} ${base.y}, ${base.x} ${base.y}`;
    const previous = { x: base.x - dx, y: base.y };
    return { d, tip, ang: Math.atan2(base.y - previous.y, base.x - previous.x) };
  };
  const arrowPoints = (geometry: { tip: { x: number; y: number }; ang: number }) => {
    const c = Math.cos(geometry.ang);
    const s = Math.sin(geometry.ang);
    const bx = geometry.tip.x - ARROW_LEN * c;
    const by = geometry.tip.y - ARROW_LEN * s;
    const px = -s;
    const py = c;
    return [
      `${geometry.tip.x},${geometry.tip.y}`,
      `${bx + (ARROW_W / 2) * px},${by + (ARROW_W / 2) * py}`,
      `${bx - (ARROW_W / 2) * px},${by - (ARROW_W / 2) * py}`,
    ].join(' ');
  };

  useEffect(() => {
    const svg = svgRef.current;
    const gGrid = gGridRef.current;
    const gDust = gDustRef.current;
    const gE = gEdgesRef.current;
    const gN = gNodesRef.current;
    const gFx = gFxRef.current;
    if (!svg || !gGrid || !gDust || !gE || !gN || !gFx) return;

    const NS = 'http://www.w3.org/2000/svg';
    let cancelled = false;
    let typeTimer: number | undefined;
    const ownedTimeouts = new Set<number>();
    const ownedIntervals = new Set<number>();
    const ownedFrames = new Set<number>();
    const pendingSleepFinishers = new Set<() => void>();
    const pendingFrameFinishers = new Set<() => void>();
    const ownedAnimations = new Set<Animation>();

    const schedule = (callback: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        ownedTimeouts.delete(id);
        callback();
      }, ms);
      ownedTimeouts.add(id);
      return id;
    };
    const clearScheduled = (id: number) => {
      window.clearTimeout(id);
      ownedTimeouts.delete(id);
    };
    const interval = (callback: () => void, ms: number) => {
      const id = window.setInterval(callback, ms);
      ownedIntervals.add(id);
      return id;
    };
    const clearOwnedInterval = (id: number | undefined) => {
      if (id === undefined) return;
      window.clearInterval(id);
      ownedIntervals.delete(id);
      if (typeTimer === id) typeTimer = undefined;
    };
    const requestFrame = (callback: FrameRequestCallback) => {
      const id = window.requestAnimationFrame((time) => {
        ownedFrames.delete(id);
        callback(time);
      });
      ownedFrames.add(id);
      return id;
    };

    // Clear previous layers
    gDust.innerHTML = '';
    gE.innerHTML = '';
    gN.innerHTML = '';
    gFx.innerHTML = '';

    const el = (
      t: string,
      a: Record<string, string | number> = {},
      p?: SVGElement | null
    ) => {
      const e = document.createElementNS(NS, t);
      for (const k in a) e.setAttribute(k, String(a[k]));
      if (p) p.appendChild(e);
      return e;
    };

    const txt = (
      x: number,
      y: number,
      s: string,
      a: Record<string, string | number> = {},
      p?: SVGElement | null
    ) => {
      const t = el(
        'text',
        { x, y, fill: 'var(--fm-text)', 'font-size': 13, ...a },
        p
      );
      t.textContent = s;
      return t;
    };

    // ViewBox Camera state
    const FULL = { x: 0, y: 0, w: 1160, h: 660 };
    const vb = { ...FULL };

    const setVB = () => {
      svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
      gGrid.setAttribute('transform', `translate(${vb.x * 0.6},${vb.y * 0.6})`);
      gDust.setAttribute('transform', `translate(${vb.x * 0.3},${vb.y * 0.3})`);
    };

    const animVB = (
      to: { x: number; y: number; w: number; h: number },
      dur: number,
      token: number
    ) =>
      new Promise<void>((res) => {
        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          pendingFrameFinishers.delete(finish);
          res();
        };
        pendingFrameFinishers.add(finish);
        const from = { ...vb };
        const t0 = performance.now();
        function frame(t: number) {
          if (cancelled || token !== playTokenRef.current) {
            finish();
            return;
          }
          const k = Math.min(1, (t - t0) / Math.max(1, dur));
          const e = 1 - Math.pow(1 - k, 3);
          vb.x = from.x + (to.x - from.x) * e;
          vb.y = from.y + (to.y - from.y) * e;
          vb.w = from.w + (to.w - from.w) * e;
          vb.h = from.h + (to.h - from.h) * e;
          setVB();
          if (k < 1) requestFrame(frame);
          else finish();
        }
        requestFrame(frame);
      });

    const sleep = (ms: number, token: number) =>
      new Promise<void>((resolve) => {
        let id = 0;
        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          clearScheduled(id);
          pendingSleepFinishers.delete(finish);
          resolve();
        };
        id = schedule(finish, ms);
        pendingSleepFinishers.add(finish);
        if (cancelled || token !== playTokenRef.current) {
          finish();
        }
      });

    const zoomTo = (
      cx: number,
      cy: number,
      z: number,
      dur = 600,
      token = playTokenRef.current,
      label = ''
    ) => {
      const w = FULL.w / z;
      const h = FULL.h / z;
      if (label) {
        setCameraHudText(`${z.toFixed(2)}x · ${label}`);
      }
      const destination = { x: cx - w / 2, y: cy - h / 2, w, h };
      if (reducedMotion || !fxRef.current.cam) {
        Object.assign(vb, destination);
        setVB();
        return Promise.resolve();
      }
      return animVB(destination, dur, token);
    };

    // Build floating dust particles (deterministic pseudo-random)
    let dustSeed = 42;
    const nextDustRnd = () =>
      ((dustSeed = (dustSeed * 16807) % 2147483647) / 2147483647);

    for (let i = 0; i < 32; i++) {
      const d = el(
        'circle',
        {
          cx: -150 + nextDustRnd() * 1460,
          cy: -100 + nextDustRnd() * 860,
          r: (0.8 + nextDustRnd() * 1.8).toFixed(2),
          fill: 'var(--fm-accent)',
          'fill-opacity': (0.12 + nextDustRnd() * 0.3).toFixed(2),
          class: 'nc-dust',
        },
        gDust
      );
      d.style.setProperty('--dx', (nextDustRnd() * 60 - 30).toFixed(0) + 'px');
      d.style.setProperty('--dy', (nextDustRnd() * 60 - 30).toFixed(0) + 'px');
      d.style.setProperty('--t', (6 + nextDustRnd() * 7).toFixed(1) + 's');
    }

    // Build SVG Nodes
    for (const [ni, n] of NODES.entries()) {
      const g = el(
        'g',
        {
          transform: `translate(${n.x},${n.y})`,
          style: 'cursor:grab',
          'data-node': n.id,
        },
        gN
      );
      const L = el('g', { class: autoPlay && !reducedMotion ? 'nc-lift' : 'nc-lift-static' }, g);
      L.style.setProperty('--d', (ni * 0.12).toFixed(2) + 's');

      const main = el(
        'rect',
        {
          x: 0,
          y: 0,
          width: n.w,
          height: n.h,
          rx: 14,
          fill: `url(#${paintId('card-grad')})`,
          filter: `url(#${paintId('soft-shadow')})`,
        },
        L
      );
      if (n.id === 'proc') main.setAttribute('data-flow-id', 'proc-rect');

      el(
        'rect',
        {
          x: 0,
          y: 0,
          width: n.w,
          height: n.h,
          rx: 14,
          fill: 'var(--fm-surface)',
          filter: `url(#${paintId('grain')})`,
          'clip-path': `url(#${paintId(`clip-${n.id}`)})`,
        },
        L
      );
      el(
        'line',
        {
          x1: 8,
          y1: 1,
          x2: n.w - 8,
          y2: 1,
          stroke: 'var(--fm-surface)',
          'stroke-opacity': 0.14,
          'stroke-width': 1,
          'stroke-linecap': 'round',
        },
        L
      );

      txt(22, 32, n.title, { 'font-size': 17, 'font-weight': 700 }, L);
      let yy = 58;
      (n.body || []).forEach((l) => {
        txt(22, yy, l, { fill: 'var(--fm-muted)', 'font-size': 13.5 }, L);
        yy += 20;
      });
      (n.kv || []).forEach(([k, v]) => {
        txt(22, yy, k, { fill: 'var(--fm-muted)', 'font-size': 12 }, L);
        txt(125, yy, v, { fill: 'var(--fm-text)', 'font-size': 13 }, L);
        yy += 22;
      });
      if (n.rows) {
        n.rows.forEach((r, i) => {
          txt(22, 68 + i * 34, r, { fill: 'var(--fm-text)', 'font-size': 13.5 }, L);
          const c = txt(
            n.w - 30,
            68 + i * 34,
            '✓',
            { fill: 'var(--fm-accent)', 'font-size': 14, class: 'nc-check' },
            L
          );
          c.setAttribute('data-flow-id', `check-${i}`);
        });
      }
      if (n.status) {
        const s = txt(
          22,
          n.h - 22,
          n.status,
          { fill: 'var(--fm-muted)', 'font-size': 12.5 },
          L
        );
        s.setAttribute('data-flow-id', 'proc-status');
      }

      el(
        'circle',
        {
          cx: n.w,
          cy: n.h / 2,
          r: 5,
          fill: n.c,
          stroke: 'var(--fm-panel)',
          'stroke-width': 2,
        },
        L
      );

      if (n.id === 'proc' && n.rows) {
        n.rows.forEach((_, i) =>
          el(
            'circle',
            {
              cx: 0,
              cy: 68 + i * 34,
              r: 5,
              fill: 'var(--fm-panel)',
              stroke: n.c,
              'stroke-width': 1.5,
            },
            L
          )
        );
        el(
          'rect',
          {
            x: 22,
            y: 152,
            width: n.w - 44,
            height: 5,
            rx: 2.5,
            fill: 'var(--fm-surface)',
            'fill-opacity': 0.08,
            class: 'nc-pbar',
          },
          L
        );
        const pb = el(
          'rect',
          {
            x: 22,
            y: 152,
            width: 0,
            height: 5,
            rx: 2.5,
            fill: 'var(--fm-warning)',
            class: 'nc-pbar',
          },
          L
        );
        pb.setAttribute('data-flow-id', 'pbar');

        el(
          'rect',
          {
            x: -4,
            y: -4,
            width: n.w + 8,
            height: n.h + 8,
            rx: 18,
            fill: 'none',
            stroke: 'var(--fm-warning)',
            'stroke-width': 2,
            class: 'nc-pulse-ring',
            'pointer-events': 'none',
          },
          L
        ).setAttribute('data-flow-id', 'proc-ring');
      } else {
        el(
          'circle',
          {
            cx: n.w,
            cy: n.h / 2,
            r: 5,
            fill: 'none',
            stroke: n.c,
            'stroke-width': 1.5,
            class: 'nc-breath',
          },
          L
        );
      }

      el(
        'rect',
        {
          x: 0,
          y: 0,
          width: n.w,
          height: n.h,
          rx: 14,
          fill: 'none',
          stroke: n.c,
          'stroke-width': 1.5,
          class: 'nc-ring',
          'pointer-events': 'none',
        },
        L
      );

      const sg = el(
        'g',
        {
          'clip-path': `url(#${paintId(`clip-${n.id}`)})`,
          class: 'nc-shineg',
          'pointer-events': 'none',
        },
        L
      );
      el(
        'rect',
        {
          x: -160,
          y: 0,
          width: 140,
          height: n.h,
          fill: `url(#${paintId('shine-gradient')})`,
          class: 'nc-shine',
        },
        sg
      ).style.setProperty('--d', (ni * 0.9).toFixed(1) + 's');
    }

    // Build Edges
    const edgeEls: SVGElement[][] = [];
    const edgeGeomList: Array<{ d: string; tip: { x: number; y: number }; ang: number }> = [];
    const arrowEls: Array<SVGElement | undefined> = [];
    const particleEls: SVGElement[][] = [];

    for (const e of EDGES) {
      const g = edgeGeom(e);
      const glow = el(
        'path',
        {
          d: g.d,
          stroke: e.c,
          class: 'nc-edge nc-edge-glow',
          pathLength: 1,
          filter: `url(#${paintId('blur')})`,
        },
        gE
      );
      glow.style.strokeWidth = '9px';
      glow.style.opacity = '.22';
      const p = el(
        'path',
        { d: g.d, stroke: e.c, class: 'nc-edge', pathLength: 1 },
        gE
      );
      const fl = el('path', { d: g.d, class: 'nc-flowline' }, gE);
      edgeEls.push([glow, p, fl]);
      edgeGeomList.push(g);
    }

    function drawArrow(i: number) {
      const e = EDGES[i];
      const g = edgeGeomList[i];
      const pg = el(
        'polygon',
        { points: arrowPoints(g), fill: e.c, class: 'nc-arrow' },
        gFx
      );
      arrowEls[i] = pg;
    }

    function layoutEdge(i: number) {
      const g = edgeGeom(EDGES[i]);
      edgeGeomList[i] = g;
      edgeEls[i].forEach((p) => p.setAttribute('d', g.d));
      if (arrowEls[i]) arrowEls[i]!.setAttribute('points', arrowPoints(g));
      if (particleEls[i]) particleEls[i].forEach((a) => a.setAttribute('path', g.d));
    }

    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    function spark(x: number, y: number, c: string) {
      const g = el('g', { class: 'nc-spark', stroke: c }, gFx);
      el(
        'circle',
        { cx: x, cy: y, r: 26, fill: c, opacity: 0.3, filter: `url(#${paintId('blur')})` },
        g
      );
      for (let i = 0; i < 7; i++) {
        let a = rnd() * Math.PI * 2;
        let px = x;
        let py = y;
        const pts = [`${px},${py}`];
        for (let j = 0; j < 4; j++) {
          a += (rnd() - 0.5) * 1.4;
          px += Math.cos(a) * (10 + rnd() * 26);
          py += Math.sin(a) * (10 + rnd() * 26);
          pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
        }
        el(
          'polyline',
          { points: pts.join(' '), fill: 'none', 'stroke-width': 2 },
          g
        );
      }
      const cir = el(
        'circle',
        { cx: x, cy: y, r: 6, fill: 'none', stroke: c, 'stroke-width': 2.5 },
        g
      );
      const an = el(
        'animate',
        { attributeName: 'r', from: 6, to: 44, dur: '0.55s', fill: 'freeze' },
        cir
      ) as SVGAnimationElement;
      if (typeof an.beginElement === 'function') an.beginElement();
      schedule(() => {
        g.classList.add('out');
        schedule(() => g.remove(), 500);
      }, 300);
    }

    function ripple(x: number, y: number, c: string) {
      [0, 0.18, 0.36].forEach((d) => {
        const r = el(
          'circle',
          { cx: x, cy: y, r: 60, stroke: c, 'stroke-width': 2, class: 'nc-ripple' },
          gFx
        );
        r.style.setProperty('--d', d + 's');
        schedule(() => r.remove(), 1700);
      });
    }

    function startParticles(i: number) {
      const e = EDGES[i];
      const g = edgeGeomList[i];
      const list: SVGElement[] = [];
      for (let k = 0; k < 2; k++) {
        const pg = el(
          'g',
          { class: 'nc-particle', 'pointer-events': 'none', style: 'opacity:0' },
          gFx
        );
        el(
          'circle',
          { r: 9, fill: e.c, opacity: 0.35, filter: `url(#${paintId('blur')})` },
          pg
        );
        el('circle', { r: 3, fill: 'var(--fm-surface)' }, pg);
        const am = el(
          'animateMotion',
          { path: g.d, dur: '1.7s', repeatCount: 'indefinite', begin: 'indefinite' },
          pg
        ) as SVGAnimationElement;
        schedule(() => {
          if (!pg.isConnected) return;
          if (typeof am.beginElement === 'function') am.beginElement();
          pg.style.opacity = '1';
        }, k * 850);
        list.push(am);
      }
      particleEls[i] = list;
    }

    function setStatus(s: string, color: string) {
      const t = svg?.querySelector('[data-flow-id="proc-status"]');
      if (!t) return;
      clearOwnedInterval(typeTimer);
      t.setAttribute('fill', color);
      if (!fxRef.current.type) {
        t.textContent = s;
        return;
      }
      let i = 0;
      t.textContent = '';
      typeTimer = interval(() => {
        t.textContent = s.slice(0, ++i);
        if (i >= s.length) clearOwnedInterval(typeTimer);
      }, 40);
    }

    function confetti() {
      const n = byId.proc;
      const cx = n.x + n.w / 2;
      const cy = n.y + n.h / 2;
      const cols = ['var(--fm-warning)', 'var(--fm-danger)', 'var(--fm-accent)', 'var(--fm-surface)'];
      for (let i = 0; i < 40; i++) {
        const r = el(
          'rect',
          {
            x: cx - 3,
            y: cy - 3,
            width: 6,
            height: 10,
            fill: cols[i % 4],
            class: 'nc-confetti',
            'pointer-events': 'none',
          },
          gFx
        );
        r.style.transformBox = 'fill-box';
        r.style.transformOrigin = 'center';
        const a = Math.random() * Math.PI * 2;
        const d = 90 + Math.random() * 180;
        if (typeof r.animate === 'function') {
          const animation = r.animate(
            [
              { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
              {
                transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d + 60}px) rotate(${Math.random() * 720}deg)`,
                opacity: 0,
              },
            ],
            {
              duration: 1100 + Math.random() * 700,
              easing: 'cubic-bezier(.2,.8,.3,1)',
              fill: 'forwards',
            }
          );
          ownedAnimations.add(animation);
          animation.onfinish = () => {
            ownedAnimations.delete(animation);
            r.remove();
          };
        }
      }
    }

    function reset(fit = true) {
      if (reducedMotion) {
        Object.assign(vb, FULL);
        setVB();
        setCameraHudText('1.00x · Full Stage');
        setIsPlaying(false);
        return;
      }
      playTokenRef.current += 1;
      setIsPlaying(false);
      edgeEls.forEach((pair) => pair.forEach((p) => p.classList.remove('drawn', 'static')));
      arrowEls.forEach((a) => a && a.remove());
      arrowEls.length = 0;
      gFx
        ?.querySelectorAll('.nc-particle,.nc-confetti,.nc-ripple,.nc-spark')
        .forEach((x) => x.remove());
      particleEls.length = 0;

      const prRing = svg?.querySelector('[data-flow-id="proc-ring"]');
      if (prRing) prRing.classList.remove('on');
      const pb = svg?.querySelector('[data-flow-id="pbar"]');
      if (pb) pb.setAttribute('width', '0');
      const pr = svg?.querySelector('[data-flow-id="proc-rect"]');
      if (pr) pr.setAttribute('filter', `url(#${paintId('soft-shadow')})`);
      EDGES.forEach((e) => {
        const chk = svg?.querySelector(`[data-flow-id="check-${e.row}"]`);
        if (chk) chk.classList.remove('on');
      });
      const s = svg?.querySelector('[data-flow-id="proc-status"]');
      clearOwnedInterval(typeTimer);
      if (s) {
        s.textContent = isKoreanScenario ? '입력 스트림 대기 중...' : 'Awaiting inputs';
        s.setAttribute('fill', 'var(--fm-muted)');
      }
      if (fit) {
        Object.assign(vb, FULL);
        setVB();
        setCameraHudText('1.00x · Full Stage');
      }
    }

    function showCompletedStatic() {
      edgeEls.forEach((pair) => {
        pair.forEach((path) => path.classList.add('drawn', 'static'));
      });
      EDGES.forEach((edge, index) => {
        drawArrow(index);
        arrowEls[index]?.classList.add('static');
        svg?.querySelector(`[data-flow-id="check-${edge.row}"]`)?.classList.add('on', 'static');
      });
      const progress = svg?.querySelector('[data-flow-id="pbar"]');
      progress?.setAttribute('width', String(byId.proc.w - 44));
      const status = svg?.querySelector('[data-flow-id="proc-status"]');
      if (status) {
        status.textContent = isKoreanScenario ? '모든 입력 준비 완료 (All Ready)' : 'All inputs ready';
        status.setAttribute('fill', 'var(--fm-accent)');
      }
      svg?.querySelector('[data-flow-id="proc-ring"]')?.classList.add('on', 'static');
    }

    async function play() {
      if (reducedMotion) return;
      const myToken = ++playTokenRef.current;
      reset(false);
      playTokenRef.current = myToken;
      setIsPlaying(true);

      await sleep(260, myToken);
      if (cancelled || myToken !== playTokenRef.current) return;

      for (let i = 0; i < EDGES.length; i++) {
        const e = EDGES[i];
        const srcNode = byId[e.from];
        const tgtNode = byId[e.to];
        const s = centerOf(srcNode);
        const t = centerOf(tgtNode);

        // 1. Cinematic Camera Zoom-In to Source Node
        await zoomTo(
          s.x,
          s.y,
          targetZoomFactor,
          480,
          myToken,
          `${srcNode.title} 출발 포커스`
        );
        if (cancelled || myToken !== playTokenRef.current) return;

        // 2. Draw Edge & Simultaneously Pan Camera to Target Node (Processing)
        edgeEls[i].forEach((p) => p.classList.add('drawn'));
        await Promise.all([
          sleep(680, myToken),
          zoomTo(
            t.x,
            t.y,
            targetZoomFactor,
            680,
            myToken,
            `${srcNode.title} → ${tgtNode.title} 추적`
          ),
        ]);
        if (cancelled || myToken !== playTokenRef.current) return;

        // 3. Arrowhead Pop + Lightning Spark + Concentric Ripple + Particles + Checkmark Pop
        drawArrow(i);
        const tp = tgtPt(tgtNode, e.row);
        if (fxRef.current.spark) spark(tp.x, tp.y, e.c);
        if (fxRef.current.ripple) ripple(tp.x, tp.y, e.c);
        startParticles(i);

        const chk = svg?.querySelector(`[data-flow-id="check-${e.row}"]`);
        if (chk) chk.classList.add('on');
        const pb = svg?.querySelector('[data-flow-id="pbar"]');
        if (pb) {
          pb.setAttribute(
            'width',
            String(((byId.proc.w - 44) * (i + 1)) / EDGES.length)
          );
        }
        setStatus(
          isKoreanScenario
            ? `스트림 수신 중 ${i + 1}/${EDGES.length} …`
            : `Receiving ${i + 1}/${EDGES.length} …`,
          'var(--fm-muted)'
        );
        await sleep(380, myToken);
        if (cancelled || myToken !== playTokenRef.current) return;
      }

      // 4. Cinematic Camera Zoom-Out to Full ViewBox + Gold Glow + Confetti
      setCameraHudText('1.00x · 전체 완료 뷰 복귀');
      await (fxRef.current.cam
        ? animVB(FULL, 760, myToken)
        : sleep(280, myToken));
      if (cancelled || myToken !== playTokenRef.current) return;

      setStatus(
        isKoreanScenario ? '모든 입력 준비 완료 (All Ready)' : 'All inputs ready',
        'var(--fm-accent)'
      );
      const pr = svg?.querySelector('[data-flow-id="proc-rect"]');
      if (fxRef.current.gold && pr) pr.setAttribute('filter', `url(#${paintId('gold-glow')})`);
      const prRing = svg?.querySelector('[data-flow-id="proc-ring"]');
      if (prRing) prRing.classList.add('on');
      if (fxRef.current.pulse) confetti();

      setIsPlaying(false);
    }

    function focusNode(nodeId: string, z = targetZoomFactor) {
      const n = byId[nodeId];
      if (!n) return;
      onSelectNodeRef.current(nodeId);
      const c = centerOf(n);
      const token = ++playTokenRef.current;
      setIsPlaying(false);
      zoomTo(c.x, c.y, z, 520, token, `${n.title} 클로즈업`);
    }

    function syncSelectedNode(nodeId: string | null) {
      gN.querySelectorAll<SVGGElement>('g[data-node]').forEach((node) => {
        node.classList.toggle('selected', node.getAttribute('data-node') === nodeId);
      });
    }

    apiRef.current = { play, reset, focusNode };
    syncSelectedNode(selectedNodeId);

    // Pointer Dragging (Nodes & Canvas Pan) + Wheel Zoom
    let panning: { x: number; y: number } | null = null;
    let drag: {
      n: DiagramNode;
      g: SVGElement;
      sx: number;
      sy: number;
      ox: number;
      oy: number;
    } | null = null;

    const toSVG = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      return {
        x: ((e.clientX - r.left) * vb.w) / Math.max(1, r.width) + vb.x,
        y: ((e.clientY - r.top) * vb.h) / Math.max(1, r.height) + vb.y,
      };
    };

    const onSvgDown = (e: PointerEvent) => {
      const target = e.target as Element;
      const nodeG = target.closest('g[data-node]') as SVGElement | null;
      if (nodeG) {
        e.stopPropagation();
        const nodeId = nodeG.getAttribute('data-node') || '';
        const n = byId[nodeId];
        if (!n) return;
        onSelectNodeRef.current(nodeId);
        syncSelectedNode(nodeId);
        if (!fxRef.current.drag) return;
        const p = toSVG(e);
        drag = { n, g: nodeG, sx: p.x, sy: p.y, ox: n.x, oy: n.y };
        nodeG.classList.add('dragging');
        return;
      }
      panning = { x: e.clientX, y: e.clientY };
    };

    const onWinMove = (e: PointerEvent) => {
      if (drag) {
        const p = toSVG(e);
        drag.n.x = drag.ox + (p.x - drag.sx);
        drag.n.y = drag.oy + (p.y - drag.sy);
        drag.g.setAttribute('transform', `translate(${drag.n.x},${drag.n.y})`);
        EDGES.forEach((_, i) => layoutEdge(i));
      } else if (panning) {
        vb.x -= ((e.clientX - panning.x) * vb.w) / Math.max(1, svg.clientWidth);
        vb.y -= ((e.clientY - panning.y) * vb.h) / Math.max(1, svg.clientHeight);
        panning = { x: e.clientX, y: e.clientY };
        setVB();
      }
    };

    const onWinUp = () => {
      if (drag) drag.g.classList.remove('dragging');
      panning = null;
      drag = null;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const f = e.deltaY < 0 ? 0.9 : 1.1;
      const nw = vb.w * f;
      const nh = vb.h * f;
      if (nw < 400 || nw > 4000) return;
      const mx = (e.offsetX / Math.max(1, svg.clientWidth)) * vb.w + vb.x;
      const my = (e.offsetY / Math.max(1, svg.clientHeight)) * vb.h + vb.y;
      vb.w = nw;
      vb.h = nh;
      vb.x = mx - (mx - vb.x) * f;
      vb.y = my - (my - vb.y) * f;
      setVB();
      setCameraHudText(`${(FULL.w / vb.w).toFixed(2)}x · Manual Zoom`);
    };

    svg.addEventListener('pointerdown', onSvgDown);
    window.addEventListener('pointermove', onWinMove);
    window.addEventListener('pointerup', onWinUp);
    svg.addEventListener('wheel', onWheel, { passive: false });

    if (autoPlay && !reducedMotion) play();
    else showCompletedStatic();

    return () => {
      cancelled = true;
      playTokenRef.current += 1;
      pendingSleepFinishers.forEach((finish) => finish());
      pendingFrameFinishers.forEach((finish) => finish());
      ownedTimeouts.forEach((id) => window.clearTimeout(id));
      ownedIntervals.forEach((id) => window.clearInterval(id));
      ownedFrames.forEach((id) => window.cancelAnimationFrame(id));
      ownedAnimations.forEach((animation) => animation.cancel());
      ownedTimeouts.clear();
      ownedIntervals.clear();
      ownedFrames.clear();
      ownedAnimations.clear();
      apiRef.current = null;
      svg.removeEventListener('pointerdown', onSvgDown);
      window.removeEventListener('pointermove', onWinMove);
      window.removeEventListener('pointerup', onWinUp);
      svg.removeEventListener('wheel', onWheel);
    };
  }, [scenario.id, isKoreanScenario, targetZoomFactor, reducedMotion, autoPlay]);

  useEffect(() => {
    if (previousReplayCountRef.current === replayTriggerCount) return;
    previousReplayCountRef.current = replayTriggerCount;
    if (!reducedMotion) apiRef.current?.play();
  }, [replayTriggerCount, reducedMotion]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.querySelectorAll<SVGGElement>('g[data-node]').forEach((node) => {
      node.classList.toggle('selected', node.getAttribute('data-node') === selectedNodeId);
    });
  }, [selectedNodeId]);

  const toggleEffect = useCallback((key: string, checked: boolean) => {
    setFxState((prev) => ({ ...prev, [key]: checked }));
  }, []);

  // Build disabled CSS class string from fxState
  const disabledFxClasses = Object.entries(fxState)
    .filter(([, enabled]) => !enabled)
    .map(([k]) => `no-${k}`)
    .join(' ');

  return (
    <div
      ref={wrapRef}
      data-testid="flow-canvas-cinematic-zoom"
      className={`klic-flowmotion flex-1 relative w-full h-full overflow-hidden select-none nc-stage ${reducedMotion ? 'nc-reduced' : ''} ${disabledFxClasses}`}
      style={{ backgroundColor: 'var(--fm-panel)', color: 'var(--fm-text)' }}
    >
      {/* Scoped Vanilla SVG CSS matching node-connect-slim.html */}
      <style>{`
        .nc-stage svg { width: 100%; height: 100%; display: block; cursor: grab; }
        .nc-stage svg:active { cursor: grabbing; }
        .nc-stage .nc-edge { fill: none; stroke-width: 2.5; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .68s ease; }
        .nc-stage .nc-edge.drawn { stroke-dashoffset: 0; }
        .nc-stage .nc-edge.static { stroke-dashoffset: 0; transition: none; }
        .nc-stage .nc-check { opacity: 0; transform-box: fill-box; transform-origin: center; }
        .nc-stage .nc-check.on { opacity: 1; animation: ncPop .35s ease; }
        .nc-stage .nc-check.on.static { animation: none; }
        @keyframes ncPop { 0% { transform: scale(.4); } 60% { transform: scale(1.3); } 100% { transform: scale(1); } }
        .nc-stage .nc-spark { opacity: 1; transition: opacity .5s ease; }
        .nc-stage .nc-spark.out { opacity: 0; }
        .nc-stage .nc-flowline { fill: none; stroke: var(--fm-on-accent); stroke-width: 1.6; stroke-linecap: round; stroke-dasharray: 3 15; opacity: 0; animation: ncDashmove 1s linear infinite; }
        .nc-stage .nc-flowline.drawn { opacity: .75; transition: opacity .4s .68s; }
        .nc-stage .nc-flowline.static { opacity: .45; animation: none; transition: none; }
        @keyframes ncDashmove { to { stroke-dashoffset: -18; } }
        .nc-stage .nc-arrow { transform-box: fill-box; transform-origin: center; animation: ncPop .4s ease; }
        .nc-stage .nc-arrow.static { animation: none; }
        .nc-stage .nc-breath { transform-box: fill-box; transform-origin: center; animation: ncBreathe 2.4s ease-out infinite; }
        @keyframes ncBreathe { 0% { transform: scale(1); opacity: .8; } 100% { transform: scale(3.4); opacity: 0; } }
        .nc-stage .nc-lift { transform-box: fill-box; transform-origin: center; animation: ncEnter .65s cubic-bezier(.2,.8,.3,1) backwards; animation-delay: var(--d,0s); }
        @keyframes ncEnter { from { opacity: 0; transform: translateY(24px) scale(.96); } to { opacity: 1; transform: none; } }
        .nc-stage .nc-ring { opacity: 0; }
        .nc-stage g[data-node]:hover .nc-ring { opacity: .85; }
        .nc-stage g[data-node].selected .nc-ring { opacity: .85; }
        .nc-stage .nc-shine { animation: ncShine 4.5s ease-in-out infinite; animation-delay: var(--d,0s); }
        @keyframes ncShine { 0%, 55% { transform: translateX(0); } 100% { transform: translateX(520px); } }
        .nc-stage .nc-dust { animation: ncDrift var(--t,9s) ease-in-out infinite; }
        @keyframes ncDrift { 50% { transform: translate(var(--dx),var(--dy)); } }
        .nc-stage .nc-ripple { fill: none; transform-box: fill-box; transform-origin: center; animation: ncRipple 1.1s ease-out both; animation-delay: var(--d,0s); }
        @keyframes ncRipple { 0% { transform: scale(.2); opacity: .9; } 100% { transform: scale(1); opacity: 0; } }
        .nc-stage .nc-pulse-ring { opacity: 0; }
        .nc-stage .nc-pulse-ring.on { animation: ncPulse 1.8s ease-in-out infinite; }
        .nc-stage .nc-pulse-ring.on.static { opacity: .6; animation: none; }
        @keyframes ncPulse { 0%, 100% { opacity: .15; } 50% { opacity: .9; } }
        /* 20 FX Toggles */
        .nc-stage.no-draw .nc-edge { transition: none; }
        .nc-stage.no-glow .nc-edge-glow { display: none; }
        .nc-stage.no-pop .nc-check.on, .nc-stage.no-arrowpop .nc-arrow { animation: none; }
        .nc-stage.no-flow .nc-flowline,
        .nc-stage.no-particle .nc-particle,
        .nc-stage.no-breath .nc-breath,
        .nc-stage.no-hover .nc-ring,
        .nc-stage.no-shine .nc-shineg,
        .nc-stage.no-grid [data-flow-layer="grid"],
        .nc-stage.no-dust [data-flow-layer="dust"],
        .nc-stage.no-ripple .nc-ripple,
        .nc-stage.no-pulse .nc-pulse-ring,
        .nc-stage.no-pulse .nc-confetti,
        .nc-stage.no-bar .nc-pbar { display: none; }
        .nc-stage.no-enter .nc-lift { animation: none; }
        .nc-stage .nc-lift-static { opacity: 1; }
        .nc-stage.no-drag g[data-node] { cursor: pointer !important; }
        .nc-stage.nc-reduced *, .nc-stage.nc-reduced *::before, .nc-stage.nc-reduced *::after { animation: none !important; transition: none !important; }
        .nc-stage.nc-reduced .nc-check { opacity: 1; }
        .nc-stage.nc-reduced .nc-flowline { animation: none !important; opacity: .45; }
        .nc-stage.nc-reduced .nc-pulse-ring { opacity: .6; }
      `}</style>

      {/* Main Vanilla SVG Canvas with Camera ViewBox */}
      <svg
        ref={svgRef}
        viewBox="0 0 1160 660"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={isKoreanScenario ? '프롬프트, 노이즈, 샘플러 입력이 처리 엔진으로 연결되는 흐름' : 'Prompt, noise, and sampler inputs connected to processing'}
      >
        <defs>
          <linearGradient id={paintId('card-grad')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--fm-surface)" />
            <stop offset="0.45" stopColor="color-mix(in srgb, var(--fm-surface) 94%, var(--fm-text))" />
            <stop offset="1" stopColor="var(--fm-panel)" />
          </linearGradient>
          <filter id={paintId('soft-shadow')} x="-30%" y="-30%" width="160%" height="180%">
            <feDropShadow
              dx="0"
              dy="14"
              stdDeviation="14"
              floodColor="var(--fm-text)"
              floodOpacity="0.55"
            />
          </filter>
          <filter id={paintId('blur')} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id={paintId('gold-glow')} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="16"
              floodColor="var(--fm-warning)"
              floodOpacity="0.8"
            />
          </filter>
          <filter id={paintId('grain')} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              result="n"
            />
            <feColorMatrix
              in="n"
              type="matrix"
              values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0 0.05"
            />
          </filter>
          <pattern
            id={paintId('dots')}
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.2" fill="var(--fm-accent)" fillOpacity="0.16" />
          </pattern>
          <linearGradient id={paintId('shine-gradient')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--fm-surface)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--fm-surface)" stopOpacity="0.22" />
            <stop offset="1" stopColor="var(--fm-surface)" stopOpacity="0" />
          </linearGradient>
          {NODES.map((node) => (
            <clipPath key={node.id} id={paintId(`clip-${node.id}`)}>
              <rect x="0" y="0" width={node.w} height={node.h} rx="14" />
            </clipPath>
          ))}
        </defs>

        <title>{isKoreanScenario ? '시네마틱 노드 연결 흐름' : 'Cinematic node connection flow'}</title>
        <rect width="1160" height="660" fill="var(--fm-panel)" />
        <g data-flow-layer="grid" ref={gGridRef}>
          <rect
            x="-3000"
            y="-3000"
            width="8000"
            height="8000"
            fill={`url(#${paintId('dots')})`}
          />
        </g>
        <g data-flow-layer="dust" ref={gDustRef} />
        <g ref={gEdgesRef}>
          {EDGES.map((edge, index) => {
            const geometry = edgeGeom(edge);
            return (
              <g key={`${edge.from}-${edge.to}-${index}`}>
                <path d={geometry.d} stroke={edge.c} className="nc-edge nc-edge-glow static" pathLength="1" filter={`url(#${paintId('blur')})`} strokeWidth="9" opacity="0.22" />
                <path d={geometry.d} stroke={edge.c} className="nc-edge drawn static" pathLength="1" />
                <path d={geometry.d} className="nc-flowline drawn static" />
              </g>
            );
          })}
        </g>
        <g ref={gNodesRef}>
          {NODES.map((node, nodeIndex) => {
            const status = node.id === 'proc'
              ? (isKoreanScenario ? '모든 입력 준비 완료 (All Ready)' : 'All inputs ready')
              : node.status;
            let y = 58;
            return (
              <g
                key={node.id}
                data-node={node.id}
                className={selectedNodeId === node.id ? 'selected' : undefined}
                transform={`translate(${node.x},${node.y})`}
                style={{ cursor: 'grab' }}
              >
                <g className={autoPlay && !reducedMotion ? 'nc-lift' : 'nc-lift-static'} style={{ '--d': `${nodeIndex * 0.12}s` } as React.CSSProperties}>
                  <rect width={node.w} height={node.h} rx="14" fill={`url(#${paintId('card-grad')})`} filter={`url(#${paintId('soft-shadow')})`} />
                  <rect width={node.w} height={node.h} rx="14" fill={`url(#${paintId('grain')})`} clipPath={`url(#${paintId(`clip-${node.id}`)})`} />
                  <line x1="8" y1="1" x2={node.w - 8} y2="1" stroke="var(--fm-surface)" strokeOpacity="0.2" strokeWidth="1" strokeLinecap="round" />
                  <text x="22" y="32" fill="var(--fm-text)" fontSize="17" fontWeight="700">{node.title}</text>
                  {node.body?.map((line) => {
                    y += 20;
                    return <text key={line} x="22" y={y - 20} fill="var(--fm-muted)" fontSize="13.5">{line}</text>;
                  })}
                  {node.kv?.map(([key, value]) => {
                    y += 22;
                    return (
                      <g key={key}>
                        <text x="22" y={y - 22} fill="var(--fm-muted)" fontSize="12">{key}</text>
                        <text x="125" y={y - 22} fill="var(--fm-text)" fontSize="13">{value}</text>
                      </g>
                    );
                  })}
                  {node.rows?.map((row, rowIndex) => (
                    <g key={row}>
                      <text x="22" y={68 + rowIndex * 34} fill="var(--fm-text)" fontSize="13.5">{row}</text>
                      <text data-flow-id={`check-${rowIndex}`} x={node.w - 30} y={68 + rowIndex * 34} fill="var(--fm-accent)" fontSize="14" className="nc-check on static">✓</text>
                    </g>
                  ))}
                  {status && <text data-flow-id="proc-status" x="22" y={node.h - 22} fill="var(--fm-accent)" fontSize="12.5">{status}</text>}
                  <circle cx={node.w} cy={node.h / 2} r="5" fill={node.c} stroke="var(--fm-panel)" strokeWidth="2" />
                  {node.id === 'proc' && node.rows && (
                    <>
                      {node.rows.map((_, rowIndex) => <circle key={rowIndex} cx="0" cy={68 + rowIndex * 34} r="5" fill="var(--fm-panel)" stroke={node.c} strokeWidth="1.5" />)}
                      <rect x="22" y="152" width={node.w - 44} height="5" rx="2.5" fill="var(--fm-surface)" fillOpacity="0.12" />
                      <rect data-flow-id="pbar" x="22" y="152" width={node.w - 44} height="5" rx="2.5" fill="var(--fm-accent)" />
                      <rect data-flow-id="proc-ring" x="-4" y="-4" width={node.w + 8} height={node.h + 8} rx="18" fill="none" stroke="var(--fm-warning)" strokeWidth="2" className="nc-pulse-ring on static" pointerEvents="none" />
                    </>
                  )}
                  {node.id !== 'proc' && <circle cx={node.w} cy={node.h / 2} r="5" fill="none" stroke={node.c} strokeWidth="1.5" className="nc-breath" />}
                  <rect width={node.w} height={node.h} rx="14" fill="none" stroke={node.c} strokeWidth="1.5" className="nc-ring" pointerEvents="none" />
                  <g clipPath={`url(#${paintId(`clip-${node.id}`)})`} className="nc-shineg" pointerEvents="none">
                    <rect x="-160" y="0" width="140" height={node.h} fill={`url(#${paintId('shine-gradient')})`} className="nc-shine" style={{ '--d': `${nodeIndex * 0.9}s` } as React.CSSProperties} />
                  </g>
                </g>
              </g>
            );
          })}
        </g>
        <g ref={gFxRef}>
          {EDGES.map((edge, index) => {
            const geometry = edgeGeom(edge);
            return <polygon key={`${edge.from}-${edge.to}-${index}`} points={arrowPoints(geometry)} fill={edge.c} className="nc-arrow static" />;
          })}
        </g>
      </svg>

      {/* Top-Left Floating Control Panel (Matches node-connect-slim.html panel) */}
      <details className="absolute top-3.5 left-3.5 backdrop-blur-md border rounded-[12px] p-3.5 max-w-[365px] max-h-[calc(100%-120px)] overflow-y-auto z-10 shadow-2xl" style={{ backgroundColor: 'color-mix(in srgb, var(--fm-panel) 92%, transparent)', borderColor: 'var(--fm-border)', color: 'var(--fm-text)' }}>
        <summary className="cursor-pointer text-[12px] font-semibold">시네마틱 제어 · 카메라 · 20 FX</summary>
        <div className="flex items-center justify-between gap-2">
          <div className="text-[13.5px]">
            <b>node connect</b> · vanilla svg ·{' '}
            <span className="font-mono-tabular text-[12px]" style={{ color: 'var(--fm-accent)' }}>
              {cameraHudText}
            </span>
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            disabled={isPlaying || reducedMotion}
            aria-label={reducedMotion ? '동작 감소 설정으로 자동 재생이 비활성화됨' : '시네마틱 흐름 자동 재생'}
            title={reducedMotion ? '동작 감소 설정에서는 재생할 수 없습니다.' : undefined}
            onClick={() => apiRef.current?.play()}
            className="bg-[var(--fm-accent)] hover:bg-[var(--fm-accent-hover)] disabled:opacity-50 text-[var(--fm-on-accent)] border border-[var(--fm-control-border)] rounded-[8px] px-3 py-1.5 text-[12.5px] font-semibold cursor-pointer"
          >
            {reducedMotion ? '동작 감소로 비활성' : '▶ 자동 재생'}
          </button>
          <button
            type="button"
            onClick={() => apiRef.current?.reset(true)}
            className="bg-[var(--fm-soft)] hover:bg-[var(--fm-selected)] text-[var(--fm-text)] border border-[var(--fm-control-border)] rounded-[8px] px-3 py-1.5 text-[12.5px] font-semibold cursor-pointer"
          >
            ⟲ 초기화
          </button>
        </div>

        {/* Manual Camera Focus Quick Buttons */}
        <div className="mt-2.5 pt-2 border-t border-white/10">
          <div className="text-[11px] font-semibold text-[var(--fm-muted)] mb-1.5">
            시네마틱 카메라 수동 포커스 (박스 클릭 확대)
          </div>
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'prompt', label: 'Prompt 줌', col: 'var(--fm-accent)' },
              { id: 'noise', label: 'Noise 줌', col: 'var(--fm-accent-hover)' },
              { id: 'samp', label: 'Sampler 줌', col: 'var(--fm-control-border)' },
              { id: 'proc', label: 'Processing 줌', col: 'var(--fm-accent)' },
            ].map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => apiRef.current?.focusNode(b.id, 1.5)}
                className={`px-2 py-1 rounded-[6px] text-[11px] font-mono-tabular font-semibold border cursor-pointer ${
                  selectedNodeId === b.id
                    ? 'bg-[var(--fm-selected)] border-[var(--fm-accent)] text-[var(--fm-text)]'
                    : 'bg-[var(--fm-soft)] border-[var(--fm-control-border)] text-[var(--fm-muted)] hover:bg-[var(--fm-selected)]'
                }`}
              >
                <span style={{ color: b.col }}>●</span> {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2.5 text-[var(--fm-muted)] text-[11.5px] leading-relaxed">
          노드 선택 · 노드 드래그 토글: 노드 이동 · 배경 드래그: 화면 이동 · 휠: 줌 · 재생 시 출발 박스 → 다음 박스 순서로 카메라가 확대 추적합니다
        </div>

        {/* 20 Toggleable Effects Drawer */}
        <details className="mt-2.5 text-[11.5px] text-[var(--fm-muted)]">
          <summary className="cursor-pointer text-[var(--fm-text)] font-semibold select-none">
            효과 20종 (개별 ON/OFF)
          </summary>
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-1.5 mt-2 pt-2 border-t border-white/10">
            {EFFECTS_LIST.map(([k, label], idx) => (
              <label
                key={k}
                className="cursor-pointer whitespace-nowrap flex items-center gap-1.5 text-[11px]"
              >
                <input
                  type="checkbox"
                  checked={Boolean(fxState[k])}
                  onChange={(e) => toggleEffect(k, e.target.checked)}
                  className="accent-[var(--fm-accent)]"
                />
                <span>
                  {idx + 1}. {label}
                </span>
              </label>
            ))}
          </div>
        </details>
      </details>
    </div>
  );
};
