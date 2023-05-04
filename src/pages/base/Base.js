import objectPath from 'object-path'
import { v4 } from 'uuid'

export default class Base {
  /**
   *
   * @param {Base|Object} options
   */
  constructor(options) {
    /** @type {boolean} */
    this.isBase = true

    /** @type {string|?} */
    this.uid = objectPath.get(options, ['uid'], v4())

    /** @type {string|?} */
    this.name = objectPath.get(options, ['name'], null)
  }

  /**
   * @param {string} value
   * @returns {this}
   */
  setUID(value) {
    this.uid = value
    return this
  }

  /**
   * @param {string} value
   * @returns {this}
   */
  setName(value) {
    this.name = value
    return this
  }
}
