#!/usr/bin/env node

/**
 * Cross-platform icon generator
 * - macOS: .icns
 * - Windows: .ico
 * - Linux: .png (various sizes)
 * - Tauri: supports .png, .ico, .icns
 * - Extra: .svg export
 */

import { existsSync, mkdirSync, rmSync } from 'fs';
import { join, dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import sharp from 'sharp';

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
function createRoundedRectSVG(width, height, radius) {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="white"/>
  </svg>`;
}

async function createRoundedSquircle(inputPath, outputPath, size = 1024, padding = 100) {
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
 * Generate macOS .icns
 */
async function generateMacIcon(source) {
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
      const filename = scale === 1 ? `icon_${size}x${size}.png` : `icon_${size}x${size}@${scale}x.png`;
      await sharp(source)
        .resize(actualSize, actualSize)
        .png()
        .toFile(join(ICONSETDIR, filename));
    }
  }

  execSync(`iconutil -c icns "${ICONSETDIR}" -o "${OUTPUTICNS}"`);
  rmSync(ICONSETDIR, { recursive: true });
}

/**
 * Generate Windows .ico
 */
async function generateWindowsIcon(source) {
  await sharp(source)
    .resize(256, 256)
    .toFile(OUTPUTICO);
}

/**
 * Generate Linux .png icons
 */
async function generateLinuxIcons(source) {
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
async function generateSVG(source) {
  const svgMask = createRoundedRectSVG(1024, 1024, 220);
  await sharp(source)
    .resize(1024, 1024)
    .composite([{ input: Buffer.from(svgMask), blend: 'dest-in' }])
    .toFile(OUTPUTSVG);
}

async function main() {
  console.log('🎨 Generating cross-platform icons...\n');

  if (!existsSync(INPUTICON)) {
    console.error(`❌ Missing input: ${INPUTICON}`);
    process.exit(1);
  }

  const roundedSource = join(BUILDDIR, 'source-rounded.png');
  await createRoundedSquircle(INPUTICON, roundedSource);

  await generateMacIcon(roundedSource);
  console.log(` ✓ macOS: ${OUTPUTICNS}`);

  await generateWindowsIcon(roundedSource);
  console.log(` ✓ Windows: ${OUTPUTICO}`);

  await generateLinuxIcons(roundedSource);
  console.log(` ✓ Linux: PNG sizes generated`);

  await generateSVG(roundedSource);
  console.log(` ✓ SVG: ${OUTPUTSVG}`);

  rmSync(roundedSource);

  console.log('\n✅ All icons generated successfully!');
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
