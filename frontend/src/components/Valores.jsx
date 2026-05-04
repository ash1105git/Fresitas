export default function Valores() {
  const items = [
    { icon: '🧶', titulo: 'Hecho a mano', desc: 'Cada pieza tejida con dedicación usando hilos premium.' },
    { icon: '🔮', titulo: 'Visor 3D',     desc: 'Explora productos en 360° con nuestro visor interactivo.' },
    { icon: '📱', titulo: 'Realidad Aumentada', desc: 'Visualiza el producto en tu espacio antes de comprarlo.' },
  ]
  return (
    <section id="valores">
      <div className="valores-grid">
        {items.map((v, i) => (
          <div key={i} className="valor-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
            <div className="valor-icono">{v.icon}</div>
            <div className="valor-texto">
              <h3>{v.titulo}</h3>
              <p>{v.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
