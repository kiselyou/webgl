import * as THREE from 'three'
import {Vector3} from "three";

export default class Fire extends THREE.Mesh {
  constructor() {
    super()

    this.clock = new THREE.Clock()
    // this.geometry = new THREE.PlaneGeometry(10, 10, 1, 1)
    // this.geometry = new THREE.SphereGeometry(6, 34, 34)
    this.geometry = new THREE.CircleGeometry(20, 10)
    // this.geometry = new THREE.BoxGeometry(6, 6, 6)
    // this.geometry = new THREE.CylinderGeometry(6, 6, 16, 30)
    console.log(this.geometry)

    // let viewVector = new THREE.Vector3().subVectors( camera.position, object.glow.getWorldPosition());
    // object.glow.material.uniforms.viewVector.value = viewVector;

    const cameraPosition = new THREE.Vector3(0, 6, 50)
    const objectGlow = new THREE.Vector3()

    this.material = new THREE.ShaderMaterial( {
      uniforms: {
        uPoints: { value: 10 },
        uRadius: { value: 0.01 },
        uGlow: { value: 1.5 },

        uTime: { value: 0.0 },
        uSpeed: { value: 1.5 },
        uDetails: { value: 0.06 },
        uForce: { value: 0.5 },
        uShift: { value: 0.8 },
        uScale: { value: 1.0 },
        uSize: { value: new THREE.Vector2(100.0, 100.0) },
        uResolution: { value: new THREE.Vector2(1.0, 1.0) },
        uViewVector: { value: new Vector3().subVectors(cameraPosition, objectGlow) }
      },

      vertexShader: `
        uniform float uTime;
        uniform float uSpeed;
        uniform float uScale;

        uniform vec3 uViewVector;
        varying float intensity;

        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vNormal = normal;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

          // vec3 actual_normal = vec3(modelMatrix * vec4(normal, 0.0));
          // intensity = pow(dot(normalize(uViewVector), actual_normal), 6.0);
          //
          // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        uniform int uPoints;
        uniform float uRadius;
        uniform float uGlow;
        uniform float uTime;
        uniform float uSpeed;
        uniform float uDetails;
        uniform float uForce;
        uniform float uShift;
        uniform float uScale;
        uniform vec2 uResolution;
        uniform vec2 uSize;

        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;

        varying float intensity;

        #define NUM_OCTAVES 5

        float hash(float n) { return fract(sin(n) * 1e4); }
        // float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

        float noise(vec3 x) {
          const vec3 step = vec3(110, 241, 171);

          vec3 i = floor(x);
          vec3 f = fract(x);

          // For performance, compute the base input to a 1D hash from the integer part of the argument and the
          // incremental change to the 1D based on the 3D -> 1D wrapping
          float n = dot(i, step);

          vec3 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                           mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
                       mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                           mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
        }

        float fbm(vec3 x) {
          float v = 0.0;
          float a = 0.5;
          vec3 shift = vec3(100);
          for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(x);
            x = x * 2.0 + shift;
            a *= 0.5;
          }
          return v;
        }

        float rand(vec2 n) {
          return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }

        float noise(vec2 p){
          vec2 ip = floor(p);
          vec2 u = fract(p);
          u = u*u*(3.0-2.0*u);

          float res = mix(
            mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
            mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
          return res*res;
        }

        float fbm(vec2 x) {
          float v = 0.0;
          float a = 0.5;
          vec2 shift = vec2(100);
          // Rotate to reduce axial bias
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
          for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(x);
            x = rot * x * 2.0 + shift;
            a *= 0.5;
          }
          return v;
        }

        #define PI 3.1415926538

        void main() {
          // 1. Рисуем точки в центре.
          // 2. Движение точек от центра к краю.
          // 3. Чем ближе точка к краю тем она менее видна.


          float noise1 = fbm(vPosition.xy);
          float noise2 = uForce * (fbm(vPosition.xy * uDetails) - (uShift * uTime));

          float radius = uRadius * uScale;
          float pointGlow = uGlow;
          float speed = uTime * uSpeed;
          vec3 color = vec3(0.0, 0.0, 0.0);
          vec3 pointColor = vec3(0.0, 0.0, 0.0);

          vec3 pointColorA = vec3(0.0, 0.5, 0.5);
          vec3 pointColorB = vec3(0.5, 0.0, 0.5);
          vec3 pointColorC = vec3(0.5, 0.5, 0.0);

          vec3 color1 = mix(pointColorA, pointColorB, noise1);
          vec3 color2 = mix(pointColorB, pointColorC, noise2);

          vec2 dir = vec2(vUv - vec2(0.5, 0.5));
          float gradient = clamp(1.0 - length(dir) * 2.0, 0.0, 1.0);

          for (int i = 0; i < uPoints; i++) {
            // Point offset angle
            float piece = (PI * 2.0) / float(uPoints) * float(int(i));
            // Point position
            vec2 pos = vec2(cos(piece), sin(piece)) * speed;

            // Draw point
            float len = smoothstep(radius + pointGlow, radius - pointGlow, length(vPosition.xy - pos));
            // Point color


            color += (pointColor + color2 + color1) * len * gradient;
          }

          gl_FragColor = vec4(color, 1.0);



          // float len = length(normalize(vPosition.xy) * vUv - center);
          // float len = clamp(1.0 - length(vec2(vUv - center)), 0.0, 1.0);

          // vec2 p = vec2(
          //   vPosition.x / radius * sin(center.x),
          //   vPosition.y / radius * cos(center.y)
          // );
          // float len = length(p);

          // float len = smoothstep(radius + 0.005, radius - 0.005, length(vPosition.xy - center));
          // float len = 1.0 - step(radius, length(vPosition.xy - center));
          // float len = length(p);



          // gl_FragColor = vec4(len, len, len, 1.0);
        }
      `,
      // fragmentShader: `
      //   uniform float uTime;
      //   uniform float uSpeed;
      //   uniform float uDetails;
      //   uniform float uForce;
      //   uniform float uShift;
      //   uniform float uScale;
      //   uniform vec2 uResolution;
      //   uniform vec2 uSize;
      //
      //   varying vec3 vPosition;
      //
      //   float rand(vec2 n) {
      //     return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
      //   }
      //
      //   float noise(vec2 p){
      //     vec2 ip = floor(p);
      //     vec2 u = fract(p);
      //     u = u*u*(3.0-2.0*u);
      //
      //     float res = mix(
      //       mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
      //       mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
      //     return res*res;
      //   }
      //
      //   #define NUM_OCTAVES 5
      //
      //   float fbm(vec2 x) {
      //     float v = 0.0;
      //     float a = 0.5;
      //     vec2 shift = vec2(100);
      //     // Rotate to reduce axial bias
      //     mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
      //     for (int i = 0; i < NUM_OCTAVES; ++i) {
      //       v += a * noise(x);
      //       x = rot * x * 2.0 + shift;
      //       a *= 0.5;
      //     }
      //     return v;
      //   }
      //
      //   void main() {
      //
      //
      //     // 1. Смещение
      //     // 2. Шум
      //     // 3. Цвет
      //     // 4. Маска
      //
      //     // float speed = 14.5;
      //     // float details = 0.2;
      //     // float force = 0.4;
      //     // float shift = 0.8;
      //     // float scaleFactor = 2.7;
      //     // 1. Move up
      //     vec2 pos = uDetails * vec2(vPosition.x, vPosition.y - uTime * uSpeed);
      //     // 2. Noise
      //     float noise1 = fbm(pos);
      //     float noise2 = uForce * (fbm(pos + noise1 + uTime) - uShift);
      //
      //     float noise3 = uForce * fbm(vec2(noise1, noise2));
      //     float noise4 = fbm(vec2(noise2, noise1));
      //
      //     // 4. Mask
      //     //vec2 postNorm = normalize(vec2(vPosition.xy));
      //
      //     float postNormX = clamp(((abs(vPosition.x) / uSize.x)) * 26.0, 0.0, 10.0);
      //     float postNormY = (vPosition.y + (uSize.y / 2.0)) / uSize.y;
      //     vec3 gradient = vec3(uScale * postNormY / uResolution.y);
      //
      //     // 3. Color
      //     vec3 red = vec3(0.9, 0.4, 0.2);
      //     vec3 yellow = vec3(1.0, 0.9, 0.0);
      //     vec3 darkRed = vec3(0.4, 0.0, 0.0);
      //     vec3 dark = vec3(0.1, 0.1, 0.1);
      //     vec3 color1 = mix(red, darkRed, noise3 + uShift);
      //     vec3 color2 = mix(yellow, dark, noise4);
      //
      //
      //
      //     gl_FragColor = vec4( vec3(color1 + color2 - gradient - noise2 - postNormX), 1.0 );
      //
      //      if (abs(vPosition.x) >= uSize.x / 2.0 - 0.2 || abs(vPosition.y) >= uSize.y / 2.0 - 0.2) {
      //       gl_FragColor -= vec4(1.0, 1.0, 1.0, 1.0);
      //     }
      //   }
      // `,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,

    })
  }

  update(camera) {
    const time = this.clock.getElapsedTime()
    // this.material.uniforms.uTime.value = time

    // let uViewVector = new THREE.Vector3().subVectors(new Vector3(10, 10, 10), this.getWorldPosition(new THREE.Vector3()))
    let uViewVector = new THREE.Vector3().subVectors(camera.position, this.getWorldPosition(new THREE.Vector3()))
    this.material.uniforms.uViewVector.value = uViewVector
  }
}
