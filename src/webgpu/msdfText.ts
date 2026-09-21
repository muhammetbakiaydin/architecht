import * as THREE from 'three/webgpu';
import { CustomMSDFTextGeometry } from './msdfGeometry';
import {
  texture,
  mix,
  uniform,
  clamp,
  attribute,
  step,
  float,
  smoothstep,
  uv,
  max,
  min,
  fwidth,
} from 'three/tsl';

export default class MSDFText {
  #worldPositionBounds: THREE.Box3 = new THREE.Box3();
  #glyphWorldBounds: { min: THREE.Vector3; max: THREE.Vector3 }[] = [];
  #mesh: THREE.Mesh | null = null;
  #textGeometry: CustomMSDFTextGeometry | null = null;

  async initialize(
    text = 'EMRE MERIC',
    position = new THREE.Vector3(0, 0, 0),
    uProgress: any,
    perlinTexture: THREE.Texture,
    fontAtlasTexture: THREE.Texture
  ): Promise<THREE.Mesh> {
    // Load Syne modern architectural font metadata
    const response = await fetch('/fonts/Syne/Syne.json');
    const fontData = await response.json();

    // Create custom MSDF text geometry with elegant letter spacing
    this.#textGeometry = new CustomMSDFTextGeometry({
      text,
      font: fontData,
      width: 1600,
      align: 'center',
      letterSpacing: 4,
    });

    const textMaterial = this.createTextMaterial(fontAtlasTexture, perlinTexture, uProgress);
    textMaterial.alphaTest = 0.02;

    this.#mesh = new THREE.Mesh(this.#textGeometry, textMaterial);

    const targetLineHeight = 0.38;
    const lineHeightPx = fontData.common.lineHeight;
    const textScale = targetLineHeight / lineHeightPx;

    this.#mesh.scale.set(textScale, textScale, textScale);
    
    // Position mesh and center it perfectly at (0, 0, 0)
    const initialMeshOffset = -(this.#textGeometry.layout.width / 2) * textScale;
    const verticalOffset = (lineHeightPx * 0.38) * textScale;
    this.#mesh.position.set(position.x + initialMeshOffset, position.y + verticalOffset, position.z);
    this.#mesh.rotation.set(0, 0, 0);

    this.#textGeometry.computeBoundingBox();
    this.#mesh.updateWorldMatrix(true, false);
    this.#worldPositionBounds = new THREE.Box3().setFromObject(this.#mesh);

    // Precise centering in 3D world space
    const center = new THREE.Vector3();
    this.#worldPositionBounds.getCenter(center);
    this.#mesh.position.x -= center.x;
    this.#mesh.position.y -= center.y;
    this.#mesh.updateWorldMatrix(true, false);
    this.#worldPositionBounds.setFromObject(this.#mesh);

    // Calculate exact world bounds for each individual glyph stroke
    this.#glyphWorldBounds = this.#textGeometry.glyphs.map((g) => {
      const pMin = new THREE.Vector3(g.x0, g.yBottom, 0).applyMatrix4(this.#mesh!.matrixWorld);
      const pMax = new THREE.Vector3(g.x1, g.yTop, 0).applyMatrix4(this.#mesh!.matrixWorld);
      return {
        min: new THREE.Vector3(Math.min(pMin.x, pMax.x), Math.min(pMin.y, pMax.y), -0.05),
        max: new THREE.Vector3(Math.max(pMin.x, pMax.x), Math.max(pMin.y, pMax.y), 0.05),
      };
    });

    console.log('MSDF Mesh position:', this.#mesh.position);
    console.log('MSDF Mesh scale:', this.#mesh.scale);
    console.log('MSDF Mesh bounds:', this.#worldPositionBounds);
    console.log('MSDF Glyph bounds count:', this.#glyphWorldBounds.length);
    console.log('MSDF First glyph bounds:', this.#glyphWorldBounds[0]);
    console.log('MSDF Last glyph bounds:', this.#glyphWorldBounds[this.#glyphWorldBounds.length - 1]);

    return this.#mesh;
  }

  getBounds(): THREE.Box3 {
    return this.#worldPositionBounds;
  }

  /**
   * Samples a point directly from the active dissolving stroke of a glyph (organic edge emission)
   */
  getRandomPositionOnGlyph(progress = 0.5): THREE.Vector3 {
    if (this.#glyphWorldBounds.length === 0) {
      return this.getRandomPositionInMesh();
    }

    // Pick a random glyph stroke
    const glyph = this.#glyphWorldBounds[Math.floor(Math.random() * this.#glyphWorldBounds.length)];
    
    // Sample directly on the letter contour
    const tX = Math.random();
    const tY = Math.random();

    const x = glyph.min.x + tX * (glyph.max.x - glyph.min.x);
    const y = glyph.min.y + tY * (glyph.max.y - glyph.min.y);
    const z = (Math.random() - 0.5) * 0.08;

    return new THREE.Vector3(x, y, z);
  }

  getRandomPositionInMesh(): THREE.Vector3 {
    const min = this.#worldPositionBounds.min;
    const max = this.#worldPositionBounds.max;
    const x = Math.random() * (max.x - min.x) + min.x;
    const y = Math.random() * (max.y - min.y) + min.y;
    const z = (Math.random() - 0.5) * 0.10;
    return new THREE.Vector3(x, y, z);
  }

  createTextMaterial(
    fontAtlasTexture: THREE.Texture,
    perlinTexture: THREE.Texture,
    uProgress: any
  ): THREE.MeshBasicNodeMaterial {
    const textMaterial = new THREE.MeshBasicNodeMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // MSDF Median Calculation
    const uvNode = uv();
    const sample = texture(fontAtlasTexture, uvNode);
    const r = sample.r;
    const g = sample.g;
    const b = sample.b;
    const median = max(min(r, g), min(max(r, g), b));
    const sigDist = median.sub(0.5);

    // Screen-space antialiasing for crisp vector edges
    const distDelta = fwidth(sigDist);
    const msdfAlpha = clamp(sigDist.div(distDelta.max(0.0001)).add(0.5), 0.0, 1.0);

    const glyphUv = attribute('glyphUv', 'vec2');
    const center = attribute('center', 'vec2');

    // Linear 0.0 -> 1.0 noise range
    const uNoiseRemapMin = uniform(0.0);
    const uNoiseRemapMax = uniform(1.0);
    const uCenterScale = uniform(0.05);
    const uGlyphScale = uniform(0.75);

    // Color palette tuned for luxury cream background (#F5EFE6)
    const uBaseColor = uniform(new THREE.Color('#161413')); // Ultra-deep architectural noir
    const uDissolvedColor = uniform(new THREE.Color('#584E44')); // Warm smoky charcoal
    const uDesatComplete = uniform(0.50);

    const customUv = center.mul(uCenterScale).add(glyphUv.mul(uGlyphScale));

    const perlinTextureNode = texture(perlinTexture, customUv).x;
    const perlinRemap = clamp(
      perlinTextureNode.sub(uNoiseRemapMin).div(uNoiseRemapMax.sub(uNoiseRemapMin)),
      0.0,
      1.0
    );
    const dissolve = step(uProgress, perlinRemap);
    const desaturationProgress = smoothstep(float(0.0), uDesatComplete, uProgress);

    const colorMix = mix(uBaseColor, uDissolvedColor, desaturationProgress);
    textMaterial.colorNode = colorMix;

    // The dissolve alone never finishes. `perlinRemap` is clamped to [0, 1], so
    // every texel whose noise value saturates at 1 keeps `step(uProgress, 1)`
    // equal to 1 even at full progress - the glyphs' last survivors. By then
    // they are sub-pixel slivers, where the MSDF median breaks down and the raw
    // red/green/blue channels of the atlas bleed through as a thin coloured
    // line across the hero. This tail fade closes the gap: from 0.72 onward the
    // remainder is faded out, and the text is provably gone by 0.90 - well
    // before the hero scrolls away. Widen the window to let the dissolve linger
    // longer; both numbers live here and nowhere else.
    const uTailStart = uniform(0.72);
    const uTailEnd = uniform(0.9);
    const tailFade = smoothstep(uTailStart, uTailEnd, uProgress).oneMinus();

    const finalOpacity = msdfAlpha.mul(dissolve).mul(tailFade);
    textMaterial.opacityNode = finalOpacity;

    return textMaterial;
  }
}
