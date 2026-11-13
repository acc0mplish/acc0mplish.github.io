/* MOTION ATLAS 항목을 목록에 더하고 기존 항목을 MOTION ATLAS 방식의 캔버스 데모에 연결.
   atlas-bundle.js(window.ATLAS)·data/atlas-items.js·motion-runtime.js 뒤에 로드. */
(() => {
  const library = window.MOTION_LIBRARY || [];
  const categories = window.MOTION_CATEGORIES || [];
  // 기존 항목 중 MOTION ATLAS 도감에 같은 움직임이 있는 것(해당 데모로 그림)
  const SAME_AS_ATLAS = {
    "typewriter": "ty-typewriter",
    "scramble-resolve": "ty-scramble",
    "word-swap": "ty-swap",
    "tracking-open": "ty-tracking",
    "blur-resolve": "ty-blurin",
    "type-mask": "ty-mask",
    "stagger-letters": "ty-cascade",
    "skeleton-shimmer": "ui-skeleton",
    "spinner-arc": "ld-spinner",
    "circular-progress": "ld-ring",
    "loading-dots": "ld-dots",
    "count-up": "ty-countup",
    "chart-draw": "dv-line",
    "bar-chart-stagger": "dv-bars",
    "donut-segments": "dv-donut",
    "progress-fill": "ui-progress",
    "hover-lift": "ui-hover",
    "click-ripple": "ui-ripple",
    "accordion-open": "ui-accordion",
    "pointer-tilt": "3d-tilt",
    "drag-snap": "ui-drag",
    "flip-reorder": "ui-reorder",
    "command-palette-open": "ui-cmdk",
    "shared-element": "tr-shared",
    "swipe-dismiss": "ui-swipe",
    "pull-to-refresh": "sc-ptr",
    "pinch-zoom": "sc-pinch",
    "svg-stroke-draw": "sh-draw",
    "svg-path-morph": "sh-morph",
    "svg-trim-path": "sh-trim",
    "svg-motion-path": "sh-follow",
    "checkbox-stroke": "ui-checkbox",
    "scroll-progress": "sc-progress",
    "parallax-layers": "sc-parallax",
    "sticky-pin": "sc-pin",
    "text-scroll-scrub": "sc-wordreveal",
    "flip-card": "3d-flipcard",
    "orbit": "lp-orbit",
    "wobble": "lp-pendulum",
    "badge-pop": "ui-badge",
    "catalog-ui-control-heart-like": "ui-like",
    "particle-burst": "pt-burst",
    "chromatic-split": "lk-chroma",
    "glow-pulse": "lk-glow",
    "catalog-game-impact-fx-hit-stop": "t-hitstop",
    "breathing": "lp-breath"
  };
  library.forEach(item => { if (SAME_AS_ATLAS[item.id]) item.demoId = SAME_AS_ATLAS[item.id]; });

  // 카테고리: 기초(원칙·이징·스프링·타이밍)를 맨 앞에, 영상 계열을 기본 카테고리 뒤에
  const extra = window.MOTION_ATLAS_CATEGORIES || [];
  const byId = id => extra.find(category => category.id === id);
  const head = ['principles', 'easing', 'spring', 'timing'].map(byId).filter(Boolean);
  const afterEffect = ['transitions', 'camera'].map(byId).filter(Boolean);
  const tail = extra.filter(category => !head.includes(category) && !afterEffect.includes(category));
  const effectIndex = categories.findIndex(category => category.id === 'effect');
  categories.splice(effectIndex + 1, 0, ...afterEffect);
  categories.unshift(...head);
  categories.push(...tail);

  library.push(...(window.MOTION_ATLAS_ITEMS || []));

  // 데모가 선언하는 커브명(E의 키 → 표시명)
  const EASE_NAMES = { linear: 'linear', inQuad: 'easeInQuad', outQuad: 'easeOutQuad', inOutQuad: 'easeInOutQuad', inCubic: 'easeInCubic', outCubic: 'easeOutCubic', inOutCubic: 'easeInOutCubic', outQuart: 'easeOutQuart', outQuint: 'easeOutQuint', inSine: 'easeInSine', outSine: 'easeOutSine', sine: 'easeInOutSine', outCirc: 'easeOutCirc', smooth: 'smoothstep', outExpo: 'easeOutExpo', inExpo: 'easeInExpo', inOut: 'easeInOutCubic', house: 'cubic-bezier(.83,0,.17,1)', whip: 'cubic-bezier(.9,0,.1,1)', glide: 'cubic-bezier(.4,0,.2,1)', outBack: 'easeOutBack', inBack: 'easeInBack', inOutBack: 'easeInOutBack', quint: 'easeOutQuint', md3: 'Material 3 standard', md3Emph: 'Material 3 emphasized', md3Acc: 'Material 3 accelerate', apple: 'ease', elastic: 'easeOutElastic', bounce: 'easeOutBounce' };
  const easingName = demo => {
    if (demo.spring) return `spring(${demo.spring.map(v => +(+v).toFixed(2)).join(', ')})`;
    if (demo.bez) return `cubic-bezier(${demo.bez.join(',')})`;
    if (typeof demo.ease === 'string') return EASE_NAMES[demo.ease] || demo.ease;
    return null;
  };

  // 루프의 길이(데모의 주기)와 움직임 그 자체의 길이를 나눠 가짐
  library.forEach(item => {
    const demo = window.ATLAS && window.ATLAS.get(item.demoId || item.id);
    if (!demo || item.motionDuration) return;
    item.motionDuration = item.duration;
    item.duration = Math.round(demo.dur * 1000);
    if (demo.ref && (item.catalogFamily || !item.easing || item.easing === 'linear')) { const name = easingName(demo); if (name) item.easing = name; }
    item.reduced = item.reduced || '움직임을 멈추고 내용이 읽히는 대표 컷을 표시한다.';
  });
})();
