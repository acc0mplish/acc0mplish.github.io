import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Settings,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  Check,
  Copy,
  AlertCircle,
  X,
  Send,
  Zap,
  HelpCircle,
  FileText,
  Activity,
  Layers,
  Sparkles,
  Link2,
  Trash2,
  PauseCircle,
  PlayCircle,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import {
  IntegrationItem,
  IntegrationCategoryKey,
  SyncHealthService,
} from '../../types';
import {
  INITIAL_INTEGRATIONS_DATA,
  INITIAL_SYNC_HEALTH_DATA,
} from '../../data/componentsData';

interface IntegrationsHubBlockProps {
  density?: 'compact' | 'normal' | 'relaxed';
}

export function IntegrationsHubBlock({ density = 'normal' }: IntegrationsHubBlockProps) {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(
    INITIAL_INTEGRATIONS_DATA
  );
  const [syncHealthList, setSyncHealthList] = useState<SyncHealthService[]>(
    INITIAL_SYNC_HEALTH_DATA
  );

  const [selectedCategory, setSelectedCategory] =
    useState<IntegrationCategoryKey>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [activeManageItem, setActiveManageItem] =
    useState<IntegrationItem | null>(null);
  const [activeConnectItem, setActiveConnectItem] =
    useState<IntegrationItem | null>(null);
  const [activeDocsItem, setActiveDocsItem] = useState<IntegrationItem | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isHealthDetailOpen, setIsHealthDetailOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Ping test state in manage modal
  const [isPinging, setIsPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState<boolean | null>(null);

  // Connect form inputs
  const [connectApiKey, setConnectApiKey] = useState('');
  const [connectEnv, setConnectEnv] = useState<'live' | 'test'>('live');

  // Request form inputs
  const [reqServiceName, setReqServiceName] = useState('');
  const [reqServiceCategory, setReqServiceCategory] = useState('결제 대행 (Processor)');
  const [reqReason, setReqReason] = useState('');

  // Add custom integration form inputs
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] =
    useState<IntegrationCategoryKey>('processors');
  const [customEndpoint, setCustomEndpoint] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Connected vs Available lists
  const connectedItems = useMemo(
    () => integrations.filter((item) => item.status === 'connected' || item.status === 'paused'),
    [integrations]
  );

  const availableItems = useMemo(
    () => integrations.filter((item) => item.status === 'available'),
    [integrations]
  );

  // Category counts
  const categoryCounts = useMemo(() => {
    const total = integrations.length;
    const processors = integrations.filter((i) => i.category === 'processors').length;
    const commerce = integrations.filter((i) => i.category === 'commerce').length;
    const accounting = integrations.filter((i) => i.category === 'accounting').length;
    const alerts = integrations.filter((i) => i.category === 'alerts').length;
    const automation = integrations.filter(
      (i) => i.category === 'automation' || i.category === 'crm'
    ).length;

    return {
      all: total,
      processors,
      commerce,
      accounting,
      alerts,
      automation,
    };
  }, [integrations]);

  // Filter logic
  const matchesSearchAndCategory = (item: IntegrationItem) => {
    const matchesCat =
      selectedCategory === 'all' ||
      (selectedCategory === 'processors' && item.category === 'processors') ||
      (selectedCategory === 'commerce' && item.category === 'commerce') ||
      (selectedCategory === 'accounting' && item.category === 'accounting') ||
      (selectedCategory === 'alerts' && item.category === 'alerts') ||
      (selectedCategory === 'automation' &&
        (item.category === 'automation' || item.category === 'crm'));

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      q === '' ||
      item.name.toLowerCase().includes(q) ||
      item.categoryLabel.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.stat1.label.toLowerCase().includes(q) ||
      item.stat2.label.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  };

  const filteredConnected = useMemo(
    () => connectedItems.filter(matchesSearchAndCategory),
    [connectedItems, selectedCategory, searchQuery]
  );

  const filteredAvailable = useMemo(
    () => availableItems.filter(matchesSearchAndCategory),
    [availableItems, selectedCategory, searchQuery]
  );

  // Handle Connect
  const handleExecuteConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConnectItem) return;

    const target = activeConnectItem;
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === target.id
          ? {
              ...i,
              status: 'connected',
              statusLabel: "연결됨",
              stat1: { label: '초기 동기화', value: '정상 가동' },
              stat2: { label: '최근 동기화', value: '방금 전' },
              lastSyncAgo: '방금 전',
              webhookUrl: `https://api.payvora.com/v1/webhooks/${target.brandKey}_${connectEnv}_${Math.random().toString(36).substring(7)}`,
              syncInterval: '5분',
            }
          : i
      )
    );

    // Also add to sync health
    setSyncHealthList((prev) => [
      ...prev,
      {
        id: `sync-${target.brandKey}`,
        name: target.name,
        brandKey: target.brandKey,
        eventsCount: 142,
        eventsFormatted: "이벤트 142건",
        lastSyncAgo: '방금 전',
        barPercent: 12,
        status: 'healthy',
      },
    ]);

    showToast(`${target.name} 연동이 성공적으로 활성화되었습니다!`);
    setActiveConnectItem(null);
    setConnectApiKey('');
  };

  // Handle Disconnect
  const handleDisconnect = (item: IntegrationItem) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              status: 'available',
              statusLabel: '연결 가능 (Available)',
              stat1: { label: '설치 소요', value: '약 5분' },
              stat2: { label: '동기화 주기', value: '일별' },
            }
          : i
      )
    );
    setSyncHealthList((prev) => prev.filter((s) => s.id !== `sync-${item.brandKey}`));
    showToast(`${item.name} 연동이 안전하게 해제되었습니다.`);
    setActiveManageItem(null);
  };

  // Toggle Pause
  const handleTogglePause = (item: IntegrationItem) => {
    const isPaused = item.status === 'paused';
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              status: isPaused ? 'connected' : 'paused',
              statusLabel: isPaused ? '연결됨 (Connected)' : '일시 중단 (Paused)',
            }
          : i
      )
    );
    showToast(
      isPaused
        ? `${item.name} 연동 동기화가 재개되었습니다.`
        : `${item.name} 연동 동기화가 일시 중지되었습니다.`
    );
    setActiveManageItem(null);
  };

  // Ping Webhook
  const handlePingWebhook = () => {
    setIsPinging(true);
    setPingSuccess(null);
    setTimeout(() => {
      setIsPinging(false);
      setPingSuccess(true);
    }, 700);
  };

  // Request new integration submit
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqServiceName) return;
    showToast(`'${reqServiceName}' 연동 요청이 개발팀에 전달되었습니다.`);
    setIsRequestModalOpen(false);
    setReqServiceName('');
    setReqReason('');
  };

  // Add custom integration submit
  const handleAddCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName) return;

    const newId = `int-custom-${Date.now()}`;
    const newItem: IntegrationItem = {
      id: newId,
      name: customName,
      category: customCategory,
      categoryLabel:
        customCategory === 'processors'
          ? '결제 대행 (Processor)'
          : customCategory === 'commerce'
          ? '커머스 (Commerce)'
          : customCategory === 'accounting'
          ? '회계 (Accounting)'
          : customCategory === 'alerts'
          ? '알림 (Alerts)'
          : '자동화 (Automation)',
      brandKey: 'custom',
      status: 'connected',
      statusLabel: "연결됨",
      description: `사내 맞춤형 웹훅 엔드포인트 (${customEndpoint || '커스텀 게이트웨이'}) 연동`,
      stat1: { label: '볼륨 점유', value: '1%' },
      stat2: { label: '최근 동기화', value: '방금 전' },
      webhookUrl: customEndpoint || 'https://api.payvora.com/v1/webhooks/custom_gw_live',
      syncInterval: '실시간',
      eventsCount24h: 35,
      lastSyncAgo: '방금 전',
    };

    setIntegrations((prev) => [newItem, ...prev]);
    showToast(`'${customName}' 맞춤 연동이 생성되었습니다.`);
    setIsAddModalOpen(false);
    setCustomName('');
    setCustomEndpoint('');
  };

  // Brand SVG Logos
  const renderBrandLogo = (brandKey: string, size = 38) => {
    switch (brandKey) {
      case 'stripe':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-xl bg-[var(--klic-component-block-color-accent)] flex items-center justify-center text-klic-on-emphasis shrink-0 shadow-xs"
          >
            <svg viewBox="0 0 40 40" className="w-5 h-5 fill-current">
              <path d="M16.5 17.2c0-1.2 1-1.7 2.6-1.7 2.4 0 5.4.8 7.8 2.1v-6.7c-2.6-1-5.3-1.4-7.8-1.4-6.4 0-10.7 3.3-10.7 9 0 8.8 12.1 7.4 12.1 11.2 0 1.4-1.2 1.9-3 1.9-2.7 0-6.2-1.1-8.9-2.7v6.8c3 1.3 6.1 1.8 8.9 1.8 6.6 0 11.2-3.2 11.2-9.1 0-9.5-12.2-7.9-12.2-11.1z" />
            </svg>
          </div>
        );
      case 'adyen':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-xl bg-white  border border-zinc-200/80  flex items-center justify-center shrink-0 shadow-xs"
          >
            <span className="text-[color:var(--klic-component-block-color-accent)] font-bold text-xs tracking-tight">adyen</span>
          </div>
        );
      case 'paypal':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-xl bg-[var(--klic-component-block-color-accent)] flex items-center justify-center text-klic-on-emphasis shrink-0 shadow-xs"
          >
            <span className="font-black italic text-sm tracking-tighter text-[color:var(--klic-component-block-color-accent)]">
              <span className="text-klic-on-emphasis">P</span>P
            </span>
          </div>
        );
      case 'klarna':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-xl bg-[var(--klic-component-block-color-selected)] flex items-center justify-center text-zinc-950 shrink-0 shadow-xs"
          >
            <span className="font-extrabold text-sm tracking-tight">K.</span>
          </div>
        );
      case 'shopify':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-xl bg-[var(--klic-component-block-color-accent)] flex items-center justify-center text-klic-on-emphasis shrink-0 shadow-xs"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M19.8 6.2c-.1-.3-.3-.5-.6-.5h-2.9C15.9 3.2 14.1 1.5 12 1.5S8.1 3.2 7.7 5.7H4.8c-.3 0-.5.2-.6.5l-2.6 15c0 .2 0 .4.2.6.2.2.4.3.6.3h19.2c.2 0 .5-.1.6-.3.2-.2.2-.4.2-.6l-2.7-15zm-7.8-3.2c1.2 0 2.2 1.1 2.5 2.7H9.5c.3-1.6 1.3-2.7 2.5-2.7zm-.6 13.7c-1.3 0-2.3-.9-2.3-2.3 0-1.7 1.6-2.2 3.1-2.5v-.2c0-.5-.4-.8-1-.8-.6 0-1.1.2-1.5.5l-.5-1.1c.6-.4 1.4-.7 2.3-.7 1.6 0 2.5.9 2.5 2.4v3.5c-.7.7-1.7 1.2-2.6 1.2zm1.8-3.4c-.9.2-1.8.5-1.8 1.4 0 .6.5.9 1.1.9.4 0 .7-.1 1-.4v-1.9h-.3z" />
            </svg>
          </div>
        );
      case 'slack':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-xl bg-white  border border-zinc-200/80  flex items-center justify-center shrink-0 shadow-xs"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="var(--klic-component-block-color-accent)" d="M5.04 14.5a2.5 2.5 0 1 0-2.5-2.5v2.5h2.5zm1.25 0a2.5 2.5 0 0 0 5 0v-6.25a2.5 2.5 0 0 0-5 0V14.5z" />
              <path fill="var(--klic-component-block-color-accent)" d="M9.5 5.04a2.5 2.5 0 1 0-2.5-2.5h2.5v2.5zm0 1.25a2.5 2.5 0 0 0 0 5h6.25a2.5 2.5 0 0 0 0-5H9.5z" />
              <path fill="var(--klic-component-block-color-accent)" d="M18.96 9.5a2.5 2.5 0 1 0 2.5 2.5v-2.5h-2.5zm-1.25 0a2.5 2.5 0 0 0-5 0v6.25a2.5 2.5 0 0 0 5 0V9.5z" />
              <path fill="var(--klic-component-block-color-warning)" d="M14.5 18.96a2.5 2.5 0 1 0 2.5 2.5h-2.5v-2.5zm0-1.25a2.5 2.5 0 0 0 0-5H8.25a2.5 2.5 0 0 0 0 5h6.25z" />
            </svg>
          </div>
        );
      case 'quickbooks':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-xl bg-[var(--klic-component-block-color-accent)] flex items-center justify-center text-klic-on-emphasis shrink-0 shadow-xs font-bold text-sm"
          >
            qb
          </div>
        );
      case 'xero':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-xl bg-[var(--klic-component-block-color-accent)] flex items-center justify-center text-klic-on-emphasis shrink-0 shadow-xs font-extrabold text-[11px] tracking-tight"
          >
            xero
          </div>
        );
      case 'hubspot':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-xl bg-[var(--klic-component-block-color-danger)] flex items-center justify-center text-klic-on-emphasis shrink-0 shadow-xs"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M18.7 8.2V5.7a1.8 1.8 0 1 0-2.3-1.7c0 .4.1.8.4 1.1v3.1a6.6 6.6 0 0 0-3.3 1.7L7.8 7.2a2.3 2.3 0 1 0-1.2 1.9l5.6 2.7c-.1.5-.2 1.1-.2 1.7s.1 1.2.2 1.7L6.6 18a2.3 2.3 0 1 0 1.2 1.9l5.7-2.7a6.6 6.6 0 0 0 3.3 1.7v3.1c-.3.3-.4.7-.4 1.1a1.8 1.8 0 1 0 2.3-1.7v-2.5a6.5 6.5 0 0 0 0-10.7zm-2.2 7.7a4.1 4.1 0 1 1 0-8.2 4.1 4.1 0 0 1 0 8.2z" />
            </svg>
          </div>
        );
      case 'zapier':
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-xl bg-[var(--klic-component-block-color-warning)] flex items-center justify-center text-klic-on-emphasis shrink-0 shadow-xs"
          >
            <span className="font-black text-lg leading-none">*</span>
          </div>
        );
      default:
        return (
          <div
            style={{ width: size, height: size }}
            className="rounded-xl bg-klic-inverse text-klic-on-emphasis flex items-center justify-center shrink-0 shadow-xs"
          >
            <Link2 size={18} />
          </div>
        );
    }
  };

  return (
    <div className="w-full bg-white  rounded-2xl border border-zinc-200/90  shadow-xs overflow-hidden transition-all p-3.5 sm:p-6 lg:p-8">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-klic-inverse text-klic-on-emphasis   shadow-2xl text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. Header Toolbar (Actions & Filter Tabs + Search)           */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-4 mb-6 sm:mb-8">
        {/* Top actions line */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900  flex items-center gap-2">
              <span>연동 서비스 허브</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700   border border-blue-200/80 ">
                실시간 동기화 중
              </span>
            </h2>
            <p className="text-xs text-klic-muted  mt-0.5">
              외부 결제 게이트웨이, 커머스 스토어, 알림 및 회계 솔루션을 통합 관리합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-zinc-700  bg-white  hover:bg-zinc-50  border border-zinc-200  rounded-xl transition shadow-2xs cursor-pointer"
            >
              <span>연동 요청</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-klic-on-emphasis bg-klic-inverse hover:bg-klic-inverse    rounded-xl transition shadow-xs cursor-pointer"
            >
              <Plus size={15} />
              <span>연동 추가</span>
            </button>
          </div>
        </div>

        {/* Filter Pills and Search bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
          {/* Filter Pills with horizontal scroll on mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs -mx-1 px-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full font-medium transition cursor-pointer whitespace-nowrap text-xs shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-klic-inverse text-klic-on-emphasis   font-semibold shadow-2xs'
                  : 'text-klic-muted  hover:bg-zinc-100 '
              }`}
            >
              전체 ( {categoryCounts.all})
            </button>
            <button
              onClick={() => setSelectedCategory('processors')}
              className={`px-3 py-1.5 rounded-full font-medium transition cursor-pointer whitespace-nowrap text-xs shrink-0 ${
                selectedCategory === 'processors'
                  ? 'bg-klic-inverse text-klic-on-emphasis   font-semibold shadow-2xs'
                  : 'text-klic-muted  hover:bg-zinc-100 '
              }`}
            >
              결제 대행 ( {categoryCounts.processors})
            </button>
            <button
              onClick={() => setSelectedCategory('commerce')}
              className={`px-3 py-1.5 rounded-full font-medium transition cursor-pointer whitespace-nowrap text-xs shrink-0 ${
                selectedCategory === 'commerce'
                  ? 'bg-klic-inverse text-klic-on-emphasis   font-semibold shadow-2xs'
                  : 'text-klic-muted  hover:bg-zinc-100 '
              }`}
            >
              커머스 ( {categoryCounts.commerce})
            </button>
            <button
              onClick={() => setSelectedCategory('accounting')}
              className={`px-3 py-1.5 rounded-full font-medium transition cursor-pointer whitespace-nowrap text-xs shrink-0 ${
                selectedCategory === 'accounting'
                  ? 'bg-klic-inverse text-klic-on-emphasis   font-semibold shadow-2xs'
                  : 'text-klic-muted  hover:bg-zinc-100 '
              }`}
            >
              회계 ( {categoryCounts.accounting})
            </button>
            <button
              onClick={() => setSelectedCategory('alerts')}
              className={`px-3 py-1.5 rounded-full font-medium transition cursor-pointer whitespace-nowrap text-xs shrink-0 ${
                selectedCategory === 'alerts'
                  ? 'bg-klic-inverse text-klic-on-emphasis   font-semibold shadow-2xs'
                  : 'text-klic-muted  hover:bg-zinc-100 '
              }`}
            >
              알림 ( {categoryCounts.alerts})
            </button>
            <button
              onClick={() => setSelectedCategory('automation')}
              className={`px-3 py-1.5 rounded-full font-medium transition cursor-pointer whitespace-nowrap text-xs shrink-0 ${
                selectedCategory === 'automation'
                  ? 'bg-klic-inverse text-klic-on-emphasis   font-semibold shadow-2xs'
                  : 'text-klic-muted  hover:bg-zinc-100 '
              }`}
            >
              자동화 ( {categoryCounts.automation})
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-klic-muted pointer-events-none"
            />
            <input
              type="text"
              placeholder="연동 서비스 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-7 py-2 text-xs bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-900  placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-klic-muted hover:text-klic-muted  cursor-pointer p-0.5"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. Section: Connected (연결됨)                              */}
      {/* ============================================================ */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-baseline gap-2">
            <h3 className="text-sm font-bold text-zinc-900 ">
              연결됨
            </h3>
            <span className="text-xs text-klic-muted  font-medium">
              {connectedItems.length}개 서비스 연결됨 · 전원 정상 가동 중
            </span>
          </div>
        </div>

        {filteredConnected.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-200  bg-zinc-50/50 ">
            <p className="text-xs text-klic-muted">
              검색 조건에 맞는 연결된 서비스가 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Connected Cards */}
            {filteredConnected.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-zinc-200/90  bg-white  p-4 sm:p-5 flex flex-col justify-between hover:shadow-md hover:border-zinc-300  transition duration-150 group"
              >
                <div>
                  {/* Top: Icon + Name + Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {renderBrandLogo(item.brandKey, 38)}
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-zinc-900  truncate group-hover:text-blue-600  transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-klic-muted  truncate mt-0.5">
                          {item.categoryLabel}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {item.status === 'connected' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700   border border-blue-200/70 ">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span>연결됨</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700   border border-amber-200/70 ">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>일시정지됨</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-klic-muted  line-clamp-2 leading-relaxed min-h-[36px] mb-3.5">
                    {item.description}
                  </p>

                  {/* Stat Box */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-zinc-50  border border-zinc-100  mb-4">
                    <div>
                      <span className="block text-[10px] text-klic-muted  truncate">
                        {item.stat1.label}
                      </span>
                      <span className="font-bold text-xs text-zinc-900  mt-0.5 block truncate">
                        {item.stat1.value}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-klic-muted  truncate">
                        {item.stat2.label}
                      </span>
                      <span className="font-semibold text-xs text-zinc-900  mt-0.5 block truncate">
                        {item.stat2.value}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions: Manage + Docs */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 ">
                  <button
                    onClick={() => setActiveManageItem(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700  bg-zinc-100/80 hover:bg-zinc-200   rounded-lg transition cursor-pointer"
                  >
                    <Settings size={13} className="text-klic-muted" />
                    <span>관리</span>
                  </button>

                  <button
                    onClick={() => setActiveDocsItem(item)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-klic-muted hover:text-zinc-900  transition cursor-pointer"
                  >
                    <span>문서</span>
                    <ArrowUpRight size={12} />
                  </button>
                </div>
              </div>
            ))}

            {/* Special Card: Sync health (spans 2 columns on lg screens) */}
            {selectedCategory === 'all' && searchQuery.trim() === '' && (
              <div className="sm:col-span-2 rounded-2xl border border-zinc-200/90  bg-white  p-4 sm:p-5 flex flex-col justify-between hover:shadow-md hover:border-zinc-300  transition duration-150">
                <div>
                  {/* Sync health Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-zinc-900  flex items-center gap-2">
                        <span>동기화 상태</span>
                      </h4>
                      <p className="text-[11px] text-klic-muted  mt-0.5">
                        최근 24시간 동안 연결된 서비스에서 수신한 이벤트
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700   border border-blue-200/70  shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>모두 정상</span>
                    </span>
                  </div>

                  {/* Sync event rows with striped progress bars */}
                  <div className="space-y-3.5 mt-4">
                    {syncHealthList.map((svc) => (
                      <div
                        key={svc.id}
                        className="group/row flex items-center gap-2 sm:gap-3 text-xs"
                      >
                        {/* Service Icon + Name */}
                        <div className="flex items-center gap-2 w-24 sm:w-28 shrink-0">
                          {renderBrandLogo(svc.brandKey, 20)}
                          <span className="font-semibold text-xs text-zinc-900  truncate">
                            {svc.name}
                          </span>
                        </div>

                        {/* Striped Progress Bar Track */}
                        <div className="flex-1 min-w-[70px] h-3 rounded-full bg-zinc-100  overflow-hidden relative border border-zinc-200/60 ">
                          <div
                            style={{ width: `${svc.barPercent}%` }}
                            className="h-full rounded-full transition-all duration-500 bg-[repeating-linear-gradient(45deg,var(--klic-component-block-color-accent),var(--klic-component-block-color-accent)_4px,var(--klic-component-block-color-accent)_4px,var(--klic-component-block-color-accent)_8px)]  shadow-2xs group-hover/row:brightness-110"
                            title={`${svc.name}: ${svc.eventsFormatted} (${svc.barPercent}%)`}
                          />
                        </div>

                        {/* Events count */}
                        <div className="w-24 sm:w-28 text-right font-medium text-zinc-800  tabular-nums shrink-0 text-xs">
                          {svc.eventsFormatted}
                        </div>

                        {/* Last sync time */}
                        <div className="w-16 sm:w-20 text-right text-[11px] text-klic-muted  tabular-nums shrink-0">
                          {svc.lastSyncAgo}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-4 border-t border-zinc-100  text-xs">
                  <span className="text-[11px] text-klic-muted">
                    전체 수신 이벤트: 64,198건 / 24시간
                  </span>
                  <button
                    onClick={() => setIsHealthDetailOpen(true)}
                    className="text-[11px] font-semibold text-blue-600  hover:underline cursor-pointer"
                  >
                    실시간 이벤트 스트림 보기 →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 3. Section: Available (연동 가능)                           */}
      {/* ============================================================ */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-baseline gap-2">
            <h3 className="text-sm font-bold text-zinc-900 ">
              연동 가능
            </h3>
            <span className="text-xs text-klic-muted  font-medium">
              몇 번의 클릭으로 연결하며, 기본 권한은 읽기 전용입니다
            </span>
          </div>
        </div>

        {filteredAvailable.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-200  bg-zinc-50/50 ">
            <p className="text-xs text-klic-muted">
              검색 조건에 맞는 연동 가능 서비스가 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredAvailable.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-zinc-200/90  bg-white  p-4 sm:p-5 flex flex-col justify-between hover:shadow-md hover:border-zinc-300  transition duration-150 group"
              >
                <div>
                  {/* Top: Icon + Name + Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {renderBrandLogo(item.brandKey, 38)}
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-zinc-900  truncate group-hover:text-blue-600  transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-klic-muted  truncate mt-0.5">
                          {item.categoryLabel}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 text-klic-muted   border border-zinc-200 ">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                        <span>연동 가능</span>
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-klic-muted  line-clamp-2 leading-relaxed min-h-[36px] mb-3.5">
                    {item.description}
                  </p>

                  {/* Stat Box */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-zinc-50  border border-zinc-100  mb-4">
                    <div>
                      <span className="block text-[10px] text-klic-muted  truncate">
                        {item.stat1.label}
                      </span>
                      <span className="font-bold text-xs text-zinc-900  mt-0.5 block truncate">
                        {item.stat1.value}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-klic-muted  truncate">
                        {item.stat2.label}
                      </span>
                      <span className="font-semibold text-xs text-zinc-900  mt-0.5 block truncate">
                        {item.stat2.value}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions: + Connect + Docs */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 ">
                  <button
                    onClick={() => setActiveConnectItem(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-zinc-800  bg-zinc-100 hover:bg-zinc-200   rounded-lg transition cursor-pointer"
                  >
                    <Plus size={13} className="text-klic-muted " />
                    <span>연결</span>
                  </button>

                  <button
                    onClick={() => setActiveDocsItem(item)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-klic-muted hover:text-zinc-900  transition cursor-pointer"
                  >
                    <span>문서</span>
                    <ArrowUpRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 4. Modal: Manage Connection                                  */}
      {/* ============================================================ */}
      {activeManageItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-klic-inverse/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white  rounded-2xl border border-zinc-200  shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-zinc-100 ">
              <div className="flex items-center gap-3">
                {renderBrandLogo(activeManageItem.brandKey, 32)}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 ">
                    {activeManageItem.name} 연동 관리
                  </h3>
                  <p className="text-[11px] text-klic-muted">
                    {activeManageItem.categoryLabel} · {activeManageItem.statusLabel}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveManageItem(null);
                  setPingSuccess(null);
                }}
                className="text-klic-muted hover:text-klic-muted  cursor-pointer p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="my-4 space-y-4 text-xs">
              {/* Webhook Endpoint */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700  mb-1">
                  수신 웹훅 엔드포인트 URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={activeManageItem.webhookUrl || 'https://api.payvora.com/v1/webhooks/live'}
                    className="flex-1 px-3 py-2 text-xs font-mono bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-700  select-all"
                  />
                  <button
                    onClick={() =>
                      handleCopy(
                        activeManageItem.webhookUrl || '',
                        activeManageItem.id
                      )
                    }
                    className="p-2 bg-zinc-100  hover:bg-zinc-200  rounded-xl transition cursor-pointer"
                    title="복사"
                  >
                    {copiedKey === activeManageItem.id ? (
                      <Check size={15} className="text-blue-500" />
                    ) : (
                      <Copy size={15} className="text-klic-muted" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sync interval & Ping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700  mb-1">
                    동기화 폴링 주기
                  </label>
                  <select
                    defaultValue={activeManageItem.syncInterval || '5분'}
                    className="w-full px-3 py-2 text-xs bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden cursor-pointer"
                  >
                    <option value="1분">1분 (실시간 결제)</option>
                    <option value="5분">5분 (권장 기본값)</option>
                    <option value="15분">15분</option>
                    <option value="1시간">1시간</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700  mb-1">
                    연결 상태 테스트
                  </label>
                  <button
                    type="button"
                    onClick={handlePingWebhook}
                    disabled={isPinging}
                    className="w-full py-2 px-3 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200   text-zinc-800  rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <RefreshCw
                      size={13}
                      className={isPinging ? 'animate-spin' : ''}
                    />
                    <span>{isPinging ? '핑 테스트 중...' : '웹훅 핑(Ping) 전송'}</span>
                  </button>
                </div>
              </div>

              {pingSuccess && (
                <div className="p-3 rounded-xl bg-blue-50  text-blue-800  border border-blue-200/80  flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                  <span>
                    상태 200 OK — 응답 지연 42ms. 정상 통신을 확인했습니다.
                  </span>
                </div>
              )}

              {/* Advanced toggles */}
              <div className="pt-2 border-t border-zinc-100  flex items-center justify-between">
                <div>
                  <p className="font-semibold text-zinc-800 ">
                    동기화 일시 중단
                  </p>
                  <p className="text-[11px] text-klic-muted">
                    새로운 이벤트 수신을 잠시 보류합니다.
                  </p>
                </div>
                <button
                  onClick={() => handleTogglePause(activeManageItem)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200  text-xs font-medium hover:bg-zinc-100  cursor-pointer"
                >
                  {activeManageItem.status === 'paused' ? '동기화 재개' : '일시 중지'}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-100 ">
              <button
                type="button"
                onClick={() => handleDisconnect(activeManageItem)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50  rounded-lg transition cursor-pointer"
              >
                <Trash2 size={13} />
                <span>연동 해제</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveManageItem(null);
                  setPingSuccess(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200    rounded-xl transition cursor-pointer"
              >
                완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. Modal: Connect New Service                                */}
      {/* ============================================================ */}
      {activeConnectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-klic-inverse/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white  rounded-2xl border border-zinc-200  shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-zinc-100 ">
              <div className="flex items-center gap-3">
                {renderBrandLogo(activeConnectItem.brandKey, 34)}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 ">
                    {activeConnectItem.name} 연동 설정
                  </h3>
                  <p className="text-[11px] text-klic-muted">
                    {activeConnectItem.categoryLabel}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveConnectItem(null)}
                className="text-klic-muted hover:text-klic-muted cursor-pointer p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleExecuteConnect} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700  mb-1">
                  연동 환경 선택
                </label>
                <div className="grid grid-cols-2 p-0.5 bg-zinc-100  rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setConnectEnv('live')}
                    className={`py-1.5 rounded-lg font-medium text-center transition cursor-pointer ${
                      connectEnv === 'live'
                        ? 'bg-white  text-zinc-900  shadow-2xs font-semibold'
                        : 'text-klic-muted'
                    }`}
                  >
                    운영 환경
                  </button>
                  <button
                    type="button"
                    onClick={() => setConnectEnv('test')}
                    className={`py-1.5 rounded-lg font-medium text-center transition cursor-pointer ${
                      connectEnv === 'test'
                        ? 'bg-white  text-zinc-900  shadow-2xs font-semibold'
                        : 'text-klic-muted'
                    }`}
                  >
                    테스트 환경
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700  mb-1">
                  API 키 또는 클라이언트 비밀 키
                </label>
                <input
                  type="password"
                  required
                  placeholder={`${activeConnectItem.brandKey}_secret_key_...`}
                  value={connectApiKey}
                  onChange={(e) => setConnectApiKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden"
                />
                <p className="text-[11px] text-klic-muted mt-1">
                  모든 자격 증명은 AES-256 규격으로 암호화 저장되며 기본 읽기 전용으로 안전하게 연결됩니다.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50  text-blue-800  border border-blue-200/80  text-xs">
                <p className="font-semibold mb-1">OAuth 간편 연동 가능</p>
                <p className="text-[11px]">
                  수동 키 입력 대신 {activeConnectItem.name} 계정으로 로그인하여 즉시 인증할 수도 있습니다.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 ">
                <button
                  type="button"
                  onClick={() => setActiveConnectItem(null)}
                  className="px-4 py-2 text-xs font-medium text-klic-muted  hover:text-zinc-900 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-klic-on-emphasis bg-klic-inverse hover:bg-klic-inverse    rounded-xl transition shadow-xs cursor-pointer"
                >
                  연동 활성화하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. Modal: Request Integration                                */}
      {/* ============================================================ */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-klic-inverse/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white  rounded-2xl border border-zinc-200  shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 ">
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 ">
                새 연동 서비스 요청
              </h3>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="text-klic-muted hover:text-klic-muted cursor-pointer p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-zinc-700  mb-1">
                  희망 서비스 명
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 토스페이먼츠 (Toss Payments), 카카오페이, Notion"
                  value={reqServiceName}
                  onChange={(e) => setReqServiceName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700  mb-1">
                  서비스 분류
                </label>
                <select
                  value={reqServiceCategory}
                  onChange={(e) => setReqServiceCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden"
                >
                  <option value="결제 대행 (Processor)">결제 대행</option>
                  <option value="국내 간편결제 (Easy Pay)">국내 간편결제</option>
                  <option value="커머스 / ERP">커머스 / ERP</option>
                  <option value="회계 / 세무">회계 / 세무</option>
                  <option value="메신저 / 협업 툴">메신저 / 협업 툴</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700  mb-1">
                  필요한 사유 및 활용 계획
                </label>
                <textarea
                  rows={3}
                  placeholder="어떤 비즈니스 시나리오에서 이 연동이 필요한지 간단히 설명해주세요."
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 ">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-klic-muted  hover:text-zinc-900 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-klic-on-emphasis bg-klic-inverse hover:bg-klic-inverse   rounded-xl transition cursor-pointer"
                >
                  요청 등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. Modal: Add Custom Integration                             */}
      {/* ============================================================ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-klic-inverse/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white  rounded-2xl border border-zinc-200  shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 ">
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 ">
                커스텀 웹훅 / 게이트웨이 연동 추가
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-klic-muted hover:text-klic-muted cursor-pointer p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCustomSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-zinc-700  mb-1">
                  연동 이름
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 사내 결제 승인 게이트웨이"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700  mb-1">
                  분류
                </label>
                <select
                  value={customCategory}
                  onChange={(e) =>
                    setCustomCategory(e.target.value as IntegrationCategoryKey)
                  }
                  className="w-full px-3 py-2 text-xs bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden"
                >
                  <option value="processors">결제 대행</option>
                  <option value="commerce">커머스</option>
                  <option value="accounting">회계</option>
                  <option value="alerts">알림</option>
                  <option value="automation">자동화</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700  mb-1">
                  대상 웹훅 엔드포인트 URL
                </label>
                <input
                  type="url"
                  placeholder="https://api.internal.com/events/v1"
                  value={customEndpoint}
                  onChange={(e) => setCustomEndpoint(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-zinc-50  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 ">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-klic-muted  hover:text-zinc-900 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-klic-on-emphasis bg-klic-inverse hover:bg-klic-inverse   rounded-xl transition cursor-pointer"
                >
                  연동 생성하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 8. Modal: Docs Preview                                       */}
      {/* ============================================================ */}
      {activeDocsItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-klic-inverse/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white  rounded-2xl border border-zinc-200  shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 ">
              <div className="flex items-center gap-3">
                {renderBrandLogo(activeDocsItem.brandKey, 32)}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 ">
                    {activeDocsItem.name} 연동 개발자 가이드
                  </h3>
                  <p className="text-[11px] text-klic-muted">
                    웹훅 서명 및 페이로드 참고 문서
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveDocsItem(null)}
                className="text-klic-muted hover:text-klic-muted cursor-pointer p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="my-4 space-y-4 text-xs">
              <div>
                <h4 className="font-semibold text-zinc-800  mb-1">
                  1. HMAC 서명 검증
                </h4>
                <p className="text-klic-muted text-[11px] mb-2">
                  수신된 모든 웹훅 요청 헤더의 <code className="bg-zinc-100  px-1 py-0.5 rounded">X-Signature-SHA256</code> 값을 검증하여 위변조를 방지하세요.
                </p>
                <div className="p-3 rounded-xl bg-klic-inverse text-klic-on-emphasis font-mono text-[11px] overflow-x-auto">
                  <code>{`// Webhook signature validation example
const crypto = require('crypto');
const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
const digest = hmac.update(rawBody).digest('hex');
if (digest !== req.headers['x-signature-sha256']) {
  throw new Error('Invalid signature');
}`}</code>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-zinc-800  mb-1">
                  2. 지원 이벤트 스키마
                </h4>
                <div className="p-3 rounded-xl bg-zinc-50  border border-zinc-200  text-[11px] space-y-1">
                  <p className="font-mono text-blue-600  font-semibold">
                    • payment.charge.succeeded
                  </p>
                  <p className="font-mono text-klic-muted ">
                    • payment.refund.created
                  </p>
                  <p className="font-mono text-amber-600  font-semibold">
                    • dispute.opened
                  </p>
                  <p className="font-mono text-klic-muted ">
                    • payout.paid
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-100 ">
              <div className="min-w-0 max-w-[70%] text-xs text-klic-muted">
                <span className="block font-semibold">참고 문서 주소 · 데모에서 이동하지 않습니다</span>
                <span className="block break-all mt-1">{activeDocsItem.docsUrl || '문서 주소 없음'}</span>
              </div>

              <button
                onClick={() => setActiveDocsItem(null)}
                className="px-4 py-2 text-xs font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200   rounded-xl cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 9. Modal: Live Event Stream                                 */}
      {/* ============================================================ */}
      {isHealthDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-klic-inverse/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white  rounded-2xl border border-zinc-200  shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 ">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-blue-500" />
                <h3 className="text-sm sm:text-base font-bold text-zinc-900 ">
                  실시간 웹훅 수신 이벤트 스트림 (최근 24시간)
                </h3>
              </div>
              <button
                onClick={() => setIsHealthDetailOpen(false)}
                className="text-klic-muted hover:text-klic-muted cursor-pointer p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="my-4 space-y-2 max-h-[55vh] overflow-y-auto pr-1 text-xs">
              {[
                { time: '10초 전', svc: 'Stripe', event: 'charge.succeeded', id: 'ch_3Pf8k2L01', status: '200 OK' },
                { time: '35초 전', svc: 'Shopify', event: 'orders/create', id: 'ord_994101', status: '200 OK' },
                { time: '1분 전', svc: 'Adyen', event: 'AUTHORISATION', id: 'ady_88204b', status: '200 OK' },
                { time: '2분 전', svc: 'PayPal', event: 'PAYMENT.CAPTURE.COMPLETED', id: 'cap_5101a', status: '200 OK' },
                { time: '4분 전', svc: 'Klarna', event: 'order.completed', id: 'kln_12093', status: '200 OK' },
                { time: '8분 전', svc: 'Stripe', event: 'payment_intent.created', id: 'pi_3Pf8k00', status: '200 OK' },
              ].map((log, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50  border border-zinc-100 "
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span className="font-semibold text-zinc-900 ">
                      {log.svc}
                    </span>
                    <span className="font-mono text-klic-muted  bg-zinc-200/70  px-1.5 py-0.5 rounded text-[11px]">
                      {log.event}
                    </span>
                    <span className="font-mono text-klic-muted text-[11px] hidden sm:inline">
                      {log.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-klic-muted">{log.time}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100  text-blue-700 ">
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-zinc-100 ">
              <button
                onClick={() => setIsHealthDetailOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200   rounded-xl cursor-pointer"
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
