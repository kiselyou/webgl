import { calcSpeedTime, randomInt } from '@lib/math'
import TWEEN from '@tweenjs/tween.js'
import objectPath from 'object-path'
import { Vector3 } from 'three'

export default class Engine {
  constructor(options) {
    /**
     * скорость в км/ч
     * @type {number|?}
     */
    this.speed = objectPath.get(options, ['speed'], 4500)

    /**
     * Растояние в км. от карабль до станции перед началом стыковки.
     * @type {number|?}
     * */
    this.dockingLength = objectPath.get(options, ['dockingLength'], 1.2)

    this.animation = new TWEEN.Group()
  }

  static EVENT_START = 'start'
  static EVENT_UPDATE = 'update'
  static EVENT_COMPLETE = 'complete'

  start(position, target, callback) {
    const lookAt = new Vector3()
    const direction = new Vector3()
    const dockPosition = new Vector3()
    const undockPosition = new Vector3()
    const prevPosition = new Vector3().copy(position)
    const startPosition = new Vector3().copy(position)

    direction.copy(target).sub(position).normalize()
    undockPosition.copy(direction).multiplyScalar(this.dockingLength).add(position).setY(0)

    const straightLength = undockPosition.distanceTo(target)
    direction.copy(target).sub(undockPosition).normalize()
    dockPosition.copy(direction).multiplyScalar(straightLength - this.dockingLength).add(position).setY(0)

    callback(Engine.EVENT_START, {
      points: [startPosition, undockPosition, dockPosition, target],
    })

    const distance = startPosition.distanceTo(target)
    let time = calcSpeedTime(distance, this.speed)

    new TWEEN.Tween(position, this.animation)
      .interpolation(TWEEN.Interpolation.Bezier)
      .easing(TWEEN.Easing.Linear.None)
      .to({
        x: [startPosition.x, undockPosition.x, dockPosition.x, target.x],
        y: [startPosition.y, undockPosition.y, dockPosition.y, target.y],
        z: [startPosition.z, undockPosition.z, dockPosition.z, target.z]
      }, time)
      .onUpdate((position) => {
        if (prevPosition.distanceTo(position) === 0) {
          return
        }

        direction.copy(position).sub(prevPosition).normalize()
        prevPosition.copy(position)

        lookAt.copy(direction).multiplyScalar(this.dockingLength).add(position)

        const distanceToTarget = position.distanceTo(target)

        callback(Engine.EVENT_UPDATE, {
          position,
          lookAt: lookAt,
          direction: direction,
          opacity: distanceToTarget <= this.dockingLength
            ? Math.min(distanceToTarget / this.dockingLength, 1)
            : Math.min(startPosition.distanceTo(position) / this.dockingLength, 1)
        })
      })
      .onComplete(() => {
        callback(Engine.EVENT_COMPLETE)
      })
      .start()

  }

  update() {
    this.animation.update()
  }
}
