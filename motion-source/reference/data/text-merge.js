/* 텍스트 모션(228항목)을 모션 레퍼런스에 통합.
   data/text/items.js·assets/text-bundle.js·data/atlas-merge.js 뒤에 로드.
   - 기존 「텍스트」, '키네틱 문자' 카테고리는 텍스트 모션의 22카테고리로 재정리
   - 같은 움직임이 중복되던 기존 항목은 빼고 구 id는 텍스트 모션 쪽 항목으로 전송(공유 링크용) */
(() => {
  const library = window.MOTION_LIBRARY || [];
  const categories = window.MOTION_CATEGORIES || [];
  const textItems = window.TEXT_MOTION_ITEMS || [];
  const textCategories = window.TEXT_MOTION_CATEGORIES || [];
  const merge = window.TEXT_MOTION_MERGE || { duplicates: {}, keep: {} };
  const aliases = window.MOTION_ALIASES = window.MOTION_ALIASES || {};
  const merged = window.MOTION_MERGED_DEMOS = window.MOTION_MERGED_DEMOS || [];

  // 중복되던 기존 항목 제외
  for (let i = library.length - 1; i >= 0; i--) {
    const target = merge.duplicates[library[i].id];
    if (target) { aliases[library[i].id] = `tx-${target}`; merged.push(library[i].demoId || library[i].id); library.splice(i, 1); }
  }
  // 남기는 기존 항목은 텍스트 모션 카테고리로
  library.forEach(item => { const cat = merge.keep[item.id]; if (cat) item.category = `tx-${cat}`; });

  // 카테고리: 구 「텍스트」, '키네틱 문자'를 빼고 텍스트 모션의 22카테고리를 끝에 모음
  // (사이드바에서는 group: "text" 의 제목 「텍스트 모션」 아래에 나열됨)
  for (let i = categories.length - 1; i >= 0; i--) if (categories[i].id === "text" || categories[i].id === "kinetic-type") categories.splice(i, 1);
  categories.push(...textCategories);

  library.push(...textItems);
})();
