import {evaluatePublishingGuidance} from './publishing-model.mjs';
import {getPublishingTarget} from './publishing-targets.mjs';

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

const guideActions = new Set(['disable-optical-floor', 'reduce-padding']);
const activeGuideFactIds = new Set(['active-control', 'value-change', 'next-step']);

function checkedRect(rect, name) {
  if (!rect || !['left', 'top', 'width', 'height'].every(key => Number.isFinite(rect[key])) || rect.width < 0 || rect.height < 0) {
    throw new TypeError(`${name} must have finite left, top, width and height`);
  }
}

/** Project a target's viewport rect through a CSS-scaled, same-origin iframe. */
export function projectPublishingRect(targetRect, frameRect, frameViewport) {
  checkedRect(targetRect, 'targetRect');
  checkedRect(frameRect, 'frameRect');
  if (!frameViewport || !Number.isFinite(frameViewport.width) || !Number.isFinite(frameViewport.height) ||
      frameViewport.width <= 0 || frameViewport.height <= 0) {
    throw new TypeError('frameViewport must have positive finite dimensions');
  }
  const scaleX = frameRect.width / frameViewport.width;
  const scaleY = frameRect.height / frameViewport.height;
  return {
    left: Number((frameRect.left + targetRect.left * scaleX).toFixed(2)),
    top: Number((frameRect.top + targetRect.top * scaleY).toFixed(2)),
    width: Number((targetRect.width * scaleX).toFixed(2)),
    height: Number((targetRect.height * scaleY).toFixed(2)),
  };
}

export function renderPublishingGuideMarkup({targetId = '', pinned = false, canUndo = false, hasOverrides = false, facts = [], notices = [], compact = false} = {}) {
  const renderFacts = items => items.map(fact => `<div class="publishing-guide__fact" data-guide-fact="${escapeHTML(fact.id)}"><dt>${escapeHTML(fact.label)}</dt><dd>${escapeHTML(fact.value)}</dd></div>`).join('');
  const renderNotices = items => items.map(notice => `<article class="publishing-guide__notice" data-guide-notice="${escapeHTML(notice.id)}" data-tone="${escapeHTML(notice.kind)}"><h4>${escapeHTML(notice.title)}</h4><p>${escapeHTML(notice.reason)}</p>${guideActions.has(notice.actionId) ? `<button type="button" class="publishing-guide__action" data-publishing-action="${escapeHTML(notice.actionId)}">이 조작 적용</button>` : ''}</article>`).join('');
  const activeSummary = compact ? `<section class="publishing-guide__active-summary" aria-label="변경 항목 안내"><p class="publishing-guide__active-empty" data-guide-active-empty>항목을 바꾸면 변화와 다음 확인을 여기에 표시합니다.</p><dl class="publishing-guide__active-facts" data-guide-active-facts>${renderFacts(facts.filter(fact => activeGuideFactIds.has(fact.id)))}</dl><div class="publishing-guide__priority-notices" data-guide-priority-notices></div></section>` : '';
  const details = compact ? `<details class="publishing-guide__details"><summary>실제 측정값과 추가 설명 펼치기</summary><dl class="publishing-guide__facts" data-guide-facts>${renderFacts(facts.filter(fact => !activeGuideFactIds.has(fact.id)))}</dl><div class="publishing-guide__notices" data-guide-notices>${renderNotices(notices)}</div></details>` : `<dl class="publishing-guide__facts" data-guide-facts>${renderFacts(facts)}</dl><div class="publishing-guide__notices" data-guide-notices>${renderNotices(notices)}</div>`;
  return `<aside class="publishing-guide${compact ? ' publishing-guide--compact' : ''}" data-publishing-guide="${escapeHTML(targetId)}" role="region" aria-label="조작 안내"><header class="publishing-guide__header"><div><span class="publishing-guide__eyebrow">현재 target</span><strong data-guide-target>${escapeHTML(targetId)}</strong></div><button type="button" class="publishing-guide__pin" data-publishing-pin aria-pressed="${Boolean(pinned)}">${pinned ? '선택 고정' : '선택 고정하기'}</button></header><div class="publishing-guide__edit-actions"><button type="button" data-publishing-undo ${canUndo ? '' : 'disabled'}>직전 조작 되돌리기</button><button type="button" data-publishing-clear ${hasOverrides ? '' : 'disabled'}>실험값 초기화</button></div><p class="publishing-guide__state" data-guide-state aria-live="polite" aria-atomic="true"></p>${activeSummary}${details}<span class="publishing-guide__overlay" data-guide-overlay hidden aria-hidden="true"><span data-guide-overlay-label></span></span></aside>`;
}

