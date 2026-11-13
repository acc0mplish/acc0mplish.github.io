/* 레이아웃·전환 데모 — 플렉스 호버 확장.
   같은 폭으로 나란히 선 카드 중 포인터가 올라간 카드만 flex-grow 로 넓어지고, 접혀 있을 때 숨어 있던 그림과 수치가 드러난다.
   데모는 포인터 움직임을 시간축으로 재생한다. 실제 화면에서는 :hover 와 transition 한 줄이면 된다(항목의 recipe). */
(() => {
  const demos = window.MOTION_DEMOS ||= {};
  const P = 'position:absolute;display:block;';
  const SETTLE = 'cubic-bezier(.22,1,.36,1)';
  const C = { purple: '#7257ff', cyan: '#22bdd6', coral: '#ff725e', yellow: '#f2c84b', green: '#35c892', line: '#2a3850', card: '#141d2c', dim: '#3a4c69', mute: '#6c778b', ink: '#e7f2fa' };
  const MONO = 'font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;';
  const scene = (cls, content) => `<div class="mb-scene ${cls}">${content}</div>`;
  const caption = text => `<span class="mb-caption">${text}</span>`;
  const track = (selector, keyframes) => ({ selector, keyframes });
  // 타임라인: [offset, 바뀌는 속성, 그 지점에 닿는 방식(easing)]. 앞 지점의 속성은 이어받는다.
  function tl(init, pts) {
    const all = [[0, init, 'linear']];
    let cur = { ...init };
    pts.forEach(([t, props, ease]) => { cur = { ...cur, ...props }; all.push([t, { ...cur }, ease || SETTLE]); });
    if (all.at(-1)[0] < 1) all.push([1, { ...cur }, 'linear']);
    return all.map(([t, props], i) => ({ ...props, offset: t, easing: all[i + 1] ? all[i + 1][2] : 'linear' }));
  }
  const hold = t => [t, {}, 'linear'];

  /* 플렉스 호버 확장 — 대칭이던 카드 중 하나가 늘어나며 그림과 수치를 보여 준다 */
  const CARDS = [
    { name: 'NORTH', value: '+38%', bars: [.45, .7, 1], c: C.cyan, sky: ['#12324a', '#22bdd6'] },
    { name: 'EAST', value: '+12%', bars: [.6, .5, .75], c: C.purple, sky: ['#221a4a', '#7257ff'] },
    { name: 'SOUTH', value: '−4%', bars: [.8, .6, .5], c: C.coral, sky: ['#3a1c1a', '#ff725e'] },
    { name: 'WEST', value: '+21%', bars: [.4, .65, .85], c: C.yellow, sky: ['#3a2f12', '#f2c84b'] }
  ];
  const GROW = 3.4, SLOT = .19, IN = .055;   // 펼친 카드의 flex-grow, 카드 하나의 머무름, 늘어나는 시간(루프 비율)
  const hoverAt = i => .07 + i * SLOT;
  // 숨은 그림: 하늘 그라디언트 위에 산 두 겹(카드가 접혀 있으면 가려진다)
  const photo = card => `<span class="fx-photo" style="${P}left:0;top:0;width:100px;height:54px;` +
    `background:linear-gradient(160deg,transparent 52%,rgba(8,12,22,.85) 52.5%) 0 0/100% 100% no-repeat,` +
    `linear-gradient(200deg,transparent 58%,rgba(8,12,22,.6) 58.5%) 0 0/100% 100% no-repeat,` +
    `radial-gradient(circle at 74% 30%,rgba(255,255,255,.75) 0 5px,transparent 6px),` +
    `linear-gradient(180deg,${card.sky[0]},${card.sky[1]})"></span>`;
  const cardHtml = (card, i) =>
    `<span class="fx-card fx-card${i}" style="position:relative;display:block;flex:1 1 0;min-width:0;height:100%;overflow:hidden;border-radius:8px;background:${C.card};border:1px solid ${C.line}">` +
      `<span class="fx-img fx-img${i}" style="${P}left:0;top:0;width:100px;height:54px;opacity:0;transform-origin:30% 50%;transform:scale(1.08)">${photo(card)}</span>` +
      `<span style="${P}left:9px;top:9px;width:8px;height:8px;border-radius:50%;background:${card.c}"></span>` +
      `<span class="fx-v fx-v${i}" style="${P}left:9px;bottom:9px;writing-mode:vertical-rl;transform:rotate(180deg);${MONO}font-size:8px;font-weight:700;letter-spacing:.14em;color:#9fb0c8">${card.name}</span>` +
      `<span class="fx-data fx-data${i}" style="${P}left:8px;top:58px;width:84px;opacity:0;transform:translateY(6px)">` +
        `<span style="${P}left:0;top:0;${MONO}font-size:7px;font-weight:700;letter-spacing:.12em;color:#9fb0c8">${card.name}</span>` +
        `<span style="${P}left:0;top:10px;font-size:13px;font-weight:800;letter-spacing:-.02em;color:${card.c}">${card.value}</span>` +
        card.bars.map((h, k) => `<span style="${P}left:${54 + k * 9}px;top:${26 - h * 18}px;width:6px;height:${h * 18}px;border-radius:2px;background:${k === 2 ? card.c : C.dim}"></span>`).join('') +
      `</span>` +
    `</span>`;
  // 포인터 경로: 카드에 들어가는 순간 그 카드가 넓어진다. 넓어진 뒤 다음 카드는 오른쪽에 접힌 폭(약 29px)으로 서 있다
  const curX = [33, 128, 162, 196], curY = 36;   // 그림 위에 둬 수치를 가리지 않는다
  const cursor = `<span class="fx-cur" style="${P}left:0;top:0;width:12px;height:16px;opacity:0;transform:translate(22px,112px)">` +
    `<svg viewBox="0 0 12 16" width="12" height="16" style="display:block"><path d="M1 1 L1 13 L4.2 10.2 L6.6 15 L8.6 14 L6.3 9.4 L10.6 9.4 Z" fill="#e7f2fa" stroke="#0b1220" stroke-width="1.1" stroke-linejoin="round"/></svg></span>`;
  const curTrack = tl({ opacity: 0, transform: 'translate(22px,112px)' }, [
    [.03, { opacity: 1 }, 'linear'],
    [hoverAt(0), { transform: `translate(${curX[0]}px,${curY}px)` }],
    hold(hoverAt(1) - .07), [hoverAt(1), { transform: `translate(${curX[1]}px,${curY}px)` }],
    hold(hoverAt(2) - .07), [hoverAt(2), { transform: `translate(${curX[2]}px,${curY}px)` }],
    hold(hoverAt(3) - .07), [hoverAt(3), { transform: `translate(${curX[3]}px,${curY}px)` }],
    hold(hoverAt(4) - .07), [hoverAt(4), { transform: 'translate(204px,112px)' }],
    [.96, { opacity: 0 }, 'linear'], [.9601, { transform: 'translate(22px,112px)' }, 'linear']
  ]);
  const cardTracks = CARDS.flatMap((card, i) => {
    const a = hoverAt(i), b = hoverAt(i + 1);   // 포인터가 머무는 구간
    return [
      track(`.fx-card${i}`, tl({ flexGrow: 1 }, [hold(a), [a + IN, { flexGrow: GROW }], hold(b), [b + IN, { flexGrow: 1 }]])),
      track(`.fx-img${i}`, tl({ opacity: 0, transform: 'scale(1.08)' }, [hold(a + .01), [a + IN + .02, { opacity: 1, transform: 'scale(1)' }], hold(b), [b + .03, { opacity: 0, transform: 'scale(1.08)' }]])),
      track(`.fx-data${i}`, tl({ opacity: 0, transform: 'translateY(6px)' }, [hold(a + .03), [a + IN + .03, { opacity: 1, transform: 'translateY(0px)' }], hold(b - .005), [b + .02, { opacity: 0, transform: 'translateY(6px)' }]])),
      track(`.fx-v${i}`, tl({ opacity: 1 }, [hold(a), [a + .02, { opacity: 0 }, 'linear'], hold(b + .02), [b + IN, { opacity: 1 }]]))
    ];
  });
  demos.layoutFlexHoverExpand = {
    html: scene('fx-row-scene',
      `<span class="fx-row" style="${P}left:10px;top:12px;width:200px;height:92px;display:flex;gap:4px">${CARDS.map(cardHtml).join('')}</span>` +
      cursor + caption('FLEX-GROW 1 → 3.4 · HIDDEN PHOTO + DATA')),
    tracks: [...cardTracks, track('.fx-cur', curTrack)],
    duration: 7200, easing: 'linear', segmentEasing: false, reducedProgress: .2,
    recipe: '.row { display:flex } .card { flex:1 1 0; min-width:0; transition: flex-grow 400ms cubic-bezier(.22,1,.36,1) } .card:hover { flex-grow: 3.4 } / hidden photo + data: opacity 0→1, 80–150ms after the grow starts'
  };
})();
