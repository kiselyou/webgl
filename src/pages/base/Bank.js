import objectPath from 'object-path'
import Base from '@pages/base/Base'

export default class Bank extends Base {
  /**
   *
   * @param {Bank|Object} options
   */
  constructor(options) {
    super(options)

    /** @type {boolean} */
    this.isBank = true

    /** @type {number} */
    this.total = objectPath.get(options, ['total'], 0)
  }

  /**
   * @param {number} value
   * @returns {this}
   */
  increase(value) {
    this.total += value
    return this
  }

  /**
   * @param {number} value
   * @returns {this}
   */
  decrease(value) {
    this.total = Math.max(this.total - value, 0)
    return this
  }
}
