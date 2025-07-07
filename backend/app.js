const express = require('express');
const cors = require('cors');

const productoRoutes = require('./routes/producto.routes');
const proveedorRoutes = require('./routes/proveedor.routes');
const movimientoRoutes = require('./routes/movimiento.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/productos', productoRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/movimientos', movimientoRoutes);

module.exports = app;