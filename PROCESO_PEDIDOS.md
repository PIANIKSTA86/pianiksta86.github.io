# 📋 Proceso de Toma de Pedidos - CRM v2.0

## 🎯 Objetivo
Implementar un flujo completo de toma de pedidos que permita seleccionar clientes por nombre/NIT, asignar asesor, y agregar productos dinámicamente con cálculo automático de totales.

---

## 🔄 Flujo del Proceso

### 1. **Iniciar Nuevo Pedido**
```javascript
iniciarNuevoPedido()
```
- Se abre el formulario completo
- Se cargan en caché: clientes, productos y asesores activos
- Se limpian todos los campos y arrays temporales
- Se inicializa la tabla de productos vacía

### 2. **Selección del Cliente**
**Búsqueda en Tiempo Real:**
- El usuario escribe en el campo "Buscar Cliente"
- Se activa `buscarClienteEnTiempoReal(query)` después de 2 caracteres
- Busca coincidencias en:
  - Nombres y Apellidos
  - Razón Social
  - Número de Identificación (NIT/CC)

**Resultados:**
- Se muestran hasta 8 coincidencias en un dropdown
- Cada resultado muestra:
  - Nombre/Razón Social
  - NIT/CC y Ciudad
- Al seleccionar, se llenan automáticamente:
  - Cliente Seleccionado (readonly)
  - NIT/CC (readonly)
  - Ciudad (readonly)
  - Teléfono (readonly)
  - ClienteID (hidden)

### 3. **Información del Pedido**
**Campos obligatorios:**
- **Asesor Comercial:** Select poblado desde tabla ASESORES (solo activos)
- **Tipo de Pago:** CONTADO, CREDITO, ANTICIPADO
- **Prioridad:** BAJA, MEDIA, ALTA, URGENTE (default: MEDIA)

**Campos opcionales:**
- **Notas del Pedido:** Observaciones especiales

### 4. **Agregar Productos**
**Búsqueda en Tiempo Real:**
```javascript
buscarProductoEnTiempoReal(query)
```
- Búsqueda por Referencia o Descripción
- Muestra hasta 8 resultados con:
  - Referencia + Descripción
  - Categoría y Presentación

**Al seleccionar producto:**
1. Se autocompleta el campo de búsqueda
2. El cursor se mueve a "Precio Unitario"
3. Usuario ingresa:
   - Cantidad (default: 1)
   - Precio Unitario
   - Descuento % (default: 0)

**Agregar a tabla:**
```javascript
agregarProductoAPedido()
```
- Valida: producto seleccionado, cantidad > 0, precio > 0
- Si el producto ya existe: actualiza cantidad y precio
- Si es nuevo: lo agrega al array `itemsPedidoActual[]`
- Calcula subtotal por item: `(cantidad × precio) × (1 - descuento/100)`
- Actualiza la tabla visual y totales

### 5. **Cálculo de Totales**
```javascript
calcularTotalesPedido()
```
**Automático en cada cambio:**
- **Subtotal:** Suma de todos los items
- **IVA (19%):** Subtotal × 0.19
- **Total:** Subtotal + IVA

**Visualización:**
- Se muestra en el panel de totales (esquina inferior derecha)
- Formato de moneda colombiana (COP)

### 6. **Guardar Pedido**
```javascript
guardarPedido()
```

**Validaciones:**
1. Cliente seleccionado ✓
2. Asesor seleccionado ✓
3. Al menos un producto agregado ✓

**Proceso de guardado:**
1. **Crear registro en PEDIDOS:**
   - Genera ID automático (PED-consecutivo)
   - Estado inicial: "PEDIDO"
   - Fecha actual
   - Datos del cliente y asesor
   - Subtotal, IVA, Total

2. **Crear registros en PEDIDO_DETALLE:**
   - Por cada producto en `itemsPedidoActual[]`
   - Relaciona con PedidoID
   - Guarda: ProductoID, Cantidad, Precio, Descuento, Total

3. **Confirmación:**
   - Mensaje: "✅ Pedido PED-XXX creado exitosamente"
   - Cierra formulario
   - Recarga lista de pedidos

---

## 🗂 Estructura de Datos

### Array Temporal: itemsPedidoActual[]
```javascript
[
  {
    ProductoID: "PROD-123",
    Referencia: "REF-001",
    Descripcion: "Producto ABC",
    Cantidad: 10,
    Precio: 50000,
    Descuento: 5,
    Total: 475000
  },
  // ... más items
]
```

### Tabla PEDIDOS
```
ID: PED-1
Fecha: 2026-02-18
ClienteID: CLI-456
Asesor: Juan Pérez
Estado: PEDIDO
Subtotal: 475000
IVA: 90250
Total: 565250
TipoPago: CREDITO
Prioridad: MEDIA
Notas: "Entrega urgente"
```

### Tabla PEDIDO_DETALLE
```
ID: DET-1
PedidoID: PED-1
ProductoID: PROD-123
Cantidad: 10
Precio: 50000
Descuento: 5
Total: 475000
```

---

## 🎨 Interfaz de Usuario

### Secciones del Formulario:

#### 1️⃣ Información del Cliente (pedido-seccion)
- Buscador con autocompletado
- Campos readonly con datos del cliente
- Visual: Fondo blanco, borde gris, ícono 👤

