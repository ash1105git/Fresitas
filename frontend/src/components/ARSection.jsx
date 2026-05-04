import { useState } from 'react'

const MODELOS = [
  { key: 'jake',     label: 'Jake',     emoji: '🐶' },
  { key: 'merlina',  label: 'Merlina',  emoji: '🖤' },
  { key: 'patricio', label: 'Patricio', emoji: '⭐' },
  { key: 'raton',    label: 'Ratón',    emoji: '🐭' },
]

export default function ARSection() {
  const [showAR, setShowAR]       = useState(false)
  const [modelo, setModelo]       = useState('jake')

  function abrirAR() {
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent)
    if (!isMobile) {
      alert('💡 Abre este sitio desde tu smartphone para usar la Realidad Aumentada.\n\nUsa Chrome en Android o Safari en iPhone.')
      return
    }
    setShowAR(true)
  }

  if (showAR) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
        {/* A-Frame AR scene con AR.js */}
        {/* eslint-disable-next-line react/no-unknown-property */}
        <a-scene
          embedded
          arjs="sourceType: webcam; debugUIEnabled: false;"
          style={{ width: '100vw', height: '100vh' }}
        >
          {/* eslint-disable-next-line react/no-unknown-property */}
          <a-marker preset="hiro">
            {/* eslint-disable-next-line react/no-unknown-property */}
            <a-entity
              gltf-model={`/assets/modelos/${modelo}.glb`}
              scale="0.5 0.5 0.5"
              position="0 0 0"
              animation="property: rotation; to: 0 360 0; loop: true; dur: 6000; easing: linear"
            />
          </a-marker>
          {/* eslint-disable-next-line react/no-unknown-property */}
          <a-entity camera />
        </a-scene>

        {/* Controles sobre la cámara */}
        <div style={{
          position: 'absolute', bottom: 32, left: 0, right: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, zIndex: 10000,
        }}>
          <div style={{ display: 'flex', gap: 10 }}>
            {MODELOS.map(m => (
              <button
                key={m.key}
                onClick={() => setModelo(m.key)}
                style={{
                  padding: '10px 16px', borderRadius: 50, border: 'none',
                  background: modelo === m.key ? '#e8354a' : 'rgba(255,255,255,.85)',
                  color: modelo === m.key ? '#fff' : '#2d1a1f',
                  fontWeight: 600, fontSize: '.84rem', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,.2)',
                }}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAR(false)}
            style={{
              padding: '12px 28px', borderRadius: 50, border: 'none',
              background: 'rgba(45,26,31,.85)', color: '#fff',
              fontWeight: 600, fontSize: '.88rem', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,.3)',
            }}
          >
            ✕ Cerrar AR
          </button>
        </div>
      </div>
    )
  }

  return (
    <section id="ar-section">
      <div className="ar-bg" />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className="section-tag">Realidad Aumentada</div>
        <h2>Ponla en tu espacio</h2>
        <p>
          Usa la cámara de tu celular para ver nuestros amigurumis en tu cuarto, escritorio o donde quieras. 
          Apunta al marcador Hiro e instantáneamente aparece el modelo 3D.
        </p>

        {/* Selector de modelo */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
          {MODELOS.map(m => (
            <button
              key={m.key}
              onClick={() => setModelo(m.key)}
              style={{
                padding: '9px 18px', borderRadius: 50, border: 'none',
                background: modelo === m.key ? 'var(--rojo)' : 'rgba(255,255,255,.1)',
                color: '#fff', fontWeight: 600, fontSize: '.82rem', cursor: 'pointer',
                transition: 'all .2s',
                boxShadow: modelo === m.key ? '0 4px 14px rgba(232,53,74,.4)' : 'none',
              }}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>

        <button className="btn btn-primary" onClick={abrirAR}>
          📱 Activar AR
        </button>

        <p style={{ marginTop: 16, fontSize: '.8rem', color: 'rgba(255,255,255,.35)' }}>
          Requiere cámara. Imprime el marcador <strong style={{ color: 'rgba(255,255,255,.6)' }}>Hiro</strong> para activar el modelo.
        </p>
      </div>

      {/* Phone frame decorativo */}
      <div className="ar-visor">
        <div className="phone-glow" />
        <div className="phone-frame">
          <div className="phone-screen">
            <div className="ar-corner tl" /><div className="ar-corner tr" />
            <div className="ar-corner bl" /><div className="ar-corner br" />
            <div className="ar-scan-line" />
            <div className="ar-emoji">🍓</div>
            <span className="ar-label">AR activo</span>
          </div>
        </div>
      </div>
    </section>
  )
}
