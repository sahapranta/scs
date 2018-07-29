importScripts('serviceworker-cache-polyfill.js');

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('v1').then(function(cache) {
          return cache.addAll([
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
          ]);
        })
     );
    });
    
    self.addEventListener('fetch', function(event) {
         event.respondWith(
            caches.match(event.request).then(function(response) {
                return response || fetch(event.request);
            })
        );
    });