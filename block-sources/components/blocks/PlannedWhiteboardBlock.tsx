import React, { useRef, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  CheckCircle2,
  Database,
  GitBranch,
  Heart,
  MessageSquareText,
  Plus,
  Server,
  Shield,
  StickyNote,
  TriangleAlert,
  X,
} from 'lucide-react';

export type PlannedWhiteboardDensity = 'compact' | 'normal' | 'relaxed';

export interface PlannedWhiteboardBlockProps {
  variant: string;
  density?: PlannedWhiteboardDensity;
}

const COLOR = {
  accent: 'var(--klic-component-block-color-accent)',
  border: 'var(--klic-component-block-color-border)',
  controlBorder: 'var(--klic-component-block-color-control-border)',
  danger: 'var(--klic-component-block-color-danger)',
  dangerSurface: 'var(--klic-component-block-color-danger-surface)',
  muted: 'var(--klic-component-block-color-muted)',
  panel: 'var(--klic-component-block-color-panel)',
  selected: 'var(--klic-component-block-color-selected)',
  soft: 'var(--klic-component-block-color-soft)',
  surface: 'var(--klic-component-block-color-surface)',
  text: 'var(--klic-component-block-color-text)',
  warning: 'var(--klic-component-block-color-warning)',
  warningSurface: 'var(--klic-component-block-color-warning-surface)',
} as const;

const FOCUS_CLASS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--klic-component-block-color-accent)]';
const BOARD_WIDTH = 820;
const BOARD_HEIGHT = 390;
const CARD_WIDTH = 166;
const CARD_HEIGHT = 112;

