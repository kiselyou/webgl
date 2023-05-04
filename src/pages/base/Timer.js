import objectPath from 'object-path'

export default class Timer {
  /**
   * @param {Timer|Object} [options]
   */
  constructor(options) {
    /** @type {number} */
    this.time = objectPath.get(options, ['time'], 0)
    /** @type {number} */
    this.percent = objectPath.get(options, ['percent'], 0)
    /** @type {number|?} */
    this.timestamp = objectPath.get(options, ['timestamp'], null)
  }

  /**
   *
   * @param {number} ms
   * @param {number|?} [now]
   * @returns {this}
   */
  sleep(ms, now = null) {
    this.percent = 0
    this.time = ms
    this.timestamp = (now || Date.now())
    return this
  }

  /**
   *
   * @param {number|?} [now]
   * @returns {this}
   */
  start(now) {
    this.percent = 0
    this.timestamp = now || Date.now()
    return this
  }

  /**
   *
   * @param {number} [now]
   * @returns {{percentFloor: number, tick: boolean, isExpired: boolean, percent: number}}
   */
  update(now) {
    let tick = false
    const diff = (now || Date.now()) - this.timestamp
    const percent = Math.min(diff * 100 / this.time, 100)
    const percentFloor = Math.floor(percent)
    if (this.percent !== percentFloor) {
      this.percent = percentFloor
      tick = true
    }
    return {
      tick,
      percent,
      percentFloor,
      isExpired: diff >= this.time
    }
  }
}
