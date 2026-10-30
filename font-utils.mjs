export function filterFontFamilies(families,query='',category='all'){
 const q=query.trim().toLocaleLowerCase();
 return families.filter(f=>(category==='all'||f.category===category)&&[f.name,f.ko,f.alias,f.subtype,f.role,f.tagline,...f.features].join(' ').toLocaleLowerCase().includes(q));
}
export function missingFontCharacters(text,ranges){
 return [...new Set([...text].filter(c=>!/^\s$/u.test(c)&&!ranges.some(([a,b])=>c.codePointAt(0)>=a&&c.codePointAt(0)<=b)))];
}
export function selectFontWeight(weights,requested=400){return weights.includes(Number(requested))?Number(requested):weights.includes(400)?400:weights[0];}
export function fontPreviewText(family,text,{custom=false,compare=false}={}){
 return custom||compare||family.category!=='mono'?text:'const KLIC = 2026; 0O 1Il {} []';
}
