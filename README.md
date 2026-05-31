# Oslo Mobile Orchestra

A collection of patches used with [Oslo Mobile Orchestra (OMO)](https://www.uio.no/ritmo/english/research/labs/fourms/research/projects/omo/) at the Department of Musicology, University of Oslo.

OMO used to work with a collection of patches developed in PureData and deployed via MobMuPlat. This collection is using browser-based apps that use the WebAudio API. They should work on both iOS and Android phones, although there may be variations in sensors available and browser capabilities. 

**Play now:** [alexarje.github.io/Oslo-Mobile-Orchestra](https://alexarje.github.io/Oslo-Mobile-Orchestra/)

## Browsers

The apps should (in theory) work on all modern browsers, but we have seen that they generally work best with Safari on iPhone and Chrome on Android.


## Quick start

1. Open the site in a browser (not inside a communication app or email; then you should use "Open in browser" command).
2. Choose the app to play — each card lists **synthesis** and **sensors**. Several apps combine former variants behind a **mode** menu (old URLs still redirect).
3. Apps will ask for different permissions, including the microphone, motion, or camera. Permissions may need to be given both within the browser and in the OS.
4. Turn up the volume to at least 70%. Turn off silent mode on iPhone.
5. In every app: **Learn** = how to play · **QR** = share this instrument with others· **Audio on** = activate sound if it doesn't start automatically.
6. Select "Add to Home Screen" for a more native-like experience.

## Instruments

| | |
|---|---|
| **Rhythm** | [Conductor](apps/conductor/) · [Drum Kit](apps/drumkit/) · [Step Lane](apps/drum-sequencer/) · [Orbit Groove](apps/circular-drum/) · [Pulse Lattice](apps/euclidean-rings/) · [Fractal Lane](apps/lsystem-groove/) · [Firefly Sync](apps/firefly/) · [Echo Toss](apps/delay-throw/) · [Seat Ticket](apps/part/) |
| **Drones** | [Held Voices](apps/drone-choir/) · [Motion Filter](apps/compass-wah/) · [Sabre Pulse](apps/sound-saber/) · [Neighbourhood Chord](apps/harmonizer/) · [Murmuration](apps/audience/) · [Endless Rise](apps/shepard-glide/) |
| **Melody** | [Glass Keys](apps/piano/) · [Wedge Lead](apps/synth-pad/) · [Humming Stone](apps/mic-theremin/) · [Breath Flute](apps/flute-blow/) · [Chain Melody](apps/markov-melody/) · [Shadow Tone](apps/light-theremin/) · [Gravity Harp](apps/tilt-harp/) · [Selfie Bow](apps/bow-phone/) |
| **Synthesis** | [FM Fingerpaint](apps/fm-touch/) · [FM Patchbay](apps/fm-matrix/) · [Resonant Wire](apps/ks-string/) · [Blade Chorus](apps/supersaw-stack/) · [Harmonic Bells](apps/additive-bells/) · [Ladder Groan](apps/filter-ladder/) · [Bronze Clang](apps/ring-mod-gong/) |
| **Texture** | [Field Catcher](apps/sampler/) · [Dust Drift](apps/granular-tilt/) · [Prism Hold](apps/spectral-freeze/) · [Strange Attractor](apps/chaos-attractor/) · [Arcade Static](apps/bit-crush-pad/) · [Delay Maze](apps/feedback-matrix/) · [Wave Rider](apps/wavetable-scan/) · [Motion Cam](apps/video-sonifier/) |
| **AI** | [Gesture School](apps/train-shake/) · [Call & Clap](apps/hum-clap/) · [Groove Gene](apps/evo-drumkit/) |

## Documentation

| Resource | Contents |
|----------|----------|
| **[Wiki](https://github.com/alexarje/Oslo-Mobile-Orchestra/wiki)** | Full app catalog, workshop scripts, browsers & sensors, ensemble sync, architecture |
| [Workshop guide](docs/WORKSHOP-GUIDE.md) | 45-minute facilitator script (in-repo copy) |
| [Ideas](docs/IDEAS.md) | Backlog (most instrument rows now shipped) |
| [Device support](support.html) | Sensor API checklist before workshops |

## License

[GPL-3.0](LICENSE)
