const CACHE = "omo-v10";
const ASSETS = [
  "./",
  "./index.html",
  "./shared/ui.css",
  "./shared/app.js",
  "./shared/audio.js",
  "./shared/sensors.js",
  "./shared/compass-rose.js",
  "./shared/hold-play.js",
  "./shared/tilt-amp.js",
  "./shared/hand-bow.js",
  "./shared/motion-express.js",
  "./shared/circular-seq.js",
  "./shared/drum-sounds.js",
  "./shared/evo-pattern.js",
  "./shared/ml.js",
  "./shared/workshop.js",
  "./shared/pitch.js",
  "./shared/ks.js",
  "./manifest.webmanifest",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const net = fetch(e.request).then((res) => {
        if (res.ok && e.request.url.startsWith(self.location.origin)) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      });
      return cached || net;
    })
  );
});
