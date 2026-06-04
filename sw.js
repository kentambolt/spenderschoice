/* SpendersChoice service worker.
   - Pre-caches the app shell.
   - Network-first for navigations + JS/CSS so new versions are picked up.
   - Cache-first for static assets (SVG/manifest).
   - On message {type:"SKIP_WAITING"} it activates immediately so the
     in-page "Reload" prompt can swap to the new version.
*/

const VERSION = "2026-06-04-1";
const CACHE_NAME = "spenderschoice-" + VERSION;
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./logo.svg",
  "./favicon.svg",
  "./manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k.startsWith("spenderschoice-") && k !== CACHE_NAME).map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isDoc = req.mode === "navigate" || (req.destination === "" && req.headers.get("accept")?.includes("text/html"));
  const isScript = req.destination === "script" || url.pathname.endsWith(".js");
  const isStyle  = req.destination === "style"  || url.pathname.endsWith(".css");

  if (isDoc || isScript || isStyle) {
    // Network-first
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (e) {
        const cached = await caches.match(req);
        if (cached) return cached;
        // Fall back to cached index for navigations
        if (isDoc) {
          const idx = await caches.match("./index.html");
          if (idx) return idx;
        }
        throw e;
      }
    })());
    return;
  }

  // Static assets: cache-first, update in background
  event.respondWith((async () => {
    const cached = await caches.match(req);
    const fetchPromise = fetch(req).then(res => {
      caches.open(CACHE_NAME).then(c => c.put(req, res.clone()));
      return res;
    }).catch(() => cached);
    return cached || fetchPromise;
  })());
});