function svgPrefix(id: string) {
  return `klic-board-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

function BoardHeader({ title, description }: { title: string; description: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', marginBottom: 14 }}>
      <div>
        <h2 style={{ margin: 0, color: COLOR.text, fontSize: 18, fontWeight: 730, lineHeight: 1.25 }}>{title}</h2>
        <p style={{ margin: '5px 0 0', color: COLOR.muted, fontSize: 11 }}>{description}</p>
      </div>
      <span style={{ border: `1px solid ${COLOR.border}`, borderRadius: 20, padding: '5px 9px', background: COLOR.panel, color: COLOR.muted, fontSize: 10, fontWeight: 650 }}>고정 샘플 보드</span>
    </div>
  );
}

function SampleBanner() {
  return (
    <p role="note" style={{ margin: '0 0 14px', padding: '8px 10px', border: `1px solid ${COLOR.border}`, borderRadius: 9, background: COLOR.soft, color: COLOR.muted, fontSize: 10 }}>
      로컬 예시 데이터 · 편집과 상태 변경은 이 미리보기에만 반영됩니다. 서버 저장, 실시간 지표, 협업 연결은 없습니다.
    </p>
  );
}

function BoardPanel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <section style={{ minWidth: 0, border: `1px solid ${COLOR.border}`, borderRadius: 12, padding: 13, background: COLOR.panel, ...style }}>{children}</section>;
}

function ToolbarButton({ children, label, onClick, disabled = false }: { children: React.ReactNode; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={FOCUS_CLASS}
      style={{ width: 31, height: 31, display: 'grid', placeItems: 'center', border: `1px solid ${COLOR.controlBorder}`, borderRadius: 8, background: COLOR.panel, color: disabled ? COLOR.muted : COLOR.text, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1 }}
    >
      {children}
    </button>
  );
}

type PositionedItem = { id: string; title: string; x: number; y: number; width?: number };
type DragStart = { id: string; pointerX: number; pointerY: number; originX: number; originY: number };

function useMovableItems<T extends PositionedItem>(initial: T[]) {
  const [items, setItems] = useState(initial);
  const [selectedId, setSelectedId] = useState<string | null>(initial[0]?.id ?? null);
  const dragStart = useRef<DragStart | null>(null);

  const moveBy = (id: string, dx: number, dy: number) => {
    setItems((current) => current.map((item) => {
      if (item.id !== id) return item;
      const width = item.width ?? CARD_WIDTH;
      return { ...item, x: Math.max(8, Math.min(BOARD_WIDTH - width - 8, item.x + dx)), y: Math.max(8, Math.min(BOARD_HEIGHT - CARD_HEIGHT - 8, item.y + dy)) };
    }));
  };

  const updateItem = (id: string, update: Partial<T>) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...update } : item));
  };

  const onPointerDown = (id: string, event: React.PointerEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('button,select,input,[data-no-drag="true"]')) return;
    const item = items.find((candidate) => candidate.id === id);
    if (!item) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { id, pointerX: event.clientX, pointerY: event.clientY, originX: item.x, originY: item.y };
    setSelectedId(id);
  };

  const onPointerMove = (id: string, event: React.PointerEvent<HTMLElement>) => {
    const start = dragStart.current;
    if (!start || start.id !== id) return;
    setItems((current) => current.map((item) => {
      if (item.id !== id) return item;
      const width = item.width ?? CARD_WIDTH;
      return { ...item, x: Math.max(8, Math.min(BOARD_WIDTH - width - 8, start.originX + event.clientX - start.pointerX)), y: Math.max(8, Math.min(BOARD_HEIGHT - CARD_HEIGHT - 8, start.originY + event.clientY - start.pointerY)) };
    }));
  };

  const onPointerUp = () => { dragStart.current = null; };
  const keyDown = (id: string, event: React.KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    const step = event.shiftKey ? 28 : 12;
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step],
    };
    if (delta[event.key]) {
      event.preventDefault();
      setSelectedId(id);
      moveBy(id, ...delta[event.key]);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedId(id);
    }
  };

  return { items, selectedId, setSelectedId, moveBy, updateItem, onPointerDown, onPointerMove, onPointerUp, keyDown };
}

function MovableCard<T extends PositionedItem>({
  item,
  selected,
  children,
  onSelect,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
  width = CARD_WIDTH,
}: {
  item: T;
  selected: boolean;
  children: React.ReactNode;
  onSelect: () => void;
  onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerUp: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  width?: number;
}) {
  return (
    <article
      tabIndex={0}
      role="group"
      aria-label={`${item.title}. 방향키로 이동하고 Enter 또는 Space로 선택합니다.`}
      aria-roledescription="이동 가능한 보드 항목"
      onClick={onSelect}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      className={FOCUS_CLASS}
      style={{ position: 'absolute', left: item.x, top: item.y, width: item.width ?? width, boxSizing: 'border-box', border: `1px solid ${selected ? COLOR.accent : COLOR.border}`, borderRadius: 11, padding: 10, background: selected ? COLOR.selected : COLOR.panel, color: COLOR.text, boxShadow: selected ? `0 0 0 2px ${COLOR.selected}` : 'none', touchAction: 'none', cursor: 'grab', userSelect: 'none' }}
    >
      {children}
    </article>
  );
}

function MoveToolbar({ selectedTitle, onMove }: { selectedTitle?: string; onMove: (dx: number, dy: number) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      <span style={{ marginRight: 3, color: COLOR.muted, fontSize: 10 }}>선택 항목 이동 · {selectedTitle ?? '항목 선택'}</span>
      <ToolbarButton label="왼쪽으로 이동" disabled={!selectedTitle} onClick={() => onMove(-16, 0)}><ArrowLeft size={14} /></ToolbarButton>
      <ToolbarButton label="위로 이동" disabled={!selectedTitle} onClick={() => onMove(0, -16)}><ArrowUp size={14} /></ToolbarButton>
      <ToolbarButton label="아래로 이동" disabled={!selectedTitle} onClick={() => onMove(0, 16)}><ArrowDown size={14} /></ToolbarButton>
      <ToolbarButton label="오른쪽으로 이동" disabled={!selectedTitle} onClick={() => onMove(16, 0)}><ArrowRight size={14} /></ToolbarButton>
      <span style={{ color: COLOR.muted, fontSize: 10 }}>키보드: 방향키 · Shift+방향키</span>
    </div>
  );
}

type ArchitectureNode = PositionedItem & { subtitle: string; icon: 'server' | 'cache' | 'database' | 'shield'; detail: string };
const ARCHITECTURE_NODES: ArchitectureNode[] = [
  { id: 'gateway', title: '로드밸런서', subtitle: 'HTTPS · 요청 분산', icon: 'shield', detail: '요청을 가용 영역별 API 서버로 전달하는 샘플 진입점입니다.', x: 35, y: 132 },
  { id: 'api-a', title: 'API 서버 A', subtitle: 'REST · 앱 서비스', icon: 'server', detail: '조직 및 사용자 요청을 처리하는 샘플 API 인스턴스입니다.', x: 265, y: 42 },
  { id: 'api-b', title: 'API 서버 B', subtitle: 'REST · 앱 서비스', icon: 'server', detail: '두 번째 샘플 인스턴스입니다. 두 서버는 같은 캐시와 저장소를 사용합니다.', x: 265, y: 220 },
  { id: 'cache', title: '세션 캐시', subtitle: 'Redis · TTL 30m', icon: 'cache', detail: '세션 조회를 위한 캐시 계층입니다. 수치는 구성 예시이며 실시간 상태가 아닙니다.', x: 535, y: 42 },
  { id: 'database', title: '서비스 DB', subtitle: 'PostgreSQL · primary', icon: 'database', detail: 'API에서 읽고 쓰는 관계형 데이터 저장소 샘플입니다.', x: 535, y: 220 },
];
const ARCHITECTURE_EDGES = [
  { from: 'gateway', to: 'api-a', label: '요청 분산' },
  { from: 'gateway', to: 'api-b', label: '요청 분산' },
  { from: 'api-a', to: 'cache', label: '세션 조회' },
  { from: 'api-b', to: 'cache', label: '세션 조회' },
  { from: 'api-a', to: 'database', label: '쿼리' },
  { from: 'api-b', to: 'database', label: '쿼리' },
];

function ArchitectureBoard() {
  const board = useMovableItems(ARCHITECTURE_NODES);
  const prefix = svgPrefix(React.useId());
  const selected = board.items.find((item) => item.id === board.selectedId);
  const selectedDetail = selected ?? ARCHITECTURE_NODES[0];
  const nodeIcon = (node: ArchitectureNode) => node.icon === 'database' ? <Database size={15} /> : node.icon === 'shield' ? <Shield size={15} /> : <Server size={15} />;
  return (
    <>
      <BoardHeader title="시스템 아키텍처 보드" description="로드밸런서에서 API, 세션 캐시, 데이터베이스로 이어지는 샘플 구조입니다." />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
        <MoveToolbar selectedTitle={selected?.title} onMove={(dx, dy) => selected && board.moveBy(selected.id, dx, dy)} />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: COLOR.muted, fontSize: 10 }}><span aria-hidden="true" style={{ width: 9, height: 9, borderRadius: 9, background: COLOR.accent }} />고정 샘플 포인터 · 협업 세션 아님</span>
      </div>
      <div style={{ overflowX: 'auto', border: `1px solid ${COLOR.border}`, borderRadius: 12, background: COLOR.panel }}>
        <div style={{ position: 'relative', width: BOARD_WIDTH, height: BOARD_HEIGHT, background: COLOR.surface }}>
          <svg width={BOARD_WIDTH} height={BOARD_HEIGHT} viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`} aria-label="노드 위치에 따라 갱신되는 아키텍처 관계선" role="img" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <defs>
              <pattern id={`${prefix}-grid`} width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill={COLOR.border} /></pattern>
              <marker id={`${prefix}-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill={COLOR.accent} /></marker>
            </defs>
            <rect width={BOARD_WIDTH} height={BOARD_HEIGHT} fill={`url(#${prefix}-grid)`} />
            {ARCHITECTURE_EDGES.map((edge) => {
              const from = board.items.find((node) => node.id === edge.from);
              const to = board.items.find((node) => node.id === edge.to);
              if (!from || !to) return null;
              const x1 = from.x + CARD_WIDTH;
              const y1 = from.y + 48;
              const x2 = to.x;
              const y2 = to.y + 48;
              const curve = Math.max(38, Math.abs(x2 - x1) * 0.4);
              const related = !board.selectedId || board.selectedId === edge.from || board.selectedId === edge.to;
              return <g key={`${edge.from}-${edge.to}`} opacity={related ? 1 : 0.18}><path d={`M${x1} ${y1} C${x1 + curve} ${y1},${x2 - curve} ${y2},${x2} ${y2}`} fill="none" stroke={COLOR.accent} strokeWidth="1.8" markerEnd={`url(#${prefix}-arrow)`} /><text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 5} textAnchor="middle" fontSize="9" fill={COLOR.muted}>{edge.label}</text></g>;
            })}
          </svg>
          {board.items.map((node) => <MovableCard key={node.id} item={node} selected={node.id === board.selectedId} onSelect={() => board.setSelectedId(node.id)} onPointerDown={(event) => board.onPointerDown(node.id, event)} onPointerMove={(event) => board.onPointerMove(node.id, event)} onPointerUp={board.onPointerUp} onKeyDown={(event) => board.keyDown(node.id, event)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: COLOR.accent }}>{nodeIcon(node)}<strong style={{ color: COLOR.text, fontSize: 11 }}>{node.title}</strong></div>
            <p style={{ margin: '7px 0 0', color: COLOR.muted, fontSize: 9 }}>{node.subtitle}</p>
          </MovableCard>)}
          <div aria-hidden="true" style={{ position: 'absolute', right: 14, top: 13, padding: '5px 7px', border: `1px solid ${COLOR.border}`, borderRadius: 7, background: COLOR.panel, color: COLOR.muted, fontSize: 9 }}>샘플 포인터 A · 고정 위치</div>
        </div>
      </div>
      <BoardPanel style={{ marginTop: 10, display: 'flex', alignItems: 'flex-start', gap: 8 }}><GitBranch size={15} color={COLOR.accent} aria-hidden="true" /><div aria-live="polite"><strong style={{ color: COLOR.text, fontSize: 11 }}>{selectedDetail.title}</strong><p style={{ margin: '4px 0 0', color: COLOR.muted, fontSize: 10 }}>{selectedDetail.detail}</p></div></BoardPanel>
    </>
  );
}

