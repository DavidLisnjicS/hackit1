// Service Worker für Level F
const CACHE_NAME = "hackit-level-f-v2";
const HINT_FILES = ["hint.json"];

self.addEventListener("install", (event) => {
    console.log("[SW] Install event");

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("[SW] Öffne Cache und füge Dateien hinzu:", HINT_FILES);
                return cache.addAll(HINT_FILES);
            })
            .then(() => {
                console.log("[SW] Alle Dateien wurden gecached.");
            })
            .catch((err) => {
                console.error("[SW] Fehler beim Cachen:", err);
            })
    );

    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("[SW] Activate event");
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => {
                        console.log("[SW] Lösche alten Cache:", key);
                        return caches.delete(key);
                    })
            );
        })
    );
    self.clients.claim();
});

// Einfacher fetch-Handler: erst Cache, dann Netzwerk
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
