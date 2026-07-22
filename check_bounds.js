const fs = require('fs');
const jpeg = require('jpeg-js');

const jpegData = fs.readFileSync('public/hero-video/ezgif-frame-001.jpg');
const rawImageData = jpeg.decode(jpegData, {useTArray: true});

let minX = rawImageData.width, maxX = 0;
let minY = rawImageData.height, maxY = 0;

for (let y = 0; y < rawImageData.height; y++) {
  for (let x = 0; x < rawImageData.width; x++) {
    const idx = (y * rawImageData.width + x) * 4;
    const r = rawImageData.data[idx];
    const g = rawImageData.data[idx + 1];
    const b = rawImageData.data[idx + 2];
    
    // Check if pixel is not entirely black (threshold 10)
    if (r > 10 || g > 10 || b > 10) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log({ minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY });
