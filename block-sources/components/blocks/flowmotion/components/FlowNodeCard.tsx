import React from 'react';
import {
  Share2,
  GitBranch,
  Database,
  Zap,
  Mail,
  ShieldAlert,
  CreditCard,
  Truck,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Minus,
  Loader2,
} from 'lucide-react';
import {
  FlowNodeData,
  LiveNodeRuntimeState,
  NodeIconType,
  NODE_WIDTH,
  NODE_HEIGHT,
  PORT_OFFSET_Y,
} from '../utils/flowEngine';

interface FlowNodeCardProps {
  node: FlowNodeData;
  runtime: LiveNodeRuntimeState;
  isSelected: boolean;
  hasIncomingEdge: boolean;
  onSelect: (nodeId: string) => void;
  onStartDrag: (nodeId: string, e: React.PointerEvent<HTMLDivElement>) => void;
}

function renderNodeIcon(icon: NodeIconType) {
  const props = { className: 'w-[18px] h-[18px] stroke-[1.9]' };
  switch (icon) {
    case 'webhook':
      return <Share2 {...props} />;
    case 'branch':
      return <GitBranch {...props} />;
    case 'database':
      return <Database {...props} />;
    case 'zap':
      return <Zap {...props} />;
    case 'mail':
      return <Mail {...props} />;
    case 'shield':
      return <ShieldAlert {...props} />;
    case 'credit-card':
      return <CreditCard {...props} />;
    case 'truck':
      return <Truck {...props} />;
    case 'message':
      return <MessageSquare {...props} />;
    default:
      return <Zap {...props} />;
  }
}

