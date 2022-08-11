import { doHeavyThing } from './utils.js';

onmessage = (event) => {
  const index = event.data;

  doHeavyThing(`worker #${index}`);

  self.postMessage(index);
};
