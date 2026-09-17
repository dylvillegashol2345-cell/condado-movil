import { localidadLabel } from "./catalogos";

/* Agrupa propiedades por localidad con el formato que espera SectionList:
   un arreglo de secciones, cada una con title y data.

   A diferencia de FlatList, que recibe un arreglo plano, SectionList
   necesita los ítems ya agrupados bajo su encabezado. Esta función hace
   esa transformación y nada más: es JavaScript puro, sin React. */

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
