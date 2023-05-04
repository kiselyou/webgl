import UnitSilicon from '@pages/base/units/UnitSilicon'
import UnitEnergy from '@pages/base/units/UnitEnergy'
import FactoryStock from '@pages/base/FactoryStock'
import Factory from '@pages/base/Factory'
import Timer from '@pages/base/Timer'
import objectPath from 'object-path'
import Bank from '@pages/base/Bank'

export default class FactorySilicon extends Factory {
  /**
   * @param {Owner} owner
   * @param {Factory|Object} [options]
   */
  constructor(owner, options) {
    super(owner, options)

    this.name = 'Silicon mine'

    /** @type {Timer} */
    this.timer = new Timer({
      ...objectPath.get(options, ['timer'], {}),
      time: objectPath.get(options, ['timer', 'time'], 93000)
    })

    /** @type {Bank} */
    this.bank = new Bank({
      ...objectPath.get(options, ['bank'], {}),
      total: objectPath.get(options, ['bank', 'total'], 1656)
    })

    /**
     * @type {FactoryStock}
     */
    this.product = new FactoryStock({
      ...objectPath.get(options, ['product'], {}),
      name: 'Stock Silicon',
      priceMin: objectPath.get(options, ['product', 'priceMin'], 227),
      priceMax: objectPath.get(options, ['product', 'priceMax'], 781),
      quantity: objectPath.get(options, ['product', 'quantity'], 1),
      volume: objectPath.get(options, ['product', 'volume'], 300), // 1 * 100 * 3
      unitBox: {
        name: 'Box Silicon',
        value: objectPath.get(options, ['product', 'unitBox', 'value'], 0),
        unit: new UnitSilicon(objectPath.get(options, ['product', 'unitBox', 'unit'], {}))
      }
    })

    const energyOptions = objectPath.get(options, ['product', 'resources'], [])
      .find((resource) => resource.unitBox.unit.key === UnitEnergy.KEY) || {}

    /**
     * @type {FactoryStock[]}
     */
    this.resources = [
      new FactoryStock({
        ...energyOptions,
        name: 'Stock Energy',
        quantity: objectPath.get(energyOptions, ['product', 'quantity'], 24),
        volume: objectPath.get(options, ['product', 'volume'], 7200),//24 * 100 * 3
        unitBox: {
          name: 'Box Energy',
          value: objectPath.get(options, ['product', 'unitBox', 'value'], 480), // хватит на 20 итераций
          unit: new UnitEnergy(objectPath.get(options, ['product', 'unitBox', 'unit'], {}))
        }
      }),
    ]
  }
}
