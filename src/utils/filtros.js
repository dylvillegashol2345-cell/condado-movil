import { TIPOS, localidadLabel } from "./catalogos";

export const TODOS = "todos";

export const OPCIONES_TIPO = [
  { id: TODOS, label: "Todas" },
  ...Object.entries(TIPOS).map(([id, nombre]) => ({ id: Number(id), label: `${nombre}s` })),
];

export const OPCIONES_PRECIO = [
  { id: TODOS, label: "Cualquier precio" },
  { id: "hasta100", label: "Hasta 100.000", min: 0, max: 100000 },
  { id: "100a200", label: "100.000 a 200.000", min: 100000, max: 200000 },
  { id: "mas200", label: "Más de 200.000", min: 200000, max: Infinity },
];

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
