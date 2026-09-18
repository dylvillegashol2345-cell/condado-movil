# Condado Móvil

Aplicación móvil del proyecto ABP de la materia Aplicaciones Móviles.

## Descripción y problemática

**Condado Móvil** es la aplicación para clientes de **Grupo Condado**, la
inmobiliaria del Trabajo Final / Tesis del grupo. El sistema web ya existente
resuelve la gestión interna —propiedades, contratos, pagos, comisiones y
reportes—; esta app cubre el otro lado del mostrador: **la persona que busca
una propiedad para comprar o alquilar**.

La problemática que aborda: buscar vivienda es un proceso opaco. Los avisos
muestran precio, ambientes y fotos, pero nada sobre **cuánto va a costar
mantener esa casa**. El desempeño energético —aislación térmica, paneles
solares— queda invisible al momento de decidir, aunque impacte durante años
en las expensas y en el consumo del hogar.

Condado Móvil pone ese dato al frente. Cada propiedad muestra su **clase
energética (A, B o C)** junto al precio, calculada con las mismas reglas de
negocio del sistema de gestión, y las propiedades clase A acceden a una
bonificación del 15%.

## Integrantes

- Bustos, Tomás
- Díaz, Bruno
- Escudero, Mauricio
- Heredia, Máximo
- Villegas, Dylan

## Features

Con 5 integrantes el alcance mínimo son 6 features. Se planificaron 7 para
tener margen. **Las 7 están terminadas.**

| # | Feature | Estado |
|---|---|---|
| 1 | Consultar el catálogo de propiedades | 🟢 Terminada — FlatList conectado a la API |
| 2 | Buscar propiedades por texto | 🟢 Terminada — barrio, calle, localidad y tipo |
| 3 | Filtrar propiedades por tipo, localidad y rango de precio | 🟢 Terminada — chips combinables, filtrado local sobre el caché |
| 4 | Consultar el detalle de una propiedad | 🟢 Terminada — ruta dinámica con ficha ambiental |
| 5 | Gestionar propiedades favoritas | 🟢 Terminada — Zustand + persistencia en el dispositivo |
| 6 | Solicitar una visita a una propiedad | 🟢 Terminada — formulario con `useMutation`, llega a la base como Consulta |
| 7 | Comparar propiedades (hasta 3, lado a lado) | 🟢 Terminada — resalta el mejor valor de cada fila, con precio por m² |

**Referencias:** ⚪ Pendiente · 🟡 En curso · 🟢 Terminada

## Avance por unidad

### Unidad 1 — Base visual con datos estáticos

Pantalla principal del catálogo resuelta con `View`, `Text`, `Image` y
`ScrollView`, sobre un archivo de datos escritos a mano. Tres componentes
reutilizables comunicados por props:

- **`PropiedadCard`** — representa una propiedad del catálogo. Recibe todos
  sus datos por props, así que no sabe de dónde vienen.
- **`EtiquetaEco`** — etiqueta de clase energética, con color según la letra.
- **`Encabezado`** — cabecera de marca con el contador de propiedades.

Los datos estáticos se escribieron con **la misma estructura de columnas que
la tabla `Propiedad` de la base**, incluido el PascalCase. Fue una decisión
deliberada: al conectar la API en la Unidad 2, ningún componente necesitó
cambiar. Ese archivo se eliminó al quedar sin uso; queda en el historial de
git, en el tag `unidad-1`.

### Unidad 2 — Listas, búsqueda y datos reales

- `ScrollView` reemplazado por **`FlatList`**, que renderiza solo los
  elementos visibles en pantalla.
- **Conexión con la API real** del sistema Grupo Condado, con `useEffect`,
  `try/catch/finally` y `ActivityIndicator` mientras carga.
- **Buscador por texto** con `useState`, el primer estado del proyecto.
  Ignora tildes: buscar "cosquin" encuentra Cosquín.
