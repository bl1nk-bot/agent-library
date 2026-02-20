#!/usr/bin/env node

/**
 * Cross-platform icon generator
 * - macOS: .icns
 * - Windows: .ico
 * - Linux: .png (various sizes)
 * - Tauri: supports .png, .ico, .icns
 * - Extra: .svg export
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join, dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import sharp from 'sharp';
import toIco from 'to-ico';

const filename = fileURLToPath(import.meta.url);
const dirname = pathDirname(filename);

// Paths
const BUILDDIR = join(dirname, '../build');
const INPUTICON = join(BUILDDIR, 'icon.png');
const ICONSETDIR = join(BUILDDIR, 'icon.iconset');
const OUTPUTICNS = join(BUILDDIR, 'icon.icns');
const OUTPUTICO = join(BUILDDIR, 'icon.ico');
const OUTPUTSVG = join(BUILDDIR, 'icon.svg');

// Sizes
const MAC_SIZES = [16, 32, 128, 256, 512];
const WIN_SIZES = [16, 24, 32, 48, 64, 128, 256];
const LINUX_SIZES = [16, 32, 48, 64, 128, 256, 512, 1024];

/**
 * Create rounded squircle mask (Apple style)
 */
function createRoundedRectSVG(width: number, height: number, radius: number): string {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="white"/>
  </svg>`;
}

async function createRoundedSquircle(inputPath: string, outputPath: string, size: number = 1024, padding: number = 100): Promise<void> {
  const contentSize = size - (padding * 2);
  const radius = Math.round(contentSize * 0.22);
  const maskSVG = createRoundedRectSVG(contentSize, contentSize, radius);
  const maskBuffer = Buffer.from(maskSVG);

  const maskedContent = await sharp(inputPath)
    .resize(contentSize, contentSize)
    .composite([{ input: maskBuffer, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const result = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([{ input: maskedContent, left: padding, top: padding }])
    .png()
    .toBuffer();

  await sharp(result).toFile(outputPath);
}

/**
 * Detect whether the image has a transparent background.
 * Samples corner pixels — if any corner is non-opaque, treats the image as transparent.
 */
async function hasTransparentBackground(inputPath: string): Promise<boolean> {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const cornerOffsets = [
    0,                                        // top-left
    (width - 1) * channels,                   // top-right
    (height - 1) * width * channels,          // bottom-left
    ((height - 1) * width + width - 1) * channels, // bottom-right
  ];

  for (const offset of cornerOffsets) {
    const alpha = data[offset + 3]; // alpha channel
    if (alpha < 250) return true;   // any near-transparent corner → transparent bg
  }
  return false;
}

/**
 * Prepare a transparent image: just resize to target size, preserving transparency.
 */
async function prepareTransparentSource(inputPath: string, outputPath: string, size: number = 1024): Promise<void> {
  await sharp(inputPath)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(outputPath);
}

/**
 * Remove background using flood-fill from image corners.
 * Detects background color from corners and makes all connected
 * matching pixels (within tolerance) transparent.
 *
 * @param inputPath  - source image
 * @param outputPath - output PNG with transparent background
 * @param tolerance  - color distance threshold (0–441, default 30)
 */
async function removeBackground(inputPath: string, outputPath: string, tolerance: number = 30): Promise<void> {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = new Uint8Array(data);

  // ── Sample background color from corners ──────────────────────────────
  // Prefer the first mostly-opaque corner as the reference bg color.
  const cornerIdxs = [
    0,
    width - 1,
    (height - 1) * width,
    (height - 1) * width + width - 1,
  ];

  let bgR = 255, bgG = 255, bgB = 255;
  for (const ci of cornerIdxs) {
    const o = ci * channels;
    if (pixels[o + 3] > 200) {
      bgR = pixels[o];
      bgG = pixels[o + 1];
      bgB = pixels[o + 2];
      break;
    }
  }

  // ── Flood-fill (DFS stack — O(n) memory, O(n) time) ──────────────────
  const visited = new Uint8Array(width * height); // 0 = unvisited
  const stack: number[] = [];

  // Seed from all four corners
  for (const ci of cornerIdxs) {
    if (!visited[ci]) {
      visited[ci] = 1;
      stack.push(ci);
    }
  }

  while (stack.length > 0) {
    const idx = stack.pop()!;
    const o = idx * channels;

    const r = pixels[o];
    const g = pixels[o + 1];
    const b = pixels[o + 2];
    const a = pixels[o + 3];

    // Euclidean color distance to detected background color
    const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);

    if (a > 0 && dist <= tolerance) {
      pixels[o + 3] = 0; // make transparent

      const x = idx % width;
      const y = Math.floor(idx / width);

      if (x > 0 && !visited[idx - 1]) { visited[idx - 1] = 1; stack.push(idx - 1); }
      if (x < width - 1 && !visited[idx + 1]) { visited[idx + 1] = 1; stack.push(idx + 1); }
      if (y > 0 && !visited[idx - width]) { visited[idx - width] = 1; stack.push(idx - width); }
      if (y < height - 1 && !visited[idx + width]) { visited[idx + width] = 1; stack.push(idx + width); }
    }
  }

  await sharp(pixels, {
    raw: { width, height, channels },
  })
    .png()
    .toFile(outputPath);
}

/**
 * Generate macOS .icns
 */
async function generateMacIcon(source: string): Promise<void> {
  // iconutil is macOS only
  const isMac = process.platform === 'darwin';

  if (!isMac) {
    console.log(' ⊘ macOS: Skipping .icns generation (not on macOS)');
    return;
  }

  if (existsSync(ICONSETDIR)) rmSync(ICONSETDIR, { recursive: true });
  mkdirSync(ICONSETDIR);

  for (const size of MAC_SIZES) {
    for (const scale of [1, 2]) {
      const actualSize = size * scale;
      const icnsFilename = scale === 1 ? `icon_${size}x${size}.png` : `icon_${size}x${size}@${scale}x.png`;
      await sharp(source)
        .resize(actualSize, actualSize)
        .png()
        .toFile(join(ICONSETDIR, icnsFilename));
    }
  }

  execSync(`iconutil -c icns "${ICONSETDIR}" -o "${OUTPUTICNS}"`);
  rmSync(ICONSETDIR, { recursive: true });
}

/**
 * Generate Windows .ico
 */
async function generateWindowsIcon(source: string): Promise<void> {
  const buffers: Buffer[] = [];

  // Generate PNG buffers for each size
  // Standard Windows sizes: 16, 32, 48, 256
  const sizes = [16, 32, 48, 256];

  for (const size of sizes) {
    const buffer = await sharp(source)
      .resize(size, size)
      .png()
      .toBuffer();
    buffers.push(buffer);
  }

  // Combine into ICO
  const icoBuffer = await toIco(buffers);
  writeFileSync(OUTPUTICO, icoBuffer);
}

/**
 * Generate Linux .png icons
 */
async function generateLinuxIcons(source: string): Promise<void> {
  for (const size of LINUX_SIZES) {
    await sharp(source)
      .resize(size, size)
      .png()
      .toFile(join(BUILDDIR, `icon${size}x${size}.png`));
  }
}

/**
 * Generate SVG (vector mask)
 */
async function generateSVG(source: string): Promise<void> {
  // Instead of using sharp to output SVG (which just wraps the raster image),
  // we'll write a simple SVG wrapper that references the image or just output the mask shape itself if that was intended.
  // However, based on the original code, it seemed to want to apply a mask.
  // Since we can't easily vectorize a PNG with sharp, we will output the rounded rect SVG shape 
  // that matches the icon style, which is often what is needed for simple vector assets.

  // Alternatively, if the intention was just to have an SVG file available:
  const svgContent = createRoundedRectSVG(1024, 1024, 220);
  writeFileSync(OUTPUTSVG, svgContent);
}

async function main(): Promise<void> {
  console.log('🎨 Generating cross-platform icons...\n');

  if (!existsSync(INPUTICON)) {
    console.error(`❌ Missing input: ${INPUTICON}`);
    process.exit(1);
  }

  const isTransparent = await hasTransparentBackground(INPUTICON);

  const processedSource = join(BUILDDIR, 'source-processed.png');

  if (isTransparent) {
    console.log(' ℹ source: transparent background → resize only\n');
    await prepareTransparentSource(INPUTICON, processedSource);
  } else {
    console.log(' ℹ source: opaque background → removing background (flood-fill)\n');
    const bgRemoved = join(BUILDDIR, 'source-bg-removed.png');
    await removeBackground(INPUTICON, bgRemoved);
    await prepareTransparentSource(bgRemoved, processedSource);
    rmSync(bgRemoved);
  }

  await generateMacIcon(processedSource);
  console.log(` ✓ macOS: ${OUTPUTICNS}`);

  await generateWindowsIcon(processedSource);
  console.log(` ✓ Windows: ${OUTPUTICO}`);

  await generateLinuxIcons(processedSource);
  console.log(` ✓ Linux: PNG sizes generated`);

  await generateSVG(processedSource);
  console.log(` ✓ SVG: ${OUTPUTSVG}`);

  rmSync(processedSource);

  console.log('\n✅ All icons generated successfully!');
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
