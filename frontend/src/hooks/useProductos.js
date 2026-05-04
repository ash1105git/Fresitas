import { useState, useEffect, useCallback } from 'react'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'

export default function useProductos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  const fetchProductos = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const qs  = new URLSearchParams(params).toString()
      const res = await fetch(`${API_URL}/productos${qs ? '?' + qs : ''}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al cargar productos')
      setProductos(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProductos() }, [fetchProductos])

  return { productos, loading, error, refetch: fetchProductos }
}
