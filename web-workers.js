import { doHeavyThing } from './utils.js';

const buttonMainThread = document.getElementById('run-in-main-thread');
const buttonWorkerThread = document.getElementById('run-in-worker-thread');
const busyArea = document.getElementById('busy');
const freeArea = document.getElementById('free');
const message = document.getElementById('message');
const animationArea = document.getElementById('animation-area');

const concurrency = navigator.hardwareConcurrency;
const thresholdNotBusy = concurrency / 2;

let workerStatus = {
  busy: [],
  free: [],
};

let index = 0;

const workers = [...Array(concurrency)].map((_item, index) => {
  workerStatus = {
    busy: [...workerStatus.busy],
    free: [...workerStatus.free, index],
  };

  return new Worker('worker.js', { type: 'module' });
});

const renderWorkerStatus = (workerStatus) => {
  busyArea.innerText = workerStatus.busy.join();
  freeArea.innerText = workerStatus.free.join();
};

buttonWorkerThread.onclick = () => {
  const [index, ...rest] = workerStatus.free;

  if (index === undefined) {
    message.innerText = 'All workers are busy, please wait a moment.';
    return;
  }

  workerStatus = {
    busy: [...workerStatus.busy, index],
    free: rest,
  };

  renderWorkerStatus(workerStatus);

  const worker = workers[index];
  worker.postMessage(index);
  worker.onmessage = (messageEvent) => {
    const index = messageEvent.data;

    workerStatus = {
      busy: [...workerStatus.busy].filter((item) => item != index),
      free: [...workerStatus.free, index],
    };
    renderWorkerStatus(workerStatus);

    if (workerStatus.busy.length <= thresholdNotBusy) {
      message.innerText = '';
    }
  };
};

buttonMainThread.onclick = () => doHeavyThing('main');

animationArea.animate(
  {
    borderRadius: ['20%', '50%'],
  },
  {
    iterations: Infinity,
    direction: 'alternate',
    duration: 200,
  }
);
