const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=name=>'<i data-lucide="'+esc(name)+'" aria-hidden="true"></i>';

export function renderLibraryOverview(options={}){
 const {kind,kicker,title,subtitle,description,guideHref,guideLabel,cardLabel,cardIcon='waypoints',rows=[],markers=[],markerLabel='',links=[],stats=[],notes=[],part='all'}=options;
 const slug=String(kind||'library').replace(/[^a-z0-9-]/gi,'').toLowerCase()||'library';
 const safeIcon=/^[a-z0-9-]+$/i.test(cardIcon)?cardIcon:'waypoints';
 const eyebrow=kind==='blocks'?'KLIC / COMPOSITION LIBRARY':kind==='components'?'KLIC / 컴포넌트 라이브러리':'KLIC / MOTION LIBRARY';
 const markerMarkup=markers.length?`<div class="block-axis-strip library-overview-markers">${markers.map((marker,index)=>{const label=typeof marker==='object'?marker.label:marker,title=typeof marker==='object'?marker.title:label;return `<span title="${esc(title||'')}" aria-hidden="true">${esc(label||String(index+1).padStart(2,'0'))}</span>`}).join('')}<strong>${esc(markerLabel)}</strong></div>`:'';
 const statMarkup=stats.map(stat=>{const content=`<strong>${esc(stat.value)}</strong><span>${esc(stat.label)}${stat.href?` ${icon('arrow-up-right')}`:''}</span>`;return stat.href?`<a href="${esc(stat.href)}">${content}</a>`:`<div>${content}</div>`}).join('');
 const cardMarkup=`<div class="block-system-card library-overview-card"><div class="block-system-top library-overview-card-top"><span>${esc(cardLabel)}</span>${icon(safeIcon)}</div><div class="block-layer-stack library-overview-rows">${rows.map((row,index)=>`<span><b>${esc(row.value||String(index+1).padStart(2,'0'))}</b> ${esc(row.label)} <small>${esc(row.note)}</small></span>`).join('')}</div>${markerMarkup}</div>`;
 const linksMarkup=links.length?`<div class="workspace-links library-overview-links">${links.map(link=>`<a class="btn secondary sm" href="${esc(link.href)}">${esc(link.label)}</a>`).join('')}</div>`:'';
 const statsMarkup=stats.length?`<div class="block-stats library-overview-stats">${statMarkup}</div>`:'';
 if(part==='intro')return `<div class="block-page library-studio-overview library-overview-intro" data-library-overview="${esc(slug)}"><section class="library-overview-hero" aria-labelledby="${slug}-overview-title"><span class="block-kicker library-overview-kicker">${esc(kicker)}</span><h1 id="${slug}-overview-title">${esc(title)}</h1><p>${esc(options.introDescription??subtitle).replace(/\n/g,'<br>')}</p></section></div>`;
 if(part==='details')return `<details class="block-page library-studio-overview library-overview-details" data-library-overview="${esc(slug)}"><summary class="library-overview-summary">${esc(options.detailsSummary||'자세한 소개와 통계 보기')}${icon('chevron-down')}</summary><div class="library-overview-detail-body"><div class="eyebrow">${esc(eyebrow)}</div><section class="block-hero library-overview-hero" aria-labelledby="${slug}-overview-details-title"><div><span class="block-kicker library-overview-kicker">${esc(kicker)}</span><h2 id="${slug}-overview-details-title">${esc(subtitle)}</h2><p>${esc(description).replace(/\n/g,'<br>')}</p><a class="text-link" href="${esc(guideHref)}">${esc(guideLabel)} ${icon('arrow-up-right')}</a></div>${cardMarkup}</section>${linksMarkup}${statsMarkup}${notes.map(note=>`<p class="library-overview-note" role="note">${esc(note)}</p>`).join('')}</div></details>`;
 return `<div class="block-page library-studio-overview" data-library-overview="${esc(slug)}">
  <div class="eyebrow">${esc(eyebrow)}</div>
  <section class="block-hero library-overview-hero" aria-labelledby="${slug}-overview-title"><div><span class="block-kicker library-overview-kicker">${esc(kicker)}</span><h1 id="${slug}-overview-title">${esc(title)}<span>${esc(subtitle)}</span></h1><p>${esc(description).replace(/\n/g,'<br>')}</p><a class="text-link" href="${esc(guideHref)}">${esc(guideLabel)} ${icon('arrow-up-right')}</a></div>${cardMarkup}</section>
  ${linksMarkup}
  ${statsMarkup}
 </div>`;
}
