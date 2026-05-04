import { useState, useEffect, useRef, useCallback } from 'react'
import Header      from './components/Header'
import Hero        from './components/Hero'
import Valores     from './components/Valores'
import Catalogo    from './components/Catalogo'
import ARSection   from './components/ARSection'
import Footer      from './components/Footer'
import Modal3D     from './components/Modal3D'
import WhatsAppFAB from './components/WhatsAppFAB'
import './styles/app.css'

export default function App() {
  const [modalData, setModalData] = useState(null)

  const openModal = useCallback((data) => setModalData(data), [])
  const closeModal = useCallback(() => setModalData(null), [])

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
      }),
      { threshold: 0.10, rootMargin: '0px 0px -36px 0px' }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Valores />
        <Catalogo onOpenModal={openModal} />
        <ARSection />
      </main>
      <Footer />
      <Modal3D data={modalData} onClose={closeModal} />
      <WhatsAppFAB />
    </>
  )
}
