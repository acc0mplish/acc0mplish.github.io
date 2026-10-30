import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  ChevronsUpDown,
  ArrowUp,
  ArrowDown,
  Database,
  Bell,
  Server,
  Shield,
  Cpu,
  Webhook,
  Target,
  Users,
  PanelRight,
  Info,
  X,
} from 'lucide-react';
import { SlaReliabilityItem } from '../../types';
import {
  calculateSlaRiskStats,
  formatMarginPercent,
  filterAndSortSlaItems,
} from '../../utils/sla';

interface SlaRiskIndexBlockProps {
  slaItems: SlaReliabilityItem[];
  onAddSlaItem: (payload: {
    name: string;
    serviceKey: string;
    team: string;
    targetPercent: string;
    marginPercent: number;
  }) => void;
  density: 'compact' | 'normal' | 'relaxed';
}

export function SlaRiskIndexBlock({
  slaItems,
  onAddSlaItem,
  density,
}: SlaRiskIndexBlockProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'exhausted' | 'at-risk' | 'healthy'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [objectiveMode, setObjectiveMode] = useState('계약 SLA 기준');
  const [windowFilter, setWindowFilter] = useState<'기본' | '7일' | '28일' | '30일'>('기본');
  const [teamFilter, setTeamFilter] = useState('전체 팀');
  const [sortField, setSortField] = useState<'name' | 'margin' | 'alert'>('margin');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [selectedId, setSelectedId] = useState<string>(slaItems[0]?.id || 'sla-1');
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [sheetTab, setSheetTab] = useState<'burndown' | 'burnrate' | 'events' | 'edit'>('burndown');
  const [isNewSlaOpen, setIsNewSlaOpen] = useState(false);

  // 새 유지보수 SLA 등록 폼 상태
  const [newName, setNewName] = useState('');
  const [newServiceKey, setNewServiceKey] = useState('maint-worker');
  const [newTeam, setNewTeam] = useState('인프라 유지보수팀');
  const [newMargin, setNewMargin] = useState('-24.5');

  const stats = useMemo(() => calculateSlaRiskStats(slaItems), [slaItems]);

  const filteredItems = useMemo(
    () =>
      filterAndSortSlaItems(slaItems, {
        tab: activeTab,
        searchQuery,
        teamFilter,
        sortField,
        sortDirection,
      }),
    [slaItems, activeTab, searchQuery, teamFilter, sortField, sortDirection]
  );

  // 차트용 전체 정렬 목록 (위험 리스크 낮은 순 -> 높은 순 분포)
  const chartItems = useMemo(
    () => [...slaItems].sort((a, b) => a.marginPercent - b.marginPercent),
    [slaItems]
  );

  const selectedSla = useMemo(
    () => slaItems.find((i) => i.id === selectedId) || slaItems[0],
    [slaItems, selectedId]
  );

  const rowPad =
    density === 'compact'
      ? 'py-2'
      : density === 'relaxed'
      ? 'py-3.5'
      : 'py-2.5';

  const handleSort = (field: 'name' | 'margin' | 'alert') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderServiceIcon = (iconType: SlaReliabilityItem['iconType']) => {
    switch (iconType) {
      case 'database':
        return <Database size={12} className="text-klic-muted shrink-0" />;
      case 'bell':
        return <Bell size={12} className="text-klic-muted shrink-0" />;
      case 'search':
        return <Search size={12} className="text-klic-muted shrink-0" />;
      case 'shield':
        return <Shield size={12} className="text-klic-muted shrink-0" />;
      case 'cpu':
        return <Cpu size={12} className="text-klic-muted shrink-0" />;
      case 'webhook':
        return <Webhook size={12} className="text-klic-muted shrink-0" />;
      case 'server':
      default:
        return <Server size={12} className="text-klic-muted shrink-0" />;
    }
  };

  const handleCreateSla = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const parsedMargin = parseFloat(newMargin) || -15.0;
    onAddSlaItem({
      name: newName.trim(),
      serviceKey: newServiceKey.trim() || 'maint-agent',
      team: newTeam,
      targetPercent: '99.9%',
      marginPercent: parsedMargin,
    });
    setNewName('');
    setIsNewSlaOpen(false);
  };

  // SVG 차트 좌표 계산
  const chartWidth = 440;
  const chartHeight = 250;
  const padLeft = 44;
  const padRight = 18;
  const padTop = 24;
  const padBottom = 24;
  const plotWidth = chartWidth - padLeft - padRight;
  const plotHeight = chartHeight - padTop - padBottom;
  const zeroY = padTop + plotHeight / 2; // 0% 기준선

  const valueToY = (pct: number) => {
    const clamped = Math.max(-100, Math.min(100, pct));
    return zeroY - (clamped / 100) * (plotHeight / 2);
  };

  const selectedChartIdx = Math.max(
    0,
    chartItems.findIndex((i) => i.id === selectedSla?.id)
  );

  return (
    <div className="w-full bg-white  rounded-2xl border border-zinc-200/90  shadow-2xs overflow-hidden transition-colors relative">
      {/* 상단 헤더 */}
      <div className="px-4 sm:px-5 pt-4 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-bold text-zinc-900  tracking-tight">
            SLA 위험 리스크 지수
          </h3>
          <p className="text-xs text-klic-muted  mt-0.5">
            {stats.total}개 유지보수 SLA • {stats.exhaustedCount}개 SLA 초과 •{' '}
            {stats.pagingCount}개 긴급 호출 중
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsDetailsSheetOpen((v) => !v)}
            className="w-8 h-8 rounded-lg border border-zinc-200  bg-white  text-klic-muted  hover:bg-zinc-50 flex items-center justify-center transition shadow-2xs"
            title="추가 옵션"
          >
            <MoreHorizontal size={14} />
          </button>

          <button
            type="button"
            onClick={() => setIsNewSlaOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-klic-inverse  text-klic-on-emphasis  text-xs font-semibold hover:bg-klic-inverse  transition shadow-2xs"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>새 SLA 등록</span>
          </button>
        </div>
      </div>

      {/* 새 유지보수 SLA 추가 인라인 폼 */}
      {isNewSlaOpen && (
        <form
          onSubmit={handleCreateSla}
          className="mx-4 sm:mx-5 mb-3 p-3 rounded-xl bg-zinc-50  border border-zinc-200  flex flex-wrap items-center gap-2.5 text-xs"
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="유지보수 SLA 항목명 입력 (예: 사내 VPN 게이트웨이 장애 복구율)..."
            className="flex-1 min-w-52 px-3 py-1.5 rounded-lg border border-zinc-200  bg-white  text-zinc-900  outline-none"
            autoFocus
          />
          <input
            type="text"
            value={newServiceKey}
            onChange={(e) => setNewServiceKey(e.target.value)}
            placeholder="시스템 식별자 (예: vpn-maint)"
            className="w-36 px-2.5 py-1.5 rounded-lg border border-zinc-200  bg-white  text-zinc-800  outline-none"
          />
          <select
            value={newTeam}
            onChange={(e) => setNewTeam(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-zinc-200  bg-white  text-zinc-700 "
          >
            <option value="인프라 유지보수팀">인프라 유지보수팀</option>
            <option value="백엔드 운영팀">백엔드 운영팀</option>
            <option value="클라우드 관제팀">클라우드 관제팀</option>
            <option value="보안 패치팀">보안 패치팀</option>
            <option value="DB 기술지원팀">DB 기술지원팀</option>
          </select>
          <input
            type="number"
            step="0.1"
            value={newMargin}
            onChange={(e) => setNewMargin(e.target.value)}
            placeholder="잔여 여유율(%)"
            className="w-24 px-2.5 py-1.5 rounded-lg border border-zinc-200  bg-white  text-zinc-800  outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-klic-inverse  text-klic-on-emphasis  font-semibold"
          >
            등록
          </button>
          <button
            type="button"
            onClick={() => setIsNewSlaOpen(false)}
            className="p-1 text-klic-muted hover:text-zinc-700"
          >
            <X size={14} />
          </button>
        </form>
      )}

      {/* 상태 탭 바: 전체 18 / SLA 초과 (위험) 5 / 주의 리스크 3 / 안정 (정상) 10 */}
      <div className="px-4 sm:px-5 flex items-center gap-5 border-b border-zinc-200/80  text-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap -mb-px ${
            activeTab === 'all'
              ? 'border-zinc-900  text-zinc-900  font-semibold'
              : 'border-transparent text-klic-muted hover:text-zinc-800  font-medium'
          }`}
        >
          <span>전체</span>
          <span className="px-1.5 py-0.2 rounded-full bg-zinc-100  border border-zinc-200/70  text-[10px] font-semibold text-zinc-700 ">
            {stats.total}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('exhausted')}
          className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap -mb-px ${
            activeTab === 'exhausted'
              ? 'border-zinc-900  text-zinc-900  font-semibold'
              : 'border-transparent text-klic-muted hover:text-zinc-800  font-medium'
          }`}
        >
          <span>SLA 초과 (위험)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-zinc-100  border border-zinc-200/70  text-[10px] font-semibold text-zinc-700 ">
            {stats.exhaustedCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('at-risk')}
          className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap -mb-px ${
            activeTab === 'at-risk'
              ? 'border-zinc-900  text-zinc-900  font-semibold'
              : 'border-transparent text-klic-muted hover:text-zinc-800  font-medium'
          }`}
        >
          <span>주의 리스크</span>
          <span className="px-1.5 py-0.2 rounded-full bg-zinc-100  border border-zinc-200/70  text-[10px] font-semibold text-zinc-700 ">
            {stats.atRiskCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('healthy')}
          className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap -mb-px ${
            activeTab === 'healthy'
              ? 'border-zinc-900  text-zinc-900  font-semibold'
              : 'border-transparent text-klic-muted hover:text-zinc-800  font-medium'
          }`}
        >
          <span>안정 (정상)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-zinc-100  border border-zinc-200/70  text-[10px] font-semibold text-zinc-700 ">
            {stats.healthyCount}
          </span>
        </button>
      </div>

      {/* 검색 및 기준/기간/팀 필터 툴바 */}
      <div className="px-4 sm:px-5 py-3 border-b border-zinc-200/80  flex flex-wrap items-center justify-between gap-2.5">
        {/* 좌측 검색 */}
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-klic-muted"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="유지보수 SLA 검색..."
            className="pl-8 pr-3 py-1.5 w-56 sm:w-64 rounded-lg border border-zinc-200  bg-white  text-xs text-zinc-800  placeholder:text-klic-muted outline-none focus:border-zinc-400 shadow-2xs"
          />
        </div>

        {/* 우측 필터 그룹 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 계약 SLA 기준 드롭다운 */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200  bg-white  text-xs font-medium text-zinc-700  shadow-2xs">
            <Target size={13} className="text-klic-muted" />
            <select
              value={objectiveMode}
              onChange={(e) => setObjectiveMode(e.target.value)}
              aria-label="평가 기준 선택"
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="계약 SLA 기준">계약 SLA 기준</option>
              <option value="내부 목표 기준">내부 목표 기준</option>
              <option value="긴급 복구 기준">긴급 복구 기준</option>
            </select>
          </div>

          {/* 기간 토글 (기본 | 7일 | 28일 | 30일) */}
          <div className="inline-flex items-center rounded-lg border border-zinc-200  bg-zinc-100/70  p-0.5 text-xs">
            {(['기본', '7일', '28일', '30일'] as const).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWindowFilter(w)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                  windowFilter === w
                    ? 'bg-white  text-zinc-900  shadow-2xs font-semibold'
                    : 'text-klic-muted hover:text-zinc-800 '
                }`}
              >
                {w}
              </button>
            ))}
          </div>

          {/* 유지보수 전담팀 필터 */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200  bg-white  text-xs font-medium text-zinc-700  shadow-2xs">
            <Users size={13} className="text-klic-muted" />
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              aria-label="전담팀 필터"
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="전체 팀">전체 팀</option>
              <option value="인프라 유지보수팀">인프라 유지보수팀</option>
              <option value="백엔드 운영팀">백엔드 운영팀</option>
              <option value="클라우드 관제팀">클라우드 관제팀</option>
              <option value="보안 패치팀">보안 패치팀</option>
              <option value="DB 기술지원팀">DB 기술지원팀</option>
            </select>
          </div>
        </div>
      </div>

      {/* 메인 좌우 분할 영역: 좌측 유지보수 SLA 그리드 + 우측 위험 리스크 분포 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* 좌측: 유지보수 프로젝트 SLA 테이블 */}
        <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-zinc-200/80  max-h-[540px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-zinc-50/95  backdrop-blur-xs">
              <tr className="border-b border-zinc-200/80  text-[11px] font-medium text-klic-muted  whitespace-nowrap">
                <th className="py-2.5 pl-4 pr-2 font-medium">
                  <button
                    type="button"
                    onClick={() => handleSort('name')}
                    className="inline-flex items-center gap-1 hover:text-zinc-800 "
                  >
                    <span>SLA 항목</span>
                    <ChevronsUpDown size={11} className="text-klic-muted" />
                  </button>
                </th>
                <th className="py-2.5 px-3 font-medium">
                  <button
                    type="button"
                    onClick={() => handleSort('margin')}
                    className="inline-flex items-center gap-1 hover:text-zinc-800 "
                  >
                    <span>잔여 여유율</span>
                    {sortField === 'margin' && sortDirection === 'desc' ? (
                      <ArrowDown size={11} className="text-klic-muted" />
                    ) : (
                      <ArrowUp size={11} className="text-klic-muted" />
                    )}
                  </button>
                </th>
                <th className="py-2.5 px-3 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <span>한도 도달</span>
                    <ChevronsUpDown size={11} className="text-klic-muted" />
                  </span>
                </th>
                <th className="py-2.5 pl-3 pr-4 font-medium">
                  <button
                    type="button"
                    onClick={() => handleSort('alert')}
                    className="inline-flex items-center gap-1 hover:text-zinc-800 "
                  >
                    <span>경보 상태</span>
                    <ChevronsUpDown size={11} className="text-klic-muted" />
                  </button>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200/60  text-xs">
              {filteredItems.map((item) => {
                const isSelected = item.id === selectedSla?.id;
                const isNegative = item.marginPercent < 0;

                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-zinc-100/80 '
                        : 'hover:bg-zinc-50/80 '
                    }`}
                  >
                    {/* 유지보수 SLA 항목명 & 서비스 메타 */}
                    <td className={`${rowPad} pl-4 pr-2`}>
                      <div className="font-semibold text-zinc-900  tracking-tight">
                        {item.name}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-klic-muted  mt-0.5 whitespace-nowrap">
                        {renderServiceIcon(item.iconType)}
                        <span className="font-mono">{item.serviceKey}</span>
                        <span>•</span>
                        <span>{item.targetPercent}</span>
                        <span>•</span>
                        <span>{windowFilter === '기본' ? item.windowLabel : windowFilter}</span>
                      </div>
                    </td>

                    {/* 잔여 여유율 (Budget Left / Risk Margin) */}
                    <td
                      className={`${rowPad} px-3 font-mono font-semibold whitespace-nowrap ${
                        isNegative
                          ? 'text-blue-600 '
                          : 'text-blue-600 '
                      }`}
                    >
                      {formatMarginPercent(item.marginPercent)}
                    </td>

                    {/* 한도 도달 (Runs Out) */}
                    <td
                      className={`${rowPad} px-3 whitespace-nowrap font-medium ${
                        item.runsOutLabel === '한도 초과'
                          ? 'text-blue-600 '
                          : 'text-zinc-800 '
                      }`}
                    >
                      {item.runsOutLabel}
                    </td>

                    {/* 경보 상태 (Alert) */}
                    <td className={`${rowPad} pl-3 pr-4 whitespace-nowrap`}>
                      {item.alertState === '긴급 호출' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50  border border-blue-200/70  text-[11px] font-medium text-blue-600 ">
                          긴급 호출
                        </span>
                      ) : (
                        <span className="text-klic-muted ">
                          대기
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-xs text-klic-muted">
                    검색 조건과 일치하는 유지보수 SLA가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 우측: 위험 리스크 분포 지수 (Risk Distribution Lollipop Chart) */}
        <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between bg-white ">
          <div>
            {/* 차트 상단 헤더 */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-zinc-900 ">
                  위험 리스크 분포 지수
                </h4>
                {selectedSla && (
                  <p className="text-[11px] text-klic-muted  mt-0.5">
                    <span>{selectedSla.name}</span>
                    <span className="mx-1">•</span>
                    <span
                      className={`font-mono font-semibold ${
                        selectedSla.marginPercent < 0
                          ? 'text-blue-600 '
                          : 'text-blue-600 '
                      }`}
                    >
                      {formatMarginPercent(selectedSla.marginPercent)}
                    </span>
                    <span className="mx-1">•</span>
                    <span>
                      {selectedSla.windowLabel} 기준 {selectedSla.targetPercent}
                    </span>
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsDetailsSheetOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200  bg-white  text-[11px] font-medium text-zinc-700  hover:bg-zinc-50 transition shadow-2xs shrink-0"
              >
                <PanelRight size={12} />
                <span>상세 시트</span>
              </button>
            </div>

            {/* 플로팅 선택된 SLA 다크 배지 */}
            {selectedSla && (
              <div className="mt-4 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-klic-inverse  text-klic-on-emphasis  text-[11px] font-semibold shadow-sm">
                  <span className="font-mono">
                    {formatMarginPercent(selectedSla.marginPercent)}
                  </span>
                  <span className="opacity-60">•</span>
                  <span className="truncate max-w-52">{selectedSla.name}</span>
                </span>
              </div>
            )}

            {/* 롤리팝 위험 리스크 분포 SVG 차트 */}
            <div className="w-full overflow-x-auto mt-1">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-auto select-none overflow-visible"
              >
                {/* Y축 그리드 라인 (+100%, +50%, 0%, -50%, -100%) */}
                {[
                  { label: '+100%', val: 100 },
                  { label: '+50%', val: 50 },
                  { label: '0%', val: 0 },
                  { label: '-50%', val: -50 },
                  { label: '-100%', val: -100 },
                ].map((tick) => {
                  const y = valueToY(tick.val);
                  const isZero = tick.val === 0;
                  return (
                    <g key={tick.label}>
                      <text
                        x={padLeft - 8}
                        y={y + 3}
                        textAnchor="end"
                        className="fill-zinc-400 text-[9px] font-mono"
                      >
                        {tick.label}
                      </text>
                      <line
                        x1={padLeft}
                        y1={y}
                        x2={chartWidth - padRight}
                        y2={y}
                        stroke="currentColor"
                        strokeWidth={isZero ? 1.2 : 0.8}
                        strokeDasharray={isZero ? undefined : '2 3'}
                        className={
                          isZero
                            ? 'text-klic-muted '
                            : 'text-klic-on-emphasis '
                        }
                      />
                    </g>
                  );
                })}

                {/* 선택된 항목 세로 하이라이트 필러 */}
                {chartItems.length > 0 && (
                  <rect
                    x={
                      padLeft +
                      (selectedChartIdx + 0.5) * (plotWidth / chartItems.length) -
                      10
                    }
                    y={padTop - 8}
                    width={20}
                    height={plotHeight + 16}
                    rx={8}
                    className="fill-zinc-200/60  transition-all duration-200"
                  />
                )}

                {/* 18개 유지보수 SLA 롤리팝 스템 & 도트 */}
                {chartItems.map((item, idx) => {
                  const x =
                    padLeft + (idx + 0.5) * (plotWidth / chartItems.length);
                  const y = valueToY(item.marginPercent);
                  const isSelected = item.id === selectedSla?.id;

                  const dotColor =
                    item.riskState === 'exhausted'
                      ? 'var(--klic-component-block-color-danger)'
                      : item.riskState === 'at-risk'
                      ? 'var(--klic-component-block-color-warning)'
                      : 'var(--klic-component-block-color-accent)';

                  return (
                    <g
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className="cursor-pointer group"
                    >
                      {/* 0% 기준선에서 값까지 점선 스템 */}
                      <line
                        x1={x}
                        y1={zeroY}
                        x2={x}
                        y2={y}
                        stroke="currentColor"
                        strokeWidth={1.2}
                        strokeDasharray="2 2"
                        className="text-klic-muted "
                      />

                      {/* 선택된 항목 외곽 링 */}
                      {isSelected && (
                        <circle
                          cx={x}
                          cy={y}
                          r={6.5}
                          fill="none"
                          stroke={dotColor}
                          strokeWidth={1.5}
                          opacity={0.45}
                        />
                      )}

                      {/* 메인 컬러 도트 */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 4.2 : 3.2}
                        fill={dotColor}
                      >
                        <title>{`${item.name} (${formatMarginPercent(item.marginPercent)})`}</title>
                      </circle>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* 상세 시트(4탭) 확장 패널 */}
            {isDetailsSheetOpen && selectedSla && (
              <div className="mt-3 p-3.5 rounded-xl border border-zinc-200  bg-zinc-50/80  text-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-zinc-200  pb-2">
                  <div className="flex items-center gap-3">
                    {(
                      [
                        { id: 'burndown', label: '리스크 소진율' },
                        { id: 'burnrate', label: '위험 가속도' },
                        { id: 'events', label: '장애 이벤트' },
                        { id: 'edit', label: 'SLA 설정' },
                      ] as const
                    ).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSheetTab(t.id)}
                        className={`text-[11px] font-medium transition ${
                          sheetTab === t.id
                            ? 'text-zinc-900  font-bold underline underline-offset-4'
                            : 'text-klic-muted hover:text-zinc-800'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDetailsSheetOpen(false)}
                    className="text-klic-muted hover:text-zinc-700"
                  >
                    <X size={13} />
                  </button>
                </div>

                {sheetTab === 'burndown' && (
                  <div className="text-[11px] text-klic-muted  space-y-1">
                    <div className="font-semibold text-zinc-900 ">
                      {selectedSla.name} ({selectedSla.serviceKey})
                    </div>
                    <div>
                      전담 조직: <span className="font-medium">{selectedSla.team}</span> • 목표 SLA:{' '}
                      <span className="font-mono">{selectedSla.targetPercent}</span>
                    </div>
                    <div>
                      현재 위험 여유율:{' '}
                      <span className="font-mono font-semibold">
                        {formatMarginPercent(selectedSla.marginPercent)}
                      </span>{' '}
                      ({selectedSla.runsOutLabel})
                    </div>
                  </div>
                )}
                {sheetTab === 'burnrate' && (
                  <div className="text-[11px] text-klic-muted ">
                    최근 24시간 위험 소진 가속도: <span className="font-mono font-semibold">1.4x</span> (임계치 2.0x 이하 유지 중)
                  </div>
                )}
                {sheetTab === 'events' && (
                  <div className="text-[11px] text-klic-muted ">
                    최근 유지보수 이벤트: 정기 점검 윈도우 패치 완료 및 응답 지연 스파이크 2건 기록됨
                  </div>
                )}
                {sheetTab === 'edit' && (
                  <div className="text-[11px] text-klic-muted ">
                    계약 SLA 목표치({selectedSla.targetPercent}) 및 평가 주기({selectedSla.windowLabel}) 정책이 잠금 보호되어 있습니다.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 우측 차트 하단 범례: 안정 10 / 주의 리스크 3 / SLA 초과 5 */}
          <div className="pt-3 flex flex-wrap items-center gap-4 text-[11px] text-klic-muted ">
            <div className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>안정 (정상)</span>
              <span className="font-bold text-zinc-900 ">
                {stats.healthyCount}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>주의 리스크</span>
              <span className="font-bold text-zinc-900 ">
                {stats.atRiskCount}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>SLA 초과 (위험)</span>
              <span className="font-bold text-zinc-900 ">
                {stats.exhaustedCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 푸터 요약 바 */}
      <div className="px-4 sm:px-5 py-2.5 border-t border-zinc-200/80  bg-zinc-50/30  flex flex-wrap items-center justify-between gap-2 text-[11px] text-klic-muted ">
        <div>
          전체 {stats.total}개 중{' '}
          <span className="font-semibold text-zinc-900 ">
            {filteredItems.length}
          </span>
          개 SLA 표시 • 2개 경보 음소거됨
        </div>
        <div className="inline-flex items-center gap-1.5">
          <Info size={12} className="text-klic-muted" />
          <span>{objectiveMode} 측정 • 최근 평가: 9월 29일 14:20 KST</span>
        </div>
      </div>
    </div>
  );
}
