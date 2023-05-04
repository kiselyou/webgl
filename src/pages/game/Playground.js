import * as THREE from 'three'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'

import { line } from './shapes'

export default class Playground {
  constructor() {
    this.clock = new THREE.Clock()
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 5000)
    this.camera.position.set(0, 6, 24)

    this.rendererWebGL = new THREE.WebGLRenderer({ canvas: document.createElement('canvas'), antialias: true })
    this.rendererWebGL.outputColorSpace = THREE.SRGBColorSpace
    this.rendererLabel = new CSS2DRenderer()

    this.controls = new MapControls(this.camera, this.rendererWebGL.domElement)
    this.controls.minPolarAngle = THREE.MathUtils.degToRad(45)
    this.controls.maxPolarAngle = THREE.MathUtils.degToRad(90)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.minDistance = 5
    this.controls.maxDistance = 50

    this.ambientLightTop = new THREE.AmbientLight(0x60caeb, .8)
    this.ambientLightTop.castShadow = true
    this.ambientLightTop.position.set(500, -500, 100)
    this.scene.add(this.ambientLightTop)
    //
    this.ambientLightBottom = new THREE.AmbientLight(0xFFFFFF, 0.4)
    this.ambientLightBottom.castShadow = true
    this.ambientLightBottom.position.set(-500, 500, -100)
    this.scene.add(this.ambientLightBottom)

    this.directionalLightTop = new THREE.DirectionalLight(0xffffff, .8)
    this.directionalLightTop.castShadow = true
    this.directionalLightTop.position.set(500, -500, 100)
    this.scene.add(this.directionalLightTop)

    this.directionalLightBottom = new THREE.DirectionalLight(0xffffff, .2)
    this.directionalLightBottom.castShadow = true
    this.directionalLightBottom.position.set(-500, 500, -100)
    this.scene.add(this.directionalLightBottom)

    this.pointer = new THREE.Vector2()
    this.raycaster = new THREE.Raycaster()

    /**
     * x - red, y - green, z - blue
     * @type {AxesHelper}
     */
    this.axisHelper = new THREE.AxesHelper(20)
    this.axisHelper.position.setY(0.01)

    this.gridHelper = new THREE.GridHelper(80, 20, 0xFFFFFF)

    this.scene.add(line(new THREE.Vector3(1, 0, 1)))
    // this.scene.add(line(new THREE.Vector3(1, 0, 2)))
    // this.scene.add(line(new THREE.Vector3(1, 0, 3)))
    //
    // this.scene.add(line(new THREE.Vector3(2, 0, 1)))
    // this.scene.add(line(new THREE.Vector3(2, 0, 2)))
    // this.scene.add(line(new THREE.Vector3(2, 0, 3)))

  }

  /**
   * @param {boolean} [value]
   * @returns {this}
   */
  enableAxisHelper(value = true) {
    value
      ? this.scene.add(this.axisHelper)
      : this.scene.remove(this.axisHelper)
    return this
  }

  /**
   * @param {boolean} [value]
   * @returns {this}
   */
  enableGridHelper(value = true) {
    value
      ? this.scene.add(this.gridHelper)
      : this.scene.remove(this.gridHelper)
    return this
  }

  /** @returns {Playground} */
  resize() {
    const x = window.innerWidth
    const y = window.innerHeight
    this.camera.aspect = x / y
    this.camera.updateProjectionMatrix()
    this.rendererWebGL.setSize(x, y)
    this.rendererLabel.setSize(x, y)
    return this
  }

  /**
   * @param {HTMLElement} container
   * @param {string} className
   * @returns {Playground}
   */
  appendWebGLElementTo(container, className) {
    this.rendererWebGL.setSize(window.innerWidth, window.innerHeight)
    this.rendererWebGL.domElement.classList.add(className)
    container.appendChild(this.rendererWebGL.domElement)
  }

  /**
   * @param {HTMLElement} container
   * @param {string} className
   * @returns {Playground}
   */
  appendLabelElementTo(container, className) {
    this.rendererLabel.setSize(window.innerWidth, window.innerHeight)
    this.rendererLabel.domElement.classList.add(className)
    container.appendChild(this.rendererLabel.domElement)
    return this
  }

  /**
   * @param {MouseEvent} event
   * @returns {Playground}
   */
  mouseMove(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1
    return this
  }

  /**
   *
   * @param {(Mesh|Group|Object3D)[]} objects
   * @returns {[]}
   */
  intersections(objects) {
    this.raycaster.setFromCamera(this.pointer, this.camera)
    return this.raycaster.intersectObjects(objects, false)
  }

  /**
   * @param {Function} callback
   * @returns {Playground}
   */
  animate(callback) {
    const animate = () => {
      requestAnimationFrame(animate)
      const time = this.clock.getDelta()

      if (time) {
        callback(time)
      }

      this.controls.update()
      this.rendererWebGL.render(this.scene, this.camera)
      this.rendererLabel.render(this.scene, this.camera)
    }
    animate()
    return this
  }
}
