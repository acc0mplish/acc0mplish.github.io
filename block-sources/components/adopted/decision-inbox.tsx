"use client";
/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 Florian Höller (adfects).
 * KLIC adaptation: token roles, Korean copy, lifecycle and clipboard fixes.
 * Source: flohoeller/affectui @ 0c81e8114c466aa6283923920eaabe62ce2a8b25 / components/decision-inbox.tsx
 * Full license: dist/licenses/klic-interaction-kit/MIT.txt in this distribution.
 */


import { useState, useRef, useEffect } from "react";

/*
 * Decision Inbox – open decisions with two quick actions each, in a gray tray with a white card, in a single self-contained file.
 * Answering a decision confirms it briefly, then folds it away and the count goes down.
 * The styles are injected below, so no extra files are needed.
 */

export type Decision = {
  id: string;
  title: string;
  /** Short context under the title */
  detail?: string;
  /** Main answer, shown as the dark button */
  primary: string;
  /** Other answer, shown as the light button */
  secondary: string;
  /** Starts folded to one muted line – click to open */
  collapsed?: boolean;
};

export type DecisionInboxProps = {
  decisions: Decision[];
  /** Called with the decision and the chosen answer */
  onDecide?: (decision: Decision, answer: "primary" | "secondary") => void;
  className?: string;
};

type State = { open: boolean; answered?: string; gone?: boolean };

