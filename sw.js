self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('my-cache').then(cache => {
            return cache.addAll([
                '/index.html',
                '/styles.css',
                '/scripts/formHandler.js',
                '/scripts/navigation.js',
                '/icons/android-chrome-192x192.png',
                '/icons/android-chrome-512x512.png'
            ]);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== 'my-cache') {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : { title: 'Notification', body: 'This is a notification!' };
    const options = {
        body: data.body,
        icon: 'icons/android-chrome-192x192.png',
        badge: 'icons/android-chrome-192x192.png'
    };
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});
