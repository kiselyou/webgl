import Entity from '@pages/base/Entity'

export default class Sector extends Entity {
  constructor() {
    super()

    /** @type {boolean} */
    this.isSector = true

    this.objects3D = []
  }

  add(entity) {
    super.add(entity)
    this.updateVisibleObjects3D()
    return this
  }

  setObject3D(object3D) {
    super.setObject3D(object3D)
    this.updateVisibleObjects3D()
    return this
  }

  del(entity) {
    super.del(entity)
    this.updateVisibleObjects3D()
    return this
  }

  async render() {
    await super.render()
    this.updateVisibleObjects3D()
  }

  findEntityByObject3D(obj) {
    return this.children.find((entity) => {
      return entity.object3D && entity.object3D.uuid === obj.uuid
    }) || null
  }

  updateVisibleObjects3D() {
    this.objects3D = this.children
      .filter((entity) => entity.isEntity && entity.object3D && entity.object3D.visible)
      .map((entity) => entity.object3D)
    return this
  }
}
