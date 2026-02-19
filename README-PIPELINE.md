# 🏢 CRM Empresarial v2.0 - Pipeline de Ventas

Sistema de Gestión de Relaciones con Clientes (CRM) con **Pipeline Visual de Ventas**, diseñado para gestionar el ciclo completo desde el contacto inicial hasta el recaudo.

---

## 🎯 Pipeline de Ventas - Proceso Completo

El CRM implementa un pipeline visual tipo Kanban que gestiona 7 etapas del proceso comercial:

### 📞 1. CONTACTO
**Primer contacto con el cliente**
- Cliente se comunica con la empresa
- Se registra el interés inicial
- Se asigna un asesor comercial
- Se define la prioridad (Alta, Media, Baja)

### 📝 2. PEDIDO
**Facturación del pedido**
- Se toma formalmente el pedido
- Se detallan productos y cantidades
- Se calculan subtotales e IVA
- Se genera la cotización

### 📦 3. ALISTAMIENTO
**Preparación en bodega**
- Se asigna responsable de alistamiento
- Se verifica disponibilidad de stock
- Se preparan los productos
- Se empaca el pedido

### 🧾 4. FACTURADO
**Generación de factura**
- Se genera la factura oficial
- Se asigna número consecutivo
- Pedido listo para despacho
- Se registra en sistema contable

### 🚚 5. ENTREGADO
**Entrega al cliente**
- Se coordina el transporte
- Se hace el despacho
- Se confirma la recepción
- Cliente recibe el producto

### 👁️ 6. SEGUIMIENTO
**Post-venta**
- Se contacta al cliente
- Se verifica satisfacción
- Se resuelven inquietudes
- Se registran observaciones

### 💵 7. RECAUDADO
**Cobro completado**
- Se registra el pago
- Se cierra la cartera
- Venta completada exitosamente
- Ciclo cerrado

---

## ✨ Características Principales

### 🎨 Interfaz Moderna
- ✅ **Sidebar Lateral** con navegación intuitiva
- ✅ **Dashboard Visual** con métricas en tiempo real
- ✅ **Kanban Board** para gestión del pipeline
- ✅ **Diseño Responsive** para móviles y tablets
- ✅ **Drag & Drop** visual entre estados (próximamente)

### 📊 Dashboard Inteligente
- Ventas del mes
- Total de ventas acumuladas
- Pedidos en proceso por etapa
- Clientes y productos totales
- Resumen visual del pipeline
- Facturas pendientes por cobrar

### 🔄 Pipeline Visual
- Vista tipo Kanban con 7 columnas
- Tarjetas con información resumida
- Botones para avanzar entre estados
- Identificación de prioridades
- Filtros y búsqueda (próximamente)

### 📱 Funcionalidades Completas
- ✅ Gestión de clientes (personas/empresas)
- ✅ Catálogo de productos
- ✅ Control de inventario multi-bodega
- ✅ Pedidos con detalle
- ✅ Facturación automatizada
- ✅ Control de pagos y cartera
- ✅ Movimientos de inventario
- ✅ Conductores y transporte

---

## 🚀 Instalación Rápida

### 1. Backend (Google Apps Script)

```javascript
1. Crea una Google Sheet
2. Extensiones → Apps Script
3. Copia el contenido de code.gs
4. Ejecuta: inicializarBaseDeDatos()
5. Implementar → Nueva implementación → Aplicación web
6. Acceso: "Cualquier persona"
7. Copia la URL generada
```

### 2. Frontend (GitHub Pages)

```bash
1. Sube los archivos a tu repositorio:
   - index.html
   - styles.css
   - app.js

2. Settings → Pages → Activar desde rama main

3. Accede a tu URL de GitHub Pages

4. Configura la URL de la API
```

---

## 🎮 Uso del Sistema

### Crear un Nuevo Contacto

