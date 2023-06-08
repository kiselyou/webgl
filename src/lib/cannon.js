import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { ConvexHull, Face } from 'three/examples/jsm/math/ConvexHull.js';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry'
import { SimplifyModifier } from 'three/examples/jsm/modifiers/SimplifyModifier'
import {Vector3} from "three";
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export const ss = (obj) => {

  let geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', obj.geometry.getAttribute('position'));


  geometry = mergeVertices(geometry);



  // const position = geometry.attributes.position.array;
  // const normal = obj.geometry.getAttribute('normal').array;

  // const index = geometry.index.array;
  // console.log(normal, index)

  const points = [];
  const faces = [];
  const position = geometry.getAttribute( 'position' );
  console.log(position)
  for ( let i = 0; i < position.count; i += 3 ) {
    points.push(new CANNON.Vec3(position.getX(i + 0), position.getY(i + 0), position.getZ(i + 0)));
    points.push(new CANNON.Vec3(position.getX(i + 1), position.getY(i + 1), position.getZ(i + 1)));
    points.push(new CANNON.Vec3(position.getX(i + 2), position.getY(i + 2), position.getZ(i + 2)));
  }
  // const position = [
  //   -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
  //   -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
  // ];
  // for (let i = 0; i < position.length; i += 3) {
  //   points.push(new CANNON.Vec3(position[i], position[i + 1], position[i + 2]));
  //
  // }
  // const normals = [];
  // for (let i = 0; i < normal.length; i += 3) {
  //   normals.push(new CANNON.Vec3(normal[i], normal[i + 1], normal[i + 2]));
  // }

  const index = geometry.getIndex()
  // console.log(points, index)
  // console.log(index)
  // const index = [
  //   2,1,0,    0,3,2,
  //   0,4,7,    7,3,0,
  //   0,1,5,    5,4,0,
  //   1,2,6,    6,5,1,
  //   2,3,7,    7,6,2,
  //   4,5,6,    6,7,4
  // ];
  for ( let i = 0; i < index.count; i += 3 ) {
    const a = index.getX( i );
    const b = index.getY( i ) || 0;
    const c = index.getZ( i ) || 0;

    faces.push([a, b, c]);
  }
  console.log(points, faces)
  // for (let i = 0; i < index.length; i += 1) {
  //   if (index[i] === undefined || index[i + 1] === undefined || index[i + 2] === undefined) {
  //     break
  //   }
  //   faces.push([index[i], index[i + 1], index[i + 2]]);
  // }

  return new CANNON.ConvexPolyhedron({ vertices: points, faces, /*normals*/ });


  // return new CANNON.ConvexPolyhedron({ vertices, faces, normals })
}

export const getVertices = (geometry) => {
  const position = geometry.getAttribute('position')
  const vertices = []

  for ( let i = 0; i < position.count / position.itemSize; i++ ) {
    const vertex = new THREE.Vector3(
      position.getX(i),
      position.getY(i),
      position.getZ(i)
    )

    vertices.push(vertex)
  }

  return vertices
}
