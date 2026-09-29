import { pedir } from "./api";

export async function obtenerPropiedades() {
  const datos = await pedir("/Propiedad");
  return Array.isArray(datos) ? datos : [];
}

// El GET por id también devuelve un array de una fila
export async function obtenerPropiedad(id) {
  const datos = await pedir(`/Propiedad/${id}`);
  const fila = Array.isArray(datos) ? datos[0] : datos;
  if (!fila) {
    throw new Error("No encontramos esa propiedad. Puede que ya no esté publicada.");
  }
  return fila;
}
