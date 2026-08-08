import * as THREE from 'three'
import { makeTrailTexture, makeMoteTexture } from './textures'

// ─── UFO — flying saucer with glowing engine trail ───

const EMBER = 0xf53003
const EMBER_DARK = 0xc02402
const INK = 0x1f1f1f
const GLASS = 0xf2f2f2

export function buildUFO() {
  const group = new THREE.Group()

  // ─── Materials ───
  const deckMat = new THREE.MeshStandardMaterial({
    color: EMBER,
    metalness: 0.65,
    roughness: 0.28,
    emissive: EMBER,
    emissiveIntensity: 0.2,
  })
  const underMat = new THREE.MeshStandardMaterial({
    color: INK,
    metalness: 0.6,
    roughness: 0.35,
  })
  const domeMat = new THREE.MeshPhysicalMaterial({
    color: GLASS,
    metalness: 0.05,
    roughness: 0.08,
    transparent: true,
    opacity: 0.5,
    emissive: 0xffffff,
    emissiveIntensity: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  })

  // ─── Saucer ───
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.16, 48), deckMat)
  group.add(deck)

  const rim = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.42, 0.1, 48), underMat)
  rim.position.y = -0.06
  group.add(rim)

  const lip = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.3, 0.08, 48), deckMat)
  lip.position.y = 0.12
  group.add(lip)

  // Dome
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.52, 32, 24), domeMat)
  dome.scale.set(1, 0.85, 1)
  dome.position.y = 0.32
  group.add(dome)

  const domeRing = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.03, 12, 40), deckMat)
  domeRing.rotation.x = Math.PI / 2
  domeRing.position.y = 0.14
  group.add(domeRing)

  // Underbelly
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 20), underMat)
  belly.scale.set(1.3, 0.55, 1.3)
  belly.position.y = -0.2
  group.add(belly)

  // Glowing rim ring
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xff7a2a,
    transparent: true,
    opacity: 0.9,
  })
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.38, 0.035, 12, 60), ringMat)
  ring.rotation.x = Math.PI / 2
  ring.position.y = -0.02
  group.add(ring)

  // Rim light orbs
  const orbMat = new THREE.MeshBasicMaterial({ color: 0xffb27a })
  const orbCount = 10
  for (let i = 0; i < orbCount; i++) {
    const angle = (i / orbCount) * Math.PI * 2
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), orbMat)
    orb.position.set(Math.cos(angle) * 1.38, -0.1, Math.sin(angle) * 1.38)
    group.add(orb)
  }

  // ─── Engine trail (two glow sprites trailing behind) ───
  const trailTex = makeTrailTexture()
  const trailMat = new THREE.SpriteMaterial({
    map: trailTex,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const trailA = new THREE.Sprite(trailMat)
  trailA.scale.set(2.2, 2.2, 1)
  trailA.position.set(0, -0.1, -1.8)
  group.add(trailA)

  const trailMatB = new THREE.SpriteMaterial({
    map: trailTex,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const trailB = new THREE.Sprite(trailMatB)
  trailB.scale.set(1.3, 1.3, 1)
  trailB.position.set(0, -0.05, -0.9)
  group.add(trailB)

  // Under-glow
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xff5a1a,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const underGlow = new THREE.Mesh(new THREE.CircleGeometry(1.1, 40), glowMat)
  underGlow.rotation.x = -Math.PI / 2
  underGlow.position.y = -0.38
  group.add(underGlow)

  return group
}

// ─── Floating ember motes trailing the UFO (soft, not boxy) ───
export function buildMotes(count = 140) {
  const texture = makeMoteTexture()
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10
    positions[i + 1] = (Math.random() - 0.5) * 6
    positions[i + 2] = (Math.random() - 0.5) * 8
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const mat = new THREE.PointsMaterial({
    map: texture,
    size: 0.08,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  })
  const points = new THREE.Points(geo, mat)
  points.userData.texture = texture
  return points
}
