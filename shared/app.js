/**
 * Shared UI helpers — learn panel, status, iOS-safe audio unlock.
 */
import { getAudioContext, primeMicStream, unlockAudio } from "./audio.js";

const AUDIO_TOGGLE_ID = "audioToggle";
const HEADER_CONTROLS_ID = "headerControls";
let audioOn = false;
let optionalBootFn = null;
let bootNeedsMic = false;

/** Group Learn + Audio on/off in the header (upper right). */
export function initHeaderControls() {
  const header = document.querySelector(".app-header, .hub-header");
  if (!header || document.getElementById(HEADER_CONTROLS_ID)) return;

  const wrap = document.createElement("div");
  wrap.className = "header-controls";
  wrap.id = HEADER_CONTROLS_ID;

  const panel = document.getElementById("learnPanel");
  let learnBtn = document.getElementById("learnBtn");
  if (panel) {
    if (!learnBtn) {
      learnBtn = document.createElement("button");
      learnBtn.type = "button";
      learnBtn.id = "learnBtn";
      learnBtn.className = "learn-toggle";
      learnBtn.textContent = "Learn";
    } else {
      learnBtn.remove();
    }
    wrap.appendChild(learnBtn);
  }

  if (!document.getElementById(AUDIO_TOGGLE_ID)) {
    const audioWrap = document.createElement("div");
    audioWrap.className = "audio-toggle-wrap";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = AUDIO_TOGGLE_ID;
    btn.className = "audio-toggle is-off";
    btn.setAttribute("aria-pressed", "false");
    btn.setAttribute("aria-label", "Audio off");
    btn.innerHTML = '<span class="audio-toggle-label">Audio off</span>';
    btn.addEventListener("click", () => {
      void (audioOn ? setAudioOff() : setAudioOn());
    });
    audioWrap.appendChild(btn);
    wrap.appendChild(audioWrap);
    setAudioActive(false);
  }

  if (wrap.childElementCount > 0) header.appendChild(wrap);
}

export function bindLearn(learnBtnId = "learnBtn", panelId = "learnPanel") {
  initHeaderControls();
  const btn = document.getElementById(learnBtnId);
  const panel = document.getElementById(panelId);
  btn?.addEventListener("click", () => {
    panel?.classList.toggle("open");
    const open = panel?.classList.contains("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  btn?.setAttribute("aria-controls", panelId);
}

/** Optional full setup (mic, graph) when user turns audio on from the header toggle. */
export function registerAudioBoot(fn, { mic = false } = {}) {
  optionalBootFn = fn;
  bootNeedsMic = mic;
}

/** @deprecated Use initHeaderControls */
export function initAudioToggle() {
  initHeaderControls();
}

/** @deprecated Use initHeaderControls */
export function ensureAudioBadge() {
  initHeaderControls();
}

export function isAudioActive() {
  return audioOn;
}

export function setAudioActive(on = true) {
  audioOn = !!on;
  const btn = document.getElementById(AUDIO_TOGGLE_ID);
  if (!btn) return;
  btn.classList.toggle("is-on", audioOn);
  btn.classList.toggle("is-off", !audioOn);
  btn.setAttribute("aria-pressed", String(audioOn));
  btn.setAttribute("aria-label", audioOn ? "Audio on" : "Audio off");
  const label = btn.querySelector(".audio-toggle-label");
  if (label) label.textContent = audioOn ? "Audio on" : "Audio off";
}

export async function setAudioOn() {
  if (bootNeedsMic) primeMicStream();
  return startAudio(optionalBootFn || undefined);
}

export async function setAudioOff() {
  const ctx = getAudioContext();
  try {
    if (ctx.state === "running") await ctx.suspend();
  } catch {
    /* ignore */
  }
  setAudioActive(false);
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
export function bindScreenAudioBoot(ensureReady, onReady, { mic = false } = {}) {
  document.body.addEventListener(
    "pointerdown",
    () => {
      if (mic) primeMicStream();
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
export function createAudioBoot(initFn, { screenTap = true, mic = false } = {}) {
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

  if (screenTap) bindScreenAudioBoot(ensureReady, undefined, { mic });

  return ensureReady;
}

function autoInitHeaderControls() {
  if (document.querySelector(".app-header, .hub-header")) initHeaderControls();
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInitHeaderControls);
  } else {
    autoInitHeaderControls();
  }
}
