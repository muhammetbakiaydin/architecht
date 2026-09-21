import * as THREE from 'three/webgpu';
import {
  attribute,
  uniform,
  positionLocal,
  texture,
  uv,
  mix,
  normalLocal,
  normalize,
  abs,
  dot,
  vec2,
  vec3,
  clamp,
  smoothstep,
  float,
  pow,
  cos,
  sin,
  mat3,
  step,
  TWO_PI,
} from 'three/tsl';

export default class PetalParticles {
  #spawnPos: Float32Array = new Float32Array(0);
  #birthLifeSeedScale: Float32Array = new Float32Array(0);
  #currentPetalIndex = 0;
  #petalMesh: THREE.InstancedMesh | null = null;
  #MAX_PETAL = 600;

  /**
   * @param uTime  Seconds on the SAME clock that `spawnPetal` stamps into
   *               `aBirth` (i.e. `performance.now() / 1000`). Do not swap this
   *               for TSL's `time` node: that one counts from the renderer's
   *               first frame, so `time - aBirth` came out negative by however
   *               long start-up took and every petal stayed invisible until the
   *               clocks crossed - seconds after the scroll that spawned it.
   */
  async initialize(
    perlinTexture: THREE.Texture,
    petalGeometry: THREE.BufferGeometry,
    uTime: any
  ): Promise<THREE.InstancedMesh> {
    const petalGeo = petalGeometry.clone();
    // Refined, smaller and elegant petal size (0.085)
    const scale = 0.085;
    petalGeo.scale(scale, scale, scale);

    this.#spawnPos = new Float32Array(this.#MAX_PETAL * 3);
    this.#birthLifeSeedScale = new Float32Array(this.#MAX_PETAL * 4);
    this.#currentPetalIndex = 0;

    petalGeo.setAttribute('aSpawnPos', new THREE.InstancedBufferAttribute(this.#spawnPos, 3));
    petalGeo.setAttribute('aBirthLifeSeedScale', new THREE.InstancedBufferAttribute(this.#birthLifeSeedScale, 4));

    const material = this.createPetalMaterial(perlinTexture, uTime);
    this.#petalMesh = new THREE.InstancedMesh(petalGeo, material, this.#MAX_PETAL);
    this.#petalMesh.frustumCulled = false;
    return this.#petalMesh;
  }

  spawnPetal(spawnPos: THREE.Vector3, direction = 1) {
    if (!this.#petalMesh) return;
    if (this.#currentPetalIndex >= this.#MAX_PETAL) {
      this.#currentPetalIndex = 0;
    }
    const id = this.#currentPetalIndex;
    this.#currentPetalIndex = this.#currentPetalIndex + 1;

    // Slight organic offset
    this.#spawnPos[id * 3 + 0] = spawnPos.x + (Math.random() - 0.5) * 0.03;
    this.#spawnPos[id * 3 + 1] = spawnPos.y + (Math.random() - 0.5) * 0.03;
    this.#spawnPos[id * 3 + 2] = spawnPos.z + (Math.random() - 0.5) * 0.03;
    
    this.#birthLifeSeedScale[id * 4 + 0] = performance.now() * 0.001; // Birth time in seconds
    this.#birthLifeSeedScale[id * 4 + 1] = direction >= 0 ? 4.2 : 3.0; // Life duration
    this.#birthLifeSeedScale[id * 4 + 2] = Math.random(); // Random seed
    this.#birthLifeSeedScale[id * 4 + 3] = Math.random() * 0.35 + 0.65; // Scale

    const attrSpawn = this.#petalMesh.geometry.attributes.aSpawnPos as THREE.InstancedBufferAttribute;
    const attrBirth = this.#petalMesh.geometry.attributes.aBirthLifeSeedScale as THREE.InstancedBufferAttribute;

    if (attrSpawn) attrSpawn.needsUpdate = true;
    if (attrBirth) attrBirth.needsUpdate = true;
  }

  createPetalMaterial(perlinTexture: THREE.Texture, uTime: any): THREE.MeshBasicNodeMaterial {
    const material = new THREE.MeshBasicNodeMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    function rotX(a: any) {
      const c = cos(a);
      const s = sin(a);
      const ns = s.mul(-1.0);
      return mat3(1.0, 0.0, 0.0, 0.0, c, ns, 0.0, s, c);
    }

    function rotY(a: any) {
      const c = cos(a);
      const s = sin(a);
      const ns = s.mul(-1.0);
      return mat3(c, 0.0, s, 0.0, 1.0, 0.0, ns, 0.0, c);
    }

    function rotZ(a: any) {
      const c = cos(a);
      const s = sin(a);
      const ns = s.mul(-1.0);
      return mat3(c, ns, 0.0, s, c, 0.0, 0.0, 0.0, 1.0);
    }

    const aSpawnPos = attribute('aSpawnPos', 'vec3');
    const aBirthLifeSeedScale = attribute('aBirthLifeSeedScale', 'vec4');
    const aBirth = aBirthLifeSeedScale.x;
    const aLife = aBirthLifeSeedScale.y;
    const aSeed = aBirthLifeSeedScale.z;
    const aScale = aBirthLifeSeedScale.w;

    // Elegant, gentle wind and natural float
    const uWindDirection = uniform(new THREE.Vector3(-0.9, 0.25, 0.15).normalize());
    const uWindStrength = uniform(0.38);
    const uRiseSpeed = uniform(0.14);
    const uNoiseScale = uniform(22.0);
    const uNoiseSpeed = uniform(0.016);
    const uWobbleAmp = uniform(0.48);

    const uBendAmount = uniform(2.2);
    const uBendSpeed = uniform(1.1);
    const uSpinSpeed = uniform(2.2);
    const uSpinAmp = uniform(0.48);

    // Deep luxurious scarlet & velvety crimson
    const uRedColor = uniform(new THREE.Color('#8B1117'));
    const uCarmineColor = uniform(new THREE.Color('#AB1822'));
    const uDeepShadowColor = uniform(new THREE.Color('#54080D'));
    const uIvoryColor = uniform(new THREE.Color('#FAF4EB'));
    const uLightPosition = uniform(new THREE.Vector3(1.5, 2.5, 4));

    // Age of particle
    const dustAge = uTime.sub(aBirth);
    const lifeInterpolation = clamp(dustAge.div(aLife), 0, 1);

    // Procedural noiseUV
    const randomSeed = vec2(aSeed.mul(123.4), aSeed.mul(567.8));
    const noiseUv = aSpawnPos.xz
      .mul(uNoiseScale)
      .add(randomSeed)
      .add(uWindDirection.xz.mul(dustAge.mul(uNoiseSpeed)));

    const noiseSample = texture(perlinTexture, noiseUv).x;
    const noiseSampleBis = texture(perlinTexture, noiseUv.add(vec2(13.37, 7.77))).x;

    // Turbulence vectors [-1, 1]
    const turbulenceX = noiseSample.sub(0.5).mul(2);
    const turbulenceY = noiseSampleBis.sub(0.5).mul(2);
    const turbulenceZ = noiseSample.sub(0.5).mul(2);

    const swirl = vec3(
      turbulenceX.mul(lifeInterpolation),
      turbulenceY.mul(lifeInterpolation).add(0.1),
      turbulenceZ.mul(lifeInterpolation)
    ).mul(uWobbleAmp);

    // Dynamic 3D Petal Bending
    const y = uv().y;
    const bendWeight = pow(y, float(2.5));
    const bend = bendWeight.mul(uBendAmount).mul(sin(dustAge.mul(uBendSpeed.mul(noiseSample))));
    const B = rotX(bend);

    const windImpulse = uWindDirection.mul(uWindStrength).mul(dustAge);
    const riseFactor = clamp(noiseSample.add(0.2), 0.4, 1.2);
    const rise = vec3(0.0, dustAge.mul(uRiseSpeed).mul(riseFactor), 0.0);
    const driftMovement = windImpulse.add(rise).add(swirl);

    // 3D Rotational Tumbling in the wind
    const baseX = aSeed.mul(1.13).mod(1.0).mul(TWO_PI);
    const baseY = aSeed.mul(2.17).mod(1.0).mul(TWO_PI);
    const baseZ = aSeed.mul(3.31).mod(1.0).mul(TWO_PI);

    const spin = dustAge.mul(uSpinSpeed).mul(uSpinAmp);
    const rx = baseX.add(spin.mul(1.0).mul(turbulenceX.add(1.2)));
    const ry = baseY.add(spin.mul(1.2).mul(turbulenceY.add(1.2)));
    const rz = baseZ.add(spin.mul(0.8).mul(turbulenceZ.add(1.2)));

    const R = rotY(ry).mul(rotX(rx)).mul(rotZ(rz));

    // Scale lifecycle: quick smooth entry and long graceful fade
    const scaleFactor = smoothstep(float(0), float(0.04), lifeInterpolation);
    const fadingOut = float(1.0).sub(smoothstep(float(0.70), float(1.0), lifeInterpolation));

    // Updated local position & normals
    const positionLocalUpdated = R.mul(B.mul(positionLocal));
    const normalUpdate = normalize(R.mul(B.mul(normalLocal)));

    // World position computation
    const worldPosition = aSpawnPos.add(driftMovement).add(positionLocalUpdated.mul(aScale.mul(scaleFactor)));

    // Color variation
    const isCarmine = step(float(0.4), aSeed);
    const isDeep = step(float(0.75), aSeed);
    const isIvory = step(float(0.88), aSeed);

    const baseRed = mix(uRedColor, uCarmineColor, isCarmine);
    const shadedRed = mix(baseRed, uDeepShadowColor, isDeep);
    const petalColor = mix(shadedRed, uIvoryColor, isIvory);

    const lightDirection = normalize(uLightPosition.sub(worldPosition));
    const facing = clamp(abs(dot(normalUpdate, lightDirection)), 0.45, 1.0);

    material.colorNode = petalColor.mul(facing);
    material.positionNode = worldPosition;
    material.opacityNode = fadingOut;

    return material;
  }
}
