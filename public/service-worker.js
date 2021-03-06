const DATA_CACHE = "data-cache-v1";
const STATIC_CACHE = 'static_cache_v1';

(function () {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("service-worker.js")
            .then(() => console.log("Service Worker registered successfully."))
            .catch(error => console.error("Service Worker registration failed:", error));
    }
})();

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(DATA_CACHE)
        .then(cache => {
            return cache.add('/api/transaction')
                .catch(e => {
                    throw new Error(`Error SW line 20 ==> ${e}`);
                });
        })
    )

    event.waitUntil(
        caches.open(STATIC_CACHE).then(cache => {
            return cache.addAll([
                    "/",
                    "/index.html",
                    "/styles.css",
                    "/indexedDB.js",
                    "/index.js",
                    "/manifest.webmanifest",
                    "/icons/icon-192x192.png",
                    "/icons/icon-512x512.png",
                    "https://cdn.jsdelivr.net/npm/chart.js@2.8.0"
                ])
                .catch(e => {
                    throw new Error(`SW Error line 40 ==> ${e}`);
                });
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== STATIC_CACHE && key !== DATA_CACHE) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", function (event) {
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open(DATA_CACHE)
            .then(async cache => {
                return await fetch(event.request)
                    .then((response) => {
                        if (response.status === 200) {
                            cache.put(event.request.url, response.clone());
                        };
                        return response;
                    })
                    .catch(() => {
                        return cache.match(event.request);
                    });
            })
            .catch((e) => {
                throw new Error(e);
            })
        );
        return;
    }
    // This handles all requests that are for static content, which all should have been precached when the service worker was installed
    event.respondWith(
        caches.open(STATIC_CACHE).then(cache => {
            return cache.match(event.request).then(async response => {
                return response || await fetch(event.request);
            });
        }).catch(e => {
            throw new Error(e);
        })
    );
});