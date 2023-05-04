import Unit from '@pages/base/Unit'
import objectPath from 'object-path'

export default class UnitEnergy extends Unit {
  constructor(options) {
    super(options)

    /** @type {string|?} */
    this.key = objectPath.get(options, ['key'], UnitEnergy.KEY)

    /** @type {string|?} */
    this.name = objectPath.get(options, ['name'], 'Energy')

    /** @type {number} */
    this.volume = objectPath.get(options, ['volume'], 1)
  }

  static KEY = 'energy'
}
