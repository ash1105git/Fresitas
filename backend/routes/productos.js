const router   = require('express').Router();
const Producto = require('../models/Producto');
const auth     = require('../middleware/auth');

// GET /api/productos  — público
router.get('/', async (req, res) => {
  try {
    const { categoria, q } = req.query;
    const filtro = { activo: true };
    if (categoria && categoria !== 'all') filtro.categoria = categoria;
    if (q) filtro.nombre = { $regex: q, $options: 'i' };
    const productos = await Producto.find(filtro).sort({ createdAt: -1 });
    res.json(productos);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/productos/:id  — público
router.get('/:id', async (req, res) => {
  try {
    const p = await Producto.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(p);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/productos  — protegido
router.post('/', auth, async (req, res) => {
  try {
    const p = await Producto.create(req.body);
    res.status(201).json(p);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// PUT /api/productos/:id  — protegido
router.put('/:id', auth, async (req, res) => {
  try {
    const p = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(p);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// DELETE /api/productos/:id  — protegido (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Producto.findByIdAndUpdate(req.params.id, { activo: false });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