function AvatarPortrait({ type }: { type: 'female' | 'male' }) {
  if (type === 'female') {
    return (
      <svg
        viewBox="0 0 36 36"
        className="w-[22px] h-[22px] rounded-full shrink-0 border border-[var(--fm-control-border)] bg-[var(--fm-border)]"
        aria-hidden="true"
      >
        <rect width="36" height="36" fill="var(--fm-control-border)" />
        <path d="M6 36 C6 25 30 25 30 36" fill="var(--fm-text)" />
        <circle cx="18" cy="14.5" r="6.8" fill="var(--fm-panel)" />
        <path
          d="M10.5 16 C10.5 8 25.5 8 25.5 16 C26.5 21 26 26 24 27 C24 20 22 14 18 14 C14 14 12 20 12 27 C10 26 9.5 21 10.5 16 Z"
          fill="var(--fm-text)"
        />
        <circle cx="15.8" cy="15" r="0.9" fill="var(--fm-text)" />
        <circle cx="20.2" cy="15" r="0.9" fill="var(--fm-text)" />
        <path d="M16.5 18.2 Q18 19.4 19.5 18.2" stroke="var(--fm-warning)" strokeWidth="1" fill="none" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 36 36"
      className="w-[22px] h-[22px] rounded-full shrink-0 border border-[var(--fm-control-border)] bg-[var(--fm-border)]"
      aria-hidden="true"
    >
      <rect width="36" height="36" fill="var(--fm-control-border)" />
      <path d="M5 36 C5 24.5 31 24.5 31 36" fill="var(--fm-text)" />
      <circle cx="18" cy="14.5" r="6.8" fill="var(--fm-panel)" />
      <path
        d="M11 13.5 C11 8 25 8 25 13.5 C24 10.5 19 10 15 11 C13 11.5 11.5 12.5 11 13.5 Z"
        fill="var(--fm-text)"
      />
      <circle cx="15.6" cy="14.8" r="0.95" fill="var(--fm-text)" />
      <circle cx="20.4" cy="14.8" r="0.95" fill="var(--fm-text)" />
      <rect x="13.8" y="13.3" width="3.6" height="2.6" rx="0.8" stroke="var(--fm-text)" strokeWidth="0.8" fill="none" />
      <rect x="18.6" y="13.3" width="3.6" height="2.6" rx="0.8" stroke="var(--fm-text)" strokeWidth="0.8" fill="none" />
      <line x1="17.4" y1="14.5" x2="18.6" y2="14.5" stroke="var(--fm-text)" strokeWidth="0.8" />
      <path d="M16.5 18.2 Q18 19.1 19.5 18.2" stroke="var(--fm-warning)" strokeWidth="1" fill="none" />
    </svg>
  );
}

export const FlowNodeCard: React.FC<FlowNodeCardProps> = ({
  node,
  runtime,
  isSelected,
  hasIncomingEdge,
  onSelect,
  onStartDrag,
}) => {
  const { status, durationLabel, isExecutingNow, highlightBorder } = runtime;

  const isDarkBorder = isSelected || highlightBorder;

  const renderStatusBadge = () => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-[12px] font-semibold bg-[var(--fm-panel)] border border-[var(--fm-selected)] text-[var(--fm-accent)] whitespace-nowrap shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" />
            <span>성공</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-[12px] font-semibold bg-[var(--fm-panel)] border border-[var(--fm-danger)] text-[var(--fm-danger)] whitespace-nowrap shrink-0">
            <XCircle className="w-3.5 h-3.5 stroke-[2]" />
            <span>실패</span>
          </span>
        );
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-[12px] font-semibold bg-[var(--fm-selected)] border border-[var(--fm-accent)] text-[var(--fm-accent-hover)] whitespace-nowrap shrink-0">
            <Loader2 className="w-3.5 h-3.5 stroke-[2] animate-spin" />
            <span>실행 중</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-[12px] font-semibold bg-[var(--fm-soft)] border border-[var(--fm-border)] text-[var(--fm-text)] whitespace-nowrap shrink-0">
            <Clock className="w-3.5 h-3.5 stroke-[1.8] text-[var(--fm-muted)]" />
            <span>대기 중</span>
          </span>
        );
      case 'skipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-[12px] font-semibold bg-[var(--fm-soft)] border border-[var(--fm-border)] text-[var(--fm-muted)] whitespace-nowrap shrink-0">
            <Minus className="w-3.5 h-3.5 stroke-[2] text-[var(--fm-muted)]" />
            <span>건너뜀</span>
          </span>
        );
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${node.title} 노드 (${status})`}
      aria-pressed={isSelected}
      data-testid={`flow-node-${node.id}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(node.id);
        }
      }}
      onPointerDown={(e) => onStartDrag(node.id, e)}
      style={{
        width: `${NODE_WIDTH}px`,
        height: `${NODE_HEIGHT}px`,
        transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
      }}
      className={`absolute left-0 top-0 rounded-[16px] bg-[var(--fm-panel)] px-[18px] pt-[18px] pb-[14px] flex flex-col justify-between select-none cursor-grab active:cursor-grabbing transition-[border-color,box-shadow] duration-150 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fm-accent)] ${
        isExecutingNow
          ? 'border-[1.5px] border-[var(--fm-accent)] shadow-[0_0_0_4px_color-mix(in_srgb,var(--fm-accent)_12%,transparent)]'
          : isDarkBorder
          ? 'border-[1.5px] border-[var(--fm-text)] shadow-[0_6px_18px_-4px_color-mix(in_srgb,var(--fm-text)_8%,transparent)]'
          : 'border border-[var(--fm-border)] shadow-[0_2px_6px_color-mix(in_srgb,var(--fm-text)_3%,transparent)] hover:border-[var(--fm-control-border)]'
      }`}
    >
      {/* Left Input Port Dot */}
      {hasIncomingEdge && (
        <span
          style={{ top: `${PORT_OFFSET_Y}px` }}
          className="w-[7px] h-[7px] rounded-full bg-[var(--fm-accent)] absolute -left-[4px] -translate-y-1/2 pointer-events-none"
        />
      )}

      {/* Right Output Port Dot */}
      <span
        style={{ top: `${PORT_OFFSET_Y}px` }}
        className="w-[7px] h-[7px] rounded-full bg-[var(--fm-accent)] absolute -right-[4px] -translate-y-1/2 pointer-events-none"
      />

      {/* Top Section: Icon + Title & Subtitle */}
      <div className="flex items-start gap-3">
        <div
          className={`w-[38px] h-[38px] rounded-[11px] flex items-center justify-center shrink-0 ${
            node.isTrigger
              ? 'bg-[var(--fm-accent)] text-[var(--fm-on-accent)]'
              : 'bg-[var(--fm-surface)] text-[var(--fm-text)] border border-[var(--fm-border)]/60'
          }`}
        >
          {renderNodeIcon(node.icon)}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="text-[14px] font-bold text-[var(--fm-text)] leading-tight tracking-tight truncate">
            {node.title}
          </div>
          <div className="text-[12.5px] text-[var(--fm-muted)] mt-1 truncate">
            {node.subtitle}
          </div>
        </div>
      </div>

      {/* Bottom Section: Avatar + Duration & Status Pill */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 text-[12.5px] font-medium text-[var(--fm-text)] tabular-nums">
          <AvatarPortrait type={node.avatarType} />
          <span>{durationLabel}</span>
        </div>
        {renderStatusBadge()}
      </div>
    </div>
  );
};
