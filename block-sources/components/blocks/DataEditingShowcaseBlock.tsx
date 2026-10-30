import { PersonAvatar } from '../PersonAvatar';
import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Plus,
  MoreVertical,
  Search,
  Undo2,
  Redo2,
  Filter,
  Columns3,
  Settings2,
  Download,
  Check,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  FileSpreadsheet,
  Layers,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Minus,
  Eye,
  Save,
  Trash2,
} from 'lucide-react';

export type DataEditingShowcaseMode =
  | 'proforma-matrix'
  | 'reorder-sheet'
  | 'split-drawer'
  | 'batch-sandbox'
  | 'schema-json'
  | 'all-showcase';

interface DataEditingShowcaseBlockProps {
  initialMode?: DataEditingShowcaseMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

/* ============================================================================
 * 1. 프로포마 10개년 재무 손익 & ROI 시뮬레이션 시트 데이터 (KLIC/edit-1)
 * ============================================================================ */
interface ProFormaExpenseItem {
  id: string;
  label: string;
  basis: '연간' | '유효매출 대비 %' | '월간';
  inputValue: number;
  unitSuffix: string;
}

const INITIAL_EXPENSE_ITEMS: ProFormaExpenseItem[] = [
  {
    id: 'exp-tax',
    label: '인프라 취득·보유세',
    basis: '연간',
    inputValue: 4680,
    unitSuffix: '/년',
  },
  {
    id: 'exp-ins',
    label: '사이버 배상 책임보험',
    basis: '유효매출 대비 %',
    inputValue: 3.1,
    unitSuffix: '%',
  },
  {
    id: 'exp-mgmt',
    label: '클라우드 매니지드 운영비',
    basis: '유효매출 대비 %',
    inputValue: 8.0,
    unitSuffix: '%',
  },
  {
    id: 'exp-repairs',
    label: '노드 교체 및 유지보수',
    basis: '연간',
    inputValue: 2650,
    unitSuffix: '/년',
  },
  {
    id: 'exp-util',
    label: '전력 및 전용회선 통신비',
    basis: '월간',
    inputValue: 185,
    unitSuffix: '',
  },
  {
    id: 'exp-cap',
    label: '자본적 지출 예비비',
    basis: '연간',
    inputValue: 1200,
    unitSuffix: '/년',
  },
];

/* ============================================================================
 * 2. 스마트 발주 & 공급망 셀 에디터 그리드 데이터 (KLIC/edit-2)
 * ============================================================================ */
type ReorderStatus = '재고 충분' | '보류 중' | '발주 완료' | '긴급 보충';

interface ReorderRowItem {
  id: string;
  rowNum: number;
  sku: string;
  itemName: string;
  buyerName: string;
  buyerAvatar: string;
  warehouse: string;
  status: ReorderStatus;
  onHand: number;
  reorderQty: number;
  unitPrice: number;
}

const BUYER_PROFILES = [
  {
    name: '강태우',
    avatar:
      './placeholders/avatar-2ca18b045556.svg',
  },
  {
    name: '김서연',
    avatar:
      './placeholders/avatar-0cbdeb5e5e6f.svg',
  },
  {
    name: '박지민',
    avatar:
      './placeholders/avatar-ed36204aee6b.svg',
  },
  {
    name: '최수아',
    avatar:
      './placeholders/avatar-32b9a55c6abe.svg',
  },
];

const INITIAL_REORDER_ROWS: ReorderRowItem[] = [
  {
    id: 'r-1',
    rowNum: 1,
    sku: 'LUB-CL-AE',
    itemName: '고속 랙 서버 방열 윤활 에어로졸, 11온스',
    buyerName: '강태우',
    buyerAvatar:
      './placeholders/avatar-2ca18b045556.svg',
    warehouse: '판교 제1센터',
    status: '재고 충분',
    onHand: 140,
    reorderQty: 50,
    unitPrice: 28000,
  },
  {
    id: 'r-2',
    rowNum: 2,
    sku: 'ELC-FCC-10',
    itemName: '고압 전력 분배기 정밀 퓨즈 모듈, 10A',
    buyerName: '김서연',
    buyerAvatar:
      './placeholders/avatar-0cbdeb5e5e6f.svg',
    warehouse: '김포 물류거점',
    status: '재고 충분',
    onHand: 210,
    reorderQty: 100,
    unitPrice: 45000,
  },
  {
    id: 'r-3',
    rowNum: 3,
    sku: 'CHN-SP40-18',
    itemName: '냉각 팬 구동 스프로킷 40B, 18기어',
    buyerName: '박지민',
    buyerAvatar:
      './placeholders/avatar-ed36204aee6b.svg',
    warehouse: '판교 제1센터',
    status: '재고 충분',
    onHand: 85,
    reorderQty: 40,
    unitPrice: 62000,
  },
  {
    id: 'r-4',
    rowNum: 4,
    sku: 'FST-HB-M8X40-ZN',
    itemName: '서버 랙 고정용 아연도금 육각 볼트 M8 x 40',
    buyerName: '강태우',
    buyerAvatar:
      './placeholders/avatar-2ca18b045556.svg',
    warehouse: '판교 제1센터',
    status: '재고 충분',
    onHand: 640,
    reorderQty: 300,
    unitPrice: 12000,
  },
  {
    id: 'r-5',
    rowNum: 5,
    sku: 'FST-SC-M6X20',
    itemName: '블레이드 섀시 소켓 캡 스크류 M6 x 20',
    buyerName: '강태우',
    buyerAvatar:
      './placeholders/avatar-2ca18b045556.svg',
    warehouse: '부산 에코센터',
    status: '재고 충분',
    onHand: 420,
    reorderQty: 200,
    unitPrice: 15000,
  },
  {
    id: 'r-6',
    rowNum: 6,
    sku: 'BRG-6206-2RS',
    itemName: '항온항습기 밀폐형 볼 베어링 6206',
    buyerName: '박지민',
    buyerAvatar:
      './placeholders/avatar-ed36204aee6b.svg',
    warehouse: '김포 물류거점',
    status: '재고 충분',
    onHand: 92,
    reorderQty: 60,
    unitPrice: 54000,
  },
  {
    id: 'r-7',
    rowNum: 7,
    sku: 'BRG-6206-2RS-B',
    itemName: '항온항습기 밀폐형 볼 베어링 6206 (예비품)',
    buyerName: '박지민',
    buyerAvatar:
      './placeholders/avatar-ed36204aee6b.svg',
    warehouse: '부산 에코센터',
    status: '재고 충분',
    onHand: 64,
    reorderQty: 40,
    unitPrice: 54000,
  },
  {
    id: 'r-8',
    rowNum: 8,
    sku: 'BLT-TB8M-800',
    itemName: '공조기 고장력 타이밍 벨트 8M-800, 20mm',
    buyerName: '박지민',
    buyerAvatar:
      './placeholders/avatar-ed36204aee6b.svg',
    warehouse: '김포 물류거점',
    status: '보류 중',
    onHand: 12,
    reorderQty: 80,
    unitPrice: 89000,
  },
  {
    id: 'r-9',
    rowNum: 9,
    sku: 'ELC-MCB3P-32',
    itemName: '랙 PDU 소형 배선차단기 3극, 32A',
    buyerName: '김서연',
    buyerAvatar:
      './placeholders/avatar-0cbdeb5e5e6f.svg',
    warehouse: '세종 데이터센터',
    status: '재고 충분',
    onHand: 115,
    reorderQty: 50,
    unitPrice: 76000,
  },
  {
    id: 'r-10',
    rowNum: 10,
    sku: 'FLT-AP-2020-M13',
    itemName: '클린룸 공조 패널 에어필터 20x20, MERV13',
    buyerName: '최수아',
    buyerAvatar:
      './placeholders/avatar-32b9a55c6abe.svg',
    warehouse: '인천 글로벌허브',
    status: '재고 충분',
    onHand: 190,
    reorderQty: 120,
    unitPrice: 38000,
  },
  {
    id: 'r-11',
    rowNum: 11,
    sku: 'LUB-HO46-P5',
    itemName: '비상발전기 유압 오일 ISO 46, 5갤런',
    buyerName: '최수아',
    buyerAvatar:
      './placeholders/avatar-32b9a55c6abe.svg',
    warehouse: '인천 글로벌허브',
    status: '발주 완료',
    onHand: 28,
    reorderQty: 90,
    unitPrice: 112000,
  },
];

const MODE_TABS: {
  id: DataEditingShowcaseMode;
  label: string;
  pkg: string;
}[] = [
  {
    id: 'proforma-matrix',
    label: '1. 10개년 손익 & ROI 수식 시트',
    pkg: 'KLIC/edit-1',
  },
  {
    id: 'reorder-sheet',
    label: '2. 스마트 발주 & 셀 에디터 그리드',
    pkg: 'KLIC/edit-2',
  },
  {
    id: 'split-drawer',
    label: '3. 마스터-디테일 인스펙터 편집기',
    pkg: 'KLIC/edit-3',
  },
  {
    id: 'batch-sandbox',
    label: '4. 변경 전·후 비교 일괄 편집 샌드박스',
    pkg: 'KLIC/edit-4',
  },
  {
    id: 'schema-json',
    label: '5. 환경별 정책 & 다국어 매트릭스 편집기',
    pkg: 'KLIC/edit-5',
  },
  {
    id: 'all-showcase',
    label: '전체 5종 한눈에 보기',
    pkg: 'KLIC/edit-all',
  },
];

export function DataEditingShowcaseBlock({
  initialMode = 'proforma-matrix',
}: DataEditingShowcaseBlockProps) {
  const [activeMode, setActiveMode] =
    useState<DataEditingShowcaseMode>(initialMode);

  React.useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  /* ------------------------------------------------------------------------
   * State for Style 1: 10-Year Pro Forma Financial Model (Image 1)
   * ------------------------------------------------------------------------ */
  const [price, setPrice] = useState<number>(245000);
  const [downPercent, setDownPercent] = useState<number>(25);
  const [closingCost, setClosingCost] = useState<number>(8500);
  const [interestRate, setInterestRate] = useState<number>(3.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(20);
  const [horizonYears, setHorizonYears] = useState<5 | 10>(10);
  const [focusedYear, setFocusedYear] = useState<number>(1);

  const [revGrowthRate, setRevGrowthRate] = useState<number>(3.5);
  const [expGrowthRate, setExpGrowthRate] = useState<number>(2.5);
  const [appreciationRate, setAppreciationRate] = useState<number>(3.0);
  const [baseMonthlyRevenue, setBaseMonthlyRevenue] = useState<number>(4109);
  const [expenses, setExpenses] = useState<ProFormaExpenseItem[]>(
    INITIAL_EXPENSE_ITEMS
  );

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    growth: true,
    revenues: false,
    expenses: true,
    cashflow: true,
    returns: true,
  });

