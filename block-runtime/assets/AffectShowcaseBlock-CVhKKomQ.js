import{c as be,r,j as e}from"./index-DG-jJ_vk.js";import{S as le}from"./sparkles-CzKZCjEp.js";import{L as ue}from"./layers-Babw6lxY.js";import{P as Ee}from"./palette-Co7QxMhU.js";import{B as $e}from"./box-uvt_AodG.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Le=[["path",{d:"M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1",key:"ezmyqa"}],["path",{d:"M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1",key:"e1hn23"}]],me=be("braces",Le);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Be=[["path",{d:"M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z",key:"1uwlt4"}],["path",{d:"M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414L6.088 8.916a1 1 0 0 0-1.414 0z",key:"10291m"}],["path",{d:"M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415l-2.377-2.376a1 1 0 0 0-1.414 0z",key:"1tqoq1"}],["path",{d:"M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z",key:"1x6lto"}]],qe=be("component",Be);function Ae({decisions:i,onDecide:o,className:p}){const[c,m]=r.useState(()=>Object.fromEntries(i.map(l=>[l.id,{open:!l.collapsed}]))),j=r.useRef([]);r.useEffect(()=>()=>j.current.forEach(clearTimeout),[]);const v=(l,b)=>m(_=>({..._,[l]:{..._[l],...b}})),M=i.filter(l=>!c[l.id]?.answered).length,z=new Intl.NumberFormat("ko-KR").format(M),L=(l,b)=>{v(l.id,{answered:b==="primary"?l.primary:l.secondary}),o?.(l,b),j.current.push(window.setTimeout(()=>{m(_=>{const w={..._,[l.id]:{..._[l.id],gone:!0}},y=i.find(O=>O.id!==l.id&&!w[O.id]?.open&&!w[O.id]?.answered);return y&&(w[y.id]={...w[y.id],open:!0}),w})},1100))};return e.jsxs(e.Fragment,{children:[e.jsx("style",{href:"ui-decision-inbox",precedence:"default",children:Fe}),e.jsxs("section",{className:["ui-di",p].filter(Boolean).join(" "),"data-clear":M===0||void 0,children:[e.jsx("header",{className:"ui-di__head","aria-live":"polite",children:M>0?e.jsxs(e.Fragment,{children:[e.jsx(Ie,{}),e.jsxs("span",{children:["결정 대기 ",z,"건"]})]}):e.jsxs(e.Fragment,{children:[e.jsx(he,{}),e.jsx("span",{children:"검토를 모두 마쳤습니다"})]})}),e.jsxs("div",{className:"ui-di__card","data-klic-surface":"card",children:[i.map(l=>{const b=c[l.id]??{open:!0};return e.jsx("div",{className:"ui-di__row","data-gone":b.gone||void 0,inert:b.gone,children:e.jsx("div",{className:"ui-di__row-inner",children:e.jsxs("div",{className:"ui-di__item","data-open":b.open||void 0,"data-answered":b.answered?!0:void 0,children:[b.open?e.jsx("p",{className:"ui-di__title",dir:"auto",children:l.title}):e.jsx("button",{type:"button",className:"ui-di__title ui-di__title--folded",dir:"auto",title:l.title,"aria-expanded":!1,onClick:()=>v(l.id,{open:!0}),children:l.title}),e.jsx("div",{className:"ui-di__body","data-open":b.open||void 0,inert:!b.open,children:e.jsxs("div",{className:"ui-di__body-inner",children:[l.detail&&e.jsx("p",{className:"ui-di__detail",dir:"auto",children:l.detail}),e.jsx("div",{className:"ui-di__actions",children:b.answered?e.jsxs("span",{className:"ui-di__done",role:"status",children:[e.jsx(he,{}),e.jsx("span",{dir:"auto",children:b.answered})]}):e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",className:"ui-di__btn ui-di__btn--primary",dir:"auto",onClick:()=>L(l,"primary"),children:l.primary}),e.jsx("button",{type:"button",className:"ui-di__btn",dir:"auto",onClick:()=>L(l,"secondary"),children:l.secondary})]})})]})})]})})},l.id)}),e.jsx("p",{className:"ui-di__empty",children:"대기 중인 결정이 없습니다. 새로운 결정 요청이 여기에 표시됩니다."})]})]})]})}const Ie=()=>e.jsxs("svg",{viewBox:"0 0 16 16",width:"16",height:"16","aria-hidden":"true",children:[e.jsx("path",{d:"M6.7 2.3a1.5 1.5 0 0 1 2.6 0l5.4 9.4A1.5 1.5 0 0 1 13.4 14H2.6a1.5 1.5 0 0 1-1.3-2.3Z",fill:"currentColor"}),e.jsx("path",{d:"M8 5.6v3.6",stroke:"var(--klic-component-block-color-on-accent)",strokeWidth:"1.5",strokeLinecap:"round"}),e.jsx("circle",{cx:"8",cy:"11.4",r:"0.85",fill:"var(--klic-component-block-color-panel)"})]}),he=()=>e.jsxs("svg",{viewBox:"0 0 16 16",width:"16",height:"16","aria-hidden":"true",children:[e.jsx("circle",{cx:"8",cy:"8",r:"7",fill:"currentColor"}),e.jsx("path",{d:"m5 8.2 2 2 4-4.2",fill:"none",stroke:"var(--klic-component-block-color-on-accent)",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})]}),Fe=`
.ui-di {
  --ui-di-tray: var(--klic-component-block-color-soft);
  --ui-di-card: var(--klic-component-block-color-panel);
  --ui-di-line: var(--klic-component-block-color-border);
  --ui-di-ink: var(--klic-component-block-color-text);
  --ui-di-text: var(--klic-component-block-color-text);
  --ui-di-muted: var(--klic-component-block-color-muted);
  --ui-di-faint: var(--klic-component-block-color-muted);
  --ui-di-alert: var(--klic-component-block-color-accent);
  --ui-di-ok: var(--klic-component-block-color-accent);
  --ui-di-ease: cubic-bezier(0.22, 1, 0.36, 1);
  box-sizing: border-box;
  width: 100%;
  max-width: 440px;
  /* Like the Chat Composer: a gray tray with the heading, the white card sits on top of it */
  background: var(--ui-di-tray);
  /* The gray tray frames the white card on every side */
  padding: 6px;
  border-radius: 22px;
  font-family: var(--runtime-font, system-ui);
  color: var(--ui-di-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-di *, .ui-di *::before, .ui-di *::after { box-sizing: border-box; }
.ui-di button { margin: 0; font: inherit; cursor: pointer; }
.ui-di button:focus-visible { outline: 2px solid var(--klic-component-block-color-accent); outline-offset: 2px; }

.ui-di__head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 18px 10px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-di-alert);
  transition: color 300ms ease;
}
.ui-di[data-clear] .ui-di__head { color: var(--ui-di-ok); }

.ui-di__card {
  overflow: hidden;
  background: var(--ui-di-card);
  border: 1px solid var(--klic-component-block-color-panel);
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

/* Rows fold away with a height transition once answered */
.ui-di__row {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 460ms var(--ui-di-ease), opacity 300ms ease;
}
.ui-di__row[data-gone] { grid-template-rows: 0fr; opacity: 0; }
.ui-di__row-inner { min-height: 0; overflow: hidden; }
.ui-di__row + .ui-di__row .ui-di__item { border-top: 1px solid var(--ui-di-line); }
.ui-di__row[data-gone] + .ui-di__row .ui-di__item { border-top-color: transparent; }

.ui-di__item { padding: 16px 20px 14px; }
.ui-di__item:not([data-open]) { padding-bottom: 16px; }
.ui-di__title {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-align: start;
  color: var(--ui-di-ink);
  overflow-wrap: anywhere;
}
.ui-di__title--folded {
  /* Still one line however long the title – it opens in full on click */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--ui-di-faint);
  transition: color 160ms ease;
}
.ui-di__title--folded:hover { color: var(--ui-di-muted); }

.ui-di__body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 420ms var(--ui-di-ease);
}
.ui-di__body[data-open] { grid-template-rows: 1fr; }
/* Room around the buttons so the clipping for the fold never cuts their ring and shadow */
.ui-di__body-inner {
  min-height: 0;
  overflow: hidden;
  margin: 0 -4px -4px;
  padding: 0 4px 4px;
}
.ui-di__detail {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-di-muted);
  white-space: pre-line;
  overflow-wrap: anywhere;
}
.ui-di__actions {
  display: flex;
  align-items: center;
  /* Long or translated answers go on a second line instead of out of the card */
  flex-wrap: wrap;
  gap: 8px;
  min-height: 30px;
  margin-top: 12px;
}

.ui-di__btn {
  max-width: 100%;
  min-height: 30px;
  padding: 5px 12px;
  border: 0;
  border-radius: 9px;
  background: var(--klic-component-block-color-panel);
  box-shadow: 0 0 0 1px var(--klic-component-block-color-panel), 0 1px 2px rgba(0, 0, 0, 0.04);
  font-size: 13px !important;
  font-weight: 500;
  line-height: 20px;
  color: var(--ui-di-ink);
  overflow-wrap: anywhere;
  transition: background-color 160ms ease, transform 160ms ease;
}
.ui-di__btn:hover { background: var(--klic-component-block-color-panel); }
.ui-di__btn:active { transform: scale(0.98); }
.ui-di__btn--primary {
  background: linear-gradient(var(--klic-component-block-color-text), var(--klic-component-block-color-text));
  box-shadow: 0 0 0 1px var(--klic-component-block-color-text), 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  color: var(--klic-component-block-color-panel);
}
.ui-di__btn--primary:hover { background: linear-gradient(var(--klic-component-block-color-text), var(--klic-component-block-color-text)); }

.ui-di__done {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  max-width: 100%;
  color: var(--ui-di-ok);
  overflow-wrap: anywhere;
  animation: ui-di-in 360ms var(--ui-di-ease);
}
.ui-di__done > span { min-width: 0; }

.ui-di__empty {
  display: none;
  margin: 0;
  padding: 18px 20px;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-di-muted);
}
.ui-di[data-clear] .ui-di__empty { display: block; animation: ui-di-in 420ms var(--ui-di-ease) 300ms both; }

@keyframes ui-di-in {
  from { opacity: 0; transform: translateY(3px); }
}

@media (prefers-reduced-motion: reduce) {
  .ui-di__row, .ui-di__body { transition: none; }
  .ui-di__done, .ui-di__empty { animation: none !important; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-di {
  --ui-di-tray: var(--klic-component-block-color-soft);
  --ui-di-card: var(--klic-component-block-color-panel);
  --ui-di-line: var(--klic-component-block-color-border);
  --ui-di-ink: var(--klic-component-block-color-text);
  --ui-di-text: var(--klic-component-block-color-text);
  --ui-di-muted: var(--klic-component-block-color-muted);
  --ui-di-faint: var(--klic-component-block-color-muted);
  --ui-di-alert: var(--klic-component-block-color-accent);
  --ui-di-ok: var(--klic-component-block-color-accent);
}
:where(.dark, [data-theme="dark"]) .ui-di__card {
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}
:where(.dark, [data-theme="dark"]) .ui-di__btn {
  background: var(--klic-component-block-color-accent);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.4);
}
:where(.dark, [data-theme="dark"]) .ui-di__btn:hover { background: var(--klic-component-block-color-accent); }
/* The dark primary button inverts, like on the site */
:where(.dark, [data-theme="dark"]) .ui-di__btn--primary {
  background: linear-gradient(var(--klic-component-block-color-panel), var(--klic-component-block-color-panel));
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 var(--klic-component-block-color-panel);
  color: var(--klic-component-block-color-text);
}
:where(.dark, [data-theme="dark"]) .ui-di__btn--primary:hover { background: linear-gradient(var(--klic-component-block-color-panel), var(--klic-component-block-color-panel)); }
`;function xe({name:i,summary:o,icon:p,status:c,args:m,result:j,error:v,startedAt:M,duration:z,defaultOpen:L=!1,open:l,onOpenChange:b,openOnError:_=!0,onRetry:w,maxCodeHeight:y=220,className:O}){const D=r.useId(),[B,f]=r.useState(L),F=l??B,A=x=>{l===void 0&&f(x),b?.(x)},[E,T]=r.useState(c),[g,R]=r.useState(!1);c!==E&&(T(c),l===void 0&&_&&(c==="error"&&!B?(f(!0),R(!0)):E==="error"&&g&&(f(!1),R(!1))));const k=ye(c==="running",M,!1),I=c==="running"?k??0:z??k,Y=c==="running"?`${i} 실행 중`:c==="success"?`${i} 실행 완료`:`${i} 실행 실패${v?`: ${v}`:""}`;return e.jsxs("div",{className:["ui-tc",O].filter(Boolean).join(" "),"data-status":c,"data-open":F||void 0,children:[e.jsx("style",{href:"ui-tool-call",precedence:"default",children:Ne}),e.jsx("span",{className:"ui-tc-sr",role:"status","aria-live":"polite",children:Y}),e.jsxs("button",{type:"button",className:"ui-tc__head","aria-expanded":F,"aria-controls":`${D}-body`,onClick:()=>{R(!1),A(!F)},children:[e.jsx("span",{className:"ui-tc__icon","aria-hidden":"true",children:p??e.jsx(we,{})}),e.jsxs("span",{className:"ui-tc__main",children:[e.jsx("code",{className:"ui-tc__name",title:i,children:i}),o!=null&&e.jsx("span",{className:"ui-tc__summary",dir:"auto",title:typeof o=="string"?o:void 0,children:o})]}),e.jsxs("span",{className:"ui-tc__status",children:[c==="running"&&e.jsx(De,{}),c==="success"&&e.jsx("svg",{className:"ui-tc__ok",viewBox:"0 0 16 16","aria-hidden":"true",children:e.jsx("path",{d:"M3.5 8.4 6.6 11.3 12.5 4.9",pathLength:1})}),c==="error"&&e.jsx(ge,{}),e.jsx("span",{className:"ui-tc__time",children:c==="error"?"실패":I!=null?je(I,c==="running"):null})]},c),e.jsx(ke,{})]}),e.jsx("div",{className:"ui-tc__body",id:`${D}-body`,inert:!F,children:e.jsx("div",{className:"ui-tc__clip",children:e.jsxs("div",{className:"ui-tc__sections",children:[c==="error"&&e.jsxs("div",{className:"ui-tc__error",children:[e.jsx(ge,{}),e.jsx("p",{className:"ui-tc__error-text",dir:"auto",children:v??"도구 실행에 실패했습니다."}),w&&e.jsxs("button",{type:"button",className:"ui-tc__retry",onClick:w,children:[e.jsxs("svg",{viewBox:"0 0 16 16","aria-hidden":"true",children:[e.jsx("path",{d:"M2.75 8a5.25 5.25 0 1 0 1.6-3.77"}),e.jsx("path",{d:"M2.5 2.5v2.75h2.75"})]}),"재시도"]})]}),m!==void 0&&e.jsx(fe,{label:"입력값",value:m,cap:y}),j!==void 0?e.jsx(fe,{label:"실행 결과",value:j,cap:y}):c==="running"?e.jsxs("div",{className:"ui-tc__section",children:[e.jsx("div",{className:"ui-tc__section-head",children:e.jsx("span",{className:"ui-tc__label",children:"실행 결과"})}),e.jsx("p",{className:"ui-tc__pending",children:"실행 결과를 기다립니다…"})]}):null,m===void 0&&j===void 0&&c==="success"&&e.jsx("p",{className:"ui-tc__pending",children:"입력값과 실행 결과가 없습니다."})]})})})]})}function Pe({children:i,label:o,runningLabel:p="도구 실행 중…",duration:c,defaultOpen:m=!1,open:j,onOpenChange:v,className:M}){const z=r.useId(),[L,l]=r.useState(m),b=j??L,_=r.Children.toArray(i).filter(r.isValidElement).map(T=>T.props),w=_.some(T=>T.status==="running"),y=_.filter(T=>T.status==="error").length,O=_.reduce((T,g)=>g.status==="running"&&g.startedAt!=null&&(T==null||g.startedAt<T)?g.startedAt:T,void 0),D=ye(w,O,!0),B=_.length&&_.every(T=>T.duration!=null)?_.reduce((T,g)=>T+(g.duration??0),0):null,f=w?D:c??B??D,F=`도구 ${_.length.toLocaleString("ko-KR")}개 사용`,A=w?p:o??F,E=_.slice(-3);return e.jsxs("div",{className:["ui-tc-group",M].filter(Boolean).join(" "),"data-running":w||void 0,"data-open":b||void 0,children:[e.jsx("style",{href:"ui-tool-call",precedence:"default",children:Ne}),e.jsx("span",{className:"ui-tc-sr",role:"status","aria-live":"polite",children:w?p:`${F}${y?`, ${y}개 실패`:""}`}),e.jsxs("button",{type:"button",className:"ui-tc-group__head","aria-expanded":b,"aria-controls":`${z}-list`,onClick:()=>{j===void 0&&l(!b),v?.(!b)},children:[e.jsx("span",{className:"ui-tc-group__stack","aria-hidden":"true",children:E.map((T,g)=>e.jsx("span",{className:"ui-tc__icon",children:T.icon??e.jsx(we,{})},_.length-E.length+g))}),e.jsxs("span",{className:"ui-tc-group__title",children:[e.jsx("span",{className:w?"ui-tc-group__label ui-tc__shine":"ui-tc-group__label","data-text":A,children:A}),!w&&y>0&&e.jsxs("span",{className:"ui-tc-group__failed",children:["· ",y,"개 실패"]}),f!=null&&e.jsxs("span",{className:"ui-tc-group__time",children:["· ",je(f,w)]})]},w?"busy":"done"),e.jsx(ke,{})]}),e.jsx("div",{className:"ui-tc__body",id:`${z}-list`,inert:!b,children:e.jsx("div",{className:"ui-tc__clip",children:e.jsx("div",{className:"ui-tc-group__list",children:i})})})]})}const _e=640;function fe({label:i,value:o,cap:p}){const{text:c,json:m}=He(o),j=r.useRef(null),[v,M]=r.useState(!1),[z,L]=r.useState(0);r.useLayoutEffect(()=>{const b=j.current,_=b?.firstElementChild;if(!b||!_)return;const w=()=>L(b.scrollHeight);w();const y=new ResizeObserver(w);return y.observe(_),()=>y.disconnect()},[c]);const l=z>p+24;return e.jsxs("div",{className:"ui-tc__section",children:[e.jsxs("div",{className:"ui-tc__section-head",children:[e.jsx("span",{className:"ui-tc__label",children:i}),e.jsx(Oe,{text:c,label:i.toLowerCase()})]}),e.jsx("pre",{ref:j,className:"ui-tc__code","data-capped":l&&!v||void 0,"data-scroll":l&&v&&z>_e||void 0,style:l?{maxHeight:v?Math.min(z,_e):p}:void 0,children:e.jsx("code",{children:m?Ke(c):c})}),l&&e.jsx("button",{type:"button",className:"ui-tc__more","aria-expanded":v,onClick:()=>M(!v),children:v?"접기":"전체 보기"})]})}function Oe({text:i,label:o}){const[p,c]=r.useState(!1);return r.useEffect(()=>{if(!p)return;const m=window.setTimeout(()=>c(!1),1400);return()=>window.clearTimeout(m)},[p]),e.jsxs("button",{type:"button",className:"ui-tc__copy","data-copied":p||void 0,"aria-label":p?"복사 완료":`복사: ${o}`,title:p?"복사 완료":`복사: ${o}`,onClick:()=>We(i).then(m=>m&&c(!0)),children:[e.jsxs("svg",{className:"ui-tc__copy-icon",viewBox:"0 0 16 16","aria-hidden":"true",children:[e.jsx("rect",{x:"5.25",y:"5.25",width:"8",height:"8",rx:"2"}),e.jsx("path",{d:"M10.75 5.25v-1a1.5 1.5 0 0 0-1.5-1.5h-4.5a2 2 0 0 0-2 2v4.5a1.5 1.5 0 0 0 1.5 1.5h1"})]}),e.jsx("svg",{className:"ui-tc__copy-done",viewBox:"0 0 16 16","aria-hidden":"true",children:e.jsx("path",{d:"M3.5 8.4 6.6 11.3 12.5 4.9",pathLength:1})})]})}function De(){return e.jsxs("svg",{className:"ui-tc__spinner",viewBox:"0 0 16 16","aria-hidden":"true",children:[e.jsx("circle",{cx:"8",cy:"8",r:"5.75"}),e.jsx("path",{d:"M8 2.25a5.75 5.75 0 0 1 5.75 5.75"})]})}function ge(){return e.jsxs("svg",{className:"ui-tc__err",viewBox:"0 0 16 16","aria-hidden":"true",children:[e.jsx("circle",{cx:"8",cy:"8",r:"6"}),e.jsx("path",{d:"M8 5v3.4M8 10.9v.1"})]})}function ke(){return e.jsx("svg",{className:"ui-tc__chevron",viewBox:"0 0 16 16","aria-hidden":"true",children:e.jsx("path",{d:"M4.5 6.25 8 9.75l3.5-3.5"})})}function we(){return e.jsx("svg",{viewBox:"0 0 16 16",children:e.jsx("path",{d:"M10.2 2.4a3.5 3.5 0 0 0-4.3 4.6L2.6 10.3a1.4 1.4 0 0 0 2 2L7.9 9a3.5 3.5 0 0 0 4.6-4.3l-2 2-1.6-.4-.4-1.6 1.7-2.3Z"})})}function ye(i,o,p){const c=r.useRef(null),m=r.useRef(0),[j,v]=r.useState(null);return r.useEffect(()=>{if(!i){c.current!==null&&(m.current+=Date.now()-c.current,c.current=null,v(m.current));return}p||(m.current=0),c.current=o??Date.now();const M=()=>v(m.current+Date.now()-(c.current??Date.now()));M();const z=window.setInterval(M,100);return()=>window.clearInterval(z)},[i,o,p]),j}function je(i,o){if(!o&&i<1e3)return`${Math.max(1,Math.round(i))}ms`;if(i<6e4)return`${(Math.floor(i/100)/10).toFixed(1)}초`;const p=Math.floor(i/1e3);if(p<3600)return`${Math.floor(p/60)}분 ${String(p%60).padStart(2,"0")}초`;const c=Math.floor(p/3600);return c<24?`${c}시간 ${String(Math.floor(p/60)%60).padStart(2,"0")}분`:`${Math.floor(c/24)}일 ${c%24}시간`}function He(i){if(typeof i=="string"){const o=i.trim();if(o.startsWith("{")||o.startsWith("["))try{return{text:JSON.stringify(JSON.parse(o),null,2),json:!0}}catch{}return{text:i,json:!1}}try{const o=JSON.stringify(i,null,2);return o===void 0?{text:String(i),json:!1}:{text:o,json:!0}}catch{return{text:String(i),json:!1}}}const Ye=/("(?:[^"\\]|\\.)*")(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;function Ke(i){const o=[],p=new RegExp(Ye.source,"g");let c=0,m;for(;m=p.exec(i);){if(m.index>c&&o.push(i.slice(c,m.index)),m[1]&&m[2])o.push(e.jsx("span",{className:"ui-tc__t-key",children:m[1]},m.index),m[2]);else{const j=m[1]?"str":/^[tfn]/.test(m[0])?"lit":"num";o.push(e.jsx("span",{className:`ui-tc__t-${j}`,children:m[0]},m.index))}c=m.index+m[0].length}return c<i.length&&o.push(i.slice(c)),o}async function We(i){try{return await navigator.clipboard.writeText(i),!0}catch{const o=document.createElement("textarea");o.value=i,o.style.cssText="position:fixed;opacity:0",document.body.appendChild(o),o.select();const p=document.execCommand("copy");return o.remove(),p}}const Ne=`
.ui-tc,
.ui-tc-group {
  --ui-tc-ink: var(--klic-component-block-color-text);
  --ui-tc-text: var(--klic-component-block-color-text);
  --ui-tc-muted: var(--klic-component-block-color-muted);
  --ui-tc-bg: var(--klic-component-block-color-panel);
  --ui-tc-line: var(--klic-component-block-color-border);
  --ui-tc-hover: var(--klic-component-block-color-soft);
  --ui-tc-tile: var(--klic-component-block-color-soft);
  --ui-tc-code: var(--klic-component-block-color-soft);
  --ui-tc-ring: var(--klic-component-block-color-panel);
  --ui-tc-red: var(--klic-component-block-color-danger);
  --ui-tc-red-bg: var(--klic-component-block-color-danger-surface);
  --ui-tc-red-line: var(--klic-component-block-color-danger);
  --ui-tc-key: var(--klic-component-block-color-text);
  --ui-tc-str: var(--klic-component-block-color-accent);
  --ui-tc-num: var(--klic-component-block-color-warning);
  --ui-tc-lit: var(--klic-component-block-color-accent);
  --ui-tc-shine: var(--klic-component-block-color-panel);
  --ui-tc-focus: var(--klic-component-block-color-accent);
  --ui-tc-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --ui-tc-mono: ui-monospace, "SF Mono", Menlo, monospace;
  box-sizing: border-box;
  min-width: 0;
  color: var(--ui-tc-text);
  font-family: var(--runtime-font, system-ui);
  font-size: 13.5px;
  line-height: 1.4;
  letter-spacing: -0.006em;
  -webkit-font-smoothing: antialiased;
}
.ui-tc *,
.ui-tc-group * { box-sizing: border-box; }

