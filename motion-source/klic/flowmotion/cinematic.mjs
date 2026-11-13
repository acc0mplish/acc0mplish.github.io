const BASE_STYLE = ".fm-root{--fm-blue:var(--klic-semantic-color-accent,#245fc2);--fm-navy:var(--klic-semantic-color-text,#132c46);--fm-panel:var(--klic-component-card-background-default,var(--klic-semantic-color-panel,#fff));--fm-surface:var(--klic-semantic-color-surface,#fbfcfe);--fm-border:var(--klic-semantic-color-border,#dfe5ee);--fm-muted:var(--klic-semantic-color-muted,#52657b);--fm-on-blue:var(--klic-semantic-color-on-accent,#fff);--fm-selected:var(--klic-semantic-color-surface-selected,#e4ecfc);box-sizing:border-box;width:100%;height:100%;color:var(--fm-navy);font-family:inherit}.fm-root *{box-sizing:inherit}.fm-root svg{display:block;width:100%;height:100%;overflow:visible;font-family:inherit}.fm-root .fm-surface{fill:var(--fm-surface)}.fm-root .fm-panel{fill:var(--fm-panel);stroke:var(--fm-border)}.fm-root .fm-blue{fill:var(--fm-blue)}.fm-root .fm-blue-stroke{stroke:var(--fm-blue)}.fm-root .fm-ink{fill:var(--fm-navy)}.fm-root .fm-muted{fill:var(--fm-muted)}.fm-root .fm-selected{fill:var(--fm-selected)}.fm-root .fm-on-blue{fill:var(--fm-on-blue)}.fm-root [transform-box]{transform-box:fill-box;transform-origin:center}.fm-root text{font-size:11px;fill:var(--fm-navy)}";

const html = (markup, extraStyle = "") =>
  "<style>" + BASE_STYLE + extraStyle + "</style><div class='fm-root'>" + markup + "</div>";

const svg = (content, label) =>
  "<svg viewBox='0 0 320 200' role='img' aria-label='" + label + "'>" + content + "</svg>";

const make = (spec) => ({
  id: "flowmotion-cinematic-" + spec.key,
  category: spec.category,
  title: { ko: spec.title[0], en: spec.title[1] },
  summary: { ko: spec.summary[0], en: spec.summary[1] },
  durationMs: spec.durationMs,
  easing: spec.easing,
  origin: {
    templateIds: ["cinematic-node-connect"],
    sourceFile: "src/components/CinematicNodeConnectCanvas.tsx",
    renderer: "CinematicNodeConnectCanvas",
    effect: spec.key,
    sourceTimeline: spec.sourceTimeline,
  },
  definition: {
    html: spec.html.replaceAll("aria-label='undefined'", "aria-label='"+spec.title[1].replaceAll("'","&#39;")+"'"),
    duration: spec.durationMs,
    easing: "linear",
    segmentEasing: false,
    reducedProgress: spec.reducedProgress ?? 1,
    // Source CSS eases each keyframe segment; keep delays/holds on the linear clock.
    tracks: spec.tracks.map(track=>({...track,easing:'linear',keyframes:track.keyframes.map(frame=>({...frame,easing:frame.easing||track.easing||'linear'}))})),
  },
});

const route = "M 36 100 C 102 28 218 172 284 100";
const sourceRoutePoints = (steps = 16) => {
  const p0 = [36, 100];
  const p1 = [102, 28];
  const p2 = [218, 172];
  const p3 = [284, 100];
  return Array.from({ length: steps + 1 }, (_, index) => {
    const t = index / steps;
    const u = 1 - t;
    const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0];
    const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1];
    return [Number(x.toFixed(2)), Number(y.toFixed(2)), t];
  });
};

const seededRandom = (seed) => {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
};

const sparkRandom = seededRandom(7);
const sparkRays = Array.from({ length: 7 }, () => {
  let angle = sparkRandom() * Math.PI * 2;
  let x = 250;
  let y = 100;
  const points = [x + "," + y];
  for (let index = 0; index < 4; index++) {
    angle += (sparkRandom() - 0.5) * 1.4;
    x += Math.cos(angle) * (10 + sparkRandom() * 26);
    y += Math.sin(angle) * (10 + sparkRandom() * 26);
    points.push(Number(x.toFixed(1)) + "," + Number(y.toFixed(1)));
  }
  return "<polyline points='" + points.join(" ") + "' fill='none' stroke='var(--fm-blue)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>";
}).join("");

const dustRandom = seededRandom(42);
const dustSpecs = Array.from({ length: 32 }, (_, index) => {
  const sourceX = -150 + dustRandom() * 1460;
  const sourceY = -100 + dustRandom() * 860;
  const radius = 0.8 + dustRandom() * 1.8;
  const opacity = 0.12 + dustRandom() * 0.3;
  const dx = Number((dustRandom() * 60 - 30).toFixed(0));
  const dy = Number((dustRandom() * 60 - 30).toFixed(0));
  const durationMs = Number((6 + dustRandom() * 7).toFixed(1)) * 1000;
  return {
    index,
    x: Number(((sourceX + 150) * (320 / 1460)).toFixed(2)),
    y: Number(((sourceY + 100) * (200 / 860)).toFixed(2)),
    radius: Number((radius * (320 / 1160)).toFixed(2)),
    opacity: Number(opacity.toFixed(2)),
    dx,
    dy,
    durationMs,
  };
});
const dustMarkup = dustSpecs.map((particle) =>
  "<circle class='dust-" + particle.index + "' cx='" + particle.x + "' cy='" + particle.y + "' r='" + particle.radius + "' fill='var(--fm-blue)' fill-opacity='" + particle.opacity + "'/>"
).join("");
const dustTracks = dustSpecs.map((particle) => {
  const end = particle.durationMs / 13000;
  const middle = end / 2;
  return {
    selector: ".dust-" + particle.index,
    easing: "ease-in-out",
    keyframes: [
      { offset: 0, transform: "translate(0px, 0px)" },
      { offset: middle, transform: "translate(" + particle.dx + "px, " + particle.dy + "px)" },
      { offset: end, transform: "translate(0px, 0px)" },
      { offset: 1, transform: "translate(0px, 0px)" },
    ],
  };
});

