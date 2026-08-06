import * as THREE from 'three'

// ─── Soft radial gradient sprite textures (no boxy particles) ───

export function makeRadialTexture(inner, mid, outer) {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, inner)
  gradient.addColorStop(0.4, mid)
  gradient.addColorStop(1, outer)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// Nebula glow (large, faint)
export function makeNebulaTexture() {
  return makeRadialTexture(
    'rgba(255, 120, 60, 0.35)',
    'rgba(245, 48, 3, 0.12)',
    'rgba(245, 48, 3, 0)'
  )
}

// Warm mote (small, bright core)
export function makeMoteTexture() {
  return makeRadialTexture(
    'rgba(255, 214, 180, 1)',
    'rgba(245, 90, 30, 0.45)',
    'rgba(245, 48, 3, 0)'
  )
}

// Engine trail glow
export function makeTrailTexture() {
  return makeRadialTexture(
    'rgba(255, 200, 150, 0.9)',
    'rgba(245, 80, 20, 0.4)',
    'rgba(245, 48, 3, 0)'
  )
}

// Big ambient star bloom — higher-res, refined falloff for soft depth
export function makeStarBloomTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  gradient.addColorStop(0, 'rgba(255, 252, 248, 1)')
  gradient.addColorStop(0.15, 'rgba(255, 240, 220, 0.8)')
  gradient.addColorStop(0.4, 'rgba(255, 215, 180, 0.25)')
  gradient.addColorStop(0.7, 'rgba(255, 190, 150, 0.05)')
  gradient.addColorStop(1, 'rgba(255, 170, 120, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 256)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// Tight soft dot for far stars — small, clean, no square artifact
export function makeStarTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255, 250, 245, 1)')
  gradient.addColorStop(0.3, 'rgba(255, 235, 215, 0.6)')
  gradient.addColorStop(0.7, 'rgba(255, 210, 185, 0.1)')
  gradient.addColorStop(1, 'rgba(255, 190, 160, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// Shooting-star streak — bright warm core with a soft tail on both sides
// (symmetric so alignment is enough; the sprite gets rotated to its motion)
export function makeStreakTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 48
  const ctx = canvas.getContext('2d')
  // Horizontal core: hot white center, warm falloff to transparent ends
  const h = ctx.createLinearGradient(0, 0, 256, 0)
  h.addColorStop(0, 'rgba(255, 255, 255, 0)')
  h.addColorStop(0.2, 'rgba(255, 240, 220, 0.2)')
  h.addColorStop(0.5, 'rgba(255, 250, 245, 1)')
  h.addColorStop(0.8, 'rgba(255, 240, 220, 0.2)')
  h.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = h
  ctx.fillRect(0, 0, 256, 48)
  // Vertical falloff — lens-shaped, no hard bar edges
  const v = ctx.createLinearGradient(0, 0, 0, 48)
  v.addColorStop(0, 'rgba(0, 0, 0, 0)')
  v.addColorStop(0.5, 'rgba(0, 0, 0, 1)')
  v.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.globalCompositeOperation = 'destination-in'
  ctx.fillStyle = v
  ctx.fillRect(0, 0, 256, 48)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// Galaxy band — long horizontal streak of warm dust (interstellar band)
export function makeGalaxyBandTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  // Horizontal gradient: bright core fading to edges
  const h = ctx.createLinearGradient(0, 0, 512, 0)
  h.addColorStop(0, 'rgba(255, 200, 150, 0)')
  h.addColorStop(0.5, 'rgba(255, 220, 180, 0.9)')
  h.addColorStop(1, 'rgba(255, 200, 150, 0)')
  ctx.fillStyle = h
  ctx.fillRect(0, 0, 512, 64)
  // Vertical falloff
  const v = ctx.createLinearGradient(0, 0, 0, 64)
  v.addColorStop(0, 'rgba(0, 0, 0, 0)')
  v.addColorStop(0.5, 'rgba(0, 0, 0, 1)')
  v.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.globalCompositeOperation = 'destination-in'
  ctx.fillStyle = v
  ctx.fillRect(0, 0, 512, 64)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}
