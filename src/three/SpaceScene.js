import * as THREE from 'three'
import { buildUFO, buildMotes } from './buildUfo'
import { makeNebulaTexture, makeStarBloomTexture, makeStarTexture, makeGalaxyBandTexture, makeStreakTexture } from './textures'

// ─── SpaceScene — fixed full-screen universe, camera flies on scroll ───
// Scroll progress (0..1) maps to a camera path through space.
// The UFO leads ahead of the camera, leading the way.

const SPACE_DEPTH = 260 // total flight distance
const STAR_COUNT = 2200

// Ease 0..1 with smoothstep (no harsh start/stop)
const smoothstep = (x) => {
  const t = Math.max(0, Math.min(1, x))
  return t * t * (3 - 2 * t)
}

// Ease-out cubic — fast start, gentle settle
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

export default class SpaceScene {
  constructor(mount, theme = 'light', skipEntrance = false) {
    this.mount = mount
    this.disposed = false
    this.isDark = theme === 'dark'

    // ─── Renderer ───
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    this.renderer.setSize(mount.clientWidth, mount.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.2
    mount.appendChild(this.renderer.domElement)

    // ─── Scene (theme-aware: dark = deep space, light = daylight) ───
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(this.isDark ? 0x070605 : 0xffffff)
    this.scene.fog = new THREE.Fog(this.isDark ? 0x070605 : 0xffffff, 14, 60)

    // ─── Camera ───
    this.camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 300)
    this.camera.position.set(0, 0.6, 0)

    // ─── Lights ───
    const ambient = new THREE.AmbientLight(this.isDark ? 0xffe8dc : 0xffffff, this.isDark ? 0.7 : 1.0)
    this.scene.add(ambient)
    const key = new THREE.DirectionalLight(this.isDark ? 0xfff3ea : 0xffffff, this.isDark ? 2.2 : 2.4)
    key.position.set(4, 6, 4)
    this.scene.add(key)
    const ember = new THREE.PointLight(0xf53003, this.isDark ? 60 : 50, 30)
    ember.position.set(-4, 1, -6)
    this.scene.add(ember)

    // ─── UFO (leads the flight) ───
    this.ufo = buildUFO()
    this.ufo.position.set(0, 0.4, -6)
    this.scene.add(this.ufo)

    // ─── Ember motes around ship ───
    this.motes = buildMotes(140)
    this.scene.add(this.motes)

    // ─── Mouse drift (VERY slow reaction — leans, never chases) ───
    this.mouseX = 0
    this.mouseY = 0
    this.mouseDriftX = 0
    this.mouseDriftY = 0
    this._onMouse = (e) => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', this._onMouse, { passive: true })

    // ─── Hero progress (0 = hero fully in view, 1 = hero scrolled out) ───
    // Drives the UFO's greeting → departure sequence.
    this.heroProgress = 0

    // ─── Starfield (deep box, recycled as camera flies) ───
    // Light: dark warm-gray ink specks (NormalBlending). Dark: warm-white additive.
    this.starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(STAR_COUNT * 3)
    const starColors = new Float32Array(STAR_COUNT * 3)
    for (let i = 0; i < STAR_COUNT * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 160
      starPos[i + 1] = (Math.random() - 0.5) * 80
      starPos[i + 2] = -(2 + Math.random() * (SPACE_DEPTH - 2))
      if (this.isDark) {
        // Temperature variation: warm white ↔ cool blue-white
        const warmth = 0.88 + Math.random() * 0.12
        starColors[i]     = warmth * (0.92 + Math.random() * 0.08)
        starColors[i + 1] = warmth * (0.92 + Math.random() * 0.08)
        starColors[i + 2] = warmth
      } else {
        // Ink temperature variation: neutral dark ↔ slightly warm dark
        const warmth = 0.85 + Math.random() * 0.15
        starColors[i]     = warmth * (0.16 + Math.random() * 0.12)
        starColors[i + 1] = warmth * (0.15 + Math.random() * 0.12)
        starColors[i + 2] = warmth * (0.13 + Math.random() * 0.11)
      }
    }
    this.starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    this.starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3))
    const starTex = makeStarTexture()
    const starMat = new THREE.PointsMaterial({
      map: starTex,
      color: 0xffffff,
      size: this.isDark ? 0.09 : 0.1,
      transparent: true,
      opacity: this.isDark ? 0.85 : 0.9,
      sizeAttenuation: true,
      depthWrite: false,
      vertexColors: true,
      fog: false, // stars recycle 15-245u ahead of the camera — scene fog
      // (far: 60) would wash them into the background well before body
      // sections come into view, so they light the whole flight instead.
      ...(this.isDark ? { blending: THREE.AdditiveBlending } : {}),
    })
    this.stars = new THREE.Points(this.starGeo, starMat)
    this.scene.add(this.stars)
    this.stars.userData.texture = starTex

    // Brighter near stars (a second, sparser layer)
    this.nearStarGeo = new THREE.BufferGeometry()
    const nearPos = new Float32Array(420 * 3)
    const nearColors = new Float32Array(420 * 3)
    for (let i = 0; i < 420 * 3; i += 3) {
      nearPos[i] = (Math.random() - 0.5) * 120
      nearPos[i + 1] = (Math.random() - 0.5) * 60
      nearPos[i + 2] = -(30 + Math.random() * (SPACE_DEPTH - 30))
      if (this.isDark) {
        // Temperature variation with a warmer bias for near stars
        const warmth = 0.85 + Math.random() * 0.15
        nearColors[i]     = warmth * (0.95 + Math.random() * 0.05)
        nearColors[i + 1] = warmth * (0.88 + Math.random() * 0.12)
        nearColors[i + 2] = warmth * (0.78 + Math.random() * 0.22)
      } else {
        // Slightly warmer bias for near stars (ember-tinted ink)
        const warmth = 0.8 + Math.random() * 0.2
        nearColors[i]     = warmth * (0.30 + Math.random() * 0.12)
        nearColors[i + 1] = warmth * (0.24 + Math.random() * 0.12)
        nearColors[i + 2] = warmth * (0.18 + Math.random() * 0.10)
      }
    }
    this.nearStarGeo.setAttribute('position', new THREE.BufferAttribute(nearPos, 3))
    this.nearStarGeo.setAttribute('color', new THREE.BufferAttribute(nearColors, 3))
    const bloomTex = makeStarBloomTexture()
    const nearMat = new THREE.PointsMaterial({
      map: bloomTex,
      color: 0xffffff,
      size: this.isDark ? 0.45 : 0.5,
      transparent: true,
      opacity: this.isDark ? 0.8 : 0.85,
      depthWrite: false,
      sizeAttenuation: true,
      vertexColors: true,
      fog: false, // same reasoning as the far starfield above
      ...(this.isDark ? { blending: THREE.AdditiveBlending } : {}),
    })
    this.nearStars = new THREE.Points(this.nearStarGeo, nearMat)
    this.scene.add(this.nearStars)
    this.nearStars.userData.texture = bloomTex

    // ─── Nebulas (large additive glows at waypoints) ───
    const nebulaTex = makeNebulaTexture()
    this.nebulas = []
    const waypoints = [
      { x: -9, y: 2, z: -10, s: 26 },
      { x: 10, y: -2, z: -26, s: 32 },
      { x: -12, y: 3, z: -44, s: 24 },
      { x: 8, y: -3, z: -62, s: 30 },
      { x: -7, y: 2, z: -84, s: 28 },
      { x: 11, y: -1, z: -106, s: 34 },
      { x: -10, y: 3, z: -128, s: 26 },
      { x: 6, y: -2, z: -150, s: 30 },
    ]
    waypoints.forEach((w) => {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: nebulaTex,
          color: this.isDark ? 0xf53003 : 0xf7a078,
          transparent: true,
          opacity: this.isDark ? 0.28 : 0.16,
          depthWrite: false,
          fog: false, // stay visible at any distance
          ...(this.isDark ? { blending: THREE.AdditiveBlending } : {}),
        })
      )
      sprite.position.set(w.x, w.y, w.z)
      sprite.scale.set(w.s, w.s * 0.75, 1)
      sprite.userData.base = { x: w.x, y: w.y, z: w.z, s: w.s }
      this.scene.add(sprite)
      this.nebulas.push(sprite)
    })
    this.nebulas.forEach((n) => (n.userData.texture = nebulaTex))

    // ─── Interstellar galaxy band (warm dust streak across the flight) ───
    const bandTex = makeGalaxyBandTexture()
    this.galaxyBands = []
    const bandWaypoints = [
      { x: 0, y: 1.2, z: -35, s: 120, o: 0.10 },
      { x: 3, y: -1.6, z: -75, s: 140, o: 0.13 },
      { x: -2, y: 1.8, z: -115, s: 130, o: 0.11 },
      { x: 2, y: -1.2, z: -155, s: 150, o: 0.14 },
      { x: -3, y: 1.4, z: -195, s: 140, o: 0.12 },
    ]
    bandWaypoints.forEach((b) => {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: bandTex,
          color: this.isDark ? 0xffc9a0 : 0xf0d9c2,
          transparent: true,
          opacity: b.o,
          depthWrite: false,
          fog: false, // stay visible at any distance
          ...(this.isDark ? { blending: THREE.AdditiveBlending } : {}),
        })
      )
      sprite.position.set(b.x, b.y, b.z)
      sprite.scale.set(b.s, b.s * 0.12, 1)
      sprite.userData.base = { x: b.x, y: b.y, z: b.z, s: b.s }
      this.scene.add(sprite)
      this.galaxyBands.push(sprite)
    })
    this.galaxyBands.forEach((n) => (n.userData.texture = bandTex))

    // ─── Distant galaxy cores (bright warm spots, like far galaxies) ───
    const coreTex = makeStarBloomTexture()
    this.galaxyCores = []
    const cores = [
      { x: -14, y: 2.6, z: -50, s: 5 },
      { x: 16, y: -2.4, z: -90, s: 6 },
      { x: -18, y: 3.2, z: -130, s: 4.5 },
      { x: 14, y: -3.0, z: -170, s: 7 },
      { x: -12, y: 1.8, z: -210, s: 5.5 },
    ]
    cores.forEach((c) => {
      const core = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: coreTex,
          color: this.isDark ? 0xffe8d0 : 0xffd9b0,
          transparent: true,
          opacity: this.isDark ? 0.45 : 0.5,
          depthWrite: false,
          fog: false, // stay visible at any distance
          ...(this.isDark ? { blending: THREE.AdditiveBlending } : {}),
        })
      )
      core.position.set(c.x, c.y, c.z)
      core.scale.set(c.s, c.s, 1)
      core.userData.base = { x: c.x, y: c.y, z: c.z, s: c.s }
      this.scene.add(core)
      this.galaxyCores.push(core)
    })
    this.galaxyCores.forEach((n) => (n.userData.texture = coreTex))

    // ─── Shooting stars ───
    // Bright comet streaks that cross the sky, spawning more frequently
    // when the user is in body sections (Services–Contact). Each star is a
    // stretched sprite so it can fade via its own opacity AND rotate along
    // its screen-space motion direction (a Points pool can't do either).
    const SHOOTING_STAR_COUNT = 6
    this.shootingStarTex = makeStreakTexture()
    this.shootingStars = []
    for (let i = 0; i < SHOOTING_STAR_COUNT; i++) {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: this.shootingStarTex,
          color: this.isDark ? 0xfff2e2 : 0xf53003,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          fog: false, // stay bright at any distance
          ...(this.isDark ? { blending: THREE.AdditiveBlending } : {}),
        })
      )
      sprite.scale.setScalar(0.001) // hidden until spawned
      sprite.userData = {
        active: false,
        lifetime: 0,
        maxLifetime: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        size: 0,
      }
      this.scene.add(sprite)
      this.shootingStars.push(sprite)
    }

    // ─── Resize ───
    this._onResize = () => {
      this.camera.aspect = mount.clientWidth / mount.clientHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', this._onResize, { passive: true })

    // ─── Degrade off-screen ───
    this._io = new IntersectionObserver(([entry]) => {
      this.renderer.setPixelRatio(entry.isIntersecting ? Math.min(window.devicePixelRatio, 2) : 1)
    })
    this._io.observe(mount)

     this.clock = new THREE.Clock()
     this.progress = 0
     this.smoothProgress = 0

     // ─── Entrance animation ───
     // Camera starts far back and warps forward — dramatic fly-in
     // before normal scroll-driven control takes over. Skipped when the
     // scene is rebuilt for a theme toggle (first load only).
     this.entranceProgress = 0
     this.entranceComplete = skipEntrance
     this.start()
  }

  // Called by ScrollTrigger on each scroll update (0..1)
  setProgress(p) {
    this.progress = p
  }

  // Called by hero ScrollTrigger (0 = hero top, 1 = hero scrolled out)
  setHeroProgress(hp) {
    this.heroProgress = hp
  }

  start() {
    const loop = () => {
      if (this.disposed) return
      this.raf = requestAnimationFrame(loop)
      const dt = Math.min(this.clock.getDelta(), 0.05)
      const t = this.clock.elapsedTime

      // Smooth progress (eases camera)
      this.smoothProgress += (this.progress - this.smoothProgress) * 0.06

       // ─── Camera flight path (scroll-driven, gentle) ───
       const p = this.smoothProgress
       const scrollZ = p * SPACE_DEPTH
       const camX = Math.sin(p * Math.PI * 2) * 2.8
       const camY = 0.6 + Math.sin(p * Math.PI * 3) * 1.0

       // ─── Entrance warp-speed fly-in ───
       // Camera starts BEHIND the hero (positive z) and rockets FORWARD
       // into the scene — stars stream past the lens, the galaxy grows
       // as we approach it. After the entrance, normal scroll flight.
       if (!this.entranceComplete) {
         this.entranceProgress += dt / 2.5
         if (this.entranceProgress >= 1) {
           this.entranceProgress = 1
           this.entranceComplete = true
           window.dispatchEvent(new Event('space-entrance-complete'))
         }
         const ep = easeOutCubic(this.entranceProgress)
         this.camera.position.z = 200 - 200 * ep
         this.camera.position.x += (0 - this.camera.position.x) * 0.05
         this.camera.position.y += (0.6 - this.camera.position.y) * 0.05
         // Brief exposure flash — scene ignites as the camera arrives
         this.renderer.toneMappingExposure = 1.5 - 0.3 * ep
       } else {
         this.camera.position.z = scrollZ
         this.camera.position.x += (camX - this.camera.position.x) * 0.05
         this.camera.position.y += (camY - this.camera.position.y) * 0.05
         this.renderer.toneMappingExposure = 1.2
       }

       const z = this.camera.position.z
       // Look straight ahead down the flight path — NO lateral yaw.
       this.camera.lookAt(this.camera.position.x, camY * 0.8, z - 6)

      // ─── UFO — greets the hero, then departs into the star flow ───
      // Hovering above the headline at the top, lighting it softly.
      // On scroll it flies deeper along the star direction + shrinks to vanish.
      // VERY slow mouse drift first — leans toward cursor, never chases
      this.mouseDriftX += (this.mouseX * 0.8 - this.mouseDriftX) * 0.018
      this.mouseDriftY += (this.mouseY * 0.5 - this.mouseDriftY) * 0.018

       const dep = smoothstep(this.heroProgress)

       const heroX = this.camera.position.x + this.mouseDriftX
       const heroY = this.camera.position.y + 2.6 + Math.sin(t * 0.8) * 0.12
       const heroZ = z - 7.5

       this.ufo.position.x = heroX + dep * 2.5
       this.ufo.position.y = heroY + dep * 2.0
       this.ufo.position.z = heroZ - dep * 70
       // During entrance the UFO scales in with the camera fly-in;
       // after entrance the normal departure shrink takes over.
       const ufoScale = this.entranceComplete
         ? Math.max(1 - dep * 0.97, 0.03)
         : easeOutCubic(this.entranceProgress)
       this.ufo.scale.setScalar(Math.max(ufoScale, 0.01))

      this.ufo.rotation.y = t * 0.18
      this.ufo.rotation.z = Math.sin(t * 0.45) * 0.02 + this.mouseDriftX * 0.06
      this.ufo.rotation.x = Math.sin(t * 0.6) * 0.03 - this.mouseDriftY * 0.04

      // Motes follow ship — fade as it departs
      this.motes.position.set(this.ufo.position.x, this.ufo.position.y, this.ufo.position.z + 2)
      this.motes.rotation.y = t * 0.05
      this.motes.material.opacity = 0.5 * (1 - dep * 0.9)

      // ─── Stars recede in sync with the UFO's departure ───
      // As the ship shrinks away, the whole starfield pulls back with it.
      const starPull = 1 - dep * 0.25
      this.stars.scale.setScalar(starPull)
      this.nearStars.scale.setScalar(starPull)

      // ─── Starfield recycle — infinite corridor following the camera ───
      // The field is a moving window that tracks the camera's flight, so
      // stars are present at EVERY scroll depth all the way to the footer.
      // Every branch lands stars safely AHEAD (never on the lens) — a point
      // sprite's screen size is size*scale/distance, so anything crossing
      // the camera plane within a unit or two flashes the whole screen.
      const starPos = this.starGeo.attributes.position.array
      for (let i = 0; i < starPos.length; i += 3) {
        if (starPos[i + 2] > z + 10) {
          // behind the camera → throw far ahead
          starPos[i + 2] = z - 15 - Math.random() * (SPACE_DEPTH - 15)
          starPos[i] = (Math.random() - 0.5) * 160
          starPos[i + 1] = (Math.random() - 0.5) * 80
        } else if (starPos[i + 2] > z - 1.5) {
          // about to cross the lens → jump it ahead before it flashes
          starPos[i + 2] = z - 15 - Math.random() * (SPACE_DEPTH - 15)
          starPos[i] = (Math.random() - 0.5) * 160
          starPos[i + 1] = (Math.random() - 0.5) * 80
        } else if (starPos[i + 2] < z - SPACE_DEPTH + 10) {
          // receded too far ahead → pull back into the corridor
          starPos[i + 2] = z - 15 - Math.random() * (SPACE_DEPTH - 15)
          starPos[i] = (Math.random() - 0.5) * 160
          starPos[i + 1] = (Math.random() - 0.5) * 80
        }
      }
      this.starGeo.attributes.position.needsUpdate = true

      // Near stars: bigger/brighter → need a wider standoff from the lens
      const nearPos = this.nearStarGeo.attributes.position.array
      for (let i = 0; i < nearPos.length; i += 3) {
        if (nearPos[i + 2] > z - 30) {
          // at the lens (or behind it) → jump far ahead, never closer than 30u
          nearPos[i + 2] = z - 30 - Math.random() * (SPACE_DEPTH - 30)
          nearPos[i] = (Math.random() - 0.5) * 120
          nearPos[i + 1] = (Math.random() - 0.5) * 60
        } else if (nearPos[i + 2] < z - SPACE_DEPTH + 30) {
          // receded too far ahead → pull back into the corridor
          nearPos[i + 2] = z - 30 - Math.random() * (SPACE_DEPTH - 30)
          nearPos[i] = (Math.random() - 0.5) * 120
          nearPos[i + 1] = (Math.random() - 0.5) * 60
        }
      }
      this.nearStarGeo.attributes.position.needsUpdate = true

      // ─── Recycle galaxy details — infinite corridor like the starfield ───
      // Bands/cores/nebulas track the camera both directions so the body
      // sections always fly through them. Landing spots are always well
      // AHEAD of the lens — combined with lensFade below, a fog:false sprite
      // never reaches the camera plane (that was the full-screen flash).
      const recycle = (sprite) => {
        if (sprite.position.z > z + 20) {
          sprite.position.z = z - 60 - Math.random() * 180
        } else if (sprite.position.z < z - SPACE_DEPTH + 20) {
          sprite.position.z = z - 60 - Math.random() * 180
        }
      }
      this.galaxyBands.forEach(recycle)
      this.galaxyCores.forEach(recycle)
      this.nebulas.forEach(recycle)

      // Lens fade: fade sprites to nothing in the last 16 units before the
      // camera, so a giant additive sprite crossing the plane is invisible.
      const lensFade = (sprite) => {
        const d = z - sprite.position.z
        return Math.min(Math.max(d / 16, 0), 1)
      }

      // Nebulas slowly breathe
      this.nebulas.forEach((n, i) => {
        const base = this.isDark ? 0.22 : 0.15
        n.material.opacity = (base + Math.sin(t * 0.3 + i * 1.7) * 0.06) * lensFade(n)
      })

      // Galaxy bands gently shimmer
      this.galaxyBands.forEach((n, i) => {
        const base = this.isDark ? 0.10 + (i % 2) * 0.03 : 0.28 + (i % 2) * 0.08
        const amp = this.isDark ? 0.025 : 0.03
        n.material.opacity = (base + Math.sin(t * 0.2 + i * 1.3) * amp) * lensFade(n)
      })

      // Galaxy cores (fixed brightness, just faded at the lens)
      this.galaxyCores.forEach((c) => {
        c.material.opacity = (this.isDark ? 0.45 : 0.5) * lensFade(c)
      })

      // ─── Starfield twinkle — multi-frequency composite opacity ───
      // Three sine layers at different speeds prevent a mechanical single-
      // frequency pulse. The result is a gentle organic breathing that makes
      // the field feel alive without distracting from the scene.
      const starTwinkle =
        (this.isDark ? 0.85 : 0.88) +
        0.08 * Math.sin(t * 0.6 + 1.2) +
        0.05 * Math.sin(t * 1.4 + 3.5) +
        0.03 * Math.sin(t * 2.3 + 0.8)
      this.stars.material.opacity = starTwinkle

      const nearTwinkle =
        (this.isDark ? 0.72 : 0.82) +
        0.10 * Math.sin(t * 0.45 + 2.1) +
        0.06 * Math.sin(t * 1.05 + 4.2) +
        0.04 * Math.sin(t * 1.7 + 0.3)
      this.nearStars.material.opacity = nearTwinkle

      // ─── Shooting stars — sparse in hero/footer, lively in body ───
      // Body sections (Services through Contact) spawn streaks ~6x more
      // often. Each star races toward the camera with a slight downward
      // drift, fades out, and its sprite stretches along the direction it
      // is actually moving on screen (projected velocity) — a comet look
      // instead of a blinking dot.
      const inBody = this.smoothProgress > 0.15 && this.smoothProgress < 0.85
      const shootRate = inBody ? 0.05 : 0.008
      this.camera.updateMatrixWorld()
      const proj0 = new THREE.Vector3()
      const proj1 = new THREE.Vector3()
      const vel = new THREE.Vector3()
      this.shootingStars.forEach((s) => {
        const d = s.userData
        if (!d.active) {
          // Try to spawn a new streak (Poisson-style per-slot chance)
          if (Math.random() < shootRate * dt) {
            d.active = true
            d.lifetime = d.maxLifetime = 0.4 + Math.random() * 0.8
            d.vx = (Math.random() - 0.5) * 2.4
            d.vy = -(1 + Math.random() * 2)
            d.vz = 15 + Math.random() * 25
            d.size = 0.35 + Math.random() * 0.25
            s.position.set(
              (Math.random() - 0.5) * 16,
              2 + Math.random() * 6,
              z - 20 - Math.random() * 40
            )
            s.material.opacity = 1
          }
          return
        }
        // Active: advance along its trajectory, then fade/streak
        d.lifetime -= dt
        const prog = d.lifetime / d.maxLifetime // 1 → 0
        s.position.x += d.vx * dt
        s.position.y += d.vy * dt
        s.position.z += d.vz * dt
        if (prog <= 0 || s.position.z > z - 1) {
          // Expired or about to cross the lens (never a full-screen flash)
          d.active = false
          s.material.opacity = 0
          s.scale.setScalar(0.001)
          return
        }
        s.material.opacity = Math.pow(prog, 1.6)
        // Stretch along the screen-space direction of travel
        proj0.copy(s.position).project(this.camera)
        proj1.copy(s.position).addScaledVector(vel.set(d.vx, d.vy, d.vz), 0.05).project(this.camera)
        s.rotation.z = Math.atan2(proj1.y - proj0.y, proj1.x - proj0.x)
        const len = d.size * (1.6 + prog * 2.4)
        const wid = d.size * (0.5 + prog * 0.5)
        s.scale.set(len, wid, 1)
      })

      this.renderer.render(this.scene, this.camera)
    }
    loop()
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this._onResize)
    window.removeEventListener('mousemove', this._onMouse)
    this._io.disconnect()
    this.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
        else obj.material.dispose()
      }
    })
    ;[this.stars, this.nearStars, this.motes, ...this.nebulas, ...this.galaxyBands, ...this.galaxyCores].forEach((obj) => {
      if (obj?.userData?.texture) obj.userData.texture.dispose()
    })
    this.shootingStarTex.dispose()
    this.renderer.dispose()
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)
    }
  }
}
