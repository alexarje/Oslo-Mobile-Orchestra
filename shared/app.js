/**
 * Shared UI helpers — learn panel, status, tap-to-start audio boot.
 */
import { getAudioContext, unlockAudio } from "./audio.js";

export function bindLearn(learnBtnId = "learnBtn", panelId = "learnPanel") {
  document.getElementById(learnBtnId)?.addEventListener("click", () => {
    document.getElementById(panelId)?.classList.toggle("open");
  });
}

export function setStatus(id, text, kind = "") {
  const el = typeof id === "string" ? document.getElementById(id) : id;
  if (!el) return;
  el.textContent = text;
  el.classList.remove("ok", "warn");
  if (kind) el.classList.add(kind);
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
    if (done) {
      const ctx = getAudioContext();
      await unlockAudio(ctx);
      return ctx;
    }
    if (!pending) {
      pending = (async () => {
        try {
          const ctx = getAudioContext();
          await unlockAudio(ctx);
          await initFn(ctx);
          done = true;
          return ctx;
        } catch (err) {
          pending = null;
          throw err;
        }
      })();
    }
    return pending;
  }

  if (screenTap) {
    bindScreenAudioBoot(ensureReady);
  }

  return ensureReady;
}

export function pingIOSUnlock(ctx) {
  const buf = ctx.createBuffer(1, 1, ctx.sampleRate);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  src.start();
  src.stop();
}
