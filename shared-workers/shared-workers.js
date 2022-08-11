// 本スクリプトは、メインスレッドで実行されるスクリプトである。
// メインスレッドは、worker を作成する側のスレッドのため、親スレッドと呼ぶこともある。

if (!!window.SharedWorker) {
  const worker = new SharedWorker('shared-worker.js');

  document.getElementById('encode').onclick = function () {
    const element = document.getElementById('string');
    const string = element.value;
    worker.port.postMessage(string);
  };

  worker.port.onmessage = function (event) {
    const element = document.getElementById('result');
    element.textContent = event.data;
  };
}
