import Base from '@pages/base/Base'
import Bank from '@pages/base/Bank'
import objectPath from 'object-path'

export default class Owner extends Base {
  constructor(options) {
    super(options)

    /** @type {boolean} */
    this.isOwner = true

    /** @type {Bank} */
    this.bank = new Bank(objectPath.get(options, ['bank'], {}))
  }
}
