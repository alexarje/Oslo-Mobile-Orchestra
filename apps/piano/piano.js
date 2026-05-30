/* piano.js – Web Audio piano (two octaves, mobile touch) */

(function () {
  'use strict';

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let ctx = null;
  let masterGain = null;
  let reverbNode = null;
  let reverbGain = null;
  let dryGain = null;

  const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  const BLACK_SEMIS = new Set([1, 3, 6, 8, 10]);
  const KEY_BY_SEMI = { 0: 'a', 1: 'w', 2: 's', 3: 'e', 4: 'd', 5: 'f', 6: 't', 7: 'g', 8: 'y', 9: 'h', 10: 'u', 11: 'j' };
  const OCTAVES_ON_KEYBOARD = 2;
  const RELEASE_SEC = 0.07;

  const volumeSlider = document.getElementById('volume');
  const reverbSlider = document.getElementById('reverb');
  const waveformSelect = document.getElementById('waveform');
  const keyboard = document.getElementById('keyboard');
  const octaveDisplay = document.getElementById('octave-display');

  const WHITE_W = 33; // key 32px + 1px gap
  const BLACK_NUDGE = 24;

  function ensureCtx() {
    if (!ctx) {
      ctx = new AudioContext();
      buildReverb();
    } else if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  function buildReverb() {
    masterGain = ctx.createGain();
    masterGain.gain.value = parseFloat(volumeSlider.value);
    masterGain.connect(ctx.destination);

    const rate = ctx.sampleRate;
    const length = rate * 2.5;
    const impulse = ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const d = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
      }
    }

    reverbNode = ctx.createConvolver();
    reverbNode.buffer = impulse;
    reverbGain = ctx.createGain();
    dryGain = ctx.createGain();
    const wet = parseFloat(reverbSlider.value);
    reverbGain.gain.value = wet;
    dryGain.gain.value = 1 - wet * 0.5;
    reverbNode.connect(reverbGain);
    reverbGain.connect(masterGain);
    dryGain.connect(masterGain);
  }

  function buildNoteDefs() {
    const defs = [];
    const totalSemis = OCTAVES_ON_KEYBOARD * 12;
    for (let semi = 0; semi < totalSemis; semi++) {
      const inOct = semi % 12;
      const octNum = 4 + Math.floor(semi / 12);
      defs.push({
        name: `${NOTE_NAMES[inOct]}${octNum}`,
        semi,
        black: BLACK_SEMIS.has(inOct),
        key: semi < 12 ? KEY_BY_SEMI[inOct] : null,
      });
    }
    return defs;
  }

  const NOTE_DEFS = buildNoteDefs();
  const C4_FREQ = 261.63;

  function noteFreq(semiOffset, octaveShift) {
    return C4_FREQ * Math.pow(2, (semiOffset + octaveShift * 12) / 12);
  }

  let octave = 4;
  const octaveShift = () => octave - 4;

  document.getElementById('octave-down').addEventListener('click', () => {
    if (octave > 1) { octave--; octaveDisplay.textContent = octave; }
  });
  document.getElementById('octave-up').addEventListener('click', () => {
    if (octave < 7) { octave++; octaveDisplay.textContent = octave; }
  });

  volumeSlider.addEventListener('input', () => {
    if (masterGain) masterGain.gain.value = parseFloat(volumeSlider.value);
  });

  reverbSlider.addEventListener('input', () => {
    if (reverbGain) {
      const wet = parseFloat(reverbSlider.value);
      reverbGain.gain.value = wet;
      dryGain.gain.value = 1 - wet * 0.5;
    }
  });

  function blackKeyLeft(semi) {
    const inOct = semi % 12;
    const oct = Math.floor(semi / 12);
    const whiteBefore = { 1: 0, 3: 1, 6: 3, 8: 4, 10: 5 }[inOct];
    return oct * 7 * WHITE_W + whiteBefore * WHITE_W + BLACK_NUDGE;
  }

  const keyMap = {};
  const activeVoices = {};
  const heldSemis = new Set();

  function bindKey(el, semi) {
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      ensureCtx();
      if (heldSemis.has(semi)) return;
      heldSemis.add(semi);
      el.setPointerCapture(e.pointerId);
      playNote(semi);
      el.classList.add('active');
    });

    const release = (e) => {
      if (e && e.pointerId != null && el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }
      if (!heldSemis.has(semi)) return;
      heldSemis.delete(semi);
      el.classList.remove('active');
      stopNote(semi);
    };

    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
    el.addEventListener('lostpointercapture', () => {
      heldSemis.delete(semi);
      el.classList.remove('active');
      stopNote(semi);
    });
  }

  function buildKeyboard() {
    keyboard.innerHTML = '';
    NOTE_DEFS.forEach((def) => {
      const el = document.createElement('div');
      el.classList.add('piano-key', def.black ? 'black' : 'white');
      el.dataset.semi = def.semi;

      const noteLabel = document.createElement('span');
      noteLabel.className = 'key-note';
      noteLabel.textContent = def.name;
      el.appendChild(noteLabel);

      if (def.key) {
        const keyLabel = document.createElement('span');
        keyLabel.className = 'key-label';
        keyLabel.textContent = def.key.toUpperCase();
        el.appendChild(keyLabel);
        keyMap[def.key] = el;
      }

      if (def.black) {
        el.style.left = `${blackKeyLeft(def.semi)}px`;
      }

      bindKey(el, def.semi);
      keyboard.appendChild(el);
    });
  }

  buildKeyboard();

  function playNote(semi) {
    ensureCtx();
    if (activeVoices[semi]) return;

    const freq = noteFreq(semi, octaveShift());
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();

    osc.type = waveformSelect.value;
    osc.frequency.setValueAtTime(freq, t);

    // Start above zero — exponential ramps cannot target 0 (causes clicks).
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(0.75, t + 0.012);
    env.gain.exponentialRampToValueAtTime(0.35, t + 0.12);

    osc.connect(env);
    env.connect(dryGain);
    env.connect(reverbNode);
    osc.start(t);

    activeVoices[semi] = { osc, env };
  }

  function stopNote(semi) {
    const voice = activeVoices[semi];
    if (!voice) return;

    const { osc, env } = voice;
    const t = ctx.currentTime;
    const stopAt = t + RELEASE_SEC + 0.03;

    env.gain.cancelScheduledValues(t);
    env.gain.setValueAtTime(Math.max(env.gain.value, 0.0001), t);
    // Linear ramp to true silence before stopping the oscillator (avoids end click).
    env.gain.linearRampToValueAtTime(0, t + RELEASE_SEC);
    osc.stop(stopAt);

    delete activeVoices[semi];

    setTimeout(() => {
      try {
        osc.disconnect();
        env.disconnect();
      } catch (_) { /* already disconnected */ }
    }, (RELEASE_SEC + 0.05) * 1000);
  }

  document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const key = e.key.toLowerCase();
    const el = keyMap[key];
    if (!el) return;
    const semi = parseInt(el.dataset.semi, 10);
    if (heldSemis.has(semi)) return;
    heldSemis.add(semi);
    ensureCtx();
    playNote(semi);
    el.classList.add('active');
  });

  document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    const el = keyMap[key];
    if (!el) return;
    const semi = parseInt(el.dataset.semi, 10);
    heldSemis.delete(semi);
    el.classList.remove('active');
    stopNote(semi);
  });
}());