type RetroGroup = '유지' | '중단' | '시도' | '실행 항목';
type RetroNote = PositionedItem & { body: string; votes: number; group: RetroGroup; author: string };
const RETRO_GROUPS: RetroGroup[] = ['유지', '중단', '시도', '실행 항목'];
const RETRO_NOTES: RetroNote[] = [
  { id: 'r1', title: '빌드 시간 단축', body: '캐시 적중률이 올라 대기 시간이 줄었어요.', votes: 4, group: '유지', author: '민서', x: 24, y: 24 },
  { id: 'r2', title: '작은 PR 리뷰', body: '변경 범위를 작게 나눠 빠르게 확인했습니다.', votes: 3, group: '유지', author: '도윤', x: 216, y: 24 },
  { id: 'r3', title: '수동 배포 확인', body: '체크리스트를 릴리스 템플릿에 넣어봅시다.', votes: 2, group: '실행 항목', author: '유진', x: 408, y: 24 },
  { id: 'r4', title: '늦은 알림', body: '경보 소유자가 불분명해 첫 대응이 늦었어요.', votes: 5, group: '중단', author: '준호', x: 24, y: 176 },
  { id: 'r5', title: '주간 데모', body: '다음 회고 전에 15분 데모를 시도해요.', votes: 1, group: '시도', author: '민서', x: 216, y: 176 },
];

