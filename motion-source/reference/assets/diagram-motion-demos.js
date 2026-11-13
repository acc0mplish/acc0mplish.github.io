/* Diagram motion demos (category: svg-diagram) — 20 choreographies (#1–#8 connector/box, #9–#20 diagram forms in 3 groups; see the 다이어그램 형태 12종 block).
 *
 * (가) 화살촉 polygon 개수 (헤더 합계 == DOM `.diagram-motion polygon[data-arrow]` 개수)
 *   #1 svgDiagramLinkDraw  1
 *   #2 svgDiagramFanOut    3
 *   #3 svgDiagramFanIn     3
 *   #4 svgDiagramSelfLoop  1
 *   #5 svgDiagramBoxChain  2
 *   #6 svgDiagramGroupFrame 0   (연결선 없음)
 *   #7 svgDiagramDualFlow  2    (요청 끝 1 + 응답 끝 1)
 *   #8 svgDiagramStepBadge 2
 *   합계 14 (#1–#8). #9–#20 확장분 화살촉 32 → 전체 46 (아래 형태 블록 참고)
 *
 * (나) 위상 · 주 메커니즘 · 노드 모양 (8개 주 메커니즘 중 stroke-dashoffset 만 #1·#2 가 공유 — 사용자 예시 E1·E2)
 *   # | 위상          | 주 메커니즘                   | 노드 모양
 *   1 | 직선 1        | stroke-dashoffset (pathLength) | 사각 2
 *   2 | 분기 1→3 곡선 | stroke-dashoffset (시차)       | 원 1 + 사각 3
 *   3 | 합류 3→1      | stroke-width                   | 알약 3 + 원 1
 *   4 | 자기 고리     | scaleY (활성 막대)             | 생명선 + 사각 1 + 막대
 *   5 | 체인 3        | translateY (오버슈트)          | 사각 3
 *   6 | 포함          | fill·stroke 색 전환            | 점선 묶음 1 + 사각 2
 *   7 | 평행 2        | opacity 교차 (polygon)         | 사각 2
 *   8 | 체인 3 (번호) | rotateY (배지, 숫자는 opacity) | 원 3
 *
 * 기하 규칙: 연결선 시작은 노드에서 5px, 경로 끝은 노드 11px 앞, 화살촉 polygon 끝은 노드 5px 앞.
 * 선 굵기 <= 1.5. 모든 좌표는 속성(d/points/x/y)으로 둔다. 번들·기존 파일은 건드리지 않는다.
 */