const confettiRandom = seededRandom(7);
const confettiSpecs = Array.from({ length: 40 }, (_, index) => {
  const angle = confettiRandom() * Math.PI * 2;
  const distance = 90 + confettiRandom() * 180;
  const rotation = confettiRandom() * 720;
  const durationMs = 1100 + confettiRandom() * 700;
  return {
    index,
    x: Number((Math.cos(angle) * distance).toFixed(2)),
    y: Number((Math.sin(angle) * distance + 60).toFixed(2)),
    rotation: Number(rotation.toFixed(2)),
    durationMs: Number(durationMs.toFixed(2)),
  };
});
const confettiMarkup = confettiSpecs.map((piece) =>
  "<rect class='confetti-piece-" + piece.index + "' x='157' y='95' width='6' height='10' rx='1' fill='var(--fm-blue)'/>"
).join("");
const confettiTracks = confettiSpecs.map((piece) => {
  const end = piece.durationMs / 1800;
  const finalTransform = "translate(" + piece.x + "px, " + piece.y + "px) rotate(" + piece.rotation + "deg)";
  return {
    selector: ".confetti-piece-" + piece.index,
    easing: "cubic-bezier(.2,.8,.3,1)",
    keyframes: [
      { offset: 0, transform: "translate(0px, 0px) rotate(0deg)", opacity: 1 },
      { offset: end, transform: finalTransform, opacity: 0 },
      { offset: 1, transform: finalTransform, opacity: 0 },
    ],
  };
});

const particlePath = sourceRoutePoints(16);
const firstParticleFrames = particlePath.map(([x, y, t]) => ({
  offset: Number((t * (1700 / 2550)).toFixed(6)),
  transform: "translate(" + x + "px, " + y + "px)",
}));
firstParticleFrames.push({ offset: 1, transform: "translate(284px, 100px)" });
const secondParticleFrames = particlePath.map(([x, y, t]) => ({
  offset: Number(t.toFixed(6)),
  transform: "translate(" + x + "px, " + y + "px)",
}));

const enterSpecs = [
  { index: 0, x: 24, delay: 0 },
  { index: 1, x: 116, delay: 120 },
  { index: 2, x: 208, delay: 240 },
];
const enterMarkup = enterSpecs.map((item) =>
  "<g class='enter-" + item.index + "'><rect class='fm-panel' x='" + item.x + "' y='76' width='80' height='48' rx='9'/><circle cx='" + (item.x + 16) + "' cy='100' r='5' fill='var(--fm-blue)'/><path d='M " + (item.x + 29) + " 92 h34 M " + (item.x + 29) + " 104 h22' stroke='var(--fm-border)' stroke-width='3' stroke-linecap='round'/></g>"
).join("");
const enterTracks = enterSpecs.map((item) => {
  const remaining = 890 - item.delay;
  const end = 650 / remaining;
  return {
    selector: ".enter-" + item.index,
    delay: item.delay,
    easing: "cubic-bezier(.2,.8,.3,1)",
    keyframes: [
      { offset: 0, opacity: 0, transform: "translateY(24px) scale(.96)" },
      { offset: end, opacity: 1, transform: "translateY(0px) scale(1)" },
      { offset: 1, opacity: 1, transform: "translateY(0px) scale(1)" },
    ],
  };
});

const typingWord = "Ready";
const typingGlyphs = Array.from(typingWord);
const typingMarkup = "<div class='fm-type-card' role='img' aria-label='" + typingWord + "'><span class='fm-type-label'>status</span><span class='fm-type-value'>" +
  typingGlyphs.map((glyph, index) => "<span aria-hidden='true' class='glyph-" + index + "'>" + glyph + "</span>").join("") +
  "</span></div>";
const typingTracks = typingGlyphs.map((_, index) => ({
  selector: ".glyph-" + index,
  keyframes: [
    { offset: 0, opacity: 0, transform: "translateY(4px)" },
    { offset: index / typingGlyphs.length, opacity: 0, transform: "translateY(4px)" },
    { offset: (index + 1) / typingGlyphs.length, opacity: 1, transform: "translateY(0px)" },
    { offset: 1, opacity: 1, transform: "translateY(0px)" },
  ],
}));

