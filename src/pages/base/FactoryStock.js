import Stock from '@pages/base/Stock'
import objectPath from 'object-path'

export default class FactoryStock extends Stock {
  /**
   * @param {FactoryStock|Object} options
   */
  constructor(options) {
    super(options)

    /**
     * Кол-во потребляемых или производимых едениц.
     * @type {number}
     */
    this.quantity = objectPath.get(options, ['quantity'], 6)

    /** @type {number} */
    this.priceMin = objectPath.get(options, ['priceMin'], 1432)

    /** @type {number} */
    this.priceMax = objectPath.get(options, ['priceMax'], 1936)
  }

  /**
   * Фактическая цена товара за 1 еденицу.
   * Зависит от кол-ва товаров на складе и диапозоза цен (min-max).
   *
   * @returns {number}
   */
  get price() {
    const percent = 100 - this.unitBox.value * 100 / this.countMax
    return Math.round(this.priceMin + (this.priceMax - this.priceMin) * (percent / 100))
  }

  /**
   * Фактическая цена товара за 1 еденицу в процентах.
   * Зависит от кол-ва товаров на складе и диапозоза цен (min-max).
   *
   * @returns {number}
   */
  get pricePercent() {
    return (this.price - this.priceMin) * 100 / (this.priceMax - this.priceMin)
  }
}
