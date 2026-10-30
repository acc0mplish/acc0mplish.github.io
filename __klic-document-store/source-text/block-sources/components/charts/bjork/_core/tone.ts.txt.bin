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
import {useSyncExternalStore} from 'react';
import type {BjorkTone} from './palette';
export const subscribeChartContext=(cb:()=>void)=>{const observer=new MutationObserver(cb);observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','style','data-brand','data-color-theme','data-chart-palette']});return ()=>observer.disconnect();};
export const getChartContextSnapshot=()=>{
 const root=document.documentElement;
 // Include the resolved series, not only the blue action color: a color theme
 // or neutral override can change chart colors while preserving identity/mode.
 const colors=['accent','surface','panel','soft','selected','border','control-border','text','muted','on-accent','warning','danger'];
 return [root.getAttribute('data-theme'),root.dataset.brand,root.dataset.colorTheme,root.dataset.chartPalette,...colors.map(name=>root.style.getPropertyValue(`--klic-component-block-color-${name}`)),...Array.from({length:6},(_,i)=>root.style.getPropertyValue(`--klic-component-block-chart-series-${i+1}`))].join('|');
};
export const useChartContextKey=()=>useSyncExternalStore(subscribeChartContext,getChartContextSnapshot,()=>((globalThis as any).__KLIC_CHART_SSR__?.theme||'light'));
export function useBjorkTone(tone?:BjorkTone):BjorkTone {
 const key=useChartContextKey();
 return tone||(key.startsWith('dark')?'dark':'light');
}
