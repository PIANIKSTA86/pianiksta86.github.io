// ============================================
// INICIALIZADOR BASE DE DATOS CRM v2
// Con Inventario Multi-Bodega y Facturación
// ============================================

function inicializarBaseDeDatos() {

  const estructura = {

    PRODUCTOS: [
      "ID","Referencia","Categoria","Descripcion",
      "Formato","Presentacion","CajasPorPallet",
      "PesoPorCaja","UndEmpaque","FichasPorCaja","Costo","Precio1",
      "Precio2","Precio3","CodigoContable","CantidadEnTransito","Estado"
    ],

    CLIENTES: [
      "ID","Nombres","Apellidos","RazonSocial",
      "TipoPersona","TipoIdentificacion","Identificacion","DV",
      "Contacto","NombreComercial","DireccionEntrega",
      "Ciudad","CodigoCiudad","Departamento","CodigoDepartamento",
      "Asesor","Telefono1","Telefono2","CorreoElectronico",
      "CupoCredito","Estado"
    ],

    CONDUCTORES: [
      "ID","NombreConductor","PlacasVehiculo",
      "CedulaConductor","EmpresaTransporte","Celular",
      "PesoMaximoCamion","EmpresaCargueDescargue",
      "Direccion","Barrio","OrigenDestino","Estado"
    ],

    BODEGAS: [
      "ID","Nombre","Ciudad","Direccion","Responsable","Estado"
    ],

    INVENTARIO: [
      "ID","ProductoID","BodegaID","StockActual","StockMinimo"
    ],

    MOVIMIENTOS_INVENTARIO: [
      "ID","Fecha","ProductoID","BodegaOrigen",
      "BodegaDestino","Tipo","Cantidad","Documento","Usuario"
    ],

    PEDIDOS: [
      "ID","Fecha","ClienteID","Asesor",
      "Estado","Subtotal","IVA","Total","TipoPago","FechaContacto",
      "FechaAlistamiento","FechaFacturacion","FechaEntrega","FechaSeguimiento",
      "FechaRecaudo","Prioridad","Notas","ResponsableAlistamiento"
    ],

    PEDIDO_DETALLE: [
      "ID","PedidoID","ProductoID",
      "Cantidad","Precio","Descuento","Total"
    ],

    FACTURAS: [
      "ID","Numero","PedidoID","ClienteID",
      "Fecha","Subtotal","IVA","Total",
      "Estado","Saldo"
    ],

    PAGOS: [
      "ID","FacturaID","Fecha",
      "Valor","Metodo","Referencia"
    ],

    RECAUDOS: [
      "ID","Tipo","FacturaID","ClienteID",
      "Fecha","Valor","Metodo","Referencia","Observaciones"
    ],

    FORMAS_PAGO: [
      "ID","Nombre","Tipo","Estado"
    ],

    ASESORES: [
      "ID","Nombre","Email","Telefono","Estado"
    ],

    CONFIG: [
      "CLAVE","VALOR"
    ]
  };

  const ss = SpreadsheetApp.getActive();

  Object.keys(estructura).forEach(nombreHoja => {

    let hoja = ss.getSheetByName(nombreHoja);

    if (!hoja) {
      hoja = ss.insertSheet(nombreHoja);
    } else {
      hoja.clear();
    }

    hoja.getRange(1,1,1,estructura[nombreHoja].length)
        .setValues([estructura[nombreHoja]]);

    hoja.setFrozenRows(1);
  });

  // Configuración inicial
  const config = [
    ["VERSION","3.0"],
    ["EMPRESA","MI EMPRESA SAS"],
    ["MONEDA","COP"],
    ["IVA_DEFECTO","19"],
    ["FAC_CONSEC","0"],
    ["PED_CONSEC","0"],
    ["MOV_CONSEC","0"],
    ["CLI_CONSEC","0"],
    ["PROD_CONSEC","0"],
    ["BOD_CONSEC","0"],
    ["COND_CONSEC","0"],
    ["REC_CONSEC","0"],
    ["FP_CONSEC","0"],
    ["ASE_CONSEC","0"]
  ];

  ss.getSheetByName("CONFIG")
    .getRange(2,1,config.length,2)
    .setValues(config);

  return "✅ Base de datos CRM adaptada a estructura Excel actual.";
}


