import objectPath from 'object-path'
import Base from '@pages/base/Base'
import UnitBox from '@pages/base/UnitBox'

export default class Stock extends Base {
  /**
   * @param {Stock|Object} [options]
   */
  constructor(options) {
    super(options)

    /** @type {boolean} */
    this.isStock = true

    /**
     * Максимальный объем склада.
     * @type {number}
     */
    this.volume = objectPath.get(options, ['volume'], 1000)

    /**
     * Значение 0 до 100%. Лимит разгрузки склада от 0 до 100%.
     * 10% - это минимально кол-во едениц которое должно быть на складе.
     * @type {number}
     */
    this.limitMin = objectPath.get(options, ['limitMin'], 0)

    /**
     * Значение 0 до 100%. Лимит загрузки склада от 0 до 100%.
     * 90% - это максимальное кол-во едениц которое должно быть на складе.
     * @type {number}
     */
    this.limitMax = objectPath.get(options, ['limitMax'], 100)

    /** @type {UnitBox} */
    this.unitBox = new UnitBox(objectPath.get(options, ['unitBox'], {}))
  }

  /**
   * Кол-во едениц.
   * @returns {number}
   */
  get count() {
    return this.unitBox.value
  }

  /**
   * Максимальное кол-во едениц.
   * @returns {number}
   */
  get countMax() {
    return Math.floor(this.volume / this.unitBox.unit.volume)
  }

  /**
   * Максимальное кол-во едениц в процентах.
   * @returns {number}
   */
  get countPercent() {
    return 100 / this.countMax * this.unitBox.value
  }

  /**
   * Кол-во едениц которое склад может отдать.
   * @param {number} count - Кол-во едениц которое нужно взять со склада.
   * @returns {number}
   */
  countLimitGet(count) {
    return Math.floor(this.volumeLimitGet(count * this.unitBox.unit.volume) / this.unitBox.unit.volume)
  }

  /**
   * Кол-во едениц которое склад может принять.
   * @param {number} count - Кол-во едениц которое нужно загрузить на склад.
   * @returns {number}
   */
  countLimitSet(count) {
    return Math.floor(this.volumeLimitSet(count * this.unitBox.unit.volume) / this.unitBox.unit.volume)
  }

  /** @returns {number} */
  get volumeLimitMin() {
    return this.volume / 100 * this.limitMin
  }

  /**
   * Объем который склад может отдать.
   * @param {number} volume - Объем который нужно взять со склада.
   * @returns {number}
   */
  volumeLimitGet(volume) {
    return Math.min(Math.max(this.unitBox.volume - this.volumeLimitMin, 0), volume)
  }

  /** @returns {number} */
  get volumeLimitMax() {
    return this.volume / 100 * this.limitMax
  }

  /**
   * Объем который склад может принять.
   * @param {number} volume - Объем который нужно загрузить на склад.
   * @returns {number}
   */
  volumeLimitSet(volume) {
    return Math.min(Math.max(this.volumeLimitMax - this.unitBox.volume, 0), volume)
  }
}
