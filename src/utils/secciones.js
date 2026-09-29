import { localidadLabel } from "./catalogos";

export function agruparPorLocalidad(propiedades) {
  const porLocalidad = new Map();

  for (const p of propiedades) {
    const clave = p.IdLocalidad;
    if (!porLocalidad.has(clave)) porLocalidad.set(clave, []);
    porLocalidad.get(clave).push(p);
  }

  return [...porLocalidad.entries()]
    .map(([id, data]) => ({ title: localidadLabel(id), data }))
    .sort((a, b) => a.title.localeCompare(b.title));
}
