/**
 * Lightweight hand tracking in the upper “bow” band of a front-camera frame.
 * Combines frame differencing with simple skin-tone cues — no ML deps.
 */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function isSkinPixel(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return (
    r > 60 &&
    g > 35 &&
    b > 15 &&
    r > g &&
    r > b &&
    max - min > 12 &&
    max < 250
  );
}

/**
 * @param {ImageData} img
 * @param {number} w
 * @param {number} h
 * @param {Float32Array | null} prevGray
 * @param {number} bowZone — fraction of frame height (top band)
 * @returns {{ present: boolean, cx: number, cy: number, mass: number, nx: number, ny: number }}
 */
export function trackHandInBowZone(img, w, h, prevGray, bowZone = 0.55) {
  const data = img.data;
  const yMax = Math.max(1, Math.floor(h * bowZone));
  const area = w * yMax;
  let sumX = 0;
  let sumY = 0;
  let weight = 0;
  let count = 0;

  for (let y = 0; y < yMax; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = (r + g + b) / 765;
      const pi = y * w + x;
      const diff = prevGray ? Math.abs(gray - prevGray[pi]) : 0;
      const skin = isSkinPixel(r, g, b);
      const moving = diff > 0.035;
      const skinFg = skin && diff > 0.012;
      const fg = moving || skinFg;

      if (prevGray) prevGray[pi] = gray;

      if (fg) {
        const wgt = 1 + diff * 6 + (skin ? 0.5 : 0);
        sumX += x * wgt;
        sumY += y * wgt;
        weight += wgt;
        count++;
      }
    }
  }

  const mass = count / area;
  if (mass < 0.018 || weight <= 0) {
    return { present: false, cx: 0, cy: 0, mass: 0, nx: 0.5, ny: 0.25 };
  }

  const cx = sumX / weight;
  const cy = sumY / weight;
  return {
    present: true,
    cx,
    cy,
    mass,
    nx: cx / Math.max(1, w - 1),
    ny: cy / Math.max(1, yMax - 1),
  };
}

/**
 * Bow drive from horizontal hand speed (camera coords, 0..w).
 * @param {number | null} lastCx
 * @param {number} cx
 * @param {number} w
 * @param {number} [gain=13]
 */
export function bowFromHandSpeed(lastCx, cx, w, gain = 13) {
  if (lastCx == null) return 0;
  const dx = Math.abs(cx - lastCx) / Math.max(1, w);
  return clamp(dx * gain, 0, 1);
}
