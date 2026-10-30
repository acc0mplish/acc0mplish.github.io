import React, { useEffect, useId, useRef, useState } from 'react';
import { ArrowDownWideNarrow, ArrowUpDown, Building2, CalendarDays, CalendarPlus, Check, ChevronDown, CircleDollarSign, Ellipsis, Flag, History, Mail, Maximize2, Minimize2, PanelRightClose, PanelRightOpen, Plus, Search, Send, Share2, SlidersHorizontal, Sparkles, UserRound, Workflow, X, Zap } from 'lucide-react';
import { PersonAvatar } from '../PersonAvatar';
import './customer-inspector-scene.css';

type Stage = 'discovery' | 'proposal' | 'negotiation';
type Density = 'compact' | 'normal' | 'relaxed';
type Opportunity = {
  id: string; company: string; title: string; amount: number; date: string;
  owner: string; contact: string; role: string; priority: '높음' | '보통' | '낮음';
  stage: Stage; symbol: number;
};
const STAGES: { id: Stage; label: string }[] = [
  { id: 'discovery', label: '기회 발굴' },
  { id: 'proposal', label: '제안 완료' },
  { id: 'negotiation', label: '협상 중' },
];
const OPPORTUNITIES: Opportunity[] = [
  { id: 'crm-01', company: 'KLIC 커넥트', title: '고객 성공 플랫폼 연동', amount: 78000000, date: '11.18', owner: '박지민', contact: '강태우', role: '고객 경험팀 리드', priority: '높음', stage: 'discovery', symbol: 0 },
  { id: 'crm-02', company: 'KLIC 인사이트', title: '인프라 모니터링 환경 구축', amount: 230000000, date: '11.19', owner: '정유진', contact: '한소윤', role: '플랫폼 총괄', priority: '보통', stage: 'discovery', symbol: 1 },
  { id: 'crm-03', company: 'KLIC 클라우드', title: '클라우드 인프라 전환', amount: 156000000, date: '11.20', owner: '강태우', contact: '이서연', role: '기술전략팀 매니저', priority: '높음', stage: 'discovery', symbol: 2 },
  { id: 'crm-04', company: 'KLIC 페이', title: '통합 결제 게이트웨이', amount: 89000000, date: '11.21', owner: '강태우', contact: '김서연', role: '서비스 기획 리드', priority: '낮음', stage: 'discovery', symbol: 3 },
  { id: 'crm-05', company: 'KLIC 라이팅', title: 'AI 문서 작성 도우미', amount: 42500000, date: '11.22', owner: '박지민', contact: '정유진', role: '프로덕트 매니저', priority: '보통', stage: 'discovery', symbol: 4 },
  { id: 'crm-06', company: 'KLIC 노트', title: '기업 지식 관리 플랫폼', amount: 44000000, date: '11.23', owner: '박지민', contact: '한소윤', role: '사업개발팀 리드', priority: '낮음', stage: 'discovery', symbol: 5 },
  { id: 'crm-07', company: 'KLIC 넥스트', title: '차세대 프런트엔드 배포', amount: 82500000, date: '11.15', owner: '강태우', contact: '이서연', role: '프런트엔드 리드', priority: '높음', stage: 'proposal', symbol: 6 },
  { id: 'crm-08', company: 'KLIC 스튜디오', title: '디자인 시스템 마이그레이션', amount: 95000000, date: '11.16', owner: '김서연', contact: '박지민', role: '프로덕트 디자인 총괄', priority: '보통', stage: 'proposal', symbol: 7 },
  { id: 'crm-09', company: 'KLIC 웰니스', title: '임직원 웰니스 프로그램', amount: 115000000, date: '11.17', owner: '박지민', contact: '정유진', role: '피플팀 디렉터', priority: '보통', stage: 'proposal', symbol: 8 },
  { id: 'crm-10', company: 'KLIC 플로우', title: '엔지니어링 워크플로 개선', amount: 15000000, date: '11.14', owner: '강태우', contact: '한소윤', role: '개발운영팀 리드', priority: '낮음', stage: 'proposal', symbol: 9 },
  { id: 'crm-11', company: 'KLIC 도크', title: '컨테이너 운영 서비스', amount: 28000000, date: '11.13', owner: '박지민', contact: '강태우', role: '클라우드 아키텍트', priority: '낮음', stage: 'proposal', symbol: 10 },
  { id: 'crm-12', company: 'KLIC AI랩', title: '언어 모델 맞춤화', amount: 180000000, date: '11.10', owner: '이서연', contact: '강태우', role: 'AI사업팀 리드', priority: '높음', stage: 'negotiation', symbol: 11 },
  { id: 'crm-13', company: 'KLIC 모빌리티', title: '차량 운영 관리 시스템', amount: 120000000, date: '11.08', owner: '정유진', contact: '김서연', role: '서비스 운영 총괄', priority: '높음', stage: 'negotiation', symbol: 12 },
  { id: 'crm-14', company: 'KLIC 파이낸스', title: '글로벌 정산 플랫폼', amount: 67500000, date: '11.07', owner: '한소윤', contact: '박지민', role: '금융서비스 기획팀장', priority: '보통', stage: 'negotiation', symbol: 13 },
  { id: 'crm-15', company: 'KLIC 로지스', title: '글로벌 물류 최적화', amount: 145000000, date: '11.09', owner: '강태우', contact: '이서연', role: '사업전략 디렉터', priority: '높음', stage: 'negotiation', symbol: 14 },
  { id: 'crm-16', company: 'KLIC 데이터', title: '데이터 웨어하우스 재설계', amount: 92000000, date: '11.11', owner: '정유진', contact: '한소윤', role: '데이터 엔지니어링 리드', priority: '보통', stage: 'negotiation', symbol: 15 },
];
const won = (amount: number) => `₩${amount.toLocaleString('ko-KR')}`;
function CompanyMark({ symbol }: { symbol: number }) {
  const Icon = [Building2, Workflow, Sparkles, CircleDollarSign][symbol % 4];
  return <span className={`rcrm-company-mark rcrm-mark-${symbol % 4}`} aria-hidden="true"><Icon size={11} strokeWidth={2.3} /></span>;
}

