// Las 5 consultas de EcoRuta (03_ECORUTA_CONSULTAS.js) ejecutadas sobre la
// base de datos de la aplicación (objeto DB, ver db.js).
// Cada función reproduce, paso a paso, las etapas del pipeline de agregación
// de MongoDB que aparece en el documento del proyecto ($geoNear, $match,
// $lookup, $group, $project, $sort, $limit).

// --- Utilidades que imitan operadores de MongoDB ---------------------------

const RADIO_TIERRA_M = 6378100; // radio usado por $geoNear con spherical: true

// $geoNear: distancia esférica en metros entre dos puntos [lng, lat]
function distanciaMetros([lng1, lat1], [lng2, lat2]) {
  const rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(lat2 - lat1), dLng = rad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * RADIO_TIERRA_M * Math.asin(Math.sqrt(a));
}

// $lookup: documentos de "coleccion" cuyo campo coincide con el valor (o lo contiene si es arreglo)
function lookup(coleccion, campo, valor) {
  return DB[coleccion].filter((d) => (Array.isArray(d[campo]) ? d[campo].includes(valor) : d[campo] === valor));
}

// $round
const redondear = (n, dec) => Math.round(n * 10 ** dec) / 10 ** dec;

// $dateDiff con unit: "day" cuenta los cambios de día (en UTC) entre las dos fechas
function diferenciaDias(inicio, fin) {
  const dia = (f) => Date.UTC(f.getUTCFullYear(), f.getUTCMonth(), f.getUTCDate());
  return (dia(fin) - dia(inicio)) / 86400000;
}

// --- Consulta 1 -------------------------------------------------------------
// Rutas de recolección cerca de la ubicación del ciudadano.
// Colecciones: sectores, rutas y empresas.
function consulta1({ lng = -73.108, lat = 7.119, max = 1500 } = {}) {
  return DB.sectores
    // $geoNear: sectores a menos de "max" metros, ordenados por distancia
    .map((s) => ({ ...s, distancia_m: distanciaMetros([lng, lat], s.ubicacion.coordinates) }))
    .filter((s) => s.distancia_m <= max)
    .sort((a, b) => a.distancia_m - b.distancia_m)
    // $lookup rutas (rutas.sectores contiene el _id del sector) + $unwind
    .flatMap((s) => lookup("rutas", "sectores", s._id).map((ruta) => ({ ...s, ruta })))
    // $lookup empresas + $unwind
    .flatMap((d) => lookup("empresas", "_id", d.ruta.id_empresa).map((empresa) => ({ ...d, empresa })))
    // $project
    .map((d) => ({
      sector: d.nombre,
      municipio: d.municipio,
      coordenadas: d.ubicacion.coordinates,
      distancia_m: redondear(d.distancia_m, 0),
      ruta: d.ruta.codigo,
      tipo_residuo: d.ruta.tipo_residuo,
      empresa: d.empresa.nombre,
      dias: d.ruta.horarios.map((h) => h.dia),
      franja: `${d.ruta.horarios[0].hora_inicio} - ${d.ruta.horarios[0].hora_fin}`
    }));
}

// --- Consulta 2 -------------------------------------------------------------
// Toneladas recolectadas en un mes por empresa y tipo de residuo.
// Colecciones: registros_residuos y empresas.
// Filtros opcionales del panel (no están en el script): id_empresa y zona.
function consulta2({ mes = "2026-10", id_empresa = "", zona = "" } = {}) {
  let desde = new Date(0), hasta = new Date(8.64e15); // mes = "todos": sin filtro de fecha
  if (mes !== "todos") {
    const [a, m] = mes.split("-").map(Number);
    const siguiente = m === 12 ? `${a + 1}-01` : `${a}-${String(m + 1).padStart(2, "0")}`;
    desde = new Date(`${mes}-01T00:00:00-05:00`);
    hasta = new Date(`${siguiente}-01T00:00:00-05:00`);
  }

  // $match por rango de fechas (y por empresa o zona si el panel las filtra)
  const delMes = DB.registros_residuos.filter((r) => r.fecha >= desde && r.fecha < hasta
    && (!id_empresa || r.id_empresa === id_empresa) && (!zona || r.zona === zona));

  // $group por { empresa, tipo }: suma de kilos y número de recolecciones
  const grupos = new Map();
  for (const r of delMes) {
    const clave = `${r.id_empresa}|${r.tipo_residuo}`;
    const g = grupos.get(clave) || { empresa: r.id_empresa, tipo: r.tipo_residuo, total_kg: 0, recolecciones: 0 };
    g.total_kg += r.cantidad_kg;
    g.recolecciones += 1;
    grupos.set(clave, g);
  }

  return [...grupos.values()]
    // $lookup empresas + $unwind
    .flatMap((g) => lookup("empresas", "_id", g.empresa).map((empresa) => ({ ...g, empresa })))
    // $project
    .map((g) => ({
      empresa: g.empresa.nombre,
      tipo_residuo: g.tipo,
      recolecciones: g.recolecciones,
      toneladas: redondear(g.total_kg / 1000, 2)
    }))
    // $sort
    .sort((x, y) => y.toneladas - x.toneladas);
}

