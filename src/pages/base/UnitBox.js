import objectPath from 'object-path'
import Unit from '@pages/base/Unit'
import Base from '@pages/base/Base'

export default class UnitBox extends Base {
  /**
   * Один бокс может сожержать N едениц отдной сущьности.
   * Предназначен для хранения едениц на карадлях и станциях.
   * @param {UnitBox|Object} options
   */
  constructor(options) {
    super(options)

    /** @type {boolean} */
    this.isUnitBox = true

    /** @type {number} */
    this.value = objectPath.get(options, ['value'], 0)

    /** @type {Unit} */
    this.unit = new Unit(objectPath.get(options, ['unit'], {}))
  }

  /**
   * @param {number} quantity
   * @returns {this}
   */
  increase(quantity) {
    this.value += quantity
    return this
  }

  /**
   * @param {number} quantity
   * @returns {this}
   */
  decrease(quantity) {
    this.value = Math.max(this.value - quantity, 0)
    return this
  }

  /**
   * Объем занимаемого места.
   * @returns {number}
   */
  get volume() {
    return this.value * this.unit.volume
  }
}
