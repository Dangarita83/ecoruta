// =====================================================================
//  EcoRuta - Base de datos de la aplicación (en el navegador)
//  Reemplaza a MongoDB Atlas en este prototipo: parte de los datos de
//  02_ECORUTA_DATOS.js (SEMILLA), guarda los cambios en el localStorage
//  del navegador y aplica las mismas reglas de 01_ECORUTA_OBJETOS.js:
//  valores permitidos, índices únicos y registro en auditoria.
// =====================================================================

const CLAVE_DB = "ecoruta-db-v2";
const CLAVE_SESION = "ecoruta-sesion-v2";

// Restricciones de dominio (iguales a las de 01_ECORUTA_OBJETOS.js)
const MUNICIPIOS = ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta"];
const ZONAS = ["Norte", "Sur", "Oriente", "Occidente", "Centro"];
const TIPOS_RES = ["aprovechable", "no_aprovechable", "organico"];
const DIAS = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
const ESTADOS = ["reportado", "en_revision", "en_proceso", "resuelto", "rechazado"];
const FLUJO = ["reportado", "en_revision", "en_proceso", "resuelto"]; // RF10: solo avanzar al siguiente
const TIPOS_NOVEDAD = ["ruta_incumplida", "acumulacion_residuos", "punto_critico", "contenedor_danado", "otra"];
const PUNTOS = { alta: 15, media: 10, baja: 5 };                          // EcoPuntos por reporte resuelto
const CONTRASENA_DEMO = "EcoRuta2026*";                                   // la de 02_ECORUTA_DATOS.js
const RE_CORREO = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const RE_HORA = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
const RE_NIT = /^[0-9]{9}-[0-9]$/;

// Copia profunda que conserva las fechas como Date
function clonar(v) {
  if (v instanceof Date) return new Date(v);
  if (Array.isArray(v)) return v.map(clonar);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, clonar(x)]));
  return v;
}
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
const revivir = (_, v) => (typeof v === "string" && ISO.test(v) ? new Date(v) : v);

function cargarDB() {
  try {
    const guardada = localStorage.getItem(CLAVE_DB);
    if (guardada) return JSON.parse(guardada, revivir);
  } catch (e) { /* almacenamiento no disponible: se usa la semilla */ }
  return clonar(SEMILLA);
}

let DB = cargarDB();

function guardarDB() {
  try { localStorage.setItem(CLAVE_DB, JSON.stringify(DB)); } catch (e) { /* sin almacenamiento */ }
}

function reiniciarDB() {
  DB = clonar(SEMILLA);
  guardarDB();
}

// ObjectId: 4 bytes de tiempo + 8 aleatorios, en hexadecimal (24 caracteres)
function nuevoId() {
  const t = Math.floor(Date.now() / 1000).toString(16).padStart(8, "0");
  let r = "";
  for (let i = 0; i < 16; i++) r += Math.floor(Math.random() * 16).toString(16);
  return t + r;
}

const buscar = (col, id) => DB[col].find((d) => d._id === id) || null;

class ErrorValidacion extends Error {}
function exigir(condicion, mensaje) { if (!condicion) throw new ErrorValidacion(mensaje); }

// auditoria: quién cambió qué y cuándo (RN08)
function auditar(coleccion, id_documento, accion, valor_anterior, valor_nuevo, id_usuario) {
  DB.auditoria.push({ _id: nuevoId(), coleccion, id_documento, accion, valor_anterior, valor_nuevo, id_usuario, fecha: new Date() });
}