1. Ve a **Pipeline de Ventas**
2. Clic en **➕ Nuevo Contacto**
3. Completa los datos:
   - Cliente ID
   - Asesor asignado
   - Prioridad (Alta/Media/Baja)
   - Monto estimado
   - Notas
4. El contacto aparece en la columna "CONTACTO"

### Mover a Través del Pipeline

Cada tarjeta tiene un botón **"Mover a [Siguiente Etapa] →"**

1. **Contacto → Pedido**: Cuando se formaliza el interés
2. **Pedido → Alistamiento**: Cuando se confirma la orden
3. **Alistamiento → Facturado**: Cuando se alista en bodega
4. **Facturado → Entregado**: Cuando se genera la factura
5. **Entregado → Seguimiento**: Cuando se entrega al cliente
6. **Seguimiento → Recaudado**: Cuando se hace el pago completo

### Ver Detalle de un Pedido

Haz clic en cualquier tarjeta del Kanban para ver:
- Información completa del pedido
- Historial de movimientos
- Fechas de cada etapa
- Notas y observaciones
- Información financiera

---

## 📊 Estructura de Datos

### Tabla PEDIDOS (Extendida)

| Campo | Descripción |
|-------|-------------|
| ID | Identificador único |
| Fecha | Fecha de creación |
| ClienteID | Cliente asociado |
| Asesor | Vendedor asignado |
| **Estado** | **CONTACTO, PEDIDO, ALISTAMIENTO, FACTURADO, ENTREGADO, SEGUIMIENTO, RECAUDADO** |
| Subtotal, IVA, Total | Valores monetarios |
| **FechaContacto** | Cuándo se hizo el primer contacto |
| **FechaAlistamiento** | Cuándo se alistó en bodega |
| **FechaFacturacion** | Cuándo se facturó |
| **FechaEntrega** | Cuándo se entregó |
| **FechaSeguimiento** | Cuándo se hizo seguimiento |
| **FechaRecaudo** | Cuándo se recaudó el pago |
| **Prioridad** | ALTA, MEDIA, BAJA |
| **Notas** | Observaciones históricas |
| **ResponsableAlistamiento** | Quién alistó |

---

## 🔌 API REST - Nuevos Endpoints

### Pipeline de Ventas

```javascript
// Obtener pipeline completo
GET ?action=getPipeline
// Retorna: { CONTACTO: [...], PEDIDO: [...], ... }

// Cambiar estado de un pedido
GET ?action=cambiarEstadoPedido&data={
  "pedidoID": "PED-123",
  "nuevoEstado": "ALISTAMIENTO",
  "datos": {
    "Responsable": "Juan Pérez",
    "Notas": "Observaciones"
  }
}

// Obtener un pedido específico
GET ?action=obtenerPedido&data={"pedidoID": "PED-123"}

// Dashboard mejorado
GET ?action=getDashboard
// Retorna métricas extendidas incluyendo pipeline
```

---

## 🎨 Personalización

### Colores del Pipeline

Puedes modificar los colores en `styles.css`:

```css
:root {
  --contacto: #8b5cf6;      /* Púrpura */
  --pedido: #3b82f6;         /* Azul */
  --alistamiento: #f59e0b;   /* Naranja */
  --facturado: #10b981;      /* Verde */
  --entregado: #06b6d4;      /* Cyan */
  --seguimiento: #ec4899;    /* Rosa */
  --recaudado: #22c55e;      /* Verde claro */
}
```

### Agregar Campos al Pipeline

1. Modifica la estructura en `code.gs`:
```javascript
PEDIDOS: [
  // ... campos existentes
  "TuNuevoCampo"
]
```

2. Actualiza el formulario en `index.html`
3. Modifica la función `crearContactoVenta()` en `app.js`

---

## 📈 Métricas y Reportes

El dashboard muestra:

- **Ventas del Mes**: Total facturado en el mes actual
- **Ventas Totales**: Acumulado histórico
- **Pedidos por Etapa**: Cantidad en cada fase del pipeline
- **Tasa de Conversión**: (próximamente)
- **Tiempo Promedio por Etapa**: (próximamente)
- **Embudo de Ventas**: (próximamente)