#### 2️⃣ Información del Pedido (pedido-seccion)
- Selects y campos de configuración
- Visual: Fondo blanco, borde gris, ícono 📝

#### 3️⃣ Productos del Pedido (pedido-seccion)
- Buscador de productos
- Campos de cantidad/precio/descuento
- Tabla dinámica de items
- Panel de totales
- Visual: Fondo blanco, borde gris, ícono 📦

### Componentes Especiales:

**Search Results Dropdown:**
- Posición absoluta bajo el input
- Z-index: 1000
- Max-height: 250px con scroll
- Border primary color
- Shadow para profundidad

**Tabla de Productos:**
- Responsive
- Hover effect en filas
- Botón 🗑 para eliminar items
- Columnas ajustables

**Panel de Totales:**
- Alineado a la derecha
- Fondo gris claro
- Total resaltado en verde
- Border top grueso en total final

---

## 🔧 Funciones Principales

### Inicialización
```javascript
iniciarNuevoPedido()
```
- Limpia formulario y arrays
- Carga datos de API (clientes, productos, asesores)
- Prepara interfaz

### Búsqueda
```javascript
buscarClienteEnTiempoReal(query)     // Busca clientes
buscarProductoEnTiempoReal(query)   // Busca productos
seleccionarCliente(cliente)         // Aplica selección
seleccionarProducto(producto)       // Aplica selección
```

### Gestión de Items
```javascript
agregarProductoAPedido()            // Agrega/actualiza item
eliminarItemPedido(index)           // Remueve item
actualizarTablaProductosPedido()    // Renderiza tabla
calcularTotalesPedido()             // Recalcula totales
```

### Persistencia
```javascript
guardarPedido()                     // Guarda en backend
cancelarPedido()                    // Cierra sin guardar
```

### Visualización
```javascript
listarPedidos()                     // Lista todos los pedidos
verDetallePedido(pedidoID)          // Ver detalle (en desarrollo)
```

---

## 📱 Responsive Design

**Desktop (>768px):**
- Formulario en 2-3 columnas
- Tabla completa
- Panel de totales a la derecha

**Mobile (<768px):**
- Formulario en 1 columna
- Tabla con scroll horizontal
- Panel de totales full width
- Botones full width apilados

---

## ✅ Validaciones Implementadas

### Frontend:
1. ✓ Cliente seleccionado (no solo escrito)
2. ✓ Asesor seleccionado
3. ✓ Al menos 1 producto
4. ✓ Cantidad > 0
5. ✓ Precio > 0
6. ✓ Descuento entre 0-100%

### Backend (code.gs):
1. ✓ Genera consecutivo automático
2. ✓ Estado inicial "PEDIDO"
3. ✓ Fecha automática
4. ✓ Cálculos de totales
5. ✓ Relación PedidoID en detalles

---

## 🚀 Mejoras Futuras

1. **Edición de pedidos existentes**
2. **Duplicar pedido**
3. **Ver historial del cliente al seleccionarlo**
4. **Sugerencias de precio basadas en histórico**
5. **Verificación de stock disponible**
6. **Aplicar descuentos por volumen automáticamente**
7. **Previsualización antes de guardar**
8. **Exportar pedido a PDF**
9. **Enviar pedido por email al cliente**
10. **Integración con inventario en tiempo real**

---

## 📊 Métricas del Proceso

**Tiempo promedio de captura:** ~3-5 minutos por pedido  
**Campos obligatorios:** 3 (Cliente, Asesor, Al menos 1 producto)  
**Validaciones:** 6 validaciones activas  
**Tablas afectadas:** 2 (PEDIDOS, PEDIDO_DETALLE)  

---

## 🎓 Ejemplo de Uso

```
1. Usuario hace clic en "➕ Nuevo Pedido"
2. Escribe "Acme" en buscar cliente
3. Selecciona "Acme Corporation - NIT 900123456"
4. Selecciona asesor "Juan Pérez"
5. Escribe "CAJ" en buscar producto
6. Selecciona "CAJ-001 - Caja de 50 unidades"
7. Ingresa cantidad: 10
8. Ingresa precio: 45000
9. Ingresa descuento: 5%
10. Clic en "➕ Agregar Producto"
    → Subtotal item: $427,500
11. Repite pasos 5-10 para más productos
12. Revisa totales:
    - Subtotal: $427,500
    - IVA (19%): $81,225
    - Total: $508,725
13. Agrega notas: "Entrega antes del viernes"
14. Clic en "💾 Guardar Pedido"
15. ✅ Pedido PED-1 creado exitosamente
```

---

## 🔑 Claves de Implementación

**Cache de datos:** Se cargan una sola vez al abrir el formulario  
**Búsqueda eficiente:** Filtrado en array local (sin llamadas API repetidas)  
**UX fluida:** Autocompletado, focus automático, validaciones en tiempo real  
**Seguridad:** IDs hidden, campos readonly, validación doble (frontend + backend)  
**Mantenibilidad:** Código modular, funciones pequeñas y específicas  

---

Desarrollado con ❤️ para CRM v2.0 | Google Apps Script + Vanilla JavaScript
