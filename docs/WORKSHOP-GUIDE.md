# Workshop guide — Oslo Mobile Orchestra

## Goals

- **Play together** with phones only — no cables, minimal setup.
- **Hear different music-making modes**: harmony, rhythm, gesture, timbre.
- **See under the hood**: synthesis blocks, sensors as controllers, a tiny ML pipeline.

## Before the room (15 min)

1. Test Wi‑Fi or mobile hotspot; phones need the same host URL.
2. Conductor phone: full volume, Do Not Disturb on.
3. Pre-assign roles on a slide (optional): row A = drones, row B = rhythm, etc.
4. Demo once: tap **Start sound** → iOS permission for motion if asked.

## Facilitator script (45 min)

### Warm-up (5 min)
Open hub → **Synth Pad**. Everyone finds one note. Conductor counts 1–2–3–4, all release on 4.

### Sensors (10 min)
**Motion Wah** — “Tilt = vowel.” Conductor points up/down; group sweeps together without looking at screens.

### AI (10 min)
**Train & Shake** — collect 5+ still and 5+ shake examples per phone (or pair-share one trained phone per pair).
- Ask: *What could confuse the model?* (walking, laughing, low battery throttle)
- Perform: conductor only uses hands; ensemble reacts.

### Ensemble (15 min)
1. Conductor sets 96 BPM, **Start countdown**, share link (AirDrop, QR, shout URL shortener).
2. Drones: **Drone Choir** — assign F / A♭ / C / E♭ counts (5 each).
3. Rhythm: **Pulse Grid** from conductor’s pulse link — split kick/snare/hat/tone.
4. Texture: 4 players **Granular Tilt** behind the group.

### Cool-down (5 min)
All screens down; one sustained drone from a single phone. Discuss what felt “musical” vs “tech demo.”

## Accessibility

- Large touch targets (48px+); no fine motor precision required for drones/grid.
- **Train & Shake** can be adapted: record “low” vs “high” phone position instead of shake.
- Deaf/Hard of Hearing: grid cells flash on steps; haptics on Android optional future add.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| No sound | Tap **Start sound** again; check mute switch (iOS) |
| Motion flat | Reload; Settings → Safari → Motion & Orientation |
| Out of sync | Use Conductor link; accept ~50–100 ms spread without server |
| Harsh room | Lower phone volume to 50%; fewer “shake” noise players |

## Assessment prompts (school / university)

1. Map **Synth Pad** controls to oscillator → filter signal chain.
2. Why is k-NN a form of **supervised learning**?
3. Compare **granular** clouds to **subtractive** pad — which fits ambient vs rhythmic roles?
