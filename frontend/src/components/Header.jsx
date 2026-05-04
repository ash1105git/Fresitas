import { useEffect, useState } from 'react'

const LOGIN_URL = import.meta.env.VITE_LOGIN_URL ?? 'http://localhost:5174'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header id="site-header" className={scrolled ? 'scrolled' : ''}>
      <a href="#" className="logo">
        <div className="logo-img" style={{ background: 'linear-gradient(135deg,#fde8ed,#f9c0c9)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' }}>🍓</div>
        <span className="logo-texto">Strawberry Yarn</span>
      </a>

      <nav className={menuOpen ? 'open' : ''}>
        <a href="#hero"     onClick={closeMenu}>Inicio</a>
        <a href="#catalogo" onClick={closeMenu}>Catálogo</a>
        <a href="#ar-section" onClick={closeMenu}>AR</a>
        <a href="#catalogo" className="nav-carrito" onClick={closeMenu} aria-label="Catálogo">🛒</a>
        <a href={LOGIN_URL} style={{ fontSize: '18px' }} title="Admin">🔐</a>
      </nav>

      <button
        className={`burger${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(v => !v)}
        aria-label="Menú"
      >
        <span /><span /><span />
      </button>
    </header>
  )
}
