/**
 * APP.JS - Lógica principal del sistema de pedidos GILSA
 * 
 * Separa la lógica de negocio del HTML para mejor mantenibilidad
 * Usa la clase GilsaAPI definida en api.js
 */

// ════════════════════════════════════════════════════════════════════════════
// ESTADO GLOBAL
// ════════════════════════════════════════════════════════════════════════════

let tipoPrecioCliente = 1;
let pedidoDetalle = [];

// ════════════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN
// ════════════════════════════════════════════════════════════════════════════

window.addEventListener('DOMContentLoaded', () => {
  try {
    initializeApp();
  } catch (error) {
    console.error('❌ Error durante inicialización:', error);
    showWarning('Error al inicializar la aplicación. Verifica la configuración.');
  }
});

async function initializeApp() {
  console.log('🚀 Inicializando Sistema de Pedidos GILSA...');

  // Cargar fecha actual
  cargarFechaActual();

  // Verificar conexión con API
  try {
    await verificarConexionAPI();
  } catch (e) {
    console.warn('⚠️ No hay conexión con el servidor');
  }

  // Cargar vendedores
  await cargarVendedores();

  // Cargar pedido desde memoria local (si existe)
  cargarPedidoDesdeMemoria();

  console.log('✅ Aplicación lista');
}

/**
 * Verifica que el API esté disponible
 */
async function verificarConexionAPI() {
  try {
    const stats = await api.obtenerEstadisticasControl();
    const statusEl = document.getElementById('apiStatus');
    statusEl.textContent = '✅ Conectado con servidor';
    statusEl.classList.add('connected');
    return true;
  } catch (error) {
    const statusEl = document.getElementById('apiStatus');
    statusEl.textContent = '❌ Error: No hay conexión con el servidor. Verifica la configuración de API_URL.';
    statusEl.style.color = '#F20505';
    throw error;
  }
}

// ════════════════════════════════════════════════════════════════════════════
// GESTIÓN DE MEMORIA LOCAL (localStorage)
// ════════════════════════════════════════════════════════════════════════════

/**
 * Guardar pedido en localStorage
 */
function guardarPedidoEnMemoria() {
  const pedidoData = {
    cliente: {
      id: document.getElementById('idCliente').value,
      nombre: document.getElementById('nombre').value,
      nit: document.getElementById('nit').value,
      direccion: document.getElementById('direccion').value,
      ciudad: document.getElementById('ciudad').value,
      vendedor: document.getElementById('vendedor').value,
      tipoPrecio: document.getElementById('tipoPrecio').value
    },
    tipoPrecioCliente: tipoPrecioCliente,
    detalle: pedidoDetalle
  };

  localStorage.setItem('pedidoGILSA', JSON.stringify(pedidoData));
  console.log('💾 Pedido guardado en memoria local');
}

/**
 * Cargar pedido desde localStorage
 */
function cargarPedidoDesdeMemoria() {
  const pedidoGuardado = localStorage.getItem('pedidoGILSA');

  if (!pedidoGuardado) return;

  try {
    const pedidoData = JSON.parse(pedidoGuardado);

    // Restaurar datos del cliente
    if (pedidoData.cliente && pedidoData.cliente.id) {
      document.getElementById('idCliente').value = pedidoData.cliente.id;
      document.getElementById('nombre').value = pedidoData.cliente.nombre;
      document.getElementById('nit').value = pedidoData.cliente.nit;
      document.getElementById('direccion').value = pedidoData.cliente.direccion;
      document.getElementById('ciudad').value = pedidoData.cliente.ciudad;
      document.getElementById('vendedor').value = pedidoData.cliente.vendedor;
      document.getElementById('tipoPrecio').value = pedidoData.cliente.tipoPrecio;
      tipoPrecioCliente = pedidoData.tipoPrecioCliente;
    }

    // Restaurar detalle del pedido
    if (pedidoData.detalle && pedidoData.detalle.length > 0) {
      pedidoDetalle = pedidoData.detalle;
      renderDetalle();
      recalcularTotales();
    }

    console.log('✅ Pedido restaurado desde memoria local');
  } catch (e) {
    console.error('Error al cargar pedido desde memoria:', e);
    localStorage.removeItem('pedidoGILSA');
  }
}

/**
 * Limpiar memoria del pedido actual
 */
function limpiarMemoriaPedido() {
  localStorage.removeItem('pedidoGILSA');
  console.log('🗑️ Memoria del pedido limpiada');
}

