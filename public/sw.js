importScripts('serviceworker-cache-polyfill.js');
var cacheName ='v1';
var cacheAssets =
[
    '/',
    '/favicon.ico',
    '/?homescreen=1',
    '/css/bulma.css',
    '/css/index.css',
    '/js/jquery.js',
    '/js/main.js',
    '/media/404.png',
    '/media/background.jpg',
    '/media/kirtan.mp3',
    '/media/source.gif',
    '/media/logo.png',
    '/media/icons/icon-72x72.png',
    '/media/icons/icon-96x96.png',
    '/media/icons/icon-128x128.png',
    '/media/icons/icon-144x144.png',
    '/media/icons/icon-152x152.png',
    '/media/icons/icon-192x192.png',
    '/media/icons/icon-384x384.png',
    '/media/icons/icon-512x512.png',
    '/manifest.json'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches
            .open(cacheName)
            .then(function(cache) {
              cache.addAll(cacheAssets);
            }).then(()=>self.skipWaiting())
     );
});

self.addEventListener('activate', e=>{
    e.waitUntil(
        caches.keys().then(cacheNames=>{
            return Promise.all(
                cacheNames.map(cach=>{
                    if(cach !== cacheName){
                        return caches.delete(cach);
                    }
                })
            )
        })
    )
});

// self.addEventListener("push", e => {
//     const data = e.data.json();
//     self.registration.showNotification(data.title, {
//       body: "Notification from Sri Chaintanya Shiksha O Sangskriti Sangha",
//       icon: "/media/icons/icon-192x192.png"
//     });
// });
    
self.addEventListener('fetch', e=>{
    e.respondWith(fetch(e.request)
        .catch(()=>caches.match(e.request))
    );
});

