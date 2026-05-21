import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { PLANETS } from '../data/planets'

const SCALE = 1
const SPEED_FACTOR = 0.008

export function useSolarSystem({ onPlanetClick, onSunClick, isPaused, speedMultiplier = 1 }) {
  const mountRef    = useRef(null)
  const sceneRef    = useRef(null)
  const cameraRef   = useRef(null)
  const rendererRef = useRef(null)
  const frameRef    = useRef(null)
  const clockRef    = useRef(new THREE.Clock())
  const planetsRef  = useRef([])
  const starsRef    = useRef(null)
  const mouseRef    = useRef({ x: 0, y: 0, down: false, lastX: 0, lastY: 0 })
  const cameraStateRef = useRef({ theta: 0, phi: Math.PI / 3.5, radius: 120 })
  const raycasterRef = useRef(new THREE.Raycaster())
  const clickableRef = useRef([])
  const elapsedRef      = useRef(0)
  const isPausedRef     = useRef(isPaused)
  const speedRef        = useRef(speedMultiplier)

  const updateCamera = useCallback(() => {
    const { theta, phi, radius } = cameraStateRef.current
    const cam = cameraRef.current
    if (!cam) return
    cam.position.set(
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.cos(theta)
    )
    cam.lookAt(0, 0, 0)
  }, [])

  useEffect(() => {
    if (!mountRef.current) return
    const mount = mountRef.current
    const W = mount.clientWidth, H = mount.clientHeight

    // Scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 2000)
    cameraRef.current = camera
    updateCamera()

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    mount.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Stars
    const starGeo = new THREE.BufferGeometry()
    const starCount = 3000
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 1800
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.4, sizeAttenuation: true })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)
    starsRef.current = stars

    // Sun
    const sunGeo = new THREE.SphereGeometry(5, 32, 32)
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffd700 })
    const sun = new THREE.Mesh(sunGeo, sunMat)
    sun.userData = { isSun: true }
    scene.add(sun)
    clickableRef.current.push(sun)

    // Sun glow
    const glowGeo = new THREE.SphereGeometry(6, 32, 32)
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xff8800, transparent: true, opacity: 0.15, side: THREE.BackSide
    })
    const glow = new THREE.Mesh(glowGeo, glowMat)
    scene.add(glow)

    // Sun point light
    const sunLight = new THREE.PointLight(0xffffff, 2, 500)
    scene.add(sunLight)

    // Ambient light
    scene.add(new THREE.AmbientLight(0x111111, 1))

    // Planets
    planetsRef.current = PLANETS.map((p, i) => {
      const group = new THREE.Group()

      // Orbit ring
      const orbitGeo = new THREE.RingGeometry(p.distance - 0.05, p.distance + 0.05, 128)
      const orbitMat = new THREE.MeshBasicMaterial({
        color: 0xc8ff00, transparent: true, opacity: 0.12, side: THREE.DoubleSide
      })
      const orbit = new THREE.Mesh(orbitGeo, orbitMat)
      orbit.rotation.x = Math.PI / 2
      scene.add(orbit)

      // Planet mesh
      const geo = new THREE.SphereGeometry(p.radius * SCALE, 32, 32)

      // Create canvas texture for planet
      const canvas = document.createElement('canvas')
      canvas.width = 256; canvas.height = 256
      const ctx = canvas.getContext('2d')
      const grad = ctx.createRadialGradient(128, 100, 10, 128, 128, 128)
      grad.addColorStop(0, lightenColor(p.color, 60))
      grad.addColorStop(0.5, p.color)
      grad.addColorStop(1, p.emissive)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 256, 256)

      // Add bands for gas giants
      if (p.bands) {
        for (let b = 0; b < 8; b++) {
          const y = (b / 8) * 256
          ctx.fillStyle = b % 2 === 0
            ? 'rgba(255,200,100,0.15)'
            : 'rgba(180,120,60,0.15)'
          ctx.fillRect(0, y, 256, 256 / 8)
        }
      }

      const texture = new THREE.CanvasTexture(canvas)
      const mat = new THREE.MeshPhongMaterial({
        map: texture,
        emissive: new THREE.Color(p.emissive),
        emissiveIntensity: 0.1,
        shininess: 30,
      })

      const mesh = new THREE.Mesh(geo, mat)
      mesh.castShadow = true
      mesh.userData = { planet: p, index: i }
      group.add(mesh)
      clickableRef.current.push(mesh)

      // Saturn-style rings
      if (p.rings && p.name === 'Saturn') {
        const ringsGeo = new THREE.RingGeometry(p.radius * 1.4, p.radius * 2.4, 64)
        const ringsMat = new THREE.MeshBasicMaterial({
          color: 0xe4d191, transparent: true, opacity: 0.6, side: THREE.DoubleSide
        })
        const rings = new THREE.Mesh(ringsGeo, ringsMat)
        rings.rotation.x = Math.PI / 2.5
        mesh.add(rings)
      }

      // Uranus rings (vertical-ish)
      if (p.rings && p.name === 'Uranus') {
        const ringsGeo = new THREE.RingGeometry(p.radius * 1.3, p.radius * 1.8, 64)
        const ringsMat = new THREE.MeshBasicMaterial({
          color: 0x7de8e8, transparent: true, opacity: 0.4, side: THREE.DoubleSide
        })
        const rings = new THREE.Mesh(ringsGeo, ringsMat)
        rings.rotation.y = Math.PI / 2.2
        mesh.add(rings)
      }

      // Initial position
      const angle = (i / PLANETS.length) * Math.PI * 2
      mesh.position.set(
        Math.cos(angle) * p.distance,
        0,
        Math.sin(angle) * p.distance
      )

      // Axial tilt
      mesh.rotation.z = (p.tilt * Math.PI) / 180

      scene.add(group)
      return { mesh, group, planet: p, angle }
    })

    // Animate
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      const delta = clockRef.current.getDelta()
      if (!isPausedRef.current) elapsedRef.current += delta * speedRef.current

      planetsRef.current.forEach((obj) => {
        const t = elapsedRef.current
        const angle = obj.planet.speed * SPEED_FACTOR * t + obj.angle
        obj.mesh.position.set(
          Math.cos(angle) * obj.planet.distance,
          0,
          Math.sin(angle) * obj.planet.distance
        )
        obj.mesh.rotation.y += 0.005
      })

      sun.rotation.y += 0.002
      stars.rotation.y += 0.00005
      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const onResize = () => {
      const W = mount.clientWidth, H = mount.clientHeight
      camera.aspect = W / H
      camera.updateProjectionMatrix()
      renderer.setSize(W, H)
    }
    window.addEventListener('resize', onResize)

    // Mouse drag
    const onMouseDown = (e) => {
      mouseRef.current = { ...mouseRef.current, down: true, lastX: e.clientX, lastY: e.clientY }
    }
    const onMouseMove = (e) => {
      const m = mouseRef.current
      if (!m.down) return
      const dx = e.clientX - m.lastX
      const dy = e.clientY - m.lastY
      cameraStateRef.current.theta -= dx * 0.005
      cameraStateRef.current.phi = Math.max(0.2, Math.min(Math.PI / 2, cameraStateRef.current.phi + dy * 0.005))
      mouseRef.current.lastX = e.clientX
      mouseRef.current.lastY = e.clientY
      updateCamera()
    }
    const onMouseUp = () => { mouseRef.current.down = false }

    // Scroll to zoom
    const onWheel = (e) => {
      cameraStateRef.current.radius = Math.max(30, Math.min(250, cameraStateRef.current.radius + e.deltaY * 0.1))
      updateCamera()
    }

    // Touch support
    let lastTouchDist = 0
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        mouseRef.current = { ...mouseRef.current, down: true, lastX: e.touches[0].clientX, lastY: e.touches[0].clientY }
      } else if (e.touches.length === 2) {
        lastTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
      }
    }
    const onTouchMove = (e) => {
      if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - mouseRef.current.lastX
        const dy = e.touches[0].clientY - mouseRef.current.lastY
        cameraStateRef.current.theta -= dx * 0.005
        cameraStateRef.current.phi = Math.max(0.2, Math.min(Math.PI / 2, cameraStateRef.current.phi + dy * 0.005))
        mouseRef.current.lastX = e.touches[0].clientX
        mouseRef.current.lastY = e.touches[0].clientY
        updateCamera()
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        cameraStateRef.current.radius = Math.max(30, Math.min(250, cameraStateRef.current.radius - (dist - lastTouchDist) * 0.3))
        lastTouchDist = dist
        updateCamera()
      }
    }

    // Click detection
    const onClick = (e) => {
      if (Math.abs(e.clientX - mouseRef.current.lastX) > 5) return
      const rect = mount.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycasterRef.current.setFromCamera({ x, y }, camera)
      const hits = raycasterRef.current.intersectObjects(clickableRef.current)
      if (hits.length > 0) {
        const obj = hits[0].object
        if (obj.userData.isSun) { onSunClick?.() }
        else if (obj.userData.planet) { onPlanetClick?.(obj.userData.planet, obj.userData.index) }
      }
    }

    mount.addEventListener('mousedown', onMouseDown)
    mount.addEventListener('mousemove', onMouseMove)
    mount.addEventListener('mouseup', onMouseUp)
    mount.addEventListener('wheel', onWheel, { passive: true })
    mount.addEventListener('click', onClick)
    mount.addEventListener('touchstart', onTouchStart, { passive: true })
    mount.addEventListener('touchmove', onTouchMove, { passive: true })
    mount.addEventListener('touchend', onMouseUp)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', onResize)
      mount.removeEventListener('mousedown', onMouseDown)
      mount.removeEventListener('mousemove', onMouseMove)
      mount.removeEventListener('mouseup', onMouseUp)
      mount.removeEventListener('wheel', onWheel)
      mount.removeEventListener('click', onClick)
      mount.removeEventListener('touchstart', onTouchStart)
      mount.removeEventListener('touchmove', onTouchMove)
      mount.removeEventListener('touchend', onMouseUp)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, []) // eslint-disable-line

  // Sync refs so animation loop always reads latest values
  useEffect(() => { isPausedRef.current = isPaused }, [isPaused])
  useEffect(() => { speedRef.current = speedMultiplier }, [speedMultiplier])

  return { mountRef }
}

function lightenColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, (num >> 16) + amount)
  const g = Math.min(255, ((num >> 8) & 0xff) + amount)
  const b = Math.min(255, (num & 0xff) + amount)
  return `rgb(${r},${g},${b})`
}