/* 점진 강조(주목·강조) 데모 8종.
   순간적으로 시선을 빼앗는 기존 강조와 달리, 대기 → 서서히 상승 → 유지 → 복귀의 한 호흡으로 강도를 쌓는다. */
(() => {
  const demos = window.MOTION_DEMOS ||= {};
  const P = 'position:absolute;box-sizing:border-box;display:block;';
  const SINE = 'cubic-bezier(.37,0,.63,1)';     // 올라가는 구간: 양 끝이 부드러운 완만한 곡선
  const SETTLE = 'cubic-bezier(.22,1,.36,1)';   // 복귀 구간: 빠르게 정리
  const RGB = { purple: '114,87,255', cyan: '34,189,214', coral: '255,114,94', yellow: '242,200,75' };
  const rgba = (accent, alpha) => `rgba(${RGB[accent]},${alpha})`;
  const scene = (cls, content) => `<div class="mb-scene ${cls}">${content}</div>`;
  const caption = text => `<span class="mb-caption">${text}</span>`;
  const track = (selector, keyframes) => ({ selector, keyframes });
  // 대기(rest)까지 정지 → peak까지 완만하게 상승 → hold까지 유지 → 처음 상태로 복귀
  const ramp = (from, to, { rest = .08, peak = .72, hold = .9 } = {}) => [
    { ...from, offset: 0, easing: 'linear' },
    { ...from, offset: rest, easing: SINE },
    { ...to, offset: peak, easing: 'linear' },
    { ...to, offset: hold, easing: SETTLE },
    { ...from, offset: 1 }
  ];
  function define(pattern, html, tracks, metadata = {}) {
    demos[pattern] = { html, tracks, duration: 3600, easing: 'linear', segmentEasing: false, reducedProgress: .78, ...metadata };
  }
  // 공통 카드(128×64)
  const W = inner => `<span style="${P}left:50%;top:50%;width:128px;height:64px;margin:-38px 0 0 -64px">${inner}</span>`;
  const SKIN = 'background:#141d2c;border:1px solid #2a3850;border-radius:10px;';
  const lines = (icon = '#22314a') => `
    <span style="${P}left:12px;top:14px;width:34px;height:34px;border-radius:8px;background:${icon}"></span>
    <span style="${P}left:56px;top:17px;width:58px;height:7px;border-radius:3px;background:#3a4c69"></span>
    <span style="${P}left:56px;top:31px;width:44px;height:6px;border-radius:3px;background:#2a3a54"></span>
    <span style="${P}left:56px;top:43px;width:30px;height:6px;border-radius:3px;background:#2a3a54"></span>`;
  const card = (cls = 'eb-card', icon) => `<span class="${cls}" style="${P}inset:0;${SKIN}">${lines(icon)}</span>`;

  /* 1. 보더 서서히 진하게 */
  define('emphBorderDeepen', scene('eb-border', W(card() +
    `<span class="eb-line" style="${P}inset:0;border-radius:10px;border:1px solid ${rgba('purple', .2)}"></span>`) +
    caption('BORDER 1PX .2 → 3PX 1.0')), [
    track('.eb-line', ramp(
      { borderColor: rgba('purple', .2), borderWidth: '1px' },
      { borderColor: rgba('purple', 1), borderWidth: '3px' }))
  ], { recipe: 'Overlay outline 1px→3px / alpha .2→1 over 2300ms (ease-in-out) / hold 650ms / reset 360ms' });

  /* 2. 강조 포인트 서서히 확대 */
  define('emphPointSwell', scene('eb-point', W(card() +
    `<span class="eb-halo" style="${P}right:-6px;top:-6px;width:12px;height:12px;border-radius:50%;background:${rgba('coral', .4)};opacity:0"></span>` +
    `<span class="eb-dot" style="${P}right:-6px;top:-6px;width:12px;height:12px;border-radius:50%;background:#ff725e"></span>`) +
    caption('DOT SCALE 1 → 2.2 / HALO FOLLOWS')), [
    track('.eb-dot', ramp({ transform: 'scale(1)' }, { transform: 'scale(2.2)' })),
    track('.eb-halo', ramp({ transform: 'scale(1)', opacity: 0 }, { transform: 'scale(3.4)', opacity: .85 }))
  ], { recipe: 'Dot scale 1→2.2 / halo scale 1→3.4 opacity 0→.85 over 2300ms (ease-in-out) / hold / reset' });

  /* 3. 글로우 서서히 차오름 */
  define('emphGlowRise', scene('eb-glow', W(card() +
    `<span class="eb-line" style="${P}inset:0;border-radius:10px;border:1px solid ${rgba('cyan', 0)}"></span>` +
    `<span class="eb-halo" style="${P}inset:0;border-radius:10px;box-shadow:0 0 0 0 ${rgba('cyan', 0)}"></span>`) +
    caption('GLOW 0 → 26PX · ALPHA 0 → .55')), [
    track('.eb-halo', ramp(
      { boxShadow: `0 0 0 0 ${rgba('cyan', 0)}` },
      { boxShadow: `0 0 26px 4px ${rgba('cyan', .55)}` })),
    track('.eb-line', ramp({ borderColor: rgba('cyan', 0) }, { borderColor: rgba('cyan', .75) }))
  ], { recipe: 'box-shadow 0 0 0 0 α0 → 0 0 26px 4px α.55 / border α0→.75 over 2300ms / hold / reset' });

  /* 4. 채도 서서히 올림 */
  define('emphColorRise', scene('eb-color', W(
    `<span class="eb-card" style="${P}inset:0;${SKIN}"></span>` +
    `<span class="eb-tint" style="${P}inset:0;filter:grayscale(1) brightness(.7)">` +
      `<span style="${P}left:12px;top:14px;width:34px;height:34px;border-radius:8px;background:linear-gradient(145deg,#f2c84b,#e08a2c)"></span>` +
      `<span style="${P}left:56px;top:17px;width:58px;height:7px;border-radius:3px;background:#f2c84b"></span>` +
      `<span style="${P}left:56px;top:31px;width:44px;height:6px;border-radius:3px;background:#a58a3a"></span>` +
      `<span style="${P}left:56px;top:43px;width:30px;height:6px;border-radius:3px;background:#a58a3a"></span>` +
    `</span>`) + caption('SATURATION 0 → 1 · BRIGHTNESS .7 → 1.1')), [
    track('.eb-tint', ramp(
      { filter: 'grayscale(1) brightness(.7)' },
      { filter: 'grayscale(0) brightness(1.1)' })),
    track('.eb-card', ramp({ borderColor: '#2a3850' }, { borderColor: rgba('yellow', .7) }))
  ], { recipe: 'filter grayscale(1) brightness(.7) → grayscale(0) brightness(1.1) over 2300ms / border #2a3850→α.7 / hold / reset' });

  /* 5. 밑줄 서서히 굵게 */
  define('emphUnderlineBuild', scene('eb-underline',
    `<span style="${P}left:50%;top:50%;transform:translate(-50%,-62%);white-space:nowrap">` +
      `<span class="eb-word" style="display:block;font:800 22px/1.2 Pretendard,system-ui,sans-serif;letter-spacing:.02em;color:#8e9bb2">KEY POINT</span>` +
      `<span class="eb-rule" style="${P}left:0;bottom:-6px;width:100%;height:2px;border-radius:2px;background:#7257ff;transform-origin:left center;transform:scaleX(0)"></span>` +
    `</span>` + caption('LINE DRAWS 0 → 100% · THEN 2 → 5PX')), [
    track('.eb-word', ramp({ color: '#8e9bb2' }, { color: '#ffffff' })),
    track('.eb-rule', [
      { transform: 'scaleX(0)', height: '2px', offset: 0, easing: 'linear' },
      { transform: 'scaleX(0)', height: '2px', offset: .08, easing: SINE },
      { transform: 'scaleX(1)', height: '2px', offset: .46, easing: SINE },
      { transform: 'scaleX(1)', height: '5px', offset: .72, easing: 'linear' },
      { transform: 'scaleX(1)', height: '5px', offset: .9, easing: SETTLE },
      { transform: 'scaleX(0)', height: '2px', offset: 1 }
    ])
  ], { duration: 3400, recipe: 'Underline scaleX 0→1 (origin left) over ~1300ms, then height 2px→5px over ~900ms / text #8e9bb2→#fff / reset' });

  /* 6. 주변 서서히 물러남 */
  const mini = (cls, left, extra = '') => `<span class="${cls}" style="${P}left:${left}px;top:30px;width:58px;height:58px;${SKIN}${extra}">` +
    `<span style="${P}left:9px;top:10px;width:24px;height:24px;border-radius:7px;background:#22314a"></span>` +
    `<span style="${P}left:9px;top:41px;width:40px;height:5px;border-radius:2px;background:#3a4c69"></span></span>`;
  define('emphSlowRecede', scene('eb-recede',
    mini('eb-side', 13) + mini('eb-hero', 81, `border:1.5px solid ${rgba('cyan', .9)};`) + mini('eb-side', 149) +
    caption('SURROUNDINGS RECEDE · TARGET UNTOUCHED')), [
    track('.eb-side', ramp(
      { opacity: 1, filter: 'saturate(1) blur(0px)', transform: 'scale(1)' },
      { opacity: .32, filter: 'saturate(.2) blur(1.2px)', transform: 'scale(.94)' }))
  ], { recipe: 'Siblings opacity 1→.32 / saturate 1→.2 / blur 0→1.2px / scale 1→.94 over 2300ms; target keeps its state' });

  /* 7. 호흡 점증 */
  const breath = (scale, alpha, spread, offset) => ({ transform: `scale(${scale})`, boxShadow: `0 0 0 ${spread}px ${rgba('yellow', alpha)}`, offset, easing: SINE });
  define('emphBreathEscalate', scene('eb-breath',
    `<span class="eb-cta" style="${P}left:50%;top:50%;width:96px;height:32px;margin:-22px 0 0 -48px;border-radius:999px;background:#f2c84b;color:#2a2100;` +
      `font:800 12px/32px Pretendard,system-ui,sans-serif;letter-spacing:.08em;text-align:center">START</span>` +
    caption('3 BREATHS · SCALE 1.025 → 1.05 → 1.09')), [
    track('.eb-cta', [
      breath(1, 0, 0, 0), breath(1, 0, 0, .08),
      breath(1.025, .18, 5, .2), breath(1, 0, 0, .32),
      breath(1.05, .28, 9, .44), breath(1, 0, 0, .56),
      breath(1.09, .4, 14, .68), breath(1, 0, 0, .82),
      breath(1, 0, 0, 1)
    ])
  ], { duration: 4200, reducedProgress: .68, recipe: 'Three breaths: scale 1.025 → 1.05 → 1.09 / ring spread 5 → 9 → 14px / alpha .18 → .28 → .4 / 4200ms' });

  /* 8. 코너 브래킷 조임 */
  const corner = (pos, sides) => `<span style="${P}${pos}width:14px;height:14px;${sides.map(s => `border-${s}:2.5px solid #ff725e;`).join('')}"></span>`;
  define('emphCornerLock', scene('eb-corner', W(card() +
    `<span class="eb-line" style="${P}inset:0;border-radius:10px;border:1px solid ${rgba('coral', 0)}"></span>` +
    `<span class="eb-brk" style="${P}left:-34px;top:-22px;width:196px;height:108px;opacity:.2">` +
      corner('left:0;top:0;', ['left', 'top']) + corner('right:0;top:0;', ['right', 'top']) +
      corner('left:0;bottom:0;', ['left', 'bottom']) + corner('right:0;bottom:0;', ['right', 'bottom']) +
    `</span>`) + caption('BRACKETS 34PX → 7PX · ALPHA .2 → 1')), [
    track('.eb-brk', ramp(
      { left: '-34px', top: '-22px', width: '196px', height: '108px', opacity: .2 },
      { left: '-7px', top: '-7px', width: '142px', height: '78px', opacity: 1 })),
    track('.eb-line', ramp({ borderColor: rgba('coral', 0) }, { borderColor: rgba('coral', .6) }))
  ], { recipe: 'Corner brackets inset −34→−7px / opacity .2→1 over 2300ms (ease-in-out) / card outline α0→.6 / hold / reset' });
})();
