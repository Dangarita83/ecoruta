// =====================================================================
//  EcoRuta - Datos de prueba de la aplicación
//  Es el mismo contenido de 02_ECORUTA_DATOS.js (10 documentos por
//  colección). Las funciones de mongosh (ObjectId, ISODate, Double,
//  NumberInt e insertMany) se simulan para que el script corra en el
//  navegador y llene el objeto SEMILLA.
// =====================================================================
const SEMILLA = {};
(function () {
  const ObjectId = (hex) => hex;            // el _id se guarda como texto hexadecimal
  const ISODate = (s) => new Date(s);
  const Double = (n) => Number(n);
  const NumberInt = (n) => Number(n);
  let db = new Proxy({}, {
    get: (_, coleccion) => coleccion === "getSiblingDB" ? () => db
      : { insertMany: (docs) => { SEMILLA[coleccion] = docs; } }
  });

// ----- Desde aquí, contenido de 02_ECORUTA_DATOS.js -----
// =====================================================================
//  EcoRuta - SCRIPT 2 DE 2: CREACIÓN DE DATOS (10 registros por colección)
//  Motor: MongoDB 7.x   |   Ejecutar DESPUÉS de 01_ECORUTA_OBJETOS.js:
//      mongosh 02_ECORUTA_DATOS.js
//  Nota: empresas, NIT, personas, correos y rutas son DATOS DE EJEMPLO
//  (origen_dato = "ejemplo"). Los barrios y municipios son reales y sus
//  coordenadas son aproximadas.
// =====================================================================

db = db.getSiblingDB("ecoruta");

// Identificadores fijos y legibles: prefijo de colección + número.
//   6501.. empresas | 6502.. sectores | 6503.. rutas | 6504.. registros_residuos
//   6505.. usuarios | 6506.. reportes | 6507.. contenidos | 6508.. auditoria
const id = (pref, n) => ObjectId(pref + "0".repeat(18) + String(n).padStart(2, "0"));
const E = n => id("6501", n), S = n => id("6502", n), R = n => id("6503", n),
      G = n => id("6504", n), U = n => id("6505", n), P = n => id("6506", n),
      C = n => id("6507", n), A = n => id("6508", n);
const punto = (lon, lat) => ({ type: "Point", coordinates: [Double(lon), Double(lat)] });
const f = s => ISODate(s);   // fechas en hora local de Colombia (UTC-05:00)

// ---------------------------------------------------------------------
// 1. EMPRESAS
// ---------------------------------------------------------------------
db.empresas.insertMany([
  { _id: E(1),  nit: "900100101-1", nombre: "EcoAseo Bucaramanga S.A. E.S.P.",          municipios: ["Bucaramanga"],                        telefono: "6076300101", correo: "pqr@ecoaseobga.com.co",       canal_pqr: "https://ecoaseobga.com.co/pqr",       activa: true,  fecha_registro: f("2026-09-01T08:00:00-05:00") },
  { _id: E(2),  nit: "900100202-2", nombre: "Limpieza Metropolitana S.A. E.S.P.",       municipios: ["Bucaramanga", "Floridablanca"],       telefono: "6076300202", correo: "atencion@limpiezametro.co",   canal_pqr: "Línea 018000 112 202",               activa: true,  fecha_registro: f("2026-09-01T08:10:00-05:00") },
  { _id: E(3),  nit: "900100303-3", nombre: "Aseo Floridablanca E.S.P.",                municipios: ["Floridablanca"],                      telefono: "6076300303", correo: "pqr@aseoflorida.co",          canal_pqr: "pqr@aseoflorida.co",                 activa: true,  fecha_registro: f("2026-09-01T08:20:00-05:00") },
  { _id: E(4),  nit: "900100404-4", nombre: "Servigirón Aseo S.A.S. E.S.P.",            municipios: ["Girón"],                              telefono: "6076300404", correo: "contacto@servigiron.co",      canal_pqr: "https://servigiron.co/pqrs",          activa: true,  fecha_registro: f("2026-09-02T09:00:00-05:00") },
  { _id: E(5),  nit: "900100505-5", nombre: "Piedecuesta Limpia E.S.P.",                municipios: ["Piedecuesta"],                        telefono: "6076300505", correo: "pqr@piedecuestalimpia.co",    canal_pqr: "Oficina Cra. 6 # 10-15 Piedecuesta",  activa: true,  fecha_registro: f("2026-09-02T09:15:00-05:00") },
  { _id: E(6),  nit: "900100606-6", nombre: "Recuperar Santander S.A.S. E.S.P.",        municipios: ["Bucaramanga", "Floridablanca", "Girón"], telefono: "6076300606", correo: "info@recuperarsantander.co", canal_pqr: "https://recuperarsantander.co/contacto", activa: true, fecha_registro: f("2026-09-03T10:00:00-05:00") },
  { _id: E(7),  nit: "900100707-7", nombre: "Asociación de Recicladores del Oriente E.S.P.", municipios: ["Bucaramanga"],                   telefono: "6076300707", correo: "recicladores.oriente@correo.co", canal_pqr: "WhatsApp 3150000707",          activa: true,  fecha_registro: f("2026-09-03T10:30:00-05:00") },
  { _id: E(8),  nit: "900100808-8", nombre: "Verde Orgánico S.A.S. E.S.P.",             municipios: ["Bucaramanga", "Piedecuesta"],         telefono: "6076300808", correo: "hola@verdeorganico.co",       canal_pqr: "hola@verdeorganico.co",              activa: true,  fecha_registro: f("2026-09-04T11:00:00-05:00") },
  { _id: E(9),  nit: "900100909-9", nombre: "Aseo Integral del Norte S.A. E.S.P.",      municipios: ["Bucaramanga"],                        telefono: "6076300909", correo: "pqr@aseonorte.co",            canal_pqr: "pqr@aseonorte.co",                   activa: false, fecha_registro: f("2026-09-04T11:30:00-05:00") },
  { _id: E(10), nit: "900101010-0", nombre: "Ecoservicios del Río de Oro S.A.S. E.S.P.", municipios: ["Girón", "Piedecuesta"],               telefono: "6076301010", correo: "pqr@ecoriodeoro.co",          canal_pqr: "https://ecoriodeoro.co/pqr",          activa: true,  fecha_registro: f("2026-09-05T08:00:00-05:00") }
]);

// ---------------------------------------------------------------------
// 2. SECTORES (barrios reales, coordenadas aproximadas [longitud, latitud])
// ---------------------------------------------------------------------
db.sectores.insertMany([
  { _id: S(1),  nombre: "Cabecera del Llano",  municipio: "Bucaramanga",   zona: "Oriente",   ubicacion: punto(-73.1085, 7.1185) },
  { _id: S(2),  nombre: "San Francisco",       municipio: "Bucaramanga",   zona: "Centro",    ubicacion: punto(-73.1180, 7.1270) },
  { _id: S(3),  nombre: "Real de Minas",       municipio: "Bucaramanga",   zona: "Occidente", ubicacion: punto(-73.1300, 7.1085) },
  { _id: S(4),  nombre: "Provenza",            municipio: "Bucaramanga",   zona: "Sur",       ubicacion: punto(-73.1095, 7.0965) },
  { _id: S(5),  nombre: "Kennedy",             municipio: "Bucaramanga",   zona: "Norte",     ubicacion: punto(-73.1290, 7.1550) },
  { _id: S(6),  nombre: "Cañaveral",           municipio: "Floridablanca", zona: "Sur",       ubicacion: punto(-73.1010, 7.0705) },
  { _id: S(7),  nombre: "Lagos I",             municipio: "Floridablanca", zona: "Sur",       ubicacion: punto(-73.0920, 7.0640) },
  { _id: S(8),  nombre: "El Poblado",          municipio: "Girón",         zona: "Occidente", ubicacion: punto(-73.1550, 7.0750) },
  { _id: S(9),  nombre: "Centro Histórico",    municipio: "Girón",         zona: "Occidente", ubicacion: punto(-73.1690, 7.0685) },
  { _id: S(10), nombre: "Barroblanco",         municipio: "Piedecuesta",   zona: "Sur",       ubicacion: punto(-73.0560, 6.9950) }
]);

// ---------------------------------------------------------------------
// 3. RUTAS (horarios embebidos; sectores referenciados -> relación N:M)
// ---------------------------------------------------------------------
const h = (dias, ini, fin) => dias.map(d => ({ dia: d, hora_inicio: ini, hora_fin: fin }));
const LMV = ["lunes", "miercoles", "viernes"], MJS = ["martes", "jueves", "sabado"];
db.rutas.insertMany([
  { _id: R(1),  codigo: "BGA-OR-01", id_empresa: E(1), sectores: [S(1)],       zona: "Oriente",   tipo_residuo: "no_aprovechable", horarios: h(LMV, "06:00", "10:00"),          origen_dato: "ejemplo", activa: true },
  { _id: R(2),  codigo: "BGA-CE-01", id_empresa: E(1), sectores: [S(2)],       zona: "Centro",    tipo_residuo: "no_aprovechable", horarios: h(MJS, "18:00", "22:00"),          origen_dato: "ejemplo", activa: true },
  { _id: R(3),  codigo: "BGA-OC-01", id_empresa: E(2), sectores: [S(3)],       zona: "Occidente", tipo_residuo: "no_aprovechable", horarios: h(LMV, "18:00", "23:00"),          origen_dato: "ejemplo", activa: true },
  { _id: R(4),  codigo: "BGA-SU-01", id_empresa: E(2), sectores: [S(4)],       zona: "Sur",       tipo_residuo: "no_aprovechable", horarios: h(MJS, "06:00", "11:00"),          origen_dato: "ejemplo", activa: true },
  { _id: R(5),  codigo: "BGA-AP-01", id_empresa: E(7), sectores: [S(1)],       zona: "Oriente",   tipo_residuo: "aprovechable",    horarios: h(["miercoles"], "08:00", "12:00"), origen_dato: "ejemplo", activa: true },
  { _id: R(6),  codigo: "FLO-SU-01", id_empresa: E(3), sectores: [S(6), S(7)], zona: "Sur",       tipo_residuo: "no_aprovechable", horarios: h(LMV, "07:00", "12:00"),          origen_dato: "ejemplo", activa: true },
  { _id: R(7),  codigo: "FLO-AP-01", id_empresa: E(6), sectores: [S(6), S(7)], zona: "Sur",       tipo_residuo: "aprovechable",    horarios: h(["jueves"], "08:00", "13:00"),    origen_dato: "ejemplo", activa: true },
  { _id: R(8),  codigo: "GIR-OC-01", id_empresa: E(4), sectores: [S(8), S(9)], zona: "Occidente", tipo_residuo: "no_aprovechable", horarios: h(MJS, "06:00", "11:00"),          origen_dato: "ejemplo", activa: true },
  { _id: R(9),  codigo: "PIE-SU-01", id_empresa: E(5), sectores: [S(10)],      zona: "Sur",       tipo_residuo: "no_aprovechable", horarios: h(LMV, "06:00", "10:00"),          origen_dato: "ejemplo", activa: true },
  { _id: R(10), codigo: "BGA-SU-02", id_empresa: E(8), sectores: [S(4)],       zona: "Sur",       tipo_residuo: "organico",        horarios: h(["viernes"], "07:00", "11:00"),   origen_dato: "ejemplo", activa: true }
]);
// Nota: el sector Kennedy (S5) queda sin ruta asignada a propósito (participación parcial de SECTOR).

// ---------------------------------------------------------------------
// 4. USUARIOS (1 administrador, 3 operadores, 6 ciudadanos)
//    Contraseña de prueba de todos: EcoRuta2026*  (guardada como hash bcrypt)
// ---------------------------------------------------------------------
db.usuarios.insertMany([
  { _id: U(1),  nombres: "Laura",     apellidos: "Méndez Rojas",   correo: "admin@ecoruta.co",            contrasena_hash: "$2b$10$vRx.eVh2OjFLbKiLjo/3u.VnneukMcRaYdKvpIBGZaqfYPHVYu1ty", telefono: "3001110001", rol: "administrador",                    eco_puntos: NumberInt(0),  fecha_registro: f("2026-09-01T07:00:00-05:00"), activo: true },
  { _id: U(2),  nombres: "Carlos",    apellidos: "Rueda Plata",    correo: "c.rueda@ecoaseobga.com.co",   contrasena_hash: "$2b$10$0YODGoJSLN4.4nGNE011he9a.dU/EqQvmKfCNa3TGRSCBo7LJzUbO", telefono: "3001110002", rol: "operador", id_empresa: E(1),  eco_puntos: NumberInt(0),  fecha_registro: f("2026-09-02T08:00:00-05:00"), activo: true },
  { _id: U(3),  nombres: "Diana",     apellidos: "Pabón Suárez",   correo: "d.pabon@limpiezametro.co",    contrasena_hash: "$2b$10$RtMiV22ADJjKGv.z2H.SC.d5HDecNcJhLZVtlfS/92T19et2otnKC", telefono: "3001110003", rol: "operador", id_empresa: E(2),  eco_puntos: NumberInt(0),  fecha_registro: f("2026-09-02T08:30:00-05:00"), activo: true },
  { _id: U(4),  nombres: "Jorge",     apellidos: "Afanador León",  correo: "j.afanador@servigiron.co",    contrasena_hash: "$2b$10$L/V9sQRMhIRV88soBmrEIuJW/XBJbh8fpQtjez75oLhPCVadq9wzi", telefono: "3001110004", rol: "operador", id_empresa: E(4),  eco_puntos: NumberInt(0),  fecha_registro: f("2026-09-03T09:00:00-05:00"), activo: true },
  { _id: U(5),  nombres: "Andrea",    apellidos: "Ortiz Vargas",   correo: "andrea.ortiz@correo.co",      contrasena_hash: "$2b$10$IUGkmQDNlnJgNqWdqYYxPupwXLn4N9FVwD15QTWG.WP8aqtBRwLLe", telefono: "3151110005", rol: "ciudadano", id_sector: S(1), eco_puntos: NumberInt(15), fecha_registro: f("2026-09-20T19:12:00-05:00"), activo: true },
  { _id: U(6),  nombres: "Miguel",    apellidos: "Durán Castillo", correo: "miguel.duran@correo.co",      contrasena_hash: "$2b$10$pZaaLueaSkgol0DoUTGSEeENsjk3z8h4ffdej4cjZ.wE86MmpfRHO", telefono: "3161110006", rol: "ciudadano", id_sector: S(3), eco_puntos: NumberInt(5),  fecha_registro: f("2026-09-21T12:40:00-05:00"), activo: true },
  { _id: U(7),  nombres: "Paola",     apellidos: "Serrano Díaz",   correo: "paola.serrano@correo.co",     contrasena_hash: "$2b$10$4VrhLzZC0yTUyx5pEUCYV.hKIiuvdBt.80TIJDNg/721V8wipOhXa", telefono: "3171110007", rol: "ciudadano", id_sector: S(6), eco_puntos: NumberInt(10), fecha_registro: f("2026-09-22T08:05:00-05:00"), activo: true },
  { _id: U(8),  nombres: "Felipe",    apellidos: "Castro Niño",    correo: "felipe.castro@correo.co",     contrasena_hash: "$2b$10$u4S6PKl/Tzp.pWjec7B2AuVQaJZHKaor0YE7WJ6CbDXnEgF04OAwG", telefono: "3181110008", rol: "ciudadano", id_sector: S(8), eco_puntos: NumberInt(0),  fecha_registro: f("2026-09-25T17:30:00-05:00"), activo: true },
  { _id: U(9),  nombres: "Natalia",   apellidos: "Gómez Arenas",   correo: "natalia.gomez@correo.co",     contrasena_hash: "$2b$10$J1W0Hxk/XyX2YBbSqkNTQ.Bd96hJq6o5xAfVsXXTGoQUBokWHilOm", telefono: "3191110009", rol: "ciudadano", id_sector: S(10), eco_puntos: NumberInt(0), fecha_registro: f("2026-09-28T10:00:00-05:00"), activo: true },
  { _id: U(10), nombres: "Sebastián", apellidos: "Prada Molina",   correo: "sebastian.prada@correo.co",   contrasena_hash: "$2b$10$BA6H8idwXSgQZMavWs2qnOxdJQvQPYov2hE7RBSnsaJeHkSwU4Hmy", telefono: "3201110010", rol: "ciudadano", id_sector: S(2), eco_puntos: NumberInt(0),  fecha_registro: f("2026-10-01T20:45:00-05:00"), activo: true }
]);

// ---------------------------------------------------------------------
// 5. REGISTROS_RESIDUOS (octubre 2026; id_empresa y zona copiados de la ruta)
// ---------------------------------------------------------------------
db.registros_residuos.insertMany([
  { _id: G(1),  fecha: f("2026-10-05T10:30:00-05:00"), id_ruta: R(1),  id_empresa: E(1), zona: "Oriente",   tipo_residuo: "no_aprovechable", cantidad_kg: Double(8450),   registrado_por: U(2) },
  { _id: G(2),  fecha: f("2026-10-07T10:20:00-05:00"), id_ruta: R(1),  id_empresa: E(1), zona: "Oriente",   tipo_residuo: "no_aprovechable", cantidad_kg: Double(8120.5), observaciones: "Valor corregido: se había digitado 81205 kg", registrado_por: U(2) },
  { _id: G(3),  fecha: f("2026-10-06T22:15:00-05:00"), id_ruta: R(2),  id_empresa: E(1), zona: "Centro",    tipo_residuo: "no_aprovechable", cantidad_kg: Double(6230),   registrado_por: U(2) },
  { _id: G(4),  fecha: f("2026-10-05T23:10:00-05:00"), id_ruta: R(3),  id_empresa: E(2), zona: "Occidente", tipo_residuo: "no_aprovechable", cantidad_kg: Double(9310),   registrado_por: U(3) },
  { _id: G(5),  fecha: f("2026-10-06T11:05:00-05:00"), id_ruta: R(4),  id_empresa: E(2), zona: "Sur",       tipo_residuo: "no_aprovechable", cantidad_kg: Double(7045.5), registrado_por: U(3) },
  { _id: G(6),  fecha: f("2026-10-07T12:10:00-05:00"), id_ruta: R(5),  id_empresa: E(7), zona: "Oriente",   tipo_residuo: "aprovechable",    cantidad_kg: Double(1280),   observaciones: "Predominio de cartón y PET", registrado_por: U(1) },
  { _id: G(7),  fecha: f("2026-10-05T12:20:00-05:00"), id_ruta: R(6),  id_empresa: E(3), zona: "Sur",       tipo_residuo: "no_aprovechable", cantidad_kg: Double(10250),  registrado_por: U(1) },
  { _id: G(8),  fecha: f("2026-10-08T13:00:00-05:00"), id_ruta: R(7),  id_empresa: E(6), zona: "Sur",       tipo_residuo: "aprovechable",    cantidad_kg: Double(1630),   registrado_por: U(1) },
  { _id: G(9),  fecha: f("2026-10-06T11:30:00-05:00"), id_ruta: R(8),  id_empresa: E(4), zona: "Occidente", tipo_residuo: "no_aprovechable", cantidad_kg: Double(7980),   observaciones: "Vía cerrada en El Poblado, se tomó desvío", registrado_por: U(4) },
  { _id: G(10), fecha: f("2026-10-09T11:15:00-05:00"), id_ruta: R(10), id_empresa: E(8), zona: "Sur",       tipo_residuo: "organico",        cantidad_kg: Double(940),    registrado_por: U(1) }
]);

// ---------------------------------------------------------------------
// 6. REPORTES (evidencia e historial de estados embebidos)
//    EcoPuntos al resolverse: alta = 15, media = 10, baja = 5
// ---------------------------------------------------------------------
const hist = (...pares) => pares.map(([estado, fecha]) => ({ estado, fecha_cambio: f(fecha) }));
db.reportes.insertMany([
  { _id: P(1), id_usuario: U(5), id_sector: S(1), id_empresa: E(1), tipo_novedad: "acumulacion_residuos",
    descripcion: "Bolsas acumuladas en la esquina de la Cra. 33 con Calle 48 desde hace tres días",
    fecha_hora: f("2026-10-03T07:40:00-05:00"), ubicacion: punto(-73.1079, 7.1191),
    evidencia: { url_foto: "https://storage.ecoruta.co/reportes/0001.jpg", comentario: "Junto al parque" },
    prioridad: "alta", estado: "resuelto",
    historial_estados: hist(["reportado", "2026-10-03T07:40:00-05:00"], ["en_revision", "2026-10-03T10:05:00-05:00"],
                            ["en_proceso", "2026-10-04T08:00:00-05:00"], ["resuelto", "2026-10-04T15:30:00-05:00"]) },
  { _id: P(2), id_usuario: U(5), id_sector: S(1), id_empresa: E(1), tipo_novedad: "ruta_incumplida",
    descripcion: "El camión no pasó el viernes en el horario de 06:00 a 10:00",
    fecha_hora: f("2026-10-16T11:20:00-05:00"), ubicacion: punto(-73.1090, 7.1180),
    prioridad: "media", estado: "en_proceso",
    historial_estados: hist(["reportado", "2026-10-16T11:20:00-05:00"], ["en_revision", "2026-10-16T14:00:00-05:00"],
                            ["en_proceso", "2026-10-17T09:00:00-05:00"]) },
  { _id: P(3), id_usuario: U(6), id_sector: S(3), id_empresa: E(2), tipo_novedad: "punto_critico",
    descripcion: "Arrojo de escombros y colchones en el separador de la Av. Samanes",
    fecha_hora: f("2026-10-12T18:05:00-05:00"), ubicacion: punto(-73.1312, 7.1079),
    evidencia: { url_foto: "https://storage.ecoruta.co/reportes/0003.jpg" },
    prioridad: "alta", estado: "en_revision",
    historial_estados: hist(["reportado", "2026-10-12T18:05:00-05:00"], ["en_revision", "2026-10-13T08:30:00-05:00"]) },
  { _id: P(4), id_usuario: U(6), id_sector: S(3), id_empresa: E(2), tipo_novedad: "contenedor_danado",
    descripcion: "Contenedor de la portería con la tapa rota",
    fecha_hora: f("2026-10-02T09:10:00-05:00"), ubicacion: punto(-73.1295, 7.1090),
    prioridad: "baja", estado: "resuelto",
    historial_estados: hist(["reportado", "2026-10-02T09:10:00-05:00"], ["en_proceso", "2026-10-05T08:00:00-05:00"],
                            ["resuelto", "2026-10-08T16:00:00-05:00"]) },
  { _id: P(5), id_usuario: U(7), id_sector: S(6), id_empresa: E(3), tipo_novedad: "ruta_incumplida",
    descripcion: "No han recogido la basura desde el lunes",
    fecha_hora: f("2026-10-21T08:15:00-05:00"), ubicacion: punto(-73.1015, 7.0700),
    prioridad: "alta", estado: "reportado",
    historial_estados: hist(["reportado", "2026-10-21T08:15:00-05:00"]) },
  { _id: P(6), id_usuario: U(7), id_sector: S(7), id_empresa: E(3), tipo_novedad: "acumulacion_residuos",
    descripcion: "Residuos acumulados frente al centro comercial",
    fecha_hora: f("2026-10-06T19:30:00-05:00"), ubicacion: punto(-73.0925, 7.0645),
    evidencia: { comentario: "Hay perros rompiendo las bolsas" },
    prioridad: "media", estado: "resuelto",
    historial_estados: hist(["reportado", "2026-10-06T19:30:00-05:00"], ["resuelto", "2026-10-07T12:00:00-05:00"]) },
  { _id: P(7), id_usuario: U(8), id_sector: S(8), id_empresa: E(4), tipo_novedad: "punto_critico",
    descripcion: "Botadero en el lote baldío al lado del colegio",
    fecha_hora: f("2026-10-14T16:45:00-05:00"), ubicacion: punto(-73.1545, 7.0758),
    evidencia: { url_foto: "https://storage.ecoruta.co/reportes/0007.jpg", comentario: "Malos olores" },
    prioridad: "alta", estado: "en_proceso",
    historial_estados: hist(["reportado", "2026-10-14T16:45:00-05:00"], ["en_proceso", "2026-10-15T07:30:00-05:00"]) },
  { _id: P(8), id_usuario: U(9), id_sector: S(10), id_empresa: E(5), tipo_novedad: "ruta_incumplida",
    descripcion: "La ruta del miércoles pasó a las 13:00 y no a las 06:00",
    fecha_hora: f("2026-10-22T13:20:00-05:00"), ubicacion: punto(-73.0555, 6.9955),
    prioridad: "media", estado: "reportado",
    historial_estados: hist(["reportado", "2026-10-22T13:20:00-05:00"]) },
  { _id: P(9), id_usuario: U(10), id_sector: S(2), id_empresa: E(1), tipo_novedad: "acumulacion_residuos",
    descripcion: "Basura acumulada en la plaza de mercado después del fin de semana",
    fecha_hora: f("2026-10-26T07:05:00-05:00"), ubicacion: punto(-73.1175, 7.1275),
    evidencia: { url_foto: "https://storage.ecoruta.co/reportes/0009.jpg" },
    prioridad: "alta", estado: "reportado",
    historial_estados: hist(["reportado", "2026-10-26T07:05:00-05:00"]) },
  { _id: P(10), id_usuario: U(5), id_sector: S(1), id_empresa: E(1), tipo_novedad: "otra",
    descripcion: "Repite el reporte de bolsas acumuladas en la Cra. 33",
    fecha_hora: f("2026-10-03T08:00:00-05:00"), ubicacion: punto(-73.1080, 7.1190),
    prioridad: "baja", estado: "rechazado",
    historial_estados: hist(["reportado", "2026-10-03T08:00:00-05:00"], ["rechazado", "2026-10-03T10:10:00-05:00"]) }
]);

// ---------------------------------------------------------------------
// 7. CONTENIDOS_EDUCATIVOS (código de colores, Resolución 2184 de 2019)
// ---------------------------------------------------------------------
db.contenidos_educativos.insertMany([
  { _id: C(1),  titulo: "¿Qué va en la bolsa blanca?",                categoria: "blanco", texto: "En la bolsa blanca van los residuos aprovechables limpios y secos: plástico, vidrio, metales, papel y cartón.", palabras_clave: ["bolsa blanca", "aprovechables", "plastico", "carton"], id_autor: U(1), fecha_publicacion: f("2026-10-01T09:00:00-05:00") },
  { _id: C(2),  titulo: "¿Qué va en la bolsa negra?",                 categoria: "negro",  texto: "En la bolsa negra van los residuos no aprovechables: papel higiénico, servilletas, empaques contaminados con comida.", palabras_clave: ["bolsa negra", "no aprovechables", "sanitarios"], id_autor: U(1), fecha_publicacion: f("2026-10-01T09:10:00-05:00") },
  { _id: C(3),  titulo: "¿Qué va en la bolsa verde?",                 categoria: "verde",  texto: "En la bolsa verde van los residuos orgánicos aprovechables: cáscaras, restos de frutas y verduras, cuncho de café.", palabras_clave: ["bolsa verde", "organicos", "compost"], id_autor: U(1), fecha_publicacion: f("2026-10-01T09:20:00-05:00") },
  { _id: C(4),  titulo: "Enjuaga y seca antes de reciclar",           categoria: "blanco", texto: "Un envase sucio contamina todo el material de la bolsa. Enjuágalo, sécalo y aplástalo para ahorrar espacio.", palabras_clave: ["reciclaje", "envases", "limpieza"], id_autor: U(1), fecha_publicacion: f("2026-10-05T08:00:00-05:00") },
  { _id: C(5),  titulo: "Compostaje casero en 5 pasos",               categoria: "verde",  texto: "Usa un recipiente con orificios, alterna capas de residuos verdes y secos, mantén la humedad y voltea cada semana.", palabras_clave: ["compost", "organicos", "huerta"], id_autor: U(1), fecha_publicacion: f("2026-10-08T08:00:00-05:00") },
  { _id: C(6),  titulo: "Pilas y bombillos no van a ninguna bolsa",   categoria: "negro",  texto: "Las pilas, bombillos y medicamentos son residuos peligrosos. Llévalos a los puntos posconsumo autorizados.", palabras_clave: ["pilas", "posconsumo", "peligrosos"], id_autor: U(1), fecha_publicacion: f("2026-10-10T08:00:00-05:00") },
  { _id: C(7),  titulo: "Saca la basura en tu horario",               categoria: "negro",  texto: "Sacar las bolsas fuera del horario crea puntos críticos y atrae roedores. Consulta tu ruta en EcoRuta y activa la alerta.", palabras_clave: ["horario", "ruta", "puntos criticos"], id_autor: U(1), fecha_publicacion: f("2026-10-12T08:00:00-05:00") },
  { _id: C(8),  titulo: "El reciclador de oficio es tu aliado",       categoria: "blanco", texto: "Entregar el material separado a los recicladores de oficio dignifica su trabajo y aumenta el aprovechamiento.", palabras_clave: ["recicladores", "aprovechamiento"], id_autor: U(1), fecha_publicacion: f("2026-10-15T08:00:00-05:00") },
  { _id: C(9),  titulo: "El aceite de cocina no va por el desagüe",   categoria: "negro",  texto: "Un litro de aceite contamina miles de litros de agua. Guárdalo en una botella cerrada y entrégalo en un punto de acopio.", palabras_clave: ["aceite", "agua", "acopio"], id_autor: U(1), fecha_publicacion: f("2026-10-18T08:00:00-05:00") },
  { _id: C(10), titulo: "Separar en la fuente reduce lo que llega a El Carrasco", categoria: "verde", texto: "Cuando separas, menos residuos llegan al sitio de disposición final y se generan menos lixiviados y gases.", palabras_clave: ["separacion", "el carrasco", "ambiente"], id_autor: U(1), fecha_publicacion: f("2026-10-20T08:00:00-05:00") }
]);

// ---------------------------------------------------------------------
// 8. AUDITORIA (cambios de estado de reportes y de registros de residuos)
// ---------------------------------------------------------------------
db.auditoria.insertMany([
  { _id: A(1),  coleccion: "reportes", id_documento: P(1),  accion: "UPDATE", valor_anterior: { estado: "reportado" },   valor_nuevo: { estado: "en_revision" }, id_usuario: U(2), fecha: f("2026-10-03T10:05:00-05:00") },
  { _id: A(2),  coleccion: "reportes", id_documento: P(10), accion: "UPDATE", valor_anterior: { estado: "reportado" },   valor_nuevo: { estado: "rechazado" },   id_usuario: U(2), fecha: f("2026-10-03T10:10:00-05:00") },
  { _id: A(3),  coleccion: "reportes", id_documento: P(1),  accion: "UPDATE", valor_anterior: { estado: "en_revision" }, valor_nuevo: { estado: "en_proceso" },  id_usuario: U(2), fecha: f("2026-10-04T08:00:00-05:00") },
  { _id: A(4),  coleccion: "reportes", id_documento: P(1),  accion: "UPDATE", valor_anterior: { estado: "en_proceso" },  valor_nuevo: { estado: "resuelto" },    id_usuario: U(2), fecha: f("2026-10-04T15:30:00-05:00") },
  { _id: A(5),  coleccion: "reportes", id_documento: P(4),  accion: "UPDATE", valor_anterior: { estado: "reportado" },   valor_nuevo: { estado: "en_proceso" },  id_usuario: U(3), fecha: f("2026-10-05T08:00:00-05:00") },
  { _id: A(6),  coleccion: "registros_residuos", id_documento: G(9), accion: "INSERT", valor_anterior: null, valor_nuevo: { cantidad_kg: 7980, tipo_residuo: "no_aprovechable" }, id_usuario: U(4), fecha: f("2026-10-06T11:30:00-05:00") },
  { _id: A(7),  coleccion: "reportes", id_documento: P(6),  accion: "UPDATE", valor_anterior: { estado: "reportado" },   valor_nuevo: { estado: "resuelto" },    id_usuario: U(1), fecha: f("2026-10-07T12:00:00-05:00") },
  { _id: A(8),  coleccion: "registros_residuos", id_documento: G(2), accion: "UPDATE", valor_anterior: { cantidad_kg: 81205 }, valor_nuevo: { cantidad_kg: 8120.5 }, id_usuario: U(2), fecha: f("2026-10-07T16:45:00-05:00") },
  { _id: A(9),  coleccion: "reportes", id_documento: P(4),  accion: "UPDATE", valor_anterior: { estado: "en_proceso" },  valor_nuevo: { estado: "resuelto" },    id_usuario: U(3), fecha: f("2026-10-08T16:00:00-05:00") },
  { _id: A(10), coleccion: "reportes", id_documento: P(3),  accion: "UPDATE", valor_anterior: { estado: "reportado" },   valor_nuevo: { estado: "en_revision" }, id_usuario: U(3), fecha: f("2026-10-13T08:30:00-05:00") }
]);
})();
