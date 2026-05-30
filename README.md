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
| [Drum Sequencer](apps/drum-sequencer/) | Patterns | 4×8 steps |
| [Pulse Grid](apps/pulse-grid/) | Rhythm layer | 16-step seq, hash share, haptics |
| [Delay Throw](apps/delay-throw/) | Echo layers | Tap sample + tilt delay |
| [Sampler](apps/sampler/) | Loop textures | Mic loop + tilt FX |
| [FM Touch / + Tilt](apps/fm-touch/) | FM timbre | Touch + optional tilt mod |
| [FM Matrix](apps/fm-matrix/) | FM routing | 2×2 presets |
| [KS String / Pluck](apps/ks-string/) | Plucked strings | Karplus–Strong |
| [Synth Pad](apps/synth-pad/) | Melodic lead | Waveforms, filter, aftertouch |
| [Additive Bells](apps/additive-bells/) | Bell tones | 8 partials |
| [Wavetable Scan](apps/wavetable-scan/) | Timbral sweep | Swipe waves |
| [Filter Ladder](apps/filter-ladder/) | Subtractive | 24 dB LP + tilt |
| [Motion Wah](apps/motion-wah/) | Filter sweeps | Hold or continuous + tilt |
| [Compass Wah](apps/compass-wah/) | Orientation filter | Alpha → lowpass |
| [Drone Choir](apps/drone-choir/) | Harmonic mass | Hold sustain, ±5 st pad, cents |
| [Gyro Compass](apps/gyro-compass/) | Spatial pan | Heading → stereo |
| [Tilt Harp](apps/tilt-harp/) | Gliss plucks | Tap strings, tilt = key |
| [Bow Phone](apps/bow-phone/) | Bowed tone | Drag X/Y pressure + pitch |
| [Train & Shake](apps/train-shake/) | Gesture ML | k-NN vs tiny net, teaching UI |
| [Granular Tilt](apps/granular-tilt/) | Grain clouds | Upload, hold freeze |
| [Photo Sonifier](apps/photo-sonifier/) | Environment texture | Camera → grain density |

Install from the hub (**Add to Home Screen**) for PWA full-screen; offline cache covers core assets.

## Workshop scenarios (20 players)

### 1. “Spectrum” (10 min)
- 8× **Drone Choir** (different chord tones)
- 6× **Motion Wah** or **Compass Wah**
- 4× **Pulse Grid** (kick / hat / snare / tone)
- 1× **Conductor** — QR + countdown

### 2. “Human ML” (15 min)
- **Train & Shake** or **Hum vs Clap** — collect labels, perform in sections.

### 3. “Synthesis tour” (20 min)
- **Synth Pad** → **Wavetable Scan** → **Filter Ladder** → **Additive Bells**

### 4. “Grid orchestra”
- Assign colors on **Pulse Grid**; share patterns via URL hash; Conductor `start` + `bpm`.

### 5. “Spatial circle”
- 20× **Gyro Compass** — each phone pans by compass heading in the room.

## Browser & sensor notes

| Topic | Android (Chrome) | iPhone (Safari) |
|-------|------------------|-----------------|
| Web Audio | Good | Unlocks on first tap |
| Motion | Usually automatic | Tap to allow |
| Orientation | Often available | iOS 13+ permission |
| PWA / offline | Service worker | Add to Home Screen |
| Haptics | Pulse Grid vibrate | Limited |

## Ideas still open

See **[docs/IDEAS.md](docs/IDEAS.md)** for WebRTC room, i18n, ambient light sensor, score PDF, and more.

## License

GPL-3.0 — see [LICENSE](LICENSE).