- **`SinResultados`** cuando la búsqueda no arroja coincidencias y
  **`ErrorCarga`** con botón de reintentar si no se llega al servidor.

La clase energética no viene en los datos: se calcula en tiempo de render con
`calcularClaseEnergetica()` de `src/utils/reglas.js`, que es la regla RN1 del
sistema Grupo Condado copiada sin cambios desde el proyecto web.

### Unidad 3 — Estado, caché y filtros

- **TanStack Query** reemplaza el `useEffect` + `useState` + `fetch` manual.
  Un `useQuery` entrega `data`, `isLoading` y `error` resueltos, y cachea:
  volver del detalle al catálogo no vuelve a pedir la lista.
- **Filtros por tipo, localidad y rango de precio**, con el patrón de chips de
  la Clase 3: `useState` + `TouchableOpacity`. `FiltroChips` es un componente
  controlado que se reutiliza tres veces. Las localidades se arman con las que
  realmente tienen propiedades. El filtrado es local, sobre los datos cacheados.
- Los filtros se combinan entre sí y con el buscador. Si nada coincide, el
  estado vacío ofrece volver a ver todas las propiedades.
- **Favoritos con Zustand.** El store guarda la lista de ids y la persiste en
  el dispositivo con AsyncStorage, así sobrevive al cierre de la app. El
  corazón de cada card, el del detalle, el contador del header y la pantalla
  de favoritos leen el mismo store sin pasarse props: es el caso contra el
  prop drilling que plantea la Clase 4. La pantalla de favoritos reutiliza
  `PropiedadCard` y la misma `queryKey` del catálogo, así que no pide nada
  nuevo a la API.
- Marcar o desmarcar nunca muta el arreglo: `filter` y spread devuelven uno
  nuevo (la inmutabilidad de la Clase 2).
- **Vista por localidad con `SectionList`.** Un selector de vista —también
  hecho con `FiltroChips`— alterna entre la lista plana (`FlatList`) y los
  mismos ítems agrupados bajo un encabezado por localidad (`SectionList`), con
  el contador de cada sección. Las dos vistas comparten el header, los filtros,
  el estado vacío y el mismo `PropiedadCard`: un componente, dos listas.
- **Solicitar una visita.** Primera pantalla que *escribe* en el sistema: un
  formulario con validación (`useState`) que envía por `useMutation`, el
  complemento de `useQuery` para mutaciones. Expone `isPending` y `error`
  igual que las lecturas. Al enviar, la app muestra confirmación; si la API
  falla, el error queda en pantalla y se puede reintentar.

  La solicitud viaja como **`Consulta`, no como `Cita`**. `Cita` es el turno
  interno del sistema: exige un cliente ya cargado y un agente asignado, cosas
  que quien mira el catálogo no tiene. `Consulta` es el punto de entrada
  documentado en PP1: la inmobiliaria la recibe, la deriva y recién ahí crea
  la cita. El mensaje lleva el día y horario preferidos, y
  `PropiedadInteres` la dirección completa con el ID.
- **Comparar propiedades.** Un toggle "Comparar" en cada card suma hasta tres
  a un segundo store de Zustand (sin persistencia: una comparación es algo
  del momento). Una barra flotante al pie del catálogo lleva a la pantalla de
  comparación, que pone las elegidas lado a lado y **resalta el mejor valor de
  cada fila**: menor precio, mayor superficie, mejor clase energética. Si todas
  empatan, no resalta nada. Agrega una métrica que no está en los datos, el
  **precio por m²**, que es lo que permite comparar una casa de 240 m² con un
  departamento de 62. Todo es local: no pide nada a la API.

## Stack

- Expo SDK 57 + Expo Router
- React Native 0.86 · React 19
- JavaScript (sin TypeScript)
- styled-components/native + ThemeProvider
- @expo/vector-icons
- TanStack Query (react-query) y Zustand
- AsyncStorage para persistir los favoritos

## Cómo correr el proyecto

