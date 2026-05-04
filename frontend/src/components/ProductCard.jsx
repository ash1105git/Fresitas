const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'
const WA_TEL  = import.meta.env.VITE_WA_TELEFONO ?? '573001234567'

const BADGE_MAP = {
  original:  { label: 'Original',   cls: 'badge-edicion' },
  animal:    { label: 'Animal',      cls: 'badge-nuevo'   },
  personaje: { label: 'Personaje',   cls: 'badge-popular' },
  llavero:   { label: 'Llavero',     cls: 'badge-llavero' },
}

function fmtPrecio(n) {
  return '$' + Number(n).toLocaleString('es-CO')
}

function pedirWA(nombre, precio) {
  const msg = encodeURIComponent(
    `¡Hola Strawberry Yarn! 🍓\nMe interesa: *${nombre}* (${fmtPrecio(precio)})\n¿Está disponible?`
  )
  window.open(`https://wa.me/${WA_TEL}?text=${msg}`, '_blank', 'noopener,noreferrer')
}

export default function ProductCard({ producto, onOpen3D }) {
  const { nombre, precio, categoria, descripcion, imagen, color, stock } = producto
  const badge = BADGE_MAP[categoria] ?? { label: categoria, cls: 'badge-nuevo' }
  const imgSrc = `/assets/productos/${imagen}`
  const precioFmt = fmtPrecio(precio)

  return (
    <div className="product-card">
      <div className="product-img">
        <img src={imgSrc} alt={nombre} loading="lazy"
          onError={e => { e.target.style.display = 'none' }} />
        <span className={`badge ${badge.cls}`}>{badge.label}</span>
        {stock <= 3 && stock > 0 && (
          <span className="badge badge-raro" style={{ top: 11, left: 'auto', right: 11 }}>
            ¡Últimas!
          </span>
        )}
      </div>
      <div className="product-info">
        <h3>{nombre}</h3>
        <p className="desc">{descripcion}</p>
        <div className="price-row">
          <span className="product-price">{precioFmt}</span>
          <span className="product-stars">★★★★★</span>
        </div>
        <div className="product-btns">
          <button className="btn-3d" onClick={() => onOpen3D({ nombre, precio: precioFmt, descripcion, color, imagen })}>
            🔮 3D
          </button>
          <button className="btn-ar" onClick={() => {
            const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent)
            if (!isMobile) { alert('💡 Abre desde tu smartphone para usar la Realidad Aumentada.') ; return }
            window.location.href = '/ar'
          }}>
            📱 AR
          </button>
          <button className="btn-wa" onClick={() => pedirWA(nombre, precio)}>
            💬 WA
          </button>
        </div>
      </div>
    </div>
  )
}