// ════════════════════════════════════════════════════════════════════════════
// MANEJO DE CLIENTE
// ════════════════════════════════════════════════════════════════════════════

/**
 * Buscar cliente por ID e llenar datos
 */
async function buscarCliente() {
  if (pedidoDetalle.length > 0) {
    alert("⚠️ No puede cambiar el cliente con productos ya agregados. Cree un nuevo pedido primero.");
    return;
  }

  const id = document.getElementById('idCliente').value.trim();
  if (!id) {
    alert("⚠️ Por favor ingrese un código de cliente");
    return;
  }

  try {
    const cliente = await api.buscarClientePorId(id);

    if (!cliente) {
      alert("❌ Cliente no encontrado. Verifica el código.");
      document.getElementById('idCliente').focus();
      return;
    }

    // Llenar datos del cliente
    document.getElementById('nombre').value = cliente.nombre;
    document.getElementById('nit').value = cliente.nit;
    document.getElementById('direccion').value = cliente.direccion;
    document.getElementById('ciudad').value = cliente.ciudad;
    tipoPrecioCliente = cliente.tipoPrecio;
    document.getElementById('tipoPrecio').value = "COP " + cliente.tipoPrecio;

    // Guardar en memoria
    guardarPedidoEnMemoria();

    // Enfocar en código de producto
    document.getElementById("prodCodigo").focus();

  } catch (error) {
    console.error('Error al buscar cliente:', error);
  }
}

function handleClienteEnter(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    buscarCliente();
  }
}

/**
 * Cargar lista de vendedores en el select
 */
async function cargarVendedores() {
  try {
    const vendedores = await api.listarVendedores();
    const select = document.getElementById("vendedor");

    vendedores.forEach(vendedor => {
      const option = document.createElement("option");
      option.text = vendedor;
      option.value = vendedor;
      select.add(option);
    });

    console.log('✅ Vendedores cargados');
  } catch (error) {
    console.error('Error al cargar vendedores:', error);
  }
}

// ════════════════════════════════════════════════════════════════════════════
// MANEJO DE PRODUCTOS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Buscar producto por código y llenar datos
 */
async function buscarProducto() {
  if (!document.getElementById('idCliente').value) {
    alert("⚠️ Primero debes seleccionar un cliente");
    return;
  }

  const codigo = document.getElementById('prodCodigo').value.trim();
  if (!codigo) {
    alert("⚠️ Por favor ingresa un código de producto");
    return;
  }

  try {
    const producto = await api.buscarProductoPorCodigo(codigo, tipoPrecioCliente);

    if (!producto) {
      alert("❌ Producto no encontrado. Verifica el código.");
      limpiarProducto();
      document.getElementById('prodCodigo').focus();
      return;
    }

    // Llenar datos del producto
    document.getElementById("prodDescripcion").value = producto.descripcion;
    document.getElementById("prodReferencia").value = producto.referencia;
    document.getElementById("prodUnd").value = producto.unidad;
    document.getElementById("prodUSD").value = "$" + Number(producto.precioUSD).toLocaleString('es-CO');
    document.getElementById("prodPrecioCOP").value = "$" + Number(producto.precioCOP).toLocaleString('es-CO');

    // Enfocar en cantidad
    document.getElementById("prodCantidad").focus();

  } catch (error) {
    console.error('Error al buscar producto:', error);
  }
}

function handleProductoEnter(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    buscarProducto();
  }
}

/**
 * Calcular total de la línea (cantidad × precio)
 */
function calcularTotalLinea() {
  const cant = Number(document.getElementById("prodCantidad").value) || 0;
  const precio = Number(
    document.getElementById("prodPrecioCOP").value
      .replace(/[\$\.,]/g, "")
  ) || 0;
  const total = cant * precio;

  document.getElementById("prodTotal").value = total > 0
    ? total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
    : "$0";
}

/**
 * Agregar producto al detalle del pedido
 */
