/* MIT License

Copyright (c) 2026 Isaiah Bjork

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
// Adapted from Björk UI · Copyright (c) 2026 Isaiah Bjork · MIT. See LICENSE.bjork.
// Series colour for the Charts collection: a fixed categorical order for identity and a one-hue
// ramp for magnitude. Pure data and functions; every chart imports what it needs by path.
//
// The categorical order is warm-anchored: the ember accent first, then warm ink-neutral steps,
// then one cool counterpoint (steel), then deeper or lighter steps of the accent family. Every
// light slot clears 3:1 on the paper stage. Hues are assigned in this order and never cycled:
// past six series, fold the rest into "Other" (see `foldSeries`).

import {tokenColor, type BjorkTone } from "../_core/palette";
import { clamp, lerp, parseColor } from "./scale";

export const CHART_SERIES: Record<BjorkTone, readonly string[]> = {get light(){return Array.from({length:6},(_,i)=>tokenColor('light',`chart.series-${i+1}`));},get dark(){return Array.from({length:6},(_,i)=>tokenColor('dark',`chart.series-${i+1}`));}};

// The neutral an "Other" bucket takes, so it never impersonates a series.
export const CHART_OTHER: Record<BjorkTone,string>={get light(){return tokenColor('light','color.muted');},get dark(){return tokenColor('dark','color.muted');}};

export const MAX_SERIES = 6;

// Slot colour by the series' stable index (its position in the caller's data, never its rank).
export function seriesColor(tone: BjorkTone, index: number): string {
  const set = CHART_SERIES[tone];
  return index >= 0 && index < set.length ? set[index] : CHART_OTHER[tone];
}

// Keeps the first `max - 1` items and sums the rest into one "Other" item when there are more
// than `max`. `merge` builds the Other item from the folded ones.
export function foldSeries<T>(items: T[], max: number, merge: (rest: T[]) => T): T[] {
  if (items.length <= max) return items;
  return [...items.slice(0, max - 1), merge(items.slice(max - 1))];
}

// One-hue magnitude ramp in the accent family. t = 0 recedes toward the stage, t = 1 is the
// strongest step. Dark mode brightens with magnitude, light mode darkens, so "more" always reads
// as more contrast against the surface.
function magnitudeRamp(tone:BjorkTone){const a=parseColor(tokenColor(tone,'color.soft')),b=parseColor(tokenColor(tone,'color.accent'));return Array.from({length:6},(_,i)=>`rgb(${[0,1,2].map(k=>Math.round(lerp(a[k],b[k],i/5))).join(',')})`);}
const RAMP:Record<BjorkTone,readonly string[]>={get light(){return magnitudeRamp('light');},get dark(){return magnitudeRamp('dark');}};

export function rampColor(tone: BjorkTone, t: number): string {
  const stops = RAMP[tone];
  const x = clamp(Number.isFinite(t) ? t : 0, 0, 1) * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(x));
  const a = parseColor(stops[i]);
  const b = parseColor(stops[i + 1]);
  const f = x - i;
  return `rgb(${Math.round(lerp(a[0], b[0], f))},${Math.round(lerp(a[1], b[1], f))},${Math.round(lerp(a[2], b[2], f))})`;
}

// WCAG relative luminance of an sRGB colour.
function relLum(color: string): number {
  const [r, g, b] = parseColor(color).map((c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Light or dark ink for text on a filled mark, whichever has more WCAG contrast. The inks are
// near-white (L ≈ 0.94) and near-black (L ≈ 0.009). Saturated orange gets dark ink; white text
// only lands on the deeper rust steps, the same rule as --bjork-accent-fill.
export function inkOn(color: string): "light" | "dark" {
  const L = relLum(color);
  return (0.94 + 0.05) / (L + 0.05) >= (L + 0.05) / (0.009 + 0.05) ? "light" : "dark";
}

// Whether text on a ramp cell at `t` should use the light or dark ink.
export function rampInk(tone: BjorkTone, t: number): "light" | "dark" {
  return inkOn(rampColor(tone, t));
}
