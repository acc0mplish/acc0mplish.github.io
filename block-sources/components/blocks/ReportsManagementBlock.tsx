import { PersonAvatar } from '../PersonAvatar';
import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  ArrowDownToLine,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  X,
  ExternalLink,
  ChevronDown,
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  Percent,
  Volume2,
  Package,
  Briefcase,
  Calendar,
  Mail,
  Info,
  Check,
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react';
import { ReportItem, ReportTemplate, ReportFormat, ReportScheduleType, ReportStatus } from '../../types';

interface ReportsManagementBlockProps {
  reports: ReportItem[];
  onAddReport: (newReport: ReportItem) => void;
  onUpdateReportStatus?: (id: string, status: ReportStatus) => void;
  density?: 'compact' | 'normal' | 'relaxed';
}

const TEMPLATE_PRESETS: ReportTemplate[] = [
  {
    id: 'tpl-pnl',
    title: '월간 손익(P&L) 요약',
    description: '매출, 비용 및 영업이익률',
    frequency: '매월',
    format: 'PDF',
    iconType: 'currency',
  },
  {
    id: 'tpl-campaign',
    title: '캠페인 성과 분석',
    description: '오픈수, 클릭수 및 유입 매출',
    frequency: '매주',
    format: 'PDF',
    iconType: 'chart',
  },
  {
    id: 'tpl-subs',
    title: '구독 건전성 지표',
    description: 'MRR, 이탈률 및 요금제 구성',
    frequency: '매월',
    format: 'CSV',
    iconType: 'users',
  },
  {
    id: 'tpl-tax',
    title: '매출 세무 요약',
    description: '지역 및 판매 채널별 세무 내역',
    frequency: '분기별',
    format: 'CSV',
    iconType: 'percent',
  },
];

