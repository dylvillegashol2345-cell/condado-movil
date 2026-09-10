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

function hostDeDesarrollo() {
  const uri =
    Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost ?? "";
  const host = String(uri).split(":")[0];
  return host || "localhost";
}

function resolverUrl() {
  const configurada = process.env.EXPO_PUBLIC_API_URL;
  if (configurada && configurada.trim()) {
    /* Se saca la barra final para que las rutas se concatenen sin
       terminar en dobles barras. */
    return configurada.trim().replace(/\/+$/, "");
  }
  return `http://${hostDeDesarrollo()}:${PUERTO_API}/api`;
}

export const API_URL = resolverUrl();

export const MSG_SIN_API =
  "No pudimos conectarnos con el servidor. Verificá que la API esté " +
  "corriendo en Visual Studio y que el celular esté en la misma red WiFi.";
