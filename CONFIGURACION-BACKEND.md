# 🔧 Configuración del Backend - CRM v2.0

## 📍 Configurar la URL del Backend de Google Apps Script

Este CRM está configurado para conectarse automáticamente con un backend de Google Apps Script. Sigue estos pasos para configurarlo:

### Método 1: Configuración en el Código (Recomendado)

1. **Abre el archivo `app.js`** en tu editor de código
2. **Ve a la línea ~256** (busca la constante `BACKEND_URL`)
3. **Reemplaza `TU_DEPLOYMENT_ID`** con el ID de tu despliegue de Google Apps Script

```javascript
// ANTES:
const BACKEND_URL = 'https://script.google.com/macros/s/TU_DEPLOYMENT_ID/exec';

// DESPUÉS (ejemplo):
const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbx1234567890abcdefghijk/exec';
```

4. **Guarda el archivo** y recarga la aplicación

### Método 2: Configuración desde el Frontend

Si prefieres no modificar el código, puedes configurar la URL desde la interfaz:

1. **Inicia sesión** en el CRM (usuario: `admin`, contraseña: `admin`)
2. **Haz clic en el icono ⚙️** (Configuración) en el header superior
3. **Ve a la pestaña "🔌 Conexión"**
4. **Ingresa la URL completa** de tu Google Apps Script
5. **Haz clic en "Probar Conexión"** y luego en "💾 Guardar"

---

## 📝 Cómo obtener la URL de Google Apps Script

1. Abre tu proyecto en [Google Apps Script](https://script.google.com)
2. Ve a **Desplegar** → **Implementar como aplicación web**
3. Configura:
   - **Ejecutar como**: Tu cuenta
   - **Quién tiene acceso**: Cualquier usuario
4. Haz clic en **Implementar**
5. **Copia la URL** que aparece (empieza con `https://script.google.com/macros/s/...`)
6. Úsala en cualquiera de los métodos de configuración anteriores

---

## ✅ Verificar la Conexión

Una vez configurada la URL, el sistema:

- ✅ Intentará conectarse automáticamente al cargar
- ✅ Mostrará un indicador de estado en el header:
  - 🟢 **Conectado** - Conexión exitosa
  - 🟡 **Conectando...** - Intentando conectar
  - 🔴 **Error de conexión** - No se pudo conectar
  - ⚪ **Configuración requerida** - URL no configurada

---

## 🔄 Cambiar la URL en el Futuro

Si necesitas cambiar la URL del backend:

**Desde el código:**
- Modifica `BACKEND_URL` en `app.js` (línea ~256)

**Desde el frontend:**
- Ve a Configuración (⚙️) → Conexión
- Ingresa la nueva URL y guarda

La URL se almacena en `localStorage`, por lo que persiste entre sesiones.

---

## 🐛 Solución de Problemas

### "Error de conexión" al iniciar

**Causas posibles:**
1. La URL del backend no está configurada correctamente
2. El despliegue de Google Apps Script no está público
3. Hay un error en el código del backend (revisar `code.gs`)

**Solución:**
1. Verifica que la URL sea correcta y esté completa
2. En Google Apps Script, verifica que "Quién tiene acceso" esté en "Cualquier usuario"
3. Revisa los logs de Google Apps Script para ver errores

### La configuración no se guarda

**Solución:**
- Limpia el localStorage del navegador:
  ```javascript
  // En la consola del navegador (F12):
  localStorage.clear();
  location.reload();
  ```
- Vuelve a configurar la URL

---

## 🔐 Seguridad

- La URL del backend es **pública por naturaleza** (Google Apps Script)
- Implementa **validaciones en el backend** para proteger datos sensibles
- Considera añadir **tokens de autenticación** en producción
- Las credenciales de login actuales son **solo para demo**

---

## 📚 Archivos Relacionados

- **`app.js`** (línea ~256) - Configuración de BACKEND_URL
- **`code.gs`** - Código del backend de Google Apps Script
- **`DEPLOYMENT.md`** - Guía completa de despliegue
- **`index.html`** - Modal de configuración (línea ~1500)

---

## 💡 Ejemplo Completo

```javascript
// En app.js (línea ~256):
const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbxYOUR_DEPLOYMENT_ID_HERE/exec';

// Este valor se usa automáticamente al cargar la aplicación
// Si el usuario configura una URL diferente desde el frontend,
// ésta se almacena en localStorage y tiene prioridad
```

---

**¿Necesitas ayuda?** Revisa el archivo `DEPLOYMENT.md` para una guía completa de configuración.