export function ReportsManagementBlock({
  reports: initialReports,
  onAddReport,
  density = 'normal',
}: ReportsManagementBlockProps) {
  const [reportsList, setReportsList] = useState<ReportItem[]>(initialReports);
  const [activeTab, setActiveTab] = useState<'all' | 'scheduled' | 'on_demand'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [mobileLayout, setMobileLayout] = useState<'card' | 'table'>('card');

  // Modals & Drawers
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [activeBouncedItem, setActiveBouncedItem] = useState<ReportItem | null>(null);
  const [downloadToast, setDownloadToast] = useState<{ title: string; message: string } | null>(null);

  // New report form state
  const [formTitle, setFormTitle] = useState('');
  const [formTemplate, setFormTemplate] = useState('월간 손익(P&L) 요약');
  const [formOwner, setFormOwner] = useState('강도원');
  const [formScheduleType, setFormScheduleType] = useState<ReportScheduleType>('scheduled');
  const [formScheduleLabel, setFormScheduleLabel] = useState('매월 · 1일 오전 8:00');
  const [formFormat, setFormFormat] = useState<ReportFormat>('PDF');
  const [formRecipientsText, setFormRecipientsText] = useState('dongwon@hanbit.kr, finance@hanbit.kr');

  // Sync with prop changes if parent updates
  React.useEffect(() => {
    setReportsList(initialReports);
  }, [initialReports]);

  // Unique owners for filter dropdown
  const uniqueOwners = useMemo(() => {
    const set = new Set(reportsList.map((r) => r.ownerName));
    return Array.from(set);
  }, [reportsList]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reportsList.filter((r) => {
      // Tab filter
      if (activeTab === 'scheduled' && r.scheduleType !== 'scheduled') return false;
      if (activeTab === 'on_demand' && r.scheduleType !== 'on_demand') return false;

      // Owner filter
      if (ownerFilter !== 'all' && r.ownerName !== ownerFilter) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(query);
        const matchesTemplate = r.templateName.toLowerCase().includes(query);
        const matchesOwner = r.ownerName.toLowerCase().includes(query);
        const matchesFormat = r.format.toLowerCase().includes(query);
        if (!matchesTitle && !matchesTemplate && !matchesOwner && !matchesFormat) {
          return false;
        }
      }

      return true;
    });
  }, [reportsList, activeTab, ownerFilter, searchQuery]);

  // Counts for tabs
  const totalCount = reportsList.length;
  const scheduledCount = reportsList.filter((r) => r.scheduleType === 'scheduled').length;
  const onDemandCount = reportsList.filter((r) => r.scheduleType === 'on_demand').length;

  // Handle template selection
  const handleUseTemplate = (template: ReportTemplate) => {
    const curMonth = new Date().getMonth() + 1;
    setFormTitle(`${template.title} - ${curMonth}월`);
    setFormTemplate(template.title);
    setFormFormat(template.format);
    setFormScheduleType('scheduled');
    if (template.frequency === '매주' || template.frequency === 'Weekly') {
      setFormScheduleLabel('매주 · 월요일 오전 9:00');
    } else if (template.frequency === '매월' || template.frequency === 'Monthly') {
      setFormScheduleLabel('매월 · 1일 오전 8:00');
    } else if (template.frequency === '분기별' || template.frequency === 'Quarterly') {
      setFormScheduleLabel('분기별 · 1월 2일 오전 8:00');
    }
    setIsTemplatesModalOpen(false);
    setIsNewReportModalOpen(true);
  };

  // Submit new report
  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    let iconType: ReportItem['iconType'] = 'currency';
    let iconBgClass = 'bg-blue-100/80 text-blue-600  ';
    let iconColorClass = 'text-blue-600 ';

    if (formTemplate.includes('캠페인') || formTemplate.includes('Campaign')) {
      iconType = 'chart';
      iconBgClass = 'bg-blue-100/80 text-blue-600  ';
      iconColorClass = 'text-blue-600 ';
    } else if (formTemplate.includes('구독') || formTemplate.includes('Subscription')) {
      iconType = 'users';
      iconBgClass = 'bg-blue-100/80 text-blue-600  ';
      iconColorClass = 'text-blue-600 ';
    } else if (formTemplate.includes('세무') || formTemplate.includes('Tax')) {
      iconType = 'percent';
      iconBgClass = 'bg-amber-100/80 text-amber-700  ';
      iconColorClass = 'text-amber-700 ';
    } else if (formTemplate.includes('재고') || formTemplate.includes('Inventory')) {
      iconType = 'box';
      iconBgClass = 'bg-blue-100/80 text-blue-600  ';
      iconColorClass = 'text-blue-600 ';
    } else if (formTemplate.includes('커스텀') || formTemplate.includes('Custom')) {
      iconType = 'briefcase';
      iconBgClass = 'bg-zinc-200/80 text-zinc-700  ';
      iconColorClass = 'text-zinc-700 ';
    }

    const recipientEmails = Array.from(new Set(
      formRecipientsText.split(',').map((email) => email.trim()).filter(Boolean)
    ));
    if (!recipientEmails.length) return;

    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      title: formTitle,
      templateName: formTemplate,
      ownerName: formOwner,
      iconType,
      iconBgClass,
      iconColorClass,
      scheduleLabel: formScheduleType === 'scheduled' ? formScheduleLabel : '온디맨드 (수시)',
      scheduleType: formScheduleType,
      recipients: recipientEmails.map((email, index) => ({
        id: `rec-${Date.now()}-${index}`,
        name: email,
        initials: email.split('@')[0].slice(0, 2).toUpperCase(),
        avatarBg: 'bg-blue-100 ',
        avatarText: 'text-blue-700 ',
      })),
      extraRecipientsCount: 0,
      format: formFormat,
      lastSent: '방금 전',
      nextSend: formScheduleType === 'scheduled' ? '다음 주기' : '—',
      status: formScheduleType === 'scheduled' ? '예약됨' : '발송 완료',
    };

    setReportsList((prev) => [newReport, ...prev]);
    onAddReport(newReport);
    setIsNewReportModalOpen(false);
    setFormTitle('');
  };

  // The demo exports a real, quoted CSV summary for every requested report format.
  // PDF is a simulated report setting; this sample does not create PDF files.
  const handleDownloadReport = (report: ReportItem) => {
    const csvCell = (value: string) => {
      const safeValue = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
      return `"${safeValue.replace(/"/g, '""')}"`;
    };
    const rows = [
      ['항목', '값'],
      ['데이터', 'KLIC 로컬 데모 — 실제 발송 없음'],
      ['리포트명', report.title],
      ['템플릿', report.templateName],
      ['담당자', report.ownerName],
      ['수신자', report.recipients.map((recipient) => recipient.name).join('; ')],
      ['요청 포맷 (모의 설정)', report.format],
      ['내보내기 포맷', 'CSV'],
      ['생성일시', new Date().toISOString()],
      ['모의 상태', report.status],
    ];
    const fileContent = '\uFEFF' + rows.map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
    const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const basename = report.title.trim().replace(/[\/\\:*?"<>|\s]+/g, '_') || 'report';
    link.download = `${basename}_sample.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloadToast({ title: report.title, message: ' — 샘플 CSV 다운로드를 시작했습니다.' });
    window.setTimeout(() => setDownloadToast(null), 3500);
  };

  // Icon renderer helper
  const renderRowIcon = (iconType: ReportItem['iconType']) => {
    switch (iconType) {
      case 'currency':
        return <DollarSign size={15} />;
      case 'chart':
        return <TrendingUp size={15} />;
      case 'users':
        return <Users size={15} />;
      case 'speaker':
        return <Volume2 size={15} />;
      case 'percent':
        return <Percent size={15} />;
      case 'box':
        return <Package size={15} />;
      case 'briefcase':
      default:
        return <Briefcase size={15} />;
    }
  };

  return (
    <div className="w-full bg-zinc-100/70  p-2 sm:p-5 lg:p-7 rounded-2xl sm:rounded-3xl font-sans selection:bg-zinc-200  overflow-hidden">
      {/* Toast Notification for Download */}
      {downloadToast && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 bg-klic-inverse text-klic-on-emphasis   px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl shadow-xl border border-zinc-700/50  animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-[90vw]">
          <CheckCircle2 size={18} className="text-blue-400  shrink-0" />
          <div className="text-xs">
            <span className="font-semibold">{downloadToast.title}</span>
            <span className="opacity-80">{downloadToast.message}</span>
          </div>
          <button
            onClick={() => setDownloadToast(null)}
            className="ml-1 text-klic-muted hover:text-klic-on-emphasis  cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main White Card Canvas */}
      <div className="w-full bg-white  rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 lg:p-8 shadow-xs border border-zinc-200/80  overflow-hidden">
        {/* ============================================================ */}
        {/* 1. Header Section */}
        {/* ============================================================ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 mb-6 sm:mb-7">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 ">
              리포트 관리
            </h1>
            <p className="text-xs sm:text-sm text-klic-muted  mt-0.5 sm:mt-1">
              로컬 데모입니다. 예약·발송은 모의 상태이며 다운로드는 샘플 CSV 요약입니다.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setIsTemplatesModalOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700  bg-white  border border-zinc-200  hover:bg-zinc-50  hover:border-zinc-300 rounded-xl transition shadow-2xs cursor-pointer"
            >
              <Layers size={14} className="text-klic-muted" />
              <span>템플릿</span>
            </button>

            <button
              onClick={() => setIsNewReportModalOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-klic-on-emphasis bg-klic-inverse hover:bg-klic-inverse    rounded-xl transition shadow-xs cursor-pointer"
            >
              <Plus size={15} />
              <span>새 리포트 생성</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. Top 4 Template Cards Grid */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-9">
          {/* Card 1: 월간 손익(P&L) 요약 */}
          <div className="group relative rounded-2xl border border-zinc-200/90  bg-white  p-4 flex flex-col justify-between hover:border-zinc-300  transition shadow-2xs hover:shadow-xs overflow-hidden">
            {/* Top row */}
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="w-5 h-5 rounded-full bg-zinc-100  text-klic-muted  text-[11px] font-semibold flex items-center justify-center shrink-0">
                $
              </span>
              <h3 className="text-xs font-semibold text-zinc-800  truncate">
                월간 손익(P&L) 요약
              </h3>
            </div>

            {/* Visual: Coral/Red Bar Chart (12 vertical bars with dots) */}
            <div className="h-14 sm:h-16 flex items-end justify-between gap-1 py-1 px-1 my-1">
              {[
                { h: 42 },
                { h: 68 },
                { h: 54 },
                { h: 36 },
                { h: 78 },
                { h: 46 },
                { h: 64 },
                { h: 52 },
                { h: 70 },
                { h: 92 },
                { h: 58 },
                { h: 84 },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                  <div
                    style={{ height: `${item.h}%` }}
                    className="w-full max-w-[7px] rounded-full bg-[var(--klic-component-block-color-danger)]  transition-all group-hover:opacity-90"
                  />
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--klic-component-block-color-danger)] shrink-0" />
                </div>
              ))}
            </div>

            {/* Bottom row */}
            <div className="flex items-end justify-between pt-3 mt-1 border-t border-zinc-100 ">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-medium text-zinc-800  truncate leading-snug">
                  매출, 비용 및 영업이익률
                </p>
                <p className="text-[11px] text-klic-muted  mt-0.5 truncate">
                  매월 · PDF
                </p>
              </div>
              <button
                onClick={() => handleUseTemplate(TEMPLATE_PRESETS[0])}
                className="px-3 py-1 text-xs font-medium text-zinc-700  bg-white  border border-zinc-200  hover:bg-zinc-50  hover:border-zinc-300 rounded-lg transition shrink-0 cursor-pointer"
              >
                사용
              </button>
            </div>
          </div>

          {/* Card 2: 캠페인 성과 분석 */}
          <div className="group relative rounded-2xl border border-zinc-200/90  bg-white  p-4 flex flex-col justify-between hover:border-zinc-300  transition shadow-2xs hover:shadow-xs overflow-hidden">
            {/* Top row */}
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="w-5 h-5 rounded-full bg-zinc-100  text-klic-muted  text-[11px] flex items-center justify-center shrink-0">
                <TrendingUp size={12} />
              </span>
              <h3 className="text-xs font-semibold text-zinc-800  truncate">
                캠페인 성과 분석
              </h3>
            </div>

            {/* Visual: Blue Sparkline Chart */}
            <div className="h-14 sm:h-16 flex items-center justify-center py-1 my-1">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 60" fill="none">
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--klic-component-block-color-accent)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="var(--klic-component-block-color-accent)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 4 48 L 30 48 L 60 47 L 90 46 L 115 45 L 140 43 L 158 18 L 168 34 L 176 26 L 196 38"
                  fill="url(#blueGradient)"
                  stroke="var(--klic-component-block-color-accent)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Bottom row */}
            <div className="flex items-end justify-between pt-3 mt-1 border-t border-zinc-100 ">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-medium text-zinc-800  truncate leading-snug">
                  오픈수, 클릭수 및 유입 매출
                </p>
                <p className="text-[11px] text-klic-muted  mt-0.5 truncate">
                  매주 · PDF
                </p>
              </div>
              <button
                onClick={() => handleUseTemplate(TEMPLATE_PRESETS[1])}
                className="px-3 py-1 text-xs font-medium text-zinc-700  bg-white  border border-zinc-200  hover:bg-zinc-50  hover:border-zinc-300 rounded-lg transition shrink-0 cursor-pointer"
              >
                사용
              </button>
            </div>
          </div>

          {/* Card 3: 구독 건전성 지표 */}
          <div className="group relative rounded-2xl border border-zinc-200/90  bg-white  p-4 flex flex-col justify-between hover:border-zinc-300  transition shadow-2xs hover:shadow-xs overflow-hidden">
            {/* Top row */}
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="w-5 h-5 rounded-full bg-zinc-100  text-klic-muted  text-[11px] flex items-center justify-center shrink-0">
                <Users size={12} />
              </span>
              <h3 className="text-xs font-semibold text-zinc-800  truncate">
                구독 건전성 지표
              </h3>
            </div>

            {/* Visual: Segmented Multi-Bar & Legend */}
            <div className="h-14 sm:h-16 flex flex-col justify-center gap-2 py-1 my-1">
              {/* Segmented bar */}
              <div className="w-full flex items-center gap-1.5">
                <div className="h-2.5 sm:h-3 rounded-full bg-[var(--klic-component-block-color-accent)] flex-[4.5]" title="스타터: 450" />
                <div className="h-2.5 sm:h-3 rounded-full bg-[var(--klic-component-block-color-accent)]  flex-[3.0]" title="플러스: 300" />
                <div
                  className="h-2.5 sm:h-3 rounded-full bg-[var(--klic-component-block-color-selected)]  flex-[1.2] relative overflow-hidden"
                  title="스튜디오: 100"
                >
                  <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="diagonalHatch" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="0" y2="4" stroke="var(--klic-component-block-color-accent)" strokeWidth="1.2" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#diagonalHatch)" />
                  </svg>
                </div>
              </div>

              {/* Legend with counts */}
              <div className="flex items-center justify-between text-[10px] text-klic-muted  font-medium gap-1 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-xs bg-[var(--klic-component-block-color-accent)]" />
                  <span>스타터 450</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-xs bg-[var(--klic-component-block-color-accent)] " />
                  <span>플러스 300</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-xs bg-[var(--klic-component-block-color-selected)] border border-blue-500/30" />
                  <span>스튜디오 100</span>
                </div>
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex items-end justify-between pt-3 mt-1 border-t border-zinc-100 ">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-medium text-zinc-800  truncate leading-snug">
                  MRR, 이탈률 및 요금제 구성
                </p>
                <p className="text-[11px] text-klic-muted  mt-0.5 truncate">
                  매월 · CSV
                </p>
              </div>
              <button
                onClick={() => handleUseTemplate(TEMPLATE_PRESETS[2])}
                className="px-3 py-1 text-xs font-medium text-zinc-700  bg-white  border border-zinc-200  hover:bg-zinc-50  hover:border-zinc-300 rounded-lg transition shrink-0 cursor-pointer"
              >
                사용
              </button>
            </div>
          </div>

          {/* Card 4: 매출 세무 요약 */}
          <div className="group relative rounded-2xl border border-zinc-200/90  bg-white  p-4 flex flex-col justify-between hover:border-zinc-300  transition shadow-2xs hover:shadow-xs overflow-hidden">
            {/* Top row */}
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="w-5 h-5 rounded-full bg-zinc-100  text-klic-muted  text-[11px] font-semibold flex items-center justify-center shrink-0">
                %
              </span>
              <h3 className="text-xs font-semibold text-zinc-800  truncate">
                매출 세무 요약
              </h3>
            </div>

            {/* Visual: Q4 Collected Stat & 12 Dots */}
            <div className="h-14 sm:h-16 flex flex-col justify-center gap-2 py-1 my-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-klic-muted ">4분기 누적 징수액</span>
                <span className="font-semibold text-zinc-900  tabular-nums">$2,140</span>
              </div>

              {/* 12 Dots row (9 amber, 3 empty gray) */}
              <div className="flex items-center justify-between gap-1 pt-1 overflow-x-hidden">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-all shrink-0 ${
                      i < 9
                        ? 'bg-[var(--klic-component-block-color-warning)] shadow-2xs'
                        : 'bg-zinc-100  border border-zinc-200 '
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex items-end justify-between pt-3 mt-1 border-t border-zinc-100 ">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-medium text-zinc-800  truncate leading-snug">
                  지역 및 판매 채널별 세무 내역
                </p>
                <p className="text-[11px] text-klic-muted  mt-0.5 truncate">
                  분기별 · CSV
                </p>
              </div>
              <button
                onClick={() => handleUseTemplate(TEMPLATE_PRESETS[3])}
                className="px-3 py-1 text-xs font-medium text-zinc-700  bg-white  border border-zinc-200  hover:bg-zinc-50  hover:border-zinc-300 rounded-lg transition shrink-0 cursor-pointer"
              >
                사용
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. All Reports Section Header & Filter Toolbar */}
        {/* ============================================================ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 ">
              전체 리포트 목록
            </h2>
            <p className="text-xs text-klic-muted  mt-0.5">
              총 {totalCount}개 리포트 · {scheduledCount}건 정기 예약 · 다음 발송 예정: 12월 18일(금) 오후 4:00
            </p>
          </div>

          {/* View Toggle on Mobile/Tablet */}
          <div className="flex items-center gap-1 bg-zinc-100  p-1 rounded-xl self-start sm:self-auto text-xs font-medium md:hidden">
            <button
              onClick={() => setMobileLayout('card')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                mobileLayout === 'card'
                  ? 'bg-white  text-zinc-900  shadow-2xs font-semibold'
                  : 'text-klic-muted hover:text-zinc-800 '
              }`}
              title="카드 보기"
            >
              <LayoutGrid size={13} />
              <span>카드</span>
            </button>
            <button
              onClick={() => setMobileLayout('table')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                mobileLayout === 'table'
                  ? 'bg-white  text-zinc-900  shadow-2xs font-semibold'
                  : 'text-klic-muted hover:text-zinc-800 '
              }`}
              title="테이블 보기"
            >
              <TableIcon size={13} />
              <span>테이블</span>
            </button>
          </div>
        </div>

        {/* Controls: Segmented Tabs & Search / Owner Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          {/* Segmented Filter Tabs */}
          <div className="inline-flex p-1 bg-zinc-100  rounded-xl text-xs font-medium w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white  text-zinc-900  shadow-2xs font-semibold'
                  : 'text-klic-muted  hover:text-zinc-900 '
              }`}
            >
              <span>전체</span>
              <span className="text-[11px] opacity-75">{totalCount}</span>
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'scheduled'
                  ? 'bg-white  text-zinc-900  shadow-2xs font-semibold'
                  : 'text-klic-muted  hover:text-zinc-900 '
              }`}
            >
              <span>정기 예약</span>
              <span className="text-[11px] opacity-75">{scheduledCount}</span>
            </button>
            <button
              onClick={() => setActiveTab('on_demand')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'on_demand'
                  ? 'bg-white  text-zinc-900  shadow-2xs font-semibold'
                  : 'text-klic-muted  hover:text-zinc-900 '
              }`}
            >
              <span>온디맨드</span>
              <span className="text-[11px] opacity-75">{onDemandCount}</span>
            </button>
          </div>

          {/* Search Input & Owner Dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full md:w-auto">
            {/* Search Box */}
            <div className="relative flex-1 sm:w-56 md:w-64">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-klic-muted pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="리포트명, 템플릿, 담당자 검색..."
                className="w-full pl-8 pr-7 py-2 sm:py-1.5 text-xs bg-white  border border-zinc-200  rounded-xl text-zinc-900  placeholder:text-klic-muted focus:outline-hidden focus:ring-1 focus:ring-zinc-400  shadow-2xs transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-klic-muted hover:text-klic-muted  cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Owner Dropdown */}
            <div className="relative">
              <select
                value={ownerFilter}
                onChange={(e) => setOwnerFilter(e.target.value)}
                className="w-full sm:w-auto appearance-none pl-3 pr-8 py-2 sm:py-1.5 text-xs font-medium bg-white  border border-zinc-200  rounded-xl text-zinc-700  focus:outline-hidden focus:ring-1 focus:ring-zinc-400  shadow-2xs transition cursor-pointer"
              >
                <option value="all">모든 담당자</option>
                {uniqueOwners.map((owner) => (
                  <option key={owner} value={owner}>
                    {owner}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-klic-muted pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4-A. Mobile Card View (md:hidden when mobileLayout === 'card') */}
        {/* ============================================================ */}
        {mobileLayout === 'card' && (
          <div className="space-y-3 md:hidden">
            {filteredReports.length === 0 ? (
              <div className="py-12 text-center text-klic-muted  bg-zinc-50/50  rounded-2xl border border-dashed border-zinc-200 ">
                <p className="text-sm font-medium">검색 조건에 맞는 리포트가 없습니다.</p>
                <p className="text-xs mt-1">검색어나 필터 조건을 변경해 보세요.</p>
              </div>
            ) : (
              filteredReports.map((report) => {
                const isDelivered = report.status === 'Delivered' || report.status === '발송 완료';
                const isScheduled = report.status === 'Scheduled' || report.status === '예약됨';
                const isBounced = report.status === '1 bounced' || report.status === '반송 1건';
                const isDraft = report.status === 'Draft' || report.status === '임시저장';

                return (
                  <div
                    key={report.id}
                    className="p-3.5 sm:p-4 rounded-2xl border border-zinc-200/90  bg-white  shadow-2xs flex flex-col gap-3 transition hover:border-zinc-300 "
                  >
                    {/* Header Row: Icon, Title, Format */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${report.iconBgClass} shadow-2xs`}
                        >
                          {renderRowIcon(report.iconType)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-zinc-900  text-xs sm:text-sm leading-snug truncate">
                            {report.title}
                          </h4>
                          <p className="text-[11px] text-klic-muted  truncate mt-0.5">
                            {report.templateName} · {report.ownerName}
                          </p>
                        </div>
                      </div>

                      {/* Format badge */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100  text-[10px] font-semibold text-klic-muted  border border-zinc-200/70  shrink-0">
                        {report.format === 'PDF' ? (
                          <FileText size={11} className="text-klic-muted" />
                        ) : (
                          <FileSpreadsheet size={11} className="text-klic-muted" />
                        )}
                        <span>{report.format}</span>
                      </span>
                    </div>

                    {/* Schedule & Status Row */}
                    <div className="flex items-center justify-between gap-2 flex-wrap text-xs pt-1 border-t border-zinc-100 ">
                      <div className="flex items-center gap-1.5 text-[11px] text-klic-muted  bg-zinc-50  px-2 py-1 rounded-lg border border-zinc-200/60  font-medium">
                        <Calendar size={12} className="text-klic-muted shrink-0" />
                        <span>{report.scheduleLabel}</span>
                      </div>

                      {/* Status */}
                      <div>
                        {isDelivered && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700   border border-blue-200/80 ">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span>발송 완료</span>
                          </span>
                        )}

                        {isScheduled && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700   border border-blue-200/80 ">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span>예약됨</span>
                          </span>
                        )}

                        {isBounced && (
                          <button
                            onClick={() => setActiveBouncedItem(report)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700   border border-amber-200/80  hover:bg-amber-100 transition cursor-pointer"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>반송 1건 (원인)</span>
                          </button>
                        )}

                        {isDraft && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 text-klic-muted   border border-zinc-200 ">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                            <span>임시저장</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Recipients with REAL PROFILE PHOTOS & Actions */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-100 ">
                      {/* Real photo avatar cluster */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-klic-muted  font-medium">수신자</span>
                        <div className="flex items-center -space-x-2">
                          {report.recipients.map((rec) => (
                            <div key={rec.id} title={rec.name} className="relative group/avatar">
                              {rec.avatarUrl ? (
                                <PersonAvatar
                                  src={rec.avatarUrl}
                                  alt={rec.name}
                                  className="w-6 h-6 rounded-full object-cover ring-2 ring-white  shadow-2xs shrink-0"
                                />
                              ) : (
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${rec.avatarBg || 'bg-zinc-200'} ${rec.avatarText || 'text-zinc-700'} ring-2 ring-white  shadow-2xs shrink-0`}
                                >
                                  {rec.initials}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <span className="text-[11px] font-semibold text-klic-muted ">
                          {report.extraRecipientsCount > 0 ? `+${report.extraRecipientsCount}명` : `${report.recipients.length}명`}
                        </span>
                      </div>

                      {/* Download Action */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-klic-muted  tabular-nums">
                          {report.lastSent}
                        </span>
                        <button
                          onClick={() => handleDownloadReport(report)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-zinc-800  bg-zinc-100 hover:bg-zinc-200   rounded-lg transition cursor-pointer"
                          title={`샘플 CSV 다운로드: ${report.title}`}
                        >
                          <ArrowDownToLine size={13} />
                          <span className="text-[11px]">샘플 CSV</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* 4-B. Table Section (Shown on Desktop & when Table layout toggled) */}
        {/* ============================================================ */}
        <div
          className={`w-full overflow-x-auto border-t border-zinc-200/80  -mx-3.5 sm:mx-0 px-3.5 sm:px-0 ${
            mobileLayout === 'card' ? 'hidden md:block' : 'block'
          }`}
        >
          <table className="w-full min-w-[760px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-100  text-[11px] font-medium text-klic-muted ">
                <th className="py-3 px-3 sm:px-4 font-normal">리포트 명</th>
                <th className="py-3 px-3 font-normal">발송 일정</th>
                <th className="py-3 px-3 font-normal">수신자</th>
                <th className="py-3 px-3 font-normal">포맷</th>
                <th className="py-3 px-3 font-normal">최근 발송일</th>
                <th className="py-3 px-3 font-normal">다음 발송 예정</th>
                <th className="py-3 px-3 font-normal">상태</th>
                <th className="py-3 px-3 text-right font-normal">샘플 CSV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 ">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-klic-muted ">
                    <p className="text-sm font-medium">검색 조건에 맞는 리포트가 없습니다.</p>
                    <p className="text-xs mt-1">검색어나 필터 조건을 변경해 보세요.</p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => {
                  const isDelivered = report.status === 'Delivered' || report.status === '발송 완료';
                  const isScheduled = report.status === 'Scheduled' || report.status === '예약됨';
                  const isBounced = report.status === '1 bounced' || report.status === '반송 1건';
                  const isDraft = report.status === 'Draft' || report.status === '임시저장';

                  const rowPaddingClass =
                    density === 'compact' ? 'py-2.5' : density === 'relaxed' ? 'py-4' : 'py-3.5';

                  return (
                    <tr
                      key={report.id}
                      className="group hover:bg-zinc-50/70  transition-colors"
                    >
                      {/* 1. Report (Icon + Title + Subtitle) */}
                      <td className={`${rowPaddingClass} px-3 sm:px-4`}>
                        <div className="flex items-center gap-3">
                          {/* Left icon badge */}
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${report.iconBgClass} shadow-2xs`}
                          >
                            {renderRowIcon(report.iconType)}
                          </div>
                          {/* Title & subtitle */}
                          <div className="min-w-0">
                            <p className="font-semibold text-zinc-900  text-xs sm:text-[13px] leading-tight truncate">
                              {report.title}
                            </p>
                            <p className="text-[11px] text-klic-muted  mt-0.5 truncate">
                              {report.templateName} · {report.ownerName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 2. Schedule */}
                      <td className={`${rowPaddingClass} px-3 text-klic-muted  font-medium whitespace-nowrap`}>
                        {report.scheduleLabel}
                      </td>

                      {/* 3. Recipients (Avatar cluster with REAL PROFILE PHOTOS) */}
                      <td className={`${rowPaddingClass} px-3 whitespace-nowrap`}>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center -space-x-2">
                            {report.recipients.map((rec) => (
                              <div
                                key={rec.id}
                                title={rec.name}
                                className="relative group/avatar"
                              >
                                {rec.avatarUrl ? (
                                  <PersonAvatar
                                    src={rec.avatarUrl}
                                    alt={rec.name}
                                    className="w-6 h-6 rounded-full object-cover ring-2 ring-white  shrink-0 shadow-2xs hover:scale-110 hover:z-10 transition-transform"
                                  />
                                ) : (
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${rec.avatarBg || 'bg-zinc-200'} ${rec.avatarText || 'text-zinc-700'} ring-2 ring-white  shrink-0 shadow-2xs`}
                                  >
                                    {rec.initials}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <span className="text-[11px] text-klic-muted  font-medium">
                            {report.extraRecipientsCount > 0 ? `+${report.extraRecipientsCount}` : `${report.recipients.length}명`}
                          </span>
                        </div>
                      </td>

                      {/* 4. Format badge (PDF / CSV) */}
                      <td className={`${rowPaddingClass} px-3 whitespace-nowrap`}>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-zinc-100  text-[10px] font-semibold text-klic-muted  border border-zinc-200/70 ">
                          {report.format === 'PDF' ? (
                            <FileText size={11} className="text-klic-muted" />
                          ) : (
                            <FileSpreadsheet size={11} className="text-klic-muted" />
                          )}
                          <span>{report.format}</span>
                        </span>
                      </td>

                      {/* 5. Last sent */}
                      <td className={`${rowPaddingClass} px-3 text-klic-muted  tabular-nums whitespace-nowrap`}>
                        {report.lastSent}
                      </td>

                      {/* 6. Next send */}
                      <td className={`${rowPaddingClass} px-3 text-klic-muted  tabular-nums whitespace-nowrap`}>
                        {report.nextSend}
                      </td>

                      {/* 7. Status Pill */}
                      <td className={`${rowPaddingClass} px-3 whitespace-nowrap`}>
                        {isDelivered && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700   border border-blue-200/80 ">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span>발송 완료</span>
                          </span>
                        )}

                        {isScheduled && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700   border border-blue-200/80 ">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span>예약됨</span>
                          </span>
                        )}

                        {isBounced && (
                          <button
                            onClick={() => setActiveBouncedItem(report)}
                            title="반송 상세 원인 및 진단 확인"
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700   border border-amber-200/80  hover:bg-amber-100 transition cursor-pointer"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>반송 1건</span>
                          </button>
                        )}

                        {isDraft && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 text-klic-muted   border border-zinc-200 ">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                            <span>임시저장</span>
                          </span>
                        )}
                      </td>

                      {/* 8. Download Action */}
                      <td className={`${rowPaddingClass} px-3 text-right whitespace-nowrap`}>
                        <button
                          onClick={() => handleDownloadReport(report)}
                          title={`샘플 CSV 다운로드: ${report.title}`}
                          aria-label={`샘플 CSV 다운로드: ${report.title}`}
                          className="p-1.5 text-klic-muted hover:text-zinc-800  hover:bg-zinc-100  rounded-lg transition cursor-pointer"
                        >
                          <ArrowDownToLine size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. Modal: New Report */}
      {/* ============================================================ */}
      {isNewReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-klic-inverse/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white  rounded-2xl border border-zinc-200  shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-zinc-100 ">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-zinc-100  flex items-center justify-center text-zinc-800 ">
                  <Plus size={16} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-zinc-900 ">
                  새 리포트 생성
                </h3>
              </div>
              <button
                onClick={() => setIsNewReportModalOpen(false)}
                className="text-klic-muted hover:text-klic-muted  cursor-pointer p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700  mb-1">
                  리포트 제목
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="예: 12월 전사 성장 지표 리포트"
                  className="w-full px-3 py-2 text-xs bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700  mb-1">
                    템플릿 / 분류
                  </label>
                  <select
                    value={formTemplate}
                    onChange={(e) => setFormTemplate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden cursor-pointer"
                  >
                    <option value="월간 손익(P&L) 요약">월간 손익(P&L) 요약</option>
                    <option value="캠페인 성과 분석">캠페인 성과 분석</option>
                    <option value="구독 건전성 지표">구독 건전성 지표</option>
                    <option value="매출 세무 요약">매출 세무 요약</option>
                    <option value="주간 재고 회전율 및 소진 분석">주간 재고 회전율 및 소진 분석</option>
                    <option value="커스텀 리포트">커스텀 리포트</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700  mb-1">
                    담당자
                  </label>
                  <select
                    value={formOwner}
                    onChange={(e) => setFormOwner(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden cursor-pointer"
                  >
                    <option value="강도원">강도원</option>
                    <option value="박시은">박시은</option>
                    <option value="조현우">조현우</option>
                    <option value="태민호">태민호</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700  mb-1">
                    발송 유형
                  </label>
                  <div className="grid grid-cols-2 p-0.5 bg-zinc-100  rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => setFormScheduleType('scheduled')}
                      className={`py-1.5 rounded-md font-medium text-center transition cursor-pointer ${
                        formScheduleType === 'scheduled'
                          ? 'bg-white  text-zinc-900  shadow-2xs font-semibold'
                          : 'text-klic-muted'
                      }`}
                    >
                      정기 예약
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormScheduleType('on_demand')}
                      className={`py-1.5 rounded-md font-medium text-center transition cursor-pointer ${
                        formScheduleType === 'on_demand'
                          ? 'bg-white  text-zinc-900  shadow-2xs font-semibold'
                          : 'text-klic-muted'
                      }`}
                    >
                      온디맨드 (수시)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700  mb-1">
                    요청 포맷 (모의 설정)
                  </label>
                  <div className="grid grid-cols-2 p-0.5 bg-zinc-100  rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => setFormFormat('PDF')}
                      className={`py-1.5 rounded-md font-medium text-center transition cursor-pointer ${
                        formFormat === 'PDF'
                          ? 'bg-white  text-zinc-900  shadow-2xs font-semibold'
                          : 'text-klic-muted'
                      }`}
                    >
                      PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormFormat('CSV')}
                      className={`py-1.5 rounded-md font-medium text-center transition cursor-pointer ${
                        formFormat === 'CSV'
                          ? 'bg-white  text-zinc-900  shadow-2xs font-semibold'
                          : 'text-klic-muted'
                      }`}
                    >
                      CSV
                    </button>
                  </div>
                </div>
              </div>

              {formScheduleType === 'scheduled' && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-700  mb-1">
                    반복 발송 주기
                  </label>
                  <select
                    value={formScheduleLabel}
                    onChange={(e) => setFormScheduleLabel(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden cursor-pointer"
                  >
                    <option value="매월 · 1일 오전 8:00">매월 · 1일 오전 8:00</option>
                    <option value="매주 · 월요일 오전 9:00">매주 · 월요일 오전 9:00</option>
                    <option value="매주 · 금요일 오후 4:00">매주 · 금요일 오후 4:00</option>
                    <option value="분기별 · 1월 2일 오전 8:00">분기별 · 1월 2일 오전 8:00</option>
                    <option value="매일 · 오전 8:00">매일 · 오전 8:00</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-700  mb-1">
                  수신자 이메일 목록 (쉼표 구분 · 실제 발송 없음)
                </label>
                <input
                  type="email"
                  multiple
                  required
                  aria-label="수신자 이메일 목록"
                  value={formRecipientsText}
                  onChange={(e) => setFormRecipientsText(e.target.value)}
                  placeholder="name@company.com, partners@company.com"
                  className="w-full px-3 py-2 text-xs bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 ">
                <button
                  type="button"
                  onClick={() => setIsNewReportModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-klic-muted  hover:text-zinc-900  rounded-xl cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-klic-on-emphasis bg-klic-inverse hover:bg-klic-inverse    rounded-xl transition shadow-xs cursor-pointer"
                >
                  리포트 생성하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. Modal: Templates Library */}
      {/* ============================================================ */}
      {isTemplatesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-klic-inverse/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white  rounded-2xl border border-zinc-200  shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-zinc-100 ">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-zinc-100  flex items-center justify-center text-zinc-800 ">
                  <Layers size={16} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 ">
                    리포트 템플릿 라이브러리
                  </h3>
                  <p className="text-[11px] sm:text-xs text-klic-muted">
                    사전 구성된 표준 템플릿을 선택하여 즉시 예약 발송을 구성하세요.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTemplatesModalOpen(false)}
                className="text-klic-muted hover:text-klic-muted  cursor-pointer p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4 sm:my-5 max-h-[55vh] overflow-y-auto pr-1">
              {TEMPLATE_PRESETS.map((tpl) => (
                <div
                  key={tpl.id}
                  className="p-3.5 sm:p-4 rounded-xl border border-zinc-200  hover:border-zinc-300  bg-zinc-50/50  flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-zinc-900 ">
                        {tpl.title}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-200  text-zinc-700 ">
                        {tpl.format}
                      </span>
                    </div>
                    <p className="text-xs text-klic-muted ">
                      {tpl.description}
                    </p>
                    <p className="text-[11px] text-klic-muted mt-2">
                      발송 주기: {tpl.frequency}
                    </p>
                  </div>
                  <button
                    onClick={() => handleUseTemplate(tpl)}
                    className="mt-4 w-full py-1.5 text-xs font-semibold bg-white  border border-zinc-200  hover:bg-zinc-100  rounded-lg transition cursor-pointer"
                  >
                    이 템플릿 사용하기
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-zinc-100 ">
              <button
                onClick={() => setIsTemplatesModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-klic-muted  hover:text-zinc-900 cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. Modal: Bounced Delivery Diagnostic */}
      {/* ============================================================ */}
      {activeBouncedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-klic-inverse/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white  rounded-2xl border border-zinc-200  shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 ">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100  flex items-center justify-center text-amber-700 ">
                  <AlertTriangle size={16} />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 ">
                  발송 실패 진단: 1건 반송됨
                </h3>
              </div>
              <button
                onClick={() => setActiveBouncedItem(null)}
                className="text-klic-muted hover:text-klic-muted cursor-pointer p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div>
                <span className="text-klic-muted block text-[11px]">리포트 명</span>
                <span className="font-semibold text-zinc-900 ">
                  {activeBouncedItem.title}
                </span>
              </div>
              <div>
                <span className="text-klic-muted block text-[11px]">반송된 수신 주소</span>
                <span className="font-mono text-zinc-700  bg-zinc-100  px-2 py-1 rounded inline-block">
                  accounting-team@harbor.internal
                </span>
              </div>
              <div>
                <span className="text-klic-muted block text-[11px]">메일 서버 응답 로그</span>
                <p className="mt-1 p-2.5 rounded-lg bg-amber-50  text-amber-800  border border-amber-200/60  font-mono text-[11px] leading-relaxed">
                  {activeBouncedItem.bounceReason || '550 5.1.1: 회계 담당 수신함 용량 초과로 인한 반송'}
                </p>
              </div>
              <p className="text-[11px] text-klic-muted">
                다음 자동 재발송 시도는 12월 18일 오후 4:00에 진행됩니다.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 ">
              <button
                onClick={() => {
                  setReportsList((prev) =>
                    prev.map((r) =>
                      r.id === activeBouncedItem.id ? { ...r, status: '발송 완료' } : r
                    )
                  );
                  setActiveBouncedItem(null);
                  setDownloadToast({ title: '모의 재발송 완료', message: ' — 데모 상태를 변경했습니다. 실제 이메일은 발송하지 않습니다.' });
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-klic-on-emphasis bg-klic-inverse hover:bg-klic-inverse rounded-xl cursor-pointer"
              >
                모의 재발송
              </button>
              <button
                onClick={() => setActiveBouncedItem(null)}
                className="px-3 py-1.5 text-xs font-medium text-klic-muted hover:text-zinc-900 cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