// Contraseñas: las cuentas de 02_ECORUTA_DATOS.js tienen hash bcrypt y usan la
// contraseña de prueba. Las cuentas nuevas guardan un hash SHA-256 calculado en
// el navegador (en la API real se usaría bcrypt).
async function sha256(texto) {
  if (window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  let h = 0; for (const c of texto) h = (h * 31 + c.charCodeAt(0)) | 0; return "x" + h; // respaldo sin crypto
}
async function verificarContrasena(usuario, contrasena) {
  if (usuario.contrasena_hash.startsWith("$2b$")) return contrasena === CONTRASENA_DEMO;
  return usuario.contrasena_hash === "sha256:" + (await sha256(contrasena));
}

// ---------------------------------------------------------------------
// Operaciones (cada una valida como lo haría el $jsonSchema o la API)
// ---------------------------------------------------------------------
const OPS = {
  async iniciarSesion(correo, contrasena) {
    const u = DB.usuarios.find((x) => x.correo.toLowerCase() === correo.trim().toLowerCase());
    exigir(u && (await verificarContrasena(u, contrasena)), "Correo o contraseña incorrectos.");
    exigir(u.activo, "La cuenta está desactivada. Comunícate con el administrador.");
    return u;
  },

  async registrarCiudadano({ nombres, apellidos, correo, contrasena, telefono, id_sector }) {
    exigir(nombres.trim() && apellidos.trim(), "Escribe tus nombres y apellidos.");
    exigir(RE_CORREO.test(correo.trim()), "El correo no tiene un formato válido.");
    exigir(!DB.usuarios.some((u) => u.correo.toLowerCase() === correo.trim().toLowerCase()), "Ya existe una cuenta con ese correo.");
    exigir(contrasena.length >= 8, "La contraseña debe tener mínimo 8 caracteres.");
    const u = {
      _id: nuevoId(), nombres: nombres.trim().slice(0, 60), apellidos: apellidos.trim().slice(0, 60),
      correo: correo.trim().toLowerCase(), contrasena_hash: "sha256:" + (await sha256(contrasena)),
      telefono: telefono.trim().slice(0, 15), rol: "ciudadano", eco_puntos: 0, fecha_registro: new Date(), activo: true
    };
    if (id_sector) u.id_sector = id_sector;
    DB.usuarios.push(u); guardarDB();
    return u;
  },

  // La empresa del reporte es la que opera la ruta de no aprovechables del sector (o cualquier ruta activa)
  empresaDelSector(id_sector) {
    const rutas = DB.rutas.filter((r) => r.activa && r.sectores.includes(id_sector));
    const ruta = rutas.find((r) => r.tipo_residuo === "no_aprovechable") || rutas[0];
    return ruta ? buscar("empresas", ruta.id_empresa) : null;
  },

  crearReporte(usuario, { id_sector, tipo_novedad, descripcion, prioridad, ubicacion, url_foto, comentario }) {
    exigir(usuario && usuario.rol === "ciudadano", "Solo los ciudadanos registrados pueden reportar.");
    exigir(buscar("sectores", id_sector), "Elige el sector donde ocurre la novedad.");
    exigir(TIPOS_NOVEDAD.includes(tipo_novedad), "Elige el tipo de novedad.");
    exigir(descripcion.trim().length >= 5, "Describe la novedad (mínimo 5 caracteres).");
    exigir(descripcion.length <= 500, "La descripción admite máximo 500 caracteres.");
    exigir(["alta", "media", "baja"].includes(prioridad), "Elige la prioridad.");
    const empresa = OPS.empresaDelSector(id_sector);
    exigir(empresa, "Este sector todavía no tiene una ruta ni una empresa asignada, así que el reporte no se puede enviar.");
    const ahora = new Date();
    const r = { _id: nuevoId(), id_usuario: usuario._id, id_sector, id_empresa: empresa._id, tipo_novedad,
      descripcion: descripcion.trim(), fecha_hora: ahora, prioridad, estado: "reportado",
      historial_estados: [{ estado: "reportado", fecha_cambio: ahora }] };
    if (ubicacion) r.ubicacion = { type: "Point", coordinates: ubicacion };
    if (url_foto || comentario) r.evidencia = {};
    if (url_foto) r.evidencia.url_foto = url_foto;
    if (comentario) r.evidencia.comentario = comentario.trim().slice(0, 300);
    DB.reportes.push(r);
    auditar("reportes", r._id, "INSERT", null, { estado: "reportado" }, usuario._id);
    guardarDB();
    return r;
  },

  // El ciudadano puede retirar su reporte mientras siga en estado "reportado"
  eliminarReporte(usuario, id) {
    const r = buscar("reportes", id);
    exigir(r && r.id_usuario === usuario._id, "Reporte no encontrado.");
    exigir(r.estado === "reportado", "Solo se puede retirar un reporte que todavía no está en revisión.");
    DB.reportes = DB.reportes.filter((x) => x._id !== id);
    auditar("reportes", id, "DELETE", { estado: r.estado, descripcion: r.descripcion }, null, usuario._id);
    guardarDB();
  },

  siguienteEstado(estado) {
    const i = FLUJO.indexOf(estado);
    return i >= 0 && i < FLUJO.length - 1 ? FLUJO[i + 1] : null;
  },

  // RF10/RF11: el operador solo ve su empresa y solo avanza al estado siguiente.
  // Puede rechazar un reporte mientras esté en "reportado" o "en_revision".
  cambiarEstado(usuario, id, nuevo) {
    const r = buscar("reportes", id);
    exigir(r, "Reporte no encontrado.");
    exigir(usuario.rol === "administrador" || (usuario.rol === "operador" && r.id_empresa === usuario.id_empresa), "Este reporte no pertenece a tu empresa.");
    const permitido = nuevo === OPS.siguienteEstado(r.estado) || (nuevo === "rechazado" && ["reportado", "en_revision"].includes(r.estado));
    exigir(permitido, "Ese cambio de estado no está permitido: el reporte solo puede avanzar al estado siguiente.");
    const anterior = r.estado, ahora = new Date();
    r.estado = nuevo;
    r.historial_estados.push({ estado: nuevo, fecha_cambio: ahora });
    let puntos = 0;
    if (nuevo === "resuelto") {                       // atributo calculado: eco_puntos
      const ciudadano = buscar("usuarios", r.id_usuario);
      puntos = PUNTOS[r.prioridad] || 0;
      if (ciudadano) ciudadano.eco_puntos += puntos;
    }
    auditar("reportes", r._id, "UPDATE", { estado: anterior }, { estado: nuevo }, usuario._id);
    guardarDB();
    return puntos;
  },

  // RF13: pesaje con las rutas de la empresa del operador, kilos > 0 y sin fechas futuras
  registrarPesaje(usuario, { id_ruta, fecha, cantidad_kg, observaciones }) {
    const ruta = buscar("rutas", id_ruta);
    exigir(ruta, "Elige la ruta.");
    exigir(usuario.rol === "administrador" || ruta.id_empresa === usuario.id_empresa, "Solo puedes registrar pesajes de las rutas de tu empresa.");
    exigir(/^\d{4}-\d{2}-\d{2}$/.test(fecha), "Elige la fecha de la recolección.");
    const f = new Date(`${fecha}T12:00:00-05:00`);
    exigir(fecha <= hoyLocal(), "La fecha no puede ser futura.");
    const kg = Number(cantidad_kg);
    exigir(Number.isFinite(kg) && kg > 0, "Los kilos deben ser mayores que 0.");
    exigir(kg <= 60000, "Revisa la cantidad: un camión no recoge más de 60.000 kg en una ruta.");
    const reg = { _id: nuevoId(), fecha: f, id_ruta, id_empresa: ruta.id_empresa, zona: ruta.zona,
      tipo_residuo: ruta.tipo_residuo, cantidad_kg: kg, registrado_por: usuario._id };   // referencia extendida
    if (observaciones && observaciones.trim()) reg.observaciones = observaciones.trim().slice(0, 300);
    DB.registros_residuos.push(reg);
    auditar("registros_residuos", reg._id, "INSERT", null, { cantidad_kg: kg, tipo_residuo: ruta.tipo_residuo }, usuario._id);
    guardarDB();
    return reg;
  },

  crearEmpresa({ nit, nombre, municipios, telefono, correo, canal_pqr }) {
    exigir(RE_NIT.test(nit.trim()), "El NIT debe tener 9 dígitos, guion y dígito de verificación (ej. 900123456-7).");
    exigir(!DB.empresas.some((e) => e.nit === nit.trim()), "Ya existe una empresa con ese NIT (índice único).");
    exigir(nombre.trim(), "Escribe la razón social.");
    exigir(municipios.length >= 1, "Elige al menos un municipio.");
    exigir(!correo.trim() || RE_CORREO.test(correo.trim()), "El correo no tiene un formato válido.");
    const e = { _id: nuevoId(), nit: nit.trim(), nombre: nombre.trim().slice(0, 100), municipios,
      telefono: telefono.trim().slice(0, 15), correo: correo.trim(), canal_pqr: canal_pqr.trim().slice(0, 150), activa: true, fecha_registro: new Date() };
    DB.empresas.push(e); guardarDB(); return e;
  },

  crearSector({ nombre, municipio, zona, lng, lat }) {
    exigir(nombre.trim(), "Escribe el nombre del sector.");
    exigir(MUNICIPIOS.includes(municipio) && ZONAS.includes(zona), "Elige el municipio y la zona.");
    exigir(!DB.sectores.some((s) => s.municipio === municipio && s.nombre.toLowerCase() === nombre.trim().toLowerCase()), "Ese sector ya existe en el municipio (índice único municipio + nombre).");
    const x = Number(lng), y = Number(lat);
    exigir(x >= -180 && x <= 180 && y >= -90 && y <= 90 && lng !== "" && lat !== "", "Revisa la longitud y la latitud.");
    const s = { _id: nuevoId(), nombre: nombre.trim().slice(0, 80), municipio, zona, ubicacion: { type: "Point", coordinates: [x, y] } };
    DB.sectores.push(s); guardarDB(); return s;
  },

  crearRuta({ codigo, id_empresa, sectores, zona, tipo_residuo, dias, hora_inicio, hora_fin }) {
    exigir(codigo.trim() && codigo.trim().length <= 10, "El código es obligatorio (máximo 10 caracteres).");
    exigir(!DB.rutas.some((r) => r.codigo.toUpperCase() === codigo.trim().toUpperCase()), "Ya existe una ruta con ese código (índice único).");
    exigir(buscar("empresas", id_empresa), "Elige la empresa.");
    exigir(sectores.length >= 1, "Elige al menos un sector.");
    exigir(ZONAS.includes(zona) && TIPOS_RES.includes(tipo_residuo), "Elige la zona y el tipo de residuo.");
    exigir(dias.length >= 1, "Elige al menos un día.");
    exigir(RE_HORA.test(hora_inicio) && RE_HORA.test(hora_fin) && hora_inicio < hora_fin, "Revisa el horario: la hora de fin debe ser posterior a la de inicio.");
    const r = { _id: nuevoId(), codigo: codigo.trim().toUpperCase(), id_empresa, sectores, zona, tipo_residuo,
      horarios: dias.map((dia) => ({ dia, hora_inicio, hora_fin })), origen_dato: "ejemplo", activa: true };
    DB.rutas.push(r); guardarDB(); return r;
  },

  alternar(col, id, campo) {
    const d = buscar(col, id); if (!d) return;
    d[campo] = !d[campo]; guardarDB();
  },

  actualizarUsuario(admin, id, { rol, id_empresa, activo }) {
    const u = buscar("usuarios", id);
    exigir(u, "Usuario no encontrado.");
    exigir(!(u._id === admin._id && (rol !== "administrador" || !activo)), "No puedes quitarte el rol de administrador ni desactivar tu propia cuenta.");
    exigir(["administrador", "operador", "ciudadano"].includes(rol), "Rol no válido.");
    exigir(rol !== "operador" || buscar("empresas", id_empresa), "Un operador debe estar asociado a una empresa.");
    u.rol = rol; u.activo = activo;
    if (rol === "operador") u.id_empresa = id_empresa; else delete u.id_empresa;
    guardarDB();
  },

  publicarContenido(admin, { titulo, categoria, texto, palabras_clave }) {
    exigir(titulo.trim() && titulo.length <= 150, "Escribe el título (máximo 150 caracteres).");
    exigir(["blanco", "negro", "verde"].includes(categoria), "Elige el color de la bolsa.");
    exigir(texto.trim().length >= 20, "El contenido debe tener mínimo 20 caracteres.");
    const c = { _id: nuevoId(), titulo: titulo.trim(), categoria, texto: texto.trim().slice(0, 5000),
      palabras_clave: palabras_clave.split(",").map((p) => p.trim()).filter(Boolean).slice(0, 10).map((p) => p.slice(0, 30)),
      id_autor: admin._id, fecha_publicacion: new Date() };
    DB.contenidos_educativos.push(c); guardarDB(); return c;
  }
};

// Fecha de hoy en Colombia (AAAA-MM-DD)
function hoyLocal() {
  const d = new Date(Date.now() - 5 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
}
