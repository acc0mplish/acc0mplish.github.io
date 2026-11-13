/* 3D 깊이 모션 데모 — GitHub 모션 라이브러리 기법 재구성.
   vanilla-tilt.js · Atropos · Rellax · DepthFlow · zText · Cover Flow 패턴. */
(() => {
  const demos = window.MOTION_DEMOS ||= {};
  const scene = (cls, content) => `<div class="mb-scene ${cls}">${content}</div>`;
  const caption = text => `<span class="mb-caption">${text}</span>`;
  const box = (cls, style, content = '') => `<span class="stage-object web-motion-object ${cls}" style="${style}">${content}</span>`;
  function define(pattern, html, tracks, metadata = {}) {
    demos[pattern] = { html, tracks, duration: 2400, easing: 'linear', ...metadata };
  }
  const P = 'position:absolute;box-sizing:border-box;border-radius:8px;';

  /* 1. 틸트+글레어 — vanilla-tilt.js */
  define('depthTiltGlare', scene('dp-tilt',
    `<span style="${P}left:50%;top:50%;width:118px;height:66px;margin:-33px 0 0 -59px;perspective:700px;display:block">
      <span class="dp-card" style="${P}inset:0;background:linear-gradient(145deg,#22304a,#101826);border:1px solid #33475f;transform-style:preserve-3d;display:block;box-shadow:0 10px 24px #0009">
        <span class="dp-badge" style="${P}left:10px;top:9px;width:34px;height:34px;background:#0d5c63;border-radius:7px;display:flex;align-items:center;justify-content:center;font:700 10px Pretendard;color:#c8f4f0;transform:translateZ(24px)">Z+</span>
        <span style="${P}left:52px;top:12px;width:50px;height:7px;background:#31465e;border-radius:3px;transform:translateZ(14px)"></span>
        <span style="${P}left:52px;top:24px;width:36px;height:7px;background:#27394e;border-radius:3px;transform:translateZ(10px)"></span>
        <span style="${P}left:10px;bottom:9px;width:98px;height:8px;background:#1b2942;border-radius:3px;transform:translateZ(18px)"></span>
        <span class="dp-glare" style="${P}inset:0;border-radius:8px;background:linear-gradient(115deg,transparent 30%,#eaf6ff88 46%,#eaf6ffcc 50%,#eaf6ff88 54%,transparent 70%);mix-blend-mode:screen;transform:translate(-42px,-16px)"></span>
      </span>
    </span>` + caption('원근 700PX · 틸트 12° · 글레어')), [
    { selector: '.dp-card', keyframes: [
      { transform: 'rotateY(-12deg) rotateX(7deg)', offset: 0 },
      { transform: 'rotateY(12deg) rotateX(-7deg)', offset: .48, easing: 'cubic-bezier(.45,0,.55,1)' },
      { transform: 'rotateY(-12deg) rotateX(7deg)', offset: 1 } ] },
    { selector: '.dp-glare', keyframes: [
      { transform: 'translate(-42px,-16px)', opacity: .9, offset: 0 },
      { transform: 'translate(42px,14px)', opacity: .9, offset: .48, easing: 'cubic-bezier(.45,0,.55,1)' },
      { transform: 'translate(-42px,-16px)', opacity: .9, offset: 1 } ] },
    { selector: '.dp-badge', keyframes: [
      { transform: 'translateZ(24px) scale(1)', offset: 0 },
      { transform: 'translateZ(34px) scale(1.06)', offset: .48 },
      { transform: 'translateZ(24px) scale(1)', offset: 1 } ] },
  ], { duration: 2400 });

  /* 2. 층별 시차 회전 — Atropos */
  define('depthAtropos', scene('dp-atropos',
    `<span style="${P}left:50%;top:50%;width:132px;height:78px;margin:-39px 0 0 -66px;perspective:900px;display:block">
      <span class="dp-panel" style="${P}inset:0;background:linear-gradient(160deg,#1a2438,#0d1420);border:1px solid #2c3d55;transform-style:preserve-3d;display:block;box-shadow:0 14px 30px #000a">
        <span class="dp-back" style="${P}right:8px;top:8px;width:26px;height:26px;border:1.5px dashed #38506e;border-radius:6px"></span>
        <span class="dp-mid" style="${P}left:12px;top:14px;font:700 11px Pretendard;color:#d9e8ff;letter-spacing:.06em">DEPTH</span>
        <span class="dp-front" style="${P}left:12px;bottom:11px;padding:3px 8px;background:#5b3fd4;border-radius:5px;font:700 8px Pretendard;color:#efeaff;transform:translateZ(22px)">LAYER ×3</span>
      </span>
    </span>` + caption('패널 rotateY ±8° · 층 반위상 이동')), [
    { selector: '.dp-panel', keyframes: [
      { transform: 'rotateY(-8deg)', offset: 0 },
      { transform: 'rotateY(8deg)', offset: .5, easing: 'cubic-bezier(.45,0,.55,1)' },
      { transform: 'rotateY(-8deg)', offset: 1 } ] },
    { selector: '.dp-back', keyframes: [
      { transform: 'translate(-4px,2px)', offset: 0 },
      { transform: 'translate(4px,-2px)', offset: .5 },
      { transform: 'translate(-4px,2px)', offset: 1 } ] },
    { selector: '.dp-mid', keyframes: [
      { transform: 'translate(3px,-1px)', offset: 0 },
      { transform: 'translate(-3px,1px)', offset: .5 },
      { transform: 'translate(3px,-1px)', offset: 1 } ] },
    { selector: '.dp-front', keyframes: [
      { transform: 'translateZ(22px) translate(5px,-2px)', offset: 0 },
      { transform: 'translateZ(30px) translate(-5px,2px)', offset: .5 },
      { transform: 'translateZ(22px) translate(5px,-2px)', offset: 1 } ] },
  ], { duration: 2600 });

  /* 3. 스크롤 깊이 시차 — Rellax */
  define('depthRellax', scene('dp-rellax',
    `<span class="dp-bg" style="${P}inset:0;background:repeating-linear-gradient(180deg,#131c2c 0 10px,#0e1522 10px 20px);border-radius:0;display:block">
      <span style="${P}left:16px;top:24px;width:44px;height:44px;border:1px solid #24374e;border-radius:50%"></span>
      <span style="${P}right:20px;top:14px;width:30px;height:30px;border:1px solid #24374e;border-radius:50%"></span>
    </span>
    <span class="dp-mid" style="${P}left:0;bottom:0;width:100%;height:56px;display:block">
      <span style="${P}left:-14px;bottom:0;width:96px;height:44px;background:#1b3a4a;border-radius:100% 60% 0 0"></span>
      <span style="${P}right:-16px;bottom:0;width:116px;height:56px;background:#16303d;border-radius:100% 70% 0 0"></span>
    </span>
    <span class="dp-fg" style="${P}left:50%;bottom:16px;width:64px;height:40px;margin-left:-32px;background:linear-gradient(150deg,#2b6f6a,#174744);border:1px solid #3f9d92;border-radius:8px;display:block;box-shadow:0 12px 22px #000a">
      <span style="${P}left:8px;top:7px;width:44px;height:5px;background:#9fe8dd;border-radius:2px"></span>
      <span style="${P}left:8px;top:17px;width:28px;height:5px;background:#5db3a8;border-radius:2px"></span>
    </span>` + caption('속도비 0.2× · 0.6× · 1×')), [
    { selector: '.dp-bg', keyframes: [
      { transform: 'translateY(0)', offset: 0 },
      { transform: 'translateY(-4px)', offset: .5, easing: 'cubic-bezier(.4,0,.6,1)' },
      { transform: 'translateY(0)', offset: 1 } ] },
    { selector: '.dp-mid', keyframes: [
      { transform: 'translateY(0)', offset: 0 },
      { transform: 'translateY(-12px)', offset: .5, easing: 'cubic-bezier(.4,0,.6,1)' },
      { transform: 'translateY(0)', offset: 1 } ] },
    { selector: '.dp-fg', keyframes: [
      { transform: 'translateY(0) scale(1)', offset: 0 },
      { transform: 'translateY(-22px) scale(1.05)', offset: .5, easing: 'cubic-bezier(.4,0,.6,1)' },
      { transform: 'translateY(0) scale(1)', offset: 1 } ] },
  ], { duration: 2800 });

  /* 4. 깊이맵 드리프트 — DepthFlow */
  define('depthMapDrift', scene('dp-dmd',
    `<span class="dp-dbg" style="${P}inset:0;background:radial-gradient(90px 50px at 30% 40%,#23324a,#0f1622 70%);filter:blur(2px);display:block"></span>
    <span class="dp-dfg" style="${P}left:50%;top:50%;width:96px;height:58px;margin:-29px 0 0 -48px;display:block;transform-style:preserve-3d">
      <span style="${P}left:10px;top:8px;width:38px;height:38px;background:#d8a24a;border-radius:50%;box-shadow:0 6px 16px #0008"></span>
      <span style="${P}right:8px;bottom:6px;width:26px;height:26px;background:#7a5d33;border-radius:50%"></span>
      <span style="${P}left:0;bottom:0;width:100%;height:10px;background:linear-gradient(90deg,#2c2418,#4a3c26);border-radius:4px"></span>
    </span>
    <span class="dp-frame" style="${P}inset:6px;border:1px dashed #2f4258;border-radius:10px"></span>` + caption('전경 ×1.12 · 배경 ×0.94 반위상')), [
    { selector: '.dp-dbg', keyframes: [
      { transform: 'scale(1.02) translate(2px,1px)', offset: 0 },
      { transform: 'scale(1.02) translate(-2px,-1px)', offset: .5, easing: 'cubic-bezier(.45,0,.55,1)' },
      { transform: 'scale(1.02) translate(2px,1px)', offset: 1 } ] },
    { selector: '.dp-dfg', keyframes: [
      { transform: 'scale(1) translate(0,0)', offset: 0 },
      { transform: 'scale(1.12) translate(-7px,-3px)', offset: .5, easing: 'cubic-bezier(.45,0,.55,1)' },
      { transform: 'scale(1) translate(0,0)', offset: 1 } ] },
    { selector: '.dp-frame', keyframes: [
      { opacity: .8, offset: 0 }, { opacity: .3, offset: .5 }, { opacity: .8, offset: 1 } ] },
  ], { duration: 3000 });

  /* 5. 3D 돌출 문자 — zText */
  (() => {
    const layers = Array.from({ length: 7 }, (_, i) =>
      `<span class="dp-z" style="${P}left:0;top:0;width:100%;text-align:center;font:800 30px Pretendard,sans-serif;letter-spacing:.04em;transform:translateZ(${i * 3}px);color:${i === 6 ? '#ffd7a3' : `rgba(${34 + i * 4},${44 + i * 4},${64 + i * 3},1)`}">깊이</span>`).join('');
    define('depthZText', scene('dp-ztext',
      `<span style="${P}left:50%;top:54px;width:100%;transform:translate(-50%,-50%);perspective:420px;display:block;height:40px">
        <span class="dp-zstack" style="${P}inset:0;transform-style:preserve-3d;transform:rotateX(58deg);display:block">${layers}</span>
      </span>` + caption('7층 · Z 3PX 간격 · rotateX 58°↔72°')), [
      { selector: '.dp-zstack', keyframes: [
        { transform: 'rotateX(58deg)', offset: 0 },
        { transform: 'rotateX(72deg)', offset: .5, easing: 'cubic-bezier(.45,0,.55,1)' },
        { transform: 'rotateX(58deg)', offset: 1 } ] },
    ], { duration: 2200 });
  })();

  /* 6. 커버플로 */
  (() => {
    const card = (x, ry, s, hue) => `<span class="dp-cf" style="${P}left:50%;top:50%;width:44px;height:62px;margin:-31px 0 0 -22px;background:linear-gradient(160deg,${hue});border:1px solid #3a4f68;border-radius:7px;transform:translateX(${x}px) rotateY(${ry}deg) scale(${s});box-shadow:0 8px 18px #0008">
      <span style="${P}left:8px;top:8px;width:18px;height:18px;border:1.5px solid #ffffff55;border-radius:4px"></span>
      <span style="${P}left:8px;bottom:8px;width:24px;height:4px;background:#ffffff44;border-radius:2px"></span></span>`;
    define('depthCoverflow', scene('dp-cover',
      `<span style="${P}inset:0;perspective:800px;display:block">
        <span class="dp-row" style="${P}inset:0;transform-style:preserve-3d;display:block">
          ${card(-118, 46, .74, '#141d2c,#0d1420')}
          ${card(-64, 46, .84, '#182438,#101726')}
          ${card(0, 0, 1, '#2a4d6e,#17324e')}
          ${card(64, -46, .84, '#182438,#101726')}
          ${card(118, -46, .74, '#141d2c,#0d1420')}
        </span>
      </span>` + caption('rotateY ±46° · scale 0.74–1')), [
      { selector: '.dp-row', keyframes: [
        { transform: 'rotateY(-8deg) translateX(-26px)', offset: 0 },
        { transform: 'rotateY(8deg) translateX(26px)', offset: .5, easing: 'cubic-bezier(.6,0,.3,1)' },
        { transform: 'rotateY(-8deg) translateX(-26px)', offset: 1 } ] },
    ], { duration: 3000 });
  })();

  /* 7. 카드 덱 펼침 */
  (() => {
    const dk = (z, extra) => `<span class="dp-dk" style="${P}left:50%;top:50%;width:76px;height:52px;margin:-26px 0 0 -38px;background:linear-gradient(155deg,#20324a,#111a2a);border:1px solid #3a4f68;border-radius:8px;transform:translateZ(${z}px);box-shadow:0 8px 16px #0007">
      <span style="${P}left:10px;top:10px;font:700 11px Pretendard;color:${extra};">A${z ? '' : '♠'}</span></span>`;
    define('depthDeckFan', scene('dp-deck',
      `<span style="${P}left:50%;top:50%;width:120px;height:80px;margin:-40px 0 0 -60px;perspective:700px;display:block">
        <span class="dp-fan" style="${P}inset:0;transform-style:preserve-3d;display:block">
          ${dk(0, '#8fb4e8')}${dk(3, '#c8f4f0')}${dk(6, '#ffd7a3')}${dk(9, '#f0a3c0')}
        </span>
      </span>` + caption('rotateZ ±14° · Z 3PX 계단 · 지연 40MS')), [
      { selector: '.dp-fan', keyframes: [
        { transform: 'scale(1)', offset: 0 },
        { transform: 'scale(1.06)', offset: .5, easing: 'cubic-bezier(.34,1.4,.5,1)' },
        { transform: 'scale(1)', offset: 1 } ] },
      { selector: '.dp-dk:nth-child(1)', keyframes: [
        { transform: 'translateZ(0px) rotateZ(0deg) translateY(0)', offset: 0 },
        { transform: 'translateZ(0px) rotateZ(-14deg) translateY(-16px)', offset: .5, easing: 'cubic-bezier(.34,1.5,.5,1)' },
        { transform: 'translateZ(0px) rotateZ(0deg) translateY(0)', offset: 1 } ] },
      { selector: '.dp-dk:nth-child(2)', keyframes: [
        { transform: 'translateZ(3px) rotateZ(0deg) translateY(0)', offset: 0 },
        { transform: 'translateZ(6px) rotateZ(-5deg) translateY(-5px)', offset: .55, easing: 'cubic-bezier(.34,1.5,.5,1)' },
        { transform: 'translateZ(3px) rotateZ(0deg) translateY(0)', offset: 1 } ] },
      { selector: '.dp-dk:nth-child(3)', keyframes: [
        { transform: 'translateZ(6px) rotateZ(0deg) translateY(0)', offset: 0 },
        { transform: 'translateZ(12px) rotateZ(5deg) translateY(5px)', offset: .55, easing: 'cubic-bezier(.34,1.5,.5,1)' },
        { transform: 'translateZ(6px) rotateZ(0deg) translateY(0)', offset: 1 } ] },
      { selector: '.dp-dk:nth-child(4)', keyframes: [
        { transform: 'translateZ(9px) rotateZ(0deg) translateY(0)', offset: 0 },
        { transform: 'translateZ(18px) rotateZ(14deg) translateY(16px)', offset: .5, easing: 'cubic-bezier(.34,1.5,.5,1)' },
        { transform: 'translateZ(9px) rotateZ(0deg) translateY(0)', offset: 1 } ] },
    ], { duration: 2400 });
  })();

  /* 8. 큐브 회전 전환 */
  define('depthCubeTurn', scene('dp-cube',
    `<span style="${P}left:50%;top:50%;width:74px;height:54px;margin:-27px 0 0 -37px;perspective:560px;display:block">
      <span class="dp-cubewrap" style="${P}inset:0;transform-style:preserve-3d;display:block">
        <span class="dp-cube" style="${P}inset:0;transform-style:preserve-3d;display:block">
          <span style="${P}inset:0;background:linear-gradient(150deg,#3d5fa8,#25396e);border:1px solid #5d82c8;border-radius:6px;transform:translateZ(37px);display:flex;align-items:center;justify-content:center;font:800 13px Pretendard;color:#eaf2ff">ON</span>
          <span style="${P}inset:0;background:linear-gradient(150deg,#8a3d5f,#5e2540);border:1px solid #c86a92;border-radius:6px;transform:rotateY(90deg) translateZ(37px);display:flex;align-items:center;justify-content:center;font:800 13px Pretendard;color:#ffeaf2">OFF</span>
        </span>
      </span>
    </span>` + caption('면 Z 37PX · rotateY 0→90°')), [
    { selector: '.dp-cube', keyframes: [
      { transform: 'rotateY(0deg)', offset: 0 },
      { transform: 'rotateY(0deg)', offset: .18 },
      { transform: 'rotateY(90deg)', offset: .55, easing: 'cubic-bezier(.65,0,.35,1)' },
      { transform: 'rotateY(90deg)', offset: .8 },
      { transform: 'rotateY(0deg)', offset: 1, easing: 'cubic-bezier(.65,0,.35,1)' } ] },
  ], { duration: 2200 });

  /* 9. 포인터 시차 히어로 */
  define('depthPointerHero', scene('dp-hero',
    `<span class="dp-hbg" style="${P}inset:0;display:block">
      <span style="${P}left:18px;top:16px;width:5px;height:5px;background:#2f4358;border-radius:50%"></span>
      <span style="${P}left:64px;top:30px;width:4px;height:4px;background:#2f4358;border-radius:50%"></span>
      <span style="${P}left:150px;top:20px;width:5px;height:5px;background:#2f4358;border-radius:50%"></span>
      <span style="${P}left:190px;top:44px;width:4px;height:4px;background:#2f4358;border-radius:50%"></span>
      <span style="${P}left:96px;top:88px;width:5px;height:5px;background:#2f4358;border-radius:50%"></span>
    </span>
    <span class="dp-hmid" style="${P}left:0;top:38px;width:100%;text-align:center;font:800 16px Pretendard,sans-serif;color:#eaf3ff;letter-spacing:.05em;display:block">LAYERED SPACE</span>
    <span class="dp-hfg" style="${P}left:50%;top:66px;width:88px;height:26px;margin-left:-44px;background:#1f8a80;border-radius:6px;display:flex;align-items:center;justify-content:center;font:700 9px Pretendard;color:#dffff9;box-shadow:0 8px 18px #0008">EXPLORE →</span>` + caption('배경 ∓3 · 중경 ±7 · 전경 ±14 반위상')), [
    { selector: '.dp-hbg', keyframes: [
      { transform: 'translate(-3px,-2px)', offset: 0 },
      { transform: 'translate(3px,2px)', offset: .5, easing: 'cubic-bezier(.45,0,.55,1)' },
      { transform: 'translate(-3px,-2px)', offset: 1 } ] },
    { selector: '.dp-hmid', keyframes: [
      { transform: 'translate(7px,2px)', offset: 0 },
      { transform: 'translate(-7px,-2px)', offset: .5, easing: 'cubic-bezier(.45,0,.55,1)' },
      { transform: 'translate(7px,2px)', offset: 1 } ] },
    { selector: '.dp-hfg', keyframes: [
      { transform: 'translate(14px,4px)', offset: 0 },
      { transform: 'translate(-14px,-4px)', offset: .5, easing: 'cubic-bezier(.45,0,.55,1)' },
      { transform: 'translate(14px,4px)', offset: 1 } ] },
  ], { duration: 2800 });

  /* 10. 원근 접힘 전환 */
  define('depthFold', scene('dp-fold',
    `<span class="dp-reveal" style="${P}inset:0;background:linear-gradient(160deg,#12303c,#0b1c26);border-radius:8px;display:block">
      <span style="${P}left:50%;top:50%;transform:translate(-50%,-50%);font:700 11px Pretendard;color:#8fe3d4">NEXT SCENE</span>
    </span>
    <span style="${P}inset:0;perspective:900px;display:block">
      <span class="dp-fl" style="${P}left:0;top:0;width:50%;height:100%;background:linear-gradient(120deg,#2b3d63,#1a2745);border-radius:8px 0 0 8px;transform-origin:left center;transform-style:preserve-3d;display:block;box-shadow:6px 0 14px #0006">
        <span style="${P}right:8px;top:50%;transform:translateY(-50%);font:700 9px Pretendard;color:#9db7e8">A</span>
      </span>
      <span class="dp-fr" style="${P}right:0;top:0;width:50%;height:100%;background:linear-gradient(240deg,#2b3d63,#1a2745);border-radius:0 8px 8px 0;transform-origin:right center;transform-style:preserve-3d;display:block;box-shadow:-6px 0 14px #0006">
        <span style="${P}left:8px;top:50%;transform:translateY(-50%);font:700 9px Pretendard;color:#9db7e8">B</span>
      </span>
    </span>` + caption('패널 rotateY →96° · 드러남 scale .96→1')), [
    { selector: '.dp-reveal', keyframes: [
      { transform: 'scale(.96)', opacity: .5, offset: 0 },
      { transform: 'scale(1)', opacity: 1, offset: .5, easing: 'cubic-bezier(.5,0,.4,1)' },
      { transform: 'scale(.96)', opacity: .5, offset: 1 } ] },
    { selector: '.dp-fl', keyframes: [
      { transform: 'rotateY(0deg)', offset: 0 },
      { transform: 'rotateY(0deg)', offset: .15 },
      { transform: 'rotateY(-96deg)', offset: .5, easing: 'cubic-bezier(.7,0,.3,1)' },
      { transform: 'rotateY(-96deg)', offset: .8 },
      { transform: 'rotateY(0deg)', offset: 1, easing: 'cubic-bezier(.7,0,.3,1)' } ] },
    { selector: '.dp-fr', keyframes: [
      { transform: 'rotateY(0deg)', offset: 0 },
      { transform: 'rotateY(0deg)', offset: .15 },
      { transform: 'rotateY(96deg)', offset: .5, easing: 'cubic-bezier(.7,0,.3,1)' },
      { transform: 'rotateY(96deg)', offset: .8 },
      { transform: 'rotateY(0deg)', offset: 1, easing: 'cubic-bezier(.7,0,.3,1)' } ] },
  ], { duration: 2000 });
})();
