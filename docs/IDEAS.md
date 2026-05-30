# Ideas — Oslo Mobile Orchestra

Backlog of apps, features, and workshop concepts. Same stack as today: vanilla JS, Web Audio, static GitHub Pages, phones only.

---

## New instruments (apps)

| Idea | Music role | Tech |
|------|------------|------|
| ~~**Pentatonic Flute**~~ | Melody by breath | Done → [flute-blow](../apps/flute-blow/) — mic RMS gate + slide pitch |
| **Mic Theremin** | Solo melody, “voice in the ensemble” | `getUserMedia` + pitch detection (autocorrelation or YIN) → oscillator frequency |
| **Hum vs Clap** | Call-and-response sections | TensorFlow.js [speech commands](https://github.com/tensorflow/tfjs-models/tree/master/speech-commands) or custom audio classifier |
| **Tilt Harp** | Plucked glissandi | Touch = pluck; tilt = scale / key |
| **Gyro Compass** | Panning in the room | Device orientation → stereo pan (each player is one speaker in the circle) |
| **Delay Throw** | Rhythmic layers | Tap screen → sample captured → tilt controls delay feedback time |
| **Bow Phone** | Sustained strings | Hold + horizontal drag = bow pressure; vertical = pitch on a string |
| **NFC / QR Part** | Instant seating | Scan QR on stage → opens app with `?part=7` and suggested instrument |
| ~~**Photo Sonifier**~~ | Texture from environment | → [Photo Sonifier](../apps/photo-sonifier/) |

---

## Enhance existing apps

- **Drone Choir** — hold-to-sustain gate; show cents + semitone ruler on pad
- **Motion Wah** — optional continuous mode vs hold (toggle in Learn)
- **Pulse Grid** — pattern copy/paste row; share pattern via URL hash
- ~~**Train & Shake** sway + export/import~~ — shipped in [Train & Shake](../apps/train-shake/)
- **Conductor** — QR code for musician link; visual metronome flash at downbeat
- ~~**Synth Pad** aftertouch~~ — [Synth Pad](../apps/synth-pad/) (`pressure` / contact size)
- **Granular Tilt** — hold pad to freeze grain buffer; upload short sample (File API)

---

## Ensemble & sync

| Idea | Why |
|------|-----|
| **WebRTC room** | Tighter beat than URL `start` time; conductor sets BPM in room |
| **WebSocket hub** | Tiny server (Cloudflare Worker / Fly.io) broadcasts `step` index for global grid |
| **Listen & lock** | Mic hears conductor click → local phase correction (hard on 20 phones, demo only) |
| **Section colors** | Conductor URL assigns `section=brass` → opens suggested apps list |
| **Room reverb send** | Optional: one laptop runs reverb bus via Web Audio (not on phones) |

---

## AI & education (showcase)

- ~~Teachable panel, confusion matrix, k slider, ethics, k-NN vs tiny net~~ — [Train & Shake](../apps/train-shake/) (2-layer net in pure JS, no TF.js bundle)

---

## Sound synthesis demos

- **Additive bells** — 5–8 partials, sliders per harmonic
- **Karplus–strong pluck** — delay line string; tap = excite
- **FM matrix** — 2×2 mod routing preset for workshop
- **Wavetable scan** — swipe through single-cycle waves
- **Filter ladder** — 24 dB lowpass with resonance + envelope from tilt

---

## Sensors

| Sensor | Idea |
|--------|------|
| Accelerometer | Shake intensity → distortion drive (already partial in Train & Shake) |
| Gyroscope | Continuous vibrato rate |
| Orientation | Map alpha to filter cutoff (compass wah) |
| Light (ambient) | `AmbientLightSensor` where supported → brightness → volume cap |
| Proximity | Cover top of phone → mute (Android mainly) |
| Haptics | `navigator.vibrate` on Pulse Grid steps (Android) |
| Touch pressure | iOS `touch.force` → dynamics |

---

## Workshop & concert

- **20-part score card** — PDF/one-pager: who plays which app + color
- **5-minute “open app” ritual** — Conductor countdown built into all apps via shared `?start=`
- **Silent movement piece** — all Train & Shake, no speakers, only visual pred on screen (then discuss)
- **Audience phones** — QR to simplified “one button” audience app (crowd swell)
- **Accessibility mode** — larger targets; high-contrast; haptic-only rhythm cue

---

## Infrastructure

- **PWA manifest** — Add to Home Screen, full-screen, icon per app
- **Offline cache** — service worker for gym/hall with bad Wi‑Fi
- **i18n** — Norwegian + English UI strings
- **Telemetry opt-in** — anonymous “which app used” for workshop planning (no audio upload)
- **Version pin** — `?v=2` for workshops so 20 phones stay on same build

---

## Priority (suggested)

1. Mic Theremin — high musical payoff, one new app  
2. Conductor QR + Pulse Grid URL patterns — better 20-player sync  
3. PWA / offline — reliability in venues  
4. WebRTC room — when URL sync isn’t enough  
5. TF.js speech commands — second AI app beside Train & Shake  

Contributions welcome: pick an idea, open a PR, link it here.
