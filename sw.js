self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("lenwell-v1").then((cache) => {
            return cache.addAll([
                "/index.html",
                "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
                "/" // Cache the root for offline access
            ]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((fetchResponse) => {
                return caches.open("lenwell-v1").then((cache) => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        }).catch(() => {
            return caches.match("/index.html"); // Fallback to cached page
        })
    );
});