// Canonical selectable font inventory shared by settings, tokens, previews and package exports.
export const FONT_CATALOG=Object.freeze([
 {id:'paperlogy',name:'Paperlogy',family:'KlicPaperlogy',localOnly:false,assets:[{file:'paperlogy-regular.woff2',weight:400},{file:'paperlogy-semibold.woff2',weight:600},{file:'paperlogy-bold.woff2',weight:700}]},
 {id:'pretendard',name:'Pretendard',family:'KlicPretendard',localOnly:false,assets:[{file:'pretendard-regular.woff2',weight:400}]},
 {id:'spoqa',name:'Spoqa Han Sans Neo',family:'KlicSpoqa',localOnly:false,assets:[{file:'spoqa-han-sans-neo-regular.woff2',weight:400},{file:'spoqa-han-sans-neo-medium.woff2',weight:500},{file:'spoqa-han-sans-neo-bold.woff2',weight:700}]},
 {id:'freesentation',name:'Freesentation',family:'KlicFreesentation',localOnly:false,assets:[{file:'Freesentation-4Regular.ttf',weight:400}]},
 {id:'noto-sans-kr',name:'Noto Sans KR',family:'KlicNotoSansKR',localOnly:false,assets:[{file:'noto-sans-kr-regular.woff2',weight:400}]},
 {id:'nanum-gothic',name:'NanumGothic',family:'KlicNanumGothic',localOnly:false,assets:[{file:'nanumgothic-regular.woff2',weight:400}]},
 {id:'gmarket',name:'Gmarket Sans',family:'KlicGmarket',localOnly:false,assets:[{file:'GmarketSansMedium.otf',weight:400}]},
 {id:'mindeulle',name:'Mindeulleholssi',family:'KlicMindeulle',localOnly:false,assets:[{file:'Hakgyoansim_MindeulleholssiOTFR.otf',weight:400}]},
 {id:'geist-mono',name:'Geist Mono',family:'KlicGeistMono',localOnly:false,assets:[{file:'GeistMono-Regular.woff2',weight:400}]},
 {id:'wanted-sans',name:'Wanted Sans',family:'KlicWantedSans',localOnly:false,assets:[{file:'WantedSans-Regular.woff2',weight:400},{file:'WantedSans-Bold.woff2',weight:700}]},
 {id:'suit',name:'SUIT',family:'KlicSuit',localOnly:false,assets:[{file:'SUIT-Regular.woff2',weight:400},{file:'SUIT-Bold.woff2',weight:700}]},
 {id:'s-core-dream',name:'S-Core Dream',family:'KlicSCoreDream',localOnly:false,assets:[{file:'SCDream5.otf',weight:500},{file:'SCDream6.otf',weight:600}]},
 {id:'nanum-square',name:'NanumSquare',family:'KlicNanumSquare',localOnly:false,assets:[{file:'NanumSquareR.otf',weight:400},{file:'NanumSquareB.otf',weight:700}]}
]);
export const FONT_IDS=Object.freeze(FONT_CATALOG.map(f=>f.id));
export const FONT_NAMES=Object.freeze(Object.fromEntries(FONT_CATALOG.map(f=>[f.id,f.family])));
export const FONT_OPTIONS=FONT_CATALOG.map(f=>[f.id,f.name]);
export const FONT_FILES=FONT_CATALOG.flatMap(f=>f.assets.map(a=>({...a,family:f.family})));
export function fontFaceCSS(prefix='./fonts/'){return FONT_CATALOG.map(f=>f.assets.map(a=>`@font-face{font-family:${f.family};src:url('${prefix}${a.file}') format('${a.file.endsWith('.woff2')?'woff2':a.file.endsWith('.ttf')?'truetype':'opentype'}');font-weight:${a.weight};font-style:normal;font-display:swap;}`).join('\n')).join('\n');}
