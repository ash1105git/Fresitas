import { useRef } from 'react'
import useScene3D from '../hooks/useScene3D'

export default function Hero() {
  const canvasRef = useRef(null)
  useScene3D(canvasRef, { autoRotate: true, floatAnim: true, initialRadius: 4.2, color: '#e8354a', seedCount: 10 })

  return (
    <section id="hero">
      <div className="hero-bg" />
      <div className="hero-bg-dots" />

      <div className="hero-texto">
        <div className="hero-badge">Nueva Colección 2026</div>
        <h1 className="hero-h1">
          Tejido a mano<br />con <em>mucho amor</em>
        </h1>
        <p className="hero-p">
          Amigurumis y fresitas tejidas a crochet. Cada pieza es única, hecha con los mejores hilos y colores que te robarán el corazón.
        </p>
        <div className="hero-btns">
          <a href="#catalogo" className="btn btn-primary">🧶 Ver catálogo</a>
          <a href="#ar-section" className="btn btn-secondary">📱 Ver en AR</a>
        </div>
      </div>

      <div className="hero-3d">
        <canvas id="hero-canvas" ref={canvasRef} />
        <div className="hero-hint">🖱️ Arrastra para rotar</div>
      </div>
    </section>
  )
}
