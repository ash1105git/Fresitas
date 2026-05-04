// ═══════════════════════════════════════════════════════════════
//  useScene3D.js — Hook React que porta scene3d.js a Three.js r128
//  Crea una escena de fresita crochet con OrbitControls manual
// ═══════════════════════════════════════════════════════════════
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ── OrbitControls minimalista (Three r128 no lo exporta por default) ──
class SimpleOrbitControls {
  constructor(camera, domEl) {
    this.camera   = camera
    this.domEl    = domEl
    this.target   = new THREE.Vector3()
    this.autoRotate = false
    this.autoRotateSpeed = 1.0
    this._spherical = new THREE.Spherical()
    this._spherical.setFromVector3(camera.position.clone().sub(this.target))
    this._isDragging = false
    this._prev = { x: 0, y: 0 }

    this._onMouseDown  = this._onMouseDown.bind(this)
    this._onMouseMove  = this._onMouseMove.bind(this)
    this._onMouseUp    = this._onMouseUp.bind(this)
    this._onTouchStart = this._onTouchStart.bind(this)
    this._onTouchMove  = this._onTouchMove.bind(this)
    this._onWheel      = this._onWheel.bind(this)

    domEl.addEventListener('mousedown',  this._onMouseDown)
    domEl.addEventListener('mousemove',  this._onMouseMove)
    window.addEventListener('mouseup',   this._onMouseUp)
    domEl.addEventListener('touchstart', this._onTouchStart, { passive: true })
    domEl.addEventListener('touchmove',  this._onTouchMove,  { passive: false })
    domEl.addEventListener('wheel',      this._onWheel,      { passive: true })
  }

  _onMouseDown(e) { this._isDragging = true; this._prev = { x: e.clientX, y: e.clientY } }
  _onMouseUp()    { this._isDragging = false }
  _onMouseMove(e) {
    if (!this._isDragging) return
    const dx = e.clientX - this._prev.x
    const dy = e.clientY - this._prev.y
    this._spherical.theta -= dx * 0.006
    this._spherical.phi   = Math.max(0.2, Math.min(Math.PI - 0.2, this._spherical.phi + dy * 0.006))
    this._prev = { x: e.clientX, y: e.clientY }
    this._updateCamera()
  }
  _onTouchStart(e) { if (e.touches.length === 1) { this._isDragging = true; this._prev = { x: e.touches[0].clientX, y: e.touches[0].clientY } } }
  _onTouchMove(e)  {
    if (!this._isDragging || e.touches.length !== 1) return
    e.preventDefault()
    const dx = e.touches[0].clientX - this._prev.x
    const dy = e.touches[0].clientY - this._prev.y
    this._spherical.theta -= dx * 0.006
    this._spherical.phi   = Math.max(0.2, Math.min(Math.PI - 0.2, this._spherical.phi + dy * 0.006))
    this._prev = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    this._updateCamera()
  }
  _onWheel(e) {
    this._spherical.radius = Math.max(2, Math.min(10, this._spherical.radius + e.deltaY * 0.005))
    this._updateCamera()
  }
  _updateCamera() {
    this.camera.position.setFromSpherical(this._spherical).add(this.target)
    this.camera.lookAt(this.target)
  }
  update(delta = 0.016) {
    if (this.autoRotate && !this._isDragging) {
      this._spherical.theta += this.autoRotateSpeed * delta * 0.5
      this._updateCamera()
    }
  }
  dispose() {
    this.domEl.removeEventListener('mousedown',  this._onMouseDown)
    this.domEl.removeEventListener('mousemove',  this._onMouseMove)
    window.removeEventListener('mouseup',        this._onMouseUp)
    this.domEl.removeEventListener('touchstart', this._onTouchStart)
    this.domEl.removeEventListener('touchmove',  this._onTouchMove)
    this.domEl.removeEventListener('wheel',      this._onWheel)
  }
}

// ── Geometría de fresita crochet procedural ────────────────────
function buildFresita(color = '#e8354a', seedCount = 10) {
  const group = new THREE.Group()
  const mat = (c, rough = 0.88) => new THREE.MeshStandardMaterial({ color: c, roughness: rough, metalness: 0.04 })

  // Cuerpo (esfera achatada)
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    mat(color)
  )
  body.scale.y = 1.18
  group.add(body)

  // Semillas
  const seedMat = mat('#ffe08a', 0.7)
  for (let i = 0; i < seedCount; i++) {
    const phi   = Math.acos(-1 + (2 * i) / seedCount)
    const theta = Math.sqrt(seedCount * Math.PI) * phi
    const seed  = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), seedMat)
    seed.position.setFromSphericalCoords(1.01, phi, theta)
    seed.position.y *= 1.18
    group.add(seed)
  }

  // Hojas
  const leafMat = mat('#3d8c40')
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2
    const leaf  = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), leafMat)
    leaf.scale.set(0.5, 1, 0.22)
    leaf.position.set(Math.cos(angle) * 0.55, 1.22, Math.sin(angle) * 0.55)
    leaf.rotation.z = angle + Math.PI / 2
    group.add(leaf)
  }

  // Tallo
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.05, 0.4, 8),
    mat('#4caf50')
  )
  stem.position.y = 1.55
  group.add(stem)

  return group
}

// ── Hook principal ─────────────────────────────────────────────
export default function useScene3D(canvasRef, options = {}) {
  const sceneRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const {
      autoRotate    = true,
      floatAnim     = false,
      initialRadius = 4.2,
      color         = '#e8354a',
      seedCount     = 10,
    } = options

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.shadowMap.enabled = true

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.set(0, 0, initialRadius)

    // Controls
    const controls = new SimpleOrbitControls(camera, canvas)
    controls.autoRotate      = autoRotate
    controls.autoRotateSpeed = 1.2
    controls._spherical.radius = initialRadius

    // Lights
    const ambient = new THREE.AmbientLight(0xfff0f3, 0.9)
    scene.add(ambient)
    const dir = new THREE.DirectionalLight(0xffffff, 1.4)
    dir.position.set(3, 5, 4)
    dir.castShadow = true
    scene.add(dir)
    const fill = new THREE.DirectionalLight(0xffdde2, 0.5)
    fill.position.set(-4, 2, -2)
    scene.add(fill)

    // Fresita
    const fresita = buildFresita(color, seedCount)
    scene.add(fresita)

    // Clock
    const clock = new THREE.Clock()
    let animId

    function resize() {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const resizeObs = new ResizeObserver(resize)
    resizeObs.observe(canvas)

    function animate() {
      animId = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      const elapsed = clock.getElapsedTime()

      controls.update(delta)

      if (floatAnim) {
        fresita.position.y = Math.sin(elapsed * 1.1) * 0.12
      }

      renderer.render(scene, camera)
    }
    animate()

    sceneRef.current = { scene, renderer, controls, fresita }

    return () => {
      cancelAnimationFrame(animId)
      resizeObs.disconnect()
      controls.dispose()
      renderer.dispose()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef])

  return sceneRef
}
