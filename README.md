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
| [Drum Machine](apps/drums/) | Rhythm hits | 8 synthesized drum pads |
| [FM Touch Synth](apps/fm-touch/) | Timbre exploration | Touch XY → carrier + modulator (FM) |
| [FM Touch + Tilt](apps/fm-touch-tilt/) | Expressive FM | Touch pitch/amp; tilt → mod frequency |
| [Karplus–Strong String](apps/ks-string/) | Plucked strings | KS delay line; tilt → damping |
| [Synth Pad](apps/synth-pad/) | Melodic lead | Waveforms, filter, FM |
| [Motion Wah](apps/motion-wah/) | Expressive filter sweeps | Hold + tilt → band-pass wah |
| [Drone Choir](apps/drone-choir/) | Harmonic mass | Chord tone + pitch pad ±5 st, rotate to detune |
| [Train & Shake](apps/train-shake/) | Gesture performance | k-NN classifier on motion features |
| [Granular Tilt](apps/granular-tilt/) | Textures / clouds | Granular synthesis + orientation |
| [Pulse Grid](apps/pulse-grid/) | Rhythm layer | 16-step sequencer, drum synthesis |

Each app has a **Learn** panel with short explanations (where applicable). Piano, drums, FM, and KS string apps are adapted from [web_instruments/mobile](https://github.com/alexarje/web_instruments/tree/main/mobile).

## Workshop scenarios (20 players)

### 1. “Spectrum” (10 min)
- 8× **Drone Choir** (pick different chord tones)
- 6× **Motion Wah** (filter sweeps)
- 4× **Pulse Grid** (kick / hat / snare / tone)
- 1× **Conductor** — one downbeat, no rush

### 2. “Human ML” (15 min)
- Everyone on **Train & Shake**: 2 min collect still/shake examples, 5 min perform in sections (conductor mimes “still” / “shake”).
- Discuss: training data, labels, misclassification, bias (what if someone holds the phone differently?).

### 3. “Synthesis tour” (20 min)
- Stations rotate: **Synth Pad** → **Granular Tilt** → **Motion Wah**
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
- Live feature plot + confusion matrix for k-NN · compare k-NN vs tiny neural net
- “Data stays on device” ethics note for classroom discussion

### Synthesis demos
- Karplus–Strong pluck · additive bells · FM matrix · wavetable swipe

Pick one from [IDEAS.md](docs/IDEAS.md) and open a PR — or ask in an issue.

## Deploy

Push to `main` → the [Pages workflow](.github/workflows/pages.yml) deploys the site (one GitHub Actions run per push).

**One-time setup:** [Settings → Pages](https://github.com/alexarje/Oslo-Mobile-Orchestra/settings/pages) → **Build and deployment → Source:** **GitHub Actions** (not “Deploy from a branch”).

If you previously used the `gh-pages` branch, switch the source to GitHub Actions; you can delete the `gh-pages` branch afterward.

Live site: **https://alexarje.github.io/Oslo-Mobile-Orchestra/**

## License

GPL-3.0 — see [LICENSE](LICENSE).
