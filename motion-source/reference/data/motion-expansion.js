(() => {
  const c = (key, ko, en, glyph, haptic = false) => ({ key, ko, en, glyph, haptic });
  // 목적격 조사 — 받침 있으면 '을', 없으면 '를'
  const obj = s => /[가-힣]$/.test(String(s)) && (String(s).charCodeAt(s.length - 1) - 44032) % 28 !== 0 ? '을' : '를';

  const families = [
    {
      id: "ui-button", label: "UI 버튼", labelEn: "UI Buttons", icon: "pointer", family: "button",
      trigger: "누름·길게 누르기·완료", triggerEn: "Press, hold, or completion", inputs: ["터치", "마우스", "키보드"], inputsEn: ["Touch", "Pointer", "Keyboard"],
      concepts: [
        c("bounce-press", "바운스 프레스", "Bounce Press", "TAP", true), c("jelly-squash", "젤리 스쿼시", "Jelly Squash", "JELLY", true),
        c("tap-ripple", "탭 리플", "Tap Ripple", "RIPPLE", true), c("pulse-glow", "펄스 글로우", "Pulse Glow", "PULSE", true),
        c("error-shake", "에러 셰이크", "Error Shake", "ERROR", true), c("fill-sweep", "필 스윕", "Fill Sweep", "FILL", true),
        c("send-morph", "전송 모프", "Send Morph", "SEND", true), c("push-3d", "3D 푸시", "3D Push", "PUSH", true),
        c("confetti-burst", "색종이 버스트", "Confetti Burst", "YEAH", true), c("hold-confirm", "길게 눌러 확정", "Hold to Confirm", "HOLD", true),
        c("border-draw", "보더 드로우", "Border Draw", "TRACE", true), c("shine-sweep", "샤인 스윕", "Shine Sweep", "SHINE", true),
        c("loading-success", "로딩에서 성공", "Loading to Success", "DONE", true), c("icon-swap", "아이콘 스왑", "Icon Swap", "SWAP", true),
        c("heartbeat", "하트비트", "Heartbeat", "LOVE", true), c("wobble-tilt", "워블 틸트", "Wobble Tilt", "WOBBLE", true),
        c("elastic-drag", "엘라스틱 드래그", "Elastic Drag", "DRAG", true), c("inner-press", "이너 프레스", "Inner Press", "PRESS", true),
        c("color-splash", "컬러 스플래시", "Color Splash", "COLOR", true), c("breathing-gradient", "호흡 그라디언트", "Breathing Gradient", "AURORA", true)
      ]
    },
    {
      id: "ui-control", label: "선택·컨트롤", labelEn: "Selection & Controls", icon: "form", family: "control",
      trigger: "선택·상태 전환", triggerEn: "Selection or state change", inputs: ["터치", "마우스", "키보드"], inputsEn: ["Touch", "Pointer", "Keyboard"],
      concepts: [
        c("spring-switch", "스프링 스위치", "Springy Switch", "ON", true), c("day-night", "낮과 밤 토글", "Day and Night", "DAY", true),
        c("liquid-stretch", "리퀴드 스트레치", "Liquid Stretch", "LIQ", true), c("check-draw", "체크 드로우", "Check Draw", "CHECK", true),
        c("heart-like", "하트 좋아요", "Heart Like", "LIKE", true), c("lock-unlock", "잠금 해제", "Lock and Unlock", "LOCK", true),
        c("mute-pop", "뮤트 팝", "Mute Pop", "MUTE", true), c("play-pause", "재생 정지 모프", "Play and Pause", "PLAY", true),
        c("sliding-underline", "슬라이딩 언더라인", "Sliding Underline", "TAB", true), c("pill-indicator", "필 인디케이터", "Pill Indicator", "PILL", true),
        c("bubble-expand", "버블 확장", "Bubble Expand", "BUBBLE", true), c("jumping-dot", "점프 도트", "Jumping Dot", "DOT", true),
        c("liquid-blob", "리퀴드 블롭", "Liquid Blob", "BLOB", true), c("tint-shift", "틴트 시프트", "Tint Shift", "TINT", true)
      ]
    },
    {
      id: "ui-navigation", label: "내비·오버레이", labelEn: "Navigation & Overlays", icon: "layout", family: "navigation",
      trigger: "화면·위계 전환", triggerEn: "View or hierarchy change", inputs: ["터치", "마우스", "키보드"], inputsEn: ["Touch", "Pointer", "Keyboard"],
      concepts: [
        c("hero-expand", "히어로 확장", "Hero Expand", "HERO", true), c("spring-sheet", "스프링 시트", "Spring Sheet", "SHEET", true),
        c("card-flip", "카드 플립", "Card Flip", "FLIP", true), c("circular-reveal", "원형 리빌", "Circular Reveal", "REVEAL", true),
        c("parallax-push", "패럴랙스 푸시", "Parallax Push", "PUSH", true), c("staggered-reveal", "단계 리빌", "Staggered Reveal", "STEPS", true)
      ]
    },
    {
      id: "ui-loading", label: "로더·진행률", labelEn: "Loading & Progress", icon: "data", family: "loading",
      trigger: "대기·처리 진행", triggerEn: "Waiting or processing progress", inputs: ["자동"], inputsEn: ["Automatic"],
      concepts: [
        c("bouncing-dots", "바운딩 도트", "Bouncing Dots", "•••", true), c("gradient-arc", "그라데이션 아크", "Gradient Arc", "ARC", true),
        c("progress-success", "진행도에서 성공", "Progress to Success", "100", true), c("skeleton-shimmer", "스켈레톤 시머", "Skeleton Shimmer", "LOAD", true),
        c("typing-indicator", "입력 인디케이터", "Typing Indicator", "TYPE", true), c("equalizer-bars", "이퀄라이저 바", "Equalizer Bars", "EQ", true),
        c("orbit-trail", "오빗 트레일", "Orbit Trail", "ORBIT", true)
      ]
    },
    {
      id: "ui-feedback", label: "알림·리액션", labelEn: "Feedback & Reactions", icon: "focus", family: "feedback",
      trigger: "성공·평가·리액션", triggerEn: "Success, rating, or reaction", inputs: ["터치", "마우스", "자동"], inputsEn: ["Touch", "Pointer", "Automatic"],
      concepts: [
        c("heart-burst", "하트 버스트", "Heart Burst", "♥", true), c("star-rating", "별 평점", "Star Rating", "★", true),
        c("clap-counter", "박수 카운터", "Clap Counter", "+1", true), c("emoji-bar", "이모지 바", "Emoji Bar", "WOW", true),
        c("number-ticker", "숫자 티커", "Number Ticker", "128", true), c("confetti-rain", "색종이 레인", "Confetti Rain", "NICE", true)
      ]
    },
    {
      id: "game-hud", label: "게임 HUD", labelEn: "Game HUD", icon: "grid", family: "hud",
      trigger: "값·대상·위치 갱신", triggerEn: "Value, target, or position update", inputs: ["자동", "게임 입력"], inputsEn: ["Automatic", "Game input"],
      concepts: [
        c("coin-collect", "코인 획득", "Coin Collect", "+25", true), c("hp-ghost-bar", "HP 고스트 바", "HP Ghost Bar", "HP", true),
        c("cooldown-ability", "쿨다운", "Cooldown Ability", "CD", true), c("score-rollup", "스코어 롤업", "Score Roll-up", "999", true),
        c("stamina-pulse", "스태미나 맥동", "Stamina Pulse", "SP"), c("ammo-reload", "탄약 리로드", "Ammo Reload", "12/30"),
        c("compass-lock", "컴퍼스 록", "Compass Lock", "N 45"), c("minimap-ping", "미니맵 핑", "Minimap Ping", "PING"),
        c("objective-marker", "목표 마커", "Objective Marker", "OBJ"), c("resource-cap", "자원 상한 경고", "Resource Cap", "MAX"),
        c("party-status", "파티 상태", "Party Status", "TEAM"), c("buff-timer", "버프 타이머", "Buff Timer", "BUFF")
      ]
    },
    {
      id: "game-combat", label: "전투·히트 표현", labelEn: "Combat & Hit FX", icon: "wave", family: "combat",
      trigger: "공격·방어·명중", triggerEn: "Attack, defense, or hit", inputs: ["게임 입력", "자동"], inputsEn: ["Game input", "Automatic"],
      concepts: [
        c("damage-numbers", "대미지 수치", "Damage Numbers", "-248", true), c("combo-counter", "콤보 카운터", "Combo Counter", "12 HIT", true),
        c("critical-flash", "크리티컬 플래시", "Critical Flash", "CRIT", true), c("hit-confirm", "히트 확인", "Hit Confirm", "HIT"),
        c("guard-break", "가드 브레이크", "Guard Break", "BREAK"), c("perfect-dodge", "저스트 회피", "Perfect Dodge", "DODGE"),
        c("parry-window", "패리 성공", "Parry Window", "PARRY"), c("status-ailment", "상태 이상 부여", "Status Ailment", "POISON")
      ]
    },
    {
      id: "game-reward", label: "보상·획득 연출", labelEn: "Rewards & Loot", icon: "light", family: "reward",
      trigger: "획득·개봉·달성", triggerEn: "Earn, open, or achieve", inputs: ["게임 입력", "자동"], inputsEn: ["Game input", "Automatic"],
      concepts: [
        c("level-up", "레벨업", "Level Up Burst", "LEVEL UP", true), c("chest-open", "보물상자 열기", "Chest Open", "OPEN", true),
        c("three-star", "별 셋 클리어", "Three Star Clear", "★★★", true), c("gacha-pull", "가챠 배출", "Gacha Pull", "SSR", true),
        c("new-record", "신기록 스탬프", "New Record Stamp", "NEW", true), c("loot-rarity", "희귀도 확정", "Loot Rarity", "EPIC"),
        c("achievement", "업적 해제", "Achievement Unlock", "UNLOCK"), c("daily-bonus", "데일리 보너스", "Daily Bonus", "DAY 7"),
        c("currency-rain", "통화 레인", "Currency Rain", "+500"), c("reward-card", "보상 카드 공개", "Reward Card Reveal", "CARD")
      ]
    },
    {
      id: "game-progress", label: "성장·퀘스트", labelEn: "Progression & Quests", icon: "arrow", family: "progress",
      trigger: "성장·해방·진행 갱신", triggerEn: "Growth, unlock, or progress update", inputs: ["게임 입력", "자동"], inputsEn: ["Game input", "Automatic"],
      concepts: [
        c("quest-banner", "퀘스트 배너", "Quest Banner", "QUEST", true), c("skill-unlock", "스킬 해방", "Skill Unlock", "SKILL", true),
        c("login-streak", "연속 로그인", "Login Streak", "7 DAYS", true), c("energy-refill", "에너지 회복", "Energy Refill", "FULL", true),
        c("xp-overflow", "XP 올림", "XP Overflow", "XP"), c("battle-pass", "배틀패스 진행", "Battle Pass", "TIER 8"),
        c("mission-step", "미션 단계", "Mission Step", "3/5"), c("rank-up", "랭크 승급", "Rank Up", "RANK A"),
        c("collection-complete", "수집 컴플리트", "Collection Complete", "100%")
      ]
    },
    {
      id: "game-cinematic", label: "게임 연출·경고", labelEn: "Game Cinematics", icon: "fx", family: "cinematic",
      trigger: "이벤트·경고·국면 전환", triggerEn: "Event, warning, or phase change", inputs: ["자동", "게임 입력"], inputsEn: ["Automatic", "Game input"],
      concepts: [
        c("lucky-roulette", "럭키 룰렛", "Lucky Roulette", "LUCK", true), c("countdown-go", "카운트다운GO", "Countdown GO!", "GO!", true),
        c("boss-warning", "보스 경고", "Boss Warning", "WARNING", true), c("victory-title", "승리 타이틀", "Victory Title", "VICTORY"),
        c("defeat-dissolve", "패배 디졸브", "Defeat Dissolve", "DEFEAT"), c("chapter-intro", "챕터 도입", "Chapter Intro", "CHAPTER 4"),
        c("raid-start", "레이드 시작", "Raid Start", "RAID"), c("letterbox-focus", "시네마 밴드 포커스", "Letterbox Focus", "SCENE")
      ]
    }
  ];

  const experimentalFamilies = [
    {
      id: "ui-spatial", label: "공간 UI·깊이", labelEn: "Spatial UI & Depth", icon: "expand", family: "spatial",
      trigger: "포인터·포커스·계층 이동", triggerEn: "Pointer, focus, or hierarchy movement", inputs: ["터치", "마우스", "키보드"], inputsEn: ["Touch", "Pointer", "Keyboard"],
      concepts: [
        c("cursor-depth-pull", "커서 깊이 풀", "Cursor Depth Pull", "DEPTH"), c("focus-portal", "포커스 포털", "Focus Portal", "PORTAL"),
        c("radial-command-bloom", "방사 커맨드 블룸", "Radial Command Bloom", "MENU"), c("spatial-breadcrumb", "공간 브레드크럼", "Spatial Breadcrumb", "PATH"),
        c("perspective-dock", "원근 독", "Perspective Dock", "DOCK"), c("layer-peel", "레이어 필", "Layer Peel", "PEEL"),
        c("tooltip-orbit", "툴팁 궤도", "Tooltip Orbit", "TIP"), c("depth-lens", "깊이 렌즈", "Depth Lens", "LENS"),
        c("magnetic-constellation", "자기 컨스텔레이션", "Magnetic Constellation", "NODES"), c("infinite-canvas-jump", "무한 캔버스 점프", "Infinite Canvas Jump", "JUMP"),
        c("z-notification", "Z축 알림", "Z-axis Notification", "NOTICE"), c("camera-dolly-ui", "카메라 돌리 UI", "Camera Dolly UI", "DOLLY"),
        c("volumetric-menu", "볼류메트릭 메뉴", "Volumetric Menu", "VOLUME"), c("parallax-inspector", "패럴랙스 검사면", "Parallax Inspector", "LAYERS"),
        c("spatial-search", "공간 검색 리빌", "Spatial Search Reveal", "SEARCH"), c("orbit-context", "궤도 컨텍스트 메뉴", "Orbiting Context Menu", "CONTEXT"),
        c("depth-stack-reorder", "깊이 스택 재정렬", "Depth Stack Reorder", "STACK"), c("calendar-fold", "원근 캘린더 폴드", "Perspective Calendar Fold", "DATE"),
        c("cursor-raycast", "커서 레이캐스트 선택", "Cursor Raycast Select", "SELECT"), c("spatial-audio-locator", "공간 오디오 로케이터", "Spatial Audio Locator", "AUDIO")
      ]
    },
    {
      id: "ui-material", label: "질감·머티리얼 변형", labelEn: "Material & Surface Motion", icon: "light", family: "material",
      trigger: "선택·접촉·상태 변화", triggerEn: "Selection, contact, or state change", inputs: ["터치", "마우스", "자동"], inputsEn: ["Touch", "Pointer", "Automatic"],
      concepts: [
        c("liquid-tab-bridge", "액체 탭 브리지", "Liquid Tab Bridge", "LIQUID"), c("gel-button-split", "젤 버튼 분열", "Gel Button Split", "GEL"),
        c("glass-refraction", "유리 굴절 호버", "Glass Refraction Hover", "GLASS"), c("ink-adhesion", "잉크 흡착", "Ink Adhesion", "INK"),
        c("metallic-foil", "메탈릭 호일 틸트", "Metallic Foil Tilt", "FOIL"), c("soft-body-toggle", "소프트 바디 토글", "Soft Body Toggle", "SOFT"),
        c("viscous-progress", "점성 프로그레스", "Viscous Progress", "FLOW"), c("chromatic-glass-edge", "색 분산 유리 엣지", "Chromatic Glass Edge", "PRISM"),
        c("paper-fold", "페이퍼 폴드", "Paper Fold Reveal", "FOLD"), c("cloth-wave", "크로스 웨이브 패널", "Cloth Wave Panel", "CLOTH"),
        c("bubble-merge", "버블 결합 메뉴", "Bubble Merge Menu", "MERGE"), c("frost-melt", "프로스트 용해 언락", "Frost Melt Unlock", "MELT"),
        c("membrane-press", "멤브레인 프레스", "Elastic Membrane Press", "PRESS"), c("sand-dissolve", "모래 상태 전환", "Sand Dissolve State", "SAND"),
        c("oil-slick", "오일 슬릭 선택", "Oil Slick Selection", "SLICK"), c("magnetic-fluid", "자성유체 배지", "Magnetic Fluid Badge", "FERRO"),
        c("glass-crack-recover", "유리 균열 리커버", "Glass Crack Recover", "CRACK"), c("neon-tube-draw", "네온관 드로우", "Neon Tube Draw", "NEON"),
        c("chrome-ripple", "크롬 면 리플", "Chrome Ripple Surface", "CHROME"), c("clay-icon-morph", "클레이 아이콘 모프", "Clay Morph Icon", "CLAY")
      ]
    },
    {
      id: "kinetic-type", label: "키네틱 문자", labelEn: "Kinetic Typography", icon: "text", family: "typemotion",
      trigger: "제목 표시·값 갱신·스크롤", triggerEn: "Heading reveal, value update, or scroll", inputs: ["자동", "스크롤"], inputsEn: ["Automatic", "Scroll"],
      concepts: [
        c("glyph-slot-roll", "글리프 슬롯 롤", "Glyph Slot Roll", "GLYPH"), c("variable-font-pulse", "가변 폰트 펄스", "Variable Font Pulse", "WEIGHT"),
        c("text-path-orbit", "글자 경로 궤도", "Text Path Orbit", "ORBIT"), c("word-gravity", "단어 중력 낙하", "Word Gravity Drop", "GRAVITY"),
        c("character-magnetize", "글자 마그넷 정렬", "Character Magnetize", "MAGNET"), c("line-break-reflow", "줄바꿈 리플로우", "Line Break Reflow", "REFLOW"),
        c("terminal-decode", "터미널 디코드", "Terminal Decode", "DECODE"), c("counterweight-headline", "카운터웨이트 제목", "Counterweight Headline", "BALANCE"),
        c("echo-caption", "에코 트레일 자막", "Echo Trail Caption", "ECHO"), c("kinetic-kerning", "키네틱 커닝", "Kinetic Kerning", "KERN"),
        c("vertical-type-cascade", "세로 조합 캐스케이드", "Vertical Type Cascade", "VERTICAL"), c("baseline-wave", "베이스라인 웨이브", "Masked Baseline Wave", "WAVE"),
        c("letter-collision", "글자 충돌 바운스", "Letter Collision Bounce", "COLLIDE"), c("type-tunnel", "글자 원근 터널", "Perspective Type Tunnel", "TUNNEL"),
        c("chapter-index-scrub", "장 번호 스크럽", "Scrubbed Chapter Index", "CH.04"), c("type-hinge", "글자 힌지 플립", "Type Hinge Flip", "HINGE"),
        c("focus-word-explosion", "주목 단어 폭발", "Focus Word Explosion", "FOCUS"), c("mono-data-shuffle", "등폭 데이터 셔플", "Monospace Data Shuffle", "0101"),
        c("stroke-catchup", "손글씨 선 따라잡기", "Handwritten Stroke Catch-up", "WRITE"), c("headline-ribbon", "제목 리본 랩", "Headline Ribbon Wrap", "RIBBON")
      ]
    },
    {
      id: "game-impact-fx", label: "게임 순간 FX", labelEn: "Game Impact FX", icon: "fx", family: "impactfx",
      trigger: "명중·경고·결착·보상", triggerEn: "Hit, warning, finisher, or reward", inputs: ["게임 입력", "자동"], inputsEn: ["Game input", "Automatic"],
      concepts: [
        c("hit-stop", "히트스톱 프레임", "Hit-stop Frame", "STOP"), c("shockwave-type", "충격파 타이포", "Shockwave Typography", "BOOM"),
        c("slash-reveal", "방향 슬래시 리빌", "Directional Slash Reveal", "SLASH"), c("freeze-color-drain", "정지 프레임 색 빠짐", "Freeze-frame Color Drain", "FREEZE"),
        c("combo-heat", "콤보 열기 상승", "Combo Heat Escalation", "HEAT"), c("edge-damage", "화면 끝 데미지 맥동", "Screen-edge Damage Pulse", "DANGER"),
        c("armor-crack", "아머 균열망", "Armor Crack Network", "CRACK"), c("critical-compress", "크리티컬 렌즈 압축", "Critical Lens Compression", "CRITICAL"),
        c("phase-shatter", "보스 페이즈 파쇄", "Boss Phase Shatter", "PHASE"), c("speedline-tunnel", "스피드라인 터널", "Speedline Tunnel", "RUSH"),
        c("parry-time-slice", "패리 시간 슬라이스", "Parry Time Slice", "PARRY"), c("element-burst", "속성 어피니티 버스트", "Elemental Affinity Burst", "ELEMENT"),
        c("camera-kick", "카메라 킥 HUD", "Camera Kick HUD", "KICK"), c("afterimage-dash", "잔상 대시", "Afterimage Dash", "DASH"),
        c("victory-hold", "승리 임팩트 홀드", "Victory Impact Hold", "WIN"), c("loot-beam", "루트 빔 기둥", "Loot Beam Column", "LOOT"),
        c("warning-stripe", "경고 스트라이프 슬램", "Warning Stripe Slam", "ALERT"), c("shield-recharge", "실드 재충전 스윕", "Shield Recharge Sweep", "SHIELD"),
        c("mission-stamp", "미션 스탬프 펀치", "Mission Stamp Punch", "CLEAR"), c("finisher-cut", "피니셔 타이틀 컷", "Finisher Title Cut", "FINISH")
      ]
    },
    {
      id: "data-story", label: "데이터·스토리텔링", labelEn: "Data Storytelling", icon: "data", family: "datastory",
      trigger: "데이터 갱신·비교·진행", triggerEn: "Data update, comparison, or progress", inputs: ["자동", "스크롤", "마우스"], inputsEn: ["Automatic", "Scroll", "Pointer"],
      concepts: [
        c("sankey-flow", "생키 유량 리빌", "Sankey Flow Reveal", "FLOW"), c("odometer-cascade", "지표 오도미터", "Metric Odometer Cascade", "128K"),
        c("threshold-wave", "임계값 알람 파", "Threshold Alarm Wave", "LIMIT"), c("confidence-fog", "예측 신뢰도 포그", "Forecast Confidence Fog", "82%"),
        c("signal-pulse-map", "라이브 신호 펄스맵", "Live Signal Pulse Map", "LIVE"), c("delta-split", "비교 델타 분할", "Comparison Delta Split", "+24"),
        c("timeline-trail", "타임라인 궤적", "Timeline Scrub Trail", "TIME"), c("topology-bloom", "네트워크 토폴로지 전개", "Network Topology Bloom", "NODES"),
        c("milestone-firefly", "진행도 마일스톤 반딧불", "Progress Milestone Firefly", "75%"), c("heatmap-ripple", "히트맵 주목 파동", "Heatmap Ripple Focus", "HOT"),
        c("stream-breathe", "스트림 그래프 호흡", "Stream Graph Breathing", "STREAM"), c("rank-ladder", "순위 사다리 상승", "Rank Ladder Climb", "#03"),
        c("cluster-merge", "데이터 클러스터 결합", "Data Cluster Merge", "MERGE"), c("event-domino", "이벤트열 도미노", "Event Sequence Domino", "EVENT"),
        c("kpi-relay", "KPI 스포트라이트 릴레이", "KPI Spotlight Relay", "KPI"), c("budget-bloom", "방사 예산 블룸", "Radial Budget Bloom", "BUDGET"),
        c("calendar-density", "캘린더 밀도 스윕", "Calendar Density Sweep", "WEEK"), c("queue-compress", "라이브 큐 압축", "Live Queue Compression", "QUEUE"),
        c("sentiment-spectrum", "감정 스펙트럼 전환", "Sentiment Spectrum Shift", "MOOD"), c("goal-projection", "목표 예측 아크", "Goal Projection Arc", "GOAL")
      ]
    }
  ];

  const allFamilies = [...families, ...experimentalFamilies];

  const treatments = [
    { key: "precise", ko: "정밀", en: "Precise", descriptionKo: "짧은 이동과 명확한 정지로 정보를 최우선으로 하는", descriptionEn: "prioritizes information with short travel and a clean stop", duration: 560, easing: "easeOutCubic", feeling: "경쾌함", curve: "out", accent: "cyan", cueKo: "가벼운 선택감", cueEn: "Light selection", cost: "가벼움", costEn: "Light" },
    { key: "spring", ko: "스프링", en: "Spring", descriptionKo: "눌러 넣음과 오버슈트로 접촉한 반발을 전달하는", descriptionEn: "uses compression and overshoot to suggest tactile rebound", duration: 820, easing: "easeOutBack", feeling: "바운스", curve: "outBack", accent: "purple", cueKo: "부드러운 반발", cueEn: "Soft rebound", cost: "가벼움", costEn: "Light" },
    { key: "impact", ko: "임팩트", en: "Impact", descriptionKo: "예비 동작·충격·감쇠를 분리해 게임풍 강렬함을 만드는", descriptionEn: "separates anticipation, impact, and decay for game-like force", duration: 980, easing: "easeOutExpo", feeling: "무거움", curve: "impact", accent: "coral", cueKo: "딱딱한 충격", cueEn: "Rigid impact", cost: "표준", costEn: "Moderate" },
    { key: "luminous", ko: "루미너스", en: "Luminous", descriptionKo: "윤곽광·주사광·잔광으로 상태의 가치를 높이는", descriptionEn: "adds edge light, scanning highlights, and afterglow to raise perceived value", duration: 1280, easing: "easeInOutCubic", feeling: "부드러움", curve: "inOut", accent: "yellow", cueKo: "상승하는 성공감", cueEn: "Rising success", cost: "드로잉 주의", costEn: "Paint-sensitive" },
    { key: "kinetic", ko: "키네틱", en: "Kinetic", descriptionKo: "궤도·추종·단계 지연으로 화면 안의 흐름을 시각화하는", descriptionEn: "visualizes screen flow with paths, follow-through, and stagger", duration: 1160, easing: "easeInOutCubic", feeling: "부드러움", curve: "inOut", accent: "purple", cueKo: "연속되는 리듬", cueEn: "Sequenced rhythm", cost: "표준", costEn: "Moderate" }
  ];

  const categoryTips = {
    button: ["누름과 반응 시작을 같은 프레임에 맞춘다", "완료 상태에서는 라벨과 역할이 읽히는 형태로 되돌린다", "연타해도 이전 여운이 조작을 방해하지 않게 한다"],
    control: ["선택 전후의 위치 관계를 유지한 채 상태를 잇는다", "색뿐 아니라 형태와 위치로도 선택 상태를 표시한다", "키보드 조작 때도 같은 피드백을 돌려준다"],
    navigation: ["전환 전과 후의 공통 요소를 시선 단서로 활용한다", "전진과 뒤로 가기 조작에서 공간 방향을 올바르게 반전", "포커스 이동은 시각 연출과 별도로 보장"],
    loading: ["실제 진행이 없을 때는 확정값처럼 보이게 하지 않는다", "대기에서 완료로 정지 상태를 명확히 전환한다", "상시 루프되는 그리기 면적과 요소 수를 억제"],
    feedback: ["원인이 되는 입력 근처에서 반응을 시작", "성공·실패·평가를 색 이외의 형태로도 구별한다", "반복할수록 연출을 약하게 할 수 있도록 설계한다"],
    hud: ["플레이 중 주변시야에서도 변화량을 판별할 수 있게 한다", "숫자와 게이지 갱신 타이밍을 일치시킨다", "상시 움직이는 요소를 중요한 값만으로 한정"],
    combat: ["명중 프레임과 시각적 충격점을 일치시킨다", "강약을 크기뿐 아니라 속도와 감쇠로도 나눈다", "연속 발생 시 수치와 이펙트가 겹치지 않게 한다"],
    reward: ["희소도별로 예비 동작과 정지 시간을 단계화한다", "보상 이름을 읽을 수 있는 정지 프레임을 충분히 확보", "스킵해도 획득 결과가 사라지지 않게 한다"],
    progress: ["현재값·증가량·다음 목표를 하나의 흐름으로 보여준다", "여러 보상은 중요도 순으로 단계 표시한다", "긴 성장 연출에는 단축 또는 스킵을 준비한다"],
    cinematic: ["조작 불능이 되는 시간을 연출 전에 명확히 구분한다", "경고와 타이틀은 최종 프레임에서 반드시 읽히게 한다", "반복해서 보는 장면에는 축약판을 준비한다"],
    spatial: ["깊이 방향을 화면 계층이나 조작 대상과 일치시킨다", "원근 변형 중에도 글자가 읽히는 각도로 제한한다", "움직임 줄이기 설정에서는 평면 페이드로 대체"],
    material: ["소재다운 변형 속도와 복원 속도를 나눠 설계한다", "흐림과 합성은 대상 면적을 작게 유지한다", "질감 효과 뒤에도 조작 상태를 형태로 판별할 수 있게 한다"],
    typemotion: ["읽는 순서와 글자 출현 순서를 일치시킨다", "제목을 읽을 수 있는 정지 시간을 움직임보다 길게 확보한다", "본문이나 중요 정보에서는 변형량을 작게 한다"],
    impactfx: ["충격의 원인과 최대 변형 프레임을 일치시킨다", "백플래시나 흔들림은 짧게 한 번만 사용한다", "연속 발생 시 강도를 자동으로 낮춘다"],
    datastory: ["데이터 증감 방향과 시각적 이동 방향을 맞춘다", "장식이 아니라 비교 대상과 변화량을 먼저 읽게 한다", "실값이 없는 구간을 확정 진행처럼 보이게 하지 않는다"]
  };

  const expansionCategories = allFamilies.map(({ id, label, labelEn, icon }) => ({ id, label, labelEn, icon }));
  window.MOTION_CATEGORIES.push(...expansionCategories);

  const treatmentFor = (concept, family, action) => {
    const key = concept.key;
    if (/glow|shine|gradient|foil|glass|prism|neon|beam|spectrum|firefly|signal|loot|rarity|gacha|aurora|frost/.test(key)) return treatments[3];
    if (/impact|critical|damage|break|crack|slam|hit-|shockwave|warning|stamp|finisher|victory|boss|camera-kick|color-drain/.test(key)) return treatments[2];
    if (/spring|bounce|jelly|liquid|gel|soft-body|membrane|bubble|heartbeat|wobble|elastic|cloth|ripple/.test(key)) return treatments[1];
    if (/drag|sweep|orbit|path|parallax|dolly|trail|dash|flow|scrub|cascade|tunnel|reorder|roll|roulette|line|wave/.test(key)) return treatments[4];
    return treatments[(action + family.family.length) % treatments.length];
  };

  const expanded = [];
  let motionSeed = 0;
  allFamilies.forEach(family => {
    family.concepts.forEach((concept, action) => {
      const treatment = treatmentFor(concept, family, action);
      const key = `${family.id}-${concept.key}`;
      const seed = motionSeed++;
      const duration = treatment.duration + ((seed * 47) % 260) - 80;
      const isGame = family.id.startsWith("game-") || family.family === "impactfx";
      const isExperimental = experimentalFamilies.includes(family);
      const sourceKo = concept.haptic ? "HapticLab 이식" : isExperimental ? "웹 표현 추가" : "웹용 추가 설계";
      const sourceEn = concept.haptic ? "Ported from HapticLab" : isExperimental ? "Web expression study" : "Designed for web";
      expanded.push({
        id: `catalog-${key}`,
        category: family.id,
        title: concept.ko,
        titleEn: concept.en,
        pattern: `catalog-${key}`,
        duration,
        easing: treatment.easing,
        feelings: [treatment.feeling],
        usages: isGame ? ["UI", "3D"] : family.family === "typemotion" ? ["UI", "텍스트"] : ["UI"],
        description: `${concept.ko}${obj(concept.ko)} ${treatment.descriptionKo} 고유한 모션 레퍼런스.`,
        descriptionEn: `A distinct ${concept.en} motion study that ${treatment.descriptionEn}.`,
        accent: treatment.accent,
        featured: false,
        focus: `${concept.ko}에서는 움직임의 시작점·최대 변화·정지까지의 3단계가 다른 예와 다른 고유 리듬을 이루는 점을 본다.`,
        focusEn: `In ${concept.en}, watch the unique rhythm across origin, peak change, and final resting state rather than a reused preset.`,
        caution: `${concept.ko}${obj(concept.ko)} 구현할 때는 같은 화면의 다른 요소에 같은 궤도나 강도를 반복하지 않고 이 대상만의 의미로 한정한다.`,
        cautionEn: `When implementing ${concept.en}, reserve its path and intensity for this meaning instead of repeating the same motion across nearby elements.`,
        tips: categoryTips[family.family],
        tipsEn: [
          `Align the ${concept.en} response with the event that caused it`,
          `Keep this distinct motion signature readable at compact UI sizes`,
          `Resolve ${concept.en} into a stable state before the next input`
        ],
        recipe: `signature/${family.family}/${concept.key} · seed ${seed} · ${duration}ms · peak ${42 + seed % 24}% · settle ${76 + seed % 18}%`,
        curve: treatment.curve,
        trigger: family.trigger,
        triggerEn: family.triggerEn,
        tech: treatment.key === "luminous" || ["material", "impactfx"].includes(family.family) ? ["CSS", "WAAPI", "Compositing"] : ["CSS Transform", "WAAPI"],
        cost: treatment.cost,
        costEn: treatment.costEn,
        inputs: family.inputs,
        inputsEn: family.inputsEn,
        reduced: `${concept.ko}의 이동·점멸·반복을 생략하고 의미가 전해지는 최종 상태를 150ms의 페이드로 바로 표시한다.`,
        reducedEn: `Remove travel, flashing, and repetition from ${concept.en}; reveal its meaningful final state with a 150ms fade.`,
        sourceLabel: sourceKo,
        sourceLabelEn: sourceEn,
        hapticCue: treatment.cueKo,
        hapticCueEn: treatment.cueEn,
        catalogFamily: family.family,
        catalogAction: action,
        catalogTreatment: treatment.key,
        catalogGlyph: concept.glyph,
        catalogConcept: concept.key,
        motionSeed: seed,
        motionSignature: `${family.family}/${concept.key}`
      });
    });
  });

  if (expanded.length !== 200) throw new Error(`Motion expansion must contain 200 distinct items, found ${expanded.length}`);
  window.MOTION_LIBRARY.push(...expanded);
})();