.ui-tc {
  position: relative;
  border-radius: 12px;
  background: var(--ui-tc-bg);
  box-shadow: inset 0 0 0 1px var(--ui-tc-line), 0 1px 2px rgba(0, 0, 0, 0.04);
}
.ui-tc-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

/* Header: icon, name + summary, status, chevron – everything truncates before it overflows */
.ui-tc__head {
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 44px;
  padding: 8px 10px 8px 9px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 160ms ease;
}
.ui-tc[data-open] .ui-tc__head { border-radius: 12px 12px 0 0; }
.ui-tc__head:focus-visible,
.ui-tc-group__head:focus-visible,
.ui-tc__copy:focus-visible,
.ui-tc__more:focus-visible,
.ui-tc__retry:focus-visible {
  outline: 2px solid var(--ui-tc-focus);
  outline-offset: 2px;
}
@media (hover: hover) {
  .ui-tc__head:hover { background: var(--ui-tc-hover); }
  .ui-tc-group__head:hover { background: var(--ui-tc-hover); color: var(--ui-tc-ink); }
  .ui-tc__copy:hover { background: var(--ui-tc-hover); color: var(--ui-tc-ink); }
  .ui-tc__more:hover { color: var(--ui-tc-ink); }
  .ui-tc__retry:hover { background: var(--ui-tc-hover); }
}

.ui-tc__icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: var(--ui-tc-tile);
  box-shadow: inset 0 0 0 1px var(--ui-tc-line);
  color: var(--ui-tc-ink);
}
.ui-tc__icon > svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }

.ui-tc__main {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex: 1;
  min-width: 0;
}
.ui-tc__name {
  flex: 0 1 auto;
  max-width: 55%;
  overflow: hidden;
  color: var(--ui-tc-ink);
  font-family: var(--ui-tc-mono);
  font-size: 12.5px;
  font-weight: 500;
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ui-tc__summary {
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  color: var(--ui-tc-text);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ui-tc__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: none;
  color: var(--ui-tc-muted);
  font-size: 12.5px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  animation: ui-tc-in 360ms var(--ui-tc-ease) both;
}
.ui-tc[data-status="error"] .ui-tc__status { color: var(--ui-tc-red); }
.ui-tc__status > svg { width: 14px; height: 14px; flex: none; fill: none; stroke-linecap: round; stroke-linejoin: round; }
.ui-tc__spinner circle { stroke: currentColor; stroke-width: 1.6; opacity: 0.22; }
.ui-tc__spinner path { stroke: var(--ui-tc-ink); stroke-width: 1.6; }
.ui-tc__spinner { animation: ui-tc-spin 800ms linear infinite; }
.ui-tc__ok { stroke: var(--ui-tc-ink); stroke-width: 1.8; }
.ui-tc__ok path { stroke-dasharray: 1; stroke-dashoffset: 1; animation: ui-tc-draw 360ms var(--ui-tc-ease) 80ms forwards; }
.ui-tc__err { stroke: var(--ui-tc-red); stroke-width: 1.5; }

.ui-tc__chevron {
  flex: none;
  width: 14px;
  height: 14px;
  fill: none;
  stroke: var(--ui-tc-muted);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 360ms var(--ui-tc-ease);
}
.ui-tc[data-open] > .ui-tc__head .ui-tc__chevron,
.ui-tc-group[data-open] > .ui-tc-group__head .ui-tc__chevron { transform: rotate(180deg); }

/* Body: grows from 0fr to 1fr, so the height animates without measuring */
.ui-tc__body {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 380ms var(--ui-tc-ease), opacity 240ms ease;
}
.ui-tc[data-open] > .ui-tc__body,
.ui-tc-group[data-open] > .ui-tc__body {
  grid-template-rows: 1fr;
  opacity: 1;
}
.ui-tc__clip { min-height: 0; overflow: hidden; }
.ui-tc__sections {
  display: grid;
  gap: 12px;
  padding: 12px;
  border-top: 1px solid var(--ui-tc-line);
}

.ui-tc__section { display: grid; gap: 6px; min-width: 0; }
.ui-tc__section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 24px;
}
.ui-tc__label { color: var(--ui-tc-muted); font-size: 12px; font-weight: 500; }
.ui-tc__pending { margin: 0; color: var(--ui-tc-muted); font-size: 12.5px; }

.ui-tc__copy {
  all: unset;
  position: relative;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  color: var(--ui-tc-muted);
  cursor: pointer;
  transition: background-color 160ms ease, color 160ms ease;
}
.ui-tc__copy svg {
  position: absolute;
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: opacity 200ms ease, transform 320ms var(--ui-tc-ease), filter 200ms ease;
}
.ui-tc__copy-done { opacity: 0; transform: scale(0.6); filter: blur(2px); stroke-width: 1.7; }
.ui-tc__copy[data-copied] { color: var(--ui-tc-ink); }
.ui-tc__copy[data-copied] .ui-tc__copy-icon { opacity: 0; transform: scale(0.6); filter: blur(2px); }
.ui-tc__copy[data-copied] .ui-tc__copy-done { opacity: 1; transform: none; filter: none; }