(() => {
  const demos = window.MOTION_DEMOS ||= {};
  // 카드별 3색 팔레트 (--c1/--c2/--c3). 색은 CSS 가 var() 로 읽고, WAAPI 트랙에 하드코딩된 색은 아래 값과 맞춘다.
  const S1 = ['#38e1ff', '#ff5fa2', '#ffd23f'], S2 = ['#a78bfa', '#34d399', '#fb923c'], S3 = ['#f472b6', '#60a5fa', '#facc15'],
        S4 = ['#2dd4bf', '#f97316', '#c084fc'], S5 = ['#4ade80', '#22d3ee', '#f43f5e'], S6 = ['#ffd23f', '#ff5fa2', '#38e1ff'];
  const PALETTE = {
    svgDiagramLinkDraw: S1, svgDiagramFanOut: S2, svgDiagramFanIn: S3, svgDiagramSelfLoop: S4, svgDiagramBoxChain: S5,
    svgDiagramGroupFrame: S6, svgDiagramDualFlow: S1, svgDiagramStepBadge: S2,
    svgDiagramTree: S3, svgDiagramRadialHub: S4, svgDiagramMatrix: S5, svgDiagramVenn: S1,
    svgDiagramDecision: S2, svgDiagramSwimlane: S3, svgDiagramSequence: S4, svgDiagramTimeline: S5,
    svgDiagramCycle: S1, svgDiagramStateMachine: S2, svgDiagramEventBus: S3, svgDiagramFunnel: S4
  };
  const define = (pattern, html, tracks, metadata = {}) => {
    const pal = PALETTE[pattern] || S1;
    const styled = html.replace('class="mb-scene diagram-motion"', `class="mb-scene diagram-motion" style="--c1:${pal[0]};--c2:${pal[1]};--c3:${pal[2]}"`);
    demos[pattern] = { html: styled, tracks, duration: 1000, easing: 'easeOutCubic', reducedProgress: 1, ...metadata };
  };
  const LIN = 'cubic-bezier(0,0,1,1)'; // non-'linear' string keeps the authored timeline (runtime would reshape plain linear)
  const OVERSHOOT = 'cubic-bezier(.2,1.3,.4,1)';
  const track = (selector, keyframes) => ({ selector, keyframes });
  const r2 = n => Math.round(n * 100) / 100;

  // [from -> to] between offsets s..e, held outside.
  const span = (prop, from, to, s, e, easing = LIN) => [
    { [prop]: from, offset: 0 }, { [prop]: from, offset: s, easing }, { [prop]: to, offset: e }, { [prop]: to, offset: 1 }
  ];
  const spanMulti = (from, to, s, e, easing = LIN) => [
    { ...from, offset: 0 }, { ...from, offset: s, easing }, { ...to, offset: e }, { ...to, offset: 1 }
  ];

  const svg = (content, caption) => `<div class="mb-scene diagram-motion"><svg class="mb-svg dm-svg" viewBox="0 0 220 120" aria-hidden="true">${content}</svg><span class="mb-caption">${caption}</span></div>`;
  const box = (cls, x, y, w, h, rx = 3) => `<rect class="dm-box ${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/>`;
  const line = (cls, d) => `<path class="dm-line ${cls}" d="${d}" pathLength="1"/>`;
  // Arrowhead pointing along (dx,dy) with its tip at (tx,ty): length 6, half-width 3.5.
  const arrow = (cls, tx, ty, dx, dy) => {
    const n = Math.hypot(dx, dy), ux = dx / n, uy = dy / n, bx = tx - ux * 6, by = ty - uy * 6;
    const p = [[tx, ty], [bx - uy * 3.5, by + ux * 3.5], [bx + uy * 3.5, by - ux * 3.5]];
    return `<polygon class="dm-arrow ${cls}" data-arrow points="${p.map(([x, y]) => `${r2(x)},${r2(y)}`).join(' ')}"/>`;
  };

  // #1 straight link: path 69 -> 145 (box B at 156: end 11 ahead), tip 151 (5 ahead).
  define('svgDiagramLinkDraw', svg(
    box('', 14, 40, 50, 40) + box('', 156, 40, 50, 40) +
    line('dm-l1', 'M69 60 H145') + arrow('dm-a1', 151, 60, 1, 0), 'DRAW → CLOSE'), [
    track('.dm-l1', span('strokeDashoffset', 1, 0, 0, .8)),
    track('.dm-a1', spanMulti({ transform: 'translateX(-6px)', opacity: 0 }, { transform: 'translateX(0px)', opacity: 1 }, .8, 1))
  ], {
    duration: 1000, easing: 'easeOutCubic',
    focus: '연결선이 출발 쪽에서 끝까지 그어진 뒤 화살촉이 수평으로 밀려 들어와 닫힌다.',
    focusEn: 'The link is drawn from its start, then the arrowhead slides in horizontally to close it.',
    recipe: '직선 연결선 pathLength=1, stroke-dasharray 1, stroke-dashoffset 1→0 (800ms, 출발 쪽에서 그어짐). 화살촉 polygon translateX −6→0 + opacity 0→1 (800ms 뒤 200ms)'
  });

  // #2 fan-out: hub circle (28,60) r9 -> three boxes at x=160; curves start 5 off the hub, end 11 off the boxes.
  const fan = [22, 60, 98].map(y => `M42 60 C95 60 100 ${y} 149 ${y}`);
  const fanDraw = [[0, .545], [.136, .68], [.273, .818]];
  define('svgDiagramFanOut', svg(
    `<circle class="dm-node" cx="28" cy="60" r="9"/>` + [22, 60, 98].map(y => box('', 160, y - 11, 46, 22)).join('') +
    fan.map((d, i) => line(`dm-f${i}`, d)).join('') + [22, 60, 98].map((y, i) => arrow(`dm-fa${i}`, 155, y, 1, 0)).join(''), 'BRANCH IN TURN'),
  [...fan.map((_, i) => track(`.dm-f${i}`, span('strokeDashoffset', 1, 0, fanDraw[i][0], fanDraw[i][1]))),
   ...fan.map((_, i) => track(`.dm-fa${i}`, span('opacity', 0, 1, fanDraw[i][1], fanDraw[i][1] + .1)))], {
    duration: 1100, easing: 'easeOutCubic',
    focus: '허브에서 갈라지는 곡선 세 개가 시차를 두고 차례로 그려지고, 각 끝에서 화살촉이 켜진다.',
    focusEn: 'Three curves branching from the hub are drawn in turn, and each arrowhead appears at its end.',
    recipe: '허브에서 갈라지는 곡선 3개를 pathLength 드로잉(dashoffset 1→0), 시작 시차 0 / 150 / 300ms. 화살촉 opacity 를 각 곡선 끝 직후에 맞춤'
  });

  // #3 fan-in: three pills (x 12..58) merge into circle (150,60) r9; curves end 11 off the circle.
  const merge = [22, 60, 98].map(y => `M63 ${y} C100 ${y} 95 60 130 60`);
  const thick = [[0, .7], [.1, .8], [.2, .9]];
  define('svgDiagramFanIn', svg(
    [22, 60, 98].map(y => box('', 12, y - 10, 46, 20, 10)).join('') + `<circle class="dm-node" cx="150" cy="60" r="9"/>` +
    merge.map((d, i) => line(`dm-m${i}`, d)).join('') + [0, 1, 2].map(i => arrow(`dm-ma${i}`, 136, 60, 1, 0)).join(''), 'MERGE · THICKEN'),
  [...merge.map((_, i) => track(`.dm-m${i}`, span('strokeWidth', .5, 1.5, thick[i][0], thick[i][1]))),
   track('.dm-ma0, .dm-ma1, .dm-ma2', span('opacity', 0, 1, .9, 1))], {
    duration: 1000, easing: 'easeInOutCubic',
    focus: '입력 연결선 세 개가 시차를 두고 가늘게 시작해 굵어지며 한 점으로 합쳐진다.',
    focusEn: 'Three input links thicken from hairline to full weight in turn as they merge into one node.',
    recipe: '입력 연결선 3개 stroke-width 0.5→1.5 (700ms, 시차 0/100/200ms), 합류 후 화살촉 opacity 0→1'
  });

  // #4 self loop: header box, segmented lifeline, activation bar 96..104; loop starts 5 off, ends 11 off, tip 5 off.
  define('svgDiagramSelfLoop', svg(
    box('', 80, 8, 40, 20) + `<path class="dm-life" d="M100 28 V40 M100 92 V106"/>` +
    `<rect class="dm-act" x="96" y="40" width="8" height="52" rx="1"/>` +
    line('dm-loop', 'M109 52 C150 52 150 80 115 80') + arrow('dm-la', 109, 80, -1, 0), 'ACTIVATE · RETURN'), [
    track('.dm-act', spanMulti({ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }, 0, .556)),
    track('.dm-loop', span('opacity', 0, 1, .556, .9)),
    track('.dm-la', span('opacity', 0, 1, .7, 1))
  ], {
    duration: 900, easing: 'easeOutCubic',
    focus: '활성 막대가 위에서 아래로 자란 뒤, 자기 자신으로 되돌아오는 곡선과 화살촉이 나타난다.',
    focusEn: 'The activation bar grows downward, then the self-return curve and its arrowhead appear.',
    recipe: '활성 막대 scaleY 0→1 (origin 상단, 500ms), 되돌림 곡선 opacity 0→1 (500ms 지연) + polygon 화살촉'
  });

  // #5 drop chain: boxes at x 12/88/164 (w44); connectors 61→77 + tip 83, 137→153 + tip 159.
  const dropAt = [[0, .25], [.15, .4], [.3, .55]];
  define('svgDiagramBoxChain', svg(
    [12, 88, 164].map((x, i) => box(`dm-c${i}`, x, 42, 44, 36)).join('') +
    `<g class="dm-cc0">${line('', 'M61 60 H77')}${arrow('', 83, 60, 1, 0)}</g>` +
    `<g class="dm-cc1">${line('', 'M137 60 H153')}${arrow('', 159, 60, 1, 0)}</g>`, 'DROP · CHAIN'),
  [...[0, 1, 2].map(i => ({ ...track(`.dm-c${i}`, [
    { transform: 'translateY(-24px)', opacity: 0, offset: 0 }, { transform: 'translateY(-24px)', opacity: 0, offset: dropAt[i][0], easing: OVERSHOOT },
    { transform: 'translateY(0px)', opacity: 1, offset: dropAt[i][1] }, { transform: 'translateY(0px)', opacity: 1, offset: 1 }]), easing: LIN })),
   { ...track('.dm-cc0', span('opacity', 0, 1, .4, .57)), easing: LIN }, { ...track('.dm-cc1', span('opacity', 0, 1, .55, .72)), easing: LIN }], {
    // 트랙별 easing LIN: 오프셋이 실시간 시간표(1200ms 기준)이므로 easeOutCubic 이 전체 타임라인을 앞당겨 시차를 압축하지 않게 한다. 메타 easing 은 표 값 유지.
    duration: 1200, easing: 'easeOutCubic',
    focus: '상자가 위에서 하나씩 떨어져 살짝 튀어 자리 잡고, 상자 사이 연결선이 바로 뒤따라 나타난다.',
    focusEn: 'Boxes drop in one by one with a slight overshoot, and the link between them fades in right after.',
    recipe: '상자 translateY −24→0 (cubic-bezier .2 1.3 .4 1, 300ms, 간격 180ms), 연결선 opacity 0→1 (상자 직후) + polygon 화살촉'
  });

  // #6 group frame: dashed group tint + inner boxes; no connector.
  define('svgDiagramGroupFrame', svg(
    `<rect class="dm-group" x="20" y="16" width="180" height="76" rx="6"/>` + box('dm-g0', 40, 39, 62, 30) + box('dm-g1', 118, 39, 62, 30), 'GROUP · TINT'), [
    track('.dm-group', spanMulti({ fillOpacity: 0, stroke: '#5d7189' }, { fillOpacity: .18, stroke: S6[0] }, 0, .6)),
    track('.dm-g0', span('opacity', 0, 1, .5, .7)), track('.dm-g1', span('opacity', 0, 1, .65, .85))
  ], {
    duration: 1000, easing: 'easeInOutCubic',
    focus: '점선 묶음 테두리가 색과 채움으로 먼저 자리 잡고, 안쪽 상자가 차례로 나타난다.',
    focusEn: 'The dashed group border settles in with color and fill first, then the inner boxes appear in turn.',
    recipe: '점선 묶음 fill-opacity 0→1 + stroke ink-3→brand (600ms), 안 상자 opacity 0→1 (150ms 간격)'
  });

  // #7 dual flow: request right (tip 155), response left (tip 65); polygon opacity crossfade.
  define('svgDiagramDualFlow', svg(
    box('', 14, 32, 46, 56) + box('', 160, 32, 46, 56) +
    line('dm-q', 'M65 46 C100 20 110 46 149 46') + arrow('dm-qa', 155, 46, 1, 0) +
    line('dm-p', 'M155 74 C120 100 110 74 71 74') + arrow('dm-pa', 65, 74, -1, 0), 'REQUEST ⇄ RESPONSE'), [
    track('.dm-qa', span('opacity', 1, 0, 0, .45)), track('.dm-pa', span('opacity', 0, 1, .45, 1))
  ], {
    duration: 1100, easing: 'easeInOutCubic',
    focus: '평행한 두 곡선 중 요청 쪽 화살촉이 꺼지고, 반대 끝의 응답 화살촉이 켜지며 방향이 교대된다.',
    focusEn: 'On two parallel curves the request arrowhead fades out while the response arrowhead at the other end fades in.',
    recipe: '평행 곡선 2개의 polygon 화살촉 opacity 교차: 요청 1→0 (0–500ms), 응답 0→1 (500–1100ms, 반대 끝)'
  });

  // #8 step badges: circles at x 34/110/186 (r14); connectors 53→85 + tip 91 and 129→161 + tip 167. Number fades in (never mirrored).
  const badgeAt = [[0, .28], [.38, .66], [.74, 1]];
  define('svgDiagramStepBadge', svg(
    [34, 110, 186].map((cx, i) => `<circle class="dm-badge dm-b${i}" cx="${cx}" cy="56" r="14"/>`).join('') +
    [34, 110, 186].map((cx, i) => `<text class="dm-num dm-n${i}" x="${cx}" y="60.5" text-anchor="middle">${i + 1}</text>`).join('') +
    `<g class="dm-bc0">${line('', 'M53 56 H85')}${arrow('', 91, 56, 1, 0)}</g>` +
    `<g class="dm-bc1">${line('', 'M129 56 H161')}${arrow('', 167, 56, 1, 0)}</g>`, 'FLIP · NUMBER'),
  [...[0, 1, 2].map(i => track(`.dm-b${i}`, [
    { transform: 'rotateY(0deg)', opacity: 0, offset: 0 }, { transform: 'rotateY(0deg)', opacity: 0, offset: badgeAt[i][0], easing: LIN },
    { transform: 'rotateY(180deg)', opacity: 1, offset: badgeAt[i][1] }, { transform: 'rotateY(180deg)', opacity: 1, offset: 1 }])),
   ...[0, 1, 2].map(i => track(`.dm-n${i}`, span('opacity', 0, 1, (badgeAt[i][0] + badgeAt[i][1]) / 2, badgeAt[i][1]))),
   track('.dm-bc0', spanMulti({ transform: 'translateX(-16px)', opacity: 0 }, { transform: 'translateX(0px)', opacity: 1 }, .28, .44)),
   track('.dm-bc1', spanMulti({ transform: 'translateX(-16px)', opacity: 0 }, { transform: 'translateX(0px)', opacity: 1 }, .66, .82))], {
    duration: 1000, easing: 'easeOutCubic',
    focus: '원형 배지가 뒤집히며 나타나고 숫자는 정상 방향으로 서서히 켜지며, 다음 연결선이 배지 뒤에서 이어진다.',
    focusEn: 'Round badges flip into view while the number fades in upright, and the next link follows each badge.',
    recipe: '원형 배지 rotateY 0→180 (360ms, 간격 200ms; 숫자는 opacity 교차로 거울상 방지), 연결선 translateX −16→0 (배지 직후) + polygon 화살촉'
  });
  /* ===== 다이어그램 형태 12종 (#9–#20) — 3개 그룹 × 4 (효과가 아니라 "도식의 위상")
   * [A 계층·구조] #9 Tree · #10 RadialHub · #11 Matrix · #12 Venn
   * [B 흐름·절차] #13 Decision · #14 Swimlane · #15 Sequence · #16 Timeline
   * [C 순환·전이·집약] #17 Cycle · #18 StateMachine · #19 EventBus · #20 Funnel
   * 화살촉 polygon: Tree 6 · RadialHub 6 · Decision 2 · Swimlane 2 · Sequence 3 · Cycle 4 · StateMachine 3 · EventBus 6 → 확장분 32, 전체 합계 46.
   * (Matrix·Venn·Timeline·Funnel 은 화살촉 없음.) 기하 규칙은 #1–#8 과 동일: 시작 5px, 경로 끝 11px, 화살촉 끝 5px, 선 굵기 <= 1.5.
   */
  const polar = (cx, cy, R, a) => [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  const P = (pt) => `${r2(pt[0])} ${r2(pt[1])}`;
  const circ = (cls, cx, cy, r) => `<circle class="dm-node ${cls}" cx="${cx}" cy="${cy}" r="${r}"/>`;
  const poly = (cls, pts) => `<polygon class="dm-box ${cls}" points="${pts}"/>`;
  const label = (x, y, t) => `<text class="dm-lab" x="${x}" y="${y}" text-anchor="middle">${t}</text>`;
  const bars = (x, y, w) => `<rect class="dm-bar" x="${x}" y="${y}" width="${w}" height="3" rx="1.5"/>`;
  const fade = (sel, s0, e0) => track(sel, span('opacity', 0, 1, s0, e0));
  const draw = (sel, s0, e0) => track(sel, span('strokeDashoffset', 1, 0, s0, e0));

  // ===== A 계층·구조 =====
  // #9 tree: 루트 → 2 → 4, 깊이별로 직교 연결선이 차례로 내려간다.
  const TR = { ch: [[28, 48], [132, 48]], lf: [[20, 96], [60, 96], [124, 96], [164, 96]] };
  const l1 = ['M110 29 V33 H58 V37', 'M110 29 V33 H162 V37'];
  const l2 = ['M58 71 V78 H38 V85', 'M58 71 V78 H78 V85', 'M162 71 V78 H142 V85', 'M162 71 V78 H182 V85'];
  const l2x = [38, 78, 142, 182];
  define('svgDiagramTree', svg(
    '<g transform="translate(11 2) scale(.9)">' + box('dm-t0', 80, 6, 60, 18) + TR.ch.map(([x, y], i) => box('dm-t1', x, y, 60, 18)).join('') + TR.lf.map(([x, y]) => box('dm-t2', x, y, 36, 18)).join('') +
    l1.map((d, i) => line('dm-tl1', d)).join('') + [58, 162].map(x => arrow('dm-ta1', x, 43, 0, 1)).join('') +
    l2.map(d => line('dm-tl2', d)).join('') + l2x.map(x => arrow('dm-ta2', x, 91, 0, 1)).join('') + '</g>', 'TREE · BY LEVEL'), [
    fade('.dm-t0', 0, .1), draw('.dm-tl1', .1, .38), fade('.dm-ta1', .38, .46), fade('.dm-t1', .34, .5),
    draw('.dm-tl2', .5, .8), fade('.dm-ta2', .8, .88), fade('.dm-t2', .76, .92)
  ], {
    duration: 1400, easing: 'easeOutCubic',
    focus: '루트에서 아래로 직교 연결선이 깊이별로 차례로 그려지고 각 단계의 노드가 뒤따라 나타난다.',
    focusEn: 'Orthogonal links are drawn level by level from the root, each level of nodes appearing right behind them.',
    recipe: '깊이 1·2 직교 연결선 pathLength dashoffset 1→0 (280ms·300ms, 깊이 사이 시차), 노드 opacity 0→1, 화살촉은 선 직후'
  });

  // #10 radial hub: 중심에서 6방향으로 시계 방향 순서로 뻗는다.
  const HUB = { cx: 110, cy: 60, R: 44 };
  const spokeA = [0, 1, 2, 3, 4, 5].map(k => -Math.PI / 2 + k * Math.PI / 3);
  define('svgDiagramRadialHub', svg(
    circ('dm-hubc', 110, 60, 10) +
    spokeA.map((a, k) => line(`dm-sp${k}`, `M${P(polar(110, 60, 15, a))} L${P(polar(110, 60, 26, a))}`)).join('') +
    spokeA.map((a, k) => arrow(`dm-spa${k}`, ...polar(110, 60, 32, a), Math.cos(a), Math.sin(a))).join('') +
    spokeA.map((a, k) => circ(`dm-spn${k}`, ...polar(110, 60, 44, a).map(r2), 7)).join(''), 'HUB · RADIAL'),
  [fade('.dm-hubc', 0, .08), ...spokeA.map((_, k) => draw(`.dm-sp${k}`, .08 + k * .1, .22 + k * .1)),
   ...spokeA.map((_, k) => fade(`.dm-spa${k}`, .22 + k * .1, .3 + k * .1)),
   ...spokeA.map((_, k) => fade(`.dm-spn${k}`, .26 + k * .1, .38 + k * .1))], {
    duration: 1300, easing: 'easeOutCubic',
    focus: '중심 노드에서 여섯 방향 연결선이 시계 방향으로 차례로 뻗고 끝마다 노드가 켜진다.',
    focusEn: 'Six links extend from the hub clockwise in turn and a node lights up at the end of each.',
    recipe: '허브 opacity 0→1, 방사 연결선 6개 dashoffset 1→0 (시작 간격 100ms, 방향은 시계), 끝 노드 opacity 0→1'
  });

  // #11 matrix: 3×3 셀이 대각선 물결로 채워지고 중앙 셀이 확정된다.
  const MX = [0, 1, 2].flatMap(r => [0, 1, 2].map(c => [r, c, 44 + c * 46, 18 + r * 30]));
  define('svgDiagramMatrix', svg(MX.map(([r, c, x, y]) => box(`dm-x${r}${c}`, x, y, 40, 24, 3)).join(''), 'MATRIX · WAVE'),
  MX.map(([r, c]) => {
    const d = (r + c) * .1;
    if (r === 1 && c === 1) return track('.dm-x11', [{ opacity: .2, fillOpacity: .06, offset: 0 }, { opacity: .2, fillOpacity: .06, offset: d, easing: LIN },
      { opacity: 1, fillOpacity: .4, offset: d + .25, easing: LIN }, { opacity: 1, fillOpacity: .4, offset: .78, easing: LIN }, { opacity: 1, fillOpacity: .8, offset: 1 }]);
    return track(`.dm-x${r}${c}`, spanMulti({ opacity: .2, fillOpacity: .06 }, { opacity: 1, fillOpacity: .4 }, d, d + .25));
  }), {
    duration: 1200, easing: 'easeInOutCubic',
    focus: '3×3 격자의 셀이 좌상단에서 우하단으로 대각선 물결을 그리며 채워지고 중앙 셀이 마지막에 강조된다.',
    focusEn: 'Cells of a 3×3 grid fill in a diagonal wave from top-left to bottom-right, ending with the centre cell emphasised.',
    recipe: '셀 9개 opacity .2→1 + fill 어두움→채움 (시작 시차 (행+열)×100ms, 250ms), 중앙 셀 마지막에 stroke brand'
  });

  // #12 venn: 원 3개가 차례로 커지며 겹치고 교집합이 켜진다.
  define('svgDiagramVenn', svg(
    `<defs><clipPath id="dm-vcA"><circle cx="88" cy="46" r="30"/></clipPath><clipPath id="dm-vcB"><circle cx="132" cy="46" r="30"/></clipPath></defs>` +
    `<circle class="dm-venn dm-va" cx="88" cy="46" r="30"/><circle class="dm-venn dm-vb" cx="132" cy="46" r="30"/><circle class="dm-venn dm-vc" cx="110" cy="82" r="30"/>` +
    `<g clip-path="url(#dm-vcA)"><g clip-path="url(#dm-vcB)"><circle class="dm-vi" cx="110" cy="82" r="30"/></g></g>`, 'VENN · OVERLAP'), [
    ...['a', 'b', 'c'].map((k, i) => track(`.dm-v${k}`, spanMulti({ transform: 'scale(.4)', fillOpacity: 0, strokeOpacity: 0 }, { transform: 'scale(1)', fillOpacity: .16, strokeOpacity: 1 }, i * .15, i * .15 + .3))),
    track('.dm-vi', span('opacity', 0, .6, .68, .92))
  ], {
    duration: 1200, easing: 'easeOutCubic',
    focus: '원 세 개가 시차를 두고 커지며 겹치고, 세 영역이 모두 겹친 교집합이 마지막에 켜진다.',
    focusEn: 'Three circles grow in turn and overlap, and the region where all three meet lights up last.',
    recipe: '원 3개 scale .4→1 + fill-opacity 0→.16 (시차 0/180/360ms, 360ms), 교집합 = 이중 clipPath 안의 원 opacity 0→.6'
  });

  // ===== B 흐름·절차 =====
  // #13 decision: 판단 마름모에서 예/아니오 두 갈래, 선택되지 않은 쪽은 흐려진다.
  define('svgDiagramDecision', svg(
    `<polygon class="dm-box dm-dc" points="60,36 84,60 60,84 36,60"/>` + box('dm-db', 156, 28, 50, 22) + `<g class="dm-no">${box('', 156, 70, 50, 22)}${line('dm-dn', 'M89 60 H110 V81 H145')}${arrow('dm-dna', 151, 81, 1, 0)}</g>` +
    line('dm-dy', 'M89 60 H110 V39 H145') + arrow('dm-dya', 151, 39, 1, 0) + label(116, 32, 'Y') + label(116, 96, 'N'), 'DECISION · BRANCH'), [
    track('.dm-dc', spanMulti({ transform: 'scale(.6)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }, 0, .2)),
    draw('.dm-dy, .dm-dn', .2, .5), fade('.dm-dya, .dm-dna', .5, .58), fade('.dm-db', .44, .6), fade('.dm-lab', .3, .45),
    track('.dm-no', span('opacity', 1, .28, .68, .9))
  ], {
    duration: 1200, easing: 'easeOutCubic',
    focus: '판단 마름모에서 예·아니오 두 갈래가 동시에 그어지고, 선택되지 않은 갈래가 흐려져 경로가 정해진다.',
    focusEn: 'Yes and No branches are drawn from the decision diamond together, then the unchosen one dims to settle the path.',
    recipe: '마름모 scale .6→1 + opacity, 두 갈래 직교선 dashoffset 1→0 (300ms), 라벨 Y/N opacity, 미선택 갈래 그룹 opacity 1→.28 (680–900ms)'
  });

  // #14 swimlane: 두 레인 띠가 깔린 뒤 단계가 레인을 오가며 이어진다.
  define('svgDiagramSwimlane', svg(
    `<rect class="dm-lane dm-ln0" x="8" y="12" width="204" height="44" rx="4"/><rect class="dm-lane dm-ln1" x="8" y="64" width="204" height="44" rx="4"/>` +
    box('dm-sa', 20, 24, 44, 20) + box('dm-sb', 88, 76, 44, 20) + box('dm-sc', 156, 24, 44, 20) +
    line('dm-sl1', 'M69 34 H110 V65') + arrow('dm-sa1', 110, 71, 0, 1) + line('dm-sl2', 'M137 86 H178 V55') + arrow('dm-sa2', 178, 49, 0, -1), 'SWIMLANE · HANDOFF'), [
    track('.dm-ln0', spanMulti({ transform: 'scaleX(0)', opacity: 0 }, { transform: 'scaleX(1)', opacity: 1 }, 0, .3)),
    track('.dm-ln1', spanMulti({ transform: 'scaleX(0)', opacity: 0 }, { transform: 'scaleX(1)', opacity: 1 }, .08, .38)),
    fade('.dm-sa', .3, .4), draw('.dm-sl1', .4, .56), fade('.dm-sa1', .56, .62), fade('.dm-sb', .58, .7),
    draw('.dm-sl2', .7, .86), fade('.dm-sa2', .86, .92), fade('.dm-sc', .84, .96)
  ], {
    duration: 1400, easing: 'easeOutCubic',
    focus: '레인 띠가 왼쪽에서 펼쳐진 뒤 단계가 레인 사이를 오가며 인계 연결선으로 이어진다.',
    focusEn: 'Lane bands unfold from the left, then steps hand off across the lanes with elbow links.',
    recipe: '레인 띠 scaleX 0→1 (origin 왼쪽, 300ms, 시차 80ms), 단계 opacity + 레인 가로지르는 직교 연결선 dashoffset 1→0 + 화살촉'
  });

  // #15 sequence: 참여자 3, 생명선이 자란 뒤 메시지가 순서대로, 마지막은 점선 응답.
  define('svgDiagramSequence', svg(
    [36, 110, 184].map((cx, i) => box(`dm-qh${i}`, cx - 22, 6, 44, 16, 3)).join('') +
    [36, 110, 184].map((cx, i) => `<path class="dm-life dm-grow dm-qg${i}" d="M${cx} 22 V112"/>`).join('') +
    line('dm-qm1', 'M41 44 H99') + arrow('dm-qa1', 105, 44, 1, 0) + line('dm-qm2', 'M115 62 H173') + arrow('dm-qa2', 179, 62, 1, 0) +
    `<g class="dm-qr"><path class="dm-ret" d="M179 82 H47"/>${arrow('', 41, 82, -1, 0)}</g>`, 'SEQUENCE · MESSAGES'), [
    fade('.dm-qh0, .dm-qh1, .dm-qh2', 0, .1),
    track('.dm-qg0, .dm-qg1, .dm-qg2', spanMulti({ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }, .05, .3)),
    draw('.dm-qm1', .3, .45), fade('.dm-qa1', .45, .5), draw('.dm-qm2', .5, .65), fade('.dm-qa2', .65, .7),
    track('.dm-qr', spanMulti({ transform: 'translateX(12px)', opacity: 0 }, { transform: 'translateX(0px)', opacity: 1 }, .76, .95))
  ], {
    duration: 1400, easing: 'easeOutCubic',
    focus: '참여자 생명선이 자란 뒤 요청 메시지가 위에서 아래 순서로 그어지고, 응답은 점선으로 되돌아온다.',
    focusEn: 'Participant lifelines grow, request messages are drawn top to bottom, and the reply returns as a dashed line.',
    recipe: '생명선 scaleY 0→1 (origin 상단), 메시지 1·2 dashoffset 1→0 (150ms, 순서), 점선 응답 translateX 12→0 + opacity'
  });

  // #16 timeline: 축이 그어지고 마일스톤 점·줄기·라벨이 위아래로 번갈아 나타난다.
  const msX = [34, 84, 134, 184], axT = x => (x - 14) / 192 * .5;
  define('svgDiagramTimeline', svg(
    line('dm-ax', 'M14 60 H206') + msX.map((x, i) => (i % 2 === 0
      ? line(`dm-ms${i}s`, `M${x} 50 V30`) + box(`dm-ms${i}b`, x - 20, 8, 40, 18, 3)
      : line(`dm-ms${i}s`, `M${x} 70 V90`) + box(`dm-ms${i}b`, x - 20, 94, 40, 18, 3))).join('') +
    msX.map((x, i) => `<circle class="dm-node dm-pop dm-ms${i}d" cx="${x}" cy="60" r="5"/>`).join(''), 'TIMELINE · MILESTONES'), [
    draw('.dm-ax', 0, .5),
    ...msX.flatMap((x, i) => { const t = axT(x), up = i % 2 === 0; return [
      track(`.dm-ms${i}d`, spanMulti({ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }, t, t + .08)),
      draw(`.dm-ms${i}s`, t + .06, t + .18),
      track(`.dm-ms${i}b`, spanMulti({ transform: `translateY(${up ? 6 : -6}px)`, opacity: 0 }, { transform: 'translateY(0px)', opacity: 1 }, t + .14, t + .28))]; })
  ], {
    duration: 1400, easing: 'easeOutCubic',
    focus: '시간 축이 그어지는 동안 마일스톤 점이 터지고 줄기와 라벨이 위아래로 번갈아 자리 잡는다.',
    focusEn: 'As the time axis is drawn, milestone dots pop in and stems and labels settle alternately above and below.',
    recipe: '축 dashoffset 1→0 (700ms), 점 scale 0→1 (축 도달 시점), 줄기 dashoffset, 라벨 translateY ±6→0 + opacity (위/아래 교대)'
  });

  // ===== C 순환·전이·집약 =====
  // #17 cycle: 노드 4개를 호 4개가 시계 방향으로 잇고 마지막 호가 고리를 닫는다.
  const CYn = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
  const arcD = k => `M${P(polar(110, 60, 40, CYn[k] + .35))} A40 40 0 0 1 ${P(polar(110, 60, 40, CYn[k] + Math.PI / 2 - .5))}`;
  const tipA = k => CYn[k] + Math.PI / 2 - .35;
  define('svgDiagramCycle', svg(
    CYn.map((a, k) => circ(`dm-cn${k}`, ...polar(110, 60, 40, a).map(r2), 9)).join('') +
    CYn.map((_, k) => line(`dm-ca${k}`, arcD(k))).join('') +
    CYn.map((_, k) => arrow(`dm-cb${k}`, ...polar(110, 60, 40, tipA(k)), -Math.sin(tipA(k)), Math.cos(tipA(k)))).join(''), 'CYCLE · CLOSE THE LOOP'),
  [fade('.dm-cn0', 0, .08), ...CYn.map((_, k) => draw(`.dm-ca${k}`, .08 + k * .22, .26 + k * .22)),
   ...CYn.map((_, k) => fade(`.dm-cb${k}`, .26 + k * .22, .32 + k * .22)),
   ...[1, 2, 3].map(k => fade(`.dm-cn${k}`, .2 + (k - 1) * .22, .3 + (k - 1) * .22))], {
    duration: 1400, easing: 'easeInOutCubic',
    focus: '노드 사이를 호가 시계 방향으로 차례로 이어 가고, 마지막 호가 첫 노드로 돌아와 고리를 닫는다.',
    focusEn: 'Arcs join the nodes clockwise in turn, and the last arc returns to the first node to close the loop.',
    recipe: '4노드 원형 배치, 호 4개 dashoffset 1→0 (시계 방향, 시작 간격 310ms), 호 끝 화살촉은 접선 방향, 마지막 호가 첫 노드로 복귀'
  });

  // #18 state machine: 상태 3개와 전이, 활성 상태가 옮겨 다닌다.
  const lit = (a, b, c, d) => [{ fillOpacity: .1, offset: 0 }, { fillOpacity: .1, offset: a, easing: LIN }, { fillOpacity: .65, offset: b, easing: LIN }, { fillOpacity: .65, offset: c, easing: LIN }, { fillOpacity: .1, offset: d }, { fillOpacity: .1, offset: 1 }];
  define('svgDiagramStateMachine', svg(
    box('dm-st0', 14, 48, 48, 24, 12) + box('dm-st1', 86, 14, 48, 24, 12) + box('dm-st2', 158, 48, 48, 24, 12) +
    line('dm-mt1', 'M42 43 Q50 26 75 26') + arrow('dm-ma1', 81, 26, 1, 0) + line('dm-mt2', 'M139 26 Q182 26 182 37') + arrow('dm-ma2', 182, 43, 0, 1) +
    line('dm-mt3', 'M182 77 Q182 100 150 100 H70 Q38 100 38 83') + arrow('dm-ma3', 38, 77, 0, -1), 'STATE · TRANSITION'), [
    fade('.dm-st0, .dm-st1, .dm-st2', 0, .12),
    draw('.dm-mt1', .14, .32), fade('.dm-ma1', .32, .38), draw('.dm-mt2', .4, .56), fade('.dm-ma2', .56, .62), draw('.dm-mt3', .64, .86), fade('.dm-ma3', .86, .92),
    track('.dm-st0', [{ fillOpacity: .1, offset: 0 }, { fillOpacity: .65, offset: .1 }, { fillOpacity: .65, offset: .3 }, { fillOpacity: .1, offset: .4 }, { fillOpacity: .1, offset: .86 }, { fillOpacity: .65, offset: .95 }, { fillOpacity: .65, offset: 1 }]),
    track('.dm-st1', lit(.34, .42, .56, .64)), track('.dm-st2', lit(.58, .66, .8, .88))
  ], {
    duration: 1500, easing: 'easeInOutCubic',
    focus: '상태 세 개가 놓이고 전이 곡선이 차례로 그어지는 동안 활성 상태 채움이 따라 옮겨 가 마지막에 처음으로 돌아온다.',
    focusEn: 'As three states and their transition curves are drawn in turn, the active fill follows and finally returns to the first state.',
    recipe: '상태 3개 opacity, 전이 곡선 3개 dashoffset 1→0 (시퀀스 순), 상태 fill 어두움↔채움 교대(활성 이동), 마지막 상태 복귀'
  });

  // #19 event bus: 버스 막대가 펼쳐진 뒤 발행자 → 버스 → 구독자 순으로 연결된다.
  const BX = [50, 110, 170];
  define('svgDiagramEventBus', svg(
    '<g transform="translate(11 2) scale(.9)">' + BX.map((cx, i) => box(`dm-bp${i}`, cx - 22, 6, 44, 18)).join('') + `<rect class="dm-bus" x="20" y="57" width="180" height="6" rx="3"/>` +
    BX.map(cx => line('dm-bu', `M${cx} 29 V46`)).join('') + BX.map(cx => arrow('dm-bua', cx, 52, 0, 1)).join('') +
    BX.map(cx => line('dm-bd', `M${cx} 68 V85`)).join('') + BX.map(cx => arrow('dm-bda', cx, 91, 0, 1)).join('') +
    BX.map((cx, i) => box(`dm-bs${i}`, cx - 22, 96, 44, 18)).join('') + '</g>', 'BUS · PUBLISH → SUBSCRIBE'), [
    track('.dm-bus', spanMulti({ transform: 'scaleX(0)', opacity: 0 }, { transform: 'scaleX(1)', opacity: 1 }, 0, .25)),
    fade('.dm-bp0, .dm-bp1, .dm-bp2', .2, .34), draw('.dm-bu', .32, .5), fade('.dm-bua', .5, .56),
    draw('.dm-bd', .56, .74), fade('.dm-bda', .74, .8), fade('.dm-bs0, .dm-bs1, .dm-bs2', .72, .88)
  ], {
    duration: 1300, easing: 'easeOutCubic',
    focus: '버스 막대가 가운데서 양쪽으로 펼쳐진 뒤 발행자가 버스로, 버스에서 구독자로 연결선이 차례로 이어진다.',
    focusEn: 'The bus bar unfolds from the centre, then links run from publishers to the bus and from the bus to subscribers.',
    recipe: '버스 scaleX 0→1 (origin 중심), 발행자→버스 연결선 3개 dashoffset 1→0, 버스→구독자 3개 dashoffset, 각 단계 화살촉 + 노드 opacity'
  });

  // #20 funnel: 단계가 위에서 아래로 좁아지며 쌓이고 마지막 단계가 확정된다.
  define('svgDiagramFunnel', svg(
    poly('dm-fn0', '20,10 200,10 175,38 45,38') + poly('dm-fn1', '45,42 175,42 150,70 70,70') + poly('dm-fn2', '70,74 150,74 130,102 90,102'), 'FUNNEL · NARROW'), [
    track('.dm-fn0', spanMulti({ transform: 'scaleX(.2)', opacity: 0 }, { transform: 'scaleX(1)', opacity: 1 }, 0, .35)),
    track('.dm-fn1', spanMulti({ transform: 'scaleX(.2)', opacity: 0 }, { transform: 'scaleX(1)', opacity: 1 }, .22, .57)),
    track('.dm-fn2', [{ transform: 'scaleX(.2)', opacity: 0, fillOpacity: .25, offset: 0 }, { transform: 'scaleX(.2)', opacity: 0, fillOpacity: .25, offset: .44, easing: LIN },
      { transform: 'scaleX(1)', opacity: 1, fillOpacity: .25, offset: .79, easing: LIN }, { transform: 'scaleX(1)', opacity: 1, fillOpacity: .7, offset: .98 }, { transform: 'scaleX(1)', opacity: 1, fillOpacity: .7, offset: 1 }])
  ], {
    duration: 1200, easing: 'easeOutCubic',
    focus: '넓은 단계에서 좁은 단계로 사다리꼴이 차례로 펼쳐지고 마지막 단계가 채움으로 확정된다.',
    focusEn: 'Trapezoids unfold in turn from the widest stage to the narrowest, and the last stage settles with a fill.',
    recipe: '사다리꼴 3단 scaleX .2→1 (origin 중심) + opacity (시차 0/260/530ms, 420ms), 마지막 단계 fill 어두움→채움'
  });
})();