function RetroBoard() {
  const [notes, setNotes] = useState<RetroNote[]>(RETRO_NOTES);
  const [selectedId, setSelectedId] = useState<string | null>(RETRO_NOTES[0]?.id ?? null);
  const dragRef = useRef<DragStart | null>(null);
  const [message, setMessage] = useState('');
  const currentNotes = notes;
  const setNotePosition = (id: string, x: number, y: number) => setNotes((current) => current.map((note) => note.id === id ? { ...note, x, y } : note));
  const setPositionAndSelection = (id: string, dx: number, dy: number) => {
    const item = currentNotes.find((note) => note.id === id);
    if (item) setNotePosition(id, Math.max(8, Math.min(BOARD_WIDTH - CARD_WIDTH - 8, item.x + dx)), Math.max(8, Math.min(BOARD_HEIGHT - CARD_HEIGHT - 8, item.y + dy)));
  };
  const updatedGroups = RETRO_GROUPS.map((group) => {
    const members = currentNotes.filter((note) => note.group === group);
    return { group, count: members.length, votes: members.reduce((sum, note) => sum + note.votes, 0), titles: members.map((note) => note.title) };
  });
  const selectedNote = currentNotes.find((note) => note.id === selectedId);
  const prefix = svgPrefix(React.useId());
  return (
    <>
      <BoardHeader title="스프린트 회고 보드" description="샘플 스티키 노트에 공감 투표를 더하고 주제별 그룹을 바꿔보세요." />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: COLOR.muted, fontSize: 10 }}><StickyNote size={14} color={COLOR.accent} aria-hidden="true" />노트 이동: 드래그 또는 선택 후 방향키</div>
        <span role="status" aria-live="polite" style={{ color: COLOR.muted, fontSize: 10 }}>{message || '투표와 그룹 변경은 로컬 샘플에서 집계됩니다.'}</span>
      </div>
      <div style={{ overflowX: 'auto', border: `1px solid ${COLOR.border}`, borderRadius: 12, background: COLOR.panel }}>
        <div style={{ position: 'relative', width: BOARD_WIDTH, height: BOARD_HEIGHT, background: COLOR.surface }}>
          <svg width={BOARD_WIDTH} height={BOARD_HEIGHT} aria-label="스프린트 회고 노트 배치" role="img" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}><defs><pattern id={`${prefix}-grid`} width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill={COLOR.border} /></pattern></defs><rect width={BOARD_WIDTH} height={BOARD_HEIGHT} fill={`url(#${prefix}-grid)`} /></svg>
          {currentNotes.map((note) => <article key={note.id} tabIndex={0} role="group" aria-label={`${note.title}, 공감 ${note.votes}표, ${note.group} 그룹. 방향키로 이동합니다.`} aria-roledescription="이동 가능한 스티키 노트" onClick={() => setSelectedId(note.id)} onPointerDown={(event) => { const target = event.target as HTMLElement; if (target.closest('button,select,input')) return; event.currentTarget.setPointerCapture(event.pointerId); const selectedNote = currentNotes.find((item) => item.id === note.id); if (selectedNote) dragRef.current = { id: note.id, pointerX: event.clientX, pointerY: event.clientY, originX: selectedNote.x, originY: selectedNote.y }; setSelectedId(note.id); }} onPointerMove={(event) => { const start = dragRef.current; if (!start || start.id !== note.id) return; setNotePosition(note.id, Math.max(8, Math.min(BOARD_WIDTH - CARD_WIDTH - 8, start.originX + event.clientX - start.pointerX)), Math.max(8, Math.min(BOARD_HEIGHT - CARD_HEIGHT - 8, start.originY + event.clientY - start.pointerY))); }} onPointerUp={() => { dragRef.current = null; }} onPointerCancel={() => { dragRef.current = null; }} onKeyDown={(event) => { if (event.target !== event.currentTarget) return; if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedId(note.id); } else { const step = event.shiftKey ? 28 : 12; const delta: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }; if (delta[event.key]) { event.preventDefault(); setSelectedId(note.id); setPositionAndSelection(note.id, ...delta[event.key]); } } }} className={FOCUS_CLASS} style={{ position: 'absolute', left: note.x, top: note.y, width: CARD_WIDTH, minHeight: 116, boxSizing: 'border-box', padding: 10, border: `1px solid ${note.id === selectedId ? COLOR.accent : COLOR.border}`, borderRadius: 10, background: note.id === selectedId ? COLOR.selected : COLOR.panel, boxShadow: note.id === selectedId ? `0 0 0 2px ${COLOR.selected}` : 'none', cursor: 'grab', touchAction: 'none', userSelect: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 6 }}><strong style={{ color: COLOR.text, fontSize: 10 }}>{note.title}</strong><span style={{ color: COLOR.muted, fontSize: 9 }}>{note.author}</span></div>
            <p style={{ minHeight: 30, margin: '6px 0', color: COLOR.muted, fontSize: 9, lineHeight: 1.4 }}>{note.body}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 5 }}><button type="button" className={FOCUS_CLASS} aria-label={`${note.title} 공감 투표 ${note.votes}표`} onClick={() => { setNotes((current) => current.map((item) => item.id === note.id ? { ...item, votes: item.votes + 1 } : item)); setMessage(`${note.title} 공감을 추가했습니다.`); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: `1px solid ${COLOR.controlBorder}`, borderRadius: 7, padding: '4px 6px', background: COLOR.panel, color: COLOR.accent, font: 'inherit', fontSize: 9, cursor: 'pointer' }}><Heart size={11} /> +1 · {note.votes}</button><select aria-label={`${note.title} 그룹`} value={note.group} onChange={(event) => { setNotes((current) => current.map((item) => item.id === note.id ? { ...item, group: event.target.value as RetroGroup } : item)); setMessage(`${note.title}을(를) ${event.target.value} 그룹으로 이동했습니다.`); }} className={FOCUS_CLASS} style={{ maxWidth: 83, border: `1px solid ${COLOR.controlBorder}`, borderRadius: 7, padding: '4px 5px', background: COLOR.panel, color: COLOR.text, font: 'inherit', fontSize: 9 }}><option value="유지">유지</option><option value="중단">중단</option><option value="시도">시도</option><option value="실행 항목">실행 항목</option></select></div>
          </article>)}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: 8, marginTop: 10 }}>
        {updatedGroups.map((group) => <BoardPanel key={group.group} style={{ padding: 10 }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}><strong style={{ color: COLOR.text, fontSize: 11 }}>{group.group}</strong><span style={{ color: COLOR.accent, fontSize: 10, fontWeight: 700 }}>{group.count}개 · {group.votes}표</span></div><p style={{ margin: '6px 0 0', color: COLOR.muted, fontSize: 9 }}>{group.titles.length ? group.titles.join(' · ') : '노트 없음'}</p></BoardPanel>)}
      </div>
      <BoardPanel style={{ marginTop: 10 }}><div style={{ display: 'flex', alignItems: 'center', gap: 7, color: COLOR.text, fontSize: 11, fontWeight: 680 }}><CheckCircle2 size={15} color={COLOR.accent} />그룹별 실제 집계</div><p style={{ margin: '5px 0 0', color: COLOR.muted, fontSize: 10 }}>{updatedGroups.find((group) => group.group === '실행 항목')?.count ?? 0}개 실행 항목 · 전체 공감 {updatedGroups.reduce((sum, group) => sum + group.votes, 0)}표 · {selectedNote ? `선택: ${selectedNote.title}` : '항목을 선택하세요'}</p></BoardPanel>
    </>
  );
}

