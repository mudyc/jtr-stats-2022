function w(){}function F(t,n){for(const e in n)t[e]=n[e];return t}function O(t){return t()}function D(){return Object.create(null)}function y(t){t.forEach(O)}function P(t){return typeof t=="function"}function ot(t,n){return t!=t?n==n:t!==n||t&&typeof t=="object"||typeof t=="function"}let x;function ut(t,n){return x||(x=document.createElement("a")),x.href=n,t===x.href}function R(t){return Object.keys(t).length===0}function W(t,...n){if(t==null)return w;const e=t.subscribe(...n);return e.unsubscribe?()=>e.unsubscribe():e}function lt(t,n,e){t.$$.on_destroy.push(W(n,e))}function ft(t,n,e,i){if(t){const r=q(t,n,e,i);return t[0](r)}}function q(t,n,e,i){return t[1]&&i?F(e.ctx.slice(),t[1](i(n))):e.ctx}function at(t,n,e,i){if(t[2]&&i){const r=t[2](i(e));if(n.dirty===void 0)return r;if(typeof r=="object"){const l=[],s=Math.max(n.dirty.length,r.length);for(let o=0;o<s;o+=1)l[o]=n.dirty[o]|r[o];return l}return n.dirty|r}return n.dirty}function _t(t,n,e,i,r,l){if(r){const s=q(n,e,i,l);t.p(s,r)}}function dt(t){if(t.ctx.length>32){const n=[],e=t.ctx.length/32;for(let i=0;i<e;i++)n[i]=-1;return n}return-1}function ht(t){const n={};for(const e in t)e[0]!=="$"&&(n[e]=t[e]);return n}let E=!1;function G(){E=!0}function I(){E=!1}function J(t,n,e,i){for(;t<n;){const r=t+(n-t>>1);e(r)<=i?t=r+1:n=r}return t}function K(t){if(t.hydrate_init)return;t.hydrate_init=!0;let n=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let u=0;u<n.length;u++){const a=n[u];a.claim_order!==void 0&&c.push(a)}n=c}const e=new Int32Array(n.length+1),i=new Int32Array(n.length);e[0]=-1;let r=0;for(let c=0;c<n.length;c++){const u=n[c].claim_order,a=(r>0&&n[e[r]].claim_order<=u?r+1:J(1,r,g=>n[e[g]].claim_order,u))-1;i[c]=e[a]+1;const f=a+1;e[f]=c,r=Math.max(f,r)}const l=[],s=[];let o=n.length-1;for(let c=e[r]+1;c!=0;c=i[c-1]){for(l.push(n[c-1]);o>=c;o--)s.push(n[o]);o--}for(;o>=0;o--)s.push(n[o]);l.reverse(),s.sort((c,u)=>c.claim_order-u.claim_order);for(let c=0,u=0;c<s.length;c++){for(;u<l.length&&s[c].claim_order>=l[u].claim_order;)u++;const a=u<l.length?l[u]:null;t.insertBefore(s[c],a)}}function Q(t,n){if(E){for(K(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;n!==t.actual_end_child?(n.claim_order!==void 0||n.parentNode!==t)&&t.insertBefore(n,t.actual_end_child):t.actual_end_child=n.nextSibling}else(n.parentNode!==t||n.nextSibling!==null)&&t.appendChild(n)}function mt(t,n,e){E&&!e?Q(t,n):(n.parentNode!==t||n.nextSibling!=e)&&t.insertBefore(n,e||null)}function U(t){t.parentNode&&t.parentNode.removeChild(t)}function V(t){return document.createElement(t)}function j(t){return document.createTextNode(t)}function pt(){return j(" ")}function yt(){return j("")}function gt(t,n,e,i){return t.addEventListener(n,e,i),()=>t.removeEventListener(n,e,i)}function X(t,n,e){e==null?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function xt(t,n){const e=Object.getOwnPropertyDescriptors(t.__proto__);for(const i in n)n[i]==null?t.removeAttribute(i):i==="style"?t.style.cssText=n[i]:i==="__value"?t.value=t[i]=n[i]:e[i]&&e[i].set?t[i]=n[i]:X(t,i,n[i])}function Y(t){return Array.from(t.childNodes)}function Z(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function B(t,n,e,i,r=!1){Z(t);const l=(()=>{for(let s=t.claim_info.last_index;s<t.length;s++){const o=t[s];if(n(o)){const c=e(o);return c===void 0?t.splice(s,1):t[s]=c,r||(t.claim_info.last_index=s),o}}for(let s=t.claim_info.last_index-1;s>=0;s--){const o=t[s];if(n(o)){const c=e(o);return c===void 0?t.splice(s,1):t[s]=c,r?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=s,o}}return i()})();return l.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,l}function tt(t,n,e,i){return B(t,r=>r.nodeName===n,r=>{const l=[];for(let s=0;s<r.attributes.length;s++){const o=r.attributes[s];e[o.name]||l.push(o.name)}l.forEach(s=>r.removeAttribute(s))},()=>i(n))}function bt(t,n,e){return tt(t,n,e,V)}function nt(t,n){return B(t,e=>e.nodeType===3,e=>{const i=""+n;if(e.data.startsWith(i)){if(e.data.length!==i.length)return e.splitText(i.length)}else e.data=i},()=>j(n),!0)}function $t(t){return nt(t," ")}function wt(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}function Et(t,n,e,i){e===null?t.style.removeProperty(n):t.style.setProperty(n,e,i?"important":"")}function Nt(t,n){const e=[];let i=0;for(const r of n.childNodes)if(r.nodeType===8){const l=r.textContent.trim();l===`HEAD_${t}_END`?(i-=1,e.push(r)):l===`HEAD_${t}_START`&&(i+=1,e.push(r))}else i>0&&e.push(r);return e}function vt(t,n){return new t(n)}let p;function m(t){p=t}function S(){if(!p)throw new Error("Function called outside component initialization");return p}function At(t){S().$$.on_mount.push(t)}function kt(t){S().$$.after_update.push(t)}function jt(t){S().$$.on_destroy.push(t)}function St(t,n){const e=t.$$.callbacks[n.type];e&&e.slice().forEach(i=>i.call(this,n))}const h=[],M=[],b=[],v=[],H=Promise.resolve();let A=!1;function L(){A||(A=!0,H.then(z))}function Tt(){return L(),H}function k(t){b.push(t)}function Ct(t){v.push(t)}const N=new Set;let d=0;function z(){if(d!==0)return;const t=p;do{try{for(;d<h.length;){const n=h[d];d++,m(n),et(n.$$)}}catch(n){throw h.length=0,d=0,n}for(m(null),h.length=0,d=0;M.length;)M.pop()();for(let n=0;n<b.length;n+=1){const e=b[n];N.has(e)||(N.add(e),e())}b.length=0}while(h.length);for(;v.length;)v.pop()();A=!1,N.clear(),m(t)}function et(t){if(t.fragment!==null){t.update(),y(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(k)}}const $=new Set;let _;function Dt(){_={r:0,c:[],p:_}}function Mt(){_.r||y(_.c),_=_.p}function it(t,n){t&&t.i&&($.delete(t),t.i(n))}function Ot(t,n,e,i){if(t&&t.o){if($.has(t))return;$.add(t),_.c.push(()=>{$.delete(t),i&&(e&&t.d(1),i())}),t.o(n)}else i&&i()}function Pt(t,n){const e={},i={},r={$$scope:1};let l=t.length;for(;l--;){const s=t[l],o=n[l];if(o){for(const c in s)c in o||(i[c]=1);for(const c in o)r[c]||(e[c]=o[c],r[c]=1);t[l]=o}else for(const c in s)r[c]=1}for(const s in i)s in e||(e[s]=void 0);return e}function qt(t){return typeof t=="object"&&t!==null?t:{}}function Bt(t,n,e){const i=t.$$.props[n];i!==void 0&&(t.$$.bound[i]=e,e(t.$$.ctx[i]))}function Ht(t){t&&t.c()}function Lt(t,n){t&&t.l(n)}function rt(t,n,e,i){const{fragment:r,after_update:l}=t.$$;r&&r.m(n,e),i||k(()=>{const s=t.$$.on_mount.map(O).filter(P);t.$$.on_destroy?t.$$.on_destroy.push(...s):y(s),t.$$.on_mount=[]}),l.forEach(k)}function ct(t,n){const e=t.$$;e.fragment!==null&&(y(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function st(t,n){t.$$.dirty[0]===-1&&(h.push(t),L(),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function zt(t,n,e,i,r,l,s,o=[-1]){const c=p;m(t);const u=t.$$={fragment:null,ctx:[],props:l,update:w,not_equal:r,bound:D(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(c?c.$$.context:[])),callbacks:D(),dirty:o,skip_bound:!1,root:n.target||c.$$.root};s&&s(u.root);let a=!1;if(u.ctx=e?e(t,n.props||{},(f,g,...T)=>{const C=T.length?T[0]:g;return u.ctx&&r(u.ctx[f],u.ctx[f]=C)&&(!u.skip_bound&&u.bound[f]&&u.bound[f](C),a&&st(t,f)),g}):[],u.update(),a=!0,y(u.before_update),u.fragment=i?i(u.ctx):!1,n.target){if(n.hydrate){G();const f=Y(n.target);u.fragment&&u.fragment.l(f),f.forEach(U)}else u.fragment&&u.fragment.c();n.intro&&it(t.$$.fragment),rt(t,n.target,n.anchor,n.customElement),I(),z()}m(c)}class Ft{$destroy(){ct(this,1),this.$destroy=w}$on(n,e){if(!P(e))return w;const i=this.$$.callbacks[n]||(this.$$.callbacks[n]=[]);return i.push(e),()=>{const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}$set(n){this.$$set&&!R(n)&&(this.$$.skip_bound=!0,this.$$set(n),this.$$.skip_bound=!1)}}export{ct as A,Tt as B,w as C,ft as D,_t as E,dt as F,at as G,Q as H,lt as I,gt as J,jt as K,St as L,p as M,F as N,xt as O,Pt as P,ht as Q,Bt as R,Ft as S,qt as T,Ct as U,Nt as V,ut as W,pt as a,mt as b,$t as c,Mt as d,yt as e,it as f,Dt as g,U as h,zt as i,kt as j,V as k,bt as l,Y as m,X as n,At as o,Et as p,j as q,nt as r,ot as s,Ot as t,wt as u,M as v,vt as w,Ht as x,Lt as y,rt as z};