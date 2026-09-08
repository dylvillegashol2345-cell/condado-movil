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
tener margen.

| # | Feature | Estado |
|---|---|---|
| 1 | Consultar el catálogo de propiedades | 🟢 Terminada — FlatList conectado a la API |
| 2 | Buscar propiedades por texto | 🟢 Terminada — barrio, calle, localidad y tipo |
| 3 | Filtrar propiedades por tipo, localidad y rango de precio | ⚪ Pendiente |
| 4 | Consultar el detalle de una propiedad | 🟢 Terminada — ruta dinámica con ficha ambiental |
| 5 | Gestionar propiedades favoritas | ⚪ Pendiente |
| 6 | Solicitar una visita a una propiedad | ⚪ Pendiente |
| 7 | Comparar propiedades (hasta 3, lado a lado) | ⚪ Pendiente |

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

## Stack

- Expo SDK 57 + Expo Router
- React Native 0.86 · React 19
- JavaScript (sin TypeScript)
- styled-components/native + ThemeProvider
- @expo/vector-icons

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
│   ├── index.jsx            Pantalla principal — catálogo y búsqueda
│   └── propiedad/
│       └── [id].jsx         Detalle de una propiedad (ruta dinámica)
├── components/
│   ├── PropiedadCard.jsx    Componente reutilizable principal
│   ├── EtiquetaEco.jsx      Etiqueta de clase energética
│   ├── FichaAmbiental.jsx   Desempeño ambiental (reglas RN1 y RN2)
│   ├── Encabezado.jsx       Cabecera de marca
│   ├── Buscador.jsx         Campo de búsqueda (componente controlado)
│   ├── SinResultados.jsx    Estado vacío de la búsqueda
│   └── ErrorCarga.jsx       Error de conexión con botón de reintentar
├── services/
│   ├── api.js               Dirección de la API, deducida del host de Expo
│   └── propiedades.js       GET api/Propiedad
├── theme/
│   └── theme.js             Paleta terracota de Grupo Condado
└── utils/
    ├── reglas.js            Reglas de negocio RN1–RN5 del sistema
    ├── catalogos.js         Tipos de propiedad y localidades
    ├── format.js            Formato de precios y superficies
    └── imagenes.js          Normalización de las rutas de imagen
```
