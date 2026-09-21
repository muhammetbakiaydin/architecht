import * as THREE from 'three/webgpu';
import MSDFText from './msdfText';
import DustParticles from './dustParticles';
import PetalParticles from './petalParticles';
import { uniform } from 'three/tsl';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface ExperienceCallbacks {
  onProgressUpdate?: (progress: number) => void;
  onError?: (err: Error) => void;
}

export class GommageExperience {
  #renderer: any = null;
  #scene: THREE.Scene | null = null;
  #camera: THREE.PerspectiveCamera | null = null;
  #container: HTMLElement | null = null;

  #uProgress = uniform(0.0);
  // One clock for everything. Particle birth stamps and the shader both read
  // `performance.now() / 1000`, so `uTime - aBirth` is a true age.
  #uTime = uniform(0.0);
  #currentProgress = 0.0;
  #targetProgress = 0.0;
  #spawnAccumulator = 0.0;
  #scrollVelocity = 0.0;
  #visible = true;
  #resizeObserver: ResizeObserver | null = null;

  #msdfTextEntity: MSDFText | null = null;
  #dustParticlesEntity: DustParticles | null = null;
  #petalParticlesEntity: PetalParticles | null = null;

  #rafId: number | null = null;
  #disposed = false;

  #mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  #callbacks: ExperienceCallbacks = {};
  #textString = 'EMRE MERIC';

  constructor(callbacks: ExperienceCallbacks = {}, textString = 'EMRE MERIC') {
    this.#callbacks = callbacks;
    this.#textString = textString;
  }

  async initialize(container: HTMLElement) {
    this.#container = container;

    try {
      await this.#setupRenderer(container);
      await this.#setupScene();

      window.addEventListener('resize', this.#onResize, false);
      window.addEventListener('mousemove', this.#onMouseMove, { passive: true });

      this.#startRenderLoop();
    } catch (err: any) {
      console.error('Failed to initialize GommageExperience:', err);
      this.#callbacks.onError?.(err);
      throw err;
    }
  }

  async #setupRenderer(container: HTMLElement) {
    this.#renderer = new THREE.WebGPURenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    await this.#renderer.init();

    this.#renderer.shadowMap.enabled = false;
    // ACES turned the cream backdrop into cold grey and desaturated the petals.
    // The canvas is transparent instead, so the page's own `bg-radial-cream`
    // gradient (plus the grain overlay) is the backdrop and can never drift
    // out of sync with the rest of the section.
    this.#renderer.toneMapping = THREE.NoToneMapping;
    this.#renderer.setClearColor(0x000000, 0);
    this.#renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.innerHTML = '';
    container.appendChild(this.#renderer.domElement);

    const { width, height } = this.#getSize();
    this.#renderer.setSize(width, height);

    this.#camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 30);
    this.#camera.position.set(0, 0, 5.0);
    this.#updateCameraFov();

    // Size to the container, not the window: during mount the container can
    // still be 0x0, which made WebGPU complain about a zero-sized swapchain.
    if (typeof ResizeObserver !== 'undefined') {
      this.#resizeObserver = new ResizeObserver(this.#onResize);
      this.#resizeObserver.observe(container);
    }
  }

  #getSize() {
    const width = this.#container?.clientWidth || window.innerWidth;
    const height = this.#container?.clientHeight || window.innerHeight;
    return { width: Math.max(1, width), height: Math.max(1, height) };
  }

  async #setupScene() {
    this.#scene = new THREE.Scene();

    const { perlinTexture, dustParticleTexture, fontAtlasTexture } = await this.#loadTextures();
    const petalGeometry = await this.#loadPetalGeometry();

    // 1. MSDF Text Entity ("EMRE MERIC")
    this.#msdfTextEntity = new MSDFText();
    const msdfTextMesh = await this.#msdfTextEntity.initialize(
      this.#textString,
      new THREE.Vector3(0, 0, 0),
      this.#uProgress,
      perlinTexture,
      fontAtlasTexture
    );
    this.#scene.add(msdfTextMesh);

