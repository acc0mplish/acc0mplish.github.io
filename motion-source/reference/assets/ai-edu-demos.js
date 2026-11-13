/* 설명용 모션 10종 — 사내 AI 교육 시리즈(슬라이드 덱)의 직접 해 보기 장면에서 가져온 아이디어.
   게이지·분기·판정·예약·선택처럼 "시스템이 어떻게 동작하는지"를 보여 주는 연출이며,
   각각 로더·데이터·알림·컨트롤·폼·주목 카테고리에 흩어져 들어간다. 모든 루프는 처음 상태로 돌아온다. */
(() => {
  const demos = window.MOTION_DEMOS ||= {};
  const P = 'position:absolute;display:block;';
  const SINE = 'cubic-bezier(.37,0,.63,1)';
  const SETTLE = 'cubic-bezier(.22,1,.36,1)';
  const C = { purple: '#7257ff', cyan: '#22bdd6', coral: '#ff725e', yellow: '#f2c84b', green: '#35c892', blue: '#2f6fb0', line: '#2a3850', card: '#141d2c', dim: '#3a4c69', mute: '#6c778b', ink: '#e7f2fa' };
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

  /* 1. 누적 게이지 — 책상(맥락 창)이 칸 단위로 차오르다 경고색으로 */
  const sgInit = { borderColor: C.line, boxShadow: `0 0 0 0 rgba(255,114,94,0)` };
  const sgSeg = (cls, color, w = 0) => `<span class="${cls}" style="flex:none;display:block;width:${w}px;height:100%;background:${color}"></span>`;
  define('aiStackedGauge', scene('ai-gauge',
    `<span class="sg-bar" style="${P}left:14px;top:40px;width:192px;height:30px;border-radius:9px;overflow:hidden;display:flex;background:#0f1726;border:1px solid ${C.line}">` +
      sgSeg('sg-a', C.purple, 20) + sgSeg('sg-b', C.cyan) + sgSeg('sg-c', C.blue) + sgSeg('sg-d', C.coral) + `</span>` +
    box('', 177, 34, 1, 42, 'background:rgba(255,114,94,.75)') + txt('', 168, 24, '85%', `color:${C.coral}`) +
    txt('', 14, 24, 'DESK') + caption('SEGMENTS STACK · WARN PAST 85%')), [
    track('.sg-b', tl({ width: '0px' }, [hold(.06), [.24, { width: '48px' }], hold(.88), [1, { width: '0px' }, SETTLE]])),
    track('.sg-c', tl({ width: '0px' }, [hold(.22), [.5, { width: '70px' }], hold(.88), [1, { width: '0px' }, SETTLE]])),
    track('.sg-d', tl({ width: '0px' }, [hold(.48), [.68, { width: '44px' }], hold(.88), [1, { width: '0px' }, SETTLE]])),
    track('.sg-bar', tl(sgInit, [hold(.6), [.74, { borderColor: C.coral, boxShadow: '0 0 14px 1px rgba(255,114,94,.45)' }], hold(.88), [1, sgInit, SETTLE]]))
  ], { duration: 5200, recipe: 'Flex segments width 0→48 / 0→70 / 0→44px (ease-in-out, staggered) / bar border + glow turn coral past 85% / reset 600ms' });

  /* 2. 요약 압축 — 오래된 칸들이 한 장으로 접히고, 말로 한 조건은 사라진다 */
  const scW = { conv: 44, files: 54, ong: 36 };
  const scSeg = (cls, color, w, inner = '') => `<span class="${cls}" style="flex:none;position:relative;display:block;overflow:hidden;width:${w}px;height:100%;background:${color}">${inner}</span>`;
  define('aiSummaryCollapse', scene('ai-summary',
    `<span class="sc-bar" style="${P}left:14px;top:40px;width:192px;height:30px;border-radius:9px;overflow:hidden;display:flex;background:#0f1726;border:1px solid ${C.line}">` +
      scSeg('sc-a', C.purple, 20) +
      scSeg('sc-conv', C.cyan, scW.conv, `<span class="sc-chip" style="${P}left:16px;top:7px;width:8px;height:14px;border-radius:2px;background:${C.coral};box-shadow:0 0 0 1.5px #fff"></span>`) +
      scSeg('sc-files', C.blue, scW.files) + scSeg('sc-ong', '#1b8fa6', scW.ong) + scSeg('sc-sum', C.yellow, 0) + scSeg('sc-rec', C.cyan, 28) + `</span>` +
    box('', 14, 82, 8, 8, `border-radius:2px;background:${C.coral}`) + txt('', 26, 82, 'SPOKEN CONDITION') +
    caption('OLD TURNS → ONE SUMMARY · CONDITION LOST')), [
    track('.sc-chip', tl({ opacity: 1, transform: 'scale(1)' }, [hold(.28), [.4, { opacity: 0, transform: 'scale(.4)' }], hold(.88), [1, { opacity: 1, transform: 'scale(1)' }, SETTLE]])),
    track('.sc-conv', tl({ width: `${scW.conv}px` }, [hold(.3), [.56, { width: '0px' }], hold(.88), [1, { width: `${scW.conv}px` }, SETTLE]])),
    track('.sc-files', tl({ width: `${scW.files}px` }, [hold(.32), [.58, { width: '0px' }], hold(.88), [1, { width: `${scW.files}px` }, SETTLE]])),
    track('.sc-ong', tl({ width: `${scW.ong}px` }, [hold(.34), [.6, { width: '0px' }], hold(.88), [1, { width: `${scW.ong}px` }, SETTLE]])),
    track('.sc-sum', tl({ width: '0px' }, [hold(.4), [.64, { width: '26px' }], hold(.88), [1, { width: '0px' }, SETTLE]]))
  ], { duration: 5600, recipe: 'Old segments width → 0 (300–600ms stagger) while the summary segment grows 0→26px / red condition chip fades first / 96% → 39%' });

  /* 3. 분기·병합 — 갈라져 각자 일하고, 요약만 돌아온다 */
  const wc = [21, 56, 91];
  const fmNode = (cls, l, t, w, h, label, extra = '') => box(cls, l, t, w, h, `border-radius:7px;background:${C.card};border:1px solid ${C.line};${extra}`, txt('', 0, h / 2 - 5, label, `width:${w}px;text-align:center;left:0;color:${C.ink}`));
  define('aiFanOutMerge', scene('ai-fan',
    `<svg viewBox="0 0 220 120" style="${P}left:0;top:0;width:220px;height:120px" aria-hidden="true">${wc.map(y => `<path d="M52 57L96 ${y}M134 ${y}L166 57" stroke="rgba(255,255,255,.1)" stroke-width="1" fill="none"/>`).join('')}</svg>` +
    fmNode('', 14, 44, 38, 26, 'LEAD') + box('', 14, 74, 38, 4, 'border-radius:2px;background:#243047') +
    box('fm-lead', 14, 74, 38, 4, `border-radius:2px;background:${C.purple};transform-origin:left center;transform:scaleX(.1)`) +
    wc.map((y, i) => box('', 92, y - 11, 42, 22, `border-radius:6px;background:${C.card};border:1px solid ${C.line}`,
      box('', 5, 14, 32, 4, 'border-radius:2px;background:#243047') + box(`fm-f fm-f${i}`, 5, 14, 32, 4, `border-radius:2px;background:${C.cyan};transform-origin:left center;transform:scaleX(0)`) +
      txt('', 5, 3, 'ABC'[i], `color:${C.ink}`))).join('') +
    fmNode('fm-sum', 168, 44, 38, 26, 'SUM') +
    wc.map((y, i) => box(`fm-o fm-o${i}`, 55, 54, 6, 6, `border-radius:50%;background:${C.yellow};opacity:0`)).join('') +
    wc.map((y, i) => box(`fm-m fm-m${i}`, 131, y - 3, 6, 6, `border-radius:50%;background:${C.cyan};opacity:0`)).join('') +
    caption('THREE DESKS AT ONCE · LEAD KEEPS SUMMARY')), [
    ...wc.map((y, i) => track(`.fm-o${i}`, tl({ opacity: 0, transform: 'translate(0px,0px)' }, [hold(.04), [.07, { opacity: 1 }, 'linear'], [.27, { transform: `translate(38px,${y - 57}px)` }], [.3, { opacity: 0 }, 'linear'], [1, { transform: 'translate(0px,0px)' }, 'linear']]))),
    ...wc.map((y, i) => track(`.fm-f${i}`, tl({ transform: 'scaleX(0)' }, [hold(.27), [.5 + i * .05, { transform: 'scaleX(1)' }], hold(.88), [1, { transform: 'scaleX(0)' }, SETTLE]]))),
    ...wc.map((y, i) => track(`.fm-m${i}`, tl({ opacity: 0, transform: 'translate(0px,0px)' }, [hold(.6), [.63, { opacity: 1 }, 'linear'], [.78, { transform: `translate(32px,${57 - y}px)` }], [.8, { opacity: 0 }, 'linear'], [1, { transform: 'translate(0px,0px)' }, 'linear']]))),
    track('.fm-lead', tl({ transform: 'scaleX(.1)' }, [hold(.05), [.3, { transform: 'scaleX(.16)' }], hold(.88), [1, { transform: 'scaleX(.1)' }, SETTLE]])),
    track('.fm-sum', tl({ borderColor: C.line, boxShadow: '0 0 0 0 rgba(34,189,214,0)' }, [hold(.76), [.84, { borderColor: C.cyan, boxShadow: '0 0 12px 0 rgba(34,189,214,.5)' }], hold(.9), [1, { borderColor: C.line, boxShadow: '0 0 0 0 rgba(34,189,214,0)' }, SETTLE]]))
  ], { duration: 6000, recipe: 'Out packets translate (38, ±36px) in 200ms / worker bars scaleX 0→1 staggered 50ms / summary packets return (32px) / lead meter .1→.16 only' });

  /* 4. 검문소 3판정 — 통과, 막음, 사람에게 묻기 */
  const lanes = [24, 54, 84];
  const gvGate = i => box(`gv-g gv-g${i}`, 108, lanes[i] - 12, 4, 24, `border-radius:2px;background:${C.dim}`);
  const gateTrack = (i, flashColor, a, b, back) => track(`.gv-g${i}`, tl({ background: C.dim, transform: 'translateX(0px)' }, [hold(a), [a + .02, { background: flashColor }, 'linear'], hold(back), [back + .06, { background: C.dim }, 'linear'], [1, {}, 'linear']]));
  define('aiGateVerdict', scene('ai-gate',
    lanes.map((y, i) => box('', 14, y, 192, 1, 'background:rgba(255,255,255,.08)') + txt('', 14, y - 15, ['ALLOW', 'DENY', 'ASK'][i]) + gvGate(i) +
      box(`gv-p gv-p${i}`, 18, y - 4, 8, 8, `border-radius:50%;background:${C.ink}`)).join('') +
    box('gv-why', 102, lanes[1] - 3, 12, 6, `border-radius:2px;background:${C.coral};opacity:0`) +
    box('gv-ask', 118, 66, 44, 26, `border-radius:6px;background:#1c2740;border:1px solid ${C.yellow};opacity:0;transform:scale(.8)`,
      box('gv-ok', 8, 14, 10, 6, `border-radius:3px;background:${C.green}`) + box('', 26, 14, 10, 6, `border-radius:3px;background:${C.dim}`) + box('', 8, 5, 28, 3, `border-radius:2px;background:${C.dim}`)) +
    caption('PASS · BLOCK + REASON BACK · ASK A PERSON')), [
    track('.gv-p0', tl({ transform: 'translateX(0px)' }, [hold(.08), [.26, { transform: 'translateX(86px)' }], [.42, { transform: 'translateX(170px)' }, 'linear'], hold(.88), [1, { transform: 'translateX(0px)' }, SETTLE]])),
    track('.gv-p1', tl({ transform: 'translateX(0px)' }, [hold(.08), [.26, { transform: 'translateX(86px)' }], [.36, { transform: 'translateX(40px)' }, SETTLE], hold(.88), [1, { transform: 'translateX(0px)' }, SETTLE]])),
    track('.gv-p2', tl({ transform: 'translateX(0px)' }, [hold(.08), [.26, { transform: 'translateX(86px)' }], hold(.6), [.78, { transform: 'translateX(170px)' }], hold(.88), [1, { transform: 'translateX(0px)' }, SETTLE]])),
    gateTrack(0, C.green, .26, .32, .4),
    track('.gv-g1', tl({ background: C.dim, transform: 'translateX(0px)' }, [hold(.26), [.28, { background: C.coral, transform: 'translateX(-2px)' }, 'linear'], [.3, { transform: 'translateX(2px)' }, 'linear'], [.32, { transform: 'translateX(-2px)' }, 'linear'], [.34, { transform: 'translateX(0px)' }, 'linear'], hold(.44), [.52, { background: C.dim }, 'linear'], [1, {}, 'linear']])),
    track('.gv-g2', tl({ background: C.dim, transform: 'translateX(0px)' }, [hold(.26), [.28, { background: C.yellow }, 'linear'], hold(.6), [.62, { background: C.green }, 'linear'], hold(.7), [.78, { background: C.dim }, 'linear'], [1, {}, 'linear']])),
    track('.gv-why', tl({ opacity: 0, transform: 'translateX(0px)' }, [hold(.3), [.32, { opacity: 1 }, 'linear'], [.52, { transform: 'translateX(-76px)' }], [.56, { opacity: 0 }, 'linear'], [1, { transform: 'translateX(0px)' }, 'linear']])),
    track('.gv-ask', tl({ opacity: 0, transform: 'scale(.8)' }, [hold(.3), [.38, { opacity: 1, transform: 'scale(1)' }, SETTLE], hold(.58), [.64, { opacity: 0, transform: 'scale(.96)' }, 'linear'], [1, { opacity: 0, transform: 'scale(.8)' }, 'linear']])),
    track('.gv-ok', tl({ transform: 'scale(1)' }, [hold(.46), [.5, { transform: 'scale(1.5)' }], [.56, { transform: 'scale(1)' }], [1, {}, 'linear']]))
  ], { duration: 6000, recipe: 'Three lanes / gate flashes green, red (shake ±2px + reason chip returns 76px) or amber (dialog scale .8→1, packet waits until approval)' });

  /* 5. 따라잡기 틱 — 잠든 사이 놓친 실행은 버리고, 마지막 하나만 돈다 */
  const days = [30, 70, 110, 150, 190];
  const ctInit = { opacity: 1, background: 'rgba(0,0,0,0)', borderColor: C.mute };
  const ctFill = { opacity: 1, background: C.yellow, borderColor: C.yellow };
  define('aiCatchUpTick', scene('ai-catchup',
    box('', 22, 56, 176, 1, 'background:rgba(255,255,255,.12)') +
    box('ct-sleep', 14, 38, 112, 36, `border-radius:10px;border:1px dashed ${C.dim};background:repeating-linear-gradient(135deg,rgba(120,140,180,.2) 0 4px,transparent 4px 8px)`) +
    txt('ct-sleepl', 20, 26, 'PC ASLEEP') +
    days.map((x, i) => box(`ct-m ct-m${i}`, x - 7, 49, 14, 14, `border-radius:50%;border:1.5px solid ${C.mute}`) + txt('', x - 12, 77, ['MON', 'TUE', 'WED', 'THU', 'FRI'][i], 'width:24px;text-align:center;left:' + (x - 12) + 'px')).join('') +
    box('ct-ring', days[2] - 7, 49, 14, 14, `border-radius:50%;border:1.5px solid ${C.yellow};opacity:0`) +
    box('ct-head', 29, 38, 2, 36, `background:${C.yellow};opacity:0`) +
    caption('MISSED RUNS DROP · LAST ONE CATCHES UP')), [
    track('.ct-head', tl({ opacity: 0, transform: 'translateX(0px)' }, [hold(.04), [.07, { opacity: 1 }, 'linear'], [.36, { transform: 'translateX(92px)' }, 'linear'], hold(.46), [.78, { transform: 'translateX(160px)' }, 'linear'], [.84, { opacity: 0 }, 'linear'], [1, { transform: 'translateX(0px)' }, 'linear']])),
    track('.ct-sleep', tl({ opacity: 1 }, [hold(.36), [.44, { opacity: 0 }], hold(.88), [1, { opacity: 1 }, SETTLE]])),
    track('.ct-sleepl', tl({ opacity: 1 }, [hold(.36), [.44, { opacity: 0 }], hold(.88), [1, { opacity: 1 }, SETTLE]])),
    track('.ct-m0', tl(ctInit, [hold(.08), [.14, { opacity: .3 }], hold(.88), [1, ctInit, SETTLE]])),
    track('.ct-m1', tl(ctInit, [hold(.2), [.27, { opacity: .3 }], hold(.88), [1, ctInit, SETTLE]])),
    track('.ct-m2', tl(ctInit, [hold(.31), [.35, { opacity: .3 }], hold(.44), [.5, ctFill], hold(.88), [1, ctInit, SETTLE]])),
    track('.ct-m3', tl(ctInit, [hold(.57), [.63, ctFill], hold(.88), [1, ctInit, SETTLE]])),
    track('.ct-m4', tl(ctInit, [hold(.75), [.8, ctFill], hold(.9), [1, ctInit, SETTLE]])),
    track('.ct-ring', tl({ opacity: 0, transform: 'scale(1)' }, [hold(.44), [.46, { opacity: .8 }, 'linear'], [.6, { opacity: 0, transform: 'scale(2.6)' }], [1, { transform: 'scale(1)' }, 'linear']]))
  ], { duration: 7000, recipe: 'Playhead scrubs Mon→Fri / skipped markers dim to .3 and are never filled / on wake only the latest missed marker fills with a ring pulse / 7000ms' });

  /* 6. 후보 확률 선택 — 막대가 자라고, 하나가 문장 끝에 붙는다 */
  const cand = [['Sunday', .46], ['Friday', .28], ['Monday', .17], ['tomorrow', .09]];
  const npW = p => Math.round(p / .46 * 120);
  define('aiNextTokenPicker', scene('ai-picker',
    txt('', 14, 11, 'The picnic is', `font-size:11px;font-weight:800;color:${C.ink};letter-spacing:.02em`) +
    box('', 114, 6, 50, 18, `border-radius:5px;border:1px dashed ${C.mute}`) +
    box('np-caret', 116, 8, 2, 14, `background:${C.yellow}`) +
    cand.map(([w, p], i) => txt('', 14, 43 + i * 14, w, 'font-size:8px') +
      box(`np-bar np-bar${i}`, 70, 42 + i * 14, npW(p), 8, `border-radius:3px;background:${C.dim};transform-origin:left center;transform:scaleX(0)`) +
      txt(`np-pct np-pct${i}`, 70 + npW(p) + 5, 43 + i * 14, Math.round(p * 100) + '%', 'font-size:8px;opacity:0')).join('') +
    box('np-chip', 12, 40, 50, 16, `border-radius:5px;background:${C.purple};opacity:0`,
      txt('', 0, 4, 'Sunday', `width:50px;text-align:center;left:0;font-size:8px;color:#fff`)) +
    caption('BAR = PROBABILITY · WINNER JOINS SENTENCE')), [
    ...cand.map(([w, p], i) => track(`.np-bar${i}`, tl({ transform: 'scaleX(0)', opacity: 1, background: C.dim }, [hold(.06 + i * .04), [.22 + i * .04, { transform: 'scaleX(1)' }],
      hold(.36), i === 0 ? [.42, { background: C.purple }, 'linear'] : [.42, { opacity: .35 }, 'linear'], hold(.86), [1, { transform: 'scaleX(0)', opacity: 1, background: C.dim }, SETTLE]]))),
    ...cand.map((c, i) => track(`.np-pct${i}`, tl({ opacity: 0 }, [hold(.2 + i * .04), [.3 + i * .04, { opacity: 1 }], hold(.86), [1, { opacity: 0 }, SETTLE]]))),
    track('.np-chip', tl({ opacity: 0, transform: 'translate(0px,0px)' }, [hold(.44), [.46, { opacity: 1 }, 'linear'], [.62, { transform: 'translate(102px,-34px)' }, SETTLE], hold(.86), [1, { opacity: 0, transform: 'translate(0px,0px)' }, 'linear']])),
    track('.np-caret', tl({ transform: 'translateX(0px)' }, [hold(.6), [.68, { transform: 'translateX(52px)' }], hold(.86), [1, { transform: 'translateX(0px)' }, SETTLE]]))
  ], { duration: 6000, recipe: 'Bars scaleX 0→1 (stagger 40ms, width ∝ probability) / winner turns purple, others dim to .35 / chip flies (102, −34px) into the slot / caret +52px' });

  /* 7. 책등 뽑기 — 세로 글자 책등이 들리고 이웃은 가만히 있다 */
  const spines = [['XLS', C.purple, 62], ['DOC', C.cyan, 70], ['PDF', C.coral, 56], ['MTG', C.yellow, 66], ['RPT', C.green, 60], ['BOM', C.blue, 64]];
  const slInit = { transform: 'translateY(0px)', boxShadow: '0 0 0 rgba(0,0,0,0)' };
  const slUp = { transform: 'translateY(-16px)', boxShadow: '0 14px 16px rgba(0,0,0,.5)' };
  define('aiSpineLift', scene('ai-spines',
    box('', 18, 98, 184, 2, `background:${C.line}`) +
    spines.map(([label, color, h], i) => box(`sl-s sl-s${i}`, 29 + i * 28, 98 - h, 22, h, `border-radius:4px 4px 2px 2px;background:${color};color:${i === 3 ? '#2a2100' : '#fff'}`,
      box('', 3, 8, 16, 1.5, 'background:rgba(255,255,255,.4)') + box('', 3, h - 18, 16, 1.5, 'background:rgba(255,255,255,.4)') +
      `<span style="${P}left:0;top:14px;width:22px;height:${h - 38}px;writing-mode:vertical-rl;text-align:center;${MONO}font-size:8px;font-weight:800;letter-spacing:.12em;line-height:22px">${label}</span>`)).join('') +
    caption('SELECTED SPINE LIFTS · NEIGHBORS STAY')), [
    track('.sl-s1', tl(slInit, [hold(.1), [.2, slUp], hold(.34), [.42, slInit], [1, {}, 'linear']])),
    track('.sl-s4', tl(slInit, [hold(.46), [.56, slUp], hold(.74), [.82, slInit], [1, {}, 'linear']]))
  ], { duration: 5200, recipe: 'Selected spine translateY 0→−16px (ease-in-out ~520ms) with shadow 0→14px 16px; neighbors never move; vertical text via writing-mode' });

  /* 8. 토글 연동 게이지 — 켠 만큼 목록과 게이지가 늘고, 잠긴 칸은 거절한다 */
  const tgRows = [18, 42, 66];
  define('aiLinkedToggle', scene('ai-toggle',
    tgRows.map((y, i) => box('', 12, y, 92, 20, `border-radius:8px;background:${C.card};border:1px solid ${C.line}`,
      box('', 8, 7, 36, 6, `border-radius:3px;background:${C.dim}`) +
      (i === 0 ? box('tl-lock', 48, 5, 7, 8, `border-radius:2px;border:1.5px solid ${C.mute}`) : '') +
      box(`tl-s tl-s${i}`, 60, 4, 26, 12, `border-radius:6px;background:${i === 0 ? '#1b8fa6' : C.dim}`,
        box(`tl-k tl-k${i}`, 2, 2, 8, 8, `border-radius:50%;background:#fff;${i === 0 ? 'transform:translateX(14px)' : ''}`)))).join('') +
    [18, 34, 50].map((y, i) => box(`tl-ln tl-ln${i}`, 118, y, 88, 10, `border-radius:4px;background:#1f2c44;${i ? 'opacity:0;transform:translateY(6px)' : ''}`)).join('') +
    box('', 118, 78, 90, 8, 'border-radius:4px;background:#1c2a40') +
    box('tl-fill', 118, 78, 90, 8, `border-radius:4px;background:${C.cyan};transform-origin:left center;transform:scaleX(.22)`) +
    txt('', 118, 90, 'DESK LOAD') + caption('EACH SWITCH ADDS A LINE · LOCKED REFUSES')), [
    track('.tl-s1', tl({ background: C.dim }, [hold(.16), [.22, { background: C.cyan }, 'linear'], hold(.88), [1, { background: C.dim }, SETTLE]])),
    track('.tl-k1', tl({ transform: 'translateX(0px)' }, [hold(.16), [.22, { transform: 'translateX(14px)' }], hold(.88), [1, { transform: 'translateX(0px)' }, SETTLE]])),
    track('.tl-s2', tl({ background: C.dim }, [hold(.42), [.48, { background: C.cyan }, 'linear'], hold(.88), [1, { background: C.dim }, SETTLE]])),
    track('.tl-k2', tl({ transform: 'translateX(0px)' }, [hold(.42), [.48, { transform: 'translateX(14px)' }], hold(.88), [1, { transform: 'translateX(0px)' }, SETTLE]])),
    track('.tl-ln1', tl({ opacity: 0, transform: 'translateY(6px)' }, [hold(.18), [.26, { opacity: 1, transform: 'translateY(0px)' }, SETTLE], hold(.88), [1, { opacity: 0, transform: 'translateY(6px)' }, SETTLE]])),
    track('.tl-ln2', tl({ opacity: 0, transform: 'translateY(6px)' }, [hold(.44), [.52, { opacity: 1, transform: 'translateY(0px)' }, SETTLE], hold(.88), [1, { opacity: 0, transform: 'translateY(6px)' }, SETTLE]])),
    track('.tl-fill', tl({ transform: 'scaleX(.22)' }, [hold(.18), [.3, { transform: 'scaleX(.45)' }], hold(.44), [.56, { transform: 'scaleX(.7)' }], hold(.88), [1, { transform: 'scaleX(.22)' }, SETTLE]])),
    track('.tl-s0', tl({ transform: 'translateX(0px)' }, [hold(.68), [.7, { transform: 'translateX(-2px)' }, 'linear'], [.72, { transform: 'translateX(2px)' }, 'linear'], [.74, { transform: 'translateX(-2px)' }, 'linear'], [.76, { transform: 'translateX(0px)' }, 'linear'], [1, {}, 'linear']])),
    track('.tl-lock', tl({ borderColor: C.mute }, [hold(.68), [.7, { borderColor: C.coral }, 'linear'], hold(.78), [.84, { borderColor: C.mute }, 'linear'], [1, {}, 'linear']]))
  ], { duration: 6000, recipe: 'Knob translateX 0→14px (~300ms) + list line pop (translateY 6→0) + gauge scaleX .22→.45→.7 / locked switch shakes ±2px and its lock turns coral' });

  /* 9. 플러그 연결 — 꽂히는 순간 한 번 튕기고, 점선이 흐르며 램프가 켜진다 */
  define('aiPlugSnap', scene('ai-plug',
    box('ps-plug', 18, 44, 56, 32, '',
      box('', 0, 0, 36, 32, `border-radius:7px;background:#2b3a55;border:1px solid #3f567a`) + box('', 36, 7, 18, 4, 'border-radius:1px;background:#c9d6e8') + box('', 36, 21, 18, 4, 'border-radius:1px;background:#c9d6e8')) +
    box('ps-sock', 100, 38, 40, 44, `border-radius:8px;background:${C.card};border:1px solid ${C.line}`,
      box('', 4, 12, 14, 4, 'border-radius:1px;background:#0a0f1a') + box('', 4, 28, 14, 4, 'border-radius:1px;background:#0a0f1a')) +
    `<svg viewBox="0 0 220 120" style="${P}left:0;top:0;width:220px;height:120px" aria-hidden="true"><path class="ps-cable" d="M140 60L176 60" stroke="${C.yellow}" stroke-width="2" stroke-dasharray="5 4" stroke-linecap="round" fill="none" opacity="0"/></svg>` +
    box('ps-lamp', 178, 48, 24, 24, `border-radius:50%;background:${C.line}`) + caption('PLUG SNAPS IN · DASHES FLOW · LAMP LIGHTS')), [
    track('.ps-plug', tl({ transform: 'translateX(0px)' }, [hold(.08), [.3, { transform: 'translateX(46px)' }, 'cubic-bezier(.5,0,.9,.6)'], [.35, { transform: 'translateX(42px)' }], [.4, { transform: 'translateX(44px)' }], hold(.88), [1, { transform: 'translateX(0px)' }, SETTLE]])),
    track('.ps-sock', tl({ borderColor: C.line }, [hold(.28), [.32, { borderColor: C.yellow }, 'linear'], hold(.36), [.5, { borderColor: C.line }, 'linear'], [1, {}, 'linear']])),
    track('.ps-cable', tl({ opacity: 0, strokeDashoffset: '0' }, [hold(.4), [.42, { opacity: 1 }, 'linear'], [.88, { strokeDashoffset: '-54' }, 'linear'], [.9, { opacity: 0 }, 'linear'], [1, { strokeDashoffset: '0' }, 'linear']])),
    track('.ps-lamp', tl({ background: C.line, boxShadow: '0 0 0 0 rgba(242,200,75,0)' }, [hold(.44), [.5, { background: C.yellow, boxShadow: '0 0 18px 3px rgba(242,200,75,.55)' }, 'linear'], hold(.88), [1, { background: C.line, boxShadow: '0 0 0 0 rgba(242,200,75,0)' }, SETTLE]]))
  ], { duration: 5600, recipe: 'Plug translateX 0→46px (ease-in) → rebound 42 → settle 44 / socket flash / dashed line dashoffset 0→−54 linear / lamp glow 0→18px' });

  /* 10. 순차 점등 + 핵심 단계 — 켜진 단계는 남고, 핵심 단계만 색이 다르다 */
  const krLeft = i => 11 + i * 34;
  const KEY = 3;
  define('aiKeyStageRelay', scene('ai-relay',
    box('', 14, 92, 192, 2, 'border-radius:1px;background:#243047') +
    box('kr-rail', 14, 92, 192, 2, `border-radius:1px;background:${C.cyan};transform-origin:left center;transform:scaleX(0)`) +
    txt('kr-key', krLeft(KEY) - 2, 24, 'KEY', `color:${C.coral};width:32px;text-align:center;opacity:0`) +
    Array.from({ length: 6 }, (_, i) => box(`kr-st kr-st${i}`, krLeft(i), 36, 28, 42, `border-radius:8px;background:${C.card};border:1.5px solid ${C.line};opacity:.38`,
      box('', 8, 7, 8, 8, `border-radius:50%;background:${i === KEY ? C.coral : C.cyan}`) + box('', 5, 22, 18, 3, `border-radius:2px;background:${C.dim}`) + box('', 5, 30, 12, 3, `border-radius:2px;background:${C.dim}`))).join('') +
    caption('STAGES LIGHT IN ORDER · KEY GETS ACCENT')), [
    track('.kr-rail', tl({ transform: 'scaleX(0)' }, [hold(.08), [.72, { transform: 'scaleX(1)' }, 'linear'], hold(.88), [1, { transform: 'scaleX(0)' }, SETTLE]])),
    track('.kr-key', tl({ opacity: 0 }, [hold(.08 + KEY * .1), [.08 + KEY * .1 + .06, { opacity: 1 }, 'linear'], hold(.88), [1, { opacity: 0 }, SETTLE]])),
    ...Array.from({ length: 6 }, (_, i) => {
      const t = .08 + i * .1, key = i === KEY;
      const init = { opacity: .38, borderColor: C.line, background: C.card, transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255,114,94,0)' };
      const lit = key ? { opacity: 1, borderColor: C.coral, background: '#2a1c24', transform: 'scale(1.08)', boxShadow: '0 0 14px 0 rgba(255,114,94,.4)' } : { opacity: 1, borderColor: C.cyan };
      return track(`.kr-st${i}`, tl(init, [hold(t), [t + .06, lit], hold(.88), [1, init, SETTLE]]));
    })
  ], { duration: 5600, recipe: 'Six stages opacity .38→1 + border cyan, 100ms apart / key stage: coral border, tint, scale 1.08, glow / rail scaleX 0→1 linear' });
})();