```bash
npm install
```

```bash
npx expo start
```

Escanear el código QR con **Expo Go** desde un celular conectado a la **misma
red WiFi** que la computadora. Si la red aísla los dispositivos entre sí,
usar `npx expo start --tunnel`.

En PowerShell de Windows, si aparece un error de ejecución de scripts, usar
`npx.cmd expo start` en lugar de `npx expo start`.

### La API tiene que estar corriendo

**Sin la API la app muestra la pantalla de error de conexión.** Los datos
salen del sistema Grupo Condado, no de un archivo.

1. Abrir la solución `GestionPropiedades` en Visual Studio y ejecutar el
   proyecto `WebApi` (IIS Express, puerto 56153).
2. Para que el celular la alcance, IIS Express necesita un binding con la IP
   de la PC en la red. En `applicationhost.config`, dentro del sitio `WebApi`:

   ```xml
   <binding protocol="http" bindingInformation="*:56153:localhost" />
   <binding protocol="http" bindingInformation="*:56153:192.168.x.x" />
   ```

   IIS Express no acepta comodines: hay que nombrar la IP explícitamente.
3. Abrir el puerto 56153 en el firewall de Windows.
4. Visual Studio debe correr **como administrador**: registrar una URL que no
   sea `localhost` requiere privilegios elevados.

La app **no tiene la IP escrita en el código**: la deduce del host del
servidor de Expo (`src/services/api.js`). Así cada integrante corre el
proyecto sin editar nada y sigue funcionando cuando el router reparte otra IP.

## Estructura

```
src/
├── app/                     Pantallas (Expo Router)
│   ├── _layout.jsx          Layout raíz: ThemeProvider + Stack
│   ├── index.jsx            Pantalla principal — catálogo, búsqueda y filtros
│   ├── favoritos.jsx        Propiedades marcadas como favoritas
│   ├── comparar.jsx         Comparación lado a lado de hasta 3 propiedades
│   ├── propiedad/
│   │   └── [id].jsx         Detalle de una propiedad (ruta dinámica)
│   └── visita/
│       └── [id].jsx         Formulario de solicitud de visita
├── components/
│   ├── PropiedadCard.jsx    Componente reutilizable principal
│   ├── EtiquetaEco.jsx      Etiqueta de clase energética
│   ├── BotonFavorito.jsx    Corazón que lee y modifica el store
│   ├── BotonComparar.jsx    Toggle para sumar a la comparación (tope 3)
│   ├── BarraComparar.jsx    Barra flotante que lleva a la comparación
│   ├── FichaAmbiental.jsx   Desempeño ambiental (reglas RN1 y RN2)
│   ├── Encabezado.jsx       Cabecera de marca
│   ├── Buscador.jsx         Campo de búsqueda (componente controlado)
│   ├── FiltroChips.jsx      Fila de chips de filtro (componente controlado)
│   ├── SinResultados.jsx    Estado vacío de la búsqueda
│   └── ErrorCarga.jsx       Error de conexión con botón de reintentar
├── services/
│   ├── api.js               Dirección de la API y cliente HTTP con timeout
│   ├── propiedades.js       GET api/Propiedad y GET api/Propiedad/{id}
│   └── consultas.js         POST api/Consulta (solicitud de visita)
├── store/
│   ├── favoritos.js         Store de Zustand con persistencia
│   └── comparar.js          Store de Zustand para la comparación (sin persistir)
├── theme/
│   └── theme.js             Paleta terracota de Grupo Condado
└── utils/
    ├── reglas.js            Reglas de negocio RN1–RN5 del sistema
    ├── catalogos.js         Tipos de propiedad y localidades
    ├── format.js            Formato de precios y superficies
    ├── filtros.js           Opciones y lógica de los filtros del catálogo
    ├── secciones.js         Agrupa propiedades por localidad para SectionList
    └── imagenes.js          Normalización de las rutas de imagen
```
