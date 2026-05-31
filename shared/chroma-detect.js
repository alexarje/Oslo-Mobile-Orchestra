/**
 * Build a 12-bin chroma profile from FFT peaks (many partials → one histogram).
 */

import { hzToMidi } from "./pitch.js";

/**
 * @param {AnalyserNode} analyser
 * @param {number} sampleRate
 * @returns {{ chroma: Float32Array, peakCount: number }}
 */
export function chromaFromSpectrum(analyser, sampleRate) {
  const bins = analyser.frequencyBinCount;
  const mag = new Float32Array(bins);
  analyser.getFloatFrequencyData(mag);
  const chroma = new Float32Array(12);
  let peakCount = 0;
  const minDb = -68;
  const nyquist = sampleRate / 2;

  for (let i = 2; i < bins - 2; i++) {
    const db = mag[i];
    if (db < minDb) continue;
    if (db < mag[i - 1] || db < mag[i + 1]) continue;
    if (db < mag[i - 2] && db < mag[i + 2]) continue;

    const hz = (i * nyquist) / bins;
    if (hz < 65 || hz > 4200) continue;

    const midi = hzToMidi(hz);
    const pc = ((Math.round(midi) % 12) + 12) % 12;
    const w = Math.pow(10, db / 20);
    chroma[pc] += w;
    peakCount++;
  }

  return { chroma, peakCount };
}
