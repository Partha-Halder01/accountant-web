import sharp from 'sharp';
import { readdirSync, statSync, existsSync, unlinkSync } from 'node:fs';
import { join, parse, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', 'public');
console.log('root:', root);

async function makeLogo() {
  const src = join(root, 'logom.png');
  if (!existsSync(src)) return;
  await sharp(src).resize({ width: 480, withoutEnlargement: true }).png({ compressionLevel: 9, palette: true }).toFile(join(root, 'logo.png'));
  await sharp(src).resize({ width: 480, withoutEnlargement: true }).webp({ quality: 86 }).toFile(join(root, 'logo.webp'));
  console.log('logo.png + logo.webp written');
}

async function makeFavicon() {
  const src = join(root, 'favicon.svg');
  if (!existsSync(src)) return;
  await sharp(src, { density: 384 }).resize(180, 180).png().toFile(join(root, 'apple-touch-icon.png'));
  await sharp(src, { density: 192 }).resize(32, 32).png().toFile(join(root, 'favicon-32.png'));
  console.log('apple-touch-icon.png + favicon-32.png written');
}

async function makeServiceImages() {
  const dir = join(root, 'service-images');
  if (!existsSync(dir)) return;
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (!statSync(p).isFile()) continue;
    const { name, ext } = parse(f);
    if (!/\.(jpe?g|png)$/i.test(ext)) continue;
    if (name.endsWith('-480') || name.endsWith('-960')) continue;
    const base = sharp(p);
    await base.clone().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 78 }).toFile(join(dir, `${name}-480.webp`));
    await base.clone().resize({ width: 960, withoutEnlargement: true }).webp({ quality: 80 }).toFile(join(dir, `${name}-960.webp`));
    await base.clone().resize({ width: 480, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toFile(join(dir, `${name}-480.jpg`));
    await base.clone().resize({ width: 960, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(join(dir, `${name}-960.jpg`));
    console.log(`  ${name}: 480/960 webp+jpg`);
  }
}

async function dropOversized() {
  const dropPng = join(root, 'favi.png');
  if (existsSync(dropPng)) { unlinkSync(dropPng); console.log('removed favi.png (372 KB)'); }
}

await makeLogo();
await makeFavicon();
await makeServiceImages();
await dropOversized();
console.log('done.');