/* Code: wraps instead of scrolling sideways; capped blocks fade out at the bottom */
.ui-tc__code {
  position: relative;
  margin: 0;
  padding: 10px 12px;
  overflow: hidden;
  border-radius: 8px;
  background: var(--ui-tc-code);
  box-shadow: inset 0 0 0 1px var(--ui-tc-line);
  color: var(--ui-tc-muted);
  font-family: var(--ui-tc-mono);
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  tab-size: 2;
  transition: max-height 420ms var(--ui-tc-ease);
}
.ui-tc__code code { display: block; font: inherit; }
.ui-tc__code::after {
  content: "";
  position: absolute;
  left: 1px;
  right: 1px;
  bottom: 1px;
  height: 56px;
  border-radius: 0 0 7px 7px;
  background: linear-gradient(to bottom, transparent, var(--ui-tc-code));
  opacity: 0;
  transition: opacity 240ms ease;
  pointer-events: none;
}
.ui-tc__code[data-capped]::after { opacity: 1; }
.ui-tc__code[data-scroll] { overflow-y: auto; overscroll-behavior: contain; }
.ui-tc__t-key { color: var(--ui-tc-key); }
.ui-tc__t-str { color: var(--ui-tc-str); }
.ui-tc__t-num { color: var(--ui-tc-num); }
.ui-tc__t-lit { color: var(--ui-tc-lit); }

.ui-tc__more {
  all: unset;
  justify-self: start;
  padding: 2px 4px;
  margin-left: -4px;
  border-radius: 5px;
  color: var(--ui-tc-text);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  transition: color 160ms ease;
}

