class Queue {
  constructor(autorun = true, queue = []) {
    this.running = false;
    this.autorun = autorun;
    this.queue = queue;
  }

  add(cb) {
    if (this.queue.length > 2) {
      this.queue = this.queue.splice(0, this.queue.length - 1);
    }
    this.queue.push((value) => {
      const finished = new Promise((resolve, reject) => {
        const callbackResponse = cb(value);

        if (callbackResponse !== false) {
          resolve(callbackResponse);
        } else {
          reject(callbackResponse);
        }
      });

      finished.then(this.dequeue.bind(this), (() => { }));
    });

    if (this.autorun && !this.running) {
      this.dequeue();
    }

    return this;
  }

  dequeue(value) {
    this.running = this.queue.shift();

    if (this.running) {
      this.running(value);
    }

    return this.running;
  }

  get next() {
    return this.dequeue;
  }
}

export default Queue;