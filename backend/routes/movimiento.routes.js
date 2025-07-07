const express = require('express');
const router = express.Router();

const { registrarMovimiento, listarMovimientos } = require('../controllers/movimiento.controller');

router.post('/', registrarMovimiento);
router.get('/', listarMovimientos);

module.exports = router;