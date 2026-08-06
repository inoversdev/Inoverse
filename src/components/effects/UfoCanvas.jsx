import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ─── UFO — classic flying saucer built from the Inovers logo silhouette ───
// Saucer: wide ember disc + glass dome + dark underbelly + glowing rim ring.
// Studio presentation: soft ground glow pedestal, warm light motes.

const EMBER = 0xf53003
const EMBER_DARK = 0xc02402
const INK = 0x211f1b
const GLASS = 0xffd9c9

// Soft radial sprite texture for light motes (round, not boxy)
function makeMoteTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255, 210, 180, 1)')
  gradient.addColorStop(0.35, 'rgba(245, 90, 30, 0.55)')
  gradient.addColorStop(0.7, 'rgba(245, 48, 3, 0.15)')
  gradient.addColorStop(1, 'rgba(245, 48, 3, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function buildUFO() {
  const group = new THREE.Group()

  // ─── Materials ───
  const deckMat = new THREE.MeshStandardMaterial({
    color: EMBER,
    metalness: 0.65,
    roughness: 0.28,
    emissive: EMBER,
    emissiveIntensity: 0.15,
    flatShading: false,
  })
  const underMat = new THREE.MeshStandardMaterial({
    color: INK,
    metalness: 0.6,
    roughness: 0.35,
    flatShading: false,
  })
  const domeMat = new THREE.MeshPhysicalMaterial({
    color: GLASS,
    metalness: 0.1,
    roughness: 0.05,
    transparent: true,
    opacity: 0.55,
    emissive: 0xff8a4a,
    emissiveIntensity: 0.12,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  })

  // ─── Saucer deck (wide disc) ───
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.16, 48), deckMat)
  deck.position.y = 0
  group.add(deck)

  // Rim band (slightly wider, darker edge)
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.42, 0.1, 48), underMat)
  rim.position.y = -0.06
  group.add(rim)

  // Upper deck lip
  const lip = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.3, 0.08, 48), deckMat)
  lip.position.y = 0.12
  group.add(lip)

  // ─── Glass dome ───
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.52, 32, 24), domeMat)
  dome.scale.set(1, 0.85, 1)
  dome.position.y = 0.32
  group.add(dome)

  // Dome ring base
  const domeRing = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.03, 12, 40), deckMat)
  domeRing.rotation.x = Math.PI / 2
  domeRing.position.y = 0.14
  group.add(domeRing)

  // ─── Underbelly ───
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 20), underMat)
  belly.scale.set(1.3, 0.55, 1.3)
  belly.position.y = -0.2
  group.add(belly)

  // ─── Glowing rim light ring (the classic UFO detail) ───
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xff7a2a,
    transparent: true,
    opacity: 0.9,
  })
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.38, 0.035, 12, 60), ringMat)
  ring.rotation.x = Math.PI / 2
  ring.position.y = -0.02
  group.add(ring)

  // Rim lights — small emissive orbs around the edge
  const orbMat = new THREE.MeshBasicMaterial({ color: 0xffb27a })
  const orbCount = 10
  for (let i = 0; i < orbCount; i++) {
    const angle = (i / orbCount) * Math.PI * 2
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), orbMat)
    orb.position.set(Math.cos(angle) * 1.38, -0.1, Math.sin(angle) * 1.38)
    group.add(orb)
  }

  // ─── Soft under-glow (pedestal light) ───
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xff5a1a,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const underGlow = new THREE.Mesh(new THREE.CircleGeometry(1.1, 40), glowMat)
  underGlow.rotation.x = -Math.PI / 2
  underGlow.position.y = -0.38
  group.add(underGlow)

  return group
}

export default function UfoCanvas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ─── Scene ───
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0xfdfbf7, 9, 20)

    const camera = new THREE.PerspectiveCamera(36, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 1.0, 5.4)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    mount.appendChild(renderer.domElement)

    // ─── Lights (studio setup) ───
    const ambient = new THREE.AmbientLight(0xfff0e6, 1.2)
    scene.add(ambient)
    const key = new THREE.DirectionalLight(0xfff3ea, 2.4)
    key.position.set(4, 5, 4)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xf97316, 0.9)
    fill.position.set(-3, 1, 2)
    scene.add(fill)
    const rimLight = new THREE.DirectionalLight(0xff5a1a, 1.2)
    rimLight.position.set(0, -2, -4)
    scene.add(rimLight)

    // ─── UFO ───
    const ufo = buildUFO()
    ufo.position.set(0, 0.1, 0)
    scene.add(ufo)

    // ─── Soft light motes (round dust particles) ───
    const moteTexture = makeMoteTexture()
    const moteCount = 260
    const positions = new Float32Array(moteCount * 3)
    const sizes = new Float32Array(moteCount)
    for (let i = 0; i < moteCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7
      positions[i * 3 + 2] = (Math.random() - 0.5) * 9
      sizes[i] = 0.04 + Math.random() * 0.07
    }
    const moteGeo = new THREE.BufferGeometry()
    moteGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const moteMat = new THREE.PointsMaterial({
      map: moteTexture,
      size: 0.06,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    const motes = new THREE.Points(moteGeo, moteMat)
    scene.add(motes)

    // ─── Mouse parallax ───
    let targetX = 0
    let targetY = 0
    const onMouse = (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2
      targetY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    // ─── Animation loop ───
    let raf = 0
    const clock = new THREE.Clock()

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Gentle float + slow rotation + subtle tilt
      ufo.position.y = 0.1 + Math.sin(t * 0.7) * 0.12
      ufo.rotation.y = t * 0.22
      ufo.rotation.z = Math.sin(t * 0.4) * 0.02
      ufo.rotation.x = Math.sin(t * 0.55) * 0.035

      // Motes drift
      motes.rotation.y = t * 0.015
      motes.position.y = Math.sin(t * 0.3) * 0.05

      // Mouse parallax
      camera.position.x += (targetX * 0.6 - camera.position.x) * 0.04
      camera.position.y += (1.0 + targetY * 0.35 - camera.position.y) * 0.04
      camera.lookAt(0, 0.1, 0)

      renderer.render(scene, camera)
    }

    if (reducedMotion) {
      renderer.render(scene, camera)
    } else {
      animate()
    }

    // ─── Resize ───
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize, { passive: true })

    // ─── Degrade off-screen ───
    const io = new IntersectionObserver(([entry]) => {
      renderer.setPixelRatio(entry.isIntersecting ? Math.min(window.devicePixelRatio, 2) : 1)
    })
    io.observe(mount)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      io.disconnect()
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
          else obj.material.dispose()
        }
      })
      moteTexture.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="absolute inset-0"
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    />
  )
}
