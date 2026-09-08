import { API_URL, MSG_SIN_API } from "./api";

/* Acceso a las propiedades de la API.

   El backend devuelve DataTable, así que el JSON llega siempre como un
   array de objetos con las claves en PascalCase — las mismas que usaba
   el archivo de datos estáticos de la Unidad 1. Por eso los componentes
   no necesitan ningún cambio. */

const TIMEOUT_MS = 10000;

/* fetch no tiene timeout propio: si el servidor no contesta ni rechaza
   —por ejemplo cuando un firewall descarta los paquetes en silencio— la
   promesa queda pendiente para siempre y el spinner no se apaga nunca.
   AbortController corta la espera y la convierte en un error visible. */
async function fetchConTimeout(url) {
  const controlador = new AbortController();
  const reloj = setTimeout(() => controlador.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controlador.signal });
  } finally {
    clearTimeout(reloj);
  }
}

export async function obtenerPropiedades() {
  let respuesta;

  try {
    respuesta = await fetchConTimeout(`${API_URL}/Propiedad`);
  } catch (e) {
    if (e.name === "AbortError") {
      throw new Error(
        `El servidor no respondió en ${TIMEOUT_MS / 1000} segundos. ` +
          "Puede que el firewall de la PC esté bloqueando el puerto 56153."
      );
    }
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
