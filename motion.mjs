import {renderItemDelivery} from './item-delivery.mjs';
import {readMotionFavorites,toggleMotionFavorite,MOTION_FAVORITES_EVENT,MOTION_FAVORITES_STORAGE_KEY} from './motion-favorites.mjs';
import {MOTION_CATALOG,MOTION_CATEGORIES,getMotion} from './motion-catalog.mjs';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=name=>'<i data-lucide="'+name+'" aria-hidden="true"></i>';
const text=(value,locale)=>typeof value==='string'?value:value?.[locale]||value?.ko||'';
const duration=value=>new Intl.NumberFormat('en-US').format(value)+'ms';
const categoryFor=motion=>MOTION_CATEGORIES.find(category=>category.id===motion.category);
const strings=value=>typeof value==='string'?[value]:Array.isArray(value)?value.flatMap(strings):value&&typeof value==='object'?Object.values(value).flatMap(strings):[];
const motionSearchText=(motion,locale)=>[
 motion.id,motion.easing,duration(motion.durationMs),duration(motion.staggerMs||0),
 ...strings(motion.title),...strings(motion.summary),...strings(motion.trigger),
 ...strings(motion.useCases),...strings(motion.cautions),...strings(motion.preview),
 ...strings(categoryFor(motion)?.label)
].join(' ').normalize('NFKC').toLocaleLowerCase(locale==='en'?'en':'ko');

export function selectMotionItems(catalog,{category=null,query='',sort='default',limit=24,cursor='0',locale='ko'}={}){
 const terms=String(query).normalize('NFKC').trim().slice(0,200).toLocaleLowerCase(locale==='en'?'en':'ko').split(/\s+/).filter(Boolean);
 let matches=catalog.filter(motion=>(!category||motion.category===category)&&(!terms.length||terms.every(term=>motionSearchText(motion,locale).includes(term))));
 if(sort==='name-asc')matches=matches.map((motion,index)=>({motion,index})).sort((a,b)=>text(a.motion.title,locale).localeCompare(text(b.motion.title,locale),locale)||a.index-b.index).map(row=>row.motion);
 else if(sort==='duration-asc')matches=matches.map((motion,index)=>({motion,index})).sort((a,b)=>a.motion.durationMs-b.motion.durationMs||a.index-b.index).map(row=>row.motion);
 else if(sort==='duration-desc')matches=matches.map((motion,index)=>({motion,index})).sort((a,b)=>b.motion.durationMs-a.motion.durationMs||a.index-b.index).map(row=>row.motion);
 const pageSize=Number.isInteger(limit)?Math.min(100,Math.max(1,limit)):24;
 const offset=/^\d{1,7}$/.test(String(cursor))?Math.min(Number(cursor),matches.length):0;
 const items=matches.slice(offset,offset+pageSize);
 return {total:matches.length,items,start:offset,nextCursor:offset+items.length<matches.length?String(offset+items.length):null};
}

function motionCard(motion,locale,favorites=readMotionFavorites()){
 const href=`#motion/${esc(motion.id)}`,title=text(motion.title,locale);
 return `<article class="motion-card" data-motion-id="${esc(motion.id)}">
  <div class="motion-card-preview" aria-hidden="true" inert>${previewMarkup(motion,locale)}</div>
  <div class="motion-card-toolbar"><button type="button" class="library-favorite motion-favorite" data-motion-favorite="${esc(motion.id)}" aria-pressed="${favorites.has(motion.id)}" aria-label="${esc(text(motion.title,locale))} ${locale==='en'?'favorite':'즐겨찾기'}">${icon('star')}</button><span class="motion-card-category">${esc(text(categoryFor(motion)?.label,locale))}</span><button type="button" class="motion-card-replay" data-motion-card-replay aria-label="${esc(text(motion.title,locale))} ${locale==='en'?'replay':'다시 재생'}">${icon('rotate-ccw')} ${locale==='en'?'Replay':'재생'}</button></div>
  <h2><a href="${href}" aria-label="${esc(title)} · ${esc(text(motion.summary,locale))}">${esc(title)}</a></h2><p>${esc(text(motion.summary,locale))}</p>
  <div class="motion-card-meta"><span>${duration(motion.durationMs)}</span><code>${esc(motion.easing)}</code></div>
  <a class="motion-card-open" href="${href}">${locale==='en'?'Implementation details':'구현 정보'} ${icon('arrow-up-right')}</a>
 </article>`;
}

function sequencePreview(motion,locale){
 const label=locale==='en'?'Animated content preview':'콘텐츠 모션 미리보기';
 return `<div class="motion-stage is-playing" data-motion-stage data-motion-type="${esc(motion.previewType)}" aria-label="${label}">${motion.preview.items.map((item,index)=>`<div class="motion-step" style="--motion-order:${index}" data-motion-step><span class="motion-step-number">${String(index+1).padStart(2,'0')}</span><span class="motion-step-copy"><strong>${esc(text(item.title,locale))}</strong><small>${esc(text(item.description,locale))}</small></span><i data-lucide="check" aria-hidden="true"></i></div>`).join('')}</div>`;
}

function revealPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-reveal-stage is-playing" data-motion-stage data-motion-type="reveal"><article class="motion-reveal-panel"><span class="motion-reveal-eyebrow">'+esc(text(motion.preview.eyebrow,locale))+'</span><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small><span class="motion-reveal-cover" aria-hidden="true"></span></article></div>';
}

function irisPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-iris-stage is-playing" data-motion-stage data-motion-type="iris"><article class="motion-iris-content"><span class="motion-iris-symbol" aria-hidden="true"></span><span class="motion-iris-label">'+esc(text(motion.preview.label,locale))+'</span><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></article></div>';
}

function focusArrivalPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-focus-stage is-playing" data-motion-stage data-motion-type="focus-arrival"><article class="motion-focus-content"><span class="motion-focus-label">'+esc(text(motion.preview.label,locale))+'</span><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></article></div>';
}

function snapArrivalPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-snap-stage is-playing" data-motion-stage data-motion-type="snap-arrival"><article class="motion-snap-content"><span class="motion-snap-label">'+esc(text(motion.preview.label,locale))+'</span><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></article></div>';
}

function splitRevealPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-split-stage is-playing" data-motion-stage data-motion-type="split-reveal"><article class="motion-split-content"><span class="motion-split-label">'+esc(text(motion.preview.label,locale))+'</span><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small><span class="motion-split-cover is-left" aria-hidden="true"></span><span class="motion-split-cover is-right" aria-hidden="true"></span></article></div>';
}

function trailExitPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-trail-stage is-playing" data-motion-stage data-motion-type="trail-exit"><div class="motion-trail-slot" aria-hidden="true">'+esc(locale==='en'?'Cleared from this list':'목록에서 정리됨')+'</div><article class="motion-trail-card"><span class="motion-trail-label">'+esc(text(motion.preview.label,locale))+'</span><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></article></div>';
}

function foldExitPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-fold-stage is-playing" data-motion-stage data-motion-type="fold-exit"><div class="motion-fold-slot" aria-hidden="true">'+esc(locale==='en'?'Space after removal':'제거 후 남는 자리')+'</div><article class="motion-fold-content"><span class="motion-fold-label">'+esc(text(motion.preview.label,locale))+'</span><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></article></div>';
}

function steadyTravelPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-steady-stage is-playing" data-motion-stage data-motion-type="steady-travel" role="img" aria-label="'+esc(text(motion.preview.label,locale)+' · '+text(motion.preview.title,locale))+'"><div class="motion-steady-track"><span class="motion-steady-marker"></span></div><span class="motion-steady-label">'+esc(text(motion.preview.description,locale))+'</span></div>';
}

function smoothArrivalPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-smooth-stage is-playing" data-motion-stage data-motion-type="smooth-arrival"><div class="motion-smooth-track"><span class="motion-smooth-destination" aria-hidden="true"></span><article class="motion-smooth-card"><span class="motion-smooth-label">'+esc(text(motion.preview.label,locale))+'</span><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></article></div></div>';
}

function arcRoutePreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-arc-stage is-playing" data-motion-stage data-motion-type="arc-route"><figure class="motion-arc-figure" aria-label="'+esc(text(motion.preview.label,locale))+'"><svg viewBox="0 0 240 90" aria-hidden="true"><path d="M 0 72 Q 120 0 240 72"/></svg><span class="motion-arc-marker" aria-hidden="true"></span></figure><span class="motion-arc-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function anticipationMovePreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-anticipation-stage is-playing" data-motion-stage data-motion-type="anticipation-move"><div class="motion-anticipation-track"><span class="motion-anticipation-target" aria-hidden="true"></span><article class="motion-anticipation-card"><span class="motion-anticipation-label">'+esc(text(motion.preview.label,locale))+'</span><strong>'+esc(text(motion.preview.title,locale))+'</strong></article></div><small>'+esc(text(motion.preview.description,locale))+'</small></div>';
}

function weightedLandingPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-weighted-stage is-playing" data-motion-stage data-motion-type="weighted-landing" role="img" aria-label="'+esc(text(motion.preview.label,locale)+' · '+text(motion.preview.title,locale))+'"><div class="motion-weighted-track"><span class="motion-weighted-guide" aria-hidden="true"></span><article class="motion-weighted-card"><strong>'+esc(text(motion.preview.title,locale))+'</strong></article></div><small>'+esc(text(motion.preview.description,locale))+'</small></div>';
}

function orientedRoutePreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-oriented-stage is-playing" data-motion-stage data-motion-type="oriented-route" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><figure class="motion-oriented-figure"><svg viewBox="0 0 260 120" aria-hidden="true"><path d="M 12 68 C 64 10 164 112 248 30" /></svg><span class="motion-oriented-marker" aria-hidden="true"></span></figure><span class="motion-oriented-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function magneticSnapPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-magnetic-stage is-playing" data-motion-stage data-motion-type="magnetic-snap" role="img" aria-label="'+esc(text(motion.preview.label,locale)+' · '+text(motion.preview.title,locale))+'"><div class="motion-magnetic-track"><span class="motion-magnetic-target" aria-hidden="true"></span><span class="motion-magnetic-marker" aria-hidden="true"></span></div><span class="motion-magnetic-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function breathingPulsePreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-breathing-stage is-playing" data-motion-stage data-motion-type="breathing-pulse" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><span class="motion-breathing-mark" aria-hidden="true"><span></span></span><span class="motion-breathing-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function elasticScalePreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-elastic-stage is-playing" data-motion-stage data-motion-type="elastic-scale" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><span class="motion-elastic-mark" aria-hidden="true"></span><span class="motion-elastic-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function velocityStretchPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-velocity-stage is-playing" data-motion-stage data-motion-type="velocity-stretch" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><div class="motion-velocity-track"><span class="motion-velocity-marker" aria-hidden="true"></span></div><span class="motion-velocity-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function focusPulsePreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-focus-pulse-stage is-playing" data-motion-stage data-motion-type="focus-pulse" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><span class="motion-focus-pulse-mark"><span class="motion-focus-pulse-ring" aria-hidden="true"></span></span><span class="motion-focus-pulse-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function depthZoomPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-depth-stage is-playing" data-motion-stage data-motion-type="depth-zoom"><article class="motion-depth-card"><span class="motion-depth-label">'+esc(text(motion.preview.label,locale))+'</span><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></article></div>';
}

function softShrinkPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-soft-shrink-stage is-playing" data-motion-stage data-motion-type="soft-shrink"><span class="motion-soft-shrink-slot" aria-hidden="true">'+esc(locale==='en'?'Space after dismissal':'닫은 뒤 비는 자리')+'</span><article class="motion-soft-card"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></article></div>';
}

function axisTurnPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-axis-turn-stage is-playing" data-motion-stage data-motion-type="axis-turn" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><span class="motion-axis-turn-mark" aria-hidden="true"><i></i></span><span class="motion-axis-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function spinStopPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-spin-stage is-playing" data-motion-stage data-motion-type="spin-stop" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><span class="motion-spin-mark" aria-hidden="true"><i></i></span><span class="motion-axis-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function pendulumSwayPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-pendulum-stage is-playing" data-motion-stage data-motion-type="pendulum-sway" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><span class="motion-pendulum-hanger"><span class="motion-pendulum-stem"><i></i></span></span><span class="motion-axis-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function cardFlipPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-card-flip-stage is-playing" data-motion-stage data-motion-type="card-flip" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><div class="motion-flip-perspective"><div class="motion-flip-card"><span class="motion-flip-face front"><small>'+esc(locale==='en'?'OVERVIEW':'요약')+'</small><strong>'+esc(text(motion.preview.title,locale))+'</strong></span><span class="motion-flip-face back"><small>'+esc(locale==='en'?'DETAIL':'세부 정보')+'</small><strong>'+esc(text(motion.preview.description,locale))+'</strong></span></div></div></div>';
}

function orbitMotionPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-orbit-stage is-playing" data-motion-stage data-motion-type="orbit-motion" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><div class="motion-orbit-system"><span class="motion-orbit-ring" aria-hidden="true"></span><span class="motion-orbit-center" aria-hidden="true"></span><span class="motion-orbit-arm"><i class="motion-orbit-marker"></i></span></div><span class="motion-axis-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function inputTiltPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-input-tilt-stage is-playing" data-motion-stage data-motion-type="input-tilt" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><article class="motion-input-tilt-card"><span class="motion-input-tilt-label">'+esc(text(motion.preview.title,locale))+'</span><strong>'+esc(text(motion.preview.description,locale))+'</strong></article></div>';
}

function rollInPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-roll-stage is-playing" data-motion-stage data-motion-type="roll-in" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><div class="motion-roll-track"><span class="motion-roll-guide" aria-hidden="true"></span><span class="motion-roll-marker" aria-hidden="true"></span></div><span class="motion-axis-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function counterRotationPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-counter-stage is-playing" data-motion-stage data-motion-type="counter-rotation" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><span class="motion-counter-outer"><span class="motion-counter-dot"></span><i class="motion-counter-inner"><b></b></i></span><span class="motion-axis-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function dampedBouncePreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-bounce-stage is-playing" data-motion-stage data-motion-type="damped-bounce" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><div class="motion-bounce-track"><span class="motion-bounce-floor" aria-hidden="true"></span><span class="motion-bounce-marker" aria-hidden="true"></span></div><span class="motion-axis-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function springFollowPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-follow-stage is-playing" data-motion-stage data-motion-type="spring-follow" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><div class="motion-follow-track"><span class="motion-follow-target" aria-hidden="true"></span><span class="motion-follow-marker lead"></span><span class="motion-follow-marker follower one"></span><span class="motion-follow-marker follower two"></span><span class="motion-follow-marker follower three"></span></div><span class="motion-axis-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function elasticReturnPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-elastic-return-stage is-playing" data-motion-stage data-motion-type="elastic-return" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><div class="motion-elastic-return-track"><span class="motion-elastic-return-anchor" aria-hidden="true"></span><span class="motion-elastic-return-mark" aria-hidden="true"></span></div><span class="motion-axis-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function impactShakePreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-impact-stage is-playing" data-motion-stage data-motion-type="impact-shake" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><article class="motion-impact-card"><span class="motion-impact-icon" aria-hidden="true">'+icon('check')+'</span><span><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></article></div>';
}

function gridPatternPreviewMarkup(motion,locale,type){
 const cells=Array.from({length:9},(_,index)=>{
  const row=Math.floor(index/3),column=index%3,distance=Math.abs(row-1)+Math.abs(column-1),startX=((index*13)%31)-15,startY=((index*17)%27)-13,turn=((index%5)-2)*8;
  return '<span class="motion-grid-pattern-cell" style="--grid-row:'+row+';--grid-column:'+column+';--ring-distance:'+distance+';--row-order:'+row+';--column-order:'+column+';--cell-order:'+index+';--start-x:'+startX+'px;--start-y:'+startY+'px;--start-turn:'+turn+'deg" aria-hidden="true"></span>';
 }).join('');
 return '<div class="motion-stage motion-grid-pattern-stage is-playing" data-motion-stage data-motion-type="'+type+'" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><div class="motion-grid-pattern">'+cells+'</div><span class="motion-axis-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function alternatingRevealPreviewMarkup(motion,locale){
 const rows=[1,2,3].map((value,index)=>'<span class="motion-alternating-row" style="--row-order:'+index+'"><i>'+String(value).padStart(2,'0')+'</i><strong>'+esc(locale==='en'?'Review item '+value:'검토 항목 '+value)+'</strong></span>').join('');
 return '<div class="motion-stage motion-alternating-stage is-playing" data-motion-stage data-motion-type="alternating-reveal"><div class="motion-alternating-list">'+rows+'</div><span class="motion-axis-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function nudgePreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-nudge-stage is-playing" data-motion-stage data-motion-type="nudge"><button type="button" class="motion-nudge-card" aria-label="'+esc(text(motion.preview.label,locale))+'"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></button></div>';
}

function highlightSweepPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-highlight-stage is-playing" data-motion-stage data-motion-type="highlight-sweep"><article class="motion-highlight-card"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small><span class="motion-highlight-band" aria-hidden="true"></span></article></div>';
}

function rimGlowPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-rim-stage is-playing" data-motion-stage data-motion-type="rim-glow" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><span class="motion-rim-mark" aria-hidden="true"></span><span class="motion-axis-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function chargeUpPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-charge-stage is-playing" data-motion-stage data-motion-type="charge-up" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><span class="motion-charge-mark"><span class="motion-charge-ring" aria-hidden="true"></span><span class="motion-charge-core" aria-hidden="true"></span></span><span class="motion-axis-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function lightTrailPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-light-trail-stage is-playing" data-motion-stage data-motion-type="light-trail" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><div class="motion-light-trail-track"><span class="motion-light-trail-guide" aria-hidden="true"></span><span class="motion-light-trail-marker lead"></span><span class="motion-light-trail-marker echo one"></span><span class="motion-light-trail-marker echo two"></span></div><span class="motion-axis-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function scanLinePreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-scan-stage is-playing" data-motion-stage data-motion-type="scan-line" role="img" aria-label="'+esc(text(motion.preview.label,locale))+'"><div class="motion-scan-area"><span class="motion-scan-content"><i></i><i></i><i></i></span><span class="motion-scan-line" aria-hidden="true"></span></div><span class="motion-axis-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div>';
}

function settlePreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-settle-stage is-playing" data-motion-stage data-motion-type="settle"><div class="motion-settle-card"><span class="motion-settle-icon" aria-hidden="true">'+icon('check')+'</span><span><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span></div></div>';
}

function shimmerPreviewMarkup(motion,locale){
 const label=locale==='en'?'Loading content preview':'불러오는 콘텐츠 미리보기';
 return '<div class="motion-stage motion-shimmer-stage is-playing" data-motion-stage data-motion-type="shimmer" role="status" aria-label="'+label+'"><div class="motion-skeleton-panel" aria-hidden="true"><span class="motion-skeleton-line" style="--line-width:34%"></span><span class="motion-skeleton-line" style="--line-width:86%"></span><span class="motion-skeleton-line" style="--line-width:62%"></span><span class="motion-skeleton-line" style="--line-width:74%"></span></div><span class="motion-skeleton-label">'+esc(text(motion.preview.label,locale))+'</span></div>';
}

function scrollProgressPreviewMarkup(motion,locale){
 const inputLabel=locale==='en'?'Preview scroll position':'스크롤 위치 미리보기';
 return '<div class="motion-stage motion-scroll-stage" data-motion-stage data-motion-type="scroll-progress"><div class="motion-scroll-heading"><strong>'+esc(text(motion.preview.title,locale))+'</strong><output data-motion-scroll-value>42%</output></div><div class="motion-scroll-track" aria-hidden="true"><span data-motion-scroll-indicator style="width:42%"></span></div><label class="motion-scroll-control"><span>'+esc(text(motion.preview.label,locale))+'</span><input type="range" min="0" max="100" step="1" value="42" data-motion-scroll-input aria-label="'+inputLabel+'"></label></div>';
}

function hoverLiftPreviewMarkup(motion,locale){
 return '<div class="motion-stage motion-hover-stage is-playing" data-motion-stage data-motion-type="hover-lift"><button type="button" class="motion-hover-card" data-motion-preview-action><span class="motion-hover-icon" aria-hidden="true">'+icon('layers-2')+'</span><span class="motion-hover-copy"><strong>'+esc(text(motion.preview.title,locale))+'</strong><small>'+esc(text(motion.preview.description,locale))+'</small></span>'+icon('arrow-up-right')+'</button></div>';
}

function patternPreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Motion illustration':'모션 도식';
 return '<div class="motion-stage motion-pattern-stage is-playing" data-motion-stage data-motion-type="'+esc(motion.previewType)+'" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas" aria-hidden="true"><span class="motion-pattern-guide"></span><span class="motion-pattern-ghost"></span><span class="motion-pattern-object klic-motion-'+esc(motion.id)+'"></span><span class="motion-pattern-secondary"></span></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function modalArrivalPreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Modal preview':'모달 미리보기';
 const action=locale==='en'?'Continue':'계속';
 return '<div class="motion-stage motion-pattern-stage motion-modal-preview is-playing" data-motion-stage data-motion-type="modal-arrival" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-modal-backdrop" aria-hidden="true"><div class="motion-modal-card klic-motion-modal-arrival"><span class="motion-modal-mark">'+icon('message-square')+'</span><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small><span class="motion-modal-action">'+esc(action)+'</span></div></div></div>';
}

function heatmapRipplePreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Heatmap illustration':'히트맵 도식';
 const cells=Array.from({length:20},(_,index)=>'<span class="motion-data-heatmap-cell klic-motion-heatmap-ripple" style="--cell-index:'+index+'"></span>').join('');
 return '<div class="motion-stage motion-pattern-stage motion-data-heatmap-stage is-playing" data-motion-stage data-motion-type="heatmap-ripple" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-data-heatmap" aria-hidden="true">'+cells+'</div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function rsvpWordTrackPreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Reading pace illustration':'읽기 속도 도식';
 const words=locale==='en'?['Keep','one','focus']:['한 단어씩','차분히','읽어요'];
 const slots=words.map((word,index)=>'<span class="motion-rsvp-word" style="--rsvp-order:'+index+'">'+esc(word)+'</span>').join('');
 const sentence=words.join(' ');
 return '<div class="motion-stage motion-pattern-stage motion-rsvp-preview is-playing" data-motion-stage data-motion-type="rsvp-word-track" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-rsvp-canvas" aria-hidden="true"><span class="motion-pattern-guide"></span><div class="motion-rsvp-window klic-motion-rsvp-word-track"><span class="motion-rsvp-marker"></span>'+slots+'<span class="motion-rsvp-complete">'+esc(sentence)+'</span></div></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function noiseDissolveExitPreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Text exit illustration':'문자 퇴장 도식';
 const points=[[-44,-14],[-28,11],[-12,-23],[8,18],[24,-15],[40,4],[52,-20]];
 const grains=points.map(([x,y],index)=>'<i class="motion-noise-speck" aria-hidden="true" style="--grain-order:'+index+';--grain-x:'+x+'px;--grain-y:'+y+'px"></i>').join('');
 const defs='<svg class="motion-noise-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs><filter id="klic-noise-filter" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".08" numOctaves="1" seed="7" result="noise"/><feColorMatrix in="noise" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .333 .333 .333 0 0" result="noise-alpha"/><feComponentTransfer in="noise-alpha" result="threshold"><feFuncA type="linear" slope="1" intercept="1"><animate attributeName="intercept" values="1;-4" dur="1200ms" fill="freeze"/></feFuncA></feComponentTransfer><feComposite in="SourceGraphic" in2="threshold" operator="in"/></filter><mask id="klic-noise-mask" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox" mask-type="alpha"><rect x="0" y="0" width="1" height="1" fill="#fff" filter="url(#klic-noise-filter)"/></mask></defs></svg>';
 return '<div class="motion-stage motion-pattern-stage motion-noise-dissolve-preview motion-typography-stage is-playing" data-motion-stage data-motion-type="noise-dissolve-exit" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-typography-canvas motion-noise-canvas" aria-hidden="true">'+defs+'<span class="motion-pattern-guide"></span><strong class="motion-typography-sample motion-noise-sample klic-motion-noise-dissolve-exit">KLIC</strong>'+grains+'</div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function textSparkleLoopPreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Decorative text illustration':'문자 장식 도식';
 const points=[[-70,-18],[-48,-34],[-22,-42],[12,-40],[45,-31],[70,-13],[-68,17],[-38,31],[4,37],[42,25]];
 const stars=points.map(([x,y],index)=>{const altX=Math.round(-x*.65),altY=Math.round(-y*.5+8);return '<i class="motion-sparkle-star" aria-hidden="true" style="--sparkle-x:'+x+'px;--sparkle-y:'+y+'px;--sparkle-x-alt:'+altX+'px;--sparkle-y-alt:'+altY+'px;--sparkle-delay:'+(index*180)+'ms">✦</i>';}).join('');
 return '<div class="motion-stage motion-pattern-stage motion-sparkle-preview motion-typography-stage is-playing" data-motion-stage data-motion-type="text-sparkle-loop" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-typography-canvas motion-sparkle-canvas" aria-hidden="true"><span class="motion-pattern-guide"></span><strong class="motion-typography-sample motion-sparkle-text klic-motion-text-sparkle-loop">KLIC'+stars+'</strong></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function scrollPinHoldPreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Pinned scroll illustration':'고정 스크롤 도식';
 const context='<i></i><i></i><i></i>';
 return '<div class="motion-stage motion-pattern-stage motion-scroll-pin-preview is-playing" data-motion-stage data-motion-type="scroll-pin-hold" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-scroll-pin-canvas" aria-hidden="true"><div class="motion-scroll-pin-context">'+context+'</div><span class="motion-scroll-pin-subject klic-motion-scroll-pin-hold">KLIC</span></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function pinnedStoryStepsPreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Pinned story illustration':'고정 스토리 도식';
 const steps=locale==='en'?['Context','Action','Result']:['맥락','실행','결과'];
 const rows=steps.map(step=>'<span class="motion-pinned-story-step">'+esc(step)+'</span>').join('');
 return '<div class="motion-stage motion-pattern-stage motion-pinned-story-preview is-playing" data-motion-stage data-motion-type="pinned-story-steps" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-pinned-story-canvas" aria-hidden="true"><div class="motion-pinned-story-steps">'+rows+'</div><span class="motion-pinned-story-focus klic-motion-pinned-story-steps"></span><span class="motion-pinned-story-subject">KLIC</span></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function sheetDragSnapPreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Sheet drag illustration':'시트 드래그 도식';
 return '<div class="motion-stage motion-pattern-stage motion-sheet-snap-preview is-playing" data-motion-stage data-motion-type="sheet-drag-snap" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-sheet-snap-canvas" aria-hidden="true"><span class="motion-sheet-snap-track"><i class="motion-sheet-snap-mark"></i><i class="motion-sheet-snap-mark"></i><i class="motion-sheet-snap-mark"></i></span><div class="motion-sheet-snap-sheet klic-motion-sheet-drag-snap"><span class="motion-sheet-snap-handle"></span></div></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function glassCrackRecoverPreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Glass recovery illustration':'유리 복구 도식';
 const paths=['M100 58 L71 13','M100 58 L138 18','M100 58 L158 57','M100 58 L133 105','M100 58 L64 105','M100 58 L42 65','M100 58 L77 35','M100 58 L120 37','M71 13 L54 18','M138 18 L151 30','M133 105 L145 97'];
 const cracks=paths.map((path,index)=>'<path class="motion-glass-crack-line" d="'+path+'" style="--crack-order:'+index+'"/>').join('');
 return '<div class="motion-stage motion-pattern-stage motion-glass-crack-preview is-playing" data-motion-stage data-motion-type="glass-crack-recover" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-glass-crack-canvas" aria-hidden="true"><div class="motion-glass-crack-surface"><svg class="motion-glass-crack-lines klic-motion-glass-crack-recover" viewBox="0 0 200 120">'+cracks+'</svg></div></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function impactFreezePreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Impact timing illustration':'충돌 타이밍 도식';
 return '<div class="motion-stage motion-pattern-stage motion-impact-freeze-preview is-playing" data-motion-stage data-motion-type="impact-freeze" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-impact-freeze-canvas" aria-hidden="true"><span class="motion-impact-actor"></span><span class="motion-impact-mark">·</span><span class="motion-impact-target klic-motion-impact-freeze"></span></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function blurCrossfadePreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Blur crossfade illustration':'흐림 교차 도식';
 const previous=locale==='en'?'Overview':'요약',next=locale==='en'?'Details':'세부';
 return '<div class="motion-stage motion-pattern-stage motion-blur-crossfade-preview is-playing" data-motion-stage data-motion-type="blur-crossfade" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-blur-crossfade-preview" aria-hidden="true"><span class="motion-blur-view motion-blur-old">'+esc(previous)+'</span><span class="motion-blur-view motion-blur-new klic-motion-blur-crossfade">'+esc(next)+'</span></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function sidechainDuckPreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Beat duck illustration':'박자 감쇠 도식';
 const bars=[12,24,18,30,16].map(height=>'<i class="motion-sidechain-bar" style="height:'+height+'px"></i>').join('');
 return '<div class="motion-stage motion-pattern-stage motion-sidechain-preview is-playing" data-motion-stage data-motion-type="sidechain-duck" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-sidechain-canvas" aria-hidden="true"><span class="motion-sidechain-kick"></span><span class="motion-sidechain-surrounding klic-motion-sidechain-duck">'+bars+'</span></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function directionalRecoilPreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Directional recoil illustration':'방향성 반동 도식';
 return '<div class="motion-stage motion-pattern-stage motion-recoil-preview is-playing" data-motion-stage data-motion-type="directional-recoil" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-recoil-canvas" aria-hidden="true"><span class="motion-recoil-source"></span><span class="motion-recoil-target klic-motion-directional-recoil"></span></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function attentionBouncePreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Attention bounce illustration':'주의 반동 도식';
 return '<div class="motion-stage motion-pattern-stage motion-attention-bounce-preview is-playing" data-motion-stage data-motion-type="attention-bounce" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-attention-bounce-canvas" aria-hidden="true"><strong class="motion-attention-bounce-mark klic-motion-attention-bounce">KLIC</strong></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function pressBouncePreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Press rebound illustration':'누름 반동 도식';
 return '<div class="motion-stage motion-pattern-stage motion-press-bounce-preview is-playing" data-motion-stage data-motion-type="press-bounce" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-press-bounce-canvas" aria-hidden="true"><span class="motion-press-bounce-button klic-motion-press-bounce">'+esc(locale==='en'?'Action':'실행')+'</span></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function parryWindowPreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Parry timing illustration':'패리 타이밍 도식';
 return '<div class="motion-stage motion-pattern-stage motion-parry-window-preview is-playing" data-motion-stage data-motion-type="parry-window" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-parry-canvas" aria-hidden="true"><span class="motion-parry-ring"></span><span class="motion-parry-shield"></span><span class="motion-parry-projectile klic-motion-parry-window"></span></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function victoryImpactHoldPreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Victory landing illustration':'승리 착지 도식';
 return '<div class="motion-stage motion-pattern-stage motion-victory-hold-preview is-playing" data-motion-stage data-motion-type="victory-impact-hold" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-victory-hold-canvas" aria-hidden="true"><span class="motion-victory-hold-mark klic-motion-victory-impact-hold">KLIC</span></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function titleSlamPreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Title impact illustration':'표제 충격 도식';
 return '<div class="motion-stage motion-pattern-stage motion-title-slam-preview motion-typography-stage is-playing" data-motion-stage data-motion-type="title-slam" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-title-slam-canvas" aria-hidden="true"><strong class="motion-title-slam-text klic-motion-title-slam">KLIC</strong></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function comicTelopImpactPreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Comic caption impact illustration':'만화식 자막 충격 도식';
 return '<div class="motion-stage motion-pattern-stage motion-comic-impact-preview is-playing" data-motion-stage data-motion-type="comic-telop-impact" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-comic-impact-canvas" aria-hidden="true"><strong class="motion-comic-impact-text klic-motion-comic-telop-impact">KLIC!</strong></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function sfxCueSyncPreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Sound cue timing illustration':'효과음 동기화 도식';
 return '<div class="motion-stage motion-pattern-stage motion-sfx-cue-preview is-playing" data-motion-stage data-motion-type="sfx-cue-sync" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-sfx-cue-canvas" aria-hidden="true"><span class="motion-sfx-cue-tick"></span><span class="motion-sfx-cue-mark klic-motion-sfx-cue-sync is-active"></span></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function characterDropBouncePreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Character landing illustration':'문자 착지 도식';
 const glyphs='KLIC'.split('').map((glyph,index)=>'<i class="motion-character-drop-glyph" aria-hidden="true" style="--char-index:'+index+'">'+glyph+'</i>').join('');
 return '<div class="motion-stage motion-pattern-stage motion-character-drop-preview motion-typography-stage is-playing" data-motion-stage data-motion-type="character-drop-bounce" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-typography-canvas" aria-hidden="true"><span class="motion-pattern-guide"></span><strong class="motion-character-drop-word">'+glyphs+'</strong></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function characterHopLoopPreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Sequential character hops illustration':'문자 순차 도약 도식';
 const glyphs='KLIC'.split('').map((glyph,index)=>'<i class="motion-character-hop-glyph" aria-hidden="true" style="--char-index:'+index+'">'+glyph+'</i>').join('');
 return '<div class="motion-stage motion-pattern-stage motion-character-hop-preview motion-typography-stage is-playing" data-motion-stage data-motion-type="character-hop-loop" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-typography-canvas" aria-hidden="true"><span class="motion-pattern-guide"></span><strong class="motion-character-hop-word">'+glyphs+'</strong></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

