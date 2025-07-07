const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  contacto: { type: String },
  telefono: { type: String },
  email: { type: String },
  productosOfrecidos: [{ type: String }]  
});

module.exports = mongoose.model('Proveedor', proveedorSchema);