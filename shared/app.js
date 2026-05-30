/**
 * Shared UI helpers — learn panel, status, iOS-safe audio unlock.
 */
import { getAudioContext, unlockAudio } from "./audio.js";

const AUDIO_BADGE_ID = "audioStatus";

export function bindLearn(learnBtnId = "learnBtn", panelId = "learnPanel") {
  document.getElementById(learnBtnId)?.addEventListener("click", () => {
    document.getElementById(panelId)?.classList.toggle("open");
  });
  ensureAudioBadge(learnBtnId);
}

/** Badge in the header (after Learn, or at end of header). */
export function ensureAudioBadge(learnBtnId = "learnBtn") {
  if (document.getElementById(AUDIO_BADGE_ID)) return;
  const span = document.createElement("span");
  span.id = AUDIO_BADGE_ID;
  span.className = "audio-status";
  span.hidden = true;
  const btn = document.getElementById(learnBtnId);
  if (btn) btn.insertAdjacentElement("afterend", span);
  else document.querySelector(".app-header")?.appendChild(span);
}

export function setAudioActive(on = true) {
  const el = document.getElementById(AUDIO_BADGE_ID);
  if (!el) return;
  el.hidden = !on;
  el.textContent = on ? "Audio on" : "";
}

export function setStatus(id, text, kind = "") {
  const el = typeof id === "string" ? document.getElementById(id) : id;
  if (!el) return;
  el.textContent = text;
  el.classList.remove("ok", "warn");
  if (kind) el.classList.add(kind);
}

/** Short silent blip — call synchronously at the start of a touch handler. */
export function pingIOSUnlock(ctx) {
  const buf = ctx.createBuffer(1, 1, ctx.sampleRate);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  src.start();
  src.stop();
}

/**
 * Standard audio unlock (all instrument apps). Call from pointerdown / first play.
 * @param {(ctx: AudioContext) => void | Promise<void>} [initFn] One-shot setup (graph, mic, etc.)
 */
export async function startAudio(initFn) {
  const ctx = getAudioContext();
  pingIOSUnlock(ctx);
  await unlockAudio(ctx);
  if (initFn) await initFn(ctx);
  setAudioActive(true);
  return ctx;
}

/** Unlock audio on first tap anywhere (header, controls, stage, etc.). */
export function bindScreenAudioBoot(ensureReady, onReady) {
  document.body.addEventListener(
    "pointerdown",
    () => {
      void ensureReady().then(() => onReady?.());
    },
    { once: true, capture: true }
  );
}

/**
 * One-shot audio + app init on first user gesture (iOS-safe).
 * @param {object} [opts]
 * @param {boolean} [opts.screenTap=true] First tap anywhere on the page runs init (not only the play pad).
 */
export function createAudioBoot(initFn, { screenTap = true } = {}) {
  let done = false;
  let pending = null;

  async function ensureReady() {
    if (done) return startAudio();
    if (!pending) {
      pending = startAudio(initFn)
        .then((ctx) => {
          done = true;
          return ctx;
        })
        .catch((err) => {
          pending = null;
          throw err;
        });
    }
    return pending;
  }

  if (screenTap) bindScreenAudioBoot(ensureReady);

  return ensureReady;
}
