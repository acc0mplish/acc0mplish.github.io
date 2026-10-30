import {applyTheme as applyRuntimeTheme,getThemeContext as resolveContext} from './engine/theme-runtime.mjs';

export const themeConfig=Object.freeze({
  "id": "console",
  "profile": "studio",
  "material": "liquid-glass",
  "mode": "system"
});
const defaults={"colorTheme":"console","brandProfile":"studio","material":"liquid-glass","theme":"system"};
export function getThemeContext(preferences={},prefersDark=false){return resolveContext({...defaults,...preferences},prefersDark);}
export function applyTheme(element,preferences={},environment={}){return applyRuntimeTheme(element,{...defaults,...preferences},environment);}
