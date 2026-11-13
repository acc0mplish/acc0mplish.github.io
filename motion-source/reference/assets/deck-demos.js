/* 발표 덱 모션 5종 — 결선 피치 덱(FlyGate)의 장별 모션에서 가져온 아이디어.
   키 누름·순환 글로우·주석 핀·지표 카드·결정 플래시처럼 "발표 장면에서 한 번에 한 가지씩 짚어 주는" 연출이며,
   성격에 맞는 UI 버튼·주목·내비·데이터·폼 카테고리로 흩어져 들어간다. */
(() => {
  const demos = window.MOTION_DEMOS ||= {};
  const P = 'position:absolute;display:block;';
  const SINE = 'cubic-bezier(.37,0,.63,1)';
  const SETTLE = 'cubic-bezier(.22,1,.36,1)';
  const C = { purple: '#7257ff', cyan: '#22bdd6', coral: '#ff725e', yellow: '#f2c84b', green: '#35c892', line: '#2a3850', card: '#141d2c', dim: '#3a4c69', mute: '#6c778b', ink: '#e7f2fa' };
  const MONO = 'font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;';
  const scene = (cls, content) => `<div class="mb-scene ${cls}">${content}</div>`;
  const caption = text => `<span class="mb-caption">${text}</span>`;
  const track = (selector, keyframes) => ({ selector, keyframes });
  const box = (cls, l, t, w, h, css = '', inner = '') => `<span class="${cls}" style="${P}left:${l}px;top:${t}px;width:${w}px;height:${h}px;${css}">${inner}</span>`;
  const txt = (cls, l, t, text, css = '') => `<span class="${cls}" style="${P}left:${l}px;top:${t}px;white-space:nowrap;${MONO}font-size:7px;font-weight:600;letter-spacing:.06em;color:${C.mute};${css}">${text}</span>`;
  // 타임라인: [offset, 바뀌는 속성, 그 지점에 닿는 방식(easing)]. 앞 지점의 속성은 이어받는다.
  function tl(init, pts) {
    const all = [[0, init, 'linear']];
    let cur = { ...init };
    pts.forEach(([t, props, ease]) => { cur = { ...cur, ...props }; all.push([t, { ...cur }, ease || SINE]); });
    if (all.at(-1)[0] < 1) all.push([1, { ...cur }, 'linear']);
    return all.map(([t, props], i) => ({ ...props, offset: t, easing: all[i + 1] ? all[i + 1][2] : 'linear' }));
  }
  const hold = (t, ease = 'linear') => [t, {}, ease];
  function define(pattern, html, tracks, metadata = {}) {
    demos[pattern] = { html, tracks, duration: 5600, easing: 'linear', segmentEasing: false, reducedProgress: .8, ...metadata };
  }

  /* 1. 키캡 순차 누름 — 명령 이름표가 키처럼 눌렸다 올라온다 */
  const KEYS = ['discover', 'signals', 'triage', 'grade'];
  const kcInit = { transform: 'translateY(0px)', boxShadow: '0 3px 0 #0b1220', borderColor: C.dim, background: '#1c2a40', color: '#9fb0c8' };
  const kcDown = { transform: 'translateY(2px)', boxShadow: '0 1px 0 #0b1220', borderColor: C.cyan, background: 'rgba(34,189,214,.16)', color: C.cyan };
  define('deckKeycapRelay', scene('dk-keys',
    KEYS.map((name, i) => { const y = 8 + i * 25;
      return box(`kc-k kc-k${i}`, 14, y, 74, 20, `border-radius:6px;border:1.5px solid ${C.dim};background:#1c2a40;box-shadow:0 3px 0 #0b1220;color:#9fb0c8;${MONO}font-size:9px;font-weight:700;line-height:17px;text-align:center`, name) +
        box('', 100, y + 3, 96, 5, 'border-radius:3px;background:#2a3a54') + box('', 100, y + 12, 64, 4, 'border-radius:2px;background:#243047'); }).join('') +
    caption('KEYCAPS PRESS IN TURN · SHADOW 3 → 1PX')), KEYS.map((n, i) => {
    const t = .06 + i * .17;
    return track(`.kc-k${i}`, tl(kcInit, [hold(t), [t + .03, kcDown], hold(t + .13), [t + .19, kcInit]]));
  }), { duration: 4800, recipe: 'Keycap translateY 0→2–3px + box-shadow 3px→1px + accent border/tint (~150ms) / 170ms between keys / returns in ~250ms' });

  /* 2. 순환 글로우 — 한 번에 한 단계만 링이 돌아가며 켜진다 */
  const rgLefts = [14, 66, 118, 170];
  const rgOff = '0 0 0 0 rgba(34,189,214,0), 0 0 0 0 rgba(34,189,214,0)';
  const rgOn = '0 0 0 3px #22bdd6, 0 12px 26px -10px rgba(34,189,214,.6)';
  define('deckRoundRobinGlow', scene('dk-glow',
    rgLefts.map((l, i) => box('', l, 36, 38, 46, `border-radius:8px;background:${C.card};border:1px solid ${C.line}`,
      box('', 8, 8, 8, 8, `border-radius:50%;background:${C.cyan}`) + box('', 6, 24, 26, 3, `border-radius:2px;background:${C.dim}`) + box('', 6, 32, 18, 3, `border-radius:2px;background:${C.dim}`)) +
      box(`rg-r rg-r${i}`, l, 36, 38, 46, `border-radius:8px;box-shadow:${rgOff}`) +
      (i < 3 ? box('', l + 41, 55, 6, 8, 'border-top:4px solid transparent;border-bottom:4px solid transparent;border-left:6px solid ' + C.dim) : '')).join('') +
    caption('ONE STAGE GLOWS AT A TIME · ABOUT 25% DUTY')), rgLefts.map((l, i) => {
    const t = .05 + i * .2;
    return track(`.rg-r${i}`, tl({ boxShadow: rgOff }, [hold(t), [t + .03, { boxShadow: rgOn }, 'linear'], hold(t + .13), [t + .2, { boxShadow: rgOff }]]));
  }), { duration: 6000, reducedProgress: .1, recipe: 'Ring box-shadow 0 → 3px + soft drop (~180ms) → off (~420ms) / one stage per 1200ms / lit ≈ 20% of the 6000ms cycle' });

  /* 3. 주석 핀 팝 — 실제 화면 위 지점에 이름표가 튀어나와 짚는다 */
  const PINS = [
    { x: 60, y: 40, lx: 76, ly: 18, t: 'SCORE', w: 36, o: 'left bottom' },
    { x: 150, y: 52, lx: 156, ly: 30, t: 'VERDICT', w: 42, o: 'left bottom' },
    { x: 140, y: 80, lx: 146, ly: 84, t: 'SOURCE', w: 40, o: 'left top' }
  ];
  define('deckAnnotationPins', scene('dk-pins',
    box('', 20, 12, 180, 88, `border-radius:8px;background:${C.card};border:1px solid ${C.line}`) +
    box('', 30, 20, 38, 6, `border-radius:3px;background:${C.dim}`) + box('', 30, 56, 80, 4, 'border-radius:2px;background:#243047') + box('', 30, 66, 60, 4, 'border-radius:2px;background:#243047') +
    box('', 46, 34, 28, 12, 'border-radius:3px;background:#22314a') + box('', 126, 46, 48, 12, 'border-radius:3px;background:#1f3a33') + box('', 124, 74, 32, 10, 'border-radius:3px;background:#22314a') +
    PINS.map((p, i) => box(`ap-ring ap-ring${i}`, p.x - 6, p.y - 6, 12, 12, `border-radius:50%;border:1.5px solid ${C.coral};opacity:0`) +
      box(`ap-dot ap-dot${i}`, p.x - 3, p.y - 3, 6, 6, `border-radius:50%;background:${C.coral};opacity:0`) +
      box(`ap-lbl ap-lbl${i}`, p.lx, p.ly, p.w, 12, `border-radius:4px;background:${C.coral};color:#1a0d0a;${MONO}font-size:7px;font-weight:800;line-height:12px;text-align:center;letter-spacing:.05em;opacity:0;transform-origin:${p.o}`, p.t)).join('') +
    caption('LABELS POP ONTO THE SCREEN · RING PINGS 2×')), PINS.flatMap((p, i) => {
    const t0 = .08 + i * .2, init = { opacity: 0, transform: 'scale(.4)' }, on = { opacity: 1, transform: 'scale(1)' };
    return [
      track(`.ap-dot${i}`, tl(init, [hold(t0), [t0 + .04, on, SETTLE], hold(.88), [1, init, SETTLE]])),
      track(`.ap-lbl${i}`, tl(init, [hold(t0 + .03), [t0 + .08, on, SETTLE], hold(.88), [1, init, SETTLE]])),
      track(`.ap-ring${i}`, tl({ opacity: 0, transform: 'scale(1)' }, [hold(t0 + .04), [t0 + .05, { opacity: .8 }, 'linear'], [t0 + .15, { opacity: 0, transform: 'scale(2.6)' }], [t0 + .151, { opacity: .8, transform: 'scale(1)' }, 'linear'], [t0 + .26, { opacity: 0, transform: 'scale(2.6)' }], [1, { transform: 'scale(1)' }, 'linear']]))
    ];
  }), { duration: 6000, recipe: 'Dot + label scale .4→1 (spring-like ease-out) 200ms apart / ring scale 1→2.6, opacity .8→0, two pings per pin / reset 600ms' });

  /* 4. 지표 카드 완성 — 숫자가 튀고, 밑줄이 차고, 빛이 한 번 훑는다 */
  define('deckMetricCardResolve', scene('dk-metric',
    box('mc-card', 36, 14, 148, 84, `border-radius:10px;overflow:hidden;background:${C.card};border:1px solid ${C.line}`,
      box('', 14, 12, 40, 5, `border-radius:3px;background:${C.dim}`) +
      `<span class="mc-num" style="${P}left:14px;top:24px;transform-origin:left center;font:800 32px/36px Pretendard,system-ui,sans-serif;color:${C.ink};opacity:0">440</span>` +
      txt('', 88, 40, 'CASES') + box('mc-bar', 14, 66, 70, 3, `border-radius:2px;background:${C.yellow};transform-origin:left center;transform:scaleX(0)`) +
      box('mc-delta', 100, 14, 36, 16, `border-radius:5px;background:rgba(53,200,146,.18);color:${C.green};${MONO}font-size:8px;font-weight:800;line-height:16px;text-align:center;opacity:0`, '+18%') +
      box('mc-sweep', -40, 0, 34, 84, 'background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.28),rgba(255,255,255,0));opacity:0;transform:skewX(-14deg)')) +
    caption('NUMBER PUNCH · UNDERBAR FILL · ONE LIGHT SWEEP')), [
    track('.mc-num', tl({ opacity: 0, transform: 'translateY(6px) scale(1)' }, [hold(.08), [.2, { opacity: 1, transform: 'translateY(0px) scale(1)' }, SETTLE], hold(.3), [.36, { transform: 'translateY(0px) scale(1.14)' }], [.46, { transform: 'translateY(0px) scale(1)' }, 'cubic-bezier(.34,1.56,.64,1)'], hold(.88), [1, { opacity: 0, transform: 'translateY(6px) scale(1)' }, SETTLE]])),
    track('.mc-bar', tl({ transform: 'scaleX(0)' }, [hold(.22), [.4, { transform: 'scaleX(1)' }], hold(.88), [1, { transform: 'scaleX(0)' }, SETTLE]])),
    track('.mc-delta', tl({ opacity: 0, transform: 'scale(.6)' }, [hold(.54), [.62, { opacity: 1, transform: 'scale(1)' }, SETTLE], hold(.88), [1, { opacity: 0, transform: 'scale(.6)' }, SETTLE]])),
    track('.mc-sweep', tl({ opacity: 0, transform: 'skewX(-14deg) translateX(0px)' }, [hold(.48), [.5, { opacity: 1 }, 'linear'], [.66, { transform: 'skewX(-14deg) translateX(230px)' }], [.68, { opacity: 0 }, 'linear'], [1, { transform: 'skewX(-14deg) translateX(0px)' }, 'linear']]))
  ], { duration: 5200, recipe: 'Number rise 6px → scale 1→1.14→1 (back ease-out) / underbar scaleX 0→1 (~900ms) / skewed light band translateX 230px once in ~800ms / delta chip pop' });

  /* 5. 질문 점등 → 결정 플래시 — 질문이 차례로 켜지고 결정 칸이 한 번 번쩍한다 */
  const qdInit = { opacity: .3, borderColor: C.line, color: C.mute };
  const qdLit = { opacity: 1, borderColor: C.cyan, color: C.cyan };
  define('deckDecisionFlash', scene('dk-decide',
    Array.from({ length: 7 }, (_, i) => box(`qd-q qd-q${i}`, 14 + i * 28, 20, 24, 16, `border-radius:5px;border:1px solid ${C.line};opacity:.3;color:${C.mute};${MONO}font-size:7px;font-weight:700;line-height:14px;text-align:center`, 'Q' + (i + 1))).join('') +
    box('', 14, 52, 192, 30, `border-radius:9px;background:${C.card};border:1px solid ${C.line}`, txt('', 12, 11, 'DECISION') +
      box('qd-dec', 124, 6, 58, 18, `border-radius:6px;background:#243047;color:${C.mute};${MONO}font-size:8px;font-weight:800;line-height:18px;text-align:center`, 'REVIEW')) +
    box('qd-ring', 134, 54, 66, 26, `border-radius:9px;border:1.5px solid ${C.green};opacity:0`) +
    caption('Q LIGHTS IN ORDER · ONE DECISION FLASH')), [
    ...Array.from({ length: 7 }, (_, i) => { const t = .05 + i * .06; return track(`.qd-q${i}`, tl(qdInit, [hold(t), [t + .03, qdLit], hold(.9), [1, qdInit, SETTLE]])); }),
    track('.qd-dec', tl({ background: '#243047', color: C.mute }, [hold(.5), [.52, { background: C.green, color: '#06231a' }, 'linear'], hold(.56), [.7, { background: '#1f3a33', color: C.green }], hold(.92), [1, { background: '#243047', color: C.mute }, SETTLE]])),
    track('.qd-ring', tl({ opacity: 0, transform: 'scale(1)' }, [hold(.7), [.71, { opacity: .8 }, 'linear'], [.8, { opacity: 0, transform: 'scale(1.5)' }], [.801, { opacity: .8, transform: 'scale(1)' }, 'linear'], [.89, { opacity: 0, transform: 'scale(1.5)' }], [1, { transform: 'scale(1)' }, 'linear']]))
  ], { duration: 5600, recipe: 'Seven pills opacity .3→1 + accent border, 330ms apart / verdict cell background flash (accent, 200ms) → settles to tinted / ring pings twice' });
})();
