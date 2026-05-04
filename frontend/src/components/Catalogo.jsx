import { useState, useRef, useMemo } from 'react'
import useProductos from '../hooks/useProductos'
import ProductCard  from './ProductCard'

const CHIPS = [
  { key: 'all',         label: 'Todos' },
  { key: 'animal',      label: '🐾 Animales' },
  { key: 'personaje',   label: '🌟 Personajes' },
  { key: 'llavero',     label: '🔑 Llaveros' },
  { key: 'original',    label: '✨ Originales' },
  { key: 'precio-asc',  label: '💰 Menor precio' },
  { key: 'precio-desc', label: '💎 Mayor precio' },
]

const CARD_W = 272 + 22

export default function Catalogo({ onOpenModal }) {
  const { productos, loading, error } = useProductos()
  const [query,    setQuery]    = useState('')
  const [filtro,   setFiltro]   = useState('all')
  const trackRef = useRef(null)

  // Drag-to-scroll
  const drag = useRef({ isDown: false, startX: 0, scrollLeft: 0 })
  const onMouseDown = e => {
    drag.current = { isDown: true, startX: e.pageX - trackRef.current.offsetLeft, scrollLeft: trackRef.current.scrollLeft }
    trackRef.current.style.cursor = 'grabbing'
  }
  const onMouseUp   = () => { drag.current.isDown = false; if (trackRef.current) trackRef.current.style.cursor = 'grab' }
  const onMouseMove = e => {
    if (!drag.current.isDown || !trackRef.current) return
    e.preventDefault()
    const x = e.pageX - trackRef.current.offsetLeft
    trackRef.current.scrollLeft = drag.current.scrollLeft - (x - drag.current.startX)
  }

  // Filtros
  const filtered = useMemo(() => {
    let list = [...productos]
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(p =>
        p.nombre.toLowerCase().includes(q) || p.descripcion?.toLowerCase().includes(q)
      )
    }
    if (filtro !== 'all' && filtro !== 'precio-asc' && filtro !== 'precio-desc') {
      list = list.filter(p => p.categoria === filtro)
    }
    if (filtro === 'precio-asc')  list.sort((a, b) => a.precio - b.precio)
    if (filtro === 'precio-desc') list.sort((a, b) => b.precio - a.precio)
    return list
  }, [productos, query, filtro])

  const isSearching = query.trim() !== '' || filtro !== 'all'

  return (
    <section id="catalogo">
      <div className="section-header reveal">
        <div className="section-tag">Colección artesanal</div>
        <h2>Descubre nuestros productos</h2>
        <p>Cada pieza tejida con amor y detalle único</p>
      </div>

      {/* Buscador */}
      <div className="search-wrap">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Buscar producto…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoComplete="off"
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')}>✕</button>
          )}
        </div>

        <div className="filter-chips">
          {CHIPS.map(c => (
            <button
              key={c.key}
              className={`chip${filtro === c.key ? ' active' : ''}`}
              onClick={() => setFiltro(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {isSearching && (
          <div className={`results-count${filtered.length > 0 ? ' activo' : ''}`}>
            {filtered.length === 0
              ? 'Sin resultados'
              : `${filtered.length} producto${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`}
          </div>
        )}
      </div>

      {/* Estado carga / error */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--gris-texto)' }}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: 12 }}>🧶</span>
          Cargando productos…
        </div>
      )}
      {error && (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--rojo)' }}>
          Error al cargar: {error}
        </div>
      )}

      {/* Slider (modo normal) */}
      {!loading && !error && !isSearching && (
        <div className="slider-wrapper">
          <div
            className="slider-track"
            ref={trackRef}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onMouseMove={onMouseMove}
          >
            {filtered.map(p => (
              <ProductCard key={p._id} producto={p} onOpen3D={onOpenModal} />
            ))}
          </div>
          <div className="slider-nav">
            <button className="slider-btn" onClick={() => trackRef.current?.scrollBy({ left: -CARD_W, behavior: 'smooth' })}>←</button>
            <button className="slider-btn" onClick={() => trackRef.current?.scrollBy({ left:  CARD_W, behavior: 'smooth' })}>→</button>
          </div>
        </div>
      )}

      {/* Grid (modo búsqueda) */}
      {!loading && !error && isSearching && (
        <div className="products-grid">
          {filtered.length === 0 ? (
            <div className="empty-results">
              <span>🔍</span>
              No encontramos "{query}" en ninguna categoría.
            </div>
          ) : (
            filtered.map(p => (
              <ProductCard key={p._id} producto={p} onOpen3D={onOpenModal} />
            ))
          )}
        </div>
      )}
    </section>
  )
}
