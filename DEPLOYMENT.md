# 🚀 Guía de Deployment - CRM Empresarial v2.0

Esta guía te llevará paso a paso para publicar tu CRM en GitHub Pages y conectarlo con Google Apps Script.

---

## 📋 Pre-requisitos

- ✅ Cuenta de GitHub
- ✅ Cuenta de Google
- ✅ Git instalado (opcional, puedes usar la interfaz web de GitHub)

---

## PARTE 1: Configurar el Backend (Google Apps Script)

### Paso 1: Crear la Hoja de Cálculo

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Nómbrala: "CRM Empresarial Database"

### Paso 2: Abrir el Editor de Scripts

1. En tu hoja, ve al menú **Extensiones → Apps Script**
2. Se abrirá el editor de Google Apps Script
3. Elimina cualquier código que venga por defecto

### Paso 3: Copiar el Código Backend

1. Abre el archivo `code.gs` de este proyecto
2. Copia TODO el contenido
3. Pégalo en el editor de Apps Script
4. Haz clic en el ícono de **Guardar** (💾)
5. Nombra el proyecto: "CRM API"

### Paso 4: Inicializar la Base de Datos

1. En el editor, selecciona la función `inicializarBaseDeDatos` del menú desplegable
2. Haz clic en el botón **Ejecutar** (▶️)
3. La primera vez te pedirá autorización:
   - Haz clic en **Revisar permisos**
   - Selecciona tu cuenta de Google
   - Haz clic en **Avanzado**
   - Haz clic en **Ir a CRM API (no seguro)**
   - Haz clic en **Permitir**
4. Espera a que termine la ejecución (verde ✅ en la parte inferior)
5. Ve a tu hoja de cálculo y verifica que se crearon todas las pestañas

### Paso 5: Desplegar como Aplicación Web

1. En el editor de Apps Script, haz clic en **Implementar** (arriba a la derecha)
2. Selecciona **Nueva implementación**
3. Haz clic en el ícono de engranaje ⚙️ junto a "Seleccionar tipo"
4. Selecciona **Aplicación web**
5. Configura lo siguiente:
   - **Descripción**: `CRM API v1.0`
   - **Ejecutar como**: `Yo (tu@email.com)`
   - **Quién tiene acceso**: `Cualquier persona`
6. Haz clic en **Implementar**
7. **IMPORTANTE**: Copia la URL que aparece (la necesitarás en el frontend)
   - Ejemplo: `https://script.google.com/macros/s/ABC123XYZ.../exec`

### Paso 6: Probar el Backend (Opcional pero Recomendado)

Abre esta URL en tu navegador:
```
TU_URL_COPIADA?action=getDashboard
```

Deberías ver algo como:
```json
{"success":true,"data":{"totalClientes":0,"totalProductos":0,"pedidosPendientes":0,"facturasPendientes":0}}
```

✅ Si ves esto, tu backend está funcionando correctamente.

---

## PARTE 2: Configurar el Frontend (GitHub Pages)

### Opción A: Usando la Interfaz Web de GitHub (Más Fácil)

#### Paso 1: Crear el Repositorio

