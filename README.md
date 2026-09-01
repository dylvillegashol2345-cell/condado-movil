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
| 1 | Consultar el catálogo de propiedades | 🟡 En curso — datos estáticos, falta conectar la API |
| 2 | Buscar propiedades por texto | ⚪ Pendiente |
| 3 | Filtrar propiedades por tipo, localidad y rango de precio | ⚪ Pendiente |
| 4 | Consultar el detalle de una propiedad | ⚪ Pendiente |
| 5 | Gestionar propiedades favoritas | ⚪ Pendiente |
| 6 | Solicitar una visita a una propiedad | ⚪ Pendiente |
| 7 | Comparar propiedades (hasta 3, lado a lado) | ⚪ Pendiente |

**Referencias:** ⚪ Pendiente · 🟡 En curso · 🟢 Terminada

## Avance de la Unidad 1

Primera versión del producto: pantalla principal con el catálogo de
propiedades, resuelta con datos estáticos.

- `View`, `Text`, `Image` y `ScrollView`
- Datos estáticos en `src/data/propiedades.js`
- Componentes reutilizables comunicados por props:
  - **`PropiedadCard`** — representa una propiedad del catálogo. Recibe todos
    sus datos por props, así que no sabe de dónde vienen; en la Unidad 2 pasa
    a consumir la API sin modificarse.
  - **`EtiquetaEco`** — etiqueta de clase energética, con color según la letra.
  - **`Encabezado`** — cabecera de marca de la pantalla.

La clase energética no está guardada en los datos: se calcula en tiempo de
render con `calcularClaseEnergetica()` de `src/utils/reglas.js`, que es la
regla RN1 del sistema Grupo Condado copiada sin cambios desde el proyecto web.

## Stack

- Expo SDK 54 + Expo Router
- React Native 0.81 · React 19
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

Escanear el código QR con la app **Expo Go** (SDK 54) desde un celular conectado a la
**misma red WiFi** que la computadora.

Si la red del lugar aísla los dispositivos entre sí, usar `npx expo start --tunnel`.

## Estructura

```
src/
├── app/                    Pantallas (Expo Router)
│   ├── _layout.jsx         Layout raíz: ThemeProvider + Stack
│   └── index.jsx           Pantalla principal — catálogo
├── components/
│   ├── PropiedadCard.jsx   Componente reutilizable principal
│   ├── EtiquetaEco.jsx     Etiqueta de clase energética
│   └── Encabezado.jsx      Cabecera de marca
├── data/
│   └── propiedades.js      Datos estáticos (Unidad 1)
├── theme/
│   └── theme.js            Paleta terracota de Grupo Condado
└── utils/
    ├── reglas.js           Reglas de negocio RN1–RN5
    ├── catalogos.js        Tipos, localidades
    └── format.js           Formato de precios y superficies
```
