import {applyTheme as applyRuntimeTheme,getThemeContext as resolveContext} from './engine/theme-runtime.mjs';

export const themeConfig=Object.freeze({
  "id": "ink",
  "profile": "data",
  "material": "solid-glass",
  "mode": "light"
});
const defaults={"colorTheme":"ink","brandProfile":"data","material":"solid-glass","theme":"light"};
export function getThemeContext(preferences={},prefersDark=false){return resolveContext({...defaults,...preferences},prefersDark);}
export function applyTheme(element,preferences={},environment={}){return applyRuntimeTheme(element,{...defaults,...preferences},environment);}
