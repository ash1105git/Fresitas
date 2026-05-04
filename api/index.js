// ═══════════════════════════════════════════════════════════════
//  api/index.js — Cliente centralizado para el backend
//
//  Importa este archivo en frontend/ y login/ para todas las
//  llamadas HTTP. Ejemplo:
//    import { getProductos, login } from '../../api/index.js'
// ═══════════════════════════════════════════════════════════════

const BASE_URL = import.meta?.env?.VITE_API_URL ?? 'http://localhost:4000/api';

// ── Helpers ────────────────────────────────────────────────────
function getToken() {
  return localStorage.getItem('sy_token');
}

async function request(method, path, body = null, requiresAuth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (requiresAuth) {
    const token = getToken();
    if (!token) throw new Error('No autenticado');
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Error del servidor');
  return data;
}

// ── Auth ───────────────────────────────────────────────────────
export const authAPI = {
  login:  (usuario, password) => request('POST', '/auth/login', { usuario, password }),
  me:     ()                  => request('GET',  '/auth/me', null, true),
};

// ── Productos ──────────────────────────────────────────────────
export const productosAPI = {
  getAll:   (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/productos${q ? '?' + q : ''}`);
  },
  getById:  (id)          => request('GET',    `/productos/${id}`),
  create:   (data)        => request('POST',   '/productos', data, true),
  update:   (id, data)    => request('PUT',    `/productos/${id}`, data, true),
  remove:   (id)          => request('DELETE', `/productos/${id}`, null, true),
};

// ── Pedidos ────────────────────────────────────────────────────
export const pedidosAPI = {
  getAll:         ()           => request('GET',  '/pedidos', null, true),
  create:         (data)       => request('POST', '/pedidos', data),
  updateEstado:   (id, estado) => request('PUT',  `/pedidos/${id}`, { estado }, true),
};

// ── Auth helpers ───────────────────────────────────────────────
export function saveSession(token) {
  localStorage.setItem('sy_token', token);
}

export function clearSession() {
  localStorage.removeItem('sy_token');
}

export function isLoggedIn() {
  return Boolean(getToken());
}
