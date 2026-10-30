import {createFavoritesStore} from './favorites-store.mjs';
export const COMPONENT_FAVORITES_EVENT='klic:component-favorites-change';
export const COMPONENT_FAVORITES_STORAGE_KEY='klic-component-favorites';
export const {read:readComponentFavorites,toggle:toggleComponentFavorite}=createFavoritesStore(COMPONENT_FAVORITES_STORAGE_KEY,COMPONENT_FAVORITES_EVENT);
