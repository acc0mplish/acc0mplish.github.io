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
"use client";

import { useEffect, useState, type RefObject } from "react";
import { isCoarsePointer } from "./loop";

// Caps DPR at 1.5 on coarse pointers and 2 otherwise.
export function defaultMaxDpr(): number {
  return isCoarsePointer() ? 1.5 : 2;
}

// Sets the backing size for a CSS box and returns the DPR used.
export function sizeCanvas(
  canvas: HTMLCanvasElement,
  cssW: number,
  cssH: number,
  maxDpr: number = defaultMaxDpr(),
): number {
  const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, maxDpr);
  canvas.width = Math.max(1, Math.round(cssW * dpr));
  canvas.height = Math.max(1, Math.round(cssH * dpr));
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;
  return dpr;
}

// Rounded size of an element, kept current with a ResizeObserver.
export function useElementSize(ref: RefObject<HTMLElement | null>): { width: number; height: number } {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    let frame = 0;
    let pending: {width:number;height:number}|null = null;
    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (!box) return;
      const width = Math.round(box.width);
      const height = Math.round(box.height);
      pending = {width,height};
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0;
        const next = pending;
        if (next) setSize(prev => prev.width === next.width && prev.height === next.height ? prev : next);
      });
    });
    observer.observe(el);
    return () => { observer.disconnect(); if (frame) cancelAnimationFrame(frame); };
  }, [ref]);

  return size;
}
