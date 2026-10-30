import {TIMELINE_BLOCK_EXAMPLES,TIMELINE_ADOPTION} from '../timeline-block-catalog.mjs';
export const timelineMessages=Object.fromEntries([...TIMELINE_BLOCK_EXAMPLES.flatMap(e=>[[e.title,e.enTitle],[e.description,e.enDescription],[e.title+' · KLIC 인터랙티브 시뮬레이션',e.enTitle+' · KLIC interactive simulation']]),...Object.values(TIMELINE_ADOPTION).flat()]);
export const timelineBlockNames=Object.fromEntries(TIMELINE_BLOCK_EXAMPLES.map(e=>[e.id,e.enTitle]));
