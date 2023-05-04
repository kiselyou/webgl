import Unit from '@pages/base/Unit'
import objectPath from 'object-path'

export default class UnitSilicon extends Unit {
  constructor(options) {
    super(options)

    /** @type {string|?} */
    this.key = objectPath.get(options, ['key'], 'silicon')

    /** @type {string|?} */
    this.name = objectPath.get(options, ['name'], 'Silicon')

    /** @type {number} */
    this.volume = objectPath.get(options, ['volume'], 5)
  }

  static KEY = 'silicon'
}
