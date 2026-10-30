import './prepare.mjs';import {cp,rm} from 'node:fs/promises';await rm('build',{recursive:true,force:true});await cp('public','build',{recursive:true});