// --- Consulta 3 -------------------------------------------------------------
// Sectores con más reportes ciudadanos válidos (base del mapa de calor).
// Colecciones: reportes y sectores.
// Filtros opcionales del panel (no están en el script): id_empresa y zona.
function consulta3({ limite = 5, id_empresa = "", zona = "" } = {}) {
  // $match: excluye los reportes rechazados
  const validos = DB.reportes.filter((r) => r.estado !== "rechazado"
    && (!id_empresa || r.id_empresa === id_empresa)
    && (!zona || (lookup("sectores", "_id", r.id_sector)[0] || {}).zona === zona));

  // $group por sector
  const grupos = new Map();
  for (const r of validos) {
    const g = grupos.get(r.id_sector) || { _id: r.id_sector, total_reportes: 0, prioridad_alta: 0, tipos: new Set() };
    g.total_reportes += 1;
    if (r.prioridad === "alta") g.prioridad_alta += 1;
    g.tipos.add(r.tipo_novedad); // $addToSet
    grupos.set(r.id_sector, g);
  }

  return [...grupos.values()]
    // $lookup sectores + $unwind
    .flatMap((g) => lookup("sectores", "_id", g._id).map((sector) => ({ ...g, sector })))
    // $project
    .map((g) => ({
      sector: g.sector.nombre,
      municipio: g.sector.municipio,
      coordenadas: g.sector.ubicacion.coordinates,
      total_reportes: g.total_reportes,
      prioridad_alta: g.prioridad_alta,
      tipos: [...g.tipos]
    }))
    // $sort y $limit
    .sort((x, y) => y.total_reportes - x.total_reportes || y.prioridad_alta - x.prioridad_alta || x.sector.localeCompare(y.sector))
    .slice(0, limite);
}

// --- Consulta 4 -------------------------------------------------------------
// Empresas con más reportes sin resolver y días promedio abiertos a una fecha de corte.
// Colecciones: reportes, sectores y empresas.
// Filtros opcionales del panel (no están en el script): id_empresa y zona.
function consulta4({ corte = "2026-10-31", id_empresa = "", zona = "" } = {}) {
  const fechaCorte = new Date(`${corte}T23:59:59-05:00`);

  const grupos = new Map();
  DB.reportes
    // $match: estados sin resolver
    .filter((r) => ["reportado", "en_revision", "en_proceso"].includes(r.estado) && (!id_empresa || r.id_empresa === id_empresa))
    // $lookup sectores + $unwind
    .flatMap((r) => lookup("sectores", "_id", r.id_sector).map((sector) => ({ ...r, sector })))
    .filter((r) => !zona || r.sector.zona === zona)
    // $group por empresa
    .forEach((r) => {
      const g = grupos.get(r.id_empresa) || { _id: r.id_empresa, pendientes: 0, dias: [], sectores: new Set(), estados: [] };
      g.pendientes += 1;
      g.dias.push(diferenciaDias(r.fecha_hora, fechaCorte)); // $dateDiff
      g.sectores.add(r.sector.nombre);                        // $addToSet
      g.estados.push(r.estado);                               // $push
      grupos.set(r.id_empresa, g);
    });

  return [...grupos.values()]
    // $lookup empresas + $unwind
    .flatMap((g) => lookup("empresas", "_id", g._id).map((empresa) => ({ ...g, empresa })))
    // $project ($avg + $round)
    .map((g) => ({
      empresa: g.empresa.nombre,
      pendientes: g.pendientes,
      dias_promedio_abierto: redondear(g.dias.reduce((s, d) => s + d, 0) / g.dias.length, 1),
      sectores: [...g.sectores],
      estados: g.estados,
      canal_pqr: g.empresa.canal_pqr
    }))
    // $sort
    .sort((x, y) => y.pendientes - x.pendientes || y.dias_promedio_abierto - x.dias_promedio_abierto);
}

// --- Consulta 5 -------------------------------------------------------------
// Ranking de EcoPuntos de los ciudadanos (propuesta de innovación).
// Colecciones: usuarios, reportes y sectores.
function consulta5() {
  return DB.usuarios
    // $match: ciudadanos activos
    .filter((u) => u.rol === "ciudadano" && u.activo)
    // $lookup reportes (sin $unwind: quedan como arreglo)
    .map((u) => ({ ...u, reportes: lookup("reportes", "id_usuario", u._id) }))
    // $lookup sectores + $unwind
    .flatMap((u) => lookup("sectores", "_id", u.id_sector).map((sector) => ({ ...u, sector })))
    // $project ($size y $filter)
    .map((u) => ({
      ciudadano: `${u.nombres} ${u.apellidos}`,
      sector: `${u.sector.nombre} (${u.sector.municipio})`,
      eco_puntos: u.eco_puntos,
      reportes_enviados: u.reportes.length,
      reportes_resueltos: u.reportes.filter((r) => r.estado === "resuelto").length
    }))
    // $sort
    .sort((x, y) => y.eco_puntos - x.eco_puntos || y.reportes_enviados - x.reportes_enviados);
}
