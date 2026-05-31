/**
 * Motion Filter modes — tilt wah, compass, shake, flat gate, heading choir.
 */
import { createMasterBus } from "./audio.js";
import { drawCompassRose, sizeCompassCanvas } from "./compass-rose.js";
import { createMotionExpression } from "./motion-express.js";
import { playAmpFromTiltAndMotion } from "./tilt-amp.js";
import { normalizeAccel } from "./sensors.js";

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export const FILTER_MODES = {
  compass: {
    label: "Compass",
    learn:
      "Hold the screen. <strong>Rotate</strong> flat for filter cutoff · <strong>tilt</strong> for volume · <strong>shake</strong> for vibrato.",
    sensors: { needMotion: true, needOrientation: true },
  },
  tilt: {
    label: "Tilt",
    learn:
      "Hold the pad. <strong>Tilt forward/back</strong> sweeps wah · <strong>sideways</strong> changes resonance.",
    sensors: { needMotion: true, needOrientation: false },
  },
  shake: {
    label: "Shake",
    learn: "Hold the pad — <strong>X</strong> = pitch. <strong>Shake</strong> opens the filter.",
    sensors: { needMotion: true, needOrientation: false },
  },
  flat: {
    label: "Flat",
    learn: "Hold the pad. Sound only when the phone lies <strong>flat</strong> on a table.",
    sensors: { needMotion: false, needOrientation: true },
  },
  choir: {
    label: "Choir",
    learn: "Hold the pad and turn — where you face <strong>pans</strong> the detuned choir.",
    sensors: { needMotion: false, needOrientation: true },
  },
};

export function modeFromUrl(search = location.search) {
  const m = new URLSearchParams(search).get("mode");
  return m && FILTER_MODES[m] ? m : "compass";
}

/** @param {AudioContext} ctx @param {AudioNode} master */
export function createCompassFilterVoice(ctx, master) {
  const motionExpr = createMotionExpression({ baseAmp: 0.28 });
  const gate = ctx.createGain();
  gate.gain.value = 0;
  const filt = ctx.createBiquadFilter();
  filt.type = "lowpass";
  filt.Q.value = 10;
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = 110;
  const vibOsc = ctx.createOscillator();
  const vibGain = ctx.createGain();
  vibOsc.type = "sine";
  vibOsc.frequency.value = 5;
  vibGain.gain.value = 0;
  vibOsc.connect(vibGain);
  vibGain.connect(osc.detune);
  osc.connect(filt);
  filt.connect(gate);
  gate.connect(master);
  osc.start();
  vibOsc.start();
  let motion = { amp: 0.28, vibCents: 0, vibHz: 5 };
  return {
    motionExpr,
    apply({ holding, alpha, beta, motionData }) {
      if (motionData) motion = motionExpr.update(motionData);
      const t = ctx.currentTime;
      const heading = ((alpha % 360) + 360) % 360;
      if (!holding) {
        gate.gain.setTargetAtTime(0, t, 0.05);
        vibGain.gain.setTargetAtTime(0, t, 0.05);
        return { heading, cut: null, ampPct: null, vib: null };
      }
      const cut = 200 + (heading / 360) * 6000;
      const playAmp = playAmpFromTiltAndMotion(beta, motion.amp);
      filt.frequency.setTargetAtTime(cut, t, 0.04);
      gate.gain.setTargetAtTime(0.06 + playAmp * 0.44, t, 0.06);
      vibGain.gain.setTargetAtTime(motion.vibCents, t, 0.07);
      vibOsc.frequency.setTargetAtTime(motion.vibHz, t, 0.08);
      return {
        heading,
        cut,
        ampPct: playAmp * 100,
        vib: motion.vibCents,
      };
    },
    resetMotion() {
      motionExpr.reset();
      motion = motionExpr.update({ x: 0, y: 0, z: 0 });
    },
  };
}

