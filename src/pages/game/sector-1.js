import * as THREE from 'three'
import Owner from '@pages/base/Owner'
import Sector from '@pages/base/Sector'
import Entity from '@pages/base/Entity'
import { station } from '@pages/game/shapes'
import { labelElement } from '@pages/game/labels'
import FactoryEnergy from '@pages/base/factories/FactoryEnergy'
import FactoryCrystal from '@pages/base/factories/FactoryCrystal'
import FactorySilicon from '@pages/base/factories/FactorySilicon'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare'

export const sector = new Sector()
export const owner = new Owner().setName('Player - 1')

export const pointLight = () => {
  const textureLoader = new THREE.TextureLoader()
  const textureFlare3 = textureLoader.load('assets/textures/lensflare3.png')

  const light = new THREE.PointLight(0xffffff, 1, 2000)

  const lensflare = new Lensflare()
  lensflare.addElement(new LensflareElement(textureFlare3, 40, 0.4))
  lensflare.addElement(new LensflareElement(textureFlare3, 50, 0.5))
  lensflare.addElement(new LensflareElement(textureFlare3, 90, 0.9))
  lensflare.addElement(new LensflareElement(textureFlare3, 50, 1))
  light.add(lensflare)
  return light
}

sector
  .setObject3DAsync(async () => {
    const loader  = new THREE.TextureLoader()
    const texture = await loader.loadAsync('/assets/textures/galaxy-5.jpg')
    const geometry = new THREE.SphereGeometry(1024, 15, 15)
    const material = new THREE.MeshPhongMaterial({ map: texture, side: THREE.BackSide })
    const model = new THREE.Mesh(geometry, material)
    model.geometry.rotateY(-Math.PI / 3)
    return model
  })
  .add(
    new Entity()
      .setObject3DAsync(() => {
        const model = station(new THREE.Vector3(0, -.4, -200), { color: 0xFFffff })
        const label = new CSS2DObject(labelElement('Северные врата'))
        label.position.setY(.8)
        model.add(label)
        return model
      })
  )
  .add(
    new Entity()
      .setObject3DAsync(() => {
        const model = station(new THREE.Vector3(-200, -.4, 0), { color: 0xFFffff })
        const label = new CSS2DObject(labelElement('Западные врата'))
        label.position.setY(.8)
        model.add(label)
        return model
      })
  )
  .add(
    new Entity()
      .setObject3DAsync(() => {
        const model = station(new THREE.Vector3(0, -.4, 200), { color: 0xFFffff })
        const label = new CSS2DObject(labelElement('Южные врата'))
        label.position.setY(.8)
        model.add(label)
        return model
      })
  )
  .add(
    new Entity()
      .setObject3DAsync(() => {
        const model = station(new THREE.Vector3(200, -.4, 0), { color: 0xFFffff })
        const label = new CSS2DObject(labelElement('Восточные врата'))
        label.position.setY(.8)
        model.add(label)
        return model
      })
  )
  .add(
    new FactoryEnergy(owner)
      .setObject3DAsync((entity) => {
        const model = station(new THREE.Vector3(-10.5, -.4, 4.2), { color: 0xFF6600 })
        const label = new CSS2DObject(labelElement(entity.name))
        label.position.setY(.8)
        model.add(label)
        return model
      })
  )

sector
  .add(
    new FactoryCrystal(owner)
      .setObject3DAsync((entity) => {
        const model = station(new THREE.Vector3(14.2, -.4, 15.2), { color: 0xFF0000 })
        const label = new CSS2DObject(labelElement(entity.name))
        label.position.setY(.8)
        model.add(label)
        return model
      })
  )

sector
  .add(
    new FactorySilicon(owner)
      .setObject3DAsync((entity) => {
        const model = station(new THREE.Vector3(2.2, -.4, -15.2), { color: 0xFFFF00 })
        const label = new CSS2DObject(labelElement(entity.name))
        label.position.setY(.8)
        model.add(label)
        return model
      })
  )