const DB = {
  CLIENTES: "CLIENTES",
  PRODUCTOS: "PRODUCTOS",
  BODEGAS: "BODEGAS",
  PEDIDOS: "PEDIDOS",
  PEDIDO_DETALLE: "PEDIDO_DETALLE",
  MOVIMIENTOS: "MOVIMIENTOS_INVENTARIO",
  FACTURAS: "FACTURAS",
  PAGOS: "PAGOS",
  RECAUDOS: "RECAUDOS",
  FORMAS_PAGO: "FORMAS_PAGO",
  ASESORES: "ASESORES"
};

// ========= UTILIDAD =========
function getSheet(name){
  return SpreadsheetApp.getActive().getSheetByName(name);
}

function getData(name){
  const sheet = getSheet(name);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  return data.map(r => {
    let obj = {};
    headers.forEach((h,i)=> obj[h] = r[i]);
    return obj;
  });
}

function insertRow(sheetName, obj){
  const sheet = getSheet(sheetName);
  const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  const row = headers.map(h => obj[h] || "");
  sheet.appendRow(row);
}

// ========= CLIENTES =========
function crearCliente(data){
  data.ID = "CLI-" + Date.now();
  data.Estado = "ACTIVO";
  insertRow(DB.CLIENTES, data);
  return data;
}

// ========= PEDIDOS =========
function crearPedido(data){
  const consecutivo = generarConsecutivo("PED_CONSEC");
  data.ID = "PED-" + consecutivo;
  data.Estado = data.Estado || "PEDIDO";
  data.Fecha = data.Fecha || new Date();
  data.FechaContacto = new Date();
  data.Prioridad = data.Prioridad || "MEDIA";
  insertRow(DB.PEDIDOS, data);
  return data;
}

// ========= CONFIRMAR PEDIDO =========
function confirmarPedido(pedidoID){

  const productos = getData(DB.PRODUCTOS);
  const detalles = getData(DB.PEDIDO_DETALLE);
  const pedidos = getData(DB.PEDIDOS);

  const pedido = pedidos.find(p=>p.ID==pedidoID);
  const items = detalles.filter(d=>d.PedidoID==pedidoID);

  items.forEach(item=>{
    const prod = productos.find(p=>p.ID==item.ProductoID);
    if(prod.StockActual < item.Cantidad){
      throw new Error("Stock insuficiente: " + prod.Descripcion);
    }

    // Descontar stock
    prod.StockActual -= item.Cantidad;
  });

  actualizarEstadoPedido(pedidoID,"CONFIRMADO");

  return "Pedido confirmado";
}

function actualizarEstadoPedido(id, estado){
  const sheet = getSheet(DB.PEDIDOS);
  const data = sheet.getDataRange().getValues();

  for(let i=1;i<data.length;i++){
    if(data[i][0]==id){
      sheet.getRange(i+1,5).setValue(estado);
      break;
    }
  }
}

// ========= API REST =========
function doGet(e){
  // Si no hay parámetros, retornar la interfaz HTML
  if(!e || !e.parameter || !e.parameter.action){
    return HtmlService.createHtmlOutputFromFile("index");
  }
  
  // API REST
  return handleRequest(e);
}

function doPost(e){
  return handleRequest(e);
}

