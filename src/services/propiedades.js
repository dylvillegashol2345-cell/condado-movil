import { pedir } from "./api";

/* Acceso a las propiedades de la API.

   El backend devuelve DataTable, así que el JSON llega siempre como un
   array de objetos con las claves en PascalCase — las mismas que usaba
   el archivo de datos estáticos de la Unidad 1. Por eso los componentes
   no necesitan ningún cambio.

   Ojo con un detalle del backend: un GET por id también devuelve un
   array, de una sola fila, no un objeto suelto. */

export async function obtenerPropiedades() {
  const datos = await pedir("/Propiedad");
  return Array.isArray(datos) ? datos : [];
}

export async function obtenerPropiedad(id) {
  const datos = await pedir(`/Propiedad/${id}`);
  const fila = Array.isArray(datos) ? datos[0] : datos;
  if (!fila) {
    throw new Error("No encontramos esa propiedad. Puede que ya no esté publicada.");
  }
  return fila;
}
