# Ideas — Oslo Mobile Orchestra

Backlog of apps, features, and workshop concepts. Same stack as today: vanilla JS, Web Audio, static GitHub Pages, phones only.

---

## New instruments (apps)

| Idea | Music role | Tech |
|------|------------|------|
| ~~**Pentatonic Flute**~~ | Melody by breath | [flute-blow](../apps/flute-blow/) |
| ~~**Mic Theremin**~~ | Solo melody | [mic-theremin](../apps/mic-theremin/) — autocorrelation pitch |
| ~~**Hum vs Clap**~~ | Call-and-response | [hum-clap](../apps/hum-clap/) — k-NN on mic features |
| ~~**Tilt Harp**~~ | Plucked glissandi | [tilt-harp](../apps/tilt-harp/) |
| ~~**Gyro Compass**~~ | Panning in the room | removed |
| ~~**Delay Throw**~~ | Rhythmic layers | [delay-throw](../apps/delay-throw/) |
| ~~**Bow Phone**~~ | Sustained strings | [bow-phone](../apps/bow-phone/) |
| ~~**NFC / QR Part**~~ | Instant seating | [part](../apps/part/) + hub `?part=` |
| ~~**Video Sonifier**~~ | Texture from environment | [video-sonifier](../apps/video-sonifier/) |
| ~~**Audience swell**~~ | Crowd layer | [audience](../apps/audience/) |
| ~~**Compass wah**~~ | Orientation filter | [compass-wah](../apps/compass-wah/) |

---

## Enhance existing apps

- ~~**Drone Choir**~~ — hold-to-sustain; cents ruler on pad
- ~~**Motion Wah**~~ — continuous mode toggle
- ~~**Pulse Grid**~~ — removed from hub (use Drum Sequencer Linear instead)
- ~~**Train & Shake** sway + export/import~~ — [train-shake](../apps/train-shake/)
- ~~**Conductor**~~ — QR + visual metronome flash at downbeat
- ~~**Synth Pad** aftertouch~~ — [synth-pad](../apps/synth-pad/)
- ~~**Granular Tilt**~~ — hold freeze buffer; upload sample

---

## Ensemble & sync

| Idea | Why | Status |
|------|-----|--------|
| **WebRTC room** | Tighter beat than URL `start` time | Not started (needs server) |
| **WebSocket hub** | Global grid step broadcast | Not started |
| **Listen & lock** | Mic phase correction | Demo-only / deferred |
| ~~**Section colors**~~ | `?section=` on hub filters apps | Shipped |
| **Room reverb send** | Laptop reverb bus | Not started |

---

## AI & education (showcase)

- ~~Teachable panel, confusion matrix, k slider, ethics, k-NN vs tiny net~~ — [Train & Shake](../apps/train-shake/)
- ~~Hum vs clap classifier~~ — [hum-clap](../apps/hum-clap/)

---

## Sound synthesis demos

- ~~Additive bells, KS pluck, FM matrix, wavetable scan, filter ladder~~ — on hub

---

## Sensors

| Sensor | Idea | Status |
|--------|------|--------|
| Accelerometer | Shake → distortion | Partial in Train & Shake |
| Gyroscope | Vibrato / pan | Compass Wah, Motion Wah |
| Orientation | Compass wah / tilt | Compass Wah, Granular Tilt |
| Light (ambient) | Volume cap | Open |
| Proximity | Cover → mute | Open |
| Haptics | Drum Sequencer Linear steps | Android `vibrate` (optional) |
| Touch pressure | iOS force | Synth Pad |

---

## Workshop & concert

- **20-part score card** — PDF one-pager (open)
- ~~**5-minute open app ritual**~~ — Conductor `?start=` + countdown
- **Silent movement piece** — Train & Shake visual-only (facilitator)
- ~~**Audience phones**~~ — [audience](../apps/audience/)
- ~~**Accessibility mode**~~ — hub “Larger UI” + `omo-a11y` CSS

---

## Infrastructure

- ~~**PWA manifest**~~ — `manifest.webmanifest`
- ~~**Offline cache**~~ — `sw.js` (core assets)
- **i18n** — Norwegian + English
- **Telemetry opt-in** — anonymous app usage
- **Version pin** — `?v=2` for workshops

---

## Priority (suggested)

1. ~~Mic Theremin~~ — done  
2. ~~Conductor QR + sync URLs~~ — done  
3. ~~PWA / offline~~ — basic SW  
4. **WebRTC room** — when URL sync isn’t enough  
5. ~~Hum/clap classifier~~ — done (k-NN, no TF.js bundle)  

Contributions welcome: pick an open item, open a PR, link it here.
