/**
 * 2nd-order Markov chain over scale degrees (pentatonic default).
 */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/**
 * @param {{ scale?: number[], order?: number }} [opts]
 */
export function createMarkovMelody(opts = {}) {
  const scale = opts.scale ?? [0, 2, 4, 7, 9];
  const order = opts.order ?? 2;
  const counts = new Map();
  let history = [];
  let total = 0;

  function keyFromHistory(h) {
    return h.join(",");
  }

  function observeDegree(degIndex) {
    const d = clamp(Math.round(degIndex), 0, scale.length - 1);
    if (history.length >= order) {
      const k = keyFromHistory(history.slice(-order));
      const row = counts.get(k) || new Map();
      row.set(d, (row.get(d) || 0) + 1);
      counts.set(k, row);
      total++;
    }
    history.push(d);
    if (history.length > order * 4) history.shift();
  }

  function sample() {
    if (history.length < order || total < 2) {
      return Math.floor(Math.random() * scale.length);
    }
    const k = keyFromHistory(history.slice(-order));
    const row = counts.get(k);
    if (!row || row.size === 0) {
      return Math.floor(Math.random() * scale.length);
    }
    let sum = 0;
    for (const v of row.values()) sum += v;
    let r = Math.random() * sum;
    for (const [deg, c] of row) {
      r -= c;
      if (r <= 0) {
        history.push(deg);
        if (history.length > order * 4) history.shift();
        return deg;
      }
    }
    const first = [...row.keys()][0];
    history.push(first);
    return first;
  }

  function reset() {
    counts.clear();
    history = [];
    total = 0;
  }

  function getScale() {
    return scale;
  }

  function trainingSize() {
    return total;
  }

  return { observeDegree, sample, reset, getScale, trainingSize };
}