function handleRequest(e){
  
  try {
    const action = e.parameter.action;
    const params = JSON.parse(e.parameter.data || e.postData?.contents || "{}");
    
    let result;
    
    switch(action){
      
      // CLIENTES
      case "listarClientes":
        result = getData("CLIENTES");
        break;
      
      case "crearCliente":
        result = crearCliente(params);
        break;
      
      case "buscarCliente":
        const clientes = getData("CLIENTES");
        result = clientes.find(c => c.ID === params.id || c.Identificacion === params.identificacion);
        break;
      
      // PRODUCTOS
      case "listarProductos":
        result = getData("PRODUCTOS");
        break;
      
      case "crearProducto":
        result = crearProducto(params);
        break;
      
      // PEDIDOS
      case "listarPedidos":
        result = getData("PEDIDOS");
        break;
      
      case "crearPedido":
        result = crearPedido(params);
        break;
      
      case "confirmarPedido":
        result = confirmarPedido(params.pedidoID);
        break;
      
      // DETALLE PEDIDOS
      case "agregarDetallePedido":
        result = agregarDetallePedido(params);
        break;
      
      // INVENTARIO
      case "listarInventario":
        result = getData("INVENTARIO");
        break;
      
      case "registrarMovimiento":
        result = registrarMovimiento(params);
        break;
      
      // FACTURAS
      case "listarFacturas":
        result = getData("FACTURAS");
        break;
      
      case "generarFactura":
        result = generarFactura(params.pedidoID);
        break;
      
      case "registrarPago":
        result = registrarPago(params.facturaID, params.valor);
        break;
      
      // CONDUCTORES
      case "listarConductores":
        result = getData("CONDUCTORES");
        break;
      
      case "crearConductor":
        result = crearConductor(params);
        break;
      
      // BODEGAS
      case "listarBodegas":
        result = getData("BODEGAS");
        break;

      case "crearBodega":
        result = crearBodega(params);
        break;
      
      // DASHBOARD
      case "getDashboard":
        result = getDashboard();
        break;
      
      // PIPELINE
      case "getPipeline":
        result = getPipeline();
        break;
      
      case "cambiarEstadoPedido":
        result = cambiarEstadoPedido(params.pedidoID, params.nuevoEstado, params.datos);
        break;
      
      case "obtenerPedido":
        const pedidos = getData("PEDIDOS");
        result = pedidos.find(p => p.ID === params.pedidoID);
        break;

      // RECAUDOS
      case "listarRecaudos":
        result = listarRecaudos();
        break;

      case "crearRecaudo":
        if ((params.Tipo === "ABONO" || params.Tipo === "PAGO_FACTURA") && !params.FacturaID) {
          throw new Error("Factura requerida para abonos o pagos");
        }
        result = crearRecaudo(params);
        break;

      // FORMAS DE PAGO
      case "listarFormasPago":
        result = listarFormasPago();
        break;

      case "crearFormaPago":
        result = crearFormaPago(params);
        break;

      // ASESORES
      case "listarAsesores":
        result = listarAsesores();
        break;

      case "crearAsesor":
        result = crearAsesor(params);
        break;
      
      default:
        return respuestaJSON({error: "Acción no válida"}, 400);
    }
    
    return respuestaJSON({success: true, data: result});
    
  } catch(error) {
    return respuestaJSON({success: false, error: error.toString()}, 500);
  }
}

