const mongoose = require('mongoose');

const movimientoSchema = new mongoose.Schema({
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  tipo: { type: String, enum: ['entrada', 'salida'], required: true },
  cantidad: { type: Number, required: true },
  motivo: { type: String },
  fecha: { type: Date, default: Date.now },
  usuario: { type: String, required: true }
});

module.exports = mongoose.model('Movimiento', movimientoSchema);