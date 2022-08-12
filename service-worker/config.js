export const CACHES = {
  INSTALLATION: '0.0.1',
  RUNTIME: 'RUNTIME',
};

// The following assets must be under the scope of service worker.
// They will be cached right after installation.
export const ASSETS = [
  '/service-worker/',
  '/service-worker/index.html',
  '/service-worker/main.js',
  '/service-worker/service-worker.js',
];
