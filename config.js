// CONFIGURACIÓN COMPARTIDA: editá acá y se aplica a index.html y buffet.html
const FIREBASE = {
  apiKey: "AIzaSyDaJT2oM4y2YaPM5i5XlZ6MWRWKNJI6-nI",
  authDomain: "buffet-4p.firebaseapp.com",
  projectId: "buffet-4p",
  storageBucket: "buffet-4p.firebasestorage.app",
  messagingSenderId: "925951291927",
  appId: "1:925951291927:web:a13f6762d25a0713c56252"
};
const VAPID_KEY = '';         // Clave web push de Firebase (Configuración → Cloud Messaging → Certificados push web)
const PIN_BUFFET = '4321';   // PIN del buffet (cambialo)
const CIERRE_MIN = 10;       // minutos antes del turno en que se cierran pedidos/cancelaciones
const REAVISO_MIN = 20;      // el panel avisa con estos minutos de anticipación antes de cada turno
const MAX_ITEMS = 8;         // máximo de productos por pedido
const TURNOS = [
  {id:'t1',n:'1° turno · Primer recreo',d:'08:50',h:'09:00'},
  {id:'t2',n:'2° turno · Última oportunidad',d:'10:20',h:'10:30'}];
const MENU = [
  {id:'biz',c:'Bizcochos',e:'🥖',n:'Bizcocho',d:'Salado, de grasa',p:500,s:30},
  {id:'med',c:'Facturas',e:'🥐',n:'Medialuna',d:'De manteca',p:600,s:30},
  {id:'vig',c:'Facturas',e:'🥧',n:'Vigilante',d:'Con dulce de membrillo',p:700,s:20},
  {id:'cre',c:'Facturas',e:'🍩',n:'Cremona',d:'Rellena de dulce de leche',p:800,s:15}];
const CATS = ['Bizcochos','Facturas'];
const KEY='b4p_pedidos_v2', MY='b4p_codes_v2';
