import UnitSilicon from '@pages/base/units/UnitSilicon'
import UnitEnergy from '@pages/base/units/UnitEnergy'
import UnitCrystal from '@pages/base/units/UnitCrystal'
import FactoryStock from '@pages/base/FactoryStock'
import Factory from '@pages/base/Factory'
import Timer from '@pages/base/Timer'
import objectPath from 'object-path'
import Bank from '@pages/base/Bank'

export default class FactoryCrystal extends Factory {
  /**
   * @param {Owner} owner
   * @param {Factory|Object} [options]
   */
  constructor(owner, options) {
    super(owner, options)

    this.name = 'Crystal factory'

    /** @type {Timer} */
    this.timer = new Timer({
      ...objectPath.get(options, ['timer'], {}),
      time: objectPath.get(options, ['timer', 'time'], 360000)
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
      name: 'Stock crystals',
      limitMin: objectPath.get(options, ['product', 'limitMin'], 10),
      limitMax: objectPath.get(options, ['product', 'limitMax'], 90),
      priceMin: objectPath.get(options, ['product', 'priceMin'], 30),
      priceMax: objectPath.get(options, ['product', 'priceMax'], 70),
      quantity: objectPath.get(options, ['product', 'quantity'], 8),
      volume: objectPath.get(options, ['product', 'volume'], 2400), // 8 * 100 * 3
      unitBox: {
        name: 'Box crystals',
        value: objectPath.get(options, ['product', 'unitBox', 'value'], 0),
        unit: new UnitCrystal(objectPath.get(options, ['product', 'unitBox', 'unit'], {}))
      }
    })

    const siliconOptions = objectPath.get(options, ['product', 'resources'], [])
      .find((resource) => resource.unitBox.unit.key === UnitSilicon.KEY) || {}

    const energyOptions = objectPath.get(options, ['product', 'resources'], [])
      .find((resource) => resource.unitBox.unit.key === UnitEnergy.KEY) || {}

    /**
     * @type {FactoryStock[]}
     */
    this.resources = [
      new FactoryStock({
        ...energyOptions,
        name: 'Stock Energy',
        quantity: objectPath.get(energyOptions, ['product', 'quantity'], 120),
        volume: objectPath.get(options, ['product', 'volume'], 36000), // 120 * 100 * 3
        unitBox: {
          name: 'Box Energy',
          value: objectPath.get(options, ['product', 'unitBox', 'value'], 2400), // хватит на 20 итераций
          unit: new UnitEnergy(objectPath.get(options, ['product', 'unitBox', 'unit'], {}))
        }
      }),
      new FactoryStock({
        ...siliconOptions,
        name: `Stock Silicon`,
        quantity: objectPath.get(siliconOptions, ['product', 'quantity'], 5),
        volume: objectPath.get(options, ['product', 'volume'], 1500), // 5 * 100 * 3
        unitBox: {
          name: 'Box Silicon',
          value: objectPath.get(options, ['product', 'unitBox', 'value'], 100), // хватит на 20 итераций
          unit: new UnitSilicon(objectPath.get(options, ['product', 'unitBox', 'unit'], {}))
        }
      }),
    ]
  }
}
