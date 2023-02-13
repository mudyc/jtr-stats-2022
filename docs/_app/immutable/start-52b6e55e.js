import{S as ht,i as mt,s as _t,a as gt,e as H,c as wt,b as Y,g as _e,t as K,d as ge,f as M,h as G,j as yt,o as je,k as bt,l as vt,m as Et,n as Re,p as B,q as kt,r as St,u as Rt,v as Le,w as Z,x as Q,y as De,z as x,A as ee,B as he}from"./chunks/index-d68cf0a1.js";import{S as lt,a as ct,I as $,g as Qe,f as xe,b as Ie,c as me,s as F,i as et,d as oe,e as X,P as tt,h as Lt,j as It,k as At}from"./chunks/singletons-c16f5bdf.js";function Pt(a,e){return a==="/"||e==="ignore"?a:e==="never"?a.endsWith("/")?a.slice(0,-1):a:e==="always"&&!a.endsWith("/")?a+"/":a}function Ot(a){return a.split("%25").map(decodeURI).join("%25")}function Ut(a){for(const e in a)a[e]=decodeURIComponent(a[e]);return a}const Nt=["href","pathname","search","searchParams","toString","toJSON"];function jt(a,e){const n=new URL(a);for(const i of Nt){let o=n[i];Object.defineProperty(n,i,{get(){return e(),o},enumerable:!0,configurable:!0})}return Tt(n),n}function Tt(a){Object.defineProperty(a,"hash",{get(){throw new Error("Cannot access event.url.hash. Consider using `$page.url.hash` inside a component instead")}})}const Dt="/__data.json";function Ct(a){return a.replace(/\/$/,"")+Dt}function ft(a){try{return JSON.parse(sessionStorage[a])}catch{}}function nt(a,e){const n=JSON.stringify(e);try{sessionStorage[a]=n}catch{}}function qt(...a){let e=5381;for(const n of a)if(typeof n=="string"){let i=n.length;for(;i;)e=e*33^n.charCodeAt(--i)}else if(ArrayBuffer.isView(n)){const i=new Uint8Array(n.buffer,n.byteOffset,n.byteLength);let o=i.length;for(;o;)e=e*33^i[--o]}else throw new TypeError("value must be a string or TypedArray");return(e>>>0).toString(36)}const we=window.fetch;window.fetch=(a,e)=>((a instanceof Request?a.method:(e==null?void 0:e.method)||"GET")!=="GET"&&ie.delete(Ce(a)),we(a,e));const ie=new Map;function Vt(a,e){const n=Ce(a,e),i=document.querySelector(n);if(i!=null&&i.textContent){const{body:o,...p}=JSON.parse(i.textContent),t=i.getAttribute("data-ttl");return t&&ie.set(n,{body:o,init:p,ttl:1e3*Number(t)}),Promise.resolve(new Response(o,p))}return we(a,e)}function $t(a,e,n){if(ie.size>0){const i=Ce(a,n),o=ie.get(i);if(o){if(performance.now()<o.ttl&&["default","force-cache","only-if-cached",void 0].includes(n==null?void 0:n.cache))return new Response(o.body,o.init);ie.delete(i)}}return we(e,n)}function Ce(a,e){let i=`script[data-sveltekit-fetched][data-url=${JSON.stringify(a instanceof Request?a.url:a)}]`;if(e!=null&&e.headers||e!=null&&e.body){const o=[];e.headers&&o.push([...new Headers(e.headers)].join(",")),e.body&&(typeof e.body=="string"||ArrayBuffer.isView(e.body))&&o.push(e.body),i+=`[data-hash="${qt(...o)}"]`}return i}const Bt=/^(\[)?(\.\.\.)?(\w+)(?:=(\w+))?(\])?$/;function Ft(a){const e=[];return{pattern:a==="/"?/^\/$/:new RegExp(`^${Kt(a).map(i=>{const o=/^\[\.\.\.(\w+)(?:=(\w+))?\]$/.exec(i);if(o)return e.push({name:o[1],matcher:o[2],optional:!1,rest:!0,chained:!0}),"(?:/(.*))?";const p=/^\[\[(\w+)(?:=(\w+))?\]\]$/.exec(i);if(p)return e.push({name:p[1],matcher:p[2],optional:!0,rest:!1,chained:!0}),"(?:/([^/]+))?";if(!i)return;const t=i.split(/\[(.+?)\](?!\])/);return"/"+t.map((m,h)=>{if(h%2){if(m.startsWith("x+"))return Ae(String.fromCharCode(parseInt(m.slice(2),16)));if(m.startsWith("u+"))return Ae(String.fromCharCode(...m.slice(2).split("-").map(A=>parseInt(A,16))));const g=Bt.exec(m);if(!g)throw new Error(`Invalid param: ${m}. Params and matcher names can only have underscores and alphanumeric characters.`);const[,y,N,T,C]=g;return e.push({name:T,matcher:C,optional:!!y,rest:!!N,chained:N?h===1&&t[0]==="":!1}),N?"(.*?)":y?"([^/]*)?":"([^/]+?)"}return Ae(m)}).join("")}).join("")}/?$`),params:e}}function Ht(a){return!/^\([^)]+\)$/.test(a)}function Kt(a){return a.slice(1).split("/").filter(Ht)}function Mt(a,e,n){const i={},o=a.slice(1);let p=0;for(let t=0;t<e.length;t+=1){const u=e[t],m=o[t-p];if(u.chained&&u.rest&&p){i[u.name]=o.slice(t-p,t+1).filter(h=>h).join("/"),p=0;continue}if(m===void 0){u.rest&&(i[u.name]="");continue}if(!u.matcher||n[u.matcher](m)){i[u.name]=m;continue}if(u.optional&&u.chained){p++;continue}return}if(!p)return i}function Ae(a){return a.normalize().replace(/[[\]]/g,"\\$&").replace(/%/g,"%25").replace(/\//g,"%2[Ff]").replace(/\?/g,"%3[Ff]").replace(/#/g,"%23").replace(/[.*+?^${}()|\\]/g,"\\$&")}function Gt(a,e,n,i){const o=new Set(e);return Object.entries(n).map(([u,[m,h,g]])=>{const{pattern:y,params:N}=Ft(u),T={id:u,exec:C=>{const A=y.exec(C);if(A)return Mt(A,N,i)},errors:[1,...g||[]].map(C=>a[C]),layouts:[0,...h||[]].map(t),leaf:p(m)};return T.errors.length=T.layouts.length=Math.max(T.errors.length,T.layouts.length),T});function p(u){const m=u<0;return m&&(u=~u),[m,a[u]]}function t(u){return u===void 0?u:[o.has(u),a[u]]}}function Jt(a){let e,n,i;var o=a[1][0];function p(t){return{props:{data:t[3],form:t[2]}}}return o&&(e=Z(o,p(a)),a[12](e)),{c(){e&&Q(e.$$.fragment),n=H()},l(t){e&&De(e.$$.fragment,t),n=H()},m(t,u){e&&x(e,t,u),Y(t,n,u),i=!0},p(t,u){const m={};if(u&8&&(m.data=t[3]),u&4&&(m.form=t[2]),o!==(o=t[1][0])){if(e){_e();const h=e;K(h.$$.fragment,1,0,()=>{ee(h,1)}),ge()}o?(e=Z(o,p(t)),t[12](e),Q(e.$$.fragment),M(e.$$.fragment,1),x(e,n.parentNode,n)):e=null}else o&&e.$set(m)},i(t){i||(e&&M(e.$$.fragment,t),i=!0)},o(t){e&&K(e.$$.fragment,t),i=!1},d(t){a[12](null),t&&G(n),e&&ee(e,t)}}}function zt(a){let e,n,i;var o=a[1][0];function p(t){return{props:{data:t[3],$$slots:{default:[Wt]},$$scope:{ctx:t}}}}return o&&(e=Z(o,p(a)),a[11](e)),{c(){e&&Q(e.$$.fragment),n=H()},l(t){e&&De(e.$$.fragment,t),n=H()},m(t,u){e&&x(e,t,u),Y(t,n,u),i=!0},p(t,u){const m={};if(u&8&&(m.data=t[3]),u&8215&&(m.$$scope={dirty:u,ctx:t}),o!==(o=t[1][0])){if(e){_e();const h=e;K(h.$$.fragment,1,0,()=>{ee(h,1)}),ge()}o?(e=Z(o,p(t)),t[11](e),Q(e.$$.fragment),M(e.$$.fragment,1),x(e,n.parentNode,n)):e=null}else o&&e.$set(m)},i(t){i||(e&&M(e.$$.fragment,t),i=!0)},o(t){e&&K(e.$$.fragment,t),i=!1},d(t){a[11](null),t&&G(n),e&&ee(e,t)}}}function Wt(a){let e,n,i;var o=a[1][1];function p(t){return{props:{data:t[4],form:t[2]}}}return o&&(e=Z(o,p(a)),a[10](e)),{c(){e&&Q(e.$$.fragment),n=H()},l(t){e&&De(e.$$.fragment,t),n=H()},m(t,u){e&&x(e,t,u),Y(t,n,u),i=!0},p(t,u){const m={};if(u&16&&(m.data=t[4]),u&4&&(m.form=t[2]),o!==(o=t[1][1])){if(e){_e();const h=e;K(h.$$.fragment,1,0,()=>{ee(h,1)}),ge()}o?(e=Z(o,p(t)),t[10](e),Q(e.$$.fragment),M(e.$$.fragment,1),x(e,n.parentNode,n)):e=null}else o&&e.$set(m)},i(t){i||(e&&M(e.$$.fragment,t),i=!0)},o(t){e&&K(e.$$.fragment,t),i=!1},d(t){a[10](null),t&&G(n),e&&ee(e,t)}}}function at(a){let e,n=a[6]&&rt(a);return{c(){e=bt("div"),n&&n.c(),this.h()},l(i){e=vt(i,"DIV",{id:!0,"aria-live":!0,"aria-atomic":!0,style:!0});var o=Et(e);n&&n.l(o),o.forEach(G),this.h()},h(){Re(e,"id","svelte-announcer"),Re(e,"aria-live","assertive"),Re(e,"aria-atomic","true"),B(e,"position","absolute"),B(e,"left","0"),B(e,"top","0"),B(e,"clip","rect(0 0 0 0)"),B(e,"clip-path","inset(50%)"),B(e,"overflow","hidden"),B(e,"white-space","nowrap"),B(e,"width","1px"),B(e,"height","1px")},m(i,o){Y(i,e,o),n&&n.m(e,null)},p(i,o){i[6]?n?n.p(i,o):(n=rt(i),n.c(),n.m(e,null)):n&&(n.d(1),n=null)},d(i){i&&G(e),n&&n.d()}}}function rt(a){let e;return{c(){e=kt(a[7])},l(n){e=St(n,a[7])},m(n,i){Y(n,e,i)},p(n,i){i&128&&Rt(e,n[7])},d(n){n&&G(e)}}}function Yt(a){let e,n,i,o,p;const t=[zt,Jt],u=[];function m(g,y){return g[1][1]?0:1}e=m(a),n=u[e]=t[e](a);let h=a[5]&&at(a);return{c(){n.c(),i=gt(),h&&h.c(),o=H()},l(g){n.l(g),i=wt(g),h&&h.l(g),o=H()},m(g,y){u[e].m(g,y),Y(g,i,y),h&&h.m(g,y),Y(g,o,y),p=!0},p(g,[y]){let N=e;e=m(g),e===N?u[e].p(g,y):(_e(),K(u[N],1,1,()=>{u[N]=null}),ge(),n=u[e],n?n.p(g,y):(n=u[e]=t[e](g),n.c()),M(n,1),n.m(i.parentNode,i)),g[5]?h?h.p(g,y):(h=at(g),h.c(),h.m(o.parentNode,o)):h&&(h.d(1),h=null)},i(g){p||(M(n),p=!0)},o(g){K(n),p=!1},d(g){u[e].d(g),g&&G(i),h&&h.d(g),g&&G(o)}}}function Xt(a,e,n){let{stores:i}=e,{page:o}=e,{constructors:p}=e,{components:t=[]}=e,{form:u}=e,{data_0:m=null}=e,{data_1:h=null}=e;yt(i.page.notify);let g=!1,y=!1,N=null;je(()=>{const S=i.page.subscribe(()=>{g&&(n(6,y=!0),n(7,N=document.title||"untitled page"))});return n(5,g=!0),S});function T(S){Le[S?"unshift":"push"](()=>{t[1]=S,n(0,t)})}function C(S){Le[S?"unshift":"push"](()=>{t[0]=S,n(0,t)})}function A(S){Le[S?"unshift":"push"](()=>{t[0]=S,n(0,t)})}return a.$$set=S=>{"stores"in S&&n(8,i=S.stores),"page"in S&&n(9,o=S.page),"constructors"in S&&n(1,p=S.constructors),"components"in S&&n(0,t=S.components),"form"in S&&n(2,u=S.form),"data_0"in S&&n(3,m=S.data_0),"data_1"in S&&n(4,h=S.data_1)},a.$$.update=()=>{a.$$.dirty&768&&i.page.set(o)},[t,p,u,m,h,g,y,N,i,o,T,C,A]}class Zt extends ht{constructor(e){super(),mt(this,e,Xt,Yt,_t,{stores:8,page:9,constructors:1,components:0,form:2,data_0:3,data_1:4})}}const Qt="modulepreload",xt=function(a,e){return new URL(a,e).href},st={},Pe=function(e,n,i){if(!n||n.length===0)return e();const o=document.getElementsByTagName("link");return Promise.all(n.map(p=>{if(p=xt(p,i),p in st)return;st[p]=!0;const t=p.endsWith(".css"),u=t?'[rel="stylesheet"]':"";if(!!i)for(let g=o.length-1;g>=0;g--){const y=o[g];if(y.href===p&&(!t||y.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${p}"]${u}`))return;const h=document.createElement("link");if(h.rel=t?"stylesheet":Qt,t||(h.as="script",h.crossOrigin=""),h.href=p,document.head.appendChild(h),t)return new Promise((g,y)=>{h.addEventListener("load",g),h.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${p}`)))})})).then(()=>e())},en={},ye=[()=>Pe(()=>import("./chunks/0-04816d49.js"),["./chunks/0-04816d49.js","./components/layout.svelte-c2a100e7.js","./chunks/index-d68cf0a1.js"],import.meta.url),()=>Pe(()=>import("./chunks/1-47dcea63.js"),["./chunks/1-47dcea63.js","./components/error.svelte-232cfd85.js","./chunks/index-d68cf0a1.js","./chunks/singletons-c16f5bdf.js"],import.meta.url),()=>Pe(()=>import("./chunks/2-bf23ea66.js"),["./chunks/2-bf23ea66.js","./components/pages/_page.svelte-6c6ee496.js","./chunks/index-d68cf0a1.js","./assets/_page-e8d11ead.css"],import.meta.url)],ut=[],tn={"/":[2]},nn={handleError:({error:a})=>{console.error(a)}};let le=class{constructor(e,n){this.status=e,typeof n=="string"?this.body={message:n}:n?this.body=n:this.body={message:`Error: ${e}`}}toString(){return JSON.stringify(this.body)}},ot=class{constructor(e,n){this.status=e,this.location=n}};async function an(a){var e;for(const n in a)if(typeof((e=a[n])==null?void 0:e.then)=="function")return Object.fromEntries(await Promise.all(Object.entries(a).map(async([i,o])=>[i,await o])));return a}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");const rn=-1,sn=-2,on=-3,ln=-4,cn=-5,fn=-6;function un(a){if(typeof a=="number")return i(a,!0);if(!Array.isArray(a)||a.length===0)throw new Error("Invalid input");const e=a,n=Array(e.length);function i(o,p=!1){if(o===rn)return;if(o===on)return NaN;if(o===ln)return 1/0;if(o===cn)return-1/0;if(o===fn)return-0;if(p)throw new Error("Invalid input");if(o in n)return n[o];const t=e[o];if(!t||typeof t!="object")n[o]=t;else if(Array.isArray(t))if(typeof t[0]=="string")switch(t[0]){case"Date":n[o]=new Date(t[1]);break;case"Set":const m=new Set;n[o]=m;for(let y=1;y<t.length;y+=1)m.add(i(t[y]));break;case"Map":const h=new Map;n[o]=h;for(let y=1;y<t.length;y+=2)h.set(i(t[y]),i(t[y+1]));break;case"RegExp":n[o]=new RegExp(t[1],t[2]);break;case"Object":n[o]=Object(t[1]);break;case"BigInt":n[o]=BigInt(t[1]);break;case"null":const g=Object.create(null);n[o]=g;for(let y=1;y<t.length;y+=2)g[t[y]]=i(t[y+1]);break}else{const u=new Array(t.length);n[o]=u;for(let m=0;m<t.length;m+=1){const h=t[m];h!==sn&&(u[m]=i(h))}}else{const u={};n[o]=u;for(const m in t){const h=t[m];u[m]=i(h)}}return n[o]}return i(0)}function dn(a){return a.filter(e=>e!=null)}const Oe=Gt(ye,ut,tn,en),dt=ye[0],Te=ye[1];dt();Te();const W=ft(lt)??{},re=ft(ct)??{};function Ue(a){W[a]=oe()}function pn({target:a}){var Ye;const e=document.documentElement,n=[],i=[];let o=null;const p={before_navigate:[],after_navigate:[]};let t={branch:[],error:null,url:null},u=!1,m=!1,h=!0,g=!1,y=!1,N=!1,T=!1,C,A=(Ye=history.state)==null?void 0:Ye[$];A||(A=Date.now(),history.replaceState({...history.state,[$]:A},"",location.href));const S=W[A];S&&(history.scrollRestoration="manual",scrollTo(S.x,S.y));let J,qe,ce;async function Ve(){ce=ce||Promise.resolve(),await ce,ce=null;const s=new URL(location.href),r=ne(s,!0);o=null,await He(r,s,[])}function $e(s){i.some(r=>r==null?void 0:r.snapshot)&&(re[s]=i.map(r=>{var c;return(c=r==null?void 0:r.snapshot)==null?void 0:c.capture()}))}function Be(s){var r;(r=re[s])==null||r.forEach((c,l)=>{var d,f;(f=(d=i[l])==null?void 0:d.snapshot)==null||f.restore(c)})}async function be(s,{noScroll:r=!1,replaceState:c=!1,keepFocus:l=!1,state:d={},invalidateAll:f=!1},w,_){return typeof s=="string"&&(s=new URL(s,Qe(document))),pe({url:s,scroll:r?oe():null,keepfocus:l,redirect_chain:w,details:{state:d,replaceState:c},nav_token:_,accepted:()=>{f&&(T=!0)},blocked:()=>{},type:"goto"})}async function Fe(s){return o={id:s.id,promise:Ge(s).then(r=>(r.type==="loaded"&&r.state.error&&(o=null),r))},o.promise}async function fe(...s){const c=Oe.filter(l=>s.some(d=>l.exec(d))).map(l=>Promise.all([...l.layouts,l.leaf].map(d=>d==null?void 0:d[1]())));await Promise.all(c)}async function He(s,r,c,l,d,f={},w){var v,b,I;qe=f;let _=s&&await Ge(s);if(_||(_=await We(r,{id:null},await se(new Error(`Not found: ${r.pathname}`),{url:r,params:{},route:{id:null}}),404)),r=(s==null?void 0:s.url)||r,qe!==f)return!1;if(_.type==="redirect")if(c.length>10||c.includes(r.pathname))_=await ue({status:500,error:await se(new Error("Redirect loop"),{url:r,params:{},route:{id:null}}),url:r,route:{id:null}});else return be(new URL(_.location,r).href,{},[...c,r.pathname],f),!1;else((v=_.props.page)==null?void 0:v.status)>=400&&await F.updated.check()&&await ae(r);if(n.length=0,T=!1,g=!0,l&&(Ue(l),$e(l)),(b=_.props.page)!=null&&b.url&&_.props.page.url.pathname!==r.pathname&&(r.pathname=(I=_.props.page)==null?void 0:I.url.pathname),d&&d.details){const{details:R}=d,D=R.replaceState?0:1;if(R.state[$]=A+=D,history[R.replaceState?"replaceState":"pushState"](R.state,"",r),!R.replaceState){let L=A+1;for(;re[L]||W[L];)delete re[L],delete W[L],L+=1}}if(o=null,m?(t=_.state,_.props.page&&(_.props.page.url=r),C.$set(_.props)):Ke(_),d){const{scroll:R,keepfocus:D}=d,{activeElement:L}=document;await he();const E=document.activeElement!==L&&document.activeElement!==document.body;if(!D&&!E&&await Ne(),h){const P=r.hash&&document.getElementById(decodeURIComponent(r.hash.slice(1)));R?scrollTo(R.x,R.y):P?P.scrollIntoView():scrollTo(0,0)}}else await he();h=!0,_.props.page&&(J=_.props.page),w&&w(),g=!1}function Ke(s){var l;t=s.state;const r=document.querySelector("style[data-sveltekit]");r&&r.remove(),J=s.props.page,C=new Zt({target:a,props:{...s.props,stores:F,components:i},hydrate:!0}),Be(A);const c={from:null,to:{params:t.params,route:{id:((l=t.route)==null?void 0:l.id)??null},url:new URL(location.href)},willUnload:!1,type:"enter"};p.after_navigate.forEach(d=>d(c)),m=!0}async function te({url:s,params:r,branch:c,status:l,error:d,route:f,form:w}){let _="never";for(const L of c)(L==null?void 0:L.slash)!==void 0&&(_=L.slash);s.pathname=Pt(s.pathname,_),s.search=s.search;const v={type:"loaded",state:{url:s,params:r,branch:c,error:d,route:f},props:{constructors:dn(c).map(L=>L.node.component)}};w!==void 0&&(v.props.form=w);let b={},I=!J,R=0;for(let L=0;L<Math.max(c.length,t.branch.length);L+=1){const E=c[L],P=t.branch[L];(E==null?void 0:E.data)!==(P==null?void 0:P.data)&&(I=!0),E&&(b={...b,...E.data},I&&(v.props[`data_${R}`]=b),R+=1)}return(!t.url||s.href!==t.url.href||t.error!==d||w!==void 0&&w!==J.form||I)&&(v.props.page={error:d,params:r,route:{id:(f==null?void 0:f.id)??null},status:l,url:new URL(s),form:w??null,data:I?b:J.data}),v}async function ve({loader:s,parent:r,url:c,params:l,route:d,server_data_node:f}){var b,I,R;let w=null;const _={dependencies:new Set,params:new Set,parent:!1,route:!1,url:!1},v=await s();if((b=v.universal)!=null&&b.load){let D=function(...E){for(const P of E){const{href:q}=new URL(P,c);_.dependencies.add(q)}};const L={route:{get id(){return _.route=!0,d.id}},params:new Proxy(l,{get:(E,P)=>(_.params.add(P),E[P])}),data:(f==null?void 0:f.data)??null,url:jt(c,()=>{_.url=!0}),async fetch(E,P){let q;E instanceof Request?(q=E.url,P={body:E.method==="GET"||E.method==="HEAD"?void 0:await E.blob(),cache:E.cache,credentials:E.credentials,headers:E.headers,integrity:E.integrity,keepalive:E.keepalive,method:E.method,mode:E.mode,redirect:E.redirect,referrer:E.referrer,referrerPolicy:E.referrerPolicy,signal:E.signal,...P}):q=E;const V=new URL(q,c);return D(V.href),V.origin===c.origin&&(q=V.href.slice(c.origin.length)),m?$t(q,V.href,P):Vt(q,P)},setHeaders:()=>{},depends:D,parent(){return _.parent=!0,r()}};w=await v.universal.load.call(null,L)??null,w=w?await an(w):null}return{node:v,loader:s,server:f,universal:(I=v.universal)!=null&&I.load?{type:"data",data:w,uses:_}:null,data:w??(f==null?void 0:f.data)??null,slash:((R=v.universal)==null?void 0:R.trailingSlash)??(f==null?void 0:f.slash)}}function Me(s,r,c,l,d){if(T)return!0;if(!l)return!1;if(l.parent&&s||l.route&&r||l.url&&c)return!0;for(const f of l.params)if(d[f]!==t.params[f])return!0;for(const f of l.dependencies)if(n.some(w=>w(new URL(f))))return!0;return!1}function Ee(s,r){return(s==null?void 0:s.type)==="data"?{type:"data",data:s.data,uses:{dependencies:new Set(s.uses.dependencies??[]),params:new Set(s.uses.params??[]),parent:!!s.uses.parent,route:!!s.uses.route,url:!!s.uses.url},slash:s.slash}:(s==null?void 0:s.type)==="skip"?r??null:null}async function Ge({id:s,invalidating:r,url:c,params:l,route:d}){if((o==null?void 0:o.id)===s)return o.promise;const{errors:f,layouts:w,leaf:_}=d,v=[...w,_];f.forEach(k=>k==null?void 0:k().catch(()=>{})),v.forEach(k=>k==null?void 0:k[1]().catch(()=>{}));let b=null;const I=t.url?s!==t.url.pathname+t.url.search:!1,R=t.route?d.id!==t.route.id:!1;let D=!1;const L=v.map((k,j)=>{var z;const O=t.branch[j],U=!!(k!=null&&k[0])&&((O==null?void 0:O.loader)!==k[1]||Me(D,R,I,(z=O.server)==null?void 0:z.uses,l));return U&&(D=!0),U});if(L.some(Boolean)){try{b=await it(c,L)}catch(k){return ue({status:k instanceof le?k.status:500,error:await se(k,{url:c,params:l,route:{id:d.id}}),url:c,route:d})}if(b.type==="redirect")return b}const E=b==null?void 0:b.nodes;let P=!1;const q=v.map(async(k,j)=>{var ke;if(!k)return;const O=t.branch[j],U=E==null?void 0:E[j];if((!U||U.type==="skip")&&k[1]===(O==null?void 0:O.loader)&&!Me(P,R,I,(ke=O.universal)==null?void 0:ke.uses,l))return O;if(P=!0,(U==null?void 0:U.type)==="error")throw U;return ve({loader:k[1],url:c,params:l,route:d,parent:async()=>{var Ze;const Xe={};for(let Se=0;Se<j;Se+=1)Object.assign(Xe,(Ze=await q[Se])==null?void 0:Ze.data);return Xe},server_data_node:Ee(U===void 0&&k[0]?{type:"skip"}:U??null,k[0]?O==null?void 0:O.server:void 0)})});for(const k of q)k.catch(()=>{});const V=[];for(let k=0;k<v.length;k+=1)if(v[k])try{V.push(await q[k])}catch(j){if(j instanceof ot)return{type:"redirect",location:j.location};let O=500,U;if(E!=null&&E.includes(j))O=j.status??O,U=j.error;else if(j instanceof le)O=j.status,U=j.body;else{if(await F.updated.check())return await ae(c);U=await se(j,{params:l,url:c,route:{id:d.id}})}const z=await Je(k,V,f);return z?await te({url:c,params:l,branch:V.slice(0,z.idx).concat(z.node),status:O,error:U,route:d}):await We(c,{id:d.id},U,O)}else V.push(void 0);return await te({url:c,params:l,branch:V,status:200,error:null,route:d,form:r?void 0:null})}async function Je(s,r,c){for(;s--;)if(c[s]){let l=s;for(;!r[l];)l-=1;try{return{idx:l+1,node:{node:await c[s](),loader:c[s],data:{},server:null,universal:null}}}catch{continue}}}async function ue({status:s,error:r,url:c,route:l}){const d={};let f=null;if(ut[0]===0)try{const b=await it(c,[!0]);if(b.type!=="data"||b.nodes[0]&&b.nodes[0].type!=="data")throw 0;f=b.nodes[0]??null}catch{(c.origin!==location.origin||c.pathname!==location.pathname||u)&&await ae(c)}const _=await ve({loader:dt,url:c,params:d,route:l,parent:()=>Promise.resolve({}),server_data_node:Ee(f)}),v={node:await Te(),loader:Te,universal:null,server:null,data:null};return await te({url:c,params:d,branch:[_,v],status:s,error:r,route:null})}function ne(s,r){if(et(s,X))return;const c=de(s);for(const l of Oe){const d=l.exec(c);if(d)return{id:s.pathname+s.search,invalidating:r,route:l,params:Ut(d),url:s}}}function de(s){return Ot(s.pathname.slice(X.length)||"/")}function ze({url:s,type:r,intent:c,delta:l}){var _,v;let d=!1;const f={from:{params:t.params,route:{id:((_=t.route)==null?void 0:_.id)??null},url:t.url},to:{params:(c==null?void 0:c.params)??null,route:{id:((v=c==null?void 0:c.route)==null?void 0:v.id)??null},url:s},willUnload:!c,type:r};l!==void 0&&(f.delta=l);const w={...f,cancel:()=>{d=!0}};return y||p.before_navigate.forEach(b=>b(w)),d?null:f}async function pe({url:s,scroll:r,keepfocus:c,redirect_chain:l,details:d,type:f,delta:w,nav_token:_,accepted:v,blocked:b}){const I=ne(s,!1),R=ze({url:s,type:f,delta:w,intent:I});if(!R){b();return}const D=A;v(),y=!0,m&&F.navigating.set(R),await He(I,s,l,D,{scroll:r,keepfocus:c,details:d},_,()=>{y=!1,p.after_navigate.forEach(L=>L(R)),F.navigating.set(null)})}async function We(s,r,c,l){return s.origin===location.origin&&s.pathname===location.pathname&&!u?await ue({status:l,error:c,url:s,route:r}):await ae(s)}function ae(s){return location.href=s.href,new Promise(()=>{})}function pt(){let s;e.addEventListener("mousemove",f=>{const w=f.target;clearTimeout(s),s=setTimeout(()=>{l(w,2)},20)});function r(f){l(f.composedPath()[0],1)}e.addEventListener("mousedown",r),e.addEventListener("touchstart",r,{passive:!0});const c=new IntersectionObserver(f=>{for(const w of f)w.isIntersecting&&(fe(de(new URL(w.target.href))),c.unobserve(w.target))},{threshold:0});function l(f,w){const _=xe(f,e);if(!_)return;const{url:v,external:b}=Ie(_,X);if(b)return;const I=me(_);if(!I.reload)if(w<=I.preload_data){const R=ne(v,!1);R&&Fe(R)}else w<=I.preload_code&&fe(de(v))}function d(){c.disconnect();for(const f of e.querySelectorAll("a")){const{url:w,external:_}=Ie(f,X);if(_)continue;const v=me(f);v.reload||(v.preload_code===tt.viewport&&c.observe(f),v.preload_code===tt.eager&&fe(de(w)))}}p.after_navigate.push(d),d()}return{after_navigate:s=>{je(()=>(p.after_navigate.push(s),()=>{const r=p.after_navigate.indexOf(s);p.after_navigate.splice(r,1)}))},before_navigate:s=>{je(()=>(p.before_navigate.push(s),()=>{const r=p.before_navigate.indexOf(s);p.before_navigate.splice(r,1)}))},disable_scroll_handling:()=>{(g||!m)&&(h=!1)},goto:(s,r={})=>be(s,r,[]),invalidate:s=>{if(typeof s=="function")n.push(s);else{const{href:r}=new URL(s,location.href);n.push(c=>c.href===r)}return Ve()},invalidateAll:()=>(T=!0,Ve()),preload_data:async s=>{const r=new URL(s,Qe(document)),c=ne(r,!1);if(!c)throw new Error(`Attempted to preload a URL that does not belong to this app: ${r}`);await Fe(c)},preload_code:fe,apply_action:async s=>{if(s.type==="error"){const r=new URL(location.href),{branch:c,route:l}=t;if(!l)return;const d=await Je(t.branch.length,c,l.errors);if(d){const f=await te({url:r,params:t.params,branch:c.slice(0,d.idx).concat(d.node),status:s.status??500,error:s.error,route:l});t=f.state,C.$set(f.props),he().then(Ne)}}else if(s.type==="redirect")be(s.location,{invalidateAll:!0},[]);else{const r={form:s.data,page:{...J,form:s.data,status:s.status}};C.$set(r),s.type==="success"&&he().then(Ne)}},_start_router:()=>{var s;history.scrollRestoration="manual",addEventListener("beforeunload",r=>{var l;let c=!1;if(!y){const d={from:{params:t.params,route:{id:((l=t.route)==null?void 0:l.id)??null},url:t.url},to:null,willUnload:!0,type:"leave",cancel:()=>c=!0};p.before_navigate.forEach(f=>f(d))}c?(r.preventDefault(),r.returnValue=""):history.scrollRestoration="auto"}),addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&(Ue(A),nt(lt,W),$e(A),nt(ct,re))}),(s=navigator.connection)!=null&&s.saveData||pt(),e.addEventListener("click",r=>{if(r.button||r.which!==1||r.metaKey||r.ctrlKey||r.shiftKey||r.altKey||r.defaultPrevented)return;const c=xe(r.composedPath()[0],e);if(!c)return;const{url:l,external:d,target:f}=Ie(c,X);if(!l)return;if(f==="_parent"||f==="_top"){if(window.parent!==window)return}else if(f&&f!=="_self")return;const w=me(c);if(!(c instanceof SVGAElement)&&l.protocol!==location.protocol&&!(l.protocol==="https:"||l.protocol==="http:"))return;if(d||w.reload){ze({url:l,type:"link"})||r.preventDefault(),y=!0;return}const[v,b]=l.href.split("#");if(b!==void 0&&v===location.href.split("#")[0]){N=!0,Ue(A),t.url=l,F.page.set({...J,url:l}),F.page.notify();return}pe({url:l,scroll:w.noscroll?oe():null,keepfocus:!1,redirect_chain:[],details:{state:{},replaceState:l.href===location.href},accepted:()=>r.preventDefault(),blocked:()=>r.preventDefault(),type:"link"})}),e.addEventListener("submit",r=>{if(r.defaultPrevented)return;const c=HTMLFormElement.prototype.cloneNode.call(r.target),l=r.submitter;if(((l==null?void 0:l.formMethod)||c.method)!=="get")return;const f=new URL((l==null?void 0:l.hasAttribute("formaction"))&&(l==null?void 0:l.formAction)||c.action);if(et(f,X))return;const w=r.target,{noscroll:_,reload:v}=me(w);if(v)return;r.preventDefault(),r.stopPropagation();const b=new FormData(w),I=l==null?void 0:l.getAttribute("name");I&&b.append(I,(l==null?void 0:l.getAttribute("value"))??""),f.search=new URLSearchParams(b).toString(),pe({url:f,scroll:_?oe():null,keepfocus:!1,redirect_chain:[],details:{state:{},replaceState:!1},nav_token:{},accepted:()=>{},blocked:()=>{},type:"form"})}),addEventListener("popstate",async r=>{var c;if((c=r.state)!=null&&c[$]){if(r.state[$]===A)return;const l=W[r.state[$]];if(t.url.href.split("#")[0]===location.href.split("#")[0]){W[A]=oe(),A=r.state[$],scrollTo(l.x,l.y);return}const d=r.state[$]-A;let f=!1;await pe({url:new URL(location.href),scroll:l,keepfocus:!1,redirect_chain:[],details:null,accepted:()=>{A=r.state[$]},blocked:()=>{history.go(-d),f=!0},type:"popstate",delta:d}),f||Be(A)}}),addEventListener("hashchange",()=>{N&&(N=!1,history.replaceState({...history.state,[$]:++A},"",location.href))});for(const r of document.querySelectorAll("link"))r.rel==="icon"&&(r.href=r.href);addEventListener("pageshow",r=>{r.persisted&&F.navigating.set(null)})},_hydrate:async({status:s=200,error:r,node_ids:c,params:l,route:d,data:f,form:w})=>{u=!0;const _=new URL(location.href);({params:l={},route:d={id:null}}=ne(_,!1)||{});let v;try{const b=c.map(async(I,R)=>{const D=f[R];return ve({loader:ye[I],url:_,params:l,route:d,parent:async()=>{const L={};for(let E=0;E<R;E+=1)Object.assign(L,(await b[E]).data);return L},server_data_node:Ee(D)})});v=await te({url:_,params:l,branch:await Promise.all(b),status:s,error:r,form:w,route:Oe.find(({id:I})=>I===d.id)??null})}catch(b){if(b instanceof ot){await ae(new URL(b.location,location.href));return}v=await ue({status:b instanceof le?b.status:500,error:await se(b,{url:_,params:l,route:d}),url:_,route:d})}Ke(v)}}}async function it(a,e){var p;const n=new URL(a);n.pathname=Ct(a.pathname),n.searchParams.append("x-sveltekit-invalidated",e.map(t=>t?"1":"").join("_"));const i=await we(n.href),o=await i.json();if(!i.ok)throw new le(i.status,o);return(p=o.nodes)==null||p.forEach(t=>{(t==null?void 0:t.type)==="data"&&(t.data=un(t.data),t.uses={dependencies:new Set(t.uses.dependencies??[]),params:new Set(t.uses.params??[]),parent:!!t.uses.parent,route:!!t.uses.route,url:!!t.uses.url})}),o}function se(a,e){return a instanceof le?a.body:nn.handleError({error:a,event:e})??{message:e.route.id!=null?"Internal Error":"Not Found"}}function Ne(){const a=document.querySelector("[autofocus]");if(a)a.focus();else{const e=document.body,n=e.getAttribute("tabindex");return e.tabIndex=-1,e.focus({preventScroll:!0}),n!==null?e.setAttribute("tabindex",n):e.removeAttribute("tabindex"),new Promise(i=>{setTimeout(()=>{var o;i((o=getSelection())==null?void 0:o.removeAllRanges())})})}}async function wn({assets:a,env:e,hydrate:n,target:i,version:o}){It(a),At(o);const p=pn({target:i});Lt({client:p}),n?await p._hydrate(n):p.goto(location.href,{replaceState:!0}),p._start_router()}export{wn as start};
