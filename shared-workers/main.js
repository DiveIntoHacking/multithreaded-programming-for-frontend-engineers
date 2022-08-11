// https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker#browser_compatibility
// All of the browsers may not support SharedWorker.
if (!!window.SharedWorker) {
  const sharedWorker = new SharedWorker('shared-worker.js', { type: 'module' });
  const inputElement = document.getElementById('inputArea');
  const outputElement = document.getElementById('outputArea');
  const encodeElement = document.getElementById('encode');
  // Both inputElement and outputElement are references
  // and won't be changed during runtime.

  // https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker/port
  // port property returns a MessagePort object with which
  // you main thread can communicate and control the shared worker.
  const messagePort = sharedWorker.port;

  encodeElement.onclick = () => {
    const message = inputElement.value;
    messagePort.postMessage(message);
  };

  messagePort.onmessage = (messageEvent) => {
    outputElement.textContent = messageEvent.data;
  };

  messagePort.start();
}
