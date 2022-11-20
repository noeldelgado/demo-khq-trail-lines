/*
 * Simple tween controller.
 * Features:
 * - {from -> to} interpolation of object keys.
 * - {delay} start updates after n milliseconds.
 * - {onUpdate} callback to update UI using interpolated values.
 * - {onComplete} callback to start a new line animation randomly.
 * - pause and resume activeTweens on visibilitychange
 */
export default class T {
  static #activeTweens = new Set();
  static #pausedTweens = new Set();

  static update(t) {
    T.#activeTweens.forEach(function update(tween) {
      tween.update(t);
    });
  }

  static pause() {
    T.#pausedTweens = new Set(T.#activeTweens);
    T.clear();
  }

  static resume() {
    T.#pausedTweens.forEach((tween) => tween.resume());
  }

  static clear() {
    T.#activeTweens.clear();
  }

  a = {};
  b = {};
  duration = 1000;
  ease = t => t;
  delay = 0;

  #keys = [];
  #keysLen = 0;
  #props = {};
  #startTime = 0;
  #elapsed = 0;
  #progress = 0;

  constructor(config = {}) {
    Object.assign(this, config);

    this.#props = { ...this.a };
    this.#keys = Object.keys(this.b);
    this.#keysLen = this.#keys.length;

    this.#startTime = performance.now() + this.delay;
    T.#activeTweens.add(this);
  }

  resume() {
    this.#startTime = performance.now() - this.#elapsed;
    T.#activeTweens.add(this);
  }

  update(t) {
    this.#elapsed = t - this.#startTime;

    if (this.#elapsed < 0) return;

    this.#progress = this.ease(this.#elapsed / this.duration);

    let i = this.#keysLen;
    while(i--) {
      const key = this.#keys[i];
      const from = this.a[key];
      this.#props[key] = from + (this.b[key] - from) * this.#progress;
    }

    this.onUpdate?.(this.#props);

    if (this.#elapsed >= this.duration)  {
      T.#activeTweens.delete(this);
      this.onComplete?.(this.#props);
    }
  }
}

document.addEventListener("visibilitychange", function handleVisibilityChange() {
  if (document.visibilityState === 'hidden') T.pause();
  else T.resume();
});
