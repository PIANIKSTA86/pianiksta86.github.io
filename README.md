# 🏢 CRM Empresarial v2.0

Sistema de Gestión de Relaciones con Clientes (CRM) moderno con frontend en GitHub Pages y backend en Google Apps Script con Google Sheets como base de datos.

---

## 📋 Índice

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API REST](#api-rest)
- [Mejoras Implementadas](#mejoras-implementadas)
- [Próximas Mejoras Sugeridas](#próximas-mejoras-sugeridas)
- [Tecnologías](#tecnologías)

---

## ✨ Características

### Funcionalidades Actuales

- ✅ **Gestión de Clientes**
  - Registro de personas naturales y jurídicas
  - Información de contacto completa
  - Estados de clientes
  
- ✅ **Catálogo de Productos**
  - Gestión de referencias y descripciones
  - Categorización de productos
  - Control de presentaciones

- ✅ **Sistema de Inventario Multi-Bodega**
  - Control de stock por bodega
  - Movimientos: entradas, salidas, traslados
  - Alertas de stock mínimo

- ✅ **Gestión de Pedidos**
  - Creación de pedidos
  - Control de estados (Borrador, Confirmado, Facturado)
  - Detalle de pedidos con productos

- ✅ **Facturación**
  - Generación automática de facturas
  - Consecutivos automáticos
  - Control de estados de factura

- ✅ **Control de Pagos**
  - Registro de pagos parciales o totales
  - Control de cartera
  - Saldos por factura

- ✅ **Dashboard en Tiempo Real**
  - Métricas clave del negocio
  - Resumen visual de operaciones

---

## 🏗️ Arquitectura

```
┌─────────────────────┐
│   GitHub Pages      │
│   (Frontend)        │
│   - HTML5           │
│   - CSS3            │
│   - JavaScript      │
└──────────┬──────────┘
           │
           │ HTTPS/CORS
           │ Fetch API
           │
┌──────────▼──────────┐
│ Google Apps Script  │
│    (API REST)       │
│   - doGet/doPost    │
│   - Enrutamiento    │
└──────────┬──────────┘
           │
           │
┌──────────▼──────────┐
│  Google Sheets      │
│   (Base de Datos)   │
│   - CLIENTES        │
│   - PRODUCTOS       │
│   - PEDIDOS         │
│   - FACTURAS        │
│   - INVENTARIO      │
│   - etc.            │
└─────────────────────┘
```

---

## 🚀 Instalación

### 1. Configurar Google Apps Script

1. Crea una nueva hoja de cálculo en Google Sheets
2. Ve a **Extensiones → Apps Script**
3. Copia todo el contenido del archivo `code.gs` en el editor
4. Guarda el proyecto con un nombre descriptivo

### 2. Inicializar la Base de Datos

1. En el editor de Apps Script, ejecuta la función `inicializarBaseDeDatos()`
2. Autoriza la aplicación cuando se solicite
3. Verifica que se hayan creado todas las hojas en tu Google Sheet:
   - CLIENTES
   - PRODUCTOS
   - PEDIDOS
   - PEDIDO_DETALLE
   - FACTURAS
   - PAGOS
   - INVENTARIO
   - MOVIMIENTOS_INVENTARIO
   - CONDUCTORES
   - BODEGAS
   - CONFIG

### 3. Desplegar como Aplicación Web

1. En Apps Script, haz clic en **Implementar → Nueva implementación**
2. Selecciona **Aplicación web**
3. Configura:
   - **Descripción**: CRM API v1
   - **Ejecutar como**: Yo (tu cuenta)
   - **Quién tiene acceso**: Cualquier persona
4. Haz clic en **Implementar**
5. **Copia la URL de la aplicación web** (la necesitarás para el frontend)

### 4. Configurar GitHub Pages

#### Opción A: Usando GitHub Desktop o Git

```bash
# Clona tu repositorio o crea uno nuevo
git clone https://github.com/tu-usuario/crm-v1.git
cd crm-v1

# Copia los archivos del frontend
# - index.html
# - styles.css
# - app.js

# Commit y push
git add .
git commit -m "Deploy CRM v2.0"
git push origin main
```

#### Opción B: Usando la interfaz web de GitHub

1. Ve a tu repositorio en GitHub
2. Sube los archivos: `index.html`, `styles.css`, `app.js`
3. Ve a **Settings → Pages**
4. En **Source**, selecciona la rama `main` y la carpeta `/root`
5. Haz clic en **Save**
6. GitHub te dará una URL como: `https://tu-usuario.github.io/crm-v1/`

---

## ⚙️ Configuración

### Configurar la URL de la API en el Frontend

1. Abre tu aplicación desde GitHub Pages
2. En la sección **Configuración de API**, pega la URL que copiaste de Google Apps Script
3. Haz clic en **Guardar Configuración**
4. El sistema se conectará automáticamente y mostrará el dashboard

La URL quedará guardada en el LocalStorage del navegador, por lo que solo necesitas configurarla una vez.

---

## 📁 Estructura del Proyecto

```
CRMv1/
│
├── index.html          # Frontend principal con interfaz de usuario
├── styles.css          # Estilos modernos con diseño responsive
├── app.js              # Lógica de frontend y comunicación con API
├── code.gs             # Backend en Google Apps Script (API REST)
└── README.md           # Este archivo
```

---

## 🔌 API REST

### Endpoints Disponibles

Todas las llamadas se hacen mediante GET con parámetros de URL:

```
GET {URL_API}?action={accion}&data={json_data}
```

### Acciones Disponibles

#### Clientes
- `listarClientes`: Obtiene todos los clientes
- `crearCliente`: Crea un nuevo cliente
- `buscarCliente`: Busca por ID o identificación

#### Productos
- `listarProductos`: Obtiene todos los productos
- `crearProducto`: Crea un nuevo producto

#### Pedidos
- `listarPedidos`: Obtiene todos los pedidos
- `crearPedido`: Crea un nuevo pedido
- `agregarDetallePedido`: Agrega un ítem al pedido
- `confirmarPedido`: Confirma un pedido

#### Facturas
- `listarFacturas`: Obtiene todas las facturas
- `generarFactura`: Genera factura desde un pedido
- `registrarPago`: Registra un pago a una factura

#### Inventario
- `listarInventario`: Obtiene el inventario
- `registrarMovimiento`: Registra entrada/salida/traslado

#### Dashboard
- `getDashboard`: Obtiene métricas del dashboard

### Ejemplo de Uso

```javascript
// Crear un cliente
const response = await fetch(
  `${API_URL}?action=crearCliente&data=${encodeURIComponent(JSON.stringify({
    TipoPersona: "JURIDICA",
    Identificacion: "900123456",
    RazonSocial: "EMPRESA DEMO SAS",
    Ciudad: "Bogotá",
    Asesor: "Juan Pérez"
  }))}`
);

const result = await response.json();
console.log(result);
// { success: true, data: { ID: "CLI-1", ... } }
```

---

## 🎨 Mejoras Implementadas

### Frontend

✅ **Interfaz Moderna y Responsive**
- Diseño limpio con gradientes y sombras
- Adaptable a móviles y tablets
- Paleta de colores profesional

✅ **Sistema de Tabs**
- Navegación intuitiva entre módulos
- Carga dinámica de datos

✅ **Formularios Completos**
- Validaciones en cliente
- Campos condicionales según tipo de dato
- Mensajes de ayuda contextual

✅ **Dashboard Visual**
- Tarjetas con métricas clave
- Actualización en tiempo real
- Iconos representativos

✅ **Sistema de Notificaciones**
- Toasts para feedback al usuario
- Indicador de estado de conexión
- Loading spinner para operaciones largas

✅ **Tablas de Datos**
- Visualización clara de información
- Diseño responsive
- Badges de estado coloridos

### Backend

✅ **API REST Completa**
- Sistema de enrutamiento con switch
- Respuestas estandarizadas en JSON
- Manejo de errores centralizado

✅ **CORS Automático**
- Habilitado para comunicación cross-origin
- Compatible con GitHub Pages

✅ **Nuevas Funciones**
- `getDashboard()`: Métricas del sistema
- `agregarDetallePedido()`: Gestión de items
- `handleRequest()`: Enrutador centralizado

✅ **Mejora en Seguridad**
- Validación de parámetros
- Try-catch en todas las operaciones
- Respuestas consistentes

---

## 🔮 Próximas Mejoras Sugeridas

### Funcionalidades

1. **Autenticación y Autorización**
   - Login con Google OAuth
   - Roles de usuario (Admin, Vendedor, Contador)
   - Permisos por módulo

2. **Búsqueda y Filtros**
   - Buscador global
   - Filtros avanzados por fecha, estado, etc.
   - Exportación a Excel/PDF

3. **Reportes y Gráficos**
   - Ventas por período
   - Top productos
   - Cartera por vencer
   - Gráficos con Chart.js

4. **Cotizaciones**
   - Módulo de cotizaciones
   - Conversión a pedido
   - Envío por email

5. **Integraciones**
   - WhatsApp Business API
   - Email automatizado
   - Facturación electrónica

6. **Mejoras UX**
   - Modo oscuro
   - Atajos de teclado
   - Autocompletado en formularios
   - Validación de duplicados

7. **Control de Precios**
   - Listas de precios por cliente
   - Descuentos automáticos
   - Políticas de precios

8. **Auditoría**
   - Log de cambios
   - Historial de modificaciones
   - Trazabilidad completa

### Técnicas

1. **PWA (Progressive Web App)**
   - Funcionamiento offline
   - Instalable en dispositivos
   - Service Workers

2. **WebSockets o Polling**
   - Actualizaciones en tiempo real
   - Notificaciones push

3. **Testing**
   - Tests unitarios con Jest
   - Tests E2E con Cypress

4. **CI/CD**
   - GitHub Actions para deployment automático
   - Versionado semántico

5. **Optimización**
   - Lazy loading de tabs
   - Paginación en tablas grandes
   - Cache de datos frecuentes

---

## 🛠️ Tecnologías

### Frontend
- HTML5
- CSS3 (Variables CSS, Flexbox, Grid)
- JavaScript ES6+ (Async/Await, Fetch API)
- LocalStorage API

### Backend
- Google Apps Script (JavaScript-like)
- Google Sheets API

### Hosting
- GitHub Pages (Frontend)
- Google Cloud (Backend automático con Apps Script)

---

## 📞 Soporte

Para preguntas o problemas:

1. Revisa que la URL de la API esté correctamente configurada
2. Verifica que la implementación de Apps Script tenga acceso "Cualquier persona"
3. Abre la consola del navegador (F12) para ver errores
4. Verifica los logs en Apps Script: **Ejecuciones**

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y comercial.

---

## 👨‍💻 Autor

Desarrollado con ❤️ para transformar la gestión empresarial

---

## 🎯 Próximos Pasos Recomendados

1. ✅ **Inmediato**: Configurar la API y probar todas las funcionalidades
2. 📊 **Corto Plazo**: Agregar reportes y gráficos
3. 🔐 **Mediano Plazo**: Implementar autenticación
4. 📱 **Largo Plazo**: Convertir a PWA

---

**¡Disfruta de tu nuevo CRM!** 🚀
