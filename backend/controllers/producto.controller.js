const Producto = require('../models/producto.model');

const agregarProducto = async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const consultarStock = async (req, res) => {
  try {
    const { codigo } = req.params;
    const producto = await Producto.findOne({ codigo });
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listarProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const productosStockBajo = async (req, res) => {
  try {
    const productos = await Producto.find({ $expr: { $lt: ["$stockActual", "$stockMinimo"] } });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  agregarProducto,
  consultarStock,
  productosStockBajo,
  listarProductos
};