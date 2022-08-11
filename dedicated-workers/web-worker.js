import { doHeavyThing } from '../lib/utils.js';

onmessage = ({ data }) => {
  doHeavyThing(`worker thread (#${data})`);

  self.postMessage(data);
};
