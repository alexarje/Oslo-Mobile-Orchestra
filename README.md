# Oslo Mobile Orchestra

Web-based instruments for musicians using only their phones (Android + iPhone). Open in the browser and **tap to play** — audio starts on first touch; allow mic or motion when prompted.

**Live site:** https://alexarje.github.io/Oslo-Mobile-Orchestra/

**Workshop script:** [docs/WORKSHOP-GUIDE.md](docs/WORKSHOP-GUIDE.md) · **Future ideas:** [docs/IDEAS.md](docs/IDEAS.md)

## Apps

| App | Music making | Tech highlight |
|-----|----------------|----------------|
| [Conductor](apps/conductor/) | Shared downbeat | URL-encoded start time + BPM |
| [Pentatonic Flute](apps/flute-blow/) | Melody by breath | Mic level → sound; slide → pentatonic pitch |
| [Piano](apps/piano/) | Melody / harmony | Web Audio keyboard + reverb |
| [Drumkit](apps/drumkit/) | Rhythm hits | 8 synthesized drum pads |
| [Drum Sequencer](apps/drum-sequencer/) | Patterns | 4 sounds × 8 steps |
| [Sampler](apps/sampler/) | Loop textures | Hold to record mic · release loops · tilt FX |
| [FM Touch Synth](apps/fm-touch/) | Timbre exploration | Touch XY → carrier + modulator (FM) |
| [FM Touch + Tilt](apps/fm-touch-tilt/) | Expressive FM | Touch pitch/amp; tilt → mod frequency |
| [Karplus–Strong String](apps/ks-string/) | Plucked strings | KS delay line; tilt → damping |
| [Synth Pad](apps/synth-pad/) | Melodic lead | Waveforms, filter, FM, aftertouch (force / touch size) |
| [Additive Bells](apps/additive-bells/) | Bell tones | 8 partials, sliders per harmonic |
| [KS Pluck](apps/ks-pluck/) | Plucked string | Tap-to-excite Karplus–Strong delay line |
| [FM Matrix](apps/fm-matrix/) | FM timbres | 2×2 routing presets for workshop |
| [Wavetable Scan](apps/wavetable-scan/) | Timbral sweep | Swipe through single-cycle waves |
| [Filter Ladder](apps/filter-ladder/) | Subtractive sweep | 24 dB lowpass + tilt envelope |
| [Motion Wah](apps/motion-wah/) | Expressive filter sweeps | Hold + tilt → band-pass wah |
| [Drone Choir](apps/drone-choir/) | Harmonic mass | Chord tone + pitch pad ±5 st, rotate to detune |
| [Train & Shake](apps/train-shake/) | Gesture performance | k-NN vs tiny net; feature plot, confusion matrix, ethics panel |
| [Granular Tilt](apps/granular-tilt/) | Textures / clouds | Granular synthesis + orientation |
| [Photo Sonifier](apps/photo-sonifier/) | Texture from environment | Camera brightness map → grain density (consent / workshop mode) |
| [Pulse Grid](apps/pulse-grid/) | Rhythm layer | 16-step sequencer, drum synthesis |

Each app has a **Learn** panel with short explanations (where applicable). Piano, drumkit, FM, and KS string apps are adapted from [web_instruments/mobile](https://github.com/alexarje/web_instruments/tree/main/mobile).

## Workshop scenarios (20 players)

### 1. “Spectrum” (10 min)
- 8× **Drone Choir** (pick different chord tones)
- 6× **Motion Wah** (filter sweeps)
- 4× **Pulse Grid** (kick / hat / snare / tone)
- 1× **Conductor** — one downbeat, no rush

### 2. “Human ML” (15 min)
- Everyone on **Train & Shake**: collect still / sway / shake (3+ each), or **import** a teacher’s demo set; perform in three sections.
- Discuss: training data, labels, misclassification, bias (what if someone holds the phone differently?).

### 3. “Synthesis tour” (20 min)
- Stations rotate: **Synth Pad** → **Wavetable Scan** → **Filter Ladder** → **Additive Bells**
- Same melody idea, three timbral worlds.

### 4. “Grid orchestra”
- Assign sound colors: 5 kick, 5 snare, 5 hat, 5 tone — each writes a 1-bar pattern.
- Conductor link → **Pulse Grid** with shared `start` + `bpm` query params.

## Browser & sensor notes

| Topic | Android (Chrome) | iPhone (Safari) |
|-------|------------------|-----------------|
| Web Audio | Good | Unlocks on first tap in each app |
| Motion | Usually automatic | Tap to allow when prompted |
| Orientation | Often available | iOS 13+ permission dialog |
| Silent switch | N/A | Physical mute affects speaker |
| Battery saver | May throttle timers | Keep screen on, low power mode off |

All apps use **Web Audio API** and standard **DeviceMotion** / **DeviceOrientation** — no native wrappers.

## Ideas to add next

Full backlog with tables and priorities: **[docs/IDEAS.md](docs/IDEAS.md)**

### New apps
- ~~**Mic flute**~~ → [Pentatonic Flute](apps/flute-blow/) (breath gate + pentatonic slide)
- **Mic theremin** — microphone pitch → continuous tone (chromatic)
- **Hum vs clap** — TensorFlow.js speech / audio classifier
- **Gyro compass** — orientation → stereo pan (spatial ensemble)
- **QR part assignment** — scan on stage → `?part=12` + suggested instrument

### Ensemble
- **WebRTC or WebSocket room** — tighter sync than URL countdown alone
- **Conductor QR** — share musician link without typing
- **Pattern in URL** — Pulse Grid pattern encoded in hash for copy/paste

### Existing app upgrades
- Pulse Grid pattern share · Train & Shake third gesture class · PWA “Add to Home Screen” · offline service worker
- Haptics on steps (Android) · accessibility mode (larger UI, high contrast)

### Education & AI showcase
- ~~Live feature plot + confusion matrix~~ — in [Train & Shake](apps/train-shake/)
- “Data stays on device” ethics note for classroom discussion

### Synthesis demos
- Karplus–Strong pluck · additive bells · FM matrix · wavetable swipe

Pick one from [IDEAS.md](docs/IDEAS.md) and open a PR — or ask in an issue.


## License

GPL-3.0 — see [LICENSE](LICENSE).
