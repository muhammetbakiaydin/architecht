import * as THREE from 'three';

export interface BMFontChar {
  id: number;
  index?: number;
  char?: string;
  width: number;
  height: number;
  xoffset: number;
  yoffset: number;
  xadvance: number;
  x: number;
  y: number;
  page?: number;
}

export interface BMFontKerning {
  first: number;
  second: number;
  amount: number;
}

export interface BMFontJSON {
  pages: string[];
  chars: BMFontChar[];
  common: {
    lineHeight: number;
    base: number;
    scaleW: number;
    scaleH: number;
  };
  info?: any;
  kernings?: BMFontKerning[];
}

export interface MSDFGeometryOptions {
  text: string;
  font: BMFontJSON;
  width?: number;
  align?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
}

export interface GlyphRenderData {
  char: BMFontChar;
  x0: number;
  x1: number;
  yTop: number;
  yBottom: number;
}

export class CustomMSDFTextGeometry extends THREE.BufferGeometry {
  layout: { width: number; height: number } = { width: 0, height: 0 };
  glyphs: GlyphRenderData[] = [];

  constructor(options: MSDFGeometryOptions) {
    super();
    this.update(options);
  }

  update(options: MSDFGeometryOptions) {
    const { text, font, letterSpacing = 0 } = options;
    if (!font || !font.chars) return;

    const scaleW = font.common.scaleW;
    const scaleH = font.common.scaleH;
    const lineHeight = options.lineHeight || font.common.lineHeight;
    const spaceAdvance = lineHeight * 0.38;

    const charMap = new Map<number, BMFontChar>();
    font.chars.forEach((c) => charMap.set(c.id, c));

    const kerningMap = new Map<string, number>();
    if (font.kernings) {
      font.kernings.forEach((k) => kerningMap.set(`${k.first}_${k.second}`, k.amount));
    }

    let cursorX = 0;
    const cursorY = 0;
    let prevCharId: number | null = null;
    const charsToRender: { char: BMFontChar; x: number; y: number }[] = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const code = text.charCodeAt(i);

      if (char === '\n') {
        continue;
      }

      // Handle space manually
      if (char === ' ' || code === 32) {
        cursorX += spaceAdvance + letterSpacing;
        prevCharId = 32;
        continue;
      }

      const charData = charMap.get(code);
      if (!charData) continue;

      if (prevCharId !== null && prevCharId !== 32) {
        const kern = kerningMap.get(`${prevCharId}_${code}`) || 0;
        cursorX += kern;
      }

      charsToRender.push({
        char: charData,
        x: cursorX,
        y: cursorY,
      });

      cursorX += charData.xadvance + letterSpacing;
      prevCharId = code;
    }

    this.layout.width = cursorX;
    this.layout.height = lineHeight;

    const visibleGlyphs = charsToRender.filter((g) => g.char.width > 0 && g.char.height > 0);
    const glyphCount = visibleGlyphs.length;

    this.glyphs = [];

    const positions = new Float32Array(glyphCount * 4 * 3);
    const uvs = new Float32Array(glyphCount * 4 * 2);
    const glyphUvs = new Float32Array(glyphCount * 4 * 2);
    const centers = new Float32Array(glyphCount * 4 * 2);
    const indices = new Uint16Array(glyphCount * 6);

    let vIdx = 0;
    let uvIdx = 0;
    let gUvIdx = 0;
    let cIdx = 0;
    let iIdx = 0;

    visibleGlyphs.forEach((g, idx) => {
      const c = g.char;
      const x0 = g.x + c.xoffset;
      const x1 = x0 + c.width;

      const yTop = -c.yoffset;
      const yBottom = -(c.yoffset + c.height);

      this.glyphs.push({
        char: c,
        x0,
        x1,
        yTop,
        yBottom,
      });

      const cx = (x0 + x1) / 2;
      const cy = (yTop + yBottom) / 2;

      // Atlas UV coordinates
      const u0 = c.x / scaleW;
      const u1 = (c.x + c.width) / scaleW;
      const vTop = (scaleH - c.y) / scaleH;
      const vBottom = (scaleH - (c.y + c.height)) / scaleH;

      // Quad Vertices (CCW)
      positions[vIdx++] = x0;
      positions[vIdx++] = yTop;
      positions[vIdx++] = 0;

      positions[vIdx++] = x0;
      positions[vIdx++] = yBottom;
      positions[vIdx++] = 0;

      positions[vIdx++] = x1;
      positions[vIdx++] = yBottom;
      positions[vIdx++] = 0;

      positions[vIdx++] = x1;
      positions[vIdx++] = yTop;
      positions[vIdx++] = 0;

      // Atlas UVs
      uvs[uvIdx++] = u0;
      uvs[uvIdx++] = vTop;

      uvs[uvIdx++] = u0;
      uvs[uvIdx++] = vBottom;

      uvs[uvIdx++] = u1;
      uvs[uvIdx++] = vBottom;

      uvs[uvIdx++] = u1;
      uvs[uvIdx++] = vTop;

      // Glyph local UVs
      glyphUvs[gUvIdx++] = 0;
      glyphUvs[gUvIdx++] = 1;

      glyphUvs[gUvIdx++] = 0;
      glyphUvs[gUvIdx++] = 0;

      glyphUvs[gUvIdx++] = 1;
      glyphUvs[gUvIdx++] = 0;

      glyphUvs[gUvIdx++] = 1;
      glyphUvs[gUvIdx++] = 1;

      // Centers (for procedural noise)
      for (let k = 0; k < 4; k++) {
        centers[cIdx++] = cx;
        centers[cIdx++] = cy;
      }

      // Indices
      const baseV = idx * 4;
      indices[iIdx++] = baseV + 0;
      indices[iIdx++] = baseV + 1;
      indices[iIdx++] = baseV + 2;

      indices[iIdx++] = baseV + 0;
      indices[iIdx++] = baseV + 2;
      indices[iIdx++] = baseV + 3;
    });

    this.setIndex(new THREE.BufferAttribute(indices, 1));
    this.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    this.setAttribute('glyphUv', new THREE.BufferAttribute(glyphUvs, 2));
    this.setAttribute('center', new THREE.BufferAttribute(centers, 2));

    this.computeBoundingBox();
    this.computeBoundingSphere();
  }
}
export default CustomMSDFTextGeometry;