type JourneyStage = { id: string; name: string; action: string; emotion: number; pain: string; opportunity: string; resolved: boolean };
const JOURNEY_STAGES: JourneyStage[] = [
  { id: 'awareness', name: '인지', action: '추천 글에서 제품 발견', emotion: 4, pain: '요금제 비교 기준이 흩어져 있음', opportunity: '핵심 가치와 가격 범위를 첫 화면에서 비교', resolved: false },
  { id: 'signup', name: '가입', action: '회사 이메일로 계정 생성', emotion: 3, pain: '초대 메일이 스팸함으로 이동', opportunity: '가입 직후 발신 안내와 재전송 제공', resolved: false },
  { id: 'onboarding', name: '온보딩', action: '팀원 초대와 데이터 연결', emotion: 2, pain: '첫 연결에 필요한 권한 설명이 부족', opportunity: '필수 권한을 단계별로 설명', resolved: false },
  { id: 'paid', name: '유료 전환', action: '팀 요금제 선택 및 결제', emotion: 4, pain: '좌석 수 변경 규칙을 찾기 어려움', opportunity: '결제 전 좌석 변경 예시 노출', resolved: false },
];

function JourneyBoard() {
  const [stages, setStages] = useState(JOURNEY_STAGES);
  const prefix = svgPrefix(React.useId());
  const done = stages.filter((stage) => stage.resolved).length;
  const points = stages.map((stage, index) => `${90 + index * 180},${102 - stage.emotion * 14}`).join(' ');
  const improve = (id: string) => setStages((current) => current.map((stage) => stage.id === id ? { ...stage, resolved: !stage.resolved } : stage));
  return (
    <>
      <BoardHeader title="고객 여정 지도 캔버스" description="인지에서 유료 전환까지의 행동, 감정 점수, 페인 포인트와 개선 기회를 살펴봅니다." />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 9 }}><span style={{ color: COLOR.muted, fontSize: 10 }}>감정 곡선은 각 단계의 샘플 점수에서 계산됩니다.</span><span role="status" aria-live="polite" style={{ color: done === stages.length ? COLOR.accent : COLOR.warning, fontSize: 10, fontWeight: 680 }}>{done}/{stages.length} 개선 기회 확인</span></div>
      <div style={{ overflowX: 'auto', border: `1px solid ${COLOR.border}`, borderRadius: 12, background: COLOR.panel }}>
        <div style={{ minWidth: 760, padding: 12 }}>
          <svg viewBox="0 0 720 140" role="img" aria-labelledby={`${prefix}-journey-title`} style={{ width: '100%', height: 126, display: 'block', overflow: 'visible' }}>
            <title id={`${prefix}-journey-title`}>단계별 고객 감정 점수 곡선</title>
            <line x1="20" y1="105" x2="700" y2="105" stroke={COLOR.border} strokeDasharray="4 5" />
            <polyline points={points} fill="none" stroke={COLOR.accent} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            {stages.map((stage, index) => <g key={stage.id}><circle cx={90 + index * 180} cy={102 - stage.emotion * 14} r="7" fill={COLOR.panel} stroke={COLOR.accent} strokeWidth="3" /><text x={90 + index * 180} y="128" textAnchor="middle" fontSize="10" fill={COLOR.muted}>{stage.name} · {stage.emotion}/5</text></g>)}
          </svg>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(170px, 1fr))', gap: 9, marginTop: 8 }}>
            {stages.map((stage) => <article key={stage.id} style={{ minWidth: 0, border: `1px solid ${stage.resolved ? COLOR.accent : COLOR.border}`, borderRadius: 10, padding: 10, background: stage.resolved ? COLOR.selected : COLOR.panel }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}><strong style={{ color: COLOR.text, fontSize: 11 }}>{stage.name}</strong><span style={{ color: COLOR.accent, fontSize: 9 }}>감정 {stage.emotion}/5</span></div>
              <p style={{ margin: '6px 0 9px', color: COLOR.muted, fontSize: 9, lineHeight: 1.45 }}>{stage.action}</p>
              <div style={{ padding: 8, border: `1px solid ${stage.resolved ? COLOR.accent : COLOR.border}`, borderRadius: 8, background: stage.resolved ? COLOR.selected : COLOR.soft }}><span style={{ display: 'block', color: stage.resolved ? COLOR.accent : COLOR.warning, fontSize: 9, fontWeight: 700 }}>{stage.resolved ? '개선 기회 확인' : '페인 포인트'}</span><p style={{ margin: '4px 0 0', color: COLOR.text, fontSize: 9 }}>{stage.pain}</p></div>
              <p style={{ minHeight: 28, margin: '8px 0', color: COLOR.muted, fontSize: 9 }}><strong style={{ color: COLOR.text }}>기회:</strong> {stage.opportunity}</p>
              <button type="button" aria-pressed={stage.resolved} className={FOCUS_CLASS} onClick={() => improve(stage.id)} style={{ minHeight: 31, width: '100%', border: `1px solid ${stage.resolved ? COLOR.accent : COLOR.controlBorder}`, borderRadius: 8, background: stage.resolved ? COLOR.selected : COLOR.panel, color: stage.resolved ? COLOR.accent : COLOR.text, font: 'inherit', fontSize: 9, fontWeight: 650, cursor: 'pointer' }}>{stage.resolved ? '확인 완료 · 되돌리기' : '개선 기회 확인'}</button>
            </article>)}
          </div>
        </div>
      </div>
    </>
  );
}

