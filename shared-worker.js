// 以下に該当するものはcacheが有効
// * 算出コストが高く、再実施しても結果が変わらないもの
// * 極めて変わりにくく、万一古い情報だったとしても致命的な問題にはならないようなもの
let cache = {};

// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(''); // convert bytes to hex string
  return hashHex;
}

onconnect = function (messageEvent) {
  console.log('初回接続時のみ実行される');
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
