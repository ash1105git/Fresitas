# 🍓 Strawberry Yarn — Migración Full Stack

Proyecto migrado a **React 18 + Vue 3 + Node.js + Express + MongoDB**.

## Estructura

```
fresitas-migrado/
├── backend/   → Node.js + Express + MongoDB (API REST)
├── api/       → Cliente fetch centralizado (compartido)
├── login/     → Vue 3 + Vite (módulo de autenticación)
└── frontend/  → React 18 + Vite (galería, 3D, AR, admin)
```

---

## 1. Requisitos previos

- Node.js 18+
- Cuenta en [MongoDB Atlas](https://cloud.mongodb.com) (gratis)

---

## 2. Backend

```bash
cd backend
cp .env.example .env
# Edita .env con tu MONGO_URI y JWT_SECRET
npm install
npm run dev
# → http://localhost:4000
```

El servidor crea automáticamente:
- 24 productos de ejemplo
- Usuario admin (usuario: `admin`, contraseña: `strawberry2026`)

---

## 3. Login (Vue 3)

```bash
cd login
cp .env.example .env
npm install
npm run dev
# → http://localhost:5174
```

---

## 4. Frontend (React 18)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
# → http://localhost:5173
```

Rutas:
- `/`      → Galería principal
- `/admin` → Panel de administración (requiere JWT)

---

## 5. Variables de entorno

### backend/.env
```
PORT=4000
MONGO_URI=mongodb+srv://...
JWT_SECRET=strawberry_yarn_secret_2026
JWT_EXPIRES=8h
```

### login/.env y frontend/.env
```
VITE_API_URL=http://localhost:4000/api
VITE_LOGIN_URL=http://localhost:5174
VITE_FRONTEND_URL=http://localhost:5173
VITE_WA_TELEFONO=573001234567
```

---

## 6. Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend galería | React 18 + Vite |
| Login/Auth UI | Vue 3 + Vite |
| Motor 3D | Three.js r128 (procedural) |
| Realidad Aumentada | AR.js + A-Frame |
| Backend | Node.js + Express |
| Base de datos | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |

---

## 7. Flujo de autenticación

```
Usuario → login/ (Vue) → POST /api/auth/login → JWT
JWT → localStorage → frontend/admin → Bearer token → API protegida
```

---

## 8. AR — Marcador Hiro

Para usar la Realidad Aumentada imprime el marcador **Hiro**:  
https://jeromeetienne.github.io/AR.js/data/images/HIRO.jpg

Apunta la cámara del celular al marcador y verás el modelo 3D animado.

---

## 9. Deploy sugerido

| Servicio | Capa |
|----------|------|
| [Railway](https://railway.app) | backend/ |
| [MongoDB Atlas](https://cloud.mongodb.com) | Base de datos |
| [Vercel](https://vercel.com) | frontend/ |
| [Vercel](https://vercel.com) | login/ |

En producción actualiza las URLs en los `.env` de cada módulo.
