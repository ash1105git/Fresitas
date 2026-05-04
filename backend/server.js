// ═══════════════════════════════════════════════════════════════
//  server.js — Entrada principal del backend Strawberry Yarn
// ═══════════════════════════════════════════════════════════════
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const authRoutes     = require('./routes/auth');
const productoRoutes = require('./routes/productos');
const pedidoRoutes   = require('./routes/pedidos');

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ─────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',  // frontend React
    'http://localhost:5174',  // login Vue
    'http://localhost:3000',
  ],
  credentials: true,
}));
app.use(express.json());

// ── Rutas ──────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos',   pedidoRoutes);

// ── Health check ───────────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ ok: true, mensaje: '🍓 Strawberry Yarn API corriendo' })
);

// ── Conexión MongoDB ───────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅  MongoDB conectado');
    await seedIfEmpty();
    app.listen(PORT, () =>
      console.log(`🚀  Servidor en http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error('❌  Error MongoDB:', err.message);
    process.exit(1);
  });

// ── Seed inicial de productos ──────────────────────────────────
async function seedIfEmpty() {
  const Producto = require('./models/Producto');
  const count = await Producto.countDocuments();
  if (count > 0) return;

  const productos = [
    { nombre: 'Fresita Clásica',     precio: 25000, categoria: 'original',  descripcion: 'Fresita tejida en hilo rojo con hoja verde. Perfecta como decoración o regalo.', imagen: 'p1.jpeg',  stock: 10, color: '#e8354a' },
    { nombre: 'Llavero Fresita',     precio: 18000, categoria: 'llavero',   descripcion: 'Fresita mini con argolla dorada. Ideal para bolsos y mochilas.', imagen: 'p2.jpeg',  stock: 15, color: '#e8354a' },
    { nombre: 'Fresita Rosada',      precio: 22000, categoria: 'original',  descripcion: 'Fresita en rosa pastel con detalles blancos. El regalo perfecto.', imagen: 'p3.jpeg',  stock: 8,  color: '#f9a8c9' },
    { nombre: 'Fresita Morada',      precio: 22000, categoria: 'original',  descripcion: 'Fresita en hilo morado brillante. Edición especial de colección.', imagen: 'p4.jpeg',  stock: 5,  color: '#9b59b6' },
    { nombre: 'Osito Amigurumi',     precio: 35000, categoria: 'animal',    descripcion: 'Adorable osito en algodón café con ojos de seguridad y nariz bordada. 18 cm.', imagen: 'p5.jpeg',  stock: 7,  color: '#a0522d' },
    { nombre: 'Gatito Amigurumi',    precio: 38000, categoria: 'animal',    descripcion: 'Tierno gatito bicolor. Ojos de seguridad y nariz bordada. Tamaño palma.', imagen: 'p6.jpeg',  stock: 6,  color: '#f5f5f0' },
    { nombre: 'Conejito Pastel',     precio: 32000, categoria: 'animal',    descripcion: 'Adorable conejito en hilo pastel con orejas largas. Relleno hipoalergénico.', imagen: 'p7.jpeg',  stock: 9,  color: '#e8c4c4' },
    { nombre: 'Dino Verde',          precio: 40000, categoria: 'animal',    descripcion: 'Dinosaurio amigurumi en hilo verde con escamas. Ojos expresivos. 20 cm.', imagen: 'p8.jpeg',  stock: 4,  color: '#388e3c' },
    { nombre: 'Llavero Estrella',    precio: 15000, categoria: 'llavero',   descripcion: 'Estrella brillante en hilo dorado. El accesorio perfecto.', imagen: 'p9.jpeg',  stock: 20, color: '#f0c040' },
    { nombre: 'Perezoso Amigurumi',  precio: 42000, categoria: 'animal',    descripcion: 'Adorable perezoso tejido en hilo beige suave. Ideal para colgar.', imagen: 'p10.jpeg', stock: 5,  color: '#c8a96e' },
    { nombre: 'Pulpo Amigurumi',     precio: 38000, categoria: 'animal',    descripcion: 'Pulpo en hilo azul con 8 tentáculos. Ojos expresivos. Aprox. 15 cm.', imagen: 'p11.jpeg', stock: 6,  color: '#1565c0' },
    { nombre: 'Pingüino Amigurumi',  precio: 35000, categoria: 'animal',    descripcion: 'Pingüino adorable en algodón bicolor con pico naranja. 16 cm.', imagen: 'p12.jpeg', stock: 8,  color: '#2c3e50' },
    { nombre: 'Unicornio Mágico',    precio: 45000, categoria: 'personaje', descripcion: 'Unicornio en hilo blanco con cuerno dorado y crin multicolor. 20 cm.', imagen: 'p13.jpeg', stock: 3,  color: '#f8bbd9' },
    { nombre: 'Loro Amigurumi',      precio: 36000, categoria: 'animal',    descripcion: 'Loro en hilo verde con pico amarillo y alas detalladas. 17 cm.', imagen: 'p14.jpeg', stock: 7,  color: '#2e7d32' },
    { nombre: 'Llavero Corazón',     precio: 14000, categoria: 'llavero',   descripcion: 'Corazón tejido en hilo rojo brillante con argolla dorada.', imagen: 'p15.jpeg', stock: 25, color: '#c0392b' },
    { nombre: 'Aguacate Kawaii',     precio: 28000, categoria: 'original',  descripcion: 'Aguacate kawaii con carita feliz. Edición especial de temporada.', imagen: 'p16.jpeg', stock: 10, color: '#558b2f' },
    { nombre: 'Cactus Sonriente',    precio: 24000, categoria: 'original',  descripcion: 'Cactus amigurumi con florecita rosada. Perfecto para decorar.', imagen: 'p17.jpeg', stock: 12, color: '#33691e' },
    { nombre: 'Oso Panda',           precio: 40000, categoria: 'animal',    descripcion: 'Panda adorable en algodón bicolor. Ojos de seguridad premium. 19 cm.', imagen: 'p18.jpeg', stock: 5,  color: '#212121' },
    { nombre: 'Llavero Nube',        precio: 16000, categoria: 'llavero',   descripcion: 'Nubecita blanca con carita tierna. Argolla metálica dorada.', imagen: 'p19.jpeg', stock: 18, color: '#90caf9' },
    { nombre: 'Dragón Mini',         precio: 48000, categoria: 'personaje', descripcion: 'Dragoncito en hilo verde esmeralda con alas. Edición especial.', imagen: 'p20.jpeg', stock: 3,  color: '#00695c' },
    { nombre: 'Ballena Azul',        precio: 30000, categoria: 'animal',    descripcion: 'Ballena amigurumi en hilo azul marino. Suave y adorable. 17 cm.', imagen: 'p21.jpeg', stock: 8,  color: '#1976d2' },
    { nombre: 'Seta Mágica',         precio: 26000, categoria: 'original',  descripcion: 'Seta colorida con lunares blancos. Inspirada en los cuentos.', imagen: 'p22.jpeg', stock: 11, color: '#e53935' },
    { nombre: 'Zorro Naranja',       precio: 38000, categoria: 'animal',    descripcion: 'Zorro amigurumi en hilo naranja con punta blanca. 18 cm.', imagen: 'p23.jpeg', stock: 6,  color: '#e64a19' },
    { nombre: 'Set Fresitas x3',     precio: 60000, categoria: 'original',  descripcion: 'Set de 3 fresitas en colores clásico, rosa y morado. Presentación especial.', imagen: 'p24.jpeg', stock: 4,  color: '#e8354a' },
  ];

  await Producto.insertMany(productos);
  console.log(`🌱  Seed: ${productos.length} productos insertados`);

  // Usuario admin por defecto
  const User    = require('./models/User');
  const bcrypt  = require('bcryptjs');
  const uCount  = await User.countDocuments();
  if (uCount === 0) {
    const hash = await bcrypt.hash('strawberry2026', 10);
    await User.create({ usuario: 'admin', password: hash });
    console.log('🌱  Seed: usuario admin creado (pass: strawberry2026)');
  }
}
