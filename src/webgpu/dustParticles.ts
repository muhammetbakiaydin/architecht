import * as THREE from 'three/webgpu';
import {
  attribute,
  uniform,
  positionLocal,
  texture,
  uv,
  vec2,
  vec3,
  clamp,
  smoothstep,
  float,
  mix,
  step,
} from 'three/tsl';

export default class DustParticles {
  #spawnPos: Float32Array = new Float32Array(0);
  #birthLifeSeedScale: Float32Array = new Float32Array(0);
  #currentDustIndex = 0;
  #dustMesh: THREE.InstancedMesh | null = null;
  #MAX_DUST = 400;

  /**
   * @param uTime Seconds on the same clock `spawnDust` stamps into `aBirth`
   *              (`performance.now() / 1000`) - see the note in PetalParticles.
   */
  async initialize(
    perlinTexture: THREE.Texture,
    dustParticleTexture: THREE.Texture,
    uTime: any
  ): Promise<THREE.InstancedMesh> {
    const dustGeometry = new THREE.PlaneGeometry(0.022, 0.022);
    this.#spawnPos = new Float32Array(this.#MAX_DUST * 3);
    this.#birthLifeSeedScale = new Float32Array(this.#MAX_DUST * 4);
    this.#currentDustIndex = 0;

    dustGeometry.setAttribute('aSpawnPos', new THREE.InstancedBufferAttribute(this.#spawnPos, 3));
    dustGeometry.setAttribute('aBirthLifeSeedScale', new THREE.InstancedBufferAttribute(this.#birthLifeSeedScale, 4));

    const material = this.createDustMaterial(perlinTexture, dustParticleTexture, uTime);
    this.#dustMesh = new THREE.InstancedMesh(dustGeometry, material, this.#MAX_DUST);
    this.#dustMesh.frustumCulled = false;
    return this.#dustMesh;
  }

  spawnDust(spawnPos: THREE.Vector3) {
    if (!this.#dustMesh) return;
    if (this.#currentDustIndex >= this.#MAX_DUST) {
      this.#currentDustIndex = 0;
    }
    const id = this.#currentDustIndex;
    this.#currentDustIndex = this.#currentDustIndex + 1;

    this.#spawnPos[id * 3 + 0] = spawnPos.x + (Math.random() - 0.5) * 0.06;
    this.#spawnPos[id * 3 + 1] = spawnPos.y + (Math.random() - 0.5) * 0.06;
    this.#spawnPos[id * 3 + 2] = spawnPos.z + (Math.random() - 0.5) * 0.04;
    this.#birthLifeSeedScale[id * 4 + 0] = performance.now() * 0.001; // Birth time in seconds
    this.#birthLifeSeedScale[id * 4 + 1] = 3.5; // Life duration in seconds
    this.#birthLifeSeedScale[id * 4 + 2] = Math.random(); // Random seed
    this.#birthLifeSeedScale[id * 4 + 3] = Math.random() * 0.5 + 0.5; // Scale

    const attrSpawn = this.#dustMesh.geometry.attributes.aSpawnPos as THREE.InstancedBufferAttribute;
    const attrBirth = this.#dustMesh.geometry.attributes.aBirthLifeSeedScale as THREE.InstancedBufferAttribute;
    if (attrSpawn) attrSpawn.needsUpdate = true;
    if (attrBirth) attrBirth.needsUpdate = true;
  }

  createDustMaterial(
    perlinTexture: THREE.Texture,
    dustTexture: THREE.Texture,
    uTime: any
  ): THREE.MeshBasicNodeMaterial {
    const material = new THREE.MeshBasicNodeMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
    });

    const aSpawnPos = attribute('aSpawnPos', 'vec3');
    const aBirthLifeSeedScale = attribute('aBirthLifeSeedScale', 'vec4');
    const aBirth = aBirthLifeSeedScale.x;
    const aLife = aBirthLifeSeedScale.y;
    const aSeed = aBirthLifeSeedScale.z;
    const aScale = aBirthLifeSeedScale.w;

    // Radiant architectural gold dust
    const uGoldColor = uniform(new THREE.Color('#C99A45'));
    const uAmberColor = uniform(new THREE.Color('#A86F38'));
    const uWindDirection = uniform(new THREE.Vector3(-0.9, 0.25, 0.15).normalize());
    const uWindStrength = uniform(0.36);
    const uRiseSpeed = uniform(0.13);
    const uNoiseScale = uniform(22.0);
    const uNoiseSpeed = uniform(0.016);
    const uWobbleAmp = uniform(0.48);

    const dustAge = uTime.sub(aBirth);
    const lifeInterpolation = clamp(dustAge.div(aLife), 0, 1);

    const randomSeed = vec2(aSeed.mul(123.4), aSeed.mul(567.8));
    const noiseUv = aSpawnPos.xz
      .mul(uNoiseScale)
      .add(randomSeed)
      .add(uWindDirection.xz.mul(dustAge.mul(uNoiseSpeed)));

    const noiseSample = texture(perlinTexture, noiseUv).x;
    const noiseSampleBis = texture(perlinTexture, noiseUv.add(vec2(13.37, 7.77))).x;

    const turbulenceX = noiseSample.sub(0.5).mul(2);
    const turbulenceY = noiseSampleBis.sub(0.5).mul(2);

    const swirl = vec3(turbulenceX.mul(lifeInterpolation), turbulenceY.mul(lifeInterpolation).add(0.1), 0.0).mul(
      uWobbleAmp
    );

    const windImpulse = uWindDirection.mul(uWindStrength).mul(dustAge);
    const riseFactor = clamp(noiseSample.add(0.2), 0.4, 1.2);
    const rise = vec3(0.0, dustAge.mul(uRiseSpeed).mul(riseFactor), 0.0);
    const driftMovement = windImpulse.add(rise).add(swirl);

    const scaleFactor = smoothstep(float(0), float(0.04), lifeInterpolation);
    const fadingOut = float(1.0).sub(smoothstep(float(0.7), float(1.0), lifeInterpolation));

    const dustColor = mix(uGoldColor, uAmberColor, step(float(0.5), aSeed));

    const dustSample = texture(dustTexture, uv());
    material.colorNode = dustColor;
    material.positionNode = aSpawnPos.add(driftMovement).add(positionLocal.mul(aScale.mul(scaleFactor)));
    material.opacityNode = fadingOut.mul(dustSample.a).mul(0.85);

    return material;
  }
}