export function createTiltWahVoice(ctx, master) {
  const gate = ctx.createGain();
  gate.gain.value = 0;
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = 110;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 800;
  filter.Q.value = 12;
  osc.connect(filter);
  filter.connect(gate);
  gate.connect(master);
  osc.start();
  return {
    apply({ holding, x, y, z }) {
      const t = ctx.currentTime;
      if (!holding) {
        gate.gain.setTargetAtTime(0, t, 0.04);
        return { freq: null, q: null, tiltY: 0, tiltX: 0 };
      }
      const n = normalizeAccel(x, y, z);
      const tiltY = clamp((n.y + 1) / 2, 0, 1);
      const tiltX = clamp((n.x + 1) / 2, 0, 1);
      const freq = 150 + tiltY * 3500;
      const q = 4 + tiltX * 16;
      filter.frequency.setTargetAtTime(freq, t, 0.03);
      filter.Q.setTargetAtTime(q, t, 0.03);
      gate.gain.setTargetAtTime(0.5, t, 0.02);
      return { freq, q, tiltY, tiltX };
    },
  };
}

export function createShakeFilterVoice(ctx, master) {
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  const filt = ctx.createBiquadFilter();
  filt.type = "lowpass";
  amp.gain.value = 0;
  osc.connect(filt);
  filt.connect(amp);
  amp.connect(master);
  osc.start();
  let last = { x: 0, y: 0, z: 0 };
  let primed = false;
  return {
    apply({ holding, nx, x, y, z }) {
      const t = ctx.currentTime;
      osc.frequency.setTargetAtTime(90 * Math.pow(6, nx), t, 0.03);
      if (!holding) {
        amp.gain.setTargetAtTime(0, t, 0.06);
        primed = false;
        return { jerk: 0 };
      }
      amp.gain.setTargetAtTime(0.3, t, 0.02);
      if (!primed) {
        last = { x, y, z };
        primed = true;
        return { jerk: 0 };
      }
      const j = Math.hypot(x - last.x, y - last.y, z - last.z);
      last = { x, y, z };
      filt.frequency.setTargetAtTime(400 + j * 900, t, 0.04);
      filt.Q.setTargetAtTime(4 + j * 4, t, 0.05);
      return { jerk: j };
    },
  };
}

export function createFlatDroneVoice(ctx, master) {
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  amp.gain.value = 0;
  osc.connect(amp);
  amp.connect(master);
  osc.start();
  return {
    apply({ holding, beta, gamma, nx }) {
      const t = ctx.currentTime;
      osc.frequency.setTargetAtTime(80 * Math.pow(5, nx), t, 0.04);
      if (!holding) {
        amp.gain.setTargetAtTime(0, t, 0.1);
        return { flat: false };
      }
      const flat = Math.abs(beta || 0) < 18 && Math.abs(gamma || 0) < 18;
      amp.gain.setTargetAtTime(flat ? 0.26 : 0, t, flat ? 0.08 : 0.04);
      return { flat };
    },
  };
}

export function createHeadingChoirVoice(ctx, master) {
  const voices = [];
  for (let i = 0; i < 5; i++) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const p = ctx.createStereoPanner();
    g.gain.value = 0;
    o.frequency.value = 110 * Math.pow(2, i / 12);
    o.connect(g);
    g.connect(p);
    p.connect(master);
    o.start();
    voices.push({ g, p });
  }
  return {
    apply({ holding, heading01 }) {
      const t = ctx.currentTime;
      if (!holding) {
        voices.forEach((v) => v.g.gain.setTargetAtTime(0, t, 0.1));
        return;
      }
      voices.forEach((v, i) => {
        v.p.pan.setTargetAtTime(Math.sin((heading01 + i * 0.15) * Math.PI * 2) * 0.85, t, 0.08);
        v.g.gain.setTargetAtTime(0.06, t, 0.06);
      });
    },
  };
}

export function buildMaster(ctx) {
  return createMasterBus(ctx, 0.5).master;
}
