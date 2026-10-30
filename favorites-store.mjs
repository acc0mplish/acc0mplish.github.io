const valid=id=>typeof id==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)&&id.length<=100;
const normalize=value=>new Set(Array.isArray(value)?value.filter(valid).slice(0,500):[]);
const storageOrNull=()=>{try{return globalThis.localStorage;}catch{return null;}};
export function createFavoritesStore(storageKey,eventName){
 let volatileFavorites=null,volatileStorage=null;
 function read(storage=storageOrNull()){
  if(volatileFavorites&&storage===volatileStorage)return new Set(volatileFavorites);
  try{return normalize(JSON.parse(storage?.getItem(storageKey)||'[]'));}catch{return new Set();}
 }
 function toggle(id,storage=storageOrNull(),target=globalThis.window){
  if(!valid(id))throw new Error('Invalid favorite ID');
  const favorites=read(storage);favorites.has(id)?favorites.delete(id):favorites.add(id);
  try{if(!storage)throw new Error('Storage unavailable');storage.setItem(storageKey,JSON.stringify([...favorites]));if(storage===volatileStorage)volatileFavorites=null;}catch{volatileStorage=storage;volatileFavorites=new Set(favorites);}
  target?.dispatchEvent(new CustomEvent(eventName));return favorites;
 }
 return {read,toggle};
}
