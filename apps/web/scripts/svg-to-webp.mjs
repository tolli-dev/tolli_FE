import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

const targets = [
  'tolli1.svg',
  'tolli2.svg',
  'tolli3.svg',
  'tolli-logo.svg',
  'tolli-terms.svg',
  'TolliLastStep.svg',
  'images/onBoarding/eatingTolli.svg',
  'images/onBoarding/fullHappyTolli.svg',
  'images/onBoarding/fullTolli.svg',
  'images/onBoarding/hungryTolli_1.svg',
  'images/onBoarding/standingTolli_1.svg',
  'images/onBoarding/timeSetTolli.svg',
  'images/onBoarding/timeTolli.svg',
  'images/leftEar.svg',
  'images/rightEar.svg',
  'images/readingBookTolli.svg',
  'images/star1.svg',
  'images/star2.svg',
];

async function convertSvgToWebp(relativePath) {
  const svgPath = path.join(publicDir, relativePath);
  const webpPath = svgPath.replace(/\.svg$/, '.webp');

  const beforeSize = fs.statSync(svgPath).size;

  await sharp(svgPath, { density: 144 })
    .webp({ quality: 85 })
    .toFile(webpPath);

  const afterSize = fs.statSync(webpPath).size;
  const reduction = (((beforeSize - afterSize) / beforeSize) * 100).toFixed(1);

  console.log(
    `${relativePath.padEnd(50)} ${(beforeSize / 1024).toFixed(0).padStart(6)}KB → ${(afterSize / 1024).toFixed(0).padStart(6)}KB  (-${reduction}%)`
  );
}

console.log('=== SVG → WebP 변환 시작 ===\n');
for (const target of targets) {
  await convertSvgToWebp(target);
}
console.log('\n완료!');