    // 2. Petal Particles Entity
    this.#petalParticlesEntity = new PetalParticles();
    const petalParticlesMesh = await this.#petalParticlesEntity.initialize(
      perlinTexture,
      petalGeometry,
      this.#uTime
    );
    this.#scene.add(petalParticlesMesh);

    // 3. Dust Particles Entity
    this.#dustParticlesEntity = new DustParticles();
    const dustParticlesMesh = await this.#dustParticlesEntity.initialize(
      perlinTexture,
      dustParticleTexture,
      this.#uTime
    );
    this.#scene.add(dustParticlesMesh);

    // Ambient light accent
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    this.#scene.add(ambientLight);

    console.log('=== SCENE CHILDREN ===');
    this.#scene.traverse((obj) => {
      console.log('Obj:', obj.type, obj.name, (obj as any).geometry?.type);
    });
  }

  async #loadPetalGeometry(): Promise<THREE.BufferGeometry> {
    const modelLoader = new GLTFLoader();
    const petalScene = await modelLoader.loadAsync('/models/petal.glb');
    const petalMesh = petalScene.scene.getObjectByName('PetalV2') as THREE.Mesh;
    if (petalMesh && petalMesh.geometry) {
      return petalMesh.geometry;
    }
    let foundGeo: THREE.BufferGeometry | null = null;
    petalScene.scene.traverse((child: any) => {
      if (!foundGeo && child.isMesh && child.geometry) {
        foundGeo = child.geometry;
      }
    });
    return foundGeo || new THREE.BoxGeometry(0.1, 0.1, 0.01);
  }

  async #loadTextures() {
    const textureLoader = new THREE.TextureLoader();

    const dustParticleTexture = await textureLoader.loadAsync('/textures/dustParticle.png');
    dustParticleTexture.colorSpace = THREE.NoColorSpace;
    dustParticleTexture.minFilter = THREE.LinearFilter;
    dustParticleTexture.magFilter = THREE.LinearFilter;
    dustParticleTexture.generateMipmaps = false;

    const perlinTexture = await textureLoader.loadAsync('/textures/perlin.webp');
    perlinTexture.colorSpace = THREE.NoColorSpace;
    perlinTexture.minFilter = THREE.LinearFilter;
    perlinTexture.magFilter = THREE.LinearFilter;
    perlinTexture.wrapS = THREE.RepeatWrapping;
    perlinTexture.wrapT = THREE.RepeatWrapping;
    perlinTexture.generateMipmaps = false;

    // Load Syne MSDF Atlas
    const fontAtlasTexture = await textureLoader.loadAsync('/fonts/Syne/Syne.png');
    fontAtlasTexture.colorSpace = THREE.NoColorSpace;
    fontAtlasTexture.minFilter = THREE.LinearFilter;
    fontAtlasTexture.magFilter = THREE.LinearFilter;
    fontAtlasTexture.wrapS = THREE.ClampToEdgeWrapping;
    fontAtlasTexture.wrapT = THREE.ClampToEdgeWrapping;
    fontAtlasTexture.generateMipmaps = false;

    return { perlinTexture, dustParticleTexture, fontAtlasTexture };
  }

  #onResize = () => {
    if (!this.#camera || !this.#renderer) return;
    const { width, height } = this.#getSize();
    this.#updateCameraFov();
    this.#renderer.setSize(width, height);
  };

  #updateCameraFov() {
    if (!this.#camera) return;
    const { width, height } = this.#getSize();
    this.#camera.aspect = width / height;

    this.#camera.position.z = 5.0;

    // Adapt horizontal FOV so the architectural brand title "EMRE MERIC"
    // has a bold, prominent presence on mobile screens (~80% width)
    // without overflowing or clipping, while keeping desktop pristine.
    let targetHdeg = 45;
    if (width < 640) {
      targetHdeg = 29;
    } else if (width < 768) {
      targetHdeg = 32;
    } else if (width < 1024) {
      targetHdeg = 38;
    }

    const HORIZONTAL_FOV_TARGET = THREE.MathUtils.degToRad(targetHdeg);
    const verticalFov = 2 * Math.atan(Math.tan(HORIZONTAL_FOV_TARGET / 2) / this.#camera.aspect);
    this.#camera.fov = THREE.MathUtils.radToDeg(verticalFov);
    this.#camera.updateProjectionMatrix();
  }

  #onMouseMove = (e: MouseEvent) => {
    this.#mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.#mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
  };

  /**
   * Petals emitted across the full 0 -> 1 dissolve. Dust rides along at ~35% of
   * this. The previous value (45) spread barely forty petals over a 160vh
   * scroll, which read as a few stray specks rather than a burst.
   */
  static readonly PETALS_PER_PROGRESS = 170;

  /** Keep in step with `uTailEnd` in `msdfText.ts`. */
  static readonly EMISSION_ENDS_AT = 0.9;

  /** Pause drawing while the hero is scrolled out of view. */
  setVisible(visible: boolean) {
    this.#visible = visible;
  }

  /** Called by the scroll listener: `progress` is 0.0 -> 1.0 across the hero. */
  setScrollProgress(progress: number, velocity = 0) {
    const clamped = Math.max(0, Math.min(1, progress));
    this.#targetProgress = clamped;
    this.#scrollVelocity = velocity;
  }

  #startRenderLoop() {
    let elapsed = 0;
    let lastSeconds = performance.now() * 0.001;

    const tick = () => {
      if (this.#disposed) return;

      const nowSeconds = performance.now() * 0.001;
      // Clamp so a backgrounded tab does not resume with one huge step.
      const dt = Math.min(Math.max(nowSeconds - lastSeconds, 0), 0.05);
      lastSeconds = nowSeconds;
      elapsed += dt;

      // Particle shaders read this; it must stay on the same clock as the
      // birth stamps written in spawnPetal / spawnDust.
      this.#uTime.value = nowSeconds;

      // Frame-rate independent smoothing: the old `* 0.05` / `* 0.16` constants
      // ran twice as fast on a 120Hz display as on a 60Hz one.
      const followK = (perFrameAt60: number) => 1 - Math.pow(1 - perFrameAt60, dt * 60);

      const mouseK = followK(0.05);
      this.#mouse.x += (this.#mouse.targetX - this.#mouse.x) * mouseK;
      this.#mouse.y += (this.#mouse.targetY - this.#mouse.y) * mouseK;

      const breathingY = Math.sin(elapsed * 0.7) * 0.012;
      const breathingX = Math.cos(elapsed * 0.5) * 0.008;

      if (this.#camera) {
        this.#camera.position.x = this.#mouse.x * 0.1 + breathingX;
        this.#camera.position.y = this.#mouse.y * 0.08 + breathingY;
        this.#camera.lookAt(0, 0, 0);
      }

      const prev = this.#currentProgress;
      this.#currentProgress += (this.#targetProgress - this.#currentProgress) * followK(0.16);
      this.#uProgress.value = this.#currentProgress;

      const rawDelta = this.#currentProgress - prev;
      const delta = Math.abs(rawDelta);
      const direction = rawDelta >= 0 ? 1 : -1;

      // Emission is driven by how far the dissolve advanced this frame, not by
      // a timer, so petals track the scroll instead of drifting on their own.
      // Upper bound matches the text's tail fade (see `msdfText.ts`): past it
      // the only glyph texels left are a thin horizontal band, so every petal
      // would be emitted along one line instead of off the letterforms.
      if (
        delta > 0.00015 &&
        this.#currentProgress > 0.001 &&
        this.#currentProgress < GommageExperience.EMISSION_ENDS_AT
      ) {
        this.#spawnAccumulator += delta * GommageExperience.PETALS_PER_PROGRESS;

        while (this.#spawnAccumulator >= 1.0) {
          if (this.#msdfTextEntity && this.#petalParticlesEntity && this.#dustParticlesEntity) {
            const p1 = this.#msdfTextEntity.getRandomPositionOnGlyph(this.#currentProgress);
            this.#petalParticlesEntity.spawnPetal(p1, direction);

            if (Math.random() < 0.35) {
              const p2 = this.#msdfTextEntity.getRandomPositionOnGlyph(this.#currentProgress);
              this.#dustParticlesEntity.spawnDust(p2);
            }
          }
          this.#spawnAccumulator -= 1.0;
        }
      } else {
        this.#spawnAccumulator = 0;
      }

      this.#callbacks.onProgressUpdate?.(this.#currentProgress);

      // Skip the draw once the hero has scrolled away - the gallery below runs
      // its own scrubbed GSAP timeline and should not share the frame budget
      // with a full-screen WebGPU pass nobody can see.
      if (this.#visible && this.#renderer && this.#scene && this.#camera) {
        this.#renderer.render(this.#scene, this.#camera);
      }

      this.#rafId = requestAnimationFrame(tick);
    };

    tick();
  }

  dispose() {
    this.#disposed = true;
    if (this.#rafId) cancelAnimationFrame(this.#rafId);
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
    window.removeEventListener('resize', this.#onResize);
    window.removeEventListener('mousemove', this.#onMouseMove);

    if (this.#renderer && this.#renderer.domElement && this.#container) {
      this.#container.innerHTML = '';
      this.#renderer.dispose?.();
    }
  }
}
