import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Columns2,
  Rows2,
  Code2,
  Eye,
  FileCode,
  Terminal,
  Layers,
  Sparkles,
  Sliders,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Play,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  FolderTree,
  FileText,
  Search,
  Database,
  ArrowRightLeft,
  Smartphone,
  Tablet,
  Monitor,
  GripVertical,
  GripHorizontal,
} from 'lucide-react';

export type SplitterShowcaseMode =
  | 'code-preview'
  | 'ide-nested'
  | 'diff-compare'
  | 'master-detail'
  | 'canvas-drawer'
  | 'all-showcase';

interface SplitterShowcaseBlockProps {
  initialMode?: SplitterShowcaseMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

const MODE_TABS: {
  id: SplitterShowcaseMode;
  label: string;
  pkg: string;
}[] = [
  {
    id: 'code-preview',
    label: '1. 코드 에디터 & 실시간 프리뷰 수평 분할',
    pkg: 'KLIC · 스플리터 1',
  },
  {
    id: 'ide-nested',
    label: '2. 다단 중첩 IDE 개발 워크스페이스',
    pkg: 'KLIC · 스플리터 2',
  },
  {
    id: 'diff-compare',
    label: '3. 변경 전·후(Diff) 좌우 비교 커튼',
    pkg: 'KLIC · 스플리터 3',
  },
  {
    id: 'master-detail',
    label: '4. 수직 스택 쿼리 콘솔 & 결과 테이블',
    pkg: 'KLIC · 스플리터 4',
  },
  {
    id: 'canvas-drawer',
    label: '5. 캔버스 & 인스펙터 접이식 서랍',
    pkg: 'KLIC · 스플리터 5',
  },
  {
    id: 'all-showcase',
    label: '전체 5종 한눈에 보기',
    pkg: 'KLIC · 스플리터 모음',
  },
];

export function SplitterShowcaseBlock({
  initialMode = 'code-preview',
}: SplitterShowcaseBlockProps) {
  const [activeMode, setActiveMode] =
    useState<SplitterShowcaseMode>(initialMode);

  useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  /* ------------------------------------------------------------------------
   * STYLE 1: Code & Live Preview Splitter
   * ------------------------------------------------------------------------ */
  const [splitRatio1, setSplitRatio1] = useState<number>(48); // Left percent (15 to 85)
  const [isDragging1, setIsDragging1] = useState(false);
  const [devicePreset1, setDevicePreset1] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [btnText1, setBtnText1] = useState('실시간 대사 시작');
  const [btnColor1, setBtnColor1] = useState<'blue' | 'amber' | 'red'>('blue');
  const containerRef1 = useRef<HTMLDivElement>(null);

  const startDrag1 = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging1(true);
  }, []);

  useEffect(() => {
    if (!isDragging1) return;
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!containerRef1.current) return;
      const rect = containerRef1.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const offset = clientX - rect.left;
      const pct = Math.max(18, Math.min(82, (offset / rect.width) * 100));
      setSplitRatio1(Math.round(pct));
    };
    const handleUp = () => setIsDragging1(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging1]);

  /* ------------------------------------------------------------------------
   * STYLE 2: Nested Multi-Pane IDE Workspace
   * ------------------------------------------------------------------------ */
  const [leftWidth2, setLeftWidth2] = useState<number>(22); // Sidebar % (15~40)
  const [terminalHeight2, setTerminalHeight2] = useState<number>(36); // Bottom console % (20~60)
  const [isDraggingLeft2, setIsDraggingLeft2] = useState(false);
  const [isDraggingTerminal2, setIsDraggingTerminal2] = useState(false);
  const [activeFile2, setActiveFile2] = useState('payment-gateway.ts');
  const [terminalTab2, setTerminalTab2] = useState<'terminal' | 'build' | 'problems'>('terminal');
  const [consoleLogs2, setConsoleLogs2] = useState<string[]>([
    '[시스템] KLIC 엣지 런타임 클러스터 v2.4.0 초기화 완료',
    '[네트워크] AP-Seoul 리전 결제망 웹훅 수신 대기 중 (포트 8080)',
    '[인증] 마스터 보안 토큰 검증 성공 (만료: 23시간 59분 남음)',
  ]);
  const ideRef2 = useRef<HTMLDivElement>(null);
  const centerPaneRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDraggingLeft2) return;
    const handleMove = (e: MouseEvent) => {
      if (!ideRef2.current) return;
      const rect = ideRef2.current.getBoundingClientRect();
      const pct = Math.max(15, Math.min(40, ((e.clientX - rect.left) / rect.width) * 100));
      setLeftWidth2(Math.round(pct));
    };
    const handleUp = () => setIsDraggingLeft2(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDraggingLeft2]);

  useEffect(() => {
    if (!isDraggingTerminal2) return;
    const handleMove = (e: MouseEvent) => {
      if (!centerPaneRef2.current) return;
      const rect = centerPaneRef2.current.getBoundingClientRect();
      const offset = rect.bottom - e.clientY;
      const pct = Math.max(18, Math.min(65, (offset / rect.height) * 100));
      setTerminalHeight2(Math.round(pct));
    };
    const handleUp = () => setIsDraggingTerminal2(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDraggingTerminal2]);

  /* ------------------------------------------------------------------------
   * STYLE 3: Synchronized Diff Compare Splitter
   * ------------------------------------------------------------------------ */
  const [diffRatio3, setDiffRatio3] = useState<number>(50);
  const [isDraggingDiff3, setIsDraggingDiff3] = useState(false);
  const diffRef3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDraggingDiff3) return;
    const handleMove = (e: MouseEvent) => {
      if (!diffRef3.current) return;
      const rect = diffRef3.current.getBoundingClientRect();
      const pct = Math.max(15, Math.min(85, ((e.clientX - rect.left) / rect.width) * 100));
      setDiffRatio3(Math.round(pct));
    };
    const handleUp = () => setIsDraggingDiff3(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDraggingDiff3]);

  /* ------------------------------------------------------------------------
   * STYLE 4: Vertical Stacked SQL Query Console & Table
   * ------------------------------------------------------------------------ */
  const [topHeight4, setTopHeight4] = useState<number>(44);
  const [isDraggingVertical4, setIsDraggingVertical4] = useState(false);
  const queryConsoleRef4 = useRef<HTMLDivElement>(null);
  const [queryRunning4, setQueryRunning4] = useState(false);

  useEffect(() => {
    if (!isDraggingVertical4) return;
    const handleMove = (e: MouseEvent) => {
      if (!queryConsoleRef4.current) return;
      const rect = queryConsoleRef4.current.getBoundingClientRect();
      const pct = Math.max(22, Math.min(78, ((e.clientY - rect.top) / rect.height) * 100));
      setTopHeight4(Math.round(pct));
    };
    const handleUp = () => setIsDraggingVertical4(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDraggingVertical4]);

  /* ------------------------------------------------------------------------
   * STYLE 5: Canvas & Collapsible Inspector Drawer
   * ------------------------------------------------------------------------ */
  const [drawerWidth5, setDrawerWidth5] = useState<number>(320); // in px
  const [isDrawerCollapsed5, setIsDrawerCollapsed5] = useState(false);
  const [isDraggingDrawer5, setIsDraggingDrawer5] = useState(false);
  const [cardAccent5, setCardAccent5] = useState<'blue' | 'amber' | 'red'>('blue');
  const [cardRadius5, setCardRadius5] = useState<number>(20);
  const [cardShadow5, setCardShadow5] = useState<boolean>(true);
  const canvasDrawerRef5 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDraggingDrawer5) return;
    const handleMove = (e: MouseEvent) => {
      if (!canvasDrawerRef5.current) return;
      const rect = canvasDrawerRef5.current.getBoundingClientRect();
      const newWidth = rect.right - e.clientX;
      if (newWidth < 140) {
        setIsDrawerCollapsed5(true);
      } else {
        setIsDrawerCollapsed5(false);
        setDrawerWidth5(Math.max(220, Math.min(480, newWidth)));
      }
    };
    const handleUp = () => setIsDraggingDrawer5(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDraggingDrawer5]);

  /* ========================================================================
   * RENDER 1: 코드 에디터 & 실시간 프리뷰 수평 스플리터 (KLIC · 스플리터 1)
   * ======================================================================== */
  const renderStyle1CodePreview = () => (
    <section className="rounded-[28px] bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 p-6 sm:p-8 shadow-[0_16px_45px_rgba(15,23,42,0.04)]">
      {/* 헤더 & 비율 프리셋 버튼 바 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-200/70 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              코드 에디터 & 실시간 프리뷰 수평 스플리터
            </h2>
            <span className="px-2.5 py-1 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-mono font-semibold">
              KLIC · 스플리터 1
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            중앙 분할선을 마우스나 터치로 드래그하여 코드 창과 렌더링 화면의 비율을 자유롭게 조절합니다.
          </p>
        </div>

        {/* 우측 비율 프리셋 칩 & 초기화 */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-semibold">
            <button
              type="button"
              onClick={() => setSplitRatio1(30)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                splitRatio1 === 30 ? 'bg-white dark:bg-zinc-900 text-blue-600 shadow-xs' : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              30:70
            </button>
            <button
              type="button"
              onClick={() => setSplitRatio1(50)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                splitRatio1 === 50 ? 'bg-white dark:bg-zinc-900 text-blue-600 shadow-xs' : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              50:50
            </button>
            <button
              type="button"
              onClick={() => setSplitRatio1(70)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                splitRatio1 === 70 ? 'bg-white dark:bg-zinc-900 text-blue-600 shadow-xs' : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              70:30
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSplitRatio1(48)}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            title="기본 비율(48:52)로 복원"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 메인 스플리터 컨테이너 */}
      <div
        ref={containerRef1}
        className={`relative mt-6 rounded-2xl border border-zinc-300 dark:border-zinc-800 bg-zinc-950 overflow-hidden select-none flex h-[460px] ${
          isDragging1 ? 'cursor-col-resize ring-2 ring-blue-500/40' : ''
        }`}
      >
        {/* 좌측 패널: 코드 에디터 */}
        <div
          style={{ width: `${splitRatio1}%` }}
          className="h-full flex flex-col bg-zinc-950 text-zinc-300 overflow-hidden shrink-0 border-r border-zinc-800"
        >
          {/* 에디터 상단 탭 바 */}
          <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-zinc-200">
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
              <span>PaymentCard.tsx</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            </div>
            <span className="text-[11px] text-zinc-500 font-sans">
              너비 {splitRatio1}%
            </span>
          </div>

          {/* 에디터 본문 (코드 라인) */}
          <div className="p-4 flex-1 overflow-auto font-mono text-xs leading-relaxed space-y-1">
            <div className="text-zinc-500">// 실시간 동기화 인터랙티브 컴포넌트</div>
            <div>
              <span className="text-blue-400">export function</span>{' '}
              <span className="text-blue-400">PaymentCard</span>() &#123;
            </div>
            <div className="pl-4">
              <span className="text-blue-400">return</span> (
            </div>
            <div className="pl-8 text-blue-300">
              &lt;<span className="text-red-400">div</span> className=
              <span className="text-amber-300">"rounded-2xl p-6 bg-white shadow-xl"</span>&gt;
            </div>
            <div className="pl-12 text-zinc-300">
              &lt;<span className="text-red-400">h3</span>&gt;월간 정산 원장 대사&lt;/<span className="text-red-400">h3</span>&gt;
            </div>
            <div className="pl-12 text-zinc-400">
              &lt;<span className="text-red-400">p</span>&gt;총 14,820건 거래 검증 완료&lt;/<span className="text-red-400">p</span>&gt;
            </div>
            <div className="pl-12 text-blue-300">
              &lt;<span className="text-red-400">button</span> className=
              <span className="text-amber-300">"btn-{btnColor1}"</span>&gt;
            </div>
            <div className="pl-16 font-bold text-white">
              {btnText1}
            </div>
            <div className="pl-12 text-blue-300">
              &lt;/<span className="text-red-400">button</span>&gt;
            </div>
            <div className="pl-8 text-blue-300">
              &lt;/<span className="text-red-400">div</span>&gt;
            </div>
            <div className="pl-4">);</div>
            <div>&#125;</div>

            {/* 인라인 속성 수정 패널 */}
            <div className="mt-4 pt-4 border-t border-zinc-800 text-[11px] space-y-2">
              <div className="text-zinc-400 font-sans font-semibold">
                코드 변수 즉시 조작:
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 font-sans">버튼 문구:</span>
                <input
                  type="text"
                  value={btnText1}
                  onChange={(e) => setBtnText1(e.target.value)}
                  className="px-2 py-1 rounded bg-zinc-800 text-white outline-none w-36 text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 font-sans">포인트 컬러:</span>
                {(['blue', 'amber', 'red'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setBtnColor1(c)}
                    className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                      btnColor1 === c ? 'bg-white text-zinc-900' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 중앙 드래그 스플리터 분할 바 (Splitter Resizer Bar) */}
        <div
          onMouseDown={startDrag1}
          onTouchStart={startDrag1}
          className={`w-3.5 -mx-1.5 z-20 flex items-center justify-center cursor-col-resize group transition-colors ${
            isDragging1 ? 'bg-blue-600/30' : 'hover:bg-blue-600/20'
          }`}
          title="좌우로 드래그하여 패널 너비 조절"
        >
          {/* 중앙 그립 핸들 캡슐 */}
          <div
            className={`w-1.5 h-12 rounded-full flex items-center justify-center transition-all ${
              isDragging1
                ? 'bg-blue-400 scale-y-110 shadow-[0_0_12px_rgba(167,139,250,0.8)]'
                : 'bg-zinc-600 group-hover:bg-blue-400'
            }`}
          >
            <GripVertical className="w-3 h-3 text-zinc-950 opacity-60" />
          </div>
        </div>

        {/* 우측 패널: 실시간 렌더링 프리뷰 */}
        <div
          style={{ width: `${100 - splitRatio1}%` }}
          className="h-full flex flex-col bg-zinc-100 dark:bg-zinc-900 overflow-hidden shrink-0"
        >
          {/* 프리뷰 상단 툴바: 뷰포트 프리셋 */}
          <div className="px-4 py-2.5 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                실시간 렌더링 화면
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[11px] text-zinc-500">
                {100 - splitRatio1}% 너비
              </span>
            </div>
          </div>

          {/* 프리뷰 캔버스 영역 */}
          <div className="p-6 flex-1 flex items-center justify-center overflow-auto bg-zinc-200/50 dark:bg-zinc-950/50">
            <div className="w-full max-w-sm rounded-2xl p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  실시간 연동
                </span>
                <span className="text-xs text-zinc-400 font-mono">2026-11-09</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  월간 정산 원장 대사
                </h3>
                <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                  총 14,820건 거래 검증 완료 • 잔액 불일치 0건
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500">대사 승인 총액:</span>
                <strong className="text-zinc-900 dark:text-zinc-100">
                  ₩428,500,000
                </strong>
              </div>

              <button
                type="button"
                className={`w-full py-2.5 rounded-xl font-semibold text-xs text-white transition-all shadow-md ${
                  btnColor1 === 'blue'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : btnColor1 === 'amber'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {btnText1}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  /* ========================================================================
   * RENDER 2: 다단 중첩 IDE 개발 워크스페이스 (KLIC · 스플리터 2)
   * ======================================================================== */
  const renderStyle2IdeNested = () => (
    <section className="rounded-[28px] bg-zinc-950 border border-zinc-800 p-6 sm:p-8 text-white shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-[11px] font-mono font-semibold">
              KLIC · 스플리터 2
            </span>
            <h3 className="text-lg font-bold text-white">
              다단 중첩 IDE 개발 워크스페이스 스플리터
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            수평 탐색기 분할선과 수직 콘솔 분할선을 각각 마우스로 드래그하여 다단 개발 환경 레이아웃을 구성합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setLeftWidth2(22);
            setTerminalHeight2(36);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          기본 분할 레이아웃
        </button>
      </div>

      {/* 중첩 IDE 프레임 */}
      <div
        ref={ideRef2}
        className="relative h-[520px] rounded-2xl border border-zinc-800 bg-zinc-900/90 overflow-hidden flex select-none"
      >
        {/* 1열: 좌측 파일 트리 탐색기 */}
        <div
          style={{ width: `${leftWidth2}%` }}
          className="h-full bg-zinc-950 border-r border-zinc-800 flex flex-col shrink-0 text-xs"
        >
          <div className="px-3.5 py-2.5 bg-zinc-900/80 border-b border-zinc-800 font-semibold text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-blue-400" />
              프로젝트 파일
            </span>
            <span className="font-mono text-[10px] text-zinc-500">{leftWidth2}%</span>
          </div>

          <div className="p-2 space-y-0.5 overflow-auto flex-1 font-mono text-[11px]">
            {[
              { name: 'payment-gateway.ts', type: 'ts', badge: 'M' },
              { name: 'settlement-rules.json', type: 'json' },
              { name: 'audit-stream.service.ts', type: 'ts' },
              { name: 'env.production.local', type: 'env' },
              { name: 'docker-compose.yml', type: 'yml' },
            ].map((file) => (
              <div
                key={file.name}
                onClick={() => setActiveFile2(file.name)}
                className={`px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                  activeFile2 === file.name
                    ? 'bg-blue-600/20 text-blue-300 font-semibold'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </div>
                {file.badge && (
                  <span className="text-[10px] font-bold text-amber-400">
                    {file.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 1-2열 수평 리사이저 핸들 */}
        <div
          onMouseDown={() => setIsDraggingLeft2(true)}
          className={`w-2 -mx-1 z-30 cursor-col-resize flex items-center justify-center group ${
            isDraggingLeft2 ? 'bg-blue-500' : 'hover:bg-blue-500/50'
          }`}
          title="파일 트리 너비 조절"
        >
          <div className="w-1 h-8 rounded-full bg-zinc-600 group-hover:bg-white" />
        </div>

        {/* 2열: 중앙 코드 에디터 (상단) + 대화형 콘솔 터미널 (하단) - 수직 분할 */}
        <div ref={centerPaneRef2} className="flex-1 h-full flex flex-col min-w-0 bg-zinc-950">
          {/* 상단 에디터 영역 */}
          <div
            style={{ height: `${100 - terminalHeight2}%` }}
            className="flex flex-col min-h-0 bg-zinc-950 overflow-hidden"
          >
            {/* 탭 바 */}
            <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-200 font-semibold">{activeFile2}</span>
              <span className="text-[10px] text-blue-400">● 린트 통과</span>
            </div>

            <div className="p-4 flex-1 overflow-auto font-mono text-xs text-zinc-300 space-y-1">
              <div>
                <span className="text-blue-400">import</span> &#123; createClient &#125;{' '}
                <span className="text-blue-400">from</span>{' '}
                <span className="text-amber-300">'./api/client'</span>;
              </div>
              <div className="text-zinc-500">// 24/7 무중단 정산 파이프라인 핸들러</div>
              <div>
                <span className="text-blue-400">export async function</span>{' '}
                <span className="text-blue-400">handleSettlementSync</span>(batchId: string) &#123;
              </div>
              <div className="pl-4">
                <span className="text-blue-400">const</span> client ={' '}
                <span className="text-blue-400">createClient</span>(&#123; region:{' '}
                <span className="text-amber-300">'ap-seoul'</span> &#125;);
              </div>
              <div className="pl-4">
                <span className="text-blue-400">const</span> result ={' '}
                <span className="text-blue-400">await</span> client.settle(batchId);
              </div>
              <div className="pl-4">
                <span className="text-blue-400">return</span> result.status ==={' '}
                <span className="text-blue-400">'SUCCESS'</span>;
              </div>
              <div>&#125;</div>
            </div>
          </div>

          {/* 수직 리사이저 핸들 (상하 드래그) */}
          <div
            onMouseDown={() => setIsDraggingTerminal2(true)}
            className={`h-2.5 -my-1 z-30 cursor-row-resize flex items-center justify-center group ${
              isDraggingTerminal2 ? 'bg-blue-500' : 'hover:bg-blue-500/50'
            }`}
            title="터미널 높이 조절"
          >
            <div className="h-1 w-12 rounded-full bg-zinc-600 group-hover:bg-white" />
          </div>

          {/* 하단 터미널/콘솔 영역 */}
          <div
            style={{ height: `${terminalHeight2}%` }}
            className="flex flex-col min-h-0 bg-zinc-900/90 border-t border-zinc-800"
          >
            {/* 터미널 탭 헤더 */}
            <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                {[
                  { id: 'terminal', label: '터미널' },
                  { id: 'build', label: '빌드 로그' },
                  { id: 'problems', label: '문제(0)' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTerminalTab2(t.id as any)}
                    className={`font-semibold transition-colors ${
                      terminalTab2 === t.id
                        ? 'text-white border-b-2 border-blue-400 pb-0.5'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <span className="font-mono text-[10px] text-zinc-500">
                높이 {terminalHeight2}%
              </span>
            </div>

            {/* 터미널 출력 창 */}
            <div className="p-3 flex-1 overflow-auto font-mono text-[11px] space-y-1 text-zinc-300">
              {consoleLogs2.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-blue-400">➜</span>
                  <span>{log}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 text-zinc-400 pt-1">
                <span className="text-blue-400">$</span>
                <input
                  type="text"
                  placeholder="명령어 입력 (예: npm run build, ping-cluster)..."
                  className="flex-1 bg-transparent text-white outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      setConsoleLogs2((prev) => [
                        ...prev,
                        `[실행] ${e.currentTarget.value}`,
                      ]);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  /* ========================================================================
   * RENDER 3: 변경 전·후(Diff) 좌우 비교 커튼 스플리터 (KLIC · 스플리터 3)
   * ======================================================================== */
  const renderStyle3DiffCompare = () => (
    <section className="rounded-[28px] bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 p-6 sm:p-8 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-amber-600 text-white text-[11px] font-mono font-semibold">
              KLIC · 스플리터 3
            </span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              변경 전·후(Diff) 좌우 비교 커튼 스플리터
            </h3>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            중앙 커튼 분할선을 슬라이드하여 변경 전(Before) 설정과 변경 후(After) 정책을 직접 비교합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDiffRatio3(50)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          50:50 정렬
        </button>
      </div>

      <div
        ref={diffRef3}
        className="relative h-[400px] rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden select-none flex text-xs font-mono"
      >
        {/* 좌측: 변경 전 (Before - 붉은 틴트) */}
        <div
          style={{ width: `${diffRatio3}%` }}
          className="h-full bg-red-50/40 dark:bg-red-950/20 p-5 overflow-auto border-r border-red-200 dark:border-red-900/60 shrink-0"
        >
          <div className="flex items-center justify-between pb-3 border-b border-red-200/60 dark:border-red-900/50 mb-3 font-sans font-bold text-red-800 dark:text-red-300">
            <span>변경 전 (Before - v1.4)</span>
            <span className="text-[11px] font-mono text-red-600">{diffRatio3}%</span>
          </div>

          <div className="space-y-2 text-zinc-700 dark:text-zinc-300">
            <div className="text-zinc-400">// 기존 결제 승인 정책 설정</div>
            <div className="p-2 rounded bg-red-100/60 dark:bg-red-950/60 text-red-900 dark:text-red-200">
              - timeout_ms: 5000;
            </div>
            <div className="p-2 rounded bg-red-100/60 dark:bg-red-950/60 text-red-900 dark:text-red-200">
              - max_retry_count: 5;
            </div>
            <div>rate_limit_per_sec: 1200;</div>
            <div className="p-2 rounded bg-red-100/60 dark:bg-red-950/60 text-red-900 dark:text-red-200">
              - fallback_strategy: "FAIL_IMMEDIATELY";
            </div>
            <div>auto_sharding: true;</div>
            <div>encryption: "AES_256_GCM";</div>
          </div>
        </div>

        {/* 중앙 커튼 리사이저 바 */}
        <div
          onMouseDown={() => setIsDraggingDiff3(true)}
          className={`w-3 -mx-1.5 z-20 cursor-col-resize flex items-center justify-center group ${
            isDraggingDiff3 ? 'bg-amber-500' : 'hover:bg-amber-500/60'
          }`}
          title="좌우 비교 분할선 이동"
        >
          <div className="w-1.5 h-12 rounded-full bg-amber-500 shadow-md flex items-center justify-center">
            <ArrowRightLeft className="w-2.5 h-2.5 text-white" />
          </div>
        </div>

        {/* 우측: 변경 후 (After - 에메랄드 틴트) */}
        <div
          style={{ width: `${100 - diffRatio3}%` }}
          className="h-full bg-blue-50/40 dark:bg-blue-950/20 p-5 overflow-auto shrink-0"
        >
          <div className="flex items-center justify-between pb-3 border-b border-blue-200/60 dark:border-blue-900/50 mb-3 font-sans font-bold text-blue-800 dark:text-blue-300">
            <span>변경 후 (After - v2.0 개선안)</span>
            <span className="text-[11px] font-mono text-blue-600">{100 - diffRatio3}%</span>
          </div>

          <div className="space-y-2 text-zinc-700 dark:text-zinc-300">
            <div className="text-zinc-400">// 고가용성 멀티 리전 정책 적용</div>
            <div className="p-2 rounded bg-blue-100/60 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 font-bold">
              + timeout_ms: 2500; /* 응답 시간 50% 단축 */
            </div>
            <div className="p-2 rounded bg-blue-100/60 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 font-bold">
              + max_retry_count: 2; /* 지수 백오프 적용 */
            </div>
            <div>rate_limit_per_sec: 1200;</div>
            <div className="p-2 rounded bg-blue-100/60 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 font-bold">
              + fallback_strategy: "CIRCUIT_BREAKER_ROUTING";
            </div>
            <div>auto_sharding: true;</div>
            <div>encryption: "AES_256_GCM";</div>
          </div>
        </div>
      </div>
    </section>
  );

  /* ========================================================================
   * RENDER 4: 수직 스택 쿼리 콘솔 & 결과 테이블 (KLIC · 스플리터 4)
   * ======================================================================== */
  const renderStyle4MasterDetail = () => (
    <section className="rounded-[28px] bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 p-6 sm:p-8 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-700 text-white text-[11px] font-mono font-semibold">
              KLIC · 스플리터 4
            </span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              수직 스택 쿼리 콘솔 & 결과 테이블 스플리터
            </h3>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            상단 SQL 쿼리 입력 창과 하단 대용량 결과 테이블 사이의 수직 분할선을 조절합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setQueryRunning4(true);
            setTimeout(() => setQueryRunning4(false), 600);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
        >
          <Play className="w-3.5 h-3.5" />
          {queryRunning4 ? '쿼리 실행 중...' : 'SQL 쿼리 실행 (⌘+Enter)'}
        </button>
      </div>

      <div
        ref={queryConsoleRef4}
        className="relative h-[480px] rounded-2xl border border-zinc-300 dark:border-zinc-800 bg-zinc-950 overflow-hidden select-none flex flex-col text-xs"
      >
        {/* 상단: SQL 에디터 창 */}
        <div
          style={{ height: `${topHeight4}%` }}
          className="bg-zinc-950 p-4 font-mono text-zinc-300 overflow-auto flex flex-col justify-between shrink-0 border-b border-zinc-800"
        >
          <div className="flex items-center justify-between text-zinc-500 text-[11px] pb-2 border-b border-zinc-800">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              production_ledger_db.sql
            </span>
            <span>콘솔 높이 {topHeight4}%</span>
          </div>

          <div className="py-2 space-y-1">
            <div>
              <span className="text-blue-400">SELECT</span> partner_id, partner_name, sum(amount_krw) AS total_settled, count(*) AS tx_count
            </div>
            <div>
              <span className="text-blue-400">FROM</span> transactions_2026_q4
            </div>
            <div>
              <span className="text-blue-400">WHERE</span> status = <span className="text-amber-300">'APPROVED'</span> AND created_at &gt;= <span className="text-amber-300">'2026-11-01'</span>
            </div>
            <div>
              <span className="text-blue-400">GROUP BY</span> partner_id, partner_name
            </div>
            <div>
              <span className="text-blue-400">ORDER BY</span> total_settled <span className="text-blue-400">DESC</span>
            </div>
            <div>
              <span className="text-blue-400">LIMIT</span> 50;
            </div>
          </div>

          <div className="text-[11px] text-zinc-500">
            실행 통계: 14ms 소요 • 스캔된 행: 142,800개
          </div>
        </div>

        {/* 수직 리사이저 바 */}
        <div
          onMouseDown={() => setIsDraggingVertical4(true)}
          className={`h-3 -my-1.5 z-20 cursor-row-resize flex items-center justify-center group ${
            isDraggingVertical4 ? 'bg-blue-500/40' : 'hover:bg-blue-500/20'
          }`}
          title="상하로 드래그하여 콘솔과 결과창 높이 조절"
        >
          <div className="h-1.5 w-14 rounded-full bg-zinc-600 group-hover:bg-blue-400" />
        </div>

        {/* 하단: 쿼리 결과 데이터 그리드 */}
        <div
          style={{ height: `${100 - topHeight4}%` }}
          className="bg-white dark:bg-zinc-900 overflow-auto flex-1 text-zinc-800 dark:text-zinc-200"
        >
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-zinc-100 dark:bg-zinc-800 sticky top-0 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-700">
              <tr>
                <th className="py-2.5 px-4 font-mono">파트너 식별자</th>
                <th className="py-2.5 px-4">파트너 상호명</th>
                <th className="py-2.5 px-4 text-right">정산 승인 합계</th>
                <th className="py-2.5 px-4 text-right">거래 건수</th>
                <th className="py-2.5 px-4 text-center">검증 상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-800">
              {[
                { id: 'PTN-8901', name: '한빛금융그룹', sum: '₩128,450,000', cnt: '4,280건', status: '정상 승인' },
                { id: 'PTN-8902', name: '네오바이오메디컬', sum: '₩84,200,000', cnt: '2,140건', status: '정상 승인' },
                { id: 'PTN-8903', name: '코어모빌리티', sum: '₩62,800,000', cnt: '1,890건', status: '정상 승인' },
                { id: 'PTN-8904', name: '웨이브커머스', sum: '₩45,120,000', cnt: '1,200건', status: '정상 승인' },
              ].map((row) => (
                <tr key={row.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="py-2.5 px-4 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    {row.id}
                  </td>
                  <td className="py-2.5 px-4 font-medium">{row.name}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-semibold">
                    {row.sum}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-zinc-500">
                    {row.cnt}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      ✓ {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );

  /* ========================================================================
   * RENDER 5: 캔버스 & 인스펙터 접이식 서랍 스플리터 (KLIC · 스플리터 5)
   * ======================================================================== */
  const renderStyle5CanvasDrawer = () => (
    <section className="rounded-[28px] bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 p-6 sm:p-8 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-700 text-white text-[11px] font-mono font-semibold">
              KLIC · 스플리터 5
            </span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              캔버스 & 인스펙터 접이식 서랍 스플리터
            </h3>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            우측 인스펙터 서랍의 너비를 드래그로 조절하거나 버튼을 눌러 완전히 접고 펼칠 수 있습니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDrawerCollapsed5((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
        >
          {isDrawerCollapsed5 ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          {isDrawerCollapsed5 ? '인스펙터 펼치기' : '인스펙터 접기'}
        </button>
      </div>

      <div
        ref={canvasDrawerRef5}
        className="relative h-[460px] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 overflow-hidden select-none flex"
      >
        {/* 좌측 메인 캔버스 */}
        <div className="flex-1 h-full p-8 flex items-center justify-center overflow-auto">
          {/* 인터랙티브 타겟 카드 */}
          <div
            style={{
              borderRadius: `${cardRadius5}px`,
            }}
            className={`w-full max-w-md p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all ${
              cardShadow5 ? 'shadow-2xl' : 'shadow-none'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                  cardAccent5 === 'blue'
                    ? 'bg-blue-600'
                    : cardAccent5 === 'amber'
                    ? 'bg-amber-600'
                    : 'bg-red-600'
                }`}
              >
                실시간 캔버스 미리보기
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                곡률 {cardRadius5}px
              </span>
            </div>

            <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              클라우드 토폴로지 클러스터
            </h4>
            <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
              우측 인스펙터 서랍에서 변경한 디자인 토큰이 이 캔버스 카드에 즉시 반영됩니다.
            </p>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400">인스펙터 연동 정상</span>
              <button
                type="button"
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white ${
                  cardAccent5 === 'blue'
                    ? 'bg-blue-600'
                    : cardAccent5 === 'amber'
                    ? 'bg-amber-600'
                    : 'bg-red-600'
                }`}
              >
                배포 실행
              </button>
            </div>
          </div>
        </div>

        {/* 우측 서랍 리사이저 바 */}
        {!isDrawerCollapsed5 && (
          <div
            onMouseDown={() => setIsDraggingDrawer5(true)}
            className={`w-3 -mx-1.5 z-20 cursor-col-resize flex items-center justify-center group ${
              isDraggingDrawer5 ? 'bg-blue-500' : 'hover:bg-blue-500/50'
            }`}
            title="서랍 너비 조절"
          >
            <div className="w-1.5 h-12 rounded-full bg-zinc-400 dark:bg-zinc-600 group-hover:bg-blue-500" />
          </div>
        )}

        {/* 우측 인스펙터 서랍 */}
        <div
          style={{ width: isDrawerCollapsed5 ? 0 : `${drawerWidth5}px` }}
          className={`h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 transition-[width] duration-150 flex flex-col shrink-0 overflow-hidden ${
            isDrawerCollapsed5 ? 'border-none' : ''
          }`}
        >
          <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              속성 인스펙터 ({drawerWidth5}px)
            </span>
            <button
              type="button"
              onClick={() => setIsDrawerCollapsed5(true)}
              className="p-1 rounded text-zinc-400 hover:text-zinc-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-5 overflow-auto text-xs">
            {/* 포인트 악센트 색상 */}
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                포인트 악센트 컬러
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'blue', label: 'KLIC 블루', bg: 'bg-blue-600' },
                  { id: 'amber', label: '앰버', bg: 'bg-amber-600' },
                  { id: 'red', label: '레드', bg: 'bg-red-600' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCardAccent5(c.id as any)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 border ${
                      cardAccent5 === c.id
                        ? 'border-zinc-900 dark:border-white font-bold'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${c.bg}`} />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 모서리 곡률 슬라이더 */}
            <div>
              <div className="flex items-center justify-between mb-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
                <span>모서리 곡률 (Border Radius)</span>
                <span className="font-mono text-zinc-500">{cardRadius5}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="36"
                value={cardRadius5}
                onChange={(e) => setCardRadius5(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* 그림자 활성화 스위치 */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                외곽 드롭 섀도우 효과
              </span>
              <input
                type="checkbox"
                checked={cardShadow5}
                onChange={(e) => setCardShadow5(e.target.checked)}
                className="rounded accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="space-y-6">
      {/* 상단 5종 스플리터 스타일 전환 바 */}
      <div className="rounded-2xl bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-2 flex flex-wrap items-center gap-1.5">
        {MODE_TABS.map((tab) => {
          const isActive = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveMode(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs border border-zinc-200/80 dark:border-zinc-700'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeMode === 'code-preview' && renderStyle1CodePreview()}
      {activeMode === 'ide-nested' && renderStyle2IdeNested()}
      {activeMode === 'diff-compare' && renderStyle3DiffCompare()}
      {activeMode === 'master-detail' && renderStyle4MasterDetail()}
      {activeMode === 'canvas-drawer' && renderStyle5CanvasDrawer()}

      {activeMode === 'all-showcase' && (
        <div className="space-y-8">
          {renderStyle1CodePreview()}
          {renderStyle2IdeNested()}
          {renderStyle3DiffCompare()}
          {renderStyle4MasterDetail()}
          {renderStyle5CanvasDrawer()}
        </div>
      )}
    </div>
  );
}
