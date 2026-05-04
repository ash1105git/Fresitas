const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
  cliente:   { type: String, required: true },
  telefono:  { type: String, default: '' },
  producto:  { type: String, required: true },
  total:     { type: Number, required: true },
  estado:    { type: String, enum: ['nuevo', 'proceso', 'enviado', 'entregado'], default: 'nuevo' },
}, { timestamps: true });

module.exports = mongoose.model('Pedido', PedidoSchema);
