(()=>{"use strict";
const $=id=>document.getElementById(id);
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const post=async(u,b)=>{const r=await fetch(u,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)});if(!r.ok)throw new Error(r.status);return r.json()};
/* ---- mensaje del admin (dentro del recuadro de los dados) ---- */
const stg=$("stage"),an=el("div","annl"),at=el("span");an.hidden=true;an.append(el("b",null,"ADMIN"),at);
if(stg)stg.insertBefore(an,stg.firstChild);
let ctx=null,lastNews="",firstNews=true;
function chime(){try{let on=true;try{on=JSON.parse(localStorage.getItem("kx.prefs")||"{}").snd!==false}catch(e){}if(!on)return;
ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();if(ctx.state==="suspended")ctx.resume();
const t0=ctx.currentTime+.02;[[659.25,0],[880,.13],[1108.73,.26]].forEach(([f,d])=>{const o=ctx.createOscillator(),g=ctx.createGain();
o.type="triangle";o.frequency.value=f;g.gain.setValueAtTime(.0001,t0+d);g.gain.exponentialRampToValueAtTime(.28,t0+d+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+d+.75);
o.connect(g);g.connect(ctx.destination);o.start(t0+d);o.stop(t0+d+.8)})}catch(e){}}
function news(a){const fresh=!!a&&a.id!==lastNews&&!firstNews;firstNews=false;lastNews=a?a.id:"";
if(!a||!stg){an.hidden=true;return}at.textContent=a.text;an.hidden=false;if(fresh)chime()}
/* ---- tabla de streamers VIP ---- */
function renderSt(list){const box=$("streamers");if(!box)return;box.replaceChildren();
const hd=el("div","row");hd.append(el("strong",null,"🎥 Streamers VIP"));box.append(hd);
const sh=el("div","shead");sh.append(el("span",null,"Streamer"),el("span",null,"Estado"));box.append(sh);
const rows=(list||[]).filter(s=>s&&/^\/vipimg\/[a-f0-9]{8}-av\.jpg$/.test(s.av));
if(!rows.length){box.append(el("p","mu","Aún no hay streamers VIP."));return}
rows.sort((a,b)=>(b.live?1:0)-(a.live?1:0));
rows.forEach(s=>{const h=/^[A-Za-z0-9._]{2,24}$/.test(s.tiktok||"")?s.tiktok:null,cls="srow"+(s.live?" islive":"");
const r=h?el("a",cls):el("div",cls);
if(h){r.href="https://www.tiktok.com/@"+h+"/live";r.target="_blank";r.rel="noopener noreferrer";r.title="Ver el directo en TikTok"}
const im=el("img","av"),nm=el("div","snm");im.src=s.av;im.alt="";
nm.append(el("b",null,String(s.name)),el("small",null,h?"@"+h+" · TikTok":"Streamer VIP"));
r.append(im,nm,s.live?el("span","liveb","🔴 EN VIVO"):el("span","offb","Sin directo"));
if(h)r.append(el("span","go2","›"));box.append(r)})}
function feed(){let es;try{es=new EventSource("/api/feed")}catch(e){return}
es.addEventListener("news",e=>news(JSON.parse(e.data)));
es.addEventListener("streamers",e=>renderSt(JSON.parse(e.data)))}
feed();
/* ---- contacto con el admin ---- */
const cb=el("button","cbtn","✉");cb.title="Contactar";cb.setAttribute("aria-label","Contactar");document.body.append(cb);
const cm=el("div","modal"),cc=el("div","card");cm.hidden=true;cm.append(cc);
const top=el("div","row"),cx=el("button","btn","Cerrar");top.append(el("strong",null,"✉ Contacto"),cx);
const ty=el("select");[["tecnico","🛠 Problema técnico"],["fraude","🚨 Fraude"],["vip","👑 Solicitar VIP"]].forEach(([v,l])=>ty.add(new Option(l,v)));
const ct=el("input");ct.maxLength=60;ct.placeholder="Tu usuario de Discord o TikTok (para que te responda)";ct.autocomplete="off";ct.style.cssText="text-transform:none;font-size:1rem;width:100%;margin-top:8px;padding:10px;border-radius:10px;border:2px solid var(--bd);background:var(--bg);color:var(--tx);font-family:inherit";
const ms=el("textarea");ms.maxLength=1000;ms.rows=4;ms.placeholder="Cuéntame qué pasa…";ms.style.cssText=ct.style.cssText;ms.style.resize="vertical";
ty.style.cssText="width:100%;margin-top:8px";
const hp=el("input");hp.tabIndex=-1;hp.autocomplete="off";hp.style.cssText="position:absolute;left:-9999px;opacity:0";
const sd=el("button","go","Enviar");sd.style.marginTop="10px";const st=el("div","det");
cc.append(top,el("p","mu","Elige el motivo y déjame tu Discord o TikTok para poder responderte."),ty,ct,ms,hp,sd,st);document.body.append(cm);
cb.onclick=()=>{cm.hidden=false;st.textContent=""};cx.onclick=()=>{cm.hidden=true};
sd.onclick=async()=>{if(hp.value)return;const c=ct.value.trim(),m=ms.value.trim();
if(!c||m.length<5){st.textContent="Pon tu usuario de contacto y un mensaje (mínimo 5 letras).";return}
sd.disabled=true;st.textContent="Enviando…";
try{await post("/api/contact",{type:ty.value,contact:c,message:m});st.textContent="✔ Enviado. Te responderé por el contacto que has puesto.";ms.value=""}
catch(e){st.textContent="No se pudo enviar (demasiados mensajes seguidos o sin conexión). Inténtalo más tarde."}
finally{sd.disabled=false}};
/* ---- canjear codigo ---- */
const gb=el("button","cbtn gbtn","🎁");gb.title="Canjear código";gb.setAttribute("aria-label","Canjear código");document.body.append(gb);
const gm=el("div","modal"),gc=el("div","card");gm.hidden=true;gm.append(gc);
const gt=el("div","row"),gx=el("button","btn","Cerrar");gt.append(el("strong",null,"🎁 Canjear código"),gx);
const gi=el("input"),gu=el("input"),gs=el("button","go","Canjear"),gst=el("div","det");
gi.style.cssText=ct.style.cssText;gi.style.textTransform="uppercase";gi.placeholder="Código (GIFT-XXXX-XXXX)";gi.maxLength=20;gi.autocomplete="off";gi.autocapitalize="characters";
gu.style.cssText=ct.style.cssText;gu.placeholder="Tu usuario de Discord o TikTok (así sabré que has ganado tú)";gu.maxLength=40;gu.autocomplete="off";
try{gu.value=localStorage.getItem("kx.who")||""}catch(e){}
gs.style.marginTop="10px";
gc.append(gt,el("p","mu","Escribe el código que ha mandado el admin. Gana quien lo canjee primero."),gi,gu,gs,gst);document.body.append(gm);
gb.onclick=()=>{gm.hidden=false;gst.textContent=""};gx.onclick=()=>{gm.hidden=true};
const GE={nf:"Ese código no existe. Revisa que lo has escrito bien.",used:"Ese código ya lo ha canjeado otra persona. ¡Casi!",dup:"Ya has canjeado un código de este sorteo.",name:"Pon tu usuario de Discord o TikTok.",limit:"Demasiados intentos seguidos. Espera un minuto."};
gs.onclick=async()=>{const code=gi.value.trim(),name=gu.value.trim();if(code.length<6){gst.textContent="Escribe el código.";return}
gs.disabled=true;gst.textContent="Comprobando…";
try{const r=await fetch("/api/redeem",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:code,name:name})});let d={};try{d=await r.json()}catch(e){}
if(r.ok){try{localStorage.setItem("kx.who",name)}catch(e){}gst.textContent="🎉 ¡Código canjeado!"+(d.prize?" Premio: "+d.prize+".":"")+" Has sido el nº "+d.n+". El admin te contactará por tu usuario.";gi.value=""}
else gst.textContent=GE[d.e]||"No se pudo canjear. Inténtalo de nuevo."}
catch(e){gst.textContent="Sin conexión con el servidor."}
finally{gs.disabled=false}};
})();
