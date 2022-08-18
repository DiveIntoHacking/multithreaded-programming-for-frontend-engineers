import { CACHES, ASSETS } from './config.js';

// initialization
const runtimeCacheName = CACHES.RUNTIME;
const installationCacheName = CACHES.INSTALLATION;
const cacheNames = Object.values(CACHES);
const origin = self.location.origin;
//=> origin is like "http://127.0.0.1:5500"

// You can setup event listers in service worker script.
//   1. install
//   2. activate
//   3. fetch
self.addEventListener('install', (installEvent) => {
  installEvent.waitUntil(
    caches
      .open(installationCacheName)
      .then((cache) => cache.addAll(ASSETS))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', (extendableEvent) => {
  extendableEvent.waitUntil(
    caches
      .keys()
      .then((cacheNamesUsedInBrowser) => {
        console.log({ cacheNamesUsedInBrowser });
        const unusedCacheNames = cacheNamesUsedInBrowser.filter(
          (key) => !cacheNames.includes(key)
        );
        console.log({ unusedCacheNames });
        return unusedCacheNames;
      })
      .then((unusedCacheNames) => {
        return Promise.all(
          unusedCacheNames.map((unusedCacheName) => {
            return caches.delete(unusedCacheName);
          })
        );
      })
      .then((result) => {
        console.log({ result });
        self.clients.claim();
      })
  );
});

self.addEventListener('fetch', (fetchEvent) => {
  const request = fetchEvent.request;

  if (!request.url.startsWith(origin)) return;

  // cache is effective only within origin requests.
  fetchEvent.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log(`${request.url} was Found.`);
        return cachedResponse;
      }

      console.log(`${request.url} was Not Found.`);

      return caches.open(runtimeCacheName).then((cache) => {
        return fetch(request).then((response) => {
          console.log({ request, response, status: response.status });

          if (response.status != 200) return response;

          console.log(
            `The contents of ${response.url} will be saved in ${runtimeCacheName} cache.`
          );

          cache.put(request, response.clone());

          return response;
        });
      });
    })
  );
});
