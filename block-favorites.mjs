import {createFavoritesStore} from './favorites-store.mjs';
export const FAVORITES_EVENT='klic:block-favorites-change';
export const FAVORITES_STORAGE_KEY='klic-block-favorites';
export const {read:readBlockFavorites,toggle:toggleBlockFavorite}=createFavoritesStore(FAVORITES_STORAGE_KEY,FAVORITES_EVENT);