function agregarProducto() {
  if (!document.getElementById('idCliente').value) {
    alert("⚠️ Debe seleccionar un cliente primero");
    return;
  }

  const codigo = document.getElementById('prodCodigo').value.trim();
  const cantidad = Number(document.getElementById('prodCantidad').value);
  const precio = Number(
    document.getElementById("prodPrecioCOP").value.replace(/[\$\.,]/g, "")
  );

  if (!codigo) {
    alert("⚠️ Ingrese el código del producto");
    return;
  }

  if (cantidad <= 0) {
    alert("⚠️ La cantidad debe ser mayor a 0");
    return;
  }

  if (precio <= 0) {
    alert("⚠️ El precio debe ser válido");
    return;
  }

  // Verificar si producto ya existe
  const existente = pedidoDetalle.find(p => p.codigo === codigo);

  if (existente) {
    const respuesta = confirm(
      `⚠️ Este producto ya existe en el pedido.\n\n` +
      `Producto: ${existente.descripcion}\n` +
      `Cantidad actual: ${existente.cantidad}\n\n` +
      `¿Deseas modificar la cantidad a ${cantidad}?`
    );

    if (respuesta) {
      existente.cantidad = cantidad;
      existente.total = existente.cantidad * existente.precio;
      renderDetalle();
      recalcularTotales();
    }

    limpiarProducto();
    document.getElementById("prodCodigo").focus();
    return;
  }

  // Agregar nuevo producto
  pedidoDetalle.push({
    codigo: codigo,
    descripcion: document.getElementById('prodDescripcion').value,
    referencia: document.getElementById('prodReferencia').value,
    und: document.getElementById('prodUnd').value,
    cantidad: cantidad,
    precio: precio,
    total: cantidad * precio
  });

  renderDetalle();
  limpiarProducto();
  recalcularTotales();

  // Volver al código de producto
  document.getElementById("prodCodigo").focus();
}

/**
 * Limpiar campos de producto
 */
function limpiarProducto() {
  [
    "prodCodigo",
    "prodDescripcion",
    "prodReferencia",
    "prodUnd",
    "prodUSD",
    "prodPrecioCOP",
    "prodCantidad",
    "prodTotal"
  ].forEach(id => document.getElementById(id).value = "");
}

// ════════════════════════════════════════════════════════════════════════════
// GESTIÓN DEL DETALLE Y TOTALES
// ════════════════════════════════════════════════════════════════════════════

/**
 * Recalcular totales del pedido
 */
function recalcularTotales() {
  let items = pedidoDetalle.length;
  let cantidad = 0;
  let total = 0;

  pedidoDetalle.forEach(p => {
    cantidad += p.cantidad;
    total += p.total;
  });

  document.getElementById("totalItems").textContent = items;
  document.getElementById("totalCantidad").textContent = cantidad;
  document.getElementById("totalPedido").textContent = total.toLocaleString(
    "es-CO",
    { style: 'currency', currency: 'COP' }
  );

  // Guardar en memoria cada vez que cambian los totales
  guardarPedidoEnMemoria();
}

/**
 * Renderizar tabla de detalle del pedido
 */
