/* piano.js – Web Audio piano */

(function () {
  'use strict';

  // ── Audio context & nodes ──────────────────────────────────────────────────
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let ctx = null;

  function ensureCtx() {
    if (!ctx) {
      ctx = new AudioContext();
      buildReverb();
    } else if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  // Master gain
  let masterGain = null;

  // Reverb (convolver)
  let reverbNode = null;
  let reverbGain = null;
  let dryGain = null;

  function buildReverb() {
    masterGain = ctx.createGain();
    masterGain.gain.value = parseFloat(volumeSlider.value);
    masterGain.connect(ctx.destination);

    // Simple synthetic impulse response
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

  // ── Note definitions ───────────────────────────────────────────────────────
  // Two octaves starting at C4.  Each entry: [semitone offset from C4, label, isBlack, keyboardKey]
  const NOTE_DEFS = [
    // octave 0 relative to base
    { name: 'C',  semi: 0,  black: false, key: 'a' },
    { name: 'C♯', semi: 1,  black: true,  key: 'w' },
    { name: 'D',  semi: 2,  black: false, key: 's' },
    { name: 'D♯', semi: 3,  black: true,  key: 'e' },
    { name: 'E',  semi: 4,  black: false, key: 'd' },
    { name: 'F',  semi: 5,  black: false, key: 'f' },
    { name: 'F♯', semi: 6,  black: true,  key: 't' },
    { name: 'G',  semi: 7,  black: false, key: 'g' },
    { name: 'G♯', semi: 8,  black: true,  key: 'y' },
    { name: 'A',  semi: 9,  black: false, key: 'h' },
    { name: 'A♯', semi: 10, black: true,  key: 'u' },
    { name: 'B',  semi: 11, black: false, key: 'j' },
    // octave 1 relative to base (higher C)
    { name: 'C',  semi: 12, black: false, key: null },
  ];

  const C4_FREQ = 261.63; // Hz

  function noteFreq(semiOffset, octaveShift) {
    return C4_FREQ * Math.pow(2, (semiOffset + octaveShift * 12) / 12);
  }

  // ── Octave state ───────────────────────────────────────────────────────────
  let octave = 4; // displayed as the base octave
  const octaveDisplay = document.getElementById('octave-display');
  const octaveShift = () => octave - 4; // offset from C4

  document.getElementById('octave-down').addEventListener('click', () => {
    if (octave > 1) { octave--; octaveDisplay.textContent = octave; }
  });
  document.getElementById('octave-up').addEventListener('click', () => {
    if (octave < 8) { octave++; octaveDisplay.textContent = octave; }
  });

  // ── Controls ───────────────────────────────────────────────────────────────
  const volumeSlider = document.getElementById('volume');
  const reverbSlider = document.getElementById('reverb');
  const waveformSelect = document.getElementById('waveform');

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

  // ── Key rendering ──────────────────────────────────────────────────────────
  const keyboard = document.getElementById('keyboard');

  // We'll render two octaves of white keys and place black keys absolutely.
  // White key positions (within each octave, 0-based):
  //   C=0, D=1, E=2, F=3, G=4, A=5, B=6  → 7 white keys per octave
  // Black key positions (left offset as fraction of white key width):
  //   C♯ between C(0) and D(1): left = 0*54 + 35
  //   D♯ between D(1) and E(2): left = 1*54 + 35
  //   F♯ between F(3) and G(4): left = 3*54 + 35
  //   G♯ between G(4) and A(5): left = 4*54 + 35
  //   A♯ between A(5) and B(6): left = 5*54 + 35

  const WHITE_W = 37; // px  (key width 36 + gap 1)
  const BLACK_OFFSETS = { 1: 24, 3: 24 + WHITE_W, 6: 24 + 3 * WHITE_W, 8: 24 + 4 * WHITE_W, 10: 24 + 5 * WHITE_W };

  // keyMap: keyboard-key → DOM element
  const keyMap = {};

  function buildKeyboard() {
    keyboard.innerHTML = '';
    // Filter to just the first octave (semis 0-12) for a clean single-octave display
    // but still support two octave visually: render semis 0-11 twice plus final C
    // For simplicity we render one octave + high C, mapping keyboard keys to first octave only.
    NOTE_DEFS.forEach((def, i) => {
      const el = document.createElement('div');
      el.classList.add('key', def.black ? 'black' : 'white');
      el.dataset.semi = def.semi;

      // Labels
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
        // Calculate position based on semitone offset within octave
        el.style.left = BLACK_OFFSETS[def.semi] + 'px';
      }

      el.addEventListener('mousedown', (e) => { e.preventDefault(); playNote(def.semi); activateKey(el); });
      el.addEventListener('mouseup', () => releaseKey(el));
      el.addEventListener('mouseleave', () => releaseKey(el));

      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        ensureCtx();
        playNote(def.semi);
        activateKey(el);
      });
      el.addEventListener('pointerup', () => releaseKey(el));
      el.addEventListener('pointercancel', () => releaseKey(el));

      keyboard.appendChild(el);
    });
  }

  buildKeyboard();

  // ── Sound engine ───────────────────────────────────────────────────────────
  const activeOscillators = {};

  function playNote(semi) {
    ensureCtx();
    if (activeOscillators[semi]) return; // already playing

    const freq = noteFreq(semi, octaveShift());
    const osc = ctx.createOscillator();
    const env = ctx.createGain();

    osc.type = waveformSelect.value;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Attack/decay envelope
    env.gain.setValueAtTime(0, ctx.currentTime);
    env.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.01);
    env.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.15);

    osc.connect(env);
    env.connect(dryGain);
    env.connect(reverbNode);

    osc.start();
    activeOscillators[semi] = { osc, env };
  }

  function stopNote(semi) {
    const active = activeOscillators[semi];
    if (!active) return;
    const { osc, env } = active;
    const t = ctx.currentTime;
    env.gain.cancelScheduledValues(t);
    env.gain.setValueAtTime(env.gain.value, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.stop(t + 0.4);
    delete activeOscillators[semi];
  }

  function activateKey(el) {
    el.classList.add('active');
  }

  function releaseKey(el) {
    el.classList.remove('active');
    stopNote(parseInt(el.dataset.semi, 10));
  }

  // ── Keyboard events ────────────────────────────────────────────────────────
  const pressedKeys = new Set();

  document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const key = e.key.toLowerCase();
    const el = keyMap[key];
    if (!el) return;
    pressedKeys.add(key);
    playNote(parseInt(el.dataset.semi, 10));
    activateKey(el);
  });

  document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    const el = keyMap[key];
    if (!el) return;
    pressedKeys.delete(key);
    releaseKey(el);
  });
}());
