import Constants from "expo-constants";

/* Dirección de la API del sistema Grupo Condado.

   Hay dos formas de resolverla, en este orden:

   1. La variable EXPO_PUBLIC_API_URL, si está definida en el archivo
      .env. Expo expone al bundle todas las que empiezan con
      EXPO_PUBLIC_. Sirve para apuntar a un túnel (Cloudflare, ngrok)
      cuando la red local no alcanza — por ejemplo en la facultad, donde
      la WiFi aísla los dispositivos entre sí.

   2. Si no está, se deduce la IP de la PC del host del servidor de Expo.
      Cuando Metro imprime "exp://192.168.1.40:8081", esa IP es la de la
      computadora. Así cada integrante corre el proyecto sin configurar
      nada mientras esté en una red normal.

   El archivo .env no se versiona: cada uno tiene el suyo. En
   .env.example está el formato. */

const PUERTO_API = 56153;
const TIMEOUT_MS = 10000;

function hostDeDesarrollo() {
  const uri =
    Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost ?? "";
  const host = String(uri).split(":")[0];
  return host || "localhost";
}

function resolverUrl() {
  const configurada = process.env.EXPO_PUBLIC_API_URL;
  if (configurada && configurada.trim()) {
    return configurada.trim().replace(/\/+$/, "");
  }
  return `http://${hostDeDesarrollo()}:${PUERTO_API}/api`;
}

export const API_URL = resolverUrl();

export const MSG_SIN_API =
  "No pudimos conectarnos con el servidor. Verificá que la API esté " +
  "corriendo en Visual Studio y que el celular esté en la misma red WiFi.";

/* Cliente HTTP compartido por todos los servicios.

   - fetch no tiene timeout propio: si el servidor no contesta ni rechaza
     (un firewall que descarta paquetes en silencio), la promesa queda
     pendiente para siempre. AbortController corta la espera.
   - fetch solo lanza cuando no se pudo llegar al servidor. Un 404 o un
     500 no pasan por el catch: se revisa respuesta.ok aparte.
   - Los POST/PUT/DELETE del backend están declarados void y responden
     204 sin cuerpo: ahí no hay JSON que leer. */
export async function pedir(ruta, { method = "GET", body } = {}) {
  const url = `${API_URL}${ruta}`;
  const controlador = new AbortController();
  const reloj = setTimeout(() => controlador.abort(), TIMEOUT_MS);

  let respuesta;
  try {
    respuesta = await fetch(url, {
      method,
      signal: controlador.signal,
      headers: body ? { "Content-Type": "application/json; charset=utf-8" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    if (e.name === "AbortError") {
      throw new Error(
        `El servidor no respondió en ${TIMEOUT_MS / 1000} segundos.\n\n` +
          `URL: ${url}\n` +
          "Puede que el firewall de la PC esté bloqueando el puerto 56153."
      );
    }
    throw new Error(`${MSG_SIN_API}\n\nURL: ${url}\nDetalle: ${e.message}`);
  } finally {
    clearTimeout(reloj);
  }

  if (!respuesta.ok) {
    throw new Error(`El servidor respondió ${respuesta.status}.\n\nURL: ${url}`);
  }

  if (respuesta.status === 204) return null;
  const texto = await respuesta.text();
  return texto ? JSON.parse(texto) : null;
}
