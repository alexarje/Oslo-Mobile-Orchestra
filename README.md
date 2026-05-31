# Oslo Mobile Orchestra

A collection of patches used with [Oslo Mobile Orchestra (OMO)](https://www.uio.no/ritmo/english/research/labs/fourms/research/projects/omo/) at the Department of Musicology, University of Oslo.

OMO used to work with a collection of patches developed in PureData and deployed via MobMuPlat. This collection is using browser-based apps that use the WebAudio API. They should work on both iOS and Android phones, although there may be variations in sensors available and browser capabilities. 

**Play now:** [alexarje.github.io/Oslo-Mobile-Orchestra](https://alexarje.github.io/Oslo-Mobile-Orchestra/)

## Browsers

The apps should (in theory) work on all modern browsers, but we have seen that they generally work best with Safari on iPhone and Chrome on Android.


## Quick start

1. Open the site in a browser (not inside a communication app or email; then you should use "Open in browser" command).
2. Choose the app to play.
3. Apps will ask for different permissions, including the microphone, motion, or camera. Permissions may need to be given both within the browser and in the OS.
4. Turn up the volume to at least 70%. Turn off silent mode on iPhone.
5. In every app: **Learn** = how to play · **QR** = share this instrument with others· **Audio on** = activate sound if it doesn't start automatically.
6. Select "Add to Home Screen" for a more native-like experience.

## Instruments

| | |
|---|---|
| **Rhythm** | [Conductor](apps/conductor/) · [Drumkit](apps/drumkit/) · [Drum Sequencer Linear](apps/drum-sequencer/) · [Drum Sequencer Circular](apps/circular-drum/) · [Firefly](apps/firefly/) · [Delay Throw](apps/delay-throw/) · [Your Part](apps/part/) |
| **Drones** | [Drone Choir](apps/drone-choir/) · [Motion Wah](apps/motion-wah/) · [Compass Wah](apps/compass-wah/) · [Harmonizer](apps/harmonizer/) · [Audience Swell](apps/audience/) |
| **Melody** | [Piano](apps/piano/) · [Synth Pad](apps/synth-pad/) · [Mic Theremin](apps/mic-theremin/) · [Pentatonic Flute](apps/flute-blow/) · [Light Theremin](apps/light-theremin/) · [Tilt Harp](apps/tilt-harp/) · [Bow Phone](apps/bow-phone/) |
| **Synthesis** | [FM Touch](apps/fm-touch/) · [FM Touch + Tilt](apps/fm-touch-tilt/) · [FM Matrix](apps/fm-matrix/) · [KS String](apps/ks-string/) · [KS Pluck](apps/ks-pluck/) · [Additive Bells](apps/additive-bells/) · [Filter Ladder](apps/filter-ladder/) · [Ring Mod Gong](apps/ring-mod-gong/) |
| **Texture** | [Sampler](apps/sampler/) · [Granular Tilt](apps/granular-tilt/) · [Spectral Freeze](apps/spectral-freeze/) · [Wavetable Scan](apps/wavetable-scan/) · [Video Sonifier](apps/video-sonifier/) |
| **AI** | [Train & Shake](apps/train-shake/) · [Hum vs Clap](apps/hum-clap/) · [Evo Drumkit](apps/evo-drumkit/) |

## Documentation

| Resource | Contents |
|----------|----------|
| **[Wiki](https://github.com/alexarje/Oslo-Mobile-Orchestra/wiki)** | Full app catalog, workshop scripts, browsers & sensors, ensemble sync (Firefly, Harmonizer, Conductor), architecture |
| [Workshop guide](docs/WORKSHOP-GUIDE.md) | 45-minute facilitator script (in-repo copy) |
| [Ideas](docs/IDEAS.md) | Future features |

## License

[GPL-3.0](LICENSE)
