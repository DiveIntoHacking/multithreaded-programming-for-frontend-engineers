import { digestMessage } from '../lib/utils.js';

// To debug shared worker, open chrome://inspect/#workers with Chrome,
// and click inspect link.

// Caching would be very effective when programme meets the followings.
// * calculation cost is high and re-calculation won't change the result.
// * Data in cache seldom change, if it's old, that won't be a critical error.
let cache = {};

onconnect = (messageEvent) => {
  const port = messageEvent.ports[0];

  port.onmessage = async (event) => {
    const string = event.data;

    const cachedResult = cache[string];

    if (cachedResult) {
      console.log('cache is found.');
      port.postMessage(cachedResult);
    } else {
      // The following code give the result as same as "printf string | sha256sum" run on mac.
      const result = await digestMessage(string);
      port.postMessage(result);
      cache[string] = result;
    }
  };

  port.start();
};
