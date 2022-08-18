import { doHeavyThing } from '../lib/utils.js';

const buttonMainThread = document.getElementById('run-in-main-thread');
const buttonWorkerThread = document.getElementById('run-in-worker-thread');
const busyArea = document.getElementById('busy');
const freeArea = document.getElementById('free');
const message = document.getElementById('message');
const animationArea = document.getElementById('animation-area');

const concurrency = navigator.hardwareConcurrency;
// My machine shows 16.
// This indicates the number of logical processors(cores not cpus).
// This value depends on your machine spec.
// On each logical processor, a thread will work respectively.

const thresholdNotBusy = concurrency / 2;
// Set the half value to the threshold.
const allWorkerIndices = [...Array(concurrency).keys()];
// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
const workers = allWorkerIndices.map(
  () => new Worker('web-worker.js', { type: 'module' })
);
// 16 workers will be created and stored in an array in workers.

let workerIndices = {
  busy: [],
  free: allWorkerIndices,
};
// workerIndices can manage busy workers and free workers.
// At the beginning, all the worker indices are set free.

const renderWorkerIndices = () => {
  busyArea.innerText = workerIndices.busy.join();
  freeArea.innerText = workerIndices.free.join();
};

renderWorkerIndices(); // render like a string such as 1,2,3,...

buttonWorkerThread.onclick = () => {
  // Pick up one free worker here.
  const [newBusyIndex, ...freeIndices] = workerIndices.free;

  if (newBusyIndex === undefined) {
    message.innerText = 'All workers are busy, please wait a moment.';
    return;
  }

  // Nobody else can change workerIndices because the main thread is just one.
  workerIndices = {
    busy: [...workerIndices.busy, newBusyIndex],
    // insert a free worker at the last position of busy array.
    free: freeIndices,
  };

  renderWorkerIndices();
  // When the workerIndices was changed, you need to render the workerIndices,
  // so that you can see which workers are busy or free on html.

  const worker = workers[newBusyIndex];
  worker.postMessage(newBusyIndex);
  // postMessage method can send a message to the worker running in worker's thread.
  // postMessage can accept a single parameter. This parameter is just the data.
  // The data may be any value of JavaScript object which will be cloned
  // according to the structured clone algorithm.

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