function respuestaJSON(data, code = 200){
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function agregarDetallePedido(data){
  data.ID = "DET-" + Date.now();
  insertRow("PEDIDO_DETALLE", data);
  return data;
}

function getDashboard(){
  const pedidos = getData("PEDIDOS");
  const facturas = getData("FACTURAS");
  
  const totalPedidos = pedidos.length || 1;
  const entregados = pedidos.filter(p => p.Estado === "ENTREGADO").length;
  const enSeguimiento = pedidos.filter(p => p.Estado === "SEGUIMIENTO").length;
  const recaudados = pedidos.filter(p => p.Estado === "RECAUDADO").length;

  const asesorMap = {};
  pedidos.forEach(p => {
    const key = p.Asesor || "Sin asignar";
    const total = Number(p.Total) || 0;
    asesorMap[key] = (asesorMap[key] || 0) + total;
  });

  const asesoresForecast = Object.keys(asesorMap)
    .map(key => ({ label: key, total: asesorMap[key] }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 4);

  const monthLabels = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const hoy = new Date();
  const trimestre = Math.floor(hoy.getMonth() / 3);
  const mesInicio = trimestre * 3;
  const quarterForecast = [0, 1, 2].map(offset => {
    const mes = mesInicio + offset;
    const total = facturas
      .filter(f => {
        const fecha = new Date(f.Fecha);
        return fecha.getFullYear() === hoy.getFullYear() && fecha.getMonth() === mes;
      })
      .reduce((sum, f) => sum + (Number(f.Total) || 0), 0);
    return { label: monthLabels[mes], total: total };
  });

  const gaugePercent = Math.round(((entregados + recaudados) / totalPedidos) * 100);
  const donutReason = [
    { label: "Precio", value: pedidos.filter(p => p.Estado === "PEDIDO").length },
    { label: "Solucion", value: pedidos.filter(p => p.Estado === "ALISTAMIENTO").length },
    { label: "Desempeno", value: pedidos.filter(p => p.Estado === "FACTURADO").length }
  ];
  const donutSource = [
    { label: "Sitio web", value: entregados },
    { label: "Prospeccion", value: enSeguimiento },
    { label: "Comprado", value: recaudados }
  ];
  
  return {
    totalClientes: getData("CLIENTES").length,
    totalProductos: getData("PRODUCTOS").length,
    pedidosPendientes: pedidos.filter(p => ["PEDIDO","ALISTAMIENTO"].includes(p.Estado)).length,
    facturasPendientes: facturas.filter(f => f.Estado === "EMITIDA").length,
    enPedido: pedidos.filter(p => p.Estado === "PEDIDO").length,
    enAlistamiento: pedidos.filter(p => p.Estado === "ALISTAMIENTO").length,
    facturados: pedidos.filter(p => p.Estado === "FACTURADO").length,
    entregados: entregados,
    enSeguimiento: enSeguimiento,
    recaudados: recaudados,
    totalVentas: facturas.reduce((sum, f) => sum + (Number(f.Total) || 0), 0),
    ventasMes: facturas.filter(f => {
      const fechaFactura = new Date(f.Fecha);
      return fechaFactura.getMonth() === hoy.getMonth() && fechaFactura.getFullYear() === hoy.getFullYear();
    }).reduce((sum, f) => sum + (Number(f.Total) || 0), 0),
    asesoresForecast: asesoresForecast,
    quarterForecast: quarterForecast,
    gaugePercent: gaugePercent,
    donutReason: donutReason,
    donutSource: donutSource
  };
}




function generarConsecutivo(clave){

  const sheet = getSheet("CONFIG");
  const data = sheet.getDataRange().getValues();

  for(let i=1;i<data.length;i++){
    if(data[i][0] === clave){
      const nuevo = Number(data[i][1]) + 1;
      sheet.getRange(i+1,2).setValue(nuevo);
      return nuevo;
    }
  }

  sheet.appendRow([clave,1]);
  return 1;
}

function crearCliente(data){

  const consecutivo = generarConsecutivo("CLI_CONSEC");

  data.ID = "CLI-" + consecutivo;
  data.Estado = data.Estado || "ACTIVO";

  insertRow("CLIENTES", data);

  return data;
}
function crearProducto(data){

  const consecutivo = generarConsecutivo("PROD_CONSEC");

  data.ID = "PROD-" + consecutivo;
  data.Estado = data.Estado || "ACTIVO";
  data.CantidadEnTransito = data.CantidadEnTransito || 0;

  insertRow("PRODUCTOS", data);

  return data;
}


function crearConductor(data){

  const consecutivo = generarConsecutivo("COND_CONSEC");

  data.ID = "COND-" + consecutivo;
  data.Estado = data.Estado || "ACTIVO";

  insertRow("CONDUCTORES", data);

  return data;
}

function crearBodega(data){

  const consecutivo = generarConsecutivo("BOD_CONSEC");

  data.ID = "BOD-" + consecutivo;
  data.Estado = data.Estado || "ACTIVO";

  insertRow("BODEGAS", data);

  return data;
}

// ========= ASESORES =========
function listarAsesores(){
  return getData("ASESORES");
}

function crearAsesor(data){
  const consecutivo = generarConsecutivo("ASE_CONSEC");
  const asesor = {
    ID: "ASE-" + consecutivo,
    Nombre: data.Nombre,
    Email: data.Email || "",
    Telefono: data.Telefono || "",
    Estado: data.Estado || "ACTIVO"
  };

  insertRow("ASESORES", asesor);
  return asesor;
}



function getInventario(productoID, bodegaID){

  const sheet = getSheet("INVENTARIO");
  const data = sheet.getDataRange().getValues();

  for(let i=1;i<data.length;i++){
    if(data[i][1] === productoID && data[i][2] === bodegaID){
      return {
        row: i+1,
        stock: Number(data[i][3])
      };
    }
  }

  return null;
}
function actualizarStock(productoID, bodegaID, cantidad){

  const inventario = getInventario(productoID, bodegaID);
  const sheet = getSheet("INVENTARIO");

  if(!inventario){

    const consecutivo = generarConsecutivo("INV_CONSEC");

    sheet.appendRow([
      "INV-"+consecutivo,
      productoID,
      bodegaID,
      cantidad,
      0
    ]);

  } else {

    const nuevoStock = inventario.stock + Number(cantidad);

    if(nuevoStock < 0){
      throw new Error("❌ Stock insuficiente en bodega");
    }

    sheet.getRange(inventario.row,4).setValue(nuevoStock);
  }
}


function registrarMovimiento(data){

  const consecutivo = generarConsecutivo("MOV_CONSEC");

  const movimiento = {
    ID: "MOV-"+consecutivo,
    Fecha: new Date(),
    ProductoID: data.ProductoID,
    BodegaOrigen: data.BodegaOrigen || "",
    BodegaDestino: data.BodegaDestino || "",
    Tipo: data.Tipo,
    Cantidad: data.Cantidad,
    Documento: data.Documento || "",
    Usuario: data.Usuario || ""
  };

  insertRow("MOVIMIENTOS_INVENTARIO", movimiento);

  if(data.Tipo === "ENTRADA"){
    actualizarStock(data.ProductoID, data.BodegaDestino, data.Cantidad);
  }

  if(data.Tipo === "SALIDA"){
    actualizarStock(data.ProductoID, data.BodegaOrigen, -data.Cantidad);
  }

  if(data.Tipo === "TRASLADO"){
    actualizarStock(data.ProductoID, data.BodegaOrigen, -data.Cantidad);
    actualizarStock(data.ProductoID, data.BodegaDestino, data.Cantidad);
  }

  return "Movimiento registrado correctamente";
}



function generarFactura(pedidoID){

  const pedidos = getData("PEDIDOS");
  const pedido = pedidos.find(p => p.ID === pedidoID);

  if(!pedido) throw new Error("Pedido no encontrado");

  const consecutivo = generarConsecutivo("FAC_CONSEC");
  const numeroFactura = "FAC-"+consecutivo;

  const factura = {
    ID: numeroFactura,
    Numero: numeroFactura,
    PedidoID: pedidoID,
    ClienteID: pedido.ClienteID,
    Fecha: new Date(),
    Subtotal: pedido.Subtotal,
    IVA: pedido.IVA,
    Total: pedido.Total,
    Estado: "EMITIDA",
    Saldo: pedido.Total
  };

  insertRow("FACTURAS", factura);

  actualizarEstadoPedido(pedidoID,"FACTURADO");

  return factura;
}


function registrarPago(facturaID, valor){

  const sheet = getSheet("FACTURAS");
  const data = sheet.getDataRange().getValues();

  for(let i=1;i<data.length;i++){

    if(data[i][0] === facturaID){

      const saldoActual = Number(data[i][9]);
      const nuevoSaldo = saldoActual - Number(valor);

      sheet.getRange(i+1,10).setValue(nuevoSaldo);

      if(nuevoSaldo <= 0){
        sheet.getRange(i+1,9).setValue("PAGADA");
        // Actualizar estado del pedido a RECAUDADO
        const pedidoID = data[i][2];
        cambiarEstadoPedido(pedidoID, "RECAUDADO", {FechaRecaudo: new Date()});
      } else {
        sheet.getRange(i+1,9).setValue("PARCIAL");
      }

      return "Pago aplicado correctamente";
    }
  }

  throw new Error("Factura no encontrada");
}

// ========= RECAUDOS =========
function listarRecaudos(){
  return getData("RECAUDOS");
}

function crearRecaudo(data){
  const consecutivo = generarConsecutivo("REC_CONSEC");
  const recaudo = {
    ID: "REC-" + consecutivo,
    Tipo: data.Tipo || "ABONO",
    FacturaID: data.FacturaID || "",
    ClienteID: data.ClienteID || "",
    Fecha: new Date(),
    Valor: Number(data.Valor) || 0,
    Metodo: data.Metodo || "",
    Referencia: data.Referencia || "",
    Observaciones: data.Observaciones || ""
  };

  insertRow("RECAUDOS", recaudo);

  if (recaudo.FacturaID && (recaudo.Tipo === "ABONO" || recaudo.Tipo === "PAGO_FACTURA")) {
    registrarPago(recaudo.FacturaID, recaudo.Valor);
  }

  return recaudo;
}

// ========= FORMAS DE PAGO =========
function listarFormasPago(){
  return getData("FORMAS_PAGO");
}

function crearFormaPago(data){
  const consecutivo = generarConsecutivo("FP_CONSEC");
  const forma = {
    ID: "FP-" + consecutivo,
    Nombre: data.Nombre,
    Tipo: data.Tipo || "FORMA",
    Estado: data.Estado || "ACTIVO"
  };

  insertRow("FORMAS_PAGO", forma);
  return forma;
}

// ========= PIPELINE DE VENTAS =========
function getPipeline(){
  const pedidos = getData("PEDIDOS");
  
  const pipeline = {
    PEDIDO: pedidos.filter(p => p.Estado === "PEDIDO"),
    ALISTAMIENTO: pedidos.filter(p => p.Estado === "ALISTAMIENTO"),
    FACTURADO: pedidos.filter(p => p.Estado === "FACTURADO"),
    ENTREGADO: pedidos.filter(p => p.Estado === "ENTREGADO"),
    SEGUIMIENTO: pedidos.filter(p => p.Estado === "SEGUIMIENTO"),
    RECAUDADO: pedidos.filter(p => p.Estado === "RECAUDADO")
  };
  
  return pipeline;
}

function cambiarEstadoPedido(pedidoID, nuevoEstado, datos){
  const sheet = getSheet("PEDIDOS");
  const dataSheet = sheet.getDataRange().getValues();
  const headers = dataSheet[0];
  
  // Buscar índices de columnas
  const estadoCol = headers.indexOf("Estado") + 1;
  const fechaAlistamientoCol = headers.indexOf("FechaAlistamiento") + 1;
  const fechaFacturacionCol = headers.indexOf("FechaFacturacion") + 1;
  const fechaEntregaCol = headers.indexOf("FechaEntrega") + 1;
  const fechaSeguimientoCol = headers.indexOf("FechaSeguimiento") + 1;
  const fechaRecaudoCol = headers.indexOf("FechaRecaudo") + 1;
  const responsableCol = headers.indexOf("ResponsableAlistamiento") + 1;
  const notasCol = headers.indexOf("Notas") + 1;
  
  for(let i=1; i<dataSheet.length; i++){
    if(dataSheet[i][0] === pedidoID){
      const row = i + 1;
      
      // Actualizar estado
      sheet.getRange(row, estadoCol).setValue(nuevoEstado);
      
      // Actualizar fechas según el estado
      if(nuevoEstado === "ALISTAMIENTO" && fechaAlistamientoCol > 0){
        sheet.getRange(row, fechaAlistamientoCol).setValue(new Date());
        if(datos && datos.Responsable && responsableCol > 0){
          sheet.getRange(row, responsableCol).setValue(datos.Responsable);
        }
      }
      
      if(nuevoEstado === "FACTURADO" && fechaFacturacionCol > 0){
        sheet.getRange(row, fechaFacturacionCol).setValue(new Date());
      }
      
      if(nuevoEstado === "ENTREGADO" && fechaEntregaCol > 0){
        sheet.getRange(row, fechaEntregaCol).setValue(new Date());
      }
      
      if(nuevoEstado === "SEGUIMIENTO" && fechaSeguimientoCol > 0){
        sheet.getRange(row, fechaSeguimientoCol).setValue(new Date());
      }
      
      if(nuevoEstado === "RECAUDADO" && fechaRecaudoCol > 0){
        sheet.getRange(row, fechaRecaudoCol).setValue(datos?.FechaRecaudo || new Date());
      }
      
      // Actualizar notas si se proporcionan
      if(datos && datos.Notas && notasCol > 0){
        const notasActuales = dataSheet[i][notasCol-1] || "";
        const nuevasNotas = notasActuales + "\n[" + new Date().toLocaleString() + "] " + datos.Notas;
        sheet.getRange(row, notasCol).setValue(nuevasNotas);
      }
      
      return {success: true, mensaje: "Estado actualizado a " + nuevoEstado};
    }
  }
  
  throw new Error("Pedido no encontrado");
}


