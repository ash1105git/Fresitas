const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  nombre:      { type: String, required: true, trim: true },
  precio:      { type: Number, required: true },
  categoria:   { type: String, enum: ['original', 'animal', 'personaje', 'llavero'], required: true },
  descripcion: { type: String, default: '' },
  imagen:      { type: String, default: 'p1.jpeg' },
  color:       { type: String, default: '#e8354a' },
  stock:       { type: Number, default: 0 },
  activo:      { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Producto', ProductoSchema);
