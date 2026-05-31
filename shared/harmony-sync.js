/**
 * Slow consensus over many heard partials → shared root / chord for harmonizing.
 */

import { midiToHz } from "./pitch.js";

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const NOTE = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];

function argmax(arr) {
  let i = 0;
  let v = arr[0];
  for (let k = 1; k < arr.length; k++) {
    if (arr[k] > v) {
      v = arr[k];
      i = k;
    }
  }
  return i;
}

/**
 * @param {{ startHz?: number, pull?: number, decay?: number }} [opts]
 */
export function createHarmonyConsensus(opts = {}) {
  const pull = opts.pull ?? 0.06;
  const decay = opts.decay ?? 0.992;
  const chromaAcc = new Float32Array(12);
  const chromaView = new Float32Array(12);
  let playHz = opts.startHz ?? 220;
  let rootPc = 0;
  let rootMidi = 60;
  let frames = 0;
  let recentPeaks = 0;

  function ingest(chroma, peakCount = 0) {
    let energy = 0;
    for (let i = 0; i < 12; i++) {
      chromaAcc[i] *= decay;
      chromaAcc[i] += chroma[i];
      energy += chroma[i];
    }
    if (energy < 1e-6) return;

    frames++;
    recentPeaks = recentPeaks * 0.9 + peakCount * 0.1;

    for (let i = 0; i < 12; i++) {
      chromaView[i] = chromaView[i] * (1 - pull) + chromaAcc[i] * pull;
    }

    rootPc = argmax(chromaView);
    const targetMidi = 60 + rootPc;
    rootMidi = targetMidi;
    const targetHz = midiToHz(targetMidi);
    playHz = playHz * (1 - pull) + targetHz * pull;
  }

  function chordHz(major = true) {
    const r = rootMidi;
    const third = major ? 4 : 3;
    return [r, r + third, r + 7].map((m) => midiToHz(m));
  }

  function lockAmount() {
    const max = Math.max(...chromaView);
    const sum = chromaView.reduce((a, b) => a + b, 0) || 1;
    const peakRatio = max / sum;
    return clamp(frames / 40, 0, 1) * clamp(peakRatio * 2.2, 0, 1);
  }

  function rootLabel() {
    return NOTE[rootPc];
  }

  return {
    ingest,
    getPlayHz: () => playHz,
    getRootMidi: () => rootMidi,
    getChromaView: () => chromaView,
    chordHz,
    lockAmount,
    rootLabel,
    getPeakEma: () => recentPeaks,
    getFrames: () => frames,
  };
}
