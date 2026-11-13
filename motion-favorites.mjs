import {createFavoritesStore} from './favorites-store.mjs';
import {getMotion} from './motion-catalog.mjs';

export const MOTION_FAVORITES_EVENT='klic:motion-favorites-change';
export const MOTION_FAVORITES_STORAGE_KEY='klic-motion-favorites';
const store=createFavoritesStore(MOTION_FAVORITES_STORAGE_KEY,MOTION_FAVORITES_EVENT);

export function readMotionFavorites(storage){
 const saved=store.read(storage),current=new Set([...saved].filter(id=>Boolean(getMotion(id))));
 if(current.size!==saved.size)store.replace(current,storage);
 return current;
}

export function toggleMotionFavorite(id,storage,target){
 if(!getMotion(id))return readMotionFavorites(storage);
 const favorites=readMotionFavorites(storage);
 favorites.has(id)?favorites.delete(id):favorites.add(id);
 return store.replace(favorites,storage,target);
}
