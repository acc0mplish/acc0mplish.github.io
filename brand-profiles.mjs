/** KLIC product expression profiles, based on the library's observed blue identity. */
export const BRAND_PROFILE_KEYS=Object.freeze(['accent','neutral','font','headingFont','radius','density','menuStyle','chartPalette','iconWeight']);
export const BRAND_PROFILES=Object.freeze([
 Object.freeze({id:'core',name:'KLIC Core',label:'균형 있는 기본',description:'제품 화면과 일상 업무에 쓰는 KLIC의 기본 표현입니다.',use:'제품 · 협업 · 일반 업무',accent:'#245FC2',titleSize:2,sectionSize:1.5,settings:Object.freeze({accent:'klic',neutral:'slate',font:'paperlogy',headingFont:'paperlogy',radius:8,density:'normal',menuStyle:'soft',chartPalette:'theme',iconWeight:'regular'})}),
 Object.freeze({id:'studio',name:'KLIC Studio',label:'넓고 선명한 표현',description:'로열 블루와 넉넉한 간격으로 제목과 핵심 행동에 시선을 모읍니다.',use:'브랜드 소개 · 콘텐츠 · 기획',accent:'#2641B9',titleSize:2.25,sectionSize:1.625,settings:Object.freeze({accent:'royal',neutral:'slate',font:'pretendard',headingFont:'paperlogy',radius:16,density:'relaxed',menuStyle:'solid',chartPalette:'theme',iconWeight:'light'})}),
 Object.freeze({id:'data',name:'KLIC Data',label:'정보에 집중',description:'짙은 블루와 정돈된 형태로 많은 데이터를 빠르게 읽습니다.',use:'관리자 · 분석 · 운영 도구',accent:'#1E4C8A',titleSize:1.875,sectionSize:1.375,settings:Object.freeze({accent:'navy',neutral:'slate',font:'pretendard',headingFont:'pretendard',radius:4,density:'compact',menuStyle:'outline',chartPalette:'contrast',iconWeight:'regular'})})
]);
export const BRAND_PROFILE_IDS=Object.freeze(BRAND_PROFILES.map(p=>p.id));
export function getBrandProfile(id){return BRAND_PROFILES.find(p=>p.id===id)||BRAND_PROFILES[0];}
export function brandProfilePatch(id){const profile=getBrandProfile(id);return {brandProfile:profile.id,...profile.settings};}
export function brandProfileModified(preferences={}){const profile=getBrandProfile(preferences.brandProfile);return BRAND_PROFILE_KEYS.some(key=>preferences[key]!==profile.settings[key]);}
export function brandProfileLabel(preferences={}){return getBrandProfile(preferences.brandProfile).name+(brandProfileModified(preferences)?' · 사용자 조정':'');}
export function brandSelectorMarkup(preferences={}){return `<label class="brand-selector">Brand<select data-brand-profile aria-label="브랜드 프로필">${BRAND_PROFILES.map(p=>`<option value="${p.id}" ${p.id===(preferences.brandProfile||'core')?'selected':''}>${p.name}</option>`).join('')}</select></label>`;}

// Upgrade only the exact retired Studio preset. Revision 2 records later manual overrides.
export function migrateBrandProfilePreferences(value={}){
 const retired={brandProfile:'studio',accent:'royal',neutral:'gray',font:'pretendard',headingFont:'paperlogy',radius:16,density:'relaxed',menuStyle:'solid',chartPalette:'blue',iconWeight:'light'};
 return value&&typeof value==='object'&&value.brandProfileRevision!==2&&Object.entries(retired).every(([key,expected])=>value[key]===expected)?{...value,neutral:'slate',chartPalette:'theme'}:value;
}
