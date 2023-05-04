import objectPath from 'object-path'
import Base from '@pages/base/Base'

export default class Unit extends Base {
  /**
   * @param {Unit|Object} [options]
   */
  constructor(options) {
    super(options)

    /** @type {boolean} */
    this.isUnit = true

    /** @type {string} */
    this.key = objectPath.get(options, ['key'], Unit.KEY)

    /** @type {number} */
    this.volume = objectPath.get(options, ['volume'], 1)
  }

  static KEY = 'unit'
}