export const FLOWMOTION_CINEMATIC = [
  make({
    key: "draw",
    category: "svg-path",
    title: ["엣지 드로우", "Edge draw-on"],
    summary: ["한 개의 곡선 연결선을 680ms 동안 그립니다.", "Draw one curved connector over the source 680 ms stroke interval."],
    durationMs: 680,
    easing: "ease",
    html: html(svg(
      "<rect class='fm-surface' width='320' height='200' rx='14'/>" +
      "<path d='" + route + "' fill='none' stroke='var(--fm-border)' stroke-width='2'/>" +
      "<path class='draw-path' d='" + route + "' fill='none' stroke='var(--fm-blue)' stroke-width='3' pathLength='1' stroke-dasharray='1' stroke-dashoffset='1'/>" +
      "<circle cx='36' cy='100' r='8' fill='var(--fm-panel)' stroke='var(--fm-blue)' stroke-width='2'/>" +
      "<circle cx='284' cy='100' r='8' fill='var(--fm-blue)'/>" +
      "<text x='24' y='157' class='fm-muted'>source</text><text x='254' y='157' class='fm-muted'>target</text>"
    ), ".fm-root .draw-path{stroke-dasharray:1;stroke-dashoffset:1}"),
    tracks: [{
      selector: ".draw-path",
      easing: "ease",
      keyframes: [{ offset: 0, strokeDashoffset: 1 }, { offset: 1, strokeDashoffset: 0 }],
    }],
    reducedProgress: 1,
    sourceTimeline: {
      durationMs: 680,
      description: "Source edge uses pathLength 1 and transitions stroke-dashoffset from 1 to 0 in 680 ms.",
      frames: [{ atMs: 0, phase: "dash offset 1" }, { atMs: 680, phase: "complete path" }],
    },
  }),
  make({
    key: "glow",
    category: "light",
    title: ["엣지 블러 글로우", "Edge blur glow"],
    summary: ["같은 연결 경로의 블루 블러 레이어를 드러냅니다.", "Reveal a blue blurred duplicate beneath one connector path."],
    durationMs: 680,
    easing: "ease",
    html: html(svg(
      "<defs><filter id='edge-blur'><feGaussianBlur stdDeviation='6'/></filter></defs>" +
      "<rect class='fm-surface' width='320' height='200' rx='14'/>" +
      "<path d='" + route + "' fill='none' stroke='var(--fm-border)' stroke-width='2.5'/>" +
      "<path class='glow-path' d='" + route + "' fill='none' stroke='var(--fm-blue)' stroke-width='5' filter='url(#edge-blur)' opacity='.08'/>" +
      "<path d='" + route + "' fill='none' stroke='var(--fm-blue)' stroke-width='2.5'/>" +
      "<circle cx='36' cy='100' r='7' fill='var(--fm-panel)' stroke='var(--fm-blue)' stroke-width='2'/>" +
      "<circle cx='284' cy='100' r='7' fill='var(--fm-blue)'/>"
    )),
    tracks: [{
      selector: ".glow-path",
      easing: "ease",
      keyframes: [{ offset: 0, opacity: 0.08 }, { offset: 1, opacity: 0.58 }],
    }],
    reducedProgress: 1,
    sourceTimeline: {
      durationMs: 680,
      description: "Source glow is a blurred duplicate of the edge, enabled alongside the 680 ms edge draw; KLIC preview reveals that layer on the same interval.",
      frames: [{ atMs: 0, phase: "soft blue halo" }, { atMs: 680, phase: "full edge glow" }],
    },
  }),
  make({
    key: "spark",
    category: "particles",
    title: ["번개 스파크", "Lightning spark"],
    summary: ["고정 시드로 만든 7개의 짧은 광선과 확장 링입니다.", "Seven seeded rays accompany the source 550 ms expanding spark ring."],
    durationMs: 800,
    easing: "ease-out",
    html: html(svg(
      "<defs><filter id='spark-blur'><feGaussianBlur stdDeviation='6'/></filter></defs>" +
      "<rect class='fm-surface' width='320' height='200' rx='14'/>" +
      "<g class='spark-group'><circle cx='250' cy='100' r='26' fill='var(--fm-blue)' opacity='.16' filter='url(#spark-blur)'/>" +
      sparkRays +
      "<circle class='spark-ring' cx='250' cy='100' r='44' fill='none' stroke='var(--fm-blue)' stroke-width='2.5' transform-box='fill-box' transform-origin='center'/>" +
      "<circle cx='250' cy='100' r='4' fill='var(--fm-blue)'/></g>"
    )),
    tracks: [
      {
        selector: ".spark-ring",
        easing: "ease-out",
        keyframes: [
          { offset: 0, transform: "scale(.136)", opacity: 0.9 },
          { offset: 0.6875, transform: "scale(1)", opacity: 0.9 },
          { offset: 1, transform: "scale(1)", opacity: 0 },
        ],
      },
      {
        selector: ".spark-group",
        keyframes: [
          { offset: 0, opacity: 1 },
          { offset: 0.375, opacity: 1 },
          { offset: 1, opacity: 0 },
        ],
      },
    ],
    reducedProgress: 0.2,
    sourceTimeline: {
      durationMs: 800,
      description: "Source ring expands from radius 6 to 44 in 550 ms; its parent fade starts at 300 ms and completes at 800 ms.",
      frames: [
        { atMs: 0, phase: "7 seeded lightning rays and radius 6 ring" },
        { atMs: 300, phase: "spark group fade begins" },
        { atMs: 550, phase: "ring reaches radius 44" },
        { atMs: 800, phase: "source cleanup point" },
      ],
    },
  }),
  make({
    key: "pop",
    category: "ui-feedback",
    title: ["체크 팝", "Check pop"],
    summary: ["체크 마크가 350ms 동안 튀어 오른 뒤 400ms 샘플 끝에서 고정됩니다.", "The check overshoots over the source 350 ms motion, then holds through the 400 ms preview."],
    durationMs: 400,
    easing: "ease",
    html: html(svg(
      "<rect class='fm-surface' width='320' height='200' rx='14'/>" +
      "<circle cx='160' cy='94' r='34' fill='var(--fm-selected)'/>" +
      "<path class='check-pop' d='M 145 94 l10 10 22-25' fill='none' stroke='var(--fm-blue)' stroke-width='5' stroke-linecap='round' stroke-linejoin='round' transform-box='fill-box' transform-origin='center'/>" +
      "<text x='160' y='155' text-anchor='middle' class='fm-muted'>check</text>"
    )),
    tracks: [{
      selector: ".check-pop",
      easing: "ease",
      keyframes: [
        { offset: 0, transform: "scale(.4)", opacity: 1 },
        { offset: 0.525, transform: "scale(1.3)", opacity: 1 },
        { offset: 0.875, transform: "scale(1)", opacity: 1 },
        { offset: 1, transform: "scale(1)", opacity: 1 },
      ],
    }],
    sourceTimeline: {
      durationMs: 400,
      description: "Source check uses a 350 ms .4 → 1.3 → 1 pop; the separate arrow pop runs 400 ms.",
      frames: [
        { atMs: 0, phase: "scale .4" },
        { atMs: 210, phase: "scale 1.3 overshoot" },
        { atMs: 350, phase: "scale 1 settled" },
        { atMs: 400, phase: "preview hold ends" },
      ],
    },
  }),
  make({
    key: "gold",
    category: "light",
    title: ["완료 글로우", "Completion glow"],
    summary: ["원본 완료 필터를 KLIC 블루 글로우로 바꿔 420ms 동안 표시합니다.", "Show the source completion filter as a KLIC blue glow over a finite 420 ms reveal."],
    durationMs: 420,
    easing: "ease-out",
    html: html(svg(
      "<defs><filter id='blue-completion-glow'><feDropShadow dx='0' dy='0' stdDeviation='12' flood-color='var(--fm-blue)' flood-opacity='.72'/></filter></defs>" +
      "<rect class='fm-surface' width='320' height='200' rx='14'/>" +
      "<rect x='70' y='58' width='180' height='82' rx='14' fill='var(--fm-panel)' stroke='var(--fm-border)' stroke-width='1.5'/>" +
      "<rect class='completion-halo' x='70' y='58' width='180' height='82' rx='14' fill='none' stroke='var(--fm-blue)' stroke-width='2' filter='url(#blue-completion-glow)' opacity='0'/>" +
      "<path d='M 138 98 l14 14 30-34' fill='none' stroke='var(--fm-blue)' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/>" +
      "<text x='160' y='164' text-anchor='middle' class='fm-muted'>complete</text>"
    )),
    tracks: [{
      selector: ".completion-halo",
      easing: "ease-out",
      keyframes: [{ offset: 0, opacity: 0 }, { offset: 1, opacity: 0.82 }],
    }],
    sourceTimeline: {
      durationMs: 420,
      description: "Source applies a static gold completion drop-shadow after camera return. KLIC changes the success hue to blue and adds a 420 ms reveal for the finite recipe.",
      frames: [{ atMs: 0, phase: "completion glow hidden" }, { atMs: 420, phase: "blue success glow visible" }],
    },
  }),
  make({
    key: "cam",
    category: "camera",
    title: ["시네마틱 카메라", "Cinematic camera"],
    summary: ["두 노드를 480ms 확대, 680ms 팬, 760ms 복귀로 연결합니다.", "Focus the source for 480 ms, pan for 680 ms, then return over 760 ms."],
    durationMs: 1920,
    easing: "cubic-bezier(0,0,.2,1)",
    html: html(svg(
      "<rect class='fm-surface' width='320' height='200' rx='14'/>" +
      "<g class='camera-scene'>" +
      "<path d='M 118 100 C 146 100 174 100 202 100' fill='none' stroke='var(--fm-border)' stroke-width='2'/>" +
      "<path d='M 118 100 C 146 100 174 100 202 100' fill='none' stroke='var(--fm-blue)' stroke-width='2' stroke-dasharray='5 5'/>" +
      "<rect x='30' y='76' width='88' height='48' rx='9' fill='var(--fm-panel)' stroke='var(--fm-border)'/>" +
      "<circle cx='48' cy='100' r='5' fill='var(--fm-blue)'/><text x='62' y='104' class='fm-ink'>source</text>" +
      "<rect x='202' y='76' width='88' height='48' rx='9' fill='var(--fm-panel)' stroke='var(--fm-blue)'/>" +
      "<circle cx='272' cy='100' r='5' fill='var(--fm-blue)'/><text x='216' y='104' class='fm-ink'>target</text>" +
      "</g><text x='160' y='166' text-anchor='middle' class='fm-muted'>480 zoom · 680 pan · 760 return</text>"
    ), ".fm-root .camera-scene{transform-box:view-box;transform-origin:0 0}"),
    tracks: [{
      selector: ".camera-scene",
      easing: "linear",
      keyframes: [
        { offset: 0, transform: "translate(0px,0px) scale(1)", easing: "cubic-bezier(0,0,.2,1)" },
        { offset: 0.25, transform: "translate(62.32px,-32px) scale(1.32)", easing: "cubic-bezier(0,0,.2,1)" },
        { offset: 0.604167, transform: "translate(-164.72px,-32px) scale(1.32)", easing: "cubic-bezier(0,0,.2,1)" },
        { offset: 1, transform: "translate(0px,0px) scale(1)" },
      ],
    }],
    sourceTimeline: {
      durationMs: 1920,
      description: "Source zooms to a node in 480 ms, pans while drawing the edge for 680 ms, and restores the full ViewBox in 760 ms.",
      frames: [
        { atMs: 0, phase: "full 1160×660 stage" },
        { atMs: 480, phase: "source-node zoom complete at 1.32×" },
        { atMs: 1160, phase: "target pan complete" },
        { atMs: 1920, phase: "full-stage return complete" },
      ],
    },
  }),
  make({
    key: "flow",
    category: "loops",
    title: ["대시 흐름", "Dashed flow"],
    summary: ["엣지 드로우 680ms 뒤 1초 동안 대시를 한 번 흐르게 합니다.", "After the 680 ms edge draw, move the dashed signal for one finite 1 s pass."],
    durationMs: 1680,
    easing: "linear",
    html: html(svg(
      "<rect class='fm-surface' width='320' height='200' rx='14'/>" +
      "<path d='" + route + "' fill='none' stroke='var(--fm-border)' stroke-width='3'/>" +
      "<path class='flow-line' d='" + route + "' fill='none' stroke='var(--fm-blue)' stroke-width='3' stroke-linecap='round' stroke-dasharray='3 15' stroke-dashoffset='0' opacity='0'/>" +
      "<circle cx='36' cy='100' r='7' fill='var(--fm-panel)' stroke='var(--fm-blue)' stroke-width='2'/>" +
      "<circle cx='284' cy='100' r='7' fill='var(--fm-blue)'/>"
    )),
    tracks: [
      {
        selector: ".flow-line",
        delay: 680,
        easing: "linear",
        keyframes: [{ offset: 0, strokeDashoffset: 0 }, { offset: 1, strokeDashoffset: -18 }],
      },
      {
        selector: ".flow-line",
        delay: 680,
        easing: "linear",
        keyframes: [
          { offset: 0, opacity: 0 },
          { offset: 0.4, opacity: 0.75 },
          { offset: 1, opacity: 0.75 },
        ],
      },
    ],
    sourceTimeline: {
      durationMs: 1680,
      description: "Source dash pattern is 3 15, travels 18 units per 1000 ms, and fades in after the 680 ms edge draw. KLIC shows one pass instead of an infinite loop.",
      frames: [
        { atMs: 0, phase: "edge not drawn" },
        { atMs: 680, phase: "flowline fade and dash travel start" },
        { atMs: 1080, phase: "flowline reaches .75 opacity" },
        { atMs: 1680, phase: "one dash pass ends" },
      ],
    },
  }),
  make({
    key: "particle",
    category: "particles",
    title: ["이동 입자", "Traveling particles"],
    summary: ["원본 곡선 경로를 따라 두 입자가 1700ms씩 850ms 간격으로 이동합니다.", "Two particles follow the same curve for 1700 ms each, staggered by 850 ms."],
    durationMs: 2550,
    easing: "linear",
    html: html(svg(
      "<defs><filter id='particle-blur'><feGaussianBlur stdDeviation='5'/></filter></defs>" +
      "<rect class='fm-surface' width='320' height='200' rx='14'/>" +
      "<path d='" + route + "' fill='none' stroke='var(--fm-border)' stroke-width='2'/>" +
      "<path d='" + route + "' fill='none' stroke='var(--fm-blue)' stroke-width='1.5' stroke-dasharray='4 6' opacity='.6'/>" +
      "<circle class='particle-one' cx='0' cy='0' r='7' fill='var(--fm-blue)' filter='url(#particle-blur)' transform='translate(36px,100px)'/>" +
      "<circle class='particle-one-core' cx='0' cy='0' r='3' fill='var(--fm-on-blue)' transform='translate(36px,100px)'/>" +
      "<circle class='particle-two' cx='0' cy='0' r='7' fill='var(--fm-blue)' filter='url(#particle-blur)' transform='translate(36px,100px)'/>" +
      "<circle class='particle-two-core' cx='0' cy='0' r='3' fill='var(--fm-on-blue)' transform='translate(36px,100px)'/>"
    ), ".fm-root .particle-one,.fm-root .particle-one-core,.fm-root .particle-two,.fm-root .particle-two-core{transform-box:view-box;transform-origin:0 0}"),
    tracks: [
      { selector: ".particle-one", keyframes: firstParticleFrames },
      { selector: ".particle-one-core", keyframes: firstParticleFrames },
      { selector: ".particle-two", delay: 850, keyframes: secondParticleFrames },
      { selector: ".particle-two-core", delay: 850, keyframes: secondParticleFrames },
    ],
    sourceTimeline: {
      durationMs: 2550,
      description: "Source creates two animateMotion particles per edge: each repeats on a 1700 ms path and the second begins 850 ms later. KLIC converts the first pass into a finite timeline.",
      frames: [
        { atMs: 0, phase: "particle 1 starts on route" },
        { atMs: 850, phase: "particle 2 starts; particle 1 is halfway" },
        { atMs: 1700, phase: "particle 1 arrives; particle 2 is halfway" },
        { atMs: 2550, phase: "particle 2 arrives" },
      ],
    },
  }),
  make({
    key: "arrowpop",
    category: "svg-diagram",
    title: ["화살촉 팝", "Arrowhead pop"],
    summary: ["경로 끝에 화살촉 하나가 400ms 동안 튀어 오릅니다.", "Pop one arrowhead at the end of a connector over the source 400 ms interval."],
    durationMs: 400,
    easing: "ease",
    html: html(svg(
      "<rect class='fm-surface' width='320' height='200' rx='14'/>" +
      "<path d='M 38 100 C 104 100 196 100 268 100' fill='none' stroke='var(--fm-border)' stroke-width='2.5'/>" +
      "<polygon class='arrowhead' points='282,100 268,106 268,94' fill='var(--fm-blue)' transform-box='fill-box' transform-origin='center'/>" +
      "<circle cx='38' cy='100' r='7' fill='var(--fm-panel)' stroke='var(--fm-blue)' stroke-width='2'/>" +
      "<circle cx='282' cy='100' r='7' fill='var(--fm-blue)'/>"
    )),
    tracks: [{
      selector: ".arrowhead",
      easing: "ease",
      keyframes: [
        { offset: 0, transform: "scale(.4)", opacity: 1 },
        { offset: 0.6, transform: "scale(1.3)", opacity: 1 },
        { offset: 1, transform: "scale(1)", opacity: 1 },
      ],
    }],
    sourceTimeline: {
      durationMs: 400,
      description: "Source arrowhead uses the shared .4 → 1.3 → 1 pop curve over 400 ms.",
      frames: [{ atMs: 0, phase: "arrow hidden" }, { atMs: 240, phase: "overshoot 1.3" }, { atMs: 400, phase: "arrow settles at 1" }],
    },
  }),
  make({
    key: "breath",
    category: "loops",
    title: ["출력 핸들 호흡", "Output handle breath"],
    summary: ["연결 핸들 링이 2.4초 동안 3.4배로 커지며 사라집니다.", "Expand one output-handle ring to 3.4× and fade it over the source 2.4 s cycle."],
    durationMs: 2400,
    easing: "ease-out",
    html: html(svg(
      "<rect class='fm-surface' width='320' height='200' rx='14'/>" +
      "<rect x='64' y='68' width='192' height='64' rx='12' fill='var(--fm-panel)' stroke='var(--fm-border)'/>" +
      "<text x='86' y='104' class='fm-ink'>output</text>" +
      "<circle cx='256' cy='100' r='5' fill='var(--fm-blue)'/>" +
      "<circle class='breath-ring' cx='256' cy='100' r='8' fill='none' stroke='var(--fm-blue)' stroke-width='1.5' transform-box='fill-box' transform-origin='center'/>"
    )),
    tracks: [{
      selector: ".breath-ring",
      easing: "ease-out",
      keyframes: [{ offset: 0, transform: "scale(1)", opacity: 0.8 }, { offset: 1, transform: "scale(3.4)", opacity: 0 }],
    }],
    sourceTimeline: {
      durationMs: 2400,
      description: "Source output handle breath scales from 1 to 3.4 and fades from .8 to 0 over 2.4 s; KLIC shows one finite cycle.",
      frames: [{ atMs: 0, phase: "scale 1 opacity .8" }, { atMs: 2400, phase: "scale 3.4 opacity 0" }],
    },
  }),
  make({
    key: "hover",
    category: "web-interaction",
    title: ["호버 리프트와 링", "Hover lift and ring"],
    summary: ["포인터 입력이 아닌 시간 기반 호버 상태 미리보기입니다.", "A timed hover-state preview; it does not claim to respond to pointer input."],
    durationMs: 240,
    easing: "ease-out",
    html: html(svg(
      "<rect class='fm-surface' width='320' height='200' rx='14'/>" +
      "<rect class='hover-ring' x='72' y='56' width='176' height='88' rx='16' fill='none' stroke='var(--fm-blue)' stroke-width='2' opacity='0'/>" +
      "<g class='hover-card'><rect x='82' y='66' width='156' height='68' rx='12' fill='var(--fm-panel)' stroke='var(--fm-border)'/><circle cx='105' cy='100' r='7' fill='var(--fm-blue)'/><text x='122' y='96' class='fm-ink'>node</text><text x='122' y='112' class='fm-muted'>timed hover study</text></g>"
    )),
    tracks: [
      { selector: ".hover-ring", keyframes: [{ offset: 0, opacity: 0 }, { offset: 1, opacity: 0.85 }] },
      { selector: ".hover-card", easing: "ease-out", keyframes: [{ offset: 0, transform: "translateY(0px)" }, { offset: 1, transform: "translateY(-4px)" }] },
    ],
    sourceTimeline: {
      durationMs: 240,
      description: "Source shows the node ring at .85 opacity on pointer hover without a timed transition. This standalone sample uses a labeled 240 ms timed hover-state reveal.",
      frames: [{ atMs: 0, phase: "ring hidden; card at rest" }, { atMs: 240, phase: "ring .85; card lifted 4 px" }],
    },
  }),
  make({
    key: "shine",
    category: "light",
    title: ["카드 빛 스윕", "Card light sweep"],
    summary: ["4.5초 중 앞 55%는 대기하고 나머지 구간에서 빛이 520px 이동합니다.", "Hold for the first 55% of 4.5 s, then sweep the highlight 520 px."],
    durationMs: 4500,
    easing: "ease-in-out",
    html: html(svg(
      "<defs><clipPath id='shine-clip'><rect x='40' y='46' width='240' height='108' rx='14'/></clipPath><linearGradient id='shine-gradient'><stop offset='0' stop-color='var(--fm-blue)' stop-opacity='0'/><stop offset='.5' stop-color='var(--fm-blue)' stop-opacity='.24'/><stop offset='1' stop-color='var(--fm-blue)' stop-opacity='0'/></linearGradient></defs>" +
      "<rect class='fm-surface' width='320' height='200' rx='14'/>" +
      "<rect x='40' y='46' width='240' height='108' rx='14' fill='var(--fm-panel)' stroke='var(--fm-border)'/>" +
      "<circle cx='70' cy='82' r='10' fill='var(--fm-selected)'/><path d='M 64 82 h12 M 70 76 v12' stroke='var(--fm-blue)' stroke-width='2'/>" +
      "<path d='M 92 78 h120 M 92 92 h88 M 64 122 h182' stroke='var(--fm-border)' stroke-width='4' stroke-linecap='round'/>" +
      "<g clip-path='url(#shine-clip)'><rect class='shine-band' x='-160' y='48' width='140' height='104' fill='url(#shine-gradient)'/></g>"
    )),
    tracks: [{
      selector: ".shine-band",
      easing: "ease-in-out",
      keyframes: [
        { offset: 0, transform: "translateX(0px)" },
        { offset: 0.55, transform: "translateX(0px)" },
        { offset: 1, transform: "translateX(520px)" },
      ],
    }],
    sourceTimeline: {
      durationMs: 4500,
      description: "Source shine band is 140 px wide, moves 520 px, waits through 55% of a 4.5 s loop, then sweeps to the end.",
      frames: [{ atMs: 0, phase: "band at x −160" }, { atMs: 2475, phase: "hold ends at 55%" }, { atMs: 4500, phase: "band completes 520 px sweep" }],
    },
  }),
  make({
    key: "grid",
    category: "camera",
    title: ["패럴랙스 그리드", "Parallax grid"],
    summary: ["카메라 팬에서 장면은 40px, 점 그리드는 24px 이동합니다.", "During one camera pan, the scene moves 40 px while the grid follows at 0.6×."],
    durationMs: 680,
    easing: "ease-out",
    html: html(svg(
      "<defs><pattern id='camera-dots' width='40' height='40' patternUnits='userSpaceOnUse'><circle cx='1' cy='1' r='.9' fill='var(--fm-border)'/></pattern></defs>" +
      "<rect class='fm-surface' width='320' height='200' rx='14'/>" +
      "<g class='parallax-grid'><rect x='-80' y='-40' width='480' height='280' fill='url(#camera-dots)'/></g>" +
      "<g class='grid-scene'><path d='M 118 100 h84' stroke='var(--fm-blue)' stroke-width='2'/><rect x='30' y='76' width='88' height='48' rx='9' fill='var(--fm-panel)' stroke='var(--fm-border)'/><text x='48' y='104' class='fm-ink'>source</text><rect x='202' y='76' width='88' height='48' rx='9' fill='var(--fm-panel)' stroke='var(--fm-border)'/><text x='220' y='104' class='fm-ink'>target</text></g>"
    ), ".fm-root .parallax-grid,.fm-root .grid-scene{transform-box:view-box;transform-origin:0 0}"),
    tracks: [
      { selector: ".grid-scene", easing: "ease-out", keyframes: [{ offset: 0, transform: "translate(0px,0px)" }, { offset: 1, transform: "translate(-40px,0px)" }] },
      { selector: ".parallax-grid", easing: "ease-out", keyframes: [{ offset: 0, transform: "translate(0px,0px)" }, { offset: 1, transform: "translate(-24px,0px)" }] },
    ],
    sourceTimeline: {
      durationMs: 680,
      description: "Source grid follows camera ViewBox offsets with a .6 multiplier; one 680 ms pan preserves that parallax ratio.",
      frames: [{ atMs: 0, phase: "scene and grid aligned" }, { atMs: 680, phase: "scene −40 px; grid −24 px" }],
    },
  }),
  make({
    key: "dust",
    category: "particles",
    title: ["부유 먼지", "Floating dust"],
    summary: ["원본 시드 42의 32개 점을 블루 토큰으로 바꾸고 각 원본 주기를 한 번 재생합니다.", "Use the source seed 42 and 32 dust points in KLIC blue, with one finite pass per original cycle."],
    durationMs: 13000,
    easing: "ease-in-out",
    html: html(svg("<rect class='fm-surface' width='320' height='200' rx='14'/>" + dustMarkup),
      ".fm-root circle[class^='dust-']{transform-box:fill-box;transform-origin:center}"),
    tracks: dustTracks,
    reducedProgress: 0.5,
    sourceTimeline: {
      durationMs: 13000,
      description: "Source seeds 32 dots with the 16807 LCG (seed 42); each drifts by at most 30 px and loops with an individual 6–13 s ease-in-out period. This preview plays one pass.",
      frames: [
        { atMs: 0, phase: "all dots at seeded start positions", seed: 42, count: 32 },
        { atMs: 3000, phase: "fast tracks approach midpoint offsets" },
        { atMs: 6500, phase: "slow tracks reach midpoint offsets" },
        { atMs: 13000, phase: "all tracks return to start positions", durationRangeMs: [6000, 13000] },
      ],
    },
  }),
  make({
    key: "ripple",
    category: "ui-feedback",
    title: ["도착 리플", "Arrival ripple"],
    summary: ["도착점에서 1100ms 링 세 개가 180ms 간격으로 퍼집니다.", "Three 1100 ms rings expand from the arrival point at 180 ms intervals."],
    durationMs: 1460,
    easing: "ease-out",
    html: html(svg(
      "<rect class='fm-surface' width='320' height='200' rx='14'/>" +
      "<path d='" + route + "' fill='none' stroke='var(--fm-border)' stroke-width='2'/>" +
      "<circle cx='284' cy='100' r='60' fill='none' stroke='var(--fm-blue)' stroke-width='2' class='ripple-0' opacity='0' transform-box='fill-box' transform-origin='center'/>" +
      "<circle cx='284' cy='100' r='60' fill='none' stroke='var(--fm-blue)' stroke-width='2' class='ripple-1' opacity='0' transform-box='fill-box' transform-origin='center'/>" +
      "<circle cx='284' cy='100' r='60' fill='none' stroke='var(--fm-blue)' stroke-width='2' class='ripple-2' opacity='0' transform-box='fill-box' transform-origin='center'/>" +
      "<circle cx='284' cy='100' r='5' fill='var(--fm-blue)'/>"
    )),
    tracks: [0, 1, 2].map((index) => {
      const delay = index * 180;
      const end = 1100 / (1460 - delay);
      return {
        selector: ".ripple-" + index,
        delay,
        easing: "ease-out",
        keyframes: [
          { offset: 0, transform: "scale(.2)", opacity: 0.9 },
          { offset: end, transform: "scale(1)", opacity: 0 },
          { offset: 1, transform: "scale(1)", opacity: 0 },
        ],
      };
    }),
    reducedProgress: 0.25,
    sourceTimeline: {
      durationMs: 1460,
      description: "Source uses three 1100 ms ease-out ripples with delays of 0, 180, and 360 ms.",
      frames: [
        { atMs: 0, phase: "ripple 1 starts" },
        { atMs: 180, phase: "ripple 2 starts" },
        { atMs: 360, phase: "ripple 3 starts" },
        { atMs: 1100, phase: "ripple 1 ends" },
        { atMs: 1280, phase: "ripple 2 ends" },
        { atMs: 1460, phase: "ripple 3 ends" },
      ],
    },
  }),
  make({
    key: "enter",
    category: "entrance",
    title: ["순차 노드 등장", "Sequential node entrance"],
    summary: ["24px 아래에서 세 노드가 120ms 간격으로 650ms씩 등장합니다.", "Three nodes rise 24 px and enter for 650 ms at the source 120 ms stagger."],
    durationMs: 890,
    easing: "cubic-bezier(.2,.8,.3,1)",
    html: html(svg("<rect class='fm-surface' width='320' height='200' rx='14'/>" + enterMarkup)),
    tracks: enterTracks,
    sourceTimeline: {
      durationMs: 890,
      description: "Each source node enters over 650 ms with cubic-bezier(.2,.8,.3,1), delayed by node index × 120 ms.",
      frames: [
        { atMs: 0, phase: "node 1 starts from y +24 px and scale .96" },
        { atMs: 650, phase: "node 1 settles" },
        { atMs: 120, phase: "node 2 enters" },
        { atMs: 240, phase: "node 3 enters" },
        { atMs: 890, phase: "node 3 settles" },
      ],
    },
  }),
  make({
    key: "type",
    category: "tx-typing",
    title: ["상태 타자기", "Status typewriter"],
    summary: ["실제 glyph span 다섯 개를 40ms 간격으로 표시합니다.", "Reveal five real glyph spans at the source 40 ms per-character interval."],
    durationMs: 200,
    easing: "linear",
    html: html(typingMarkup,
      ".fm-root .fm-type-card{min-height:0;height:100%;display:flex;align-items:center;justify-content:center;gap:16px;padding:20px;background:var(--fm-surface);border:1px solid var(--fm-border);border-radius:12px}.fm-root .fm-type-label{color:var(--fm-muted);font-size:12px}.fm-root .fm-type-value{display:flex;color:var(--fm-blue);font-size:24px;font-weight:650;letter-spacing:.02em}.fm-root .fm-type-value>span{display:inline-block;opacity:0;transform:translateY(4px)}"),
    tracks: typingTracks,
    sourceTimeline: {
      durationMs: 200,
      description: "Source clears the status string and appends one character every 40 ms; KLIC preview uses five segmented glyph spans.",
      frames: [
        { atMs: 0, phase: "zero visible glyphs" },
        { atMs: 40, phase: "glyph 1 visible" },
        { atMs: 80, phase: "glyph 2 visible" },
        { atMs: 120, phase: "glyph 3 visible" },
        { atMs: 160, phase: "glyph 4 visible" },
        { atMs: 200, phase: "glyph 5 visible; Ready readable" },
      ],
    },
  }),
  make({
    key: "pulse",
    category: "ui-feedback",
    title: ["완료 펄스와 컨페티", "Completion pulse and confetti"],
    summary: ["1.8초 링 펄스와 고정 시드 40조각 컨페티를 재생합니다.", "Pulse the completion ring for 1.8 s with 40 seeded blue-family confetti pieces."],
    durationMs: 1800,
    easing: "ease-in-out",
    html: html(svg(
      "<rect class='fm-surface' width='320' height='200' rx='14'/>" +
      "<g class='confetti'>" + confettiMarkup + "</g>" +
      "<rect x='90' y='68' width='140' height='64' rx='13' fill='var(--fm-panel)' stroke='var(--fm-border)'/>" +
      "<rect class='pulse-ring' x='84' y='62' width='152' height='76' rx='17' fill='none' stroke='var(--fm-blue)' stroke-width='2'/>" +
      "<path d='M 145 100 l10 10 21-23' fill='none' stroke='var(--fm-blue)' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/>" +
      "<text x='160' y='151' text-anchor='middle' class='fm-muted'>complete</text>"
    ), ".fm-root .confetti-piece-0,.fm-root [class^='confetti-piece-']{transform-box:fill-box;transform-origin:center}"),
    tracks: [
      {
        selector: ".pulse-ring",
        easing: "ease-in-out",
        keyframes: [
          { offset: 0, opacity: 0.15 },
          { offset: 0.5, opacity: 0.9 },
          { offset: 1, opacity: 0.15 },
        ],
      },
      ...confettiTracks,
    ],
    reducedProgress: 0.5,
    sourceTimeline: {
      durationMs: 1800,
      description: "Source pulse ring varies opacity .15 → .9 → .15 over 1800 ms. Source confetti uses 40 pieces, 1100–1800 ms motion, and cubic-bezier(.2,.8,.3,1); KLIC replaces Math.random with fixed seed 7 and blue-family colors.",
      frames: [
        { atMs: 0, phase: "ring opacity .15; 40 pieces at node center", seed: 7 },
        { atMs: 900, phase: "ring opacity .9; confetti in flight" },
        { atMs: 1800, phase: "ring opacity .15; finite confetti pass ends" },
      ],
    },
  }),
  make({
    key: "drag",
    category: "web-interaction",
    title: ["드래그 리프트", "Drag lift"],
    summary: ["실제 포인터 입력이 아닌 시간 기반 노드 이동 예시입니다.", "A timed node-move study, not an interactive pointer-drag API."],
    durationMs: 420,
    easing: "ease-out",
    html: html(svg(
      "<rect class='fm-surface' width='320' height='200' rx='14'/>" +
      "<path d='M 46 144 H 274' stroke='var(--fm-border)' stroke-width='2' stroke-dasharray='4 5'/>" +
      "<g class='drag-node'><rect x='70' y='64' width='150' height='68' rx='12' fill='var(--fm-panel)' stroke='var(--fm-border)'/><circle cx='94' cy='98' r='7' fill='var(--fm-blue)'/><text x='112' y='94' class='fm-ink'>node</text><text x='112' y='110' class='fm-muted'>timed drag study</text></g>" +
      "<circle cx='252' cy='130' r='4' fill='var(--fm-blue)'/>"
    ), ".fm-root .drag-node{transform-box:view-box;transform-origin:0 0}"),
    tracks: [{
      selector: ".drag-node",
      easing: "ease-out",
      keyframes: [
        { offset: 0, transform: "translate(0px,0px)", filter: "drop-shadow(0 1px 1px rgba(19,44,70,.08))" },
        { offset: 1, transform: "translate(34px,-12px)", filter: "drop-shadow(0 10px 12px rgba(19,44,70,.16))" },
      ],
    }],
    sourceTimeline: {
      durationMs: 420,
      description: "Source moves the selected node continuously from pointer deltas and clears its dragging state on pointerup; it defines no fixed duration. KLIC uses a labeled 420 ms timed sample.",
      frames: [{ atMs: 0, phase: "node at origin" }, { atMs: 420, phase: "node translated +34, −12 px and lifted" }],
    },
  }),
  make({
    key: "bar",
    category: "game-progress",
    title: ["진행 바", "Progress bar"],
    summary: ["세 개의 입력 완료 단계를 380ms 간격으로 채웁니다.", "Fill three input steps at the source 380 ms between-step cadence."],
    durationMs: 1140,
    easing: "linear",
    html: html(svg(
      "<rect class='fm-surface' width='320' height='200' rx='14'/>" +
      "<rect x='42' y='80' width='236' height='44' rx='12' fill='var(--fm-panel)' stroke='var(--fm-border)'/>" +
      "<text x='56' y='70' class='fm-muted'>input progress</text>" +
      "<rect x='58' y='98' width='204' height='7' rx='3.5' fill='var(--fm-selected)'/>" +
      "<rect class='progress-fill' x='58' y='98' width='0' height='7' rx='3.5' fill='var(--fm-blue)'/>" +
      "<circle cx='58' cy='101.5' r='3.5' fill='var(--fm-blue)'/>"
    )),
    tracks: [{
      selector: ".progress-fill",
      easing: "linear",
      keyframes: [
        { offset: 0, width: "0px" },
        { offset: 1 / 3, width: "68px" },
        { offset: 2 / 3, width: "136px" },
        { offset: 1, width: "204px" },
      ],
    }],
    sourceTimeline: {
      durationMs: 1140,
      description: "Source has three edges and updates the progress bar after each arrival, with a 380 ms pause after each edge; KLIC previews three stepped increments on the source cadence.",
      frames: [
        { atMs: 0, phase: "0 of 3 inputs complete" },
        { atMs: 380, phase: "1 of 3 inputs complete" },
        { atMs: 760, phase: "2 of 3 inputs complete" },
        { atMs: 1140, phase: "3 of 3 inputs complete" },
      ],
    },
  }),
];
