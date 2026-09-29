import Constants from "expo-constants";

const PUERTO_API = 56153;
const TIMEOUT_MS = 10000;

function hostDeDesarrollo() {
  const uri =
    Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost ?? "";
  const host = String(uri).split(":")[0];
  return host || "localhost";
}

// Si no hay .env, usa la IP de la PC donde corre Expo
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

export async function pedir(ruta, { method = "GET", body } = {}) {
  const url = `${API_URL}${ruta}`;
  const controlador = new AbortController();
  // fetch no tiene timeout propio
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

  // POST y PUT responden 204 sin cuerpo
  if (respuesta.status === 204) return null;
  const texto = await respuesta.text();
  return texto ? JSON.parse(texto) : null;
}
