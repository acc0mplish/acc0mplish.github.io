import {FONT_IDS,fontFaceCSS} from '../../dist/font-registry.mjs';
/** SPDX-License-Identifier: Apache-2.0 */
import React, { Component, Suspense, useEffect, useState } from 'react';
import {isDeferredResizeNotice} from './utils/runtime-diagnostics';
import { createRoot } from 'react-dom/client';
import { createTokens, resolveTokens, formatValue } from '../../dist/tokens.mjs';
import { normalizePreferences, FONT_NAMES } from '../../dist/preferences.mjs';
import BlockApp, { BLOCK_IDS } from './BlockApp';
import './index.css';
import {materialStylesCSS} from '../../dist/materials.mjs';
const materialStyle=document.createElement('style');
materialStyle.dataset.klicMaterials='true';
materialStyle.textContent=materialStylesCSS();
document.head.append(materialStyle);

export interface BlockContext {
  theme: 'light' | 'dark';
  material?: 'flat' | 'glass' | 'solid-glass' | 'liquid-glass';
  colorTheme?: string;
  brand: 'a' | 'b';
  density: 'compact' | 'normal' | 'relaxed';
  font: string;
  headingFont?: string; accent?: string; neutral?: string; radius?: number; textScale?: number; chartPalette?: string; iconWeight?: string; showAvatars?: boolean; showProgressRings?: boolean; menuStyle?: string;
}
const DEFAULT_CONTEXT: BlockContext = { theme: 'light', brand: 'a', density: 'normal', font: 'paperlogy' };
const FONT_FAMILIES = FONT_NAMES;
const query = new URLSearchParams(location.search);
const requestedId = query.get('id') || '';
const selectedId = (BLOCK_IDS as readonly string[]).includes(requestedId) ? requestedId : '';
const parentOrigin = location.origin;

function installLocalFonts() {
  const stylesheet = document.createElement('style');
  stylesheet.dataset.klicFonts = 'local';
  stylesheet.textContent=fontFaceCSS(new URL('../fonts/',location.href).href);
  document.head.appendChild(stylesheet);
}


export function validContext(value: unknown): value is BlockContext {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.theme === 'string' && ['light', 'dark'].includes(v.theme) &&
    typeof v.brand === 'string' && ['a', 'b'].includes(v.brand) &&
    typeof v.density === 'string' && ['compact', 'normal', 'relaxed'].includes(v.density) &&
    typeof v.font === 'string' && FONT_IDS.includes(v.font);
}
function initialContext(): BlockContext {
  const supplied = Object.fromEntries(['theme', 'brand', 'density', 'font'].map(key => [key, query.get(key) || DEFAULT_CONTEXT[key as keyof BlockContext]]));
  const extra = Object.fromEntries([...query.entries()].map(([k,v])=>[k,['radius','textScale','uiScale'].includes(k)?Number(v):['showAvatars','showProgressRings','autoScale'].includes(k)?v==='true':v]));
  return { ...normalizePreferences(extra), ...(validContext(supplied) ? supplied : DEFAULT_CONTEXT) } as BlockContext;
}
function send(type: 'klic:block-ready' | 'klic:block-error', fields: Record<string, string>) {
  if (window.parent !== window) window.parent.postMessage({ type, ...fields }, parentOrigin);
}
function reportError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || 'Unknown runtime error');
  document.documentElement.dataset.klicRuntimeError = message.slice(0,1000);
  send('klic:block-error', { message: message.slice(0, 1000) });
}
function applyContext(context: BlockContext) {
  // Resolve primitive → brand → semantic → component aliases, then expose their CSS variables.
  const resolved = resolveTokens(createTokens(context.brand, context.theme,context));
  for (const [path, value] of Object.entries(resolved)) document.documentElement.style.setProperty(`--${path.replaceAll('.', '-')}`, formatValue(value));
  document.documentElement.dataset.theme = context.theme;
  document.documentElement.dataset.colorTheme = context.colorTheme || 'klic';
  document.documentElement.dataset.material = context.material || 'flat';
  document.documentElement.dataset.brand = context.brand;
  document.documentElement.dataset.density = context.density;
  document.documentElement.dataset.font = context.font;
  document.documentElement.dataset.chartPalette = context.chartPalette || 'theme';
  document.documentElement.dataset.menu = context.menuStyle || 'soft';
  document.documentElement.dataset.avatars = String(context.showAvatars !== false);
  document.documentElement.style.setProperty('--runtime-text-scale',String((context.textScale || 100)/100));
  document.documentElement.style.setProperty('--runtime-heading-font',`${FONT_NAMES[context.headingFont || context.font]},system-ui,sans-serif`);
  document.documentElement.style.setProperty('--runtime-radius',`${context.radius ?? 8}px`);
  document.documentElement.style.setProperty('--runtime-icon-stroke',String(({light:1.3,regular:1.8,bold:2.5})[context.iconWeight || 'regular']));
  document.documentElement.classList.toggle('dark', context.theme === 'dark');
  document.documentElement.style.colorScheme = context.theme;
  document.documentElement.style.setProperty('--runtime-font', `${FONT_FAMILIES[context.font]}, system-ui, sans-serif`);
}