function renderDetalle() {
  const tbody = document.getElementById("detalle");
  tbody.innerHTML = "";

  if (pedidoDetalle.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; color: #999; padding: 20px;">
          No hay productos agregados. Ingresa un código de producto y presiona Enter.
        </td>
      </tr>
    `;
    return;
  }

  pedidoDetalle.forEach((p, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${p.codigo}</strong></td>
      <td>${p.descripcion}</td>
      <td style="text-align: center;">${p.cantidad}</td>
      <td>${p.und}</td>
      <td>${p.referencia}</td>
      <td style="text-align: right;">$${Number(p.precio).toLocaleString('es-CO')}</td>
      <td style="text-align: right;"><strong>$${Number(p.total).toLocaleString('es-CO')}</strong></td>
      <td style="text-align: center;">
        <button class="btn-primary" onclick="modificarProducto(${i})" style="padding: 6px 10px; font-size: 12px; margin-right: 5px;">✏️</button>
        <button class="btn-danger" onclick="eliminarProducto(${i})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Eliminar producto del detalle
 */
function eliminarProducto(index) {
  pedidoDetalle.splice(index, 1);
  renderDetalle();
  recalcularTotales();
}

/**
 * Modificar cantidad de un producto
 */
function modificarProducto(index) {
  const producto = pedidoDetalle[index];
  const nuevaCantidad = prompt(
    `Modificar cantidad de "${producto.descripcion}":\n\nCantidad actual: ${producto.cantidad}`,
    producto.cantidad
  );

  if (nuevaCantidad === null) return; // Cancelado

  const cantidad = Number(nuevaCantidad);

  if (isNaN(cantidad) || cantidad <= 0) {
    alert("⚠️ La cantidad debe ser un número mayor a 0");
    return;
  }

  producto.cantidad = cantidad;
  producto.total = cantidad * producto.precio;

  renderDetalle();
  recalcularTotales();
}

// ════════════════════════════════════════════════════════════════════════════
// GUARDAR Y GENERAR PDF
// ════════════════════════════════════════════════════════════════════════════

/**
 * Guardar pedido en la base de datos y generar PDF
 */
async function guardarPedido() {
  if (pedidoDetalle.length === 0) {
    alert("❌ El pedido no tiene productos. Agrega al menos uno.");
    return;
  }

  try {
    // Preparar datos
    const data = {
      fecha: document.getElementById("fechaPedido").value,
      cliente: document.getElementById("idCliente").value,
      clienteNombre: document.getElementById("nombre").value,
      vendedor: document.getElementById("vendedor").value,
      tipoPrecio: document.getElementById("tipoPrecio").value,
      items: document.getElementById("totalItems").textContent,
      cantidad: document.getElementById("totalCantidad").textContent,
      total: document.getElementById("totalPedido").textContent.replace(/[\$\.,]/g, ""),
      observaciones: document.getElementById("detalleAdicional").value || "",
      detalle: pedidoDetalle
    };

    // Guardar en base de datos
    const idPedido = await api.guardarPedido(data);

    // Mostrar confirmación
    alert("✅ Pedido guardado exitosamente con ID: " + idPedido);

    // Generar y abrir PDF
    try {
      const pdfUrl = await api.generarPDFPedido(idPedido);
      window.open(pdfUrl, "_blank");
    } catch (pdfError) {
      console.warn('⚠️ No se pudo generar el PDF:', pdfError);
      alert('⚠️ Pedido guardado, pero no se pudo generar el PDF');
    }

    // Limpiar
    limpiarMemoriaPedido();
    resetPedido();

  } catch (error) {
    console.error('Error al guardar pedido:', error);
    alert('❌ Error al guardar el pedido. Intenta nuevamente.');
  }
}

// ════════════════════════════════════════════════════════════════════════════
// RESETEAR PEDIDO
// ════════════════════════════════════════════════════════════════════════════

/**
 * Resetear todo el formulario para un nuevo pedido
 */
function resetPedido() {
  // Verificar si hay productos
  if (pedidoDetalle.length > 0) {
    const confirmar = confirm(
      "⚠️ ATENCIÓN: Tienes productos en el pedido actual.\n\n" +
      `Productos: ${pedidoDetalle.length} ítems\n` +
      `Total: ${document.getElementById("totalPedido").textContent}\n\n` +
      "Si creas un nuevo pedido, se descartarán estos productos.\n\n" +
      "¿Estás seguro de continuar?"
    );

    if (!confirmar) {
      return;
    }
  }

  // Limpiar estado
  pedidoDetalle = [];
  tipoPrecioCliente = 1;

  // Limpiar cliente
  ["idCliente", "nombre", "nit", "direccion", "ciudad"].forEach(id => {
    document.getElementById(id).value = "";
  });

  // Limpiar producto
  limpiarProducto();

  // Limpiar totales
  document.getElementById("totalItems").textContent = "0";
  document.getElementById("totalCantidad").textContent = "0";
  document.getElementById("totalPedido").textContent = "$0";

  // Limpiar observaciones
  document.getElementById("detalleAdicional").value = "";

  // Limpiar tabla
  renderDetalle();

  // Reset campos adicionales
  document.getElementById("tipoPrecio").value = "";
  document.getElementById("vendedor").selectedIndex = 0;

  // Fecha nueva
  cargarFechaActual();

  // Limpiar memoria
  limpiarMemoriaPedido();

  // Enfocar en cliente
  document.getElementById("idCliente").focus();
}

// ════════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ════════════════════════════════════════════════════════════════════════════

/**
 * Cargar fecha actual en el campo de fecha
 */
function cargarFechaActual() {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  document.getElementById("fechaPedido").value = `${yyyy}-${mm}-${dd}`;
}

/**
 * Mostrar mensaje de aviso
 */
function showWarning(message) {
  const warning = document.createElement('div');
  warning.className = 'warning-message';
  warning.textContent = message;
  document.querySelector('.contenedor').insertBefore(warning, document.querySelector('.header').nextElementSibling);
}

console.log('✅ app.js cargado correctamente');
