import FactoryStock from '@pages/base/FactoryStock'
import { randomArrayElement } from '@lib/random'
import Entity from '@pages/base/Entity'
import Timer from '@pages/base/Timer'
import Bank from '@pages/base/Bank'
import objectPath from 'object-path'

export default class Factory extends Entity {
  /**
   * @param {Owner} owner
   * @param {Factory|Object} [options]
   */
  constructor(owner, options) {
    super(options)

    /** @type {boolean} */
    this.isFactory = true

    /** @type {Owner} */
    this.owner = owner

    /** @type {Bank} */
    this.bank = new Bank(objectPath.get(options, ['bank'], {}))

    /** @type {string} */
    this.status = objectPath.get(options, ['status'], Factory.STATUS_WAIT)

    /** @type {Timer} */
    this.timer = new Timer(objectPath.get(options, ['timer'], { time: 60000 }))

    /**
     * Товар который производит фабрика.
     * @type {FactoryStock}
     */
    this.product = new FactoryStock(objectPath.get(options, ['product'], {}))

    /**
     * Ресурсы которые потребляет.
     * @type {FactoryStock[]}
     */
    this.resources = objectPath.get(options, ['resources'], [])
      .map((resource) => new FactoryStock(resource))
  }

  static STATUS_WAIT = 'wait'
  static STATUS_BUILD = 'build'

  static EVENT_BUILD_START = 'start'
  static EVENT_BUILD_FINISH = 'finish'
  static EVENT_BUILD_PROCESS = 'process'

  /**
   * @param {FactoryStock} factoryStock
   * @returns {this}
   */
  setProduct(factoryStock) {
    this.product = factoryStock
    return this
  }

  /**
   * @param {FactoryStock} factoryStock
   * @returns {this}
   */
  addResource(factoryStock) {
    this.resources.push(factoryStock)
    return this
  }

  /**
   * @param {Timer} timer
   * @returns {this}
   */
  setTimer(timer) {
    this.timer = timer
    return this
  }

  /**
   * @param {Bank} bank
   * @returns {this}
   */
  setBank(bank) {
    this.bank = bank
    return this
  }

  /**
   * @param {Owner} owner
   * @returns {this}
   */
  setOwner(owner) {
    this.owner = owner
    return this
  }

  /**
   * @param {string} key
   * @returns {FactoryStock|null}
   */
  findResourceByKey(key) {
    return this.resources.find((resource) => resource.unitBox.unit.key === key) || null
  }

  /**
   * Список ресурсов которых не хватает как минимум для одной итерции строительства.
   * @returns {FactoryStock[]}
   */
  findEmptyResources() {
    return this.resources.filter((resource) => {
      return resource.unitBox.value < resource.quantity
    })
  }

  /**
   * Ресурс которого не хватает для строительста.
   * Ресурс который заполнен ниже максимума.
   * @returns {FactoryStock}
   */
  selectPreferredResource() {
    let resources = this.findEmptyResources()

    if (resources.length > 0) {
      return randomArrayElement(resources)
    }

    resources = this.resources
      .filter((resources) => resources.unitBox.volume < resources.volume)
      .sort((a, b) => a.unitBox.volume < b.unitBox.volume ? -1 : 1)

    return randomArrayElement(resources)
  }

  /**
   * TRUE - если хватает ресурсов для строительства.
   * @returns {boolean}
   */
  hasBuildResources() {
    const resources = this.findEmptyResources()
    return resources.length === 0
  }

  /**
   *
   * @param {number} [time]
   * @returns {void}
   */
  update(time) {
    super.update(time)

    if (this.status === Factory.STATUS_WAIT) {
      if (this.hasBuildResources()) {
        this.timer.start()
        this.status = Factory.STATUS_BUILD
        for (let resource of this.resources) {
          resource.unitBox.decrease(resource.quantity)
        }
        this.events.emit(Factory.EVENT_BUILD_START, this)
        return
      }
    }

    if (this.status === Factory.STATUS_BUILD) {
      const { tick, percentFloor, isExpired } = this.timer.update()
      const value = this.product.unitBox.value + this.product.quantity

      if (isExpired && value <= this.product.countMax) {
        this.status = Factory.STATUS_WAIT
        this.product.unitBox.increase(this.product.quantity)
        this.events.emit(Factory.EVENT_BUILD_FINISH, this)
      } else if (percentFloor < 100 && tick) {
        this.events.emit(Factory.EVENT_BUILD_PROCESS, this)
      }
    }
  }
}
