import {BLOCK_CANONICAL_ALIASES} from './canonical-aliases.mjs';
import {SITE_ORIGIN} from './integrations/klic.mjs';
import {normalizePreferences} from './preferences.mjs';
import {translateText} from './i18n.mjs';
export function filterBlocks(blocks,{query='',collection='all',category='all',availability='live'}={}) {
 const q=query.trim().toLocaleLowerCase();
 return blocks.filter(b=>(collection==='all'||b.collection===collection)&&(category==='all'||b.categoryId===category)&&(availability==='all'||(availability==='planned'?!b.implemented:b.implemented))&&(!q||[b.id,b.title,b.catalogTitle,b.description,b.categoryName,...(b.tags||[])].flatMap(value=>[value,translateText(value)]).join(' ').toLocaleLowerCase().includes(q)));
}
export function blockCategoryOptions(data,{collection='all',availability='live'}={}){
 return data.categories.filter(c=>collection==='all'||c.collection===collection).map(c=>{
  const items=data.blocks.filter(b=>b.collection===c.collection&&b.categoryId===c.id),ready=items.filter(b=>b.implemented).length,planned=items.length-ready;
  return {...c,ready,planned,count:availability==='planned'?planned:availability==='all'?items.length:ready};
 }).filter(c=>c.count>0);
}
export function paginateBlocks(items,page=1,size=12){const n=Math.max(1,Math.floor(Number(size)||12)),pages=Math.max(1,Math.ceil(items.length/n)),p=Math.max(1,Math.min(pages,Math.floor(Number(page)||1)));return {items:items.slice((p-1)*n,p*n),page:p,pages,total:items.length};}
export function normalizeBlockContext(c={}){return {...normalizePreferences(c),theme:c.theme==='dark'?'dark':'light',brand:c.brand==='b'?'b':'a',font:['paperlogy','pretendard','spoqa'].includes(c.font)?c.font:'paperlogy',density:['compact','normal','relaxed'].includes(c.density)?c.density:'normal'};}
export function blockPreviewURL(id,context={}){if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))throw new Error('Invalid block ID');return './block-runtime/index.html?'+new URLSearchParams({id,...normalizeBlockContext(context)});}

export function blockShareURL(id){if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))throw new Error('Invalid block ID');return SITE_ORIGIN+'/share/block/'+(BLOCK_CANONICAL_ALIASES[id]||id);}
export function blockMarkdown(block){return `# ${block.title}\n\n${block.description}\n\n- 분류: ${block.categoryName}\n- ID: ${block.id}\n- KLIC 7 디멘션 · 4계층\n- 샘플 데이터 예제\n\n[실행 미리보기](${blockShareURL(block.id)})`;}
