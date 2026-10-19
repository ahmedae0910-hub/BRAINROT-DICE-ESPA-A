const KX=(()=>{
const COLS=[["Rojo","#ee1111"],["Naranja","#ff9100"],["Amarillo","#ffd400"],["Verde","#0e9a00"],["Azul","#1565ff"],["Morado","#8e2bff"]];
const PIPS={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
const rnd=m=>{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%m+1};
const sum=v=>v.reduce((a,b)=>a+b,0);
const fmt=id=>id;
function mk(v,z,t){const d=document.createElement("div");d.className="die"+(z?" "+z:"")+(t==="color"?" col":" d"+t);
if(t==="color"){d.style.setProperty("--c",COLS[v-1][1]);d.title=COLS[v-1][0];const i=document.createElement("i");i.className="rb";d.append(i)}
else if(t==="6"){const p=document.createElement("div");p.className="pips";for(let i=0;i<9;i++){const c=document.createElement("i");c.style.visibility=PIPS[v].includes(i)?"visible":"hidden";p.append(c)}d.append(p)}
else d.textContent=v;return d}
function draw(tr,vals,keep,t){const z=vals.length>12?"s":"";
if(keep&&tr.children.length===vals.length){vals.forEach((v,i)=>tr.children[i].replaceChildren(mk(v,z,t)));return}
tr.replaceChildren();vals.forEach((v,i)=>{const w=document.createElement("div");w.className="dw";w.style.setProperty("--dl",(Math.min(i,20)*0.02)+"s");w.append(mk(v,z,t));tr.append(w)})}
function spin(tr,n,t,end){const m=t==="color"?6:+t;tr.classList.add("rolling");
draw(tr,Array.from({length:n},()=>rnd(m)),true,t);
const iv=setInterval(()=>draw(tr,Array.from({length:n},()=>rnd(m)),true,t),140);
setTimeout(()=>{clearInterval(iv);tr.classList.remove("rolling");end()},2900)}
function show(e,res,det,tl){tl.replaceChildren();
if(e.t==="color"){const c=[0,0,0,0,0,0];e.v.forEach(v=>c[v-1]++);res.textContent="Resultado: "+e.v.map(v=>COLS[v-1][0]).slice(0,8).join(", ")+(e.v.length>8?"…":"");det.textContent="";
COLS.forEach((x,i)=>{if(!c[i])return;const ch=document.createElement("span");ch.className="chip";const b=document.createElement("b");b.style.background=x[1];ch.append(b,x[0]+" × "+c[i]);tl.append(ch)})}
else{const s=sum(e.v);res.textContent="Suma: "+s;det.textContent=e.v.length>1?"Media: "+(s/e.v.length).toFixed(2)+" · Mayor: "+Math.max(...e.v)+" · Menor: "+Math.min(...e.v):""}}
function renderHist(ol,list){ol.replaceChildren();
if(!list.length){const li=document.createElement("li");li.className="none";li.textContent="Aún no hay tiradas.";ol.append(li);return}
list.forEach(h=>{const li=document.createElement("li"),r=document.createElement("div");r.className="hr";
h.v.slice(0,24).forEach(v=>r.append(mk(v,"xs",h.t)));
if(h.v.length>24){const m=document.createElement("span");m.className="more";m.textContent="+"+(h.v.length-24);r.append(m)}
const lb=document.createElement("span");lb.className="lb";lb.textContent=h.t==="color"?h.v.length+" colores":h.v.length+"d"+h.t+" = "+sum(h.v);
li.append(r,lb);
if(h.ts){const ts=document.createElement("span");ts.className="ts";ts.textContent=new Date(h.ts).toLocaleString("es");li.append(ts)}
ol.append(li)})}
return{COLS,rnd,sum,fmt,mk,draw,spin,show,renderHist}})();
