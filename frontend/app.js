const API_URL = 'http://localhost:3000/api';

document.getElementById('btn-cargar-productos').addEventListener('click', cargarProductos);
document.getElementById('form-agregar-producto').addEventListener('submit', agregarProducto);
document.getElementById('btn-cargar-proveedores').addEventListener('click', cargarProveedores);
document.getElementById('form-agregar-proveedor').addEventListener('submit', agregarProveedor);
document.getElementById('form-registrar-movimiento').addEventListener('submit', registrarMovimiento);
document.getElementById('btn-cargar-movimientos').addEventListener('click', cargarMovimientos);

async function cargarProductos() {
  try {
    const res = await fetch(`${API_URL}/productos`);
    if (!res.ok) throw new Error('Error al cargar productos');
    const productos = await res.json();

    const tbody = document.querySelector('#tabla-productos tbody');
    tbody.innerHTML = '';

    productos.forEach(p => {
      const tr = document.createElement('tr');
      if (p.stockActual < p.stockMinimo) {
        tr.classList.add('stock-bajo');
      }
      tr.innerHTML = `
        <td>${p.codigo}</td>
        <td>${p.nombre}</td>
        <td>${p.categoria}</td>
        <td>${p.precio.toFixed(2)}</td>
        <td>${p.stockActual}</td>
        <td>${p.stockMinimo}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    alert(error.message);
  }
}

async function agregarProducto(e) {
  e.preventDefault();

  const producto = {
    codigo: document.getElementById('codigo').value.trim(),
    nombre: document.getElementById('nombre').value.trim(),
    categoria: document.getElementById('categoria').value.trim(),
    precio: parseFloat(document.getElementById('precio').value),
    stockActual: parseInt(document.getElementById('stockActual').value),
    stockMinimo: parseInt(document.getElementById('stockMinimo').value),
  };

  try {
    const res = await fetch(`${API_URL}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al agregar producto');
    }
    alert('Producto agregado correctamente');
    e.target.reset();
    cargarProductos();
  } catch (error) {
    alert(error.message);
  }
}

async function cargarProveedores() {
  try {
    const res = await fetch(`${API_URL}/proveedores`);
    if (!res.ok) throw new Error('Error al cargar proveedores');
    const proveedores = await res.json();

    const tbody = document.querySelector('#tabla-proveedores tbody');
    tbody.innerHTML = '';

    proveedores.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.nombre}</td>
        <td>${p.contacto}</td>
        <td>${p.telefono}</td>
        <td>${p.email}</td>
        <td>${p.productosOfrecidos.join(', ')}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    alert(error.message);
  }
}

async function agregarProveedor(e) {
  e.preventDefault();

  const proveedor = {
    nombre: document.getElementById('nombreProveedor').value.trim(),
    contacto: document.getElementById('contactoProveedor').value.trim(),
    telefono: document.getElementById('telefonoProveedor').value.trim(),
    email: document.getElementById('emailProveedor').value.trim(),
    productosOfrecidos: document.getElementById('productosOfrecidos').value.split(',').map(c => c.trim())
  };

  try {
    const res = await fetch(`${API_URL}/proveedores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proveedor),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al agregar proveedor');
    }
    alert('Proveedor agregado correctamente');
    e.target.reset();
    cargarProveedores();
  } catch (error) {
    alert(error.message);
  }
}

async function registrarMovimiento(e) {
  e.preventDefault();

  const codigo = document.getElementById('codigoMovimiento').value.trim();
  const tipo = document.getElementById('tipoMovimiento').value;
  const cantidad = parseInt(document.getElementById('cantidadMovimiento').value);
  const motivo = document.getElementById('motivoMovimiento').value.trim();
  const usuario = document.getElementById('usuarioMovimiento').value.trim();

  if (cantidad <= 0) {
    alert('La cantidad debe ser mayor que cero.');
    return;
  }

  try {
    // Buscar producto por código para obtener _id
    const resProd = await fetch(`${API_URL}/productos/${codigo}`);
    if (!resProd.ok) throw new Error('Producto no encontrado');
    const producto = await resProd.json();

    // Validación stock para salida
    if (tipo === 'salida' && producto.stockActual < cantidad) {
      alert(`Stock insuficiente. Stock actual: ${producto.stockActual}`);
      return;
    }

    const movimiento = {
      productoId: producto._id,
      tipo,
      cantidad,
      motivo,
      fecha: new Date().toISOString(),
      usuario,
    };

    // Registrar movimiento
    const resMov = await fetch(`${API_URL}/movimientos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movimiento),
    });

    if (!resMov.ok) {
      const errorData = await resMov.json();
      throw new Error(errorData.error || 'Error al registrar movimiento');
    }

    alert('Movimiento registrado correctamente');
    e.target.reset();
    cargarMovimientos();

  } catch (error) {
    alert(error.message);
  }
}

async function cargarMovimientos() {
  const fechaInicio = document.getElementById('fechaInicioReporte').value;
  const fechaFin = document.getElementById('fechaFinReporte').value;

  let url = `${API_URL}/movimientos`;
  const params = [];

  if (fechaInicio) params.push(`fechaInicio=${fechaInicio}`);
  if (fechaFin) params.push(`fechaFin=${fechaFin}`);

  if (params.length > 0) url += '?' + params.join('&');

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al cargar movimientos');
    const movimientos = await res.json();

    const tbody = document.querySelector('#tabla-movimientos tbody');
    tbody.innerHTML = '';

    movimientos.forEach(m => {
      // m.productoId es el objeto producto completo (ver backend)
      const productoStr = m.productoId ? `${m.productoId.codigo} - ${m.productoId.nombre}` : 'N/D';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${productoStr}</td>
        <td>${m.tipo}</td>
        <td>${m.cantidad}</td>
        <td>${m.motivo}</td>
        <td>${new Date(m.fecha).toLocaleString()}</td>
        <td>${m.usuario}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (error) {
    alert(error.message);
  }
}
