const router = require('express').Router();
const Pedido = require('../models/Pedido');
const auth   = require('../middleware/auth');

// GET /api/pedidos  — protegido
router.get('/', auth, async (_req, res) => {
  try {
    const pedidos = await Pedido.find().sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/pedidos  — público (cliente pide por WhatsApp y se registra)
router.post('/', async (req, res) => {
  try {
    const p = await Pedido.create(req.body);
    res.status(201).json(p);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// PUT /api/pedidos/:id  — protegido (cambiar estado)
router.put('/:id', auth, async (req, res) => {
  try {
    const p = await Pedido.findByIdAndUpdate(req.params.id, { estado: req.body.estado }, { new: true });
    if (!p) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(p);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

module.exports = router;
