import {createFavoritesStore} from './favorites-store.mjs';
export const MOTION_FAVORITES_EVENT='klic:motion-favorites-change';
export const MOTION_FAVORITES_STORAGE_KEY='klic-motion-favorites';
export const {read:readMotionFavorites,toggle:toggleMotionFavorite}=createFavoritesStore(MOTION_FAVORITES_STORAGE_KEY,MOTION_FAVORITES_EVENT);
