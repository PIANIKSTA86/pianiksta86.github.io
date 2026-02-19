/*
 * ========================================
 * CRM v2.0 - Sistema de Gestión Empresarial
 * ========================================
 * 
 * CONFIGURACIÓN DEL BACKEND:
 * --------------------------
 * Para conectar este CRM con tu backend de Google Apps Script:
 * 
 * 1. Ve a la línea 256 de este archivo
 * 2. Busca la constante BACKEND_URL
 * 3. Reemplaza 'TU_DEPLOYMENT_ID' con el ID de tu despliegue de Google Apps Script
 * 
 * Ejemplo:
 * const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbx1234567890abcdef/exec';
 * 
 * También puedes cambiar la URL desde el frontend usando el modal de configuración (⚙️).
 * 
 * ========================================
 */

// ========================================
// AUTENTICACIÓN Y LOGIN - UX/UI
// ========================================

// Usuario simulado (en producción conectar con backend)
const USUARIOS = [
  { usuario: 'admin', password: 'admin', nombre: 'Administrador', rol: 'Administrador' },
  { usuario: 'ventas', password: 'ventas123', nombre: 'Gerente de Ventas', rol: 'Ventas' },
  { usuario: 'demo', password: 'demo', nombre: 'Usuario Demo', rol: 'Consultor' }
];

// Verificar sesión al cargar
document.addEventListener('DOMContentLoaded', () => {
  verificarSesion();
});

function verificarSesion() {
  const sesion = JSON.parse(localStorage.getItem('crmSesion'));
  
  if (sesion && sesion.usuario) {
    // Usuario logueado
    mostrarAplicacion(sesion);
  } else {
    // Mostrar login
    mostrarLogin();
  }
}

function mostrarLogin() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('appContainer').style.display = 'none';
}

function mostrarAplicacion(sesion) {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appContainer').style.display = 'flex';
  
  // Actualizar nombre de usuario en sidebar
  const userNameElement = document.getElementById('userName');
  if (userNameElement) {
    userNameElement.textContent = sesion.nombre;
  }
  
  // Inicializar aplicación
  inicializarApp();
}

function handleLogin(event) {
  event.preventDefault();
  
  const usuario = document.getElementById('loginUsuario').value.trim();
  const password = document.getElementById('loginPassword').value;
  const recordar = document.getElementById('rememberMe').checked;
  
  // Validar credenciales
  const usuarioValido = USUARIOS.find(u => u.usuario === usuario && u.password === password);
  
  if (usuarioValido) {
    // Crear sesión
    const sesion = {
      usuario: usuarioValido.usuario,
      nombre: usuarioValido.nombre,
      rol: usuarioValido.rol,
      timestamp: new Date().getTime()
    };
    
    // Guardar sesión
    if (recordar) {
      localStorage.setItem('crmSesion', JSON.stringify(sesion));
    } else {
      sessionStorage.setItem('crmSesion', JSON.stringify(sesion));
    }
    
    // Animación de éxito
    const btnLogin = event.target.querySelector('.btn-login');
    btnLogin.textContent = '✓ Ingresando...';
    btnLogin.style.background = 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)';
    
    setTimeout(() => {
      mostrarAplicacion(sesion);
      mostrarToast(`¡Bienvenido ${usuarioValido.nombre}!`, 'success');
    }, 800);
    
  } else {
    // Error de credenciales
    mostrarToast('Usuario o contraseña incorrectos', 'error');
    
    // Animación de error en inputs
    const inputs = [document.getElementById('loginUsuario'), document.getElementById('loginPassword')];
    inputs.forEach(input => {
      input.style.borderColor = '#ef4444';
      input.style.animation = 'shake 0.5s';
      setTimeout(() => {
        input.style.borderColor = '#e2e8f0';
        input.style.animation = '';
      }, 500);
    });
  }
}

function handleLogout() {
  const confirmar = confirm('¿Deseas cerrar sesión?');
  
  if (confirmar) {
    // Limpiar sesiones
    localStorage.removeItem('crmSesion');
    sessionStorage.removeItem('crmSesion');
    
    // Animación de salida
    const appContainer = document.getElementById('appContainer');
    appContainer.style.opacity = '0';
    appContainer.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      mostrarLogin();
      mostrarToast('Sesión cerrada correctamente', 'info');
      
      // Limpiar formulario
      document.getElementById('loginForm').reset();
      
      // Restaurar estilos
      appContainer.style.opacity = '1';
      appContainer.style.transform = 'scale(1)';
    }, 300);
  }
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById('loginPassword');
  const toggleBtn = event.target;
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleBtn.textContent = '🙈';
  } else {
    passwordInput.type = 'password';
    toggleBtn.textContent = '👁️';
  }
}

function mostrarRecuperarPassword(event) {
  event.preventDefault();
  mostrarToast('Función de recuperación de contraseña en desarrollo. Contacta al administrador.', 'info');
}

