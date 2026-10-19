"use strict";
const http=require("http"),fs=require("fs"),path=require("path"),crypto=require("crypto");
const PORT=process.env.PORT||3000,DIR=path.join(__dirname,"public");
const DB=path.join(process.env.DATA_DIR||__dirname,"data.json");
const ALPH="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",TYPES=["color","4","6","8","10","12","20"];
const DATA=process.env.DATA_DIR||__dirname,VDIR=path.join(DATA,"vip"),VDB=path.join(DATA,"vips.json"),ADMIN=process.env.ADMIN_KEY||"1234";
fs.mkdirSync(VDIR,{recursive:true});
const MSGF=path.join(DATA,"messages.json"),NEWF=path.join(DATA,"news.json");
let M=[],N=[];try{M=JSON.parse(fs.readFileSync(MSGF,"utf8"))}catch(e){}try{N=JSON.parse(fs.readFileSync(NEWF,"utf8"))}catch(e){}
const saveM=()=>fs.writeFile(MSGF,JSON.stringify(M),()=>{}),saveN=()=>fs.writeFile(NEWF,JSON.stringify(N),()=>{});
const feed=new Set();
const sendFeed=(ev,d)=>{for(const r of feed)r.write("event: "+ev+"\ndata: "+JSON.stringify(d)+"\n\n")};
const clean=(x,n)=>String(x||"").replace(/[\u0000-\u001f\u007f<>]/g," ").trim().slice(0,n);
const CF=path.join(DATA,"codes.json");let C=[];try{C=JSON.parse(fs.readFileSync(CF,"utf8"))}catch(e){}
const saveC=()=>fs.writeFile(CF,JSON.stringify(C),()=>{});
const ipH=ip=>crypto.createHash("sha256").update(String(ip)+KEY).digest("hex").slice(0,6);
const normGift=x=>{let r=String(x||"").toUpperCase().replace(/[^A-Z0-9]/g,"");if(r.startsWith("GIFT")&&r.length===12)r=r.slice(4);return r};
const KEYF=path.join(DATA,"secret.key");let KEY=process.env.SIGN_SECRET||"";
if(!KEY){try{KEY=fs.readFileSync(KEYF,"utf8").trim()}catch(e){}}
if(!KEY){KEY=crypto.randomBytes(32).toString("hex");try{fs.writeFileSync(KEYF,KEY)}catch(e){}}
let V={};try{V=JSON.parse(fs.readFileSync(VDB,"utf8"))}catch(e){}
const saveV=()=>fs.writeFileSync(VDB,JSON.stringify(V));
const SEED=[{code:"KK9X4M7R",name:"Kikoxx",f:"kikoxx",admin:true,tiktok:"user1.11123",theme:{ac:"#7c4dff",acd:"#3b1fa8",bd:"#3b4aa0",bg:"#10153a",card:"rgba(14,18,48,.86)",pg:"#0b1030"}},{code:"RJ7K4MXP",name:"Rojito Juega",f:"rojitojuega",tiktok:"roojitojuega",theme:{ac:"#e11d2e",acd:"#7a0a14",bd:"#7a1a24",bg:"#1a0a0e",card:"rgba(24,8,12,.86)",pg:"#120508"}},{code:"KV5N8H2W",name:"kevinsitoo_oficial",f:"kevinsitoo",tiktok:"kevinsitoo_oficial",theme:{ac:"#6bd13a",acd:"#2f6b14",bd:"#2b5a8a",bg:"#0a1624",card:"rgba(8,18,32,.86)",pg:"#07121f"}}];
for(const x of SEED){const id=crypto.createHash("sha1").update(x.f).digest("hex").slice(0,8);
if(!V[x.code]){try{for(const k of["av","bg"])fs.copyFileSync(path.join(__dirname,"seed",x.f+"-"+k+".jpg"),path.join(VDIR,id+"-"+k+".jpg"));V[x.code]={id,name:x.name,t:Date.now()}}catch(e){continue}}
V[x.code].name=x.name;if(x.admin)V[x.code].admin=true;if(x.tiktok)V[x.code].tiktok=x.tiktok;if(x.theme)V[x.code].theme=x.theme;saveV()}
const COLRE=/^(#[0-9a-fA-F]{6}|rgba?\([0-9., ]{5,30}\))$/;
function okTheme(t){if(!t||typeof t!=="object")return null;const o={};for(const k of["ac","acd","bd","bg","card","pg"]){if(typeof t[k]!=="string"||!COLRE.test(t[k]))return null;o[k]=t[k]}return o}
const vinfo=c=>{const v=V[c];return v?{id:v.id,name:v.name,av:"/vipimg/"+v.id+"-av.jpg",bg:"/vipimg/"+v.id+"-bg.jpg",theme:v.theme||null}:null};
const normVip=x=>{let r=String(x||"").toUpperCase().replace(/[^A-Z0-9]/g,"");if(r.startsWith("VIP")&&r.length===11)r=r.slice(3);return r};
function adminOk(k){if(ADMIN.length<4||typeof k!=="string")return false;const a=Buffer.from(k),b=Buffer.from(ADMIN);return a.length===b.length&&crypto.timingSafeEqual(a,b)}
let S={};try{S=JSON.parse(fs.readFileSync(DB,"utf8"))}catch(e){}
let dirty=false;const live=new Map(),hits=new Map();
const MIME={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".jpg":"image/jpeg",".png":"image/png",".mp3":"audio/mpeg",".ogg":"audio/ogg",".txt":"text/plain; charset=utf-8",".ico":"image/x-icon"};
const IDALPH="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
const newId=()=>{let s="";for(let i=0;i<10;i++)s+=IDALPH[crypto.randomInt(IDALPH.length)];return s};
const sign=id=>{const h=crypto.createHmac("sha256",KEY).update(id).digest();let s="";for(let i=0;i<8;i++)s+=ALPH[h[i]%32];return s};
const newCode=()=>{let s="";for(const x of crypto.randomBytes(12))s+=ALPH[x%32];return s};
const json=(res,c,o)=>{res.writeHead(c,{"Content-Type":"application/json","Cache-Control":"no-store"});res.end(JSON.stringify(o))};
const pub=(s,id)=>({rolls:s.rolls,score:s.score,hist:s.hist,vip:s.vip?vinfo(s.vip):null,sig:sign(id)});
const emit=(c,ev,d)=>{for(const r of live.get(c)||[])r.write("event: "+ev+"\ndata: "+JSON.stringify(d)+"\n\n")};
function limit(key,max,ms){const n=Date.now(),a=(hits.get(key)||[]).filter(t=>n-t<ms);a.push(n);hits.set(key,a);return a.length<=max}
function readBody(req,max){max=max||2000;return new Promise(r=>{let d="";req.on("data",c=>{d+=c;if(d.length>max)req.destroy()});req.on("end",()=>{try{r(JSON.parse(d||"{}"))}catch(e){r({})}});req.on("error",()=>r({}))})}
function auth(s,tok){if(!s||typeof tok!=="string")return false;const a=Buffer.from(tok),b=Buffer.from(s.tok);return a.length===b.length&&crypto.timingSafeEqual(a,b)}
const TT={},UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
async function ttCheck(h){const hd={"User-Agent":UA,"Accept-Language":"en-US,en;q=0.9"};
try{const r=await fetch("https://www.tiktok.com/api-live/user/room/?aid=1988&uniqueId="+encodeURIComponent(h)+"&sourceType=54",{headers:hd,signal:AbortSignal.timeout(8000)});
if(r.ok){const d=await r.json();const u=d&&d.data&&d.data.user;if(u&&typeof u.status==="number")return u.status===2}}catch(e){}
try{const r=await fetch("https://www.tiktok.com/@"+h+"/live",{headers:hd,signal:AbortSignal.timeout(8000)});
if(!r.ok)return null;const t=await r.text();const m=t.match(/"liveRoom"\s*:\s*\{[\s\S]{0,8000}?"status"\s*:\s*(\d+)/);
if(m)return m[1]==="2";return null}catch(e){return null}}
async function ttPoll(){for(const c in V){const h=V[c].tiktok;if(!h)continue;const r=await ttCheck(h);if(r!==null)TT[h]=r}}
function streamers(){const n=Date.now(),lv={};for(const c in S){const x=S[c];if(x.vip&&n-(x.seen||0)<45000)lv[x.vip]=1}
return Object.keys(V).map(c=>{const v=V[c];let live=!!lv[c]||(!!v.tiktok&&TT[v.tiktok]===true);if(v.force==="on")live=true;else if(v.force==="off")live=false;
return{name:v.name,av:"/vipimg/"+v.id+"-av.jpg",live,tiktok:v.tiktok||null}})}
let lastSt="";function pushStreamers(){const j=JSON.stringify(streamers());if(j!==lastSt){lastSt=j;sendFeed("streamers",JSON.parse(j))}}
const isCode=c=>typeof c==="string"&&/^[A-Za-z2-9]{10}$/.test(c)&&[...c].every(x=>IDALPH.includes(x));
http.createServer(async(req,res)=>{
const u=new URL(req.url,"http://x"),p=u.pathname,ip=(req.headers["x-forwarded-for"]||"").split(",")[0].trim()||req.socket.remoteAddress;
try{
if(req.method==="POST"&&p==="/api/session"){
if(!limit("s"+ip,30,6e4))return json(res,429,{e:"limit"});
if(Object.keys(S).length>=MAX_SESSIONS)return json(res,503,{e:"full"});
const sb=await readBody(req),vc=normVip(sb.vip);
const c=newId(),tok=crypto.randomBytes(16).toString("hex");
S[c]={vip:V[vc]?vc:null,tok,rolls:0,score:0,hist:[],t:Date.now(),last:0,seen:Date.now(),upd:Date.now()};dirty=true;return json(res,200,{code:c,token:tok,sig:sign(c)})}
if(req.method==="POST"&&p==="/api/vip/enter"){
if(!limit("v"+ip,20,6e4))return json(res,429,{e:"limit"});
const b=await readBody(req),c=normVip(b.code),i=vinfo(c);return i?json(res,200,Object.assign(i,{admin:!!V[c].admin})):json(res,404,{e:"nf"})}
if(req.method==="POST"&&p.startsWith("/api/admin/")){
if(!limit("a"+ip,30,6e4))return json(res,429,{e:"limit"});
const b=await readBody(req,700000);if(!adminOk(b.key))return json(res,403,{e:"auth"});
if(p==="/api/admin/list")return json(res,200,{vips:Object.keys(V).map(c=>Object.assign({code:c,tiktok:V[c].tiktok||null,force:V[c].force||"auto"},vinfo(c)))});
if(p==="/api/admin/messages")return json(res,200,{messages:M});
if(p==="/api/admin/msgread"){const m=M.find(x=>x.id===b.id);if(m){m.read=true;saveM()}return json(res,200,{ok:1})}
if(p==="/api/admin/msgdel"){M=M.filter(x=>x.id!==b.id);saveM();return json(res,200,{ok:1})}
if(p==="/api/admin/announce"){const t=clean(b.text,300);if(!t)return json(res,400,{e:"bad"});
const a={id:crypto.randomBytes(4).toString("hex"),text:t,ts:Date.now()};N.unshift(a);N=N.slice(0,20);saveN();sendFeed("news",a);return json(res,200,a)}
if(p==="/api/admin/newsclear"){N=[];saveN();sendFeed("news",null);return json(res,200,{ok:1})}
if(p==="/api/admin/gen"){const n=Number(b.count),prize=clean(b.prize,60);
if(!Number.isInteger(n)||n<1||n>50)return json(res,400,{e:"bad"});
const batch=crypto.randomBytes(4).toString("hex"),ts=Date.now(),out=[];
for(let i=0;i<n;i++){let c;do{c=newCode().slice(0,8)}while(C.some(x=>x.code===c));C.push({code:c,batch,prize,ts,won:null});out.push(c)}
saveC();return json(res,200,{batch,codes:out})}
if(p==="/api/admin/codes")return json(res,200,{codes:C});
if(p==="/api/admin/codedel"){C=C.filter(x=>x.batch!==b.batch);saveC();return json(res,200,{ok:1})}
if(p==="/api/admin/create"){
const name=String(b.name||"").replace(/[\u0000-\u001f<>]/g,"").trim().slice(0,24);
const av=Buffer.from(String(b.av||""),"base64"),bg=Buffer.from(String(b.bg||""),"base64");
const jpg=x=>x.length>100&&x.length<=450000&&x[0]===0xFF&&x[1]===0xD8&&x[2]===0xFF;
if(!name||!jpg(av)||!jpg(bg))return json(res,400,{e:"bad"});
let c;do{c=newCode().slice(0,8)}while(V[c]);const id=crypto.randomBytes(4).toString("hex");
fs.writeFileSync(path.join(VDIR,id+"-av.jpg"),av);fs.writeFileSync(path.join(VDIR,id+"-bg.jpg"),bg);
const tt=String(b.tiktok||"").replace(/^.*@/,"").replace(/[^A-Za-z0-9._]/g,"").slice(0,24);
V[c]={id,name,t:Date.now()};if(tt.length>=2)V[c].tiktok=tt;const th=okTheme(b.theme);if(th)V[c].theme=th;saveV();pushStreamers();return json(res,200,Object.assign({code:c},vinfo(c)))}
if(p==="/api/admin/streamforce"){const v=V[normVip(b.code)];if(!v||!["on","off","auto"].includes(b.mode))return json(res,400,{e:"bad"});
if(b.mode==="auto")delete v.force;else v.force=b.mode;saveV();pushStreamers();return json(res,200,{ok:1})}
if(p==="/api/admin/delete"){const c=normVip(b.code),v=V[c];if(!v)return json(res,404,{e:"nf"});
for(const k of["av","bg"])fs.unlink(path.join(VDIR,v.id+"-"+k+".jpg"),()=>{});delete V[c];saveV();return json(res,200,{ok:1})}
return json(res,404,{e:"nf"})}
if(req.method==="POST"&&p==="/api/contact"){
if(!limit("c"+ip,5,36e5))return json(res,429,{e:"limit"});
const b=await readBody(req,4000),type=["tecnico","fraude","vip"].includes(b.type)?b.type:null,contact=clean(b.contact,60),message=clean(b.message,1000);
if(!type||!contact||message.length<5)return json(res,400,{e:"bad"});
M.unshift({id:crypto.randomBytes(4).toString("hex"),type,contact,message,ts:Date.now(),read:false});M=M.slice(0,500);saveM();return json(res,200,{ok:1})}
if(req.method==="POST"&&p==="/api/redeem"){
if(!limit("r"+ip,12,6e4))return json(res,429,{e:"limit"});
const b=await readBody(req,1000),code=normGift(b.code),name=clean(b.name,40);
if(name.length<2)return json(res,400,{e:"name"});
const g=C.find(x=>x.code===code);if(!g)return json(res,404,{e:"nf"});
if(g.won)return json(res,409,{e:"used"});
const ln=name.toLowerCase();
if(C.some(x=>x.batch===g.batch&&x.won&&x.won.name.toLowerCase()===ln))return json(res,409,{e:"dup"});
const n=C.filter(x=>x.batch===g.batch&&x.won).length+1;
g.won={name,ts:Date.now(),ip:ipH(ip),n};saveC();return json(res,200,{ok:1,prize:g.prize,n})}
if(req.method==="POST"&&p==="/api/ping"){
if(!limit("p"+ip,40,6e4))return json(res,429,{e:"limit"});
const b=await readBody(req),s=isCode(b.code)?S[b.code]:null;
if(!auth(s,b.token))return json(res,403,{e:"auth"});s.seen=Date.now();return json(res,200,{ok:1})}
if(req.method==="POST"&&p==="/api/roll"){
const b=await readBody(req),s=isCode(b.code)?S[b.code]:null;
if(!auth(s,b.token))return json(res,403,{e:"auth"});
const t=String(b.type),n=b.n;
if(!TYPES.includes(t)||!Number.isInteger(n)||n<1||n>100)return json(res,400,{e:"bad"});
if(Date.now()-s.last<500)return json(res,429,{e:"fast"});
s.last=Date.now();s.seen=Date.now();const m=t==="color"?6:+t;
const v=Array.from({length:n},()=>crypto.randomInt(1,m+1));
const entry={t,v,ts:Date.now()};s.hist.unshift(entry);s.hist=s.hist.slice(0,200);s.rolls++;s.upd=Date.now();dirty=true;
emit(b.code,"roll",{entry,rolls:s.rolls,score:s.score});return json(res,200,{entry,rolls:s.rolls})}
if(req.method==="POST"&&p==="/api/score"){
const b=await readBody(req),s=isCode(b.code)?S[b.code]:null;
if(!auth(s,b.token))return json(res,403,{e:"auth"});
if(!Number.isInteger(b.delta)||Math.abs(b.delta)>100)return json(res,400,{e:"bad"});
s.score=Math.max(-1e9,Math.min(1e9,s.score+b.delta));s.upd=Date.now();dirty=true;
emit(b.code,"score",{score:s.score});return json(res,200,{score:s.score})}
if(req.method==="GET"&&p.startsWith("/api/session/")){
const c=p.slice(13),s=isCode(c)?S[c]:null;
return s?json(res,200,pub(s,c)):json(res,404,{e:"nf"})}
if(req.method==="GET"&&p.startsWith("/api/live/")){
const c=p.slice(10),s=isCode(c)?S[c]:null;
if(!s)return json(res,404,{e:"nf"});
res.writeHead(200,{"Content-Type":"text/event-stream","Cache-Control":"no-cache",Connection:"keep-alive","X-Accel-Buffering":"no"});
res.write("event: snap\ndata: "+JSON.stringify(pub(s,c))+"\n\n");
let set=live.get(c);if(!set)live.set(c,set=new Set());set.add(res);
req.on("close",()=>{set.delete(res);if(!set.size)live.delete(c)});return}
if(req.method==="GET"&&p==="/api/streamers")return json(res,200,streamers());
if(req.method==="GET"&&p==="/api/feed"){
res.writeHead(200,{"Content-Type":"text/event-stream","Cache-Control":"no-cache",Connection:"keep-alive","X-Accel-Buffering":"no"});
res.write("event: news\ndata: "+JSON.stringify(N[0]||null)+"\n\n");res.write("event: streamers\ndata: "+JSON.stringify(streamers())+"\n\n");
feed.add(res);req.on("close",()=>feed.delete(res));return}
if(req.method==="GET"&&p.startsWith("/vipimg/")){
const f=p.slice(8);if(!/^[a-f0-9]{8}-(av|bg)\.jpg$/.test(f)||!fs.existsSync(path.join(VDIR,f))){res.writeHead(404);return res.end()}
res.writeHead(200,{"Content-Type":"image/jpeg","Cache-Control":"public, max-age=3600"});return fs.createReadStream(path.join(VDIR,f)).pipe(res)}
if(req.method==="GET"){
let f=p==="/"?"/index.html":p==="/ver"?"/ver.html":p==="/admin"?"/admin.html":p;
const file=path.normalize(path.join(DIR,f));
if(!file.startsWith(DIR+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end("No encontrado")}
res.writeHead(200,{"Content-Type":MIME[path.extname(file)]||"application/octet-stream","X-Content-Type-Options":"nosniff"});
return fs.createReadStream(file).pipe(res)}
res.writeHead(405);res.end()
}catch(e){try{json(res,500,{e:"err"})}catch(x){}}
}).listen(PORT,()=>console.log("Servidor listo en http://localhost:"+PORT));
setInterval(()=>{for(const r of live.values())for(const x of r)x.write(":\n\n")},25000);
setInterval(()=>{const n=Date.now();for(const c in S)if(n-S[c].upd>7*DAY){delete S[c];dirty=true}
if(dirty){dirty=false;fs.writeFile(DB,JSON.stringify(S),()=>{})}},5000);
setInterval(pushStreamers,10000);setInterval(()=>{ttPoll().then(pushStreamers)},20000);setTimeout(()=>{ttPoll().then(pushStreamers)},4000);
setInterval(()=>{for(const x of feed)x.write(":\n\n")},25000);
