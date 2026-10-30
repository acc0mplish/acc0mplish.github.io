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
// KLIC Component → Semantic → Brand → Primitive adapter for Björk's MIT renderer.
import {createTokens,resolveTokens,formatValue} from "../../../../../../dist/tokens.mjs";
export type BjorkTone = 'dark'|'light';
const defaults=Object.fromEntries(['light','dark'].map(tone=>[tone,resolveTokens(createTokens('a',tone))]));
export function tokenColor(tone:BjorkTone,suffix:string):string {
 const path='klic.component.block.'+suffix;
 if(typeof document!=='undefined'&&document.documentElement.dataset.theme===tone){
  const v=getComputedStyle(document.documentElement).getPropertyValue('--'+path.replaceAll('.','-')).trim();
  if(v)return v;
 }
 return formatValue(defaults[tone][path]);
}
const paletteCache=new Map<BjorkTone,{key:string;value:ReturnType<typeof buildPalette>}>();
function palette(tone:BjorkTone){const value=buildPalette(tone),key=JSON.stringify(value),cached=paletteCache.get(tone);if(cached?.key===key)return cached.value;paletteCache.set(tone,{key,value});return value;}
function buildPalette(tone:BjorkTone){
 const c=(name:string)=>tokenColor(tone,'color.'+name),text=c('text'),accent=c('accent'),panel=c('panel'),muted=c('muted');
 return {bg:c('surface'),stage:panel,surface:panel,raised:c('soft'),active:c('selected'),border:c('border'),borderStrong:c('control-border'),text,textMedium:text,textMuted:muted,textSoft:muted,textFaint:muted,hair:c('border'),accent,accentInk:accent,accentFill:accent,accentSoft:c('selected'),accentMuted:c('selected'),accentFg:c('on-accent'),success:accent,warning:c('warning'),error:c('danger')};
}
export const BJORK_PALETTE={get light(){return palette('light');},get dark(){return palette('dark');}};
