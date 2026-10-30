import {applyTheme as applyRuntimeTheme,getThemeContext as resolveContext} from './engine/theme-runtime.mjs';

export const themeConfig=Object.freeze({
  "id": "analysis",
  "profile": "studio",
  "material": "liquid-glass",
  "mode": "dark"
});
const defaults={"colorTheme":"analysis","brandProfile":"studio","material":"liquid-glass","theme":"dark"};
export function getThemeContext(preferences={},prefersDark=false){return resolveContext({...defaults,...preferences},prefersDark);}
export function applyTheme(element,preferences={},environment={}){return applyRuntimeTheme(element,{...defaults,...preferences},environment);}
