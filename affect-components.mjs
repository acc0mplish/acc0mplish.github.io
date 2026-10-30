/** Native HTML adaptations of Affect UI Classic. MIT © Florian Höller.
 * Source pin: 0c81e8114c466aa6283923920eaabe62ce2a8b25. See affect-source-notice.md. */
export const AFFECT_PIN='0c81e8114c466aa6283923920eaabe62ce2a8b25';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uidSafe=v=>'af-'+Array.from(String(v)).map(c=>c.codePointAt(0).toString(16)).join('-');
export const AFFECT_COMPONENTS=Object.freeze([
 ['decision-inbox','Decision Inbox','결정 인박스','답변을 기다리는 결정을 차례로 검토합니다.','답변 확인·접기·남은 개수·실행 취소'],
 ['tool-call-card','Tool Call Card','도구 실행 카드','에이전트의 도구 호출과 결과를 투명하게 보여줍니다.','인수·결과 공개·복사·재시도·실행 그룹'],
 ['smart-recommendation','Smart Recommendation','스마트 추천','근거와 신뢰도를 읽고 대안을 선택합니다.','대안 선택·수락·실행 취소·신호 강도'],
 ['message-actions','Message Actions','메시지 액션','응답을 복사하고 버전과 피드백을 관리합니다.','복사·버전·재생성·평가·음성 읽기']
].map(([id,name,ko,description,rule])=>({id,name,ko,description,rule,category:'display',icon:id==='tool-call-card'?'terminal':id==='message-actions'?'message-square':'sparkles',tone:'soft-blue',tags:[ko,name,'KLIC','AI','에이전트'],token:'klic.component.card.background.default',req:'KLIC 7 디멘션 · 4계층',source:'KLIC native HTML adaptation · MIT',added:true})));
const decisionSets=[
 ['검토가 필요한 결정',[['새 온보딩 흐름을 적용할까요?','이번 주 사용자 테스트에서 작업 완료율이 18% 높아졌습니다.','적용하기','현재 유지'],['변경 내용을 팀에 공유할까요?','공유는 이 로컬 데모에서만 확인됩니다.','공유 승인','나중에']]],
 ['출시 전 승인',[['릴리스 후보 v2.8을 승인할까요?','접근성 점검 12개와 회귀 검사가 완료되었습니다.','출시 승인','검토 보류'],['변경 기록을 포함할까요?','고객에게 보이는 설명을 마지막으로 확인하세요.','포함하기','제외하기'],['지원 팀 안내를 준비할까요?','실제 알림은 전송하지 않습니다.','준비 승인','다음에']]],
 ['권한 요청',[['외부 검토자에게 읽기 권한을 줄까요?','프로젝트 미리보기만 허용됩니다. 편집·내보내기는 제한됩니다.','읽기 허용','거절'],['7일 뒤 권한을 만료할까요?','검토 종료 뒤에도 접근이 남지 않도록 합니다.','7일로 설정','직접 관리']]],
 ['콘텐츠 편집',[['긴 안내 문장을 쉬운 한국어로 바꿀까요?','“작업을 재개하려면 인증 절차를 다시 진행해주세요”를 “다시 로그인하고 계속하세요”로 제안합니다.','쉬운 문장 사용','원문 유지'],['중복된 문단을 합칠까요?','핵심 정보는 보존하고 두 문단을 하나로 정리합니다.','합치기','분리 유지']]],
 ['데이터 충돌 해결',[['두 파일의 최신 변경 내용을 병합할까요?','로컬 수정 3건과 원본 수정 2건이 있습니다. 어떤 파일도 실제로 변경하지 않습니다.','병합 미리보기','로컬 유지']]]
];
const toolSets=[
 ['검색 결과','search_documents','설계 결정 문서 3개 검색','success',{query:'접근성 가이드',limit:3},{matches:['키보드 탐색','대비 점검','스크린 리더']}],
 ['실패와 복구','fetch_preview','미리보기 데이터를 읽지 못했습니다','error',{project:'klic-preview'},{status:'ok',items:12}],
 ['실행 중인 작업','analyze_layout','좁은 화면의 배치 확인','idle',{viewport:320,locale:'ko-KR'},{issues:0,checked:18}],
 ['긴 JSON 결과','inspect_tokens','디자인 토큰을 점검했습니다','success',{scope:'semantic'},{tokens:Array.from({length:14},(_,i)=>({name:`surface-${i+1}`,layer:'semantic',resolved:true}))}],
 ['도구 실행 그룹','review_pipeline','검색 · 분석 · 요약','success',{task:'release-review'},{summary:'릴리스 검토 완료'}]
];
const recSets=[
 ['동기화 방식 추천',[['증분 동기화','최근 변경된 항목만 동기화하면 검토 시간을 줄일 수 있습니다.',3],['전체 동기화','모든 항목을 다시 확인합니다. 최초 설정에 적합합니다.',2],['수동 검토','항목별로 직접 선택해 동기화합니다.',1]]],
 ['출시 범위 제안',[['단계적 공개','먼저 10%에 공개하고 오류 지표를 확인하세요.',3],['내부 사용자만','팀 내부에서 하루 더 검증합니다.',2],['전체 공개','검증 범위가 충분할 때 선택하세요.',1]]],
 ['문장 다듬기',[['간결한 안내','핵심 행동을 문장 앞에 배치하면 쉽게 이해할 수 있습니다.',2],['자세한 설명','처음 사용하는 사람에게 단계와 배경을 더 설명합니다.',2]]],
 ['낮은 신뢰도 검토',[['담당자에게 확인','현재 근거가 부족합니다. 원본 작성자와 확인하세요.',0],['추가 자료 찾기','관련 자료를 더 모은 다음 결정합니다.',1]]],
 ['좁은 화면 개선',[['버튼을 다음 줄에 배치','긴 한국어 작업 이름을 줄이지 않고 조작 영역을 보존합니다.',3],['보조 행동 접기','덜 사용하는 작업을 더 보기 영역에 모읍니다.',2],['한 열로 구성','정보와 행동을 한 방향으로 읽게 합니다.',2]]]
];
const messages=[
 ['기본 응답','접근성 검토가 완료되었습니다. 키보드 탐색과 명확한 레이블을 먼저 확인하세요.'],
 ['여러 버전 비교','이번 주에는 온보딩을 간소화하고 사용자 테스트를 진행합니다.'],
 ['코드 설명','토큰은 Primitive → Brand → Semantic → Component 순서로 해석합니다. 각 역할의 별칭을 유지하세요.'],
 ['편집 피드백','새 안내 문구를 검토해주세요. 긴 문장은 두 문장으로 나누면 작은 화면에서도 읽기 편합니다.'],
 ['음성 읽기','다음 작업은 팀 검토입니다. 변경 요약을 읽고 필요한 부분에 의견을 남겨주세요.']
];
export function makeAffectState(family,form=0){
 const i=Math.max(0,Math.min(4,Number(form)||0));
 if(family==='decision-inbox'){const [title,rows]=decisionSets[i];return {family,form:i,title,rows:rows.map(([title,detail,primary,secondary],n)=>({title,detail,primary,secondary,open:n===0,answered:null,gone:false})),history:[],notice:''};}
 if(family==='tool-call-card'){const [title,name,summary,status,args,result]=toolSets[i];return {family,form:i,title,calls:(i===4?[['search_documents','문서 검색'],['analyze_changes','변경 분석'],['summarize_review','검토 요약']]:[[name,summary]]).map(([name,summary])=>({name,summary,status,open:i===1||i===3,args,result,full:false})),groupOpen:true,notice:''};}
 if(family==='smart-recommendation'){const [title,options]=recSets[i];return {family,form:i,title,options,chosen:0,accepted:false,open:i!==3,alternatives:false,notice:''};}
 if(family==='message-actions'){const [title,text]=messages[i];return {family,form:i,title,versions:i===1?[text,'온보딩 단계를 줄입니다. 사용자 테스트의 결과를 기준으로 다음 우선순위를 정하세요.']: [text],version:0,vote:null,panel:false,reason:null,feedback:'',sent:false,busy:false,speaking:false,notice:''};}
 throw new Error('Unknown Affect family: '+family);
}
/** Pure state transitions; no global state or side effects. */
export function affectTransition(state,action,value){
 const s=structuredClone(state); const n=Number(value);
 if(s.family==='decision-inbox'){
  if(action==='decision-toggle'&&s.rows[n]&&!s.rows[n].answered)s.rows[n].open=!s.rows[n].open;
  if(action==='answer'){const [idx,choice]=String(value).split(':');const row=s.rows[+idx];if(row&&!row.answered){row.answered=row[choice==='primary'?'primary':'secondary'];s.history.push(+idx);s.notice=`✓ ${row.answered} · 로컬 결정`;}}
  if(action==='fold'){const row=s.rows[n];if(row?.answered){row.gone=true;const next=s.rows.find(r=>!r.answered&&!r.open);if(next)next.open=true;}}
  if(action==='undo'){const idx=s.history.pop();if(idx!==undefined){s.rows[idx].answered=null;s.rows[idx].gone=false;s.rows[idx].open=true;s.notice='결정을 되돌렸습니다.';}}
 }
 if(s.family==='tool-call-card'){
  if(action==='tool-toggle'&&s.calls[n])s.calls[n].open=!s.calls[n].open;
  if(action==='group-toggle')s.groupOpen=!s.groupOpen;
  if(action==='code-full'&&s.calls[n])s.calls[n].full=!s.calls[n].full;
  if(action==='run'&&s.calls[n]&&s.calls[n].status!=='running'){s.calls[n].status='running';s.calls[n].open=true;s.notice='로컬 실행 중…';}
  if(action==='complete'&&s.calls[n]?.status==='running'){s.calls[n].status='success';s.notice='로컬 실행 완료 · 0.9초';}
 }
 if(s.family==='smart-recommendation'){
  if(action==='rec-toggle')s.open=!s.open;
  if(action==='alternatives'&&!s.accepted)s.alternatives=!s.alternatives;
  if(action==='choose'&&!s.accepted&&s.options[n]){s.chosen=n;s.alternatives=false;s.open=true;s.notice='대안을 선택했습니다.';}
  if(action==='accept'){s.accepted=true;s.alternatives=false;s.notice=`✓ ${s.options[s.chosen][0]} · 로컬 적용`;}
  if(action==='undo'){s.accepted=false;s.notice='추천 적용을 되돌렸습니다.';}
 }
 if(s.family==='message-actions'){
  if(action==='version'&&!s.busy){s.version=Math.max(0,Math.min(s.versions.length-1,s.version+n));s.notice=`버전 ${s.version+1}`;}
  if(action==='regenerate'&&!s.busy){s.busy=true;s.notice='로컬 대체 응답 생성 중…';}
  if(action==='generated'&&s.busy){s.busy=false;s.versions.push(`대체 응답 ${s.versions.length+1}: ${messages[s.form][1]} 먼저 작은 범위에서 검증한 뒤 다음 단계를 결정하세요.`);s.version=s.versions.length-1;s.notice='새 로컬 버전을 만들었습니다.';}
  if(action==='vote'){s.vote=s.vote===value?null:value;s.panel=s.vote==='down';s.sent=false;s.reason=null;}
  if(action==='close-feedback'){s.panel=false;}
  if(action==='reason'&&!s.sent)s.reason=s.reason===value?null:value;
  if(action==='send-feedback'&&s.reason&&!s.sent){s.sent=true;s.notice='피드백을 이 데모에 기록했습니다. 외부로 전송하지 않습니다.';}
  if(action==='speech'){s.speaking=!s.speaking;s.notice=s.speaking?'읽는 중…':'읽기를 멈췄습니다.';}
  if(action==='speech-end'){s.speaking=false;s.notice='음성 읽기를 마쳤습니다.';}
 }
 if(action==='notice')s.notice=String(value);
 return s;
}
const b=(action,label,value='',extra='')=>`<button type="button" class="af-btn" data-af-action="${action}" data-af-value="${esc(value)}" ${extra}>${label}</button>`;
const status=s=>`<p class="af-status" role="status" aria-live="polite">${esc(s.notice||'로컬 데모 · 외부 작업 없음')}</p>`;
export function renderAffectContent(s,uid){
 const id=uidSafe(uid);
 if(s.family==='decision-inbox'){
 const count=s.rows.filter(r=>!r.answered).length;
 return `<header class="af-tray-head" aria-live="polite"><span class="af-glyph" aria-hidden="true">${count?'◈':'✓'}</span><span>${count?`${count}개의 결정이 기다립니다`:'모든 결정을 검토했습니다'}</span></header><div class="af-card" data-klic-surface="card">${s.rows.map((r,i)=>`<section class="af-decision ${r.gone?'af-gone':''}" ${r.gone?'hidden':''}><h4>${b('decision-toggle',esc(r.title),i,`aria-expanded="${r.open}" aria-controls="${id}-decision-${i}" ${r.answered?'disabled':''}`)}</h4><div id="${id}-decision-${i}" ${!r.open?'hidden':''}><p class="af-muted">${esc(r.detail)}</p><div class="af-actions">${r.answered?`<span class="af-confirm">✓ ${esc(r.answered)}</span>`:b('answer',esc(r.primary),`${i}:primary`,'data-primary')+b('answer',esc(r.secondary),`${i}:secondary`)}</div></div></section>`).join('')}${!count?'<p class="af-empty">지금은 기다리는 결정이 없습니다.</p>':''}</div><footer class="af-foot"><span>${esc(s.title)}</span>${b('undo','↶ 실행 취소','',s.history.length?'':'disabled')}</footer>${status(s)}`;
 }
 if(s.family==='tool-call-card'){
 const grouped=s.calls.length>1;
 return `<header class="af-tray-head"><span class="af-glyph" aria-hidden="true">⌘</span><span>${esc(s.title)}</span>${grouped?b('group-toggle',`${s.calls.length}개 도구 · 2.7초 ${s.groupOpen?'접기':'펼치기'}`,'',`aria-expanded="${s.groupOpen}" aria-controls="${id}-group"`):'<span class="af-tag">TOOL TRACE</span>'}</header><div class="af-tool-group" id="${id}-group" ${s.groupOpen?'':'hidden'}>${s.calls.map((c,i)=>`<article class="af-card af-tool" data-klic-surface="card" data-status="${c.status}" aria-busy="${c.status==='running'}"><button class="af-tool-head" type="button" data-af-action="tool-toggle" data-af-value="${i}" aria-expanded="${c.open}" aria-controls="${id}-tool-${i}"><span class="af-tool-icon" aria-hidden="true">${c.status==='error'?'!':c.status==='running'?'◌':'⌘'}</span><span class="af-tool-title"><code>${esc(c.name)}</code><span>${esc(c.summary)}</span></span><span class="af-tool-state">${({success:'✓ 0.9초',error:'실패',idle:'실행 대기',running:'실행 중…'})[c.status]}</span><span aria-hidden="true">${c.open?'⌃':'⌄'}</span></button><div class="af-tool-body" id="${id}-tool-${i}" ${c.open?'':'hidden'}>${['args',...(c.status==='success'?['result']:[])].map(kind=>`<section class="af-code" data-klic-surface="dense"><header><span>${kind==='args'?'입력 인수':'실행 결과'}</span>${b('copy-code','복사',`${i}:${kind}`)}</header><pre class="${c.full?'af-code-full':''}" tabindex="0" aria-label="${kind==='args'?'입력 인수':'실행 결과'} JSON"><code>${esc(JSON.stringify(c[kind],null,2))}</code></pre></section>`).join('')}${s.form===3?b('code-full',c.full?'내용 접기':'전체 결과 보기',i,`aria-expanded="${c.full}"`):''}${c.status==='error'?'<div class="af-error"><strong>연결 시간이 초과되었습니다.</strong><p>이 데모에서 다시 실행해 복구 과정을 확인하세요.</p></div>':''}${['error','idle'].includes(c.status)?b('run',c.status==='error'?'↻ 다시 시도':'로컬 실행',i,'data-primary'):''}${c.status==='running'?'<p class="af-confirm" role="status">처리 중 · 잠시 기다려주세요</p>':''}</div></article>`).join('')}</div>${status(s)}`;
 }
 if(s.family==='smart-recommendation'){
 const [label,reason,level]=s.options[s.chosen];
 return `<div class="af-card af-rec-card" data-klic-surface="card"><h4><button type="button" class="af-rec-head" data-af-action="rec-toggle" aria-expanded="${s.open}" aria-controls="${id}-reason"><span class="af-glyph" aria-hidden="true">✦</span><span>${esc(s.title)}</span><span class="af-tag">${s.chosen?'대안':'추천'}</span><span aria-hidden="true">${s.open?'⌃':'⌄'}</span></button></h4><div class="af-rec-body" id="${id}-reason" ${s.open?'':'hidden'}><h5>${esc(label)}</h5><p>${esc(reason)}</p></div></div><footer class="af-rec-foot"><span class="af-signal"><span class="af-bars" aria-hidden="true">${[1,2,3].map(n=>`<i ${n<=level?'data-on':''}></i>`).join('')}</span>${['신호 없음','낮은 신뢰도','보통 신뢰도','높은 신뢰도'][level]}</span><div class="af-actions">${s.accepted?`<span class="af-confirm">✓ 적용됨</span>${b('undo','실행 취소')}`:`${b('alternatives','대안 보기','',`aria-expanded="${s.alternatives}" aria-controls="${id}-alternatives"`)}${b('accept',`${esc(label)} 수락`,'','data-primary')}`}</div></footer><div class="af-alternatives" id="${id}-alternatives" ${s.alternatives?'':'hidden'} role="group" aria-label="추천 대안">${s.options.map(([label,reason],i)=>b('choose',`<strong>${esc(label)}</strong><span>${esc(reason)}</span>`,i,`aria-pressed="${s.chosen===i}"`)).join('')}</div>${status(s)}`;
 }
 return `<header class="af-tray-head"><span class="af-avatar" aria-hidden="true">K</span><span>KLIC Assistant</span><span class="af-tag">${esc(s.title)}</span></header><div class="af-card af-message" data-klic-surface="card"><p class="af-message-text" ${s.busy?'aria-busy="true"':''}>${esc(s.versions[s.version])}</p><div class="af-message-bar" role="group" aria-label="응답 동작">${b('copy-message','⧉ 복사')}${b('regenerate',s.busy?'생성 중…':'↻ 재생성','',s.busy?'disabled aria-busy="true"':'')}${s.versions.length>1?`<span class="af-versions">${b('version','‹',-1,`aria-label="이전 버전" ${s.version===0||s.busy?'disabled':''}`)}<span aria-label="버전 ${s.version+1} / ${s.versions.length}">${s.version+1} / ${s.versions.length}</span>${b('version','›',1,`aria-label="다음 버전" ${s.version===s.versions.length-1||s.busy?'disabled':''}`)}</span>`:''}${b('vote','좋아요','up',`aria-pressed="${s.vote==='up'}"`)}${b('vote','아쉬워요','down',`aria-pressed="${s.vote==='down'}" aria-expanded="${s.panel}" aria-controls="${id}-feedback"`)}${b('speech',s.speaking?'■ 읽기 중지':'◖ 읽어주기','',`aria-pressed="${s.speaking}"`)}</div><section class="af-feedback" id="${id}-feedback" ${s.panel?'':'hidden'} aria-label="응답 피드백"><div class="af-feedback-head"><strong>어떤 점이 아쉬웠나요?</strong>${b('close-feedback','닫기','','aria-label="피드백 닫기"')}</div><div class="af-actions">${['정확하지 않음','도움이 안 됨','기타'].map(reason=>b('reason',reason,reason,`aria-pressed="${s.reason===reason}" ${s.sent?'disabled':''}`)).join('')}</div>${s.reason==='기타'&&!s.sent?`<label class="af-input-label" for="${id}-feedback-text">추가 설명 (선택)</label><input class="af-input" data-klic-surface="field" id="${id}-feedback-text" data-af-feedback value="${esc(s.feedback)}" maxlength="240" placeholder="응답을 어떻게 개선하면 좋을까요?">`:''}${b('send-feedback',s.sent?'✓ 기록 완료':'로컬 피드백 기록','',`data-primary ${!s.reason||s.sent?'disabled':''}`)}</section></div>${status(s)}`;
}
export function renderAffect(state,uid){return `<section class="af-demo af-${state.family}" data-af-family="${state.family}" data-af-uid="${esc(uid)}" data-af-initial="${esc(JSON.stringify(state))}" aria-label="${esc(state.title)}">${renderAffectContent(state,uid)}</section>`;}
export function getAffectForms(id,uid='affect'){
 if(!AFFECT_COMPONENTS.some(c=>c.id===id))return [];
 return Array.from({length:5},(_,i)=>{const state=makeAffectState(id,i);return {id:([['default','release','permission','editorial','conflict'],['default','retry','running','payload','group'],['default','rollout','writing','uncertain','responsive'],['default','versions','technical','feedback','speech']][AFFECT_COMPONENTS.findIndex(c=>c.id===id)])[i],name:state.title,description:`${state.title} · ${AFFECT_COMPONENTS.find(c=>c.id===id).rule}. 브라우저 안의 로컬 예제입니다.`,html:renderAffect(state,`${uid}-${id}-${i}`),reference:{label:'KLIC HTML adaptation',name:'KLIC HTML adaptation',url:`https://github.com/flohoeller/affectui/blob/${AFFECT_PIN}/components/${id}.tsx`,implementation:'native-html-adaptation',commit:AFFECT_PIN}};});
}
const axes=['크기와 비율','타이포그래피','색과 명도 대비','배치와 정렬','간격과 그룹화','표면과 깊이','상호작용과 피드백'];
export const affectGuides=Object.freeze(Object.fromEntries(AFFECT_COMPONENTS.map(e=>[e.id,{
 id:e.id,summary:e.description+' KLIC의 테마와 토큰을 공유하며 독립된 로컬 상태로 확인하는 인터랙션 구성입니다.',implementation:'KLIC의 native HTML adaptation입니다. React props를 제공하지 않으며 모든 실행은 브라우저 로컬 데모입니다.',
 use:[e.rule+'이 필요한 에이전트 작업 화면에 사용합니다.','결과와 근거를 읽은 뒤 사용자가 행동을 선택할 수 있게 합니다.'],avoid:['실제 서버 실행이나 메시지 전송처럼 설명하지 않습니다.','색만으로 상태를 전달하지 않습니다.'],
 anatomy:[['트레이','작업 맥락과 현재 상태'],['카드','핵심 내용과 근거'],['행동','확인·취소·복구와 상태 안내']],
 states:[{name:'오류와 복구',condition:'실행 실패 또는 취소',response:'이전 상태와 내용을 유지하고 재시도 또는 실행 취소를 제공합니다.'},{name:'기본',condition:'첫 표시',response:'로컬 데모와 작업 목적을 안내합니다.'},{name:'탐색',condition:'Tab·Enter·Space',response:'버튼과 disclosure의 현재 상태를 동기화합니다.'},{name:'변경과 복구',condition:e.rule,response:'인스턴스별 상태를 갱신하고 결과를 status 영역에 알립니다.'}],
 api:[{kind:'상태',name:'data-af-initial',type:'JSON',default:'형태별 샘플 상태',description:'최초 렌더링 상태이며 인스턴스별 WeakMap에서 독립적으로 갱신합니다.'},{kind:'행동',name:'data-af-action',type:'string',default:'행동별 지정',description:'문서 위임 이벤트가 처리할 행동을 식별합니다. 실제 서버 실행을 의미하지 않습니다.'},{kind:'입력',name:'data-af-value',type:'string',default:'선택한 항목 또는 버전',description:'선택 값과 버전을 전달하고 해당 루트의 상태만 변경합니다.'},{kind:'DOM 식별',name:'data-af-family / data-af-uid',type:'string',default:e.id,description:'독립된 예제 루트와 고유한 접근성 연결 ID입니다.'},{kind:'초기화',name:'initAffectInteractions({copy,notify})',type:'function',default:'한 번 설치',description:'문서 위임 이벤트를 설치합니다. 반환 cleanup 함수는 지연 작업과 이벤트를 해제합니다.'}],
 examples:getAffectForms(e.id,`guide-${e.id}`).slice(0,2).map(f=>({id:f.id,title:f.name,description:f.description,code:f.html,dependencies:'affect-components.mjs · affect-components.css · affect-interactions.mjs · KLIC tokens'})),
 keyboard:[{key:'Tab / Shift+Tab',action:'실행 가능한 컨트롤을 DOM 순서대로 탐색합니다.'},{key:'Enter / Space',action:'native 버튼을 실행합니다.'},{key:'Escape',action:'대안 또는 피드백 영역을 닫고 여는 버튼으로 포커스를 돌립니다.'}],
 accessibility:['모든 disclosure에 aria-expanded와 aria-controls를 연결합니다.','상태 변경은 role=status로 알립니다. 음성 미지원 환경은 명확한 안내를 표시합니다.','hidden 콘텐츠는 Tab 탐색에서 제외합니다. 긴 한글과 JSON은 내부에서 줄바꿈·스크롤합니다.'],
 axes:axes.map((label,i)=>({label,description:['부모 폭에 맞추고 내용에 따라 높이가 늘어납니다.','선택한 KLIC 글꼴과 글자 배율을 상속합니다.','블루 행동·네이비 텍스트·뉴트럴 표면을 토큰으로 소비합니다.','맥락·내용·행동을 읽는 순서대로 배치합니다.','트레이 여백과 카드 내부 여백을 구분합니다.','트레이·hairline·절제된 그림자를 KLIC 재료 토큰에 연결합니다.',e.rule+'; 화면 이탈 시 지연 실행을 정리합니다.'][i]})),
 tokens:[{path:'klic.component.card.background.default',purpose:'카드 표면'},{path:'klic.semantic.color.accent',purpose:'동작과 선택'},{path:'klic.semantic.color.border',purpose:'카드 hairline'},{path:'klic.component.button.size.default.height',purpose:'행동 높이'}],related:['card','button','toast'],checks:['다섯 형태를 동시에 조작해 상태가 섞이지 않는지 확인합니다.','완료·취소·재시도 후 다른 화면으로 이동합니다.','260px와 Dark, 글자 배율 150%, reduced motion을 확인합니다.'],sources:[{href:'./affect-components.mjs',title:'Native HTML 구조·상태'},{href:'./affect-interactions.mjs',title:'인스턴스별 DOM 상호작용'},{href:'./affect-components.css',title:'KLIC 토큰 기반 스타일'},{href:'./affect-source-notice.md',title:'소스 라이선스 안내'}]
}])));

/*
MIT License

Copyright (c) 2026 Florian Höller (adfects)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
