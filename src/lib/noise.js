// ─── noise.js — seeded value noise + FBM (fractal Brownian motion) ───
// The building block for procedural "organic" textures like cosmic
// clouds. Random numbers are chaotic; NOISE is random-but-smooth —
// nearby points return nearby values, which is what makes blobs instead
// of static.
//
// Value noise: a lattice of random values. Any point between lattice
// corners is bilinearly interpolated with a smoothstep curve, so the
// result flows instead of stair-stepping.
//
// FBM (fractal Brownian motion): value noise summed over several
// octaves — each octave doubles the frequency and halves the amplitude.
// Low octaves shape the big blobs, high octaves add the wispy detail.
// This is the exact same idea GLSL shaders use — we just run it on the
// CPU, once, into a lookup grid, instead of per-pixel on the GPU.

// Deterministic hash → [0,1) from a lattice cell + seed. No tables, no
// allocations: pure bit-mixing, so the same seed always yields the same
// cloud (stable across resizes / reloads).
function hash2(x, y, seed) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 69069)) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h = (h ^ (h >>> 16)) >>> 0
  return h / 4294967296
}

// smoothstep — the interpolation curve used between lattice corners.
// Linear lerping leaves visible "grid" artifacts; this eases them away.
const smoothstep = (t) => t * t * (3 - 2 * t)

/**
 * createNoise(seed) → { noise2, fbm }
 *
 * noise2(x, y) → [0,1]  — one octave of value noise
 * fbm(x, y, octaves) → [0,1] — fractal Brownian motion, normalized
 */
export function createNoise(seed = 1337) {
  // Value of the lattice corner at integer cell (ix, iy)
  const lattice = (ix, iy) => hash2(ix, iy, seed)

  function noise2(x, y) {
    const ix = Math.floor(x)
    const iy = Math.floor(y)
    const fx = x - ix // fractional part, 0..1
    const fy = y - iy
    const sx = smoothstep(fx)
    const sy = smoothstep(fy)

    const a = lattice(ix, iy)
    const b = lattice(ix + 1, iy)
    const c = lattice(ix, iy + 1)
    const d = lattice(ix + 1, iy + 1)

    // Bilinear interpolation: lerp top edge, lerp bottom edge, lerp between.
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
  }

  function fbm(x, y, octaves = 4) {
    let sum = 0
    let amp = 0.5 // first octave weight
    let freq = 1
    let norm = 0
    for (let i = 0; i < octaves; i++) {
      sum += noise2(x * freq, y * freq) * amp
      norm += amp
      amp *= 0.5
      freq *= 2
    }
    return sum / norm // normalize back to [0,1]
  }

  return { noise2, fbm }
}
