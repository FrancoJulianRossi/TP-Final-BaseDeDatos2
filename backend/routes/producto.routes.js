const express = require('express');
const router = express.Router();

const {
  agregarProducto,
  consultarStock,
  productosStockBajo,
  listarProductos
} = require('../controllers/producto.controller');

router.post('/', agregarProducto);
router.get('/', listarProductos);
router.get('/stock/bajo', productosStockBajo);
router.get('/:codigo', consultarStock);

module.exports = router;