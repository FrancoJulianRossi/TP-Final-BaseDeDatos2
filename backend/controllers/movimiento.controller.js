const Movimiento = require('../models/movimiento.model');
const Producto = require('../models/producto.model');

const registrarMovimiento = async (req, res) => {
  try {
    const { productoId, tipo, cantidad, motivo, usuario } = req.body;

    const producto = await Producto.findById(productoId);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    if (tipo === 'entrada') {
      producto.stockActual += cantidad;
    } else if (tipo === 'salida') {
      if (producto.stockActual < cantidad) {
        return res.status(400).json({ mensaje: 'Stock insuficiente para salida' });
      }
      producto.stockActual -= cantidad;
    } else {
      return res.status(400).json({ mensaje: 'Tipo de movimiento inválido' });
    }

    producto.fechaUltimaActualizacion = new Date();
    await producto.save();

    const nuevoMovimiento = new Movimiento({
      productoId,
      tipo,
      cantidad,
      motivo,
      usuario
    });

    await nuevoMovimiento.save();

    res.status(201).json({ mensaje: 'Movimiento registrado y stock actualizado', movimiento: nuevoMovimiento });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listarMovimientos = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    const filtro = {};

    if (fechaInicio || fechaFin) {
      filtro.fecha = {};
      if (fechaInicio) filtro.fecha.$gte = new Date(fechaInicio);
      if (fechaFin) filtro.fecha.$lte = new Date(fechaFin);
    }

    const movimientos = await Movimiento.find(filtro).populate('productoId');

    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registrarMovimiento, listarMovimientos };