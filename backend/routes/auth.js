const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { usuario, password } = req.body;
    if (!usuario || !password)
      return res.status(400).json({ error: 'Completa usuario y contraseña' });

    const user = await User.findOne({ usuario });
    if (!user) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

    const token = jwt.sign(
      { id: user._id, usuario: user.usuario },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '8h' }
    );
    res.json({ token, usuario: user.usuario });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/auth/me  (ruta protegida de verificación)
const auth = require('../middleware/auth');
router.get('/me', auth, (req, res) => {
  res.json({ usuario: req.user.usuario });
});

module.exports = router;
