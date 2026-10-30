import {applyTheme as applyRuntimeTheme,getThemeContext as resolveContext} from './engine/theme-runtime.mjs';

export const themeConfig=Object.freeze({
  "id": "paper",
  "profile": "data",
  "material": "solid-glass",
  "mode": "system"
});
const defaults={"colorTheme":"paper","brandProfile":"data","material":"solid-glass","theme":"system"};
export function getThemeContext(preferences={},prefersDark=false){return resolveContext({...defaults,...preferences},prefersDark);}
export function applyTheme(element,preferences={},environment={}){return applyRuntimeTheme(element,{...defaults,...preferences},environment);}
