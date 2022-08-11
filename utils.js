export const doHeavyThing = (threadName) => {
  console.log(threadName, 'start');
  for (let i = 0; i < 500_000; i++) {
    crypto.randomUUID();
  }
  console.log(threadName, 'end');
};
