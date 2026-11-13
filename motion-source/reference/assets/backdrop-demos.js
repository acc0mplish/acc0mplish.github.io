/* 배경 모션 데모 8종.
   화면 전체에 깔리는 반복 배경. 무늬가 아니라 "느린 움직임"이 주인공이며, 모든 루프는 처음과 끝이 이어진다.
   크기는 cqmin(컨테이너 최소변 비율)로 잡아 카드·비교창·대화창 어디서든 같은 비율로 보인다. */
(() => {
  const demos = window.MOTION_DEMOS ||= {};
  const P = 'position:absolute;display:block;';
  const PALETTE = { purple: 'var(--klic-primitive-color-blue-600,#245fc2)', cyan: 'var(--klic-primitive-color-blue-100,#d8e5fb)', coral: 'var(--klic-primitive-color-blue-700,#1c4fa4)', yellow: 'var(--klic-primitive-color-blue-800,#163e80)' };
  const rgba = (accent, alpha) => `color-mix(in srgb,${PALETTE[accent]} ${alpha * 100}%,transparent)`;
  const TAU = Math.PI * 2;
  const r2 = n => Math.round(n * 100) / 100;
  const track = (selector, keyframes) => ({ selector, keyframes });
  const SINE = 'cubic-bezier(.37,0,.63,1)';
  // 결정적 의사난수(Math.random 금지: 같은 입력이면 같은 그림)
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

  function define(pattern, html, tracks, metadata = {}) {
    demos[pattern] = { html, tracks, duration: 10000, easing: 'linear', segmentEasing: false, reducedProgress: .35, ...metadata };
  }
  // 닫힌 루프: fn(t)가 t=0과 t=1에서 같은 값을 돌려주면 이음매가 없다
  const loop = (n, fn) => Array.from({ length: n + 1 }, (_, i) => ({ ...fn(i / n), offset: i / n, easing: 'linear' }));
  // 배경 위에 얹는 가짜 본문(가독성 확인용)
  const copy = (tone = 'var(--klic-primitive-color-white,#ffffff)') => `<span class="bd-copy" style="${P}left:0;right:0;top:50%;transform:translateY(-58%);text-align:center;z-index:3;pointer-events:none">` +
    `<span style="display:block;font:800 8cqmin/1.1 var(--klic-component-text-body-font-family,system-ui,sans-serif);letter-spacing:.04em;color:${tone}">BACKDROP</span>` +
    `<span style="display:block;margin-top:2.2cqmin;font:500 3cqmin/1.3 var(--klic-component-text-body-font-family,system-ui,sans-serif);color:${tone};opacity:.62">Text stays readable on top</span></span>`;
  const cap = (text, tone) => `<span class="mb-caption bd-cap" style="${P}left:0;bottom:2.4cqmin;z-index:3;font-size:2.4cqmin${tone ? `;color:${tone}` : ''}">${text}</span>`;
  const stage = (cls, bg, inner, caption, tone, capTone) => `<div class="bd-stage ${cls}" style="${P}inset:0;overflow:hidden;container-type:size;background:${bg}">${inner}${copy(tone)}${cap(caption, capTone)}</div>`;
  // R7-2: copy()(가짜 본문) 없는 배경 전용 스테이지 — 표지 합성 소비용(타이틀 캔버스와 텍스트 경합 방지).
  const stageBg = (cls, bg, inner, caption) => `<div class="bd-stage ${cls}" style="${P}inset:0;overflow:hidden;container-type:size;background:${bg}">${inner}${cap(caption)}</div>`;

  /* 1. 메시 그라디언트 표류 — 색 덩어리 4개가 서로 다른 주기로 겹쳐 흐른다 */
  const blobs = [
    { c: 'purple', x: 28, y: 30, s: 78, ax: 20, ay: 14, kx: 1, ky: 1, px: 0, py: .25, a: .55 },
    { c: 'cyan', x: 72, y: 36, s: 70, ax: 16, ay: 20, kx: 1, ky: 2, px: .3, py: 0, a: .42 },
    { c: 'coral', x: 62, y: 76, s: 72, ax: 22, ay: 12, kx: 2, ky: 1, px: .6, py: .5, a: .38 },
    { c: 'purple', x: 24, y: 78, s: 66, ax: 14, ay: 16, kx: 1, ky: 1, px: .85, py: .1, a: .34 }
  ];
  define('bdMeshDrift', stage('bd-mesh', 'var(--klic-primitive-color-night,#101722)',
    blobs.map((b, i) => `<span class="bd-blob bd-blob-${i}" style="${P}left:${b.x}%;top:${b.y}%;width:${b.s}cqmin;height:${b.s}cqmin;margin:${-b.s / 2}cqmin 0 0 ${-b.s / 2}cqmin;border-radius:50%;background:radial-gradient(circle,${rgba(b.c, b.a)} 0%,${rgba(b.c, 0)} 68%)"></span>`).join(''),
    'FOUR COLOR FIELDS · INTEGER-PERIOD LISSAJOUS'),
    blobs.map((b, i) => track(`.bd-blob-${i}`, loop(48, t => ({
      transform: `translate(${r2(b.ax * Math.sin(TAU * (b.kx * t + b.px)))}cqmin,${r2(b.ay * Math.cos(TAU * (b.ky * t + b.py)))}cqmin) scale(${r2(1 + .1 * Math.sin(TAU * (t + b.px)))})`
    })))),
    { duration: 12000, recipe: '4 radial-gradient blobs / translate ±14–22cqmin on 1× and 2× sine periods / scale ±10% / 12000ms seamless loop' });

  /* 2. 오로라 커튼 — 세로 빛줄기가 흔들리고 숨쉰다 */
  const curtains = [
    { c: 'cyan', x: 22, w: 34, h: 150, sk: 9, ax: 5, p: 0, a: .5 },
    { c: 'purple', x: 46, w: 40, h: 165, sk: -7, ax: 6, p: .27, a: .55 },
    { c: 'cyan', x: 68, w: 32, h: 140, sk: 6, ax: 5, p: .52, a: .42 },
    { c: 'coral', x: 86, w: 28, h: 125, sk: -8, ax: 4, p: .77, a: .3 }
  ];
  define('bdAuroraCurtain', stage('bd-aurora', 'linear-gradient(180deg,var(--klic-primitive-color-night,#101722) 0%,var(--klic-primitive-color-night,#101722) 60%,var(--klic-primitive-color-ink,#132c46) 100%)',
    curtains.map((k, i) => `<span class="bd-curtain bd-curtain-${i}" style="${P}left:${k.x}%;bottom:-18%;width:${k.w}cqmin;height:${k.h}%;margin-left:${-k.w / 2}cqmin;background:radial-gradient(ellipse at 50% 62%,${rgba(k.c, k.a)} 0%,${rgba(k.c, k.a * .35)} 38%,${rgba(k.c, 0)} 70%);transform-origin:50% 100%"></span>`).join(''),
    'SWAY · SKEW · BREATH, EACH ON ITS OWN PHASE'),
    curtains.map((k, i) => track(`.bd-curtain-${i}`, loop(48, t => {
      const w = Math.sin(TAU * (t + k.p));
      return { transform: `translateX(${r2(k.ax * w)}cqmin) skewX(${r2(k.sk * Math.sin(TAU * (t + k.p + .25)))}deg) scaleY(${r2(1 + .12 * w)})`, opacity: r2(.78 + .22 * Math.sin(TAU * (t + k.p + .5))) };
    }))),
    { duration: 14000, recipe: '4 elliptical radial-gradient columns / translateX ±4–6cqmin / skewX ±6–9° / scaleY ±12% / opacity .56–1 / 14000ms loop' });

  /* 3. 별빛 시차 — 먼 층일수록 느리고 작다 */
  const starLayer = (cls, tile, size, alpha, seed) => {
    const dots = Array.from({ length: 5 }, (_, i) => `radial-gradient(${size}px ${size}px at ${Math.round(hash(seed + i) * 100)}% ${Math.round(hash(seed + i + 9) * 100)}%,color-mix(in srgb,var(--klic-primitive-color-white,#ffffff) ${alpha * 100}%,transparent),color-mix(in srgb,var(--klic-primitive-color-white,#ffffff) 0%,transparent))`).join(',');
    return `<span class="${cls}" style="${P}left:0;top:0;width:100%;height:calc(100% + ${tile}px);background-image:${dots};background-size:${tile}px ${tile}px"></span>`;
  };
  const starLayers = [['bd-star-far', 90, 1.1, .5, 3], ['bd-star-mid', 140, 1.6, .75, 21], ['bd-star-near', 230, 2.4, 1, 47]];
  define('bdStarParallax', stage('bd-stars', 'radial-gradient(ellipse at 50% 120%,var(--klic-primitive-color-blue-600,#245fc2) 0%,var(--klic-primitive-color-night,#101722) 62%)',
    starLayers.map(([cls, tile, size, alpha, seed]) => starLayer(cls, tile, size, alpha, seed)).join(''),
    'THREE LAYERS · TILE 90 / 140 / 230PX PER LOOP'),
    starLayers.map(([cls, tile]) => track(`.${cls}`, [
      { transform: 'translateY(0)', offset: 0, easing: 'linear' },
      { transform: `translateY(${-tile}px)`, offset: 1 }
    ])),
    { duration: 9000, recipe: '3 tiled star layers / each translateY by exactly one tile (90 / 140 / 230px) over 9000ms / far = slow, near = fast' });

  /* 4. 물결 라인 — 한 파장만큼 옮기면 같은 그림이 되는 선들 */
  const WL = 160;
  const wavePath = (y, amp, phase) => {
    let d = '';
    for (let x = -2 * WL; x <= 320 + 2 * WL; x += 8) d += `${x === -2 * WL ? 'M' : 'L'}${x} ${r2(y + amp * Math.sin(TAU * (x / WL + phase)))} `;
    return d.trim();
  };
  const waves = Array.from({ length: 7 }, (_, i) => ({ y: 56 + i * 15, amp: 6 + (i % 3) * 3, ph: i * .13, dir: i % 2 ? 1 : -1, mult: i % 3 === 2 ? 2 : 1, c: i % 3 === 0 ? 'cyan' : i % 3 === 1 ? 'purple' : 'coral', a: r2(.75 - i * .07) }));
  define('bdWaveLines', stage('bd-waves', 'linear-gradient(180deg,var(--klic-primitive-color-night,#101722),var(--klic-primitive-color-ink,#132c46))',
    `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style="${P}inset:0;width:100%;height:100%" aria-hidden="true">` +
      waves.map((w, i) => `<path class="bd-wl bd-wl-${i}" d="${wavePath(w.y, w.amp, w.ph)}" fill="none" stroke="${rgba(w.c, w.a)}" stroke-width="1.4" stroke-linecap="round"/>`).join('') +
    '</svg>', 'SEVEN SINE LINES · SHIFT = ONE WAVELENGTH'),
    waves.map((w, i) => track(`.bd-wl-${i}`, [
      { transform: 'translateX(0px)', offset: 0, easing: 'linear' },
      { transform: `translateX(${w.dir * WL * w.mult}px)`, offset: 1 }
    ])),
    { duration: 12000, recipe: '7 polyline sine paths, wavelength 160 / translateX ±160px (or ±320px) over 12000ms / shift is an exact multiple of the wavelength' });

  /* 5. 그리드 호흡 — 점 격자 위로 밝은 고리가 퍼진다 */
  const dotGrid = alpha => `radial-gradient(circle at 50% 50%,color-mix(in srgb,var(--klic-primitive-color-paper,#fbfcfe) ${alpha * 100}%,transparent) 1.2px,transparent 1.6px)`;
  const ringMask = 'radial-gradient(circle closest-side,transparent 52%,var(--klic-primitive-color-night,#101722) 74%,transparent 100%)';
  define('bdGridBreath', stage('bd-grid', 'radial-gradient(ellipse at 50% 50%,var(--klic-primitive-color-ink,#132c46) 0%,var(--klic-primitive-color-night,#101722) 75%)',
    `<span style="${P}inset:0;background-image:${dotGrid(.22)};background-size:5cqmin 5cqmin"></span>` +
    `<span class="bd-grid-lit" style="${P}inset:0;background-image:${dotGrid(1)};background-size:5cqmin 5cqmin;-webkit-mask-image:${ringMask};mask-image:${ringMask};-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:50% 50%;mask-position:50% 50%;-webkit-mask-size:0% 0%;mask-size:0% 0%"></span>`,
    'DOT GRID · LIGHT RING EXPANDS FROM CENTER'),
    [track('.bd-grid-lit', [
      { WebkitMaskSize: '0% 0%', maskSize: '0% 0%', opacity: 1, offset: 0, easing: SINE },
      { WebkitMaskSize: '260% 260%', maskSize: '260% 260%', opacity: 1, offset: .8, easing: 'linear' },
      { WebkitMaskSize: '320% 320%', maskSize: '320% 320%', opacity: 0, offset: .92, easing: 'linear' },
      { WebkitMaskSize: '0% 0%', maskSize: '0% 0%', opacity: 0, offset: .9201, easing: 'linear' },
      { WebkitMaskSize: '0% 0%', maskSize: '0% 0%', opacity: 1, offset: 1 }
    ])],
    { duration: 8000, recipe: 'Dim dot grid + bright copy masked by a radial ring / mask-size 0→260% over 6400ms, fade out, restart at 0 / 8000ms' });

  /* 6. 보케 부유 — 흐릿한 빛 방울이 천천히 올라간다 */
  const BOKEH = Array.from({ length: 11 }, (_, i) => ({
    x: Math.round(6 + hash(i + 1) * 88), s: r2(7 + hash(i + 40) * 12), ph: r2(hash(i + 80)), sway: r2(2 + hash(i + 120) * 3),
    c: ['cyan', 'purple', 'yellow', 'coral'][i % 4], a: r2(.22 + hash(i + 160) * .2)
  }));
  const bokehFrames = b => {
    const n = 36, w = (1 - b.ph) % 1, pairs = [];
    for (let i = 0; i <= n; i++) { const t = i / n; if (b.ph === 0) pairs.push([t, t]); else pairs.push([t, t < w ? t + b.ph : t + b.ph - 1]); }
    if (b.ph !== 0) { pairs.push([w, 1], [w + .0001, 0]); pairs.sort((p, q) => p[0] - q[0]); }
    return pairs.map(([t, u]) => ({
      transform: `translate(${r2(b.sway * Math.sin(TAU * (u * 2 + b.ph)))}cqmin,${r2(30 - 160 * u)}cqmin)`,
      opacity: r2(Math.sin(Math.PI * u) ** 1.2), offset: t, easing: 'linear'
    }));
  };
  define('bdBokehRise', stage('bd-bokeh', 'linear-gradient(180deg,var(--klic-primitive-color-night,#101722) 0%,var(--klic-primitive-color-ink,#132c46) 100%)',
    BOKEH.map((b, i) => `<span class="bd-bokeh bd-bokeh-${i}" style="${P}left:${b.x}%;top:100%;width:${b.s}cqmin;height:${b.s}cqmin;border-radius:50%;background:radial-gradient(circle at 38% 34%,color-mix(in srgb,var(--klic-primitive-color-white,#ffffff) ${r2(b.a + .12) * 100}%,transparent),${rgba(b.c, b.a)} 42%,${rgba(b.c, 0)} 72%);opacity:0"></span>`).join(''),
    'ELEVEN SOFT ORBS · EACH ON ITS OWN PHASE'),
    BOKEH.map((b, i) => track(`.bd-bokeh-${i}`, bokehFrames(b))),
    { duration: 14000, recipe: '11 radial-gradient orbs (7–19cqmin) / translateY rise 160cqmin with ±2–5cqmin sway / opacity sin(πu) so each orb is invisible at wrap / 14000ms' });

  /* 7. 그레인 질감 — 12fps로 끊어 움직이는 필름 입자 */
  const grainJitter = Array.from({ length: 8 }, (_, i) => ({
    transform: `translate(${Math.round((hash(i + 3) - .5) * 60)}px,${Math.round((hash(i + 17) - .5) * 60)}px)`, offset: i / 8, easing: 'steps(1,end)'
  })).concat([{ transform: 'translate(0px,0px)', offset: 1 }]);
  define('bdFilmGrain', stage('bd-grain', 'radial-gradient(ellipse at 40% 35%,var(--klic-primitive-color-blue-600,#245fc2) 0%,var(--klic-primitive-color-night,#101722) 70%)',
    `<span style="${P}left:-12%;top:-12%;width:124%;height:124%;background:radial-gradient(circle at 70% 60%,${rgba('purple', .25)},transparent 55%)"></span>` +
    `<svg class="bd-grain-layer" style="${P}left:-12%;top:-12%;width:124%;height:124%;opacity:.34" aria-hidden="true">` +
      '<filter id="bd-noise" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.8 -.62"/></filter>' +
      '<rect width="100%" height="100%" filter="url(#bd-noise)"/></svg>',
    'GRAIN LAYER SNAPS TO A NEW OFFSET 8× PER LOOP'),
    [track('.bd-grain-layer', grainJitter)],
    { duration: 700, recipe: 'Oversized (124%) feTurbulence layer turned into white specks (alpha = noise×1.8−.62), opacity .34 / steps(1) jump between 8 random offsets (±30px) / 700ms loop ≈ 11fps' });

  /* 8. 스캔 광선 — 몇 초에 한 번 화면을 훑는 한 줄의 빛 */
  define('bdScanBeam', stage('bd-scan', 'linear-gradient(180deg,var(--klic-primitive-color-night,#101722),var(--klic-primitive-color-night,#101722))',
    `<span style="${P}inset:0;background:repeating-linear-gradient(180deg,color-mix(in srgb,var(--klic-primitive-color-white,#ffffff) 4.5%,transparent) 0 1px,transparent 1px 7cqmin)"></span>` +
    `<span class="bd-beam" style="${P}left:0;top:0;width:100%;height:26%;opacity:0;background:linear-gradient(180deg,${rgba('cyan', 0)} 0%,${rgba('cyan', .22)} 78%,${rgba('cyan', .6)} 98%,${rgba('cyan', .9)} 100%)"></span>`,
    'ONE SWEEP · THEN REST FOR 40% OF THE LOOP'),
    [track('.bd-beam', [
      { transform: 'translateY(-100%)', opacity: 0, offset: 0, easing: 'linear' },
      { transform: 'translateY(-100%)', opacity: 0, offset: .1, easing: SINE },
      { transform: 'translateY(-40%)', opacity: 1, offset: .22, easing: 'linear' },
      { transform: 'translateY(280%)', opacity: 1, offset: .56, easing: SINE },
      { transform: 'translateY(385%)', opacity: 0, offset: .7, easing: 'linear' },
      { transform: 'translateY(385%)', opacity: 0, offset: 1 }
    ])],
    { duration: 7000, reducedProgress: .4, recipe: 'Beam height 26%, gradient to a 1-cell bright leading edge / translateY −100%→385% over 4200ms (ease-in-out) / 40% rest / 7000ms' });

  // 위상이 ph 만큼 앞선 루프. u = (t + ph) mod 1 이고, u 가 1 → 0 으로 넘어가는 순간(t = 1 − ph)에 두 컷을 붙여 되감는다.
  // fn(0) 과 fn(1) 이 모두 보이지 않는 모습이어야 되감기가 보이지 않는다.
  const phased = (ph, n, fn) => {
    ph = ((ph % 1) + 1) % 1;
    const pts = [];
    for (let i = 0; i <= n; i++) { const t = i / n; let u = t + ph; if (u >= 1 && !(i === n && ph === 0)) u -= 1; pts.push([t, u]); }
    if (ph > 0) pts.push([1 - ph - .0001, 1], [1 - ph, 0]);
    pts.sort((a, b) => a[0] - b[0]);
    return pts.map(([t, u]) => ({ ...fn(u), offset: r2(t * 10000) / 10000, easing: 'linear' }));
  };

  /* 9. 종이 도형 표류 — 평면 도형 아홉 개가 저마다의 주기로 떠다니고, 회전은 도형의 대칭만큼만 돈다 */
  const PAPER = 'var(--klic-primitive-color-paper,#fbfcfe)', PAPER_INK = 'var(--klic-primitive-color-blue-600,#245fc2)';
  const HEX = { purple: 'var(--klic-primitive-color-blue-600,#245fc2)', cyan: 'var(--klic-primitive-color-blue-100,#d8e5fb)', coral: 'var(--klic-primitive-color-blue-700,#1c4fa4)', yellow: 'var(--klic-primitive-color-blue-700,#1c4fa4)' };
  const PAPER_SHAPES = [
    { k: 'circle', x: 13, y: 22, s: 15, c: HEX.yellow, ax: 3, ay: 4, fx: 1, fy: 1, ph: 0, rot: 0, sw: 0 },
    { k: 'semi', x: 85, y: 80, s: 22, c: HEX.coral, ax: 4, ay: 3, fx: 1, fy: 2, ph: .2, rot: 360, sw: 0 },
    { k: 'tri', x: 87, y: 19, s: 15, c: HEX.cyan, ax: 3, ay: 3, fx: 2, fy: 1, ph: .45, rot: -120, sw: 0 },
    { k: 'square', x: 9, y: 78, s: 12, c: HEX.purple, ax: 4, ay: 2, fx: 1, fy: 1, ph: .7, rot: 90, sw: 0 },
    { k: 'ring', x: 67, y: 13, s: 11, c: PAPER_INK, ax: 2, ay: 3, fx: 1, fy: 2, ph: .3, rot: 0, sw: 0 },
    { k: 'pill', x: 31, y: 88, s: 19, c: HEX.cyan, ax: 3, ay: 2, fx: 2, fy: 1, ph: .55, rot: 180, sw: 0 },
    { k: 'quarter', x: 38, y: 10, s: 11, c: HEX.coral, ax: 2, ay: 2, fx: 1, fy: 1, ph: .85, rot: 0, sw: 14 },
    { k: 'dot', x: 60, y: 87, s: 3.4, c: PAPER_INK, ax: 2, ay: 2, fx: 2, fy: 2, ph: .1, rot: 0, sw: 0 },
    { k: 'dot', x: 94, y: 50, s: 3, c: HEX.purple, ax: 1.5, ay: 3, fx: 1, fy: 2, ph: .62, rot: 0, sw: 0 }
  ];
  const paperShape = (d, i) => {
    const w = d.s, base = `${P}left:${d.x}%;top:${d.y}%;`;
    const geo = {
      circle: `width:${w}cqmin;height:${w}cqmin;margin:${-w / 2}cqmin 0 0 ${-w / 2}cqmin;border-radius:50%;background:${d.c}`,
      dot: `width:${w}cqmin;height:${w}cqmin;margin:${-w / 2}cqmin 0 0 ${-w / 2}cqmin;border-radius:50%;background:${d.c}`,
      semi: `width:${w}cqmin;height:${w / 2}cqmin;margin:${-w / 4}cqmin 0 0 ${-w / 2}cqmin;border-radius:${w}cqmin ${w}cqmin 0 0;background:${d.c};transform-origin:50% 50%`,
      tri: `width:${w}cqmin;height:${r2(w * .87)}cqmin;margin:${r2(-w * .58)}cqmin 0 0 ${-w / 2}cqmin;clip-path:polygon(50% 0,100% 100%,0 100%);background:${d.c};transform-origin:50% 66.7%`,
      square: `width:${w}cqmin;height:${w}cqmin;margin:${-w / 2}cqmin 0 0 ${-w / 2}cqmin;background:${d.c}`,
      ring: `width:${w}cqmin;height:${w}cqmin;margin:${-w / 2}cqmin 0 0 ${-w / 2}cqmin;border-radius:50%;border:${r2(w * .2)}cqmin solid ${d.c};box-sizing:border-box`,
      pill: `width:${w}cqmin;height:${r2(w * .34)}cqmin;margin:${r2(-w * .17)}cqmin 0 0 ${-w / 2}cqmin;border-radius:${w}cqmin;background:${d.c}`,
      quarter: `width:${w}cqmin;height:${w}cqmin;margin:${-w / 2}cqmin 0 0 ${-w / 2}cqmin;border-radius:100% 0 0 0;background:${d.c};transform-origin:100% 100%`
    }[d.k];
    return `<span class="bd-paper bd-paper-${i}" style="${base}${geo}"></span>`;
  };
  define('bdPaperShapes', stage('bd-paper-stage', `radial-gradient(ellipse at 50% 40%,var(--klic-primitive-color-paper,#fbfcfe) 0%,${PAPER} 70%)`,
    `<span style="${P}inset:0;background-image:radial-gradient(color-mix(in srgb,var(--klic-primitive-color-blue-600,#245fc2) 7%,transparent) .5px,transparent .8px);background-size:2.4cqmin 2.4cqmin"></span>` +
    PAPER_SHAPES.map(paperShape).join(''),
    'NINE FLAT SHAPES · EACH TURN MATCHES ITS SYMMETRY', PAPER_INK, 'var(--klic-primitive-color-blue-700,#1c4fa4)'),
    PAPER_SHAPES.map((d, i) => track(`.bd-paper-${i}`, loop(48, t => ({
      transform: `translate(${r2(d.ax * Math.sin(TAU * (d.fx * t + d.ph)))}cqmin,${r2(d.ay * Math.cos(TAU * (d.fy * t + d.ph)))}cqmin) rotate(${r2(d.rot * t + d.sw * Math.sin(TAU * (t + d.ph)))}deg)`
    })))),
    { duration: 16000, reducedProgress: .3, recipe: '9 flat CSS shapes (circle, semicircle, triangle, square, ring, pill, quarter, dots) / translate ±2–4cqmin on 1× and 2× periods / rotate only by each symmetry (square 90°, triangle 120°, pill 180°, semicircle 360°) so the wrap is invisible / 16000ms' });

  /* 10. 소나 고리 — 두 발신점에서 고리가 1/3 주기마다 퍼진다. 두 발신점은 1/6 어긋나 번갈아 울린다 */
  const EMITTERS = [{ x: 30, y: 64, c: 'cyan', ph: 0 }, { x: 74, y: 33, c: 'purple', ph: 1 / 6 }];
  const RINGS_PER = 3, PING_SIZE = 118;
  define('bdSonarPing', stage('bd-sonar', 'radial-gradient(ellipse at 38% 62%,var(--klic-primitive-color-ink,#132c46) 0%,var(--klic-primitive-color-night,#101722) 76%)',
    [30, 60, 90].map(s => `<span style="${P}left:${EMITTERS[0].x}%;top:${EMITTERS[0].y}%;width:${s}cqmin;height:${s}cqmin;margin:${-s / 2}cqmin 0 0 ${-s / 2}cqmin;border-radius:50%;border:1px solid ${rgba('cyan', .1)};box-sizing:border-box"></span>`).join('') +
    `<span style="${P}left:${EMITTERS[0].x}%;top:0;width:1px;height:100%;background:${rgba('cyan', .07)}"></span><span style="${P}left:0;top:${EMITTERS[0].y}%;width:100%;height:1px;background:${rgba('cyan', .07)}"></span>` +
    EMITTERS.map((e, i) => Array.from({ length: RINGS_PER }, (_, j) =>
      `<span class="bd-ping bd-ping-${i}-${j}" style="${P}left:${e.x}%;top:${e.y}%;width:4cqmin;height:4cqmin;transform:translate(-50%,-50%);border-radius:50%;border:1.6px solid ${rgba(e.c, .9)};box-sizing:border-box;opacity:0"></span>`).join('') +
      `<span class="bd-ping-core bd-ping-core-${i}" style="${P}left:${e.x}%;top:${e.y}%;width:2.6cqmin;height:2.6cqmin;margin:-1.3cqmin 0 0 -1.3cqmin;border-radius:50%;background:${rgba(e.c, 1)};box-shadow:0 0 2.4cqmin ${rgba(e.c, .7)}"></span>`).join(''),
    'TWO EMITTERS · THREE RINGS EACH · OFFSET 1/6'),
    EMITTERS.flatMap((e, i) => [
      // scale 로 키우면 테두리도 함께 가늘어져 작은 고리가 보이지 않는다. 지름을 직접 키워 선 굵기를 1.6px 로 지킨다
      ...Array.from({ length: RINGS_PER }, (_, j) => track(`.bd-ping-${i}-${j}`, phased(e.ph + j / RINGS_PER, 36, u => {
        const d = `${r2(4 + (PING_SIZE - 4) * (1 - (1 - u) ** 1.6))}cqmin`;
        return { width: d, height: d, opacity: r2(u < .05 ? u / .05 * .85 : .85 * (1 - u) ** 1.1) };
      }))),
      track(`.bd-ping-core-${i}`, loop(72, t => ({ transform: `scale(${r2(1 + .7 * Math.exp(-14 * ((((RINGS_PER * (t + e.ph)) % 1) + 1) % 1)))})` })))
    ]),
    { duration: 6000, recipe: '2 emitters × 3 rings (1.6px border) / each ring diameter 4→118cqmin ease-out (width/height, so the line stays 1.6px), opacity peak .85 then fades to 0 / rings 1/3 loop apart, emitters 1/6 apart / core flashes at each birth / 6000ms' });

  /* 11. 나뭇잎 그림자 — 벽에 비친 잎 그림자가 가지째 흔들리고, 잎은 따로 팔랑인다. 햇빛 덩어리가 천천히 옮겨 간다 */
  const LEAF = 'color-mix(in srgb,var(--klic-primitive-color-blue-800,#163e80) 30%,transparent)';
  const SPRIGS = [
    { x: -3, y: -8, base: 32, len: 54, ph: 0, leaves: 6 },
    { x: 104, y: -6, base: 148, len: 48, ph: .35, leaves: 5 },
    { x: 103, y: 96, base: 205, len: 40, ph: .7, leaves: 4 }
  ];
  const sunPatches = [{ x: 30, y: 30, s: 62, ax: 7, ay: 5, ph: 0 }, { x: 70, y: 62, s: 54, ax: 6, ay: 7, ph: .4 }, { x: 52, y: 88, s: 44, ax: 8, ay: 4, ph: .75 }];
  const leafHtml = (sp, i) => {
    let h = `<span class="bd-sprig bd-sprig-${i}" style="${P}left:${sp.x}%;top:${sp.y}%;width:0;height:0;transform:rotate(${sp.base}deg)">` +
      `<span style="${P}left:0;top:-.25cqmin;width:${sp.len}cqmin;height:.5cqmin;border-radius:.5cqmin;background:${LEAF}"></span>`;
    for (let k = 0; k < sp.leaves; k++) {
      const d = 8 + (sp.len - 10) * k / (sp.leaves - 1), side = k % 2 ? 1 : -1, L = 15 - k * 1.1;
      h += `<span class="bd-leaf bd-leaf-${i}-${k}" style="${P}left:${r2(d)}cqmin;top:0;width:${r2(L)}cqmin;height:${r2(L * .44)}cqmin;margin-top:${r2(-L * .22)}cqmin;border-radius:0 100% 0 100%;background:${LEAF};transform-origin:0 50%;transform:rotate(${side * 38}deg)"></span>`;
    }
    return h + '</span>';
  };
  define('bdLeafDapple', stage('bd-leaf', 'linear-gradient(160deg,var(--klic-primitive-color-paper,#fbfcfe) 0%,var(--klic-primitive-color-blue-700,#1c4fa4) 58%,var(--klic-primitive-color-blue-700,#1c4fa4) 100%)',
    sunPatches.map((s, i) => `<span class="bd-sun bd-sun-${i}" style="${P}left:${s.x}%;top:${s.y}%;width:${s.s}cqmin;height:${s.s}cqmin;margin:${-s.s / 2}cqmin 0 0 ${-s.s / 2}cqmin;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--klic-primitive-color-white,#ffffff) 80%,transparent) 0%,color-mix(in srgb,var(--klic-primitive-color-white,#ffffff) 35%,transparent) 38%,color-mix(in srgb,var(--klic-primitive-color-white,#ffffff) 0%,transparent) 70%)"></span>`).join('') +
    SPRIGS.map(leafHtml).join(''),
    'THREE SPRIGS SWAY · LEAVES FLUTTER 2–3× PER LOOP', 'var(--klic-primitive-color-ink,#132c46)', 'var(--klic-primitive-color-blue-700,#1c4fa4)'),
    [
      ...sunPatches.map((s, i) => track(`.bd-sun-${i}`, loop(48, t => ({ transform: `translate(${r2(s.ax * Math.sin(TAU * (t + s.ph)))}cqmin,${r2(s.ay * Math.sin(TAU * (2 * t + s.ph)))}cqmin)` })))),
      ...SPRIGS.map((sp, i) => track(`.bd-sprig-${i}`, loop(48, t => ({ transform: `rotate(${r2(sp.base + 3.5 * Math.sin(TAU * (t + sp.ph)))}deg)` })))),
      ...SPRIGS.flatMap((sp, i) => Array.from({ length: sp.leaves }, (_, k) => {
        const side = k % 2 ? 1 : -1, f = 2 + (k % 2), ph = hash(i * 13 + k);
        return track(`.bd-leaf-${i}-${k}`, loop(48, t => ({ transform: `rotate(${r2(side * 38 + 7 * Math.sin(TAU * (f * t + ph)))}deg)` })));
      }))
    ],
    { duration: 12000, reducedProgress: .3, recipe: '3 sprigs (stem + 4–6 leaves, rgba shadow .3, no blur) / sprig rotate ±3.5° once per loop, each leaf ±7° at 2× or 3× with its own phase / 3 sun patches drift ±4–8cqmin / 12000ms' });

  /* 12. 등고선 표류 — 같은 흔들림(±5)을 가진 등고선이 저마다 반대로 돌아, 지형이 천천히 바뀌는 것처럼 보인다 */
  const contour = (cx, cy, R, k, seed) => {
    const pts = [];
    for (let i = 0; i < 72; i++) {
      const a = i / 72 * TAU;
      const r = R + 5 * (.6 * Math.sin(2 * a + seed) + .4 * Math.sin(3 * a + seed * 1.7 + k * .1));
      pts.push(`${i ? 'L' : 'M'}${r2(cx + k * 1.3 + Math.cos(a) * r)} ${r2(cy - k * .8 + Math.sin(a) * r * .82)}`);
    }
    return pts.join(' ') + ' Z';
  };
  const HILLS = [{ cx: 214, cy: 92, n: 8, seed: .6 }, { cx: 58, cy: 152, n: 4, seed: 2.1 }];
  const CONTOURS = HILLS.flatMap((h, hi) => Array.from({ length: h.n }, (_, k) => ({ hi, k, d: contour(h.cx, h.cy, 13 + 13 * k, k, h.seed), ox: h.cx + k * 1.3, oy: h.cy - k * .8, dir: k % 2 ? -1 : 1, major: k % 4 === 3 })));
  define('bdContourDrift', stage('bd-contour', 'radial-gradient(ellipse at 66% 50%,var(--klic-primitive-color-ink,#132c46) 0%,var(--klic-primitive-color-night,#101722) 78%)',
    `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" style="${P}inset:0;width:100%;height:100%" aria-hidden="true">` +
      CONTOURS.map((c, i) => `<path class="bd-ct bd-ct-${i}" d="${c.d}" fill="none" stroke="${rgba('cyan', c.major ? .55 : r2(.34 - c.k * .02))}" stroke-width="${c.major ? 1.3 : .8}" stroke-linejoin="round" style="transform-origin:${r2(c.ox)}px ${r2(c.oy)}px"/>`).join('') +
    '</svg>', 'CONTOURS SHARE ONE ±5 WOBBLE · NEVER CROSS'),
    CONTOURS.map((c, i) => track(`.bd-ct-${i}`, [
      { transform: 'rotate(0deg)', offset: 0, easing: 'linear' },
      { transform: `rotate(${c.dir * 360}deg)`, offset: 1 }
    ])),
    { duration: 24000, recipe: '12 closed SVG contour paths, radius step 13 with one shared ±5 wobble (2θ + 3θ) / neighbours rotate 360° in opposite directions over 24000ms / wobble < half the spacing, so lines never cross' });


  /* ── R7-2(2026-11-02 사용자 요청 "배경모션 왕창 추가"). 표지 합성용 선명 배경 12종.
     기존 8종이 '본문 뒤 앰비언트'로 은은한 데 반해, 이 12종은 썸네일에서도 장면이 읽히는 배경이다.
     copy()(가짜 본문)를 넣지 않는다 — 소비자가 표지 배경이며 덱 타이틀과 경합하지 않게 한다. ── */

  /* 14. 도트 그리드 파동 — 격자 점들이 중심에서 바깥으로 물결치듯 눈에 띈다 */
  {
    const N = 7, dots = [];
    for (let gy = 0; gy < N; gy++) for (let gx = 0; gx < N; gx++) {
      const d = Math.hypot(gx - 3, gy - 3);
      dots.push(`<span class="bd-dp bd-dp-${gy}-${gx}" style="${P}left:${10 + gx * 13.3}%;top:${12 + gy * 12.6}%;width:3.4cqmin;height:3.4cqmin;margin:-1.7cqmin;border-radius:50%;background:${rgba(gx % 2 ? 'cyan' : 'purple', .8)}"></span>`);
    }
    const dpTracks = [];
    for (let gy = 0; gy < N; gy++) for (let gx = 0; gx < N; gx++) {
      const ph = Math.hypot(gx - 3, gy - 3) / 4.3;
      dpTracks.push(track(`.bd-dp-${gy}-${gx}`, loop(24, t => {
        const w = Math.sin(TAU * (t - ph)) * .5 + .5;
        return { transform: `scale(${r2(.55 + w * 1.1)})`, opacity: r2(.25 + w * .75) };
      })));
    }
    define('bdDotPulse', stageBg('bd-dots', 'radial-gradient(ellipse at 50% 45%,var(--klic-primitive-color-ink,#132c46) 0%,var(--klic-primitive-color-night,#101722) 75%)', dots.join(''),
      'DOT GRID RIPPLE · PHASE = DISTANCE FROM CENTER'), dpTracks,
      { duration: 9000, recipe: '49 dots, scale .55–1.65 and opacity .25–1 driven by sin(2π(t − dist/4.3)) / 9000ms seamless' });
  }

  /* 15. 코닉 일출 — 회전하는 빛살 원반이 따뜻한 무대가 된다 */
  define('bdSunrise', stageBg('bd-sun', 'linear-gradient(180deg,var(--klic-primitive-color-ink,#132c46) 0%,var(--klic-primitive-color-blue-600,#245fc2) 55%,var(--klic-primitive-color-ink,#132c46) 100%)',
    `<span class="bd-sun-disc" style="${P}left:50%;top:42%;width:46cqmin;height:46cqmin;margin:-23cqmin;border-radius:50%;background:conic-gradient(from 0deg,color-mix(in srgb,var(--klic-primitive-color-blue-700,#1c4fa4) 75%,transparent),color-mix(in srgb,var(--klic-primitive-color-blue-700,#1c4fa4) 28%,transparent),color-mix(in srgb,var(--klic-primitive-color-blue-700,#1c4fa4) 60%,transparent),color-mix(in srgb,var(--klic-primitive-color-blue-700,#1c4fa4) 28%,transparent),color-mix(in srgb,var(--klic-primitive-color-blue-700,#1c4fa4) 75%,transparent));filter:saturate(1.15)"></span>` +
    `<span class="bd-sun-halo" style="${P}left:50%;top:42%;width:74cqmin;height:74cqmin;margin:-37cqmin;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--klic-primitive-color-blue-700,#1c4fa4) 30%,transparent) 0%,color-mix(in srgb,var(--klic-primitive-color-blue-700,#1c4fa4) 0%,transparent) 62%)"></span>`,
    'CONIC DISC 360° / HALO BREATHE ±5%'), [
      track('.bd-sun-disc', [
        { transform: 'rotate(0deg) scale(1)', offset: 0, easing: 'linear' },
        { transform: 'rotate(360deg) scale(1)', offset: 1 }
      ]),
      track('.bd-sun-halo', loop(20, t => ({ opacity: r2(.7 + Math.sin(TAU * t) * .3), transform: `scale(${r2(1 + Math.sin(TAU * t) * .05)})` })))
    ],
    { duration: 16000, recipe: 'Conic 4-stop warm disc rotates 360° over 16s / halo opacity .4–1 and scale ±5% on one sine / linear, seamless' });

  /* 16. 물결 띠 — 가로 그라디언트 띠 4장이 서로 다른 속도로 흐른다 */
  {
    const bands = [
      { c: 'cyan', top: 8, h: 16, amp: 3, k: 1, a: .5 },
      { c: 'purple', top: 30, h: 20, amp: 4, k: 2, a: .42 },
      { c: 'coral', top: 55, h: 14, amp: 3, k: 1, a: .4 },
      { c: 'yellow', top: 74, h: 12, amp: 2.4, k: 2, a: .3 }
    ];
    define('bdWaveBands', stageBg('bd-bands', 'linear-gradient(180deg,var(--klic-primitive-color-ink,#132c46) 0%,var(--klic-primitive-color-night,#101722) 100%)',
      bands.map((b, i) => `<span class="bd-wb bd-wb-${i}" style="${P}left:-30%;right:-30%;top:${b.top}%;height:${b.h}%;background:linear-gradient(90deg,${rgba(b.c, 0)} 0%,${rgba(b.c, b.a)} 50%,${rgba(b.c, 0)} 100%);border-radius:50%"></span>`).join(''),
      '4 BANDS · INTEGER-PERIOD DRIFT ± amp cqmin'),
      bands.map((b, i) => track(`.bd-wb-${i}`, loop(28, t => ({
        transform: `translate(${r2(Math.sin(TAU * (b.k * t)) * b.amp)}cqmin, ${r2(Math.cos(TAU * t) * b.amp * .4)}cqmin)`
      }))))
    );
  }

  /* 17. 보케 부양 — 큰 소프트 서클들이 아래에서 위로 떠오른다 */
  {
    const bk = Array.from({ length: 7 }, (_, i) => ({
      c: ['purple', 'cyan', 'coral', 'yellow'][i % 4], x: 12 + hash(i * 3 + 1) * 76, s: 14 + hash(i * 5 + 2) * 26,
      dur: 0.6 + hash(i * 7 + 3) * 0.4, ph: hash(i * 11 + 4), a: .3 + hash(i * 13 + 5) * .25
    }));
    define('bdBokeh', stageBg('bd-bokeh', 'radial-gradient(ellipse at 30% 20%,var(--klic-primitive-color-ink,#132c46) 0%,var(--klic-primitive-color-night,#101722) 80%)',
      bk.map((b, i) => `<span class="bd-bk bd-bk-${i}" style="${P}left:${r2(b.x)}%;bottom:-30%;width:${r2(b.s)}cqmin;height:${r2(b.s)}cqmin;border-radius:50%;background:radial-gradient(circle,${rgba(b.c, b.a)} 0%,${rgba(b.c, 0)} 70%)"></span>`).join(''),
      '7 BOKEH · RISE 130cqmin · SINE X-SWAY'),
      bk.map((b, i) => track(`.bd-bk-${i}`, loop(30, t => ({
        transform: `translate(${r2(Math.sin(TAU * (2 * t + b.ph)) * 7)}cqmin, ${r2(-130 * t)}cqmin)`,
        opacity: t < .12 ? r2(t / .12) : t > .88 ? r2((1 - t) / .12) : 1
      }))))
    );
  }

  /* 18. 행진 스트라이프 — 대각 줄무늬 층이 무한히 흐른다 */
  define('bdMarchStripes', stageBg('bd-stripes', 'var(--klic-primitive-color-night,#101722)',
    `<span class="bd-st-a" style="${P}inset:-40%;background:repeating-linear-gradient(135deg,color-mix(in srgb,var(--klic-primitive-color-blue-100,#d8e5fb) 16%,transparent) 0 6cqmin,transparent 6cqmin 18cqmin)"></span>` +
    `<span class="bd-st-b" style="${P}inset:-40%;background:repeating-linear-gradient(45deg,color-mix(in srgb,var(--klic-primitive-color-blue-600,#245fc2) 14%,transparent) 0 5cqmin,transparent 5cqmin 21cqmin)"></span>`,
    'TWO STRIPE LAYERS · OPPOSITE MARCH'), [
      track('.bd-st-a', [
        { transform: 'translate(0,0)', offset: 0, easing: 'linear' },
        { transform: 'translate(25.45cqmin,25.45cqmin)'.replace(/cqmin/g, 'px'), offset: 1 }
      ]),
      track('.bd-st-b', [
        { transform: 'translate(0,0)', offset: 0, easing: 'linear' },
        { transform: 'translate(-29.7px,29.7px)', offset: 1 }
      ])
    ],
    { duration: 12000, recipe: 'Two repeating-linear-gradient layers 180% oversized / each translates exactly one stripe period diagonally per 12s loop / opposite directions' });

  /* 19. 네온 스캔 — 수평 광띠가 세로로 훑으며 가장자리가 숨쉰다 */
  define('bdNeonScan', stageBg('bd-scan', 'linear-gradient(180deg,var(--klic-primitive-color-night,#101722) 0%,var(--klic-primitive-color-night,#101722) 100%)',
    `<span class="bd-sc-band" style="${P}left:0;right:0;top:0;height:26%;background:linear-gradient(180deg,color-mix(in srgb,var(--klic-primitive-color-blue-100,#d8e5fb) 0%,transparent) 0%,color-mix(in srgb,var(--klic-primitive-color-blue-100,#d8e5fb) 40%,transparent) 55%,color-mix(in srgb,var(--klic-primitive-color-blue-600,#245fc2) 12%,transparent) 100%);filter:blur(1px)"></span>` +
    `<span class="bd-sc-edge" style="${P}inset:0;border:2px solid color-mix(in srgb,var(--klic-primitive-color-blue-100,#d8e5fb) 35%,transparent);border-radius:2cqmin"></span>`,
    'SCAN BAND Y 0→100% · EDGE OPACITY .2–.5'), [
      track('.bd-sc-band', [
        { transform: 'translateY(-30%)', offset: 0, easing: 'linear' },
        { transform: 'translateY(400%)', offset: 1 }
      ]),
      track('.bd-sc-edge', loop(20, t => ({ opacity: r2(.35 + Math.sin(TAU * t) * .15) })))
    ],
    { duration: 7000, recipe: 'Gradient band sweeps −30%→400% in 7s linear / border frame opacity .2–.5 sine / dark navy base' });

  /* 20. 입자 유영 — 점 20개가 제 갈 길을 천천히 간다 */
  {
    const pt = Array.from({ length: 20 }, (_, i) => ({
      x: 4 + hash(i * 17 + 1) * 92, y: 6 + hash(i * 19 + 2) * 88, s: .9 + hash(i * 23 + 3) * 1.6,
      ax: 4 + hash(i * 29 + 4) * 8, ay: 3 + hash(i * 31 + 5) * 6, kx: 1 + (i % 2), ky: 1 + (i % 3),
      px: hash(i * 37 + 6), c: ['cyan', 'purple', 'coral'][i % 3]
    }));
    define('bdParticleField', stageBg('bd-field', 'radial-gradient(ellipse at 70% 30%,var(--klic-primitive-color-ink,#132c46) 0%,var(--klic-primitive-color-night,#101722) 85%)',
      pt.map((p, i) => `<span class="bd-pf bd-pf-${i}" style="${P}left:${r2(p.x)}%;top:${r2(p.y)}%;width:${r2(p.s)}cqmin;height:${r2(p.s)}cqmin;margin:${r2(-p.s / 2)}cqmin;border-radius:50%;background:${rgba(p.c, .85)}"></span>`).join(''),
      '20 DOTS · 1×–3× LISSAJOUS PER DOT'),
      pt.map((p, i) => track(`.bd-pf-${i}`, loop(26, t => ({
        transform: `translate(${r2(Math.sin(TAU * (p.kx * t + p.px)) * p.ax)}cqmin, ${r2(Math.cos(TAU * (p.ky * t + p.px)) * p.ay)}cqmin)`,
        opacity: r2(.45 + Math.sin(TAU * (2 * t + p.px)) * .4)
      }))))
    );
  }

  /* 21. 프리즘 빛살 — 기울어진 빛 줄기 3개가 천천히 쓸고 지나간다 */
  {
    const beams = [
      { c: 'cyan', x: 6, w: 22, rot: 24, ph: 0 },
      { c: 'purple', x: 40, w: 28, rot: -18, ph: .33 },
      { c: 'coral', x: 70, w: 20, rot: 12, ph: .66 }
    ];
    define('bdPrismBeams', stageBg('bd-prism', 'linear-gradient(115deg,var(--klic-primitive-color-night,#101722) 0%,var(--klic-primitive-color-ink,#132c46) 60%,var(--klic-primitive-color-night,#101722) 100%)',
      beams.map((b, i) => `<span class="bd-pb bd-pb-${i}" style="${P}left:${b.x}%;top:-30%;bottom:-30%;width:${b.w}%;transform-origin:50% 50%;background:linear-gradient(90deg,${rgba(b.c, 0)} 0%,${rgba(b.c, .5)} 50%,${rgba(b.c, 0)} 100%);transform:rotate(${b.rot}deg);filter:blur(2px)"></span>`).join(''),
      '3 BEAMS · X-DRIFT ±10cqmin · BREATHE'),
      beams.map((b, i) => track(`.bd-pb-${i}`, loop(30, t => ({
        transform: `translateX(${r2(Math.sin(TAU * (t + b.ph)) * 10)}cqmin) rotate(${b.rot + r2(Math.sin(TAU * (t + b.ph)) * 4)}deg)`,
        opacity: r2(.5 + Math.sin(TAU * (t + b.ph)) * .45)
      }))))
    );
  }

  /* 22. 셀 그리드 파동 — 둥근 사각 격자가 물결처럼 빛난다 */
  {
    const cells = [];
    for (let gy = 0; gy < 5; gy++) for (let gx = 0; gx < 8; gx++) {
      cells.push({ gx, gy, ph: (gx + gy) / 11 });
    }
    define('bdCellPulse', stageBg('bd-cells', 'linear-gradient(180deg,var(--klic-primitive-color-ink,#132c46) 0%,var(--klic-primitive-color-night,#101722) 100%)',
      cells.map(c => `<span class="bd-cp bd-cp-${c.gx}-${c.gy}" style="${P}left:${4 + c.gx * 12}%;top:${8 + c.gy * 17}%;width:9.5%;height:13.5%;border-radius:2.4cqmin;background:${rgba((c.gx + c.gy) % 2 ? 'purple' : 'cyan', .5)}"></span>`).join(''),
      '5×8 ROUNDED CELLS · DIAGONAL PHASE WAVE'),
      cells.map(c => track(`.bd-cp-${c.gx}-${c.gy}`, loop(24, t => {
        const w = Math.sin(TAU * (t - c.ph)) * .5 + .5;
        return { opacity: r2(.15 + w * .85), transform: `scale(${r2(.86 + w * .14)})` };
      })))
    );
  }

  /* 23. 용암 덩어리 — 진한 색 덩어리 3개가 부풀고 누그러진다 */
  {
    const lv = [
      { c: 'coral', x: 30, y: 40, s: 64, k: 1, ph: 0 },
      { c: 'purple', x: 68, y: 62, s: 56, k: 2, ph: .5 },
      { c: 'yellow', x: 52, y: 26, s: 34, k: 1, ph: .25 }
    ];
    define('bdLavaBlobs', stageBg('bd-lava', 'radial-gradient(ellipse at 50% 60%,var(--klic-primitive-color-night,#101722) 0%,var(--klic-primitive-color-night,#101722) 80%)',
      lv.map((b, i) => `<span class="bd-lv bd-lv-${i}" style="${P}left:${b.x}%;top:${b.y}%;width:${b.s}cqmin;height:${r2(b.s * .8)}cqmin;margin:${r2(-b.s * .4)}cqmin 0 0 ${r2(-b.s * .4)}cqmin;background:${rgba(b.c, .75)};filter:blur(6cqmin);border-radius:50%"></span>`).join(''),
      '3 BLOBS · SCALE .9–1.15 · BLUR 6cqmin'),
      lv.map((b, i) => track(`.bd-lv-${i}`, loop(28, t => ({
        transform: `scale(${r2(.9 + Math.sin(TAU * (b.k * t + b.ph)) * .13)}) translate(${r2(Math.cos(TAU * t) * 4)}cqmin, ${r2(Math.sin(TAU * (b.k * t)) * 3)}cqmin)`,
        opacity: r2(.7 + Math.sin(TAU * (t + b.ph)) * .3)
      }))))
    );
  }

  /* 24. 별하늘 항해 — 별점들이 반짝이고 하늘이 느리게 흐른다 */
  {
    const stars = Array.from({ length: 26 }, (_, i) => ({
      x: hash(i * 41 + 1) * 100, y: hash(i * 43 + 2) * 100, s: .8 + hash(i * 47 + 3) * 1.8, ph: hash(i * 53 + 4)
    }));
    define('bdStarfield', stageBg('bd-sfwrap', 'linear-gradient(180deg,var(--klic-primitive-color-night,#101722) 0%,var(--klic-primitive-color-ink,#132c46) 60%,var(--klic-primitive-color-ink,#132c46) 100%)',
      `<span class="bd-sf-layer" style="${P}inset:-15%">${stars.map((s, i) => `<span class="bd-sf bd-sf-${i}" style="${P}left:${r2(s.x)}%;top:${r2(s.y)}%;width:${r2(s.s)}cqmin;height:${r2(s.s)}cqmin;border-radius:50%;background:var(--klic-primitive-color-paper,#fbfcfe)"></span>`).join('')}</span>` +
      `<span class="bd-sf-moon" style="${P}right:12%;top:14%;width:12cqmin;height:12cqmin;border-radius:50%;background:radial-gradient(circle at 38% 35%,var(--klic-primitive-color-paper,#fbfcfe) 0%,var(--klic-primitive-color-blue-700,#1c4fa4) 70%);box-shadow:0 0 14cqmin color-mix(in srgb,var(--klic-primitive-color-paper,#fbfcfe) 25%,transparent)"></span>`,
      '26 STARS TWINKLE · SKY PANS 8cqmin LOOP'), [
        ...stars.map((s, i) => track(`.bd-sf-${i}`, loop(22, t => ({ opacity: r2(.25 + (Math.sin(TAU * (t + s.ph)) * .5 + .5) * .75) })))),
        track('.bd-sf-layer', loop(30, t => ({ transform: `translate(${r2(Math.sin(TAU * t) * 8)}cqmin, ${r2(Math.cos(TAU * t) * 4)}cqmin)` })))
      ],
      { duration: 14000, recipe: '26 deterministic stars, opacity .25–1 twinkle on staggered phases / star layer pans ±8cqmin×±4cqmin Lissajous / moon glow static / 14000ms seamless' }
    );
  }

  /* 25. 집광 선로 — 중심에서 뻗는 빛살 12개가 돌며 명멸한다 */
  {
    const rays = Array.from({ length: 12 }, (_, i) => ({ a: i * 30, ph: i / 12 }));
    define('bdFocusRays', stageBg('bd-rays', 'radial-gradient(circle at 50% 50%,var(--klic-primitive-color-ink,#132c46) 0%,var(--klic-primitive-color-night,#101722) 72%)',
      rays.map((r, i) => `<span class="bd-fr bd-fr-${i}" style="${P}left:50%;top:50%;width:2.6cqmin;height:78cqmin;margin:-39cqmin 0 0 -1.3cqmin;transform-origin:50% 100%;transform:rotate(${r.a}deg);background:linear-gradient(180deg,${rgba('purple', 0)} 0%,${rgba('purple', .55)} 100%)"></span>`).join('') +
      `<span class="bd-fr-core" style="${P}left:50%;top:50%;width:20cqmin;height:20cqmin;margin:-10cqmin;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--klic-primitive-color-blue-700,#1c4fa4) 50%,transparent) 0%,color-mix(in srgb,var(--klic-primitive-color-blue-700,#1c4fa4) 0%,transparent) 70%)"></span>`,
      '12 WEDGES · SHARED 360° ROTATE · STAGGERED FLICKER'),
      rays.map((r, i) => track(`.bd-fr-${i}`, loop(26, t => ({
        transform: `rotate(${r.a + Math.round(t * 360)}deg)`,
        opacity: r2(.3 + (Math.sin(TAU * (2 * t + r.ph)) * .5 + .5) * .7)
      }))))
    );
  }

})();
