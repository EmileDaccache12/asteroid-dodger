const CACHE = "asteroid-dodger-v1";

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE).then(cache => {
            return cache.addAll([
                "/",
                "/index.html",
                "/mechanics.js",
                "/manifest.json",
                "/asteroid-dodger-logo.png",
                "/space-pixel-bg.png",
                "/rocket-pixel-0.png",
                "/rocket-pixel-1.png",
                "/rocket-pixel-2.png",
                "/rocket-pixel-3.png",
                "/asteroid-pixel-1.png"
            ]);
        })
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(cached => {
            return cached || fetch(event.request);
        })
    );
});