import Unit from '@pages/base/Unit'
import objectPath from 'object-path'

export default class UnitCrystal extends Unit {
  constructor(options) {
    super(options)

    /** @type {string|?} */
    this.key = objectPath.get(options, ['key'], 'crystal')

    /** @type {string|?} */
    this.name = objectPath.get(options, ['name'], 'Crystal')

    /** @type {number} */
    this.volume = objectPath.get(options, ['volume'], 3)
  }

  static KEY = 'crystal'
}