class DemoErrorBoundary extends Component<{ children: React.ReactNode; onRetry: () => void }, { error: string | null }> {
  state = { error: null as string | null };
  static getDerivedStateFromError(error: Error) { return { error: error.message || '블록을 표시하지 못했습니다.' }; }
  componentDidCatch(error: Error) { reportError(error); }
  render() {
    if (this.state.error) return <section className="runtime-unavailable" role="alert"><h1>예제를 표시하지 못했습니다</h1><p>샘플 상태를 초기화해 다시 시도할 수 있습니다.</p><button type="button" onClick={this.props.onRetry}>예제 다시 시작</button><button type="button" onClick={() => window.location.reload()}>페이지 다시 로드</button><details><summary>오류 정보</summary><pre>{this.state.error}</pre></details></section>;
    return this.props.children;
  }
}

const ICON_LABELS: Record<string, string> = {
  x: '닫기', 'chevron-down': '펼치기', 'chevron-up': '접기', 'chevron-left': '이전', 'chevron-right': '다음',
  'chevrons-left': '처음으로', 'chevrons-right': '마지막으로', 'arrow-left': '이전', 'arrow-right': '다음',
  'ellipsis': '추가 옵션', 'ellipsis-vertical': '추가 옵션', 'more-horizontal': '추가 옵션', 'more-vertical': '추가 옵션',
  plus: '추가', minus: '줄이기', search: '검색', trash: '삭제', 'trash-2': '삭제', pencil: '편집',
  copy: '복사', check: '확인', 'check-circle-2': '완료', settings: '설정', 'sliders-horizontal': '필터 설정',
  'rotate-ccw': '초기화', 'refresh-cw': '새로 고침', download: '다운로드', 'arrow-down-to-line': '다운로드',
  eye: '표시', 'eye-off': '숨기기', bell: '알림', menu: '메뉴', play: '실행', pause: '일시 정지',
  'calendar': '날짜 선택', 'calendar-days': '날짜 선택', filter: '필터', star: '즐겨찾기',
};
function applySvgMotionPreference() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll<SVGSVGElement>('svg').forEach(svg => {
    if (!svg.querySelector('animate, animateMotion, animateTransform')) return;
    if (reduced) svg.pauseAnimations?.();
    else svg.unpauseAnimations?.();
  });
}
function enhanceAccessibility() {
  applySvgMotionPreference();
  document.querySelectorAll<HTMLButtonElement>('button:not([aria-label]):not([aria-labelledby])').forEach(button => {
    if (button.textContent?.trim()) return;
    const icon = button.querySelector('svg');
    const name = [...(icon?.classList || [])].find(c => c.startsWith('lucide-') && c !== 'lucide-icon')?.slice(7);
    const label = button.title || (name ? ICON_LABELS[name] || name.replaceAll('-', ' ') : '옵션');
    button.setAttribute('aria-label', label);
  });
  document.querySelectorAll<HTMLInputElement>('input:not([aria-label]):not([aria-labelledby]), select:not([aria-label]):not([aria-labelledby]), textarea:not([aria-label]):not([aria-labelledby])').forEach(field => {
    if (field.labels?.length) return;
    const label = field.closest('label')?.textContent?.trim() || field.getAttribute('placeholder') || field.name ||
      (field.type === 'checkbox' ? '항목 선택' : field.type === 'range' ? '값 조절' : field.type === 'search' ? '검색' : '입력 값');
    field.setAttribute('aria-label', label);
  });
}

function PreviewReady() {
  // This effect commits only after the lazy route inside Suspense has mounted.
  useEffect(() => { send('klic:block-ready', { id: requestedId }); }, []);
  return null;
}
function PreviewLoading() {
  return <section className="runtime-unavailable" role="status" aria-live="polite" aria-busy="true">
    <h1>미리보기를 불러오는 중입니다</h1>
    <p>선택한 블록에 필요한 코드만 불러옵니다.</p>
    <progress aria-label="미리보기 불러오기" />
  </section>;
}

