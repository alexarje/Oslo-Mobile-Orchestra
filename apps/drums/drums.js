/* drums.js – Web Audio drum machine */

(function () {
  'use strict';

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let ctx = null;
  let masterGain = null;

  const volumeSlider = document.getElementById('volume');
  const statusEl = document.getElementById('status');

  function pingIOS(c) {
    const buf = c.createBuffer(1, 1, c.sampleRate);
    const src = c.createBufferSource();
    src.buffer = buf;
    src.connect(c.destination);
    src.start();
    src.stop();
  }

  function ensureCtx() {
    if (!ctx) {
      ctx = new AudioContext();
      masterGain = ctx.createGain();
      masterGain.gain.value = parseFloat(volumeSlider.value);
      masterGain.connect(ctx.destination);
    } else if (ctx.state === 'suspended') {
      void ctx.resume();
    }
    pingIOS(ctx);
  }

  function markReady() {
    if (statusEl) statusEl.textContent = 'Tap a layer cell';
  }

  document.body.addEventListener('pointerdown', () => {
    ensureCtx();
    markReady();
  }, { once: true, capture: true });
  volumeSlider.addEventListener('input', () => {
    if (masterGain) masterGain.gain.value = parseFloat(volumeSlider.value);
  });

  // ── Drum sound definitions ──────────────────────────────────────────────────
  const PADS = [
    { name: 'Kick',     icon: '💥', key: '1', play: playKick },
    { name: 'Snare',    icon: '🥁', key: '2', play: playSnare },
    { name: 'Hi-Hat',   icon: '🔔', key: '3', play: playClosedHiHat },
    { name: 'Open Hat', icon: '🔓', key: '4', play: playOpenHiHat },
    { name: 'Tom 1',    icon: '🟤', key: '5', play: playTom1 },
    { name: 'Tom 2',    icon: '🟠', key: '6', play: playTom2 },
    { name: 'Clap',     icon: '👏', key: '7', play: playClap },
    { name: 'Cowbell',  icon: '🐄', key: '8', play: playCowbell },
  ];

  const LAYERS = 8;

  // ── Sound synthesis helpers ─────────────────────────────────────────────────

  function playKick() {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    env.gain.setValueAtTime(1, ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(env);
    env.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }

  function playSnare() {
    // Tonal body
    const osc = ctx.createOscillator();
    const oscEnv = ctx.createGain();
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    oscEnv.gain.setValueAtTime(0.5, ctx.currentTime);
    oscEnv.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(oscEnv);
    oscEnv.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);

    // Noise "snare rattle"
    const bufLen = ctx.sampleRate * 0.2;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const noiseEnv = ctx.createGain();
    noiseEnv.gain.setValueAtTime(1, ctx.currentTime);
    noiseEnv.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    // High-pass to brighten noise
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1000;
    noise.connect(hp);
    hp.connect(noiseEnv);
    noiseEnv.connect(masterGain);
    noise.start();
    noise.stop(ctx.currentTime + 0.2);
  }

  function playClosedHiHat() {
    playHiHat(0.05);
  }

  function playOpenHiHat() {
    playHiHat(0.35);
  }

  function playHiHat(duration) {
    const bufLen = ctx.sampleRate * duration;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 7000;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.6, ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    noise.connect(hp);
    hp.connect(env);
    env.connect(masterGain);
    noise.start();
    noise.stop(ctx.currentTime + duration);
  }

  function playTom(freq, duration) {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + duration);
    env.gain.setValueAtTime(0.9, ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(env);
    env.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  function playTom1() { playTom(180, 0.3); }
  function playTom2() { playTom(120, 0.35); }

  function playClap() {
    // Multiple short noise bursts to simulate a clap
    [0, 0.01, 0.02].forEach((offset) => {
      const bufLen = Math.floor(ctx.sampleRate * 0.05);
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1200;
      bp.Q.value = 0.5;
      const env = ctx.createGain();
      const startTime = ctx.currentTime + offset;
      env.gain.setValueAtTime(0.8, startTime);
      env.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
      noise.connect(bp);
      bp.connect(env);
      env.connect(masterGain);
      noise.start(startTime);
      noise.stop(startTime + 0.1);
    });
  }

  function playCowbell() {
    const freqs = [562, 845];
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = freq;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = freq;
      bp.Q.value = 5;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.5, ctx.currentTime);
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(bp);
      bp.connect(env);
      env.connect(masterGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    });
  }

  // ── Build matrix UI (8 instruments × 8 layer columns) ─────────────────────
  const grid = document.getElementById('pads-grid');
  grid.className = 'drums-matrix';
  const keyToPad = {};

  PADS.forEach((pad, row) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'drums-row';

    const label = document.createElement('div');
    label.className = 'drum-row-label';
    label.innerHTML = `<span class="pad-icon">${pad.icon}</span><span class="pad-name">${pad.name}</span>`;
    rowEl.appendChild(label);

    let firstCell = null;
    for (let col = 0; col < LAYERS; col++) {
      const cell = document.createElement('div');
      cell.className = 'drum-pad';
      cell.dataset.pad = row;
      cell.dataset.col = col;
      cell.innerHTML = `<span class="pad-layer">${col + 1}</span>`;

      cell.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        ensureCtx();
        triggerPad(row, col, cell);
      });

      rowEl.appendChild(cell);
      if (col === 0) firstCell = cell;
    }

    grid.appendChild(rowEl);
    keyToPad[pad.key] = { index: row, el: firstCell };
  });

  function layerGain(col) {
    return 0.62 + (col / (LAYERS - 1)) * 0.38;
  }

  function triggerPad(row, col, el) {
    ensureCtx();
    const prev = masterGain.gain.value;
    masterGain.gain.setValueAtTime(parseFloat(volumeSlider.value) * layerGain(col), ctx.currentTime);
    PADS[row].play();
    masterGain.gain.setValueAtTime(prev, ctx.currentTime + 0.08);
    el.classList.add('active');
    setTimeout(() => el.classList.remove('active'), 120);
  }

  document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const entry = keyToPad[e.key];
    if (!entry) return;
    ensureCtx();
    triggerPad(entry.index, 0, entry.el);
  });
}());
