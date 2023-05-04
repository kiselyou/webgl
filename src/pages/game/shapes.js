import React from 'react'
import * as THREE from 'three'

const material = new THREE.ShaderMaterial( {
  uniforms: {
    time: { value: 1.0 },
    resolution: { value: new THREE.Vector2(1, 1) },
    color: { value: new THREE.Color(1, 0, 0) },
    center: { value: new THREE.Vector2( 0.5, 0.5 ) },
    rotation: { value: 0.0 }
  },

  vertexShader: `
    precision mediump float;
    precision mediump int;

    // uniform vec3 scale;
    uniform float rotation;
    uniform vec2 center;

    uniform vec3 color;
    // attribute vec4 color;


    varying vec3 vPosition;
    varying vec4 vColor;


    void main() {
      vColor = vec4(color, 1.0);
      vPosition = position;

      // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      vec2 scale;
        scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
        scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );

      vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
      vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;

      vec2 rotatedPosition;
      rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
      rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;

      mvPosition.xy += rotatedPosition;

	    gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `

    uniform float time;
    uniform vec2 resolution;
    // uniform vec3 color;

    varying vec4 vColor;
    varying vec3 vPosition;

    void main() {
      vec2 uv = (vPosition.xy / resolution.x);
      vec2 center = vec2(0.5 ,0.5 * (resolution.y / resolution.x));


      vec2 light1 = vec2(
        cos(time) * -0.5,
        cos(time) * 0.5
      );

      // vec2 light1 = vec2(0, 0);
      vec3 lightColor1 = vec3(
        clamp(cos(time * 3.5), 0.1, 1.0),
        0.1,
        0.1
      );


      // vec2 light2 = vec2(sin(time + 3.0) * -2.0, cos(time + 7.0) * 1.0) * 0.2 + center;
      // vec3 lightColor2 = vec3(0.3, 1.0, 0.3);
      //
      // vec2 light3 = vec2(sin(time + 3.0) * 2.0, cos(time + 14.0) * -1.0) * 0.2 + center;
      // vec3 lightColor3 = vec3(0.3, 0.3, 1.0);

      float dist1 = distance(uv, light1);
      float cloudIntensity1 = 0.7 * (1.0 - (2.5 * distance(uv, light1)));
      float lightIntensity1 = 5.1 / (50.0 * dist1);

      // float cloudIntensity2 = 0.7 * (1.0 - (2.5 * distance(uv, light2)));
      // float lightIntensity2 = 1.0 / (100.0 * distance(uv, light2));
      //
      // float cloudIntensity3 = 0.7 * (1.0 - (2.5 * distance(uv, light3)));
      // float lightIntensity3 = 1.0 / (100.0 * distance(uv, light3));

      gl_FragColor =
        vec4(
          vec3(cloudIntensity1) * lightColor1
        + lightIntensity1 * lightColor1,
          1.0
        );

      // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

      // float d = length(uv) - 10.2;
      // vec3 col = vec3(step(0., -d));
      //
      //
      // float glow = 0.05 / d;
      // glow = clamp(glow * 5.0, 0., 1.0);
      // col += glow;
      //
      //
      // // vec3 c = vec3(1.0, 0., 0.);
      // // float o = clamp(-d, 0.0, 1.0);
      // gl_FragColor = vec4(col * vColor.xyz, 1.0);
    }
  `,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  depthTest: false,
  transparent: true,

})

export const ship = (pos, params) => {
  const target = new THREE.Vector3(4, 0, 14)
  const cylinderGeometry = new THREE.CylinderGeometry(.1, .1, .4)
  const cylinderMaterial = new THREE.MeshLambertMaterial({ depthFunc: THREE.AlwaysDepth, transparent: true, opacity: 0, ...params })
  const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
  cylinder.position.copy(pos)
  cylinder.geometry.rotateX(Math.PI / 2)
  cylinder.lookAt(target)
  return cylinder
}

export const station = (pos, params) => {
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
  const boxMaterial = new THREE.MeshLambertMaterial({ ...params })
  const box = new THREE.Mesh(boxGeometry, boxMaterial)
  box.position.copy(pos)
  return box
}

export const line = (pos, params) => {
  // const geometry = new THREE.BufferGeometry()
  // const positions = [];
  // const colors = [];
  //
  // // // adding x,y,z
  // positions.push( -10 );
  // positions.push( 5 );
  // positions.push( 5 );
  //
  // positions.push( 10 );
  // positions.push( 5 );
  // positions.push( 5 );
  // //
  // // adding r,g,b,a
  // colors.push( Math.random() * 255 );
  // colors.push( Math.random() * 255 );
  // colors.push( Math.random() * 255 );
  // colors.push( Math.random() * 255 );
  //
  // colors.push( Math.random() * 255 );
  // colors.push( Math.random() * 255 );
  // colors.push( Math.random() * 255 );
  // colors.push( Math.random() * 255 );
  //
  // for ( let i = 0; i < 2; i ++ ) {
  //
  //   // adding x,y,z
  //
  //   // positions.push( THREE.MathUtils.randInt(-10, 10) );
  //   // positions.push( THREE.MathUtils.randInt(-10, 10) );
  //   // positions.push( THREE.MathUtils.randInt(-10, 10) );
  //   //
  //   // // adding r,g,b,a
  //   // colors.push( Math.random() * 255 );
  //   // colors.push( Math.random() * 255 );
  //   // colors.push( Math.random() * 255 );
  //   // colors.push( Math.random() * 255 );
  //
  // }

  // console.log(positions)
  // const positionAttribute = new THREE.Float32BufferAttribute( positions, 3 );
  // const colorAttribute = new THREE.Uint8BufferAttribute( colors, 4 );
  // colorAttribute.normalized = true; // this will map the buffer values to 0.0f - +1.0f in the shader
  const geometry = new THREE.PlaneGeometry(10, 10, 1, 1)
  // const geometry = new THREE.SphereGeometry(10, 10, 10)
  // // geometry.setAttribute( 'position', positionAttribute );
  // geometry.setAttribute( 'color', colorAttribute );



  // const mesh = new THREE.Sprite(material)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.copy(pos)

  setInterval(() => {
    const time = performance.now();
    // mesh.rotation.y = time * 0.0005;
    mesh.material.uniforms.time.value = time * 0.001;
    mesh.position.x = (Math.cos(time * 0.001) * 5);
    mesh.position.y = (Math.sin(time * 0.001) * 5);
  }, 1000 / 60)

  return mesh
}
