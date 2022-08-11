if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js', { type: 'module' });
}

document.getElementById('logo').addEventListener('click', () => {
  const imgElement = document.createElement('img');
  const logoSrcPath = './logo.jpg';
  imgElement.src = logoSrcPath;
  document.querySelector('#main').appendChild(imgElement);
});

document.getElementById('showCaches').addEventListener('click', async () => {
  const keys = await caches.keys();
  console.log({ keys });
});