  const [editingBlueCell, setEditingBlueCell] = useState<string | null>(null);
  const [proFormaDropdown, setProFormaDropdown] = useState<string | null>(null);

  const handleResetProForma = () => {
    setPrice(245000);
    setDownPercent(25);
    setClosingCost(8500);
    setInterestRate(3.5);
    setLoanTermYears(20);
    setRevGrowthRate(3.5);
    setExpGrowthRate(2.5);
    setAppreciationRate(3.0);
    setBaseMonthlyRevenue(4109);
    setExpenses(INITIAL_EXPENSE_ITEMS);
    setFocusedYear(1);
    setEditingBlueCell(null);
    setProFormaDropdown(null);
  };

  // Financial calculations matching Image 1
  const proFormaCalc = useMemo(() => {
    const loanAmount = price * (1 - downPercent / 100);
    const cashIn = price * (downPercent / 100) + closingCost;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTermYears * 12;
    const monthlyPayment =
      monthlyRate > 0
        ? (loanAmount *
            (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
          (Math.pow(1 + monthlyRate, totalPayments) - 1)
        : loanAmount / totalPayments;
    const annualDebtService = Math.round(monthlyPayment * 12);

    const years = Array.from({ length: horizonYears }, (_, i) => i + 1);

    const yearRevenues = years.map((yr) =>
      Math.round(
        baseMonthlyRevenue * 12 * Math.pow(1 + revGrowthRate / 100, yr - 1)
      )
    );

    const expenseRows = expenses.map((item) => {
      const year1Val =
        item.basis === '연간'
          ? item.inputValue
          : item.basis === '월간'
          ? item.inputValue * 12
          : Math.round((yearRevenues[0] * item.inputValue) / 100);

      const yearlyValues = years.map((yr) => {
        if (item.basis === '유효매출 대비 %') {
          return Math.round((yearRevenues[yr - 1] * item.inputValue) / 100);
        }
        return Math.round(year1Val * Math.pow(1 + expGrowthRate / 100, yr - 1));
      });

      return {
        ...item,
        yearlyValues,
      };
    });

    const totalExpensesByYear = years.map((_, yrIdx) =>
      expenseRows.reduce((acc, row) => acc + row.yearlyValues[yrIdx], 0)
    );

    const monthlyTotalExpenses = Math.round(totalExpensesByYear[0] / 12);

    const noiByYear = years.map(
      (_, yrIdx) => yearRevenues[yrIdx] - totalExpensesByYear[yrIdx]
    );
    const monthlyNoi = baseMonthlyRevenue - monthlyTotalExpenses;

    const netCashFlowByYear = years.map(
      (_, yrIdx) => noiByYear[yrIdx] - annualDebtService
    );
    const monthlyNetCashFlow = monthlyNoi - Math.round(monthlyPayment);

    const cashRoiByYear = years.map((_, yrIdx) =>
      cashIn > 0 ? (netCashFlowByYear[yrIdx] / cashIn) * 100 : 0
    );

    const equityAccruedByYear = years.map((yr) =>
      Math.round(6460 * Math.pow(1 + appreciationRate / 100, yr - 1))
    );

    const totalReturnByYear = years.map(
      (_, yrIdx) =>
        netCashFlowByYear[yrIdx] +
        equityAccruedByYear[yrIdx] +
        Math.round(7350 * Math.pow(1.03, yrIdx))
    );

    const totalRoiByYear = years.map((_, yrIdx) =>
      cashIn > 0 ? (totalReturnByYear[yrIdx] / cashIn) * 100 : 0
    );

    return {
      loanAmount,
      cashIn,
      monthlyPayment: Math.round(monthlyPayment),
      annualDebtService,
      years,
      yearRevenues,
      expenseRows,
      totalExpensesByYear,
      monthlyTotalExpenses,
      noiByYear,
      monthlyNoi,
      netCashFlowByYear,
      monthlyNetCashFlow,
      cashRoiByYear,
      equityAccruedByYear,
      totalReturnByYear,
      totalRoiByYear,
    };
  }, [
    price,
    downPercent,
    closingCost,
    interestRate,
    loanTermYears,
    horizonYears,
    revGrowthRate,
    expGrowthRate,
    appreciationRate,
    baseMonthlyRevenue,
    expenses,
  ]);

  /* ------------------------------------------------------------------------
   * State for Style 2: Reorder Plan Spreadsheet Grid (Image 2)
   * ------------------------------------------------------------------------ */
  const [reorderRows, setReorderRows] =
    useState<ReorderRowItem[]>(INITIAL_REORDER_ROWS);
  const [historyPast, setHistoryPast] = useState<ReorderRowItem[][]>([]);
  const [historyFuture, setHistoryFuture] = useState<ReorderRowItem[][]>([]);
  const [reorderSearch, setReorderSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [activeCell, setActiveCell] = useState<{
    rowId: string;
    colKey: 'sku' | 'itemName' | 'buyerName' | 'warehouse' | 'status' | 'reorderQty';
    coord: string;
  }>({
    rowId: 'r-8',
    colKey: 'status',
    coord: 'E8',
  });
  const [statusFilter, setStatusFilter] = useState<string>('전체');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('전체');
  const [buyerFilter, setBuyerFilter] = useState<string>('전체');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);
  const [cellDropdown, setCellDropdown] = useState<{
    rowId: string;
    type: 'buyer' | 'warehouse';
  } | null>(null);

  const updateReorderRowWithHistory = (
    rowId: string,
    patch: Partial<ReorderRowItem>
  ) => {
    setHistoryPast((prev) => [...prev.slice(-10), reorderRows]);
    setHistoryFuture([]);
    setReorderRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, ...patch } : row))
    );
  };

  const handleUndoReorder = () => {
    if (historyPast.length === 0) return;
    const previous = historyPast[historyPast.length - 1];
    setHistoryPast((prev) => prev.slice(0, -1));
    setHistoryFuture((prev) => [reorderRows, ...prev]);
    setReorderRows(previous);
  };

  const handleRedoReorder = () => {
    if (historyFuture.length === 0) return;
    const next = historyFuture[0];
    setHistoryFuture((prev) => prev.slice(1));
    setHistoryPast((prev) => [...prev, reorderRows]);
    setReorderRows(next);
  };

  const handleResetReorder = () => {
    setReorderRows(INITIAL_REORDER_ROWS);
    setHistoryPast([]);
    setHistoryFuture([]);
    setReorderSearch('');
    setStatusFilter('전체');
    setWarehouseFilter('전체');
    setBuyerFilter('전체');
    setIsFilterMenuOpen(false);
    setSelectedRows([]);
  };

  const filteredReorderRows = reorderRows.filter((r) => {
    if (statusFilter !== '전체' && r.status !== statusFilter) return false;
    if (warehouseFilter !== '전체' && r.warehouse !== warehouseFilter) return false;
    if (buyerFilter !== '전체' && r.buyerName !== buyerFilter) return false;
    if (!reorderSearch.trim()) return true;
    const q = reorderSearch.toLowerCase();
    return (
      r.sku.toLowerCase().includes(q) ||
      r.itemName.toLowerCase().includes(q) ||
      r.buyerName.toLowerCase().includes(q) ||
      r.warehouse.toLowerCase().includes(q)
    );
  });

  const inspectedRow =
    reorderRows.find((r) => r.id === activeCell.rowId) || reorderRows[0];

  /* ------------------------------------------------------------------------
   * State for Style 3: Master-Detail Split Drawer Editor (KLIC/edit-3)
   * ------------------------------------------------------------------------ */
  const [splitRecords, setSplitRecords] = useState([
    {
      id: 'ENT-401',
      company: '한빛금융그룹',
      owner: '강태우',
      avatar:
        './placeholders/avatar-2ca18b045556.svg',
      tier: '엔터프라이즈 전용',
      seats: 520,
      mrr: 4250,
      renewalDate: '2026-12-15',
      tags: ['금융보안망', '다년약정', '전담기술지원'],
    },
    {
      id: 'ENT-402',
      company: '네오바이오메디컬',
      owner: '김서연',
      avatar:
        './placeholders/avatar-0cbdeb5e5e6f.svg',
      tier: '비즈니스 플러스',
      seats: 180,
      mrr: 1680,
      renewalDate: '2026-11-30',
      tags: ['의료데이터', '자동백업'],
    },
    {
      id: 'ENT-403',
      company: '코어모빌리티시스템즈',
      owner: '박지민',
      avatar:
        './placeholders/avatar-ed36204aee6b.svg',
      tier: '엔터프라이즈 전용',
      seats: 840,
      mrr: 6890,
      renewalDate: '2027-01-20',
      tags: ['자율주행클러스터', '무중단SLA'],
    },
  ]);
  const [selectedSplitId, setSelectedSplitId] = useState('ENT-401');
  const [newTagText, setNewTagText] = useState('');

  const activeSplitItem =
    splitRecords.find((r) => r.id === selectedSplitId) || splitRecords[0];

  /* ------------------------------------------------------------------------
   * State for Style 4: Batch Diff Sandbox Editor (KLIC/edit-4)
   * ------------------------------------------------------------------------ */
  const INITIAL_SANDBOX_ITEMS = [
    {
      id: 'SB-01',
      service: '코어 원장 트랜잭션 노드',
      manager: '이준혁',
      avatar:
        './placeholders/avatar-3a010bc432b4.svg',
      originQuota: 1000,
      nextQuota: 1200,
      originPrice: 850,
      nextPrice: 920,
    },
    {
      id: 'SB-02',
      service: '실시간 이상거래 탐지 엔진',
      manager: '최수아',
      avatar:
        './placeholders/avatar-32b9a55c6abe.svg',
      originQuota: 500,
      nextQuota: 500,
      originPrice: 640,
      nextPrice: 640,
    },
    {
      id: 'SB-03',
      service: '글로벌 정산 배치 워커',
      manager: '김서연',
      avatar:
        './placeholders/avatar-0cbdeb5e5e6f.svg',
      originQuota: 2000,
      nextQuota: 2500,
      originPrice: 1200,
      nextPrice: 1320,
    },
  ];
  const [sandboxRows, setSandboxRows] = useState(INITIAL_SANDBOX_ITEMS);
  const [sandboxCommitted, setSandboxCommitted] = useState(false);

  const handleBulkPercentAdjust = (pct: number) => {
    setSandboxCommitted(false);
    setSandboxRows((prev) =>
      prev.map((row) => ({
        ...row,
        nextPrice: Math.round(row.nextPrice * (1 + pct / 100)),
      }))
    );
  };

  /* ------------------------------------------------------------------------
   * State for Style 5: Environment Policy & Key-Value Matrix (KLIC/edit-5)
   * ------------------------------------------------------------------------ */
  const [policyRules, setPolicyRules] = useState([
    {
      key: 'RATE_LIMIT_BURST',
      title: '초당 최대 버스트 요청 허용치',
      stagingVal: 1500,
      prodVal: 5000,
      unit: '건/초',
      enforced: true,
    },
    {
      key: 'SETTLEMENT_TIMEOUT_MS',
      title: '외부 결제망 승인 응답 대기 제한시간',
      stagingVal: 2500,
      prodVal: 3500,
      unit: '밀리초',
      enforced: true,
    },
    {
      key: 'MAX_EXPORT_ROWS',
      title: '단일 CSV 내보내기 최대 허용 행 수',
      stagingVal: 50000,
      prodVal: 250000,
      unit: '행',
      enforced: false,
    },
  ]);

  /* ========================================================================
   * RENDER 1: 10개년 재무 손익 & ROI 시뮬레이션 시트 (Reference Image 1)
   * ======================================================================== */
  const renderStyle1ProFormaMatrix = () => (
    <section
      onClick={() => setProFormaDropdown(null)}
      className="rounded-2xl bg-white  border border-zinc-200/90  shadow-[0_14px_40px_color-mix(in_srgb,var(--klic-component-block-color-text)_5%,transparent)] overflow-hidden"
    >
      {/* 상단 타이틀 & 컨트롤 헤더 (원본 1:1: 파라미터 스트립과 보더라인 없이 연결) */}
      <div className="px-6 pt-5 pb-2 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 ">
              엔터프라이즈 인프라 손익 프로포마
            </h2>
          </div>
          <p className="text-xs sm:text-[13px] text-klic-muted  mt-0.5">
            <strong className="text-zinc-900  font-semibold">
              {focusedYear}년차
            </strong>{' '}
            <span className="text-klic-muted  mx-0.5">•</span>{' '}
            순영업이익(NOI){' '}
            <span className="text-klic-muted ">
              {proFormaCalc.noiByYear[focusedYear - 1]?.toLocaleString()}
            </span>{' '}
            <span className="text-klic-muted  mx-0.5">•</span>{' '}
            순현금흐름{' '}
            <span className="text-klic-muted ">
              {proFormaCalc.netCashFlowByYear[focusedYear - 1]?.toLocaleString()}
            </span>{' '}
            <span className="text-klic-muted  mx-0.5">•</span>{' '}
            총 투자수익률(ROI){' '}
            <span className="text-klic-muted ">
              {proFormaCalc.totalRoiByYear[focusedYear - 1]?.toFixed(1)}%
            </span>
          </p>
        </div>

        {/* 우측 기간 선택 / 뷰 / 초기화 버튼 (네이티브 select 제거, 커스텀 팝오버) */}
        <div className="flex items-center gap-2">
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() =>
                setProFormaDropdown(
                  proFormaDropdown === 'horizon' ? null : 'horizon'
                )
              }
              className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-white  border border-zinc-200/90  text-xs font-medium text-zinc-800  hover:bg-zinc-50 transition-colors"
            >
              <span>{horizonYears}개년</span>
              <ChevronDown className="w-3.5 h-3.5 text-klic-muted" />
            </button>

            {proFormaDropdown === 'horizon' && (
              <div className="absolute right-0 mt-1 w-28 bg-white  border border-zinc-200  rounded-xl shadow-lg py-1 z-40 text-xs">
                {[10, 5].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => {
                      setHorizonYears(yr as 5 | 10);
                      if (focusedYear > yr) setFocusedYear(yr);
                      setProFormaDropdown(null);
                    }}
                    className="w-full px-3 py-1.5 text-left hover:bg-zinc-100  text-zinc-800  font-medium flex items-center justify-between"
                  >
                    <span>{yr}개년</span>
                    {horizonYears === yr && (
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              setExpandedSections((prev) => ({
                growth: true,
                revenues: !prev.revenues,
                expenses: true,
                cashflow: true,
                returns: true,
              }))
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white  border border-zinc-200/90  text-xs font-medium text-zinc-800  hover:bg-zinc-50 transition-colors"
          >
            <Columns3 className="w-3.5 h-3.5 text-klic-muted " />
            뷰
          </button>

          <button
            type="button"
            onClick={handleResetProForma}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white  border border-zinc-200/90  text-xs font-medium text-zinc-800  hover:bg-zinc-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-klic-muted " />
            초기화
          </button>
        </div>
      </div>

      {/* 상단 파라미터 캡슐 입력 스트립 (원본 1:1: 내부 input 보더/스피너 완전 제거) */}
      <div className="px-6 pt-2 pb-4 bg-white  border-b border-zinc-200/80  flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* 도입 단가 */}
          <label className="inline-flex items-center gap-2.5 px-3 py-1 rounded-lg bg-white  border border-zinc-200/90  text-xs">
            <span className="text-klic-muted">도입가</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value) || 0)}
              className="w-16 text-right font-medium text-blue-600  bg-transparent border-none outline-none ring-0 focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </label>

          {/* 선수금 비율 */}
          <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white  border border-zinc-200/90  text-xs">
            <span className="text-klic-muted">선수금</span>
            <input
              type="number"
              value={downPercent}
              onChange={(e) => setDownPercent(Number(e.target.value) || 0)}
              className="w-7 text-right font-medium text-blue-600  bg-transparent border-none outline-none ring-0 focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-klic-muted">%</span>
          </label>

          {/* 초기 구축비 */}
          <label className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white  border border-zinc-200/90  text-xs">
            <span className="text-klic-muted">부대비용</span>
            <input
              type="number"
              value={closingCost}
              onChange={(e) => setClosingCost(Number(e.target.value) || 0)}
              className="w-12 text-right font-medium text-blue-600  bg-transparent border-none outline-none ring-0 focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </label>

          {/* 조달 금리 */}
          <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white  border border-zinc-200/90  text-xs">
            <span className="text-klic-muted">금리</span>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
              className="w-8 text-right font-medium text-blue-600  bg-transparent border-none outline-none ring-0 focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-klic-muted">%</span>
          </label>

          {/* 상환 기간 */}
          <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white  border border-zinc-200/90  text-xs">
            <span className="text-klic-muted">기간</span>
            <input
              type="number"
              value={loanTermYears}
              onChange={(e) =>
                setLoanTermYears(Math.max(1, Number(e.target.value) || 1))
              }
              className="w-6 text-right font-medium text-blue-600  bg-transparent border-none outline-none ring-0 focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-klic-muted">년</span>
          </label>
        </div>

        {/* 우측 대출금 / 초기투입현금 / 월납입금 실시간 요약 */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-klic-muted ">
          <span>
            대출원금{' '}
            <strong className="text-zinc-900  font-semibold">
              ${(proFormaCalc.loanAmount / 1000).toFixed(1)}K
            </strong>
          </span>
          <span className="text-klic-muted ">•</span>
          <span>
            투입현금{' '}
            <strong className="text-zinc-900  font-semibold">
              ${(proFormaCalc.cashIn / 1000).toFixed(1)}K
            </strong>
          </span>
          <span className="text-klic-muted ">•</span>
          <span>
            월 상환액{' '}
            <strong className="text-zinc-900  font-semibold">
              {proFormaCalc.monthlyPayment.toLocaleString()}/월
            </strong>
          </span>
        </div>
      </div>

      {/* 메인 다년도 스프레드시트 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs tabular-nums">
          <thead>
            <tr className="bg-zinc-50/70  border-b border-zinc-200/80  text-zinc-700 ">
              <th className="w-7 py-2.5 px-2 border-r border-zinc-200/60 " />
              <th className="text-left py-2.5 px-3 font-semibold min-w-[180px]" />
              <th className="text-left py-2.5 px-3 font-semibold w-32">기준</th>
              <th className="text-right py-2.5 px-3 font-semibold w-24 border-r border-zinc-200/70 ">
                월간
              </th>
              {proFormaCalc.years.map((yr) => (
                <th
                  key={yr}
                  onClick={() => setFocusedYear(yr)}
                  className={`text-right py-2.5 px-3 font-semibold cursor-pointer transition-colors select-none min-w-[74px] border-r border-zinc-200/50  ${
                    focusedYear === yr
                      ? 'bg-blue-50/90  text-zinc-900 '
                      : 'hover:bg-zinc-100/70 '
                  }`}
                >
                  {yr}년차
                </th>
              ))}
              <th className="w-7 py-2.5 px-1" />
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-200/60 ">
            {/* 1. 성장률 가정 (GROWTH RATES) */}
            <tr className="bg-zinc-50/50  font-semibold text-klic-muted ">
              <td className="py-2 px-2 text-center border-r border-zinc-200/60 ">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSections((p) => ({ ...p, growth: !p.growth }))
                  }
                  className="text-klic-muted hover:text-zinc-800"
                >
                  {expandedSections.growth ? (
                    <ChevronDown className="w-3.5 h-3.5 inline" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 inline" />
                  )}
                </button>
              </td>
              <td className="py-2 px-3 tracking-wide text-[11px] font-semibold text-klic-muted ">
                성장률 가정
              </td>
              <td className="py-2 px-3" />
              <td className="py-2 px-3 border-r border-zinc-200/70 " />
              {proFormaCalc.years.map((yr) => (
                <td
                  key={yr}
                  className={`border-r border-zinc-100  ${
                    focusedYear === yr
                      ? 'bg-blue-50/55 '
                      : ''
                  }`}
                />
              ))}
              <td className="py-2 px-1 text-center text-klic-muted">
                <MoreVertical className="w-3.5 h-3.5 inline" />
              </td>
            </tr>

            {expandedSections.growth && (
              <>
                {/* 매출 성장률 */}
                <tr className="hover:bg-zinc-50/60 ">
                  <td className="border-r border-zinc-200/60 " />
                  <td className="py-2 px-3 pl-5 text-zinc-800 ">
                    연간 매출 성장률
                  </td>
                  <td className="py-2 px-3 text-klic-muted">연간</td>
                  <td className="py-2 px-3 text-right border-r border-zinc-200/70 ">
                    {editingBlueCell === 'revGrowth' ? (
                      <input
                        type="number"
                        step="0.1"
                        autoFocus
                        value={revGrowthRate}
                        onChange={(e) =>
                          setRevGrowthRate(Number(e.target.value) || 0)
                        }
                        onBlur={() => setEditingBlueCell(null)}
                        className="w-14 text-right font-medium text-blue-600 bg-transparent border-none outline-none ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditingBlueCell('revGrowth')}
                        className="font-medium text-blue-600  hover:underline"
                      >
                        {revGrowthRate.toFixed(1)}%
                      </button>
                    )}
                  </td>
                  {proFormaCalc.years.map((yr) => (
                    <td
                      key={yr}
                      className={`py-2 px-3 text-right text-klic-muted  border-r border-zinc-100  ${
                        focusedYear === yr
                          ? 'bg-blue-50/55 '
                          : ''
                      }`}
                    >
                      {yr === 1 ? '0.0%' : `${revGrowthRate.toFixed(1)}%`}
                    </td>
                  ))}
                  <td className="py-2 px-1 text-center text-klic-muted">
                    <MoreVertical className="w-3.5 h-3.5 inline" />
                  </td>
                </tr>

                {/* 비용 증가율 */}
                <tr className="hover:bg-zinc-50/60 ">
                  <td className="border-r border-zinc-200/60 " />
                  <td className="py-2 px-3 pl-5 text-zinc-800 ">
                    운영 비용 상승률
                  </td>
                  <td className="py-2 px-3 text-klic-muted">연간</td>
                  <td className="py-2 px-3 text-right border-r border-zinc-200/70 ">
                    {editingBlueCell === 'expGrowth' ? (
                      <input
                        type="number"
                        step="0.1"
                        autoFocus
                        value={expGrowthRate}
                        onChange={(e) =>
                          setExpGrowthRate(Number(e.target.value) || 0)
                        }
                        onBlur={() => setEditingBlueCell(null)}
                        className="w-14 text-right font-medium text-blue-600 bg-transparent border-none outline-none ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditingBlueCell('expGrowth')}
                        className="font-medium text-blue-600  hover:underline"
                      >
                        {expGrowthRate.toFixed(1)}%
                      </button>
                    )}
                  </td>
                  {proFormaCalc.years.map((yr) => (
                    <td
                      key={yr}
                      className={`py-2 px-3 text-right text-klic-muted  border-r border-zinc-100  ${
                        focusedYear === yr
                          ? 'bg-blue-50/55 '
                          : ''
                      }`}
                    >
                      {yr === 1 ? '0.0%' : `${expGrowthRate.toFixed(1)}%`}
                    </td>
                  ))}
                  <td className="py-2 px-1 text-center text-klic-muted">
                    <MoreVertical className="w-3.5 h-3.5 inline" />
                  </td>
                </tr>

                {/* 자산 가치 상승률 */}
                <tr className="hover:bg-zinc-50/60 ">
                  <td className="border-r border-zinc-200/60 " />
                  <td className="py-2 px-3 pl-5 text-zinc-800 ">
                    인프라 잔존가치 상승률
                  </td>
                  <td className="py-2 px-3 text-klic-muted">연간</td>
                  <td className="py-2 px-3 text-right border-r border-zinc-200/70 ">
                    {editingBlueCell === 'appreciation' ? (
                      <input
                        type="number"
                        step="0.1"
                        autoFocus
                        value={appreciationRate}
                        onChange={(e) =>
                          setAppreciationRate(Number(e.target.value) || 0)
                        }
                        onBlur={() => setEditingBlueCell(null)}
                        className="w-14 text-right font-medium text-blue-600 bg-transparent border-none outline-none ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditingBlueCell('appreciation')}
                        className="font-medium text-blue-600  hover:underline"
                      >
                        {appreciationRate.toFixed(1)}%
                      </button>
                    )}
                  </td>
                  {proFormaCalc.years.map((yr) => (
                    <td
                      key={yr}
                      className={`py-2 px-3 text-right text-klic-muted  border-r border-zinc-100  ${
                        focusedYear === yr
                          ? 'bg-blue-50/55 '
                          : ''
                      }`}
                    >
                      {appreciationRate.toFixed(1)}%
                    </td>
                  ))}
                  <td className="py-2 px-1 text-center text-klic-muted">
                    <MoreVertical className="w-3.5 h-3.5 inline" />
                  </td>
                </tr>
              </>
            )}

            {/* 2. 매출 총수익 (REVENUES Gross Income - 에메랄드 하이라이트 행) */}
            <tr className="bg-blue-50/75  text-blue-900  font-bold">
              <td className="py-2 px-2 text-center border-r border-blue-200/60 ">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSections((p) => ({
                      ...p,
                      revenues: !p.revenues,
                    }))
                  }
                >
                  {expandedSections.revenues ? (
                    <ChevronDown className="w-3.5 h-3.5 inline" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 inline" />
                  )}
                </button>
              </td>
              <td className="py-2 px-3">
                <span>매출</span>{' '}
                <span className="font-normal text-blue-700/80  ml-1">
                  총수익
                </span>
                <Plus className="w-3.5 h-3.5 inline ml-1.5 opacity-70" />
              </td>
              <td className="py-2 px-3" />
              <td className="py-2 px-3 text-right border-r border-blue-200/60 ">
                {editingBlueCell === 'baseRev' ? (
                  <input
                    type="number"
                    autoFocus
                    value={baseMonthlyRevenue}
                    onChange={(e) =>
                      setBaseMonthlyRevenue(Number(e.target.value) || 0)
                    }
                    onBlur={() => setEditingBlueCell(null)}
                    className="w-16 text-right font-bold text-blue-600 bg-transparent border-none outline-none ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditingBlueCell('baseRev')}
                    title="클릭하여 기준 월 매출 수정"
                    className="hover:underline"
                  >
                    {baseMonthlyRevenue.toLocaleString()}
                  </button>
                )}
              </td>
              {proFormaCalc.yearRevenues.map((val, idx) => (
                <td
                  key={idx}
                  className="py-2 px-3 text-right border-r border-blue-200/40 "
                >
                  {val.toLocaleString()}
                </td>
              ))}
              <td className="py-2 px-1 text-center opacity-60">
                <MoreVertical className="w-3.5 h-3.5 inline" />
              </td>
            </tr>

            {/* 3. 비용 총지출 (EXPENSES Total Expenses - 앰버 하이라이트 행) */}
            <tr className="bg-amber-50/80  text-amber-900  font-bold">
              <td className="py-2 px-2 text-center border-r border-amber-200/60 ">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSections((p) => ({
                      ...p,
                      expenses: !p.expenses,
                    }))
                  }
                >
                  {expandedSections.expenses ? (
                    <ChevronDown className="w-3.5 h-3.5 inline" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 inline" />
                  )}
                </button>
              </td>
              <td className="py-2 px-3">
                <span>비용</span>{' '}
                <span className="font-normal text-amber-800/80  ml-1">
                  총지출
                </span>
                <Plus className="w-3.5 h-3.5 inline ml-1.5 opacity-70" />
              </td>
              <td className="py-2 px-3" />
              <td className="py-2 px-3 text-right border-r border-amber-200/60 ">
                {proFormaCalc.monthlyTotalExpenses.toLocaleString()}
              </td>
              {proFormaCalc.totalExpensesByYear.map((val, idx) => (
                <td
                  key={idx}
                  className="py-2 px-3 text-right border-r border-amber-200/40 "
                >
                  {val.toLocaleString()}
                </td>
              ))}
              <td className="py-2 px-1 text-center opacity-60">
                <MoreVertical className="w-3.5 h-3.5 inline" />
              </td>
            </tr>

            {expandedSections.expenses &&
              proFormaCalc.expenseRows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-zinc-50/60 "
                >
                  <td className="border-r border-zinc-200/60 " />
                  <td className="py-2 px-3 pl-5 text-zinc-800 ">
                    {row.label}
                  </td>
                  {/* 기준 (Basis) 컬럼: 네이티브 select 보더 박스 제거, 원본 1:1 인라인 텍스트 + 화살표 */}
                  <td
                    onClick={(e) => {
                      e.stopPropagation();
                      setProFormaDropdown(
                        proFormaDropdown === row.id ? null : row.id
                      );
                    }}
                    className="py-2 px-3 relative cursor-pointer select-none"
                  >
                    <div className="flex items-center justify-between gap-2 text-klic-muted ">
                      <span>{row.basis}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-klic-muted  shrink-0" />
                    </div>

                    {proFormaDropdown === row.id && (
                      <div className="absolute left-2 top-full mt-1 w-36 bg-white  border border-zinc-200  rounded-xl shadow-xl py-1 z-40 text-xs">
                        {(
                          [
                            '연간',
                            '유효매출 대비 %',
                            '월간',
                          ] as ProFormaExpenseItem['basis'][]
                        ).map((basisOpt) => (
                          <button
                            key={basisOpt}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpenses((prev) =>
                                prev.map((item) =>
                                  item.id === row.id
                                    ? {
                                        ...item,
                                        basis: basisOpt,
                                        unitSuffix:
                                          basisOpt === '연간'
                                            ? '/년'
                                            : basisOpt === '유효매출 대비 %'
                                            ? '%'
                                            : '',
                                      }
                                    : item
                                )
                              );
                              setProFormaDropdown(null);
                            }}
                            className="w-full px-3 py-1.5 text-left hover:bg-zinc-100  text-zinc-800  flex items-center justify-between"
                          >
                            <span>{basisOpt}</span>
                            {row.basis === basisOpt && (
                              <Check className="w-3.5 h-3.5 text-blue-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-3 text-right border-r border-zinc-200/70 ">
                    {editingBlueCell === row.id ? (
                      <input
                        type="number"
                        step="0.1"
                        autoFocus
                        value={row.inputValue}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          setExpenses((prev) =>
                            prev.map((item) =>
                              item.id === row.id
                                ? { ...item, inputValue: val }
                                : item
                            )
                          );
                        }}
                        onBlur={() => setEditingBlueCell(null)}
                        className="w-16 text-right font-medium text-blue-600 bg-transparent border-none outline-none ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditingBlueCell(row.id)}
                        className="font-medium text-blue-600  hover:underline"
                      >
                        {row.inputValue.toLocaleString()}
                        {row.unitSuffix && (
                          <span className="text-klic-muted font-normal ml-0.5">
                            {row.unitSuffix}
                          </span>
                        )}
                      </button>
                    )}
                  </td>
                  {row.yearlyValues.map((val, yrIdx) => (
                    <td
                      key={yrIdx}
                      className={`py-2 px-3 text-right text-zinc-800  border-r border-zinc-100  ${
                        focusedYear === yrIdx + 1
                          ? 'bg-blue-50/55 '
                          : ''
                      }`}
                    >
                      {val.toLocaleString()}
                    </td>
                  ))}
                  <td className="py-2 px-1 text-center text-klic-muted">
                    <MoreVertical className="w-3.5 h-3.5 inline" />
                  </td>
                </tr>
              ))}

            {/* 4. 순영업이익 (NOI - 스카이 블루 하이라이트 행) */}
            <tr className="bg-blue-50/90  text-blue-900  font-bold">
              <td className="py-2 px-2 border-r border-blue-200/60 " />
              <td className="py-2 px-3">순영업이익 (NOI)</td>
              <td className="py-2 px-3" />
              <td className="py-2 px-3 text-right border-r border-blue-200/60 ">
                {proFormaCalc.monthlyNoi.toLocaleString()}
              </td>
              {proFormaCalc.noiByYear.map((val, idx) => (
                <td
                  key={idx}
                  className="py-2 px-3 text-right border-r border-blue-200/40 "
                >
                  {val.toLocaleString()}
                </td>
              ))}
              <td className="py-2 px-1 text-center opacity-60">
                <MoreVertical className="w-3.5 h-3.5 inline" />
              </td>
            </tr>

            {/* 5. 현금흐름 (CASH FLOW - 오렌지 틴트 행) */}
            <tr className="bg-amber-50/80  text-amber-900  font-bold">
              <td className="py-2 px-2 text-center border-r border-amber-200/60 ">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSections((p) => ({
                      ...p,
                      cashflow: !p.cashflow,
                    }))
                  }
                >
                  {expandedSections.cashflow ? (
                    <ChevronDown className="w-3.5 h-3.5 inline" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 inline" />
                  )}
                </button>
              </td>
              <td className="py-2 px-3">
                <span>현금흐름</span>{' '}
                <span className="font-normal text-amber-800/80  ml-1">
                  순현금흐름
                </span>
                <Plus className="w-3.5 h-3.5 inline ml-1.5 opacity-70" />
              </td>
              <td className="py-2 px-3" />
              <td className="py-2 px-3 text-right border-r border-amber-200/60 ">
                {proFormaCalc.monthlyNetCashFlow.toLocaleString()}
              </td>
              {proFormaCalc.netCashFlowByYear.map((val, idx) => (
                <td
                  key={idx}
                  className="py-2 px-3 text-right border-r border-amber-200/40 "
                >
                  {val.toLocaleString()}
                </td>
              ))}
              <td className="py-2 px-1 text-center opacity-60">
                <MoreVertical className="w-3.5 h-3.5 inline" />
              </td>
            </tr>

            {expandedSections.cashflow && (
              <>
                <tr>
                  <td className="border-r border-zinc-200/60 " />
                  <td className="py-2 px-3 pl-5 text-zinc-800 ">
                    가용 영업 현금
                  </td>
                  <td className="py-2 px-3" />
                  <td className="py-2 px-3 text-right border-r border-zinc-200/70 ">
                    {proFormaCalc.monthlyNoi.toLocaleString()}
                  </td>
                  {proFormaCalc.noiByYear.map((val, idx) => (
                    <td
                      key={idx}
                      className={`py-2 px-3 text-right border-r border-zinc-100  ${
                        focusedYear === idx + 1
                          ? 'bg-blue-50/55 '
                          : ''
                      }`}
                    >
                      {val.toLocaleString()}
                    </td>
                  ))}
                  <td className="py-2 px-1 text-center text-klic-muted">
                    <MoreVertical className="w-3.5 h-3.5 inline" />
                  </td>
                </tr>

                <tr>
                  <td className="border-r border-zinc-200/60 " />
                  <td className="py-2 px-3 pl-5 text-zinc-800 ">
                    원리금 상환액
                  </td>
                  <td
                    onClick={(e) => {
                      e.stopPropagation();
                      setProFormaDropdown(
                        proFormaDropdown === 'debt-term' ? null : 'debt-term'
                      );
                    }}
                    className="py-2 px-3 relative cursor-pointer select-none"
                  >
                    <div className="flex items-center justify-between gap-2 text-klic-muted ">
                      <span>{loanTermYears}년 상환</span>
                      <ChevronDown className="w-3.5 h-3.5 text-klic-muted  shrink-0" />
                    </div>

                    {proFormaDropdown === 'debt-term' && (
                      <div className="absolute left-2 top-full mt-1 w-32 bg-white  border border-zinc-200  rounded-xl shadow-xl py-1 z-40 text-xs">
                        {[10, 15, 20, 25, 30].map((termOpt) => (
                          <button
                            key={termOpt}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLoanTermYears(termOpt);
                              setProFormaDropdown(null);
                            }}
                            className="w-full px-3 py-1.5 text-left hover:bg-zinc-100  text-zinc-800  flex items-center justify-between"
                          >
                            <span>{termOpt}년 상환</span>
                            {loanTermYears === termOpt && (
                              <Check className="w-3.5 h-3.5 text-blue-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-3 text-right border-r border-zinc-200/70 ">
                    ({proFormaCalc.monthlyPayment.toLocaleString()})
                  </td>
                  {proFormaCalc.years.map((yr) => (
                    <td
                      key={yr}
                      className={`py-2 px-3 text-right text-zinc-700  border-r border-zinc-100  ${
                        focusedYear === yr
                          ? 'bg-blue-50/55 '
                          : ''
                      }`}
                    >
                      ({proFormaCalc.annualDebtService.toLocaleString()})
                    </td>
                  ))}
                  <td className="py-2 px-1 text-center text-klic-muted">
                    <MoreVertical className="w-3.5 h-3.5 inline" />
                  </td>
                </tr>

                <tr>
                  <td className="border-r border-zinc-200/60 " />
                  <td className="py-2 px-3 pl-5 text-zinc-800 ">
                    현금 배당 수익률
                  </td>
                  <td className="py-2 px-3 text-klic-muted">투입 현금 대비</td>
                  <td className="py-2 px-3 text-right border-r border-zinc-200/70 " />
                  {proFormaCalc.cashRoiByYear.map((val, idx) => (
                    <td
                      key={idx}
                      className={`py-2 px-3 text-right font-medium border-r border-zinc-100  ${
                        focusedYear === idx + 1
                          ? 'bg-blue-50/55 '
                          : ''
                      }`}
                    >
                      {val.toFixed(1)}%
                    </td>
                  ))}
                  <td className="py-2 px-1 text-center text-klic-muted">
                    <MoreVertical className="w-3.5 h-3.5 inline" />
                  </td>
                </tr>
              </>
            )}

            {/* 6. 수익률 분석 (RETURNS Total Return - 보라색 하이라이트 행) */}
            <tr className="bg-blue-50/85  text-blue-900  font-bold">
              <td className="py-2 px-2 text-center border-r border-blue-200/60 ">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSections((p) => ({
                      ...p,
                      returns: !p.returns,
                    }))
                  }
                >
                  {expandedSections.returns ? (
                    <ChevronDown className="w-3.5 h-3.5 inline" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 inline" />
                  )}
                </button>
              </td>
              <td className="py-2 px-3">
                <span>수익률 분석</span>{' '}
                <span className="font-normal text-blue-700/80  ml-1">
                  총수익 합계
                </span>
                <Plus className="w-3.5 h-3.5 inline ml-1.5 opacity-70" />
              </td>
              <td className="py-2 px-3" />
              <td className="py-2 px-3 border-r border-blue-200/60 " />
              {proFormaCalc.totalReturnByYear.map((val, idx) => (
                <td
                  key={idx}
                  className="py-2 px-3 text-right border-r border-blue-200/40 "
                >
                  {val.toLocaleString()}
                </td>
              ))}
              <td className="py-2 px-1 text-center opacity-60">
                <MoreVertical className="w-3.5 h-3.5 inline" />
              </td>
            </tr>

            {expandedSections.returns && (
              <>
                <tr>
                  <td className="border-r border-zinc-200/60 " />
                  <td className="py-2 px-3 pl-5 text-zinc-800 ">
                    순현금흐름
                  </td>
                  <td className="py-2 px-3" />
                  <td className="py-2 px-3 border-r border-zinc-200/70 " />
                  {proFormaCalc.netCashFlowByYear.map((val, idx) => (
                    <td
                      key={idx}
                      className={`py-2 px-3 text-right border-r border-zinc-100  ${
                        focusedYear === idx + 1
                          ? 'bg-blue-50/55 '
                          : ''
                      }`}
                    >
                      {val.toLocaleString()}
                    </td>
                  ))}
                  <td className="py-2 px-1 text-center text-klic-muted">
                    <MoreVertical className="w-3.5 h-3.5 inline" />
                  </td>
                </tr>

                <tr>
                  <td className="border-r border-zinc-200/60 " />
                  <td className="py-2 px-3 pl-5 text-zinc-800 ">
                    자본 지분 누적액
                  </td>
                  <td className="py-2 px-3" />
                  <td className="py-2 px-3 border-r border-zinc-200/70 " />
                  {proFormaCalc.equityAccruedByYear.map((val, idx) => (
                    <td
                      key={idx}
                      className={`py-2 px-3 text-right border-r border-zinc-100  ${
                        focusedYear === idx + 1
                          ? 'bg-blue-50/55 '
                          : ''
                      }`}
                    >
                      {val.toLocaleString()}
                    </td>
                  ))}
                  <td className="py-2 px-1 text-center text-klic-muted">
                    <MoreVertical className="w-3.5 h-3.5 inline" />
                  </td>
                </tr>
              </>
            )}

            {/* 7. 최종 총 투자수익률 (TOTAL ROI) */}
            <tr className="bg-zinc-50/70  font-bold text-zinc-900  border-t border-zinc-200 ">
              <td className="py-2.5 px-2 border-r border-zinc-200/60 " />
              <td className="py-2.5 px-3">
                <span>총 투자수익률</span>{' '}
                <span className="font-normal text-klic-muted ml-1">
                  투입 현금 대비
                </span>
              </td>
              <td className="py-2.5 px-3" />
              <td className="py-2.5 px-3 border-r border-zinc-200/70 " />
              {proFormaCalc.totalRoiByYear.map((val, idx) => (
                <td
                  key={idx}
                  className={`py-2.5 px-3 text-right border-r border-zinc-100  ${
                    focusedYear === idx + 1
                      ? 'bg-blue-50/90  text-zinc-900 '
                      : ''
                  }`}
                >
                  {val.toFixed(1)}%
                </td>
              ))}
              <td className="py-2.5 px-1 text-center text-klic-muted">
                <MoreVertical className="w-3.5 h-3.5 inline" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 하단 안내 캡션 바 (Image 1 하단 구현) */}
      <div className="px-6 py-3 bg-white  border-t border-zinc-200/80  flex flex-wrap items-center justify-between gap-2 text-xs text-klic-muted">
        <div>
          <span className="font-medium text-blue-600  underline underline-offset-2">
            파란색 수치
          </span>
          는 직접 편집 가능한 입력값입니다. 셀을 클릭해 값을 수정하면 10개년 수식이 즉시 재계산됩니다.
        </div>
        <div>상단 연도 열을 클릭하면 해당 연도가 집중 조명됩니다.</div>
      </div>
    </section>
  );

  /* ========================================================================
   * RENDER 2: 스마트 발주 & 공급망 셀 에디터 그리드 (Reference Image 2)
   * ======================================================================== */
  const renderStyle2ReorderSheet = () => {
    const holdCount = reorderRows.filter((r) => r.status === '보류 중').length;
    const totalApprovedAmount = reorderRows
      .filter((r) => r.status === '재고 충분' || r.status === '발주 완료')
      .reduce((acc, r) => acc + r.reorderQty * r.unitPrice, 0);

    return (
      <section className="rounded-[26px] bg-white  border border-zinc-200/90  shadow-[0_14px_40px_color-mix(in_srgb,var(--klic-component-block-color-text)_5%,transparent)] p-6 space-y-4">
        {/* 상단 헤더 (보더라인 없이 테이블 프레임과 자연스러운 여백으로 분리) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 ">
                인프라 자재 재발주 계획 시트
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-blue-600 text-klic-on-emphasis text-[11px] font-mono font-semibold">
                KLIC/edit-2
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-blue-600 ">
                재발주 기준점 미달 69건
              </span>
              <span className="text-klic-muted ">·</span>
              <span className="text-klic-muted">
                검토 대기 {31 + holdCount}건
              </span>
              <span className="text-klic-muted ">·</span>
              <span className="text-zinc-700  font-medium">
                발주 승인 금액{' '}
                <strong className="text-zinc-900 ">
                  ₩{(totalApprovedAmount / 10000).toLocaleString()}만
                </strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetReorder}
            className="px-3 py-1.5 text-xs font-medium text-klic-muted  hover:bg-zinc-100  rounded-lg border border-zinc-200  flex items-center gap-1.5 shadow-2xs self-start sm:self-auto transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>뷰 초기화</span>
          </button>
        </div>

        {/* 일체형 스프레드시트 컨테이너 (단일 테두리로 툴바와 테이블을 감싸 불필요한 이중 보더라인 제거) */}
        <div className="rounded-xl border border-zinc-200  overflow-hidden bg-white  shadow-xs">
          {/* 툴바 영역: 검색창 + 285개 행 + 실행 취소/다시 실행 + 필터 드롭다운 + 컬럼 7 + 설정 */}
          <div className="px-4 py-2.5 bg-white  border-b border-zinc-200  flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-[260px]">
              <div className="relative w-full max-w-xs">
                <Search className="w-3.5 h-3.5 text-klic-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={reorderSearch}
                  onChange={(e) => setReorderSearch(e.target.value)}
                  placeholder="품목 코드, 품목명 또는 구매 담당자 검색"
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-50/50  border border-zinc-200/90  text-xs text-zinc-800  outline-none focus:border-blue-400"
                />
              </div>
              <span className="text-xs text-klic-muted shrink-0 tabular-nums">
                285줄 <span className="text-klic-muted">({filteredReorderRows.length}개 표시)</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* 실행 취소 / 다시 실행 */}
              <button
                type="button"
                onClick={handleUndoReorder}
                disabled={historyPast.length === 0}
                title="실행 취소"
                className="p-1.5 rounded-lg text-klic-muted hover:text-zinc-800  hover:bg-zinc-100  disabled:opacity-35 transition-colors"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRedoReorder}
                disabled={historyFuture.length === 0}
                title="다시 실행"
                className="p-1.5 rounded-lg text-klic-muted hover:text-zinc-800  hover:bg-zinc-100  disabled:opacity-35 transition-colors"
              >
                <Redo2 className="w-4 h-4" />
              </button>

              {/* 필터 팝오버 메뉴 드롭다운 */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFilterMenuOpen((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    statusFilter !== '전체' || warehouseFilter !== '전체' || buyerFilter !== '전체'
                      ? 'bg-blue-50  border-blue-300  text-blue-700 '
                      : 'bg-white  border-zinc-200  text-zinc-700  hover:bg-zinc-50'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>필터</span>
                  {(statusFilter !== '전체' || warehouseFilter !== '전체' || buyerFilter !== '전체') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}
                  <ChevronDown className={`w-3 h-3 text-klic-muted transition-transform ${isFilterMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFilterMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-64 bg-white  border border-zinc-200  rounded-xl shadow-lg p-3 z-30 text-xs space-y-3">
                    <div className="flex items-center justify-between font-bold text-zinc-800  pb-1.5 border-b border-zinc-100 ">
                      <span>필터 조건 설정</span>
                      {(statusFilter !== '전체' || warehouseFilter !== '전체' || buyerFilter !== '전체') && (
                        <button
                          type="button"
                          onClick={() => {
                            setStatusFilter('전체');
                            setWarehouseFilter('전체');
                            setBuyerFilter('전체');
                          }}
                          className="text-[11px] text-blue-600  hover:underline"
                        >
                          초기화
                        </button>
                      )}
                    </div>

                    {/* 발주 상태 필터 */}
                    <div>
                      <div className="text-[11px] font-semibold text-klic-muted uppercase tracking-wider mb-1">
                        발주 상태
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {['전체', '보류 중', '발주 완료', '긴급 보충', '재고 충분'].map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setStatusFilter(st)}
                            className={`px-2 py-1 rounded-md text-[11px] font-medium transition ${
                              statusFilter === st
                                ? 'bg-blue-600 text-klic-on-emphasis font-bold'
                                : 'bg-zinc-100  text-klic-muted  hover:bg-zinc-200 '
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 물류 거점 필터 (네이티브 select 대신 버튼 칩) */}
                    <div>
                      <div className="text-[11px] font-semibold text-klic-muted uppercase tracking-wider mb-1">
                        물류 거점
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {[
                          '전체',
                          '판교 제1센터',
                          '김포 물류거점',
                          '부산 에코센터',
                          '세종 데이터센터',
                          '인천 글로벌허브',
                        ].map((wh) => (
                          <button
                            key={wh}
                            type="button"
                            onClick={() => setWarehouseFilter(wh)}
                            className={`px-2 py-1 rounded-md text-[11px] font-medium transition ${
                              warehouseFilter === wh
                                ? 'bg-blue-600 text-klic-on-emphasis font-bold'
                                : 'bg-zinc-100  text-klic-muted  hover:bg-zinc-200 '
                            }`}
                          >
                            {wh}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 구매 담당자 필터 (네이티브 select 대신 버튼 칩) */}
                    <div>
                      <div className="text-[11px] font-semibold text-klic-muted uppercase tracking-wider mb-1">
                        구매 담당자
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {['전체', '강태우', '김서연', '박지민', '최수아'].map((buyer) => (
                          <button
                            key={buyer}
                            type="button"
                            onClick={() => setBuyerFilter(buyer)}
                            className={`px-2 py-1 rounded-md text-[11px] font-medium transition ${
                              buyerFilter === buyer
                                ? 'bg-blue-600 text-klic-on-emphasis font-bold'
                                : 'bg-zinc-100  text-klic-muted  hover:bg-zinc-200 '
                            }`}
                          >
                            {buyer}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 컬럼 7 */}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white  border border-zinc-200  text-xs font-semibold text-zinc-700  hover:bg-zinc-50"
              >
                <Columns3 className="w-3.5 h-3.5 text-klic-muted" />
                컬럼 <span className="text-klic-muted font-normal ml-0.5">7</span>
              </button>

              {/* 설정 */}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white  border border-zinc-200  text-xs font-semibold text-zinc-700  hover:bg-zinc-50"
              >
                <Settings2 className="w-3.5 h-3.5 text-klic-muted" />
                설정
              </button>

              {/* 다운로드 */}
              <button
                type="button"
                title="시트 데이터 내보내기"
                className="p-1.5 rounded-lg bg-white  border border-zinc-200  text-zinc-700  hover:bg-zinc-50"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

        {/* 스프레드시트 스타일 그리드 (컬럼 알파벳 배지 A, B, C, D, E, F) */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50/80  border-b border-zinc-200  text-klic-muted ">
                <th className="w-10 py-2.5 px-3 border-r border-zinc-200/80  text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.length === filteredReorderRows.length &&
                      filteredReorderRows.length > 0
                    }
                    onChange={(e) =>
                      setSelectedRows(
                        e.target.checked
                          ? filteredReorderRows.map((r) => r.id)
                          : []
                      )
                    }
                    className="rounded border-zinc-300"
                  />
                </th>
                <th className="w-11 py-2.5 px-2 border-r border-zinc-200/80  text-center text-klic-muted font-normal">
                  #
                </th>
                {[
                  { label: '품목 코드', code: 'A', width: 'min-w-[150px]' },
                  { label: '품목명 및 규격', code: 'B', width: 'min-w-[240px]' },
                  { label: '구매 담당자', code: 'C', width: 'min-w-[165px]' },
                  { label: '물류 거점', code: 'D', width: 'min-w-[140px]' },
                  { label: '발주 상태', code: 'E', width: 'min-w-[130px]' },
                  { label: '발주 수량', code: 'F', width: 'min-w-[110px]' },
                ].map((col) => (
                  <th
                    key={col.code}
                    className={`text-left py-2.5 px-3.5 border-r border-zinc-200/80  font-semibold ${col.width}`}
                  >
                    <div className="inline-flex items-center gap-1.5">
                      <span>{col.label}</span>
                      <span className="px-1.5 py-0.2 rounded bg-zinc-200/80  text-[10px] font-mono text-klic-muted ">
                        {col.code}
                      </span>
                      <ArrowUpDown className="w-3 h-3 text-klic-muted" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200/75 ">
              {filteredReorderRows.map((row) => {
                const isRowSelected = selectedRows.includes(row.id);
                return (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      isRowSelected
                        ? 'bg-blue-50/35 '
                        : 'hover:bg-zinc-50/70 '
                    }`}
                  >
                    {/* 체크박스 */}
                    <td className="py-2.5 px-3 border-r border-zinc-200/75  text-center">
                      <input
                        type="checkbox"
                        checked={isRowSelected}
                        onChange={(e) =>
                          setSelectedRows((prev) =>
                            e.target.checked
                              ? [...prev, row.id]
                              : prev.filter((id) => id !== row.id)
                          )
                        }
                        className="rounded border-zinc-300"
                      />
                    </td>

                    {/* 행 번호 */}
                    <td className="py-2.5 px-2 border-r border-zinc-200/75  text-center text-klic-muted font-mono">
                      {row.rowNum}
                    </td>

                    {/* A: 품목 코드 (SKU) */}
                    <td
                      onClick={() =>
                        setActiveCell({
                          rowId: row.id,
                          colKey: 'sku',
                          coord: `A${row.rowNum}`,
                        })
                      }
                      className="py-2.5 px-3.5 border-r border-zinc-200/75  font-mono font-bold text-zinc-900  cursor-pointer"
                    >
                      {row.sku}
                    </td>

                    {/* B: 품목명 인라인 입력 */}
                    <td
                      onClick={() =>
                        setActiveCell({
                          rowId: row.id,
                          colKey: 'itemName',
                          coord: `B${row.rowNum}`,
                        })
                      }
                      className="py-2 px-3.5 border-r border-zinc-200/75  cursor-pointer"
                    >
                      <input
                        type="text"
                        value={row.itemName}
                        onChange={(e) =>
                          updateReorderRowWithHistory(row.id, {
                            itemName: e.target.value,
                          })
                        }
                        className="w-full bg-transparent text-zinc-800  border-none outline-none ring-0 focus:ring-0 focus:outline-none p-0"
                      />
                    </td>

                    {/* C: 구매 담당자 (원본 1:1 보더라인 없는 아바타 + 이름 + 드롭다운 화살표) */}
                    <td
                      onClick={() =>
                        setActiveCell({
                          rowId: row.id,
                          colKey: 'buyerName',
                          coord: `C${row.rowNum}`,
                        })
                      }
                      className="py-2.5 px-3.5 border-r border-zinc-200/75  cursor-pointer relative"
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setCellDropdown(
                            cellDropdown?.rowId === row.id && cellDropdown?.type === 'buyer'
                              ? null
                              : { rowId: row.id, type: 'buyer' }
                          );
                        }}
                        className="flex items-center gap-2 select-none"
                      >
                        <PersonAvatar
                          src={row.buyerAvatar}
                          alt={row.buyerName}
                          className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-zinc-200/60 "
                        />
                        <div className="inline-flex items-center gap-1">
                          <span className="font-medium text-zinc-900  text-xs">
                            {row.buyerName}
                          </span>
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-700  stroke-[2.2]" />
                        </div>
                      </div>

                      {cellDropdown?.rowId === row.id && cellDropdown?.type === 'buyer' && (
                        <div className="absolute left-3 top-full mt-1 w-36 bg-white  border border-zinc-200  rounded-xl shadow-xl py-1 z-50 text-xs">
                          {BUYER_PROFILES.map((b) => (
                            <button
                              key={b.name}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateReorderRowWithHistory(row.id, {
                                  buyerName: b.name,
                                  buyerAvatar: b.avatar,
                                });
                                setCellDropdown(null);
                              }}
                              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-zinc-100  text-left transition-colors"
                            >
                              <PersonAvatar src={b.avatar} alt={b.name} className="w-4 h-4 rounded-full object-cover" />
                              <span className="font-medium text-zinc-900 ">{b.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* D: 물류 거점 (원본 1:1 보더라인 없는 거점명 + 드롭다운 화살표) */}
                    <td
                      onClick={() =>
                        setActiveCell({
                          rowId: row.id,
                          colKey: 'warehouse',
                          coord: `D${row.rowNum}`,
                        })
                      }
                      className="py-2.5 px-3.5 border-r border-zinc-200/75  cursor-pointer relative"
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setCellDropdown(
                            cellDropdown?.rowId === row.id && cellDropdown?.type === 'warehouse'
                              ? null
                              : { rowId: row.id, type: 'warehouse' }
                          );
                        }}
                        className="flex items-center justify-between pr-2 select-none"
                      >
                        <span className="text-zinc-800  text-xs font-normal">
                          {row.warehouse}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-700  stroke-[2.2]" />
                      </div>

                      {cellDropdown?.rowId === row.id && cellDropdown?.type === 'warehouse' && (
                        <div className="absolute left-3 top-full mt-1 w-40 bg-white  border border-zinc-200  rounded-xl shadow-xl py-1 z-50 text-xs">
                          {[
                            '판교 제1센터',
                            '김포 물류거점',
                            '부산 에코센터',
                            '세종 데이터센터',
                            '인천 글로벌허브',
                          ].map((wh) => (
                            <button
                              key={wh}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateReorderRowWithHistory(row.id, { warehouse: wh });
                                setCellDropdown(null);
                              }}
                              className="w-full px-3 py-1.5 text-left hover:bg-zinc-100  text-zinc-800  transition-colors"
                            >
                              {wh}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* E: 발주 상태 캡슐 (클릭 시 상태 순환 전환) */}
                    <td
                      onClick={() => {
                        setActiveCell({
                          rowId: row.id,
                          colKey: 'status',
                          coord: `E${row.rowNum}`,
                        });
                        const order: ReorderStatus[] = [
                          '재고 충분',
                          '보류 중',
                          '발주 완료',
                          '긴급 보충',
                        ];
                        const next =
                          order[(order.indexOf(row.status) + 1) % order.length];
                        updateReorderRowWithHistory(row.id, { status: next });
                      }}
                      title="클릭하여 발주 상태 변경"
                      className="py-2 px-3.5 border-r border-zinc-200/75  cursor-pointer select-none"
                    >
                      {row.status === '재고 충분' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white  border border-zinc-200  text-zinc-800  font-semibold shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                          재고 충분
                        </span>
                      )}
                      {row.status === '보류 중' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50  border border-blue-200  text-blue-700  font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          보류 중
                        </span>
                      )}
                      {row.status === '발주 완료' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50  border border-blue-200  text-blue-700  font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          발주 완료
                        </span>
                      )}
                      {row.status === '긴급 보충' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50  border border-amber-200  text-amber-800  font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          긴급 보충
                        </span>
                      )}
                    </td>

                    {/* F: 발주 수량 인라인 숫자 편집 */}
                    <td
                      onClick={() =>
                        setActiveCell({
                          rowId: row.id,
                          colKey: 'reorderQty',
                          coord: `F${row.rowNum}`,
                        })
                      }
                      className="py-2 px-3.5 border-r border-zinc-200/75  cursor-pointer"
                    >
                      <input
                        type="number"
                        value={row.reorderQty}
                        onChange={(e) =>
                          updateReorderRowWithHistory(row.id, {
                            reorderQty: Math.max(0, Number(e.target.value) || 0),
                          })
                        }
                        className="w-20 bg-transparent font-mono font-semibold text-zinc-900  border-none outline-none ring-0 focus:ring-0 focus:outline-none p-0"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 하단 셀 인스펙터 바 (Image 2의 "285 lines / Select a cell to inspect it" 구현) */}
        <div className="px-6 py-3 bg-zinc-50/90  border-t border-zinc-200  flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-blue-600 text-klic-on-emphasis font-mono font-bold">
              셀 {activeCell.coord}
            </span>
            <span className="font-semibold text-zinc-800 ">
              {inspectedRow.sku} · {inspectedRow.itemName}
            </span>
            <span className="text-klic-muted">|</span>
            <span className="text-klic-muted">
              현재고 {inspectedRow.onHand}개 · 예상 발주액 ₩
              {(
                inspectedRow.reorderQty * inspectedRow.unitPrice
              ).toLocaleString()}
            </span>
          </div>
          <div className="text-klic-muted">
            셀을 클릭하여 직접 값을 편집하거나 상태를 전환하세요
          </div>
        </div>
        </div>
      </section>
    );
  };

  /* ========================================================================
   * RENDER 3: 마스터-디테일 스플릿 인스펙터 편집기 (KLIC/edit-3)
   * ======================================================================== */
  const renderStyle3SplitDrawer = () => (
    <section className="rounded-[26px] bg-zinc-100/85  border border-zinc-200/80  p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-blue-700 text-klic-on-emphasis text-[11px] font-mono font-semibold">
            KLIC/edit-3
          </span>
          <h3 className="text-base font-bold text-zinc-900 ">
            마스터-디테일 스플릿 인스펙터 & 다중 태그 편집기
          </h3>
        </div>
        <span className="text-xs text-klic-muted">
          좌측 그리드 행 선택 시 우측 전용 인스펙터 폼과 실시간 동기화됩니다
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 좌측 마스터 테이블 (7열) */}
        <div className="lg:col-span-7 rounded-2xl bg-white  border border-zinc-200/90  overflow-hidden shadow-2xs">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50  border-b border-zinc-200  text-klic-muted">
                <th className="text-left py-3 px-4 font-semibold">고객사</th>
                <th className="text-left py-3 px-3 font-semibold">담당 리드</th>
                <th className="text-right py-3 px-3 font-semibold">시트 수</th>
                <th className="text-right py-3 px-4 font-semibold">월 약정액</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/70 ">
              {splitRecords.map((rec) => {
                const active = rec.id === selectedSplitId;
                return (
                  <tr
                    key={rec.id}
                    onClick={() => setSelectedSplitId(rec.id)}
                    className={`cursor-pointer transition-colors ${
                      active
                        ? 'bg-blue-50/60  font-semibold'
                        : 'hover:bg-zinc-50 '
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="text-zinc-900  font-bold">
                        {rec.company}
                      </div>
                      <div className="text-[11px] text-klic-muted mt-0.5">
                        {rec.id} · {rec.tier}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <PersonAvatar
                          src={rec.avatar}
                          alt={rec.owner}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>{rec.owner}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono">
                      {rec.seats}석
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-zinc-900 ">
                      ₩{rec.mrr.toLocaleString()}만
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 우측 실시간 동기화 인스펙터 폼 (5열) */}
        <div className="lg:col-span-5 rounded-2xl bg-white  border border-zinc-200/90  p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 ">
            <div className="flex items-center gap-2.5">
              <PersonAvatar
                src={activeSplitItem.avatar}
                alt={activeSplitItem.owner}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <div className="text-sm font-bold text-zinc-900 ">
                  {activeSplitItem.company}
                </div>
                <div className="text-[11px] text-blue-600 font-semibold">
                  ● 실시간 낙관적 저장 활성화됨
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-zinc-100  text-[11px] font-mono text-klic-muted">
              {activeSplitItem.id}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-klic-muted  mb-1">
                고객사 공식 명칭
              </label>
              <input
                type="text"
                value={activeSplitItem.company}
                onChange={(e) =>
                  setSplitRecords((prev) =>
                    prev.map((item) =>
                      item.id === activeSplitItem.id
                        ? { ...item, company: e.target.value }
                        : item
                    )
                  )
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-50  border border-zinc-200  font-semibold text-zinc-900  outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-klic-muted  mb-1">
                  라이선스 시트 수
                </label>
                <div className="flex items-center rounded-xl bg-zinc-50  border border-zinc-200  px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setSplitRecords((prev) =>
                        prev.map((item) =>
                          item.id === activeSplitItem.id
                            ? { ...item, seats: Math.max(10, item.seats - 10) }
                            : item
                        )
                      )
                    }
                    className="p-1 text-klic-muted hover:text-zinc-900"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="flex-1 text-center font-mono font-bold">
                    {activeSplitItem.seats}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setSplitRecords((prev) =>
                        prev.map((item) =>
                          item.id === activeSplitItem.id
                            ? { ...item, seats: item.seats + 10 }
                            : item
                        )
                      )
                    }
                    className="p-1 text-klic-muted hover:text-zinc-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-klic-muted  mb-1">
                  계약 갱신 예정일
                </label>
                <input
                  type="date"
                  value={activeSplitItem.renewalDate}
                  onChange={(e) =>
                    setSplitRecords((prev) =>
                      prev.map((item) =>
                        item.id === activeSplitItem.id
                          ? { ...item, renewalDate: e.target.value }
                          : item
                      )
                    )
                  }
                  className="w-full px-2.5 py-2 rounded-xl bg-zinc-50  border border-zinc-200  font-mono text-zinc-800  outline-none"
                />
              </div>
            </div>

            {/* 다중 태그 칩 에디터 */}
            <div>
              <label className="block font-semibold text-klic-muted  mb-1.5">
                적용된 보안 & 약정 태그
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {activeSplitItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50  text-blue-700  border border-blue-200/80  text-[11px] font-semibold"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() =>
                        setSplitRecords((prev) =>
                          prev.map((item) =>
                            item.id === activeSplitItem.id
                              ? {
                                  ...item,
                                  tags: item.tags.filter((t) => t !== tag),
                                }
                              : item
                          )
                        )
                      }
                      className="text-blue-400 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newTagText}
                  onChange={(e) => setNewTagText(e.target.value)}
                  placeholder="새 태그 입력 후 추가..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-50  border border-zinc-200  outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newTagText.trim()) return;
                    setSplitRecords((prev) =>
                      prev.map((item) =>
                        item.id === activeSplitItem.id
                          ? {
                              ...item,
                              tags: [...item.tags, newTagText.trim()],
                            }
                          : item
                      )
                    );
                    setNewTagText('');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-klic-inverse  text-klic-on-emphasis  font-semibold"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  /* ========================================================================
   * RENDER 4: 변경 전·후 비교 일괄 편집 샌드박스 (KLIC/edit-4)
   * ======================================================================== */
  const renderStyle4BatchSandbox = () => (
    <section className="rounded-[26px] bg-white  border border-zinc-200/90  p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-amber-600 text-klic-on-emphasis text-[11px] font-mono font-semibold">
              KLIC/edit-4
            </span>
            <h3 className="text-base font-bold text-zinc-900 ">
              변경 전·후(Diff) 비교 샌드박스 & 일괄 수식 편집기
            </h3>
          </div>
          <p className="text-xs text-klic-muted mt-1">
            수정된 셀을 노란색 변경 비교 배지로 하이라이트하며, 최종 반영 전까지 안전하게 시뮬레이션합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleBulkPercentAdjust(10)}
            className="px-3 py-1.5 rounded-xl bg-amber-50  border border-amber-200  text-amber-800  text-xs font-semibold hover:bg-amber-100"
          >
            전체 단가 +10% 일괄 인상
          </button>
          <button
            type="button"
            onClick={() => {
              setSandboxRows(INITIAL_SANDBOX_ITEMS);
              setSandboxCommitted(false);
            }}
            className="px-3 py-1.5 rounded-xl bg-zinc-100  text-xs font-semibold text-klic-muted "
          >
            원래대로 복원
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-200 ">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-50  border-b border-zinc-200  text-klic-muted">
              <th className="text-left py-3 px-4 font-semibold">대상 서비스</th>
              <th className="text-left py-3 px-4 font-semibold">책임 엔지니어</th>
              <th className="text-right py-3 px-4 font-semibold">
                할당 처리량 (변경 비교)
              </th>
              <th className="text-right py-3 px-4 font-semibold">
                월 약정 단가 (변경 비교)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/70 ">
            {sandboxRows.map((row) => {
              const quotaDirty = row.originQuota !== row.nextQuota;
              const priceDirty = row.originPrice !== row.nextPrice;
              return (
                <tr key={row.id}>
                  <td className="py-3.5 px-4 font-bold text-zinc-900 ">
                    {row.service}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <PersonAvatar
                        src={row.avatar}
                        alt={row.manager}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span>{row.manager}</span>
                    </div>
                  </td>
                  <td
                    className={`py-3 px-4 text-right ${
                      quotaDirty ? 'bg-amber-50/70 ' : ''
                    }`}
                  >
                    <div className="inline-flex items-center justify-end gap-2">
                      {quotaDirty && (
                        <span className="line-through text-klic-muted font-mono">
                          {row.originQuota}
                        </span>
                      )}
                      <input
                        type="number"
                        value={row.nextQuota}
                        onChange={(e) =>
                          setSandboxRows((prev) =>
                            prev.map((r) =>
                              r.id === row.id
                                ? { ...r, nextQuota: Number(e.target.value) || 0 }
                                : r
                            )
                          )
                        }
                        className="w-20 text-right font-mono font-bold text-zinc-900  bg-white  border border-zinc-200  rounded-lg px-2 py-1"
                      />
                    </div>
                  </td>
                  <td
                    className={`py-3 px-4 text-right ${
                      priceDirty ? 'bg-amber-50/70 ' : ''
                    }`}
                  >
                    <div className="inline-flex items-center justify-end gap-2">
                      {priceDirty && (
                        <span className="line-through text-klic-muted font-mono">
                          ₩{row.originPrice}만
                        </span>
                      )}
                      <input
                        type="number"
                        value={row.nextPrice}
                        onChange={(e) =>
                          setSandboxRows((prev) =>
                            prev.map((r) =>
                              r.id === row.id
                                ? { ...r, nextPrice: Number(e.target.value) || 0 }
                                : r
                            )
                          )
                        }
                        className="w-20 text-right font-mono font-bold text-amber-800  bg-white  border border-amber-300  rounded-lg px-2 py-1"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between px-4 py-3 rounded-2xl bg-klic-inverse text-klic-on-emphasis text-xs">
        <span>
          {sandboxCommitted
            ? '✓ 모든 변경사항이 프로덕션 원장에 안전하게 커밋되었습니다.'
            : '미반영 수정 셀이 존재합니다. 변경 전·후 수치를 확인 후 커밋하세요.'}
        </span>
        <button
          type="button"
          onClick={() => setSandboxCommitted(true)}
          className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-klic-on-emphasis transition-colors"
        >
          {sandboxCommitted ? '커밋 완료됨' : '변경사항 일괄 커밋'}
        </button>
      </div>
    </section>
  );

  /* ========================================================================
   * RENDER 5: 환경별 정책 & 키-밸류 매트릭스 편집기 (KLIC/edit-5)
   * ======================================================================== */
  const renderStyle5SchemaJson = () => (
    <section className="rounded-[26px] bg-white  border border-zinc-200/90  p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-blue-600 text-klic-on-emphasis text-[11px] font-mono font-semibold">
            KLIC/edit-5
          </span>
          <h3 className="text-base font-bold text-zinc-900 ">
            환경별 정책 임계값 & 키-밸류 매트릭스 편집기
          </h3>
        </div>
        <span className="text-xs text-klic-muted">
          스테이징과 운영 환경의 설정값을 나란히 비교·증감하고 스위치로 즉시 제어합니다
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-200 ">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-50  border-b border-zinc-200  text-klic-muted">
              <th className="text-left py-3 px-4 font-semibold">정책 설명</th>
              <th className="text-right py-3 px-4 font-semibold">
                스테이징 환경 값
              </th>
              <th className="text-right py-3 px-4 font-semibold">
                프로덕션 운영 값
              </th>
              <th className="text-center py-3 px-4 font-semibold">강제 적용</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/70 ">
            {policyRules.map((rule) => (
              <tr key={rule.key}>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-zinc-900 ">
                    {rule.title}
                  </div>
                  <div className="text-[11px] font-mono text-klic-muted mt-0.5">
                    {rule.key} ({rule.unit})
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <input
                    type="number"
                    value={rule.stagingVal}
                    onChange={(e) =>
                      setPolicyRules((prev) =>
                        prev.map((r) =>
                          r.key === rule.key
                            ? { ...r, stagingVal: Number(e.target.value) || 0 }
                            : r
                        )
                      )
                    }
                    className="w-24 text-right font-mono font-semibold text-zinc-800  bg-zinc-50  border border-zinc-200  rounded-lg px-2.5 py-1"
                  />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <input
                    type="number"
                    value={rule.prodVal}
                    onChange={(e) =>
                      setPolicyRules((prev) =>
                        prev.map((r) =>
                          r.key === rule.key
                            ? { ...r, prodVal: Number(e.target.value) || 0 }
                            : r
                        )
                      )
                    }
                    className="w-24 text-right font-mono font-bold text-blue-700  bg-blue-50/60  border border-blue-200  rounded-lg px-2.5 py-1"
                  />
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button
                    type="button"
                    onClick={() =>
                      setPolicyRules((prev) =>
                        prev.map((r) =>
                          r.key === rule.key
                            ? { ...r, enforced: !r.enforced }
                            : r
                        )
                      )
                    }
                    className={`w-10 h-5 rounded-full transition-colors relative inline-flex items-center px-0.5 ${
                      rule.enforced
                        ? 'bg-blue-600'
                        : 'bg-zinc-300 '
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        rule.enforced ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  return (
    <div className="space-y-6">
      {/* 상단 5종 데이터 편집 스타일 전환 탭 바 */}
      <div className="rounded-2xl bg-zinc-100/90  border border-zinc-200/80  p-2 flex flex-wrap items-center gap-1.5">
        {MODE_TABS.map((tab) => {
          const isActive = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveMode(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-white  text-zinc-900  shadow-xs border border-zinc-200/80 '
                  : 'text-klic-muted  hover:text-zinc-900 '
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 활성화된 데이터 편집 뷰 렌더링 */}
      {activeMode === 'proforma-matrix' && renderStyle1ProFormaMatrix()}
      {activeMode === 'reorder-sheet' && renderStyle2ReorderSheet()}
      {activeMode === 'split-drawer' && renderStyle3SplitDrawer()}
      {activeMode === 'batch-sandbox' && renderStyle4BatchSandbox()}
      {activeMode === 'schema-json' && renderStyle5SchemaJson()}

      {activeMode === 'all-showcase' && (
        <div className="space-y-8">
          {renderStyle1ProFormaMatrix()}
          {renderStyle2ReorderSheet()}
          {renderStyle3SplitDrawer()}
          {renderStyle4BatchSandbox()}
          {renderStyle5SchemaJson()}
        </div>
      )}
    </div>
  );
}
