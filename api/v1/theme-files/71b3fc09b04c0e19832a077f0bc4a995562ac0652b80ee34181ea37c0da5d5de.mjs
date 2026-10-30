import {applyTheme as applyRuntimeTheme,getThemeContext as resolveContext} from './engine/theme-runtime.mjs';

export const themeConfig=Object.freeze({
  "id": "paper",
  "profile": "core",
  "material": "flat",
  "mode": "light"
});
const defaults={"colorTheme":"paper","brandProfile":"core","material":"flat","theme":"light"};
export function getThemeContext(preferences={},prefersDark=false){return resolveContext({...defaults,...preferences},prefersDark);}
export function applyTheme(element,preferences={},environment={}){return applyRuntimeTheme(element,{...defaults,...preferences},environment);}
