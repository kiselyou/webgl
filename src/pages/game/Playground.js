import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'

import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry'
import { SimplifyModifier } from 'three/examples/jsm/modifiers/SimplifyModifier'

export default class Playground {
  constructor() {
    this.funcs = []
    this.updates = []

    this.clock = new THREE.Clock()
    this.scene = new THREE.Scene()
    this.cannonWorld = new CANNON.World()
    this.cannonWorld.gravity.set(0, -20, 0)

    // Tweak contact properties.
    // Contact stiffness - use to make softer/harder contacts
    this.cannonWorld.defaultContactMaterial.contactEquationStiffness = 1e8
    // Stabilization time in number of timesteps
    this.cannonWorld.defaultContactMaterial.contactEquationRelaxation = 10


    // const groundShape = new CANNON.Plane()
    // const groundBody = new CANNON.Body({ mass: 0, shape: groundShape })
    // groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    // groundBody.position.set(0, 0.11, 0)
    // this.cannonWorld.addBody(groundBody)

    // Sphere 1

    // const boxPlaneShape = new CANNON.Box(new CANNON.Vec3(10, 0.1, 10))
    // const boxPlaneBody = new CANNON.Body({ mass: 200, type: CANNON.BODY_TYPES.KINEMATIC })
    // boxPlaneBody.addShape(boxPlaneShape)
    // boxPlaneBody.position.set(0, 0, 0)
    // // boxPlaneBody.velocity.set(0, 0, 0)
    // // boxPlaneBody.linearDamping = 0
    // this.cannonWorld.addBody(boxPlaneBody)

    // const planeGeometry = new THREE.PlaneGeometry(10, 10)
    // const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 })
    // const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
    // planeMesh.setRotationFromQuaternion(groundBody.quaternion)
    // planeMesh.position.copy(groundBody.position)
    // this.scene.add(planeMesh)


    // Sphere 1
    // const sphereShape = new CANNON.Sphere(1)
    // const body1 = new CANNON.Body({ mass: 5 })
    // body1.addShape(sphereShape)
    // body1.position.set(-2.5, 30, 1.2)
    // // body1.velocity.set(0, 0, 0)
    // // body1.linearDamping = 0.05
    // this.cannonWorld.addBody(body1)

    // const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
    // const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 })
    // const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
    // sphereMesh.position.copy(body1.position)
    // this.scene.add(sphereMesh)
    //
    // this.updates.push(() => {
    //   sphereMesh.position.copy(body1.position)
    // })

    // Sphere 1
    const v = new CANNON.Vec3(0.5, 1.5, 0.5)
    const boxShape = new CANNON.Box(v)
    const body2 = new CANNON.Body({ mass: 2 })
    body2.addShape(boxShape)
    body2.position.set(-2.5, 10, 0)
    // body2.velocity.set(0, 0, 0)
    // body2.linearDamping = 0.05
    this.cannonWorld.addBody(body2)

    // Sphere 1
    // const cylinderShape = new CANNON.Cylinder(0.5, 1.5, 1, 10)
    // const body3 = new CANNON.Body({ mass: 19 })
    // body3.addShape(cylinderShape)
    // body3.position.set(-2.5, 25, 1.2)
    // // body3.velocity.set(0, 0, 0)
    // // body3.linearDamping = 0.05
    // this.cannonWorld.addBody(body3)

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 5000)
    this.camera.position.set(0, 6, 50)

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
    this.funcs.push(() => this.controls.dispose())

    this.ambientLightTop = new THREE.AmbientLight(0x60caeb, .8)
    this.ambientLightTop.castShadow = true
    this.ambientLightTop.position.set(500, -500, 100)
    this.scene.add(this.ambientLightTop)

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
  }

  setPhysicWorldDebugger() {
    const cannonWorldDebugger = new CannonDebugger(this.scene, this.cannonWorld, {})
    this.updates.push(() => cannonWorldDebugger.update())
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
    return this
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
    this.camera.updateMatrixWorld()
    this.raycaster.setFromCamera(this.pointer, this.camera)
    return this.raycaster.intersectObjects(objects, false)
  }

  /**
   * @param {Function} callback
   * @returns {Playground}
   */
  animate(callback) {
    let requestID = null
    const animate = () => {
      requestID = requestAnimationFrame(animate)
      const dt = this.clock.getDelta()

      if (dt) {
        callback(dt)
      }

      this.controls.update()
      this.cannonWorld.step(dt)

      for (let update of this.updates) {
        update(dt)
      }

      this.rendererWebGL.render(this.scene, this.camera)
      this.rendererLabel.render(this.scene, this.camera)
    }
    animate()
    this.funcs.push(() => cancelAnimationFrame(requestID))
    return this
  }

  destroy() {
    for (let func of this.funcs) {
      func()
    }
    return this
  }
}
