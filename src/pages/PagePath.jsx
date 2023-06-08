import React from 'react'
import * as THREE from 'three'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Page from '@pages/Page'
import Playground from '@pages/game/Playground'
import { Pathfinding, PathfindingHelper } from 'three-pathfinding'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { ss } from '@lib/cannon'
import * as CANNON from 'cannon-es'
const SPEED = 5

export default class PageFire extends React.Component {
  constructor(props) {
    super(props)

    this.playground = new Playground()
    this.playground.setPhysicWorldDebugger()

    this.pathfinder = new Pathfinding()
    this.helper = new PathfindingHelper()

    this.playground.scene.add(this.helper)

    this.mouse = new THREE.Vector2()
    this.mouseDown = new THREE.Vector2()
    this.raycaster = new THREE.Raycaster()

    this.playerPosition = new THREE.Vector3(-3.5, 0.5, 5.5)
    this.targetPosition = new THREE.Vector3()

    this.level = null
    this.path = null

    this.state = {

    }
  }

  static propTypes = {

  }

  componentDidMount() {
    const ZONE = 'level-1'
    const OFFSET = 0.2


    let navmesh
    let groupID, path;

    const loader = new GLTFLoader()
    loader.load('assets/models/plane2.gltf', (gltf) => {
      const mesh = gltf.scene.getObjectByName('Cube') || gltf.scene.getObjectByName('Plane')
      console.log(mesh, '++')
      const zone = Pathfinding.createZone(mesh.geometry)
      this.pathfinder.setZoneData( ZONE, zone )

      const shape = ss(mesh)


      const body = new CANNON.Body({ mass: 100, shape, type: CANNON.BODY_TYPES.STATIC })
      body.position.set(0, 0.1, 0)
      console.log(shape, body)
      this.playground.cannonWorld.addBody(body)

      // NavPath helper
      const navWireframe = new THREE.Mesh(mesh.geometry, new THREE.MeshBasicMaterial({
        color: 0x808080,
        wireframe: true,
        depthFunc: THREE.AlwaysDepth
      }))
      this.playground.scene.add(navWireframe)

      navmesh = new THREE.Mesh(mesh.geometry, new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        opacity: 0.05,
        transparent: true,
        depthFunc: THREE.AlwaysDepth
      }))
      navmesh.position.y = 0.001

      this.playground.scene.add(navmesh)
      groupID = this.pathfinder.getGroup(ZONE, this.playerPosition)

      const levelMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        flatShading: true,
        roughness: 1,
        metalness: 0,
        transparent: true,
        opacity: 0.2
      })

      const planeGeometry = new THREE.PlaneGeometry()
      planeGeometry.rotateX(-Math.PI / 2)
      this.level = new THREE.Mesh(planeGeometry, levelMat)
      this.level.scale.set(30, 30, 30)
      this.playground.scene.add(this.level)

      // console.log(navmesh, zone)
    })

    this.helper
      .setPlayerPosition( new THREE.Vector3( -3.5, 0.5, 5.5 ) )
      .setTargetPosition( new THREE.Vector3( -3.5, 0.5, 5.5 ) )

    const onDocumentPointerDown = (event) => {
      this.mouseDown.x = ( event.clientX / window.innerWidth ) * 2 - 1
      this.mouseDown.y = - ( event.clientY / window.innerHeight ) * 2 + 1
    }
    document.addEventListener('pointerdown', onDocumentPointerDown, false)

    const onDocumentPointerUp = (event) => {
      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

      if ( Math.abs( this.mouseDown.x - this.mouse.x ) > 0 || Math.abs( this.mouseDown.y - this.mouse.y ) > 0 ) {
        return; // Prevent unwanted click when rotate camera.
      }

      this.playground.camera.updateMatrixWorld()
      this.raycaster.setFromCamera(this.mouse, this.playground.camera)

      const intersects = this.raycaster.intersectObject(navmesh)

      if ( !intersects.length ) return;

      this.targetPosition.copy( intersects[0].point );

      this.helper
        .reset()
        .setPlayerPosition(this.playerPosition)


      // Teleport on ctrl/cmd click or RMB.
      if (event.metaKey || event.ctrlKey || event.button === 2) {

        this.path = null;
        groupID = this.pathfinder.getGroup(ZONE, this.targetPosition, true);
        const closestNode = this.pathfinder.getClosestNode( this.playerPosition, ZONE, groupID, true );

        this.helper.setPlayerPosition( this.playerPosition.copy( this.targetPosition ) )
        if ( closestNode ) this.helper.setNodePosition( closestNode.centroid );

        return;

      }

      const targetGroupID = this.pathfinder.getGroup( ZONE, this.targetPosition, true );
      const closestTargetNode = this.pathfinder.getClosestNode( this.targetPosition, ZONE, targetGroupID, true );

      this.helper.setTargetPosition( this.targetPosition );
      if (closestTargetNode) {
        this.helper.setNodePosition( closestTargetNode.centroid )
      }

      // Calculate a path to the target and store it
      this.path = this.pathfinder.findPath( this.playerPosition, this.targetPosition, ZONE, groupID );
      console.log(this.path)

      if ( this.path && this.path.length ) {

        this.helper.setPath( this.path );

      } else {

        const closestPlayerNode = this.pathfinder.getClosestNode( this.playerPosition, ZONE, groupID )
        const clamped = new THREE.Vector3()

        // TODO(donmccurdy): Don't clone targetPosition, fix the bug.
        this.pathfinder.clampStep(
          this.playerPosition, this.targetPosition.clone(), closestPlayerNode, ZONE, groupID, clamped )

        this.helper.setStepPosition( clamped )

      }
    }
    document.addEventListener('pointerup', onDocumentPointerUp, false)
  }

  componentWillUnmount() {
    this.playground.destroy()
  }

  render() {
    return (
      <Page
        onMounted={(css, element) => {
          this.playground
            .resize()
            .enableGridHelper(true)
            .appendWebGLElementTo(element, css['page'])
            .animate((dt) => {
              if ( !this.level || !(this.path||[]).length ) return

              let targetPosition = this.path[ 0 ];
              const velocity = targetPosition.clone().sub( this.playerPosition );

              if (velocity.lengthSq() > 0.05 * 0.05) {
                velocity.normalize();
                // Move player to target
                this.playerPosition.add( velocity.multiplyScalar( dt * SPEED ) );
                this.helper.setPlayerPosition( this.playerPosition );
              } else {
                // Remove node from the path we calculated
                this.path.shift();
              }
            })

          window.addEventListener('resize', () => {
            this.playground.resize()
          })
        }}
      >
        <div>sadasd</div>
      </Page>
    )
  }


}
