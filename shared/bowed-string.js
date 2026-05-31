/**
 * Continuous bowed Karplus–Strong string — one sustained loop, not repeated plucks.
 */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/**
 * @param {AudioContext} ctx
 * @param {AudioNode} dest
 * @param {number} [freqHz]
 */
export function createBowedString(ctx, dest, freqHz = 220) {
  const maxPeriod = 1 / 55;
  const delay = ctx.createDelay(maxPeriod);

  const damp = ctx.createBiquadFilter();
  damp.type = "lowpass";
  damp.Q.value = 0.85;

  const fb = ctx.createGain();
  fb.gain.value = 0.985;

  const bowIn = ctx.createGain();
  bowIn.gain.value = 0;

  const out = ctx.createGain();
  out.gain.value = 0;

  const shaper = ctx.createWaveShaper();
  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const x = (i / 127.5) - 1;
    curve[i] = Math.tanh(x * 1.8);
  }
  shaper.curve = curve;

  const len = Math.floor(ctx.sampleRate * 0.12);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;

  const bowFilter = ctx.createBiquadFilter();
  bowFilter.type = "bandpass";
  bowFilter.frequency.value = 600;
  bowFilter.Q.value = 1.4;

  noise.connect(bowFilter);
  bowFilter.connect(bowIn);
  bowIn.connect(delay);
  delay.connect(damp);
  damp.connect(fb);
  fb.connect(delay);
  damp.connect(shaper);
  shaper.connect(out);
  out.connect(dest);
  noise.start();

  let freq = freqHz;

  function applyPitch(hz) {
    freq = clamp(hz, 55, 880);
    const t = ctx.currentTime;
    const period = 1 / freq;
    delay.delayTime.setTargetAtTime(period, t, 0.04);
    const dampHz = clamp(freq * 5.5, 400, 7500);
    damp.frequency.setTargetAtTime(dampHz, t, 0.05);
    bowFilter.frequency.setTargetAtTime(clamp(freq * 2.2, 280, 3200), t, 0.05);
    bowFilter.Q.setTargetAtTime(1.1 + (freq / 440) * 0.4, t, 0.05);
  }

  applyPitch(freq);

  return {
    /**
     * @param {number} force 0..1 bow pressure / speed
     */
    setBow(force) {
      const bow = clamp(force, 0, 1);
      const t = ctx.currentTime;
      const excite = bow * bow * 0.045;
      bowIn.gain.setTargetAtTime(excite, t, 0.04);
      const loop = bow > 0.03 ? 0.992 + bow * 0.0065 : 0.978;
      fb.gain.setTargetAtTime(loop, t, bow > 0.03 ? 0.08 : 0.25);
      out.gain.setTargetAtTime(bow > 0.02 ? 0.12 + bow * 0.32 : 0, t, 0.05);
    },

    setPitch(hz) {
      applyPitch(hz);
    },

    /** Let the string ring after bow lifts. */
    release() {
      const t = ctx.currentTime;
      bowIn.gain.setTargetAtTime(0, t, 0.06);
      fb.gain.setTargetAtTime(0.984, t, 0.35);
      out.gain.setTargetAtTime(0.08, t, 0.12);
      fb.gain.setTargetAtTime(0.001, t + 2.8, 0.9);
      out.gain.setTargetAtTime(0, t + 3.2, 0.5);
    },

    stop() {
      const t = ctx.currentTime;
      bowIn.gain.setTargetAtTime(0, t, 0.02);
      fb.gain.setTargetAtTime(0, t, 0.05);
      out.gain.setTargetAtTime(0, t, 0.05);
    },
  };
}
