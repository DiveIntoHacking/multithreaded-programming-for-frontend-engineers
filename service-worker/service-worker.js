import { APP_CACHES, PRE_ASSETS } from './config.js';

self.addEventListener('install', (installEvent) => {
  installEvent.waitUntil(
    caches
      .open(APP_CACHES['PRE'])
      .then((cache) => cache.addAll(PRE_ASSETS))
      .then(self.skipWaiting())
  );
});

const activeCaches = Object.values(APP_CACHES);

self.addEventListener('activate', (extendableEvent) => {
  extendableEvent.waitUntil(
    caches
      .keys()
      .then((keys) => {
        console.log({ keys });
        const oldPreCaches = keys.filter((key) => !activeCaches.includes(key));
        return oldPreCaches;
      })
      .then((oldPreCaches) => {
        const result = Promise.all(
          oldPreCaches.map((oldPreCache) => {
            return caches.delete(oldPreCache);
          })
        );
        console.log({ result });
        return result;
      })
      .then((result) => {
        console.log({ result });
        self.clients.claim();
      })
  );
});

const origin = self.location.origin;

self.addEventListener('fetch', (fetchEvent) => {
  const request = fetchEvent.request;

  if (!request.url.startsWith(origin)) return;

  fetchEvent.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log(`${request.url} was Found.`);
        return cachedResponse;
      } else {
        console.log(`${request.url} was Not Found.`);
      }

      return caches.open(APP_CACHES['RUNTIME']).then((cache) => {
        return fetch(request).then((response) => {
          console.log({ status: response.status });
          console.log(typeof response.status);
          if (response.status != 200) {
            console.log({ response });

            return response;
          }

          console.log('will save in cache');
          cache.put(request, response.clone());
          return response;
        });
      });
    })
  );
});
