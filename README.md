# EcoRuta

Aplicación web de EcoRuta, el sistema de gestión y educación en residuos sólidos del área metropolitana de Bucaramanga.
Tiene tres roles: ciudadano, operador de empresa y administrador.

Es un sitio estático. No necesita servidor, base de datos ni compilación: se abre `index.html` y funciona.

## Cómo probarla

En el encabezado hay un selector para cambiar de rol. Cada rol abre la cuenta de prueba correspondiente de `02_ECORUTA_DATOS.js`:

| Rol | Usuario | Qué puede hacer |
|---|---|---|
| Ciudadano | Andrea Ortiz Vargas (Cabecera del Llano) | Ver la próxima recolección, consultar rutas por barrio o por GPS, reportar novedades con foto y ubicación, seguir sus reportes, ver sus EcoPuntos y el contenido de "Aprende a separar" |
| Operador | Carlos Rueda Plata (EcoAseo Bucaramanga) | Atender los reportes de su empresa paso a paso y registrar el pesaje de sus rutas |
| Administrador | Laura Méndez Rojas | Ver el panel de indicadores con filtros, ejecutar las 5 consultas, ver los reportes y gestionar empresas, sectores, rutas, usuarios, contenidos y la auditoría |

Los cambios (reportes nuevos, pesajes, estados) se guardan en el navegador. Para volver a los datos originales usa **Administrador → Auditoría → Restablecer los datos de prueba**.

## Archivos

| Archivo | Contenido |
|---|---|
| `index.html` | Estructura de la página |
| `estilos.css` | Diseño (adaptado a celular y computador) |
| `datos.js` | El script `02_ECORUTA_DATOS.js` sin cambios, más unas líneas que simulan `ObjectId`, `ISODate` e `insertMany` para que corra en el navegador |
| `db.js` | Base de datos del navegador: aplica las reglas de `01_ECORUTA_OBJETOS.js` (valores permitidos, índices únicos), el flujo de estados del reporte, los EcoPuntos y la auditoría |
| `consultas.js` | Las 5 consultas de `03_ECORUTA_CONSULTAS.js`, escritas etapa por etapa ($geoNear, $match, $group, $lookup, $dateDiff, $filter…) |
| `app.js` | Pantallas de los tres roles |

## Dónde se usan las 5 consultas

| Consulta | Dónde aparece |
|---|---|
| 1. Rutas cercanas ($geoNear) | Ciudadano → Rutas → "Usar mi ubicación" |
| 2. Toneladas por empresa y tipo | Administrador → Panel |
| 3. Sectores con más reportes | Administrador → Panel (con mapa) |
| 4. Reportes sin resolver por empresa | Administrador → Panel |
| 5. Ranking de EcoPuntos | Ciudadano → EcoPuntos |

En **Administrador → Consultas** están las 5, con su sentencia de MongoDB y su resultado sobre los datos actuales.

## Publicar en Vercel

### Opción A: con GitHub (sin instalar nada)
1. En github.com crea un repositorio nuevo, por ejemplo `ecoruta`.
2. Entra en **Add file → Upload files**, arrastra todos los archivos de esta carpeta y pulsa **Commit changes**.
3. En vercel.com entra en **Add New… → Project**, importa el repositorio y pulsa **Deploy**.
   No cambies nada: el Framework Preset es "Other" y no lleva comando de compilación.
4. Vercel te da la URL, por ejemplo `ecoruta.vercel.app`.

### Opción B: con la terminal (si tienes Node.js)
```
cd ecoruta
npx vercel --prod
```

Con la URL de Vercel (https), el celular sí deja usar el GPS y la cámara.
