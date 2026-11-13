import {getMotion} from './motion-catalog.mjs';

const stageCSS=`.motion-source-stage{position:relative;display:block;overflow:hidden;min-width:0;aspect-ratio:16/10;border:1px solid var(--klic-semantic-color-border,#dfe5ee);border-radius:var(--klic-component-card-radius-default,.5rem);background:var(--klic-semantic-color-surface,#fbfcfe);color:var(--klic-semantic-color-text,#132c46);contain:content}.motion-source-stage canvas{display:block;width:100%;height:100%;font-family:inherit}.motion-source-attribution{margin-block-start:var(--klic-component-field-spacing-internal,.5rem);font-size:.75rem;color:var(--klic-semantic-color-muted,#52657b)}`;

export function createMotionExport(recipeOrId){
 const recipe=typeof recipeOrId==='string'?getMotion(recipeOrId):recipeOrId;
 if(!recipe?.reference?.pattern)throw new TypeError('createMotionExport requires a canonical source motion.');
 const moduleId=recipe.reference.route||recipe.id,componentName='Motion'+recipe.id.replace(/(^|[-_])([a-z])/g,(_,__,letter)=>letter.toUpperCase());
 const serialized=JSON.stringify(recipe).replaceAll('<','\\u003c');
 const html=`<div class="motion-source-stage" data-klic-motion-root></div>`;
 const js=`import {mountMotion} from 'klic-design/motions/runtime';\nimport 'klic-design/motions/runtime.css';\nimport recipe from 'klic-design/motions/${moduleId}';\nconst host=document.querySelector('[data-klic-motion-root]');\nif(!host)throw new Error('Add a [data-klic-motion-root] element before mounting.');\nconst motion=mountMotion(host,recipe);\nvoid motion.ready.catch(error=>{if(host.isConnected)host.dataset.motionError=error instanceof Error?error.message:String(error);});\nexport default motion;`;
 const react=`import {useEffect,useRef} from 'react';\nimport {mountMotion} from 'klic-design/motions/runtime';\nimport 'klic-design/motions/runtime.css';\nimport recipe from 'klic-design/motions/${moduleId}';\n\nexport function ${componentName}(){\n const host=useRef(null);\n useEffect(()=>{const node=host.current;if(!node)return;const motion=mountMotion(node,recipe);void motion.ready.catch(error=>{if(node.isConnected)node.dataset.motionError=error instanceof Error?error.message:String(error);});return ()=>motion.destroy();},[]);\n return <div ref={host} className="motion-source-stage" aria-label={${JSON.stringify(recipe.title.en)}}/>;\n}`;
 return Object.freeze({id:recipe.id,title:recipe.title,html,css:stageCSS,js,react,recipe:serialized,notice:recipe.source==='klic-authored'?'KLIC-authored FlowMotion effect; see motion-source/klic/flowmotion/NOTICE.md.':'Adapted from motion-catalog-acc0mplish; see motion-source/reference/LICENSE.md.'});
}
