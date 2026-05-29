# Oslo Mobile Orchestra

Web-based instruments for **~20 musicians using only their phones** (Android + iPhone). No app store install — open in the browser, tap **Start sound**, and play.

Built for workshops and concerts where you want to explore **different ways of making music**, **sound synthesis**, **phone sensors**, and **simple on-device AI**.

## Quick start

1. Host this folder on any static server, or open locally:
   ```bash
   cd Oslo-Mobile-Orchestra
   python3 -m http.server 8080
   ```
2. On each phone, open `http://<your-computer-ip>:8080/`
3. For ensemble timing, one person uses **Conductor** and shares the musician link.

### GitHub Pages

Live site (after deploy): **https://alexarje.github.io/Oslo-Mobile-Orchestra/**

1. Push this repo to `main` on GitHub.
2. In the repo: **Settings → Pages → Build and deployment → Source** → choose **GitHub Actions**.
3. The [Pages workflow](.github/workflows/pages.yml) runs on every push to `main`; first deploy may take 1–2 minutes.
4. Share the URL above with musicians (works over HTTPS — required for motion sensors on iOS).

To redeploy manually: **Actions → Deploy GitHub Pages → Run workflow**.

## Apps

| App | Music making | Tech highlight |
|-----|----------------|----------------|
| [Conductor](apps/conductor/) | Shared downbeat | URL-encoded start time + BPM |
| [Synth Pad](apps/synth-pad/) | Melodic lead | Waveforms, filter, FM |
| [Motion Wah](apps/motion-wah/) | Expressive filter sweeps | Accelerometer → resonant bandpass |
| [Drone Choir](apps/drone-choir/) | Harmonic mass | Orientation → microtonal detune |
| [Train & Shake](apps/train-shake/) | Gesture performance | k-NN classifier on motion features |
| [Granular Tilt](apps/granular-tilt/) | Textures / clouds | Granular synthesis + orientation |
| [Pulse Grid](apps/pulse-grid/) | Rhythm layer | 16-step sequencer, drum synthesis |

Each app has a **Learn** panel with short explanations for performers and audience.

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
| Web Audio | Good | Requires user tap to start (`Start sound`) |
| Motion | Usually automatic | Tap to allow when prompted |
| Orientation | Often available | iOS 13+ permission dialog |
| Silent switch | N/A | Physical mute affects speaker |
| Battery saver | May throttle timers | Keep screen on, low power mode off |

All apps use **Web Audio API** and standard **DeviceMotion** / **DeviceOrientation** — no native wrappers.

## Ideas to add next

These fit the same stack (vanilla JS, static hosting):

- **Mic pitch** — `getUserMedia` + autocorrelation (monophonic “theremin”)
- **TensorFlow.js** — pretrained [speech commands](https://github.com/tensorflow/tfjs-models/tree/master/speech-commands) for “noise vs hum”
- **Web MIDI / Bluetooth** — limited on iOS; optional for hybrid setups
- **Peer sync** — [WebRTC](https://peerjs.com/) or a tiny WebSocket room server for beat phase (tighter than URL start time)
- **NFC / QR sections** — QR on stage assigns part numbers 1–20
- **Haptics** — `navigator.vibrate` on steps (Android mainly)

## Project structure

```
index.html          # Hub
shared/             # audio.js, sensors.js, ml.js, ui.css
apps/
  conductor/
  synth-pad/
  motion-wah/
  drone-choir/
  train-shake/
  granular-tilt/
  pulse-grid/
```

## License

GPL-3.0 — see [LICENSE](LICENSE).