1. Ve a [GitHub](https://github.com)
2. Haz clic en el botón **+** (arriba a la derecha) → **New repository**
3. Configura:
   - **Repository name**: `crm-empresarial` (o el nombre que prefieras)
   - **Public** (debe ser público para GitHub Pages gratis)
   - ✅ Marca "Add a README file"
4. Haz clic en **Create repository**

#### Paso 2: Subir los Archivos

1. En tu repositorio, haz clic en **Add file → Upload files**
2. Arrastra o selecciona estos archivos de tu proyecto:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md` (opcional, se reemplazará)
   - `.gitignore` (opcional)
3. Escribe un mensaje de commit: "Deploy CRM v2.0"
4. Haz clic en **Commit changes**

#### Paso 3: Activar GitHub Pages

1. Ve a **Settings** (pestaña de tu repositorio)
2. En el menú lateral, busca y haz clic en **Pages**
3. En **Source**, selecciona:
   - Branch: `main`
   - Folder: `/ (root)`
4. Haz clic en **Save**
5. Espera 1-2 minutos
6. Refresca la página y verás un mensaje verde con tu URL:
   ```
   Your site is live at https://tu-usuario.github.io/crm-empresarial/
   ```

#### Paso 4: Abrir tu Aplicación

1. Haz clic en la URL o ábrela en tu navegador
2. Deberías ver la interfaz del CRM

---

### Opción B: Usando Git en la Terminal (Avanzado)

```bash
# 1. Clonar o inicializar repositorio
git init
git remote add origin https://github.com/tu-usuario/crm-empresarial.git

# 2. Agregar archivos
git add index.html styles.css app.js README.md .gitignore

# 3. Hacer commit
git commit -m "Deploy CRM v2.0"

# 4. Push a GitHub
git branch -M main
git push -u origin main

# 5. Luego activa GitHub Pages desde Settings → Pages (ver Opción A, Paso 3)
```

---

## PARTE 3: Conectar Frontend con Backend

### Paso 1: Configurar la URL de la API

1. Abre tu aplicación desde la URL de GitHub Pages
2. Verás una sección morada llamada **"Configuración de API"**
3. En el campo de texto, pega la URL que copiaste del paso 5 de la Parte 1
4. Haz clic en **"💾 Guardar Configuración"**

### Paso 2: Verificar la Conexión

1. Si todo está correcto, verás:
   - El indicador de estado cambia a "Conectado" (punto verde)
   - Aparece un mensaje: "Conexión establecida correctamente"
   - Se muestra el dashboard con las métricas en 0

✅ ¡Tu CRM está funcionando!

---

## 🎉 Probando el Sistema

### Test 1: Crear un Cliente

1. Haz clic en la pestaña **"👥 Clientes"**
2. Haz clic en **"➕ Nuevo Cliente"**
3. Llena el formulario:
   - Tipo Persona: Jurídica
   - Razón Social: Empresa de Prueba SAS
   - Identificación: 900123456
   - Teléfono: 3001234567
   - Email: contacto@empresa.com
   - Ciudad: Bogotá
   - Asesor: Tu Nombre
4. Haz clic en **"💾 Guardar Cliente"**
5. Deberías ver un mensaje de éxito y el cliente en la tabla

### Test 2: Crear un Producto

1. Haz clic en la pestaña **"📦 Productos"**
2. Haz clic en **"➕ Nuevo Producto"**
3. Llena el formulario:
   - Referencia: PROD-001
   - Descripción: Producto de Prueba
   - Categoría: Test
   - Presentación: Unidad
4. Haz clic en **"💾 Guardar Producto"**

### Test 3: Verificar Google Sheets

1. Ve a tu Google Sheet
2. Revisa las pestañas CLIENTES y PRODUCTOS
3. Deberías ver los datos que acabas de crear

---

## 🔧 Solución de Problemas

### ❌ Error: "No se pudo conectar con el servidor"

**Posibles causas:**
1. La URL de la API no es correcta
   - **Solución**: Verifica que copiaste la URL completa del deployment
2. El script no tiene permisos de "Cualquier persona"
   - **Solución**: Ve a Apps Script → Implementar → Gestionar implementaciones → Editar → Cambiar a "Cualquier persona"
3. Problemas de CORS
   - **Solución**: Asegúrate de estar usando la URL de deployment (.../exec), no la del editor

### ❌ La página no carga en GitHub Pages

**Posibles causas:**
1. El repositorio es privado
   - **Solución**: Ve a Settings → General → Danger Zone → Change visibility → Make public
2. GitHub Pages no está activado
   - **Solución**: Ve a Settings → Pages y configura el source
3. Los archivos no están en la raíz
   - **Solución**: Asegúrate de que index.html esté en la raíz del repositorio

### ❌ Error: "Script function not found"

**Posibles causas:**
1. No se guardó el script correctamente
   - **Solución**: Abre el editor, verifica el código y guarda de nuevo
2. La implementación es antigua
   - **Solución**: Crea una nueva implementación

---

## 🔄 Actualizar el Código

### Actualizar el Backend

1. Edita el archivo `code.gs` en Apps Script
2. Guarda los cambios
3. **Implementar → Gestionar implementaciones**
4. Haz clic en el ícono de lápiz ✏️ de la implementación activa
5. Selecciona **Nueva versión**
6. Haz clic en **Implementar**
7. La URL permanece igual, no necesitas reconfigurar el frontend

### Actualizar el Frontend

#### Opción Web:
1. Ve a tu repositorio en GitHub
2. Haz clic en el archivo que quieres editar
3. Haz clic en el ícono de lápiz ✏️
4. Edita el código
5. Haz clic en **Commit changes**
6. Espera 1-2 minutos y refresca tu página

#### Opción Git:
```bash
# Edita los archivos localmente
git add .
git commit -m "Actualización de funcionalidad X"
git push origin main
```

---

## 📱 Acceder desde Móvil

1. Abre la URL de GitHub Pages en tu navegador móvil
2. La interfaz es completamente responsive
3. Para un acceso más rápido:
   - **iOS**: Safari → Compartir → Agregar a pantalla de inicio
   - **Android**: Chrome → Menú → Agregar a pantalla de inicio

---

## 🎓 Próximos Pasos

Una vez que todo funcione:

1. Personaliza los campos según tu negocio
2. Agrega más validaciones
3. Implementa las mejoras sugeridas en el README.md
4. Crea respaldos periódicos de tu Google Sheet

---

## 🆘 Ayuda Adicional

Si tienes problemas:

1. Revisa la consola del navegador (F12)
2. Revisa los logs en Apps Script (Ejecuciones)
3. Verifica que todos los permisos estén correctos
4. Intenta con otro navegador

---

**¡Felicitaciones! Tu CRM está desplegado y funcionando. 🎉**
