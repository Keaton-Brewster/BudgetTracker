const DATA_CACHE_NAME = "data-cache-v1";

self.addEventListener("install", (event) => {
    //   pre-cache transaction data
    // event.waitUntil(
    //     caches.open(DATA_CACHE_NAME).then((cache) => cache.add('/api/transaction'))
    // );

    //   pre-cache static assets
    event.waitUntil(
        caches.open("static").then((cache) => {
            return cache.addAll([
                    "/",
                    "/index.html",
                    "/styles.css",
                    "/index.js",
                    "/db.js",
                    "/manifest.webmanifest",
                    "./icons/icon-192x192.png",
                    "./icons/icon-512x512.png",
                    "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
                    "https://cdn.jsdelivr.net/npm/chart.js@2.8.0"
                ])
                .catch(error => console.log(error));
        })
    );
    console.log("SW installed");
    self.skipWaiting();
});

// activate
self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== "static" && key !== DATA_CACHE_NAME) {
                        console.log("Removing old cache data", key);
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
            caches
            .open(DATA_CACHE_NAME)
            .then((cache) => {
                return fetch(event.request)
                    .then((response) => {
                        // If the response was good, clone it and store it in the cache.
                        if (response.status === 200) {
                            cache.put(event.request.url, response.clone());
                        }

                        return response;
                    })
                    .catch((err) => {
                        // Network request failed, try to get it from the cache.
                        return cache.match(event.request);
                    });
            })
            .catch((err) => console.log(err))
        );

        return;
    }

    event.respondWith(
        caches.open("static").then((cache) => {
            return cache.match(event.request).then((response) => {
                return response || fetch(event.request);
            });
        })
    );
});

// async function getTransaction() {
//     return new Promise((resolve, reject) => {

//     })
// }

// //? I can use this sync event to update the databases behind the scenes, hopefully. ;
// //? honestly all of this is becoming super confusing. and I don't really know how much I actually know
// self.addEventListener('sync', event => {
//     if (event.tag = 'add-transaction') {
//         event.waitUntil(
//             getTransaction().then(transactions => {
//                 return fetch('/api/transactions/bulk', {
//                     method: 'POST',
//                     body: JSON.stringify(transactions),
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 }).then(() => {
//                     console.log('bulk post success (SW.js line 97)');
//                 })
//             }))
//     }
// })

