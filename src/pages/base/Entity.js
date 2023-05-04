import { Object3D, Mesh, Group } from 'three'
import EventEmitter from 'events'
import Base from '@pages/base/Base'

export default class Entity extends Base {
  constructor(options) {
    super(options)
    /** @type {boolean} */
    this.isEntity = true

    /** @type {Entity|?} */
    this.parent = null

    /** @type {Entity[]} */
    this.children = []

    /**@type {(Object3D|Mesh|Group)}*/
    this.object3D = null

    /** @type {module:events.EventEmitter} */
    this.events = new EventEmitter()

    /**
     * @type {Function[]}
     * @private
     */
    this._asyncChildren = []
    /**
     * @type {Function[]}
     * @private
     */
    this._asyncObjects3D = []
  }

  /**
   *
   * @param {string} event
   * @param {Function} callback
   * @returns {this}
   */
  addEventListener(event, callback) {
    this.events.on(event, callback)
    return this
  }

  /**
   * @param {Entity|Object} entity
   * @returns {this}
   */
  copy(entity) {
    for (let prop in entity) {
      if (this.hasOwnProperty(prop)) {
        this[prop] = entity[prop]
      }
    }
    return this
  }

  /**
   *
   * @param {Entity} entity
   * @returns {this}
   */
  setParent(entity) {
    this.parent = entity
    return this
  }

  /**
   * @param {Entity} entity
   * @returns {this}
   */
  add(entity) {
    this.children.push(entity.setParent(this))
    return this
  }

  /**
   * @callback entityCallback
   * @param {Entity} entity
   */

  /**
   * @param {entityCallback} callback
   * @returns {this}
   */
  addAsync(callback) {
    this._asyncChildren.push(async () => {
      this.add(await callback(this))
    })
    return this
  }

  /**
   *
   * @param {(Object3D|Mesh|Group)} object3D
   * @returns {this}
   */
  setObject3D(object3D) {
    this.object3D = object3D
    return this
  }

  /**
   * @callback object3DCallback
   * @param {Entity} entity
   */

  /**
   *
   * @param {object3DCallback} callback
   * @returns {this}
   */
  setObject3DAsync(callback) {
    this._asyncObjects3D.push(async () => {
      this.setObject3D(await callback(this))
    })
    return this
  }

  /**
   * @param {Entity} entity
   * @returns {this}
   */
  del(entity) {
    const index = this.children.indexOf(entity)
    if (index !== -1) {
      entity.parent = null
      this.children.splice(index, 1)
    }
    return this
  }

  /** @returns {Promise<void>} */
  async render() {
    await this._renderEntities()
    await this._renderObjects3D()
  }

  /**
   * @returns {Promise<void>}
   * @private
   */
  async _renderEntities() {
    for (let func of this._asyncChildren) {
      await func()
    }

    delete this._asyncChildren

    for (let entity of this.children) {
      await entity._renderEntities()
    }
  }

  /**
   * @returns {Promise<void>}
   * @private
   */
  async _renderObjects3D() {
    for (let func of this._asyncObjects3D) {
      await func()
    }

    delete this._asyncObjects3D

    for (let entity of this.children) {
      await entity._renderObjects3D()
    }
  }

  /**
   * @param {number} [time]
   * @returns {void}
   */
  update(time) {
    for (let child of this.children) {
      child.update(time)
    }
  }
}