---

## 🔮 Próximas Mejoras

### Funcionalidades Planeadas

1. **Drag & Drop en el Kanban**
   - Arrastrar tarjetas entre columnas
   - Actualización automática

2. **Notificaciones Automáticas**
   - Email cuando cambia de estado
   - WhatsApp para seguimiento
   - Alertas de pedidos estancados

3. **Reportes Avanzados**
   - Gráficos de embudo de ventas
   - Análisis de conversión por etapa
   - Tiempo promedio en cada fase
   - Performance por asesor

4. **Filtros y Búsqueda**
   - Filtrar por asesor
   - Filtrar por prioridad
   - Filtrar por fecha
   - Búsqueda rápida

5. **Automatizaciones**
   - Recordatorios automáticos
   - Cambio de estado automatizado
   - Actualización de inventario al facturar

6. **Integraciones**
   - API de facturación electrónica
   - Integración con WhatsApp Business
   - Sincronización con sistemas contables
   - API REST completa para integraciones

7. **Mobile App**
   - App nativa con React Native
   - Notificaciones push
   - Modo offline

---

## 🎯 Casos de Uso

### Escenario 1: Venta Nueva

```
1. Cliente llama → Crear contacto en CONTACTO
2. Cliente confirma → Mover a PEDIDO
3. Bodega prepara → Mover a ALISTAMIENTO
4. Se factura → Mover a FACTURADO
5. Se despacha → Mover a ENTREGADO
6. Se llama cliente → Mover a SEGUIMIENTO
7. Cliente paga → Mover a RECAUDADO
```

### Escenario 2: Seguimiento de Pedidos

```
Dashboard → Ver cuántos pedidos hay en cada etapa
Pipeline → Ver tarjetas individuales
Clic en tarjeta → Ver detalle completo
Analizar → Identificar cuellos de botella
```

### Escenario 3: Gestión del Equipo

```
1. Ver pedidos por asesor
2. Identificar pedidos prioritarios (Alta)
3. Asignar alistamiento a bodega
4. Hacer seguimiento de entregas
5. Controlar recaudo
```

---

## 🛠️ Tecnologías

### Frontend
- HTML5 Semántico
- CSS3 (Variables, Grid, Flexbox)
- JavaScript ES6+ (Async/Await, Modules)
- LocalStorage API

### Backend
- Google Apps Script
- Google Sheets como Database
- REST API con JSON

### Hosting
- GitHub Pages (Frontend)
- Google Cloud (Backend)

---

## 📞 Soporte

### Problemas Comunes

**❌ Las tarjetas no se mueven**
- Verifica que la URL de la API esté configurada
- Revisa la consola del navegador (F12)
- Verifica permisos en Google Apps Script

**❌ No se ven los pedidos en el pipeline**
- Asegúrate de tener pedidos creados
- Verifica que los estados sean correctos
- Refresca la página

**❌ Error al cambiar de estado**
- Verifica la conexión a internet
- Revisa los logs en Google Apps Script
- Asegúrate de tener permisos de edición

---

## 📄 Licencia

Este proyecto es de código abierto y puede ser usado libremente.

---

## 👏 Contribuciones

¡Las contribuciones son bienvenidas!

1. Fork del proyecto
2. Crea una rama para tu feature
3. Commit de tus cambios
4. Push a la rama
5. Abre un Pull Request

---

## 🎉 ¡Empieza a Vender!

Con este CRM tienes todo lo necesario para:

✅ Gestionar el ciclo completo de ventas
✅ Visualizar el proceso en tiempo real
✅ Hacer seguimiento efectivo
✅ Controlar inventarios
✅ Facturar correctamente
✅ Recaudar eficientemente

**¡Tu equipo comercial te lo agradecerá!** 🚀

---

**Desarrollado con ❤️ para equipos de ventas que quieren crecer**
