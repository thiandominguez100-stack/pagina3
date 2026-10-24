// Código compartido por index.html y buffet.html
const $=s=>document.querySelector(s), money=n=>'$'+n.toLocaleString('es-AR');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ymd=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const cap=s=>s[0].toUpperCase()+s.slice(1);
const fLarga=s=>{const [y,m,d]=s.split('-');return cap(new Date(y,m-1,d).toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long'}))};
const item=id=>MENU.find(x=>x.id===id), turno=id=>TURNOS.find(x=>x.id===id);
const mins=h=>{const [a,b]=h.split(':');return +a*60+ +b}, ahora=()=>{const n=new Date();return n.getHours()*60+n.getMinutes()};
function dias(){const r=[];for(let i=0;r.length<2&&i<10;i++){const x=new Date();x.setDate(x.getDate()+i);if(x.getDay()%6)r.push({f:ymd(x),l:i===0?'Hoy':i===1?'Mañana':cap(x.toLocaleDateString('es-AR',{weekday:'long'}))})}return r}
/* estado de un turno para una fecha: abierto | cerrado (ya no se aceptan cambios) | pasado */
function estTurno(t,f){let r='abierto';if(f===ymd(new Date())){const n=ahora();r=n>=mins(t.h)?'pasado':n>=mins(t.d)-CIERRE_MIN?'cerrado':'abierto'}return r==='abierto'&&cerrado(f,t.id)?'buffet':r}
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.append(t);setTimeout(()=>t.remove(),2600)}
function ask(t,p,ok){$('#dT').textContent=t;$('#dP').textContent=p;$('#dY').onclick=()=>{$('#dlg').close();ok()};$('#dlg').showModal()}
$('#dN').onclick=()=>$('#dlg').close();
const misCodigos=()=>{try{return JSON.parse(localStorage.getItem(MY))||[]}catch(e){return[]}};
const addCodigo=c=>{const a=misCodigos();if(!a.includes(c)){a.push(c);try{localStorage.setItem(MY,JSON.stringify(a))}catch(e){}}};

/* ============ DATOS (nube con Firebase o local) ============ */
const DB={orders:[],cierres:[],raw:[],cbs:[],mode:'local',
  emit(){this.orders=this.raw.filter(o=>o.tipo!=='cierre');this.cierres=this.raw.filter(o=>o.tipo==='cierre');this.cbs.forEach(f=>f())},
  async init(){
    if(FIREBASE){try{
      const A=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
      const F=await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      this.F=F;this.app=A.initializeApp(FIREBASE);this.db=F.getFirestore(this.app);this.mode='cloud';
      F.onSnapshot(F.query(F.collection(this.db,'pedidos'),F.where('fecha','>=',ymd(new Date(Date.now()-864e5)))),
        s=>{this.raw=s.docs.map(d=>d.data());this.emit()},()=>toast('Sin conexión con el buffet'));
      return;
    }catch(e){console.error(e);toast('No se pudo conectar. Usando modo demo.')}}
    $('#demo').hidden=false;
    const rd=()=>{try{this.raw=JSON.parse(localStorage.getItem(KEY))||[]}catch(e){this.raw=[]}this.emit()};
    addEventListener('storage',rd);rd();
  },
  async put(o){
    if(this.mode==='cloud'){await this.F.setDoc(this.F.doc(this.db,'pedidos',o.codigo),o);return}
    const a=this.raw.filter(x=>x.codigo!==o.codigo);a.push(o);this.raw=a;
    try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}this.emit();
  }};
/* cierres del buffet: {tipo:'cierre', fecha, turno, cerrado} se guardan junto a los pedidos */
const cerrado=(f,t)=>DB.cierres.some(c=>c.fecha===f&&c.turno===t&&c.cerrado);
async function setCierre(f,t,v){await DB.put({codigo:'cierre_'+f+'_'+t,tipo:'cierre',fecha:f,turno:t,cerrado:v,creado:Date.now()})}
const vivos=(f,t)=>DB.orders.filter(o=>o.fecha===f&&o.estado!=='cancelado'&&(!t||o.turno===t));
const usado=(f,id)=>vivos(f).reduce((s,o)=>s+(o.items.find(i=>i.id===id)?.q||0),0);
const quedan=(f,id)=>Math.max(0,item(id).s-usado(f,id));
const nuevoCodigo=()=>{const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s;do{s='';for(let i=0;i<5;i++)s+=c[Math.floor(Math.random()*c.length)]}while(DB.orders.some(o=>o.codigo===s));return s};
