import {mkdir,writeFile} from 'node:fs/promises';
import {catalog} from './public/catalog.js';
import {componentForms} from './public/component-families.mjs';
for(const c of catalog){const dir='public/api/v1/sources/variants/'+c.id;await mkdir(dir,{recursive:true});for(const form of componentForms(c,'export-'+c.id))await writeFile(dir+'/'+form.id+'.html',form.html+'\n');}
