import { doHeavyThing } from '../lib/utils.js';

const buttonMainThread = document.getElementById('run-in-main-thread');
const buttonWorkerThread = document.getElementById('run-in-worker-thread');
const busyArea = document.getElementById('busy');
const freeArea = document.getElementById('free');
const message = document.getElementById('message');
const animationArea = document.getElementById('animation-area');

const concurrency = navigator.hardwareConcurrency;
//=> 16, this depends on your machine.
const thresholdNotBusy = concurrency / 2;
const allWorkerIndices = [...Array(concurrency).keys()];
//=> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
const workers = allWorkerIndices.map(
  () => new Worker('web-worker.js', { type: 'module' })
);
// 16 times workers will be created and stored in an array.

let workerIndices = {
  busy: [],
  free: allWorkerIndices,
};

const renderWorkerIndices = () => {
  busyArea.innerText = workerIndices.busy.join();
  freeArea.innerText = workerIndices.free.join();
};

renderWorkerIndices();

buttonWorkerThread.onclick = () => {
  // Pick up one free worker here.
  const [newBusyIndex, ...freeIndices] = workerIndices.free;

  if (newBusyIndex === undefined) {
    message.innerText = 'All workers are busy, please wait a moment.';
    return;
  }

  // Nobody else can change workerIndices bacause this thread is single.
  workerIndices = {
    busy: [...workerIndices.busy, newBusyIndex],
    free: freeIndices,
  };

  renderWorkerIndices();

  const worker = workers[newBusyIndex];
  worker.postMessage(newBusyIndex);
  worker.onmessage = (messageEvent) => {
    const newFreeIndex = messageEvent.data;

    workerIndices = {
      busy: [...workerIndices.busy].filter((item) => item != newFreeIndex),
      free: [...workerIndices.free, newFreeIndex],
    };
    renderWorkerIndices();

    // Clear alert message.
    if (workerIndices.busy.length <= thresholdNotBusy) message.innerText = '';
  };
};

buttonMainThread.onclick = () => doHeavyThing('main thread');

const startAnimation = () => {
  const keyframes = { borderRadius: ['10%', '50%'] };
  const options = {
    iterations: Infinity,
    direction: 'alternate',
    duration: 500,
  };
  animationArea.animate(keyframes, options);
};
startAnimation();
