// Change the version when releasing new app files.
const CACHE = 'todavia-offline-v1';
const BASE = new URL('./', self.location.href);
const ASSETS = ['index.html','manifest.webmanifest','favicon.svg','icon-180.png','icon-192.png','icon-512.png'].map(p=>new URL(p,BASE).href);
self.addEventListener('install', event => event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 await cache.addAll(ASSETS);
 await self.skipWaiting();
})()));
self.addEventListener('activate', event => event.waitUntil((async()=>{
 for(const name of await caches.keys()) if(name.startsWith('todavia-offline-')&&name!==CACHE) await caches.delete(name);
 await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname))return;
 event.respondWith((async()=>{
 const cache=await caches.open(CACHE);
 // Serve a complete, matching app release from its local cache.
 if(req.mode==='navigate')return (await cache.match(new URL('index.html',BASE).href)) || fetch(req);
 return (await cache.match(req)) || fetch(req);
 })());
});
