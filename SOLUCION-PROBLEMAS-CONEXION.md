# 🔧 Solución de Problemas de Conexión

## ❌ Error: "No está conectada" o "Error de conexión"

Si ves este mensaje al intentar usar el CRM, sigue estos pasos para diagnosticar y solucionar el problema.

---

## 🔍 Paso 1: Verifica que el Backend URL esté configurado

### En `app.js` (línea ~271):
```javascript
const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbwxl71I6GbDmrLn1H6q5F97JDZ2Ka2WSbUFyDHpRhXd25lIehVw_VMSt9zmLfaU3eSp/exec';
```

✅ **Tu URL está configurada correctamente** (ya no dice `TU_DEPLOYMENT_ID`)

---

## 🧹 Paso 2: Limpia el localStorage del navegador

Es posible que el navegador tenga guardada una URL antigua que está causando conflictos.

### Opción A: Desde la Consola del Navegador
1. Abre el CRM en tu navegador
2. Presiona **F12** para abrir las DevTools
3. Ve a la pestaña **Console**
4. Escribe y ejecuta:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

### Opción B: Desde la Configuración del Navegador
1. **Chrome/Edge**: Configuración → Privacidad → Borrar datos de navegación → Cookies y datos de sitios
2. **Firefox**: Configuración → Privacidad → Borrar datos → Cookies

---

## 🧪 Paso 3: Verifica que el Backend esté Funcionando

### Prueba la URL directamente en el navegador:

Abre esta URL en una nueva pestaña:
```
https://script.google.com/macros/s/AKfycbwxl71I6GbDmrLn1H6q5F97JDZ2Ka2WSbUFyDHpRhXd25lIehVw_VMSt9zmLfaU3eSp/exec?action=getDashboard
```

### Resultado esperado:

**✅ Si funciona correctamente:**
- Deberías ver un JSON con datos del dashboard
- Ejemplo:
  ```json
  {
    "success": true,
    "clientes": [...],
    "productos": [...],
    "pedidos": [...]
  }
  ```

**❌ Si hay un error:**
- Verás un mensaje de error de Google Apps Script
- Puede decir "Script function not found" o "Authorization required"

---

## ⚙️ Paso 4: Verifica el Despliegue de Google Apps Script

1. **Abre tu proyecto** en [Google Apps Script](https://script.google.com)
2. **Ve a Desplegar** → **Administrar implementaciones**
3. **Verifica:**
   - ✅ La URL mostrada coincide con la del `app.js`
   - ✅ "Ejecutar como" está configurado como **tu cuenta**
   - ✅ "Quién tiene acceso" está en **Cualquier usuario**

### Si necesitas actualizar el despliegue:
1. **Desplegar** → **Nueva implementación**
2. Tipo: **Aplicación web**
3. Descripción: `CRM v2.0 - Actualización`
4. **Ejecutar como**: Tu cuenta
5. **Quién tiene acceso**: Cualquier usuario
6. **Haz clic en "Implementar"**
7. **Copia la nueva URL** y reemplázala en `app.js` línea ~271

---

## 🔍 Paso 5: Revisa los Logs del Backend

En Google Apps Script:
1. Ve a **Ejecuciones** (icono de reloj ⏱️)
2. Busca errores recientes
3. Si hay errores en `doGet` o funciones principales, corrígelos

### Errores comunes:

**Error: `ReferenceError: DATOS no está definido`**
- Solución: Asegúrate de que todas las variables globales estén definidas en `code.gs`

**Error: `Exception: No tienes permisos para acceder a Google Sheets`**
- Solución: Ejecuta manualmente una función en Google Apps Script para autorizar

---

## 🌐 Paso 6: Verifica CORS y Seguridad del Navegador

### Revisa la consola del navegador (F12):

**Si ves un error de CORS:**
```
Access to fetch at 'https://script.google.com/...' from origin 'null' has been blocked by CORS policy
```

**Solución:**
- Asegúrate de que estás abriendo el `index.html` desde un **servidor web** (no directamente con `file://`)
- Usa un servidor local:
  ```bash
  # Python
  python -m http.server 5500
  
  # Node.js
  npx http-server -p 5500
  
  # PHP
  php -S localhost:5500
  ```

---

## 🔄 Paso 7: Fuerza la recarga de la aplicación

1. **Recarga fuerte** (Ctrl + Shift + R o Cmd + Shift + R)
2. Limpia la caché del navegador
3. Cierra y abre el navegador de nuevo

---

## 🐛 Paso 8: Modo Depuración

### Habilita logs detallados en la consola:

Abre la consola del navegador (F12) y ejecuta:
```javascript
localStorage.setItem('debug', 'true');
location.reload();
```

Esto mostrará información detallada sobre:
- La URL que está usando
- Las peticiones que se están haciendo
- Los errores específicos

### Verifica qué URL está usando:
```javascript
console.log('API_URL actual:', API_URL);
console.log('BACKEND_URL:', BACKEND_URL);
console.log('localStorage:', localStorage.getItem('crmApiUrl'));
```

---

## ✅ Lista de Verificación Completa

- [ ] La `BACKEND_URL` en `app.js` está configurada correctamente
- [ ] El backend de Google Apps Script está desplegado como "Aplicación web"
- [ ] "Quién tiene acceso" está en "Cualquier usuario"
- [ ] La URL del backend funciona cuando la abres directamente en el navegador
- [ ] Limpiaste el `localStorage` del navegador
- [ ] Estás usando un servidor web (no `file://`)
- [ ] No hay errores de CORS en la consola
- [ ] No hay errores en los logs de Google Apps Script

---

## 📞 Si el problema persiste:

1. **Verifica que `code.gs` esté completo** y tenga todas las funciones necesarias
2. **Revisa los permisos** de Google Apps Script para acceder a Sheets/Drive
3. **Crea un nuevo despliegue** en Google Apps Script y usa la nueva URL
4. **Revisa la consola del navegador** para ver errores específicos

---

## 💡 Consejo Rápido:

Si acabas de cambiar la `BACKEND_URL` en `app.js`, **siempre limpia el localStorage**:

```javascript
// En la consola del navegador (F12):
localStorage.removeItem('crmApiUrl');
location.reload();
```

Esto garantiza que el navegador use la nueva URL del código en lugar de una URL anterior guardada.

---

## 🎯 Tu configuración actual:

**URL del Backend:**
```
https://script.google.com/macros/s/AKfycbwxl71I6GbDmrLn1H6q5F97JDZ2Ka2WSbUFyDHpRhXd25lIehVw_VMSt9zmLfaU3eSp/exec
```

**Estado:** ✅ Configurada correctamente (no es un placeholder)

**Siguiente paso:** Verifica que el backend esté respondiendo correctamente abriendo esta URL con `?action=getDashboard` al final.