type ColumnDefinition = { name: string; type: string; primary?: boolean; foreignTable?: string; foreignColumn?: string };
type Entity = PositionedItem & { columns: ColumnDefinition[] };
const ERD_ENTITIES: Entity[] = [
  { id: 'organizations', title: 'organizations', x: 28, y: 42, width: 210, columns: [{ name: 'id', type: 'uuid', primary: true }, { name: 'name', type: 'varchar(120)' }] },
  { id: 'users', title: 'users', x: 300, y: 42, width: 210, columns: [{ name: 'id', type: 'uuid', primary: true }, { name: 'organization_id', type: 'uuid', foreignTable: 'organizations', foreignColumn: 'id' }, { name: 'email', type: 'varchar(255)' }] },
  { id: 'projects', title: 'projects', x: 562, y: 208, width: 210, columns: [{ name: 'id', type: 'uuid', primary: true }, { name: 'owner_id', type: 'uuid', foreignTable: 'users', foreignColumn: 'id' }, { name: 'title', type: 'varchar(160)' }] },
];

function renderDDL(entities: Entity[]) {
  return entities.map((entity) => {
    const definitions = entity.columns.map((column) => {
      const key = column.primary ? ' PRIMARY KEY' : column.foreignTable ? ` REFERENCES ${column.foreignTable}(${column.foreignColumn})` : '';
      return `  ${column.name} ${column.type}${key}`;
    });
    return `CREATE TABLE ${entity.title} (\n${definitions.join(',\n')}\n);`;
  }).join('\n\n');
}

function ErdBoard() {
  const board = useMovableItems(ERD_ENTITIES);
  const prefix = svgPrefix(React.useId());
  const [showDDL, setShowDDL] = useState(true);
  const entities = board.items as Entity[];
  const relations = entities.flatMap((entity) => entity.columns.flatMap((column) => column.foreignTable ? [{ from: column.foreignTable, to: entity.title, name: column.name }] : []));
  const selected = entities.find((entity) => entity.id === board.selectedId);
  const ddl = renderDDL(entities);
  return (
    <>
      <BoardHeader title="DB ERD 스키마 보드" description="엔티티 위치를 옮기면 관계선이 따라옵니다. SQL은 아래 컬럼 정의에서 생성됩니다." />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 9, flexWrap: 'wrap', marginBottom: 9 }}>
        <MoveToolbar selectedTitle={selected?.title} onMove={(dx, dy) => selected && board.moveBy(selected.id, dx, dy)} />
        <button type="button" className={FOCUS_CLASS} aria-expanded={showDDL} onClick={() => setShowDDL((value) => !value)} style={{ minHeight: 32, border: `1px solid ${COLOR.controlBorder}`, borderRadius: 8, padding: '6px 10px', background: COLOR.panel, color: COLOR.text, font: 'inherit', fontSize: 10, cursor: 'pointer' }}>{showDDL ? 'DDL 숨기기' : 'DDL 보기'}</button>
      </div>
      <div style={{ overflowX: 'auto', border: `1px solid ${COLOR.border}`, borderRadius: 12, background: COLOR.panel }}>
        <div style={{ position: 'relative', width: BOARD_WIDTH, height: 390, background: COLOR.surface }}>
          <svg width={BOARD_WIDTH} height={390} aria-label="외래 키 컬럼에서 계산한 테이블 관계선" role="img" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}><defs><pattern id={`${prefix}-grid`} width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill={COLOR.border} /></pattern><marker id={`${prefix}-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill={COLOR.accent} /></marker></defs><rect width={BOARD_WIDTH} height="390" fill={`url(#${prefix}-grid)`} />{relations.map((relation) => { const from = entities.find((entity) => entity.title === relation.from); const to = entities.find((entity) => entity.title === relation.to); if (!from || !to) return null; const forward = from.x <= to.x; const x1 = forward ? from.x + 210 : from.x; const x2 = forward ? to.x : to.x + 210; const y1 = from.y + 74; const y2 = to.y + 74; const mid = (x1 + x2) / 2; const related = !board.selectedId || board.selectedId === from.id || board.selectedId === to.id; return <g key={`${relation.from}-${relation.to}-${relation.name}`} opacity={related ? 1 : .15}><path d={`M${x1} ${y1} C${mid} ${y1},${mid} ${y2},${x2} ${y2}`} fill="none" stroke={COLOR.accent} strokeWidth="2" markerEnd={`url(#${prefix}-arrow)`} /><text x={mid} y={(y1 + y2) / 2 - 5} textAnchor="middle" fontSize="9" fill={COLOR.muted}>1:N · {relation.name}</text></g>; })}</svg>
          {entities.map((entity) => <MovableCard key={entity.id} item={entity} width={210} selected={entity.id === board.selectedId} onSelect={() => board.setSelectedId(entity.id)} onPointerDown={(event) => board.onPointerDown(entity.id, event)} onPointerMove={(event) => board.onPointerMove(entity.id, event)} onPointerUp={board.onPointerUp} onKeyDown={(event) => board.keyDown(entity.id, event)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 7, borderBottom: `1px solid ${COLOR.border}` }}><Database size={13} color={COLOR.accent} aria-hidden="true" /><strong style={{ color: COLOR.text, fontSize: 10 }}>{entity.title}</strong></div>
            {entity.columns.map((column) => <div key={column.name} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 6, paddingTop: 5, color: COLOR.muted, fontSize: 8 }}><span style={{ color: column.primary || column.foreignTable ? COLOR.text : COLOR.muted, fontWeight: column.primary || column.foreignTable ? 680 : 450 }}>{column.primary ? 'PK ' : column.foreignTable ? 'FK ' : ''}{column.name}</span><code>{column.type}</code></div>)}
          </MovableCard>)}
        </div>
      </div>
      {showDDL && <BoardPanel style={{ marginTop: 10 }}><div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7, color: COLOR.text, fontSize: 11, fontWeight: 680 }}><GitBranch size={14} color={COLOR.accent} />컬럼 정의에서 생성한 SQL DDL</div><pre style={{ overflowX: 'auto', margin: 0, padding: 10, borderRadius: 8, background: COLOR.soft, color: COLOR.text, fontSize: 9, lineHeight: 1.55, whiteSpace: 'pre' }}>{ddl}</pre></BoardPanel>}
    </>
  );
}

