import { doHeavyThing } from '../lib/utils.js';

// onmessage method is the shorthand of self.onmessage. Both are the same.
onmessage = (messageEvent) => {
  const busyIndex = messageEvent.data;
  doHeavyThing(`worker thread (#${busyIndex})`);

  postMessage(busyIndex);
  // postMessage method is the shorthand of self.postMessage.
  // After the worker finishes the task, it will return the worker index to main thread using postMessage.
};
