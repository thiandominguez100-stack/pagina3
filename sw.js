// Service worker mínimo: permite instalar la app y abrirla aunque la red falle.
const C='buffet4p-v5',F=['./','index.html','config.js','shared.js','buffet.html','manifest.json','manifest-buffet.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));
});
self.addEventListener('push',e=>{
  let p={};try{p=e.data.json()}catch(_){}
  const d=p.data||p.notification||{};
  e.waitUntil(self.registration.showNotification(d.title||'Buffet 4P',{body:d.body||'',tag:d.tag,renotify:!!d.tag,icon:'icon-192.png',badge:'icon-192.png',vibrate:[200,100,200],data:{url:d.url}}));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=(e.notification.data&&e.notification.data.url)||'buffet.html';
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{const w=l.find(c=>c.url.includes('buffet'))||l[0];return w?w.focus():clients.openWindow(url)}));
});
