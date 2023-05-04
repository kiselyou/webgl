import UnitEnergy from '@pages/base/units/UnitEnergy'
import UnitCrystal from '@pages/base/units/UnitCrystal'
import FactoryStock from '@pages/base/FactoryStock'
import Factory from '@pages/base/Factory'
import Timer from '@pages/base/Timer'
import objectPath from 'object-path'
import Bank from '@pages/base/Bank'

export default class FactoryEnergy extends Factory {
  /**
   * @param {Owner} owner
   * @param {Factory|Object} [options]
   */
  constructor(owner, options) {
    super(owner, options)

    this.name = 'Power station'

    /** @type {Timer} */
    this.timer = new Timer({
      ...objectPath.get(options, ['timer'], {}),
      time: objectPath.get(options, ['timer', 'time'], 106000)
    })

    /** @type {Bank} */
    this.bank = new Bank({
      ...objectPath.get(options, ['bank'], {}),
      total: objectPath.get(options, ['bank', 'total'], 420)
    })

    /**
     * @type {FactoryStock}
     */
    this.product = new FactoryStock({
      ...objectPath.get(options, ['product'], {}),
      name: 'Stock Energy',
      priceMin: objectPath.get(options, ['product', 'priceMin'], 9),
      priceMax: objectPath.get(options, ['product', 'priceMax'], 23),
      quantity: objectPath.get(options, ['product', 'quantity'], 276),
      volume: objectPath.get(options, ['product', 'volume'], 82800), // 276 * 100 * 3
      unitBox: {
        name: 'Box Energy',
        value: objectPath.get(options, ['product', 'unitBox', 'value'], 0),
        unit: new UnitEnergy(objectPath.get(options, ['product', 'unitBox', 'unit'], {}))
      }
    })

    const crystalOptions = objectPath.get(options, ['product', 'resources'], [])
      .find((resource) => resource.unitBox.unit.key === UnitCrystal.KEY) || {}

    /**
     * @type {FactoryStock[]}
     */
    this.resources = [
      new FactoryStock({
        ...crystalOptions,
        name: 'Stock Crystal',
        quantity: objectPath.get(crystalOptions, ['product', 'quantity'], 2),
        volume: objectPath.get(options, ['product', 'volume'], 600), // 2 * 100 * 3
        unitBox: {
          name: 'Box Crystal',
          value: objectPath.get(options, ['product', 'unitBox', 'value'], 40), // хватит на 20 итераций
          unit: new UnitCrystal(objectPath.get(options, ['product', 'unitBox', 'unit'], {}))
        }
      }),
    ]
  }
}
