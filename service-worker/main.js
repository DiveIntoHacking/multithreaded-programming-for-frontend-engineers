const showCachesElement = document.getElementById('show-caches');
const removeCachesElement = document.getElementById('remove-caches');
const cachesElement = document.getElementById('caches');
const unregisterServiceWorkerElement = document.getElementById(
  'unregister-service-worker'
);
const logoElement = document.getElementById('logo');
const clearConsoleElement = document.getElementById('clear-console');
const reloadLocationElement = document.getElementById('reload-location');

if (!!navigator.serviceWorker) {
  navigator.serviceWorker.register('service-worker.js', {
    type: 'module',
  });
}

logoElement.addEventListener('click', () => {
  const imgElement = document.createElement('img');
  const logoSrcPath = './logo.jpg';
  imgElement.src = logoSrcPath;
  document.querySelector('#main').appendChild(imgElement);
});

showCachesElement.addEventListener('click', async () => {
  const cacheNames = await caches.keys();
  cachesElement.textContent = cacheNames.join();
});

removeCachesElement.addEventListener('click', async () => {
  const cacheNames = await caches.keys();
  console.log({ cacheNames });

  const result = await Promise.all(
    cacheNames.map((cacheName) => {
      return caches.delete(cacheName);
    })
  );
  console.log({ result });
});

unregisterServiceWorkerElement.addEventListener('click', async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  registrations.forEach(async (registration) => {
    const result = await registration.unregister();
    if (result) console.log(registration);
  });
});

const clearConsole = () => console.clear();
clearConsoleElement.addEventListener('click', clearConsole);

const reloadLocation = () => location.reload();
reloadLocationElement.addEventListener('click', reloadLocation);
