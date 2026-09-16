import { TIPOS, localidadLabel } from "./catalogos";

/* Filtros del catálogo: opciones y la función que los aplica.

   Todo es JavaScript puro, sin React: se puede probar sin levantar la
   app, y la pantalla solo decide qué mostrar. */

/* Valor especial que significa "sin filtrar" en cualquier dimensión. */
export const TODOS = "todos";

/* Tipos de propiedad, sacados del catálogo real (mismos ids que la base).
   "Casa" → "Casas": el plural sirve para las cuatro. */
export const OPCIONES_TIPO = [
  { id: TODOS, label: "Todas" },
  ...Object.entries(TIPOS).map(([id, nombre]) => ({ id: Number(id), label: `${nombre}s` })),
];

/* Rangos de precio. Se eligen chips y no un slider porque no hace falta
   ninguna librería extra, y para decidir "hasta cuánto puedo gastar"
   tres cortes alcanzan. */
export const OPCIONES_PRECIO = [
  { id: TODOS, label: "Cualquier precio" },
  { id: "hasta100", label: "Hasta 100.000", min: 0, max: 100000 },
  { id: "100a200", label: "100.000 a 200.000", min: 100000, max: 200000 },
  { id: "mas200", label: "Más de 200.000", min: 200000, max: Infinity },
];

/* Las localidades no son fijas: se arman con las que realmente tienen
   propiedades cargadas. No tiene sentido ofrecer "Jesús María" como filtro
   si no hay ninguna propiedad ahí. */
export function opcionesLocalidad(propiedades) {
  const ids = [...new Set(propiedades.map((p) => p.IdLocalidad))];
  const opciones = ids
    .map((id) => ({ id, label: localidadLabel(id) }))
    .sort((a, b) => a.label.localeCompare(b.label));
  return [{ id: TODOS, label: "Todas" }, ...opciones];
}

function enRango(precio, idRango) {
  if (idRango === TODOS) return true;
  const rango = OPCIONES_PRECIO.find((r) => r.id === idRango);
  if (!rango) return true;
  const valor = Number(precio) || 0;
  return valor >= rango.min && valor < rango.max;
}

/* Aplica los tres filtros a la vez. Cada condición es "o no hay filtro, o
   la propiedad lo cumple": así con todo en TODOS pasa la lista entera. */
export function aplicarFiltros(propiedades, { tipo, localidad, precio }) {
  return propiedades.filter(
    (p) =>
      (tipo === TODOS || p.IdTipo === tipo) &&
      (localidad === TODOS || p.IdLocalidad === localidad) &&
      enRango(p.Precio, precio)
  );
}

export function hayFiltrosActivos({ tipo, localidad, precio }) {
  return tipo !== TODOS || localidad !== TODOS || precio !== TODOS;
}
