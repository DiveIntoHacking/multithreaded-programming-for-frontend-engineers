import { digestMessage } from '../lib/utils.js';

console.log({ digestMessage });

// 以下に該当するものはcacheが有効
// * 算出コストが高く、再実施しても結果が変わらないもの
// * 極めて変わりにくく、万一古い情報だったとしても致命的な問題にはならないようなもの
let cache = {};

onconnect = function (messageEvent) {
  const port = messageEvent.ports[0];

  port.onmessage = async function (event) {
    console.log({ event });
    const string = event.data;

    const cachedResult = cache[string];
    console.log({ cache, cachedResult });

    if (cachedResult) {
      console.log('cache is found.');
      port.postMessage(cachedResult);

      return;
    }

    console.log({ string });
    const result = await digestMessage(string).then((digestBuffer) => {
      return digestBuffer;
    });

    port.postMessage(result);
    cache[string] = result;
  };
};
