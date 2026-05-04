# api/ — Capa de comunicación centralizada

Carpeta compartida entre `frontend/` y `login/`.  
Contiene un único cliente fetch con todos los endpoints del backend.

## Uso

```js
import { authAPI, productosAPI, pedidosAPI, saveSession, isLoggedIn } from '../../api/index.js'

// Login
const { token } = await authAPI.login('admin', 'strawberry2026')
saveSession(token)

// Productos
const productos = await productosAPI.getAll({ categoria: 'animal' })
const uno       = await productosAPI.getById('...')
await productosAPI.create({ nombre: 'Nuevo', precio: 20000, categoria: 'original' })
await productosAPI.update('...', { precio: 22000 })
await productosAPI.remove('...')

// Pedidos
const pedidos = await pedidosAPI.getAll()
await pedidosAPI.updateEstado('...', 'enviado')
```

## Variable de entorno

Crea un `.env` en `frontend/` o `login/` con:

```
VITE_API_URL=http://localhost:4000/api
```

En producción cambia la URL a tu servidor desplegado.

## Endpoints del backend

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/auth/login | No | Login → devuelve JWT |
| GET  | /api/auth/me | Sí | Verifica token |
| GET  | /api/productos | No | Lista productos (filtros: ?categoria= &q=) |
| GET  | /api/productos/:id | No | Un producto |
| POST | /api/productos | Sí | Crear producto |
| PUT  | /api/productos/:id | Sí | Editar producto |
| DELETE | /api/productos/:id | Sí | Desactivar producto |
| GET  | /api/pedidos | Sí | Lista pedidos |
| POST | /api/pedidos | No | Crear pedido |
| PUT  | /api/pedidos/:id | Sí | Cambiar estado |