const TYPOGRAPHY_PREVIEW_TYPES=new Set(['pointer-wipe-reveal','cursor-stamp-trail','proximity-text-scramble','proximity-repel','line-parallax','sticky-shrink-title','text-window-zoom','echo-fan','dual-column-wave','scroll-letter-drop','scroll-focus-tilt','scroll-word-reveal','scroll-word-highlight','font-weight-proximity','text-pressure','font-weight-grow','font-weight-breathe','variable-width-pulse','font-weight-wave','text-effect-sweep','cylinder-carousel','melt-drip','pixel-resolve','scanline-glide','ascii-density','subtle-turbulence','pixel-jitter','slice-displacement','blue-fringe-glitch','word-focus-track','tracking-focus-build','random-focus-reveal','character-focus-resolve','three-step-focus-settle','word-compose-reveal','text-blend-crossfade','text-depth-shadow','moving-line-shadow','text-glow-pulse','neon-startup','neon-flicker-soft','noise-resolve-reveal','blue-color-pop','blue-tone-cycle','conic-spin','blue-gradient-drift','blue-gradient-flow','outline-to-fill','slat-reveal','character-mask-rise','text-on-path','morphing-text-path','spiral-text-move','stroke-write','text-outline-draw','curved-text-marquee','particle-text-resolve','domino-word-topple','falling-word-stack','character-rain','symbol-flicker-in','center-out-text-reveal','type-backspace-loop','gooey-text-morph','comic-pop','marker-circle-draw','scale-text-exit','gravity-drop-exit','particle-text-exit','soft-focus-exit','grapheme-pop','typewriter','text-decode','diff-highlight']);

function typographyPreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const sample=text(motion.preview.sample,locale)||'KLIC';
 const parts=motion.preview.segment==='word'?sample.split(/(\s+)/u):Array.from(sample);
 const sampleMarkup=motion.preview.segment?parts.map((part,index)=>/^\s+$/u.test(part)?esc(part):'<span class="klic-motion-'+esc(motion.id)+'" style="--motion-order:'+index+'">'+esc(part)+'</span>').join(''):esc(sample);
 const label=locale==='en'?'Typography illustration':'문자 모션 도식';
 return '<div class="motion-stage motion-pattern-stage motion-typography-stage is-playing" data-motion-stage data-motion-type="'+esc(motion.previewType)+'" role="img" aria-label="'+esc(label+': '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-typography-canvas" aria-hidden="true"><span class="motion-pattern-guide"></span><strong class="motion-typography-sample '+(motion.preview.segment?'':'klic-motion-'+esc(motion.id))+'">'+sampleMarkup+'</strong><span class="motion-typography-cursor"></span></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function speakerCaptionPreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale),speaker=text(motion.preview.label,locale);
 const label=locale==='en'?'Motion illustration':'모션 도식';
 return '<div class="motion-stage motion-pattern-stage motion-speaker-caption-stage is-playing" data-motion-stage data-motion-type="speaker-caption" role="img" aria-label="'+esc(label+': '+speaker+'. '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-caption-canvas" aria-hidden="true"><span class="motion-caption-card klic-motion-speaker-caption"><span class="motion-caption-avatar">A</span><span class="motion-caption-copy"><small>'+esc(speaker)+'</small><strong>'+esc(title)+'</strong></span></span></div><span class="motion-pattern-copy"><strong>'+esc(locale==='en'?'Speaker summary':'화자 요약')+'</strong><small>'+esc(description)+'</small></span></div>';
}

function cornerTitleSwapPreviewMarkup(motion,locale){
 const title=text(motion.preview.title,locale),description=text(motion.preview.description,locale);
 const label=locale==='en'?'Motion illustration':'모션 도식';
 const program=text(motion.preview.label,locale);
 const previous=locale==='en'?'Components':'구성 요소';
 return '<div class="motion-stage motion-pattern-stage motion-corner-title-stage is-playing" data-motion-stage data-motion-type="corner-title-swap" role="img" aria-label="'+esc(label+': '+program+'. '+previous+' becomes '+title+'. '+description)+'"><div class="motion-pattern-canvas motion-corner-canvas" aria-hidden="true"><div class="motion-corner-title-frame"><span class="motion-corner-program">'+esc(program)+'</span><span class="motion-corner-title-window"><span class="motion-corner-old is-leaving">'+esc(previous)+'</span><span class="klic-motion-corner-title-swap">'+esc(title)+'</span></span></div></div><span class="motion-pattern-copy"><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span></div>';
}

function previewMarkup(motion,locale){
 if(motion.previewType==='steady-travel')return steadyTravelPreviewMarkup(motion,locale);
 if(motion.previewType==='smooth-arrival')return smoothArrivalPreviewMarkup(motion,locale);
 if(motion.previewType==='arc-route')return arcRoutePreviewMarkup(motion,locale);
 if(motion.previewType==='anticipation-move')return anticipationMovePreviewMarkup(motion,locale);
 if(motion.previewType==='weighted-landing')return weightedLandingPreviewMarkup(motion,locale);
 if(motion.previewType==='oriented-route')return orientedRoutePreviewMarkup(motion,locale);
 if(motion.previewType==='magnetic-snap')return magneticSnapPreviewMarkup(motion,locale);
 if(motion.previewType==='breathing-pulse')return breathingPulsePreviewMarkup(motion,locale);
 if(motion.previewType==='elastic-scale')return elasticScalePreviewMarkup(motion,locale);
 if(motion.previewType==='velocity-stretch')return velocityStretchPreviewMarkup(motion,locale);
 if(motion.previewType==='focus-pulse')return focusPulsePreviewMarkup(motion,locale);
 if(motion.previewType==='depth-zoom')return depthZoomPreviewMarkup(motion,locale);
 if(motion.previewType==='soft-shrink')return softShrinkPreviewMarkup(motion,locale);
 if(motion.previewType==='axis-turn')return axisTurnPreviewMarkup(motion,locale);
 if(motion.previewType==='spin-stop')return spinStopPreviewMarkup(motion,locale);
 if(motion.previewType==='pendulum-sway')return pendulumSwayPreviewMarkup(motion,locale);
 if(motion.previewType==='card-flip')return cardFlipPreviewMarkup(motion,locale);
 if(motion.previewType==='orbit-motion')return orbitMotionPreviewMarkup(motion,locale);
 if(motion.previewType==='input-tilt')return inputTiltPreviewMarkup(motion,locale);
 if(motion.previewType==='roll-in')return rollInPreviewMarkup(motion,locale);
 if(motion.previewType==='counter-rotation')return counterRotationPreviewMarkup(motion,locale);
 if(motion.previewType==='damped-bounce')return dampedBouncePreviewMarkup(motion,locale);
 if(motion.previewType==='spring-follow')return springFollowPreviewMarkup(motion,locale);
 if(motion.previewType==='elastic-return')return elasticReturnPreviewMarkup(motion,locale);
 if(motion.previewType==='impact-shake')return impactShakePreviewMarkup(motion,locale);
 if(['grid-wave','center-out-grid','row-sweep','grid-shuffle'].includes(motion.previewType))return gridPatternPreviewMarkup(motion,locale,motion.previewType);
 if(motion.previewType==='alternating-reveal')return alternatingRevealPreviewMarkup(motion,locale);
 if(motion.previewType==='nudge')return nudgePreviewMarkup(motion,locale);
 if(motion.previewType==='highlight-sweep')return highlightSweepPreviewMarkup(motion,locale);
 if(motion.previewType==='rim-glow')return rimGlowPreviewMarkup(motion,locale);
 if(motion.previewType==='charge-up')return chargeUpPreviewMarkup(motion,locale);
 if(motion.previewType==='light-trail')return lightTrailPreviewMarkup(motion,locale);
 if(motion.previewType==='scan-line')return scanLinePreviewMarkup(motion,locale);
 if(motion.previewType==='snap-arrival')return snapArrivalPreviewMarkup(motion,locale);
 if(motion.previewType==='split-reveal')return splitRevealPreviewMarkup(motion,locale);
 if(motion.previewType==='trail-exit')return trailExitPreviewMarkup(motion,locale);
 if(motion.previewType==='fold-exit')return foldExitPreviewMarkup(motion,locale);
 if(motion.previewType==='focus-arrival')return focusArrivalPreviewMarkup(motion,locale);
 if(motion.previewType==='iris')return irisPreviewMarkup(motion,locale);
 if(motion.previewType==='reveal')return revealPreviewMarkup(motion,locale);
 if(motion.previewType==='settle')return settlePreviewMarkup(motion,locale);
 if(motion.previewType==='shimmer')return shimmerPreviewMarkup(motion,locale);
 if(motion.previewType==='scroll-progress')return scrollProgressPreviewMarkup(motion,locale);
 if(motion.previewType==='hover-lift')return hoverLiftPreviewMarkup(motion,locale);
 if(motion.previewType==='sequence'||motion.previewType==='fade')return sequencePreview(motion,locale);
 if(motion.previewType==='press')return `<div class="motion-stage motion-interaction-stage" data-motion-stage data-motion-type="press"><div class="motion-preview-copy"><span class="motion-step-number">01</span><span><strong>${locale==='en'?'Action feedback':'실행 피드백'}</strong><small>${esc(text(motion.preview.hint,locale))}</small></span></div><button class="motion-preview-button" type="button" data-motion-preview-action>${icon('save')}<span>${esc(text(motion.preview.label,locale))}</span></button></div>`;
 if(motion.previewType==='disclosure')return `<div class="motion-stage motion-interaction-stage is-playing" data-motion-stage data-motion-type="disclosure"><details class="motion-preview-disclosure" open><summary><span><strong>${esc(text(motion.preview.title,locale))}</strong><small>${esc(text(motion.preview.description,locale))}</small></span>${icon('chevron-down')}</summary><div class="motion-disclosure-panel"><div>${motion.preview.items.map(item=>`<div class="motion-disclosure-row"><strong>${esc(text(item.title,locale))}</strong><small>${esc(text(item.description,locale))}</small></div>`).join('')}</div></div></details></div>`;
 if(motion.previewType==='toast')return `<div class="motion-stage motion-toast-stage is-playing" data-motion-stage data-motion-type="toast"><div class="motion-toast-preview" role="status" aria-live="polite"><span class="motion-toast-icon">${icon('check')}</span><span><strong>${esc(text(motion.preview.title,locale))}</strong><small>${esc(text(motion.preview.description,locale))}</small></span></div></div>`;
 if(motion.previewType==='speaker-caption')return speakerCaptionPreviewMarkup(motion,locale);
 if(motion.previewType==='corner-title-swap')return cornerTitleSwapPreviewMarkup(motion,locale);
 if(motion.previewType==='modal-arrival')return modalArrivalPreviewMarkup(motion,locale);
 if(motion.previewType==='heatmap-ripple')return heatmapRipplePreviewMarkup(motion,locale);
 if(motion.previewType==='rsvp-word-track')return rsvpWordTrackPreviewMarkup(motion,locale);
 if(motion.previewType==='noise-dissolve-exit')return noiseDissolveExitPreviewMarkup(motion,locale);
 if(motion.previewType==='text-sparkle-loop')return textSparkleLoopPreviewMarkup(motion,locale);
 if(motion.previewType==='scroll-pin-hold')return scrollPinHoldPreviewMarkup(motion,locale);
 if(motion.previewType==='pinned-story-steps')return pinnedStoryStepsPreviewMarkup(motion,locale);
 if(motion.previewType==='sheet-drag-snap')return sheetDragSnapPreviewMarkup(motion,locale);
 if(motion.previewType==='glass-crack-recover')return glassCrackRecoverPreviewMarkup(motion,locale);
 if(motion.previewType==='impact-freeze')return impactFreezePreviewMarkup(motion,locale);
 if(motion.previewType==='blur-crossfade')return blurCrossfadePreviewMarkup(motion,locale);
 if(motion.previewType==='sidechain-duck')return sidechainDuckPreviewMarkup(motion,locale);
 if(motion.previewType==='directional-recoil')return directionalRecoilPreviewMarkup(motion,locale);
 if(motion.previewType==='attention-bounce')return attentionBouncePreviewMarkup(motion,locale);
 if(motion.previewType==='press-bounce')return pressBouncePreviewMarkup(motion,locale);
 if(motion.previewType==='parry-window')return parryWindowPreviewMarkup(motion,locale);
 if(motion.previewType==='victory-impact-hold')return victoryImpactHoldPreviewMarkup(motion,locale);
 if(motion.previewType==='title-slam')return titleSlamPreviewMarkup(motion,locale);
 if(motion.previewType==='comic-telop-impact')return comicTelopImpactPreviewMarkup(motion,locale);
 if(motion.previewType==='sfx-cue-sync')return sfxCueSyncPreviewMarkup(motion,locale);
 if(motion.previewType==='character-drop-bounce')return characterDropBouncePreviewMarkup(motion,locale);
 if(motion.previewType==='character-hop-loop')return characterHopLoopPreviewMarkup(motion,locale);
 if(String(motion.category).startsWith('text-')||TYPOGRAPHY_PREVIEW_TYPES.has(motion.previewType))return typographyPreviewMarkup(motion,locale);
 return patternPreviewMarkup(motion,locale);
}

export function renderMotionThumbnail(id,{locale='ko'}={}){
 const motion=getMotion(id);if(!motion)return '';
 return `<div class="library-motion-thumbnail" aria-hidden="true" inert>${previewMarkup(motion,locale)}</div>`;
}

function motionDialog(motion,locale){
 const category=text(categoryFor(motion)?.label,locale);
 const durationRows=[`<div><dt>${locale==='en'?'Duration':'지속 시간'}</dt><dd>${duration(motion.durationMs)}</dd></div>`,motion.staggerMs?`<div><dt>${locale==='en'?'Stagger':'간격'}</dt><dd>${duration(motion.staggerMs)}</dd></div>`:'',`<div><dt>${locale==='en'?'Easing':'이징'}</dt><dd><code>${esc(motion.easing)}</code></dd></div>`].join('');
 return `<dialog class="motion-dialog" aria-labelledby="motion-dialog-title" aria-describedby="motion-dialog-summary" data-motion-dialog>
  <div class="motion-dialog-shell">
   <header class="motion-dialog-header"><div><span class="motion-recipe-kicker">${esc(category)} · KLIC MOTION</span><h2 id="motion-dialog-title">${esc(text(motion.title,locale))}</h2></div><button type="button" class="btn secondary sm" data-motion-favorite="${esc(motion.id)}" aria-pressed="${readMotionFavorites().has(motion.id)}">${icon('star')}${locale==='en'?'Favorite':'즐겨찾기'}</button><button type="button" class="icon-button" data-motion-close aria-label="${locale==='en'?'Close':'닫기'}">${icon('x')}</button></header>
   <div class="motion-dialog-scroll">
    <p id="motion-dialog-summary" class="motion-dialog-summary">${esc(text(motion.summary,locale))}</p>
    <section class="motion-dialog-preview" aria-label="${locale==='en'?'Motion preview':'모션 미리보기'}">
     <div class="motion-dialog-preview-head"><strong>${locale==='en'?'Live preview':'실시간 미리보기'}</strong><button type="button" class="btn secondary sm" data-motion-replay aria-controls="motion-preview-stage">${icon('rotate-ccw')}<span>${locale==='en'?'Replay':'다시 재생'}</span></button></div>
     <div id="motion-preview-stage" class="motion-preview-root">${previewMarkup(motion,locale)}</div>
    </section>
    ${renderItemDelivery('motion',motion.id,{locale})}
    <dl class="motion-spec">${durationRows}<div><dt>${locale==='en'?'Source':'제작'}</dt><dd>${locale==='en'?'KLIC-authored':'KLIC 자체 제작'}</dd></div></dl>
    <div class="motion-dialog-tabs" role="tablist" aria-label="${locale==='en'?'Motion details':'모션 정보'}">
     <button type="button" role="tab" aria-selected="true" aria-controls="motion-panel-guidance" id="motion-tab-guidance" data-motion-tab="guidance" tabindex="0">${locale==='en'?'Usage':'사용 기준'}</button>
     <button type="button" role="tab" aria-selected="false" aria-controls="motion-panel-implementation" id="motion-tab-implementation" data-motion-tab="implementation" tabindex="-1">${locale==='en'?'Implementation':'구현 코드'}</button>
    </div>
    <section class="motion-dialog-panel" role="tabpanel" id="motion-panel-guidance" aria-labelledby="motion-tab-guidance" data-motion-panel="guidance" tabindex="0">
     <dl class="motion-guidance"><div><dt>${locale==='en'?'Trigger':'시작 조건'}</dt><dd>${esc(text(motion.trigger,locale))}</dd></div><div><dt>${locale==='en'?'Use cases':'적합한 용도'}</dt><dd><ul>${motion.useCases.map(item=>`<li>${esc(text(item,locale))}</li>`).join('')}</ul></dd></div><div><dt>${locale==='en'?'Reduced motion':'모션 줄이기'}</dt><dd>${esc(text(motion.reducedMotion,locale))}</dd></div><div><dt>${locale==='en'?'Cautions':'주의할 점'}</dt><dd><ul>${motion.cautions.map(item=>`<li>${esc(text(item,locale))}</li>`).join('')}</ul></dd></div></dl>
    </section>
    <section class="motion-dialog-panel" role="tabpanel" id="motion-panel-implementation" aria-labelledby="motion-tab-implementation" data-motion-panel="implementation" tabindex="0" hidden>
     <div class="motion-code-toolbar"><div role="group" aria-label="${locale==='en'?'Implementation format':'구현 형식'}"><button type="button" aria-pressed="true" data-motion-format="css">CSS</button><button type="button" aria-pressed="false" data-motion-format="react">React</button></div><button type="button" class="btn secondary sm" data-motion-copy="css">${icon('copy')}<span>${locale==='en'?'Copy code':'코드 복사'}</span></button></div>
     <pre class="motion-code"><code data-motion-source>${esc(motion.implementation.css)}</code></pre>
     <p class="motion-code-note">${locale==='en'?'KLIC-authored examples. React snippets use native elements and the paired CSS example for motion and reduced-motion handling. Adapt content to the receiving interface.':'KLIC 자체 구현 예시입니다. React 코드는 기본 요소와 함께 제공하는 CSS를 사용해 모션과 모션 줄이기를 처리합니다. 적용 화면에 맞게 내용을 조정하세요.'}</p>
    </section>
   </div>
  </div>
 </dialog>`;
}

export function renderMotionPage(route=[],{locale='ko',query='',sort='default',limit=24,cursor='0',favorites=readMotionFavorites()}={}){
 const categoryId=route[0]==='category'?route[1]:null;
 const favoritesOnly=route[0]==='favorites',favoriteIds=favorites;
 const current=route.length===1&&!favoritesOnly&&route[0]!=='category'?getMotion(route[0]):null;
 const category=MOTION_CATEGORIES.find(item=>item.id===categoryId)||null;
 const result=selectMotionItems(favoritesOnly?MOTION_CATALOG.filter(item=>favoriteIds.has(item.id)):MOTION_CATALOG,{category:category?.id,query,sort,limit,cursor,locale});
 const items=result.items;
 const title=favoritesOnly?(locale==='en'?'Favorite motions':'즐겨찾는 모션'):category?text(category.label,locale):locale==='en'?'All motions':'모든 모션';
 const countLabel=result.total?locale==='en'?`Showing ${result.start+1}–${result.start+items.length} of ${result.total}`:`${result.start+1}–${result.start+items.length} / ${result.total}`:locale==='en'?'No matching motions':'일치하는 모션 없음';
 return `<section class="motion-library" aria-labelledby="motion-title" data-category="${esc(category?.id||'')}" data-favorites-only="${favoritesOnly}">
  <header class="section-header"><div><div class="section-title"><h1 id="motion-title">${esc(title)}</h1><span class="count-tag" data-motion-total>${result.total}</span></div><p>${locale==='en'?'KLIC-authored motion recipes with practical usage and implementation notes.':'KLIC가 직접 만든 모션과 사용 기준·구현 정보를 살펴보세요.'}</p></div><span class="eyebrow motion-eyebrow">MOTION · ${String(result.total).padStart(2,'0')}</span></header>
  <nav class="motion-view-tabs library-favorites-view" aria-label="${locale==='en'?'Motion view':'모션 보기'}"><a href="#motion" ${!favoritesOnly?'aria-current="page"':''}>${locale==='en'?'All motions':'전체 모션'}</a><a href="#motion/favorites" ${favoritesOnly?'aria-current="page"':''}>${icon('star')}${locale==='en'?'Favorites':'즐겨찾기'} <span data-motion-favorite-count>${MOTION_CATALOG.filter(item=>favoriteIds.has(item.id)).length}</span></a></nav>
  <nav class="motion-category-filter" aria-label="${locale==='en'?'Motion categories':'모션 분류'}"><a href="#motion" ${!category&&!favoritesOnly?'aria-current="page"':''}>${locale==='en'?'All':'전체'} <span>${MOTION_CATALOG.length}</span></a>${MOTION_CATEGORIES.map(item=>`<a href="#motion/category/${esc(item.id)}" ${category?.id===item.id?'aria-current="page"':''}>${esc(text(item.label,locale))} <span>${MOTION_CATALOG.filter(motion=>motion.category===item.id).length}</span></a>`).join('')}</nav>
  <div class="motion-controls"><label><span>${locale==='en'?'Search motions':'모션 검색'}</span><input type="search" data-motion-search maxlength="200" value="${esc(query)}" placeholder="${locale==='en'?'Name, use or easing':'이름·용도·이징'}"></label><label><span>${locale==='en'?'Sort':'정렬'}</span><select data-motion-sort><option value="default" ${sort==='default'?'selected':''}>${locale==='en'?'Recommended':'기본 순서'}</option><option value="name-asc" ${sort==='name-asc'?'selected':''}>${locale==='en'?'Name':'이름순'}</option><option value="duration-asc" ${sort==='duration-asc'?'selected':''}>${locale==='en'?'Fastest':'빠른 순'}</option><option value="duration-desc" ${sort==='duration-desc'?'selected':''}>${locale==='en'?'Slowest':'느린 순'}</option></select></label><span class="motion-result-count" data-motion-count aria-live="polite">${esc(countLabel)}</span></div>
  <div class="motion-grid" data-motion-grid>${items.map(item=>motionCard(item,locale,favoriteIds)).join('')}</div>
  <div class="motion-empty" data-motion-empty role="status" ${result.total?'hidden':''}>${favoritesOnly?(locale==='en'?'No saved motions yet. Use the star on any motion.':'저장한 모션이 없습니다. 항목의 별을 눌러 추가하세요.'):(locale==='en'?'No motion matches. Change the query or category.':'일치하는 모션이 없습니다. 검색어나 분류를 바꿔보세요.')}</div>
  <button type="button" class="btn secondary motion-more" data-motion-more data-next-cursor="${result.nextCursor||''}" ${result.nextCursor?'':'hidden'}>${locale==='en'?'Load more':'더 보기'}</button>
  ${current?motionDialog(current,locale):route.length&&!category&&!favoritesOnly?'<div class="motion-empty" role="status">'+(locale==='en'?'Motion not found.':'모션을 찾을 수 없습니다.')+'</div>':''}
 </section>`;
}

export function restartMotionStage(stage){
 if(!stage)return;
 const scroll=stage.querySelector('[data-motion-scroll-input]');
 if(scroll){const indicator=stage.querySelector('[data-motion-scroll-indicator]'),output=stage.querySelector('[data-motion-scroll-value]');for(const animation of indicator?.getAnimations()||[])animation.cancel();scroll.value='100';if(output)output.textContent='100%';if(indicator){indicator.style.width='100%';if(!matchMedia('(prefers-reduced-motion: reduce)').matches)indicator.animate([{width:'0%'},{width:'100%'}],{duration:1400,easing:'linear'});}return;}
 stage.classList.remove('is-playing');
 const action=stage.querySelector('[data-motion-preview-action]');action?.classList.remove('is-playing');
 void stage.offsetWidth;
 stage.classList.add('is-playing');action?.classList.add('is-playing');
 for(const animation of stage.getAnimations({subtree:true})){animation.currentTime=0;animation.play();}
}

export function initMotionPage(root,{copy=async()=>{},icons=()=>{},locale='ko'}={}){
 const dialog=root.querySelector('[data-motion-dialog]');
 const stage=dialog?.querySelector('[data-motion-stage]'),replayButton=dialog?.querySelector('[data-motion-replay]');
 const motionId=location.hash.slice(1).split('/')[1],motion=getMotion(motionId);
 const scrollInput=stage?.querySelector('[data-motion-scroll-input]'),scrollIndicator=stage?.querySelector('[data-motion-scroll-indicator]'),scrollValue=stage?.querySelector('[data-motion-scroll-value]');
 const updateScrollPreview=()=>{
  if(!scrollInput)return;
  const value=Math.max(0,Math.min(100,Number(scrollInput.value)||0));
  scrollInput.value=String(value);if(scrollIndicator)scrollIndicator.style.width=value+'%';if(scrollValue)scrollValue.textContent=value+'%';
 };
 let pressedTimer;
 const replay=()=>{
  if(!stage)return;
  if(scrollInput){scrollInput.value='42';updateScrollPreview();}
  restartMotionStage(stage);
  const button=stage.querySelector('[data-motion-preview-action]');
  if(button){clearTimeout(pressedTimer);pressedTimer=setTimeout(()=>button.classList.remove('is-playing'),motion?.durationMs||160);}
 };
 const close=()=>{location.hash='#motion';};
 const selectTab=tab=>{
  if(!dialog)return;
  for(const button of dialog.querySelectorAll('[data-motion-tab]')){const active=button===tab;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;}
  for(const panel of dialog.querySelectorAll('[data-motion-panel]'))panel.hidden=panel.dataset.motionPanel!==tab.dataset.motionTab;
 };
 const click=event=>{
  if(!dialog)return;
  const tab=event.target.closest('[data-motion-tab]');if(tab){selectTab(tab);return;}
  const format=event.target.closest('[data-motion-format]');
  if(format&&motion){
   const source=motion.implementation[format.dataset.motionFormat];if(typeof source!=='string')return;
   for(const button of dialog.querySelectorAll('[data-motion-format]'))button.setAttribute('aria-pressed',String(button===format));
   const code=dialog.querySelector('[data-motion-source]');if(code)code.textContent=source;
   const copyButton=dialog.querySelector('[data-motion-copy]');if(copyButton)copyButton.dataset.motionCopy=format.dataset.motionFormat;
   return;
  }
  const copyButton=event.target.closest('[data-motion-copy]');
  if(copyButton&&motion){const source=motion.implementation[copyButton.dataset.motionCopy];if(typeof source==='string')copy(source,locale==='en'?'Motion code copied.':'모션 코드를 복사했습니다.');}
 };
 const keydown=event=>{
  if(!dialog)return;
  const tab=event.target.closest?.('[data-motion-tab]');if(!tab)return;
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();const tabs=[...dialog.querySelectorAll('[data-motion-tab]')],index=tabs.indexOf(tab);
  const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
  tabs[next]?.focus();selectTab(tabs[next]);
 };
 const search=root.querySelector('[data-motion-search]'),sortControl=root.querySelector('[data-motion-sort]'),grid=root.querySelector('[data-motion-grid]'),count=root.querySelector('[data-motion-count]'),total=root.querySelector('[data-motion-total]'),more=root.querySelector('[data-motion-more]'),empty=root.querySelector('[data-motion-empty]');
 const categoryId=root.querySelector('.motion-library')?.dataset.category||null;
 const favoritesOnly=root.querySelector('.motion-library')?.dataset.favoritesOnly==='true';
 let query=search?.value||'',sort=sortControl?.value||'default',nextCursor=more?.dataset.nextCursor||null;
 const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{
  for(const entry of entries){const stage=entry.target.querySelector('[data-motion-stage]');if(entry.isIntersecting)restartMotionStage(stage);else for(const animation of stage?.getAnimations({subtree:true})||[])animation.pause();}
 },{threshold:.25}):null;
 const observeCards=()=>{for(const card of grid?.querySelectorAll('.motion-card')||[])observer?.observe(card);};
 const replayCard=event=>{const card=event.target.closest?.('.motion-card');if(!card||card.contains(event.relatedTarget))return;restartMotionStage(card.querySelector('[data-motion-stage]'));};
 root.addEventListener('pointerover',replayCard);root.addEventListener('focusin',replayCard);observeCards();
 const updateList=(cursor='0',append=false)=>{
  if(!grid)return;
  const page=selectMotionItems(favoritesOnly?MOTION_CATALOG.filter(item=>readMotionFavorites().has(item.id)):MOTION_CATALOG,{category:categoryId,query,sort,limit:24,cursor,locale});
  const markup=page.items.map(item=>motionCard(item,locale)).join('');
  if(!append)observer?.disconnect();
  if(append)grid.insertAdjacentHTML('beforeend',markup);else grid.innerHTML=markup;
  const label=page.total?locale==='en'?`Showing ${page.start+1}–${page.start+page.items.length} of ${page.total}`:`${page.start+1}–${page.start+page.items.length} / ${page.total}`:locale==='en'?'No matching motions':'일치하는 모션 없음';
  if(count)count.textContent=label;if(total)total.textContent=String(page.total);
  if(empty)empty.hidden=page.total>0;
  nextCursor=page.nextCursor;if(more){more.dataset.nextCursor=nextCursor||'';more.hidden=!nextCursor;}
  icons(grid);observeCards();
 };
 const refreshFavorites=()=>{const favorites=readMotionFavorites();for(const button of root.querySelectorAll('[data-motion-favorite]'))button.setAttribute('aria-pressed',String(favorites.has(button.dataset.motionFavorite)));for(const count of root.querySelectorAll('[data-motion-favorite-count]'))count.textContent=String(MOTION_CATALOG.filter(item=>favorites.has(item.id)).length);if(favoritesOnly)updateList();};
 const onStorage=event=>{if(event.key===MOTION_FAVORITES_STORAGE_KEY||event.key===null)refreshFavorites();};
 window.addEventListener(MOTION_FAVORITES_EVENT,refreshFavorites);window.addEventListener('storage',onStorage);
 const onSearch=()=>{query=search?.value||'';updateList();};
 const onSort=()=>{sort=sortControl?.value||'default';updateList();};
 const onRootClick=event=>{const favorite=event.target.closest?.('[data-motion-favorite]');if(favorite){toggleMotionFavorite(favorite.dataset.motionFavorite);return;}const replay=event.target.closest?.('[data-motion-card-replay]');if(replay){restartMotionStage(replay.closest('.motion-card')?.querySelector('[data-motion-stage]'));return;}const button=event.target.closest?.('[data-motion-more]');if(button&&nextCursor){event.preventDefault();updateList(nextCursor,true);}};
 search?.addEventListener('input',onSearch);sortControl?.addEventListener('change',onSort);root.addEventListener('click',onRootClick);scrollInput?.addEventListener('input',updateScrollPreview);
 replayButton?.addEventListener('click',replay);dialog?.querySelector('[data-motion-close]')?.addEventListener('click',close);
 dialog?.addEventListener('cancel',event=>{event.preventDefault();close();});dialog?.addEventListener('click',event=>{if(event.target===dialog)close();});
 dialog?.addEventListener('click',click);dialog?.addEventListener('keydown',keydown);
 if(dialog){dialog.showModal();dialog.querySelector('[data-motion-close]')?.focus({preventScroll:true});requestAnimationFrame(()=>{if(stage?.isConnected)replay();});icons(dialog);}
 return ()=>{
  window.removeEventListener(MOTION_FAVORITES_EVENT,refreshFavorites);window.removeEventListener('storage',onStorage);
  observer?.disconnect();root.removeEventListener('pointerover',replayCard);root.removeEventListener('focusin',replayCard);
  clearTimeout(pressedTimer);search?.removeEventListener('input',onSearch);sortControl?.removeEventListener('change',onSort);root.removeEventListener('click',onRootClick);scrollInput?.removeEventListener('input',updateScrollPreview);
  replayButton?.removeEventListener('click',replay);dialog?.querySelector('[data-motion-close]')?.removeEventListener('click',close);
  dialog?.removeEventListener('click',click);dialog?.removeEventListener('keydown',keydown);if(dialog?.open)dialog.close();
 };
}
