const CACHE_NAME = 'reserva-auto-v1';
const urlsToCache = [
    '/',  // Página principal
    '/index.html',
    '/styles.css',
    '/script.js',
    '/favicon.ico',
    '/site.webmanifest',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png'
];

// Instalación del Service Worker y almacenamiento en caché
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Archivos en caché');
            return cache.addAll(urlsToCache);
        })
    );
});

// Activación y eliminación de caché antigua
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Eliminando caché antigua:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Interceptar solicitudes y servir desde caché si no hay conexión
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        }).catch(() => {
            return caches.match('/index.html'); // Muestra la página de inicio si está offline
        })
    );
});
