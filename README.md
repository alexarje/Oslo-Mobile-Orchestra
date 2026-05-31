# Oslo Mobile Orchestra

Web-based instruments for musicians using only their phones (Android + iPhone). Open in the browser and **tap to play** — audio starts on first touch; allow mic or motion when prompted.

**Live site:** https://alexarje.github.io/Oslo-Mobile-Orchestra/

**Workshop script:** [docs/WORKSHOP-GUIDE.md](docs/WORKSHOP-GUIDE.md) · **Future ideas:** [docs/IDEAS.md](docs/IDEAS.md)

## Apps

| App | Music making | Tech highlight |
|-----|----------------|----------------|
| [Conductor](apps/conductor/) | Shared downbeat | URL start + BPM, QR, metronome flash |
| [Your Part](apps/part/) | Seating | `?part=1`…`20` → suggested instrument |
| [Audience Swell](apps/audience/) | Crowd layer | One-button hold swell |
| [Pentatonic Flute](apps/flute-blow/) | Melody by breath | Mic gate + pentatonic slide |
| [Mic Theremin](apps/mic-theremin/) | Sung melody | Pitch detect → sine |
| [Hum vs Clap](apps/hum-clap/) | Call-and-response | k-NN on mic features |
| [Piano](apps/piano/) | Melody / harmony | Keyboard + reverb |
| [Drumkit](apps/drumkit/) | Rhythm hits | 8 drum pads |
| [Drum Sequencer](apps/drum-sequencer/) | Patterns | 4×8 steps, swing |
| [Circular Drum](apps/circular-drum/) | Ring patterns | 4×16 steps on concentric rings |
| [Firefly](apps/firefly/) | Sync pulses | Mic entrainment — phones align click rate & phase |
| [Delay Throw](apps/delay-throw/) | Echo layers | Tap sample + tilt delay |
| [Sampler](apps/sampler/) | Loop textures | Mic loop + tilt FX |
| [FM Touch / + Tilt](apps/fm-touch/) | FM timbre | Touch + optional tilt mod |
| [FM Matrix](apps/fm-matrix/) | FM routing | 2×2 presets |
| [KS String / Pluck](apps/ks-string/) | Plucked strings | Karplus–Strong |
| [Synth Pad](apps/synth-pad/) | Melodic lead | Waveforms, filter, aftertouch |
| [Additive Bells](apps/additive-bells/) | Bell tones | 8 partials |
| [Wavetable Scan](apps/wavetable-scan/) | Timbral sweep | Swipe waves |
| [Filter Ladder](apps/filter-ladder/) | Subtractive | 24 dB LP + tilt |
| [Motion Wah](apps/motion-wah/) | Filter sweeps | Hold + tilt ↕ (wah) ↔ (resonance) |
| [Compass Wah](apps/compass-wah/) | Orientation filter | Alpha → lowpass |
| [Drone Choir](apps/drone-choir/) | Harmonic mass | Hold sustain, ±5 st pad, cents |
| [Tilt Harp](apps/tilt-harp/) | Gliss plucks | Tap strings, tilt = key |
| [Bow Phone](apps/bow-phone/) | Bowed tone | Left-hand pitch pad + selfie-cam hand bow |
| [Evo Drumkit](apps/evo-drumkit/) | Learned grooves | Record pattern · genetic algorithm breeds matches |
| [Train & Shake](apps/train-shake/) | Gesture ML | k-NN vs tiny net, teaching UI |
| [Granular Tilt](apps/granular-tilt/) | Grain clouds | Upload, hold freeze |
| [Video Sonifier](apps/video-sonifier/) | Environment texture | Camera → pentatonic tones · stillness fade |

Install from the hub (**Add to Home Screen**) for PWA full-screen; offline cache covers core assets.

## Workshop scenarios (20 players)

### 1. “Spectrum” (10 min)
- 8× **Drone Choir** (different chord tones)
- 6× **Motion Wah** or **Compass Wah**
- 4× **Drum Sequencer** or **Drumkit**
- 1× **Conductor** — QR + countdown

### 2. “Human ML” (15 min)
- **Train & Shake** or **Hum vs Clap** — collect labels, perform in sections.

### 3. “Synthesis tour” (20 min)
- **Synth Pad** → **Wavetable Scan** → **Filter Ladder** → **Additive Bells**

### 4. “Rhythm section”
- Split **Drumkit** / **Drum Sequencer** / **Delay Throw**; Conductor `start` + `bpm` in the musician link.

## Browsers (iOS & Android)

Use a **normal mobile browser**, not an in-app browser (Instagram, Messenger, email readers, etc.) — those often block the mic, camera, or motion sensors.

### iPhone / iPad (iOS)

| | |
|--|--|
| **Use** | **Safari** (best for workshops) |
| **Also OK** | Chrome, Firefox, Edge — all use Safari’s engine on iOS, so behaviour is similar |
| **Avoid** | In-app browsers; “Private” mode if you need saved settings between sessions |
| **Tips** | Turn the **silent switch off** (ring/vibrate mode). Tap **Allow** for mic, camera, and **Motion & Orientation** when asked. For full-screen: **Share → Add to Home Screen**, then open from the home icon |

### Android

| | |
|--|--|
| **Use** | **Chrome** (recommended) |
| **Also OK** | Firefox, Samsung Internet, Edge — test once before a big group |
| **Avoid** | In-app browsers; very old “Internet” browsers on budget phones |
| **Tips** | Allow mic/camera/motion when prompted. **Install app** or **Add to Home screen** from the browser menu for a cleaner full-screen view |

### Sensors & audio (both platforms)

| Topic | Android (Chrome) | iPhone (Safari) |
|-------|------------------|-----------------|
| Web Audio | Good | Unlocks on first tap |
| Motion | Usually automatic | Tap to allow |
| Orientation | Often available | iOS 13+ permission |
| PWA / offline | Service worker | Add to Home Screen |

## Ideas still open

See **[docs/IDEAS.md](docs/IDEAS.md)** for WebRTC room, i18n, ambient light sensor, score PDF, and more.

## License

GPL-3.0 — see [LICENSE](LICENSE).
