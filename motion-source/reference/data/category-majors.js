/* 대분류 층 — 67개 카테고리를 7개 대분류로 묶는다 (텍스트는 소그룹 4개).
   data/text-merge.js 뒤, assets/app.js 앞에 로드. 카테고리 id 가 아래 표에 없으면 "기타"로 떨어지고 콘솔에 경고한다.
   감촉·용도 필터는 대분류를 가로지르는 별도 축이라 건드리지 않는다. */
(() => {
  const categories = window.MOTION_CATEGORIES || [];
  window.MOTION_MAJORS = [
    { id: "backdrop", icon: "wave", label: "배경 모션", labelEn: "Backdrops" },
    { id: "principles", icon: "wave", label: "원칙·타이밍", labelEn: "Principles & Timing" },
    { id: "basic", icon: "frame", label: "기본 모션", labelEn: "Core Motion" },
    { id: "ui", icon: "pointer", label: "UI·웹", labelEn: "UI & Web" },
    { id: "data", icon: "data", label: "데이터·도식", labelEn: "Data & Diagrams" },
    { id: "space", icon: "expand", label: "3D·카메라·질감", labelEn: "3D, Camera & Texture" },
    { id: "game", icon: "fx", label: "게임·연출", labelEn: "Game & Direction" },
    { id: "text", icon: "text", label: "텍스트 모션", labelEn: "Text Motion" },
    { id: "etc", icon: "grid", label: "기타", labelEn: "Other" }
  ];
  window.MOTION_MINORS = [
    { id: "tx-enter", label: "등장·퇴장·교체", labelEn: "Enter, Exit & Swap" },
    { id: "tx-fx", label: "강조·효과", labelEn: "Emphasis & Effects" },
    { id: "tx-space", label: "공간·경로·조작", labelEn: "Space, Path & Input" },
    { id: "tx-info", label: "정보·방송·표기", labelEn: "Info, Broadcast & Script" }
  ];
  const put = (major, ids, minor) => ids.forEach(id => { MAP[id] = { major, minor }; });
  const MAP = {};
  put("principles", ["principles", "easing", "spring", "timing"]);
  put("backdrop", ["backdrop"]);
  put("basic", ["entrance", "move", "scale", "rotate", "reaction", "collection", "attention", "light", "effect", "transitions", "loops"]);
  put("ui", ["ui-button", "ui-control", "ui-navigation", "ui-loading", "ui-feedback", "web-scroll", "web-interaction", "web-layout", "web-feedback", "form-state", "gesture"]);
  put("data", ["svg-path", "svg-diagram", "data-story"]);
  put("space", ["3d-depth", "depth3d", "camera", "look", "ui-material", "ui-spatial"]);
  put("game", ["game-hud", "game-combat", "game-reward", "game-progress", "game-cinematic", "game-impact-fx", "particles", "character", "sound"]);
  put("text", ["tx-reveal", "tx-exit", "tx-swap", "tx-typing"], "tx-enter");
  put("text", ["tx-emphasis", "tx-color-light", "tx-blur", "tx-glitch", "tx-physics"], "tx-fx");
  put("text", ["tx-path", "tx-mask", "tx-depth", "tx-layout", "tx-scroll", "tx-pointer"], "tx-space");
  put("text", ["tx-counter", "tx-caption", "tx-title", "tx-broadcast", "tx-japanese", "tx-variable", "tx-loop"], "tx-info");
  categories.forEach(category => {
    const hit = MAP[category.id];
    if (hit) { category.major = hit.major; if (hit.minor) category.minor = hit.minor; }
    else { category.major = "etc"; console.warn("[category-majors] 미분류 카테고리:", category.id); }
  });
})();
