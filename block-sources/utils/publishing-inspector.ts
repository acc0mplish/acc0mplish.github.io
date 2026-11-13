export type PublishingValues = Partial<Record<'radius' | 'padding' | 'borderWidth', number>>;
export type PublishingMeasurements = Partial<Record<
  'outerWidth' | 'outerHeight' | 'contentWidth' | 'contentHeight' | 'scrollWidth' | 'scrollHeight' |
  'clientWidth' | 'clientHeight' | 'borderRadius' | 'borderTopWidth' | 'borderRightWidth' |
  'borderBottomWidth' | 'borderLeftWidth' | 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft',
  number
>>;

export interface PublishingBridgeMessage {
  type: 'klic:publishing-inspect' | 'klic:publishing-patch' | 'klic:publishing-dispose';
  itemId: string;
  sessionId: string;
  targetId: string;
  revision: number;
  values?: PublishingValues;
}

const TARGETS = Object.freeze({
  'sales-revenue': {itemId: 'dashboard-sales-analytics', selector: '.ks-revenue-panel'},
  'incident-report-title': {itemId: 'form-incident-report', selector: '[data-klic-publishing-target="incident-report-title"]'},
});
const RULES = Object.freeze({radius: [0, 24], padding: [0, 48], borderWidth: [0, 8]} as const);
const STYLE_PROPERTIES = Object.freeze({radius: 'border-radius', padding: 'padding', borderWidth: 'border-width'} as const);
const MEASUREMENT_KEYS = new Set<keyof PublishingMeasurements>([
  'outerWidth', 'outerHeight', 'contentWidth', 'contentHeight', 'scrollWidth', 'scrollHeight',
  'clientWidth', 'clientHeight', 'borderRadius', 'borderTopWidth', 'borderRightWidth',
  'borderBottomWidth', 'borderLeftWidth', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value) &&
  (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);

export function normalizePublishingValues(value: unknown): PublishingValues {
  if (!isRecord(value)) throw new TypeError('Publishing values must be a plain object');
  const normalized: PublishingValues = {};
  for (const [key, raw] of Object.entries(value)) {
    if (!Object.hasOwn(RULES, key)) throw new TypeError(`Unsupported publishing value: ${key}`);
    const [min, max] = RULES[key as keyof typeof RULES];
    if (typeof raw !== 'number' || !Number.isInteger(raw) || raw < min || raw > max) {
      throw new TypeError(`${key} must be an integer from ${min} to ${max}`);
    }
    normalized[key as keyof PublishingValues] = raw;
  }
  return normalized;
}

export function isPublishingBridgeMessage(value: unknown, itemId?: string): value is PublishingBridgeMessage {
  if (!isRecord(value) || typeof value.targetId !== 'string' || !Object.hasOwn(TARGETS, value.targetId)) return false;
  const target = TARGETS[value.targetId as keyof typeof TARGETS];
  if (value.itemId !== target.itemId || (itemId !== undefined && value.itemId !== itemId) ||
      !['klic:publishing-inspect', 'klic:publishing-patch', 'klic:publishing-dispose'].includes(String(value.type)) ||
      typeof value.sessionId !== 'string' || !/^[a-z0-9-]{8,80}$/.test(value.sessionId) ||
      !Number.isInteger(value.revision) || Number(value.revision) < 0) return false;
  try {
    if (JSON.stringify(value).length > 8192) return false;
    if (value.type !== 'klic:publishing-dispose') normalizePublishingValues(value.values ?? {});
  } catch { return false; }
  return true;
}

function readMeasurements(element: HTMLElement): PublishingMeasurements {
  const view = element.ownerDocument.defaultView;
  if (!view) return {};
  const style = view.getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  const px = (value: string) => Math.max(0, Number.parseFloat(value) || 0);
  const borderTopWidth = px(style.borderTopWidth), borderRightWidth = px(style.borderRightWidth);
  const borderBottomWidth = px(style.borderBottomWidth), borderLeftWidth = px(style.borderLeftWidth);
  const paddingTop = px(style.paddingTop), paddingRight = px(style.paddingRight);
  const paddingBottom = px(style.paddingBottom), paddingLeft = px(style.paddingLeft);
  return {
    outerWidth: rect.width,
    outerHeight: rect.height,
    contentWidth: Math.max(0, rect.width - borderLeftWidth - borderRightWidth - paddingLeft - paddingRight),
    contentHeight: Math.max(0, rect.height - borderTopWidth - borderBottomWidth - paddingTop - paddingBottom),
    scrollWidth: element.scrollWidth,
    scrollHeight: element.scrollHeight,
    clientWidth: element.clientWidth,
    clientHeight: element.clientHeight,
    borderRadius: px(style.borderTopLeftRadius),
    borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth,
    paddingTop, paddingRight, paddingBottom, paddingLeft,
  };
}

/** Validates a parent command and applies only the sales chart panel's registered geometry. */
export function createPublishingInspector(root: HTMLElement, itemId = 'dashboard-sales-analytics', post: (message: object) => void = () => {}) {
  let active: {sessionId: string; targetId: string; revision: number; values: PublishingValues} | null = null;
  let target: HTMLElement | null = null;
  let baseline: Map<string, {value: string; priority: string}> | null = null;
  let observer: MutationObserver | null = null;
  let sizeObserver: ResizeObserver | null = null;
  let frame = 0;
  let disposed = false;

  const restore = () => {
    if (!target?.style || !baseline) return;
    for (const property of Object.values(STYLE_PROPERTIES)) {
      const saved = baseline.get(property);
      if (saved?.value) target.style.setProperty(property, saved.value, saved.priority);
      else target.style.removeProperty(property);
    }
  };

  const apply = () => {
    if (!target?.style || !active) return;
    for (const [key, property] of Object.entries(STYLE_PROPERTIES)) {
      const value = active.values[key as keyof PublishingValues];
      if (value === undefined) {
        const saved = baseline?.get(property);
        if (saved?.value) target.style.setProperty(property, saved.value, saved.priority);
        else target.style.removeProperty(property);
      } else target.style.setProperty(property, `${value}px`);
    }
  };

  const sendSnapshot = () => {
    frame = 0;
    if (disposed || !active) return;
    const measurements = target ? readMeasurements(target) : {};
    if (Object.keys(measurements).some(key => !MEASUREMENT_KEYS.has(key as keyof PublishingMeasurements))) return;
    post({type: 'klic:publishing-snapshot', itemId, sessionId: active.sessionId, targetId: active.targetId,
      revision: active.revision, values: {...active.values}, measurements});
  };

  const scheduleSnapshot = () => {
    if (disposed || frame || !active) return;
    frame = root.ownerDocument.defaultView?.requestAnimationFrame(sendSnapshot) || 0;
    if (!frame) sendSnapshot();
  };

  const refreshTarget = () => {
    if (disposed || !active) return;
    const selector = active && TARGETS[active.targetId as keyof typeof TARGETS]?.selector;
    if (!selector) return;
    const next = root.querySelector<HTMLElement>(selector);
    if (next !== target) {
      restore();
      sizeObserver?.disconnect();
      sizeObserver = null;
      target = next;
      baseline = target ? new Map<string, {value: string; priority: string}>(Object.values(STYLE_PROPERTIES).map(property => [property, {
        value: target!.style.getPropertyValue(property), priority: target!.style.getPropertyPriority(property),
      }] as const)) : null;
      const ResizeObserverConstructor = root.ownerDocument.defaultView?.ResizeObserver;
      if (target && ResizeObserverConstructor) {
        sizeObserver = new ResizeObserverConstructor(scheduleSnapshot);
        sizeObserver.observe(target);
      }
      apply();
    }
    scheduleSnapshot();
  };

  const receive = (raw: unknown) => {
    if (disposed || !isPublishingBridgeMessage(raw, itemId)) return false;
    const message = raw as PublishingBridgeMessage;
    if (message.type === 'klic:publishing-inspect') {
      if (active && active.sessionId !== message.sessionId) restore();
      if (active?.sessionId === message.sessionId && message.revision < active.revision) return false;
      active = {sessionId: message.sessionId, targetId: message.targetId, revision: message.revision,
        values: normalizePublishingValues(message.values ?? {})};
      apply();
      if (!observer) {
        observer = new MutationObserver(refreshTarget);
        observer.observe(root, {childList: true, subtree: true});
      }
      refreshTarget();
      return true;
    }
    if (!active || active.sessionId !== message.sessionId || active.targetId !== message.targetId ||
        (message.type === 'klic:publishing-dispose' ? message.revision < active.revision : message.revision <= active.revision)) return false;
    if (message.type === 'klic:publishing-dispose') {
      restore(); target = null; baseline = null; active = null;
      observer?.disconnect(); observer = null;
      sizeObserver?.disconnect(); sizeObserver = null;
      if (frame) root.ownerDocument.defaultView?.cancelAnimationFrame(frame);
      frame = 0;
      return true;
    }
    active = {...active, revision: message.revision, values: normalizePublishingValues(message.values ?? {})};
    apply();
    scheduleSnapshot();
    return true;
  };

  return Object.freeze({receive, refresh: refreshTarget, dispose() {
    if (disposed) return;
    restore();
    disposed = true;
    observer?.disconnect();
    observer = null;
    sizeObserver?.disconnect();
    sizeObserver = null;
    if (frame) root.ownerDocument.defaultView?.cancelAnimationFrame(frame);
    frame = 0;
    active = null; target = null; baseline = null;
  }});
}
