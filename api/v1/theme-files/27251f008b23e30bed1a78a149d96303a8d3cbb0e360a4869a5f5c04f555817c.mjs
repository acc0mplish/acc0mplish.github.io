import {applyTheme as applyRuntimeTheme,getThemeContext as resolveContext} from './engine/theme-runtime.mjs';

export const themeConfig=Object.freeze({
  "id": "compute",
  "profile": "studio",
  "material": "solid-glass",
  "mode": "dark"
});
const defaults={"colorTheme":"compute","brandProfile":"studio","material":"solid-glass","theme":"dark"};
export function getThemeContext(preferences={},prefersDark=false){return resolveContext({...defaults,...preferences},prefersDark);}
export function applyTheme(element,preferences={},environment={}){return applyRuntimeTheme(element,{...defaults,...preferences},environment);}
