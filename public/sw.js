const staticCacheName = 'site-static-v2';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
    '/',
    '/index.html',
    '/js/main.js',
    '/js/index.js',
    '/css/style.css',
    '/img/image.png',
    '/fallback.html',
    '/manifest.json'
];

// Cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size))
            }
        })
    })
}

// Install Service Worker
self.addEventListener('install', event => {
    // console.log('Service worker has been installed');
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            cache.addAll(assets);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            )
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cacheRes => {
            return cacheRes || fetch(event.request).then(fetchReq => {
                return caches.open(dynamicCacheName).then(cache => {
                    cache.put(event.request.url, fetchReq.clone());
                    // Check the size of the cache before adding new cache
                    limitCacheSize(dynamicCacheName, 15)
                    return fetchReq;
                })           });
        }).catch(() => {
            if(event.request.url.indexOf('.html') > -1) {
            return caches.match('/fallback.html') // Change this to fallback page later
        }
        
        })
    );
})
