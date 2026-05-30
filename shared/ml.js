/**
 * Tiny in-browser classifier — no server, educational k-NN + optional 2-layer net.
 * Features are normalized vectors; labels are strings.
 */

export class KNNClassifier {
  constructor(k = 3) {
    this.k = k;
    this.samples = [];
  }

  addSample(features, label) {
    this.samples.push({ features: features.slice(), label });
  }

  clear() {
    this.samples = [];
  }

  get labels() {
    return [...new Set(this.samples.map((s) => s.label))];
  }

  predict(features) {
    if (this.samples.length === 0) return { label: null, confidence: 0 };
    const dists = this.samples.map((s) => ({
      label: s.label,
      d: euclidean(features, s.features),
    }));
    dists.sort((a, b) => a.d - b.d);
    const votes = {};
    const k = Math.min(this.k, dists.length);
    for (let i = 0; i < k; i++) {
      votes[dists[i].label] = (votes[dists[i].label] || 0) + 1;
    }
    let best = null;
    let bestCount = 0;
    for (const [label, count] of Object.entries(votes)) {
      if (count > bestCount) {
        bestCount = count;
        best = label;
      }
    }
    return { label: best, confidence: bestCount / k };
  }
}

function euclidean(a, b) {
  let s = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) s += (a[i] - b[i]) ** 2;
  return Math.sqrt(s);
}

/** Running mean/std for feature normalization */
export class FeatureNormalizer {
  constructor(dim) {
    this.dim = dim;
    this.count = 0;
    this.mean = new Float32Array(dim);
    this.m2 = new Float32Array(dim);
  }

  push(features) {
    this.count++;
    for (let i = 0; i < this.dim; i++) {
      const x = features[i];
      const d = x - this.mean[i];
      this.mean[i] += d / this.count;
      const d2 = x - this.mean[i];
      this.m2[i] += d * d2;
    }
  }

  normalize(features) {
    if (this.count < 2) return features.slice();
    const out = new Float32Array(this.dim);
    for (let i = 0; i < this.dim; i++) {
      const v = this.m2[i] / (this.count - 1);
      const std = Math.sqrt(v) || 1;
      out[i] = (features[i] - this.mean[i]) / std;
    }
    return Array.from(out);
  }
}

export function extractMotionFeatures({ x, y, z }, history = []) {
  const { mag } = { mag: Math.sqrt(x * x + y * y + z * z) };
  const hist = history.slice(-8);
  let variance = 0;
  if (hist.length > 1) {
    const m = hist.reduce((a, b) => a + b, 0) / hist.length;
    variance = hist.reduce((a, b) => a + (b - m) ** 2, 0) / hist.length;
  }
  return [x / 10, y / 10, z / 10, mag / 10, Math.sqrt(variance) / 5];
}

/** @typedef {{ version: number, app: string, k: number, featureDim: number, normalizer: object, samples: { label: string, features: number[] }[] }} TrainingSetExport */

export function exportTrainingSet(classifier, normalizer, extra = {}) {
  return {
    version: 1,
    app: "omo-train-shake",
    k: classifier.k,
    featureDim: normalizer.dim,
    normalizer: {
      count: normalizer.count,
      mean: Array.from(normalizer.mean),
      m2: Array.from(normalizer.m2),
    },
    samples: classifier.samples.map((s) => ({
      label: s.label,
      features: s.features.slice(),
    })),
    exportedAt: new Date().toISOString(),
    ...extra,
  };
}

/**
 * @param {unknown} data
 * @param {KNNClassifier} classifier
 * @param {FeatureNormalizer} normalizer
 * @returns {string|null} Error message, or null on success
 */
export function importTrainingSet(data, classifier, normalizer) {
  if (!data || typeof data !== "object") return "Invalid file";
  const d = /** @type {TrainingSetExport} */ (data);
  if (d.app !== "omo-train-shake" || d.version !== 1) return "Not a Train & Shake dataset";
  if (!Array.isArray(d.samples) || d.samples.length === 0) return "No samples in file";
  if (!d.normalizer || d.normalizer.count < 2) return "Missing normalizer stats";

  classifier.k = typeof d.k === "number" ? d.k : classifier.k;
  classifier.clear();
  normalizer.count = d.normalizer.count;
  normalizer.mean = new Float32Array(d.normalizer.mean);
  normalizer.m2 = new Float32Array(d.normalizer.m2);

  for (const s of d.samples) {
    if (!s.label || !Array.isArray(s.features) || s.features.length !== normalizer.dim) {
      return "Bad sample in file";
    }
    classifier.addSample(s.features, s.label);
  }
  return null;
}