// Animación de shake para errores
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
`;
document.head.appendChild(style);

// ========================================
// FUNCIONALIDAD MÓVIL MEJORADA
// ========================================

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobileOverlay');
  
  if (window.innerWidth <= 768) {
    // Modo móvil
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Prevenir scroll del body cuando sidebar está abierto
    if (sidebar.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  } else {
    // Modo desktop
    sidebar.classList.toggle('collapsed');
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobileOverlay');
  
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Cerrar sidebar al hacer clic en un nav-item en móvil
document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item, .nav-subitem');
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMobileSidebar();
      }
    });
  });
});

// Ajustar al cambiar tamaño de ventana
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth > 768) {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('mobileOverlay');
      
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }, 250);
});

// Touch gestures para cerrar sidebar
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const sidebar = document.getElementById('sidebar');
  
  if (sidebar.classList.contains('active')) {
    // Swipe left to close
    if (touchStartX - touchEndX > 50) {
      closeMobileSidebar();
    }
  }
}

// ========================================
// CONFIGURACIÓN GLOBAL - CRM v2.0
// ========================================

// URL del Backend de Google Apps Script
// Reemplaza esta URL con la URL de tu despliegue de Google Apps Script
const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbwxl71I6GbDmrLn1H6q5F97JDZ2Ka2WSbUFyDHpRhXd25lIehVw_VMSt9zmLfaU3eSp/exec';

// La URL puede ser sobrescrita desde el frontend si es necesario
let API_URL = localStorage.getItem('crmApiUrl') || BACKEND_URL;
let pipelineData = null;

// Configuración general
const CONFIG_DEFAULT = {
  empresa: 'MI EMPRESA SAS',
  moneda: 'COP',
  iva: 19,
  zonaHoraria: 'America/Bogota',
  email: '',
  prefijoCliente: 'CLI',
  prefijoPedido: 'PED',
  prefijoFactura: 'FAC'
};

// Módulos disponibles
const MODULOS_DEFAULT = {
  dashboard: true,
  pipeline: true,
  clientes: true,
  productos: true,
  pedidos: true,
  facturas: true,
  recaudos: true,
  inventario: true
};

let configGeneral = JSON.parse(localStorage.getItem('crmConfigGeneral')) || CONFIG_DEFAULT;
let modulosActivos = {
  ...MODULOS_DEFAULT,
  ...(JSON.parse(localStorage.getItem('crmModulos')) || {})
};

// ========================================
// INICIALIZACIÓN
// ========================================
function inicializarApp() {
  document.body.classList.add('dashboard-view');
  
  // Siempre hay una URL configurada (BACKEND_URL por defecto)
  const urlInput = document.getElementById('apiUrl');
  if (urlInput) {
    urlInput.value = API_URL;
  }
  
  // Verificar conexión con el backend
  verificarConexion();
  
  // Solo mostrar banner de configuración si la URL es la por defecto y no funciona
  if (API_URL === BACKEND_URL && BACKEND_URL.includes('TU_DEPLOYMENT_ID')) {
    const configBanner = document.getElementById('configBanner');
    if (configBanner) {
      configBanner.classList.remove('hidden');
    }
    actualizarEstado('Configuración requerida', 'warning');
  }
  
  // Cargar vista inicial
  cambiarVista('dashboard');
}


// ========================================
// SIDEBAR & NAVEGACIÓN
// ========================================
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const isMobile = window.innerWidth <= 1024;
  if (isMobile) {
    sidebar.classList.toggle('active');
    return;
  }
  sidebar.classList.toggle('collapsed');
  document.body.classList.toggle('sidebar-collapsed', sidebar.classList.contains('collapsed'));
}

function toggleNavGroup(button) {
  const navGroup = button.parentElement;
  const isExpanded = navGroup.classList.contains('expanded');
  
  // Cerrar otros grupos abiertos (opcional)
  document.querySelectorAll('.nav-group.expanded').forEach(group => {
    if (group !== navGroup) {
      group.classList.remove('expanded');
    }
  });
  
  // Toggle del grupo actual
  navGroup.classList.toggle('expanded');
}

function cambiarVista(vistaName) {
  // Actualizar título
  const titles = {
    'dashboard': 'Dashboard',
    'pipeline': 'Pipeline de Ventas',
    'clientes': 'Gestión de Clientes',
    'productos': 'Catálogo de Productos',
    'bodegas': 'Gestión de Bodegas',
    'pedidos': 'Gestión de Pedidos',
    'facturas': 'Facturas',
    'recaudos': 'Recaudos',
    'inventario': 'Control de Inventario',
    'despachos': 'Gestión de Despachos'
  };
  
  document.getElementById('pageTitle').textContent = titles[vistaName] || 'CRM';
  
  // Ocultar todas las vistas
  document.querySelectorAll('.view-container').forEach(view => {
    view.classList.remove('active');
  });
  
  // Mostrar vista seleccionada
  const vistaActual = document.getElementById(`view-${vistaName}`);
  if (vistaActual) {
    vistaActual.classList.add('active');
  }
  
  // Actualizar navegación
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  const navItem = document.querySelector(`.nav-item[data-view="${vistaName}"]`);
  if (navItem) {
    navItem.classList.add('active');
  }

  document.body.classList.toggle('dashboard-view', vistaName === 'dashboard');
  
  // Cargar datos según la vista
  switch(vistaName) {
    case 'dashboard':
      cargarDashboard();
      break;
    case 'pipeline':
      cargarPipeline();
      break;
    case 'clientes':
      listarClientes();
      break;
    case 'productos':
      listarProductos();
      break;
    case 'bodegas':
      listarBodegas();
      break;
    case 'pedidos':
      listarPedidos();
      break;
    case 'facturas':
      listarFacturas();
      break;
    case 'recaudos':
      listarRecaudos();
      listarFormasPago();
      break;
    case 'inventario':
      listarInventario();
      break;
    case 'despachos':
      listarDespachos();
      break;
  }
  
  // Cerrar sidebar en móvil
  if (window.innerWidth <= 768) {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('active');
  }
}

// ========================================
// CONFIGURACIÓN
// ========================================
function guardarConfiguracion() {
  const url = document.getElementById('apiUrl').value.trim();
  
  if (!url) {
    mostrarToast('Por favor ingresa una URL válida', 'error');
    return;
  }
  
  if (!url.startsWith('http')) {
    mostrarToast('La URL debe comenzar con http:// o https://', 'error');
    return;
  }
  
  API_URL = url;
  localStorage.setItem('crmApiUrl', url);
  mostrarToast('Configuración guardada correctamente', 'success');
  
  verificarConexion();
}

async function verificarConexion() {
  actualizarEstado('Conectando...', 'connecting');
  mostrarLoading(true);
  
  try {
    const data = await llamarAPI('getDashboard');
    
    if (data) {
      actualizarEstado('Conectado', 'connected');
      mostrarToast('Conexión establecida correctamente', 'success');
      
      // Ocultar banner de configuración
      const configBanner = document.getElementById('configBanner');
      if (configBanner) {
        configBanner.classList.add('hidden');
      }
      
      // Cargar dashboard
      cargarDashboard(data);
    }
  } catch (error) {
    actualizarEstado('Error de conexión', 'error');
    mostrarToast('No se pudo conectar con el servidor: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

function actualizarEstado(texto, estado) {
  const statusText = document.getElementById('statusText');
  const statusDots = document.querySelectorAll('.status-dot');
  
  if (statusText) {
    statusText.textContent = texto;
  }
  
  statusDots.forEach(dot => {
    dot.className = 'status-dot ' + estado;
  });
  
  const statusTexts = document.querySelectorAll('.status-text');
  statusTexts.forEach(st => {
    st.textContent = texto;
  });
}

// =================================
// LLAMADAS A LA API
// ========================================
async function llamarAPI(action, data = {}) {
  if (!API_URL) {
    throw new Error('URL de API no configurada');
  }
  
  const url = `${API_URL}?action=${action}&data=${encodeURIComponent(JSON.stringify(data))}`;
  
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    redirect: 'follow'
  });
  
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Error desconocido');
  }
  
  return result.data;
}

// ========================================
// DASHBOARD
// ========================================
async function cargarDashboard(data) {
  mostrarLoading(true);
  
  try {
    if (!data) {
      data = await llamarAPI('getDashboard');
    }
    
    // Métricas principales
    const currency = configGeneral?.moneda || 'COP';
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0
      }).format(value || 0);
    };
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    
    setText('metricVentasMes', formatCurrency(data.ventasMes));
    setText('metricTotalVentas', formatCurrency(data.totalVentas));
    setText('metricPedidosPendientes', data.pedidosPendientes || 0);
    setText('metricEntregados', data.entregados || 0);
    
    // Stats adicionales
    setText('totalClientes', data.totalClientes || 0);
    setText('totalProductos', data.totalProductos || 0);
    setText('facturasPendientes', data.facturasPendientes || 0);

    // Graficos
    const updateBarChart = (containerId, items) => {
      const container = document.getElementById(containerId);
      if (!container) return;

      const bars = Array.from(container.querySelectorAll('.bar'));
      if (!bars.length) return;

      const totals = items.map(item => Number(item.total) || 0);
      const max = Math.max(...totals, 1);

      bars.forEach((bar, index) => {
        const item = items[index] || { label: '-', total: 0 };
        const value = Math.round((Number(item.total) || 0) / max * 100);
        bar.style.setProperty('--value', value);
        const label = bar.querySelector('span');
        if (label) label.textContent = item.label || '-';
        bar.title = `${item.label || '-'}: ${formatCurrency(item.total || 0)}`;
      });
    };

    const updateDonut = (donutId, items) => {
      const donut = document.getElementById(donutId);
      if (!donut) return;

      const values = items.map(item => Number(item.value) || 0);
      const total = values.reduce((sum, val) => sum + val, 0) || 1;
      const p1 = Math.round((values[0] || 0) / total * 100);
      const p2 = Math.round((values[1] || 0) / total * 100);
      const p3 = Math.max(0, 100 - p1 - p2);

      donut.style.setProperty('--p1', p1);
      donut.style.setProperty('--p2', p2);
      donut.style.setProperty('--p3', p3);
    };

    updateBarChart('forecastOwnersChart', data.asesoresForecast || []);
    updateBarChart('forecastQuarterChart', data.quarterForecast || []);

    const gauge = document.getElementById('gaugeVentas');
    const gaugeValue = document.getElementById('gaugeValue');
    if (gauge && gaugeValue) {
      const percent = Math.max(0, Math.min(100, Number(data.gaugePercent) || 0));
      gauge.style.setProperty('--value', percent);
      gaugeValue.textContent = `${percent}%`;
    }

    updateDonut('donutReason', data.donutReason || []);
    updateDonut('donutSource', data.donutSource || []);
    
  } catch (error) {
    mostrarToast('Error al cargar dashboard: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

// ========================================
// PIPELINE DE VENTAS
// ========================================
// Variable global para almacenar clientes en el pipeline
let clientesPipeline = [];

async function cargarPipeline() {
  mostrarLoading(true);
  
  try {
    pipelineData = await llamarAPI('getPipeline');
    clientesPipeline = await llamarAPI('listarClientes');
    renderizarKanban(pipelineData);
  } catch (error) {
    mostrarToast('Error al cargar pipeline: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

function renderizarKanban(pipeline) {
  const estados = ['PEDIDO', 'ALISTAMIENTO', 'FACTURADO', 'ENTREGADO', 'SEGUIMIENTO', 'RECAUDADO'];
  
  estados.forEach(estado => {
    const container = document.getElementById(`kanban${estado.charAt(0) + estado.slice(1).toLowerCase()}`);
    const count = document.getElementById(`count${estado.charAt(0) + estado.slice(1).toLowerCase()}`);
    
    if (!container) return;
    
    const pedidos = pipeline[estado] || [];
    container.innerHTML = '';
    
    if (count) {
      count.textContent = pedidos.length;
    }
    
    pedidos.forEach(pedido => {
      const card = crearKanbanCard(pedido, estado);
      container.appendChild(card);
    });
  });
}

function crearKanbanCard(pedido, estadoActual) {
  const card = document.createElement('div');
  card.className = 'kanban-card';
  card.dataset.pedidoid = pedido.ID;
  
  const formatCurrency = (value) => {
    const currency = configGeneral?.moneda || 'COP';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(value || 0);
  };
  
  // Buscar nombre del cliente
  const cliente = clientesPipeline.find(c => c.ID == pedido.ClienteID || c.ID === pedido.ClienteID);
  const nombreCliente = cliente 
    ? (cliente.RazonSocial || ((cliente.Nombres || '') + ' ' + (cliente.Apellidos || '')).trim() || 'Cliente sin nombre')
    : `Cliente #${pedido.ClienteID}`;
  
  const prioridad = (pedido.Prioridad || 'MEDIA').toLowerCase();
  
  let btnAvanzar = '';
  const siguienteEstado = obtenerSiguienteEstado(estadoActual);
  if (siguienteEstado) {
    btnAvanzar = `<button class="btn-advance" onclick="avanzarEstado('${pedido.ID}', '${siguienteEstado}')">
      Mover a ${getNombreEstado(siguienteEstado)} →
    </button>`;
  }
  
  card.innerHTML = `
    <div class="kanban-card-header">
      <span class="kanban-card-id">${pedido.ID}</span>
      <span class="kanban-card-priority ${prioridad}">${pedido.Prioridad || 'MEDIA'}</span>
    </div>
    <div class="kanban-card-cliente">${nombreCliente}</div>
    <div class="kanban-card-info">
      <div>👤 ${pedido.Asesor || 'Sin asignar'}</div>
      <div>📅 ${pedido.Fecha ? new Date(pedido.Fecha).toLocaleDateString() : 'Sin fecha'}</div>
    </div>
    <div class="kanban-card-total">${formatCurrency(pedido.Total)}</div>
    <div class="kanban-card-actions">
      ${btnAvanzar}
    </div>
  `;
  
  card.onclick = (e) => {
    if (!e.target.classList.contains('btn-advance')) {
      mostrarDetallePedido(pedido.ID);
    }
  };
  
  return card;
}

function obtenerSiguienteEstado(estadoActual) {
  const flujo = {
    'PEDIDO': 'ALISTAMIENTO',
    'ALISTAMIENTO': 'FACTURADO',
    'FACTURADO': 'ENTREGADO',
    'ENTREGADO': 'SEGUIMIENTO',
    'SEGUIMIENTO': 'RECAUDADO',
    'RECAUDADO': null
  };
  
  return flujo[estadoActual];
}

function getNombreEstado(estado) {
  const nombres = {
    'PEDIDO': 'Pedido',
    'ALISTAMIENTO': 'Alistamiento',
    'FACTURADO': 'Facturado',
    'ENTREGADO': 'Entregado',
    'SEGUIMIENTO': 'Seguimiento',
    'RECAUDADO': 'Recaudado'
  };
  
  return nombres[estado] || estado;
}