export function DecisionInbox({ decisions, onDecide, className }: DecisionInboxProps) {
  const [state, setState] = useState<Record<string, State>>(() =>
    Object.fromEntries(decisions.map((d) => [d.id, { open: !d.collapsed }])),
  );
  const timers=useRef<number[]>([]);
  useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
  const patch = (id: string, next: Partial<State>) => setState((s) => ({ ...s, [id]: { ...s[id], ...next } }));

  const open = decisions.filter((d) => !state[d.id]?.answered).length;
  // 1284 → "1,284"
  const count = new Intl.NumberFormat("ko-KR").format(open);

  const decide = (d: Decision, answer: "primary" | "secondary") => {
    patch(d.id, { answered: answer === "primary" ? d.primary : d.secondary });
    onDecide?.(d, answer);
    // Show the confirmation for a moment, then fold the row away and open the next folded one
    timers.current.push(window.setTimeout(() => {
      setState((s) => {
        const next = { ...s, [d.id]: { ...s[d.id], gone: true } };
        const folded = decisions.find((x) => x.id !== d.id && !next[x.id]?.open && !next[x.id]?.answered);
        if (folded) next[folded.id] = { ...next[folded.id], open: true };
        return next;
      });
    }, 1100));
  };

  return (
    <>
      <style href="ui-decision-inbox" precedence="default">
        {css}
      </style>
      <section className={["ui-di", className].filter(Boolean).join(" ")} data-clear={open === 0 || undefined}>
        <header className="ui-di__head" aria-live="polite">
          {open > 0 ? (
            <>
              <AlertIcon />
              <span>
                결정 대기 {count}건
              </span>
            </>
          ) : (
            <>
              <DoneIcon />
              <span>검토를 모두 마쳤습니다</span>
            </>
          )}
        </header>

        <div className="ui-di__card" data-klic-surface="card">
          {decisions.map((d) => {
            const s = state[d.id] ?? { open: true };
            return (
              <div key={d.id} className="ui-di__row" data-gone={s.gone || undefined} inert={s.gone}>
                <div className="ui-di__row-inner">
                  <div className="ui-di__item" data-open={s.open || undefined} data-answered={s.answered ? true : undefined}>
                    {s.open ? (
                      <p className="ui-di__title" dir="auto">
                        {d.title}
                      </p>
                    ) : (
                      <button type="button" className="ui-di__title ui-di__title--folded" dir="auto" title={d.title} aria-expanded={false} onClick={() => patch(d.id, { open: true })}>
                        {d.title}
                      </button>
                    )}
                    <div className="ui-di__body" data-open={s.open || undefined} inert={!s.open}>
                      <div className="ui-di__body-inner">
                        {d.detail && (
                          <p className="ui-di__detail" dir="auto">
                            {d.detail}
                          </p>
                        )}
                        <div className="ui-di__actions">
                          {s.answered ? (
                            <span className="ui-di__done" role="status">
                              <DoneIcon />
                              <span dir="auto">{s.answered}</span>
                            </span>
                          ) : (
                            <>
                              <button type="button" className="ui-di__btn ui-di__btn--primary" dir="auto" onClick={() => decide(d, "primary")}>
                                {d.primary}
                              </button>
                              <button type="button" className="ui-di__btn" dir="auto" onClick={() => decide(d, "secondary")}>
                                {d.secondary}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <p className="ui-di__empty">대기 중인 결정이 없습니다. 새로운 결정 요청이 여기에 표시됩니다.</p>
        </div>
      </section>
    </>
  );
}

/* ---------- Icons ---------- */

const AlertIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
    <path d="M6.7 2.3a1.5 1.5 0 0 1 2.6 0l5.4 9.4A1.5 1.5 0 0 1 13.4 14H2.6a1.5 1.5 0 0 1-1.3-2.3Z" fill="currentColor" />
    <path d="M8 5.6v3.6" stroke="var(--klic-component-block-color-on-accent)" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="11.4" r="0.85" fill="var(--klic-component-block-color-panel)" />
  </svg>
);

const DoneIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
    <circle cx="8" cy="8" r="7" fill="currentColor" />
    <path d="m5 8.2 2 2 4-4.2" fill="none" stroke="var(--klic-component-block-color-on-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- Styles ---------- */

const css = /* css */ `
.ui-di {
  --ui-di-tray: var(--klic-component-block-color-soft);
  --ui-di-card: var(--klic-component-block-color-panel);
  --ui-di-line: var(--klic-component-block-color-border);
  --ui-di-ink: var(--klic-component-block-color-text);
  --ui-di-text: var(--klic-component-block-color-text);
  --ui-di-muted: var(--klic-component-block-color-muted);
  --ui-di-faint: var(--klic-component-block-color-muted);
  --ui-di-alert: var(--klic-component-block-color-accent);
  --ui-di-ok: var(--klic-component-block-color-accent);
  --ui-di-ease: cubic-bezier(0.22, 1, 0.36, 1);
  box-sizing: border-box;
  width: 100%;
  max-width: 440px;
  /* Like the Chat Composer: a gray tray with the heading, the white card sits on top of it */
  background: var(--ui-di-tray);
  /* The gray tray frames the white card on every side */
  padding: 6px;
  border-radius: 22px;
  font-family: var(--runtime-font, system-ui);
  color: var(--ui-di-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-di *, .ui-di *::before, .ui-di *::after { box-sizing: border-box; }
.ui-di button { margin: 0; font: inherit; cursor: pointer; }
.ui-di button:focus-visible { outline: 2px solid var(--klic-component-block-color-accent); outline-offset: 2px; }

.ui-di__head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 18px 10px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-di-alert);
  transition: color 300ms ease;
}
.ui-di[data-clear] .ui-di__head { color: var(--ui-di-ok); }

.ui-di__card {
  overflow: hidden;
  background: var(--ui-di-card);
  border: 1px solid var(--klic-component-block-color-panel);
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

/* Rows fold away with a height transition once answered */
.ui-di__row {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 460ms var(--ui-di-ease), opacity 300ms ease;
}
.ui-di__row[data-gone] { grid-template-rows: 0fr; opacity: 0; }
.ui-di__row-inner { min-height: 0; overflow: hidden; }
.ui-di__row + .ui-di__row .ui-di__item { border-top: 1px solid var(--ui-di-line); }
.ui-di__row[data-gone] + .ui-di__row .ui-di__item { border-top-color: transparent; }

.ui-di__item { padding: 16px 20px 14px; }
.ui-di__item:not([data-open]) { padding-bottom: 16px; }
.ui-di__title {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-align: start;
  color: var(--ui-di-ink);
  overflow-wrap: anywhere;
}
.ui-di__title--folded {
  /* Still one line however long the title – it opens in full on click */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--ui-di-faint);
  transition: color 160ms ease;
}
.ui-di__title--folded:hover { color: var(--ui-di-muted); }

.ui-di__body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 420ms var(--ui-di-ease);
}
.ui-di__body[data-open] { grid-template-rows: 1fr; }
/* Room around the buttons so the clipping for the fold never cuts their ring and shadow */
.ui-di__body-inner {
  min-height: 0;
  overflow: hidden;
  margin: 0 -4px -4px;
  padding: 0 4px 4px;
}
.ui-di__detail {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-di-muted);
  white-space: pre-line;
  overflow-wrap: anywhere;
}
.ui-di__actions {
  display: flex;
  align-items: center;
  /* Long or translated answers go on a second line instead of out of the card */
  flex-wrap: wrap;
  gap: 8px;
  min-height: 30px;
  margin-top: 12px;
}

.ui-di__btn {
  max-width: 100%;
  min-height: 30px;
  padding: 5px 12px;
  border: 0;
  border-radius: 9px;
  background: var(--klic-component-block-color-panel);
  box-shadow: 0 0 0 1px var(--klic-component-block-color-panel), 0 1px 2px rgba(0, 0, 0, 0.04);
  font-size: 13px !important;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-di-ink);
  overflow-wrap: anywhere;
  transition: background-color 160ms ease, transform 160ms ease;
}
.ui-di__btn:hover { background: var(--klic-component-block-color-panel); }
.ui-di__btn:active { transform: scale(0.98); }
.ui-di__btn--primary {
  background: linear-gradient(var(--klic-component-block-color-text), var(--klic-component-block-color-text));
  box-shadow: 0 0 0 1px var(--klic-component-block-color-text), 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  color: var(--klic-component-block-color-panel);
}
.ui-di__btn--primary:hover { background: linear-gradient(var(--klic-component-block-color-text), var(--klic-component-block-color-text)); }

.ui-di__done {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  max-width: 100%;
  color: var(--ui-di-ok);
  overflow-wrap: anywhere;
  animation: ui-di-in 360ms var(--ui-di-ease);
}
.ui-di__done > span { min-width: 0; }

.ui-di__empty {
  display: none;
  margin: 0;
  padding: 18px 20px;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-di-muted);
}
.ui-di[data-clear] .ui-di__empty { display: block; animation: ui-di-in 420ms var(--ui-di-ease) 300ms both; }

@keyframes ui-di-in {
  from { opacity: 0; transform: translateY(3px); }
}

@media (prefers-reduced-motion: reduce) {
  .ui-di__row, .ui-di__body { transition: none; }
  .ui-di__done, .ui-di__empty { animation: none !important; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-di {
  --ui-di-tray: var(--klic-component-block-color-soft);
  --ui-di-card: var(--klic-component-block-color-panel);
  --ui-di-line: var(--klic-component-block-color-border);
  --ui-di-ink: var(--klic-component-block-color-text);
  --ui-di-text: var(--klic-component-block-color-text);
  --ui-di-muted: var(--klic-component-block-color-muted);
  --ui-di-faint: var(--klic-component-block-color-muted);
  --ui-di-alert: var(--klic-component-block-color-accent);
  --ui-di-ok: var(--klic-component-block-color-accent);
}
:where(.dark, [data-theme="dark"]) .ui-di__card {
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}
:where(.dark, [data-theme="dark"]) .ui-di__btn {
  background: var(--klic-component-block-color-accent);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.4);
}
:where(.dark, [data-theme="dark"]) .ui-di__btn:hover { background: var(--klic-component-block-color-accent); }
/* The dark primary button inverts, like on the site */
:where(.dark, [data-theme="dark"]) .ui-di__btn--primary {
  background: linear-gradient(var(--klic-component-block-color-panel), var(--klic-component-block-color-panel));
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 var(--klic-component-block-color-panel);
  color: var(--klic-component-block-color-text);
}
:where(.dark, [data-theme="dark"]) .ui-di__btn--primary:hover { background: linear-gradient(var(--klic-component-block-color-panel), var(--klic-component-block-color-panel)); }
`;

/*
MIT License

Copyright (c) 2026 Florian Höller (adfects)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
