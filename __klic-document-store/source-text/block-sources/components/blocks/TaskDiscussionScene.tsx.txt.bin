import React, {useEffect, useId, useRef, useState} from 'react';
import {AtSign, Check, ChevronDown, ChevronUp, ChevronsLeft, ChevronsRight, Clock3, History, Home, Inbox, LayoutGrid, Link2, ListFilter, Maximize2, MessageCircle, Minimize2, MoreHorizontal, Plus, Search, SlidersHorizontal, Smile, X} from 'lucide-react';
import {PersonAvatar} from '../PersonAvatar';
import './task-discussion-scene.css';

type Status = 'todo' | 'progress' | 'done';
type Task = {id: string; title: string; owner: string; date: string; label: string; status: Status; description: string; tool: string};
type Comment = {id: string; author: string; time: string; text: string; reaction: string; replyTo?: string};
type TaskState = {status: Status; draft: string; comments: Comment[]; reactions: Record<string, boolean>; replyTo: string | null};
const TASKS: Task[] = [
  {id:'task-101', title:'경쟁사 분석을 준비하고\n이해관계자에게 공유하기', owner:'이서연', date:'2026년 11월 5일', label:'리서치', status:'done', tool:'리서치', description:'주요 경쟁사의 제품, 핵심 기능, 가격 정책과 타깃 고객을 조사합니다. 조사 내용을 한눈에 비교할 수 있는 자료로 정리하고, 다음 제품 회의에서 이해관계자와 공유합니다.\n\n고객에게 제공하는 가치와 우리 제품이 집중할 기회를 함께 제안해 주세요.'},
  {id:'task-102', title:'와이어프레임을 하이파이 디자인으로 전환하기', owner:'김서연', date:'2026년 11월 6일', label:'디자인', status:'todo', tool:'Figma', description:'승인된 와이어프레임을 바탕으로 주요 화면을 구체화합니다. 공통 컴포넌트와 디자인 토큰을 적용하고 화면 사이의 흐름을 확인합니다.'},
  {id:'task-103', title:'디자인 시스템 문서 정리하기', owner:'정유진', date:'2026년 11월 8일', label:'디자인', status:'todo', tool:'문서', description:'컴포넌트의 사용 방법과 상태별 동작을 문서에 정리합니다. 팀이 반복해서 확인하는 예시를 먼저 보완합니다.'},
  {id:'task-104', title:'조건부 로직을 적용한 프로토타입 제작하기', owner:'강태우', date:'2026년 11월 10일', label:'디자인', status:'todo', tool:'프로토타입', description:'입력과 선택에 따라 달라지는 화면 흐름을 프로토타입으로 구현합니다. 테스트에서 확인할 핵심 시나리오를 포함합니다.'},
  {id:'task-105', title:'사용자 인수 테스트 진행하기', owner:'박지민', date:'2026년 11월 12일', label:'검증', status:'todo', tool:'미팅', description:'이해관계자와 함께 주요 사용자 시나리오를 확인하고, 배포 전에 해결할 피드백을 정리합니다.'},
  {id:'task-106', title:'정보 구조와 탐색 체계 정의하기', owner:'한소윤', date:'2026년 11월 5일', label:'디자인', status:'progress', tool:'Miro', description:'사용자가 필요한 정보에 쉽게 도달할 수 있도록 메뉴와 콘텐츠 구조를 정리합니다. 리서치 결과를 바탕으로 우선순위를 조율합니다.'},
  {id:'task-107', title:'무드보드를 만들고 팀에 공유하기', owner:'김서연', date:'2026년 11월 7일', label:'디자인', status:'progress', tool:'Figma', description:'제품의 방향을 보여 주는 색상, 이미지, 타이포그래피 예시를 모아 팀과 논의합니다.'},
  {id:'task-108', title:'사용자 흐름과 개선 기회 정리하기', owner:'정유진', date:'2026년 11월 9일', label:'리서치', status:'progress', tool:'FigJam', description:'현재 사용자 흐름을 시각화하고, 사용자가 막히는 지점과 개선할 기회를 함께 기록합니다.'},
  {id:'task-109', title:'초기 화면 구성안 검토하기', owner:'강태우', date:'2026년 11월 10일', label:'디자인', status:'progress', tool:'Figma', description:'핵심 화면의 구성안을 검토하고 다음 디자인 단계에서 반영할 내용을 정리합니다.'},
];
const STATUS_LABEL: Record<Status, string> = {todo:'할 일', progress:'진행 중', done:'완료'};
function initialState(task: Task, index: number): TaskState {
  return {status:task.status, draft:'', reactions:{}, replyTo:null, comments:index===0 ? [
    {id:'first', author:'이서연', time:'32분 전', text:'태우님, 감사합니다. 목록을 받으면 각 경쟁사의 제품과 주요 기능, 가격, 타깃 시장을 자세히 조사하겠습니다. 팀이 내용을 쉽게 이해하고 의사결정에 활용할 수 있도록 비교 항목별로 정리해 공유할게요.', reaction:'👌'},
    {id:'second', author:'강태우', time:'6분 전', text:'좋습니다. 경쟁사가 제공하는 가치와 시장에서의 포지셔닝을 명확하게 파악하는 것이 중요해요. 이번 분석이 다음 방향을 정하는 데 도움이 될 것 같습니다.', reaction:'👍'},
  ] : [{id:'first', author:task.owner, time:'1시간 전', text:'현재 작업 내용을 정리하고 있습니다. 검토가 필요한 부분이나 의견이 있으면 이곳에 남겨 주세요. 다음 진행 내용에 함께 반영하겠습니다.', reaction:'👍'}]};
}