function activeControlFromPath(path, target) {
  for (const node of path) {
    if (!node?.getAttribute) continue;
    const control = node.getAttribute('data-publishing-control');
    if (control && Object.hasOwn(target.controls, control)) return control;
    const previewField = node.getAttribute('data-preview-field');
    if (previewField && Object.hasOwn(target.controls, previewField)) return previewField;
  }
  return null;
}

/** Mount one guide view. The owner resolves the active target inside its scope. */
export function mountPublishingGuide(root, {
  getSnapshot,
  getTargetElement = () => null,
  compact = false,
  onApply = () => {},
  onUndo = () => {},
  onClear = () => {},
  onTargetSelect = () => {},
  targetIds = () => [],
} = {}) {
  if (!root?.ownerDocument || typeof getSnapshot !== 'function') throw new TypeError('Guide root and getSnapshot are required');
  const document = root.ownerDocument;
  const initialSnapshot = getSnapshot();
  root.insertAdjacentHTML('beforeend', renderPublishingGuideMarkup({
    targetId: initialSnapshot?.targetId,
    canUndo: initialSnapshot?.canUndo,
    hasOverrides: initialSnapshot && Object.keys(initialSnapshot.values || {}).length > 0,
    compact,
  }));
  const panel = root.querySelector('[data-publishing-guide]');
  const overlay = panel.querySelector('[data-guide-overlay]');
  const overlayLabel = panel.querySelector('[data-guide-overlay-label]');
  const stateNode = panel.querySelector('[data-guide-state]');
  const controller = new AbortController();
  const {signal} = controller;
  let currentTarget = '';
  let pinned = false;
  let disposed = false;
  let raf = 0;
  const observedElements = new WeakSet();
  const observedDocuments = new WeakSet();
  const observedInteractionDocuments = new WeakSet();
  const observedWindows = new WeakSet();
  const resizeObservers = new Map();
  const observers = [];
  const availableTargets = () => [...new Set(targetIds() || [])];

  function snapshotFor(targetId, activeControl) {
    const raw = getSnapshot(targetId);
    if (!raw || raw.targetId !== targetId) return null;
    return evaluatePublishingGuidance({...raw, activeControl});
  }

  function targetAndDocument() {
    if (!currentTarget || disposed) return null;
    const target = getPublishingTarget(currentTarget);
    if (!target) return null;
    const element = getTargetElement(currentTarget);
    return element?.ownerDocument ? {target, element, document: element.ownerDocument} : null;
  }

  function drawOverlay() {
    raf = 0;
    const found = targetAndDocument();
    if (!found) { overlay.hidden = true; return; }
    const rect = found.element.getBoundingClientRect();
    let projected;
    if (found.document === document) projected = {left: rect.left, top: rect.top, width: rect.width, height: rect.height};
    else {
      try {
        const frame = found.document.defaultView?.frameElement;
        const viewport = found.document.defaultView;
        if (!frame || frame.contentDocument !== found.document || frame.ownerDocument !== document) { overlay.hidden = true; return; }
        projected = projectPublishingRect(rect, frame.getBoundingClientRect(), {width: viewport.innerWidth, height: viewport.innerHeight});
      } catch { overlay.hidden = true; return; }
    }
    overlay.hidden = false;
    overlay.style.left = `${projected.left}px`;
    overlay.style.top = `${projected.top}px`;
    overlay.style.width = `${projected.width}px`;
    overlay.style.height = `${projected.height}px`;
    const values = snapshotFor(currentTarget, null);
    const targetName = values?.facts.find(fact => fact.id === 'target-size')?.value;
    overlayLabel.textContent = `${currentTarget}${targetName ? ` · ${targetName}` : ''}`;
  }

  function scheduleOverlay() {
    if (!disposed && !raf) raf = document.defaultView.requestAnimationFrame(drawOverlay);
  }

  function observeCurrentTarget() {
    const found = targetAndDocument();
    if (!found) return;
    const win = found.document.defaultView;
    if (win?.ResizeObserver) {
      let resize = resizeObservers.get(win);
      if (!resize) {
        resize = new win.ResizeObserver(scheduleOverlay);
        resizeObservers.set(win, resize);
        observers.push(resize);
      }
      if (!observedElements.has(found.element)) {
        resize.observe(found.element);
        observedElements.add(found.element);
      }
      if (found.document !== document && win.frameElement && !observedElements.has(win.frameElement)) {
        resize.observe(win.frameElement);
        observedElements.add(win.frameElement);
      }
    }
    if (win?.MutationObserver && !observedDocuments.has(found.document)) {
      const mutation = new win.MutationObserver(scheduleOverlay);
      mutation.observe(found.document.documentElement, {subtree: true, childList: true, attributes: true, attributeFilter: ['style', 'class']});
      observers.push(mutation);
      observedDocuments.add(found.document);
    }
    if (found.document !== document && !observedInteractionDocuments.has(found.document)) {
      for (const type of ['pointerover', 'focusin', 'click']) {
        found.document.addEventListener(type, onInteraction, {signal, capture: true});
      }
      observedInteractionDocuments.add(found.document);
    }
    if (win && !observedWindows.has(win)) {
      win.addEventListener('scroll', scheduleOverlay, {signal, capture: true, passive: true});
      win.addEventListener('resize', scheduleOverlay, {signal, passive: true});
      observedWindows.add(win);
    }
  }

  function update({activeControl = null, announce = false, previousValues} = {}) {
    if (disposed) return null;
    const snapshot = getSnapshot(currentTarget || undefined);
    if (!snapshot || !getPublishingTarget(snapshot.targetId)) {
      currentTarget = '';
      overlay.hidden = true;
      return null;
    }
    currentTarget = snapshot.targetId;
    const result = evaluatePublishingGuidance({...snapshot, activeControl, ...(previousValues ? {previousValues} : {})});
    panel.dataset.publishingGuide = currentTarget;
    panel.querySelector('[data-guide-target]').textContent = currentTarget;
    const undoButton = panel.querySelector('[data-publishing-undo]');
    const clearButton = panel.querySelector('[data-publishing-clear]');
    undoButton.disabled = !snapshot.canUndo;
    clearButton.disabled = !Object.keys(snapshot.values || {}).length;
    panel.querySelector('[data-publishing-pin]').setAttribute('aria-pressed', String(pinned));
    panel.querySelector('[data-publishing-pin]').textContent = pinned ? '선택 고정' : '선택 고정하기';
    const renderFacts = facts => facts.map(fact => `<div class="publishing-guide__fact" data-guide-fact="${escapeHTML(fact.id)}"><dt>${escapeHTML(fact.label)}</dt><dd>${escapeHTML(fact.value)}</dd></div>`).join('');
    const renderNotices = notices => notices.map(notice => `<article class="publishing-guide__notice" data-guide-notice="${escapeHTML(notice.id)}" data-tone="${escapeHTML(notice.kind)}"><h4>${escapeHTML(notice.title)}</h4><p>${escapeHTML(notice.reason)}</p>${guideActions.has(notice.actionId) ? `<button type="button" class="publishing-guide__action" data-publishing-action="${escapeHTML(notice.actionId)}">이 조작 적용</button>` : ''}</article>`).join('');
    const activeFacts = result.facts.filter(fact => activeGuideFactIds.has(fact.id));
    if (compact) {
      panel.querySelector('[data-guide-active-facts]').innerHTML = renderFacts(activeFacts);
      panel.querySelector('[data-guide-active-empty]').hidden = activeFacts.length > 0;
      panel.querySelector('[data-guide-facts]').innerHTML = renderFacts(result.facts.filter(fact => !activeGuideFactIds.has(fact.id)));
      const priorityNotices = result.notices.filter(notice => notice.kind === 'warning' || notice.kind === 'advisory');
      panel.querySelector('[data-guide-priority-notices]').innerHTML = renderNotices(priorityNotices);
      panel.querySelector('[data-guide-notices]').innerHTML = renderNotices(result.notices.filter(notice => !priorityNotices.includes(notice)));
      panel.querySelector('.publishing-guide__details > summary').textContent = `세부 측정값 ${result.facts.length}개 · 참고 ${result.notices.length}개`;
    } else {
      panel.querySelector('[data-guide-facts]').innerHTML = renderFacts(result.facts);
      panel.querySelector('[data-guide-notices]').innerHTML = renderNotices(result.notices);
    }
    if (announce) stateNode.textContent = [currentTarget, ...result.facts.slice(0, compact ? 3 : 2).map(fact => `${fact.label} ${fact.value}`)].join('. ');
    observeCurrentTarget();
    scheduleOverlay();
    return result;
  }

  function onInteraction(event) {
    const path = event.composedPath?.() || [event.target];
    if (path.some(node => node === panel || node?.closest?.('[data-publishing-guide]'))) return;
    for (const targetId of availableTargets()) {
      const target = getPublishingTarget(targetId);
      const element = getTargetElement(targetId);
      if (!target || !element || !path.includes(element)) continue;
      if (pinned && targetId !== currentTarget) return;
      currentTarget = targetId;
      const control = activeControlFromPath(path, target);
      update({activeControl: control, announce: event.type === 'focusin' || event.type === 'click'});
      onTargetSelect(targetId, control);
      return;
    }
  }

  function click(event) {
    const pin = event.target.closest?.('[data-publishing-pin]');
    if (pin && panel.contains(pin)) {
      pinned = !pinned;
      update({announce: true});
      return;
    }
    const action = event.target.closest?.('[data-publishing-action]')?.dataset.publishingAction;
    if (guideActions.has(action)) onApply(action, currentTarget, getSnapshot(currentTarget)?.revision);
    if (event.target.closest?.('[data-publishing-undo]')) onUndo(currentTarget, getSnapshot(currentTarget)?.revision);
    if (event.target.closest?.('[data-publishing-clear]')) onClear(currentTarget, getSnapshot(currentTarget)?.revision);
  }

  document.addEventListener('pointerover', onInteraction, {signal, capture: true});
  document.addEventListener('focusin', onInteraction, {signal, capture: true});
  document.addEventListener('click', onInteraction, {signal, capture: true});
  panel.addEventListener('click', click, {signal});
  document.defaultView?.addEventListener('resize', scheduleOverlay, {signal, passive: true});
  document.defaultView?.addEventListener('scroll', scheduleOverlay, {signal, capture: true, passive: true});
  const fontsReady = document.fonts?.ready;
  if (fontsReady?.then) fontsReady.then(() => { if (!disposed) scheduleOverlay(); });

  update({announce: false});
  return {
    update,
    setPinned(value) { pinned = Boolean(value); return update({announce: true}); },
    destroy() {
      if (disposed) return;
      disposed = true;
      controller.abort();
      for (const observer of observers) observer.disconnect();
      if (raf) document.defaultView?.cancelAnimationFrame(raf);
      panel.remove();
    },
  };
}