/* Error: the message and an optional retry */
.ui-tc__error {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 9px 10px 9px 11px;
  border-radius: 8px;
  background: var(--ui-tc-red-bg);
  box-shadow: inset 0 0 0 1px var(--ui-tc-red-line);
}
.ui-tc__error > .ui-tc__err { flex: none; width: 14px; height: 14px; margin-top: 2px; fill: none; stroke-linecap: round; }
.ui-tc__error-text {
  flex: 1;
  min-width: 0;
  max-height: 200px;
  margin: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  white-space: pre-line;
  color: var(--ui-tc-red);
  font-size: 13px;
  line-height: 1.45;
  overflow-wrap: anywhere;
}
.ui-tc__retry {
  all: unset;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex: none;
  height: 26px;
  margin: -3px 0;
  padding: 0 10px 0 8px;
  border-radius: 7px;
  background: var(--ui-tc-bg);
  box-shadow: inset 0 0 0 1px var(--ui-tc-line), 0 1px 2px rgba(0, 0, 0, 0.04);
  color: var(--ui-tc-ink);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 160ms ease;
}
.ui-tc__retry svg { width: 13px; height: 13px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.ui-tc__retry:active svg { transform: rotate(-60deg); transition: transform 200ms var(--ui-tc-ease); }

/* Group: one quiet line with the tool icons stacked, the cards below */
.ui-tc-group { display: grid; }
.ui-tc-group__head {
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 9px;
  justify-self: start;
  max-width: 100%;
  min-height: 36px;
  padding: 4px 10px 4px 5px;
  border-radius: 10px;
  color: var(--ui-tc-text);
  cursor: pointer;
  transition: background-color 160ms ease, color 160ms ease;
}
.ui-tc-group__stack { display: flex; flex: none; }
.ui-tc-group__stack .ui-tc__icon {
  width: 24px;
  height: 24px;
  border-radius: 7px;
  box-shadow: inset 0 0 0 1px var(--ui-tc-line), 0 0 0 2px var(--ui-tc-ring);
  animation: ui-tc-pop 420ms var(--ui-tc-ease) both;
}
.ui-tc-group__stack .ui-tc__icon + .ui-tc__icon { margin-left: -5px; }
.ui-tc-group__stack .ui-tc__icon > svg { width: 13px; height: 13px; }
.ui-tc-group__title {
  display: flex;
  align-items: baseline;
  gap: 5px;
  min-width: 0;
  white-space: nowrap;
  animation: ui-tc-in 360ms var(--ui-tc-ease) both;
}
.ui-tc-group__label {
  position: relative;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  color: inherit;
  font-weight: 500;
}
.ui-tc-group__failed { flex: none; color: var(--ui-tc-red); }
.ui-tc-group__time { flex: none; color: var(--ui-tc-muted); font-variant-numeric: tabular-nums; }
.ui-tc-group__list { display: grid; gap: 8px; padding-top: 8px; }

/* A soft light sweeping over "Using tools…" */
.ui-tc__shine::after {
  content: attr(data-text);
  content: attr(data-text) / "";
  position: absolute;
  inset: 0;
  white-space: nowrap;
  color: transparent;
  background: linear-gradient(90deg, transparent 38%, var(--ui-tc-shine) 50%, transparent 62%) 100% 0 / 300% 100% no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  animation: ui-tc-sweep 1.8s linear infinite;
  pointer-events: none;
}

@keyframes ui-tc-in {
  from { opacity: 0; transform: translateY(3px); filter: blur(2px); }
  to { opacity: 1; transform: none; filter: none; }
}
@keyframes ui-tc-pop {
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 1; transform: none; }
}
@keyframes ui-tc-spin { to { transform: rotate(360deg); } }
@keyframes ui-tc-draw { to { stroke-dashoffset: 0; } }
@keyframes ui-tc-sweep {
  from { background-position: 100% 0; }
  to { background-position: 0% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .ui-tc *,
  .ui-tc-group *,
  .ui-tc *::after,
  .ui-tc-group *::after {
    animation-duration: 1ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }
  .ui-tc__shine::after { display: none; }
  .ui-tc__ok path { stroke-dashoffset: 0; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-tc,
:where(.dark, [data-theme="dark"]) .ui-tc-group {
  --ui-tc-ink: var(--klic-component-block-color-text);
  --ui-tc-text: var(--klic-component-block-color-text);
  --ui-tc-muted: var(--klic-component-block-color-muted);
  --ui-tc-bg: var(--klic-component-block-color-panel);
  --ui-tc-line: var(--klic-component-block-color-border);
  --ui-tc-hover: var(--klic-component-block-color-soft);
  --ui-tc-tile: var(--klic-component-block-color-soft);
  --ui-tc-code: var(--klic-component-block-color-soft);
  --ui-tc-ring: var(--klic-component-block-color-panel);
  --ui-tc-red: var(--klic-component-block-color-danger);
  --ui-tc-red-bg: var(--klic-component-block-color-danger-surface);
  --ui-tc-red-line: var(--klic-component-block-color-danger);
  --ui-tc-key: var(--klic-component-block-color-text);
  --ui-tc-str: var(--klic-component-block-color-accent);
  --ui-tc-num: var(--klic-component-block-color-warning);
  --ui-tc-lit: var(--klic-component-block-color-accent);
  --ui-tc-shine: var(--klic-component-block-color-panel);
  --ui-tc-focus: var(--klic-component-block-color-accent);
}
:where(.dark, [data-theme="dark"]) .ui-tc { box-shadow: inset 0 0 0 1px var(--ui-tc-line); }
`,ne=["신호 없음","참고 수준","근거 보통","근거 충분"],oe=i=>{const o=Math.round(Number(i));return Number.isFinite(o)?Math.min(3,Math.max(0,o)):0};function Ue({title:i="검토할 추천",options:o,onAccept:p,onUndo:c,defaultOpen:m=!0,className:j}){const[v,M]=r.useState(0),[z,L]=r.useState(null),[l,b]=r.useState(m),[_,w]=r.useState(!1),y=r.useRef(null),[O,D]=r.useState(!1);r.useLayoutEffect(()=>{const g=y.current,R=g?.querySelector(".ui-sr__menu"),k=g?.closest(".ui-sr");if(!_||!g||!R||!k||getComputedStyle(g).position==="static")return D(!1);D(g.getBoundingClientRect().right-R.offsetWidth<k.getBoundingClientRect().left-24)},[_]),r.useEffect(()=>{if(!_)return;const g=k=>!y.current?.contains(k.target)&&w(!1),R=k=>k.key==="Escape"&&w(!1);return window.addEventListener("pointerdown",g),window.addEventListener("keydown",R),()=>{window.removeEventListener("pointerdown",g),window.removeEventListener("keydown",R)}},[_]);const B=v<o.length?v:0,f=o[B];if(!f)return null;const F=B===0,A=z===B,E=oe(f.signal),T=`${String(f.label)} 수락`;return e.jsxs(e.Fragment,{children:[e.jsx("style",{href:"ui-smart-recommendation",precedence:"default",children:Xe}),e.jsxs("section",{className:["ui-sr",j].filter(Boolean).join(" "),"aria-label":i,"data-accepted":A||void 0,children:[e.jsxs("div",{className:"ui-sr__card","data-klic-surface":"card",children:[e.jsxs("button",{type:"button",className:"ui-sr__head","aria-expanded":l,onClick:()=>b(g=>!g),children:[e.jsx(Ve,{}),e.jsx("span",{className:"ui-sr__title",dir:"auto",title:i,children:i}),!F&&e.jsx("span",{className:"ui-sr__pill",children:"대안"}),e.jsx("span",{className:"ui-sr__chevron",children:e.jsx(ve,{d:"m4.5 6.25 3.5 3.5 3.5-3.5"})})]}),e.jsx("div",{className:"ui-sr__body","data-open":l||void 0,inert:!l,children:e.jsx("p",{className:"ui-sr__reason",dir:"auto",children:f.reason},B)})]}),e.jsxs("footer",{className:"ui-sr__foot",children:[e.jsxs("span",{className:"ui-sr__signal","data-level":E,title:ne[E],children:[e.jsx("span",{className:"ui-sr__bars","aria-hidden":"true",children:[1,2,3].map(g=>e.jsx("span",{"data-on":E>=g||void 0},g))}),ne[E]]}),e.jsxs("div",{className:"ui-sr__actions",children:[o.length>1&&!A&&e.jsxs("div",{className:"ui-sr__alt",ref:y,children:[e.jsx("button",{type:"button",className:"ui-sr__btn","aria-haspopup":"menu","aria-expanded":_,onClick:()=>w(g=>!g),children:"다른 선택"}),_&&e.jsx("div",{className:"ui-sr__menu",role:"menu","data-flip":O||void 0,children:o.map((g,R)=>e.jsxs("button",{type:"button",role:"menuitemradio","aria-checked":R===B,className:"ui-sr__option",onClick:()=>{M(R),w(!1),b(!0)},children:[e.jsxs("span",{className:"ui-sr__option-label",children:[e.jsx("span",{className:"ui-sr__option-name",dir:"auto",title:g.label,children:g.label}),R===0&&e.jsx("span",{className:"ui-sr__tag",children:"추천"})]}),e.jsx("span",{className:"ui-sr__mini","data-level":oe(g.signal),"aria-label":ne[oe(g.signal)],children:[1,2,3].map(k=>e.jsx("span",{"data-on":oe(g.signal)>=k||void 0},k))})]},`${g.id}-${R}`))})]}),A?e.jsxs(e.Fragment,{children:[e.jsxs("span",{className:"ui-sr__done",role:"status",children:[e.jsx(ve,{d:"m3.5 8.5 3 3 6-7",size:14}),e.jsxs("span",{className:"ui-sr__done-text",title:`${f.label} 수락됨`,children:[e.jsx("bdi",{children:f.label})," 수락됨"]})]}),e.jsx("button",{type:"button",className:"ui-sr__btn",onClick:()=>{L(null),c?.(f)},children:"되돌리기"})]}):e.jsx("button",{type:"button",className:"ui-sr__btn ui-sr__btn--primary",title:T,onClick:()=>{L(B),w(!1),p?.(f)},children:e.jsx("span",{className:"ui-sr__btn-text",children:T})})]})]})]})]})}const Ve=()=>e.jsxs("svg",{className:"ui-sr__spark",viewBox:"0 0 16 16",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[e.jsx("path",{d:"M9 3.5H4A1.5 1.5 0 0 0 2.5 5v7A1.5 1.5 0 0 0 4 13.5h7a1.5 1.5 0 0 0 1.5-1.5V8"}),e.jsx("path",{d:"M12.5 1.5v4M10.5 3.5h4"})]}),ve=({d:i,size:o=16})=>e.jsx("svg",{viewBox:"0 0 16 16",width:o,height:o,fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e.jsx("path",{d:i})}),Xe=`
.ui-sr {
  --ui-sr-tray: var(--klic-component-block-color-soft);
  --ui-sr-card: var(--klic-component-block-color-panel);
  --ui-sr-ink: var(--klic-component-block-color-text);
  --ui-sr-text: var(--klic-component-block-color-text);
  --ui-sr-muted: var(--klic-component-block-color-muted);
  --ui-sr-accent: var(--klic-component-block-color-accent);
  --ui-sr-ok: var(--klic-component-block-color-accent);
  --ui-sr-accent-text: var(--klic-component-block-color-accent);
  --ui-sr-border: var(--klic-component-block-color-border);
  --ui-sr-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  --ui-sr-head-hover: var(--klic-component-block-color-soft);
  --ui-sr-pill: var(--klic-component-block-color-selected);
  --ui-sr-pill-text: var(--klic-component-block-color-accent);
  --ui-sr-bar: var(--klic-component-block-color-border);
  --ui-sr-btn: var(--klic-component-block-color-panel);
  --ui-sr-btn-hover: var(--klic-component-block-color-soft);
  --ui-sr-menu: var(--klic-component-block-color-panel);
  --ui-sr-option-hover: var(--klic-component-block-color-soft);
  --ui-sr-option-on: var(--klic-component-block-color-selected);
  --ui-sr-tag: var(--klic-component-block-color-selected);
  --ui-sr-ease: cubic-bezier(0.22, 1, 0.36, 1);
  box-sizing: border-box;
  width: 100%;
  max-width: 440px;
  container-type: inline-size;
  /* Like the Chat Composer: the white card on a gray tray, the actions live in the tray below */
  background: var(--ui-sr-tray);
  /* The gray tray frames the white card on every side */
  padding: 6px;
  border-radius: 22px;
  font-family: var(--runtime-font, system-ui);
  color: var(--ui-sr-ink);
  -webkit-font-smoothing: antialiased;
}
.ui-sr *, .ui-sr *::before, .ui-sr *::after { box-sizing: border-box; }
.ui-sr button { margin: 0; font: inherit; color: inherit; cursor: pointer; }
.ui-sr button:focus-visible { outline: 2px solid var(--ui-sr-accent); outline-offset: 2px; }

.ui-sr__card {
  padding: 6px 8px 8px;
  background: var(--ui-sr-card);
  border: 1px solid var(--ui-sr-border);
  border-radius: 16px;
  box-shadow: var(--ui-sr-shadow);
}
.ui-sr__head {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 40px;
  padding: 0 10px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  text-align: left;
  transition: background-color 140ms ease;
}
.ui-sr__head:hover { background: var(--ui-sr-head-hover); }
.ui-sr__spark { flex: none; color: var(--ui-sr-accent-text); }
.ui-sr__title { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 15px; font-weight: 500; }
.ui-sr__pill {
  flex: none;
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--ui-sr-pill);
  font-size: 11.5px;
  font-weight: 500;
  color: var(--ui-sr-pill-text);
}
.ui-sr__chevron { display: grid; margin-left: auto; color: var(--ui-sr-muted); transition: transform 280ms var(--ui-sr-ease); }
.ui-sr__head[aria-expanded="false"] .ui-sr__chevron { transform: rotate(-90deg); }
.ui-sr__body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 340ms var(--ui-sr-ease);
}
.ui-sr__body[data-open] { grid-template-rows: 1fr; }
.ui-sr__reason {
  min-height: 0;
  overflow: hidden;
  margin: 0;
  padding: 0 10px;
  font-size: 14px;
  line-height: 21px;
  color: var(--ui-sr-text);
  text-align: start;
  white-space: pre-line;
  overflow-wrap: anywhere;
  animation: ui-sr-swap 360ms var(--ui-sr-ease);
}
.ui-sr__body[data-open] .ui-sr__reason { padding-bottom: 8px; }
.ui-sr__reason strong { font-weight: 500; color: var(--ui-sr-ink); }

.ui-sr__foot {
  display: flex;
  align-items: center;
  /* Narrow containers: the actions move below the signal instead of running out of the tray */
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 10px;
  min-height: 50px;
  padding: 8px 8px 8px 16px;
}
.ui-sr__signal {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  white-space: nowrap;
  color: var(--ui-sr-muted);
}
.ui-sr__bars, .ui-sr__mini { display: inline-flex; align-items: flex-end; gap: 2px; }
.ui-sr__bars span, .ui-sr__mini span {
  width: 3px;
  border-radius: 1px;
  background: var(--ui-sr-bar);
  transition: background-color 260ms ease;
}
.ui-sr__bars span:nth-child(1), .ui-sr__mini span:nth-child(1) { height: 6px; }
.ui-sr__bars span:nth-child(2), .ui-sr__mini span:nth-child(2) { height: 9px; }
.ui-sr__bars span:nth-child(3), .ui-sr__mini span:nth-child(3) { height: 12px; }
/* Scoped to the card, so other components with data-level on the page keep their colors */
.ui-sr [data-level="1"] > span[data-on] { background: var(--klic-component-block-color-danger); }
.ui-sr [data-level="2"] > span[data-on] { background: var(--ui-sr-accent); }
.ui-sr [data-level="3"] > span[data-on] { background: var(--ui-sr-ok); }
.ui-sr__signal[data-level="0"] .ui-sr__bars span:first-child { background: var(--klic-component-block-color-muted); }

/* Never wider than the row – a long label shortens in its button instead of running out of the tray */
.ui-sr__actions { display: flex; align-items: center; gap: 6px; min-width: 0; max-width: 100%; margin-left: auto; }
.ui-sr__alt, .ui-sr__actions > .ui-sr__btn:not(.ui-sr__btn--primary) { flex: none; }
.ui-sr__btn {
  height: 32px;
  padding: 0 12px;
  border: 0;
  border-radius: 10px;
  background: var(--ui-sr-btn);
  box-shadow: 0 0 0 1px var(--ui-sr-border), 0 1px 2px rgba(0, 0, 0, 0.04);
  font-size: 13px !important;
  font-weight: 500;
  min-width: 0;
  max-width: 100%;
  white-space: nowrap;
  transition: background-color 160ms ease, transform 160ms ease;
}
.ui-sr__btn--primary { display: inline-flex; align-items: center; }
.ui-sr__btn-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.ui-sr__btn:hover { background: var(--ui-sr-btn-hover); }
.ui-sr__btn:active { transform: scale(0.98); }
.ui-sr__btn--primary {
  background: linear-gradient(var(--klic-component-block-color-text), var(--klic-component-block-color-text));
  box-shadow: 0 0 0 1px var(--klic-component-block-color-text), 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  color: var(--klic-component-block-color-panel) !important;
}
.ui-sr__btn--primary:hover { background: linear-gradient(var(--klic-component-block-color-text), var(--klic-component-block-color-text)); }
.ui-sr__done {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  padding-right: 4px;
  font-size: 13px;
  font-weight: 500;
  color: var(--ui-sr-ok);
  animation: ui-sr-swap 300ms var(--ui-sr-ease);
}

.ui-sr__alt { position: relative; }
.ui-sr__menu {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  z-index: 5;
  display: grid;
  gap: 2px;
  /* The column never grows with a long name; a long list scrolls */
  grid-template-columns: minmax(0, 1fr);
  width: 260px;
  max-height: min(320px, 60vh);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 4px;
  border-radius: 12px;
  background: var(--ui-sr-menu);
  box-shadow: 0 0 0 1px var(--ui-sr-border), 0 12px 30px -8px rgba(0, 0, 0, 0.2);
  animation: ui-sr-drop 180ms var(--ui-sr-ease);
}
.ui-sr__menu[data-flip] { right: auto; left: 0; }
/* Narrow: the actions sit on their own row – the menu lines up with its right edge so it stays inside */
@container (max-width: 420px) {
  .ui-sr__actions { position: relative; }
  .ui-sr__alt { position: static; }
  .ui-sr__menu { width: min(260px, 100cqw - 24px); }
}
.ui-sr__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 34px;
  padding: 0 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  font-size: 13px !important;
  text-align: left;
}
.ui-sr__option:hover { background: var(--ui-sr-option-hover); }
.ui-sr__option[aria-checked="true"] { background: var(--ui-sr-option-on); }
.ui-sr__option-label { display: inline-flex; flex: 0 1 auto; align-items: center; gap: 6px; min-width: 0; }
.ui-sr__option-name, .ui-sr__done-text { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ui-sr__tag, .ui-sr__mini { flex: none; }
.ui-sr__tag { padding: 0 6px; border-radius: 999px; background: var(--ui-sr-tag); font-size: 10.5px; font-weight: 500; line-height: 16px; color: var(--ui-sr-accent-text); }

@keyframes ui-sr-swap { from { opacity: 0; transform: translateY(2px); } }
@keyframes ui-sr-drop { from { opacity: 0; transform: translateY(4px) scale(0.98); } }
@media (prefers-reduced-motion: reduce) {
  .ui-sr__reason, .ui-sr__done, .ui-sr__menu { animation: none; }
  .ui-sr__body, .ui-sr__chevron { transition: none; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-sr {
  --ui-sr-tray: var(--klic-component-block-color-soft);
  --ui-sr-card: var(--klic-component-block-color-panel);
  --ui-sr-ink: var(--klic-component-block-color-text);
  --ui-sr-text: var(--klic-component-block-color-text);
  --ui-sr-muted: var(--klic-component-block-color-muted);
  --ui-sr-ok: var(--klic-component-block-color-accent);
  --ui-sr-accent-text: var(--klic-component-block-color-accent);
  --ui-sr-border: var(--klic-component-block-color-border);
  --ui-sr-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  --ui-sr-head-hover: var(--klic-component-block-color-soft);
  --ui-sr-pill: var(--klic-component-block-color-selected);
  --ui-sr-pill-text: var(--klic-component-block-color-accent);
  --ui-sr-bar: var(--klic-component-block-color-border);
  --ui-sr-btn: var(--klic-component-block-color-panel);
  --ui-sr-btn-hover: var(--klic-component-block-color-soft);
  --ui-sr-menu: var(--klic-component-block-color-panel);
  --ui-sr-option-hover: var(--klic-component-block-color-soft);
  --ui-sr-option-on: var(--klic-component-block-color-selected);
  --ui-sr-tag: var(--klic-component-block-color-selected);
}
:where(.dark, [data-theme="dark"]) .ui-sr__menu {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 12px 30px -8px rgba(0, 0, 0, 0.5);
}
:where(.dark, [data-theme="dark"]) .ui-sr__btn--primary {
  background: linear-gradient(var(--klic-component-block-color-panel), var(--klic-component-block-color-panel));
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.35), inset 0 1px 0 var(--klic-component-block-color-panel);
  color: var(--klic-component-block-color-text) !important;
}
:where(.dark, [data-theme="dark"]) .ui-sr__btn--primary:hover { background: linear-gradient(var(--klic-component-block-color-panel), var(--klic-component-block-color-panel)); }
`,Ge=()=>typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;function ae({id:i,children:o,className:p}){const c=r.useRef({id:i,node:o}),[m,j]=r.useState(i),[v,M]=r.useState(null);return m!==i&&(j(i),M(c.current)),c.current={id:i,node:o},r.useEffect(()=>{if(!v)return;const z=window.setTimeout(()=>M(null),300);return()=>window.clearTimeout(z)},[v]),e.jsxs("span",{className:["ui-ma__swap",p].filter(Boolean).join(" "),children:[v&&e.jsx("span",{className:"ui-ma__swap-item","data-out":"","aria-hidden":"true",children:v.node},`out-${v.id}`),e.jsx("span",{className:"ui-ma__swap-item",children:o},i)]})}function Je({version:i,children:o,className:p}){const c=r.useRef(null),[m,j]=r.useState(void 0);return r.useEffect(()=>{const v=c.current;if(!v||typeof ResizeObserver>"u")return;const M=new ResizeObserver(()=>j(v.offsetHeight));return M.observe(v),()=>M.disconnect()},[]),e.jsxs("div",{className:["ui-ma-text",p].filter(Boolean).join(" "),style:{height:m},children:[e.jsx("style",{href:"ui-message-actions",precedence:"default",children:Se}),e.jsx("div",{ref:c,className:"ui-ma-text__inner",children:e.jsx(ae,{id:String(i),className:"ui-ma-text__swap",children:o})})]})}const K=({d:i})=>e.jsx("svg",{viewBox:"0 0 24 24",className:"ui-ma__glyph","aria-hidden":"true",children:e.jsx("path",{d:i})}),W={copy:"M9 9.5A1.5 1.5 0 0 1 10.5 8h8A1.5 1.5 0 0 1 20 9.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 9 18.5zM15 8V5.5A1.5 1.5 0 0 0 13.5 4h-8A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H9",check:"M5.5 12.5l4.2 4.2L18.5 7.8",redo:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3L19.5 9M19.5 4.5V9H15",thumb:"M7.5 10.5v9M7.5 10.5l3.3-6a1.8 1.8 0 0 1 3.3 1.2l-.6 3.8H18a2 2 0 0 1 2 2.3l-1.2 6.4a2 2 0 0 1-2 1.8H5a1 1 0 0 1-1-1v-7.5a1 1 0 0 1 1-1z",speaker:"M11 5.5 6.8 9H4v6h2.8l4.2 3.5zM15.2 9.2a4 4 0 0 1 0 5.6M17.9 6.6a7.8 7.8 0 0 1 0 10.8",prev:"m14.5 7-5 5 5 5",next:"m9.5 7 5 5-5 5",close:"m7.5 7.5 9 9m0-9-9 9"},Ze=["copy","regenerate","feedback","speak"],Qe=["정확하지 않음","너무 김","요청과 다름","기타"];function et({text:i,actions:o=Ze,versions:p,version:c,defaultVersion:m,onVersionChange:j,onCopy:v,onRegenerate:M,regenerating:z=!1,onFeedback:L,reasons:l=Qe,onSpeak:b,speaking:_,speakDuration:w,quiet:y=!0,label:O="메시지 작업",className:D}){const B=r.useId(),f=Math.max(1,typeof p=="number"?Math.floor(p):p?.length??1),[F,A]=r.useState(()=>Math.min(f-1,Math.max(0,m??f-1))),[E,T]=r.useState(f),[g,R]=r.useState(null),[k,I]=r.useState(!1),[Y,x]=r.useState(null),[u,t]=r.useState(""),[a,n]=r.useState(!1);E!==f&&(f>E&&(A(f-1),R(null),I(!1)),T(f));const s=Math.min(f-1,Math.max(0,c??F)),d=h=>{const Q=Math.min(f-1,Math.max(0,h));Q!==s&&(c===void 0&&A(Q),j?.(Q),S(`전체 ${f}개 중 ${Q+1}번째 버전`))},[N,C]=r.useState(""),S=h=>C(Q=>Q===h?`${h} `:h),[q,H]=r.useState(0);r.useEffect(()=>{if(!q)return;const h=window.setTimeout(()=>H(0),1600);return()=>window.clearTimeout(h)},[q]);const $=async()=>{if(i!==void 0)try{if(!navigator.clipboard)throw new Error("clipboard");await navigator.clipboard.writeText(i),v?.(i),H(Date.now()),S("복사 완료")}catch{S("복사하지 못했습니다. 본문을 직접 선택해 복사해주세요.")}},[U,ee]=r.useState(0),V=()=>{ee(h=>h+1),M?.(),S("다른 응답을 준비합니다")},P=()=>{if(g==="up"){R(null),L?.(null);return}R("up"),I(!1),L?.("up"),S("도움이 되는 응답으로 표시했습니다")},te=()=>{if(g==="down"){R(null),I(!1),L?.(null);return}R("down"),I(!0),n(!1),x(null),t(""),L?.("down"),S("개선이 필요한 응답으로 표시했습니다. 아래에서 이유를 알려주세요")},X=()=>{!Y||a||(L?.("down",Y==="기타"?u.trim()||"기타":Y),n(!0),S("의견을 보내주셔서 감사합니다"))};r.useEffect(()=>{if(!a)return;const h=window.setTimeout(()=>I(!1),Ge()?1200:1500);return()=>window.clearTimeout(h)},[a]);const G=r.useRef(null),re=()=>{I(!1),G.current?.focus()},[J,de]=r.useState(!1),Z=_??J,Me=i?i.trim().split(/\s+/).length:0,pe=w??Math.max(2600,Me*380);r.useEffect(()=>{if(_!==void 0||!J)return;const h=window.setTimeout(()=>{de(!1),b?.(!1),S("읽기를 마쳤습니다")},pe);return()=>window.clearTimeout(h)},[J,_,pe]);const Ce=()=>{const h=!Z;_===void 0&&de(h),b?.(h),S(h?"소리 내어 읽는 중입니다":"읽기를 중지했습니다")},ze=!!q||k||Z||z,ie=h=>e.jsxs("span",{className:"ui-ma__item","data-flash":h.flash?"":void 0,children:[e.jsx("button",{ref:h.refEl,type:"button",className:`ui-ma__btn ui-ma__btn--${h.key}`,"aria-label":h.labelText,"aria-pressed":h.pressed,"aria-expanded":h.expanded,"aria-controls":h.controls,onClick:h.onClick,...h.extra,children:h.children}),e.jsx("span",{className:"ui-ma__tip","aria-hidden":"true",children:e.jsx(ae,{id:h.tip,children:h.tip})})]},h.key),Te=o.map(h=>h==="copy"?ie({key:"copy",tip:q?"복사 완료":"복사",labelText:q?"복사 완료":"메시지 복사",onClick:$,flash:!!q,extra:{"data-done":q?"":void 0},children:e.jsxs("span",{className:"ui-ma__icon ui-ma__morph",children:[e.jsx("span",{className:"ui-ma__layer","data-on":q?void 0:"",children:e.jsx(K,{d:W.copy})}),e.jsx("span",{className:"ui-ma__layer ui-ma__layer--check","data-on":q?"":void 0,children:e.jsx(K,{d:W.check})})]})}):h==="regenerate"?e.jsxs("span",{className:"ui-ma__regen",children:[ie({key:"regenerate",tip:z?"작성 중…":"다시 작성",labelText:"다른 응답 만들기",onClick:V,extra:{"data-busy":z?"":void 0},children:e.jsx("span",{className:"ui-ma__icon",children:e.jsx("span",{className:"ui-ma__spin","data-spin":U?"":void 0,children:e.jsx(K,{d:W.redo})},U)})}),e.jsx("span",{className:"ui-ma__versions","data-open":f>1?"":void 0,inert:f<2,children:e.jsxs("span",{className:"ui-ma__versions-clip",role:"group","aria-label":"응답 버전",children:[e.jsx("button",{type:"button",className:"ui-ma__step","data-dir":"prev","aria-label":"이전 버전",disabled:s===0,onClick:()=>d(s-1),children:e.jsx(K,{d:W.prev})}),e.jsxs("span",{className:"ui-ma__count","aria-label":`전체 ${f}개 중 ${s+1}번째 버전`,children:[e.jsx(ae,{id:String(s),className:"ui-ma__count-now",children:s+1}),e.jsx("span",{"aria-hidden":"true",children:"/"}),e.jsx(ae,{id:String(f),children:f})]}),e.jsx("button",{type:"button",className:"ui-ma__step","data-dir":"next","aria-label":"다음 버전",disabled:s>=f-1,onClick:()=>d(s+1),children:e.jsx(K,{d:W.next})})]})})]},"regenerate"):h==="feedback"?e.jsxs(r.Fragment,{children:[ie({key:"up",tip:g==="up"?"감사합니다":"도움 됨",labelText:"도움 됨",pressed:g==="up",onClick:P,children:e.jsx("span",{className:"ui-ma__icon ui-ma__thumb",children:e.jsx(K,{d:W.thumb})})}),ie({key:"down",tip:"아쉬워요",labelText:"아쉬워요",pressed:g==="down",expanded:k,controls:`${B}-feedback`,onClick:te,refEl:G,children:e.jsx("span",{className:"ui-ma__icon ui-ma__thumb",children:e.jsx(K,{d:W.thumb})})})]},"feedback"):ie({key:"speak",tip:Z?"중지":"소리 내어 읽기",labelText:Z?"읽기 중지":"소리 내어 읽기",pressed:Z,onClick:Ce,children:e.jsxs("span",{className:"ui-ma__icon ui-ma__morph",children:[e.jsx("span",{className:"ui-ma__layer","data-on":Z?void 0:"",children:e.jsx(K,{d:W.speaker})}),e.jsxs("span",{className:"ui-ma__layer ui-ma__eq","data-on":Z?"":void 0,children:[e.jsx("i",{}),e.jsx("i",{}),e.jsx("i",{}),e.jsx("i",{})]})]})})),Re=h=>{h.key==="Escape"&&(h.stopPropagation(),re())};return e.jsxs("div",{className:["ui-ma",D].filter(Boolean).join(" "),"data-quiet":y?"":void 0,"data-active":ze?"":void 0,children:[e.jsx("style",{href:"ui-message-actions",precedence:"default",children:Se}),e.jsx("div",{className:"ui-ma__bar",role:"group","aria-label":O,children:Te}),o.includes("feedback")&&e.jsx("div",{id:`${B}-feedback`,className:"ui-ma__fold","data-open":k?"":void 0,inert:!k,children:e.jsx("div",{className:"ui-ma__clip",children:e.jsxs("div",{className:"ui-ma__panel",role:"group","aria-labelledby":`${B}-ask`,onKeyDown:Re,children:[e.jsxs("div",{className:"ui-ma__panel-head",children:[e.jsx("span",{id:`${B}-ask`,className:"ui-ma__ask",children:"어떤 점이 아쉬웠나요?"}),e.jsx("button",{type:"button",className:"ui-ma__close","aria-label":"피드백 닫기",onClick:re,children:e.jsx(K,{d:W.close})})]}),e.jsxs("div",{className:"ui-ma__chips",children:[l.map(h=>e.jsx("button",{type:"button",className:"ui-ma__chip","aria-pressed":Y===h,disabled:a,onClick:()=>x(Y===h?null:h),children:h},h)),e.jsx("button",{type:"button",className:"ui-ma__send","data-sent":a?"":void 0,disabled:!Y,"aria-disabled":a||void 0,onClick:X,children:e.jsx(ae,{id:a?"sent":"send",children:a?e.jsxs(e.Fragment,{children:[e.jsx(K,{d:W.check}),"감사합니다"]}):"보내기"})})]}),l.includes("기타")&&e.jsx("div",{className:"ui-ma__fold","data-open":Y==="기타"&&!a?"":void 0,inert:Y!=="기타"||a,children:e.jsx("div",{className:"ui-ma__clip",children:e.jsx("input",{className:"ui-ma__input",value:u,placeholder:"자세한 의견을 알려주세요 (선택)","aria-label":"아쉬웠던 점을 직접 작성",onChange:h=>t(h.target.value),onKeyDown:h=>{h.key==="Enter"&&X()}})})})]})})}),e.jsx("span",{className:"ui-ma__sr","aria-live":"polite",children:N})]})}const Se=`
.ui-ma {
  --ui-ma-card: var(--klic-component-block-color-panel);
  --ui-ma-line: var(--klic-component-block-color-border);
  --ui-ma-ink: var(--klic-component-block-color-text);
  --ui-ma-text: var(--klic-component-block-color-text);
  --ui-ma-muted: var(--klic-component-block-color-muted);
  --ui-ma-well: var(--klic-component-block-color-soft);
  --ui-ma-hover: var(--klic-component-block-color-soft);
  --ui-ma-accent: var(--klic-component-block-color-accent);
  --ui-ma-accent-bg: var(--klic-component-block-color-selected);
  --ui-ma-ok: var(--klic-component-block-color-accent);
  --ui-ma-ok-bg: var(--klic-component-block-color-selected);
  --ui-ma-tip-bg: var(--klic-component-block-color-text);
  --ui-ma-tip-text: var(--klic-component-block-color-panel);
  --ui-ma-focus: var(--klic-component-block-color-accent);
  --ui-ma-ease: cubic-bezier(0.32, 0.72, 0.24, 1);
  box-sizing: border-box;
  display: block;
  width: 100%;
  min-width: 0;
  container-type: inline-size;
  font-family: var(--runtime-font, system-ui);
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-ma-text);
  text-align: left;
  -webkit-font-smoothing: antialiased;
}
.ui-ma *, .ui-ma *::before, .ui-ma *::after { box-sizing: border-box; }
:where(.ui-ma) button { margin: 0; padding: 0; border: 0; background: none; font: inherit; color: inherit; text-align: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.ui-ma button:focus-visible, .ui-ma input:focus-visible { outline: 2px solid var(--ui-ma-focus); outline-offset: 2px; }
.ui-ma svg { display: block; flex: none; }
.ui-ma__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

/* ----- The bar: quiet until the message is hovered, something inside is focused or busy ----- */
.ui-ma__bar { display: flex; align-items: center; gap: 2px; min-height: 30px; transition: opacity 240ms ease; }
.ui-ma[data-quiet] .ui-ma__bar { opacity: 0.6; }
.ui-ma[data-quiet]:hover .ui-ma__bar,
.ui-ma[data-quiet]:focus-within .ui-ma__bar,
.ui-ma[data-quiet][data-active] .ui-ma__bar,
:where([data-ui-message]:hover, [data-ui-message]:focus-within) .ui-ma[data-quiet] .ui-ma__bar { opacity: 1; }

.ui-ma__item { position: relative; display: inline-flex; flex: none; }
.ui-ma__btn { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 8px; color: var(--ui-ma-muted); transition: background-color 160ms ease, color 160ms ease; }
.ui-ma__btn:hover { background: var(--ui-ma-hover); color: var(--ui-ma-ink); }
.ui-ma__btn:active .ui-ma__icon { transform: scale(0.9); }
.ui-ma__btn[aria-pressed="true"] { color: var(--ui-ma-ink); }
.ui-ma__btn--speak[aria-pressed="true"] { color: var(--ui-ma-accent); background: var(--ui-ma-accent-bg); }
.ui-ma__btn--copy[data-done] { color: var(--ui-ma-ok); }

.ui-ma__icon { position: relative; display: grid; place-items: center; width: 16px; height: 16px; transition: transform 160ms var(--ui-ma-ease); }
.ui-ma__glyph { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }

/* Two icons on top of each other – one blurs away while the other comes in */
.ui-ma__morph { display: grid; }
.ui-ma__layer { grid-area: 1 / 1; display: grid; place-items: center; opacity: 0; transform: scale(0.6); filter: blur(2px); transition: opacity 200ms ease, transform 300ms var(--ui-ma-ease), filter 200ms ease; }
.ui-ma__layer[data-on] { opacity: 1; transform: none; filter: none; }
.ui-ma__layer--check .ui-ma__glyph { stroke-width: 2; stroke-dasharray: 22; stroke-dashoffset: 22; }
.ui-ma__layer--check[data-on] .ui-ma__glyph { stroke-dashoffset: 0; transition: stroke-dashoffset 340ms var(--ui-ma-ease) 60ms; }

/* Regenerate spins once per press, and keeps going while busy */
.ui-ma__spin { display: grid; place-items: center; }
.ui-ma__spin[data-spin] { animation: ui-ma-spin 640ms var(--ui-ma-ease); }
.ui-ma__btn[data-busy] { color: var(--ui-ma-ink); }
.ui-ma__btn[data-busy] .ui-ma__spin { animation: ui-ma-spin 900ms linear infinite; }

/* Thumbs: down is the same glyph turned around; a vote fills it with a little pop */
.ui-ma__btn--down .ui-ma__glyph { transform: rotate(180deg); }
.ui-ma__thumb .ui-ma__glyph { transition: fill 200ms ease; }
.ui-ma__btn[aria-pressed="true"] .ui-ma__thumb { animation: ui-ma-pop 420ms var(--ui-ma-ease); }
.ui-ma__btn[aria-pressed="true"] .ui-ma__thumb .ui-ma__glyph { fill: currentColor; }

/* Read aloud: four bars that bounce while it plays */
.ui-ma__eq { display: flex; align-items: center; justify-content: center; gap: 2px; width: 16px; height: 16px; }
.ui-ma__eq i { display: block; width: 2px; height: 12px; border-radius: 1px; background: currentColor; transform: scaleY(0.3); }
.ui-ma__eq[data-on] i { animation: ui-ma-eq 900ms ease-in-out infinite; }
.ui-ma__eq[data-on] i:nth-child(2) { animation-delay: -300ms; animation-duration: 760ms; }
.ui-ma__eq[data-on] i:nth-child(3) { animation-delay: -520ms; animation-duration: 1000ms; }
.ui-ma__eq[data-on] i:nth-child(4) { animation-delay: -140ms; animation-duration: 820ms; }

/* ----- Tooltips: above the button, on hover after a beat, on keyboard focus, and briefly after Copy ----- */
.ui-ma__tip { position: absolute; bottom: calc(100% + 6px); left: 50%; z-index: 3; display: block; width: max-content; padding: 3px 7px; border-radius: 6px; background: var(--ui-ma-tip-bg); font-size: 11.5px; font-weight: 500; line-height: 16px; color: var(--ui-ma-tip-text); white-space: nowrap; pointer-events: none; opacity: 0; transform: translate(-50%, 3px); transition: opacity 140ms ease, transform 200ms var(--ui-ma-ease); }
.ui-ma__btn:focus-visible + .ui-ma__tip,
.ui-ma__item[data-flash] .ui-ma__tip { opacity: 1; transform: translate(-50%, 0); transition-delay: 0ms; }
@media (hover: hover) {
  .ui-ma__item:hover .ui-ma__tip { opacity: 1; transform: translate(-50%, 0); transition-delay: 380ms; }
}

/* ----- Version switcher: unfolds next to Regenerate once there are two versions ----- */
.ui-ma__regen { display: inline-flex; align-items: center; flex: none; }
.ui-ma__versions { display: grid; grid-template-columns: 0fr; opacity: 0; transition: grid-template-columns 420ms var(--ui-ma-ease), opacity 220ms ease; }
.ui-ma__versions[data-open] { grid-template-columns: 1fr; opacity: 1; transition: grid-template-columns 420ms var(--ui-ma-ease), opacity 320ms ease 100ms; }
.ui-ma__versions-clip { display: flex; align-items: center; min-width: 0; overflow: hidden; padding-right: 2px; }
.ui-ma__step { display: grid; flex: none; place-items: center; width: 20px; height: 30px; border-radius: 7px; color: var(--ui-ma-muted); transition: background-color 160ms ease, color 160ms ease, opacity 160ms ease; }
.ui-ma__step .ui-ma__glyph { width: 14px; height: 14px; }
.ui-ma__step:hover:not(:disabled) { background: var(--ui-ma-hover); color: var(--ui-ma-ink); }
.ui-ma__step:disabled { cursor: default; opacity: 0.4; }
.ui-ma__count { display: inline-flex; align-items: center; gap: 2px; padding: 0 1px; font-size: 12px; color: var(--ui-ma-muted); white-space: nowrap; font-variant-numeric: tabular-nums; }
.ui-ma__count-now { color: var(--ui-ma-ink); font-weight: 500; }

/* ----- Swapping text ----- */
.ui-ma__swap { display: inline-grid; min-width: 0; }
.ui-ma__swap-item { grid-area: 1 / 1; display: inline-flex; align-items: center; justify-content: center; gap: 4px; min-width: 0; animation: ui-ma-in 300ms ease both; }
.ui-ma__swap-item[data-out] { animation: ui-ma-out 220ms ease both; }

/* ----- Feedback row: unfolds below the bar ----- */
.ui-ma__fold { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows 420ms var(--ui-ma-ease), opacity 220ms ease; }
.ui-ma__fold[data-open] { grid-template-rows: 1fr; opacity: 1; transition: grid-template-rows 420ms var(--ui-ma-ease), opacity 320ms ease 80ms; }
.ui-ma__clip { min-height: 0; overflow: hidden; margin: -1px; padding: 1px; }  /* the 1px keeps the card's hairline from being clipped */
.ui-ma__panel { max-width: 440px; margin: 6px 0 0; padding: 12px 14px 14px; border-radius: 16px; background: var(--ui-ma-card); box-shadow: 0 0 0 1px var(--ui-ma-line), 0 1px 2px rgba(0, 0, 0, 0.04); }
.ui-ma__panel-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 24px; }
.ui-ma__ask { font-size: 12.5px; font-weight: 500; color: var(--ui-ma-ink); }
.ui-ma__close { display: grid; flex: none; place-items: center; width: 24px; height: 24px; margin-right: -4px; border-radius: 7px; color: var(--ui-ma-muted); transition: background-color 160ms ease, color 160ms ease; }
.ui-ma__close .ui-ma__glyph { width: 14px; height: 14px; }
.ui-ma__close:hover { background: var(--ui-ma-hover); color: var(--ui-ma-ink); }
.ui-ma__chips { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 6px; }
.ui-ma__chip { height: 26px; padding: 0 9px; border-radius: 8px; background: var(--ui-ma-well); font-size: 12px; color: var(--ui-ma-text); white-space: nowrap; transition: background-color 160ms ease, color 160ms ease, box-shadow 160ms ease, opacity 200ms ease; }
.ui-ma__chip:hover:not(:disabled) { background: var(--ui-ma-line); color: var(--ui-ma-ink); }
.ui-ma__chip[aria-pressed="true"], .ui-ma__chip[aria-pressed="true"]:hover:not(:disabled) { background: var(--ui-ma-accent-bg); color: var(--ui-ma-accent); }
.ui-ma__chip:disabled { cursor: default; }
.ui-ma__chip:disabled:not([aria-pressed="true"]) { opacity: 0.45; }
.ui-ma__send { display: inline-flex; align-items: center; justify-content: center; min-width: 58px; height: 26px; margin-left: auto; padding: 0 11px; border-radius: 8px; background: var(--ui-ma-ink); font-size: 12px; font-weight: 500; color: var(--ui-ma-card); white-space: nowrap; transition: background-color 220ms ease, color 220ms ease, opacity 200ms ease; }
.ui-ma__send:disabled { cursor: default; opacity: 0.32; }
.ui-ma__send[data-sent] { cursor: default; background: var(--ui-ma-ok-bg); color: var(--ui-ma-ok); }
.ui-ma__send .ui-ma__glyph { width: 13px; height: 13px; stroke-width: 2.2; }
.ui-ma__input { display: block; width: 100%; height: 30px; margin-top: 8px; padding: 0 10px; border: 0; border-radius: 8px; background: var(--ui-ma-well); font: inherit; font-size: 12.5px; color: var(--ui-ma-ink); outline: none; }
.ui-ma__input::placeholder { color: var(--ui-ma-muted); }

/* ----- Message text that crossfades between versions (MessageText) ----- */
.ui-ma-text { overflow: hidden; transition: height 360ms var(--ui-ma-ease, cubic-bezier(0.32, 0.72, 0.24, 1)); }
.ui-ma-text__swap { display: grid; }
.ui-ma-text__swap > .ui-ma__swap-item { display: block; animation: ui-ma-text-in 420ms ease both; }
.ui-ma-text__swap > .ui-ma__swap-item[data-out] { animation: ui-ma-out 260ms ease both; }

@keyframes ui-ma-in { from { opacity: 0; filter: blur(2px); } }
@keyframes ui-ma-text-in { from { opacity: 0; filter: blur(3px); } }
@keyframes ui-ma-out { from { opacity: 1; } to { opacity: 0; filter: blur(2px); } }
@keyframes ui-ma-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes ui-ma-pop { 0% { transform: scale(1); } 40% { transform: scale(1.28) rotate(-8deg); } 100% { transform: scale(1); } }
@keyframes ui-ma-eq { 0%, 100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }

/* Narrow: the feedback row stacks its send button under the chips */
@container (max-width: 320px) {
  .ui-ma__send { flex-basis: 100%; }
}

@media (pointer: coarse) {
  .ui-ma[data-quiet] .ui-ma__bar { opacity: 1; }
  .ui-ma__btn { width: 38px; height: 38px; border-radius: 10px; }
  .ui-ma__step { width: 28px; height: 38px; }
  .ui-ma__chip, .ui-ma__send { height: 34px; }
  .ui-ma__close { width: 32px; height: 32px; }
  .ui-ma__input { height: 38px; }
}

@media (prefers-reduced-motion: reduce) {
  .ui-ma *, .ui-ma *::before, .ui-ma *::after, .ui-ma-text, .ui-ma-text * { animation: none !important; transition: none !important; }
  .ui-ma__eq[data-on] i:nth-child(odd) { transform: scaleY(0.8); }
  .ui-ma__eq[data-on] i:nth-child(even) { transform: scaleY(0.5); }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-ma {
  --ui-ma-card: var(--klic-component-block-color-panel);
  --ui-ma-line: var(--klic-component-block-color-border);
  --ui-ma-ink: var(--klic-component-block-color-text);
  --ui-ma-text: var(--klic-component-block-color-text);
  --ui-ma-muted: var(--klic-component-block-color-muted);
  --ui-ma-well: var(--klic-component-block-color-soft);
  --ui-ma-hover: var(--klic-component-block-color-soft);
  --ui-ma-accent: var(--klic-component-block-color-accent);
  --ui-ma-accent-bg: var(--klic-component-block-color-selected);
  --ui-ma-ok: var(--klic-component-block-color-accent);
  --ui-ma-ok-bg: var(--klic-component-block-color-selected);
  --ui-ma-tip-bg: var(--klic-component-block-color-text);
  --ui-ma-tip-text: var(--klic-component-block-color-panel);
  --ui-ma-focus: var(--klic-component-block-color-accent);
}
`,tt=(i,o)=>o>0?(i%o+o)%o:0,it=(i,o,p)=>Math.min(p,Math.max(o,i));function at({logos:i,speed:o=40,direction:p="left",rows:c=1,gap:m=56,pauseOnHover:j=!0,grayscale:v=!0,labels:M="none",label:z="제품을 사용하는 기업의 로고",className:L}){const l=r.useRef(null),b=r.useRef([]),_=r.useRef([]),w=r.useRef([]),y=r.useRef([]),O=r.useRef(!1),D=r.useRef(!1),[B,f]=r.useState([]),[F,A]=r.useState(!1),E=c===2&&i.length>1?[{logos:i.filter((t,a)=>a%2===0),dir:p==="left"?1:-1},{logos:i.filter((t,a)=>a%2===1),dir:p==="left"?-1:1}]:[{logos:i,dir:p==="left"?1:-1}],T=r.useRef({speed:o,pauseOnHover:j,split:E});T.current={speed:o,pauseOnHover:j,split:E},r.useEffect(()=>{const t=window.matchMedia("(prefers-reduced-motion: reduce)"),a=()=>A(t.matches);return a(),t.addEventListener("change",a),()=>t.removeEventListener("change",a)},[]),r.useEffect(()=>{if(F)return;const t=()=>{const n=E.map((s,d)=>{const N=_.current[d],C=w.current[d];if(!N||!C)return 2;const S=N.getBoundingClientRect().width,q=y.current[d]??={x:d*S*.5,v:0,w:S,drag:null,seek:0};return q.w>0&&S>0&&q.w!==S&&(q.x=q.x/q.w*S),q.w=S,S>0?Math.ceil(C.clientWidth/S)+1:2});f(s=>s.length===n.length&&s.every((d,N)=>d===n[N])?s:n)};t();const a=new ResizeObserver(t);for(const n of[..._.current,...w.current])n&&a.observe(n);return()=>a.disconnect()},[F,E.length,i,m,M]),r.useEffect(()=>{const t=l.current;if(F||!t)return;let a=0,n=0,s=!1;const d=C=>{const S=n?Math.min(.05,(C-n)/1e3):0;n=C;const{speed:q,pauseOnHover:H,split:$}=T.current,U=H&&(O.current||D.current);$.forEach((ee,V)=>{const P=y.current[V],te=b.current[V];if(!(!P||!te||P.w<=0)){if(!P.drag){const X=U?0:q*ee.dir,re=Math.abs(P.v-X)>Math.max(120,q*2)?.55:U?.32:.7;if(P.v+=(X-P.v)*(1-Math.exp(-S/re)),P.x+=P.v*S,P.seek){const J=P.seek*(1-Math.exp(-S/.12));P.x+=J,P.seek=Math.abs(P.seek-J)<.5?0:P.seek-J}}P.x=tt(P.x,P.w),te.style.transform=`translate3d(${-P.x}px, 0, 0)`}}),a=s?requestAnimationFrame(d):0},N=new IntersectionObserver(([C])=>{s=C.isIntersecting,s&&!a&&(n=0,a=requestAnimationFrame(d))});return N.observe(t),()=>{N.disconnect(),cancelAnimationFrame(a)}},[F]);const g=t=>a=>{const n=y.current[t];!n||a.pointerType==="mouse"&&a.button!==0||(n.drag={id:a.pointerId,lastX:a.clientX,lastT:a.timeStamp,moved:0,captured:!1},n.v=0)},R=t=>a=>{const n=y.current[t],s=n?.drag;if(!n||!s||s.id!==a.pointerId)return;const d=a.clientX-s.lastX,N=Math.max(1,a.timeStamp-s.lastT)/1e3;s.moved+=Math.abs(d),!s.captured&&s.moved>4&&(s.captured=!0,a.currentTarget.setPointerCapture(a.pointerId),a.currentTarget.setAttribute("data-dragging","")),n.x-=d,n.v=n.v*.6+-d/N*.4,s.lastX=a.clientX,s.lastT=a.timeStamp},k=t=>a=>{const n=y.current[t],s=n?.drag;if(!(!n||!s||s.id!==a.pointerId)&&(a.timeStamp-s.lastT>80&&(n.v=0),n.v=it(n.v,-2400,2400),n.drag=null,a.currentTarget.removeAttribute("data-dragging"),s.captured)){const d=a.currentTarget,N=C=>{C.preventDefault(),C.stopPropagation()};d.addEventListener("click",N,{capture:!0,once:!0}),setTimeout(()=>d.removeEventListener("click",N,{capture:!0}),0)}},I=t=>a=>{const n=y.current[t],s=w.current[t];if(F||!n||!s)return;const d=s.getBoundingClientRect(),N=a.currentTarget.getBoundingClientRect(),C=Math.min(96,d.width*.15);N.left<d.left+C?n.seek=N.left-(d.left+C):N.right>d.right-C&&(n.seek=N.right-(d.right-C))},Y=(t,a,n)=>{const s=t.svg??(t.src?e.jsx("img",{src:t.src,alt:"",draggable:!1}):null),d=e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"ui-lm__mark","aria-hidden":"true",children:s}),M!=="none"?e.jsx("span",{className:"ui-lm__name",children:t.name}):e.jsx("span",{className:"ui-lm__sr",children:t.name})]});return e.jsx("li",{className:"ui-lm__item",style:{"--ui-lm-brand":t.color,"--ui-lm-scale":t.scale},children:t.href?e.jsx("a",{className:"ui-lm__link",href:t.href,draggable:!1,tabIndex:n?void 0:-1,onFocus:n?I(a):void 0,children:d}):e.jsx("span",{className:"ui-lm__link",children:d})},t.name)},x={"--ui-lm-gap":`${m}px`},u=["ui-lm",L].filter(Boolean).join(" ");return e.jsxs(e.Fragment,{children:[e.jsx("style",{href:"ui-logo-marquee",precedence:"default",children:rt}),e.jsx("div",{ref:l,className:u,style:x,role:"region","aria-label":z,"data-labels":M,"data-grayscale":v||void 0,"data-static":F||void 0,onPointerEnter:t=>{t.pointerType!=="touch"&&(O.current=!0)},onPointerLeave:()=>O.current=!1,onFocus:t=>D.current=t.target.matches(":focus-visible"),onBlur:t=>{t.currentTarget.contains(t.relatedTarget)||(D.current=!1)},children:F?e.jsx("ul",{className:"ui-lm__wrap",children:i.map(t=>Y(t,0,!0))}):E.map((t,a)=>e.jsx("div",{ref:n=>{w.current[a]=n},className:"ui-lm__row",onPointerDown:g(a),onPointerMove:R(a),onPointerUp:k(a),onPointerCancel:k(a),children:e.jsx("div",{ref:n=>{b.current[a]=n},className:"ui-lm__track",children:Array.from({length:Math.max(2,B[a]??2)},(n,s)=>e.jsx("ul",{ref:s===0?d=>{_.current[a]=d}:void 0,className:"ui-lm__set","aria-hidden":s>0||void 0,inert:s>0||void 0,children:t.logos.map(d=>Y(d,a,s===0))},s))})},a))})]})}const rt=`
.ui-lm {
  --ui-lm-h: 28px;
  --ui-lm-g: var(--ui-lm-gap, 56px);
  --ui-lm-row-gap: 20px;
  --ui-lm-fade: min(14%, 120px);
  --ui-lm-muted: var(--klic-component-block-color-muted);
  --ui-lm-ink: var(--klic-component-block-color-text);
  --ui-lm-label: var(--klic-component-block-color-muted);
  --ui-lm-dim: 0.75;
  --ui-lm-focus: var(--klic-component-block-color-accent);
  --ui-lm-ease: cubic-bezier(0.22, 1, 0.36, 1);
  container-type: inline-size;
  display: grid;
  gap: var(--ui-lm-row-gap);
  width: 100%;
  min-width: 0;
  font-family: var(--runtime-font, system-ui);
  -webkit-font-smoothing: antialiased;
}
/* Narrow containers (phones): smaller logos, tighter gaps */
@container (max-width: 520px) {
  .ui-lm__row, .ui-lm__wrap { --ui-lm-h: 22px; --ui-lm-g: calc(var(--ui-lm-gap, 56px) * 0.62); }
}

.ui-lm__row {
  overflow: hidden;
  /* Vertical page scroll stays native; horizontal swipes scrub the strip */
  touch-action: pan-y;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 var(--ui-lm-fade), #000 calc(100% - var(--ui-lm-fade)), transparent);
  mask-image: linear-gradient(90deg, transparent, #000 var(--ui-lm-fade), #000 calc(100% - var(--ui-lm-fade)), transparent);
  /* Room for focus rings so they aren't clipped */
  padding-block: 6px;
}
.ui-lm__row[data-dragging] { cursor: grabbing; }
.ui-lm__track {
  display: flex;
  width: max-content;
  will-change: transform;
}
.ui-lm__set,
.ui-lm__wrap {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}
.ui-lm__set { flex: none; }
/* Every logo carries its gap on the right, so one set's width is exactly the wrap distance */
.ui-lm__item { flex: none; margin-inline-end: var(--ui-lm-g); }

.ui-lm__link {
  display: flex;
  align-items: center;
  gap: calc(var(--ui-lm-h) * 0.32);
  border-radius: 8px;
  color: var(--ui-lm-muted);
  text-decoration: none;
  transition: color 260ms var(--ui-lm-ease), opacity 260ms var(--ui-lm-ease), filter 260ms var(--ui-lm-ease);
  -webkit-user-drag: none;
}
.ui-lm[data-labels="below"] .ui-lm__link { flex-direction: column; gap: 8px; }
.ui-lm__link:focus-visible { outline: 2px solid var(--ui-lm-focus); outline-offset: 4px; }

/* Consistent optical height: every mark fills the same box, nudged by its own scale */
.ui-lm__mark {
  display: grid;
  place-items: center;
  height: var(--ui-lm-h);
  transition: color 260ms var(--ui-lm-ease);
}
.ui-lm__mark > svg,
.ui-lm__mark > img {
  display: block;
  height: calc(var(--ui-lm-h) * var(--ui-lm-scale, 1));
  width: auto;
  max-width: calc(var(--ui-lm-h) * 5);
  pointer-events: none;
}
.ui-lm__name {
  font-size: calc(var(--ui-lm-h) * 0.68);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1;
  white-space: nowrap;
}
.ui-lm[data-labels="below"] .ui-lm__name {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0;
  color: var(--ui-lm-label);
}
.ui-lm__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* Grayscale: muted marks, images without colour – the hovered logo lifts to its brand colour */
.ui-lm[data-grayscale] .ui-lm__mark > img { filter: grayscale(1); opacity: 0.6; transition: filter 260ms var(--ui-lm-ease), opacity 260ms var(--ui-lm-ease); }
.ui-lm:not([data-grayscale]) .ui-lm__mark { color: var(--ui-lm-brand, var(--ui-lm-ink)); }
.ui-lm:not([data-grayscale]) .ui-lm__link { color: var(--ui-lm-ink); }
@media (hover: hover) {
  .ui-lm__link:hover,
  .ui-lm__link:focus-visible { color: var(--ui-lm-ink); }
  .ui-lm[data-grayscale] .ui-lm__link:hover .ui-lm__mark,
  .ui-lm[data-grayscale] .ui-lm__link:focus-visible .ui-lm__mark { color: var(--ui-lm-brand, var(--ui-lm-ink)); }
  .ui-lm[data-grayscale] .ui-lm__link:hover img { filter: none; opacity: 1; }
  /* Full colour: the others step back a little while one is hovered */
  .ui-lm:not([data-grayscale]) .ui-lm__set:has(.ui-lm__link:hover) .ui-lm__link:not(:hover) { opacity: var(--ui-lm-dim); }
  /* No colour flicker under the pointer while scrubbing */
  .ui-lm[data-grayscale] .ui-lm__row[data-dragging] .ui-lm__link { color: var(--ui-lm-muted); }
  .ui-lm[data-grayscale] .ui-lm__row[data-dragging] .ui-lm__mark { color: inherit; }
}

/* Reduced motion: a static, centred, wrapping row */
.ui-lm__wrap {
  flex-wrap: wrap;
  justify-content: center;
  row-gap: calc(var(--ui-lm-g) * 0.5);
  padding-inline: 8px;
}
.ui-lm__wrap .ui-lm__item { margin-inline: calc(var(--ui-lm-g) * 0.5); }

@media (hover: none) and (pointer: coarse) {
  /* Bigger touch targets for linked logos */
  a.ui-lm__link { min-height: 40px; }
}
@media (prefers-reduced-motion: reduce) {
  .ui-lm__link, .ui-lm__mark, .ui-lm__mark > img { transition: none; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-lm {
  --ui-lm-muted: var(--klic-component-block-color-muted);
  --ui-lm-ink: var(--klic-component-block-color-text);
  --ui-lm-label: var(--klic-component-block-color-muted);
  --ui-lm-focus: var(--klic-component-block-color-accent);
}
`,ot=[1,-.84,1.12],nt=[0,.42,.18],st=(i,o)=>o>0?(i%o+o)%o:0,se=(i,o,p)=>Math.min(p,Math.max(o,i)),ct=i=>i.split(/\s+/).filter(Boolean).slice(0,2).map(o=>o[0].toUpperCase()).join(""),lt=(i,o)=>Math.min(o,i>=740?3:i>=480?2:1);function ut({items:i,columns:o=3,speed:p=28,pauseOnHover:c=!0,label:m="고객 후기",className:j}){const v=r.useRef(null),M=r.useRef([]),z=r.useRef([]),L=r.useRef([]),l=r.useRef([]),b=r.useRef([]),_=r.useRef([]),w=r.useRef([]),[y,O]=r.useState(o),[D,B]=r.useState([]),[f,F]=r.useState(!1),A=Array.from({length:y},(x,u)=>i.filter((t,a)=>a%y===u)),E=r.useRef({speed:p,pauseOnHover:c,count:y});E.current={speed:p,pauseOnHover:c,count:y},r.useEffect(()=>{const x=window.matchMedia("(prefers-reduced-motion: reduce)"),u=()=>F(x.matches);return u(),x.addEventListener("change",u),()=>x.removeEventListener("change",u)},[]),r.useLayoutEffect(()=>{const x=v.current;if(!x)return;const u=()=>O(lt(x.clientWidth,o));u();const t=new ResizeObserver(u);return t.observe(x),()=>t.disconnect()},[o]),r.useEffect(()=>{if(f)return;const x=()=>{const t=A.map((a,n)=>{const s=L.current[n],d=M.current[n];if(!s||!d)return 2;const N=d.getBoundingClientRect().height/(d.offsetHeight||1)||1,C=s.getBoundingClientRect().height/N,S=l.current[n]??={y:C*(nt[n]??0),v:0,h:C,drag:null,seek:0};return S.h>0&&C>0&&S.h!==C&&(S.y=S.y/S.h*C),S.h=C,C>0?Math.min(12,Math.ceil(d.clientHeight/C)+1):2});l.current.length=A.length,B(a=>a.length===t.length&&a.every((n,s)=>n===t[s])?a:t)};x();const u=new ResizeObserver(x);for(const t of[...L.current.slice(0,y),...M.current.slice(0,y)])t&&u.observe(t);return()=>u.disconnect()},[f,y,i]),r.useEffect(()=>{const x=v.current;if(f||!x)return;let u=0,t=0,a=!1;const n=d=>{const N=t?Math.min(.05,(d-t)/1e3):0;t=d;const{speed:C,pauseOnHover:S,count:q}=E.current;for(let H=0;H<q;H++){const $=l.current[H],U=z.current[H];if(!$||!U||$.h<=0)continue;const ee=q===1?1:ot[H%3],V=_.current[H]||w.current[H]||S&&b.current[H];if(!$.drag){const P=V?0:C*ee,X=Math.abs($.v-P)>Math.max(120,C*2)?.55:V?.32:.7;if($.v+=(P-$.v)*(1-Math.exp(-N/X)),$.y+=$.v*N,$.seek){const G=$.seek*(1-Math.exp(-N/.12));$.y+=G,$.seek=Math.abs($.seek-G)<.5?0:$.seek-G}}$.y=w.current[H]?se($.y,-$.h,$.h*2):st($.y,$.h),U.style.transform=`translate3d(0, ${-($.h+$.y)}px, 0)`}u=a?requestAnimationFrame(n):0},s=new IntersectionObserver(([d])=>{a=d.isIntersecting,a&&!u&&(t=0,u=requestAnimationFrame(n))});return s.observe(x),()=>{s.disconnect(),cancelAnimationFrame(u)}},[f]);const T=x=>u=>{const t=l.current[x];if(t){if(u.pointerType==="touch"){_.current[x]=!0;return}u.button===0&&(t.drag={id:u.pointerId,lastY:u.clientY,lastT:u.timeStamp,moved:0,captured:!1},t.v=0)}},g=x=>u=>{const t=l.current[x],a=t?.drag;if(!t||!a||a.id!==u.pointerId)return;const n=u.currentTarget,s=n.getBoundingClientRect().height/(n.offsetHeight||1)||1,d=(u.clientY-a.lastY)/s,N=Math.max(1,u.timeStamp-a.lastT)/1e3;a.moved+=Math.abs(d),!a.captured&&a.moved>4&&(a.captured=!0,n.setPointerCapture(u.pointerId),n.setAttribute("data-dragging","")),t.y-=d,t.v=t.v*.6+-d/N*.4,a.lastY=u.clientY,a.lastT=u.timeStamp},R=x=>u=>{_.current[x]=!1;const t=l.current[x],a=t?.drag;if(!(!t||!a||a.id!==u.pointerId)&&(u.timeStamp-a.lastT>80&&(t.v=0),t.v=se(t.v,-2400,2400),t.drag=null,u.currentTarget.removeAttribute("data-dragging"),a.captured)){const n=u.currentTarget,s=d=>{d.preventDefault(),d.stopPropagation()};n.addEventListener("click",s,{capture:!0,once:!0}),setTimeout(()=>n.removeEventListener("click",s,{capture:!0}),0)}},k=x=>u=>{const t=l.current[x],a=M.current[x];if(f||!t||!a||t.h<=0||!u.currentTarget.matches(":focus-visible"))return;const s=u.currentTarget.parentElement.offsetTop,d=u.currentTarget.offsetHeight,N=a.clientHeight,C=Math.min(56,N*.12);t.y=[t.y-t.h,t.y,t.y+t.h].reduce((q,H)=>Math.abs(s-H-N/2)<Math.abs(s-q-N/2)?H:q);const S=s-t.y;d>N-C*2||S<C?t.seek=S-C:S+d>N-C?t.seek=S+d-(N-C):t.seek=0},I=(x,u,t,a)=>{const n=[x.role,x.company].filter(Boolean).join(" · "),s=x.rating?se(Math.round(x.rating),1,5):0;return e.jsx("li",{className:"ui-tw__item",children:e.jsxs("figure",{className:"ui-tw__card","data-klic-surface":"card",tabIndex:t?0:void 0,onFocus:t?k(u):void 0,children:[s?e.jsx("div",{className:"ui-tw__stars",role:"img","aria-label":`5점 만점에 ${s}점`,children:Array.from({length:5},(d,N)=>e.jsx("svg",{viewBox:"0 0 16 16","aria-hidden":"true","data-on":N<s||void 0,children:e.jsx("path",{d:"M8 1.6l1.9 3.95 4.35.6-3.17 3.03.78 4.32L8 11.43 4.14 13.5l.78-4.32L1.75 6.15l4.35-.6L8 1.6z"})},N))}):null,e.jsx("blockquote",{className:"ui-tw__quote",children:e.jsx("p",{children:x.quote})}),e.jsxs("figcaption",{className:"ui-tw__who",children:[x.avatar?e.jsx("img",{className:"ui-tw__avatar",src:x.avatar,alt:"",width:36,height:36,loading:"lazy",decoding:"async",draggable:!1}):e.jsx("span",{className:"ui-tw__avatar ui-tw__avatar--initials","aria-hidden":"true",children:ct(x.name)}),e.jsxs("span",{className:"ui-tw__id",children:[e.jsxs("span",{className:"ui-tw__name",children:[e.jsx("span",{className:"ui-tw__name-text",children:x.name}),x.verified?e.jsxs("svg",{className:"ui-tw__verified",viewBox:"0 0 16 16",role:"img","aria-label":"확인된 고객",children:[e.jsx("circle",{cx:"8",cy:"8",r:"7"}),e.jsx("path",{d:"M5.2 8.1l1.9 1.9 3.7-3.8",fill:"none",stroke:"var(--ui-tw-card)",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})]}):null]}),n?e.jsx("span",{className:"ui-tw__meta",children:n}):null]})]})]})},a)},Y=["ui-tw",j].filter(Boolean).join(" ");return e.jsxs(e.Fragment,{children:[e.jsx("style",{href:"ui-testimonial-wall",precedence:"default",children:dt}),e.jsx("div",{ref:v,className:Y,role:"region","aria-label":m,"data-cols":y,"data-static":f||void 0,style:{"--ui-tw-cols":y},children:A.map((x,u)=>f?e.jsx("div",{className:"ui-tw__col",children:e.jsx("ul",{className:"ui-tw__set",children:x.map((t,a)=>I(t,u,!0,String(a)))})},u):e.jsx("div",{ref:t=>{M.current[u]=t},className:"ui-tw__col",onPointerEnter:t=>{t.pointerType!=="touch"&&(b.current[u]=!0)},onPointerLeave:()=>b.current[u]=!1,onPointerDown:T(u),onPointerMove:g(u),onPointerUp:R(u),onPointerCancel:R(u),onFocus:t=>w.current[u]=t.target.matches(":focus-visible"),onBlur:t=>{t.currentTarget.contains(t.relatedTarget)||(w.current[u]=!1)},children:e.jsx("div",{ref:t=>{z.current[u]=t},className:"ui-tw__track",style:{transform:`translate3d(0, ${-((l.current[u]?.h??0)+(l.current[u]?.y??0))}px, 0)`},children:Array.from({length:1+Math.max(2,D[u]??2)},(t,a)=>{const n=a===1;return e.jsx("ul",{ref:n?s=>{L.current[u]=s}:void 0,className:"ui-tw__set","aria-hidden":!n||void 0,inert:!n||void 0,children:x.map((s,d)=>I(s,u,n,`${a}-${d}`))},n?"real":a)})})},u))})]})}const dt=`
.ui-tw {
  --ui-tw-card: var(--klic-component-block-color-panel);
  --ui-tw-line: var(--klic-component-block-color-border);
  --ui-tw-ink: var(--klic-component-block-color-text);
  --ui-tw-text: var(--klic-component-block-color-text);
  --ui-tw-muted: var(--klic-component-block-color-muted);
  --ui-tw-faint: var(--klic-component-block-color-muted);
  --ui-tw-star: var(--klic-component-block-color-accent);
  --ui-tw-star-off: var(--klic-component-block-color-border);
  --ui-tw-initials: var(--klic-component-block-color-soft);
  --ui-tw-shadow: 0 0 0 1px var(--ui-tw-line), 0 1px 2px rgba(0, 0, 0, 0.04);
  --ui-tw-lift: 0 0 0 1px var(--ui-tw-line), 0 2px 4px rgba(0, 0, 0, 0.03), 0 12px 28px -10px rgba(0, 0, 0, 0.14);
  --ui-tw-focus: var(--klic-component-block-color-accent);
  --ui-tw-gap: 16px;
  --ui-tw-fade: 96px;
  --ui-tw-dim: 0.62;
  --ui-tw-ease: cubic-bezier(0.22, 1, 0.36, 1);
  container-type: inline-size;
  display: grid;
  grid-template-columns: repeat(var(--ui-tw-cols, 3), minmax(0, 1fr));
  /* One row exactly as tall as the wall, so a column's height never follows its (repeated) content */
  grid-template-rows: minmax(0, 1fr);
  gap: var(--ui-tw-gap);
  width: 100%;
  min-width: 0;
  height: var(--ui-tw-height, 600px);
  /* Room at the sides for the lifted card's shadow; the wall clips everything else */
  padding-inline: 12px;
  box-sizing: border-box;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(180deg, transparent, #000 var(--ui-tw-fade), #000 calc(100% - var(--ui-tw-fade)), transparent);
  mask-image: linear-gradient(180deg, transparent, #000 var(--ui-tw-fade), #000 calc(100% - var(--ui-tw-fade)), transparent);
  font-family: var(--runtime-font, system-ui);
  -webkit-font-smoothing: antialiased;
}

.ui-tw__col {
  position: relative;
  min-width: 0;
  min-height: 0;
  height: 100%;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}
.ui-tw__col[data-dragging] { cursor: grabbing; }
.ui-tw__track { will-change: transform; }
.ui-tw__set {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}
/* Every card carries its gap below, so one set's height is exactly the wrap distance */
.ui-tw__item { margin-bottom: var(--ui-tw-gap); }

.ui-tw__card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0;
  padding: 18px 20px 18px;
  border-radius: 16px;
  background: var(--ui-tw-card);
  box-shadow: var(--ui-tw-shadow);
  color: var(--ui-tw-text);
  transition: transform 320ms var(--ui-tw-ease), box-shadow 320ms var(--ui-tw-ease), opacity 320ms var(--ui-tw-ease);
}
.ui-tw__card:focus { outline: none; }
.ui-tw__card:focus-visible { outline: 2px solid var(--ui-tw-focus); outline-offset: 2px; }

.ui-tw__stars { display: flex; gap: 2px; margin-bottom: -4px; }
.ui-tw__stars svg { width: 13px; height: 13px; fill: var(--ui-tw-star-off); }
.ui-tw__stars svg[data-on] { fill: var(--ui-tw-star); }

.ui-tw__quote { margin: 0; }
.ui-tw__quote p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  letter-spacing: -0.006em;
  text-wrap: pretty;
  overflow-wrap: break-word;
}

.ui-tw__who { display: flex; align-items: center; gap: 10px; min-width: 0; }
.ui-tw__avatar {
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--ui-tw-initials);
  /* A hairline ring keeps light photos from melting into the card */
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
  pointer-events: none;
}
.ui-tw__avatar--initials {
  display: grid;
  place-items: center;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--ui-tw-muted);
}
.ui-tw__id { display: grid; gap: 1px; min-width: 0; }
.ui-tw__name {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  font-size: 13.5px;
  font-weight: 500;
  line-height: 18px;
  color: var(--ui-tw-ink);
}
/* The name wins over the role: it shrinks last and only then truncates */
.ui-tw__name-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-tw__verified { flex: none; width: 14px; height: 14px; fill: var(--ui-tw-faint); }
.ui-tw__meta {
  min-width: 0;
  overflow-wrap: break-word;
  font-size: 12.5px;
  line-height: 17px;
  color: var(--ui-tw-muted);
}

/* Hover: the card under the pointer lifts a little, the rest of the wall steps back */
@media (hover: hover) {
  .ui-tw__col:not([data-dragging]) .ui-tw__card:hover { transform: translateY(-3px); box-shadow: var(--ui-tw-lift); }
  .ui-tw:has(.ui-tw__col:not([data-dragging]) .ui-tw__card:hover) .ui-tw__card:not(:hover) { opacity: var(--ui-tw-dim); }
}
/* Keyboard focus gets the same lift */
.ui-tw__card:focus-visible { transform: translateY(-3px); box-shadow: var(--ui-tw-lift); }

/* Narrow walls (one column on phones): roomier, more readable quotes */
@container (max-width: 479px) {
  .ui-tw__card { padding: 18px 18px 18px; }
  .ui-tw__quote p { font-size: 15px; line-height: 1.58; }
}
@container (max-width: 739px) {
  .ui-tw__col { --ui-tw-gap: 14px; }
}

/* Reduced motion: a static masonry that shows every quote – no fixed height, no fade */
.ui-tw[data-static] {
  height: auto;
  grid-template-rows: auto;
  overflow: visible;
  -webkit-mask-image: none;
  mask-image: none;
}
.ui-tw[data-static] .ui-tw__col { height: auto; cursor: auto; user-select: auto; -webkit-user-select: auto; }

@media (prefers-reduced-motion: reduce) {
  .ui-tw__card { transition: none; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-tw {
  --ui-tw-card: var(--klic-component-block-color-panel);
  --ui-tw-line: var(--klic-component-block-color-border);
  --ui-tw-ink: var(--klic-component-block-color-text);
  --ui-tw-text: var(--klic-component-block-color-text);
  --ui-tw-muted: var(--klic-component-block-color-muted);
  --ui-tw-faint: var(--klic-component-block-color-muted);
  --ui-tw-star: var(--klic-component-block-color-accent);
  --ui-tw-star-off: var(--klic-component-block-color-border);
  --ui-tw-initials: var(--klic-component-block-color-soft);
  --ui-tw-shadow: 0 0 0 1px var(--ui-tw-line);
  --ui-tw-lift: 0 0 0 1px var(--klic-component-block-color-text), 0 12px 28px -10px rgba(0, 0, 0, 0.6);
  --ui-tw-focus: var(--klic-component-block-color-accent);
}
:where(.dark, [data-theme="dark"]) .ui-tw__avatar { box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06); }
`,pt=[{id:"scope",title:"배포 범위를 확정할까요?",detail:"블루 기본 테마와 라이트·다크 모드를 먼저 배포합니다. 중첩 테마는 다음 배포에서 검증합니다.",primary:"이 범위로 진행",secondary:"다시 검토"},{id:"tokens",title:"기존 토큰 매핑을 유지할까요?",detail:"Primitive를 보존하고 Semantic에서 승인된 Brand 말단 토큰만 연결합니다.",primary:"매핑 유지",secondary:"변경 검토",collapsed:!0},{id:"release",title:"검토 패키지를 준비할까요?",detail:"브라우저 안의 샘플이며 실제 배포를 수행하지 않습니다.",primary:"패키지 준비",secondary:"보류",collapsed:!0}],mt=[{id:"phased",label:"단계별 배포",reason:"기본 테마와 핵심 컴포넌트를 먼저 검증하면 변경 범위를 좁히고 호환성을 확인할 수 있습니다.",signal:3},{id:"pilot",label:"파일럿 먼저 적용",reason:"대표 서비스 한 곳에서 실제 업무와 한글 콘텐츠를 검증합니다.",signal:2},{id:"all",label:"전체 동시 전환",reason:"일정은 짧지만 모든 소비 앱을 함께 검증해야 합니다.",signal:1}],ce=["KLIC의 기본 블루 테마를 기준으로 라이트·다크 모드를 제공합니다. 브랜드 재료는 Brand 계층에서 선택하고 컴포넌트는 Semantic 역할을 통해 참조합니다.","권장안은 단계별 도입입니다. 핵심 컴포넌트와 접근성 검토를 마친 뒤 소비 앱에 적용하세요. 네 가지 표면과 아홉 가지 글꼴은 같은 역할 토큰을 공유합니다.","출시 전 실제 설치 버전, 지원 환경, 대표 업무를 확정하세요. 미검증은 통과로 처리하지 않으며 공개 범위를 명시적으로 제한합니다."],ht=[{name:"Primitive",svg:e.jsx(ue,{})},{name:"Brand",svg:e.jsx(Ee,{})},{name:"Semantic",svg:e.jsx(me,{})},{name:"Component",svg:e.jsx(qe,{})},{name:"React",svg:e.jsx($e,{})},{name:"TypeScript",svg:e.jsx(me,{})},{name:"Motion",svg:e.jsx(le,{})},{name:"KLIC Studio",svg:e.jsx(ue,{})}].map(i=>({...i,color:"var(--klic-component-block-color-accent)"})),xt=[["같은 역할 토큰으로 화면 전체의 표면을 바꿔볼 수 있어 검토가 명확해졌어요.","김디자인","프로덕트 디자인"],["다섯 가지 구성을 나란히 보니 업무에 맞는 형태를 선택하기 편합니다.","이프론트","프론트엔드"],["다크 모드에서도 제목과 본문, 보조 정보의 위계가 안정적입니다.","박기획","서비스 기획"],["밀도를 바꿔도 글자 크기가 유지되는 점이 데이터 화면에 잘 맞습니다.","정운영","서비스 운영"],["실행 인수와 결과가 분리되어 실패를 확인하고 재시도하기 좋습니다.","최개발","플랫폼 개발"],["결정 대기와 완료 상태가 분명해서 다음 행동을 찾기 쉽습니다.","한제품","프로덕트 매니저"],["움직임을 멈추고 키보드로 차분하게 살펴볼 수 있어요.","윤품질","품질 검토"],["코드와 디자인이 동일한 토큰을 사용해 변경을 추적하기 좋습니다.","신시스템","디자인 시스템"]].map(([i,o,p])=>({quote:i,name:o,role:p}));function kt({mode:i="review",density:o="default"}){const[p,c]=r.useState(0),[m,j]=r.useState("샘플 데이터 · 변경은 이 화면에만 적용됩니다."),[v,M]=r.useState("error"),[z,L]=r.useState(!1),[l,b]=r.useState(1),[_,w]=r.useState(ce.slice(0,2)),[y,O]=r.useState(!1),[D,B]=r.useState(!1),[f,F]=r.useState(!1),A=r.useRef(null),E=r.useRef(null);r.useEffect(()=>(F("speechSynthesis"in window),()=>{A.current&&clearTimeout(A.current),E.current&&window.speechSynthesis?.cancel()}),[]);const T={review:"에이전트 검토 워크스페이스",response:"응답 편집 워크스페이스",marquee:"시스템을 연결하는 공통 언어",testimonials:"함께 만드는 인터페이스"}[i];function g(){y||(O(!0),A.current=setTimeout(()=>{w(k=>[...k,ce[k.length%ce.length]]),b(_.length),O(!1),j("샘플 응답의 새 버전을 추가했습니다.")},800))}function R(k){if(!f)return;if(window.speechSynthesis.cancel(),!k){B(!1);return}const I=new SpeechSynthesisUtterance(_[l]);I.lang="ko-KR",I.onend=()=>{E.current=null,B(!1)},I.onerror=()=>{E.current=null,B(!1),j("음성 재생을 완료하지 못했습니다.")},E.current=I,B(!0),window.speechSynthesis.speak(I)}return e.jsxs("section",{className:"ka-showcase","data-density":o,children:[e.jsxs("header",{className:"ka-header",children:[e.jsxs("div",{children:[e.jsxs("span",{className:"ka-eyebrow",children:[e.jsx(le,{size:14})," KLIC Studio / 상호작용"]}),e.jsx("h2",{children:T}),e.jsx("p",{children:i==="review"?"사람이 결정하고, 에이전트는 과정을 투명하게 보여줍니다.":i==="response"?"응답의 맥락을 유지하며 비교하고 다듬어 보세요.":"네 계층의 토큰과 일관된 컴포넌트로 만드는 제품 경험."})]}),i==="marquee"||i==="testimonials"?e.jsx("button",{className:"ka-control",onClick:()=>L(k=>!k),"aria-pressed":z,children:z?"움직임 재개":"움직임 일시정지"}):e.jsx("button",{className:"ka-control",onClick:()=>{A.current&&clearTimeout(A.current),O(!1),c(k=>k+1),M("error"),j("검토 상태를 초기화했습니다.")},children:"검토 초기화"})]}),i==="review"&&e.jsxs("div",{className:"ka-review",children:[e.jsxs("div",{className:"ka-main",children:[e.jsx("div",{className:"ka-section-label",children:"01 / 결정 대기"}),e.jsx(Ae,{decisions:pt,onDecide:(k,I)=>j(`${k.title} — ${I==="primary"?k.primary:k.secondary}`)},p),e.jsx("div",{className:"ka-section-label",children:"02 / 실행 기록"}),e.jsxs(Pe,{defaultOpen:!0,label:"자료 검토",runningLabel:"검토 중",children:[e.jsx(xe,{name:"registry.search",summary:"관련 컴포넌트 4개를 찾았습니다",status:"success",duration:420,args:{query:"KLIC blue theme",limit:4},result:{count:4,source:"local sample"}}),e.jsx(xe,{name:"tokens.validate",summary:"검증 결과 확인",status:v,error:v==="error"?"샘플 연결 오류 · 재시도로 복구할 수 있습니다.":void 0,args:{layers:4,modes:["light","dark"]},result:v==="success"?{valid:!0,unverified:0}:void 0,onRetry:()=>{v!=="running"&&(M("running"),A.current=setTimeout(()=>{M("success"),j("샘플 검증이 완료되었습니다.")},900))}})]})]}),e.jsxs("aside",{className:"ka-aside",children:[e.jsx("div",{className:"ka-section-label",children:"추천"}),e.jsx(Ue,{options:mt,defaultOpen:!0,onAccept:k=>j(`${k.label} 선택 · 실제 배포는 수행하지 않습니다.`),onUndo:()=>j("추천 선택을 되돌렸습니다.")},p),e.jsxs("div",{className:"ka-note",children:[e.jsx("strong",{children:"결정 권한은 팀에 있습니다."}),e.jsx("p",{children:"근거와 대안을 비교한 뒤 적용 범위를 확정하세요. 모든 동작은 로컬 샘플입니다."})]})]})]}),i==="response"&&e.jsxs("div",{className:"ka-response","data-ui-message":!0,children:[e.jsxs("div",{className:"ka-author",children:[e.jsx(le,{size:24}),e.jsxs("div",{children:[e.jsx("strong",{children:"KLIC Assistant"}),e.jsx("small",{children:"디자인 시스템 검토 · 샘플 응답"})]})]}),e.jsx(Je,{version:l,children:e.jsxs("div",{className:"ka-response-text",children:[e.jsx("h3",{children:"블루 테마 도입 제안"}),e.jsx("p",{children:_[l]}),e.jsxs("ol",{children:[e.jsx("li",{children:"기본 브랜드와 지원 환경 확정"}),e.jsx("li",{children:"네 계층 토큰 연결 검증"}),e.jsx("li",{children:"대표 업무의 브라우저 수용 시험"})]})]})}),e.jsx(et,{text:_[l],versions:_,version:l,onVersionChange:k=>{D&&R(!1),b(k)},quiet:!1,onRegenerate:g,regenerating:y,actions:f?["copy","regenerate","feedback","speak"]:["copy","regenerate","feedback"],speaking:D,onSpeak:R,onFeedback:(k,I)=>j(k?`샘플 피드백: ${k==="up"?"도움 됨":I||"개선 필요"}`:"피드백을 취소했습니다.")}),!f&&e.jsx("p",{className:"ka-note-text",children:"이 브라우저는 음성 읽기를 지원하지 않습니다."}),e.jsx("p",{className:"ka-note-text",children:"재생성은 샘플 문구를 새 버전으로 추가합니다. AI 서비스와 연결되지 않습니다."})]}),i==="marquee"&&e.jsxs("div",{className:"ka-marketing",children:[e.jsxs("div",{className:"ka-orbit",children:[e.jsx(ue,{size:30}),e.jsx("span",{children:"하나의 시스템, 다양한 가능성."})]}),e.jsx(at,{logos:ht,rows:2,labels:"beside",speed:z?0:28,gap:48,label:"KLIC 시스템 구성 요소"}),e.jsxs("div",{className:"ka-marketing-foot",children:[e.jsx("span",{children:"토큰 계층 4개"}),e.jsx("span",{children:"표면 재질 4개"}),e.jsx("span",{children:"글꼴 9종"})]}),e.jsx("p",{className:"ka-note-text",children:"시스템 구성 요소 예시 · 고객사나 파트너 목록이 아닙니다. 드래그해서 이동할 수 있습니다."})]}),i==="testimonials"&&e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"ka-sample-label",children:"예시 콘텐츠 · 실제 고객 후기 아님"}),e.jsx(ut,{items:xt,columns:3,speed:z?0:22,label:"가상의 팀 피드백 카드",className:"ka-wall"})]}),e.jsx("output",{className:"ka-status","aria-live":"polite",children:m})]})}export{kt as AffectShowcaseBlock};