async function avanzarEstado(pedidoID, nuevoEstado) {
  mostrarLoading(true);
  
  try {
    let datos = {};
    
    // Solicitar información adicional según el estado
    if (nuevoEstado === 'ALISTAMIENTO') {
      const responsable = prompt('Responsable del alistamiento:');
      if (responsable) {
        datos.Responsable = responsable;
      }
    }
    
    if (nuevoEstado === 'SEGUIMIENTO') {
      const notas = prompt('Notas de seguimiento:');
      if (notas) {
        datos.Notas = notas;
      }
    }
    
    const result = await llamarAPI('cambiarEstadoPedido', {
      pedidoID: pedidoID,
      nuevoEstado: nuevoEstado,
      datos: datos
    });
    
    mostrarToast(result.mensaje || 'Estado actualizado correctamente', 'success');
    
    // Recargar pipeline
    await cargarPipeline();
    await cargarDashboard();
    
  } catch (error) {
    mostrarToast('Error al cambiar estado: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function crearPedidoPipeline(event) {
  event.preventDefault();
  mostrarLoading(true);
  
  const data = {
    ClienteID: document.getElementById('pedidoPipelineClienteID').value,
    Asesor: document.getElementById('pedidoPipelineAsesor').value,
    Prioridad: document.getElementById('pedidoPipelinePrioridad').value,
    Subtotal: parseFloat(document.getElementById('pedidoPipelineSubtotal').value) || 0,
    Estado: 'PEDIDO',
    Notas: document.getElementById('pedidoPipelineNotas').value
  };
  
  // Calcular IVA y Total
  const IVA = data.Subtotal * 0.19;
  data.IVA = IVA;
  data.Total = data.Subtotal + IVA;
  
  try {
    const resultado = await llamarAPI('crearPedido', data);
    mostrarToast(`Pedido creado: ${resultado.ID}`, 'success');
    ocultarFormulario('formNuevoPedidoPipeline');
    event.target.reset();
    
    // Recargar pipeline y dashboard
    await cargarPipeline();
    await cargarDashboard();
  } catch (error) {
    mostrarToast('Error al crear pedido: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function mostrarDetallePedido(pedidoID) {
  mostrarLoading(true);
  
  try {
    const pedido = await llamarAPI('obtenerPedido', {pedidoID: pedidoID});
    
    const modal = document.getElementById('modalDetallePedido');
    const content = document.getElementById('modalDetallePedidoContent');
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(value || 0);
    };
    
    content.innerHTML = `
      <div style="padding: 25px;">
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
          <div>
            <strong>ID:</strong> ${pedido.ID}<br>
            <strong>Cliente:</strong> ${pedido.ClienteID}<br>
            <strong>Asesor:</strong> ${pedido.Asesor}
          </div>
          <div>
            <strong>Estado:</strong> <span class="badge badge-info">${pedido.Estado}</span><br>
            <strong>Prioridad:</strong> ${pedido.Prioridad || 'MEDIA'}<br>
            <strong>Fecha:</strong> ${pedido.Fecha ? new Date(pedido.Fecha).toLocaleString() : 'N/A'}
          </div>
        </div>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 15px;">
          <h4>Información Financiera</h4>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 10px;">
            <div>
              <strong>Subtotal:</strong><br>
              <span style="font-size: 18px;">${formatCurrency(pedido.Subtotal)}</span>
            </div>
            <div>
              <strong>IVA:</strong><br>
              <span style="font-size: 18px;">${formatCurrency(pedido.IVA)}</span>
            </div>
            <div>
              <strong>Total:</strong><br>
              <span style="font-size: 20px; font-weight: 700; color: #10b981;">${formatCurrency(pedido.Total)}</span>
            </div>
          </div>
        </div>
        
        ${pedido.Notas ? `
          <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 15px;">
            <h4>Notas</h4>
            <p style="white-space: pre-wrap;">${pedido.Notas}</p>
          </div>
        ` : ''}
      </div>
    `;
    
    modal.style.display = 'flex';
    
  } catch (error) {
    mostrarToast('Error al cargar detalle: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

function cerrarModalDetalle() {
  const modal = document.getElementById('modalDetallePedido');
  modal.style.display = 'none';
}

// ========================================
// CLIENTES
// ========================================
async function listarClientes() {
  mostrarLoading(true);
  
  try {
    const clientes = await llamarAPI('listarClientes');
    const tbody = document.querySelector('#tablaClientes tbody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    clientes.forEach(cliente => {
      const tr = document.createElement('tr');
      const nombre = cliente.RazonSocial || `${cliente.Nombres} ${cliente.Apellidos}`;
      
      tr.innerHTML = `
        <td>${cliente.ID}</td>
        <td>${cliente.Identificacion}</td>
        <td>${nombre}</td>
        <td>${cliente.Telefono1 || '-'}</td>
        <td>${cliente.CorreoElectronico || '-'}</td>
        <td>${cliente.Ciudad || '-'}</td>
        <td><span class="badge badge-success">${cliente.Estado}</span></td>
      `;
      
      tbody.appendChild(tr);
    });
  } catch (error) {
    mostrarToast('Error al cargar clientes: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

function togglePersonaFields() {
  const tipoPersona = document.getElementById('tipoPersona').value;
  const camposJuridica = document.getElementById('camposJuridica');
  const camposNatural = document.getElementById('camposNatural');
  const razonSocial = document.getElementById('razonSocial');
  
  if (tipoPersona === 'JURIDICA') {
    camposJuridica.style.display = 'block';
    camposNatural.style.display = 'none';
    razonSocial.required = true;
  } else {
    camposJuridica.style.display = 'none';
    camposNatural.style.display = 'block';
    razonSocial.required = false;
  }
}

async function crearCliente(event) {
  event.preventDefault();
  mostrarLoading(true);
  
  const data = {
    TipoPersona: document.getElementById('tipoPersona').value,
    Identificacion: document.getElementById('identificacion').value,
    Telefono1: document.getElementById('telefono1').value,
    CorreoElectronico: document.getElementById('correoElectronico').value,
    DireccionEntrega: document.getElementById('direccionEntrega').value,
    Ciudad: document.getElementById('ciudad').value,
    Asesor: document.getElementById('asesor').value
  };
  
  if (data.TipoPersona === 'JURIDICA') {
    data.RazonSocial = document.getElementById('razonSocial').value;
  } else {
    data.Nombres = document.getElementById('nombres').value;
    data.Apellidos = document.getElementById('apellidos').value;
  }
  
  try {
    const resultado = await llamarAPI('crearCliente', data);
    mostrarToast(`Cliente creado: ${resultado.ID}`, 'success');
    ocultarFormulario('formCliente');
    event.target.reset();
    listarClientes();
  } catch (error) {
    mostrarToast('Error al crear cliente: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

// ========================================
// PRODUCTOS
// ========================================
async function listarProductos() {
  mostrarLoading(true);
  
  try {
    const productos = await llamarAPI('listarProductos');
    const tbody = document.querySelector('#tablaProductos tbody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    productos.forEach(producto => {
      const tr = document.createElement('tr');
      
      tr.innerHTML = `
        <td>${producto.ID}</td>
        <td>${producto.Referencia}</td>
        <td>${producto.Descripcion}</td>
        <td>${producto.Categoria || '-'}</td>
        <td><span class="badge badge-success">${producto.Estado}</span></td>
      `;
      
      tbody.appendChild(tr);
    });
  } catch (error) {
    mostrarToast('Error al cargar productos: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function crearProducto(event) {
  event.preventDefault();
  mostrarLoading(true);
  
  const data = {
    Referencia: document.getElementById('referencia').value,
    Descripcion: document.getElementById('descripcion').value,
    Categoria: document.getElementById('categoria').value,
    Presentacion: document.getElementById('presentacion').value
  };
  
  try {
    const resultado = await llamarAPI('crearProducto', data);
    mostrarToast(`Producto creado: ${resultado.ID}`, 'success');
    ocultarFormulario('formProducto');
    event.target.reset();
    listarProductos();
  } catch (error) {
    mostrarToast('Error al crear producto: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

// ========================================
// BODEGAS
// ========================================
async function listarBodegas() {
  mostrarLoading(true);
  
  try {
    const bodegas = await llamarAPI('listarBodegas');
    const tbody = document.querySelector('#tablaBodegas tbody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    bodegas.forEach(bodega => {
      const tr = document.createElement('tr');
      
      tr.innerHTML = `
        <td>${bodega.ID}</td>
        <td>${bodega.Nombre}</td>
        <td>${bodega.Ciudad || '-'}</td>
        <td>${bodega.Responsable || '-'}</td>
        <td><span class="badge badge-success">${bodega.Estado || 'ACTIVO'}</span></td>
      `;
      
      tbody.appendChild(tr);
    });
  } catch (error) {
    mostrarToast('Error al cargar bodegas: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function crearBodega(event) {
  event.preventDefault();
  mostrarLoading(true);
  
  const data = {
    Nombre: document.getElementById('bodegaNombre').value,
    Ciudad: document.getElementById('bodegaCiudad').value,
    Direccion: document.getElementById('bodegaDireccion').value,
    Responsable: document.getElementById('bodegaResponsable').value
  };
  
  try {
    const resultado = await llamarAPI('crearBodega', data);
    mostrarToast(`Bodega creada: ${resultado.ID}`, 'success');
    ocultarFormulario('formBodega');
    event.target.reset();
    listarBodegas();
  } catch (error) {
    mostrarToast('Error al crear bodega: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

// ========================================
// DESPACHOS
// ========================================
async function listarDespachos() {
  mostrarLoading(true);
  
  try {
    const conductores = await llamarAPI('listarConductores');
    const pedidos = await llamarAPI('listarPedidos');
    
    // Poblar select de conductores
    const selectConductor = document.getElementById('despacho_conductorID');
    if (selectConductor) {
      selectConductor.innerHTML = '<option value="">Seleccione un conductor</option>';
      conductores.forEach(conductor => {
        selectConductor.innerHTML += `<option value="${conductor.ID}">${conductor.NombreConductor} - ${conductor.PlacasVehiculo || ''}</option>`;
      });
    }
    
    // Poblar select de pedidos (solo facturados o entregados)
    const selectPedido = document.getElementById('despacho_pedidoID');
    if (selectPedido) {
      selectPedido.innerHTML = '<option value="">Seleccione un pedido</option>';
      pedidos.filter(p => ['FACTURADO', 'ENTREGADO'].includes(p.Estado)).forEach(pedido => {
        selectPedido.innerHTML += `<option value="${pedido.ID}">${pedido.ID} - ${pedido.ClienteID}</option>`;
      });
    }
    
    // Para listar despachos, mostramos los pedidos en estado ENTREGADO
    const tbody = document.querySelector('#tablaDespachos tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const pedidosEntregados = pedidos.filter(p => ['ENTREGADO', 'SEGUIMIENTO', 'RECAUDADO'].includes(p.Estado));
    
    pedidosEntregados.forEach(pedido => {
      const tr = document.createElement('tr');
      
      tr.innerHTML = `
        <td>${pedido.ID}</td>
        <td>${pedido.ID}</td>
        <td>${pedido.ResponsableAlistamiento || '-'}</td>
        <td>${pedido.FechaEntrega ? new Date(pedido.FechaEntrega).toLocaleDateString() : '-'}</td>
        <td><span class="badge badge-success">${pedido.Estado}</span></td>
        <td>${pedido.Notas || '-'}</td>
      `;
      
      tbody.appendChild(tr);
    });
  } catch (error) {
    mostrarToast('Error al cargar despachos: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function crearDespacho(event) {
  event.preventDefault();
  mostrarToast('La gestión completa de despachos estará disponible próximamente', 'info');
  ocultarFormulario('formDespacho');
}

// ========================================
// PEDIDOS
// ========================================

// Variable global para almacenar items del pedido actual
let itemsPedidoActual = [];
let clientesCache = [];
let productosCache = [];

async function iniciarNuevoPedido() {
  // Limpiar formulario y arrays
  itemsPedidoActual = [];
  
  // Mostrar modal
  document.getElementById('modalPedido').style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Prevenir scroll del body
  
  // Limpiar campos
  document.getElementById('buscarCliente').value = '';
  document.getElementById('clienteNombre').value = '';
  document.getElementById('pedidoClienteID').value = '';
  document.getElementById('clienteIdentificacion').value = '';
  document.getElementById('clienteCiudad').value = '';
  document.getElementById('clienteTelefono').value = '';
  document.getElementById('buscarProducto').value = '';
  document.getElementById('productoCantidad').value = '1';
  document.getElementById('productoPrecio').value = '';
  document.getElementById('productoDescuento').value = '0';
  document.getElementById('productoSeleccionadoID').value = '';
  document.getElementById('pedidoNotas').value = '';
  
  // Cargar datos necesarios
  mostrarLoading(true);
  try {
    clientesCache = await llamarAPI('listarClientes');
    productosCache = await llamarAPI('listarProductos');
    const asesores = await llamarAPI('listarAsesores');
    
    console.log('=== DATOS CARGADOS ===');
    console.log('Clientes en cache:', clientesCache ? clientesCache.length : 0);
    console.log('Productos en cache:', productosCache ? productosCache.length : 0);
    console.log('Asesores:', asesores ? asesores.length : 0);
    
    if (clientesCache && clientesCache.length > 0) {
      console.log('Primer cliente:', clientesCache[0]);
    }
    if (productosCache && productosCache.length > 0) {
      console.log('Primer producto:', productosCache[0]);
      console.log('ID del primer producto:', productosCache[0].ID, 'Tipo:', typeof productosCache[0].ID);
    }
    
    // Poblar select de asesores
    const selectAsesor = document.getElementById('pedidoAsesor');
    selectAsesor.innerHTML = '<option value="">Seleccione un asesor</option>';
    asesores.forEach(asesor => {
      if (asesor.Estado === 'ACTIVO') {
        selectAsesor.innerHTML += `<option value="${asesor.Nombre}">${asesor.Nombre}</option>`;
      }
    });
    
    // Actualizar tabla de productos
    actualizarTablaProductosPedido();
    calcularTotalesPedido();
    
  } catch (error) {
    console.error('Error al cargar datos:', error);
    mostrarToast('Error al cargar datos: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

function buscarClienteEnTiempoReal(query) {
  const resultadosDiv = document.getElementById('resultadosCliente');
  
  if (!resultadosDiv) {
    console.error('Elemento resultadosCliente no encontrado');
    return;
  }
  
  if (!query || query.length < 2) {
    resultadosDiv.classList.remove('active');
    return;
  }
  
  if (!clientesCache || clientesCache.length === 0) {
    resultadosDiv.innerHTML = '<div style="padding: 12px; color: #999;">Cargando clientes...</div>';
    resultadosDiv.classList.add('active');
    return;
  }
  
  const queryLower = query.toLowerCase();
  const resultados = clientesCache.filter(cliente => {
    const nombres = (cliente.Nombres || '') + ' ' + (cliente.Apellidos || '');
    const razon = cliente.RazonSocial || '';
    const nombre = (nombres + ' ' + razon).toLowerCase().trim();
    const identificacion = (cliente.Identificacion || '').toString().toLowerCase();
    return nombre.includes(queryLower) || identificacion.includes(queryLower);
  });
  
  if (resultados.length === 0) {
    resultadosDiv.innerHTML = '<div style="padding: 12px; color: #999;">No se encontraron clientes</div>';
    resultadosDiv.classList.add('active');
    return;
  }
  
  resultadosDiv.innerHTML = '';
  resultados.slice(0, 8).forEach(cliente => {
    const div = document.createElement('div');
    div.className = 'search-result-item';
    const nombreDisplay = cliente.RazonSocial || ((cliente.Nombres || '') + ' ' + (cliente.Apellidos || '')).trim();
    div.innerHTML = `
      <div class="search-result-main">${nombreDisplay}</div>
      <div class="search-result-sub">NIT/CC: ${cliente.Identificacion || 'N/A'} - ${cliente.Ciudad || 'Sin ciudad'}</div>
    `;
    div.onclick = () => seleccionarCliente(cliente);
    resultadosDiv.appendChild(div);
  });
  
  resultadosDiv.classList.add('active');
}

function seleccionarCliente(cliente) {
  const nombreDisplay = cliente.RazonSocial || ((cliente.Nombres || '') + ' ' + (cliente.Apellidos || '')).trim();
  
  document.getElementById('pedidoClienteID').value = cliente.ID || '';
  document.getElementById('clienteNombre').value = nombreDisplay;
  document.getElementById('clienteIdentificacion').value = cliente.Identificacion || '';
  document.getElementById('clienteCiudad').value = cliente.Ciudad || '';
  document.getElementById('clienteTelefono').value = cliente.Telefono1 || '';
  document.getElementById('buscarCliente').value = nombreDisplay;
  
  // Cerrar resultados
  document.getElementById('resultadosCliente').classList.remove('active');
  
  console.log('Cliente seleccionado:', cliente.ID, nombreDisplay);
}

function buscarProductoEnTiempoReal(query) {
  const resultadosDiv = document.getElementById('resultadosProducto');
  
  if (!resultadosDiv) {
    console.error('Elemento resultadosProducto no encontrado');
    return;
  }
  
  if (!query || query.length < 2) {
    resultadosDiv.classList.remove('active');
    return;
  }
  
  if (!productosCache || productosCache.length === 0) {
    resultadosDiv.innerHTML = '<div style="padding: 12px; color: #999;">Cargando productos...</div>';
    resultadosDiv.classList.add('active');
    return;
  }
  
  const queryLower = query.toLowerCase();
  const resultados = productosCache.filter(producto => {
    const referencia = (producto.Referencia || '').toLowerCase();
    const descripcion = (producto.Descripcion || '').toLowerCase();
    return referencia.includes(queryLower) || descripcion.includes(queryLower);
  });
  
  if (resultados.length === 0) {
    resultadosDiv.innerHTML = '<div style="padding: 12px; color: #999;">No se encontraron productos</div>';
    resultadosDiv.classList.add('active');
    return;
  }
  
  resultadosDiv.innerHTML = '';
  resultados.slice(0, 8).forEach(producto => {
    const div = document.createElement('div');
    div.className = 'search-result-item';
    div.innerHTML = `
      <div class="search-result-main">${producto.Referencia} - ${producto.Descripcion}</div>
      <div class="search-result-sub">Categoría: ${producto.Categoria || 'Sin categoría'} | ${producto.Presentacion || ''}</div>
    `;
    div.onclick = () => seleccionarProducto(producto);
    resultadosDiv.appendChild(div);
  });
  
  resultadosDiv.classList.add('active');
}

function seleccionarProducto(producto) {
  console.log('Producto seleccionado:', producto);
  console.log('ID del producto:', producto.ID, 'Tipo:', typeof producto.ID);
  
  document.getElementById('productoSeleccionadoID').value = producto.ID;
  document.getElementById('buscarProducto').value = `${producto.Referencia} - ${producto.Descripcion}`;
  
  // Mostrar panel de información del producto
  const infoPanel = document.getElementById('infoProductoSeleccionado');
  infoPanel.style.display = 'block';
  
  // Llenar información del producto
  document.getElementById('infoReferencia').value = producto.Referencia || '';
  document.getElementById('infoDescripcion').value = producto.Descripcion || '';
  document.getElementById('infoFormato').value = producto.Formato || '';
  document.getElementById('infoPresentacion').value = producto.Presentacion || '';
  document.getElementById('infoUndEmpaque').value = producto.UndEmpaque || '';
  document.getElementById('infoFichasPorCaja').value = producto.FichasPorCaja || '';
  document.getElementById('infoCajasPorPallet').value = producto.CajasPorPallet || '';
  document.getElementById('infoPesoPorCaja').value = producto.PesoPorCaja ? producto.PesoPorCaja + ' kg' : '';
  document.getElementById('infoPrecio1').value = producto.Precio1 ? '$' + formatearNumero(producto.Precio1) : '';
  document.getElementById('infoPrecio2').value = producto.Precio2 ? '$' + formatearNumero(producto.Precio2) : '';
  document.getElementById('infoPrecio3').value = producto.Precio3 ? '$' + formatearNumero(producto.Precio3) : '';
  
  // Establecer precio por defecto (Precio1)
  if (producto.Precio1) {
    document.getElementById('productoPrecio').value = producto.Precio1;
  }
  
  document.getElementById('productoCantidad').focus();
  
  // Cerrar resultados
  document.getElementById('resultadosProducto').classList.remove('active');
}

function agregarProductoAPedido() {
  const productoID = document.getElementById('productoSeleccionadoID').value;
  const cantidad = parseFloat(document.getElementById('productoCantidad').value) || 0;
  const precio = parseFloat(document.getElementById('productoPrecio').value) || 0;
  const descuento = parseFloat(document.getElementById('productoDescuento').value) || 0;
  
  console.log('=== AGREGAR PRODUCTO ===');
  console.log('productoID obtenido del campo:', productoID, 'Tipo:', typeof productoID);
  console.log('Tamaño del cache:', productosCache.length);
  console.log('Primeros 3 IDs del cache:', productosCache.slice(0, 3).map(p => ({ ID: p.ID, tipo: typeof p.ID })));
  
  if (!productoID) {
    mostrarToast('Debe seleccionar un producto', 'warning');
    return;
  }
  
  if (cantidad <= 0) {
    mostrarToast('La cantidad debe ser mayor a cero', 'warning');
    return;
  }
  
  if (precio <= 0) {
    mostrarToast('El precio debe ser mayor a cero', 'warning');
    return;
  }
  
  // Intentar encontrar con conversión a número si es necesario
  let producto = productosCache.find(p => p.ID === productoID);
  if (!producto) {
    // Intentar con conversión de tipos
    producto = productosCache.find(p => p.ID == productoID);
  }
  if (!producto) {
    // Intentar comparando como números
    const productoIDNum = parseInt(productoID);
    producto = productosCache.find(p => parseInt(p.ID) === productoIDNum);
  }
  
  if (!producto) {
    console.error('Producto no encontrado después de 3 intentos de búsqueda');
    mostrarToast('Producto no encontrado en el cache', 'error');
    return;
  }
  
  console.log('✓ Producto encontrado:', producto);
  
  // Obtener presentación para el cálculo
  const presentacion = parseFloat(producto.Presentacion) || 1;
  
  // Verificar si ya existe el producto
  const existente = itemsPedidoActual.find(item => item.ProductoID === productoID);
  if (existente) {
    existente.Cantidad += cantidad;
    existente.Precio = precio;
    existente.Descuento = descuento;
    // Nueva fórmula: cantidad * presentación * precio - descuento
    const subtotal = existente.Cantidad * presentacion * precio;
    existente.Total = subtotal * (1 - descuento / 100);
  } else {
    // Nueva fórmula: cantidad * presentación * precio - descuento
    const subtotal = cantidad * presentacion * precio;
    const total = subtotal * (1 - descuento / 100);
    
    itemsPedidoActual.push({
      ProductoID: productoID,
      Referencia: producto.Referencia,
      Descripcion: producto.Descripcion,
      Presentacion: producto.Presentacion || 1,
      Cantidad: cantidad,
      Precio: precio,
      Descuento: descuento,
      Total: total
    });
  }
  
  // Limpiar campos
  document.getElementById('buscarProducto').value = '';
  document.getElementById('productoSeleccionadoID').value = '';
  document.getElementById('productoCantidad').value = '1';
  document.getElementById('productoPrecio').value = '';
  document.getElementById('productoDescuento').value = '0';
  
  // Ocultar panel de información
  document.getElementById('infoProductoSeleccionado').style.display = 'none';
  
  actualizarTablaProductosPedido();
  calcularTotalesPedido();
}

function eliminarItemPedido(index) {
  itemsPedidoActual.splice(index, 1);
  actualizarTablaProductosPedido();
  calcularTotalesPedido();
}

function actualizarTablaProductosPedido() {
  const tbody = document.getElementById('itemsPedido');
  
  if (itemsPedidoActual.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center" style="color: #999;">
          No hay productos agregados. Use el buscador para agregar productos.
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = '';
  itemsPedidoActual.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.Referencia}</td>
      <td>${item.Descripcion}</td>
      <td>${item.Cantidad}</td>
      <td>${item.Presentacion || 1}</td>
      <td>$${formatearNumero(item.Precio)}</td>
      <td>${item.Descuento}%</td>
      <td>$${formatearNumero(item.Total)}</td>
      <td>
        <button class="btn-remove" onclick="eliminarItemPedido(${index})">🗑</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function calcularTotalesPedido() {
  const total = itemsPedidoActual.reduce((sum, item) => sum + item.Total, 0);
  document.getElementById('pedidoTotal').textContent = '$' + formatearNumero(total);
}

async function guardarPedido() {
  const clienteID = document.getElementById('pedidoClienteID').value;
  const asesor = document.getElementById('pedidoAsesor').value;
  const tipoPago = document.getElementById('pedidoTipoPago').value;
  const prioridad = document.getElementById('pedidoPrioridad').value;
  const notas = document.getElementById('pedidoNotas').value;
  
  // Validaciones
  if (!clienteID) {
    mostrarToast('Debe seleccionar un cliente', 'warning');
    return;
  }
  
  if (!asesor) {
    mostrarToast('Debe seleccionar un asesor', 'warning');
    return;
  }
  
  if (itemsPedidoActual.length === 0) {
    mostrarToast('Debe agregar al menos un producto', 'warning');
    return;
  }
  
  mostrarLoading(true);
  
  try {
    const total = itemsPedidoActual.reduce((sum, item) => sum + item.Total, 0);
    
    // Crear pedido (sin IVA)
    const pedidoData = {
      ClienteID: clienteID,
      Asesor: asesor,
      TipoPago: tipoPago,
      Prioridad: prioridad,
      Notas: notas,
      Subtotal: total,
      IVA: 0,
      Total: total
    };
    
    const pedido = await llamarAPI('crearPedido', pedidoData);
    
    // Agregar detalles del pedido
    for (const item of itemsPedidoActual) {
      await llamarAPI('agregarDetallePedido', {
        PedidoID: pedido.ID,
        ProductoID: item.ProductoID,
        Cantidad: item.Cantidad,
        Precio: item.Precio,
        Descuento: item.Descuento,
        Total: item.Total
      });
    }
    
    mostrarToast(`✅ Pedido ${pedido.ID} creado exitosamente`, 'success');
    cancelarPedido();
    listarPedidos();
    
  } catch (error) {
    mostrarToast('Error al guardar pedido: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

function cancelarPedido() {
  itemsPedidoActual = [];
  
  // Ocultar panel de información del producto
  const infoPanel = document.getElementById('infoProductoSeleccionado');
  if (infoPanel) {
    infoPanel.style.display = 'none';
  }
  
  document.getElementById('modalPedido').style.display = 'none';
  document.body.style.overflow = ''; // Restaurar scroll del body
}

async function listarPedidos() {
  mostrarLoading(true);
  
  try {
    const pedidos = await llamarAPI('listarPedidos');
    const clientes = await llamarAPI('listarClientes');
    const tbody = document.querySelector('#tablaPedidos tbody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    pedidos.forEach(pedido => {
      const tr = document.createElement('tr');
      const fecha = pedido.Fecha ? new Date(pedido.Fecha).toLocaleDateString() : '-';
      
      // Buscar nombre del cliente
      const cliente = clientes.find(c => c.ID == pedido.ClienteID || c.ID === pedido.ClienteID);
      const nombreCliente = cliente 
        ? (cliente.RazonSocial || ((cliente.Nombres || '') + ' ' + (cliente.Apellidos || '')).trim() || 'Cliente sin nombre')
        : `Cliente #${pedido.ClienteID}`;
      
      let badgeClass = 'badge-info';
      if (pedido.Estado === 'RECAUDADO') badgeClass = 'badge-success';
      if (pedido.Estado === 'ENTREGADO') badgeClass = 'badge-success';
      if (pedido.Estado === 'PEDIDO') badgeClass = 'badge-warning';
      
      tr.innerHTML = `
        <td>${pedido.ID}</td>
        <td>${fecha}</td>
        <td>${nombreCliente}</td>
        <td>${pedido.Asesor || '-'}</td>
        <td><span class="badge ${badgeClass}">${pedido.Estado}</span></td>
        <td>$${formatearNumero(pedido.Total || 0)}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="verDetallePedido('${pedido.ID}')">Ver</button>
          <button class="btn btn-sm btn-success" onclick="convertirPedidoAFactura('${pedido.ID}')" title="Convertir a Factura">📄</button>
        </td>
      `;
      
      tbody.appendChild(tr);
    });
  } catch (error) {
    mostrarToast('Error al cargar pedidos: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function verDetallePedido(pedidoID) {
  mostrarToast('Funcionalidad de ver detalle en desarrollo', 'info');
}

// ========================================
// FACTURAS
// ========================================

// Variable global para almacenar items de la factura actual
let itemsFacturaActual = [];
let clientesCacheFactura = [];
let productosCacheFactura = [];

async function iniciarNuevaFactura() {
  // Limpiar formulario y arrays
  itemsFacturaActual = [];
  
  // Mostrar modal
  document.getElementById('modalFactura').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  // Limpiar campos
  document.getElementById('buscarClienteFactura').value = '';
  document.getElementById('facturaClienteNombre').value = '';
  document.getElementById('facturaClienteID').value = '';
  document.getElementById('facturaClienteIdentificacion').value = '';
  document.getElementById('facturaClienteCiudad').value = '';
  document.getElementById('facturaClienteTelefono').value = '';
  document.getElementById('facturaNumero').value = '';
  document.getElementById('facturaTipoPago').value = 'CONTADO';
  document.getElementById('facturaFechaVencimiento').value = '';
  document.getElementById('facturaNotas').value = '';
  document.getElementById('buscarProductoFactura').value = '';
  document.getElementById('facturaProductoCantidad').value = '1';
  document.getElementById('facturaProductoPrecio').value = '';
  document.getElementById('facturaProductoDescuento').value = '0';
  document.getElementById('facturaProductoSeleccionadoID').value = '';
  
  // Cargar datos necesarios
  mostrarLoading(true);
  try {
    clientesCacheFactura = await llamarAPI('listarClientes');
    productosCacheFactura = await llamarAPI('listarProductos');
    
    console.log('=== DATOS CARGADOS (FACTURA) ===');
    console.log('Clientes en cache:', clientesCacheFactura ? clientesCacheFactura.length : 0);
    console.log('Productos en cache:', productosCacheFactura ? productosCacheFactura.length : 0);
    
    // Actualizar tabla de productos
    actualizarTablaProductosFactura();
    calcularTotalesFactura();
    
  } catch (error) {
    console.error('Error al cargar datos:', error);
    mostrarToast('Error al cargar datos: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

function buscarClienteFacturaEnTiempoReal(query) {
  const resultadosDiv = document.getElementById('resultadosClienteFactura');
  
  if (!resultadosDiv) {
    console.error('Elemento resultadosClienteFactura no encontrado');
    return;
  }
  
  if (!query || query.length < 2) {
    resultadosDiv.classList.remove('active');
    return;
  }
  
  if (!clientesCacheFactura || clientesCacheFactura.length === 0) {
    resultadosDiv.innerHTML = '<div style="padding: 12px; color: #999;">Cargando clientes...</div>';
    resultadosDiv.classList.add('active');
    return;
  }
  
  const queryLower = query.toLowerCase();
  const resultados = clientesCacheFactura.filter(cliente => {
    const nombres = (cliente.Nombres || '') + ' ' + (cliente.Apellidos || '');
    const razon = cliente.RazonSocial || '';
    const nombre = (nombres + ' ' + razon).toLowerCase().trim();
    const identificacion = (cliente.Identificacion || '').toString().toLowerCase();
    return nombre.includes(queryLower) || identificacion.includes(queryLower);
  });
  
  if (resultados.length === 0) {
    resultadosDiv.innerHTML = '<div style="padding: 12px; color: #999;">No se encontraron clientes</div>';
    resultadosDiv.classList.add('active');
    return;
  }
  
  resultadosDiv.innerHTML = '';
  resultados.slice(0, 8).forEach(cliente => {
    const div = document.createElement('div');
    div.className = 'search-result-item';
    const nombreDisplay = cliente.RazonSocial || ((cliente.Nombres || '') + ' ' + (cliente.Apellidos || '')).trim();
    div.innerHTML = `
      <div class="search-result-main">${nombreDisplay}</div>
      <div class="search-result-sub">NIT/CC: ${cliente.Identificacion || 'N/A'} - ${cliente.Ciudad || 'Sin ciudad'}</div>
    `;
    div.onclick = () => seleccionarClienteFactura(cliente);
    resultadosDiv.appendChild(div);
  });
  
  resultadosDiv.classList.add('active');
}

function seleccionarClienteFactura(cliente) {
  const nombreDisplay = cliente.RazonSocial || ((cliente.Nombres || '') + ' ' + (cliente.Apellidos || '')).trim();
  
  document.getElementById('facturaClienteID').value = cliente.ID || '';
  document.getElementById('facturaClienteNombre').value = nombreDisplay;
  document.getElementById('facturaClienteIdentificacion').value = cliente.Identificacion || '';
  document.getElementById('facturaClienteCiudad').value = cliente.Ciudad || '';
  document.getElementById('facturaClienteTelefono').value = cliente.Telefono1 || '';
  document.getElementById('buscarClienteFactura').value = nombreDisplay;
  
  // Cerrar resultados
  document.getElementById('resultadosClienteFactura').classList.remove('active');
  
  console.log('Cliente seleccionado (factura):', cliente.ID, nombreDisplay);
}

function buscarProductoFacturaEnTiempoReal(query) {
  const resultadosDiv = document.getElementById('resultadosProductoFactura');
  
  if (!resultadosDiv) {
    console.error('Elemento resultadosProductoFactura no encontrado');
    return;
  }
  
  if (!query || query.length < 2) {
    resultadosDiv.classList.remove('active');
    return;
  }
  
  if (!productosCacheFactura || productosCacheFactura.length === 0) {
    resultadosDiv.innerHTML = '<div style="padding: 12px; color: #999;">Cargando productos...</div>';
    resultadosDiv.classList.add('active');
    return;
  }
  
  const queryLower = query.toLowerCase();
  const resultados = productosCacheFactura.filter(producto => {
    const referencia = (producto.Referencia || '').toLowerCase();
    const descripcion = (producto.Descripcion || '').toLowerCase();
    return referencia.includes(queryLower) || descripcion.includes(queryLower);
  });
  
  if (resultados.length === 0) {
    resultadosDiv.innerHTML = '<div style="padding: 12px; color: #999;">No se encontraron productos</div>';
    resultadosDiv.classList.add('active');
    return;
  }
  
  resultadosDiv.innerHTML = '';
  resultados.slice(0, 8).forEach(producto => {
    const div = document.createElement('div');
    div.className = 'search-result-item';
    div.innerHTML = `
      <div class="search-result-main">${producto.Referencia} - ${producto.Descripcion}</div>
      <div class="search-result-sub">Categoría: ${producto.Categoria || 'Sin categoría'} | ${producto.Presentacion || ''}</div>
    `;
    div.onclick = () => seleccionarProductoFactura(producto);
    resultadosDiv.appendChild(div);
  });
  
  resultadosDiv.classList.add('active');
}

function seleccionarProductoFactura(producto) {
  console.log('Producto seleccionado (factura):', producto);
  
  document.getElementById('facturaProductoSeleccionadoID').value = producto.ID;
  document.getElementById('buscarProductoFactura').value = `${producto.Referencia} - ${producto.Descripcion}`;
  
  // Mostrar panel de información del producto
  const infoPanel = document.getElementById('infoProductoSeleccionadoFactura');
  infoPanel.style.display = 'block';
  
  // Llenar información del producto
  document.getElementById('infoReferenciaFactura').value = producto.Referencia || '';
  document.getElementById('infoDescripcionFactura').value = producto.Descripcion || '';
  document.getElementById('infoFormatoFactura').value = producto.Formato || '';
  document.getElementById('infoPresentacionFactura').value = producto.Presentacion || '';
  document.getElementById('infoUndEmpaqueFactura').value = producto.UndEmpaque || '';
  document.getElementById('infoFichasPorCajaFactura').value = producto.FichasPorCaja || '';
  document.getElementById('infoCajasPorPalletFactura').value = producto.CajasPorPallet || '';
  document.getElementById('infoPesoPorCajaFactura').value = producto.PesoPorCaja ? producto.PesoPorCaja + ' kg' : '';
  document.getElementById('infoPrecio1Factura').value = producto.Precio1 ? '$' + formatearNumero(producto.Precio1) : '';
  document.getElementById('infoPrecio2Factura').value = producto.Precio2 ? '$' + formatearNumero(producto.Precio2) : '';
  document.getElementById('infoPrecio3Factura').value = producto.Precio3 ? '$' + formatearNumero(producto.Precio3) : '';
  
  // Establecer precio por defecto (Precio1)
  if (producto.Precio1) {
    document.getElementById('facturaProductoPrecio').value = producto.Precio1;
  }
  
  document.getElementById('facturaProductoCantidad').focus();
  
  // Cerrar resultados
  document.getElementById('resultadosProductoFactura').classList.remove('active');
}

function agregarProductoAFactura() {
  const productoID = document.getElementById('facturaProductoSeleccionadoID').value;
  const cantidad = parseFloat(document.getElementById('facturaProductoCantidad').value) || 0;
  const precio = parseFloat(document.getElementById('facturaProductoPrecio').value) || 0;
  const descuento = parseFloat(document.getElementById('facturaProductoDescuento').value) || 0;
  
  if (!productoID) {
    mostrarToast('Debe seleccionar un producto', 'warning');
    return;
  }
  
  if (cantidad <= 0) {
    mostrarToast('La cantidad debe ser mayor a cero', 'warning');
    return;
  }
  
  if (precio <= 0) {
    mostrarToast('El precio debe ser mayor a cero', 'warning');
    return;
  }
  
  // Intentar encontrar producto
  let producto = productosCacheFactura.find(p => p.ID === productoID);
  if (!producto) {
    producto = productosCacheFactura.find(p => p.ID == productoID);
  }
  if (!producto) {
    const productoIDNum = parseInt(productoID);
    producto = productosCacheFactura.find(p => parseInt(p.ID) === productoIDNum);
  }
  
  if (!producto) {
    console.error('Producto no encontrado en cache');
    mostrarToast('Producto no encontrado en el cache', 'error');
    return;
  }
  
  // Obtener presentación para el cálculo
  const presentacion = parseFloat(producto.Presentacion) || 1;
  
  // Verificar si ya existe el producto
  const existente = itemsFacturaActual.find(item => item.ProductoID === productoID);
  if (existente) {
    existente.Cantidad += cantidad;
    existente.Precio = precio;
    existente.Descuento = descuento;
    const subtotal = existente.Cantidad * presentacion * precio;
    existente.Total = subtotal * (1 - descuento / 100);
  } else {
    const subtotal = cantidad * presentacion * precio;
    const total = subtotal * (1 - descuento / 100);
    
    itemsFacturaActual.push({
      ProductoID: productoID,
      Referencia: producto.Referencia,
      Descripcion: producto.Descripcion,
      Presentacion: producto.Presentacion || 1,
      Cantidad: cantidad,
      Precio: precio,
      Descuento: descuento,
      Total: total
    });
  }
  
  // Limpiar campos
  document.getElementById('buscarProductoFactura').value = '';
  document.getElementById('facturaProductoSeleccionadoID').value = '';
  document.getElementById('facturaProductoCantidad').value = '1';
  document.getElementById('facturaProductoPrecio').value = '';
  document.getElementById('facturaProductoDescuento').value = '0';
  
  // Ocultar panel de información
  document.getElementById('infoProductoSeleccionadoFactura').style.display = 'none';
  
  actualizarTablaProductosFactura();
  calcularTotalesFactura();
}

function eliminarItemFactura(index) {
  itemsFacturaActual.splice(index, 1);
  actualizarTablaProductosFactura();
  calcularTotalesFactura();
}

function actualizarTablaProductosFactura() {
  const tbody = document.getElementById('itemsFactura');
  
  if (itemsFacturaActual.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center" style="color: #999;">
          No hay productos agregados. Use el buscador para agregar productos.
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = '';
  itemsFacturaActual.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.Referencia}</td>
      <td>${item.Descripcion}</td>
      <td>${item.Cantidad}</td>
      <td>${item.Presentacion || 1}</td>
      <td>$${formatearNumero(item.Precio)}</td>
      <td>${item.Descuento}%</td>
      <td>$${formatearNumero(item.Total)}</td>
      <td>
        <button class="btn-remove" onclick="eliminarItemFactura(${index})">🗑</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function calcularTotalesFactura() {
  const total = itemsFacturaActual.reduce((sum, item) => sum + item.Total, 0);
  document.getElementById('facturaTotal').textContent = '$' + formatearNumero(total);
}

async function guardarFactura() {
  const clienteID = document.getElementById('facturaClienteID').value;
  const numeroFactura = document.getElementById('facturaNumero').value;
  const tipoPago = document.getElementById('facturaTipoPago').value;
  const fechaVencimiento = document.getElementById('facturaFechaVencimiento').value;
  const notas = document.getElementById('facturaNotas').value;
  
  // Validaciones
  if (!clienteID) {
    mostrarToast('Debe seleccionar un cliente', 'warning');
    return;
  }
  
  if (!numeroFactura) {
    mostrarToast('Debe ingresar un número de factura', 'warning');
    return;
  }
  
  if (itemsFacturaActual.length === 0) {
    mostrarToast('Debe agregar al menos un producto', 'warning');
    return;
  }
  
  mostrarLoading(true);
  
  try {
    const total = itemsFacturaActual.reduce((sum, item) => sum + item.Total, 0);
    
    // Crear factura
    const facturaData = {
      ClienteID: clienteID,
      Numero: numeroFactura,
      TipoPago: tipoPago,
      FechaVencimiento: fechaVencimiento || null,
      Observaciones: notas,
      Total: total,
      Saldo: total, // Inicialmente el saldo es igual al total
      Estado: 'PENDIENTE'
    };
    
    const factura = await llamarAPI('crearFactura', facturaData);
    
    // Agregar detalles de la factura
    for (const item of itemsFacturaActual) {
      await llamarAPI('agregarDetalleFactura', {
        FacturaID: factura.ID,
        ProductoID: item.ProductoID,
        Cantidad: item.Cantidad,
        Precio: item.Precio,
        Descuento: item.Descuento,
        Total: item.Total
      });
    }
    
    mostrarToast(`✅ Factura ${numeroFactura} creada exitosamente`, 'success');
    cancelarFactura();
    listarFacturas();
    
  } catch (error) {
    mostrarToast('Error al crear factura: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

function cancelarFactura() {
  itemsFacturaActual = [];
  
  // Ocultar panel de información del producto
  const infoPanel = document.getElementById('infoProductoSeleccionadoFactura');
  if (infoPanel) {
    infoPanel.style.display = 'none';
  }
  
  document.getElementById('modalFactura').style.display = 'none';
  document.body.style.overflow = '';
}

async function listarFacturas() {
  mostrarLoading(true);
  
  try {
    const facturas = await llamarAPI('listarFacturas');
    const clientes = await llamarAPI('listarClientes');
    const tbody = document.querySelector('#tablaFacturas tbody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    facturas.forEach(factura => {
      const tr = document.createElement('tr');
      const fecha = factura.Fecha ? new Date(factura.Fecha).toLocaleDateString() : '-';
      
      // Buscar nombre del cliente
      const cliente = clientes.find(c => c.ID == factura.ClienteID || c.ID === factura.ClienteID);
      const nombreCliente = cliente 
        ? (cliente.RazonSocial || ((cliente.Nombres || '') + ' ' + (cliente.Apellidos || '')).trim() || 'Cliente sin nombre')
        : `Cliente #${factura.ClienteID}`;
      
      let badgeClass = 'badge-warning';
      if (factura.Estado === 'PAGADA') badgeClass = 'badge-success';
      if (factura.Estado === 'ANULADA') badgeClass = 'badge-danger';
      
      tr.innerHTML = `
        <td>${factura.ID}</td>
        <td>${factura.Numero || '-'}</td>
        <td>${fecha}</td>
        <td>${nombreCliente}</td>
        <td>$${formatearNumero(factura.Total || 0)}</td>
        <td>$${formatearNumero(factura.Saldo || 0)}</td>
        <td><span class="badge ${badgeClass}">${factura.Estado}</span></td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="verDetalleFactura('${factura.ID}')">Ver</button>
        </td>
      `;
      
      tbody.appendChild(tr);
    });
  } catch (error) {
    mostrarToast('Error al cargar facturas: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function verDetalleFactura(facturaID) {
  mostrarToast('Funcionalidad de ver detalle en desarrollo', 'info');
}

async function convertirPedidoAFactura(pedidoID) {
  const confirmar = confirm(`¿Desea convertir el pedido ${pedidoID} en factura?`);
  if (!confirmar) return;
  
  mostrarLoading(true);
  
  try {
    // Obtener detalles del pedido
    const pedido = await llamarAPI('obtenerPedido', { PedidoID: pedidoID });
    const detalles = await llamarAPI('obtenerDetallesPedido', { PedidoID: pedidoID });
    
    // Abrir modal de factura
    await iniciarNuevaFactura();
    
    // Pre-llenar datos del cliente si existe
    if (pedido.ClienteID) {
      const cliente = clientesCacheFactura.find(c => c.ID == pedido.ClienteID);
      if (cliente) {
        seleccionarClienteFactura(cliente);
      }
    }
    
    // Pre-llenar tipo de pago
    if (pedido.TipoPago) {
      document.getElementById('facturaTipoPago').value = pedido.TipoPago;
    }
    
    // Pre-llenar notas
    if (pedido.Notas) {
      document.getElementById('facturaNotas').value = `Generado desde Pedido #${pedidoID}\\n${pedido.Notas}`;
    }
    
    // Agregar productos del pedido
    if (detalles && detalles.length > 0) {
      for (const detalle of detalles) {
        const producto = productosCacheFactura.find(p => 
          p.ID == detalle.ProductoID || 
          p.ID === detalle.ProductoID || 
          parseInt(p.ID) === parseInt(detalle.ProductoID)
        );
        
        if (producto) {
          const presentacion = parseFloat(producto.Presentacion) || 1;
          const cantidad = parseFloat(detalle.Cantidad) || 1;
          const precio = parseFloat(detalle.Precio) || 0;
          const descuento = parseFloat(detalle.Descuento) || 0;
          const subtotal = cantidad * presentacion * precio;
          const total = subtotal * (1 - descuento / 100);
          
          itemsFacturaActual.push({
            ProductoID: producto.ID,
            Referencia: producto.Referencia,
            Descripcion: producto.Descripcion,
            Presentacion: producto.Presentacion || 1,
            Cantidad: cantidad,
            Precio: precio,
            Descuento: descuento,
            Total: total
          });
        }
      }
      
      actualizarTablaProductosFactura();
      calcularTotalesFactura();
    }
    
    mostrarToast('Pedido cargado en factura. Complete los datos faltantes.', 'success');
    
  } catch (error) {
    console.error('Error al convertir pedido:', error);
    mostrarToast('Error al cargar pedido: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

// Cerrar resultados de búsqueda al hacer clic fuera
document.addEventListener('click', function(e) {
  if (!e.target.closest('.search-input-group')) {
    document.querySelectorAll('.search-results').forEach(div => {
      div.classList.remove('active');
    });
  }
});

// Cerrar modal al hacer clic en el overlay
document.addEventListener('click', function(e) {
  const modalPedido = document.getElementById('modalPedido');
  if (e.target === modalPedido) {
    cancelarPedido();
  }
  
  const modalFactura = document.getElementById('modalFactura');
  if (e.target === modalFactura) {
    cancelarFactura();
  }
});

// Cerrar modal con tecla ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const modalPedido = document.getElementById('modalPedido');
    if (modalPedido && modalPedido.style.display === 'flex') {
      cancelarPedido();
    }
    
    const modalFactura = document.getElementById('modalFactura');
    if (modalFactura && modalFactura.style.display === 'flex') {
      cancelarFactura();
    }
  }
});

// ========================================
// RECAUDOS
// ========================================
async function listarRecaudos() {
  mostrarLoading(true);
  
  try {
    const recaudos = await llamarAPI('listarRecaudos');
    const clientes = await llamarAPI('listarClientes');
    const tbody = document.querySelector('#tablaRecaudos tbody');
    
    if (!tbody) return;
    
    const currency = configGeneral?.moneda || 'COP';
    const formatCurrency = (value) => new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(value || 0);
    
    tbody.innerHTML = '';
    
    recaudos.forEach(recaudo => {
      const tr = document.createElement('tr');
      const fecha = recaudo.Fecha ? new Date(recaudo.Fecha).toLocaleDateString() : '-';
      
      // Buscar nombre del cliente si existe
      let nombreCliente = '-';
      if (recaudo.ClienteID) {
        const cliente = clientes.find(c => c.ID == recaudo.ClienteID || c.ID === recaudo.ClienteID);
        nombreCliente = cliente 
          ? (cliente.RazonSocial || ((cliente.Nombres || '') + ' ' + (cliente.Apellidos || '')).trim() || 'Cliente sin nombre')
          : `Cliente #${recaudo.ClienteID}`;
      }
      
      tr.innerHTML = `
        <td>${recaudo.ID}</td>
        <td>${recaudo.Tipo}</td>
        <td>${recaudo.FacturaID || '-'}</td>
        <td>${nombreCliente}</td>
        <td>${fecha}</td>
        <td>${formatCurrency(recaudo.Valor)}</td>
        <td>${recaudo.Metodo || '-'}</td>
        <td>${recaudo.Referencia || '-'}</td>
      `;
      
      tbody.appendChild(tr);
    });
  } catch (error) {
    mostrarToast('Error al cargar recaudos: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function crearRecaudo(event) {
  event.preventDefault();
  mostrarLoading(true);
  
  const tipo = document.getElementById('recaudoTipo').value;
  const facturaId = document.getElementById('recaudoFacturaID').value.trim();
  const data = {
    Tipo: tipo,
    FacturaID: facturaId,
    ClienteID: document.getElementById('recaudoClienteID').value,
    Valor: parseFloat(document.getElementById('recaudoValor').value) || 0,
    Metodo: document.getElementById('recaudoMetodo').value,
    Referencia: document.getElementById('recaudoReferencia').value,
    Observaciones: document.getElementById('recaudoObservaciones').value
  };

  if ((tipo === 'ABONO' || tipo === 'PAGO_FACTURA') && !facturaId) {
    mostrarToast('Debe indicar la factura para abonos o pagos', 'warning');
    mostrarLoading(false);
    return;
  }
  
  try {
    const resultado = await llamarAPI('crearRecaudo', data);
    mostrarToast(`Recaudo registrado: ${resultado.ID}`, 'success');
    ocultarFormulario('formRecaudo');
    event.target.reset();
    listarRecaudos();
  } catch (error) {
    mostrarToast('Error al registrar recaudo: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

// ========================================
// ASESORES
// ========================================
async function listarAsesores() {
  mostrarLoading(true);
  
  try {
    const asesores = await llamarAPI('listarAsesores');
    const tbody = document.querySelector('#tablaAsesores tbody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    asesores.forEach(asesor => {
      const tr = document.createElement('tr');
      
      tr.innerHTML = `
        <td>${asesor.ID}</td>
        <td>${asesor.Nombre}</td>
        <td>${asesor.Email || '-'}</td>
        <td>${asesor.Telefono || '-'}</td>
        <td><span class="badge badge-success">${asesor.Estado || 'ACTIVO'}</span></td>
      `;
      
      tbody.appendChild(tr);
    });
  } catch (error) {
    mostrarToast('Error al cargar asesores: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function crearAsesor(event) {
  event.preventDefault();
  mostrarLoading(true);
  
  const data = {
    Nombre: document.getElementById('asesorNombre').value,
    Email: document.getElementById('asesorEmail').value,
    Telefono: document.getElementById('asesorTelefono').value
  };
  
  try {
    const resultado = await llamarAPI('crearAsesor', data);
    mostrarToast(`Asesor creado: ${resultado.ID}`, 'success');
    ocultarFormulario('formAsesor');
    event.target.reset();
    listarAsesores();
  } catch (error) {
    mostrarToast('Error al crear asesor: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function listarFormasPago() {
  mostrarLoading(true);
  
  try {
    const formas = await llamarAPI('listarFormasPago');
    const tbody = document.querySelector('#tablaFormasPago tbody');
    
    if (tbody) {
      tbody.innerHTML = '';
      
      formas.forEach(forma => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
          <td>${forma.ID}</td>
          <td>${forma.Nombre}</td>
          <td>${forma.Tipo}</td>
          <td><span class="badge badge-success">${forma.Estado || 'ACTIVO'}</span></td>
        `;
        
        tbody.appendChild(tr);
      });
    }
    
    cargarFormasPagoSelect(formas);
  } catch (error) {
    mostrarToast('Error al cargar formas de pago: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

function cargarFormasPagoSelect(formas) {
  const select = document.getElementById('recaudoMetodo');
  if (!select) return;
  
  select.innerHTML = '';
  
  if (!formas || formas.length === 0) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Sin formas de pago registradas';
    select.appendChild(option);
    return;
  }
  
  formas.forEach(forma => {
    const option = document.createElement('option');
    option.value = forma.Nombre;
    option.textContent = `${forma.Nombre} (${forma.Tipo})`;
    select.appendChild(option);
  });
}

async function crearFormaPago(event) {
  event.preventDefault();
  mostrarLoading(true);
  
  const data = {
    Nombre: document.getElementById('formaPagoNombre').value,
    Tipo: document.getElementById('formaPagoTipo').value
  };
  
  try {
    const resultado = await llamarAPI('crearFormaPago', data);
    mostrarToast(`Forma de pago creada: ${resultado.ID}`, 'success');
    ocultarFormulario('formFormaPago');
    event.target.reset();
    listarFormasPago();
  } catch (error) {
    mostrarToast('Error al crear forma de pago: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

// ========================================
// INVENTARIO
// ========================================
async function listarInventario() {
  mostrarLoading(true);
  
  try {
    const inventario = await llamarAPI('listarInventario');
    const tbody = document.querySelector('#tablaInventario tbody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    inventario.forEach(item => {
      const tr = document.createElement('tr');
      
      tr.innerHTML = `
        <td>${item.ProductoID}</td>
        <td>${item.BodegaID}</td>
        <td>${item.StockActual}</td>
        <td>${item.StockMinimo || 0}</td>
      `;
      
      tbody.appendChild(tr);
    });
  } catch (error) {
    mostrarToast('Error al cargar inventario: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

async function registrarMovimiento(event) {
  event.preventDefault();
  mostrarLoading(true);
  
  const data = {
    Tipo: document.getElementById('tipoMovimiento').value,
    ProductoID: document.getElementById('movProductoID').value,
    BodegaOrigen: document.getElementById('movBodegaOrigen').value,
    BodegaDestino: document.getElementById('movBodegaDestino').value,
    Cantidad: parseInt(document.getElementById('movCantidad').value),
    Usuario: 'Usuario Web'
  };
  
  try {
    await llamarAPI('registrarMovimiento', data);
    mostrarToast('Movimiento registrado correctamente', 'success');
    ocultarFormulario('formMovimiento');
    event.target.reset();
    listarInventario();
  } catch (error) {
    mostrarToast('Error al registrar movimiento: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

// ========================================
// UTILIDADES UI
// ========================================
function mostrarFormulario(idForm) {
  const form = document.getElementById(idForm);
  if (form) {
    form.style.display = 'flex';
  }
}

function ocultarFormulario(idForm) {
  const form = document.getElementById(idForm);
  if (form) {
    form.style.display = 'none';
  }
}

function mostrarLoading(show) {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.display = show ? 'flex' : 'none';
  }
}

function formatearNumero(numero) {
  if (numero === null || numero === undefined || isNaN(numero)) {
    return '0';
  }
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(numero);
}

function mostrarToast(mensaje, tipo = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = mensaje;
  toast.className = `toast ${tipo} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// ========================================
// EXPORTAR FUNCIONES GLOBALES
// ========================================
window.toggleSidebar = toggleSidebar;
window.cambiarVista = cambiarVista;
window.guardarConfiguracion = guardarConfiguracion;
window.mostrarFormulario = mostrarFormulario;
window.ocultarFormulario = ocultarFormulario;
window.togglePersonaFields = togglePersonaFields;
window.crearCliente = crearCliente;
window.crearProducto = crearProducto;
window.crearBodega = crearBodega;
window.crearPedido = crearPedido;
window.registrarMovimiento = registrarMovimiento;
window.crearRecaudo = crearRecaudo;
window.crearFormaPago = crearFormaPago;
window.crearAsesor = crearAsesor;
window.crearPedidoPipeline = crearPedidoPipeline;
window.avanzarEstado = avanzarEstado;
window.cerrarModalDetalle = cerrarModalDetalle;

// Funciones de pedidos con modal
window.iniciarNuevoPedido = iniciarNuevoPedido;
window.cancelarPedido = cancelarPedido;
window.guardarPedido = guardarPedido;
window.buscarClienteEnTiempoReal = buscarClienteEnTiempoReal;
window.buscarProductoEnTiempoReal = buscarProductoEnTiempoReal;
window.agregarProductoAPedido = agregarProductoAPedido;
window.eliminarItemPedido = eliminarItemPedido;
window.verDetallePedido = verDetallePedido;
window.toggleNavGroup = toggleNavGroup;

// Funciones de facturas con modal
window.iniciarNuevaFactura = iniciarNuevaFactura;
window.cancelarFactura = cancelarFactura;
window.guardarFactura = guardarFactura;
window.buscarClienteFacturaEnTiempoReal = buscarClienteFacturaEnTiempoReal;
window.buscarProductoFacturaEnTiempoReal = buscarProductoFacturaEnTiempoReal;
window.agregarProductoAFactura = agregarProductoAFactura;
window.eliminarItemFactura = eliminarItemFactura;
window.verDetalleFactura = verDetalleFactura;
window.convertirPedidoAFactura = convertirPedidoAFactura;
window.listarFacturas = listarFacturas;

// Funciones de autenticación y móvil
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.togglePasswordVisibility = togglePasswordVisibility;
window.mostrarRecuperarPassword = mostrarRecuperarPassword;
window.toggleSidebar = toggleSidebar;
window.closeMobileSidebar = closeMobileSidebar;

// ========================================
// CONFIGURACIÓN AVANZADA
// ========================================
function abrirConfiguracion() {
  const modal = document.getElementById('modalConfiguracion');
  
  // Cargar valores actuales
  document.getElementById('configApiUrl').value = API_URL;
  document.getElementById('configEmpresa').value = configGeneral.empresa;
  document.getElementById('configMoneda').value = configGeneral.moneda;
  document.getElementById('configIVA').value = configGeneral.iva;
  document.getElementById('configZonaHoraria').value = configGeneral.zonaHoraria;
  document.getElementById('configEmail').value = configGeneral.email;
  document.getElementById('configPrefijoCliente').value = configGeneral.prefijoCliente;
  document.getElementById('configPrefijoPedido').value = configGeneral.prefijoPedido;
  document.getElementById('configPrefijoFactura').value = configGeneral.prefijoFactura;
  
  // Cargar módulos
  Object.keys(modulosActivos).forEach(modulo => {
    const checkbox = document.getElementById(`modulo${modulo.charAt(0).toUpperCase() + modulo.slice(1)}`);
    if (checkbox) {
      checkbox.checked = modulosActivos[modulo];
    }
  });
  
  // Actualizar estado de conexión
  actualizarEstadoConexionModal();

  // Cargar asesores
  listarAsesores();
  
  modal.style.display = 'flex';
}

function cerrarConfiguracion() {
  const modal = document.getElementById('modalConfiguracion');
  modal.style.display = 'none';
}

function cambiarTabConfig(tabName) {
  // Ocultar todos los tabs
  document.querySelectorAll('.config-tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  document.querySelectorAll('.config-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Mostrar tab seleccionado
  document.getElementById(`configTab-${tabName}`).classList.add('active');
  const tabButton = document.querySelector(`.config-tab[data-tab="${tabName}"]`);
  if (tabButton) {
    tabButton.classList.add('active');
  }
}

function actualizarEstadoConexionModal() {
  const badge = document.getElementById('connectionStatusBadge');
  const statusText = document.getElementById('connectionStatusText');
  
  if (!badge || !statusText) return;
  
  if (API_URL && API_URL.startsWith('http')) {
    badge.className = 'status-badge';
    badge.querySelector('.status-dot').className = 'status-dot connected';
    statusText.textContent = 'Conectado';
  } else {
    badge.className = 'status-badge';
    badge.querySelector('.status-dot').className = 'status-dot error';
    statusText.textContent = 'No configurado';
  }
}

async function testearConexion() {
  const url = document.getElementById('configApiUrl').value.trim();
  
  if (!url) {
    mostrarToast('Ingresa una URL para probar', 'warning');
    return;
  }
  
  mostrarLoading(true);
  
  try {
    const testUrl = `${url}?action=getDashboard`;
    const response = await fetch(testUrl, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow'
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      mostrarToast('✅ Conexión exitosa con el servidor', 'success');
      actualizarEstadoConexionModal();
    } else {
      mostrarToast('⚠️ Servidor respondió pero con error: ' + result.error, 'warning');
    }
  } catch (error) {
    mostrarToast('❌ Error al conectar: ' + error.message, 'error');
  } finally {
    mostrarLoading(false);
  }
}

function guardarConfiguracionAPI() {
  const url = document.getElementById('configApiUrl').value.trim();
  
  if (!url) {
    mostrarToast('Por favor ingresa una URL válida', 'error');
    return;
  }
  
  if (!url.startsWith('http')) {
    mostrarToast('La URL debe comenzar con http:// o https://', 'error');
    return;
  }
  
  API_URL = url;
  localStorage.setItem('crmApiUrl', url);
  mostrarToast('✅ URL guardada correctamente', 'success');
  
  actualizarEstadoConexionModal();
  verificarConexion();
}

function guardarConfiguracionGeneral() {
  configGeneral = {
    empresa: document.getElementById('configEmpresa').value || CONFIG_DEFAULT.empresa,
    moneda: document.getElementById('configMoneda').value,
    iva: parseFloat(document.getElementById('configIVA').value) || CONFIG_DEFAULT.iva,
    zonaHoraria: document.getElementById('configZonaHoraria').value,
    email: document.getElementById('configEmail').value,
    prefijoCliente: document.getElementById('configPrefijoCliente').value || CONFIG_DEFAULT.prefijoCliente,
    prefijoPedido: document.getElementById('configPrefijoPedido').value || CONFIG_DEFAULT.prefijoPedido,
    prefijoFactura: document.getElementById('configPrefijoFactura').value || CONFIG_DEFAULT.prefijoFactura
  };
  
  localStorage.setItem('crmConfigGeneral', JSON.stringify(configGeneral));
  mostrarToast('✅ Configuración general guardada', 'success');
}

function restaurarDefectos() {
  if (confirm('¿Estás seguro de restaurar los valores por defecto? Esta acción no se puede deshacer.')) {
    configGeneral = {...CONFIG_DEFAULT};
    localStorage.setItem('crmConfigGeneral', JSON.stringify(configGeneral));
    
    // Actualizar campos
    document.getElementById('configEmpresa').value = configGeneral.empresa;
    document.getElementById('configMoneda').value = configGeneral.moneda;
    document.getElementById('configIVA').value = configGeneral.iva;
    document.getElementById('configZonaHoraria').value = configGeneral.zonaHoraria;
    document.getElementById('configEmail').value = configGeneral.email;
    document.getElementById('configPrefijoCliente').value = configGeneral.prefijoCliente;
    document.getElementById('configPrefijoPedido').value = configGeneral.prefijoPedido;
    document.getElementById('configPrefijoFactura').value = configGeneral.prefijoFactura;
    
    mostrarToast('✅ Valores restaurados por defecto', 'success');
  }
}

function guardarConfiguracionModulos() {
  modulosActivos = {
    dashboard: document.getElementById('moduloDashboard')?.checked ?? true,
    pipeline: document.getElementById('moduloPipeline')?.checked ?? true,
    clientes: document.getElementById('moduloClientes')?.checked ?? true,
    productos: document.getElementById('moduloProductos')?.checked ?? true,
    pedidos: document.getElementById('moduloPedidos')?.checked ?? true,
    facturas: document.getElementById('moduloFacturas')?.checked ?? true,
    recaudos: document.getElementById('moduloRecaudos')?.checked ?? true,
    inventario: document.getElementById('moduloInventario')?.checked ?? true
  };
  
  localStorage.setItem('crmModulos', JSON.stringify(modulosActivos));
  
  // Actualizar visibilidad en el sidebar
  actualizarVisibilidadModulos();
  
  mostrarToast('✅ Módulos actualizados', 'success');
}

function activarTodosModulos() {
  Object.keys(modulosActivos).forEach(modulo => {
    modulosActivos[modulo] = true;
    const checkbox = document.getElementById(`modulo${modulo.charAt(0).toUpperCase() + modulo.slice(1)}`);
    if (checkbox && !checkbox.disabled) {
      checkbox.checked = true;
    }
  });
  
  localStorage.setItem('crmModulos', JSON.stringify(modulosActivos));
  actualizarVisibilidadModulos();
  
  mostrarToast('✅ Todos los módulos activados', 'success');
}

function actualizarVisibilidadModulos() {
  const mapeoModulos = {
    pipeline: 'pipeline',
    clientes: 'clientes',
    productos: 'productos',
    pedidos: 'pedidos',
    facturas: 'facturas',
    recaudos: 'recaudos',
    inventario: 'inventario'
  };
  
  Object.keys(mapeoModulos).forEach(modulo => {
    const navItem = document.querySelector(`.nav-item[data-view="${mapeoModulos[modulo]}"]`);
    if (navItem) {
      navItem.style.display = modulosActivos[modulo] ? 'flex' : 'none';
    }
  });
}

// Exportar nuevas funciones
window.abrirConfiguracion = abrirConfiguracion;
window.cerrarConfiguracion = cerrarConfiguracion;
window.cambiarTabConfig = cambiarTabConfig;
window.testearConexion = testearConexion;
window.guardarConfiguracionAPI = guardarConfiguracionAPI;
window.guardarConfiguracionGeneral = guardarConfiguracionGeneral;
window.restaurarDefectos = restaurarDefectos;
window.guardarConfiguracionModulos = guardarConfiguracionModulos;
window.activarTodosModulos = activarTodosModulos;
