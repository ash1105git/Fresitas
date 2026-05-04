import { useRef, useEffect, useState } from 'react'
import useScene3D from '../hooks/useScene3D'

const WA_TEL = import.meta.env.VITE_WA_TELEFONO ?? '573001234567'

export default function Modal3D({ data, onClose }) {
  const canvasRef  = useRef(null)
  const [tab, setTab] = useState('3d')
  const isOpen = Boolean(data)

  // Bloquear scroll al abrir
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    if (!isOpen) setTab('3d')
  }, [isOpen])

  // Cerrar con Escape
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Escena 3D — solo se monta cuando el modal está abierto y tab es '3d'
  const sceneActive = isOpen && tab === '3d'
  useScene3D(
    canvasRef,
    sceneActive
      ? { autoRotate: true, floatAnim: true, initialRadius: 3.8, color: data?.color ?? '#e8354a', seedCount: 10 }
      : {}
  )

  function pedirWA() {
    if (!data) return
    const msg = encodeURIComponent(
      `¡Hola Strawberry Yarn! 🍓\nMe interesa: *${data.nombre}* (${data.precio})\n¿Está disponible?`
    )
    window.open(`https://wa.me/${WA_TEL}?text=${msg}`, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <div className={`modal-overlay${isOpen ? ' open' : ''}`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-inner">
        <button className="modal-cerrar" onClick={onClose} aria-label="Cerrar">✕</button>

        {/* Visor izquierdo */}
        <div className="modal-viewer">
          <canvas
            id="modal-canvas"
            ref={canvasRef}
            style={{ display: tab === '3d' ? 'block' : 'none' }}
          />
          {tab === 'foto' && data?.imagen && (
            <img
              className="modal-foto"
              src={`/assets/productos/${data.imagen}`}
              alt={data?.nombre}
              style={{ position: 'relative', display: 'block' }}
            />
          )}
          <div className="modal-tabs">
            <button className={`modal-tab${tab === '3d' ? ' active' : ''}`}   onClick={() => setTab('3d')}>🔮 3D</button>
            <button className={`modal-tab${tab === 'foto' ? ' active' : ''}`} onClick={() => setTab('foto')}>📷 Foto</button>
          </div>
        </div>

        {/* Info derecha */}
        <div className="modal-info">
          <h2>{data?.nombre}</h2>
          <p className="modal-desc">{data?.descripcion}</p>
          <div className="modal-precio">{data?.precio}</div>
          <div className="modal-btns">
            <button className="btn btn-primary" onClick={pedirWA}>
              💬 Pedir por WhatsApp
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Seguir viendo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
