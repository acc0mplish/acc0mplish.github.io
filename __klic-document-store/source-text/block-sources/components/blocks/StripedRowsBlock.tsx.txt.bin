import { PersonAvatar } from '../PersonAvatar';
import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  SlidersHorizontal,
  FileSpreadsheet,
  X,
  CreditCard,
  Building2,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Layers,
  Palette,
  Table as TableIcon,
  LayoutGrid,
} from 'lucide-react';
import {
  LedgerTransactionItem,
  ZebraTheme,
  LedgerTransactionType,
  LedgerStatus,
} from '../../types';
import { INITIAL_STRIPED_LEDGER_DATA } from '../../data/componentsData';

interface StripedRowsBlockProps {
  density?: 'compact' | 'normal' | 'relaxed';
}

export function StripedRowsBlock({ density = 'normal' }: StripedRowsBlockProps) {
  const [transactions, setTransactions] = useState<LedgerTransactionItem[]>(
    INITIAL_STRIPED_LEDGER_DATA
  );

  // 줄무늬 테마 설정 (Zebra Theme Settings)
  const [zebraTheme, setZebraTheme] = useState<ZebraTheme>('subtle-gray');
  const [enableRowHoverLine, setEnableRowHoverLine] = useState(true);
  const [mobileLayout, setMobileLayout] = useState<'table' | 'card'>('card');

  // 필터 및 검색
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedCurrencyFilter, setSelectedCurrencyFilter] = useState<string>('all');

  // 모달 및 드로어 상태
  const [activeDetailItem, setActiveDetailItem] =
    useState<LedgerTransactionItem | null>(null);
  const [isNewVoucherModalOpen, setIsNewVoucherModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 새 전표 작성 폼
  const [formRefNo, setFormRefNo] = useState(`TRX-${Math.floor(1000 + Math.random() * 9000)}-KR`);
  const [formType, setFormType] = useState<LedgerTransactionType>('정산 입금');
  const [formCounterparty, setFormCounterparty] = useState('');
  const [formAccountNo, setFormAccountNo] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCurrency, setFormCurrency] = useState<'USD' | 'KRW' | 'EUR' | 'JPY' | 'GBP'>('KRW');
  const [formRail, setFormRail] = useState<'Visa Direct' | 'SEPA' | 'FedNow' | 'SWIFT' | 'ACH'>('Visa Direct');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(id);
    showToast(`전표 번호 '${text}'가 클립보드에 복사되었습니다.`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 필터링된 트랜잭션 목록
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        t.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.counterparty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.counterparty.accountNo.includes(searchQuery) ||
        t.auditor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.rail.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType =
        selectedTypeFilter === 'all' || t.type === selectedTypeFilter;
      const matchStatus =
        selectedStatusFilter === 'all' || t.status === selectedStatusFilter;
      const matchCurrency =
        selectedCurrencyFilter === 'all' || t.currency === selectedCurrencyFilter;

      return matchSearch && matchType && matchStatus && matchCurrency;
    });
  }, [transactions, searchQuery, selectedTypeFilter, selectedStatusFilter, selectedCurrencyFilter]);

  // 줄무늬 배경 클래스 연산 (Zebra Striping Calculation)
  const getZebraRowBg = (index: number) => {
    const isEven = index % 2 === 1; // 짝수 행에 교차 음영 부여
    if (!isEven || zebraTheme === 'none') {
      return 'bg-white ';
    }

    switch (zebraTheme) {
      case 'subtle-gray':
        return 'bg-zinc-50/95 ';
      case 'soft-blue':
        return 'bg-blue-50/70 ';
      case 'tinted-emerald':
        return 'bg-blue-50/60 ';
      case 'high-contrast':
        return 'bg-zinc-100/90 ';
      default:
        return 'bg-white ';
    }
  };

  // 행 밀도 패딩 클래스
  const rowPaddingClass =
    density === 'compact'
      ? 'py-2 px-3'
      : density === 'relaxed'
      ? 'py-4 px-4'
      : 'py-3 px-3.5';

  // 새 전표 등록 핸들러
  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCounterparty || !formAmount) return;

    const parsedNum = parseFloat(formAmount.replace(/,/g, '')) || 100000;
    const isCredit = formType === '정산 입금' || formType === '에스크로 예치' || formType === 'FX 환전';

    const newTrx: LedgerTransactionItem = {
      id: `trx-${Date.now()}`,
      referenceNo: formRefNo,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      timeAgo: '방금 전',
      type: formType,
      counterparty: {
        name: formCounterparty,
        accountNo: formAccountNo || '110-394-00291',
        country: formCurrency === 'KRW' ? '대한민국' : '미국',
        flag: formCurrency === 'KRW' ? '🇰🇷' : formCurrency === 'EUR' ? '🇪🇺' : '🇺🇸',
      },
      rail: formRail,
      currency: formCurrency,
      amount: isCredit ? parsedNum : -parsedNum,
      amountFormatted:
        formCurrency === 'KRW'
          ? `${isCredit ? '+' : '-'}₩${parsedNum.toLocaleString()}`
          : formCurrency === 'EUR'
          ? `${isCredit ? '+' : '-'}€${parsedNum.toLocaleString()}`
          : `${isCredit ? '+' : '-'}$${parsedNum.toLocaleString()}`,
      isCredit,
      fxRate: formCurrency === 'KRW' ? '1 USD = 1,363.50 KRW' : '기준 통화',
      feeAmount: '₩0 (수기 기표)',
      status: '정산 완료',
      auditor: {
        name: '이승우 수석',
        avatarUrl:
          './placeholders/avatar-27ccdef6fa6f.svg',
      },
      notes: '운영자 수기 분개장 전표 등록 건',
    };

    setTransactions((prev) => [newTrx, ...prev]);
    showToast(`전표 '${formRefNo}'가 성공적으로 등록되었습니다.`);
    setIsNewVoucherModalOpen(false);
    setFormCounterparty('');
    setFormAmount('');
    setFormRefNo(`TRX-${Math.floor(1000 + Math.random() * 9000)}-KR`);
  };

  // CSV 다운로드 시뮬레이션
  const handleExportCSV = () => {
    const csvHeader = '전표번호,거래일시,거래유형,상대방,통화,금액,결제망,상태,감사자\n';
    const csvRows = filteredTransactions
      .map(
        (t) =>
          `"${t.referenceNo}","${t.timestamp}","${t.type}","${t.counterparty.name}","${t.currency}","${t.amountFormatted}","${t.rail}","${t.status}","${t.auditor.name}"`
      )
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `트레저리_원장_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('트레저리 원장 CSV 파일 다운로드가 시작되었습니다.');
  };

  return (
    <div className="w-full bg-white  rounded-2xl border border-zinc-200/90  shadow-xs overflow-hidden transition-all p-3.5 sm:p-6 lg:p-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-klic-inverse text-klic-on-emphasis   shadow-2xl text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. Header & Creative Metrics Strip                          */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-5 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-klic-inverse  text-klic-on-emphasis  flex items-center justify-center font-bold text-xs shadow-xs">
                =
              </div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 ">
                줄무늬 행 그리드 · 외환 정산 트레저리 원장
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700   border border-zinc-200 ">
                줄무늬 행
              </span>
            </div>
            <p className="text-xs text-klic-muted  mt-1">
              교차 배경 음영(Zebra striping)으로 10개 이상의 다단 컬럼 데이터를 눈의 피로 없이 안정적으로 추적합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
            <button
              onClick={handleExportCSV}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-700  bg-white  hover:bg-zinc-50  border border-zinc-200  rounded-xl transition shadow-2xs cursor-pointer"
            >
              <FileSpreadsheet size={14} className="text-blue-600" />
              <span>CSV 내보내기</span>
            </button>
            <button
              onClick={() => setIsNewVoucherModalOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-klic-on-emphasis bg-klic-inverse hover:bg-klic-inverse    rounded-xl transition shadow-xs cursor-pointer"
            >
              <Plus size={15} />
              <span>수기 전표 등록</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-zinc-200/80  bg-zinc-50/50 ">
            <span className="text-[11px] text-klic-muted  font-medium">
              24시간 총 원장 거래액
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg sm:text-xl font-extrabold text-zinc-900  tabular-nums">
                $14,842,500
              </span>
              <span className="text-[10px] font-semibold text-blue-600 ">
                +14.2%
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-zinc-200/80  bg-zinc-50/50 ">
            <span className="text-[11px] text-klic-muted  font-medium">
              실시간 정산 성공률
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg sm:text-xl font-extrabold text-blue-600  tabular-nums">
                99.98%
              </span>
              <span className="text-[10px] text-klic-muted">오차 없음</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-zinc-200/80  bg-zinc-50/50 ">
            <span className="text-[11px] text-klic-muted  font-medium">
              지원 멀티 통화
            </span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-xs text-zinc-800 ">
              <span className="px-1.5 py-0.5 rounded bg-zinc-200/70  text-[10px]">KRW</span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-200/70  text-[10px]">USD</span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-200/70  text-[10px]">EUR</span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-200/70  text-[10px]">JPY</span>
              <span className="text-[10px] text-klic-muted">+2</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-200/60  bg-amber-50/40 ">
            <span className="text-[11px] text-amber-700  font-medium">
              이상 거래(FDS) 감시
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg sm:text-xl font-extrabold text-amber-700  tabular-nums">
                1건 보류
              </span>
              <button
                onClick={() => setSelectedStatusFilter('이상 감지')}
                className="text-[10px] font-semibold text-amber-800  hover:underline cursor-pointer"
              >
                조회하기 →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. Interactive Zebra Controls & Filter Toolbar               */}
      {/* ============================================================ */}
      <div className="p-3 sm:p-4 rounded-2xl bg-zinc-50  border border-zinc-200/70  mb-6 flex flex-col gap-3">
        {/* Zebra Theme Picker Strip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/60 ">
          <div className="flex items-center gap-2">
            <Palette size={14} className="text-klic-muted" />
            <span className="text-xs font-bold text-zinc-800 ">
              줄무늬 교차 테마:
            </span>
            <div className="flex items-center gap-1 flex-wrap">
              <button
                onClick={() => setZebraTheme('subtle-gray')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  zebraTheme === 'subtle-gray'
                    ? 'bg-klic-inverse text-klic-on-emphasis   font-semibold shadow-2xs'
                    : 'bg-white  text-klic-muted  hover:bg-zinc-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-zinc-300 " />
                <span>은은한 그레이</span>
              </button>

              <button
                onClick={() => setZebraTheme('soft-blue')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  zebraTheme === 'soft-blue'
                    ? 'bg-blue-600 text-klic-on-emphasis font-semibold shadow-2xs'
                    : 'bg-white  text-klic-muted  hover:bg-zinc-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>소프트 블루</span>
              </button>

              <button
                onClick={() => setZebraTheme('tinted-emerald')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  zebraTheme === 'tinted-emerald'
                    ? 'bg-blue-600 text-klic-on-emphasis font-semibold shadow-2xs'
                    : 'bg-white  text-klic-muted  hover:bg-zinc-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>소프트 블루</span>
              </button>

              <button
                onClick={() => setZebraTheme('high-contrast')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  zebraTheme === 'high-contrast'
                    ? 'bg-klic-inverse text-klic-on-emphasis   font-bold shadow-2xs'
                    : 'bg-white  text-klic-muted  hover:bg-zinc-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-klic-inverse " />
                <span>고대비</span>
              </button>

              <button
                onClick={() => setZebraTheme('none')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  zebraTheme === 'none'
                    ? 'bg-klic-inverse text-klic-on-emphasis   font-semibold'
                    : 'bg-white  text-klic-muted hover:bg-zinc-100'
                }`}
              >
                줄무늬 끄기
              </button>
            </div>
          </div>

          {/* Row Guide toggle & Mobile layout switch */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setEnableRowHoverLine((v) => !v)}
              className={`px-2.5 py-1 rounded-lg text-xs transition cursor-pointer flex items-center gap-1 ${
                enableRowHoverLine
                  ? 'bg-zinc-200/80  text-zinc-900  font-medium'
                  : 'text-klic-muted hover:text-zinc-700'
              }`}
              title="마우스 호버 시 행 좌측에 시선 추적 하이라이트 표시"
            >
              <span>시선 가이드 바</span>
              <span className={`w-1.5 h-1.5 rounded-full ${enableRowHoverLine ? 'bg-blue-500' : 'bg-zinc-300'}`} />
            </button>

            {/* Mobile view toggle */}
            <div className="md:hidden flex items-center p-0.5 rounded-lg bg-zinc-200  text-xs">
              <button
                onClick={() => setMobileLayout('card')}
                className={`p-1 rounded-md transition ${mobileLayout === 'card' ? 'bg-white  shadow-2xs' : 'text-klic-muted'}`}
                title="카드 뷰"
              >
                <LayoutGrid size={13} />
              </button>
              <button
                onClick={() => setMobileLayout('table')}
                className={`p-1 rounded-md transition ${mobileLayout === 'table' ? 'bg-white  shadow-2xs' : 'text-klic-muted'}`}
                title="가로 스크롤 테이블 뷰"
              >
                <TableIcon size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-klic-muted" />
            <input
              type="text"
              placeholder="전표 번호, 상대방 명, 계좌, 결제망, 감사 담당자 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-white  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-klic-muted hover:text-klic-muted p-0.5"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Quick Filter Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-2.5 py-2 text-xs bg-white  border border-zinc-200  rounded-xl text-zinc-800  focus:outline-hidden cursor-pointer"
            >
              <option value="all">전체 거래 유형</option>
              <option value="정산 입금">정산 입금</option>
              <option value="가맹점 송금">가맹점 송금</option>
              <option value="FX 환전">FX 환전</option>
              <option value="에스크로 예치">에스크로 예치</option>
              <option value="수수료 청구">수수료 청구</option>
              <option value="환불 지급">환불 지급</option>
            </select>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-2.5 py-2 text-xs bg-white  border border-zinc-200  rounded-xl text-zinc-800  focus:outline-hidden cursor-pointer"
            >
              <option value="all">전체 상태</option>
              <option value="정산 완료">정산 완료</option>
              <option value="처리 중">처리 중</option>
              <option value="이상 감지">이상 감지</option>
              <option value="보류 대기">보류 대기</option>
            </select>

            <select
              value={selectedCurrencyFilter}
              onChange={(e) => setSelectedCurrencyFilter(e.target.value)}
              className="px-2.5 py-2 text-xs bg-white  border border-zinc-200  rounded-xl text-zinc-800  focus:outline-hidden cursor-pointer"
            >
              <option value="all">전체 통화</option>
              <option value="KRW">KRW (₩)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="GBP">GBP (£)</option>
            </select>

            {(selectedTypeFilter !== 'all' ||
              selectedStatusFilter !== 'all' ||
              selectedCurrencyFilter !== 'all' ||
              searchQuery) && (
              <button
                onClick={() => {
                  setSelectedTypeFilter('all');
                  setSelectedStatusFilter('all');
                  setSelectedCurrencyFilter('all');
                  setSearchQuery('');
                }}
                className="text-xs font-semibold text-klic-muted hover:text-zinc-900  px-2 py-1 cursor-pointer"
              >
                초기화
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3-A. Mobile Card View (Striped Cards for mobile screens)      */}
      {/* ============================================================ */}
      {mobileLayout === 'card' && (
        <div className="md:hidden space-y-3 mb-6">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-klic-muted rounded-xl border border-dashed border-zinc-200 ">
              조건에 맞는 전표가 없습니다.
            </div>
          ) : (
            filteredTransactions.map((trx, idx) => (
              <div
                key={trx.id}
                onClick={() => setActiveDetailItem(trx)}
                className={`p-4 rounded-xl border border-zinc-200/80  shadow-2xs transition cursor-pointer ${getZebraRowBg(
                  idx
                )} relative overflow-hidden`}
              >
                {/* Visual striping indicator */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${
                    trx.status === '정산 완료'
                      ? 'bg-blue-500'
                      : trx.status === '이상 감지'
                      ? 'bg-blue-500'
                      : trx.status === '처리 중'
                      ? 'bg-blue-500'
                      : 'bg-amber-500'
                  }`}
                />

                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-xs text-zinc-900 ">
                      {trx.referenceNo}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200/80  text-zinc-700  font-medium">
                      {trx.rail}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-extrabold tabular-nums ${
                      trx.isCredit
                        ? 'text-blue-600 '
                        : 'text-zinc-900 '
                    }`}
                  >
                    {trx.amountFormatted}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-klic-muted  mb-2">
                  <div className="flex items-center gap-1 truncate">
                    <span>{trx.counterparty.flag}</span>
                    <span className="font-semibold truncate">{trx.counterparty.name}</span>
                  </div>
                  <span className="text-[11px] text-klic-muted shrink-0">{trx.timeAgo}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-200/50  text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <PersonAvatar
                      src={trx.auditor.avatarUrl}
                      alt={trx.auditor.name}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span className="text-klic-muted truncate">{trx.auditor.name}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                      trx.status === '정산 완료'
                        ? 'bg-blue-50 text-blue-700  '
                        : trx.status === '이상 감지'
                        ? 'bg-blue-50 text-blue-700  '
                        : 'bg-amber-50 text-amber-700  '
                    }`}
                  >
                    {trx.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 3-B. Striped Table Section (Desktop & Horizontally Scrollable)*/}
      {/* ============================================================ */}
      <div
        className={`w-full overflow-x-auto border border-zinc-200/90  rounded-xl ${
          mobileLayout === 'card' ? 'hidden md:block' : 'block'
        }`}
      >
        <table className="w-full min-w-[960px] text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-200/90  bg-zinc-100/70  text-[11px] font-semibold text-klic-muted ">
              <th className="py-3 px-3.5 font-medium">전표 번호</th>
              <th className="py-3 px-3 font-medium">거래 일시 (UTC+9)</th>
              <th className="py-3 px-3 font-medium">거래 유형</th>
              <th className="py-3 px-3 font-medium">거래처 / 상대방</th>
              <th className="py-3 px-3 font-medium">정산망</th>
              <th className="py-3 px-3 font-medium">통화</th>
              <th className="py-3 px-3 text-right font-medium">거래 금액</th>
              <th className="py-3 px-3 font-medium">환율 및 수수료</th>
              <th className="py-3 px-3 font-medium">승인 상태</th>
              <th className="py-3 px-3 font-medium">감사자</th>
              <th className="py-3 px-3.5 text-right font-medium">상세 전표</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/40 ">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-klic-muted">
                  <p className="font-semibold text-sm">일치하는 전표가 없습니다.</p>
                  <p className="text-xs mt-1">필터나 검색 조건을 변경해보세요.</p>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((trx, idx) => {
                const zebraBgClass = getZebraRowBg(idx);

                return (
                  <tr
                    key={trx.id}
                    onClick={() => setActiveDetailItem(trx)}
                    className={`group transition-all duration-150 cursor-pointer ${zebraBgClass} hover:bg-zinc-100/90  relative`}
                  >
                    {/* 1. Reference No with Copy Button */}
                    <td className={`${rowPaddingClass} font-mono font-semibold text-zinc-900  whitespace-nowrap`}>
                      <div className="flex items-center gap-1.5">
                        {enableRowHoverLine && (
                          <span className="w-1 h-3.5 rounded-full bg-transparent group-hover:bg-blue-500 transition-colors shrink-0" />
                        )}
                        <span>{trx.referenceNo}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(trx.referenceNo, trx.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-klic-muted hover:text-zinc-700  transition p-0.5"
                          title="전표 번호 복사"
                        >
                          {copiedKey === trx.id ? (
                            <Check size={12} className="text-blue-500" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* 2. Timestamp & time ago */}
                    <td className={`${rowPaddingClass} text-klic-muted  tabular-nums whitespace-nowrap`}>
                      <div className="leading-tight">
                        <p>{trx.timestamp}</p>
                        <p className="text-[10px] text-klic-muted mt-0.5">{trx.timeAgo}</p>
                      </div>
                    </td>

                    {/* 3. Transaction Type */}
                    <td className={`${rowPaddingClass} whitespace-nowrap`}>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                          trx.type === '정산 입금'
                            ? 'bg-blue-50 text-blue-700   border border-blue-200/60 '
                            : trx.type === '가맹점 송금'
                            ? 'bg-blue-50 text-blue-700   border border-blue-200/60 '
                            : trx.type === 'FX 환전'
                            ? 'bg-blue-50 text-blue-700   border border-blue-200/60 '
                            : trx.type === '에스크로 예치'
                            ? 'bg-amber-50 text-amber-700   border border-amber-200/60 '
                            : 'bg-zinc-100 text-zinc-700   border border-zinc-200 '
                        }`}
                      >
                        {trx.isCredit ? (
                          <ArrowDownLeft size={11} className="text-blue-500" />
                        ) : (
                          <ArrowUpRight size={11} className="text-klic-muted" />
                        )}
                        <span>{trx.type}</span>
                      </span>
                    </td>

                    {/* 4. Counterparty */}
                    <td className={`${rowPaddingClass} max-w-[200px] truncate`}>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-sm shrink-0">{trx.counterparty.flag}</span>
                        <div className="min-w-0 truncate">
                          <p className="font-semibold text-zinc-900  truncate">
                            {trx.counterparty.name}
                          </p>
                          <p className="text-[10px] text-klic-muted font-mono truncate">
                            {trx.counterparty.accountNo}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 5. Rail */}
                    <td className={`${rowPaddingClass} whitespace-nowrap`}>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-200/80  text-zinc-700 ">
                        {trx.rail}
                      </span>
                    </td>

                    {/* 6. Currency */}
                    <td className={`${rowPaddingClass} whitespace-nowrap font-mono font-bold text-zinc-700 `}>
                      {trx.currency}
                    </td>

                    {/* 7. Amount Formatted */}
                    <td className={`${rowPaddingClass} text-right whitespace-nowrap`}>
                      <span
                        className={`font-bold tabular-nums text-xs sm:text-[13px] ${
                          trx.isCredit
                            ? 'text-blue-600 '
                            : 'text-zinc-900 '
                        }`}
                      >
                        {trx.amountFormatted}
                      </span>
                    </td>

                    {/* 8. FX Rate & Fee */}
                    <td className={`${rowPaddingClass} whitespace-nowrap text-[11px]`}>
                      <p className="text-klic-muted  truncate">
                        {trx.fxRate || '-'}
                      </p>
                      <p className="text-[10px] text-klic-muted mt-0.5 truncate">
                        수수료: {trx.feeAmount}
                      </p>
                    </td>

                    {/* 9. Status Pill */}
                    <td className={`${rowPaddingClass} whitespace-nowrap`}>
                      {trx.status === '정산 완료' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700   border border-blue-200/80 ">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span>정산 완료</span>
                        </span>
                      )}
                      {trx.status === '처리 중' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700   border border-blue-200/80 ">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          <span>처리 중</span>
                        </span>
                      )}
                      {trx.status === '이상 감지' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700   border border-blue-200/80 ">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                          <span>이상 감지</span>
                        </span>
                      )}
                      {trx.status === '보류 대기' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700   border border-amber-200/80 ">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>보류 대기</span>
                        </span>
                      )}
                    </td>

                    {/* 10. Auditor */}
                    <td className={`${rowPaddingClass} whitespace-nowrap`}>
                      <div className="flex items-center gap-2">
                        <PersonAvatar
                          src={trx.auditor.avatarUrl}
                          alt={trx.auditor.name}
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-zinc-300  shrink-0"
                        />
                        <span className="text-zinc-700  truncate font-medium">
                          {trx.auditor.name}
                        </span>
                      </div>
                    </td>

                    {/* 11. Action View Button */}
                    <td className={`${rowPaddingClass} text-right whitespace-nowrap`}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDetailItem(trx);
                        }}
                        className="p-1.5 text-klic-muted hover:text-zinc-900  hover:bg-zinc-200/60  rounded-lg transition"
                        title="원장 상세 전표 확인"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Grid Footer info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4 text-xs text-klic-muted ">
        <p>
          총 <span className="font-semibold text-zinc-900 ">{transactions.length}</span>건 중{' '}
          <span className="font-semibold text-zinc-900 ">{filteredTransactions.length}</span>건 표시 중
          (교차 테마: {zebraTheme === 'none' ? '미적용' : zebraTheme})
        </p>
        <p className="text-[11px]">
          행 클릭 시 분개장 상세 감사 전표(Audit Slip)를 확인할 수 있습니다.
        </p>
      </div>

      {/* ============================================================ */}
      {/* 4. Slide-over / Modal: Transaction Detail Slip               */}
      {/* ============================================================ */}
      {activeDetailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-klic-inverse/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white  rounded-2xl border border-zinc-200  shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-zinc-100 ">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-zinc-100  flex items-center justify-center text-zinc-900 ">
                  <CreditCard size={16} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 ">
                    자금 관리 원장 전자 전표
                  </h3>
                  <p className="font-mono text-[11px] text-klic-muted">
                    {activeDetailItem.referenceNo}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveDetailItem(null)}
                className="text-klic-muted hover:text-klic-muted  p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Slip Body */}
            <div className="my-4 space-y-4 text-xs">
              {/* Big Amount Card */}
              <div className="p-4 rounded-xl bg-zinc-50  border border-zinc-200/80  text-center">
                <span className="text-[11px] text-klic-muted block mb-1">
                  최종 확정 거래 금액 ({activeDetailItem.currency})
                </span>
                <span
                  className={`text-2xl sm:text-3xl font-extrabold tabular-nums ${
                    activeDetailItem.isCredit
                      ? 'text-blue-600 '
                      : 'text-zinc-900 '
                  }`}
                >
                  {activeDetailItem.amountFormatted}
                </span>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-200  text-zinc-700 ">
                    {activeDetailItem.type}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100  text-blue-700 ">
                    {activeDetailItem.status}
                  </span>
                </div>
              </div>

              {/* Grid detail */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-klic-muted block text-[11px]">거래 상대방</span>
                  <p className="font-semibold text-zinc-900  mt-0.5">
                    {activeDetailItem.counterparty.flag} {activeDetailItem.counterparty.name}
                  </p>
                  <p className="text-[10px] font-mono text-klic-muted">
                    {activeDetailItem.counterparty.accountNo}
                  </p>
                </div>

                <div>
                  <span className="text-klic-muted block text-[11px]">처리 결제망 & 국적</span>
                  <p className="font-semibold text-zinc-900  mt-0.5">
                    {activeDetailItem.rail} ({activeDetailItem.counterparty.country})
                  </p>
                </div>

                <div>
                  <span className="text-klic-muted block text-[11px]">적용 환율</span>
                  <p className="font-mono text-zinc-800  mt-0.5">
                    {activeDetailItem.fxRate || '해당 없음'}
                  </p>
                </div>

                <div>
                  <span className="text-klic-muted block text-[11px]">결제망 수수료</span>
                  <p className="font-mono text-zinc-800  mt-0.5">
                    {activeDetailItem.feeAmount}
                  </p>
                </div>
              </div>

              {/* Auditor & Notes */}
              <div className="p-3 rounded-xl bg-zinc-50  border border-zinc-200/60 ">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-klic-muted">승인 및 감사 담당자</span>
                  <div className="flex items-center gap-1.5">
                    <PersonAvatar
                      src={activeDetailItem.auditor.avatarUrl}
                      alt={activeDetailItem.auditor.name}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span className="font-semibold text-zinc-900  text-[11px]">
                      {activeDetailItem.auditor.name}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-klic-muted  leading-relaxed">
                  <span className="font-semibold text-zinc-700 ">적요 메모:</span>{' '}
                  {activeDetailItem.notes || '정상 처리된 회계 감사 분개장 내역입니다.'}
                </p>
              </div>

              {/* Cryptographic hash simulation */}
              <div>
                <span className="text-[10px] text-klic-muted block mb-1">
                  원장 불변성 해시 검증
                </span>
                <p className="p-2 rounded-lg bg-zinc-100  text-[10px] font-mono text-klic-muted  break-all select-all">
                  0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-100 ">
              <button
                type="button"
                onClick={() => {
                  handleCopy(activeDetailItem.referenceNo, activeDetailItem.id);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700  hover:bg-zinc-100  rounded-xl transition cursor-pointer"
              >
                <Copy size={13} />
                <span>전표 번호 복사</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDetailItem(null)}
                className="px-4 py-2 text-xs font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200   rounded-xl transition cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. Modal: New Manual Voucher (수기 전표 등록)                 */}
      {/* ============================================================ */}
      {isNewVoucherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-klic-inverse/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white  rounded-2xl border border-zinc-200  shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-zinc-100 ">
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 ">
                수기 원장 전표 등록
              </h3>
              <button
                onClick={() => setIsNewVoucherModalOpen(false)}
                className="text-klic-muted hover:text-klic-muted p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700  mb-1">
                    전표 번호 (자동 생성)
                  </label>
                  <input
                    type="text"
                    required
                    readOnly
                    value={formRefNo}
                    className="w-full px-3 py-2 text-xs font-mono bg-zinc-100  border border-zinc-200  rounded-xl text-zinc-900 "
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700  mb-1">
                    거래 유형
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as LedgerTransactionType)}
                    className="w-full px-3 py-2 text-xs bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden cursor-pointer"
                  >
                    <option value="정산 입금">정산 입금</option>
                    <option value="가맹점 송금">가맹점 송금</option>
                    <option value="FX 환전">FX 환전</option>
                    <option value="에스크로 예치">에스크로 예치</option>
                    <option value="수수료 청구">수수료 청구</option>
                    <option value="환불 지급">환불 지급</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700  mb-1">
                  거래처 / 상대방 명
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 토스페이먼츠 코리아, 네이버파이낸셜"
                  value={formCounterparty}
                  onChange={(e) => setFormCounterparty(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700  mb-1">
                    통화 단위
                  </label>
                  <select
                    value={formCurrency}
                    onChange={(e) => setFormCurrency(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden cursor-pointer"
                  >
                    <option value="KRW">KRW (₩ 원화)</option>
                    <option value="USD">USD ($ 달러)</option>
                    <option value="EUR">EUR (€ 유로)</option>
                    <option value="JPY">JPY (¥ 엔화)</option>
                    <option value="GBP">GBP (£ 파운드)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700  mb-1">
                    거래 금액
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: 50,000,000"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700  mb-1">
                    정산 결제망
                  </label>
                  <select
                    value={formRail}
                    onChange={(e) => setFormRail(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden cursor-pointer"
                  >
                    <option value="Visa Direct">Visa Direct</option>
                    <option value="SEPA">SEPA</option>
                    <option value="FedNow">FedNow</option>
                    <option value="SWIFT">SWIFT</option>
                    <option value="ACH">ACH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700  mb-1">
                    계좌 번호 / 식별자
                  </label>
                  <input
                    type="text"
                    placeholder="010-9948-2849"
                    value={formAccountNo}
                    onChange={(e) => setFormAccountNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 ">
                <button
                  type="button"
                  onClick={() => setIsNewVoucherModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-klic-muted  hover:text-zinc-900 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-klic-on-emphasis bg-klic-inverse hover:bg-klic-inverse   rounded-xl transition cursor-pointer"
                >
                  원장 기표하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
