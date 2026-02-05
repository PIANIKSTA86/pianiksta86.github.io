/**
 * CONFIGURACIÓN DEL PROYECTO GILSA
 * 
 * Reemplaza APP_SCRIPT_URL con tu URL de Google Apps Script
 * Ejemplo: https://script.google.com/macros/d/SCRIPT_ID/userweb
 */

const CONFIG = {
  // URL del webhook de Google Apps Script (REEMPLAZA ESTO)
  API_URL: 'https://script.google.com/macros/s/AKfycbyBhqyr0PAFU7lTP1b9akKewtzc6sUBVSLKkdOuXNF8-i5Ytsh0h7QNuGHzB0jVMtCb9A/exec',
  
  // Configuración de reintentos
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // ms
  
  // Configuración de timeouts
  REQUEST_TIMEOUT: 15000, // ms
  
  // Modo desarrollo (console logs extra)
  DEBUG: true
};

/**
 * Valida que la configuración esté lista
 */
function validateConfig() {
  if (CONFIG.API_URL.includes('AKfycbyBhqyr0PAFU7lTP1b9akKewtzc6sUBVSLKkdOuXNF8-i5Ytsh0h7QNuGHzB0jVMtCb9A')) {
    console.error('❌ ERROR: Debes configurar API_URL en js/config.js');
    alert('⚠️ ERROR DE CONFIGURACIÓN:\n\nDebes reemplazar YOUR_SCRIPT_ID con tu Script ID de Google Apps Script.\n\nMira el archivo js/config.js para más detalles.');
    throw new Error('API_URL not configured');
  }
  return true;
}

// Validar al cargar
try {
  validateConfig();
} catch (e) {
  console.error(e);
}
