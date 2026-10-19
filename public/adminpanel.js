(()=>{"use strict";
const $=id=>document.getElementById(id);
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
let key="",timer=null,timer2=null;try{key=sessionStorage.getItem("kx.ak")||""}catch(e){}
const post=async(u,b)=>{const r=await fetch(u,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.assign({key:key},b||{}))});if(!r.ok)throw new Error(r.status);return r.json()};
const anchor=$("adminslot");if(!anchor)return;
const box=el("div","card");box.id="adminpanel";box.hidden=true;anchor.appendChild(box);
function lock(msg){clearInterval(timer);clearInterval(timer2);box.replaceChildren();
const h=el("div","row");h.append(el("strong",null,"👑 Panel de admin"));
const p=el("p","mu","Escribe tu clave de administrador para abrir el panel (solo se recuerda mientras tengas esta pestaña abierta).");
const row=el("div","vrow"),inp=el("input"),go=el("button","go","Abrir"),m=el("div","det",msg||"");
inp.type="password";inp.placeholder="Clave de admin";inp.autocomplete="off";inp.style.textTransform="none";
go.onclick=async()=>{key=inp.value;try{await post("/api/admin/messages");try{sessionStorage.setItem("kx.ak",key)}catch(e){}open()}catch(e){key="";m.textContent="Clave incorrecta."}};
inp.onkeydown=e=>{if(e.key==="Enter")go.click()};
row.append(inp,go);box.append(h,p,row,m)}
function open(){box.replaceChildren();
const h=el("div","row"),out=el("button","btn","Cerrar panel");
out.onclick=()=>{key="";try{sessionStorage.removeItem("kx.ak")}catch(e){}lock()};
h.append(el("strong",null,"👑 Panel de admin"),out);
const a1=el("div","apn"),ai=el("input"),ab=el("button","btn","Enviar a todos"),ac=el("button","btn","Quitar mensaje"),am=el("div","det"),bs=el("div","vact");
ai.maxLength=300;ai.placeholder="Mensaje que verán todos encima de los dados…";ai.autocomplete="off";
ab.onclick=async()=>{const t=ai.value.trim();if(!t)return;try{await post("/api/admin/announce",{text:t});ai.value="";am.textContent="Enviado ✔"}catch(e){am.textContent="No se pudo enviar."}};
ac.onclick=async()=>{try{await post("/api/admin/newsclear");am.textContent="Mensaje quitado."}catch(e){am.textContent="No se pudo quitar."}};
bs.append(ab,ac);a1.append(el("strong",null,"📢 Mensaje a todos"),ai,bs,am);
const a2=el("div","apn"),sl=el("div");
a2.append(el("strong",null,"🎥 Estado de los streamers"),el("p","mu","Auto = se detecta solo. Si no se detecta bien, fuérzalo aquí."),sl);
const a3=el("div","apn"),mh=el("div","row"),mc=el("span","lb"),ml=el("ol");ml.id="ml";
mh.append(el("strong",null,"📬 Mensajes recibidos"),mc);a3.append(mh,ml);
const a4=el("div","apn"),gn=el("input"),gp=el("input"),gg=el("button","btn","Generar códigos"),gmsg=el("div","det"),gl=el("div");
gn.type="number";gn.min=1;gn.max=50;gn.value=5;gn.placeholder="Cuántos códigos (1-50)";gp.maxLength=60;gp.placeholder="Premio (opcional)";gp.autocomplete="off";
a4.append(el("strong",null,"🎁 Sorteo de códigos"),el("p","mu","Genera códigos, mándalos por el mensaje de admin y gana quien canjee cada uno primero. Aquí ves quién ha ganado."),gn,gp,gg,gmsg,gl);
box.append(h,a1,a4,a2,a3);
const gf=c=>"GIFT-"+c.slice(0,4)+"-"+c.slice(4,8);
const copy=async t=>{try{await navigator.clipboard.writeText(t);gmsg.textContent="Copiado ✔"}catch(e){gmsg.textContent="No se pudo copiar."}};
const send=async t=>{try{await post("/api/admin/announce",{text:t.slice(0,300)});gmsg.textContent="Enviado al chat ✔"}catch(e){gmsg.textContent="No se pudo enviar."}};
const hhmm=ts=>new Date(ts).toLocaleTimeString("es")+"."+String(ts%1000).padStart(3,"0");
async function loadCodes(){const d=await post("/api/admin/codes"),by={};gl.replaceChildren();
d.codes.forEach(c=>{(by[c.batch]=by[c.batch]||[]).push(c)});
const bs=Object.keys(by).sort((x,y)=>by[y][0].ts-by[x][0].ts);
if(!bs.length){gl.append(el("p","mu","Aún no has generado ningún sorteo."));return}
bs.forEach(id=>{const L=by[id],pz=L[0].prize,won=L.filter(c=>c.won).sort((a,b)=>a.won.n-b.won.n),box2=el("div","gb"),hh=el("div","row");
hh.append(el("strong",null,"🎁 "+(pz||"Sorteo")+" · "+new Date(L[0].ts).toLocaleString("es")),el("span","lb",won.length+"/"+L.length+" canjeados"));
const bt=el("div","vact"),ca=el("button","btn","Copiar todos"),aw=el("button","btn","📢 Anunciar ganadores"),dl=el("button","btn","Borrar sorteo");bt.style.justifyContent="flex-start";
ca.onclick=()=>copy(L.map(c=>gf(c.code)).join("\n"));
aw.onclick=()=>{if(!won.length){gmsg.textContent="Todavía no ha ganado nadie.";return}send("🎉 Ganadores"+(pz?" de "+pz:"")+": "+won.map(c=>c.won.n+") "+c.won.name).join(" · "))};
dl.onclick=async()=>{if(!confirm("¿Borrar este sorteo y sus códigos?"))return;try{await post("/api/admin/codedel",{batch:id});loadCodes()}catch(e){}};
bt.append(ca,aw,dl);box2.append(hh,bt);
L.forEach(c=>{const r=el("div","grow");r.append(el("span","gcode",gf(c.code)));
if(c.won)r.append(el("span","gwin","✅ #"+c.won.n+" "+c.won.name+" · "+hhmm(c.won.ts)+" · 🌐"+c.won.ip));else r.append(el("span","gfree","Libre"));
const cp=el("button","btn","Copiar"),sd=el("button","btn","📢 Enviar al chat");cp.onclick=()=>copy(gf(c.code));
sd.onclick=()=>send("🎁 "+(pz?pz+": ":"")+gf(c.code)+" · ¡el primero en canjearlo con el botón 🎁 gana!");sd.hidden=!!c.won;r.append(cp,sd);box2.append(r)});
gl.append(box2)})}
gg.onclick=async()=>{const n=parseInt(gn.value,10);if(!(n>=1&&n<=50)){gmsg.textContent="Pon un número del 1 al 50.";return}
try{await post("/api/admin/gen",{count:n,prize:gp.value});gmsg.textContent="Generados "+n+" códigos ✔";gp.value="";loadCodes()}catch(e){gmsg.textContent="No se pudieron generar."}};
const TL={tecnico:"🛠 Técnico",fraude:"🚨 Fraude",vip:"👑 Solicitar VIP"};
async function loadSt(){const d=await post("/api/admin/list");sl.replaceChildren();
d.vips.forEach(v=>{const r=el("div","srow"),im=el("img","av"),nm=el("span","snm");im.src=v.av;im.alt="";nm.append(el("b",null,String(v.name)));
r.append(im,nm);[["auto","Auto"],["on","🔴 En vivo"],["off","⚫ Off"]].forEach(([k,l])=>{const b=el("button","btn"+(v.force===k?" on":""),l);
b.onclick=async()=>{try{await post("/api/admin/streamforce",{code:v.code,mode:k});loadSt().catch(()=>{})}catch(e){}};r.append(b)});sl.append(r)})}
async function loadMsgs(){const d=await post("/api/admin/messages");ml.replaceChildren();
const un=d.messages.filter(m=>!m.read).length;mc.textContent=un?un+" sin leer":"";
if(!d.messages.length){const li=el("li","none","No hay mensajes.");ml.append(li);return}
d.messages.forEach(m=>{const li=el("li",m.read?"":"mnew"),hd=el("div"),tg=el("span","mtag "+m.type,TL[m.type]||m.type),w=el("b",null,m.contact),tm=el("span","ts"," · "+new Date(m.ts).toLocaleString("es")),tx=el("div","mtxt",m.message),bt=el("div","vact");
const rd=el("button","btn","Marcar leído"),dl=el("button","btn","Borrar");rd.hidden=!!m.read;bt.style.cssText="justify-content:flex-start;margin-top:0";
rd.onclick=async()=>{try{await post("/api/admin/msgread",{id:m.id});loadMsgs()}catch(e){}};
dl.onclick=async()=>{try{await post("/api/admin/msgdel",{id:m.id});loadMsgs()}catch(e){}};
hd.append(tg,w,tm);bt.append(rd,dl);li.append(hd,tx,bt);ml.append(li)})}
const bad=()=>{key="";try{sessionStorage.removeItem("kx.ak")}catch(e){}lock("Clave incorrecta o caducada.")};
loadSt().then(loadMsgs).then(loadCodes).catch(bad);
clearInterval(timer2);timer2=setInterval(()=>{loadCodes().catch(()=>{})},5000);
clearInterval(timer);timer=setInterval(()=>{loadSt().then(loadMsgs).catch(()=>{})},30000)}
window.KXAdmin={show(v){const on=!!(v&&v.admin);box.hidden=!on;if(!on){clearInterval(timer);clearInterval(timer2);return}if(key)open();else lock()}};
})();
