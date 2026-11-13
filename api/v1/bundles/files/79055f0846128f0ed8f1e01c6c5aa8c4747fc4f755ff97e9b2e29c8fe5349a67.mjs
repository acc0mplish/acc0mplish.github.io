import {mkdir,writeFile,readdir} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import {catalog} from './public/catalog.js';
import {componentForms} from './public/component-families.mjs';
import {getRegistryItem,withResponder} from './public/integrations/klic.mjs';
import {readFile} from 'node:fs/promises';
for(const file of await readdir('public/block-thumbnails'))if(file.endsWith('.html.gz'))await writeFile('public/block-thumbnails/'+file.slice(0,-3),gunzipSync(await readFile('public/block-thumbnails/'+file)));
const registry=JSON.parse(await readFile('public/api/v1/registry.json','utf8'));
await mkdir('public/api/v1/items/component',{recursive:true});
for(const item of registry.items.filter(item=>item.kind==='component'))await writeFile('public/api/v1/items/component/'+item.id+'.json',JSON.stringify(withResponder(getRegistryItem(registry,{kind:item.kind,id:item.id}),{transport:'http-api'})));
for(const c of catalog){const dir='public/api/v1/sources/variants/'+c.id;await mkdir(dir,{recursive:true});for(const form of componentForms(c,'export-'+c.id))await writeFile(dir+'/'+form.id+'.html',form.html+'\n');}
