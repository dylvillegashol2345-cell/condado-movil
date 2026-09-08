import { API_URL, MSG_SIN_API } from "./api";

/* Acceso a las propiedades de la API.

   El backend devuelve DataTable, así que el JSON llega siempre como un
   array de objetos con las claves en PascalCase — las mismas que usaba
   el archivo de datos estáticos de la Unidad 1. Por eso los componentes
   no necesitan ningún cambio. */

export async function obtenerPropiedades() {
  let respuesta;

  try {
    respuesta = await fetch(`${API_URL}/Propiedad`);
  } catch {
    /* fetch solo lanza cuando no se pudo llegar al servidor: WiFi caída,
       API apagada, IP equivocada. Un 404 o un 500 no pasan por acá. */
    throw new Error(MSG_SIN_API);
  }

  if (!respuesta.ok) {
    throw new Error(`El servidor respondió ${respuesta.status}.`);
  }

  const datos = await respuesta.json();
  return Array.isArray(datos) ? datos : [];
}
