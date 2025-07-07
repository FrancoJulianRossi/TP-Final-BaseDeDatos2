const express = require('express');
const router = express.Router();

const { agregarProveedor, listarProveedores } = require('../controllers/proveedor.controller');

router.post('/', agregarProveedor);
router.get('/', listarProveedores);

module.exports = router;