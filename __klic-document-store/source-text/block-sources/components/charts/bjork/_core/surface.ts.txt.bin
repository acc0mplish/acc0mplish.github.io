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
import type {CSSProperties} from 'react';
import type {BjorkTone} from './palette';
export function surfaceVars(_tone:BjorkTone):CSSProperties {
 const p='var(--klic-component-block-color-panel)',s='var(--klic-component-block-color-soft)',b='var(--klic-component-block-color-border)';
 return {'--bjork-surface':p,'--bjork-surface-muted':s,'--bjork-surface-hover':s,'--bjork-surface-active':'var(--klic-component-block-color-selected)','--bjork-panel':p,'--bjork-menu':p,'--bjork-field':p,'--bjork-field-muted':s,'--bjork-field-inset':s,'--bjork-border':b,'--bjork-border-muted':b,'--bjork-border-strong':'var(--klic-component-block-color-control-border)','--bjork-shadow-surface':'0 8px 28px -12px var(--klic-component-block-color-border)','--bjork-shadow-soft':'inset 0 1px 0 var(--klic-component-block-color-border)','--bjork-shadow-panel':'0 8px 28px -12px var(--klic-component-block-color-border)','--bjork-shadow-menu':'0 8px 28px -12px var(--klic-component-block-color-border)','--bjork-shadow-inset':'inset 0 1px 0 var(--klic-component-block-color-border)'} as CSSProperties;
}
export const BJORK_SURFACE={light:tokenSurface(),dark:tokenSurface()};
function tokenSurface(){const v=(suffix:string)=>`var(--klic-component-block-color-${suffix})`;return {surface:v('panel'),surfaceMuted:v('soft'),surfaceHover:v('soft'),surfaceActive:v('selected'),panel:v('panel'),menu:v('panel'),field:v('panel'),fieldMuted:v('soft'),fieldInset:v('soft'),border:v('border'),borderMuted:v('border'),borderStrong:v('control-border'),shadowSurface:`0 8px 28px -12px ${v('border')}`,shadowSoft:`inset 0 1px 0 ${v('border')}`,shadowPanel:`0 8px 28px -12px ${v('border')}`,shadowMenu:`0 8px 28px -12px ${v('border')}`,shadowInset:`inset 0 1px 0 ${v('border')}`};}