export function CustomerInspectorScene({ density = 'normal' }: { density?: Density }) {
  const uid = useId().replace(/:/g, '');
  const [selected, setSelected] = useState('crm-08');
  const [stages, setStages] = useState<Record<string, Stage>>(() => Object.fromEntries(OPPORTUNITIES.map(record => [record.id, record.stage])));
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [search, setSearch] = useState('');
  const [highOnly, setHighOnly] = useState(false);
  const [sortAmount, setSortAmount] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [notes, setNotes] = useState<Record<string, string[]>>({});
  const [notice, setNotice] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const launchRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const moreRef = useRef<HTMLButtonElement>(null);
  const draftRef = useRef<HTMLTextAreaElement>(null);
  const recordsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const current = OPPORTUNITIES.find(record => record.id === selected)!;
  const currentStage = STAGES.find(stage => stage.id === stages[selected])!;
  const visible = OPPORTUNITIES.filter(record => `${record.company} ${record.title} ${record.owner}`.toLowerCase().includes(search.toLowerCase()) && (!highOnly || record.priority === '높음'));
  if (sortAmount) visible.sort((a, b) => b.amount - a.amount);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const update = () => setNarrow(root.getBoundingClientRect().width <= 760);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open || !narrow) return;
    closeRef.current?.focus({ preventScroll: true });
    const containFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !panelRef.current?.contains(event.target)) closeRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener('focusin', containFocus);
    return () => document.removeEventListener('focusin', containFocus);
  }, [open, narrow]);
  useEffect(() => {
    if (composerOpen) draftRef.current?.focus({ preventScroll: true });
  }, [composerOpen]);

  function closePanel() {
    setOpen(false); setMoreOpen(false); setExpanded(false);
    requestAnimationFrame(() => {
      const record = recordsRef.current[selected];
      if (record?.isConnected && record.getClientRects().length) record.focus({ preventScroll: true });
      else launchRef.current?.focus({ preventScroll: true });
    });
  }
  function selectRecord(id: string) {
    setSelected(id); setOpen(true); setComposerOpen(false); setMoreOpen(false); setDraft(''); setNotice('');
    if (narrow) requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));
  }
  function sceneKeyDown(event: React.KeyboardEvent) {
    if (event.key !== 'Escape' || event.nativeEvent.isComposing) return;
    if (moreOpen) { event.stopPropagation(); setMoreOpen(false); moreRef.current?.focus(); }
    else if (shareOpen) { event.stopPropagation(); setShareOpen(false); }
    else if (open) { event.preventDefault(); event.stopPropagation(); closePanel(); }
  }
  function modalKeyDown(event: React.KeyboardEvent) {
    if (!narrow || event.key !== 'Tab') return;
    const controls = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), select, textarea, a[href], [tabindex="0"]') || []).filter(element => element.getClientRects().length);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  function addActivity(event: React.FormEvent) {
    event.preventDefault();
    const note = draft.trim();
    if (!note) return;
    setNotes(previous => ({ ...previous, [selected]: [note, ...(previous[selected] || [])] }));
    setDraft(''); setComposerOpen(false); setNotice('활동을 이 샘플 고객에 기록했습니다.');
  }
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice('현재 미리보기 링크를 복사했습니다.');
    } catch { setNotice('주소창의 링크로 현재 미리보기를 공유할 수 있습니다.'); }
    setShareOpen(false); setMoreOpen(false);
  }
  function prepareActivity(text = '') { setDraft(text); setComposerOpen(true); setNotice(''); }

  return <div ref={rootRef} className={`rcrm-scene${open ? ' is-open' : ''}${expanded ? ' is-expanded' : ''}${narrow ? ' is-narrow' : ''}`} data-density={density} onKeyDown={sceneKeyDown}>
    <header className="rcrm-global-header" inert={open && narrow ? true : undefined}>
      <div className="rcrm-global-title"><h2>영업 기회</h2><span>샘플 데이터</span></div>
      <div className="rcrm-global-actions">
        <div className="rcrm-members" aria-label="참여 구성원"><PersonAvatar name="박지민" /><PersonAvatar name="김서연" /><PersonAvatar name="강태우" /></div>
        <div className="rcrm-share-anchor"><button type="button" className="rcrm-button" aria-expanded={shareOpen} aria-controls={`${uid}-share`} onClick={() => setShareOpen(value => !value)}><Share2 size={14} />공유</button>
          {shareOpen && <div className="rcrm-popover rcrm-share-popover" id={`${uid}-share`}><strong>파이프라인 공유</strong><span>샘플 미리보기 링크를 공유하세요.</span><button type="button" onClick={copyLink}><Share2 size={13} />링크 복사</button></div>}
        </div>
      </div>
    </header>
    <div className="rcrm-workspace">
      <main className="rcrm-board-area" aria-label="영업 기회 파이프라인" inert={open && narrow ? true : undefined}>
        <div className="rcrm-board-toolbar">
          <div className="rcrm-toolbar-buttons"><button type="button" className="rcrm-button" aria-pressed={sortAmount} onClick={() => setSortAmount(value => !value)}>{sortAmount ? <ArrowDownWideNarrow size={14} /> : <ArrowUpDown size={14} />}{sortAmount ? '금액순' : '정렬'}</button><button type="button" className={`rcrm-button${highOnly ? ' is-active' : ''}`} aria-pressed={highOnly} onClick={() => setHighOnly(value => !value)}><SlidersHorizontal size={14} />필터{highOnly && <span className="rcrm-filter-count">1</span>}</button></div>
          <label className="rcrm-search"><Search size={14} /><input type="search" aria-label="영업 기회 검색" placeholder="검색" value={search} onChange={event => setSearch(event.target.value)} /></label>
          {!open && <button ref={launchRef} type="button" className="rcrm-reopen" onClick={() => setOpen(true)}><PanelRightOpen size={15} />고객 상세</button>}
        </div>
        {highOnly && <div className="rcrm-active-filter"><Flag size={11} />우선순위: 높음<button type="button" aria-label="우선순위 필터 지우기" onClick={() => setHighOnly(false)}><X size={12} /></button></div>}
        <div className="rcrm-board-scroll">
          <div className="rcrm-lanes">
            {STAGES.map(stage => {
              const records = visible.filter(record => stages[record.id] === stage.id);
              return <section className="rcrm-lane" key={stage.id} aria-label={stage.label}>
                <header className="rcrm-lane-header"><h3><span className={`rcrm-stage-dot rcrm-stage-${stage.id}`} />{stage.label}<span className="rcrm-lane-count">{records.length}</span></h3><span className="rcrm-lane-tools" aria-hidden="true"><Plus size={14} /><Ellipsis size={14} /></span></header>
                <div className="rcrm-cards">{records.map(record => <button type="button" key={record.id} ref={node => { recordsRef.current[record.id] = node; }} className={`rcrm-deal-card${open && selected === record.id ? ' is-selected' : ''}`} aria-pressed={open && selected === record.id} aria-label={`${record.company}, ${record.title} 고객 상세 열기`} onClick={() => selectRecord(record.id)}>
                  <span className="rcrm-card-top"><span className="rcrm-card-company"><CompanyMark symbol={record.symbol} />{record.company}</span><PersonAvatar name={record.owner} /></span>
                  <strong>{record.title}</strong>
                  <span className="rcrm-card-meta"><span className={`rcrm-priority rcrm-priority-${record.priority === '높음' ? 'high' : record.priority === '보통' ? 'medium' : 'low'}`}>{record.priority}</span><span className="rcrm-meta-chip"><CalendarDays size={11} />{record.date}</span><span className="rcrm-meta-chip">{won(record.amount)}</span></span>
                </button>)}{!records.length && <div className="rcrm-lane-empty">표시할 영업 기회가 없습니다.</div>}</div>
              </section>;
            })}
          </div>
        </div>
      </main>
      {open && <aside ref={panelRef} className="rcrm-inspector" role={narrow ? 'dialog' : 'complementary'} aria-modal={narrow ? true : undefined} aria-labelledby={`${uid}-title`} aria-describedby={`${uid}-scope`} onKeyDown={modalKeyDown}>
        <header className="rcrm-inspector-header"><h2 id={`${uid}-title`}>{current.title}</h2><div className="rcrm-inspector-actions"><button type="button" className="rcrm-icon-button rcrm-expand" aria-label={expanded ? '패널 기본 너비로' : '패널 확장'} aria-pressed={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button><div className="rcrm-more-anchor"><button ref={moreRef} type="button" className="rcrm-icon-button" aria-label="고객 상세 더 보기" aria-expanded={moreOpen} aria-controls={`${uid}-more`} onClick={() => setMoreOpen(value => !value)}><Ellipsis size={18} /></button>{moreOpen && <div id={`${uid}-more`} className="rcrm-popover rcrm-more-popover"><button type="button" onClick={copyLink}><Share2 size={13} />미리보기 링크 복사</button><button type="button" onClick={() => { setMoreOpen(false); prepareActivity(); }}><Plus size={13} />활동 기록 추가</button></div>}</div><button ref={closeRef} type="button" className="rcrm-icon-button" aria-label="패널 닫기" title="패널 닫기 · Esc" onClick={closePanel}><PanelRightClose size={18} /></button></div></header>
        <div className="rcrm-inspector-scroll">
          <section className="rcrm-details"><h3>고객 상세</h3><p id={`${uid}-scope`} className="rcrm-sr-only">샘플 데이터. 변경 사항은 이 미리보기에만 반영됩니다.</p>
            <dl className="rcrm-properties">
              <div><dt><Building2 size={15} />고객사</dt><dd><CompanyMark symbol={current.symbol} />{current.company}</dd></div>
              <div><dt><CircleDollarSign size={15} />제안 금액</dt><dd>{won(current.amount)}</dd></div>
              <div><dt><Workflow size={15} />영업 단계</dt><dd className="rcrm-stage-value"><span className={`rcrm-stage-dot rcrm-stage-${stages[selected]}`} /><select aria-label="영업 단계 변경" value={stages[selected]} onChange={event => { const value = event.target.value as Stage; setStages(previous => ({ ...previous, [selected]: value })); setNotice(`${STAGES.find(stage => stage.id === value)?.label} 단계로 이동했습니다.`); }}>{STAGES.map(stage => <option key={stage.id} value={stage.id}>{stage.label}</option>)}</select><ChevronDown size={12} aria-hidden="true" /></dd></div>
              <div><dt><CalendarDays size={15} />예상 계약일</dt><dd>{`2026년 ${Number(current.date.split('.')[0])}월 ${Number(current.date.split('.')[1])}일`}</dd></div>
              <div><dt><UserRound size={15} />담당자</dt><dd><PersonAvatar name={current.owner} />{current.owner}</dd></div>
              <div><dt><Flag size={15} />우선순위</dt><dd><span className={`rcrm-priority rcrm-priority-${current.priority === '높음' ? 'high' : current.priority === '보통' ? 'medium' : 'low'}`}>{current.priority}</span></dd></div>
              <div><dt><History size={15} />마지막 활동</dt><dd>{notes[selected]?.length ? '방금 전' : '2시간 전'}</dd></div>
              <div><dt><CalendarPlus size={15} />등록일</dt><dd>2026년 10월 15일</dd></div>
            </dl>
          </section>
          <section className="rcrm-contact-section"><h3>주요 연락처</h3><div className="rcrm-contact-card"><PersonAvatar name={current.contact} /><div className="rcrm-contact-info"><strong>{current.contact}</strong><span>{current.role}</span></div><div className="rcrm-contact-actions"><button type="button" className="rcrm-icon-button" aria-label={`${current.contact} 이메일 활동 기록`} title="이메일 활동 기록" onClick={() => prepareActivity(`${current.contact}님께 제안서를 이메일로 공유했습니다.`)}><Mail size={16} /></button><button type="button" className="rcrm-icon-button" aria-label={`${current.contact} 미팅 기록`} title="미팅 기록" onClick={() => prepareActivity(`${current.contact}님과 후속 미팅을 진행했습니다.`)}><CalendarPlus size={16} /></button></div></div></section>
          <section className="rcrm-activity-section"><div className="rcrm-section-title"><h3>최근 활동</h3><button type="button" className="rcrm-button" aria-expanded={composerOpen} onClick={() => { if (composerOpen) setComposerOpen(false); else prepareActivity(); }}><Zap size={14} />활동 기록</button></div>
            {composerOpen && <form className="rcrm-composer" onSubmit={addActivity}><label htmlFor={`${uid}-activity`}>활동 메모</label><textarea id={`${uid}-activity`} ref={draftRef} value={draft} maxLength={1500} onChange={event => setDraft(event.target.value)} placeholder="고객과 나눈 내용을 기록하세요." /><div><span>이 샘플 고객에만 저장됩니다.</span><button type="button" onClick={() => setComposerOpen(false)}>취소</button><button type="submit" disabled={!draft.trim()}><Send size={12} />기록</button></div></form>}
            <ol className="rcrm-activity-list">{(notes[selected] || []).map((note, index) => <li className="rcrm-activity-item" key={`${selected}-note-${index}`}><span className="rcrm-event-icon"><Check size={17} /></span><div className="rcrm-event-body"><p><strong>{current.owner}</strong>님이 활동을 기록했습니다.</p><time>방금 전</time><div className="rcrm-note-card"><p>{note}</p><span className="rcrm-note-tag">메모</span></div></div></li>)}
              <li className="rcrm-activity-item"><span className="rcrm-event-icon"><Mail size={18} /></span><div className="rcrm-event-body"><p><strong>{current.owner}</strong>님이 제안서를 보냈습니다. 수신자: <strong>{current.contact}</strong></p><time dateTime="2026-10-27T10:15">2026년 10월 27일, 오전 10:15</time><div className="rcrm-note-card"><p>{current.id === 'crm-08' ? '마이그레이션 로드맵과 견적서를 전달했습니다. 12개월 전환 일정과 격주 점검을 제안했습니다.' : `${current.title}의 추진 범위와 견적서를 전달했습니다. 후속 미팅에서 세부 일정을 협의할 예정입니다.`}</p><div className="rcrm-note-tags"><span className="rcrm-note-tag">제안서</span><span className="rcrm-note-tag">이메일</span></div></div></div></li>
              <li className="rcrm-activity-item"><span className="rcrm-event-icon rcrm-event-meeting"><CalendarDays size={17} /></span><div className="rcrm-event-body"><p><strong>{current.contact}</strong>님과 요구사항 미팅을 진행했습니다.</p><time dateTime="2026-10-26T14:00">2026년 10월 26일, 오후 2:00</time><div className="rcrm-note-card"><p>프로젝트 목표와 내부 검토 일정을 확인했습니다.</p><span className="rcrm-note-tag">미팅</span></div></div></li>
            </ol>
          </section>
        </div>
      </aside>}
    </div>
    <span className="rcrm-sr-only" role="status" aria-live="polite">{notice || `${current.company}, ${currentStage.label}`}</span>
  </div>;
}
