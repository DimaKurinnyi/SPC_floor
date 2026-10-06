// Usage: node scripts/cutout-white.mjs <in.jpg> <out.png> [x,y seed | x0,y0,x1,y1 box]...
// Used for the badges in public/images/certificate, e.g. intertek.png came from:
//   node scripts/cutout-white.mjs <2381f019-...jpg> intertek.png 380,40 370,0,768,398
// Turns the white background of a badge JPG transparent: flood fill over near-white pixels from the
// edges (plus optional inner seeds), unblending anti-aliased edge pixels from white, then trims.
import sharp from 'sharp';
const [src, out, ...seedArgs] = process.argv.slice(2);
const T = 200; // min channel at or above this counts as background-ish
(async () => {
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const min = (i) => Math.min(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);
  const bg = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => { if (x >= 0 && y >= 0 && x < w && y < h) { const i = y * w + x; if (!bg[i] && min(i) >= T) { bg[i] = 1; stack.push(i); } } };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  for (const s of seedArgs) {
    // "x0,y0,x1,y1": every near-white pixel in that box is background (letter counters, enclosed gaps).
    const n = s.split(',').map(Number);
    if (n.length === 4) { for (let y = n[1]; y < Math.min(h, n[3]); y++) for (let x = n[0]; x < Math.min(w, n[2]); x++) push(x, y); }
    else push(n[0], n[1]);
  }
  while (stack.length) { const i = stack.pop(); const x = i % w, y = (i / w) | 0; push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1); }
  const outBuf = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    let r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2], a = 255;
    // Background pixels and their direct neighbours get unblended from white.
    const x = i % w, y = (i / w) | 0;
    const nearBg = bg[i] || (x > 0 && bg[i - 1]) || (x < w - 1 && bg[i + 1]) || (y > 0 && bg[i - w]) || (y < h - 1 && bg[i + w]);
    if (nearBg) {
      const m = Math.min(r, g, b);
      if (bg[i] && m >= 245) a = 0;
      else {
        const alpha = (255 - m) / 255;
        a = Math.round(alpha * 255);
        if (alpha > 0) { r = Math.round((r - (1 - alpha) * 255) / alpha); g = Math.round((g - (1 - alpha) * 255) / alpha); b = Math.round((b - (1 - alpha) * 255) / alpha); }
      }
    }
    outBuf.set([r, g, b, a], i * 4);
  }
  await sharp(outBuf, { raw: { width: w, height: h, channels: 4 } }).trim({ threshold: 1 }).png({ compressionLevel: 9 }).toFile(out);
  const m = await sharp(out).metadata(); console.log(out, m.width, m.height);
})();
