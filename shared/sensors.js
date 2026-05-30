/**
 * Device motion/orientation with iOS 13+ permission flow.
 */

let motionHandler = null;
let orientationHandler = null;

export function needsMotionPermission() {
  return typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function";
}

export async function requestMotionPermission() {
  if (!needsMotionPermission()) return true;
  try {
    const r = await DeviceMotionEvent.requestPermission();
    return r === "granted";
  } catch {
    return false;
  }
}

export async function requestOrientationPermission() {
  if (typeof DeviceOrientationEvent === "undefined" || typeof DeviceOrientationEvent.requestPermission !== "function") {
    return true;
  }
  try {
    const r = await DeviceOrientationEvent.requestPermission();
    return r === "granted";
  } catch {
    return false;
  }
}

/**
 * @param {{ needMotion?: boolean, needOrientation?: boolean }} [opts]
 */
export async function enableSensors({ needMotion = true, needOrientation = true } = {}) {
  const m = !needMotion || (await requestMotionPermission());
  const o = !needOrientation || (await requestOrientationPermission());
  return m && o;
}

let sensorPrime = null;

/** Start permission requests on the same user gesture (before any await). */
export function primeSensors(opts) {
  if (!sensorPrime) {
    sensorPrime = enableSensors(opts).catch(() => {
      sensorPrime = null;
      return false;
    });
  }
  return sensorPrime;
}

/**
 * @param {(data: { x: number, y: number, z: number, alpha?: number, beta?: number, gamma?: number }) => void} callback
 */
export function onMotion(callback) {
  motionHandler = (e) => {
    const a = e.accelerationIncludingGravity || e.acceleration;
    if (!a) return;
    callback({
      x: a.x ?? 0,
      y: a.y ?? 0,
      z: a.z ?? 0,
      alpha: e.rotationRate?.alpha,
      beta: e.rotationRate?.beta,
      gamma: e.rotationRate?.gamma,
    });
  };
  window.addEventListener("devicemotion", motionHandler, { passive: true });
}

export function onOrientation(callback) {
  if (orientationHandler) {
    window.removeEventListener("deviceorientation", orientationHandler);
    window.removeEventListener("deviceorientationabsolute", orientationHandler);
  }
  orientationHandler = (e) => {
    let alpha = e.alpha;
    if ((alpha == null || Number.isNaN(alpha)) && typeof e.webkitCompassHeading === "number") {
      alpha = e.webkitCompassHeading;
    }
    callback({
      alpha: alpha ?? 0,
      beta: e.beta ?? 0,
      gamma: e.gamma ?? 0,
      absolute: !!e.absolute,
    });
  };
  window.addEventListener("deviceorientation", orientationHandler, { passive: true });
  window.addEventListener("deviceorientationabsolute", orientationHandler, { passive: true });
}

export function stopSensors() {
  if (motionHandler) window.removeEventListener("devicemotion", motionHandler);
  if (orientationHandler) {
    window.removeEventListener("deviceorientation", orientationHandler);
    window.removeEventListener("deviceorientationabsolute", orientationHandler);
  }
  motionHandler = null;
  orientationHandler = null;
  sensorPrime = null;
}

/** Normalize accel to roughly -1..1 for portrait hold */
export function normalizeAccel(x, y, z) {
  const mag = Math.sqrt(x * x + y * y + z * z) || 1;
  return { x: x / mag, y: y / mag, z: z / mag, mag };
}