type HypothesisStatus = '검증 전' | '근거 확인' | '기각';
type IncidentHypothesis = PositionedItem & { body: string; status: HypothesisStatus; owner: string };
const INCIDENT_HYPOTHESES: IncidentHypothesis[] = [
  { id: 'h1', title: '캐시 미스 급증', body: '배포 후 만료 정책이 바뀌었는지 확인', status: '검증 전', owner: '도윤', width: 190, x: 24, y: 26 },
  { id: 'h2', title: 'DB 커넥션 포화', body: '풀 대기 시간과 연결 수를 비교', status: '근거 확인', owner: '유진', width: 190, x: 226, y: 26 },
  { id: 'h3', title: '외부 결제 지연', body: '타임아웃이 내부 재시도를 만들었는지 확인', status: '검증 전', owner: '민서', width: 190, x: 428, y: 26 },
];
const INCIDENT_TIMELINE = [
  { time: '09:12', text: 'API p95 지연 경보 접수' },
  { time: '09:18', text: 'DB 커넥션 풀 대기 확인' },
  { time: '09:26', text: '캐시 정책 변경 여부 조사' },
  { time: '09:34', text: '완화 조치 검토 중' },
];

function IncidentBoard() {
  const board = useMovableItems(INCIDENT_HYPOTHESES);
  const current = board.items as IncidentHypothesis[];
  const resolved = current.filter((item) => item.status !== '검증 전').length;
  const updateStatus = (id: string, status: HypothesisStatus) => {
    board.updateItem(id, { status });
    board.setSelectedId(id);
  };
  const prefix = svgPrefix(React.useId());
  const sampleSeries = [65, 58, 62, 43, 48, 28, 33, 22, 26, 18, 24, 15];
  const line = sampleSeries.map((value, index) => `${20 + index * 51},${120 - value}`).join(' ');
  return (
    <>
      <BoardHeader title="장애 워룸 브레인스토밍" description="고정 지표 스냅샷, 의심 가설, 검증 상태와 대응 메모를 한 화면에서 살펴봅니다." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 8, marginBottom: 10 }}>
        <BoardPanel><div style={{ display: 'flex', alignItems: 'center', gap: 7, color: COLOR.warning, fontSize: 10 }}><Activity size={14} />API p95</div><strong style={{ display: 'block', marginTop: 7, color: COLOR.text, fontSize: 19 }}>1,840 ms</strong><span style={{ color: COLOR.muted, fontSize: 9 }}>09:12 샘플 스냅샷</span></BoardPanel>
        <BoardPanel><div style={{ display: 'flex', alignItems: 'center', gap: 7, color: COLOR.accent, fontSize: 10 }}><Database size={14} />DB 연결</div><strong style={{ display: 'block', marginTop: 7, color: COLOR.text, fontSize: 19 }}>92 / 100</strong><span style={{ color: COLOR.muted, fontSize: 9 }}>샘플 커넥션 수</span></BoardPanel>
        <BoardPanel><div style={{ display: 'flex', alignItems: 'center', gap: 7, color: COLOR.danger, fontSize: 10 }}><TriangleAlert size={14} />오류율</div><strong style={{ display: 'block', marginTop: 7, color: COLOR.text, fontSize: 19 }}>4.8%</strong><span style={{ color: COLOR.muted, fontSize: 9 }}>샘플 5xx 응답 비율</span></BoardPanel>
        <BoardPanel><div style={{ display: 'flex', alignItems: 'center', gap: 7, color: COLOR.warning, fontSize: 10 }}><MessageSquareText size={14} />가설 검토</div><strong style={{ display: 'block', marginTop: 7, color: COLOR.text, fontSize: 19 }}>{resolved} / {current.length}</strong><span style={{ color: COLOR.muted, fontSize: 9 }}>상태 변경된 샘플 가설</span></BoardPanel>
      </div>
      <BoardPanel style={{ marginBottom: 10 }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}><strong style={{ color: COLOR.text, fontSize: 11 }}>지연 지표 스냅샷</strong><span style={{ color: COLOR.muted, fontSize: 9 }}>고정 예시 · 실제 모니터링 아님</span></div><svg viewBox="0 0 620 140" role="img" aria-labelledby={`${prefix}-metric-title`} style={{ width: '100%', height: 100, display: 'block', marginTop: 5 }}><title id={`${prefix}-metric-title`}>예시 API 지연 스냅샷 그래프</title><line x1="15" y1="112" x2="610" y2="112" stroke={COLOR.border} /><polyline points={line} fill="none" stroke={COLOR.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{sampleSeries.map((value, index) => <circle key={index} cx={20 + index * 51} cy={120 - value} r="3" fill={COLOR.accent} />)}</svg></BoardPanel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, margin: '0 0 8px', color: COLOR.text, fontSize: 11, fontWeight: 680 }}><StickyNote size={14} color={COLOR.accent} />의심 가설 · 선택 후 드래그 또는 키보드 방향키로 이동</div>
      <div style={{ overflowX: 'auto', border: `1px solid ${COLOR.border}`, borderRadius: 12, background: COLOR.panel }}>
        <div style={{ position: 'relative', width: BOARD_WIDTH, height: 180, background: COLOR.surface }}>
          {current.map((item) => <MovableCard key={item.id} item={item} width={190} selected={item.id === board.selectedId} onSelect={() => board.setSelectedId(item.id)} onPointerDown={(event) => board.onPointerDown(item.id, event)} onPointerMove={(event) => board.onPointerMove(item.id, event)} onPointerUp={board.onPointerUp} onKeyDown={(event) => board.keyDown(item.id, event)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 7 }}><strong style={{ color: COLOR.text, fontSize: 10 }}>{item.title}</strong><span style={{ color: item.status === '근거 확인' ? COLOR.accent : item.status === '기각' ? COLOR.danger : COLOR.warning, fontSize: 9, fontWeight: 700 }}>{item.status}</span></div>
            <p style={{ minHeight: 26, margin: '6px 0', color: COLOR.muted, fontSize: 9 }}>{item.body}</p>
            <span style={{ display: 'block', color: COLOR.muted, fontSize: 9, marginBottom: 6 }}>담당 샘플 · {item.owner}</span>
            <div style={{ display: 'flex', gap: 5 }}><button type="button" className={FOCUS_CLASS} onClick={() => updateStatus(item.id, '근거 확인')} style={{ border: `1px solid ${COLOR.accent}`, borderRadius: 7, padding: '4px 6px', background: COLOR.selected, color: COLOR.accent, font: 'inherit', fontSize: 8, cursor: 'pointer' }}><Check size={10} /> 확인</button><button type="button" className={FOCUS_CLASS} onClick={() => updateStatus(item.id, '기각')} style={{ border: `1px solid ${COLOR.danger}`, borderRadius: 7, padding: '4px 6px', background: COLOR.dangerSurface, color: COLOR.danger, font: 'inherit', fontSize: 8, cursor: 'pointer' }}><X size={10} /> 기각</button><button type="button" className={FOCUS_CLASS} aria-label={`${item.title} 검증 상태 초기화`} onClick={() => updateStatus(item.id, '검증 전')} style={{ border: `1px solid ${COLOR.controlBorder}`, borderRadius: 7, padding: '4px 6px', background: COLOR.panel, color: COLOR.text, font: 'inherit', fontSize: 8, cursor: 'pointer' }}>초기화</button></div>
          </MovableCard>)}
        </div>
      </div>
      <BoardPanel style={{ marginTop: 10 }}><div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, color: COLOR.text, fontSize: 11, fontWeight: 680 }}><Activity size={14} color={COLOR.accent} />대응 타임라인 샘플</div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 7 }}>{INCIDENT_TIMELINE.map((event) => <div key={event.time} style={{ borderLeft: `2px solid ${COLOR.accent}`, padding: '4px 8px', background: COLOR.soft }}><strong style={{ display: 'block', color: COLOR.accent, fontSize: 9 }}>{event.time}</strong><span style={{ display: 'block', marginTop: 3, color: COLOR.text, fontSize: 9 }}>{event.text}</span></div>)}</div></BoardPanel>
    </>
  );
}

export function PlannedWhiteboardBlock({ variant, density = 'normal' }: PlannedWhiteboardBlockProps) {
  let content: React.ReactNode;
  switch (variant) {
    case 'whiteboard-sprint-retro':
      content = <RetroBoard />;
      break;
    case 'whiteboard-user-journey-map':
      content = <JourneyBoard />;
      break;
    case 'whiteboard-erd-schema':
      content = <ErdBoard />;
      break;
    case 'whiteboard-incident-warroom':
      content = <IncidentBoard />;
      break;
    case 'whiteboard-system-architecture':
    default:
      content = <ArchitectureBoard />;
  }
  return <div style={{ width: '100%', boxSizing: 'border-box', padding: density === 'compact' ? 12 : density === 'relaxed' ? 24 : 18, borderRadius: 18, background: COLOR.surface, color: COLOR.text, fontFamily: 'inherit' }}><SampleBanner />{content}</div>;
}

export default PlannedWhiteboardBlock;
