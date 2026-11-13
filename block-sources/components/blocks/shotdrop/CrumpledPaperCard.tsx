/** SPDX-License-Identifier: Apache-2.0 */
import React from 'react';
import { type FileTypeBadge } from './shotPhysics';

interface CrumpledPaperCardProps {
  name: string;
  badge: FileTypeBadge;
  badgeColor: string;
  isCrumpled: boolean;
  isGrabbing?: boolean;
  isFlying?: boolean;
  showHandIcon?: 'fist' | 'open' | 'none';
  scale?: number;
  rotation?: number;
}

export const CrumpledPaperCard: React.FC<CrumpledPaperCardProps> = ({
  name,
  badge,
  badgeColor,
  isCrumpled,
  isGrabbing = false,
  isFlying = false,
  showHandIcon = 'none',
  scale = 1,
  rotation = 0,
}) => {
  const displayName = name.replace(/\.[^/.]+$/, '');

  return (
    <div
      className="inline-flex flex-col items-center select-none pointer-events-none"
      style={{
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        transition:
          isFlying || isGrabbing
            ? 'none'
            : 'transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div className="relative w-[92px] h-[94px] flex items-center justify-center">
        {!isCrumpled ? (
          /* STATE 1: Realistic Lined Memo Pad Sheet (Before Mouse Hover) */
          <div className="relative w-[78px] h-[88px] drop-shadow-md transition-all duration-200">
            <svg
              viewBox="0 0 78 88"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              {/* Main Memo Sheet with perforated top & dog-ear bottom corner */}
              <path
                d="M4 6C4 2.68629 6.68629 0 10 0H68C71.3137 0 74 2.68629 74 6V70L58 86H10C6.68629 86 4 83.3137 4 80V6Z"
                fill="var(--klic-component-block-color-selected)"
                stroke="var(--klic-component-block-color-selected)"
                strokeWidth="1.2"
              />
              {/* Top Notepad Binding Header & Perforation Holes */}
              <path
                d="M4.6 6C4.6 3.01766 7.01766 0.6 10 0.6H68C70.9823 0.6 73.4 3.01766 73.4 6V13H4.6V6Z"
                fill="var(--klic-component-block-color-selected)"
              />
              <circle cx="16" cy="6.5" r="2" fill="var(--klic-component-block-color-surface)" stroke="var(--klic-component-block-color-accent)" strokeWidth="0.8" />
              <circle cx="28" cy="6.5" r="2" fill="var(--klic-component-block-color-surface)" stroke="var(--klic-component-block-color-accent)" strokeWidth="0.8" />
              <circle cx="40" cy="6.5" r="2" fill="var(--klic-component-block-color-surface)" stroke="var(--klic-component-block-color-accent)" strokeWidth="0.8" />
              <circle cx="52" cy="6.5" r="2" fill="var(--klic-component-block-color-surface)" stroke="var(--klic-component-block-color-accent)" strokeWidth="0.8" />
              <circle cx="64" cy="6.5" r="2" fill="var(--klic-component-block-color-surface)" stroke="var(--klic-component-block-color-accent)" strokeWidth="0.8" />

              {/* Vertical Red Margin Line & Blue Ruled Lines */}
              <line x1="16" y1="13" x2="16" y2="85" stroke="var(--klic-component-block-color-danger-surface)" strokeWidth="1.1" />
              <line x1="5" y1="24" x2="73" y2="24" stroke="var(--klic-component-block-color-selected)" strokeWidth="0.9" strokeOpacity="0.7" />
              <line x1="5" y1="34" x2="73" y2="34" stroke="var(--klic-component-block-color-selected)" strokeWidth="0.9" strokeOpacity="0.7" />
              <line x1="5" y1="44" x2="73" y2="44" stroke="var(--klic-component-block-color-selected)" strokeWidth="0.9" strokeOpacity="0.7" />
              <line x1="5" y1="54" x2="73" y2="54" stroke="var(--klic-component-block-color-selected)" strokeWidth="0.9" strokeOpacity="0.7" />
              <line x1="5" y1="64" x2="73" y2="64" stroke="var(--klic-component-block-color-selected)" strokeWidth="0.9" strokeOpacity="0.7" />

              {/* Handwritten-style scribble lines on the memo */}
              <path
                d="M21 21.5C25 20.5 31 22.5 36 21C41 19.5 46 22 54 21"
                stroke="var(--klic-component-block-color-muted)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M21 31.5C28 30.5 35 32.5 43 31C49 30 55 32 62 31"
                stroke="var(--klic-component-block-color-muted)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M21 41.5C26 42 33 40.5 40 41.5"
                stroke="var(--klic-component-block-color-muted)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              {/* Curled Bottom-Right Corner Flap */}
              <path
                d="M58 86V73C58 71.3431 59.3431 70 61 70H74L58 86Z"
                fill="var(--klic-component-block-color-selected)"
              />
            </svg>

            {/* File Badge on Flat Memo */}
            <div
              className="absolute bottom-[10px] left-[12px] px-[7px] py-[2.5px] rounded-md text-[10px] font-bold tracking-wider text-klic-on-emphasis leading-none shadow-xs"
              style={{ backgroundColor: badgeColor }}
            >
              {badge}
            </div>
          </div>
        ) : (
          /* STATE 2: Detailed 3D Multi-Crease Crumpled Paper Wad (구겨진 종이뭉치) */
          <div
            className="relative w-[88px] h-[88px] drop-shadow-lg"
            data-testid="crumpled-paper-ball"
          >
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="paper-lit" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--klic-component-block-color-panel)" />
                  <stop offset="100%" stopColor="var(--klic-component-block-color-selected)" />
                </linearGradient>
                <linearGradient id="paper-mid" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--klic-component-block-color-selected)" />
                  <stop offset="100%" stopColor="var(--klic-component-block-color-selected)" />
                </linearGradient>
                <linearGradient id="paper-shade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--klic-component-block-color-border)" />
                  <stop offset="100%" stopColor="var(--klic-component-block-color-control-border)" />
                </linearGradient>
                <linearGradient id="paper-deep" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--klic-component-block-color-control-border)" />
                  <stop offset="100%" stopColor="var(--klic-component-block-color-muted)" />
                </linearGradient>
              </defs>

              {/* Outer Jagged Crumpled Paper Flaps & Protruding Ears */}
              <polygon
                points="28,7 48,4 66,10 84,18 93,36 89,55 92,70 76,86 57,94 37,91 18,84 8,66 11,47 6,29 17,15"
                fill="var(--klic-component-block-color-selected)"
                stroke="var(--klic-component-block-color-muted)"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />

              {/* Layer 1: Outer Crushed Flaps with Varied Lighting */}
              {/* Top-left folded ear */}
              <polygon points="17,15 28,7 42,19 25,29 6,29" fill="url(#paper-lit)" stroke="var(--klic-component-block-color-control-border)" strokeWidth="0.9" />
              {/* Top-center ridge */}
              <polygon points="28,7 48,4 54,18 42,19" fill="var(--klic-component-block-color-panel)" stroke="var(--klic-component-block-color-control-border)" strokeWidth="0.9" />
              {/* Top-right folded flap */}
              <polygon points="48,4 66,10 64,25 54,18" fill="url(#paper-mid)" stroke="var(--klic-component-block-color-control-border)" strokeWidth="0.9" />
              <polygon points="66,10 84,18 75,33 64,25" fill="url(#paper-lit)" stroke="var(--klic-component-block-color-control-border)" strokeWidth="0.9" />
              {/* Right jagged overhang */}
              <polygon points="84,18 93,36 78,44 75,33" fill="url(#paper-shade)" stroke="var(--klic-component-block-color-muted)" strokeWidth="0.9" />
              <polygon points="93,36 89,55 74,53 78,44" fill="url(#paper-mid)" stroke="var(--klic-component-block-color-control-border)" strokeWidth="0.9" />
              {/* Bottom-right crumpled corner */}
              <polygon points="89,55 92,70 76,68 74,53" fill="url(#paper-deep)" stroke="var(--klic-component-block-color-muted)" strokeWidth="0.9" />
              <polygon points="92,70 76,86 64,74 76,68" fill="url(#paper-shade)" stroke="var(--klic-component-block-color-muted)" strokeWidth="0.9" />
              {/* Bottom tucked folds */}
              <polygon points="76,86 57,94 52,79 64,74" fill="url(#paper-mid)" stroke="var(--klic-component-block-color-control-border)" strokeWidth="0.9" />
              <polygon points="57,94 37,91 40,76 52,79" fill="url(#paper-deep)" stroke="var(--klic-component-block-color-muted)" strokeWidth="0.9" />
              <polygon points="37,91 18,84 27,69 40,76" fill="url(#paper-shade)" stroke="var(--klic-component-block-color-muted)" strokeWidth="0.9" />
              {/* Left crushed edge */}
              <polygon points="18,84 8,66 23,58 27,69" fill="url(#paper-mid)" stroke="var(--klic-component-block-color-control-border)" strokeWidth="0.9" />
              <polygon points="8,66 11,47 26,45 23,58" fill="url(#paper-deep)" stroke="var(--klic-component-block-color-muted)" strokeWidth="0.9" />
              <polygon points="11,47 6,29 25,29 26,45" fill="url(#paper-lit)" stroke="var(--klic-component-block-color-control-border)" strokeWidth="0.9" />

              {/* Layer 2: Deep Interior Pinched Crevices & Ridges (Gives true crumpled paper look) */}
              <polygon points="25,29 42,19 49,34 35,41 26,45" fill="url(#paper-shade)" stroke="var(--klic-component-block-color-muted)" strokeWidth="1" />
              <polygon points="42,19 54,18 64,25 58,38 49,34" fill="var(--klic-component-block-color-panel)" stroke="var(--klic-component-block-color-control-border)" strokeWidth="1" />
              <polygon points="64,25 75,33 78,44 63,48 58,38" fill="url(#paper-mid)" stroke="var(--klic-component-block-color-control-border)" strokeWidth="1" />

              {/* Deep Dark Shadow Pockets where paper is tightly pinched */}
              <polygon points="35,41 49,34 45,49" fill="var(--klic-component-block-color-muted)" fillOpacity="0.45" />
              <polygon points="58,38 63,48 51,52 49,34" fill="url(#paper-deep)" stroke="var(--klic-component-block-color-muted)" strokeWidth="1" />
              <polygon points="26,45 35,41 45,49 36,61 23,58" fill="var(--klic-component-block-color-panel)" stroke="var(--klic-component-block-color-control-border)" strokeWidth="1" />
              <polygon points="45,49 51,52 61,62 47,66 36,61" fill="url(#paper-lit)" stroke="var(--klic-component-block-color-control-border)" strokeWidth="1" />
              <polygon points="63,48 78,44 74,53 61,62 51,52" fill="url(#paper-shade)" stroke="var(--klic-component-block-color-muted)" strokeWidth="1" />

              {/* Inner shadow crevice triangle */}
              <polygon points="36,61 47,66 40,76 27,69 23,58" fill="url(#paper-deep)" stroke="var(--klic-component-block-color-muted)" strokeWidth="1" />
              <polygon points="47,66 61,62 64,74 52,79 40,76" fill="url(#paper-lit)" stroke="var(--klic-component-block-color-control-border)" strokeWidth="1" />
              <polygon points="61,62 74,53 76,68 64,74" fill="var(--klic-component-block-color-muted)" fillOpacity="0.38" />

              {/* Warped Blue Notebook Ruled Lines & Scribbles bent across facets! */}
              <g stroke="var(--klic-component-block-color-accent)" strokeWidth="1" strokeOpacity="0.65" strokeLinecap="round">
                <line x1="29" y1="14" x2="46" y2="11" />
                <line x1="45" y1="24" x2="60" y2="29" />
                <line x1="28" y1="49" x2="41" y2="54" />
                <line x1="46" y1="56" x2="57" y2="59" />
                <line x1="45" y1="71" x2="59" y2="69" />
              </g>
              {/* Warped Red Margin Line fragment */}
              <line x1="17" y1="33" x2="24" y2="42" stroke="var(--klic-component-block-color-danger)" strokeWidth="1.2" strokeOpacity="0.7" />
              {/* Crushed scribble ink fragments */}
              <path d="M46 27C49 26 53 28 56 27" stroke="var(--klic-component-block-color-muted)" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M30 52C33 51 37 53 39 51" stroke="var(--klic-component-block-color-muted)" strokeWidth="1.4" strokeLinecap="round" />

              {/* Sharp White Specular Paper Fold Highlights */}
              <polyline
                points="28,7 42,19 49,34 45,49 61,62 64,74"
                fill="none"
                stroke="var(--klic-component-block-color-panel)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="11,47 26,45 35,41 49,34 64,25 84,18"
                fill="none"
                stroke="var(--klic-component-block-color-panel)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Skewed File Badge Tag Tucked into a Paper Fold */}
            <div
              className="absolute bottom-[12px] left-[10px] -rotate-12 px-[6px] py-[2px] rounded text-[9px] font-bold tracking-wider text-klic-on-emphasis leading-none shadow-sm border border-white/40"
              style={{ backgroundColor: badgeColor }}
            >
              {badge}
            </div>
          </div>
        )}

        {/* Hand Cursor Overlay — Offset cleanly to the bottom-right so it never blocks the crumpled paper texture! */}
        {showHandIcon !== 'none' && (
          <div
            className="absolute transition-all duration-150"
            style={{
              bottom: showHandIcon === 'fist' ? '0px' : '-20px',
              right: showHandIcon === 'fist' ? '2px' : '22px',
            }}
          >
            {showHandIcon === 'fist' ? (
              <div className="w-6 h-6 rounded-full bg-white/95 shadow-md border border-zinc-200 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-zinc-900">
                  <path d="M8.5 7A1.5 1.5 0 0 1 10 8.5V10h.5V7.5a1.5 1.5 0 0 1 3 0V10h.5V8a1.5 1.5 0 0 1 3 0v2.5h.5V9.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-2.5a5.5 5.5 0 0 1-4.8-2.8l-2.3-4.1a1.5 1.5 0 0 1 2.1-2l.9.6V8.5A1.5 1.5 0 0 1 8.5 7Z" />
                </svg>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-zinc-900">
                  <path d="M11.5 2a1.25 1.25 0 0 1 1.25 1.25v6.25h.75V3.75a1.25 1.25 0 0 1 2.5 0v5.75h.75V5.25a1.25 1.25 0 0 1 2.5 0V14.5a6.5 6.5 0 0 1-6.5 6.5h-1.8a6.2 6.2 0 0 1-5.4-3.15l-2.75-4.85a1.35 1.35 0 0 1 2.15-1.68l2.05 1.93V4.25a1.25 1.25 0 0 1 2.5 0v5.25h.75V3.25A1.25 1.25 0 0 1 11.5 2Z" />
                </svg>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filename & Morph Status Label */}
      {!isFlying && (
        <span
          className={`mt-1 text-[12px] font-medium tracking-tight max-w-[135px] truncate transition-colors ${
            isCrumpled ? 'text-blue-700 font-semibold' : 'text-zinc-400'
          }`}
        >
          {isCrumpled ? `구겨진 종이 (${displayName})` : displayName}
        </span>
      )}
    </div>
  );
};
