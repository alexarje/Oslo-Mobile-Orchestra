/**
 * Karplus–Strong pluck — stable feedback, voice pool, clean teardown.
 */

function killVoice(ctx, voice) {
  const t = ctx.currentTime;
  try {
    voice.fb.gain.cancelScheduledValues(t);
    voice.fb.gain.setTargetAtTime(0, t, 0.015);
    voice.out.gain.cancelScheduledValues(t);
    voice.out.gain.setTargetAtTime(0, t, 0.015);
  } catch {
    /* noop */
  }
  setTimeout(() => {
    try {
      voice.exc.stop();
    } catch {
      /* noop */
    }
    for (const node of [voice.exc, voice.delay, voice.lpf, voice.fb, voice.out]) {
      try {
        node.disconnect();
      } catch {
        /* noop */
      }
    }
  }, 120);
}

/**
 * @param {AudioContext} ctx
 * @param {AudioNode} dest
 * @param {{ voices: object[], max: number }} pool
 * @param {number} freq Hz
 * @param {{ strength?: number, dampHz?: number, level?: number, decaySec?: number }} [opts]
 */
export function karplusPluck(ctx, dest, pool, freq, opts = {}) {
  const strength = opts.strength ?? 0.55;
  const dampHz = opts.dampHz ?? Math.min(6000, Math.max(400, freq * 4));
  const level = opts.level ?? 0.28;
  const decaySec = opts.decaySec ?? 2.2;

  const hz = Math.max(50, Math.min(1000, freq));
  /** Keep loop gain below 1 — high feedback + bright damping rings and stacks harshly. */
  const feedback =
    opts.feedback ??
    Math.min(0.9, 0.82 + (dampHz / 8000) * 0.06 - (hz / 1000) * 0.04);
  const sr = ctx.sampleRate;
  const now = ctx.currentTime;
  const period = 1 / hz;
  const n = Math.max(2, Math.ceil(sr * period));

  const buf = ctx.createBuffer(1, n, sr);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * strength;

  const exc = ctx.createBufferSource();
  exc.buffer = buf;
  const maxDelay = Math.max(period * 1.05, 0.02);
  const delay = ctx.createDelay(maxDelay);
  delay.delayTime.value = period;
  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.value = dampHz;
  lpf.Q.value = 0.7;
  const fb = ctx.createGain();
  fb.gain.setValueAtTime(feedback, now);
  fb.gain.setTargetAtTime(0.001, now + decaySec, 0.35);
  const out = ctx.createGain();
  out.gain.value = level;

  while (pool.voices.length >= pool.max) killVoice(ctx, pool.voices.shift());

  exc.connect(delay);
  delay.connect(lpf);
  lpf.connect(fb);
  fb.connect(delay);
  lpf.connect(out);
  out.connect(dest);

  const voice = { exc, delay, lpf, fb, out };
  pool.voices.push(voice);

  exc.start(now);
  exc.stop(now + period + 0.002);

  setTimeout(() => {
    const i = pool.voices.indexOf(voice);
    if (i !== -1) pool.voices.splice(i, 1);
    killVoice(ctx, voice);
  }, (decaySec + 0.6) * 1000);

  return voice;
}

export function createKSPool(max = 3) {
  return { voices: [], max };
}
