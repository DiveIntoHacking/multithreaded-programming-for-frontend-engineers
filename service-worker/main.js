// initialization
const showCachesElement = document.getElementById('show-caches');
const removeCachesElement = document.getElementById('remove-caches');
const cachesElement = document.getElementById('caches');
const unregisterServiceWorkerElement = document.getElementById(
  'unregister-service-worker'
);
const logoElement = document.getElementById('logo');
const clearConsoleElement = document.getElementById('clear-console');
const reloadLocationElement = document.getElementById('reload-location');
const mainElement = document.getElementById('main');
const serviceWorker = navigator.serviceWorker;
clearConsoleElement.addEventListener('click', () => console.clear());
reloadLocationElement.addEventListener('click', () => window.location.reload());

if (!!serviceWorker) {
  const registerServiceWorker = async () => {
    const serviceWorkerRegistration = await serviceWorker.register(
      'service-worker.js',
      {
        type: 'module',
      }
    );
    console.log({ serviceWorkerRegistration });
  };

  registerServiceWorker();
}

logoElement.addEventListener('click', () => {
  const imgElement = document.createElement('img');
  const logoSrcPath = './logo.jpg';
  imgElement.src = logoSrcPath;
  mainElement.prepend(imgElement);
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
  const serviceWorkerRegistrations = await serviceWorker.getRegistrations();
  serviceWorkerRegistrations.forEach(async (registration) => {
    const result = await registration.unregister();
    if (result) {
      console.log('unregister passed.');
      console.log(registration);
    } else {
      console.log('unregister failed.');
    }
  });
});