function Runtime() {
  const [context, setContext] = useState<BlockContext>(initialContext);
  const [revision, setRevision] = useState(0);
  const [notice, setNotice] = useState('샘플 데이터 · 변경 사항은 이 예제에서만 적용됩니다');
  useEffect(() => { applyContext(context); }, [context]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== parentOrigin || event.source !== window.parent || window.parent === window) return;
      if (!event.data || typeof event.data !== 'object') return;
      if (event.data.type === 'klic:block-context' && validContext(event.data)) {
        const { theme, brand, density, font } = event.data;
        setContext({ ...normalizePreferences(event.data), theme, brand, density, font } as BlockContext);
      } else if (event.data.type === 'klic:block-reset') {
        setRevision(value => value + 1);
        setNotice('샘플 데이터가 초기화되었습니다');
      }
    };
    const error = (event: ErrorEvent) => {
      if (isDeferredResizeNotice(event)) {
        document.documentElement.dataset.klicResizeNotice = event.message;
        return;
      }
      reportError(event.error || event.message);
    };
    const rejection = (event: PromiseRejectionEvent) => reportError(event.reason);
    const preventNavigation = (event: MouseEvent) => {
      const anchor = (event.target as Element)?.closest?.('a');
      if (anchor?.href && !anchor.href.startsWith('blob:') && !anchor.hasAttribute('download')) {
        event.preventDefault();
        setNotice('데모 링크입니다 · 외부 페이지로 이동하지 않습니다');
      }
    };
    const preventFormNavigation = (event: SubmitEvent) => event.preventDefault();
    const escapeExpanded = (event: KeyboardEvent) => { if(event.key==='Escape' && window.parent!==window)window.parent.postMessage({type:'klic:block-exit-expanded'},parentOrigin); };
    document.addEventListener('keydown',escapeExpanded);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', applySvgMotionPreference);
    const observer = new MutationObserver(enhanceAccessibility);
    observer.observe(document.getElementById('root')!, { childList: true, subtree: true });
    enhanceAccessibility();
    window.addEventListener('message', receive);
    window.addEventListener('error', error);
    window.addEventListener('unhandledrejection', rejection);
    document.addEventListener('click', preventNavigation, true);
    document.addEventListener('auxclick', preventNavigation, true);
    document.addEventListener('submit', preventFormNavigation, true);
    return () => {
      observer.disconnect();
      document.removeEventListener('keydown',escapeExpanded);
      motionQuery.removeEventListener('change', applySvgMotionPreference);
      window.removeEventListener('message', receive);
      window.removeEventListener('error', error);
      window.removeEventListener('unhandledrejection', rejection);
      document.removeEventListener('click', preventNavigation, true);
      document.removeEventListener('auxclick', preventNavigation, true);
      document.removeEventListener('submit', preventFormNavigation, true);
    };
  }, []);
  return <>
    <p className="runtime-note" role="status">{notice}</p>
    <main className="runtime-surface">
      <DemoErrorBoundary key={`${selectedId}:${revision}`} onRetry={() => setRevision(value => value + 1)}>
        <Suspense fallback={<PreviewLoading />}><BlockApp selectedId={selectedId || requestedId} density={context.density} showAvatars={context.showAvatars} showProgressRings={context.showProgressRings} onDensityChange={density => { setContext(c => ({...c,density})); if(window.parent!==window)window.parent.postMessage({type:"klic:block-preference",density},parentOrigin); }} />
        <PreviewReady /></Suspense>
      </DemoErrorBoundary>
    </main>
  </>;
}
// Korean previews do not download the documentation translation catalog.
// English loads independently of the block implementation and remains live-switchable.
function installPreviewLanguage() {
  let stored = ''; try { stored = localStorage.getItem('klic-language-v1') || ''; } catch {}
  let desired = (query.has('lang') ? query.get('lang') : stored) === 'en' ? 'en' : 'ko';
  let pending: Promise<unknown> | undefined;
  const requestLanguage = (value: string) => {
    desired = value === 'en' ? 'en' : 'ko';
    if (desired !== 'en' || pending) return;
    pending = import('../../dist/i18n.mjs').then(({initI18n}) => {
      const api = initI18n({switches:false});
      api.setLocale(desired,{persist:false,broadcastChange:false});
      window.removeEventListener('message', receiveLocale);
      window.removeEventListener('storage', receiveStoredLocale);
    }).catch(() => { pending = undefined; });
  };
  const receiveLocale = (event: MessageEvent) => {
    if (event.origin === location.origin && event.source === window.parent && event.data?.type === 'klic:locale' && ['ko','en'].includes(event.data.locale)) requestLanguage(event.data.locale);
  };
  const receiveStoredLocale = (event: StorageEvent) => { if(event.key === 'klic-language-v1') requestLanguage(event.newValue || 'ko'); };
  window.addEventListener('message',receiveLocale);
  window.addEventListener('storage',receiveStoredLocale);
  requestLanguage(desired);
}
installPreviewLanguage();
installLocalFonts();
applyContext(initialContext());
createRoot(document.getElementById('root')!).render(<Runtime />);
