const CACHE='tamrin-yar-v24';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))))});
self.addEventListener('push',e=>{let p={};try{p=e.data?.json()||{}}catch{p={body:e.data?.text()||''}};e.waitUntil(self.registration.showNotification(p.title||'تمرین‌یار',{body:p.body||'یک یادآوری تازه دارید.',icon:'./icon.svg',badge:'./icon.svg',tag:`tamrin-yar-${p.type||'reminder'}`,data:{url:p.url||'./'},dir:'rtl',lang:'fa'}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=e.notification.data?.url||'./';e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{const app=list.find(c=>c.url.includes('/tamrin-yar/'));if(app)return app.focus();return clients.openWindow(url)}))});
