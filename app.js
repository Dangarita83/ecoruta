// =====================================================================
//  EcoRuta - Aplicación web (ciudadano, operador de empresa y administrador)
//  Usa la base de datos del navegador (db.js) y las 5 consultas (consultas.js).
// =====================================================================

// ---------- Usuarios de demostración (de 02_ECORUTA_DATOS.js) ----------
const USUARIO_DEMO = {
  ciudadano: "650500000000000000000005",     // Andrea Ortiz Vargas · Cabecera del Llano
  operador: "650500000000000000000002",      // Carlos Rueda Plata · EcoAseo Bucaramanga
  administrador: "650500000000000000000001"  // Laura Méndez Rojas
};

// ---------- Íconos (trazos estilo Lucide) ----------
const I = {
  casa: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  mapa: '<path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>',
  megafono: '<path d="m3 11 18-7v16L3 13v-2Z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  lista: '<path d="M3 6h1M3 12h1M3 18h1"/><path d="M8 6h13M8 12h13M8 18h13"/>',
  medalla: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/>',
  libro: '<path d="M2 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H2Z"/><path d="M22 4h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8Z"/>',
  camion: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62L18.3 9.38a1 1 0 0 0-.78-.38H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  buscar: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  gps: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>',
  calendario: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  bascula: '<path d="M12 3v18M7 21h10"/><path d="M3 7h18"/><path d="m6 7-3 7a3 3 0 0 0 6 0Z"/><path d="m18 7-3 7a3 3 0 0 0 6 0Z"/>',
  grafica: '<path d="M3 3v18h18"/><path d="M8 16v-5M13 16V8M18 16v-9"/>',
  db: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>',
  ajustes: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  usuarios: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  escudo: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
  camara: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z"/><circle cx="12" cy="13" r="3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  mas: '<path d="M12 5v14M5 12h14"/>',
  reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
};
const ico = (n, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${I[n]}</svg>`;

// ---------- Utilidades ----------
const $ = (sel, raiz = document) => raiz.querySelector(sel);
const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const num = (n, d = 0) => Number(n).toLocaleString("es-CO", { minimumFractionDigits: d, maximumFractionDigits: d });
const TZ = { timeZone: "America/Bogota" };
const fFecha = (d) => new Date(d).toLocaleDateString("es-CO", { ...TZ, day: "numeric", month: "short", year: "numeric" });
const fFechaHora = (d) => new Date(d).toLocaleString("es-CO", { ...TZ, day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const DIA_TXT = { lunes: "lunes", martes: "martes", miercoles: "miércoles", jueves: "jueves", viernes: "viernes", sabado: "sábado", domingo: "domingo" };
const DIA_CORTO = { lunes: "L", martes: "M", miercoles: "X", jueves: "J", viernes: "V", sabado: "S", domingo: "D" };
const TIPO = {
  aprovechable: { txt: "Aprovechable", bolsa: "Bolsa blanca", c: "var(--blanca)" },
  no_aprovechable: { txt: "No aprovechable", bolsa: "Bolsa negra", c: "var(--negra)" },
  organico: { txt: "Orgánico", bolsa: "Bolsa verde", c: "var(--verde-bolsa)" }
};
const bolsa = (t, largo = false) => `<span class="bolsa" style="--c:${TIPO[t]?.c || "#999"}">${esc(TIPO[t]?.txt || t)}${largo ? ` <span class="suave" style="font-weight:400">· ${TIPO[t]?.bolsa}</span>` : ""}</span>`;
const NOVEDAD = { ruta_incumplida: "Ruta incumplida", acumulacion_residuos: "Acumulación de residuos", punto_critico: "Punto crítico", contenedor_danado: "Contenedor dañado", otra: "Otra novedad" };
const ESTADO_TXT = { reportado: "Reportado", en_revision: "En revisión", en_proceso: "En proceso", resuelto: "Resuelto", rechazado: "Rechazado" };
const estado = (e) => `<span class="estado e-${e}">${ESTADO_TXT[e] || e}</span>`;
const prioridad = (p) => `<span class="p-${p}">${p[0].toUpperCase() + p.slice(1)}</span>`;
const caso = (r) => "ER-" + r._id.slice(-4).toUpperCase();
const nombre = (u) => (u ? `${u.nombres} ${u.apellidos}` : "—");
const nombreEmpresa = (id) => buscar("empresas", id)?.nombre || "—";
const nombreSector = (id) => { const s = buscar("sectores", id); return s ? `${s.nombre} (${s.municipio})` : "—"; };
const barraDato = (v, max, texto, color) => `<div class="barra-dato"><i style="width:${max ? Math.max(4, (v / max) * 150) : 4}px;${color ? "background:" + color : ""}"></i><span>${texto}</span></div>`;

function tabla(columnas, filas, vacio = "No hay datos para mostrar.") {
  if (!filas.length) return `<div class="vacio">${vacio}</div>`;
  return `<div class="tabla-wrap"><table><thead><tr>${columnas.map((c) => `<th${c.n ? ' class="n"' : ""}>${esc(c.t)}</th>`).join("")}</tr></thead>
    <tbody>${filas.map((f, i) => `<tr${c_clase(columnas, f)}>${columnas.map((c) => `<td${c.n ? ' class="n"' : ""}>${c.f(f, i)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
const c_clase = (columnas, f) => (columnas.claseFila ? ` class="${columnas.claseFila(f)}"` : "");

function selectorSectores(id, seleccionado = "", { vacio = "Elige tu barrio", soloConRuta = false } = {}) {
  const porMunicipio = MUNICIPIOS.map((m) => {
    const sectores = DB.sectores.filter((s) => s.municipio === m && (!soloConRuta || DB.rutas.some((r) => r.sectores.includes(s._id))))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
    return sectores.length ? `<optgroup label="${m}">${sectores.map((s) => `<option value="${s._id}" ${s._id === seleccionado ? "selected" : ""}>${esc(s.nombre)}</option>`).join("")}</optgroup>` : "";
  }).join("");
  return `<select id="${id}"><option value="">${vacio}</option>${porMunicipio}</select>`;
}

// ---------- Avisos y confirmaciones ----------
let temporizador;
function aviso(texto) {
  const t = $("#toast"); t.textContent = texto; t.classList.add("ver");
  clearTimeout(temporizador); temporizador = setTimeout(() => t.classList.remove("ver"), 3200);
}
function confirmar(titulo, texto, boton = "Confirmar") {
  return new Promise((ok) => {
    const m = $("#modal");
    $("#modal-titulo").textContent = titulo; $("#modal-texto").textContent = texto; $("#modal-si").textContent = boton;
    m.hidden = false; $("#modal-si").focus();
    const cerrar = (v) => { m.hidden = true; $("#modal-si").onclick = $("#modal-no").onclick = m.onclick = null; ok(v); };
    $("#modal-si").onclick = () => cerrar(true);
    $("#modal-no").onclick = () => cerrar(false);
    m.onclick = (e) => { if (e.target === m) cerrar(false); };
  });
}
// Ejecuta una operación y muestra el error de validación en la caja indicada
function intentar(fn, cajaError) {
  try { if (cajaError) cajaError.innerHTML = ""; return fn(); }
  catch (e) {
    if (cajaError) cajaError.innerHTML = `<div class="error" role="alert">${esc(e.message)}</div>`; else aviso(e.message);
    return undefined;
  }
}

// ---------- Mapas (Leaflet + OpenStreetMap) ----------
let mapasActivos = [];
function crearMapa(el, centro = [7.11, -73.12], zoom = 12) {
  if (typeof L === "undefined") { el.innerHTML = `<div class="sin-mapa">El mapa necesita conexión a internet para cargar OpenStreetMap.</div>`; el.style.height = "auto"; return null; }
  const m = L.map(el, { scrollWheelZoom: false }).setView(centro, zoom);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "&copy; OpenStreetMap" }).addTo(m);
  mapasActivos.push(m);
  setTimeout(() => m.invalidateSize(), 60);
  return m;
}
const punto = (m, [lng, lat], color, popup, radio = 8) =>
  L.circleMarker([lat, lng], { radius: radio, color: "#17352a", weight: 1.5, fillColor: color, fillOpacity: .95 }).bindPopup(popup).addTo(m);

// ---------- Sesión (selector de rol del encabezado) ----------
function rolActual() {
  try { const r = localStorage.getItem(CLAVE_SESION); if (USUARIO_DEMO[r]) return r; } catch (e) {}
  return "ciudadano";
}
let ROL = rolActual();
const usuarioActual = () => buscar("usuarios", USUARIO_DEMO[ROL]);

// ---------- Próximas recolecciones de un sector ----------
const IDX_DIA = { domingo: 0, lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5, sabado: 6 };
function proximas(id_sector) {
  const ahora = new Date(Date.now() - 5 * 3600 * 1000);          // hora de Colombia
  const hoy = ahora.getUTCDay(), minutos = ahora.getUTCHours() * 60 + ahora.getUTCMinutes();
  const lista = [];
  for (const r of DB.rutas.filter((x) => x.activa && x.sectores.includes(id_sector))) {
    let mejor = null;
    for (const h of r.horarios) {
      const [hf, mf] = h.hora_fin.split(":").map(Number);
      let dif = (IDX_DIA[h.dia] - hoy + 7) % 7;
      if (dif === 0 && minutos > hf * 60 + mf) dif = 7;
      const orden = dif * 1440 + Number(h.hora_inicio.replace(":", ""));
      if (!mejor || orden < mejor.orden) mejor = { orden, dif, h };
    }
    if (mejor) lista.push({ ruta: r, ...mejor, cuando: mejor.dif === 0 ? "Hoy" : mejor.dif === 1 ? "Mañana" : DIA_TXT[mejor.h.dia] });
  }
  return lista.sort((a, b) => a.orden - b.orden);
}
const empresaCorta = (id) => (buscar("empresas", id)?.nombre || "").replace(/ (S\.A\.S?\.|E\.S\.P\.|S\.A\.)/g, "").replace(/^Asociación de /, "");

// =====================================================================
//  VISTAS DEL CIUDADANO
// =====================================================================
function vInicioCiudadano(v) {
  const u = usuarioActual();
  const sector = buscar("sectores", u.id_sector);
  const prox = sector ? proximas(sector._id) : [];
  const mios = DB.reportes.filter((r) => r.id_usuario === u._id).sort((a, b) => b.fecha_hora - a.fecha_hora);
  const ultimo = mios[0];
  v.innerHTML = `
  <div class="inicio-ciudadano">
    <div class="ancho">
      <p class="saludo">Hola, ${esc(u.nombres)} ${esc(u.apellidos.split(" ")[0])} 👋</p>
      <h1 class="titulo-camion">${ico("camion")}¿Cuándo pasa el camión?</h1>
    </div>
    <div class="pila">
      <form class="tarjeta buscador" id="f-buscar">
        <div class="campo">${selectorSectores("s-barrio")}</div>
        <div id="err-buscar"></div>
        <button class="btn grande" type="submit">${ico("buscar")}Buscar rutas</button>
        <a class="btn sec grande" href="#/rutas?gps=1">${ico("gps")}Usar mi ubicación</a>
      </form>
      ${sector ? `
      <section class="proximas" aria-label="Próxima recolección">
        <div class="proximas-cab">${ico("calendario")}Próxima recolección en ${esc(sector.nombre)}</div>
        ${prox.length ? prox.map((p) => `
          <div class="prox">
            <div><b>${p.cuando} · ${p.h.hora_inicio}–${p.h.hora_fin}</b><small>${esc(p.ruta.codigo)} · ${esc(empresaCorta(p.ruta.id_empresa))}</small></div>
            <span class="pill ${p.ruta.tipo_residuo}">${TIPO[p.ruta.tipo_residuo].txt}</span>
          </div>`).join("") : `<div class="prox"><div>Tu barrio aún no tiene rutas registradas.</div></div>`}
      </section>` : ""}
    </div>
    <div class="pila">
      <a class="tarjeta acceso" href="#/reportar"><span class="ico" style="background:var(--naranja-claro);color:var(--naranja)">${ico("megafono")}</span><div><b>Reportar una novedad</b><span>¿No pasó el camión o hay basura acumulada? Cuéntanos.</span></div></a>
      <a class="tarjeta acceso" href="#/mis-reportes"><span class="ico">${ico("lista")}</span><div><b>Mis reportes</b>
        <span>${ultimo ? `Último: ${esc(NOVEDAD[ultimo.tipo_novedad])} · ${ESTADO_TXT[ultimo.estado]}` : "Todavía no has enviado reportes."}</span></div></a>
      <a class="tarjeta acceso" href="#/ecopuntos"><span class="ico">${ico("medalla")}</span><div><b>${num(u.eco_puntos)} EcoPuntos</b><span>Ganas puntos cuando la empresa resuelve tus reportes.</span></div></a>
      <a class="tarjeta acceso" href="#/aprende"><span class="ico">${ico("libro")}</span><div><b>Aprende a separar</b><span>Bolsa blanca, negra y verde.</span></div></a>
    </div>
  </div>`;
  $("#f-buscar").onsubmit = (e) => {
    e.preventDefault();
    const s = $("#s-barrio").value;
    if (!s) { $("#err-buscar").innerHTML = `<div class="error" role="alert">Elige tu barrio para ver sus rutas.</div>`; return; }
    location.hash = "#/rutas?s=" + s;
  };
}

function tarjetaRuta(r, sectorId) {
  const dias = new Set(r.horarios.map((h) => h.dia));
  const p = sectorId ? proximas(sectorId).find((x) => x.ruta._id === r._id) : null;
  return `<article class="tarjeta ruta">
    <div class="ruta-cab"><b>${esc(r.codigo)}</b>${bolsa(r.tipo_residuo, true)}</div>
    <div class="suave">${esc(nombreEmpresa(r.id_empresa))}</div>
    <div class="dias" aria-label="Días: ${r.horarios.map((h) => DIA_TXT[h.dia]).join(", ")}">${DIAS.map((d) => `<span class="dia ${dias.has(d) ? "si" : ""}" title="${DIA_TXT[d]}">${DIA_CORTO[d]}</span>`).join("")}</div>
    <div class="franja">${r.horarios[0].hora_inicio} – ${r.horarios[0].hora_fin}</div>
    ${p ? `<div class="nota verde">Próxima: <b>${p.cuando}</b> a las ${p.h.hora_inicio}</div>` : ""}
  </article>`;
}

function vRutas(v, q) {
  const u = ROL === "ciudadano" ? usuarioActual() : null;
  const sel = q.s || (q.gps ? "" : u?.id_sector || "");
  v.innerHTML = `
  <div class="titulo"><div class="pre">Rutas y horarios</div><h1>¿Cuándo pasa el camión por mi barrio?</h1>
    <p>Elige tu barrio o usa la ubicación del celular. Saca las bolsas poco antes del horario de la ruta.</p></div>
  <form class="tarjeta pad filtros" id="f-rutas" style="align-items:flex-end">
    <label class="campo" style="flex:1 1 240px"><span>Barrio</span>${selectorSectores("r-sector", sel)}</label>
    <button class="btn" type="submit">${ico("buscar")}Buscar</button>
    <button class="btn sec" type="button" id="r-gps">${ico("gps")}Usar mi ubicación</button>
  </form>
  <div class="grid g2" style="margin-top:16px;align-items:start">
    <div id="r-res" class="pila"></div>
    <div class="tarjeta"><div class="tarjeta-cab"><h2>Mapa</h2><span class="meta" id="r-mapa-meta"></span></div><div id="r-mapa" class="mapa alto"></div></div>
  </div>`;
  const mapa = crearMapa($("#r-mapa"));
  let capa = mapa ? L.layerGroup().addTo(mapa) : null;

  function porSector(id) {
    const s = buscar("sectores", id);
    const rutas = DB.rutas.filter((r) => r.activa && r.sectores.includes(id));
    const [lng, lat] = s.ubicacion.coordinates;
    // Consulta 1 desde el barrio elegido: otros sectores con rutas a menos de 1,5 km
    let max = 1500, cerca = consulta1({ lng, lat, max }).filter((x) => x.sector !== s.nombre);
    // Si el barrio no tiene rutas y no hay nada a 1,5 km, se amplía a 5 km (igual que con el GPS)
    if (!rutas.length && !cerca.length) { max = 5000; cerca = consulta1({ lng, lat, max }).filter((x) => x.sector !== s.nombre); }
    const otros = [...new Map(cerca.map((x) => [x.sector, x])).values()];
    $("#r-res").innerHTML = (rutas.length
      ? `<p class="suave" style="margin:0">${rutas.length} ruta${rutas.length > 1 ? "s" : ""} en <b>${esc(s.nombre)}</b> (${esc(s.municipio)})</p>` + rutas.map((r) => tarjetaRuta(r, id)).join("")
      : `<div class="tarjeta pad"><b>Aún no hay rutas registradas para ${esc(s.nombre)}.</b><p class="suave" style="margin:6px 0 0">Consulta con la empresa de aseo de ${esc(s.municipio)} o revisa las rutas de los barrios cercanos.</p></div>`) +
      (otros.length
        ? `<div class="nota" style="margin-top:6px">Cerca de ${esc(s.nombre)}: ${cerca.length} ruta${cerca.length > 1 ? "s" : ""} en ${otros.length} sector${otros.length > 1 ? "es" : ""} a menos de ${num(max / 1000, 1)} km.</div>` +
          otros.map((o) => `<h3 style="margin:8px 0 0">${esc(o.sector)} <span class="suave" style="font-weight:400;font-size:15px">· ${num(o.distancia_m)} m</span></h3>` +
            cerca.filter((x) => x.sector === o.sector).map((x) => tarjetaRuta(DB.rutas.find((r) => r.codigo === x.ruta), DB.sectores.find((y) => y.nombre === x.sector)?._id)).join("")).join("")
        : "");
    if (mapa) {
      capa.clearLayers();
      const circulo = L.circle([lat, lng], { radius: max, color: "#d9822b", weight: 1, fillOpacity: .05 }).addTo(capa);
      // Las rutas se asocian al barrio (no tienen recorrido), así que se rotulan sobre el punto del barrio
      const rotulo = () => ({ permanent: true, direction: "top", offset: [0, -8], className: "rotulo-ruta" });
      punto(capa, [lng, lat], "#d9822b", `<b>${esc(s.nombre)}</b> (tu barrio)<br>${rutas.map((r) => esc(r.codigo)).join(", ") || "Sin rutas"}`, 10)
        .bindTooltip(`<b>${esc(s.nombre)}</b><br>${rutas.map((r) => esc(r.codigo)).join("<br>") || "Sin rutas"}`, rotulo());
      otros.forEach((o) => punto(capa, o.coordenadas, "#2e7d32", `<b>${esc(o.sector)}</b> · ${num(o.distancia_m)} m`)
        .bindTooltip(`<b>${esc(o.sector)}</b><br>${cerca.filter((c) => c.sector === o.sector).map((c) => esc(c.ruta)).join("<br>")}`, rotulo()));
      mapa.fitBounds(circulo.getBounds());
    }
    $("#r-mapa-meta").textContent = `${s.nombre} · Consulta 1 · $geoNear`;
  }

  // Consulta 1: rutas cercanas a la ubicación ($geoNear + $lookup)
  function porUbicacion(lng, lat, origen) {
    let max = 1500, res = consulta1({ lng, lat, max });
    if (!res.length) { max = 5000; res = consulta1({ lng, lat, max }); }
    const sectores = [...new Map(res.map((x) => [x.sector, x])).values()];
    $("#r-res").innerHTML = `<div class="nota">${esc(origen)}: ${res.length ? `${res.length} rutas en ${sectores.length} sectores a menos de ${num(max / 1000, 1)} km.` : "no encontramos rutas a menos de 5 km."}</div>` +
      sectores.map((s) => `<h3 style="margin:8px 0 0">${esc(s.sector)} <span class="suave" style="font-weight:400;font-size:15px">· ${num(s.distancia_m)} m</span></h3>` +
        res.filter((x) => x.sector === s.sector).map((x) => tarjetaRuta(DB.rutas.find((r) => r.codigo === x.ruta), DB.sectores.find((y) => y.nombre === x.sector)?._id)).join("")).join("");
    if (mapa) {
      capa.clearLayers();
      const circulo = L.circle([lat, lng], { radius: max, color: "#d9822b", weight: 1, fillOpacity: .05 }).addTo(capa);
      punto(capa, [lng, lat], "#d9822b", "Tu ubicación", 9);
      sectores.forEach((s) => punto(capa, s.coordenadas, "#2e7d32", `<b>${esc(s.sector)}</b> · ${num(s.distancia_m)} m`)
        .bindTooltip(`<b>${esc(s.sector)}</b><br>${res.filter((x) => x.sector === s.sector).map((x) => esc(x.ruta)).join("<br>")}`, { permanent: true, direction: "top", offset: [0, -8], className: "rotulo-ruta" }));
      mapa.fitBounds(circulo.getBounds());
    }
    $("#r-mapa-meta").textContent = "Consulta 1 · $geoNear";
  }

  function gps() {
    $("#r-res").innerHTML = `<div class="nota">Buscando tu ubicación…</div>`;
    const demo = () => porUbicacion(-73.1080, 7.1190, "No pudimos usar el GPS; mostramos un punto de ejemplo (Cra. 33 con Calle 48)");
    if (!navigator.geolocation) return demo();
    navigator.geolocation.getCurrentPosition((p) => {
      const { longitude: lng, latitude: lat } = p.coords;
      // Fuera del área metropolitana se usa el punto de ejemplo de la consulta 1
      if (lat < 6.9 || lat > 7.25 || lng < -73.25 || lng > -72.95) porUbicacion(-73.1080, 7.1190, "Estás fuera del área metropolitana; mostramos un punto de ejemplo (Cra. 33 con Calle 48)");
      else porUbicacion(lng, lat, "Según tu ubicación");
    }, demo, { timeout: 8000 });
  }

  $("#f-rutas").onsubmit = (e) => { e.preventDefault(); const s = $("#r-sector").value; if (s) porSector(s); else $("#r-res").innerHTML = `<div class="error">Elige un barrio.</div>`; };
  $("#r-sector").onchange = () => $("#r-sector").value && porSector($("#r-sector").value);
  $("#r-gps").onclick = gps;
  if (q.gps) gps(); else if (sel) porSector(sel); else $("#r-res").innerHTML = `<div class="tarjeta pad suave">Elige un barrio para ver sus rutas.</div>`;
}

function vReportar(v) {
  const u = usuarioActual();
  let foto = "", ubicacion = null;
  v.innerHTML = `
  <div class="titulo"><div class="pre">Reportar</div><h1>Reportar una novedad del servicio</h1>
    <p>Tu reporte llega a la empresa de aseo que atiende el sector y puedes seguir su estado en "Mis reportes".</p></div>
  <form class="tarjeta pad form" id="f-rep" style="max-width:720px" novalidate>
    <label class="campo"><span>¿Dónde ocurre?</span>${selectorSectores("rp-sector", u.id_sector, { vacio: "Elige el barrio" })}</label>
    <div id="rp-empresa"></div>
    <fieldset class="campo" style="border:0;padding:0;margin:0"><span>¿Qué pasó?</span>
      <div class="opciones">${TIPOS_NOVEDAD.map((t) => `<label class="opcion"><input type="radio" name="tipo" value="${t}"><span>${NOVEDAD[t]}</span></label>`).join("")}</div></fieldset>
    <label class="campo"><span>Descripción</span><textarea id="rp-desc" maxlength="500" placeholder="Ej.: El camión no pasó el lunes y hay bolsas en la esquina"></textarea><small id="rp-cont">0 / 500</small></label>
    <fieldset class="campo" style="border:0;padding:0;margin:0"><span>Prioridad</span>
      <div class="opciones">${["alta", "media", "baja"].map((p) => `<label class="opcion"><input type="radio" name="prio" value="${p}" ${p === "media" ? "checked" : ""}><span style="flex-direction:column;align-items:flex-start;gap:0">${p[0].toUpperCase() + p.slice(1)}<small class="suave" style="font-weight:400">+${PUNTOS[p]} EcoPuntos</small></span></label>`).join("")}</div></fieldset>
    <div class="campo"><span>Ubicación de la novedad</span>
      <small>Usa el GPS del celular o toca el mapa en el punto exacto.</small>
      <button class="btn sec" type="button" id="rp-gps">${ico("gps")}<span id="rp-gps-txt">Usar mi ubicación GPS</span></button>
      <div id="rp-mapa" class="mapa" style="height:280px;border-radius:12px;border:1px solid var(--borde)"></div>
      <small id="rp-ubic" class="suave">Todavía no has marcado la ubicación.</small></div>
    <div class="campo"><span>Foto (opcional)</span>
      <label class="btn sec" style="cursor:pointer">${ico("camara")}<span id="rp-foto-txt">Tomar o elegir foto</span><input type="file" id="rp-foto" accept="image/*" capture="environment" class="oculto"></label>
      <img id="rp-prev" class="foto oculto" alt="Vista previa de la foto"></div>
    <label class="campo"><span>Comentario adicional (opcional)</span><input id="rp-com" maxlength="300" placeholder="Ej.: Junto al parque"></label>
    <div id="rp-err"></div>
    <button class="btn grande naranja" type="submit">${ico("megafono")}Enviar reporte</button>
  </form>`;
  const mostrarEmpresa = () => {
    const id = $("#rp-sector").value, e = id ? OPS.empresaDelSector(id) : null;
    $("#rp-empresa").innerHTML = !id ? "" : e
      ? `<div class="nota">Lo atiende <b>${esc(e.nombre.replace(/\.$/, ""))}</b>. EcoRuta no reemplaza su canal oficial de PQR: ${esc(e.canal_pqr)}.</div>`
      : `<div class="nota naranja">Este barrio todavía no tiene una ruta ni una empresa asignada.</div>`;
  };
  mostrarEmpresa();
  $("#rp-sector").onchange = mostrarEmpresa;
  $("#rp-desc").oninput = (e) => ($("#rp-cont").textContent = `${e.target.value.length} / 500`);
  $("#rp-foto").onchange = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const img = new Image(), url = URL.createObjectURL(f);
    img.onload = () => {   // se reduce la foto para guardarla en el navegador
      const k = Math.min(1, 640 / Math.max(img.width, img.height)), c = document.createElement("canvas");
      c.width = img.width * k; c.height = img.height * k; c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      foto = c.toDataURL("image/jpeg", .7); $("#rp-prev").src = foto; $("#rp-prev").classList.remove("oculto");
      $("#rp-foto-txt").textContent = "Cambiar foto"; URL.revokeObjectURL(url);
    };
    img.src = url;
  };
  // Ubicación obligatoria: GPS del celular o un punto marcado en el mapa
  const mapaRep = crearMapa($("#rp-mapa"), [7.11, -73.12], 13);
  let marcador = null;
  const fijarUbicacion = (lng, lat, origen) => {
    ubicacion = [Number(lng.toFixed(5)), Number(lat.toFixed(5))];
    $("#rp-ubic").textContent = `Ubicación marcada ${origen} ✓ (${ubicacion[1]}, ${ubicacion[0]})`;
    $("#rp-ubic").classList.remove("suave");
    if (mapaRep) {
      if (marcador) marcador.remove();
      marcador = L.circleMarker([lat, lng], { radius: 10, color: "#17352a", weight: 2, fillColor: "#d9822b", fillOpacity: 1 }).addTo(mapaRep);
      mapaRep.setView([lat, lng], Math.max(mapaRep.getZoom(), 16));
    }
  };
  const centrarEnSector = () => {
    const s = buscar("sectores", $("#rp-sector").value);
    if (mapaRep && s && !ubicacion) mapaRep.setView([s.ubicacion.coordinates[1], s.ubicacion.coordinates[0]], 16);
  };
  centrarEnSector();
  $("#rp-sector").addEventListener("change", centrarEnSector);
  if (mapaRep) mapaRep.on("click", (ev) => fijarUbicacion(ev.latlng.lng, ev.latlng.lat, "en el mapa"));
  $("#rp-gps").onclick = () => {
    if (!navigator.geolocation) return aviso("Este navegador no permite usar el GPS. Toca el mapa para marcar la ubicación.");
    $("#rp-gps-txt").textContent = "Obteniendo ubicación…";
    navigator.geolocation.getCurrentPosition((p) => {
      $("#rp-gps-txt").textContent = "Usar mi ubicación GPS";
      fijarUbicacion(p.coords.longitude, p.coords.latitude, "con el GPS");
    }, () => { $("#rp-gps-txt").textContent = "Usar mi ubicación GPS"; aviso("No pudimos obtener tu ubicación. Toca el mapa para marcarla."); }, { timeout: 8000 });
  };
  $("#f-rep").onsubmit = (e) => {
    e.preventDefault();
    const r = intentar(() => OPS.crearReporte(u, {
      id_sector: $("#rp-sector").value, tipo_novedad: $("input[name=tipo]:checked")?.value || "",
      descripcion: $("#rp-desc").value, prioridad: $("input[name=prio]:checked")?.value || "",
      ubicacion, url_foto: foto, comentario: $("#rp-com").value
    }), $("#rp-err"));
    if (!r) return;
    v.innerHTML = `<div class="tarjeta pad" style="max-width:560px;margin:20px auto;text-align:center">
      <div class="ico" style="width:64px;height:64px;margin:0 auto 10px;border-radius:50%;background:var(--verde-claro);color:var(--verde);display:grid;place-items:center">${ico("check", 'style="width:34px;height:34px"')}</div>
      <h1 style="margin:0 0 6px">¡Reporte enviado!</h1>
      <p class="suave">Tu caso es el <b>${caso(r)}</b>. Lo atiende ${esc(nombreEmpresa(r.id_empresa).replace(/\.$/, ""))}. Cuando lo resuelvan ganarás ${PUNTOS[r.prioridad]} EcoPuntos.</p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><a class="btn" href="#/mis-reportes">Ver mis reportes</a><a class="btn sec" href="#/inicio">Volver al inicio</a></div></div>`;
  };
}

function lineaTiempo(r) {
  if (r.estado === "rechazado") {
    const f = r.historial_estados.find((h) => h.estado === "rechazado");
    return `<div class="nota naranja">La empresa rechazó este reporte${f ? " el " + fFechaHora(f.fecha_cambio) : ""} (por ejemplo, por estar duplicado).</div>`;
  }
  return `<div class="linea-tiempo">${FLUJO.map((e) => {
    const h = r.historial_estados.find((x) => x.estado === e);
    const hecho = FLUJO.indexOf(r.estado) >= FLUJO.indexOf(e);
    return `<div class="paso ${hecho ? "hecho" : ""}">${ESTADO_TXT[e]}${h ? `<small>${fFechaHora(h.fecha_cambio)}</small>` : ""}</div>`;
  }).join("")}</div>`;
}

function vMisReportes(v) {
  const u = usuarioActual();
  const mios = DB.reportes.filter((r) => r.id_usuario === u._id).sort((a, b) => b.fecha_hora - a.fecha_hora);
  v.innerHTML = `
  <div class="titulo"><div class="pre">Mis reportes</div><h1>Seguimiento de mis reportes</h1><p>Aquí ves en qué estado está cada caso.</p></div>
  <div class="pila" style="max-width:820px">
  ${mios.length ? mios.map((r) => `
    <article class="tarjeta reporte">
      <div class="reporte-cab"><div><b>${NOVEDAD[r.tipo_novedad]}</b><div class="suave" style="font-size:14px">${caso(r)} · ${esc(nombreSector(r.id_sector))} · ${fFechaHora(r.fecha_hora)}</div></div>${estado(r.estado)}</div>
      <p style="margin:0">${esc(r.descripcion)}</p>
      ${r.evidencia?.url_foto?.startsWith("data:") ? `<img class="foto" src="${r.evidencia.url_foto}" alt="Foto del reporte">` : ""}
      ${r.evidencia?.comentario ? `<div class="suave" style="font-size:14px">Comentario: ${esc(r.evidencia.comentario)}</div>` : ""}
      ${lineaTiempo(r)}
      <div class="suave" style="font-size:14px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center">
        <span>Prioridad ${prioridad(r.prioridad)} · ${esc(nombreEmpresa(r.id_empresa))}</span>
        ${r.estado === "reportado" ? `<button class="btn peligro chico" data-retirar="${r._id}">Retirar reporte</button>` : ""}
      </div>
    </article>`).join("") : `<div class="tarjeta pad">Todavía no has enviado reportes. <a href="#/reportar">Reportar una novedad</a></div>`}
  </div>`;
  $$("[data-retirar]").forEach((b) => (b.onclick = async () => {
    if (!(await confirmar("¿Retirar este reporte?", "La empresa ya no lo verá. Solo puedes retirarlo mientras no esté en revisión.", "Retirar"))) return;
    intentar(() => { OPS.eliminarReporte(u, b.dataset.retirar); aviso("Reporte retirado"); render(); });
  }));
}

function vEcoPuntos(v) {
  const u = usuarioActual();
  const ranking = consulta5();                              // Consulta 5
  const yo = `${u.nombres} ${u.apellidos}`;
  const puesto = ranking.findIndex((x) => x.ciudadano === yo) + 1;
  const max = Math.max(1, ...ranking.map((x) => x.eco_puntos));
  const cols = [
    { t: "Puesto", n: 1, f: (x, i) => (x.eco_puntos > 0 && i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1) },
    { t: "Ciudadano", f: (x) => `<b>${esc(x.ciudadano)}</b>${x.ciudadano === yo ? ' <span class="etq">Tú</span>' : ""}<div class="suave" style="font-size:13px">${esc(x.sector)}</div>` },
    { t: "EcoPuntos", f: (x) => barraDato(x.eco_puntos, max, num(x.eco_puntos)) },
    { t: "Resueltos", n: 1, f: (x) => `${x.reportes_resueltos} / ${x.reportes_enviados}` }
  ];
  cols.claseFila = (x) => (x.ciudadano === yo ? "yo" : "");
  v.innerHTML = `
  <div class="titulo"><div class="pre">EcoPuntos</div><h1>Tus EcoPuntos</h1><p>Cada reporte que la empresa resuelve te da puntos según su prioridad.</p></div>
  <div class="grid g2" style="align-items:start">
    <div class="pila">
      <div class="tarjeta pad"><div class="puntos-grande">${num(u.eco_puntos)}</div><div class="suave">EcoPuntos${puesto ? ` · puesto ${puesto} de ${ranking.length}` : ""}</div></div>
      <div class="tarjeta pad"><h2>¿Cómo se ganan?</h2>
        <div class="grid" style="gap:8px;grid-template-columns:repeat(3,1fr)">${["alta", "media", "baja"].map((p) => `<div class="tarjeta pad" style="box-shadow:none;text-align:center"><div style="font-size:26px;font-weight:800;color:var(--verde)">+${PUNTOS[p]}</div><div class="suave">Prioridad ${p}</div></div>`).join("")}</div>
        <p class="suave" style="margin:12px 0 0;font-size:14px">Los puntos se suman una sola vez, cuando el reporte pasa a "Resuelto". Los reportes rechazados no suman.</p></div>
    </div>
    <div class="tarjeta"><div class="tarjeta-cab"><h2>Ranking de ciudadanos</h2><span class="meta">Consulta 5</span></div>${tabla(cols, ranking)}</div>
  </div>`;
}

function vAprende(v, q) {
  let filtro = q.c || "todos", texto = "";
  const COLOR = { blanco: ["Bolsa blanca", "var(--blanca)", "Aprovechables"], negro: ["Bolsa negra", "var(--negra)", "No aprovechables"], verde: ["Bolsa verde", "var(--verde-bolsa)", "Orgánicos"] };
  v.innerHTML = `
  <div class="titulo"><div class="pre">Aprende a separar</div><h1>Separa en la fuente</h1><p>Código de colores nacional (Resolución 2184 de 2019).</p></div>
  <div class="grid g3" style="margin-bottom:16px">${Object.entries(COLOR).map(([k, [b, c, t]]) => `
    <button class="tarjeta pad" data-c="${k}" style="text-align:left;cursor:pointer;border-left:8px solid ${c}"><b style="font-size:17px">${b}</b><div class="suave">${t}</div></button>`).join("")}</div>
  <div class="filtros">
    ${["todos", "blanco", "negro", "verde"].map((c) => `<button class="filtro" data-f="${c}" aria-pressed="${c === filtro}">${c === "todos" ? "Todos" : COLOR[c][0]}</button>`).join("")}
    <label class="campo" style="flex:1 1 220px"><input id="ap-buscar" type="search" placeholder="Buscar: pilas, compost, cartón…" aria-label="Buscar contenido"></label>
  </div>
  <div id="ap-lista" class="grid g3"></div>`;
  const normal = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  function pintar() {
    $$("[data-f]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.f === filtro));
    const t = normal(texto.trim());
    const lista = DB.contenidos_educativos   // equivalente al índice de texto tx_contenidos
      .filter((c) => (filtro === "todos" || c.categoria === filtro) && (!t || normal([c.titulo, c.texto, ...(c.palabras_clave || [])].join(" ")).includes(t)))
      .sort((a, b) => b.fecha_publicacion - a.fecha_publicacion);
    $("#ap-lista").innerHTML = lista.length ? lista.map((c) => `
      <article class="tarjeta contenido" style="--c:${COLOR[c.categoria][1]}"><div class="franja-color"></div><div class="cuerpo">
        <span class="etq" style="justify-self:start">${COLOR[c.categoria][0]}</span><h3>${esc(c.titulo)}</h3><p>${esc(c.texto)}</p>
        <div>${(c.palabras_clave || []).map((p) => `<span class="etq" style="background:#f7f5ef;font-weight:500">#${esc(p)}</span>`).join("")}</div></div></article>`).join("")
      : `<div class="tarjeta pad suave">No encontramos contenidos con esa búsqueda.</div>`;
  }
  $$("[data-f]").forEach((b) => (b.onclick = () => { filtro = b.dataset.f; pintar(); }));
  $$("[data-c]").forEach((b) => (b.onclick = () => { filtro = b.dataset.c; pintar(); }));
  $("#ap-buscar").oninput = (e) => { texto = e.target.value; pintar(); };
  pintar();
}

// =====================================================================
//  VISTAS DEL OPERADOR DE EMPRESA
// =====================================================================
function tablaReportes(lista, { conEmpresa = false, acciones = true } = {}) {
  return tabla([
    { t: "Caso", f: (r) => `<b class="nowrap">${caso(r)}</b><div class="suave nowrap" style="font-size:13px">${fFechaHora(r.fecha_hora)}</div>` },
    { t: "Novedad", f: (r) => `<b>${NOVEDAD[r.tipo_novedad]}</b><div style="font-size:14px;max-width:340px">${esc(r.descripcion)}</div>${r.evidencia?.url_foto ? `<div class="suave" style="font-size:13px">📷 Con foto</div>` : ""}` },
    { t: "Sector", f: (r) => esc(nombreSector(r.id_sector)) },
    ...(conEmpresa ? [{ t: "Empresa", f: (r) => esc(nombreEmpresa(r.id_empresa)) }] : []),
    { t: "Prioridad", f: (r) => prioridad(r.prioridad) },
    { t: "Ciudadano", f: (r) => esc(nombre(buscar("usuarios", r.id_usuario))) },
    { t: "Estado", f: (r) => estado(r.estado) },
    ...(acciones ? [{ t: "Acción", f: (r) => {
      const sig = OPS.siguienteEstado(r.estado);
      const rech = ["reportado", "en_revision"].includes(r.estado);
      return `<div style="display:flex;gap:6px;flex-wrap:wrap">${sig ? `<button class="btn chico" data-estado="${sig}" data-id="${r._id}">Pasar a ${ESTADO_TXT[sig]}</button>` : ""}${rech ? `<button class="btn chico peligro" data-estado="rechazado" data-id="${r._id}">Rechazar</button>` : ""}${!sig && !rech ? '<span class="suave">—</span>' : ""}</div>`;
    } }] : [])
  ], lista, "No hay reportes con este filtro.");
}

function enlazarCambiosDeEstado(u) {
  $$("[data-estado]").forEach((b) => (b.onclick = async () => {
    const r = buscar("reportes", b.dataset.id), nuevo = b.dataset.estado;
    const extra = nuevo === "resuelto" ? ` El ciudadano recibirá ${PUNTOS[r.prioridad]} EcoPuntos.` : nuevo === "rechazado" ? " Esta acción no se puede deshacer." : "";
    if (!(await confirmar(`¿Pasar ${caso(r)} a "${ESTADO_TXT[nuevo]}"?`, `Estado actual: ${ESTADO_TXT[r.estado]}.${extra}`, nuevo === "rechazado" ? "Rechazar" : "Confirmar"))) return;
    intentar(() => {
      const pts = OPS.cambiarEstado(u, r._id, nuevo);
      aviso(`${caso(r)} quedó en "${ESTADO_TXT[nuevo]}"${pts ? ` · +${pts} EcoPuntos para el ciudadano` : ""}`);
      render();
    });
  }));
}

let filtroOperador = "pendientes";
function vOpReportes(v) {
  const u = usuarioActual(), empresa = buscar("empresas", u.id_empresa);
  const todos = DB.reportes.filter((r) => r.id_empresa === u.id_empresa).sort((a, b) => b.fecha_hora - a.fecha_hora);
  const FILTROS = { pendientes: ["Pendientes", (r) => ["reportado", "en_revision", "en_proceso"].includes(r.estado)], todos: ["Todos", () => true], ...Object.fromEntries(ESTADOS.map((e) => [e, [ESTADO_TXT[e], (r) => r.estado === e]])) };
  const lista = todos.filter(FILTROS[filtroOperador][1]);
  const pend = todos.filter(FILTROS.pendientes[1]);
  v.innerHTML = `
  <div class="titulo"><div class="pre">Operador · ${esc(empresa?.nombre)}</div><h1>Reportes de mi empresa</h1>
    <p>Atiende los reportes de los ciudadanos. Cada reporte avanza paso a paso: Reportado → En revisión → En proceso → Resuelto.</p></div>
  <div class="grid g4" style="margin-bottom:16px">
    <div class="tarjeta kpi"><div class="v">${pend.length}</div><div class="l">pendientes</div></div>
    <div class="tarjeta kpi"><div class="v">${pend.filter((r) => r.prioridad === "alta").length}</div><div class="l">pendientes de prioridad alta</div></div>
    <div class="tarjeta kpi"><div class="v">${todos.filter((r) => r.estado === "resuelto").length}</div><div class="l">resueltos</div></div>
    <div class="tarjeta kpi"><div class="v">${todos.length}</div><div class="l">reportes en total</div></div>
  </div>
  <div class="filtros">${Object.entries(FILTROS).map(([k, [t, f]]) => `<button class="filtro" data-filtro="${k}" aria-pressed="${k === filtroOperador}">${t} <span class="suave">${todos.filter(f).length}</span></button>`).join("")}</div>
  <div class="tarjeta">${tablaReportes(lista)}</div>`;
  $$("[data-filtro]").forEach((b) => (b.onclick = () => { filtroOperador = b.dataset.filtro; render(); }));
  enlazarCambiosDeEstado(u);
}

function vOpPesaje(v) {
  const u = usuarioActual(), empresa = buscar("empresas", u.id_empresa);
  const rutas = DB.rutas.filter((r) => r.id_empresa === u.id_empresa);
  const regs = DB.registros_residuos.filter((r) => r.id_empresa === u.id_empresa).sort((a, b) => b.fecha - a.fecha);
  const mesActual = hoyLocal().slice(0, 7);
  const delMes = regs.filter((r) => fechaISO(r.fecha).slice(0, 7) === mesActual);
  v.innerHTML = `
  <div class="titulo"><div class="pre">Operador · ${esc(empresa?.nombre)}</div><h1>Registrar pesaje</h1>
    <p>Al terminar una ruta, registra los kilos recolectados. La empresa, la zona y el tipo de residuo se toman de la ruta.</p></div>
  <div class="grid g2" style="align-items:start">
    <form class="tarjeta pad form" id="f-pes" novalidate>
      <label class="campo"><span>Ruta</span><select id="pe-ruta"><option value="">Elige la ruta</option>${rutas.filter((r) => r.activa).map((r) => `<option value="${r._id}">${esc(r.codigo)} · ${TIPO[r.tipo_residuo].txt} · ${r.zona}</option>`).join("")}</select></label>
      <div id="pe-info"></div>
      <div class="fila">
        <label class="campo"><span>Fecha de la recolección</span><input type="date" id="pe-fecha" value="${hoyLocal()}" max="${hoyLocal()}"></label>
        <label class="campo"><span>Cantidad (kg)</span><input type="number" id="pe-kg" min="0.1" step="0.1" inputmode="decimal" placeholder="Ej.: 8450"></label>
      </div>
      <label class="campo"><span>Observaciones (opcional)</span><input id="pe-obs" maxlength="300" placeholder="Ej.: Vía cerrada, se tomó desvío"></label>
      <div id="pe-err"></div>
      <button class="btn grande" type="submit">${ico("bascula")}Guardar pesaje</button>
    </form>
    <div class="pila">
      <div class="grid g3" style="gap:12px">
        <div class="tarjeta kpi"><div class="v">${num(delMes.reduce((s, r) => s + r.cantidad_kg, 0) / 1000, 2)} t</div><div class="l">este mes</div></div>
        <div class="tarjeta kpi"><div class="v">${num(regs.reduce((s, r) => s + r.cantidad_kg, 0) / 1000, 2)} t</div><div class="l">en total</div></div>
        <div class="tarjeta kpi"><div class="v">${regs.length}</div><div class="l">registros</div></div>
      </div>
      <div class="tarjeta"><div class="tarjeta-cab"><h2>Historial de pesajes</h2><span class="meta">registros_residuos</span></div>
        ${tabla([
          { t: "Fecha", f: (r) => `<span class="nowrap">${fFecha(r.fecha)}</span>` },
          { t: "Ruta", f: (r) => `<span class="nowrap">${esc(buscar("rutas", r.id_ruta)?.codigo)}</span>` },
          { t: "Residuo", f: (r) => bolsa(r.tipo_residuo) },
          { t: "Kilos", n: 1, f: (r) => num(r.cantidad_kg, r.cantidad_kg % 1 ? 1 : 0) },
          { t: "Registró", f: (r) => esc(nombre(buscar("usuarios", r.registrado_por))) }
        ], regs, "Tu empresa todavía no tiene pesajes.")}</div>
    </div>
  </div>`;
  $("#pe-ruta").onchange = () => {
    const r = buscar("rutas", $("#pe-ruta").value);
    $("#pe-info").innerHTML = r ? `<div class="nota">${bolsa(r.tipo_residuo, true)} · Zona ${r.zona} · ${r.sectores.map((s) => esc(buscar("sectores", s)?.nombre)).join(", ")}</div>` : "";
  };
  $("#f-pes").onsubmit = (e) => {
    e.preventDefault();
    const reg = intentar(() => OPS.registrarPesaje(u, { id_ruta: $("#pe-ruta").value, fecha: $("#pe-fecha").value, cantidad_kg: $("#pe-kg").value, observaciones: $("#pe-obs").value }), $("#pe-err"));
    if (reg) { aviso(`Pesaje guardado: ${num(reg.cantidad_kg)} kg`); render(); }
  };
}
const fechaISO = (d) => new Date(new Date(d).getTime() - 5 * 3600 * 1000).toISOString().slice(0, 10);

// =====================================================================
//  VISTAS DEL ADMINISTRADOR
// =====================================================================
const filtroPanel = { mes: "todos", id_empresa: "", zona: "" };
function mesesConDatos() {
  const s = new Set(DB.registros_residuos.map((r) => fechaISO(r.fecha).slice(0, 7)));
  return [...s].sort().reverse();
}
const nombreMes = (m) => new Date(`${m}-15T12:00:00Z`).toLocaleDateString("es-CO", { month: "long", year: "numeric" });

function vPanel(v) {
  const f = filtroPanel;
  const c2 = consulta2({ mes: f.mes, id_empresa: f.id_empresa, zona: f.zona });
  const c3 = consulta3({ limite: 5, id_empresa: f.id_empresa, zona: f.zona });
  const c4 = consulta4({ corte: hoyLocal(), id_empresa: f.id_empresa, zona: f.zona });
  const ton = c2.reduce((s, x) => s + x.toneladas, 0);
  const aprov = c2.filter((x) => x.tipo_residuo !== "no_aprovechable").reduce((s, x) => s + x.toneladas, 0);
  const pend = c4.reduce((s, x) => s + x.pendientes, 0);
  const dias = pend ? c4.reduce((s, x) => s + x.dias_promedio_abierto * x.pendientes, 0) / pend : 0;
  const activos = DB.usuarios.filter((u) => u.rol === "ciudadano" && u.activo).length;
  const max2 = Math.max(0, ...c2.map((x) => x.toneladas)), max3 = Math.max(0, ...c3.map((x) => x.total_reportes)), max4 = Math.max(0, ...c4.map((x) => x.pendientes));
  v.innerHTML = `
  <div class="titulo"><div class="pre">Administrador</div><h1>Panel de indicadores</h1>
    <p>Indicadores del servicio de aseo del área metropolitana, calculados con las consultas 2, 3 y 4 sobre los datos actuales.</p></div>
  <div class="tarjeta pad filtros" style="align-items:flex-end">
    <label class="campo"><span>Empresa</span><select id="pf-emp"><option value="">Todas las empresas</option>${DB.empresas.map((e) => `<option value="${e._id}" ${e._id === f.id_empresa ? "selected" : ""}>${esc(e.nombre)}</option>`).join("")}</select></label>
    <label class="campo"><span>Zona</span><select id="pf-zona"><option value="">Todas las zonas</option>${ZONAS.map((z) => `<option ${z === f.zona ? "selected" : ""}>${z}</option>`).join("")}</select></label>
    <label class="campo"><span>Periodo de los pesajes</span><select id="pf-mes"><option value="todos">Todo el periodo</option>${mesesConDatos().map((m) => `<option value="${m}" ${m === f.mes ? "selected" : ""}>${nombreMes(m)}</option>`).join("")}</select></label>
    <button class="btn sec" id="pf-limpiar" type="button">Quitar filtros</button>
  </div>
  <div class="grid g4" style="margin:16px 0">
    <div class="tarjeta kpi"><div class="v">${num(ton, 2)} t</div><div class="l">toneladas recolectadas</div></div>
    <div class="tarjeta kpi"><div class="v">${ton ? num((aprov / ton) * 100, 1) : 0} %</div><div class="l">aprovechables y orgánicos</div></div>
    <div class="tarjeta kpi"><div class="v">${pend}</div><div class="l">reportes sin resolver hoy</div></div>
    <div class="tarjeta kpi"><div class="v">${pend ? num(dias, 1) : "—"}</div><div class="l">días abiertos en promedio</div></div>
    <div class="tarjeta kpi"><div class="v">${activos}</div><div class="l">ciudadanos activos</div></div>
  </div>
  <div class="pila">
    <div class="tarjeta"><div class="tarjeta-cab"><h2>Toneladas por empresa y tipo de residuo</h2><span class="meta">Consulta 2</span></div>
      ${tabla([
        { t: "Empresa", f: (x) => `<b>${esc(x.empresa)}</b>` },
        { t: "Tipo de residuo", f: (x) => bolsa(x.tipo_residuo) },
        { t: "Recolecciones", n: 1, f: (x) => x.recolecciones },
        { t: "Toneladas", f: (x) => barraDato(x.toneladas, max2, num(x.toneladas, 2) + " t", TIPO[x.tipo_residuo]?.c) }
      ], c2, "No hay pesajes con estos filtros.")}</div>
    <div class="grid g2" style="align-items:start">
      <div class="tarjeta"><div class="tarjeta-cab"><h2>Sectores con más reportes</h2><span class="meta">Consulta 3</span></div>
        ${tabla([
          { t: "Sector", f: (x) => `<b>${esc(x.sector)}</b><div class="suave" style="font-size:13px">${esc(x.municipio)}</div>` },
          { t: "Reportes", f: (x) => barraDato(x.total_reportes, max3, x.total_reportes, "var(--naranja)") },
          { t: "Alta", n: 1, f: (x) => x.prioridad_alta }
        ], c3, "No hay reportes con estos filtros.")}
        <div id="pm-mapa" class="mapa"></div></div>
      <div class="tarjeta"><div class="tarjeta-cab"><h2>Empresas con reportes sin resolver</h2><span class="meta">Consulta 4 · corte hoy</span></div>
        ${tabla([
          { t: "Empresa", f: (x) => `<b>${esc(x.empresa)}</b><div class="suave" style="font-size:13px">${x.sectores.map(esc).join(", ")}</div>` },
          { t: "Pendientes", f: (x) => barraDato(x.pendientes, max4, x.pendientes, "var(--rojo)") },
          { t: "Días (prom.)", n: 1, f: (x) => num(x.dias_promedio_abierto, 1) }
        ], c4, "No hay reportes pendientes.")}</div>
    </div>
  </div>`;
  const cambiar = () => { f.id_empresa = $("#pf-emp").value; f.zona = $("#pf-zona").value; f.mes = $("#pf-mes").value; render(); };
  ["#pf-emp", "#pf-zona", "#pf-mes"].forEach((s) => ($(s).onchange = cambiar));
  $("#pf-limpiar").onclick = () => { Object.assign(f, { mes: "todos", id_empresa: "", zona: "" }); render(); };
  const m = crearMapa($("#pm-mapa"));
  if (m && c3.length) {
    const pts = c3.map((x) => { L.circle([x.coordenadas[1], x.coordenadas[0]], { radius: 250 + x.total_reportes * 220, color: "#d9822b", weight: 1, fillColor: "#d9822b", fillOpacity: .4 }).bindPopup(`<b>${esc(x.sector)}</b><br>${x.total_reportes} reportes`).addTo(m); return [x.coordenadas[1], x.coordenadas[0]]; });
    m.fitBounds(pts, { padding: [40, 40], maxZoom: 14 });
  }
}

let filtroAdminRep = "todos";
function vAdminReportes(v) {
  const u = usuarioActual();
  const todos = [...DB.reportes].sort((a, b) => b.fecha_hora - a.fecha_hora);
  const lista = filtroAdminRep === "todos" ? todos : todos.filter((r) => r.estado === filtroAdminRep);
  v.innerHTML = `
  <div class="titulo"><div class="pre">Administrador</div><h1>Todos los reportes</h1><p>Reportes de todas las empresas. El administrador también puede cambiar su estado.</p></div>
  <div class="filtros">${["todos", ...ESTADOS].map((e) => `<button class="filtro" data-f="${e}" aria-pressed="${e === filtroAdminRep}">${e === "todos" ? "Todos" : ESTADO_TXT[e]} <span class="suave">${e === "todos" ? todos.length : todos.filter((r) => r.estado === e).length}</span></button>`).join("")}</div>
  <div class="tarjeta">${tablaReportes(lista, { conEmpresa: true })}</div>`;
  $$("[data-f]").forEach((b) => (b.onclick = () => { filtroAdminRep = b.dataset.f; render(); }));
  enlazarCambiosDeEstado(u);
}

// ---------- Consultas del negocio (las 5 del script, con su sentencia) ----------
const SENTENCIAS = {
1: `db.sectores.aggregate([
  { $geoNear: {
      near: { type: "Point", coordinates: [{lng}, {lat}] },
      distanceField: "distancia_m", maxDistance: {max}, spherical: true } },
  { $lookup: { from: "rutas", localField: "_id",
               foreignField: "sectores", as: "ruta" } },
  { $unwind: "$ruta" },
  { $lookup: { from: "empresas", localField: "ruta.id_empresa",
               foreignField: "_id", as: "empresa" } },
  { $unwind: "$empresa" },
  { $project: {
      _id: 0,
      sector: "$nombre",
      distancia_m: { $round: ["$distancia_m", 0] },
      ruta: "$ruta.codigo",
      tipo_residuo: "$ruta.tipo_residuo",
      empresa: "$empresa.nombre",
      dias: "$ruta.horarios.dia",
      franja: { $concat: [ { $first: "$ruta.horarios.hora_inicio" }, " - ",
                           { $first: "$ruta.horarios.hora_fin" } ] } } }
])`,
2: `db.registros_residuos.aggregate([
  { $match: { fecha: { $gte: ISODate("{desde}T00:00:00-05:00"),
                       $lt:  ISODate("{hasta}T00:00:00-05:00") } } },
  { $group: { _id: { empresa: "$id_empresa", tipo: "$tipo_residuo" },
              total_kg: { $sum: "$cantidad_kg" }, recolecciones: { $sum: 1 } } },
  { $lookup: { from: "empresas", localField: "_id.empresa",
               foreignField: "_id", as: "empresa" } },
  { $unwind: "$empresa" },
  { $project: { _id: 0, empresa: "$empresa.nombre", tipo_residuo: "$_id.tipo",
                recolecciones: "$recolecciones",
                toneladas: { $round: [ { $divide: ["$total_kg", 1000] }, 2 ] } } },
  { $sort: { toneladas: -1 } }
])`,
3: `db.reportes.aggregate([
  { $match: { estado: { $ne: "rechazado" } } },
  { $group: { _id: "$id_sector",
              total_reportes: { $sum: 1 },
              prioridad_alta: { $sum: { $cond: [{ $eq: ["$prioridad", "alta"] }, 1, 0] } },
              tipos: { $addToSet: "$tipo_novedad" } } },
  { $lookup: { from: "sectores", localField: "_id",
               foreignField: "_id", as: "sector" } },
  { $unwind: "$sector" },
  { $project: { _id: 0, sector: "$sector.nombre", municipio: "$sector.municipio",
                total_reportes: "$total_reportes", prioridad_alta: "$prioridad_alta",
                tipos: "$tipos" } },
  { $sort: { total_reportes: -1, prioridad_alta: -1, sector: 1 } },
  { $limit: {limite} }
])`,
4: `const corte = ISODate("{corte}T23:59:59-05:00");
db.reportes.aggregate([
  { $match: { estado: { $in: ["reportado", "en_revision", "en_proceso"] } } },
  { $lookup: { from: "sectores", localField: "id_sector",
               foreignField: "_id", as: "sector" } },
  { $unwind: "$sector" },
  { $group: { _id: "$id_empresa",
              pendientes: { $sum: 1 },
              dias_promedio_abierto: { $avg: { $dateDiff: {
                  startDate: "$fecha_hora", endDate: corte, unit: "day" } } },
              sectores: { $addToSet: "$sector.nombre" },
              estados: { $push: "$estado" } } },
  { $lookup: { from: "empresas", localField: "_id",
               foreignField: "_id", as: "empresa" } },
  { $unwind: "$empresa" },
  { $project: { _id: 0, empresa: "$empresa.nombre", pendientes: "$pendientes",
                dias_promedio_abierto: { $round: ["$dias_promedio_abierto", 1] },
                sectores: "$sectores", estados: "$estados",
                canal_pqr: "$empresa.canal_pqr" } },
  { $sort: { pendientes: -1, dias_promedio_abierto: -1 } }
])`,
5: `db.usuarios.aggregate([
  { $match: { rol: "ciudadano", activo: true } },
  { $lookup: { from: "reportes", localField: "_id",
               foreignField: "id_usuario", as: "reportes" } },
  { $lookup: { from: "sectores", localField: "id_sector",
               foreignField: "_id", as: "sector" } },
  { $unwind: "$sector" },
  { $project: {
      _id: 0,
      ciudadano: { $concat: ["$nombres", " ", "$apellidos"] },
      sector: { $concat: ["$sector.nombre", " (", "$sector.municipio", ")"] },
      eco_puntos: "$eco_puntos",
      reportes_enviados: { $size: "$reportes" },
      reportes_resueltos: { $size: { $filter: {
          input: "$reportes", as: "r",
          cond: { $eq: ["$$r.estado", "resuelto"] } } } } } },
  { $sort: { eco_puntos: -1, reportes_enviados: -1 } }
])`
};
const CONSULTAS = {
  1: { titulo: "Rutas cercanas a la ubicación del ciudadano", cols: "sectores + rutas + empresas",
       objetivo: "Con la ubicación GPS del ciudadano (Cra. 33 con Calle 48, Cabecera), $geoNear usa el índice 2dsphere para encontrar los sectores a menos de 1,5 km. Luego, con $lookup, trae las rutas que cubren cada sector y la empresa que las opera." },
  2: { titulo: "Toneladas por empresa y tipo de residuo", cols: "registros_residuos + empresas",
       objetivo: "Filtra los pesajes del mes, los agrupa por empresa y tipo de residuo ($group) y suma los kilogramos. Después trae el nombre de la empresa con $lookup. Es el indicador principal del panel de las empresas." },
  3: { titulo: "Sectores con más reportes ciudadanos", cols: "reportes + sectores",
       objetivo: "Excluye los reportes rechazados y cuenta, por sector, el total de reportes, cuántos son de prioridad alta y qué tipos de novedad se han reportado. Es la base del mapa de calor de puntos críticos." },
  4: { titulo: "Empresas con más reportes sin resolver", cols: "reportes + sectores + empresas",
       objetivo: "Toma los reportes en estado reportado, en revisión o en proceso, y por empresa calcula cuántos tiene pendientes, el promedio de días abiertos ($dateDiff), los sectores afectados y su canal de PQR." },
  5: { titulo: "Ranking de EcoPuntos", cols: "usuarios + reportes + sectores",
       objetivo: "Toma los ciudadanos activos y, con $lookup, trae sus reportes y su sector de residencia. Cuenta los reportes enviados y los resueltos con $filter." }
};
const estadoConsultas = { n: 1, lng: -73.1080, lat: 7.1190, max: 1500, mes: "2026-10", limite: 5, corte: "2026-10-31", col: "empresas" };

function vConsultas(v) {
  const e = estadoConsultas, n = e.n;
  const subtabs = `<div class="subtabs" role="tablist">${[1, 2, 3, 4, 5].map((i) => `<button class="filtro" data-n="${i}" aria-pressed="${n === i}">Consulta ${i}</button>`).join("")}<button class="filtro" data-n="db" aria-pressed="${n === "db"}">${ico("db", 'style="width:16px;height:16px"')}Colecciones</button></div>`;
  if (n === "db") return vColecciones(v, subtabs);
  const c = CONSULTAS[n];
  let params = {}, controles = "";
  if (n === 1) {
    params = { lng: e.lng, lat: e.lat, max: e.max };
    controles = `<label class="campo"><span>Punto</span><select id="q-punto">${[["-73.1080,7.1190", "Cra. 33 con Calle 48 (Cabecera)"], ["-73.1180,7.1270", "San Francisco"], ["-73.1095,7.0965", "Provenza"], ["-73.1010,7.0705", "Cañaveral (Floridablanca)"], ["-73.1550,7.0750", "El Poblado (Girón)"]].map(([val, t]) => `<option value="${val}" ${val === `${e.lng.toFixed(4)},${e.lat.toFixed(4)}` ? "selected" : ""}>${t}</option>`).join("")}</select></label>
      <label class="campo"><span>maxDistance</span><select id="q-max">${[500, 1000, 1500, 3000, 6000].map((m) => `<option value="${m}" ${m === e.max ? "selected" : ""}>${num(m)} m</option>`).join("")}</select></label>`;
  } else if (n === 2) {
    const [a, m] = e.mes.split("-").map(Number);
    params = { mes: e.mes, desde: `${e.mes}-01`, hasta: m === 12 ? `${a + 1}-01-01` : `${a}-${String(m + 1).padStart(2, "0")}-01` };
    controles = `<label class="campo"><span>Mes</span><select id="q-mes">${[...new Set(["2026-10", ...mesesConDatos()])].sort().map((x) => `<option value="${x}" ${x === e.mes ? "selected" : ""}>${nombreMes(x)}</option>`).join("")}</select></label>`;
  } else if (n === 3) {
    params = { limite: e.limite };
    controles = `<label class="campo"><span>$limit</span><select id="q-lim">${[3, 5, 10].map((l) => `<option ${l === e.limite ? "selected" : ""}>${l}</option>`).join("")}</select></label>`;
  } else if (n === 4) {
    params = { corte: e.corte };
    controles = `<label class="campo"><span>Fecha de corte</span><input type="date" id="q-corte" value="${e.corte}" min="2026-10-31"></label>`;
  }
  const fn = [null, consulta1, consulta2, consulta3, consulta4, consulta5][n];
  const t0 = performance.now(), res = fn(params), ms = performance.now() - t0;
  let sentencia = SENTENCIAS[n];
  for (const [k, val] of Object.entries(params)) sentencia = sentencia.replaceAll(`{${k}}`, k === "lng" || k === "lat" ? Number(val).toFixed(4) : val);
  v.innerHTML = `
  <div class="titulo"><div class="pre">Administrador · Bases de datos</div><h1>Consultas del negocio</h1>
    <p>Las 5 consultas de 03_ECORUTA_CONSULTAS.js ejecutadas sobre los datos actuales de la aplicación. Si registras pesajes o cambias reportes, los resultados cambian.</p></div>
  ${subtabs}
  <div class="tarjeta pad" style="margin-bottom:16px"><h2 style="margin-bottom:4px">Consulta ${n}: ${c.titulo}</h2>
    <div style="margin-bottom:8px"><span class="etq mono">${c.cols}</span></div><p class="suave" style="margin:0">${c.objetivo}</p>
    ${controles ? `<div class="filtros" style="margin:14px 0 0;align-items:flex-end">${controles}</div>` : ""}</div>
  <div class="tarjeta" style="margin-bottom:16px"><div class="tarjeta-cab"><h2>Resultado</h2><span class="meta">${res.length} documento${res.length === 1 ? "" : "s"} · ${num(ms, 1)} ms</span></div>
    ${tablaResultado(n, res)}${n === 1 ? `<div id="q-mapa" class="mapa"></div>` : ""}</div>
  <details class="codigo" open><summary>Sentencia en MongoDB</summary><pre>${esc(sentencia)}</pre></details>`;
  $$("[data-n]").forEach((b) => (b.onclick = () => { e.n = b.dataset.n === "db" ? "db" : Number(b.dataset.n); render(); }));
  if (n === 1) {
    $("#q-punto").onchange = (ev) => { const [lng, lat] = ev.target.value.split(",").map(Number); Object.assign(e, { lng, lat }); render(); };
    $("#q-max").onchange = (ev) => { e.max = Number(ev.target.value); render(); };
    const m = crearMapa($("#q-mapa"));
    if (m) {
      const circ = L.circle([e.lat, e.lng], { radius: e.max, color: "#d9822b", weight: 1, fillOpacity: .05 }).addTo(m);
      punto(m, [e.lng, e.lat], "#d9822b", "Ubicación del ciudadano", 9);
      [...new Map(res.map((x) => [x.sector, x])).values()].forEach((x) => punto(m, x.coordenadas, "#2e7d32", `<b>${esc(x.sector)}</b> · ${num(x.distancia_m)} m`));
      m.fitBounds(circ.getBounds());
    }
  }
  if (n === 2) $("#q-mes").onchange = (ev) => { e.mes = ev.target.value; render(); };
  if (n === 3) $("#q-lim").onchange = (ev) => { e.limite = Number(ev.target.value); render(); };
  if (n === 4) $("#q-corte").onchange = (ev) => { if (ev.target.value >= "2026-10-31") { e.corte = ev.target.value; render(); } };
}

function tablaResultado(n, res) {
  const lista = (a) => a.map((x) => `<span class="etq">${esc(x)}</span>`).join("");
  const C = {
    1: [{ t: "sector", f: (x) => `<b>${esc(x.sector)}</b>` }, { t: "distancia_m", n: 1, f: (x) => num(x.distancia_m) }, { t: "ruta", f: (x) => `<span class="nowrap">${esc(x.ruta)}</span>` }, { t: "tipo_residuo", f: (x) => bolsa(x.tipo_residuo) }, { t: "empresa", f: (x) => esc(x.empresa) }, { t: "dias", f: (x) => lista(x.dias.map((d) => DIA_TXT[d] || d)) }, { t: "franja", f: (x) => `<span class="nowrap">${esc(x.franja)}</span>` }],
    2: [{ t: "empresa", f: (x) => `<b>${esc(x.empresa)}</b>` }, { t: "tipo_residuo", f: (x) => bolsa(x.tipo_residuo) }, { t: "recolecciones", n: 1, f: (x) => x.recolecciones }, { t: "toneladas", n: 1, f: (x) => num(x.toneladas, 2) }],
    3: [{ t: "sector", f: (x) => `<b>${esc(x.sector)}</b>` }, { t: "municipio", f: (x) => esc(x.municipio) }, { t: "total_reportes", n: 1, f: (x) => x.total_reportes }, { t: "prioridad_alta", n: 1, f: (x) => x.prioridad_alta }, { t: "tipos", f: (x) => lista(x.tipos) }],
    4: [{ t: "empresa", f: (x) => `<b>${esc(x.empresa)}</b>` }, { t: "pendientes", n: 1, f: (x) => x.pendientes }, { t: "dias_promedio_abierto", n: 1, f: (x) => num(x.dias_promedio_abierto, 1) }, { t: "sectores", f: (x) => lista(x.sectores) }, { t: "estados", f: (x) => lista(x.estados) }, { t: "canal_pqr", f: (x) => esc(x.canal_pqr) }],
    5: [{ t: "ciudadano", f: (x) => `<b>${esc(x.ciudadano)}</b>` }, { t: "sector", f: (x) => esc(x.sector) }, { t: "eco_puntos", n: 1, f: (x) => x.eco_puntos }, { t: "reportes_enviados", n: 1, f: (x) => x.reportes_enviados }, { t: "reportes_resueltos", n: 1, f: (x) => x.reportes_resueltos }]
  };
  return tabla(C[n], res, "La consulta no devolvió documentos.");
}

function vColecciones(v, subtabs) {
  const e = estadoConsultas, docs = DB[e.col];
  const campos = [...new Set(docs.flatMap((d) => Object.keys(d)))];
  const valor = (x) => x instanceof Date ? `<span class="nowrap">${x.toISOString().slice(0, 16).replace("T", " ")}</span>`
    : typeof x === "string" && x.startsWith("data:") ? "[foto]"
    : x && typeof x === "object" ? `<span class="mono">${esc(JSON.stringify(x, (k, y) => (typeof y === "string" && y.startsWith("data:") ? "[foto]" : y)))}</span>` : esc(x);
  v.innerHTML = `
  <div class="titulo"><div class="pre">Administrador · Bases de datos</div><h1>Consultas del negocio</h1><p>Documentos actuales de cada colección.</p></div>
  ${subtabs}
  <div class="filtros">${Object.keys(DB).map((c) => `<button class="filtro" data-col="${c}" aria-pressed="${c === e.col}">${c} <span class="suave">${DB[c].length}</span></button>`).join("")}</div>
  <div class="tarjeta"><div class="tarjeta-cab"><h2 class="mono" style="font-size:14px">db.${e.col}.find()</h2><span class="meta">${docs.length} documentos</span></div>
    ${tabla(campos.map((k) => ({ t: k, f: (d) => (d[k] === undefined ? "" : valor(d[k])) })), docs)}</div>`;
  $$("[data-n]").forEach((b) => (b.onclick = () => { e.n = b.dataset.n === "db" ? "db" : Number(b.dataset.n); render(); }));
  $$("[data-col]").forEach((b) => (b.onclick = () => { e.col = b.dataset.col; render(); }));
}

// ---------- Gestión: empresas, sectores y rutas ----------
let pestanaGestion = "rutas";
function vGestion(v) {
  const p = pestanaGestion;
  const tabs = `<div class="filtros">${[["rutas", "Rutas", DB.rutas.length], ["empresas", "Empresas", DB.empresas.length], ["sectores", "Sectores", DB.sectores.length]].map(([k, t, c]) => `<button class="filtro" data-g="${k}" aria-pressed="${k === p}">${t} <span class="suave">${c}</span></button>`).join("")}</div>`;
  let lista = "", form = "";
  if (p === "rutas") {
    lista = tabla([
      { t: "Código", f: (r) => `<b class="nowrap">${esc(r.codigo)}</b>` },
      { t: "Empresa", f: (r) => esc(nombreEmpresa(r.id_empresa)) },
      { t: "Sectores", f: (r) => r.sectores.map((s) => `<span class="etq">${esc(buscar("sectores", s)?.nombre)}</span>`).join("") },
      { t: "Residuo", f: (r) => bolsa(r.tipo_residuo) },
      { t: "Horario", f: (r) => `${r.horarios.map((h) => DIA_CORTO[h.dia]).join(" ")} · <span class="nowrap">${r.horarios[0].hora_inicio}–${r.horarios[0].hora_fin}</span>` },
      { t: "Activa", f: (r) => `<button class="btn chico ${r.activa ? "sec" : "peligro"}" data-alt="rutas" data-id="${r._id}">${r.activa ? "Sí" : "No"}</button>` }
    ], DB.rutas);
    form = `<form class="form" id="f-g" novalidate><h2>Nueva ruta</h2>
      <div class="fila"><label class="campo"><span>Código</span><input id="g-codigo" maxlength="10" placeholder="BGA-NO-01"></label>
        <label class="campo"><span>Empresa</span><select id="g-emp"><option value="">Elige</option>${DB.empresas.filter((e) => e.activa).map((e) => `<option value="${e._id}">${esc(e.nombre)}</option>`).join("")}</select></label></div>
      <div class="fila"><label class="campo"><span>Zona</span><select id="g-zona">${ZONAS.map((z) => `<option>${z}</option>`).join("")}</select></label>
        <label class="campo"><span>Tipo de residuo</span><select id="g-tipo">${TIPOS_RES.map((t) => `<option value="${t}">${TIPO[t].txt}</option>`).join("")}</select></label></div>
      <div class="campo"><span>Sectores que cubre</span><div class="checks">${DB.sectores.map((s) => `<label><input type="checkbox" name="g-sec" value="${s._id}">${esc(s.nombre)}</label>`).join("")}</div></div>
      <div class="campo"><span>Días</span><div class="checks">${DIAS.map((d) => `<label><input type="checkbox" name="g-dia" value="${d}">${DIA_TXT[d]}</label>`).join("")}</div></div>
      <div class="fila"><label class="campo"><span>Hora de inicio</span><input type="time" id="g-ini" value="06:00"></label><label class="campo"><span>Hora de fin</span><input type="time" id="g-fin" value="10:00"></label></div>
      <div id="g-err"></div><button class="btn" type="submit">${ico("mas")}Crear ruta</button></form>`;
  } else if (p === "empresas") {
    lista = tabla([
      { t: "Empresa", f: (e) => `<b>${esc(e.nombre)}</b><div class="suave mono">NIT ${esc(e.nit)}</div>` },
      { t: "Municipios", f: (e) => e.municipios.map((m) => `<span class="etq">${m}</span>`).join("") },
      { t: "Contacto", f: (e) => `${esc(e.telefono)}<div class="suave" style="font-size:13px">${esc(e.correo)}</div>` },
      { t: "Canal PQR", f: (e) => esc(e.canal_pqr) },
      { t: "Rutas", n: 1, f: (e) => DB.rutas.filter((r) => r.id_empresa === e._id).length },
      { t: "Activa", f: (e) => `<button class="btn chico ${e.activa ? "sec" : "peligro"}" data-alt="empresas" data-id="${e._id}">${e.activa ? "Sí" : "No"}</button>` }
    ], DB.empresas);
    form = `<form class="form" id="f-g" novalidate><h2>Nueva empresa prestadora</h2>
      <div class="fila"><label class="campo"><span>NIT</span><input id="g-nit" placeholder="900123456-7" maxlength="11"></label><label class="campo"><span>Razón social</span><input id="g-nombre" maxlength="100"></label></div>
      <div class="campo"><span>Municipios donde presta el servicio</span><div class="checks">${MUNICIPIOS.map((m) => `<label><input type="checkbox" name="g-mun" value="${m}">${m}</label>`).join("")}</div></div>
      <div class="fila"><label class="campo"><span>Teléfono</span><input id="g-tel" maxlength="15"></label><label class="campo"><span>Correo</span><input id="g-correo" type="email" maxlength="100"></label></div>
      <label class="campo"><span>Canal oficial de PQR</span><input id="g-pqr" maxlength="150" placeholder="URL, correo o línea de atención"></label>
      <div id="g-err"></div><button class="btn" type="submit">${ico("mas")}Crear empresa</button></form>`;
  } else {
    lista = tabla([
      { t: "Sector", f: (s) => `<b>${esc(s.nombre)}</b>` },
      { t: "Municipio", f: (s) => esc(s.municipio) },
      { t: "Zona", f: (s) => esc(s.zona) },
      { t: "Coordenadas", f: (s) => `<span class="mono">${s.ubicacion.coordinates.map((c) => c.toFixed(4)).join(", ")}</span>` },
      { t: "Rutas", f: (s) => DB.rutas.filter((r) => r.sectores.includes(s._id)).map((r) => `<span class="etq">${esc(r.codigo)}</span>`).join("") || '<span class="suave">Sin ruta</span>' }
    ], DB.sectores);
    form = `<form class="form" id="f-g" novalidate><h2>Nuevo sector</h2>
      <label class="campo"><span>Nombre del barrio o sector</span><input id="g-nombre" maxlength="80"></label>
      <div class="fila"><label class="campo"><span>Municipio</span><select id="g-mun">${MUNICIPIOS.map((m) => `<option>${m}</option>`).join("")}</select></label><label class="campo"><span>Zona</span><select id="g-zona">${ZONAS.map((z) => `<option>${z}</option>`).join("")}</select></label></div>
      <div class="fila"><label class="campo"><span>Longitud</span><input id="g-lng" type="number" step="0.0001" placeholder="-73.1200"></label><label class="campo"><span>Latitud</span><input id="g-lat" type="number" step="0.0001" placeholder="7.1200"></label></div>
      <small class="suave">Haz clic en el mapa para tomar las coordenadas.</small><div id="g-mapa" class="mapa" style="height:240px;border-radius:12px"></div>
      <div id="g-err"></div><button class="btn" type="submit">${ico("mas")}Crear sector</button></form>`;
  }
  v.innerHTML = `
  <div class="titulo"><div class="pre">Administrador</div><h1>Gestión del servicio</h1><p>Empresas prestadoras, sectores y rutas de recolección.</p></div>
  ${tabs}
  <div class="gestion">
    <div class="tarjeta" style="min-width:0">${lista}</div>
    <div class="tarjeta pad">${form}</div>
  </div>`;
  $$("[data-g]").forEach((b) => (b.onclick = () => { pestanaGestion = b.dataset.g; render(); }));
  $$("[data-alt]").forEach((b) => (b.onclick = () => { OPS.alternar(b.dataset.alt, b.dataset.id, b.dataset.alt === "rutas" || b.dataset.alt === "empresas" ? "activa" : "activo"); render(); }));
  const val = (id) => $("#" + id)?.value || "";
  const marcados = (n) => $$(`input[name=${n}]:checked`).map((x) => x.value);
  if (p === "sectores") {
    const m = crearMapa($("#g-mapa"), [7.1, -73.12], 11);
    if (m) { let mk; m.on("click", (ev) => { $("#g-lat").value = ev.latlng.lat.toFixed(4); $("#g-lng").value = ev.latlng.lng.toFixed(4); if (mk) mk.remove(); mk = L.marker(ev.latlng).addTo(m); }); }
  }
  $("#f-g").onsubmit = (ev) => {
    ev.preventDefault();
    const r = intentar(() => p === "rutas"
      ? OPS.crearRuta({ codigo: val("g-codigo"), id_empresa: val("g-emp"), sectores: marcados("g-sec"), zona: val("g-zona"), tipo_residuo: val("g-tipo"), dias: marcados("g-dia"), hora_inicio: val("g-ini"), hora_fin: val("g-fin") })
      : p === "empresas"
      ? OPS.crearEmpresa({ nit: val("g-nit"), nombre: val("g-nombre"), municipios: marcados("g-mun"), telefono: val("g-tel"), correo: val("g-correo"), canal_pqr: val("g-pqr") })
      : OPS.crearSector({ nombre: val("g-nombre"), municipio: val("g-mun"), zona: val("g-zona"), lng: val("g-lng"), lat: val("g-lat") }), $("#g-err"));
    if (r) { aviso("Guardado correctamente"); render(); }
  };
}

function vUsuarios(v) {
  const admin = usuarioActual();
  const orden = { administrador: 0, operador: 1, ciudadano: 2 };
  const lista = [...DB.usuarios].sort((a, b) => orden[a.rol] - orden[b.rol] || a.nombres.localeCompare(b.nombres));
  v.innerHTML = `
  <div class="titulo"><div class="pre">Administrador</div><h1>Usuarios y roles</h1><p>Cambia el rol de un usuario, asocia los operadores a su empresa o desactiva una cuenta.</p></div>
  <div class="tarjeta">${tabla([
    { t: "Usuario", f: (u) => `<b>${esc(nombre(u))}</b><div class="suave" style="font-size:13px">${esc(u.correo)}</div>` },
    { t: "Rol", f: (u) => `<select data-rol="${u._id}" style="padding:7px;border-radius:8px;border:1px solid #d6d0c3">${["ciudadano", "operador", "administrador"].map((r) => `<option ${r === u.rol ? "selected" : ""}>${r}</option>`).join("")}</select>` },
    { t: "Empresa (operador)", f: (u) => `<select data-emp="${u._id}" style="padding:7px;border-radius:8px;border:1px solid #d6d0c3;max-width:220px" ${u.rol !== "operador" ? "disabled" : ""}><option value="">—</option>${DB.empresas.map((e) => `<option value="${e._id}" ${e._id === u.id_empresa ? "selected" : ""}>${esc(e.nombre)}</option>`).join("")}</select>` },
    { t: "Sector", f: (u) => esc(u.id_sector ? buscar("sectores", u.id_sector)?.nombre : "—") },
    { t: "EcoPuntos", n: 1, f: (u) => (u.rol === "ciudadano" ? num(u.eco_puntos) : "—") },
    { t: "Activo", f: (u) => `<input type="checkbox" data-act="${u._id}" ${u.activo ? "checked" : ""} style="width:20px;height:20px;accent-color:var(--verde)">` },
    { t: "", f: (u) => `<button class="btn chico" data-guardar="${u._id}">Guardar</button>` }
  ], lista)}</div>`;
  $$("[data-rol]").forEach((s) => (s.onchange = () => { $(`[data-emp="${s.dataset.rol}"]`).disabled = s.value !== "operador"; }));
  $$("[data-guardar]").forEach((b) => (b.onclick = () => {
    const id = b.dataset.guardar;
    intentar(() => { OPS.actualizarUsuario(admin, id, { rol: $(`[data-rol="${id}"]`).value, id_empresa: $(`[data-emp="${id}"]`).value, activo: $(`[data-act="${id}"]`).checked }); aviso("Usuario actualizado"); render(); });
  }));
}

function vContenidos(v) {
  const admin = usuarioActual();
  const COLOR = { blanco: "Bolsa blanca", negro: "Bolsa negra", verde: "Bolsa verde" };
  const lista = [...DB.contenidos_educativos].sort((a, b) => b.fecha_publicacion - a.fecha_publicacion);
  v.innerHTML = `
  <div class="titulo"><div class="pre">Administrador</div><h1>Contenido educativo</h1><p>Publica contenidos sobre separación en la fuente. Aparecen de inmediato en "Aprende" para los ciudadanos.</p></div>
  <div class="grid g2" style="align-items:start">
    <form class="tarjeta pad form" id="f-con" novalidate><h2>Nuevo contenido</h2>
      <label class="campo"><span>Título</span><input id="c-tit" maxlength="150"></label>
      <label class="campo"><span>Color de bolsa</span><select id="c-cat">${Object.entries(COLOR).map(([k, t]) => `<option value="${k}">${t}</option>`).join("")}</select></label>
      <label class="campo"><span>Texto</span><textarea id="c-txt" maxlength="5000"></textarea></label>
      <label class="campo"><span>Palabras clave</span><input id="c-pal" placeholder="Separadas por coma: pilas, posconsumo"><small>Máximo 10. Se usan en la búsqueda (índice de texto).</small></label>
      <div id="c-err"></div><button class="btn" type="submit">${ico("mas")}Publicar</button></form>
    <div class="tarjeta">${tabla([
      { t: "Título", f: (c) => `<b>${esc(c.titulo)}</b>` },
      { t: "Bolsa", f: (c) => `<span class="etq">${COLOR[c.categoria]}</span>` },
      { t: "Publicado", f: (c) => `<span class="nowrap">${fFecha(c.fecha_publicacion)}</span>` },
      { t: "Autor", f: (c) => esc(nombre(buscar("usuarios", c.id_autor))) }
    ], lista)}</div>
  </div>`;
  $("#f-con").onsubmit = (e) => {
    e.preventDefault();
    const c = intentar(() => OPS.publicarContenido(admin, { titulo: $("#c-tit").value, categoria: $("#c-cat").value, texto: $("#c-txt").value, palabras_clave: $("#c-pal").value }), $("#c-err"));
    if (c) { aviso("Contenido publicado"); render(); }
  };
}

function vAuditoria(v) {
  const lista = [...DB.auditoria].sort((a, b) => b.fecha - a.fecha);
  const txt = (o) => (o ? Object.entries(o).map(([k, x]) => `${k}: ${k === "estado" ? ESTADO_TXT[x] || x : x}`).join(", ") : "—");
  v.innerHTML = `
  <div class="titulo"><div class="pre">Administrador</div><h1>Auditoría</h1><p>Cambios sobre reportes y registros de residuos: quién, qué y cuándo (RN08).</p>
    <div style="margin-top:12px"><button class="btn peligro chico" id="reiniciar">Restablecer los datos de prueba</button></div></div>
  <div class="tarjeta">${tabla([
    { t: "Fecha", f: (a) => `<span class="nowrap">${fFechaHora(a.fecha)}</span>` },
    { t: "Usuario", f: (a) => esc(nombre(buscar("usuarios", a.id_usuario))) },
    { t: "Colección", f: (a) => `<span class="mono">${esc(a.coleccion)}</span>` },
    { t: "Acción", f: (a) => `<span class="etq">${esc(a.accion)}</span>` },
    { t: "Documento", f: (a) => { const r = a.coleccion === "reportes" ? buscar("reportes", a.id_documento) : null; return r ? caso(r) : `<span class="mono">…${esc(a.id_documento.slice(-6))}</span>`; } },
    { t: "Antes", f: (a) => esc(txt(a.valor_anterior)) },
    { t: "Después", f: (a) => esc(txt(a.valor_nuevo)) }
  ], lista)}</div>`;
  $("#reiniciar").onclick = async () => {
    if (!(await confirmar("¿Restablecer los datos de prueba?", "Se borran los reportes, pesajes y cambios hechos en este navegador y se cargan de nuevo los datos de 02_ECORUTA_DATOS.js.", "Restablecer"))) return;
    reiniciarDB(); aviso("Datos de prueba restablecidos"); render();
  };
}

// =====================================================================
//  NAVEGACIÓN
// =====================================================================
const MENUS = {
  ciudadano: [["inicio", "Inicio", "casa", vInicioCiudadano], ["rutas", "Rutas", "mapa", vRutas], ["reportar", "Reportar", "megafono", vReportar],
    ["mis-reportes", "Mis reportes", "lista", vMisReportes], ["ecopuntos", "EcoPuntos", "medalla", vEcoPuntos], ["aprende", "Aprende", "libro", vAprende]],
  operador: [["inicio", "Reportes", "lista", vOpReportes], ["pesaje", "Registrar pesaje", "bascula", vOpPesaje], ["rutas", "Rutas", "mapa", vRutas]],
  administrador: [["inicio", "Panel", "grafica", vPanel], ["consultas", "Consultas", "db", vConsultas], ["reportes", "Reportes", "lista", vAdminReportes],
    ["gestion", "Gestión", "ajustes", vGestion], ["usuarios", "Usuarios", "usuarios", vUsuarios], ["contenidos", "Contenidos", "libro", vContenidos], ["auditoria", "Auditoría", "escudo", vAuditoria]]
};

function leerRuta() {
  const [ruta, qs] = (location.hash.replace(/^#\/?/, "") || "inicio").split("?");
  return { ruta, q: Object.fromEntries(new URLSearchParams(qs || "")) };
}

function render() {
  mapasActivos.forEach((m) => m.remove()); mapasActivos = [];
  const { ruta, q } = leerRuta();
  const menu = MENUS[ROL];
  const item = menu.find((x) => x[0] === ruta) || menu[0];
  const enlaces = menu.map(([k, t, i]) => `<a href="#/${k}" class="${k === item[0] ? "activo" : ""}" ${k === item[0] ? 'aria-current="page"' : ""}>${ico(i)}<span>${t}</span></a>`).join("");
  $("#menu").innerHTML = enlaces;
  $("#menu-movil").innerHTML = ROL === "ciudadano" ? enlaces : "";
  document.body.classList.toggle("con-menu-movil", ROL === "ciudadano");
  $("#rol").value = ROL;
  const v = $("#vista");
  item[3](v, q);
  v.insertAdjacentHTML("beforeend", `<p class="pie">EcoRuta · Prototipo con datos de prueba · David Angarita y Santiago Brito · UNAB</p>`);
  document.title = `${item[1]} · EcoRuta`;
}

$("#rol").onchange = (e) => {
  ROL = e.target.value;
  try { localStorage.setItem(CLAVE_SESION, ROL); } catch (err) {}
  location.hash = "#/inicio";
  render();
  aviso(`Ahora ves EcoRuta como ${nombre(usuarioActual())} (${ROL})`);
};
window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); });
render();
