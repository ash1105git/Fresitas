import { useState, useEffect, useCallback } from 'react'
import './admin.css'

const API_URL   = import.meta.env.VITE_API_URL   ?? 'http://localhost:4000/api'
const LOGIN_URL = import.meta.env.VITE_LOGIN_URL ?? 'http://localhost:5174'

function getToken()   { return localStorage.getItem('sy_token') }
function getUsuario() { return localStorage.getItem('sy_usuario') ?? 'admin' }

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }
}

const ESTADO_COLORS = { nuevo: '#e8354a', proceso: '#f4a261', enviado: '#2980b9', entregado: '#27ae60' }

// ─────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [seccion,   setSeccion]   = useState('dashboard')
  const [productos, setProductos] = useState([])
  const [pedidos,   setPedidos]   = useState([])
  const [busqueda,  setBusqueda]  = useState('')
  const [modal,     setModal]     = useState(null)   // null | { modo:'nuevo'|'editar', data }
  const [form,      setForm]      = useState({})
  const [loading,   setLoading]   = useState(false)
  const [toast,     setToast]     = useState('')

  // Proteger ruta
  useEffect(() => {
    if (!getToken()) window.location.replace(LOGIN_URL)
  }, [])

  // Fetch productos
  const fetchProductos = useCallback(async () => {
    const res  = await fetch(`${API_URL}/productos`, { headers: authHeaders() })
    const data = await res.json()
    setProductos(Array.isArray(data) ? data : [])
  }, [])

  // Fetch pedidos
  const fetchPedidos = useCallback(async () => {
    const res  = await fetch(`${API_URL}/pedidos`, { headers: authHeaders() })
    const data = await res.json()
    setPedidos(Array.isArray(data) ? data : [])
  }, [])

  useEffect(() => {
    fetchProductos()
    fetchPedidos()
  }, [fetchProductos, fetchPedidos])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }

  function cerrarSesion() {
    localStorage.removeItem('sy_token')
    localStorage.removeItem('sy_usuario')
    window.location.replace(LOGIN_URL)
  }

  // ── Navegación ────────────────────────────────────────────
  function navItem(key, icon, label) {
    return (
      <button
        key={key}
        className={`nav-item${seccion === key ? ' active' : ''}`}
        onClick={() => setSeccion(key)}
      >
        <span className="nav-icon">{icon}</span> {label}
      </button>
    )
  }

  // ── Dashboard stats ───────────────────────────────────────
  const stats = {
    totalProductos: productos.length,
    stockBajo:      productos.filter(p => p.stock <= 3).length,
    pedidosNuevos:  pedidos.filter(p => p.estado === 'nuevo').length,
    ingresos:       pedidos.reduce((s, p) => s + (p.total ?? 0), 0),
  }

  // ── Productos ─────────────────────────────────────────────
  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  function abrirNuevo() {
    setForm({ nombre: '', precio: '', categoria: 'original', descripcion: '', stock: 0, color: '#e8354a' })
    setModal({ modo: 'nuevo' })
  }
  function abrirEditar(p) {
    setForm({ ...p, precio: String(p.precio) })
    setModal({ modo: 'editar', id: p._id })
  }

  async function guardar() {
    setLoading(true)
    try {
      const body = { ...form, precio: Number(form.precio) }
      const url  = modal.modo === 'nuevo' ? `${API_URL}/productos` : `${API_URL}/productos/${modal.id}`
      const meth = modal.modo === 'nuevo' ? 'POST' : 'PUT'
      const res  = await fetch(url, { method: meth, headers: authHeaders(), body: JSON.stringify(body) })
      if (!res.ok) throw new Error((await res.json()).error)
      await fetchProductos()
      setModal(null)
      showToast(modal.modo === 'nuevo' ? '✅ Producto creado' : '✅ Producto actualizado')
    } catch (e) { showToast('❌ ' + e.message) }
    finally { setLoading(false) }
  }

  async function eliminar(id) {
    if (!confirm('¿Eliminar este producto?')) return
    await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE', headers: authHeaders() })
    await fetchProductos()
    showToast('🗑️ Producto eliminado')
  }

  // ── Pedidos ───────────────────────────────────────────────
  async function cambiarEstado(id, estado) {
    await fetch(`${API_URL}/pedidos/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ estado }),
    })
    await fetchPedidos()
  }

  function fmtPrecio(n) { return '$' + Number(n).toLocaleString('es-CO') }
  function fmtFecha(d)  { return new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }) }

  // ─────────────────────────────────────────────────────────
  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <span className="sidebar-logo-emoji">🍓</span>
            Strawberry Yarn
          </div>
          <div className="sidebar-sub">Panel de administración</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Principal</div>
          {navItem('dashboard', '📊', 'Dashboard')}
          {navItem('productos', '🧶', 'Productos')}
          {navItem('pedidos',   '📦', 'Pedidos')}
          <div className="nav-section-label" style={{ marginTop: 14 }}>Tienda</div>
          <a className="nav-item" href="/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <span className="nav-icon">🏪</span> Ver tienda
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-avatar">👤</div>
            <div className="user-info">
              <div className="user-name">{getUsuario()}</div>
              <div className="user-role">Administrador</div>
            </div>
            <button className="logout-btn" onClick={cerrarSesion} title="Cerrar sesión">🚪</button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-title">
            {{ dashboard: 'Dashboard', productos: 'Productos', pedidos: 'Pedidos' }[seccion]}
          </h1>
        </div>

        {/* ── DASHBOARD ── */}
        {seccion === 'dashboard' && (
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(232,53,74,.1)', color: 'var(--rojo)' }}>🧶</div>
              <div className="stat-info">
                <div className="stat-value">{stats.totalProductos}</div>
                <div className="stat-label">Productos activos</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(244,162,97,.1)', color: '#e67e22' }}>⚠️</div>
              <div className="stat-info">
                <div className="stat-value">{stats.stockBajo}</div>
                <div className="stat-label">Stock bajo</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(41,128,185,.1)', color: '#2980b9' }}>📦</div>
              <div className="stat-info">
                <div className="stat-value">{stats.pedidosNuevos}</div>
                <div className="stat-label">Pedidos nuevos</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(39,174,96,.1)', color: '#27ae60' }}>💰</div>
              <div className="stat-info">
                <div className="stat-value">{fmtPrecio(stats.ingresos)}</div>
                <div className="stat-label">Ingresos totales</div>
              </div>
            </div>

            {/* Últimos pedidos */}
            <div className="recent-card">
              <div className="recent-header">
                <span>📋 Últimos pedidos</span>
                <button className="link-btn" onClick={() => setSeccion('pedidos')}>Ver todos →</button>
              </div>
              <table className="admin-table">
                <thead><tr><th>Cliente</th><th>Producto</th><th>Total</th><th>Estado</th></tr></thead>
                <tbody>
                  {pedidos.slice(0, 5).map(p => (
                    <tr key={p._id}>
                      <td>{p.cliente}</td>
                      <td>{p.producto}</td>
                      <td>{fmtPrecio(p.total)}</td>
                      <td><span className="estado-badge" style={{ background: ESTADO_COLORS[p.estado] }}>{p.estado}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PRODUCTOS ── */}
        {seccion === 'productos' && (
          <div className="section-content">
            <div className="section-toolbar">
              <input
                className="prod-search"
                type="text"
                placeholder="Buscar producto…"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
              <button className="btn-add" onClick={abrirNuevo}>＋ Nuevo producto</button>
            </div>

            <div className="prod-grid">
              {filtrados.map(p => (
                <div key={p._id} className="prod-item">
                  <div className="prod-img-wrap">
                    <img src={`/assets/productos/${p.imagen}`} alt={p.nombre}
                      onError={e => { e.target.src = '' ; e.target.style.display = 'none' }} />
                    <span className={`prod-stock${p.stock <= 3 ? ' low' : ''}`}>{p.stock} uds</span>
                  </div>
                  <div className="prod-body">
                    <span className="prod-cat">{p.categoria}</span>
                    <strong className="prod-nombre">{p.nombre}</strong>
                    <span className="prod-precio">${p.precio.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="prod-actions">
                    <button className="btn-edit"   onClick={() => abrirEditar(p)}>✏️</button>
                    <button className="btn-delete" onClick={() => eliminar(p._id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PEDIDOS ── */}
        {seccion === 'pedidos' && (
          <div className="section-content">
            <table className="admin-table full">
              <thead>
                <tr>
                  <th>Cliente</th><th>Teléfono</th><th>Producto</th>
                  <th>Total</th><th>Fecha</th><th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map(p => (
                  <tr key={p._id}>
                    <td>{p.cliente}</td>
                    <td>{p.telefono || '—'}</td>
                    <td>{p.producto}</td>
                    <td>{fmtPrecio(p.total)}</td>
                    <td>{fmtFecha(p.createdAt)}</td>
                    <td>
                      <select
                        className="estado-select"
                        value={p.estado}
                        style={{ borderLeft: `3px solid ${ESTADO_COLORS[p.estado]}` }}
                        onChange={e => cambiarEstado(p._id, e.target.value)}
                      >
                        {['nuevo','proceso','enviado','entregado'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ── MODAL PRODUCTO ── */}
      {modal && (
        <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-inner" style={{ maxWidth: 520, display: 'block', padding: 36 }}>
            <button className="modal-cerrar" onClick={() => setModal(null)}>✕</button>
            <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 24 }}>
              {modal.modo === 'nuevo' ? 'Nuevo producto' : 'Editar producto'}
            </h2>

            {[
              { key: 'nombre',      label: 'Nombre',      type: 'text',   placeholder: 'Ej: Fresita Clásica' },
              { key: 'precio',      label: 'Precio (COP)',type: 'number', placeholder: '25000' },
              { key: 'stock',       label: 'Stock',       type: 'number', placeholder: '10' },
              { key: 'color',       label: 'Color 3D',    type: 'color'  },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key} className="form-group-admin">
                <label>{label}</label>
                <input
                  type={type}
                  value={form[key] ?? ''}
                  placeholder={placeholder}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}

            <div className="form-group-admin">
              <label>Categoría</label>
              <select value={form.categoria ?? 'original'} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
                {['original','animal','personaje','llavero'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group-admin">
              <label>Descripción</label>
              <textarea
                rows={3}
                value={form.descripcion ?? ''}
                placeholder="Descripción del producto…"
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={guardar} disabled={loading}>
                {loading ? '⏳ Guardando…' : '💾 Guardar'}
              </button>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  )
}