export function TaskDiscussionScene({density='normal'}:{density?:'compact'|'normal'|'relaxed'}) {
  const uid = useId().replace(/:/g, '');
  const [selected, setSelected] = useState(TASKS[0].id);
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<'comments'|'description'>('comments');
  const [states, setStates] = useState<Record<string, TaskState>>(() => Object.fromEntries(TASKS.map((task, index) => [task.id, initialState(task, index)])));
  const [menu, setMenu] = useState<'history'|'more'|null>(null);
  const [notice, setNotice] = useState('');
  const panelRef = useRef<HTMLElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const recordRefs = useRef<Record<string, HTMLButtonElement|null>>({});
  const triggerRef = useRef<HTMLButtonElement|null>(null);
  const current = TASKS.find(task => task.id === selected)!;
  const state = states[selected];
  const taskIndex = TASKS.findIndex(task => task.id === selected);
  const patch = (value: Partial<TaskState>) => setStates(previous => ({...previous, [selected]:{...previous[selected], ...value}}));

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const closeButton = panel?.querySelector<HTMLButtonElement>('[data-rtask-close]');
    closeButton?.focus({preventScroll:true});
    const guard = (event: FocusEvent) => {
      if (panel && event.target instanceof Node && !panel.contains(event.target)) closeButton?.focus({preventScroll:true});
    };
    document.addEventListener('focusin', guard);
    return () => document.removeEventListener('focusin', guard);
  }, [open]);

  function closePanel() {
    setOpen(false); setMenu(null);
    requestAnimationFrame(() => {
      const trigger = triggerRef.current?.isConnected ? triggerRef.current : recordRefs.current[selected];
      trigger?.focus({preventScroll:true});
    });
  }
  function openTask(id: string, trigger?: HTMLButtonElement) {
    if (trigger) triggerRef.current = trigger;
    setSelected(id); setOpen(true); setMenu(null); setNotice(''); setTab('comments');
  }
  function navigate(delta: number) {
    const task = TASKS[taskIndex + delta];
    if (task) openTask(task.id);
  }
  function onPanelKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape' && !event.nativeEvent.isComposing) {
      event.preventDefault(); event.stopPropagation(); closePanel(); return;
    }
    if (event.key !== 'Tab') return;
    const elements = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex="0"]') || []).filter(element => element.getClientRects().length > 0);
    const first = elements[0], last = elements[elements.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {event.preventDefault(); last?.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first?.focus();}
  }
  function submitComment(event: React.FormEvent) {
    event.preventDefault();
    const text = state.draft.trim();
    if (!text) return;
    patch({draft:'', replyTo:null, comments:[...state.comments, {id:'comment-'+Date.now(), author:'김서연', time:'방금 전', text, reaction:'👍', replyTo:state.replyTo || undefined}]});
    setNotice('댓글을 추가했습니다.');
    requestAnimationFrame(() => composerRef.current?.focus());
  }
  function insertText(text: string) {
    patch({draft:state.draft + text});
    requestAnimationFrame(() => composerRef.current?.focus());
  }
  function switchTab(next: 'comments'|'description') {setTab(next); setMenu(null);}
  function tabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 'comments' : event.key === 'End' ? 'description' : tab === 'comments' ? 'description' : 'comments';
    switchTab(next);
    requestAnimationFrame(() => document.getElementById(uid+'-tab-'+next)?.focus());
  }

  return <div className={'rtask-scene'+(open?' is-open':'')+(expanded?' is-expanded':'')} data-density={density}>
    <div className="rtask-app" inert={open ? true : undefined}>
      <nav className="rtask-sidebar" aria-label="워크스페이스 탐색">
        <div className="rtask-brand"><span className="rtask-brand-mark">K</span><strong>KLIC Studio</strong><ChevronsLeft size={16}/></div>
        <div className="rtask-search"><Search size={14}/><span>검색</span><kbd>⌘ K</kbd></div>
        <div className="rtask-navlinks"><span><Home size={15}/>홈</span><span><Inbox size={15}/>받은 편지함</span><span><Check size={15}/>내 작업</span></div>
        <div className="rtask-sidebar-label">워크스페이스<Plus size={14}/></div>
        <div className="rtask-workspaces"><span className="is-active"><span className="rtask-project-dot"/>인터페이스 개선</span><span><span className="rtask-project-dot is-light"/>브랜드 스튜디오</span><span><span className="rtask-project-dot is-light"/>제품 리서치</span><span><span className="rtask-project-dot is-light"/>모바일 프로젝트</span></div>
        <div className="rtask-sidebar-bottom"><span><Plus size={14}/>팀원 초대</span><small>샘플 데이터</small><div><PersonAvatar name="김서연" width={24} height={24}/><span>김서연</span><ChevronDown size={14}/></div></div>
      </nav>
      <main className="rtask-workspace">
        <header className="rtask-workspace-title"><span className="rtask-project-icon"><LayoutGrid size={20}/></span><h2>인터페이스 개선</h2><span className="rtask-board-members"><PersonAvatar name="김서연" width={26} height={26}/><PersonAvatar name="이서연" width={26} height={26}/><PersonAvatar name="강태우" width={26} height={26}/></span></header>
        <div className="rtask-board-toolbar"><span><LayoutGrid size={14}/>칸반 보드<ChevronDown size={13}/></span><span><ListFilter size={14}/>필터</span><span><SlidersHorizontal size={14}/>정렬</span></div>
        <div className="rtask-board">
          {(['todo','progress','done'] as Status[]).map(status => <section className="rtask-column" key={status}>
            <h3>{STATUS_LABEL[status]}<small>{TASKS.filter(task => states[task.id].status === status).length}</small><MoreHorizontal size={16}/><Plus size={17}/></h3>
            {TASKS.filter(task => states[task.id].status === status).map((task, index) => <button key={task.id} type="button" ref={node => {recordRefs.current[task.id] = node;}} className={'rtask-card'+(selected === task.id ? ' is-selected':'')} onClick={event => openTask(task.id, event.currentTarget)} aria-label={'작업 상세 열기: '+task.title}>
              {task.id === 'task-108' && <div className="rtask-flow-preview"><img src="./panel-previews/flow-connector-parallel.png" alt="사용자 흐름 검토 자료"/></div>}
              <strong>{task.title}</strong><span className="rtask-card-tag">{task.label}</span>
              <span className="rtask-card-bottom"><span className="rtask-card-avatars"><PersonAvatar name={task.owner} width={21} height={21}/><PersonAvatar name={index%2 ? '이서연':'강태우'} width={21} height={21}/>{index%2 === 0 && <PersonAvatar name="한소윤" width={21} height={21}/>}</span><span className="rtask-tool">{task.tool}</span><span><MessageCircle size={12}/>{states[task.id].comments.length}</span>{states[task.id].status === 'done' ? <Check size={13} className="rtask-done-check"/> : <span><Clock3 size={12}/>{index+2}일</span>}</span>
            </button>)}
          </section>)}
        </div>
        <div className="rtask-board-hint">작업 카드를 선택하면 대화를 이어갈 수 있습니다.</div>
      </main>
    </div>
    {open && <>
      <button type="button" className="rtask-backdrop" tabIndex={-1} onClick={closePanel} aria-label="배경을 눌러 패널 닫기"/>
      <aside className="rtask-drawer" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={uid+'-title'} aria-describedby={uid+'-scope'} tabIndex={-1} onKeyDown={onPanelKeyDown}>
        <header className="rtask-drawer-toolbar"><div><button type="button" data-rtask-close aria-label="패널 닫기" title="패널 닫기 · Esc" onClick={closePanel}><ChevronsRight size={19}/></button><button type="button" aria-label={expanded?'패널 기본 너비로':'패널 확장'} aria-pressed={expanded} onClick={() => setExpanded(value => !value)}>{expanded?<Minimize2 size={16}/>:<Maximize2 size={16}/>}</button><i/><button type="button" aria-label="이전 작업" disabled={taskIndex===0} onClick={() => navigate(-1)}><ChevronUp size={18}/></button><button type="button" aria-label="다음 작업" disabled={taskIndex===TASKS.length-1} onClick={() => navigate(1)}><ChevronDown size={18}/></button></div><div><button type="button" aria-label="작업 활동 기록" aria-expanded={menu==='history'} onClick={() => setMenu(menu==='history'?null:'history')}><Clock3 size={17}/></button><button type="button" aria-label="작업 더 보기" aria-expanded={menu==='more'} onClick={() => setMenu(menu==='more'?null:'more')}><MoreHorizontal size={18}/></button></div>
          {menu && <div className="rtask-toolbar-popover">{menu==='history'?<><strong><History size={14}/>활동 기록</strong><p>강태우님이 작업을 만들었습니다.<small>오늘 오전 9:30</small></p><p>현재 상태: {STATUS_LABEL[state.status]}<small>이 미리보기에 반영됨</small></p></>:<><button type="button" onClick={() => switchTab('description')}>작업 설명 보기</button><button type="button" onClick={() => {switchTab('comments'); requestAnimationFrame(() => composerRef.current?.focus());}}>댓글 작성하기</button></>}</div>}
        </header>
        <div className="rtask-drawer-scroll">
          <div className="rtask-task-heading"><h2 id={uid+'-title'}>{current.title}</h2><span id={uid+'-scope'} className="rtask-sr-only">샘플 데이터. 변경 사항과 댓글은 현재 미리보기에만 반영됩니다.</span>
            <dl className="rtask-properties">
              <div><dt>상태</dt><dd><span className={'rtask-status-control is-'+state.status}>{state.status==='done' && <Check size={12}/>}<select aria-label="작업 상태 변경" value={state.status} onChange={event => {patch({status:event.target.value as Status}); setNotice('상태를 '+STATUS_LABEL[event.target.value as Status]+'로 변경했습니다.');}}><option value="todo">할 일</option><option value="progress">진행 중</option><option value="done">완료</option></select><ChevronDown size={11}/></span></dd></div>
              <div><dt>담당자</dt><dd><PersonAvatar name={current.owner} width={21} height={21}/>{current.owner}</dd></div>
              <div><dt>마감일</dt><dd>{current.date}</dd></div>
              <div><dt>라벨</dt><dd><span className="rtask-label">{current.label}</span></dd></div>
            </dl>
          </div>
          <div className="rtask-tabs" role="tablist" aria-label="작업 정보"><button type="button" id={uid+'-tab-comments'} role="tab" aria-selected={tab==='comments'} aria-controls={uid+'-content'} tabIndex={tab==='comments'?0:-1} onClick={() => switchTab('comments')} onKeyDown={tabKeyDown}>댓글<span>{state.comments.length+1}</span></button><button type="button" id={uid+'-tab-description'} role="tab" aria-selected={tab==='description'} aria-controls={uid+'-content'} tabIndex={tab==='description'?0:-1} onClick={() => switchTab('description')} onKeyDown={tabKeyDown}>설명</button></div>
          <div className="rtask-tab-content" id={uid+'-content'} role="tabpanel" aria-labelledby={uid+'-tab-'+tab} tabIndex={0}>
            {tab==='comments'?<>
              <form className="rtask-composer" onSubmit={submitComment}>
                {state.replyTo && <div className="rtask-reply-target"><span>{state.replyTo}님에게 답글</span><button type="button" aria-label="답글 취소" onClick={() => patch({replyTo:null})}><X size={13}/></button></div>}
                <label className="rtask-sr-only" htmlFor={uid+'-comment'}>댓글 작성</label><textarea ref={composerRef} id={uid+'-comment'} maxLength={2000} value={state.draft} onChange={event => patch({draft:event.target.value})} placeholder={state.replyTo?'답글을 남겨 주세요':'댓글을 남겨 주세요'}/>
                <div className="rtask-composer-actions"><button type="button" aria-label="댓글에 이모지 추가" title="이모지 추가" onClick={() => insertText(' 🙂')}><Smile size={17}/></button><button type="button" aria-label="댓글에 담당자 멘션" title="담당자 멘션" onClick={() => insertText('@'+current.owner+' ')}><AtSign size={17}/></button><button type="button" aria-label="댓글에 링크 추가" title="링크 추가" onClick={() => insertText(' https://')}><Link2 size={17}/></button><button type="submit" className="rtask-submit" disabled={!state.draft.trim()}>등록</button></div>
              </form>
              <div className="rtask-created"><PersonAvatar name="강태우" width={25} height={25}/><span><strong>강태우</strong>님이 작업을 만들었습니다.<small>· 2시간 전</small></span></div>
              <div className="rtask-comments">{state.comments.map(comment => <article className="rtask-comment" key={comment.id}>
                <div className="rtask-comment-header"><PersonAvatar name={comment.author} width={24} height={24}/><strong>{comment.author}</strong><span>· {comment.time}</span></div>
                {comment.replyTo && <span className="rtask-comment-reply-to">{comment.replyTo}님에게 답글</span>}
                <p>{comment.text}</p>
                <div className="rtask-comment-actions"><button type="button" className="rtask-add-reaction" aria-label={comment.author+'님의 댓글에 공감'} aria-pressed={Boolean(state.reactions[comment.id])} onClick={() => patch({reactions:{...state.reactions, [comment.id]:!state.reactions[comment.id]}})}><Smile size={14}/></button><button type="button" className="rtask-reaction" aria-label={comment.author+'님의 댓글에 '+comment.reaction+' 반응'} aria-pressed={Boolean(state.reactions[comment.id])} onClick={() => patch({reactions:{...state.reactions, [comment.id]:!state.reactions[comment.id]}})}>{comment.reaction}<span>{state.reactions[comment.id]?2:1}</span></button><i/><button type="button" className="rtask-reply" onClick={() => {patch({replyTo:comment.author}); requestAnimationFrame(() => composerRef.current?.focus());}}>답글</button></div>
              </article>)}</div>
            </>:<div className="rtask-description"><h3>작업 설명</h3>{current.description.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}<div><PersonAvatar name={current.owner} width={24} height={24}/><span>{current.owner} · 마지막 수정 2시간 전</span></div></div>}
          </div>
          <div className="rtask-sr-only" role="status" aria-live="polite">{notice}</div>
        </div>
      </aside>
    </>}
  </div>;
}
